#!/bin/bash
# One bench run: a fresh clone of a template database, synced by BUILD from the clone's cursor to a stop height.
#
#   run.sh <label> <stop-height> [KEY=VALUE ...]     (the KEY=VALUE pairs go to the run's environment)
#
# Environment, besides lib.sh's:
#   UMBRADB_LOCAL_NODE  the node's WebSocket address (required), ws or wss://<host>:9944
#   TEMPLATE            the template database to clone (required)
#   BENCH_CHAIN         the core entry's network (default preprod)
#   TRACE               "off" runs without the block trace (default: traced, UMBRADB_TRACE=<run folder>/trace.jsonl)
#   SWEEP               the core entry's sweep (default on); SWEEP_OFF_FROM=<height> adds a second core revision from
#                       that height with the sweep off (a development setting)
#   CORE_EXTRA          more settings of the core entry, as JSON members after a comma, e.g.
#                       CORE_EXTRA=',"prefetchWindow":128'
#   PREPARE_SQL         a file of SQL run on the clone before the run
#   UPGRADE             set to 1 for a BUILD whose core version is not the template's (other ledger packages): the
#                       configuration then keeps each of the template's core revisions as a version entry, with
#                       the core version and the data settings the clone's configuration history records for it, and
#                       BUILD's core revision starts at the clone's height + 1
#   NODE_FLAGS          flags for the run's node, e.g. "--cpu-prof --cpu-prof-dir=<run folder>"
#   STALL_LIMIT         seconds the cursor may stay where it is before the run is stopped as stuck (default 900)
#
# Writes $BENCH_DIR/<label>/: umbradb.config.ts, run.log, status.jsonl, pg_stat_statements.csv, table_stats.csv,
# result.json and the trace's files. Its database is <prefix><label with - as _>, its container
# umbradb-bench-run-<label>. Touches only the bench's own Docker objects.
#
# What it removes and drops is a run's own, checked before anything is changed: the label's folder only if it is
# empty or an earlier run's of this label in this place (its marker, .bench-run, written below), never the password
# file's; the label's database only if an earlier run.sh made it (its comment, written below), never a template; and
# only once the container, the network, the password file and the template are there. Exit status 2: refused, nothing
# changed.
set -euo pipefail
. "$(dirname "$0")/lib.sh"
if [ $# -lt 2 ]; then echo "usage: run.sh <label> <stop-height> [KEY=VALUE ...]" >&2; exit 2; fi
LABEL="$1"; STOP="$2"; shift 2
check_label "$LABEL"
case "$STOP" in ""|*[!0123456789]*) echo "the stop height is a number: $STOP" >&2; exit 2;; esac
if [ -z "${UMBRADB_LOCAL_NODE:-}" ]; then echo "set UMBRADB_LOCAL_NODE to the node's WebSocket address" >&2; exit 2; fi
if [ -z "${TEMPLATE:-}" ]; then echo "set TEMPLATE to the template database to clone" >&2; exit 2; fi
# A name that goes into SQL as it is: lowercase letters, digits and _, listed (see check_label).
check_name() { case "$2" in ""|*[!abcdefghijklmnopqrstuvwxyz0123456789_]*) echo "$1 is lowercase letters, digits and _: $2" >&2; exit 2;; esac; }
check_name "a template's name" "$TEMPLATE"
if [ ! -f "$BUILD/dist/cli/main.js" ]; then echo "$BUILD is not built: run npm run build there" >&2; exit 2; fi
DB="$(database_of "$LABEL")"
OUT="$BENCH_DIR/$LABEL"
RUN="$(run_container_of "$LABEL")"
PACKAGE='{"type":"module","private":true}'
MARK="a run of the range bench, bench/range/run.sh"
# The marker of a run's folder: what run.sh writes in it, naming the label and the folder with every link resolved.
# Nothing else makes a folder a run's, a package.json least of all: any project of ES modules has that one.
MARKER=".bench-run"
marker_of() { printf 'a run folder of the range bench, bench/range/run.sh\nlabel %s\nfolder %s\n' "$LABEL" "$(cd -P "$1" && pwd -P)"; }
STALL_LIMIT="${STALL_LIMIT:-900}"
refuse() { echo "run.sh: $*; nothing was changed" >&2; exit 2; }

