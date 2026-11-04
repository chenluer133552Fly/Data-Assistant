export type Product = "FX" | "Mortgage" | "Wealth" | "Cards";
export type Priority = "High" | "Medium" | "Low";
export type SignalSource = "customer" | "market" | "cio";

export interface Signal {
    id: string;
    source: SignalSource;
    title: string;
    description: string;
    category: string;
    impact: "Medium" | "High" | "Low";
    score: number;
    segment: string;
    product: Product;
    publisher: string;
    createdAt: string;
}

export interface Selection {
    signalIds: string[];
    stages: string[];
    channels: string[];
    notes: string;
}

export interface Idea {
    id: string;
    sourceId: string;
    title: string;
    description: string;
    product: Product;
    productDescription: string;
    segment: string;
    objective: string;
    objectiveDescription: string;
    channels: string[];
    priority: Priority;
    score: number;
    authorId: string;
    author: string;
    createdAt: string;
    selection: Selection;
    copiedById?: string;
    copiedBy?: string;
}

export interface Database {
    leads: Idea[];
    community: Idea[];
    validation: Idea[];
}

export interface TaskEvent {
    step: number;
    description: string;
    ideas?: Idea[];
}

export interface ListQuery {
    page: number;
    product: string;
    segment: string;
    objective: string;
    channel: string;
    priority: string;
    sort: string;
    search: string;
    mine: boolean;
}
