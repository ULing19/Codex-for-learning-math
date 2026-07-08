(function () {
  const cards = window.FORMULA_CARDS || [];
  const groups = window.FORMULA_GROUPS || [];
  const state = {
    query: "",
    importance: "all",
    tag: "all",
    chapter: "all",
    labType: "all",
    mastery: "all",
    reviewMode: false,
    flashMode: false,
    onlyInteractive: false,
    view: "cards",
    errorType: ""
  };
  const originalIndex = new Map(cards.map((card, i) => [card.id, i]));
  const cardById = new Map(cards.map((card) => [card.id, card]));
  const subjectIndex = new Map(groups.map((g, i) => [g.subject, i]));
  const chapterIndex = new Map(groups.flatMap((g) => g.chapters.map((ch, i) => [`${g.subject}::${ch}`, i])));

  // 预计算搜索文本：避免每次筛选都对 494 张卡 join 13 个字段 + toLowerCase
  cards.forEach((card) => {
    card._searchText = [card.subject, card.chapter, card.section, card.title, card.latex,
      card.importance, card.tags.join(" "), card.conditions, card.intuition,
      card.howToUse, card.miniProof, card.example, card.mistakes].join(" ").toLowerCase();
  });

  // ── 运行时关联表（补充 formula-data.js 里稀少的 relatedFormulas）──────────────
  // 格式：id -> [relatedId, ...]  双向会自动展开
  const EXTRA_RELATIONS = {
    // 等价无穷小 ↔ Taylor 主项
    "calc1-equivalent-infinitesimal": ["calc1-taylor-principal","calc1-limits-lhopital"],
    "calc1-taylor-principal":         ["calc1-equivalent-infinitesimal","calc3-taylor"],
    "calc3-taylor":                   ["calc1-taylor-principal","calc1-equivalent-infinitesimal"],
    // 积化和差 ↔ 三角积分
    "pre-trig-product-sum":           ["pre-trig-core","calc4-trig-integral","pre-trig-double-half"],
    "calc4-trig-integral":            ["pre-trig-product-sum","cold-wallis","pre-trig-double-half"],
    "pre-trig-double-half":           ["pre-trig-core","pre-trig-product-sum"],
    // Wallis ↔ Beta/Gamma
    "cold-wallis":                    ["calc5-improper-gamma-beta","calc4-trig-integral"],
    "calc5-improper-gamma-beta":      ["cold-wallis"],
    // 正定 ↔ 特征值 ↔ 二次型
    "linear4-eigenvalue-definition":  ["linear5-eigenvalue-quick-properties","linear5-positive-definite","linear4-diag"],
    "linear5-positive-definite":      ["linear4-eigenvalue-definition","linear5-quadratic-form","linear5-eigenvalue-quick-properties"],
    "linear5-quadratic-form":         ["linear5-positive-definite","linear4-eigenvalue-definition"],
    "linear5-eigenvalue-quick-properties": ["linear4-eigenvalue-definition","linear5-positive-definite"],
    // 条件概率 ↔ Bayes ↔ 全概率
    "prob1-conditional":              ["prob1-total-probability","prob1-bayes"],
    "prob1-total-probability":        ["prob1-conditional","prob1-bayes"],
    "prob1-bayes":                    ["prob1-conditional","prob1-total-probability"],
    // Green ↔ Gauss ↔ Stokes
    "calc10-green-gauss-stokes":      ["calc10-surface-integral","calc9-line-integral"],
    "calc9-line-integral":            ["calc10-green-gauss-stokes"],
    "calc10-surface-integral":        ["calc10-green-gauss-stokes"],
    // 极限基础 ↔ 洛必达
    "calc1-limits-lhopital":          ["calc1-equivalent-infinitesimal","calc1-taylor-principal"],
    // CLT ↔ 大数定律
    "prob5-clt-standardization":      ["prob5-chebyshev-markov-expanded","prob5-clt-standardization"],
    "prob5-chebyshev-markov-expanded":["prob5-clt-standardization"],
  };
  // build merged relation map: formula-data.js + EXTRA_RELATIONS
  const relMap = new Map();
  cards.forEach(c => {
    const base = c.relatedFormulas && c.relatedFormulas.length ? [...c.relatedFormulas] : [];
    const extra = EXTRA_RELATIONS[c.id] || [];
    const merged = [...new Set([...base, ...extra])].filter(id => id !== c.id);
    if (merged.length) relMap.set(c.id, merged);
  });
  // propagate: if A -> B, also add B -> A
  relMap.forEach((targets, src) => {
    targets.forEach(tgt => {
      if (!relMap.has(tgt)) relMap.set(tgt, []);
      if (!relMap.get(tgt).includes(src)) relMap.get(tgt).push(src);
    });
  });

  // ── mastery storage ──────────────────────────────────────────────────────────
  // 0 = 未学  1 = 认识  2 = 掌握
  const MASTERY_KEY = "math1_mastery_v1";
  const FAVORITE_KEY = "math1_favorites_v1";
  let mastery = {};
  let favorites = new Set();
  try { mastery = JSON.parse(localStorage.getItem(MASTERY_KEY) || "{}"); } catch (_) {}
  try { favorites = new Set(JSON.parse(localStorage.getItem(FAVORITE_KEY) || "[]")); } catch (_) {}
  const saveMastery = () => { try { localStorage.setItem(MASTERY_KEY, JSON.stringify(mastery)); } catch (_) {} };
  const saveFavorites = () => { try { localStorage.setItem(FAVORITE_KEY, JSON.stringify([...favorites])); } catch (_) {} };
  const getMastery = (id) => mastery[id] ?? 0;
  const setMastery = (id, level) => { mastery[id] = level; saveMastery(); };
  const isFavorite = (id) => favorites.has(id);
  const toggleFavorite = (id) => { isFavorite(id) ? favorites.delete(id) : favorites.add(id); saveFavorites(); };
  function clearLocalLearningData() {
    const ok = typeof window.confirm === "function"
      ? window.confirm("确认清除本浏览器中的掌握度和收藏数据？此操作不会影响公式内容。")
      : true;
    if (!ok) return;
    mastery = {};
    favorites = new Set();
    try {
      localStorage.removeItem(MASTERY_KEY);
      localStorage.removeItem(FAVORITE_KEY);
    } catch (_) {}
    focusedIndex = -1;
    renderMasteryStats();
    renderActiveView();
    setText("resultsInfo", "已清除本地掌握度和收藏数据。公式内容和线上站点不受影响。");
  }

  const MASTERY_LABEL = ["未学", "认识", "掌握"];
  const MASTERY_CLASS = ["m-new", "m-familiar", "m-known"];

  // ── utils ─────────────────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = value; };
  const setHtml = (id, value) => { const el = $(id); if (el) el.innerHTML = value; };
  const on = (id, event, handler) => { const el = $(id); if (el) el.addEventListener(event, handler); };
  const cssEscape = (value) => (window.CSS && CSS.escape)
    ? CSS.escape(value)
    : String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  const escapeHtml = (v) => String(v ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

  // hl(text, query) — escapeHtml first, then wrap matched query with <mark>
  // Safe: escapeHtml runs before any HTML injection.
  const hl = (v, q) => {
    const safe = escapeHtml(v);
    if (!q) return safe;
    const escaped = q.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safe.replace(new RegExp(escaped, "gi"), m => `<mark class="highlight">${m}</mark>`);
  };

  // ── keyboard navigation ──────────────────────────────────────────────────────
  let focusedIndex = -1;
  let currentItems = [];

  function getFocusedCard() {
    return focusedIndex >= 0 && focusedIndex < currentItems.length
      ? document.getElementById(currentItems[focusedIndex].id)
      : null;
  }

  function setFocus(idx) {
    // remove old highlight
    const old = getFocusedCard();
    if (old) old.classList.remove("kb-focus");
    focusedIndex = Math.max(0, Math.min(idx, currentItems.length - 1));
    const el = getFocusedCard();
    if (!el) return;
    el.classList.add("kb-focus");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  document.addEventListener("keydown", (e) => {
    const inInput = e.target.tagName === "INPUT" || e.target.tagName === "SELECT"
                 || e.target.tagName === "TEXTAREA" || e.target.isContentEditable;

    // Esc works everywhere
    if (e.key === "Escape") {
      if ($("sidebar")?.classList.contains("open")) { closeSidebar(); return; }
      if (inInput) { e.target.blur(); return; }
      // close the first open details in focused card, or any open details
      const card = getFocusedCard();
      const target = card || document.querySelector(".formula-card");
      if (target) {
        const det = target.querySelector("details[open]");
        if (det) { det.open = false; return; }
      }
      return;
    }

    // / focuses search (even if not in input)
    if (e.key === "/" && !inInput) {
      e.preventDefault();
      $("searchInput")?.focus();
      return;
    }

    // all other shortcuts: ignore when typing
    if (inInput) return;

    const card = getFocusedCard();
    switch (e.key) {
      case "j": case "ArrowDown": e.preventDefault(); setFocus(focusedIndex + 1); break;
      case "k": case "ArrowUp":   e.preventDefault(); setFocus(focusedIndex - 1); break;
      case " ": case "Enter": {
        // don't intercept Space/Enter if focus is on a button/link (let browser handle it)
        if (document.activeElement && document.activeElement !== document.body
            && ["BUTTON","A","SUMMARY"].includes(document.activeElement.tagName)) break;
        if (!card) { setFocus(0); break; }
        e.preventDefault();
        if (state.flashMode) {
          card.classList.toggle("flash-revealed");
        } else {
          const det = card.querySelector("details");
          if (det) det.open = !det.open;
        }
        break;
      }
      case "1": if (card) cycleMastery(card.id, 0); break;
      case "2": if (card) cycleMastery(card.id, 1); break;
      case "3": if (card) cycleMastery(card.id, 2); break;
      case "f": if (card) toggleFavoriteForCard(card.id); break;
      case "m": if (card) { cycleMastery(card.id, (getMastery(card.id) + 1) % 3); break; }
    }
  });

  function cycleMastery(id, level) {
    setMastery(id, level);
    const el = document.getElementById(id);
    if (el) updateMasteryButton(el, id);
    renderMasteryStats();
    if (state.view === "review") {
      renderReviewQueue();
    } else if (state.reviewMode) {
      // re-filter: remove card if now mastered
      renderCards();
    }
  }

  function updateMasteryButton(el, id) {
    const btn = el.querySelector(".mastery-btn");
    if (!btn) return;
    const lvl = getMastery(id);
    btn.className = `mastery-btn ${MASTERY_CLASS[lvl]}`;
    btn.textContent = `${MASTERY_LABEL[lvl]} (m)`;
    btn.setAttribute("aria-label", `掌握度：${MASTERY_LABEL[lvl]}`);
  }

  function updateFavoriteButton(el, id) {
    const btn = el.querySelector(".fav-btn");
    if (!btn) return;
    btn.classList.toggle("active", isFavorite(id));
    btn.textContent = isFavorite(id) ? "★" : "☆";
    btn.setAttribute("aria-label", isFavorite(id) ? "取消收藏" : "收藏");
  }

  function toggleFavoriteForCard(id) {
    toggleFavorite(id);
    const el = document.getElementById(id);
    if (el) updateFavoriteButton(el, id);
    if (state.view === "review") renderReviewQueue();
  }

  // ── init ──────────────────────────────────────────────────────────────────────
  function init() {
    setText("cardCount", cards.length);
    setText("mustCount", cards.filter(c => c.importance === "必背").length);
    setText("labCount", cards.filter(c => c.interactiveType && c.interactiveType !== "none").length);
    renderTags();
    renderNav();
    renderLabsGrid();
    renderErrorCards();
    renderReviewQueue();
    bindControls();
    switchView("cards");
    renderMasteryStats();
    renderTodayRecommendations();
  }

  // ── 今日推荐 ─────────────────────────────────────────────────────────────────
  // 关键词加分（考场高频）
  const HIGH_FREQ_KEYWORDS = ["等价无穷小","Taylor","洛必达","Wallis","Green","Gauss","正定","特征值","条件概率","Bayes","中心极限","拒绝域"];

  function pickTodayRecommendations() {
    const scored = cards
      .filter(c => getMastery(c.id) < 2)   // 未完全掌握
      .map(c => {
        let s = 0;
        if (c.importance === "必背") s += 40;
        if (c.importance === "常用") s += 20;
        if (getMastery(c.id) === 0) s += 15; // 完全未学
        if (c.interactiveType && c.interactiveType !== "none") s += 10;
        const hay = [c.title, c.tags.join(" "), c.section].join(" ");
        HIGH_FREQ_KEYWORDS.forEach(kw => { if (hay.includes(kw)) s += 8; });
        return { card: c, score: s };
      })
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(x => x.card);
  }

  function renderTodayRecommendations() {
    const el = $("heroRecommend");
    if (!el) return;
    const picks = pickTodayRecommendations();
    if (!picks.length) {
      el.innerHTML = `<div class="today-rec-empty">🎉 所有重点公式都已掌握，继续保持！</div>`;
      return;
    }
    el.innerHTML = `
      <div class="today-rec-title">📌 今日推荐复习</div>
      <div class="today-rec-list">
        ${picks.map(c => `
          <div class="today-rec-item">
            <span class="today-rec-badge ${escapeHtml(c.importance)}">${escapeHtml(c.importance)}</span>
            <span class="today-rec-name">${escapeHtml(c.title)}</span>
            <button class="today-rec-btn" data-goto="${escapeHtml(c.id)}">去复习</button>
          </div>`).join("")}
      </div>`;
    el.querySelectorAll(".today-rec-btn").forEach(btn => {
      btn.addEventListener("click", () => jumpToCard(btn.dataset.goto));
    });
  }

  function renderMasteryStats() {
    const total = cards.length;
    const known = cards.filter(c => getMastery(c.id) === 2).length;
    const familiar = cards.filter(c => getMastery(c.id) === 1).length;
    const unseen = total - known - familiar;
    const percent = total ? Math.round(known / total * 100) : 0;
    setText("knownCount", known);
    setHtml("dashStats",
      `<div class="dash-stat-item unseen"><strong>${unseen}</strong>未学</div>` +
      `<div class="dash-stat-item familiar"><strong>${familiar}</strong>认识</div>` +
      `<div class="dash-stat-item known"><strong>${known}</strong>掌握</div>`);
    const fill = $("dashFill");
    if (fill) fill.style.width = `${percent}%`;
    setText("dashHint", percent >= 80
      ? "漂亮，公式库已经进入冲刺熟练区。"
      : percent >= 35
        ? "稳住：把必背和常用卡先推到掌握。"
        : "先别贪多：每天吃掉一小批必背卡。");
    updateNavProgress();
  }

  function renderTags() {
    const tags = [...new Set(cards.flatMap((c) => c.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
    const sel = $("tagFilter");
    if (!sel) return;
    tags.forEach((tag) => {
      const opt = document.createElement("option");
      opt.value = tag; opt.textContent = tag;
      sel.appendChild(opt);
    });
  }

  function renderNav() {
    const nav = $("chapterNav");
    if (!nav) return;
    nav.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.textContent = "全部公式";
    allButton.className = "active";
    allButton.dataset.chapter = "all";
    allButton.addEventListener("click", () => {
      state.chapter = "all";
      setActiveChapter();
      switchView("cards");
      renderCards();
    });
    const allWrap = document.createElement("div");
    allWrap.className = "nav-group";
    allWrap.innerHTML = "<h2>总览</h2>";
    allWrap.appendChild(allButton);
    nav.appendChild(allWrap);

    groups.forEach((group) => {
      const section = document.createElement("div");
      section.className = "nav-group";
      section.innerHTML = `<h2>${escapeHtml(group.subject)}</h2>`;
      group.chapters.forEach((chapter) => {
        const count = cards.filter(c => c.subject === group.subject && c.chapter === chapter).length;
        const btn = document.createElement("button");
        btn.dataset.chapter = `${group.subject}::${chapter}`;
        btn.dataset.subject = group.subject;
        btn.dataset.chapterName = chapter;
        // text + progress dot (dot updated by updateNavProgress)
        btn.innerHTML = `${escapeHtml(chapter)}（${count}）<span class="nav-dot" aria-hidden="true"></span>`;
        btn.addEventListener("click", () => {
          state.chapter = `${group.subject}::${chapter}`;
          setActiveChapter();
          switchView("cards");
          renderCards();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        section.appendChild(btn);
      });
      nav.appendChild(section);
    });
  }

  // updateNavProgress — only updates .nav-dot inside existing buttons, no DOM rebuild
  function updateNavProgress() {
    document.querySelectorAll(".chapter-nav button[data-subject]").forEach((btn) => {
      const subj = btn.dataset.subject, ch = btn.dataset.chapterName;
      const must = cards.filter(c => c.subject === subj && c.chapter === ch && c.importance === "必背");
      const dot = btn.querySelector(".nav-dot");
      if (!dot) return;
      if (!must.length) { dot.className = "nav-dot"; return; }
      const unmastered = must.filter(c => getMastery(c.id) < 2).length;
      if (unmastered === 0) dot.className = "nav-dot dot-done";
      else if (unmastered === must.length) dot.className = "nav-dot dot-none";
      else dot.className = "nav-dot dot-partial";
    });
  }

  function setActiveChapter() {
    document.querySelectorAll(".chapter-nav button").forEach((button) => {
      button.classList.toggle("active", button.dataset.chapter === state.chapter);
    });
  }

  function bindControls() {
    let searchTimer = null;
    on("searchInput", "input", (e) => {
      const value = e.target.value.trim().toLowerCase();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.query = value;
        renderActiveView();
      }, 150);
    });
    on("importanceFilter", "change", (e) => { state.importance = e.target.value; renderActiveView(); });
    on("tagFilter", "change", (e) => { state.tag = e.target.value; renderActiveView(); });
    on("masteryFilter", "change", (e) => { state.mastery = e.target.value; renderActiveView(); });
    on("resetFilters", "click", () => {
      clearTimeout(searchTimer);
      state.query = ""; state.importance = "all"; state.tag = "all"; state.chapter = "all"; state.mastery = "all";
      state.onlyInteractive = false; state.reviewMode = false; state.labType = "all";
      if ($("searchInput")) $("searchInput").value = "";
      if ($("importanceFilter")) $("importanceFilter").value = "all";
      if ($("tagFilter")) $("tagFilter").value = "all";
      if ($("masteryFilter")) $("masteryFilter").value = "all";
      $("onlyInteractiveBtn")?.classList.remove("active-mode");
      $("reviewModeBtn")?.classList.remove("active-mode");
      setText("reviewModeBtn", "📖 复习模式");
      setActiveChapter();
      renderActiveView();
    });
    on("onlyInteractiveBtn", "click", () => {
      state.onlyInteractive = !state.onlyInteractive;
      if (!state.onlyInteractive) state.labType = "all";
      $("onlyInteractiveBtn")?.classList.toggle("active-mode", state.onlyInteractive);
      renderActiveView();
    });
    on("reviewModeBtn", "click", () => {
      state.reviewMode = !state.reviewMode;
      $("reviewModeBtn")?.classList.toggle("active-mode", state.reviewMode);
      setText("reviewModeBtn", state.reviewMode ? "✅ 复习模式 ON" : "📖 复习模式");
      renderCards();
    });
    on("flashModeBtn", "click", () => {
      state.flashMode = !state.flashMode;
      $("flashModeBtn")?.classList.toggle("active-mode", state.flashMode);
      setText("flashModeBtn", state.flashMode ? "🃏 闪卡模式 ON" : "🃏 闪卡模式");
      document.querySelectorAll(".formula-list").forEach((list) => list.classList.toggle("flash-mode", state.flashMode));
      renderActiveView();
    });
    document.querySelectorAll(".qnav-btn, .bnav-btn[data-view]").forEach((button) => {
      button.addEventListener("click", () => switchView(button.dataset.view));
    });
    on("mobileMenuBtn", "click", openSidebar);
    on("sidebarClose", "click", closeSidebar);
    on("sidebarOverlay", "click", closeSidebar);
    on("clearLocalDataBtn", "click", clearLocalLearningData);
    on("reviewStartBtn", "click", () => switchView("review"));
    on("reviewShuffleBtn", "click", () => renderReviewQueue(true));
    document.querySelectorAll(".error-tag").forEach((button) => {
      button.addEventListener("click", () => {
        state.errorType = button.dataset.error || "";
        document.querySelectorAll(".error-tag").forEach(b => b.classList.toggle("active", b === button));
        renderErrorCards();
      });
    });
  }

  function openSidebar() {
    $("sidebar")?.classList.add("open");
    $("sidebarOverlay")?.classList.add("open");
  }

  function closeSidebar() {
    $("sidebar")?.classList.remove("open");
    $("sidebarOverlay")?.classList.remove("open");
  }

  function switchView(view) {
    state.view = view || "cards";
    ["Cards", "Labs", "Review", "Errors"].forEach((name) => {
      const id = `view${name}`;
      $(id)?.classList.toggle("hidden", id !== `view${capitalize(state.view)}`);
    });
    document.querySelectorAll(".qnav-btn, .bnav-btn[data-view]").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === state.view);
    });
    closeSidebar();
    renderActiveView();
  }

  function capitalize(value) {
    return String(value || "").slice(0, 1).toUpperCase() + String(value || "").slice(1);
  }

  function renderActiveView() {
    if (state.view === "labs") {
      clearCardContainers();
      renderLabsGrid();
      currentItems = [];
      focusedIndex = -1;
      setText("resultsInfo", "交互实验室：用图像和滑块把高频公式看懂。");
      return;
    }
    if (state.view === "review") {
      clearCardContainers("reviewQueue");
      renderReviewQueue();
      return;
    }
    if (state.view === "errors") {
      clearCardContainers("errorCards");
      renderErrorCards();
      return;
    }
    clearCardContainers("formulaList");
    renderCards();
  }

  function clearCardContainers(exceptId = "") {
    ["formulaList", "reviewQueue", "errorCards"].forEach((id) => {
      if (id !== exceptId) setHtml(id, "");
    });
  }

  function renderCardList(targetId, items, emptyMessage, infoText) {
    const list = $(targetId);
    if (!list) return;
    currentItems = sortCards(items);
    focusedIndex = -1;
    setText("resultsInfo", infoText || `当前显示 ${currentItems.length} / ${cards.length} 张公式卡`);
    list.classList.toggle("flash-mode", state.flashMode);
    if (!currentItems.length) {
      list.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
      return;
    }
    list.innerHTML = currentItems.map(renderCard).join("");
    setupLazyDemos(list);
    typesetMath(list);
    renderMasteryStats();
  }

  const LAB_META = {
    "equivalent-compare": ["🧪", "无穷小等价实验室", "观察比值趋 1、同阶和高阶小量。"],
    "taylor-order-lab": ["📈", "Taylor 阶数选择实验室", "看抵消后首个非零项为什么决定答案。"],
    "trig-transform-lab": ["〰️", "三角变形实验室", "用波形叠加理解积化和差、和差化积。"],
    "integral-method-picker": ["🧭", "积分方法选择器", "按题型特征选择换元、分部、Wallis 等。"],
    "matrix-eigen-lab": ["🔷", "特征值/正定可视化", "看矩阵如何拉伸方向与改变二次型形状。"],
    "probability-distribution-lab": ["🎯", "假设检验拒绝域实验室", "观察 α、β 和功效之间的权衡。"],
    "limit-slider": ["🔍", "极限数值逼近", "拖动 x 看经典极限如何靠近目标值。"],
    "taylor-plot": ["📉", "Taylor 曲线贴合", "比较函数曲线与低阶多项式近似。"],
    "tangent-line": ["📐", "切线与导数", "拖动点看割线趋近切线。"],
    "riemann-sum": ["▥", "Riemann 和面积", "改变分割数观察面积逼近。"],
    "wallis-recursion": ["π", "Wallis 递推", "理解高次三角积分如何递推压缩。"],
    "unit-circle": ["⭕", "单位圆三角", "用单位圆读 sin、cos、tan。"],
    "matrix-transform": ["↗️", "2D 矩阵变换", "看矩阵对向量和单位方格的作用。"],
    "distribution-plot": ["📊", "常见分布图像", "调参数观察概率分布形状。"],
    "clt-demo": ["🔔", "中心极限定理", "看样本均值分布逐渐接近正态。"]
  };

  // 实验室重要程度标签
  const LAB_LEVEL = {
    "equivalent-compare":        ["高频必考", "lv-hot"],
    "taylor-order-lab":          ["高频必考", "lv-hot"],
    "limit-slider":              ["高频必考", "lv-hot"],
    "taylor-plot":               ["高频必考", "lv-hot"],
    "tangent-line":              ["高频必考", "lv-hot"],
    "riemann-sum":               ["高频必考", "lv-hot"],
    "unit-circle":               ["高频必考", "lv-hot"],
    "trig-transform-lab":        ["常用理解", "lv-mid"],
    "integral-method-picker":    ["常用理解", "lv-mid"],
    "wallis-recursion":          ["常用理解", "lv-mid"],
    "distribution-plot":         ["常用理解", "lv-mid"],
    "clt-demo":                  ["常用理解", "lv-mid"],
    "matrix-eigen-lab":          ["常用理解", "lv-mid"],
    "probability-distribution-lab": ["常用理解", "lv-mid"],
    "matrix-transform":          ["拓展了解", "lv-ext"],
  };

  // 迷你 SVG 缩略图（56×44 viewBox）
  function renderLabThumbnail(type) {
    const W = 56, H = 44, cx = W/2, cy = H/2;
    // shared helpers (no closure dependencies)
    const axis = `<line x1="4" y1="${cy}" x2="${W-4}" y2="${cy}" stroke="#cbd5e1" stroke-width="0.8"/>
                  <line x1="${cx}" y1="3" x2="${cx}" y2="${H-3}" stroke="#cbd5e1" stroke-width="0.8"/>`;
    const pts = (n, fn) => Array.from({length:n}, (_,i) => {
      const t = i/(n-1), x = 4 + t*(W-8), y = fn(t);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    switch (type) {
      case 'equivalent-compare': {
        // three curves converging to mid-line
        const c1 = pts(30, t => cy - 14*Math.exp(-3*t));
        const c2 = pts(30, t => cy - 10*Math.exp(-3*t));
        const c3 = pts(30, t => cy + 8*Math.exp(-3*t));
        return `${axis}<polyline points="${c1}" fill="none" stroke="#2563eb" stroke-width="1.2"/>
                <polyline points="${c2}" fill="none" stroke="#f59e0b" stroke-width="1.2"/>
                <polyline points="${c3}" fill="none" stroke="#ef4444" stroke-width="1.2"/>
                <line x1="4" y1="${cy}" x2="${W-4}" y2="${cy}" stroke="#15803d" stroke-width="1" stroke-dasharray="3,2"/>`;
      }
      case 'taylor-order-lab':
      case 'taylor-plot': {
        const fn  = pts(40, t => { const x=(t-0.5)*6; return cy - Math.sin(x)*14; });
        const ap  = pts(40, t => { const x=(t-0.5)*6; return cy - clamp(x-x**3/6, -16,16)*14/1; });
        return `${axis}<polyline points="${fn}" fill="none" stroke="#2563eb" stroke-width="1.5"/>
                <polyline points="${ap}" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3,2"/>`;
      }
      case 'trig-transform-lab': {
        const f1 = pts(50, t => cy - 13*Math.sin(t*4*Math.PI));
        const f2 = pts(50, t => cy - 13*Math.sin(t*2*Math.PI)*Math.cos(t*2*Math.PI));
        return `${axis}<polyline points="${f1}" fill="none" stroke="#2563eb" stroke-width="1.5"/>
                <polyline points="${f2}" fill="none" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="4,2"/>`;
      }
      case 'integral-method-picker': {
        // simple decision tree: root -> 2 branches -> 4 leaves
        const mx = cx, my = 8;
        return `<rect x="${mx-10}" y="${my}" width="20" height="9" rx="2" fill="#dbeafe" stroke="#2563eb" stroke-width="0.8"/>
                <text x="${mx}" y="${my+6.5}" fill="#1d4ed8" font-size="5" text-anchor="middle">特征</text>
                <line x1="${mx}" y1="${my+9}" x2="${mx-14}" y2="${my+20}" stroke="#94a3b8" stroke-width="0.8"/>
                <line x1="${mx}" y1="${my+9}" x2="${mx+14}" y2="${my+20}" stroke="#94a3b8" stroke-width="0.8"/>
                <rect x="${mx-22}" y="${my+20}" width="16" height="8" rx="2" fill="#dcfce7" stroke="#15803d" stroke-width="0.8"/>
                <text x="${mx-14}" y="${my+26}" fill="#166534" font-size="4.5" text-anchor="middle">换元</text>
                <rect x="${mx+6}" y="${my+20}" width="16" height="8" rx="2" fill="#fef9c3" stroke="#ca8a04" stroke-width="0.8"/>
                <text x="${mx+14}" y="${my+26}" fill="#854d0e" font-size="4.5" text-anchor="middle">分部</text>
                <line x1="${mx-14}" y1="${my+28}" x2="${mx-20}" y2="${my+36}" stroke="#94a3b8" stroke-width="0.7"/>
                <line x1="${mx-14}" y1="${my+28}" x2="${mx-8}" y2="${my+36}" stroke="#94a3b8" stroke-width="0.7"/>
                <rect x="${mx-25}" y="${my+36}" width="12" height="7" rx="2" fill="#ede9fe" stroke="#7c3aed" stroke-width="0.7"/>
                <text x="${mx-19}" y="${my+41}" fill="#5b21b6" font-size="4" text-anchor="middle">三角代换</text>
                <rect x="${mx-12}" y="${my+36}" width="12" height="7" rx="2" fill="#ffedd5" stroke="#ea580c" stroke-width="0.7"/>
                <text x="${mx-6}" y="${my+41}" fill="#9a3412" font-size="4" text-anchor="middle">有理式</text>`;
      }
      case 'matrix-eigen-lab':
      case 'matrix-transform': {
        // unit circle → ellipse + two eigenvectors
        const circPts = Array.from({length:32}, (_,i) => {
          const θ=2*Math.PI*i/31;
          return `${(cx+Math.cos(θ)*16).toFixed(1)},${(cy-Math.sin(θ)*10).toFixed(1)}`;
        }).join(' ');
        const ellPts = Array.from({length:32}, (_,i) => {
          const θ=2*Math.PI*i/31;
          return `${(cx+Math.cos(θ)*22).toFixed(1)},${(cy-Math.sin(θ)*7).toFixed(1)}`;
        }).join(' ');
        return `${axis}<polyline points="${circPts}" fill="none" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2,2"/>
                <polyline points="${ellPts}" fill="rgba(180,95,6,.15)" stroke="#f59e0b" stroke-width="1.4"/>
                <line x1="${cx}" y1="${cy}" x2="${cx+20}" y2="${cy-4}" stroke="#2563eb" stroke-width="1.5"/>
                <line x1="${cx}" y1="${cy}" x2="${cx-6}" y2="${cy-14}" stroke="#15803d" stroke-width="1.5"/>`;
      }
      case 'probability-distribution-lab': {
        const h0 = pts(60, t => { const x=(t-0.5)*10; return cy - 22*Math.exp(-0.5*x*x)/Math.sqrt(2*Math.PI)*10; });
        const h1 = pts(60, t => { const x=(t-0.5)*10-2.5; return cy - 22*Math.exp(-0.5*x*x)/Math.sqrt(2*Math.PI)*10; });
        const rejX1 = 4 + 0.77*(W-8), rejX2 = W-4;
        return `${axis}
                <rect x="${rejX1.toFixed(1)}" y="10" width="${(rejX2-rejX1).toFixed(1)}" height="${cy-10}" fill="rgba(220,38,38,.25)"/>
                <polyline points="${h0}" fill="none" stroke="#1e293b" stroke-width="1.4"/>
                <polyline points="${h1}" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3,2"/>`;
      }
      case 'wallis-recursion': {
        // staircase of I_n values
        const vals = [Math.PI/2, 1, Math.PI/4, 2/3, 3*Math.PI/16, 8/15];
        const bw = (W-10)/vals.length;
        return `<line x1="4" y1="${H-6}" x2="${W-4}" y2="${H-6}" stroke="#cbd5e1" stroke-width="0.8"/>` +
          vals.map((v,i) => {
            const h = v * 18, x = 5 + i*bw, y = H-6-h;
            const col = i===0?'#dbeafe':i===1?'#fef9c3':'#ede9fe';
            const sc  = i===0?'#2563eb':i===1?'#ca8a04':'#7c3aed';
            return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw-1).toFixed(1)}" height="${h.toFixed(1)}" fill="${col}" stroke="${sc}" stroke-width="0.7"/>
                    <text x="${(x+bw/2-0.5).toFixed(1)}" y="${(y-1.5).toFixed(1)}" fill="${sc}" font-size="4.5" text-anchor="middle">I${i}</text>`;
          }).join('');
      }
      case 'unit-circle': {
        const r = 14, θ = Math.PI/4;
        const px = cx+r*Math.cos(θ), py = cy-r*Math.sin(θ);
        return `<line x1="${cx-r-4}" y1="${cy}" x2="${cx+r+4}" y2="${cy}" stroke="#e2e8f0" stroke-width="0.8"/>
                <line x1="${cx}" y1="${cy+r+4}" x2="${cx}" y2="${cy-r-4}" stroke="#e2e8f0" stroke-width="0.8"/>
                <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#bfdbfe" stroke-width="1.2"/>
                <line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#f59e0b" stroke-width="1.5"/>
                <line x1="${px.toFixed(1)}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#15803d" stroke-width="1.2"/>
                <line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${cy}" stroke="#7e22ce" stroke-width="1.2"/>
                <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.5" fill="#f59e0b"/>`;
      }
      case 'distribution-plot': {
        // bar chart (discrete) + normal curve
        const bars = [.05,.15,.28,.22,.15,.10,.05].map((v,i) => {
          const x=6+i*7, h=v*100;
          return `<rect x="${x}" y="${H-6-h}" width="6" height="${h}" fill="#3b82f6" opacity="0.7"/>`;
        }).join('');
        const nc = pts(40, t => { const x=(t-0.5)*3.5; return H-6 - 30*Math.exp(-0.5*x*x); });
        return `<line x1="4" y1="${H-6}" x2="${W-4}" y2="${H-6}" stroke="#cbd5e1" stroke-width="0.8"/>
                ${bars}<polyline points="${nc}" fill="none" stroke="#f59e0b" stroke-width="1.4"/>`;
      }
      case 'clt-demo': {
        // wide vs narrow normal
        const wide   = pts(50, t => { const x=(t-0.5)*8; return cy - 22*Math.exp(-0.5*(x/2)**2)/(2*Math.sqrt(2*Math.PI))*10; });
        const narrow = pts(50, t => { const x=(t-0.5)*8; return cy - 22*Math.exp(-0.5*(x/0.5)**2)/(0.5*Math.sqrt(2*Math.PI))*10; });
        return `${axis}<polyline points="${wide}"   fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,2"/>
                <polyline points="${narrow}" fill="none" stroke="#b45f06" stroke-width="1.8"/>
                <text x="${W-4}" y="10" fill="#b45f06" font-size="5" text-anchor="end">n↑窄</text>`;
      }
      case 'limit-slider': {
        const c = pts(40, t => { const x=(t-0.5)*2; return cy - (Math.abs(x)<0.01?0:Math.sin(x)/x*16); });
        return `${axis}<polyline points="${c}" fill="none" stroke="#2563eb" stroke-width="1.5"/>
                <line x1="${cx}" y1="${cy-16}" x2="${cx}" y2="${cy+4}" stroke="#ef4444" stroke-width="0.8" stroke-dasharray="2,2"/>
                <circle cx="${cx}" cy="${cy-16}" r="2" fill="#ef4444"/>`;
      }
      case 'tangent-line': {
        const cv = pts(40, t => { const x=(t-0.5)*4; return cy - x*x*8; });
        const x0=0.5, y0=x0*x0, sl=2*x0;
        const tl = pts(10, t => { const x=(t-0.5)*4, y=y0+sl*(x-x0); return cy-y*8; });
        return `${axis}<polyline points="${cv}" fill="none" stroke="#2563eb" stroke-width="1.5"/>
                <polyline points="${tl}" fill="none" stroke="#f59e0b" stroke-width="1.2"/>
                <circle cx="${(cx+x0*20).toFixed(1)}" cy="${(cy-y0*8).toFixed(1)}" r="2.5" fill="#f59e0b"/>`;
      }
      default: {
        // generic: sine wave
        const gn = pts(40, t => cy - 13*Math.sin(t*4*Math.PI));
        return `${axis}<polyline points="${gn}" fill="none" stroke="#94a3b8" stroke-width="1.5"/>`;
      }
    }
  }

  function renderLabsGrid() {
    const grid = $("labsGrid");
    if (!grid) return;
    const types = [...new Set(cards.filter(c => c.interactiveType && c.interactiveType !== "none").map(c => c.interactiveType))];
    grid.innerHTML = types.map((type) => {
      const sample = cards.find(c => c.interactiveType === type);
      const count = cards.filter(c => c.interactiveType === type).length;
      const [icon, title, desc] = LAB_META[type] || ["🔬", type, "打开相关公式卡查看交互演示。"];
      const [lvlLabel, lvlClass] = LAB_LEVEL[type] || ["拓展了解", "lv-ext"];
      const thumb = renderLabThumbnail(type);
      return `
        <article class="lab-card" data-lab="${escapeHtml(type)}" role="button" tabindex="0">
          <div class="lab-card-top">
            <svg class="lab-thumb" viewBox="0 0 56 44" xmlns="http://www.w3.org/2000/svg">${thumb}</svg>
            <div class="lab-card-meta">
              <span class="lab-level ${lvlClass}">${lvlLabel}</span>
              <div class="lab-card-icon">${icon}</div>
            </div>
          </div>
          <h3>${escapeHtml(title)}</h3>
          <p class="lab-trigger">绑定 ${count} 张卡 · 代表：${escapeHtml(sample?.title || type)}</p>
          <p class="lab-desc">${escapeHtml(desc)}</p>
          <button class="lab-link-btn" type="button">打开实验室演示</button>
        </article>`;
    }).join("");
    grid.querySelectorAll(".lab-card").forEach((card) => {
      const open = () => {
        openLabDemo(card.dataset.lab || "all");
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });
  }

  function openLabDemo(type) {
    state.labType = type || "all";
    state.onlyInteractive = true;
    $("onlyInteractiveBtn")?.classList.add("active-mode");
    switchView("cards");
    requestAnimationFrame(() => {
      const selector = `.demo-box[data-demo="${cssEscape(state.labType)}"]`;
      const demo = document.querySelector(selector);
      const article = demo?.closest(".formula-card");
      if (!demo || !article) return;

      const coreDetails = demo.closest("details");
      if (coreDetails && !coreDetails.open) coreDetails.open = true;
      article.querySelectorAll(".demo-box[data-demo]").forEach(mountDemoBox);
      article.classList.add("card-jump-highlight");
      setTimeout(() => article.classList.remove("card-jump-highlight"), 1400);
      setText("resultsInfo", `已打开实验室演示：${article.querySelector("h3")?.textContent || state.labType}`);
      setTimeout(() => {
        (demo.closest(".interactive") || demo).scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    });
  }

  function buildReviewQueue(shuffle = false) {
    const scored = cards
      .filter(card => getMastery(card.id) < 2 || isFavorite(card.id))
      .map((card) => {
        let score = 0;
        if (card.importance === "必背") score += 30;
        if (card.importance === "常用") score += 18;
        if (card.importance === "技巧") score += 12;
        if (getMastery(card.id) === 0) score += 20;
        if (getMastery(card.id) === 1) score += 14;
        if (isFavorite(card.id)) score += 25;
        if (card.interactiveType && card.interactiveType !== "none") score += 4;
        return { card, score };
      });
    const items = shuffle
      ? scored.sort(() => Math.random() - 0.5)
      : scored.sort((a, b) => b.score - a.score || (originalIndex.get(a.card.id) ?? 0) - (originalIndex.get(b.card.id) ?? 0));
    return items.slice(0, 60).map(item => item.card);
  }

  function renderReviewQueue(shuffle = false) {
    const items = buildReviewQueue(shuffle);
    renderCardList(
      "reviewQueue",
      items,
      "今日复习队列暂时为空：你已经把可复习卡都标成掌握了，或者还没有收藏卡。",
      `今日复习 ${items.length} 张：必背未掌握、认识状态和收藏卡优先。`
    );
  }

  const ERROR_RULES = {
    "equivalent-misuse": ["等价无穷小", "无穷小", "Taylor", "主项", "极限"],
    "taylor-order": ["Taylor", "主项", "展开", "余项", "阶"],
    "trig-transform": ["三角", "积化和差", "和差化积", "万能", "辅助角"],
    "integral-method": ["积分", "换元", "分部", "Wallis", "Beta", "Gamma", "反常积分"],
    "linear-algebra": ["秩", "特征值", "正定", "二次型", "相似", "合同"],
    "probability-cond": ["条件概率", "Bayes", "全概率", "独立", "条件"],
    "series-convergence": ["级数", "判别", "收敛", "幂级数", "Fourier"],
    "multivar-extreme": ["多元", "极值", "Hessian", "Lagrange", "条件极值"]
  };

  function renderErrorCards() {
    if (!state.errorType) {
      currentItems = [];
      focusedIndex = -1;
      setHtml("errorCards", `<div class="empty-state">先点一个错题类型，我会把相关公式卡捞出来。</div>`);
      setText("resultsInfo", "错题归因：按错误类型反查公式、条件和易错点。");
      return;
    }
    const keywords = ERROR_RULES[state.errorType] || [];
    const items = cards.filter((card) => {
      const hay = [card.subject, card.chapter, card.section, card.title, card.latex,
        card.importance, card.tags.join(" "), card.conditions, card.intuition,
        card.howToUse, card.miniProof, card.example, card.mistakes].join(" ");
      return keywords.some(keyword => hay.includes(keyword));
    }).slice(0, 80);
    renderCardList(
      "errorCards",
      items,
      "这个归因暂时没匹配到公式卡。可以换一个类型，或者用顶部搜索关键词。",
      `错题归因匹配 ${items.length} 张：${keywords.join(" / ")}`
    );
  }

  function filteredCards() {
    return cards.filter((card) => {
      if (state.importance !== "all" && card.importance !== state.importance) return false;
      if (state.tag !== "all" && !card.tags.includes(state.tag)) return false;
      if (state.mastery !== "all" && String(getMastery(card.id)) !== state.mastery) return false;
      if (state.onlyInteractive && (!card.interactiveType || card.interactiveType === "none")) return false;
      if (state.labType !== "all" && card.interactiveType !== state.labType) return false;
      if (state.chapter !== "all") {
        const [subject, chapter] = state.chapter.split("::");
        if (card.subject !== subject || card.chapter !== chapter) return false;
      }
      if (state.reviewMode && getMastery(card.id) === 2) return false;
      if (state.query && !card._searchText.includes(state.query)) return false;
      return true;
    });
  }

  function sortCards(items) {
    return [...items].sort((a, b) => {
      const sa = subjectIndex.get(a.subject) ?? 999, sb = subjectIndex.get(b.subject) ?? 999;
      if (sa !== sb) return sa - sb;
      const ca = chapterIndex.get(`${a.subject}::${a.chapter}`) ?? 999;
      const cb = chapterIndex.get(`${b.subject}::${b.chapter}`) ?? 999;
      if (ca !== cb) return ca - cb;
      return (originalIndex.get(a.id) ?? 9999) - (originalIndex.get(b.id) ?? 9999);
    });
  }

  function renderCards() {
    currentItems = sortCards(filteredCards());
    const reviewNote = state.reviewMode ? "（已过滤掌握度=掌握的卡）" : "";
    const labNote = state.labType !== "all" ? ` · 实验室：${LAB_META[state.labType]?.[1] || state.labType}` : "";
    const emptyMessage = state.reviewMode
      ? "🎉 所有卡都已标记为「掌握」！"
      : "没有找到匹配公式。换个关键词试试，比如「Wallis」「等价无穷小」「正定」。";
    renderCardList(
      "formulaList",
      currentItems,
      emptyMessage,
      `当前显示 ${currentItems.length} / ${cards.length} 张公式卡${reviewNote}${labNote}`
    );
  }

  function renderCard(card) {
    const q = state.query;
    const tags = card.tags.map(t => `<span class="tag">${hl(t, q)}</span>`).join("");
    const lvl = getMastery(card.id);
    const flashCover = state.flashMode
      ? `<div class="flash-cover"><span>点击 / 按空格 揭开答案</span></div>` : "";

    // ── 关联卡片 chips ──
    const rels = relMap.get(card.id) || [];
    const relChips = rels.map(rid => {
      const rc = cardById.get(rid);
      if (!rc) return "";
      return `<button class="rel-chip" data-goto="${escapeHtml(rid)}" title="跳转：${escapeHtml(rc.title)}">${escapeHtml(rc.title)}</button>`;
    }).filter(Boolean).join("");
    const relRow = relChips
      ? `<div class="rel-row"><span class="rel-label">相关：</span>${relChips}</div>`
      : "";

    // ── 层级结构：核心区（howToUse + example + mistakes）常驻可见 ──
    //             次要区（conditions + miniProof）默认折叠
    const coreBlocks = `
      <div class="detail-block db-how"><h4>怎么用</h4><p>${escapeHtml(card.howToUse)}</p></div>
      ${renderStudyLayer(card)}
      <div class="detail-block db-ex"><h4>小例子</h4><p>${escapeHtml(card.example)}</p></div>
      <div class="detail-block db-mis"><h4>⚠ 易错点</h4><p>${escapeHtml(card.mistakes)}</p></div>`;

    const secondaryBlocks = `
      ${renderProofGuide(card)}
      <div class="detail-block db-cond"><h4>适用条件</h4><p>${escapeHtml(card.conditions)}</p></div>
      <div class="detail-block db-proof"><h4>简短证明/来源</h4><p>${escapeHtml(card.miniProof)}</p></div>`;

    const demoBlock = card.interactiveType !== "none"
      ? `<div class="detail-block interactive db-demo">
           <h4>交互演示</h4>
           <div class="demo-box" data-demo="${escapeHtml(card.interactiveType)}" data-card="${escapeHtml(card.id)}"></div>
         </div>`
      : "";

    return `
      <article class="formula-card" id="${escapeHtml(card.id)}">
        <div class="formula-head">
          <div>
            <div class="formula-title">
              <h3>${hl(card.title, q)}</h3>
              <span class="badge ${escapeHtml(card.importance)}">${escapeHtml(card.importance)}</span>
            </div>
            <p class="chapter-line">${hl(card.subject, q)} / ${hl(card.chapter, q)} / ${hl(card.section, q)}</p>
          </div>
          <div class="card-actions">
            <button class="fav-btn ${isFavorite(card.id) ? "active" : ""}" data-id="${escapeHtml(card.id)}" title="收藏 / 取消收藏" aria-label="${isFavorite(card.id) ? "取消收藏" : "收藏"}">${isFavorite(card.id) ? "★" : "☆"}</button>
            <button class="mastery-btn ${MASTERY_CLASS[lvl]}" data-id="${escapeHtml(card.id)}">${MASTERY_LABEL[lvl]} (m)</button>
          </div>
        </div>
        <div class="formula" data-formula-card="${escapeHtml(card.id)}">\\[\\begin{gathered}${escapeHtml(card.latex)}\\end{gathered}\\]</div>
        <div class="flash-body">
          ${flashCover}
          <div class="flash-content">
            <p class="intuition"><strong>一句话理解：</strong>${hl(card.intuition, q)}</p>
            <div class="tag-row">${tags}</div>
            ${relRow}
            <details class="card-details-core">
              <summary>展开：用法、例子与易错点</summary>
              <div class="detail-grid dg-core">
                ${coreBlocks}
                ${demoBlock}
              </div>
            </details>
            <details class="card-details-secondary">
              <summary>深入：适用条件与证明来源</summary>
              <div class="detail-grid dg-secondary">
                ${secondaryBlocks}
              </div>
            </details>
          </div>
        </div>
      </article>
    `;
  }

  function renderProofGuide(card) {
    const hay = [card.title, card.section, card.chapter, card.tags.join(" "), card.interactiveType].join(" ");
    let guide;
    if (/等价无穷小|Taylor|极限|主项/.test(hay)) {
      guide = {
        title: "证明导图：先找主项",
        idea: "极限题的证明核心不是“背替换”，而是比较局部最低非零阶。",
        steps: ["把目标函数在趋近点展开或化成标准等价式", "保留最低非零阶，检查加减是否发生抵消", "用商的极限验证同阶、等价或高阶小量"]
      };
    } else if (/三角|积化和差|和差化积|单位圆|Fourier/.test(hay)) {
      guide = {
        title: "证明导图：从和差角出发",
        idea: "三角恒等式大多是和差角公式的加减组合；图像上表现为相位、振幅和频率的重组。",
        steps: ["先写出 sin(A±B)、cos(A±B)", "相加或相减消去目标外的项", "应用时同步检查系数 1/2、符号和角度单位"]
      };
    } else if (/积分|Wallis|Beta|Gamma|反常|Riemann/.test(hay)) {
      guide = {
        title: "证明导图：把难积分变成结构",
        idea: "积分公式通常来自换元、分部、对称或递推；先判断结构再套方法。",
        steps: ["识别被积函数的对称性、乘积结构或奇点", "选择换元/分部/区间配对/递推中的一种主线", "最后补上区间、收敛条件和常数因子"]
      };
    } else if (/矩阵|特征值|正定|二次型|秩|线性/.test(hay)) {
      guide = {
        title: "证明导图：看不变量",
        idea: "线代公式的证明常围绕秩、行列式、特征值、合同/相似下保持不变的量。",
        steps: ["先判断变换类型：等价、相似、合同或正交变换", "写出对应不变量：秩、特征值、惯性指数、内积", "用标准形或基变换把问题化到最简单坐标"]
      };
    } else if (/概率|分布|期望|方差|Bayes|卷积|检验|CLT/.test(hay)) {
      guide = {
        title: "证明导图：先写事件或密度",
        idea: "概率公式不要先背结论，先把事件、条件或密度区域写清楚。",
        steps: ["离散题列事件分解，连续题先画积分区域", "条件概率先锁定分母事件，独立性必须明确使用", "数字特征题用定义，再用线性性/独立性化简"]
      };
    } else if (/级数|幂级数|Fourier|判别/.test(hay)) {
      guide = {
        title: "证明导图：比较尾项速度",
        idea: "级数敛散的本质是尾项衰减速度；幂级数还要额外检查端点。",
        steps: ["先判断正项、交错、任意项或函数项级数", "选比较、比值、根值、Dirichlet/Abel 等判别", "求半径后端点必须代回原级数单独检查"]
      };
    } else {
      guide = {
        title: "证明导图：定义 → 变形 → 条件",
        idea: "先从定义或标准公式出发，把题目化成可直接验证的形式。",
        steps: ["写出公式成立所需的定义域、连续性或可导性条件", "用代数恒等变形、极限或导数验证核心等式", "把容易漏掉的边界、方向、常数和符号补回去"]
      };
    }
    return `
      <div class="detail-block db-guide">
        <h4>${escapeHtml(guide.title)}</h4>
        <p>${escapeHtml(guide.idea)}</p>
        <ol>${guide.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      </div>`;
  }

  function renderStudyLayer(card) {
    const builder = window.FORMULA_STUDY_LAYER?.buildStudyLayer;
    if (!builder) return "";
    const study = builder(card);
    return `
      <div class="detail-block db-study">
        <div class="study-head">
          <h4>学习拆解：证明、场景与例题</h4>
          <span>${escapeHtml(study.kind)}</span>
        </div>
        <div class="study-grid">
          <section>
            <h5>${escapeHtml(study.proofTitle)}</h5>
            <p>${escapeHtml(study.proofCore)}</p>
            <ol>${study.proofSteps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
          </section>
          <section>
            <h5>${escapeHtml(study.usageTitle)}</h5>
            <ul>${study.triggers.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            <p class="study-flow">${study.examSteps.map(step => `<span>${escapeHtml(step)}</span>`).join("")}</p>
          </section>
          <section>
            <h5>${escapeHtml(study.exampleTitle)}</h5>
            <p>${escapeHtml(study.exampleProblem)}</p>
            <ol>${study.exampleSolution.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
          </section>
          <section>
            <h5>${escapeHtml(study.checklistTitle)}</h5>
            <ul>${study.checklist.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>
        </div>
      </div>`;
  }

  // ── mastery button click (event delegation) ───────────────────────────────────
  document.addEventListener("click", (e) => {
    const fav = e.target.closest(".fav-btn");
    if (fav) { toggleFavoriteForCard(fav.dataset.id); return; }

    const btn = e.target.closest(".mastery-btn");
    if (btn) {
      const id = btn.dataset.id;
      cycleMastery(id, (getMastery(id) + 1) % 3);
      return;
    }

    // ── 关联卡片跳转 ──
    const chip = e.target.closest(".rel-chip");
    if (chip) {
      const targetId = chip.dataset.goto;
      jumpToCard(targetId);
      return;
    }

    if (state.flashMode) {
      const article = e.target.closest(".formula-card");
      if (article && !e.target.closest(".mastery-btn") && !e.target.closest(".fav-btn")) {
        article.classList.toggle("flash-revealed");
      }
    }
  });

  // jumpToCard: 跳转到目标卡，若不在当前视图则重置筛选后重渲染
  function jumpToCard(targetId) {
    const targetCard = cards.find(c => c.id === targetId);
    if (!targetCard) return;

    // 确保在 cards 视图
    if (state.view !== "cards") switchView("cards");

    // 检查目标卡是否在当前过滤结果里
    const visible = filteredCards().some(c => c.id === targetId);
    if (!visible) {
      // 重置所有筛选，让目标卡可见
      state.query = ""; state.importance = "all"; state.tag = "all";
      state.chapter = "all"; state.mastery = "all";
      state.onlyInteractive = false; state.reviewMode = false; state.labType = "all";
      const si = $("searchInput"); if (si) si.value = "";
      const ii = $("importanceFilter"); if (ii) ii.value = "all";
      const ti = $("tagFilter"); if (ti) ti.value = "all";
      const mi = $("masteryFilter"); if (mi) mi.value = "all";
      $("onlyInteractiveBtn")?.classList.remove("active-mode");
      $("reviewModeBtn")?.classList.remove("active-mode");
      // brief toast
      showJumpToast(targetCard.title);
    }

    renderCards();

    // scroll and highlight after render
    requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("card-jump-highlight");
      setTimeout(() => el.classList.remove("card-jump-highlight"), 1400);
    });
  }

  function showJumpToast(title) {
    let toast = document.getElementById("jump-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "jump-toast";
      toast.className = "jump-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = `已清除筛选，跳转到：${title}`;
    toast.classList.add("jump-toast-show");
    setTimeout(() => toast.classList.remove("jump-toast-show"), 2200);
  }

  // ── interactive demos ─────────────────────────────────────────────────────────
  function demoCode(type) {
    const snippets = {
      "limit-slider": ["const x = 0.001;","sin(x) / x              // -> 1","Math.log1p(x) / x       // -> 1","(1 - Math.cos(x)) / x**2 // -> 0.5"],
      "taylor-plot": ["function sinTaylor(x, order) {","  if (order === 1) return x;","  if (order === 3) return x - x**3 / 6;","  return x - x**3 / 6 + x**5 / 120;","}"],
      "tangent-line": ["const f = x => 0.35 * x*x - 1;","const slope = x => 0.7 * x;","const tangent = (x0, x) => f(x0) + slope(x0) * (x - x0);"],
      "riemann-sum": ["let area = 0;","for (let i = 0; i < n; i++) {","  const x = a + (i + 0.5) * (b - a) / n;","  area += f(x) * (b - a) / n;","}"],
      "wallis-recursion": ["I[0] = Math.PI / 2;","I[1] = 1;","for (let n = 2; n <= N; n++) {","  I[n] = (n - 1) / n * I[n - 2];","}"],
      "unit-circle": ["const rad = degree * Math.PI / 180;","const point = { x: Math.cos(rad), y: Math.sin(rad) };","const tan = Math.sin(rad) / Math.cos(rad);"],
      "matrix-transform": ["const A = [[a, b], [c, d]];","const v = [x, y];","const Av = [a*x + b*y, c*x + d*y];","det(A) = a*d - b*c; // 面积缩放"],
      "distribution-plot": ["normal(x, mu, sigma) = exp(-(x-mu)^2/(2*sigma^2))","binomial(k, n, p) = C(n,k) * p^k * (1-p)^(n-k)","poisson(k, lambda) = exp(-lambda) * lambda^k / k!"],
      "clt-demo": ["mean(X_bar) = mu;","var(X_bar) = sigma^2 / n;","Z = (X_bar - mu) / (sigma / Math.sqrt(n));","n 越大，样本均值分布越窄、越接近正态。"],
      "equivalent-compare": ["// 观察比值趋于 1 则等价，趋于非1常数则同阶，趋于0则高阶小量","sin(x)/x → 1","(1-cos(x))/x² → 0.5","(e^x-1)/x → 1","// 反例：sin(x)-x 不等价于 0，主项是 -x³/6"],
      "taylor-order-lab": ["// 为何要展开到三阶/四阶？","// sinx - x 抵消了0阶和1阶，首非零项是 -x³/6","// cosx - 1 + x²/2 抵消到四阶，首非零项是 -x⁴/24","approx(x, n) = sum_{k} f^(k)(0)/k! * x^k"],
      "trig-transform-lab": ["// 和差化积：sinA+sinB = 2sin((A+B)/2)cos((A-B)/2)","// 积化和差：sinA·cosB = (1/2)[sin(A+B)+sin(A-B)]","// 辅助角：a·sinx+b·cosx = R·sin(x+φ), R=√(a²+b²)"],
      "integral-method-picker": ["// 题型判断树：","// 含根式 → 三角/双曲/Euler代换","// 乘积型 → 分部（ILATE顺序选u）","// 有理式 → 部分分数分解","// 三角幂 → 降幂/递推/Wallis"],
      "matrix-eigen-lab": ["// 特征方程：det(A - λI) = 0","// 特征向量方向在变换后不变，仅被拉伸λ倍","// 正定 ⟺ 所有特征值 > 0","// 行列式 = 所有特征值之积，迹 = 所有特征值之和"],
      "probability-distribution-lab": ["// 拒绝域：|Z| > z_{α/2}（双侧）","// 第一类错误 α = P(拒绝H₀ | H₀真)","// 第二类错误 β = P(不拒绝H₀ | H₀假)","// p值 < α → 拒绝原假设"],
    };
    return (snippets[type] || ["这个模块暂无代码示例。"]).join("\n");
  }

  // scope: 可选的 DOM 节点（或节点数组），只排版这些子树，避免每次重排整篇文档
  function typesetMath(scope) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      const arg = scope ? (Array.isArray(scope) ? scope : [scope]) : undefined;
      window.MathJax.typesetPromise(arg).then(markMathErrors).catch((e) => { console.warn("MathJax 失败：", e); markMathErrors(); });
    }
  }

  function markMathErrors() {
    document.querySelectorAll("mjx-merror").forEach((node) => {
      const formula = node.closest(".formula");
      if (!formula || formula.dataset.mathErrorMarked) return;
      formula.dataset.mathErrorMarked = "true";
      const w = document.createElement("div");
      w.className = "math-warning";
      w.textContent = `公式渲染异常：${formula.dataset.formulaCard || "unknown"}`;
      formula.appendChild(w);
    });
  }

  // 挂载单个 demo-box（已渲染过则跳过）
  function mountDemoBox(root) {
    if (!root || root.dataset.mounted === "true") return;
    root.dataset.mounted = "true";
    const type = root.dataset.demo;
    if (type === "limit-slider") renderLimitSlider(root);
    if (type === "taylor-plot") renderTaylorPlot(root);
    if (type === "tangent-line") renderTangentLine(root);
    if (type === "riemann-sum") renderRiemannSum(root);
    if (type === "wallis-recursion") renderWallis(root);
    if (type === "unit-circle") renderUnitCircle(root);
    if (type === "matrix-transform") renderMatrixTransform(root);
    if (type === "distribution-plot") renderDistribution(root);
    if (type === "clt-demo") renderClt(root);
    if (type === "equivalent-compare") renderEquivalentCompare(root);
    if (type === "taylor-order-lab") renderTaylorOrderLab(root);
    if (type === "trig-transform-lab") renderTrigTransformLab(root);
    if (type === "integral-method-picker") renderIntegralMethodPicker(root);
    if (type === "matrix-eigen-lab") renderMatrixEigenLab(root);
    if (type === "probability-distribution-lab") renderProbabilityDistributionLab(root);
  }

  // 懒挂载：demo 在其所属 <details> 首次展开时才构建（默认折叠则零开销）
  function setupLazyDemos(listEl) {
    if (!listEl || !listEl.querySelectorAll) return;
    listEl.querySelectorAll(".demo-box[data-demo]").forEach((root) => {
      const details = root.closest && root.closest("details");
      if (details && !details.open) {
        details.addEventListener("toggle", () => {
          if (details.open) listEl.querySelectorAll(`[data-card="${cssEscape(root.dataset.card)}"]`).forEach(mountDemoBox);
        }, { once: true });
      } else {
        // 无 details 包裹或已展开 → 立即挂载
        mountDemoBox(root);
      }
    });
  }

  const polyline = (pts) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const clamp = (x, mn, mx) => Math.max(mn, Math.min(mx, x));

  function renderLimitSlider(root) {
    root.innerHTML = `<div class="demo-controls"><label>x 接近 0：<input type="range" min="-0.9" max="0.9" step="0.001" value="0.2"></label></div><div class="demo-readout"></div>`;
    const input = root.querySelector("input"), out = root.querySelector(".demo-readout");
    const update = () => {
      const x = Number(input.value) || 1e-6, s = Math.abs(x) < 1e-8 ? 1e-8 : x;
      out.textContent = `x = ${s.toFixed(4)}\nsin(x)/x = ${(Math.sin(s)/s).toFixed(8)} → 1\nln(1+x)/x = ${(Math.log1p(s)/s).toFixed(8)} → 1\n(1-cos(x))/x² = ${((1-Math.cos(s))/(s*s)).toFixed(8)} → 0.5`;
    };
    input.addEventListener("input", update); update();
  }

  function renderTaylorPlot(root) {
    root.innerHTML = `
      <div class="lab-shell taylor-basic-shell">
        <div class="lab-header">
          <span class="lab-title">Taylor 曲线贴合实验室</span>
          <span class="lab-goal">目标：理解 Taylor 不是“硬背多项式”，而是在展开点附近用同阶导数信息逐步贴近原函数。</span>
        </div>
        <div class="demo-controls">
          <label>Taylor 阶数
            <input class="tp-order" type="range" min="1" max="5" step="2" value="3">
          </label>
          <span class="tp-label"></span>
        </div>
        <svg class="demo-svg" viewBox="0 0 520 280"></svg>
        <div class="tangent-readout tp-readout"></div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：局部近似、主项、等价无穷小、0/0 型极限、函数差值抵消。</span>
          <span class="insight-warn">易错提醒：乘除结构可直接用主项；加减结构必须检查低阶项是否抵消，必要时继续展开。</span>
          <span class="insight-task">小任务：先选 1 阶，再选 5 阶，对比 x=1 处误差；观察为什么只在 0 附近最可靠。</span>
        </div>
      </div>`;
    const input = root.querySelector(".tp-order");
    const label = root.querySelector(".tp-label");
    const svg = root.querySelector("svg");
    const readout = root.querySelector(".tp-readout");
    const update = () => {
      const order = Number(input.value);
      label.textContent = `用 sin(x) 的 ${order} 阶 Maclaurin 近似`;
      const xs = Array.from({length:160},(_,i)=>-Math.PI+(2*Math.PI*i)/159);
      const map = (x,y) => [260+x*70,140-y*82];
      const approx = x => order===1?x:order===3?x-x**3/6:x-x**3/6+x**5/120;
      const error = (x) => Math.sin(x) - approx(x);
      const probeX = 1;
      const nextTerm = order === 1 ? "\\(-x^3/6\\)" : order === 3 ? "\\(+x^5/120\\)" : "\\(-x^7/5040\\)";
      svg.innerHTML = `
        <line x1="0" y1="140" x2="520" y2="140" stroke="#d8dee9"/>
        <line x1="260" y1="0" x2="260" y2="280" stroke="#d8dee9"/>
        <polyline points="${polyline(xs.map(x=>map(x,Math.sin(x))))}" fill="none" stroke="#2563eb" stroke-width="3"/>
        <polyline points="${polyline(xs.map(x=>map(x,clamp(approx(x),-1.65,1.65))))}" fill="none" stroke="#b45f06" stroke-width="3"/>
        <polyline points="${polyline(xs.map(x=>map(x,clamp(error(x) * 4,-1.65,1.65))))}" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 5"/>
        <text x="20" y="30" fill="#2563eb" font-size="12">蓝：sin(x)</text>
        <text x="20" y="50" fill="#b45f06" font-size="12">橙：Taylor 多项式</text>
        <text x="20" y="70" fill="#ef4444" font-size="12">红虚线：误差 ×4</text>`;
      readout.innerHTML = `
        <div class="mini-stat-grid">
          <div><span>近似阶数</span><strong>${order} 阶</strong></div>
          <div><span>x=1 真值</span><strong>${Math.sin(probeX).toFixed(6)}</strong></div>
          <div><span>x=1 近似</span><strong>${approx(probeX).toFixed(6)}</strong></div>
          <div><span>x=1 误差</span><strong>${error(probeX).toExponential(2)}</strong></div>
        </div>
        <p><strong>理解方式：</strong>展开到 ${order} 阶，等于让多项式在 0 点匹配到这一阶的导数信息；下一项通常从 ${nextTerm} 开始，所以越靠近 0，误差越快变小。做极限时不要盲目展开很多项，先判断题目是否有低阶抵消。</p>`;
    };
    input.addEventListener("input", update); update();
  }

  function renderTangentLine(root) {
    root.innerHTML = `
      <div class="lab-shell tangent-shell">
        <div class="lab-header">
          <span class="lab-title">切线与导数实验室</span>
          <span class="lab-goal">目标：看清“割线斜率趋近切线斜率”，并把导数翻译成切线方程和局部线性近似。</span>
        </div>
        <div class="demo-controls tangent-controls">
          <label>切点 x₀
            <input class="tan-x0" type="range" min="-2" max="2" step="0.01" value="0.8">
          </label>
          <label>邻近点距离 h
            <input class="tan-h" type="range" min="0.05" max="1.2" step="0.01" value="0.65">
          </label>
        </div>
        <svg class="demo-svg tangent-svg" viewBox="0 0 520 280"></svg>
        <div class="tangent-readout"></div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：切线、法线、局部近似、函数增量、参数曲线斜率。</span>
          <span class="insight-warn">易错提醒：竖直切线不能套普通点斜式；参数方程必须先算 dy/dx=(dy/dt)/(dx/dt)。</span>
          <span class="insight-task">小任务：把 h 拖到最小，观察割线斜率如何靠近 2x₀；再改变 x₀，看切线方向如何同步变化。</span>
        </div>
      </div>`;
    const xInput = root.querySelector(".tan-x0");
    const hInput = root.querySelector(".tan-h");
    const readout = root.querySelector(".tangent-readout");
    const svg = root.querySelector("svg");
    const update = () => {
      const x0 = Number(xInput.value);
      const h = Number(hInput.value);
      const x1 = Math.min(2.2, x0 + h);
      const y0 = x0 * x0;
      const y1 = x1 * x1;
      const tangentSlope = 2 * x0;
      const secantSlope = (y1 - y0) / (x1 - x0);
      const slopeError = secantSlope - tangentSlope;
      const xs = Array.from({length:140},(_,i)=>-2.25+4.5*i/139);
      const map = (x,y) => [260+x*92,245-y*43];
      const [px, py] = map(x0, y0);
      const [qx, qy] = map(x1, y1);
      const tangent = (x) => y0 + tangentSlope * (x - x0);
      const secant = (x) => y0 + secantSlope * (x - x0);
      svg.innerHTML = `
        <line x1="0" y1="245" x2="520" y2="245" stroke="#d8dee9"/>
        <line x1="260" y1="0" x2="260" y2="280" stroke="#d8dee9"/>
        <polyline points="${polyline(xs.map(x => map(x, x*x)))}" fill="none" stroke="#2563eb" stroke-width="3"/>
        <polyline points="${polyline(xs.map(x => map(x, tangent(x))))}" fill="none" stroke="#b45f06" stroke-width="3"/>
        <polyline points="${polyline(xs.map(x => map(x, secant(x))))}" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="7 5"/>
        <line x1="${px}" y1="${py}" x2="${qx}" y2="${qy}" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="4 4"/>
        <circle cx="${px}" cy="${py}" r="5.5" fill="#b45f06"/>
        <circle cx="${qx}" cy="${qy}" r="4.5" fill="#ef4444"/>
        <text x="22" y="28" fill="#2563eb" font-size="12">曲线 f(x)=x²</text>
        <text x="22" y="48" fill="#b45f06" font-size="12">橙线：切线 y=f(x₀)+f'(x₀)(x-x₀)</text>
        <text x="22" y="68" fill="#ef4444" font-size="12">红虚线：割线，h 越小越贴近切线</text>`;
      readout.innerHTML = `
        <div class="mini-stat-grid">
          <div><span>切点</span><strong>(${x0.toFixed(2)}, ${y0.toFixed(2)})</strong></div>
          <div><span>导数斜率 f'(x₀)</span><strong>${tangentSlope.toFixed(3)}</strong></div>
          <div><span>割线斜率</span><strong>${secantSlope.toFixed(3)}</strong></div>
          <div><span>斜率误差</span><strong>${slopeError >= 0 ? "+" : ""}${slopeError.toFixed(3)}</strong></div>
        </div>
        <p><strong>考场步骤：</strong>先求切点 \\((x_0,f(x_0))\\)，再求斜率 \\(f'(x_0)\\)，最后写 \\(y-f(x_0)=f'(x_0)(x-x_0)\\)。法线斜率通常取 \\(-1/f'(x_0)\\)，但 \\(f'(x_0)=0\\) 或斜率不存在时要单独讨论。</p>`;
    };
    xInput.addEventListener("input", update);
    hInput.addEventListener("input", update);
    update();
  }

  function renderRiemannSum(root) {
    // ── 定积分面积实验室（重构版）──────────────────────────────────────────────
    root.innerHTML = `
      <div class="lab-shell rs-shell">
        <div class="lab-header">
          <span class="lab-title">定积分面积实验室</span>
          <span class="lab-goal">目标：理解黎曼和 → 定积分的极限过程，以及左/右/中点对单调函数的高估/低估差异</span>
        </div>
        <div class="rs-ctrl-row">
          <div class="rs-mode-bar">
            <button class="rs-mode active" data-m="right">右端点</button>
            <button class="rs-mode" data-m="left">左端点</button>
            <button class="rs-mode" data-m="mid">中点</button>
          </div>
          <label class="lab-ctrl-label">分割数 n
            <span class="lab-ctrl-hint">n 越大，矩形越细，误差越小</span>
            <input class="lab-range rs-n" type="range" min="2" max="60" step="1" value="8">
            <span class="lab-range-val rs-nv">8</span>
          </label>
        </div>
        <svg class="demo-svg rs-svg" viewBox="0 0 520 240"></svg>
        <div class="rs-stats" id="rs-stats"></div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：定积分定义 · 极限和 · 变上限函数 · 面积计算</span>
          <span class="insight-warn">⚠ 右端点和对递增函数是上和（高估），左端点是下和（低估）；中点和误差阶更优</span>
          <span class="insight-task">📌 小任务：先调 n=4 看误差，再调 n=40，对比误差如何从 ~0.08 缩小到 ~0.008</span>
        </div>
      </div>`;

    const nInp   = root.querySelector('.rs-n');
    const nVal   = root.querySelector('.rs-nv');
    const svg    = root.querySelector('.rs-svg');
    const stats  = root.querySelector('#rs-stats');
    const TRUE_VAL = 1/3; // ∫₀¹ x² dx

    let mode = 'right';
    root.querySelectorAll('.rs-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.rs-mode').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = btn.dataset.m;
        update();
      });
    });

    const update = () => {
      const n = Number(nInp.value);
      nVal.textContent = n;
      const dx = 1/n;
      const L = 50, R = 470, B = 215, T = 20;
      const W = R-L, H = B-T;
      const mx = x => L + x*W;
      const my = y => B - y*H;

      let sum = 0, bars = '';
      for (let i = 0; i < n; i++) {
        const xL = i*dx, xR = (i+1)*dx;
        const xSample = mode === 'right' ? xR : mode === 'left' ? xL : (xL+xR)/2;
        const h = xSample*xSample;
        sum += h*dx;
        const px = mx(xL), pw = W*dx, ph = h*H;
        bars += `<rect x="${px.toFixed(1)}" y="${(my(h)).toFixed(1)}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" fill="rgba(180,95,6,0.30)" stroke="#b45f06" stroke-width="0.8"/>`;
      }
      // curve f(x) = x²
      const curvePts = Array.from({length:100}, (_,i) => i/99).map(x => `${mx(x).toFixed(1)},${my(x*x).toFixed(1)}`).join(' ');
      const err = sum - TRUE_VAL;
      const overunder = mode === 'mid' ? '中点（误差阶 O(1/n²)）'
        : err > 0.001 ? '上和（高估）' : err < -0.001 ? '下和（低估）' : '≈ 精确';

      svg.innerHTML = `
        <line x1="${L}" y1="${B}" x2="${R}" y2="${B}" stroke="#94a3b8" stroke-width="1.5"/>
        <line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#94a3b8" stroke-width="1.5"/>
        ${bars}
        <polyline points="${curvePts}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
        <text x="${L+2}" y="${T+12}" fill="#2563eb" font-size="11">f(x)=x²</text>
        <text x="${R-4}" y="${B-4}" fill="#94a3b8" font-size="10" text-anchor="end">x=1</text>`;

      stats.innerHTML = `
        <div class="rs-stat"><span>n</span><strong>${n}</strong></div>
        <div class="rs-stat"><span>黎曼和</span><strong>${sum.toFixed(6)}</strong></div>
        <div class="rs-stat"><span>真实值 1/3</span><strong>${TRUE_VAL.toFixed(6)}</strong></div>
        <div class="rs-stat rs-err ${Math.abs(err)<0.01?'rs-good':'rs-bad'}">
          <span>误差</span><strong>${err>0?'+':''}${err.toFixed(6)}</strong>
        </div>
        <div class="rs-stat rs-type"><span>类型</span><strong>${overunder}</strong></div>`;
    };

    nInp.addEventListener('input', update);
    update();
  }

  function renderWallis(root) {
    // ── Wallis 递推阶梯（重构版）────────────────────────────────────────────────
    // I_n = ∫₀^{π/2} sinⁿx dx,  I_n = (n-1)/n · I_{n-2}
    const Ival = n => {
      if (n === 0) return Math.PI/2;
      if (n === 1) return 1;
      let v = n % 2 === 0 ? Math.PI/2 : 1;
      for (let k = n % 2 === 0 ? 2 : 3; k <= n; k += 2) v *= (k-1)/k;
      return v;
    };
    root.innerHTML = `
      <div class="lab-shell wal-shell">
        <div class="lab-header">
          <span class="lab-title">Wallis 递推阶梯</span>
          <span class="lab-goal">目标：理解 I_n 如何从 I₀/I₁ 逐步乘系数递推，以及为什么偶数含 π/2 而奇数不含</span>
        </div>
        <div class="lab-ctrl-row">
          <label class="lab-ctrl-label">n（积分阶数）
            <span class="lab-ctrl-hint">I_n = ∫₀^{π/2} sinⁿx dx</span>
            <input class="lab-range wal-n" type="range" min="0" max="14" step="1" value="6">
            <span class="lab-range-val wal-nv">6</span>
          </label>
        </div>
        <div class="wal-chain" id="wal-chain"></div>
        <div class="wal-panels">
          <div class="wal-panel wal-even">
            <div class="wal-panel-title">偶数 n：含 π/2</div>
            <div id="wal-even-formula"></div>
            <div class="wal-panel-why">因为从 I₀ = π/2 出发，π/2 因子始终保留</div>
          </div>
          <div class="wal-panel wal-odd">
            <div class="wal-panel-title">奇数 n：不含 π</div>
            <div id="wal-odd-formula"></div>
            <div class="wal-panel-why">因为从 I₁ = 1 出发，全是有理数乘积</div>
          </div>
        </div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：∫₀^{π/2} sinⁿx dx · 递推公式 · 高次三角定积分</span>
          <span class="insight-warn">⚠ Wallis 公式只对 [0,π/2]；其他区间要先换元或对称性化过来</span>
          <span class="insight-task">📌 小任务：拖到 n=6，验证 I₆ = (5/6)·(3/4)·(1/2)·(π/2) = 5π/32 ≈ 0.4909</span>
        </div>
      </div>`;

    const nInp   = root.querySelector('.wal-n');
    const nVal   = root.querySelector('.wal-nv');
    const chain  = root.querySelector('#wal-chain');
    const evenF  = root.querySelector('#wal-even-formula');
    const oddF   = root.querySelector('#wal-odd-formula');

    const update = () => {
      const n = Number(nInp.value);
      nVal.textContent = n;

      // build recursive chain from base to n
      const base = n % 2 === 0 ? 0 : 1;
      const steps = [];
      for (let k = base; k <= n; k += (k === base ? (k === 0 ? 2 : 2) : 2)) {
        steps.push(k);
        if (k === base && base === 1) { steps.push(3); continue; }
      }
      // simpler: just collect all relevant indices
      const chain_indices = [];
      for (let k = base; k <= n; k += (base === 0 ? 2 : 2)) chain_indices.push(k);

      chain.innerHTML = chain_indices.map((k, i) => {
        const val = Ival(k);
        const isTarget = k === n;
        const coef = k >= 2 ? `<span class="wal-coef">×${(k-1)}/${k}</span>` : '';
        return `${i > 0 ? `<span class="wal-arrow">${coef}→</span>` : ''}
          <div class="wal-step ${isTarget ? 'wal-step-target' : ''}">
            <div class="wal-step-label">I<sub>${k}</sub></div>
            <div class="wal-step-val">${val.toFixed(5)}</div>
          </div>`;
      }).join('');

      // even/odd formulas up to n=8 for display
      const buildFormula = (isEven) => {
        const maxN = Math.min(8, isEven ? 8 : 7);
        const rows = [];
        for (let k = (isEven ? 2 : 3); k <= maxN; k += 2) {
          const v = Ival(k);
          const coefs = [];
          for (let j = k; j >= 2; j -= 2) coefs.push(`${j-1}/${j}`);
          const base_str = isEven ? '·π/2' : '';
          rows.push(`<div class="wal-fml-row ${k===n?'wal-fml-hi':''}">
            I<sub>${k}</sub> = ${coefs.join('·')}${base_str} ≈ <code>${v.toFixed(5)}</code>
          </div>`);
        }
        return rows.join('');
      };
      evenF.innerHTML = buildFormula(true);
      oddF.innerHTML  = buildFormula(false);
    };

    nInp.addEventListener('input', update);
    update();
  }

  function renderUnitCircle(root) {
    // ── 单位圆三角实验室（重构版）──────────────────────────────────────────────
    const SPECIAL = [
      {deg:0,  s:'0',    c:'1',     t:'0'},
      {deg:30, s:'1/2',  c:'√3/2',  t:'√3/3'},
      {deg:45, s:'√2/2', c:'√2/2',  t:'1'},
      {deg:60, s:'√3/2', c:'1/2',   t:'√3'},
      {deg:90, s:'1',    c:'0',     t:'∞'},
      {deg:120,s:'√3/2', c:'-1/2',  t:'-√3'},
      {deg:135,s:'√2/2', c:'-√2/2', t:'-1'},
      {deg:150,s:'1/2',  c:'-√3/2', t:'-√3/3'},
      {deg:180,s:'0',    c:'-1',    t:'0'},
      {deg:210,s:'-1/2', c:'-√3/2', t:'√3/3'},
      {deg:225,s:'-√2/2',c:'-√2/2', t:'1'},
      {deg:240,s:'-√3/2',c:'-1/2',  t:'√3'},
      {deg:270,s:'-1',   c:'0',     t:'∞'},
      {deg:300,s:'-√3/2',c:'1/2',   t:'-√3'},
      {deg:315,s:'-√2/2',c:'√2/2',  t:'-1'},
      {deg:330,s:'-1/2', c:'√3/2',  t:'-√3/3'},
    ];

    root.innerHTML = `
      <div class="lab-shell uc-shell">
        <div class="lab-header">
          <span class="lab-title">单位圆三角实验室</span>
          <span class="lab-goal">目标：在圆上「看见」sin/cos/tan 的几何含义，理解象限符号和诱导公式</span>
        </div>
        <div class="lab-ctrl-row">
          <label class="lab-ctrl-label">角度 θ
            <span class="lab-ctrl-hint">拖动旋转，观察各投影线长度变化</span>
            <input class="lab-range uc-deg" type="range" min="0" max="359" step="1" value="45">
            <span class="lab-range-val uc-dv">45°</span>
          </label>
        </div>
        <div class="uc-body">
          <svg class="uc-svg" viewBox="0 0 300 300"></svg>
          <div class="uc-info">
            <div class="uc-vals" id="uc-vals"></div>
            <div class="uc-special" id="uc-special"></div>
            <div class="uc-induction" id="uc-induction"></div>
          </div>
        </div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：三角函数值 · 象限判断 · 诱导公式 · 同角关系</span>
          <span class="insight-warn">⚠ 最常错：角度制/弧度制混用；cos=0 时 tan 不存在；第二象限 sin>0 但 cos<0</span>
          <span class="insight-task">📌 小任务：拖到 150°，观察 sin=1/2>0（y轴投影正）而 cos=-√3/2<0（x轴投影负）</span>
        </div>
      </div>`;

    const degInp  = root.querySelector('.uc-deg');
    const dvSpan  = root.querySelector('.uc-dv');
    const svg     = root.querySelector('.uc-svg');
    const valsEl  = root.querySelector('#uc-vals');
    const specEl  = root.querySelector('#uc-special');
    const indEl   = root.querySelector('#uc-induction');

    const cx=150, cy=150, r=100;

    const update = () => {
      const deg = Number(degInp.value);
      dvSpan.textContent = deg + '°';
      const rad = deg * Math.PI/180;
      const sinV = Math.sin(rad), cosV = Math.cos(rad);
      const tanV = Math.abs(cosV) < 1e-9 ? null : sinV/cosV;
      const px = cx + r*cosV, py = cy - r*sinV;

      // quadrant
      const quad = cosV>1e-9&&sinV>1e-9?'第一象限 sin>0 cos>0 tan>0'
                 : cosV<-1e-9&&sinV>1e-9?'第二象限 sin>0 cos<0 tan<0'
                 : cosV<-1e-9&&sinV<-1e-9?'第三象限 sin<0 cos<0 tan>0'
                 : cosV>1e-9&&sinV<-1e-9?'第四象限 sin<0 cos>0 tan<0'
                 : '坐标轴上';

      // arc
      const arcPts = Array.from({length:32}, (_,i) => {
        const a = i/31*rad;
        return `${(cx+28*Math.cos(a)).toFixed(1)},${(cy-28*Math.sin(a)).toFixed(1)}`;
      }).join(' ');

      // tan line: x = r on unit circle → tan is height at x=r
      let tanLine = '';
      if (tanV !== null && Math.abs(tanV) < 6) {
        const ty = cy - r*tanV;
        tanLine = `<line x1="${cx+r}" y1="${cy}" x2="${cx+r}" y2="${ty.toFixed(1)}" stroke="#7e22ce" stroke-width="2.5"/>
          <circle cx="${cx+r}" cy="${ty.toFixed(1)}" r="4" fill="#7e22ce"/>
          <line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${ty.toFixed(1)}" stroke="#7e22ce" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.5"/>`;
      }

      svg.innerHTML = `
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f8fafc" stroke="#bfdbfe" stroke-width="1.5"/>
        <line x1="${cx-r-18}" y1="${cy}" x2="${cx+r+22}" y2="${cy}" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="${cx}" y1="${cy+r+18}" x2="${cx}" y2="${cy-r-18}" stroke="#e2e8f0" stroke-width="1"/>
        ${arcPts.length>2?`<polyline points="${arcPts}" fill="none" stroke="#94a3b8" stroke-width="1.5"/>`:''}
        <text x="${cx+14}" y="${cy-12}" fill="#94a3b8" font-size="10">θ</text>
        <line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${cy}" stroke="#7e22ce" stroke-width="2" stroke-dasharray="4,3"/>
        <line x1="${px.toFixed(1)}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#15803d" stroke-width="2.5"/>
        <line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#f59e0b" stroke-width="2.5"/>
        ${tanLine}
        <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="5" fill="#f59e0b" stroke="white" stroke-width="1.5"/>
        <text x="8" y="18" fill="#f59e0b" font-size="10">黄=半径 r=1</text>
        <text x="8" y="30" fill="#15803d" font-size="10">绿=sin（y投影）</text>
        <text x="8" y="42" fill="#7e22ce" font-size="10">紫=cos（x投影）</text>
        ${tanV!==null&&Math.abs(tanV)<6?'<text x="8" y="54" fill="#7e22ce" font-size="10">深紫=tan正切线</text>':''}`;

      // vals
      const tanStr = tanV===null ? '不存在（cos=0）' : tanV.toFixed(5);
      const tanClass = tanV===null ? 'uc-val-na' : '';
      valsEl.innerHTML = `
        <div class="uc-val-row"><span class="uc-vl">θ</span><code>${deg}° = ${rad.toFixed(4)} rad</code></div>
        <div class="uc-val-row"><span class="uc-vl">象限</span><code>${quad}</code></div>
        <div class="uc-val-row"><span class="uc-vl" style="color:#15803d">sin θ</span><code>${sinV.toFixed(6)}</code></div>
        <div class="uc-val-row"><span class="uc-vl" style="color:#7e22ce">cos θ</span><code>${cosV.toFixed(6)}</code></div>
        <div class="uc-val-row ${tanClass}"><span class="uc-vl">tan θ</span><code>${tanStr}</code></div>`;

      // special angle match (within 2°)
      const sp = SPECIAL.find(s => Math.abs(s.deg - deg) <= 2);
      if (sp) {
        specEl.innerHTML = `<div class="uc-special-badge">⭐ 特殊角 ${sp.deg}°：sin=${sp.s}，cos=${sp.c}，tan=${sp.t}</div>`;
      } else {
        specEl.innerHTML = '';
      }

      // induction formulas
      const r180 = 180 - deg, r360 = 360 - deg;
      indEl.innerHTML = `<div class="uc-ind-title">诱导公式</div>
        <div class="uc-ind-row">π−θ（${r180}°）：sin=+sin θ，cos=−cos θ</div>
        <div class="uc-ind-row">π+θ（${(180+deg)%360}°）：sin=−sin θ，cos=−cos θ</div>
        <div class="uc-ind-row">2π−θ（${r360}°）：sin=−sin θ，cos=+cos θ</div>`;
    };

    degInp.addEventListener('input', update);
    update();
  }

  function renderMatrixTransform(root) {
    root.innerHTML = `
      <div class="lab-shell matrix-basic-shell">
        <div class="lab-header">
          <span class="lab-title">2D 矩阵变换实验室</span>
          <span class="lab-goal">目标：把矩阵看成“移动基向量”的几何操作，并用行列式理解面积缩放和方向翻转。</span>
        </div>
        <div class="demo-controls matrix-basic-controls">
          <span>矩阵 \\(A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\)</span>
          <input data-m="a" type="number" step="0.1" value="1.2" aria-label="a">
          <input data-m="b" type="number" step="0.1" value="0.4" aria-label="b">
          <input data-m="c" type="number" step="0.1" value="-0.3" aria-label="c">
          <input data-m="d" type="number" step="0.1" value="1.0" aria-label="d">
        </div>
        <svg class="demo-svg" viewBox="0 0 520 290"></svg>
        <div class="matrix-basic-readout"></div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：线性变换、基向量、行列式、面积缩放、可逆、秩。</span>
          <span class="insight-warn">易错提醒：列向量约定下，矩阵第一列就是 \\(e_1\\) 的像，第二列就是 \\(e_2\\) 的像；不要把行和列读反。</span>
          <span class="insight-task">小任务：令两列成比例，观察平行四边形塌成线段，此时 det=0，矩阵不可逆。</span>
        </div>
      </div>`;
    const inputs = root.querySelectorAll("input"), svg = root.querySelector("svg"), out = root.querySelector(".matrix-basic-readout");
    const update = () => {
      const v = Object.fromEntries([...inputs].map(i=>[i.dataset.m,Number(i.value)||0]));
      const det = v.a * v.d - v.b * v.c;
      const map = ([x,y]) => [260+x*68,155-y*68];
      const t = ([x,y]) => [v.a*x+v.b*y,v.c*x+v.d*y];
      const unit = [[0,0],[1,0],[1,1],[0,1],[0,0]].map(map);
      const sq = [[0,0],[1,0],[1,1],[0,1],[0,0]].map(t).map(map);
      const origin = map([0,0]);
      const e1=map(t([1,0])), e2=map(t([0,1]));
      const detMeaning = Math.abs(det) < 1e-6 ? "面积塌缩，矩阵不可逆" : det > 0 ? "保持方向，面积放大/缩小" : "方向翻转，面积倍率取绝对值";
      svg.innerHTML = `
        <defs>
          <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#2563eb"/>
          </marker>
          <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#15803d"/>
          </marker>
        </defs>
        <line x1="0" y1="${origin[1]}" x2="520" y2="${origin[1]}" stroke="#d8dee9"/>
        <line x1="${origin[0]}" y1="0" x2="${origin[0]}" y2="290" stroke="#d8dee9"/>
        <polyline points="${polyline(unit)}" fill="rgba(148,163,184,0.12)" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
        <polyline points="${polyline(sq)}" fill="rgba(180,95,6,0.20)" stroke="#b45f06" stroke-width="3"/>
        <line x1="${origin[0]}" y1="${origin[1]}" x2="${e1[0]}" y2="${e1[1]}" stroke="#2563eb" stroke-width="4" marker-end="url(#arrow-blue)"/>
        <line x1="${origin[0]}" y1="${origin[1]}" x2="${e2[0]}" y2="${e2[1]}" stroke="#15803d" stroke-width="4" marker-end="url(#arrow-green)"/>
        <text x="18" y="28" fill="#94a3b8" font-size="12">灰虚线：原单位方格</text>
        <text x="18" y="48" fill="#b45f06" font-size="12">橙色：变换后的单位方格</text>
        <text x="18" y="68" fill="#2563eb" font-size="12">蓝：A e₁=第一列</text>
        <text x="18" y="88" fill="#15803d" font-size="12">绿：A e₂=第二列</text>`;
      out.innerHTML = `
        <div class="mini-stat-grid">
          <div><span>det(A)</span><strong>${det.toFixed(3)}</strong></div>
          <div><span>面积倍率</span><strong>${Math.abs(det).toFixed(3)}</strong></div>
          <div><span>Ae₁</span><strong>(${v.a.toFixed(2)}, ${v.c.toFixed(2)})</strong></div>
          <div><span>Ae₂</span><strong>(${v.b.toFixed(2)}, ${v.d.toFixed(2)})</strong></div>
        </div>
        <p><strong>几何解释：</strong>${detMeaning}。列向量线性相关时平行四边形面积为 0，对应 \\(\\det A=0\\)、秩不足、不可逆；这也是线代里“行列式、秩、方程组唯一解”互相连接的核心图像。</p>`;
    };
    inputs.forEach(i=>i.addEventListener("input", update)); update();
  }

  function renderDistribution(root) {
    // ── 分布工作台（重构版）────────────────────────────────────────────────────
    // 共用辅助：标准正态 PDF（distribution + clt 都用）
    const npdf = (x, mu, sigma) => Math.exp(-0.5*((x-mu)/sigma)**2) / (sigma*Math.sqrt(2*Math.PI));
    const fact = n => n<=1?1:Array.from({length:n},(_,i)=>i+1).reduce((a,b)=>a*b,1);

    const DISTS = {
      normal:  {
        label:'正态分布', paramLabel:'σ（标准差）', min:0.3, max:3, step:0.1, init:1,
        mean: p=>'0', variance: p=>`σ²=${(p*p).toFixed(2)}`,
        scene:'连续型总体、误差分布、CLT 的极限分布',
        warn:'标准化：Z=(X−μ)/σ ～ N(0,1)；千万别把 σ² 和 σ 混用',
        pts: (p,L,R,B,H) => {
          return Array.from({length:180},(_,i)=>-4+8*i/179).map(x=>{
            const px=L+(x+4)/(8)*(R-L), py=B-Math.min(H-4,npdf(x,0,p)*(R-L)*0.5);
            return `${px.toFixed(1)},${py.toFixed(1)}`;
          });
        },
        discrete:false
      },
      binomial:{
        label:'二项分布', paramLabel:'p（成功概率）', min:0.05, max:0.95, step:0.05, init:0.4,
        mean: p=>`np = 10×${p.toFixed(2)}=${(10*p).toFixed(2)}`,
        variance: p=>`np(1-p)=${(10*p*(1-p)).toFixed(3)}`,
        scene:'n次独立重复试验成功次数，例如打靶命中数',
        warn:'n 固定取 10；p=0.5 时对称，偏大偏小时右/左偏',
        pts:(p,L,R,B,H)=>{
          const n=10;
          return Array.from({length:n+1},(_,k)=>{
            const prob=fact(n)/(fact(k)*fact(n-k))*Math.pow(p,k)*Math.pow(1-p,n-k);
            const px=L+k/(n)*(R-L), py=B-Math.min(H-4,prob*(H-4)*4.5);
            return {px,py,prob,k};
          });
        },
        discrete:true
      },
      poisson: {
        label:'泊松分布', paramLabel:'λ（均值）', min:0.5, max:8, step:0.5, init:3,
        mean: p=>`λ=${p.toFixed(1)}`, variance: p=>`λ=${p.toFixed(1)}`,
        scene:'单位时间/空间内的事件次数（电话到达、缺陷数）',
        warn:'均值=方差=λ；λ 较大时近似正态，但考场还是按泊松算',
        pts:(p,L,R,B,H)=>{
          const maxK=Math.min(20,Math.ceil(p+4*Math.sqrt(p)));
          return Array.from({length:maxK+1},(_,k)=>{
            const prob=Math.exp(-p)*Math.pow(p,k)/fact(k);
            const px=L+k/maxK*(R-L), py=B-Math.min(H-4,prob*(H-4)*5);
            return {px,py,prob,k};
          });
        },
        discrete:true
      },
      exponential:{
        label:'指数分布', paramLabel:'λ（速率参数）', min:0.3, max:4, step:0.1, init:1,
        mean: p=>`1/λ=${(1/p).toFixed(2)}`, variance: p=>`1/λ²=${(1/(p*p)).toFixed(3)}`,
        scene:'等待时间、寿命模型；无记忆性是关键性质',
        warn:'均值=1/λ，不是 λ；考场常混淆均值和参数',
        pts:(p,L,R,B,H)=>{
          return Array.from({length:160},(_,i)=>i/159*5).map(x=>{
            const px=L+x/5*(R-L), py=B-Math.min(H-4,p*Math.exp(-p*x)*(H-4)*0.92);
            return `${px.toFixed(1)},${py.toFixed(1)}`;
          });
        },
        discrete:false
      },
    };

    root.innerHTML = `
      <div class="lab-shell dst-shell">
        <div class="lab-header">
          <span class="lab-title">概率分布工作台</span>
          <span class="lab-goal">目标：理解四种常见分布的形状、参数含义、均值方差，以及什么场景想到它</span>
        </div>
        <div class="dst-tab-bar">
          ${Object.entries(DISTS).map(([k,d])=>`<button class="dst-tab${k==='normal'?' active':''}" data-d="${k}">${d.label}</button>`).join('')}
        </div>
        <div class="lab-ctrl-row">
          <label class="lab-ctrl-label dst-plabel">
            <span class="dst-plabel-text"></span>
            <input class="lab-range dst-p" type="range">
            <span class="lab-range-val dst-pv"></span>
          </label>
        </div>
        <svg class="demo-svg dst-svg" viewBox="0 0 520 220"></svg>
        <div class="dst-stats" id="dst-stats"></div>
        <div class="lab-insight">
          <span class="insight-trigger" id="dst-scene"></span>
          <span class="insight-warn" id="dst-warn"></span>
          <span class="insight-task">📌 小任务：切到「二项分布」，把 p 从 0.1 拖到 0.9，观察图像从右偏变左偏</span>
        </div>
      </div>`;

    const tabBtns = root.querySelectorAll('.dst-tab');
    const pInp    = root.querySelector('.dst-p');
    const pVal    = root.querySelector('.dst-pv');
    const pLabel  = root.querySelector('.dst-plabel-text');
    const svg     = root.querySelector('.dst-svg');
    const statsEl = root.querySelector('#dst-stats');
    const sceneEl = root.querySelector('#dst-scene');
    const warnEl  = root.querySelector('#dst-warn');

    let curDist = 'normal';

    const draw = () => {
      const d = DISTS[curDist];
      const p = Number(pInp.value);
      pVal.textContent = p.toFixed(2);
      const L=50, R=500, B=205, H=B-10;

      let svgBody = `<line x1="${L-5}" y1="${B}" x2="${R+5}" y2="${B}" stroke="#cbd5e1" stroke-width="1.5"/>
        <line x1="${L}" y1="8" x2="${L}" y2="${B}" stroke="#cbd5e1" stroke-width="1.5"/>`;

      if (d.discrete) {
        const bars = d.pts(p, L, R, B, H);
        bars.forEach(({px,py,prob,k}) => {
          const bw = Math.max(2, (R-L)/bars.length*0.7);
          svgBody += `<rect x="${(px-bw/2).toFixed(1)}" y="${py.toFixed(1)}" width="${bw.toFixed(1)}" height="${(B-py).toFixed(1)}" fill="#3b82f6" opacity="0.75"/>`;
          if (bars.length <= 12) {
            svgBody += `<text x="${px.toFixed(1)}" y="${(py-3).toFixed(1)}" fill="#1d4ed8" font-size="9" text-anchor="middle">${(prob*100).toFixed(1)}%</text>`;
          }
        });
      } else {
        const pts = d.pts(p, L, R, B, H);
        const fillPts = [`${L},${B}`, ...pts, `${R},${B}`].join(' ');
        svgBody += `<polygon points="${fillPts}" fill="rgba(59,130,246,.15)"/>`;
        svgBody += `<polyline points="${pts.join(' ')}" fill="none" stroke="#2563eb" stroke-width="2.5"/>`;
      }

      svg.innerHTML = svgBody;

      statsEl.innerHTML = `
        <div class="dst-stat"><span>均值 E(X)</span><strong>${d.mean(p)}</strong></div>
        <div class="dst-stat"><span>方差 D(X)</span><strong>${d.variance(p)}</strong></div>`;
      sceneEl.textContent = '考研场景：' + d.scene;
      warnEl.textContent  = '⚠ ' + d.warn;
    };

    const switchDist = (key) => {
      curDist = key;
      const d = DISTS[key];
      pInp.min   = d.min;
      pInp.max   = d.max;
      pInp.step  = d.step;
      pInp.value = d.init;
      pLabel.textContent = d.paramLabel;
      tabBtns.forEach(b => b.classList.toggle('active', b.dataset.d === key));
      draw();
    };

    tabBtns.forEach(b => b.addEventListener('click', () => switchDist(b.dataset.d)));
    pInp.addEventListener('input', draw);
    switchDist('normal');
  }

  function renderClt(root) {
    // ── CLT 演示（重构版）── 共用 npdf（内联）
    const npdf = (x, mu, sigma) => Math.exp(-0.5*((x-mu)/sigma)**2) / (sigma*Math.sqrt(2*Math.PI));

    root.innerHTML = `
      <div class="lab-shell clt-shell">
        <div class="lab-header">
          <span class="lab-title">中心极限定理演示</span>
          <span class="lab-goal">目标：看到样本量 n 增大时，样本均值分布如何变窄、变正态（σ²/n 压缩方差）</span>
        </div>
        <div class="lab-ctrl-row">
          <label class="lab-ctrl-label">样本量 n
            <span class="lab-ctrl-hint">↑ n 越大，钟形越窄，方差越小</span>
            <input class="lab-range clt-n" type="range" min="1" max="60" step="1" value="5">
            <span class="lab-range-val clt-nv">5</span>
          </label>
          <label class="lab-ctrl-label">总体 σ
            <span class="lab-ctrl-hint">总体标准差（固定时看压缩效果）</span>
            <input class="lab-range clt-sigma" type="range" min="0.5" max="3" step="0.1" value="1">
            <span class="lab-range-val clt-sv">1.0</span>
          </label>
        </div>
        <svg class="demo-svg clt-svg" viewBox="0 0 520 220"></svg>
        <div class="clt-stats" id="clt-stats"></div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：样本均值 · 方差 σ²/n · 标准化 Z=(X̄−μ)/(σ/√n) · 正态近似</span>
          <span class="insight-warn">⚠ CLT 要求独立同分布且方差有限；离散分布用正态近似时需连续性校正</span>
          <span class="insight-task">📌 小任务：把 n 从 1 拖到 50，观察曲线宽度如何从 σ 缩小到 σ/√50≈σ/7</span>
        </div>
      </div>`;

    const nInp    = root.querySelector('.clt-n');
    const sigInp  = root.querySelector('.clt-sigma');
    const nVal    = root.querySelector('.clt-nv');
    const sVal    = root.querySelector('.clt-sv');
    const svg     = root.querySelector('.clt-svg');
    const statsEl = root.querySelector('#clt-stats');

    const update = () => {
      const n = Number(nInp.value), sigma = Number(sigInp.value);
      nVal.textContent = n; sVal.textContent = sigma.toFixed(1);
      const sigmaMean = sigma / Math.sqrt(n);  // σ/√n
      const L=40, R=500, B=205, mu=0;
      // draw original population N(0,σ) in gray, sample mean N(0,σ/√n) in orange
      const xs = Array.from({length:200}, (_,i) => -4*sigma + 8*sigma*i/199);
      const scaleX = x => L + (x + 4*sigma) / (8*sigma) * (R-L);
      const scaleY = (y, peak) => B - Math.min(B-10, y/peak*(B-25));
      const peakPop  = npdf(0, 0, sigma);
      const peakMean = npdf(0, 0, sigmaMean);
      const peakMax  = Math.max(peakPop, peakMean);

      const popPts  = xs.map(x => `${scaleX(x).toFixed(1)},${(B - Math.min(B-10, npdf(x,0,sigma)/peakMax*(B-25))).toFixed(1)}`);
      const meanPts = xs.map(x => `${scaleX(x).toFixed(1)},${(B - Math.min(B-10, npdf(x,0,sigmaMean)/peakMax*(B-25))).toFixed(1)}`);

      // filled area under sample mean curve
      const fillPts = [`${L},${B}`, ...meanPts, `${R},${B}`].join(' ');

      svg.innerHTML = `
        <line x1="${L}" y1="${B}" x2="${R}" y2="${B}" stroke="#e2e8f0" stroke-width="1.5"/>
        <line x1="${(scaleX(0)).toFixed(1)}" y1="5" x2="${(scaleX(0)).toFixed(1)}" y2="${B}" stroke="#e2e8f0" stroke-dasharray="4"/>
        <polyline points="${popPts.join(' ')}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,3"/>
        <polygon  points="${fillPts}" fill="rgba(180,95,6,.15)"/>
        <polyline points="${meanPts.join(' ')}" fill="none" stroke="#b45f06" stroke-width="2.5"/>
        <text x="${L+4}" y="20" fill="#94a3b8" font-size="11">总体 N(0,${sigma.toFixed(1)}) (灰虚)</text>
        <text x="${L+4}" y="34" fill="#b45f06" font-size="11">样本均值 N(0,${sigmaMean.toFixed(3)}) (橙)</text>`;

      statsEl.innerHTML = `
        <div class="clt-stat"><span>总体方差 σ²</span><strong>${(sigma*sigma).toFixed(3)}</strong></div>
        <div class="clt-stat"><span>样本均值方差 σ²/n</span><strong>${(sigma*sigma/n).toFixed(4)}</strong></div>
        <div class="clt-stat"><span>样本均值标准差 σ/√n</span><strong>${sigmaMean.toFixed(4)}</strong></div>
        <div class="clt-stat clt-ratio"><span>压缩比 1/√n</span><strong>${(1/Math.sqrt(n)).toFixed(4)}</strong></div>`;
    };

    nInp.addEventListener('input', update);
    sigInp.addEventListener('input', update);
    update();
  }

  // ── equivalent-compare：无穷小等价实验室（重构版）────────────────────────────
  function renderEquivalentCompare(root) {
    // 三分区：等价（→1）/ 同阶不等价（→常数≠1）/ 加减陷阱（→主项）
    root.innerHTML = `
      <div class="lab-shell">
        <div class="lab-header">
          <span class="lab-title">无穷小等价实验室</span>
          <span class="lab-goal">目标：区分「可替换」和「不可替换」的场景，看比值极限决定一切</span>
        </div>
        <div class="lab-ctrl-row">
          <label class="lab-ctrl-label">x 趋近 0
            <span class="lab-ctrl-hint">拖动观察各比值在 x→0 时趋向哪个常数</span>
          </label>
          <input class="lab-range" type="range" min="-0.8" max="0.8" step="0.001" value="0.3">
          <span class="lab-range-val"></span>
        </div>
        <svg class="demo-svg ec-svg" viewBox="0 0 540 200"></svg>
        <div class="ec-grid">
          <div class="ec-zone ec-zone-eq">
            <div class="ec-zone-title">✅ 等价 → 1<br><small>乘除可直接替换</small></div>
            <div class="ec-rows" id="ec-eq"></div>
          </div>
          <div class="ec-zone ec-zone-ord">
            <div class="ec-zone-title">⚖️ 同阶 → 常数<br><small>有比值但不等价</small></div>
            <div class="ec-rows" id="ec-ord"></div>
          </div>
          <div class="ec-zone ec-zone-trap">
            <div class="ec-zone-title">⚠️ 加减陷阱 → 主项<br><small>必须 Taylor 找主项</small></div>
            <div class="ec-rows" id="ec-trap"></div>
          </div>
        </div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：乘除 → 等价替换；加减 → Taylor 主项法</span>
          <span class="insight-warn">⚠ 经典错误：lim(sin x − x)/x³ 把 sin x 换成 x 得 0，实际首项是 −x³/6，答案 −1/6</span>
          <span class="insight-task">📌 小任务：把 x 拖到 0.001，验证 (sin x−x)/x³ 确实趋近 −1/6 而不是 0</span>
        </div>
      </div>`;

    const inp = root.querySelector(".lab-range");
    const valSpan = root.querySelector(".lab-range-val");
    const eqEl = root.querySelector("#ec-eq");
    const ordEl = root.querySelector("#ec-ord");
    const trapEl = root.querySelector("#ec-trap");
    const svg = root.querySelector(".ec-svg");

    // 数据定义
    const eqFns = [
      { label: "sin x / x",    f: s => Math.sin(s)/s,             target: 1   },
      { label: "tan x / x",    f: s => Math.tan(s)/s,             target: 1   },
      { label: "ln(1+x) / x",  f: s => Math.log1p(s)/s,           target: 1   },
      { label: "(eˣ−1) / x",   f: s => (Math.exp(s)-1)/s,         target: 1   },
    ];
    const ordFns = [
      { label: "(1−cos x)/x²", f: s => (1-Math.cos(s))/(s*s),     target: 0.5 },
      { label: "(1−cos x)/(x/2)²", f: s => (1-Math.cos(s))/((s/2)**2), target: 2 },
    ];
    const trapFns = [
      { label: "(sin x−x)/x³", f: s => (Math.sin(s)-s)/(s**3),    target: -1/6  },
      { label: "(tan x−x)/x³", f: s => (Math.tan(s)-s)/(s**3),    target: 1/3   },
      { label: "(cos x−1)/x²", f: s => (Math.cos(s)-1)/(s**2),    target: -0.5  },
    ];

    // 折线数据：在 log 坐标下画收敛曲线
    const mkSvgLines = (fnDefs, colors, cx) => {
      const xs = Array.from({length:80}, (_,i) => 0.005 + (0.79-0.005)*i/79);
      return fnDefs.map((fd, fi) => {
        const pts = xs.map(x => {
          const v = fd.f(x);
          const px = cx + Math.log10(x/0.005) / Math.log10(0.79/0.005) * 160 - 80;
          const py = 100 - clamp((v - fd.target)*80, -85, 85);
          return `${px.toFixed(1)},${py.toFixed(1)}`;
        }).join(" ");
        return `<polyline points="${pts}" fill="none" stroke="${colors[fi % colors.length]}" stroke-width="2" opacity="0.85"/>`;
      }).join("");
    };

    const update = () => {
      const raw = Number(inp.value);
      const s = Math.abs(raw) < 1e-9 ? 1e-9 : raw;
      valSpan.textContent = `x = ${s.toFixed(4)}`;

      const fmt = (v, target) => {
        const diff = Math.abs(v - target);
        const pct = target !== 0 ? (diff / Math.abs(target) * 100).toFixed(2) : diff.toFixed(6);
        const bar = "█".repeat(Math.min(12, Math.round((1 - Math.min(diff,1))*12)));
        return `${v.toFixed(6)}  →${target}  偏差${target!==0?pct+"%":diff.toFixed(6)} ${bar}`;
      };

      eqEl.innerHTML = eqFns.map(fd =>
        `<div class="ec-row"><span class="ec-row-label">${fd.label}</span><span class="ec-row-val">${fmt(fd.f(s), fd.target)}</span></div>`
      ).join("");
      ordEl.innerHTML = ordFns.map(fd =>
        `<div class="ec-row"><span class="ec-row-label">${fd.label}</span><span class="ec-row-val">${fmt(fd.f(s), fd.target)}</span></div>`
      ).join("");
      trapEl.innerHTML = trapFns.map(fd =>
        `<div class="ec-row"><span class="ec-row-label">${fd.label}</span><span class="ec-row-val">${fmt(fd.f(s), fd.target)}</span></div>`
      ).join("");

      // SVG: 显示三个区域的极限收敛曲线
      const axisX = `<line x1="20" y1="100" x2="520" y2="100" stroke="#ccc" stroke-width="1"/>`;
      const linesEq   = mkSvgLines(eqFns,   ["#2563eb","#0ea5e9","#6366f1","#7c3aed"], 140);
      const linesOrd  = mkSvgLines(ordFns,  ["#f59e0b","#d97706"], 310);
      const linesTrap = mkSvgLines(trapFns, ["#ef4444","#dc2626","#f97316"], 450);
      const labels = [
        `<text x="70" y="16" fill="#2563eb" font-size="10" text-anchor="middle">等价 →1</text>`,
        `<text x="310" y="16" fill="#f59e0b" font-size="10" text-anchor="middle">同阶 →½</text>`,
        `<text x="450" y="16" fill="#ef4444" font-size="10" text-anchor="middle">加减主项</text>`,
        `<line x1="180" y1="5" x2="180" y2="195" stroke="#e5e7eb" stroke-dasharray="4"/>`,
        `<line x1="380" y1="5" x2="380" y2="195" stroke="#e5e7eb" stroke-dasharray="4"/>`,
      ].join("");
      const dot = `<circle cx="${20 + (Math.abs(s)/0.8)*500}" cy="100" r="4" fill="#1e293b" opacity="0.6"/>`;
      svg.innerHTML = axisX + labels + linesEq + linesOrd + linesTrap + dot;
    };

    inp.addEventListener("input", update);
    update();
  }

  // ── taylor-order-lab：Taylor 阶数选择实验室（重构版）────────────────────────
  function renderTaylorOrderLab(root) {
    // 两类题型：单函数展开 / 组合函数（展示抵消现象）
    const singles = {
      "sin x":   { f: x=>Math.sin(x),   terms:[[1,1,1],[3,-1,6],[5,1,120]], range:3.2 },
      "cos x":   { f: x=>Math.cos(x),   terms:[[0,1,1],[2,-1,2],[4,1,24]], range:3.2 },
      "eˣ":      { f: x=>Math.exp(x),   terms:[[0,1,1],[1,1,1],[2,1,2],[3,1,6]], range:2 },
      "ln(1+x)": { f: x=>Math.log1p(x), terms:[[1,1,1],[2,-1,2],[3,1,3]], range:0.9 },
    };
    // 组合函数：展示抵消后首非零项
    const combos = {
      "sin x − x":         { f: x=>Math.sin(x)-x,          approx: x=>(-(x**3))/6,      lead:"−x³/6", minOrder:3, note:"前两阶全抵消，首项在 x³" },
      "tan x − sin x":     { f: x=>Math.tan(x)-Math.sin(x), approx: x=>x**3/2,           lead:"x³/2",  minOrder:3, note:"分子/分母都要展到3阶才不消尽" },
      "cos x−1+x²/2":      { f: x=>Math.cos(x)-1+x*x/2,   approx: x=>x**4/24,          lead:"x⁴/24", minOrder:4, note:"四阶才出首项，二阶全抵消" },
      "eˣ−1−x":            { f: x=>Math.exp(x)-1-x,        approx: x=>x**2/2,           lead:"x²/2",  minOrder:2, note:"一阶抵消，首项在 x²" },
    };
    const sKeys = Object.keys(singles), cKeys = Object.keys(combos);

    root.innerHTML = `
      <div class="lab-shell">
        <div class="lab-header">
          <span class="lab-title">Taylor 阶数实验室</span>
          <span class="lab-goal">目标：理解为什么展开到"刚够消掉分子/分母"的那一阶——阶数不够，答案直接报废</span>
        </div>
        <div class="tol-tabs">
          <button class="tol-tab active" data-tab="single">单函数近似</button>
          <button class="tol-tab" data-tab="combo">组合函数抵消</button>
        </div>
        <div class="tol-panel" data-panel="single">
          <div class="lab-ctrl-row">
            <label class="lab-ctrl-label">函数
              <select class="tol-fn-sel">${sKeys.map(k=>`<option>${k}</option>`).join("")}</select>
            </label>
            <label class="lab-ctrl-label">展开阶数 n
              <span class="lab-ctrl-hint">↑ 阶数越高，橙色曲线贴得越紧</span>
              <input class="lab-range tol-order" type="range" min="1" max="5" step="1" value="1">
              <span class="tol-order-val">1</span>
            </label>
          </div>
          <svg class="demo-svg tol-svg" viewBox="0 0 520 260"></svg>
          <div class="tol-readout"></div>
        </div>
        <div class="tol-panel hidden" data-panel="combo">
          <div class="lab-ctrl-row">
            <label class="lab-ctrl-label">组合式
              <select class="tol-combo-sel">${cKeys.map(k=>`<option>${k}</option>`).join("")}</select>
            </label>
            <label class="lab-ctrl-label">x 范围（±）
              <input class="lab-range tol-xrange" type="range" min="0.2" max="1.5" step="0.05" value="0.8">
              <span class="tol-xrange-val">0.8</span>
            </label>
          </div>
          <svg class="demo-svg tol-combo-svg" viewBox="0 0 520 260"></svg>
          <div class="tol-combo-readout"></div>
        </div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：0/0 型 · sin x−x 要几阶 · 主项相消 · 抵消到哪层</span>
          <span class="insight-warn">⚠ 经典错误：(sin x−x)/x² 展到2阶得 0，答案误报。展到3阶才得 −1/6</span>
          <span class="insight-task">📌 小任务：切到「组合函数」，选 cos x−1+x²/2，确认首项在 x⁴</span>
        </div>
      </div>`;

    // tab 切换
    root.querySelectorAll(".tol-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        root.querySelectorAll(".tol-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        root.querySelectorAll(".tol-panel").forEach(p =>
          p.classList.toggle("hidden", p.dataset.panel !== btn.dataset.tab)
        );
      });
    });

    // ── 单函数面板 ──
    const fnSel = root.querySelector(".tol-fn-sel");
    const orderInp = root.querySelector(".tol-order");
    const orderVal = root.querySelector(".tol-order-val");
    const sSvg = root.querySelector(".tol-svg");
    const sOut = root.querySelector(".tol-readout");

    const updateSingle = () => {
      const key = fnSel.value, n = Number(orderInp.value);
      const info = singles[key];
      orderVal.textContent = n;
      const terms = info.terms.filter(([p]) => p <= n);
      const approxFn = x => terms.reduce((s,[p,c,d]) => s + c*Math.pow(x,p)/d, 0);
      const errFn = x => info.f(x) - approxFn(x);
      const R = info.range;
      const xs = Array.from({length:160}, (_,i) => -R + 2*R*i/159);
      const W = 520, H = 260, cx = W/2, cy = H/2, sx = (W-40)/(2*R), sy = 60;
      const mp = (x,y) => [cx + x*sx, cy - clamp(y,-2,2)*sy];
      const trueP  = polyline(xs.map(x => mp(x, info.f(x))));
      const approxP = polyline(xs.map(x => mp(x, approxFn(x))));
      // error curve scaled separately (×10 for visibility)
      const errScale = 10;
      const errP = polyline(xs.map(x => mp(x, clamp(errFn(x)*errScale, -2, 2))));
      const termStr = terms.length
        ? terms.map(([p,c,d]) => `${c<0?"−":terms.indexOf([p,c,d])===0?"":"+"}${Math.abs(c)===1&&p>0?"":Math.abs(c)+"/"+d+" "}x^${p}`).join(" ")
        : "0";
      // first nonzero term
      const firstNZ = info.terms.find(([p]) => p > n);
      const nextPow = firstNZ ? firstNZ[0] : "∞";
      sSvg.innerHTML = `
        <line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke="#e5e7eb"/>
        <line x1="${cx}" y1="0" x2="${cx}" y2="${H}" stroke="#e5e7eb"/>
        <polyline points="${trueP}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
        <polyline points="${approxP}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
        <polyline points="${errP}" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5,3"/>
        <text x="8" y="18" fill="#2563eb" font-size="11">${key}（真实）</text>
        <text x="8" y="33" fill="#f59e0b" font-size="11">Taylor ${n}阶（橙）</text>
        <text x="8" y="48" fill="#ef4444" font-size="11">误差×${errScale}（红虚）</text>`;
      sOut.innerHTML = `<div class="tol-readout-grid">
        <div><span class="tol-label">近似式</span><code>${termStr}</code></div>
        <div><span class="tol-label">已覆盖至</span><code>x^${n}</code></div>
        <div><span class="tol-label">误差阶</span><code>o(x^${n})</code></div>
        <div><span class="tol-label">下一项（截断处）</span><code>x^${nextPow}</code></div>
      </div>`;
    };
    fnSel.addEventListener("change", updateSingle);
    orderInp.addEventListener("input", updateSingle);
    updateSingle();

    // ── 组合函数面板 ──
    const comboSel = root.querySelector(".tol-combo-sel");
    const xrangeInp = root.querySelector(".tol-xrange");
    const xrangeVal = root.querySelector(".tol-xrange-val");
    const cSvg = root.querySelector(".tol-combo-svg");
    const cOut = root.querySelector(".tol-combo-readout");

    const updateCombo = () => {
      const key = comboSel.value, R = Number(xrangeInp.value);
      const info = combos[key];
      xrangeVal.textContent = R.toFixed(2);
      const xs = Array.from({length:160}, (_,i) => -R + 2*R*i/159);
      const W = 520, H = 260, cx = W/2, cy = H/2, sx = (W-40)/(2*R);
      // auto-scale Y
      const yVals = xs.map(x => info.f(x)).filter(isFinite);
      const yMax = Math.max(...yVals.map(Math.abs), 1e-10);
      const sy = (H/2 - 20) / yMax;
      const mp = (x,y) => [cx + x*sx, cy - clamp(y, -yMax*1.2, yMax*1.2)*sy];
      const trueP  = polyline(xs.map(x => mp(x, info.f(x))));
      const approxP = polyline(xs.map(x => mp(x, info.approx(x))));
      cSvg.innerHTML = `
        <line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke="#e5e7eb"/>
        <line x1="${cx}" y1="0" x2="${cx}" y2="${H}" stroke="#e5e7eb"/>
        <polyline points="${trueP}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
        <polyline points="${approxP}" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,3"/>
        <text x="8" y="18" fill="#2563eb" font-size="11">${key}（真实）</text>
        <text x="8" y="33" fill="#ef4444" font-size="11">首非零项近似（红虚）</text>`;
      cOut.innerHTML = `<div class="tol-readout-grid">
        <div><span class="tol-label">首个非零项</span><code>${info.lead}</code></div>
        <div><span class="tol-label">需展开至</span><code>${info.minOrder} 阶</code></div>
        <div><span class="tol-label">教学要点</span><span>${info.note}</span></div>
      </div>`;
    };
    comboSel.addEventListener("change", updateCombo);
    xrangeInp.addEventListener("input", updateCombo);
    updateCombo();
  }

  // ── trig-transform-lab：三角变形工作台（重构版）─────────────────────────────
  function renderTrigTransformLab(root) {
    // 每种变形的元数据：公式、应用场景、参数说明、易错点
    const MODES = {
      ps: {
        label: "积化和差",
        paramA: "频率 A（sin 的角频率）", paramB: "频率 B（cos 的角频率）",
        scene: "乘积型三角积分 → 变成可逐项积分的和",
        trigger: "见到 sinA·cosB、sinA·sinB、cosA·cosB 的乘积积分",
        warn: "sinA·sinB = ½[cos(A−B)−cos(A+B)]，注意是「cos差 减 cos和」，符号反了整道题报废",
        formula: (A,B) => `sin(${A.toFixed(1)}x)·cos(${B.toFixed(1)}x) = ½[sin(${(A+B).toFixed(1)}x) + sin(${(A-B).toFixed(1)}x)]`,
        f1: (A,B) => x => Math.sin(A*x)*Math.cos(B*x),
        f2: (A,B) => x => 0.5*(Math.sin((A+B)*x)+Math.sin((A-B)*x)),
      },
      sp: {
        label: "和差化积",
        paramA: "频率 A（第一个 sin）", paramB: "频率 B（第二个 sin）",
        scene: "求和式的零点、提公因子、Fourier 系数简化",
        trigger: "需要找零点或提取振幅因子时",
        warn: "变形后角频率变成 (A±B)/2，系数 2 和半角容易漏写",
        formula: (A,B) => `sin(${A.toFixed(1)}x)+sin(${B.toFixed(1)}x) = 2·sin(${((A+B)/2).toFixed(2)}x)·cos(${((A-B)/2).toFixed(2)}x)`,
        f1: (A,B) => x => Math.sin(A*x)+Math.sin(B*x),
        f2: (A,B) => x => 2*Math.sin((A+B)/2*x)*Math.cos((A-B)/2*x),
      },
      aux: {
        label: "辅助角",
        paramA: "sin 系数 a", paramB: "cos 系数 b",
        scene: "合并 a·sinx + b·cosx，求振幅或最大值",
        trigger: "见到同频 sin+cos 线性组合，需要求极值或解方程",
        warn: "R=√(a²+b²)，φ=arctan(b/a)，注意 φ 所在象限由 a、b 的符号决定",
        formula: (A,B) => {
          const R = Math.sqrt(A*A+B*B), phi = Math.atan2(B,A);
          return `${A.toFixed(1)}·sinx + ${B.toFixed(1)}·cosx = ${R.toFixed(3)}·sin(x + ${phi.toFixed(3)})`;
        },
        f1: (A,B) => x => A*Math.sin(x)+B*Math.cos(x),
        f2: (A,B) => x => { const R=Math.sqrt(A*A+B*B),phi=Math.atan2(B,A); return R*Math.sin(x+phi); },
      },
      half: {
        label: "倍角/降幂",
        paramA: "频率参数 a（控制 sin(2ax)）", paramB: "（本模式 B 无效）",
        scene: "三角幂次积分降阶，sin²x/cos²x 化成 cos 2x",
        trigger: "见到 sin²x、cos²x、sin⁴x 或 [0,π/2] 定积分",
        warn: "降幂后常数项 ½ 最容易漏；sin²x=(1−cos2x)/2，不是 (1+cos2x)/2",
        formula: (A) => `sin²(${A.toFixed(1)}x) = ½[1 − cos(${(2*A).toFixed(1)}x)]`,
        f1: (A) => x => { const v=Math.sin(A*x); return v*v; },
        f2: (A) => x => 0.5*(1-Math.cos(2*A*x)),
      },
    };

    root.innerHTML = `
      <div class="lab-shell ttl-shell">
        <div class="lab-header">
          <span class="lab-title">三角变形工作台</span>
          <span class="lab-goal">目标：理解四种变形「何时用」「变什么形」「最容易错哪里」</span>
        </div>
        <div class="ttl-mode-bar">
          ${Object.entries(MODES).map(([k,m])=>`<button class="ttl-mode-btn${k==='ps'?' active':''}" data-mode="${k}">${m.label}</button>`).join('')}
        </div>
        <div class="ttl-scene-bar" id="ttl-scene"></div>
        <div class="ttl-ctrl-row">
          <label class="ttl-ctrl-lbl" id="ttl-la">
            <span id="ttl-la-text"></span>
            <input class="lab-range ttl-ia" type="range" min="0.5" max="3" step="0.1" value="1.5">
            <span class="lab-range-val ttl-av">1.5</span>
          </label>
          <label class="ttl-ctrl-lbl" id="ttl-lb">
            <span id="ttl-lb-text"></span>
            <input class="lab-range ttl-ib" type="range" min="0.5" max="3" step="0.1" value="1.0">
            <span class="lab-range-val ttl-bv">1.0</span>
          </label>
        </div>
        <svg class="demo-svg ttl-svg" viewBox="0 0 520 180"></svg>
        <div class="ttl-formula" id="ttl-formula"></div>
        <div class="lab-insight ttl-insight">
          <span class="insight-trigger" id="ttl-trigger"></span>
          <span class="insight-warn" id="ttl-warn"></span>
          <span class="insight-task">📌 小任务：切换「辅助角」，把 a=3、b=4，验证 R=5，即 3sinx+4cosx 振幅为 5</span>
        </div>
      </div>`;

    let currentMode = 'ps';
    const sceneEl   = root.querySelector('#ttl-scene');
    const laText    = root.querySelector('#ttl-la-text');
    const lbText    = root.querySelector('#ttl-lb-text');
    const lbRow     = root.querySelector('#ttl-lb');
    const inpA      = root.querySelector('.ttl-ia');
    const inpB      = root.querySelector('.ttl-ib');
    const avSpan    = root.querySelector('.ttl-av');
    const bvSpan    = root.querySelector('.ttl-bv');
    const svg       = root.querySelector('.ttl-svg');
    const formulaEl = root.querySelector('#ttl-formula');
    const triggerEl = root.querySelector('#ttl-trigger');
    const warnEl    = root.querySelector('#ttl-warn');

    const update = () => {
      const m = MODES[currentMode];
      const A = Number(inpA.value), B = Number(inpB.value);
      avSpan.textContent = A.toFixed(1);
      bvSpan.textContent = B.toFixed(1);
      laText.textContent = m.paramA;
      lbText.textContent = m.paramB;
      lbRow.style.opacity = currentMode === 'half' ? '0.35' : '1';
      sceneEl.textContent = '📐 应用场景：' + m.scene;
      triggerEl.textContent = '考研触发词：' + m.trigger;
      warnEl.textContent = '⚠ ' + m.warn;
      formulaEl.textContent = m.formula(A, B);

      const xs = Array.from({length:200}, (_, i) => -Math.PI + 2*Math.PI*i/199);
      const W = 520, H = 180, cy = H/2;
      const mapPt = (x, y) => [W/2 + x*75, cy - clamp(y, -1.8, 1.8)*55];
      const f1 = m.f1(A, B), f2 = m.f2(A, B);
      const p1 = polyline(xs.map(x => mapPt(x, f1(x))));
      const p2 = polyline(xs.map(x => mapPt(x, f2(x))));
      // residual (difference) to confirm equality
      const maxDiff = Math.max(...xs.map(x => Math.abs(f1(x) - f2(x))));
      const equalTag = maxDiff < 0.002
        ? `<text x="${W-8}" y="16" fill="#15803d" font-size="11" text-anchor="end">✓ 两侧完全重合</text>`
        : `<text x="${W-8}" y="16" fill="#ef4444" font-size="11" text-anchor="end">⚠ 最大偏差 ${maxDiff.toFixed(4)}</text>`;
      svg.innerHTML = `
        <line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke="#e5e7eb"/>
        <line x1="${W/2}" y1="0" x2="${W/2}" y2="${H}" stroke="#e5e7eb"/>
        <polyline points="${p1}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
        <polyline points="${p2}" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="7,4"/>
        <text x="8" y="16" fill="#2563eb" font-size="11">原式（蓝）</text>
        <text x="8" y="30" fill="#ef4444" font-size="11">变形后（红虚）</text>
        ${equalTag}`;
    };

    root.querySelectorAll('.ttl-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.ttl-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        update();
      });
    });
    inpA.addEventListener('input', update);
    inpB.addEventListener('input', update);
    update();
  }

  // ── integral-method-picker：积分方法决策树（重构版）────────────────────────
  function renderIntegralMethodPicker(root) {
    const METHODS = [
      {
        id: "sub1", label: "凑微分/第一换元", icon: "🔄",
        triggers: ["内层函数","幂次+系数","eˣ·f(eˣ)","sinx·f(cosx)"],
        why: "被积式含 φ(x)·φ'(x) 结构，可凑出 dφ",
        steps: ["① 找内层函数 φ(x)","② 识别 φ'(x) 是否作为因子出现","③ 令 u=φ(x)，du=φ'(x)dx 换元","④ 对 u 积分后回代"],
        example: "∫sin(x²)·2x dx → u=x²，∫sin u du = −cos(x²)+C",
        badchoice: "φ'(x) 不在被积式中时不能强凑",
        keys: ["内层","幂次","复合"]
      },
      {
        id: "sub2", label: "第二换元（根式）", icon: "√",
        triggers: ["根式","√(a²−x²)","√(a²+x²)","√(x²−a²)"],
        why: "根式结构用三角/双曲代换消去根号",
        steps: ["① a²−x²：令 x=a sinθ","② a²+x²：令 x=a tanθ","③ x²−a²：令 x=a secθ","④ 换元后化简，积分，再回代"],
        example: "∫√(1−x²) dx → x=sinθ → ∫cos²θ dθ → (θ+sin2θ/2)/2",
        badchoice: "代换范围要注意 θ 的取值区间，避免多值",
        keys: ["根式","√"]
      },
      {
        id: "parts", label: "分部积分 (ILATE)", icon: "✂️",
        triggers: ["乘积","ln·幂","arctan·幂","幂·eˣ","幂·sinx"],
        why: "被积式是两类函数乘积，按 ILATE 优先级选 u",
        steps: ["① 优先级：反三角 > 对数 > 幂函数 > 三角 > 指数","② u=高优先级，dv=剩余部分","③ ∫u dv = uv − ∫v du","④ 循环型（三×指）分部两次后移项"],
        example: "∫x·eˣ dx：u=x，dv=eˣdx → xeˣ−eˣ+C",
        badchoice: "eˣ·sinx 型两次分部后要移项，不是无限递推",
        keys: ["乘积","ln","arctan","分部"]
      },
      {
        id: "rational", label: "有理函数部分分式", icon: "📐",
        triggers: ["有理式","分式","多项式除多项式","分母可因式分解"],
        why: "分母分解后拆成简单分式再逐项积分",
        steps: ["① 若假分式先多项式除法","② 分母因式分解","③ 设待定系数，列方程","④ 各项 ∫1/(x−a) 或 ∫1/(x²+a²) 分别积分"],
        example: "∫1/(x²−1) dx = ½∫[1/(x−1)−1/(x+1)]dx = ½ln|x−1/x+1|+C",
        badchoice: "重因子 (x−a)² 要写 A/(x−a)+B/(x−a)²，不能只写一项",
        keys: ["有理","分式","分母"]
      },
      {
        id: "trig", label: "三角幂降幂/Wallis", icon: "〰️",
        triggers: ["sinⁿx","cosⁿx","三角幂","[0,π/2]定积分"],
        why: "降幂化简或直接套 Wallis 公式",
        steps: ["① 奇数幂：拆一个 sinx 凑 d(cosx)","② 偶数幂：sin²x=(1−cos2x)/2 降幂","③ 定积分 ∫₀^{π/2} sinⁿx dx 直接用 Wallis","④ Wallis：I_n=(n−1)/n·I_{n−2}，I₀=π/2，I₁=1"],
        example: "∫₀^{π/2} sin⁶x dx = 5/6·3/4·1/2·π/2 = 5π/32",
        badchoice: "Wallis 只对 [0,π/2]，其他区间要先化",
        keys: ["三角幂","sin^n","cos^n","Wallis"]
      },
      {
        id: "improper", label: "反常积分 & Beta/Gamma", icon: "∞",
        triggers: ["反常","无穷上限","奇点","x^p型","Beta","Gamma"],
        why: "与标准 ∫₀¹ xᵖ 或 ∫₁^∞ xᵖ 比较，或化为 Beta/Gamma",
        steps: ["① 找奇点（无穷端点或内部间断点）","② p 判别：∫₀¹ xᵖ dx，p<1 收敛","③ 比较判别：≤M·xᵖ 则收敛","④ 换元化为 B(p,q)=∫₀¹ xᵖ⁻¹(1−x)^{q−1}dx"],
        example: "∫₀^∞ x²e^{−x} dx = Γ(3) = 2! = 2",
        badchoice: "奇点在积分区间内部时必须分段，不能直接算",
        keys: ["反常","无穷","奇点","Beta","Gamma"]
      },
    ];

    // 关键词 → 方法 id 的映射
    const KEY_MAP = {};
    METHODS.forEach(m => m.keys.forEach(k => { KEY_MAP[k] = KEY_MAP[k] || []; KEY_MAP[k].push(m.id); }));

    root.innerHTML = `
      <div class="lab-shell imp-shell">
        <div class="lab-header">
          <span class="lab-title">积分方法决策树</span>
          <span class="lab-goal">目标：看到题目结构特征 → 秒定方法 → 考场三步走</span>
        </div>
        <div class="imp-feature-bar">
          <span class="imp-feature-label">题目含有：</span>
          ${METHODS.map(m => m.triggers.slice(0,3).map(t =>
            `<button class="imp-tag" data-key="${t}">${t}</button>`
          ).join('')).join('')}
          <button class="imp-tag imp-clear" data-key="">✕ 清除</button>
        </div>
        <div class="imp-tree" id="imp-tree"></div>
        <div class="imp-detail" id="imp-detail"></div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：看结构选方法 → 根式→换元，乘积→分部，有理→部分分式，三角幂→降幂/Wallis</span>
          <span class="insight-warn">⚠ 最常见误选：见乘积就分部；eˣ·sinx 分部循环两次后要移项，不是无限分部</span>
          <span class="insight-task">📌 小任务：点击「根式」，按决策树三步走，再点「乘积」看 ILATE 优先级</span>
        </div>
      </div>`;

    const tree   = root.querySelector('#imp-tree');
    const detail = root.querySelector('#imp-detail');
    let activeId = null;

    const renderTree = (highlightIds = []) => {
      tree.innerHTML = METHODS.map(m => {
        const active = highlightIds.includes(m.id) || m.id === activeId;
        return `<div class="imp-node ${active ? 'imp-node-active' : ''}" data-id="${m.id}">
          <span class="imp-node-icon">${m.icon}</span>
          <span class="imp-node-label">${m.label}</span>
          ${active ? '<span class="imp-node-arrow">→</span>' : ''}
        </div>`;
      }).join('<div class="imp-connector"></div>');
    };

    const renderDetail = (id) => {
      const m = METHODS.find(x => x.id === id);
      if (!m) { detail.innerHTML = '<div class="imp-detail-empty">← 点击上方方法卡或题目特征标签</div>'; return; }
      detail.innerHTML = `
        <div class="imp-detail-card">
          <div class="imp-detail-title">${m.icon} ${m.label}</div>
          <div class="imp-detail-why"><strong>为什么选它：</strong>${m.why}</div>
          <div class="imp-detail-steps">
            <strong>考场三步：</strong>
            <ol>${m.steps.map(s => `<li>${s}</li>`).join('')}</ol>
          </div>
          <div class="imp-detail-example"><strong>典型例子：</strong><code>${m.example}</code></div>
          <div class="imp-detail-bad"><strong>容易误选：</strong>${m.badchoice}</div>
        </div>`;
    };

    // tag click
    root.querySelectorAll('.imp-tag').forEach(btn => {
      btn.addEventListener('click', () => {
        root.querySelectorAll('.imp-tag').forEach(b => b.classList.remove('imp-tag-active'));
        const key = btn.dataset.key;
        if (!key) { activeId = null; renderTree([]); renderDetail(null); return; }
        btn.classList.add('imp-tag-active');
        const hits = KEY_MAP[key] || [];
        // pick best match
        activeId = hits[0] || null;
        renderTree(hits);
        if (activeId) renderDetail(activeId);
      });
    });

    // node click
    tree.addEventListener('click', e => {
      const node = e.target.closest('.imp-node');
      if (!node) return;
      activeId = node.dataset.id;
      renderTree([]);
      renderDetail(activeId);
    });

    renderTree([]);
    renderDetail(null);
  }

  // ── matrix-eigen-lab：特征值/正定可视化（重构版）────────────────────────────
  function renderMatrixEigenLab(root) {
    root.innerHTML = `
      <div class="lab-shell">
        <div class="lab-header">
          <span class="lab-title">特征值 · 正定可视化实验室</span>
          <span class="lab-goal">目标：看清「特征向量方向不变」和「正定 = 所有方向二次型为正」</span>
        </div>
        <div class="mel-layout">
          <div class="mel-ctrl">
            <div class="mel-matrix-label">矩阵 A（对称矩阵时 b=c）</div>
            <div class="mel-matrix-grid">
              <div class="mel-matrix-row">
                <input class="mel-inp" data-m="a" value="2" type="number" step="0.5">
                <input class="mel-inp" data-m="b" value="1" type="number" step="0.5">
              </div>
              <div class="mel-matrix-row">
                <input class="mel-inp" data-m="c" value="1" type="number" step="0.5">
                <input class="mel-inp" data-m="d" value="2" type="number" step="0.5">
              </div>
            </div>
            <div class="mel-nums" id="mel-nums"></div>
            <div class="mel-sylvester" id="mel-sylvester"></div>
          </div>
          <svg class="demo-svg mel-svg" viewBox="0 0 340 280" id="mel-svg"></svg>
        </div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：正定 · 对角化 · 二次型符号 · 特征值全正</span>
          <span class="insight-warn">⚠ 特征值全正 ≠ 元素全正；2×2 正定必须：a₁₁>0 且 det>0（Sylvester）</span>
          <span class="insight-task">📌 小任务：把 b 改成 3（超过正定界），看绿色区域变红，椭圆翻转</span>
        </div>
      </div>`;

    const inputs = root.querySelectorAll(".mel-inp");
    const svg = root.querySelector("#mel-svg");
    const numsEl = root.querySelector("#mel-nums");
    const sylEl = root.querySelector("#mel-sylvester");

    // arrow helper: returns SVG path string for an arrow line
    const arrow = (x1,y1,x2,y2,color,w=2.5) => {
      const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy);
      if(len<2) return "";
      const ux=dx/len, uy=dy/len, hw=5, hl=9;
      const px=x2-ux*hl-uy*hw, py=y2-uy*hl+ux*hw;
      const qx=x2-ux*hl+uy*hw, qy=y2-uy*hl-ux*hw;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${w}"/>` +
             `<polygon points="${x2.toFixed(1)},${y2.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)} ${qx.toFixed(1)},${qy.toFixed(1)}" fill="${color}"/>`;
    };

    const update = () => {
      const v = Object.fromEntries([...inputs].map(i => [i.dataset.m, Number(i.value) || 0]));
      const {a, b, c, d} = v;
      const tr = a + d, det = a*d - b*c;
      const discSq = (tr/2)**2 - det;
      const hasReal = discSq >= 0;
      const disc = Math.sqrt(Math.max(0, discSq));
      const l1 = tr/2 + disc, l2 = tr/2 - disc;

      // SVG coordinate helpers
      const W = 340, H = 280, cx = W/2, cy = H/2, sc = 55;
      const mp = ([x, y]) => [cx + x*sc, cy - y*sc];
      const tf = ([x, y]) => [a*x + b*y, c*x + d*y];

      // unit circle → ellipse
      const circle = Array.from({length:64}, (_, i) => {
        const θ = 2*Math.PI*i/63;
        return [Math.cos(θ), Math.sin(θ)];
      });
      const ellipsePts = circle.map(tf).map(mp);
      const ellipsePoly = ellipsePts.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

      // unit square → parallelogram
      const sq = [[0,0],[1,0],[1,1],[0,1],[0,0]].map(tf).map(mp);
      const sqPoly = sq.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

      // eigenvectors (only if real)
      let ev1svg = "", ev2svg = "";
      if (hasReal) {
        let e1 = [1, 0], e2 = [0, 1];
        if (Math.abs(b) > 1e-9 || Math.abs(c) > 1e-9) {
          if (Math.abs(b) > 1e-9) {
            e1 = [b, l1 - a]; e2 = [b, l2 - a];
          } else {
            e1 = [l1 - d, c]; e2 = [l2 - d, c];
          }
          const n1 = Math.hypot(...e1), n2 = Math.hypot(...e2);
          e1 = n1 > 1e-12 ? e1.map(x => x/n1) : e1;
          e2 = n2 > 1e-12 ? e2.map(x => x/n2) : e2;
        }
        const scale1 = Math.abs(l1)*0.9 + 0.3, scale2 = Math.abs(l2)*0.9 + 0.3;
        const o = mp([0,0]);
        const p1 = mp(e1.map(x => x * clamp(scale1, 0.3, 2.5)));
        const p2 = mp(e2.map(x => x * clamp(scale2, 0.3, 2.5)));
        ev1svg = arrow(o[0], o[1], p1[0], p1[1], "#2563eb");
        ev2svg = arrow(o[0], o[1], p2[0], p2[1], "#15803d");
      }

      // original basis arrows (gray)
      const o = mp([0,0]);
      const origE1 = arrow(o[0], o[1], mp([1,0])[0], mp([1,0])[1], "#94a3b8", 1.5);
      const origE2 = arrow(o[0], o[1], mp([0,1])[0], mp([0,1])[1], "#94a3b8", 1.5);

      svg.innerHTML = `
        <line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke="#e5e7eb"/>
        <line x1="${cx}" y1="0" x2="${cx}" y2="${H}" stroke="#e5e7eb"/>
        <polyline points="${sqPoly}" fill="rgba(148,163,184,.15)" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"/>
        <polyline points="${ellipsePoly}" fill="rgba(180,95,6,.12)" stroke="#f59e0b" stroke-width="2.5"/>
        ${origE1}${origE2}
        ${ev1svg}${ev2svg}
        <text x="6" y="16" fill="#f59e0b" font-size="10">椭圆=单位圆经A变换</text>
        <text x="6" y="28" fill="#94a3b8" font-size="10">灰色=原单位向量</text>
        ${hasReal
          ? `<text x="6" y="40" fill="#2563eb" font-size="10">蓝=λ₁特征向量</text><text x="6" y="52" fill="#15803d" font-size="10">绿=λ₂特征向量</text>`
          : `<text x="6" y="40" fill="#ef4444" font-size="10">⚠ 复特征值：旋转变换，无实特征向量</text>`}`;

      // numeric panel
      const posdef = l1 > 1e-9 && l2 > 1e-9;
      const semidef = Math.min(l1, l2) >= -1e-9 && !posdef;
      const defLabel = posdef ? `<span class="mel-pos">✅ 正定</span>` :
        semidef ? `<span class="mel-semi">⚠ 半正定</span>` :
        `<span class="mel-neg">❌ 非正定</span>`;
      numsEl.innerHTML = `
        <div class="mel-num-row"><span>λ₁</span><code>${l1.toFixed(4)}</code></div>
        <div class="mel-num-row"><span>λ₂</span><code>${l2.toFixed(4)}</code></div>
        <div class="mel-num-row"><span>det = λ₁λ₂</span><code>${det.toFixed(4)}</code></div>
        <div class="mel-num-row"><span>tr = λ₁+λ₂</span><code>${tr.toFixed(4)}</code></div>
        <div class="mel-num-row"><span>复特征值？</span><code>${hasReal ? "否（实）" : "是（旋转）"}</code></div>
        <div class="mel-num-row mel-num-verdict">${defLabel}</div>`;

      // Sylvester criterion
      const s1ok = a > 0, s2ok = det > 0;
      sylEl.innerHTML = `<div class="mel-sylvester-title">Sylvester 顺序主子式（正定判别）</div>
        <div class="mel-sylvester-row ${s1ok ? "sy-ok" : "sy-fail"}">
          D₁ = a₁₁ = ${a.toFixed(2)} ${s1ok ? "✅ >0" : "❌ ≤0"}
        </div>
        <div class="mel-sylvester-row ${s2ok ? "sy-ok" : "sy-fail"}">
          D₂ = det(A) = ${det.toFixed(2)} ${s2ok ? "✅ >0" : "❌ ≤0"}
        </div>
        <div class="mel-sylvester-concl">
          正定 ⟺ D₁>0 且 D₂>0 &nbsp;→&nbsp; ${(s1ok && s2ok) ? "✅ 正定" : "❌ 不满足正定条件"}
        </div>`;
    };

    inputs.forEach(i => i.addEventListener("input", update));
    update();
  }

  // ── probability-distribution-lab：假设检验拒绝域实验室（重构版）────────────
  function renderProbabilityDistributionLab(root) {
    root.innerHTML = `
      <div class="lab-shell pdl-shell">
        <div class="lab-header">
          <span class="lab-title">假设检验拒绝域实验室</span>
          <span class="lab-goal">目标：理解 α、β、功效三者如何互相制约——α 收窄，β 往往变大</span>
        </div>
        <div class="pdl-ctrl-row">
          <label class="lab-ctrl-label">显著性水平 α
            <span class="lab-ctrl-hint">控制拒绝域宽度，α 越小越严格</span>
            <input class="lab-range pdl-alpha" type="range" min="0.01" max="0.20" step="0.01" value="0.05">
            <span class="lab-range-val pdl-av">0.05</span>
          </label>
          <label class="lab-ctrl-label">备择均值 μ₁（效应量）
            <span class="lab-ctrl-hint">H₁ 的真实均值，越大检验越容易</span>
            <input class="lab-range pdl-mu1" type="range" min="0" max="4" step="0.1" value="2">
            <span class="lab-range-val pdl-mv">2.0</span>
          </label>
        </div>
        <svg class="demo-svg pdl-svg" viewBox="0 0 520 220"></svg>
        <div class="pdl-stats" id="pdl-stats"></div>
        <div class="pdl-tradeoff" id="pdl-tradeoff"></div>
        <div class="pdl-pval" id="pdl-pval"></div>
        <div class="lab-insight">
          <span class="insight-trigger">考研触发词：假设检验 · 显著性水平 · 拒绝域 · 两类错误 · 功效 · p 值</span>
          <span class="insight-warn">⚠ p值 &lt; α 说明在 H₀ 下「这组数据很极端」，不代表 H₁ 一定成立；β 大时检验功效低，漏检概率高</span>
          <span class="insight-task">📌 小任务：先把 α 从 0.05 降到 0.01，观察 β 如何变大；再把 μ₁ 调大，观察功效 1−β 如何提升</span>
        </div>
      </div>`;

    const alphaInp = root.querySelector('.pdl-alpha');
    const mu1Inp   = root.querySelector('.pdl-mu1');
    const avSpan   = root.querySelector('.pdl-av');
    const mvSpan   = root.querySelector('.pdl-mv');
    const svg      = root.querySelector('.pdl-svg');
    const statsEl  = root.querySelector('#pdl-stats');
    const tradeEl  = root.querySelector('#pdl-tradeoff');
    const pvalEl   = root.querySelector('#pdl-pval');

    // standard normal PDF and CDF (Abramowitz & Stegun approximation)
    const phi = x => Math.exp(-0.5*x*x) / Math.sqrt(2*Math.PI);
    const Phi = x => {
      const t = 1 / (1 + 0.2316419*Math.abs(x));
      const p = t*(0.319381530 + t*(-0.356563782 + t*(1.781477937 + t*(-1.821255978 + t*1.330274429))));
      return x >= 0 ? 1 - phi(x)*p : phi(x)*p;
    };
    // z_{α/2} lookup
    const ZC = {0.01:2.576,0.02:2.326,0.03:2.17,0.04:2.054,0.05:1.96,0.06:1.88,
                0.07:1.81,0.08:1.75,0.09:1.70,0.10:1.645,0.12:1.555,0.15:1.44,0.20:1.282};
    const getZc = alpha => {
      const keys = Object.keys(ZC).map(Number).sort((a,b)=>a-b);
      const near = keys.reduce((p,c) => Math.abs(c-alpha) < Math.abs(p-alpha) ? c : p);
      return ZC[near] ?? 1.96;
    };

    const update = () => {
      const alpha = Number(alphaInp.value), mu1 = Number(mu1Inp.value);
      avSpan.textContent = alpha.toFixed(2);
      mvSpan.textContent = mu1.toFixed(1);
      const zc = getZc(alpha);
      const beta = Phi(zc - mu1) - Phi(-zc - mu1);
      const power = 1 - beta;

      // SVG layout
      const W = 520, H = 220, bot = 205;
      const mapX = x => 50 + (x + 4) * 52;
      const mapY = y => bot - y * 320;
      const xs = Array.from({length:240}, (_, i) => -4 + 8*i/239);

      const h0pts  = polyline(xs.map(x => [mapX(x), mapY(phi(x))]));
      const h1pts  = polyline(xs.map(x => [mapX(x), mapY(phi(x - mu1))]));

      // filled regions
      const fillPath = (pts, base) => pts.length < 2 ? '' :
        `M${pts[0][0]},${base} ` + pts.map(([x,y]) => `L${x},${y}`).join(' ') +
        ` L${pts[pts.length-1][0]},${base} Z`;

      const rejL  = xs.filter(x => x < -zc).map(x => [mapX(x), mapY(phi(x))]);
      const rejR  = xs.filter(x => x > zc) .map(x => [mapX(x), mapY(phi(x))]);
      const betaXs = xs.filter(x => x >= -zc && x <= zc);
      const betaP  = betaXs.map(x => [mapX(x), mapY(phi(x - mu1))]);

      const xcL = mapX(-zc), xcR = mapX(zc);
      const powerPtsR = xs.filter(x => x > zc) .map(x => [mapX(x), mapY(phi(x - mu1))]);

      svg.innerHTML = `
        <line x1="40" y1="${bot}" x2="${W-10}" y2="${bot}" stroke="#e5e7eb" stroke-width="1"/>
        <path d="${fillPath(rejL, bot)}"  fill="rgba(220,38,38,.30)"/>
        <path d="${fillPath(rejR, bot)}"  fill="rgba(220,38,38,.30)"/>
        <path d="${fillPath(betaP, bot)}" fill="rgba(37,99,235,.22)"/>
        <path d="${fillPath(powerPtsR, bot)}" fill="rgba(21,128,61,.22)"/>
        <polyline points="${h0pts}" fill="none" stroke="#1e293b" stroke-width="2.5"/>
        <polyline points="${h1pts}" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="8,4"/>
        <line x1="${xcL}" y1="8" x2="${xcL}" y2="${bot}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4"/>
        <line x1="${xcR}" y1="8" x2="${xcR}" y2="${bot}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4"/>
        <text x="10" y="16" fill="#1e293b"  font-size="11">H₀: N(0,1)（黑）</text>
        <text x="10" y="30" fill="#f59e0b"  font-size="11">H₁: N(μ₁,1)（橙虚）</text>
        <text x="10" y="44" fill="#dc2626"  font-size="11">▓ 红=拒绝域 α</text>
        <text x="10" y="58" fill="#2563eb"  font-size="11">▓ 蓝=β（漏检）</text>
        <text x="10" y="72" fill="#15803d"  font-size="11">▓ 绿=功效 1−β</text>
        <text x="${xcL}" y="${bot+14}" fill="#dc2626" font-size="10" text-anchor="middle">−z</text>
        <text x="${xcR}" y="${bot+14}" fill="#dc2626" font-size="10" text-anchor="middle">+z</text>`;

      // stats panel
      statsEl.innerHTML = `
        <div class="pdl-stat ${alpha <= 0.05 ? 'pdl-strict' : 'pdl-loose'}">
          <span>临界值 z<sub>α/2</sub></span><strong>±${zc.toFixed(3)}</strong>
        </div>
        <div class="pdl-stat">
          <span>α（第一类错误）</span><strong>${alpha.toFixed(3)}</strong>
        </div>
        <div class="pdl-stat pdl-beta">
          <span>β（第二类错误）</span><strong>${beta.toFixed(4)}</strong>
        </div>
        <div class="pdl-stat pdl-power">
          <span>功效 1−β</span><strong class="${power >= 0.8 ? 'pdl-good' : 'pdl-warn'}">${power.toFixed(4)}</strong>
        </div>`;

      // dynamic tradeoff explanation
      const tradeMsg = alpha <= 0.05 && mu1 < 1.5
        ? `α=${alpha.toFixed(2)} 严格 + μ₁=${mu1.toFixed(1)} 小 → β 很大（${beta.toFixed(3)}），检验几乎没有功效，容易漏检`
        : alpha >= 0.10 && mu1 >= 2
        ? `α=${alpha.toFixed(2)} 宽松 + μ₁=${mu1.toFixed(1)} 大 → 功效高（${power.toFixed(3)}），两类错误都受控`
        : `α 降低 → 拒绝域收窄 → 同样的 H₁ 有更多概率落在「接受域」→ β 变大；增大 μ₁（效应量）可同时降低 β`;
      tradeEl.textContent = '📊 ' + tradeMsg;

      // p-value guide
      pvalEl.innerHTML = `<span class="pdl-pval-label">考研判断：</span>
        p值 &lt; α → 拒绝 H₀（当前临界值对应 α=${alpha.toFixed(2)}，z>±${zc.toFixed(2)} 即拒绝）`;
    };

    alphaInp.addEventListener('input', update);
    mu1Inp.addEventListener('input', update);
    update();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
