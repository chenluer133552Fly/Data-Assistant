# Ideation 项目需求说明

> 文档状态：可据此开始页面与 Mock 交互开发；已按用户授权采用本轮建议作为当前开发规则，正式接口及后续页面待补充内容见第 7 节。
>
> 本文整理原始描述与参考截图，区分明确要求、截图补充信息与待确认问题。待确认内容不作为已确定的开发规则。
>
> 标注为“当前暂定规则”的内容用于本期开发，不代表后端协议已经确定；后续有明确业务说明或接口约定时再更新。

## 1. 项目整体布局

页面采用顶部 Header、左侧导航菜单、右侧内容区的布局。

| 导航菜单 | 模块说明 |
| --- | --- |
| Intelligence Rader | 查看客户信号与 CIO 洞察 |
| Leads Ideation | 选择条件、生成构想、查看详情、发布与删除构想 |
| Ideation Community | 浏览公开构想，并复制到 Validation |
| Validation | 当前仅实现首页列表；View Details 为只读详情入口，其他页面及管理流程后续补充 |

**命名说明：** 原文使用 `Intelligence Rader`，截图菜单使用 `Intelligence Radar`，最终拼写待确认。原文中的 `Leades ideation`、`Clopase` 按截图整理为 `Leads Ideation`、`Collapse`。

## 2. Intelligence Rader 模块

### 2.1 首页与 Tab 切换

- 点击左侧菜单，进入首页。
- 页面标题下方展示两个 Tab，分别展示对应列表。
- 默认首页与另一 Tab 的样式参考下方截图。

**截图补充信息：**

- 两个 Tab 为 Customer Signals 与 CIO Insights（截图中的单复数写法有差异，最终文案待确认）。
- 筛选区包含产品、分类和排序控件。
- 信号卡片展示分类、影响程度、标题、描述、客群、产品类别、来源、时间和评分。
- 页面展示最后同步时间。

默认首页：

![Intelligence Rader 首页与 Customer Signals Tab](image-1.png)

切换至另一 Tab：

![Intelligence Rader 另一 Tab 的展示](image.png)

### 2.2 当前开发范围与暂定规则

- 当前实现 Customer Signals、CIO Insights 两个 Tab 的列表、筛选、排序与分页；默认选中 Customer Signals。
- 枚举和示例列表先使用 Mock 数据，两个 Tab 分别提供对应示例内容，不根据截图中相似内容推断两者数据相同。
- 当前不增加信号卡片点击后的跳转或详情流程。
- 默认分页、筛选与排序规则见第 6.1 节。
- CIO Insights 与信号选择抽屉中的 Market Signals 是否同源，正式接入时再明确，不影响当前 Mock 页面。

## 3. Leads Ideation 模块

### 3.1 首页列表

点击左侧 Leads Ideation 菜单后，展示构想列表。

明确要求：

- 顶部绿色 AI Ideation Engine 卡片默认展开，展示 Focus Product、Constraints 等内容。
- Focus Product 默认不选中；Constraints 为直接打开抽屉的入口，未选择产品时禁用。
- 未完成生成条件选择时，Generate Ideas 按钮禁用。
- 选项、枚举及下方构想列表当前允许使用 Mock 数据；后续由真实接口获取。
- 首次进入时即可展示 Mock 构想列表，无需先选择生成条件。

**截图补充信息：**

- 顶部绿色区域为 AI Ideation Engine，包含 Focus Product、Constraints、已选条件摘要和生成按钮。
- 列表上方包含排序、Priority、Product、Segment、Objective、Channel 筛选及搜索框。
- 卡片包含优先级、评分、标题、描述、Product Category、Target Segment、Idea Objective 和渠道标签。
- 卡片提供 Make Public、删除和 View Details 操作；符合操作权限的图标默认显示，无需悬停。

![Leads Ideation 首页列表](image-2.png)

### 3.2 Focus Product 与 Constraints 抽屉入口

- 先选择 Focus Product，再点击 Constraints 框，直接展示右侧信号选择抽屉。
- Constraints 不再使用下拉菜单或与产品关联的枚举，不需要先选条件入口。
- Focus Product 未选择时，Constraints 入口禁用；选择产品后即可点击。
- 切换 Focus Product 后，清空已选信号、偏好及补充信息，包括未提交草稿和已保存条件。
- 产品切换后，Generate Ideas 恢复禁用，直到重新完成有效条件选择。

