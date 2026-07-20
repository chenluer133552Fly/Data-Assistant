import { ArrowRight } from "lucide-react";
import type { DataSourceStatus } from "../types/domain";
import { DataAccessActions } from "./DataAccessActions";

type QuestionComposerProps = {
  examplesExpanded: boolean;
  floating?: boolean;
  question: string;
  sourceStatus: DataSourceStatus;
  onChange: (value: string) => void;
  onConnect: () => void;
  onNewConversation: () => void;
  onSubmit: () => void;
  onUpload: () => void;
  onSlash: () => void;
};

export function QuestionComposer({
  examplesExpanded,
  floating = false,
  question,
  sourceStatus,
  onChange,
  onConnect,
  onNewConversation,
  onSubmit,
  onSlash,
  onUpload,
}: QuestionComposerProps) {
  const canSubmit = question.trim().length > 0 && sourceStatus === "connected";

  return (
    <section
      className={`overflow-hidden border border-[#DDE5EF] bg-white [border-radius:8px] ${
        floating
          ? "shadow-[0_20px_56px_rgba(48,62,84,0.18)]"
          : "mt-6 shadow-[0_18px_42px_rgba(75,91,118,0.08)]"
      }`}
    >
      <div className="flex h-[54px] items-center gap-3 border-b border-[#E5EAF0] px-4">
        {!floating ? (
          <button
            aria-label="Show examples"
            aria-expanded={examplesExpanded}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#238CF0] transition hover:text-[#005EB8]"
            data-example-trigger="true"
            onClick={onSlash}
            type="button"
          >
            <span className="text-[22px] font-semibold leading-none">/</span>
          </button>
        ) : null}
        <input
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#27313F] placeholder:text-[#9AA5B4] focus:outline-none"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canSubmit) onSubmit();
            if (event.key === "/" && !floating && !examplesExpanded) onSlash();
          }}
          placeholder={
            floating
              ? "Ask a follow-up question"
              : "Ask me a question,  Enter [ / ] view example sentences"
          }
          value={question}
        />
        <button
          aria-label="Submit question"
          className="flex h-8 w-11 shrink-0 items-center justify-center bg-black text-white transition enabled:hover:bg-[#23838B] disabled:cursor-not-allowed disabled:bg-[#D9DEE5] disabled:text-[#9AA5B4] [border-radius:8px]"
          disabled={!canSubmit}
          onClick={onSubmit}
          title={canSubmit ? "Submit question" : "Enter a question to submit"}
          type="button"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <DataAccessActions
        onConnect={onConnect}
        onNewConversation={onNewConversation}
        onUpload={onUpload}
        status={sourceStatus}
      />
    </section>
  );
}
