#!/usr/bin/env bash
# Runs stats-module with the repository's built command (`npm ci && npm run build` at the root first).
#   ./run.sh            # umbradb run: the public preview node from genesis; Ctrl-C stops it
#   ./run.sh check      # umbradb config check umbradb.config.ts
# STATS_NODE names another node, STATS_API and STATS_ADMIN other addresses (umbradb.config.ts).
# In a project that installed the package, the same commands are `npx umbradb run` and
# `npx umbradb config check umbradb.config.ts`.
set -euo pipefail
cd "$(dirname "$0")"
UMBRADB="../../dist/cli/main.js"
[ -f "$UMBRADB" ] || { echo "no $UMBRADB: run npm ci && npm run build at the repository's root" >&2; exit 1; }
case "${1:-run}" in
  run) exec node "$UMBRADB" run --config umbradb.config.ts ;;
  check) exec node "$UMBRADB" config check umbradb.config.ts ;;
  *) echo "usage: ./run.sh [run|check]" >&2; exit 2 ;;
esac
