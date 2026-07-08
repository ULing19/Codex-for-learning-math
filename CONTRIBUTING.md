# Contributing / 贡献指南

Thanks for improving this handbook. This project accepts Chinese or English issues and pull requests.

感谢参与改进本项目。Issue 与 PR 可以使用中文或英文。

## Project Principles / 项目原则

- Keep the project static: HTML, CSS, Vanilla JavaScript, MathJax. Do not introduce a build framework without a clear proposal.
- Formula correctness is more important than volume. Every new formula should include conditions, usage, proof idea, example, and common mistake.
- Interactive labs should teach one clear idea. A demo is useful only if it makes the formula easier to understand.
- Generated Markdown must come from `handbook/formula-data.js`; do not manually edit generated handbook documents.

## Local Checks / 本地验收

Run before committing:

```bash
npm run verify
```

For browser-level checks:

```bash
npm install --no-save playwright@1.61.1
npx playwright install chromium
npm run verify:browser
```

`npm run verify` covers syntax, formula data validation, Markdown generation, fake-DOM smoke test, and quality gates. `npm run verify:browser` starts a local static server and checks desktop/mobile behavior, MathJax rendering, sidebar scrolling, and lab demo opening in Chromium.

## Content Changes / 内容修改

When adding or editing formula cards:

1. Edit `handbook/formula-data.js` first.
2. Keep `id` unique and stable.
3. Fill every field: `conditions`, `intuition`, `howToUse`, `miniProof`, `example`, `mistakes`.
4. Use `raw\`...\`` for LaTeX-heavy formulas.
5. Avoid unsupported MathJax commands. Run browser smoke if the formula is complex.
6. Regenerate docs with `npm run docs` or `npm run verify`.

## UI / Lab Changes

When changing UI or labs:

- Keep controls visible and clickable on mobile.
- Update `handbook/smoke-test.js` when adding/removing required DOM ids.
- Update `handbook/quality-check.js` when adding new maturity requirements.
- Update `handbook/browser-smoke.js` when changing lab opening behavior, sidebars, or rendering assumptions.

## Pull Request Checklist / PR 检查清单

- [ ] `npm run verify` passes.
- [ ] Browser smoke passes locally or in GitHub Actions.
- [ ] Generated Markdown is updated if formula data changed.
- [ ] UI changes were checked on desktop and mobile.
- [ ] New formulas include conditions, intuition, usage, proof idea, example, and mistakes.
- [ ] No `node_modules`, package lock created only for temporary local testing, or other generated test artifacts are committed.
