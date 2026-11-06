/* =========================================================================
   STORY: the single source of truth for the timeline (M-GOAT, Act 1: The Problem).
   - range / snap / pose / theme / title drive BOTH halves (scene engine and text column).
       snap = where the beat's text is centred in the viewport.
       pose = the scene state used when prefers-reduced-motion is on (defaults to snap).
              It differs from snap in "goal": the text should be centred mid-collapse, but the still pose is the resolved target.
   - eyebrow (first beat only) + copy[] is the right-hand text. No headings. A beat with copy: [] shows no text (the visual plays).
   - motion is a one-line note on what the left side does in this beat (documentation only).

   COPY STATUS
   - Right-hand copy is taken verbatim from the Figma frames (file 1r4UreOVeEqdcXvnD5cetk):
       problem    <- node 41:29  (trailing space after "through it." trimmed)
       underused  <- node 52:523
       goal       <- node 52:9115
     Where a frame exists, Figma wins over case-study-mgrat.md (decision by the author).
     Note frame 41:29 says "IBM sellers" / "expansion conversation"; the markdown says "Maximo sellers" / "customer conversation".
   - The "meters" beat has no text (author's choice).
   - The white circle on the canvas has no words (author's choice: keep it minimal). It replaced the earlier target ring (author: "I don't really like this ring").

   PACING (even pitch): every text anchor sits PITCH (70) vh after the previous one, and every anchor sits inside a REST where the stage is still,
   showing the pose the sentence describes. All motion windows live in TIMING below (vh of scroll), and scene-data.js / capabilities.js read them from there.
   The earlier "light blueprint" intro on the Maximo-is-huge beat was left out at the author's request: it needed ~35vh of motion plus a hold, which does not fit a 70vh pitch.

   CAPABILITIES (illustration -> diagram) sits after the Goal beat. COPY STATUS: PLACEHOLDER, per the author's brief:
     "Maximo is huge." / "...we need to build on a lot of huge capabilities of Maximo, defining 76 milestones across 5 stages."
     The "76" and "5 stages" are the author's numbers, not verified here. The diagram's own "and 76 more..." label comes from Figma 90:12148.

   ACT 2.3 (v1 -> v2 -> v3) follows the capabilities diagram, which fades straight into the live v1 (no stack). COPY STATUS for Act 2.3: DRAFT.
     v1 line = the author's case-study line for 2.2 ("The first version went to Maximo World for real feedback.").
     v2 / v3 lines are condensed from the author's wording (30+ stakeholders, 7 feedback rounds). Sticky-note text is in scene-data.js.
     v1 is live HTML rebuilt from Figma 102:2757; its form scrolls itself (STORY.auto), and a user scroll during it skips to the end. v1 -> v2 is a UI morph; v2 -> v3 is a blueprint (author's choice).

   DATA STATUS: ILLUSTRATIVE. The author said "let's say AppPoints 2500, Entitlement Manage + Health, Usage 35%".
   Replace with real values before publishing. AppPoints and Entitlement have no total, so only Usage draws a bar.
   ========================================================================= */
