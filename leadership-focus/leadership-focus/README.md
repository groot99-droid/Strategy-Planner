# Leadership Focus

> **Status, 2026-11-19:** Historical record, kept as written on 2026-08-31. This nested folder is an early copy from the first commit (four data files, one script, its own `output/`); no script, page or workflow reads it. Current state: the maintained pipeline is the parent folder, `leadership-focus/` (see its `README.md`), which has more source data, plan validation and the site build.

Data and build pipeline for the Civ VI Leadership Focus strategy tool.

## Structure

- `data/` — four source JSON files:
  - `leadership-focus-tags.json` — curve / conversion / condition_cost per leader
  - `leadership-focus-caveats.json` — era_role, caveats, guide_shape per leader
  - `leadership-focus-guide-templates.json` — the 6 guide-shape skeletons
  - `leadership-focus-supplemental.json` — missing template slots + alt-shape rules + name normalization
- `scripts/build-guides.js` — joins the four files and renders one markdown guide per leader
- `output/` — generated. `guides/*.md` (54 leaders), `build-log.json` (join diagnostics), `rendered-guides.json` (full structured render)

## Regenerating

```
node scripts/build-guides.js --data-dir=./data --out-dir=./output
```

Zero unresolved slots and zero warnings is the expected clean-build state. Check `output/build-log.json` first if either is nonzero.

## Roster count

54 leaders total (16 Military / 10 Production / 3 Science / 10 Culture / 10 Faith / 5 Gold).
