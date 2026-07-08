const fs = require("fs");
const vm = require("vm");

const allowedInteractiveTypes = new Set([
  "none",
  "limit-slider",
  "taylor-plot",
  "tangent-line",
  "riemann-sum",
  "wallis-recursion",
  "unit-circle",
  "matrix-transform",
  "distribution-plot",
  "clt-demo",
  "equivalent-compare",
  "taylor-order-lab",
  "trig-transform-lab",
  "integral-method-picker",
  "matrix-eigen-lab",
  "probability-distribution-lab"
]);

const labMinimums = new Map([
  ["equivalent-compare", 3],
  ["taylor-order-lab", 3],
  ["trig-transform-lab", 3],
  ["integral-method-picker", 3],
  ["matrix-eigen-lab", 3],
  ["probability-distribution-lab", 3],
  ["wallis-recursion", 3]
]);

const requiredKeywords = [
  "华里士",
  "Wallis",
  "等价无穷小",
  "和差化积",
  "万能公式",
  "Frullani",
  "Euler代换",
  "Raabe",
  "Green",
  "正定",
  "卷积",
  "中心极限定理",
  "Beta",
  "Gamma",
  "Cayley-Hamilton",
  "全期望",
  "全方差",
  "Vandermonde",
  "Stirling",
  "Fourier",
  "Parseval",
  "Gaussian",
  "路径无关",
  "Jacobi",
  "Schur",
  "Sherman-Morrison",
  "置信区间",
  "χ²"
  ,
  "Pappus",
  "Jensen",
  "Toeplitz",
  "Euler-Maclaurin",
  "最小二乘",
  "拒绝域",
  "样本方差",
  "左右导数",
  "Green 公式面积",
  "Stokes 公式环流"
];

const requiredChapterCounts = new Map([
  ["高等数学", 12],
  ["线性代数", 6],
  ["概率论", 8]
]);

const requiredFields = [
  "conditions",
  "intuition",
  "howToUse",
  "miniProof",
  "example",
  "mistakes"
];

const allowedLatexCommands = new Set(String.raw`
Delta Gamma Lambda Omega Phi Pi Rightarrow Sigma alpha angle approx arccos arcsin arctan arg
bar begin beta bigcup bigg bigl bigr binom cap cdot cdots chi circ cos cosh cot csc cup deg
dim dots downarrow end eta exists exp forall frac gamma ge gets hat hline iff iiint iint in
infty int kappa ker lambda le left leftarrow leftrightarrow lim limsup ll ln log longrightarrow
mapsto mathbb mathbf mathcal max mid min mp mu nabla ne not oint omega operatorname oplus
overline overset parallel partial perp pi pm prod psi quad rho right sec sigma sim sin sinh sqrt
succ succeq sum tan tanh text theta times to triangle uparrow varepsilon varnothing varphi vdots
vec xi xrightarrow
ddot displaystyle dot neq textbf
`.trim().split(/\s+/).map((name) => `\\${name}`));

const latexEnvironments = new Set(["array", "cases", "gathered", "matrix", "pmatrix", "bmatrix", "vmatrix"]);

function validateLatex(card) {
  const latexErrors = [];
  const latex = String(card.latex ?? "");
  if (latex.includes("?")) latexErrors.push(`LaTeX 含问号占位，疑似编码损坏：${card.id}`);
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(latex)) {
    latexErrors.push(`LaTeX 含控制字符：${card.id}`);
  }
  const unescapedPercent = latex.match(/(^|[^\\])%/g);
  if (unescapedPercent) latexErrors.push(`LaTeX 含未转义百分号：${card.id}`);

  for (const commandMatch of latex.matchAll(/(?<!\\)\\[A-Za-z]+\*?/g)) {
    const command = commandMatch[0];
    if (!allowedLatexCommands.has(command)) {
      latexErrors.push(`疑似 MathJax 不支持命令：${card.id} -> ${command}`);
    }
  }

  const envStack = [];
  for (const envMatch of latex.matchAll(/\\(begin|end)\{([^}]+)\}/g)) {
    const [, kind, env] = envMatch;
    if (!latexEnvironments.has(env)) latexErrors.push(`未知 LaTeX 环境：${card.id} -> ${env}`);
    if (kind === "begin") {
      envStack.push(env);
    } else if (envStack.pop() !== env) {
      latexErrors.push(`LaTeX 环境不匹配：${card.id} -> ${env}`);
    }
  }
  if (envStack.length) latexErrors.push(`LaTeX 环境未闭合：${card.id} -> ${envStack.join(",")}`);

  let braceDepth = 0;
  let minBraceDepth = 0;
  for (let index = 0; index < latex.length; index += 1) {
    const char = latex[index];
    const prev = latex[index - 1];
    if (char === "{" && prev !== "\\") braceDepth += 1;
    if (char === "}" && prev !== "\\") braceDepth -= 1;
    minBraceDepth = Math.min(minBraceDepth, braceDepth);
  }
  if (braceDepth !== 0 || minBraceDepth < 0) {
    latexErrors.push(`LaTeX 花括号不平衡：${card.id}`);
  }

  return latexErrors;
}

