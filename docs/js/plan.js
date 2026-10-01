// The Plan tab: a leader's plan JSON (data/plans/<slug>.json) rendered as an interactive page.
// Turn numbers are authored at Standard speed and rescaled by the speed and difficulty the reader picks;
// progress (turn, ticked tasks and boosts, the band or branch chosen) lives in localStorage per leader.
import { esc, escKw, icon } from "./util.js";
import { sectionHead, listPlain } from "./components.js";

const SPEEDS = [["online", "Online"], ["quick", "Quick"], ["standard", "Standard"], ["epic", "Epic"], ["marathon", "Marathon"]];
const DIFFS = [["prince", "Prince or easier"], ["king", "King"], ["emperor", "Emperor"], ["immortal", "Immortal"], ["deity", "Deity"]];
const DEFAULT_SPEEDS = { online: 0.5, quick: 0.67, standard: 1, epic: 1.5, marathon: 3 };
const DEFAULT_DIFFS = { prince: 1.1, king: 1, emperor: 1, immortal: 0.9, deity: 0.85 };
const ERA_TURNS = [[1, "Ancient"], [60, "Classical"], [110, "Medieval"], [160, "Renaissance"], [210, "Industrial"], [260, "Modern"], [300, "Atomic"], [340, "Information"]];
const ERA_LABEL = { ancient: "Ancient", classical: "Classical", medieval: "Medieval", renaissance: "Renaissance", industrial: "Industrial", modern: "Modern", atomic: "Atomic", information: "Information", future: "Future" };
const SOURCE_LABEL = { leader_ability: "Leader ability", civ_ability: "Civilization ability", unique_unit: "Unique unit", unique_infrastructure: "Unique infrastructure", agenda: "Agenda" };
const FIT_LABEL = { free: "free", cheap: "cheap", costly: "costly", skip: "skip" };
const storage = {
  get(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode or quota: the page still works */ } },
  remove(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
const PREFS_KEY = "lf.plan.prefs.v1";
const progKey = (slug) => `lf.plan.v1.${slug}`;
const freshProgress = () => ({ turn: null, tasks: {}, boosts: {}, checks: {}, band: null, choice: null });

/* ---------- loading ---------- */
function fetchPlan(ctx, l) {
  if (ctx.plans.has(l.slug)) return ctx.plans.get(l.slug);
  const p = fetch(l.planSummary.file).then(r => { if (!r.ok) throw new Error(`${l.planSummary.file} ${r.status}`); return r.json(); }).then(plan => { ctx.plans.set(l.slug, plan); return plan; });
  ctx.plans.set(l.slug, p);
  return p;
}

/* ---------- scaling ---------- */
function factorFor(ctx, prefs) {
  const sf = (ctx.plansMeta && ctx.plansMeta.speed_factors) || DEFAULT_SPEEDS; const df = (ctx.plansMeta && ctx.plansMeta.difficulty_factors) || DEFAULT_DIFFS;
  return (sf[prefs.speed] || 1) * (df[prefs.difficulty] || 1);
}
const turnSpan = (n) => (n == null ? "" : `<span class="turn" data-turn="${esc(n)}">${esc(n)}</span>`);
const rangeLabel = (t) => `Turns ${turnSpan(t.from)} to ${t.to === null ? "end" : turnSpan(t.to)}`;
function eraAt(baseTurn) { let e = ERA_TURNS[0][1]; for (const [t, name] of ERA_TURNS) if (baseTurn >= t) e = name; return e; }

/* ---------- pieces ---------- */
function boostRef(ctx, id) { return ctx.boostsById.get(id) || { kind: id.startsWith("civic:") ? "civic" : "tech", name: id.replace(/^\w+:/, ""), trigger: null, era: "" }; }
function fitBadge(fit) { return fit ? `<span class="fit fit--${esc(fit)}">${esc(FIT_LABEL[fit] || fit)}</span>` : ""; }
function boostLine(ctx, id, ratedById, note, progress) {
  const b = boostRef(ctx, id); const rated = ratedById.get(id); const hasBoost = !!b.trigger;
  const box = hasBoost && rated && rated.fit !== "skip" ? `<input type="checkbox" data-boost="${esc(id)}" ${progress.boosts[id] ? "checked" : ""} aria-label="Collected: ${esc(b.name)}">` : `<span class="path__spacer" aria-hidden="true"></span>`;
  return `<li class="path__item"><label class="path__label">${box}<span><b>${esc(b.name)}</b>${hasBoost ? ` ${fitBadge(rated ? rated.fit : null)} <small class="muted">${b.kind === "tech" ? "Eureka" : "Inspiration"}: ${escKw(b.trigger)}</small>` : ` <small class="muted">no boost</small>`}${note ? `<span class="path__note">${escKw(note)}</span>` : ""}</span></label></li>`;
}
function toolbarHtml(prefs, progress, l) {
  const opt = (list, cur) => list.map(([k, label]) => `<option value="${k}" ${k === cur ? "selected" : ""}>${label}</option>`).join("");
  return `<div class="plan-toolbar panel" id="planToolbar">
    <div class="plan-toolbar__controls">
      <label class="field"><span class="field__label">Game speed</span><select class="input" id="planSpeed">${opt(SPEEDS, prefs.speed)}</select></label>
      <label class="field"><span class="field__label">Difficulty</span><select class="input" id="planDifficulty">${opt(DIFFS, prefs.difficulty)}</select></label>
      <label class="field"><span class="field__label">I am on turn</span><input class="input" id="planTurn" type="number" inputmode="numeric" min="1" max="999" placeholder="—" value="${progress.turn != null ? esc(progress.turn) : ""}"></label>
    </div>
    <p class="plan-toolbar__readout" id="planReadout" role="status" aria-live="polite"></p>
    <div class="plan-toolbar__actions">
      <a class="btn btn--sm" href="${esc(l.planSummary.file)}" download="${esc(l.slug)}.plan.json">${icon("arrow", "icon icon--sm")} Download JSON</a>
      <button class="btn btn--sm" type="button" data-plan="copy">Copy JSON</button>
      <button class="btn btn--sm" type="button" data-plan="expand">Expand all phases</button>
      <button class="btn btn--sm" type="button" data-plan="reset">Reset progress</button>
      <span class="sr-only" id="planCopyStatus" role="status"></span>
    </div></div>`;
}
function verdictHtml(plan) {
  const v = plan.verdict, m = plan.map_check;
  return `<div class="two-col plan-verdict">
    <div class="panel panel--cat overview__verdict"><div class="panel__kicker">Verdict · ${esc(v.confidence)} confidence</div><h3 class="panel__title">${esc(v.victory)}${v.secondary ? ` <small class="muted">· ${esc(v.secondary)} as the fallback</small>` : ""}</h3><p><b>${escKw(v.one_line)}</b></p><p>${escKw(v.why)}</p></div>
    <div class="callout callout--warn"><p class="callout__title">${icon("map", "icon icon--sm")} Map check before turn 1</p>
      ${m.must_have && m.must_have.length ? `<p class="subblock__label">Must have</p>${listPlain(m.must_have)}` : ""}${m.prefer && m.prefer.length ? `<p class="subblock__label">Prefer</p>${listPlain(m.prefer)}` : ""}
      <p><b>No-go.</b> ${escKw(m.no_go)}</p><p><b>Fallback.</b> ${escKw(m.fallback)}</p></div></div>`;
}
function leversHtml(plan) {
  return `<p class="subgroup-label">What the kit actually buys</p><div class="ability-grid">${plan.kit_levers.map(k => `<div class="panel panel--cat"><div class="panel__kicker">${esc(SOURCE_LABEL[k.source] || k.source)}</div><h3 class="panel__title">${esc(k.name)}</h3><p><b>Buys.</b> ${escKw(k.buys)}</p><p><b>Use.</b> ${escKw(k.exploit)}</p></div>`).join("")}</div>`;
}
function checkRow(id, text, progress) { return `<li><label class="task"><input type="checkbox" data-check="${esc(id)}" ${progress.checks[id] ? "checked" : ""}><span>${escKw(text)}</span></label></li>`; }
function shapeBlockHtml(ctx, shape, block, progress, ratedById, secondary = false) {
  const kicker = `${secondary ? "Secondary shape" : "Shape"} · ${esc(shape)}`;
  const wrap = (inner) => `<div class="plan-shape panel" id="${secondary ? "shape-secondary" : "shape-block"}"><div class="panel__kicker">${kicker}</div>${inner}</div>`;
  if (shape === "Monitor") {
    const b = block.monitor; const bands = ["green", "amber", "red"];
    return wrap(`<div class="principle"><span class="principle__glyph" aria-hidden="true">${icon("compass")}</span><p><b>Watch:</b> ${escKw(b.watched_stat)}. <small class="muted">Check ${esc(b.check_every)}.</small></p></div>
      <p class="subblock__label">Where is the stat right now?</p><div class="band-row" role="group" aria-label="Watched stat band">${bands.map(k => `<button class="chip band-chip" type="button" data-band="${k}" aria-pressed="${progress.band === k}"><span class="dot" aria-hidden="true"></span>${k[0].toUpperCase() + k.slice(1)}</button>`).join("")}</div>
      ${bands.map(k => `<div class="note-callout band-callout" data-band-panel="${k}" ${progress.band === k ? "" : "hidden"}><p><b>${k[0].toUpperCase() + k.slice(1)} means:</b> ${escKw(b.bands[k].test)}</p><p><b>Do:</b> ${escKw(b.bands[k].response)}</p></div>`).join("")}
      <div class="two-col"><div class="panel"><div class="panel__kicker">Second watch</div><p><b>${escKw(b.second_watch.stat)}</b></p><p>${escKw(b.second_watch.why)}</p></div><div class="panel"><div class="panel__kicker">While the ability is off</div><p>${escKw(b.off_period_plan)}</p></div></div>`);
  }
  if (shape === "Countdown") {
    const b = block.countdown;
    return wrap(`<dl class="facts"><div><dt>Window closes</dt><dd>Turn ${turnSpan(b.deadline_turn)}</dd></div><div><dt>Midpoint check</dt><dd>Turn ${turnSpan(b.midpoint_turn)}</dd></div><div><dt>Turns left</dt><dd class="plan-countdown" data-deadline="${esc(b.deadline_turn)}">—</dd></div></dl>
      <p><b>Target.</b> ${escKw(b.target_selection)}</p><p><b>Converted means.</b> ${escKw(b.what_counts_as_converted)}</p><p><b>After the window.</b> ${escKw(b.after_window)}</p>`);
  }
  if (shape === "Gate") {
    const b = block.gate;
    return wrap(`<div class="principle"><span class="principle__glyph" aria-hidden="true">${icon("shield")}</span><p><b>The gate:</b> ${escKw(b.gate_condition)} <small class="muted">Expected around turn ${turnSpan(b.estimated_arrival.from)} to ${turnSpan(b.estimated_arrival.to)}.</small></p></div>
      <p class="subblock__label">Fastest path</p><ul class="path">${b.fastest_path.map(id => boostLine(ctx, id, ratedById, "", progress)).join("")}</ul>
      <p class="subblock__label">Staging checklist</p><ul class="checklist checklist--tick">${b.staging.map((s, i) => checkRow(`gate-${i}`, s, progress)).join("")}</ul>
      <div class="two-col"><div class="callout callout--warn"><p class="callout__title">${icon("warn", "icon icon--sm")} If the gate is late</p><p>${escKw(b.late_gate)}</p></div><div class="panel"><div class="panel__kicker">What closes the window</div><p>${escKw(b.closing_window)}</p></div></div>`);
  }
  if (shape === "Dead-Phase") {
    const b = block.dead_phase;
    return wrap(`<div class="callout"><p class="callout__title">${icon("quote", "icon icon--sm")} Read this first</p><p>${escKw(b.flatness_statement)}</p></div>
      <dl class="facts"><div><dt>Activation</dt><dd>Turn ${turnSpan(b.activation_turn)}</dd></div><div><dt>Turns to go</dt><dd class="plan-countdown" data-deadline="${esc(b.activation_turn)}">—</dd></div></dl>
      <p class="subblock__label">Stockpile to have ready</p><ul class="checklist checklist--tick">${b.stockpile.map((s, i) => checkRow(`stock-${i}`, s, progress)).join("")}</ul>
      <p class="subblock__label">Progress markers while nothing visible happens</p>${listPlain(b.progress_markers)}<p><b>Activation test.</b> ${escKw(b.activation_test)}</p>`);
  }
  if (shape === "Front-Load") {
    const b = block.front_load;
    return wrap(`<p class="subblock__label">Turn 0: go or no-go</p><ul class="checklist checklist--tick">${b.turn_zero.map((s, i) => checkRow(`t0-${i}`, s, progress)).join("")}</ul>
      <p><b>Ceiling.</b> ${escKw(b.ceiling)}</p><p><b>Settle map rule.</b> ${escKw(b.settle_map_rule)}</p>
      <p class="subblock__label">Irreversible by</p><div class="table-wrap"><table><thead><tr><th>Decision</th><th>By turn</th></tr></thead><tbody>${b.irreversibles.map(x => `<tr><td>${escKw(x.decision)}</td><td>${turnSpan(x.by_turn)}</td></tr>`).join("")}</tbody></table></div>`);
  }
  if (shape === "Linear") {
    const d = block.linear.direction;
    return wrap(`<p class="subblock__label">Pick the direction by turn ${turnSpan(d.choose_by)}</p><div class="choice-row" role="radiogroup" aria-label="Victory direction">${d.options.map(o => `<button class="quiz__option choice" type="button" role="radio" data-choice="${esc(o.victory)}" aria-checked="${progress.choice === o.victory}"><b>${esc(o.victory)}</b><span class="muted">${escKw(o.when_it_fits)}</span></button>`).join("")}</div>
      <p><b>Commit test.</b> ${escKw(d.commit_test)}</p>`);
  }
  return "";
}
function phaseHtml(ctx, p, i, ratedById, progress) {
  const bo = p.build_order.map(b => typeof b === "string" ? { item: b } : b);
  const li = (x) => `<li>${escKw(x)}</li>`;
  const list = (label, items, fn) => (items && items.length ? `<div class="plan-sub"><p class="subblock__label">${label}</p>${fn(items)}</div>` : "");
  return `<div class="phase plan-phase" data-phase="${esc(p.id)}" data-from="${esc(p.turns.from)}" data-to="${p.turns.to === null ? "" : esc(p.turns.to)}" id="phase-${esc(p.id)}">
    <div class="phase__node" aria-hidden="true">${i + 1}</div>
    <details class="phase__card plan-phase__card" ${i === 0 ? "open" : ""}>
      <summary class="phase__header plan-phase__summary"><span><h3 class="phase__title">${esc(p.name)} <span class="phase__here" hidden>You are here</span></h3><span class="phase__turns">${rangeLabel(p.turns)} · ${esc(ERA_LABEL[p.era] || p.era)}</span></span>${icon("chevron-right", "icon icon--sm plan-phase__chev")}</summary>
      <div class="plan-phase__body">
        <p class="phase__goal">${escKw(p.objective)}</p>
        <div class="two-col">
          ${list("Build order", bo, (items) => `<ol class="build-order">${items.map(b => `<li><b>${esc(b.item)}</b>${b.why ? ` <small class="muted">${escKw(b.why)}</small>` : ""}</li>`).join("")}</ol>`)}
          <div>${list("Research", p.research, (items) => `<ul class="path">${items.map(r => boostLine(ctx, r.id, ratedById, r.note, progress)).join("")}</ul>`)}
          ${list("Civics", p.civics, (items) => `<ul class="path">${items.map(c => boostLine(ctx, c.id, ratedById, c.note, progress)).join("")}</ul>`)}</div>
        </div>
        <div class="plan-grid">
          ${list("Policy cards", p.policies, (items) => `<ul class="list-plain">${items.map(c => `<li><b>${esc(c.card)}</b> <span class="tag tag--outline">${esc(c.slot)}</span>${c.why ? ` <small class="muted">${escKw(c.why)}</small>` : ""}</li>`).join("")}</ul>`)}
          ${list("Districts", p.districts, (items) => `<ul class="list-plain">${items.map(d => `<li><b>${esc(d.district.replace(/-/g, " "))}</b>${d.city ? ` <small class="muted">· ${esc(d.city)}</small>` : ""}${d.note ? `<br><small class="muted">${escKw(d.note)}</small>` : ""}</li>`).join("")}</ul>`)}
          ${p.pantheon ? `<div class="plan-sub"><p class="subblock__label">Pantheon</p><ul class="list-plain"><li><a href="#/pantheons#${esc(p.pantheon.slug)}"><b>${esc(pantheonName(ctx, p.pantheon.slug))}</b></a> <small class="muted">${escKw(p.pantheon.why)}</small>${p.pantheon.alternative ? `<br><small class="muted">Alternative: <a href="#/pantheons#${esc(p.pantheon.alternative)}">${esc(pantheonName(ctx, p.pantheon.alternative))}</a></small>` : ""}</li></ul></div>` : ""}
          ${list("Wonders", p.wonders, (items) => `<ul class="list-plain">${items.map(w => `<li><b>${esc(w.name)}</b> <small class="muted">${escKw(w.why)}</small><br><small class="muted"><b>Skip if:</b> ${escKw(w.skip_if)}</small></li>`).join("")}</ul>`)}
          ${list("Governors", p.governors, (items) => `<ul class="list-plain">${items.map(g => `<li><b>${esc(g.governor[0].toUpperCase() + g.governor.slice(1))}</b>${g.promotion ? ` · ${esc(g.promotion)}` : ""}${g.city ? ` <small class="muted">· ${esc(g.city)}</small>` : ""}<br><small class="muted">${escKw(g.why)}</small></li>`).join("")}</ul>`)}
          ${list("City-states", p.city_states, (items) => `<ul class="list-plain">${items.map(c => `<li>${c.slug ? `<a href="#/city-states#${esc(c.slug)}"><b>${esc(cityStateName(ctx, c.slug))}</b></a>` : `<a href="#/city-states#type-${esc(String(c.type).toLowerCase())}"><b>Any ${esc(c.type)}</b></a>`} <small class="muted">${escKw(c.why)}</small></li>`).join("")}</ul>`)}
          ${list("Great people", p.great_people, (items) => `<ul class="list-plain">${items.map(g => `<li><b>${esc(g.class.replace(/-/g, " ").replace(/\b\w/g, ch => ch.toUpperCase()))}</b>${g.name ? ` · ${esc(g.name)}` : ""} <small class="muted">${escKw(g.why)}</small></li>`).join("")}</ul>`)}
        </div>
        ${list("Checkpoints", p.checkpoints, (items) => `<div class="checkpoint-grid">${items.map(c => `<div class="checkpoint" data-cp-turn="${esc(c.turn)}"><p class="checkpoint__at">Checkpoint · turn ${turnSpan(c.turn)}</p><p class="checkpoint__test">${escKw(c.test)}</p><div class="checkpoint__branches"><div class="checkpoint__branch"><b>Yes</b><span>${escKw(c.pass)}</span></div><div class="checkpoint__branch"><b>No</b><span>${escKw(c.fail)}</span></div></div></div>`).join("")}</div>`)}
        ${list("Tasks", p.tasks, (items) => `<ul class="checklist checklist--tick">${items.map(t => `<li><label class="task" data-task-turn="${t.turn != null ? esc(t.turn) : ""}"><input type="checkbox" data-task="${esc(t.id)}" ${progress.tasks[t.id] ? "checked" : ""}><span>${escKw(t.text)}</span>${t.turn != null ? `<small class="muted">by turn ${turnSpan(t.turn)}</small>` : ""}</label></li>`).join("")}</ul>`)}
      </div>
    </details></div>`;
}
function pantheonName(ctx, slug) { const p = ctx.pantheonsBySlug.get(slug); return p ? p.name : slug.replace(/-/g, " "); }
function cityStateName(ctx, slug) { const c = ctx.cityStatesBySlug.get(slug); return c ? c.name : slug.replace(/-/g, " "); }
function boostsHtml(ctx, plan, ratedById, progress) {
  const items = plan.boosts.map(b => ({ ...b, ref: boostRef(ctx, b.id) })).filter(b => b.ref.trigger);
  const eras = ["ancient", "classical", "medieval", "renaissance", "industrial", "modern", "atomic", "information", "future"];
  const phaseName = (w) => { if (Number.isInteger(w)) return `turn ${turnSpan(w)}`; const p = plan.phases.find(x => x.id === w); return p ? esc(p.name) : ""; };
  const groups = eras.map(e => ({ era: e, list: items.filter(b => b.ref.era === e) })).filter(g => g.list.length);
  const trackable = items.filter(b => b.fit !== "skip").length;
  return `<div class="plan-boosts" id="eurekas"><div class="plan-boosts__head"><div><p class="subgroup-label">Eurekas and Inspirations this kit reaches</p><p class="muted">${trackable} worth collecting out of ${items.length} listed. Free means the plan triggers it by itself; cheap means one deliberate step; costly means a real detour; skip means do not chase it.</p></div>
      <div class="meter-wrap"><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${trackable}" aria-valuenow="0" aria-label="Boosts collected"><span class="meter__bar" id="boostMeterBar"></span></div><span class="meter__text" id="boostMeterText">0 of ${trackable}</span></div></div>
    <div class="chip-row plan-filters" role="group" aria-label="Filter boosts">${["all", "free", "cheap", "costly", "skip"].map(f => `<button class="chip" type="button" data-fit-filter="${f}" aria-pressed="${f === "all"}">${f === "all" ? "All" : FIT_LABEL[f][0].toUpperCase() + FIT_LABEL[f].slice(1)}</button>`).join("")}<button class="chip" type="button" data-plan="hide-collected" aria-pressed="false">Hide collected</button></div>
    ${groups.map(g => `<section class="boost-era" data-era="${g.era}"><p class="subblock__label">${esc(ERA_LABEL[g.era])}</p><div class="table-wrap"><table class="boost-table"><thead><tr><th scope="col"><span class="sr-only">Collected</span></th><th scope="col">Technology or civic</th><th scope="col">Fit</th><th scope="col">Boost</th><th scope="col">When and how</th></tr></thead><tbody>
      ${g.list.map(b => `<tr class="boost-row" data-fit="${esc(b.fit)}" data-boost-row="${esc(b.id)}"><td>${b.fit === "skip" ? "" : `<input type="checkbox" data-boost="${esc(b.id)}" ${progress.boosts[b.id] ? "checked" : ""} aria-label="Collected: ${esc(b.ref.name)}">`}</td><td><b>${esc(b.ref.name)}</b> <span class="tag tag--outline">${b.ref.kind === "tech" ? "Tech" : "Civic"}</span></td><td>${fitBadge(b.fit)}</td><td>${escKw(b.ref.trigger)}</td><td>${b.fit === "skip" ? `<span class="muted">Not worth the detour</span>` : `${phaseName(b.when)}${b.how ? ` <small class="muted">· ${escKw(b.how)}</small>` : ""}`}</td></tr>`).join("")}
    </tbody></table></div></section>`).join("")}</div>`;
}
function closingHtml(plan) {
  return `<div id="decisions"><p class="subgroup-label">Decision triggers</p><ul class="list-plain triggers">${plan.decision_triggers.map(t => `<li><b>${esc(t.name)}.</b> <i>If</i> ${escKw(t.if)} <i>then</i> ${escKw(t.then)}</li>`).join("")}</ul>
    <div class="callout callout--warn"><p class="callout__title">${icon("warn", "icon icon--sm")} Abort branch</p><p><b>Trigger:</b> ${escKw(plan.abort.trigger)}</p><ul>${plan.abort.actions.map(a => `<li>${escKw(a)}</li>`).join("")}</ul></div>
    <div class="callout callout--danger"><p class="callout__title">${icon("x", "icon icon--sm")} Fail state</p><p>${escKw(plan.fail_state)}</p></div>
    <p class="subgroup-label">Common mistakes</p>${listPlain(plan.common_mistakes)}
    <p class="muted plan-foot">Written for ${esc(plan.assumptions.speed)} speed, ${esc(plan.assumptions.difficulty)}, ${esc(plan.assumptions.ruleset)} · plan v${esc(plan.version)}, ${esc(plan.updated)}.${plan.assumptions.notes ? " " + esc(plan.assumptions.notes) : ""}<br>Sources: ${plan.sources.map(esc).join(" · ")}</p></div>`;
}

/* ---------- the panel ---------- */
function fullHtml(ctx, l, plan, prefs, progress) {
  const ratedById = new Map(plan.boosts.map(b => [b.id, b]));
  const stepper = `<ol class="stepper" aria-label="Phases">${plan.phases.map((p, i) => `<li><button class="stepper__step" type="button" data-step="${esc(p.id)}" aria-current="false"><span class="stepper__n">${i + 1}</span><span class="stepper__name">${esc(p.name)}</span><span class="stepper__turns">${rangeLabel(p.turns)}</span></button></li>`).join("")}</ol>`;
  return `${toolbarHtml(prefs, progress, l)}${verdictHtml(plan)}${leversHtml(plan)}
    ${shapeBlockHtml(ctx, plan.shape, plan.shape_block, progress, ratedById)}${plan.secondary_shape ? shapeBlockHtml(ctx, plan.secondary_shape, plan.secondary_shape_block, progress, ratedById, true) : ""}
    <p class="subgroup-label" id="phases">The phases</p>${stepper}<div class="timeline plan-timeline">${plan.phases.map((p, i) => phaseHtml(ctx, p, i, ratedById, progress)).join("")}</div>
    ${boostsHtml(ctx, plan, ratedById, progress)}${closingHtml(plan)}`;
}
export function planPanelHtml(ctx, l) {
  const lede = l.planSummary ? `Build order, research and civics with the boosts they bring, the stat to watch, checkpoints and tasks, written for ${esc(l.name)} specifically. Set your speed and difficulty, type the turn you are on, and tick things off; it is remembered on this device.` : "";
  const cached = l.planSummary && ctx.plans.get(l.slug); const ready = cached && typeof cached.then !== "function";
  const body = !l.planSummary ? `<p class="empty-state">The plan for ${esc(l.name)} is being written.</p>` : ready ? fullHtml(ctx, l, cached, loadPrefs(), loadProgress(l.slug)) : `<p class="empty-state" aria-busy="true">Loading the plan…</p>`;
  return `<section class="section section--tight plan" id="plan"><div class="wrap">${sectionHead("Leadership Focus", `The plan for ${l.name}`, lede)}<div id="planBody">${body}</div></div></section>`;
}
function loadPrefs() { const p = storage.get(PREFS_KEY, {}); return { speed: SPEEDS.some(s => s[0] === p.speed) ? p.speed : "standard", difficulty: DIFFS.some(d => d[0] === p.difficulty) ? p.difficulty : "emperor" }; }
function loadProgress(slug) { return Object.assign(freshProgress(), storage.get(progKey(slug), {})); }

export function initPlanPanel(panel, ctx, l) {
  if (!l.planSummary) return () => {};
  const body = panel.querySelector("#planBody"); let alive = true; const offs = [];
  const render = (plan) => {
    if (!alive) return;
    const prefs = loadPrefs(); const progress = loadProgress(l.slug);
    if (!body.querySelector("#planToolbar")) body.innerHTML = fullHtml(ctx, l, plan, prefs, progress);
    const state = { plan, prefs, progress, hideCollected: false, fitFilter: "all" };
    const save = () => storage.set(progKey(l.slug), state.progress);
    const savePrefs = () => storage.set(PREFS_KEY, state.prefs);
    const factor = () => factorFor(ctx, state.prefs);
    const scale = (n) => Math.max(1, Math.round(n * factor()));
    const baseTurn = () => (state.progress.turn == null ? null : state.progress.turn / factor());
    const rescale = () => { const f = factor(); body.querySelectorAll("[data-turn]").forEach(el => { const n = Number(el.dataset.turn); el.textContent = String(scale(n)); if (f !== 1) el.title = `Turn ${n} at Standard speed`; else el.removeAttribute("title"); }); };
    const applyTurn = () => {
      const t = baseTurn(); const readout = body.querySelector("#planReadout");
      body.querySelectorAll(".plan-phase").forEach(ph => { const from = Number(ph.dataset.from), to = ph.dataset.to === "" ? Infinity : Number(ph.dataset.to); const cur = t != null && t >= from && t <= to; ph.classList.toggle("phase--current", cur); ph.querySelector(".phase__here").hidden = !cur; const step = body.querySelector(`[data-step="${ph.dataset.phase}"]`); if (step) step.setAttribute("aria-current", cur ? "step" : "false"); if (cur) ph.querySelector("details").open = true; });
      body.querySelectorAll(".task[data-task-turn]").forEach(el => { const due = el.dataset.taskTurn !== "" && t != null && Number(el.dataset.taskTurn) <= t && !el.querySelector("input").checked; el.classList.toggle("task--due", due); });
      let next = null; body.querySelectorAll("[data-cp-turn]").forEach(el => { const n = Number(el.dataset.cpTurn); const isNext = t != null && n >= t && (next === null || n < next); if (isNext) next = n; el.classList.remove("checkpoint--next"); });
      if (next !== null) body.querySelectorAll(`[data-cp-turn="${next}"]`).forEach(el => el.classList.add("checkpoint--next"));
      body.querySelectorAll(".plan-countdown").forEach(el => { const d = Number(el.dataset.deadline); el.textContent = t == null ? "Enter your turn" : t > d ? `Passed by ${Math.round((t - d) * factor())}` : `${Math.round((d - t) * factor())} turns`; });
      const f = factor(); const scaleNote = f !== 1 ? ` Turn numbers are scaled ×${f.toFixed(2)} from the Standard-speed plan.` : "";
      if (t == null) { readout.textContent = `Enter the turn you are on to light up the current phase, the tasks that are due and the next checkpoint.${scaleNote}`; return; }
      const ph = state.plan.phases.find(p => t >= p.turns.from && (p.turns.to === null || t <= p.turns.to));
      readout.textContent = `Turn ${state.progress.turn}${f !== 1 ? ` (turn ${Math.round(t)} at Standard)` : ""} · ${eraAt(t)} era by the plan's clock · ${ph ? `Phase ${state.plan.phases.indexOf(ph) + 1}, ${ph.name}` : "past the last phase"}${next !== null ? ` · next checkpoint at turn ${scale(next)}` : " · no checkpoints left"}.${scaleNote}`;
    };
    const applyMeter = () => { const boxes = Array.from(body.querySelectorAll(".boost-table [data-boost]")); const n = boxes.filter(b => b.checked).length; const bar = body.querySelector("#boostMeterBar"); const txt = body.querySelector("#boostMeterText"); const meter = body.querySelector(".meter"); if (bar) bar.style.width = boxes.length ? `${(100 * n) / boxes.length}%` : "0%"; if (txt) txt.textContent = `${n} of ${boxes.length}`; if (meter) meter.setAttribute("aria-valuenow", String(n)); };
    const applyFilters = () => { body.querySelectorAll(".boost-row").forEach(r => { const fitOk = state.fitFilter === "all" || r.dataset.fit === state.fitFilter; const box = r.querySelector("[data-boost]"); const hide = state.hideCollected && box && box.checked; r.hidden = !(fitOk && !hide); }); body.querySelectorAll("[data-fit-filter]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.fitFilter === state.fitFilter))); };
    const onChange = (e) => {
      const el = e.target;
      if (el.id === "planSpeed") { state.prefs.speed = el.value; savePrefs(); rescale(); applyTurn(); }
      else if (el.id === "planDifficulty") { state.prefs.difficulty = el.value; savePrefs(); rescale(); applyTurn(); }
      else if (el.id === "planTurn") { const v = parseInt(el.value, 10); state.progress.turn = Number.isFinite(v) && v > 0 ? v : null; save(); applyTurn(); }
      else if (el.dataset.task) { state.progress.tasks[el.dataset.task] = el.checked; if (!el.checked) delete state.progress.tasks[el.dataset.task]; save(); applyTurn(); }
      else if (el.dataset.boost) { const id = el.dataset.boost; if (el.checked) state.progress.boosts[id] = true; else delete state.progress.boosts[id]; body.querySelectorAll(`[data-boost="${CSS.escape(id)}"]`).forEach(b => { b.checked = el.checked; }); save(); applyMeter(); applyFilters(); }
      else if (el.dataset.check) { if (el.checked) state.progress.checks[el.dataset.check] = true; else delete state.progress.checks[el.dataset.check]; save(); }
    };
    let resetArmed = 0;
    const onClick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.band) { state.progress.band = state.progress.band === b.dataset.band ? null : b.dataset.band; save(); body.querySelectorAll("[data-band]").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.band === state.progress.band))); body.querySelectorAll("[data-band-panel]").forEach(x => { x.hidden = x.dataset.bandPanel !== state.progress.band; }); }
      else if (b.dataset.choice) { state.progress.choice = state.progress.choice === b.dataset.choice ? null : b.dataset.choice; save(); body.querySelectorAll("[data-choice]").forEach(x => x.setAttribute("aria-checked", String(x.dataset.choice === state.progress.choice))); }
      else if (b.dataset.step) { const ph = body.querySelector(`#phase-${CSS.escape(b.dataset.step)}`); if (ph) { ph.querySelector("details").open = true; ph.scrollIntoView({ block: "start", behavior: "auto" }); ph.querySelector("summary").focus({ preventScroll: true }); } }
      else if (b.dataset.fitFilter) { state.fitFilter = b.dataset.fitFilter; applyFilters(); }
      else if (b.dataset.plan === "hide-collected") { state.hideCollected = !state.hideCollected; b.setAttribute("aria-pressed", String(state.hideCollected)); applyFilters(); }
      else if (b.dataset.plan === "expand") { const all = Array.from(body.querySelectorAll(".plan-phase details")); const open = all.some(d => !d.open); all.forEach(d => { d.open = open; }); b.textContent = open ? "Collapse phases" : "Expand all phases"; }
      else if (b.dataset.plan === "copy") { const text = JSON.stringify(state.plan, null, 2); const done = () => { const s = body.querySelector("#planCopyStatus"); b.textContent = "Copied"; if (s) s.textContent = "Plan JSON copied to the clipboard"; setTimeout(() => { b.textContent = "Copy JSON"; }, 2000); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done)); else fallbackCopy(text, done); }
      else if (b.dataset.plan === "reset") { const now = Date.now(); if (now - resetArmed > 4000) { resetArmed = now; b.textContent = "Confirm reset"; setTimeout(() => { if (alive && Date.now() - resetArmed >= 4000) b.textContent = "Reset progress"; }, 4200); return; } resetArmed = 0; state.progress = freshProgress(); storage.remove(progKey(l.slug)); body.innerHTML = fullHtml(ctx, l, state.plan, state.prefs, state.progress); b.textContent = "Reset progress"; rescale(); applyTurn(); applyMeter(); applyFilters(); }
    };
    body.addEventListener("change", onChange); body.addEventListener("click", onClick);
    offs.push(() => { body.removeEventListener("change", onChange); body.removeEventListener("click", onClick); });
    rescale(); applyTurn(); applyMeter(); applyFilters();
  };
  Promise.resolve(fetchPlan(ctx, l)).then(render).catch(err => { if (alive) body.innerHTML = `<p class="empty-state">Could not load the plan (${esc(err.message)}).</p>`; });
  return () => { alive = false; offs.forEach(f => f()); };
}
function fallbackCopy(text, done) { const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch { /* nothing to do */ } ta.remove(); }
