# Worked Example

A complete sample run of the skill, so the output of each phase is concrete. **Everything below is fictional sample data** (project, people, quotes, metrics). In a real run, use only what the user provides.

Project: "Fleetwise", a fleet-operations dashboard. Three iterations.

---

## Phase 0: how the intake sounds

> Before I look at the designs, a few things I need from you. I'll skip anything you already told me.
>
> 1. **Sources.** I see 3 PNGs (v1, v2, v3). Is that the right order? Any mobile variants?
> 2. **Story.** For each iteration, what problem or insight drove it, and what changed? Specifics help: "merged three filters into one bar" gives me a better animation than "simplified filters".
> 3. **Placement.** Which file should the scene live in, and is there an existing stack or CSS I should match?
> 4. **Scroll.** Continuous scrub, snapping to beats, or a hybrid? Short and punchy, or slow and cinematic?
> 5. **Theme.** I'll ship light and dark. Follow the OS, a site toggle, or both?
> 6. **Granularity.** I'll show sections and major components only (cards, tables, big numbers, nav) and leave paragraphs out. Anything to always include or exclude?
> 7. **Intensity.** Subtle, balanced, or dramatic? Any motion you dislike?
> 8. **Living layer.** I can add collaborators' cursors, comment pins, sticky notes, callouts, rulers, selection boxes, metric chips, avatars and an approval stamp. Which fit? For each iteration, is there real feedback, a research quote, a person or a metric that belongs on screen? I won't invent any.
> 9. **Reduced motion.** I suggest snapping between key poses. OK?

Sample answers (fictional):
1. Right order, no mobile. 2. v1: first dashboard, dense. v2: ops managers couldn't find late deliveries, so a "Late" panel moved to the top and the map shrank. v3: added a live trend chart and merged three filters into one bar. 3. `/case-studies/fleetwise.html`, plain HTML. 4. Hybrid, cinematic. 5. Follow the OS plus a toggle. 6. Show the map even though it's big. 7. Balanced, no screen shake. 8. Cursors yes, one sticky note, a pin quoting the ops-manager feedback ("I scroll past the map to find late trucks"), a "-38% time to find late deliveries" chip, an Approved stamp. 9. Yes.

**Gate 0 restatement:** "3 iterations, plain HTML in `fleetwise.html`, hybrid cinematic scroll with beat snaps, light/dark with toggle, sections and major components plus the map, balanced intensity, living layer: cursors, one note, one pin, one chip, one stamp, reduced motion snaps to poses. Right?"

---

## Phase 1: component tree and match table

Reference frames: all 1440 x 900.

**v1 component tree**

| id | label | kind | depth | rect (x, y, w, h) |
|---|---|---|---|---|
| page | Page | shell | 0 | 0, 0, 1440, 900 |
| nav | Top bar | nav | 1 | 0, 0, 1440, 64 |
| filters | Filters | control | 1 | 32, 88, 1376, 56 |
| map | Fleet map | media | 1 | 32, 168, 880, 700 |
| kpis | KPI row | section | 1 | 936, 168, 472, 120 |
| table | Delivery table | table | 1 | 936, 312, 472, 556 |

**Match table, v1 to v2**

| v1 | v2 | change |
|---|---|---|
| nav | nav | same |
| filters | filters | same |
| map | map | resized (880x700 -> 620x420), moved (y 168 -> 320) |
| kpis | kpis | moved to the left column |
| table | late-panel | restyled and moved to the top; the user called this the "Late panel" |

The v2 to v3 table is built the same way: the three `filters` pieces merge into one, and `trend` is new.

**Questions the agent asked at Gate 1 (examples of the right kind):**
- "Is the table in v1 the same component as the Late panel in v2, or a new one? I read it as an evolution, since both list deliveries. Right?"
- "The map has ~30 truck markers. I'll treat the map as one piece and not animate markers. OK?"
- "In v3 the three filters become one bar. Do you want that shown as a merge (converge into one), or as a stack that unfolds?"

---

