# Figma Make Guidelines — IBM Maximo Pricing Estimator Case Study
## Art direction: The Redline

> These guidelines are written for a Figma Make AI prompt. Each section maps to a screen or
> visual asset needed in the portfolio case study. Use them as direct instructions to generate
> frames that can be dropped into the case study presentation or website.
>
> **Concept:** The case study is a designer marking up a broken system and shipping a fixed one.
> Every annotation, divider, and callout uses the vocabulary of a redlined specification
> document — the mark-up language designers use before handing off to engineering. Before sections
> feel unresolved and annotated in red. After sections feel approved, resolved, and signed off
> in green. The site looks like the case study itself is under active review.

---

## Global Design System

Apply these tokens and rules to every frame before generating any content.

### Color tokens

| Token | Hex | Usage |
|---|---|---|
| `ground` | `#F2F3F5` | Frame/page background — cold paper white throughout |
| `ink` | `#111318` | All headings, body text, primary labels |
| `muted` | `#737880` | Secondary text, captions, meta, timestamps |
| `line` | `#D0D4DA` | Ruled dividers, table borders, grid hairlines |
| `redline` | `#E3170A` | Annotations, Before-state callouts, pain indicators, correction marks ONLY |
| `resolved` | `#1A6640` | After-state indicators, approval marks, outcome numbers ONLY — never appears in Before sections |
| `redline-bg` | `#FFF0EE` | Tinted background for Before-state annotation zones (5% red wash) |
| `resolved-bg` | `#EEF8F2` | Tinted background for After-state annotation zones (5% green wash) |

**Critical rule:** `redline` and `resolved` never appear in the same section. Before sections use red. After sections use green. The Bridge/transition section introduces the shift. This contrast is the concept — do not dilute it.

### Typography

- **Display typeface:** Bodoni Moda (optical size, Google Fonts) — high-contrast serif for section titles. The thick/thin contrast mirrors the AppPoints abstraction: looks simple, is sophisticated underneath.
- **Body/UI typeface:** Switzer (Fontshare, or use font-family fallback: `'Switzer', 'Helvetica Neue', system-ui, sans-serif`) — neutral neo-grotesk for all body copy, labels, captions, nav.
- **Data/numbers typeface:** DM Mono (Google Fonts) — strictly for AppPoint values, cost figures, stat numbers, table data. Never for labels or headings.

| Role | Typeface | Weight | Size | Tracking | Leading |
|---|---|---|---|---|---|
| Display heading | Bodoni Moda | 800 | 72–120 px | −0.03 em | 0.88 |
| Section heading (h2) | Bodoni Moda | 600 | 36–48 px | −0.02 em | 1.05 |
| Sub-heading (h3) | Switzer | 600 | 20–24 px | 0 em | 1.3 |
| Body | Switzer | 400 | 16–18 px | 0 em | 1.6 |
| Label / category | Switzer | 500 | 11–13 px | +0.06 em | 1.4 |
| Data / numbers | DM Mono | 400 | 13–16 px | 0 em | 1.5 |
| Annotation (handwritten feel) | Switzer | 400 | 13 px | 0 em | 1.4 — use italic for annotations |

**Category labels:** uppercase, Switzer Medium, 11–12 px, `+0.06em` tracking, `muted` color. No eyebrow labels above every heading — only where the label carries real information.

### Grid and layout

- 12-column grid, fluid gutter (`24 px` at 1440 px frame width), `48 px` outer margins
- All content aligns to one of three strong vertical lines: col 1, col 5, col 9
- Section spacing uses four moods — assign per section, do not use constant padding:
  - **Tight:** 48 px top/bottom (data tables, diagrams)
  - **Normal:** 96 px top/bottom (standard content sections)
  - **Airy:** 160 px top/bottom (statement quotes, transition moments)
  - **Full viewport:** 100vh (the strike-through transition screen)

### Shape and line rules

