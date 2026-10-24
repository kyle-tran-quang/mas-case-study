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

### Why the quote is hard to get right

The quoting process is sophisticated, and for real reasons. A Maximo quote isn't a price lookup. It's a sizing exercise with several variables moving at once:

- **Point count depends on who, how, and what.** AppPoints draw from one shared pool. The draw depends on user tier (Limited, Base, Premium), access type (authorized, concurrent, admin), the applications each user touches, and the environments installed.
- **Points are consumed on different rules.** Authorized users take points when they're created. Concurrent users take them only while logged in. Installs take them permanently once activated. The seller models all three.
- **Two delivery models price differently.** Customer-managed licenses and SaaS carry separate part numbers. SaaS is charged hourly by activated capability and business-value metrics, not seats alone.
- **Deal type changes the math.** New deals, renewals, and trade-ups from legacy Maximo products follow different rules. Trade-ups require active support on the products being surrendered, and non-standard pricing goes through the MAS project office.
- **Editions sit on top.** Essentials is an entry-level package set, and Standard opens the full Maximo portfolio. The same customer can price very differently depending on which they choose.

None of this was the problem to remove. It was the complexity the new tool had to hold *for* the seller.

<!-- Sources (product-knowledge MCP):
  Public: ibm.com/docs/en/masv-and-l/cd?topic=overview-licensing-in-maximo-application-suite · ibm.com/products/maximo/pricing
  Internal (Seismic, not client-shareable): "Maximo Application Suite AppPoint Calculator – Details – New Deal"; MAS enablement/seller decks on AppPoint usage
  Confidentiality: calculator uplift percentages and pricing guidance are IBM-internal. Keep specific figures out of the public portfolio. -->

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

## After — Three phases toward transparency and speed

### Phase 1 — AI chatbot (Feb–May 2026, private preview Sept 2026)

<!-- 📸 Visual: Final chatbot UI screens (2–3 key states) -->
<!-- Show: the guided, step-by-step flow — not a freeform chat box -->

I took part in designing the chat interface on watsonx Orchestrate, focused on giving the seller a guided, interview-style workflow: answer questions about the client's roles and environment, and the system maps licenses and generates a CPQ-ready quote automatically. No manual copy-paste. No outdated spreadsheet versions.

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

### Phase 3 — Public pricing experience on ibm.com (exploratory prototype)

While Phase 1 and Phase 2 focus on fixing the seller-side quoting workflow internally, the disconnect actually starts much earlier—on the public web.

