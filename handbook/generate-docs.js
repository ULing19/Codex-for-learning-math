const fs = require("fs");
const vm = require("vm");
const studyLayer = require("./study-layer.js");

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("handbook/formula-data.js", "utf8"), sandbox);

const cards = sandbox.window.FORMULA_CARDS;
const groups = sandbox.window.FORMULA_GROUPS;
const refs = sandbox.window.FORMULA_SOURCE_REFERENCES;
const date = "2026-06-07";

const mdFormula = (latex) => `$$\n\\begin{gathered}\n${latex.trim()}\n\\end{gathered}\n$$`;
const line = (label, text) => `- **${label}**：${text}`;
const list = (items) => items.map((item) => `  - ${item}`).join("\n");

const studyBlock = (card) => {
  const study = studyLayer.buildStudyLayer(card);
  return [
    `- **学习拆解类型**：${study.kind}`,
    `- **${study.proofTitle}**：${study.proofCore}`,
    `- **证明路线**：`,
    list(study.proofSteps),
    `- **${study.usageTitle}**：`,
    list(study.triggers),
    `- **考场步骤**：${study.examSteps.join(" → ")}`,
    `- **${study.exampleTitle}**：${study.exampleProblem}`,
    `- **例题步骤**：`,
    list(study.exampleSolution),
    `- **${study.checklistTitle}**：`,
    list(study.checklist)
  ].join("\n");
};

const cardBlock = (card, index) => [
  `#### ${index}. ${card.title}`,
  `- **位置**：${card.subject} / ${card.chapter} / ${card.section}`,
  `- **等级**：${card.importance}`,
  `- **标签**：${card.tags.join("、")}`,
  mdFormula(card.latex),
  line("一句话理解", card.intuition),
  line("适用条件", card.conditions),
  line("什么时候想到它", card.howToUse),
  line("为什么成立", card.miniProof),
  line("一个小例子", card.example),
  studyBlock(card),
  line("别乱用提醒", card.mistakes),
  card.interactiveType !== "none"
    ? line("交互模块", `打开 handbook/index.html 搜索「${card.title}」，展开卡片查看 ${card.interactiveType} 演示。`)
    : "",
  card.relatedFormulas?.length ? line("相关公式", card.relatedFormulas.join("、")) : "",
].filter(Boolean).join("\n") + "\n\n";

const bySubjectChapter = new Map();
for (const card of cards) {
  const subjectKey = `${card.subject}||${card.chapter}`;
  if (!bySubjectChapter.has(subjectKey)) bySubjectChapter.set(subjectKey, []);
  bySubjectChapter.get(subjectKey).push(card);
}

const stats = groups.map((group) => {
  const cardCount = cards.filter((card) => card.subject === group.subject).length;
  return `| ${group.subject} | ${group.chapters.length} | ${cardCount} |`;
}).join("\n");

let full = `# 考研数学一公式手册（完整版）

> 生成日期：${date}。这是与本地交互前端同步的打印版，适合通读、打印、批注和错题索引。

## 使用方式

- 快查与互动：打开 \`handbook/index.html\`，用搜索框查「华里士」「等价无穷小」「Green」「正定」「中心极限定理」等关键词。
- 打印与批注：阅读本文档；每张卡都按「公式 → 理解 → 条件 → 用法 → 简证 → 例子 → 易错点」组织。
- 复习节奏：先背 \`必背\`，再刷 \`常用\`，最后把 \`技巧/了解/拓展\` 当作选择填空提速工具。
- 大纲提醒：考研数学一范围以当年正式考试大纲为准，本手册按同济/高教社常见教材章节与数学一复习范围整理。

## 覆盖统计

| 模块 | 章节数 | 公式卡数 |
|---|---:|---:|
${stats}

## 参考来源与用途

${refs.map((ref) => `- [${ref.title}](${ref.url})：${ref.usage}`).join("\n")}

## 目录

${groups.map((group) => `- ${group.subject}\n${group.chapters.map((chapter) => `  - ${chapter}`).join("\n")}`).join("\n")}

`;

let counter = 1;
for (const group of groups) {
  full += `## ${group.subject}\n\n`;
  for (const chapter of group.chapters) {
    const chapterCards = bySubjectChapter.get(`${group.subject}||${chapter}`) || [];
    full += `### ${chapter}\n\n`;
    if (!chapterCards.length) {
      full += "> 暂无公式卡，后续补充。\n\n";
      continue;
    }
    for (const card of chapterCards) full += cardBlock(card, counter++);
  }
}

fs.writeFileSync("考研数学一-公式手册-完整版.md", full, "utf8");

