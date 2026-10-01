// Shared helpers, vocabularies and inline icons.
export const CATEGORY_ORDER = ["military", "production", "science", "culture", "faith", "gold"];
export const CATEGORY_LABELS = { military: "Military", production: "Production", science: "Science", culture: "Culture", faith: "Faith", gold: "Gold" };
export const CATEGORY_BLURB = {
  military: "Conquest, movement and armies. The kit pays in cities taken.",
  production: "Infrastructure and raw output. The kit pays in things built.",
  science: "Research and the pace of technology. The kit pays in eras reached first.",
  culture: "Tourism, loyalty and influence. The kit pays in borders that move without war.",
  faith: "Religion as an engine. The kit pays in what Faith can buy.",
  gold: "Trade and treasury. The kit pays in what others must build and you may purchase.",
};
export const CURVE_ORDER = ["Spike", "Ramp", "Bloom", "Flat"];
export const CURVE_INFO = {
  Spike: "Peaks Ancient to Classical. The bonus is loudest before turn 100, then fades.",
  Ramp: "Peaks Medieval to Renaissance. Needs a working early game to reach it.",
  Bloom: "Peaks Industrial onward. Near-inert early; needs a survival plan, not a growth plan.",
  Flat: "Compounds evenly across the whole game. No cliff, no dead zone.",
};
export const CONVERSION_ORDER = ["Permanent", "Conditional", "Expiring"];
export const CONVERSION_INFO = {
  Permanent: "The peak banks into something that persists: cities, wonders, districts, civics.",
  Conditional: "Persists only while an external state holds: war footing, suzerainty, an amenity level.",
  Expiring: "Runs on a timer or a trigger. If it did not buy territory inside the window, there is no second act.",
};
export const ERA_ORDER = ["Ancient", "Classical", "Medieval", "Renaissance", "Industrial", "Modern"];
export const ERA_SPAN = { Ancient: "before 500 BCE", Classical: "500 BCE to 500 CE", Medieval: "500 to 1400", Renaissance: "1400 to 1700", Industrial: "1700 to 1900", Modern: "1900 onward" };
export const REGION_ORDER = ["Europe", "Middle East", "Africa", "South Asia", "East Asia", "Southeast Asia", "Central Asia", "Oceania", "North America", "South America"];

export const KEYWORDS = [
  "Combat Strength", "Great People", "Great Person", "Great Works", "Great Work", "Trade Routes", "Trade Route",
  "City-States", "City-State", "Golden Age", "Dark Age", "Heroic Age", "Era Score", "War Weariness", "Holy Site", "Commercial Hub",
  "Theater Square", "Industrial Zone", "Strategic Resource", "Diplomatic Visibility", "Natural Wonder", "Natural Wonders",
  "Districts", "District", "Wonders", "Wonder", "Amenities", "Amenity", "Loyalty", "Housing", "Production", "Science",
  "Culture", "Faith", "Gold", "Tourism", "Movement", "Envoys", "Envoy", "Suzerain", "Governor", "Builders", "Builder",
  "Settlers", "Settler", "Campus", "Encampment", "Harbor", "Aqueduct", "Grievances", "Warmonger", "Alliances", "Alliance",
  "Barbarian", "Barbarians", "Civics", "Civic", "Eureka", "Inspiration", "Corps", "Pillage", "Levy", "Adjacency", "Appeal", "Walls", "Pantheon",
];
const KEYWORD_RE = new RegExp("\\b(" + KEYWORDS.slice().sort((a, b) => b.length - a.length).map(escapeRe).join("|") + ")\\b", "g");
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function esc(str) {
  return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
export function escKw(str) { return esc(str).replace(KEYWORD_RE, '<span class="kw">$1</span>'); }
export function words(n, s) { return String(s || "").split(/\s+/).slice(0, n).join(" "); }
export function titleCase(s) { return String(s || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const ICONS = {
  "chevron-left": '<path d="M15 6l-6 6 6 6"/>',
  "chevron-right": '<path d="M9 6l6 6-6 6"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="M7 4l12 8-12 8z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-4 2 2-6z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14 M15 6v14"/>',
  mountain: '<path d="M3 20l6-10 4 6 2-3 6 7z"/>',
  flame: '<path d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4 1-7 1-10z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  sword: '<path d="M14 4l6 6-9 9-3 1 1-3zM5 19l-2 2M12 7l5 5"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z M4 19V5 M8 7h8"/>',
  users: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 15c2.5 0 5 1.5 5 4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  warn: '<path d="M12 3l10 18H2zM12 9v5M12 17.5v.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
};
export function icon(name, cls = "icon") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}
export function yieldChips(y) {
  if (!y) return "";
  const order = ["food", "production", "gold", "science", "culture", "faith", "appeal"];
  const parts = order.filter(k => y[k]).map(k => `<span class="yield yield--${k}">+${esc(y[k])} ${titleCase(k)}</span>`);
  if (y.other) parts.push(`<span class="yield">${esc(y.other)}</span>`);
  return parts.join("");
}
