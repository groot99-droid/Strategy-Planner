// Global search dialog over leaders, wonders, city-states, pantheons, terrain and reference pages.
import { esc } from "./util.js";

export function initSearch(ctx) {
  const dialog = document.getElementById("searchDialog"); const input = document.getElementById("searchInput"); const list = document.getElementById("searchResults"); const openBtn = document.getElementById("searchOpen");
  if (!dialog || typeof dialog.showModal !== "function") return;
  const index = [];
  ctx.leaders.forEach(l => index.push({ kind: "Leader", title: l.name, sub: `${l.civilization}${l.era ? " · " + l.era : ""}${l.region ? " · " + l.region : ""}`, href: `#/leader/${l.slug}`, image: l.image, text: [l.name, l.civilization, l.leaderTitle, l.persona, l.era, l.region, (l.modernCountries || []).join(" "), l.history ? l.history.polity : "", l.curve, l.conversion, l.shape, l.category].join(" ").toLowerCase() }));
  ctx.codex.wonders.wonders.forEach(w => index.push({ kind: "Natural wonder", title: w.name, sub: w.real_world.country, href: `#/wonder/${w.slug}`, image: w.image, text: [w.name, w.real_world.country, w.real_world.location, w.effect, w.expansion].join(" ").toLowerCase() }));
  ctx.codex.cityStates.city_states.forEach(c => index.push({ kind: "City-state", title: c.name, sub: c.type, href: `#/city-states#${c.slug}`, text: [c.name, c.type, c.suzerain_bonus].join(" ").toLowerCase() }));
  ctx.codex.pantheons.pantheons.forEach(p => index.push({ kind: "Pantheon", title: p.name, sub: p.effect, href: `#/pantheons#${p.slug}`, text: [p.name, p.effect, p.category].join(" ").toLowerCase() }));
  ctx.codex.terrain.terrain.forEach(t => index.push({ kind: "Terrain", title: t.name, sub: t.kind, href: `#/terrain/${t.slug}`, image: t.image, text: [t.name, t.kind, t.notes].join(" ").toLowerCase() }));
  ctx.codex.eras.eras.forEach(e => index.push({ kind: "Era", title: `${e.name} era`, sub: e.years, href: `#/eras#era-${e.slug}`, text: [e.name, e.key_techs.join(" "), e.key_civics.join(" "), e.signature_units.join(" "), e.wonders.join(" ")].join(" ").toLowerCase() }));
  ctx.codex.eras.ages.dedications.forEach(d => index.push({ kind: "Dedication", title: d.name, sub: d.eras.join(", "), href: "#/eras#ages", text: [d.name, d.normal, d.golden].join(" ").toLowerCase() }));
  ctx.codex.barbarians.clans_mode.clans.forEach(c => index.push({ kind: "Barbarian clan", title: c.name, sub: c.units, href: "#/barbarians#clans", text: [c.name, c.spawns, c.units].join(" ").toLowerCase() }));
  const render = (q) => {
    const term = q.trim().toLowerCase();
    const hits = term ? index.map(it => { const i = it.text.indexOf(term); const t = it.title.toLowerCase().indexOf(term); return { it, score: t === 0 ? 0 : t > 0 ? 1 : i >= 0 ? 2 : -1 }; }).filter(x => x.score >= 0).sort((a, b) => a.score - b.score).slice(0, 14).map(x => x.it) : index.filter(i => i.kind === "Leader").slice(0, 8);
    list.innerHTML = hits.length ? hits.map(h => `<li class="search__item"><a href="${esc(h.href)}">${h.image ? `<img src="${esc(h.image)}" alt="" loading="lazy">` : '<span class="ph" aria-hidden="true">·</span>'}<span><b>${esc(h.title)}</b><small>${esc(h.sub)}</small></span><span class="search__kind">${esc(h.kind)}</span></a></li>`).join("") : '<li class="search__item" style="padding:12px;color:var(--muted-fg)">Nothing matches that.</li>';
  };
  const open = () => { if (dialog.open) return; dialog.showModal(); input.value = ""; render(""); input.focus(); };
  openBtn.addEventListener("click", open);
  input.addEventListener("input", () => render(input.value));
  list.addEventListener("click", (e) => { if (e.target.closest("a")) dialog.close(); });
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); open(); }
  });
}
