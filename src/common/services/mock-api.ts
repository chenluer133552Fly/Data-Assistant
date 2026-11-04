import { allSignals, createInitialDatabase, CURRENT_USER } from "../mock-data";
import type { Database, Idea, Product, Selection, TaskEvent } from "../types";

export class ApiError extends Error {
    code: string;
    constructor(code: string, message: string) {
        super(message);
        this.name = "ApiError";
        this.code = code;
    }
}

const KEY = "meridian:database:v1";
const pause = (ms = 450) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));
let database: Database | undefined;

function db(): Database {
    if (!database) {
        try {
            const raw = localStorage.getItem(KEY);
            const parsed = raw ? JSON.parse(raw) : null;
            database =
                parsed &&
                Array.isArray(parsed.leads) &&
                Array.isArray(parsed.community) &&
                Array.isArray(parsed.validation)
                    ? parsed
                    : createInitialDatabase();
        } catch {
            database = createInitialDatabase();
        }
    }
    return database!;
}

function save() {
    // Keep the in-memory demo functional when browser storage is unavailable.
    try {
        localStorage.setItem(KEY, JSON.stringify(db()));
    } catch {
        /* storage is optional */
    }
}

export const mockApi = {
    async load(): Promise<Database> {
        await pause(250);
        return structuredClone(db());
    },
    async publish(idea: Idea): Promise<Database> {
        await pause();
        if (db().community.some((item) => item.sourceId === idea.sourceId))
            throw new ApiError(
                "ALREADY_PUBLISHED",
                "This idea has already been published.",
            );
        db().community.unshift({
            ...structuredClone(idea),
            id: crypto.randomUUID(),
            authorId: CURRENT_USER.id,
            author: CURRENT_USER.name,
            createdAt: new Date().toISOString(),
        });
        save();
        return structuredClone(db());
    },
    async remove(module: "leads" | "community", id: string): Promise<Database> {
        await pause();
        const item = db()[module].find((idea) => idea.id === id);
        if (!item)
            throw new ApiError(
                "NOT_FOUND",
                "This idea is no longer available. Refresh the list and try again.",
            );
        if (module === "community" && item.authorId !== CURRENT_USER.id)
            throw new ApiError(
                "FORBIDDEN",
                "You can only delete ideas you published.",
            );
        db()[module] = db()[module].filter((idea) => idea.id !== id);
        save();
        return structuredClone(db());
    },
    async copy(idea: Idea): Promise<Database> {
        await pause();
        db().validation.unshift({
            ...structuredClone(idea),
            id: crypto.randomUUID(),
            copiedById: CURRENT_USER.id,
            copiedBy: CURRENT_USER.name,
            createdAt: new Date().toISOString(),
        });
        save();
        return structuredClone(db());
    },
    async *generate(
        product: Product,
        selection: Selection,
    ): AsyncGenerator<TaskEvent> {
        const uniqueIds = [...new Set(selection.signalIds)];
        if (
            !uniqueIds.length ||
            uniqueIds.length > 5 ||
            uniqueIds.some(
                (id) => !allSignals.some((signal) => signal.id === id),
            )
        )
            throw new ApiError(
                "INVALID_SELECTION",
                "Select between 1 and 5 signals before generating ideas.",
            );
        yield {
            step: 0,
            description:
                "Understanding your product focus and selected signals.",
        };
        await pause(1000);
        yield {
            step: 1,
            description: `Connecting ${uniqueIds.length} signals with customer needs and market context.`,
        };
        await pause(1100);
        yield {
            step: 2,
            description:
                "Developing relevant campaign ideas and reviewing delivery channels.",
        };
        await pause(1200);
        const templates = createInitialDatabase().leads.filter(
            (idea) => idea.product === product,
        );
        const ideas = templates.slice(0, 3).map((idea) => ({
            ...idea,
            id: crypto.randomUUID(),
            sourceId: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            selection: structuredClone(selection),
            channels: selection.channels.length
                ? [...selection.channels]
                : idea.channels,
        }));
        db().leads.unshift(...ideas);
        save();
        yield {
            step: 3,
            description: `${ideas.length} campaign ideas are ready for your review.`,
            ideas: structuredClone(ideas),
        };
    },
};

const preferenceKey = `meridian:skip-publish-confirmation:${CURRENT_USER.id}`;
export function getSkipConfirmation(): boolean {
    try {
        return localStorage.getItem(preferenceKey) === "true";
    } catch {
        return false;
    }
}
export function setSkipConfirmation() {
    try {
        localStorage.setItem(preferenceKey, "true");
    } catch {
        /* session can continue without storage */
    }
}
