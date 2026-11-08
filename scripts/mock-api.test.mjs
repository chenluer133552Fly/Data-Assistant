import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";

// Load the TypeScript service through the same transformer used by the app.
// The test storage is isolated from the browser's demo data.
const storage = new Map();
Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
    },
});
const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false },
    appType: "custom",
});
after(async () => {
    await server.close();
});
const { mockApi, getSkipConfirmation, setSkipConfirmation } =
    await server.ssrLoadModule("/src/common/services/mock-api.ts");
const { CURRENT_USER, customerSignals, marketSignals } =
    await server.ssrLoadModule("/src/common/mock-data.ts");

test("publish, duplicate protection, ownership, copy and deletion preserve independent records", async () => {
    let data = await mockApi.load();
    const source = data.leads.find(
        (idea) =>
            !data.community.some((record) => record.sourceId === idea.sourceId),
    );
    assert.ok(source);
    const initialCommunityCount = data.community.length;
    data = await mockApi.publish(source);
    assert.equal(data.community.length, initialCommunityCount + 1);
    const published = data.community.find(
        (idea) => idea.sourceId === source.sourceId,
    );
    assert.equal(published.authorId, CURRENT_USER.id);
    await assert.rejects(mockApi.publish(source), {
        code: "ALREADY_PUBLISHED",
    });
    const someoneElsesIdea = data.community.find(
        (idea) => idea.authorId !== CURRENT_USER.id,
    );
    await assert.rejects(mockApi.remove("community", someoneElsesIdea.id), {
        code: "FORBIDDEN",
    });
    data = await mockApi.copy(published);
    const copy = data.validation.find(
        (idea) => idea.sourceId === source.sourceId,
    );
    assert.equal(copy.copiedById, CURRENT_USER.id);
    assert.notEqual(copy.id, published.id);
    data = await mockApi.remove("leads", source.id);
    assert.ok(data.community.some((idea) => idea.id === published.id));
    assert.ok(data.validation.some((idea) => idea.id === copy.id));
    data = await mockApi.remove("community", published.id);
    assert.ok(data.validation.some((idea) => idea.id === copy.id));
    assert.equal(
        data.community.some((idea) => idea.id === published.id),
        false,
    );
    const persisted = JSON.parse(storage.get("meridian:database:v1"));
    assert.deepEqual(persisted, data);
});

test("generation accepts one signal and optional empty preferences, streams progress, and prepends unique ideas", async () => {
    const previous = await mockApi.load();
    const selection = {
        signalIds: [customerSignals[0].id],
        stages: [],
        channels: [],
        notes: "",
    };
    const events = [];
    for await (const event of mockApi.generate("Wealth", selection))
        events.push(event);
    assert.deepEqual(
        events.map((event) => event.step),
        [0, 1, 2, 3],
    );
    const generated = events.at(-1).ideas;
    assert.ok(generated.length);
    assert.equal(
        new Set(generated.map((idea) => idea.id)).size,
        generated.length,
    );
    assert.ok(
        generated.every(
            (idea) =>
                idea.product === "Wealth" &&
                idea.selection.signalIds[0] === selection.signalIds[0],
        ),
    );
    const next = await mockApi.load();
    assert.equal(next.leads.length, previous.leads.length + generated.length);
    assert.deepEqual(next.leads.slice(generated.length), previous.leads);
});

test("signal limit combines sources and invalid generation cannot modify the old list", async () => {
    const previous = await mockApi.load();
    for (const signalIds of [
        [],
        [...customerSignals.slice(0, 3), ...marketSignals.slice(0, 3)].map(
            (signal) => signal.id,
        ),
        ["unknown-signal"],
    ]) {
        await assert.rejects(
            async () => {
                for await (const event of mockApi.generate("FX", {
                    signalIds,
                    stages: [],
                    channels: [],
                    notes: "",
                }))
                    void event;
            },
            { code: "INVALID_SELECTION" },
        );
    }
    assert.deepEqual((await mockApi.load()).leads, previous.leads);
});

test("publish reminder preference is scoped to the current account", () => {
    assert.equal(getSkipConfirmation(), false);
    setSkipConfirmation();
    assert.equal(getSkipConfirmation(), true);
    assert.equal(
        storage.get(`meridian:skip-publish-confirmation:${CURRENT_USER.id}`),
        "true",
    );
    assert.equal(
        storage.has("meridian:skip-publish-confirmation:someone-else"),
        false,
    );
});

