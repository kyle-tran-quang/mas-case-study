# Choreography Directions

A **direction** is a coherent personality for one iteration's motion: how it assembles, how the camera behaves, which living elements appear, and how it eases. Propose 2-3 directions per iteration, then let the user pick, mix, or reject. Different iterations may use different directions, but the whole piece must still feel like one film (see "Keeping it one film").

Never apply a direction without approval. Always show it as: name, one-line feel, what the viewer sees at each beat, and which story it suits.

## The balance rubric: technical vs. aesthetic

Every beat has to earn its place on all four axes. Score each beat before proposing it.

| Axis | Question | Failing looks like |
|---|---|---|
| **Technical** | Is it derived from the real design (positions, hierarchy, sizes, ids)? Does a measurement, label or annotation say something true? | Pretty motion that could be about any UI |
| **Aesthetic** | Does it have rhythm, a clear focal point, restraint, and a satisfying landing? | Accurate but flat, everything moving at once |
| **Story** | Does it explain *why* this iteration exists? | Motion with no matching sentence in the text column |
| **Experience** | Can the viewer follow it, read the sentence at a still moment, and never wait or chase? (Settle, Cue, Hero, Land, Rest: see `pacing.md`.) | Anchor mid-motion, two things moving at once, dead scroll, a move that outruns the finger |

Rules of thumb:
- Each beat has **one hero motion** (what the eye follows) and at most **two supporting motions**. Everything else is still.
- Living elements are seasoning: **at most 3 visible at once**, each on screen for a purpose, and none covering the piece it talks about.
- Technical truth gets shown, not just implied: live dimensions on rulers, real component names on tags, real numbers on chips. Aesthetic polish lives in the easing, spacing and timing.
- If a beat is beautiful but explains nothing, cut or shorten it. If it is accurate but dull, change the verb (drop -> unfold, slide -> arc), not the amount of motion.

## Directions

### 1. Blueprint Studio (default, safest)
- **Feel:** calm drafting table. Precise, quiet, confident.
- **Camera:** slow isometric orbit (yaw 35-50 degrees), settles flat on resolve.
- **Assembly:** shell rises, nav slides from the side, sections drop in depth order with a tiny settle.
- **Living layer:** drafting grid, tag labels, live rulers and a selection box during the iterate beat. One metric chip at the end.
- **Easing:** inOutQuart for travel, outBack on drops (overshoot 1.2-1.4).
- **Best for:** clean B2B tools, dashboards, systems work.

### 2. Workshop (collaboration-forward)
- **Feel:** a room full of people. Live, a bit messy, warm.
- **Camera:** shallow orbit with push-ins toward each moment of feedback.
- **Assembly:** pieces are placed by named cursors (teammates), some contested: two cursors reach for the same card.
- **Living layer:** multiple named cursors, comment pins that open into bubbles, sticky notes, avatars at the edge of a component, an "Approved" stamp at the end.
- **Easing:** slightly springy (outBack), cursors on smooth arcs not straight lines.
- **Best for:** projects where stakeholder feedback and cross-functional input shaped the result.

### 3. Teardown (technical showpiece)
- **Feel:** an engineering exploded-view diagram.
- **Camera:** locked isometric with a crisp turn to a side profile that shows layer thickness.
- **Assembly:** explode along z by depth, with dashed leader lines connecting each part to its home slot; parts snap back with a short settle.
- **Living layer:** callouts with measured spacing, rulers on every key gap, part numbers in tags, a dimension chip on what changed.
- **Easing:** inOutCubic, almost no overshoot. Precision over playfulness.
- **Best for:** design systems, data-dense UI, anything where the *structure* is the story.

### 4. Paper Model (tactile)
- **Feel:** a folded paper prototype.
- **Camera:** gentle low-angle tilt; no spinning.
- **Assembly:** components **unfold** from hinges on the page (`enter: "unfold"` with a `transform-origin` on the hinge edge), then lie flat.
- **Living layer:** hand-drawn feel via slightly rotated sticky notes and highlighter-like selection; annotations in the same mono as tags.
- **Easing:** inOutCubic with a little drag at the end.
- **Best for:** early-stage ideas, research-led redesigns, consumer apps.

### 5. Light Table (layered, analytical)
- **Feel:** translucent sheets stacked on a light table, comparing versions.
- **Camera:** slow yaw of 15-20 degrees with the stack fanned on z.
- **Assembly:** the new iteration appears as a ghost layer above the old one; differences light up in the accent color; the old layer fades or peels away.
- **Living layer:** diff highlights, "kept / changed / removed" chips, rulers on moved gaps.
- **Easing:** linear opacity cross-fades with inOutQuart motion.
- **Best for:** iterations where the story is "what changed between v1 and v2".

### 6. Stop-Motion Snap (rhythmic, playful)
- **Feel:** quick staccato beats with holds between them.
- **Camera:** steps between a few poses instead of gliding (use snap mode).
- **Assembly:** pieces arrive in discrete pops, a few at a time; each pop is a beat of story.
- **Living layer:** stamps and chips land with a small scale punch; avatars hop between pieces.
- **Easing:** short, snappy inOutQuart in bursts, long holds.
- **Best for:** portfolio hero loops, lightweight case studies, step-by-step narratives.

### 7. Control Room (live system)
- **Feel:** a monitored system, data in motion.
- **Camera:** steady isometric with slow push toward whichever piece is active.
- **Assembly:** components "boot" outline first, then fill in as if loading.
- **Living layer:** pulsing selection box, live rulers, metric chips that tick, callouts with numeric deltas.
- **Easing:** inOutCubic, with linear for ticking values.
- **Best for:** analytics, monitoring, operations UI, performance-driven redesigns.

## Choosing and mixing

1. Read the user's story for its dominant verb: *gather feedback* -> Workshop, *restructure* -> Teardown or Light Table, *simplify* -> Blueprint Studio or Paper Model, *prove with data* -> Control Room.
2. Propose a main direction plus one accent from another (e.g. Blueprint Studio with Workshop moments during the review beat).
3. For 3 iterations, a good default shape is **calm -> lively -> resolved**: iteration 1 in Blueprint Studio, iteration 2 in Workshop or Light Table (more change, more people), iteration 3 in Teardown or Control Room (confidence, precision).
4. Give a distinct signature to each iteration (a different entrance verb, a different living element as its lead) so they read as different chapters.

## Keeping it one film

Variation lives in **verbs, cast and rhythm**. These stay constant across iterations:
- Line weight, label typography and the accent color.
- The grid and the camera's vocabulary (isometric angle family, flat front view for every resolve).
- The resolve beat: every iteration ends on the same kind of hold on the real design.
- The theme variables, so light/dark always works.

## Living-element casting guide

| Moment in the story | Good cast | Why |
|---|---|---|
| Kickoff / assembling v1 | Named cursor(s) placing pieces | Shows who built it, gives motion a human pace |
| Review / critique | Cursor + comment pin (+ one sticky note) | Feedback becomes visible before it changes anything |
| Research insight | Sticky note, pictogram-like pin with a quote | Ties the change to evidence |
| The edit itself | Selection box + live ruler + dragging cursor | Makes the change feel authored and precise |
| New component | Callout with a short label | Names what is new |
| Result | Metric chip, avatar of the beneficiary, "Approved" stamp | Lands the outcome |

Writing rules for annotation text: 2-8 words, plain, specific ("Card B gets skipped in testing"), sourced from the user's own story. Never invent quotes, names or metrics. Ask for them. Mark any placeholder text clearly so it cannot ship by accident.