**Constraints 当前暂定规则：**

- Constraints 框点击后直接打开抽屉；已有保存条件时，再次点击该框重新打开并回显。
- 抽屉负责选择具体信号、阶段、渠道及补充信息；Complete Selection 提交后的数量作为独立摘要展示。
- 数量摘要暂按“信号数量 + CLCM Stage 勾选数量 + Channels 勾选数量”计算，补充文字不计数。此数量可以超过 5，但其中信号始终最多 5 项。

### 3.3 Constraints 抽屉：第一步，选择信号

明确要求：

1. 展示信号选择抽屉。
2. 没有已选信号时，Next Step 按钮禁用；选择 1–5 项后即可点击，无需选满 5 项。
3. Customer Signals 与 Market Signals 两个 Tab、所有分页共用最多 5 项的总上限。
4. 切换 Tab 或分页后保留选择，选择计数按两个 Tab、所有分页合计。
5. 已选卡片不能再次点击取消选择。
6. 已选择 5 项时，其余未选择卡片呈禁用样式。
7. 达到上限后，继续点击未选择卡片不增加选中项，并显示 Toast：`Select up to 5 items`。
8. 抽屉提供“重新选择”入口，用于替换误选或已保存的信号；该操作仅清空当前信号草稿，不立即覆盖已保存条件，详见第 3.5 节。

**交互约束：** 禁用样式下仍需响应点击并触发上述 Toast。

**当前范围：** Selected Preview 暂不处理，不要求实现其展示与移除操作。参考图中包含该区域，仅作为后续参考。

关闭抽屉和重新打开时的选择状态见第 3.5 节。

![选择信号抽屉与达到上限时的 Toast](image-3.png)

### 3.4 Constraints 抽屉：第二步，可选偏好设置

- 点击 Next Step 后进入第二步。
- 必须进入第二步，再点击 Complete Selection；第一步不直接提交。
- 第二步中的 CLCM Stage、Channels、补充信息均为可选，全部留空也可以完成选择。
- 点击 Complete Selection 保存本次选择条件，不触发构想生成。

**截图补充信息：**

| 配置项 | 截图中的内容 |
| --- | --- |
| Preferred CLCM Stage | Acquisition、Onboarding、Relationship Deepening、Retention、Servicing（non CLCM stage） |
| Preferred Channels | SMS、Email、Banner、Push Notification、Call Lead、Branch |
| Additional information or keywords | 补充信息或关键词输入框 |
| 底部操作 | Previous step、Complete Selection |

**当前暂定规则：** 首次选择时，CLCM Stage、Channels 默认全部不勾选，补充信息默认为空；重新打开已保存条件时回显实际保存值。截图中的勾选表示示例状态。

![可选的 CLCM 阶段、渠道与补充信息设置](image-4.png)

### 3.5 完成选择与摘要展示

- 点击 Complete Selection 后，保存信号及可选偏好、补充信息，并在顶部绿色区域展示已提交条件摘要。
- 摘要包含信号数量、CLCM Stage 和 Channels；可选字段为空时暂不展示对应摘要标签。
- Focus Product 已选择，且已通过 Complete Selection 保存 1–5 项信号后，Generate Ideas 才可用。
- Complete Selection 只保存条件；随后点击 Generate Ideas 才开始生成。
- Constraints 旁展示已保存条件的数量摘要，计算口径见第 3.2 节；抽屉入口与数量摘要分开展示。

**抽屉草稿与已保存条件：**

| 操作场景 | 状态规则 |
| --- | --- |
| 首次打开抽屉，尚无已保存条件 | 未选择信号，阶段与渠道均不勾选，补充信息为空 |
| 未点击 Complete Selection 就关闭 | 放弃本次未提交修改，不更新绿色区域摘要 |
| 首次选择未提交就关闭，再次打开 | 重新初始化，不恢复上次未提交选择 |
| 已点击 Complete Selection，之后再次打开 | 回显刚刚保存的信号、偏好和补充信息，可查看已选内容 |
| 已有已保存条件，重新打开修改后未提交就关闭 | 放弃本次修改，保留之前已保存的条件；再次打开回显已保存版本 |
| 点击“重新选择” | 清空当前信号草稿，保留当前阶段、渠道及补充信息；回到第一步，Next Step 禁用直到重新选择至少 1 项 |
| 重新选择后点击 Complete Selection | 以新条件整体覆盖旧的已保存条件，并更新绿色区域摘要 |
| 重新选择后未提交就关闭 | 放弃本次信号重选及其他草稿修改，保留旧的已保存条件 |
| 切换 Focus Product | 清空已保存条件及草稿，按新产品重新选择 |

