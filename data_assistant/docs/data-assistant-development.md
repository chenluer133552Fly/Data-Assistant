# Data Assistant 开发文档

> 依据 Figma 文件 `Data Assistant` 的可见 UI/流程整理。由于当前无法通过 Figma API 直接读取节点 JSON，以下内容以画布可见信息为准，并对部分工程实现做了合理补全。

## 1. 产品概述

Data Assistant 是一个面向业务数据分析的智能问答与数据洞察工具。用户可以通过自然语言提问、上传文件或连接数据源，系统将问题转化为数据查询，完成 SQL 校验、数据检索、表格展示，并基于选中的数据生成结构化分析总结。

核心能力：

- 自然语言提问：用户通过输入框提交业务问题。
- 示例问题推荐：提供 Recommended / Frequent 示例问题，并支持刷新。
- 文件上传与数据连接：支持 Upload File 和 Networking 两类数据接入方式。
- SQL 生成与校验：展示查询执行步骤，例如 SQL Check、Retrieve Data。
- 数据表格展示：展示检索结果，支持勾选多行数据。
- Metadata 查看：支持展示数据表/字段元数据信息。
- 数据总结生成：基于已选数据和指定分析思路生成结论与详细分析。

## 2. 主要用户流程

### 2.1 首页进入

1. 用户进入 Data Assistant。
2. 页面展示欢迎语，例如 `Hi, Ember / Welcome to Data Assistant`。
3. 用户可以选择：
   - 在输入框中输入问题。
   - 通过 `/` 查看示例句。
   - 点击 `Upload File` 上传数据文件。
   - 点击 `Networking` 连接外部数据源。
   - 在 `Recommended` 或 `Frequent` 中选择示例问题。

### 2.2 自然语言查询

1. 用户输入问题，例如：
   - `How many customers do we have?`
   - `Show me the product revenue in 2025`
   - `Check sales trends over the past 6 months`
2. 点击提交按钮。
3. 系统解析意图并生成查询。
4. 系统展示查询执行状态：
   - SQL 生成
   - SQL Check
   - Retrieve Data
5. 检索成功后进入结果表格展示。

### 2.3 数据选择与总结

1. 用户在结果表格中勾选数据行。
2. 表格上方显示 `Selected Data: N rows`。
3. 用户进入 `Summarize Data`。
4. 用户可指定分析思路。
5. 系统基于已选数据生成：
   - 简短结论，建议 20-30 个英文单词。
   - 高亮关键数字。
   - 分段详细分析。
6. 若勾选数据不足，展示 toast：
   - `for better results, 请勾选更多数据`

## 3. 前端模块

### 3.1 应用框架模块

功能：

- 页面基础布局。
- 左侧快捷导航栏。
- 顶部或内容区标题。
- 当前用户问候语。
- 全局 loading / empty / error 状态。

页面元素：

- `Hi, Ember`
- `Welcome to Data Assistant`
- 左侧图标导航。
- 画布中可见的淡色渐变背景。

### 3.2 问题输入模块

功能：

- 自然语言问题输入。
- `/` 快捷查看示例句。
- 提交问题。
- 输入校验。
- 空输入禁用提交。
- Enter 提交。

页面元素：

- 输入框 placeholder：`Ask me a question, Enter [ / ] view example sentences`
- 提交箭头按钮。
- Examples 提示。

前端状态：

- `idle`
- `typing`
- `submitting`
- `generating`
- `failed`

### 3.3 示例问题模块

功能：

- 展示示例问题列表。
- 支持 `Recommended` 与 `Frequent` 两个 tab。
- 支持刷新示例问题。
- 点击示例问题后填入输入框或直接发起查询。
- Frequent 无数据时展示 empty state。

页面元素：

- `Examples`
- `Recommended`
- `Frequent`
- `Refresh`
- `No Data`

### 3.4 数据接入模块

功能：

