export type DataSourceType = "file" | "database" | "api";
export type DataSourceStatus = "connected" | "parsing" | "failed";

export type DataSource = {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  createdAt: string;
  updatedAt: string;
};

export type QueryStepStatus = "pending" | "running" | "success" | "failed" | "skipped";

export type QueryStep = {
  id: string;
  name: string;
  message: string;
  status: QueryStepStatus;
};

export type ResultColumn = {
  key: string;
  label: string;
  type: string;
};

export type ResultRow = {
  id: string;
  customer_id: string;
  event_time: string;
  client_name: string;
  asset_symbol: string;
  region: string;
  trade_amount: string;
};

export type QueryResult = {
  id: string;
  title: string;
  columns: ResultColumn[];
  rows: ResultRow[];
  totalRows: number;
};

export type MetadataColumn = {
  name: string;
  type: string;
  description: string;
  sampleValue: string;
  nullable: boolean;
  primaryKey: boolean;
};

export type MetadataTable = {
  name: string;
  columns: MetadataColumn[];
};

export type SummarySection = {
  title: string;
  items: string[];
};

export type Summary = {
  id: string;
  queryId: string;
  selectedRowIds: string[];
  analyticalApproach?: string;
  conclusion: string;
  highlightedMetrics: string[];
  sections: SummarySection[];
};

export type ExampleType = "recommended" | "frequent";
export type QueryLifecycle = "idle" | "typing" | "submitting" | "generating" | "success" | "failed";

export type TemplateFormFieldType =
  | "range"
  | "select"
  | "input"
  | "multi-choice"
  | "radio"
  | "date"
  | "date-range"
  | "amount-range";

export type TemplateOption = {
  label: string;
  value: string;
};

export type TemplateFormField = {
  id: string;
  label: string;
  type: TemplateFormFieldType;
  placeholder?: string;
  options?: TemplateOption[];
  quickOptions?: TemplateOption[];
  minPlaceholder?: string;
  maxPlaceholder?: string;
};

export type TemplateFormTab = {
  id: string;
  label: string;
  fields: TemplateFormField[];
};

export type QuestionTemplate = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  form?: {
    title: string;
    tabs: TemplateFormTab[];
  };
};

export type ChartMark = "bar" | "line" | "area" | "point";

export type ChartDatum = {
  category: string;
  value: number;
  series?: string;
};

export type ChartDefinition = {
  id: string;
  title: string;
  description: string;
  mark: ChartMark;
  values: ChartDatum[];
  yTitle: string;
};

export type ReasoningMetric = {
  id: string;
  title: string;
  value: string;
  positiveChange: string;
  negativeChange: string;
  column: number;
  row: number;
  tone: "root" | "saving" | "usd" | "detail";
};
