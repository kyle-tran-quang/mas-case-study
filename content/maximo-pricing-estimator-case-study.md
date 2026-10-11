# IBM Maximo Pricing Estimator
**Redesigning the quote-to-close workflow for enterprise sellers**

**Role:** UX Designer — owned research, end-to-end design, and seller validation  
**Team:** 3 PMs, 1 Lead Designer, 15 sellers (validation)  
**Timeline:** Feb–May 2026 · Internal tool · Private preview Sept 2026

---

> **60% faster deal time within 3 months of launch.**  
> Built by eliminating the process where the seller *was* the integration.

---

## Before — A broken workflow held together by people

IBM Maximo Application Suite (MAS) runs asset management for some of the world's largest enterprises. Its pricing model—built on a currency called **AppPoints**—stops deals before they start.

AppPoints convert user types and modules into abstract point values before translating to dollars. A technician isn't $20 a month. She's 2 AppPoints, and 1 AppPoint is $10. Clients don't follow it. Sellers struggle to explain it.

> *"3 clients are like, we don't like AppPoints. They don't make sense to us. Why are you doing this? Why is this so complicated? It's another level of abstraction—instead of just saying the technician costs $20 a month, it's the technician is 2 AppPoints and 1 AppPoint equals $10."*  
> — Interview 1

<!-- 📸 Visual: Screenshot of the IBM.com pricing page -->
<!-- Caption: "Too simple or too complex at the same time" — what clients actually saw -->

The quoting tool compounded it. The AppPoints Calculator was a versioned Excel file emailed between teams, requiring manual copy-paste into CPQ, manual approval routing, and manual version control across Slack, email, and Salesforce.

<!-- 📸 Visual: Screenshot of the Excel AppPoints Calculator (redacted) -->
<!-- Caption: The tool most sellers avoided showing clients entirely -->

> *"It is a hot mess. I do not show the pricing calculator to the clients at all... There's no integration between systems right now. The integration is me."*  
> — Interview 4

<!-- 📸 Visual: Quoting chain diagram -->
<!-- Show: Seller → PM → Approver → CSE → Customer (5 handoffs, with tool labels: Excel, CPQ, Slack, email, Salesforce) -->

### The numbers

| Pain point | Data |
|---|---|
| Hours wasted per year | **10,000+** (projected) |
| Time for a seller to become proficient | **3–6 months** |
| Average quote iterations back and forth | **3 iterations** |
| Sales cycle from nurture to close | **9 months–2 years** |

Every seller built their own shadow tools—custom calculators, questionnaires, scoping decks—because the official one was too complex to share with clients.

> *"Every seller sort of has to do it on their own right now. They'd like to not have to do that."*  
> — Interview 1

---

## After — Two phases toward a single source of truth

### Phase 1 — AI chatbot (Feb–May 2026, private preview Sept 2026)

<!-- 📸 Visual: Final chatbot UI screens (2–3 key states) -->
<!-- Show: the guided, step-by-step flow — not a freeform chat box -->

Phase 1 gives the seller a guided, interview-style workflow: answer questions about the client's roles and environment, and the system maps licenses and generates a CPQ-ready quote automatically. No manual copy-paste. No outdated spreadsheet versions.

Key outcomes so far:

- **95% of quotes approved in ≤ 2 hours** by the L0 approval team
- Integrated into watsonx Workshop
- Exports a formatted Excel quote ready for sharing
- Eliminates manual part number re-entry into CPQ

*Status: Under development · Private preview Sept 2026*

### Phase 2 — Unified pricing estimator (planned)

<!-- 📸 Visual: Estimator concept screens — the unified workflow -->
<!-- Show: one tool replacing Excel calculator + CPQ payload + manual handoff -->

Phase 2 replaces the full fragmented stack—Excel, CPQ, Slack, email—with a single AI-powered workflow covering pricing, costing, and provisioning configuration.

Estimated impact:

| Improvement | Target |
|---|---|
| Seller + approver time per quote | **Under 30 minutes** |
| SRE configuration review | **As little as 15 minutes** *(was 1–2 days; scales with deal complexity)* |
| Deal time improvement | **60% faster** *(confirmed, 3 months post-Phase 1)* |

<!-- 📸 Visual: Before/after side-by-side -->
<!-- Left: AppPoints abstraction layers → Right: plain dollar-cost summary output -->

---

## Bridge — How the solution came together

### Research: 5 seller interviews → 15-seller validation

I ran 5 in-depth interviews across the sales org—SMEs, ecosystem leaders, global sales, and MREF sales. Clients don't care about AppPoints. They want to know what they're paying and what they get.

> *"Most of our customers are actually confused at just what an AppPoint is, much less the pricing calculator."*  
> — Interview 2

<!-- 📸 Visual: Affinity map or key themes wall from seller interviews -->
<!-- Show research synthesis, not just the output — 4–5 labeled clusters -->

I validated directions with 15 sellers before the first build locked in.

### The concept I ruled out—and why it mattered

The obvious answer was to connect everything: sync Excel, CPQ, Salesforce, and Gainsight into one integrated system. I explored it, then ruled it out.

Productizing a cross-system integration at IBM takes 1–2 years. Sellers already had too many tools. Another one—however clever—risked ending up unused.

<!-- 📸 Visual: Concept comparison — "interconnected platform" vs. "guided estimator" -->
<!-- Show two rough concept directions with annotation on why you chose simplicity -->

> *"Simple is enough. Adhering to the goal—giving the seller a quote they can share—is enough."*

### The constraints that shaped the solution

- **Legacy stack**: Excel → CPQ payloads → Salesforce → Slack → email—not replaceable overnight
- **Approval process**: Quotes still require human review; the goal was speed, not removal
- **Seller trust**: Most sellers had built their own shadow tools. The new tool had to feel *simpler*, not more powerful
- **Carbon Design System v11**: Used throughout to align with IBM product standards and reduce design debt

<!-- 📸 Visual: Carbon v11 component usage annotated on a key screen -->
<!-- Show intentional component choices — e.g. progressive disclosure for AppPoints, form structure -->

---

## Reflection

**What I learned:**
Phase 1 is a prerequisite, not a product. The guided flow validates the question logic that Phase 2's auto-populated calculator depends on. But it ships with a real UX debt: any edit to a pricing estimate means starting over from scratch—the first thing Phase 2 needs to fix.

IBM also taught me that design decisions have to survive months of alignment meetings and handoffs you can't predict. Build for longevity, not speed.

**What I'd do differently:**
AppPoints are still the engine under every calculation. I'd push earlier for an admin tool that lets executives update AppPoints-to-currency rates without engineering involvement—because the simplicity on the front end is only as reliable as the mapping behind it.

**What I'd still explore:**
If the pricing model ever moves away from AppPoints entirely, what does the estimator look like when the abstraction layer is gone?

---

## Visual checklist

| # | Visual | Section |
|---|---|---|
| 1 | IBM.com pricing page screenshot | Before |
| 2 | Excel AppPoints Calculator (redacted) | Before |
| 3 | 5-step quoting chain diagram | Before |
| 4 | Affinity map from seller research | Bridge |
| 5 | Concept comparison: platform vs. estimator | Bridge |
| 6 | Chatbot UI — 2–3 guided flow screens | After Phase 1 |
| 7 | Unified estimator concept screens | After Phase 2 |
| 8 | Before/after: AppPoints → dollar summary | After |
| 9 | Carbon v11 annotated screen | Bridge |
