// Reusable pieces: hero carousel, auto-scrolling rows, cards, charts, subnav.
import { esc, escKw, icon, reducedMotion, CATEGORY_LABELS, CURVE_INFO, titleCase } from "./util.js";

/* ---------- hero carousel (design-system Carousel / Auto-Rotation pattern) ---------- */
export function heroHtml(slides, { short = false, id = "hero" } = {}) {
  const media = slides.map((s, i) => {
    const inner = s.image
      ? `<img src="${esc(s.image)}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} width="1280" height="720">`
      : "";
    return `<div class="hero__slide${s.image ? "" : " hero__slide--fallback"}${i === 0 ? " is-active" : ""}" data-category-key="${esc(s.catKey || "")}">${inner}</div>`;
  }).join("");
  const content = slides.map((s, i) => `
    <div class="hero__inner hero__panel" data-i="${i}" ${i === 0 ? "" : "hidden"} data-category-key="${esc(s.catKey || "")}" data-era="${esc(s.era || "")}">
      ${s.kicker ? `<div class="hero__kicker">${s.kicker}</div>` : ""}
      <h1 class="hero__title${short ? " hero__title--page" : ""}">${esc(s.title)}</h1>
      ${s.sub ? `<p class="hero__sub">${s.sub}</p>` : ""}
      ${s.meta && s.meta.length ? `<div class="hero__meta">${s.meta.join("")}</div>` : ""}
      ${s.actions && s.actions.length ? `<div class="hero__actions">${s.actions.map(a => `<a class="btn ${a.primary ? "btn--primary" : ""} btn--lg" href="${esc(a.href)}">${esc(a.label)}</a>`).join("")}</div>` : ""}
    </div>`).join("");
  const controls = slides.length > 1 ? `
    <div class="hero__controls" role="group" aria-label="Featured carousel controls">
      <button class="row__btn" type="button" data-hero="prev" aria-label="Previous feature">${icon("chevron-left")}</button>
      <button class="row__btn" type="button" data-hero="toggle" aria-label="Pause rotation" aria-pressed="false">${icon("pause")}</button>
      <button class="row__btn" type="button" data-hero="next" aria-label="Next feature">${icon("chevron-right")}</button>
      <div class="hero__dots">${slides.map((s, i) => `<button class="hero__dot" type="button" data-hero="go" data-i="${i}" aria-label="Show ${esc(s.title)}" ${i === 0 ? 'aria-current="true"' : ""}></button>`).join("")}</div>
    </div>` : "";
  const credits = slides.map((s, i) => s.credit ? `<span class="hero__credit" data-i="${i}" ${i === 0 ? "" : "hidden"}>${s.credit}</span>` : "").join("");
  return `<section class="hero${short ? " hero--short" : ""}" id="${esc(id)}" aria-roledescription="carousel" aria-label="Featured">
    <div class="hero__media">${media}</div><div class="hero__scrim"></div>
    <div class="hero__content"><div class="hero__stage">${content}</div>${controls}</div>${credits}</section>`;
}