test("all four modules and the two separate detail routes render their main content", async () => {
    const { renderPage } = await server.ssrLoadModule(
        "/scripts/render-smoke.tsx",
    );
    for (const [path, expected] of [
        ["/intelligence", "Customer Signals"],
        ["/leads", "Focus Product"],
        ["/community", "Ideation Community"],
        ["/validation", "Copied by me"],
        ["/leads/lead-1", "Expected Conversion Estimate"],
        ["/community/public-1", "Expected Conversion Estimate"],
        ["/validation/copy-1", "View Source Public Idea"],
    ])
        assert.ok(
            renderPage(path).includes(expected),
            `${path} should render ${expected}`,
        );
    assert.ok(renderPage("/leads/missing").includes("Idea not found"));
});

test("Validation editing protects snapshots, read-only fields, revisions and edit locks", async () => {
    let data = await mockApi.load();
    data = await mockApi.copy(data.community[0]);
    const copy = data.validation[0];
    const original = structuredClone(copy.validation.source);
    const content = structuredClone(copy.validation.content);
    data = await mockApi.acquireEdit(copy.id, "session-a");
    await assert.rejects(mockApi.acquireEdit(copy.id, "session-b"), {
        code: "LOCKED",
    });
    await assert.rejects(mockApi.remove("validation", copy.id), {
        code: "LOCKED",
    });
    await assert.rejects(mockApi.rate(copy.id, [4, 4, 4]), { code: "LOCKED" });
    data = await mockApi.comment(
        copy.id,
        "add",
        "Comments remain available while editing.",
    );
    await assert.rejects(mockApi.saveEdit(copy.id, "session-a", 99, content), {
        code: "CONFLICT",
    });
    data = await mockApi.saveEdit(copy.id, "session-a", 0, {
        ...content,
        "Idea Description": "Revised advisory description.",
        "Primary CLCM Stage": "tampered",
        "Expected KPIs": "tampered",
    });
    const changed = data.validation.find((idea) => idea.id === copy.id);
    assert.deepEqual(changed.validation.source, original);
    assert.equal(changed.title, copy.title);
    assert.equal(changed.description, "Revised advisory description.");
    assert.equal(
        changed.validation.content["Primary CLCM Stage"],
        content["Primary CLCM Stage"],
    );
    assert.equal(
        changed.validation.content["Expected KPIs"],
        content["Expected KPIs"],
    );
    assert.equal(changed.validation.lock, undefined);
    assert.equal(changed.validation.revision, 1);
    const edits = changed.validation.logs.filter(
        (log) => log.action === "edit",
    );
    assert.equal(edits.length, 1);
    assert.deepEqual(edits[0].before, content);
    assert.equal(
        edits[0].after["Idea Description"],
        "Revised advisory description.",
    );
    assert.equal(
        data.community.find((idea) => idea.id === original.id).description,
        original.description,
    );
    await mockApi.acquireEdit(copy.id, "session-a");
    data = await mockApi.releaseEdit(copy.id, "session-a");
    assert.equal(
        data.validation
            .find((idea) => idea.id === copy.id)
            .validation.logs.filter((log) => log.action === "edit").length,
        1,
    );
});

test("ratings accept empty dimensions, half stars and truncation, lock editing and reopen without requiring a reason", async () => {
    let data = await mockApi.load();
    const id = data.validation[0].id;
    data = await mockApi.rate(id, [4.5, 4, 3]);
    let state = data.validation.find((idea) => idea.id === id).validation;
    assert.equal(state.rating.score, 3.83);
    assert.equal(state.status, "validated");
    await assert.rejects(mockApi.acquireEdit(id, "rating-lock"), {
        code: "VALIDATED",
    });
    data = await mockApi.rate(id, [0, 0, 0]);
    assert.equal(
        data.validation.find((idea) => idea.id === id).validation.rating.score,
        0,
    );
    for (const dimensions of [
        [6, 0, 0],
        [1.2, 0, 0],
        [NaN, 0, 0],
        [1, 2],
    ])
        await assert.rejects(mockApi.rate(id, dimensions), {
            code: "INVALID_RATING",
        });
    data = await mockApi.reopen(id, "");
    state = data.validation.find((idea) => idea.id === id).validation;
    assert.equal(state.status, "draft");
    assert.equal(state.rating, undefined);
    assert.ok(state.logs.some((log) => log.action === "reopen"));
    CURRENT_USER.canValidate = false;
    try {
        await assert.rejects(mockApi.rate(id, [4, 4, 4]), {
            code: "FORBIDDEN",
        });
        await assert.rejects(mockApi.reopen(id, ""), { code: "FORBIDDEN" });
        assert.equal((await mockApi.dashboard()).tasks.length, 0);
    } finally {
        CURRENT_USER.canValidate = true;
    }
});

