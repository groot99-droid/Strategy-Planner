// Landing, leader grid and leader detail.
import { esc, escKw, icon, CATEGORY_ORDER, CATEGORY_LABELS, CATEGORY_BLURB, CURVE_ORDER, CURVE_INFO, CONVERSION_ORDER, CONVERSION_INFO, ERA_ORDER, ERA_SPAN, REGION_ORDER, titleCase } from "./util.js";
import { heroHtml, rowHtml, leaderCard, wonderCard, terrainCard, cityStateCard, pantheonCard, linkCard, statBlock, sectionHead, subnavHtml, curvePanel } from "./components.js";

function creditLine(ctx, id) {
  const c = ctx.creditsById.get(id); if (!c) return "";
  return `<a href="${esc(c.source_url)}" rel="noopener" target="_blank">${esc(c.caption || c.commons_title.replace(/^File:/, ""))}</a> · ${esc(c.licence)}${c.author ? " · " + esc(c.author) : ""}`;
}

/* ---------- landing ---------- */
export function renderLanding(ctx) {
  const { leaders, codex } = ctx;
  const featuredLeaders = leaders.filter(l => l.hero).slice(0, 6);
  const featuredWonders = codex.wonders.wonders.filter(w => w.image).slice(0, 3);
  const slides = [
    { image: featuredLeaders[0] ? featuredLeaders[0].hero : null, fallbackImage: leaders[0].image, kicker: `<span>A strategist's codex</span>`, title: "Every leader has a shape.",
      sub: "Fifty-four leaders, read the same way: when the kit is loudest, what it charges, and the turn by which the advantage must become something permanent. Now with the history behind each one, and the map they were built to play on.",
      actions: [{ href: "#/leaders", label: "Open the codex", primary: true }, { href: "#/quiz", label: "Find my leader" }], credit: featuredLeaders[0] ? creditLine(ctx, featuredLeaders[0].heroCredit) : "" },
    ...featuredLeaders.slice(1, 4).map(l => ({ image: l.hero, catKey: l.categoryKey, era: l.era, kicker: `<span class="tag">${esc(CATEGORY_LABELS[l.categoryKey])}</span><span>${esc(l.civilization)} · ${esc(l.era)}</span>`, title: l.name,
      sub: esc(l.history ? l.history.legacy : l.note), meta: [`<span class="pill">${esc(l.curve)} curve</span>`, `<span class="pill">${esc(l.conversion)}</span>`, l.history ? `<span class="pill">${esc(l.history.dates.display)}</span>` : ""],
      actions: [{ href: `#/leader/${l.slug}`, label: "Read the guide", primary: true }], credit: creditLine(ctx, l.heroCredit) })),
    ...featuredWonders.slice(0, 2).map(w => ({ image: w.image, kicker: `<span class="tag" style="--cat:#A7F3D0">Natural wonder</span><span>${esc(w.real_world.country)}</span>`, title: w.name, sub: esc(w.effect),
      actions: [{ href: `#/wonder/${w.slug}`, label: "See the wonder", primary: true }, { href: "#/wonders", label: "All 37 wonders" }], credit: creditLine(ctx, w.imageCredit) })),
  ];
  const strip = `<section class="strip" aria-label="The three measures"><div class="strip__inner">
    <div class="strip__item"><h3>${icon("compass", "icon icon--sm")} Focus</h3><p>What the kit is for: Military, Production, Science, Culture, Faith or Gold.</p></div>
    <div class="strip__item"><h3>${icon("mountain", "icon icon--sm")} Power curve</h3><p>When the leader is loudest: Spike, Ramp, Bloom or Flat.</p></div>
    <div class="strip__item"><h3>${icon("shield", "icon icon--sm")} Conversion</h3><p>Whether the advantage keeps: Permanent, Conditional or Expiring.</p></div>
    <div class="strip__item"><h3>${icon("book", "icon icon--sm")} History</h3><p>Era, country, dates and temperament for every leader, from the record.</p></div>
  </div></section>`;
  const catRows = CATEGORY_ORDER.map(k => {
    const ls = leaders.filter(l => l.categoryKey === k);
    return rowHtml({ id: `row-${k}`, title: `${CATEGORY_LABELS[k]}`, sub: CATEGORY_BLURB[k], href: `#/leaders?focus=${k}`, catKey: k, cards: ls.map(l => leaderCard(l, { kicker: `${l.curve} · ${l.conversion}` })) });
  }).join("");
  const eraRows = ERA_ORDER.map(e => {
    const ls = leaders.filter(l => l.era === e); if (!ls.length) return "";
    return rowHtml({ id: `row-era-${e.toLowerCase()}`, title: `${e} era`, sub: ERA_SPAN[e], href: `#/leaders?era=${e}`, era: e, cards: ls.map(l => leaderCard(l, { kicker: l.history ? l.history.dates.display : "" })), speed: 22 });
  }).join("");
  const wonderRow = rowHtml({ id: "row-wonders", title: "Natural wonders", sub: `${codex.wonders.wonders.length} features the map was born with`, href: "#/wonders", cards: codex.wonders.wonders.filter(w => w.image).concat(codex.wonders.wonders.filter(w => !w.image)).map(w => wonderCard(w)), speed: 30 });
  const terrainRow = rowHtml({ id: "row-terrain", title: "Terrain", sub: "The ground each kit was built for", href: "#/terrain", cards: codex.terrain.terrain.map(t => terrainCard(t)), speed: 24 });
  const csTypes = Object.fromEntries(codex.cityStates.types.map(t => [t.type, t]));
  const csRow = rowHtml({ id: "row-city-states", title: "City-states", sub: "Suzerain bonuses worth three envoys", href: "#/city-states", cards: codex.cityStates.city_states.map(c => cityStateCard(c, csTypes[c.type])), speed: 30 });
  const pantheonRow = rowHtml({ id: "row-pantheons", title: "Pantheons", sub: "The first belief, held for the whole game", href: "#/pantheons", cards: codex.pantheons.pantheons.map(p => pantheonCard(p)), speed: 28 });
  const refRow = rowHtml({ id: "row-reference", title: "The world around the leader", sub: "Mechanics every guide assumes", autoplay: false, cards: [
    linkCard({ href: "#/eras", image: codex.eras.image, kicker: "Reference", title: "World eras and ages", sub: "Era Score, Golden and Dark Ages, dedications", wide: true }),
    linkCard({ href: "#/barbarians", image: codex.barbarians.image, kicker: "Reference", title: "Barbarians and clans", sub: "Outposts, raids and the seven clans", wide: true }),
    linkCard({ href: "#/city-states", image: codex.cityStates.image, kicker: "Reference", title: "City-states", sub: "Six types, 48 cities, envoy math", wide: true }),
    linkCard({ href: "#/pantheons", image: codex.pantheons.image, kicker: "Reference", title: "Pantheons", sub: "25 beliefs and the ground they want", wide: true }),
    linkCard({ href: "#/quiz", image: null, kicker: "Five questions", title: "Find my leader", sub: "Scored on focus, curve, conversion and shape", wide: true }),
  ] });
  const cta = `<section class="section"><div class="wrap" style="text-align:center"><div class="section__kicker">Five questions</div><h2 class="section__title">Which of the fifty-four is yours?</h2><p class="section__lede" style="margin:0 auto var(--space-lg)">Answer honestly about how you actually play. Three matches come back with the reasoning shown.</p><a class="btn btn--primary btn--lg" href="#/quiz">Take the quiz</a></div></section>`;
  return { html: heroHtml(slides) + strip + catRows + wonderRow + eraRows + terrainRow + csRow + pantheonRow + refRow + cta, title: "Leadership Focus — Civilization VI Strategy Codex" };
}

