# Pacing: designing for the person scrolling

Pacing is the part of this skill that decides whether the animation feels *right*. The rest of the skill decides what moves; this file decides **when, how long, in what order, and how it lines up with the words**.

The target is **tight but smooth**: no wasted scroll, no dead air, no motion the eye cannot follow. Tight does not mean fast. A motion that is too short to read feels like a glitch; a motion that is too long feels like the page is broken. Both come from the same mistake: choosing times from the animation's point of view instead of the viewer's.

## The viewer model

Design every beat against these facts about the person on the other end of the scroll wheel. They are why the numbers below are what they are.

1. **Scroll is the viewer's hand, not a clock.** Scroll speed varies from a trackpad flick to a slow wheel notch, and people stop mid-motion. So every pose the stage can be stopped in must look intentional.
2. **Motion has to stay near the finger.** When the scene moves several times faster than the scroll that drives it, it feels like it is running away. When it moves far slower, it feels sticky. A rough healthy band is on-screen movement of about 1x to 6x the scroll distance at its fastest instant.
3. **People read, then look, then read.** Text and animation compete for the same attention. The sentence has to be readable while the stage is *still*; the stage is watched while the text is *not changing*. Never ask the viewer to do both at once.
4. **The eye follows one thing.** A single hero motion per beat can be tracked. Two simultaneous large motions in different places cannot, and the viewer picks one and misses the other.
5. **The eye needs a landing.** Every move ends in a stable pose long enough to register what changed. Without a landing the change is seen but not understood.
6. **Direction is expectation.** Scrolling down advances the story and scrolling up rewinds it exactly (rule 4 in `SKILL.md`). Never let a motion reverse on the way forward.
7. **Busy readers leave.** Scroll distance is a cost the viewer pays. Spend it only where it buys understanding.

## The five-part beat

Every beat is built from the same five parts, in this order. Name them in the pacing worksheet so each number has a job.

| Part | Job | Typical share of the beat |
|---|---|---|
| **Settle** | The previous pose is still on screen; the new sentence arrives. Nothing moves. | 10-15% |
| **Cue** | A tiny anticipatory movement (cursor travels, selection box appears, camera starts easing) that says *something is about to change* and where to look. | 10-15% |
| **Hero** | The one main motion. This is the beat. | 35-45% |
| **Land** | The motion decelerates into its final pose. Overshoot, if any, happens here. | 10-15% |
| **Rest** | Stable pose, text anchor inside it. The viewer reads and absorbs. | 20-30% |

Rules:
- The **text anchor** (`beat.snap`) sits in the **Rest**, never in Cue/Hero/Land. A viewer who stops scrolling to read must see a finished pose, not a frozen mid-flight frame.
- The Cue is what makes motion feel *motivated*. A morph that starts with no cue looks arbitrary; the same morph preceded by a cursor arriving at the piece looks authored.
- Beats may share boundaries: one beat's Rest can double as the next beat's Settle.

## Choosing durations (scroll distance, not seconds)

Think in **vh of scroll**. At a comfortable scroll pace one viewport height takes about 1-1.5 seconds, so 10vh is roughly 0.1-0.15s of finger movement. That is the calibration for everything below.

| Kind of motion | Minimum | Comfortable | Notes |
|---|---|---|---|
| Small control pop, chip, stamp | 8vh | 10-15vh | Below 8vh it reads as a blink |
| Single piece travel (slide, drop, unfold) | 15vh | 25-40vh | Longer travel distance needs longer scroll: see the speed rule |
| Staggered group entrance (whole stack) | 40vh | 50-70vh | Stagger spans ~40-60% of this; the last piece still needs 15vh to settle |
| Camera flatten (iso -> front) | 20vh | 25-40vh | Pieces resolve in the **same window** as the camera, in lockstep |
| Camera tilt back (front -> iso) | 20vh | 25-35vh | Same lockstep rule |
| Morph (pieces travel to next iteration) | 30vh | 40-60vh | Stagger the travellers; unchanged pieces stay put |
| Rest around a text anchor | 20vh + 0.6vh per word | 35-60vh | Capped at 60vh: if the copy needs more, the copy is too long |
| Living-element fade in/out | 3vh | 4-6vh | Fades can be shorter than moves |

