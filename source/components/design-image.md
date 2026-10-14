<!---
component: true
component-name: design-image
wrapper: true
raw: true
shortcode-attrs: type
shortcode-example: <design-image type="inline">…markdown image…</design-image>
notes: Supporting images on the /design section pages. type is inline (16:9, 1440x810), wide (edge to edge, 21:9, 2880x1234), right-float or left-float (beside the text, 4:3, 800x600), or trio (three in a row, 4:3, 800x600 each; with only two images it shows them as a pair). Inside, use normal markdown images, one per line. A line of text right after an image becomes its caption (optional). Place it where the image should appear; for floats, put it just before the paragraph it should sit beside. Styles are in design/portfolio.css, and portfolio.js turns each image + caption into a figure.
--->
<div class="pf-figs pf-figs-{{type}}" data-figs="{{type}}">
<content />
</div>
