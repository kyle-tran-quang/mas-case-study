/* =========================================================================
   SCENE DATA (Act 1: The Problem + Act 2.3: v1 -> v2 -> v3). Reference frame = the left half of the Figma Act 1 frames: 720 x 1024.
   Every motion window comes from TIMING in story.js (vh of scroll, anchored to the 70vh text pitch); beat ranges come from STORY. Retime there, not here.
   Act 1 is UI morph only (flat camera, no blueprint), per the author's choice.

   MEASURED (not guessed): piece positions are least-squares fits of the Figma 4x exports against the Figma stage renders
     (assets/act1/stage-*.png) with a recovered alpha channel (assets/act1/source4x keeps the raw exports). All three fit at exactly 0.25 (4x):
       skeleton 1.1  (43.25, 297.75)  633.25 x 435.5    fit error 2.6 / 255
       skeleton 1.2  (-0.25, 37.75)   619 x 449.5       fit error 1.7 / 255 (strip above the dashboard; the 50% fade is baked into this export)
       dashboard     (48.25, 270.75)  594 x 483.75      fit error 11 / 255 (text anti-aliasing at the left edge; placement is within 1px)
       logo          (19, 20)         60 x 60           Figma node 48:517, vector SVG (the orange path only)
   MY DECISIONS (not in any Figma frame; redirect freely):
       the three tile positions (the author asked for: one top-left corner, one right middle, one lower middle; which tile goes where is mine),
       their sizes, the fade-in, the glow and pulse timing, the white circle's position (Figma 97:253) and the "Maximo is huge" cross-fade (TIMING in story.js).
   ========================================================================= */
