import { Info, Sparkles } from "lucide-react";
import type { Summary } from "../types/domain";

type SummaryPanelProps = {
  analyticalApproach: string;
  selectedCount: number;
  selectedRegions: string;
  summary: Summary;
  onApproachChange: (value: string) => void;
  onGenerate: () => void;
};

export function SummaryPanel({
  analyticalApproach,
  onApproachChange,
  onGenerate,
  selectedCount,
  selectedRegions,
  summary,
}: SummaryPanelProps) {
  return (
    <section className="assistant-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E2E8EF] px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#23838B]" />
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#586471]">
            Summarize Data
          </h2>
        </div>
        <button
          className="bg-[#05070A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#23838B] [border-radius:8px]"
          onClick={onGenerate}
          type="button"
        >
          Generate
        </button>
      </div>

      <div className="space-y-4 px-5 py-5">
        <label className="block bg-[#F8FAFC] p-4 [border-radius:8px]">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B96A1]">
            Specified analytical approach
          </span>
          <textarea
            className="mt-2 min-h-20 w-full resize-none bg-transparent text-sm leading-6 text-[#222934] outline-none"
            onChange={(event) => onApproachChange(event.target.value)}
            value={analyticalApproach}
          />
        </label>

        <div className="inline-flex items-center gap-2 border border-[#E2E8EF] bg-white px-3 py-2 text-sm text-[#6E7781] [border-radius:8px]">
          <Info className="h-4 w-4 text-[#23838B]" />
          Generated based on: Selected Data: {selectedCount} rows
        </div>

        <div className="border border-[#E2E8EF] bg-white px-4 py-3 [border-radius:8px]">
          <span className="font-semibold text-[#222934]">Conclusion </span>
          <span className="text-sm leading-6 text-[#586471]">
            Significant regional variance: Nanjing saw the sharpest decline{" "}
            <strong className="font-semibold text-[#05070A]">(-22%)</strong>, followed by
            Hangzhou <strong className="font-semibold text-[#05070A]">(-18%)</strong>.
          </span>
        </div>

        {summary.sections.map((section, index) => (
          <InsightSection
            items={
              index === 0
                ? [
                    ...section.items,
                    `Current selected regions: ${selectedRegions || "No selected region"}.`,
                  ]
                : section.items
            }
            key={section.title}
            title={section.title}
          />
        ))}
      </div>
    </section>
  );
}

function InsightSection({ items, title }: { items: string[]; title: string }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-[#222934]">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-[#586471]">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#23838B] [border-radius:999px]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
