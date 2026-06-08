# Codex for Learning Math / 考研数学一交互公式手册

> 一个面向考研数学一复习的静态交互公式手册：494 张公式卡、168 个交互演示、可搜索、可复习、可部署到 GitHub Pages。
>
> A static interactive formula handbook for China postgraduate entrance exam Math I review: 494 formula cards, 168 interactive demos, searchable, review-friendly, and deployable on GitHub Pages.

[在线访问 / Live Demo](https://uling19.github.io/Codex-for-learning-math/handbook/) · [维护文档 / Maintainer Guide](./handbook/README.md)

![Preview](./handbook/preview.png)

---

## 中文介绍

这是一个用 **HTML + CSS + Vanilla JavaScript + MathJax** 构建的本地/网页公式手册，覆盖考研数学一的核心内容：

- 高等数学（同济版上下册范围）
- 线性代数
- 概率论与数理统计
- 前置基础公式
- 冷门但高收益技巧
- 考场速查与错题归因

项目目标不是简单堆公式，而是把公式整理成「能看懂、搜得到、会使用」的学习工作台。重点公式卡通常包含：

- 公式 LaTeX
- 一句话理解
- 适用条件
- 考场用法
- 简短证明/来源
- 小例子
- 易错点
- 关联公式
- 交互演示

## 核心功能

- **公式卡片**：494 张结构化公式卡，覆盖高数、线代、概率和冷门技巧。
- **交互实验室**：168 个可视化演示，帮助理解极限、Taylor、三角、积分、矩阵、概率等概念。
- **搜索与高亮**：支持标题、章节、标签、解释全文检索。
- **掌握度系统**：未学 / 认识 / 掌握，保存在浏览器 `localStorage`。
- **今日推荐**：优先推荐必背、未掌握、有交互的高价值公式。
- **复习队列**：自动整理必背未掌握、认识状态和收藏卡。
- **错题归因**：按常见错误类型反查相关公式。
- **关联跳转**：公式卡之间通过关联 chip 形成知识网络。
- **键盘快捷键**：支持快速搜索、翻卡、收藏和掌握度标记。
- **纯静态部署**：无需构建工具、无需后端。

## 交互模块

当前支持的 `interactiveType`：

| 类型 | 用途 |
|---|---|
| `limit-slider` | 经典极限数值逼近 |
| `taylor-plot` | Taylor 曲线近似 |
| `tangent-line` | 导数与切线 |
| `riemann-sum` | Riemann 和与定积分面积 |
| `wallis-recursion` | Wallis 公式递推 |
| `unit-circle` | 单位圆三角函数 |
| `matrix-transform` | 二维矩阵变换 |
| `distribution-plot` | 常见概率分布 |
| `clt-demo` | 中心极限定理 |
| `equivalent-compare` | 等价无穷小比较 |
| `taylor-order-lab` | Taylor 展开阶数选择 |
| `trig-transform-lab` | 三角变形工作台 |
| `integral-method-picker` | 积分方法决策树 |
| `matrix-eigen-lab` | 特征值、特征向量与正定 |
| `probability-distribution-lab` | 假设检验拒绝域 |

## 本地使用

最简单方式：直接打开：

```text
handbook/index.html
```

也可以启动本地 HTTP 服务：

```bash
npx serve handbook
```

或：

```bash
cd handbook
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 验收命令

每次修改后建议运行：

```bash
node --check handbook/app.js
node --check handbook/formula-data.js
node --check handbook/validate-data.js
node --check handbook/generate-docs.js
node --check handbook/smoke-test.js
node handbook/validate-data.js
node handbook/generate-docs.js
node handbook/smoke-test.js
```

说明：

- `node --check` 只检查语法。
- `validate-data.js` 检查公式卡数据完整性。
- `generate-docs.js` 从结构化数据生成 Markdown 文档。
- `smoke-test.js` 用 Node fake DOM 检查运行时接线，能发现页面白屏类问题。

## 文件结构

```text
.
├── handbook/
│   ├── index.html          # 页面入口
│   ├── styles.css          # 样式
│   ├── app.js              # 交互逻辑
│   ├── formula-data.js     # 公式卡数据
│   ├── validate-data.js    # 数据校验
│   ├── generate-docs.js    # Markdown 生成
│   ├── smoke-test.js       # 运行时冒烟测试
│   ├── README.md           # 维护文档
│   └── preview.png         # 预览图
├── 考研数学一-公式手册-完整版.md
├── 考研数学一-冷门技巧公式库.md
├── 考研数学一-总索引.md
└── README.md
```

## 开源协议

本项目使用 [MIT License](./LICENSE)。

公式、知识点和解释内容用于学习与复习整理。若你基于本项目继续改造，建议保留来源说明与验收脚本，避免公式数据在迭代中失真。

---

## English Overview

This project is a static interactive formula handbook for Math I review. It is built with **HTML + CSS + Vanilla JavaScript + MathJax**, with no build tools and no backend.

It focuses on making formulas:

- easy to search,
- easy to understand,
- easy to review,
- and easy to connect across topics.

## Features

- **494 structured formula cards** covering calculus, linear algebra, probability, prerequisites, and high-yield tricks.
- **168 interactive demos** powered by SVG and plain JavaScript.
- **Search and highlighting** across titles, chapters, tags, and explanations.
- **Mastery tracking** via browser `localStorage`.
- **Today’s recommendations** for high-priority review.
- **Review queue** based on mastery, importance, and favorites.
- **Error attribution** for common mistake patterns.
- **Related formula chips** for quick navigation.
- **Keyboard shortcuts** for fast study workflows.
- **Static deployment** via GitHub Pages.

## Quick Start

Open:

```text
handbook/index.html
```

Or serve locally:

```bash
npx serve handbook
```

Then visit the printed local URL.

## Live Demo

[https://uling19.github.io/Codex-for-learning-math/handbook/](https://uling19.github.io/Codex-for-learning-math/handbook/)

## Development Checks

Run before committing changes:

```bash
node --check handbook/app.js
node --check handbook/formula-data.js
node --check handbook/validate-data.js
node --check handbook/generate-docs.js
node --check handbook/smoke-test.js
node handbook/validate-data.js
node handbook/generate-docs.js
node handbook/smoke-test.js
```

## License

MIT License. See [LICENSE](./LICENSE).
