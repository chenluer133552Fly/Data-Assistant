import { Check, Database, Loader2 } from "lucide-react";
import type { QueryStep, QueryStepStatus } from "../types/domain";

type QueryProcessProps = {
  showMetadata: boolean;
  steps: QueryStep[];
  onToggleMetadata: () => void;
};

export function QueryProcess({
  showMetadata,
  steps,
  onToggleMetadata,
}: QueryProcessProps) {
  return (
    <section className="assistant-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E2E8EF] px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#586471]">
          Answer process
        </h2>
        <button className="soft-button" onClick={onToggleMetadata} type="button">
          <Database className="h-4 w-4" />
          {showMetadata ? "Hide metadata" : "Show metadata"}
        </button>
      </div>
      <div className="space-y-4 px-5 py-5">
        {steps.map((step, index) => (
          <div className="grid gap-3 sm:grid-cols-[86px_minmax(0,1fr)]" key={step.id}>
            <div
              className={`inline-flex h-7 w-fit items-center px-3 font-mono text-[11px] uppercase tracking-[0.12em] [border-radius:6px] ${
                step.status === "pending"
                  ? "bg-[#EEF2F6] text-[#7D8999]"
                  : "bg-[#05070A] text-white"
              }`}
            >
              STEP {String(index + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StepStatusIcon status={step.status} />
                <p className="font-mono text-sm text-[#222934]">{step.name}</p>
              </div>
              <p className="mt-1 font-mono text-xs italic text-[#6E7781]">{step.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepStatusIcon({ status }: { status: QueryStepStatus }) {
  if (status === "running") {
    return <Loader2 className="h-4 w-4 animate-spin text-[#23838B]" />;
  }

  if (status === "success") {
    return <Check className="h-4 w-4 text-[#23838B]" />;
  }

  if (status === "failed") {
    return <span className="h-3 w-3 bg-[#DB0011] [border-radius:999px]" />;
  }

  return <span className="h-2.5 w-2.5 bg-[#B8C3CF] [border-radius:999px]" />;
}
