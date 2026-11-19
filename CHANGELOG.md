# Changelog

All notable changes to UmbraDB are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Routes for a module's API (`src/modules/route.ts`): `defineRoute({ name, input, output, http?, handle })` declares
  one operation with zod schemas and no transport, and `api.route(route)` registers it from `on-start-api`. The core
  keeps every route with its schemas as JSON Schema and serves it over HTTP under `/<module-id>` (`POST
  /<module-id>/<name>` unless `http` gives a method and path). A `GET`'s parameters are read as the numbers and
  booleans the input schema asks for; the input is checked before the handler runs (400 `invalid-request`, naming
  paths and rules, never values) and the output before it is sent (a wrong one is the module API's 500). A handler
  refuses with `RouteError(kind, code, message)`, each kind having its HTTP status; each answer is read at one
  committed height with the chain-data headers, as ASCII-escaped JSON. `bigintText()` (at most 78 digits) and
  `uintText(bits)` (up to 256 bits) are schemas of integers beyond 2^53: a `bigint` to the handler, digits in a string
  to a client (a JSON number is taken too). A route's numbers are read exactly: an integer however it is written, and
  never a fraction rounded to one. `pageCursor(schema)` gives keyset pages' opaque cursors. `api.http` stays for raw
  HTTP handlers. The module API's 404 and 405 messages no longer repeat the request's method and path. The
  `stats-module` and `try-module` examples' APIs are routes.
- MIP-0018 token metadata as two public modules: `token-metadata` (`TOKEN_METADATA`) creates, fills and guards its
  tables. Added to a database that already ran, it starts when the stored contract logs hold no MIP-0018 event below
  its start, and is refused otherwise with `TokenMetadataStartAfterDatabase` as the cause;
  `token-metadata-api` (`TOKEN_METADATA_API`) serves them on one route, `getTokens` (`GET
  /token-metadata-api/v1/tokens`, `docs/token-metadata-api.md`), whose query parameters select tokens by colors,
  contract, domain separator and kind, and which lists every token, a page at a time, without any. Its bytes are `0x` lowercase hex and its heights and `UInt` values digits in a string.
  `TokenMetadataRevisionGap` is the cause of a refused gap between its revisions.
- `contractLogsItemOf` and `unresolvedLogSitesOf`, with the types `ContractLog` and `UnresolvedLogSite`: a module's
  reads of the `contract-logs` item. The exported surface is 84 names, 40 values and 44 types.
- A module declaration's optional `latestStarts` (`{ [network]: height }`): a new database whose start would be above
  an enabled module's height on its network starts there, with the entries starting with it; the process logs the
  move and `umbradb config check` notes it. `token-metadata` declares each official network's first block with
  contract logs, so every new database holds every MIP-0018 event.
- The network `undeployed`, Midnight's local standalone node, beside `mainnet`, `preprod`, `preview` and `stagenet`.
  Each local chain has its own block 0, so the build records no genesis hash for it: a new database takes its node's
  and records it, and every later start is held to the recorded one (`genesis-mismatch` for a node restarted from a
  new genesis). Its ledger table is the official networks'. A private process of `undeployed` takes its public
  database's genesis. `token-metadata`'s latest start on it is 0.

### Changed

- `core-contract-logs-fast` records a log site it cannot read from the transcripts (`not-a-literal`, `conditional`,
  `partial-transaction`) as an unresolved site, in the new table `contract_logs.unresolved` (the shared item's
  migration `002`) and in the `contract-logs` block item, instead of halting with `fast-log-unsupported`, which is
  removed.

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
