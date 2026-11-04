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
    ])
        assert.ok(
            renderPage(path).includes(expected),
            `${path} should render ${expected}`,
        );
    assert.ok(renderPage("/leads/missing").includes("Idea not found"));
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
