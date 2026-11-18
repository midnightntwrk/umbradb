# Changelog

All notable changes to UmbraDB are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

_No unreleased changes._

## [0.10.0] - 2026-10-27

### Breaking changes

UmbraDB 0.10.0 is a new architecture: nothing of 0.9.5's API or databases is carried over.

### Added

- **The indexer core.** It reads finalized blocks from a Midnight node and commits each height in one database
  transaction, on PostgreSQL 18 or PGlite, in Node.js or (for development) a browser: bootstrap and startup checks,
  finalized processing with prefetch, the in-memory best-block queue, block 0, start and stop heights, the upgrade
  boundary stop, and refusals and halts with their codes.
- **The runner and modules.** Modules attach to the runner's named points; module APIs answer with a view, height and
  hash envelope and `X-Umbra-Version`. The backbone parts `core-chain`, `core-block-fetch`, `core-block-commit`,
  `core-digest`, `core-health`, `core-status` and `core-config` (and `core-private-source` on a private process), and
  the core modules `core-chain-events`, `core-block-parsed`, `core-tx-results`, `core-ledger-state`,
  `core-contract-states`, `core-contract-logs-full` and the development-only `core-contract-logs-fast`, each off unless
  the configuration enables it. Each part and core module carries the build's version.
- **The database API** over PostgreSQL and PGlite: read and write handles, a role and schema per module, per-module
  migrations, the single-writer lock, the durability probe, and the `deterministic_postgresql` rules.
- **Configuration in TypeScript** (`umbradb.config.ts`): zod settings schemas, a recorded configuration history with
  future-only revisions, and one version per build. The database is given as parts with an `ssl` mode, never a
  connection string, and a core on PostgreSQL reads its transport with a login that may only read.
- **The ledger:** version selection from the runtime's digest with built-in network tables, the vendored ledger
  packages v8 and v9 (the rc.3 build runtime 2.0 uses, the rc.5 release runtime 2.1.0 uses and `ledger-9.1.0.1`, which
  runtime 2.1.100 on uses) behind one adapter interface, the v8 to v9 conversion, the ledger worker and its tasks, the
  ledger state stored in the database with a retention window and a mark-and-sweep, and the state-root check on every
  block.
- **Private processes:** binding to a public database, block intake from it, the process transport with opt-in mutual
  TLS, independent and lockstep instances, and the public configuration hash a private process accepts.
- **Determinism and backups:** the canonical encoding, the contents hash, per-table digests with checkpoints every
  14,400 heights, and backup and restore (`pg_dump` on PostgreSQL, `pglite-tools` on PGlite).
- **Storage helpers:** the cursor table and the height-versioned table.
- **Admin endpoints** `/health/live`, `/health/ready`, `/status` and `/config`, and timeouts by connection role with
  the `slow-block` condition.
