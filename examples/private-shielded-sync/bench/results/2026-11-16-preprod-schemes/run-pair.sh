#!/bin/bash
# Phase 5.2: one repetition at one size: the benchmark asks the run's stack for a SimplePIR snapshot, then an IPIR+SP
# one, at height 3,439,524, and measures wallets A and B against each.
#   run-pair.sh <size label> <rep> [<padding>] [--db]
# Results: <worktree>/examples/private-shielded-sync/bench/results/2026-11-16-preprod-schemes/runs/<scheme>-<label>-r<rep>/
set -uo pipefail
label=$1; rep=$2; padding=${3:-}; db=${4:-}
W=/Users/edwardalvarado/todo/Umbra/experiments/poc-ipir
S=/Users/edwardalvarado/todo/Umbra/resources/00058-poc-ipir/stack
R=$W/examples/private-shielded-sync/bench/results/2026-11-16-preprod-schemes/runs
WORK=/Users/edwardalvarado/todo/Umbra/resources/00058-poc-ipir/bench/work
LOGS=/Users/edwardalvarado/todo/Umbra/resources/00058-poc-ipir/bench/logs
pid=$(lsof -ti tcp:10581 -sTCP:LISTEN)
[ -n "$pid" ] || { echo "the stack is not running"; exit 2; }
for scheme in simplepir ipir-sp; do
  name="$scheme-$label-r$rep"
  out=$R/$name
  [ -f "$out/results.json" ] && { echo "$name: done already"; continue; }
  args=(run --wallet A --wallet B --server http://127.0.0.1:10580 --network preprod
    --build-height 3439524 --scheme "$scheme" --admin-secret-file "$S/pss-admin-secret"
    --pss-data "$S/pss-data" --server-pid "$pid" --server-log "$S/run.log" --status-url http://127.0.0.1:10581/status
    --threads 8 --scan-threads "" --out "$out" --work "$WORK/$name")
  [ -n "$padding" ] && args+=(--padding "$padding")
  if [ "$db" = "--db" ]; then args+=(--db-url postgres://postgres@127.0.0.1:51158/poc_ipir --db-password-file "$S/pg-password" --path-splits 16 --build-threads 6); fi
  echo "$(date -u +%FT%TZ) $name: load $(sysctl -n vm.loadavg)"
  (cd "$W" && node --expose-gc --env-file=/Users/edwardalvarado/todo/Umbra/resources/00053-private-shielded-sync/secrets.env \
    examples/private-shielded-sync/bench/bench.ts "${args[@]}") > "$LOGS/$name.log" 2>&1
  code=$?
  rm -rf "$WORK/$name"
  echo "$(date -u +%FT%TZ) $name: exit $code; $(tail -1 "$LOGS/$name.log" | cut -c1-300)"
  [ $code -eq 0 ] || exit $code
done
