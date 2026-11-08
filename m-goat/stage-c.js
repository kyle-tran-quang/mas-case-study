/* =========================================================================
   STAGE C (beat 11, "the second iteration"): wiring. Loaded AFTER stage-b.js. It does NOT touch Stage A or B's pieces; it only adds one overlay + one scene hook.
   Pieces / data: stagec-data.js (local timing + copy), stagec-piece.js (the dark screen, wireframe, scroll, zoom, cursor), stagec.css.
   Windows: TIMING.C (story.js, vh of scroll). Retime there.

   WHY AN OVERLAY. C1 is FULL SCREEN (author's request): the generation plays over the whole viewport (UI frame = 70% of the screen width) and only then slides into the left half.
   The scene lives in the left-half column, so C draws into a fixed full-viewport overlay with its OWN engine instance. The overlay's world is placed with the SAME scale and
   centre rule as the main scene (stage 720 x 1024, fit 1, camera 0.8/0.8): its left half therefore coincides with the main stage's pixels when C1 lands.

   HAND-OVER (my decisions, redirect freely)
     in : the overlay appears over the last 10vh of Stage B's rest (TIMING.C.cover) as a light cover (#f4f4f4 left, #fff right = Stage B's own colours), hiding the v1 + notes.
          The right half waits until Stage B's text has left (coverR), so the cover never dims text. Stage B's last pieces are keyed out 1vh after the cover is complete.
     out: the overlay is visible from TIMING.C.cover[0] to TIMING.C.end (a pure function of scroll; nothing to call). Its LAST frame is the rest pose: the 680 x 420 dark window at
          (20, 326.35) of the stage, 1x, form scrolled to the top, no ticks, no cursor (byte-identical to the C1 rest frame). Stage D draws its own identical window and takes over
          beyond TIMING.C.end. window.StageC = { overlay, end, startVh } for reference.
   ========================================================================= */
