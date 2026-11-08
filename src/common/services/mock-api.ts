import {
    allSignals,
    cioSignals,
    customerSignals,
    createInitialDatabase,
    CURRENT_USER,
} from "../mock-data";
import {
    createValidationState,
    overallRating,
    validationSections,
} from "../validation";
import type {
    DashboardData,
    Database,
    Idea,
    Product,
    Selection,
    TaskEvent,
    ValidationLog,
} from "../types";

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
    for (const idea of database!.validation) {
        if (!idea.validation) {
            idea.validation = createValidationState(
                database!.community.find(
                    (source) => source.sourceId === idea.sourceId,
                ) ?? idea,
            );
            idea.validation.logs.push({
                id: crypto.randomUUID(),
                action: "copy",
                author: idea.copiedBy ?? CURRENT_USER.name,
                createdAt: idea.createdAt,
            });
        }
    }
    return database!;
}

function refreshStorage() {
    // Each request reads the latest server stand-in, including changes from another tab.
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
            const next = JSON.parse(raw);
            if (
                Array.isArray(next.leads) &&
                Array.isArray(next.community) &&
                Array.isArray(next.validation)
            )
                database = next;
        }
    } catch {
        /* storage is optional */
    }
}

function validationIdea(id: string) {
    const idea = db().validation.find((item) => item.id === id);
    if (!idea)
        throw new ApiError(
            "NOT_FOUND",
            "This Validation idea is no longer available.",
        );
    return idea;
}

function addLog(
    idea: Idea,
    action: ValidationLog["action"],
    extra: Partial<ValidationLog> = {},
) {
    idea.validation!.logs.unshift({
        id: crypto.randomUUID(),
        action,
        author: CURRENT_USER.name,
        createdAt: new Date().toISOString(),
        ...extra,
    });
}

function assertUnlocked(idea: Idea, token?: string) {
    const lock = idea.validation!.lock;
    if (lock && (lock.userId !== CURRENT_USER.id || lock.token !== token))
        throw new ApiError(
            "LOCKED",
            `Editing by ${lock.name}. Try again after they finish.`,
        );
}

