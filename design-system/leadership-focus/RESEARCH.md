
## Page review (ui-design-multipart, review mode)

Run on 2026-10-01 against `docs/index.html`, `docs/css/styles.css` and the
`docs/js/` modules, one reviewer per area, merged with `merge_parts.py --mode
review` (4/4 parts, 55 findings, every rule id valid). Every finding was
applied except the one below.

| Area | Findings | What changed |
|---|---|---|
| a11y+touch | 22 | 44px targets for row and hero buttons, chips, small buttons, search button and carousel dots (visual bar kept as a pseudo-element); 8px gaps between targets; `scroll-padding-top` and `[id] { scroll-margin-top }` so sticky bars never cover a focused target; the primary nav collapses to a menu button below 1200px instead of a hidden-scrollbar strip; `aria-live` removed from `main`, route changes move focus to `main`, the result count is a `role="status"` region; the quiz focuses each new question; Enter in search opens the first result and only the Close button dismisses; Ctrl/Cmd+K no longer overrides the browser; inline links are underlined; `:active` states on every control; h2 headings added where a page jumped from h1 to h3 |
| layout | 10 | breakpoints rewritten mobile-first at 640/768/1024/1200; guide timeline, callouts and principle capped at 880px; body copy in cards, checklists, callouts, checkpoints and tables raised to 16px; `dvh` with `vh` fallback; card kickers no longer character-cut |
| type-color-style | 15 | yield colours, accent hover, soft foreground, wonder tint and text shadow are tokens; no literal below the type scale (12px floor, 12px SVG labels); headings at weight 600; brand and card names on scale steps; city-state card text clamped by CSS with the full bonus in `title`; blurred-image decoration replaced by the tinted fallback gradient; the quote glyph is an SVG icon; one primary CTA per screen |
| motion | 8 | `--ease-slow` token; hero panels crossfade with the image and the outgoing slide clears faster than the incoming one; rows stop on wheel, touch or pointer and resume after 1.5s idle; a two-row motion budget: of the auto-scrolling rows on screen only the two most visible move at once, the rest hold until they are; views crossfade on route change; progress bar animates with `transform`; `:active` scale feedback |

**Kept as designed.** The motion reviewer asked for autoplay off by default
(`excessive-motion`). The author's brief asks for continually rotating rows
per category, so autoplay stays on, and the two-row budget above, the
offscreen halt and the reduced-motion stop are the mitigation.