已选卡片仍不支持逐项点击取消；使用“重新选择”清空信号草稿后重新勾选。草稿不直接更新绿色区域及生成参数，只有 Complete Selection 才提交新版本。

![完成选择后展示顶部条件摘要](image-5.png)

### 3.6 顶部区域折叠与展开

- 点击 Collapse，收起顶部绿色区域中的展开内容。
- 折叠后的样式以下图为准。
- 截图中的折叠态保留条件摘要、生成按钮和 Expand 入口。

![AI Ideation Engine 折叠后的展示](image-6.png)

### 3.7 生成构想与任务进度

- 生成按钮文案统一为 `Generate Ideas`。
- TASKS 初始不显示，仅在点击 Generate Ideas 开始生成后出现。
- 点击 Generate Ideas 后，使用已保存的选择条件开始生成，并在页面右侧展示 TASKS 模块。
- 下方列表顶部新增 Skeleton 卡片占位，表示本次正在生成的结果；已有构想数据保留，不将旧卡片整体替换为 Loading。
- 正式接入时，TASKS 进度及步骤说明由后端流式输出驱动。
- 当前阶段允许 Mock TASKS 进度和步骤文案，例如“解析生成条件”“分析信号与渠道”“生成构想”，接入接口后使用真实返回内容。
- 生成成功后移除占位，将本次新结果追加到旧列表顶部，再按当前筛选、排序和分页规则展示。
- 生成失败后移除占位，保留旧列表，并使用 Ant Design 提示生成失败。
- 失败后再次点击 Generate Ideas 即可重试；TASKS 重新开始本次任务的进度展示。

**当前暂定规则：** 截图中“生成 10 条、保留 14 天”仅作为展示文案，不作为强制业务校验；前端不实现自动到期删除。Mock 生成数量和正式接口返回数量不需要强制相同，正式数量和有效期规则以后端业务约定为准。

**后续待补充：** 生成进行中的重复点击行为、TASKS 完成和关闭状态、取消任务、离开页面后任务如何处理，以及后端流式协议。

![生成构想后展示右侧 TASKS 模块](image-7.png)

### 3.8 发布构想到 Ideation Community

1. 点击卡片上的 Make Public，弹出确认 Modal。
2. 点击 OK 后调用发布接口，由后端保存公开发布信息。
3. 以接口成功返回作为发布成功的依据，成功后关闭 Modal。
4. 发布后的构想可在 Ideation Community 中查看。

**已确认的状态与后续操作：**

- 发布成功后，前端关闭 Modal 即可，不要求将 Make Public 改为 Published 或增加本地发布状态流程。
- 重复发布由后端判定；后端返回重复发布错误时，前端提示“该构想已发布”，不视为新的发布成功。
- 用户勾选 `Do not remind me again` 后，后续点击 Make Public 直接调用发布接口，不再弹出确认 Modal；接口成功才代表发布成功。
- “不再提醒”当前按账号标识保存在本浏览器的本地存储中，刷新及同一浏览器中同账号再次登录后仍生效，暂不设置自动过期；不同账号分别保存，不跨浏览器同步。是否改为后端保存，正式接入时再明确。
- 删除已公开的构想，需要进入 Ideation Community，找到自己发布的记录后删除；Leads Ideation 不增加撤销公开操作。
- 发布请求失败或重复发布错误时，提示对应错误；确认弹窗在失败时是否保留等细节待确认。

**截图补充信息：**

- 弹窗标题为 `Make this Idea Public?`。
- 说明发布后其他人可以发现该构想，并复制到 Validation。
- 包含 `Do not remind me again` 复选框，以及 Cancel、Ok 和关闭入口。
- “不再提醒”勾选后的行为以上述已确认规则为准。

卡片操作入口：

![构想卡片上的 Make Public、删除和 View Details 操作](image-8.png)

发布确认弹窗：