On the live [Maximo pricing page on ibm.com](https://www.ibm.com/products/maximo/pricing), the experience doesn't explain how licensing or AppPoints work. Instead, it surfaces technical line items and add-on jargon—such as "additional users," "non-production environments," and isolated module names—without providing any context on what a team actually needs to run their operations. Prospective buyers leave confused, unable to self-qualify, and enter sales conversations completely unprepared for how Maximo is sized.

I designed an exploratory concept prototype to reimagine the public pricing experience, transforming it from a static list of technical add-ons into a guided, self-service estimator.

<!-- 🎥 Video: Interactive walkthrough of the redesigned ibm.com pricing prototype -->
<!-- Prototype link: https://solid-neo-33857599.figma.site/ -->
<!-- Caption: Interactive walkthrough showing guided role-based sizing and live cost estimation for prospective buyers on ibm.com -->

---

#### Before vs. after: Key improvements

##### 1. Technical add-on jargon vs. role-based team sizing

<!-- 📸 Visual side-by-side: Technical module list vs. role-based team selector -->
<!-- Left (Before): Opaque add-ons ("non-production environment", "additional users") -->
<!-- Right (After): Plain-language role selectors (Technicians, Operations managers, Admins) -->

- **Before:** Confronts users with technical line items like "non-production environments" and unguided user add-ons with zero explanation of why or when they are needed.
- **After:** Grounds estimation in operational reality—users simply specify the number of field technicians, operations managers, and administrators they have, and the tool handles the licensing logic behind the scenes.

##### 2. Static tier cards vs. dynamic self-service estimation

<!-- 📸 Visual side-by-side: Static pricing cards vs. dynamic live cost summary -->
<!-- Left (Before): Static "Essentials" vs. "Standard" cards pushing to "Contact sales" -->
<!-- Right (After): Live recalculating cost breakdown with transparent tier options -->

- **Before:** Presents static cards with starting prices that do not reflect real enterprise deployment scale, forcing users into an immediate "Contact sales" dead-end.
- **After:** Provides an interactive calculator that recalculates estimated monthly and annual investment in real time as users adjust team size, edition, and capabilities.

##### 3. Disjointed module lists vs. clear capability mapping

<!-- 📸 Visual side-by-side: Opaque SKU list vs. clear capability breakdown -->
<!-- Left (Before): High-level feature bullets that obscure what is actually included -->
<!-- Right (After): Modular capability selector showing what each edition unlocks and what is optional -->

- **Before:** Glosses over how different applications fit together, leaving buyers guessing which capabilities belong in Essentials vs. Standard.
- **After:** Clearly maps business capabilities (asset monitoring, predictive maintenance, visual inspection) to package editions with plain-language explanations.

##### 4. Static wall-of-text FAQs vs. context-aware suggested FAQs

<!-- 📸 Visual side-by-side: Long static FAQ list vs. dynamic suggested FAQ cards -->
<!-- Left (Before): Exhaustive, generic accordion list requiring heavy scrolling -->
<!-- Right (After): Contextually relevant questions suggested based on the user's active choices -->

- **Before:** Dumps a lengthy, monolithic FAQ accordion at the bottom of the page, forcing prospects to hunt through dense walls of enterprise text.
- **After:** Surfaces suggested, context-aware FAQs that dynamically adapt based on what the user selects in the estimator (such as edition, team size, or capabilities)—reducing cognitive overload by answering the right questions at the moment of evaluation.

##### 5. Dense data overload vs. progressive benefit estimation

<!-- 📸 Visual side-by-side: Overwhelming data-dense calculator vs. progressive value estimator -->
<!-- Left (Before): Monolithic calculator displaying dozens of simultaneous variables and figures -->
<!-- Right (After): Step-by-step progressive disclosure focusing on key business outcomes -->

- **Before:** Laid out dozens of numbers and variables all at once with the unrealistic assumption that users could digest them at a glance, resulting in data overload rather than clear ROI.
- **After:** Guides users through progressive disclosure, breaking the calculation into digestible steps and focusing output numbers directly on the tangible business value Maximo delivers (such as downtime reduction, maintenance savings, and technician productivity).

---

| Dimension | Before ([ibm.com pricing page](https://www.ibm.com/products/maximo/pricing)) | After ([interactive concept prototype](https://solid-neo-33857599.figma.site/)) |
|---|---|---|
| **Sizing model** | Raw technical line items ("non-production environments", "additional users") | Role-based inputs translated into practical licensing requirements |
| **Cost estimation** | Static tier cards forcing an immediate "Contact sales" form | Interactive self-service estimation with real-time recalculation |
| **Capability clarity** | Disjointed feature bullets with unclear boundaries between tiers | Plain-language mapping of operational capabilities to package editions |
| **Benefit & ROI estimation** | Monolithic grid of numbers causing analysis paralysis | Step-by-step progressive disclosure focusing on potential business value |
| **FAQ & guidance** | Lengthy static accordion creating cognitive overload | Dynamic, context-aware FAQs suggested based on active user selections |
| **Sales handoff** | Cold handoff; seller spends early calls clarifying basic terminology and pricing | Warm handoff; prospect enters sales calls already aligned on baseline sizing |

> **Side note / Prototype disclaimer:**
> The redesigned pricing page is an exploratory vision prototype created to demonstrate how IBM could communicate value and pricing transparency to prospective clients. It does not claim to fully resolve the underlying AppPoints licensing complexity, which remains a systemic product and business challenge. Rather, it explores how thoughtful UX can bridge the gap between complex enterprise licensing models and clear buyer comprehension.

---

## Bridge — How the solution came together

### Research: 12 interviews → 15-seller validation

I ran in-depth interviews with **8 sellers** (SMEs, ecosystem leaders, global sales, and MREF sales) and **4 Customer Success Engineers (CSEs)**, who see the quote from the other side of the handoff. Clients don't care about AppPoints. They want to know what they're paying and what they get.

> *"Most of our customers are actually confused at just what an AppPoint is, much less the pricing calculator."*
> — Interview 2

<!-- 📸 Visual: Affinity map or key themes wall from seller interviews -->
<!-- Show research synthesis, not just the output — 4–5 labeled clusters -->

**The insight that shaped Phase 1:** sellers didn't want a freeform chatbot. They wanted something that would let them *control the quote*. The quote carries their name and goes to an approver, so an unstructured conversation was the wrong shape. A guided flow with structured inputs and clear guardrails was the right one.

#### Validation with 15 sellers: From shadow tools to confidence

Before moving to production, I conducted task-based usability walkthroughs with **15 sellers** across North America, EMEA, and APAC, testing realistic enterprise quoting scenarios (new deals, trade-ups, and mixed authorized/concurrent user pools).

The validation focused on three core questions:
1. Could sellers generate an accurate, CPQ-ready quote in under 10 minutes?
2. Did sellers feel confident enough in the output to show it to clients and approvers?
3. Would this eliminate their reliance on custom shadow spreadsheets?

<!-- 📸 Visual: Usability validation matrix / seller feedback quotes board -->
<!-- Show: Task completion rates and key feedback themes from the 15-seller validation round -->

The response was an overwhelming shift in confidence. Sellers immediately recognized that the tool handled the complex AppPoints math under the hood without forcing them to manually debug formulas or reconcile version conflicts.

> *"I don't have to second-guess whether I broke a macro or entered an outdated part number. I can actually run through this on a call with a client and generate a clean quote in minutes instead of spending my weekend debugging formulas."*
> — Seller Validation Session 6

> *"This completely replaces the cheat sheet spreadsheet I built two years ago. It gives me the numbers I need without making me fight the tool."*
> — Senior Enterprise Seller, Validation Session 11

### The concept I ruled out—and why it mattered

The obvious answer was to connect everything: sync Excel, CPQ, Salesforce, and Gainsight into one integrated system. I explored it, then ruled it out.

Productizing a cross-system integration at IBM takes 1–2 years. Sellers already had too many tools. Another one—however clever—risked ending up unused.

<!-- 📸 Visual: Concept comparison — "interconnected platform" vs. "guided estimator" -->
<!-- Show two rough concept directions with annotation on why you chose simplicity -->

> *"Simple is enough. Adhering to the goal—giving the seller a quote they can share—is enough."*

### The constraints that shaped the solution

- **Pricing sophistication**: AppPoint math varies by user tier, access type, application, install, delivery model (customer-managed vs. SaaS), and deal type (new, renewal, trade-up). The tool had to carry that logic without exposing it
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
The seller workflow inside the enterprise environment. The estimator fixes the quote, but the quote is one step in a longer chain: seller, PM, approver, CSE, customer, spread across Excel, CPQ, Salesforce, Slack, email, and Gainsight. Each handoff has its own owner, its own tool, and its own version of the truth. That's where the 3 quote iterations and the 1–2 day SRE reviews come from, and it's where sellers' shadow tools came from too.

I scoped to the workflow because I couldn't boil the ocean on AppPoints. Changing the model touches licensing rules, part numbers, CPQ payloads, and executive-owned rate mappings, and I don't control any of those. The seller's workflow was the part I could change without waiting on them.

The questions I'd pick up next:
- Where does a quote actually stall: in the handoffs, the approval queue, or the rework after a change?
- Which of the shadow tools do sellers rely on, and what does that say about gaps in the official flow?
- How does the workflow differ by deal type (new, renewal, trade-up) and by seller experience, given the 3–6 months it takes to become proficient?
- What would it take for approvers and CSEs to work from the same quote record instead of passing files?

And the question I parked: if the pricing model ever moves away from AppPoints, what does the estimator look like when the abstraction layer is gone?

---

## Visual checklist

| # | Visual | Section |
|---|---|---|
| 1 | IBM.com pricing page screenshot | Before |
| 2 | Excel AppPoints Calculator (redacted) | Before |
| 3 | 5-step quoting chain diagram | Before |
| 4 | Affinity map from seller research | Bridge |
| 5 | Usability validation matrix / feedback board (15 sellers) | Bridge |
| 6 | Concept comparison: platform vs. estimator | Bridge |
| 7 | Chatbot UI — 2–3 guided flow screens | After Phase 1 |
| 8 | Unified estimator concept screens | After Phase 2 |
| 9 | Before/after: AppPoints → dollar summary | After Phase 2 |
| 10 | Public pricing prototype walkthrough video | After Phase 3 |
| 11 | Public pricing side-by-side visual comparisons (5 sets) | After Phase 3 |
| 12 | Carbon v11 annotated screen | Bridge |
