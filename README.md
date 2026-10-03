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
| Leader page | Eight tabs, each its own page: Overview, Plan, History, Kit, Ground, World, Barbarians and Shape. The URL carries the tab (`#/leader/<slug>/<tab>`), so a tab can be linked to and the back button moves between tabs |
| Plan tab | The leader's own plan: verdict and map check, what each ability buys, the shape block (the stat to watch, the deadline, the gate, the activation turn, the turn-0 test or the direction decision), four to six phases with build order, research and civics with their Eurekas and Inspirations, policy cards, districts, wonders, governors, city-states, great people, checkpoints and tasks, a tracker for every boost the kit reaches, decision triggers, abort branch and fail state. Pick the game speed and difficulty and every turn number rescales; type the turn you are on and the current phase, due tasks and next checkpoint light up; ticks are remembered in the browser; the JSON can be downloaded or copied |
| Natural wonders | All 37 wonders, their yields, the real place, and the leaders who want them |
| Eras | The eight world eras, Era Score, the four Ages and every Dedication |
| Barbarians | Outpost mechanics, the seven clans of Barbarian Clans mode, strategy by power curve and by leader |
| City-states | All 48 city-states by type with suzerain bonuses and envoy rules |
| Pantheons | All 25 pantheons, the terrain each one wants, and the leaders that take them |
| Terrain | The 24 terrain types and features with yields, movement, appeal and adjacency |
| Find my leader | A five-question quiz scored on focus, curve, conversion, shape and condition cost |
| Credits | Every historical image with its Commons source, licence and author |

Search (press `/`) covers leaders, their plans, wonders, city-states, pantheons,
terrain, eras, dedications and clans.

## Layout

```
docs/                     the published site (plain HTML, CSS and ES modules; no build tool)
  data/leaders.json       one record per leader, generated (with a plan summary)
  data/plans/<slug>.json  one plan per leader, generated from the source plans, downloadable from the Plan tab
  data/codex.json         wonders, barbarians, eras, city-states, pantheons, terrain, eurekas, credits, generated
  images/                 54 portraits, badges, Commons heroes and wonders, 24 generated terrain tiles
leadership-focus/
  data/                   source data: tags, caveats, guide templates, supplemental, civ-info,
                          leadership-focus-history.json (era, country, dates, personality, codex bios),
                          civ6/ (natural wonders, barbarians, eras, city-states, pantheons, terrain,
                          leader affinities, eurekas: every technology and civic with its boost),
                          plans/<slug>.json (the 54 hand-written leader plans),
                          image manifests and image-credits.json
  scripts/build-guides.js       renders the 54 guides from the templates
  scripts/validate-plans.js     checks every plan against the schema in scripts/lib/plan-rules.js
  scripts/build-site-data.js    joins everything into docs/data/*.json (validating the plans again)
  scripts/check-motion.mjs      drives the site in headless Chromium: rows move, hero rotates, tabs swap, plan state keeps
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
node scripts/validate-plans.js
node scripts/build-site-data.js
```

The last script warns about any leader without history, affinities or a plan, any
wonder, pantheon, terrain or boost id it cannot resolve, any plan that fails the
schema (such a plan is dropped from the site rather than shipped broken), and any
missing image. A clean run prints no warnings.

## The plans

Each leader has a plan in `leadership-focus/data/plans/<slug>.json`, written for
Gathering Storm with every expansion, Standard speed, Emperor, and rescaled by the
site for other speeds and difficulties (the factors live in the guide templates'
`meta.timing_adjustments`). A plan is the specific case of its leader's guide shape:
a Monitor plan carries the watched stat and its bands, a Countdown plan its deadline
and midpoint, a Gate plan the gate and the fastest path to it, a Dead-Phase plan its
activation turn and stockpile, a Front-Load plan its turn-0 tests and irreversible
decisions, a Linear plan the direction decision. The schema and the minimum content
a plan must carry (phases, build orders, boosts, checkpoints, tasks, triggers) are
enforced by `scripts/lib/plan-rules.js`; `node scripts/validate-plans.js --only=<slug>`
checks one plan while it is being written. Boost ids are `tech:<slug>` and
`civic:<slug>` from `data/civ6/eurekas.json`, which lists every technology's Eureka
and every civic's Inspiration.

Every plan has been fact-checked once against Gathering Storm. What the reviewer could
not confirm (rules, rough numbers, places where `civ-info` and the game disagree) is
listed per leader in `leadership-focus/PLAN-REVIEW-NOTES.md`, for checking by hand.

To check the site in a browser (Playwright and Chromium needed):

```
node leadership-focus/scripts/check-motion.mjs
```

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
