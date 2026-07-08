# Privacy / 隐私说明

This project is a static GitHub Pages handbook. It does not run a backend, does not create accounts, and does not intentionally collect personal data.

本项目是纯静态 GitHub Pages 手册，没有后端、账号系统，也不会主动收集个人数据。

## What The App Stores / 应用会存什么

The handbook stores learning state only in your browser `localStorage`:

| Key | Purpose |
|---|---|
| `math1_mastery_v1` | Formula card mastery state: unseen, familiar, or known |
| `math1_favorites_v1` | Favorite formula card ids |

These values stay on your device and are not sent to this project by the app.

## What The App Does Not Use / 应用不会使用什么

- No account login.
- No project-owned backend or database.
- No cookies set by the handbook code.
- No analytics script included by the handbook code.
- No payment, contact, or personal profile collection.

## Third-party Requests / 第三方请求

The live site may load MathJax from jsDelivr:

- `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js`

GitHub Pages and the CDN may receive normal web request metadata such as IP address, user agent, referrer, and request time. That data is controlled by GitHub/CDN infrastructure, not by this static app.

If MathJax fails to load, formulas remain visible as LaTeX text; the handbook should still be readable.

## Clearing Local Learning Data / 清除本地学习数据

To reset mastery and favorites:

1. Open browser developer tools on the handbook page.
2. Go to Application/Storage → Local Storage.
3. Delete `math1_mastery_v1` and `math1_favorites_v1`.

You can also clear site data for `uling19.github.io`, but that may remove other local data from the same GitHub Pages origin.

## For Contributors / 给贡献者

Do not add analytics, trackers, remote logging, account systems, or telemetry without first updating:

- `PRIVACY.md`
- `SECURITY.md`
- `README.md`
- Browser smoke or validation checks if behavior changes

The default project direction is privacy-preserving static learning: local state should stay local.

