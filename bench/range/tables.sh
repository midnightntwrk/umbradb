#!/bin/bash
# Do bench runs hold the same rows, table by table? For runs whose contents hashes cannot be compared because their
# configuration histories differ (a run made with UPGRADE=1 records one more `core` revision in `core_chain.config`).
# Prints, per table of the first run's core and module schemas, each run's row count and a hash over its rows, and
# marks the tables where a run differs from the first; the last line counts those differences. Reads only.
#   tables.sh <label> <label> ...
set -uo pipefail
. "$(dirname "$0")/lib.sh"
for L in "$@"; do check_label "$L"; done
FIRST="$(database_of "$1")"
# Every table of the core and module schemas; a partitioned table is read whole, so its partitions are left out.
TABLES="$(bench_psql -d "$FIRST" -c "SELECT n.nspname || '.' || c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN ('r', 'p') AND NOT c.relispartition AND (n.nspname LIKE 'core%' OR n.nspname LIKE 'contract%') ORDER BY 1")"
DIFFERENT=0
for T in $TABLES; do
  REFERENCE=""; LINE=""; MARK=""
  for L in "$@"; do
    # A row's text form names every column in order; the rows are hashed in the order of their own hashes.
    H="$(bench_psql -d "$(database_of "$L")" -c "SELECT count(*) || ':' || left(md5(coalesce(string_agg(h, '' ORDER BY h), '')), 12) FROM (SELECT md5(t::text) AS h FROM $T t) rows" 2>/dev/null || echo "absent")"
    [ -n "$REFERENCE" ] || REFERENCE="$H"
    if [ "$H" != "$REFERENCE" ]; then MARK="  DIFFERENT"; DIFFERENT=$((DIFFERENT + 1)); fi
    LINE="$LINE $(printf '%-24s' "$H")"
  done
  printf '%-40s%s%s\n' "$T" "$LINE" "$MARK"
done
echo "differences from $1: $DIFFERENT"
