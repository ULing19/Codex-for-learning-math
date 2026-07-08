# 考研数学一交互公式手册

**494 张公式卡 · 250 张必背 · 168 个交互演示 · 静态部署，无需构建**

---

## 项目定位

考研数学一全科公式手册，覆盖高数（上下册）、线性代数、概率论与数理统计。重点公式含：

- 一句话理解、适用条件、考场用法、简短证明、小例子、易错点
- 15 种可视化交互演示（SVG + Vanilla JS）
- 搜索高亮、章节进度点、关联卡片跳转、今日推荐复习、闪卡模式

技术栈：**HTML + CSS + Vanilla JS + MathJax 3**，无任何构建工具或框架依赖。

---

## 文件职责

| 文件 | 职责 |
|---|---|
| `index.html` | 页面入口，所有 DOM 骨架都在这里，不含任何业务逻辑 |
| `styles.css` | 全部样式，包含响应式布局、公式卡、交互模块、进度点等 |
| `app.js` | 核心交互逻辑：筛选、搜索、掌握度、收藏、15 个交互演示、今日推荐、关联跳转 |
| `formula-data.js` | 494 张公式卡结构化数据，使用 `C(...)` 工厂函数定义，所有内容源头 |
| `study-layer.js` | 学习深度层：为每张卡生成证明路线、使用场景、例题拆解和检查清单 |
| `validate-data.js` | 公式数据完整性校验：id 唯一、必填字段、schema 合规 |
| `generate-docs.js` | 从 `formula-data.js` 生成 Markdown 文档（全量版、冷门版、索引） |
| `coverage-report.js` | Writes `COVERAGE.md` with chapter, importance, lab, study-layer, short-field review metrics, and a minimum card-depth gate, currently `125` |
| `smoke-test.js` | 运行时冒烟测试：用 Node fake DOM 模拟初始化，检查白屏/DOM 接线/渲染是否正常 |
| `quality-check.js` | 成熟度质量门禁：检查学习深度层、实验室直达、关键交互类型覆盖 |
| `browser-smoke.js` | Real browser acceptance test for desktop/mobile, MathJax, sidebar scrolling, lab demos, actual lab control interactions, keyboard entry points, and basic accessibility |

生成的 Markdown 文档（不要手动编辑，运行 `node handbook/generate-docs.js` 重新生成）：

- `考研数学一-公式手册-完整版.md`
- `考研数学一-公式手册-冷门技巧.md`
- `考研数学一-公式手册-索引.md`

---

## 本地使用方式

### 直接打开

```
handbook/index.html
```

双击即可。MathJax 从 CDN 加载；若断网，LaTeX 原文仍以文本形式可读，不影响基础使用。

### 本地 HTTP 服务（推荐，避免某些浏览器的 file:// 限制）

```bash
# 方式一（需 Node.js）
npx serve handbook

# 方式二（需 Python 3）
cd handbook
python -m http.server

# 方式三（需 Node.js）
npx http-server handbook
```

然后访问 `http://localhost:3000`（或终端提示的端口）。

---

## 验收命令

每次修改代码后，按顺序运行以下命令，全部通过才算验收：

```bash
# 推荐：一键完整验收
npm run verify

# 1. 语法检查（只查语法，不运行）
node --check handbook\app.js
node --check handbook\formula-data.js
node --check handbook\study-layer.js
node --check handbook\validate-data.js
node --check handbook\generate-docs.js
node --check handbook\smoke-test.js
node --check handbook\quality-check.js
node --check handbook\coverage-report.js
node --check handbook\browser-smoke.js

# 2. 数据校验（检查公式卡 id 唯一、必填字段、schema 合规）
node handbook\validate-data.js

# 3. 生成文档（从数据重新生成 Markdown，不要手改 Markdown）
node handbook\generate-docs.js

# 4. 冒烟测试（运行时白屏/DOM 接线检查，必须输出 smoke-ok cards=494 labs=168）
node handbook\smoke-test.js

# 5. 质量门禁（学习深度层/实验室直达/关键模块覆盖）
node handbook\quality-check.js

# 6. Coverage report (generates COVERAGE.md)
node handbook\coverage-report.js

# 7. 真实浏览器验收（可选本地运行；CI 会自动运行）
npm install --no-save playwright@1.61.1
npx playwright install chromium
npm run verify:browser

# 8. Online GitHub Pages browser acceptance
npm run verify:browser:live
```

