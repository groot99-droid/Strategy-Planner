#!/usr/bin/env node
/**
 * build-site-data.js — joins every source file into the two JSON files the site reads.
 *
 *   docs/data/leaders.json  one record per leader: tags, guide, Civ VI profile, history,
 *                           affinities, images
 *   docs/data/codex.json    natural wonders, barbarians, eras, city-states, pantheons,
 *                           terrain, image credits, and the roster summary
 *
 * Run build-guides.js first; this script reads its output/rendered-guides.json.
 *   node scripts/build-site-data.js [--data-dir=./data] [--out-dir=../docs/data] [--repo-root=..]
 */
'use strict';
const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([\w-]+)=(.*)$/); return m ? [m[1], m[2]] : [a, true];
}));
const HERE = __dirname;
const DATA = path.resolve(HERE, args['data-dir'] || '../data');
const REPO = path.resolve(HERE, args['repo-root'] || '../..');
const OUT = path.resolve(HERE, args['out-dir'] || '../../docs/data');
const DOCS = path.join(REPO, 'docs');

const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const tags = read(path.join(DATA, 'leadership-focus-tags.json'));
const rendered = read(path.join(HERE, '..', 'output', 'rendered-guides.json'));
const civInfo = read(path.join(DATA, 'leadership-focus-civ-info.json'));
const history = read(path.join(DATA, 'leadership-focus-history.json')).leaders;
const affinities = read(path.join(DATA, 'civ6', 'leader-affinities.json')).affinities;
const wonders = read(path.join(DATA, 'civ6', 'natural-wonders.json'));
const barbarians = read(path.join(DATA, 'civ6', 'barbarians.json'));
const eras = read(path.join(DATA, 'civ6', 'eras.json'));
const cityStates = read(path.join(DATA, 'civ6', 'city-states.json'));
const pantheons = read(path.join(DATA, 'civ6', 'pantheons.json'));
const terrain = read(path.join(DATA, 'civ6', 'terrain.json'));
const creditsPath = path.join(DATA, 'image-credits.json');
const credits = fs.existsSync(creditsPath) ? read(creditsPath) : {};

const CATEGORY = {
  'Military, Movement & Conquest': 'military',
  'Production, Infrastructure & General Yields': 'production',
  'Science & Technological Progression': 'science',
  'Culture, Loyalty & Tourism': 'culture',
  'Faith, Religion & Holy Sites': 'faith',
  'Gold, Trade & Economic Output': 'gold',
};
const normalize = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = s => normalize(s).replace(/\s+/g, '-');

const histBySlug = new Map(history.map(h => [h.slug, h]));
const affBySlug = new Map(affinities.map(a => [a.slug, a]));
const renderedByKey = new Map(rendered.map(r => [normalize(r.leader), r]));
const civByKey = new Map((civInfo.leaders || civInfo).map(c => [normalize(c.name), c]));
const fileExists = rel => fs.existsSync(path.join(DOCS, rel));

const warnings = [];
const leaders = tags.leaders.map(t => {
  const personaMatch = String(t.name).match(/^(.*?)\s*\((.+)\)\s*$/);
  const baseName = personaMatch ? personaMatch[1] : t.name;
  const persona = personaMatch ? personaMatch[2] : null;
  const key = normalize(t.name);
  const r = renderedByKey.get(key) || renderedByKey.get(normalize(baseName));
  const slug = slugify(baseName);
  const h = histBySlug.get(slug);
  const a = affBySlug.get(slug);
  const ci = civByKey.get(key) || civByKey.get(normalize(baseName)) || (r && r.civInfo) || null;
  if (!r) warnings.push(`no rendered guide for ${t.name}`);
  if (!h) warnings.push(`no history for ${slug}`);
  if (!a) warnings.push(`no affinities for ${slug}`);
  const categoryKey = CATEGORY[t.category];
  if (!categoryKey) warnings.push(`unknown category for ${t.name}: ${t.category}`);
  const heroRel = `images/heroes/${slug}.jpg`;
  const hero = fileExists(heroRel) ? heroRel : null;
  const title = (ci && ci.leader_title && !/^none$/i.test(ci.leader_title)) ? ci.leader_title : (h && h.titles && h.titles[0]) || '';
  return {
    slug, name: baseName, persona, fullName: t.name,
    civilization: ci ? ci.civilization : '',
    leaderTitle: title,
    expansionOrigin: (h && h.expansion_origin) || (ci && ci.expansion_origin) || '',
    category: t.category, categoryKey,
    curve: t.curve, conversion: t.conversion,
    conditionCost: t.condition_cost, convertBy: t.convert_by ?? null, note: t.note,
    shape: r ? r.shape : null, altShape: r ? r.alt_shape : null,
    image: `images/${slug}.jpg`,
    hero, heroCredit: hero ? `hero-${slug}` : null,
    categoryBadge: `badges/category/${categoryKey}.jpg`,
    curveBadge: `badges/curve/${String(t.curve).toLowerCase()}.jpg`,
    conversionBadge: `badges/conversion/${String(t.conversion).toLowerCase()}.jpg`,
    era: h ? h.era.label : null,
    region: h ? h.region : null,
    modernCountries: h ? h.modern_countries : [],
    history: h ? {
      wikipediaTitle: h.wikipedia_title, era: h.era, dates: h.dates, polity: h.polity,
      modernCountries: h.modern_countries, region: h.region, titles: h.titles, faith: h.faith,
      personality: h.personality, bio: h.bio_codex, legacy: h.legacy, quote: h.quote,
    } : null,
    affinity: a ? {
      startBias: a.start_bias, biasSource: a.bias_source, terrain: a.terrain_notes,
      naturalWonders: a.natural_wonders, pantheons: a.pantheons, cityStates: a.city_state_priority,
      barbarianStance: a.barbarian_stance, victoryLean: a.victory_lean, rivals: a.rivals,
    } : null,
    civInfo: ci,
    context: r ? r.context : null,
    template: r ? r.template : null,
    secondary: r ? r.secondary : null,
  };
});

