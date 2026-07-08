const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, ".pages-artifact");
const handbookOutDir = path.join(outDir, "handbook");

const topLevelFilePattern = /\.md$/i;
const requiredTopLevelFiles = [".nojekyll", "LICENSE"];
const handbookFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "study-layer.js",
  "formula-data.js",
  "preview.png",
  "README.md"
];

function copyFile(source, target) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyTopLevelFiles() {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!topLevelFilePattern.test(entry.name) && !requiredTopLevelFiles.includes(entry.name)) continue;
    copyFile(path.join(root, entry.name), path.join(outDir, entry.name));
  }
}

function copyHandbookFiles() {
  for (const file of handbookFiles) {
    const source = path.join(__dirname, file);
    if (!fs.existsSync(source)) {
      throw new Error(`Missing deploy asset: handbook/${file}`);
    }
    copyFile(source, path.join(handbookOutDir, file));
  }
}

function assertOutput() {
  const requiredFiles = [
    ".nojekyll",
    "README.md",
    "COVERAGE.md",
    "handbook/index.html",
    "handbook/styles.css",
    "handbook/app.js",
    "handbook/study-layer.js",
    "handbook/formula-data.js",
    "handbook/preview.png"
  ];
  for (const file of requiredFiles) {
    const filePath = path.join(outDir, file);
    if (!fs.existsSync(filePath)) throw new Error(`Missing prepared Pages file: ${file}`);
  }
}

function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(handbookOutDir, { recursive: true });
  copyTopLevelFiles();
  copyHandbookFiles();
  assertOutput();
  console.log(`pages-prepare-ok ${path.relative(root, outDir)} files=${countFiles(outDir)}`);
}

function countFiles(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countFiles(filePath);
    else count += 1;
  }
  return count;
}

main();
