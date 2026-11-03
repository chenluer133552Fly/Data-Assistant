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
npm run test:browser # 开发服务启动后，验证下拉框、抽屉和生成流程
```

浏览器回归检查默认使用 Windows 中已安装的 Edge，以独立临时配置运行无界面测试；可用 `BROWSER_PATH` 指定 Chromium 浏览器路径，用 `APP_URL` 指定开发服务地址。检查同时覆盖系统开启和关闭“减少动态效果”时的下拉面板显示。

## 页面与体验流程

| 路径             | 页面                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `/intelligence`  | Intelligence Radar：Customer Signals / CIO Insights、筛选、排序、分页 |
| `/leads`         | Leads Ideation：条件选择、生成任务、构想列表                          |
| `/leads/:id`     | Leads 独立详情页、发布与删除                                          |
| `/community`     | Ideation Community：公开构想、复制与本人发布记录删除                  |
| `/community/:id` | Community 独立详情页与复制                                            |
| `/validation`    | Validation：副本列表、搜索与筛选                                      |

在 Leads Ideation 选择 Focus Product（FX、Mortgage、Wealth Management 或 Credit Cards），Constraints 会提供该产品对应的三个 Mock 入口，例如 FX customer engagement、Currency market opportunities、Custom selection。选择任意入口即可打开抽屉；这些入口不预选信号或偏好。Customer Signals 与 Market Signals 跨 Tab、跨页共选 1–5 项，进入第二步后可直接点击 Complete Selection 保存。第二步的阶段、渠道和补充文字均可留空。关闭抽屉后也可点击 Constraints 旁的编辑按钮重新打开。

Complete Selection 只保存条件；点击 Generate Ideas 才生成构想。生成时 TASKS 展示模拟流式进度，列表顶部出现占位，原列表保留，完成后追加新结果。生成期间禁用重复生成；TASKS 完成后保留，可手动收起或关闭。切换模块不会取消当前生成，刷新浏览器则不会恢复进行中的任务。

Make Public 将构想发布到社区，重复发布会提示已发布。“Do not remind me again”按当前演示账号保存在浏览器中。社区只能删除本人发布的记录；复制会生成独立的 Validation 副本，成功提示中的 View 按钮跳转到 Validation 列表。操作期间显示 Loading，发布或删除失败时保留确认弹窗以便重试。

## Mock 数据与接口接入

- 数据类型：`src/common/types.ts`
- 示例数据：`src/common/mock-data.ts`
- 异步 Mock 服务与生成事件：`src/common/services/mock-api.ts`
- 全局数据和任务状态：`src/common/workspace.tsx`
- Leads 和 Community 详情页面分别维护，便于后续独立调整。

Mock 数据会保存到浏览器的 `localStorage`，刷新后保留发布、删除、复制和生成结果。需要恢复初始演示数据时，可在浏览器开发者工具中删除 `meridian:database:v1` 后刷新。删除 `meridian:skip-publish-confirmation:ember` 可恢复发布确认提示。

当前账号为 Ember Gao。列表初始包含已公开构想，可体验重复发布提示；未发布的示例或新生成的构想可用于体验发布成功。

正式 API、身份认证、后端分页及流式协议尚未接入，后续可替换 Mock 服务并对齐返回类型。Validation 本期仅实现列表，详情、编辑、锁定及删除操作保留为禁用入口，待补充需求后接入。
