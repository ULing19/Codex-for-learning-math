# Codex for Learning Math

> 考研数学一交互公式手册：把公式、理解、例题、易错点和可视化演示放进一个纯静态学习工作台。<br>
> Interactive Math I formula handbook for postgraduate entrance exam review, built as a searchable static learning workspace.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Static Site](https://img.shields.io/badge/site-GitHub%20Pages-2ea44f.svg)](https://uling19.github.io/Codex-for-learning-math/handbook/)
[![No Build](https://img.shields.io/badge/build-none-success.svg)](#quick-start--快速开始)

[在线访问 / Live Demo](https://uling19.github.io/Codex-for-learning-math/handbook/) ·
[维护文档 / Maintainer Guide](./handbook/README.md) ·
[Coverage Report](./COVERAGE.md) ·
[完整版公式手册](./考研数学一-公式手册-完整版.md) ·
[冷门技巧公式库](./考研数学一-冷门技巧公式库.md)

![Preview](./handbook/preview.png)

## 项目简介

这是一个面向 **考研数学一** 复习的开源交互公式手册，覆盖高等数学、线性代数、概率论与数理统计，以及前置基础和高收益技巧。项目使用 **HTML + CSS + Vanilla JavaScript + MathJax**，不依赖构建工具、不需要后端，适合直接部署到 GitHub Pages。

它不是单纯“堆公式”，而是把每个重点公式整理成可学习的卡片：

- 公式 LaTeX 与适用条件
- 一句话理解与考场用法
- 简短证明或推导思路
- 小例子与易错提醒
- 关联公式跳转
- SVG / Canvas 风格的交互演示

## English Overview

This is an open-source static interactive handbook for China postgraduate entrance exam **Math I** review. It covers calculus, linear algebra, probability and statistics, prerequisite formulas, and high-yield exam tricks.

The goal is not only to list formulas, but to make them easier to understand, search, review, and connect. Each important card may include conditions, intuition, quick usage, a mini proof, examples, common mistakes, related formulas, and interactive demos.

## Highlights / 功能亮点

- **494 张公式卡 / 494 cards**：覆盖高数、线代、概率、前置基础、冷门技巧和考场速查。
- **184 个交互挂载 / 184 demo entries**：用滑块、SVG、曲线、矩阵变换、概率图像辅助理解。
- **15 类实验室 / 15 lab types**：等价无穷小、Taylor、三角变形、Riemann 和、Wallis、矩阵特征值、假设检验等。
- **内容深度门槛 / Depth gate**：`COVERAGE.md` 记录最短卡片审计目标，当前最低深度分 129，门槛 125。
- **搜索与高亮 / Search & highlight**：支持标题、章节、标签、解释全文检索。
- **掌握度追踪 / Mastery tracking**：未学、认识、掌握、本地收藏，保存在浏览器 `localStorage`。
- **今日推荐 / Daily recommendations**：优先推荐必背、未掌握、有交互的高价值卡片。
- **错题归因 / Error attribution**：按常见错误类型反查相关公式和知识点。
- **纯静态部署 / Static deployment**：无数据库、无后端、无构建步骤。

## Coverage / 内容范围

| Subject | 中文范围 | English Scope |
|---|---|---|
| Prerequisites | 代数恒等式、数列、指数对数、不等式、三角公式 | Algebra, sequences, exponentials, logarithms, inequalities, trigonometry |
| Calculus I | 极限、连续、导数、中值定理、不定积分、定积分、反常积分、微分方程 | Limits, continuity, derivatives, mean value theorems, integrals, improper integrals, ODEs |
| Calculus II | 空间解析几何、多元微分、重积分、曲线曲面积分、级数、Fourier | Multivariable calculus, multiple integrals, line/surface integrals, series, Fourier |
| Linear Algebra | 行列式、矩阵、秩、方程组、向量组、特征值、二次型 | Determinants, matrices, rank, systems, vector spaces, eigenvalues, quadratic forms |
| Probability | 事件概率、分布、二维变量、数字特征、大数定律、CLT、估计、检验 | Events, distributions, random vectors, moments, LLN, CLT, estimation, hypothesis tests |
| Tricks | Wallis、Beta/Gamma、Frullani、Euler 代换、Raabe、Dirichlet、Cayley-Hamilton | Wallis, Beta/Gamma, Frullani, Euler substitution, Raabe, Dirichlet, Cayley-Hamilton |

## Interactive Labs / 交互模块

| `interactiveType` | 用途 |
|---|---|
| `equivalent-compare` | 无穷小等价、同阶和加减陷阱对比 |
| `taylor-order-lab` | Taylor 阶数选择与组合函数抵消 |
| `trig-transform-lab` | 积化和差、和差化积、辅助角、倍角降幂 |
| `integral-method-picker` | 积分方法决策树 |
| `wallis-recursion` | Wallis 递推链与偶奇公式 |
| `unit-circle` | 单位圆、象限、特殊角和诱导公式 |
| `riemann-sum` | 左端点、右端点、中点 Riemann 和 |
| `matrix-eigen-lab` | 特征值、特征向量、正定判别 |
| `distribution-plot` | 二项、泊松、正态、指数分布图像 |
| `clt-demo` | 中心极限定理与标准误压缩 |
| `probability-distribution-lab` | 假设检验拒绝域、功效、第二类错误 |
| `limit-slider` | 经典极限数值逼近 |
| `taylor-plot` | 函数曲线与 Taylor 近似 |
| `tangent-line` | 割线趋近切线 |
| `matrix-transform` | 二维矩阵变换可视化 |

## Quick Start / 快速开始

Recommended runtime:

```text
Node.js >= 24
```

The repository includes `.nvmrc` and `package.json` `engines.node` so local checks match GitHub Actions.

最简单的方式是直接打开：

```text
handbook/index.html
```

也可以启动本地静态服务：

```bash
npx serve handbook
```

或：

```bash
cd handbook
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## Development Checks / 验收命令

修改代码或公式数据后，建议运行：

```bash
npm run verify
```

说明：

- `node --check` 只检查 JavaScript 语法。
- `validate-data.js` 检查公式卡字段完整性、ID 唯一性、标题唯一性和交互类型合法性。
- `generate-docs.js` 从结构化数据生成 Markdown 打印版。
- `coverage-report.js` writes `COVERAGE.md` with subject, chapter, importance, lab, study-layer, review-target metrics, and a minimum card-depth gate, currently `125`.
- `smoke-test.js` 使用 Node fake DOM 检查页面关键结构和运行时接线。
- `quality-check.js` 检查学习拆解层、实验室直达、关键交互类型和成熟度门禁。
- `link-check.js` checks Markdown local links, HTML local assets, required project files, package metadata, Node version alignment, and `index.html` cache-busted asset versions.
- `prepare-pages.js` builds `.pages-artifact` from public Markdown files, `.nojekyll`, `LICENSE`, and the static `handbook/` runtime for Actions-based Pages deployment.
- `browser-smoke.js` checks desktop/mobile Chromium behavior, MathJax, desktop and mobile sidebar scrolling, every desktop lab opening path, actual lab control interactions, mobile lab navigation, keyboard entry points, cache-busted `app-version` assets, and basic accessibility; locally run `npm install --no-save playwright@1.61.1 && npx playwright install chromium && npm run verify:browser`, or check GitHub Pages with `npm run verify:browser:live`.
- `deploy-health.js` runs a lightweight post-deploy audit against the live Pages site; set `GITHUB_TOKEN` or `GH_TOKEN` to also verify Pages `build_type=workflow` and latest Actions results. The Pages workflow uses `DEPLOY_HEALTH_SKIP_WORKFLOWS=1` because the current deploy run is still closing while the audit step runs.
- `.github/workflows/verify.yml` 会在 push / PR 时自动运行 `npm run verify` 和浏览器冒烟测试。
- `.github/workflows/pages.yml` verifies the handbook, prepares `.pages-artifact`, deploys GitHub Pages, audits live assets, and runs live Chromium lab smoke tests against the deployed site.

## Project Structure / 项目结构

```text
.
├─ handbook/
│  ├─ index.html          # 页面入口 / app entry
│  ├─ styles.css          # 样式 / styles
│  ├─ app.js              # 交互逻辑 / app logic
│  ├─ formula-data.js     # 公式卡数据 / formula card data
│  ├─ study-layer.js      # 证明路线、使用场景、例题拆解生成器 / study layer
│  ├─ validate-data.js    # 数据校验 / data validation
│  ├─ generate-docs.js    # Markdown 生成 / docs generator
│  ├─ coverage-report.js  # coverage report generator
│  ├─ smoke-test.js       # 冒烟测试 / smoke test
│  ├─ quality-check.js    # 内容深度与实验室质量门禁 / quality gate
│  ├─ browser-smoke.js    # 真实浏览器验收 / real browser smoke test
│  ├─ link-check.js       # 本地链接与项目元数据检查 / link and metadata gate
│  ├─ prepare-pages.js    # Pages 静态产物打包 / Pages artifact preparation
│  ├─ deploy-health.js    # 线上发布健康检查 / deployment health audit
│  ├─ README.md           # 维护文档 / maintainer guide
│  └─ preview.png         # GitHub 预览图 / preview image
├─ .github/workflows/pages.yml
├─ .github/workflows/verify.yml
├─ COVERAGE.md
├─ package.json
├─ 考研数学一-公式手册-完整版.md
├─ 考研数学一-冷门技巧公式库.md
├─ 考研数学一-总索引.md
├─ README.md
└─ LICENSE
```

## Contributing / 参与贡献

欢迎以中英文提交 issue、建议或 PR。适合贡献的方向：

- 补充公式卡、例题、证明思路或易错点。
- 改进交互演示，让抽象概念更直观。
- 修复公式归类、条件限制或符号错误。
- 优化移动端排版、可访问性和搜索体验。
- 增加更适合考研复习的章节索引和错题模板。

建议流程：

1. 修改前先运行验收命令，确认基线正常。
2. 改公式数据时优先修改 `handbook/formula-data.js`。
3. 不要手动改生成文档；用 `node handbook/generate-docs.js` 重新生成。
4. 大改 UI 时同步更新 `handbook/smoke-test.js`。
5. 保持项目纯静态，不引入构建工具，除非先讨论清楚。

## Roadmap / 后续方向

- 更细的章节学习路径和复习计划。
- 公式卡难度分级、题型标签和错题归因模板。
- 更多“证明导图”和“什么时候想到它”的触发提示。
- 交互实验室的移动端体验和可访问性增强。
- 公式核验来源说明继续完善。

## License / 开源协议

本项目使用 [MIT License](./LICENSE) 开源。

公式、知识点和解释内容主要用于学习与复习整理。若你基于本项目继续改造，建议保留来源说明、校验脚本和生成流程，避免公式数据在迭代中失真。

This project is released under the [MIT License](./LICENSE). Formula explanations are organized for educational and review purposes. If you build upon this project, please keep the validation and documentation-generation workflow so the formula data remains reliable.
