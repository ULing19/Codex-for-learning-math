const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const handbookRoot = __dirname;
const errors = [];
const ignoredDirs = new Set([".git", ".claude", ".pages-artifact", ".playwright-cli", "node_modules"]);

const externalPattern = /^(?:https?:|mailto:|data:|javascript:)/i;

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function listFiles(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFiles(filePath, predicate, out);
    } else if (predicate(filePath)) {
      out.push(filePath);
    }
  }
  return out;
}

function stripDecorations(target) {
  let value = String(target || "").trim();
  if (value.startsWith("<") && value.endsWith(">")) value = value.slice(1, -1);
  const hashIndex = value.indexOf("#");
  if (hashIndex >= 0) value = value.slice(0, hashIndex);
  const queryIndex = value.indexOf("?");
  if (queryIndex >= 0) value = value.slice(0, queryIndex);
  try {
    value = decodeURIComponent(value);
  } catch (_) {
  }
  return value.trim();
}

function checkLocalTarget(sourceFile, rawTarget, label) {
  const cleaned = stripDecorations(rawTarget);
  if (!cleaned || cleaned.startsWith("#") || externalPattern.test(cleaned)) return;
  if (/^[a-z]:/i.test(cleaned) || cleaned.startsWith("\\\\")) {
    errors.push(`${label}: ${toPosix(path.relative(root, sourceFile))} uses absolute local path ${rawTarget}`);
    return;
  }
  const targetPath = path.resolve(path.dirname(sourceFile), cleaned);
  if (!targetPath.startsWith(root)) {
    errors.push(`${label}: ${toPosix(path.relative(root, sourceFile))} escapes repo with ${rawTarget}`);
    return;
  }
  if (!fs.existsSync(targetPath)) {
    errors.push(`${label}: ${toPosix(path.relative(root, sourceFile))} points to missing ${rawTarget}`);
  }
}

function checkMarkdownLinks() {
  const mdFiles = listFiles(root, (filePath) => filePath.endsWith(".md"));
  const linkPattern = /!?\[[^\]]*]\(([^)\n]+)\)/g;
  for (const filePath of mdFiles) {
    const text = readUtf8(filePath);
    for (const match of text.matchAll(linkPattern)) {
      checkLocalTarget(filePath, match[1], "markdown-link");
    }
  }
  return mdFiles.length;
}

function checkHtmlLinks() {
  const htmlFiles = listFiles(handbookRoot, (filePath) => filePath.endsWith(".html"));
  const attrPattern = /\b(?:href|src)=["']([^"']+)["']/g;
  for (const filePath of htmlFiles) {
    const text = readUtf8(filePath);
    for (const match of text.matchAll(attrPattern)) {
      checkLocalTarget(filePath, match[1], "html-asset");
    }
  }
  return htmlFiles.length;
}

