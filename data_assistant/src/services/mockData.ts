import type { PipelineStep, QueryResult, ColumnDef } from '../types/query';
import type { QuickTemplate } from '../types/template';

export const mockTemplates: QuickTemplate[] = [
  {
    id: '1',
    title: 'Customer Info',
    description: 'Inquire about customer contact information, ID number, etc.',
    group: 'A',
  },
  {
    id: '2',
    title: 'Account Info',
    description: 'Inquire about the bank, account type, and account status.',
    group: 'A',
  },
  {
    id: '3',
    title: 'Credit Card Transaction',
    description: 'Credit card transaction details by specifying the time range.',
    group: 'A',
  },
  {
    id: '4',
    title: 'Customer Info',
    description: 'Inquire about customer contact information, ID number, etc.',
    group: 'A',
  },
  {
    id: '5',
    title: 'Account Info',
    description: 'Inquire about the bank, account type, and account status.',
    group: 'A',
  },
];

export const mockRecommendedExamples = [
  'Please provide the reconciliation report as it appeared prior to any adjustments on 30 December 2025',
  'Show me the product revenue in 2025',
  'How many customers do we have?',
  'Check sales trends over the past 6 months',
  'For the last 3 months, what was the biggest stock holding each month? show company info and profit',
];

export const mockFrequentExamples = [
  'Show the new mainland customer on 2026-01-01',
  'Compare chain interoperability security scores for current quarter.',
  'Analyze current liquidity risks in Tier 1 regional banks.',
  'Generate a compliance report for Q3 Cross-Chain settlements.',
  'How many customers do we have?',
];

export function mockPipelineSteps(): PipelineStep[] {
  return [
    {
      stepNumber: 1,
      name: 'PII Check',
      status: 'pending',
      detail: 'No PII in user query',
    },
    {
      stepNumber: 2,
      name: 'Intent Recognition',
      status: 'pending',
      detail: '1 intent detected: QueryData; slots: none.',
    },
    {
      stepNumber: 3,
      name: 'Query rewrite',
      status: 'pending',
      detail:
        'For 2026-01-01, show the full list of newly onboarded Mainland China customers, grouped by branch and channel.',
    },
    {
      stepNumber: 4,
      name: 'Table Selection',
      status: 'pending',
      detail:
        'hsbc-10272718-ombbusvis.T3_PROJECT_CUST_PROFIT_DSS.TBL_CIN_ATTRIBUTE_FINAL',
    },
    {
      stepNumber: 5,
      name: 'SQL Generation',
      status: 'pending',
      detail: 'Generated SQL query',
      data: `-- Retrieve all available details for customers identified as mainlanders
SELECT
  *
FROM
  \`hsbc-10272718-ombbusvis.T3_PROJECT_CUST_PROFIT_DSS.TBL_CIN_ATTRIBUTE_FINAL\` AS t
WHERE
  t.MainLander = "Yes"`,
    },
    {
      stepNumber: 6,
      name: 'SQL Check',
      status: 'pending',
      detail: 'SQL validation passed. Query is safe to execute.',
    },
  ];
}

const mockColumns: ColumnDef[] = [
  { key: 'txId', title: 'HEADER', sortable: true, filterable: true },
  { key: 'date', title: 'HEADER', sortable: true, filterable: true },
  { key: 'institution', title: 'HEADER', sortable: true },
  { key: 'asset', title: 'HEADER', sortable: true },
  { key: 'price', title: 'HEADER', sortable: true },
  { key: 'amount', title: 'HEADER', sortable: true },
  { key: 'status', title: 'STATUS', sortable: true },
];

