/* =========================================================================
   ASSEMBLY ENGINE: renders the left-hand scene as a pure function of progress t in [0,1].
   It knows nothing about scrolling or the text column, so it can be embedded anywhere:

     const scene = AssemblyScene.mount(containerEl, { scene: SCENE, story: STORY });
     scene.render(0.42);        // call from any clock (scroll, slider, video export)
     scene.destroy();

   Container needs a size (the scene fills it) and scene.css loaded.
   Theme: the engine sets data-theme on the container from the story beat at t.
   ========================================================================= */
(function () {
  const E = {
    linear: t => t,
    inOutCubic: t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2,
    inOutQuart: t => t < .5 ? 8*t**4 : 1 - Math.pow(-2*t + 2, 4) / 2,
    outBack: t => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u*u*(3 - 2*u); };
  const PROPS = ["x","y","z","rx","rz","s","o","f"];

  // Sample keyframes: unset props carry forward; each segment eases into its end key (key.e). `rect` is discrete and crossfades.
  function sample(keys, t, defaults) {
    const state = { ...defaults };
    let prev = { t: -Infinity, ...defaults }, next = null;
    for (const k of keys) {
      if (k.t <= t) { Object.assign(state, k); prev = { ...state, t: k.t }; }
      else { next = k; break; }
    }
    const out = { ...defaults, ...prev };
    out.rectA = prev.rect; out.rectB = prev.rect; out.u = 0;
    if (next && prev.t === -Infinity) out.rectA = out.rectB = next.rect || defaults.rect;
    else if (next) {
      const u = (E[next.e] || E.inOutCubic)(clamp((t - prev.t) / Math.max(1e-6, next.t - prev.t), 0, 1));
      for (const k of PROPS) if (next[k] !== undefined) out[k] = lerp(prev[k] ?? defaults[k] ?? 0, next[k], u);
      if (next.rect) { out.rectB = next.rect; out.u = u; }
    }
    return out;
  }

  function mount(root, { scene: SCENE, story: STORY }) {
    root.classList.add("asm");
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", SCENE.ariaLabel || STORY.title || "Animated UI assembly");
    root.innerHTML = '<div class="asm-stage"><div class="asm-world"><div class="asm-grid"></div></div></div>' +
                     '<div class="asm-hud" aria-hidden="true"><span class="hud-title"></span><div class="rail"><i></i></div></div>';
    const stage = root.querySelector(".asm-stage"), world = root.querySelector(".asm-world"), gridEl = root.querySelector(".asm-grid");
    const hudTitle = root.querySelector(".hud-title"), hudFill = root.querySelector(".rail i");
    const frameKey = Object.keys(SCENE.frames)[0], F = SCENE.frames[frameKey];

    const nodes = SCENE.pieces.map(p => {
      const el = document.createElement("div");
      el.className = "piece"; el.dataset.kind = p.kind; if (p.bare) el.dataset.bare = ""; el.setAttribute("aria-hidden", "true");
      if (p.origin) el.style.transformOrigin = p.origin;
      if (p.radius) el.style.setProperty("--r", p.radius + "px");
      el.innerHTML = '<div class="outline"></div><div class="layer a"></div><div class="layer b"></div><div class="tag"></div>';
      const r = p.rects[frameKey];
      el.querySelector(".tag").textContent = r ? `${p.label} · ${r.w}×${r.h}` : p.label;
      world.appendChild(el);
      return { el, outline: el.querySelector(".outline"), tag: el.querySelector(".tag"), a: el.querySelector(".a"), b: el.querySelector(".b"), p };
    });

    function paintLayer(layer, p, name, box, opacity) {
      const R = p.rects[name], Fr = SCENE.frames[(R && R.img) || name], src = Fr && Fr.src;   // R.img: crop from a different image than the frame
      if (!src || !R || opacity <= 0.001) { layer.style.opacity = 0; return; }
      const kx = box.w / R.w, ky = box.h / R.h;
      layer.style.opacity = opacity;
      layer.style.backgroundImage = `url(${src})`;
      layer.style.backgroundSize = `${Fr.w * kx}px ${Fr.h * ky}px`;
      layer.style.backgroundPosition = `${-(R.ix ?? R.x) * kx}px ${-(R.iy ?? R.y) * ky}px`;
    }

    const beatAt = t => STORY.beats.findIndex((b, i) => t >= b.range[0] && (t < b.range[1] || i === STORY.beats.length - 1));
    let lastTheme = "";

    function render(t) {
      t = clamp(t, 0, 1);
      const cam = sample(SCENE.camera, t, { rx: 55, rz: -45, s: 0.7 });
      const ws = Math.min(stage.clientWidth / F.w, stage.clientHeight / F.h) * 0.92 * cam.s / 0.8;
      world.style.width = F.w + "px"; world.style.height = F.h + "px";
      world.style.setProperty("--inv", (1 / ws).toFixed(4));
      world.style.transform = `translate(-50%,-50%) scale(${ws}) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg)`;
      const camF = smooth(25, 4, cam.rx);                      // fidelity allowed by camera angle: 3D stays low-fi
      gridEl.style.opacity = SCENE.grid ? 1 - camF : 0;
      nodes.forEach(n => {
        const { el, outline, tag, a, b, p } = n;
        const k = sample(p.keys, t, { x:0, y:0, z:0, rx:0, rz:0, s:1, o:0, f:0, rect: Object.keys(p.rects)[0] });
        const A = p.rects[k.rectA], B = p.rects[k.rectB];
        const box = { x: lerp(A.x, B.x, k.u), y: lerp(A.y, B.y, k.u), w: lerp(A.w, B.w, k.u), h: lerp(A.h, B.h, k.u) };
        const f = p.solid ? k.f : Math.min(k.f, camF), hasImg = !!SCENE.frames[k.rectA]?.src;
        el.style.width = box.w + "px"; el.style.height = box.h + "px"; el.style.opacity = k.o;
        el.style.transform = `translate3d(${box.x + k.x}px,${box.y + k.y}px,${k.z}px) rotateX(${k.rx}deg) rotateZ(${k.rz}deg) scale(${k.s})`;
        outline.style.opacity = 1 - f * (hasImg ? 0.95 : 0.85);
        const lab = (p.labels && p.labels[k.u > 0.5 ? k.rectB : k.rectA]) || p.label, txt = `${lab} · ${Math.round(box.w)}×${Math.round(box.h)}`;
        if (n.txt !== txt) { n.txt = txt; tag.textContent = txt; }
        tag.style.opacity = f < 0.3 ? 1 - f / 0.3 : 0;
        tag.style.maxWidth = (box.w * ws) + "px";               // tag is counter-scaled, so clip it to the piece's on-screen width
        paintLayer(a, p, k.rectA, box, k.rectB === k.rectA ? f : f * (1 - k.u));
        paintLayer(b, p, k.rectB, box, k.rectB === k.rectA ? 0 : f * k.u);
      });
      const bi = beatAt(t), beat = STORY.beats[bi];
      if (beat && beat.theme !== lastTheme) { lastTheme = beat.theme; root.dataset.theme = beat.theme; }
      hudTitle.textContent = beat ? `${String(bi + 1).padStart(2, "0")} / ${String(STORY.beats.length).padStart(2, "0")}   ${beat.title.toUpperCase()}` : "";
      hudFill.style.transform = `scaleX(${t})`;
      return { beat: beat && beat.id, cam };
    }
    const ro = new ResizeObserver(() => render(+root.dataset.t || 0));
    ro.observe(root);
    const api = { render: t => { root.dataset.t = t; return render(t); }, destroy() { ro.disconnect(); root.innerHTML = ""; }, root };
    return api;
  }

  /* Key generators. Compose per piece per beat; append in increasing t (keys are not re-sorted).
     eps keeps coplanar pieces in a stable stacking order once flat (a hair of z per depth level). */
  const G = {
    eps: p => p.depth * 0.4,
    rest: (p, t, rect) => ({ t, x:0, y:0, z:G.eps(p), rx:0, rz:0, s:1, o:1, f:1, rect }),
    // style: drop | slideL | slideR | slideT | rise | unfold | pop. Staggered by `order` of `count` across [t0,t1].
    enter(style, p, t0, t1, rect, order, count, L) {
      const stag = 0.5 * (t1 - t0), step = count > 1 ? stag / (count - 1) : 0;
      const a = t0 + order * step, b = Math.min(t1, a + (t1 - t0) - stag), lift = p.depth * L;
      const from = ({ drop: { z: lift + 420 }, slideL: { x: -560, z: lift }, slideR: { x: 560, z: lift }, slideT: { y: -420, z: lift }, rise: { z: lift - 360 },
                      unfold: { rx: -88, z: lift }, pop: { s: 0.55, z: lift } })[style] || { z: lift + 420 };
      const e = (style === "drop" || style === "pop") ? "outBack" : "inOutQuart";
      return [ { t: t0, ...from, o: 0, f: 0, rect }, { t: a, ...from, o: 0, f: 0, rect },
               { t: b, x: 0, y: 0, z: lift, rx: 0, s: 1, o: 1, f: 0, rect, e } ];
    },
    // lag (0..1) delays the fidelity ramp so a base layer only shows the real design once everything above it has landed
    resolve: (p, t0, t1, rect, L, lag = 0) => [ { t: t0, z: p.depth * L, f: 0, rect },
      ...(lag ? [{ t: t0 + (t1 - t0) * lag, f: 0 }] : []), { t: t1, z: G.eps(p), f: 1, rect } ],
    explode: (p, t0, t1, rect, L) => [ { t: t0, z: G.eps(p), f: 1, rect }, { t: t1, z: p.depth * L, f: 0, rect } ],
    // slide + resize between two frames' rects (crop crossfades while f = 0, so it is never seen)
    morph: (p, t0, t1, from, to, L) => [ { t: t0, z: p.depth * L, rect: from }, { t: t1, z: p.depth * L, rect: to, e: "inOutQuart" } ],
    // UI morph (no blueprint): stays flat and fully real; the rect interpolates and the old/new crops crossfade
    flat: (p, t0, t1, from, to) => [ { t: t0, z: G.eps(p), f: 1, rect: from }, { t: t1, z: G.eps(p), f: 1, rect: to, e: "inOutQuart" } ],
    // removed piece: drops away beneath the stack and fades
    exit: (p, t0, t1, L) => [ { t: t0, z: p.depth * L, o: 1, f: 0 }, { t: t1, z: p.depth * L - 380, o: 0, e: "inOutQuart" } ]
  };

  window.AssemblyScene = { mount, G, sample, E };
})();
