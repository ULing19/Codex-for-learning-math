const fs = require("fs");
const path = require("path");
const vm = require("vm");
const studyLayer = require("./study-layer.js");

const root = __dirname;
const repoRoot = path.resolve(root, "..");
const read = (file) => fs.readFileSync(path.join(repoRoot, file), "utf8");

const html = read("handbook/index.html");
const app = read("handbook/app.js");
const generator = read("handbook/generate-docs.js");
const dataSource = read("handbook/formula-data.js");
const coverageScript = read("handbook/coverage-report.js");

const mustHaveFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "CITATION.cff",
  "VERSIONING.md",
  "CHANGELOG.md",
  "CONTENT_GOVERNANCE.md",
  "MAINTAINERS.md",
  "RELEASE_CHECKLIST.md",
  "LICENSE",
  "COVERAGE.md",
  ".nojekyll",
  ".github/CODEOWNERS",
  ".github/workflows/verify.yml",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/formula-correction.md",
  ".github/ISSUE_TEMPLATE/content-gap.md",
  ".github/ISSUE_TEMPLATE/feature-request.md",
  ".github/ISSUE_TEMPLATE/ui-lab-issue.md",
  ".github/pull_request_template.md"
];
const exists = (file) => fs.existsSync(path.join(repoRoot, file));
const readIfExists = (file) => exists(file) ? read(file) : "";
const workflow = readIfExists(".github/workflows/verify.yml");
const rootReadme = readIfExists("README.md");
const contributing = readIfExists("CONTRIBUTING.md");
const contentGovernance = readIfExists("CONTENT_GOVERNANCE.md");
const maintainers = readIfExists("MAINTAINERS.md");
const changelog = readIfExists("CHANGELOG.md");
const releaseChecklist = readIfExists("RELEASE_CHECKLIST.md");
const versioning = readIfExists("VERSIONING.md");
const coverageReport = readIfExists("COVERAGE.md");

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox, { filename: "formula-data.js" });

const cards = sandbox.window.FORMULA_CARDS || [];
const groups = sandbox.window.FORMULA_GROUPS || [];
const errors = [];
const warnings = [];

const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

for (const file of mustHaveFiles) {
  assert(exists(file), `Missing mature-project governance file: ${file}`);
}
assert(workflow.includes("npm run verify") && workflow.includes("npm run verify:browser"), "CI must run both base verification and browser smoke verification");
assert(rootReadme.includes("npm run verify") && rootReadme.includes("browser-smoke.js") && rootReadme.includes("verify:browser:live"), "Root README must document base, local browser, and live browser verification");
assert(rootReadme.includes("COVERAGE.md") && rootReadme.includes("coverage-report.js"), "Root README must document the coverage report workflow");
assert(rootReadme.includes("CITATION.cff"), "Root README must document repository citation metadata");
assert(rootReadme.includes("VERSIONING.md"), "Root README must document versioning and cache policy");
assert(contributing.includes("Pull Request Checklist") && contributing.includes("npm run verify"), "CONTRIBUTING must include a PR checklist and verification command");
assert(contributing.includes("CONTENT_GOVERNANCE.md"), "CONTRIBUTING must point content contributors to CONTENT_GOVERNANCE.md");
assert(contributing.includes(".github/CODEOWNERS") && contributing.includes("MAINTAINERS.md"), "CONTRIBUTING must document review ownership files");
assert(contentGovernance.includes("Source Tiers") && contentGovernance.includes("Verification Rules") && contentGovernance.includes("High-yield Trick Policy"), "CONTENT_GOVERNANCE must define source tiers, verification rules, and high-yield trick policy");
assert(maintainers.includes("Review Areas") && maintainers.includes("Merge Expectations") && maintainers.includes("Generated Files"), "MAINTAINERS must document review areas, merge expectations, and generated file rules");
assert(changelog.includes("2026-07-08") && changelog.includes("browser-smoke.js") && changelog.includes("coverage-report.js"), "CHANGELOG must record the maturity verification and coverage-report capabilities");
assert(releaseChecklist.includes("GitHub Pages") && releaseChecklist.includes("MathJax"), "Release checklist must cover GitHub Pages and MathJax checks");
assert(releaseChecklist.includes("VERSIONING.md") && versioning.includes("Version Source of Truth") && versioning.includes("When To Bump"), "Release checklist and VERSIONING must document version/cache release policy");
assert(coverageScript.includes("Content Coverage Report") && coverageScript.includes("Interactive Lab Coverage"), "coverage-report.js must produce a project coverage report");
assert(coverageReport.includes("## Subject Coverage") && coverageReport.includes("## Interactive Lab Coverage") && coverageReport.includes("PASS: coverage gate satisfied"), "COVERAGE.md must be generated and passing");
assert(!new RegExp("\\?{4,}").test(read("handbook/quality-check.js")), "quality-check.js must not contain mojibake placeholder question marks");

