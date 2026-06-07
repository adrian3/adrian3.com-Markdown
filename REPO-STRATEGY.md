# Adrian3 Repo Strategy

This project uses a split-repo workflow so content changes and site deployment can move independently.

## Roles

- `source/` in this repo is the primary editing surface.
- `website/` is generated output only.
- `adrian3.com-Markdown` is the content mirror for markdown-only work.
- `adrian3.github.com` is the deploy/publish repo.

## Safe Workflow

1. Edit markdown and templates in `source/`.
2. Build locally and inspect the generated site.
3. Mirror markdown changes to `adrian3.com-Markdown`.
4. Mirror built output to `adrian3.github.com` on a staging branch.
5. Flip the live branch only when the replacement site is ready.

## Guardrails

- Do not edit `website/` by hand.
- Do not publish directly to the live branch while the redesign is unfinished.
- Keep the markdown repo and deployment repo in sync from this working repo.
- Use git history here for local recovery and rollback.
