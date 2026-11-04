import { createContext } from "react";
import type { Database, Product, Selection } from "./types";

export interface Workspace {
    database: Database;
    loading: boolean;
    error: string;
    reload: () => Promise<void>;
    update: (database: Database) => void;
    generating: boolean;
    task: {
        open: boolean;
        step: number;
        description: string;
        error: string;
        run: number;
    };
    closeTask: () => void;
    generate: (product: Product, selection: Selection) => Promise<boolean>;
}

export const WorkspaceContext = createContext<Workspace | null>(null);
