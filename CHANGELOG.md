# Changelog / 变更记录

All notable changes are tracked here. This project follows a pragmatic changelog style rather than strict semantic versioning.

## Unreleased

- Added `coverage-report.js` and generated `COVERAGE.md` so chapter, importance, lab, study-layer, and review-target coverage can be audited from GitHub.
- Strengthened `browser-smoke.js` to check keyboard entry points, duplicate IDs, visible button names, mobile hit targets, and all desktop lab opening paths.
- Added `npm run verify:browser:live` for running the same browser smoke checks against the GitHub Pages deployment.
- Expanded the older `taylor-plot`, `tangent-line`, and `matrix-transform` demos with teaching readouts, SVG explanations, and exam-use guidance.

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
