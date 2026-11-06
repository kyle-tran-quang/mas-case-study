/* Pacing audit for ui-assembly-animation scenes.
 *
 * Reads SCENE only (pieces[].keys, extras[].keys, camera, beats, scrollVh). No DOM needed.
 *   Browser: load this file in a throwaway copy of the page, then `pacingAudit(SCENE)` in the console.
 *   Node:    const audit = require("./pacing-audit.js"); console.log(audit(SCENE));
 *
 * It converts progress `t` to scroll distance (vh and px) and checks the rules in reference/pacing.md:
 *   - tooShort      a piece/camera move that is too brief to be seen at normal scroll speed
 *   - tooFast       a move whose peak on-screen speed outruns the scroll that drives it (runs away from the finger)
 *   - deadScroll    scroll with nothing happening that is not a deliberate hold
 *   - notAtRest     a text anchor (beat.snap) where the stage is still moving: a reader who stops to read sees a frozen mid-motion frame
 *   - holdTooShort  a hold beat whose still window around the text anchor is shorter than its copy needs
 *   - anchorGaps    distance between consecutive text anchors (scroll budget); too-close anchors are reported as `crowded`
 *   - overlapping   more than `maxBurst` pieces starting a large move at the same instant, not in lockstep with the camera (an unstaggered lump)
 *
 * Thresholds are starting points, not laws. Tune by eye, then record the final numbers in the pacing worksheet.
 */
