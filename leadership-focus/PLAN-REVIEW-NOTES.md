# Plan review notes

Every plan in `data/plans/` had a fact-check against Gathering Storm (with every expansion and the Leader Pass). The reviewer fixed what it was sure of in place. What follows is what it would not change without confirmation: game rules it could not verify, numbers it remembered only roughly, and places where the leader data in `civ-info` and the game seem to disagree.

Check an item in the Civilopedia or in a game, fix the plan if needed, run `node scripts/validate-plans.js --only=<slug>`, and delete the item here.

## Alexander (`alexander`)

- The plan says the Hetairoi upgrade to Coursers, not Knights (rolling-war objective, the Knight build note, the rolling-war-upgrade task and Professional Army). The Hetairoi is heavy cavalry, so its upgrade may be the Knight. Not verified, so left alone.
- The Military Training note says it gives 'Great General points'. I am not sure that civic gives any Great General points itself.
- The Mysticism note says 'skip toward Drama and Poetry for the Great General wonder slots'. The phrase is unclear, and Drama and Poetry has no obvious link to Great General wonder slots.
- Under drama-and-poetry, the boost note says 'or any wonder captured with its city'. The trigger is 'Build a wonder', so a captured wonder may not count.
- The Total War policy note says it gives 'faster siege units'. Doubled pillage yields is right; the siege Production part is unverified.
- Oligarchy, Monarchy and Fascism are governments, not policy cards, but they are listed under policies with slot 'wildcard'. This is the site-wide convention (62 such entries across plans), so it was not changed.
- Amani's Emissary use in a captured city ('Loyalty pressure outward and an envoy') is loosely worded. She counts as envoys only when assigned to a city-state.

## Amanitore (`amanitore`)

- The Nubian Pyramid unlock: the plan and civ-info say Masonry, but I half-remember Bronze Working. Not changed.
- The Nubian Pyramid's Food beside the City Center: the plan says +1, but it may be +2 in Gathering Storm.
- The pantheon note says Desert Folklore Faith 'buys Builders'. Builders cannot be bought with Faith without a Monumentality golden age, which the plan never mentions.
- The Monarchy note says it gives 'the extra Loyalty a wide empire needs'. I am not sure Monarchy has any Loyalty effect in Gathering Storm.
- Rationalism's conditions as stated ('cities of ten or more with adjacency three or more') are not verified against the Gathering Storm numbers.
- Integrated Space Cell: the plan says it is unlocked by Nuclear Program and sits in a Military slot. Both the civic and the slot type are unverified.
- The Great Engineer note says Modern and Atomic Engineers 'finish space projects outright'. They give a large Production lump, but not necessarily a whole project.
- The phrase 'the one that gives district Production is the best one' for a Great Engineer refers to no specific named Great Engineer I can confirm.

## Ambiorix (`ambiorix`)

- Six Gaesatae plus two Archers staged at the target by turn 30 seems ambitious for Emperor capital Production, even with Agoge and God of the Forge. Left as is.
- The Military Tradition note says it gives 'the Great General points and later the Raid card'. Which civic unlocks Raid and Strategos (Military Tradition or Military Training) is unverified, and other plans in the repo disagree.
- The checkpoint says 'there is no Casus Belli this early', but Formal War is available after a denouncement. It depends on whether Formal War counts as a Casus Belli.
- The Nationalism boost says 'Joining an ally's war is a Casus Belli'. It is unverified that joining an ally's war triggers the 'declare war using a Casus Belli' Inspiration.
- The Great Musician note says 'three Great Works of Music per Musician'. I believe most Gathering Storm Musicians carry two.
- The Flight note says Flight is 'the Tourism multiplier for wonders'. I recall Flight adds Tourism from improvements' Culture, not from wonders.
- The Colosseum's Amenity value (+2 here) may be +3. The Hermitage's +3 Great Artist points is unverified.
- The Hallstatt Culture adjacency size (the plan says Mines give adjacency, but not whether minor or major) was not checked further.
- The Stirrups note says it is 'on the way to Castles'. The Castles prerequisites are not confidently known.

## Ba Trieu (`ba-trieu`)

- Thành 'no population requirement' (verdict.why, kit_levers[3], sources[1]): I could not confirm that the Thành is exempt from the specialty-district population cap. Left as written.
- Online Communities is slotted as 'diplomatic'. I lean towards Economic, and Catherine's plan and most other plans say Economic, but I was not confident enough to change it.
- Grand Opera ('Doubles the Culture of Theater Square buildings'), Rationalism and Free Market are described with their base-game effects. In Rise and Fall and Gathering Storm these cards were reworked around district adjacency, but I could not recall the exact Gathering Storm text.
- The Flight phase lists tech:flight first, ahead of Scientific Theory and Economics, which are probably in its prerequisite chain through Replaceable Parts. The plan's own task says 'ahead of every tech it does not require', so I left the order alone.
- A religion founded at turn 70 on Emperor with Sacred Path and two Holy Sites is optimistic; the AI often takes the last Great Prophet before then.
- The Great Prophet by turn 80 and the governor titles needed for Magnus Provision plus Pingala Connoisseur by turn 80, and Grants by turn 150, are plausible but not checked against title sources.
- Literary Tradition and Aesthetics are both given as coming from Drama and Poetry. Recorded History may be the source of Literary Tradition instead.
- Diplomatic Service boost 'A Cultural Alliance': if Cultural Alliances themselves need Diplomatic Service, this Inspiration is unreachable. I am not sure which civic unlocks each alliance type.
- Thành's own ranged attack (decision_triggers[1]) and the Entertainment Complex giving 'Amenities to every city within six tiles' (only its Zoo and Stadium are regional) are loosely worded but were not changed.

## Basil II (`basil-ii`)

- Civic order: military-training sits in the prophet phase and defensive-tactics comes before games-and-recreation in the holy-war phase. I believe both Military Training and Defensive Tactics require Games and Recreation, but I was not sure enough to reorder across phases, which would also move the Games and Recreation boost.
- Nationalism (hippodrome phase) may require The Enlightenment, which this plan only takes in the close phase.
- Siege Tactics is listed before Metal Casting; Siege Tactics may require Metal Casting. Metal Casting's note 'Pike and Shot for the captures' is also unconfirmed, since Pike and Shot may come from another tech.
- Limitanei from Defensive Tactics: most plans agree, but some sources put it at Early Empire.
- Grande Armée effect ('Industrial units faster; Cuirassiers and Field Cannons'): its exact unit-class and era scope is uncertain, and cavalry may be covered by Chivalry instead.
- Whether Byzantium can build ordinary Knights at Stirrups before Divine Right, given that the Tagma is its Knight-line unit, is not settled. The plan keeps 'new Knights only until Divine Right'.
- decision_triggers[3]: whether Porphyrogennetos applies to a religion Byzantium adopted rather than founded is not settled.
- Holy War casus belli against the second civ assumes that civ has converted one of your cities within its window; the plan states that condition only in staging.
- Taxis +3 per Holy City and the location of the Great Prophet points (Taxis or Porphyrogennetos) follow civInfo and were not changed.

## Catherine de Medici (Black Queen) (`catherine-de-medici`)

- Goddess of Festivals: the plan and the repo's pantheons.json say +1 Culture from Plantations. I recall the Gathering Storm pantheon as +1 Food from Plantations, with Oral Tradition giving the Culture. Left unchanged because the plan matches the repo vocabulary.
- tech:flight note 'Châteaux and every wonder tile start producing Tourism': I believe wonders give Tourism without Flight and only Culture-yielding improvements need Flight, but I was not certain.
- Spy capacity: 'Second Spy slot filled' at turn 130 and 'a third Spy slot' from Diplomatic Service at turn 140 do not add up if only Castles (Catherine) and Diplomatic Service add capacity this early. I am unsure of the full list of capacity sources.
- Diplomatic Service Inspiration 'Form an alliance': unsure which civic unlocks Cultural and Research alliances. If either needs Diplomatic Service, the boost order is off.
- decision_triggers[1] 'the Production carries over inside an era' when switching wonders: Civilization VI keeps progress on each item, and I am not sure progress transfers between wonders.
- Gothic Architecture '+15% toward Ancient through Renaissance wonders': the exact era range may be Medieval and Renaissance only.
- boosts civic:civil-engineering: 'the usual five' specialty districts is unclear, since France has no Holy Site here and Aqueduct and Neighborhood are not specialty districts.
- Pingala Curator 'once the sixth title lands' does not obviously match the title count used by this plan's governors.
- Alhambra 'Encampment adjacency', Torre de Belém from Mercantilism, Meenakshi Temple at Civil Service, Broadway's slots and Rock Bands at Cold War were not confirmed and were left as written.
- Online Communities is slotted as 'economic' here and 'diplomatic' in Ba Trieu's plan. I lean Economic but did not change either.

## Chandragupta (`chandragupta`)

- Varu upgrade path: the plan says the Varu does not upgrade to the Knight but goes to the Cuirassier at Military Science (research note for Stirrups, closing_window, sources). I could not confirm the Gathering Storm upgrade target, so I left it.
- Dharma in Gathering Storm: the claims of +1 Amenity per religion with a follower, and of +2 Missionary spreads and +100% Trade Route pressure in the sources, could not be confirmed. The plan's Amenity-from-every-religion logic depends on them.
- Stepwell yields: the claim of +1 Faith at Feudalism and +1 Food at Professional Sports in kit_levers and the Feudalism note is unverified.
- Amani 'Emissary' in the forward city making each target city lose 2 Loyalty a turn within nine tiles (strike phase governors): I am not sure any Amani title does this, or that Emissary works outside a city-state.
- Preslav suzerain bonus: the plan says light and heavy cavalry get +5 Combat Strength on hills. The repo's city-states.json says +2 Loyalty per Encampment building. I am not confident which is right, so I left it.
- Defensive Tactics note says it unlocks the Reconquest casus belli; I believe it unlocks Formal War. The Diplomatic Service note credits Holy War to Diplomatic Service. I am unsure of both unlocks.
- Chandragupta's agenda wording (dislikes civs that settle near his borders, versus civs on his continent) is unverified.
- Terracotta Army skip_if names 'Qin or Pericles'. Pericles is not a known wonder competitor, so this reason is weak but may be intentional.
- The War of Territorial Expansion requirement is described loosely as 'a city close to your border'. The exact in-game condition was not verified.
- Moksha 'Bishop' is described as enabling Faith-bought Temples and Apostles. Those can be bought in any city; Bishop's real effects are religious pressure and Faith per district. I left the wording as not strictly false.
- Oligarchy and Monarchy appear as policy cards with slot 'wildcard'. They are governments, not cards, but this is a schema convention, so I did not change it.

## Cleopatra (Ptolemaic) (`cleopatra`)

- Etemenanki's effect: I believe it is +2 Science and +1 Production on Marsh empire-wide and +1 Science and +1 Production on Floodplains in its own city only. The plan repeatedly says it pays Science on every Floodplain in the empire (verdict.why, direction option, build order, wonder why). If my memory is right, that is wrong and it weakens the Science-direction argument, but I was not confident enough to rewrite it.
- The Arrival of Hapi wording (+1 Food and +1 Culture on Floodplains resources, and +1 Appeal instead of -1) matches the leader record. I could not independently verify it.
- Horseback Riding note: 'the Chariots upgrade along this line'. I am not sure of the Maryannu Chariot Archer's upgrade target in Gathering Storm.
- Whether the Maryannu needs Horses (map_check.prefer says Horses so it is 'built rather than skipped') is unverified.
- International Space Agency is listed from Space Race. I believe it comes from Globalization, but other plans in the repo disagree and I was not certain.
- Satellite Broadcasts is listed as from Cultural Heritage and doubling Music Tourism. Both the source civic and the multiplier are unverified.
- Online Communities is in the Economic slot here and in the Diplomatic slot in Cyrus. I do not know which is correct.
- Mass Media note says it unlocks Broadcast Centers. I believe the Broadcast Center is unlocked by the Radio tech.
- Golden Gate Bridge: Combustion as its tech and the 'canal site' placement are unverified.
- Oxford University 'Great Scientist points' and Computers 'Tourism multiplier' are unverified.
- Iteru flood immunity (sources note) matches my understanding of Gathering Storm, but I did not verify it.
- Diplomatic direction relies on Mahabodhi, Potala and Apadana for Favor; their Gathering Storm Favor or Diplomatic Victory point values are unverified.

