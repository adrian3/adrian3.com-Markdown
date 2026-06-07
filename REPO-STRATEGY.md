# Adrian3 Repo Strategy

This project uses a split-repo workflow so content changes and site deployment can move independently.

## Roles

- `source/` in this repo is the primary editing surface.
- `website/` is generated output only.
- `adrian3.com-Markdown` is the content mirror for markdown-only work.
- `adrian3.github.com` is the deploy/publish repo.
- `admin/Ade-s-design-system` stays as a separate submodule for the shared baseline and tokens.
- `content` is the Git remote for `adrian3.com-Markdown`.
- `deploy` is the Git remote for `adrian3.github.com`.

## Safe Workflow

1. Edit markdown and templates in `source/`.
2. Build locally and inspect the generated site.
3. Mirror markdown changes to `adrian3.com-Markdown`.
4. Mirror built output to `adrian3.github.com` on a staging branch.
5. Flip the live branch only when the replacement site is ready.

## Suggested Branch Convention

- This repo: `main`
- Markdown repo: `main`
- Deploy repo: `staging` for pre-launch work, then the existing live branch when you are ready to switch

## Useful Commands

```bash
git push content main
git push deploy main:staging
```

Use the first command to publish markdown/content changes.
Use the second command only after a build has been verified and you want the deploy repo to pick up the new site on a staging branch.

## Guardrails

- Do not edit `website/` by hand.
- Do not publish directly to the live branch while the redesign is unfinished.
- Keep the markdown repo and deployment repo in sync from this working repo.
- Use git history here for local recovery and rollback.
