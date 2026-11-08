---
name: framer-cinematic-curtain
description: Build a full-screen cinematic intro ("curtain") for a mockup in this Motion Mockup Library and export it as one paste-ready Framer code component. The page loads covered by a dark frame, the mockup is drawn as a white transitions-ui-generation blueprint at 50% of the screen width, held, then zooms quickly to 70% (full padded width on mobile) as it turns hi-fi while the frame turns light grey and a fill fades in behind the mockup, and the frame slides up to reveal the page. Use when the user asks for a curtain, cinematic intro, case study transition, page-load reveal or "blueprint to mockup" scene for a mockup, or to package one for Framer.
---

# Framer cinematic curtain

Reference implementation: `src/mockups/sales-configurator/`. Read its `cinematic.ts`, `Cinematic.tsx` and
`framer-src/CaseStudyCinematic.tsx` before building a new one, and copy them rather than rewriting them. The
decisions below came out of several user rounds; keep them unless the user asks otherwise.

## What the user wants (defaults)

- **One Framer component, only the scene.** No canvas tags or labels, no "Page" or mode switches, and no card-page
  piece in the Framer file. On the canvas it shows the finished scene at the layer's size. On preview and published
  pages it plays full screen on every page load.
- **Timeline, about 3.4s:**
  1. The page starts covered, already dark in server HTML.
  2. A 150ms beat, then the blueprint draws region by region at **50% of the frame's width**.
  3. The zoom holds until just before the **last region's reveal**, then a quick **600ms** zoom to **70%** (in-out
     cubic), landing as the last region turns hi-fi.
  4. The background goes dark (`#0E1116`) to light (`#F4F4F4`) from 35% of the morph.
  5. A white **Fill** behind the mockup fades in with the zoom.
  6. A 150ms hold, then the frame slides up over 700ms (`cubic-bezier(0.76,0,0.24,1)`).
  7. Esc or a click skips. Reduced motion shows the finished scene, then fades.
- **Container:**
  - Max width 1920px. Horizontal padding is 120px from 1200px wide, 64px from 810px, and 16px below.
  - Height 100vh (100dvh).
  - Width shares are capped by the padded width, and the height only guards against clipping.
  - **Mobile (under 810px):** the zoomed-in mockup fills the padded width, and the blueprint keeps the 50:70 ratio.
  - Choose the padding from the **frame's own width** in JS, not only CSS media queries, so Framer canvas breakpoints
    match the site.
- **Framer settings:** Dark, Light, Fill, Build (per-region ms), Pad desktop, Pad tablet, Pad mobile. Keep names
  stable: renaming one resets placed instances.

## Workflow for mockup `<slug>`

1. **Screen contract.** The mockup's screen component (shared by Make and Framer, like `SalesConfigurator.tsx`)
   must take `generate`, `asset`, `enabled`, `delay`, plus optional `duration` (per-region build, passed to
   `generate()` only when set) and `onFinished` (called once all regions revealed, never on cancel). Add the last two
   additively, as in `SalesConfigurator.tsx`. Other callers must behave the same as before.
2. **Copy the core** into `src/mockups/<slug>/`: `cinematic.ts` and `Cinematic.tsx`. Mockups stay self-contained:
   no imports between mockup folders. Then adapt:
   - the screen import and props in `Cinematic.tsx`
   - `CINEMATIC.regions`, `regionStagger` and `regionDuration` to match the screen's `generate()` calls
   - the `STATIC_CSS` rule that makes the screen's own page background transparent (the selector for its root
     page element), so the blueprint draws on the dark frame
   - colors and `fill`, if the design needs them
3. **Framer wrapper.** Copy `framer-src/CaseStudyCinematic.tsx` to `src/mockups/<slug>/framer-src/<Name>Cinematic.tsx`.
   Point it at the slug's `*Assets` / `*Css` names from the build (`<prefix>Assets`, `<prefix>Css`).
4. **Build script.** In `scripts/build-framer.mjs`, add to the slug's `STANDALONE_MOCKUPS` entry:
   `extras: [{ component: "<Name>Cinematic", withScreen: true, modules: ["cinematic.ts", "Cinematic.tsx"], reactImports: "useEffect, useLayoutEffect, useRef, useState, type CSSProperties" }]`.
   `executive-print` uses a different build path; give it a standalone entry first if needed.
5. **Library entry.** Add `src/mockups/<slug>/views/cinematic/meta.ts` and `Mockup.tsx`, which the registry lists as
   `<slug>-cinematic`. Copy `CinematicPreview.tsx`: the stand-in card page and curtain are **Make-only scaffolding**.
   Then follow AGENTS.md "Preview": point `preview.ts` at the view and bump `revision`.
6. **Verify:**
   - `pnpm build:framer <slug>`, then `pnpm exec tsc --noEmit -p .`
   - `node agent/skills/framer-cinematic-curtain/scripts/smoke-ssr.mjs src/mockups/<slug>/framer/<Name>CinematicStandalone.tsx`
     checks that the file imports only `react` and `framer`, evaluates with no DOM, registers its controls, and
     server-renders for both preview and canvas.
   - Watch the Library view play once at a desktop width and a mobile width.
7. **Tell the user how to place it in Framer:**
   - Assets → Code → + → New Code File. Paste the whole standalone file and save.
   - Drag it onto the case study page and set the layer's Position to **Absolute** or Fixed so it takes no space.
     The layer's size only affects the canvas preview.
   - Test in **Preview**: it never animates on the canvas.
   - Updating: paste over the same code file; settings are kept.

## Constraints that broke things before

- **The runtime's blueprint layers are appended to `<body>` and measured once.** Scaling the stage without help
  leaves them behind. `Cinematic.tsx` uses a MutationObserver to move each `.t-gen` layer into the frame's overlay
  host, with `transform-origin` at the stage center and `scale(s / s0)` on every frame. Keep this, and keep the
  white-line `--gen-*` variables on the host.
- **The zoom start comes from the runtime's phases:** `zoomStart = (regions-1)*stagger + revealAt*duration - zoomLead`,
  where `revealAt` is 0.74, `PH.reveal[0]` in `src/lib/ui-generation.js`. Don't edit or re-time `src/lib/`.
- **No `react-dom` in the Framer file.** The frame is moved to `<body>` by hand in a layout effect, and the same
  element is always rendered (hidden when idle), so React never removes it from the wrong parent.
- **Server-render covered.** The `"always"` trigger starts in the play phase, so published pages never flash the
  content first.
- **The Fill** is an absolutely positioned layer with `z-index: -1` inside the transformed stage, behind the screen.
  Its opacity follows the eased zoom progress.
- **Framer reads one code file as one component** with its settings. It cannot import a `.tsx` file; the user pastes
  it. A label on the canvas reads as "not loading" to the user, so show the real scene there.
- **The click-intercept curtain** for a real card-to-page handoff (`interceptCardClicks`, `showCurtain`, `takeHandoff`
  in `cinematic.ts`) is kept for the Make preview. Only put it in the Framer file if the user asks again.
