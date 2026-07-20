import { useEffect, useState } from "react";
import { X } from "lucide-react";

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], details: string) => void;
};

const feedbackReasons = [
  "Irrelevant answer",
  "Incorrect data",
  "Incomplete information",
  "Incomprehensible",
];

export function FeedbackModal({ open, onClose, onSubmit }: FeedbackModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!open) return;

    setSelectedReasons([]);
    setDetails("");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const toggleReason = (reason: string) => {
    setSelectedReasons((current) =>
      current.includes(reason)
        ? current.filter((item) => item !== reason)
        : [...current, reason],
    );
  };

  const canSubmit = selectedReasons.length > 0 || details.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#263041]/45 p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="feedback-title"
        aria-modal="true"
        className="w-full max-w-[540px] overflow-hidden bg-white shadow-[0_28px_90px_rgba(20,29,43,0.30)] [border-radius:8px]"
        role="dialog"
      >
        <header className="flex h-14 items-center justify-between border-b border-[#E5EAF0] px-5">
          <h2 className="text-sm font-semibold text-[#303846]" id="feedback-title">
            Feedback
          </h2>
          <button
            aria-label="Close feedback"
            className="inline-flex h-8 w-8 items-center justify-center text-[#778496] transition hover:text-[#27313F]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 py-5">
          <p className="text-sm font-medium text-[#64748B]">What's wrong with this answer?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {feedbackReasons.map((reason) => {
              const selected = selectedReasons.includes(reason);

              return (
                <button
                  aria-pressed={selected}
                  className={`h-9 border px-3 text-xs font-medium transition [border-radius:6px] ${
                    selected
                      ? "border-[#8CB8E2] bg-[#EEF6FF] text-[#2F5F8B]"
                      : "border-[#E1E7EF] bg-[#F8FAFC] text-[#58677B] hover:border-[#A9BED3]"
                  }`}
                  key={reason}
                  onClick={() => toggleReason(reason)}
                  type="button"
                >
                  {reason}
                </button>
              );
            })}
          </div>

          <textarea
            aria-label="Feedback details"
            className="mt-4 min-h-24 w-full resize-y border border-[#E1E7EF] bg-white px-3 py-3 text-sm text-[#3E4856] placeholder:text-[#A7B1BF] focus:border-[#238CF0] focus:outline-none [border-radius:6px]"
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Tell us the specific reason so we can improve."
            value={details}
          />
        </div>

        <footer className="flex justify-end border-t border-[#E5EAF0] px-4 py-3">
          <button
            className="h-9 bg-black px-5 text-sm font-medium text-white transition enabled:hover:bg-[#23838B] disabled:cursor-not-allowed disabled:bg-[#D9DEE5] disabled:text-[#9AA5B4] [border-radius:6px]"
            disabled={!canSubmit}
            onClick={() => onSubmit(selectedReasons, details.trim())}
            type="button"
          >
            Submit
          </button>
        </footer>
      </section>
    </div>
  );
}
