#!/usr/bin/env node
/**
 * Leadership Focus — guide builder
 *
 * Joins:
 *   leadership-focus-tags.json          (axis data: curve/conversion/condition_cost/convert_by)
 *   leadership-focus-caveats.json       (era_role, caveats, guide_must_account_for, guide_shape)
 *   leadership-focus-guide-templates.json (6 shape skeletons + worked examples)
 *   leadership-focus-supplemental.json  (missing slots + alt_shape rules + name normalization)
 *
 * Output:
 *   /output/guides/<name_key>.md   — one rendered guide per leader
 *   /output/build-log.json         — join diagnostics: matched/unmatched/slot gaps
 *
 * Usage: node build-guides.js [--data-dir=./data] [--out-dir=./output]
 */

const fs = require('fs');
const path = require('path');

// ---------- CLI args ----------
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const DATA_DIR = args['data-dir'] || '.';
const OUT_DIR = args['out-dir'] || './output';
const GUIDES_DIR = path.join(OUT_DIR, 'guides');

// ---------- name normalization ----------
function normalizeKey(raw) {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')      // strip parenthetical suffixes
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------- load ----------
function load(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing required file: ${p}`);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
  const tagsData = load('leadership-focus-tags.json');
  const caveatsData = load('leadership-focus-caveats.json');
  const templatesData = load('leadership-focus-guide-templates.json');
  const supplementalData = load('leadership-focus-supplemental.json');

  const buildLog = {
    generated_at: new Date().toISOString(),
    matched: [],
    unmatched_in_tags: [],
    unmatched_in_caveats: [],
    unresolved_slots: [],
    alt_shapes_applied: [],
    warnings: []
  };

  // ---------- index tags by name_key ----------
  const tagsByKey = new Map();
  for (const leader of tagsData.leaders) {
    tagsByKey.set(normalizeKey(leader.name), leader);
  }

  // ---------- index caveats by name_key ----------
  const caveatsByKey = new Map();
  for (const leader of caveatsData.leaders) {
    caveatsByKey.set(normalizeKey(leader.name), leader);
  }

  // ---------- index supplemental lookups ----------
  const altShapeByKey = new Map(
    supplementalData.alt_shapes.map(a => [a.name_key, a])
  );
  const gateSupByKey = new Map(
    supplementalData.gate_supplements.map(s => [s.name_key, s])
  );
  const monitorSupByKey = new Map(
    supplementalData.monitor_supplements.map(s => [s.name_key, s])
  );
  const deadphaseSupByKey = new Map(
    supplementalData.deadphase_supplements.map(s => [s.name_key, s])
  );

  // ---------- reconcile the two primary key sets ----------
  const allKeys = new Set([...tagsByKey.keys(), ...caveatsByKey.keys()]);
  for (const key of allKeys) {
    if (!tagsByKey.has(key)) buildLog.unmatched_in_tags.push(key);
    if (!caveatsByKey.has(key)) buildLog.unmatched_in_caveats.push(key);
  }

  // ---------- template lookup by shape name ----------
  const templates = templatesData.templates;

  // ---------- slot filler ----------
  function fillSlots(text, ctx) {
    if (typeof text !== 'string') return text;
    return text.replace(/\{\{([\w.\[\]0-9]+)\}\}/g, (match, path) => {
      const resolved = resolvePath(ctx, path);
      if (resolved === undefined || resolved === null) {
        buildLog.unresolved_slots.push({ leader: ctx.leader, slot: path });
        return `[[UNRESOLVED:${path}]]`;
      }
      return String(resolved);
    });
  }

  function resolvePath(ctx, dotPath) {
    // supports leader, curve, conversion, condition_cost, convert_by,
    // era_role.X, caveats[N], guide_requirements[N], and supplemental keys
    const parts = dotPath.split('.');
    let cur = ctx;
    for (let part of parts) {
      const arrMatch = part.match(/^(\w+)\[(\d+)\]$/);
      if (arrMatch) {
        cur = cur?.[arrMatch[1]]?.[Number(arrMatch[2])];
      } else {
        cur = cur?.[part];
      }
      if (cur === undefined) return undefined;
    }
    return cur;
  }

  function deepFill(node, ctx) {
    if (Array.isArray(node)) return node.map(n => deepFill(n, ctx));
    if (node && typeof node === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(node)) out[k] = deepFill(v, ctx);
      return out;
    }
    return fillSlots(node, ctx);
  }

  // ---------- render one leader ----------
  function renderLeader(key) {
    const tags = tagsByKey.get(key);
    const caveats = caveatsByKey.get(key);

    if (!tags || !caveats) {
      buildLog.warnings.push(`Skipped ${key}: incomplete join (tags=${!!tags}, caveats=${!!caveats})`);
      return null;
    }

    const shape = caveats.guide_shape;
    const template = templates[shape];
    if (!template) {
      buildLog.warnings.push(`Skipped ${key}: unknown guide_shape "${shape}"`);
      return null;
    }

    // build render context
    const ctx = {
      leader: tags.name,
      curve: tags.curve,
      conversion: tags.conversion,
      condition_cost: tags.condition_cost,
      convert_by: tags.convert_by ?? 'n/a',
      era_role: caveats.era_role,
      caveats: caveats.caveats,
      guide_requirements: caveats.guide_must_account_for
    };

    // splice in supplemental slots by shape
    if (shape === 'Gate') {
      const sup = gateSupByKey.get(key);
      if (sup) Object.assign(ctx, sup);
      else buildLog.warnings.push(`Gate leader ${key} has no gate_supplement entry`);
    }
    if (shape === 'Monitor') {
      const sup = monitorSupByKey.get(key);
      if (sup) Object.assign(ctx, sup);
      else buildLog.warnings.push(`Monitor leader ${key} has no monitor_supplement entry`);
    }
    if (shape === 'Dead-Phase') {
      const sup = deadphaseSupByKey.get(key);
      if (sup) Object.assign(ctx, sup);
      else buildLog.warnings.push(`Dead-Phase leader ${key} has no deadphase_supplement entry`);
    }

    // resolve alt-shape splice
    const altRule = altShapeByKey.get(key);
    let secondaryBlock = null;
    if (altRule) {
      if (altRule.primary_shape !== shape) {
        buildLog.warnings.push(
          `${key}: supplemental.alt_shapes.primary_shape ("${altRule.primary_shape}") ` +
          `does not match caveats.guide_shape ("${shape}"). caveats.json wins; fix the supplemental file.`
        );
      }
      if (altRule.secondary_shape === shape) {
        buildLog.warnings.push(`${key}: alt_shape secondary_shape equals primary shape ("${shape}") — skipping secondary splice, this is a data bug.`);
      } else {
        buildLog.alt_shapes_applied.push(key);
        const secondaryTemplate = templates[altRule.secondary_shape];
        secondaryBlock = {
          rule: altRule.render_rule,
          reason: altRule.reason,
          secondary_shape: altRule.secondary_shape,
          secondary_structure: deepFill(secondaryTemplate.structure, ctx)
        };
      }
    }

    const filledTemplate = deepFill(template, ctx);

    return {
      name_key: key,
      leader: tags.name,
      shape,
      alt_shape: altRule ? altRule.secondary_shape : null,
      context: ctx,
      template: filledTemplate,
      secondary: secondaryBlock
    };
  }

  // ---------- render all ----------
  fs.mkdirSync(GUIDES_DIR, { recursive: true });
  const rendered = [];

  for (const key of tagsByKey.keys()) {
    const r = renderLeader(key);
    if (!r) continue;
    rendered.push(r);
    buildLog.matched.push(key);

    const md = toMarkdown(r);
    fs.writeFileSync(path.join(GUIDES_DIR, `${key.replace(/\s+/g, '-')}.md`), md, 'utf8');
  }

  fs.writeFileSync(path.join(OUT_DIR, 'build-log.json'), JSON.stringify(buildLog, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'rendered-guides.json'), JSON.stringify(rendered, null, 2));

  console.log(`Rendered ${rendered.length} guides.`);
  console.log(`Unresolved slots: ${buildLog.unresolved_slots.length}`);
  console.log(`Warnings: ${buildLog.warnings.length}`);
  console.log(`Alt-shape leaders: ${buildLog.alt_shapes_applied.join(', ') || 'none'}`);
  if (buildLog.unmatched_in_tags.length || buildLog.unmatched_in_caveats.length) {
    console.warn('NAME MISMATCHES — check build-log.json:', {
      unmatched_in_tags: buildLog.unmatched_in_tags,
      unmatched_in_caveats: buildLog.unmatched_in_caveats
    });
  }
}

// ---------- markdown renderer ----------
function toMarkdown(r) {
  const c = r.context;
  const lines = [];
  lines.push(`# ${r.leader} — Leadership Focus Guide`);
  lines.push('');
  lines.push(`**Shape:** ${r.shape}${r.secondary ? ` (secondary: ${r.secondary.secondary_shape})` : ''}`);
  lines.push(`**Curve:** ${c.curve} | **Conversion:** ${c.conversion} | **Condition cost:** ${c.condition_cost}`);
  if (c.convert_by !== 'n/a') lines.push(`**Convert by:** turn ${c.convert_by}`);
  lines.push('');
  lines.push(`> ${r.template.principle}`);
  lines.push('');

  if (r.secondary) {
    lines.push(`## Alt-shape note`);
    lines.push(r.secondary.reason);
    lines.push('');
    lines.push(`**Render rule:** ${r.secondary.rule}`);
    lines.push('');
  }

  for (const phase of r.template.structure) {
    lines.push(`## ${phase.phase}`);
    if (phase.turns) lines.push(`*Turns: ${phase.turns}*`);
    if (phase.goal) lines.push(`\n${phase.goal}\n`);
    const steps = phase.steps || phase.per_turn_check || phase.staging_checklist || phase.opening_statement;
    if (Array.isArray(steps)) {
      for (const s of steps) lines.push(`- ${s}`);
    } else if (typeof steps === 'string') {
      lines.push(steps);
    }
    if (phase.checkpoints) {
      lines.push('\n**Checkpoints:**');
      for (const cp of phase.checkpoints) {
        lines.push(`- *${cp.at}*: ${cp.test} → if yes: ${cp.if_yes || cp.actions || 'proceed'}${cp.if_no ? `; if no: ${cp.if_no}` : ''}`);
      }
    }
    lines.push('');
  }

  lines.push('## Abort branch');
  lines.push(`**Trigger:** ${r.template.abort_branch.trigger}`);
  for (const a of r.template.abort_branch.actions) lines.push(`- ${a}`);
  lines.push('');

  lines.push('## Fail state');
  lines.push(r.template.fail_state);
  lines.push('');

  lines.push('## Caveats');
  for (const cv of c.caveats || []) lines.push(`- ${cv}`);
  lines.push('');

  lines.push('## Guide must account for');
  for (const g of c.guide_requirements || []) lines.push(`- ${g}`);
  lines.push('');

  return lines.join('\n');
}

main();
