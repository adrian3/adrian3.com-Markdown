<!---
title: Kitchen Sink
show-in-nav: true
template: main
--->
# Kitchen Sink

A reference page exercising every template type in this system. Use this to verify layout, typography, spacing, and component composition across templates.

## Pages in this folder

<page-list />

## All pages at the root

<page-list folder="" />

## Raw component demo

The `faq` component below uses `raw: true` in its frontmatter — its body is injected verbatim, bypassing the markdown renderer. This allows complex HTML like `<details>/<summary>` that the renderer would otherwise mangle.

<faq />

## Gallery component demo

Once the new `gallery-api.php` endpoint is on the server, this page will show the reusable gallery component in action:

- [Gallery inline demo](gallery-inline.html)
- [Postcards Camera Gallery](gallery-postcards-camera.html)
- [Camera Drawings Gallery](gallery-camera-drawings.html)

## What to look for

Each page should have working nav, correct CSS loaded from `../css/styles.css`, and all components rendering without broken links.
