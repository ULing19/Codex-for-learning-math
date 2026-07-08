# Roadmap / 后续路线图

This roadmap keeps the project oriented toward a mature, reliable, open-source learning handbook. It is intentionally practical: every item should improve correctness, learning value, usability, or deployment confidence.

本路线图用于把项目继续推进成成熟、可靠、可协作的开源学习手册。每一项都应服务于公式正确性、学习效果、使用体验或部署可信度。

## Current Baseline / 当前基线

- Static site: HTML + CSS + Vanilla JavaScript + MathJax.
- Formula cards: 494.
- Interactive lab bindings: 184.
- Lab types: 15.
- Main quality command: `npm run verify`.
- Browser acceptance: `npm run verify:browser` and `npm run verify:browser:live`.
- Live site: https://uling19.github.io/Codex-for-learning-math/handbook/

## Priority 1: Content Reliability / 内容可靠性

- Expand detailed proof routes for high-frequency cards in limits, Taylor, integrals, Green/Gauss/Stokes, eigenvalues, positive definiteness, common distributions, CLT, estimation, and hypothesis testing.
- Add more worked examples for cards that are currently strong as formulas but thin as exam applications.
- Strengthen source notes without copying textbook or website prose.
- Keep generated Markdown synchronized through `npm run verify`.

## Priority 2: Interactive Learning / 交互学习

- Give each high-value lab a clear learning task, not just a slider.
- Add mobile-specific checks for lab panels with dense SVG and controls.
- Improve lab explanations for “when to use this formula” and “what changes when parameters move”.
- Consider adding more labs only when a concept becomes easier to understand visually.

## Priority 3: Review Workflow / 复习工作流

- Add chapter-level study paths for 高数上、高数下、线代、概率论.
- Improve error attribution so a wrong problem can map to formula cards, examples, and common mistakes.
- Add printable review lists for 必背, 常用, 技巧, and 易错 categories.
- Improve mastery data export/import while keeping the app static.

## Priority 4: Project Maturity / 项目成熟度

- Keep GitHub Pages deployment workflow green with live browser smoke checks.
- Maintain issue templates and contributor documentation.
- Keep line endings, generated docs, and raw control characters guarded in CI.
- Avoid build-tool migration unless there is a clear maintainability gain.

## Done Criteria / 完成标准

A change is ready when:

- The formula or UI behavior is correct in the source files.
- Generated documents are updated when data changes.
- `npm run verify` passes.
- Browser smoke passes for lab or layout changes.
- The change is documented when it affects maintainers or contributors.