- **Border radius:** 0 px everywhere. No rounded cards, no pill buttons. Every corner is square — this is a document, not an app.
- **Dividers:** 1 px solid `line`. Major section breaks get a 2 px `redline` or `resolved` rule (color depends on section state).
- **Annotation marks:** thin `1 px` dashed lines in `redline` connecting callout text to annotated elements. Callout text is always italic Switzer in `redline` color.
- **Strike-through:** the signature mark of the system. A `3 px` horizontal `redline` line drawn across ruled-out content.

### The annotation system

Every callout in the Before sections uses this visual language consistently:

1. A small circled number (18 px diameter, `redline` fill, white DM Mono numeral) placed at the annotation origin
2. A `1 px` dashed `redline` line from the circle to the annotated element
3. Italic Switzer body text in `redline` color for the annotation copy
4. Optional: `redline-bg` tinted rectangle behind the annotation zone

After sections replace this with the resolved version: `resolved` fill circles, green dashed lines, `resolved` italic text.

---

## Screen 1 — IBM.com Pricing Page (Existing State)

**Section:** Before
**Caption:** "Too simple or too complex at the same time"
**Purpose:** Show what clients encountered. Annotated in redline as an artifact under review.

### Frame spec

- **Size:** 1440 × 960 px
- **Style:** Cold paper ground (`#F2F3F5`), IBM.com visual language (white surface cards on the page), with three redline annotations overlaid — making it look like a designer's review of the existing page

### Content

**Top annotation bar (full width, 48 px, `redline-bg`)**
- Left-aligned italic Switzer 13 px `redline`: `EXISTING STATE — IBM.com/products/maximo/pricing · Reviewed Feb 2026`
- Right-aligned: circled `1` annotation marker

**Simulated browser chrome**
- Simple top bar: browser URL field showing `ibm.com/products/maximo/pricing`, light grey `#E8E8E8` fill, 44 px height

**Page masthead (white, 56 px)**
- IBM 8-bar logo, black, left-aligned, 32 px height
- Nav links right: `Products · Solutions · Consulting · Support` — Switzer 14 px, `ink`
- `Contact IBM` text link, right-aligned

**Page hero**
- Eyebrow label: `IBM MAXIMO APPLICATION SUITE` — Switzer Medium 11 px, uppercase, `muted`
- Heading: `Pricing` — Bodoni Moda 600, 52 px, `ink`
- Sub-copy (2 lines, max 520 px wide): `AppPoints are the shared currency of Maximo licensing. Each user type and module draws from a common pool.` — Switzer 16 px, `muted`

**Pricing tier table**
- Three columns: `Limited`, `Base`, `Premium`
- Each column: tier name Bodoni Moda 28 px, AppPoint cost `1 AppPoint / user` in DM Mono 20 px `ink`, 5 feature bullet points in Switzer 14 px `muted`
- Footer row spanning all columns, `line` top border: `1 AppPoint = $X / month` in DM Mono 13 px `muted`

**Redline annotations (3 total)**

Annotation 1 — Arrow pointing to `1 AppPoint = $X / month`:
> `"Another level of abstraction. Why not just say $20/month?"`

Annotation 2 — Bracket across the three tier columns:
> `"Clients don't understand which tier they need or why"`

Annotation 3 — Beside the hero sub-copy:
> `"Sellers must explain AppPoints before even discussing price"`

---

## Screen 2 — Excel AppPoints Calculator (Existing State, Redacted)

**Section:** Before
**Caption:** The tool most sellers avoided showing clients
**Purpose:** Convey the fragmentation and complexity of the legacy tool. Annotated as evidence in a case brief.

### Frame spec

- **Size:** 1440 × 860 px
- **Style:** Microsoft Excel aesthetic — white cells, grey column headers — placed on the `ground` background with a thin `line` border and a drop shadow substitute (2 px offset shadow using `#D0D4DA` at 40% opacity to avoid actual shadow)

### Content

**Section label (above the spreadsheet frame)**
- Switzer Medium 11 px uppercase `muted`: `EXHIBIT A — APPPOINTS CALCULATOR V4.2 (EMAILED BETWEEN TEAMS)`

