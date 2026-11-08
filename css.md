# 页面样式规范

> 根据 `image.png`、`image-1.png`、`image-2.png` 中第 1–177 行整理。截图中编辑器的颜色预览方块不属于文本；右侧被截断的示例文案已注明。

本轮实施规则（用户已确认）：

- 移除 Constraints 旁的数量和编辑图标，保留下方 `Selected:` 摘要；以本次样式要求为准。
- 按扣除左侧菜单后的内容可用宽度适配布局；1920px 时内容宽 1224px，小屏沿用现有断点换行，字体和边框不随窗口缩放。
- Behavioral、Medium Impact、High Priority 使用本文指定配色；其他分类和等级保留现有配色，同类标签的 padding、圆角等容器尺寸统一。
- Inter 和内容区布局全局应用；具体标题区、筛选区和卡片样式仅应用到本文明确的 Intelligence、Leads 列表，社区、Validation、详情和信号抽屉保留各自样式。

## 一、全局规范

### 1. 字体

- 页面开发时安装字体依赖 `@fontsource-variable/inter`，全局使用 Inter。
- Tab 标签和数字也统一使用 Inter，暂不使用 Roboto 或 Roboto Mono。
- 本文未单独说明的文字均使用 `font-family: Inter`、`font-style: normal`。

### 2. 内容区域与响应式布局

| 项目                   | 规范                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| 设计基准               | 视口宽度为 1920px                                                                                |
| 各模块页面内容区宽度   | 基准视口下为 1224px，包含 padding 和边框，不是 1182px                                            |
| 中间内容区域上下内边距 | 基准视口下 `padding-top: 28px`、`padding-bottom: 28px`                                           |
| 盒模型                 | 统一使用 `box-sizing: border-box`，避免 padding 和边框额外增加宽度                               |
| 其他分辨率             | 以 1920px 为基准，按比例适配布局宽度及留白，保持视觉比例协调，不在所有分辨率下机械固定为基准尺寸 |

响应式说明：上述比例适配针对布局尺寸和留白，不表示字体大小、边框粗细等所有样式都随视口等比缩放。具体断点及最小窗口尚未指定；实现时应结合 Header、左侧菜单后的实际可用空间，避免内容溢出。

## 二、Intelligence Rader 模块

- 模块名称暂沿用原需求中的 `Intelligence Rader`；`Rader/Radar` 的最终拼写仍按项目命名确认结果处理。

### 1. 页面标题区

标题区使用类名 `page-heading`，与下方 Tab 容器的间距为 **16px**。标题上方的留白由中间内容区域的顶部 padding 提供，不再额外叠加 28px。

| 元素         | 文案示例                                                                                 | 颜色      | 字号 | 字重 | 行高     |
| ------------ | ---------------------------------------------------------------------------------------- | --------- | ---- | ---- | -------- |
| 页面标题     | Intelligence Rader                                                                       | `#153233` | 20px | 600  | 未指定   |
| 页面说明     | Customer signals, CIO insights from the Chief Investment Office, omni-channel behaviors. | `#64748B` | 14px | 500  | 未指定   |
| 同步时间标签 | Last synced:                                                                             | `#5C706B` | 14px | 400  | `normal` |
| 同步时间值   | Sept 18, 2026 · 09:30 HKT                                                                | `#036652` | 14px | 400  | `normal` |

### 2. Tab 区域

Tab 包含 **Customer Signals** 和 **CIO Insights**。Tab 容器与下方筛选行的间距为 **16px**。

#### Tab 文字

| 属性 | 默认状态  | 选中状态  |
| ---- | --------- | --------- |
| 字体 | Inter     | Inter     |
| 颜色 | `#5C706B` | `#036652` |
| 字号 | 14px      | 14px      |
| 字重 | 400       | 400       |

#### 数字容器

```css
display: flex;
padding: 0 8px;
justify-content: center;
align-items: center;
border-radius: 100px;
background: #f1f5f9;
```

#### 数字文字

```css
color: #5c706b;
text-align: center;
font-variant-numeric: lining-nums tabular-nums;
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 400;
```

所属 Tab 选中时，数字文字颜色改为 `#036652`；其他样式不变。

### 3. 筛选区域

- 筛选行包含三个选择框。
- 相邻选择框的间距为 **12px**。
- 筛选行与下方第一张卡片的间距为 **24px**。

### 4. 信号卡片列表

#### 列表与卡片容器

- 相邻卡片之间的间距为 **16px**，与卡片内部间距分开设置。
- 卡片占满所在内容区宽度；在 1920px 基准视口下，卡片外部总宽度为 **1224px**。
- 卡片宽度包含左右各 20px 的 padding 及左右各 1px 的边框，内部可用宽度为 **1182px**。

