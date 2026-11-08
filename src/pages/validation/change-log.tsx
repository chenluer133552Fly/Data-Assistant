import { useState } from "react";
import {
    Avatar,
    Button,
    Checkbox,
    Drawer,
    Empty,
    Modal,
    Pagination,
    Tabs,
    Tag,
} from "antd";
import type { ValidationLog } from "../../common/types";
import { formatActivityTime, textDiff } from "../../common/validation";

const labels: Record<ValidationLog["action"], string> = {
    copy: "Copied from Ideation Community",
    edit: "Updated",
    validate: "Validated",
    reopen: "Reopen Validation",
    "comment-add": "Comment Added",
    "comment-edit": "Comment Edited",
    "comment-delete": "Comment Deleted",
};

export function ChangeLog({
    open,
    onClose,
    logs,
}: {
    open: boolean;
    onClose: () => void;
    logs: ValidationLog[];
}) {
    const [tab, setTab] = useState("edit");
    const [page, setPage] = useState(1);
    const [target, setTarget] = useState<ValidationLog>();
    const [onlyDifferences, setOnlyDifferences] = useState(false);
    const commentLogs = logs.filter((log) => log.action.startsWith("comment-"));
    const editLogs = logs.filter((log) => !log.action.startsWith("comment-"));
    const list = tab === "edit" ? editLogs : commentLogs;
    const fields = [
        ...new Set([
            ...Object.keys(target?.before ?? {}),
            ...Object.keys(target?.after ?? {}),
        ]),
    ];
    return (
        <>
            <Drawer
                title="Change Log"
                open={open}
                onClose={onClose}
                size={390}
                className="validation-log"
                footer={
                    <Pagination
                        current={page}
                        pageSize={10}
                        total={list.length}
                        showSizeChanger={false}
                        size="small"
                        onChange={setPage}
                    />
                }
            >
                <Tabs
                    activeKey={tab}
                    onChange={(key) => {
                        setTab(key);
                        setPage(1);
                    }}
                    items={[
                        {
                            key: "edit",
                            label: `Edit (${logs.filter((log) => log.action === "edit").length})`,
                        },
                        {
                            key: "comments",
                            label: `Comments (${commentLogs.length})`,
                        },
                    ]}
                />
                <div className="validation-timeline">
                    {list.slice((page - 1) * 10, page * 10).map((log) => (
                        <article key={log.id}>
                            <header>
                                <Avatar size={22}>{log.author[0]}</Avatar>
                                <strong>{log.author}</strong>
                                {log.action === "edit" && (
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={() => {
                                            setTarget(log);
                                            setOnlyDifferences(false);
                                        }}
                                    >
                                        Details
                                    </Button>
                                )}
                            </header>
                            <time>{formatActivityTime(log.createdAt)}</time>
                            <Tag>{labels[log.action]}</Tag>
                            {log.detail && <p>{log.detail}</p>}
                        </article>
                    ))}
                </div>
                {!list.length && (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No activity yet"
                    />
                )}
            </Drawer>
            <Modal
                title={
                    target
                        ? `${target.author} updated · ${formatActivityTime(target.createdAt)}`
                        : "Change details"
                }
                open={!!target}
                onCancel={() => setTarget(undefined)}
                footer={
                    <Button onClick={() => setTarget(undefined)}>Close</Button>
                }
                width="min(1200px, calc(100vw - 40px))"
                className="validation-diff"
                centered
            >
                <div className="diff-toolbar">
                    <Checkbox
                        checked={onlyDifferences}
                        onChange={(event) =>
                            setOnlyDifferences(event.target.checked)
                        }
                    >
                        Show differences only
                    </Checkbox>
                    <div>
                        <span className="diff-delete-key">Delete</span>
                        <span className="diff-insert-key">Insert</span>
                        <span className="diff-replace-key">Replace</span>
                    </div>
                </div>
                <div className="diff-scroll">
                    <div className="diff-headings">
                        <strong>Field</strong>
                        <strong>Previous</strong>
                        <strong>Current</strong>
                    </div>
                    {fields
                        .filter(
                            (field) =>
                                !onlyDifferences ||
                                target?.before?.[field] !==
                                    target?.after?.[field],
                        )
                        .map((field) => {
                            const before = target?.before?.[field] ?? "",
                                after = target?.after?.[field] ?? "";
                            const parts = textDiff(before, after);
                            const replaced =
                                parts.some((part) => part.type === "delete") &&
                                parts.some((part) => part.type === "insert");
                            return (
                                <div
                                    className={`diff-row ${before !== after ? "has-difference" : ""}`}
                                    key={field}
                                >
                                    <h3>{field}</h3>
                                    <p>
                                        {parts
                                            .filter(
                                                (part) =>
                                                    part.type !== "insert",
                                            )
                                            .map((part, index) =>
                                                part.type === "delete" ? (
                                                    <del
                                                        className={
                                                            replaced
                                                                ? "diff-replaced"
                                                                : ""
                                                        }
                                                        key={index}
                                                    >
                                                        {part.text}
                                                    </del>
                                                ) : (
                                                    <span key={index}>
                                                        {part.text}
                                                    </span>
                                                ),
                                            ) || "—"}
                                    </p>
                                    <p>
                                        {parts
                                            .filter(
                                                (part) =>
                                                    part.type !== "delete",
                                            )
                                            .map((part, index) =>
                                                part.type === "insert" ? (
                                                    <ins
                                                        className={
                                                            replaced
                                                                ? "diff-replaced"
                                                                : ""
                                                        }
                                                        key={index}
                                                    >
                                                        {part.text}
                                                    </ins>
                                                ) : (
                                                    <span key={index}>
                                                        {part.text}
                                                    </span>
                                                ),
                                            ) || "—"}
                                    </p>
                                </div>
                            );
                        })}
                </div>
            </Modal>
        </>
    );
}
