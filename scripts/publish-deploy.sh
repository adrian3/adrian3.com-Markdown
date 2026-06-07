#!/bin/sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
BRANCH="${1:-staging}"

cd "$ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is dirty. Commit or stash changes before publishing deploy output." >&2
  exit 1
fi

node scripts/build.mjs

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/adrian3-deploy.XXXXXX")"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT INT TERM

cp -R website/. "$TMP_DIR"/
cd "$TMP_DIR"
git init -b main >/dev/null
git config user.name "Codex"
git config user.email "codex@local"
git add .
git commit -m "Publish site build" >/dev/null
git remote add deploy "$(git -C "$ROOT" remote get-url deploy)"
git push deploy HEAD:"$BRANCH"