function pacingAudit(SCENE, opt = {}) {
  const o = Object.assign({
    viewportH: 900,        // px per 100vh used to turn vh into scroll px
    minMoveVh: 8,          // a visible move needs at least this much scroll (~70px of finger travel)
    maxGain: 6,            // peak on-screen px moved per px scrolled (1 = parallax-neutral; >6 runs away from the finger)
    deadVh: 20,            // longer than this with nothing moving, and not a hold, is dead scroll
    restVh: 10,            // stage must be still within +/- this many vh of every text anchor
    minHoldVh: 20,         // the still window around a hold's text anchor must be at least this long...
    holdVhPerWord: 0.6,    // ...plus this per word of the copy it carries (words come from beat.words or STORY), capped at maxHoldVh
    maxHoldVh: 60,
    minAnchorGapVh: 55,    // two text blocks closer than this crowd each other on screen
    maxBurst: 4,           // more than this many pieces starting a large move inside the same sliver of scroll = unstaggered lump
    heroWindowVh: 6
  }, opt);

  const maxVh = Math.max(1, SCENE.scrollVh - 100);               // scrollable distance in vh
  const vh = dt => dt * maxVh, px = dt => vh(dt) / 100 * o.viewportH;
  const E = {
    linear: t => t, inQuad: t => t * t,
    inOutCubic: t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2,
    inOutQuart: t => t < .5 ? 8*t**4 : 1 - Math.pow(-2*t + 2, 4) / 2,
    outBack: t => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  const peak = name => { const f = E[name] || E.inOutCubic; let m = 0; for (let i = 0; i < 100; i++) m = Math.max(m, (f((i + 1) / 100) - f(i / 100)) * 100); return m; };

  const MOVE = ["x", "y", "z", "rx", "rz", "s", "f"], SOFT = ["o", "a", "dx", "dy"];
  const DEF = { x: 0, y: 0, z: 0, rx: 0, rz: 0, s: 1, o: 1, f: 0, a: 0, dx: 0, dy: 0 };
  const cam = SCENE.camera || [];
  const camS = t => { // camera scale at t, for converting reference px to screen px
    if (!cam.length) return 1;
    if (t <= cam[0].t) return cam[0].s ?? 1;
    for (let i = 1; i < cam.length; i++) if (t <= cam[i].t) { const a = cam[i - 1], b = cam[i], u = (t - a.t) / Math.max(1e-6, b.t - a.t); return (a.s ?? 1) + ((b.s ?? a.s ?? 1) - (a.s ?? 1)) * u; }
    return cam[cam.length - 1].s ?? 1;
  };

  // Walk a key list and return every interval in which something changes.
  const rectsOf = {}; SCENE.pieces.forEach(p => { rectsOf[p.id] = p.rects || {}; });
  const sameRect = (id, a, b) => a === b || JSON.stringify((rectsOf[id] || {})[a]) === JSON.stringify((rectsOf[id] || {})[b]);   // renamed but identical geometry is not motion
  const spans = (keys, label, kind) => {
    const out = [], st = {};
    (keys || []).forEach((k, i) => {
      if (i) {
        const prevT = keys[i - 1].t, cur = p => st[p] ?? DEF[p];
        const d = p => (k[p] !== undefined ? k[p] - cur(p) : 0);
        const moved = MOVE.some(p => Math.abs(d(p)) > 1e-9) || (k.rect && st.rect && !sameRect(label, k.rect, st.rect)) || (k.at && k.at !== st.at);
        const soft = SOFT.some(p => Math.abs(d(p)) > 1e-9);
        if (moved || soft) {
          const dist = Math.hypot(d("x"), d("y"), d("z")), rot = Math.hypot(d("rx"), d("rz"));
          out.push({ label, kind, t0: prevT, t1: k.t, moved, dist, rot, e: k.e || "inOutCubic" });
        }
      }
      Object.assign(st, k);
    });
    return out;
  };

  const pieceSpans = SCENE.pieces.flatMap(p => spans(p.keys, p.id, "piece"));
  const extraSpans = (SCENE.extras || []).flatMap(e => spans(e.keys, e.id, "extra"));
  const camSpans = spans(cam, "camera", "camera");
  const stageSpans = [...pieceSpans, ...camSpans];               // what the eye reads as "the scene is moving"
  const all = [...stageSpans, ...extraSpans];

  // 1. too short / too fast (only real moves; opacity-only fades may be quick)
  const tooShort = [], tooFast = [];
  stageSpans.filter(s => s.moved).forEach(s => {
    const len = vh(s.t1 - s.t0);
    if (len < o.minMoveVh) tooShort.push(`${s.label} @t=${s.t0.toFixed(3)}: ${len.toFixed(1)}vh (min ${o.minMoveVh})`);
    const scrollPx = px(s.t1 - s.t0), sc = camS((s.t0 + s.t1) / 2);
    // screen travel: translation scaled by camera, rotation approximated as 3px per degree at stage scale
    const travel = s.dist * sc + s.rot * 3;
    const gain = travel * peak(s.e) / Math.max(1, scrollPx);
    if (gain > o.maxGain) tooFast.push(`${s.label} @t=${s.t0.toFixed(3)}: peak ${gain.toFixed(1)}x scroll speed (max ${o.maxGain}); lengthen or shorten the distance`);
  });

  // 2. dead scroll: gaps in the union of all activity that are not inside a hold beat
  const busy = all.map(s => [s.t0, s.t1]).sort((a, b) => a[0] - b[0]);
  const merged = busy.reduce((m, s) => { const l = m[m.length - 1]; if (l && s[0] <= l[1]) l[1] = Math.max(l[1], s[1]); else m.push([...s]); return m; }, []);
  const holds = SCENE.beats.filter(b => b.hold).map(b => b.range);
  const deadScroll = [];
  for (let i = 1; i < merged.length; i++) {
    const g = [merged[i - 1][1], merged[i][0]];
    const inHold = holds.some(h => g[0] >= h[0] - 1e-9 && g[1] <= h[1] + 1e-9);
    if (vh(g[1] - g[0]) > o.deadVh && !inHold) deadScroll.push(`${vh(g[1] - g[0]).toFixed(0)}vh of nothing at t=${g[0].toFixed(3)}-${g[1].toFixed(3)}`);
  }

  // 3. every text anchor must land on a still stage (pieces + camera)
  const rest = o.restVh / maxVh;
  const notAtRest = [];
  SCENE.beats.filter(b => b.snap != null).forEach(b => {
    const movers = new Set(stageSpans.filter(s => s.moved && s.t0 < b.snap + rest && s.t1 > b.snap - rest).map(s => s.label));
    if (movers.size) notAtRest.push(`${b.id} (anchor t=${b.snap}): ${[...movers].slice(0, 6).join(", ")}${movers.size > 6 ? ` +${movers.size - 6} more` : ""} still moving within ${o.restVh}vh`);
  });

  // 4. hold length vs. reading time: the contiguous still window around the text anchor is what a reader actually dwells in
  const holdTooShort = [];
  const movingSpans = stageSpans.filter(s => s.moved);
  SCENE.beats.filter(b => b.hold).forEach(b => {
    const at = b.snap ?? (b.range[0] + b.range[1]) / 2;
    const words = b.words ?? (typeof STORY !== "undefined" ? ((STORY.beats.find(x => x.id === b.id) || {}).body || "").split(/\s+/).filter(Boolean).length : 0);
    const need = Math.min(o.maxHoldVh, o.minHoldVh + words * o.holdVhPerWord);
    let lo = 0, hi = 1;                                         // grow outward from the anchor until a move is hit
    movingSpans.forEach(s => { if (s.t1 <= at) lo = Math.max(lo, s.t1); else if (s.t0 >= at) hi = Math.min(hi, s.t0); else { lo = hi = at; } });
    const have = vh(hi - lo);
    if (have < need) holdTooShort.push(`${b.id}: ${have.toFixed(0)}vh of still around the anchor, needs ~${need.toFixed(0)}vh for ${words || "?"} words`);
  });

  // 5. unstaggered bursts: many pieces starting a large move at (nearly) the same instant read as one lump, not as assembly
  const win = o.heroWindowVh / maxVh, overlapping = [];
  const withCamera = s => camSpans.some(c => c.moved && Math.abs(c.t0 - s.t0) < 1e-6 && Math.abs(c.t1 - s.t1) < 1e-6);   // lockstep with the camera = one coordinated move
  const starts = pieceSpans.filter(s => s.moved && s.dist > 40 && !withCamera(s)).sort((a, b) => a.t0 - b.t0);
  const bursts = [];
  for (let i = 0; i < starts.length; i++) {
    const g = starts.filter(s => s.t0 >= starts[i].t0 && s.t0 < starts[i].t0 + 0.2 * win);
    if (g.length > o.maxBurst && !bursts.some(b => Math.abs(b.t - starts[i].t0) < win)) bursts.push({ t: starts[i].t0, n: g.length });
  }
  bursts.forEach(b => overlapping.push(`${b.n} pieces start a large move together at t=${b.t.toFixed(3)}: stagger them`));

  // 6. scroll budget
  const anchors = SCENE.beats.map(b => b.snap ?? (b.range[0] + b.range[1]) / 2).sort((a, b) => a - b);
  const anchorGaps = anchors.slice(1).map((a, i) => +vh(a - anchors[i]).toFixed(0));
  const budgetVh = 100 * SCENE.beats.length + 40;
  const crowded = anchorGaps.map((g, i) => g < o.minAnchorGapVh ? `anchors ${i + 1}-${i + 2} are ${g}vh apart (min ${o.minAnchorGapVh})` : null).filter(Boolean);

  return {
    totalVh: SCENE.scrollVh, budgetVh,
    overBudget: SCENE.scrollVh > budgetVh,
    anchorGapsVh: anchorGaps, anchorGapOver100: anchorGaps.filter(g => g > 110).length,
    perBeatVh: SCENE.beats.map(b => `${b.id}: ${vh(b.range[1] - b.range[0]).toFixed(0)}vh`),
    tooShort, tooFast, deadScroll, notAtRest, holdTooShort, overlapping, crowded,
    pass: !tooShort.length && !tooFast.length && !deadScroll.length && !notAtRest.length && !holdTooShort.length && !overlapping.length && !crowded.length
          && SCENE.scrollVh <= budgetVh && !anchorGaps.some(g => g > 110)
  };
}
if (typeof module !== "undefined") module.exports = pacingAudit;
if (typeof window !== "undefined") window.pacingAudit = pacingAudit;