const source = fs.readFileSync("handbook/formula-data.js", "utf8");
const fatalEscapes = [];
let inString = false;
let inTemplate = false;
let quote = "";
let escaped = false;
let line = 1;
let column = 0;

for (let index = 0; index < source.length; index += 1) {
  const char = source[index];
  if (char === "\n") {
    line += 1;
    column = 0;
  } else {
    column += 1;
  }

  if (inTemplate) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "`") inTemplate = false;
    continue;
  }

  if (inString) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      const next = source[index + 1] || "";
      if (next === "x" && !/^[0-9A-Fa-f]{2}$/.test(source.slice(index + 2, index + 4))) {
        fatalEscapes.push(`${line}:${column} suspicious \\x escape in JS string; use double backslashes for LaTeX`);
      }
      if (next === "u" && source[index + 2] !== "{" && !/^[0-9A-Fa-f]{4}$/.test(source.slice(index + 2, index + 6))) {
        fatalEscapes.push(`${line}:${column} suspicious \\u escape in JS string; use double backslashes for LaTeX`);
      }
      escaped = true;
      continue;
    }
    if (char === quote) inString = false;
    continue;
  }

  if (char === "`") {
    inTemplate = true;
    continue;
  }
  if (char === "\"" || char === "'") {
    inString = true;
    quote = char;
    escaped = false;
  }
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const cards = sandbox.window.FORMULA_CARDS || [];
const groups = sandbox.window.FORMULA_GROUPS || [];
const errors = [];
const warnings = [];
const allowWarnings = /^(1|true|yes)$/i.test(process.env.VALIDATE_ALLOW_WARNINGS || "");

errors.push(...fatalEscapes);

if (cards.length < 320) errors.push(`公式卡数量过少：${cards.length}`);

const ids = new Set();
const titleIndex = new Map();
for (const card of cards) {
  if (ids.has(card.id)) errors.push(`重复 id：${card.id}`);
  ids.add(card.id);
  const normalizedTitle = String(card.title ?? "").replace(/[\s，、：:]+/g, "").toLowerCase();
  if (normalizedTitle) {
    if (!titleIndex.has(normalizedTitle)) titleIndex.set(normalizedTitle, []);
    titleIndex.get(normalizedTitle).push(card.id);
  }
  if (!allowedInteractiveTypes.has(card.interactiveType)) {
    errors.push(`未知 interactiveType：${card.id} -> ${card.interactiveType}`);
  }
  for (const field of requiredFields) {
    if (!card[field] || String(card[field]).trim().length < 6) {
      errors.push(`字段过短：${card.id}.${field}`);
    }
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(String(card[field]))) {
      errors.push(`字段含控制字符，疑似 LaTeX 反斜杠未双写：${card.id}.${field}`);
    }
    if (String(card[field]).includes("??")) {
      errors.push(`字段疑似编码损坏：${card.id}.${field}`);
    }
  }
  errors.push(...validateLatex(card));
}

for (const [labType, minimumCount] of labMinimums) {
  const count = cards.filter((card) => card.interactiveType === labType).length;
  if (count < minimumCount) {
    errors.push(`lab-card-count-too-low: ${labType} has ${count}, expected at least ${minimumCount}`);
  }
}

for (const group of groups) {
  const expected = requiredChapterCounts.get(group.subject);
  if (expected && group.chapters.length !== expected) {
    errors.push(`${group.subject} 章节数应为 ${expected}，实际为 ${group.chapters.length}`);
  }
  for (const chapter of group.chapters) {
    const count = cards.filter((card) => card.subject === group.subject && card.chapter === chapter).length;
    if (!count) errors.push(`章节没有公式卡：${group.subject} / ${chapter}`);
  }
}

const haystack = cards.map((card) => [
  card.id,
  card.subject,
  card.chapter,
  card.section,
  card.title,
  card.latex,
  card.importance,
  card.tags.join(" "),
  card.conditions,
  card.intuition,
  card.howToUse,
  card.miniProof,
  card.example,
  card.mistakes
].join(" ")).join("\n");

for (const keyword of requiredKeywords) {
  if (!haystack.includes(keyword)) errors.push(`缺少关键词：${keyword}`);
}

for (const [title, titleIds] of titleIndex) {
  if (titleIds.length > 1) {
    warnings.push(`重复标题提醒：${title} -> ${titleIds.join(", ")}`);
  }
}

console.log(`cards=${cards.length}`);
for (const group of groups) {
  const total = cards.filter((card) => card.subject === group.subject).length;
  console.log(`${group.subject}: chapters=${group.chapters.length}, cards=${total}`);
}

if (warnings.length) {
  if (allowWarnings) console.warn(warnings.join("\n"));
  else errors.push(...warnings);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("validate-ok");