**Speed rule.** A piece covering distance D (in screen pixels) over S px of scroll, with an easing whose fastest instant is P times its average speed, moves at about `D x P / S` times the finger. Keep that under ~6. Measured peaks: `linear` 1.0, `inOutCubic` 3.0, `inOutQuart` 4.0, `outBack` 4.4. Worked example: a 560px slide-in on `inOutQuart` needs at least `560 x 4 / 6 = 373px` of scroll, about 41vh on a 900px viewport; on `inOutCubic` it needs about 31vh. If the slot is shorter, shorten the travel (start the piece closer) rather than speeding it up. `assets/pacing-audit.js` computes this for every move (`tooFast`).

**Duration scales with distance, but sub-linearly.** Doubling travel distance should add roughly 40% to the duration, not 100%. Short hops get a floor (8-15vh), long moves get a ceiling (about 60vh) beyond which you should split the move into two beats.

## Orchestrating motion against content

Motion and content (the text sentences, the revealed design) are one instrument. Place them against each other deliberately.

### Text leads, then the stage shows
The sentence is a promise; the stage keeps it. Order:
1. The sentence arrives while the stage is **at rest** in the previous pose (Settle).
2. The Cue and Hero play **after the viewer has had time to read it** (about 0.6vh of scroll per word, at least 20vh).
3. The next sentence arrives only at the *next* Rest.

Do not run a long Hero motion across a text change. The text fade (`transition: opacity .35s`) happens in time, not scroll, so a text swap in the middle of a motion splits attention.

### Anchors sit on rest
`beat.snap` is the scroll position at which the sentence is centred in the viewport. In the template, text sections are **pinned at their anchors**, not stacked in normal flow, so text and stage never drift apart. For every anchor: no piece and no camera key is mid-change within about 10vh either side. `pacing-audit.js` checks this (`notAtRest`).

Hold beats (the front-view "complete picture") get a longer still window than ordinary rests, sized to the copy: `min(60vh, 20vh + 0.6vh x words)`.

### Reveal order follows reading order
- Within a stack: shell, then sections, then components (depth), and inside a depth level top-to-bottom, left-to-right. This is what `G.enter` already does; keep it.
- Across the screen: the first thing to arrive is the first thing the sentence mentions.
- A new component the text talks about arrives **after** the surrounding structure has landed, with its own Cue (callout, selection box) so the eye is already there.

### One hero, two supporters, the rest still
Per beat: one hero (the thing the sentence is about), at most two supporting motions that start *later* or are visually smaller, and everything else frozen. Concretely:
- Supporters start at or after the Hero's first third, never before.
- Things that change for the same reason move in **lockstep** (same `t0`, same `t1`, same easing): camera flatten + piece resolve; camera tilt + piece lift. Staggering these looks like lag.
- Things that change for different reasons are **staggered** by at least 8vh or 20% of the Hero, whichever is greater.
- Living elements are Cues or Landings, never the hero. They appear in the Cue window and leave in or after the Rest, and never cover what the sentence is about.

### Stagger, with a shape
- Stagger offsets span 40-60% of the group's window so the last piece still gets a full settle.
- Use a gentle ease on the stagger itself (earlier pieces closer together, later ones further apart) when there are more than ~8 pieces; uniform spacing reads as mechanical.
- Unchanged pieces get **explicit hold keys** across a morph, not an inherited tail from an earlier key. (An inherited tail makes shells and nav drift for no reason.)

## Easing, with intent

| Purpose | Easing | Why |
|---|---|---|
| Camera moves | `inOutCubic` | Gentle both ends; the camera is the stage, it should never feel abrupt |
| Large travel (slides, morph) | `inOutQuart` | Quick middle, long soft landing; reads as weighty and controlled |
| Drops and pops | `outBack` (overshoot 1.2-1.4) | The settle is the satisfying part; keep it in the Land segment |
| Continuous orbit | `linear` | Only when the camera should feel steady, never for arrivals |
| Opacity and fidelity | `inOutCubic`, shorter than the move it accompanies | The cross-fade should finish slightly before the move lands so the landing is crisp |

Never ease in with a hard start at the *top* of a Rest. Every move begins and ends at zero velocity.

## Total length, and where the budget goes