/* ---------- leader grid ---------- */
export function renderLeaders(ctx, query) {
  const { leaders } = ctx;
  const state = { q: query.get("q") || "", focus: query.get("focus") || "", curve: query.get("curve") || "", conversion: query.get("conversion") || "", era: query.get("era") || "", region: query.get("region") || "" };
  const chips = (name, values, labelFn) => values.map(v => `<button class="chip${name === "focus" ? " chip--cat" : ""}" type="button" data-filter="${name}" data-value="${esc(v)}" aria-pressed="${state[name] === v}" ${name === "focus" ? `data-category-key="${esc(v)}"` : ""}>${name === "focus" ? '<span class="dot" aria-hidden="true"></span>' : ""}${esc(labelFn ? labelFn(v) : v)} <span class="chip__count">${leaders.filter(l => (name === "focus" ? l.categoryKey : name === "era" ? l.era : name === "region" ? l.region : l[name]) === v).length}</span></button>`).join("");
  const regions = REGION_ORDER.filter(r => leaders.some(l => l.region === r));
  const toolbar = `<div class="toolbar" id="toolbar">
    <div class="toolbar__row"><div><label class="field__label" for="leaderSearch">Search</label><input class="input" id="leaderSearch" type="search" value="${esc(state.q)}" placeholder="Leader, civilization, country, title…" autocomplete="off"></div>
    <div><span class="field__label">Focus</span><div class="chip-row">${chips("focus", CATEGORY_ORDER, v => CATEGORY_LABELS[v])}</div></div></div>
    <div class="toolbar__row"><div><span class="field__label">Power curve</span><div class="chip-row">${chips("curve", CURVE_ORDER)}</div></div><div><span class="field__label">Conversion</span><div class="chip-row">${chips("conversion", CONVERSION_ORDER)}</div></div></div>
    <div class="toolbar__row"><div><span class="field__label">Era</span><div class="chip-row">${chips("era", ERA_ORDER)}</div></div><div><span class="field__label">Region</span><div class="chip-row">${chips("region", regions)}</div></div></div>
    <div class="toolbar__meta"><span id="resultCount" aria-live="polite"></span><button class="btn btn--sm" type="button" id="clearFilters">Clear all</button></div></div>`;
  const html = `<section class="hero hero--short"><div class="hero__media"><div class="hero__slide is-active hero__slide--fallback"></div></div><div class="hero__scrim"></div><div class="hero__content"><div class="hero__inner"><div class="hero__kicker"><span>The codex</span></div><h1 class="hero__title hero__title--page">Fifty-four leaders</h1><p class="hero__sub">Filed by focus, curve and conversion, and now by era and region. Open any of them for the history, the kit, the ground, and the guide.</p></div></div></section>
    <section class="section section--tight"><div class="wrap">${toolbar}<div id="leaderSections"></div><p class="empty-state" id="emptyState" hidden>No leaders match those filters.</p></div></section>`;
  const init = (root) => {
    const sections = root.querySelector("#leaderSections"); const empty = root.querySelector("#emptyState"); const count = root.querySelector("#resultCount");
    const apply = () => {
      const term = state.q.trim().toLowerCase();
      const list = leaders.filter(l => (!state.focus || l.categoryKey === state.focus) && (!state.curve || l.curve === state.curve) && (!state.conversion || l.conversion === state.conversion) && (!state.era || l.era === state.era) && (!state.region || l.region === state.region)
        && (!term || [l.name, l.civilization, l.leaderTitle, l.persona, l.era, l.region, (l.modernCountries || []).join(" "), l.history ? l.history.polity : ""].join(" ").toLowerCase().includes(term)));
      count.textContent = `${list.length} of ${leaders.length} leaders`;
      empty.hidden = list.length > 0;
      sections.innerHTML = CATEGORY_ORDER.map(k => { const ls = list.filter(l => l.categoryKey === k); if (!ls.length) return ""; return `<div data-category-key="${k}"><div class="group-head"><span class="dot" aria-hidden="true"></span><h2>${esc(CATEGORY_LABELS[k])} <span class="muted">${ls.length}</span></h2></div><div class="grid grid--narrow">${ls.map(l => leaderCard(l, { grid: true })).join("")}</div></div>`; }).join("");
      const params = new URLSearchParams(Object.entries(state).filter(([, v]) => v)); const qs = params.toString();
      history.replaceState(null, "", "#/leaders" + (qs ? "?" + qs : ""));
      root.querySelectorAll("[data-filter]").forEach(b => b.setAttribute("aria-pressed", String(state[b.dataset.filter] === b.dataset.value)));
    };
    root.querySelector("#leaderSearch").addEventListener("input", (e) => { state.q = e.target.value; apply(); });
    root.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.filter; state[k] = state[k] === b.dataset.value ? "" : b.dataset.value; apply(); }));
    root.querySelector("#clearFilters").addEventListener("click", () => { Object.keys(state).forEach(k => state[k] = ""); root.querySelector("#leaderSearch").value = ""; apply(); });
    apply();
  };
  return { html, title: "Leaders — Leadership Focus", init };
}

