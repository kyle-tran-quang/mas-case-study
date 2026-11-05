---
name: ui-assembly-animation
description: Build a scroll-driven showcase animation that tells the story of UI design iterations. Analyzes uploaded final designs (PNG, Figma export, screenshot), derives a clean outlined isometric blueprint from the real components, asks questions instead of assuming, then assembles, rotates, disassembles and morphs the UI between iterations, resolving to the exact final design in front view. Output is a self-contained HTML/CSS/JS scene where scroll is the only timeline control. Use for case study hero animations, iteration storytelling, and "how this UI was built" visuals.
---

# UI Assembly Animation

You build a **scroll-controlled storytelling animation**: a UI is assembled from outlined blueprint pieces in isometric 3D, rotates to a flat front view that is pixel-faithful to the user's final design, then comes apart and reassembles (or morphs) into the next iteration.

The animation sits on the **left half** of a split-screen case study page. The **right half** is the user's text. Scroll position is the **only** timeline control. There is no autoplay, no timers, no play button.

The purpose is visual aesthetics and narrative: *why this iteration exists and what changed*, not documentation of every element.

## Non-negotiable rules

1. **Never assume. Ask.** Any ambiguity about segmentation, grouping, morph targets, story, theme, pacing, or external elements gets a question. Batch questions, number them, give concrete options plus "other", and wait. If an answer is unclear, ask a follow-up rather than picking a default. Do not proceed past a gate with unanswered questions.
2. **The blueprint is derived from the design, not invented.** Every outlined piece maps to a real region of the uploaded image (same position, size, proportion, hierarchy). No decorative filler that is not in the source (external storytelling elements are the exception and must be user-approved, see Phase 3).
3. **The front view is the real design.** At the end of every assembly, the user's uploaded image (cropped per component) is what shows. Never redraw or "approximate" the final look.
4. **Scroll is the sole clock.** Scene state is a pure function of scroll progress `p in [0,1]`. Scrolling backward must play the animation exactly in reverse.
5. **Low fidelity in 3D, high fidelity in front view.** Outlines, thin strokes, subtle fills, tiny labels while in blueprint/isometric. Fidelity cross-fades up only as a piece settles into the front view.

## Workflow

Run the phases in order. Each ends with a gate: summarize what you understood, then ask for confirmation.

### Phase 0: Intake (ask first, before looking deeply at anything)

Skip anything the user already answered; acknowledge what you know. Ask the rest in one numbered message:

1. **Sources**: Provide the design for each iteration (PNG, Figma export/link, screenshot, PDF page). How many iterations, in order? Any desktop vs. mobile variants?
2. **Story per iteration**: For each iteration, what was the problem or insight that drove it, and what changed? (This becomes the choreography, so specifics matter: "merged three filters into one bar", "moved pricing above the fold".)
3. **Output placement**: Which project/file should the scene live in? Is there an existing page, framework, or CSS I must match (React, Astro, plain HTML)? Fixed header height? Breakpoints that matter?
4. **Scroll behavior**: Continuous scrub (default, seamless), snapping to beats, or hybrid? Who is the audience? For portfolios read by busy recruiters, default to **short and punchy** (see the scroll budget rule in Phase 3) and say so.
5. **Theme**: Confirm light (dark grey/black lines on light grey) and dark (light lines on dark) both ship. Default is **per-beat theme set in `story.js`, independent of the OS**; ask only if they want a toggle too. Any accent color for highlights?
6. **Granularity**: Default is sections and major components only (cards, tables, big headings, key numbers, nav, hero media). Paragraphs and body copy are left out. Confirm, and note anything special to always include or exclude.
7. **Range of motion**: Preferred intensity (subtle, balanced, dramatic)? Any motion they dislike (spin that is too fast, overshoot, camera shake)?
8. **Living layer** (collaboration, feedback, annotation): The scene can show collaborators' cursors, comment pins, sticky notes, callouts, live rulers, selection boxes, metric chips, avatars and an approval stamp. Which of these fit the story? For each iteration, what real feedback, research quote, person or metric belongs on screen? (Never invent names, quotes or numbers. If the user has none, leave that element out or mark it as placeholder.)
9. **Blueprint or not, per transition.** Do not assume every transition uses the isometric blueprint. For each transition (including the very first one) ask: *full blueprint* (explode to outlines, reassemble), *light blueprint* (brief lift, then morph), or *UI morph only* (stay flat and real; the layout glides and cross-fades into the next screen)? Recommend UI morph only when the change is small or incremental (a panel resizes, content swaps), and blueprint when the structure itself changes or a first impression is needed. Record the choice per beat in the beat sheet.
10. **Microinteractions**: Ask what small interactions should appear and when, offering concrete options with a recommendation per beat: cursor travel to a target, click or tap (scale dip), hover reveal (tooltip pop), toggle or tab switch, panel resize or fold, content stagger-in, focus ring, typing, drag. Tie each to something visible in the designs (a hovered state, a tooltip, a cursor already drawn in the Figma frame) and never invent UI that is not in the source. Ask whether microinteractions should be exported as separate pieces (e.g. the cursor) so they can be reused.
11. **Reduced motion**: Fallback preference (snap between key poses without interpolation is the default suggestion; confirm).

