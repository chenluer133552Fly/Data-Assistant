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
    <div className="page-heading">
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
      <span className={`ellipsis ${className}`}>{children}</span>
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
    <div className="list-pagination">
      <span>
        {Math.min((page - 1) * 10 + 1, total)}–{Math.min(page * 10, total)} of{" "}
        {total} items
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
      <div className="loading-list" aria-label="Loading ideas">
        {[1, 2, 3].map((key) => (
          <div className="surface" key={key}>
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
    <div className="empty-state">
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
      <div className="signal-top">
        <div className="tag-row">
          {selectable && (
            <span
              className={`signal-check ${selected ? "is-checked" : ""}`}
              aria-hidden="true"
            >
              {selected ? "✓" : ""}
            </span>
          )}
          <span
            className={`signal-category category-${signal.category
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {signal.category}
          </span>
          <span className={`impact impact-${signal.impact.toLowerCase()}`}>
            {signal.impact.toUpperCase()} IMPACT
          </span>
        </div>
        <div className="signal-score">
          <span>
            <i style={{ width: `${signal.score}%` }} />
          </span>
          <small>{signal.score}</small>
        </div>
      </div>
      <h3>{signal.title}</h3>
      <p>{signal.description}</p>
      <div className="signal-meta">
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
      className={`signal-card selectable ${selected ? "selected" : ""} ${
        limited ? "limited" : ""
      }`}
    >
      {content}
    </button>
  ) : (
    <article className="signal-card">{content}</article>
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
      <div className="idea-actions">
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
    <div className="idea-actions">
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
            module === "community" ? "Delete your public idea" : "Delete idea"
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
    <div className="tag-row">
      <span className={`priority priority-${idea.priority.toLowerCase()}`}>
        {idea.priority.toUpperCase()} PRIORITY
      </span>
      <span className="score-tag">
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
    <article className="idea-card surface">
      <div className="idea-card-top">
        <IdeaBadges idea={idea} />
        <IdeaActions idea={idea} module={module} {...actions} />
      </div>
      <h3>{idea.title}</h3>
      <Tooltip title={idea.description}>
        <p className="idea-description">{idea.description}</p>
      </Tooltip>
      <div
        className={`idea-metadata ${module !== "leads" ? "with-author" : ""}`}
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
              {module === "validation" ? "COPIED BY" : "CREATED BY"}
            </label>
            <span className="author-name">
              {module === "validation" && (
                <span className="mini-avatar">{(idea.copiedBy ?? "E")[0]}</span>
              )}
              {module === "validation" ? idea.copiedBy : idea.author}
            </span>
          </div>
        )}
      </div>
      <div className="idea-card-footer">
        <div className="channel-tags">
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
          <Button type="link" size="small" onClick={() => onDetails?.(idea)}>
            View Details <ArrowRightOutlined />
          </Button>
        )}
      </div>
    </article>
  );
}
