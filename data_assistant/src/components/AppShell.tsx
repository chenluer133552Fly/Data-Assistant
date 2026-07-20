import {
  Bot,
  Box,
  ChevronDown,
  Database,
  History,
  IndentDecrease,
  IndentIncrease,
  Network,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import type { DataSource, MetadataTable } from "../types/domain";
import { MetadataPanel } from "./MetadataPanel";

type HistoryGroup = {
  title: string;
  collapsible?: boolean;
  items: string[];
};

const historyGroups: HistoryGroup[] = [
  {
    title: "PINNED FOR 60 DAYS",
    collapsible: true,
    items: [
      "How many customers do w...",
      "Show me the revenue in 202...",
      "Show report for before adju...",
    ],
  },
  {
    title: "TODAY",
    items: ["How many customers do w...", "Show report for before adju..."],
  },
  {
    title: "YESTERDAY",
    items: ["Show report for before adju..."],
  },
  {
    title: "PREVIOUS 7 DAYS",
    items: [
      "How many customers do w...",
      "Show report for before adju...",
      "How many customers do w...",
      "Show report for before adju...",
      "How many customers do w...",
    ],
  },
];

const dataRangeOptions = [
  "Finance DM",
  "Customer 360",
  "Credit Card Transactions",
  "Retail Banking Sandbox",
];

type AppShellProps = {
  children: React.ReactNode;
  dataSource: DataSource;
  metadataTables: MetadataTable[];
  sidebarCollapsed: boolean;
  showMetadata: boolean;
  onToggleMetadata: () => void;
  onToggleSidebar: () => void;
};

export function AppShell({
  children,
  dataSource,
  metadataTables,
  sidebarCollapsed,
  showMetadata,
  onToggleMetadata,
  onToggleSidebar,
}: AppShellProps) {
  const [selectedDataRange, setSelectedDataRange] = useState(dataSource.name);

  return (
    <main className="min-h-screen bg-[#F5F7FB] p-2 text-[#27313F]">
      <div className="flex min-h-[calc(100vh-16px)] overflow-hidden bg-[#F7FAFD] shadow-[0_10px_34px_rgba(55,73,98,0.05)] [border-radius:12px]">
        <Sidebar
          collapsed={sidebarCollapsed}
          dataSource={dataSource}
          selectedDataRange={selectedDataRange}
          onSelectDataRange={setSelectedDataRange}
          onToggleMetadata={onToggleMetadata}
          onToggleSidebar={onToggleSidebar}
          showMetadata={showMetadata}
        />

        <section className="relative min-w-0 flex-1 overflow-y-auto bg-[#F5F8FC] transition-all duration-300">
          <MainGradient />
          <TopBar
            onToggleSidebar={onToggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />
          {children}
          {showMetadata ? (
            <MetadataPanel onClose={onToggleMetadata} tables={metadataTables} />
          ) : null}
        </section>
      </div>
    </main>
  );
}

function Sidebar({
  collapsed,
  dataSource,
  selectedDataRange,
  onSelectDataRange,
  onToggleMetadata,
  onToggleSidebar,
  showMetadata,
}: {
  collapsed: boolean;
  dataSource: DataSource;
  selectedDataRange: string;
  onSelectDataRange: (value: string) => void;
  onToggleMetadata: () => void;
  onToggleSidebar: () => void;
  showMetadata: boolean;
}) {
  if (collapsed) {
    return (
      <aside className="hidden w-[72px] shrink-0 flex-col items-center border-r border-[#EEF2F6] bg-[#FBF9FE] px-3 py-7 transition-all duration-300 lg:flex">
        <button
          aria-label="Expand sidebar"
          className="mb-8 inline-flex h-9 w-9 items-center justify-center text-[#405064] transition hover:text-[#111827]"
          onClick={onToggleSidebar}
          type="button"
        >
          <IndentIncrease className="h-5 w-5" />
        </button>
        <CollapsedNavIcon active>
          <Box className="h-5 w-5" />
        </CollapsedNavIcon>
        <CollapsedNavIcon>
          <Database className="h-5 w-5" />
        </CollapsedNavIcon>
        <CollapsedNavIcon>
          <History className="h-5 w-5" />
        </CollapsedNavIcon>
        <div className="flex-1" />
        <button
          aria-label={showMetadata ? "Hide metadata" : "Show metadata"}
          className={`inline-flex h-10 w-10 items-center justify-center border shadow-[0_6px_18px_rgba(64,82,110,0.04)] [border-radius:8px] ${
            showMetadata
              ? "border-[#99C5E6] bg-[#EEF8FF] text-[#1B84B7]"
              : "border-[#E3E8EF] bg-[#FBFCFE] text-[#405064]"
          }`}
          onClick={onToggleMetadata}
          type="button"
        >
          <Network className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="hidden w-[252px] shrink-0 flex-col overflow-hidden border-r border-[#EEF2F6] bg-[#FBF9FE] px-6 py-7 transition-all duration-300 ease-out lg:flex"
    >
      <div className="min-w-[204px]">
        <HsbcLogo />
      </div>

      <button
        className="mt-9 flex h-[50px] min-w-[204px] items-center gap-3 border border-[#E3E8EF] bg-[#FBFCFE] px-4 text-sm font-medium shadow-[0_6px_18px_rgba(64,82,110,0.04)] [border-radius:8px]"
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center bg-[#E2F5FF] text-[#239FE6] [border-radius:8px]">
          <Bot className="h-5 w-5" />
        </span>
        Data Assistant
      </button>

      <div className="mt-8 min-w-[204px]">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#718097]">
          Data Range
        </p>
        <div className="relative">
          <select
            aria-label="Data Range"
            className="h-9 w-full appearance-none border border-[#E3E8EF] bg-[#FBFCFE] px-3 pr-9 text-sm text-[#27313F] transition hover:border-[#B7C5D4] focus:border-[#238CF0] focus:outline-none [border-radius:8px]"
            onChange={(event) => onSelectDataRange(event.target.value)}
            value={selectedDataRange}
          >
            {dataRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7D8999]" />
        </div>
      </div>

      <div className="mt-8 min-h-0 min-w-[204px] flex-1 overflow-hidden">
        {historyGroups.map((group) => (
          <div className="mb-5" key={group.title}>
            <div className="mb-3 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#718097]">
              {group.collapsible ? <ChevronDown className="h-3 w-3" /> : null}
              {group.title}
            </div>
            <div className="space-y-4 pl-3">
              {group.items.map((item, index) => (
                <button
                  className="block w-full truncate text-left text-[13px] leading-none text-[#8793A6] hover:text-[#27313F]"
                  key={`${group.title}-${index}`}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className={`mt-4 flex h-10 min-w-[204px] items-center gap-3 border px-4 text-sm font-medium shadow-[0_6px_18px_rgba(64,82,110,0.04)] [border-radius:8px] ${
          showMetadata
            ? "border-[#99C5E6] bg-[#EEF8FF] text-[#1B84B7]"
            : "border-[#E3E8EF] bg-[#FBFCFE] text-[#111827]"
        }`}
        onClick={onToggleMetadata}
        type="button"
      >
        <Sparkles className="h-4 w-4" />
        Show Metadata
      </button>
    </aside>
  );
}

function CollapsedNavIcon({
  active,
  children,
}: {
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`mb-4 inline-flex h-10 w-10 items-center justify-center border transition [border-radius:8px] ${
        active
          ? "border-[#D6ECFB] bg-[#EAF6FF] text-[#1B84B7]"
          : "border-[#E3E8EF] bg-[#FBFCFE] text-[#607086] hover:border-[#9CC7E8] hover:text-[#1B84B7]"
      }`}
      type="button"
    >
      {children}
    </button>
  );
}

function HsbcLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg aria-hidden="true" className="h-9 w-16" viewBox="0 0 64 36">
        <rect fill="#DB0011" height="36" transform="rotate(45 32 18)" width="36" x="14" y="0" />
        <polygon fill="white" points="32,18 14,0 14,36" />
        <polygon fill="white" points="32,18 50,0 50,36" />
      </svg>
      <span className="text-[22px] font-bold tracking-[-0.02em] text-black">HSBC</span>
    </div>
  );
}

function MainGradient() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-0 top-0 h-[340px] w-full bg-[radial-gradient(circle_at_47%_0%,rgba(128,220,236,0.28),transparent_24%),radial-gradient(circle_at_79%_0%,rgba(176,172,235,0.34),transparent_29%),linear-gradient(180deg,rgba(244,248,253,0.9),rgba(244,248,253,0))]" />
    </div>
  );
}

function TopBar({
  onToggleSidebar,
  sidebarCollapsed,
}: {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}) {
  return (
    <div
      className={`absolute left-0 right-0 top-0 z-10 flex items-center px-6 py-4 ${
        sidebarCollapsed ? "justify-end" : "justify-between"
      }`}
    >
      {!sidebarCollapsed ? (
        <button
          aria-label="Collapse sidebar"
          className="hidden h-9 w-9 items-center justify-center text-[#405064] transition hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8C8D8] lg:inline-flex"
          onClick={onToggleSidebar}
          title="Collapse sidebar"
          type="button"
        >
          <IndentDecrease className="h-5 w-5" />
        </button>
      ) : null}
      <button
        className="inline-flex h-9 w-9 items-center justify-center border border-[#DCE4ED] bg-white text-[#405064] shadow-[0_6px_16px_rgba(64,82,110,0.06)] [border-radius:999px]"
        type="button"
      >
        <UserRound className="h-5 w-5" />
      </button>
    </div>
  );
}
