const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "package.json",
  ".nvmrc",
  "handbook/index.html",
  "handbook/app.js",
  "handbook/formula-data.js",
  "handbook/styles.css",
  "COVERAGE.md",
  "PROJECT_HEALTH.md"
];

const optionalTools = [
  {
    name: "Playwright",
    check: () => require.resolve("playwright"),
    install: "npm install --no-save playwright@1.61.1",
    why: "required for npm run verify:browser and npm run verify:browser:live"
  },
  {
    name: "GitHub CLI",
    check: () => execFileSync("gh", ["--version"], { cwd: root, stdio: "ignore" }),
    install: "https://cli.github.com/",
    why: "useful for checking GitHub Actions and Pages deployment state"
  },
  {
    name: "Git",
    check: () => execFileSync("git", ["--version"], { cwd: root, stdio: "ignore" }),
    install: "https://git-scm.com/",
    why: "required for generated drift checks and normal contribution workflow"
  }
];

function parseNodeMajor(version) {
  const match = String(version).match(/^v?(\d+)/);
  return match ? Number(match[1]) : 0;
}

function checkRequiredFiles(errors) {
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(root, file))) errors.push(`missing required file: ${file}`);
  }
}

function checkNode(errors) {
  const major = parseNodeMajor(process.version);
  if (major < 24) errors.push(`Node.js ${process.version} is too old; expected >=24`);
}

function checkPackageScripts(errors) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const scripts = pkg.scripts || {};
  for (const name of ["verify", "doctor", "verify:browser", "verify:browser:live", "verify:deploy"]) {
    if (!scripts[name]) errors.push(`package.json missing script: ${name}`);
  }
}

function checkOptionalTools(warnings) {
  for (const tool of optionalTools) {
    try {
      tool.check();
    } catch (_) {
      warnings.push(`${tool.name} not available; ${tool.why}. Install/use: ${tool.install}`);
    }
  }
}

function main() {
  const errors = [];
  const warnings = [];
  checkNode(errors);
  checkRequiredFiles(errors);
  checkPackageScripts(errors);
  checkOptionalTools(warnings);

  for (const warning of warnings) console.warn(`doctor-warning: ${warning}`);
  if (errors.length) {
    for (const error of errors) console.error(`doctor-error: ${error}`);
    process.exit(1);
  }

  console.log(`doctor-ok node=${process.version} warnings=${warnings.length}`);
}

main();