![Make Public 发布确认弹窗](image-14.png)

### 3.9 查看详情

- 点击 View Details，进入构想详情页。
- 详情页按模块分别实现，当前不封装跨模块公共详情组件，便于后续独立调整字段和操作。
- Leads Ideation 与 Ideation Community 当前可参考同一套详情样式，各自维护对应页面。
- 当前 Leads Ideation 详情页提供 Make Public 和删除操作，沿用列表中的发布与删除规则；返回入口回到 Leads Ideation 列表。
- 完整页面参考 image-9.png；各区域样式参考 image-10.png、image-11.png 和 image-12.png。

**截图补充信息：**

- 顶部包含返回入口、标签、标题及操作入口；长标题支持多行展示。
- 主内容包含 Idea Description、Idea Objective、Strategic Alignment、Primary CLCM Stage、Primary Strategy、Core Proposition、Product Portfolio、Channel Mix、Content Angle、Signal Rationale、Target Segment、Data Readiness/Confidence、Target Persona、Recommended Schedule、Priority Rationale、Expected KPIs、Expected Conversion Estimate 等区块。
- 右侧展示 Focus Product、Selected Signals、Preferred CLCM Stage 和 Preferred Channels 等生成条件。
- 字段以最终数据定义为准；缺失字段的展示及正式内容长度规则接入时补充。模块操作按本文各详情页规则实现，截断文本可通过 Tooltip 查看。

完整详情页概览：

![构想完整详情页概览](image-9.png)

详情页上部：

![详情页标题、主要内容与右侧条件信息](image-10.png)

详情页中部：

![详情页策略、信号依据、客群与计划信息](image-11.png)

详情页下部：

![详情页评分依据、预期 KPI 与转化预估](image-12.png)

### 3.10 删除构想

1. 点击卡片上 Make Public 右侧的删除图标。
2. 展示删除确认 Modal。
3. 点击确认按钮后调用删除接口，并进入 Loading 状态。
4. 删除成功后刷新列表。

**截图补充信息：**

- 弹窗标题为 `Delete this Idea?`。
- 弹窗说明：永久删除 Leads Ideation 中的该构想，已发布到 Ideation Community 或已复制到 Validation 的版本仍然保留。
- 原文称确认按钮为 OK，截图使用红色 `Delete` 按钮，最终文案待确认。
- 删除失败时的提示与弹窗保留规则待确认。

![删除确认弹窗与删除影响范围说明](image-15.png)

## 4. Ideation Community 模块

### 4.1 首页列表

首页样式参考下图。

**截图补充信息：**

- 顶部包含排序、Product、Segment、Objective、Channel、Priority 筛选、Created by me 复选框和搜索框。
- 卡片展示构想信息、Created By 和渠道标签。
- 卡片包含 Copy、View Details；仅当前用户自己发布的记录展示删除图标，其他用户发布的记录不展示删除图标。
- 符合权限的操作图标默认显示，无需悬停。

![Ideation Community 首页列表](image-16.png)

### 4.2 查看详情

- 点击 View Details，展示与 Leads Ideation 一致的详情内容。
- 使用 Ideation Community 独立的详情页实现，参考第 3.9 节样式，不封装跨模块公共详情组件。
- 当前详情页提供 Copy 操作；仅本人发布的记录提供删除操作，规则与社区列表一致。
- 返回入口回到 Ideation Community 列表。

### 4.3 复制到 Validation

1. 点击卡片上的 Copy。
2. 在 Validation 中创建可编辑副本。
3. 复制成功后，页面底部展示 Toast，文案为 `Editable copy created in Validation`。
4. Toast 同时提供 View 按钮。
5. Toast 默认展示 3 秒后自动关闭。

- 点击 Toast 中的 View，跳转到 Validation 首页列表。
- 同一构想是否允许重复复制由后端规则决定；当前不增加自行推断的次数限制，失败时用 Ant Design 提示接口错误。

**当前阶段说明：** 副本在业务上用于后续编辑，但 Validation 当前只实现首页列表，不因复制操作扩展编辑、保存或协作流程。

![复制成功后的底部 Toast 与 View 按钮](image-17.png)

### 4.4 删除自己发布的构想

