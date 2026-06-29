# HSBC Data Assistant — Development Guide

> Frontend development specification derived from Figma UI design flows.
> Tech stack: React 19 + TypeScript 6 + Vite 8
> Last updated: 2026-06-29

---

## 1. Project Overview

HSBC Data Assistant is an intelligent data analysis assistant for banking operations. Users ask natural-language questions about financial data; the system processes queries through an AI pipeline (PII check → intent recognition → query rewrite → table selection → SQL generation → data summarization) and returns structured results with tables, charts, and reasoning traces.

### Core User Flow

```
Welcome Page → Enter Query → Thinking Process (streaming) → Results (Summary + Table + Chart)
                   ↑                    ↓
              Example Queries    Clarification Dialog (if ambiguous)
                   ↑                    ↓
              Template Cards     Feedback / Follow-up Query
```

---

## 2. Layout Architecture

The application uses a fixed three-zone layout at 1440×900 viewport:

```
┌──────────────────────────────────────────────────────────┐
│  Header Bar (collapsible hamburger ☰)            Avatar  │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│  Sidebar   │              Main Content Area              │
│  (280px)   │              (flex: 1)                      │
│            │                                             │
│  - Logo    │                                             │
│  - Data    │                                             │
│    Range   │                                             │
│  - Pinned  │                                             │
│  - History │                                             │
│  - Show    │                                             │
│    Metadata│                                             │
│  - Settings│                                             │
│            │                                             │
├────────────┴─────────────────────────────────────────────┤
│  Floating Input Bar (fixed bottom, always visible)       │
└──────────────────────────────────────────────────────────┘
```

### 2.1 Header Bar

- Left: hamburger menu icon (toggles sidebar collapse)
- Right: user avatar (circular, top-right corner)
- Height: ~48px
- Background: transparent / white, no visible border

### 2.2 Sidebar (Left Panel, 280px)

The sidebar is collapsible (hamburger toggle). When collapsed, only icons remain visible.

| Section | Content |
|---------|---------|
| **Brand** | HSBC logo (red hexagon) + "HSBC" text |
| **App Switcher** | Dropdown: "Data Assistent" (current app name) |
| **Data Range** | Dropdown selector, e.g. "Finance DM". Shows available data marts: Customer Revenue, EUC-WPB Financial Deck, EUC-For WPB/GB/CMB, ISF. Checkbox multi-select. |
| **Pinned (60 days)** | Collapsible list of pinned queries. Each item shows truncated query text. Hover shows delete (×) icon. |
| **Today** | Today's query history |
| **Yesterday** | Yesterday's query history |
| **Previous 7 Days** | Older query history |
| **Show Metadata** | Button at sidebar bottom, navigates to Metadata management page |
| **Saved Queries** | Link to saved/bookmarked queries |
| **Settings** | App settings (gear icon) |

### 2.3 Main Content Area

Dynamically renders one of:
- **Welcome View** — when no active query
- **Results View** — after submitting a query
- **Clarification View** — when the system needs more info

### 2.4 Icon Toolbar (Left Edge)

A vertical strip of 4 small icons on the left edge of the main content area (inside the content zone, not the sidebar):

1. ☰ Menu / filter icon
2. 🧠 Reasoning / brain icon — shows "Explain Reasoning" panel
3. 📋 Table / sheet icon — shows data in table format
4. 🔄 Refresh icon
5. ⚙ Settings (bottom) — system configuration

---

## 3. Pages & Screens

### 3.1 Welcome Page (Before Asking)

Displayed when user has no active conversation or starts a new chat.