**Version warning banner (inside the spreadsheet, full width, 40 px)**
- Yellow cell fill `#FFF3CC`, 1 px `#D4B000` border
- DM Mono 13 px `ink`: `⚠  This is v4.2 (Mar 2026). Check #mas-pricing-tools in Slack for the latest version before submitting to CPQ.`

**Excel toolbar strip (44 px, `#F0F0F0`)**
- Tab labels: `File · Home · Insert · Formulas · Data · Review` — system-ui 12 px `muted`
- Formula bar: `fx` label + `=IF(B12="Concurrent",C12*D12*0.5,C12*D12)` — DM Mono 12 px `ink`, suggesting hidden logic

**Spreadsheet body**
- Column headers (light grey `#E8E8E8` fill, bold 12 px): `User Type | Access Type | Named Users | AppPoint Draw | Monthly Cost | Annual Cost`
- 9 data rows. All monetary values replaced with solid rectangles: `████` — fill `#A0A8B0`, no border, 80% of cell width, 12 px height, centered vertically
- Row 7: yellow highlight `#FFF8CC`, right side comment icon (orange triangle in cell corner)
- Row labeled `Trade-up calculation (manual)` — italic Switzer 12 px
- Totals row: bold, `line` top border 2 px, `TOTALS` label in Switzer 600 12 px

**Redline annotations (3 total)**

Annotation 1 — Bracket down the `Monthly Cost` column:
> `"All values manually entered into CPQ after this step"`

Annotation 2 — Pointing to the version warning:
> `"Version control via Slack. 3 simultaneous versions in circulation at peak."`

Annotation 3 — Bottom right of the frame:
> `"'The integration is me.' — Interview 4"`

---

## Screen 3 — 5-Step Quoting Chain Diagram

**Section:** Before
**Caption:** Five handoffs, five tools, zero integration
**Purpose:** The broken workflow as a technical diagram — annotated with pain points, drawn in the redline vocabulary.

### Frame spec

- **Size:** 1440 × 560 px
- **Background:** `ground` with horizontal `line` rules every 80 px (faint ruled-paper texture, 0.4 opacity)
- **Style:** Technical diagram, not an infographic. No icons, no color fills on nodes. Pure line-work.

### Diagram content

**Section label (top-left)**
- Switzer Medium 11 px uppercase `muted`: `CURRENT STATE — QUOTING CHAIN`

**Five-node horizontal flow (centered vertically)**

Each node:
- 72 × 72 px square, `ground` fill, 1 px `line` border, 0 px radius
- Role label below in Switzer 600 14 px `ink`
- Tool label below role in DM Mono 12 px `muted`

| Node | Role | Tool |
|---|---|---|
| 1 | Seller | Excel v4.2 |
| 2 | Product Manager | Slack + email |
| 3 | L0 Approver | Email thread |
| 4 | CSE | CPQ — manual |
| 5 | Customer | Quote PDF |

**Connector lines between nodes**
- 1 px `ink` horizontal lines, right-pointing arrowhead (simple triangle, `ink` fill)
- Micro-label on each connector, Switzer italic 11 px `muted`, centered above the line:
  - 1→2: `copy-paste`
  - 2→3: `version email`
  - 3→2: `revision request` (arrow pointing LEFT, `redline` color — showing the back-and-forth)
  - 2→3: `3× avg` label beside the back-arrow
  - 3→4: `Slack thread`
  - 4→5: `CPQ re-entry`

**Redline callout bubble (attached to the 2↔3 back-arrow)**
- Small rectangle `redline-bg`, 1 px dashed `redline` border, no radius
- Italic Switzer 13 px `redline`: `"3 iterations before approval. 9 months minimum deal cycle."`

**Bottom stat bar (full width, 48 px, `line` top border)**
- Four DM Mono figures spaced evenly across the frame:
  - `10,000+` — Switzer 11 px `muted` label below: `hours wasted / year`
  - `3–6 mo` — label: `to become proficient`
  - `3×` — label: `avg quote iterations`
  - `9 mo–2 yr` — label: `sales cycle`