// cross-reference: wonders -> leaders that name them in affinities
const wonderSlugs = new Set(wonders.wonders.map(w => w.slug));
for (const l of leaders) {
  if (!l.affinity) continue;
  for (const w of l.affinity.naturalWonders) if (!wonderSlugs.has(w.slug)) warnings.push(`${l.slug}: unknown wonder ${w.slug}`);
}
const pantheonSlugs = new Set(pantheons.pantheons.map(p => p.slug));
for (const l of leaders) {
  if (!l.affinity) continue;
  for (const p of l.affinity.pantheons) if (!pantheonSlugs.has(p.slug)) warnings.push(`${l.slug}: unknown pantheon ${p.slug}`);
}
const terrainSlugs = new Set(terrain.terrain.map(t => t.slug).concat(['river', 'coal', 'iron']));
for (const l of leaders) {
  if (!l.affinity) continue;
  for (const b of l.affinity.startBias.concat(l.affinity.terrain)) if (!terrainSlugs.has(b.terrain)) warnings.push(`${l.slug}: unknown terrain ${b.terrain}`);
}
// images for wonders and sections
for (const w of wonders.wonders) {
  const rel = `images/wonders/${w.slug}.jpg`;
  w.image = fileExists(rel) ? rel : null; w.imageCredit = w.image ? `wonder-${w.slug}` : null;
}
for (const [obj, key] of [[barbarians, 'barbarians'], [eras, 'eras'], [cityStates, 'city-states'], [pantheons, 'pantheons']]) {
  const rel = `images/sections/${key}.jpg`;
  obj.image = fileExists(rel) ? rel : null; obj.imageCredit = obj.image ? `section-${key}` : null;
}
for (const t of terrain.terrain) if (!fileExists(t.image)) warnings.push(`missing terrain tile ${t.image}`);

const roster = {
  count: leaders.length,
  byCategory: Object.fromEntries(Object.values(CATEGORY).map(k => [k, leaders.filter(l => l.categoryKey === k).length])),
  byEra: Object.fromEntries(['Ancient', 'Classical', 'Medieval', 'Renaissance', 'Industrial', 'Modern'].map(e => [e, leaders.filter(l => l.era === e).length])),
  byRegion: leaders.reduce((m, l) => { if (l.region) m[l.region] = (m[l.region] || 0) + 1; return m; }, {}),
  generated: new Date().toISOString().slice(0, 10),
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'leaders.json'), JSON.stringify(leaders, null, 1));
fs.writeFileSync(path.join(OUT, 'codex.json'), JSON.stringify({
  roster, wonders, barbarians, eras, cityStates, pantheons, terrain,
  credits: Object.entries(credits).map(([id, c]) => Object.assign({ id }, c)).sort((a, b) => a.file.localeCompare(b.file)),
  terrainTiles: { note: 'The 24 terrain tiles under images/terrain/ were generated for this site with Higgsfield (FLUX.2) on 2026-10-01 and are not Firaxis assets.' },
}, null, 1));
console.log(`leaders.json: ${leaders.length} leaders (${leaders.filter(l => l.hero).length} with hero images)`);
console.log(`codex.json: ${wonders.wonders.length} wonders, ${cityStates.city_states.length} city-states, ${pantheons.pantheons.length} pantheons, ${terrain.terrain.length} terrain, ${Object.keys(credits).length} credits`);
if (warnings.length) { console.log('Warnings:'); for (const w of warnings) console.log('  ' + w); }
