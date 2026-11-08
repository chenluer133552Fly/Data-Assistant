import { useState } from "react";
import { App, Button, Checkbox, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
    getSkipConfirmation,
    mockApi,
    setSkipConfirmation,
} from "../common/services/mock-api";
import { useWorkspace } from "../common/use-workspace";
import type { Idea } from "../common/types";

export function useIdeaOperations(
    module: "leads" | "community" | "validation",
    onRemoved?: () => void,
    editToken?: string,
) {
    const { message, notification } = App.useApp();
    const { update } = useWorkspace();
    const navigate = useNavigate();
    const [publishTarget, setPublishTarget] = useState<Idea | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Idea | null>(null);
    const [skip, setSkip] = useState(false);
    const [busy, setBusy] = useState(false);
    const [directPublishing, setDirectPublishing] = useState(false);
    const reportError = (error: unknown) => {
        void message.error(
            error instanceof Error
                ? error.message
                : "Unable to complete this action. Please try again.",
        );
    };
    async function doPublish(idea: Idea) {
        update(await mockApi.publish(idea));
        void message.success("Idea published to Ideation Community");
    }
    async function publish(idea: Idea) {
        if (directPublishing) return;
        if (getSkipConfirmation()) {
            setDirectPublishing(true);
            try {
                await doPublish(idea);
            } catch (error) {
                reportError(error);
            } finally {
                setDirectPublishing(false);
            }
        } else {
            setSkip(false);
            setPublishTarget(idea);
        }
    }
    async function confirmPublish() {
        if (!publishTarget || busy) return;
        setBusy(true);
        if (skip) setSkipConfirmation();
        try {
            await doPublish(publishTarget);
            setPublishTarget(null);
        } catch (error) {
            reportError(error);
        } finally {
            setBusy(false);
        }
    }
    async function confirmDelete() {
        if (!deleteTarget || busy) return;
        setBusy(true);
        try {
            update(await mockApi.remove(module, deleteTarget.id, editToken));
            setDeleteTarget(null);
            onRemoved?.();
            void message.success("Idea deleted");
        } catch (error) {
            reportError(error);
        } finally {
            setBusy(false);
        }
    }
    async function copy(idea: Idea) {
        try {
            const result = await mockApi.copy(idea);
            const copyId = result.validation[0].id;
            update(result);
            notification.success({
                key: "copy-success",
                duration: 3,
                placement: "bottom",
                closable: false,
                pauseOnHover: false,
                role: "status",
                className: "copy-toast",
                style: {
                    width: "max-content",
                    maxWidth: "calc(100vw - 24px)",
                    padding: "10px 14px",
                },
                styles: {
                    title: {
                        fontSize: 12,
                        fontWeight: 400,
                        marginBottom: 0,
                        marginInlineStart: 24,
                    },
                    icon: { fontSize: 15, lineHeight: "24px" },
                },
                title: (
                    <span>
                        Editable copy created in Validation{" "}
                        <Button
                            size="small"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                notification.destroy("copy-success");
                                void navigate(`/validation/${copyId}`);
                            }}
                        >
                            View
                        </Button>
                    </span>
                ),
            });
        } catch (error) {
            reportError(error);
        }
    }
    const dialogs = (
        <>
            <Modal
                title="Make this Idea Public?"
                open={!!publishTarget}
                onCancel={() => !busy && setPublishTarget(null)}
                onOk={() => void confirmPublish()}
                confirmLoading={busy}
                okText="OK"
                mask={{ closable: false }}
                cancelButtonProps={{ disabled: busy }}
                closable={!busy}
                centered
                width={450}
            >
                <p className="modal-description m-[18px_0_20px] text-[#6d7973] leading-[1.8] text-[13px]">
                    This idea will be published to the Ideation Community and
                    become publicly visible. Others can discover and copy this
                    idea to Validation.
                </p>
                <Checkbox
                    checked={skip}
                    disabled={busy}
                    onChange={(event) => setSkip(event.target.checked)}
                >
                    Do not remind me again
                </Checkbox>
            </Modal>
            <Modal
                title={
                    module === "community"
                        ? "Delete this public Idea?"
                        : "Delete this Idea?"
                }
                open={!!deleteTarget}
                onCancel={() => !busy && setDeleteTarget(null)}
                onOk={() => void confirmDelete()}
                confirmLoading={busy}
                okText="Delete"
                okButtonProps={{ danger: true }}
                cancelButtonProps={{ disabled: busy }}
                closable={!busy}
                mask={{ closable: false }}
                centered
                width={460}
            >
                <p className="modal-description m-[18px_0_20px] text-[#6d7973] leading-[1.8] text-[13px]">
                    {module === "validation"
                        ? "This will delete this copy from Validation. The public idea in Ideation Community and all records in other modules will remain available."
                        : module === "community"
                          ? "This will remove your idea from Ideation Community. The original idea in Leads Ideation and any copies in Validation will remain available."
                          : "This will permanently delete this idea from Leads Ideation. Any versions already published to Ideation Community or copied to Validation will remain available."}
                </p>
            </Modal>
        </>
    );
    return { publish, copy, remove: setDeleteTarget, dialogs };
}
