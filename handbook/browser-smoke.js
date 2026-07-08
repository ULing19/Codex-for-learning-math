const http = require("http");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch (error) {
  console.error("browser-smoke requires Playwright. Run: npm install --no-save playwright@1.61.1");
  console.error(error.message);
  process.exit(1);
}

const root = __dirname;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function findSystemChromium() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function launchChromium() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    const executablePath = findSystemChromium();
    if (!executablePath) throw error;
    console.warn(`Playwright-managed Chromium unavailable; using system browser: ${executablePath}`);
    return chromium.launch({ headless: true, executablePath });
  }
}

function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const safePath = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
    const filePath = path.resolve(root, safePath);
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
      response.end(data);
    });
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

async function runViewport(browser, baseUrl, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const appErrors = [];
  const failedLocalRequests = [];

  page.on("pageerror", (error) => appErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource/.test(message.text())) {
      appErrors.push(message.text());
    }
  });
  page.on("requestfailed", (request) => {
    const requestUrl = request.url();
    if (requestUrl.startsWith(baseUrl)) {
      failedLocalRequests.push(`${requestUrl}: ${request.failure()?.errorText || "failed"}`);
    }
  });

  await page.goto(`${baseUrl}/?browser-smoke=${viewport.name}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("#formulaList .formula-card", { timeout: 30000 });
  await page.waitForTimeout(2200);

  const initial = await page.evaluate(() => ({
    cards: document.querySelectorAll("#formulaList .formula-card").length,
    studyBlocks: document.querySelectorAll(".db-study").length,
    labs: document.querySelectorAll("#labsGrid .lab-card").length,
    mathErrors: document.querySelectorAll("mjx-merror").length,
    hasStudyLayer: Boolean(window.FORMULA_STUDY_LAYER?.buildStudyLayer),
    mathJaxLoaded: Boolean(window.MathJax?.typesetPromise),
    bottomNavVisible: getComputedStyle(document.querySelector(".bottom-nav")).display !== "none"
  }));

  assert.strictEqual(initial.cards, 494, `${viewport.name}: should render 494 formula cards`);
  assert.strictEqual(initial.studyBlocks, 494, `${viewport.name}: should render one study layer per card`);
  assert.strictEqual(initial.mathErrors, 0, `${viewport.name}: MathJax should not report formula errors`);
  assert.strictEqual(initial.hasStudyLayer, true, `${viewport.name}: study-layer.js should load`);

  const accessibility = await page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const seenIds = new Set();
    const duplicateIds = new Set();
    document.querySelectorAll("[id]").forEach((element) => {
      if (seenIds.has(element.id)) duplicateIds.add(element.id);
      seenIds.add(element.id);
    });
    const unnamedButtons = [...document.querySelectorAll("button")]
      .filter((button) => visible(button))
      .filter((button) => !(button.getAttribute("aria-label") || button.getAttribute("title") || button.textContent).trim())
      .map((button) => button.id || button.className || button.outerHTML.slice(0, 80));
    const search = document.querySelector("#searchInput");
    const searchName = [search?.getAttribute("aria-label"), search?.getAttribute("placeholder"), search?.closest("label")?.textContent]
      .filter(Boolean)
      .join(" ")
      .trim();
    return {
      duplicateIds: [...duplicateIds],
      unnamedButtons,
      searchHasName: searchName.length > 0,
      labCardsKeyboardReady: [...document.querySelectorAll("#labsGrid .lab-card")]
        .every((card) => card.getAttribute("role") === "button" && Number(card.getAttribute("tabindex")) === 0)
    };
  });
  assert.deepStrictEqual(accessibility.duplicateIds, [], `${viewport.name}: DOM should not contain duplicate ids`);
  assert.deepStrictEqual(accessibility.unnamedButtons, [], `${viewport.name}: visible buttons should have accessible text, title, or aria-label`);
  assert.strictEqual(accessibility.searchHasName, true, `${viewport.name}: search input should have an accessible name`);
  assert.strictEqual(accessibility.labCardsKeyboardReady, true, `${viewport.name}: lab cards should be keyboard reachable`);

  await page.keyboard.press("/");
  const searchFocused = await page.evaluate(() => document.activeElement?.id === "searchInput");
  assert.strictEqual(searchFocused, true, `${viewport.name}: / should focus search input`);
  await page.keyboard.press("Escape");
  const searchBlurred = await page.evaluate(() => document.activeElement?.id !== "searchInput");
  assert.strictEqual(searchBlurred, true, `${viewport.name}: Esc should blur search input`);

  if (viewport.mobile) {
    await page.click("#mobileMenuBtn");
    await page.waitForSelector(".sidebar.open", { timeout: 10000 });
    const sidebar = await page.evaluate(() => {
      const nav = document.querySelector("#chapterNav");
      const buttons = [...nav.querySelectorAll("button")];
      const lastButton = buttons.at(-1);
      nav.scrollTop = nav.scrollHeight;
      const navRect = nav.getBoundingClientRect();
      const lastRect = lastButton.getBoundingClientRect();
      return {
        sidebarOpen: document.querySelector("#sidebar").classList.contains("open"),
        overlayVisible: getComputedStyle(document.querySelector("#sidebarOverlay")).display !== "none",
        navScrollable: nav.scrollHeight > nav.clientHeight,
        lastVisibleAfterScroll: lastRect.bottom <= navRect.bottom + 1 && lastRect.top >= navRect.top - 1
      };
    });
    assert.strictEqual(sidebar.sidebarOpen, true, `${viewport.name}: sidebar should open`);
    assert.strictEqual(sidebar.overlayVisible, true, `${viewport.name}: sidebar overlay should be visible`);
    assert.strictEqual(sidebar.navScrollable, true, `${viewport.name}: chapter nav should scroll`);
    assert.strictEqual(sidebar.lastVisibleAfterScroll, true, `${viewport.name}: last chapter should be visible after scroll`);
    await page.click("#sidebarOverlay");
    await page.waitForFunction(() => !document.querySelector("#sidebar")?.classList.contains("open"));

    const bottomNavHitTarget = await page.evaluate(() => {
      const button = document.querySelector(".bottom-nav [data-view='labs']");
      const rect = button.getBoundingClientRect();
      const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return {
        visible: getComputedStyle(button).display !== "none",
        largeEnough: rect.width >= 44 && rect.height >= 44,
        topHit: target === button || button.contains(target)
      };
    });
    assert.strictEqual(bottomNavHitTarget.visible, true, `${viewport.name}: bottom lab navigation should be visible`);
    assert.strictEqual(bottomNavHitTarget.largeEnough, true, `${viewport.name}: bottom lab navigation should meet touch target size`);
    assert.strictEqual(bottomNavHitTarget.topHit, true, `${viewport.name}: bottom lab navigation should be the top hit target`);
  }

  await page.click(viewport.labSelector);
  await page.waitForSelector("#viewLabs:not(.hidden)", { timeout: 10000 });
  const labGrid = await page.evaluate(() => ({
    labCards: document.querySelectorAll("#labsGrid .lab-card").length,
    buttonText: document.querySelector("#labsGrid .lab-card .lab-link-btn")?.textContent.trim(),
    keyboardReady: [...document.querySelectorAll("#labsGrid .lab-card")]
      .filter((card) => card.getAttribute("role") === "button" && Number(card.getAttribute("tabindex")) === 0).length,
    labTypes: [...document.querySelectorAll("#labsGrid .lab-card")].map((card) => card.dataset.lab)
  }));
  assert(labGrid.labCards >= 15, `${viewport.name}: lab grid should expose all lab types`);
  assert.strictEqual(labGrid.buttonText, "打开实验室演示", `${viewport.name}: lab CTA should be explicit`);
  assert.strictEqual(labGrid.keyboardReady, labGrid.labCards, `${viewport.name}: every lab card should support keyboard activation`);

  const labIndices = viewport.mobile
    ? [...new Set([0, labGrid.labCards - 1])]
    : Array.from({ length: labGrid.labCards }, (_, index) => index);
  const openedLabs = [];
  let labOpen = null;
  for (const index of labIndices) {
    if (openedLabs.length) {
      await page.click(viewport.labSelector);
      await page.waitForSelector("#viewLabs:not(.hidden)", { timeout: 10000 });
    }
    const labCard = page.locator("#labsGrid .lab-card").nth(index);
    const labType = await labCard.getAttribute("data-lab");
    if (!labType) throw new Error(`${viewport.name}: lab card ${index} should have a data-lab type`);
    if (openedLabs.length === 0) {
      await labCard.focus();
      await page.keyboard.press("Enter");
    } else {
      await labCard.click();
    }
    await page.waitForFunction((expectedType) => {
      const demo = document.querySelector(`.demo-box[data-demo="${expectedType}"][data-mounted="true"]`);
      return Boolean(demo && demo.closest(".formula-card"));
    }, labType, { timeout: 10000 });
    labOpen = await page.evaluate((expectedType) => {
      const demo = document.querySelector(`.demo-box[data-demo="${expectedType}"][data-mounted="true"]`);
      return {
        labType: expectedType,
        labsHidden: document.querySelector("#viewLabs")?.classList.contains("hidden"),
        cardsHidden: document.querySelector("#viewCards")?.classList.contains("hidden"),
        filteredCards: document.querySelectorAll("#formulaList .formula-card").length,
        openedDetails: demo?.closest("details")?.open,
        mountedDemos: document.querySelectorAll(".demo-box[data-mounted=\"true\"]").length,
        demoTextLength: demo?.textContent.trim().length || 0,
        studyBlocks: document.querySelectorAll(".db-study").length,
        resultInfo: document.querySelector("#resultsInfo")?.textContent.trim()
      };
    }, labType);

    assert.strictEqual(labOpen.labsHidden, true, `${viewport.name}: opening ${labType} should leave lab grid`);
    assert.strictEqual(labOpen.cardsHidden, false, `${viewport.name}: opening ${labType} should show formula cards`);
    assert(labOpen.filteredCards > 0, `${viewport.name}: ${labType} filter should show related cards`);
    assert.strictEqual(labOpen.openedDetails, true, `${viewport.name}: ${labType} should auto-open first card details`);
    assert(labOpen.mountedDemos > 0, `${viewport.name}: ${labType} should mount a demo immediately`);
    assert(labOpen.demoTextLength > 100, `${viewport.name}: ${labType} demo should contain teaching content`);
    assert(labOpen.studyBlocks > 0, `${viewport.name}: study layer should survive ${labType} filtering`);
    assert(/实验室演示/.test(labOpen.resultInfo), `${viewport.name}: result info should explain ${labType} opening`);
    openedLabs.push(labType);
  }

  if (appErrors.length || failedLocalRequests.length) {
    throw new Error(`${viewport.name}: ${appErrors.concat(failedLocalRequests).join(" | ")}`);
  }

  await page.close();
  return { viewport: viewport.name, initial, labGrid, labOpen, openedLabs };
}

(async () => {
  const remoteBaseUrl = process.env.BROWSER_SMOKE_BASE_URL
    ? process.env.BROWSER_SMOKE_BASE_URL.replace(/\/+$/, "")
    : "";
  const server = remoteBaseUrl ? null : createServer();
  const port = server ? await listen(server) : null;
  const baseUrl = remoteBaseUrl || `http://127.0.0.1:${port}`;
  const browser = await launchChromium();
  try {
    const results = [];
    results.push(await runViewport(browser, baseUrl, {
      name: "desktop",
      width: 1366,
      height: 768,
      labSelector: ".qnav-btn[data-view=\"labs\"]"
    }));
    results.push(await runViewport(browser, baseUrl, {
      name: "mobile",
      width: 390,
      height: 844,
      mobile: true,
      labSelector: ".bottom-nav [data-view=\"labs\"]"
    }));
    console.log(`browser-smoke-ok ${results.map((item) => `${item.viewport}:cards=${item.initial.cards},labs=${item.labGrid.labCards},opened=${item.openedLabs.length},demos=${item.labOpen.mountedDemos}`).join(" ")}`);
  } finally {
    await browser.close();
    if (server) server.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
