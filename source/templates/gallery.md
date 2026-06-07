<!---
template: true
template-name: gallery
--->
<!DOCTYPE html>
<html lang="en">
<head>
<page-head />
</head>
<body>
<header />
<subnav />
<article class="gallery {{page.gallery-class}}">
	<header class="gallery-header reading-column">
		<p class="eyebrow">{{page.section}}</p>
		<h1>{{title}}</h1>
		<p>{{page.description}}</p>
	</header>
	<div class="gallery-grid">
		<content />
	</div>
</article>
<footer />
</body>
</html>
