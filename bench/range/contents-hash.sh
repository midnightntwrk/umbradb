#!/bin/bash
# Prints each run's contents hash (contents-hash.mjs), computed by BUILD's exported contentsHash; it reads every row,
# so it takes seconds near genesis and minutes on a database of tens of gigabytes.
#   contents-hash.sh <label> <label> ...
set -euo pipefail
. "$(dirname "$0")/lib.sh"
DBS=(); for L in "$@"; do check_label "$L"; DBS+=("$(database_of "$L")"); done
bench_node /scripts/contents-hash.mjs "$BUILD" "${DBS[@]}"
