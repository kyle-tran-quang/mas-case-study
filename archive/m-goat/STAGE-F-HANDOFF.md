# Stage F hand-off (slides 21a, 21b, 22 + dark-to-light transition)

Status: **planned and approved, no Stage F code written yet.** Stages A–E are built and wired. Nothing is committed to git.

## Instructions still in force
- Use `/ui-assembly-animation` (`.claude/skills/ui-assembly-animation/SKILL.md`) for the dark-to-light blueprint beat; `/stageshow` look and rules (content moves instead of swapping, cursor enters already moving, tap scale dip) for the single-to-comparison transition. **Plain JS scrubbed by scroll, do not embed the React kit, skip `film.mjs`.**
- No interactivity. The cursor is drawn only (no pointer events). Feel: "very smooth, not too brisk".
- Reduced motion: snap between key poses (blueprint, single, comparison, empty).
- Dark-to-light = **1B full blueprint**: Stage E card explodes into outline slabs, theme flips while in blueprint, the new window builds up layer by layer. Flip is a **scroll-scrubbed interpolated** `--flip`, not a hard `data-theme` switch.
- Minimal changes; prefer editing tools. Finish by running the pacing audit and reporting: beat sheet and worksheet as built, audit result, deviations, tunable knobs.

## Approved plan (local vh, 0 = global 1620)
`TIMING.F = { start: 1620 }`, Stage F length 416, so `TIMING.MAX` 1620 -> **2036** and `STORY.scrollVh` 1720 -> **2136**.
Easing: `inOutCubic` for camera and fades, `inOutQuart` for piece travel, no overshoot (`inOutSine` also exists).

| Local vh | Part | What happens | Text column |
|---|---|---|---|
| 0–38 | Lift (hero) | Stage E dark card tilts to iso and breaks into outline slabs | E sentence leaves; column empty 0–46 |
| 26–46 | Theme flip | stage, text column, nav flip dark -> light while pieces are outlines; outline opacity dips to ~0.25 at ~36 | column bg flips in lockstep |
| 46–96 | Rest 1 | blueprint hold | **21a**, anchor 76 |
| 96–158 | Assemble (hero) | window builds layer by layer into flat front view; stagger 96–128; crossfade to real design 138–158 | |
| 158–198 | Rest 2 | single-stage window still | **21b para 1**, anchor 178 |
| 198–220 | Cue | cursor travels (enters already moving) to "Compare stages" toggle | |
| 220–228 | Tap | scale dip ~0.92 + ring | |
| 226–238 | Toggle | knob slides, track grey -> green `#24A148` | |
| 238–284 | Single -> comparison (hero) | stage tabs become "Choose 2 stages" checkbox row; Stage 1 reflows narrower, lockstep | |
| 254–300 | Supporter | Stage 2 column + blue "Feedback" tab arrive staggered | |
| 300–306 | Cursor out | fades | |
| 300–340 | Rest 3 | comparison still | **21b para 2**, anchor 318 |
| 340–376 | Exit (hero) | window tilts back to outlines and fades, leaving empty `#F4F4F4` stage | "To be continued..." arrives at 340 |
| 376–416 | Rest 4 | empty stage to end of page | same sentence, anchor 396 |

Global anchors: 1696, 1798, 1938, 2016. Known flags (user accepted): 178->318 gap is 140 vh vs audit limit 105; text column empty ~0.5 s; rests ~41% of scroll; whole-story audit was already over budget before F (+~16 vh from F); mobile/Safari/Firefox/trackpad never tested.

### Copy (verbatim from Figma)
- **21a:** "To give leaders clarity without forcing two different systems onto one scale, I split asset management into two parallel paths: one for tracking equipment health and one for managing technicians in the field."
- **21b** (split at the paragraph break into two slots): "Stages 1 to 5 for each path helps executives pinpoint exact gaps in their hardware monitoring, versus on-the-ground execution." / "A comparison view helps them guide the conversation to the customer about where they’re at and the target stage."
- **22:** "To be continued..."
- Progress nav chapter for 21 and 22 = **11** (12th tick). Stage D/E use 10.

