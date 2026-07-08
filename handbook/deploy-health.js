const assert = require("assert");
const https = require("https");
const dns = require("dns");
const { execFileSync } = require("child_process");
const { URL } = require("url");
const packageJson = require("../package.json");

const expectedVersion = packageJson.version;
const expectedRepo = "ULing19/Codex-for-learning-math";
const baseUrl = (process.env.DEPLOY_HEALTH_BASE_URL || packageJson.homepage).replace(/\/+$/, "");
const apiBaseUrl = (process.env.GITHUB_API_BASE_URL || "https://api.github.com").replace(/\/+$/, "");
const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const skipWorkflowAudit = /^(1|true|yes)$/i.test(process.env.DEPLOY_HEALTH_SKIP_WORKFLOWS || "");

function requestOnce(url, { json = false, redirects = 0 } = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const headers = {
      "Accept": json ? "application/vnd.github+json" : "*/*",
      "User-Agent": `${packageJson.name}/deploy-health`,
      "X-GitHub-Api-Version": "2022-11-28"
    };
    if (json && githubToken) headers.Authorization = `Bearer ${githubToken}`;

    const requestOptions = {
      method: "GET",
      headers,
      family: 4,
      lookup: dns.lookup,
      timeout: 30000
    };

    const req = https.request(target, requestOptions, (res) => {
      const location = res.headers.location;
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && location && redirects < 5) {
        res.resume();
        const nextUrl = new URL(location, target).toString();
        requestOnce(nextUrl, { json, redirects: redirects + 1 }).then(resolve, reject);
        return;
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`${url} returned ${res.statusCode}: ${body.slice(0, 300)}`));
          return;
        }
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: json ? JSON.parse(body) : body
          });
        } catch (error) {
          reject(new Error(`${url} returned invalid JSON: ${error.message}`));
        }
      });
    });
    req.on("timeout", () => req.destroy(new Error(`${url} timed out`)));
    req.on("error", reject);
    req.end();
  });
}

async function request(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await requestOnce(url, options);
    } catch (error) {
      lastError = error;
      if (!/ECONNRESET|ETIMEDOUT|timed out|socket hang up/i.test(error.message) || attempt === 3) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
    }
  }
  if (!options.json && process.platform === "win32") {
    return requestViaPowerShell(url);
  }
  throw lastError;
}

function requestViaPowerShell(url) {
  const script = [
    "$ProgressPreference='SilentlyContinue'",
    "[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new($false)",
    "$r=Invoke-WebRequest -Uri $env:DEPLOY_HEALTH_URL -UseBasicParsing -TimeoutSec 30",
    "$content=$r.Content",
    "$encoding='text'",
    "if ($content -is [byte[]]) { $content=[Convert]::ToBase64String($content); $encoding='base64' }",
    "[pscustomobject]@{statusCode=[int]$r.StatusCode; body=[string]$content; encoding=$encoding} | ConvertTo-Json -Compress"
  ].join("; ");
  const output = execFileSync("powershell.exe", ["-NoProfile", "-Command", script], {
    encoding: "utf8",
    env: { ...process.env, DEPLOY_HEALTH_URL: url },
    maxBuffer: 20 * 1024 * 1024
  });
  const result = JSON.parse(output);
  if (result.statusCode < 200 || result.statusCode >= 300) {
    throw new Error(`${url} returned ${result.statusCode} via PowerShell`);
  }
  return {
    statusCode: result.statusCode,
    headers: {},
    body: result.body
  };
}

function localAssetTargets(html) {
  return [
    ...html.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi),
    ...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi),
    ...html.matchAll(/<meta\b[^>]*\bproperty=["']og:image["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi)
  ].map((match) => match[1]).filter((target) => target.startsWith("./"));
}

function assetUrl(target) {
  return new URL(target, `${baseUrl}/`).toString();
}

function workflowSummary(runs) {
  const byName = new Map();
  for (const run of runs) {
    if (!byName.has(run.name)) byName.set(run.name, run);
  }
  return byName;
}

async function checkGitHubState() {
  const pages = (await request(`${apiBaseUrl}/repos/${expectedRepo}/pages`, { json: true })).body;
  assert.strictEqual(pages.build_type, "workflow", "GitHub Pages should use workflow deployment");
  assert.strictEqual(pages.status, "built", "GitHub Pages status should be built");
  assert.strictEqual(pages.html_url, "https://uling19.github.io/Codex-for-learning-math/", "Pages URL should match project homepage root");

  const ref = (await request(`${apiBaseUrl}/repos/${expectedRepo}/git/ref/heads/main`, { json: true })).body;
  const headSha = ref.object.sha;
  assert(/^[0-9a-f]{40}$/.test(headSha), "main ref should expose a commit SHA");
  if (skipWorkflowAudit) return { headSha, workflowsSkipped: true };

  const runsUrl = `${apiBaseUrl}/repos/${expectedRepo}/actions/runs?head_sha=${encodeURIComponent(headSha)}&per_page=20`;
  const runs = (await request(runsUrl, { json: true })).body.workflow_runs || [];
  const workflows = workflowSummary(runs);
  for (const name of ["Verify handbook", "Deploy Pages"]) {
    const run = workflows.get(name);
    assert(run, `Missing workflow run for ${name} on ${headSha}`);
    assert.strictEqual(run.status, "completed", `${name} should be completed`);
    assert.strictEqual(run.conclusion, "success", `${name} should pass`);
  }
  return { headSha, workflows };
}

async function checkGitHubStateIfAvailable() {
  try {
    return await checkGitHubState();
  } catch (error) {
    if (!githubToken && /\/pages returned 404/.test(error.message)) {
      return {
        skipped: true,
        reason: "GitHub Pages API needs GITHUB_TOKEN or GH_TOKEN for this repository"
      };
    }
    throw error;
  }
}

async function checkLiveSite() {
  const index = await request(`${baseUrl}/`);
  const html = index.body;
  assert(html.includes("考研数学一"), "Live index should contain the handbook title");
  assert(html.includes("formula-data.js"), "Live index should load formula-data.js");
  assert(html.includes("app.js"), "Live index should load app.js");

  const versionMeta = html.match(/<meta\s+name=["']app-version["']\s+content=["']([^"']+)["']\s*\/?>/i);
  assert(versionMeta, "Live index should expose app-version meta");
  assert.strictEqual(versionMeta[1], expectedVersion, "Live app-version should match package.json");

  const assets = localAssetTargets(html);
  assert(assets.length >= 5, "Live index should expose versioned local assets");
  for (const required of ["./styles.css", "./study-layer.js", "./formula-data.js", "./app.js", "./preview.png"]) {
    assert(assets.some((target) => target.startsWith(`${required}?`)), `Live index should reference ${required}`);
  }
  for (const target of assets) {
    assert(target.includes(`v=${expectedVersion}`), `Live asset should include v=${expectedVersion}: ${target}`);
    const response = await request(assetUrl(target));
    assert(response.body.length > 100, `Live asset should not be empty: ${target}`);
  }
  return { assets: assets.length, indexBytes: html.length };
}

async function main() {
  const github = await checkGitHubStateIfAvailable();
  const live = await checkLiveSite();
  const githubPart = github.skipped
    ? `github=skipped(${github.reason})`
    : `sha=${github.headSha.slice(0, 7)}${github.workflowsSkipped ? " workflows=skipped" : ""}`;
  console.log(`deploy-health-ok ${githubPart} version=${expectedVersion} assets=${live.assets} indexBytes=${live.indexBytes}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
