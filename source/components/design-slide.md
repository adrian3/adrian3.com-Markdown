<!---
component: true
component-name: design-slide
raw: true
shortcode-attrs: page hero eyebrow title line button tone align position portrait-position
notes: One full-screen hero on the /design overview. Every attribute is required. hero is the image name (hero-NAME-1440.jpg in /imgs/design/). tone is light or dark (dark puts white text on the image). align is left or right. position and portrait-position are CSS object-position values for the wide and phone crops.
--->
<section class="pf-layer pf-tone-{{tone}} pf-align-{{align}}" data-layer aria-labelledby="l-{{hero}}">
<div class="pf-layer-media"><picture class="pf-pic"><source media="(orientation: portrait) and (max-width: 56rem)" srcset="/imgs/design/hero-{{hero}}-portrait-720.jpg 720w, /imgs/design/hero-{{hero}}-portrait-1080.jpg 1080w" sizes="100vw"><img src="/imgs/design/hero-{{hero}}-1440.jpg" srcset="/imgs/design/hero-{{hero}}-960.jpg 960w, /imgs/design/hero-{{hero}}-1440.jpg 1440w, /imgs/design/hero-{{hero}}-2880.jpg 2880w" sizes="100vw" alt="" style="object-position:{{position}};--pos-portrait:{{portrait-position}}" decoding="async"></picture></div>
<div class="pf-layer-inner">
<p class="pf-eyebrow">{{eyebrow}}</p>
<h2 class="pf-title" id="l-{{hero}}">{{title}}</h2>
<p class="pf-sub">{{line}}</p>
<a class="button pf-cta" href="{{page}}">{{button}} <svg class="pf-arrow" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
</div>
</section>
