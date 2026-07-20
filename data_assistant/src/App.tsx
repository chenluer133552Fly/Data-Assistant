import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Info, Loader2, UserRound } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { ExampleQuestions } from "./components/ExampleQuestions";
import { FeedbackModal } from "./components/FeedbackModal";
import { FollowUpActions } from "./components/FollowUpActions";
import { QueryProcess } from "./components/QueryProcess";
import { QuestionComposer } from "./components/QuestionComposer";
import { ResultTable } from "./components/ResultTable";
import { SummaryPanel } from "./components/SummaryPanel";
import { TemplateGallery } from "./components/TemplateGallery";
import { TemplateModal } from "./components/TemplateModal";
import { Toast } from "./components/Toast";
import {
  activeDataSource,
  exampleQuestions,
  followUpQuestions,
  metadataTables,
  questionTemplates,
  queryResult,
  querySteps,
  runningSteps,
  summary,
  userTemplateAccess,
} from "./data/mockData";
import { chartDefinitions, reasoningMetrics } from "./data/visualizationData";
import type {
  DataSourceStatus,
  ExampleType,
  QueryLifecycle,
  QuestionTemplate,
} from "./types/domain";

const ChartPanel = lazy(() =>
  import("./components/ChartPanel").then((module) => ({ default: module.ChartPanel })),
);
const ReasoningFlow = lazy(() =>
  import("./components/ReasoningFlow").then((module) => ({ default: module.ReasoningFlow })),
);

