import { useEffect, useRef } from "react";
import { ChevronRight, RefreshCw, Rows3 } from "lucide-react";
import type { ExampleType } from "../types/domain";

type ExampleQuestionsProps = {
  activeType: ExampleType;
  examples: Record<ExampleType, string[]>;
  expanded: boolean;
  onRefresh: () => void;
  onSelect: (question: string) => void;
  onSetType: (type: ExampleType) => void;
  onClose: () => void;
};

export function ExampleQuestions({
  activeType,
  examples,
  expanded,
  onRefresh,
  onSelect,
  onSetType,
  onClose,
}: ExampleQuestionsProps) {
  const panelRef = useRef<HTMLElement>(null);
  const activeExamples = examples[activeType];

  useEffect(() => {
    if (!expanded) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (
        panelRef.current?.contains(target) ||
        target.closest('[data-example-trigger="true"]')
      ) {
        return;
      }

      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded, onClose]);

  if (!expanded) return null;

  return (
    <section
      aria-label="Example questions"
      className="relative z-20 h-0"
      ref={panelRef}
    >
      <div className="absolute inset-x-0 top-2 max-h-[390px] overflow-y-auto border border-[#DDE5EF] bg-white shadow-[0_18px_42px_rgba(75,91,118,0.16)] [border-radius:8px]">
        <div className="px-4 pt-4 text-xs font-medium text-[#7B8797]">Examples</div>
        <div className="flex items-center justify-between border-b border-[#E5EAF0] px-4 pt-3">
            <div className="flex gap-4">
              <TabButton
                active={activeType === "recommended"}
                label="Recommended"
                onClick={() => onSetType("recommended")}
              />
              <TabButton
                active={activeType === "frequent"}
                label="Frequent"
                onClick={() => onSetType("frequent")}
              />
            </div>
            <button className="soft-button mb-2" onClick={onRefresh} type="button">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          {activeExamples.length ? (
            <div className="divide-y divide-[#E8EDF2] px-4">
              {activeExamples.map((item) => (
                <button
                  className="flex w-full items-center justify-between gap-4 py-3 text-left text-[14px] leading-5 text-[#27313F] transition hover:text-[#1B84B7]"
                  key={item}
                  onClick={() => onSelect(item)}
                  type="button"
                >
                  <span>{item}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#A3ACB5]" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-44 flex-col items-center justify-center gap-2 text-[#9AA3AD]">
              <Rows3 className="h-8 w-8 text-[#C7D0D8]" />
              <span className="text-sm">No Data</span>
            </div>
          )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`border-b-2 px-1 pb-3 text-sm transition ${
        active
          ? "border-[#23838B] font-medium text-[#27313F]"
          : "border-transparent text-[#6E7781] hover:text-[#27313F]"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
