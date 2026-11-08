import { useCallback, useEffect, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { mockApi } from "./services/mock-api";
import type { Database, Product, Selection } from "./types";
import { WorkspaceContext } from "./workspace-context";

export function WorkspaceProvider({ children }: PropsWithChildren) {
    const [database, update] = useState<Database>({
        leads: [],
        community: [],
        validation: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [generating, setGenerating] = useState(false);
    const [task, setTask] = useState({
        open: false,
        step: 0,
        description: "",
        error: "",
        run: 0,
    });
    const generationLock = useRef(false);
    const reload = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            update(await mockApi.load());
        } catch {
            setError("Unable to load ideas. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        const refresh = () => {
            void mockApi
                .load()
                .then((value) => {
                    if (active) update(value);
                })
                .catch(() => {});
        };
        const onStorage = (event: StorageEvent) => {
            if (event.key === "meridian:database:v1") refresh();
        };
        window.addEventListener("storage", onStorage);
        window.addEventListener("focus", refresh);
        return () => {
            active = false;
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("focus", refresh);
        };
    }, []);
    useEffect(() => {
        let active = true;
        void mockApi
            .load()
            .then((value) => {
                if (active) {
                    update(value);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (active) {
                    setError("Unable to load ideas. Please try again.");
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, []);

    async function generate(product: Product, selection: Selection) {
        if (generationLock.current) return false;
        generationLock.current = true;
        setGenerating(true);
        setTask((previous) => ({
            open: true,
            step: 0,
            description: "",
            error: "",
            run: previous.run + 1,
        }));
        try {
            for await (const event of mockApi.generate(product, selection)) {
                setTask((previous) => ({
                    ...previous,
                    open: true,
                    step: event.step,
                    description: event.description,
                    error: "",
                }));
                if (event.ideas) {
                    const ideas = event.ideas;
                    update((previous) => ({
                        ...previous,
                        leads: [...ideas, ...previous.leads],
                    }));
                }
            }
            return true;
        } catch (cause) {
            setTask((previous) => ({
                ...previous,
                error:
                    cause instanceof Error
                        ? cause.message
                        : "Generation failed. Please try again.",
            }));
            return false;
        } finally {
            generationLock.current = false;
            setGenerating(false);
        }
    }

    return (
        <WorkspaceContext.Provider
            value={{
                database,
                loading,
                error,
                reload,
                update,
                generating,
                task,
                closeTask: () =>
                    setTask((previous) => ({ ...previous, open: false })),
                generate,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}
