# Design — CORE-ARCH project 1: runner and database

This design implements the parts of the owner-approved CORE-ARCH spec (2026-10-22) assigned to delivery project 1:
§3.4 (the 0.9.5 refactor), §4.2–§4.3 (runner, points, block context), §4.7 (database API), §4.10 (modules), §4.11a
(storage helpers), §4.12 (configuration), §4.13 (determinism), §4.18 (admin endpoints) and §4.21 (test tape).
CORE-ARCH lives in the owner's organizer workspace; every rule this change relies on is restated in `specs/`.

## 1. Source layout

| Path | Contents |
|---|---|
| `src/runner/` | Points, dispatch and order, the finalized loop, block context, item sink, start/stop and upgrade-boundary handling, heartbeat, process state |
| `src/db/` | The database API (`api.ts`), the PostgreSQL backend (refactored from `src/postgres/client.ts`), the PGlite backend, roles and grants, migrations (refactored from `src/postgres/migrate.ts`), the writer lock (refactored from `src/postgres/transaction-lease.ts`), the durability probe (moved from `src/postgres/durability-probe.ts`), change capture for digests |
| `src/modules/` | `ModuleDeclaration` and related types, `defineModule`, declaration validation, graph resolution per height range |
| `src/config/` | `defineConfig`, `coreEntry`, `pastEntry`, the loader, the plain-data check, schema validation, the history comparison, the version check |
| `src/determinism/` | The canonical CBOR encoder, primary-key order, the contents hash, digests, the `core-digest` part |
| `src/helpers/` | The cursor table (from `src/postgres/watermarks.ts`) and the height-versioned table (from `src/postgres/temporal-kv.ts`) |
| `src/admin/` | The admin HTTP server (`node:http`) |
| `src/cli/` | The `umbradb` command |
| `src/backbone/` | `core-chain` (configuration history only in this change) and `core-digest` |
| `tools/tape/` | Tape reader and writer, tape node, recording builder, variant transforms (unexported, for tests) |
| `legacy/transaction-history/` | TransactionHistory source and tests, outside the build (LS-3) |

## 2. Points

| Point | When | Handle | Runs |
|---|---|---|---|
| `on-start-db` | Once per process start | Schema write handle (own schema, own transaction) | In series |
| `on-start-api` | Once per process start | `ApiRegistry`; each request gets a read handle | In series |
| `on-best-block` | Dispatched by the block source (project 2) | None | In series |
| `on-fetch` | A finalized block is read | None in the core | Parallel where the graph allows |
| `on-parse` | After the items it requires are published | None | Parallel where the graph allows |
| `on-rollback` | Dispatched by the block source (project 2) | None | In series |
| `on-finalized` | The block source reports a new finalized head, before its heights | None | In series |
| `on-start-height` | An entry's start height, before `on-compute` | Read handle at h − 1 | In series: core, then graph order |
| `on-compute` | Before the transaction opens | Read handle at h − 1 | Parallel where the graph allows |
| `on-db-write` | Inside the block transaction | Block write handle | In series, fixed order |
| `on-after-db-write` | After the commit | Read handle at h | In series |
| `on-stop-height` | After the commit of an entry's stop height | Read handle at h | In series: stopping modules in reverse graph order, then the core |
| `on-key` | Private side only (project 5) | — | — |

Parallel callbacks run with `Promise.all` over each "wave" of Kahn's algorithm restricted to the modules registered at
that point; a module waits only for the modules it requires (transitively, through items).

## 3. The block source

```ts
interface BlockRef { height: bigint; hash: Uint8Array; parentHash: Uint8Array }

interface BlockSource {
  cursor(read: ReadHandle): Promise<BlockRef | null>;       // last committed block, null before S
  finalizedHead(): Promise<BlockRef>;                        // the highest height the runner may process
  waitForHead(above: bigint, signal: AbortSignal): Promise<void>;  // resolves when the head exceeds `above`
  block(height: bigint): Promise<BlockRef>;                  // the finalized block at `height`
}
```

The runner calls `cursor` inside its own read at startup; the backbone part that writes the cursor (project 2's
`core-block-commit`) owns where it is stored. `InMemoryBlockSource` (exported) keeps blocks in memory and registers a
minimal implementation of the backbone part `core-block-commit`, which writes the cursor to its table
`core_block_commit.cursor` first in `on-db-write` — the position and name project 2's full part will take. No transaction is open while `waitForHead` is pending (RN-6).

