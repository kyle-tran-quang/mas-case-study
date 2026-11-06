# Story contract: one source of truth, two exportable halves

The scene (left) and the story (right) are separate deliverables joined only by `STORY`. Both can be exported and restyled independently.

## Files (reference implementation: `bob-scene/`)

| File | Owns | Export as |
|---|---|---|
| `story.js` | `window.STORY`: beats (id, range, snap, theme, title) + right-hand copy (`eyebrow` on the first beat only, then body paragraphs; no headings) + one-line `motion` note. **The single source of truth for timing and theme.** | Story half (hand to any text/page treatment) |
| `scene-data.js` | `window.SCENE`: frames, pieces, camera, keys. Reads beat ranges from `STORY`, never hard-codes them. | Scene half |
| `assembly-engine.js` | `AssemblyScene.mount(el, {scene, story})` -> `{render(t), destroy()}`. No scrolling, no text column. | Scene half |
| `scene.css` | Scene styles + light/dark variables, scoped to `.asm` | Scene half |
| `index.html` | Composer only: split layout, scroll -> `t`, renders STORY copy. Replaceable. | Neither (example) |

## Rules
0. **Scroll mode defaults to `continuous`** (no snap): the scene scrubs seamlessly with the reader's scroll. Use `mode: "snap"` only if the user asks for it. `beat.snap` is still the text anchor and the reduced-motion pose.
1. **Retime in `story.js` only.** Changing a beat range retimes the scene because `scene-data.js` derives keys from it.
2. **The scene exposes `render(t)`.** Any clock can drive it (scroll, slider, video export). The scene never reads `scrollY`.
3. **The story half needs only `STORY`.** Each text block carries `data-beat="<beat id>"`; "active" is whichever beat contains `t`.
4. **Theme is per beat, not OS.** `beat.theme` is `"light"` or `"dark"`. The engine sets `data-theme` on the scene root; the composer sets it on `<html>` so the text half matches. `prefers-color-scheme` is never used. Add a theme only by adding a variable block in `scene.css`.
5. **Text column style.** Right half is Mikado Regular at 32px (eyebrow 16px, uppercase, grey), 24px gap between paragraphs, on a plain page fill. The left stage has a light grey fill (`#f4f4f4`, dark: `#1a1a1e`). The eyebrow (e.g. "THE PROBLEM") appears on the first section only. Mikado is licensed: ask the user for the font file and wire it via `@font-face`; do not substitute another family without asking.
6. **Copy is DRAFT until the user approves it.** Rationale written by the agent is marked in the `story.js` header and contains no invented metrics, quotes or names.

## Embedding the scene alone
```html
<link rel="stylesheet" href="scene.css">
<div id="scene" style="width:100%;height:100vh"></div>
<script src="story.js"></script><script src="assembly-engine.js"></script><script src="scene-data.js"></script>
<script>const s = AssemblyScene.mount(document.getElementById("scene"), { scene: SCENE, story: STORY }); s.render(0.86);</script>
```