## Cyrus (`cyrus`)

- Immortal upgrade target: in Gathering Storm the Swordsman line goes to the Man-at-Arms (Mercenaries). I believe the Immortal does too, which would make the many 'Immortals to Musketmen' statements wrong, but I was not certain enough to change them.
- 'Costing no Iron' for the Immortal (assumptions, kit lever, sources) is unverified for Gathering Storm.
- Raid is listed as coming from Military Tradition. I think it may come from Military Training.
- Online Communities slot is 'diplomatic' here and 'economic' in Cleopatra. I did not change the slot.
- Amani's Loyalty pressure outward from your own city is unverified (same question as in Chandragupta).
- Governor title count: Magnus with Provision plus Victor with Garrison Commander by turns 46 to 90 may need more titles than the civics taken by then provide.
- Colosseum '+2 Amenities and +2 Culture' and Hermitage '+3 Great Artist points' are unverified.
- The Castles note ('Gold from the Pairidaezas' Appeal is not here but Kilwa's line is') is garbled. I do not know Kilwa Kisiwani's unlocking tech well enough to correct it.
- Venice 'suzerain Trade Routes count for Satrapies' capacity' is unclear and unverified.
- Broadcast Center 'Satellites Eureka at two' matches eurekas.json (2 Broadcast Centers), so it is fine. The Mass Media note crediting Broadcast Centers to Mass Media may instead belong to the Radio tech.
- Rationalism is described as Science from Universities in ten-population cities. The exact Gathering Storm thresholds are unverified.
- Apadana is described as 'Persia's own wonder'. Any civilization can build it, though it came with the Persia pack.

## Dido (`dido`)

- Founder of Carthage as the plan uses it: +1 Trade Route per Government Plaza building and 'the capital builds districts half again as fast' (kit_levers[0], verdict.why). This follows leaders.json, but I could not confirm the district Production bonus or the per-building route count against the game.
- Mediterranean Colonies' 'embarked Settlers move faster and see farther at lower cost' follows leaders.json, but I am not certain whether that bonus belongs to the civ ability, the leader ability or neither in Gathering Storm.
- Bireme 'cheaper to build' than a Galley (kit_levers[2].buys, setup build order): the Combat Strength edge is real, but I am not sure about the cost.
- Venetian Arsenal 'the Great Admiral points are free': I believe it gives Great Engineer points, not Admiral points. Not changed.
- Amani Prestige (decide and close phases) used for 'Loyalty outward': I recall Prestige as a city-state envoy promotion, not a Loyalty one. Not confident enough to change.
- Colonial Offices may read 'original Capital's continent'. If so, the plan's claim that it covers the home continent after a capital move (decide checkpoint pass, decision_triggers[3]) would be wrong.
- Exploration Inspiration from Caravels 'upgraded from Biremes': I am not sure upgraded units count toward 'Build 2 Caravels'. The plan also rates Exploration in the overseas phase but builds the Caravels in the decide phase.
- map_check.prefer[2] names Reef for God of the Sea, but Fishing Boats go on sea resources, not Reef features. Left as is.
- Classical Republic and Merchant Republic are listed as wildcard 'policies'. They are governments, but every plan follows this convention.

## Eleanor of Aquitaine (`eleanor-of-aquitaine`)

- The Political Philosophy civic note says 'Classical Republic and the next Governor Title'. I believe Political Philosophy does not grant a title in Gathering Storm; the early titles come from State Workforce, Early Empire, Defensive Tactics and Recorded History. Not confident enough to change it, and another plan in the repo makes the same claim.
- Governments (Classical Republic, Merchant Republic, Democracy) are listed as policies in a 'wildcard' slot. They are governments, not cards, but about 44 entries across the plans do the same, so I left it alone.
- The Mysticism note says it is 'on the way to Drama and Poetry's tree'. Drama and Poetry needs only Early Empire, and Mysticism leads to Theology alongside it. The wording is loose rather than clearly false, so I left it.
- eurekas.json gives the Industrialization Eureka as 'Build 2 Workshops' and the Satellites Eureka as 'Build 2 Broadcast Centers'. The plan follows the file, as instructed. I remember the in-game Industrialization trigger possibly being 3 Workshops, but I did not change the file or the plan.
- Total Governor titles: by about turn 148 the plan has spent eight (Magnus 2, Pingala 4 through Curator, Victor 2 through Garrison Commander). That fits the civic pace I recall, but I did not verify which civics grant titles.
- The Château's Gathering Storm yield details ('Gold beside luxuries'), Heritage Tourism's exact scope, and how many works each Great Artist makes ('two or three') are vague claims that I believe are right but did not check against data.

## Frederick Barbarossa (`frederick-barbarossa`)

- Oligarchy 'three Military slots in total': correct only if Oligarchy has 2 Military slots. I could not confirm its slot layout.
- Monarchy 'a third Military slot': I believe Monarchy already has more than two Military slots, so with Frederick's slot it would be more than a third. Not confident.
- Spaceport 'started' at turn 230 in the industrial phase needs Rocketry (Atomic era) only about 15 turns after Research Labs. That is a stretch on Emperor but not impossible.
- Oxford University 'Great Scientist points' and Rationalism and Free Market 'doubled' wordings: the Gathering Storm values may be +50% with a conditional extra, and I am not certain.
- International Space Agency unlocking from Space Race, and Grand Armée covering Bombards and Cuirassiers: not verified.
- Reyna Tax Collector pays Gold per citizen, not per Commercial Hub. The why does not strictly claim a Hub link, so it was left.
- Formatting: writing with json.dumps(indent=2) as instructed expanded the file's one-line inline objects to multi-line. The content is unchanged.

## Gandhi (`gandhi`)

- Dharma's Gathering Storm additions (an Amenity per religion, extra Missionary spreads, stronger Trade Route pressure) follow leaders.json, and the plan's own sources flag them for checking. I could not confirm them.
- Moksha Patron Saint is a tier-2 promotion used in the contacts phase (by turn 90) alongside Pingala. Whether enough Governor titles exist by then is uncertain.
- Amani Prestige in the close phase for 'Loyalty outward': I recall Prestige as a city-state envoy promotion. Not changed.
- Religious Orders and Simultaneum effects and their civic source (Reformed Church), Gunboat Diplomacy's source and effect ('Favor from the fleet'), and Statue of Liberty's Gathering Storm effect ('Diplomatic Favor every turn and a Settler bonus'): not confident enough to change.
- Varu 'needs no Horses' in Gathering Storm: I believe it is correct but did not verify it.
- Internal tension, not a game fact: Astrology is 'First research' in setup, but its boost says to research it 'late enough' for the Scouts to find a wonder. The Castles boost is rated free on 'any Tier 2 government', while the Divine Right note says to stay in Classical Republic.
- Formatting: writing with json.dumps(indent=2) as instructed expanded the file's one-line inline objects to multi-line. The content is unchanged.

## Genghis Khan (`genghis-khan`)

- The source civics of Raid and Strategos. I believe Raid comes from Military Training and Strategos from Military Tradition, which would make 'Raid from civic:military-tradition' and the military-training note 'Strategos for the General' both wrong. Not changed.
- Siege Tactics is placed in the horde phase (Medieval), but it is a Renaissance tech that I believe requires Metal Casting, which the plan puts in the close phase.
- Whether Stirrups really requires Apprenticeship (first-war note says 'it is a prerequisite of Stirrups').
- Grand Armee (correctly 'Grande Armee'): whether it comes from Nationalism or Mobilization, and whether it covers the cavalry this plan fields. 'Industrial units faster' looks doubtful.
- Whether the Keshig needs Horses in Gathering Storm (the abort branch implies it does), and whether Chivalry's production bonus covers the Keshig.
- Nationalism's prerequisite (I believe it is The Enlightenment, which is not on the path), and whether a Formal War counts as a Casus Belli for its Inspiration.
- Whether Kabul's double experience gets Horsemen to Depredation and Pursuit within one war, and the exact Diplomatic Visibility arithmetic (+12, +15).
- Hattusa's yield in Gathering Storm (city-states.json says 2 per turn, which matches the plan).

## Gilgamesh (`gilgamesh`)

- Whether a Classical Great General's +5 and +1 Movement applies to the War-Cart. I believe the aura covers Classical and Medieval units only, which would exclude Ancient-era War-Carts and Warriors (window great_people says 'since they are Ancient units').
- Whether the Battering Ram is unlocked by Masonry or Bronze Working (arm masonry note and boost say Masonry).
- Whether the War-Cart still has 'no penalty against anti-cavalry' in Gathering Storm, and whether the Ziggurat gains Culture at Natural History.
- 'Horseback Riding ... needed for the Stirrups upgrade later, nothing else': I believe Construction also requires Horseback Riding. Also 'Petra and Apprenticeship behind it [Mathematics]': I believe Apprenticeship hangs off Currency and Mining.
- How long a levy lasts ('levy for ten turns', 'ten turns of six free units'). I recall 30 turns.
- Whether joining an ally's war counts as a Casus Belli for Nationalism's Inspiration, and Colonialism being 'on the way to Nationalism and the Industrial governments' (Tier 3 governments are Modern-era civics).
- 'Every captured city arrives with no districts' is true only for young AI cities. Captured cities keep their districts.
- Source civic and slot of International Space Agency (listed as Nuclear Program, diplomatic).

## Gitarja (`gitarja`)

- Kampung unlock. I am fairly sure (about 85%) that the Kampung is unlocked by Mass Production, not Shipbuilding. If so, the kit lever ('A Shipbuilding improvement', 'not before Shipbuilding is in'), the faith-phase objective, Builder line, Shipbuilding note, checkpoints 55 and 80, and task faith-kampungs (turn 65) all place Kampungs about 40 turns too early, and they belong in the stage phase where Mass Production is researched. Not rewritten because the change would restructure the plan's economic arc.
- Jong unlock. The plan, including its sources line, makes the Mercantilism civic the Jong's unlock and the gate. The Frigate it replaces is a Square Rigging unit, and I could not confirm the civic unlock from memory.
- Faith purchase prices. The staging estimate of about 1,200 Faith per Jong assumes roughly 4x the Production cost; at 2x it would be about 560. The turn-45 Faith-bought Quadrireme may also be early.
- Whether Humanism and Reformed Church require Guilds. If so, Guilds (placed in the jong phase) must come before Mercantilism and Reformed Church in the stage phase, and the gate fastest_path is missing Civil Service and Guilds. Separately, Mass Production may require Education, which is listed after it.
- Moksha: whether Bishop allows Faith purchase of Shrines and Temples (I believe that is a later promotion), and whether Grand Inquisitor gives +10 or +5 Religious Strength.
- Whether Press Gangs covers Ironclads (Industrial era), Grand Opera's slot and effect (listed as wildcard, Great Artist and Musician points), and whether Simultaneum and Religious Orders have the effects stated.
- Whether the Holy War Casus Belli comes with Diplomatic Service (jong civics note), and whether Faith-bought ships are doubled by the Venetian Arsenal.
- Whether a Privateer (naval raider) can capture a city, as gate staging[3] implies.
- Whether the Great Lighthouse counts as a Classical-or-later wonder for the Buttress Eureka (tech:buttress how).

## Gorgo (`gorgo`)