function assertValidator() {
    if (!CURRENT_USER.canValidate)
        throw new ApiError(
            "FORBIDDEN",
            "You do not have permission to validate ideas.",
        );
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
        refreshStorage();
        return structuredClone(db());
    },
    async dashboard(): Promise<DashboardData> {
        await pause(200);
        refreshStorage();
        const data = db();
        return structuredClone({
            counts: {
                customer: customerSignals.length,
                cio: cioSignals.length,
                ideas: data.leads.length,
                validated: data.validation.filter(
                    (idea) => idea.validation!.status === "validated",
                ).length,
            },
            tasks: CURRENT_USER.canValidate
                ? data.validation.filter(
                      (idea) => idea.validation!.status === "draft",
                  )
                : [],
            recent: [...data.community]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .slice(0, 6),
            signals: [...customerSignals, ...cioSignals]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .slice(0, 6),
        });
    },
    async publish(idea: Idea): Promise<Database> {
        await pause();
        refreshStorage();
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
    async remove(
        module: "leads" | "community" | "validation",
        id: string,
        token?: string,
    ): Promise<Database> {
        await pause();
        refreshStorage();
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
        if (module === "validation") assertUnlocked(item, token);
        db()[module] = db()[module].filter((idea) => idea.id !== id);
        save();
        return structuredClone(db());
    },
    async copy(idea: Idea): Promise<Database> {
        await pause();
        refreshStorage();
        const source = db().community.find((item) => item.id === idea.id);
        if (!source)
            throw new ApiError(
                "NOT_FOUND",
                "This public idea is no longer available.",
            );
        const copy: Idea = {
            ...structuredClone(source),
            id: crypto.randomUUID(),
            copiedById: CURRENT_USER.id,
            copiedBy: CURRENT_USER.name,
            createdAt: new Date().toISOString(),
            validation: createValidationState(source),
        };
        addLog(copy, "copy");
        db().validation.unshift(copy);
        save();
        return structuredClone(db());
    },
    async acquireEdit(id: string, token: string): Promise<Database> {
        await pause(150);
        refreshStorage();
        const idea = validationIdea(id);
        assertUnlocked(idea, token);
        if (idea.validation!.status === "validated")
            throw new ApiError(
                "VALIDATED",
                "Reopen validation before editing this idea.",
            );
        idea.validation!.lock = {
            userId: CURRENT_USER.id,
            name: CURRENT_USER.name,
            token,
        };
        save();
        return structuredClone(db());
    },
    async releaseEdit(id: string, token: string): Promise<Database> {
        refreshStorage();
        const idea = db().validation.find((item) => item.id === id);
        if (
            idea?.validation?.lock?.token === token &&
            idea.validation.lock.userId === CURRENT_USER.id
        ) {
            delete idea.validation.lock;
            save();
        }
        return structuredClone(db());
    },
    async saveEdit(
        id: string,
        token: string,
        revision: number,
        content: Record<string, string>,
    ): Promise<Database> {
        await pause();
        refreshStorage();
        const idea = validationIdea(id),
            state = idea.validation!;
        assertUnlocked(idea, token);
        if (!state.lock || state.status === "validated")
            throw new ApiError(
                "LOCKED",
                "Enter edit mode before saving changes.",
            );
        if (state.revision !== revision)
            throw new ApiError(
                "CONFLICT",
                "This idea has changed. Reload before editing again.",
            );
        const next = { ...state.content };
        for (const section of validationSections(idea)) {
            if (section.editable && typeof content[section.title] === "string")
                next[section.title] = content[section.title];
        }
        if (JSON.stringify(next) !== JSON.stringify(state.content)) {
            addLog(idea, "edit", {
                before: structuredClone(state.content),
                after: structuredClone(next),
            });
            state.content = next;
            idea.description = next["Idea Description"];
            idea.objectiveDescription = next["Idea Objective"];
            state.revision++;
        }
        delete state.lock;
        save();
        return structuredClone(db());
    },
    async rate(id: string, dimensions: number[]): Promise<Database> {
        await pause();
        refreshStorage();
        assertValidator();
        const idea = validationIdea(id),
            state = idea.validation!;
        assertUnlocked(idea);
        if (
            dimensions.length !== 3 ||
            dimensions.some(
                (value) =>
                    !Number.isFinite(value) ||
                    value < 0 ||
                    value > 5 ||
                    !Number.isInteger(value * 2),
            )
        )
            throw new ApiError(
                "INVALID_RATING",
                "Choose a score between 0 and 5 in half-star increments.",
            );
        state.rating = {
            dimensions: [...dimensions],
            score: overallRating(dimensions),
            author: CURRENT_USER.name,
            createdAt: new Date().toISOString(),
        };
        state.status = "validated";
        addLog(idea, "validate", {
            detail: `Accuracy: ${dimensions[0]}; Relevance: ${dimensions[1]}; Completeness: ${dimensions[2]}. Overall: ${state.rating.score.toFixed(2)} / 5`,
        });
        save();
        return structuredClone(db());
    },
    async reopen(id: string, reason: string): Promise<Database> {
        await pause();
        refreshStorage();
        assertValidator();
        const idea = validationIdea(id),
            state = idea.validation!;
        assertUnlocked(idea);
        if (state.status !== "validated")
            throw new ApiError(
                "CONFLICT",
                "This idea is already open for validation.",
            );
        state.status = "draft";
        delete state.rating;
        addLog(idea, "reopen", { detail: reason.trim() });
        save();
        return structuredClone(db());
    },
    async comment(
        id: string,
        action: "add" | "edit" | "delete",
        text = "",
        commentId?: string,
    ): Promise<Database> {
        await pause(200);
        refreshStorage();
        const idea = validationIdea(id),
            state = idea.validation!;
        if (action !== "delete" && !text.trim())
            throw new ApiError(
                "EMPTY_COMMENT",
                "Write a comment before sending.",
            );
        if (action === "add") {
            state.comments.unshift({
                id: crypto.randomUUID(),
                authorId: CURRENT_USER.id,
                author: CURRENT_USER.name,
                text: text.trim(),
                createdAt: new Date().toISOString(),
            });
            addLog(idea, "comment-add", { detail: text.trim() });
        } else {
            const comment = state.comments.find(
                (item) => item.id === commentId,
            );
            if (!comment)
                throw new ApiError(
                    "NOT_FOUND",
                    "This comment is no longer available.",
                );
            if (comment.authorId !== CURRENT_USER.id)
                throw new ApiError(
                    "FORBIDDEN",
                    "You can only change your own comments.",
                );
            addLog(
                idea,
                action === "edit" ? "comment-edit" : "comment-delete",
                { detail: action === "delete" ? comment.text : text.trim() },
            );
            if (action === "delete")
                state.comments = state.comments.filter(
                    (item) => item.id !== commentId,
                );
            else {
                comment.text = text.trim();
                comment.updatedAt = new Date().toISOString();
            }
        }
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
        refreshStorage();
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