说明：

- `node --check` 只做语法检查，不等于功能正常，必须配合 smoke-test
- `smoke-test.js` 用 Node 的 `vm` 模块模拟浏览器初始化，检查关键 DOM 接线、cardCount/labCount 填充、formulaList 渲染、heroRecommend 渲染
- `coverage-report.js` outputs `COVERAGE.md`, turning chapter coverage, lab coverage, study-layer coverage, short-field review targets, and the `125` minimum card-depth gate into an auditable report.
- `quality-check.js` 检查每张卡是否能生成证明路线、使用场景、例题拆解和检查清单，并验证实验室总览能直达演示
- `browser-smoke.js` starts a local static server by default and verifies all desktop lab opening paths, actual lab control interactions, mobile sidebar behavior, bottom navigation hit targets, study blocks, and MathJax error counts in Chromium. Set `BROWSER_SMOKE_BASE_URL` or run `npm run verify:browser:live` to run the same checks against GitHub Pages.
- 不允许只说"语法检查通过"就认为没问题

---

## 公式卡 Schema

所有公式卡通过 `C(...)` 工厂函数定义，字段含义如下：

```js
C(
  id,            // 唯一标识符，kebab-case，例如 "calc1-lhopital"
  subject,       // 学科：前置基础 / 高等数学 / 线性代数 / 概率论 / 冷门技巧 / 附录速查
  chapter,       // 章节名，例如 "第1章 函数与极限"
  section,       // 小节名，例如 "等价无穷小"
  title,         // 卡片标题，简短，例如 "洛必达法则"
  latex,         // LaTeX 公式字符串，用 raw`` 包裹避免转义问题
  importance,    // 重要程度：必背 / 常用 / 技巧 / 了解 / 拓展
  tags,          // 字符串数组，中文关键词，用于搜索和筛选
  conditions,    // 适用条件：什么情况下这个公式/方法可用
  intuition,     // 一句话理解：公式的核心直觉，不超过 2 句
  howToUse,      // 怎么用：考场三步走，具体操作步骤
  miniProof,     // 简短证明/来源：帮助记忆和理解，不要求严格
  example,       // 小例子：一个具体的计算例子
  mistakes,      // 易错点：最常见的错误和陷阱
  interactiveType, // 交互类型，见下方列表，无交互则填 "none"（可省略，默认 none）
  relatedFormulas  // 关联卡片 id 数组（可省略，默认 []）
)
```

**重要程度说明：**

| 级别 | 含义 |
|---|---|
| 必背 | 考场必须默写，错了直接丢分 |
| 常用 | 高频出现，熟练即可 |
| 技巧 | 特定题型的解题技巧 |
| 了解 | 考纲内但低频 |
| 拓展 | 超纲或进阶，了解即可 |

---

## 如何新增公式卡

1. 在 `formula-data.js` 的 `window.FORMULA_CARDS = [...]` 数组末尾添加新卡
2. 使用 `C(...)` 工厂函数，参数顺序与 schema 完全一致
3. 注意事项：
   - `id` 必须全局唯一，建议格式 `学科前缀-关键词`，例如 `prob3-joint-density`
   - `latex` 用 `raw\`...\`` 包裹，避免反斜杠转义问题
   - 不要在 `latex` 字段里写残破的 LaTeX（会导致 MathJax 渲染报错）
   - `tags` 用中文关键词数组，便于中文搜索
   - 重点卡（必背/常用）必须认真填写 `intuition`、`howToUse`、`example`、`mistakes`
   - `interactiveType` 填 `"none"` 或下方列表中的一个有效值
4. 新增后必须运行完整验收命令，`validate-data.js` 会检查 schema 合规性

---

## interactiveType 列表

