/* =========================================================================
   STORY: the single source of truth for the timeline (M-GOAT case study, v2 revised page).
   Source: Figma file 1r4UreOVeEqdcXvnD5cetk, section 241:9902, frame 208:5718 ("Case study / full page (v2 revised)"). Each slide is 1440 x 1024:
   left half = stage, right half = copy. Where a Figma frame exists, its wording wins (decision by the author).

   - range / snap / pose / theme / title drive BOTH halves (scene engine and text column).
       snap = where the beat's text is centred in the viewport.   pose = scene state used with prefers-reduced-motion (defaults to snap).
   - chapter = which of the 12 progress ticks is active (Figma SectionNav: several slides share a tick).
   - eyebrow + copy[] is the right-hand text. copy[] strings may carry inline markup: <span class="hl-o"> (orange), <i> (italic).

   BUILD STATUS (staged build; each stage is checked in a browser before the next):
     Stage A  beats 1-7   leaf ring -> dashboard -> tiles -> city art -> ALM skeleton -> hand card -> capabilities diagram     <- this file
     Stage B  beats 8-10  7-layer stack (blueprint) -> journey simulator -> first iteration (blueprint)
     Stage C  beat 11     second iteration: full-screen generation, slide left (light -> dark), scroll the form, zoom on question 1     <- stage-c.js
     Stage D  beats 12-15 report -> trust + disclosure -> APM expansion card (hover loop) -> numbers zoom     <- stage-d.js
     Stage E  beats 16-17 next steps card -> zoom on "How to implement" (slides 20a, 20b)     <- stage-e.js   (slides 21 maturity maps, 22 to be continued: not built yet)

   PACING (see the worksheet shown at Gate 3): every text anchor sits in a REST (stage still), sized 20vh + 0.6vh per word (cap 60). All motion windows live in
   TIMING below (vh of scroll); scene-data.js reads them from there.
     anchors  numbers 0 | curve 75 | ninety 145 | opportunity 220 | problem 295 | goal 370 | capabilities 450
   ========================================================================= */
