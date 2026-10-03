#!/usr/bin/env node
/**
 * validate-plans.js — checks every data/plans/<slug>.json against the plan schema and the reference data.
 *   node scripts/validate-plans.js [--data-dir=./data] [--only=<slug>] [--strict]
 * Exits 1 on any error (or any warning with --strict). Also prints which leaders still have no plan, by shape.
 */
'use strict';
const fs = require('fs'); const path = require('path');
const { validatePlan, buildRefs } = require('./lib/plan-rules.js');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const m = a.match(/^--([\w-]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? true] : [a, true]; }));
const DATA = path.resolve(__dirname, args['data-dir'] || '../data');
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const normalize = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = s => normalize(s).replace(/\s+/g, '-');

const tags = read(path.join(DATA, 'leadership-focus-tags.json')).leaders;
const caveats = new Map(read(path.join(DATA, 'leadership-focus-caveats.json')).leaders.map(c => [normalize(c.name), c]));
const supp = read(path.join(DATA, 'leadership-focus-supplemental.json'));
const alt = new Map(supp.alt_shapes.map(a => [a.name_key, a.secondary_shape]));
const activation = new Map(supp.deadphase_supplements.map(d => [d.name_key, d.activation_turn]));
const civInfo = new Map(read(path.join(DATA, 'leadership-focus-civ-info.json')).leaders.map(c => [normalize(c.name), c]));
const refsBase = buildRefs({ eurekas: read(path.join(DATA, 'civ6', 'eurekas.json')), pantheons: read(path.join(DATA, 'civ6', 'pantheons.json')), wonders: read(path.join(DATA, 'civ6', 'natural-wonders.json')), cityStates: read(path.join(DATA, 'civ6', 'city-states.json')), eras: read(path.join(DATA, 'civ6', 'eras.json')) });

function refsFor(t) {
  const key = normalize(t.name); const c = caveats.get(key); const ci = civInfo.get(key);
  const civNames = new Set(); if (ci) { for (const k of ['leader_ability', 'civ_ability', 'agenda']) if (ci[k] && ci[k].name) civNames.add(ci[k].name); for (const u of (ci.unique_units || []).concat(ci.unique_infrastructure || [])) civNames.add(u.name); }
  return Object.assign({ slug: slugify(t.name), shape: c ? c.guide_shape : null, altShape: alt.get(key) || null, convertBy: t.convert_by ?? null, activationTurn: activation.get(key) ?? null, civNames }, refsBase);
}
const PLANS = path.join(DATA, 'plans'); fs.mkdirSync(PLANS, { recursive: true });
let errorCount = 0, warnCount = 0; const missing = {}; let checked = 0;
for (const t of tags) {
  const refs = refsFor(t); if (args.only && refs.slug !== args.only) continue;
  const file = path.join(PLANS, refs.slug + '.json');
  if (!fs.existsSync(file)) { (missing[refs.shape] = missing[refs.shape] || []).push(refs.slug); continue; }
  let plan; try { plan = read(file); } catch (e) { console.log(`${refs.slug}: ERROR invalid JSON (${e.message})`); errorCount++; continue; }
  const { errors, warnings } = validatePlan(plan, refs); checked++;
  for (const e of errors) console.log(`${refs.slug}: ERROR ${e}`); for (const w of warnings) console.log(`${refs.slug}: warn ${w}`);
  errorCount += errors.length; warnCount += warnings.length;
  if (!errors.length) console.log(`${refs.slug}: ok${warnings.length ? ` (${warnings.length} warnings)` : ''}`);
}
const known = new Set(tags.map(t => slugify(t.name)));
for (const f of fs.readdirSync(PLANS)) if (f.endsWith('.json') && !known.has(f.replace(/\.json$/, ''))) { console.log(`${f}: ERROR plan file has no leader`); errorCount++; }
const missingCount = Object.values(missing).reduce((n, l) => n + l.length, 0);
console.log(`\n${checked} plans checked, ${errorCount} errors, ${warnCount} warnings, ${missingCount} leaders without a plan.`);
for (const [shape, list] of Object.entries(missing)) console.log(`  missing ${shape} (${list.length}): ${list.join(', ')}`);
process.exit(errorCount || (args.strict && warnCount) ? 1 : 0);
