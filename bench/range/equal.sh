#!/bin/bash
# Do bench runs end with the same stored contents? Prints, per run: the block cursor, one hash over the per-table
# digests /status reported at the end, and hashes of the node tables' logical contents (keys and counts).
#   equal.sh <label> <label> ...
set -uo pipefail
. "$(dirname "$0")/lib.sh"
for L in "$@"; do
  check_label "$L"
  DB="$(database_of "$L")"
  DIG="$(tail -1 "$BENCH_DIR/$L/status.jsonl" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s).status;const t=[];for(const m of j.modules)for(const x of m.tables??[])t.push([x.schema,x.table,x.height,x.digest]);t.sort();console.log(require("crypto").createHash("sha256").update(JSON.stringify(t)).digest("hex").slice(0,12)+" ("+t.filter(x=>x[3]).length+" digests)")})')"
  Q="select (select max(height) from core_block_commit.blocks) || ' nodes ' || (select count(*) || ':' || left(md5(string_agg(encode(node_key,'hex') || md5(children), '' order by node_key)),12) from core_ledger_state.nodes) || ' ref_counts ' || (select count(*) || ':' || left(md5(string_agg(encode(node_key,'hex')||count, '' order by node_key)),12) from core_ledger_state.ref_counts) || ' root_counts ' || (select left(md5(string_agg(encode(node_key,'hex')||count, '' order by node_key)),12) from core_ledger_state.root_counts) || ' queue ' || (select count(*) || ':' || left(md5(coalesce(string_agg(encode(node_key,'hex'), '' order by node_key),'')),12) from core_ledger_state.unreferenced)"
  printf '%-22s digests %s | %s\n' "$L" "$DIG" "$(bench_psql -d "$DB" -c "$Q")"
done
