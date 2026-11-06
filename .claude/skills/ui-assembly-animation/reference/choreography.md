# Choreography Schema

The scene is data. The engine in `assets/scene-template.html` reads this and renders any scroll position `p in [0,1]`.

## Coordinates

- Reference frame: the native pixel size of the design (`frame: {w, h}`), origin top-left.
- Piece position `x, y` are offsets from the piece's home rect, in reference pixels. Home is `rect`.
- `z` is elevation in reference pixels along the screen normal (positive toward the viewer when flat).
- Camera: `rx` (tilt), `rz` (yaw around the vertical axis), `s` (scale). Flat front view is `rx=0, rz=0`. Classic isometric is `rx~55, rz~-45`.

## Pieces

```js
{
  id: "kpi-row",         // stable across iterations when same thing
  label: "KPI row",      // shown in blueprint mode only
  kind: "section",       // shell | section | card | table | chart | media | heading | number | control | nav | external
  depth: 1,              // nesting level -> default lift
  parent: "page",
  rects: { v1: {x,y,w,h}, v2: {x,y,w,h} },   // home rect per iteration (omit if absent in that iteration)
  skeleton: [ ... ]      // optional measurable inner lines for blueprint look
}
```

A piece absent from an iteration has no rect there; its keys must bring it in (new) or out (removed).

## Keyframes

Each piece has a list of keys sorted by `t` (scroll progress). Properties not set in a key inherit from the previous key.

```js
{ t: 0.12, x: 0, y: 0, z: 140, rx: 0, rz: 0, s: 1, o: 1, f: 0, rect: "v1" }
```

| Prop | Meaning |
|---|---|
| `x, y, z` | Offset from home position |
| `rx, rz` | Per-piece rotation (flip, tilt) |
| `s` | Scale multiplier |
| `o` | Opacity 0-1 |
| `f` | Fidelity 0 = outline blueprint, 1 = real design crop |
| `rect` | Which iteration home rect and image crop this piece uses. Rect interpolates between keys when it changes, crops crossfade |
| `e` | Easing for the segment *leading into* this key (default `inOutCubic`) |

### Entrance styles

Set `enter` on a piece; `G.enter(style, ...)` builds the keys. `origin` sets the CSS `transform-origin` (the hinge for `unfold`).

| `enter` | Motion | Easing |
|---|---|---|
| `drop` | Falls from above onto its slot | `outBack` |
| `slideL` / `slideR` | Glides in along the plane from the left / right | `inOutQuart` |
| `rise` | Pushes up from beneath the stack | `inOutQuart` |
| `unfold` | Hinges flat from `origin` (e.g. `"50% 100%"` = bottom edge) | `inOutQuart` |
| `pop` | Scales up in place with a settle | `outBack` |

Vary these by component kind (shells `rise`, nav `slideL`, cards `unfold`, small controls `pop`) so assembly reads as built, not stamped. Slide-ins intentionally start off stage.

## Living elements (collaboration, feedback, annotation)

A second track of keyed objects, `SCENE.extras`, for the layer that makes the scene feel alive. They are not part of the design, so they are never higher fidelity than the blueprint and never replace a piece.

```js
extras: [
  { id: "maya",  type: "cursor",  name: "Maya" },
  { id: "pin1",  type: "pin",     n: 1, author: "Maya", text: "Card B gets skipped in testing" },
  { id: "rule",  type: "ruler",   axis: "x", gap: 44, text: "auto" },
  ...
]
```

Types: `cursor`, `pin`, `note`, `callout`, `ruler`, `select`, `chip`, `avatar`, `stamp`. Parameters are listed in `morph-catalog.md`.

Keys use the same sampler as pieces, with these properties:

| Prop | Meaning |
|---|---|
| `o` | Opacity / presence. Below 0.01 the element is hidden entirely |
| `at` | Anchor: `"pieceId@ax,ay"` where `ax,ay` are 0..1 inside the piece's *current* box (default center). The element follows the piece through morphs. Bare `"pieceId"` means center, and for `ruler` and `select` means the piece's whole box |
| `dx, dy` | On-screen pixel offset from the anchor (callout label position, sticky-note nudge) |
| `a` | Open amount for a `pin` bubble, 0 to 1 |
| `s` | Scale multiplier |

Helpers: `X.life(t0, t1, at, extra)` = fade in, hold, fade out. `X.path([[t, at], ...])` = a cursor travelling between anchors, appearing at the first and leaving at the last.

Behaviors the engine guarantees (keep them if you extend it):
- **Constant on-screen size.** Strokes, labels, cursors and bubbles are counter-scaled by `--inv` so they do not shrink when the camera zooms out.
- **Billboarding.** Cursors, pins, notes, chips, avatars, stamps, callouts and ruler/selection labels counter-rotate against the camera so text stays readable in isometric.
- **Lift.** Billboards float about 10 screen px above their anchor so an upright label never sinks into a tilted plane.
- **Keep-inside.** Anything anchored in the right 45% of the frame opens leftward, so bubbles and callouts do not run off the stage.
- **Overlays hug the piece.** Rulers and selection boxes use the piece's top-left and size, not the anchor point.