**Gate 0**: restate the plan in 5-8 lines. Get a yes.

### Phase 1: Analyze each design

For every uploaded design:

1. Read the image. Record the native pixel size. This is the **reference frame**; all coordinates are in reference pixels.
2. Segment into a **component tree**, top-down: page -> sections -> major components. Stop at the granularity agreed in Phase 0. Typical keepers: nav/header, hero heading, hero media, KPI numbers, cards, table, chart, sidebar, filter bar, footer, primary CTA. Typical drops: paragraphs, captions, dividers, icons inside buttons.
3. For each component record: `id` (stable kebab-case), `label` (short human name), `rect {x,y,w,h}`, `depth` (nesting level, 0 = page shell), `kind` (shell | section | card | table | chart | media | heading | number | control | nav), and `parent`.
4. Check alignment: if two components overlap or a rect clips content, fix it. Tight rects matter because the front view is composed from crops.
5. **Cross-iteration matching**: for iteration N+1, match each component to iteration N (same / moved / resized / restyled / merged / split / new / removed). Reuse the same `id` when it is the same thing. This match table drives the morphs.

Present the result as a compact table per iteration plus the match table. Flag every uncertain item.

6. **Rationale (write it, then flag it).** After reading each design, draft a short design rationale: who it is for, what problem the structure solves, and why the main choices (hierarchy, grouping, what was left out) follow from that, using only what is visible in the design plus the user's story. If the user asks you to make it up, write it plausibly but without invented metrics, quotes or names, label it DRAFT in `story.js`, and let them replace it. This rationale becomes the right-hand copy and the justification for each motion.

**Questions to ask here (never skip):**
- Segmentation doubts: "Is this one card or three? Should the stat row be one piece or four?"
- Matching doubts: "Is the new 'Insights' panel the evolution of the old 'Reports' table, or a new component?"
- Over-granular areas: "This dashboard has ~40 tiles. Group them as one 'tile grid' piece, or show a representative few?"
- Anything that cannot be read from the image (interactive states, hidden panels).

**Gate 1**: user confirms or corrects the component tree and match table. Offer to render a quick debug overlay (rects drawn on the image) so they can verify visually; do this proactively when there are more than ~12 components.

### Phase 2: Design the blueprint look

Derive the blueprint style from the UI itself:
- Each piece is an outlined slab: 1-1.5px stroke, near-transparent fill, corner radius copied from the source if visible.
- Elevation encodes hierarchy: `z = depth * lift` so shells sit low and nested components float above, readable as "lego layers" in isometric.
- A tiny mono label tag per piece (the `label`), visible only in blueprint/isometric, hidden in front view.
- Optional inner skeleton lines inside a piece (header line, row lines for tables, bar stubs for charts) **only if they are measurable from the source**. Otherwise leave the slab empty.
- Colors via CSS variables so light/dark is one switch (see `assets/scene-template.html`).

Propose the visual spec (stroke weight, lift height, label style, accent use) in a few lines and ask for adjustments if they have preferences. Otherwise the defaults in the template are the starting point; do not silently deviate.

### Phase 3: Choreograph (the creative core)

Build the timeline as **beats**. A beat is a named span of scroll progress with a camera pose, per-piece poses and a few living elements. Read `reference/choreography.md` for the schema, `reference/morph-catalog.md` for the motion vocabulary, and `reference/directions.md` for creative directions and the balance rubric.

