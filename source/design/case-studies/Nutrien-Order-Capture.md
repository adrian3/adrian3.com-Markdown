<!---
title: Decoupling Order Capture
sub-title: Designing a Tool That Competes With a Phone Call
template: case-study
published: true
unlisted: true
categories: ux design, agriculture, user research
thumbnail: https://adrian3.com/imgs/case-studies/images/Nutrien-Order-Capture/nutrien-order-capture_thumb.jpg
thumbnail-alt: Decoupling Order Capture: Designing a Tool That Competes With a Phone Call thumbnail
--->

# Decoupling Order Capture: Designing a Tool That Competes With a Phone Call

**Role:** Senior UX Designer, Nutrien Ag Solutions
**When:** 2019–2020
**Team:** A UX team of 12 designers and researchers
**Focus:** The Employee Experience Hub (EXH)

![A crop consultant standing in a field of lettuce, checking his phone.](https://adrian3.com/imgs/case-studies/images/Nutrien-Order-Capture/01-field-phone.png)

## Introduction

Nutrien had built an app for crop consultants to place orders. It worked, technically. But out in the field, consultants kept reaching for a faster tool: their phone, to call the branch admin and have someone else do it. Our software was competing with a phone call — and losing. This is the story of why, and how reframing the problem changed what we thought we were building.

## 1. The Problem

### Competing with a phone call

On paper, placing an order through our tool was “simple.” In practice it looked like this: connect to the VPN, log in, select the document type, select the customer account, select the branch, find the product, select the SKU, calculate the quantity, choose a price-adjustment code, justify the adjustment, submit to the ERP — then wait one to seven days for approval.

Faced with that, a busy consultant in a field does the rational thing: *”Screw it. I’m just gonna call my admin.”*

![A branch administrator at a desk surrounded by paperwork and phones — the “tool” our app was actually competing with.](https://adrian3.com/imgs/case-studies/images/Nutrien-Order-Capture/02-call-my-admin.png)

That was the uncomfortable truth I put in front of the team. The competition wasn’t another piece of software. It was a human being who could absorb a vague request — “I need this much of that for so-and-so” — and handle all the messy steps in the background. Our app demanded the consultant do that work themselves.

And the branch admins on the receiving end weren’t being helped either. When I asked whether our tool made *their* lives easier, the answer was blunt: cleaning up an order that came through EXH was more trouble than just creating it from scratch in the ERP. One admin offered to take a consultant’s login and submit it through EXH personally “so there aren’t errors.” Another put it even more simply: *”I’m going to have to re-enter this anyway, just write it out.”* We had built a tool that made more work on both ends of the transaction.

## 2. The Root Cause

### We had passed our complexity on to the user

Why was the tool so rigid? Because, historically, digital had been built to mirror the company’s backend systems. The order form was essentially a window onto the ERP, and every required field and dropdown existed to satisfy a downstream system rather than to help the person at the keyboard.

![A real handwritten order/delivery ticket, marked up with corrections and a sticky note of hand-calculated quantities — the genuine complexity behind a single “simple” order.](https://adrian3.com/imgs/case-studies/images/Nutrien-Order-Capture/03-order-ticket.jpg)

I described this as a *tightly coupled* design: by matching the ERP step for step, we passed the full complexity of our backend straight through to the user. It kept the engineering convenient and made the experience brittle. The honest summary of the status quo was uncomfortable — our systems were built around compounding internal complexity, and our users’ attitude was simply, *”I’ll use it because I have to.”*

## 3. The Reframe

### What is an order, really?

The breakthrough was refusing to accept that the tool had to look like the ERP. I asked the team a deceptively basic question: *what is an order?* Stripped of system jargon, the answer is human — *Customer X needs Y amount of product Z.*

That reframing pointed at a different kind of product, closer to a customer management system than an order-entry form. The order should be a single thing that:

- flows smoothly through the whole sales process, from a loose early conversation to a finalized order;
- accepts whatever level of detail the consultant actually has at that moment, instead of demanding every field up front;
- and gives a consultant visibility across all of their customers in one view.

In other words, *decouple* the experience from the ERP. Let the software absorb the complexity the way a good branch admin does, rather than forcing the user to.

## 4. Understanding the Whole System

### The form is connected to a warehouse

Designing this responsibly meant understanding what happens *after* submit. An order doesn’t end at the form — it kicks off a physical process. At the facility, dozens of orders are in progress at once. They get printed and pinned to peg boards along a wall, moved down the line as each one progresses. Fertilizer is often a blend of several products, weighed and mixed by hand; overages, shortages, and substitutions are common.

![A facility’s order wall: printed orders and sticky notes pinned to a peg board, tracking dozens of in-progress orders through fulfillment.](https://adrian3.com/imgs/case-studies/images/Nutrien-Order-Capture/04-fulfillment-wall.jpg)

Seeing those real-world connections changed how we designed the form itself. When you understand that a field on the screen becomes a physical bag of product on a truck, you design to prevent the errors and tedious corrections that ripple downstream.

## Conclusion

The order tool didn’t need more features. It needed a different premise. Once we stopped treating the order as a reflection of our ERP and started treating it as a reflection of how a sale actually unfolds, the path forward was clear: build something that competes with the phone call by being just as forgiving — and a lot more visible — than picking it up.

Order capture was one piece of a larger digital commerce effort, and the bet on designing around the user rather than the back end paid off: the agriculture e-commerce platform it belonged to went on to generate **over $5 billion in sales in its first three years.**
