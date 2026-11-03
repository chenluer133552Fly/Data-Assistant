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
  const [draft, setDraft] = useState<Selection>(() => structuredClone(initial));
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
      className="constraints-drawer"
      footer={
        <div className="drawer-footer">
          {step === 1 && (
            <Button onClick={() => setStep(0)}>Previous step</Button>
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
          { title: "Preferred CLCM Stage & Channels", subTitle: "(Optional)" },
        ]}
      />
      {step === 0 ? (
        <>
          <div className="drawer-signal-toolbar">
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
                      <span className="tab-count">
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
                      <span className="tab-count">{marketSignals.length}</span>
                    </>
                  ),
                },
              ]}
            />
            <div className="selection-count" aria-live="polite">
              <strong>{draft.signalIds.length}/5</strong> selected across all
              pages
            </div>
          </div>
          <div className="drawer-reset">
            <Button
              size="small"
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => {
                setDraft((previous) => ({ ...previous, signalIds: [] }));
                setPage(1);
              }}
            >
              Reselect signals
            </Button>
            <span>
              Selected signals stay selected. Use Reselect to start again.
            </span>
          </div>
          <div className="signal-list">
            {signals.slice((page - 1) * 10, page * 10).map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                selectable
                selected={draft.signalIds.includes(signal.id)}
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
        <div className="preference-form">
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