assert(cards.length >= 490, `公式卡数量异常：${cards.length}`);
assert(groups.length >= 6, `学科分组数量异常：${groups.length}`);
assert(html.includes("./study-layer.js") && html.indexOf("./study-layer.js") < html.indexOf("./app.js"), "index.html 必须在 app.js 前加载 study-layer.js");
assert(app.includes("function openLabDemo"), "app.js 缺少 openLabDemo，实验室总览不能直达演示");
assert(app.includes("打开实验室演示"), "实验室卡片按钮文案必须明确为打开演示");
assert(app.includes("renderStudyLayer(card)"), "公式卡核心区必须渲染学习拆解层");
assert(generator.includes("studyBlock(card)"), "Markdown 生成脚本必须输出学习拆解层");

const interactiveCards = cards.filter((card) => card.interactiveType && card.interactiveType !== "none");
const interactiveTypes = new Map();
for (const card of interactiveCards) {
  interactiveTypes.set(card.interactiveType, (interactiveTypes.get(card.interactiveType) || 0) + 1);
}

const requiredLabTypes = [
  "equivalent-compare",
  "taylor-order-lab",
  "trig-transform-lab",
  "integral-method-picker",
  "matrix-eigen-lab",
  "probability-distribution-lab",
  "wallis-recursion",
  "unit-circle",
  "distribution-plot",
  "clt-demo",
  "riemann-sum"
];

for (const type of requiredLabTypes) {
  assert(interactiveTypes.has(type), `缺少高价值实验室挂载：${type}`);
}

let studyFailures = 0;
const kindCount = new Map();
for (const card of cards) {
  const study = studyLayer.buildStudyLayer(card);
  kindCount.set(study.kind, (kindCount.get(study.kind) || 0) + 1);
  const checks = [
    [study.proofTitle && study.proofTitle.length >= 8, "proofTitle"],
    [study.proofCore && study.proofCore.length >= 60, "proofCore"],
    [Array.isArray(study.proofSteps) && study.proofSteps.length >= 4, "proofSteps"],
    [Array.isArray(study.triggers) && study.triggers.length >= 2, "triggers"],
    [Array.isArray(study.examSteps) && study.examSteps.length >= 5, "examSteps"],
    [study.exampleProblem && study.exampleProblem.length >= 35, "exampleProblem"],
    [Array.isArray(study.exampleSolution) && study.exampleSolution.length >= 3, "exampleSolution"],
    [Array.isArray(study.checklist) && study.checklist.length >= 3, "checklist"]
  ];
  const bad = checks.filter(([ok]) => !ok).map(([, name]) => name);
  if (bad.length) {
    studyFailures += 1;
    if (studyFailures <= 12) errors.push(`学习拆解不完整：${card.id} -> ${bad.join(", ")}`);
  }
}
if (studyFailures > 12) errors.push(`还有 ${studyFailures - 12} 张卡学习拆解不完整`);

const fieldStats = ["conditions", "intuition", "howToUse", "miniProof", "example", "mistakes"].map((field) => {
  const lens = cards.map((card) => String(card[field] || "").trim().length).sort((a, b) => a - b);
  const median = lens[Math.floor(lens.length / 2)];
  const avg = lens.reduce((sum, item) => sum + item, 0) / lens.length;
  return { field, min: lens[0], median, avg: Number(avg.toFixed(1)) };
});

for (const stat of fieldStats) {
  if (stat.median < 12) warnings.push(`字段中位数偏短：${stat.field} median=${stat.median}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

if (warnings.length) console.warn(warnings.join("\n"));

console.log(`quality-ok cards=${cards.length} interactive=${interactiveCards.length} labTypes=${interactiveTypes.size} studyKinds=${[...kindCount.entries()].map(([k, v]) => `${k}:${v}`).join(",")}`);
