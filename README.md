# Ideation

基于 React、TypeScript、Vite 和 Ant Design 的构想工作台，按 [AGENTS.md](./AGENTS.md) 和项目截图实现。当前使用异步 Mock 服务，可在没有后端的情况下体验完整流程。

## 本地运行

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5181
```

打开 <http://127.0.0.1:5181>。

```sh
npm run build   # 类型检查与生产构建
npm run lint    # 代码规范检查
npm run test    # Mock 业务流程、查询与页面渲染检查
npm run test:browser # 开发服务启动后，验证 Dashboard、生成及 Validation 完整流程
npm run format # 使用 4 个空格缩进格式化项目文件
npm run format:check # 检查格式是否统一
```

浏览器回归检查默认使用 Windows 中已安装的 Edge，以独立临时配置运行无界面测试；可用 `BROWSER_PATH` 指定 Chromium 浏览器路径，用 `APP_URL` 指定开发服务地址。检查同时覆盖系统开启和关闭“减少动态效果”时的下拉面板显示。

## 页面与体验流程

原有模块在对应 TSX 组件中使用 Tailwind CSS utility classes；新增 Dashboard 和 Validation 在各自目录维护样式。`src/index.css` 维护全局基础样式、主题变量及原有响应式断点。`.editorconfig` 与 Prettier 统一使用 4 个空格缩进。

| 路径              | 页面                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| `/dashboard`      | 默认首页：统计入口、validator 的待验证任务、近期构想和信号            |
| `/intelligence`   | Intelligence Radar：Customer Signals / CIO Insights、筛选、排序、分页 |
| `/leads`          | Leads Ideation：条件选择、生成任务、构想列表                          |
| `/leads/:id`      | Leads 独立详情页、发布与删除                                          |
| `/community`      | Ideation Community：公开构想、复制与本人发布记录删除                  |
| `/community/:id`  | Community 独立详情页与复制                                            |
| `/validation`     | Validation：副本列表、搜索与筛选                                      |
| `/validation/:id` | Validation 独立详情、普通文本编辑、原始快照、评论、变更对比及评分     |

在 Leads Ideation 选择 Focus Product（FX、Mortgage、Wealth Management 或 Credit Cards），点击 Constraints 框即可直接打开抽屉，无需展开下拉菜单。未选择产品时，该入口禁用。Customer Signals 与 Market Signals 跨 Tab、跨页共选 1–5 项，已选信号再次点击可取消。进入第二步后可直接点击 Complete Selection 保存。第二步的阶段、渠道和补充文字均可留空。保存后再次点击 Constraints 框，可查看已保存条件。

Complete Selection 只保存条件；点击 Generate Ideas 才生成构想。生成时 TASKS 展示模拟流式进度，列表顶部出现占位，原列表保留，完成后追加新结果。生成期间禁用重复生成；TASKS 完成后保留，可手动收起或关闭。切换模块不会取消当前生成，刷新浏览器则不会恢复进行中的任务。

Make Public 将构想发布到社区，重复发布会提示已发布。“Do not remind me again”按当前演示账号保存在浏览器中。社区只能删除本人发布的记录；复制会生成独立的 Validation 副本，底部悬浮提示显示 3 秒，其中 View 按钮直接打开本次副本详情。操作期间显示 Loading，发布或删除失败时保留确认弹窗以便重试。

Validation 卡片在悬停或键盘聚焦时显示操作，触屏设备直接显示。所有进入该模块的用户都能编辑、删除和评论，只有当前用户自己的评论可修改或删除。各模块删除互不联动；副本持有原始公开数据快照，即使来源已删除，View Source Public Idea 仍可查看原始内容。

编辑采用普通文本输入；页面主标题、区块标题、右侧条件及阶段、产品、渠道、客群、评分依据、KPI、计划等结构化内容只读。进入编辑模式调用加锁接口，保存或退出调用解锁接口；未修改时 Cancel、Save Changes 禁用，可通过 Exit editing 或返回退出。有未保存内容时，离开会要求确认丢弃。Change Log 的 Edit 数量只统计实际保存的修改，Copy、Validate、Reopen 仍在时间线中展示。Details 对比该次修改前后版本，支持仅看差异及文字级增删高亮。

评论输入框固定在视口底部，展开高度 160px；发送后滚动到评论区最上方的最新评论。编辑态及 Validated 状态均可评论。评分包含 Accuracy、Relevance、Completeness，均可不填（0 分），支持半星；总分是三项等权平均，向下截断到两位小数。评分成功锁定内容编辑，但仍可删除、评论；Reopen 原因非必填，成功后回到 Draft 并清空有效评分。他人编辑期间禁止编辑、删除和评分。

Dashboard 默认显示，Customer Signals/CIO Insights 分别打开对应 Tab，Campaign Ideas 打开 Leads，Validated 打开 Validation。Recent Ideations 和 Signals 的 View All 均打开 Community。Validation Tasks 只对 validator 展示，任务进入对应副本详情。

## Mock 数据与接口接入

- 数据类型：`src/common/types.ts`
- 示例数据：`src/common/mock-data.ts`
- 异步 Mock 服务与生成事件：`src/common/services/mock-api.ts`
- 全局数据和任务状态：`src/common/workspace.tsx`
- Leads 和 Community 详情页面分别维护，便于后续独立调整。

Mock 数据会保存到浏览器的 `localStorage`，刷新后保留发布、删除、复制和生成结果。需要恢复初始演示数据时，可在浏览器开发者工具中删除 `meridian:database:v1` 后刷新。删除 `meridian:skip-publish-confirmation:ember` 可恢复发布确认提示。

当前账号为 Ember Gao，Mock 的 `CURRENT_USER.canValidate` 为 `true`，可设为 `false` 检查普通用户页面。列表初始包含已公开构想，可体验重复发布提示；未发布的示例或新生成的构想可用于体验发布成功。

正式 API、身份认证、后端分页及流式协议尚未接入，后续可替换 Mock 服务并对齐返回类型。Dashboard 的统计和待办直接消费服务返回值；演示服务提供示例口径。14 天有效期从生成时间起算，由后端处理到期删除，前端不模拟自动过期。断网、关页及长时间无操作的锁失效由后端负责；Mock 仅演示正常加锁、解锁，并同步同浏览器多标签页中的记录状态。
