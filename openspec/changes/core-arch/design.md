# Design — CORE-ARCH: the standalone indexer's core architecture

This design implements the owner-approved CORE-ARCH spec (2026-10-22, amended by Q45) as one change, by the owner's
decision Q47 ("one PR for the complete architecture"). CORE-ARCH lives in the owner's organizer workspace; every rule
this change relies on is restated in `specs/`. Owner decisions cited as Qn are in the organizer's decision record.

## 1. Source layout

| Path | Contents |
|---|---|
| `src/runner/` | Points, dispatch and order, the finalized loop, block context, item sink, start/stop and upgrade-boundary handling, the lockstep wait, heartbeat, process state |
| `src/db/` | The database API (`api.ts`), the PostgreSQL backend (refactored from `src/postgres/client.ts`), the PGlite backend, roles and grants, migrations (refactored from `src/postgres/migrate.ts`), the writer lock (refactored from `src/postgres/transaction-lease.ts`), the durability probe (moved from `src/postgres/durability-probe.ts`), change capture for digests |
| `src/modules/` | `ModuleDeclaration` and related types, `defineModule`, declaration validation, graph resolution per height range |
| `src/config/` | `defineConfig`, `coreEntry`, `pastEntry`, the loader, the plain-data check, schema validation, the history comparison, the version check |
| `src/determinism/` | The canonical CBOR encoder, primary-key order, the contents hash, digests |
| `src/helpers/` | The cursor table (from `src/postgres/watermarks.ts`) and the height-versioned table (from `src/postgres/temporal-kv.ts`) |
| `src/node/` | The node client (refactored from `chain-archive-sync/node-rpc-client.ts`): JSON-RPC over WebSocket, subscriptions, reconnect, back-off |
| `src/backbone/` | `core-chain`, `core-block-fetch` (the queue and the finalized prefetch), `core-block-commit`, `core-digest`; private: `core-private-source`, `core-key-registry` |
| `src/core-modules/` | `core-chain-events`, `core-block-parsed`, `core-tx-results`, `core-ledger-state`, `core-contract-states`, `core-contract-logs-full`, `core-contract-logs-fast` |
| `src/ledger/` | The `LedgerPackage` adapters (v8 from the 0.9.5 `chain-archive-sync/tx-replay-decoder.ts`, v9), the ledger worker, the node-store bridge, the sweep, the built-in version tables (`networks.json`) |
| `vendor/ledger/` | Vendored ledger builds: per version the pinned upstream source reference, the patches, the build script and the built WASM with its SHA-256 (§5.2) |
| `src/private/` | The process transport (core server, private client), the key API, lockstep bookkeeping |
| `src/snapshot/` | Export and import (§9.1) |
| `src/admin/` | The admin HTTP server (`node:http`) in its own worker thread, reading a state snapshot the runner publishes through a `SharedArrayBuffer` and messages (AE-1) |
| `src/cli/` | The `umbradb` command |
| `browser/` | The browser build: page, workers and its build script (§9.2) |
| `tools/tape/` | Tape reader and writer, tape node, recording builder, variant transforms (unexported, for tests) |
| `legacy/transaction-history/` | TransactionHistory source and tests, outside the build (LS-3) |

`chain-archive-sync/` and the `chain_archive` schema are refactored as CORE-ARCH §3.4 decided: `indexer-client.ts` is
deleted (the indexer reads only from the node); `node-rpc-client.ts` becomes `src/node/`; `tx-replay-decoder.ts`
becomes the v8 adapter; the sync loop becomes the runner; the `chain_archive` store becomes the core block tables,
keeping range partitioning by height and the parent-hash and genesis checks.

## 2. Points

| Point | When | Handle | Runs |
|---|---|---|---|
| `on-start-db` | Once per process start, after the module's pending migrations (DB-9) | Schema write handle (own schema, own transaction) | In series |
| `on-start-api` | Once per process start | `ApiRegistry`; each request gets a read handle | In series |
| `on-best-block` | The node announced a new best block, before it is fetched (IN-6) | None | In series |
| `on-fetch` | A block is read: in the core from the node; in a private process from the public database at a committed height | Core: none. Private: a read of public data at h | Parallel where the graph allows |
| `on-parse` | After the items it requires are published | None | Parallel where the graph allows |
| `on-rollback` | Queued blocks were dropped (IN-4, IN-6) | None | In series |
| `on-finalized` | A new finalized head (core) or public commit (private), before its heights | Read handle at the cursor | In series |
| `on-start-height` | An entry's start height, before `on-compute` | Read handle at h − 1 | In series: core, then graph order |
| `on-compute` | Before the transaction opens | Read handle at h − 1 | Parallel where the graph allows |
| `on-db-write` | Inside the block transaction | Block write handle | In series, fixed order |
| `on-after-db-write` | After the commit; no `block` items (RN-5) | Read handle at h | In series |
| `on-stop-height` | After the commit of an entry's stop height; no `block` items | Read handle at h | In series: stopping modules in reverse graph order, then the core |
| `on-key` | Private: a key was accepted (PP-8) | Read handle at the cursor | In series |