### My decisions (user can redirect)
21b copy split in two slots; exit tilts back to outlines and fades; everything is live HTML at Figma pixel sizes; cursor drawn only; Feedback tab pops in with Stage 2; flip via interpolated variable on stage, column and nav.

## Build steps remaining
1. `stagef-data.js`: `TIMING`, `GEO`, `COPY`, `ANCHORS`, `poses`, `toGlobal`, `auditScene`/`speedReport`, hand-over notes. Copy the pattern of `stagee-data.js` (it also shows `PEAK`, `FIT`, `auditNote`).
2. `stagef-piece.js` + `stagef.css`: live-HTML window, toggle, tabs -> checkboxes, Stage 2 / Feedback arrival, drawn cursor + tap ring. `update(body,k,t)` must be a **pure function of t** (no timers, no CSS transitions, refs on `body.__xx` not closure). Explicit colours only (see `stagee.css`, `stagee-piece.js`).
3. `stage-f.js`: slabs and camera keys (ISO tilt, flat, tilt for exit), `--flip` interpolation, takeover from `"stagee"` (new slab pieces take over at local 0 with ~0.0005 overlap keys so there is never an empty frame; see Stage B capabilities -> pieces swap), exit keys, `SCENE.extras` for the audit, append to `SCENE.ariaLabel`.
4. Wire: `story.js` (`TIMING.F`, `MAX` 2036, `scrollVh` 2136; change `next-steps` beat range end and the `e2` `to` from `1` to `f(1620)`; add Stage F beat(s) with texts `f1` 21a snap local 76, `f2` 21b p1 at 178, `f3` 21b p2 at 318, `f4` "To be continued..." at 396; light theme, chapter 11; update header comment). `index.html`: link `stagef.css`, add scripts after `stage-e.js`; handle the flip in `paint()` like the `cdark` hook (apply the interpolated colours to `#layout`, `#scene`, `#progress` inline).
5. Verify: no JS errors (only the favicon 404 is expected), forward/back determinism, screenshots at each anchor vs Figma frames, outline/line contrast through the flip, pacing audit, reduced motion, clip sweep, re-check Stage E hand-over after its range end changes.
6. Final report (see Instructions).

## Facts discovered (so nobody re-reads them)

### Engine (`assembly-engine.js`)
- Piece keys props: `x,y,z,rx,rz,s,o,f,tg,rect,e`. Unset props carry forward; each segment eases into its end key with `key.e`. Default camera `{rx:55,rz:-45,s:0.7}` is overridden by scene camera keys; flat is `{rx:0,rz:0,s:0.8}`.
- HTML piece: `piece.html` + `piece.update(body,k,t)`; the box is the piece rect. Paint slabs: `piece.paint {fill,stroke}` fade to a blueprint tint as `f` drops; `piece.noTag` hides the blueprint tag.
- Engine sets `root.dataset.theme` from the beat `theme`. `preserve-3d` only while `|rx|>0.01`. A piece with `will-change: opacity` flattens its 3D (see `stage-b.css` annotation workaround). `SCENE.afterRender(t)` and `SCENE.extras` exist.
- Stage B (`stage-b.js`, `stage-b.css`) is the reference: `ISO={rx:60,rz:-45,s:0.8*KC}`, `KC=2√2/√5`, `ZK=KC·√3/2`, `plane()`, `unproject()`, `flatPath()` (straight on-screen path during a camera move), `.sb-face` slabs coloured in `update`, `hex/mixc/css` helpers. `stage-b.css` sets `.asm-stage{perspective:none}` already.

### Stage E hand-over
- Piece id `"stagee"`, depth 22, rect = whole stage 720x1024, root clips to the stage, default transform origin (so `s` scales about (360,512)).
- Held at local 0 (global 1620) in the 20b pose: card at stage (34, −226.734), scale 1.4, visible region x 34..720, y 0..704. See `STAGEE.endPose` and `STAGEE.handover.f` in `stagee-data.js`.
- It is not blueprintable as is, so slabs must take over from it.

