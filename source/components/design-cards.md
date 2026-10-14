<!---
component: true
component-name: design-cards
wrapper: true
raw: true
notes: Wrap a list of case study links. portfolio.js turns each link into a card, using the title, subtitle and thumbnail from posts.json. The first link is the featured card (double width), so reorder the list to change it. Without JavaScript the plain list of links shows.
shortcode-example: <design-cards>…list of case study links…</design-cards>
--->
<section class="wide-breakout pf-cards" aria-label="Case Studies" data-design-cards>
<content />
</section>
