# The range bench

How fast one build of UmbraDB syncs a fixed range of heights of a real chain, where each block's time goes, and
whether two builds stored the same thing. Each run starts from a fresh clone of one template database, so runs
differ only by their build and their environment.

It is for measuring a change of the sync: run the build before and the build after over the same heights, then read
the two runs side by side.

Nothing here is part of the package or of the test suite's inputs. The scripts hold no local path, address or
password: everything of the machine comes from the environment.

Beside the repository's other two measurements: `npm run bench` and `npm run bench:smoke` time one function of the
core on an empty database, and `scripts/local-preprod-sync.mjs` syncs a build from genesis in a database of its own.
This bench starts at any height a template stops at, which is what makes a range far from genesis a run of minutes,
and it reads the block trace.

## What a run needs

| What | How it is named | Default |
|---|---|---|
| A folder for the run folders | `BENCH_DIR` | required |
| A built checkout of UmbraDB (`npm ci`, `npm run build`) | `BUILD` | the checkout these scripts are in |
| A Midnight node's WebSocket address, with the range's blocks and states | `UMBRADB_LOCAL_NODE` | required |
| The network that node is on | `BENCH_CHAIN` | `preprod` |
| A PostgreSQL 18 container with `pg_stat_statements` loaded | `BENCH_PG_CONTAINER` | `umbradb-bench-pg` |
| The Docker network that container is on | `BENCH_NETWORK` | `umbradb-bench-net` |
| A file with the `postgres` user's password, mode 600 | `BENCH_PG_PASSWORD_FILE` | `$BENCH_DIR/pg-password` |
| A template database in that container | `TEMPLATE` | required |
| The prefix of a run's database name | `BENCH_DB_PREFIX` | `bench_` |
| The image a run uses | `BENCH_NODE_IMAGE` | `node:24.9.0-alpine` |
| Node.js 24, Docker and curl on the host | | |

`preflight.sh [<template>=<height> ...]` checks all of it and changes nothing.

The password is read from its file and given to containers through their environment. It is never printed, never on
a command line, and the file is never under version control.

### The database container

```bash
(umask 077 && node -e 'console.log(require("node:crypto").randomBytes(24).toString("hex"))' > "$BENCH_DIR/pg-password")
docker network create umbradb-bench-net
docker volume create umbradb-bench-pgdata
docker run -d --name umbradb-bench-pg --network umbradb-bench-net -p 127.0.0.1::5432 \
  --env-file <(printf 'POSTGRES_PASSWORD=%s\n' "$(cat "$BENCH_DIR/pg-password")") \
  -v umbradb-bench-pgdata:/var/lib/postgresql postgres:18-alpine \
  -c max_connections=200 -c shared_buffers=2GB -c shared_preload_libraries=pg_stat_statements \
  -c pg_stat_statements.track=all -c track_io_timing=on
```

Use the image digest `test/postgres-image.ts` pins. A run reaches the database by the container's name on that
network, not through a port of the host, so that the measurement is not one of Docker's port forwarding.

### A template

A template is a database no session is connected to, which `CREATE DATABASE … TEMPLATE` clones in seconds. A run
clones it, continues the clone to its stop height and leaves the template as it was. It must be in the bench's own
database container, and hold only what the configuration `run.sh` writes can continue: `core` entries from height 0
(one, or several revisions of which the last is continued, see "A build with other ledger packages") and the core
modules chain events, parsed blocks, transaction results, ledger state, contract states and full contract logs, with
the sweep on.

