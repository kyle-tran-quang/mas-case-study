/* =========================================================================
   SCENE DATA: the left-hand design pieces, derived from three Figma frames (all 1584 x 900):
     v1  = "Shell · left · expanded"  node 1839:15134  (concept 1)
     v1b = "Shell · left · expanded"  node 1953:44802  (concept 1 variation: cards expanded)
     v2  = "Shell · left · expanded"  node 1951:28125  (Bob Code, two editors)
     v3  = "Shell · left · expanded"  node 1952:28556  (Bob Code + chat panel)
     v4  = "Shell · left · expanded"  node 1927:17635  (chat with an Actions panel; switched back to from Bob Code)
   v4b = v4 with the sidebar, conversation and Actions panel erased (derived, see assets/v4-base.png); those regions are separate pieces
   v3p = v3 with the chat panel's content erased (derived, see assets/v3-panel.png), so that content can animate in as separate pieces
   Beat ranges come from STORY (story.js); sub-beat offsets below are in progress units from each beat's start,
   so retiming the story retimes the scene.
   ========================================================================= */
(function () {
  const { G } = window.AssemblyScene, S0 = STORY.beats.find(b => b.id === "switch").range[0], K = S0;   // the first six beats are authored on their original 0..1 timeline (B), then squeezed by K to make room for "switch"
  const B = Object.fromEntries(STORY.beats.map(b => [b.id, b.range.map(v => v / K)]));
  const L = 70;   // lift per depth level, reference px
  const FULL = { x: 0, y: 0, w: 1584, h: 900 };

  const SCENE = window.SCENE = {
    ariaLabel: "Animated assembly of the IBM Bob concept: a side nav, content panel, prompt and starter cards build up in 3D and settle into the flat design. The cards then grow, the screen transforms into Bob Code, a file explorer with two editors, and a click on the mode toggle returns to chat.",
    grid: true,
    frames: {
      v1:  { w: 1584, h: 900, src: "assets/v1.png" },
      v1b: { w: 1584, h: 900, src: "assets/v1b.png" },
      v2:  { w: 1584, h: 900, src: "assets/v2.png" },
      v3:  { w: 1584, h: 900, src: "assets/v3.png" },
      v3p: { w: 1584, h: 900, src: "assets/v3-panel.png" },
      v4:  { w: 1584, h: 900, src: "assets/v4.png" },
      v4b: { w: 1584, h: 900, src: "assets/v4-base.png" },
      cursor: { w: 24, h: 24, src: "assets/cursor.png" }
    },
    // enter: drop | slideL | slideR | slideT | rise | unfold | pop      labels: optional name per frame (tags show "name · w×h", live)
    pieces: [
      { id: "shell",    label: "Shell",              kind: "shell",   depth: 0, enter: "rise",   rects: { v1: FULL, v1b: FULL, v2: FULL, v3p: FULL, v4b: FULL } },
      { id: "sidebar",  label: "Sidebar",            kind: "nav",     depth: 1, enter: "slideL", labels: { v2: "File explorer", v4: "Chat nav" },
        rects: { v1: { x: 0, y: 0, w: 279, h: 658 }, v1b: { x: 0, y: 0, w: 279, h: 660 }, v2: { x: 8, y: 50, w: 304, h: 842 }, v3p: { x: 8, y: 50, w: 304, h: 842 }, v4: { x: 0, y: 0, w: 279, h: 658 } } },
      { id: "content",  label: "Content panel",      kind: "section", depth: 1, enter: "rise",   radius: 12, labels: { v2: "Editor 1", v4: "Conversation" },
        rects: { v1: { x: 279, y: 16, w: 1289, h: 868 }, v1b: { x: 279, y: 16, w: 1289, h: 868 }, v2: { x: 313, y: 50, w: 631, h: 842 }, v3p: { x: 312, y: 50, w: 960, h: 842 }, v4: { x: 291, y: 16, w: 1036, h: 868 } } },
      { id: "editor-2", label: "Editor 2",           kind: "section", depth: 1, enter: "rise",   radius: 12, labels: { v1b: "Editor 2 (split)", v3p: "Chat panel", v4: "Actions panel" },
        rects: { v1b: { x: 279, y: 16, w: 1289, h: 868 }, v2: { x: 945, y: 50, w: 631, h: 842 }, v3p: { x: 1272, y: 50, w: 304, h: 842 }, v4: { x: 1335, y: 16, w: 233, h: 868 } } },
      { id: "topbar",   label: "Top bar",            kind: "nav",     depth: 1, enter: "slideT", rects: { v2: { x: 0, y: 0, w: 1584, h: 48 } } },
      { id: "filter",   label: "Filter",             kind: "control", depth: 2, enter: "pop",    radius: 4, rects: { v2: { x: 20, y: 106, w: 280, h: 32 } } },
      { id: "files",    label: "File tree",          kind: "section", depth: 2, enter: "unfold", origin: "50% 0%", radius: 4, rects: { v2: { x: 20, y: 146, w: 280, h: 584 } } },
      { id: "toggle",   label: "Mode toggle",        kind: "control", depth: 2, enter: "pop",    radius: 16,
        rects: { v1: { x: 205, y: 20, w: 62, h: 32 }, v1b: { x: 205, y: 20, w: 62, h: 32 }, v2: { x: 249, y: 8, w: 62, h: 32 }, v4: { x: 205, y: 20, w: 62, h: 32 } } },
      { id: "title",    label: "Heading + folder",   kind: "heading", depth: 2, enter: "drop",
        rects: { v1: { x: 611, y: 243, w: 313, h: 100 }, v1b: { x: 303, y: 226, w: 313, h: 100 } } },
      { id: "prompt",   label: "Prompt box",         kind: "control", depth: 2, enter: "drop",   radius: 12,
        rects: { v1: { x: 611, y: 383, w: 623, h: 110 }, v1b: { x: 295, y: 776, w: 1257, h: 84 } } },
      { id: "card-a",   label: "Detect anomalies",   kind: "card",    depth: 2, enter: "unfold", origin: "50% 100%", radius: 8, labels: { v1b: "Starter card 1" },
        rects: { v1: { x: 611, y: 533, w: 192, h: 124 }, v1b: { x: 303, y: 366, w: 386, h: 370 } } },
      { id: "card-b",   label: "Run data profiling", kind: "card",    depth: 2, enter: "unfold", origin: "50% 100%", radius: 8, labels: { v1b: "Starter card 2" },
        rects: { v1: { x: 827, y: 533, w: 192, h: 124 }, v1b: { x: 713, y: 366, w: 386, h: 370 } } },
      { id: "card-c",   label: "Explore prompts",    kind: "card",    depth: 2, enter: "unfold", origin: "50% 100%", radius: 8, labels: { v1b: "Starter card 3" },
        rects: { v1: { x: 1043, y: 533, w: 192, h: 124 }, v1b: { x: 1124, y: 366, w: 386, h: 370 } } },
      { id: "folder",   label: "Folder menu",        kind: "control", depth: 3, enter: "pop",    radius: 14, rects: { v1: { x: 611, y: 350, w: 397, h: 130 } } },
      { id: "tooltip",  label: "Tooltip",            kind: "control", depth: 3, enter: "pop",    radius: 8,  rects: { v1b: { x: 162, y: 324, w: 156, h: 36 } } },
      // cursor: bare (no outline or tag) and solid (stays visible in 3D); cropped from its own image
      { id: "cursor",   label: "Cursor",             kind: "control", depth: 3, bare: true, solid: true,
        rects: { v1b: { x: 236, y: 301, w: 24, h: 24, img: "cursor", ix: 0, iy: 0 },
                 v2:  { x: 913.5, y: 70, w: 24, h: 24, img: "cursor", ix: 0, iy: 0 },
                 v4:  { x: 257.5, y: 20, w: 24, h: 24, img: "cursor", ix: 0, iy: 0 } } },      // v4: fingertip lands on the CHAT side of the toggle at (265, 24)
      // v2: fingertip (7.5, 4) lands on the LEFT editor's chat button at (921, 74)
      // chat panel content: crops of v3 that sit exactly on the erased rects of v3p; they never appear in blueprint
      { id: "chat-hero",  label: "Greeting",     kind: "section", depth: 2, bare: true, solid: true, rects: { v3: { x: 1282, y: 144, w: 236, h: 117 } } },
      { id: "chat-row-1", label: "Activity 1",   kind: "section", depth: 2, bare: true, solid: true, rects: { v3: { x: 1282, y: 330, w: 284, h: 62 } } },
      { id: "chat-row-2", label: "Activity 2",   kind: "section", depth: 2, bare: true, solid: true, rects: { v3: { x: 1282, y: 398, w: 284, h: 62 } } },
      { id: "chat-row-3", label: "Activity 3",   kind: "section", depth: 2, bare: true, solid: true, rects: { v3: { x: 1282, y: 466, w: 284, h: 62 } } },
      { id: "chat-input", label: "Ask Bob",      kind: "control", depth: 2, bare: true, solid: true, rects: { v3: { x: 1282, y: 798, w: 284, h: 79 } } }
    ],
    // Camera: slow orbit while assembling, flat for each resolve hold, tilting back (same yaw direction) for each transformation.
    // Wide yaw is paired with a smaller scale so corners stay on stage.
    camera: []
  };

  const r0 = B.resolve[0], e0 = B.expand[0], c0 = B.code[0], P = id => SCENE.pieces.find(p => p.id === id);
  SCENE.camera.push(
    { t: 0,                rx: 58, rz: -40, s: 0.54 },
    { t: B.assemble[0],    rx: 58, rz: -32, s: 0.54 },
    { t: B.assemble[1],    rx: 54, rz: -14, s: 0.58 },
    { t: r0 + 0.07,        rx: 0,  rz: 0,   s: 0.80 },      // flat: concept 1
    { t: e0,               rx: 0,  rz: 0,   s: 0.80 },
    { t: e0 + 0.05,        rx: 52, rz: -22, s: 0.58 },
    { t: e0 + 0.14,        rx: 50, rz: -30, s: 0.56 },
    { t: e0 + 0.20,        rx: 0,  rz: 0,   s: 0.80 },      // flat: variation
    { t: c0,               rx: 0,  rz: 0,   s: 0.80 },
    { t: c0 + 0.04,        rx: 52, rz: -26, s: 0.56 },
    { t: c0 + 0.10,        rx: 50, rz: -36, s: 0.54 },
    { t: c0 + 0.16,        rx: 0,  rz: 0,   s: 0.80 },      // flat: Bob Code (no camera move in the assistant beat)
    { t: 1,                rx: 0,  rz: 0,   s: 0.80 }
  );
  const remap = keys => keys.forEach(k => k.t *= K);

  const add = (id, ...keys) => P(id).keys.push(...keys.flat());
  SCENE.pieces.forEach(p => p.keys = []);
  const lag = p => p.id === "shell" ? 0.7 : 0;      // the base layer reveals the real design last

  /* --- Concept 1: blueprint -> assemble -> resolve --- */
  const inV1 = SCENE.pieces.filter(p => p.rects.v1);
  const base = inV1.filter(p => p.depth <= 1);
  const top  = inV1.filter(p => p.depth > 1).sort((a, b) => a.depth - b.depth || a.rects.v1.y - b.rects.v1.y || a.rects.v1.x - b.rects.v1.x);
  base.forEach((p, i) => add(p.id, G.enter(p.enter, p, 0, B.blueprint[1], "v1", i, base.length, L)));
  top.forEach((p, i)  => add(p.id, G.enter(p.enter, p, B.assemble[0] + 0.02, B.assemble[1] - 0.02, "v1", i, top.length, L)));
  inV1.forEach(p => add(p.id, G.resolve(p, r0, r0 + 0.07, "v1", L, lag(p))));

  /* --- Variation: cards grow in place, prompt slides down, folder menu falls away, then a tap on the project's + --- */
  inV1.forEach(p => add(p.id, G.explode(p, e0, e0 + 0.04, "v1", L)));
  add("folder", G.exit(P("folder"), e0 + 0.04, e0 + 0.10, L));
  inV1.filter(p => p.rects.v1b).forEach(p => add(p.id,
    G.morph(p, e0 + 0.04, e0 + 0.10, "v1", "v1b", L),
    G.resolve(p, e0 + 0.14, e0 + 0.20, "v1b", L, lag(p))));
  add("tooltip", G.enter("pop", P("tooltip"), e0 + 0.115, e0 + 0.145, "v1b", 0, 1, L), G.resolve(P("tooltip"), e0 + 0.14, e0 + 0.20, "v1b", L));
  const cz = 3 * L;
  add("cursor",
    { t: e0 + 0.05,  o: 0, x: 380, y: 420, z: cz, s: 1, f: 1, rect: "v1b" },
    { t: e0 + 0.065, o: 1 },
    { t: e0 + 0.105, x: 0, y: 0 },                              // glides to the project's +
    { t: e0 + 0.115, s: 0.78 }, { t: e0 + 0.125, s: 1 },        // tap
    { t: e0 + 0.14,  z: cz }, { t: e0 + 0.20, z: 1.2 });

  /* --- Bob Code: chat pieces drop away, toggle rises into a new top bar, the content panel splits into two editors.
         Offsets are scaled by 0.8 so the flat hold fits this beat's length. --- */
  const cu = off => c0 + off * 0.8, a0 = B.assistant[0];
  const toV2 = ["shell", "sidebar", "content", "toggle"].map(P), chat = ["title", "prompt", "card-a", "card-b", "card-c"].map(P);
  [...toV2, ...chat, P("tooltip")].forEach(p => add(p.id, G.explode(p, c0, cu(0.04), "v1b", L)));
  toV2.forEach(p => add(p.id, G.morph(p, cu(0.04), cu(0.12), "v1b", "v2", L), G.resolve(p, cu(0.12), cu(0.20), "v2", L, lag(p))));
  chat.forEach(p => add(p.id, G.exit(p, cu(0.04), cu(0.10), L)));
  add("tooltip", G.exit(P("tooltip"), cu(0.04), cu(0.08), L));
  add("cursor", { t: c0, z: 1.2, o: 1 }, { t: cu(0.04), z: cz }, { t: cu(0.07), o: 0 });
  add("topbar", G.enter("slideT", P("topbar"), cu(0.06), cu(0.12), "v2", 0, 1, L), G.resolve(P("topbar"), cu(0.12), cu(0.20), "v2", L));
  ["filter", "files"].forEach((id, i) => add(id,
    G.enter(P(id).enter, P(id), cu(0.07), cu(0.12), "v2", i, 2, L), G.resolve(P(id), cu(0.12), cu(0.20), "v2", L)));
  // the second editor splits off the content panel: it starts as a copy of it, then parts to the right
  add("editor-2",
    { t: cu(0.03), o: 0, x: 0, y: 0, z: L, rx: 0, rz: 0, s: 1, f: 0, rect: "v1b" }, { t: cu(0.04), o: 1 },
    G.morph(P("editor-2"), cu(0.04), cu(0.12), "v1b", "v2", L), G.resolve(P("editor-2"), cu(0.12), cu(0.20), "v2", L));

  /* --- Assistant (UI morph, NO blueprint): a cursor taps the chat button, the right editor folds into a chat panel
         while the left editor widens, then the panel's content staggers in. Flat camera throughout. --- */
  ["shell", "sidebar", "content", "editor-2"].forEach(id => add(id, G.rest(P(id), a0, "v2")));
  ["toggle", "topbar", "filter", "files"].forEach(id => add(id, G.rest(P(id), 1, "v2")));
  add("shell",    G.flat(P("shell"),    a0 + 0.05, a0 + 0.12, "v2", "v3p"));
  add("sidebar",  G.flat(P("sidebar"),  a0 + 0.07, a0 + 0.12, "v2", "v3p"));        // the settings gear fades in
  add("content",  G.flat(P("content"),  a0 + 0.05, a0 + 0.12, "v2", "v3p"));        // widens to fill the gap
  add("editor-2", G.flat(P("editor-2"), a0 + 0.05, a0 + 0.12, "v2", "v3p"));        // shrinks into the chat panel
  const rise = (id, t0, t1) => add(id,
    { t: t0, o: 0, x: 0, y: 18, z: G.eps(P(id)), rx: 0, rz: 0, s: 1, f: 1, rect: "v3" },
    { t: t1, o: 1, y: 0, e: "inOutQuart" });
  rise("chat-hero", a0 + 0.115, a0 + 0.145);
  ["chat-row-1", "chat-row-2", "chat-row-3"].forEach((id, i) => rise(id, a0 + 0.13 + i * 0.012, a0 + 0.16 + i * 0.012));
  rise("chat-input", a0 + 0.14, a0 + 0.17);
  add("cursor",
    { t: a0, o: 0, x: -260, y: 300, z: 6, s: 1, f: 1, rect: "v2" },
    { t: a0 + 0.012, o: 1 }, { t: a0 + 0.04, x: 0, y: 0, e: "inOutCubic" },
    { t: a0 + 0.05, s: 0.78 }, { t: a0 + 0.06, s: 1 },                              // tap
    { t: a0 + 0.075, o: 1 }, { t: a0 + 0.11, o: 0, x: 40, y: 60 });

  /* --- Switch (UI morph, NO blueprint): a cursor clicks the CHAT side of the mode toggle (top left). The code editors give way
         to the conversation, the file explorer becomes the chat nav, the second editor becomes the Actions panel. Flat throughout.
         Everything above was authored on the original timeline; squeeze it into [0, S0], then append this beat in real progress. --- */
  remap(SCENE.camera); SCENE.pieces.forEach(p => remap(p.keys));
  SCENE.camera.push({ t: 1, rx: 0, rz: 0, s: 0.80 });
  const W = 1 - S0, u = f => S0 + f * W;
  const hold = ["shell", "sidebar", "content", "editor-2", "toggle"];
  hold.forEach(id => add(id, G.rest(P(id), S0, id === "toggle" ? "v2" : "v3p")));
  ["topbar", "filter", "files", "chat-hero", "chat-row-1", "chat-row-2", "chat-row-3", "chat-input"].forEach(id => add(id, { t: u(0.30), o: 1 }, { t: u(0.46), o: 0 }));
  add("shell",    G.flat(P("shell"),    u(0.30), u(0.62), "v3p", "v4b"));
  add("sidebar",  G.flat(P("sidebar"),  u(0.30), u(0.62), "v3p", "v4"));
  add("content",  G.flat(P("content"),  u(0.30), u(0.62), "v3p", "v4"));
  add("editor-2", G.flat(P("editor-2"), u(0.30), u(0.62), "v3p", "v4"));
  add("toggle",   G.flat(P("toggle"),   u(0.30), u(0.62), "v2",  "v4"));      // the toggle slides to its chat-mode position
  add("cursor",
    { t: u(0.01), o: 0, x: 170, y: 260, z: 6, s: 1, f: 1, rect: "v4" },
    { t: u(0.04), o: 1 }, { t: u(0.24), x: 0, y: 0, e: "inOutCubic" },
    { t: u(0.28), s: 0.78 }, { t: u(0.33), s: 1 },                              // click
    { t: u(0.50), o: 1 }, { t: u(0.64), o: 0, x: 30, y: 50 });
})();
