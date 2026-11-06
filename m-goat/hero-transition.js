/* =========================================================================
   HERO -> SCENE TRANSITION (pure functions, no DOM). The composer (index.html) applies the numbers this returns.

   Scroll mapping (one clock, scroll):
     scrollY in [0, introPx]                 -> q in [0,1]  the hero morphs into the stage
     scrollY in [introPx, introPx + scenePx] -> t in [0,1]  the story scene (unchanged, see story.js)
   The two meet at scrollY = introPx, where q = 1 and t = 0.

   What happens as q goes 0 -> 1 (ranges are fractions of the intro; edit PH to retime):
     text   0.00-0.30  hero text fades and drifts up
     box    0.20-0.80  the rounded image box travels from the hero image slot to the stage rect, corners 20px -> 0
     bg     0.30-0.75  the hero's #f2f2f2 background fades, revealing the split layout (grey stage, white story column)
     scene  0.60-0.90  the scene (first frame: the tilted skeleton) fades in underneath
     image  0.65-0.92  the hero image fades out on top, i.e. it dissolves into the skeleton
     copy   0.80-1.00  the story column's first text arrives, after the box has landed
   ========================================================================= */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const inOutCubic = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const PH = { text: [0, 0.30], box: [0.20, 0.80], bg: [0.30, 0.75], scene: [0.60, 0.90], image: [0.65, 0.92], copy: [0.80, 1.00] };
  const RADIUS = 20, DRIFT = 40;      // hero image corner radius (Figma 82:8719) and how far the hero text drifts up, px

  // scroll position -> { q, t }. introPx / scenePx are the scroll distances of each part, in px.
  function progress(scrollY, introPx, scenePx) {
    const q = introPx > 0 ? clamp(scrollY / introPx, 0, 1) : 1;
    const t = clamp((scrollY - introPx) / Math.max(1, scenePx), 0, 1);
    return { q, t };
  }

  // q + the two rects (viewport px: {x,y,w,h}) -> everything the composer needs to draw this frame
  function state(q, R0, R1) {
    q = clamp(q, 0, 1);
    const u = inOutCubic(clamp((q - PH.box[0]) / (PH.box[1] - PH.box[0]), 0, 1)), tx = smooth(PH.text[0], PH.text[1], q);
    return {
      q, u,
      text:  { opacity: 1 - tx, y: -DRIFT * tx },
      bg:    { opacity: 1 - smooth(PH.bg[0], PH.bg[1], q) },
      box:   { x: lerp(R0.x, R1.x, u), y: lerp(R0.y, R1.y, u), w: lerp(R0.w, R1.w, u), h: lerp(R0.h, R1.h, u), radius: RADIUS * (1 - u),
               opacity: 1 - smooth(PH.image[0], PH.image[1], q) },
      scene: { opacity: smooth(PH.scene[0], PH.scene[1], q) },
      copy:  { opacity: smooth(PH.copy[0], PH.copy[1], q) },
      done:  q >= 1                       // the hero overlay is hidden entirely
    };
  }

  window.HeroTransition = { PH, progress, state };
})();