- **The first one** is a database synced from genesis to the height where the range begins, by the build the
  template is for, with a configuration of that shape. `scripts/local-preprod-sync.mjs --label <name> --stop
  <height> --out <dir> --keep` writes one (the sweep is on unless `--sweep off`), and with `--keep` its database
  container `umbradb-lp-<name>-pg`, which holds the database `umbradb`, stays. That server is not the bench's (it has
  no `pg_stat_statements`, and a run clones a template only within one server), so the database is moved into the
  bench's container, as PostgreSQL moves any database between servers: the roles that own the modules' schemas
  first, since a database's dump does not hold roles; then the database, its owners kept.

  **Not run end to end.** The commands below follow PostgreSQL's tools and the two scripts' settings, and have not
  been run as a whole. `--no-role-passwords` and the `grep` keep the kept server's `postgres` role, and its
  password, out of the bench's server; the modules' roles have no password.

  ```bash
  KEPT=umbradb-lp-<name>-pg
  docker exec "$KEPT" pg_dumpall -U postgres --roles-only --no-role-passwords \
    | grep -E '^(CREATE ROLE|ALTER ROLE|GRANT) umbradb_[mi]_' \
    | docker exec -i umbradb-bench-pg psql -U postgres -v ON_ERROR_STOP=1
  docker exec umbradb-bench-pg createdb -U postgres <template>
  docker exec "$KEPT" pg_dump -U postgres -Fc umbradb \
    | docker exec -i umbradb-bench-pg pg_restore -U postgres --exit-on-error -d <template>
  docker exec umbradb-bench-pg psql -U postgres -c "ALTER DATABASE <template> IS_TEMPLATE true"
  bench/range/preflight.sh <template>=<height>     # the template's cursor is at the height
  ```
- **At a later height**: sync a clone of a template to it with `run.sh <label> <height>`, then
  `docker exec umbradb-bench-pg psql -U postgres -c "CREATE DATABASE <template> TEMPLATE bench_<label> IS_TEMPLATE true"`.

A template's name is lowercase letters, digits and `_`, and does not begin with the runs' prefix (`bench_`), which
`run.sh` refuses: a run's label could otherwise name it. `IS_TEMPLATE true` makes PostgreSQL refuse to drop it, and
`run.sh` never drops a database so marked. A template can be continued by the build that synced it and by a later
build that stores the same; for a build with other ledger packages see "A build with other ledger packages" below.

### Choosing a range

A block without transactions and a block with them cost very different amounts, so a speed is a speed on a range.
`txshare.mjs [<height> ...]` asks the node for 400 consecutive blocks from each height, and from 20,000, 2,000 and
400 below the head, and prints the share of blocks with transactions and the mean transactions per block:

```bash
UMBRADB_LOCAL_NODE=ws://<host>:9944 node bench/range/txshare.mjs <height> <height>
```

- Measure a change on at least two ranges, one where few blocks carry transactions and one where many do: a change
  that helps one can cost the other.
- A few thousand heights are enough for the stage means; the first heights of a process load the ledger package and
  the stored state, and the readers leave the first one out (`worker.mjs` and `worker-time.mjs` the first 20). For
  speeds read by hand from part of a run, leave out the first few hundred.
- A range that crosses a change of ledger version measures the conversion, which takes minutes: keep it apart.

## One run

```bash
export BENCH_DIR=<folder> UMBRADB_LOCAL_NODE=ws://<host>:9944
TEMPLATE=<template> bench/range/run.sh my-label <stop-height>
```

`npm run bench:range -- my-label <stop-height>` is the same.

- Drops and clones the database `bench_my_label`, writes `$BENCH_DIR/my-label/umbradb.config.ts`, and runs
  `node $BUILD/dist/cli/main.js run` in the container `umbradb-bench-run-my-label` on the bench network until the
  `core` entry's stop height.
- Removes and drops only a run's own: the label's folder if it is empty or an earlier run's, and the label's database
  if an earlier `run.sh` made it (it puts a comment on each), never a database marked as a template. It first checks
  that the container is running, the network, the password file and the template are there; a refusal (status 2)
  changes nothing.
- An interrupt removes the run's container. A run whose cursor has not moved for `STALL_LIMIT` seconds (900 unless
  given; a range that crosses a change of ledger version converts for minutes) is stopped, and `run.sh` ends with
  status 1.