(function () {
  const TT = window.TIMING, C = TT && TT.C, SP = window.StagecPiece, SD = window.STAGEC, AS = window.AssemblyScene;
  if (!C || !SP || !SD || !AS) return;

  const layout = document.getElementById("layout"), mainScene = document.getElementById("scene");
  if (!layout || !mainScene) return;
  const START = TT.C.draw[0] - SD.TIMING.draw[0];                                      // global vh of the beat's local 0 = 778 (draw starts at local 3, global 781)
  const loc = v => v - START;                                                          // global vh -> stagec-data local vh
  const T = {};                                                                        // the piece reads LOCAL windows from stagec-data.js; recompute them from TIMING.C so retiming in story.js is enough
  Object.keys(SD.TIMING).forEach(k => { T[k] = SD.TIMING[k]; });
  ["cover", "draw", "reveal", "bg", "camera", "scroll", "zoom", "ticks", "out"].forEach(k => { if (C[k]) T[k] = [loc(C[k][0]), loc(C[k][1])]; });
  T.MAX = TT.MAX;
  T.coverR = [loc(C.draw[0] - 4), loc(C.draw[0])];                                    // the right-hand cover waits until Stage B's text column has emptied (the beat boundary), then covers in 4vh

  // ---- the overlay: fixed, full viewport, above the layout, inert. Inside it: two viewport backdrops (left = stage colour, right = page colour) and the stage COLUMN, a box placed exactly
  // where .stage-col is, holding the engine. The engine therefore builds the SAME world (720 x 1024, same scale, same centre) as the main scene, so the landed frame is the main stage's pose by construction.
  const ov = document.createElement("div");
  ov.id = "stageC"; ov.setAttribute("aria-hidden", "true");
  ov.style.cssText = "position:fixed;inset:0;z-index:2;pointer-events:none;visibility:hidden";
  const bgL = document.createElement("div"), bgR = document.createElement("div"), col = document.createElement("div");
  bgL.style.cssText = "position:absolute;left:0;top:0;width:50%;height:100%;opacity:0";
  bgR.style.cssText = "position:absolute;left:50%;top:0;width:50%;height:100%;opacity:0";
  col.style.cssText = "position:absolute;left:0;top:0;width:50%;height:100%";
  ov.append(bgL, bgR, col);
  document.body.insertBefore(ov, document.getElementById("progress"));
  const sheet = document.createElement("style");
  sheet.textContent = "#stageC .asm{overflow:visible;background:transparent} #stageC .asm-stage{overflow:visible}" +
    "@media (max-width:800px){#stageC .st-col{width:100%!important;height:55vh!important} #stageC>div:first-child{width:100%!important;height:55vh!important} #stageC>div:nth-child(2){display:none}}";
  document.head.appendChild(sheet); col.className = "st-col";
  const holder = col;

  // C1's start pose, relative to the SCREEN: the UI frame is 70% of the viewport width, centred in the viewport (the engine world is letterboxed, so measure it)
  let poseKey = "", pose = null;
  T.startPose = () => {
    const narrow = matchMedia("(max-width: 800px)").matches;                          // mobile: the stage is the top 55vh column, so C1's "screen" is that column
    const wEl = holder.querySelector(".asm-world"), o = (narrow ? col : ov).getBoundingClientRect(), key = o.width + "x" + o.height + "/" + col.clientWidth + "x" + col.clientHeight + narrow;
    if (wEl && key !== poseKey) {
      const r = wEl.getBoundingClientRect(), ws = r.width / 720;
      if (ws > 0) {
        const SCR = SP.SCR, s = 0.70 * o.width / (ws * SCR.w), cx = (o.left + o.width / 2 - r.left) / ws, cy = (o.top + o.height / 2 - r.top) / ws;
        pose = { s, tx: cx - (SCR.x + SCR.w / 2) * s, ty: cy - (SCR.y0 + SCR.h / 2) * s }; poseKey = key;
      }
    }
    return pose || { s: 1.3, tx: -200, ty: -150 };
  };
  T.external = true;                                                                   // the backdrops are drawn here (viewport-sized), not inside the piece

  const piece = SP.make({ vh: t => t * TT.MAX - START, T });                           // piece time is the SCENE progress t; the piece converts to LOCAL vh
  const SC = {
    ariaLabel: "The second iteration of the assessment: a dark questionnaire screen, generated, then scrolled and zoomed to its first question.", hud: false, grid: false, fit: 1,
    frames: { stage: { w: 720, h: 1024 } },
    pieces: [{ id: "stagec", label: "Second iteration", kind: "media", depth: 0, rects: { r: { x: 0, y: 0, w: 720, h: 1024 } }, html: piece.html, update: piece.update, keys: [{ t: 0, x: 0, y: 0, z: 0, o: 1, f: 1, rect: "r" }] }],
    camera: [{ t: 0, rx: 0, rz: 0, s: 0.8 }, { t: 1, rx: 0, rz: 0, s: 0.8 }]
  };
  const sceneC = AS.mount(holder, { scene: SC, story: { title: "Stage C", beats: [{ id: "second", range: [0, 1], theme: "light", title: "Second iteration" }] } });
  window.StageC = { overlay: ov, end: C.end, startVh: C.cover[0], T, START };                  // visibility is a pure function of scroll (see afterRender); no hide()/show() to keep in sync
  const HEX = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (p, q, u) => { const A = HEX(p), B = HEX(q); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); };

  // ---- clean hand-over: Stage B's last pieces (the v1, its notes) are still keyed on the main scene. They sit under the opaque cover, but whatever follows Stage C (Stage D) would
  // find them there again, so they are keyed out 1vh after the cover is complete. Pure keys (hold, then 0), so scrolling back restores them exactly. Nothing before this vh changes.
  {
    const tHide = (C.cover[1] + 1) / TT.MAX, eps = 0.0005;
    SCENE.pieces.forEach(p => {
      const ks = p.keys; if (!ks || !ks.length) return;
      const last = ks[ks.length - 1]; if (last.t >= tHide - eps) return;                   // already keyed past this point by someone else
      let o = 0; for (let i = ks.length - 1; i >= 0; i--) if (ks[i].o !== undefined) { o = ks[i].o; break; }
      if (o === 0) return;                                                                 // already invisible at the end of Stage B
      ks.push({ t: tHide - eps, o }, { t: tHide, o: 0 });
    });
  }

  // ---- the SCENE hook. index.html calls SCENE.afterRender(t) after every main-scene render (one line there). A pure function of t, so scrolling back reverses it.
  SCENE.afterRender = function (t) {
    const v = t * TT.MAX;
    const on = v >= C.cover[0] && v <= C.end + 0.05;                          // visible from the cover to the END of Stage C. Above this the overlay is gone and whatever follows (Stage D) shows its own, identical window
    ov.style.visibility = on ? "visible" : "hidden";
    if (!on) return;
    sceneC.render(t);
    const body = holder.querySelector("[data-html]"), st = body && body.firstChild && body.firstChild.__sc, S = st && st.state;
    if (S) {
      bgL.style.background = mix("#f4f4f4", "#262626", S.bgU); bgR.style.background = mix("#ffffff", "#161616", S.bgU);   // light = Stage B's own colours (stage #f4f4f4, page #fff); dark = Figma slide 13 (#262626 / #161616)
      bgL.style.opacity = S.covU.toFixed(3); bgR.style.opacity = S.bgRU.toFixed(3);
    }
    // the page theme: it stays light until the backdrop is dark (index.html reads layout.dataset.cdark), whatever the beat says
    const bgU = Math.min(1, Math.max(0, (v - C.bg[0]) / (C.bg[1] - C.bg[0])));
    layout.dataset.cdark = bgU > 0.5 ? "1" : "0";
  };
})();