```css
box-sizing: border-box;
display: flex;
width: 100%;
padding: 20px;
flex-direction: column;
align-items: flex-start;
border-radius: 12px;
border: 1px solid #dbe6e2;
background: #fff;
box-shadow: 0 1px 3px 0 rgba(41, 53, 50, 0.07);
```

#### 卡片内部垂直间距

| 相邻区域     | 间距           |
| ------------ | -------------- |
| 标签行到标题 | 10px           |
| 标题到描述   | 不额外设置间距 |
| 描述到信息区 | 14px           |

标题和描述应作为连续的内容组处理。不对所有卡片直接子元素统一设置 `gap: 10px`，避免与上述局部间距叠加。

### 5. 分类标签

示例：`behavioral`。

#### 容器样式

```css
display: flex;
height: 24px;
padding: 4px 8px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 4px;
background: #faf5ff;
```

#### 文字样式

```css
color: #ba4acf;
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 500;
letter-spacing: 0.24px;
text-transform: capitalize;
```

### 6. 影响程度标签

示例：`MEDIUM impact`，通过 `text-transform: uppercase` 展示为大写。

#### 容器样式

```css
display: flex;
height: 24px;
padding: 4px 8px;
flex-direction: column;
align-items: flex-start;
border-radius: 4px;
border: 1px solid #bae6fd;
background: #f0f9ff;
```

#### 文字样式

```css
color: #0369a1;
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 400;
letter-spacing: 0.25px;
text-transform: uppercase;
```

### 7. 卡片标题与描述

#### 标题

示例：**JPY/HKD Broad Customer Attention**。

```css
color: #036652;
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 500;
```

#### 描述

示例：

> In the last 30 days, JPY/HKD drew 18,601 watchlist views from 5,735 unique customers, materially ahead of other FX pairs. This indicates broad customer attention on JPY/HKD and supports FX lead ideation around pair-led awareness and conversion oppor…

（此示例在截图右侧截断，以上保留可见部分。）

```css
color: #5c706b;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 400;
```

### 8. 卡片信息区与时间

#### 信息区容器

信息区与上方描述的间距为 **14px**，不要与父容器的 gap 重复计算。

```css
margin-top: 14px;
border-radius: 4px;
background: #f8fafc;
```

#### 字段示例

| 标签              | 值                        |
| ----------------- | ------------------------- |
| Affected Segment: | Mass Affluent FX Browsers |
| Product Category: | FX                        |
| Source:           | Omnibase                  |

三个字段使用相同的标签和值样式。

| 元素     | 颜色      | 字号 | 字重 | 行高   |
| -------- | --------- | ---- | ---- | ------ |
| 字段标签 | `#5C706B` | 14px | 400  | 未指定 |
| 字段值   | `#036652` | 14px | 400  | `150%` |
| 右侧时间 | `#5C706B` | 14px | 400  | 未指定 |

右侧时间示例：`2026-10-30 08:17 HKT`。

## 三、Leads Ideation 模块

### 1. 页面标题区

页面标题和说明沿用 Intelligence Rader 模块的对应文字样式，全局使用 Inter。

| 元素     | 文案                                                                               | 颜色      | 字号 | 字重 |
| -------- | ---------------------------------------------------------------------------------- | --------- | ---- | ---- |
| 页面标题 | Leads Ideation                                                                     | `#153233` | 20px | 600  |
| 页面说明 | Add the supplied campaign ideas and review them alongside your existing campaigns. | `#64748B` | 14px | 500  |

页面说明与下方绿色 AI Ideation Engine 区域的间距为 **16px**。

### 2. AI Ideation Engine 区域

#### 容器样式

```css
display: flex;
padding: 20px;
flex-direction: column;
align-items: flex-start;
align-self: stretch;
border-radius: 12px;
border: 1px solid #094c3d;
background: #036652;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```

#### 标题与说明

| 元素                    | 颜色                        | 字号 | 字重 | 字间距    |
| ----------------------- | --------------------------- | ---- | ---- | --------- |
| AI Ideation Engine 标题 | `#FFF`                      | 18px | 400  | `-0.45px` |
| 说明文字                | `rgba(209, 250, 229, 0.80)` | 12px | 400  | 未指定    |

说明文案：

> Generate 10 Campaign Ideas aligned to selected product focus, market signals, customer lifecycle stage, and delivery channels. Ideas are retained for 14 days from the date of generation.

“生成 10 条、保留 14 天”仅为展示文案，不新增生成数量校验或自动到期删除逻辑。