```
┌─────────────────────────────────────────────┐
│                                             │
│          (gradient background, subtle       │
│           purple-blue-pink tones)           │
│                                             │
│     Hi, {username}                          │
│     Welcome to Data Assistant               │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ✨ Ask me a question, Enter [ / ]   │ ➤  │
│  │    view example sentences            │    │
│  │ 📎 Upload File  🌐 Networking       │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Quick Question              ↻ Next Group   │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │Customer  │ │Account   │ │Credit Card │  │
│  │Info      │ │Info      │ │Transaction │  │
│  │          │ │          │ │            │  │
│  └──────────┘ └──────────┘ └────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │Customer  │ │Account   │ │ ⊕ Add      │  │
│  │Info      │ │Info      │ │ Templates  │  │
│  └──────────┘ └──────────┘ └────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

#### Welcome States

There are 3 conditional welcome variants based on user permissions:

| State | Condition | Display |
|-------|-----------|---------|
| **Templates Available** | User has template access | Shows Quick Question cards (2×3 grid) with "Add Templates" button |
| **No Template, No Example** | User lacks template permission | Shows only the input bar, no Quick Question section |
| **Collapsed Sidebar** | Sidebar hidden | Full-width main content, right sidebar shows same data range & history |

#### Quick Question Template Cards

Each card is a rounded rectangle containing:
- **Title** (bold): e.g. "Customer Info", "Account Info", "Credit Card Transaction"
- **Description** (gray text): e.g. "Inquire about customer contact information, ID number, etc."
- Cards are arranged in a 3-column grid, 2 rows visible
- "↻ Next Group" link rotates to next set of templates
- "⊕ Add Templates" card allows users to create custom templates

#### Input Bar

The input bar is the primary interaction point:
- Placeholder: `Ask me a question, Enter [ / ] view example sentences`
- Sparkle icon (✨) on the left
- Send button (➤, black circle with white arrow) on the right
- Below the text input: two action chips:
  - `📎 Upload File` — attach files for analysis
  - `🌐 Networking` — enable web data access

#### Slash Command (/) — Example Sentences

When user types `/` in the input bar, a dropdown appears:

```
┌─────────────────────────────────────────────┐
│ Examples                                     │
│ ● Recommended    Frequent         ↻ Refresh │
│─────────────────────────────────────────────│
│ Please provide the reconciliation report... │
│ Show me the product revenue in 2025         │
│ How many customers do we have?              │
│ Check sales trends over the past 6 months   │
│ For the last 3 months, what was the biggest │
│   stock holding each month?                 │
└─────────────────────────────────────────────┘
```

- **Recommended** tab: system-curated example queries (synced with online config)
- **Frequent** tab: user's most frequently used queries (sorted by frequency descending)
- **Refresh** button: loads next batch (5 items per page)
- Clicking an example populates the input bar

---

### 3.2 Results Page (After Asking)

After submitting a query, the main content area transitions to the results view.

#### 3.2.1 Thinking Process (Streaming)

The system shows a step-by-step reasoning trace as it processes:

```
┌─────────────────────────────────────────────┐
│ 🔍 INQUIRY                                  │
│ Show the new mainland customer on 2026-01-01│
│                                             │
│ ⓘ AI Output May Not Always Be Accurate.    │
│   Please Review It Before Using.            │
│                                             │
│ 🧠 THINKING PROCESS...              ∨      │
│ ┌─────────────────────────────────────────┐ │
│ │ STEP 01  PII Check                     │ │
│ │          No PII in user query           │ │
│ │                                         │ │
│ │ STEP 02  Intent Recognition             │ │
│ │          1 intent: QueryData; slots:none│ │
│ │                                         │ │
│ │ STEP 03  Query Rewrite                  │ │
│ │          For 2026-01-01, show the full  │ │
│ │          list of newly onboarded...     │ │
│ │                                         │ │
│ │ STEP 04  Table Selection                │ │
│ │          hsbc-...TBL_CIN_ATTRIBUTE_FINAL│ │
│ │                                         │ │
│ │ STEP 05  SQL Generation                 │ │
│ │  ┌─ SQL ──────────────────────── ⬇ ─┐  │ │
│ │  │ SELECT * FROM ... WHERE ...       │  │ │
│ │  └───────────────────────────────────┘  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

Pipeline steps (in order):
1. **PII Check** — scans for personally identifiable information
2. **Intent Recognition** — classifies query intent and extracts slots
3. **Query Rewrite** — reformulates query for clarity
4. **Table Selection** — identifies target database table(s)
5. **SQL Generation** — generates the SQL query (shown in code block with download button)
6. **Data Summarization** — generates natural language insights

The Thinking Process panel is collapsible (chevron ∨) and shows elapsed time (e.g. "12s").

#### 3.2.2 Action Buttons (Post-Result)

After results are generated, 4 colored action buttons appear at the bottom of the results area:

| Button | Color | Action |
|--------|-------|--------|
| **Generate Insights** | Green border | Generates deeper analytical insights from the data |
| **Show Lineage** | Yellow border | Shows data lineage/provenance + requires selecting data range |
| **Explain Reasoning** | Red/pink border | Opens reasoning tree visualization + requires selecting data range |
| **Superset** | Purple border | Opens data in Superset BI dashboard + redirects to BI tool |

#### 3.2.3 Summarize Data Section

Below the thinking process, the system shows:

