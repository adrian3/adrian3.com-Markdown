# Markdown Template Engine

If you can write an email, you can build pages with this system. There is no coding required to add content, change a page title, or create a new post. Everything you write lives in plain text files — no database, no cloud platform, no login to a third-party service. You open a file, write in markdown (the same formatting used in most notes apps and writing tools), and the system takes care of turning it into a web page.

The key idea is that your content and your site's structure are kept separate. Pages are just writing. Components are reusable pieces — a header, a footer, a card — that you define once and use everywhere. Templates are the layouts that give pages their shape. Change a component once and it updates on every page that uses it. The admin panel runs locally in your browser and gives you a build button, a live preview, and a map of all the files in the project.

---

## Project Structure

```
source/          ← everything you author
  components/    ← reusable UI fragments (header, footer, cards, etc.)
  templates/     ← page layout shells (main, post, gallery, with-sidebar)
  css/
    baseline.css ← design system reset — do not edit
    theme.css    ← global layout utilities
  kitchen-sink/  ← reference pages exercising every template type
  index.md
  writing.md
  ...
  variables.yml  ← site-wide text tokens (author name, copyright, URLs)

website/         ← generated output — do not edit directly
  css/
    styles.css   ← all CSS compiled into one file by the build
    baseline.css
    theme.css
    ...          ← individual component/template CSS (for reference)
  index.html
  ...

admin/           ← local build server and admin UI
  server.js
  generator.js
  settings.json
```

Source and output are separate folders. `website/` is fully regeneratable — delete it and a build recreates it. It is safe to gitignore.
The design system under `admin/Ade-s-design-system/` stays as a separate git submodule so the shared tokens can evolve independently.

## Repository Topology

This folder is the canonical working repo for the redesign.

- `source/` is the source of truth for authored content in this project.
- `website/` is generated output and should stay untracked.
- `adrian3.com-Markdown` should mirror `source/` when you want markdown-only updates separated from the site build.
- `adrian3.github.com` should receive the built site output and stay on a protected staging flow until launch.

The safest launch pattern is:

1. Edit content in `source/` here.
2. Build and verify locally.
3. Sync `source/` into the markdown repo.
4. Sync built output into the live-site repo on a staging branch.
5. Promote the staging branch only when the new site is ready to replace the old one.

---

## The Four File Types

### Pages

Pages are the content of your site. Write in markdown, declare a title and template in the frontmatter, and the build turns the file into an HTML page.

```
<!---
title: On Making Things
template: post
categories: Essay
date: June 2025
--->

Your content here. Standard markdown: **bold**, *italic*, links, lists, headings.
```

- `index.md` → `website/index.html`
- `writing.md` → `website/writing.html`
- `kitchen-sink/post-example.md` → `website/kitchen-sink/post-example.html`

If no `template` is specified, the page uses `main` by default.

Pages are published by default. If you want to keep a page out of the build, add this frontmatter flag:

```md
unpublished: true
```

This means the page will be skipped by the build pipeline. It will not generate HTML, appear in `posts.json`, show up in blog feeds, or be included in `<page-list />`.

If you want a page to stay live but be excluded from discovery features, add:

```md
unlisted: true
```

An unlisted page is still built and can be visited directly, but it is excluded from:

- `sitemap.xml`
- `blog/feed.xml`
- `<page-list />`
- `<blog-recent />`
- `<blog-archive />`
- `<post-nav />`

### Reserved Frontmatter

There is only one frontmatter block, but it contains two kinds of keys:

1. Reserved system keys with special meaning to the generator
2. User-defined keys that are simply metadata for your own pages

Common reserved system keys:

- `title`
- `template`
- `date`
- `description`
- `categories`
- `unpublished`
- `unlisted`
- `show-in-nav`
- `slot.*`
- `class`
- `id`
- `raw`
- `component-name`
- `template-name`
- `shortcode-attrs`
- `shortcode-example`

Everything else is treated as user-defined metadata. User-defined keys are not interpreted by the build pipeline unless you choose to reference them in a template or component.

For example:

```md
<!---
title: My Page
template: post
hero-style: dramatic
campaign: fall-launch
--->
```

