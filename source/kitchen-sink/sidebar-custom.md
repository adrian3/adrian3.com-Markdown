<!---
title: Custom Sidebar Slot
show-in-nav: true
template: with-sidebar
slot.sidebar-content: sidebar-work
--->
# Custom Sidebar Slot

This page uses `template: with-sidebar` with a page-specific sidebar override:

```
slot.sidebar-content: sidebar-work
```

The sidebar on the right is `component.sidebar-work.md` — a component with context specific to the work section, not the global site-wide links. The global `sidebar-content` component is completely replaced for this page.

## How slot overrides work

When the generator finds a frontmatter key starting with `slot.`, it renders the named component and injects it under that slot name in the template. The slot override wins over any global component with the same name.

## Practical uses

Use slot overrides when a template slot needs genuinely different content per page or section:

- A documentation sidebar with section-specific chapter links
- A project page sidebar listing related tools or collaborators
- A writing index sidebar filtered to a specific category
- Any case where "the same layout, different context" is the right model

## What stays the same

The layout, spacing, sticky positioning, responsive collapse, and all other structural CSS come from the template and are identical across all pages using `with-sidebar`. Only the slot content changes.
