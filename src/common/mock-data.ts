import type {
  Database,
  Idea,
  Product,
  Selection,
  Signal,
  SignalSource,
} from "./types";

export const CURRENT_USER = { id: "ember", name: "Ember Gao" };
export const PRODUCTS: Product[] = ["FX", "Mortgage", "Wealth", "Cards"];
export const FOCUS_PRODUCT_OPTIONS: { value: Product; label: string }[] = [
  { value: "FX", label: "FX (Foreign Exchange)" },
  { value: "Mortgage", label: "Mortgage" },
  { value: "Wealth", label: "Wealth Management" },
  { value: "Cards", label: "Credit Cards" },
];

// Mock entry points only. Signals and preferences are selected in the drawer.
export const CONSTRAINT_OPTIONS: Record<
  Product,
  { value: string; label: string }[]
> = {
  FX: [
    { value: "fx-engagement", label: "FX customer engagement" },
    { value: "fx-market", label: "Currency market opportunities" },
    { value: "fx-custom", label: "Custom selection" },
  ],
  Mortgage: [
    { value: "mortgage-buyers", label: "Home buyer opportunities" },
    { value: "mortgage-renewal", label: "Mortgage renewal engagement" },
    { value: "mortgage-custom", label: "Custom selection" },
  ],
  Wealth: [
    { value: "wealth-review", label: "Portfolio review opportunities" },
    { value: "wealth-engagement", label: "Wealth customer engagement" },
    { value: "wealth-custom", label: "Custom selection" },
  ],
  Cards: [
    { value: "cards-activation", label: "New cardholder activation" },
    { value: "cards-travel", label: "Travel and rewards engagement" },
    { value: "cards-custom", label: "Custom selection" },
  ],
};
export const STAGES = [
  "Acquisition",
  "Onboarding",
  "Relationship Deepening",
  "Retention",
  "Servicing (non CLCM stage)",
];
export const CHANNELS = [
  "SMS",
  "Email",
  "Banner",
  "Push Notification",
  "Call Lead",
  "Branch",
];
export const emptySelection = (): Selection => ({
  signalIds: [],
  stages: [],
  channels: [],
  notes: "",
});