Here `title` and `template` are reserved system keys, while `hero-style` and `campaign` are custom page metadata.

### Components

Components are reusable markdown fragments. Define them once in `source/components/`, use them anywhere with a self-closing tag.

```
<!---
component: true
component-name: byline
class: byline reading-column
--->
Written by [<author />](<author-url />)
```

Insert in a template or page body with `<byline />`. Components can nest other components. If `class` is present in the frontmatter, the rendered output is wrapped in a `<div class="...">`.

Each component can have a paired CSS file with the same name (`byline.css` beside `byline.md`). The build picks it up automatically — no manual `<link>` tags needed.

Wrapper components are normal components with `wrapper: true` in frontmatter. They use paired tags and put the page-authored markdown into `<content />` inside the component body.

```md
<!---
component: true
component-name: grid
wrapper: true
--->
<div class="gallery-grid">
<content />
</div>
```

Use them like:

```md
<grid>
- ![Alt text](image.jpg)
- ![Alt text](image-2.jpg)
</grid>
```

### Page Includes

If you want to reuse the body of another page without turning it into a component, use:

```html
<include page="path/to/page.md" />
```

That pulls in only the page body. The target page's template is ignored. Includes resolve relative to the current file first, then the source root. Nested includes are supported, and the build protects against cycles.

### Component Attributes

Shortcode attributes become component variables with the same name.

Example usage:

```html
<gallery folder="postcards/camera" />
```

Example component frontmatter and body:

```md
<!---
component: true
component-name: gallery
raw: true
shortcode-attrs: folder
--->
<div data-folder="{{folder}}"></div>
```

In that example:
- `folder="postcards/camera"` is passed into the component
- `{{folder}}` resolves to `postcards/camera` inside the component

To make the admin show a more helpful shortcode signature, add `shortcode-attrs` in frontmatter:

```md
shortcode-attrs: folder
```

This tells the admin to display `<gallery folder="..." />` instead of just `<gallery />`.

If a component needs a custom example that differs from the automatic one, use:

```md
shortcode-example: <my-component mode="compact" />
```

### Templates

Templates are the HTML shells that pages live inside. They use `<content />` as the slot where page body content is injected, and component tags for shared UI.

```
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
```

**Available templates:**

| Template | Use |
|---|---|
| `main` | General-purpose single-column layout |
| `post` | Long-form editorial with reading column, eyebrow, byline |
| `gallery` | Auto-fill image/figure grid with header |
| `with-sidebar` | Two-column content + sidebar layout |

### Variables

Variables are plain text tokens defined in `variables.yml`. Use them anywhere with `<variable-name />`.

```yaml
author: "Ade Hanft"
author-url: "/"
copyright: "Copyright Adrian Hanft"
newsletter-url: "https://ade3.substack.com"
subscribe: "Subscribe at ade3.substack.com"
```

The distinction between a variable and a component: **variables are text only, components can contain HTML and markdown**. Both use the same `<name />` shortcode syntax.

---

## Template Variables

Inside templates and components, `{{token}}` expressions are replaced at build time.

| Token | Value |
|---|---|
| `{{title}}` | Page title from frontmatter |
| `{{site.title}}` | Site title from `settings.json` |
| `{{page.date}}` | Any frontmatter field via `page.*` |
| `{{base}}` | Relative path prefix (empty at root, `../` one level deep) |

The `{{base}}` token means templates work correctly for pages in subdirectories like `kitchen-sink/` without any special configuration.

---

## Slot Overrides

The `with-sidebar` template uses `<sidebar-content />` as a named slot. By default it renders the global sidebar component. Any page can override it with a page-specific component:

```
<!---
title: Custom Sidebar Page
template: with-sidebar
slot.sidebar-content: sidebar-work
--->
```

Any `slot.name: component-name` frontmatter key renders the named component into that template slot for that page only.

---

## CSS System

CSS is organised in three tiers:

1. **`css/baseline.css`** — Design system reset and custom properties. Pulled from the design system. Never edited.
2. **`css/theme.css`** — Global layout utilities (`.container`, `.reading-column`, `.dashboard-grid`).
3. **`components/*.css` / `templates/*.css`** — Co-located with their markdown files. Automatically included in the build.