---

## Screen 4 — Affinity Map from Seller Research

**Section:** Bridge
**Purpose:** Show research synthesis as a working artifact — this looks like a physical session wall, not a polished deliverable. Imperfect alignment is intentional.

### Frame spec

- **Size:** 1440 × 960 px
- **Background:** `#ECEEF0` — slightly cooler than `ground`, like a physical wall or whiteboard surface
- **Style:** Sticky note clusters on a wall. Redline marks the clusters (this research is the evidence that led to the annotation)

### Section label

- Switzer Medium 11 px uppercase `muted`: `RESEARCH SYNTHESIS — 12 INTERVIEWS (8 SELLERS, 4 CSES)`

### Clusters (5 groups, loose 2-row arrangement)

Each cluster:
- Cluster heading: Switzer 600 14 px `ink`, underlined with a 2 px rule in the cluster's accent color
- 6–9 sticky notes per cluster

**Cluster 1: AppPoints Confusion** (top-left, accent `#E3170A` redline)
Stickies: `"Don't know how to explain AppPoints"` / `"Another layer of abstraction"` / `"Why not just say $20/month?"` / `"Clients push back immediately"` / `"3 clients told me they hate AppPoints"` / `"Calculator makes it worse"`

**Cluster 2: Tool Fragmentation** (top-center, accent `#1D6FB5` blue)
Stickies: `"The integration is me"` / `"Excel → Slack → email → CPQ"` / `"No single version of truth"` / `"3 different calculators in use"` / `"Shadow tools everywhere"` / `"Can't share the real tool with clients"`

**Cluster 3: Shadow Tools** (top-right, accent `#7B3FA0` purple)
Stickies: `"Built my own estimator in Sheets"` / `"Custom questionnaire I send first"` / `"Don't show the official calculator to clients"` / `"Every seller does it differently"` / `"PM built one too"`

**Cluster 4: Seller Trust and Control** (bottom-left, accent `#0D7153` green)
Stickies: `"Quote goes to approver with my name on it"` / `"Need to check every number"` / `"A chatbot scares me"` / `"Need to control the output"` / `"Can't hand this to an AI and walk away"`

**Cluster 5: Approval Bottleneck** (bottom-right, accent `#B36B00` amber)
Stickies: `"3 iterations before approval"` / `"CSE review takes 1–2 days"` / `"Approval can't be removed, only sped up"` / `"SRE reviews are the long tail"` / `"Approval queue is unpredictable"`

**Sticky note style**
- 130 × 90 px rectangles, 2 px radius (this is the one exception to the 0 px rule — physical paper)
- Fill: white `#FFFFFF` with a very faint tint (5%) of the cluster accent color
- Left border: 3 px solid cluster accent color
- Text: Switzer Regular 12 px `ink`, left-aligned with 10 px padding
- Slight rotation variation: −1.5° to +1.5° per note (vary, not random-looking)

**Redline cross-cluster annotation (running diagonally across the wall)**
- A single italic Switzer 14 px `redline` note, placed at slight angle across clusters 1 and 2:
  > `"Core insight: sellers don't want a chatbot. They want to control the quote."`

---

## Screen 5 — Concept Comparison: Platform vs. Guided Estimator

**Section:** Bridge
**Caption:** Why simplicity won over integration
**Purpose:** Two directions, one ruled out, one chosen — annotated as a design decision record.

### Frame spec

- **Size:** 1440 × 760 px
- **Background:** `ground`
- **Layout:** Two equal panels separated by a 2 px `line` center divider

### Section label (top of frame)

- Switzer Medium 11 px uppercase `muted`: `DESIGN DECISION — CONCEPT DIRECTION · FEB 2026`

### Left panel — Ruled out

**Header strip (40 px, `redline-bg`, `redline` left border 3 px)**
- `OPTION A — RULED OUT` in Switzer 500 11 px uppercase `redline`
- Bodoni Moda 600 28 px `ink` below: `Unified Integration Hub`

