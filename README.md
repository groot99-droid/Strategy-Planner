# Leadership Focus

A cinematic codex of the 54 Civilization VI leaders. Every leader is filed by
focus, power curve and conversion, then opened up: the history behind the
figure (era, country, dates, titles, temperament), the in-game kit, the terrain
the kit was built for, the natural wonders, pantheons and city-states it wants,
how it should treat barbarians, and the Leadership Focus guide that tells the
player when the plan is dead.

The site is static. It lives in `docs/` and runs on GitHub Pages, or locally:

```
python3 -m http.server 8877 --directory docs
```

## What is in the site

| Page | What it holds |
|---|---|
| Home | A rotating hero, one auto-scrolling row per focus, rows by historical era, and rows for wonders, terrain, city-states and pantheons |
| Leaders | The 54-leader grid with filters for focus, curve, conversion, era and region |
| Leader page | History, Civ VI kit, start-bias terrain tiles, wonders, pantheons, city-state priorities, barbarian stance, rivals, and the guide |
| Natural wonders | All 37 wonders, their yields, the real place, and the leaders who want them |
| Eras | The eight world eras, Era Score, the four Ages and every Dedication |
| Barbarians | Outpost mechanics, the seven clans of Barbarian Clans mode, strategy by power curve and by leader |
| City-states | All 48 city-states by type with suzerain bonuses and envoy rules |
| Pantheons | All 25 pantheons, the terrain each one wants, and the leaders that take them |
| Terrain | The 24 terrain types and features with yields, movement, appeal and adjacency |
| Find my leader | A five-question quiz scored on focus, curve, conversion, shape and condition cost |
| Credits | Every historical image with its Commons source, licence and author |

Search (press `/`) covers leaders, wonders, city-states, pantheons, terrain,
eras, dedications and clans.

## Layout

```
docs/                     the published site (plain HTML, CSS and ES modules; no build tool)
  data/leaders.json       one record per leader, generated
  data/codex.json         wonders, barbarians, eras, city-states, pantheons, terrain, credits, generated
  images/                 54 portraits, badges, Commons heroes and wonders, 24 generated terrain tiles
leadership-focus/
  data/                   source data: tags, caveats, guide templates, supplemental, civ-info,
                          leadership-focus-history.json (era, country, dates, personality, codex bios),
                          civ6/ (natural wonders, barbarians, eras, city-states, pantheons, terrain,
                          leader affinities), image manifests and image-credits.json
  scripts/build-guides.js       renders the 54 guides from the templates
  scripts/build-site-data.js    joins everything into docs/data/*.json
  scripts/fetch-images.py       Commons fetcher (API search, licence check, resize)
  scripts/fetch-images-direct.py  the same with explicit file titles, for when the API throttles
  output/                 rendered guides (markdown and JSON) and the build log
design-system/leadership-focus/   the design system the site is built on, and the research record
Badges/                   original badge art
```

## Regenerating the site data

```
cd leadership-focus
node scripts/build-guides.js --data-dir=./data --out-dir=./output
node scripts/build-site-data.js
```

The second script warns about any leader without history or affinities, any
wonder, pantheon or terrain slug it cannot resolve, and any missing image.
A clean run prints no warnings.

To fetch or refresh imagery (needs network access and ImageMagick):

```
python3 leadership-focus/scripts/fetch-images-direct.py leadership-focus/data/images.direct.json \
  --credits leadership-focus/data/image-credits.json --root .
```

Only files under a free licence (Public domain, CC0, CC BY, CC BY-SA) are
accepted; the credit record is written beside each file and rendered on the
credits page. The 24 terrain tiles under `docs/images/terrain/` were generated
for this site with Higgsfield (FLUX.2) and are not game assets.

## Design

`design-system/leadership-focus/` holds the design system the site follows:
Video Streaming/OTT pattern, Dark Mode (OLED) style, Inter for interface text
and EB Garamond for display and codex prose. `RESEARCH.md` in that folder records
which catalog rows were matched, which decisions were derived, and the two
searches that returned no verified match.

The hero and every row follow the catalog's auto-rotation rule: previous, next
and pause controls, rotation that stops on hover, focus, hidden tab or offscreen,
and no motion at all when the reader prefers reduced motion.

## Sources

Civ VI mechanics were checked against Game Rant, TheGamer, CivFanatics, the
Steam start-bias guide and Eat Your Burger's city-state table. Historical data
comes from Wikipedia and Wikidata. Civilization VI is a trademark of Take-Two
Interactive; this is an unofficial fan guide.
