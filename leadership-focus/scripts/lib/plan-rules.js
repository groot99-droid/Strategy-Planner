'use strict';
/**
 * plan-rules.js — the one place the plan schema is enforced.
 * Used by scripts/validate-plans.js (CLI) and scripts/build-site-data.js (build).
 * validatePlan(plan, refs) -> { errors: string[], warnings: string[] }
 *
 * refs = { slug, shape, altShape, convertBy, activationTurn, civNames:Set, boostIds:Set, pantheonSlugs:Set,
 *          wonderSlugs:Set, cityStateSlugs:Set, cityStateTypes:Set, eras:Set }
 */
const SHAPE_KEY = { Countdown: 'countdown', Gate: 'gate', Monitor: 'monitor', 'Front-Load': 'front_load', 'Dead-Phase': 'dead_phase', Linear: 'linear' };
const VICTORIES = new Set(['Domination', 'Science', 'Culture', 'Religion', 'Diplomatic', 'Score']);
const FITS = new Set(['free', 'cheap', 'costly', 'skip']);
const SOURCES = new Set(['leader_ability', 'civ_ability', 'unique_unit', 'unique_infrastructure', 'agenda']);
const DIFFICULTIES = new Set(['Settler', 'Chieftain', 'Warlord', 'Prince', 'King', 'Emperor', 'Immortal', 'Deity']);
const GOVERNORS = new Set(['pingala', 'magnus', 'liang', 'amani', 'victor', 'reyna', 'moksha', 'ibrahim']);
const GP_CLASSES = new Set(['great-general', 'great-admiral', 'great-engineer', 'great-merchant', 'great-prophet', 'great-scientist', 'great-writer', 'great-artist', 'great-musician']);
const DISTRICTS = new Set(['city-center', 'campus', 'theater-square', 'holy-site', 'encampment', 'commercial-hub', 'harbor', 'industrial-zone', 'entertainment-complex', 'water-park', 'aqueduct', 'neighborhood', 'aerodrome', 'spaceport', 'government-plaza', 'diplomatic-quarter', 'preserve', 'canal', 'dam',
  'acropolis', 'lavra', 'hansa', 'royal-navy-dockyard', 'cothon', 'suguba', 'oppidum', 'ikanda', 'seowon', 'mbanza', 'street-carnival', 'copacabana', 'thanh', 'observatory', 'bath']);
const MIN = { phases: [3, 6], firstBuild: 6, build: 3, research: 1, civics: 1, checkpointsPerPhase: 1, checkpointsTotal: 4, tasksPerPhase: 3, tasksTotal: 15, boosts: 24, free: 6, cheap: 5, levers: 3, triggers: 3, mistakes: 3 };
const SHAPE_FIELDS = {
  monitor: ['watched_stat', 'check_every', 'bands', 'second_watch', 'off_period_plan'],
  countdown: ['deadline_turn', 'midpoint_turn', 'target_selection', 'what_counts_as_converted', 'after_window'],
  gate: ['gate_condition', 'fastest_path', 'estimated_arrival', 'staging', 'late_gate', 'closing_window'],
  dead_phase: ['activation_turn', 'flatness_statement', 'stockpile', 'progress_markers', 'activation_test'],
  front_load: ['turn_zero', 'ceiling', 'irreversibles', 'settle_map_rule'],
  linear: ['direction'],
};