Budget: at most 3 visible at once. Cast them with `directions.md`.

## Camera keys

```js
camera: [
  { t: 0.00, rx: 58, rz: -40, s: 0.8 },
  { t: 0.30, rx: 55, rz: -10, s: 0.9 },
  { t: 0.40, rx: 0,  rz: 0,   s: 1.0 }
]
```

## Beats

Beats label scroll ranges for sync with the text half and for snap anchors.

```js
beats: [
  { id: "v1-blueprint", range: [0.00, 0.08], title: "Blueprint" },
  { id: "v1-assemble",  range: [0.08, 0.30], title: "Assemble" },
  { id: "v1-resolve",   range: [0.30, 0.45], title: "Resolve", hold: true, snap: 0.40 },
  ...
]
```

- `snap` is the anchor used in snap mode.
- `hold: true` means the pose is stable across the range so the viewer can read.
- Right-half text sections reference `data-beat` ids.

## Generators (preferred over hand-writing every key)

Hand-writing keys for 40 pieces is error-prone. Generate them:

The template ships these as `G.*` (pieces) and `X.*` (living elements):

- `G.enter(style, p, t0, t1, rect, order, count, L)` -> staggered entrance by `depth` then reading order (y then x). `order` is the piece's index in that sort.
- `G.resolve(p, t0, t1, rect)` -> `z` to 0 and `f` ramp 0 to 1 as the camera goes flat.
- `G.explode(p, t0, t1, rect, L)` -> from flat to lifted by depth, `f` back to 0.
- `G.morph(p, t0, t1, fromRect, toRect, arc)` -> slide between iteration rects with an arc through z.
- `G.rest(p, t, rect)` -> an explicit hold pose (use to pin a piece during a hold).
- `X.life(...)`, `X.path(...)` -> see above.

Layer the generators per beat so changing a beat's range retunes everything. Order matters: keys are not re-sorted, so append them in increasing `t`.

## Timing guidance

The full method is in `pacing.md` (viewer model, five-part beat, duration table, speed rule, worksheet). The short version:

- **Think in vh of scroll, not progress.** `vh = (t1 - t0) x (scrollVh - 100)`. 1% of `t` is `(scrollVh - 100) / 100` vh, so every number in the keys should be traceable to a length in vh and a reason.
- **One `TIMING` object.** Put every motion window in it (see `assets/scene-template.html`), write the rests as comments beside it, and derive piece keys, camera keys and living-element times from it. Retiming is then a one-place edit.
- **Anchors sit on rests.** `beat.snap` must be inside a window where no piece and no camera key is changing (about 10vh clear on both sides). The template pins each text section at its anchor.
- Scroll distance: **portfolio/recruiter default is ~100vh per story beat plus 40 (about 340vh for 3 beats; 55-105vh between adjacent text anchors)**. Only go beyond that when the user explicitly wants a cinematic pace.
- Stagger: spread the staggered pieces over 40-60% of the group's window, not all of it, so the last piece still has time to settle (>= 15vh).
- Lockstep: camera and the pieces that follow it (flatten + resolve, tilt + lift) share `t0`, `t1` and easing. Do not stagger them.
- Rests: `min(60vh, 20vh + 0.6vh x words)` of still scroll around the anchor; hold beats get the longer end.
- Minimum visible move: 8vh. Maximum on-screen speed: about 6x the scroll that drives it (`assets/pacing-audit.js` checks both).
- Easing: `inOutCubic` for camera; `outBack` (small overshoot, 1.2-1.4) for lego drops, inside the Land segment only; `inOutQuart` for large travel; `linear` only for continuous orbit.
- Rotation: cap yaw change at ~70 degrees per beat so spins read as deliberate, not frantic.

## Fidelity rules

- The engine caps every piece's `f` at `smoothstep(25, 4, camera.rx)`, so 3D views stay low-fi no matter what the keys say. Keys can still hold `f` lower to stagger a reveal.
- With a source image, the blueprint outline fades out as `f` rises and the real crop fades in. Without one (the demo), a placeholder UI face fades in over a still-visible outline.
- Tags show only when `f < 0.3`. The drafting grid fades out as the camera goes flat.
- The front view must equal the source image. If a crop looks wrong, fix the rect, never the render.

## Beat sheet (deliverable at Gate 3)

| Beat | Scroll range | Camera | What moves | Morph type | Story line (right text) |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

Ship it with the **pacing worksheet** from `pacing.md` (per part: range, length in vh, easing, why this long).

Mark any decision the agent made on the user's behalf with "(agent choice)".
