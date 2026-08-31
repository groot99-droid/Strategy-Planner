# Amanitore — Strategic Planning Guide

## Civilization VI Profile

**Civilization:** Nubia  |  **Leader Title:** Kandake of Meroë
**Source:** Rise and Fall

**Leader Ability — Kandake of Meroë**
Cities gain a solid Production bonus toward Districts, which increases further in cities where a Nubian Pyramid is adjacent to the City Center, pushing Nubia toward rapid, district-heavy cities.

**Agenda — City Planner**
Amanitore tries to build as many districts as possible in her cities and favors other leaders who also prioritize dense district development.

**Civilization Ability — Ta-Seti**
Nubia gets extra Production toward Ranged units, and those units earn combat experience faster than normal. Mines also yield bonus Production on strategic resources and bonus Gold on luxury resources, tying the civilization's military and economic strength together.

**Unique Units**
- Pitati Archer (replaces Archer) — A stronger, faster Ancient-era ranged unit that synergizes with Nubia's Ranged-unit production and experience bonuses for early ranged-rush strategies.

**Unique Infrastructure**
- Nubian Pyramid (Improvement) — A unique tile improvement (unlocked with Masonry) that generates Faith and gains extra yields when placed next to the City Center or other districts, rewarding compact, district-rich cities.

### Historical Background
Amanitore was a Kandake (ruling queen) of the Kingdom of Kush, centered at Meroë in what is now Sudan, reigning in the 1st century CE alongside her co-ruler Natakamani. Nubian kandakes held real political and sometimes military authority, a tradition distinct from many neighboring cultures, and several are remembered leading armies in defense of their kingdom. Amanitore and Natakamani presided over an extensive building program, constructing and restoring temples and pyramids at Meroë, Naqa, and elsewhere, which is echoed in-game by the civilization's pyramid improvement and its strong bias toward dense urban district construction.

---

## Leadership Focus Guide

**Shape:** Front-Load (secondary: Countdown)
**Curve:** Spike | **Conversion:** Permanent | **Condition cost:** Nubian Pyramids want desert-adjacent placement
**Convert by:** turn 100

> Nearly every decision that matters is made in the first twenty turns and cannot be reversed. Guide density should be inverted: dense at the start, sparse after.

### Alt-shape note
Pyramid siting (turn 0-10, irreversible) is Front-Load in character and IS her caveats.json primary shape. The Pitati Archer window (turn ~20-60, expiring) is Countdown-shaped and layers on top of it.

**Render rule:** Render the Front-Load template as the spine (already primary). After 'Turns 1-20 — Commit', insert template.Countdown.structure[1] (Phase 2 — Window) as an embedded sub-phase covering the archer window, before proceeding to Front-Load's 'Turns 20-80 — Execute'.

### Turn 0 — Assessment
*Turns: before the first Settler moves*

A genuine go or no-go on the start position. This phase exists only in this shape and it is the most valuable thing in the template.

- Check the hard requirement: Nubian Pyramids want desert-adjacent placement
- If the requirement is absent within a reasonable walk, decide now whether to move the Settler or play the leader as a generic civ. Deciding this at turn 40 is deciding it too late.
- Estimate the ceiling. For radius- and continent-capped leaders, the ceiling is knowable early and determines the victory path.

### Turns 1-20 — Commit
*Turns: 1 to 20*

Make every irreversible decision deliberately rather than incidentally.

- Draw the full settle map before the second Settler is produced, including sites you will not reach for 40 turns.
- Assign district roles to each city site at settle time, not at build time. For placement-restricted leaders this is the whole game.
- Mark each decision with its reversibility. The guide should say plainly which choices are permanent.
- Pyramid siting resolved before the first district is queued anywhere.

### Turns 20-80 — Execute
*Turns: 20 to 80*

Build out the plan drawn in the commit phase. Low decision density by design.

- Follow the settle map. Deviation is the common failure, and it usually feels reasonable at the time.
- Infrastructure snowball off permanently cheaper districts.

### Turn 80+ — Live With It
*Turns: 80 onward*

Operate inside the ceiling set at turn 20.

- Choose a victory path that fits the ceiling rather than fighting it.
- Strong generic empire; the military identity is long gone.

### Abort branch
**Trigger:** Turn 0 assessment fails and no acceptable alternative start is within reach.
- Play the leader as a generic civ and say so explicitly. A named fallback is better than a strategy that quietly cannot work.
- Target a faster victory, since the capped ceiling will not win a long game.

### Fail state
A placement decision made before turn 20 has capped the game, and the cap will not be visible until roughly turn 100. Nubian Pyramid placement is permanent. A bad early siting is a permanent tax.

### Caveats
- Nubian Pyramid placement is permanent. A bad early siting is a permanent tax.
- Pitati Archers fall off hard once Crossbowmen exist; the window is narrower than it feels.
- The district production discount does nothing for purchased districts.

### Guide must account for
- Pyramid siting resolved before the first district is queued anywhere.
- An explicit archer-window countdown tied to opponent tech, not turn number.
- The pivot turn from military production to district spam.
