<!---
template: true
template-name: design-section
notes: Section pages in /design (Design principles, Human performance, Agriculture, Emerging tech). Front matter sets the hero - eyebrow, line (the sentence under the title; keep it the same as that page's line in design/index.md), hero (image name in /imgs/design/), hero-position, hero-position-portrait, tone (light or dark), align (left or right). Styles and scripts are design/portfolio.css and design/portfolio.js.
--->
<!DOCTYPE html>
<html lang="en">
<head>
<page-head />
<meta name="description" content="{{page.description}}">
<link rel="stylesheet" href="{{base}}design/portfolio.css">
<script>(function (d) { d.classList.add('pf-js'); setTimeout(function () { if (!d.classList.contains('pf-ready')) d.classList.remove('pf-js'); }, 4000); }(document.documentElement));</script>
<script src="{{base}}design/portfolio.js" defer></script>
</head>
<body class="pf pf-section">
<header />
<design-nav />
<section class="pf-hero pf-band pf-tone-{{page.tone}} pf-align-{{page.align}}" data-pointer>
<div class="pf-media" data-parallax><picture class="pf-pic"><source media="(orientation: portrait) and (max-width: 56rem)" srcset="/imgs/design/hero-{{page.hero}}-portrait-720.jpg 720w, /imgs/design/hero-{{page.hero}}-portrait-1080.jpg 1080w" sizes="100vw"><img src="/imgs/design/hero-{{page.hero}}-1440.jpg" srcset="/imgs/design/hero-{{page.hero}}-960.jpg 960w, /imgs/design/hero-{{page.hero}}-1440.jpg 1440w, /imgs/design/hero-{{page.hero}}-2880.jpg 2880w" sizes="100vw" alt="" style="object-position:{{page.hero-position}};--pos-portrait:{{page.hero-position-portrait}}" fetchpriority="high" decoding="async"></picture></div>
<div class="pf-band-inner pf-reveal">
<p class="pf-eyebrow">{{page.eyebrow}}</p>
<h1 class="pf-title">{{title}}</h1>
<p class="pf-sub">{{page.line}}</p>
</div>
</section>
<main class="container pf-content">
<div class="pf-description">
<content />
</div>
</main>
<a class="pf-next pf-tone-dark" data-next hidden>
<span class="pf-media" data-parallax><picture class="pf-pic"><img alt="" loading="lazy" decoding="async"></picture></span>
<span class="pf-next-inner"><span class="pf-eyebrow">Next</span><span class="pf-title"></span><svg class="pf-arrow" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
</a>
<footer />
</body>
</html>
