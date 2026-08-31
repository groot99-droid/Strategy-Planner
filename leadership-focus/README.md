# Leadership Focus

Data and build pipeline for the Civ VI Leadership Focus strategy tool.

## Structure

- `data/` — five source JSON files:
  - `leadership-focus-tags.json` — curve / conversion / condition_cost per leader
  - `leadership-focus-caveats.json` — era_role, caveats, guide_shape per leader
  - `leadership-focus-guide-templates.json` — the 6 guide-shape skeletons
  - `leadership-focus-supplemental.json` — missing template slots + alt-shape rules + name normalization
  - `leadership-focus-civ-info.json` — Civ VI game facts (leader ability, agenda, civilization ability, unique units, unique infrastructure) and historical background per leader
- `scripts/build-guides.js` — joins the five files and renders one markdown guide per leader
- `output/` — generated. `guides/*.md` (54 leaders), `build-log.json` (join diagnostics), `rendered-guides.json` (full structured render)

Each generated guide has two parts:
1. **Civilization VI Profile** — the leader's real in-game ability, agenda, civilization ability, unique units/infrastructure, and a historical-background paragraph on the real figure or civilization. Sourced from `leadership-focus-civ-info.json`.
2. **Leadership Focus Guide** — the abstract loop-strategy guide (unchanged from before), covering curve/conversion/condition cost, phase-by-phase play, abort branch, fail state, and caveats.

## Regenerating

```
node scripts/build-guides.js --data-dir=./data --out-dir=./output
```

Zero unresolved slots and zero warnings is the expected clean-build state. Check `output/build-log.json` first if either is nonzero.

## Roster count

54 leaders total (16 Military / 10 Production / 3 Science / 10 Culture / 10 Faith / 5 Gold).