function App() {
  const [question, setQuestion] = useState("");
  const [activeQuestion, setActiveQuestion] = useState("");
  const [queryStatus, setQueryStatus] = useState<QueryLifecycle>("idle");
  const [sourceStatus, setSourceStatus] = useState<DataSourceStatus>("connected");
  const [activeExampleType, setActiveExampleType] = useState<ExampleType>("recommended");
  const [examplesExpanded, setExamplesExpanded] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>(["row-001", "row-002"]);
  const [analyticalApproach, setAnalyticalApproach] = useState(
    summary.analyticalApproach ?? "",
  );
  const [toast, setToast] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const queryTimerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (queryTimerRef.current) window.clearTimeout(queryTimerRef.current);
    },
    [],
  );

  const selectedData = useMemo(
    () => queryResult.rows.filter((row) => selectedRows.includes(row.id)),
    [selectedRows],
  );

  const selectedRegions = selectedData.map((row) => row.region).join(", ");

  const submitQuestion = (nextQuestion = question) => {
    const cleanQuestion = nextQuestion.trim();

    if (!cleanQuestion) {
      setToast("Please enter a question first.");
      return;
    }

    if (sourceStatus !== "connected") {
      setToast("Please upload a file or connect a data source first.");
      return;
    }

    if (queryTimerRef.current) window.clearTimeout(queryTimerRef.current);

    setActiveQuestion(cleanQuestion);
    setQuestion("");
    setToast("");
    setExamplesExpanded(false);
    setQueryStatus("generating");
    queryTimerRef.current = window.setTimeout(() => {
      setQueryStatus("success");
      queryTimerRef.current = null;
    }, 900);
  };

  const startNewConversation = () => {
    if (queryTimerRef.current) {
      window.clearTimeout(queryTimerRef.current);
      queryTimerRef.current = null;
    }

    setQuestion("");
    setActiveQuestion("");
    setQueryStatus("idle");
    setExamplesExpanded(false);
    setShowMetadata(false);
    setSelectedTemplate(null);
    setFeedbackOpen(false);
    setSelectedRows(["row-001", "row-002"]);
    setAnalyticalApproach(summary.analyticalApproach ?? "");
    setToast("");
  };

  const submitTemplate = (
    template: QuestionTemplate,
    values: Record<string, string>,
  ) => {
    const selectedValues = Object.entries(values)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
    const prompt = selectedValues
      ? `${template.prompt}. Filters: ${selectedValues}`
      : template.prompt;

    setSelectedTemplate(null);
    submitQuestion(prompt);
  };

  const uploadFile = () => {
    setSourceStatus("parsing");
    setToast("Parsing uploaded file and generating metadata.");
    window.setTimeout(() => {
      setSourceStatus("connected");
      setToast("File parsed. Metadata is ready.");
    }, 800);
  };

  const connectSource = () => {
    setSourceStatus("connected");
    setToast("Finance DM connected.");
  };

  const refreshExamples = () => {
    setToast("Example questions refreshed.");
  };

  const selectExample = (nextQuestion: string) => {
    setQuestion(nextQuestion);
    submitQuestion(nextQuestion);
  };

  const toggleRow = (rowId: string) => {
    setSelectedRows((current) =>
      current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...current, rowId],
    );
  };

  const generateSummary = () => {
    if (selectedRows.length < 2) {
      setToast("for better results, 请勾选更多数据");
      return;
    }

    setToast("Summary regenerated from selected data.");
  };

  const showQueryModules = queryStatus === "generating" || queryStatus === "success";

  return (
    <AppShell
      dataSource={{ ...activeDataSource, status: sourceStatus }}
      metadataTables={metadataTables}
      onToggleMetadata={() => setShowMetadata((value) => !value)}
      onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
      sidebarCollapsed={sidebarCollapsed}
      showMetadata={showMetadata}
    >
      <Toast message={toast} onClose={() => setToast("")} />

      <div
        className={`relative mx-auto w-full max-w-[1010px] px-6 pt-[96px] transition-all duration-300 max-lg:pt-24 ${
          showQueryModules ? "pb-48" : "pb-16"
        }`}
      >
        {showQueryModules ? (
          <>
            <header className="border-b border-[#E1E7EF] pb-6">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#718097]">
                <UserRound className="h-3.5 w-3.5" />
                Inquiry
              </p>
              <h1 className="mt-3 text-[24px] font-semibold leading-tight tracking-normal text-[#111827]">
                {activeQuestion}
              </h1>
            </header>
            <p className="mt-6 flex items-center gap-2 text-xs tracking-[0.08em] text-[#4F5967]">
              <Info className="h-4 w-4 shrink-0" />
              AI output may not always be accurate. Please review it before using.
            </p>
          </>
        ) : (
          <>
            <header>
              <h1 className="text-[24px] font-semibold leading-tight tracking-normal text-[#3A404B]">
                Hi,Ember
              </h1>
              <p className="mt-1 text-[15px] text-[#52647B]">Welcome to Data Assistant</p>
            </header>

            <QuestionComposer
              examplesExpanded={examplesExpanded}
              onChange={(value) => {
                setQuestion(value);
                setQueryStatus(value ? "typing" : "idle");
              }}
              onConnect={connectSource}
              onNewConversation={startNewConversation}
              onSlash={() => setExamplesExpanded((value) => !value)}
              onSubmit={() => submitQuestion()}
              onUpload={uploadFile}
              question={question}
              sourceStatus={sourceStatus}
            />
          </>
        )}

        {!showQueryModules ? (
          <>
            <ExampleQuestions
              activeType={activeExampleType}
              examples={exampleQuestions}
              expanded={examplesExpanded}
              onClose={() => setExamplesExpanded(false)}
              onRefresh={refreshExamples}
              onSelect={selectExample}
              onSetType={setActiveExampleType}
            />
            <TemplateGallery
              canAddTemplates={userTemplateAccess}
              examples={exampleQuestions.recommended}
              onAddTemplate={() => setToast("Template creation is ready for configuration.")}
              onNextGroup={refreshExamples}
              onSelectExample={selectExample}
              onSelectTemplate={setSelectedTemplate}
              templates={questionTemplates}
            />
          </>
        ) : null}

        {queryStatus === "generating" ? (
          <div className="mt-6">
            <QueryProcess
              onToggleMetadata={() => setShowMetadata((value) => !value)}
              showMetadata={showMetadata}
              steps={runningSteps}
            />
          </div>
        ) : null}

        {queryStatus === "success" ? (
          <div className="mt-6 flex flex-col gap-4">
            <QueryProcess
              onToggleMetadata={() => setShowMetadata((value) => !value)}
              showMetadata={showMetadata}
              steps={querySteps}
            />
            <ResultTable
              onToggleRow={toggleRow}
              result={queryResult}
              selectedRows={selectedRows}
            />
            <SummaryPanel
              analyticalApproach={analyticalApproach}
              onApproachChange={setAnalyticalApproach}
              onGenerate={generateSummary}
              selectedCount={selectedRows.length}
              selectedRegions={selectedRegions}
              summary={summary}
            />
            <Suspense fallback={<VisualizationLoading />}>
              <ChartPanel charts={chartDefinitions} />
              <ReasoningFlow metrics={reasoningMetrics} />
            </Suspense>
            <FollowUpActions
              onFeedback={() => setFeedbackOpen(true)}
              onSelectQuestion={selectExample}
              questions={followUpQuestions}
            />
          </div>
        ) : null}
      </div>
      {showQueryModules ? (
        <div
          className={`pointer-events-none fixed bottom-5 z-20 flex justify-center px-6 transition-[left,right] duration-300 max-lg:left-2 max-md:right-2 ${
            sidebarCollapsed ? "left-[80px]" : "left-[260px]"
          } ${showMetadata ? "right-[408px]" : "right-2"}`}
        >
          <div className="pointer-events-auto w-full max-w-[1010px]">
            <QuestionComposer
              examplesExpanded={false}
              floating
              onChange={setQuestion}
              onConnect={connectSource}
              onNewConversation={startNewConversation}
              onSlash={() => undefined}
              onSubmit={() => submitQuestion()}
              onUpload={uploadFile}
              question={question}
              sourceStatus={sourceStatus}
            />
          </div>
        </div>
      ) : null}
      <TemplateModal
        key={selectedTemplate?.id ?? "closed"}
        onClose={() => setSelectedTemplate(null)}
        onSubmit={submitTemplate}
        template={selectedTemplate}
      />
      <FeedbackModal
        onClose={() => setFeedbackOpen(false)}
        onSubmit={(reasons) => {
          setFeedbackOpen(false);
          setToast(`Feedback submitted: ${reasons[0] ?? "additional details"}.`);
        }}
        open={feedbackOpen}
      />
    </AppShell>
  );
}

function VisualizationLoading() {
  return (
    <div className="assistant-card flex h-28 items-center justify-center gap-2 text-sm text-[#718097]">
      <Loader2 className="h-4 w-4 animate-spin text-[#23838B]" />
      Loading visual analysis
    </div>
  );
}

export default App;
