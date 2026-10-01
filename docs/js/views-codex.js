// Reference pages: natural wonders, eras, barbarians, city-states, pantheons, terrain, credits.
import { esc, escKw, icon, yieldChips, titleCase, CATEGORY_LABELS, CURVE_ORDER } from "./util.js";
import { heroHtml, rowHtml, leaderCard, wonderCard, terrainCard, linkCard, sectionHead, subnavHtml } from "./components.js";

function creditLine(ctx, id) { const c = ctx.creditsById.get(id); if (!c) return ""; return `<a href="${esc(c.source_url)}" rel="noopener" target="_blank">${esc(c.caption || c.commons_title.replace(/^File:/, ""))}</a> · ${esc(c.licence)}${c.author ? " · " + esc(c.author) : ""}`; }
function pageHero(ctx, { image, credit, kicker, title, sub, actions }) { return heroHtml([{ image, credit: credit ? creditLine(ctx, credit) : "", kicker, title, sub, actions }], { short: true, id: "pageHero" }); }
function leadersFor(ctx, pairs) { return pairs.map(p => { const l = ctx.bySlug.get(p.slug); return l ? leaderCard(l, { grid: true, kicker: p.why }) : ""; }).join(""); }

/* ---------- natural wonders ---------- */
export function renderWonders(ctx) {
  const W = ctx.codex.wonders; const first = W.wonders.find(w => w.image);
  const expansions = [...new Set(W.wonders.map(w => w.expansion))];
  const html = pageHero(ctx, { image: first ? first.image : null, credit: first ? first.imageCredit : null, kicker: `<span class="tag" style="--cat:#A7F3D0">Reference</span><span>${W.wonders.length} natural wonders</span>`, title: "Natural wonders", sub: esc(W.overview) }) +
    `<section class="section"><div class="wrap"><div class="toolbar"><div><span class="field__label">Filter by source</span><div class="chip-row"><button class="chip" type="button" data-exp="" aria-pressed="true">All</button>${expansions.map(e => `<button class="chip" type="button" data-exp="${esc(e)}" aria-pressed="false">${esc(e)}</button>`).join("")}</div></div><div class="toolbar__meta"><span id="wonderCount"></span><label><input type="checkbox" id="passableOnly"> Passable only</label></div></div>
    <div class="grid grid--wide" id="wonderGrid"></div></div></section>`;
  const init = (root) => {
    let exp = "", passable = false; const grid = root.querySelector("#wonderGrid"); const count = root.querySelector("#wonderCount");
    const apply = () => { const list = W.wonders.filter(w => (!exp || w.expansion === exp) && (!passable || w.passable)); grid.innerHTML = list.map(w => wonderCard(w, { grid: true })).join(""); count.textContent = `${list.length} wonders`; root.querySelectorAll("[data-exp]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.exp === exp))); };
    root.querySelectorAll("[data-exp]").forEach(b => b.addEventListener("click", () => { exp = b.dataset.exp; apply(); }));
    root.querySelector("#passableOnly").addEventListener("change", (e) => { passable = e.target.checked; apply(); }); apply();
  };
  return { html, title: "Natural wonders — Leadership Focus", init };
}
export function renderWonder(ctx, slug) {
  const w = ctx.wondersBySlug.get(slug); if (!w) return null; const r = w.real_world;
  const all = ctx.codex.wonders.wonders; const i = all.findIndex(x => x.slug === slug); const prev = all[(i - 1 + all.length) % all.length]; const next = all[(i + 1) % all.length];
  const html = pageHero(ctx, { image: w.image, credit: w.imageCredit, kicker: `<span class="tag" style="--cat:#A7F3D0">Natural wonder</span><span>${esc(w.expansion)}</span>`, title: w.name, sub: esc(w.effect) }) +
    `<div class="detail__nav"><a class="btn btn--sm" href="#/wonders">${icon("chevron-left", "icon icon--sm")} All wonders</a><div class="detail__pager"><a class="btn btn--sm" href="#/wonder/${esc(prev.slug)}">${icon("chevron-left", "icon icon--sm")} ${esc(prev.name)}</a><a class="btn btn--sm" href="#/wonder/${esc(next.slug)}">${esc(next.name)} ${icon("chevron-right", "icon icon--sm")}</a></div></div>
    <section class="section section--tight"><div class="wrap"><dl class="facts">
      <div><dt>Tiles</dt><dd>${esc(w.tiles)} · ${w.passable ? "passable" : "impassable"}</dd></div><div><dt>Spawns on</dt><dd>${esc(w.terrain)}</dd></div>
      <div><dt>Yields</dt><dd>${yieldChips(w.yields) || "none"}</dd></div><div><dt>Real location</dt><dd>${esc(r.location)}<br><small class="muted">${esc(r.country)} · ${r.lat.toFixed(2)}°, ${r.lon.toFixed(2)}°</small></dd></div></dl>
    <div class="two-col" style="margin-top:var(--space-xl)"><div><div class="section__kicker">The place</div><div class="prose"><p>${esc(r.description)}</p></div><a class="btn btn--sm" href="https://www.openstreetmap.org/?mlat=${r.lat}&mlon=${r.lon}#map=8/${r.lat}/${r.lon}" rel="noopener" target="_blank">${icon("map", "icon icon--sm")} Open the map</a></div>
    <div><div class="section__kicker">In the game</div><ul class="list-plain">${w.strategy.map(s => `<li>${escKw(s)}</li>`).join("")}</ul>${w.bonus ? `<p class="muted" style="margin-top:var(--space-md)">${escKw(w.bonus)}</p>` : ""}</div></div>
    ${w.leaders && w.leaders.length ? `<p class="subgroup-label">Leaders who want it</p><div class="grid grid--narrow">${leadersFor(ctx, w.leaders)}</div>` : ""}</div></section>`;
  return { html, title: `${w.name} — Natural wonders` };
}

/* ---------- eras & ages ---------- */
export function renderEras(ctx) {
  const E = ctx.codex.eras; const A = E.ages;
  const eraSections = E.eras.map(e => {
    const peak = ctx.leaders.filter(l => e.curves_at_peak.includes(l.curve)).slice(0, 12);
    const born = ctx.leaders.filter(l => l.era === titleCase(e.slug));
    return `<section class="section" id="era-${esc(e.slug)}" data-era="${esc(titleCase(e.slug))}"><div class="wrap"><div class="section__head"><div><div class="section__kicker">Era ${e.order} of 8 · ${esc(e.years)} · turns ${esc(e.standard_turns)}</div><h2 class="section__title">${esc(e.name)}</h2></div><div class="chip-row">${e.curves_at_peak.map(c => `<span class="chip">${esc(c)} kits peak</span>`).join("")}</div></div>
      <div class="prose"><p>${escKw(e.what_matters)}</p></div>
      <dl class="facts" style="margin-top:var(--space-lg)"><div><dt>Key technologies</dt><dd><small>${e.key_techs.map(esc).join(" · ")}</small></dd></div><div><dt>Key civics</dt><dd><small>${e.key_civics.map(esc).join(" · ")}</small></dd></div><div><dt>Signature units</dt><dd><small>${e.signature_units.map(esc).join(" · ")}</small></dd></div><div><dt>Wonders unlocked</dt><dd><small>${e.wonders.map(esc).join(" · ")}</small></dd></div></dl></div>
      ${rowHtml({ id: `row-peak-${e.slug}`, title: `Loud in the ${e.name} era`, sub: `${e.curves_at_peak.join(" and ")} curves at their peak`, era: titleCase(e.slug), cards: peak.map(l => leaderCard(l, { kicker: `${l.curve} · ${CATEGORY_LABELS[l.categoryKey]}` })), speed: 22 })}
      ${born.length ? rowHtml({ id: `row-born-${e.slug}`, title: `Historical leaders of the ${e.name} era`, sub: `${born.length} on this roster lived then`, era: titleCase(e.slug), cards: born.map(l => leaderCard(l, { kicker: l.history ? l.history.dates.display : "" })), speed: 20 }) : ""}</section>`;
  }).join("");
  const ages = `<section class="section" id="ages"><div class="wrap">${sectionHead("Rise and Fall", "Era Score and the Ages", esc(E.overview))}
    <div class="two-col"><div class="panel"><div class="panel__kicker">Era Score</div><p>${escKw(A.era_score)}</p></div><div class="panel"><div class="panel__kicker">Thresholds</div><p>${escKw(A.thresholds)}</p></div>
    <div class="panel" style="--cat:var(--cat-faith)"><div class="panel__kicker" style="color:var(--cat-faith)">Golden Age</div><p>${escKw(A.golden)}</p></div><div class="panel"><div class="panel__kicker">Heroic Age</div><p>${escKw(A.heroic)}</p></div>
    <div class="panel" style="--cat:var(--destructive)"><div class="panel__kicker" style="color:var(--destructive)">Dark Age</div><p>${escKw(A.dark)}</p></div><div class="panel"><div class="panel__kicker">Loyalty</div><p>${escKw(A.loyalty)}</p></div></div>
    <p class="subgroup-label">Dedications</p><div class="table-wrap"><table><thead><tr><th>Dedication</th><th>Eras</th><th>Normal Age</th><th>Golden Age</th></tr></thead><tbody>${A.dedications.map(d => `<tr><td><b>${esc(d.name)}</b></td><td>${d.eras.map(esc).join(", ")}</td><td>${escKw(d.normal)}</td><td>${escKw(d.golden)}</td></tr>`).join("")}</tbody></table></div></div></section>`;
  const html = pageHero(ctx, { image: E.image, credit: E.imageCredit, kicker: `<span class="tag tag--era" style="--era:var(--era-renaissance)">Reference</span><span>Eight eras, four ages</span>`, title: "World eras and ages", sub: esc(E.overview) }) +
    subnavHtml(E.eras.map(e => ({ id: `era-${e.slug}`, label: e.name })).concat([{ id: "ages", label: "Ages" }])) + eraSections + ages;
  return { html, title: "Eras and ages — Leadership Focus" };
}

/* ---------- barbarians ---------- */
export function renderBarbarians(ctx) {
  const B = ctx.codex.barbarians; const C = B.clans_mode;
  const html = pageHero(ctx, { image: B.image, credit: B.imageCredit, kicker: `<span class="tag" style="--cat:var(--cat-military)">Reference</span><span>Outposts, raids and clans</span>`, title: "Barbarians", sub: esc(B.overview) }) +
    subnavHtml([{ id: "mechanics", label: "How they work" }, { id: "clans", label: "Clans mode" }, { id: "by-curve", label: "By power curve" }, { id: "by-leader", label: "By leader" }]) +
    `<section class="section" id="mechanics" data-category-key="military"><div class="wrap">${sectionHead("Mechanics", "How barbarians work", "")}<div class="grid grid--wide">${B.mechanics.map(m => `<div class="panel panel--cat"><h3 class="panel__title">${esc(m.title)}</h3><p>${escKw(m.text)}</p></div>`).join("")}</div></div></section>
    <section class="section" id="clans" data-category-key="military"><div class="wrap">${sectionHead(C.introduced, C.name, esc(C.overview))}
      <div class="grid">${C.clans.map(c => `<div class="panel"><div class="panel__kicker">${esc(c.spawns)}</div><h3 class="panel__title">${esc(c.name)}</h3><p><b>Units.</b> ${esc(c.units)}</p><p>${escKw(c.notes)}</p></div>`).join("")}</div>
      <p class="subgroup-label">Dealing with a clan</p><div class="table-wrap"><table><thead><tr><th>Action</th><th>Effect</th></tr></thead><tbody>${C.interactions.map(i => `<tr><td><b>${esc(i.action)}</b></td><td>${escKw(i.effect)}</td></tr>`).join("")}</tbody></table></div>
      <div class="panel" style="margin-top:var(--space-lg)"><div class="panel__kicker">Becoming a city-state</div><p>${escKw(C.conversion)}</p></div></div></section>
    <section class="section" id="by-curve" data-category-key="military"><div class="wrap">${sectionHead("Strategy", "By power curve", "")}<div class="grid grid--wide">${CURVE_ORDER.map(c => `<div class="panel panel--cat"><div class="panel__kicker">${esc(c)}</div><p>${escKw(B.strategy_by_curve[c])}</p><a class="btn btn--sm" href="#/leaders?curve=${esc(c)}">${esc(c)} leaders ${icon("arrow", "icon icon--sm")}</a></div>`).join("")}</div></div></section>
    <section class="section" id="by-leader" data-category-key="military"><div class="wrap">${sectionHead("Who profits", "Leaders with a real barbarian interaction", "")}<div class="grid">${B.leader_notes.map(n => { const l = ctx.bySlug.get(n.slug); return l ? `<div data-category-key="${esc(l.categoryKey)}">${leaderCard(l, { grid: true })}<p class="muted" style="font-size:var(--text-sm);margin-top:8px">${escKw(n.note)}</p></div>` : ""; }).join("")}</div></div></section>`;
  return { html, title: "Barbarians — Leadership Focus" };
}

/* ---------- city-states ---------- */
export function renderCityStates(ctx) {
  const S = ctx.codex.cityStates;
  const typeSections = S.types.map(t => `<section class="section" id="type-${esc(t.type.toLowerCase())}" style="--cat:${esc(t.color)}"><div class="wrap"><div class="section__head"><div><div class="section__kicker" style="color:${esc(t.color)}">${t.members.length} city-states</div><h2 class="section__title">${esc(t.type)}</h2></div></div>
    <dl class="facts"><div><dt>1 envoy</dt><dd><small>${esc(t.bonus_1)}</small></dd></div><div><dt>3 envoys</dt><dd><small>${esc(t.bonus_3)}</small></dd></div><div><dt>6 envoys</dt><dd><small>${esc(t.bonus_6)}</small></dd></div></dl>
    <div class="grid grid--wide" style="margin-top:var(--space-lg)">${S.city_states.filter(c => c.type === t.type).map(c => `<div class="panel panel--cat" id="${esc(c.slug)}"><div class="panel__kicker">${esc(c.expansion)}</div><h3 class="panel__title">${esc(c.name)}</h3><p><b>Suzerain.</b> ${escKw(c.suzerain_bonus)}</p><p class="muted" style="font-size:var(--text-sm)">${esc(c.real_world)}</p>${c.best_for && c.best_for.length ? `<div class="chip-row">${c.best_for.map(s => { const l = ctx.bySlug.get(s); return l ? `<a class="chip" href="#/leader/${esc(l.slug)}">${esc(l.name)}</a>` : ""; }).join("")}</div>` : ""}</div>`).join("")}</div></div></section>`).join("");
  const html = pageHero(ctx, { image: S.image, credit: S.imageCredit, kicker: `<span class="tag" style="--cat:var(--cat-gold)">Reference</span><span>${S.city_states.length} city-states, six types</span>`, title: "City-states", sub: esc(S.overview) }) +
    subnavHtml(S.types.map(t => ({ id: `type-${t.type.toLowerCase()}`, label: t.type })).concat([{ id: "envoys", label: "Envoys" }])) +
    `<section class="section section--tight" id="envoys"><div class="wrap"><div class="two-col"><div class="panel"><div class="panel__kicker">Envoys and suzerainty</div><p>${escKw(S.envoy_rules)}</p></div><div class="panel"><div class="panel__kicker">Strategy</div><ul class="list-plain">${S.strategy.map(s => `<li>${escKw(s)}</li>`).join("")}</ul></div></div></div></section>` + typeSections;
  return { html, title: "City-states — Leadership Focus" };
}

/* ---------- pantheons ---------- */
export function renderPantheons(ctx) {
  const P = ctx.codex.pantheons; const cats = [...new Set(P.pantheons.map(p => p.category))];
  const card = (p) => `<div class="panel panel--cat" id="${esc(p.slug)}" data-category-key="faith"><div class="panel__kicker">${esc(p.category)}${p.expansion ? ` · ${esc(p.expansion)}` : ""}</div><h3 class="panel__title">${esc(p.name)}</h3><p>${escKw(p.effect)}</p><p class="muted" style="font-size:var(--text-sm)">${escKw(p.note)}</p>
    <div class="chip-row">${(p.terrain_tags || []).filter(t => t !== "none").map(t => { const tt = ctx.terrainBySlug.get(t); return tt ? `<a class="chip" href="#/terrain/${esc(t)}"><img src="${esc(tt.image)}" alt="" width="20" height="20" style="border-radius:50%">${esc(tt.name)}</a>` : `<span class="chip">${esc(titleCase(t))}</span>`; }).join("")}${(p.best_for || []).map(s => { const l = ctx.bySlug.get(s); return l ? `<a class="chip chip--cat" data-category-key="${esc(l.categoryKey)}" href="#/leader/${esc(l.slug)}"><span class="dot" aria-hidden="true"></span>${esc(l.name)}</a>` : ""; }).join("")}</div></div>`;
  const html = pageHero(ctx, { image: P.image, credit: P.imageCredit, kicker: `<span class="tag" style="--cat:var(--cat-faith)">Reference</span><span>${P.pantheons.length} pantheons</span>`, title: "Pantheons", sub: esc(P.overview) }) +
    `<section class="section"><div class="wrap"><div class="toolbar"><div><span class="field__label">Filter by kind</span><div class="chip-row"><button class="chip" type="button" data-cat="" aria-pressed="true">All</button>${cats.map(c => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="false">${esc(titleCase(c))}</button>`).join("")}</div></div></div><div class="grid grid--wide" id="pantheonGrid">${P.pantheons.map(card).join("")}</div></div></section>`;
  const init = (root) => { root.querySelectorAll("[data-cat]").forEach(b => b.addEventListener("click", () => { const c = b.dataset.cat; root.querySelectorAll("[data-cat]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); root.querySelectorAll("#pantheonGrid > .panel").forEach(el => { const p = P.pantheons.find(x => x.slug === el.id); el.hidden = !!c && p.category !== c; }); })); };
  return { html, title: "Pantheons — Leadership Focus", init };
}

/* ---------- terrain ---------- */
export function renderTerrain(ctx) {
  const T = ctx.codex.terrain; const first = T.terrain[0];
  const html = pageHero(ctx, { image: first.image, kicker: `<span class="tag" style="--cat:var(--cat-production)">Reference</span><span>${T.terrain.length} terrain types and features</span>`, title: "Terrain", sub: esc(T.overview) }) +
    `<section class="section"><div class="wrap">${sectionHead("Base terrain", "Terrain", "")}<div class="grid grid--narrow">${T.terrain.filter(t => t.kind === "terrain").map(t => terrainCard(t, { grid: true })).join("")}</div>
    ${sectionHead("Features", "Features", "")}<div class="grid grid--narrow">${T.terrain.filter(t => t.kind === "feature").map(t => terrainCard(t, { grid: true })).join("")}</div>
    <p class="subgroup-label">Glossary</p><div class="grid grid--wide">${T.glossary.map(g => `<div class="panel"><h3 class="panel__title">${esc(g.term)}</h3><p>${escKw(g.text)}</p></div>`).join("")}</div>
    <p class="muted" style="margin-top:var(--space-lg);font-size:var(--text-sm)">${esc(ctx.codex.terrainTiles.note)}</p></div></section>`;
  return { html, title: "Terrain — Leadership Focus" };
}
export function renderTerrainDetail(ctx, slug) {
  const t = ctx.terrainBySlug.get(slug); if (!t) return null; const T = ctx.codex.terrain.terrain;
  const i = T.findIndex(x => x.slug === slug); const prev = T[(i - 1 + T.length) % T.length]; const next = T[(i + 1) % T.length];
  const leaders = ctx.leaders.filter(l => l.affinity && (l.affinity.startBias.some(b => b.terrain === slug) || l.affinity.terrain.some(b => b.terrain === slug)));
  const pantheons = ctx.codex.pantheons.pantheons.filter(p => (p.terrain_tags || []).includes(slug));
  const html = `<section class="hero hero--short"><div class="hero__media"><div class="hero__slide is-active hero__slide--fallback"><img src="${esc(t.image)}" alt="" style="object-fit:contain;filter:blur(40px);opacity:.5;transform:scale(1.6)"></div></div><div class="hero__scrim"></div><div class="hero__content"><div class="hero__inner" style="display:grid;grid-template-columns:auto 1fr;gap:var(--space-lg);align-items:center"><img src="${esc(t.image)}" alt="${esc(t.name)} tile" width="220" height="220" style="width:clamp(120px,22vw,220px);height:auto;border-radius:var(--radius)"><div><div class="hero__kicker"><span class="tag" style="--cat:var(--cat-production)">${esc(t.kind)}</span><span>${esc(t.expansion)}</span></div><h1 class="hero__title hero__title--page">${esc(t.name)}</h1><div class="hero__meta">${yieldChips(t.yields) || '<span class="yield">No base yield</span>'}</div></div></div></div></section>
    <div class="detail__nav"><a class="btn btn--sm" href="#/terrain">${icon("chevron-left", "icon icon--sm")} All terrain</a><div class="detail__pager"><a class="btn btn--sm" href="#/terrain/${esc(prev.slug)}">${icon("chevron-left", "icon icon--sm")} ${esc(prev.name)}</a><a class="btn btn--sm" href="#/terrain/${esc(next.slug)}">${esc(next.name)} ${icon("chevron-right", "icon icon--sm")}</a></div></div>
    <section class="section section--tight"><div class="wrap"><dl class="facts"><div><dt>Movement cost</dt><dd>${esc(t.movement_cost)}</dd></div><div><dt>Defence</dt><dd>${t.defense ? (t.defense > 0 ? "+" : "") + esc(t.defense) + " Combat Strength" : "none"}</dd></div><div><dt>Appeal</dt><dd>${esc(t.appeal)}</dd></div><div><dt>Districts</dt><dd>${t.districts ? "can be built here" : "cannot be built here"}</dd></div></dl>
    <div class="prose" style="margin-top:var(--space-lg)"><p>${escKw(t.notes)}</p></div>
    ${pantheons.length ? `<p class="subgroup-label">Pantheons that use it</p><div class="chip-row">${pantheons.map(p => `<a class="chip" href="#/pantheons#${esc(p.slug)}">${esc(p.name)}</a>`).join("")}</div>` : ""}
    ${leaders.length ? `<p class="subgroup-label">Leaders whose kit wants it</p><div class="grid grid--narrow">${leaders.map(l => { const why = (l.affinity.terrain.find(b => b.terrain === slug) || {}).why || (l.affinity.startBias.some(b => b.terrain === slug) ? "Start bias" : ""); return leaderCard(l, { grid: true, kicker: why ? why.slice(0, 48) : "" }); }).join("")}</div>` : ""}</div></section>`;
  return { html, title: `${t.name} — Terrain` };
}

/* ---------- credits ---------- */
export function renderCredits(ctx) {
  const C = ctx.codex.credits;
  const html = `<section class="section"><div class="wrap"><h1 class="sr-only">Image credits</h1>${sectionHead("Attribution", "Image credits", "Historical imagery is from Wikimedia Commons under the licence shown beside each file. The 54 leader portraits and the badge art belong to this project. The 24 terrain tiles were generated for this site with Higgsfield (FLUX.2) and are not Firaxis assets.")}
    <ul class="credits">${C.map(c => `<li><img src="${esc(c.file)}" alt="" loading="lazy"><div><b>${esc(c.caption || c.commons_title)}</b><br><a href="${esc(c.source_url)}" rel="noopener" target="_blank">${esc(c.commons_title)}</a><br><small class="muted">${esc(c.licence)}${c.licence_url ? ` (<a href="${esc(c.licence_url)}" rel="noopener" target="_blank">licence</a>)` : ""}${c.author ? " · " + esc(c.author) : ""}</small></div></li>`).join("")}</ul></div></section>`;
  return { html, title: "Credits — Leadership Focus" };
}