export function initHero(root, { interval = 8000 } = {}) {
  const slides = root.querySelectorAll(".hero__slide");
  if (slides.length < 2) return () => {};
  const panels = root.querySelectorAll(".hero__panel");
  const credits = root.querySelectorAll(".hero__credit");
  const dots = root.querySelectorAll(".hero__dot");
  const toggle = root.querySelector('[data-hero="toggle"]');
  let active = 0, timer, onscreen = true, wantPlaying = !reducedMotion.matches;
  const stage = root.querySelector(".hero__stage");
  const show = (i) => {
    const target = (i + slides.length) % slides.length;
    if (target === active || reducedMotion.matches || !stage) { apply(target); return; }
    stage.classList.add("is-fading");
    setTimeout(() => { apply(target); stage.classList.remove("is-fading"); }, 180);
  };
  const apply = (i) => {
    active = i;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === active));
    panels.forEach((p, k) => { p.hidden = k !== active; });
    credits.forEach(c => { c.hidden = Number(c.dataset.i) !== active; });
    dots.forEach((d, k) => { if (k === active) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
  };
  const stop = () => { clearInterval(timer); timer = undefined; };
  const start = () => { stop(); if (wantPlaying && !reducedMotion.matches && !document.hidden && onscreen) timer = setInterval(() => show(active + 1), interval); };
  const sync = () => (reducedMotion.matches ? (stop(), show(active)) : start());
  const setToggle = () => { if (!toggle) return; toggle.setAttribute("aria-pressed", String(!wantPlaying)); toggle.setAttribute("aria-label", wantPlaying ? "Pause rotation" : "Resume rotation"); toggle.innerHTML = icon(wantPlaying ? "pause" : "play"); };
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-hero]"); if (!b) return;
    const a = b.dataset.hero;
    if (a === "prev") { show(active - 1); start(); }
    else if (a === "next") { show(active + 1); start(); }
    else if (a === "go") { show(Number(b.dataset.i)); start(); }
    else if (a === "toggle") { wantPlaying = !wantPlaying; setToggle(); sync(); }
  });
  root.addEventListener("pointerenter", stop);
  root.addEventListener("pointerleave", sync);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) sync(); });
  const onVis = () => (document.hidden ? stop() : sync());
  document.addEventListener("visibilitychange", onVis);
  const io = new IntersectionObserver(([en]) => { onscreen = en.isIntersecting; onscreen ? sync() : stop(); });
  io.observe(root);
  reducedMotion.addEventListener("change", sync);
  setToggle(); sync();
  return () => { stop(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); reducedMotion.removeEventListener("change", sync); };
}

/* ---------- rows ---------- */
const ROW_BUDGET = 2; // at most two rows move at once (excessive-motion)
const ROWS = new Set();
function reconcile() {
  const wanting = Array.from(ROWS).filter(r => r.wants());
  wanting.sort((a, b) => b.ratio - a.ratio);
  wanting.forEach((r, i) => (i < ROW_BUDGET && r.ratio > 0 ? r.start() : r.halt()));
  Array.from(ROWS).filter(r => !r.wants()).forEach(r => r.halt());
}
export function rowHtml({ id, title, sub, href, cards, catKey, era, autoplay = true, speed = 26 }) {
  if (!cards.length) return "";
  const t = href ? `<a href="${esc(href)}">${esc(title)}</a>` : esc(title);
  return `<section class="row" id="${esc(id)}" data-autoplay="${autoplay ? "1" : "0"}" data-speed="${speed}" ${catKey ? `data-category-key="${esc(catKey)}"` : ""} ${era ? `data-era="${esc(era)}"` : ""} aria-roledescription="carousel" aria-label="${esc(title)}">
    <div class="row__head">
      <h2 class="row__title"><span class="dot" aria-hidden="true"></span><span>${t}${sub ? `<span class="row__sub">${esc(sub)}</span>` : ""}</span></h2>
      <div class="row__controls" role="group" aria-label="${esc(title)} controls">
        <button class="row__btn" type="button" data-row="prev" aria-label="Scroll ${esc(title)} left">${icon("chevron-left")}</button>
        ${autoplay ? `<button class="row__btn" type="button" data-row="toggle" aria-label="Pause ${esc(title)} rotation" aria-pressed="false">${icon("pause")}</button>` : ""}
        <button class="row__btn" type="button" data-row="next" aria-label="Scroll ${esc(title)} right">${icon("chevron-right")}</button>
      </div>
    </div>
    <div class="row__scroller" tabindex="0">${cards.join("")}</div>
  </section>`;
}