## 4. The database API

- **Backends.** PostgreSQL through `postgres` 3.4.9 (installed, `node_modules/postgres/package.json`): one writer
  connection pinned with `sql.reserve()` (the same mechanism the 0.9.5 lease used, `src/postgres/transaction-lease.ts:135-138`)
  and a read pool. PGlite through `@electric-sql/pglite` (pinned in task 0.1) with a single job queue (DB-4).
- **Reads.** PostgreSQL: `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY` on a pool connection; the handle's `height`
  is read from the cursor inside the same transaction. PGlite: one queued job.
- **Roles.** Each module's role is `umbradb_m_<schema>` (`umbradb_i_<item>` for a shared item); `NOLOGIN`, owner of its
  schema; `USAGE` on every other module schema and `SELECT` on its tables (granted when a schema is created and by
  `ALTER DEFAULT PRIVILEGES`). `on-db-write` and `on-start-db` callbacks run after `SET LOCAL ROLE` to the module role;
  the writer connection's own role is the owner of every module role. Provider functions are `SECURITY DEFINER`, owned
  by the provider role, `EXECUTE` granted to the roles of modules that require the provider's item (DB-7).
- **Migrations.** `core_chain.migrations (module text, migration_id text, checksum bytea, position int, primary key
  (module, migration_id))`; checksum = SHA-256 of the UTF-8 SQL. Each migration runs in its own transaction under the
  module role, followed by its row. The 0.9.5 migration advisory lock (class 1, `src/postgres/migrate.ts:220`) is no
  longer needed: the writer lock is taken before any migration.
- **Writer lock.** PostgreSQL: `pg_try_advisory_lock(3, hashtext('umbradb-writer'))` on the writer connection (class 3;
  classes 1 and 2 were the 0.9.5 migration and lease classes, `src/postgres/transaction-lease.ts:192-195`); session-level,
  released when the connection closes. PGlite in Node.js: `<data directory>.lock`, created with exclusive create
  (`wx`), holding the PID; a lock whose PID is not alive (`process.kill(pid, 0)` throws `ESRCH`) is stale and is taken
  over, so a crash never blocks the next start.
- **Durability probe.** `src/postgres/durability-probe.ts` moves to `src/db/` unchanged in behaviour (`fsync` :72-84,
  `full_page_writes` with the override :61-66 and :86, pooler detection :16); the override is the `core` field
  `fullPageWritesOffAllowed`.
- **Change capture for digests (DT-4).** For a module with `digest: true`, the database API adds to each of its tables
  a row-level `AFTER INSERT OR UPDATE OR DELETE` trigger that, on the first touch of a primary key in the transaction,
  copies the old row (or a tombstone when absent) into a shadow table `core_digest_shadow.<schema>__<table>` with the same
  columns plus `present boolean`. `core-digest`, last in `on-db-write`, reads each shadow row and the current row through
  the driver (keeping native types), computes the net change of DT-4, appends to the chain, writes
  `core_digest.digests`, and deletes the shadow rows — all inside the block transaction.
- **Errors.** `UmbraError { code, retryable, details }`, with the 0.9.5 retryable/not-retryable split
  (`design/design-interfaces.md` §1.1) kept; a lost connection is `connection-lost` (retryable).

## 5. Modules

The declaration is CORE-ARCH §4.10's `ModuleDeclaration`; `defineModule(declaration)` returns it with a typed
`entry({ start, stop?, config })` builder (CF-2). Graph resolution computes the boundary heights of every revision,
resolves providers per range (MD-3), and produces per range and per point an ordered callback list, cached for the
process. A range change (a revision boundary) switches lists between heights, never within one.

## 6. Configuration

- **Loading.** `await import(pathToFileURL(file).href)` on Node.js ≥ 24 with type stripping enabled; Node.js v24.9.0
  installed here reports `process.features.typescript === "strip"` (verified 2026-10-22). Only erasable TypeScript is
  supported (no enums, namespaces with values, or parameter properties).
- **Plain-data check.** A recursive walk that accepts plain objects (prototype `Object.prototype` or `null`), arrays,
  strings, booleans, `null` and safe non-negative integers, and reports the first offending path (CF-1).