**Start with directions, not moves.** For each iteration, propose 2-3 directions from `directions.md` (name, one-line feel, what the viewer sees, why it fits that iteration's story) and ask which to use, mix or discard. Iterations may use different directions (a good default shape is calm -> lively -> resolved), as long as line weight, typography, accent color, grid and the flat-front resolve stay constant so it reads as one film. Only after directions are chosen, pick specific moves from the catalog.

**Score every beat on three axes** before proposing it: technical (derived from the real design, with true measurements and names), aesthetic (rhythm, one focal motion, a satisfying landing), and story (matches a sentence in the text column). A beat that fails any axis gets changed or cut. See the rubric in `directions.md`.

**The blueprint is optional per transition** (see intake question 9). Only use the arc below for transitions the user chose to show as blueprint. For a *UI morph* transition, keep the camera flat (`rx = rz = 0`), keep `f = 1`, use `G.flat` to interpolate each piece's rect, and let the engine cross-fade the old and new crops. Reveal new content with a short stagger (`y` offset and `o`), and let a microinteraction (cursor tap) trigger the change.

Default iteration arc (adapt to the user's story, do not impose it):

1. **Blueprint**: pieces float apart in isometric, outlines only.
2. **Assemble**: pieces drop in layer by layer (shell first, then sections, then components), lego-style, camera slowly orbiting.
3. **Resolve**: camera eases from isometric to flat front; outlines cross-fade into the real design. Hold here so the right-hand text can land. This is the "complete picture" beat.
4. **Disassemble / Transform**: front view tilts back to 3D, pieces lift apart.
5. **Morph**: pieces travel to their positions in the next iteration (see match table). Moved pieces slide, resized ones scale, merged ones converge, split ones divide, new ones arrive (optionally carried in by an avatar and named with a callout), removed ones fall away or fold. A selection box, live ruler and a dragging cursor make the edit itself feel authored.
6. Repeat from step 2 for the next iteration, ending on the final resolved front view.

Rules for good choreography:
- Every motion must be justified by the story the user gave. If a piece moves, the text beside it should explain why.
- One idea per beat. Do not move everything at once; stagger by depth and reading order (typically 40-90ms of progress-equivalent offset).
- **Scroll budget (portfolio default).** Busy readers must not have to scroll much. Keep the distance between consecutive story sentences (snap anchors of adjacent beats) to **about 100vh or less**, and total `scrollVh` to roughly **100vh x number of beats** (e.g. 3 beats = ~300-340vh). Never go above that unless the user explicitly asks for a cinematic pace. If a draft feels long, cut beats or shorten holds before adding scroll. Compress motion into fewer, shorter ranges rather than stretching the page.
- Keep the camera orbit continuous across beats (no sudden direction flips) and cap rotation speed.
- The front-view hold must be long enough to actually read the design (at least ~12% of an iteration's scroll span).
- Each beat has one hero motion and at most two supporting motions. Everything else is still.
- Living elements (cursors, pins, notes, callouts, rulers, selection boxes, chips, avatars, stamps) make the scene feel inhabited. Cast them by story moment (see the casting guide in `directions.md`), keep at most 3 on stage at once, and use only text, names and numbers the user supplied or approved. They appear in blueprint style and never cover the piece they describe.
- Vary entrance verbs by component kind (shells rise, nav slides, cards unfold, small controls pop) so assembly reads as built rather than stamped.

**Motion ideas**: pull 3-5 fitting options from the catalog for each iteration transition and present them with one-line descriptions. Check the catalog's Engine column: `native` and `compose` moves can be built from the template; `custom` moves need new engine code, so say so and confirm first. Ask the user to choose or mix. Do not decide for them. If the node analysis shows a notable change (merge, split, new, removed), ask specifically how that transformation should read ("when the three filters merge: converge into one bar, or fold into a stack and unfold?").

**Gate 3**: share a beat sheet (table: beat, scroll range, camera, what moves, story line). Get approval before writing code.

### Phase 4: Build

1. Prepare assets: crop each component from its iteration image into `assets/<iteration>/<id>.png` at 2x if the source allows. Keep file sizes sane (optimize/convert to WebP when appropriate and confirm the user is fine with that).
   For a UI morph, a full-frame crop would show stale content under the new screen. Derive a **clean base image**: copy the destination screenshot and erase only the rects of content that will animate in as separate pieces (fill with the sampled panel color), then verify programmatically that no pixel outside those rects changed. Sample colors from the PNG, do not eyeball them. Small assets that travel (a cursor) are exported separately and referenced with a per-rect `img`.
2. Copy `assets/scene-template.html` into the project and fill the `SCENE` object: reference frames, components, iterations, beats, camera keys. Keep data and engine separate so the user can retune timing without touching the engine.
3. Implement scroll mapping: a tall track element with the stage sticky at the left half; progress from scroll position of the track. Snap mode uses invisible sentinels at beat anchors with CSS `scroll-snap`; continuous mode uses none. Match what was chosen at Gate 0.
4. Structure the output as two exportable halves joined by one source of truth, `story.js`. See `reference/story-contract.md` (reference implementation: `bob-scene/`). Each text section carries `data-beat="<beat-id>"`. Use the rationale from Phase 1 as the copy (marked DRAFT) unless the user supplies their own.
5. Themes: light and dark through CSS variables (`--bg`, `--line`, `--line-faint`, `--fill`, `--accent`). The theme is chosen **per beat** (`beat.theme` in `story.js`) and is independent of the OS; do not use `prefers-color-scheme`.
6. Performance: transform/opacity only, `will-change` on moving pieces, no layout thrash, one `requestAnimationFrame` loop that runs only while progress changes. Test with 40+ pieces.
7. Accessibility: `prefers-reduced-motion` -> jump between key poses at beat anchors; stage gets an `aria-label` summarizing the story; decorative layers `aria-hidden`; text half remains the accessible content.
8. Mobile: confirm intent first. Default suggestion is stage pinned on top half, text below, same scroll mapping. Ask before choosing.

### Phase 5: Verify

Do both the visual pass and the measured checks. Screenshots catch what looks wrong; measurements catch what is subtly wrong.

**Visual pass.** Screenshot each beat anchor plus midpoints in light and dark. Check: (a) front views match the source images side by side, (b) labels are legible, (c) nothing overlaps unintentionally during morphs, (d) no more than 3 living elements are on stage at once.

**Measured checks.** Run these in a throwaway copy of the page and read the results from `document.title` or the console:
1. **Error probe.** Add `window.addEventListener("error", ...)` before the script and confirm nothing throws at load or during `render()`.
2. **Clip sweep.** Call `render(t)` for t = 0 to 1 in 60 steps and collect every visible `.piece` and `.ex` whose bounding box leaves `.stage-col`. Expected exceptions are only deliberate slide-ins. Anything else means a yaw/scale pairing is too wide or an annotation is anchored too close to the edge.
3. **Overlay alignment.** With the camera forced flat (`rx = rz = 0`), confirm each ruler spans its piece's edge and each selection box sits at the piece rect plus its padding, within about 1px.
4. **Determinism.** Render forward t = 0 to 1, then backward, then back to a reference t; the inline `style` of every piece must match the first render of that t exactly. This proves scrolling backward reverses cleanly.
5. **Front-view fidelity.** At each resolve hold with a real source image, compare the on-screen crop to the source.

**Capture tip.** Headless screenshots taken after a programmatic `scrollTo` can come out blank. Reliable approach: make a throwaway copy of the page where `progress()` returns a fixed value, screenshot that, and delete the copy. Real scrolling, snap mode, mobile layout and reduced-motion need a real browser; if you cannot drive one, say they are unverified.
- If the browser cannot be driven in this environment, say so and describe what was verified by reading only.
- Report back with the beat sheet as built, anything that deviated from the plan and why, and a short list of knobs the user can tune (stroke, lift, orbit angle, easing, scroll length).

## Question-asking style

- Group questions by phase; never dribble one at a time unless a follow-up depends on an answer.
- Offer concrete options with a recommendation when you have one, plus an "other" path. Use the AskUserQuestion tool when available for choices; use numbered prose for open-ended story questions.
- Show your reading before asking: "I read this as X. Right?" is better than "What is this?"
- If the user says "you decide", record the decision in the beat sheet and mark it as yours so they can redirect.

## Files in this skill

| File | Purpose |
|---|---|
| `reference/directions.md` | Seven creative directions, the technical/aesthetic balance rubric, how to mix them, and a casting guide for living elements |
| `reference/story-contract.md` | The file split (story / scene data / engine / css), the per-beat theme rule, and how to embed either half alone |
| `reference/choreography.md` | Piece, living-element, camera and beat schema; entrance styles; generators; timing; fidelity rules; beat sheet format |
| `reference/morph-catalog.md` | Motion menu (assembly, camera, disassembly, morphs by change type, living elements, UI morph and microinteractions) with an Engine column showing what is native vs. needs custom code |
| `assets/scene-template.html` | Self-contained scroll-driven engine with split layout, light/dark themes, drafting grid, constant-size strokes and labels, and a working two-iteration demo with the full living layer |
| `examples/worked-example.md` | A complete sample run: intake answers, component tree, match table, direction choice, beat sheet |
