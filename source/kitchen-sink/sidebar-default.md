<!---
title: Default Sidebar
show-in-nav: true
template: with-sidebar
--->
# Default Sidebar

This page uses `template: with-sidebar` with no slot override. The sidebar on the right is the global `sidebar-content` component — the same one that appears on every page using this template.

## How the default works

When no `slot.sidebar-content` key is present in frontmatter, the template renders the component named `sidebar-content`. That component is defined in `component.sidebar.md` and contains site-wide context: an about blurb and archive links.

## When to use the default

The default sidebar works well for pages where the supplementary content is genuinely site-wide — navigation, an author bio, a stable list of links. If the sidebar needs to reflect the page's specific subject matter, use a slot override instead.

## Typography and spacing

This column exercises baseline heading hierarchy, paragraph spacing, and list rendering inside the main content area. The sidebar column should stay sticky as this content scrolls, pinned to the top of the viewport with a hairline left border separating it from the content.
