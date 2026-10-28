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