| 布局项                     | 规范                                                       |
| -------------------------- | ---------------------------------------------------------- |
| 标题与左侧图标的间距       | 6px                                                        |
| Collapse 按钮对齐          | 按钮底部与说明文字最后一行的底部对齐，不表示需要增加下边框 |
| 说明所在行到下方白色分隔线 | 12px                                                       |
| 分隔线到下方表单区域       | 16px                                                       |

#### Focus Product 与 Constraints 表单

字段标签样式：

```css
color: rgba(167, 243, 208, 0.9);
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 400;
```

- 表单与下方 `Selected:` 摘要行的间距为 **12px**。
- 仅移除 Constraints 同排右侧的 `1 selected` 数量元素，以及表单右侧的编辑图标。
- 保留下方 `Selected:` 元素及其已选条件摘要，不因移除同排数量元素而取消。
- 移除编辑图标后，仍通过 Constraints 入口重新打开抽屉。

#### Selected 摘要

| 文字                | 颜色                        | 字号 | 字重 |
| ------------------- | --------------------------- | ---- | ---- |
| Selected:           | `#A7F3D0`                   | 12px | 400  |
| 标签中的 Signal     | `rgba(110, 231, 183, 0.70)` | 12px | 400  |
| 标签中的 1 selected | `#A7F3D0`                   | 12px | 400  |

摘要标签示例：`Signal 1 selected`。多个标签之间的间距为 **6px**。

标签容器样式：

```css
display: flex;
padding: 2px 8px;
align-items: center;
gap: 4px;
border-radius: 4px;
border: 1px solid #0d6452;
background: #084f40;
```

### 3. 筛选与搜索区域

- 位于绿色 AI Ideation Engine 区域下方。
- 筛选区域上下均设置 **16px** 的 margin。
- 相邻表单控件的间距为 **8px**。
- 搜索框占位文字为 `title,keyword,product or segment...`，样式如下。

```css
color: #94a3b8;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;
```

### 4. 构想卡片

#### 容器样式

```css
display: flex;
padding: 16px 20px;
flex-direction: column;
align-items: flex-start;
gap: 8px;
align-self: stretch;
border-radius: 12px;
border: 1px solid rgba(229, 231, 235, 0.9);
background: #fff;
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
```

卡片内部默认相邻内容间距为 **8px**；描述到字段区的间距单独处理，不与默认 gap 叠加。

#### 优先级标签

示例：`HIGH PRIORITY`。容器样式如下，文字样式本段未单独指定。

```css
display: flex;
padding: 2px 8px;
flex-direction: column;
align-items: flex-start;
border-radius: 4px;
border: 1px solid #fdbaba;
background: #fff0f0;
```

#### 评分标签

示例：`Score 88 / 100`。容器样式如下，文字样式本段未单独指定。

```css
display: flex;
padding: 2px 8px;
align-items: center;
gap: 4px;
border-radius: 4px;
border: 1px solid #e1efec;
background: #f2f8f7;
```

优先级与评分标签之间的间距为 **8px**，标签行与下方标题的间距为 **8px**。

#### 标题与描述

标题示例：**USD Core Flow Deepening with Diversification Check**。

| 元素     | 颜色      | 字号 | 字重 | 字间距    |
| -------- | --------- | ---- | ---- | --------- |
| 构想标题 | `#09695D` | 18px | 600  | `-0.45px` |
| 构想描述 | `#4B5563` | 14px | 400  | 未指定    |

#### 产品、客群与目标字段区

- 为 `PRODUCT CATEGORY`、`TARGET SEGMENT`、`IDEA OBJECTIVE` 三个字段及各自的值增加一个共同容器。
- 仅增加包裹容器，三个字段原有排列方式保持不变。
- 共同容器设置 `padding: 6px 0`。
- 描述到字段区的最终间距按 **14px** 处理，不叠加默认的 8px gap；容器 padding 属于字段区内部留白。
- 三个字段使用相同的标签和值样式。

| 元素     | 颜色      | 字号 | 字重 | 字间距  | 大小写      |
| -------- | --------- | ---- | ---- | ------- | ----------- |
| 字段标签 | `#9CA3AF` | 12px | 400  | `0.5px` | `uppercase` |
| 字段值   | `#075347` | 14px | 400  | 未指定  | 未指定      |

Product Category 值示例：`FX transaction in USD/HKD or HKD/USD; FXTMD where eligible...`。

#### 底部渠道标签

- 字段区下方的分隔线与渠道标签行的间距为 **10px**。
- 渠道标签示例：`Call Lead (RM or Specialist)`、`PN`。
- 相邻渠道标签的间距为 **6px**。
- 此处只规定标签展示样式，不新增点击行为。

容器样式：

```css
display: flex;
padding: 2px 10px;
flex-direction: column;
align-items: flex-start;
border-radius: 4px;
background: #f3f4f6;
```

文字样式：

```css
color: #374151;
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 400;
```