/* ---------- leader detail ---------- */
function abilityCard(kicker, name, text) { if (!name && !text) return ""; return `<div class="panel panel--cat"><div class="panel__kicker">${esc(kicker)}</div><h3 class="panel__title">${esc(name)}</h3><p>${escKw(text)}</p></div>`; }
function subcards(items, metaKey) { return items.map(it => `<div class="subcard"><p class="subcard__title">${esc(it.name)}</p>${it[metaKey] ? `<p class="subcard__meta">${esc(it[metaKey])}</p>` : ""}<p class="subcard__text">${escKw(it.notes)}</p></div>`).join(""); }
function checklist(items) { return `<ul class="checklist">${items.map(s => `<li>${escKw(s)}</li>`).join("")}</ul>`; }
function loopBox(label, items) { return `<div class="subblock"><p class="subblock__label">${esc(label)}</p><div class="loop-box"><ul>${items.map(s => `<li>${escKw(s)}</li>`).join("")}</ul></div></div>`; }
function checkpoints(cps) { return `<div class="subblock"><p class="subblock__label">Checkpoints</p><div class="checkpoint-grid">${cps.map(cp => `<div class="checkpoint"><p class="checkpoint__at">Checkpoint · ${esc(cp.at)}</p><p class="checkpoint__test">${escKw(cp.test)}</p><div class="checkpoint__branches">${cp.if_yes ? `<div class="checkpoint__branch"><b>Yes</b><span>${escKw(cp.if_yes)}</span></div>` : ""}${cp.if_no ? `<div class="checkpoint__branch"><b>No</b><span>${escKw(cp.if_no)}</span></div>` : ""}</div></div>`).join("")}</div></div>`; }
function phase(p, i) {
  let inner = `<div class="phase__header"><h3 class="phase__title">${esc(p.phase)}</h3>${p.turns ? `<span class="phase__turns">Turns ${esc(p.turns)}</span>` : ""}</div>`;
  if (p.goal) inner += `<p class="phase__goal">${escKw(p.goal)}</p>`;
  if (p.opening_statement) inner += `<div class="note-callout">${escKw(p.opening_statement)}</div>`;
  if (p.steps) inner += checklist(p.steps); if (p.tests) inner += checklist(p.tests);
  if (p.staging_checklist) inner += loopBox("Staging checklist", p.staging_checklist);
  if (p.core_loop) inner += loopBox("Core loop", p.core_loop); if (p.per_turn_check) inner += loopBox("Per-turn check", p.per_turn_check);
  if (p.opportunity_trigger) inner += `<div class="note-callout">${escKw(p.opportunity_trigger)}</div>`;
  if (p.checkpoints) inner += checkpoints(p.checkpoints);
  return `<div class="phase"><div class="phase__node" aria-hidden="true">${i + 1}</div><div class="phase__card">${inner}</div></div>`;
}
function listPlain(items) { return `<ul class="list-plain">${items.map(s => `<li>${escKw(s)}</li>`).join("")}</ul>`; }

