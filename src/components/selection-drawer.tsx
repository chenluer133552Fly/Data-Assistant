import { useState } from "react";
import { App, Button, Checkbox, Drawer, Input, Steps, Tabs } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
    CHANNELS,
    customerSignals,
    marketSignals,
    STAGES,
} from "../common/mock-data";
import type { Selection } from "../common/types";
import { ListPagination, SignalCard } from "./ui";

export function SelectionDrawer({
    open,
    initial,
    onClose,
    onComplete,
}: {
    open: boolean;
    initial: Selection;
    onClose: () => void;
    onComplete: (selection: Selection) => void;
}) {
    // The parent remounts each editing session so a discarded draft cannot leak.
    const [draft, setDraft] = useState<Selection>(() =>
        structuredClone(initial),
    );
    const [step, setStep] = useState(0);
    const [tab, setTab] = useState("customer");
    const [page, setPage] = useState(1);
    const { message } = App.useApp();
    const signals = tab === "customer" ? customerSignals : marketSignals;
    function select(id: string) {
        if (draft.signalIds.includes(id)) return;
        if (draft.signalIds.length >= 5) {
            void message.warning("Select up to 5 items");
            return;
        }
        setDraft((previous) => ({
            ...previous,
            signalIds: [...previous.signalIds, id],
        }));
    }
    return (
        <Drawer
            title="Constraints"
            open={open}
            onClose={onClose}
            size={Math.min(950, window.innerWidth)}
            className="constraints-drawer [&_.ant-drawer-header]:p-[20px_25px] [&_.ant-drawer-body]:p-[22px_26px] [&_.ant-steps]:mb-[20px] [&_.ant-steps-item-title]:text-[12px] mobile:[&_.ant-drawer-body]:p-[15px] mobile:[&_.ant-steps-item-title]:text-[10px]"
            footer={
                <div className="drawer-footer flex gap-[10px] justify-end p-[5px_8px]">
                    {step === 1 && (
                        <Button onClick={() => setStep(0)}>
                            Previous step
                        </Button>
                    )}
                    {step === 0 ? (
                        <Button
                            type="primary"
                            disabled={!draft.signalIds.length}
                            onClick={() => setStep(1)}
                        >
                            Next Step
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            disabled={!draft.signalIds.length}
                            onClick={() => onComplete(structuredClone(draft))}
                        >
                            Complete Selection
                        </Button>
                    )}
                </div>
            }
        >
            <Steps
                size="small"
                current={step}
                items={[
                    { title: "Select Signals", subTitle: "*" },
                    {
                        title: "Preferred CLCM Stage & Channels",
                        subTitle: "(Optional)",
                    },
                ]}
            />
            {step === 0 ? (
                <>
                    <div className="drawer-signal-toolbar flex items-center justify-between gap-[15px] [&_.ant-tabs]:flex-1 [&_.ant-tabs]:min-w-0 [&_.ant-tabs-nav]:m-[0] [&_.ant-tabs-tab]:text-[12px] mobile:flex-wrap mobile:gap-[3px] mobile:[&_.ant-tabs]:basis-[100%] mobile:[&_.selection-count]:mt-[8px]">
                        <Tabs
                            activeKey={tab}
                            onChange={(key) => {
                                setTab(key);
                                setPage(1);
                            }}
                            items={[
                                {
                                    key: "customer",
                                    label: (
                                        <>
                                            Customer Signals{" "}
                                            <span className="tab-count text-[10px] text-[#899e97] ml-[7px] bg-[#eff4f1] rounded-[3px] p-[0_4px]">
                                                {customerSignals.length}
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    key: "market",
                                    label: (
                                        <>
                                            Market Signals{" "}
                                            <span className="tab-count text-[10px] text-[#899e97] ml-[7px] bg-[#eff4f1] rounded-[3px] p-[0_4px]">
                                                {marketSignals.length}
                                            </span>
                                        </>
                                    ),
                                },
                            ]}
                        />
                        <div
                            className="selection-count text-[#9a9ca4] text-[11px] whitespace-nowrap [&_strong]:text-[#498c74]"
                            aria-live="polite"
                        >
                            <strong>{draft.signalIds.length}/5</strong> selected
                            across all pages
                        </div>
                    </div>
                    <div className="drawer-reset flex items-center justify-between gap-[10px] m-[12px_0] [&_.ant-btn]:text-[#5f8475] [&_.ant-btn]:text-[11px] [&_>_span]:text-[10px] [&_>_span]:text-[#9aa29f] mobile:[&_>_span]:hidden">
                        <Button
                            size="small"
                            type="text"
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                setDraft((previous) => ({
                                    ...previous,
                                    signalIds: [],
                                }));
                                setPage(1);
                            }}
                        >
                            Reselect signals
                        </Button>
                        <span>
                            Selected signals stay selected. Use Reselect to
                            start again.
                        </span>
                    </div>
                    <div className="signal-list flex flex-col gap-[12px]">
                        {signals
                            .slice((page - 1) * 10, page * 10)
                            .map((signal) => (
                                <SignalCard
                                    key={signal.id}
                                    signal={signal}
                                    selectable
                                    selected={draft.signalIds.includes(
                                        signal.id,
                                    )}
                                    limited={
                                        draft.signalIds.length === 5 &&
                                        !draft.signalIds.includes(signal.id)
                                    }
                                    onSelect={() => select(signal.id)}
                                />
                            ))}
                    </div>
                    <ListPagination
                        page={page}
                        total={signals.length}
                        onChange={setPage}
                    />
                </>
            ) : (
                <div className="preference-form mt-[35px] [&_section]:mb-[29px] [&_h3]:text-[12px] [&_h3]:font-semibold [&_h3]:mb-[12px] [&_.ant-checkbox-group]:gap-[12px_18px] [&_textarea]:max-w-[600px] [&_textarea]:text-[12px]">
                    <section>
                        <h3>Preferred CLCM Stage</h3>
                        <Checkbox.Group
                            options={STAGES}
                            value={draft.stages}
                            onChange={(values) =>
                                setDraft((previous) => ({
                                    ...previous,
                                    stages: values.map(String),
                                }))
                            }
                        />
                    </section>
                    <section>
                        <h3>Preferred Channels</h3>
                        <Checkbox.Group
                            options={CHANNELS}
                            value={draft.channels}
                            onChange={(values) =>
                                setDraft((previous) => ({
                                    ...previous,
                                    channels: values.map(String),
                                }))
                            }
                        />
                    </section>
                    <section>
                        <h3>
                            <label htmlFor="additional-information">
                                Additional information or keywords
                            </label>
                        </h3>
                        <Input.TextArea
                            id="additional-information"
                            rows={6}
                            value={draft.notes}
                            placeholder="e.g. Focus on young customers interested in wealth management"
                            onChange={(event) =>
                                setDraft((previous) => ({
                                    ...previous,
                                    notes: event.target.value,
                                }))
                            }
                        />
                    </section>
                </div>
            )}
        </Drawer>
    );
}