function validatePlan(plan, refs) {
  const errors = [], warnings = [];
  const E = (m) => errors.push(m), W = (m) => warnings.push(m);
  const str = (v, min, path) => { if (typeof v !== 'string' || v.trim().length < min) E(`${path}: text of at least ${min} characters required`); };
  const arr = (v, min, path) => { if (!Array.isArray(v)) { E(`${path}: array required`); return false; } if (v.length < min) E(`${path}: at least ${min} items (has ${v.length})`); return true; };
  const int = (v, path) => { if (!Number.isInteger(v)) E(`${path}: integer turn required`); };
  const hygiene = (v, path) => { if (typeof v === 'string') { if (/\{\{|\[\[UNRESOLVED|TODO|TBD/.test(v)) E(`${path}: placeholder text`); if (/  /.test(v)) W(`${path}: double space`); } else if (Array.isArray(v)) v.forEach((x, i) => hygiene(x, `${path}[${i}]`)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => hygiene(x, `${path}.${k}`)); };
  if (!plan || typeof plan !== 'object') return { errors: ['not an object'], warnings };
  hygiene(plan, 'plan');
  if (plan.slug !== refs.slug) E(`slug "${plan.slug}" does not match file/leader "${refs.slug}"`);
  if (plan.shape !== refs.shape) E(`shape "${plan.shape}" does not match caveats guide_shape "${refs.shape}"`);
  if ((plan.secondary_shape || null) !== (refs.altShape || null)) E(`secondary_shape "${plan.secondary_shape}" does not match supplemental alt shape "${refs.altShape || null}"`);
  if (!Number.isInteger(plan.version)) E('version: integer required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(plan.updated))) E('updated: ISO date required');
  const a = plan.assumptions || {}; if (!/Gathering Storm/.test(String(a.ruleset))) E('assumptions.ruleset must name Gathering Storm'); if (a.speed !== 'Standard') E('assumptions.speed must be Standard (plans are authored at Standard and rescaled)'); if (!DIFFICULTIES.has(a.difficulty)) E('assumptions.difficulty invalid'); str(a.map, 10, 'assumptions.map');
  const v = plan.verdict || {}; if (!VICTORIES.has(v.victory)) E(`verdict.victory "${v.victory}" invalid`); if (v.secondary && !VICTORIES.has(v.secondary)) E('verdict.secondary invalid'); if (!['low', 'medium', 'high'].includes(v.confidence)) E('verdict.confidence invalid'); str(v.one_line, 40, 'verdict.one_line'); str(v.why, 120, 'verdict.why');
  const mc = plan.map_check || {}; if ((mc.must_have || []).length + (mc.prefer || []).length < 2) E('map_check: at least 2 must_have/prefer items'); str(mc.no_go, 60, 'map_check.no_go'); str(mc.fallback, 60, 'map_check.fallback');
  if (arr(plan.kit_levers, MIN.levers, 'kit_levers')) { const srcs = new Set(); plan.kit_levers.forEach((k, i) => { if (!SOURCES.has(k.source)) E(`kit_levers[${i}].source invalid`); srcs.add(k.source); str(k.name, 3, `kit_levers[${i}].name`); str(k.buys, 40, `kit_levers[${i}].buys`); str(k.exploit, 60, `kit_levers[${i}].exploit`); if (refs.civNames && k.name && !refs.civNames.has(k.name)) W(`kit_levers[${i}].name "${k.name}" is not a name in civ-info`); }); if (!srcs.has('leader_ability') || !srcs.has('civ_ability')) E('kit_levers must cover leader_ability and civ_ability'); }
  // shape block
  const key = SHAPE_KEY[plan.shape]; const sb = plan.shape_block || {};
  const keys = Object.keys(sb); if (keys.length !== 1 || keys[0] !== key) E(`shape_block must have exactly one key "${key}" (has ${keys.join(',') || 'none'})`);
  const checkShape = (k, b, path) => {
    if (!b) { E(`${path}: missing`); return; }
    for (const f of SHAPE_FIELDS[k]) if (b[f] == null) E(`${path}.${f}: required`);
    if (k === 'monitor' && b.bands) for (const band of ['green', 'amber', 'red']) { const x = b.bands[band]; if (!x) E(`${path}.bands.${band}: required`); else { str(x.test, 15, `${path}.bands.${band}.test`); str(x.response, 40, `${path}.bands.${band}.response`); } }
    if (k === 'monitor' && b.second_watch) { str(b.second_watch.stat, 10, `${path}.second_watch.stat`); str(b.second_watch.why, 20, `${path}.second_watch.why`); }
    if (k === 'countdown') { int(b.deadline_turn, `${path}.deadline_turn`); int(b.midpoint_turn, `${path}.midpoint_turn`); if (!(b.midpoint_turn < b.deadline_turn)) E(`${path}: midpoint_turn must be before deadline_turn`); if (Number.isInteger(refs.convertBy) && Math.abs(b.deadline_turn - refs.convertBy) > 10) W(`${path}.deadline_turn ${b.deadline_turn} is far from tags convert_by ${refs.convertBy}`); }
    if (k === 'gate') { if (arr(b.fastest_path, 1, `${path}.fastest_path`)) b.fastest_path.forEach((id, i) => { if (!refs.boostIds.has(id)) E(`${path}.fastest_path[${i}] unknown boost id "${id}"`); }); if (!b.estimated_arrival || !Number.isInteger(b.estimated_arrival.from) || !Number.isInteger(b.estimated_arrival.to)) E(`${path}.estimated_arrival {from,to} integers required`); arr(b.staging, 3, `${path}.staging`); }
    if (k === 'dead_phase') { int(b.activation_turn, `${path}.activation_turn`); if (Number.isInteger(refs.activationTurn) && Math.abs(b.activation_turn - refs.activationTurn) > 10) W(`${path}.activation_turn ${b.activation_turn} is far from supplemental ${refs.activationTurn}`); arr(b.stockpile, 2, `${path}.stockpile`); arr(b.progress_markers, 2, `${path}.progress_markers`); str(b.flatness_statement, 60, `${path}.flatness_statement`); }
    if (k === 'front_load') { arr(b.turn_zero, 3, `${path}.turn_zero`); if (arr(b.irreversibles, 2, `${path}.irreversibles`)) b.irreversibles.forEach((x, i) => { str(x.decision, 15, `${path}.irreversibles[${i}].decision`); int(x.by_turn, `${path}.irreversibles[${i}].by_turn`); }); }
    if (k === 'linear') { const d = b.direction || {}; if (arr(d.options, 2, `${path}.direction.options`)) d.options.forEach((o, i) => { if (!VICTORIES.has(o.victory)) E(`${path}.direction.options[${i}].victory invalid`); str(o.when_it_fits, 30, `${path}.direction.options[${i}].when_it_fits`); }); int(d.choose_by, `${path}.direction.choose_by`); str(d.commit_test, 30, `${path}.direction.commit_test`); }
  };
  if (key && sb[key]) checkShape(key, sb[key], `shape_block.${key}`);
  if (plan.secondary_shape) { const k2 = SHAPE_KEY[plan.secondary_shape]; const sb2 = plan.secondary_shape_block || {}; if (!sb2[k2]) E(`secondary_shape_block.${k2}: required for secondary shape ${plan.secondary_shape}`); else checkShape(k2, sb2[k2], `secondary_shape_block.${k2}`); }
  // phases
  const phaseIds = new Set(); let cpTotal = 0, taskTotal = 0; const taskIds = new Set(); const referencedBoosts = new Set();
  if (arr(plan.phases, MIN.phases[0], 'phases')) {
    if (plan.phases.length > MIN.phases[1]) E(`phases: at most ${MIN.phases[1]}`);
    let prevTo = 0;
    plan.phases.forEach((p, i) => {
      const P = `phases[${i}]`;
      if (!/^[a-z0-9-]+$/.test(String(p.id)) || phaseIds.has(p.id)) E(`${P}.id: unique kebab-case id required`); phaseIds.add(p.id);
      str(p.name, 3, `${P}.name`); str(p.objective, 60, `${P}.objective`);
      const t = p.turns || {}; int(t.from, `${P}.turns.from`); if (t.to !== null && !Number.isInteger(t.to)) E(`${P}.turns.to: integer or null`);
      if (i === 0 && t.from !== 1) E(`${P}.turns.from must be 1`); if (i > 0 && t.from !== prevTo + 1) E(`${P}.turns.from must be ${prevTo + 1} (contiguous)`); if (i === plan.phases.length - 1 && t.to !== null) E(`${P}.turns.to must be null on the last phase`); if (t.to !== null && t.to < t.from) E(`${P}.turns: to before from`); prevTo = t.to;
      if (!refs.eras.has(p.era)) E(`${P}.era "${p.era}" invalid`);
      if (arr(p.build_order, i === 0 ? MIN.firstBuild : MIN.build, `${P}.build_order`)) p.build_order.forEach((b, j) => { if (typeof b === 'string') { if (b.length < 3) E(`${P}.build_order[${j}] too short`); } else { str(b.item, 3, `${P}.build_order[${j}].item`); } });
      const hasLateEra = ['atomic', 'information', 'future'].includes(p.era);
      if (arr(p.research, hasLateEra ? 0 : MIN.research, `${P}.research`)) p.research.forEach((r, j) => { if (!refs.boostIds.has(r.id) || !String(r.id).startsWith('tech:')) E(`${P}.research[${j}] unknown tech id "${r.id}"`); referencedBoosts.add(r.id); });
      if (arr(p.civics, hasLateEra ? 0 : MIN.civics, `${P}.civics`)) p.civics.forEach((c, j) => { if (!refs.boostIds.has(c.id) || !String(c.id).startsWith('civic:')) E(`${P}.civics[${j}] unknown civic id "${c.id}"`); referencedBoosts.add(c.id); });
      if (arr(p.policies, 1, `${P}.policies`)) p.policies.forEach((c, j) => { str(c.card, 3, `${P}.policies[${j}].card`); if (!['military', 'economic', 'diplomatic', 'wildcard'].includes(c.slot)) E(`${P}.policies[${j}].slot invalid`); });
      if (arr(p.districts, 0, `${P}.districts`)) p.districts.forEach((d, j) => { if (!DISTRICTS.has(d.district)) W(`${P}.districts[${j}] unknown district "${d.district}"`); });
      if (p.pantheon) { if (!refs.pantheonSlugs.has(p.pantheon.slug)) E(`${P}.pantheon.slug "${p.pantheon.slug}" unknown`); str(p.pantheon.why, 10, `${P}.pantheon.why`); if (p.pantheon.alternative && !refs.pantheonSlugs.has(p.pantheon.alternative)) E(`${P}.pantheon.alternative unknown`); }
      if (arr(p.wonders, 0, `${P}.wonders`)) p.wonders.forEach((w, j) => { str(w.name, 3, `${P}.wonders[${j}].name`); str(w.why, 10, `${P}.wonders[${j}].why`); str(w.skip_if, 10, `${P}.wonders[${j}].skip_if`); });
      if (arr(p.governors, 0, `${P}.governors`)) p.governors.forEach((g, j) => { if (!GOVERNORS.has(g.governor)) E(`${P}.governors[${j}] unknown governor "${g.governor}"`); str(g.why, 10, `${P}.governors[${j}].why`); });
      if (arr(p.city_states, 0, `${P}.city_states`)) p.city_states.forEach((c, j) => { if (c.slug && !refs.cityStateSlugs.has(c.slug)) E(`${P}.city_states[${j}] unknown city-state "${c.slug}"`); if (c.type && !refs.cityStateTypes.has(c.type)) E(`${P}.city_states[${j}] unknown type "${c.type}"`); if (!c.slug && !c.type) E(`${P}.city_states[${j}] needs slug or type`); str(c.why, 10, `${P}.city_states[${j}].why`); });
      if (arr(p.great_people, 0, `${P}.great_people`)) p.great_people.forEach((g, j) => { if (!GP_CLASSES.has(g.class)) E(`${P}.great_people[${j}] unknown class "${g.class}"`); str(g.why, 10, `${P}.great_people[${j}].why`); });
      if (arr(p.checkpoints, MIN.checkpointsPerPhase, `${P}.checkpoints`)) p.checkpoints.forEach((c, j) => { int(c.turn, `${P}.checkpoints[${j}].turn`); if (Number.isInteger(c.turn) && (c.turn < t.from || (t.to !== null && c.turn > t.to))) E(`${P}.checkpoints[${j}].turn ${c.turn} outside phase ${t.from}-${t.to}`); str(c.test, 12, `${P}.checkpoints[${j}].test`); str(c.pass, 12, `${P}.checkpoints[${j}].pass`); str(c.fail, 12, `${P}.checkpoints[${j}].fail`); cpTotal++; });
      if (arr(p.tasks, MIN.tasksPerPhase, `${P}.tasks`)) p.tasks.forEach((k, j) => { if (!/^[a-z0-9-]+$/.test(String(k.id)) || taskIds.has(k.id)) E(`${P}.tasks[${j}].id: unique kebab-case id required`); taskIds.add(k.id); str(k.text, 12, `${P}.tasks[${j}].text`); if (k.turn != null) { int(k.turn, `${P}.tasks[${j}].turn`); if (Number.isInteger(k.turn) && (k.turn < t.from || (t.to !== null && k.turn > t.to))) E(`${P}.tasks[${j}].turn ${k.turn} outside phase`); } taskTotal++; });
    });
    if (cpTotal < MIN.checkpointsTotal) E(`checkpoints: at least ${MIN.checkpointsTotal} in total (has ${cpTotal})`);
    if (taskTotal < MIN.tasksTotal) E(`tasks: at least ${MIN.tasksTotal} in total (has ${taskTotal})`);
  }
  // boosts
  const rated = new Set(); let free = 0, cheap = 0;
  if (arr(plan.boosts, MIN.boosts, 'boosts')) plan.boosts.forEach((b, i) => {
    if (!refs.boostIds.has(b.id)) E(`boosts[${i}] unknown id "${b.id}"`); if (rated.has(b.id)) E(`boosts[${i}] duplicate "${b.id}"`); rated.add(b.id);
    if (!FITS.has(b.fit)) E(`boosts[${i}].fit invalid`); if (b.fit === 'free') free++; if (b.fit === 'cheap') cheap++;
    if (b.fit !== 'skip') { if (!(Number.isInteger(b.when) || phaseIds.has(b.when))) E(`boosts[${i}].when must be a phase id or a turn`); str(b.how, 20, `boosts[${i}].how`); }
  });
  if (free < MIN.free) E(`boosts: at least ${MIN.free} rated free (has ${free})`); if (cheap < MIN.cheap) E(`boosts: at least ${MIN.cheap} rated cheap (has ${cheap})`);
  for (const id of referencedBoosts) if (!rated.has(id) && !refs.noBoost.has(id)) E(`boost "${id}" appears in a research/civics path but is not rated in boosts`);
  for (const b of plan.boosts || []) if (refs.noBoost.has(b.id)) E(`boosts: "${b.id}" has no Eureka or Inspiration to collect; remove it`);
  if (arr(plan.decision_triggers, MIN.triggers, 'decision_triggers')) plan.decision_triggers.forEach((t, i) => { str(t.name, 5, `decision_triggers[${i}].name`); str(t.if, 20, `decision_triggers[${i}].if`); str(t.then, 20, `decision_triggers[${i}].then`); });
  const ab = plan.abort || {}; str(ab.trigger, 30, 'abort.trigger'); arr(ab.actions, 2, 'abort.actions');
  str(plan.fail_state, 80, 'fail_state'); arr(plan.common_mistakes, MIN.mistakes, 'common_mistakes'); arr(plan.sources, 1, 'sources');
  return { errors, warnings };
}

/** Builds the reference sets from the raw data files; shared by the CLI and the build. */
function buildRefs(data) {
  const { eurekas, pantheons, wonders, cityStates, eras } = data;
  return {
    boostIds: new Set([...eurekas.techs.map(t => 'tech:' + t.id), ...eurekas.civics.map(c => 'civic:' + c.id)]),
    noBoost: new Set([...eurekas.techs.filter(t => !t.eureka).map(t => 'tech:' + t.id), ...eurekas.civics.filter(c => !c.inspiration).map(c => 'civic:' + c.id)]),
    pantheonSlugs: new Set(pantheons.pantheons.map(p => p.slug)),
    wonderSlugs: new Set(wonders.wonders.map(w => w.slug)),
    cityStateSlugs: new Set(cityStates.city_states.map(c => c.slug)),
    cityStateTypes: new Set(cityStates.types.map(t => t.type)),
    eras: new Set(eras.eras.map(e => e.slug).concat(['future'])),
  };
}
module.exports = { validatePlan, buildRefs, SHAPE_KEY, MIN };