(function () {
  window.TIMING = {
    MAX: 1620,                                       // MAX = scrollable distance (scrollVh - 100). Stage A ends at 472, Stage B (TIMING.B) runs 472-778, Stage C (TIMING.C) 778-1106, Stage D (TIMING.D) 1106-1480, Stage E (TIMING.E) 1480-1620.
    // beat 1: the ring DRAWS IN during the hero dissolve (INTRO time: 0..1 across the hero's introVh scroll, rendered by the under-stage in index.html), so it is complete
    // when the layout takes over at t = 0 and the first sentence is read over a finished, still graphic.
    ring: { drawIntro: [0.62, 0.92], dim: [21, 50] },      // dim = the whole graphic eases to 50% (layout time, vh) as the dashboard arrives on top
    dash:  [21, 55],                                 // dashboard slides up over the ring            -> rest 55-95  (curve, anchor 75)
    tiles: [95, 130],                                // AppPoints, Entitlement, Usage fade in         -> rest 130-160 (ninety, anchor 145)
    // ONE hero per beat: the dashboard + tiles leave together (160-182, lockstep) while the ring MORPHS into the city's shapes (leaves grow into the city leaves, the 13 dots travel
    // to the 6 city nodes, the white circle fades) over 164-196. The city piece then takes over at the same positions (196-199). Rest 199-243 (opportunity, anchor 220).
    toCity: { dash: [160, 182], tiles: [160, 178], ring: [164, 196], city: [164, 196], handoff: 196 },       // city art grows in left to right across the ring morph; at `handoff` its own leaves + nodes replace the ring's identical ones (see capabilities.js i0/i1/th)
    toAlm: { city: [246, 270], alm: [252, 279] },    // city art out, ALM skeleton in                 -> rest 279-311 (problem, anchor 295)
    // wireframe -> hand card (311-345vh). One hero: the wireframe's six grey blocks TRAVEL and become the six pills (stagger 12% of the window), while the window shrinks into the card's
    // frame and the card's lines / rings / hand fade up beneath. The pill loop (Figma, 4s, free-running clock) starts when the morph lands; the text anchor (370) is inside the loop's rest.
    toHand: [311, 345],
    toDiagram: [402, 429],                           // hand card -> capabilities diagram. PLACEHOLDER cross-fade: the card-by-card morph you chose is a later step (needs new seed geometry). Rest 429-472 (capabilities, anchor 450)
    capPrime: [345, 347],                            // the capabilities piece runs its own p 0 -> 1 here, while it is invisible (under the hand card), so it is already the finished diagram when it fades in

    /* ---- STAGE B (stage-b.js). Anchors: milestones 553 | simulator 633 | first 738 (gaps from the previous anchor 450: 103, 80, 105).
       Beat 8 milestones   Cue 472-482 (diagram text/connectors fade) | Hero 482-522 (tilt + the 7 lilac cards stack, blue cards fall away) | Land: card drops 508-534, labels 527-541 | Rest 541-596 (anchor 553, 26 words -> needs 36)
       Beat 9 simulator    Hero 596-617 (the layers light up one by one) | Rest 617-654 (anchor 633, 26 words -> needs 36; the video slot sits in the text column); labels leave 646-654
       Beat 10 first       Hero 654-694 (camera flattens, the card grows into the v1, the layers fold under it) | Land: live v1 crossfade 694-702, notes 700-712 | Rest 712-778 (anchor 738, ~65 words -> needs 59)
       Text swaps happen at the midpoint between anchors, where the outgoing text has just left the viewport (103vh gap) or is at its edge. */
    B: {
      cue: [472, 482],                               // the diagram's text, bars, connectors and red node fade, leaving 14 plain cards
      tilt: [482, 522],                              // camera flat -> isometric (40vh: 3 rotations' worth of travel on a 60 degree tilt). The lilac cards travel into the stack inside this window.
      leftStart: 484, leftStep: 3, leftLen: 20,      // the 7 blue module cards sink and fade (staggered 3vh, 20vh each: last one ends 522)
      layerStart: 484, layerStep: 3, layerLen: 20,   // the 7 lilac cards fly to their layer, bottom layer first (last one lands 522, in step with the tilt)
      wire: [496, 522],                              // pastel card colours -> grey wireframe
      card: [508, 536],                              // the v1 card drops onto the stack (28vh: 150 z-units at outBack's 4.4x peak needs >= 21vh to stay under 6x; the overshoot lands in the last third)
      labels: [527, 541], labelStep: 1.2, labelLen: 6, labelsOff: [646, 654],                 // leader labels draw in top to bottom (done 540); they leave just before the flatten
      scan: [596, 617], scanStep: 2.2, scanLen: 7.6, // the layers light up in turn (top to bottom) under "validate these by hand": 596-617, then rest. Starts at the text swap (596).
      flatten: [654, 694],                           // camera isometric -> flat; the stack folds and the card grows into the v1 (lockstep, 40vh: the card travels ~480 screen px at inOutCubic peak 3x, so it needs >= 40vh to stay under 6x)
      live: [694, 702],                              // the live v1 (HTML) crossfades over the wireframe card AFTER it has landed at the v1's rect
      notes: [700, 712], noteStep: 3, noteLen: 8     // the three feedback notes, a pure fade (a drift this short reads as a glitch), staggered 3vh (done 712)
    },


    /* ---- STAGE C (stage-c.js + stagec-piece.js; beats 11a-11c = Figma slides 13, 14, 15). Local source: stagec-data.js (the same windows, minus 778). Anchors: second 872 | simplify 945 | goals 1050 (gaps 134 from B's 738, then 73, 105).
       C1 is FULL SCREEN: a fixed overlay (stage-c.js) pinned to the main scene's world position, so its left half IS the stage once it lands.
       C1  cover 768-778 (a light cover over the end of B's rest) | draw 781-808 | reveal 802-819 | bg dark 819-827 | camera slide + scale into the left half 827-852 | Rest 852-893 (anchor 872, 30 words -> needs 38)
       C2  scroll the questionnaire 893-926 | Rest 926-964 (anchor 945, 24 words -> needs 34)
       C3  zoom on question 1 964-994 | cursor ticks 3 options 994-1022 | Rest 1022-1078 (anchor 1050, 56 words -> needs 54) | out: zoom back to the rest pose 1078-1106 (Stage D's report morphs from the LAST frame) */
    C: {
      cover: [768, 778], draw: [781, 808], reveal: [802, 819], bg: [819, 827], camera: [827, 852],
      scroll: [893, 926], zoom: [964, 994], ticks: [994, 1022], out: [1078, 1106],
      end: 1106                                        // last vh of Stage C: the overlay is shown up to and including this, then hands the stage to whatever follows
    },

    /* ---- STAGE D (stage-d.js + report-piece.js, trust-piece.js, expansion-piece.js; beats 12-15 = Figma slides 16, 17, 18, 19). Anchors: report 1155 | trust 1262 | expansion 1372 | numbers 1458.
       Gaps 105 (from C's 1050), 107, 110, 86. The first gap is long because C's own exit (1078-1106) and the report's entrance (36vh) sit between the two texts.
       12 report     entrance 1106-1142 | Rest 1142-1184 (anchor 1155, 32 words -> 39)
       13 trust      cue 1184-1192 | cards pull apart 1192-1238 | Rest 1238-1286 (anchor 1262, 46 words -> 48) | tab cycle 1286-1336 (cursor; its leaving overlaps the next beat)
       14 expansion  cards converge 1324-1352 | Rest 1352-1392 (anchor 1372, 29 words -> 37); the hover loop runs on a free clock
       15 numbers    zoom 1.6x onto Potential outcomes 1392-1437 | Rest 1437-1480 (anchor 1458, 35 words -> 41). End pose = Stage E's start. */
    D: {
      cLast: [1090, 1100],                             // the frozen Stage C last frame + the report shell fade in UNDER Stage C's overlay (opaque until 1106.05)
      fade: [1106, 1114],                              // the frozen last frame fades out as the report grows
      report: [1106, 1142],
      trust: [1180, 1336],                             // trust-piece.js window = its TOTAL_VH (156): see trust-piece.js TM
      exp: [1324, 1352],
      zoom: [1392, 1437],
      end: 1480
    },

    /* ---- STAGE E (stage-e.js + stagee-piece.js; beats 16-17 = Figma slides 20a, 20b). Local windows live in stagee-data.js (STAGEE.TIMING, local vh); start = the first vh after Stage D's final rest.
       Anchors: e1 1533 | e2 1600 (gaps 75 from D's 1458, then 67).
       16 next steps  arrive 1480-1514 (D's card leaves up, E's card rises: one pan) | Rest 1514-1552 (anchor 1533, 23 words)
       17 implement   zoom 1.4x onto "How to implement" 1552-1580, highlight 1562-1576 | Rest 1580-1620 (anchor 1600, 26 words) */
    E: { start: 1480 }
  };
})();

