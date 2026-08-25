<!---
title: Nutrien: Designing the Information Architecture of a Sprawling Platform
template: case-study
published: true
unlisted: true
categories: ux design, agriculture, user research
thumbnail: https://adrian3.com/imgs/case-studies/images/Nutrien-Information-Architecture/nutrien-information-architecture_thumb.jpg
thumbnail-alt: Nutrien: Designing the Information Architecture of a Sprawling Platform thumbnail
--->

# Nutrien: Designing the Information Architecture of a Sprawling Platform

**Role:** Senior UX Designer, Nutrien Ag Solutions
**When:** 2019
**Team:** A UX team of 12 designers and researchers
**Focus:** The Employee Experience Hub (EXH) — navigation & information architecture

![A crop consultant crouched in a field, working on a tablet — the person every navigation decision had to serve.](https://adrian3.com/imgs/case-studies/images/Nutrien-Information-Architecture/01-field-hero.jpg)

## Introduction

As the Employee Experience Hub (EXH) grew, it accumulated everything a crop consultant might need — agronomy tools, sales reporting, customer accounts, a product catalog, weather, and more. The risk with a platform that big is that its navigation quietly becomes a junk drawer: technically complete, practically unusable. Before that happened, I ran a research study to answer a deceptively hard question — *where does everything go?* — and to make sure the answer reflected how crop consultants actually think, not how our org chart or database happened to be structured.

## 1. The Problem

### Two questions, one navigation

The work had two goals. First, **structure**: organize EXH's content into top-level categories that matched users' mental models. Second, **language**: validate that the labels we used were the words crop consultants actually use. Get either wrong and people "hunt" for things — exactly the frustration we were trying to eliminate.

## 2. The Method

### Triangulating with a card sort, a tree test, and a survey

No single method tells the whole story, so I triangulated three with **12 crop consultants** over October and November 2019. A **closed card sort** (22 cards sorted into category buckets) surfaced the group's mental model. For the items that had no obvious home, a **tree test** (asking people to navigate to where they'd expect to complete a task) and a **survey** (probing what an item meant and where it belonged) resolved the ambiguity. I analyzed the results with dendrograms — which show how strongly participants grouped items together — and results grids that show the percentage of people who filed each card under each category.

![The card-sort results grid: each row a card, each column a category, each cell the share of participants who placed it there — e.g., Documents 100% "Other," Approve Fields 75% Agronomy, Chemical/Fertilizer 92% Products, Weather cards 100% Weather.](https://adrian3.com/imgs/case-studies/images/Nutrien-Information-Architecture/02-card-sort-results.png)

## 3. What Was Clear

### The backbone the data confirmed

Much of the structure came back with strong consensus, which let us lock the backbone with confidence. **Products** was unambiguous — Chemical, Seed, and Fertilizer all landed there at 92–100%. **Weather** earned its place as its own top-level category (100% agreement, including its child pages). **Accounts** clearly owned Account Info and Account Home (92–100%), and **Sales** clearly owned Total Sales, Sales by Shelf, Proprietary Sales, and Purchase History (83–100%). When users agree this strongly, the designer's job is simply to get out of the way.

## 4. What Was Hard

### The ambiguous items — and how the evidence resolved them

The real work was the handful of items that had no clear home. Card-sort percentages alone weren't enough, so this is where the tree test and survey earned their keep:

- **Approve Fields** belonged under **Agronomy**, not Accounts — 75% in the card sort, and a clinching survey insight: *everyone who defined the term correctly* put it under Agronomy. The confusion was about meaning, not placement.
- **Purchase History** (83%) and **Edit Farms** (67%) both moved out of Accounts — to **Sales** and **Agronomy** respectively.
- **Application Services** and the **Grower's Shopping Cart** genuinely split between two categories. Rather than force a single home, the honest answer was to **cross-list** them — Application Services under both Agronomy and Products; the cart under both Sales and Accounts.
- **Documents** was a true black sheep: 100% of participants dumped it in "Other." The tree test and survey showed people would hunt for quotes and contracts under *both* Sales and Accounts — so that's where it lives, keeping the label "Documents."
- **Input Programs** confused nearly everyone; the survey revealed people expected the words *"crop planning,"* so I renamed it to match their language.

![A tree-test result for "Application Services" — the paths participants actually took to find it, revealing it needed to live in more than one place.](https://adrian3.com/imgs/case-studies/images/Nutrien-Information-Architecture/03-tree-test.png)

## 5. The Outcome

### Five categories that matched the user's mind

The research produced a navigation model organized around five top-level categories that mapped to how crop consultants think — **Agronomy, Sales, Accounts, Products, and Weather** — with each item placed by evidence, a few deliberately cross-listed where users genuinely expected them in two places, and labels validated or renamed to match real terminology.

## Conclusion

Good information architecture isn't about where something logically "belongs" in a database or on an org chart — it's about where a user will instinctively look for it. By triangulating a card sort, a tree test, and a survey, I turned EXH's navigation from a matter of internal opinion into a matter of evidence. And the research was honest enough to admit the most useful truth of all: sometimes the right answer is that a thing belongs in two places at once.
