# Archive

`m-goat/` is the original, standalone M-GOAT page (classic `<script>` tags, no build step). It is **frozen**: do not edit it.
The case study now lives in the React app at the repo root:

| Old (`archive/m-goat/`)            | New                                                      |
| ---------------------------------- | -------------------------------------------------------- |
| `index.html` markup + inline style | `src/pages/work/MGoat.tsx`, `styles/page.css`            |
| `index.html` inline script         | `src/components/case-study/mgoat/engine/page.js`         |
| `*.js` scene engine and data       | `src/components/case-study/mgoat/engine/`                |
| `*.css`                            | `src/components/case-study/mgoat/styles/`                |
| `assets/`, `vendor/`               | `public/assets/mgoat/`                                   |
| `*.md` handoff docs                | `docs/mgoat/`                                            |
| `tools/build_capabilities.py`      | `tools/mgoat/`                                           |

To open the archived page for comparison: `npx vite` from the repo root, then visit `/archive/m-goat/`.
