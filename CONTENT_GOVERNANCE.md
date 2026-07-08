# Content Governance / 内容治理规范

This handbook is useful only if learners can trust the formulas, conditions, examples, and interactive explanations. This document defines how content should be added, reviewed, corrected, and kept exam-oriented.

本手册的价值来自“可信、好查、能理解”。本文档规定公式、证明、例题、易错点和交互解释的新增、核验、修正与维护规则。

## Scope / 内容范围

Primary scope:

- 考研数学一考试范围。
- 同济《高等数学》第七版上下册常见章节结构。
- 同济《工程数学 线性代数》第七版常见章节结构。
- 高教社《概率论与数理统计》第五版常见章节结构。

Allowed supporting scope:

- High-yield techniques that frequently simplify exam-style work, such as Wallis, Beta/Gamma, Euler substitution, Frullani-type integrals, Raabe, Dirichlet, Abel, Cauchy condensation, Cayley-Hamilton, total expectation, and total variance.
- Reference-only background when it helps interpret notation or avoid common mistakes.

Out of scope:

- Arbitrary olympiad-style tricks unrelated to Math I review.
- Long copied textbook passages or paid course material.
- Symbolic CAS coverage for arbitrary user input.

## Source Tiers / 来源分级

Use the strongest available source for the claim being added.

| Tier | Source type | Use |
|---|---|---|
| A | Official exam syllabus and target textbooks | Chapter scope, notation conventions, theorem names, common exam constraints |
| B | Standard mathematical references such as DLMF, NIST/SEMATECH, or equivalent university notes | Formula verification, special functions, distribution facts, uncommon techniques |
| C | Public encyclopedic references such as Wikipedia | Cross-checking only; do not rely on one public page for a high-stakes correction |
| D | User notes, forum posts, AI output, or memory | Starting point only; must be verified against A/B/C before merging |

## Verification Rules / 核验规则

For each formula card, confirm these items before treating the card as stable:

- Formula: symbols, constants, signs, domains, and parameter conventions are correct.
- Conditions: differentiability, continuity, convergence, independence, positive definiteness, distribution assumptions, and interval restrictions are stated when relevant.
- Intuition: the explanation helps choose the formula, not merely restates it.
- Mini proof: gives the source idea or derivation route in a few lines.
- Example: is short enough to scan and actually uses the formula.
- Mistakes: names at least one realistic exam error.
- Tags and chapter: match where a learner would search for the card.

When references disagree, preserve the exam-safe convention and mention the convention in `mistakes` or `conditions`. Common examples: `arccot` range, upper/lower quantile notation, spherical-coordinate angle convention, and exponential distribution rate versus scale parameters.

## High-yield Trick Policy / 冷门技巧策略

Uncommon techniques are allowed, but they must be labeled by practical exam value:

- `技巧`: worth recognizing or memorizing because it saves time in likely exam patterns.
- `了解`: useful background or fallback, but not a primary exam method.
- `拓展`: interesting or explanatory, but should not replace textbook methods in solution writing.

For uncommon techniques, include:

- When to think of it.
- Whether it is suitable for multiple-choice/fill-in or full solutions.
- A safer textbook fallback when the trick is not allowed or not recognized.
- The strongest condition that prevents misuse.

## Editing Workflow / 编辑流程

1. Edit `handbook/formula-data.js`; generated Markdown is not source.
2. Use `raw\`...\`` for LaTeX-heavy formula blocks.
3. Keep card ids stable once published.
4. Run `npm run verify` after changes.
5. For UI or lab behavior, also run browser smoke locally or rely on the GitHub Actions browser job.
6. If formula data changes, confirm generated Markdown and `COVERAGE.md` are updated by the generator.

## Review Checklist / 内容 PR 检查清单

- [ ] The formula is checked against at least one strong source.
- [ ] Conditions and parameter conventions are explicit.
- [ ] The example can be calculated by hand in a few lines.
- [ ] The mistake warning is specific, not generic.
- [ ] The card is searchable by likely Chinese and English/math keywords when appropriate.
- [ ] Related interactive lab assignments are intentional.
- [ ] `npm run verify` passes.

## Correction Policy / 勘误策略

For formula corrections, prefer a small focused PR or issue with:

- Card id or title.
- Current text.
- Proposed replacement.
- Reason or counterexample.
- Reference or derivation.

If a correction affects generated docs, update the source data and regenerate; do not patch generated Markdown directly.

