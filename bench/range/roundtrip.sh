#!/bin/bash
# What one statement costs from a run's container to the database (roundtrip.mjs), on a run's database.
#   roundtrip.sh <label>
set -euo pipefail
. "$(dirname "$0")/lib.sh"
check_label "$1"
bench_node /scripts/roundtrip.mjs "$BUILD" "$(database_of "$1")"