### Theme and text wiring (`index.html`)
- `paint()` sets `layout.dataset.theme` from the beat; `cdark` hack: `cur.id==="second" && layout.dataset.cdark!=="1" ? "light" : cur.theme`. Nav `#progress` gets `prog.dataset.theme`; `.progress i.act` is `#000` light / `#f4f4f4` dark.
- Dark tokens in `stagec.css` `[data-theme="dark"]` (`--bg #262626`, `--page #161616`, `--text #f4f4f4`, `--line #f4f4f4`); light in `scene.css` (`--bg #f4f4f4`, `--page #fff`, `--text #000`, `--line #1c1c1f`). Text-column fade is time-based (`transition: opacity .35s`).
- Text slots: beat `texts:[{id,snap,from,to,chapter,copy}]`; outgoing `to` and incoming `from` must be identical. `story.js` uses `f = vh => vh / TIMING.MAX`.

### Figma (file `1r4UreOVeEqdcXvnD5cetk`; nodes 21a `208:9517` stage `208:9518`, window `235:9309`; 21b `235:8230` stage `235:8231`, window `235:8232`; 22 `208:9575` stage `208:9576`)
Reference PNGs: `m-goat/assets/stagef/f21a.png` (single-stage view) and `f21b.png` (comparison view), both 2x. **Note: the `read_file` image previews came back swapped; the files themselves are named correctly.**

