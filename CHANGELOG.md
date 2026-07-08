# Changelog / 更新日志

All notable changes are tracked here. This project follows a pragmatic changelog style rather than strict semantic versioning.

## Unreleased

- Replaced the corrupted root `README.md` with a clean bilingual project overview and maintenance guide.
- Added `project-health.js`, generated `PROJECT_HEALTH.md`, and wired the health report into `npm run verify` and generated-output drift checks.
- Added `doctor.js` and `npm run doctor` to distinguish required repository problems from optional local tooling gaps such as missing Playwright.
- Added `CONTENT_GOVERNANCE.md` and gated it in project quality checks so formula additions follow source-tier, condition, and trick-label rules.
- Added content-gap and feature-request issue templates plus issue chooser links for live site, support, and content governance.
- Added `.github/CODEOWNERS` and `MAINTAINERS.md` to document review ownership, merge expectations, and generated-file responsibilities.
- Added `CITATION.cff` and citation metadata checks so reuse of the handbook has a stable repository citation.
- Added `VERSIONING.md` to document static asset cache busting, version bump rules, release steps, and deployment evidence.
- Added `ACCESSIBILITY.md` to document keyboard support, browser smoke accessibility coverage, UI change checklist, and known limitations.
- Added `PRIVACY.md` to document localStorage learning state, lack of app-owned analytics/cookies, third-party MathJax requests, and data clearing steps.
- Added `.editorconfig` and gated it so contributors keep UTF-8, LF line endings, final newlines, and consistent indentation.
- Added a sidebar privacy control to clear local mastery and favorite data from the browser.
- Bumped static app metadata and cache-busted assets to `1.0.3` for the local-data reset UI.
- Upgraded GitHub Actions to `actions/checkout@v7`, `actions/setup-node@v6`, and Node 24 to remove deprecated Node 20 action-runtime warnings.
- Added `.nvmrc` and `package.json` `engines.node >=24` so local development and CI use the same supported Node line.
- Added `link-check.js` and `npm run links` to gate local Markdown links, HTML assets, required project files, package metadata, and Node version alignment.
- Added versioned static asset URLs plus app-version browser checks to prevent stale GitHub Pages caches from breaking labs.
- Added a workflow-based GitHub Pages deployment with a prepared static artifact to replace fragile legacy branch builds.
- Added `deploy-health.js` and `npm run verify:deploy` to audit Pages settings, latest workflow results, and live versioned assets after deployment.
- Wired `verify:deploy` into the Pages workflow as a post-deploy audit step.
- Promoted duplicate formula titles from warnings to validation failures and disambiguated one-dimensional transform cards.
- Expanded sparse high-value lab bindings from 168 to 184 cards and added validation minimums so core labs keep at least three entry cards.
- Bumped the static asset version to `1.0.2` so GitHub Pages serves the refreshed formula data instead of cached lab bindings.
- Added live Chromium lab smoke testing to the Pages deployment workflow so the deployed site must open and exercise lab demos before the deploy is considered healthy.
- Added `generated-check.js` and `npm run generated:check` so regenerated Markdown and `COVERAGE.md` must be committed after data changes.
- Hardened generated-output and formula-data checks against accidental control characters from under-escaped LaTeX commands such as `\rho`.
- Added community health docs: `CODE_OF_CONDUCT.md`, `SUPPORT.md`, `ROADMAP.md`, and Dependabot checks for GitHub Actions updates.
- Added `ARCHITECTURE.md` to document the static app data flow, generated artifacts, validation layers, deployment path, and common maintainer change paths.
- Strengthened browser smoke coverage for desktop sidebar scrolling so the last chapter remains reachable after scrolling.
- Added `coverage-report.js` and generated `COVERAGE.md` so chapter, importance, lab, study-layer, and review-target coverage can be audited from GitHub.
- Strengthened `browser-smoke.js` to check keyboard entry points, duplicate IDs, visible button names, mobile hit targets, all desktop lab opening paths, and actual lab control interactions.
- Added `npm run verify:browser:live` for running the same browser smoke checks against the GitHub Pages deployment.
- Expanded the older `taylor-plot`, `tangent-line`, and `matrix-transform` demos with teaching readouts, SVG explanations, and exam-use guidance.
- Expanded 40 shallow review-target formula cards with richer conditions, proof routes, usage steps, worked examples, and mistake notes.
- Raised the minimum card-depth gate in `coverage-report.js` to 125 after the content-depth pass raised the current minimum score to 129.
- Fixed a MathJax `pmatrix` rendering regression by switching the affected inline example to the project-standard `array` matrix form.

## 2026-07-08

- Added `study-layer.js` to generate proof routes, exam scenarios, worked-example breakdowns, and checklists for every formula card.
- Added `quality-check.js` as a maturity gate for learning depth, lab coverage, and direct lab opening behavior.
- Added `browser-smoke.js` for real Chromium checks across desktop and mobile.
- Added GitHub Actions verification for syntax, data validation, docs generation, fake-DOM smoke, quality gates, and browser smoke tests.
- Fixed MathJax rendering issues in several matrix and multivariable formulas.
- Added `.nojekyll` for stable GitHub Pages static asset serving.

## Earlier Work

- Built the static Math I handbook with 494 formula cards and 168 interactive demo entries.
- Added search, filters, mastery tracking, favorites, review queue, error attribution, related-card jumps, and daily recommendations.
- Reworked lab modules for equivalent infinitesimals, Taylor expansion, trigonometry, integration methods, Wallis recursion, matrices, distributions, CLT, Riemann sums, and unit circle visualization.
- Improved mobile sidebar and bottom navigation stacking.
- Published the repository as an MIT-licensed open-source GitHub Pages project.
