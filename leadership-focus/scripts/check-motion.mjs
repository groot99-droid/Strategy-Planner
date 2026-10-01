#!/usr/bin/env node
/**
 * check-motion.mjs — drives the built site in headless Chromium and checks the things that only a browser can:
 * the auto-scrolling rows actually move (and stop on hover, and never move under reduced motion), the hero rotates,
 * the power-curve dot rests on the peak, the leader page tabs swap without remounting the hero, the Plan tab
 * rescales turns and remembers progress, and nothing overflows a 375 px screen.
 *
 *   node leadership-focus/scripts/check-motion.mjs [--port=8877] [--keep]
 *
 * Needs Playwright with Chromium (the dev container has both; PLAYWRIGHT_BROWSERS_PATH points at the browsers).
 * Serves docs/ with python3 -m http.server on the port, then kills it. Exits 1 on any failed check.
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { console.error('Playwright is not installed. npm i -g playwright, or run from a machine that has it.'); process.exit(2); }
const args = Object.fromEntries(process.argv.slice(2).map(a => { const m = a.match(/^--([\w-]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? true] : [a, true]; }));
const PORT = Number(args.port || 8877); const DOCS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs');
const U = `http://127.0.0.1:${PORT}/`;
let failed = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failed++; };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', DOCS], { stdio: 'ignore' });
try {
  await sleep(800);
  const browser = await chromium.launch();
  const errors = []; const watch = (p) => { p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_CERT|fonts\.g/.test(m.text())) errors.push(m.text()); }); };
  for (const dpr of [1, 2]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: dpr }); const page = await ctx.newPage(); watch(page);
    await page.goto(U + '#/', { waitUntil: 'networkidle' }); await page.mouse.move(5, 5);
    await page.evaluate(() => document.getElementById('row-military').scrollIntoView({ block: 'start' })); await sleep(500);
    const sl = () => page.evaluate(() => document.querySelector('#row-military .row__scroller').scrollLeft);
    const a = await sl(); await sleep(2000); const b = await sl(); ok(b - a >= 40, `DPR ${dpr}: row moved ${b - a}px in 2s`);
    await page.hover('#row-military .card'); const h0 = await sl(); await sleep(700); ok(await sl() === h0, `DPR ${dpr}: row stops on hover`); await page.mouse.move(5, 5);
    await ctx.close();
  }
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']); const page = await ctx.newPage(); watch(page);
  await page.goto(U + '#/', { waitUntil: 'networkidle' });
  const d0 = await page.evaluate(() => document.querySelector('.hero__dot[aria-current]').dataset.i); await sleep(8600);
  ok(await page.evaluate(() => document.querySelector('.hero__dot[aria-current]').dataset.i) !== d0, 'hero rotates after its interval');
  await page.goto(U + '#/leader/harald-hardrada', { waitUntil: 'networkidle' }); await sleep(1900);
  const dot = await page.evaluate(() => { const c = document.querySelector('.cc-dot'); const svg = c.ownerSVGElement; const r = c.getBoundingClientRect(), bb = svg.getBoundingClientRect(); return (r.x + r.width / 2 - bb.x) / bb.width * 304; });
  ok(Math.abs(dot - 205) < 6, `curve dot rests on the peak (x=${dot.toFixed(1)}, peak 205)`);
  const hero = await page.$('#leaderHero'); await page.click('[role=tab][data-tab=plan]'); await sleep(400);
  ok(await page.evaluate(() => location.hash) === '#/leader/harald-hardrada/plan', 'tab click routes to #/leader/<slug>/plan');
  ok(await hero.evaluate(el => el.isConnected && el === document.getElementById('leaderHero')), 'tab swap keeps the hero mounted');
  ok(await page.evaluate(() => getComputedStyle(document.getElementById('leaderPanel')).opacity) === '1', 'panel visible after swap');
  await page.goBack(); await sleep(400); ok(await page.evaluate(() => !!document.querySelector('#leaderPanel #overview')), 'back button returns to the previous tab');
  await page.goto(U + '#/leader/harald-hardrada/plan'); await page.waitForSelector('#planToolbar'); await sleep(300);
  const t90 = () => page.$eval('[data-cp-turn="90"] [data-turn="90"]', e => e.textContent);
  await page.selectOption('#planSpeed', 'marathon'); ok(await t90() === '270', `Marathon rescales turn 90 to ${await t90()}`); await page.selectOption('#planSpeed', 'standard');
  await page.fill('#planTurn', '62'); await page.dispatchEvent('#planTurn', 'change'); await page.check('[data-task="loop-raid-card"]');
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForSelector('#planToolbar');
  ok(await page.$eval('[data-task="loop-raid-card"]', e => e.checked) && await page.$eval('#planTurn', e => e.value) === '62', 'plan progress survives a reload');
  ok(await page.$eval('.phase--current', e => e.dataset.phase) === 'loop', 'current phase lit from the turn');
  await page.click('[data-plan="reset"]'); await page.click('[data-plan="reset"]'); await sleep(100); ok(!(await page.$eval('[data-task="loop-raid-card"]', e => e.checked)), 'reset clears progress');
  const dl = await page.evaluate(async () => { const r = await fetch(document.querySelector('a[download]').getAttribute('href')); return r.ok && (await r.json()).slug; });
  ok(dl === 'harald-hardrada', 'download link serves the plan JSON');
  await page.goto(U + '#/eras', { waitUntil: 'networkidle' }); await page.click('.subnav__link[data-target]:nth-child(2)'); await sleep(300); ok(await page.evaluate(() => location.hash) === '#/eras', 'reference-page subnav still scrolls in place');
  await ctx.close();
  const m = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const mp = await m.newPage(); watch(mp);
  for (const h of ['#/', '#/leader/harald-hardrada', '#/leader/harald-hardrada/plan', '#/leaders', '#/wonders']) { await mp.goto(U + h, { waitUntil: 'networkidle' }); await sleep(400); const w = await mp.evaluate(() => document.documentElement.scrollWidth); ok(w <= 375, `375px: ${h} has no horizontal overflow (${w})`); }
  await m.close();
  const rm = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' }); const rp = await rm.newPage(); watch(rp);
  await rp.goto(U + '#/', { waitUntil: 'networkidle' }); await rp.evaluate(() => document.getElementById('row-military').scrollIntoView()); await sleep(1000);
  const r0 = await rp.evaluate(() => document.querySelector('#row-military .row__scroller').scrollLeft); await sleep(1200);
  ok(await rp.evaluate(() => document.querySelector('#row-military .row__scroller').scrollLeft) === r0, 'reduced motion: rows do not move');
  await rp.goto(U + '#/leader/harald-hardrada'); await sleep(300); ok(await rp.evaluate(() => !document.querySelector('animateMotion')), 'reduced motion: no SMIL on the curve chart');
  await rm.close();
  ok(errors.length === 0, errors.length ? `no page errors (got: ${errors.join(' | ')})` : 'no page errors');
  await browser.close();
} finally { server.kill(); }
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