- **The `umbradb` command:** `run`, `config check`, `backup` and `restore`.
- **Testing tools:** the test tape (record and replay of a node's answers) and the tape-apply baseline.
- **Ingest speed:** the ledger root is requested in the finalized prefetch, PostgreSQL prepares the statements it
  repeats, and the fixed statements of each block are fewer (about 77 per block instead of 101 on PostgreSQL, 72
  instead of 111 on PGlite). On the 2,000-block preprod tape: 22.1 → 11.7 ms per block on PostgreSQL and 32.3 → 19.8 ms
  on PGlite, with every core table unchanged.

### Changed since `v0.10.0-rc.1`: UmbraDB as a library (`start-umbradb`)

**Breaking for users of `v0.10.0-rc.1`.** A program that ran UmbraDB through `startProcess` moves to `startUmbraDB`,
whose defaults, refusals and rejections differ, and a configuration that writes `listen.transport` or `coreTransport`
is refused. For the `umbradb` command, only those two keys break. The change is the OpenSpec change
`start-umbradb`.

- **Breaking: the renamed settings.** `listen.transport` is now `listen.privateLink`, and `coreTransport` is now
  `privateLink`. A configuration that writes an old key is refused by every command and by `startUmbraDB`:
  `invalid-configuration`, with the finding `renamed-setting` at the old key's path, naming the new key.
- **Breaking: the removed exports.** `startProcess`, `ProcessHandle`, `ProcessState`, `runLedgerWorker` and
  `BlockSource` are no longer exported; the engine they started is internal. A host program calls `startUmbraDB`
  instead, which assembles UmbraDB's own parts and core modules itself, from the user modules alone (issue 00053), and
  gives a module file that declares ledger tasks as `modulesFrom`, which the ledger worker imports too, in place of a
  worker entry of its own calling `runLedgerWorker`.
- **Breaking: what a host program gets by default.** Nothing that `startProcess` did to its program: no log on stderr
  (lines go to `log` when given, with the worker threads' output), no admin listener at `listen.admin`'s address or
  `0.0.0.0:8081`, no module API or private link at their written addresses, no SIGUSR2 listener, no
  `umbradb.config.ts` read unless named. Each surface listens only when the `network` option asks; an address the
  configuration writes that the request does not use is refused, `network-address-conflict` (`unused`), so a file
  shared with `umbradb run` that writes `listen.admin` needs `network: { admin: true }`. `backupAtStop` and
  `backupOnSignal` are refused there (`library-setting-refused`): the host calls `backup(target)`.
- **Breaking: `started`'s rejection.** It rejects with an `UmbraError` whose code is the reason code `status()` shows
  (the failure itself when it is one, else a new one whose `cause` is the failure: `callback-error` for a module
  callback, `listen-failed` for a listener, `database-error` otherwise), and, when `stop()` or the host's `signal`
  stopped startup, with the abort reason: the signal's `reason`, or an `AbortError` for `stop()`.
- **Breaking: the browser demo.** Its configuration writes no address: `listen.api`, `listen.privateLink` and
  `privateLink` are refused there (`network-address-conflict`, `unused`). Its private link runs over a `MessageChannel`
  the page makes for each connection (a `tls` setting has no effect there), its module API and admin are answered by the
  engine's own handlers, and the console's subscriptions open on a channel, `umbradb.core.openApi()`, in place of its
  `subscribe` and `unsubscribe` calls; `umbradb.links` and `dropLink` show and drop the link's channels. A user module
  with ledger tasks is refused in the page (`ledger-tasks-need-modules-from`, issue 00063).
- **Added: `startUmbraDB(options)`.** UmbraDB in the host's own process, with a handle returned at once: `status()`
  (with `listening`, each surface's bound address), `started`, `ended`, `closed` (always resolves), `stop()`,
  `pause()`, `resume()`, `backup(target)`, and handlers to mount in the host's server — `api.http` and `api.upgrade`
  (the module API, with its listener's limits and headers) and `admin.http` (the four admin endpoints, answered from
  memory). The module API answers 503 `not-serving`, with the state and the reason, while the process cannot serve.
  Options: `config` (`{ file }` or `{ data }`), `cwd`, `modules`, `modulesFrom`, `source` (an `InMemoryBlockSource`:
  then no node client is made), `signal`, `log`, `acceptPublicConfigHash` and `network`. The module guide's "trying a
  module" recipe is back, as a module test on an in-memory chain (`examples/try-module/`).
- **Added: the network request** — `api`, `admin`, and `privateLink` with `publicSide` and `privateSide` —, each off
  unless asked: `true` for the written address, `{ host, port }` for one given in code, and for the link
  `{ channels: true }` with `privateLink.accept(channel)` or `{ connect }`, over channels the host provides. Over
  channels the link keeps its socket's checks and adds its own envelope with pings, a size limit and backpressure;
  `messagePortChannel(port)` adapts a `MessagePort`. `finalizedHeight(node)` answers a node's finalized height, a start
  for a new database. The exported surface is 66 names, 28 values and 38 types, with the types of these:
  `UmbraDBOptions`, `UmbraDBHandle`, `UmbraDBStatus`, `UmbraDBStarted`, `UmbraDBEnd`, `UmbraDBBackup`,
  `UmbraDBReason`, `UmbraDBCondition`, `UmbraDBNetwork`, `PrivateLinkChannel`, `MessagePortLike`, `Address`,
  `NodeHttpHandler`, `NodeUpgradeHandler`.
- **Added: codes.** Six refusals, each before anything opens: `network-address-conflict` (`both`, `no-address`,
  `unused`), `private-link-misconfigured` (`wrong-side`, `reader-missing`), `source-refused`, `modules-given-twice`,
  `ledger-tasks-need-modules-from` and `library-setting-refused`. `callback-error` and `listen-failed`, reason codes
  already, are now `ERROR_CODES` entries too; no reason code changed, so `/status` and the log are as before.
- **Added to the admin endpoints:** `/config` has a `network` field naming how each surface is served, and shows a host
  process's addresses as bound; `/status`'s `instance.role` is null until the side is known.
- **Changed, not breaking:** the `node:sqlite` `ExperimentalWarning` (printed when a PGlite directory's lock first
  loads `node:sqlite`) no longer prints, for the command too.
- **Changed, not breaking: `/status`'s finalized head follows the node during a batch** (issue 00074). `status().head`,
  `/status`'s `head` and `node.finalizedHead`, the lag, the state and readiness come from the latest finalized head the
  block source holds (on the core, from the node's finalized-heads subscription, read without a node call), where
  before they stayed at the head the loop read when its batch began — on a new database, the chain's head when
  processing started —, so the lag was understated and the state could turn `following` near a batch's end, then
  `syncing` again. Processing is unchanged. `InMemoryBlockSource` has `latestHead()`, the block at its finalized head.
- **Changed, not breaking: a stop is logged** (issue 00072). `umbradb run` on SIGTERM or SIGINT, and a host's `log` on
  `stop()` or its `signal`, get two lines, where before they got none: when the stop begins, what asked for it and the
  height in progress (`stopping (signal: SIGTERM): height 412 is in progress; …`), and once processing has ended by it,
  the last height the process saw committed (`processing stopped (signal: SIGTERM): the last height this process saw
  committed is 412; a restart resumes after the stored cursor`).

### Changed since `v0.10.0-rc.2`: ledger nodes reclaimed by reference counting (`ledger-refcount`)

- **Ledger nodes are reclaimed by reference counting**, in place of the mark-and-sweep: each block counts the
  references its nodes gain and lose and deletes the stored nodes that nothing references or persists any more, so its
  cost follows what the block changes; a node the ledger writes again replaces its stored child list, as the node's own
  storage does; the contents hash takes the ledger's node tables (`nodes`, `ref_counts`, `unreferenced`) by the nodes
  they hold, not by their bytes; every core part with migrations has one, `001`; a failed check halts with
  `ledger-refcount-invalid`. A database or a backup written by an earlier build, `v0.10.0-rc.1` and `rc.2` included,
  is refused (`migration-checksum-changed`, `backup-build-mismatch`): resync into a new database. The change is the
  OpenSpec change `ledger-refcount`.

### Changed since `v0.10.0-rc.2`: ledger v9 at `ledger-9.1.0.1`

**Breaking for a `custom` network whose ledger table names `v9` for runtime 2.1.0, and for a module test that
depends on the in-memory source's runtime.** A ledger table's row that gives `spec_version` 2,001,000 to 2,001,099 the
name `v9` must name `v9-rc5`: the configuration is accepted as before, but those blocks are then applied with
`ledger-9.1.0.1`, and the sync halts at the first block the two releases apply differently. The blocks of
`InMemoryBlockSource` are of runtime 2,001,100 (`spec_version`), where they were of 2,001,000: a test that asserts the
number changes it, and a custom ledger table that covers 2,001,000 only halts on them with `unknown-runtime`.

- **Ledger v9 is `ledger-9.1.0.1` from runtime 2.1.100 on** (`spec_version` 2,001,100), the release `midnight-node`
  2.1.101 builds, which mainnet, Preprod and preview run. Before, every runtime from 2.1 on was applied with
  `ledger-9.1.0.0-rc.5`, whose transaction pricing and outcomes differ: a Preprod sync halted with `root-mismatch` at
  height 3,349,443, soon after the network's change to ledger v9 at 3,348,434. The rc.5 package stays, under the
  ledger name `v9-rc5`, for runtime 2.1.0 (`spec_version` 2,001,000 to 2,001,099; devnets that `midnight-node`
  2.1.0-rc.4 built): the built-in ledger tables map that range to it and 2,001,100 on to `v9`, the ledger worker
  converts a v8 state to either and carries a `v9-rc3` or `v9-rc5` state on to the next package, and `ledgerSources`
  and a ledger table's rows take `v9-rc5` as a name. The core version changes with the packages, so a database synced
  by a build that has the reference counting above continues as an upgrade: its `core` revision kept as a
  `versionEntry`, and this build's `core` entry from the next height.

### Changed since `v0.10.0-rc.2`: sync speed

- **A block trace for measuring a sync.** With `UMBRADB_TRACE=<file>` in its environment, `umbradb run` writes where
  each committed height's time went: the ledger worker's apply, the reclamation step and its reads, the block's
  transaction, every statement's client time, and the phases inside the worker with the worker thread's whole time
  between two applied blocks. It is off unless the variable is set and changes nothing that is stored. The command
  exits 1 without starting anything when it cannot open the file; a write that fails later halts processing, with
  that write's error.
  The statements' totals keep the first 1,024 texts by name and count the others in one entry, failed statements
  included. A height that failed, or whose `COMMIT` lost its answer, has one line once it is committed, and its step
  is in the chain of step outputs once.
  `UMBRADB_TRACE_STEPS=1` beside it adds each step's count changes, new nodes and deleted nodes. The trace also records
  memory at every block: `mem` in a height's line for the main thread, `ext`, `heap` and `rss` in the worker's line.
  The operator guide's "Measuring a sync: the block trace" lists the files and their keys.
- **A range bench for measuring a change of the sync** (`bench/range/`, `npm run bench:range`). A run clones a
  template database that stops at a height, syncs it on with `umbradb run` and the block trace for a number of heights
  against a node, and its readers give heights per second by the clock and without the waits for the node, each
  stage's time per block, statements and keys read per block, and where the worker thread's time went. `compare.mjs`
  reads two runs side by side; `equal.sh`, `contents-hash.sh` and `tables.sh` say whether two builds stored the same.
  It is not part of the package and changes nothing under `src/`. `bench/range/README.md` says how to make a template,
  choose a range, make a run and read it.
- **`on-settle`, a module point for a run of blocks.** A module can now declare
  `"on-settle"(processContext, run, writer)`. UmbraDB calls it for a run of heights, `{ first, last }` both included,
  inside the transaction that holds the run's last block: after every module's `on-db-write` of that block and before
  the `COMMIT`, in `on-db-write`'s order, with that transaction's block write handle. A failure there is handled as
  one of `on-db-write`. The engine chooses the runs. In this version a run is always one block. `core-digest` now
  computes a block's digests and checkpoint at `on-settle`, last, so they take what every module's `on-settle` wrote;
  a sync whose modules declare no `on-settle` sends the same statements, in the same order, as before. `BlockRun`, the
  run's type, is exported. The module guide's §3 describes the point.
- **The ledger state's reclamation runs at `on-settle`.** `core-ledger-state` now declares the point. It hands each
  block's flushed nodes and root-count changes over in memory at `on-compute`, writes only the block's own rows (root
  counts, `states`, segment results, events) at `on-db-write`, and computes the node tables once per run of blocks at
  `on-settle`, inside the transaction of the run's last block (a run is one block in this version): it reads `nodes`,
  `ref_counts` and `unreferenced`, has the ledger worker evict what it deletes, then writes the nodes, counts, queue and
  deleted rows. It reads the counts of the keys whose count falls, not of every key it reaches, so a block sends far
  fewer count reads. A refused eviction now ends the worker thread, once per attempt of the height, and the block
  commits; the next block loads the state from the database, and the refusal itself has no block applied again. The
  computation assumes undamaged count tables: on tables that lost a count row a block can commit where the earlier
  per-block step halted, and the damage is found by a later block (`ledger-refcount-invalid`) or by a backup's contents
  check. A reclamation check halts in `on-settle`, its details naming the run's `first` and `last` heights, and a block
  that breaks the ledger package's flush rule halts it too (`unreached-node`). In the block trace `stepMs`, `evictMs`
  and `reads` (now also `missing` and `queued`) are inside `txMs`, `writeBlockMs` is the block's own rows,
  `writeRefcountMs` the whole net write, `sh` has one link per run, and `collectMs` and `evictRefused` are new; the
  operator guide lists them.
- **The engine tells the ledger worker's host what became of each block's transaction; `continues`.** The engine tells
  the host when a block is written in the open transaction, committed, or rolled back. When the block's `COMMIT`
  answered, the host sends the worker the block's commit, if it had the worker apply the block, then the release of
  the parses kept up to it. `core-ledger-state` and `core-block-parsed` no longer declare `on-after-db-write`, so a
  slow-block report never names them there. The release now comes after the commit, where it came before it; a block
  the worker did not apply (where `core-block-parsed` runs without `core-ledger-state`, and the last committed block
  delivered again after a restart) gets the release alone. After a lost `COMMIT` the host is told nothing until the
  cursor is read again: a cursor at the block tells it committed, one at the block before tells it rolled back, and
  any other halts without telling the host anything, since the outcome is not known. The same holds when another
  failure is reported first (a module's handle used while the `COMMIT` runs). A stop in between tells the host
  nothing; the next start delivers the last committed block again. A block whose `on-fetch` or `on-parse` failed
  while the node source prepared it ahead is told rolled back when processing reaches its height.
  A block context now has `continues`: true when the block before was committed by this process with no failure
  between (its `COMMIT` answered in the same run of processing) and the writer still has the database session that
  committed it when the callback's context is made, false at the first height after a start or a retry, for a height
  processed again, at the re-delivery after a restart, from the first context made after the writer's session was
  replaced (on PostgreSQL a connection lost while idle, also during a block's own callbacks or after its `COMMIT`), and
  always at `on-fetch` and `on-parse`. A block some of whose callbacks were told true and whose transaction then finds
  the writer's session replaced fails before it writes, as a lost connection (retryable), and is made again. A
  database now says which session its writer has (`Database.writerSession`). It may be false at any block. The module
  guide's §3 describes it.
- **`core-ledger-state` and `core-block-commit` take the block before from memory when the block continues it.** Each
  keeps, once it has written a block's rows, its own copy of what the next block reads of them, taken before those
  writes and the one the rows are written from: `core-ledger-state` the state's key and root, the block's hash, ledger
  and time, and the keys of the states of the retention window; `core-block-commit` the block's hash. A block whose
  context says `continues` and whose kept block is the one at h − 1 takes them from memory, so per block up to three
  reads fewer at `core-ledger-state`'s `on-compute` (the state at h − 1 and the parent time, and the keys of the
  states it releases where it releases any: while a retention window fills a block releases none, and no key read was
  sent there before either) and one fewer at `core-block-commit`'s `on-db-write` (the parent's hash). Those reads are
  sent only at a run's first block: after a start, any retry, a replaced writer's session, and for a height made
  again. There `core-ledger-state`'s read of the keys also takes the window's, from the first state the block releases
  to h − 1: the retention window after the block before, up to its `retainStates` + 1 rows (after a lowered
  `retainStates` that is the earlier, larger window: 7 rows at a restart where 6 was lowered to 1), in the same
  statement, which it now sends at a run's first block also when that block releases nothing, so that no block
  continuing it reads a key. A row of that window missing from `states` fails only the block that releases it, as
  before. The block trace's `sqlN` and the statement totals show the difference; the stored rows and the failures are
  the same, except that the parent check does not see a block at h − 1 changed by a writer that ignores the writer
  lock. A new option of `coreLedgerState` and of `core-block-commit`'s `coreBlockCommit`, `checkKept`, also reads every
  value taken from memory, and at every block every key kept of the retention window, and compares them, a difference
  failing the block; the tests and the replays of recorded chains use it.
- **The ledger state's reclamation remembers the keys it finds stored.** `core-ledger-state` keeps, from block to
  block, the keys its reclamation's `missing` read found stored, so a block's references are asked about only when no
  earlier block found them stored. It uses them only while each block continues the one before (`continues`: the
  block before's `COMMIT` answered in the same run of processing, on the same writer's session) and empties them
  otherwise: at a process's first block, at a block made again after a failure, and after a `COMMIT` whose answer was
  lost, so a height another writer committed meanwhile is never taken from memory. The keys a block deletes leave
  them, and they are emptied when `on-settle` fails. At most 500,000 keys (32.9 MiB of heap at that bound, measured):
  a key that would pass the bound empties them first. A node row deleted by hand while the process runs is seen at
  once if its key is not remembered; if it is, the deletion goes unseen while the key stays remembered, until a block
  that does not continue the one before, or the bound, empties the remembered keys. In the block trace, `missing`
  holds only the keys asked of the database, and `knownHits` and `knownEmptied` are new (`knownEmptied` is also set
  at a process's first height); the operator guide lists them.
- **The ledger state's reclamation keeps the counts and child lists it read or wrote.** `core-ledger-state` keeps, from
  block to block, a copy of what its reclamation's `counts` read gave (whether a key is a stored node, its reference
  count, its root count) and of the child lists of the nodes it wrote, as the tables are after the block before,
  brought up to date from each block's net write; a block's `counts` and `references` reads ask the database only what
  the copy lacks. It is used only while each block continues the one before and is emptied otherwise, and when
  `on-settle` fails, as the keys found stored are. A new operational setting of the `core` entry, `reclamationCache`
  (`{ keys: 100000, verify: false }`): `keys` bounds the copy, in keys of counts and in child lists each (an update that
  would pass it empties the copy first; 71.9 MiB of heap at 100,000 with lists of 16 references, measured), 0 for no
  copy; `verify` also reads from the database every key the copy answers and halts with `ledger-refcount-invalid`
  (`copy-mismatch`) on a difference. The copy equals the tables given tables that were undamaged when the process
  started and that only this process writes. On tables already damaged it can differ from the database (a positive
  reference count for a key that is no row, which a block then writes new without reading its counts), so the height
  and the reason of a halt can change with no hand edit while the process runs; `verify` finds the difference at the
  first read of that key. A count or node row changed by hand while the process runs is read at once if the copy does
  not hold its key; if it does, the change goes unseen, but by `verify`, until a block that does not continue the one
  before, or the bound, empties the copy. In the block trace, `counts` and `references` hold only the keys asked of the
  database, and `copyHits`, `copyMisses` and `copyEmptied` are new; the operator guide lists them.
- **PostgreSQL sessions prepare the statements without parameters that every block repeats.** The head read, the
  queue read of a run that sweeps, the digest read, and the shadow tables' probe and drains are now prepared once per
  session and run by name, as a text with parameters already was, within the session's bound of 256 texts. While its
  statement stays valid, an execution by name is not parsed again, and PostgreSQL reuses the plan it keeps for it
  where it chooses to. Each of these texts names its tables with their schema and holds no literal whose value depends
  on a setting. Every other text without parameters, a module's among them, runs unnamed as before. One of these texts
  also runs unnamed when it is sent while another statement of its session has no answer yet; on a session where it
  ran before a schema change the process made (a migration, a writer's rollback); and on a session where an
  execution of it by name failed.

## [0.9.5] - 2026-07-25 — "Penumbra"

The first importable, published public surface. Everything below is imported from the package root
(`import { ... } from "umbradb"`); there is no supported deep import of an internal module (the
`package.json` `exports` map exposes only `"."`).

**SemVer status — read this before depending on it.** This is a `0.y.z` release, so under SemVer the
surface carries **no compatibility guarantee yet**. The surface *is* frozen in the engineering sense —
it is enumerated, drift-tested against the exported classes, and documented in
`docs/STABILITY.md` — but the *promise* not to break it in a minor or patch
release is a commitment that takes effect **at 1.0.0**, not here. Treat 0.9.5 as the release
candidate for that promise: depend on it, report what breaks, and expect the surface to be identical
at 1.0.0 unless something found in the interim justifies changing it.

### Added

Initial public API surface — the five storage primitives plus the wallet-state-envelope capability:

- **`PgTemporalKV`** (`TemporalKV`) — a versioned key-value store with point-in-time reads
  (`put`/`get`/`getAt`/`listKeys`) over a `kv_current`/`kv_history` schema.
- **`PgTransactionLeaseLayer`** (`TransactionLeaseLayer`) — real Postgres transactions and
  connection-pinned advisory locks; the `withTransaction` and `withLease` combinators are `async`
  **methods** of this class (there are no standalone `withTransaction`/`withLease` exports).
- **`PgCheckpointStore`** (`CheckpointStore`) — content-addressed, deduplicated, chunked storage
  for large periodic snapshots, with integrity verification and reachability-based garbage
  collection (`save`/`load`/`history`/`prune`).
- **`PgWatermarks`** (`Watermarks`) — simple, unversioned sync-progress cursors with transactional
  composition (`set`/`get`).
- **`PgTransactionHistoryStorage`** (`TransactionHistoryStorage`) — per-wallet transaction history
  with lifecycle-aware upsert/merge and identifier-subset pending-clear.
- **`PgWalletStateEnvelopeStore`** — persists shielded/unshielded/dust wallet-sync snapshots as a
  single `CheckpointStore.save()` call per `(walletId, networkId)`. A capability on top of the five
  primitives, not a sixth primitive (it adds no table or migration of its own).

Also part of the frozen surface:

- **`createClient`** / **`UmbraDBConnectionOptions`** / **`UmbraDBSql`** / **`DEFAULT_SCHEMA`** — the
  connection factory and its types.
- **`runMigrations`** / **`Migration`** / **`RunMigrationsOptions`** — the forward-only migration
  runner (which also runs the startup durability probe).
- **`saveAndAdvance`** (with `SaveAndAdvanceDeps` / `SaveAndAdvanceCursor`) — the G5 co-transactional
  composition primitive that persists a checkpoint and advances its sync cursor in one transaction.
- **`Rollback`** — the control primitive a caller throws inside a `withTransaction` callback to
  request a deliberate rollback (an `Error` subclass with **no** catalog `code`).
- Every `interfaces/` contract and value type (`TransactionHandle`, versioned-entry types,
  wallet-envelope types, etc.).
- The full **`StorageError`** hierarchy (base + every concrete subclass **except** the six
  deferred chain-archive classes), each carrying a machine-readable `retryable: Retryability`
  field. The frozen `{code → meaning → retryable}` catalog (24 codes) is
  `docs/ERROR-CATALOG.md`.

### Contract documents

- SemVer stability policy: `docs/STABILITY.md`.
- The eight release contracts (durability, forward-only migration, cancellation, save-retry caveat,
  lease limitation, backup/restore, threat-model pointer, format headroom): `docs/CONTRACT.md`.
- Frozen error-code catalog: `docs/ERROR-CATALOG.md`.

### Deferred to a 1.1 fast-follow (explicitly outside the frozen 1.0 surface)

- Full-chain archival storage (the `chain_archive` schema and its error classes) — a 1.1 preview.
- Automatic save idempotency (the `idempotency_key` UNIQUE migration).
- Keyed/per-consumer chunk addressing and at-rest encryption.
- A public observability/tracing seam.

[Unreleased]: https://github.com/midnightntwrk/umbradb/compare/v0.10.0...HEAD