(function () {
  const TT = window.TIMING, V = vh => vh / TT.MAX, VV = ([a, b]) => [V(a), V(b)];    // scroll vh -> scene progress t
  const W = 720, H = 1024, D = STORY.data;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), sm = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };

  // ---- tile geometry (MY DECISION). Carbon base tile, 196 x 136, 16px padding. The dashboard sits at x 48..642, y 271..755.
  //   AppPoints   top-left corner of the dashboard (overhangs its corner)
  //   Entitlement right middle (overhangs the dashboard's right edge)
  //   Usage       lower middle (overhangs the dashboard's bottom edge)
  const TW = 196, TH = 136;
  const POS = { appPoints: { x: 24, y: 160 }, entitlement: { x: 500, y: 440 }, usage: { x: 262, y: 690 } };   // appPoints sits above the dashboard title (stage y 309) so it doesn't cover it
  const BAR_Y = 112, BAR_H = 8, BAR_X = 16, BAR_W = TW - 32;           // usage bar inside its tile (see scene.css)
  const unusedX = POS.usage.x + BAR_X + BAR_W * D.usagePct / 100, unusedW = BAR_W * (1 - D.usagePct / 100), unusedY = POS.usage.y + BAR_Y;
  // the white circle (Figma 96:158, ellipse 97:253: 387px at (167, 318)): the unused bar swells into it, at the centre of the stage where everything else has faded
  const TG = 387, targetX = 167, targetY = 318;

  const tile = (label, inner) => `<div class="mg-tile"><div class="mg-label">${label}</div>${inner}</div>`;
  const html = {
    appPoints:   tile("AppPoints", `<div class="mg-value">${D.appPoints}</div>`),
    entitlement: tile("Entitlement", `<div class="mg-tags">${D.entitlement.map(t => `<span class="mg-tag">${t}</span>`).join("")}</div>`),
    usage:       tile("Usage", `<div class="mg-value">${D.usagePct}%</div><div class="mg-bar"><div class="fill" style="width:${D.usagePct}%"></div></div>`),
    unused:      `<div class="mg-unused"><div class="blob"></div></div>`
  };

  const SCENE = window.SCENE = {
    ariaLabel: "Animated problem statement. A faded skeleton of the ALM homepage slides away as the Maximo Operational dashboard slides over it. Three Carbon tiles then appear around the dashboard: AppPoints, Entitlement and Usage, where Usage is only partly filled. The unused part of the Usage bar glows and collapses into a single target.",
    hud: false, grid: false, fit: 1,
    frames: {                                   // w / h are the LOGICAL stage size; the images are 4x, so they stay sharp on high-density screens
      stage: { w: W, h: H },
      alm11:     { w: 633.25, h: 435.5,  src: "assets/act1/alm-1-1.png" },
      alm12:     { w: 619,    h: 449.5,  src: "assets/act1/alm-1-2.png" },
      dashboard: { w: 594,    h: 483.75, src: "assets/act1/dashboard.png" },
      logo:      { w: 60,     h: 60,     src: "assets/act1/logo.svg" }
    },
    // z order = array order (flat camera, no 3D context): skeleton < dashboard < tiles < unused/target < logo
    pieces: [
      { id: "skeleton", label: "ALM Homepage", kind: "shell", depth: 0,
        rects: { s11: { x: 43.25, y: 297.75, w: 633.25, h: 435.5, img: "alm11", ix: 0, iy: 0 }, s12: { x: -0.25, y: 37.75, w: 619, h: 449.5, img: "alm12", ix: 0, iy: 0 } } },
      { id: "dashboard", label: "Operational dashboard", kind: "media", depth: 1,
        rects: { d0: { x: 48.25, y: 1040, w: 594, h: 483.75, img: "dashboard", ix: 0, iy: 0 }, d1: { x: 48.25, y: 270.75, w: 594, h: 483.75, img: "dashboard", ix: 0, iy: 0 } } },
      { id: "tile-apppoints",   label: "AppPoints",   kind: "card", depth: 2, html: html.appPoints,   rects: { r: { ...POS.appPoints,   w: TW, h: TH } } },
      { id: "tile-entitlement", label: "Entitlement", kind: "card", depth: 2, html: html.entitlement, rects: { r: { ...POS.entitlement, w: TW, h: TH } } },
      { id: "tile-usage",       label: "Usage",       kind: "card", depth: 2, html: html.usage,       rects: { r: { ...POS.usage,       w: TW, h: TH } } },
      { id: "unused",           label: "Unused",      kind: "control", depth: 3, html: html.unused,
        rects: { bar: { x: unusedX, y: unusedY, w: unusedW, h: BAR_H }, tg: { x: targetX, y: targetY, w: TG, h: TG } },
        // pure function of t (SCENE.glow is defined below, so the keys and the paint share one definition)
        update(body, k, t) {
          const blob = body.querySelector(".blob"), v = SCENE.glow(t);
          blob.style.opacity = v.blob;
          blob.style.borderRadius = v.radius + "%";
          blob.style.background = `color-mix(in srgb, #ffffff ${v.white}%, var(--border-interactive))`;      // the blue bar turns white as it swells into the circle
          blob.style.boxShadow = `0 0 ${v.glow}px ${v.spread}px color-mix(in srgb, var(--border-interactive) ${v.glowA}%, transparent)`;
        } },
      { id: "logo", label: "Logo", kind: "nav", depth: 4, bare: true, rects: { l: { x: 19, y: 20, w: 60, h: 60, img: "logo", ix: 0, iy: 0 } } }
    ],
    camera: [ { t: 0, rx: 0, rz: 0, s: 0.8 }, { t: 1, rx: 0, rz: 0, s: 0.8 } ]      // Act 1 is flat throughout
  };

  /* ---- ACT 2.3 pieces (v1 -> v2 -> v3), drawn in the same 720 x 1024 stage as Act 1 --------------------------------------------------
     The Figma versions are 1682 wide. Each is cropped to 1480 source px (v1 from x 101 so the form stays centred; v2 and v3 from x 0 so the whole sidebar fits)
     and scaled by K into the stage at (OX, OY). Source frames (file 1r4UreOVeEqdcXvnD5cetk): v1 69:3070 (1682x925), v2 69:101 (1682x925), v3 71:5863 (1682x1039).
     Pieces are disjoint crops of one version each, so nothing stale shows under a morph:
       chrome        v1 header band 1480x100 -> v2 sidebar 588x925 -> v3 sidebar 572x722 (without the illustration)
       form          v1 question cards -> v2 maturity table -> v3 checklist
       illustration  v3 only: the bottom of the sidebar (572x317)
     MY DECISIONS (redirect freely): the 7 "layer" slabs (one per feedback round), the note positions, the camera angles, and all timings.
     The count 7 and the note wording come from the author (notes 2 and 3 trimmed). */
  const K = 0.47, OX = 12, OY = 270, SRC_W = 1480, SRC_H = 1040;
  const rr = (dx, dy, w, h, img, ix, iy) => ({ x: OX + dx * K, y: OY + dy * K, w: w * K, h: h * K, iw: w, ih: h, img, ix, iy });   // dst box (stage px) + source crop (source px)
  Object.assign(SCENE.frames, {
    blank: { w: 1, h: 1, src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" },       // transparent 1px (see `blank` below)
    v2: { w: 1682, h: 925,  src: "assets/act2/v2.png" },
    v3: { w: 1682, h: 1039, src: "assets/act2/v3.png" }
  });
  const noteHtml = (tag, text) => `<div class="fb-note" style="--k:${K}"><div class="fb-tag">${tag}</div><div class="fb-text">${text}</div></div>`;
  const NOTES = [
    { id: "note-1", x: 24,   y: 190, tag: "feedback 1", text: "The concept is proven; the content needs iteration." },
    { id: "note-2", x: 1156, y: 330, tag: "feedback 2", text: "“…how do you make Maximo the shiny object?”" },
    { id: "note-3", x: 24,   y: 540, tag: "feedback 3", text: "Define what APM is up front, technology agnostic." }
  ];
  const NW = 300, NH = 230, SLAB_N = 7;
  const flatBox = (w, h) => ({ x: OX, y: OY, w: w * K, h: h * K });
  // ---- CAPABILITIES piece (illustration -> diagram -> layers hand-off). Both Figma frames are 720 x 1024 = this stage, so no scaling.
  //   The morph runs TT.morph.m0..m1 and only creeps (h0..h1) under the "stats" text; the finished diagram then rests until the bridge cue (TT.bridge.cue).
  //   Bridge cue = the diagram's text and connectors fade. At its end the SVG's 14 cards are swapped for 14 engine slabs (same rects and colours, see `cards` below).
  const BT = TT.bridge, MO = TT.morph;
  const CAP = CapabilitiesPiece.make({ m0: V(MO.m0), h0: V(MO.h0), h1: V(MO.h1), m1: V(MO.m1), pA: MO.pA, pB: MO.pB, b0: V(BT.cue[0]), b1: V(BT.cue[1]) });
  SCENE.capProgress = CAP.progress;                                    // the morph's p(t), exposed for the pacing checks
  SCENE.pieces.push({ id: "capabilities", label: "Capabilities", kind: "media", depth: 1, html: CAP.html, update: CAP.update, rects: { r: { x: 0, y: 0, w: 720, h: 1024 } } });

  // v1 is LIVE HTML (v1-ui.js, from Figma 102:2757): header band 1480 x 125.5, form window 1480 x 799.5 below it. The `form` / `chrome` crops below only show v2 and v3 (PNG);
  // their c1 / f1 rects are the v1 boxes with a transparent image (`blank`), so the v1 -> v2 morph starts from the v1 boxes while the live v1 fades out above them.
  const U = window.V1UI, HEAD_H = U.HEAD_H, WIN_H = U.WIN_H;
  const blank = box => ({ ...box, iw: 1, ih: 1, img: "blank", ix: 0, iy: 0 });         // a box with a transparent 1px image: no crop to show, but still counts as an image for the blueprint outline
  SCENE.pieces.push(
    ...Array.from({ length: SLAB_N }, (_, i) => ({ id: `layer-${i + 1}`, label: `Feedback round ${i + 1}`, kind: "shell", depth: 0, bp: true, sizeScale: 1 / K,
      rects: { a: flatBox(SRC_W, 925), b: flatBox(SRC_W, SRC_H) } })),
    { id: "form", label: "Form", kind: "section", depth: 1, bp: true, sizeScale: 1 / K,
      rects: { f1: blank(rr(0, HEAD_H, 1480, WIN_H)), f2: rr(588, 0, 892, 925, "v2", 588, 0), f3: rr(572, 0, 908, 1039, "v3", 572, 0) } },
    { id: "chrome", label: "Header / sidebar", kind: "nav", depth: 2, bp: true, sizeScale: 1 / K,
      rects: { c1: blank(rr(0, 0, 1480, HEAD_H)), c2: rr(0, 0, 588, 925, "v2", 0, 0), c3: rr(0, 0, 572, 722, "v3", 0, 0) } },
    // live v1 (HTML). Sits above `form` / `chrome` so it covers them until it fades out in the v1 -> v2 morph.
    { id: "v1-form", label: "v1 form", kind: "section", depth: 1, html: U.formHtml(K), rects: { f1: rr(0, HEAD_H, 1480, WIN_H) },
      update(body) { U.apply(body.querySelector(".v1-scroll"), SCENE.v1Scroll || 0); } },       // the one input that is not t: the auto-scroll position (index.html)
    { id: "v1-head", label: "v1 header", kind: "nav", depth: 2, html: U.headerHtml(K), rects: { c1: rr(0, 0, 1480, HEAD_H) } },
    // live v2 (HTML, v2-ui.js from Figma 69:101): sits on the v2 PNG crops once the v1 -> v2 morph has landed, and leaves before v2 lifts into the v3 blueprint
    { id: "v2-main", label: "v2 form", kind: "section", depth: 1, html: window.V2UI.mainHtml(K), rects: { r: rr(588, 0, 892, 925) } },
    { id: "v2-side", label: "v2 sidebar", kind: "nav", depth: 2, html: window.V2UI.sideHtml(K), rects: { r: rr(0, 0, 588, 925) } },
    { id: "illustration", label: "Illustration", kind: "media", depth: 3, bp: true, sizeScale: 1 / K,
      rects: { i: rr(0, 722, 572, 317, "v3", 0, 722) } },
    ...NOTES.map(n => ({ id: n.id, label: n.tag, kind: "card", depth: 4, html: noteHtml(n.tag, n.text),
      rects: { r: { x: OX + n.x * K, y: OY + n.y * K, w: NW * K, h: NH * K } } }))
  );
  SCENE.ariaLabel += " The capabilities diagram's text fades, leaving its 14 cards, and the diagram then fades into version 1 of the assessment: a blue header over a long questionnaire that scrolls itself down through its questions. Three feedback notes sit on top of it. Version 1 morphs into version 2, a dark sidebar beside a maturity table, with the first three feedback layers sliding out from beneath. Version 2 then lifts into an isometric blueprint, the four remaining layers separate beneath it, and it resolves into version 3: a light sidebar with an illustration and a checklist.";

  /* ---- timeline: every window below is read from TIMING (story.js), in vh of scroll ---------------------------------------------- */
  const P = id => SCENE.pieces.find(p => p.id === id), add = (id, ...keys) => P(id).keys.push(...keys.flat());
  SCENE.pieces.forEach(p => p.keys = []);

  // logo (the orange MasPricing mark, top left): hidden for now at the author's request. Set SHOW_LOGO = true to bring it back.
  const SHOW_LOGO = false;
  add("logo", { t: 0, x: 0, y: 0, z: 4, o: SHOW_LOGO ? 1 : 0, f: 1, rect: "l" });

  // skeleton: holds in 1.1 (tilted, centred), then glides up-left into frame 52:523's pre-faded export while the dashboard arrives.
  add("skeleton", { t: 0, x: 0, y: 0, z: 0, o: 1, f: 1, rect: "s11" }, { t: V(TT.skeleton[0]), rect: "s11" }, { t: V(TT.skeleton[1]), rect: "s12", e: "inOutSine" });

  // dashboard: slides up from below the stage; it is off-stage until it moves, so the opacity key only matters for stacking.
  add("dashboard", { t: 0, x: 0, y: 0, z: 1, o: 0, f: 1, rect: "d0" }, { t: V(TT.dashboard[0]), o: 0, rect: "d0" }, { t: V(TT.dashboard[0]) + 0.002, o: 1 },
      { t: V(TT.dashboard[1]), o: 1, rect: "d1", e: "inOutSine" });

  // tiles: each fades in with a short upward drift, staggered
  const [m0, m1] = VV(TT.tiles), drift = 40;
  ["tile-apppoints", "tile-entitlement", "tile-usage"].forEach((id, i) => {
    const a = m0 + i * (m1 - m0) * 0.22, b = Math.min(m1, a + (m1 - m0) * 0.56);
    add(id, { t: 0, x: 0, y: drift, z: 2, o: 0, f: 1, rect: "r" }, { t: a, y: drift, o: 0 }, { t: b, y: 0, o: 1, e: "inOutSine" });
  });

  // unused remainder: fades in on the bar and sits there (glowing) under "goal", then swells into the white circle and dissolves into the illustration
  add("unused",
    { t: 0, x: 0, y: 0, z: 3, o: 0, f: 1, rect: "bar" }, { t: V(TT.unusedIn[0]), o: 0, rect: "bar" }, { t: V(TT.unusedIn[1]), o: 1 },
    { t: V(TT.fly[0]), rect: "bar" }, { t: V(TT.fly[1]), rect: "tg", e: "inOutSine" },
    { t: V(TT.circleOut[0]), o: 1 }, { t: V(TT.circleOut[1]), o: 0, e: "inOutSine" });

  // everything else fades while the unused bar swells; the circle stays
  ["skeleton", "dashboard", "tile-apppoints", "tile-entitlement", "tile-usage"].forEach(id => add(id, { t: V(TT.others[0]), o: 1 }, { t: V(TT.others[1]), o: 0, e: "inOutSine" }));

  // glow / pulse / bar -> white circle: one function of t, used by the unused piece's update(). The bar is still under "goal"; only the glow breathes.
  const [gi0, gi1] = VV(TT.unusedIn), [f0, f1] = VV(TT.fly), [p10, p11] = VV(TT.pulse1), [p20, p21] = VV(TT.pulse2);
  const bump = (a, b, t) => sm(a, (a + b) / 2, t) - sm((a + b) / 2, b, t);
  SCENE.glow = t => {
    const inG = sm(gi0, gi1, t), pulse = bump(p10, p11, t) + bump(p20, p21, t);   // two pulses
    const fly = sm(f0, f1, t);                                                    // 0 = bar, 1 = circle
    return {
      blob: 1,                                                                    // the blob IS the circle now (no ring to fade into)
      white: Math.round(100 * sm(0.25, 0.85, fly)),                               // blue -> white, finishing just before the swell lands
      radius: 50 * sm(0.0, 0.6, fly),                                             // corner radius 0% -> 50% (bar -> circle)
      glow: 6 + 22 * pulse + 10 * fly, spread: 1 + 3 * pulse, glowA: Math.round(inG * (35 + 40 * pulse) * (1 - sm(0.2, 0.8, fly)))   // the glow is gone by the time it is a circle
    };
  };

  /* ---- ACT 2.3 timeline ------------------------------------------------------------------------------------------------------------ */
  const G = AssemblyScene.G, LIFT = 60 * K, FLAT_S = 0.95, ISO_S = 0.8;
  const [M0, M1] = VV(TT.v2.morph);                                                 // v1 -> v2 morph
  const [D0, D1, D2, D3] = TT.v3.D.map(V);                                          // v2 -> v3: explode, travel, resolve start, resolve end
  const [dg0, dg1] = VV(BT.diagramOut), [lc0, lc1] = VV(BT.landChrome), [lf0, lf1] = VV(BT.landForm);
  SCENE.camera = [
    { t: 0, rx: 0, rz: 0, s: 0.8 }, { t: dg0, rx: 0, rz: 0, s: 0.8 },                                // Act 1 framing, flat throughout the diagram
    { t: lf1, rx: 0, rz: 0, s: FLAT_S },                                                            // zoom to the act 2 framing in step with v1 landing (no tilt: the diagram goes straight to the live v1)
    { t: D0, rx: 0, rz: 0, s: FLAT_S },
    { t: D1, rx: 54, rz: -30, s: ISO_S }, { t: D2, rx: 50, rz: -24, s: ISO_S },
    { t: D3, rx: 0, rz: 0, s: FLAT_S }, { t: 1, rx: 0, rz: 0, s: FLAT_S }
  ];

  // capabilities piece: one SVG, driven by capabilities.js. It cross-fades in with the white circle, and out again into the live v1 (diagramOut).
  add("capabilities", { t: 0, x: 0, y: 0, z: 0, o: 0, f: 1, rect: "r" }, { t: V(TT.circleOut[0]), o: 0 }, { t: V(TT.circleOut[1]), o: 1, e: "inOutSine" },
      { t: dg0, o: 1 }, { t: dg1, o: 0, e: "inOutSine" });

  /* ---- BRIDGE (windows in TT.bridge, vh). Flat, no isometric stack any more:
     cue         the diagram's text, bars and connectors fade (capabilities.js), leaving the 14 plain cards, which rest under "structure".
     diagramOut  the diagram fades out. In step, the live v1 lands (landChrome / landForm): the header slides down into place, the form rises into place, both as the real UI.
     then the beat rests on v1 and the page auto-scrolls the form (index.html, STORY.auto), with the feedback notes pinned on top. */
  const sk = (a, b, f) => a + (b - a) * f, layerZ = i => -(i + 1) * 22;      // layerZ: the feedback-round slabs' depth in the v3 blueprint (used below)
  const HEAD = HEAD_H * K, RISE = 40;
  add("v1-head", { t: 0, x: 0, y: -HEAD, z: 0, o: 0, rect: "c1" }, { t: lc0, y: -HEAD, o: 0 }, { t: sk(lc0, lc1, 0.15), o: 1 }, { t: lc1, y: 0, o: 1, e: "inOutSine" },
      { t: M0, o: 1 }, { t: sk(M0, M1, 0.6), o: 0, e: "inOutSine" });
  add("v1-form", { t: 0, x: 0, y: RISE, z: 0, o: 0, rect: "f1" }, { t: lf0, y: RISE, o: 0 }, { t: sk(lf0, lf1, 0.15), o: 1 }, { t: lf1, y: 0, o: 1, e: "inOutSine" },
      { t: M0, o: 1 }, { t: sk(M0, M1, 0.6), o: 0, e: "inOutSine" });
  ["v2-main", "v2-side"].forEach(id => add(id, { t: 0, x: 0, y: 0, z: 0, o: 0, f: 1, rect: "r" }, { t: sk(M0, M1, 0.6), o: 0 }, { t: M1, o: 1, e: "inOutSine" }, { t: D0 - 0.0005, o: 1 }, { t: D0, o: 0 }));
  // v1 -> v2 UI morph (flat), then v2 -> v3 blueprint. chrome / form hold only v2 and v3 (PNG): at v1 their boxes are the v1 boxes with nothing drawn,
  // and the v2 crop fades in while the box morphs, as the live v1 above fades out.
  [["chrome", "c1", "c2", "c3"], ["form", "f1", "f2", "f3"]].forEach(([id, r1, r2, r3]) => {
    const p = P(id);
    add(id, { t: 0, x: 0, y: 0, z: G.eps(p), o: 0, f: 1, tg: 1, rect: r1 }, { t: M0 - 0.0005, o: 0 }, { t: M0, o: 1 },
        G.flat(p, M0, M1, r1, r2), G.rest(p, M1, r2), { t: D0, tg: 1 }, G.explode(p, D0, D1, r2, LIFT), G.morph(p, D1, D2, r2, r3, LIFT), G.resolve(p, D2, D3, r3, LIFT), { t: 1, z: G.eps(p), f: 1, rect: r3 });
  });
  // illustration: new in v3, rises in during the blueprint, then settles into the real design
  const ill = P("illustration"), iS = V(TT.v3.illStart);
  add("illustration", { t: 0, x: 0, y: 0, z: 0, o: 0, f: 0, rect: "i" }, { t: iS, o: 0 },
      G.enter("rise", ill, iS, D2, "i", 0, 1, LIFT), G.resolve(ill, D2, D3, "i", LIFT), { t: 1, z: G.eps(ill), f: 1, rect: "i" });
  // layers (one per feedback round), hidden until v2. 1-3 slide out from beneath v2 (finishing with the morph); 4-7 separate in the blueprint.
  for (let i = 0; i < SLAB_N; i++) {
    const id = `layer-${i + 1}`, peek = 7 * (i + 1), zIso = layerZ(i), zFlat = -(i + 1) * 0.5;
    add(id, { t: 0, x: 0, y: 0, z: zFlat, o: 0, f: 0, tg: 0, rect: "a" });
    if (i < 3) {
      const a = V(TT.v2.peek0 + i * TT.v2.peekStep), b = a + V(TT.v2.peekLen);
      add(id, { t: a - 0.0005, y: 0, o: 0 }, { t: a, o: 1 }, { t: b, y: peek, e: "inOutSine" }, { t: D0, y: peek, z: zFlat, tg: 1, rect: "a" }, { t: D1, y: 0, z: zIso, rect: "b", e: "inOutSine" });
    } else {
      add(id, { t: D0 - 0.0005, y: 0, z: zFlat, o: 0, rect: "a" }, { t: D0, o: 1, tg: 1 }, { t: D1, y: 0, z: zIso, rect: "b", e: "inOutSine" });
    }
    add(id, { t: D2, y: 0, z: zIso, rect: "b" }, { t: D3, y: peek, z: zFlat, rect: "b", e: "inOutSine" }, { t: 1, y: peek, z: zFlat });
  }
  // sticky notes (living layer): fade in staggered on v1 once it has landed, stay pinned over the auto-scrolling form, fade out as the morph begins
  NOTES.forEach((n, i) => {
    const a = V(TT.notes.start + i * TT.notes.step), b = a + V(TT.notes.len);
    add(n.id, { t: 0, x: 0, y: 0, z: 8, o: 0, f: 1, rect: "r" }, { t: a, o: 0 }, { t: b, o: 1, e: "inOutSine" },
        { t: V(TT.notes.fadeOut[0]), o: 1 }, { t: V(TT.notes.fadeOut[1]), o: 0, e: "inOutSine" });
  });

  SCENE.__geom = { POS, TW, TH, BAR_Y, BAR_H, unusedX, unusedW, unusedY, TG, targetX, targetY };
})();