## Phase 3: directions proposed

> Here is how I'd shape each iteration. Pick, mix or reject.
>
> **v1 (calm): Blueprint Studio.** Quiet drafting-table assembly. Shell rises, nav slides in, cards unfold, orbit settles to the flat dashboard. One cursor places the map. *Why: v1 is the baseline; the viewer should see structure before the story gets lively.*
>
> **v2 (lively): Workshop.** Teammate cursors place pieces. A comment pin opens quoting the ops manager, a sticky note appears, then a selection box and live ruler show the map shrinking and the Late panel moving up. *Why: v2 is the feedback-driven change.* Alternative: **Light Table**, with v2 fading in as a translucent layer above v1 and the changes glowing in the accent color.
>
> **v3 (resolved): Teardown.** Locked isometric, crisp exploded view with leader lines, a callout naming the new trend chart, and a metric chip. The three filters visibly merge. *Why: v3 is about structure and proof.* Alternative: **Control Room**, with a pulsing selection and ticking chip.
>
> Constant across all three: line weight, label type, accent color, grid, and a flat-front hold at each resolve.

---

## Gate 3: beat sheet (excerpt)

Scroll budget: 1400vh total. Mode: hybrid (continuous, with soft snaps at the Resolve holds). Cells marked **(agent choice)** are mine, so you can redirect.

| Beat | Scroll | Camera | Hero motion | Support | Living layer | Story line |
|---|---|---|---|---|---|---|
| v1 Assemble | 0.00-0.12 | iso, orbit -45 to -20 | Shell rises, then pieces enter | nav slides, map unfolds **(agent choice)** | Cursor "Kyle" places the map | "The first dashboard put everything on one screen." |
| v1 Resolve | 0.12-0.22 | iso to flat | Fidelity cross-fades to the real v1 | none | none | "It worked, until ops managers used it." |
| v1 Review | 0.22-0.30 | flat, push-in 1.08 on table | Pin opens | Sticky note | Cursor "Maya", pin 1 ("I scroll past the map to find late trucks"), note | "The map buried the one thing they came for." |
| v2 Iterate | 0.30-0.46 | tilt-back to iso, yaw -25 to -38 | Map shrinks, table becomes the Late panel and travels to the top | KPI row slides left | Selection box + live ruler on the map, Kyle drags the panel | "Late deliveries moved to the first thing you see." |
| v2 Resolve | 0.46-0.54 | iso to flat | Real v2 | none | Approved stamp **(agent choice)** | "Faster to the answer." |
| v3 Teardown | 0.54-0.80 | locked iso, side profile at 0.66 | Explode with leader lines | The three filters converge into one bar | Callout "Live trend", measured gap rulers | "Structure over decoration: one filter bar, one trend line." |
| v3 Resolve | 0.80-1.00 | flat | Real v3 | none | Chip "-38% time to find late deliveries", avatar for the ops manager | "The result." |

**Balance check (per beat):** technical (does the motion use real rects and measured values?), aesthetic (one hero motion, a landing?), story (does a sentence in the text column explain it?). Any beat with a "no" gets revised before build.

---

## How it maps to the template

In `assets/scene-template.html`:

- `frames`: three entries (`v1`, `v2`, `v3`) with `src` set to the cropped screenshots.
- `pieces`: one entry per tree row, `rects` with a key per iteration where it exists, `enter` per kind: `page: "rise"`, `nav: "slideL"`, `map: "unfold"`, `kpis: "pop"`.
- `extras`: cursors (Kyle, Maya), one `note`, one `pin`, one `select`, one `ruler`, one `callout`, one `chip`, one `avatar`, one `stamp`, each keyed to a beat range and anchored with `at`.
- `beats`: seven entries, with `snap` set only on the Resolve beats for the hybrid feel.
- The right-hand text sections carry `data-beat` ids that match.

## What this example is *not*

Do not reuse the names, quotes, metrics, directions or beat timings above for a real project. They illustrate the shape of a good run; the user's designs and story drive the real ones.
