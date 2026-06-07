#!/bin/sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
BRANCH="${1:-main}"

cd "$ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is dirty. Commit or stash changes before publishing content." >&2
  exit 1
fi

node scripts/build.mjs

git subtree split --prefix=source -b publish-content >/dev/null
git push content publish-content:"$BRANCH"
git branch -D publish-content >/dev/null 2>&1 || true
