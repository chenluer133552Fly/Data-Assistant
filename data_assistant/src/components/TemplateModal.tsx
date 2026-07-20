import { CalendarDays, ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { QuestionTemplate, TemplateFormField, TemplateOption } from "../types/domain";

type TemplateModalProps = {
  template: QuestionTemplate | null;
  onClose: () => void;
  onSubmit: (template: QuestionTemplate, values: Record<string, string>) => void;
};

export function TemplateModal({ onClose, onSubmit, template }: TemplateModalProps) {
  const [activeTab, setActiveTab] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});

  const tabs = template?.form?.tabs ?? [];
  const resolvedActiveTab = activeTab || tabs[0]?.id || "";
  const activeFields = useMemo(
    () => tabs.find((tab) => tab.id === resolvedActiveTab)?.fields ?? [],
    [resolvedActiveTab, tabs],
  );

  if (!template?.form) return null;

  const updateValue = (fieldId: string, value: string) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6 max-sm:p-3">
      <section className="flex h-[calc(100vh-48px)] max-h-[720px] w-full max-w-[920px] flex-col overflow-hidden bg-white shadow-[0_24px_80px_rgba(17,24,39,0.28)] max-sm:h-[calc(100vh-24px)] [border-radius:8px]">
        <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#E4E9EF] px-6">
          <h2 className="text-base font-semibold text-[#2F3744]">{template.form.title}</h2>
          <button
            aria-label="Close template form"
            className="icon-button border-transparent shadow-none"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="shrink-0 px-6 pt-4">
          <div className="flex gap-8 border-b border-[#E9EEF4]">
            {tabs.map((tab) => (
              <button
                className={`border-b-2 pb-3 text-sm font-medium transition ${
                  resolvedActiveTab === tab.id
                    ? "border-[#238CF0] text-[#2F3744]"
                    : "border-transparent text-[#7B8797] hover:text-[#2F3744]"
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4">
            {activeFields.map((field) => (
              <FieldRow
                field={field}
                key={field.id}
                onChange={(value) => updateValue(field.id, value)}
                value={values[field.id] ?? ""}
              />
            ))}
          </div>
        </div>

        <footer className="flex h-[58px] shrink-0 items-center justify-end border-t border-[#E9EEF4] px-4">
          <button
            className="bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-[#23838B] [border-radius:8px]"
            onClick={() => onSubmit(template, values)}
            type="button"
          >
            Submit
          </button>
        </footer>
      </section>
    </div>
  );
}

function FieldRow({
  field,
  onChange,
  value,
}: {
  field: TemplateFormField;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="grid min-h-10 grid-cols-[150px_minmax(0,1fr)] items-start gap-5 text-sm max-md:grid-cols-1">
      <label className="pt-2 font-medium leading-5 text-[#333B48]" htmlFor={field.id}>
        {field.label}
      </label>
      <div className="min-w-0">
        <FieldControl field={field} onChange={onChange} value={value} />
        {field.quickOptions?.length ? (
          <QuickOptions
            activeValue={value}
            label="Quick Options"
            onChange={onChange}
            options={field.quickOptions}
          />
        ) : null}
      </div>
    </div>
  );
}

function FieldControl({
  field,
  onChange,
  value,
}: {
  field: TemplateFormField;
  onChange: (value: string) => void;
  value: string;
}) {
  if (field.type === "select") {
    return (
      <div className="relative w-[220px] max-w-full">
        <select
          className="h-10 w-full appearance-none border border-[#E1E7EF] bg-[#F7F9FC] px-4 text-sm text-[#4D5D73] outline-none transition focus:border-[#238CF0] [border-radius:6px]"
          id={field.id}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">{field.placeholder ?? "All"}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#8995A5]" />
      </div>
    );
  }

  if (field.type === "multi-choice" || field.type === "radio") {
    return (
      <QuickOptions
        activeValue={value}
        onChange={onChange}
        options={field.options ?? []}
        strongFirst={field.type === "multi-choice"}
      />
    );
  }

  if (field.type === "range" || field.type === "date-range" || field.type === "amount-range") {
    const separator = field.type === "range" ? "-" : "->";

    return (
      <div className="flex w-[260px] max-w-full items-center border border-[#E1E7EF] bg-[#F7F9FC] px-3 [border-radius:6px]">
        <input
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#4D5D73] outline-none placeholder:text-[#B7C0CE]"
          id={field.id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.minPlaceholder}
          value={value.split("|")[0] ?? ""}
        />
        <span className="px-2 text-[#A7B2C1]">{separator}</span>
        <input
          className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#4D5D73] outline-none placeholder:text-[#B7C0CE]"
          onChange={(event) => onChange(`${value.split("|")[0] ?? ""}|${event.target.value}`)}
          placeholder={field.maxPlaceholder}
          value={value.split("|")[1] ?? ""}
        />
        {field.type !== "range" ? (
          <span className="pl-2 text-[#8D98A8]">{field.type === "amount-range" ? "¥" : ""}</span>
        ) : null}
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="relative w-[260px] max-w-full">
        <input
          className="h-10 w-full border border-[#E1E7EF] bg-[#F7F9FC] px-4 pr-10 text-sm text-[#4D5D73] outline-none placeholder:text-[#B7C0CE] focus:border-[#238CF0] [border-radius:6px]"
          id={field.id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          value={value}
        />
        <CalendarDays className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-[#8D98A8]" />
      </div>
    );
  }

  return (
    <input
      className="h-10 w-[260px] max-w-full border border-[#E1E7EF] bg-[#F7F9FC] px-4 text-sm text-[#4D5D73] outline-none placeholder:text-[#B7C0CE] focus:border-[#238CF0] [border-radius:6px]"
      id={field.id}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      value={value}
    />
  );
}

function QuickOptions({
  activeValue,
  label,
  onChange,
  options,
  strongFirst,
}: {
  activeValue: string;
  label?: string;
  onChange: (value: string) => void;
  options: TemplateOption[];
  strongFirst?: boolean;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${label ? "mt-2" : ""}`}>
      {label ? <span className="mr-1 text-sm text-[#99A4B3]">{label}</span> : null}
      {options.map((option, index) => {
        const active = activeValue === option.value || (!activeValue && strongFirst && index === 0);

        return (
          <button
            className={`h-8 border px-4 text-sm transition [border-radius:6px] ${
              active
                ? "border-black bg-black text-white"
                : "border-[#E1E7EF] bg-white text-[#4D5D73] hover:border-[#9CC7E8]"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
