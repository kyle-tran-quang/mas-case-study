/* =========================================================================
   STAGE F DATA: the maturity-map window (Figma slides 21a, 21b, 22 of frame 208:5718, file 1r4UreOVeEqdcXvnD5cetk;
   21a stage 208:9518 / window 235:9309, 21b stage 235:8231 / window 235:8232, 22 stage 208:9576).
   One continuous beat. The stage never stops: Stage E's dark card breaks into outline slabs, the page flips dark -> light, the window builds up layer by layer,
   a cursor toggles "Compare stages", the single-stage view turns into a two-stage comparison, then the window tilts back to outlines and leaves an empty stage.

     F1  slide 21a  "To give leaders clarity ..."                    blueprint, then the single-stage window
     F2  slide 21b  "Stages 1 to 5 for each path ..."                single-stage window at rest (21b paragraph 1)
     F3  slide 21b  "A comparison view helps them ..."               comparison view at rest (21b paragraph 2)
     F4  slide 22   "To be continued..."                             empty stage

   Every window is in vh of scroll, LOCAL to the beat (0 = the first vh after Stage E's final rest; E.end = 1620). STAGEF.toGlobal(startVh) shifts them.
   Chapter 11 (the 12th tick) on all four slots. Theme: dark -> light through an interpolated --flip (see FLIP), not a data-theme switch.

   PACING WORKSHEET (vh of scroll; viewer model: .claude/skills/ui-assembly-animation/reference/pacing.md). Totals: MAX 416, scrollVh 516.
   | Part                 | range    | vh | easing    | why this long |
   | Lift  HERO 1         | 0-38     | 38 | inOutCubic| camera flat -> iso (60 deg tilt, 45 deg turn): same 40vh band as Stage B's tilt; E's card breaks into 4 outline slabs (inOutQuart, z lift, lockstep) |
   | Theme flip (SUPPORT) | 26-46    | 20 | inOutCubic| starts when the slabs are already outlines (about 70% of the lift); outline opacity dips to 0.25 at 36 while the E slabs hand over to the window slabs |
   | Rest 1  (21a)        | 46-96    | 50 | -         | the sentence is 33 words: 20 + 0.6 x 33 = 39.8; +10 slack; anchor 76 |
   | Assemble HERO 2      | 96-158   | 62 | inOutQuart| window layers drop in bottom first, stagger 96-128; camera iso -> flat 104-146 (42vh); real design crossfades in 140-158 |
   | Rest 2  (21b p1)     | 158-198  | 40 | -         | 19 words: 20 + 0.6 x 19 = 31.4; +8.6; anchor 178 |
   | Cue                  | 198-220  | 22 | inOutCubic| the cursor enters already moving (stageshow rule) and arrives at the toggle |
   | Tap                  | 220-228  | 8  | inOutSine | scale dip 0.92 + ring (the click) |
   | Toggle               | 226-238  | 12 | inOutSine | knob slides, track grey -> green; overlaps the tap tail by 2vh |
   | Single -> comparison HERO 3 | 238-284 | 46 | inOutCubic | tabs become the checkbox row, Stage 1 reflows narrower (lockstep) |
   | Supporter            | 254-300  | 46 | smoothstep| Stage 2 column and the Feedback tab arrive staggered, after the first third of the hero |
   | Cursor out           | 300-306  | 6  | smoothstep| fades |
   | Rest 3  (21b p2)     | 300-340  | 40 | -         | 19 words: 20 + 0.6 x 19 = 31.4; +8.6; anchor 318 |
   | Exit HERO 4          | 340-376  | 36 | inOutCubic| the window tilts back to outlines (camera flat -> iso) and fades, leaving the empty stage; "To be continued..." arrives at 340 |
   | Rest 4  (22)         | 376-416  | 40 | -         | 3 words; the page ends here; anchor 396 |
   Anchor gaps: E2 1600 -> F1 1696 (96), F1 -> F2 102, F2 -> F3 140 (limit 105, user accepted), F3 -> F4 78.
   Known flags the user already accepted: the 178 -> 318 gap, the text column is empty for ~0.5 s (0-46), rests are ~41% of the scroll, the whole-story audit was already over budget.

   MY DECISIONS (none of these is in a Figma frame; redirect freely)
     - The E card breaks into 4 slabs (card, header block, modules block, implement block) that are the SAME rects as the E card at local 0, so the takeover is invisible.
       The window slabs (6 layers) are a different set; E's slabs fade out and the window's fade in across the dip at 36.
     - 21b's copy is split at the paragraph break into two slots (F2, F3). Text swaps happen as each hero STARTS (96, 238, 340), as in Stage E.
     - Everything is live HTML at Figma pixel sizes. The cursor is drawn only (no pointer events). The Feedback tab pops in with Stage 2.
     - Easing: inOutCubic for camera and fades, inOutQuart for piece travel, inOutSine for the click and toggle. No overshoot.
   ========================================================================= */