- Records, in `$BENCH_DIR/my-label/`: `status.jsonl` (each change of `/status`), `run.log`,
  `pg_stat_statements.csv`, `table_stats.csv`, `result.json` (heights per second), and the block trace.
- Arguments after the stop height are `KEY=VALUE` pairs for the run's environment.
- `CORE_EXTRA` adds settings to the run's `core` entry, as JSON members after a comma:
  `CORE_EXTRA=',"prefetchWindow":128' run.sh …`. A setting under test is given this way to one run and not to the
  other.
- `BUILD=<another checkout>` runs that checkout's build. Two builds are compared from two checkouts, each built.
- `NODE_FLAGS="--cpu-prof --cpu-prof-dir=$BENCH_DIR/my-label"` writes CPU profiles, which `profile.mjs` reads.
- A label is lowercase letters, digits and `-`.
- Do not edit `run.sh` while a run is in progress: bash reads it as it executes.
- One run at a time on a machine: two runs share the database server and the node.
- Drop a run's database once its results are recorded:
  `docker exec umbradb-bench-pg psql -U postgres -c "DROP DATABASE bench_my_label WITH (FORCE)"`.

### The block trace

`run.sh` sets `UMBRADB_TRACE=<run folder>/trace.jsonl`, which makes `umbradb run` write where each height's time
went. The trace is off in any process that does not set the variable. `TRACE=off run.sh …` runs without it, to
measure what the trace itself costs; such a run has `result.json` and nothing for the other readers.

The [operator guide](../../docs/operator-guide.md#measuring-a-sync-the-block-trace) says what the trace's three
files hold and what each key means. What the readers take from them:

- `trace.jsonl`, one line per committed height: the stages of the main thread's block, the reclamation step's reads
  and sizes, the statements, the round trips of the ledger worker's requests, and `sh`, the chain of step outputs;
- `trace.jsonl.stmts.json`: each statement text's count and client time;
- `trace.jsonl.worker.jsonl`, one line per block the ledger worker applied: where the worker thread's time went
  since the line before.

`run.sh … UMBRADB_TRACE_STEPS=1` adds each step's count changes, new nodes and deleted nodes to a height's line.

A later build may write keys an earlier one does not. The readers print a stage, a phase or a column only where its
key is in the trace, so a run of an older build and a run of a newer one can be read side by side.

## Reading runs

Each takes run folders (`$BENCH_DIR/<label>`) or, for the `.sh` scripts, labels. A run that did not end well is said
in one line, not a stack, with status 1: an empty trace, a run whose cursor never moved (see its `run.log`), a trace of
one height. A trace's last line cut mid-write (a run stopped by a signal) is left out, with a note on standard error.
The `.mjs` readers share `lines.mjs` for this.

| Script | Gives |
|---|---|
| `summary.mjs a` | heights per second by the clock, from the `/status` samples, and how often the node client retried (`run.sh` writes it to `result.json`) |
| `compare.mjs a b …` | speed with and without the waits for the node, stage means, statements and keys read per block, and whether each run's chain of step outputs equals the first's (exit 1 if one differs) |
| `analyze.mjs a` | stages by kind of block, the step's reads, each statement's client and server time |
| `worker.mjs a b …` | the phases of the worker's apply, for empty blocks and blocks with transactions |
| `worker-time.mjs a b …` | the worker's whole time between two applied blocks as a table that adds up to its span (the apply's stages without their node waits, the node waits, each other request type, posting answers, transit, idle, unaccounted), with queued time and garbage collection apart; whether the worker is saturated (idle under 5% of its span) or waiting for work; then the main thread's block: its wait for the worker's apply, its other stages, and each request type's round trip. A run whose worker lines have no `spanMs` is named and not read (exit 1) |
| `equal.sh a b …` | per-table digests and node-table contents of each run's database (exit 2 if a run could not be read) |
| `contents-hash.sh a b …` | the exported contents hash of each run's database |
| `tables.sh a b …` | for every table any of the runs has, each run's row count and a hash of its rows (`absent` where a run has no such table), the tables that differ from the first run's marked, and the number of differences: exit 0 if none, 1 if some; exit 2, with no count, if a database or a table could not be read |
| `profile.mjs a` | self time by function, from a run made with `NODE_FLAGS="--cpu-prof --cpu-prof-dir=<run folder>"` |
| `roundtrip.sh a` | what one statement costs from a run's container to the database, by kind of statement: the machine's floor under every statement of a block |
| `txshare.mjs [<height> …]` | the share of blocks with transactions near heights of the chain, from the node |

