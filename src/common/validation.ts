import {
    detailContent,
    kpis,
    personaSections,
    schedule,
} from "./detail-content";
import type { Idea, IdeaSnapshot, ValidationState } from "./types";

const editableTitles = new Set([
    "Idea Description",
    "Idea Objective",
    "Strategic Alignment",
    "Primary Strategy",
    "Core Proposition",
    "Content Angle",
    "Signal Rationale",
    "Data Readiness / Confidence",
]);

export function validationSections(idea: Idea) {
    return [
        ...detailContent(idea).map((section) => ({
            ...section,
            editable: editableTitles.has(section.title),
        })),
        {
            title: "Target Persona",
            text: personaSections
                .map(([label, text]) => `${label}: ${text}`)
                .join("\n\n"),
            editable: false,
        },
        {
            title: "Recommended Schedule",
            text: schedule
                .map(([label, text]) => `${label}: ${text}`)
                .join("\n"),
            editable: false,
        },
        {
            title: "Expected KPIs",
            text: kpis.map((text) => `• ${text}`).join("\n"),
            editable: false,
        },
        {
            title: "Expected Conversion Estimate",
            text: "6.5%\nAn unvalidated planning estimate of qualified action among eligible reached customers within 21 days.",
            editable: false,
        },
    ];
}

export function snapshotIdea(idea: Idea): IdeaSnapshot {
    const { validation: _validation, ...source } = structuredClone(idea);
    return source;
}

export function createValidationState(source: Idea): ValidationState {
    return {
        source: snapshotIdea(source),
        content: Object.fromEntries(
            validationSections(source).map(({ title, text }) => [title, text]),
        ),
        status: "draft",
        revision: 0,
        comments: [],
        logs: [],
    };
}

export function overallRating(dimensions: number[]) {
    // Half stars are represented exactly as integer units before truncation.
    return (
        Math.floor(
            (dimensions.reduce((sum, value) => sum + value * 2, 0) * 100) / 6,
        ) / 100
    );
}

export function formatActivityTime(value: string) {
    return new Date(value).toLocaleString("en-GB", {
        timeZone: "Asia/Shanghai",
        hour12: false,
    });
}

export interface DiffPart {
    type: "equal" | "delete" | "insert";
    text: string;
}

// Myers' shortest edit script keeps unchanged text aligned, including CJK text.
export function textDiff(before: string, after: string): DiffPart[] {
    const left = Array.from(before),
        right = Array.from(after);
    let prefix = 0;
    while (
        prefix < left.length &&
        prefix < right.length &&
        left[prefix] === right[prefix]
    )
        prefix++;
    let suffix = 0;
    while (
        suffix < left.length - prefix &&
        suffix < right.length - prefix &&
        left[left.length - 1 - suffix] === right[right.length - 1 - suffix]
    )
        suffix++;
    const a = left.slice(prefix, left.length - suffix),
        b = right.slice(prefix, right.length - suffix);
    const trace: Map<number, number>[] = [];
    const v = new Map<number, number>([[1, 0]]);
    let distance = 0;
    search: for (let d = 0; d <= a.length + b.length; d++) {
        trace.push(new Map(v));
        for (let k = -d; k <= d; k += 2) {
            let x =
                k === -d ||
                (k !== d &&
                    (v.get(k - 1) ?? -Infinity) < (v.get(k + 1) ?? -Infinity))
                    ? (v.get(k + 1) ?? 0)
                    : (v.get(k - 1) ?? 0) + 1;
            let y = x - k;
            while (x < a.length && y < b.length && a[x] === b[y]) {
                x++;
                y++;
            }
            v.set(k, x);
            if (x >= a.length && y >= b.length) {
                distance = d;
                break search;
            }
        }
    }
    const reversed: DiffPart[] = [];
    let x = a.length,
        y = b.length;
    for (let d = distance; d >= 0; d--) {
        const previous = trace[d],
            k = x - y;
        const previousK =
            k === -d ||
            (k !== d &&
                (previous.get(k - 1) ?? -Infinity) <
                    (previous.get(k + 1) ?? -Infinity))
                ? k + 1
                : k - 1;
        const previousX = previous.get(previousK) ?? 0,
            previousY = previousX - previousK;
        while (x > previousX && y > previousY) {
            reversed.push({ type: "equal", text: a[--x] });
            y--;
        }
        if (d > 0) {
            if (x === previousX)
                reversed.push({ type: "insert", text: b[--y] });
            else reversed.push({ type: "delete", text: a[--x] });
        }
    }
    const parts: DiffPart[] = [];
    for (const part of [
        { type: "equal" as const, text: left.slice(0, prefix).join("") },
        ...reversed.reverse(),
        {
            type: "equal" as const,
            text: suffix ? left.slice(-suffix).join("") : "",
        },
    ]) {
        if (!part.text) continue;
        const last = parts.at(-1);
        if (last?.type === part.type) last.text += part.text;
        else parts.push({ ...part });
    }
    return parts;
}