check_name "the database prefix (BENCH_DB_PREFIX)" "$BENCH_DB_PREFIX"
case "$TEMPLATE" in "$BENCH_DB_PREFIX"*) refuse "the template $TEMPLATE begins with the runs' prefix $BENCH_DB_PREFIX, so a run's label could name it";; esac
[ "${#DB}" -le 63 ] || refuse "the database name $DB is longer than the 63 bytes PostgreSQL keeps of a name"
case "$STALL_LIMIT" in ""|*[!0123456789]*) refuse "STALL_LIMIT is a number of seconds: $STALL_LIMIT";; esac
case "$BENCH_PG_PASSWORD_FILE" in "$OUT"|"$OUT"/*) refuse "the label $LABEL names the password file or its folder ($BENCH_PG_PASSWORD_FILE)";; esac
# A folder run.sh may empty: none, an empty one, or one an earlier run of this label made in this place (its marker
# says so). A link is none of them, nor is a marker that is a link.
run_folder() {
  if [ -L "$1" ]; then return 1; elif [ ! -e "$1" ]; then return 0; fi
  [ -d "$1" ] || return 1
  [ -z "$(ls -A "$1")" ] || { [ -f "$1/$MARKER" ] && [ ! -L "$1/$MARKER" ] && [ "$(cat "$1/$MARKER")" = "$(marker_of "$1")" ]; }
}
run_folder "$OUT" || refuse "$OUT is not a run's folder: move it, or choose another label"
command -v curl >/dev/null && command -v node >/dev/null || refuse "curl and node are needed on this machine"
[ -r "$BENCH_PG_PASSWORD_FILE" ] && [ -s "$BENCH_PG_PASSWORD_FILE" ] || refuse "no password in $BENCH_PG_PASSWORD_FILE (BENCH_PG_PASSWORD_FILE)"
[ "$(docker inspect -f '{{.State.Running}}' "$BENCH_PG_CONTAINER" 2>/dev/null)" = true ] || refuse "the database container $BENCH_PG_CONTAINER is not running"
docker network inspect "$BENCH_NETWORK" >/dev/null 2>&1 || refuse "there is no Docker network $BENCH_NETWORK"
[ "$(bench_psql -c "SELECT count(*) FROM pg_database WHERE datname = '$TEMPLATE'" 2>/dev/null)" = 1 ] || refuse "there is no template database $TEMPLATE in $BENCH_PG_CONTAINER"
EXISTING="$(bench_psql -c "SELECT datistemplate || '|' || coalesce(shobj_description(oid, 'pg_database'), '') FROM pg_database WHERE datname = '$DB'")" || refuse "could not read the databases of $BENCH_PG_CONTAINER"
case "$EXISTING" in
  ""|"false|$MARK") ;;
  "true|"*) refuse "the database $DB is marked as a template";;
  *) refuse "the database $DB exists and was not made by run.sh: drop it yourself, or choose another label";;
esac

docker rm -f "$RUN" >/dev/null 2>&1 || true
rm -rf "$OUT"; mkdir "$OUT"
marker_of "$OUT" > "$OUT/$MARKER"
mkdir "$OUT/node_modules"
ln -s "$BUILD" "$OUT/node_modules/umbradb"
echo "$PACKAGE" > "$OUT/package.json"
bench_psql -c "DROP DATABASE IF EXISTS $DB WITH (FORCE)" -c "CREATE DATABASE $DB TEMPLATE $TEMPLATE" -c "COMMENT ON DATABASE $DB IS '$MARK'"
if [ -n "${PREPARE_SQL:-}" ]; then bench_psql -d "$DB" -f - < "$PREPARE_SQL"; fi
bench_psql -d postgres -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements" -c "SELECT pg_stat_statements_reset()" >/dev/null
bench_psql -d "$DB" -c "CHECKPOINT" >/dev/null

CONFIG="{\"network\":\"${BENCH_CHAIN:-preprod}\",\"node\":\"$UMBRADB_LOCAL_NODE\",\"database\":{\"kind\":\"postgres\",\"host\":\"$BENCH_PG_CONTAINER\",\"port\":5432,\"user\":\"postgres\",\"name\":\"$DB\",\"ssl\":\"disable\"},\"listen\":{\"admin\":\"0.0.0.0:8081\"},\"sweep\":\"${SWEEP:-on}\"${CORE_EXTRA:-}}"
# The core revisions the clone's configuration history records, as entries: each with its core version and its data
# settings. $1 limits them (a condition on a row of core_chain.config).
recorded_revisions() {
  bench_psql -d "$DB" -c "SELECT format('    versionEntry({ id: \"core\", start: %s, version: %s, config: %s }),', start, version, data) FROM core_chain.config WHERE entry_id = 'core' AND $1 ORDER BY start"
}
if [ "${UPGRADE:-}" = 1 ]; then
  CURSOR="$(bench_psql -d "$DB" -c "SELECT max(height) FROM core_block_commit.blocks")"
  # Every recorded revision stays as recorded; BUILD's own starts after the cursor.
  CORE_ENTRIES="$(recorded_revisions true)
    coreEntry({ start: $((CURSOR + 1)), stop: $STOP, config: $CONFIG }),"
elif [ -n "${SWEEP_OFF_FROM:-}" ]; then
  OFF="${CONFIG/\"sweep\":\"on\"/\"sweep\":\"off\",\"developmentOptIn\":true}"
  CORE_ENTRIES="    coreEntry({ start: 0, config: $CONFIG }),
    coreEntry({ start: $SWEEP_OFF_FROM, stop: $STOP, config: $OFF }),"
else
  # A template whose sync went on with another build records more than one core revision: the earlier ones stay as
  # recorded, and BUILD continues the last one from its start.
  LAST_START="$(bench_psql -d "$DB" -c "SELECT coalesce(max(start), 0) FROM core_chain.config WHERE entry_id = 'core'")"
  EARLIER="$(recorded_revisions "start < $LAST_START")"
  CORE_ENTRIES="${EARLIER:+$EARLIER
}    coreEntry({ start: $LAST_START, stop: $STOP, config: $CONFIG }),"
fi
cat > "$OUT/umbradb.config.ts" <<CONFIG_FILE
import { CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, CORE_LEDGER_STATE, CORE_CONTRACT_STATES, CORE_CONTRACT_LOGS_FULL, coreEntry, defineConfig, versionEntry } from "umbradb";

export default defineConfig({
  entries: [
$CORE_ENTRIES
    CORE_CHAIN_EVENTS.entry({ start: 0, config: {} }),
    CORE_BLOCK_PARSED.entry({ start: 0, config: {} }),
    CORE_TX_RESULTS.entry({ start: 0, config: {} }),
    CORE_LEDGER_STATE.entry({ start: 0, config: {} }),
    CORE_CONTRACT_STATES.entry({ start: 0, config: {} }),
    CORE_CONTRACT_LOGS_FULL.entry({ start: 0, config: {} }),
  ],
});
CONFIG_FILE

ENVS=()
if [ "${TRACE:-on}" != off ]; then ENVS+=(-e "UMBRADB_TRACE=$OUT/trace.jsonl"); fi
for kv in "$@"; do ENVS+=(-e "$kv"); done
# From here the run's container exists: it is removed however run.sh ends, an interrupt included.
trap 'docker rm -f "$RUN" >/dev/null 2>&1 || true' EXIT
trap 'echo "run.sh: interrupted; the run container is removed" >&2; exit 130' INT TERM
# shellcheck disable=SC2086  # NODE_FLAGS is a list of flags
docker run -d --name "$RUN" --network "$BENCH_NETWORK" --env-file <(printf 'PGPASSWORD=%s\n' "$(cat "$BENCH_PG_PASSWORD_FILE")") \
  ${ENVS[@]+"${ENVS[@]}"} -v "$BUILD:$BUILD:ro" -v "$OUT:$OUT" -w "$OUT" -p 127.0.0.1::8081 "$BENCH_NODE_IMAGE" \
  node ${NODE_FLAGS:-} "$BUILD/dist/cli/main.js" run --config "$OUT/umbradb.config.ts" >/dev/null
# A process that ended at once has no port: the loop below then ends and its log is kept.
PORT="$(docker port "$RUN" 8081/tcp 2>/dev/null | head -1 | sed 's/.*://')" || PORT=""

LAST=""; CURSOR=""; MOVED="$SECONDS"; STALLED=""
while :; do
  if [ "$(docker inspect -f '{{.State.Running}}' "$RUN" 2>/dev/null)" != "true" ]; then break; fi
  S="$(curl -s -f -m 2 "http://127.0.0.1:$PORT/status" || true)"
  if [ -n "$S" ] && [ "$S" != "$LAST" ]; then
    LAST="$S"; NOW="$(node -e 'console.log(Date.now())')"
    # A sample is kept only if it is JSON: an answer cut by the timeout is not.
    STATE="$(echo "$S" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log((j.state??"")+" "+(j.cursor??""))}catch{}})')"
    if [ -n "$STATE" ]; then
      echo "{\"at\":$NOW,\"status\":$S}" >> "$OUT/status.jsonl"
      case "$STATE" in stopped*|halted*|refused*) break;; esac
      if [ "${STATE#* }" != "$CURSOR" ]; then CURSOR="${STATE#* }"; MOVED="$SECONDS"; fi
    fi
  fi
  if [ $((SECONDS - MOVED)) -ge "$STALL_LIMIT" ]; then
    STALLED=1; echo "run.sh: the cursor has not moved for $STALL_LIMIT s (STALL_LIMIT): the run is stopped" >&2; break
  fi
  sleep 0.25
done
# Stopped with SIGTERM, so the process closes cleanly and the trace is written to its end.
docker stop -t 120 "$RUN" >/dev/null 2>&1 || true
docker logs "$RUN" > "$OUT/run.log" 2>&1 || true
docker rm -f "$RUN" >/dev/null 2>&1 || true
bench_psql -d postgres -c "COPY (SELECT calls, round(total_exec_time::numeric,2) AS exec_ms, round((total_plan_time)::numeric,2) AS plan_ms, rows, shared_blks_hit, shared_blks_read, wal_bytes, left(regexp_replace(query, '\s+', ' ', 'g'), 400) AS query FROM pg_stat_statements s JOIN pg_database d ON d.oid = s.dbid WHERE d.datname = '$DB' ORDER BY total_exec_time DESC) TO STDOUT WITH (FORMAT csv, HEADER)" > "$OUT/pg_stat_statements.csv"
bench_psql -d "$DB" -c "COPY (SELECT schemaname||'.'||relname AS t, seq_scan, idx_scan, idx_tup_fetch, n_tup_ins, n_tup_upd, n_tup_hot_upd, n_tup_del, n_live_tup, n_dead_tup FROM pg_stat_user_tables WHERE schemaname LIKE 'core%' ORDER BY 1) TO STDOUT WITH (FORMAT csv, HEADER)" > "$OUT/table_stats.csv"
node "$SCRIPTS/summary.mjs" "$OUT" | tee "$OUT/result.json"
[ -z "$STALLED" ] || exit 1