Stage 720x1024 `#F4F4F4`. Window 600x600 at stage (60,212), white, content clipped at its bottom; shadow layers: `0.96 1.37 1.82 rgba(0,0,0,.09), 2.9 4.14 5.52 .07, 5.54 7.92 10.56 .05, 8.78 12.54 16.73 .03, 12.55 17.93 23.9 .02, 16.8 24 32 .02`.
All window sizes below are in window-local px (this window is drawn at roughly 0.3x of normal UI sizes).
- **Header** (UI shell, `#F4F4F4`, 18.18 high, bottom border `#C6C6C6` 0.38): "IBM" (Plex Sans 5.3/6.82, `#161616`) + "Maximo Growth Opportunity Assessment Tool" (SemiBold); divider; "Overview" (`#525252`); "Opportunity paths" (selected, `#161616`, 1.14 bottom border `#0F62FE`). Item padding 5.68/6.06, gap 3.03.
- **Header section** (`#F4F4F4`, padding 30.3/87.88, width 600, bottom border `#E0E0E0` 0.38): Maximo logo 24.24 (`IBM Maximo Application Suite` svg) + "IBM" Regular and "Maximo®" SemiBold at 12.12/21.97 ls .0161em; heading "Plan your customers’ next move" Plex **Serif Light** 18.18/1em `#000`; subtitle 6.06/8.33 `#161616` "Assess where customers’ assets performance and field service management operations stand today and advance toward reliability-driven, self-optimizing operations." Gaps 12.12.
- **Tabs** (width 600, padding 0/87.88, tab padding 4.17/6.06, gap .38, bottom border .76): "Field Service Management (FSM)" selected (SemiBold 5.3, `#161616`, border `#0F62FE`); "Asset Performance Management (APM)" (`#525252`, border `#C6C6C6`).
- **Information section** (white, padding 30.3/87.88/60.6, gap 31.82, bottom border `#C6C6C6`): left rail (padding 30.3/0, gap 12.12) = vertical tabs width 62.12 (rows 24.24 high, text col padding 0/6.06; selected "Where the customer is" SemiBold with a 1.14 wide `#0F62FE` indicator, others `#525252` with a `#C6C6C6` 1.14 indicator: "Value after resolving", "Pilot recommendation", "Key milestones", "Getting started (minimal viable steps)") + button "Download APM maturity map" (`#0F62FE`, white 5.3 text, padding 5.68/24.24/5.68/6.06, download icon 6.06 at x 88.88).
- **21a right column** (gap 18.18): row = Tabs (width 212.5; "Stage 1" selected … "Stage 5") + Toggle (track 18.18 wide, `#8D8D8D`, radius 4.55, padding 1.14, white knob 6.82; label "Compare stages" 5.3/6.82; gap 3.03). Then "Stage 1 Reactive execution" (10.6/13.64) and blocks (gap 9.09): "Where the customer is" 7.58/10.61 + four tags `#D0E2FF` / `#0043CE` 4.55/6.06 ls .0267em radius 3.41 ("Paper or digital work orders", "Limited technician visibility", "Minimal dispatch", "Owner rather than assigned resources"; gap 3.03), body 6.06/8.33; "Are you ready?" box (`#F4F4F4`, padding 6.06, gap 6.06, check icon 6.06, 4.55 label + 5.3/6.82 text); "Value after resolving"; "Pilot recommendation"; "Key milestones" accordion (254.13 high, top border `#C6C6C6`, "Standardized Asset Registry" etc.); "Getting started (minimum viable steps)" checklist (not visible, clipped).
- **21b**: same header, hero, FSM/APM tabs, left rail. Right column: "Choose 2 stages for comparison" checkbox group (width 212.5; label 4.55 `#525252`; Stage 1 and 2 checked-filled, 3–5 unchecked; 5.3 text) + Toggle (track `#24A148`, justify flex-end). Two columns (gap 12.12) separated by a 0.38 `#C6C6C6` line: Stage 1 and Stage 2, each with a "Where the customer is" tag group, paragraph, "Is the customer ready for this stage?" box, etc. Stage 2 paragraph: "A planner or supervisor is actively coordinating work — but mostly manually through Assignment Manager or by placing work orders directly. There is basic scheduling visibility but no structured forward-planning horizon. The key advance is centralized management of assignments and beginning to look ahead more than a day at a time. The Scheduling / Dispatch Dashboard becomes the right interface — resource availability and demand across a rolling window, without Optimizer." Box: "Is the customer ready for this stage?" / "Work orders carry scheduled dates and a forward planning horizon is established (weekly to monthly). A centralized scheduler or dispatcher role is active in Assignment Manager, workforce availability is enriched with exceptions, and job plans gain materials, tools, and classifications. HSE, Inspections, and Inventory enter as parallel capability layers." Only the top of these columns is visible in the 600x600 window (clipped).
- **Feedback tab** (blue `#0F62FE`, width 12.06, padding 3.03, radius .76/.76/0/0, white 5.3 text "Feedback", vertical). 21b position at window-local (587.94, 476.96) with the tab rotated vertically along the window's right edge (in `f21b.png` it sits on the right edge at ~y 1345–1400 of the 1406x2000 preview). In 21a its node is off-window at y −137.8 (hidden).
- **Full 21b node dump**: `/var/folders/z2/qwznm5812t94ds1cbkv3fwh80000gn/T/bob-tool-outputs/tooluse_NI04OUV3S6HiGP54geY9Zq.txt` lines ~1929–2482 (may be gone); re-fetch with `mcp__figma-mcp__get_figma_data` if you need more nodes.
- Slide 22: empty `#F4F4F4` stage; text Plex Sans 450, 32 px, `#161616`: "To be continued...".
- Fonts IBM Plex Sans / Serif (300) / Mono are already loaded by `index.html`.

### Environment
- No PIL/numpy. Playwright in `/tmp/pw` (`run.js`, `run2.js`) using the cached Chromium. Verify pattern: scroll to `layout top + v*innerHeight/100`, wait ~900–1200 ms, screenshot, read `#text section.active`.
- Static server: `python3 -m http.server 8765` from the repo root (background pid 66828, may need restarting) -> `http://localhost:8765/m-goat/index.html`.
- Pacing audit: `.claude/skills/ui-assembly-animation/assets/pacing-audit.js` `pacingAudit(SCENE)`; copy the `auditScene()` / `speedReport()` pattern from `stagee-data.js`.

## Done this project (for context)
Stage D (slides 16–19) done. Stage E (slides 20a/20b) done and wired: `stage-e.js`, `stagee-*.js/css`, `index.html` links, `story.js` (`TIMING.E={start:1480}`, `MAX` 1620, `scrollVh` 1720, `next-steps` beat with texts e1/e2). Verified in headless Chromium for errors, hand-over and determinism; pacing audit and reduced motion were not run.
Open items from earlier: Stage D pointer arrow on the expansion card, mono size tags in the trust piece, grey placeholder tab panels.