- **Schemas.** zod 4, already a dependency (`package.json` `"zod": "^4.0.0"`, installed 4.4.3; owner decision Q45,
  2026-10-22, in place of the TypeBox named by CORE-ARCH design choice #45): a module's `configSchema` is a `z.object`
  whose every field carries `kind` in its metadata; `defineModule` reads the kinds back and refuses a field without one
  (MD-2); validation reports each issue's path; defaults are applied by the schema before the data fields are
  recorded.
- **History.** `core_chain.config (entry_id text, start bigint, stop bigint null, version text, data jsonb, data_hash
  bytea, primary key (entry_id, start))`, created by `core-chain`'s migration and compared and extended in its
  `on-start-db` (CF-6). The version check (CF-8) runs before any `on-start-db`.
- **`umbradb config check`.** Uses the TypeScript compiler API (`typescript` becomes a runtime dependency; installed
  5.9.3) with `noEmit`, then the loader, the plain-data check and schema validation.

## 7. Exported surface (LS-1)

**Values:** `defineConfig`, `coreEntry`, `pastEntry`, `defineModule`, `startProcess`, `InMemoryBlockSource`,
`cursorTable`, `heightVersionedTable`, `encodeCanonical`, `encodeRow`, `contentsHash`, `POINTS`, `UmbraError`.

**Types:** `ModuleDeclaration`, `ItemDeclaration`, `Lifetime`, `FieldKind`, `FieldSchema`, `Migration`, `Revision`,
`PointName`, `PointCallbacks`, `ProcessContext`, `BlockContext`, `ItemSink`, `ReadHandle`, `BlockWriteHandle`,
`SchemaWriteHandle`, `ApiRegistry`, `BlockRef`, `BlockSource`, `Entry`, `CoreVersion`, `UmbraConfig`,
`ProcessHandle`, `ProcessState`, `ErrorCode`.

## 8. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010)

Inventory taken at `a75ed95`. Everything not listed stays as it is.

| Gate | Retired with its 0.9.5 part | Kept or retargeted | Added |
|---|---|---|---|
| Lean (`Formal/Lean`, `lean.yml`) | `UmbraDBFormal/TemporalKV/**` (T1–T5 and retention), `UmbraDBFormal/Checkpoint/**` (C1) and their `UmbraDBFormalTest` counterparts; `APISmoke` lemmas `checkpoint_union_comm/assoc/idem` | `UmbraDBFormal/Watermarks/**` and tests: W1 is the law of the cursor table (SH-1); `APISmoke.watermark_overwrite`; `APISmoke.adjacent_Ico_disjoint` (the half-open rule of SH-2); `Trust.lean` (imports trimmed); the `lean.yml` job unchanged | — |
| `Formal/STORAGE_ALGEBRA.md` and the formalization roadmaps | Laws T1–T4, C1, C2a, C2b, L1 and property tests P1–P8, P10, P11 marked retired (header note, laws kept as history) | W1/P9 re-bound to the cursor table; T5's half-open, no-overlap rule restated for heights | — |
| `openspec/changes/v1.1.0-quint-model-checking` (Proposed) | Status set to Archived: the laws it targets (C2a, C2b, L1, T1 cross-writer) are retired | — | — |
| Required test ids (`test/integration/required-tests.manifest.json`, `EXPECTED_REQUIRED_COUNT = 25`) | Ids 5–25 and the deferred `crash.pg-kill-save.no-duplicate-with-idempotency-key` (CheckpointStore, Watermarks, TemporalKV, Lease, `saveAndAdvance`, the differential reference) | Ids 1–4 (`crash-harness.smoke.*` harness tests), retargeted to a crash worker that drives the runner | The new required ids of `acceptance.md` §9; the pinned count becomes 4 + their number |
| Test files | TemporalKV, CheckpointStore, Lease, `saveAndAdvance`, WalletStateEnvelope and cross-part durability tests (inventory groups); `test/postgres/no-consumer-import-in-bench.test.ts` with the retired benchmarks | `durability-probe.test.ts`; `migrate`, `migration-lock-timeout`, `client` and `errors` tests refactored onto `src/db/`; `watermarks.property.test.ts` (P9) retargeted to the cursor table; boundary guards `no-sdk-import-guard`, `no-chain-sync-import-guard`; gate machinery; every `chain-archive` test unchanged | One test file per acceptance group |
| TransactionHistory tests | — | Moved with the source to `legacy/transaction-history/`, excluded from the run (LS-3) | — |
| Coverage floors (`vitest.config.ts:47-60`) | `checkpoint-store`, `save-and-advance`, `watermarks`, `temporal-kv`, `transaction-lease` | `durability-probe` 97/92, `migrate` 90/85, `errors` 95/91 (moved paths) | `src/runner/**`, `src/db/**`, `src/config/**`, `src/modules/**`, `src/admin/**` 90/85; `src/determinism/**` and `src/helpers/**` 95/90 |
| Mutation (`stryker.conf.json` `mutate`, break 65) | The five 0.9.5 adapters | Break threshold 65 | `src/modules/graph.ts`, `src/runner/order.ts`, `src/config/history.ts`, `src/determinism/cbor.ts`, `src/determinism/digest.ts`, `src/helpers/height-versioned.ts`, `src/helpers/cursor-table.ts` |
| Public API pins (`test/api-surface/*`, `test/smoke/pack-install.mjs`) | The 36-symbol pins, the error-catalog and retryability tables of 0.9.5 | The deep-import block in the pack smoke; `package-json-strict` (exports only `"."`) | A sorted-name pin of §7; the pack smoke imports §7 and runs a three-block process on PostgreSQL in Docker plus `umbradb config check` |
| Benchmarks (`bench/`, non-gating `bench-smoke.yml`) | TemporalKV, Watermarks, CheckpointStore, Lease and TransactionHistory workloads and `bench/baseline.1.0.0-perf-baseline.1.json` | The non-gating job | `runner.commitEmptyBlock` on each backend, with a fresh baseline |
| `docs:storage` (`typedoc.json`, not run in CI) | The five 0.9.5 entry points | — | The §7 surface |
| Documents stating "36 symbols" | — | `docs/releases/v0.9.5.md` unchanged (history) | `ROADMAP.md:455` and `docs/v1-implementation-guideline.md:194` updated at close-out |

## 9. External claims and their evidence

| Claim | Evidence | Status |
|---|---|---|
| Node.js 24 loads `.ts` with type stripping by default | Installed v24.9.0: `process.features.typescript === "strip"` (2026-10-22) | Verified (installed) |
| `postgres` `sql.reserve()` pins a connection; session advisory locks are released when it closes | `src/postgres/transaction-lease.ts:135-138, 287-301` (0.9.5 use, `postgres` 3.4.9 installed) | Verified (in-repo use) |
| PostgreSQL 17: `SET LOCAL ROLE`, `SECURITY DEFINER`, `REPEATABLE READ READ ONLY`, session advisory locks | https://www.postgresql.org/docs/17/sql-set-role.html, /sql-createfunction.html, /sql-set-transaction.html, /functions-admin.html#FUNCTIONS-ADVISORY-LOCKS | Version-pinned documentation; re-checked by tests in task 2 |
| PGlite supports roles, `SET LOCAL ROLE`, `SECURITY DEFINER` functions, PL/pgSQL triggers, and serves one connection | — | **Unconfirmed**: task 0.1 pins a version and runs a probe test; nothing builds on it before |
| zod 4: static types from schemas, per-field metadata read back from an object schema, defaults, issue paths | `zod` 4.4.3 installed; the metadata API is checked on it in task 0.1 | **Unconfirmed** (metadata API): task 0.1 |
| `ws`: a WebSocket server and client for Node.js | — | **Unconfirmed**: task 0.1 |
| RFC 8949 §4.2.1 core deterministic encoding and the Appendix A vectors | https://www.rfc-editor.org/rfc/rfc8949 (fixed text) | Verified (normative text) |
| TypeScript compiler API for `noEmit` checks | `typescript` 5.9.3 installed | Verified (installed); API use re-checked in task 4 |

## 10. Relation to the existing design documents

- `design/design.md` §2 (TemporalKV), §3 (checkpoint chunker), §4 (Watermarks) and §5 (commit/transaction layer)
  describe the parts this change retires or refactors; §5's transaction rule survives as the runner's one transaction per
  block (RN-6) and its lease as the writer lock (DB-10). This change does not edit those sections; they stay as the
  record of 0.9.5, and `ROADMAP.md` points to this change.
- `design/design-interfaces.md` §1.1 (thrown, `code`-discriminated errors with retryability) is kept as the database
  API's error idiom; §3.1–§3.4 (the four module interfaces) are superseded by §7 of this document.
- `Formal/STORAGE_ALGEBRA.md`: W1 is kept (cursor table); T5's interval rule is restated for heights (SH-2); the other
  laws are retired as in §8. No law is weakened silently: each retirement is listed for the owner's approval.
