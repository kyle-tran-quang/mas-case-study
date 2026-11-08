# Stage C is wired and tested. Stage D may start.

Stage C = beat 11, "the second iteration" (Figma slides 13, 14, 15). It is wired into `story.js`, `index.html` and a new `stage-c.js`; `scene-data.js` is untouched.
Stage D owns `story.js` / `index.html` / `scene-data.js` again from now on.

## The numbers Stage D needs

| | |
|---|---|
| Last beat | `second` (`id: "second"`, 3 text slots `second-1`, `second-2`, `second-3`), range 778 to 1106 vh |
| Final text anchor | **1050 vh** (`second-3`). Earlier anchors: 872 (`second-1`), 945 (`second-2`) |
| End of TIMING | **`TIMING.C.end = 1106`** (the last Stage C window, `TIMING.C.out`, is 1078 to 1106) |
| New `TIMING.MAX` | **1106** (was 778) |
| New `STORY.scrollVh` | **1206** (was 878) |
| Stage D starts at | **1106 vh**: the first Stage D window must start at or after 1106. `STORY.beats` last `range` ends at `1` today; when you append beats, change the `second` beat's `range` end from `1` to `f(1106)` and recompute `MAX` / `scrollVh` |
| Chapters | `second-1` is tick 7, `second-2` and `second-3` are tick 8 (Figma SectionNav). Per-slot `chapter` is supported by `index.html` (`texts[].chapter`) |

## The pose the last frame leaves on stage (what the report must morph from)

Measured on the wired page at a 1440 x 1024 viewport (the Figma reference size), at scroll = 1106 vh:

- the dark window `div.sc-screen`: **680 x 420.05 at (20, 326.34)** in the stage column, scale 1, camera `translate(0,0) scale(1)`
- grey sidebar `div.sc-side`: **231.19 x 419.63 at (0, 0)** inside the window (`#333`), logo / "Maximo Application Suite" / "Your goals and priorities" / "Page 2 of 7" / IBM / the hand-and-flow art
- the form is scrolled to the TOP (`translateY(0)`): progress bar, "GOALS & PRIORITIES", question 1 with its 9 options, the top of question 2. **No option is ticked, no row is hovered, the cursor is hidden.**
- theme `dark`: stage `#262626`, copy column `#161616`
- this frame is **byte-identical** to the Stage C rest frame at 872 vh (checked on the standalone page; on the wired page the same DOM state is identical, but headless Chromium rasterises hairlines slightly differently after a zoom: see Known limits)
- at other viewport sizes the whole stage scales exactly like every earlier beat (e.g. 61, 287, 598 x 369 at 1440 x 900); the pose is "relative to the stage column"

## Is the window a DOM element or part of the piece's HTML?

It is part of **my piece's HTML**, inside a **fixed full-viewport overlay `#stageC`** (z-index 2, `position: fixed`, `pointer-events: none`), which has its own `AssemblyScene` engine instance.
It is **not** in the main `#scene`. Chain: `#stageC > .st-col.asm > .asm-stage > .asm-world > .piece[data-html] > .html-body > .sc-clip > .sc-cam > .sc-screen`.

Hand-over, so there is no double:
- `#stageC` is `visibility: visible` only for `TIMING.C.cover[0] (768) <= scroll vh <= TIMING.C.end (1106)`. It is a pure function of scroll: **nothing to call** (the old `hide()` / `show()` were removed). Past 1106 it is already hidden, so Stage D draws its own identical window at its p = 0 and nothing is doubled. Scrolling back past 1106 brings the overlay back at the same pose.
- `stage-c.js` also keys Stage B's last pieces to opacity 0 one vh after the cover is complete, so the main `#scene` under the overlay is empty (verified: no visible piece at 1106).
- The overlay sits ABOVE the layout and BELOW the progress nav. If your report window is drawn in the main scene it will not show until 1106; if you need it earlier, raise `TIMING.C.end`.

## What was verified (real browser, headless Chromium, 1440 x 900 unless noted)

- real wheel scrolling from the top to the very end: no console errors, no failed requests, no horizontal overflow
- 21 scroll positions forward, a full scrub back, then the same positions again: identical DOM state (piece) and identical frames (page, 863 -> 1000 -> 863: 0 px)
- the stage is still (0 px between frames 0.7 s apart) at all three text anchors
- Stages A and B unaffected: positions 0 to 450 and 738 are pixel-identical to the page without Stage C; 553 and 633 differ only by the same noise the unmodified page shows against itself (121 px, max 13)
- pacing audit (`ui-assembly-animation/assets/pacing-audit.js`, Stage C windows described as extras): no text anchor on a moving stage, no dead scroll, no move under 8 vh, rests long enough for their copy (37 / 38 / 56 vh for 30 / 24 / 56 words), anchor gaps 73 and 105 vh
- measured on-screen speed per px of scroll: frame slide 5.5x, zoom in 5.4x, zoom out 5.9x (limit 6x)
- Figma comparison at 1:1: the rest frame matches slide 13's stage in 98.9 % of pixels (mean difference 0.98 / 255); every measured element is within 0.5 px of Figma's node geometry except text-box heights
- active tick: 6 (Stage B) -> 7 (C1) -> 8 (C2, C3), as in Figma
- reduced motion: the three text slots jump between three distinct poses
- desktop widths 1280, 1440, 1920 and a short 1280 x 640 viewport: no errors, correct slots

## Known limits / not verified (please do not assume these pass)

- **Mobile (<= 800 px) is NOT verified.** The overlay's start pose is computed for the stage column and the page loads without errors, but my scroll test helper cannot place a mobile scroll position, so the text positions and the stacked layout were not checked. Stage A and B's own text is also off-screen at the positions I could test, so mobile may be broken before Stage C.
- **Real scrolling feel on a trackpad, real GPU rendering, Safari and Firefox were not tested.** Headless Chromium rasterises hairlines differently after a zoom-and-return (about 3,300 anti-aliased edge pixels differ between two visits to the SAME pose with an identical DOM). I could not tell whether real Chrome does the same.
- **The progress nav's active tick is `#f4f4f4` on the dark page.** Figma draws it `#000` on slides 13 to 15, which is invisible on `#161616`. I kept it visible on purpose; flagged to the author.
- **The pacing audit still flags the scan-line reveal (7.7x)**: it is a 1 px line crossing 420 px of the window, not a body of content, so I left it.
- **The dotted wireframe is a simplified version** of `transitions-ui-generation` (no dot field, rain, reticle or log panels), rebuilt as a pure function of scroll because the skill's `generate()` only runs on a clock.
- **The hand-over from Stage B into C1** (a light cover fading in over the end of B's rest) is my design; it was never specified.
- My own decisions, not in Figma: 70 % starting frame, 2.1x zoom, the cursor ticking options 1 to 3, the 272 px scroll, the exit zoom-out (so the last frame is the rest pose), all timings.

## Files

New (all in `m-goat/`): `stage-c.js` (wiring + overlay), `stagec-piece.js` (the dark screen, wireframe, scroll, zoom, cursor), `stagec-data.js` (local timing + copy), `stagec.css`, `stagec-test.html` (standalone scrub page with a slider), `assets/stagec/`.
Edited: `story.js` (TIMING.C, MAX, scrollVh, the `second` beat, `first`'s range end), `index.html` (stagec.css link, IBM Plex Serif in the fonts URL, three script tags, the `SCENE.afterRender` hook, the nav theme, per-slot chapters, per-slot reduced-motion poses).
Not touched: `scene-data.js`, `stage-b.js`, `stage-b.css`, `v1-ui.js`, every Stage D file.
