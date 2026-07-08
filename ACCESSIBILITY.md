# Accessibility / 可访问性说明

This handbook is designed as a static learning workspace for formulas, examples, and interactive labs. Accessibility matters because math review often happens across different devices, screen sizes, keyboards, browsers, and reading preferences.

本手册是面向公式、例题和交互实验室的静态学习工作台。可访问性很重要，因为复习场景会覆盖不同设备、屏幕尺寸、键盘操作习惯、浏览器和阅读需求。

## Current Commitments / 当前承诺

- The handbook must remain usable on desktop and mobile layouts.
- Search has an accessible name and can be focused with `/`.
- Visible buttons should have text, `title`, or `aria-label`.
- Lab cards should be keyboard reachable and activatable.
- Sidebar and bottom navigation should remain reachable on mobile.
- Formula overflow should scroll horizontally instead of clipping content.
- MathJax failure should leave readable LaTeX text instead of a blank page.

These commitments are partially enforced by `handbook/browser-smoke.js` and `npm run verify:browser`.

## Keyboard Support / 键盘支持

Important shortcuts:

| Key | Behavior |
|---|---|
| `/` | Focus search |
| `Esc` | Close sidebar, blur search, or close expanded card details |
| `j` / `↓` | Move to next visible formula card |
| `k` / `↑` | Move to previous visible formula card |
| `Space` / `Enter` | Flip/open focused card unless a native button/link/summary already handles it |
| `m` | Cycle mastery state |
| `f` | Toggle favorite |
| `1` / `2` / `3` | Mark unseen/familiar/known |

## Browser Smoke Coverage / 浏览器冒烟覆盖

The browser acceptance test checks:

- Duplicate DOM ids.
- Visible buttons without accessible names.
- Search accessible name.
- Keyboard focus for lab cards.
- `/` shortcut focusing search.
- Desktop and mobile sidebar behavior.
- Mobile bottom navigation hit target.
- Lab opening paths and basic lab controls.
- MathJax error count.
- Versioned asset loading.

Run locally:

```bash
npm install --no-save playwright@1.61.1
npx playwright install chromium
npm run verify:browser
```

Run against GitHub Pages:

```bash
npm run verify:browser:live
```

## UI Change Checklist / UI 改动检查

Before merging UI or lab changes:

- [ ] Controls have visible labels or accessible names.
- [ ] Keyboard users can reach the new feature.
- [ ] Mobile layout does not hide or overlap critical controls.
- [ ] Long formulas remain horizontally scrollable.
- [ ] Color is not the only way to understand a state.
- [ ] Browser smoke is updated if DOM structure or lab behavior changes.

## Known Limitations / 已知限制

- This project does not yet run a full WCAG audit or screen-reader transcript audit.
- Math-heavy content can still be difficult for screen readers, especially rendered MathJax expressions.
- SVG labs are explanatory visuals; they should be paired with text readouts, but not every lab has a full non-visual equivalent yet.

Please report accessibility issues using the UI/lab issue template and include device, browser, keyboard/screen-reader context, and reproduction steps when possible.

