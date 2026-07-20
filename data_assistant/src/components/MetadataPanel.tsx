import { useState } from "react";
import { BookOpen, ChevronDown, Database, Languages, X } from "lucide-react";
import type { MetadataTable } from "../types/domain";

type MetadataPanelProps = {
  onClose: () => void;
  tables: MetadataTable[];
};

type MetadataTab = "metadata" | "domain" | "glossary";

const tabs: Array<{ id: MetadataTab; label: string }> = [
  { id: "metadata", label: "Metadata" },
  { id: "domain", label: "Domain Knowledge" },
  { id: "glossary", label: "Glossary" },
];

const dataScopes = [
  { label: "All data", value: "all" },
  { label: "Customer data", value: "customer" },
  { label: "Account data", value: "account" },
  { label: "Transaction data", value: "transaction" },
];

const domainKnowledge = [
  {
    title: "New customer definition",
    description:
      "A customer is counted as new when KYC is completed and the first active product is opened within the selected reporting period.",
    source: "Customer Lifecycle Policy v4.2",
  },
  {
    title: "Dormant account rule",
    description:
      "An account is dormant after 12 consecutive months without a customer-initiated debit or credit transaction.",
    source: "Retail Account Standard",
  },
  {
    title: "High-value customer",
    description:
      "Customers with a rolling 90-day average balance of CNY 1,000,000 or more are classified as high value.",
    source: "Customer Segmentation Model 2026",
  },
  {
    title: "Revenue calculation",
    description:
      "Product revenue combines net interest income, fee income, and realized product gains after direct servicing costs.",
    source: "Finance Reporting Handbook",
  },
];

const glossary = [
  ["BCBS", "Basel Committee on Banking Supervision"],
  ["BIAN", "Banking Industry Architecture Network"],
  ["BSSM", "Branch Sales & Services Model System"],
  ["BU", "Business Unit"],
  ["CADW", "CMB Analytic Data Warehouse"],
  ["CASA", "Current Account Savings Account"],
  ["CDD", "Customer Due Diligence"],
  ["CMSS", "Campaign Management System"],
  ["CPMS", "Customer Portfolio Management System"],
  ["DCP", "Delivery Channel Processor"],
];