const customerSeeds = [
  [
    "JPY/HKD Broad Customer Attention",
    "In the last 30 days, JPY/HKD drew 18,601 watchlist views from 5,735 unique customers, materially ahead of other FX pairs. This indicates broad customer attention and supports FX lead ideation around pair-led awareness and conversion opportunities.",
    "Behavioral",
    "Mass Affluent FX Browsers",
  ],
  [
    "Repeat FX Pair Monitoring",
    "There were 5,576 customer-pair combinations with at least three repeat views in the last 30 days. Examples included repeated monitoring of CHF/HKD, AUD/HKD, JPY/HKD, CNY/HKD and EUR/HKD, indicating concentrated pair-level intent that can support follow-up FX campaigns.",
    "Behavioral",
    "High-Intent FX Watchers",
  ],
  [
    "Viewed-but-Not-Traded FX Pairs",
    "There were 21,596 customer-pair combinations where customers viewed an FX pair in the last 30 days but had no matching trade in the last 90 days. This highlights observed interest with no completed FX action.",
    "Conversion",
    "FX Considerers Without Conversion",
  ],
  [
    "HKD/USD Trading Concentration by Segment",
    "Actual FX demand in the last 30 days was concentrated in HKD/USD and USD/HKD flows, especially within Prestige, Prestige Signature and Preferred segments. This supports deepening campaigns for customers already trading these core currency directions.",
    "Transactional",
    "Prestige and Preferred FX Transactors",
  ],
  [
    "Rising Recent FX Activity",
    "There were 6,896 customers whose recent 30-day FX trading activity exceeded their prior 30-day activity. This signals momentum and reactivation opportunities for customers whose trading behavior is accelerating.",
    "Momentum",
    "Reactivated and Momentum FX Customers",
  ],
  [
    "New-to-Bank USD Starter Adoption",
    "Recently onboarded customers have started viewing USD/HKD content while still holding only HKD products. This indicates early USD curiosity and supports onboarding-led education campaigns.",
    "Lifecycle",
    "New-to-Bank Customers",
  ],
  [
    "Investment Research Before First Trade",
    "Customers are returning to investment insights but have not placed their first eligible trade. Timely educational content can help them understand the next step.",
    "Behavioral",
    "Mass Affluent",
  ],
  [
    "Mortgage Rate Comparison Activity",
    "Customers with upcoming property purchases are comparing mortgage offers and repayment plans. Follow-up can focus on affordability and a personalised appointment.",
    "Conversion",
    "Home Buyers",
  ],
  [
    "Wealth Portfolio Review Opportunity",
    "Existing wealth customers are reviewing multi-currency holdings more frequently. An advisory conversation can help connect current interests to a diversified portfolio.",
    "Transactional",
    "Mass Affluent",
  ],
  [
    "Card Benefits Discovery",
    "New cardholders are exploring travel and everyday rewards. Relevant onboarding messages can introduce the benefits most closely matched to their needs.",
    "Lifecycle",
    "New-to-Bank Customers",
  ],
  [
    "Preferred Customer Digital Engagement",
    "Preferred customers are engaging with product education across mobile and email, creating an opportunity for coordinated follow-up.",
    "Momentum",
    "Preferred Customers",
  ],
  [
    "Upcoming Mortgage Renewal Window",
    "A group of mortgage customers is approaching its renewal window. Early outreach can support an informed review of available options.",
    "Lifecycle",
    "Home Owners",
  ],
  [
    "Cross-Currency Savings Interest",
    "Savers are monitoring deposit rates in more than one currency. Balanced education can help them consider currency exposure alongside yield.",
    "Behavioral",
    "Mass Affluent",
  ],
  [
    "Returning Wealth Customers",
    "Previously inactive customers have returned to wealth content this month. Their renewed interest may support a carefully timed portfolio review.",
    "Momentum",
    "Preferred Customers",
  ],
];
const marketSeeds = [
  [
    "JPY Outlook: A Measured Path to Normalisation",
    "Policy divergence and changing rate expectations continue to shape the yen outlook. Pair-specific education should explain the base case alongside downside scenarios.",
    "Market Outlook",
    "Mass Affluent",
  ],
  [
    "USD Rates and Currency Diversification",
    "US rate expectations are shifting. A balanced currency conversation can help customers review concentrated USD exposure without implying a guaranteed outcome.",
    "Macro",
    "Prestige Customers",
  ],
  [
    "Hong Kong Property Financing Update",
    "A changing rate environment creates an opportunity to explain mortgage affordability, repayment flexibility and refinancing considerations.",
    "Rates",
    "Home Buyers",
  ],
  [
    "Multi-Asset Income Opportunities",
    "Diversified income strategies may support customers reviewing their long-term financial goals. Suitability and investment horizon remain central to any conversation.",
    "Investment",
    "Mass Affluent",
  ],
  [
    "Travel Spending and FX Seasonality",
    "Seasonal travel demand is increasing interest in foreign currency and card benefits. Timely information can connect planning needs with practical product education.",
    "Market Outlook",
    "Preferred Customers",
  ],
  [
    "Regional Growth and Portfolio Resilience",
    "Regional growth remains uneven. Portfolio reviews can discuss diversification and liquidity alongside opportunities in different markets.",
    "Macro",
    "Mass Affluent",
  ],
  [
    "Mortgage Affordability in a Changing Market",
    "Households are reassessing property budgets. Clear repayment examples can help customers evaluate affordability across different rate scenarios.",
    "Rates",
    "Home Buyers",
  ],
  [
    "Currency Volatility Watch",
    "Recent market moves underline the importance of currency risk awareness. Follow-up should include balanced scenarios and a clear explanation of fees.",
    "Market Outlook",
    "Preferred Customers",
  ],
  [
    "Long-Term Wealth Planning Themes",
    "Retirement, liquidity and family planning remain key themes for wealth clients considering their next portfolio decision.",
    "Investment",
    "Mass Affluent",
  ],
  [
    "Consumer Confidence and Spending Trends",
    "Spending patterns are evolving across travel and everyday categories, offering context for relevant customer engagement.",
    "Macro",
    "Preferred Customers",
  ],
  [
    "Interest Rate Scenario Review",
    "Customers may benefit from reviewing how a range of interest rate outcomes could affect their savings, borrowing and investment plans.",
    "Rates",
    "Home Owners",
  ],
  [
    "Global Diversification Themes",
    "Global opportunities require a balanced view of risk. Use customer goals and suitability to guide product conversations.",
    "Investment",
    "Prestige Customers",
  ],
];

