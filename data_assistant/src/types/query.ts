export interface PipelineStep {
  stepNumber: number;
  name: string;
  status: 'pending' | 'running' | 'completed';
  detail: string;
  data?: string;
}

export interface ColumnDef {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

export interface QueryResult {
  summary: {
    text: string;
    keyFindings: string[];
  };
  table: {
    title: string;
    columns: ColumnDef[];
    rows: Record<string, unknown>[];
    totalRows: number;
    pageSize: number;
  };
  sql?: string;
}

export interface Conversation {
  id: string;
  query: string;
  timestamp: Date;
  isPinned: boolean;
  status: 'idle' | 'processing' | 'completed' | 'clarifying';
  steps: PipelineStep[];
  result?: QueryResult;
}
