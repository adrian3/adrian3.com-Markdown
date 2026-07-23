<!---
title: Meet Max
sub-title: Designing Trust into AI
template: case-study
published: true
unlisted: true
categories: ux design, agriculture, ai and emerging technologies, user research
thumbnail: https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/nutrien-max-case-study_thumb.jpg
thumbnail-alt: Meet Max: Designing Trust into AI thumbnail
--->

# Meet Max: Designing Trust into AI

**Role:** Senior UX Designer, Nutrien Ag Solutions · **When:** 2019–2020 · **Team:** A UX team of 12 designers and researchers · **Focus:** The Employee Experience Hub (EXH)

![Max, the friendly robot persona, introducing himself: "Hi, I'm MAX. My artificial intelligence looks for opportunities to maximize your experience within the employee portal."](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/05-max-intro.png)

_This project wrapped up around 2019 and 2020 — a couple of years before ChatGPT put AI in front of everyone. We had no large language models to work with, but we already had the problem that now defines them: how do you get an expert to trust a system that is sometimes confidently wrong?_

## Introduction

As a Senior UX Designer at Nutrien Ag Solutions, I worked on the Employee Experience Hub — "EXH" for short — the platform used by Nutrien's sales force of more than 20,000 crop consultants, alongside a UX team of 12 designers and researchers. Part of that work was bringing machine-learning recommendations into the tool. We built a data engine, called **Deep Green**, to generate the recommendations, and we gave its output a face: a friendly character named **Max**. This is the story of what designing Max taught me about the user experience of AI, well before that became everyone's problem.

## 1. The Problem

### Asking experts to trust a machine

To understand why this was hard, you have to understand who the user is. Crop consultants are not order-takers. They know more about agronomy than many of the farmers they sell to, and a recommendation from a crop consultant lands more like a prescription from a doctor than a sales pitch. Those relationships span years, sometimes decades.

So when EXH began to evolve from a system that *recorded* what a consultant sold into one that *recommended* what they should sell next, we ran straight into a wall. We were asking deeply experienced experts to take advice from software — and they didn't trust it, partly because they didn't trust the data underneath it, and partly because being told what to do felt like a challenge to their expertise.

This is the AI trust problem in miniature, and it has not changed since. I heard it plainly when I sat with consultants in the field:

> _"Right now it really does me personally no good, because I can't extract the information all the way down to the final detail that I need."_

> _"The thing that drives me the most bonkers is that I don't have access to the answers… Give me access to real numbers. What did I sell it for? How much did I sell? What was my margin?"_

A few things came through over and over: consultants couldn't easily get at their own sales, margins, and crop history; the system reported gross numbers when they only cared about net; and the stakes were high enough that forgetting a single product could mean tens of thousands of dollars in lost sales. They didn't want a tool that graded them. They wanted one that had their back.

## 2. Field Research

### Listening before designing

I spent a lot of time in the field. I traveled to facilities to see them in action, sat in offices listening to sales calls, and rode along with crop consultants to watch how they actually got their work done. I listened to their frustrations and collected their ideas, then brought those stories back to the team so the people building EXH could picture the person they were building for.

![A field research session: crop consultants gathered around a conference table reviewing the platform on screen.](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/02-field-research.png)

This is where the core tension surfaced — one that anyone building AI products will recognize today. The better a crop consultant was, the more a bad recommendation could cost them, which meant the people we most wanted to help were also the ones with the most to lose if our model got it wrong. And our model *would* get things wrong; this was years before "hallucination" entered the product vocabulary, but the failure mode was the same. So I stopped asking "how do we make the recommendations perfect?" and started asking the more honest question that every AI team eventually faces: "how do we make an imperfect system worth engaging with — long enough to make it better?"

## 3. Deep Green and Max

### Separating the engine from the interface

Under the hood, **Deep Green** was the data engine. It was an experimental machine-learning product that mined Nutrien's enormous archive of historical sales data — one of the largest agronomic data sets in the world — to surface lost "opportunities" a busy consultant might otherwise miss. This was the kind of machine learning we were quietly using well before the AI boom made it fashionable. Deep Green was powerful, data-hungry, and completely invisible to the user.

**Max** was the part the consultant actually met. He was the user-facing layer that delivered Deep Green's recommendations in plain language, and gathered the responses that, over time, would make Deep Green smarter.

