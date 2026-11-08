import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Uses an isolated browser profile and demo data, without touching the user's tabs.
const profile = await mkdtemp(join(tmpdir(), "ideation-browser-"));
const browserPath =
    process.env.BROWSER_PATH ||
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browser = spawn(
    browserPath,
    [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-first-run",
        "--no-default-browser-check",
        "--remote-debugging-port=0",
        `--user-data-dir=${profile}`,
        "about:blank",
    ],
    { windowsHide: true, stdio: "ignore" },
);
let socket;
let launchError;
browser.on("error", (error) => {
    launchError = error;
});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
    let port;
    for (let attempt = 0; attempt < 100; attempt++) {
        if (launchError) throw launchError;
        try {
            port = (
                await readFile(join(profile, "DevToolsActivePort"), "utf8")
            ).split("\n")[0];
            break;
        } catch {
            await delay(100);
        }
    }
    assert.ok(port, "Headless browser must start");
    const targets = await (
        await fetch(`http://127.0.0.1:${port}/json/list`)
    ).json();
    const target = targets.find(
        (item) => item.type === "page" && item.url === "about:blank",
    );
    assert.ok(target, "An isolated page must be available");
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        socket.onopen = resolve;
        socket.onerror = reject;
    });
    let id = 0;
    const pending = new Map();
    const pageErrors = [];
    socket.onmessage = ({ data }) => {
        const message = JSON.parse(data);
        if (message.method === "Runtime.exceptionThrown")
            pageErrors.push(message.params.exceptionDetails.text);
        const request = pending.get(message.id);
        if (request) {
            pending.delete(message.id);
            clearTimeout(request.timer);
            if (message.error)
                request.reject(new Error(JSON.stringify(message.error)));
            else request.resolve(message.result);
        }
    };
    const send = (method, params = {}) =>
        new Promise((resolve, reject) => {
            const key = ++id;
            const timer = setTimeout(() => {
                pending.delete(key);
                reject(new Error(`Timed out: ${method}`));
            }, 30000);
            pending.set(key, { resolve, reject, timer });
            socket.send(JSON.stringify({ id: key, method, params }));
        });
    const evaluate = async (expression) => {
        const result = await send("Runtime.evaluate", {
            expression,
            awaitPromise: true,
            returnByValue: true,
        });
        if (result.exceptionDetails)
            throw new Error(JSON.stringify(result.exceptionDetails));
        return result.result.value;
    };
    const waitFor = async (expression, label) => {
        for (let attempt = 0; attempt < 150; attempt++) {
            if (await evaluate(expression)) return;
            await delay(100);
        }
        await mkdir(".tmp-style-migration", { recursive: true });
        const failure = await send("Page.captureScreenshot", { format: "png" });
        await writeFile(
            ".tmp-style-migration/browser-failure.png",
            Buffer.from(failure.data, "base64"),
        );
        throw new Error(`Timed out waiting for ${label}`);
    };
    const click = async (expression) => {
        const point = await evaluate(
            `(()=>{const e=${expression};if(!e)throw new Error('Click target missing');let r=e.getBoundingClientRect();if(r.y<40||r.bottom>innerHeight)e.scrollIntoView({block:'center'});r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`,
        );
        assert.ok(
            point.x >= 0 && point.x < 1440 && point.y >= 0 && point.y < 1000,
            "Click target must be on screen",
        );
        await send("Input.dispatchMouseEvent", {
            type: "mouseMoved",
            ...point,
        });
        await waitFor(
            `(()=>{const e=${expression};if(!e||e.disabled)return false;const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})()`,
            "click target ready",
        );
        await send("Input.dispatchMouseEvent", {
            type: "mousePressed",
            ...point,
            button: "left",
            clickCount: 1,
        });
        await send("Input.dispatchMouseEvent", {
            type: "mouseReleased",
            ...point,
            button: "left",
            clickCount: 1,
        });
        await delay(300);
    };
    const button = (text) =>
        `Array.from(document.querySelectorAll('.constraints-drawer button')).find(e=>e.textContent.trim()===${JSON.stringify(
            text,
        )})`;
    const visibleOptions = `Array.from(document.querySelectorAll('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0 && r.x>=0 && r.right<=innerWidth && r.y>=0 && r.bottom<=innerHeight})`;
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 1000,
        deviceScaleFactor: 1,
        mobile: false,
    });

    for (const motion of process.env.VALIDATION_ONLY
        ? []
        : ["reduce", "no-preference"]) {
        await send("Emulation.setEmulatedMedia", {
            features: [{ name: "prefers-reduced-motion", value: motion }],
        });
        await send("Page.navigate", {
            url: `${process.env.APP_URL || "http://127.0.0.1:5181"}/leads`,
        });
        await waitFor(
            "!!document.querySelector('#focus-product') && !!document.querySelector('.idea-card')",
            "Leads page",
        );
        assert.equal(
            await evaluate("document.querySelector('#constraints').disabled"),
            true,
        );
        await click("document.querySelector('#focus-product')");
        await waitFor(
            `${visibleOptions}.length===4`,
            "four visible product options",
        );
        await click(`${visibleOptions}[0]`);
        await click("document.querySelector('#constraints')");
        await waitFor(
            "!!document.querySelector('.constraints-drawer .signal-card')",
            "signal drawer",
        );
        await click(
            "document.querySelector('.constraints-drawer .signal-card')",
        );
        assert.equal(
            await evaluate(
                "document.querySelector('.constraints-drawer .signal-card').getAttribute('aria-disabled')",
            ),
            "false",
        );
        await click(
            "document.querySelector('.constraints-drawer .signal-card')",
        );
        assert.equal(
            await evaluate(
                "document.querySelectorAll('.constraints-drawer .signal-card.selected').length",
            ),
            0,
        );
        assert.equal(await evaluate(`${button("Next Step")}.disabled`), true);
        await click(
            "document.querySelector('.constraints-drawer .signal-card')",
        );
        await click(button("Next Step"));
        await waitFor(
            "!!document.querySelector('.preference-form')",
            "optional preferences step",
        );
        await click(button("Complete Selection"));
        await waitFor(
            "!document.querySelector('.generate-button').disabled",
            "enabled Generate Ideas",
        );
        await click("document.querySelector('#constraints')");
        await waitFor(
            "!!document.querySelector('.constraints-drawer .signal-card.selected')",
            "saved signal restored on direct reopen",
        );
        await click(
            "document.querySelector('.constraints-drawer .ant-drawer-close')",
        );
        await waitFor(
            "!document.querySelector('.constraints-drawer')",
            "closed constraints drawer",
        );
        const before = await evaluate(
            "JSON.parse(localStorage.getItem('meridian:database:v1') || 'null')?.leads.length || 12",
        );
        await click("document.querySelector('.generate-button')");
        await waitFor(
            "!!document.querySelector('.tasks-panel') && !!document.querySelector('.generation-placeholder')",
            "generation progress and loading placeholder",
        );
        await waitFor(
            "!document.querySelector('.generation-placeholder') && !document.querySelector('.generate-button').disabled",
            "completed generation",
        );
        const after = await evaluate(
            "JSON.parse(localStorage.getItem('meridian:database:v1')).leads.length",
        );
        assert.equal(
            after,
            before + 3,
            "Generated FX ideas must be added without removing existing ideas",
        );
        assert.deepEqual(pageErrors, [], "No page runtime errors");
        console.log(
            `PASS (${motion}): 4 products → direct constraints drawer → save and reopen 1 signal → generate 3 ideas`,
        );
    }

    const appUrl = process.env.APP_URL || "http://127.0.0.1:5181";
    const pageButton = (label, scope = "document") =>
        `Array.from(${scope}.querySelectorAll('button')).find(e=>e.textContent.trim()===${JSON.stringify(label)})`;
    const modal =
        "document.querySelector('.ant-modal:not([style*=\"display: none\"])')";
    const inputText = async (selector, text) => {
        await evaluate(
            `(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.focus();Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(text)});e.dispatchEvent(new Event('input',{bubbles:true}))})()`,
        );
        await delay(100);
    };
    const screenshot = async (name) => {
        await mkdir(".tmp-style-migration", { recursive: true });
        const shot = await send("Page.captureScreenshot", { format: "png" });
        await writeFile(
            `.tmp-style-migration/${name}.png`,
            Buffer.from(shot.data, "base64"),
        );
    };
    await send("Page.navigate", { url: `${appUrl}/` });
    await waitFor(
        "location.pathname==='/dashboard' && !!document.querySelector('.dashboard-metric')",
        "default dashboard",
    );
    assert.equal(
        await evaluate(
            "document.querySelector('.nav-item.active').textContent.trim()",
        ),
        "Dashboard",
    );
    assert.ok(await evaluate("!!document.querySelector('.dashboard-tasks')"));
    await screenshot("dashboard");
    await click("document.querySelector('a.dashboard-metric[href*=cio]')");
    await waitFor(
        "document.querySelector('.ant-tabs-tab-active')?.textContent.includes('CIO Insights')",
        "CIO insights deep link",
    );
    await click("document.querySelector('.nav-item[href=\"/community\"]')");
    await waitFor("!!document.querySelector('.idea-card')", "Community cards");
    await click("document.querySelector('.idea-card .idea-actions button')");
    await waitFor(
        "!!document.querySelector('.copy-toast')",
        "bottom copy toast",
    );
    await delay(400);
    await screenshot("copy-toast");
    const toastBottom = await evaluate(
        "document.querySelector('.copy-toast').getBoundingClientRect().bottom",
    );
    assert.ok(
        toastBottom > 900 && toastBottom <= 1000,
        `Copy toast floats at the viewport bottom (actual bottom: ${toastBottom})`,
    );
    const copyId = await evaluate(
        "JSON.parse(localStorage.getItem('meridian:database:v1')).validation[0].id",
    );
    await click(pageButton("View", "document.querySelector('.copy-toast')"));
    await waitFor(
        `location.pathname==='/validation/${copyId}' && !!document.querySelector('.validation-title')`,
        "exact copied idea detail",
    );
    const originalTitle = await evaluate(
        "document.querySelector('.validation-title h1').textContent",
    );
    const originalDescription = await evaluate(
        "document.querySelector('.validation-section p').textContent",
    );
    assert.equal(
        await evaluate(
            "getComputedStyle(document.querySelector('.validation-composer')).position",
        ),
        "fixed",
    );
    await screenshot("validation-detail");
    await click(pageButton("Edit"));
    await waitFor(
        "!!document.querySelector('textarea[aria-label=\"Idea Description\"]')",
        "plain text edit mode",
    );
    assert.equal(
        await evaluate(
            "!!document.querySelector('textarea[aria-label=\"Primary CLCM Stage\"]')",
        ),
        false,
    );
    assert.equal(
        await evaluate(`${pageButton("Save Changes")}.disabled`),
        true,
    );
    await inputText(
        'textarea[aria-label="Idea Description"]',
        `${originalDescription} Updated for an individual advisory conversation.`,
    );
    await click("document.querySelector('.nav-item[href=\"/dashboard\"]')");
    await waitFor(
        "Array.from(document.querySelectorAll('.ant-modal-title')).some(e=>e.textContent==='Discard Changes?')",
        "unsaved navigation guard",
    );
    await click(pageButton("Keep Editing", modal));
    assert.ok(
        await evaluate(
            "!!document.querySelector('textarea[aria-label=\"Idea Description\"]')",
        ),
    );
    await click(pageButton("Save Changes"));
    await waitFor(
        "!!Array.from(document.querySelectorAll('.validation-title-actions button')).find(e=>e.textContent.trim()==='Edit')",
        "save complete",
    );
    assert.equal(
        await evaluate(
            "document.querySelector('.validation-title h1').textContent",
        ),
        originalTitle,
    );
    await click(pageButton("View Source Public Idea ›"));
    await waitFor(
        "!!document.querySelector('.validation-source-drawer .validation-section p')",
        "original source snapshot",
    );
    assert.equal(
        await evaluate(
            "document.querySelector('.validation-source-drawer .validation-section p').textContent",
        ),
        originalDescription,
    );
    await click(
        "document.querySelector('.validation-source-drawer .ant-drawer-close')",
    );
    await delay(400);
    await waitFor(
        "!document.querySelector('.validation-source-drawer .ant-drawer-mask')",
        "source drawer closed",
    );
    await click(pageButton("Change Log"));
    await waitFor(
        "!!document.querySelector('.validation-log .ant-tabs-tab-active')",
        "change log",
    );
    assert.equal(
        await evaluate(
            "document.querySelector('.validation-log .ant-tabs-tab-active').textContent",
        ),
        "Edit (1)",
    );
    await click(
        pageButton("Details", "document.querySelector('.validation-log')"),
    );
    await waitFor(
        "!!document.querySelector('.validation-diff ins')",
        "character diff highlights",
    );
    await screenshot("validation-diff");
    await click(
        pageButton("Close", "document.querySelector('.validation-diff')"),
    );
    await click("document.querySelector('.validation-log .ant-drawer-close')");
    await delay(400);
    await waitFor(
        "!document.querySelector('.validation-log .ant-drawer-mask')",
        "change log closed",
    );
    await click(
        "document.querySelector('textarea[aria-label=\"Add a comment\"]')",
    );
    assert.equal(
        await evaluate(
            "Math.round(document.querySelector('.validation-composer').getBoundingClientRect().height)",
        ),
        160,
    );
    await inputText(
        'textarea[aria-label="Add a comment"]',
        "Consider an advisory conversation before contacting the customer.",
    );
    await click(
        pageButton("Send", "document.querySelector('.validation-composer')"),
    );
    await waitFor(
        "!!document.querySelector('.validation-comment')",
        "newest comment",
    );
    await click(
        "document.querySelector('button[aria-label=\"Edit comment\"]')",
    );
    await inputText(
        'textarea[aria-label="Edit comment"]',
        "Updated advisory comment.",
    );
    await click(
        pageButton("Save", "document.querySelector('.comment-inline-edit')"),
    );
    await waitFor(
        "document.querySelector('.validation-comment p')?.textContent==='Updated advisory comment.'",
        "edited own comment",
    );
    await screenshot("validation-comments");
    await click(
        "document.querySelector('button[aria-label=\"Delete comment\"]')",
    );
    await waitFor(
        "!!document.querySelector('.ant-modal-title')",
        "delete comment confirmation",
    );
    await click(pageButton("Delete", modal));
    await waitFor(
        "!document.querySelector('.validation-comment')",
        "own comment deleted",
    );
    await click(pageButton("Validate"));
    await waitFor(
        "!!document.querySelector('.rating-dimension')",
        "rating modal",
    );
    // Empty optional dimensions submit a valid zero rating.
    await click(pageButton("Submit", modal));
    await waitFor(
        "document.querySelector('.validation-title .validation-status')?.textContent==='Validated 0.00 / 5'",
        "zero rating accepted",
    );
    assert.equal(await evaluate(`${pageButton("Edit")}.disabled`), true);
    await delay(500);
    await click(pageButton("Reopen Validation"));
    await waitFor(
        "!!document.querySelector('textarea[aria-label=\"Reason for reopening\"]')",
        "reopen modal",
    );
    await screenshot("validation-reopen");
    await click(pageButton("Reopen Validation", modal));
    await waitFor(
        "document.querySelector('.validation-title .validation-status')?.textContent==='Draft'",
        "reopened draft",
    );
    await delay(500);
    await click(pageButton("Edit"));
    await waitFor(
        "!!document.querySelector('textarea[aria-label=\"Idea Description\"]')",
        "reopened editing",
    );
    await inputText(
        'textarea[aria-label="Idea Description"]',
        "This unsaved change must be discarded.",
    );
    await click("document.querySelector('.nav-item[href=\"/validation\"]')");
    await waitFor(
        "Array.from(document.querySelectorAll('.ant-modal-title')).some(e=>e.textContent==='Discard Changes?')",
        "discard navigation dialog",
    );
    await click(pageButton("Discard Changes", modal));
    await waitFor(
        "location.pathname==='/validation' && !!document.querySelector('.idea-card')",
        "discard and return to list",
    );
    await waitFor(
        "!document.querySelector('.idea-card .validation-actions button[aria-label^=\"Editing by\"]')",
        "released edit lock in list",
    );
    const persistedCopy = await evaluate(
        `JSON.parse(localStorage.getItem('meridian:database:v1')).validation.find(e=>e.id==='${copyId}')`,
    );
    assert.ok(!persistedCopy.validation.lock);
    assert.ok(
        persistedCopy.description.includes(
            "Updated for an individual advisory conversation.",
        ),
    );
    assert.ok(!persistedCopy.description.includes("must be discarded"));
    const hiddenActions = await evaluate(
        "getComputedStyle(document.querySelector('.validation-actions')).opacity",
    );
    assert.equal(hiddenActions, "0");
    const cardPoint = await evaluate(
        "(()=>{const r=document.querySelector('.idea-card').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+20}})()",
    );
    await send("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        ...cardPoint,
    });
    await delay(150);
    assert.equal(
        await evaluate(
            "getComputedStyle(document.querySelector('.validation-actions')).opacity",
        ),
        "1",
    );
    await click(
        "document.querySelector('.idea-card button[aria-label^=\"Delete \"]')",
    );
    await waitFor(
        "!!document.querySelector('.ant-modal-title')",
        "delete copy confirmation",
    );
    await click(pageButton("Delete", modal));
    await waitFor(
        `!JSON.parse(localStorage.getItem('meridian:database:v1')).validation.some(e=>e.id==='${copyId}')`,
        "copy removed independently",
    );
    await click(
        "document.querySelector('.idea-card button[aria-label^=\"Edit \"]')",
    );
    await waitFor(
        "!!document.querySelector('textarea[aria-label=\"Idea Description\"]')",
        "editing directly from card",
    );
    assert.equal(
        await evaluate(`${pageButton("Save Changes")}.disabled`),
        true,
    );
    assert.equal(await evaluate(`${pageButton("Cancel")}.disabled`), true);
    await click(pageButton("Back to Validation"));
    await waitFor(
        "location.pathname==='/validation' && !!document.querySelector('.idea-card') && !document.querySelector('.validation-actions button[aria-label^=\"Editing by\"]')",
        "unchanged edit exits and releases lock",
    );
    for (const width of [1920, 760, 390]) {
        await send("Emulation.setDeviceMetricsOverride", {
            width,
            height: 1000,
            deviceScaleFactor: 1,
            mobile: width < 760,
        });
        await send("Page.navigate", { url: `${appUrl}/dashboard` });
        await waitFor(
            "!!document.querySelector('.dashboard-metric')",
            "responsive dashboard",
        );
        assert.ok(
            await evaluate("document.documentElement.scrollWidth<=innerWidth"),
            `No horizontal overflow at ${width}px`,
        );
        if (width === 390) await screenshot("dashboard-mobile");
        await send("Page.navigate", { url: `${appUrl}/validation/copy-1` });
        await waitFor(
            "!!document.querySelector('.validation-title')",
            "responsive Validation detail",
        );
        assert.ok(
            await evaluate("document.documentElement.scrollWidth<=innerWidth"),
            `Validation has no horizontal overflow at ${width}px`,
        );
        if (width === 390) await screenshot("validation-mobile");
    }
    assert.deepEqual(
        pageErrors,
        [],
        "No runtime errors in Dashboard or Validation",
    );
    console.log(
        "PASS: default Dashboard → CIO deep link → copy toast → exact Validation detail → immutable source → plain text save → diff → own comment CRUD → zero rating → reopen → unsaved guard → independent deletion → responsive layouts",
    );
} finally {
    socket?.close();
    browser.kill();
}
