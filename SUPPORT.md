# Support / 支持与反馈

## Live Site / 在线访问

- Handbook: https://uling19.github.io/Codex-for-learning-math/handbook/
- Repository: https://github.com/ULing19/Codex-for-learning-math

## What To Report / 适合反馈什么

Please open a GitHub issue when you find:

- A formula, condition, proof idea, example, or mistake reminder is wrong or unclear.
- A card is assigned to the wrong subject, chapter, tag, or importance level.
- A lab cannot open, has broken controls, or does not explain the concept clearly.
- MathJax rendering, mobile layout, sidebar scrolling, search, or mastery tracking behaves incorrectly.
- A coverage gap exists for 考研数学一, 同济高数, 同济线代, or 高教社概率统计.

## Useful Details / 反馈时最好提供

For formula issues:

- Card title or card id if visible.
- The current formula and the corrected formula.
- Why the correction is needed: textbook convention, exam syllabus, counterexample, or calculation check.
- Suggested example or proof route if you have one.

For UI or lab issues:

- Page URL.
- Browser and device, for example Chrome desktop, Edge mobile, iPhone Safari.
- Screenshot or short reproduction steps.
- Console error text if available.

## Maintainer Checks / 维护者常用检查

Before merging content or UI fixes, maintainers should run:

```bash
npm run verify
```

For browser-level lab checks:

```bash
npm install --no-save playwright@1.61.1
npx playwright install chromium
npm run verify:browser
```

For the deployed GitHub Pages version:

```bash
npm run verify:browser:live
```

## Non-goals / 暂不处理

- Requests for copyrighted textbook scans or paid course material.
- Symbolic CAS-level solving for arbitrary input.
- Account, payment, school registration, or exam policy support unrelated to this handbook.

