import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
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
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" }
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
    (item) => item.type === "page" && item.url === "about:blank"
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
      }, 10000);
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
    throw new Error(`Timed out waiting for ${label}`);
  };
  const click = async (expression) => {
    const point = await evaluate(
      `(()=>{const e=${expression};if(!e)throw new Error('Click target missing');const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`
    );
    assert.ok(
      point.x >= 0 && point.x < 1440 && point.y >= 0 && point.y < 1000,
      "Click target must be on screen"
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
      text
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

  for (const motion of ["reduce", "no-preference"]) {
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: motion }],
    });
    await send("Page.navigate", {
      url: `${process.env.APP_URL || "http://127.0.0.1:5181"}/leads`,
    });
    await waitFor(
      "!!document.querySelector('#focus-product') && !!document.querySelector('.idea-card')",
      "Leads page"
    );
    assert.equal(
      await evaluate("document.querySelector('#constraints').disabled"),
      true
    );
    await click("document.querySelector('#focus-product')");
    await waitFor(
      `${visibleOptions}.length===4`,
      "four visible product options"
    );
    await click(`${visibleOptions}[0]`);
    await click("document.querySelector('#constraints')");
    await waitFor(
      "!!document.querySelector('.constraints-drawer .signal-card')",
      "signal drawer"
    );
    await click("document.querySelector('.constraints-drawer .signal-card')");
    await click(button("Next Step"));
    await waitFor(
      "!!document.querySelector('.preference-form')",
      "optional preferences step"
    );
    await click(button("Complete Selection"));
    await waitFor(
      "!document.querySelector('.generate-button').disabled",
      "enabled Generate Ideas"
    );
    await click("document.querySelector('#constraints')");
    await waitFor(
      "!!document.querySelector('.constraints-drawer .signal-card.selected')",
      "saved signal restored on direct reopen"
    );
    await click(
      "document.querySelector('.constraints-drawer .ant-drawer-close')"
    );
    await waitFor(
      "!document.querySelector('.constraints-drawer')",
      "closed constraints drawer"
    );
    const before = await evaluate(
      "JSON.parse(localStorage.getItem('meridian:database:v1') || 'null')?.leads.length || 12"
    );
    await click("document.querySelector('.generate-button')");
    await waitFor(
      "!!document.querySelector('.tasks-panel') && !!document.querySelector('.generation-placeholder')",
      "generation progress and loading placeholder"
    );
    await waitFor(
      "!document.querySelector('.generation-placeholder') && !document.querySelector('.generate-button').disabled",
      "completed generation"
    );
    const after = await evaluate(
      "JSON.parse(localStorage.getItem('meridian:database:v1')).leads.length"
    );
    assert.equal(
      after,
      before + 3,
      "Generated FX ideas must be added without removing existing ideas"
    );
    assert.deepEqual(pageErrors, [], "No page runtime errors");
    console.log(
      `PASS (${motion}): 4 products → direct constraints drawer → save and reopen 1 signal → generate 3 ideas`
    );
  }
} finally {
  socket?.close();
  browser.kill();
}