**Hub-and-spoke diagram**
- Central square node (80 × 80 px, `line` border, `muted` label): `MAS Pricing Hub`
- 5 spoke nodes (48 × 48 px each): `Excel`, `CPQ`, `Salesforce`, `Slack`, `Gainsight`
- Connectors: 1 px dashed `#B0B5BE` lines
- Each spoke node: square, `ground` fill, `line` border, DM Mono 11 px label

**Rejection marks**
- A `3 px` `redline` diagonal strike drawn across the entire diagram area
- Three `redline` annotation lines below the diagram, each with a circled number:
  1. `"Cross-system integration: 1–2 year build"`
  2. `"5 new tool dependencies for sellers"`
  3. `"Risk: sellers don't adopt yet another tool"`

### Right panel — Chosen

**Header strip (40 px, `resolved-bg`, `resolved` left border 3 px)**
- `OPTION B — CHOSEN` in Switzer 500 11 px uppercase `resolved`
- Bodoni Moda 600 28 px `ink` below: `Guided Quote Workflow`

**Linear flow diagram**
- 4 steps in a vertical column, left-aligned on col 9
- Each step: full-width row, 48 px height, `line` bottom border, step number in DM Mono 11 px `muted` left, step label in Switzer 600 14 px `ink` center
  - `01 · Answer role and environment questions`
  - `02 · System calculates AppPoints automatically`
  - `03 · Seller reviews and adjusts the quote`
  - `04 · Export CPQ-ready payload`
- Connectors: 1 px solid `ink` lines between steps, right-pointing arrow

**Approval marks**
- Three `resolved` annotation lines below the diagram:
  1. `"Ships in months, not years"`
  2. `"Zero new tools for sellers"`
  3. `"Quote stays under seller control"`

**Bottom — decision quote (full width, below both panels, `airy` spacing)**
- Bodoni Moda 600 italic 24 px `muted`, centered, max 800 px wide:
  > `"Simple is enough. Adhering to the goal — giving the seller a quote they can share — is enough."`

---

## Screen 6 — Phase 1 Chatbot UI (3 Key States)

**Section:** After — Phase 1
**Purpose:** Show the guided workflow. Resolved design — no redline marks. The annotation system switches to green.

### Frame spec

- **Size:** 1440 × 900 px per state; arrange as 3 frames side by side in the final composition at reduced scale (480 px wide each), or as 3 sequential full-size frames
- **Background:** `ground`
- **Style:** Clean document-like UI, not a product screenshot with chrome. Think a designed spec, not a live app — consistent with the redline vocabulary but in resolved state

### Resolved state header (above all 3 frames)

- `resolved` 2 px rule, full width
- Switzer Medium 11 px uppercase `resolved`: `PHASE 1 — AI CHATBOT · watsonx Orchestrate · Private Preview Sept 2026`

### Shared UI chrome (applied to all 3 states)

**Left sidebar (200 px, `line` right border)**
- Top: Switzer 600 14 px `ink`: `Maximo Pricing Agent`
- Navigation items: Switzer 400 13 px `muted`, active item has `resolved` left bar 3 px + `ink` color
- Items: `New Quote` (active in State 1), `Saved Quotes`, `Settings`

**Top bar (48 px, `line` bottom border)**
- Breadcrumb: `New Quote · Step X of 4` — Switzer 13 px `muted`
- Right: `Last saved 2 min ago` — DM Mono 11 px `muted`

**Progress bar (below top bar, full width, 4 px height)**
- `line` background, `resolved` fill advancing left to right across the 3 states

### State 1 — Role Input

**4-step progress indicator (horizontal, below progress bar)**
- Steps: `Roles` (active, `ink` text, `resolved` underline) → `Environment` → `Deal Type` → `Review`
- Inactive steps: Switzer 400 13 px `muted`