- 用户在 Ideation Community 中找到自己发布的记录，通过该记录的删除图标执行删除。
- 只有当前用户自己发布的记录展示删除图标，其他记录不提供删除入口。
- 删除用于移除社区中的公开记录，不与 Leads Ideation 的源构想删除操作混用。
- 当前删除仅移除 Community 中的公开记录，保留 Leads Ideation 源构想和已经复制到 Validation 的副本。
- 发布者身份字段、删除接口和确认弹窗细节，待接口和业务细节补充后确定。

## 5. Validation 模块

### 5.1 首页列表

首页样式参考下图。

**截图补充信息：**

- 页面说明为与团队成员共同查看和编辑已保存的构想。
- 顶部包含排序、Product、Segment、Objective、Channel、Priority 筛选、Copied By me 复选框和搜索框。
- 卡片包含优先级、评分、标题、描述、产品类别、目标客群、构想目标、渠道及 Copied By 信息。
- 卡片可见锁形、编辑、删除图标及 View Details 入口。

**当前范围：**

- 当前仅实现首页列表页面，后续页面和交互由用户另行提供描述。
- View Details 明确为只读详情入口，不进入编辑模式；本期暂不实现 Validation 详情页及其跳转，入口保留展示，待用户提供详情设计后再接入。
- 锁定、解锁、编辑、保存、删除及团队协作流程暂不实现，不根据截图中的图标自行补充业务行为。
- 截图中的相关图标可作为页面展示参考，图标默认显示不等于当前已实现对应业务能力。

![Validation 首页列表](image-18.png)

## 6. 通用页面规则与接口能力

### 6.1 通用页面规则

| 项目 | 已确认规则 |
| --- | --- |
| 空数据与无搜索结果 | 使用 Ant Design 组件展示，例如 Empty，并区分空列表和无匹配结果 |
| 接口失败 | 使用 Ant Design 的错误状态或提示组件；具体业务错误文案按接口结果处理 |
| 加载中 | 使用 Ant Design 的 Spin、Skeleton 等适用组件；生成构想时仅在旧列表顶部新增 Skeleton 占位 |
| 分页 | 基于 Ant Design Pagination 封装分页组件，默认每页 10 条；筛选条件变化时重置到第一页 |
| 搜索 | 按回车提交搜索，搜索提交后重置到第一页；涉及构想列表时匹配标题、关键词、产品或客群，正式范围以接口协议为准 |
| 筛选与排序 | 枚举当前使用 Mock；不同筛选字段按 AND 组合，默认不限制筛选，按最新时间优先排序；正式时间字段随接口明确 |
| 文本截断 | 截断内容可通过 Tooltip 查看完整文本 |
| 操作图标 | 在满足权限且属于当前页面展示范围的前提下默认显示，无需悬停；Community 删除图标仅自己发布的记录可见 |
| Header 与左侧菜单 | 固定显示，内容区随页面正常滚动 |
| TASKS | 初始隐藏，点击 Generate Ideas 开始生成后出现；完成后的收起或关闭规则仍待确认 |
| 页面与抽屉滚动 | 采用正常滚动，不增加特殊滚动交互 |
| 详情页实现 | 按模块分别实现，当前不封装跨模块公共详情组件 |

### 6.2 接口能力梳理

以下为需求涉及的能力清单，不预设接口路径、请求方式或字段结构。

| 能力 | 已知要求 | 尚需补充 |
| --- | --- | --- |
| 信号与 CIO 洞察查询 | 当前用 Mock 展示两个 Tab 的列表、筛选、排序与分页；不增加卡片跳转 | 正式数据来源、枚举、时间字段、同步时间及与 Market Signals 的关系 |
| 产品与条件配置 | 先选产品，再点击 Constraints 框直接打开抽屉，无下拉枚举联动；保存条件后回显；切换产品清空条件；当前可 Mock | 正式产品来源、字段结构、保存是否需要独立接口 |
| 构想列表与详情查询 | 列表默认每页 10 条，回车搜索、筛选重置页码；详情按模块独立实现 | 字段结构、查询参数、正式枚举、时间字段与权限 |
| 生成构想与任务进度 | 顶部 Skeleton 占位，成功追加新结果，失败移除占位并保留旧列表，重试重置 TASKS | 提交参数、流式协议、并发规则、任务结束及离页行为 |
| 发布构想 | 成功后关闭弹窗；不再提醒偏好按账号存本浏览器；重复发布错误提示已发布 | 重复发布错误码、其他失败细节、是否改为后端保存提醒偏好 |
| 删除 Leads 构想 | 确认后调用接口，Loading 后刷新列表 | 错误返回、删除后的列表定位 |
| 删除社区公开构想 | 仅本人记录可删除；删除公开记录保留源构想及已有 Validation 副本 | 发布者身份字段、接口、确认交互 |
| 复制构想 | 创建供后续编辑的副本，成功 Toast 的 View 跳到 Validation 列表，失败提示接口错误 | 副本标识、重复复制规则及权限 |
| Validation 首页 | 当前仅实现列表页面；View Details 为只读详情入口 | 列表字段与查询接口；其他页面和管理流程后续另行提供 |