- phases[2].city_states[1] Vilnius 'Theater Square adjacency bonus doubled': city-states.json says +50% at the highest Alliance level. I did not trust either source enough to rewrite it.
- phases[2].civics[4] Divine Right note 'four military-or-wildcard cards at once': this depends on Monarchy's slot layout. With Greece's extra Wildcard it is probably five, but I am not sure of the exact Gathering Storm slots.
- phases[4].policies[1] Online Communities is listed as a diplomatic card. I believe it may be Economic, but I am not confident.
- phases[4].policies[2] Sports Media 'Culture from Stadiums' and its Economic slot: I recall the card doubling Theater Square adjacency and giving Stadiums +1 Amenity, but I am not sure.
- phases[3].research[0] Printing note 'the Tourism from Great Works doubles with Printing's buildings later' and phases[3].research[6] Cartography note 'Tourism from open seas': neither looks like a real mechanic, but I left them because I am not sure what was meant.
- phases[3].civics[0] Humanism note 'the boost pays on the next civic': a boost earned after its civic is finished does not carry over. I left the wording because the intent is unclear.
- phases[2].great_people[1] Medieval Great General 'retires into a free Pikeman', and Great Writer, Artist and Musician work counts ('two works', 'three works each'): these vary by Great Person and I could not check them.
- phases[1].research[6] Mathematics note 'Apprenticeship follows': Apprenticeship needs Currency and Mining, not Mathematics. I left it because it reads as plan order rather than a prerequisite claim.
- Civic paths leave out State Workforce (needed for Political Philosophy and Games and Recreation) and the tech path leaves out Horseback Riding (needed for Construction). Both are rated in boosts for the same phase, so I treated them as implied.

## Hammurabi (`hammurabi`)

- The Palgum's exact stats. The plan, matching civ-info, says it gives more Production and Housing than the Water Mill plus Food on fresh-water tiles. I could not confirm whether it really gives Housing or what its exact placement rule is (river only, or also lake and oasis), so I left this unchanged.
- Ninu Ilu Sirum's Envoy clause (a first district with no building to give pays an Envoy, used for the Aqueduct). This matches civ-info, but I could not confirm the exact in-game wording, so I left it unchanged.
- Sabum Kibittum's exact stats (+1 Movement and Sight, needs no technology). The wording is vague and matches civ-info, so I left it unchanged. Also, the kit lever says 'Two of them' make the Barbarian kills, but the arm build order trains only one. That is an inconsistency inside the plan, not a game error.
- Siege Tactics' prerequisites ('completes once Castles and Metal Casting are in'). I am fairly sure but not certain, so I left it unchanged.
- Which civic unlocks Levee en Masse (the plan says Mobilization) and Heritage Tourism (the plan says Cultural Heritage), and Heritage Tourism's slot (economic). I left these unchanged.
- Craftsmen and Town Charters, both listed as coming from Guilds. I believe this is right but did not change or verify it further.
- The Cultural Heritage boost text says a themed Archaeological Museum needs 'three same-era Artifacts'. The theming rule may also require Artifacts from different civilizations, so I left it unchanged.
- map_check.prefer credits Tsingy de Bemaraha with 'Great Scientist and Great Person points'. In the repo data Tsingy gives Science and Culture to adjacent tiles, not Great Person points, while Zhangye Danxia gives Great General and Great Merchant points. The wording is loose, but I did not rewrite it.
- Autocracy and Merchant Republic are listed as policies with slot 'wildcard'. They are governments, not cards. This is a schema convention, so I left it unchanged.
- The great_people note on the Great General in the harvest phase credits 'Military Training' with earning one. In the game the points come from the Encampment and Barracks, not from the civic. This is loose wording that I did not change.

## Harald Hardrada (`harald-hardrada`)

- Berserker unlock and Iron: phases[1].research[5] says 'Berserkers unlock on the way to it' (Military Tactics), research[2] and checkpoints[1] treat Iron as required, and Magnus Black Marketeer is used to cut the Iron bill. I am not sure whether the Gathering Storm Berserker needs Iron. The checkpoint fallback 'becomes a Swordsman plan' is suspect either way, because Swordsmen also need Iron.
- kit_levers[2]: whether naval melee units can clear a coastal barbarian camp (for Bronze Working and Military Tradition). I believe ships cannot enter the camp tile.
- kit_levers[4] Stave Church 'Production for coastal resources': I am not sure of the Gathering Storm text.
- phases[0].policies: Discipline and Maritime Industries are both military cards with God King economic, but Chiefdom has one military slot. This only works if they are swapped rather than slotted together.
- phases[3].policies[2] Retainers is listed from Feudalism. I think it may come from Civil Service.
- phases[4].policies[0] Grand Armee from Nationalism, while the Colonialism and Mobilization notes say it comes later or with Mobilization. I am not sure which civic unlocks it.
- phases[3].policies[1] Simultaneum 'Faith from Holy Site buildings', and Press Gangs coming from Exploration: not confirmed.
- boosts[53] Exploration 'Two Caravels upgraded from Longships': I am not sure upgrades count toward 'Build 2 Caravels'.
- Magnus Provision is used as an early promotion. If it is a tier-2 promotion, it needs one more governor title than the plan assumes.

## Hojo Tokimune (`hojo-tokimune`)

- Samurai: kit_levers[2] and sources[1] say it unlocks at Military Tactics with no Iron requirement in Gathering Storm. I could not confirm either point.
- phases[3].policies[0] Grand Opera 'Doubles the Culture of Theater Square buildings': I recall it doubling Theater Square adjacency, like a later Aesthetics, but I am not sure.
- phases[4].research[0] Computers 'Tourism up by a quarter the turn it lands': I could not confirm a Tourism bonus on Computers.
- phases[4].policies[1] Online Communities listed as diplomatic, and phases[4].policies[2] Satellite Broadcasts unlocked by Space Race: I am not sure of either.
- Divine Wind is described throughout as 'half price'. The game says 'built in half the time'. The effect is about the same, so I left it.
- phases[0].policies: God King and Ilkum are both economic cards, but Chiefdom has one economic slot. This works only if they are swapped.
- phases[3].build_order[3] Power Plant 'Coal then Oil' and the unlock tech for the Coal Power Plant: not confirmed.
- boosts[56] Drama and Poetry from Apadana or the Colosseum: both come after Political Philosophy or Games and Recreation, which may come after the Theater Square timing the plan wants. I did not change the rating.

## Jadwiga (`jadwiga`)

