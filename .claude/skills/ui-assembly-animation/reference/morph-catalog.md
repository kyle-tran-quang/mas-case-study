# Motion Catalog

A menu to propose from. Pick 3-5 per transition that fit the actual change, describe each in one line, and let the user choose or mix. Never apply one without approval.

**Engine** column: `native` = supported by `assets/scene-template.html` as written, `compose` = built from native pieces with extra keys, `custom` = needs new engine code (say so, and confirm before building).

## Assembly (blueprint -> design)

| Name | Motion | Best for | Engine |
|---|---|---|---|
| Lego drop | Pieces fall from above onto their slot, shell first, nested last, small overshoot | Dense dashboards | native `enter: "drop"` |
| Slide-in | Piece glides in from a side along the plane | Nav, sidebars, toolbars | native `slideL` / `slideR` |
| Rise | Piece pushes up from beneath the stack | Shells, backgrounds, base layers | native `rise` |
| Unfold | Piece hinges flat from an edge like a paper model | Cards, panels | native `unfold` (+ `origin`) |
| Pop | Piece scales up in place with a settle | Small controls, new components | native `pop` |
| Draw-on | Outline draws itself, then fill ticks in | Minimal layouts | custom (stroke-dash) |
| Scan reveal | A plane sweeps the stack; pieces turn solid as it passes | "Reading the design" | compose (f ramp staggered by x) |

## Camera