const coldCards = cards.filter((card) => card.subject === "冷门技巧" || card.tags.includes("冷门技巧"));
const rememberLevel = (card) => {
  if (card.importance === "技巧") return "建议背/会用";
  if (card.importance === "了解") return "会认即可";
  if (card.importance === "拓展") return "拓展了解";
  return card.importance;
};
const scenario = (card) => {
  if (card.tags.includes("积分") || card.section.includes("积分")) return "选择填空提速；大题中作为辅助推导更稳";
  if (card.tags.includes("级数")) return "选择填空判敛；证明题可作思路补充";
  if (card.tags.includes("矩阵") || card.tags.includes("行列式") || card.tags.includes("线代")) return "线代选择填空与矩阵高次幂/分块计算";
  if (card.tags.includes("概率")) return "概率大题建模与选择填空快速识别";
  return "选择填空提速，主观题谨慎使用";
};
const fallback = (card) => {
  const map = {
    "cold-wallis": "降幂公式或分部积分递推。",
    "cold-frullani": "含参数积分、换元后再求导/积分。",
    "cold-raabe-dirichlet": "比较判别、Leibniz 判别、Abel/Dirichlet 常规表述。",
    "cold-cayley-hamilton": "对角化、递推降阶、直接归纳。",
    "cold-total-expectation": "先写联合分布/条件分布，再逐层求和。",
    "cold-beta-gamma": "三角换元、分部积分、华里士递推。",
    "cold-cauchy-condensation": "积分判别或比较判别。",
    "cold-schur-complement": "分块初等变换化上三角。",
    "calc12-parseval": "Fourier 基础展开、常规级数比较或已知结论。",
    "linear2-sherman-morrison": "分块初等变换、行列式性质或伴随矩阵法。",
    "cold-stirling": "取对数、比值法、夹逼或 Stolz 思想。",
    "cold-abel-summation": "Dirichlet 判别、Leibniz 判别或分部求和的常规写法。",
    "cold-laplace-method": "Taylor 主项法、夹逼估计或变量缩放。",
    "calc4-euler-substitution": "配方、三角代换、双曲代换或分部积分。",
    "calc5-improper-gamma-beta": "p 积分比较、换元、分部积分。",
    "calc5-gaussian-integral": "极坐标二重积分推导或正态分布标准结论。",
    "pre-trig-universal": "恒等变形、降幂、凑微分。"
  };
  return map[card.id] || "回到教材常规方法，先保证条件和步骤可说明。";
};

let cold = `# 考研数学一冷门技巧公式库

> 生成日期：${date}。本库收录“不一定天天用，但一旦识别出来就很省时间”的公式技巧。冷门技巧要服务考场，不要反客为主。

## 使用原则

- **先稳后快**：大题优先写教材通法，冷门公式可作为检查或简化。
- **先查条件**：Frullani、Beta/Gamma、Raabe、Schur 补这类公式条件不满足时很容易翻车。
- **选择填空优先**：多数冷门技巧最适合选择填空提速；证明题要能补出依据。
- **错题标记**：遇到能用冷门技巧的错题，在题旁写「触发关键词」。

## 技巧总览

| 技巧 | 等级 | 适合题型 | 更稳替代 |
|---|---|---|---|
${coldCards.map((card) => `| ${card.title} | ${rememberLevel(card)} | ${scenario(card)} | ${fallback(card)} |`).join("\n")}

`;

let coldCounter = 1;
for (const card of coldCards) {
  cold += `## ${coldCounter++}. ${card.title}\n\n`;
  cold += `- **建议级别**：${rememberLevel(card)}\n`;
  cold += `- **适合题型**：${scenario(card)}\n`;
  cold += `- **更稳替代**：${fallback(card)}\n`;
  cold += `- **触发关键词**：${card.howToUse}\n\n`;
  cold += `${mdFormula(card.latex)}\n\n`;
  cold += `${line("一句话理解", card.intuition)}\n`;
  cold += `${line("适用条件", card.conditions)}\n`;
  cold += `${line("简短证明/来源", card.miniProof)}\n`;
  cold += `${line("一个小例子", card.example)}\n`;
  cold += `${studyBlock(card)}\n`;
  cold += `${line("别乱用提醒", card.mistakes)}\n\n`;
}

cold += `## 来源说明\n\n${refs.map((ref) => `- [${ref.title}](${ref.url})：${ref.usage}`).join("\n")}\n`;

fs.writeFileSync("考研数学一-冷门技巧公式库.md", cold, "utf8");

const index = `# 考研数学一总索引

## 先修路线
1. \`handbook/index.html\`：交互公式手册，当前 ${cards.length} 张公式卡，优先从这里查公式、看动画、做筛选。
2. \`考研数学一-公式手册-完整版.md\`：完整打印版，适合通读、批注、导出。
3. \`考研数学一-冷门技巧公式库.md\`：华里士、Beta/Gamma、Frullani、Raabe、Stirling、Parseval 等高收益技巧专题。
4. \`考研数学一-前置知识总表.md\`
5. \`考研数学一-公式大全.md\`
6. \`高数上册-章节考点速记.md\`
7. \`高数下册-章节考点速记.md\`
8. \`线性代数-章节考点速记.md\`
9. \`概率论-章节考点速记.md\`
10. \`考研数学一-同济版总目录.md\`
11. \`考研数学一-同济版目录与错题模板.md\`

## 公式卡统计

| 模块 | 章节数 | 公式卡数 |
|---|---:|---:|
${stats}

## 备用索引
- \`高数上册-知识点总表.md\`
- \`高数下册-知识点总表.md\`
- \`线性代数-知识点总表.md\`
- \`概率论-知识点总表.md\`

## 使用方式
- 先打开 \`handbook/index.html\`，搜索关键词或按章节筛选。
- 发章节名，我补成更细的知识卡。
- 发题目，我帮你归类到错题模板。
- 发薄弱点，我先补前置知识，再补核心知识。
`;

fs.writeFileSync("考研数学一-总索引.md", index, "utf8");

console.log(`wrote full=${full.length} chars, cold=${cold.length} chars, index=${index.length} chars, cards=${cards.length}, coldCards=${coldCards.length}`);
