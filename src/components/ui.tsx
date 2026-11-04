import { useState } from "react";
import { Alert, Button, Empty, Pagination, Skeleton, Tooltip } from "antd";
import {
    ArrowRightOutlined,
    ClockCircleOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    GlobalOutlined,
    LockOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import type { Idea, Signal } from "../common/types";
import { CURRENT_USER } from "../common/mock-data";

export function PageHeading({
    title,
    description,
    extra,
}: {
    title: string;
    description: string;
    extra?: ReactNode;
}) {
    return (
        <div className="page-heading flex justify-between items-center gap-[24px] mb-[24px] [&_h1]:font-['Trebuchet_MS','Segoe_UI',sans-serif] [&_h1]:text-[24px] [&_h1]:leading-[1.25] [&_h1]:font-bold [&_h1]:text-[#263e37] [&_h1]:tracking-[-0.4px] [&_p]:text-[#818698] [&_p]:text-[13px] [&_p]:mt-[5px] [&_p]:leading-[1.6] tablet:items-start mobile:flex-wrap mobile:gap-[10px] mobile:mb-[20px] mobile:[&_h1]:text-[22px] mobile:[&_p]:text-[12px]">
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {extra}
        </div>
    );
}

export function Ellipsis({
    children,
    className = "",
}: {
    children: string;
    className?: string;
}) {
    return (
        <Tooltip title={children}>
            <span
                className={`ellipsis block whitespace-nowrap overflow-hidden text-ellipsis ${className}`}
            >
                {children}
            </span>
        </Tooltip>
    );
}

export function ListPagination({
    page,
    total,
    onChange,
}: {
    page: number;
    total: number;
    onChange: (page: number) => void;
}) {
    return total > 0 ? (
        <div className="list-pagination flex items-center justify-between gap-[16px] m-[23px_0_10px] text-[#969aa3] text-[11px] [&_.ant-pagination]:text-[12px] mobile:flex-wrap">
            <span>
                {Math.min((page - 1) * 10 + 1, total)}–
                {Math.min(page * 10, total)} of {total} items
            </span>
            <Pagination
                current={page}
                pageSize={10}
                total={total}
                showSizeChanger={false}
                onChange={onChange}
            />
        </div>
    ) : null;
}

export function ListState({
    loading,
    error,
    filtered,
    retry,
}: {
    loading: boolean;
    error?: string;
    filtered?: boolean;
    retry?: () => void;
}) {
    if (loading)
        return (
            <div
                className="loading-list flex flex-col gap-[12px] [&_.surface]:p-[22px]"
                aria-label="Loading ideas"
            >
                {[1, 2, 3].map((key) => (
                    <div
                        className="surface bg-white [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3510] rounded-[9px]"
                        key={key}
                    >
                        <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                ))}
            </div>
        );
    if (error)
        return (
            <Alert
                type="error"
                showIcon
                title="Unable to load this list"
                description={error}
                action={<Button onClick={retry}>Try again</Button>}
            />
        );
    return (
        <div className="empty-state p-[55px_20px] bg-white [border:1px_solid_var(--border)] rounded-[9px]">
            <Empty
                description={
                    filtered
                        ? "No matching results. Try changing your filters or search."
                        : "No ideas here yet."
                }
            />
        </div>
    );
}

export function SignalCard({
    signal,
    selected,
    limited,
    selectable,
    onSelect,
}: {
    signal: Signal;
    selected?: boolean;
    limited?: boolean;
    selectable?: boolean;
    onSelect?: () => void;
}) {
    const content = (
        <>
            <div className="signal-top flex items-center gap-[20px] justify-between mb-[8px]">
                <div className="tag-row flex items-center gap-[7px] flex-wrap">
                    {selectable && (
                        <span
                            className={`signal-check w-[13px] h-[13px] [border:1px_solid_#d9e0dc] bg-white rounded-[3px] grid place-items-center text-white text-[10px] leading-[1] [&.is-checked]:bg-[#009575] [&.is-checked]:border-[#009575] ${selected ? "is-checked" : ""}`}
                            aria-hidden="true"
                        >
                            {selected ? "✓" : ""}
                        </span>
                    )}
                    <span
                        className={`signal-category rounded-[3px] text-[10px] leading-[1.7] p-[0_6px] whitespace-nowrap text-[#a658b4] bg-[#f9effc] [&.category-conversion]:text-[#c39d21] [&.category-conversion]:bg-[#fff9e8] [&.category-transactional]:text-[#737cdb] [&.category-transactional]:bg-[#f0f0ff] [&.category-momentum]:text-[#439b81] [&.category-momentum]:bg-[#edf9f4] [&.category-lifecycle]:text-[#439b81] [&.category-lifecycle]:bg-[#edf9f4] [&.category-macro]:text-[#697bc1] [&.category-macro]:bg-[#f0f2fd] [&.category-rates]:text-[#697bc1] [&.category-rates]:bg-[#f0f2fd] [&.category-market-outlook]:text-[#697bc1] [&.category-market-outlook]:bg-[#f0f2fd] [&.category-investment]:text-[#697bc1] [&.category-investment]:bg-[#f0f2fd] category-${signal.category
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                    >
                        {signal.category}
                    </span>
                    <span
                        className={`impact rounded-[3px] text-[9px] leading-[1.7] p-[0_6px] whitespace-nowrap [border:1px_solid_#d8eaf3] bg-[#f0f8fd] text-[#468ba7] font-semibold [&.impact-high]:bg-[#fff1f4] [&.impact-high]:border-[#ffd8e3] [&.impact-high]:text-[#d45575] [&.impact-low]:text-[#939da8] [&.impact-low]:bg-[#f5f6f9] [&.impact-low]:border-[#e8ebf1] impact-${signal.impact.toLowerCase()}`}
                    >
                        {signal.impact.toUpperCase()} IMPACT
                    </span>
                </div>
                <div className="signal-score flex items-center gap-[10px] text-[#9a9ba4] [&_>_span]:block [&_>_span]:w-[75px] [&_>_span]:h-[4px] [&_>_span]:bg-[#f1f1f5] [&_>_span]:rounded-[5px] [&_i]:block [&_i]:h-full [&_i]:bg-[var(--rose)] [&_i]:rounded-[inherit] [&_small]:text-[10px] mobile:[&_>_span]:w-[44px]">
                    <span>
                        <i style={{ width: `${signal.score}%` }} />
                    </span>
                    <small>{signal.score}</small>
                </div>
            </div>
            <h3>{signal.title}</h3>
            <p>{signal.description}</p>
            <div className="signal-meta flex flex-wrap items-baseline gap-[5px_18px] text-[10px] text-[#92979a] mt-[9px] [&_b]:text-[#699b8f] [&_b]:font-medium [&_time]:ml-auto [&_time]:whitespace-nowrap mobile:gap-[6px_12px] mobile:[&_time]:ml-[0]">
                <span>
                    Affected Segment: <b>{signal.segment}</b>
                </span>
                <span>
                    Product Category: <b>{signal.product}</b>
                </span>
                <span>
                    Source: <b>{signal.publisher}</b>
                </span>
                <time>
                    <ClockCircleOutlined />{" "}
                    {new Date(signal.createdAt).toLocaleDateString("en-CA", {
                        timeZone: "Asia/Hong_Kong",
                    })}{" "}
                    08:17 HKT
                </time>
            </div>
        </>
    );
    return selectable ? (
        <button
            type="button"
            role="checkbox"
            aria-checked={!!selected}
            aria-label={signal.title}
            aria-disabled={!!selected || !!limited}
            onClick={onSelect}
            className={`signal-card text-left bg-white p-[17px_20px_15px] [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3509] rounded-[9px] w-full min-w-0 [&_h3]:text-[#226d5c] [&_h3]:font-[650] [&_h3]:text-[14px] [&_h3]:leading-[1.4] [&_h3]:mb-[5px] [&_p]:text-[12px] [&_p]:text-[#777e84] [&_p]:leading-[1.65] mobile:p-[14px] mobile:[&_p]:text-[11px] selectable [transition:border-color_0.15s,_background_0.15s] [&:hover:not(.selected)]:border-[#75bca3] [&.selected]:border-[#00a27a] [&.selected]:bg-[#fcfffd] [&.limited]:bg-[#fafafa] [&.limited]:opacity-[0.57] [&.limited]:cursor-not-allowed ${selected ? "selected" : ""} ${
                limited ? "limited" : ""
            }`}
        >
            {content}
        </button>
    ) : (
        <article className="signal-card text-left bg-white p-[17px_20px_15px] [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3509] rounded-[9px] w-full min-w-0 [&_h3]:text-[#226d5c] [&_h3]:font-[650] [&_h3]:text-[14px] [&_h3]:leading-[1.4] [&_h3]:mb-[5px] [&_p]:text-[12px] [&_p]:text-[#777e84] [&_p]:leading-[1.65] mobile:p-[14px] mobile:[&_p]:text-[11px]">
            {content}
        </article>
    );
}

export type IdeaModule = "leads" | "community" | "validation";
interface IdeaActionsProps {
    idea: Idea;
    module: IdeaModule;
    onPublish?: (idea: Idea) => Promise<void> | void;
    onCopy?: (idea: Idea) => Promise<void> | void;
    onDelete?: (idea: Idea) => void;
}

export function IdeaActions({
    idea,
    module,
    onPublish,
    onCopy,
    onDelete,
}: IdeaActionsProps) {
    const [busy, setBusy] = useState(false);
    async function publish() {
        if (!onPublish || busy) return;
        setBusy(true);
        try {
            await onPublish(idea);
        } finally {
            setBusy(false);
        }
    }
    async function copy() {
        if (!onCopy || busy) return;
        setBusy(true);
        try {
            await onCopy(idea);
        } finally {
            setBusy(false);
        }
    }
    if (module === "validation")
        return (
            <div className="idea-actions flex items-center gap-[3px] shrink-0 [&_.ant-btn]:text-[#90959b] [&_.ant-btn]:text-[11px] [&_.ant-btn:not(:disabled):hover]:text-[var(--teal)] [&_.ant-btn:disabled]:text-[#bfc3ca] mobile:gap-[0] mobile:[&_.ant-btn]:px-[5px] mobile:[&_.ant-btn]:text-[10px]">
                <Tooltip title="Locking will be available in a later update">
                    <Button
                        disabled
                        type="text"
                        size="small"
                        aria-label="Lock unavailable"
                        icon={<LockOutlined />}
                    />
                </Tooltip>
                <Tooltip title="Editing will be available in a later update">
                    <Button
                        disabled
                        type="text"
                        size="small"
                        aria-label="Edit unavailable"
                        icon={<EditOutlined />}
                    />
                </Tooltip>
                <Tooltip title="Deletion will be available in a later update">
                    <Button
                        disabled
                        type="text"
                        size="small"
                        aria-label="Delete unavailable"
                        icon={<DeleteOutlined />}
                    />
                </Tooltip>
            </div>
        );
    return (
        <div className="idea-actions flex items-center gap-[3px] shrink-0 [&_.ant-btn]:text-[#90959b] [&_.ant-btn]:text-[11px] [&_.ant-btn:not(:disabled):hover]:text-[var(--teal)] [&_.ant-btn:disabled]:text-[#bfc3ca] mobile:gap-[0] mobile:[&_.ant-btn]:px-[5px] mobile:[&_.ant-btn]:text-[10px]">
            {module === "leads" ? (
                <Button
                    size="small"
                    type="text"
                    loading={busy}
                    icon={<GlobalOutlined />}
                    onClick={() => void publish()}
                >
                    Make Public
                </Button>
            ) : (
                <Tooltip title="Copy to Validation">
                    <Button
                        size="small"
                        type="text"
                        loading={busy}
                        aria-label={`Copy ${idea.title} to Validation`}
                        icon={<CopyOutlined />}
                        onClick={() => void copy()}
                    />
                </Tooltip>
            )}
            {(module === "leads" || idea.authorId === CURRENT_USER.id) && (
                <Tooltip
                    title={
                        module === "community"
                            ? "Delete your public idea"
                            : "Delete idea"
                    }
                >
                    <Button
                        size="small"
                        type="text"
                        aria-label={`Delete ${idea.title}`}
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete?.(idea)}
                    />
                </Tooltip>
            )}
        </div>
    );
}

export function IdeaBadges({ idea }: { idea: Idea }) {
    return (
        <div className="tag-row flex items-center gap-[7px] flex-wrap">
            <span
                className={`priority rounded-[3px] text-[9px] leading-[1.7] p-[0_6px] whitespace-nowrap [border:1px_solid] font-medium [&.priority-high]:text-[#e44e75] [&.priority-high]:border-[#f5bdce] [&.priority-high]:bg-[#fff1f5] [&.priority-medium]:text-[#4d90a9] [&.priority-medium]:border-[#d2e7f1] [&.priority-medium]:bg-[#eff8fc] [&.priority-low]:text-[#879399] [&.priority-low]:border-[#dfe6e8] [&.priority-low]:bg-[#f4f7f8] priority-${idea.priority.toLowerCase()}`}
            >
                {idea.priority.toUpperCase()} PRIORITY
            </span>
            <span className="score-tag rounded-[3px] text-[10px] leading-[1.7] p-[0_6px] whitespace-nowrap text-[#5c8c80] bg-[#f1f6f4] [border:1px_solid_#e9efed] [&_.anticon]:mr-[3px]">
                <RiseOutlined /> Score {idea.score} / 100
            </span>
        </div>
    );
}

export function IdeaCard({
    idea,
    module,
    onDetails,
    ...actions
}: IdeaActionsProps & { onDetails?: (idea: Idea) => void }) {
    return (
        <article className="idea-card [&_h3]:text-[#226d5c] [&_h3]:font-[650] [&_h3]:text-[15px] [&_h3]:leading-[1.4] [&_h3]:mb-[6px] p-[16px_19px_9px] mobile:p-[14px_13px_8px] mobile:[&_h3]:text-[14px] surface bg-white [border:1px_solid_var(--border)] shadow-[0_1px_3px_#223b3510] rounded-[9px]">
            <div className="idea-card-top flex items-center justify-between gap-[12px] mb-[7px] mobile:items-start">
                <IdeaBadges idea={idea} />
                <IdeaActions idea={idea} module={module} {...actions} />
            </div>
            <h3>{idea.title}</h3>
            <Tooltip title={idea.description}>
                <p className="idea-description [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden text-[#7e8289] leading-[1.65] text-[11px]">
                    {idea.description}
                </p>
            </Tooltip>
            <div
                className={`idea-metadata grid grid-cols-[1fr_1fr_1fr] gap-[22px] m-[14px_0_12px] [&.with-author]:grid-cols-[1fr_1fr_1fr_0.75fr] [&_>_div]:min-w-0 [&_label]:text-[9px] [&_label]:tracking-[0.5px] [&_label]:text-[#a2a5ac] [&_label]:block [&_label]:mb-[5px] [&_.ellipsis]:text-[11px] [&_.ellipsis]:text-[#5c7e71] tablet:[&.with-author]:grid-cols-[1fr_1fr] tablet:[&.with-author]:gap-[14px] mobile:grid-cols-[1fr] mobile:gap-[10px] mobile:[&.with-author]:grid-cols-[1fr_1fr] ${module !== "leads" ? "with-author" : ""}`}
            >
                <div>
                    <label>PRODUCT CATEGORY</label>
                    <Ellipsis>{idea.productDescription}</Ellipsis>
                </div>
                <div>
                    <label>TARGET SEGMENT</label>
                    <Ellipsis>{idea.segment}</Ellipsis>
                </div>
                <div>
                    <label>IDEA OBJECTIVE</label>
                    <Ellipsis>{idea.objectiveDescription}</Ellipsis>
                </div>
                {module !== "leads" && (
                    <div>
                        <label>
                            {module === "validation"
                                ? "COPIED BY"
                                : "CREATED BY"}
                        </label>
                        <span className="author-name text-[11px] text-[#5c7e71]">
                            {module === "validation" && (
                                <span className="mini-avatar inline-grid place-items-center w-[18px] h-[18px] bg-[#f1f6f3] rounded-full mr-[6px]">
                                    {(idea.copiedBy ?? "E")[0]}
                                </span>
                            )}
                            {module === "validation"
                                ? idea.copiedBy
                                : idea.author}
                        </span>
                    </div>
                )}
            </div>
            <div className="idea-card-footer flex justify-between items-center gap-[15px] [border-top:1px_solid_#f4f5f7] pt-[6px] [&_.ant-btn]:text-[10px] [&_.ant-btn]:text-[#54796c] [&_.ant-btn:disabled]:text-[#abb4b0] mobile:gap-[5px]">
                <div className="channel-tags flex gap-[6px] flex-wrap [&_span]:text-[9px] [&_span]:text-[#747a81] [&_span]:p-[2px_7px] [&_span]:bg-[#f6f6f9] [&_span]:rounded-[3px] mobile:[&_span]:text-[8px] mobile:[&_span]:px-[4px]">
                    {idea.channels.map((channel) => (
                        <span key={channel}>
                            {channel === "Push Notification"
                                ? "PN"
                                : channel === "Call Lead"
                                  ? "Call Lead (RM or Specialist)"
                                  : channel}
                        </span>
                    ))}
                </div>
                {module === "validation" ? (
                    <Tooltip title="Read-only details will be available in a later update">
                        <Button type="link" disabled size="small">
                            View Details <ArrowRightOutlined />
                        </Button>
                    </Tooltip>
                ) : (
                    <Button
                        type="link"
                        size="small"
                        onClick={() => onDetails?.(idea)}
                    >
                        View Details <ArrowRightOutlined />
                    </Button>
                )}
            </div>
        </article>
    );
}