function createSignals(source: SignalSource, seeds: string[][]): Signal[] {
  return seeds.map(([title, description, category, segment], index) => ({
    id: `${source}-${index + 1}`,
    source,
    title,
    description,
    category,
    impact: index % 6 === 2 ? "Low" : index % 5 === 4 ? "High" : "Medium",
    score: 88 - (index % 7) * 3,
    segment,
    product:
      title.includes("Mortgage") || title.includes("Property")
        ? "Mortgage"
        : title.includes("Card") ||
          title.includes("Travel") ||
          title.includes("Spending")
        ? "Cards"
        : title.includes("Wealth") ||
          title.includes("Portfolio") ||
          title.includes("Asset") ||
          title.includes("Investment")
        ? "Wealth"
        : "FX",
    publisher:
      source === "customer"
        ? "Omnibase"
        : "Chief Investment Office — Weekly Market Outlook",
    createdAt: new Date(Date.UTC(2026, 9, 30 - index, 0, 17)).toISOString(),
  }));
}

export const customerSignals = createSignals("customer", customerSeeds);
export const marketSignals = createSignals("market", marketSeeds);
export const cioSignals = createSignals("cio", marketSeeds.slice(0, 10));
export const allSignals = [...customerSignals, ...marketSignals, ...cioSignals];

const ideaSeeds = [
  [
    "USD Core Flow Deepening with Diversification Check",
    "Contact existing Prestige, Prestige Signature, and Preferred customers with recent HKD/USD or USD/HKD activity to deepen FX engagement through a structured review: confirm current USD-linked needs, offer the next FX transaction or FXTMD path where eligible, and add a brief diversification checkpoint so the journey does not over-concentrate customers in USD.",
    "FX",
    "Prestige and Preferred",
    "Deepening",
    "FX transaction in USD/HKD or HKD/USD; FXTMD where eligible",
    "Increase repeat FX engagement among existing USD-linked customers",
  ],
  [
    "JPY Watchers Assisted FX Conversion",
    "Contact customers who repeatedly monitored JPY/HKD or viewed it without trading, using an Email followed by specialist or RM Call Lead that explains the current CIO JPY scenario, key risks, and a simple next-step path to complete an FX transaction or request advice.",
    "FX",
    "High-Intent FX Watchers",
    "Conversion",
    "FX transaction in JPY/HKD; specialist/RM advisory conversation",
    "Convert eligible reached customers with recent JPY/HKD monitoring",
  ],
  [
    "Specialist call-out for repeat FX pair watchers",
    "Use specialist or RM Call Lead for customers with repeated monitoring of the same FX pair to turn observed intent into an advisory conversation and potential FX transaction. The customer experience is a timely, pair-relevant outreach offering a short FX view and next-step discussion, not a hard-sell trade push.",
    "FX",
    "High-Intent FX Watchers",
    "Conversion",
    "FX transaction; multi-currency review",
    "Drive qualified FX transaction follow-up among existing customers",
  ],
  [
    "Accelerating FX Activity Review for Prestige and Preferred Customers",
    "Trigger RM or specialist outreach to customers whose FX activity has accelerated recently. Confirm current USD-linked behavior, transaction timing needs, and whether a broader multi-currency plan is appropriate.",
    "FX",
    "Prestige and Preferred",
    "Deepening",
    "FX transaction / FX advisory review; eligibility to confirm",
    "Increase qualified FX follow-up transactions or booked advisory conversations",
  ],
  [
    "New-to-Bank USD Curiosity First-Trade Activation",
    "Use a low-friction onboarding journey to help recently onboarded HKD-only customers understand their first eligible USD FX transaction. Follow educational content with a specialist conversation where appropriate.",
    "FX",
    "New-to-Bank Customers",
    "Activation",
    "FX transaction (USD/HKD); FX market education email",
    "Drive a first eligible USD FX transaction",
  ],
  [
    "Wealth milestone activation",
    "Invite affluent existing customers into a structured RM/specialist conversation that reviews current USD concentration and introduces staged multi-currency actions based on CIO differentiated outlook, rather than a one-size-fits-all trade push.",
    "Wealth",
    "Mass Affluent",
    "Activation",
    "Wealth advisory; FXTMD where eligible; multi-currency review",
    "Convert eligible reached customers into a completed advisory conversation",
  ],
  [
    "A clearer path to your next home",
    "Help customers comparing property financing understand affordability, repayment options and next steps through a personalised mortgage consultation.",
    "Mortgage",
    "Home Buyers",
    "Acquisition",
    "Residential mortgage; affordability consultation",
    "Increase qualified mortgage appointments",
  ],
  [
    "Everyday rewards, introduced at the right moment",
    "Introduce newly onboarded cardholders to relevant travel and everyday benefits through a simple sequence of useful messages and benefit reminders.",
    "Cards",
    "New-to-Bank Customers",
    "Activation",
    "Travel and everyday rewards cards",
    "Support first-month card activation and engagement",
  ],
  [
    "A portfolio conversation for returning customers",
    "Welcome customers returning to wealth research with a balanced portfolio review, tailored to their objectives, liquidity needs and investment horizon.",
    "Wealth",
    "Mass Affluent",
    "Retention",
    "Wealth portfolio review; investment education",
    "Re-engage existing wealth customers with a relevant advisory conversation",
  ],
  [
    "Mortgage renewal, with room to plan",
    "Start a helpful renewal conversation ahead of time so customers can compare repayment plans and make an informed decision before their current term ends.",
    "Mortgage",
    "Home Owners",
    "Retention",
    "Mortgage renewal and refinancing review",
    "Increase timely mortgage renewal conversations",
  ],
  [
    "Travel-ready currency planning",
    "Connect seasonal travel interest to useful currency planning and card benefit information, with clear disclosure of fees and eligibility.",
    "Cards",
    "Preferred Customers",
    "Deepening",
    "Travel cards; foreign currency planning",
    "Deepen relevant product engagement before travel",
  ],
  [
    "A balanced approach to multi-currency savings",
    "Offer savings customers a concise explanation of rate differences, currency exposure and liquidity, followed by an optional advisory appointment.",
    "FX",
    "Mass Affluent",
    "Conversion",
    "Multi-currency savings and FX review",
    "Support an informed next savings decision",
  ],
];

