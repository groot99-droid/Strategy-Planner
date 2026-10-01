// Entry point: loads the data, routes on the hash, renders a view and wires its behaviour.
import { esc } from "./util.js";
import { initHero, initRows, initSubnav } from "./components.js";
import { renderLanding, renderLeaders, renderLeader } from "./views-leaders.js";
import { renderWonders, renderWonder, renderEras, renderBarbarians, renderCityStates, renderPantheons, renderTerrain, renderTerrainDetail, renderCredits } from "./views-codex.js";
import { renderQuiz } from "./quiz.js";
import { initSearch } from "./search.js";

const app = document.getElementById("app");
const nav = document.getElementById("siteNav"); const navToggle = document.getElementById("navToggle");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let ctx = null; let cleanups = []; let current = null; // current: the mounted view, so a same-key route can swap a panel instead of remounting
if (navToggle) {
  navToggle.addEventListener("click", () => { const open = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", open); navToggle.setAttribute("aria-expanded", String(open)); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { nav.classList.remove("is-open"); navToggle.setAttribute("aria-expanded", "false"); navToggle.focus(); } });
}
function closeNav() { if (nav) { nav.classList.remove("is-open"); } if (navToggle) navToggle.setAttribute("aria-expanded", "false"); }

async function loadData() {
  const [leaders, codex] = await Promise.all([fetch("data/leaders.json").then(r => { if (!r.ok) throw new Error("leaders.json " + r.status); return r.json(); }), fetch("data/codex.json").then(r => { if (!r.ok) throw new Error("codex.json " + r.status); return r.json(); })]);
  leaders.sort((a, b) => a.name.localeCompare(b.name));
  const eurekas = codex.eurekas || { techs: [], civics: [] };
  ctx = { leaders, codex, bySlug: new Map(leaders.map(l => [l.slug, l])), wondersBySlug: new Map(codex.wonders.wonders.map(w => [w.slug, w])), terrainBySlug: new Map(codex.terrain.terrain.map(t => [t.slug, t])), pantheonsBySlug: new Map(codex.pantheons.pantheons.map(p => [p.slug, p])), creditsById: new Map(codex.credits.map(c => [c.id, c])),
    cityStatesBySlug: new Map(codex.cityStates.city_states.map(c => [c.slug, c])),
    boostsById: new Map([...eurekas.techs.map(t => ["tech:" + t.id, { kind: "tech", trigger: t.eureka, ...t }]), ...eurekas.civics.map(c => ["civic:" + c.id, { kind: "civic", trigger: c.inspiration, ...c }])]),
    plansMeta: codex.plansMeta || null, plans: new Map() };
  const r = codex.roster; const f = document.getElementById("footerRoster");
  if (f) f.textContent = `${r.count} leaders · ${codex.wonders.wonders.length} natural wonders · ${codex.cityStates.city_states.length} city-states · ${codex.pantheons.pantheons.length} pantheons · ${codex.terrain.terrain.length} terrain types · data built ${r.generated}.`;
}

function parseRoute() {
  const raw = location.hash.replace(/^#/, "");
  const [pathPart, queryPart] = raw.split("?");
  const parts = pathPart.split("/").filter(Boolean);
  const query = new URLSearchParams(queryPart || "");
  // "#/pantheons#god-of-the-sea" style anchors arrive as a second hash inside the path
  const anchorIdx = pathPart.indexOf("#"); let anchor = null; let cleanParts = parts;
  if (anchorIdx >= 0) { anchor = pathPart.slice(anchorIdx + 1); cleanParts = pathPart.slice(0, anchorIdx).split("/").filter(Boolean); }
  return { parts: cleanParts, query, anchor };
}

function route() {
  const { parts, query, anchor } = parseRoute();
  const [head, arg, sub] = parts;
  const nav = head === "leader" ? "leaders" : head === "wonder" ? "wonders" : head === "terrain" ? "terrain" : head || "";
  document.querySelectorAll("[data-nav]").forEach(el => el.classList.toggle("is-active", el.dataset.nav === nav));
  let view;
  if (!head) view = renderLanding(ctx);
  else if (head === "leaders") view = renderLeaders(ctx, query);
  else if (head === "leader" && arg) view = renderLeader(ctx, arg, sub, anchor);
  else if (head === "wonders") view = renderWonders(ctx);
  else if (head === "wonder" && arg) view = renderWonder(ctx, arg);
  else if (head === "eras") view = renderEras(ctx);
  else if (head === "barbarians") view = renderBarbarians(ctx);
  else if (head === "city-states") view = renderCityStates(ctx);
  else if (head === "pantheons") view = renderPantheons(ctx);
  else if (head === "terrain" && arg) view = renderTerrainDetail(ctx, arg);
  else if (head === "terrain") view = renderTerrain(ctx);
  else if (head === "quiz") view = renderQuiz(ctx);
  else if (head === "credits") view = renderCredits(ctx);
  if (!view) view = { html: `<section class="section"><div class="wrap"><h1 class="section__title">Not in the codex</h1><p class="section__lede">There is no page at <code>${esc(location.hash)}</code>.</p><a class="btn" href="#/">Back to the start</a></div></section>`, title: "Not found — Leadership Focus" };
  if (current && view.key && current.key === view.key && typeof current.swap === "function") {
    closeNav();
    if (current.swap(view) !== false) { if (view.canonical && location.hash !== view.canonical) history.replaceState(null, "", view.canonical); return; }
  }
  cleanups.forEach(f => f()); cleanups = []; current = null;
  closeNav();
  const mount = () => {
    app.innerHTML = view.html;
    document.title = view.title || "Leadership Focus";
    if (view.init) { const c = view.init(app); if (typeof c === "function") cleanups.push(c); }
    current = view;
    if (view.canonical && location.hash !== view.canonical) history.replaceState(null, "", view.canonical);
    app.querySelectorAll(".hero").forEach(h => cleanups.push(initHero(h)));
    cleanups.push(initRows(app));
    cleanups.push(initSubnav(app));
    app.classList.remove("is-swapping");
    if (anchor) { const el = document.getElementById(anchor); if (el) { el.scrollIntoView({ block: "start" }); el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); return; } }
    window.scrollTo(0, 0);
    if (booted) app.focus({ preventScroll: true });
  };
  if (reduced.matches || !booted) mount();
  else { app.classList.add("is-swapping"); setTimeout(mount, 160); }
  booted = true;
}
let booted = false;

document.addEventListener("keydown", (e) => {
  if (e.defaultPrevented) return; // a component (the tab bar) already used the key
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") { const a = document.querySelector(e.key === "ArrowLeft" ? 'a[rel="prev"]' : 'a[rel="next"]'); if (a) location.hash = a.getAttribute("href"); }
});
window.addEventListener("hashchange", route);
loadData().then(() => { initSearch(ctx); route(); }).catch(err => { app.innerHTML = `<p class="empty-state">Could not load the codex data (${esc(err.message)}). Try refreshing.</p>`; console.error(err); });