Parallel callbacks run with `Promise.all` over each "wave" of Kahn's algorithm restricted to the modules registered at
that point; a module waits only for the modules it requires (transitively, through items). The lockstep wait (PP-6)
sits between `on-compute` and `BEGIN`.

## 3. Block source and ingest

```ts
interface BlockRef { height: bigint; hash: Uint8Array; parentHash: Uint8Array }

interface BlockSource {
  cursor(read: ReadHandle): Promise<BlockRef | null>;       // last committed block, null before S
  finalizedHead(): Promise<BlockRef>;                        // the highest height the runner may process
  waitForHead(above: bigint, signal: AbortSignal): Promise<void>;  // resolves when the head exceeds `above`
  block(height: bigint): Promise<BlockRef>;                  // the finalized block at `height`
}
```

- **`core-block-fetch`** implements it over the node client: `chain_getFinalizedHead` at start, then
  `chain_subscribeFinalizedHeads` as a bound; per height `chain_getBlockHash`, `chain_getBlock`, `chain_getHeader`; the
  finalized prefetch keeps at most `prefetchWindow` parsed blocks above the cursor (a `Map` keyed by height, filled by
  a bounded pool); the best-block queue is an array of parsed blocks above the finalized head, with the common-ancestor
  walk of IN-6 over `chain_getHeader` of parents. Queue-side callbacks get no database handle.
- **`InMemoryBlockSource`** (exported) keeps blocks in memory, for tests and module authors, with the same
  `core-block-commit` cursor table.
- **The node client** retries per IN-10; every request has a timeout; subscriptions are re-established after a
  reconnect, and the runner re-reads the finalized head instead of trusting lost notifications.

## 4. The database API

- **Backends.** PostgreSQL through `postgres` 3.4.9 (installed): one writer connection pinned with `sql.reserve()` (as
  the 0.9.5 lease did, `src/postgres/transaction-lease.ts:135-138`) and a read pool. PGlite through
  `@electric-sql/pglite` (pinned in task 0.1) with a single job queue (DB-4).
- **Reads.** PostgreSQL: `BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY` on a pool connection; the handle's `height`
  is read from the cursor inside the same transaction. PGlite: one queued job.
- **Lossless `jsonb`.** The `postgres` driver parses JSON with plain `JSON.parse`
  (`node_modules/postgres/src/types.js:18-21`), which rounds integers beyond 2^53. Both backends use a `jsonb` parser
  whose reviver uses JSON.parse source text access (`context.source`, Node.js v24.9.0) and returns a `bigint` for every
  integer outside ±(2^53 − 1) (DB-2).
- **Roles.** Each module's role is `umbradb_m_<schema>` (`umbradb_i_<item>` for a shared item); `NOLOGIN`, owner of its
  schema; `USAGE` on every other module schema and `SELECT` on its tables (granted when a schema is created and by
  `ALTER DEFAULT PRIVILEGES`). Callbacks and migrations run after `SET LOCAL ROLE` to the module role (DB-6). The writer
  connection's own role owns every module role. Modules are trusted code (Q46): the roles stop accidental writes into
  another module's schema; nothing more is enforced.
- **Provider functions.** `SECURITY DEFINER`, owned by the provider role, with `SET search_path = pg_catalog,
  <provider schema>`; default privileges revoke `EXECUTE` from `PUBLIC`; `EXECUTE` is granted to the roles of modules
  that require the provider's item (DB-7). `core-ledger-state` offers `persist(key)` this way (LG-13).
- **`TRUNCATE`.** Every public module table gets a `BEFORE TRUNCATE … FOR EACH STATEMENT` trigger raising
  `truncate-not-allowed` (DB-14).
- **`jsonb` values (DT-6).** `core_chain.jsonb_numbers_ok(jsonb)` (immutable; a `jsonpath` finding any number that is
  not an integer in the signed 64-bit range) backs a `CHECK` added to every `jsonb` column of a public module table.
