const { execFileSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedFiles = [
  "COVERAGE.md",
  "PROJECT_HEALTH.md",
  "\u8003\u7814\u6570\u5b66\u4e00-\u516c\u5f0f\u624b\u518c-\u5b8c\u6574\u7248.md",
  "\u8003\u7814\u6570\u5b66\u4e00-\u51b7\u95e8\u6280\u5de7\u516c\u5f0f\u5e93.md",
  "\u8003\u7814\u6570\u5b66\u4e00-\u603b\u7d22\u5f15.md"
];

function assertNoControlCharacters() {
  const fs = require("fs");
  for (const file of generatedFiles) {
    const data = fs.readFileSync(path.join(root, file));
    const badIndex = data.findIndex((byte) => byte < 32 && byte !== 9 && byte !== 10);
    if (badIndex !== -1) {
      console.error(`generated-control-char: ${file} contains byte 0x${data[badIndex].toString(16).padStart(2, "0")} at offset ${badIndex}`);
      console.error("Regenerate docs after fixing the source LaTeX/string escaping.");
      process.exit(1);
    }
  }
}

function git(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function main() {
  assertNoControlCharacters();

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
    console.error("Run npm run docs && npm run coverage && npm run health, then commit the regenerated files.");
    process.exit(1);
  }

  console.log(`generated-ok files=${generatedFiles.length}`);
}

main();
