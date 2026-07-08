# Codex for Learning Math

> 考研数学一交互公式手册：把公式、证明思路、使用场景、例题、易错点和可视化实验室放进一个纯静态学习工作台。  
> Interactive Math I formula handbook for postgraduate entrance exam review, built as a searchable static learning workspace.

[![Verify handbook](https://github.com/ULing19/Codex-for-learning-math/actions/workflows/verify.yml/badge.svg)](https://github.com/ULing19/Codex-for-learning-math/actions/workflows/verify.yml)
[![Deploy Pages](https://github.com/ULing19/Codex-for-learning-math/actions/workflows/pages.yml/badge.svg)](https://github.com/ULing19/Codex-for-learning-math/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Static Site](https://img.shields.io/badge/site-GitHub%20Pages-2ea44f.svg)](https://uling19.github.io/Codex-for-learning-math/handbook/)
[![No Build](https://img.shields.io/badge/build-none-success.svg)](#quick-start)

[在线访问 / Live Demo](https://uling19.github.io/Codex-for-learning-math/handbook/) ·
[维护手册 / Maintainer Guide](./handbook/README.md) ·
[架构说明 / Architecture](./ARCHITECTURE.md) ·
[内容治理 / Content Governance](./CONTENT_GOVERNANCE.md) ·
[项目健康 / Project Health](./PROJECT_HEALTH.md) ·
[覆盖报告 / Coverage](./COVERAGE.md) ·
[引用元数据 / Citation](./CITATION.cff) ·
[版本策略 / Versioning](./VERSIONING.md) ·
[无障碍 / Accessibility](./ACCESSIBILITY.md) ·
[隐私 / Privacy](./PRIVACY.md) ·
[贡献指南 / Contributing](./CONTRIBUTING.md)

[完整版公式手册](./考研数学一-公式手册-完整版.md) ·
[冷门技巧公式库](./考研数学一-冷门技巧公式库.md) ·
[总索引](./考研数学一-总索引.md)

![Preview](./handbook/preview.png)

## 项目简介

这是一个面向 **考研数学一** 复习的开源交互公式手册，覆盖高等数学、线性代数、概率论与数理统计、前置基础和高收益技巧。项目使用 **HTML + CSS + Vanilla JavaScript + MathJax**，不依赖构建工具、不需要后端，可直接部署到 GitHub Pages。

它不是单纯“堆公式”，而是把每张重点公式卡整理成可学习结构：

- 公式 LaTeX、适用条件和一句话理解
- 简短证明或推导路线
- 考场使用步骤和触发关键词
- 例题、解法拆解和易错提醒
- 关联公式跳转、掌握度、收藏、错题归因
- SVG/Canvas 风格的交互实验室

## English Overview

This is an open-source static interactive handbook for China postgraduate entrance exam **Math I** review. It covers calculus, linear algebra, probability and statistics, prerequisite formulas, and high-yield exam tricks.

The goal is not only to list formulas, but to make them easier to understand, search, review, connect, and verify. Each important card may include conditions, intuition, quick usage, a mini proof, worked examples, common mistakes, related formulas, and interactive demos.

## 当前规模

The generated health and coverage reports are the source of truth:

- `494` formula cards
- `184` interactive card bindings
- `15` interactive lab types
- `29` chapter groups across prerequisites, calculus, linear algebra, probability, tricks, and appendix
- Generated reports: `COVERAGE.md` and `PROJECT_HEALTH.md`

## 功能亮点

- **搜索与高亮**：支持标题、章节、标签和解释全文检索。
- **筛选与目录**：按学科、章节、重要程度、标签和复习状态快速定位。
- **学习层**：每张卡提供证明路线、考场步骤、例题拆解和检查清单。
- **交互实验室**：等价无穷小、Taylor、三角变形、Riemann 和、Wallis、矩阵特征值、分布、CLT、假设检验等。
- **复习状态**：本地记录掌握度、收藏和今日推荐，不上传个人学习数据。
- **生成文档**：由 `handbook/formula-data.js` 生成完整 Markdown 手册、冷门技巧库、总索引和覆盖报告。
- **部署验证**：GitHub Actions 同时运行静态门禁、真实浏览器 smoke test、Pages 部署和线上健康检查。

## 内容范围

| Subject | 中文范围 | English Scope |
|---|---|---|
| 前置基础 | 代数恒等式、数列、指数对数、不等式、三角公式 | Algebra, sequences, exponentials, logarithms, inequalities, trigonometry |
| 高等数学 | 极限、连续、导数、中值定理、积分、反常积分、微分方程、多元微分、重积分、曲线曲面积分、级数、Fourier | Limits, continuity, derivatives, integrals, ODEs, multivariable calculus, series, Fourier |
| 线性代数 | 行列式、矩阵、秩、线性方程组、向量组、特征值、二次型 | Determinants, matrices, rank, systems, vector spaces, eigenvalues, quadratic forms |
| 概率论 | 事件概率、分布、二维随机变量、数字特征、大数定律、CLT、估计、假设检验 | Events, distributions, random vectors, moments, LLN, CLT, estimation, hypothesis tests |
| 冷门技巧 | Wallis、Beta/Gamma、Frullani、Euler 代换、Raabe、Dirichlet、Cayley-Hamilton | Wallis, Beta/Gamma, Frullani, Euler substitution, Raabe, Dirichlet, Cayley-Hamilton |

## Interactive Labs

| `interactiveType` | 用途 |
|---|---|
| `equivalent-compare` | 等价无穷小、同阶和加减陷阱对比 |
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

## Quick Start

Recommended runtime:

```bash
node --version
```

The project expects Node.js `>=24`.

Run locally with any static server:

```bash
npx serve handbook
```

Or use Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/handbook/
```

You can also open `handbook/index.html` directly. A local HTTP server is preferred because it matches GitHub Pages behavior more closely.

## Verification

Run the complete local gate before committing:

```bash
npm run verify
```

Useful focused checks:

```bash
npm run validate
npm run docs
npm run coverage
npm run health
npm run doctor
npm run smoke
npm run quality
npm run links
npm run repo:hygiene
npm run verify:browser
npm run verify:browser:live
npm run verify:deploy
```

`npm run verify` checks syntax, formula data, generated Markdown drift, coverage, project health, smoke tests, quality gates, links, repo hygiene, and Pages artifact preparation.

Implementation notes:

- `npm run doctor` separates required project problems from optional local tooling gaps.
- `handbook/browser-smoke.js` runs the real-browser desktop, mobile, lab, keyboard, and live-site checks.
- `handbook/coverage-report.js` generates `COVERAGE.md` for subject, chapter, lab, and learning-depth coverage.
- `handbook/project-health.js` generates `PROJECT_HEALTH.md` for release snapshot, verification surface, and governance status.

If `npm run verify:browser` or `npm run verify:browser:live` says Playwright is missing, install it only for the current checkout:

```bash
npm install --no-save playwright@1.61.1
```

The application itself still has no runtime package dependency; Playwright is only a local verification tool.

## Repository Structure

```text
handbook/
  index.html             Static app shell
  styles.css             Layout, responsive design, lab visuals
  app.js                 Search, filters, cards, labs, local state
  formula-data.js        Source of formula cards and source references
  study-layer.js         Generated learning layer for each card
  validate-data.js       Data schema and content invariants
  generate-docs.js       Markdown handbook generator
  coverage-report.js     Coverage report generator
  project-health.js      Project health report generator
  smoke-test.js          Fake-DOM runtime smoke test
  browser-smoke.js       Real Chromium smoke test
  link-check.js          Local link and metadata gate
  prepare-pages.js       GitHub Pages artifact builder
```

Top-level generated and governance files:

- `考研数学一-公式手册-完整版.md`
- `考研数学一-冷门技巧公式库.md`
- `考研数学一-总索引.md`
- `COVERAGE.md`
- `PROJECT_HEALTH.md`
- `CONTENT_GOVERNANCE.md`
- `ARCHITECTURE.md`
- `VERSIONING.md`
- `ACCESSIBILITY.md`
- `PRIVACY.md`

## Content Workflow

For formula/content changes:

1. Edit `handbook/formula-data.js`.
2. Run `npm run docs`.
3. Run `npm run coverage`.
4. Run `npm run health`.
5. Run `npm run verify`.
6. Commit source and regenerated Markdown/report files together.

Do not hand-edit generated reports or generated handbook Markdown. If generated output changes unexpectedly, inspect the data source or generator first.

## Privacy

The app stores learning state only in the browser `localStorage`:

- `math1_mastery_v1`
- `math1_favorites_v1`

There is no app-owned analytics, account system, backend, or database. The sidebar includes a local reset button for clearing mastery and favorite data. See `PRIVACY.md` for details.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/pages.yml`:

1. Checkout and set up Node 24.
2. Run `npm run verify`.
3. Build a static Pages artifact with `handbook/prepare-pages.js`.
4. Deploy with GitHub Pages.
5. Run deploy health and live browser smoke checks.

Live site:

```text
https://uling19.github.io/Codex-for-learning-math/handbook/
```

## Contributing

Issues and pull requests are welcome. Please read:

- `CONTRIBUTING.md`
- `CONTENT_GOVERNANCE.md`
- `MAINTAINERS.md`
- `RELEASE_CHECKLIST.md`

For formula corrections, include the formula card ID, the suspected issue, the corrected formula, and a source or derivation.

## License

MIT. See `LICENSE`.
