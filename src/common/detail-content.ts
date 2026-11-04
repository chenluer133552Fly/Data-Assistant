import type { Idea } from "./types";

// Data shaping only: each module owns its detail-page presentation and actions.
export function detailContent(idea: Idea) {
    return [
        { title: "Idea Description", text: idea.description },
        {
            title: "Idea Objective",
            text: `${idea.objectiveDescription}. This advances a relevant customer conversation through a qualified advisory follow-up. Expected outcomes remain planning estimates until validated.`,
        },
        {
            title: "Strategic Alignment",
            text: "Support affluent relationship value, advisory differentiation, and more balanced product engagement.",
        },
        {
            title: "Primary CLCM Stage",
            text:
                idea.selection.stages.join(", ") ||
                "Relationship Deepening — support existing relationships with relevant financial conversations.",
        },
        {
            title: "Primary Strategy",
            text: "Customer Engagement — lead with an advisory review, not an immediate hard sell.",
        },
        {
            title: "Core Proposition",
            text: "Understand your next financial step through a balanced conversation based on your goals, current needs, and appetite for risk.",
        },
        { title: "Product Portfolio", text: idea.productDescription },
        {
            title: "Channel Mix",
            text: `${idea.channels.join(
                ", ",
            )}. Coordinate follow-up to respect customer contact preferences and avoid duplicate outreach.`,
        },
        {
            title: "Content Angle",
            text: "Educational, relevant, and grounded in the current market context.",
        },
        {
            title: "Signal Rationale",
            text: "Combine observed customer engagement with the current market outlook. Repeated product research indicates interest, but does not establish suitability or willingness to transact.",
        },
        {
            title: "Target Segment",
            text: `${idea.segment}. Reachable existing customers with relevant observed interests; apply eligibility, suitability, and consent checks before outreach.`,
        },
        {
            title: "Data Readiness / Confidence",
            text: "Needs validation. Confirm product eligibility, customer contactability, recent activity and relationship-manager assignment before execution. No uploaded or inferred customer data should be treated as verified.",
        },
    ];
}

export const personaSections = [
    [
        "Top fitters",
        "Affluent customers with observed product interest and a preference for specialist advice.",
    ],
    [
        "Eligibility / exclusions",
        "Exclude customers with suitability restrictions, unresolved service issues, or missing consent.",
    ],
    [
        "Psychographic cues",
        "Values informed guidance, transparent fees and an understanding of downside scenarios.",
    ],
    [
        "Channel preference",
        "RM or specialist conversation first, supported by relevant digital information.",
    ],
];
export const schedule = [
    ["Preparation", "3 business days"],
    ["Data validation", "4–6 business days"],
    ["Approvals", "2–3 business days"],
    ["Dependency", "1 week"],
    ["Launch", "2 weeks"],
    ["Transaction follow-up", "21 days"],
];
export const kpis = [
    "Appointment booking rate",
    "Advisory conversation completion",
    "Qualified product engagement",
    "Share-of-wallet deepening indicators",
    "Incremental revenue versus standard outreach",
];
export function scoreBreakdown(score: number) {
    const weights = [30, 25, 20, 15, 10];
    const values = weights.map((weight) => Math.floor((score * weight) / 100));
    values[0] += score - values.reduce((sum, value) => sum + value, 0);
    return [
        "Signal strength and evidence",
        "Named-product and customer relevance",
        "CLCM and strategic fit",
        "Data and execution readiness",
        "Urgency or action window",
    ].map((label, index) => ({
        label,
        score: values[index],
        max: weights[index],
    }));
}