- Lithuanian Union Relic yields (+4 Gold, +2 Culture, +2 Faith): I may be misremembering the exact numbers.
- Winged Hussar stats: 55 Combat Strength was kept, but GS may give it 64 (versus the Cuirassier's 62).
- Whether Lithuanian Union converts the city to the bombing city's majority religion or to Poland's majority religion.
- Victor's Garrison Commander as his first listed promotion: it is tier 2, after Redoubt. Total governor titles may also be short: by turn 65 the plan needs 3, and by turn 125 Moksha 2, Victor 3 and Magnus 2.
- 'Wars of Religion' as a Reformed Church Military card: I could not confirm it exists in GS.
- Triangular Trade's unlocking civic: the plan says Medieval Faires, but it may be Mercantilism.
- Whether Exploration lies on the way to Reformed Church.
- Grand Master's Chapel unlocking at Divine Right.
- Task 'a Worship building with a Relic slot in mind': I don't think any Worship building has a Relic slot.
- Stirrups 'leads to Castles' was removed only as part of the Hussar rewrite. I did not verify the Castles prerequisites.
- 'A Renaissance General keeps the Hussars at +5': the Hussar is Industrial era, and the General era rule may exclude it.
- Prophet-phase civics list Theology and Military Training without Drama and Poetry or Games and Recreation. Lists elsewhere are not exhaustive, so I left this alone.
- Defensive Tactics rated free because 'it always does' rely on an AI declaration.

## Jayavarman VII (`jayavarman-vii`)

- Mahabodhi 'Diplomatic Favor': GS may grant Diplomatic Victory Points instead.
- Temple of Artemis effect wording ('Housing and Amenities from every Camp and Pasture').
- Whether Scripture doubling adjacency also doubles Monasteries of the King Food.
- Relic base yields including Culture: Relics may give only Faith and Tourism without Jadwiga.
- 'Religious Orders' and 'Simultaneum' as Reformed Church cards, and their effects.
- Moksha Divine Architect (tier 4) in turns 101-170 alongside Magnus, Liang and Pingala: possibly reachable, left as written.
- Liang Water Works effect, which may be Housing from Neighborhoods rather than Aqueducts.
- Stirrups 'on the way to Printing'.
- Monarchy giving 'the Culture to reach Reformed Church'.
- Arena Amenities reaching six tiles.
- International Space Agency unlocked by Space Race, and Faith of the Masses unlocked by Ideology.
- Amani Emissary effect in the spread phase.
- 'a Khmer Holy Site off the river is a plain Holy Site ... a quarter of the Food' overstates the loss (it still gives Food equal to its adjacency and a Culture Bomb), but the ratio is approximate, so I left it.

## Joao III (`joao-iii`)

- Porta do Cerco: the plan reads it as +1 Trade Route capacity for every civilization met, which leaders.json supports. Some versions of the in-game text say capacity is granted when meeting a civilization for the first time, which may mean a single +1. assumptions.notes already flags this, so I left it.
- Navigation School: the plan says +1 Science per two Coast or Lake tiles. I think the game text may say Coast and Ocean tiles, but I am not sure, so I left it (kit_levers[4].buys and sources[3]).
- Feitoria placement: the plan says a Coast or Lake tile next to land and next to a Luxury or Bonus resource, not adjacent to another Feitoria. The Luxury-or-Bonus adjacency and the Lake wording are not confirmed. The yields (+4 Gold, +1 Production) are not stated in the plan.
- Torre de Belém: the plan ties it to Mercantilism (civics note, skip_if). I am not sure whether it unlocks from Mercantilism or from a tech such as Cartography. I also could not confirm whether its +2 Gold per Luxury at the destination applies to every Portuguese international route or only to routes from its own city; the plan assumes its own city. Its placement rule (Coast next to land, possibly not next to a Harbor) is not stated in the plan.
- Irene of Athens as a Great Merchant who adds a Trade Route of capacity (phases[2].great_people[0]). Marco Polo and Zhang Qian are right. I could not confirm Irene's exact Gathering Storm effect; it may be a Governor Title with or without the capacity.
- phases[4].checkpoints[1].fail and decision_triggers[4]: 'vote for Favor on every resolution' is vague about how Diplomatic Victory points or Favor are actually earned from World Congress votes. I left the wording alone.
- The civic and research lists skip some prerequisites, for example Defensive Tactics before Feudalism, Military Training before Mercenaries, and Horseback Riding before Stirrups. These look like highlights rather than complete paths, so I did not add them.
- Classical Republic, Merchant Republic and Democracy are entered as policies with slot 'wildcard'. Governments are not cards; this is how the schema handles them, so I left it. Maritime Industries in phase 1 is a Military card under Classical Republic, which has no Military slot, so it would sit in the Wildcard slot. That is consistent with the card type, but the plan does not say so.

## John Curtin (`john-curtin`)

- Pingala Researcher and Victor Garrison Commander as first listed promotions in the expand phase: both are tier 2, and the title count by turn 80 may be short.
- Great Library effect ('two Eurekas per Classical Great Scientist').
- Whether the Classical Great Scientists really give 'two free boosts' each.
- Wisselbanken effect: Trade Routes to allies or to suzerain city-states.
- Kilwa Kisiwani unlocking at Machinery.
- International Space Agency unlocked by Nuclear Program (the Jayavarman plan says Space Race).
- Darwin on a natural wonder giving 'two Eurekas'.
- 'Research Grants' from Scientific Theory; Steel as 'the Digger line'; Integrated Space Cell slot type.
- Construction 'on the way to Education'.
- Earth Goddess Faith amount: the repo says +1, GS may give +2. The plan states no number.

## Kristina (`kristina`)

- Open-Air Museum: whether it is unlocked by Conservation (the plan's claim) or by another civic such as Humanism or Cultural Heritage, and whether it is really barred from Hills. Left unchanged.
- Carolean: whether it is unlocked by Metal Casting (the plan says so throughout) or by the Pike and Shot's own tech, and whether it really has extra Movement. Left unchanged.
- Apadana: whether its two slots are Great Work of Art slots or two slots of any type.
- Amani 'Prestige' (phase 2): whether that promotion exists in Gathering Storm as written. 'Prestige later holds Loyalty in the border cities' looks wrong, because Loyalty to nearby cities is Emissary's effect (the plan's phase 3 uses Emissary for it).
- Whether Political Philosophy grants a Governor Title, whether the Government Plaza or Audience Chamber grants one, and whether the plan's total title count (Magnus 2, Pingala 4, Amani 1 to 2, Liang 2, Reyna 2 or 3) is reachable by the turns used.
- Heritage Tourism: the plan says +100% Tourism from all Great Works. I believe it covers only Great Works of Art and Artifacts.
- Satellite Broadcasts: the plan says it comes from Cultural Heritage. It may come from a later civic or tech.
- Computers: '+25% Tourism and Culture'. I am not sure Computers gives any Tourism or Culture bonus in Civ VI.
- Flight: 'Tourism from every wonder you own'. I believe Flight instead turns improvements' Culture into Tourism.
- Radio: 'Radio gives Tourism from the Parks'. Not verified.
- Taj Mahal: unlocking civic (plan implies Humanism). Broadway: whether it is unlocked by Mass Media. Eiffel Tower: whether it has a placement rule tied to the Industrial Zone.
- Democracy: 'Tourism from the Theater Squares' projects' is doubtful. 'Patronage' is used throughout as if it were a card or a condition, though buying Great People with Gold is always available.
- Phase 2 civic path lists Exploration without Mercenaries and Military Training, which I believe are its prerequisites. The lists look abridged, so I left them.
- Phase 2 uses Monarchy (1 Economic and 1 Wildcard slot) while listing Serfdom, Meritocracy, Aesthetics and Literary Tradition at once. They cannot all be slotted together, but this may be read as a sequence.
- Queen's Bibliothèque yields: the exact Great Person points, and whether it grants a Governor Title (sources[3] says it does not; the leader record says it does).

## Kupe (`kupe`)

- Marae Tourism after Flight: the plan says +2 Tourism per feature tile (kit_levers[2].buys, flight.research flight.note, flight.tasks flight-flight, options[0], and the 'hundred Tourism' figure). My memory is +1 per tile, equal to its Culture, but I left it unchanged.
- Marae 'no maintenance': not sure whether it keeps the Amphitheater's 1 Gold upkeep.
- Mana details from the leader record: the bonus Combat Strength for embarked units, the Fishing Boat culture bomb, and whether Conservation raises the Woods Production (civic:conservation note 'Mana's Woods Production rises').
- Whether Naturalists can be bought with Gold (economics note, Free Market why). If they are Faith-only, those lines are wrong.
- Flight's prerequisites: if Flight needs Steel and Replaceable Parts, the flight-phase order still lacks Replaceable Parts, which sits in the close phase.
- Governor title budget: Liang (Aquaculture, then Parks and Recreation), Pingala to Curator (a tier-3 promotion), Reyna, Amani, Magnus and Moksha may need more titles than the game gives by turn 200. I did not change it.
- International Space Agency: other plans split between Space Race and Nuclear Program as its civic. Online Communities: other plans split its slot between economic and diplomatic.
- Heritage Tourism may double only Art and Artifact Tourism, not Music, so the 'Museums and Broadcast Centers' wording may overstate it.
- Computers '+25% Tourism' and Golden Gate Bridge 'Appeal and Tourism' effects are not verified.
- Civil Engineering 'Seven district types' Inspiration: the plan names only six specialty district types before Aerodromes (Harbor, Theater Square, Campus, Commercial Hub, Entertainment Complex, Industrial Zone), unless a Holy Site is built.
- God of the Sea by turn 28 from God King alone, after a turn-6 landing, looks tight on Faith.
- Marae-phase Great Admiral 'some grant Great Works or Gold': I can't recall an Admiral that grants a Great Work.
- Rock Band purchase requirement ('any Holy Site or Theater Square city') is not verified.
- Toa unlock at Construction: I am about 80% sure (Swordsman is Iron Working; Toa has no resource and unlocks at Construction). It is applied as a fix above.

## Lady Six Sky (`lady-six-sky`)

- Research and civic lists still leave out several prerequisites that I did not add, because the lists look like highlights rather than complete paths: Iron Working and Engineering for Machinery (Engineering's Eureka is even rated cheap); Defensive Tactics for Feudalism and Civil Service; Military Training and Mercenaries, the civic Professional Army comes from; Theology for Divine Right; Stirrups and Square Rigging for Banking and Industrialization; Mercantilism for Civil Engineering and Colonialism.
- tech:castles is rated free for 'Any Tier 2 government', but the Divine Right note says 'Monarchy or stay Republic'. If the plan stays in Classical Republic (Tier 1), the Castles Eureka never fires.
- civic:social-media is rated free from 'Researching Telecommunications', but Telecommunications is not in any research list. It may not be on the plan's path at all.
- Mayab housing: 'six Farms ... Housing for twelve' depends on whether Mayab's Farm Housing is +1 on top of the base +0.5 per Farm. I left it unchanged.
- Whether the Observatory gets no adjacency at all from Mountains, Rainforest and Reefs (claimed in common_mistakes and sources). I believe it is right but could not confirm it from a primary source.
- Integrated Space Cell's exact Gathering Storm wording (an Encampment condition), Rationalism's thresholds (+3 adjacency or 15 population), and whether Lasers is the tech for the laser-station project. All left as written.
- Colosseum in the circle phase needs an Entertainment Complex beside it, but no Entertainment Complex appears in that phase's build order. The compact-phase line 'Entertainment Complex if the Colosseum was missed' reads oddly for the same reason.
- Religious Settlements' free Settler and Mitla's +15% growth are taken from the repo vocabularies (pantheons.json, city-states.json); I did not check them independently.
- Whether domestic Trade Routes pay the destination city anything in Gathering Storm. I changed the Trader and Currency lines to start the route from the young city, on the understanding that only the starting city gets the yields.

## Lautaro (`lautaro`)

- Toqui is planned as a per-city bonus ('cities with an established Governor', following the site's civInfo). My recollection of the Gathering Storm text is that it reaches all cities within 9 tiles of a governed city: +5% Culture and Production and +25% XP, tripled in cities the Mapuche did not found. If so, the plan's 'a Governor in every city' rule and common_mistakes[0] ('Toqui is per city') overstate the need. I left them because they match the repo's leader data.
- The Governor title budget assumes titles come from State Workforce, Early Empire, Defensive Tactics, Recorded History, Medieval Faires, Guilds, Civil Engineering, Nationalism, Mass Media, Social Media (plus Mobilization and Globalization, which are off the path). The promotion downgrades depend on that list.
- Trade Routes as a source of Loyalty pressure (shape_block amber response, groundwork Trader, Medieval Faires note, the Commercial Hub notes, decision_triggers[2], sources[1]). I know of no Gathering Storm Loyalty effect from Trade Routes, but I did not change these.
- Amani is described as giving 'Loyalty pressure outward' from a border city. I don't recall any Amani ability that adds pressure on other cities.
- Praetorium's slot is left as military. I'm confident it comes from Recorded History, not Defensive Tactics, but not sure of its slot type.
- Castles' prerequisite: I believe it is Construction only, not Military Tactics or Stirrups. I removed the claims that rely on it, but this was not verified against data.
- Kilwa Kisiwani's placement (I believe flat land beside the coast) and its unlocking tech (the plan implies Machinery) were left unchanged.
- 'Oligarchy's legacy card keeps the Combat Strength' (Merchant Republic why): not sure a legacy card works this way in Gathering Storm.
- Printing's 'Culture in every city', Computers' 'Tourism from Culture rises with it', Electricity's 'Power for the Broadcast Centers', Combustion 'on the way to Flight', Environmentalism's 'Appeal on every tile from Preserves and Parks', and the Grove raising Chemamull Appeal: none could be confirmed.
- Whether a National Park can include Chemamull-improved tiles (the 'mountain and Chemamull diamond' wording) was not confirmed.
- The 'Mapuche mountain start bias' in assumptions.map was not confirmed.
- The Rock Band promotion name 'Music Festival' was not confirmed, and neither was the Industrial Great General's 'retire him for the free promotion'.
- Some boost ratings look off but were left alone: Metal Casting is rated costly though the plan builds two Crossbowmen, and Nationalism is rated free though it depends on a war that needs a rival's Golden Age. Flight's Eureka from Eiffel Tower comes after the planned Flight turn (210 vs 225).
- Colosseum skip_if 'Rome is on the map' and Cristo Redentor skip_if 'Flight arrives after turn 240' are kept, though their link to the wonders is weak.

## Ludwig II (`ludwig-ii`)

- The whole plan rests on Swan King paying on wonders that are placed but not finished ('parked'). The leader record says 'finished or still under construction', and the plan follows it, but I could not confirm in-game that an unfinished wonder site gets the +2 Culture per adjacent district. If it does not, the parking strategy (verdict, kit_levers exploit, assumptions.notes, the Monitor block, tasks) needs a rework, not a small edit.
- The agenda name and text ('Eternal Enigma', likes civs that leave district slots unused) come from the leader record. I am not confident this is Ludwig II's real agenda. It may instead be about wonders.
- Mausoleum at Halicarnassus: the plan says it parks 'on water tiles that cost no land' (map_check.prefer and the lay wonder entry). I believe it may go on a coastal land tile next to the Harbor, as the Great Lighthouse does, rather than on a water tile like Torre de Belém. Not changed.
- Hermitage is credited with 'Great Artist points' (tourism wonders). I recall only its 4 Great Work of Art slots. Not changed.
- tech:flight note 'Tourism from Appeal': I believe Flight turns the Culture of improvements into Tourism rather than paying on Appeal. Not changed.
- tech:computers note 'more Tourism from every source': I am unsure Computers itself raises Tourism in Gathering Storm. Not changed.
- Grand Opera described as 'Culture from Theater Square buildings' and Heritage Tourism as 'Tourism from Great Works': I am not sure of the exact Gathering Storm wording (buildings versus adjacency; Art and Artifacts only). Not changed.
- Which civic unlocks a card: the plan places Gothic Architecture at Divine Right, Aesthetics at Medieval Faires, Craftsmen at Guilds, and Invention and Frescoes at Humanism. These look right to me, but I did not verify them against a source; the plan's own sources line says they came from community lists.
- Broadway's effect ('Great Work slots') and its unlock at Mass Media were not verified.
- The research lists leave out prerequisites the path needs: Horseback Riding for Construction, Apprenticeship and Stirrups, and Defensive Tactics for Feudalism and Civil Service. Shipbuilding is rated skip but must still be researched for Buttress. None of this contradicts the plan, since the lists are not exhaustive, but they are not complete paths.
- Monarchy has only one Economic and one Wildcard slot, yet the castles phase lists four Economic cards (Gothic Architecture, Aesthetics, Craftsmen, Serfdom). The plan treats them as swaps, which works, but the slot squeeze is not stated.
- Governments (Classical Republic, Monarchy, Democracy) are listed as policies with slot 'wildcard'. They are governments, not cards, but the schema only accepts the four slot types, so I left them.
- Turn ranges (Medieval era from 91, Renaissance from 156, Industrial from 216) run slow for Emperor at Standard speed but are plausible for a builder. Not changed.
- A rival completing a parked wonder removes the site. Whether the Production stored in it is lost outright or carries over was not confirmed. The plan treats it as lost.

## Mansa Musa (`mansa-musa`)

- phases[4].policies Gunboat Diplomacy 'from: civic:diplomatic-service': Diplomatic Service unlocks Machiavellianism and Wisselbanken. Gunboat Diplomacy is a Modern-era card, I believe from Totalitarianism, and its Gathering Storm Favor effect also needs checking. Left unchanged.
- Governor titles: the plan needs about 5 titles by turn 90 (Reyna plus two promotions to reach Tax Collector, Magnus plus Provision) and about 13 by turn 230 (Moksha to Patron Saint, Amani, Reyna's Contractor and Renewable Subsidizer, Pingala's Researcher). That may be more titles than Gathering Storm grants by those turns, and the exact tiers of Tax Collector, Contractor and Renewable Subsidizer were not verified.
- Reyna's Renewable Subsidizer pays Gold from renewable Power. The plan's only power building is a Coal Power Plant, so the 'Gold from the Power buildings bought later' rationale may not hold.
- phases[1].research tech:celestial-navigation note 'Harbors are more routes': I believe a city gets only one Trade Route capacity from a Commercial Hub or a Harbor, not one from each, so a Harbor in a Suguba city may add none.
- phases[3].build_order Harbor 'Shipyard bought for routes with longer range' and phases[4] Trader 'now that Harbors and Shipyards extend range': I do not think Shipyards extend Trade Route range.
- Free Market's exact Gathering Storm effect ('More Gold from the Suguba buildings') was not verified.
- Whether Ancient Walls can be bought with Gold in Gathering Storm (the plan buys them in several places).
- boosts civic:civil-engineering is rated cheap. Seven specialty districts (Holy Site, Suguba, Campus, Government Plaza, Theater Square, Industrial Zone, plus Harbor) need a coastal city, so it may be costly on an inland map.
- Suguba adjacency details (major bonus from Holy Sites and rivers) and the exact Sahel Merchants and Mandekalu numbers were taken from the civInfo record and memory, not checked against the Civilopedia.

## Matthias Corvinus (`matthias-corvinus`)

- Castles prerequisites: I believe Castles needs only Construction. If so, the Military Tactics note and the Stirrups note ('Stirrups is on the way to Castles') are wrong. Left unchanged.
- Governor title count: by about turn 130 to 180 the plan uses Amani Puppeteer (tier 3), Magnus Provision plus Black Marketeer, and Victor Garrison Commander. That may be more titles than Gathering Storm civics grant by then. Reyna's 'Tax Collector' name and tier were not verified. Left unchanged.
- Retainers: other plans source it from Feudalism and from Civil Service. I believe it may be Civil Service. Left as civic:feudalism.
- Diplomatic League civic: I changed it to Political Philosophy, which agrees with most of the other plans (5 of 7). If it really is Mysticism, revert the policy's 'from' field and the Mysticism note.
- Wisselbanken's exact Gathering Storm effect (whether it adds alliance points) was not verified. I changed only the target, from city-states to allies.
- Containment: I changed the effect wording to 'suzerain runs a different government'. I did not verify that it unlocks at Diplomatic Service.
- Whether a Monument gives Loyalty directly in Gathering Storm ('Monument, Loyalty first' in the peak and consolidate phases). Left unchanged.
- Field Cannon's strategic-resource requirement (the Rifling note says Field Cannons need the Niter). Left unchanged.
- Kilwa Kisiwani: I kept Machinery as its unlock. I did not add its flat-land-beside-coast placement rule to skip_if.
- Military Training note 'Great General points start here': the points come from the Encampment, not the civic. The wording is loose and was left unchanged.
- Internal inconsistencies left alone because they are not game facts: whether the pantheon's free Settler founds the third or the fourth city, and the Diplomatic branch keeping Monarchy while the Computers boost assumes Democracy.

## Menelik II (`menelik-ii`)

- phases[3].governors[0] Pingala Curator: the plan says to 'put the Artifacts there' for doubled Tourism. I believe Gathering Storm's Curator doubles Tourism only from Great Works of Writing, Art and Music, which would leave Artifacts and Relics out. I am not confident enough to change it.
- phases[3].wonders[0] Oxford University 'Great Scientist points': the two free techs, +20% Science and the Writing slots I am sure of. I am not sure the wonder gives Great Scientist points. Left as is.
- Rock-Hewn Church: the plan says it can be placed 'only on Hills'. I think it may also be allowed on Volcanic Soil, and that it cannot sit next to another Rock-Hewn Church. Neither is certain enough to edit, and the plan never states the unlocking civic, so nothing is wrong there.
- Research and civic paths list the key techs and civics, not every one. Some prerequisites are missing (Animal Husbandry before Archery and Horseback Riding, Masonry before Construction, Machinery before Printing, Shipbuilding before Mass Production, Defensive Tactics before Feudalism and Civil Service, Diplomatic Service before The Enlightenment). Other plans follow the same convention, so I only fixed an out-of-order pair (Theology and Drama and Poetry) and did not add missing entries.
- Theocracy appears as a policy entry in a 'wildcard' slot (phases[2].policies[5]), and the task close-last-convert says it is 'slotted'. Theocracy is a government, not a card, but every other plan on the site records governments this way with a why that starts 'The government', so I left it. The effects the plan gives (stronger religious combat, land units bought with Faith) are correct for Theocracy.
- The policy sequence in phase 1 (turns 1 to 35) has God King, then Ilkum, then Colonization 'slotted', all Economic cards. Chiefdom has only one Economic slot until Classical Republic arrives around turn 45, so they have to be swapped in turn rather than run together. This is a sequencing ambiguity, not a false claim, so I left it.
- The Humanism timing (task at turn 150, checkpoint 'Humanism done' at 160) looks late for a Culture-leaning empire on Emperor, where around turn 110 to 130 is more usual. It is not clearly wrong, so I did not change it.

## Montezuma (`montezuma`)

- verdict.why says the Eagle Warrior 'turns every unit it beats into a Builder', and arm-phase lines say 'every one is a Builder'. The in-game text may describe the capture as a chance, not a certainty. Left unchanged.
- The Tlachtli is described as giving Culture as well as Faith, an Amenity and Great General points. I could not confirm the Culture yield in Gathering Storm. The leader record says the same, so it was left unchanged.
- Temple of Artemis: I changed the radius to four tiles. I am less sure whether the bonus per Camp, Pasture and Plantation is +1 Amenity or +1 Food.
- The Moksha / Patron Saint entry (phases[4].governors[0]) no longer claims a discount, but Patron Saint does nothing for Naturalists or Rock Bands. The promotion or the governor may need a rethink. Left as is because I am not certain of Moksha's other promotion effects in Gathering Storm.
- Amani's Affluence ('+1 Amenity to your cities within six tiles of her city-state'): I am not certain of the exact effect. It matches other plans, so it was left unchanged.
- Window governors: Victor plus Garrison Commander and Magnus plus Provision need about four titles by roughly turn 45. The window civic list (State Workforce, plus Early Empire from the arm phase) may give only two or three. I am also not sure whether Provision is Tier 1 or Tier 2 in Gathering Storm.
- boosts tech:castles is rated free in the digest phase, from 'Any Tier 2 government', but no Tier 2 government civic (Divine Right, Exploration, Reformed Church) is on the digest path. Monarchy first appears in the expand phase, and Divine Right needs Theology, which the plan treats as conditional.
- Arm task at turn 14 says 'capital Holy Site or Campus placed', but neither Astrology nor Writing is researched in the arm phase, so neither district can be placed by then.
- The Electricity research note says the Privateer Eureka applies 'only if a Harbor exists'. I believe naval units do not need a Harbor district.
- The Mass Media note still credits it with 'the Tourism multiplier'. I am not sure what Mass Media unlocks in Gathering Storm.
- Several implicit prerequisites are not listed (Pottery for Writing, Irrigation, Traders and Granaries; Defensive Tactics for Feudalism and Civil Service). The research lists appear not to be exhaustive, so I added nothing.
- Field Cannon is called 'the siege line for cities with Renaissance Walls'. It is a ranged unit, not siege class. Left as is.
- The claim that Medieval Great Generals 'retire into a free Knight' was not verified.
- Captured Builders are spoken of as 'four-charge'. Base Builders have 3 charges, and I am not sure how many charges a captured Builder gets.

## Nzinga Mbande (`nzinga-mbande`)

- Queen of Ndongo and Matamba is taken as +10% all yields on the home continent and -15% elsewhere. One web guide agrees, but I could not see the in-game text, and the ability may carry more (for example a combat bonus). Left as is.
- The Ngao Mbeba's unlock tech (Iron Working, as the plan says, or Bronze Working) is not confirmed. Left as is.
- Bernini as a Civ VI Great Artist (kit_levers Nkisi exploit, phases[3] great-artist): I could not confirm he is in the game. Donatello and Michelangelo are.
- Amani's Emissary in phases[4] is said to give 'Open borders and an envoy where the last Tourists are'. I believe Emissary is a Loyalty bonus to nearby cities, but did not change it.
- Grand Opera's effect ('Doubles the Culture of Theater Square buildings') may be the pre-Gathering Storm wording; in Gathering Storm it may be a Theater Square adjacency card.
- Gothic Architecture as an Economic card from Divine Right, and Satellite Broadcasts from Space Race: neither confirmed.
- The Computers note says 'Tourism up a quarter the turn it lands': not confirmed.
- 'a Faith-per-follower Founder belief' in the claim-religion task: there may be no exact Founder belief of that kind (Pilgrimage is Faith per city following).
- Urbanization boost: 'the capital at fifteen population on Mbanza Housing and a Sewer'. A Sewer needs an Aqueduct, which the plan builds only in the city with no Mbanza tile.
- Education (cheap, consolidate phase, Great Scientist) and Printing (two Universities, consolidate phase) depend on a Campus the plan builds only late, in the live phase, and one at most.
- Civic ordering I did not change: Military Training may require Games and Recreation, which the claim phase lists after it, and the order within the close phase (Social Media, Professional Sports, Distributed Sovereignty) is not verified.
- Governor title count: by about turn 250 the plan uses about 15 titles across Magnus, Pingala (to Curator), Moksha (Patron Saint), Victor, Reyna (Forestry Management) and Amani. Not verified against the Gathering Storm title sources.
- Mahabodhi Temple's placement may also require a founded religion or a Temple; the plan gives only Woods beside a Holy Site.

## Pachacuti (`pachacuti`)

- Terrace Farm Aqueduct bonus: the plan, following civ-info, says an adjacent Aqueduct adds Production. I half-remember +2 Food when next to an Aqueduct that provides Fresh Water. The plan also says neighbouring Terrace Farms add Production. I left all mentions (kit_levers[3], map_check.prefer[1], the range Aqueduct notes) unchanged.
- Whether the Terrace Farm needs Pottery (assess research note 'the Builder is waiting on it') or is available from the start.
- Whether Terrace Farms count toward Feudalism's 'Have 6 Farms' Inspiration (plan rates it cheap and says they count).
- Integrated Space Cell: I believe it boosts space projects in cities with a Military Academy, Seaport or Hangar (after a Satellite), and that a bare Encampment does not count. I am also not sure it is a Military card. Left as written.
- International Space Agency: unsure that it is unlocked by Nuclear Program (the plan names that civic). The civic note 'Science from the Nuclear Program card' is also vague.
- Governor titles: Magnus+Provision and Liang+Zoning Commissioner take four titles by turn 80. I could not confirm that enough title-granting civics fall in that window.
- Pyramids skip_if says 'flat Desert'. I am not sure Desert Hills are excluded.
- Terrestrial Laser Station unlocked by Lasers (close objective): not verified.
- Kilwa Kisiwani unlocked by Machinery (skip_if): plausible but not verified.
- Mit'a: the civ-info mentions an Industrial-era increase, and the sources line says the plan does not rely on one. Left as is.

## Pedro II (`pedro-ii`)

- Mines on Rainforest hills (setup Builder, Apprenticeship note and boost, Wheel boost, off_period_plan, map_check.prefer): I believe a Mine cannot be built on a Rainforest tile until the Rainforest is removed. If so, the plan's central 'Mine the Rainforest hills, never chop' idea does not work. Not changed.
- Mass Production note and boost say Rainforest cannot take a Lumber Mill. I think in Civ VI a Lumber Mill can be built on Rainforest as well as Woods. Not changed.
- The Amazon adjacency is described as 'standard' (+1 per Rainforest). It may be a minor bonus (+1 per two Rainforest tiles). The leader record also says standard, so I left it.
- Minas Geraes is described as having 'stronger bombardment and anti-air'. Its Combat and Ranged strength are higher than the Battleship's, but I do not believe it has a special anti-air ability. Not changed.
- The Copacabana is described as giving 'Amenities and Culture' and having 'its own Carnival project'. I am not sure it gives Culture.
- The Carnival project's list of Great Person classes (Engineer, Merchant, Writer, Artist, Musician) is not verified.
- The Street Carnival's 'more Amenities' than an Entertainment Complex: I think it gives +2 against +1, but I am not certain.
- Flight note and Cristo Redentor skip_if: these imply Flight unlocks Cristo Redentor. I think Cristo Redentor comes from a civic (Mass Media?), not Flight. Flight's 'Tourism from wonders' is also doubtful (Flight is usually Tourism from improvements that give Culture). The Pericles plan has the identical line, so I left it.
- Printing note says 'Printing is Culture across the empire': I know of no such Culture effect, but left it.
- Governor title count: the plan uses about 11 titles by turn 160 (Pingala 4, Magnus 2, Liang 2, Reyna 3 with Tax Collector) and about 16 by the end. That may be more than the civics grant by the Renaissance at Emperor.
- Rock Bands 'Faith-bought with Album Cover Art or Music Festival promotions': I am not sure promotions can be chosen when the band is bought.
- Refining 'on the way to Plastics' and the Refining-vs-Steel timing in the Minas Geraes exploit wording. Both are Modern-era techs in eurekas.json.
- State Workforce note 'the envoy is [needed]': I did not check whether State Workforce specifically grants an envoy.

## Pericles (`pericles`)

- Monarchy's Wildcard count in Gathering Storm. The plan says Plato's Republic keeps three Wildcards under Monarchy, Frescoes sits in the 'third Wildcard' in the league phase, and the Forbidden City (and Printing's note) gives a 'fourth Wildcard'. These hold only if Monarchy has two base Wildcard slots. Rise and Fall may have cut it to one. Left as written.
- Whether city-state quests ever ask for Ancient Walls or Walls (masonry note, engineering note and boost, castles note). I do not recall a walls quest. Left as written.
- Potala Palace 'Diplomatic Favor per turn': I know of +1 Diplomatic slot, Culture and Faith, but not a Favor yield.
- Cristo Redentor's unlock: I believe it is the Mass Media civic, not Flight. The Flight research note ('Cristo Redentor and Tourism from wonders') and its skip_if ('Flight arrives after turn 240') may be wrong. Mass Media's note also claims Broadcast Centers, which I believe come from the Radio tech.
- Satellite Broadcasts' source civic (plan says Cultural Heritage; it may be Space Race), and the exact Heritage Tourism wording (all Great Works versus Art and Artifacts).
- Grand Opera ('Culture from Acropolis buildings') and Rationalism ('Science from Campus buildings'): the Gathering Storm versions may be +100% adjacency cards instead.
- Pike and Shot unlock (plan implies Metal Casting). I believe it is Gunpowder.
- Close-phase research order lists Computers before Electricity. If Electricity is a Computers prerequisite, the order is reversed. The note 'Tourism from Culture rises with' Computers is also unverified.
- Hegemony civics list Natural History before Colonialism. If Colonialism is a Natural History prerequisite, the order is off.
- Buttress note 'on the way to Printing': I believe Printing comes from Machinery.
- Rock Bands 'Faith-bought with Album Cover Art or Music Festival': whether a purchase can pick the promotion.
- Democracy's Gathering Storm Favor bonus, and whether Kilwa Kisiwani unlocks at Machinery.
- Civil Engineering rated free on 'seven district types by turn 180'. The plan's districts are borderline for seven specialty types, since Aqueduct and Neighborhood do not count.

## Peter (`peter`)

- Governor title count: the plan uses about 3 titles by turn 70 (Magnus with Provision, plus Pingala) and about 8 by turn 130 (Pingala tier 1 and Grants, Moksha, Liang with Zoning Commissioner). That likely runs ahead of the titles the civic path grants in GS. Left unchanged.
- Moksha's Bishop is given as the reason to Faith-buy Temples. The 15% Faith-purchase discount may belong to Citadel of God, not Bishop.
- Amani's 'Prestige' promotion: I am not sure it exists under that name in GS, or that it does 'Loyalty outward and envoys'.
- St. Basil's Cathedral: 'Three Relic slots, more Tourism from Relics' is unverified. The tundra Food, Production and Culture part is right.
- Heritage Tourism is described as '+100% Tourism from Great Works'. It may apply only to Art and Artifacts.
- Ski Resort unlock: the plan says Professional Sports. I am not certain which civic or tech unlocks it.
- Literary Tradition is described as '+2 Great Writer points per Theater Square'. It may be a flat +2 a turn.
- Civil Engineering boost lists Aqueduct and Neighborhood among the seven 'specialty' districts. They may not count as specialty districts.
- Path order I did not change: Radio is listed before Flight (Flight may be a prerequisite of Radio), and The Enlightenment comes before Diplomatic Service (Diplomatic Service may be a prerequisite of The Enlightenment).
- Path gaps I did not change: Engineering (needed for the Aqueduct), Horseback Riding, Shipbuilding, Defensive Tactics, Medieval Faires, Mercantilism and Urbanization are prerequisites that are not listed in the paths.
- Lumber Mills are placed in the Classical phase before Construction (phase 2) is researched. I am not sure which tech unlocks the Lumber Mill in GS.
- The Scientific Theory note mentions 'Research Grants'. I could not confirm what that refers to.
- Mahabodhi's placement and religion requirement, and the 'Faith on a Lavra beside Woods' wording, are loose but left as written.
- The leader record (docs/data/leaders.json), not the plan, misdescribes The Grand Embassy, the Cossack, and Valletta as Religious. I did not touch it.

## Philip II (`philip-ii`)

- Mission: from memory it cannot be built next to another Mission. If so, 'ring a Campus there with Missions' (kit_levers[3].exploit) and 'Missions around its Campus' cannot be done literally. I did not change them because I am not certain of the restriction.
- Fez (phases[3].city_states[2]): this repo's city-state file says the bonus fires when a city is converted 'with a religious unit'. Taking a city with a Conquistador may not count. Left as written.
- Treasure Fleet amounts: I did not check the exact Gold, Faith and Production per intercontinental route, or whether the Gathering Storm version also gives +25% district Production off the home continent. The plan states neither, so I changed nothing.
- El Escorial: the plan says the civ-info text gives religious units a matching edge. From memory the in-game +4 is for combat units only. The plan already marks this as the civ-info text's claim, so I left it.
- Classical Republic and Theocracy are listed as policies in the 'wildcard' slot, but they are governments. The schema forces one of the four slot types and other plans do the same, so I left them.
- kit_levers[4].exploit: from memory, Holy War needs the rival to have actually converted one of your cities, not just sent missionaries in. The plan's wording is loose, and I am not certain enough of the exact trigger to change it.
- Stirrups as a Gunpowder prerequisite (the plan already says 'in this reading of the tree') and the Lumber Mill's unlock tech for the Mass Production boost: not checked against a tech tree.

## Qin Shi Huang (`qin-shi-huang`)

- Wonder Tourism and Flight. The plan says wonders turn into Tourism at Flight ('every wonder is silent until it lands', in the build checkpoint, the Flight research note and the build-flight task). As I recall it, wonders give Tourism from the start and only improvements such as the Great Wall wait for Flight. I am not sure enough to rewrite those lines.
- verdict.why says every wonder is 'Culture now'. Many Ancient and Classical wonders give no Culture yield. Left as it is.
- Temple of Artemis effect: the plan says 'Food from every Camp and Pasture in range'. I could not settle whether the GS bonus on Camps, Pastures and Plantations is Food or Amenities.
- Colosseum: '+2 Amenities and +2 Culture'. The Amenity value may differ by ruleset.
- Autocracy policy slots: the plan says it has one Diplomatic slot, which Diplomatic League fills. Also, Ilkum, Corvée and Colonization all being economic depends on Autocracy's Economic plus Wildcard count.
- Online Communities slot: the plan says diplomatic. I think it may be Economic but did not change it.
- International Space Agency: I could not confirm that it comes from Nuclear Program; it may be Globalization. Its slot is also unverified.
- Grand Opera and Rationalism wording: GS reworked these cards around adjacency and population thresholds. The plan's '+100% Culture from Theater Square buildings' and 'cities at ten population or more' may not match.
- Heritage Tourism '+100% Tourism from Great Works' may be limited to Great Works of Art and Artifacts.
- Democracy 'the Tourism bonus' and Merchant Republic 'purchase discounts on museums and Great Works' are both unverified.
- Great Artist 'three Great Works of Art per Artist' and Great Musician 'three Great Works of Music per Musician' look high but were not changed.
- Hermitage '+3 Great Artist points': the exact number is unverified.
- Governor title count: the digest phase needs Liang at 2 titles, Magnus 1, Pingala Grants (possibly 3) and Victor 2 by about turns 111 to 180. I did not check this against the civics that grant titles.
- The Great Wall's exact GS yields, any terrain restriction, and whether its defence bonus goes obsolete were not changed.
- Agenda wording for Wall of 10,000 Li was left as it is.
- Great Library effect: I changed five lines on the understanding that it grants boosts for all Ancient and Classical technologies and has no per-Great-Scientist boost. If a later patch added such a boost, those edits should be reverted.
- Statue of Zeus placement in sources: I kept the plain Encampment wording and added the Barracks-or-Stable condition for Terracotta Army only.

## Robert the Bruce (`robert-the-bruce`)

- Task hint says Oxford University comes from Education, but the scraped GS Civilopedia (civilopedia.net gathering-storm page) lists Industrial era, Scientific Theory, Grassland or Plains beside a Campus with a University. The plan's Scientific Theory was kept.
- Merchant Republic effects were taken from the GS Civilopedia scrape (+10% Gold in governed cities, +15% district Production, no extra Trade Route capacity). If the live game still grants Trade Route capacity, the old wording was partly right.
- Policy slot capacity in the ramp phase: Retainers and Craftsmen are both Military cards, but Merchant Republic has 1 Military and 1 Wildcard slot (Inspiration fills the Wildcard). Both fit only after the Alhambra adds a Military slot. Left unchanged.
- Governor title budget: by about turn 235 the plan has Pingala at Space Initiative, Magnus at Vertical Integration, Reyna at Tax Collector, plus Amani (Affluence) and Liang (Zoning Commissioner). That is roughly 15 titles. Plausible but not verified.
- Phase 3 gives Pingala Space Initiative in the capital, but space projects need a Spaceport in that city, so the promotion does nothing there until phase 4. Left as strategy.
- Integrated Space Cell now correctly needs a Military Academy or Seaport, which the plan never builds. The card may be dead weight.
- civic:professional-sports is rated free on 'Two Entertainment Complexes stand by the Industrial era', but the plan only builds a second complex conditionally.
- tech:plastics note 'the Spaceport's launches need it' was not verified (Plastics leads to Synthetic Materials). tech:electricity 'Power for Factories and Research Labs' is loose, since Coal Power Plants come from Industrialization. Bread and Circuses project effect not verified.
- Highlander bonus is +5 Combat Strength in Hills and Forest (Civilopedia). The plan states no number, so nothing was changed. The leaders.json civInfo Bannockburn text (Production to units) is already flagged in sources[3].
- Map-check and other luxury-count math (e.g. 'the ninth city on five luxuries drops the bonus in every city') is strategy and was left as is.

## Saladin (`saladin`)

- International Space Agency (close phase policy): I could not confirm that the Space Race civic unlocks it rather than another late civic such as Globalization. Its Diplomatic slot and its Science-per-suzerainty effect look right. Left as is.
- Grande Armee era range: I am confident it covers the melee, ranged and anti-cavalry classes (hence the fix), less sure whether its era range is Ancient-Industrial or Ancient-Modern. No era is stated in the plan.
- civic:the-enlightenment rated free on 'the last Prophet and two Great Scientists are three Great People': not sure a Great Prophet granted by The Last Prophet counts toward 'Earn 3 Great People'. Left as is.
- Civic paths skip prerequisites that are never listed, such as Defensive Tactics before Feudalism and Civil Service. Defensive Tactics also has no boost rating. I treated the paths as highlights rather than complete orders and did not add anything.
- Theocracy's Faith purchase discount (implied by 'buy Apostles faster') and the exact Chinguetti rate (+1 Faith per follower in city-states.json, which I remember as per 5 followers) were not checked against the game files. The plan states no number for either.
- Governor title count: Magnus Provision plus Pingala Librarian by turns 46-95 needs 3 titles. That looks plausible, but I did not check which civics award titles in Gathering Storm.
- The edit script wrote the file with json.dumps(indent=2), as instructed. Objects that were on one line before are now expanded across several lines, so the file diff is larger than the 10 content changes.

## Seondeok (`seondeok`)

- Seowon yield model: the plan treats the Seowon as a flat +4 Science, -1 per adjacent district, with no other adjacency. Its own sources note says so. I could not confirm whether a later Gathering Storm patch added a Seowon and Theater Square interaction or otherwise changed its adjacency. If it did, the many 'nothing beside it' claims would need revisiting.
- Natural Philosophy and Five-Year Plan doubling the Seowon's +4 (to +8) depends on the base yield being coded as district adjacency. That is widely reported, but I did not confirm it in the game files.
- Rationalism wording ('with the extra for districts at +3 adjacency or more'): I am unsure of the exact Gathering Storm thresholds (adjacency and population) and percentages, so I left it unchanged.
- Hwacha: the plan says it is unlocked by Machinery with Field Cannon ranged strength (60). I believe that is right but did not verify the exact stats or cost. With range 1, 'on a hill behind each border city's Walls' only hits units next to the Hwacha; that is a tactical point, not changed.
- shape_block.front_load.ceiling says rivals catch up 'once Research Labs multiply what each district makes'. Research Labs add flat Science and do not multiply district adjacency. This is loose framing rather than a clear error, so I left it.
- Research and civic lists leave out some prerequisites the plan still needs: Bronze Working (for Iron Working), Animal Husbandry (for Archery), Masonry (for Walls), Drama and Poetry and Foreign Trade (on the path to Recorded History, Early Empire and Mysticism). The lists look illustrative rather than complete, so I added nothing.
- phases[1] lists Colonization, Urban Planning and Natural Philosophy, three Economic cards, alongside Inspiration under what is presumably Classical Republic (2 Economic + 1 Wildcard). This works only if the cards rotate rather than all being slotted at once. The plan does not say, so I left it.
- phases[2].build_order Market says 'Two, in the Commercial Hubs', but the plan only places one Commercial Hub, in the capital. Strategy gap, not changed.
- Exact Space Race project unlock techs (Earth Satellite at Rocketry, Mars Colony at Nanotechnology) and the 'no Eureka exists' wording for Rocketry: eurekas.json marks Rocketry as Great Scientist only, so the wording is close enough. Left as is.

## Shaka (`shaka`)

- Siege Tactics may require Metal Casting, which I believe it does. If so, Siege Tactics in the snowball phase comes before Metal Casting in the consolidate phase. Not changed.
- Pike and Shot: I could not confirm which tech unlocks it, Metal Casting or Gunpowder (phases[4] metal-casting note). Not changed.
- Grand Armee: I believe it covers Medieval, Renaissance and Industrial land units, not just Industrial. I also could not confirm whether it comes from Nationalism and Levee en Masse from Mobilization, or the other way round. Left as written.
- Governor titles: the plan uses Victor (appointed plus Garrison Commander plus Defense Logistics plus Embrasure), Magnus, Pingala, Amani and Reyna. It may need more titles by turns 75 and 100 than Gathering Storm grants at that pace. I could not verify the title schedule.
- Terracotta Army skip_if names 'a rival with Qin or Pericles'. Qin is a real reason, but Pericles (Greece) has no wonder-speed bonus. Left as written.
- kit_levers[4].exploit talks about 'AI Shaka on the same map'. When the player is Shaka there is normally no AI Shaka, but this is framing, not a game stat, so I left it.
- The Ikanda's exact Corps and Army discount, and whether it unlocks at Bronze Working like the Encampment, were not verified. The claims were left as written.
- Path omissions, not order violations, were left alone: Pottery (for Writing), Animal Husbandry (for Archery and Horseback Riding), Recorded History (for Civil Service), Theology (for Divine Right), and the Renaissance civics before Nationalism.
- 'Gold for the merge' (phase 2 Market): I believe forming a Corps in the field costs no Gold, but I was not sure enough to change it.
- Phase 4 Armory 'a second promotion on new units': not verified against the Gathering Storm Armory text.

## Simon Bolivar (`simon-bolivar`)

- No Comandante at game start: I am fairly confident, not certain, that Campaña Admirable only fires on entering a new era, so the first Comandante comes in the Classical era. The plan's own sources note called this an assumption, and I rewrote every Ancient-Comandante reference on that basis. If the game does grant an Ancient one, revert those edits.
- Comandante aura stacking: the plan says two or three Comandante auras stack, and that a Great General plus a Comandante gives +10 Combat Strength and +2 Movement (kit_levers[0].exploit, phases[2].great_people[0], phases[3].great_people[0], phases[1].great_people[0]). Normally Great General auras do not stack. I could not confirm whether Comandantes stack with each other or with a Great General. The +5/+1 aura values themselves are also unverified.
- Llanero full heal when a Comandante retires in range: I left this as written. I am unsure of the exact trigger.
- Hacienda details: Production beside other Haciendas, and the exact Food per adjacent Plantation. Left as written.
- Religious Settlements' free Settler: the repo's pantheons.json says it grants one. I recall Gathering Storm reducing it to +15% border growth only. Left unchanged.
- International Space Agency: it may come from Globalization rather than Space Race (phases[4].policies[2].from).
- Combined Arms note says 'Modern Armor'. I believe Modern Armor comes from Composites, but I am unsure what to put instead, so it is left as written.
- Reyna's 'Tax Collector' promotion name and tier.
- Total War's effect in Gathering Storm (double pillage yields) and the claim that Llaneros heal from pillaging.
- Whether promoting a unit heals it in Gathering Storm (kit_levers[1].exploit, 'heals the promotion's health').
- Rifling: I changed the note to say it unlocks Line Infantry. I am fairly confident of that, but it may be Military Science.
- Research lists skip several prerequisites: Writing for Currency and the Campus, Siege Tactics for Military Science, Humanism for Mercantilism, Theology for Divine Right, Combustion for Tanks, Steel for Artillery. I left them alone as selective highlights, not full paths.
- Professional Army may be obsolete by the Modern era. Left as written.

## Suleiman (`suleiman`)

- The Janissary's numbers: a cost of 120 versus the Musketman's 240, '+5 against anti-cavalry', and the rule that the -1 Population applies only in Ottoman-founded cities. 60 CS, the free promotion and the Population cost seem right. I could not confirm the cost, the anti-cavalry bonus or the founding-city rule, so I left them. The same figures recur in verdict.why, kit_levers[2], phase 3 and common_mistakes.
- Ibrahim's title effects and tree layout: Pasha default with +20% military Production, Head Falconer +5 CS in the city's territory, Serasker +10 vs district defences within 10 tiles, Grand Vizier mattering only in an allied capital, and Ibrahim in a foreign/allied capital (abort action). I left these unchanged because I could not confirm them.
- Whether Political Philosophy grants a Governor Title (phases[1].civics[1].note, task build-ibrahim). I believe the titles come from State Workforce, Early Empire, Defensive Tactics, Recorded History and so on, but other plans in the repo make the same Political Philosophy claim, so I left it. Whether the Government Plaza itself grants a title is also unverified.
- Niter amounts: 60 Niter banked by turn 110 from one mine starting about turn 95, the Grand Bazaar making the stockpile 'grow twice as fast', 'at least 12 per turn' by turn 140, and the GS strategic stockpile cap. These look optimistic at roughly 2 to 3 per improved source, but I could not confirm the rates.
- 'Research Grants' in the Scientific Theory note (phases[4].research[4]). Techs do not unlock policy cards, and I could not confirm that a card by that name exists. Left as is.
- Square Rigging appears in phase 3 research without Cartography, which I believe is its prerequisite (Cartography is only a 'costly' boost). Theology, a Divine Right prerequisite, appears only as a 'skip' boost. Neither is listed in the civics/research paths. I left both.
- Phase 0 Militaristic city-state note: an envoy 'keeps a Militaristic city-state from levying against you'. The suzerain levies whatever your envoys are, so this is dubious. Left as is.
- The activation test, stockpile and checkpoint text still say 'two Catapults' at turn 110, by which time Professional Army will have made them Trebuchets. I left this because it is still true that the two units came from Catapults.
- The map_check fallback's 'Catapults ... around turn 90' may fall after Military Engineering, in which case Trebuchets would be the unit. Left as is.
- The Barbary Corsair is not named in civ-info (a validator warning only). The plan's sources note already explains this, so I made no change.

## Tamar (`tamar`)

- Governor title budget in phases 3 and 4. Moksha to Divine Architect, Amani to Affluence, Victor to Garrison Commander and Pingala need about ten titles by turn 230. The civics in the plan plus the Government Plaza give about nine, so it relies on a tribal village, a title-granting Great Merchant or an early Civil Engineering.
- boosts civic:civil-engineering is rated free, but the plan's specialty districts are Holy Site, Campus, Commercial Hub, Government Plaza, Theater Square and Industrial Zone. That is six; it reaches seven only if the conditional Harbor is built (Aqueduct and Neighborhood do not count).
- phases[1].wonders[1].why (Mahabodhi Temple): 'four city-state conversions with Dharma-less charges' is vague and not verifiable as stated. Left unchanged.
- Militaristic and Preslav entries cite Barracks/Stable and Encampment-building bonuses, but the plan says it builds no Encampment. The bonuses are stated correctly, so only the fit is questionable. Left unchanged.
- Theocracy's 15% Faith-purchase discount: the wiki lists it under the R&F text. I believe GS keeps it, so 'Faith purchases cheaper' was left unchanged.
- amber band 'open a Trading Post in a civilization you have none in' replaces 'send a Trader to a city-state' because I could not confirm a historic moment for a first route to a city-state.
- Valletta's suzerain text ('walls cheaper') follows the repo's city-states.json and was not changed.

## Teddy Roosevelt (Bull Moose) (`teddy-roosevelt`)

- The Rough Rider (kit_levers[3], the phase 2 build_order, the rifling note) is most likely the Rough Rider persona's unit and not available to Bull Moose. I left it in because the leader record lists it, and removing a whole kit lever is beyond a small fix.
- Antiquities and Parks numbers: the plan says +1 Science, +1 Culture, and +1 Appeal in National Park cities. I could not confirm the exact values, or whether the National Park Appeal clause belongs to Bull Moose. The leader record gives no numbers. The validator also warns that the lever name differs from the civ-info string.
- Phase 1 checkpoint fail: 'Autocracy and Oligarchy hold one' Wildcard. I am unsure of the tier-1 slot layouts. If Oligarchy has a Diplomatic slot, America gets two there.
- Governor title budget: by turn 240 the plan needs about 12 titles (Liang tier 3, Pingala tier 3 Curator, Reyna tier 1, Moksha, Amani). That may be more than the civics grant by the Modern era.
- Forbidden City's extra Wildcard: I am unsure whether Founding Fathers counts it toward the +1 Favor per Wildcard.
- Seaside Resorts: the plan says they need Breathtaking coastal flatland. The in-game requirement may be Charming or better.
- Flight note 'Tourism from wonders doubles here' and Computers note '+25% Tourism': I am unsure of both effects. Flight is mainly known for turning improvement Culture into Tourism.
- Environmentalism note 'the civic that pays Tourism from Preserves and Parks' neighbours': not confirmed.
- Grove 'Food and Faith' and Sanctuary 'Culture and Science' by Appeal: the exact yields are not confirmed.
- Wisselbanken 'Favor from routes to allies', Democracy's 'Culture bonus from Great People', the Chancery's 'Favor per Great Person', the Golden Gate Bridge's 'Appeal and Tourism' and Bolshoi's 'Free civics': not confirmed, so left unchanged.
- Lumber Mill unlock tech in Gathering Storm (Machinery or Construction): I worded the machinery note so it holds either way.
- The tech and civic prerequisites I reordered come from memory (Radio needs Flight, Natural History needs Colonialism, Social Media needs Professional Sports, Computers needs Electricity, Mass Production needs Education). Every reorder only moves a possible prerequisite earlier, so the new order stays valid even if one of those links is wrong. Flight's own prerequisites (possibly Replaceable Parts, which is in phase 4) were not checked.

## Tokugawa (`tokugawa`)

- Bakuhan's numbers: the plan uses +1 Culture, +1 Science and +1 Gold per specialty district at the destination, and treats the international penalty as total. I could not confirm the exact in-game values or any extra clauses (Amenities, Tourism after Flight). The '56 a turn' sum and the turn-95 '+3 each' test depend on them. The plan's own sources already flag this.
- Encampment as 'the cheapest specialty district' (stack build_order): every specialty district has the same base cost (54). Gathering Storm also discounts district types you own fewer of, so a lone Encampment may well be cheap in practice. I left it.

## Tomyris (`tomyris`)

- Arming-phase production: the Saka Horse Archer costs 100 Production (Civilopedia, Gathering Storm). The forward city is settled on turn 20 and is meant to build two Saka pairs (200 Production) by turn 32, which is not plausible for a new city. The capital's queue is also tight. I left this alone because fixing it means restructuring the plan.
- Governor titles: by about turn 50 the plan uses Magnus with Provision plus Victor with Garrison Commander, which is 4 titles. By turn 150 the total is 9 or more (Moksha, Amani with Emissary, Pingala with Researcher). I could not confirm how many titles the civics on the plan's path award by those turns.
- Theology note and digest-religion task: Worship and Enhancer beliefs (Crusade, Defender of the Faith) are probably chosen when the religion is enhanced or evangelized, not when it is founded. Not changed.
- I could not verify the Grande Armée effect ('Corps and Armies cheaper'), Simultaneum ('Faith from Holy Site buildings in cities at ten population') or Levee en Masse wording. Only the Grande Armée name was corrected.
- Moksha Bishop: I kept only the doubled religious pressure, which I am confident of. I am not sure whether Gathering Storm also gives +2 Faith per specialty district. Grand Inquisitor's exact strength number is also unverified.
- Liang Zoning Commissioner: the plan says +20% Production toward districts. Gathering Storm may say +30%. Not changed.
- Arm checkpoint pass says 'there is no Casus Belli this early'. A Formal War (denounce, then wait 5 turns) may be available from the start. Not changed.
- The Nationalism Inspiration is rated free, but the Casus Belli war happens only on the Domination branch. Not changed.
- Akkad's suzerain bonus ('melee attacks do full damage to Walls') and the Militaristic levy duration ('ten turns of six units') are unverified.
- Grand Master's Chapel described as coming from Divine Right (sources[2], Divine Right civic note). Tier 2 Plaza buildings may unlock with any Tier 2 government civic instead. Not changed.
- People of the Steppe giving the second unit on Gold and Faith purchases as well as Production builds is assumed by the plan. I believe it is true but did not verify it.

## Trajan (`trajan`)

- Legion and Iron: I am about 85% confident the Legion needs Iron in Gathering Storm, so I made the fix. The repo's own leaders.json civInfo says it does not. Revert the five Iron edits if the repo's claim is the one to trust.
- Legion build charge: the plan says it can build a Roman Fort, a road or clear a feature. I am not sure which of the road and clear-feature uses exist in Gathering Storm, so I left it.
- Trajan's Column on captured cities: the plan says a captured city also gets the free building. The game text says 'All cities start with...', and the leaders.json record says 'founds or acquires'. I left it.
- 'A city founded later gets less' (Trajan's Column kit lever): in practice the free building is usually still a Monument. Left as is.
- Pingala with Researcher by turn 95 alongside Magnus with Provision needs four governor titles in the Classical phase. That may be tight on Emperor. Left as is.
- Entertainment Complex district note says 'Arena Amenities reach six tiles'. I believe only the Zoo and Stadium are regional and the Arena's Amenity is local, but I am not certain, so I left it.
- Oxford University 'and Great Scientist points': I don't remember Oxford giving Great Person points in Gathering Storm (it gives +20% Science, 2 free techs and Great Work slots). Left as is.
- Heritage Tourism 'Tourism from Great Works doubled': it may be Artifacts only. Left as is.
- Rationalism wording ('Campus buildings doubled in cities ... big enough to qualify') and Monarchy's 'Housing from Walls': I did not verify the exact Gathering Storm numbers.
- 'Great Scientists are the only boosts for Rocketry and Nuclear Fission' matches eurekas.json (great_scientist_only), but a Spy can also steal a tech boost. Left as is.
- Research Labs are built in the industrial phase (task at turn 210), but Chemistry, which unlocks them, is only listed in the close phase's research. I did not reorder the phases.
- Research lists omit some prerequisites: Pottery for Writing and Irrigation, Animal Husbandry for Horseback Riding. The validator does not flag this, so I treated the lists as not exhaustive.

## Victoria (Age of Steam) (`victoria`)

- Coal Power Plant unlock: in Gathering Storm I believe it comes from Electricity, not Industrialization. If so, the turn-120 order to queue a Coal Power Plant on Industrialization and the plant finished at turn 142 need Electricity researched earlier than the activate phase's research order implies. Left unchanged.
- Royal Navy Dockyard: kit_levers[3] and sources[3] say naval units embark and disembark without Movement cost. I recall '+1 Movement for naval units built here' and could not confirm the embark claim. Left unchanged.
- Sea Dog 'fights harder than the unit it replaces': I am not sure the Sea Dog's strength exceeds the Privateer's.
- Governor title count: the plan uses Magnus+Provision, Pingala+Researcher, Magnus Industrialist+Vertical Integration and Liang+Zoning Commissioner, which is 8 titles by turn 120, then Pingala Grants+Space Initiative and Reyna at Tier 2 (Contractor) later. Eight titles by turn 120 is probably more than Emperor civic pace and Government Plaza provide.
- Phase 4 puts Pingala in the capital and Magnus in 'the Ruhr city', but phase 3 builds the Ruhr Valley in the capital. If the Ruhr city is the capital, two governors share one city. Left unchanged because the plan elsewhere treats the Ruhr city as a second city.
- Forts: I believe the Fort improvement needs Siege Tactics, which is not on the research path before the turn-110 Forts for the Ballistics Eureka.
- Lumber Mill unlock (Construction or Machinery): the Machinery note credits Machinery and I could not confirm which.
- Communism's effect as stated ('+10% Production toward buildings and wonders and more toward districts') and Integrated Space Cell's slot are unverified. International Space Agency may come from Globalization rather than Space Race.
- Amundsen-Scott Research Station: I could not confirm it exists in Gathering Storm, or its effect, era and Radio unlock as stated.
- 'Modern Great Engineers add Production to the space projects': the space-project engineers (Goddard, Korolev, von Braun) may be Atomic or Information era rather than Modern.
- God of Craftsmen: the plan says +1 Production and +1 Faith; pantheons.json says only +1 Production. I believe the Gathering Storm text includes the Faith, so it was left unchanged.
- Stock Exchange from Economics: unconfirmed whether it is Economics or Electricity in Gathering Storm.
- Railroads using Coal (activate build_order[3]) and the Ironclad's strategic cost (stockpile[1]) are unverified.

## Wilfrid Laurier (`wilfrid-laurier`)

- Four Faces of Peace: the plan's kit_levers and the leader record say Canada cannot declare war on city-states. The Civilopedia text as I recall it has only the Surprise War rule, Favor per 100 Tourism and +100% Favor from Emergencies and Scored Competitions, with no city-state clause. I left it because the sources note already hedges on it.
- The Last Best West exact numbers (which improvements get +Food or +Production, and whether Camps are included) were left as written. They match the leader record, and the plan correctly hedges that Tundra Hills Farms come with Civil Engineering.
- Ice Hockey Rink: whether it raises the Appeal of adjacent tiles (kit_levers, the stockpile and the Rink build order all rely on this), and whether its Culture is per adjacent Tundra/Snow tile. I did not verify either.
- Mountie: unlocking tech or civic, 'low maintenance', and the size of its combat bonus near parks. The plan states none of these precisely, and the sources note already says to confirm them.
- Preserve and Government Plaza counting as specialty districts for the Mathematics Eureka (Holy Site, Campus, Preserve) and the Civil Engineering Inspiration (seven different specialty districts). If the Preserve does not count, Mathematics needs a different third district.
- Raj policy card slot (the plan says diplomatic). I could not confirm whether it is Diplomatic or Military in Gathering Storm.
- Heritage Tourism slot (the plan says economic) and its exact effect.
- Amani's Prestige effect ('a suzerainty that rivals find much harder to take'), and whether she has enough titles for a tier-2 promotion by turn 151.
- Seaside Resort Appeal requirement: the plan uses Charming or better. It may be Breathtaking in some rulesets.
- Governor title timing: Provision now correctly needs two titles, but the plan still lists it in the settle phase (turns 1 to 50), and State Workforce, a likely second title source, is in the build phase. The entry may really belong at the start of the build phase.
- Statue of Liberty at +4 Diplomatic Victory points and Mahabodhi Temple at +2 match my reading of Gathering Storm but were not checked against a source. I also could not confirm whether Scored Competitions and Emergencies themselves award Diplomatic Victory points, as verdict.why implies.
- Flight prerequisites: if Flight needs Combustion, the activate phase's Flight research comes before the payoff phase's Combustion. Research lists are not exhaustive, so I did not change it. Eiffel Tower likewise needs Steel, which is not in the payoff research list.

## Yongle (`yongle`)

- Magnus Surplus Logistics: I am about 80% sure the +2 Food from Trade Routes ending in his city goes to each route's starting city. I edited the cross-phase line on that basis. If the bonus actually goes to Magnus's own city, the original wording was right.
- Inspiration is slotted as wildcard. I left it, because Rise and Fall made the Great Person point cards wildcard (purple) and other plans use the same slot. Integrated Space Cell as a military card is also left unverified.
- Great Wall: the tall phase builds more segments in the Renaissance. I have a vague memory that Gathering Storm stops the Great Wall being built after a certain tech (possibly Machinery). I could not confirm this, so I left it.
- Hanging Gardens is described as 'A growth wonder that reaches every city'. A later Gathering Storm patch may have changed it to a Housing bonus for cities within 6 tiles. I left it.
- Radio boost text says 'only if a Breathtaking area is free'. National Park appeal requirements may only need Charming or better. I left it.
- Turn 24 Fertility Rites: the plan has no Faith source before the pantheon (no Holy Site, and Lijia projects are held back until after turn 80). A turn-24 pantheon on Emperor would rely on tribal villages or a Faith city-state, so it may be optimistic.
- Lijia's exact effects and numbers, and the Population 10 gate, follow civInfo and the repository's Gate supplement. I did not check them against the in-game text, and the plan's sources already say this.
- Tech and civic order: the found-phase list researches Archery without Animal Husbandry, Construction may also need Horseback Riding, and Exploration may need Mercantilism. Medieval Faires is needed for Angkor Wat and Humanism, but it is only listed as a boost to research plain. The lists are not claimed to be complete, so I left them.
