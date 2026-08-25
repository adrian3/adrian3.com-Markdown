<!---
title: Designing Observability
sub-title: UX Leadership at OpenText
template: case-study
published: true
unlisted: true
categories: ux design, it and tech industries, ai and emerging technologies, user research, journey maps and personas
thumbnail: https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/opentext-leadership_thumb.jpg
thumbnail-alt: Designing Observability: UX Leadership at OpenText thumbnail
--->

# Designing Observability: UX Leadership at OpenText

**Role:** Senior UX Designer, OpenText (formerly Micro Focus) 
**When:** 2022–2026 
**Focus:** OpScope — observability for IT teams and Site Reliability Engineers

![A data-dense OpScope service map — a network graph of interconnected microservices, color-coded by health, used to trace problems across a live system.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/01-service-map.png)

## Introduction

At OpenText I led the user experience for **OpScope**, a new observability product that helps IT professionals understand the health and performance of complex software systems. The work began under Micro Focus and continued after OpenText’s acquisition. But the part I’m proudest of isn’t a single screen — it’s the *leadership*: setting the UX strategy, defining who we were designing for, running the research that grounded our decisions, and producing the design “blueprints” that other teams built from. This case study is that story.

## 1. Thought Leadership: Why Observability?

### Setting a strategy the whole org could rally behind

Observability is a crowded, jargon-heavy space, so before designing screens I worked to align the organization on *why* we were building this and *what* great would look like. I framed the core problem with the old parable of the blind men and the elephant: every tool sees one part of system health — the application, the infrastructure, the network — but nobody sees the whole animal. True observability means seeing the complete picture.

![A strategy slide framing the problem as the blind-men-and-the-elephant — different roles each perceive only part of a system’s health.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/02-why-observability.png)

From that I set a deliberately audacious north-star goal: *anyone, regardless of their role, should be able to understand their system’s health within two clicks.* And I gave the strategy a mental model the team could design against — **lenses, or layers** — treating Application, Infrastructure, and Network as interdependent sub-systems (much like the body’s nervous and circulatory systems) that you inspect through different lenses but diagnose together.

![The “lenses” concept — Application, Infrastructure, and Network as three inspection lenses onto one interdependent system.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/03-lenses.png)

## 2. Knowing the User: The SRE Persona

### Designing for an emerging role

Observability is the domain of the **Site Reliability Engineer (SRE)** — a relatively new role built around modern practices like Open Telemetry. OpenText already had user personas, but they were rooted in legacy IT-management patterns. Because OpScope was betting on where the industry was *going*, I created a new, living SRE persona — built from interviews, empathy mapping, and a running list of the jobs, pains, and gains of the people doing this work — and made it the reference point for who we were designing for.

The work started from a clear hypothesis: **the audience for an observability product is fundamentally different from the classic ITOps personas the company already had.** Software had moved from monolithic applications to distributed microservices, which created a new problem — how do you measure the health of a system when its performance is scattered across dozens of services? Open Telemetry emerged as the technology to answer that, and the SRE emerged as the role. As Google’s Ben Treynor defined it, site reliability engineering is “what happens when you treat operations as a software problem and staff it with software engineers.” It’s Conway’s Law in action: new system architectures give rise to new kinds of teams — and new users to design for.

I gave the persona a name and a face — **Sam** — so the whole team could stop saying “the user” and start asking a sharper question: *what would Sam need here?*

![The SRE persona one-pager: Sam, with his description, pain points, motivations, typical tools, and the roles he interacts with.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/09-sre-persona.png)

Sam is a former developer whose role expanded into keeping revenue-critical systems running — the organization’s subject-matter expert on Open Telemetry, and the first person called when software breaks. He’s an early adopter who never wants to go back to the “monolithic” days, still thinks like a developer who cares about well-written code, and lives in tools like DataDog. The research also surfaced the pains that define his days — **alert fatigue, complex and unintuitive tools, legacy systems and tech debt, organizational silos, and the ambiguity of diagnosing problems no one has seen before** — all compounded by how new and fast-moving the SRE discipline still is. Capturing those pains, motivations, and tools in one shared artifact gave every designer, PM, and engineer the same mental model of exactly who we were serving.

I paired the persona with hypothesis-driven research, writing up emerging use cases (traces with thousands of spans, monolithic vs. microservice applications, database insights, auto-discovery) as testable hypotheses so the team designed for real, anticipated needs rather than assumptions.

![A research slide stating a new-use-case hypothesis — “Traces with thousands of spans” — with what it means and design recommendations.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/07-use-case-research.png)

## 3. Usability Testing at OpenText World

### Three years of research at the Innovation Lab

For three years running, I was part of the UX team that ran an **Innovation Lab at OpenText World in Las Vegas** — moderated usability testing with real customers during the company’s biggest annual event. It’s the largest, most organized research effort I’ve been part of: scripted tests, careful data capture, and findings formally presented to product teams afterward.

The 2023 lab was a clinic in why you test with real users. My seven participants spanned the real ITOps landscape — performance and principal engineers, an AiOps manager, an IT manager, an OpenText architect — and they handed me findings no internal review would have surfaced:

- **A persona reality check.** Almost none were yet working as SREs or familiar with Open Telemetry. The market was earlier than we’d assumed, which reframed a design problem as an *onboarding* one: the app expected users to arrive already fluent in Otel, and most didn’t.
- **A branding disconnect.** Users came looking for “OpScope,” but the interface said “Operations Bridge” — one even tried to *search* for OpScope to be sure he was in the right place.
- **A 100% failure rate.** Not a single participant could find the Event Summary page, hidden behind a “squiggly arrow” icon nobody recognized — a problem leadership suspected but the test made undeniable.