**Form content**
- Heading: Bodoni Moda 600 36 px `ink`: `Who needs access to Maximo?`
- Sub-copy: Switzer 400 16 px `muted`: `Add each user type. You can include multiple tiers.`
- Three form rows (each 40 px height, `line` bottom border, no background fill):
  - Label: Switzer 500 12 px uppercase `muted`
  - Input: Switzer 400 14 px `ink`
  - Row 1: `USER TYPE` / Dropdown: `Select type...`
  - Row 2: `ACCESS TYPE` / Dropdown: `Select access...`
  - Row 3: `NUMBER OF USERS` / Number input: `0`
- Text link below: `+ Add another user type` — Switzer 400 13 px `resolved`, underlined

**Running total (right column, 280 px, `line` left border)**
- Label: Switzer 500 11 px uppercase `muted`: `RUNNING ESTIMATE`
- Large figure: DM Mono 400 48 px `ink`: `0`
- Sub-label: Switzer 400 13 px `muted`: `AppPoints · $0 / month`
- Faint note: Switzer 400 12 px `muted` italic: `Final total after all steps`

**Action (bottom)**
- Primary button: full-width, `ink` fill, `ground` label Switzer 600 14 px: `Continue →`

### State 2 — Environment and Deal Type

Progress advances to step 2 active.

**Form content**
- Heading: Bodoni Moda 600 36 px `ink`: `How is Maximo deployed?`
- Toggle row: `DEPLOYMENT MODEL` label + two options side by side (each 50% width, `line` border): `Customer-managed` / `SaaS`
- Dropdown row: `DEAL TYPE` / Options: `New Deal · Renewal · Trade-up from legacy Maximo`
- Conditional (show only when Trade-up selected): inline helper note Switzer italic 13 px `muted`: `Trade-ups require active support on surrendered products.`
- Dropdown row: `EDITION` / Options: `Essentials · Standard`

**Running total** — updated with partial calc, SaaS note appended: DM Mono 11 px `muted` italic: `SaaS billed hourly at activated capacity`

### State 3 — Review and Export

Progress at step 4.

**Heading:** Bodoni Moda 600 36 px `ink`: `Review your quote`

**Quote summary table**
- Full-width, `line` top and bottom borders, no fills
- Headers: Switzer 500 11 px uppercase `muted`: `USER TYPE | ACCESS | COUNT | APPPOINTS | MONTHLY`
- 3–4 data rows: Switzer 400 14 px `ink` for labels, DM Mono 14 px `ink` for all numbers
- Totals row: 2 px `resolved` top border, Switzer 600 14 px `ink` label: `TOTAL`, DM Mono 600 for all values
- All cost values: illustrative format `$XX,XXX / mo` — do not use real IBM pricing figures

**Resolved annotation below totals**
- `resolved` circle `1` marker, italic Switzer 13 px `resolved`:
  > `"95% of quotes approved within 2 hours of submission"`

**Action bar**
- Left: ghost button `← Back` — Switzer 400 14 px `ink`, `line` border
- Right: primary button `Export to CPQ →` — `ink` fill, `ground` label

---

## Screen 7 — Unified Estimator Concept (Phase 2)

**Section:** After — Phase 2
**Purpose:** The planned end state — one continuous workflow replacing the entire fragmented stack.

### Frame spec

- **Size:** 1440 × 900 px
- **Background:** `ground`
- **Style:** Same resolved vocabulary as Screen 6. This feels like a designed spec, not a wireframe.

### Resolved state header

- `resolved` 2 px rule
- Switzer Medium 11 px uppercase `resolved`: `PHASE 2 — UNIFIED ESTIMATOR · PLANNED`

### Left navigation (220 px, `line` right border)

Section structure — Switzer 500 11 px uppercase `muted` section labels, Switzer 400 13 px items:

```
QUOTE
  Scope & Roles          ✓
  Deal Configuration     ✓
  Pricing Summary        ← active (resolved left bar, ink text)

CONFIGURE
  CPQ Payload            ○ Not started
  Provisioning Config    ○ Not started

SUBMIT
  Approval Routing       ○ Not started
  Export & Handoff       ○ Not started
```

Completed items show a `✓` in DM Mono 12 px `resolved`. Not-started show `○` in `muted`.

