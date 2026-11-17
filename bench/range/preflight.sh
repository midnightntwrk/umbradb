#!/bin/bash
# Checks that this machine has what a bench run needs. Reads only; prints one line per check and exits 1 if any
# fails. Never prints a secret.
#   preflight.sh [<template>=<height> ...]     each pair is checked: the template's cursor is at that height
# Environment: lib.sh's, and UMBRADB_LOCAL_NODE (the node's WebSocket address).
set -uo pipefail
. "$(dirname "$0")/lib.sh"
FAILED=0
ok() { printf 'PASS  %s\n' "$1"; }
bad() { printf 'FAIL  %s\n' "$1"; FAILED=1; }
check() { if eval "$2" >/dev/null 2>&1; then ok "$1"; else bad "$1"; fi; }
NODE_HTTP="$(printf '%s' "${UMBRADB_LOCAL_NODE:-}" | sed -E 's#^ws(s?)://#http\1://#')"
rpc() { curl -s -m 5 -H 'Content-Type: application/json' -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"$1\",\"params\":[]}" "$NODE_HTTP"; }
mode_of() { stat -f %Lp "$1" 2>/dev/null || stat -c %a "$1"; }

echo "== tools"
check "node is 24 or newer ($(node --version 2>/dev/null))" '[ "$(node -p "process.versions.node.split(\".\")[0]")" -ge 24 ]'
check "docker daemon answers" 'docker info'
check "curl" 'curl --version'

echo "== build ($BUILD)"
check "the build exists (dist/cli/main.js)" '[ -f "$BUILD/dist/cli/main.js" ]'
check "its dependencies are installed (node_modules/postgres)" '[ -d "$BUILD/node_modules/postgres" ]'

echo "== node"
if [ -z "$NODE_HTTP" ]; then bad "UMBRADB_LOCAL_NODE is set"; else
  check "system_health answers" 'rpc system_health | grep -q "\"peers\""'
  printf 'INFO  chain %s, node version %s\n' "$(rpc system_chain | sed -E 's/.*"result":"([^"]*)".*/\1/')" "$(rpc system_version | sed -E 's/.*"result":"([^"]*)".*/\1/')"
fi

echo "== bench database"
check "container $BENCH_PG_CONTAINER is running" '[ "$(docker inspect -f "{{.State.Running}}" "$BENCH_PG_CONTAINER")" = true ]'
check "network $BENCH_NETWORK exists" 'docker network inspect "$BENCH_NETWORK"'
check "the password file exists with mode 600" '[ -f "$BENCH_PG_PASSWORD_FILE" ] && [ "$(mode_of "$BENCH_PG_PASSWORD_FILE")" = 600 ]'
check "pg_stat_statements is loaded" 'bench_psql -c "show shared_preload_libraries" | grep -q pg_stat_statements'
check "image $BENCH_NODE_IMAGE is present" 'docker image inspect "$BENCH_NODE_IMAGE"'
for PAIR in "$@"; do
  T="${PAIR%%=*}"; H="${PAIR#*=}"
  check "template $T is at height $H" '[ "$(bench_psql -d "$T" -c "select max(height) from core_block_commit.blocks")" = "$H" ]'
done

[ "$FAILED" = 0 ] && echo "preflight: all checks passed" || echo "preflight: at least one check failed"
exit "$FAILED"
