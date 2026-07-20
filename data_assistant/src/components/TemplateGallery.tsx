import { CirclePlus, RefreshCw } from "lucide-react";
import type { QuestionTemplate } from "../types/domain";

type TemplateGalleryProps = {
  canAddTemplates: boolean;
  examples: string[];
  templates: QuestionTemplate[];
  onAddTemplate: () => void;
  onNextGroup: () => void;
  onSelectExample: (question: string) => void;
  onSelectTemplate: (template: QuestionTemplate) => void;
};

export function TemplateGallery({
  canAddTemplates,
  examples,
  onAddTemplate,
  onNextGroup,
  onSelectExample,
  onSelectTemplate,
  templates,
}: TemplateGalleryProps) {
  if (!templates.length && examples.length) {
    return (
      <section className="mx-auto mt-10 flex max-w-[760px] flex-col items-center gap-4 text-center">
        <PromptHeader />
        <div className="flex flex-wrap justify-center gap-3">
          {examples.map((example, index) => (
            <button
              className={`border border-[#E3E8EF] bg-white px-5 py-3 text-sm text-[#4D5D73] shadow-[0_10px_24px_rgba(75,91,118,0.06)] transition hover:border-[#9CC7E8] hover:text-[#1B84B7] [border-radius:8px] ${
                index === 1 ? "min-w-[520px] max-md:min-w-0" : ""
              }`}
              key={example}
              onClick={() => onSelectExample(example)}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>
        <button
          className="inline-flex items-center gap-1 text-xs font-medium text-[#8492A6] transition hover:text-[#1B84B7]"
          onClick={onNextGroup}
          type="button"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Next Group
        </button>
      </section>
    );
  }

  if (!templates.length && !examples.length && !canAddTemplates) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-[#6B7A90]">Quick Question</h2>
        {templates.length ? (
          <button
            className="inline-flex items-center gap-1 text-xs font-medium text-[#8492A6] transition hover:text-[#1B84B7]"
            onClick={onNextGroup}
            type="button"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Next Group
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <button
            className="min-h-[88px] border border-[#E2E8EF] bg-white px-5 py-4 text-left shadow-[0_10px_26px_rgba(75,91,118,0.06)] transition hover:-translate-y-0.5 hover:border-[#9CC7E8] hover:shadow-[0_16px_32px_rgba(75,91,118,0.10)] [border-radius:8px]"
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            type="button"
          >
            <h3 className="text-sm font-semibold text-[#303846]">{template.title}</h3>
            <p className="mt-1 max-w-[260px] text-xs leading-5 text-[#5F6F84]">
              {template.description}
            </p>
          </button>
        ))}

        {canAddTemplates ? (
          <button
            className="flex min-h-[88px] flex-col items-center justify-center gap-2 border border-[#E2E8EF] bg-white text-[#718097] shadow-[0_10px_26px_rgba(75,91,118,0.05)] transition hover:border-[#9CC7E8] hover:text-[#1B84B7] [border-radius:8px]"
            onClick={onAddTemplate}
            type="button"
          >
            <CirclePlus className="h-4 w-4" />
            <span className="text-sm font-semibold">Add Templates</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}

function PromptHeader() {
  return (
    <header>
      <h2 className="text-[24px] font-semibold leading-tight text-[#3A404B]">Hi,Ember</h2>
      <p className="mt-1 text-[15px] text-[#6A7890]">Welcome to Data Assistant</p>
    </header>
  );
}
