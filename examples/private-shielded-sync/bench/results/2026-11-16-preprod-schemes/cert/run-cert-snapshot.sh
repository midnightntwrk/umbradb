#!/bin/bash
# Phase 5.4: upstream's correctness certificate on the tables of one stored IPIR+SP snapshot.
#   run-cert-snapshot.sh <snapshot dir> <label>
# For each table (read, path, nullifier): the project's noise report (ipir/core example noise_report, which checks the
# masks it builds against the stored ones), then upstream's certify_native.py --screens (vendored copy), unchanged.
set -euo pipefail
snap=$1; label=$2
W=/Users/edwardalvarado/todo/Umbra/experiments/poc-ipir/examples/private-shielded-sync/ipir
E=$W/target/release/examples/noise_report
T=$W/vendor/ipir-sp/reinspiring/tools/security/certify_native.py
here=$(cd "$(dirname "$0")" && pwd)
for table in read path nullifier; do
  read -r digest rows cols seed masks < <(python3 -I - "$snap/manifest.json" "$table" <<'PY'
import json, sys
m = json.load(open(sys.argv[1])); t = sys.argv[2]; a = m['artifacts']
if m['scheme'] != 'ipir-sp': sys.exit('not an IPIR+SP snapshot')
r = a[t + 'Table']; l = r['layout']
print(r['digest'], l['rows'], l['cols'], l['seed'], a[t + 'Public']['digest'])
PY
)
  out="$here/noise-$label-$table.json"
  /usr/bin/time -l "$E" "$snap/$digest" "$rows" "$cols" "$seed" "$snap/$masks" > "$out" 2> "$here/noise-$label-$table.log"
  python3 -I "$T" --screens "$out" > "$here/cert-$label-$table.json"
  echo "$label $table ($rows x $cols): checker exit $?"
  python3 -I - "$here/cert-$label-$table.json" <<'PY'
import json, sys
j = json.load(open(sys.argv[1]))
a = j['actual_profile']; w = j['screens'].get('worst_case_query')
print('  actual: certified failure bits', a['certified_failure_bits'], 'meets_128', a['meets_128'], 'deterministic', a['max_deterministic_error'],
      '| worst-case query screen: bits', w['certified_failure_bits'])
PY
done