```
┌─────────────────────────────────────────────┐
│ SUMMARIZE DATA                        ∨  ── │
│                                             │
│ • On January 1, 2026, geographical          │
│   distribution, Shanghai, Beijing, and      │
│   Guangdong were the main sources...        │
│ • New customer volume accounted             │
│   for 76%, significantly...                 │
│                                             │
│ MAINLAND CHINA...           📊Table 📈Chart│
│ ┌────────┬────────┬────────┬───────────────┐│
│ │ HEADER │ HEADER │ HEADER │ HEADER  STATUS││
│ ├────────┼────────┼────────┼───────────────┤│
│ │FT-QI9..│2026-06 │Coinbase│ USDT  PENDING││
│ │FT-TRA..│2026-06 │BlackRo.│ MATIC FLAGGED││
│ │FT-1BZ..│2026-06 │BlackRo.│ SOL   FLAGGED││
│ └────────┴────────┴────────┴───────────────┘│
│                     Rows per page: 15 ∨     │
│              Showing 1-50 of 1,184 entries  │
│              Page 1 of 24  |< < 1 > >|      │
└─────────────────────────────────────────────┘
```

Components:
- **Summary text**: bullet-point insights with bold highlights for key metrics
- **View toggle**: `📊 Table` | `📈 Chart` tabs
- **Data table**: sortable columns, filterable headers, pagination
  - Rows per page selector (15 default)
  - Page navigation with total count
  - Status badges (PENDING, FLAGGED, SETTLED) with color coding
  - Column sort (↕) and filter (≡) icons in headers
  - Download button (⬇) for exporting data
  - Fullscreen button (⤢) for expanded view

#### 3.2.4 Explain Reasoning View

When user clicks "Explain Reasoning", a tree-diagram visualization appears:

```
┌─────────────────────────────────────────────┐
│ 🔲 EXPLAIN REASONING               ⤢  ∨   │
│                                             │
│ [ NAME ] Reasoning                          │
│                                             │
│  ┌──────────┐                               │
│  │ Total NII│                               │
│  │ 888,888  │                               │
│  │ ↗5.2%↘3.4│──┬──┐                        │
│  └──────────┘  │  │                         │
│           ┌────┘  └────┐                    │
│     ┌─────┴────┐ ┌─────┴────┐               │
│     │Saving NII│ │Saving NII│               │
│     │ 888,888  │ │ 888,888  │               │
│     │ ↗5.2%    │ │ ↗5.2%    │               │
│     └──────────┘ └──────────┘               │
│                       │                      │
│              ┌────────┼────────┐             │
│         ┌────┴───┐┌───┴───┐┌──┴────┐        │
│         │USD Sav.││USD Sav││USD Sav│        │
│         │888,888 ││888,888││888,888│        │
│         └────────┘└───────┘└───────┘        │
│                                             │
│  ⊕ ⊖ 🔲  (zoom controls)                  │
└─────────────────────────────────────────────┘
```

- Hierarchical tree layout showing financial metric breakdown
- Each node shows: metric name, value, percentage changes (↗ up, ↘ down)
- Node colors: varying shades of gray/purple to indicate hierarchy depth
- Zoom controls: zoom in (⊕), zoom out (⊖), fit to screen (🔲)
- Collapsible/expandable with chevron (∨)
- Fullscreen toggle (⤢)

---

### 3.3 Clarification Dialog

When the AI's intent confidence is low, it asks for clarification:

```
┌─────────────────────────────────────────────┐
│ 🧠 THINKING PROCESS..  12s            >     │
│                                             │
│ ┌───────────────────────────────────────┐   │
│ │ ❓ I need a few clarifications        │   │
│ │                                       │   │
│ │ Please provide the specific region    │   │
│ │ or location where you need to collect │   │
│ │ transaction records.                  │   │
│ │                                       │   │
│ │ ┌─────────────────────────────────┐   │   │
│ │ │ Please Provide Additional       │   │   │
│ │ │ Details.                        │   │   │
│ │ └─────────────────────────────────┘   │   │
│ │                                       │   │
│ │                    [Skip]  [Submit]   │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- Thinking Process shown collapsed (with elapsed time)
- Clarification card with question text
- Text input area for user's response
- **Skip** button (outlined) — proceeds without clarification
- **Submit** button (filled black) — submits clarification

---

### 3.4 Feedback Dialog

Users can provide feedback on AI answers:

```
┌─────────────────────────────────────┐
│ Feedback                         ✕  │
│                                     │
│ What's wrong with this answer?      │
│                                     │
│ [Irrelevant answer] [Incorrect data]│
│ [Incomplete information]            │
│ [incomprehensible]                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ You can tell us the specific    │ │
│ │ reasons so we can improve.      │ │
│ └─────────────────────────────────┘ │
│                                     │
│                          [Submit]   │
└─────────────────────────────────────┘
```

- Modal overlay with close (✕) button
- Pre-defined feedback tags (selectable chips): Irrelevant answer, Incorrect data, Incomplete information, Incomprehensible
- Free-text textarea for detailed feedback
- Submit button

---

### 3.5 Select Data Range Modal

When the user triggers "Show Lineage" or certain actions:

```
┌─────────────────────────────────────────────┐
│ Select data range                        ✕  │
│                                             │
│ Please select row data (Selected: 3 rows)   │
│                          Show selected only  │
│ ┌──┬────────┬────────┬────────┬──────┬────┐ │
│ │☐ │ HEADER │ HEADER │ HEADER │HEADER│ H  │ │
│ ├──┼────────┼────────┼────────┼──────┼────┤ │
│ │☐ │FT-QI9..│2026-06 │Coinbase│ USDT │    │ │
│ │☐ │FT-TRA..│2026-06 │BlackRo.│ MATIC│    │ │
│ │☑ │FT-1BZ..│2026-06 │BlackRo.│ SOL  │    │ │
│ │☑ │FT-HBO..│2026-06 │JP Morg.│ BTC  │    │ │
│ │☑ │FT-0B6..│2026-06 │Goldman │ DOT  │    │ │
│ └──┴────────┴────────┴────────┴──────┴────┘ │
│         Rows per page: 15 ∨                  │
│   Showing 1-50 of 1,184    Page 1 of 24     │
│                                             │
│ Please select Columns                        │
│ ☑ Column A  ☑ Column B  ☑ Column C          │
│ ☑ Column D  ☑ Column E                      │
│                                             │
│ Select date                                  │
│ [ 2000    → 2026   📅 ]                     │
│                                             │
│                            [Generate]        │
└─────────────────────────────────────────────┘
```

- Row selection with checkboxes (supports select all via header checkbox)
- "Show selected only" toggle link
- Column selection with checkboxes (pre-filtered to analyzable columns)
- Date range picker (year range)
- **Generate** button (black, bottom-right)

---

### 3.6 Customer Info / Business Intent Modal (Before Input)

When user clicks a Quick Question template card, a structured form appears:

```
┌─────────────────────────────────────────────┐
│ Customer Info                            ✕  │
│                                             │
│ Tab A  Tab B  Tab C                         │
│ ─────                                       │
│                                             │
│ Range Input (Includes    [ 18  ~ 65  ]      │
│   Quick Options)         18-30 30-45 45-60  │
│                          60+                │
│                                             │
│ Multiple choice          [ All         ∨ ]  │
│  (Includes Quick         Chinese mainland   │
│   Options)               Hong Kong, China   │
│                                             │
│ Text input box           [ Please enter   ] │
│                                             │
│ Multiple choice          All Self-employed  │
│                          Full-time employed  │
│                          Part time  Student  │
│                          Retired  Housewife  │
│                                             │
│ Single choice            [Yes]  No          │
│                                             │
│ Date/Time Picker         [Please select 📅] │
│ Date/Time Range          [Start → End   📅] │
│ Amount range             [Min   → Max   ¥]  │
│                                             │
│                              [Submit]        │
└─────────────────────────────────────────────┘
```

Form field types supported:
- **Range Input** with Quick Options (preset buttons like 18-30, 30-45)
- **Multiple Choice** with dropdown + Quick Option chips
- **Text Input** — free text
- **Multiple Choice chips** — toggle buttons (multi-select, "All" option)
- **Single Choice** — radio-style toggle (Yes/No)
- **Date/Time Picker** — single date selector
- **Date/Time Range** — start-to-end date range
- **Amount Range** — min-max numeric with currency symbol
- **Tabs** (Tab A / Tab B / Tab C) — for multi-section forms

---

### 3.7 Metadata Management Page

Accessed via "Show Metadata" button in the sidebar. A separate page with its own layout:

```
┌──────────────────────────────────────────────────────────┐
│ ☰                                                Avatar  │
├────────┬──────────────────────────────┬──────────────────┤
│ Icon   │ [+New] [↑Upload] [↓Download]│   DATA PREVIEW   │
│ bar    │ [🗑Delete]                   │                  │
│        │                              │   📋             │
│ Tree:  │ Name    Modified  Type Creat.│                  │
│ ▾ HSBC │ EQUITY..│2026-08│TypeA│D.T. │ EQUITY_SWAP_     │
│  ▾ HSBC│ EQUITY..│2026-07│TypeB│E.M. │ SETTLEMENT       │
│   Hong.│ EQUITY..│2026-06│TypeC│L.J. │                  │
│  ▾ Omni│ EQUITY..│2026-05│TypeD│E.M. │ Primary data mart│
│   base │                              │ containing daily │
│   Data │                              │ settlement       │
│   Marts│                              │ records for OTC  │
│  ▾ Bus.│                              │ equity           │
│   Fig. │                              │ derivatives...   │
│   ├Meta│                              │                  │
│   ├Bus.│                              │                  │
│   │ Int│                              │                  │
│   ├Dom.│                              │                  │
│   │Know│                              │                  │
│   └Glo.│                              │                  │
└────────┴──────────────────────────────┴──────────────────┘
```

#### Left Panel — Tree Navigation

Hierarchical tree structure:
- HSBC (root)
  - HSBC HongKong
    - Omnibase Data Marts
      - Business Figure
        - **Metadata** (active/selected)
        - **Business Intent**
        - **Domain Knowledge**
        - **Glossary**

These 4 sub-categories correspond to the "SHOW METADATA" flow tabs.

#### Center Panel — Data Table

- Action buttons: `+ New`, `↑ Upload`, `↓ Download`, `🗑 Delete`
- Sortable table columns: Name, Modified Time, Type (badge: Type A/B/C/D), Creator
- Row selection support

#### Right Panel — Data Preview

- Preview icon and "DATA PREVIEW" label
- Shows selected item description (name + description text)

#### Show Metadata Flow (4 entry points)

The metadata system has 4 tabs/views accessible from different entry points:

| Tab | Purpose | Entry |
|-----|---------|-------|
| **入口 (Entry)** | Gateway to metadata system | "Show Metadata" button in sidebar |
| **Metadata** | View/manage table metadata | Tree → Metadata node |
| **Domain Knowledge** | Domain-specific knowledge base | Tree → Domain Knowledge node |
| **Glossary** | Business term definitions | Tree → Glossary node |

---

### 3.8 Edit Business Intent (Template Editor)

A full-screen modal for creating/editing business intent templates:

```
┌─────────────────────────────────────────────────────────┐
│ ✏ Edit Business Intent                              ✕   │
├──────────┬──────────────────────────────┬───────────────┤
│ INPUTS   │ Loan Application Details     │ Multiple      │
│          │ Gather initial business      │ Choice        │
│ Single-  │ entity information and       │               │
│ line Text│ funding requirements.        │ Text input box│
│ Multi-   │                              │ [Please enter]│
│ line Text│ ┌──────────────────────────┐ │               │
│ Numeric  │ │ Legal Entity Name        │ │ Choices/Opts  │
│ Field    │ │ [Enter full registered   │ │ ⋮ Working Cap │
│ Numeric  │ │  business name       ]   │ │ ⋮ Equipment F.│
│ Range    │ └──────────────────────────┘ │ ⋮ Real Estate │
│          │                              │ + Add Choice  │
│ SELECTION│ ┌──────────────────────────┐ │               │
│ ○ Single │ │ Purpose of Funding  ↑↓🗑│ │ Required Field│
│   Choice │ │ Select all that apply... │ │ [●━━━━━━━━━━] │
│ ☑ Multi  │ │ ☐ Working Capital       │ │               │
│   Choice │ │ ☐ Equipment Financing   │ │ Allow "Other" │
│ ⊙ Drop-  │ │ ☐ Real Estate Acq.     │ │ [━━━━━━━━━━○] │
│   down   │ └──────────────────────────┘ │               │
│          │                              │ Selection     │
│ DATE&TIME│ Projected Repayment Period   │ Limit         │
│ 📅 Date  │ [Start Date → End Date 📅]  │ [Min] [Max]   │
│   Picker │                              │               │
│ 🕐 Time  │ ┌──────────────────────────┐ │               │
│ 📅 Date  │ │ ⊕ Drag and drop         │ │               │
│   Range  │ │   components here        │ │               │
│          │ └──────────────────────────┘ │               │
└──────────┴──────────────────────────────┴───────────────┘
```

Three-column layout:
1. **Left panel** — Component palette (draggable field types)
   - INPUTS: Single-line Text, Multi-line Text, Numeric Field, Numeric Range
   - SELECTION: Single Choice, Multiple Choice, Dropdown Menu
   - DATE & TIME: Date Picker, Time, Date Range
2. **Center panel** — Form canvas (drag-and-drop builder)
   - Shows form title + description
   - Each field has reorder (↑↓) and delete (🗑) controls
   - Drop zone at bottom: "Drag and drop components here"
3. **Right panel** — Field properties editor
   - Field type label
   - Input configurations (placeholder text, etc.)
   - Choices/Options (with drag-to-reorder, add/remove)
   - Required Field toggle
   - Allow "Other" option toggle
   - Selection Limit (min/max)

---

## 4. Component Specifications

### 4.1 Core Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `AppLayout` | Three-zone layout shell | `sidebarCollapsed: boolean` |
| `Sidebar` | Left navigation panel | `dataRange, queryHistory, pinnedQueries` |
| `Header` | Top bar with hamburger + avatar | `onToggleSidebar, user` |
| `ChatInput` | Floating bottom input bar | `onSubmit, onFileUpload, placeholder` |
| `WelcomePage` | Initial state with templates | `templates, hasPermission` |
| `ResultsView` | Query results display | `inquiry, thinkingSteps, summary, tableData` |
| `ThinkingProcess` | Streaming pipeline steps | `steps: PipelineStep[], elapsed: number` |
| `DataTable` | Paginated sortable table | `columns, data, pagination, onSort` |
| `ChartView` | ECharts wrapper | `type, spec, data` |
| `ClarificationDialog` | AI follow-up question | `question, onSubmit, onSkip` |
| `FeedbackDialog` | User feedback modal | `onSubmit, tags[]` |
| `SelectDataRange` | Row/column/date selector modal | `tableData, onGenerate` |
| `ReasoningTree` | Hierarchical metric visualization | `treeData, zoomControls` |

### 4.2 Template & Metadata Components

| Component | Description |
|-----------|-------------|
| `QuickQuestionCard` | Template card in 3-col grid |
| `ExampleSentences` | Dropdown triggered by `/` command |
| `MetadataPage` | Full metadata management page |
| `MetadataTree` | Hierarchical tree navigation |
| `BusinessIntentEditor` | Drag-and-drop form builder |
| `FormFieldPalette` | Draggable field type panel |
| `FormCanvas` | Drop target for form fields |
| `FieldPropertiesPanel` | Right-side field config editor |

### 4.3 Action Button Chips

Post-result action buttons are colored bordered chips:

```tsx
type ActionButton = {
  label: string;        // "Generate Insights"
  color: string;        // border/text color
  icon?: string;        // optional leading icon
  requiresDataRange?: boolean; // if true, opens SelectDataRange first
  action: () => void;
};
```

Color mapping:
- Generate Insights → `#4CAF50` (green)
- Show Lineage → `#FFC107` (amber)
- Explain Reasoning → `#E91E63` (pink)
- Superset → `#9C27B0` (purple)