![System diagram: user-facing channels (web, iOS, email, notifications) send a query to the Deep Green engine, which analyzes Nutrien's data and returns a recommendation that Max delivers in plain language — with a feedback loop where user responses reinforce and improve the engine over time.](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/06-architecture-deep-green-max.png)

Splitting the system this way reflected a conviction I still hold, and one that matters more in the LLM era than ever: **users don't trust a model — they trust the interface wrapped around it.** Deep Green could be brilliant and still fail if Max felt cold, arrogant, or evasive. The model is where the intelligence lives; the interface is where trust is won or lost. That is as true for a chatbot answering questions today as it was for a recommendation engine in 2020.

I'll be honest about my own skepticism, because I raised it with the team directly: a cartoon robot was never going to fix our trust problems by itself. But a little personality could help. A friendly, humble face buys patience — people forgive a helper for being wrong in a way they never forgive a faceless "system." A character also invites the interaction we needed to gather feedback. And anything that broke the stiff, corporate feel of an internal tool was worth trying.

Personality is a double-edged tool, though — a lesson the whole industry is relearning now that every AI product has a "voice." So I studied how others handle it. Clippy is the cautionary tale: personality with no usefulness becomes an interruption people resent. Mailchimp sits at the other end, using warmth and humor to *reward* you for finishing a task. The difference was never the mascot. It was whether the personality respected the user's time and intelligence.

![Clippy, the Microsoft Office assistant, asking "It looks like you're writing a letter. Would you like help?" — the cautionary tale of personality without usefulness.](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/09-mascot-clippy.png)

![Mailchimp's friendly illustrated high-five confirming a campaign was sent — warmth that rewards finishing a task.](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/10-mascot-mailchimp.png)

## 4. Designing for Opportunities

### What a recommendation looks like — and how to argue with it

The unit of value in all of this was the *opportunity* — a specific, dollar-valued, explainable recommendation a consultant could act on, dismiss, or dig into. For consultants to take it seriously, it had to be concrete and, just as importantly, easy to push back on.

![A single opportunity card: "Theresa Hart — Fertilizer Opportunity. These growers purchase Bayer crop protection products from Nutrien Ag Solutions but do NOT buy seed from us…" with an estimated value of $100,000–$250,000 and Dismiss / Learn More buttons.](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/03-opportunity-card.png)

In the product, those opportunities lived inside the consultant's dashboard, alongside their sales activity, their growers, financials, and the weather — so Deep Green's recommendations showed up in the flow of real work rather than as a separate "AI feature" bolted on the side.

![The Employee Experience Hub dashboard: "Welcome back, Ryan," with a Sales Activity table, a Targeted Planning Opportunities widget surfacing Max's recommendations, opportunity alerts, a grower list, financials, and a weather forecast.](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/13-dashboard-in-context.png)

We introduced Max at the moment of recommendation, and we were deliberately honest about where the product stood — an alpha version, an open beta, feedback openly requested. The point was to set expectations rather than oversell. Years later I'd watch the best AI products do exactly this: tell people plainly that the system is new and can be wrong.

![The in-product welcome modal: "New: Personalized Recommendations — Alpha Version 0.1," explaining the beta program, with Max in the corner saying "Hi, I'm MAX. I look for opportunities to maximize your experience within the employee portal."](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/07-welcome-modal.png)

The most important interaction wasn't Max being right. It was making it effortless for a consultant to tell Max when he was *wrong*. Every correction became a piece of training data, and admitting the engine was still learning became part of the design itself. This is what we'd now call a human-in-the-loop feedback system — the same idea that, in a more sophisticated form, trains today's large language models. We were closing that loop in an ag-retail tool years before it had a fashionable name.

![Max's feedback prompt: "Can you tell us more? Our recommendation engine is not learning yet, but your feedback helps us improve what you see in the future," with reasons like "Timing is wrong" and "Not a valid recommendation."](https://adrian3.com/imgs/case-studies/images/Nutrien-Max-Case-Study/08-feedback-form.png)

## 5. What We Learned

### Authenticity and humility build trust

I didn't want to ship Max on a hunch, so we wrote the bet down as a testable hypothesis — *Max will foster forgiveness and encourage feedback* — and ran concept tests around it, comparing a version of the experience with Max against one without him. The point wasn't to find out whether people liked a cartoon. It was to learn whether a friendly, humble interface actually changed how forgiving people were of an imperfect engine, and whether it made them more willing to talk back to it. That instinct — treat the persona as a design variable to be tested, not a decoration to be argued about — is one I'd carry straight into the LLM era.

We took Max back to crop consultants to see how it landed. The reactions told the real story:

> _"I liked Max. It seemed friendly and open. I've got to a stage in my career where I don't like people telling me what to do. Without Max, that's what it felt like it was doing."_ — Steve Sackett, Crop Consultant

> _"I feel like we're on a journey where in three to five years we'll have tools more along the lines of what we're working toward here. I understand it takes steps to get there."_ — Bradford Smith, Crop Consultant

And the counter-voice that kept us honest:

> _"I'm too busy to waste my time with the digital platform. Agriculture is a lot more difficult than an algorithm thinks. Also, the robot on the screen is dumb."_

That tension was the lesson. The same friendliness that earned patience from one consultant read as condescension to another. What separated the two wasn't the cartoon — it was whether the tool was honest about its limits. Max worked when he let the product admit it was still learning, which turned the engine's biggest liability — imperfect early recommendations — into a relationship people were willing to invest in.

Two principles came out of it: **authenticity increases trust, and humility increases trust.** When you ask an expert to rely on a machine, the machine earns its place not by pretending to be right, but by being honest when it isn't.

## 6. Why This Still Matters

### The UX of AI is the UX of being wrong gracefully

When ChatGPT arrived and suddenly everyone was designing for AI, none of the hard problems were new to me. They were the Max problems, scaled up. A model that is confident and occasionally wrong. Users who need to know when to trust it and when to push back. The temptation to hide a system's limitations behind a slick, certain-sounding voice — and the trust you forfeit the first time it burns someone.

Designing Max left me with a few convictions I now apply to every AI product:

- **Trust is built in the interface, not the model.** No amount of accuracy survives an experience that feels arrogant or opaque. Deep Green needed Max, and a powerful model today still needs an interface that earns belief.
- **Design for the system being wrong, not for the demo.** The error path is the product. Make correction effortless, and every mistake becomes a chance to improve rather than a reason to quit.
- **Humility outperforms false confidence.** Telling users plainly that a system is new, limited, and learning earns more durable trust than pretending it is infallible.
- **Personality is leverage, and leverage cuts both ways.** A voice can invite people in or condescend to them. The deciding factor is whether it respects the user's expertise.

We didn't have the language of large language models when we built Max. But we were already designing for the thing that matters most in AI: not how smart the system is, but whether a real expert is willing to trust it. That question only gets more important from here.
