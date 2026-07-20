import {
  ClipboardList,
  Link2,
  MessageSquare,
  Pin,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

type FollowUpActionsProps = {
  questions: string[];
  onFeedback: () => void;
  onSelectQuestion: (question: string) => void;
};

export function FollowUpActions({
  onFeedback,
  onSelectQuestion,
  questions,
}: FollowUpActionsProps) {
  return (
    <section className="assistant-card px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 pr-4 text-base font-semibold text-[#2F3744]">
          <MessageSquare className="h-5 w-5 text-[#4F5F75]" />
          Follow-up questions
        </div>
        <div className="h-8 w-px bg-[#DCE4ED]" />
        <IconAction label="Like" onClick={() => undefined}>
          <ThumbsUp className="h-4 w-4" />
        </IconAction>
        <IconAction label="Feedback" onClick={onFeedback}>
          <ThumbsDown className="h-4 w-4" />
        </IconAction>
        <button
          className="inline-flex h-10 items-center gap-2 border border-[#BCD3F0] bg-[#EEF6FF] px-4 text-sm font-semibold text-[#2F3744] shadow-[0_8px_18px_rgba(62,102,153,0.08)] [border-radius:8px]"
          type="button"
        >
          <Pin className="h-4 w-4 text-[#597AA5]" />
          Pinned
        </button>
        <button className="control-button h-10" type="button">
          <ClipboardList className="h-4 w-4" />
          Create Report
        </button>
        <button className="control-button h-10" type="button">
          <Link2 className="h-4 w-4" />
          Superset
        </button>
      </div>

      <div className="mt-5 flex flex-col items-start gap-3">
        {questions.map((question) => (
          <button
            className="max-w-[680px] border border-[#E1E7EF] bg-white px-5 py-3 text-left text-sm text-[#3B4554] transition hover:border-[#9CC7E8] hover:text-[#1B84B7] [border-radius:8px]"
            key={question}
            onClick={() => onSelectQuestion(question)}
            type="button"
          >
            {question}
          </button>
        ))}
      </div>
    </section>
  );
}

function IconAction({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center border border-[#DCE4ED] bg-white text-[#64748B] transition hover:border-[#9CC7E8] hover:text-[#1B84B7] [border-radius:8px]"
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
