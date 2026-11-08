import { useEffect, useRef, useState } from "react";
import { App, Avatar, Button, Empty, Input, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { CURRENT_USER } from "../../common/mock-data";
import { mockApi } from "../../common/services/mock-api";
import { useWorkspace } from "../../common/use-workspace";
import type { IdeaComment } from "../../common/types";
import { formatActivityTime } from "../../common/validation";

export function ValidationComments({
    ideaId,
    comments,
}: {
    ideaId: string;
    comments: IdeaComment[];
}) {
    const { message } = App.useApp();
    const { update } = useWorkspace();
    const [expanded, setExpanded] = useState(false);
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [editing, setEditing] = useState<IdeaComment>();
    const [editText, setEditText] = useState("");
    const [deleting, setDeleting] = useState<IdeaComment>();
    const latest = useRef<HTMLDivElement>(null);
    const section = useRef<HTMLElement>(null);
    const [bounds, setBounds] = useState({ left: 0, width: 0 });
    useEffect(() => {
        const measure = () => {
            const rect = section.current?.getBoundingClientRect();
            if (rect) setBounds({ left: rect.left, width: rect.width });
        };
        const observer = new ResizeObserver(measure);
        if (section.current) observer.observe(section.current);
        window.addEventListener("resize", measure);
        measure();
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);
    async function submit(action: "add" | "edit" | "delete") {
        if (busy) return;
        setBusy(true);
        try {
            update(
                await mockApi.comment(
                    ideaId,
                    action,
                    action === "add" ? text : editText,
                    action === "delete" ? deleting?.id : editing?.id,
                ),
            );
            if (action === "add") {
                setText("");
                setExpanded(false);
                requestAnimationFrame(() =>
                    latest.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    }),
                );
            } else if (action === "edit") setEditing(undefined);
            else setDeleting(undefined);
            void message.success(
                action === "delete"
                    ? "Comment deleted"
                    : action === "edit"
                      ? "Comment updated"
                      : "Comment added",
            );
        } catch (cause) {
            void message.error(
                cause instanceof Error
                    ? cause.message
                    : "Unable to update comment.",
            );
        } finally {
            setBusy(false);
        }
    }
    return (
        <>
            <section
                ref={section}
                className="validation-comments"
                aria-label="Comments"
            >
                <div ref={latest} className="comments-heading">
                    <h2>
                        Comments <span>({comments.length})</span>
                    </h2>
                </div>
                {comments.length ? (
                    [...comments]
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .map((comment) => (
                            <article
                                className="validation-comment"
                                key={comment.id}
                            >
                                <Avatar size={28}>{comment.author[0]}</Avatar>
                                <div>
                                    <header>
                                        <strong>{comment.author}</strong>
                                        <time>
                                            {formatActivityTime(
                                                comment.createdAt,
                                            )}
                                            {comment.updatedAt && " · Edited"}
                                        </time>
                                    </header>
                                    {editing?.id === comment.id ? (
                                        <div className="comment-inline-edit">
                                            <Input.TextArea
                                                aria-label="Edit comment"
                                                autoSize={{ minRows: 3 }}
                                                value={editText}
                                                onChange={(event) =>
                                                    setEditText(
                                                        event.target.value,
                                                    )
                                                }
                                                disabled={busy}
                                            />
                                            <div>
                                                <Button
                                                    disabled={busy}
                                                    onClick={() =>
                                                        setEditing(undefined)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    loading={busy}
                                                    disabled={
                                                        !editText.trim() ||
                                                        editText.trim() ===
                                                            comment.text
                                                    }
                                                    onClick={() =>
                                                        void submit("edit")
                                                    }
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>{comment.text}</p>
                                    )}
                                </div>
                                {comment.authorId === CURRENT_USER.id &&
                                    editing?.id !== comment.id && (
                                        <div className="comment-actions">
                                            <Button
                                                type="text"
                                                size="small"
                                                aria-label="Edit comment"
                                                icon={<EditOutlined />}
                                                disabled={busy}
                                                onClick={() => {
                                                    setEditing(comment);
                                                    setEditText(comment.text);
                                                }}
                                            />
                                            <Button
                                                type="text"
                                                size="small"
                                                aria-label="Delete comment"
                                                icon={<DeleteOutlined />}
                                                disabled={busy}
                                                onClick={() =>
                                                    setDeleting(comment)
                                                }
                                            />
                                        </div>
                                    )}
                            </article>
                        ))
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Start the conversation"
                    />
                )}
            </section>
            <div
                className={`validation-composer ${expanded ? "is-expanded" : ""}`}
                style={{
                    left: bounds.left,
                    width: bounds.width,
                    visibility: bounds.width ? "visible" : "hidden",
                }}
            >
                <Input.TextArea
                    aria-label="Add a comment"
                    placeholder="Add a comment..."
                    value={text}
                    disabled={busy}
                    rows={expanded ? 4 : 1}
                    onFocus={() => setExpanded(true)}
                    onChange={(event) => setText(event.target.value)}
                />
                {expanded && (
                    <div>
                        <Button
                            disabled={busy}
                            onClick={() => {
                                setText("");
                                setExpanded(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            loading={busy}
                            disabled={!text.trim()}
                            onClick={() => void submit("add")}
                        >
                            Send
                        </Button>
                    </div>
                )}
            </div>
            <Modal
                title="Delete this comment?"
                open={!!deleting}
                onCancel={() => !busy && setDeleting(undefined)}
                onOk={() => void submit("delete")}
                confirmLoading={busy}
                okText="Delete"
                okButtonProps={{ danger: true }}
                cancelButtonProps={{ disabled: busy }}
                closable={!busy}
                centered
            >
                <p>
                    This comment will be removed. Its activity will remain in
                    the Change Log.
                </p>
            </Modal>
        </>
    );
}
