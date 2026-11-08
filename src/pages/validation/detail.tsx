import { useCallback, useEffect, useRef, useState } from "react";
import {
    App,
    Alert,
    Button,
    Drawer,
    Input,
    Modal,
    Rate,
    Result,
    Tooltip,
} from "antd";
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    EditOutlined,
    HistoryOutlined,
    LockOutlined,
    StarOutlined,
} from "@ant-design/icons";
import {
    useBeforeUnload,
    useBlocker,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { CURRENT_USER } from "../../common/mock-data";
import { mockApi } from "../../common/services/mock-api";
import { createValidationState, overallRating } from "../../common/validation";
import { useWorkspace } from "../../common/use-workspace";
import { ListState } from "../../components/ui";
import { useIdeaOperations } from "../../components/use-idea-operations";
import { ValidationContent } from "./content";
import { ChangeLog } from "./change-log";
import { ValidationComments } from "./comments";
import "./style.css";

export default function ValidationDetailPage() {
    const { id } = useParams();
    return <ValidationDetail key={id} />;
}

function ValidationDetail() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const { message } = App.useApp();
    const { database, loading, error, reload, update } = useWorkspace();
    const idea = database.validation.find((item) => item.id === id);
    const state =
        idea?.validation ?? (idea ? createValidationState(idea) : undefined);
    const [token] = useState(() => crypto.randomUUID());
    const editRequested = useRef(false);
    const editMounted = useRef(true);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<Record<string, string>>({});
    const [base, setBase] = useState<Record<string, string>>({});
    const [revision, setRevision] = useState(0);
    const [busy, setBusy] = useState(false);
    const [sourceOpen, setSourceOpen] = useState(false);
    const [logOpen, setLogOpen] = useState(false);
    const [rateOpen, setRateOpen] = useState(false);
    const [reopenOpen, setReopenOpen] = useState(false);
    const [dimensions, setDimensions] = useState([0, 0, 0]);
    const [reason, setReason] = useState("");
    const [cancelOpen, setCancelOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const dirty = editing && JSON.stringify(draft) !== JSON.stringify(base);
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            dirty && currentLocation.pathname !== nextLocation.pathname,
    );
    useBeforeUnload(
        useCallback(
            (event) => {
                if (dirty) {
                    event.preventDefault();
                    event.returnValue = "";
                }
            },
            [dirty],
        ),
    );
    const { remove, dialogs } = useIdeaOperations(
        "validation",
        () => {
            setEditing(false);
            setDeleted(true);
        },
        token,
    );
    const locked =
        !!state?.lock &&
        (state.lock.userId !== CURRENT_USER.id || state.lock.token !== token);
    const validated = state?.status === "validated";

    useEffect(() => {
        editMounted.current = true;
        const sessionToken = token;
        const release = () => {
            void mockApi
                .releaseEdit(id, sessionToken)
                .then(update)
                .catch(() => {});
        };
        window.addEventListener("pagehide", release);
        return () => {
            editMounted.current = false;
            window.removeEventListener("pagehide", release);
            release();
        };
    }, [id, token, update]);
    useEffect(() => {
        if (deleted && !editing)
            void navigate("/validation", { replace: true });
    }, [deleted, editing, navigate]);

    async function report(cause: unknown) {
        void message.error(
            cause instanceof Error
                ? cause.message
                : "Unable to complete this action.",
        );
        try {
            update(await mockApi.load());
        } catch {
            /* retain the current view on network failure */
        }
    }
    async function beginEdit() {
        if (busy || editing) return;
        setBusy(true);
        try {
            const result = await mockApi.acquireEdit(id, token);
            if (!editMounted.current) {
                await mockApi.releaseEdit(id, token);
                return;
            }
            update(result);
            const next = result.validation.find(
                (item) => item.id === id,
            )!.validation!;
            setDraft(structuredClone(next.content));
            setBase(structuredClone(next.content));
            setRevision(next.revision);
            setEditing(true);
        } catch (cause) {
            await report(cause);
        } finally {
            if (editMounted.current) setBusy(false);
        }
    }
    useEffect(() => {
        if (
            params.get("edit") === "1" &&
            idea &&
            !loading &&
            !editRequested.current
        ) {
            editRequested.current = true;
            setParams({}, { replace: true });
            void beginEdit();
        }
    });

    async function finishEdit(save: boolean) {
        if (busy) return;
        setBusy(true);
        try {
            const result = save
                ? await mockApi.saveEdit(id, token, revision, draft)
                : await mockApi.releaseEdit(id, token);
            update(result);
            setEditing(false);
            setCancelOpen(false);
            if (save) void message.success("Save Changes Successfully");
        } catch (cause) {
            await report(cause);
        } finally {
            setBusy(false);
        }
    }
    async function submitValidation(reopen: boolean) {
        if (busy) return;
        setBusy(true);
        try {
            update(
                reopen
                    ? await mockApi.reopen(id, reason)
                    : await mockApi.rate(id, dimensions),
            );
            setRateOpen(false);
            setReopenOpen(false);
            void message.success(
                reopen ? "Validation reopened" : "Idea validated",
            );
        } catch (cause) {
            await report(cause);
        } finally {
            setBusy(false);
        }
    }

    if (loading || error)
        return (
            <ListState
                loading={loading}
                error={error}
                retry={() => void reload()}
            />
        );
    if (!idea || !state)
        return (
            <Result
                status="404"
                title="Validation idea not found"
                subTitle="This copy may have been deleted. Records in other modules are unaffected."
                extra={
                    <Button onClick={() => void navigate("/validation")}>
                        Back to Validation
                    </Button>
                }
            />
        );
    return (
        <div className="validation-detail" key={id}>
            <Button
                type="text"
                className="validation-back"
                icon={<ArrowLeftOutlined />}
                onClick={() => void navigate("/validation")}
            >
                Back to Validation
            </Button>
            <header className="validation-title">
                <div className="validation-title-top">
                    <div className="validation-labels">
                        <span
                            className={`validation-status ${validated ? "is-validated" : ""}`}
                        >
                            {validated
                                ? `Validated ${state.rating?.score.toFixed(2)} / 5`
                                : "Draft"}
                        </span>
                        <span>Product: {idea.product}</span>
                        <span>Segment: {idea.segment}</span>
                        <span>Objective: {idea.objective}</span>
                        <span>Copied by: {idea.copiedBy}</span>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => setSourceOpen(true)}
                        >
                            View Source Public Idea ›
                        </Button>
                    </div>
                    <Tooltip
                        title={
                            locked
                                ? `Editing by ${state.lock?.name}`
                                : "Delete idea"
                        }
                    >
                        <Button
                            aria-label="Delete idea"
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            disabled={busy || locked}
                            onClick={() => remove(idea)}
                        />
                    </Tooltip>
                </div>
                <h1>{idea.title}</h1>
                <div className="validation-title-actions">
                    {editing ? (
                        <>
                            <Button
                                disabled={busy || !dirty}
                                onClick={() => setCancelOpen(true)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                loading={busy}
                                disabled={!dirty}
                                onClick={() => void finishEdit(true)}
                            >
                                Save Changes
                            </Button>
                            <Button
                                type="text"
                                disabled={busy}
                                onClick={() =>
                                    dirty
                                        ? setCancelOpen(true)
                                        : void finishEdit(false)
                                }
                            >
                                Exit editing
                            </Button>
                        </>
                    ) : (
                        <>
                            <Tooltip
                                title={
                                    locked
                                        ? `Editing by ${state.lock?.name}`
                                        : validated
                                          ? "Reopen validation before editing"
                                          : "Edit the idea content"
                                }
                            >
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    disabled={busy || locked || validated}
                                    onClick={() => void beginEdit()}
                                >
                                    Edit
                                </Button>
                            </Tooltip>
                            {CURRENT_USER.canValidate && (
                                <Tooltip
                                    title={
                                        locked
                                            ? `Editing by ${state.lock?.name}`
                                            : "The latest submitted rating replaces the previous rating. Validated content cannot be edited until reopened."
                                    }
                                >
                                    <Button
                                        icon={<StarOutlined />}
                                        disabled={busy || locked}
                                        onClick={() => {
                                            if (validated) {
                                                setReason("");
                                                setReopenOpen(true);
                                            } else {
                                                setDimensions([0, 0, 0]);
                                                setRateOpen(true);
                                            }
                                        }}
                                    >
                                        {validated
                                            ? "Reopen Validation"
                                            : "Validate"}
                                    </Button>
                                </Tooltip>
                            )}
                        </>
                    )}
                    <Button
                        icon={<HistoryOutlined />}
                        onClick={() => setLogOpen(true)}
                    >
                        Change Log
                    </Button>
                </div>
                {locked && (
                    <Alert
                        type="info"
                        showIcon
                        icon={<LockOutlined />}
                        title={`Editing by ${state.lock?.name}`}
                        description="You can review this idea and leave comments while editing is locked."
                    />
                )}
            </header>
            <ValidationContent
                idea={idea}
                content={editing ? draft : state.content}
                editing={editing}
                onChange={(title, text) =>
                    setDraft((previous) => ({ ...previous, [title]: text }))
                }
            />
            <ValidationComments ideaId={id} comments={state.comments} />
            <Drawer
                title="Source Public Idea"
                open={sourceOpen}
                onClose={() => setSourceOpen(false)}
                size="min(1120px, 95vw)"
                className="validation-source-drawer"
            >
                <div className="validation-source-heading">
                    <span>
                        Source Public Idea ID: {state.source.id} · Created by{" "}
                        {state.source.author}
                    </span>
                    <h2>{state.source.title}</h2>
                </div>
                <ValidationContent idea={state.source} />
            </Drawer>
            <ChangeLog
                open={logOpen}
                onClose={() => setLogOpen(false)}
                logs={state.logs}
            />
            <Modal
                title="Rate this idea"
                open={rateOpen}
                centered
                width={390}
                onCancel={() => !busy && setRateOpen(false)}
                onOk={() => void submitValidation(false)}
                okText="Submit"
                confirmLoading={busy}
                cancelButtonProps={{ disabled: busy }}
                closable={!busy}
                mask={{ closable: !busy }}
            >
                <p className="rating-description">
                    Rate this idea independently across all 3 dimensions.
                </p>
                {["Accuracy", "Relevance", "Completeness"].map(
                    (label, index) => (
                        <div className="rating-dimension" key={label}>
                            <div>
                                <label>{label}</label>
                                <span>
                                    {dimensions[index].toFixed(1)} / 5.0
                                </span>
                            </div>
                            <Rate
                                aria-label={label}
                                allowHalf
                                allowClear
                                value={dimensions[index]}
                                disabled={busy}
                                onChange={(value) =>
                                    setDimensions((previous) =>
                                        previous.map((old, position) =>
                                            position === index ? value : old,
                                        ),
                                    )
                                }
                            />
                        </div>
                    ),
                )}
                <div className="rating-overall">
                    My overall score:{" "}
                    <strong>{overallRating(dimensions).toFixed(2)}</strong>
                </div>
            </Modal>
            <Modal
                title="Reopen Validation?"
                centered
                width={420}
                open={reopenOpen}
                onCancel={() => !busy && setReopenOpen(false)}
                onOk={() => void submitValidation(true)}
                okText="Reopen Validation"
                confirmLoading={busy}
                cancelButtonProps={{ disabled: busy }}
                closable={!busy}
                mask={{ closable: !busy }}
            >
                <p className="rating-description">
                    This idea will return to Draft for further assessment. The
                    current rating will be cleared and editing will be enabled.
                </p>
                <Input.TextArea
                    aria-label="Reason for reopening"
                    placeholder="Reason for reopening this validation (optional)"
                    rows={4}
                    disabled={busy}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                />
            </Modal>
            <Modal
                title="Discard Changes?"
                open={cancelOpen || blocker.state === "blocked"}
                centered
                closable={!busy}
                mask={{ closable: !busy }}
                onCancel={() => {
                    setCancelOpen(false);
                    if (blocker.state === "blocked") blocker.reset();
                }}
                footer={
                    <>
                        <Button
                            disabled={busy}
                            onClick={() => {
                                setCancelOpen(false);
                                if (blocker.state === "blocked")
                                    blocker.reset();
                            }}
                        >
                            Keep Editing
                        </Button>
                        <Button
                            danger
                            loading={busy}
                            onClick={() => {
                                if (blocker.state === "blocked") {
                                    setEditing(false);
                                    void mockApi.releaseEdit(id, token);
                                    blocker.proceed();
                                } else void finishEdit(false);
                            }}
                        >
                            Discard Changes
                        </Button>
                    </>
                }
            >
                <p>
                    You have unsaved changes. Are you sure you want to discard
                    them?
                </p>
            </Modal>
            {dialogs}
        </div>
    );
}
