# Versioning and Cache Policy / 版本与缓存策略

This project is a static GitHub Pages app. A release is not only a commit; it must also keep browser caches, GitHub Pages artifacts, generated Markdown, and live lab scripts aligned.

本项目是纯静态 GitHub Pages 应用。一次发布不只是提交代码，还必须让浏览器缓存、Pages 产物、生成文档和线上实验室脚本保持一致。

## Version Source of Truth / 版本源头

The public app version is defined in `package.json`:

```json
"version": "x.y.z"
```

The same version must appear in:

- `handbook/index.html` `<meta name="app-version" ...>`.
- Local asset query strings in `handbook/index.html`, for example `app.js?v=x.y.z`.
- `CITATION.cff` `version`.

`handbook/link-check.js` enforces these values during `npm run verify`.

## When To Bump / 什么时候升版本

Bump the version when a deployed user may otherwise keep a stale cached asset:

- Formula data changes in `handbook/formula-data.js`.
- Runtime behavior changes in `handbook/app.js` or `handbook/study-layer.js`.
- Styling or layout changes in `handbook/styles.css`.
- Public metadata changes that should be visible on GitHub Pages.

Version bump is optional for docs-only changes that do not affect `handbook/` runtime assets, but keeping `CITATION.cff` aligned with `package.json` is still required.

## Release Steps / 发布步骤

1. Update `package.json` version when runtime or data changed.
2. Update `handbook/index.html` `app-version` and every local `?v=` asset query.
3. Update `CITATION.cff` `version` if `package.json` changed.
4. Run `npm run verify`.
5. Push to `main`.
6. Confirm GitHub Actions `Verify handbook` and `Deploy Pages` are green.
7. For runtime/lab changes, confirm `npm run verify:browser:live` or the Pages workflow browser smoke passes.

## Why Query Strings Matter / 为什么要加查询版本

GitHub Pages and browsers may cache `app.js`, `formula-data.js`, `study-layer.js`, and `styles.css`. The query string forces users to fetch refreshed assets after a release.

If the version is bumped in `package.json` but not in `index.html`, the live site can load a mismatched app shell and stale formula/lab code. This is exactly the class of issue guarded by `link-check.js`, `browser-smoke.js`, and `deploy-health.js`.

## Deployment Evidence / 部署证据

A stable release should have:

- Local `npm run verify` success.
- `COVERAGE.md` generated and passing.
- `Verify handbook` GitHub Action success.
- `Deploy Pages` GitHub Action success.
- Live site version matching `package.json`.

