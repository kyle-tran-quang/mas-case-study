# Graph Report - mas-case-study  (2026-11-05)

## Corpus Check
- 69 files · ~76,485 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: .woff2 10, .css 3, (none) 2)

## Summary
- 410 nodes · 534 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Scene Template & Keyframes
- Portfolio Guidance & Skill Meta
- Choreography Directions & Pacing
- Morph Catalog & Story Contract
- Capabilities Build Script
- Maturity Assessment UI
- Project Tooling & Deps
- Capabilities Illustrations
- Assembly Engine Internals
- Pricing Research Screens
- Bob v1 Chat Screens
- M-GRAT Three-Act Story
- Bob v3/v4 Workspace Screens
- Carbon Concept Comparison
- Portfolio References
- Redline Art Direction
- Guided Quote Workflow
- Act 1 ALM Skeleton
- Case Study Narrative Arc
- Maximo Dashboard Screenshots
- Seller Pain Points
- Act 1 Stage Frames
- Capabilities Scene Code
- Affinity Research Insights
- Hero Transition
- MCP Config
- Smiley Mascot Logo

## God Nodes (most connected - your core abstractions)
1. `ui-assembly-animation skill` - 15 edges
2. `Step 2: Draft using chosen format` - 13 edges
3. `Choreography schema` - 12 edges
4. `Portfolio References` - 12 edges
5. `Pacing: designing for the person scrolling (doc)` - 11 edges
6. `README.md (Portfolio Case Study Generator)` - 11 edges
7. `Direction (motion personality per iteration)` - 9 edges
8. `Motion Catalog (doc)` - 9 edges
9. `IBM Maximo Pricing Estimator case study (draft)` - 9 edges
10. `Phase 3: Choreograph` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Anchors sit on rest (beat.snap)` --shares_data_with--> `Text column (one section per beat at snap anchor)`  [INFERRED]
  .claude/skills/ui-assembly-animation/reference/pacing.md → bob-scene/index.html
- `m-goat/index.html (M-GOAT case study page)` --semantically_similar_to--> `bob-scene/index.html (composer page)`  [INFERRED] [semantically similar]
  m-goat/index.html → bob-scene/index.html
- `tick (smoothed scroll render loop)` --semantically_similar_to--> `tick (scroll to t render loop)`  [INFERRED] [semantically similar]
  m-goat/index.html → bob-scene/index.html
- `Text slots (beat copy or texts[] entries)` --semantically_similar_to--> `Text column (one section per beat at snap anchor)`  [INFERRED] [semantically similar]
  m-goat/index.html → bob-scene/index.html
- `M-GRAT case study` --semantically_similar_to--> `Three-Act Structure format`  [INFERRED] [semantically similar]
  case-study-mgrat.md → SKILL.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Six-phase ui-assembly-animation workflow** — _claude_skills_ui_assembly_animation_skill_phase0_intake, _claude_skills_ui_assembly_animation_skill_phase1_analyze, _claude_skills_ui_assembly_animation_skill_phase2_blueprint_look, _claude_skills_ui_assembly_animation_skill_phase3_choreograph, _claude_skills_ui_assembly_animation_skill_phase4_build, _claude_skills_ui_assembly_animation_skill_phase5_verify [EXTRACTED 1.00]
- **Scene template scroll-to-render pipeline** — _claude_skills_ui_assembly_animation_assets_scene_template_progress, _claude_skills_ui_assembly_animation_assets_scene_template_tick, _claude_skills_ui_assembly_animation_assets_scene_template_render, _claude_skills_ui_assembly_animation_assets_scene_template_sample, _claude_skills_ui_assembly_animation_assets_scene_template_placeextra [EXTRACTED 1.00]
- **Non-negotiable rules of the skill** — _claude_skills_ui_assembly_animation_skill_never_assume_ask, _claude_skills_ui_assembly_animation_skill_blueprint_derived_from_design, _claude_skills_ui_assembly_animation_skill_front_view_is_real_design, _claude_skills_ui_assembly_animation_skill_scroll_as_sole_clock, _claude_skills_ui_assembly_animation_skill_low_fi_3d_high_fi_front, _claude_skills_ui_assembly_animation_skill_pace_for_viewer [EXTRACTED 1.00]
- **Story and scene halves joined by STORY** — bob_scene_story, bob_scene_scene_data, bob_scene_assembly_engine, bob_scene_scene_css, bob_scene_index [EXTRACTED 1.00]
- **Pacing system: five-part beat, anchors on rest, durations and audit** — _claude_skills_ui_assembly_animation_reference_pacing_five_part_beat, _claude_skills_ui_assembly_animation_reference_pacing_anchors_sit_on_rest, _claude_skills_ui_assembly_animation_reference_pacing_duration_table, _claude_skills_ui_assembly_animation_assets_pacing_audit [INFERRED 0.85]
- **Choreography vocabulary: directions, motion catalog, living elements** — _claude_skills_ui_assembly_animation_reference_directions_direction_concept, _claude_skills_ui_assembly_animation_reference_morph_catalog_morph_by_change_type, _claude_skills_ui_assembly_animation_reference_morph_catalog_living_elements, _claude_skills_ui_assembly_animation_reference_directions_living_element_casting [INFERRED 0.85]
- **Nine narrative story formats offered by the case-study skill** — skill_star, skill_heros_journey, skill_problem_solution_impact, skill_before_after_bridge, skill_pyramid_principle, skill_pixar_format, skill_three_act, skill_jtbd_narrative, skill_decision_log [EXTRACTED 1.00]
- **Writing and voice guidance for case study copy** — skill_writing_principles, tone_guide_voice_rules, tone_guide_core_attributes, design_portfolio_guide_universal_principles, readme_writing_principles [INFERRED 0.85]
- **M-GRAT three-act morphing case study** — case_study_mgrat_act1_problem, case_study_mgrat_act2_blueprint, case_study_mgrat_act3_tool [EXTRACTED 1.00]
- **Before-state redline-annotated screens (pricing page, Excel calculator, quoting chain)** — content_figma_make_guidelines_screen1_pricing_page, content_figma_make_guidelines_screen2_excel_calculator, content_figma_make_guidelines_screen3_quoting_chain [EXTRACTED 1.00]
- **Three-phase Maximo pricing solution roadmap** — content_maximo_pricing_estimator_case_study_phase1, content_maximo_pricing_estimator_case_study_phase2, content_maximo_pricing_estimator_case_study_phase3 [EXTRACTED 1.00]
- **Before / Bridge / After case study narrative structure across documents** — content_maximo_pricing_estimator_case_study_before_section, content_maximo_pricing_estimator_case_study_bridge_section, content_maximo_pricing_estimator_case_study_after_section, content_figma_make_guidelines_redline_concept [INFERRED 0.85]
- **Bob UI design iteration screens (v1, v1b, v2)** — bob_scene_assets_v1, bob_scene_assets_v1b, bob_scene_assets_v2 [INFERRED 0.85]
- **v4 three-region layout (nav sidebar, chat, actions panel)** — bob_scene_v4_nav_sidebar, bob_scene_v4_chat_first_layout, bob_scene_v4_actions_panel [EXTRACTED 1.00]
- **Act 1 tilted UI scene assets** — m_goat_assets_act1_alm_1_1, m_goat_assets_act1_alm_1_2, m_goat_assets_act1_dashboard [INFERRED 0.75]
- **Act 1 wireframe skeleton asset variants** — m_goat_assets_act1_stage_41_30, m_goat_assets_act1_source1x_alm_1_1, m_goat_assets_act1_source1x_alm_1_2 [INFERRED 0.85]
- **Act 1 tilted perspective UI screenshots (dashboard and skeleton wireframes)** — m_goat_assets_act1_source4x_dash_export4x, m_goat_assets_act1_source4x_skel11_export4x, m_goat_assets_act1_source4x_skel12_export4x [INFERRED 0.75]
- **Assessment UI design iterations v1 to v3** — m_goat_assets_act2_v1, m_goat_assets_act2_v2, m_goat_assets_act2_v3 [INFERRED 0.85]
- **Capabilities morph source pair (art to diagram)** — m_goat_assets_capabilities_source_art, m_goat_assets_capabilities_source_diagram, m_goat_assets_capabilities_source_diagram_blue_nodes [INFERRED 0.75]
- **Capabilities illustration frames and leaf motif** — m_goat_assets_capabilities_source_frame1, m_goat_assets_capabilities_source_frame2, m_goat_assets_intro_blue_leaf [INFERRED 0.75]

## Communities (29 total, 4 thin omitted)

### Community 0 - "Scene Template & Keyframes"
Cohesion: 0.06
Nodes (45): buildExtra, buildKeys, G piece keyframe generators, SCENE data object, CSS theme variables (light/dark), TIMING object (pacing worksheet in code), X living-element key helpers, Sample beat sheet (7 beats, 740vh) (+37 more)

### Community 1 - "Portfolio Guidance & Skill Meta"
Cohesion: 0.07
Nodes (39): Morphing split-stage format rules (minimal text, graphic tells story, one canvas), Claude Code skill, Design Portfolio Case Study Best Practices, Anti-patterns (screenshot dump, novel, process theater, burying the lede), What hiring managers look for (six criteria), Mehmet Aydin Bas (Meta, Lyft) portfolio pattern, Simon Pan (Google, Uber) portfolio pattern, Slide deck specific tips (+31 more)

### Community 2 - "Choreography Directions & Pacing"
Cohesion: 0.08
Nodes (33): pacing-audit.js (pacingAudit), scene-template.html, Choreography Directions (doc), Blueprint Studio direction, Control Room direction, Direction (motion personality per iteration), Light Table direction, Living-element casting guide (+25 more)

### Community 3 - "Morph Catalog & Story Contract"
Cohesion: 0.08
Nodes (23): Morph options by change type (moved, resized, restyled, merged, split, new, removed, reordered), Story contract (doc), Scene half (scene-data.js, assembly-engine.js, scene.css), Story half (story.js, window.STORY), mount(), paintLayer(), render(), sample() (+15 more)

### Community 4 - "Capabilities Build Script"
Cohesion: 0.12
Nodes (11): add_off(), best_align(), center(), flat(), flatten(), parse_path(), poly(), rect_pts() (+3 more)

### Community 5 - "Maturity Assessment UI"
Cohesion: 0.15
Nodes (18): Asset data maturity matrix (percentage-of-assets radio grid), Goals and priorities multi-select questions (objectives, obstacles), IBM Carbon visual language (IBM Plex, blue accent, IBM logo), Maintenance approach maturity question (Reactive to Prescriptive), Maximo Application Suite Growth (Readiness) Assessment, Assessment v1: single-page question list (IBM blue header, Question 6 of 10), Assessment v2: split layout with gradient intro panel and asset data maturity matrix (Page 1 of 4), Assessment v3 (beta): light split layout with illustration, goals and priorities checkboxes (Page 2 of 7) (+10 more)

### Community 6 - "Project Tooling & Deps"
Cohesion: 0.12
Nodes (14): devDependencies, @playwright/test@^1.65.0, vite@^8.3.6, name, private, scripts, build, dev (+6 more)

### Community 7 - "Capabilities Illustrations"
Cohesion: 0.14
Nodes (17): Capabilities frame 1: isometric line illustration of sustainable city/energy scene, Large blue leaf shape (left of scene), Concentric semicircular arcs with purple nodes and small leaves, Skyline elements: buildings, water tower, wheat, trees, solar panel, plug, Capabilities frame 2: Maximo product and industry list diagram, Connector line linking Maximo modules to industry solutions list, Industry solutions and capabilities column (APM, field service, real estate, EAM, HSE, and 76 more), Maximo modules column (Manage, Monitor, Health, Predict, Spatial, Mobile, Inventory Optimization) (+9 more)

### Community 8 - "Assembly Engine Internals"
Cohesion: 0.13
Nodes (14): bb (billboard transform), Camera keys (rx, rz, s), E easing functions, paintLayer (image crop painter), PLACE per-type placement table, placeExtra, progress (scroll to t), render (+6 more)

### Community 9 - "Pricing Research Screens"
Cohesion: 0.18
Nodes (14): Annotation system (circled number, dashed line, italic text), Screen 1 - IBM.com Pricing Page (existing state), Screen 2 - Excel AppPoints Calculator (redacted), Screen 3 - 5-Step Quoting Chain Diagram, Screen 8 - Before / After Comparison, AppPoints (token currency), Excel AppPoints calculator (as-is insights), IBM.com Maximo pricing page (+6 more)

### Community 10 - "Bob v1 Chat Screens"
Cohesion: 0.18
Nodes (13): Chat/Code mode toggle pill in header, Hand pointer cursor icon (pointing hand sprite used for animated cursor), IBM Bob v1 chat home screen (AI Folder dropdown, suggestion cards), AI Folder dropdown (Create a new project, Folder 1, Folder 2) in 'Start a new chat with' heading, Dark left sidebar navigation (New chat, Search, Marketplace, Automations, date-grouped projects), Prompt suggestion cards (Detect anomalies, Run data profiling, Explore more prompts), IBM Bob v1b chat home screen (Create a new agent tooltip, Big title cards, Ask Bob input), Ask Bob anything pill input with send button and plus/edit/settings toolbar (+5 more)

### Community 11 - "M-GRAT Three-Act Story"
Cohesion: 0.21
Nodes (12): M-GRAT case study, Act 1: The Problem, Act 2: The Blueprint, Act 3: The Tool, Maximo Advisory Council (Lowell, US), Animation notes (scroll-driven, persistent canvas, pacing, reduced-motion), Customer meters: AppPoints, Entitlement, Usage, Maximo World version v1 and v2 prototypes (+4 more)

### Community 12 - "Bob v3/v4 Workspace Screens"
Cohesion: 0.24
Nodes (11): Bob Code v3 editor view with empty right panel (UI screenshot), Bob Code v3 editor with chat panel (UI screenshot), Bob v4 blank layout skeleton (dark sidebar, light main panel, light right panel), IBM Bob v4 chat workspace with Actions panel (UI screenshot), Dark IDE layout: file explorer sidebar, code editor with line numbers and minimap, right chat panel, Files/Artifacts file tree sidebar with filter, Welcome prompt 'What can we build today?' with recent PR cards and Ask Bob input, Actions panel (Commit to Github, Draft a PR, Browser, Terminal, Side chat, Teach a skill) (+3 more)

### Community 13 - "Carbon Concept Comparison"
Cohesion: 0.18
Nodes (8): Carbon components used (ProgressIndicator, Dropdown, NumberInput, Button), Option A - Unified Integration Hub (ruled out), Screen 5 - Concept Comparison: Hub vs Guided Estimator, Screen 9 - Carbon v11 Annotated Screen, Carbon Design System v11, Bridge - how the solution came together, Carbon Design System v11, Constraints (pricing sophistication, legacy stack, approval, seller trust, Carbon v11)

### Community 14 - "Portfolio References"
Cohesion: 0.22
Nodes (10): Portfolio References, Amy La portfolio (north star), Lee Jun portfolio, Lucia Jaramillo portfolio (strategic designer), Michelle Liu portfolio, Nova: CUI for North Face case study, The future of AI & hardware case study, Rachel Chen portfolio (north star) (+2 more)

### Community 15 - "Redline Art Direction"
Cohesion: 0.20
Nodes (7): Figma Make Guidelines - The Redline art direction, Color tokens (ground, ink, muted, line, redline, resolved), Figma Make, Grid and layout (12-col, spacing moods), Shape and line rules (0px radius, strike-through), Typography system (Bodoni Moda, Switzer, DM Mono), Visual checklist (12 visuals)

### Community 16 - "Guided Quote Workflow"
Cohesion: 0.24
Nodes (9): Option B - Guided Quote Workflow (chosen), Screen 6 - Phase 1 Chatbot UI (3 states), Screen 7 - Unified Estimator Concept (Phase 2), After - three phases toward transparency and speed, Phase 1 - AI chatbot on watsonx Orchestrate, Phase 2 - Unified pricing estimator (planned), Phase 3 - Public pricing experience on ibm.com (exploratory prototype), Phase 3 five before/after improvements (role sizing, live estimate, capability mapping, suggested FAQs, progressive benefit estimation) (+1 more)

### Community 17 - "Act 1 ALM Skeleton"
Cohesion: 0.22
Nodes (9): ALM wireframe skeleton screen (isometric tilt, state 1), ALM wireframe skeleton screen (faded, shifted tilt, state 2), Right rail of stacked cards, Search bar with IBM Business Partners filter chip, IBM Maximo Application Suite Operational dashboard screenshot, KPI tiles (PM Performance, EM Work with no Downtime, Overdue work orders), Selected KPI comparison bar chart, Quick actions panel (+1 more)

### Community 18 - "Case Study Narrative Arc"
Cohesion: 0.29
Nodes (7): IBM Maximo Pricing Estimator redesign case study (notes outline), Featured vs Read-more case study card tiers, Reflection (learn: when to use AI vs Figma; be honest), IBM Maximo Pricing Estimator case study (draft), Headline: 60% faster deal time within 3 months of launch, Reflection (Phase 1 is prerequisite; admin tool for AppPoints rates; open questions), Role, team, timeline (UX Designer, Feb-May 2026, private preview Sept 2026)

### Community 19 - "Maximo Dashboard Screenshots"
Cohesion: 0.47
Nodes (6): IBM Maximo Application Suite Manage (legacy operational dashboard UI: dark left icon rail, KPI chart, KPI tiles, Quick actions), Skeleton wireframe with search chip 'IBM Business Partners', AI sparkle/favorite/bell/help/KT avatar header, left rail, main content blocks and right-hand card column, Maximo Operational Dashboard screenshot (1x, tilted), Maximo Operational Dashboard screenshot (4x export, tilted), Skeleton wireframe of IBM Business Partners page (4x, variant 1-1), Skeleton wireframe of IBM Business Partners page (4x, variant 1-2, cropped/faded)

### Community 20 - "Seller Pain Points"
Cohesion: 0.33
Nodes (6): Business metrics (10k hours wasted, 60% faster time-to-deal, 6mo-2yr deals), Stakeholders: Sellers, PMs, Approvers, CSEs, Layered tooling (Excel, Sales Cloud, Salesforce CPQ, Slack, email, Gainsight), Pain-point numbers (10,000+ hrs, 3-6 mo proficiency, 3 iterations, 9mo-2yr cycle), 15-seller usability validation, Seller shadow tools

### Community 21 - "Act 1 Stage Frames"
Cohesion: 0.53
Nodes (6): IBM Maximo Application Suite Operational dashboard (KPI comparison, PM Performance, Quick actions), ALM 1-1: grey skeleton wireframe of page with right sidebar cards (tilted), ALM 1-2: grey skeleton wireframe of page, more steeply tilted/faded, Act 1 Stage 41-30: tilted wireframe skeleton of IBM Business Partners page, Act 1 Stage 52-524: Maximo Operational dashboard rising over wireframe skeleton, Greyscale skeleton wireframe UI (search bar, left nav rail, content blocks, right sidebar cards)

### Community 22 - "Capabilities Scene Code"
Cohesion: 0.53
Nodes (5): bx(), make(), update(), polyD(), rectPts()

### Community 23 - "Affinity Research Insights"
Cohesion: 0.67
Nodes (3): Five affinity clusters (AppPoints Confusion, Tool Fragmentation, Shadow Tools, Seller Trust and Control, Approval Bottleneck), Screen 4 - Affinity Map from Seller Research, Research: 12 interviews (8 sellers, 4 CSEs)

### Community 24 - "Hero Transition"
Cohesion: 0.67
Nodes (3): Hero section (Figma 82:8717), Hero to stage transition (HeroTransition), intro-under (fixed first scene frame beneath hero)

## Ambiguous Edges - Review These
- `Step 2: Draft using chosen format` → `Growth Design slide sequence`  [AMBIGUOUS]
  slide-template.md · relation: conceptually_related_to
- `Decision Log format` → `Tiffany Eaton (Spotify, Dropbox) portfolio pattern`  [AMBIGUOUS]
  design-portfolio-guide.md · relation: conceptually_related_to

## Knowledge Gaps
- **93 isolated node(s):** `Phase 2: Design the blueprint look`, `Phase gates (Gate 0, 1, 3)`, `story.js single source of truth`, `Split-screen layout (stage left, text right)`, `Four-axis beat scoring (technical, aesthetic, story, experience)` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 134 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `m-goat/index.html (M-GOAT case study page)` connect `Morph Catalog & Story Contract` to `Capabilities Scene Code`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `Phase 2: Design the blueprint look`, `Phase gates (Gate 0, 1, 3)`, `story.js single source of truth` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Scene Template & Keyframes` be split into smaller, more focused modules?**
  _Cohesion score 0.0596078431372549 - nodes in this community are weakly interconnected._
- **Why does `Story contract (doc)` connect `Morph Catalog & Story Contract` to `Choreography Directions & Pacing`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Should `Portfolio Guidance & Skill Meta` be split into smaller, more focused modules?**
  _Cohesion score 0.0664451827242525 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Step 2: Draft using chosen format` and `Growth Design slide sequence`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Decision Log format` and `Tiffany Eaton (Spotify, Dropbox) portfolio pattern`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._