---

## 5. State Management

### 5.1 Store Structure (Zustand)

```typescript
// Chat Store
interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isProcessing: boolean;
  currentSteps: PipelineStep[];
  elapsedTime: number;
}

// App Store
interface AppState {
  sidebarCollapsed: boolean;
  selectedDataRange: string;           // e.g. "Finance DM"
  selectedDataSources: string[];       // checked data marts
  user: { name: string; avatar: string };
}

// Metadata Store
interface MetadataState {
  treeData: TreeNode[];
  selectedNode: TreeNode | null;
  metadataEntries: MetadataEntry[];
}
```

### 5.2 Key Data Types

```typescript
interface Conversation {
  id: string;
  query: string;
  timestamp: Date;
  isPinned: boolean;
  status: 'idle' | 'processing' | 'completed' | 'clarifying';
  result?: QueryResult;
}

interface PipelineStep {
  stepNumber: number;     // 1-6
  name: string;           // "PII Check", "Intent Recognition", etc.
  status: 'pending' | 'running' | 'completed';
  detail: string;         // step output description
  data?: any;             // e.g. generated SQL for step 5
}

interface QueryResult {
  summary: {
    text: string;              // markdown bullet points
    keyFindings: string[];
  };
  table: {
    columns: ColumnDef[];
    rows: Record<string, any>[];
    totalRows: number;
    pageSize: number;
  };
  chart?: {
    type: 'line' | 'bar' | 'pie' | 'tree';
    spec: Record<string, any>;   // ECharts option
  };
  reasoning?: ReasoningNode;     // tree data for Explain Reasoning
  sql?: string;                  // generated SQL
}

interface QuickTemplate {
  id: string;
  title: string;                 // "Customer Info"
  description: string;           // "Inquire about customer..."
  formFields: FormField[];       // structured form definition
  group: string;                 // for "Next Group" rotation
}
```