### Main content — Pricing Summary

**Top breadcrumb bar (48 px, `line` bottom border)**
- DM Mono 13 px `muted`: `Q-2026-0041`
- Switzer 13 px `muted`: `· Acme Corp · Standard Edition · New Deal`
- Right: `DRAFT` — Switzer 500 11 px uppercase, `line` border tag, 0 px radius

**Two-column layout**

Left column (cols 1–8): Line-item breakdown table
- Headers: Switzer 500 11 px uppercase `muted`
- Columns: `MODULE | USERS | APPPOINT DRAW | TYPE | MONTHLY`
- 4 rows: `Field Service · Health · Manage · Monitor` — Switzer 400 14 px `ink`, DM Mono for all numeric values
- All cost values: use `─` placeholder dashes — do not imply specific pricing

Right column (cols 9–12, `line` left border): Totals panel
- `TOTAL APPPOINTS`: DM Mono 400 13 px uppercase `muted` label, DM Mono 600 40 px `ink` figure
- `MONTHLY ESTIMATE`: DM Mono 400 13 px uppercase `muted`, DM Mono 600 32 px `ink`
- `ANNUAL ESTIMATE`: DM Mono 400 13 px uppercase `muted`, DM Mono 400 24 px `muted`
- `line` divider
- `DEAL TYPE` tag: `New Deal` — Switzer 500 11 px, `line` border
- `EDITION` tag: `Standard` — same

**Inline notice (below table, full width)**
- `resolved` left border 3 px, `resolved-bg` fill, no radius
- Switzer italic 13 px `muted`: `SaaS components billed hourly. Annual estimate reflects 720 hrs/mo at full capacity.`

**Primary action (bottom right)**
- `ink` fill button, `ground` label Switzer 600 14 px: `Continue to CPQ Payload →`

---

## Screen 8 — Before / After Comparison

**Section:** After
**Caption:** From abstraction to clarity
**Purpose:** The core transformation in one frame. The full color contrast of the system — redline on the left, resolved on the right.

### Frame spec

- **Size:** 1440 × 680 px
- **Background:** `ground`
- **Layout:** Two equal panels, a vertical center divider with an arrow label

### Left panel — Before

**Panel header (full width of panel, 40 px, `redline-bg`, `redline` left border 3 px)**
- `BEFORE` — Switzer 500 11 px uppercase `redline`
- Switzer 400 13 px `muted`: `What the seller built manually`

**Abstraction stack**

5 nested boxes, each indented 16 px further right than the previous, showing layers of complexity:

- Box 1 (widest): `Field Technician — user type`
- Box 2: `Concurrent access = × 0.5 multiplier`
- Box 3: `AppPoint draw: 2 pts per user`
- Box 4: `Rate: 1 AppPoint = $████ / mo`
- Box 5 (narrowest): `Monthly cost: $████`

Each box: `line` border, `ground` fill, Switzer 400 13 px `ink` label. Redacted values shown as `████` solid rectangles, `#A0A8B0` fill, 60 px wide.

Downward arrows (`↓`) between each box: DM Mono 16 px `muted`.

**Pain annotation below stack**
- Italic Switzer 13 px `redline`: `"Clients don't follow this. Sellers struggle to explain it."`

### Center divider

- Vertical 2 px `line` rule
- Center-aligned: Bodoni Moda 600 italic 36 px `muted`: `→`

### Right panel — After

**Panel header (full width of panel, 40 px, `resolved-bg`, `resolved` left border 3 px)**
- `AFTER` — Switzer 500 11 px uppercase `resolved`
- Switzer 400 13 px `muted`: `What the seller shows the client`

**Clean quote card**
- 0 px radius, `line` border, `ground` fill, full panel width
- Header: Bodoni Moda 600 20 px `ink`: `Your Maximo Quote`
- `line` divider below header

