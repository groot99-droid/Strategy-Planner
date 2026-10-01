// Five-question leader match (ported; scoring unchanged).
import { esc, CATEGORY_LABELS, CURVE_INFO } from "./util.js";

const QUESTIONS = [
  { key: "category", weight: 3, text: "Which victory actually excites you?", hint: "Pick the game you want to be playing at turn 150, not the one you think is strongest.",
    options: [
      { value: "military", title: "Conquest", desc: "Take cities. Armies are the plan, not the insurance.", cat: "military" },
      { value: "production", title: "The machine", desc: "Districts, infrastructure and raw output that never stops.", cat: "production" },
      { value: "science", title: "The research race", desc: "Out-tech everyone and win from the future.", cat: "science" },
      { value: "culture", title: "Influence", desc: "Wonders, tourism, loyalty. Win by being irresistible.", cat: "culture" },
      { value: "faith", title: "Belief", desc: "Religion as an engine, not a side project.", cat: "faith" },
      { value: "gold", title: "The treasury", desc: "Trade and money, buying what others must build.", cat: "gold" },
    ] },
  { key: "curve", weight: 2.5, text: "When do you want to be strongest?", hint: "The single biggest predictor of whether a leader will feel good to you.",
    options: [
      { value: "Spike", title: "Immediately", desc: "Loud before turn 100. Hit hard, bank it, coast.", curve: "Spike" },
      { value: "Ramp", title: "Mid-game", desc: "Build up, then peak through Medieval and Renaissance.", curve: "Ramp" },
      { value: "Bloom", title: "Late", desc: "Quiet for ages, then decisive from Industrial onward.", curve: "Bloom" },
      { value: "Flat", title: "Always, evenly", desc: "No spikes, no dead zones. Compounds the whole game.", curve: "Flat" },
    ] },
  { key: "conversion", weight: 2, text: "What kind of payoff do you trust?", hint: "How much risk you accept in exchange for how much ceiling.",
    options: [
      { value: "Permanent", title: "Banked and mine", desc: "Gains that persist long after the bonus stops mattering.", conv: "Permanent" },
      { value: "Conditional", title: "Kept on a condition", desc: "Strong while a state holds: war, suzerainty, amenities. I will maintain it.", conv: "Conditional" },
      { value: "Expiring", title: "One decisive window", desc: "All-in on a timer. If it works, it is over early.", conv: "Expiring" },
    ] },
  { key: "shape", weight: 2, text: "How do you like to be told what to do?", hint: "Different leaders demand genuinely different kinds of attention.",
    options: [
      { value: "Monitor", title: "Watch one number", desc: "Give me a stat and bands, and I will react every turn." },
      { value: "Countdown", title: "Race a deadline", desc: "Give me a turn to beat and I will sprint at it." },
      { value: "Front-Load", title: "Plan it all up front", desc: "Let me make the irreversible calls early, then execute." },
      { value: "Gate", title: "Wait for the unlock", desc: "Build quietly toward a trigger, then open up." },
      { value: "Dead-Phase", title: "Be patient a long time", desc: "I can play 100 flat turns if the payoff is enormous." },
      { value: "Linear", title: "Steady, era by era", desc: "A normal plan the ability quietly amplifies." },
    ] },
  { key: "cost", weight: 1, text: "How do you feel about strings attached?", hint: "Some kits are stronger but charge a permanent restriction.",
    options: [
      { value: "accepts", title: "Give me the strong kit", desc: "I will live with a hard requirement if the ceiling is higher." },
      { value: "clean", title: "Keep it unconditional", desc: "I want a bonus that just works, with nothing to maintain." },
    ] },
];