(function () {
  // Even rhythm: an anchor every 70vh. Each anchor sits in a short REST (stage still, the pose the sentence describes), sized to the copy (~20vh + 0.6vh per word),
  // and everything else is MOTION, so the stage is moving about half the scroll instead of a third.
  //   anchors  problem 0 | underused 70 | goal 140 | capintro 210 | stats 280 | capabilities 350 | structure 420 | v1 490 | v2 560 | v3 630
  // The capabilities morph does not stop under "stats": it slows to a creep (see capabilities.js), so the text is read over a barely moving stage.
  window.TIMING = {
    PITCH: 70, MAX: 650,                             // MAX = scrollable distance (scrollVh - 100); the story ends 20vh after the last anchor
    // ---- Act 1
    skeleton: [18, 46],                              // glides up-left, in step with the dashboard
    dashboard: [18, 50],                             // slides up over it; rests under "underused" (50-88)
    tiles: [88, 122],                                // AppPoints, Entitlement, Usage fade in, staggered
    unusedIn: [116, 124],                            // the unused 65% fades in on the bar
    pulse1: [124, 132], pulse2: [148, 156],          // two glow pulses either side of the "goal" anchor (140), which sits on the still bar
    fly: [158, 190],                                 // the unused bar swells into the white circle
    others: [158, 176],                              // skeleton, dashboard and tiles fade while it does
    circleOut: [184, 196],                           // the circle dissolves while the illustration fades in (overlaps the swell's landing); rests under "Maximo is huge" (196-225)
    // ---- capabilities morph: runs m0..m1 with a slow creep h0..h1 under "stats", then rests on the finished diagram (m1-368).
    // pA..pB = how far through the morph the creep goes (0.30 -> 0.36: small details gone, the big shapes just starting to move).
    morph: { m0: 214, h0: 256, h1: 304, m1: 334, pA: 0.30, pB: 0.38 },
    // ---- bridge (diagram -> live v1). Flat, no stack: the diagram's text fades (cue), the plain cards rest under "structure" (398-434),
    // then the diagram fades out while the live v1 lands (header slides down, form rises). v1 is real HTML (v1-ui.js), built from Figma 102:2757.
    bridge: { cue: [380, 398], diagramOut: [434, 454], landChrome: [438, 454], landForm: [440, 456] },
    notes: { start: 466, step: 2, len: 6, fadeOut: [503, 509] },     // fade in on the landed v1, stay pinned over the auto-scrolling form, fade out as the morph begins
    // ---- Act 2.3. v1 rests 456-509 (the form auto-scrolls from AUTO_AT, see STORY.auto) | v2 rests 544-575 | v3 rests 618-650. v3 gets 43vh of motion (tilt+explode 14, travel 13, resolve+flatten 16).
    AUTO_AT: 456, HOLD_AT: 490,                                  // the form starts scrolling itself the moment v1 has landed (456); the held page then glides on to HOLD_AT (the v1 text anchor) so the notes fade in and the text centres while it scrolls
    v2: { morph: [509, 544], peek0: 527, peekStep: 4, peekLen: 10 },
    v3: { D: [575, 589, 602, 618], illStart: 581 }   // explode+tilt, travel, resolve start, resolve end
  };
})();