| 类型 | 模块名称 | 用途说明 |
|---|---|---|
| `none` | 无交互 | 纯文本公式卡 |
| `limit-slider` | 极限数值逼近 | 拖动 x→0 观察经典极限比值趋近目标值 |
| `taylor-plot` | Taylor 曲线贴合 | 调整阶数看函数曲线与多项式近似的贴合程度 |
| `tangent-line` | 切线与导数 | 拖动切点看割线趋近切线，理解导数几何意义 |
| `riemann-sum` | 定积分面积实验室 | 左/右/中点三种 Riemann 和，对比误差随 n 变化 |
| `wallis-recursion` | Wallis 递推阶梯 | 展示 I_n 递推链，区分偶数/奇数公式 |
| `unit-circle` | 单位圆三角实验室 | 象限、投影线、特殊角、诱导公式实时对照 |
| `matrix-transform` | 2D 矩阵变换 | 矩阵对单位方格和基向量的几何作用 |
| `distribution-plot` | 概率分布工作台 | 二项/泊松/正态/指数四种分布参数滑动对比 |
| `clt-demo` | 中心极限定理演示 | 样本量 n 增大时样本均值分布变窄、变正态 |
| `equivalent-compare` | 无穷小等价实验室 | 三分区：等价→1、同阶→常数、加减陷阱→主项 |
| `taylor-order-lab` | Taylor 阶数实验室 | 单函数近似 + 组合函数抵消，展示首非零项 |
| `trig-transform-lab` | 三角变形工作台 | 积化和差/和差化积/辅助角/倍角四种模式切换 |
| `integral-method-picker` | 积分方法决策树 | 按题型特征标签选方法，展示考场三步和典型例子 |
| `matrix-eigen-lab` | 特征值·正定可视化 | 单位圆→椭圆变换、特征向量箭头、Sylvester 正定判别 |
| `probability-distribution-lab` | 假设检验拒绝域实验室 | H₀/H₁ 双曲线、α/β/功效三色区域实时联动 |

---

## 键盘快捷键

在公式卡视图中（非输入框聚焦时）：

| 快捷键 | 功能 |
|---|---|
| `j` / `↓` | 移动到下一张卡 |
| `k` / `↑` | 移动到上一张卡 |
| `Space` / `Enter` | 展开/折叠当前卡的详情；闪卡模式下翻转 |
| `1` / `2` / `3` | 直接设置掌握度（未学/认识/掌握） |
| `m` | 循环切换掌握度 |
| `f` | 收藏/取消收藏当前卡 |
| `/` | 聚焦搜索框（preventDefault，不输入斜杠） |
| `Esc` | ① 侧边栏打开→关闭侧边栏；② 输入框聚焦→blur；③ 有展开详情→关闭详情 |

> `Space`/`Enter` 在按钮、链接或 `<summary>` 上会优先触发原生行为，不会误触发翻卡。

---

## 协作规范

1. **改前先跑 baseline**：修改任何文件前，先运行一次 `node handbook\smoke-test.js`，确认基线正常
2. **每阶段结束必须完整验收**：跑完所有 8 条验收命令，不允许只看语法检查
3. **不要手改生成的 Markdown**：修改公式内容后运行 `node handbook\generate-docs.js` 重新生成
4. **大规模重构 UI 时同步更新 smoke-test**：如果新增/删除 HTML 中的 `id`，必须同步更新 `smoke-test.js` 的 `requiredIds`
5. **不要引入构建工具**：保持 HTML + CSS + Vanilla JS + MathJax，不引入 React/Vite/Webpack 等，除非先给出迁移计划和收益说明
6. **公式数据 schema 不可随意扩展**：新增字段前需确认 `validate-data.js` 和 `generate-docs.js` 都能处理

---

## 当前状态（封版基线）

| 指标 | 数值 |
|---|---|
| 公式卡总数 | 494 |
| 必背卡 | 250 |
| 交互演示卡 | 168 |
| 交互模块类型 | 15 种 |
| 覆盖学科 | 前置基础、高等数学、线性代数、概率论、冷门技巧、附录速查 |
| smoke-test 基线 | `smoke-ok cards=494 labs=168` |
| coverage 深度门槛 | `Minimum card depth score >= 125` |
| browser-smoke 基线 | `desktop: opened=15, exercised=15` |