| Name | Motion | Best for | Engine |
|---|---|---|---|
| Slow orbit | Continuous yaw of 30-60 degrees across the assembly | Default feel | native (camera keys) |
| Iso settle | Eases from isometric to flat; fidelity rises with it | Every resolve beat | native (fidelity is tied to `rx`) |
| Tilt-back | Flat tips back to isometric as pieces lift | Start of disassemble | native |
| Push-in focus | Scale up toward a piece while others dim | Highlighting one change | compose (camera `s` + other pieces' `o`) |
| Side profile | Rotates edge-on to show layer thickness | Emphasizing hierarchy | native (rz near 90) |

Keep wide yaw paired with a smaller scale, or corners leave the stage. The clip sweep in SKILL.md catches this.

## Disassembly

| Name | Motion | Engine |
|---|---|---|
| Explode | Pieces separate along z by depth | native `G.explode` |
| Peel layers | Top layer lifts away first, then next, in reading order | compose (stagger explode by depth) |
| Unzip | Halves part left and right | compose (x offsets by side) |
| Collapse to wire | Fidelity drops while flat, then lifts | native (animate `f`) |

## Morph between iterations (driven by the match table)

| Change type | Option A | Option B | Option C |
|---|---|---|---|
| **Moved** | Arc through 3D (`G.morph`, native) | Lift, straight travel, set down (compose) | Dissolve at old spot, pop at new (compose) |
| **Resized** | Scale rect with constant stroke (native: rect interpolates, stroke is zoom-independent) | Overshoot stretch (compose, `outBack`) | Ghost old size outline, grow into new (compose with a duplicate piece) |
| **Restyled** | Outline stays, fill crossfades (native: layers crossfade) | Flip 180 degrees (compose, `rx`) | Wipe (custom) |
| **Merged (N -> 1)** | Converge and fuse (compose: all N morph to the same rect, then fade) | Stack then unfold (compose) | Slot into a new container (compose) |
| **Split (1 -> N)** | Divide like cells (compose: N pieces share the origin rect, morph out) | Unfold fan (compose) | Pull-apart with tether callouts (compose) |
| **New** | Drop / pop / slide in (native) | Carried in by an avatar (compose) | Draw on from a point (custom) |
| **Removed** | Falls away: `z` down + `o` to 0 (native keys) | Folds flat (compose, `rx`) | Picked up by a cursor and dragged off (compose) |
| **Reordered** | Cards shuffle like a deck (compose, staggered morph) | Parallel lanes swap | Rotate around a shared axis (compose, `rz`) |

## Whole-scene moves

| Name | Motion | Best for | Engine |
|---|---|---|---|
| Shared-node morph | Match nodes by id, interpolate each from old to new pose | Default for iteration change | native |
| Light-table ghost | New iteration fades in as a translucent layer above the old; diffs glow in accent | "What changed" stories | compose (duplicate pieces + `o` + accent via callouts) |
| Shatter and reform | Everything breaks into small plates and reforms | Big redesigns with little continuity | custom |
| Page turn | Whole stack flips like a card | Light-touch iterations | compose (world `rz` 180 with a swap at the midpoint) |
| Ripple | Change propagates outward from the edited component | Showing blast radius | compose (stagger by distance from the edit) |
| Zoom through | Camera passes through the screen into the next | Narrative leaps (desktop -> mobile) | custom |

## Living elements (collaboration, feedback, annotation)

These are the "alive" layer. All are engine-native, use blueprint styling, stay a constant on-screen size at any camera zoom, and never exceed 3 on stage at once. Anchor each to a piece with `at: "pieceId@ax,ay"`; it follows the piece through morphs.

| Type | What it shows | Parameters | Pairs well with |
|---|---|---|---|
| `cursor` | A named collaborator moving between pieces | `name`, `tone: "line"` for a neutral one | Placing pieces, dragging a card, pointing at a problem |
| `pin` | Numbered comment pin that opens into a speech bubble | `n`, `author`, `text`; key `a` 0->1 opens it | Critique and research quotes |
| `note` | Sticky note with a slight tilt | `text`, `rot` | Stakeholder feedback, "trim this" |
| `callout` | Dot + leader line + label | `text`; key `dx,dy` places the label | Naming a new or changed component |
| `ruler` | Dimension line with end ticks and a live value | `axis`, `gap`, `text: "auto"` | The edit itself; spacing and size changes |
| `select` | Selection box with handles and a live "label · w×h" tag | optional `text` | Before a move or resize |
| `chip` | Pill with a metric or tag | `text` | Outcomes, deltas |
| `avatar` | Initials in a circle | `initials`, `tone` | Who a change is for, or who made it |
| `stamp` | Rotated approval / status stamp | `text`, `rot` | Sign-off, ship moment |

Ideas to compose from these (propose, don't impose):
- **Two cursors, one card:** two collaborators converge on the same component, one yields, the winner drags it.
- **Feedback relay:** pin opens on v1 -> note appears -> a selection box and ruler appear on the same piece -> the piece morphs -> a chip shows the result.
- **Ghost handoff:** the avatar of the user the change is for walks to the new component and the callout names it.
- **Approval beat:** the stamp lands on the final resolve with a tiny scale punch.

Parameters not in the engine yet (confirm with the user before building): hand-drawn scribble underline, a presence-avatar stack, typing indicator in a bubble, emoji reactions, laser pointer trail, a "version" tag that flips v1 -> v2.


## UI morph (no blueprint) and microinteractions

Use when the user chose "UI morph only" for a transition. Camera stays flat; everything stays real. Engine column as above.

| Name | Motion | Best for | Engine |
|---|---|---|---|
| Flat glide | Piece interpolates its rect to the next screen while the old and new crops cross-fade | Panels resizing, layout shifts | native `G.flat` |
| Panel fold | One piece shrinks into a narrow panel while its neighbour widens to fill the gap | Docking a chat, sidebar or inspector | native (two `G.flat` pieces) |
| Content stagger-in | New content rises 18px and fades in, 12ms apart, over a clean base image | Filling a freshly opened panel | compose (erased-rect base image + `rise` keys) |
| Cursor tap | Cursor glides to a target, scale dips to ~0.78 and returns, then the change begins | Triggering any state change | compose (separate cursor piece; fingertip offset measured from its image) |
| Hover reveal | Tooltip pops in after a cursor arrives on a target | Showing a label or hint | native `enter: "pop"` |
| Exit | Removed piece drops beneath the stack and fades | Anything deleted by the change | native `G.exit` |
