<!---
template: true
template-name: post
--->
<!DOCTYPE html>
<html lang="en">
<head>
<page-head />
</head>
<body>
<header />
<subnav />
<article class="post">
	<header class="post-header reading-column">
		<p class="eyebrow">{{page.category}}</p>
		<h1>{{title}}</h1>
		<small>{{page.date}}</small>
	</header>
	<div class="post-body reading-column">
		<content />
	</div>
	<byline />
	<post-nav />
</article>
<footer />
</body>
</html>
