const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const binaryExtensions = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip"
]);
const allowControlFiles = new Set([]);

function git(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "buffer",
    stdio: ["ignore", "pipe", "pipe"]
  });
}

function listTrackedFiles() {
  return git(["ls-files", "-z"])
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
}

function isTextFile(file) {
  if (binaryExtensions.has(path.extname(file).toLowerCase())) return false;
  return true;
}

function main() {
  const errors = [];
  const files = listTrackedFiles().filter(isTextFile);
  for (const file of files) {
    const data = fs.readFileSync(path.join(root, file));
    const crlf = data.indexOf(Buffer.from("\r\n"));
    if (crlf !== -1) {
      errors.push(`line-ending: ${file} contains CRLF at byte ${crlf}; use LF`);
    }
    if (!allowControlFiles.has(file)) {
      const badIndex = data.findIndex((byte) => byte < 32 && byte !== 9 && byte !== 10);
      if (badIndex !== -1) {
        errors.push(`control-character: ${file} contains byte 0x${data[badIndex].toString(16).padStart(2, "0")} at byte ${badIndex}`);
      }
    }
    const text = data.toString("utf8");
    if (text.includes("\uFFFD")) {
      errors.push(`text-integrity: ${file} contains Unicode replacement character U+FFFD`);
    }
    const placeholderMatch = text.match(/\?{4,}/);
    if (placeholderMatch) {
      errors.push(`text-integrity: ${file} contains repeated question-mark placeholder "${placeholderMatch[0]}"`);
    }
  }

  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log(`repo-hygiene-ok files=${files.length}`);
}

main();