![A 2023 Innovation Lab findings slide on dashboards and workflows, with verbatim quotes — “I don’t like fluff.” — Richard Low, IT Manager — beside the screen being evaluated.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/08-usability-findings.png)

The value wasn’t just the bug list — it was returning with data *and* stories. When an IT manager says “I don’t like fluff” and an architect says the homepage “looks like a business screen talking about different products,” you have something that moves a roadmap in a way no backlog ticket can. (Tellingly, even with a documented 100% failure rate, the Event Summary fix lost its PI-planning priority battle — research gives you ammunition, but you still have to fight for the work.)

## 4. Competitive Research

### Bringing order to navigation

Navigation is the hardest information-architecture problem in observability, because these products sprawl. I ran a competitive analysis of how the leaders — Datadog, New Relic, Dynatrace — and our own Operations Bridge structured their navigation, and concluded that *nobody* was doing it well: huge item counts, deep nesting, confusing labels.

![A side-by-side comparison of the navigation menus of Datadog, New Relic, Dynatrace, and OpenText Operations Bridge.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/04-competitive-nav.png)

To bring order to it, I created a taxonomy of navigation entry types — primitive objects, product objects, domains, and actions — so the team could reason about the menu systematically instead of bolting on links ad hoc.

![A navigation taxonomy color-coding menu entries into Primitive Objects, Product Objects, Domains, and Actions.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/05-nav-taxonomy.png)

## 5. Design Blueprints and Data-Dense Interfaces

### A north star teams could build from

To turn all of this — strategy, persona, research — into shippable product, I produced detailed UX **blueprints**: comprehensive, high-fidelity designs that product and engineering teams used as the north star for development. They covered the hardest part of observability UX: making *data-dense* interfaces legible. Observability throws a flood of telemetry at the user, and the job is to turn that flood into status at a glance — the service map at the top of this case study, dashboards that surface red/yellow/green health, and detail views that let an engineer drill from a symptom down to its cause.

![An OpScope observability dashboard concept — Application, Infrastructure, and Network views with health gauges, trend charts, and event summaries.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/06-dashboard.png)

## 6. A Design Language for the Product: OpenSpace

### Giving the work a consistent, modern skin

Blueprints define *what* to build; a design language defines how it should *feel*. So I developed a visual system — internally codenamed **JATO** and presented as **”OpenSpace”** — to unify OpScope (and OpenText products beyond it) under one modern, confident look. The principles were deliberately restrained: **vibrant color used sparingly, motion and animation as a brand element, clear and beautiful data visualization, and elegant typography in service of intentional simplicity.** I gave it an aviation-inspired signature — a recurring **10° angle** and “Aviator” interaction patterns — so the brand showed up in the details, not just the logo.

![OpenSpace data screens — polished product dashboards in the new design language: a “Core DevOps Management” view with status metrics and charts beside a “Core Content Services” home screen with a colorful health gauge and recent activity.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/10-openspace-data-screens.jpg)

Crucially, the system shipped in both **light and dark mode** — I championed dark mode into the corporate design system, which matters for SREs who live in these tools during late-night incidents — and it carried a forward-looking **”Aviator Insights” AI assistant** for surfacing answers in context. It was the layer that made the strategy, persona, and research feel like one coherent, shippable product rather than a stack of documents.

![The OpenSpace design language shown across multiple product screens in light and dark mode, including an “Aviator Insights” AI assistant panel.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/11-openspace-dark-mode.jpg)

## 7. Innovation: A War Room in VR, and Health You Can Fly Through

### Betting on where observability is going

OpenText runs an annual innovation hackathon called **Innofest**, and my team carried a single idea through two of them. The question was simple and ambitious: what if the invisible health of a complex system became a *place* you could see and move through?

In **2022** we built a **VR proof of concept** — a virtual “ops war room” where a distributed team could gather during a 2 AM outage and troubleshoot system health together in a shared space. The following year we refined the concept and grounded it in real systems: the headset-first vision gave way to an interactive **3D force-graph** of service dependencies — health you could read at a glance and fly through — paired with a **”Network Aviator” AI assistant** for asking questions in plain language. The work earned recognition at Innofest two years running.

![A concept board showing the project’s maturity progression — from a 2D service-dependency graph (MVP) to dark mode, to a 3D motion graph, to a “Network Aviator” ChatGPT assistant, to a virtual-reality experience — labeled Basic Implementation → Additional Complexity → Emerging New Patterns.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/12-innofest-evolution.jpg)

![The “OpenText VR — Data Visualization Experience”: a person in a VR headset reaching out to manipulate floating data panels (Vertica, Magellan) against a dark, branded backdrop.](https://adrian3.com/imgs/case-studies/images/OpenText-Leadership/13-innofest-vr.jpg)

It’s the same conviction that runs through the rest of this work, aimed a few years downfield: take the dense, overwhelming reality of a live system and make it something a human can see, navigate, and trust.

That push toward AI/ML also surfaced the UX problem I care about most. Working with our data scientists, I kept returning to one principle: **trust is the primary driver of good UX in AI/ML products.** A model can flag an anomaly, but if the user can’t see *why* it’s anomalous, they’re left to fact-check and babysit the AI — and a tool meant to *reduce* work quietly creates more of it. It’s the same conviction behind [Max at Nutrien](Nutrien-Max-Case-Study.html), now pointed at observability: the intelligence may live in the model, but trust is won or lost in the interface.

## Conclusion

Leading UX for OpScope meant operating at every altitude at once: the strategic (“why observability, and what’s our audacious goal?”), the foundational (who is the SRE, and what do they actually need?), the empirical (three years of testing with real customers), and the concrete (blueprints and a design language detailed enough to build from). The thread connecting all of it was the same instinct that runs through my whole career — take something dense and overwhelming, understand the human on the other side of it, and make it clear.