const f = vh => +(vh / TIMING.MAX).toFixed(5);       // TIMING vh -> beat progress
window.STORY = {
  id: "m-goat-acts-1-2",
  title: "M-GOAT / M-GRAT: Act 1 The Problem, bridge, Act 2.3 Feedback shapes the versions",
  introVh: 120,              // extra scroll (in viewport heights) for the hero -> stage transition, before the beats start (see hero-transition.js). 0 = no transition.
  scrollVh: 750,              // 650vh of actual scrolling. Text anchors every 70vh (0..630). Beat ranges and snaps below are TIMING vh divided by TIMING.MAX.
  // v1's form scrolls itself once the scroll position reaches `at` (the page is held there). A fresh wheel / key / touch during it skips to the end, then scrolling continues into v2.
  //   graceMs   input is swallowed this long after it starts, so trackpad momentum that carried the reader here does not skip it at once.
  //   resetVh   scrolling back above `at` by this much re-arms it (so it replays when the reader comes back down).
  auto: { at: f(TIMING.AUTO_AT), holdAt: f(TIMING.HOLD_AT), rampMs: 2600, durationMs: 8000, skipMs: 300, graceMs: 700, resetVh: 6 },
  smoothing: 140,             // ms. The scene eases toward the scroll position (time constant) so the shorter scroll doesn't feel abrupt. 0 = 1:1 with scroll.
  mode: "continuous",         // "continuous" scrubs seamlessly with scroll; "snap" adds soft snapping to beat.snap anchors
  data: {
    status: "ILLUSTRATIVE - not confirmed as real customer values",
    appPoints: "2500",
    entitlement: ["Manage", "Health"],
    usagePct: 35
  },
  beats: [
    {
      id: "problem", range: [0, f(35)], snap: 0, pose: 0, theme: "light", title: "The problem",
      eyebrow: "THE PROBLEM",
      copy: [
        "IBM sellers had a huge knowledge base and no clear path through it.",
        "Preparing one expansion conversation with customers took days."
      ],
      motion: "A tilted skeleton of the ALM homepage (the knowledge base's starting state) holds on the stage."
    },
    {
      id: "underused", range: [f(35), f(88)], snap: f(70), pose: f(70), to: f(105), theme: "light", title: "Underused",
      copy: [
        "On the other side, Maximo customers were underusing what they'd already paid for.",
        "Since it’s 40+ years old and very complex."
      ],
      motion: "UI morph (18-52vh): the skeleton glides up and left and fades while the Operational dashboard slides up over it. The dashboard rests under the text."
    },
    {
      id: "meters", range: [f(88), f(124)], snap: f(124), pose: f(124),
      theme: "light", title: "Meters",
      copy: [],
      motion: "Three separate Carbon tiles fade in around the dashboard (88-114vh): AppPoints top left, Entitlement right middle, Usage lower middle. No text; the visual plays."
    },
    {
      id: "goal", range: [f(124), f(175)], snap: f(140), pose: f(140), from: f(105), theme: "light", title: "The goal",
      copy: [
        "The goal is:",
        "Help customers use more of Maximo, so their investment feels worth it, and upsell it."
      ],
      motion: "The unused 65% of the Usage bar fades in and glows (two pulses, 124-154vh) while the goal is read, then swells into a white circle (158-182vh, Figma 97:253) while everything else fades."
    },
    {
      id: "capintro", range: [f(175), f(245)], snap: f(210), pose: f(210), theme: "light", title: "Maximo is huge",
      copy: [
        "Maximo is huge.",
        "It covers 13 core top-level modules, plus numerous sub-modules. 7,200+ companies are using them."
      ],
      motion: "The white circle dissolves while the capabilities illustration fades in (182-194vh, Figma 90:12696). The finished illustration rests under the text."
    },
    {
      id: "capabilities", range: [f(245), f(455)], snap: f(350), pose: f(350), theme: "light", title: "Capabilities",
      // `texts` = several sentences inside ONE beat. Each text is centred at its own `snap`; it is on screen from the midpoint after the previous text
      // to the midpoint before the next (the first starts at the beat start, the last ends at the beat end). `copy` is then ignored for this beat.
      copy: [],
      texts: [
        { id: "stats", snap: f(280), copy: [
          "90% of them use basic features in Maximo Manage, which is 10% of Maximo.",
          "So we need a way to make them get the most value out of their investment."
        ] },
        { id: "capabilities", snap: f(350), copy: [
          "To help customers use all of it, we built on its many capabilities, defining 76 milestones across 5 stages."
        ] },
        { id: "capabilities-structure", snap: f(420), copy: [      // PLACEHOLDER (made up by Claude, author will refine): sits on the plain cards left after the diagram's text fades
          "Grouped into one clear structure sellers can follow, from first conversation to full adoption."
        ] }
      ],
      motion: "Morph: the illustration simplifies (236-261vh) and holds on 'stats'; its network then opens into the diagram's loop, its blue and lilac shapes flatten into two card columns, text fades in, then the 'and 76 more' box appears (299-332vh); the finished diagram rests under 'capabilities'. Then the diagram's text fades (380-398vh), leaving the 14 plain cards under 'structure'."
    },
    {
      id: "v1", range: [f(455), f(525)], snap: f(490), pose: f(490), theme: "light", title: "Version 1",
      copy: [
        "The first version went to Maximo World for real feedback."
      ],
      motion: "The diagram fades out as the live v1 lands (434-456vh): header slides down, form rises. Three feedback notes fade on (466-478vh). Then the form scrolls itself through the questions (8s, page held at 490vh, on the text anchor; a fresh scroll skips to the end). The notes fade as the morph begins (503-509vh)."
    },
    {
      id: "v2", range: [f(525), f(595)], snap: f(560), pose: f(560), theme: "light", title: "Version 2",
      copy: [
        "Validated by 30+ stakeholders across 7 feedback rounds, from IBM sellers to the Maximo Advisory Council."
      ],
      motion: "UI morph (509-544vh): the blue header stretches into the dark sidebar, the form opens into the maturity table. Feedback layers 1 to 3 slide out beneath (527-544vh) and rest under the text."
    },
    {
      id: "v3", range: [f(595), 1], snap: f(630), pose: f(630), theme: "light", title: "Version 3",
      copy: [
        "The concept held up. The feedback shaped the content, folding the maturity model into the assessment itself."
      ],
      motion: "Blueprint (575-618vh): v2 lifts into isometric slabs, layers 4 to 7 stack beneath, the table collapses into a checklist, the illustration arrives, then it resolves flat into v3, which rests under the text."
    }
  ]
};
