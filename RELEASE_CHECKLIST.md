# Release Checklist / 发布检查清单

Use this checklist before treating a version as stable.

## Required Checks

- [ ] `npm run verify` passes locally.
- [ ] `npm run verify:browser` passes locally or the GitHub Actions browser job passes.
- [ ] `npm run verify:browser:live` passes after GitHub Pages deployment finishes.
- [ ] `npm run verify:deploy` passes; with `GITHUB_TOKEN` or `GH_TOKEN`, it also confirms workflow Pages and latest green Actions.
- [ ] `npm run links` passes and reports no stale local links or metadata drift.
- [ ] `npm run pages:prepare` creates `.pages-artifact` with `.nojekyll`, top-level docs, and the `handbook/` static runtime.
- [ ] Live browser smoke confirms `app-version` and local static asset `?v=` values match `package.json`.
- [ ] `COVERAGE.md` is regenerated and reports `PASS: coverage gate satisfied`.
- [ ] GitHub Actions `Verify handbook` is green on `main`.
- [ ] GitHub Actions `Deploy Pages` is green and GitHub Pages is configured for workflow deployment.
- [ ] The live site opens at `https://uling19.github.io/Codex-for-learning-math/handbook/`.
- [ ] Lab overview opens a lab directly into a mounted demo on desktop and mobile.
- [ ] MathJax reports zero `mjx-merror` nodes in browser smoke.
- [ ] Generated Markdown files are updated when formula data changes.

## Content Review

- [ ] New formula cards include conditions, intuition, usage, proof idea, example, and common mistake.
- [ ] New or rewritten chapters improve the relevant counts and review targets in `COVERAGE.md`.
- [ ] Formula cards use supported MathJax syntax.
- [ ] Cold tricks include conditions and safer fallback methods.
- [ ] New interactive demos include a clear observation goal and exam trigger.

## Deployment Hygiene

- [ ] No `node_modules` or temporary Playwright artifacts are committed.
- [ ] `.nojekyll` is present.
- [ ] README and `handbook/README.md` mention any new scripts or maintenance workflow changes.
- [ ] Changelog is updated.