test("comments support editing and deleting only one's own comments, including on validated ideas", async () => {
    let data = await mockApi.load();
    const id = data.validation[0].id;
    await mockApi.rate(id, [0, 0, 0]);
    data = await mockApi.comment(id, "add", "  New comment  ");
    let state = data.validation.find((idea) => idea.id === id).validation;
    const comment = state.comments[0];
    assert.equal(comment.text, "New comment");
    const currentId = CURRENT_USER.id;
    CURRENT_USER.id = "another-user";
    try {
        await assert.rejects(
            mockApi.comment(id, "edit", "unauthorized", comment.id),
            { code: "FORBIDDEN" },
        );
        await assert.rejects(mockApi.comment(id, "delete", "", comment.id), {
            code: "FORBIDDEN",
        });
    } finally {
        CURRENT_USER.id = currentId;
    }
    data = await mockApi.comment(id, "edit", "Edited comment", comment.id);
    state = data.validation.find((idea) => idea.id === id).validation;
    assert.ok(state.comments[0].updatedAt);
    assert.equal(state.comments[0].text, "Edited comment");
    data = await mockApi.comment(id, "delete", "", comment.id);
    state = data.validation.find((idea) => idea.id === id).validation;
    assert.ok(!state.comments.some((item) => item.id === comment.id));
    assert.equal(state.status, "validated");
    assert.ok(state.logs.some((log) => log.action === "comment-edit"));
    assert.ok(state.logs.some((log) => log.action === "comment-delete"));
    await assert.rejects(mockApi.comment(id, "add", "   "), {
        code: "EMPTY_COMMENT",
    });
});

test("deleting a public source preserves its snapshot, deleting a Validation copy preserves other modules", async () => {
    let data = await mockApi.load();
    const source = data.community.find(
        (idea) => idea.authorId === CURRENT_USER.id,
    );
    data = await mockApi.copy(source);
    const copy = data.validation[0];
    data = await mockApi.remove("community", source.id);
    assert.deepEqual(
        data.validation.find((idea) => idea.id === copy.id).validation.source,
        source,
    );
    const community = structuredClone(data.community),
        leads = structuredClone(data.leads);
    data = await mockApi.remove("validation", copy.id);
    assert.ok(!data.validation.some((idea) => idea.id === copy.id));
    assert.deepEqual(data.community, community);
    assert.deepEqual(data.leads, leads);
});

test("text comparisons reconstruct both versions and identify character-level insertions and deletions", async () => {
    const { textDiff, overallRating } = await server.ssrLoadModule(
        "/src/common/validation.ts",
    );
    for (const [before, after] of [
        ["", ""],
        ["old", ""],
        ["", "new"],
        ["abc", "axbc"],
        ["same", "same"],
        ["建议投资组合", "建议平衡投资组合。"],
        ["A😀B", "A😃B"],
        ["replace these words", "replace those words"],
    ]) {
        const parts = textDiff(before, after);
        assert.equal(
            parts
                .filter((part) => part.type !== "insert")
                .map((part) => part.text)
                .join(""),
            before,
        );
        assert.equal(
            parts
                .filter((part) => part.type !== "delete")
                .map((part) => part.text)
                .join(""),
            after,
        );
    }
    const parts = textDiff("abc", "axc");
    assert.ok(
        parts.some((part) => part.type === "delete" && part.text === "b"),
    );
    assert.ok(
        parts.some((part) => part.type === "insert" && part.text === "x"),
    );
    assert.equal(overallRating([0, 0.5, 0]), 0.16);
    assert.equal(overallRating([5, 5, 5]), 5);
});

test("idea queries combine filters, respect ownership, and search case-insensitively", async () => {
    const { filterIdeas, initialQuery } = await server.ssrLoadModule(
        "/src/common/idea-query.ts",
    );
    const { createInitialDatabase } = await server.ssrLoadModule(
        "/src/common/mock-data.ts",
    );
    const data = createInitialDatabase();
    const matching = filterIdeas(
        data.leads,
        { ...initialQuery, product: "FX", priority: "High", search: "JPY" },
        "leads",
    );
    assert.ok(matching.length);
    assert.ok(
        matching.every(
            (idea) =>
                idea.product === "FX" &&
                idea.priority === "High" &&
                `${idea.title} ${idea.description}`
                    .toLowerCase()
                    .includes("jpy"),
        ),
    );
    assert.ok(
        filterIdeas(
            data.community,
            { ...initialQuery, mine: true },
            "community",
        ).every((idea) => idea.authorId === CURRENT_USER.id),
    );
    assert.ok(
        filterIdeas(
            data.validation,
            { ...initialQuery, mine: true },
            "validation",
        ).every((idea) => idea.copiedById === CURRENT_USER.id),
    );
    assert.deepEqual(
        filterIdeas(
            data.leads,
            { ...initialQuery, product: "Mortgage", search: "no-such-idea" },
            "leads",
        ),
        [],
    );
});
