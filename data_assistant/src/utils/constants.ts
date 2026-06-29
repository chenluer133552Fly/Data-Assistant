export const PIPELINE_STEPS = [
  { stepNumber: 1, name: 'PII Check' },
  { stepNumber: 2, name: 'Intent Recognition' },
  { stepNumber: 3, name: 'Query rewrite' },
  { stepNumber: 4, name: 'Table Selection' },
  { stepNumber: 5, name: 'SQL Generation' },
  { stepNumber: 6, name: 'SQL Check' },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  PENDING: '#FFA726',
  FLAGGED: '#EF5350',
  SETTLED: '#66BB6A',
};

export const ACTION_BUTTONS = [
  {
    label: 'Generate Insights',
    color: '#4CAF50',
    icon: '💡',
    description: 'AI automatically analyzes data to help you discover hidden patterns, trends, and anomalies in your dataset.',
  },
  {
    label: 'Show Lineage',
    color: '#FFC107',
    icon: '🔗',
    description: 'When data relationships are complex, trace the origin and transformations of your data step by step.',
  },
  {
    label: 'Explain Reasoning',
    color: '#E91E63',
    icon: '🧠',
    description: 'Understand how the AI arrived at its conclusions through a detailed reasoning breakdown.',
  },
  {
    label: 'Superset',
    color: '#9C27B0',
    icon: '📊',
    description: 'Jump to Superset with a single click to explore data with powerful BI dashboards and visualizations.',
  },
] as const;
