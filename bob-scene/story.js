/* =========================================================================
   STORY: the single source of truth for the timeline.
   - range / snap / theme / title drive BOTH halves (scene engine and text column).
     (snap = the beat's anchor: where its text is centred, and the pose used for reduced motion.)
   - heading / body is the right-hand copy: 1-2 sentences per scene. Restyle or replace it freely.
   - motion is a one-line note on what the left side does in this beat (documentation only).
   Copy status: DRAFT. Rationale written by the agent from the designs, not from research.
   No metrics, quotes or names are used. Replace before publishing.
   ========================================================================= */
window.STORY = {
  id: "ibm-bob-concept-1",
  title: "IBM Bob, concept 1 (Carbon v12)",
  scrollVh: 700,              // total scroll distance in viewport heights (~100vh between story beats; recruiter-friendly)
  mode: "continuous",         // "continuous" scrubs seamlessly with scroll; "snap" adds soft snapping to beat.snap anchors
  beats: [
    {
      id: "blueprint", range: [0.00, 0.0514], snap: 0.0257, theme: "light", title: "Blueprint",
      heading: "Start with the parts, not the pixels",
      body: "Before styling anything, the concept is split into the few pieces a first-time user actually needs: a side nav, one workspace, and three starting points.",
      motion: "Outlined slabs float apart in isometric, each tagged with its real name and size."
    },
    {
      id: "assemble", range: [0.0514, 0.1714], snap: 0.1457, theme: "light", title: "Assemble",
      heading: "Assembled from Carbon v12",
      body: "Every piece is a Carbon v12 component, laid down shell first, so the new Bob inherits IBM's spacing, type and accessibility instead of reinventing them.",
      motion: "Pieces land layer by layer: shell, panels, then the small components, while the camera orbits slowly."
    },
    {
      id: "resolve", range: [0.1714, 0.2914], snap: 0.2657, theme: "light", title: "Resolve",
      heading: "A calm first screen for new users",
      body: "A blank prompt box is intimidating for non-technical users, so the page asks one plain question and offers three suggested starts. No jargon is needed to begin.",
      motion: "The camera eases flat and the outlines cross-fade into the real design, then hold."
    },
    {
      id: "expand", range: [0.2914, 0.4886], snap: 0.4714, theme: "light", title: "Variation",
      heading: "Show the choice, don't just name it",
      body: "A variation grows the three starter cards into large previews so novices can see what each path does before they pick one, and moves the prompt to the bottom where chat users expect it. Hovering a project reveals a plain-language \"Create a new agent\".",
      motion: "Pieces lift apart, the cards grow in place, the prompt slides down and widens, and the folder menu falls away. A cursor then taps the project's + and the tooltip pops in."
    },
    {
      id: "code", range: [0.4886, 0.66], snap: 0.6429, theme: "dark", title: "Bob Code",
      heading: "Same shell, a workspace for builders",
      body: "The mode toggle that switched chat on day one now opens Bob Code, with a file explorer and two side-by-side editors for technical users. Because it keeps the same Carbon shell, both modes feel like one product.",
      motion: "The chat pieces drop away, the toggle slides up into a new top bar, and the content panel splits into two editors beside a file explorer."
    },
    {
      id: "assistant", range: [0.66, 0.8571], snap: 0.8229, theme: "dark", title: "Assistant",
      heading: "Ask Bob without leaving the code",
      body: "When a builder needs help, the second editor folds into a chat panel beside the code, so the assistant stays one click away and the file never loses focus.",
      motion: "No blueprint: a cursor taps the chat button, the right editor shrinks into a panel, and the greeting, recent activity and prompt appear inside it."
    },
    {
      id: "switch", range: [0.8571, 1.00], snap: 0.98, theme: "dark", title: "Switch",
      heading: "One click back to chat",
      body: "The same toggle that opened Bob Code switches straight back to chat, so going between building and asking never means leaving the product. Chat keeps an Actions panel beside the conversation for the next step, like committing to GitHub or drafting a PR.",
      motion: "No blueprint: a cursor clicks the chat side of the toggle at the top left, the code editors give way to the conversation, and the toggle slides to its chat position."
    }
  ]
};