---

## 6. API Integration

### 6.1 Query Submission

```
POST /api/v1/query
Body: { query: string, dataRange: string, conversationId?: string }
Response: { queryId: string, sseEndpoint: string }
```

### 6.2 SSE Event Stream

```
GET /api/v1/query/{queryId}/stream

Events:
  "step"           → { stepNumber, name, status, detail, data? }
  "clarification"  → { question, inputPlaceholder }
  "summary"        → { text, keyFindings }
  "table"          → { columns, rows, totalRows }
  "chart"          → { type, spec }
  "reasoning"      → { treeData }
  "complete"       → { processingTime, dataSources }
  "error"          → { message, code }
```

### 6.3 Clarification Response

```
POST /api/v1/query/{queryId}/clarify
Body: { answer: string }
```

### 6.4 Feedback

```
POST /api/v1/query/{queryId}/feedback
Body: { tags: string[], detail?: string }
```

### 6.5 Metadata CRUD

```
GET    /api/v1/metadata/tree                    → tree structure
GET    /api/v1/metadata/{nodeId}/entries         → list entries
POST   /api/v1/metadata/{nodeId}/entries         → create entry
PUT    /api/v1/metadata/entries/{entryId}        → update entry
DELETE /api/v1/metadata/entries/{entryId}        → delete entry
POST   /api/v1/metadata/upload                   → upload file
GET    /api/v1/metadata/entries/{entryId}/preview → data preview
```