export function MetadataPanel({ onClose, tables }: MetadataPanelProps) {
  const [activeTab, setActiveTab] = useState<MetadataTab>("metadata");
  const [selectedScope, setSelectedScope] = useState("all");
  const [expandedTable, setExpandedTable] = useState(tables[0]?.name ?? "");

  return (
    <aside className="fixed bottom-2 right-2 top-2 z-30 w-[400px] overflow-hidden border-l border-[#E2E8EF] bg-white shadow-[0_20px_60px_rgba(35,43,55,0.16)] max-md:left-2 max-md:w-auto [border-radius:0_12px_12px_0]">
      <header className="flex items-start justify-between border-b border-[#E8EDF2] px-5 pt-5">
        <div className="flex min-w-0 gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={`whitespace-nowrap border-b-2 pb-4 text-xs font-medium transition ${
                activeTab === tab.id
                  ? "border-[#238CF0] text-[#2F3744]"
                  : "border-transparent text-[#7B8797] hover:text-[#2F3744]"
              }`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          aria-label="Close metadata"
          className="ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center text-[#64748B] transition hover:text-[#111827]"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="h-[calc(100%-62px)] overflow-y-auto px-5 py-5">
        {activeTab === "metadata" ? (
          <MetadataContent
            expandedTable={expandedTable}
            onSelectScope={setSelectedScope}
            onToggleTable={(tableName) =>
              setExpandedTable((current) => (current === tableName ? "" : tableName))
            }
            selectedScope={selectedScope}
            tables={tables}
          />
        ) : null}

        {activeTab === "domain" ? <DomainKnowledgeContent /> : null}

        {activeTab === "glossary" ? <GlossaryContent /> : null}
      </div>
    </aside>
  );
}

function MetadataContent({
  expandedTable,
  onSelectScope,
  onToggleTable,
  selectedScope,
  tables,
}: {
  expandedTable: string;
  onSelectScope: (scope: string) => void;
  onToggleTable: (tableName: string) => void;
  selectedScope: string;
  tables: MetadataTable[];
}) {
  return (
    <div role="tabpanel">
      <div className="relative mb-5">
        <select
          aria-label="Metadata data scope"
          className="h-10 w-full appearance-none border border-[#E1E7EF] bg-[#F8FAFC] px-4 pr-10 text-sm text-[#4D5D73] transition hover:border-[#B7C5D4] focus:border-[#238CF0] focus:outline-none [border-radius:8px]"
          onChange={(event) => onSelectScope(event.target.value)}
          value={selectedScope}
        >
          {dataScopes.map((scope) => (
            <option key={scope.value} value={scope.value}>
              {scope.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78869A]" />
      </div>

      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#556274]">
        <Database className="h-4 w-4 text-[#238CF0]" />
        Account Info
      </div>
      <p className="mb-4 text-xs leading-5 text-[#7B8797]">
        {dataScopes.find((scope) => scope.value === selectedScope)?.label} · Finance DM
      </p>

      <div className="overflow-hidden border border-[#E1E7EF] bg-white [border-radius:8px]">
        {tables.map((table) => {
          const isExpanded = expandedTable === table.name;

          return (
            <div className="border-b border-[#E8EDF2] last:border-b-0" key={table.name}>
              <button
                aria-expanded={isExpanded}
                className="flex min-h-12 w-full items-center gap-2 bg-[#F8FAFC] px-4 py-3 text-left text-sm font-semibold text-[#556274] transition hover:bg-[#F2F6FA]"
                onClick={() => onToggleTable(table.name)}
                type="button"
              >
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition ${isExpanded ? "" : "-rotate-90"}`}
                />
                <span className="min-w-0 truncate">{table.name.toUpperCase()}</span>
              </button>

              {isExpanded ? (
                <div className="grid grid-cols-[minmax(105px,0.8fr)_minmax(0,1.2fr)] text-xs">
                  <div className="border-r border-t border-[#E8EDF2] bg-[#F3F6F9] px-3 py-2 font-semibold text-[#556274]">
                    Field
                  </div>
                  <div className="border-t border-[#E8EDF2] bg-[#F3F6F9] px-3 py-2 font-semibold text-[#556274]">
                    Description
                  </div>
                  {table.columns.map((column) => (
                    <div className="contents" key={column.name}>
                      <div className="min-w-0 border-r border-t border-[#E8EDF2] px-3 py-3 text-[#4D5D73]">
                        <div className="break-words font-mono font-medium">{column.name}</div>
                        <div className="mt-1 text-[10px] uppercase text-[#8B97A7]">{column.type}</div>
                      </div>
                      <div className="border-t border-[#E8EDF2] px-3 py-3 leading-5 text-[#66758A]">
                        {column.description}
                        <div className="mt-1 truncate text-[10px] text-[#9AA5B4]">
                          Sample: {column.sampleValue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DomainKnowledgeContent() {
  return (
    <div role="tabpanel">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center bg-[#EEF8FF] text-[#238CF0] [border-radius:8px]">
          <BookOpen className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-[#3B4655]">Retail banking knowledge</h2>
          <p className="mt-0.5 text-xs text-[#8793A3]">4 active business rules</p>
        </div>
      </div>

      <div className="divide-y divide-[#E8EDF2] border-y border-[#E8EDF2]">
        {domainKnowledge.map((item) => (
          <article className="py-4" key={item.title}>
            <h3 className="text-sm font-semibold text-[#4A5667]">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-[#66758A]">{item.description}</p>
            <p className="mt-2 text-[11px] text-[#9AA5B4]">Source: {item.source}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function GlossaryContent() {
  return (
    <div role="tabpanel">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center bg-[#F3F1FC] text-[#675AA5] [border-radius:8px]">
          <Languages className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-[#3B4655]">Business glossary</h2>
          <p className="mt-0.5 text-xs text-[#8793A3]">Finance DM terminology</p>
        </div>
      </div>

      <div className="overflow-hidden border border-[#E1E7EF] [border-radius:8px]">
        <div className="grid grid-cols-[76px_minmax(0,1fr)] bg-[#F3F6F9] text-xs font-semibold text-[#556274]">
          <div className="border-r border-[#E8EDF2] px-3 py-3">Term</div>
          <div className="px-3 py-3">Description</div>
        </div>
        {glossary.map(([term, description]) => (
          <div
            className="grid grid-cols-[76px_minmax(0,1fr)] border-t border-[#E8EDF2] text-xs"
            key={term}
          >
            <div className="border-r border-[#E8EDF2] px-3 py-3 font-semibold text-[#596578]">
              {term}
            </div>
            <div className="px-3 py-3 leading-5 text-[#66758A]">{description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