## 7. 正式接入与后续待补充内容

选择数量、产品联动、保存回显、信号重选、加载与结果追加、数量摘要、复制跳转、模块详情操作、分页搜索及提醒偏好的当前规则已写入正文。以下仅保留正式接入或后续页面需要补充的内容，不阻止按当前规则开展 Mock 页面开发；沿用原问题编号便于追踪。

### 7.1 正式接口与业务规则

| 编号 | 问题 | 需要明确的内容 |
| --- | --- | --- |
| Q04 | 正式条件字段 | Constraints 正式枚举、阶段及渠道枚举、补充文字长度与校验规则；当前按第 3 节 Mock 入口、默认值和计数规则开发 |
| Q05 | 正式生成数量与有效期 | 是否实际固定生成 10 条、保留 14 天及到期处理；当前仅保留展示文案，不实现自动到期删除 |
| Q06 | 任务协议与剩余交互 | 后端流式事件格式，生成中重复点击、取消、离页与恢复规则，以及 TASKS 完成和关闭状态；列表加载、成功追加与失败保留行为已确定 |
| Q07 | 发布与删除接口 | 公开记录与源记录的标识关系、重复发布错误码、删除接口及确认交互；当前社区删除保留源构想与副本，不再提醒偏好按账号存本浏览器 |
| Q08 | 正式复制规则 | 同一构想是否可重复复制、错误码和副本标识；当前 View 跳到 Validation 列表，接口失败时提示错误 |
| Q10 | 正式数据协议 | API 文档、字段结构、分页请求与响应、身份及发布者标识、权限、筛选枚举、排序字段；当前按 Mock 规则开发，接入时再对齐 |

### 7.2 展示细节与后续范围

| 编号 | 问题 | 需要明确的内容 |
| --- | --- | --- |
| Q11 | 其余命名与按钮文案 | Generate Ideas 已统一；仍需统一 Radar/Rader、CIO Insight/Insights，以及删除按钮 Delete/OK。 |
| Q12 | 正式信号数据对应关系 | CIO Insights 与 Market Signals 是否同源及正式字段差异；当前两个 Tab 分别 Mock，不增加卡片跳转 |
| Q13 | 查询状态恢复 | 切换 Tab 或返回列表时是否保留查询条件、页码及滚动位置；当前搜索、筛选、默认排序与每页 10 条规则已确定 |
| Q14 | 正式权限与后续详情 | Leads 发布与删除的正式权限；Validation 详情设计和其他管理流程后续另行提供，本期不实现详情跳转 |
| Q15 | 反馈与弹窗细节 | 未规定时长的 Toast、遮罩关闭、失败时是否保留弹窗，以及进行中的重复提交处理；错误反馈统一使用 Ant Design |
| Q16 | 剩余视觉交付标准 | Header 与菜单固定、图标默认显示、页面和抽屉正常滚动、截断文本可提供 Tooltip 已确认。仍需补充目标分辨率、是否适配移动端、字体与图标资源，以及原始设计稿和清晰字段文案。 |

## 8. 参考图补充说明

- 文中图片使用相对路径，均位于项目根目录。
- `image-13.png` 在原文中未被引用；查看后与 `image-14.png` 均为 Make Public 确认弹窗，暂作为补充参考，不认定为独立流程。
- 部分截图含设计工具选框、批注连线、工具栏和鼠标指针，这些内容不作为产品界面元素。
- 截图与文字存在差异时，以正文中的明确要求及当前暂定规则为本期开发依据；正式接口和后续页面的待补充项见第 7 节。
