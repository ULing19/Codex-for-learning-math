# Security Policy / 安全政策

This is a static educational website. It has no backend, database, account system, or server-side secret handling.

Privacy and local learning-state behavior are documented in `PRIVACY.md`.

这是一个纯静态学习网站，没有后端、数据库、账号系统或服务端密钥处理。

## Supported Scope / 支持范围

Security reports are useful when they affect:

- GitHub Pages deployment integrity.
- Static JavaScript behavior that could cause script injection.
- Unsafe dependency or workflow changes.
- Malicious content embedded in formulas, examples, or generated docs.

## Reporting / 报告方式

Please open a GitHub issue if the report is not sensitive. For sensitive reports, contact the repository owner through GitHub profile channels.

如果问题不敏感，请直接开 GitHub issue。敏感问题请通过仓库所有者 GitHub 主页提供的渠道联系。

## Current Risk Model / 当前风险模型

- Runtime state is stored only in browser `localStorage`.
- MathJax is loaded from CDN; if offline, raw LaTeX remains readable.
- The project intentionally avoids build tooling and backend deployment.
- Validation scripts check formula structure, required fields, and common LaTeX/control-character hazards.
