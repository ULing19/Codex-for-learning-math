# Maintainers / 维护者说明

This file defines practical review ownership for the handbook. It does not create a formal organization structure; it documents how changes should be reviewed so the project remains reliable as it grows.

本文档说明本手册的实际维护责任边界。它不是正式组织架构，而是帮助后续协作者知道“改哪里、谁该重点看、合并前必须验证什么”。

## Current Owner / 当前负责人

- GitHub owner: `@ULing19`
- Repository: `ULing19/Codex-for-learning-math`
- Live site: https://uling19.github.io/Codex-for-learning-math/handbook/

## Review Areas / 审查领域

| Area | Files | Review focus |
|---|---|---|
| Formula data | `handbook/formula-data.js`, generated Markdown, `COVERAGE.md` | Correct formulas, conditions, examples, proof routes, mistakes, tags, source-tier discipline |
| Study layer | `handbook/study-layer.js`, generated study blocks | Whether proof routes and exam-use prompts help learning instead of adding vague text |
| Interactive labs | `handbook/app.js`, `handbook/styles.css`, `handbook/browser-smoke.js` | Clear controls, mobile usability, visible feedback, MathJax safety, browser smoke coverage |
| Validation gates | `handbook/*check.js`, `package.json`, workflows | CI coverage, generated-file drift, line endings, required project files, deployment health |
| Documentation | `README.md`, `ARCHITECTURE.md`, `CONTENT_GOVERNANCE.md`, `CONTRIBUTING.md`, `SUPPORT.md`, `ROADMAP.md` | Accuracy, contributor clarity, no stale commands or links |
| Release/deploy | `.github/workflows/*.yml`, `RELEASE_CHECKLIST.md`, `handbook/index.html` app version | GitHub Pages health, cache-busted assets, live browser checks, release notes |

## Merge Expectations / 合并前期望

Every change should satisfy the smallest relevant checklist:

- Content-only: `npm run verify`; source-tier and condition rules from `CONTENT_GOVERNANCE.md`.
- UI or lab: `npm run verify` plus `npm run verify:browser` or a passing GitHub Actions browser job.
- Deployment or workflow: `npm run verify`, then confirm `Verify handbook` and `Deploy Pages` are green after push.
- Documentation-only: `npm run links`, `npm run repo:hygiene`, and `npm run verify` before release.

## Generated Files / 生成文件规则

- Source data lives in `handbook/formula-data.js`.
- Generated Markdown and `COVERAGE.md` must come from `npm run docs` and `npm run coverage`.
- Do not patch generated documents by hand to hide source-data problems.
- If generated output changes unexpectedly, inspect the source data or generator before committing.

## Review Priority / Review 优先级

1. Incorrect formula, condition, or distribution convention.
2. Broken deployed site or lab interaction.
3. Generated-file drift, CI failure, or Pages deployment failure.
4. Missing high-frequency exam content.
5. Documentation clarity and contributor experience.

## Handoff Notes / 交接建议

When handing work to another model or contributor, include:

- Current commit SHA.
- Files changed and why.
- Validation commands already run.
- Whether generated docs were regenerated.
- Any known risk, skipped check, or unresolved content question.