The build compiles all CSS into a single `website/css/styles.css` in order: baseline → theme → template CSS → component CSS. Every page links only to `styles.css`.

**Design system tokens** (defined in `baseline.css`):

| Token | Value | Use |
|---|---|---|
| `--ade-primary` | `#43b3ae` | Single accent color for all interactive elements |
| `--ade-ink` | `#3c3a3a` | Body text |
| `--ade-parchment` | `#fafafa` | Header, footer, supporting surfaces |
| `--ade-canvas` | `#ffffff` | Page background |
| `--ade-hairline` | `#e0e0e0` | Borders and dividers |
| `--ade-font-display` | Vollkorn | Editorial headings and body copy |
| `--ade-font-ui` | Montserrat | Navigation, labels, buttons |
| `--ade-content-width` | `35rem` | Optimal reading column width |
| `--ade-wide-width` | `72rem` | Maximum container width |

---

## How the Build Works

1. The generator walks `source/` and classifies every file by folder (`components/`, `templates/`) and frontmatter
2. Components are pre-rendered and registered by name, including paired wrapper components
3. Each content page has its shortcodes expanded, other page bodies can be included inline, wrapper components can capture inner markdown, markdown rendered to HTML, and content injected into its template
4. `{{token}}` expressions are replaced (title, page metadata, base path)
5. Per-page `slot.*` frontmatter overrides are applied
6. CSS files from `components/` and `templates/` are copied to `website/css/`
7. All CSS is compiled into `website/css/styles.css`
8. Live reload script is injected into every page for development

The build is incremental: editing a content page rebuilds only that page. Editing a component or template rebuilds all pages that use it, tracked through the component dependency graph.

---

## Admin

Open the admin by double-clicking `launch.command` or running `node admin/server.js`. The admin runs at `http://localhost:3002` and the live preview at `http://localhost:3003`.

The admin lets you:
- Trigger a build and see build status
- Open the live preview
- Edit the site title
- Browse all templates, components, pages, and variables

The file watcher auto-rebuilds on markdown changes and hot-reloads CSS changes without a full rebuild.

---

## Blog

The system has built-in blog support. Three things work together: a `post` template for individual posts, a set of components for listing and navigation, and an RSS feed generated automatically at build time.

### The `/blog/` folder convention

**Posts must live inside a `blog/` subfolder of `source/`.** This is a hard requirement — the blog components, post navigation, and RSS generator all filter `posts.json` by the URL prefix `/blog/`. A post at `source/blog/2024/my-post.md` becomes `/blog/2024/my-post.html` and is recognised as a blog post. A post at `source/my-post.md` becomes `/my-post.html` and is invisible to all blog features.

You can organise within `blog/` however you like. Year subfolders (`blog/2024/`) are conventional but not required. `blog/post-title.md` works equally well.

### Required frontmatter

Every post needs at minimum a `title` and `template: post`:

```
<!---
title: My Post Title
template: post
date: January 15, 2024
description: A one-sentence summary shown in listings and the RSS feed.
categories: Design, Career Advice
--->
```

| Key | Required | Notes |
|---|---|---|
| `title` | Yes | Shown in the post header, listings, RSS, and browser tab |
| `template` | Yes | Must be `post` to get the reading column layout |
| `date` | Recommended | Format: `Month D, YYYY` (e.g. `January 9, 2016`). Used for sorting, display, and RSS |
| `description` | Recommended | Shown in `<blog-recent />`, `<blog-archive />`, and RSS items |
| `categories` | Optional | Comma-separated. Also supplies the first display label for `{{page.category}}` in the post template |

### Blog components

All three components read from `posts.json` (generated at every build) using `fetch()` at runtime.

**`<blog-recent />`** — renders the 5 most recent posts as a linked list with date and description. Drop it on any page: a homepage, a sidebar, a landing section.

**`<blog-archive />`** — renders all blog posts grouped by year with client-side category filter buttons. Intended for a dedicated archive or writing index page.