function checkVersionedHtmlAssets(packageVersion) {
  const indexPath = path.join(handbookRoot, "index.html");
  const text = readUtf8(indexPath);
  const expectedVersion = `v=${packageVersion}`;
  const versionMeta = text.match(/<meta\s+name=["']app-version["']\s+content=["']([^"']+)["']\s*\/?>/i);
  if (!versionMeta) {
    errors.push("html-version: handbook/index.html is missing meta name=\"app-version\"");
  } else if (versionMeta[1] !== packageVersion) {
    errors.push(`html-version: app-version should be ${packageVersion}, got ${versionMeta[1]}`);
  }

  const versionedTargets = [
    ...text.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi),
    ...text.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi),
    ...text.matchAll(/<meta\b[^>]*\bproperty=["']og:image["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi)
  ].map((match) => match[1])
    .filter((target) => target.startsWith("./"));

  for (const target of versionedTargets) {
    if (!target.includes(`?${expectedVersion}`) && !target.includes(`&${expectedVersion}`)) {
      errors.push(`html-version: ${target} should include ?${expectedVersion}`);
    }
  }
}

function checkPackageMetadata() {
  const pkg = JSON.parse(readUtf8(path.join(root, "package.json")));
  assert.strictEqual(pkg.private, false, "package.json should be publish-safe/open-source marked with private=false");
  assert.strictEqual(pkg.license, "MIT", "package.json license should be MIT");
  assert.strictEqual(pkg.homepage, "https://uling19.github.io/Codex-for-learning-math/handbook/", "package.json homepage should point to GitHub Pages handbook");
  assert.deepStrictEqual(pkg.repository, {
    type: "git",
    url: "git+https://github.com/ULing19/Codex-for-learning-math.git"
  }, "package.json repository should point to the GitHub repo");
  assert.deepStrictEqual(pkg.bugs, {
    url: "https://github.com/ULing19/Codex-for-learning-math/issues"
  }, "package.json bugs should point to GitHub issues");
  assert.strictEqual(pkg.engines?.node, ">=24", "package.json engines.node should stay aligned to CI");
  const nvmrc = readUtf8(path.join(root, ".nvmrc")).trim();
  assert.strictEqual(nvmrc, "24", ".nvmrc should stay aligned to package engines and CI");

  const requiredScripts = [
    "check:syntax",
    "validate",
    "docs",
    "coverage",
    "generated:check",
    "smoke",
    "quality",
    "links",
    "pages:prepare",
    "verify",
    "verify:browser",
    "verify:browser:live",
    "verify:deploy"
  ];
  for (const script of requiredScripts) {
    assert(pkg.scripts?.[script], `package.json should define npm script ${script}`);
  }
  assert(pkg.scripts["check:syntax"].includes("handbook/link-check.js"), "check:syntax should include link-check.js");
  assert(pkg.scripts["check:syntax"].includes("handbook/prepare-pages.js"), "check:syntax should include prepare-pages.js");
  assert(pkg.scripts["check:syntax"].includes("handbook/deploy-health.js"), "check:syntax should include deploy-health.js");
  assert(pkg.scripts["check:syntax"].includes("handbook/generated-check.js"), "check:syntax should include generated-check.js");
  assert(pkg.scripts["check:syntax"].includes("handbook/repo-hygiene.js"), "check:syntax should include repo-hygiene.js");
  assert(pkg.scripts.verify.includes("npm run generated:check"), "verify should include npm run generated:check");
  assert(pkg.scripts.verify.includes("npm run repo:hygiene"), "verify should include npm run repo:hygiene");
  assert(pkg.scripts.verify.includes("npm run links"), "verify should include npm run links");
  assert(pkg.scripts.verify.includes("npm run pages:prepare"), "verify should include npm run pages:prepare");
  return pkg;
}

function checkRequiredProjectFiles() {
  const requiredFiles = [
    ".github/workflows/pages.yml",
    ".github/workflows/verify.yml",
    ".nojekyll",
    ".nvmrc",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "COVERAGE.md",
    "LICENSE",
    "README.md",
    "RELEASE_CHECKLIST.md",
    "SECURITY.md",
    "handbook/README.md",
    "handbook/index.html",
    "handbook/app.js",
    "handbook/styles.css",
    "handbook/formula-data.js",
    "handbook/generated-check.js",
    "handbook/repo-hygiene.js",
    "handbook/prepare-pages.js",
    "handbook/deploy-health.js",
    "handbook/study-layer.js",
    "handbook/preview.png"
  ];
  for (const file of requiredFiles) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) errors.push(`required-file: missing ${file}`);
  }
}

function main() {
  const markdownFiles = checkMarkdownLinks();
  const htmlFiles = checkHtmlLinks();
  const pkg = checkPackageMetadata();
  checkVersionedHtmlAssets(pkg.version);
  checkRequiredProjectFiles();
  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log(`links-ok markdown=${markdownFiles} html=${htmlFiles}`);
}

main();