- **Migrations and setup (DB-9, DB-10).** `core_chain.migrations`; checksum = SHA-256 of the UTF-8 SQL; per part and
  module, pending migrations each in their own transaction with their row, then `on-start-db` in its own transaction.
  Upgrade migrations only add — a module obligation (Q46); `requiresResync` versions are refused on a non-empty
  database. The writer lock is taken before any migration, so the 0.9.5 migration advisory lock is gone.
- **Writer lock (DB-11).** PostgreSQL: `pg_try_advisory_lock(3, hashtext('umbradb-writer'))` on the writer connection
  (classes 1 and 2 were 0.9.5's, `src/postgres/transaction-lease.ts:192-195`). PGlite in Node.js: the directory
  `<data directory>.lock`, created with `mkdir`, its modification time refreshed with `utimes` every second; older than
  10 s is stale; takeover renames it to `<data directory>.lock.stale-<random>` (atomic: one contender wins), removes
  it, and retries `mkdir`. Browser: a Web Locks lock named after the database (BR-1).
- **Durability probe.** Moved unchanged in behaviour (`fsync` :72-84, `full_page_writes` with the override :61-66 and
  :86, pooler detection :16 of `src/postgres/durability-probe.ts`); the override is `fullPageWritesOffAllowed`.
- **Change capture for digests (DT-4).** For a module with `digest: true`, a row-level `AFTER INSERT OR UPDATE OR
  DELETE` trigger on each of its tables copies, on the first touch of a primary key in the transaction, the old row (or
  a tombstone) into `core_digest_shadow.<schema>__<table>`; `core-digest`, last in `on-db-write`, reads each shadow row
  and the current row, computes the net change, extends the chain, writes `core_digest.digests` and deletes the shadow
  rows, inside the block transaction.
- **Errors.** `UmbraError { code, retryable, details }`, keeping the 0.9.5 retryable split
  (`design/design-interfaces.md` §1.1); a lost connection is `connection-lost` (retryable).

## 5. Ledger

### 5.1 The `LedgerPackage` interface (LG-6)

```ts
interface LedgerPackage {                                  // one per ledger version, used in the ledger worker
  ledger: "v8" | "v9" | "v10";
  versionName: string;                                     // the ledger release the packages were built from
  rawPackages(): Readonly<Record<string, unknown>>;        // the loaded WASM packages, unwrapped, by package name
  parseTransaction(bytes: Uint8Array): ParsedTransaction;
  emptyState(): StateHandle;                               // block 0 (IN-7)
  genesisState(bytes: Uint8Array): StateHandle;            // from system_properties.genesis_state
  load(stateKey: Uint8Array, store: NodeStore): StateHandle;
  apply(state: StateHandle, block: ApplyInput): ApplyOutput;   // LG-8
  stateRoot(state: StateHandle): Uint8Array;               // compared with midnight_ledgerStateRoot (LG-15)
  flush(): NodeBatch;                                      // nodes created and root counts changed since the last flush
  persist(key: Uint8Array): void;
  release(key: Uint8Array): void;
  childRefs(children: Uint8Array): Uint8Array[];           // a node's Ref keys, through embedded children
  evict(keys: Uint8Array[]): void;                         // drop swept nodes from the caches
  contractStateKey(state: StateHandle, address: Uint8Array): Uint8Array | null;
  contractZswapStateKey(state: StateHandle, address: Uint8Array): Uint8Array | null;
  decodeLogItem(value: Uint8Array): LogItem | null;        // the VM's own log decoding (CC-3)
  convertFromV8?(v8StateKey: Uint8Array, store: NodeStore): StateHandle;  // v9 only (LG-9)
}
interface ApplyInput { transactions: Uint8Array[]; height: bigint; hash: Uint8Array; parentHash: Uint8Array;
  timestampMs: bigint; parentTimestampMs: bigint; firstRegularAtParentTime: boolean }
interface ApplyOutput {
  results: { outcome: "success" | "partial" | "failure"; segments: { segment: number; success: boolean }[] }[];
  events: LedgerEvent[]; logs: LogItem[]; parameters: Uint8Array;
}
interface NodeStore { get(key: Uint8Array): { data: Uint8Array; children: Uint8Array } | null }
interface NodeBatch { inserts: { key: Uint8Array; data: Uint8Array; children: Uint8Array }[];
  rootCounts: { key: Uint8Array; count: number }[] }
```

`firstRegularAtParentTime` is true for runtimes 0.22, 1.0 below 1.0.300 and 2.0, and never for block 0, as the official
indexer decides it (`chain-indexer/src/domain/ledger_state.rs:44-85`).

### 5.2 Vendored builds (LG-5)

`vendor/ledger/<version>/` holds `upstream.json` (repository URL, commit, release name = `versionName`),
`patches/*.patch` (applied in order), `build.sh` (a pinned Docker image with the Rust toolchain and `wasm-pack`), and
the built package with `SHA256SUMS`. The functions `LedgerPackage` needs that the published v9 WASM lacks (`load`,
`stateRoot`, `flush`, `persist`, `release`, `childRefs`, `evict`, the contract keys, `decodeLogItem`, the conversion)
are the patches. v9 starts from `midnight-ledger` `ledger-9.1.0.0-rc.5` (the reference used for CORE-ARCH); the v8
release and the source of the v8→v9 conversion are pinned in task 0.2. CI rebuilds each vendored package and compares
the SHA-256.

### 5.3 The ledger worker and the node-store bridge (LG-10, LG-11)

Ledger work runs in a worker thread. The ledger reads nodes synchronously, so `NodeStore.get` in the worker posts a
request to the main thread through a `SharedArrayBuffer` and blocks with `Atomics.wait` until the main thread, which
owns the database, writes the node bytes back (batched: a miss prefetches the node's referenced keys). The main thread
never blocks on the worker; it awaits the worker's results asynchronously.

### 5.4 Storage, retention and sweep (LG-11 to LG-14)

Tables in §10. Per block, `on-compute` runs the apply, the conversion when due, the root check and the sweep step's
computation; `on-db-write` writes the flushed batch, the `states` row, the retention releases and the sweep tables. The
sweep follows `gc-v1` (`storage-core/src/gc.rs:93-250`) with a node budget; its grey and mark sets are tables, its
rounds take keys in byte order, and deleted nodes are evicted from the worker's caches so later blocks insert them again
(`layout-v2` writes every created node, `storage-core/src/backend.rs:771-790`).

## 6. Modules

The declaration is CORE-ARCH §4.10's `ModuleDeclaration`, plus `requiresResync?: boolean` (DB-10); `ProcessContext`
also has `publish(item, value)` for `process` items (MD-7). Ids and item names match `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, so
the schema name (`-` → `_`) is one-to-one (DB-8). `defineModule(declaration)` returns it with a typed
`entry({ start, stop?, config })` builder (CF-2). Graph resolution computes the boundary heights of every revision,
resolves providers per range (MD-3), and produces per range and per point an ordered callback list, cached for the
process; a revision boundary switches lists between heights, never within one.

## 7. Configuration

- **Loading.** `await import(pathToFileURL(file).href)` on Node.js ≥ 24 with type stripping (v24.9.0 reports
  `process.features.typescript === "strip"`); erasable TypeScript only.
- **Plain-data check.** A recursive walk accepting plain objects, arrays, strings, booleans, `null` and safe
  non-negative integers, reporting the first offending path (CF-1).
- **Schemas.** zod 4 (installed 4.4.3; Q45): a module's `configSchema` is a `z.object` whose fields carry `kind` in
  their metadata; only revisions whose version is this build's are validated against this build's schema; a
  `pastEntry` revision is compared with its recorded row (CF-3).
- **Core stop.** Operational: not stored (`core_chain.config.stop` is null for `core`), changeable at any restart.
- **History.** `core_chain.config`, compared and extended by `core-chain`'s `on-start-db` (CF-6); the version check
  (CF-8) runs before any `on-start-db`.
- **`umbradb config check`.** The TypeScript compiler API (`typescript` becomes a runtime dependency; 5.9.3 installed)
  with `noEmit`, then the loader, the plain-data check and schema validation.

## 8. Private processes (PP)

- **Transport.** The core runs a WebSocket server (`ws`) on `listen.transport`; with `tls` set it is an `https` server
  requiring client certificates (`requestCert`, `rejectUnauthorized`). In the browser, `postMessage` between workers;
  in tests, direct calls. One JSON object per message.
- **Taking blocks.** `core-private-source` reads the public cursor (directly from the public database on PostgreSQL; via
  `read` messages when it is PGlite) and processes each height with `on-finalized`, `on-fetch` (a read of public data at
  h), `on-parse`, `on-compute`, its own block transaction, `on-after-db-write`.
- **Lockstep.** The core keeps, per listed instance, its last reported height and connection; the runner awaits the
  condition of PP-6 before `BEGIN` with no transaction open; a lockstep instance's consistent read checks
  `public cursor == h`.
- **Key API.** An HTTP server on `keyApi` (`https` with client certificates when `tls` is set); pending keys live in
  memory until the next block's `on-compute` takes them (PP-8).

## 9. Snapshots and browser

### 9.1 Snapshots (SN)

Export streams one consistent read into a CBOR sequence (manifest, then per table a header item and its rows) and
computes the contents hash while writing; the manifest's `contentsHash` is written last into a reserved header slot, so
the file is written in one pass. Import reads the manifest, runs the checks of SN-3, creates the staging schemas
(`staging_<schema>`) by running the recorded migrations, loads rows with `COPY`-like batched inserts, verifies the hash,
and publishes by renaming schemas in one transaction.

### 9.2 Browser build (BR)

`browser/` holds a static page and three worker entry points (core, ledger, private), bundled with `esbuild` (a new
development dependency, pinned in task 0.1); PGlite runs in the core and private workers with `memory://` or
`opfs-ahp://` storage; the admin endpoints are message calls; the page offers a snapshot file picker. `npm run
build:browser` writes `dist-browser/`, which is not part of the npm package.

## 10. Tables

Every column is `NOT NULL` unless marked null; a one-row table has the key `id smallint` with `CHECK (id = 1)`;
per-block tables are append-only and partitioned by height range; no table stores wall-clock time; hashes and keys are
`bytea`; heights and indexes are `bigint`; amounts wider than 64 bits are `numeric`; nothing is a float.

| Owner | Table | Primary key | Other columns |
|---|---|---|---|
| `core-chain` | `core_chain.identity` | id = 1 | genesis_hash, start_height, anchor_hash (null until block S commits) |
| `core-chain` | `core_chain.config` | (entry_id, start) | stop (null; always null for `core`), version (text), data (jsonb, canonical), data_hash |
| database API | `core_chain.migrations` | (module, migration_id) | checksum, position (int) |
| `core-block-commit` | `core_block_commit.blocks` | height | hash (unique), parent_hash, spec_version (int), ledger_version (text), block_timestamp_ms |
| `core-digest` | `core_digest.digests` | (height, module) | digest |
| `core-chain-events` | `core_chain_events.events` | (height, event_index) | phase (text), extrinsic_index (int null), pallet, name (text), bytes (SCALE), fields (jsonb, canonical) |
| `core-block-parsed` | `core_block_parsed.transactions` | (height, tx_index) | tx_hash, kind (`regular`, `system`), size (int) |
| `core-tx-results` | `core_tx_results.results` | (height, tx_index) | outcome (`success`, `partial`, `failure`) |
| `core-ledger-state` | `core_ledger_state.nodes` | node_key | data, children (ledger serialization) |
| `core-ledger-state` | `core_ledger_state.root_counts` | node_key | count (int > 0) |
| `core-ledger-state` | `core_ledger_state.states` | height | state_key, state_root, zswap_first_free, zswap_root, dust_commitment_first_free, dust_commitment_root, dust_generation_first_free, dust_generation_root |
| `core-ledger-state` | `core_ledger_state.sweep` | id = 1 | cycle, phase (`idle`, `mark`, `sweep`), sweep_after (null) |
| `core-ledger-state` | `core_ledger_state.grey`, `core_ledger_state.marks` | node_key | — |
| `core-ledger-state` | `core_ledger_state.segment_results` | (height, tx_index, segment) | success (boolean) |
| `core-ledger-state` | `core_ledger_state.events` | (height, tx_index, event_index) | kind (`zswap-input`, `zswap-output`, `dust-initial-utxo`, `dust-generation-dtime-update`, `dust-spend-processed`, `param-change`), logical_segment, physical_segment (int), bytes (ledger serialization), nullifier, commitment, tree_index, contract_address (each null) |
| `core-contract-states` | `core_contract_states.states` | (contract_address, height) | state_key, zswap_state_key |
| `core-contract-logs-*` | `contract_logs.logs` | (height, tx_index, log_index) | contract_address, entry_point, logical_segment (int), log_version (bigint), event_type (text), data (ledger serialization) |
| `core-key-registry` (private) | `core_key_registry.keys` | key_id | kind (text), key_bytes, arrived_height |
| `core-private-source` (private) | `core_private_source.cursor` | id = 1 | height (null), hash (null), public_genesis_hash, public_start_height |

## 11. Refusals and halts (IN-12)

**Startup refuses** (state `refused`, live, not ready), with these codes: `genesis-mismatch`, `cursor-hash-mismatch`,
`changes-past`, `missing-entry`, `not-plain-data`, `invalid-configuration`, `upgrade-required`, `requires-resync`,
`migration-checksum-changed`, `migration-missing`, `migration-failed`, `shared-item-migrations-differ`, `unknown-point`,
`reserved-prefix`, `bad-id`, `schema-collision`, `item-no-provider`, `providers-overlap`, `graph-cycle`,
`item-not-available`, `no-requirement`, `cannot-start-mid-chain`, `process-item-missing`, `duplicate-api-route`,
`development-opt-in-required`, `needs-lockstep-not-listed`, `private-binding-mismatch`, `test-key-conflict`,
`package-hash-mismatch`, `writer-lock-held`, `durability-fsync-off`, `durability-pooler`,
`durability-full-page-writes-off`, and the snapshot import checks (`snapshot-format-unknown`,
`snapshot-history-mismatch`, `snapshot-build-mismatch`, `contents-hash-mismatch`, `snapshot-genesis-mismatch`,
`snapshot-block-not-finalized`, `snapshot-root-mismatch`, `snapshot-target-not-empty`).

**Processing halts** (state `halted`, live, not ready, the database at the last committed height), with these codes:
`callback-error` (with point and module), `database-error`, `parent-mismatch`, `finality-conflict`,
`node-requirement`, `unknown-runtime`, `bad-version-digest`, `pin-mismatch`, `metadata-mismatch`, `root-mismatch`,
`fast-log-unsupported`, `unexpected-cursor`, `writer-lock-lost`, `truncate-not-allowed` (a callback error);
for a private instance, `lockstep-behind` and `report-hash-mismatch`.

## 12. Exported surface and command (LS-1, LS-6)

**Values:** `defineConfig`, `coreEntry`, `pastEntry`, `defineModule`, `startProcess`, `InMemoryBlockSource`,
`cursorTable`, `heightVersionedTable`, `encodeCanonical`, `encodeRow`, `contentsHash`, `POINTS`, `UmbraError`.

**Types:** `ModuleDeclaration`, `ItemDeclaration`, `Lifetime`, `FieldKind`, `FieldSchema`, `Migration`, `Revision`,
`PointName`, `PointCallbacks`, `ProcessContext`, `BlockContext`, `ItemSink`, `ReadHandle`, `BlockWriteHandle`,
`SchemaWriteHandle`, `ApiRegistry`, `BlockRef`, `BlockSource`, `LedgerPackage`, `Entry`, `CoreVersion`, `UmbraConfig`,
`ProcessHandle`, `ProcessState`, `ErrorCode`.

**Command:** `umbradb run [--config <file>]`, `umbradb config check <file>`, `umbradb snapshot export --out <file>`,
`umbradb snapshot import <file>`.

## 13. Quality gates: what moves and what is retired (LS-5; for the owner's approval, CORE-ARCH SC-010)

Inventory taken at `a75ed95`. Besides the rows below, every file that only aggregates or selects retired artifacts
— Lean import lists, test selections, coverage and mutation configuration — is updated to drop them, as listed in the
"Aggregators" row; nothing else changes.

| Gate | Retired with its 0.9.5 part | Kept or retargeted | Added |
|---|---|---|---|
| Lean (`Formal/Lean`, `lean.yml`) | `UmbraDBFormal/TemporalKV/**` (T1–T5 and retention), `UmbraDBFormal/Checkpoint/**` (C1) and their `UmbraDBFormalTest` counterparts; `APISmoke` lemmas `checkpoint_union_comm/assoc/idem` | `UmbraDBFormal/Watermarks/**` and tests: W1 is the law of the cursor table (SH-1); `APISmoke.watermark_overwrite`; `APISmoke.adjacent_Ico_disjoint` (the half-open rule of SH-2); `Trust.lean` (imports trimmed); the `lean.yml` job unchanged | — |
| Aggregators | `Formal/Lean/UmbraDBFormal/Checkpoint.lean`, `UmbraDBFormal/TemporalKV/Retention.lean` | `Formal/Lean/UmbraDBFormal.lean` keeps the `APISmoke` and `Watermarks` imports and drops `Checkpoint` and the three `TemporalKV` imports; `UmbraDBFormalTest/Trust.lean` trimmed the same way; `vitest.mutation.config.ts` `include` (lines 20-26) replaced by the test files of the new mutation targets; the `chain-archive` coverage exclusion of `vitest.config.ts:75-79` removed | — |
| `Formal/STORAGE_ALGEBRA.md` and the formalization roadmaps | Laws T1–T4, C1, C2a, C2b, L1 and property tests P1–P8, P10, P11 marked retired (header note, kept as history) | W1/P9 re-bound to the cursor table; T5's half-open rule restated for heights | — |
| `openspec/changes/v1.1.0-quint-model-checking` (Proposed) | Status set to Archived: its laws (C2a, C2b, L1, T1 cross-writer) are retired | — | — |
| Required test ids (`test/integration/required-tests.manifest.json`, `EXPECTED_REQUIRED_COUNT = 25`) | Ids 5–25 and the deferred `crash.pg-kill-save.no-duplicate-with-idempotency-key` | Ids 1–4 (`crash-harness.smoke.*`), retargeted to a crash worker that drives the runner | The ids of `acceptance.md` §17; the pinned count becomes 4 + their number |
| Test files | TemporalKV, CheckpointStore, Lease, `saveAndAdvance`, WalletStateEnvelope and cross-part durability tests; `no-consumer-import-in-bench`; `chain-archive-{migrate,rollover,store}` tests (replaced by the core block table tests); `chain-archive-{sync,sync-retry,replay-decode,preprod-cloud-crossval}` integration tests (they drive the official-indexer client, deleted by rule b); `api-surface/chain-archive-routing`; `no-chain-sync-import-guard` (the folder is gone) | `durability-probe.test.ts`; `migrate`, `migration-lock-timeout`, `client`, `errors` and `chain-archive-sync/node-rpc-client.test.ts` refactored onto `src/db/` and `src/node/`; `watermarks.property.test.ts` (P9) retargeted; `no-sdk-import-guard`; gate machinery | One test file per acceptance group |
| TransactionHistory tests | — | Moved with the source to `legacy/transaction-history/`, excluded from the run (LS-3) | — |
| Coverage floors (`vitest.config.ts:47-60`) | `checkpoint-store`, `save-and-advance`, `watermarks`, `temporal-kv`, `transaction-lease` | `durability-probe` 97/92, `migrate` 90/85, `errors` 95/91 (moved paths) | `src/**` 90/85 by default; `src/determinism/**`, `src/helpers/**` and `src/ledger/sweep*` 95/90 |
| Mutation (`stryker.conf.json` `mutate`, break 65) | The five 0.9.5 adapters | Break threshold 65 | `src/modules/graph.ts`, `src/runner/order.ts`, `src/config/history.ts`, `src/determinism/cbor.ts`, `src/determinism/digest.ts`, `src/helpers/height-versioned.ts`, `src/helpers/cursor-table.ts`, `src/ledger/sweep.ts`, `src/backbone/block-fetch-queue.ts` |
| Public API pins (`test/api-surface/*`, `test/smoke/pack-install.mjs`) | The 36-symbol pins, the error-catalog and retryability tables of 0.9.5 | The deep-import block; `package-json-strict` (exports only `"."`) | A sorted-name pin of §12; the pack smoke imports §12, syncs a tape on PostgreSQL in Docker, and runs `umbradb config check` |
| Benchmarks (`bench/`, non-gating `bench-smoke.yml`) | TemporalKV, Watermarks, CheckpointStore, Lease and TransactionHistory workloads and their baseline | The non-gating job | `runner.commitEmptyBlock` per backend; the ingest comparison with the official indexer (SC-009, `bench/ingest-vs-official/`) |
| Scripts | `archive:sync` | — | `build:browser`, `vendor:ledger` |
| `docs:storage` (`typedoc.json`, not run in CI) | The five 0.9.5 entry points | — | The §12 surface |
| Documents stating "36 symbols" | — | `docs/releases/v0.9.5.md` unchanged (history) | `ROADMAP.md:455` and `docs/v1-implementation-guideline.md:194` updated at close-out |

## 14. External claims and their evidence

| Claim | Evidence | Status |
|---|---|---|
| Node.js 24 loads `.ts` with type stripping | Installed v24.9.0: `process.features.typescript === "strip"` | Verified (installed) |
| JSON.parse source text access in revivers | Node.js v24.9.0: `JSON.parse("[1]", (k, v, c) => c?.source ?? v)` gives `"1"` | Verified (installed) |
| `postgres`: `sql.reserve()` pins a connection; JSON parsed with `JSON.parse`, replaceable | `src/postgres/transaction-lease.ts:135-138, 287-301`; `node_modules/postgres/src/types.js:18-21` (3.4.9) | Verified (installed, in-repo use) |
| PostgreSQL 17: `SET LOCAL ROLE`, `SECURITY DEFINER`, `REPEATABLE READ READ ONLY`, session advisory locks, `BEFORE TRUNCATE` triggers, `jsonpath` `.type()`/`.floor()` | https://www.postgresql.org/docs/17/ (sql-set-role, sql-createfunction, sql-set-transaction, functions-admin, sql-createtrigger, functions-json) | Version-pinned documentation; re-checked by tests |
| PGlite: roles, `SET LOCAL ROLE`, `SECURITY DEFINER`, PL/pgSQL row and `TRUNCATE` triggers, `jsonpath`, one connection; OPFS storage in a browser worker | — | **Unconfirmed**: task 0.1 probe tests |
| zod 4: per-field metadata read back from an object schema, defaults, issue paths | `zod` 4.4.3 installed | **Unconfirmed** (metadata API): task 0.1 |
| `ws`: WebSocket server and client, over `https` with client certificates | — | **Unconfirmed**: task 0.1 |
| `esbuild` bundles worker entry points with WASM assets | — | **Unconfirmed**: task 0.1 |
| `midnight_ledgerStateRoot(at)` | `midnight-node/pallets/midnight/rpc/src/lib.rs:60-61` (node 2.1.0-rc.4) | Verified (reference) |
| `system_properties.genesis_state` holds the genesis ledger state | `midnight-indexer/chain-indexer/src/infra/subxt_node.rs:562-575` | Verified (reference) |
| One `MNSV` digest per block, block 0 included | `midnight-node/pallets/version/src/lib.rs:32,55`; `midnight-node/node/src/service.rs:172-190` | Verified (reference) |
| Content decoded with the parent state's metadata at an upgrade | `midnight-indexer/chain-indexer/src/infra/subxt_node.rs:185-200,266-290` | Verified (reference) |
| Block 0 algorithm | `midnight-indexer/chain-indexer/src/application.rs:543-583`; `infra/subxt_node/runtimes.rs:292,327-342` | Verified (reference) |
| Replay rules | `midnight-indexer/chain-indexer/src/domain/ledger_state.rs:44-85` | Verified (reference) |
| Mainnet 1.0 boundary at F = 1,774,492 | `midnight-indexer/chain-indexer/src/infra/subxt_node/header.rs:56-91` | Verified (reference fixture) |
| Storage layout `layout-v2`, children with embedded nodes, `gc-v1` | `midnight-ledger/storage-core/src/db/sql.rs:258-262`, `arena.rs:285-331`, `gc.rs:93-250`, `backend.rs:771-790` | Verified (reference) |
| The VM's log decoding | `midnight-ledger/onchain-vm/src/vm.rs:241-275` | Verified (reference) |
| The published v9 WASM lacks the functions of §5.2 | `midnight-ledger/ledger-wasm/src/` (`@midnight/ledger-v9` 1.0.0-rc.5) | **Unconfirmed** in detail: task 0.2 lists each missing export |
| The v8→v9 conversion builds to WASM | — | **Unconfirmed**: task 0.2 locates and pins its source |
| RFC 8949 §4.2.1 and Appendix A | https://www.rfc-editor.org/rfc/rfc8949 | Verified (normative text) |
| TypeScript compiler API for `noEmit` | `typescript` 5.9.3 installed | Verified (installed) |

## 15. Relation to the existing design documents

- `design/design.md` §2 (TemporalKV), §3 (checkpoint chunker), §4 (Watermarks) and §5 (commit/transaction layer)
  describe the parts this change retires or refactors; §5's transaction rule survives as one transaction per block
  (RN-6) and its lease as the writer lock (DB-11). Those sections stay as the record of 0.9.5; `ROADMAP.md` points here.
- `design/design-interfaces.md` §1.1 (thrown, `code`-discriminated errors with retryability) is kept; §3.1–§3.4 are
  superseded by §12 of this document.
- `Formal/STORAGE_ALGEBRA.md`: W1 is kept (cursor table); T5's interval rule is restated for heights (SH-2); the other
  laws are retired as in §13, each listed for the owner's approval.
