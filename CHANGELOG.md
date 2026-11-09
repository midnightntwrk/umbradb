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
  packages v8 and v9 (the rc.3 build runtime 2.0 uses and the rc.5 release runtime 2.1 uses) behind one adapter
  interface, the v8 to v9 conversion, the ledger worker and its tasks, the ledger state stored in the database with a
  retention window and a mark-and-sweep, and the state-root check on every block.
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