### 6.6 Templates

```
GET    /api/v1/templates?group={group}    → list templates by group
POST   /api/v1/templates                  → create template
PUT    /api/v1/templates/{id}             → update template
DELETE /api/v1/templates/{id}             → delete template
POST   /api/v1/templates/{id}/submit      → submit filled template as query
```

---

## 7. Routing

```typescript
const routes = [
  { path: '/',           element: <MainLayout />,      children: [
    { index: true,       element: <ChatPage /> },       // Welcome + Results
    { path: 'metadata',  element: <MetadataPage /> },   // Metadata management
    { path: 'settings',  element: <SettingsPage /> },    // App settings
  ]},
];
```

The primary chat experience (welcome → query → results) is a single-page flow within `ChatPage`, not separate routes. Navigation state is managed by the chat store, not the router.

---

## 8. Styling Guidelines

### 8.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--hsbc-red` | `#DB0011` | HSBC brand, primary accent |
| `--bg-primary` | `#FFFFFF` | Main content background |
| `--bg-secondary` | `#F5F5F5` | Card backgrounds |
| `--bg-gradient` | `linear-gradient(135deg, #E8E0F0, #D4E8F0, #F0E0E8)` | Welcome page subtle gradient |
| `--text-primary` | `#1A1A1A` | Headings, body text |
| `--text-secondary` | `#666666` | Descriptions, metadata |
| `--text-muted` | `#999999` | Placeholders, timestamps |
| `--border` | `#E5E5E5` | Card borders, dividers |
| `--sidebar-bg` | `#FFFFFF` | Sidebar background |
| `--sidebar-width` | `280px` | Sidebar default width |
| `--status-pending` | `#FFA726` | PENDING badge |
| `--status-flagged` | `#EF5350` | FLAGGED badge |
| `--status-settled` | `#66BB6A` | SETTLED badge |

### 8.2 Typography

- Headings: System font stack, bold
- Body: 14px regular
- Input placeholder: 14px, `--text-muted`
- Table cells: 13px
- Monospace (SQL blocks): `'Courier New', monospace`

### 8.3 Spacing & Layout

- Sidebar width: 280px (collapsible to ~48px icon strip)
- Content padding: 24px
- Card border-radius: 8px
- Card shadow: `0 1px 3px rgba(0,0,0,0.08)`
- Input bar height: ~56px (with action chips row below)
- Grid gap (template cards): 16px

---

## 9. Key Interactions

### 9.1 Sidebar Collapse/Expand

- Hamburger icon (☰) in header toggles sidebar
- Collapsed state: only icon strip (~48px wide) with tooltips
- Smooth CSS transition (width + opacity)

### 9.2 Streaming Results

- Pipeline steps appear one-by-one with typing animation
- Each step transitions: pending → running (spinner) → completed (checkmark)
- Elapsed timer counts up in real-time
- Summary text streams word-by-word via SSE

