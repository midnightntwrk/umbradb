#!/bin/bash
# Do bench runs end with the same stored contents? Prints, per run: the block cursor, one hash over the per-table
# digests /status reported at the end, and hashes of the node tables' logical contents (keys, children and counts).
#   equal.sh <label> <label> ...
# A node table's hash is <rows>:<16 hex digits>, as tables.sh hashes a table: each row's text hashed with MD5, the first
# 64 bits of each added up, the sum hashed with MD5. A sum needs no sort and no memory that grows with the table (one
# text value of every row would pass PostgreSQL's 1 GB bound at about 11 million nodes).
# Exit status: 0 every run was read; 2 no label, or a run's status file or database could not be read (its line says
# "not read" there, and the last line is "not compared: …").
set -uo pipefail
. "$(dirname "$0")/lib.sh"
if [ $# -eq 0 ]; then echo "usage: equal.sh <label> <label> ..." >&2; exit 2; fi
# The rows of table $2 and a hash of them, each row's text being $1 (a subquery).
hash_of() { printf "(select count(*) || ':' || left(md5(coalesce(sum(('x' || left(md5(%s), 16))::bit(64)::bigint::numeric), 0)::text), 16) from %s)" "$1" "$2"; }
UNREAD=0
for L in "$@"; do
  check_label "$L"
  DB="$(database_of "$L")"
  if ! DIG="$(tail -1 "$BENCH_DIR/$L/status.jsonl" 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s).status;const t=[];for(const m of j.modules)for(const x of m.tables??[])t.push([x.schema,x.table,x.height,x.digest]);t.sort();console.log(require("crypto").createHash("sha256").update(JSON.stringify(t)).digest("hex").slice(0,12)+" ("+t.filter(x=>x[3]).length+" digests)")}catch(e){process.exit(1)}})')" || [ -z "$DIG" ]; then
    echo "equal.sh: could not read the last /status sample of run $L ($BENCH_DIR/$L/status.jsonl)" >&2
    DIG="not read"; UNREAD=$((UNREAD + 1))
  fi
  Q="select (select max(height) from core_block_commit.blocks) || ' nodes ' || $(hash_of "encode(node_key, 'hex') || md5(children)" core_ledger_state.nodes) || ' ref_counts ' || $(hash_of "encode(node_key, 'hex') || count" core_ledger_state.ref_counts) || ' root_counts ' || $(hash_of "encode(node_key, 'hex') || count" core_ledger_state.root_counts) || ' queue ' || $(hash_of "encode(node_key, 'hex')" core_ledger_state.unreferenced)"
  if ! TABLES="$(bench_psql -d "$DB" -c "$Q")" || [ -z "$TABLES" ]; then
    echo "equal.sh: could not read the node tables of $DB (run $L)" >&2
    TABLES="not read"; UNREAD=$((UNREAD + 1))
  fi
  printf '%-22s digests %s | %s\n' "$L" "$DIG" "$TABLES"
done
if [ "$UNREAD" != 0 ]; then echo "not compared: $UNREAD $([ "$UNREAD" = 1 ] && echo read || echo reads) failed"; exit 2; fi
