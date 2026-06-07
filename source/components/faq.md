<!---
component: true
component-name: faq
raw: true
class: faq
--->
<details>
  <summary>What is this site built with?</summary>
  <p>A custom markdown template engine. Pages are written in markdown, components are reusable markdown fragments, and templates are HTML shells. The build pipeline compiles everything into static HTML.</p>
</details>
<details>
  <summary>Do I need to know how to code?</summary>
  <p>No. Content is plain markdown files. The only syntax you need is the frontmatter block at the top of each file and self-closing component tags like <code>&lt;header /&gt;</code>.</p>
</details>
<details>
  <summary>Where does the output go?</summary>
  <p>The <code>website/</code> folder. It is fully regeneratable and safe to gitignore — the source of truth is always <code>source/</code>.</p>
</details>