- 上传本地文件。
- 连接外部数据源。
- 展示接入状态。
- 数据源解析后进入 metadata 和查询能力。

子模块：

- Upload File
  - 支持 csv / xlsx / json 等结构化文件。
  - 文件大小、格式校验。
  - 上传进度。
  - 解析失败提示。

- Networking
  - 数据库或接口连接配置。
  - 连接测试。
  - 数据源保存。
  - schema 拉取。

页面元素：

- `Upload File`
- `Networking`

### 3.5 查询执行过程模块

功能：

- 展示自然语言转 SQL 的执行链路。
- 展示每一步执行状态。
- 展示 SQL 校验结果。
- 展示取数结果摘要。

可见步骤：

- `SQL Check`
- `No syntax errors`
- `Retrieve Data`
- `Total rows: 9722, column: ...`

建议补充步骤：

- Parse Question
- Select Data Source
- Generate SQL
- SQL Check
- Retrieve Data
- Render Result

状态：

- pending
- running
- success
- failed
- skipped

### 3.6 Metadata 模块

功能：

- 查看当前数据源 metadata。
- 展示表名、字段名、字段类型、字段描述。
- 支持 show / hide metadata。
- 查询生成时可基于 metadata 提高 SQL 命中率。

页面元素：

- `Show metadata`

建议字段：

- tableName
- columnName
- dataType
- description
- sampleValue
- nullable
- primaryKey

### 3.7 数据结果表格模块

功能：

- 展示查询结果表。
- 支持表格标题。
- 支持行勾选。
- 支持全选。
- 展示已选行数。
- 勾选数据用于 Summarize Data。
- 表头和单元格横向滚动。
- 大数据量分页或虚拟滚动。

页面元素：

- 表格标题示例：`MAINLAND CHINA CLIENT NEW CUSTOMER DETAILS (01/01/2026)`
- `Selected Data: 2 rows`
- checkbox
- 表头 `HEADER`

建议补充功能：

- 排序。
- 筛选。
- 分页。
- 列宽调整。
- 单元格复制。
- 结果导出。

### 3.8 Summarize Data 模块

功能：

- 基于已选数据生成分析。
- 支持用户指定分析思路。
- 未指定分析思路时不展示该区域或使用默认分析策略。
- 展示生成依据。
- 生成结论和详细分析。
- 关键数字高亮。
- 数据不足时 toast 提示。

页面元素：

- `SUMMARIZE DATA`
- `SPECIFIED ANALYTICAL APPROACH`
- `Generated based on: Selected Data: 2 rows`
- `Conclusion`
- `I. Analytical Approach`
- `II. Dimensional Analysis Results`
- `III. Customer Behavior Characteristics And Risk Warning`

输出要求：

- 结论简短，20-30 个英文单词。
- 高亮关键数字，例如 `-22%`、`-18%`。
- 详细分析按段落或编号展示。
- 分析内容必须引用已选数据，不应编造未检索字段。

异常提示：

- 当已选数据不足时：
  - `for better results, 请勾选更多数据`

## 4. 后端模块

### 4.1 用户与会话模块

功能：

- 用户身份识别。
- 会话上下文保存。
- 当前数据源、查询历史、选中数据状态管理。

核心数据：

- userId
- sessionId
- activeDataSourceId
- currentQueryId
- selectedRowIds

### 4.2 文件解析模块

功能：

- 文件上传。
- 文件格式识别。
- 表结构解析。
- 样例数据抽取。
- metadata 生成。

建议处理：

- 大文件异步解析。
- 文件解析任务进度。
- 字段类型自动推断。
- 错误行定位。

### 4.3 数据源连接模块

功能：

- 数据库连接配置。
- 连接测试。
- schema 同步。
- metadata 缓存。
- 权限校验。

支持范围建议：

- PostgreSQL
- MySQL
- SQL Server
- Snowflake / BigQuery，按项目需要扩展。

### 4.4 NL2SQL 模块

功能：