export function renderQuiz(ctx) {
  const html = `<section class="quiz"><div class="section__kicker">Five questions</div><h1 class="section__title">Find my leader</h1><p class="section__lede">Answer honestly about how you actually play, not how you wish you played. Your three closest matches come back with the reasoning shown.</p><div class="quiz__progress" aria-hidden="true"><div class="quiz__progress-bar" id="quizProgress"></div></div><div id="quizStage"></div></section>`;
  const init = (root) => {
    const stage = root.querySelector("#quizStage"); const bar = root.querySelector("#quizProgress");
    let answers = {}, index = 0;
    const setProgress = f => { bar.style.width = Math.round(f * 100) + "%"; };
    const badge = (o) => { let src = null; if (o.cat) { const s = ctx.leaders.find(l => l.categoryKey === o.cat); if (s) src = s.categoryBadge; } else if (o.curve) { const s = ctx.leaders.find(l => l.curve === o.curve); if (s) src = s.curveBadge; } else if (o.conv) { const s = ctx.leaders.find(l => l.conversion === o.conv); if (s) src = s.conversionBadge; } return src ? `<img src="${esc(src)}" alt="" width="40" height="40" style="width:40px;height:40px;border-radius:50%;float:right;margin-left:12px">` : ""; };
    const question = () => {
      const q = QUESTIONS[index]; setProgress(index / QUESTIONS.length);
      stage.innerHTML = `<p class="section__kicker">Question ${index + 1} of ${QUESTIONS.length}</p><h2 class="quiz__question">${esc(q.text)}</h2><p class="muted">${esc(q.hint)}</p>
        <div class="quiz__options">${q.options.map((o, i) => `<button class="quiz__option" type="button" data-i="${i}" ${o.cat ? `data-category-key="${o.cat}"` : ""}>${badge(o)}<b>${esc(o.title)}</b><span>${esc(o.desc)}</span></button>`).join("")}</div>
        <div style="display:flex;justify-content:space-between;margin-top:var(--space-lg)">${index > 0 ? '<button class="btn btn--sm" type="button" id="quizBack">Back</button>' : "<span></span>"}<a class="btn btn--sm" href="#/leaders">Skip to the codex</a></div>`;
      stage.querySelectorAll(".quiz__option").forEach(b => b.addEventListener("click", () => { answers[q.key] = q.options[Number(b.dataset.i)]; if (index < QUESTIONS.length - 1) { index++; question(); } else { setProgress(1); results(); } root.scrollIntoView({ block: "start" }); }));
      const back = stage.querySelector("#quizBack"); if (back) back.addEventListener("click", () => { index--; question(); });
    };
    const score = () => {
      const a = answers; const max = QUESTIONS.reduce((s, q) => s + q.weight, 0);
      return ctx.leaders.map(l => {
        let s = 0; const why = [];
        if (a.category && l.categoryKey === a.category.value) { s += 3; why.push(`Built for ${CATEGORY_LABELS[l.categoryKey].toLowerCase()}, the focus you picked.`); }
        if (a.curve && l.curve === a.curve.value) { s += 2.5; why.push(`A ${l.curve} curve: ${CURVE_INFO[l.curve]}`); }
        if (a.conversion && l.conversion === a.conversion.value) { s += 2; why.push(`${l.conversion} conversion, the payoff style you trust.`); }
        if (a.shape && (l.shape === a.shape.value || l.altShape === a.shape.value)) { s += 2; why.push(`Plays as a ${a.shape.value} guide, the kind of attention you asked for.`); }
        const hasCost = l.conditionCost && l.conditionCost !== "None";
        if (a.cost) { if (a.cost.value === "accepts" && hasCost) { s += 1; why.push(`Charges a real price (${l.conditionCost}) and you said you would pay it.`); } else if (a.cost.value === "clean" && !hasCost) { s += 1; why.push("No condition attached. The bonus is simply free."); } }
        return { leader: l, score: s, pct: Math.round((s / max) * 100), why };
      }).sort((x, y) => y.score - x.score || x.leader.name.localeCompare(y.leader.name)).slice(0, 3);
    };
    const results = () => {
      const top = score(); const num = ["I", "II", "III"];
      stage.innerHTML = `<p class="section__kicker">Your three</p><h2 class="quiz__question">Closest matches</h2><div class="quiz__result">${top.map((r, i) => { const l = r.leader; return `<article class="match" data-category-key="${esc(l.categoryKey)}"><img src="${esc(l.image)}" alt="" width="96" height="96"><div><div class="match__rank">${num[i]} · ${r.pct}% match</div><h3>${esc(l.name)}</h3><p class="muted" style="margin:0">${esc(l.civilization)} · ${esc(l.leaderTitle)}${l.era ? ` · ${esc(l.era)}` : ""}</p><ul>${(r.why.length ? r.why : ["No strong match on your answers; this is the closest the roster gets."]).map(w => `<li>${esc(w)}</li>`).join("")}</ul><a class="btn btn--sm" href="#/leader/${esc(l.slug)}" style="margin-top:10px">Read the guide</a></div></article>`; }).join("")}</div>
        <div style="display:flex;gap:8px;margin-top:var(--space-lg);flex-wrap:wrap"><button class="btn" type="button" id="quizRetake">Retake the quiz</button><a class="btn" href="#/leaders">Browse the codex</a></div>`;
      stage.querySelector("#quizRetake").addEventListener("click", () => { answers = {}; index = 0; question(); });
    };
    question();
  };
  return { html, title: "Find my leader — Leadership Focus", init };
}