(function () {
  const T = {
    MAX: 416,                                  // local scrollable distance of the beat (vh)
    lift:      [0, 38],                        // HERO 1: camera flat -> iso, the E card breaks into outline slabs
    flip:      [26, 46],                       // SUPPORTER: --flip 0 -> 1 (dark -> light) while the pieces are outlines; outlines dip at KNOBS.dipAt
    rest1:     [46, 96],                       // Rest F1. ANCHOR 76
    assemble:  [96, 158],                      // HERO 2: the window builds up layer by layer into the flat front view
    layers:    [96, 128],                      // layer stagger (bottom first), inside `assemble`
    camFlat:   [104, 146],                     // camera iso -> flat, lockstep with the layers
    real:      [140, 158],                     // the live window crossfades over the flat slabs
    rest2:     [158, 198],                     // Rest F2. ANCHOR 178
    cue:       [198, 220],                     // cursor travels to the toggle
    tap:       [220, 228],                     // scale dip + ring
    toggle:    [226, 238],                     // knob slides, track grey -> green
    compare:   [238, 284],                     // HERO 3: tabs -> checkbox row, Stage 1 narrows (lockstep)
    stage2:    [254, 300],                     // SUPPORTER: Stage 2 column + Feedback tab arrive
    cursorOut: [300, 306],                     // cursor fades
    rest3:     [300, 340],                     // Rest F3. ANCHOR 318
    exit:      [340, 376],                     // HERO 4: window tilts back to outlines (camera flat -> iso) and fades
    rest4:     [376, 416]                      // Rest F4. ANCHOR 396
  };

  // Scalars the host does not shift with the windows.
  const KNOBS = {
    dipAt: 36, dipTo: 0.25,                    // outline opacity at the lowest point of the flip
    layerStep: 2.4, layerLen: 20,              // window layer stagger inside T.layers (last layer starts 96 + 5 x 2.4 = 108, ends 128)
    explodeLen: 30,                            // the E slabs lift apart over 0-30 (inside the lift)
    tapScale: 0.92,                            // the cursor's click dip
    stage2Step: 6,                             // Feedback tab follows Stage 2 by 6vh
    camZ: 0.8                                  // flat camera scale (assembly-engine default flat)
  };

  const FLAT = { rx: 0, rz: 0, s: 0.8 };
  const KC = 2 * Math.SQRT2 / Math.sqrt(5);
  const ISO = { rx: 60, rz: -45, s: 0.8 * KC };           // same iso camera as Stage B (stage-b.js)
  const ZK = KC * Math.sqrt(3) / 2;                       // screen px per z unit at rx 60

  // Geometry. Window-local px unless named stage. Measured from m-goat/assets/stagef/f21a.png (1406 x 2000 = 720 x 1024 stage at 1.953x); the Figma node dump in STAGE-F-HANDOFF.md is authoritative
  // for the live HTML in step 2. These numbers are for slabs, the cursor path and the audit.
  const GEO = {
    stage: { w: 720, h: 1024, bg: "#F4F4F4" },
    win: { x: 60, y: 212, w: 600, h: 600 },               // stage px
    shadow: [[0.96, 1.37, 1.82, 0.09], [2.9, 4.14, 5.52, 0.07], [5.54, 7.92, 10.56, 0.05], [8.78, 12.54, 16.73, 0.03], [12.55, 17.93, 23.9, 0.02], [16.8, 24, 32, 0.02]],
    // The window as 6 slabs. z = height in iso (z units). Bottom first. Window-local rects.
    slabs: [
      { id: "base",   label: "Window",          x: 0,      y: 0,      w: 600,   h: 600,   z: 0,  fill: "#FFFFFF", stroke: "#C6C6C6" },
      { id: "hero",   label: "Header section",  x: 0,      y: 18.56,  w: 600,   h: 169.3, z: 34, fill: "#F4F4F4", stroke: "#C6C6C6" },
      { id: "tabs",   label: "Product tabs",    x: 87.88,  y: 187.9,  w: 224.4, h: 15.9,  z: 68, fill: "#FFFFFF", stroke: "#0F62FE" },
      { id: "rail",   label: "Left rail",       x: 87.88,  y: 264,    w: 101.5, h: 152.8, z: 68, fill: "#FFFFFF", stroke: "#C6C6C6" },
      { id: "stages", label: "Stage content",   x: 220.6,  y: 233.5,  w: 227.9, h: 366.5, z: 68, fill: "#FFFFFF", stroke: "#C6C6C6" },
      { id: "header", label: "Product header",  x: 0,      y: 0,      w: 600,   h: 18.18, z: 102, fill: "#F4F4F4", stroke: "#C6C6C6" }
    ],
    // Toggle + stage tabs row (window-local, centres). The toggle track is 18.18 x 9.09; the tabs row starts at x 220.6.
    toggle: { x: 451.5, y: 237.2, w: 18.18, h: 9.09, label: "Compare stages" },
    tabsRow: { x: 220.6, y: 233.5, w: 212.5, h: 16 },
    cursor: { from: [700, 330], to: [460.6, 241.7], size: 12, arc: 14 }, // window-local px; it starts OFF the stage (stage x 760 > 720) so it enters already moving; arc = sideways bow in px
    tapRing: { r: 7 },
    stage2: { dx: 22 },                                                    // Stage 2 slides in from this far to the right
    // Stage E's card as 4 slabs, card-local px (562 wide). At local 0 it sits at stage (34, -226.734) scale 1.4 (STAGEE.endPose).
    eCard: { x: 34, y: -226.734, s: 1.4, w: 562, h: 664.759 },
    eSlabs: [
      { id: "card",   label: "Next steps card",        x: 0, y: 0,   w: 562, h: 664.759, z: 0,  fill: "#393939", stroke: "#8D8D8D" },
      { id: "head",   label: "Step 01 block",          x: 17.562, y: 17.562, w: 440, h: 260, z: 40, fill: "#393939", stroke: "#8D8D8D" },
      { id: "mods",   label: "Required modules block", x: 17.562, y: 285, w: 440, h: 76, z: 40, fill: "#393939", stroke: "#8D8D8D" },
      { id: "impl",   label: "How to implement block", x: 5.5, y: 366, w: 470, h: 297, z: 40, fill: "#393939", stroke: "#0F62FE" }
    ],
    viewport: { w: 1440, h: 900 }
  };

  /* COPY. Every string is the Figma node's `characters`, verbatim. */
  const COPY = {
    f1: { id: "208:9517", copy: ["To give leaders clarity without forcing two different systems onto one scale, I split asset management into two parallel paths: one for tracking equipment health and one for managing technicians in the field."] },
    f2: { id: "235:8230", copy: ["Stages 1 to 5 for each path helps executives pinpoint exact gaps in their hardware monitoring, versus on-the-ground execution."] },
    f3: { id: "235:8230", copy: ["A comparison view helps them guide the conversation to the customer about where they\u2019re at and the target stage."] },
    f4: { id: "208:9575", copy: ["To be continued..."] },
    window: {
      appName: "Maximo Growth Opportunity Assessment Tool", nav: ["Overview", "Opportunity paths"],
      heading: "Plan your customers\u2019 next move",
      subtitle: "Assess where customers\u2019 assets performance and field service management operations stand today and advance toward reliability-driven, self-optimizing operations.",
      tabs: ["Field Service Management (FSM)", "Asset Performance Management (APM)"],
      rail: ["Where the customer is", "Value after resolving", "Pilot recommendation", "Key milestones", "Getting started (minimal viable steps)"],
      stageTabs: ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"],
      compareLabel: "Compare stages", chooseLabel: "Choose 2 stages for comparison", feedback: "Feedback",
      // Stage columns (21a Stage 1 alone; 21b Stage 1 + Stage 2). Stage 1's paragraph uses 21b's spelling (" -- ") in both poses so the text never swaps (21a has "--from", "PMs-and").
      s1: { n: "Stage 1", name: "Reactive execution" }, s2: { n: "Stage 2", name: "Coordinated field operations" },
      where: "Where the customer is",
      tags: ["Paper or digital work orders", "Limited technician visibility", "Minimal dispatch", "Owner rather than assigned resources"],
      s1Para: "Most organizations start here. Work is created -- from breakdowns, customer calls, PMs -- and someone decide who does it informally through whiteboards, spreadsheets, or phone calls. The architectural distinction to internalize: OWNER / OWNER GROUP provides administrative and financial accountability -- who answers for the work -- while the ASSIGNMENT object provides the technical trigger that surfaces work in mobile dispatch and scheduling views. Relying on Owner alone leaves that trigger unset, so work never flows to the field.",
      s2Para: "A planner or supervisor is actively coordinating work \u2014 but mostly manually through Assignment Manager or by placing work orders directly. There is basic scheduling visibility but no structured forward-planning horizon. The key advance is centralized management of assignments and beginning to look ahead more than a day at a time. The Scheduling / Dispatch Dashboard becomes the right interface \u2014 resource availability and demand across a rolling window, without Optimizer.",
      readyText: "Work orders carry scheduled dates and a forward planning horizon is established (weekly to monthly). A centralized scheduler or dispatcher role is active in Assignment Manager, workforce availability is enriched with exceptions, and job plans gain materials, tools, and classifications. HSE, Inspections, and Inventory enter as parallel capability layers.",
      ready1: "Are you ready?", ready2: "Is the customer ready for this stage?",
      value: { h: "Value after resolving", p: "Digitize field execution and give technicians real-time access to asset and work data with Maximo Mobile. This is the entry point that pays for itself immediately in reduced phone calls and paper chase" },
      pilot: { h: "Pilot recommendation", p: "Pick one department (e.g. HVAC) with 2-5 technicians. Fix the Assignment object. Deploy Mobile. Run for 4 weeks. Measure how many work orders are completed digitally vs on paper" },
      holding: "What\u2019s holding them back"
    }
  };

  const wordCount = s => s.split(/\s+/).filter(Boolean).length;
  const WORDS = { f1: wordCount(COPY.f1.copy.join(" ")), f2: wordCount(COPY.f2.copy.join(" ")), f3: wordCount(COPY.f3.copy.join(" ")), f4: wordCount(COPY.f4.copy.join(" ")) };
  const ANCHORS = { f1: 76, f2: 178, f3: 318, f4: 396 };

  // ---- shared maths for the reports
  const PEAK = { inOutSine: Math.PI / 2, smoothstep: 1.5, inOutCubic: 3, inOutQuart: 2, linear: 1 };           // peak slope of each curve (analytic)
  const FIT = Math.min(GEO.viewport.w / 2 / GEO.stage.w, GEO.viewport.h / GEO.stage.h);                           // 0.8789
  const cursorLen = Math.hypot(GEO.cursor.to[0] - GEO.cursor.from[0], GEO.cursor.to[1] - GEO.cursor.from[1]);
  const maxZ = Math.max(...GEO.slabs.map(s => s.z), ...GEO.eSlabs.map(s => s.z));

  window.STAGEF = {
    TIMING: T, KNOBS, GEO, COPY, words: WORDS, anchors: ANCHORS, chapter: 11, fit: FIT, ISO, FLAT, ZK,
    // Finished poses for prefers-reduced-motion (local vh): the host jumps between them. blueprint / single / comparison / empty.
    poses: { blueprint: ANCHORS.f1, single: ANCHORS.f2, comparison: ANCHORS.f3, empty: ANCHORS.f4 },

    // Camera keys (local vh). Stage E ends flat. iso for the blueprint, flat for the window, iso again for the exit.
    cameraKeys: [
      { vh: 0, ...FLAT }, { vh: T.lift[1], ...ISO, e: "inOutCubic" },
      { vh: T.camFlat[0], ...ISO }, { vh: T.camFlat[1], ...FLAT, e: "inOutCubic" },
      { vh: T.exit[0], ...FLAT }, { vh: T.exit[1], ...ISO, e: "inOutCubic" }
    ],

    // --flip (0 dark, 1 light) is interpolated on the stage, text column and nav. flipAt(vh) gives the local value, smoothstep over T.flip.
    flip: { from: T.flip[0], to: T.flip[1], dark: { bg: "#262626", page: "#161616", text: "#f4f4f4", line: "#f4f4f4" }, light: { bg: "#f4f4f4", page: "#ffffff", text: "#000000", line: "#1c1c1f" } },
    flipAt(vh) { const u = Math.min(1, Math.max(0, (vh - T.flip[0]) / (T.flip[1] - T.flip[0]))); return u * u * (3 - 2 * u); },

    // Where the sentence changes (local vh): as each hero starts (see the decision above). Give each outgoing `to` and the incoming `from` the SAME value.
    // eOut: Stage E's e2 `to` (E's sentence leaves at local 0; the column stays empty until f1From).
    textSwap: { eOut: 0, f1From: T.flip[1], f1To: T.assemble[0], f2From: T.assemble[0], f2To: T.compare[0], f3From: T.compare[0], f3To: T.exit[0], f4From: T.exit[0], f4To: T.MAX },

    // Hand-over IN from Stage E. Piece id "stagee" is held at STAGEE.endPose until local 0.
    handover: {
      in: { piece: "stagee", fadeKeys: [{ vh: 0, o: 1 }, { vh: 0.5, o: 0 }], note: "The E slabs take over at local 0 with the same rects as the E card (GEO.eCard / GEO.eSlabs); the E piece is switched off 0.5vh after they are on, with a ~0.0005 overlap so there is never an empty frame." },
      slabOverlapT: 0.0005
    },

    // Shift every window and anchor to the beat's real position.
    toGlobal(startVh) {
      const shift = v => Array.isArray(v) ? v.map(x => x + startVh) : v + startVh;
      const out = {}; Object.keys(T).forEach(k => { out[k] = k === "MAX" ? T[k] : shift(T[k]); });
      out.anchors = {}; Object.keys(ANCHORS).forEach(k => { out.anchors[k] = ANCHORS[k] + startVh; });
      out.poses = {}; Object.keys(this.poses).forEach(k => { out.poses[k] = this.poses[k] + startVh; });
      out.textSwap = {}; Object.keys(this.textSwap).forEach(k => { out.textSwap[k] = this.textSwap[k] + startVh; });
      out.cameraKeys = this.cameraKeys.map(k => ({ ...k, vh: k.vh + startVh }));
      out.eFade = this.handover.in.fadeKeys.map(k => ({ ...k, vh: k.vh + startVh }));
      return out;
    },

    /* A SCENE-like object for .claude/skills/ui-assembly-animation/assets/pacing-audit.js. Distances are in SCREEN px at the reference viewport (stage px x FIT) so the audit's camera is [] for the
       piece moves; the iso tilts are real camera keys. Sine moves are modelled as linear moves of pi/2 x the distance (same peak, same window), as in stagee-data.js. */
    auditScene(startVh = 0, opts = {}) {
      const total = startVh + T.MAX, t = vh => (vh + startVh) / total, raw = !!opts.raw;
      const K = (raw ? 1 : PEAK.inOutSine) * FIT, eSine = raw ? "inOutSine" : "linear";
      const slabTravel = maxZ * ZK;                                          // screen px of the tallest slab lift
      const pieces = [
        { id: "E slabs: explode (z lift)", rects: { r: { x: 0, y: 0, w: 562, h: 665 } }, keys: [
          { t: t(0), x: 0, y: 0, z: 0, o: 1, rect: "r" }, { t: t(KNOBS.explodeLen), x: 0, y: 0, z: maxZ, e: "inOutQuart" }, { t: 1, x: 0, y: 0, z: maxZ }] },
        { id: "window layers: drop in (z)", rects: { r: { x: GEO.win.x, y: GEO.win.y, w: 600, h: 600 } }, keys: [
          { t: t(T.layers[0]), x: 0, y: 0, z: maxZ, o: 1, rect: "r" }, { t: t(T.layers[1]), x: 0, y: 0, z: 0, e: "inOutQuart" }, { t: 1, x: 0, y: 0, z: 0 }] },
        { id: "cursor: travels to the toggle", rects: { r: { x: GEO.cursor.from[0] + GEO.win.x, y: GEO.cursor.from[1] + GEO.win.y, w: 8, h: 8 } }, keys: [
          { t: t(T.cue[0]), x: 0, y: 0, o: 1, rect: "r" }, { t: t(T.cue[1]), x: (GEO.cursor.to[0] - GEO.cursor.from[0]) * FIT, y: (GEO.cursor.to[1] - GEO.cursor.from[1]) * FIT, e: "inOutCubic" }, { t: 1, x: (GEO.cursor.to[0] - GEO.cursor.from[0]) * FIT, y: (GEO.cursor.to[1] - GEO.cursor.from[1]) * FIT }] },
        { id: "Stage 1 narrows (compare hero)", rects: { r: { x: GEO.win.x + 330, y: GEO.win.y + 300, w: 100, h: 100 } }, keys: [
          { t: t(T.compare[0]), x: 0, y: 0, o: 1, rect: "r" }, { t: t(T.compare[1]), x: -110 * FIT, y: 0, e: "inOutCubic" }, { t: 1, x: -110 * FIT, y: 0 }] },
        { id: "Stage 2 arrives (supporter)", rects: { r: { x: GEO.win.x + 400, y: GEO.win.y + 300, w: 100, h: 100 } }, keys: [
          { t: t(T.stage2[0]), x: GEO.stage2.dx * FIT, y: 0, o: 0, rect: "r" }, { t: t(T.stage2[1]), x: 0, y: 0, o: 1, e: "inOutCubic" }, { t: 1, x: 0, y: 0, o: 1 }] },
        { id: "window fades out (exit)", rects: { r: { x: GEO.win.x, y: GEO.win.y, w: 600, h: 600 } }, keys: [
          { t: t(T.exit[0]), o: 1, rect: "r" }, { t: t(T.exit[1]), o: 0, e: "inOutCubic" }, { t: 1, o: 0 }] }
      ];
      const camera = this.cameraKeys.map(k => ({ t: t(k.vh), rx: k.rx, rz: k.rz, s: k.s, e: k.e }));
      return {
        scrollVh: total + 100, pieces, camera,
        extras: [
          { id: "flip dark -> light", keys: [{ t: t(T.flip[0]), o: 0 }, { t: t(T.flip[1]), o: 1 }] },
          { id: "tap + toggle", keys: [{ t: t(T.tap[0]), o: 0 }, { t: t(T.toggle[1]), o: 1 }] },
          { id: "real window crossfade", keys: [{ t: t(T.real[0]), o: 0 }, { t: t(T.real[1]), o: 1 }] }
        ],
        beats: [
          { id: "f1", hold: true, snap: t(ANCHORS.f1), range: [t(this.textSwap.f1From), t(this.textSwap.f1To)], words: WORDS.f1 },
          { id: "f2", hold: true, snap: t(ANCHORS.f2), range: [t(this.textSwap.f2From), t(this.textSwap.f2To)], words: WORDS.f2 },
          { id: "f3", hold: true, snap: t(ANCHORS.f3), range: [t(this.textSwap.f3From), t(this.textSwap.f3To)], words: WORDS.f3 },
          { id: "f4", hold: true, snap: t(ANCHORS.f4), range: [t(this.textSwap.f4From), 1], words: WORDS.f4 }
        ]
      };
    },
    auditNote: "pacing-audit.js has no inOutSine / inOutQuart; sine moves are modelled as linear moves of pi/2 x the distance (see stagee-data.js). Camera tilts are real camera keys (inOutCubic). "
             + "The anchor gap F2 -> F3 (140 vh) is over the audit's 105 limit; the user accepted it (STAGE-F-HANDOFF.md).",

    // On-screen speed of the fastest point per px of scroll at the reference viewport. ratio = peak slope x on-screen displacement / scroll px. Must stay <= 6.
    speedReport() {
      const px = vh => vh * GEO.viewport.h / 100, rows = [];
      const add = (name, win, ease, dispScreen, note) => {
        const peak = PEAK[ease], scroll = px(win[1] - win[0]), ratio = peak * dispScreen / scroll;
        rows.push({ name, windowVh: win, easing: ease, peakSlope: +peak.toFixed(3), maxDisplacementScreenPx: +dispScreen.toFixed(1), scrollPx: scroll, ratio: +ratio.toFixed(2), ok: ratio <= 6, minVhFor6x: +(peak * dispScreen / 6 / (GEO.viewport.h / 100)).toFixed(1), note });
      };
      add("lift: E slabs explode (z)", [0, KNOBS.explodeLen], "inOutQuart", maxZ * ZK, `tallest slab lifts ${maxZ} z units = ${(maxZ * ZK).toFixed(0)} screen px`);
      add("assemble: window layers drop", T.layers, "inOutQuart", maxZ * ZK, "each layer travels at most the full z range; the stagger means only one or two move at a time");
      add("cue: cursor to the toggle", T.cue, "inOutCubic", cursorLen * FIT, `${cursorLen.toFixed(0)} stage px`);
      add("compare: Stage 1 narrows", T.compare, "inOutCubic", 110 * FIT, "right edge of Stage 1 content moves about 110 px left");
      add("stage 2 arrives", T.stage2, "inOutCubic", GEO.stage2.dx * FIT, "slides in from 22 px");
      return { fit: +FIT.toFixed(4), viewport: GEO.viewport, rows, worst: Math.max(...rows.map(r => r.ratio)), pass: rows.every(r => r.ok) };
    }
  };
})();