`worker.mjs` and `worker-time.mjs` take `SKIP=<n>` (the lines left out as warm-up, 20 by default) and `FROM=<height>`
and `TO=<height>`.

## Comparing two runs

```bash
node bench/range/compare.mjs $BENCH_DIR/base $BENCH_DIR/changed
```

- **Compare builds by `own h/s`**, the speed without the waits for the node, between runs whose `wait` column is
  near 0. `h/s` is what the clock saw, the node's answers included.
- **Then by the stage the change is about** (`apply`, `step`, `blk-tx`, `cnt-wr`; `analyze.mjs`, `worker.mjs` and
  `worker-time.mjs` for more): a stage's mean over a few thousand blocks moves less with the machine than the whole
  block does.
- **`stmts`, `reads`, `cnt-keys` and `row-keys` do not depend on the machine at all**: a change that claims fewer
  statements or keys per block shows it exactly, in any run.
- The last column says whether the run computed the same steps as the first run (`same` or `DIFFERENT`). Two runs
  from one template to one stop height must say `same`, whatever their builds, unless the change is meant to store
  something else.

## Two builds stored the same

A change that claims to store the same contents is run on every range beside a run of the build before it, and:

1. `compare.mjs base changed` says `same` for the chain of step outputs;
2. `equal.sh base changed` prints the same digests and node-table hashes;
3. `contents-hash.sh base changed` prints the same hash;
4. `tables.sh base changed` ends with `differences from base: 0` and exit status 0.

`tables.sh` reads every row of every table of the core's and the modules' schemas; on a database of tens of gigabytes
that takes minutes. A table's hash is a sum over its rows (the first 64 bits of each row's MD5), so it needs no sort
and reads a table of any size. A table only one run has is a difference. A read that fails is never taken for
equality: the table is marked `NOT READ` and the script ends with `not compared` and status 2.

### A build with other ledger packages

A build whose vendored ledger packages differ from those of the build that synced a template has another core
version, and a database keeps the core version of each `core` revision. With `UPGRADE=1`, `run.sh` writes the run's
configuration as an upgrade: each `core` revision of the template stays as a `versionEntry`, with the core version
and the data settings the clone's configuration history records, and the build's own `core` revision starts at the
clone's height + 1.

A template that already records more than one `core` revision needs no `UPGRADE` for the build of its last revision:
`run.sh` keeps the earlier revisions as recorded and continues the last one from its start.

```bash
UPGRADE=1 TEMPLATE=<template> bench/range/run.sh my-label <stop-height>
```

Such a run records one more revision in `core_chain.config`, which the contents hash covers: its contents hash is
equal to that of another upgraded run of the same build, and not to a run of the template's build. To compare the two,
`tables.sh base changed` must mark `core_chain.config` and no other table.

## Noise

A run reads its blocks and each block's state root from the node, so a node that answers late holds the run up, and
the wait comes and goes whatever the build is. So:

- `result.json` counts the node client's retries (`nodeRetries`); a run with any is made again;
- `compare.mjs` prints `own h/s` beside the clock's `h/s`. Own speed is a little high for a run that waited (7% for
  one that waited 3.3 ms per block), so a run with a large `wait` is made again.

Speed also depends on what else the machine runs. Runs of one build over the same heights have differed by up to 4%
on a quiet machine and by more than 10% beside other work. Treat a difference of own speed under 5% as noise, compare
against a baseline made the same day, and for a change of a few percent read its stage and the statements per block
rather than the whole block.
