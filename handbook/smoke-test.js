const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const studyLayer = fs.readFileSync(path.join(root, "study-layer.js"), "utf8");
const data = fs.readFileSync(path.join(root, "formula-data.js"), "utf8");

const htmlIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]));
const appIdRefs = new Set([...app.matchAll(/\$\("([^"]+)"\)/g)].map(match => match[1]));

// jump-toast is created dynamically by JS — exempt from static HTML check
const dynamicIds = new Set(["jump-toast"]);
const missingIds = [...appIdRefs].filter(id => !htmlIds.has(id) && !dynamicIds.has(id));

if (missingIds.length) {
  throw new Error(`app.js references missing DOM ids: ${missingIds.join(", ")}`);
}

const requiredIds = [
  "dashStats", "dashFill", "dashHint",
  "cardCount", "mustCount", "knownCount", "labCount",
  "formulaList", "labsGrid", "reviewQueue", "errorCards",
  "searchInput", "heroRecommend", "clearLocalDataBtn"
];

for (const id of requiredIds) {
  if (!htmlIds.has(id)) throw new Error(`index.html is missing required id: ${id}`);
}

class FakeClassList {
  constructor() { this.items = new Set(); }
  add(...names)    { names.forEach(n => this.items.add(n)); }
  remove(...names) { names.forEach(n => this.items.delete(n)); }
  toggle(name, force) {
    const add = force === undefined ? !this.items.has(name) : Boolean(force);
    add ? this.items.add(name) : this.items.delete(name);
    return add;
  }
  contains(name) { return this.items.has(name); }
}

class FakeElement {
  constructor(tagName = "div", id = "") {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.listeners = {};
    this.classList = new FakeClassList();
    this._innerHTML = "";
    this.textContent = "";
    this.value = "all";
    this.isContentEditable = false;
  }
  set innerHTML(value) { this._innerHTML = String(value ?? ""); }
  get innerHTML() { return this._innerHTML; }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  setAttribute(name, value) { this[name] = value; }
  querySelectorAll() { return []; }
  querySelector() { return null; }
  closest() { return null; }
  scrollIntoView() {}
  focus() {}
  blur() {}
}

const elements = new Map([...htmlIds].map(id => [id, new FakeElement("div", id)]));

for (const match of html.matchAll(/<select id="([^"]+)"/g)) {
  elements.get(match[1]).tagName = "SELECT";
}
for (const match of html.matchAll(/<input id="([^"]+)"/g)) {
  elements.get(match[1]).tagName = "INPUT";
}

const selectorCounts = {
  ".qnav-btn, .bnav-btn[data-view]": 8,
  ".error-tag": 8,
  ".chapter-nav button": 1,
  ".formula-list": 3
};

const fakeDocument = {
  getElementById(id) { return elements.get(id) || null; },
  createElement(tagName) { return new FakeElement(tagName); },
  addEventListener(type, handler) {
    if (type === "DOMContentLoaded") handler();
  },
  querySelectorAll(selector) {
    const count = selectorCounts[selector] || 0;
    return Array.from({ length: count }, () => new FakeElement("button"));
  },
  querySelector(selector) {
    if (selector === ".chapter-nav button") return new FakeElement("button");
    if (selector === ".formula-card") return new FakeElement("article");
    return null;
  }
};

const fakeBody = new FakeElement("body");
fakeBody.appendChild = (el) => { fakeBody.children.push(el); return el; };

const sandbox = {
  window: {
    scrollTo() {},
    MathJax: { typesetPromise: () => Promise.resolve() }
  },
  document: { ...fakeDocument, body: fakeBody, activeElement: { tagName: "BODY" } },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  requestAnimationFrame: (fn) => fn(),
  console, Math, setTimeout, clearTimeout
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);
vm.runInContext(studyLayer, sandbox, { filename: "study-layer.js" });
vm.runInContext(data, sandbox, { filename: "formula-data.js" });
vm.runInContext(app, sandbox, { filename: "app.js" });

// ── assertions ────────────────────────────────────────────────────────────────
const cardCount = Number(elements.get("cardCount").textContent);
if (!Number.isFinite(cardCount) || cardCount <= 0)
  throw new Error("cardCount was not populated during init");

const labCount = Number(elements.get("labCount").textContent);
if (!Number.isFinite(labCount) || labCount <= 0)
  throw new Error("labCount was not populated during init");

if (!elements.get("formulaList").innerHTML.includes("formula-card"))
  throw new Error("formulaList did not render formula cards");

if (!elements.get("formulaList").innerHTML.includes("db-study"))
  throw new Error("formula cards did not render the study layer");

if (!elements.get("heroRecommend").innerHTML)
  throw new Error("heroRecommend was not populated during init");

console.log(`smoke-ok cards=${cardCount} labs=${labCount}`);
