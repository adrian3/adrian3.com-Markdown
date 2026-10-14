<!---
template: true
template-name: design-overview
notes: The /design overview. Each design-slide in the page is one full-screen hero; the page scrolls through them in order.
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
<body class="pf pf-index">
<header />
<design-nav />
<main class="pf-main">
<h1 class="pf-sr">{{title}}</h1>
<div class="pf-scrolly" data-scrolly>
<div class="pf-stage">
<content />
<p class="pf-scroll-hint" aria-hidden="true">Scroll</p>
</div>
</div>
</main>
<footer />
</body>
</html>
