# Changelog / 变更记录

All notable changes are tracked here. This project follows a pragmatic changelog style rather than strict semantic versioning.

## Unreleased

- Upgraded GitHub Actions to `actions/checkout@v7`, `actions/setup-node@v6`, and Node 24 to remove deprecated Node 20 action-runtime warnings.
- Added `.nvmrc` and `package.json` `engines.node >=24` so local development and CI use the same supported Node line.
- Added `link-check.js` and `npm run links` to gate local Markdown links, HTML assets, required project files, package metadata, and Node version alignment.
- Added versioned static asset URLs plus app-version browser checks to prevent stale GitHub Pages caches from breaking labs.
- Added a workflow-based GitHub Pages deployment with a prepared static artifact to replace fragile legacy branch builds.
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