const mockRows = [
  { txId: 'FT-QI9P8SWR', date: '2026-06-01 05:14:00', institution: 'Coinbase Prime', asset: 'USDT', price: 30.61, amount: 59317.40, status: 'PENDING' },
  { txId: 'FT-TRA7V6Y5', date: '2026-06-02 05:25:09', institution: 'BlackRock', asset: 'MATIC', price: 5.53, amount: 21137.48, status: 'FLAGGED' },
  { txId: 'FT-1BZIWYXR', date: '2026-06-01 06:41:37', institution: 'BlackRock', asset: 'SOL', price: 42.89, amount: 3127.49, status: 'FLAGGED' },
  { txId: 'FT-HBOD6JWQ', date: '2026-06-01 06:01:14', institution: 'JP Morgan', asset: 'BTC', price: 49.33, amount: 6969.49, status: 'FLAGGED' },
  { txId: 'FT-0B6RQJBS', date: '2026-06-01 13:53:40', institution: 'Goldman Sachs', asset: 'DOT', price: 21.57, amount: 12271.89, status: 'SETTLED' },
  { txId: 'FT-NS1BTH5K', date: '2026-06-01 12:51:15', institution: 'Kraken OTC', asset: 'SOL', price: 28.37, amount: 18739.54, status: 'PENDING' },
  { txId: 'FT-ZIHEZXAS', date: '2026-06-01 20:16:18', institution: 'Goldman Sachs', asset: 'USDT', price: 31.82, amount: 56112.68, status: 'FLAGGED' },
  { txId: 'FT-TDFWDH29', date: '2026-06-02 03:29:03', institution: 'Goldman Sachs', asset: 'LINK', price: 35.59, amount: 35819.68, status: 'PENDING' },
  { txId: 'FT-F8DY3IXO', date: '2026-06-01 23:30:57', institution: 'Coinbase Prime', asset: 'USDT', price: 43.10, amount: 43483.15, status: 'SETTLED' },
  { txId: 'FT-KL2M9NOP', date: '2026-06-03 08:15:22', institution: 'JP Morgan', asset: 'ETH', price: 18.45, amount: 28901.33, status: 'PENDING' },
];

export function mockQueryResult(): QueryResult {
  return {
    summary: {
      text: 'Based on the comprehensive data in this table, please help me analyze the key indicator summaries, overall situation and optimization directions.',
      keyFindings: [
        'On January 1, 2026, a total of <strong>127</strong> new customers were recorded in mainland China. In terms of geographic distribution, <strong>Shanghai, Beijing, and Guangdong</strong> were the main sources of new customers, accounting for <strong>58%</strong> in total. Among Of these, 76% of users registered through online channels, demonstrating a strong trend towards digital customer acquisition.',
        'New customer volume increased by <strong>12%</strong> compared to the same period last week, reaching a peak for a single day in nearly a month. Online channels accounted for <strong>76%</strong>, significantly higher than offline channels at <strong>24%</strong>, and the online user registration conversion rate was <strong>18%</strong> higher than that of offline users.',
      ],
    },
    table: {
      title: 'MAINLAND CHINA CLIENT NEW CUSTOMER DETAILS (01/01/2026)',
      columns: mockColumns,
      rows: mockRows,
      totalRows: 1184,
      pageSize: 10,
    },
    sql: `SELECT * FROM \`hsbc-10272718-ombbusvis.T3_PROJECT_CUST_PROFIT_DSS.TBL_CIN_ATTRIBUTE_FINAL\` AS t WHERE t.MainLander = "Yes"`,
  };
}

export const mockQueryHistory = [
  { id: 'h1', text: 'How many customers do w...', date: 'today' },
  { id: 'h2', text: 'Show report for before adju...', date: 'today' },
  { id: 'h3', text: 'Show report for before adju...', date: 'yesterday' },
  { id: 'h4', text: 'How many customers do w...', date: 'prev7' },
  { id: 'h5', text: 'Show report for before adju...', date: 'prev7' },
  { id: 'h6', text: 'How many customers do w...', date: 'prev7' },
  { id: 'h7', text: 'Show report for before adju...', date: 'prev7' },
  { id: 'h8', text: 'How many customers do w...', date: 'prev7' },
];

export const mockPinnedQueries = [
  'How many customers do w...',
  'Show me the revenue in 20...',
  'Show report for before adju...',
];