- Total `scrollVh` is about `100 x beats + 40` (see the scroll budget rule in `SKILL.md`). Text anchors of adjacent beats sit **55-105vh** apart: closer than 55vh and sentences crowd, farther than ~105vh and the viewer loses the thread.
- Spend the budget in this order of priority: **Rests** first (comprehension), **Hero** second (delight), **Cue/Land** third, **Settle** last. If the budget is tight, shorten Settle and the blueprint-only openers, never the Rest.
- Do not stretch to "feel cinematic". If a draft is long, cut a beat, merge two ideas, or drop supporters.
- The very first beat is the exception to the quiet start: the viewer arrives with nothing to look at, so show something within the first ~5vh (a piece starts to enter). Never open on an empty stage for more than about 10vh.

## The pacing worksheet (a Gate 3 deliverable)

Before writing code, fill this in and show it with the beat sheet. In code, mirror it as one `TIMING` object (see `assets/scene-template.html`) so the numbers have a single home.

| Beat | Part | Scroll range (t) | Length (vh) | Moves | Easing | Why this long |
|---|---|---|---|---|---|---|
| v1 Assemble | Cue | 0.04-0.08 | 14 | Cursor arrives at card A | inOutCubic | Tells the eye where the build starts |
| v1 Assemble | Hero | 0.04-0.20 | 54 | Stack enters, staggered | outBack / inOutQuart | 6 pieces, 40% stagger, last gets 15vh to settle |
| v1 Assemble | Rest | 0.20-0.28 | 27 | none | n/a | Anchor 0.24, one sentence of ~12 words (needs ~27vh) |

Conversion: `vh = (t1 - t0) x (scrollVh - 100)`.

Every row must answer *why this long*. "It looked right" is not an answer until you have looked at it; "this many words" or "this far to travel" or "so the eye can find the new piece" are.

## Checks to run

1. **Static audit.** Load `assets/pacing-audit.js` and call `pacingAudit(SCENE)` (see the file header for browser and Node use). It reports `tooShort`, `tooFast`, `deadScroll`, `notAtRest`, `holdTooShort`, `crowded`, bursts that need staggering, and the scroll budget. Fix everything it flags, or write down why a flag is intentional. Its thresholds are starting points; tune by eye, then record the final numbers in the worksheet.
2. **Stop test.** Render each text anchor and its +/-10vh neighbours. At the anchor the pose must be complete and the focal piece fully in view. At neighbours nothing should look broken if the viewer stopped there.
3. **Flick test.** Render at 3x scroll speed (skip every third sample). Nothing should tear, and the end pose must still be reached cleanly because every move ends exactly on a key.
4. **Reverse test.** Determinism check from `SKILL.md`; pacing relies on it.
5. **Eye-path test.** For each beat, say aloud what the eye does in order. If it goes to two places at once, remove a supporter or delay it.
6. **Read-aloud test.** Read the beat's sentence at a calm pace. If you finish before the Rest ends, the Rest is long enough; if you finish a long time before, shorten it.

If you cannot drive a browser, run the audit and the determinism math only, and say that real-scroll feel (inertia, trackpad flicks) is unverified.

## Anti-patterns

| Pattern | Why it feels wrong | Fix |
|---|---|---|
| Text anchor sits mid-morph | Reader stops, sees a frozen half-move | Move the anchor into a Rest, or add one |
| Everything starts together | No hero, eye has nowhere to go | Stagger by depth/reading order; pick one hero |
| Camera flatten and piece resolve in different windows | Pieces look like they lag the camera | Same `t0`/`t1`/easing |
| Long empty stretch between beats | Feels broken, wastes the reader | Shorten, or fill with a Cue |
| Hero motion shorter than 8vh | Reads as a glitch | Lengthen or turn it into a fade |
| Fast move over a short scroll | Runs away from the finger | Lengthen scroll or shorten the distance |
| Hold shorter than the copy | Sentence is cut off by the next motion | Size the Rest to the word count |
| Overshoot at the end of a Rest | The pose is never quite stable | Overshoot inside Land only |
| Unchanged pieces drift during a morph | Looks like noise | Explicit hold keys |
| Slow, long opener on an empty stage | Viewer thinks nothing loaded | A piece moves within ~5vh |