- 将自然语言问题转换成 SQL。
- 基于 metadata 选择表和字段。
- 生成可审计 SQL。
- 保留生成过程日志。

输入：

- question
- dataSourceId
- metadata
- userContext

输出：

- sql
- confidence
- referencedTables
- referencedColumns
- explanation

### 4.5 SQL 校验模块

功能：

- SQL 语法校验。
- 禁止危险语句。
- 限制查询范围。
- 自动添加 limit。
- 返回校验结果。

限制：

- 默认只允许 SELECT。
- 禁止 DROP / DELETE / UPDATE / INSERT / ALTER。
- 限制最大返回行数。
- 限制最大执行时长。

### 4.6 查询执行模块

功能：

- 执行 SQL。
- 返回结果数据。
- 返回字段信息。
- 返回总行数。
- 记录查询耗时。

输出：

- columns
- rows
- totalRows
- executionTimeMs
- queryId

### 4.7 数据总结模块

功能：

- 根据用户选中行生成总结。
- 支持指定分析思路。
- 生成结论和详细分析。
- 数值指标提取与高亮。

输入：

- selectedRows
- selectedColumns
- analyticalApproach
- question
- metadata

输出：

- conclusion
- highlightedMetrics
- sections
- warnings

### 4.8 审计与日志模块

功能：

- 记录问题、SQL、执行状态、结果摘要。
- 记录失败原因。
- 用于问题回溯和模型效果优化。

## 5. 建议接口

### 5.1 示例问题

`GET /api/examples?type=recommended|frequent`

返回：

```json
{
  "items": [
    {
      "id": "ex_001",
      "text": "How many customers do we have?",
      "type": "recommended"
    }
  ]
}
```

### 5.2 上传文件

`POST /api/data-sources/upload`

返回：

```json
{
  "dataSourceId": "ds_001",
  "status": "parsing",
  "taskId": "task_001"
}
```

### 5.3 连接数据源

`POST /api/data-sources/connect`

返回：

```json
{
  "dataSourceId": "ds_002",
  "connected": true
}
```

### 5.4 获取 Metadata

`GET /api/data-sources/{dataSourceId}/metadata`

返回：

```json
{
  "tables": [
    {
      "name": "customer_details",
      "columns": [
        {
          "name": "customer_name",
          "type": "string",
          "description": "Customer display name"
        }
      ]
    }
  ]
}
```

### 5.5 提交自然语言查询

`POST /api/queries`

请求：

```json
{
  "dataSourceId": "ds_001",
  "question": "Check sales trends over the past 6 months"
}
```

返回：

```json
{
  "queryId": "q_001",
  "status": "running"
}
```

### 5.6 获取查询状态

`GET /api/queries/{queryId}`

返回：

```json
{
  "queryId": "q_001",
  "status": "success",
  "steps": [
    {
      "name": "SQL Check",
      "status": "success",
      "message": "No syntax errors"
    },
    {
      "name": "Retrieve Data",
      "status": "success",
      "message": "Total rows: 9722"
    }
  ],
  "sql": "SELECT ...",
  "resultId": "result_001"
}
```

### 5.7 获取查询结果

`GET /api/results/{resultId}`

返回：

```json
{
  "title": "MAINLAND CHINA CLIENT NEW CUSTOMER DETAILS (01/01/2026)",
  "columns": [
    {
      "key": "customer_id",
      "label": "HEADER",
      "type": "string"
    }
  ],
  "rows": [
    {
      "id": "row_001",
      "customer_id": "FT-QI9P8SWR"
    }
  ],
  "totalRows": 9722
}
```

### 5.8 生成数据总结

`POST /api/summaries`

请求：

```json
{
  "queryId": "q_001",
  "selectedRowIds": ["row_001", "row_002"],
  "analyticalApproach": "Analyze key indicator summaries and business optimization directions."
}
```

返回：

