# Stage D is wired and checked. Stage E may start.

Stage D = Figma slides 16, 17, 18, 19 (the report, trust + progressive disclosure, the APM expansion card, the numbers zoom). Wired into `story.js`, `index.html` and a new `stage-d.js`; `scene-data.js` is untouched.
`story.js`, `index.html` and `scene-data.js` are Stage E's again from now on.

## 1. Beat ids and TIMING keys added

| Beat id | Figma slide | range (vh) | text anchor (vh) | chapter tick | words |
|---|---|---|---|---|---|
| `report` | 16 | 1106 to 1208 | **1155** | 9 | 32 |
| `trust` | 17 | 1208 to 1317 | **1262** | 9 | 46 |
| `expansion` | 18 | 1317 to 1415 | **1372** | 10 | 29 |
| `numbers-zoom` | 19 | 1415 to 1480 | **1458** | 10 | 35 |

Anchor gaps: 105 (from Stage C's 1050), 107, 110, 86.
The `second` beat's `range` end was changed from `1` to `f(1106)`.

`TIMING.D` (story.js), all in vh of scroll:

```
cLast:  [1090, 1100]   frozen Stage C last frame + report shell fade in UNDER Stage C's overlay (opaque until 1106.05)
fade:   [1106, 1114]   the frozen last frame fades out as the report grows
report: [1106, 1142]   entrance (window grows, strip draws, bars fill)         rest 1142 to 1184
trust:  [1180, 1336]   trust-piece window (its TOTAL_VH = 156): cue 1184, cards pull apart 1192 to 1238, rest 1238 to 1286, tab cycle 1286 to 1336
exp:    [1324, 1352]   three cards converge into the expansion card            rest 1352 to 1392 (hover loop on a free clock)
zoom:   [1392, 1437]   card zooms to 1.6x onto Potential outcomes              rest 1437 to 1480
end:    1480
```

## 2. The final TIMING.MAX and scrollVh

- **`TIMING.MAX = 1480`** (was 1106)
- **`STORY.scrollVh = 1580`** (was 1206)
- Stage E starts at **1480**: its first window must start at or after 1480. When you append beats, change the `numbers-zoom` beat's `range` end from `1` to `f(1480)` and recompute `MAX` / `scrollVh`.
- Wiring pattern, same as Stages B and C: a script loaded after the previous stage. Stage D adds `report-piece.js`, `trust-piece.js`, `expansion-piece.js`, `stage-d.js` after `stage-c.js` in `index.html`. Pieces are appended to the main `SCENE` (`SCENE.pieces.push`) and activity inside `update()` hooks is declared in `SCENE.extras`.
- `window.StageD = { REPORT, TRUST, EXP, CL }` is exported for reference.

## 3. D's end pose, as numbers (what Stage E must hand over from)

Measured in the real page (`#scene [data-ep] [data-card]`), at scroll 1437 and 1480 (identical, the zoom has landed):

| | |
|---|---|
| expansion card `transform` | `translate(23px, -411.06px) scale(1.59153)` |
| card scale | **1.59153** (= 878.524 / 552, Figma 231:6650) |
| card x, y | **23, -411.06** (stage px, top-left of the unscaled box) |
| card rect on the stage | **x 23, y -411.1, w 878.5, h 1277.9** (stage = 720 x 1024; the card is clipped at the stage's right edge and above its top, as in Figma: the author's known quirk) |
| card inner height | 802.94 (default rail, loop folded away) |
| what is visible | the lower part of the card: the "What it takes to achieve your target stage" copy, **Potential outcomes** (Up to 47% / 10 to 20% / Continuous), "What capabilities are you using...", the capability chips, the "Talk to a seller" button. The yellow / green stage panels are cropped at the top. |
| loop | off (folded away over the first 30% of the zoom); no cursor |
| theme | `dark`: stage `#262626`, copy column `#161616`, card `#393939` |
| chapter tick | 10 |

The piece is `div[data-ep]` inside the **main scene** (z-order = array order, last in `SCENE.pieces` is on top). Stage D's pieces are `c-last`, `report`, `trust`, `expansion`; the last three have no opacity-out key after 1480 because nothing follows yet, so Stage E must key them to `o: 0` (or draw above them) from its own first window. `expansion` is the one still on stage.

## 4. What was verified (real browser, headless Chromium, 1440 x 900)

- no console errors, no failed requests, through the whole page (Stages A to D)
- **pacing audit** (`pacing-audit.js`, `SCENE.extras` declares the in-hook activity): inside Stage D's span, no `tooShort`, `tooFast`, `deadScroll`, `notAtRest`, `holdTooShort`, `overlapping`, `crowded`
- **determinism**: 61 steps forward then back, canonical DOM (style text + attributes) per piece: all four Stage D pieces identical. The only mismatch on the page is piece 1 (the Stage A dashboard) at t = 0, a pre-existing invisible engine quirk (`paintLayer` leaves stale state on opacity-0 layers)
- **stillness** (two frames 0.8 s apart, 720 x 900 stage crop): pixel-identical at 1155 (after the move from 1163), 1262 and 1458. At 1372 the stage moves, by design: the expansion card's hover loop runs on a free clock there (the author-approved exception, confined to that beat)
- **hover loop clock** (`SCENE.handClock`, shared with the hand card): runs on the expansion card (3.5 s measured), is 0 away from it, and under `prefers-reduced-motion` stays 0 with the cursor hidden
- **hand-over from Stage C**: the Goals form holds at 1108, dissolves into the growing report window by 1112 to 1118, no pop at 1106
- screenshots at 1106 to 1480 compared with the Figma frames 208:8302, 208:9293, 208:9367, 231:6650: report, trust and expansion match; the capability chips are present

### Bugs found and fixed while wiring

- the expansion card's capability chips used the class `.tag`, which the engine's own CSS (`.asm .piece .tag { display: none }`) hides: renamed to `.chip`. **Piece class names must not collide with the engine's: `.tag`, `.outline`, `.layer`, `.paint`.**
- the report piece's opaque window painted over the frozen Stage C frame: the `c-last` piece is now added AFTER the report so it stacks above it
- from the Stage D verifiers: hero ease too steep (report), a 2 px reveal offset, a hard switch of the hover loop at `enter = 1` (expansion), a zoom curve ~3x too steep (expansion), the trust cursor moving ~22x faster than the scroll (trust, tab cycle stretched from 125 to 156 vh), "48/100" not loading IBM Plex Math (now self-hosted from `assets/expansion/`)

## 5. Not verified / known limits (please do not assume these pass)

- **Mobile (<= 800 px) is NOT verified** for Stage D (same as Stages A to C).
- **Real trackpad scroll feel, real GPU rendering, Safari, Firefox: not tested.**
- **The whole-story pacing audit still fails `pass`** (`overBudget`: 1580 vs a 1540 budget; `anchorGapOver100: 2`, gaps 105 and 107; Stage C's own 134 gap is from Stage C). Stage D's own span has no flags.
- **Open decisions for the author**: the pointer arrow on the expansion card is stageshow's arrow (the Figma frames draw no cursor); the trust piece prints mono size tags during the pull-apart ("BANNER 607x138"), which are not in Figma; the "Work management" and "Scheduling" tab panels are grey placeholder skeletons because Figma has no copy for them. Defaults kept.
- Hover-02 sits at a fixed card top of 111 where Figma's frame has 105 (deliberate: the card top stays fixed so it does not bob, per `FIGMA-HANDOFF-expansion-card.md`).
- Sub-pixel (0.52 px) hairlines render as 1 px at 1x device pixel ratio in Chromium.
- The slide 17 trust tab cycle, the hover-02 pose and the hover loop mid-transitions have no Figma frames to compare against.
- Stage D's own `story.js` motion strings describe the intent; the beat sheet is in the header of `stage-d.js`.

## 6. Files

New (all in `m-goat/`): `stage-d.js` (wiring), `report-piece.js`, `trust-piece.js`, `expansion-piece.js`, `tools/report-harness.html`, `tools/trust-harness.html`, `tools/expansion-harness.html` (standalone scrub pages), `assets/report/`, `assets/expansion/`.
Edited: `story.js` (TIMING.D, MAX, scrollVh, the `second` beat's range, four beats, the header status block), `index.html` (four script tags), `stage-c.js` (one line: `window.StageC` now also exports `T` and `START`).
Not touched: `scene-data.js`, `stage-b.*`, `stagec-*`, `v1-ui.js`.
