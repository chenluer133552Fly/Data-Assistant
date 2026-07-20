import type {
  DataSource,
  ExampleType,
  MetadataTable,
  QuestionTemplate,
  QueryResult,
  QueryStep,
  Summary,
} from "../types/domain";

export const activeDataSource: DataSource = {
  id: "ds-finance-dm",
  name: "Finance DM",
  type: "database",
  status: "connected",
  createdAt: "2026-06-10T08:09:08Z",
  updatedAt: "2026-07-07T07:29:02Z",
};

export const exampleQuestions: Record<ExampleType, string[]> = {
  recommended: [
    "Please provide the reconciliation report as it appeared prior to any adjustments on 30 December 2025",
    "Show me the product revenue in 2025",
    "How many customers do we have?",
    "Check sales trends over the past 6 months",
    "For the last 3 months, what was the biggest stock holding each month? show company info and profit",
  ],
  frequent: [
    "Analyze current liquidity risks in Tier 1 regional banks",
    "Generate a compliance report for Q3 Cross-Chain settlements",
    "Audit wallet 0x4F...3B for potential wash trading patterns",
  ],
};

export const userTemplateAccess = true;

export const questionTemplates: QuestionTemplate[] = [
  {
    id: "customer-info",
    title: "Customer Info",
    description: "Inquire about customer contact information, ID number, etc.",
    prompt: "Show the new mainland customer on 2026-01-01",
    form: {
      title: "Customer Info",
      tabs: [
        {
          id: "tab-a",
          label: "Tab A",
          fields: [
            {
              id: "ageRange",
              label: "Range Input (Includes Quick Options)",
              type: "range",
              minPlaceholder: "18",
              maxPlaceholder: "65",
              quickOptions: [
                { label: "18-30", value: "18-30" },
                { label: "30-45", value: "30-45" },
                { label: "45-60", value: "45-60" },
                { label: "60+", value: "60+" },
              ],
            },
            {
              id: "market",
              label: "Multiple choice (Includes Quick Options)",
              type: "select",
              placeholder: "All",
              options: [
                { label: "All", value: "all" },
                { label: "China mainland", value: "china-mainland" },
                { label: "Hong Kong, China", value: "hong-kong" },
              ],
              quickOptions: [
                { label: "Chinese mainland", value: "china-mainland" },
                { label: "Hong Kong, China", value: "hong-kong" },
              ],
            },
            {
              id: "keyword",
              label: "Text input box",
              type: "input",
              placeholder: "Please enter",
            },
            {
              id: "employment",
              label: "Multiple choice",
              type: "multi-choice",
              options: [
                { label: "All", value: "all" },
                { label: "Self-employed", value: "self-employed" },
                { label: "Full-time employed", value: "full-time" },
                { label: "Part time employed", value: "part-time" },
                { label: "Student", value: "student" },
                { label: "Retired", value: "retired" },
                { label: "Housewife", value: "housewife" },
              ],
            },
            {
              id: "active",
              label: "Single choice",
              type: "radio",
              options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              id: "date",
              label: "Date/Time Picker",
              type: "date",
              placeholder: "Please select a date",
            },
            {
              id: "dateRange",
              label: "Date/Time Range Selector",
              type: "date-range",
              minPlaceholder: "Start Date",
              maxPlaceholder: "End Date",
            },
            {
              id: "amountRange",
              label: "Amount range",
              type: "amount-range",
              minPlaceholder: "Minimum",
              maxPlaceholder: "Maximum",
            },
          ],
        },
        {
          id: "tab-b",
          label: "Tab B",
          fields: [
            {
              id: "segment",
              label: "Customer segment",
              type: "select",
              placeholder: "Select a segment",
              options: [
                { label: "Premier", value: "premier" },
                { label: "Private banking", value: "private" },
                { label: "Commercial", value: "commercial" },
              ],
            },
            {
              id: "risk",
              label: "Risk level",
              type: "multi-choice",
              options: [
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ],
            },
          ],
        },
        {
          id: "tab-c",
          label: "Tab C",
          fields: [
            {
              id: "notes",
              label: "Text input box",
              type: "input",
              placeholder: "Add extra query constraints",
            },
          ],
        },
      ],
    },
  },
  {
    id: "account-info",
    title: "Account Info",
    description: "Inquire about the bank, account type, and account status.",
    prompt: "Summarize account status by customer segment",
    form: {
      title: "Account Info",
      tabs: [
        {
          id: "account-filter",
          label: "Account Filter",
          fields: [
            {
              id: "bankEntity",
              label: "Bank entity",
              type: "select",
              placeholder: "All entities",
              options: [
                { label: "HSBC China", value: "hsbc-china" },
                { label: "HSBC Hong Kong", value: "hsbc-hong-kong" },
                { label: "Hang Seng Bank", value: "hang-seng" },
              ],
            },
            {
              id: "accountType",
              label: "Account type",
              type: "multi-choice",
              options: [
                { label: "All", value: "all" },
                { label: "Current", value: "current" },
                { label: "Savings", value: "savings" },
                { label: "Time deposit", value: "time-deposit" },
                { label: "Investment", value: "investment" },
              ],
            },
            {
              id: "accountStatus",
              label: "Account status",
              type: "radio",
              options: [
                { label: "Active", value: "active" },
                { label: "Dormant", value: "dormant" },
                { label: "Closed", value: "closed" },
              ],
            },
            {
              id: "openedDateRange",
              label: "Opened date range",
              type: "date-range",
              minPlaceholder: "Start date",
              maxPlaceholder: "End date",
            },
            {
              id: "balanceRange",
              label: "Balance range",
              type: "amount-range",
              minPlaceholder: "Minimum",
              maxPlaceholder: "Maximum",
            },
          ],
        },
        {
          id: "account-owner",
          label: "Customer Filter",
          fields: [
            {
              id: "customerSegment",
              label: "Customer segment",
              type: "select",
              placeholder: "All segments",
              options: [
                { label: "Mass market", value: "mass" },
                { label: "Premier", value: "premier" },
                { label: "Private banking", value: "private" },
              ],
            },
            {
              id: "customerKeyword",
              label: "Customer ID or name",
              type: "input",
              placeholder: "Enter customer ID or name",
            },
          ],
        },
      ],
    },
  },
  {
    id: "credit-card-transaction",
    title: "Credit Card Transaction",
    description: "credit card transaction details by specifying the time range",
    prompt: "Show credit card transactions for the selected time range",
    form: {
      title: "Credit Card Transaction",
      tabs: [
        {
          id: "transaction-filter",
          label: "Transaction Filter",
          fields: [
            {
              id: "transactionPeriod",
              label: "Transaction period",
              type: "date-range",
              minPlaceholder: "Start date",
              maxPlaceholder: "End date",
            },
            {
              id: "cardType",
              label: "Card type",
              type: "select",
              placeholder: "All cards",
              options: [
                { label: "Visa Signature", value: "visa-signature" },
                { label: "Mastercard World", value: "mastercard-world" },
                { label: "UnionPay Platinum", value: "unionpay-platinum" },
              ],
              quickOptions: [
                { label: "Visa", value: "visa-signature" },
                { label: "Mastercard", value: "mastercard-world" },
                { label: "UnionPay", value: "unionpay-platinum" },
              ],
            },
            {
              id: "merchantCategory",
              label: "Merchant category",
              type: "multi-choice",
              options: [
                { label: "All", value: "all" },
                { label: "Retail", value: "retail" },
                { label: "Travel", value: "travel" },
                { label: "Dining", value: "dining" },
                { label: "Online", value: "online" },
              ],
            },
            {
              id: "transactionAmount",
              label: "Transaction amount",
              type: "amount-range",
              minPlaceholder: "Minimum",
              maxPlaceholder: "Maximum",
            },
            {
              id: "transactionStatus",
              label: "Transaction status",
              type: "radio",
              options: [
                { label: "Posted", value: "posted" },
                { label: "Pending", value: "pending" },
                { label: "Declined", value: "declined" },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "customer-info-secondary",
    title: "Customer Info",
    description: "Inquire about customer contact information, ID number, etc.",
    prompt: "Find mainland customer contact changes this quarter",
    form: {
      title: "Customer Contact Changes",
      tabs: [
        {
          id: "change-filter",
          label: "Change Filter",
          fields: [
            {
              id: "changePeriod",
              label: "Change period",
              type: "date-range",
              minPlaceholder: "Start date",
              maxPlaceholder: "End date",
            },
            {
              id: "customerMarket",
              label: "Customer market",
              type: "select",
              placeholder: "All markets",
              options: [
                { label: "Mainland China", value: "mainland-china" },
                { label: "Hong Kong, China", value: "hong-kong" },
                { label: "Singapore", value: "singapore" },
              ],
            },
            {
              id: "changedField",
              label: "Changed field",
              type: "multi-choice",
              options: [
                { label: "All", value: "all" },
                { label: "Mobile", value: "mobile" },
                { label: "Email", value: "email" },
                { label: "Address", value: "address" },
                { label: "Identity document", value: "identity" },
              ],
            },
            {
              id: "contactCustomerId",
              label: "Customer ID",
              type: "input",
              placeholder: "Enter a customer ID",
            },
            {
              id: "verifiedChange",
              label: "Verified change",
              type: "radio",
              options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "account-info-secondary",
    title: "Account Info",
    description: "Inquire about the bank, account type, and account status.",
    prompt: "List accounts with status changes in the last 30 days",
    form: {
      title: "Account Status Changes",
      tabs: [
        {
          id: "status-change-filter",
          label: "Status Filter",
          fields: [
            {
              id: "changedStatus",
              label: "Changed status",
              type: "multi-choice",
              options: [
                { label: "All", value: "all" },
                { label: "Activated", value: "activated" },
                { label: "Dormant", value: "dormant" },
                { label: "Frozen", value: "frozen" },
                { label: "Closed", value: "closed" },
              ],
            },
            {
              id: "statusChangeDate",
              label: "Change date",
              type: "date",
              placeholder: "Select a date",
            },
            {
              id: "servicingBranch",
              label: "Servicing branch",
              type: "select",
              placeholder: "All branches",
              options: [
                { label: "Shanghai", value: "shanghai" },
                { label: "Beijing", value: "beijing" },
                { label: "Guangzhou", value: "guangzhou" },
                { label: "Shenzhen", value: "shenzhen" },
              ],
            },
            {
              id: "currentBalance",
              label: "Current balance",
              type: "amount-range",
              minPlaceholder: "Minimum",
              maxPlaceholder: "Maximum",
            },
            {
              id: "relationshipManaged",
              label: "Relationship managed",
              type: "radio",
              options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
          ],
        },
      ],
    },
  },
];

export const followUpQuestions = [
  "Analyze current liquidity risks in Tier 1 regional banks",
  "Generate a compliance report for Q3 Cross-Chain settlements",
  "Audit wallet 0x4F...3B for potential wash trading patterns",
];

export const querySteps: QueryStep[] = [
  {
    id: "parse",
    name: "Parse Question",
    message: "Business intent identified",
    status: "success",
  },
  {
    id: "source",
    name: "Select Data Source",
    message: "Finance DM matched",
    status: "success",
  },
  {
    id: "sql",
    name: "Generate SQL",
    message: "SELECT * FROM hsbc-10272718-ombusvis.T3_PROJECT_CUST_PROFIT_DSS",
    status: "success",
  },
  {
    id: "check",
    name: "SQL Check",
    message: "No syntax errors",
    status: "success",
  },
  {
    id: "retrieve",
    name: "Retrieve Data",
    message: "Total rows: 9722, column: 7",
    status: "success",
  },
  {
    id: "render",
    name: "Render Result",
    message: "Table rendered with selectable rows",
    status: "success",
  },
];

export const runningSteps: QueryStep[] = [
  { id: "parse", name: "Parse Question", message: "Business intent identified", status: "success" },
  { id: "source", name: "Select Data Source", message: "Finance DM matched", status: "success" },
  { id: "sql", name: "Generate SQL", message: "Mapping fields with metadata", status: "running" },
  { id: "check", name: "SQL Check", message: "Waiting for generated SQL", status: "pending" },
  { id: "retrieve", name: "Retrieve Data", message: "Not started", status: "pending" },
  { id: "render", name: "Render Result", message: "Not started", status: "pending" },
];

export const metadataTables: MetadataTable[] = [
  {
    name: "customer_details",
    columns: [
      {
        name: "customer_id",
        type: "string",
        description: "Customer unique transaction key",
        sampleValue: "FT-QI9P8SWR",
        nullable: false,
        primaryKey: true,
      },
      {
        name: "event_time",
        type: "datetime",
        description: "UTC timestamp from source table",
        sampleValue: "2026-06-01 05:14:00",
        nullable: false,
        primaryKey: false,
      },
      {
        name: "client_name",
        type: "string",
        description: "Institution or account display name",
        sampleValue: "Coinbase Prime",
        nullable: false,
        primaryKey: false,
      },
      {
        name: "asset_symbol",
        type: "string",
        description: "Product or crypto asset symbol",
        sampleValue: "USDT",
        nullable: false,
        primaryKey: false,
      },
      {
        name: "trade_amount",
        type: "decimal",
        description: "Original transaction amount",
        sampleValue: "36,200",
        nullable: false,
        primaryKey: false,
      },
    ],
  },
];

export const queryResult: QueryResult = {
  id: "result-001",
  title: "MAINLAND CHINA CLIENT NEW CUSTOMER DETAILS (01/01/2026)",
  totalRows: 9722,
  columns: [
    { key: "customer_id", label: "HEADER", type: "string" },
    { key: "event_time", label: "HEADER", type: "datetime" },
    { key: "client_name", label: "HEADER", type: "string" },
    { key: "asset_symbol", label: "HEADER", type: "string" },
    { key: "region", label: "HEADER", type: "string" },
    { key: "trade_amount", label: "HEADER", type: "decimal" },
  ],
  rows: [
    {
      id: "row-001",
      customer_id: "FT-QI9P8SWR",
      event_time: "2026-06-01 05:14:00",
      client_name: "Coinbase Prime",
      asset_symbol: "USDT",
      region: "Nanjing",
      trade_amount: "36,200",
    },
    {
      id: "row-002",
      customer_id: "FT-TRA7V6Y5",
      event_time: "2026-06-02 05:25:09",
      client_name: "BlackRock",
      asset_symbol: "MATIC",
      region: "Hangzhou",
      trade_amount: "58,450",
    },
    {
      id: "row-003",
      customer_id: "FT-1BZIWYX",
      event_time: "2026-06-01 06:41:37",
      client_name: "Goldman Sachs",
      asset_symbol: "SOL",
      region: "Shanghai",
      trade_amount: "42,180",
    },
    {
      id: "row-004",
      customer_id: "FT-8CRD9JQ",
      event_time: "2026-06-03 04:10:54",
      client_name: "JPMorgan",
      asset_symbol: "BTC",
      region: "Beijing",
      trade_amount: "49,720",
    },
  ],
};

export const summary: Summary = {
  id: "sum-001",
  queryId: "q-001",
  selectedRowIds: ["row-001", "row-002"],
  analyticalApproach:
    "Analyze key indicator summaries and business optimization directions.",
  conclusion:
    "Significant regional variance: Nanjing saw the sharpest decline (-22%), followed by Hangzhou (-18%).",
  highlightedMetrics: ["-22%", "-18%"],
  sections: [
    {
      title: "I. Analytical Approach",
      items: [
        "Use selected rows as the evidence scope before expanding to the full table.",
        "Compare regional movement, asset distribution, and client concentration.",
      ],
    },
    {
      title: "II. Dimensional Analysis Results",
      items: [
        "Nanjing and Hangzhou show the clearest variance and should be reviewed first.",
        "Asset distribution differs by account, so product-level comparison is required.",
      ],
    },
    {
      title: "III. Customer Behavior Characteristics And Risk Warning",
      items: [
        "Watch accounts with fast variance because they may signal risk concentration.",
        "Select more rows before final recommendations when the evidence set is small.",
      ],
    },
  ],
};