const f = vh => +(vh / TIMING.MAX).toFixed(5);       // TIMING vh -> beat progress
window.STORY = {
  id: "m-goat-v2",
  title: "M-GOAT: Maximo Growth Opportunities Assessment Tool",
  introVh: 180,              // extra scroll (vh) for the hero -> stage transition, before the beats start (hero-transition.js). 0 = none.
  scrollVh: 1720,            // MAX + 100
  chapters: 12,              // number of progress ticks (Figma SectionNav)
  smoothing: 140,            // ms. The scene eases toward the scroll position (time constant). 0 = 1:1 with scroll.
  mode: "continuous",
  beats: [
    {
      id: "numbers", hold: true, chapter: 0, range: [0, f(37.5)], snap: 0, pose: 0, theme: "light", title: "Maximo",
      copy: [
        "IBM Maximo is a 40+ years old asset lifecycle management software suite.",
        "It’s being used by <span class=\"hl-o\">7,200 companies</span> worldwide to manage assets, manufacturing, maintenance, and running the world."
      ],
      motion: "The Figma leaf-in-a-ring graphic holds on the stage (Figma 208:5854)."
    },
    {
      id: "curve", hold: true, chapter: 1, range: [f(37.5), f(110)], snap: f(75), pose: f(75), theme: "light", title: "Learning curve",
      copy: [
        "Being 40+ years old means Maximo has a really steep learning curve.",
        "And it’s not going to change anytime soon, considering how many clients respected and were used to the way it is."
      ],
      motion: "The Operational dashboard slides up over the ring (21-55vh). The ring's dots stay visible around it, as in Figma 208:5897."
    },
    {
      id: "ninety", hold: true, chapter: 1, range: [f(110), f(182.5)], snap: f(145), pose: f(145), theme: "light", title: "90% / 10%",
      copy: [
        "Our research and intelligence has shown that:",
        "90% of clients use only <span class=\"hl-o\">10% of it</span>."
      ],
      motion: "Three tiles (AppPoints, Entitlement, Usage) fade in around the dashboard (95-130vh), staggered. Tiles are Figma exports (rotation and shadow baked in)."
    },
    {
      id: "opportunity", hold: true, chapter: 2, range: [f(182.5), f(257.5)], snap: f(220), pose: f(220), theme: "light", title: "The opportunity",
      copy: [
        "The opportunity is you can utilize at least 10-15% more of Maximo, to get <span class=\"hl-o\">40% more ROI benefit</span>.",
        "But…that sounds like a huge step for big clients with complex operations."
      ],
      motion: "UI morph (160-199vh): the dashboard, tiles and ring fade out together (160-182), then the city illustration (Figma 208:6199) rises in (180-199)."
    },
    {
      id: "problem", hold: true, chapter: 2, range: [f(257.5), f(332.5)], snap: f(295), pose: f(295), theme: "light", title: "The problem",
      eyebrow: "THE PROBLEM",
      copy: [
        "And also, sellers had a huge knowledge base, with no focus on expansion and maximizing utilization for existing clients."
      ],
      motion: "UI morph (246-279vh): the city art fades out as the tilted ALM homepage skeleton (Figma 208:6309) eases in."
    },
    {
      id: "goal", hold: true, chapter: 3, range: [f(332.5), f(410)], snap: f(370), pose: f(370), theme: "light", title: "The goal",
      copy: [
        "That is the business problem we’re trying to solve, with the Maximo Growth Opportunities Assessment tool.",
        "The purpose we had in mind was to help clients know where they are with their Maximo operations, and IBM client teams drive better utilization & expansion, to help them reach their goals and ROI faster."
      ],
      motion: "UI morph (311-343vh): the skeleton grows into the hand-and-flow card (Figma 235:7773) and straightens."
    },
    {
      id: "capabilities", hold: true, chapter: 4, range: [f(410), f(501.5)], snap: f(450), pose: f(450), theme: "light", title: "Capabilities",
      copy: [
        "We broke down complexity into a big picture with manageable steps:",
        "Maximo has 13 core applications (modules)",
        "And many pathways tailored to each industry (manufacturing, transportation, oil & gas, nuclear, etc…)"
      ],
      motion: "The hand card hands over to the capabilities diagram (Figma 208:6706): 7 modules on the left, 7 industry cards on the right, 'and 76 more…'. Cross-fade for now; the card-by-card morph is a later step."
    },

    /* ---------------- STAGE B. Copy is the author's Figma wording (slides 10, 11, 12 of frame 208:5718). Stage: stage-b.js, windows: TIMING.B. ---------------- */
    {
      id: "milestones", hold: true, chapter: 5, range: [f(501.5), f(596)], snap: f(553), pose: f(553), theme: "light", title: "76 milestones",
      copy: [
        "We identified 76 milestones to reach full value with Maximo.",
        "Each milestone has 5-10 core actions, involving roles like supervisors, technicians, admins, and so on."
      ],
      motion: "Blueprint (472-541vh): the diagram's text and connectors fade; the camera tilts back into an isometric view as the seven industry cards stack into seven wireframe layers (the seven blue module cards fall away), the assessment card drops on top, and each layer gets a leader label (Figma 219:6843)."
    },
    {
      id: "simulator", hold: true, chapter: 5, range: [f(596), f(686)], snap: f(633), pose: f(633), theme: "light", title: "Journey simulator",
      // The simulator is a VIDEO fill in Figma (219:6877), which the Figma tools cannot export; the poster still stands in. To use the real video: replace the <img> with
      //   <video class="sb-vid" src="assets/stageb/simulator.mp4" poster="assets/stageb/simulator@3x.png" muted loop playsinline autoplay></video>
      copy: [
        "This was the hard and painful part.",
        "We even had to build a journey simulator to validate these by hand." +
          "<span class=\"sb-sim\"><img class=\"sb-vid\" src=\"assets/stageb/simulator@3x.png\" alt=\"The journey simulator: a dark interface with a milestone map and a report panel showing the stage a client is in.\" width=\"536\" height=\"302\"></span>" +
          "<span class=\"sb-cap\">Thanks for Tanushri for the support!</span>"
      ],
      motion: "The seven layers light up one at a time, top to bottom, as the validation is read (596-617vh). The stack then holds."
    },
    {
      id: "first", hold: true, chapter: 6, range: [f(686), f(778)], snap: f(738), pose: f(738), theme: "light", title: "The first iteration",
      eyebrow: "THE FIRST ITERATION",
      copy: [
        "And we mapped them into initially 40 questions, and we launched the first demo in MaximoWorld in Nashville, TN to get the first round of usage and feedback.",
        "I thought, <i>“this will need to be simpler”</i>.",
        "<span class=\"sb-quote\">“We’d really want to see what’s the next step after this. Reading through all of these seem novel, but I’m not sure what to do yet...”</span><span class=\"sb-cite\">— MaximoWorld participant, 2026</span>"
      ],
      motion: "Blueprint (654-698vh): the camera flattens as the assessment card grows into the real first version (Figma 208:7016) and the layers fold away beneath it; three feedback notes pin on (696-708vh)."
    },
    /* ---------------- STAGE C. Copy is the author's Figma wording (slides 13, 14, 15 of frame 208:5718). Stage: stage-c.js + stagec-piece.js, windows: TIMING.C. ---------------- */
    {
      id: "second", hold: true, chapter: 7, range: [f(778), f(1106)], snap: f(872), pose: f(872), theme: "dark", title: "The second iteration",
      // one beat, three text slots (index.html `texts`): the stage never stops between them, the copy changes at the midpoints (908 and 998)
      texts: [
        { id: "second-1", snap: f(872), chapter: 7, from: f(852), eyebrow: "THE SECOND ITERATION",      // from = the frame has landed (TIMING.C.camera ends 852): the copy never sits under the sliding frame
          copy: ["After that, we refined the assessment and the recommendation engine for the clients.",
                 "This version was shown and demoed at the <span class=\"hl-g\">Maximo Advisory Council in Lowell, MA</span>"] },
        { id: "second-2", snap: f(945), chapter: 8,
          copy: ["As a lot of customers don\u2019t know about the listed concepts.",
                 "Then, the revised assessment was cut down from 40 to 10 core questions."] },
        // the first paragraph is the overhanging layer 208:8300 on Figma slide 15 (author: put it at the very top of C3, it reduces the dead space)
        { id: "second-3", snap: f(1050), chapter: 8,
          copy: ["I and my colleagues went back to Figma to define the visuals, then the question flow, before building it again with IBM Bob (our AI coding agent).",
                 "The customer now would focus first on their business goals, and their challenges, before being asked how they are using Maximo and their operational details, to reduce cognitive load."] }
      ],
      copy: [],
      motion: "C1 (778-852vh): a full-screen generation (dotted wireframe, then the polished dark UI behind a scan line) on a light backdrop; then the backdrop turns dark and the frame slides and scales into the left half. C2 (893-926): the questionnaire scrolls inside its clipped frame. C3 (964-1022): the camera zooms on question 1 and a cursor ticks three options; 1078-1106 zooms back to the rest pose (Stage D morphs from it)."
    },

    /* ---------------- STAGE D. Copy is the author's Figma wording (slides 16, 17, 18, 19 of frame 208:5718). Stage: stage-d.js, windows: TIMING.D. ---------------- */
    {
      id: "report", hold: true, chapter: 9, range: [f(1106), f(1208.5)], snap: f(1155), pose: f(1155), theme: "dark", title: "The report",
      eyebrow: "THE REPORT",
      copy: [
        "After that, they get the next steps report.",
        "This was built with 3 acts so that an executive can scan it within 20 seconds, and their teams to know what to act on."
      ],
      motion: "UI morph (1106-1142vh): the dark window grows into the roadmap report; the illustration strip draws in, the capability bars fill (Figma 208:8302)."
    },
    {
      id: "trust", hold: true, chapter: 9, range: [f(1208.5), f(1317)], snap: f(1262), pose: f(1262), theme: "dark", title: "Trust first",
      // Figma lists the 'trust first' paragraph (208:9365, y 214) above the 'progressive disclosure' one (208:9362, y 547): same order here
      copy: [
        "I aligned this to build trust first (acknowledging what the client has already achieved) before introducing gaps and recommendations.",
        "The structure was also built with progressive disclosure in mind, to hide complexity until it is needed, and clear actions will be surfaced once they read it."
      ],
      motion: "Light blueprint (1184-1238vh): the report pulls apart into the maturity score card, the capability bars and the navigation + tab panel (Figma 208:9293); the tabs then switch under a cursor (1286-1336vh)."
    },
    {
      id: "expansion", hold: true, chapter: 10, range: [f(1317), f(1415)], snap: f(1372), pose: f(1372), theme: "dark", title: "Value of expansion",
      copy: [
        "After that, we needed to show the value of expansion.",
        "For example, the Asset Performance Management journey has 5 stages. Each stages define the maturity level of the customer."
      ],
      motion: "Flat morph (1324-1352vh): the three cards converge into the APM expansion card (Figma 231:6367); stage 01 then stage 02 open under a cursor, looping on a free clock while the card is on stage."
    },
    {
      id: "numbers-zoom", hold: true, chapter: 10, range: [f(1415), f(1480)], snap: f(1458), pose: f(1458), theme: "dark", title: "Value in numbers",
      copy: [
        "For each maturity stage, I made sure that every action displays clear financial impact, benefits and ROI metrics (based on IBM Institute for Business Value) so the reader has instant proof to secure leadership buy-in."
      ],
      motion: "Flat zoom (1392-1437vh): the card scales 1.6x onto the Potential outcomes numbers (Figma 231:6650). The right edge clipping is the author's known Figma quirk."
    },

    /* ---------------- STAGE E. Copy is the author's Figma wording (slides 20a, 20b of frame 208:5718). Stage: stage-e.js, windows: STAGEE.TIMING shifted by TIMING.E.start. ---------------- */
    {
      id: "next-steps", hold: true, chapter: 10, range: [f(1480), 1], snap: f(1533), pose: f(1533), theme: "dark", title: "Next steps",
      // one beat, two text slots (index.html `texts`): the stage never stops between them. The sentence changes as each hero starts (1480, 1552), see stagee-data.js "text swaps".
      texts: [
        { id: "e1", snap: f(1533), from: f(1480), to: f(1552), chapter: 10,
          copy: ["In the next action steps, the system highlights a single top priority alongside two secondary steps so you always know where to start."] },
        { id: "e2", snap: f(1600), from: f(1552), to: 1, chapter: 10,
          copy: ["Each step explicitly tags responsible roles, like Asset Manager or Sys Admin, making it clear as to how to set up Maximo tasks with your team."] }
      ],
      copy: [],
      motion: "Conveyor pan (1480-1514vh): the APM expansion card leaves upward as the Next steps card rises into place. Zoom (1552-1580vh): the card scales 1.4x onto How to implement, the other blocks dim to 25% and a blue frame appears (Figma 239:6833, 239:6889)."
    }
  ]
};