**`<post-nav />`** — appears automatically on every page using `template: post`. Shows the chronologically previous post on the left, "All writing" in the centre, and the next post on the right. On non-blog pages (posts that aren't in `blog/`) it falls back to just the "All writing" link.

### RSS feed

The build automatically generates `website/blog/feed.xml` — a standard RSS 2.0 feed containing the 50 most recent blog posts sorted newest-first, with title, link, description, publication date, and categories.

The feed URL on your live site: `https://your-domain.com/blog/feed.xml`

To make the feed URL discoverable in browsers, add a `<link>` tag to `components/page-head.md`:

```html
<link rel="alternate" type="application/rss+xml" title="Blog" href="/blog/feed.xml">
```

The feed reads `site-title` and `site-url` from `variables.yml`. Make sure both are set:

```yaml
site-title: "Your Site Name"
site-url: "https://your-domain.com"
```

### What the post template provides

Pages using `template: post` automatically get:
- A narrow reading column (`--ade-content-width`, ~35rem) centred on the page
- The eyebrow category label from `{{page.category}}` (derived automatically from the first value in `categories`)
- The title as `h1` from `{{title}}`
- The date as `<small>` from `{{page.date}}`
- A byline component below the content
- The `<post-nav />` component with prev/next blog navigation

### Minimal working example

```
source/
  blog/
    2024/
      my-first-post.md
```

```
<!---
title: My First Post
template: post
date: January 15, 2024
description: This is what the post is about.
categories: Writing
--->

Your post content here. Standard markdown.
```

That's all that's needed. Build the site and the post appears at `/blog/2024/my-first-post.html`, shows up in `<blog-recent />` and `<blog-archive />` on any page that uses those components, and is included in the RSS feed.

---

## Comparison to Similar Tools

This system occupies a specific niche. Here is how it compares to the tools most people reach for.

### Eleventy (11ty)

The closest philosophical match. Eleventy is markdown-driven, has zero opinions about output HTML, supports shortcodes, and is extremely flexible. The key difference: Eleventy uses Nunjucks, Liquid, or HTML for layout files. Your templates and components are written in a different language than your content. There is no built-in admin UI — it is a CLI tool that assumes a developer is always in the loop.

### Hugo

Hugo has shortcodes that are conceptually similar to `<header />` — you write `{{< header >}}` in a markdown file and it expands a layout partial. Hugo is very fast (built in Go) and has a large theme ecosystem. Like Eleventy, templates are HTML with Go template syntax, not markdown. No admin UI.

### Jekyll

The original markdown-to-static-site tool and the inspiration for most that followed. Mature, well-documented, large plugin ecosystem. Templates are Liquid/HTML. No admin UI.

### Astro

The modern answer for component-driven content. You write components in `.astro` files (or React, Vue, or Svelte), and markdown pages can use them. Powerful content collections, excellent developer experience, strong ecosystem. Requires understanding of components as code — not approachable for non-developers without a build setup.

### What is different here

**Everything is a markdown file.** Templates, components, and pages all use the same file format, differentiated by a short frontmatter declaration. A non-developer can open `components/header.md` and immediately read and edit it. No template language to learn. No framework concepts to understand.

**The admin UI is built in.** Double-clicking a file launches a browser-based admin with a build button and live preview. No terminal required to run the site. This is a gap that no major SSG addresses — they are all CLI tools that assume developer involvement.

**The shortcode model is natural.** `<byline />` in the middle of a markdown page is intuitive to anyone who has used self-closing HTML tags. The same syntax works for components, variables, and template slots. One pattern covers all composition.

**The tradeoff** is real: this system has no plugin ecosystem, no image optimization, no i18n, no RSS feed generation, no incremental static regeneration. For a solo author running a personal site who wants to own their tools and understand every part of the stack, that is an acceptable trade. For a team shipping a product site, Eleventy or Astro are the pragmatic choice.

---

## Folder Conventions

| Location | Purpose |
|---|---|
| `source/components/` | Reusable UI fragments and their CSS |
| `source/templates/` | Page layout shells and their CSS |
| `source/css/` | `baseline.css` (read-only) and `theme.css` (global utilities) |
| `source/*.md` | Content pages |
| `source/variables.yml` | Site-wide text tokens |
| `website/` | Generated output — gitignored |
| `admin/` | Build server, generator, and admin UI |

Component and template CSS files are co-located with their markdown counterparts in source. The build automatically remaps them to `website/css/` in the output.