export function createInitialDatabase(): Database {
  const leads: Idea[] = ideaSeeds.map(
    (
      [
        title,
        description,
        product,
        segment,
        objective,
        productDescription,
        objectiveDescription,
      ],
      index
    ) => ({
      id: `lead-${index + 1}`,
      sourceId: `lead-${index + 1}`,
      title,
      description,
      product: product as Product,
      segment,
      objective,
      productDescription,
      objectiveDescription,
      channels:
        index % 3 === 0
          ? ["Call Lead", "Push Notification"]
          : ["Email", "Call Lead"],
      priority: index < 5 ? "High" : index < 10 ? "Medium" : "Low",
      score: [88, 89, 85, 86, 83, 82, 75, 68, 55, 60, 48, 45][index],
      authorId: CURRENT_USER.id,
      author: CURRENT_USER.name,
      createdAt: new Date(Date.UTC(2026, 9, 30, 4, 30 - index)).toISOString(),
      selection: {
        signalIds: ["customer-1", "market-1"],
        stages: ["Relationship Deepening"],
        channels: ["Email", "Call Lead"],
        notes: "",
      },
    })
  );
  const community = leads.slice(0, 9).map((idea, index) => ({
    ...structuredClone(idea),
    id: `public-${index + 1}`,
    authorId: index === 2 ? CURRENT_USER.id : index % 2 ? "fly" : "teens",
    author: index === 2 ? CURRENT_USER.name : index % 2 ? "Fly" : "Teens",
  }));
  const validation = community.slice(0, 4).map((idea, index) => ({
    ...structuredClone(idea),
    id: `copy-${index + 1}`,
    copiedById: index === 0 ? CURRENT_USER.id : "teens",
    copiedBy: index === 0 ? CURRENT_USER.name : "Teens",
  }));
  return { leads, community, validation };
}