### 9.3 Follow-up Queries

- After results display, the input bar remains at the bottom
- Includes "+ New Chat" button for starting fresh
- Query history in sidebar updates in real-time

### 9.4 Data Range Selection

- Sidebar "Data Range" dropdown shows available data marts
- Checking/unchecking data marts filters available templates and query scope
- Selection persists across the session

### 9.5 Template Management

- "Add Templates" card opens template editor
- Templates are grouped; "Next Group" rotates through groups
- Template cards support hover effect (subtle elevation)
- Clicking a card opens the structured form modal (not a free-text query)

---

## 10. Development Priorities

### Phase 1 — Core Chat Experience
1. App layout shell (sidebar + header + main content + floating input)
2. Welcome page with static template cards
3. Chat input with send functionality
4. Results view with mock streaming steps
5. Data table component with pagination/sorting

### Phase 2 — AI Pipeline Integration
1. SSE connection for real-time pipeline steps
2. Clarification dialog flow
3. Summary + table rendering from API responses
4. Feedback dialog

### Phase 3 — Advanced Features
1. Explain Reasoning tree visualization
2. Select Data Range modal
3. Slash command (/) example sentences dropdown
4. Chart view (ECharts integration)
5. Action buttons (Generate Insights, Show Lineage, Superset redirect)

### Phase 4 — Metadata & Templates
1. Metadata management page (tree + table + preview)
2. Business Intent template editor (drag-and-drop form builder)
3. Template CRUD and form submission flow

---

## 11. File Structure (Target)

```
src/
├── main.tsx
├── App.tsx
├── index.css
│
├── layouts/
│   └── MainLayout.tsx              # Sidebar + Header + Content shell
│
├── pages/
│   ├── ChatPage/
│   │   ├── index.tsx               # Welcome + Results orchestrator
│   │   ├── WelcomePage.tsx         # Hi Ember + templates
│   │   └── ResultsView.tsx         # Thinking + Summary + Table
│   ├── MetadataPage/
│   │   ├── index.tsx               # Tree + Table + Preview
│   │   └── BusinessIntentEditor.tsx
│   └── SettingsPage/
│       └── index.tsx
│
├── components/
│   ├── Sidebar/
│   │   ├── index.tsx
│   │   ├── DataRangeSelector.tsx
│   │   └── QueryHistory.tsx
│   ├── Header/
│   │   └── index.tsx
│   ├── ChatInput/
│   │   ├── index.tsx               # Floating input bar
│   │   └── ExampleSentences.tsx    # / command dropdown
│   ├── ThinkingProcess/
│   │   ├── index.tsx               # Pipeline steps display
│   │   └── PipelineStep.tsx
│   ├── DataTable/
│   │   └── index.tsx               # Paginated, sortable table
│   ├── ChartView/
│   │   └── index.tsx               # ECharts wrapper
│   ├── ReasoningTree/
│   │   └── index.tsx               # Metric breakdown tree
│   ├── QuickQuestionCard/
│   │   └── index.tsx               # Template card
│   ├── SelectDataRange/
│   │   └── index.tsx               # Modal with row/col/date selection
│   ├── ClarificationDialog/
│   │   └── index.tsx
│   ├── FeedbackDialog/
│   │   └── index.tsx
│   └── FormBuilder/                # For Business Intent editor
│       ├── FieldPalette.tsx
│       ├── FormCanvas.tsx
│       └── FieldProperties.tsx
│
├── services/
│   ├── api.ts                      # Axios/fetch base config
│   ├── queryService.ts             # Query submission + SSE
│   ├── metadataService.ts          # Metadata CRUD
│   └── templateService.ts          # Template CRUD
│
├── stores/
│   ├── chatStore.ts                # Conversations, processing state
│   ├── appStore.ts                 # Sidebar, data range, user
│   └── metadataStore.ts            # Tree, entries
│
├── types/
│   ├── query.ts                    # Query, Result, PipelineStep
│   ├── metadata.ts                 # TreeNode, MetadataEntry
│   ├── template.ts                 # QuickTemplate, FormField
│   └── common.ts                   # Pagination, Column, etc.
│
├── hooks/
│   ├── useSSE.ts                   # SSE connection management
│   ├── useChat.ts                  # Query submission logic
│   └── useDebounce.ts
│
├── utils/
│   ├── constants.ts                # Colors, API URLs, step names
│   └── formatters.ts               # Date, number, currency formatters
│
└── assets/
    ├── hsbc-logo.svg
    └── icons/
```