export function initRows(root) {
  const cleanups = [];
  root.querySelectorAll(".row").forEach((row) => {
    const scroller = row.querySelector(".row__scroller");
    const autoplay = row.dataset.autoplay === "1";
    const speed = Number(row.dataset.speed || 26); // px per second
    const toggle = row.querySelector('[data-row="toggle"]');
    let playing = autoplay && !reducedMotion.matches, raf, last, onscreen = true, hover = false, focus = false, half = 0, userScroll = false, idleTimer;
    // scrollLeft is clamped to whole pixels. At 26 px/s a frame is ~0.4 px, which rounds back to the
    // current value and the row never moves. So the loop advances a fractional position of its own and
    // writes a whole pixel whenever it has crossed one. `written` is the last value it wrote; if the
    // scroller is somewhere else (user, snap, button) the position is re-read from it first.
    let pos = 0, written = -1;
    const originals = Array.from(scroller.children);
    const cardStep = () => (originals[0] ? originals[0].getBoundingClientRect().width + 16 : 240);
    const needsLoop = () => scroller.scrollWidth > scroller.clientWidth + 40;
    const ensureClones = () => {
      if (!autoplay || scroller.dataset.cloned || !needsLoop()) return;
      originals.forEach((c) => { const d = c.cloneNode(true); d.setAttribute("aria-hidden", "true"); d.querySelectorAll("a,button").forEach(x => x.setAttribute("tabindex", "-1")); d.dataset.dup = "1"; scroller.appendChild(d); });
      scroller.dataset.cloned = "1";
      half = scroller.scrollWidth / 2;
    };
    const wrap = () => {
      if (!half) return;
      if (scroller.scrollLeft >= half) { scroller.scrollLeft -= half; pos -= half; written = scroller.scrollLeft; }
      else if (scroller.scrollLeft < 0) { scroller.scrollLeft += half; pos += half; written = scroller.scrollLeft; }
    };
    const tick = (ts) => {
      if (!playing || hover || focus || userScroll || document.hidden || !onscreen || reducedMotion.matches) { raf = undefined; last = undefined; return; }
      if (last !== undefined) {
        if (scroller.scrollLeft !== written) pos = scroller.scrollLeft;
        pos += (speed * (ts - last)) / 1000;
        const next = Math.round(pos);
        if (next !== scroller.scrollLeft) { scroller.scrollLeft = next; written = scroller.scrollLeft; }
        wrap();
      }
      last = ts; raf = requestAnimationFrame(tick);
    };
    const start = () => {
      ensureClones();
      if (!raf && half) { pos = scroller.scrollLeft; written = pos; raf = requestAnimationFrame(tick); }
      row.classList.toggle("row--playing", playing && !reducedMotion.matches);
    };
    const halt = () => { if (raf) cancelAnimationFrame(raf); raf = undefined; last = undefined; row.classList.remove("row--playing"); };
    const entry = { ratio: 0, wants: () => autoplay && playing && !hover && !focus && !userScroll && onscreen && !document.hidden && !reducedMotion.matches, start, halt };
    ROWS.add(entry);
    const run = () => reconcile();
    const onUserScroll = () => { userScroll = true; halt(); clearTimeout(idleTimer); idleTimer = setTimeout(() => { userScroll = false; run(); }, 1500); };
    scroller.addEventListener("wheel", onUserScroll, { passive: true });
    scroller.addEventListener("touchstart", onUserScroll, { passive: true });
    scroller.addEventListener("pointerdown", onUserScroll, { passive: true });
    // Scroll snap stays off for as long as the row is meant to rotate, not just while a frame is running:
    // a hover, offscreen or hidden-tab pause must not hand the row back to snap, or it lurches to the nearest card.
    const setAuto = () => row.classList.toggle("row--auto", autoplay && playing && !reducedMotion.matches);
    const setToggle = () => { setAuto(); if (!toggle) return; toggle.setAttribute("aria-pressed", String(!playing)); toggle.innerHTML = icon(playing ? "pause" : "play"); toggle.setAttribute("aria-label", (playing ? "Pause " : "Resume ") + row.getAttribute("aria-label") + " rotation"); };
    row.addEventListener("click", (e) => {
      const b = e.target.closest("[data-row]"); if (!b) return;
      const step = cardStep() * 2;
      if (b.dataset.row === "prev") scroller.scrollBy({ left: -step, behavior: reducedMotion.matches ? "auto" : "smooth" });
      if (b.dataset.row === "next") scroller.scrollBy({ left: step, behavior: reducedMotion.matches ? "auto" : "smooth" });
      if (b.dataset.row === "toggle") { playing = !playing; setToggle(); playing ? run() : halt(); }
    });
    scroller.addEventListener("scroll", () => { if (half) wrap(); }, { passive: true });
    row.addEventListener("pointerenter", () => { hover = true; });
    row.addEventListener("pointerleave", () => { hover = false; run(); });
    row.addEventListener("focusin", () => { focus = true; });
    row.addEventListener("focusout", (e) => { if (!row.contains(e.relatedTarget)) { focus = false; run(); } });
    const onVis = () => (document.hidden ? halt() : run());
    document.addEventListener("visibilitychange", onVis);
    const io = new IntersectionObserver(([en]) => { onscreen = en.isIntersecting; entry.ratio = en.intersectionRatio; run(); }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    io.observe(row);
    const onRM = () => { if (reducedMotion.matches) { playing = false; halt(); } setToggle(); };
    reducedMotion.addEventListener("change", onRM);
    setToggle(); if (autoplay) requestAnimationFrame(run);
    cleanups.push(() => { halt(); ROWS.delete(entry); clearTimeout(idleTimer); io.disconnect(); document.removeEventListener("visibilitychange", onVis); reducedMotion.removeEventListener("change", onRM); });
  });
  return () => cleanups.forEach(f => f());
}

/* ---------- cards ---------- */
export function leaderCard(l, { rank, grid = false, kicker } = {}) {
  const k = kicker != null ? kicker : `${CATEGORY_LABELS[l.categoryKey]} · ${l.curve}`;
  return `<a class="card${grid ? " card--grid" : ""}" href="#/leader/${esc(l.slug)}" data-category-key="${esc(l.categoryKey)}" data-era="${esc(l.era || "")}" aria-label="${esc(l.name)}, ${esc(l.civilization)}">
    <div class="card__media"><img src="${esc(l.image)}" alt="" loading="lazy" width="480" height="480">
      ${rank ? `<span class="card__rank" aria-hidden="true">${rank}</span>` : ""}
      <span class="card__roundel" aria-hidden="true"><img src="${esc(l.categoryBadge)}" alt="" loading="lazy" width="36" height="36"></span></div>
    <div class="card__body"><div class="card__kicker">${esc(k)}</div><h3 class="card__name">${esc(l.name)}</h3><p class="card__sub">${esc(l.civilization)}${l.era ? ` · ${esc(l.era)}` : ""}</p></div></a>`;
}
export function linkCard({ href, image, kicker, title, sub, wide = false, square = false, grid = false, catKey, era, tags = [] }) {
  return `<a class="card${wide ? " card--wide" : ""}${square ? " card--square" : ""}${grid ? " card--grid" : ""}" href="${esc(href)}" ${catKey ? `data-category-key="${esc(catKey)}"` : ""} ${era ? `data-era="${esc(era)}"` : ""}>
    <div class="card__media">${image ? `<img src="${esc(image)}" alt="" loading="lazy">` : ""}</div>
    <div class="card__body">${kicker ? `<div class="card__kicker">${esc(kicker)}</div>` : ""}<h3 class="card__name">${esc(title)}</h3>${sub ? `<p class="card__sub">${esc(sub)}</p>` : ""}${tags.length ? `<div class="card__tags">${tags.map(t => `<span class="tag tag--outline">${esc(t)}</span>`).join("")}</div>` : ""}</div></a>`;
}
export function wonderCard(w, opts = {}) {
  return linkCard({ href: `#/wonder/${w.slug}`, image: w.image, kicker: `${w.tiles} tile${w.tiles > 1 ? "s" : ""} · ${w.passable ? "passable" : "impassable"}`, title: w.name, sub: w.real_world.country, wide: true, ...opts });
}
export function terrainCard(t, opts = {}) {
  const y = t.yields || {}; const ys = ["food", "production", "gold", "science", "culture", "faith"].filter(k => y[k]).map(k => `+${y[k]} ${titleCase(k)}`).join(", ");
  return linkCard({ href: `#/terrain/${t.slug}`, image: t.image, kicker: t.kind, title: t.name, sub: ys || "No base yield", square: true, ...opts });
}
export function cityStateCard(cs, type, opts = {}) {
  return `<a class="card card--wide${opts.grid ? " card--grid" : ""}" href="#/city-states#${esc(cs.slug)}" style="--cat:${esc(type.color)}">
    <div class="card__media" style="background:linear-gradient(160deg, color-mix(in srgb, ${esc(type.color)} 35%, #000), #000)"></div>
    <div class="card__body"><div class="card__kicker">${esc(cs.type)}</div><h3 class="card__name">${esc(cs.name)}</h3><p class="card__sub" title="${esc(cs.suzerain_bonus)}">${esc(cs.suzerain_bonus)}</p></div></a>`;
}
export function pantheonCard(p, opts = {}) {
  return `<a class="card card--wide${opts.grid ? " card--grid" : ""}" href="#/pantheons#${esc(p.slug)}" data-category-key="faith">
    <div class="card__media" style="background:linear-gradient(160deg, color-mix(in srgb, var(--cat-faith) 22%, #000), #000)"></div>
    <div class="card__body"><div class="card__kicker">${esc(p.category)}</div><h3 class="card__name">${esc(p.name)}</h3><p class="card__sub">${esc(p.effect)}</p></div></a>`;
}

/* ---------- small blocks ---------- */
export function statBlock(src, label, caption) {
  return `<span class="stat"><span class="stat__roundel"><img src="${esc(src)}" alt="" width="48" height="48"></span><span><span class="stat__value">${esc(label)}</span><span class="stat__caption">${esc(caption)}</span></span></span>`;
}
export function sectionHead(kicker, title, lede) {
  return `<div class="section__head"><div>${kicker ? `<div class="section__kicker">${esc(kicker)}</div>` : ""}<h2 class="section__title">${esc(title)}</h2></div></div>${lede ? `<p class="section__lede">${lede}</p>` : ""}`;
}
export function subnavHtml(items) {
  return `<nav class="subnav" aria-label="On this page"><div class="subnav__inner">${items.map(i => `<a class="subnav__link" href="#${esc(i.id)}" data-target="${esc(i.id)}">${esc(i.label)}</a>`).join("")}</div></nav>`;
}
export function initSubnav(root) {
  // Only the anchor subnav (links with data-target). The leader page's tab bar reuses the same classes
  // but its links are real routes and must not be intercepted here.
  const links = root.querySelectorAll(".subnav__link[data-target]");
  if (!links.length) return () => {};
  const targets = Array.from(links).map(l => document.getElementById(l.dataset.target)).filter(Boolean);
  links.forEach(l => l.addEventListener("click", (e) => { e.preventDefault(); const t = document.getElementById(l.dataset.target); if (t) { t.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" }); t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); } }));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) links.forEach(l => l.classList.toggle("is-active", l.dataset.target === en.target.id)); });
  }, { rootMargin: "-30% 0px -60% 0px" });
  targets.forEach(t => io.observe(t));
  return () => io.disconnect();
}

/* ---------- tabs (leader page): real links, so the router drives them; arrows move focus, Enter/Space activate ---------- */
export function tabsHtml(items, { active, label, panelId }) {
  return `<nav class="subnav subnav--tabs" aria-label="${esc(label)}"><div class="subnav__inner" role="tablist" aria-label="${esc(label)}">${items.map(i => {
    const on = i.id === active;
    return `<a class="subnav__link${on ? " is-active" : ""}" role="tab" id="tab-${esc(i.id)}" href="${esc(i.href)}" aria-selected="${on}" aria-controls="${esc(panelId)}" tabindex="${on ? 0 : -1}" data-tab="${esc(i.id)}">${esc(i.label)}</a>`;
  }).join("")}</div></nav>`;
}
export function initTabs(tablist) {
  if (!tablist) return () => {};
  const onKey = (e) => {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]')); const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    let j = null;
    if (e.key === "ArrowRight") j = (i + 1) % tabs.length; else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") j = 0; else if (e.key === "End") j = tabs.length - 1;
    else if (e.key === " ") { e.preventDefault(); tabs[i].click(); return; }
    if (j === null) return;
    e.preventDefault(); // the global prev/next-leader shortcut yields to a defaultPrevented arrow key
    tabs[j].focus(); tabs[j].scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  tablist.addEventListener("keydown", onKey);
  return () => tablist.removeEventListener("keydown", onKey);
}
export function setActiveTab(tablist, id) {
  if (!tablist) return;
  tablist.querySelectorAll('[role="tab"]').forEach(t => { const on = t.dataset.tab === id; t.setAttribute("aria-selected", String(on)); t.setAttribute("tabindex", on ? "0" : "-1"); t.classList.toggle("is-active", on); if (on) { const left = t.offsetLeft - 24; if (Math.abs(tablist.scrollLeft - left) > 4) tablist.scrollLeft = Math.max(0, left); } });
}

/* ---------- guide blocks shared by the Shape tab and the Plan tab ---------- */
export function checklist(items) { return `<ul class="checklist">${items.map(s => `<li>${escKw(s)}</li>`).join("")}</ul>`; }
export function listPlain(items) { return `<ul class="list-plain">${items.map(s => `<li>${escKw(s)}</li>`).join("")}</ul>`; }
export function loopBox(label, items) { return `<div class="subblock"><p class="subblock__label">${esc(label)}</p><div class="loop-box"><ul>${items.map(s => `<li>${escKw(s)}</li>`).join("")}</ul></div></div>`; }
export function checkpointsHtml(cps) { return `<div class="subblock"><p class="subblock__label">Checkpoints</p><div class="checkpoint-grid">${cps.map(cp => `<div class="checkpoint"><p class="checkpoint__at">Checkpoint · ${esc(cp.at)}</p><p class="checkpoint__test">${escKw(cp.test)}</p><div class="checkpoint__branches">${cp.if_yes ? `<div class="checkpoint__branch"><b>Yes</b><span>${escKw(cp.if_yes)}</span></div>` : ""}${cp.if_no ? `<div class="checkpoint__branch"><b>No</b><span>${escKw(cp.if_no)}</span></div>` : ""}</div></div>`).join("")}</div></div>`; }
export function phaseHtml(p, i) {
  let inner = `<div class="phase__header"><h3 class="phase__title">${esc(p.phase)}</h3>${p.turns ? `<span class="phase__turns">Turns ${esc(p.turns)}</span>` : ""}</div>`;
  if (p.goal) inner += `<p class="phase__goal">${escKw(p.goal)}</p>`;
  if (p.opening_statement) inner += `<div class="note-callout">${escKw(p.opening_statement)}</div>`;
  if (p.steps) inner += checklist(p.steps); if (p.tests) inner += checklist(p.tests);
  if (p.staging_checklist) inner += loopBox("Staging checklist", p.staging_checklist);
  if (p.core_loop) inner += loopBox("Core loop", p.core_loop); if (p.per_turn_check) inner += loopBox("Per-turn check", p.per_turn_check);
  if (p.opportunity_trigger) inner += `<div class="note-callout">${escKw(p.opportunity_trigger)}</div>`;
  if (p.checkpoints) inner += checkpointsHtml(p.checkpoints);
  return `<div class="phase"><div class="phase__node" aria-hidden="true">${i + 1}</div><div class="phase__card">${inner}</div></div>`;
}

/* ---------- power curve chart (SVG area chart, Line/Smooth Area per catalog) ---------- */
const CURVE_PATHS = {
  Spike: "M12,102 C30,96 44,26 66,20 C92,13 124,48 164,72 C206,96 250,104 292,106",
  Ramp: "M12,104 C48,100 84,80 128,48 C158,26 186,19 210,26 C242,36 268,60 292,80",
  Bloom: "M12,103 C62,102 112,99 152,92 C196,84 234,56 258,32 C270,21 282,17 292,15",
  Flat: "M12,94 C70,85 130,73 190,60 C230,51 262,44 292,38",
};
// Where each curve peaks: x,y on the path and the fraction of the path length at that point (measured once with getPointAtLength).
const CURVE_PEAK = { Spike: { x: 66, y: 20, f: 0.2885 }, Ramp: { x: 205, y: 24.8, f: 0.672 }, Bloom: { x: 285, y: 16.7, f: 0.976 }, Flat: { x: 240, y: 48.9, f: 0.814 } };
let chartSeq = 0;
export function curveChart(curve) {
  const path = CURVE_PATHS[curve]; if (!path) return "";
  const id = "cc" + (++chartSeq); const peak = CURVE_PEAK[curve]; const peakX = peak.x;
  const eras = ["Ancient", "Medieval", "Industrial", "Endgame"];
  let grid = "";
  for (let i = 1; i <= 3; i++) { const x = 12 + (280 / 4) * i; grid += `<line class="cc-grid" x1="${x}" y1="14" x2="${x}" y2="108"/>`; }
  [38, 62, 86].forEach(y => { grid += `<line class="cc-grid" x1="12" y1="${y}" x2="292" y2="${y}"/>`; });
  const ticks = eras.map((e, i) => { const x = 12 + (280 / 3) * i; const a = i === 0 ? "start" : i === 3 ? "end" : "middle"; return `<text class="cc-tick" x="${x}" y="119" text-anchor="${a}">${e}</text>`; }).join("");
  // keyPoints stops the dot at the peak instead of the end of the path; calcMode must be linear for keyPoints to apply.
  const motion = reducedMotion.matches ? "" : `<animateMotion dur="1.5s" fill="freeze" begin="0s" calcMode="linear" keyPoints="0;${peak.f}" keyTimes="0;1"><mpath href="#${id}"/></animateMotion>`;
  return `<svg class="curve-chart" viewBox="0 0 304 126" role="img" aria-label="${esc(curve)} power curve: ${esc(CURVE_INFO[curve])}">
    <rect class="cc-frame" x="12" y="14" width="280" height="94"/>${grid}
    <path class="cc-area" d="${path} L292,108 L12,108 Z"/><line class="cc-peak-line" x1="${peakX}" y1="14" x2="${peakX}" y2="108"/>
    <text class="cc-peak-text" x="${peakX + (curve === "Bloom" ? -4 : 4)}" y="24" text-anchor="${curve === "Bloom" ? "end" : "start"}">${curve === "Flat" ? "Steady" : "Peak"}</text>
    <path class="cc-line" id="${id}" d="${path}"/><line class="cc-axis" x1="12" y1="108" x2="292" y2="108"/><line class="cc-axis" x1="12" y1="14" x2="12" y2="108"/>
    <text class="cc-axis-label" x="12" y="9">Power</text>${ticks}<circle class="cc-dot" r="4" ${reducedMotion.matches ? `cx="${peak.x}" cy="${peak.y}"` : ""}>${motion}</circle></svg>`;
}
export function curvePanel(curve, catKey) {
  return `<div class="curve-panel" data-category-key="${esc(catKey)}"><div><p class="curve-panel__label">Power curve</p><p class="curve-panel__name">${esc(curve)}</p><p class="curve-panel__desc">${esc(CURVE_INFO[curve] || "")}</p></div>${curveChart(curve)}</div>`;
}
export { escKw };