```json
{
  "summaryId": "sum_001",
  "conclusion": "Significant regional variance: Nanjing saw the sharpest decline (-22%), followed by Hangzhou (-18%).",
  "highlightedMetrics": ["-22%", "-18%"],
  "sections": [
    {
      "title": "Analytical Approach",
      "items": ["..."]
    },
    {
      "title": "Dimensional Analysis Results",
      "items": ["..."]
    },
    {
      "title": "Customer Behavior Characteristics And Risk Warning",
      "items": ["..."]
    }
  ]
}
```

## 6. 数据模型建议

### 6.1 DataSource

```ts
type DataSource = {
  id: string;
  name: string;
  type: "file" | "database" | "api";
  status: "connected" | "parsing" | "failed";
  createdAt: string;
  updatedAt: string;
};
```

### 6.2 Query

```ts
type Query = {
  id: string;
  dataSourceId: string;
  question: string;
  sql?: string;
  status: "pending" | "running" | "success" | "failed";
  steps: QueryStep[];
  resultId?: string;
};
```

### 6.3 QueryResult

```ts
type QueryResult = {
  id: string;
  title: string;
  columns: ResultColumn[];
  rows: ResultRow[];
  totalRows: number;
};
```

### 6.4 Summary

```ts
type Summary = {
  id: string;
  queryId: string;
  selectedRowIds: string[];
  analyticalApproach?: string;
  conclusion: string;
  highlightedMetrics: string[];
  sections: SummarySection[];
};
```

## 7. 关键交互与校验

- 输入框为空时不可提交。
- 用户未接入数据源时，提交问题需提示先上传文件或连接数据源。
- 查询失败时展示失败步骤和错误原因。
- SQL 校验失败时不执行取数。
- 表格至少选择 1 行才能生成总结；建议少于 2 行时提示选择更多数据。
- 已选数据变化后，总结结果需标记为过期或提示重新生成。
- Metadata 加载失败时不阻塞基础查询，但需要给出提示。
- 大表查询必须分页或虚拟滚动。

## 8. 验收标准

### 首页

- 能显示欢迎语、输入框、上传文件、数据连接和示例问题。
- Recommended 有数据时展示列表。
- Frequent 无数据时展示 `No Data`。
- Refresh 可重新拉取示例问题。

### 查询链路

- 提交问题后展示执行步骤。
- SQL Check 成功时展示 `No syntax errors`。
- Retrieve Data 成功时展示总行数。
- 查询失败时能定位失败步骤。

### 数据表

- 查询结果能渲染为表格。
- 支持勾选行。
- 已选行数实时更新。
- 横向溢出时可滚动。

### Summarize Data

- 能读取用户指定分析思路。
- 能显示 `Generated based on: Selected Data: N rows`。
- 能生成 Conclusion 和至少 3 个分析分段。
- 关键数字有高亮样式。
- 数据不足时展示 toast。

## 9. 开发优先级

### P0

- 首页输入框。
- 示例问题 Recommended。
- 文件上传。
- metadata 解析。
- NL2SQL 查询链路。
- SQL 校验。
- 查询结果表格。
- 行选择。
- Summarize Data 基础生成。

### P1

- Frequent 示例问题。
- Refresh 示例问题。
- Networking 数据源连接。
- 查询步骤可视化。
- Metadata 展示面板。
- 总结内容数字高亮。
- 错误与 toast 体系。

### P2

- 查询历史。
- 结果导出。
- 高级筛选和排序。
- 权限管理。
- 多数据源切换。
- 模型效果反馈。

## 10. 待确认问题

- Figma 中 `Networking` 的具体含义：数据库连接、网络接口连接，还是企业网络数据源。
- Upload File 支持的文件类型和大小限制。
- Summarize Data 是否允许用户手动编辑分析思路。
- 查询结果是否需要支持导出。
- Metadata 是否需要字段级业务释义、样例值和血缘信息。
- SQL 是否需要向用户完全展示，还是仅展示执行步骤。
- 数据源权限和用户角色是否需要第一期实现。

