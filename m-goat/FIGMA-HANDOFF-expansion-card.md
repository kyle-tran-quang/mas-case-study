# Handoff: APM expansion card animation (slides 18 and 19)

Build this animation **from the Figma frames**, not from the screenshots in this note. Figma wins over any text here if they disagree. Read the nodes with the Figma MCP (`get_design_context`, `get_screenshot`, `use_figma` read-only) and export the card as real assets, the way the other beats in `story.js` do.

- Figma file key: `1r4UreOVeEqdcXvnD5cetk` (page "MGRAT Case study")
- Page frame: `208:5718` "Case study / full page (v2 revised)". Each slide is 1440x1024: left half is the stage (720x1024), right half is the text column.
- Follow the repo conventions in `m-goat/story.js` (beats with `range`, `snap`, `pose`, `theme`, `copy[]`), the pacing rules in `.claude/skills/ui-assembly-animation/reference/pacing.md`, and the "ask, don't assume" rule in that skill's SKILL.md.

## What the two slides are

| Slide | Node | Right-hand copy (author's wording, verbatim from Figma) | Left stage |
|---|---|---|---|
| 18 Value of expansion | `208:9366` | "After that, we needed to show the value of expansion." | Whole APM expansion card, then the stage rail hovers |
| 19 Value of expansion numbers | `237:6740` | "For each maturity stage, I made sure that every action displays clear financial impact, benefits and ROI metrics (based on IBM Institute for Business Value) so the reader has instant proof to secure leadership buy-in." | Zoom into the Potential outcomes numbers |

Slide 18's Figma text starts with "After that,"; `mgoat-case-study-revised.md` does not. The author edited it in Figma, so use the Figma wording (same rule as the header of `story.js`).

Slides are numbered in the revised frame only. Slides 20 (next steps), 21 (maturity maps) and 22 (to be continued) follow and are out of scope here.

## Keyframes (left stage, each a 720x1024 frame)

All four sit in a row in section `120:159`, below the slides. Names start with `Stage / APM expansion card /`.

| Beat | Node | What it shows |
|---|---|---|
| 1 Whole card | `231:6367` | Default rail: stage 01 (yellow) and stage 02 (green) open, 03-05 collapsed |
| 2a Hover stage 01 | `231:6448` | Stage 01 expanded, 02-05 collapsed |
| 2b Hover stage 02 | `231:6534` | Stage 02 expanded, 01 and 03-05 collapsed |
| 3 Numbers zoom | `231:6650` | Card scaled 1.6x, centred on the Up to 47% / 10-20% / Continuous block |

Beats 1, 2a, 2b belong to slide 18. Beat 3 is slide 19 (its left panel is a clone of `231:6650`).

Intended sequence on slide 18: whole card, then stage 01 expands and contracts, then stage 02 expands and contracts. **The 01-then-02 order is my assumption.** Confirm it.

## Geometry (reference pixels, measured from the frames)

Card (`Frame 2732`, 552 wide):
- Beat 1: 552 x 802.9, at (84, 111) in the stage.
- Beats 2a/2b: 552 x 813.6, at (84, 105). The card is 10.7px taller because the hover rail is taller, and it is re-centred, so it moves up 6px.
- Rail position inside the card: x 17.3, y 66.3 in every beat.

Rail:
- Default (beat 1): 522.5 x 273.1. Open panels 186.9 wide, collapsed panels 41.9 wide, gap 5.75.
- Hover (2a, 2b): 522 x 283.8. Expanded panel 351.7 wide, collapsed panels 36.6 wide, gap 5.97.
- Rail node ids: default `231:6373`, hover 01 `236:6731`, hover 02 `231:6613`.
- Everything below the rail (What it takes, Potential outcomes, capability tags, CTA) sits 4.6 to 10.7px lower in the hover beats than in beat 1. Decide with the author whether to animate that shift or fix it. Ask.

Numbers zoom (beat 3):
- Card scale 1.6, at (23, -411.1), 878.5 x 1279.1.
- The numbers cluster (Potential outcomes block) spans x 50-670, y 394-630 in the stage and is centred at (360, 512).
- **Known issue:** the zoomed card's right edge is wider than the 720px stage and is clipped. The author said this is enough for the demo. Do not "fix" it without asking.

## Colour and type

- Stage theme is the **Gray 90 Theme** mode of the `Theme` variable collection (not Gray 100). Card `#393939`, left stage `#262626`, right panel `#161616`.
- Stage fills are variable-bound: yellow `Support/support-warning` (#f1c21b), green `Tag/Green/tag-hover` (#74e792), dark text on both `Text/text-inverse` (#161616).
- Fonts: IBM Plex Sans (UI text), IBM Plex Math Regular (the big 01/02 numerals, 64px in the hover panels), IBM Plex Sans Condensed in places. Check `m-goat/` for which of these are already bundled; `IBM Plex Math` could not be loaded in Figma's plugin environment, so verify it renders in the browser.

## Hover content

Use the real text from the nodes, do not retype it:
- Stage 01 expanded copy: `236:6731` (author's source frame: `235:6722` "Stage 1 hover").
- Stage 02 expanded copy: `231:6613` (author's source frame: `216:14065` "Hover = expanded").

The author's source frames are untouched. The copies in the keyframes were scaled to the card's 522px rail width (scale 0.7468) and had their fills bound to tokens, so prefer the keyframes for geometry.

## Open questions (ask the author before building, per the skill)

1. **Hover mechanics.** Is there a visible cursor that moves to each stage, or does the rail change on its own? `bob-scene/assets/cursor.png` exists if a cursor is wanted. Do not invent UI that is not in the Figma frames.
2. **Transition style.** UI morph only (stay flat, cross-fade and resize) or any blueprint treatment? The Figma frames only describe flat states.
3. **Sequence and loop.** 01 then 02, as above? Does each stage contract back to the default rail before the next expands, or does it go straight from 2a to 2b?
4. **Rail height jump.** See the geometry section: 273.1 vs 283.8 and the shift below.
5. **Slide 19 zoom.** Zoom in place on the same card, or cut? Pacing: how many vh does the zoom get against the 70vh pitch used in `story.js`?
6. **Reduced motion.** Which pose is the still fallback for slide 18 (beat 1 is the likely answer) and slide 19 (beat 3)?

## What I did not verify

- I did not look at the 2b render after the last changes, or at the labels above each keyframe in Figma.
- I did not check the section-nav ticks on the renumbered slides visually. By inspection, slides 18 and 19 both highlight the same chapter tick (index 10).
- The mapping of hover states to real Maximo UI behaviour is the author's design. I have not seen a prototype.