Three line items (each 48 px height, `line` bottom border):
- Left: Switzer 400 14 px `ink` — `Field Service (40 technicians, concurrent)`
- Right: DM Mono 400 14 px `ink` — `$X,XXX / mo`
- Repeat for `Health (10 supervisors)` and `Manage (5 admins)`

Totals row (2 px `resolved` top border):
- Left: Switzer 600 14 px `ink`: `Estimated Annual Total`
- Right: DM Mono 600 20 px `ink`: `$XXX,XXX`

Small note below: Switzer 400 12 px `muted` italic: `AppPoint calculation handled automatically.`

**Resolved annotation below card**
- Italic Switzer 13 px `resolved`: `"95% of quotes approved within 2 hours"`

---

## Screen 9 — Carbon v11 Annotated Screen

**Section:** Bridge
**Caption:** Intentional component choices
**Purpose:** One interface screen with design-decision callouts. The annotation system applied to a specific UI screen — this is the redline vocabulary in its most literal form.

### Frame spec

- **Size:** 1440 × 960 px
- **Background:** `ground`
- **Base screen:** Use the State 1 UI from Screen 6 (Role Input step), reproduced at full fidelity in the left 9 columns

### Section label (top)

- Switzer Medium 11 px uppercase `muted`: `COMPONENT DECISIONS — IBM CARBON v11 · PHASE 1 BUILD`

### Annotation callouts (5 total)

Each callout follows the global annotation system:
- Circled number in `redline` fill (18 px, white DM Mono numeral)
- 1 px dashed `redline` line from circle to the annotated component
- Annotation card: white fill, `redline` left border 3 px, no radius, 200 px wide
  - Component name: Switzer 600 12 px `ink`
  - Rationale: Switzer 400 12 px `muted` italic, 1–2 lines

**Callout 1 → Progress indicator**
- **Carbon ProgressIndicator**
- `"Gives sellers total scope at a glance before committing"`

**Callout 2 → User Type dropdown**
- **Carbon Dropdown**
- `"Constrains input to valid values — no manual AppPoint lookup"`

**Callout 3 → Number input**
- **Carbon NumberInput**
- `"Steppers reduce error for non-technical users"`

**Callout 4 → Running total sidebar**
- **Custom component**
- `"Live feedback without form submission — reduces iteration anxiety"`

**Callout 5 → Primary action button**
- **Carbon Button, primary**
- `"One clear action per step — forward momentum by design"`

---

## Usage Notes for Figma Make

1. **The color rule is the concept.** `redline` (`#E3170A`) appears ONLY in Before/unresolved sections. `resolved` (`#1A6640`) appears ONLY in After/approved sections. If either color appears in the wrong section, the concept breaks. Do not use either as general accent colors.

2. **All corners are 0 px radius**, with the single exception of sticky notes in Screen 4 (2 px, to read as physical paper). This is not negotiable — the squared corner IS the document aesthetic.

3. **Redacted values** (`████`) in Screens 2 and 8 should be rendered as filled solid rectangles using `#A0A8B0`, not as text characters or strikethroughs.

4. **Screen 4 (affinity map)** should look like a working session artifact. Slight rotation on sticky notes (−1.5° to +1.5°), variation in note density per cluster, and imperfect spacing are intentional signals that this is real research, not a polished graphic.

5. **All cost figures** in Screens 6, 7, and 8 are illustrative placeholders (`$XX,XXX / mo`, `────`). Do not imply specific IBM Maximo pricing in any frame.

6. **Screens 1 and 2** are existing-state screens. They are rendered with slightly lower visual confidence than the designed screens (6, 7) — less generous spacing, more visual clutter, heavier annotation marks — to make the contrast with the After screens legible without a label.

7. **The `resolved` annotation style** (Screens 6, 7, 8) mirrors the `redline` annotation style exactly — same circled number, same dashed connector line, same italic text — but in `#1A6640` green instead of red. The system is the same; only the judgment has changed.

8. **DM Mono is for numbers and data only.** Every numeric value in a table, stat callout, or data field uses DM Mono. Every label, heading, and sentence uses Switzer or Bodoni Moda. Do not mix them within a single typographic element.
