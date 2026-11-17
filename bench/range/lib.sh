# Settings shared by the range bench's scripts (sourced, not run). Every local path, address and Docker name comes
# from the environment; see README.md.
#   BENCH_DIR               the folder that holds the run folders (required)
#   BUILD                   a built checkout of UmbraDB (default: the checkout these scripts are in)
#   BENCH_PG_CONTAINER      the PostgreSQL container (default umbradb-bench-pg)
#   BENCH_NETWORK           the Docker network the container is on (default umbradb-bench-net)
#   BENCH_PG_PASSWORD_FILE  the file holding the postgres user's password (default $BENCH_DIR/pg-password)
#   BENCH_NODE_IMAGE        the image a run uses (default node:24.9.0-alpine)
#   BENCH_DB_PREFIX         the prefix of a run's database name (default bench_)
SCRIPTS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -z "${BENCH_DIR:-}" ]; then echo "set BENCH_DIR to the folder that holds the run folders" >&2; exit 2; fi
BENCH_DIR="$(cd "$BENCH_DIR" && pwd)" || exit 2
BUILD="${BUILD:-$(cd "$SCRIPTS/../.." && pwd)}"
BENCH_PG_CONTAINER="${BENCH_PG_CONTAINER:-umbradb-bench-pg}"
BENCH_NETWORK="${BENCH_NETWORK:-umbradb-bench-net}"
BENCH_PG_PASSWORD_FILE="${BENCH_PG_PASSWORD_FILE:-$BENCH_DIR/pg-password}"
BENCH_NODE_IMAGE="${BENCH_NODE_IMAGE:-node:24.9.0-alpine}"
BENCH_DB_PREFIX="${BENCH_DB_PREFIX:-bench_}"

# The database of a run label: the prefix, then the label with - as _.
database_of() { printf '%s%s' "$BENCH_DB_PREFIX" "${1//-/_}"; }
# The container of a run label.
run_container_of() { printf 'umbradb-bench-run-%s' "$1"; }
# psql in the PostgreSQL container, as the postgres user.
bench_psql() { docker exec -i "$BENCH_PG_CONTAINER" psql -U postgres -q -At -v ON_ERROR_STOP=1 "$@"; }
# A label is lowercase letters, digits and -; it names a folder, a database and a container.
check_label() { case "$1" in ""|*[!a-z0-9-]*) echo "a label is lowercase letters, digits and -: $1" >&2; exit 2;; esac; }
# Runs node in the run image on the bench network with the password in its environment (never on a command line),
# the build mounted read-only at its own path and these scripts at /scripts.
bench_node() {
  docker run --rm --network "$BENCH_NETWORK" --env-file <(printf 'PGPASSWORD=%s\n' "$(cat "$BENCH_PG_PASSWORD_FILE")") \
    -e "BENCH_PG_HOST=$BENCH_PG_CONTAINER" -v "$BUILD:$BUILD:ro" -v "$SCRIPTS:/scripts:ro" "$BENCH_NODE_IMAGE" node "$@"
}
