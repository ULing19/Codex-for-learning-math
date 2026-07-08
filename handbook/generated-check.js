const { execFileSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedFiles = [
  "COVERAGE.md",
  "考研数学一-公式手册-完整版.md",
  "考研数学一-冷门技巧公式库.md",
  "考研数学一-总索引.md"
];

function git(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function main() {
  let diff = "";
  try {
    diff = git(["-c", "core.quotePath=false", "diff", "--name-only", "--", ...generatedFiles]).trim();
  } catch (error) {
    process.stderr.write(error.stderr || error.message);
    process.exit(1);
  }

  if (diff) {
    console.error("generated-diff: generated files are out of date after docs/coverage generation");
    console.error(diff);
    console.error("Run npm run docs && npm run coverage, then commit the regenerated files.");
    process.exit(1);
  }

  console.log(`generated-ok files=${generatedFiles.length}`);
}

main();
