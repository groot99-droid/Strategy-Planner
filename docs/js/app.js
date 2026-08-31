(function () {
  "use strict";

  const app = document.getElementById("app");
  const rosterCountEl = document.getElementById("rosterCount");

  const CATEGORY_ORDER = ["military", "production", "science", "culture", "faith", "gold"];
  const CATEGORY_LABELS = {
    military: "Military",
    production: "Production",
    science: "Science",
    culture: "Culture",
    faith: "Faith",
    gold: "Gold",
  };
  const CATEGORY_BLURB = {
    military: "Conquest, movement, and armies.",
    production: "Infrastructure and raw output.",
    science: "Research and technological pace.",
    culture: "Tourism, loyalty, and influence.",
    faith: "Religion, belief, and holy sites.",
    gold: "Trade, treasury, and economy.",
  };

  const CURVE_ORDER = ["Spike", "Ramp", "Bloom", "Flat"];
  const CURVE_INFO = {
    Spike: "Peaks Ancient–Classical. The bonus is loudest before turn ~100, then fades.",
    Ramp: "Peaks Medieval–Renaissance. Needs a functional early game to reach it.",
    Bloom: "Peaks Industrial onward. Near-inert early; needs a survival plan, not a growth plan.",
    Flat: "Compounds evenly across the whole game. No cliff, no dead zone.",
  };
  const CURVE_PEAK = { Spike: "Peak", Ramp: "Peak", Bloom: "Peak", Flat: "Steady" };

  const CONVERSION_ORDER = ["Permanent", "Conditional", "Expiring"];
  const CONVERSION_INFO = {
    Permanent: "The peak banks into something that persists — cities, wonders, districts, banked civics.",
    Conditional: "Persists only while an external state holds — war footing, suzerainty, an amenity level.",
    Expiring: "Runs on a timer or a trigger. If it did not buy territory inside the window, there is no second act.",
  };

  /** Power-curve geometry: x 12→292, y 108 (floor) → 14 (ceiling). */
  const CURVE_PATHS = {
    Spike: "M12,102 C30,96 44,26 66,20 C92,13 124,48 164,72 C206,96 250,104 292,106",
    Ramp: "M12,104 C48,100 84,80 128,48 C158,26 186,19 210,26 C242,36 268,60 292,80",
    Bloom: "M12,103 C62,102 112,99 152,92 C196,84 234,56 258,32 C270,21 282,17 292,15",
    Flat: "M12,94 C70,85 130,73 190,60 C230,51 262,44 292,38",
  };
  const CURVE_PEAK_X = { Spike: 66, Ramp: 205, Bloom: 285, Flat: 240 };

  /** Game terms highlighted inside profile prose. */
  const KEYWORDS = [
    "Combat Strength", "Great People", "Great Person", "Great Works", "Great Work",
    "Trade Routes", "Trade Route", "City-States", "City-State", "Golden Age", "Dark Age",
    "Era Score", "War Weariness", "Holy Site", "Commercial Hub", "Theater Square",
    "Industrial Zone", "Strategic Resource", "Diplomatic Visibility", "战",
    "Districts", "District", "Wonders", "Wonder", "Amenities", "Amenity", "Loyalty",
    "Housing", "Production", "Science", "Culture", "Faith", "Gold", "Tourism",
    "Movement", "Envoys", "Envoy", "Suzerain", "Governor", "Builders", "Builder",
    "Settlers", "Settler", "Campus", "Encampment", "Harbor", "Aqueduct", "Grievances",
    "Warmonger", "Alliances", "Alliance", "Barbarian", "Civics", "Civic", "Eureka",
    "Inspiration", "Corps", "Pillage", "Levy", "Adjacency", "Appeal", "Walls",
  ];
  const KEYWORD_RE = new RegExp(
    "\\b(" + KEYWORDS.slice().sort((a, b) => b.length - a.length).map(escapeRe).join("|") + ")\\b",
    "g"
  );
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  let leaders = [];
  let leadersBySlug = new Map();
  let chartSeq = 0;

  const filterState = { search: "", category: "", curve: "", conversion: "" };
  let filtersCollapsed = window.innerWidth < 760;

  // ---------- text helpers ----------

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /** Escape, then wrap known game terms in .kw. Input must be plain text. */
  function escKw(str) {
    return esc(str).replace(KEYWORD_RE, '<span class="kw">$1</span>');
  }

  // ---------- data ----------

  function loadData() {
    return fetch("data/leaders.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load leaders.json (" + res.status + ")");
        return res.json();
      })
      .then((data) => {
        leaders = data.slice().sort((a, b) => a.name.localeCompare(b.name));
        leadersBySlug = new Map(leaders.map((l) => [l.slug, l]));
      });
  }

  // ---------- routing ----------

  function parseRoute() {
    const parts = location.hash.replace(/^#/, "").split("/").filter(Boolean);
    if (parts[0] === "leader" && parts[1]) return { view: "detail", slug: parts[1] };
    if (parts[0] === "leaders") return { view: "grid" };
    if (parts[0] === "quiz") return { view: "quiz" };
    return { view: "landing" };
  }

  function route() {
    const r = parseRoute();
    document.querySelectorAll("[data-nav]").forEach((el) => el.classList.remove("is-active"));

    if (r.view === "detail" && leadersBySlug.has(r.slug)) {
      document.querySelector('[data-nav="leaders"]').classList.add("is-active");
      renderDetail(leadersBySlug.get(r.slug));
    } else if (r.view === "grid") {
      document.querySelector('[data-nav="leaders"]').classList.add("is-active");
      renderGrid();
    } else if (r.view === "quiz") {
      document.querySelector('[data-nav="quiz"]').classList.add("is-active");
      startQuiz();
    } else {
      renderLanding();
    }
  }

  window.addEventListener("hashchange", route);

  // ---------- curve chart ----------

  function curveChart(curve) {
    const path = CURVE_PATHS[curve];
    if (!path) return "";
    const id = "cc" + ++chartSeq;
    const peakX = CURVE_PEAK_X[curve];
    const eras = ["Ancient", "Medieval", "Industrial", "Information"];

    let grid = "";
    for (let i = 1; i <= 3; i++) {
      const x = 12 + (280 / 4) * i;
      grid += '<line class="cc-grid" x1="' + x + '" y1="14" x2="' + x + '" y2="108"/>';
    }
    [38, 62, 86].forEach((y) => {
      grid += '<line class="cc-grid" x1="12" y1="' + y + '" x2="292" y2="' + y + '"/>';
    });

    const eraTicks = eras
      .map((e, i) => {
        const x = 12 + (280 / 3) * i;
        const anchor = i === 0 ? "start" : i === eras.length - 1 ? "end" : "middle";
        return '<text class="cc-tick" x="' + x + '" y="119" text-anchor="' + anchor + '">' + e + "</text>";
      })
      .join("");

    return (
      '<svg class="curve-chart" viewBox="0 0 304 126" role="img" aria-label="' +
      esc(curve) + ' power curve: ' + esc(CURVE_INFO[curve]) + '">' +
      '<rect class="cc-frame" x="12" y="14" width="280" height="94"/>' +
      grid +
      '<path class="cc-area" d="' + path + ' L292,108 L12,108 Z"/>' +
      '<line class="cc-peak-line" x1="' + peakX + '" y1="14" x2="' + peakX + '" y2="108"/>' +
      '<text class="cc-peak-text" x="' + (peakX + (curve === "Bloom" ? -4 : 4)) + '" y="24" text-anchor="' +
      (curve === "Bloom" ? "end" : "start") + '">' + CURVE_PEAK[curve] + "</text>" +
      '<path class="cc-line" id="' + id + '" d="' + path + '"/>' +
      '<line class="cc-axis" x1="12" y1="108" x2="292" y2="108"/>' +
      '<line class="cc-axis" x1="12" y1="14" x2="12" y2="108"/>' +
      '<text class="cc-axis-label" x="12" y="9" transform="rotate(0)">POWER</text>' +
      eraTicks +
      '<circle class="cc-dot" r="4"><animateMotion dur="1.5s" fill="freeze" begin="0s">' +
      '<mpath href="#' + id + '"/></animateMotion></circle>' +
      "</svg>"
    );
  }

  function curvePanel(curve, catKey) {
    return (
      '<div class="curve-panel" data-category-key="' + esc(catKey) + '">' +
      '<div class="curve-panel__text">' +
      '<p class="curve-panel__label">Power Curve</p>' +
      '<p class="curve-panel__name">' + esc(curve) + "</p>" +
      '<p class="curve-panel__desc">' + esc(CURVE_INFO[curve] || "") + "</p></div>" +
      curveChart(curve) +
      "</div>"
    );
  }

  // ---------- LANDING ----------

  function renderLanding() {
    app.innerHTML = "";
    app.appendChild(document.getElementById("tpl-landing").content.cloneNode(true));
    rosterCountEl.textContent = leaders.length + " leaders";

    const axes = document.getElementById("landingAxes");

    const focusRows = CATEGORY_ORDER.map((key) => {
      const sample = leaders.find((l) => l.categoryKey === key);
      const count = leaders.filter((l) => l.categoryKey === key).length;
      if (!sample) return "";
      return (
        '<dt data-category-key="' + key + '"><span class="roundel roundel--xs"><img src="' +
        esc(sample.categoryBadge) + '" alt=""></span>' + esc(CATEGORY_LABELS[key]) +
        ' <span class="chip__count">' + count + "</span></dt>" +
        "<dd>" + esc(CATEGORY_BLURB[key]) + "</dd>"
      );
    }).join("");

    const curveRows = CURVE_ORDER.map((c) => {
      const sample = leaders.find((l) => l.curve === c);
      if (!sample) return "";
      return (
        '<dt><span class="roundel roundel--xs"><img src="' + esc(sample.curveBadge) + '" alt=""></span>' +
        esc(c) + "</dt><dd>" + esc(CURVE_INFO[c]) + "</dd>"
      );
    }).join("");

    const convRows = CONVERSION_ORDER.map((c) => {
      const sample = leaders.find((l) => l.conversion === c);
      if (!sample) return "";
      return (
        '<dt><span class="roundel roundel--xs"><img src="' + esc(sample.conversionBadge) + '" alt=""></span>' +
        esc(c) + "</dt><dd>" + esc(CONVERSION_INFO[c]) + "</dd>"
      );
    }).join("");

    axes.innerHTML =
      '<div class="axis-card"><h3>Focus</h3><p>What the kit is actually for.</p><dl>' + focusRows + "</dl></div>" +
      '<div class="axis-card"><h3>Power Curve</h3><p>When the leader is loudest.</p><dl>' + curveRows + "</dl></div>" +
      '<div class="axis-card"><h3>Conversion</h3><p>Whether the advantage keeps.</p><dl>' + convRows + "</dl></div>";
  }

  // ---------- CODEX GRID ----------

  function filteredLeaders() {
    const term = filterState.search.trim().toLowerCase();
    return leaders.filter((l) => {
      if (filterState.category && l.categoryKey !== filterState.category) return false;
      if (filterState.curve && l.curve !== filterState.curve) return false;
      if (filterState.conversion && l.conversion !== filterState.conversion) return false;
      if (term) {
        const hay = [l.name, l.civilization, l.leaderTitle].join(" ").toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }

  function chip(opts) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "chip" + (opts.active ? " is-active" : "") + (opts.roundelSrc ? "" : " chip--plain");
    if (opts.catKey) el.dataset.categoryKey = opts.catKey;
    let inner = "";
    if (opts.roundelSrc) inner += '<span class="roundel roundel--sm"><img src="' + esc(opts.roundelSrc) + '" alt=""></span>';
    inner += "<span>" + esc(opts.label) + "</span>";
    if (typeof opts.count === "number") inner += '<span class="chip__count">' + opts.count + "</span>";
    el.innerHTML = inner;
    el.addEventListener("click", opts.onClick);
    return el;
  }

  function buildChipRows() {
    const catRow = document.getElementById("categoryChips");
    const curveRow = document.getElementById("curveChips");
    const convRow = document.getElementById("conversionChips");

    catRow.innerHTML = "";
    catRow.appendChild(chip({
      active: filterState.category === "", label: "All", count: leaders.length,
      onClick: () => { filterState.category = ""; refreshGrid(); },
    }));
    CATEGORY_ORDER.forEach((key) => {
      const sample = leaders.find((l) => l.categoryKey === key);
      if (!sample) return;
      catRow.appendChild(chip({
        active: filterState.category === key,
        roundelSrc: sample.categoryBadge,
        catKey: key,
        label: CATEGORY_LABELS[key],
        count: leaders.filter((l) => l.categoryKey === key).length,
        onClick: () => { filterState.category = filterState.category === key ? "" : key; refreshGrid(); },
      }));
    });

    curveRow.innerHTML = "";
    curveRow.appendChild(chip({
      active: filterState.curve === "", label: "All",
      onClick: () => { filterState.curve = ""; refreshGrid(); },
    }));
    CURVE_ORDER.forEach((curve) => {
      const sample = leaders.find((l) => l.curve === curve);
      if (!sample) return;
      curveRow.appendChild(chip({
        active: filterState.curve === curve,
        roundelSrc: sample.curveBadge,
        label: curve,
        onClick: () => { filterState.curve = filterState.curve === curve ? "" : curve; refreshGrid(); },
      }));
    });

    convRow.innerHTML = "";
    convRow.appendChild(chip({
      active: filterState.conversion === "", label: "All",
      onClick: () => { filterState.conversion = ""; refreshGrid(); },
    }));
    CONVERSION_ORDER.forEach((conv) => {
      const sample = leaders.find((l) => l.conversion === conv);
      if (!sample) return;
      convRow.appendChild(chip({
        active: filterState.conversion === conv,
        roundelSrc: sample.conversionBadge,
        label: conv,
        onClick: () => { filterState.conversion = filterState.conversion === conv ? "" : conv; refreshGrid(); },
      }));
    });
  }

  function filterSummaryText() {
    const bits = [];
    if (filterState.category) bits.push(CATEGORY_LABELS[filterState.category]);
    if (filterState.curve) bits.push(filterState.curve);
    if (filterState.conversion) bits.push(filterState.conversion);
    if (filterState.search) bits.push('"' + filterState.search + '"');
    return bits.length ? bits.join(" · ") : "showing all 54";
  }

  function applyCollapsed() {
    const toolbar = document.getElementById("toolbar");
    const toggle = document.getElementById("filterToggle");
    if (!toolbar) return;
    toolbar.classList.toggle("is-collapsed", filtersCollapsed);
    toggle.setAttribute("aria-expanded", String(!filtersCollapsed));
  }

  function refreshGrid() {
    buildChipRows();
    renderSections();
    document.getElementById("filterSummary").textContent = filterSummaryText();
  }

  function renderGrid() {
    app.innerHTML = "";
    app.appendChild(document.getElementById("tpl-grid").content.cloneNode(true));

    const search = document.getElementById("searchInput");
    search.value = filterState.search;
    search.addEventListener("input", (e) => {
      filterState.search = e.target.value;
      renderSections();
      document.getElementById("filterSummary").textContent = filterSummaryText();
    });

    document.getElementById("clearFilters").addEventListener("click", () => {
      filterState.search = "";
      filterState.category = "";
      filterState.curve = "";
      filterState.conversion = "";
      document.getElementById("searchInput").value = "";
      refreshGrid();
    });

    document.getElementById("filterToggle").addEventListener("click", () => {
      filtersCollapsed = !filtersCollapsed;
      applyCollapsed();
    });

    applyCollapsed();
    refreshGrid();
    rosterCountEl.textContent = leaders.length + " leaders";
  }

  function renderCardsInto(container, list) {
    const cardTpl = document.getElementById("tpl-card");
    list.forEach((leader) => {
      const node = cardTpl.content.cloneNode(true);
      const card = node.querySelector(".card");
      card.href = "#/leader/" + leader.slug;
      card.dataset.categoryKey = leader.categoryKey;

      const img = node.querySelector(".card__portrait > img");
      img.src = leader.image;
      img.alt = leader.name + " portrait";

      const cat = node.querySelector(".card__cat-roundel img");
      cat.src = leader.categoryBadge;
      cat.alt = CATEGORY_LABELS[leader.categoryKey] + " focus";

      node.querySelector(".card__name").textContent = leader.name;
      node.querySelector(".card__civ").textContent = leader.civilization;

      const cv = node.querySelector(".card__curve-roundel img");
      cv.src = leader.curveBadge;
      cv.alt = leader.curve + " curve";
      const cn = node.querySelector(".card__conversion-roundel img");
      cn.src = leader.conversionBadge;
      cn.alt = leader.conversion + " conversion";

      container.appendChild(node);
    });
  }

  function renderSections() {
    const host = document.getElementById("leaderSections");
    const emptyState = document.getElementById("emptyState");
    const resultCount = document.getElementById("resultCount");
    if (!host) return;

    const list = filteredLeaders();
    host.innerHTML = "";

    const categories = filterState.category ? [filterState.category] : CATEGORY_ORDER;
    let shown = 0;

    categories.forEach((key) => {
      const inCategory = list.filter((l) => l.categoryKey === key);
      if (!inCategory.length) return;
      shown += inCategory.length;

      const section = document.createElement("section");
      section.className = "category-section";
      section.dataset.categoryKey = key;

      const fullCount = leaders.filter((l) => l.categoryKey === key).length;
      const header = document.createElement("div");
      header.className = "category-section__header";
      header.innerHTML =
        '<span class="roundel roundel--md"><img src="' + esc(inCategory[0].categoryBadge) + '" alt=""></span>' +
        '<h2 class="category-section__title">' + esc(CATEGORY_LABELS[key]) + "</h2>" +
        '<span class="category-section__count">' + inCategory.length + " of " + fullCount + "</span>";
      section.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "grid";
      renderCardsInto(grid, inCategory);
      section.appendChild(grid);
      host.appendChild(section);
    });

    resultCount.textContent = shown + " of " + leaders.length + " leaders";
    emptyState.hidden = shown !== 0;
  }

  // ---------- DETAIL ----------

  function statBlock(src, label, caption) {
    return (
      '<span class="stat"><span class="roundel roundel--lg"><img src="' + esc(src) + '" alt=""></span>' +
      '<span class="stat__label"><span class="stat__value">' + esc(label) + "</span>" +
      '<span class="stat__caption">' + esc(caption) + "</span></span></span>"
    );
  }

  function abilityCard(kicker, name, text) {
    if (!name && !text) return "";
    return (
      '<div class="ability-card"><p class="ability-card__kicker">' + esc(kicker) + "</p>" +
      '<p class="ability-card__name">' + esc(name) + "</p>" +
      '<p class="ability-card__text">' + escKw(text) + "</p></div>"
    );
  }

  function subcards(items, metaKey) {
    return items
      .map((it) =>
        '<div class="subcard"><p class="subcard__title">' + esc(it.name) + "</p>" +
        (it[metaKey] ? '<p class="subcard__meta">' + esc(it[metaKey]) + "</p>" : "") +
        '<p class="subcard__text">' + escKw(it.notes) + "</p></div>"
      )
      .join("");
  }

  function renderCivProfile(leader) {
    const ci = leader.civInfo || {};
    let html = '<section class="section" data-category-key="' + esc(leader.categoryKey) + '">';
    html += '<h2 class="section__title">Civilization VI Profile</h2><hr class="section__rule">';
    html += '<div class="ability-grid">';
    html += abilityCard("Leader Ability", ci.leader_ability && ci.leader_ability.name, ci.leader_ability && ci.leader_ability.text);
    html += abilityCard("Agenda", ci.agenda && ci.agenda.name, ci.agenda && ci.agenda.text);
    html += abilityCard("Civilization Ability", ci.civ_ability && ci.civ_ability.name, ci.civ_ability && ci.civ_ability.text);
    html += "</div>";

    if (ci.unique_units && ci.unique_units.length) {
      html += '<p class="subgroup-label">Unique Units</p><div class="subcard-grid">' + subcards(ci.unique_units, "replaces") + "</div>";
    }
    if (ci.unique_infrastructure && ci.unique_infrastructure.length) {
      html += '<p class="subgroup-label">Unique Infrastructure</p><div class="subcard-grid">' + subcards(ci.unique_infrastructure, "type") + "</div>";
    }
    if (ci.historical_background) {
      html += '<div class="lore"><p class="lore__label">Historical Background</p><p>' + esc(ci.historical_background) + "</p></div>";
    }
    return html + "</section>";
  }

  function renderChecklist(items) {
    return '<ul class="checklist">' + items.map((s) => "<li>" + escKw(s) + "</li>").join("") + "</ul>";
  }

  function renderLoopBox(label, items) {
    return (
      '<div class="subblock"><p class="subblock__label">' + esc(label) + "</p>" +
      '<div class="loop-box"><ul>' + items.map((s) => "<li>" + escKw(s) + "</li>").join("") + "</ul></div></div>"
    );
  }

  function renderCheckpoints(checkpoints) {
    const cards = checkpoints.map((cp) => {
      let branches = "";
      if (cp.if_yes) branches += '<div class="checkpoint__branch"><b>Yes</b><span>' + escKw(cp.if_yes) + "</span></div>";
      if (cp.if_no) branches += '<div class="checkpoint__branch"><b>No</b><span>' + escKw(cp.if_no) + "</span></div>";
      return (
        '<div class="checkpoint"><p class="checkpoint__at">Checkpoint — ' + esc(cp.at) + "</p>" +
        '<p class="checkpoint__test">' + escKw(cp.test) + "</p>" +
        '<div class="checkpoint__branches">' + branches + "</div></div>"
      );
    }).join("");
    return '<div class="subblock"><p class="subblock__label">Checkpoints</p><div class="checkpoint-grid">' + cards + "</div></div>";
  }

  function renderPhase(phase, index) {
    let inner = '<div class="phase__node">' + (index + 1) + "</div>";
    inner += '<div class="phase__card">';
    inner += '<div class="phase__header"><h3 class="phase__title">' + esc(phase.phase) + "</h3>";
    if (phase.turns) inner += '<span class="phase__turns">Turns ' + esc(phase.turns) + "</span>";
    inner += "</div>";
    if (phase.goal) inner += '<p class="phase__goal">' + escKw(phase.goal) + "</p>";
    if (phase.opening_statement) inner += '<div class="note-callout">' + escKw(phase.opening_statement) + "</div>";
    if (phase.steps) inner += renderChecklist(phase.steps);
    if (phase.tests) inner += renderChecklist(phase.tests);
    if (phase.staging_checklist) inner += renderLoopBox("Staging checklist", phase.staging_checklist);
    if (phase.core_loop) inner += renderLoopBox("Core loop", phase.core_loop);
    if (phase.per_turn_check) inner += renderLoopBox("Per-turn check", phase.per_turn_check);
    if (phase.opportunity_trigger) inner += '<div class="note-callout">' + escKw(phase.opportunity_trigger) + "</div>";
    if (phase.checkpoints) inner += renderCheckpoints(phase.checkpoints);
    inner += "</div>";
    return '<div class="phase">' + inner + "</div>";
  }

  function renderSecondary(leader) {
    const sec = leader.secondary;
    if (!sec) return "";
    let html = '<details class="secondary-note"><summary>Alt-shape overlay — ' + esc(sec.secondary_shape) + "</summary>";
    html += '<div class="secondary-note__body">';
    if (sec.reason) html += "<p>" + escKw(sec.reason) + "</p>";
    if (sec.rule) html += "<p>" + escKw(sec.rule) + "</p>";
    if (sec.secondary_structure) html += '<div class="timeline">' + sec.secondary_structure.map(renderPhase).join("") + "</div>";
    return html + "</div></details>";
  }

  function renderListPlain(items) {
    return '<ul class="list-plain">' + items.map((s) => "<li>" + escKw(s) + "</li>").join("") + "</ul>";
  }

  function renderGuide(leader) {
    const ctx = leader.context || {};
    const tmpl = leader.template || {};
    let html = '<section class="section" data-category-key="' + esc(leader.categoryKey) + '">';
    html += '<h2 class="section__title">Leadership Focus Guide</h2><hr class="section__rule">';

    html += curvePanel(leader.curve, leader.categoryKey);

    if (tmpl.principle) {
      html += '<div class="principle"><span class="principle__glyph">❝</span><p>' + escKw(tmpl.principle) + "</p></div>";
    }
    if (tmpl.structure && tmpl.structure.length) {
      html += '<div class="timeline">' + tmpl.structure.map(renderPhase).join("") + "</div>";
    }

    html += renderSecondary(leader);

    if (tmpl.abort_branch) {
      html += '<div class="callout callout--warn"><p class="callout__title">▲ Abort Branch</p>';
      html += "<p><b>Trigger:</b> " + escKw(tmpl.abort_branch.trigger) + "</p>";
      if (tmpl.abort_branch.actions) {
        html += "<ul>" + tmpl.abort_branch.actions.map((s) => "<li>" + escKw(s) + "</li>").join("") + "</ul>";
      }
      html += "</div>";
    }
    if (tmpl.fail_state) {
      html += '<div class="callout callout--danger"><p class="callout__title">✕ Fail State</p><p>' + escKw(tmpl.fail_state) + "</p></div>";
    }

    html += '<div class="two-col">';
    if (ctx.caveats && ctx.caveats.length) {
      html += '<div><p class="subgroup-label">Caveats</p>' + renderListPlain(ctx.caveats) + "</div>";
    }
    if (ctx.guide_requirements && ctx.guide_requirements.length) {
      html += '<div><p class="subgroup-label">Guide Must Account For</p>' + renderListPlain(ctx.guide_requirements) + "</div>";
    }
    html += "</div>";

    if (tmpl.anti_patterns && tmpl.anti_patterns.length) {
      html += '<p class="subgroup-label">Common Mistakes to Avoid</p>' + renderListPlain(tmpl.anti_patterns);
    }
    return html + "</section>";
  }

  function renderDetail(leader) {
    app.innerHTML = "";
    app.appendChild(document.getElementById("tpl-detail").content.cloneNode(true));

    const article = app.querySelector(".detail");
    article.dataset.categoryKey = leader.categoryKey;

    let rail = statBlock(leader.categoryBadge, CATEGORY_LABELS[leader.categoryKey], "Focus");
    rail += statBlock(leader.curveBadge, leader.curve, "Curve");
    rail += statBlock(leader.conversionBadge, leader.conversion, "Conversion");

    let pills = '<span class="pill pill--accent">Shape: ' + esc(leader.shape) +
      (leader.altShape ? " + " + esc(leader.altShape) : "") + "</span>";
    if (leader.convertBy) pills += '<span class="pill">Convert by turn ' + esc(leader.convertBy) + "</span>";
    if (leader.conditionCost && leader.conditionCost !== "None") {
      pills += '<span class="pill">Cost: ' + esc(leader.conditionCost) + "</span>";
    }

    document.getElementById("detailHero").innerHTML =
      '<div class="detail__portrait"><img src="' + esc(leader.image) + '" alt="' + esc(leader.name) + ' portrait"></div>' +
      '<div class="detail__heading">' +
      '<p class="detail__eyebrow">' + esc(leader.civilization) +
      (leader.expansionOrigin ? " · " + esc(leader.expansionOrigin) : "") + "</p>" +
      "<h1>" + esc(leader.name) + "</h1>" +
      '<p class="detail__title">' + esc(leader.leaderTitle || "") + "</p>" +
      '<div class="detail__stat-rail">' + rail + "</div>" +
      '<div class="detail__stat-rail" style="margin-top:12px">' + pills + "</div></div>";

    rosterCountEl.textContent = leader.name;
    document.getElementById("detailBody").innerHTML = renderCivProfile(leader) + renderGuide(leader);

    wirePager(leader);
    window.scrollTo(0, 0);
  }

  function wirePager(current) {
    const idx = leaders.findIndex((l) => l.slug === current.slug);
    const prev = leaders[(idx - 1 + leaders.length) % leaders.length];
    const next = leaders[(idx + 1) % leaders.length];
    document.getElementById("prevLeader").addEventListener("click", () => { location.hash = "#/leader/" + prev.slug; });
    document.getElementById("nextLeader").addEventListener("click", () => { location.hash = "#/leader/" + next.slug; });
  }

  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    const r = parseRoute();
    if (r.view !== "detail" || !leadersBySlug.has(r.slug)) return;
    if (e.key === "ArrowRight") document.getElementById("nextLeader").click();
    if (e.key === "ArrowLeft") document.getElementById("prevLeader").click();
  });

  // ---------- QUIZ ----------

  const QUESTIONS = [
    {
      key: "category", weight: 3,
      text: "Which victory actually excites you?",
      hint: "Pick the game you want to be playing at turn 150, not the one you think is strongest.",
      options: [
        { value: "military", title: "Conquest", desc: "Take cities. Armies are the plan, not the insurance.", cat: "military" },
        { value: "production", title: "The Machine", desc: "Districts, infrastructure, and raw output that never stops.", cat: "production" },
        { value: "science", title: "Research Race", desc: "Out-tech everyone and win from the future.", cat: "science" },
        { value: "culture", title: "Influence", desc: "Wonders, tourism, loyalty — win by being irresistible.", cat: "culture" },
        { value: "faith", title: "Belief", desc: "Religion as an engine, not a side hustle.", cat: "faith" },
        { value: "gold", title: "The Treasury", desc: "Trade and money, buying what others must build.", cat: "gold" },
      ],
    },
    {
      key: "curve", weight: 2.5,
      text: "When do you want to be strongest?",
      hint: "This is the single biggest predictor of whether a leader will feel good to you.",
      options: [
        { value: "Spike", title: "Immediately", desc: "Loud before turn 100. Hit hard, bank it, coast.", curve: "Spike" },
        { value: "Ramp", title: "Mid-game", desc: "Build up, then peak through Medieval and Renaissance.", curve: "Ramp" },
        { value: "Bloom", title: "Late", desc: "Quiet for ages, then decisive from Industrial onward.", curve: "Bloom" },
        { value: "Flat", title: "Always, evenly", desc: "No spikes, no dead zones. Compounds the whole game.", curve: "Flat" },
      ],
    },
    {
      key: "conversion", weight: 2,
      text: "What kind of payoff do you trust?",
      hint: "How much risk you accept in exchange for how much ceiling.",
      options: [
        { value: "Permanent", title: "Banked and mine", desc: "Gains that persist long after the bonus stops mattering.", conv: "Permanent" },
        { value: "Conditional", title: "Kept on a condition", desc: "Strong while a state holds — war, suzerainty, amenities. I'll maintain it.", conv: "Conditional" },
        { value: "Expiring", title: "One decisive window", desc: "All-in on a timer. If it works, it's over early.", conv: "Expiring" },
      ],
    },
    {
      key: "shape", weight: 2,
      text: "How do you like to be told what to do?",
      hint: "Different leaders demand genuinely different kinds of attention.",
      options: [
        { value: "Monitor", title: "Watch one number", desc: "Give me a stat and bands, and I'll react every turn.", shape: "Monitor" },
        { value: "Countdown", title: "Race a deadline", desc: "Give me a turn to beat and I'll sprint at it.", shape: "Countdown" },
        { value: "Front-Load", title: "Plan it all up front", desc: "Let me make the irreversible calls early, then execute.", shape: "Front-Load" },
        { value: "Gate", title: "Wait for the unlock", desc: "Build quietly toward a trigger, then open up.", shape: "Gate" },
        { value: "Dead-Phase", title: "Be patient a long time", desc: "I can play 100 flat turns if the payoff is enormous.", shape: "Dead-Phase" },
        { value: "Linear", title: "Steady era-by-era", desc: "A normal plan the ability quietly amplifies.", shape: "Linear" },
      ],
    },
    {
      key: "cost", weight: 1,
      text: "How do you feel about strings attached?",
      hint: "Some kits are stronger but charge you a permanent restriction.",
      options: [
        { value: "accepts", title: "Give me the strong kit", desc: "I'll live with a hard requirement if the ceiling is higher." },
        { value: "clean", title: "Keep it unconditional", desc: "I want a bonus that just works, with nothing to maintain." },
      ],
    },
  ];

  let quizAnswers = {};
  let quizIndex = 0;

  function startQuiz() {
    app.innerHTML = "";
    app.appendChild(document.getElementById("tpl-quiz").content.cloneNode(true));
    quizAnswers = {};
    quizIndex = 0;
    rosterCountEl.textContent = "5 questions";
    renderQuestion();
  }

  function setProgress(frac) {
    const bar = document.getElementById("quizProgress");
    if (bar) bar.style.width = Math.round(frac * 100) + "%";
  }

  function renderQuestion() {
    const stage = document.getElementById("quizStage");
    const q = QUESTIONS[quizIndex];
    setProgress(quizIndex / QUESTIONS.length);

    const opts = q.options.map((o, i) => {
      const badge = optionBadge(o);
      return (
        '<button class="option" type="button" data-i="' + i + '"' +
        (o.cat ? ' data-category-key="' + o.cat + '"' : "") + ">" +
        badge +
        '<span class="option__body"><span class="option__title">' + esc(o.title) + "</span>" +
        '<span class="option__desc">' + esc(o.desc) + "</span></span></button>"
      );
    }).join("");

    stage.innerHTML =
      '<div class="question-plate">' +
      '<p class="question__step">Question ' + (quizIndex + 1) + " of " + QUESTIONS.length + "</p>" +
      '<h2 class="question__text">' + esc(q.text) + "</h2>" +
      '<p class="question__hint">' + esc(q.hint) + "</p>" +
      '<div class="option-list">' + opts + "</div>" +
      '<div class="quiz__nav">' +
      (quizIndex > 0 ? '<button class="btn btn--sm" id="quizBack">‹ Back</button>' : "<span></span>") +
      '<a class="btn btn--sm" href="#/leaders">Skip to Codex</a>' +
      "</div></div>";

    stage.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        quizAnswers[q.key] = q.options[Number(btn.dataset.i)];
        if (quizIndex < QUESTIONS.length - 1) {
          quizIndex++;
          renderQuestion();
        } else {
          setProgress(1);
          renderResults();
        }
        window.scrollTo(0, 0);
      });
    });

    const back = document.getElementById("quizBack");
    if (back) back.addEventListener("click", () => { quizIndex--; renderQuestion(); });
  }

  function optionBadge(o) {
    let src = null;
    if (o.cat) { const s = leaders.find((l) => l.categoryKey === o.cat); if (s) src = s.categoryBadge; }
    else if (o.curve) { const s = leaders.find((l) => l.curve === o.curve); if (s) src = s.curveBadge; }
    else if (o.conv) { const s = leaders.find((l) => l.conversion === o.conv); if (s) src = s.conversionBadge; }
    if (!src) return '<span class="roundel roundel--sm" style="border-style:dashed"></span>';
    return '<span class="roundel roundel--sm"><img src="' + esc(src) + '" alt=""></span>';
  }

  function scoreLeaders() {
    const a = quizAnswers;
    const maxScore = QUESTIONS.reduce((sum, q) => sum + q.weight, 0);

    const scored = leaders.map((l) => {
      let score = 0;
      const why = [];

      if (a.category && l.categoryKey === a.category.value) {
        score += 3;
        why.push("Built for " + CATEGORY_LABELS[l.categoryKey].toLowerCase() + " — the focus you picked.");
      }
      if (a.curve && l.curve === a.curve.value) {
        score += 2.5;
        why.push("A " + l.curve + " curve — " + CURVE_INFO[l.curve]);
      }
      if (a.conversion && l.conversion === a.conversion.value) {
        score += 2;
        why.push(l.conversion + " conversion, which is the payoff style you trust.");
      }
      if (a.shape && (l.shape === a.shape.value || l.altShape === a.shape.value)) {
        score += 2;
        why.push("Plays as a " + a.shape.value + " guide — the kind of attention you said you want.");
      }
      const hasCost = l.conditionCost && l.conditionCost !== "None";
      if (a.cost) {
        if (a.cost.value === "accepts" && hasCost) {
          score += 1;
          why.push("Charges a real price — " + l.conditionCost + " — and you said you would pay it.");
        } else if (a.cost.value === "clean" && !hasCost) {
          score += 1;
          why.push("No condition attached. The bonus is simply free.");
        }
      }
      return { leader: l, score: score, pct: Math.round((score / maxScore) * 100), why: why };
    });

    scored.sort((x, y) => y.score - x.score || x.leader.name.localeCompare(y.leader.name));
    return scored.slice(0, 3);
  }

  function renderResults() {
    const stage = document.getElementById("quizStage");
    const top = scoreLeaders();
    const numerals = ["I", "II", "III"];

    const cards = top.map((r, i) => {
      const l = r.leader;
      const why = r.why.length
        ? r.why
        : ["No strong match on your answers — this is the closest the roster gets. Try the Codex directly."];
      return (
        '<article class="result-card" data-category-key="' + esc(l.categoryKey) + '">' +
        '<span class="result-card__rank">' + numerals[i] + "</span>" +
        '<div class="result-card__portrait"><img src="' + esc(l.image) + '" alt="' + esc(l.name) + ' portrait"></div>' +
        '<div class="result-card__body">' +
        '<h3 class="result-card__name">' + esc(l.name) + "</h3>" +
        '<p class="result-card__civ">' + esc(l.civilization) + " · " + esc(l.leaderTitle || "") + "</p>" +
        '<div class="match-bar"><div class="match-bar__fill" style="width:' + r.pct + '%"></div></div>' +
        '<p class="match-pct">' + r.pct + "% match</p>" +
        '<div class="result-card__roundels">' +
        '<span class="roundel roundel--xs"><img src="' + esc(l.categoryBadge) + '" alt=""></span>' +
        '<span class="roundel roundel--xs"><img src="' + esc(l.curveBadge) + '" alt=""></span>' +
        '<span class="roundel roundel--xs"><img src="' + esc(l.conversionBadge) + '" alt=""></span>' +
        "</div>" +
        '<ul class="why-list">' + why.map((w) => "<li>" + esc(w) + "</li>").join("") + "</ul>" +
        '<a class="btn btn--sm" href="#/leader/' + esc(l.slug) + '">Read the full guide →</a>' +
        "</div></article>"
      );
    }).join("");

    stage.innerHTML =
      '<div class="result-head">' +
      '<p class="landing__eyebrow">Your Three</p>' +
      '<h2 class="landing__title landing__title--sm">Closest Matches</h2>' +
      '<p class="landing__note">Scored against focus, curve, conversion, guide shape, and your tolerance for conditions.</p>' +
      "</div>" + cards +
      '<div class="quiz__nav"><button class="btn" id="quizRetake">↺ Retake the quiz</button>' +
      '<a class="btn" href="#/leaders">Browse the full Codex</a></div>';

    document.getElementById("quizRetake").addEventListener("click", startQuiz);
  }

  // ---------- boot ----------

  loadData()
    .then(route)
    .catch((err) => {
      app.innerHTML = '<p class="empty-state">Could not load leader data (' + esc(err.message) + "). Try refreshing.</p>";
    });
})();