export function renderLeader(ctx, slug) {
  const l = ctx.bySlug.get(slug); if (!l) return null;
  const { codex } = ctx; const h = l.history; const a = l.affinity; const ci = l.civInfo || {}; const tmpl = l.template || {}; const cx = l.context || {};
  const idx = ctx.leaders.findIndex(x => x.slug === slug); const prev = ctx.leaders[(idx - 1 + ctx.leaders.length) % ctx.leaders.length]; const next = ctx.leaders[(idx + 1) % ctx.leaders.length];
  const kicker = `<span class="tag">${esc(CATEGORY_LABELS[l.categoryKey])}</span>${l.era ? `<span class="tag tag--era">${esc(l.era)}</span>` : ""}<span>${esc(l.civilization)}${l.persona ? ` · ${esc(l.persona)} persona` : ""} · ${esc(l.expansionOrigin)}</span>`;
  const hero = heroHtml([{ image: l.hero, fallbackImage: l.image, catKey: l.categoryKey, era: l.era, kicker, title: l.name, sub: esc(l.leaderTitle),
    meta: [h ? `<span class="pill">${esc(h.dates.display)}</span>` : "", h ? `<span class="pill">${esc(h.polity)}</span>` : "", `<span class="pill pill--accent">${esc(l.shape)}${l.altShape ? " + " + esc(l.altShape) : ""}</span>`, l.convertBy ? `<span class="pill">Convert by turn ${esc(l.convertBy)}</span>` : "", (l.conditionCost && l.conditionCost !== "None") ? `<span class="pill">Cost: ${esc(l.conditionCost)}</span>` : ""],
    credit: l.heroCredit ? creditLine(ctx, l.heroCredit) : "" }], { short: true, id: "leaderHero" });
  const nav = `<div class="detail__nav"><a class="btn btn--sm" href="#/leaders">${icon("chevron-left", "icon icon--sm")} All leaders</a><div class="detail__pager"><a class="btn btn--sm" href="#/leader/${esc(prev.slug)}" rel="prev">${icon("chevron-left", "icon icon--sm")} ${esc(prev.name)}</a><a class="btn btn--sm" href="#/leader/${esc(next.slug)}" rel="next">${esc(next.name)} ${icon("chevron-right", "icon icon--sm")}</a></div></div>`;
  const sections = [{ id: "history", label: "History" }, { id: "profile", label: "Civ VI kit" }, { id: "ground", label: "Ground" }, { id: "world", label: "Wonders, pantheons, city-states" }, { id: "barbarians", label: "Barbarians" }, { id: "guide", label: "Guide" }];
  const rail = `<div class="detail__rail">${statBlock(l.categoryBadge, CATEGORY_LABELS[l.categoryKey], "Focus")}${statBlock(l.curveBadge, l.curve, "Curve")}${statBlock(l.conversionBadge, l.conversion, "Conversion")}</div>`;
  const head = `<section class="section section--tight"><div class="wrap"><div class="detail__head"><div class="detail__portrait"><img src="${esc(l.image)}" alt="${esc(l.name)}, in-game portrait" width="200" height="200"></div><div>${rail}<p class="muted" style="margin-top:var(--space-md)">${esc(l.note)}</p></div></div></div></section>`;
  const historyHtml = h ? `<section class="section" id="history" data-category-key="${esc(l.categoryKey)}"><div class="wrap">${sectionHead("From the record", `${l.name} in history`, "")}
    <dl class="facts">
      <div><dt>Era</dt><dd>${esc(h.era.label)}<br><small class="muted">${esc(h.era.span)}</small></dd></div>
      <div><dt>Lived</dt><dd>${esc(h.dates.born || "unknown")} to ${esc(h.dates.died || "unknown")}<br><small class="muted">${esc(h.dates.historicity)}</small></dd></div>
      <div><dt>Ruled</dt><dd>${esc(h.dates.display)}</dd></div>
      <div><dt>Polity</dt><dd>${esc(h.polity)}</dd></div>
      <div><dt>Modern country</dt><dd><div class="chip-row">${h.modernCountries.map(c => `<span class="chip">${esc(c)}</span>`).join("")}</div></dd></div>
      <div><dt>Region</dt><dd>${esc(h.region)}</dd></div>
      <div><dt>Titles</dt><dd>${h.titles.map(esc).join("<br>")}</dd></div>
      <div><dt>Faith</dt><dd>${esc(h.faith)}</dd></div>
    </dl>
    <div class="two-col" style="margin-top:var(--space-xl)"><div><div class="section__kicker">Codex entry</div><div class="prose">${h.bio.split(/\n+/).map(p => `<p>${esc(p)}</p>`).join("")}<p><b>${esc(h.legacy)}</b></p></div>${h.quote && h.quote.text ? `<blockquote class="quote">“${esc(h.quote.text)}”<cite>${esc(h.quote.source)}</cite></blockquote>` : ""}</div>
    <div><div class="section__kicker">Personality</div><div class="traits">${h.personality.traits.map(t => `<span class="chip chip--cat"><span class="dot" aria-hidden="true"></span>${esc(t)}</span>`).join("")}</div><div class="prose prose--sm"><p>${esc(h.personality.temperament)}</p></div><div class="panel panel--cat" style="margin-top:var(--space-md)"><div class="panel__kicker">In the game</div><h3 class="panel__title">${esc(ci.agenda ? ci.agenda.name : "Agenda")}</h3><p>${esc(h.personality.agenda_tie)}</p></div>
    <p class="muted" style="margin-top:var(--space-md);font-size:var(--text-sm)">Source: <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(h.wikipediaTitle.replace(/ /g, "_"))}" rel="noopener" target="_blank">${esc(h.wikipediaTitle)} on Wikipedia</a> and Wikidata.</p></div></div></div></section>` : "";
  const profile = `<section class="section" id="profile" data-category-key="${esc(l.categoryKey)}"><div class="wrap">${sectionHead("Civilization VI", "The kit", "")}
    <div class="ability-grid">${abilityCard("Leader ability", ci.leader_ability && ci.leader_ability.name, ci.leader_ability && ci.leader_ability.text)}${abilityCard("Agenda", ci.agenda && ci.agenda.name, ci.agenda && ci.agenda.text)}${abilityCard("Civilization ability", ci.civ_ability && ci.civ_ability.name, ci.civ_ability && ci.civ_ability.text)}</div>
    ${ci.unique_units && ci.unique_units.length ? `<p class="subgroup-label">Unique units</p><div class="subcard-grid">${subcards(ci.unique_units, "replaces")}</div>` : ""}
    ${ci.unique_infrastructure && ci.unique_infrastructure.length ? `<p class="subgroup-label">Unique infrastructure</p><div class="subcard-grid">${subcards(ci.unique_infrastructure, "type")}</div>` : ""}
    ${a && a.victoryLean ? `<p class="subgroup-label">Victory lean</p><div class="chip-row">${a.victoryLean.map(v => `<span class="chip">${esc(v)}</span>`).join("")}</div>` : ""}
    ${a && a.rivals && a.rivals.length ? `<p class="subgroup-label">Rivals on this roster</p><ul class="mini-list">${a.rivals.map(r => { const rl = ctx.bySlug.get(r.slug); return rl ? `<li><a href="#/leader/${esc(rl.slug)}"><b>${esc(rl.name)}</b> <small>${esc(rl.civilization)}</small></a><small>${esc(r.why)}</small></li>` : ""; }).join("")}</ul>` : ""}
  </div></section>`;
  const tile = (slug, why, tier) => { const t = ctx.terrainBySlug.get(slug); if (!t) return `<div class="tile"><div class="tile__name">${esc(titleCase(slug))}</div><div class="tile__why">${esc(why || "")}</div></div>`; return `<div class="tile"><a href="#/terrain/${esc(t.slug)}"><img src="${esc(t.image)}" alt="${esc(t.name)} tile" loading="lazy" width="150" height="150"><div class="tile__name">${esc(t.name)}${tier ? ` <span class="muted">tier ${esc(tier)}</span>` : ""}</div></a>${why ? `<div class="tile__why">${esc(why)}</div>` : ""}</div>`; };
  const ground = a ? `<section class="section" id="ground" data-category-key="${esc(l.categoryKey)}"><div class="wrap">${sectionHead("Terrain", "The ground this kit wants", `${a.startBias.length ? `The game seeds ${esc(l.civilization)} near this terrain (start bias, tier 1 strongest). Source: ${esc(a.biasSource)}.` : `${esc(l.civilization)} has no start bias; the map gives it whatever comes.`}`)}
    ${a.startBias.length ? `<p class="subgroup-label">Start bias</p><div class="tile-row">${a.startBias.map(b => tile(b.terrain, "", b.tier)).join("")}</div>` : ""}
    <p class="subgroup-label">Terrain the kit cares about</p><div class="tile-row">${a.terrain.map(t => tile(t.terrain, t.why)).join("")}</div></div></section>` : "";
  const world = a ? `<section class="section" id="world" data-category-key="${esc(l.categoryKey)}"><div class="wrap">${sectionHead("The map", "Wonders, pantheons and city-states", "")}
    <div class="two-col"><div><p class="subgroup-label">Natural wonders worth settling</p>${a.naturalWonders.length ? `<div class="grid">${a.naturalWonders.map(w => { const ww = ctx.wondersBySlug.get(w.slug); return ww ? wonderCard(ww, { grid: true }) + `<p class="muted" style="font-size:var(--text-sm)">${esc(w.why)}</p>` : ""; }).join("")}</div>` : `<p class="muted">No wonder changes this kit's plan; take any that appears.</p>`}</div>
    <div><p class="subgroup-label">Pantheons</p><ul class="mini-list">${a.pantheons.map(p => { const pp = ctx.pantheonsBySlug.get(p.slug); return `<li><a href="#/pantheons#${esc(p.slug)}"><b>${esc(pp ? pp.name : titleCase(p.slug))}</b> <small>${esc(pp ? pp.effect : "")}</small></a><small>${esc(p.why)}</small></li>`; }).join("")}</ul>
    <p class="subgroup-label">City-state priority</p><ul class="mini-list">${a.cityStates.map(c => { const t = codex.cityStates.types.find(x => x.type === c.type); return `<li style="--cat:${t ? esc(t.color) : "inherit"}"><a href="#/city-states#type-${esc(c.type.toLowerCase())}"><b>${esc(c.type)}</b> <small>${t ? esc(t.members.join(", ")) : ""}</small></a><small>${esc(c.why)}</small></li>`; }).join("")}</ul></div></div></div></section>` : "";
  const barbNote = codex.barbarians.leader_notes.find(n => n.slug === l.slug);
  const barb = a ? `<section class="section" id="barbarians" data-category-key="${esc(l.categoryKey)}"><div class="wrap">${sectionHead("The map's own army", "Barbarians", "")}<div class="two-col"><div class="panel panel--cat"><div class="panel__kicker">Stance for ${esc(l.name)}</div><p>${escKw(a.barbarianStance)}</p>${barbNote ? `<p><b>Note.</b> ${escKw(barbNote.note)}</p>` : ""}</div><div class="panel"><div class="panel__kicker">${esc(l.curve)} curve rule</div><p>${escKw(codex.barbarians.strategy_by_curve[l.curve] || "")}</p><a class="btn btn--sm" href="#/barbarians">Barbarians and clans ${icon("arrow", "icon icon--sm")}</a></div></div></div></section>` : "";
  const secondary = l.secondary ? `<details class="secondary-note"><summary>Alt-shape overlay: ${esc(l.secondary.secondary_shape)}</summary><div class="secondary-note__body">${l.secondary.reason ? `<p>${escKw(l.secondary.reason)}</p>` : ""}${l.secondary.rule ? `<p>${escKw(l.secondary.rule)}</p>` : ""}${l.secondary.secondary_structure ? `<div class="timeline">${l.secondary.secondary_structure.map(phase).join("")}</div>` : ""}</div></details>` : "";
  const guide = `<section class="section" id="guide" data-category-key="${esc(l.categoryKey)}"><div class="wrap">${sectionHead("Leadership Focus", "The guide", "")}${curvePanel(l.curve, l.categoryKey)}
    ${tmpl.principle ? `<div class="principle"><span class="principle__glyph" aria-hidden="true">❝</span><p>${escKw(tmpl.principle)}</p></div>` : ""}
    ${tmpl.structure ? `<div class="timeline">${tmpl.structure.map(phase).join("")}</div>` : ""}${secondary}
    ${tmpl.abort_branch ? `<div class="callout callout--warn"><p class="callout__title">${icon("warn", "icon icon--sm")} Abort branch</p><p><b>Trigger:</b> ${escKw(tmpl.abort_branch.trigger)}</p>${tmpl.abort_branch.actions ? `<ul>${tmpl.abort_branch.actions.map(s => `<li>${escKw(s)}</li>`).join("")}</ul>` : ""}</div>` : ""}
    ${tmpl.fail_state ? `<div class="callout callout--danger"><p class="callout__title">${icon("x", "icon icon--sm")} Fail state</p><p>${escKw(tmpl.fail_state)}</p></div>` : ""}
    <div class="two-col">${cx.caveats ? `<div><p class="subgroup-label">Caveats</p>${listPlain(cx.caveats)}</div>` : ""}${cx.guide_requirements ? `<div><p class="subgroup-label">The guide must account for</p>${listPlain(cx.guide_requirements)}</div>` : ""}</div>
    ${cx.era_role ? `<p class="subgroup-label">Era by era</p><div class="table-wrap"><table><thead><tr><th>Eras</th><th>Role</th></tr></thead><tbody>${Object.entries(cx.era_role).map(([k, v]) => `<tr><td>${esc(titleCase(k.replace("_", " / ")))}</td><td>${escKw(v)}</td></tr>`).join("")}</tbody></table></div>` : ""}
    ${tmpl.anti_patterns ? `<p class="subgroup-label">Common mistakes</p>${listPlain(tmpl.anti_patterns)}` : ""}</div></section>`;
  const html = hero + nav + subnavHtml(sections) + head + historyHtml + profile + ground + world + barb + guide;
  return { html, title: `${l.name} — Leadership Focus`, catKey: l.categoryKey };
}
