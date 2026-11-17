#!/bin/bash
# Do bench runs hold the same rows, table by table? For runs whose contents hashes cannot be compared because their
# configuration histories differ (a run made with UPGRADE=1 records one more `core` revision in `core_chain.config`).
# Prints, per table of any run's core and module schemas, each run's row count and a hash of its rows (`absent` for a
# run that has no such table), and marks the tables where a run differs from the first; the last line counts those
# differences. Reads only.
#   tables.sh <label> <label> ...
# Exit status: 0 every table was read and none differs; 1 a table differs, or only some runs have it; 2 no label, or a
# read failed: a database that cannot be read or holds none of these tables ends it at once, and a table that cannot
# be read is marked NOT READ and the last line is "not compared: …", never a count.
#
# A table's hash is <rows>:<16 hex digits>: each row's text form (every column in order) hashed with MD5, the first 64
# bits of each read as a number and added up, and the sum hashed with MD5. A sum needs no sort and no memory that grows
# with the table, so the largest table is read in one pass, and rows in any order give the same hash.
set -uo pipefail
. "$(dirname "$0")/lib.sh"
if [ $# -eq 0 ]; then echo "usage: tables.sh <label> <label> ..." >&2; exit 2; fi
for L in "$@"; do check_label "$L"; done
# Every table of the core and module schemas; a partitioned table is read whole, so its partitions are left out.
LIST="SELECT quote_ident(n.nspname) || '.' || quote_ident(c.relname) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN ('r', 'p') AND NOT c.relispartition AND (n.nspname LIKE 'core%' OR n.nspname LIKE 'contract%') ORDER BY 1"
LISTS=(); ALL=""
for L in "$@"; do
  DB="$(database_of "$L")"
  if ! FOUND="$(bench_psql -d "$DB" -c "$LIST")"; then echo "tables.sh: could not read the tables of $DB (run $L)" >&2; exit 2; fi
  if [ -z "$FOUND" ]; then echo "tables.sh: $DB (run $L) has no table of the core's or the modules' schemas" >&2; exit 2; fi
  LISTS+=("$FOUND"); ALL="$ALL$FOUND"$'\n'
done
TABLES=(); while IFS= read -r T; do TABLES+=("$T"); done < <(printf '%s' "$ALL" | sort -u)
DIFFERENT=0; UNREAD=0
for T in "${TABLES[@]}"; do
  CELLS=(); I=0; FAILED=0
  for L in "$@"; do
    case $'\n'"${LISTS[$I]}"$'\n' in
      *$'\n'"$T"$'\n'*)
        if ! H="$(bench_psql -d "$(database_of "$L")" -c "SELECT count(*) || ':' || left(md5(coalesce(sum(('x' || left(md5(t::text), 16))::bit(64)::bigint::numeric), 0)::text), 16) FROM $T t")" || [ -z "$H" ]; then
          echo "tables.sh: could not read $T in $(database_of "$L") (run $L)" >&2
          H="error"; FAILED=$((FAILED + 1))
        fi;;
      *) H="absent";;
    esac
    CELLS+=("$H"); I=$((I + 1))
  done
  LINE=""; MARK=""
  for H in "${CELLS[@]}"; do
    LINE="$LINE $(printf '%-24s' "$H")"
    if [ "$FAILED" = 0 ] && [ "$H" != "${CELLS[0]}" ]; then MARK="  DIFFERENT"; DIFFERENT=$((DIFFERENT + 1)); fi
  done
  if [ "$FAILED" != 0 ]; then MARK="  NOT READ"; UNREAD=$((UNREAD + FAILED)); fi
  printf '%-40s%s%s\n' "$T" "$LINE" "$MARK"
done
if [ "$UNREAD" != 0 ]; then echo "not compared: $UNREAD $([ "$UNREAD" = 1 ] && echo read || echo reads) failed"; exit 2; fi
echo "differences from $1: $DIFFERENT"
[ "$DIFFERENT" = 0 ] || exit 1
