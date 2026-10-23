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
| `src/config/` | `defineConfig`, `coreEntry`, `versionEntry`, the loader, the plain-data check, schema validation, the history comparison, the version check |
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
- **Provider functions.** `SECURITY DEFINER`, owned by the provider role, with `SET search_path = pg_catalog, <provider
  schema>, pg_temp` (`pg_temp` last, so no temporary table shadows a provider table); default privileges revoke
  `EXECUTE` from `PUBLIC`; `EXECUTE` is granted to the roles of modules that require the provider's item (DB-7).
  `core-ledger-state` offers `persist(key)` this way (LG-13).
- **`TRUNCATE`.** Every public module table gets a `BEFORE TRUNCATE … FOR EACH STATEMENT` trigger raising
  `truncate-not-allowed` (DB-14).
- **Column types and stored values (DT-1, DT-2, DT-6, Q57, Q58).** One table of rules,
  `src/determinism/column-rules.ts`, decides for each column of a public table whether its type is allowed as a value
  and as a key, with the reason and the alternative of the column-type table below; the contents hash (DT-3) and the
  migration-time check (DT-6) both use it, so a refusal reads the same in both, and each rule carries a comment with its
  reason. It reads the catalog: `format_type(atttypid, atttypmod)` for the message, the type's base name for the rule,
  `numeric`'s declared scale from the type modifier, and `pg_type.typtype` for enums, domains and composite types.
  `core_chain.jsonb_numbers_ok(jsonb)` (immutable; a `jsonpath` finding any number outside the signed 64-bit range or
  whose text, `.string()`, is not `-?[0-9]+`, so `1.0` fails too, Q57) and `core_chain.numeric_ok(numeric)` (`scale(c) =
  0 AND c <> 'NaN'`; `scale('NaN')` is null, so `NaN` fails too; verified on PostgreSQL 17.11 and PGlite 0.5.10), with
  array forms for `jsonb[]` and `numeric[]`, back a `CHECK` on every such column of a public module table.
- **Migrations and setup (DB-9, DB-10).** `core_chain.migrations`; checksum = SHA-256 of the UTF-8 SQL; per part and
  module, pending migrations each in their own transaction with their row, then `on-start-db` in its own transaction.
  Upgrade migrations only add — a module obligation (Q46); `requiresResync` versions are refused on a non-empty
  database built with another version of the module (DB-10). The writer lock is taken before any migration, so the
  0.9.5 migration advisory lock is gone.
- **Identifier lengths (DB-8).** Ids and item names are at most 40 bytes, so `umbradb_m_<schema>` and
  `umbradb_i_<item>` stay within PostgreSQL's 63-byte identifiers; shadow tables are named by hash (below).
- **Writer lock (DB-11).** PostgreSQL: `pg_try_advisory_lock(3, hashtext('umbradb-writer'))` on the writer connection
  (classes 1 and 2 were 0.9.5's, `src/postgres/transaction-lease.ts:192-195`). PGlite in Node.js — which lets two
  processes open one data directory (probe, PGlite 0.5.10, 2026-10-22) — takes an operating-system lock, fail-stop
  (Q50): before opening PGlite, the process opens `<data directory>.lock.sqlite` with `node:sqlite` (`DatabaseSync`),
  sets `busy_timeout` to 0, runs `BEGIN EXCLUSIVE` and keeps that transaction open, never committing, until it exits.
  SQLite's file locks are operating-system locks: a second process gets `database is locked` at once and refuses with
  `writer-lock-held`; the operating system releases the lock when the holder ends, and never while it lives. Verified
  in Node.js v24.9.0 (2026-10-22): a second process was refused while the holder ran and while it was stopped with
  `SIGSTOP`; after `SIGKILL` a new process took the lock at once. `node:sqlite` still prints an experimental warning in
  Node.js 24; it is a built-in module, used only for this development-only backend. Local file systems only.
  Browser: a Web Locks lock named after the database (BR-1), which the browser releases when the worker ends.
- **Durability probe.** Moved unchanged in behaviour (`fsync` :72-84, `full_page_writes` with the override :61-66 and
  :86, pooler detection :16 of `src/postgres/durability-probe.ts`); the override is `fullPageWritesOffAllowed`.
- **Change capture for digests (DT-4).** For a module with `digest: true`, a row-level `AFTER INSERT OR UPDATE OR
  DELETE` trigger on each of its tables copies, on the first touch of a primary key in the transaction, the old row (or
  a tombstone) into `core_digest_shadow.t_<first 32 hex digits of SHA-256(schema.table)>`; `core-digest`, last in
  `on-db-write`, reads each shadow row and the current row, computes the net change, extends the chain, writes
  `core_digest.digests` and deletes the shadow rows, inside the block transaction.
- **Errors.** `UmbraError { code, retryable, details }`, keeping the 0.9.5 retryable split
  (`design/design-interfaces.md` §1.1); a lost connection is `connection-lost` (retryable).

**Column types (Q58).** Every refusal names the module, the table, the column and its declared type, then the reason and
the alternative of its row. A table without a primary key is refused with `no-primary-key`: rows are hashed and digested
in primary-key order (DT-2), and without a key there is no order every database agrees on; add a primary key of the key
types below. An identity or `serial` column is refused with `non-deterministic-column`: a sequence never rolls back, so
its next value depends on rolled-back and retried blocks, not only on the chain; derive keys from the block (height,
transaction index). A default that is not immutable is refused with `non-deterministic-column`: it calls a function
PostgreSQL marks stable or volatile (`now()`, `random()`, `gen_random_uuid()`) or uses an SQL value function
(`CURRENT_TIMESTAMP`, `CURRENT_USER`), so each machine, or each retry, gets a different value; compute the value from
the block in `on-db-write`. An immutable default (`'abc'`, `1 + 2`, `lower('X')`) and a stored generated column, which
PostgreSQL requires to be immutable, are allowed. A public schema holding a sequence is refused with
`non-deterministic-table` (Q61): module code can draw from a sequence at any time, and its values depend on retries;
derive values from the block (height, transaction index), and drop the sequence (Q64). A public schema holding an
unlogged table is refused with `non-deterministic-table` (Q61): PostgreSQL empties an unlogged table after a crash,
while the cursor still records its blocks as committed; make the table logged: create it without `UNLOGGED`, or run
`ALTER TABLE ... SET LOGGED` (Q64). The contents hash refuses all of these too, with the same codes and messages, in any
public schema (Q61). Detection, checked on PostgreSQL 17.11 and PGlite 0.5.10: `pg_attribute.attidentity`; a default's
expression tree (`pg_attrdef.adbin`), read as stored, as PostgreSQL's own immutability check reads it (Q62): every
function id (`:funcid`, and `:opfuncid`, `:hashfuncid` and `:negfuncid` for operators, an operator stored without one
read through `pg_operator`), each looked up in `pg_proc.provolatile`; a conversion through text (`COERCEVIAIO`: the
result type's input function and the argument type's output function); a row comparison's operators (`ROWCOMPAREEXPR`);
an SQL value function (`SQLVALUEFUNCTION`, stable) and `NEXTVALUEEXPR` (volatile), which have no function id; SQL/JSON
constructors and queries, refused outright because the tree does not record whether they are immutable (Q63); a branch
that can never run still counts, since the tree is read without PostgreSQL's constant folding (Q63); `pg_class.relkind =
'S'` for a sequence and `relpersistence = 'u'` for an unlogged table.

| Type | As a value | As a key | Refused because / use instead |
|---|---|---|---|
| `smallint`, `integer`, `bigint` | integer | yes, numerically | — |
| `numeric`, `numeric(p)`, `numeric(p,0)` | canonical integer text; the `CHECK` refuses a fraction or `NaN` | no | As a key: DT-2 orders keys by value or by bytes, and a `numeric`'s text does not sort by value; use `bigint`, or `bytea` holding a fixed-width big-endian unsigned value |
| `numeric(p,s)`, s > 0 | refused | refused | Every value prints with s decimals (`100` → `100.00`), and stored numbers are integers so that equal hashes mean equal query results (Q57); store integer smallest units in `numeric(p)` or `bigint` |
| `bytea` | byte string | yes, by bytes | — |
| `text`, `varchar(n)` | text string | yes, by bytes (`COLLATE "C"`) | — |
| `uuid` | byte string of its 16 bytes | yes, by bytes | — (a `gen_random_uuid()` default is still refused as random) |
| `boolean` | `false` / `true` | yes, `false` first | — |
| `jsonb` | CBOR, map keys sorted; the `CHECK` on numbers | no | As a key: PostgreSQL's `jsonb` order (by kind, then size, then contents) is not the order of the encoded bytes; use a `text` or `bytea` key |
| arrays of the value types above | array | no | As a key: PostgreSQL compares arrays element by element, while the encoding puts the length first; use a composite key |
| `real`, `double precision` | refused (`non-deterministic-column`) | refused | Approximate: a value computed two ways can differ in its last bits (Q60: in `double precision`, `0.1 + 0.2` is `0.30000000000000004`, not `0.3`; in `real`, `0.1 + 0.6` is `0.70000005`, not `0.7`); use integers in fixed units (`bigint`, `numeric(p)`) |
| `timestamptz`, `timestamp`, `date`, `time`, `timetz`, `interval` | refused | refused | Per type (Q59): `timestamptz` and `timestamp` — the drivers return a JavaScript `Date`, which keeps milliseconds only (`10:00:00.123456` and `10:00:00.123999` read back equal), and the text depends on `DateStyle` (and, for `timestamptz`, `TimeZone`); `date` — the drivers return a JavaScript `Date`, and the text depends on `DateStyle` (`2026-10-23` or `23/10/2026`); `interval` — the drivers return its text, which depends on `IntervalStyle` (`1 day 02:00:00` or `P1DT2H`); `time` and `timetz` — no canonical encoding is defined for a time of day (the drivers return its text). Store `bigint` milliseconds since the epoch, as `core_block_commit.blocks.block_timestamp_ms` does |
| `json` | refused | refused | PostgreSQL keeps `json`'s input text (spaces, key order, duplicate keys), but the drivers parse it, so different stored texts read back equal; use `jsonb` |
| `char(n)` | refused | refused | Stored padded with spaces, compared ignoring them and cast to `text` without them, so its value depends on how it is read; use `text` or `varchar(n)` |
| `money` | refused | refused | Its text depends on the `lc_monetary` setting; use `bigint` smallest units |
| enums, domains, composite types | refused | refused | User-defined: their labels, base type or fields live in the catalog, not in the row, and no rule here covers them; use the base type (`text` with a `CHECK` for an enum or a domain, separate columns for a composite) |
| any other type (network, bit-string, XML, geometric, range, full-text, …) | refused | refused | No canonical encoding is defined; the supported types are those above |

The reasons for the time types, `json`, `char(n)` and `numeric(p,s)` were checked on PGlite 0.5.10 and PostgreSQL 17.11
(2026-10-23, the decision record's Q58).

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
  stateKey(state: StateHandle): Uint8Array;                // its root node's key, what `load` takes (Q55)
  flush(): NodeBatch;                                      // nodes created, and root-count changes, since the last flush
  persist(key: Uint8Array): void;
  release(key: Uint8Array): void;
  childRefs(children: Uint8Array): Uint8Array[];           // a node's Ref keys, through embedded children
  evict(keys: Uint8Array[]): void;                         // drop swept nodes from the caches
  contractStateKey(state: StateHandle, address: Uint8Array): Uint8Array | null;
  contractZswapStateKey(state: StateHandle, address: Uint8Array): Uint8Array | null;
  decodeLogItem(value: Uint8Array): LogItem | null;        // the VM's own log decoding (CC-3); v8: null (Q54)
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
  rootCounts: { key: Uint8Array; delta: number }[] }       // signed change of each changed root count (Q53)

// What modules on the main thread receive as `block-parsed` (Q49): plain, structured-cloneable data.
interface ParsedTransaction {
  index: number;                               // application order (CD-5)
  hash: Uint8Array; kind: "regular" | "system"; size: number; bytes: Uint8Array;
  segments: { segment: number;
              calls: { address: Uint8Array; entryPoint: Uint8Array }[];
              deploys: { address: Uint8Array }[] }[];
}
// A module's ledger task (LG-17), run in the ledger worker once per block.
interface LedgerTask {
  name: string;
  needsState: boolean;                         // true: the module must require `ledger-state` (LG-17)
  run(block: { height: bigint; transactions: unknown[];          // native parsed objects
               stateBefore?: StateHandle;                         // only when needsState
               packages: Readonly<Record<string, unknown>> }): unknown;   // returns plain data
}
```

`firstRegularAtParentTime` is true for runtimes 0.22, 1.0 below 1.0.300 and 2.0, and never for block 0, as the official
indexer decides it (`chain-indexer/src/domain/ledger_state.rs:44-85`).

A batch's `rootCounts` are signed changes, not counts (Q53): after a restart the worker cannot read a stored count
through `NodeStore`, so the writer adds each `delta` to `core_ledger_state.root_counts` and deletes a row whose count
reaches 0. `stateKey` gives the 32-byte key of a state's root node, which `core_ledger_state.states.state_key` stores
and `load` takes; it cannot be derived from `stateRoot`, which for a state under the ledger's 1,024-byte embedding
limit is the state itself (Q55). The v8 adapter's `decodeLogItem` returns null and its `apply` returns no `logs`: a
v8 `ContractLog` carries a raw value, not a MIP-0002 event (Q54).

### 5.2 Vendored builds (LG-5)

`vendor/ledger/<version>/` holds `upstream.json` (repository URL, commit, release name = `versionName`),
`patches/*.patch` (applied in order), `build.sh` (a Docker image pinned by digest with the Rust toolchain,
`wasm-bindgen-cli` and `wasm-opt`, the tools of upstream's own WASM build), and the built package with `SHA256SUMS`;
`npm run vendor:ledger` rebuilds every version and compares. The functions `LedgerPackage` needs that the published
packages lack (`load`, `stateRoot`, `stateKey`, `flush`, `persist`, `release`, `childRefs`, `evict`, the contract keys,
v9's `decodeLogItem`, the conversion) are the patches; the v9 package also exports `serializeStateValue`, which turns a
native state value into `decodeLogItem`'s input. `vendor/ledger/README.md` lists each patch and what it adds; the owner
proposes them upstream, as a few pull requests, once `midnight-ledger` is stable (Q56). v8 is `ledger-8.1.2`, the v8
ledger `midnight-node` 2.1.0-rc.4 pins (`Cargo.toml:86`). v9 is `midnight-ledger` `ledger-9.1.0.0-rc.5` (the reference
used for CORE-ARCH). The v8→v9 conversion is the crate `v8-to-v9-state-translation` at `midnight-ledger` rev
`da96e33d78ee9b7d3867b15c1037510d499cd909`, the revision the node pins (`midnight-node/Cargo.toml:115`); it was written
against v9 tag `crate-ledger-9.1.0.0-rc.3`, and the node's `[patch.crates-io]` (`Cargo.toml:459`) builds it against
the rc.5 crates, so the vendored v9 package and the conversion are both built from rc.5, as the node builds them
(task 0.2). It compiles for `wasm32-unknown-unknown` with `getrandom`'s `wasm_js` backend. CI rebuilds each vendored
package and compares the SHA-256.

### 5.3 The ledger worker and the node-store bridge (LG-10, LG-11)

Ledger work runs in a worker thread. The ledger reads nodes synchronously, so `NodeStore.get` in the worker posts a
request to the main thread through a `SharedArrayBuffer` and blocks with `Atomics.wait` until the main thread, which
owns the database, writes the node bytes back (batched: a miss prefetches the node's referenced keys). The main thread
never blocks on the worker; it awaits the worker's results asynchronously. Native parsed objects never leave the
worker (Q49): the main thread receives `block-parsed` as `ParsedTransaction[]` and each ledger task's plain result.

### 5.4 Storage, retention and sweep (LG-11 to LG-14)

Tables in §10. Per block, `on-compute` runs the apply, the conversion when due, the root check and the sweep step's
computation; `on-db-write` writes the flushed batch, the `states` row, the retention releases and the sweep tables. The
sweep follows `gc-v1` (`storage-core/src/gc.rs:93-250`) with a node budget; its grey and mark sets are tables, its
rounds take keys in byte order, and deleted nodes are evicted from the worker's caches so later blocks insert them again
(`layout-v2` writes every created node, `storage-core/src/backend.rs:771-790`).

### 5.5 Ledger tasks (LG-17, Q49)

The host program provides the ledger worker's entry: a small file that imports the same module packages as the main
thread and calls `runLedgerWorker(modules)` (exported); in the browser it is the ledger worker's bundle (§9.2). For each
block, the worker parses the transactions, runs every active module's `ledgerTasks` in the order of RN-3 — each with the
native parsed objects, `rawPackages()` and, for a task that declares `needsState`, the state before the block
(read-only) — checks that each result is
structured-cloneable plain data (a `structuredClone` round trip that preserves it), and posts `block-parsed` and the
task results to the main thread, where they become `block` items before `on-compute`. `core-ledger-state`'s apply, the
conversion and the sweep step then run in the worker as part of `on-compute`. Ledger tasks keep no state between blocks.

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
  their metadata (`schema.shape[field].meta().kind`, verified on 4.4.3); only revisions whose version is this build's
  are validated against this build's schema; a `versionEntry` revision is compared with its recorded row, or — when it
  is a later version not yet recorded — recorded as written and validated by the build that carries its version (CF-3).
- **Core stop.** Operational: not stored (`core_chain.config.stop` is null for `core`), changeable at any restart.
- **History.** `core_chain.config`, compared and extended by `core-chain`'s `on-start-db` (CF-6); the version check
  (CF-8) runs before any `on-start-db`.
- **`umbradb config check`.** The TypeScript compiler API (`typescript` becomes a runtime dependency; 5.9.3 installed)
  with `noEmit`, then the loader, the plain-data check and schema validation; with `--database`, a read-only connection
  that reads `core_chain.config` and runs the history checks, with no migration and no write (CF-10).

## 8. Private processes (PP)

- **Transport.** The core runs a WebSocket server (`ws`) on `listen.transport`; with `tls` set it is an `https` server
  requiring client certificates (`requestCert`, `rejectUnauthorized`; verified with `ws` 8.22.0: a client without a
  certificate is refused with `CERTIFICATE_REQUIRED`). In the browser, `postMessage` between workers; in tests, direct
  calls. One JSON object per message, validated against these schemas (zod) on both ends:

  | Type | Fields (`H` = height, a decimal string; `X` = `0x`-prefixed lowercase hex) |
  |---|---|
  | `hello` | `v: 1`, `instance: string`, `version: string`, `height: H`, `hash: X` or `null` |
  | `hello-ack` | `v: 1`, `lockstep: boolean`, `genesis: X`, `start: H`, `cursor: H` or `null`, `refused`: `null`, `"duplicate-instance"` or `"lockstep-behind"` |
  | `committed`, `report` | `v: 1`, `height: H`, `hash: X` |
  | `read` | `v: 1`, `id: string`, `statements`: an array of `{ sql: string, params: Value[] }` |
  | `read-result` | `v: 1`, `id: string`, `height: H` or `null` (before the first commit), and either `results`: one `{ columns: { name: string, type: string }[], rows: Value[][] }` per statement, or `error: string` (a code); `type` is the PostgreSQL type name that says how to read each `Value` back |
  | `api` | `v: 1`, `id: string`, `module: string`, `method: string`, `params` (JSON) |
  | `api-result` | `v: 1`, `id: string`, and either `result` (JSON) or `error: string` (a code) |

  `Value` is `null`, a boolean, a string (text; `bigint` and `numeric` as decimal strings; `bytea` as `X`), or JSON (for
  `jsonb`); the column types of the statement say how to read each string back.
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
computes the contents hash while writing; the manifest's `contentsHash` (a fixed-size CBOR byte string) is written last
into its reserved slot, so the file is written in one pass. Import runs in the empty target database (SN-4): it writes
`core_chain.import_marker`, runs the checks of SN-3 that need no tables, runs the recorded migrations unchanged (so
qualified names, checksums and provider functions stay as recorded), checks columns and types, loads the rows in
batches, verifies the contents hash, and in one final transaction writes `core_chain.identity` and deletes the marker.
A start that finds the marker drops every schema the import created, then the marker, and refuses with
`snapshot-import-interrupted`.

### 9.2 Browser build (BR)

`browser/` holds a static page and three worker entry points (core, ledger, private), bundled with `esbuild` (a new
development dependency, pinned in task 0.1); PGlite runs in the core and private workers with `memory://` or
`opfs-ahp://` storage (memory by default, OPFS optional; verified by probe, §14); the admin endpoints are message calls;
the page offers a snapshot file picker. `npm run build:browser` writes `dist-browser/`, which is not part of the npm
package.

## 10. Tables

Every column is `NOT NULL` unless marked null; a one-row table has the key `id smallint` with `CHECK (id = 1)`;
per-block tables are append-only and partitioned by height range; no table stores wall-clock time; hashes and keys are
`bytea`; heights and indexes are `bigint`; amounts wider than 64 bits are `numeric`; nothing is a float.

| Owner | Table | Primary key | Other columns |
|---|---|---|---|
| `core-chain` | `core_chain.identity` | id = 1 | genesis_hash, start_height, anchor_hash (null until block S commits) |
| `core-chain` | `core_chain.config` | (entry_id, start) | stop (null; always null for `core`), version (text), data (jsonb, canonical), data_hash |
| database API | `core_chain.migrations` | (module, migration_id) | checksum, position (int) |
| `core-block-commit` | `core_block_commit.blocks` | height | hash, parent_hash, spec_version (int), ledger_version (text), block_timestamp_ms |
| `core-block-commit` | `core_block_commit.hashes` (not partitioned) | hash | height — makes a repeated hash fail, which the height-partitioned `blocks` table cannot enforce |
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
`migration-checksum-changed`, `migration-missing`, `migration-failed`, `non-deterministic-column`,
`non-deterministic-table`, `no-primary-key`, `unsupported-key-type`, `unsupported-column-type` (DT-6, Q58, Q61),
`shared-item-migrations-differ`, `unknown-point`, `reserved-prefix`, `bad-id`, `schema-collision`, `item-no-provider`,
`providers-overlap`, `graph-cycle`, `item-not-available`, `no-requirement`, `cannot-start-mid-chain`,
`process-item-missing`, `duplicate-api-route`, `development-opt-in-required`, `needs-lockstep-not-listed`,
`private-binding-mismatch`, `test-key-conflict`, `package-hash-mismatch`, `writer-lock-held`, `durability-fsync-off`,
`durability-pooler`, `durability-full-page-writes-off`, and the snapshot import checks (`snapshot-format-unknown`,
`snapshot-history-mismatch`, `snapshot-build-mismatch`, `contents-hash-mismatch`, `snapshot-genesis-mismatch`,
`snapshot-block-not-finalized`, `snapshot-root-mismatch`, `snapshot-target-not-empty`, `snapshot-import-interrupted`).

**Processing halts** (state `halted`, live, not ready, the database at the last committed height), with these codes:
`callback-error` (with point and module), `database-error`, `parent-mismatch`, `finality-conflict`, `node-requirement`,
`duplicate-block-hash`, `unknown-runtime`, `bad-version-digest`, `pin-mismatch`, `metadata-mismatch`, `root-mismatch`,
`fast-log-unsupported`, `unexpected-cursor`, `writer-lock-lost`, `truncate-not-allowed` (a callback error); for a
private instance, `lockstep-behind` and `report-hash-mismatch`.

## 12. Exported surface and command (LS-1, LS-6)

**Values:** `defineConfig`, `coreEntry`, `versionEntry`, `defineModule`, `startProcess`, `runLedgerWorker`,
`InMemoryBlockSource`,
`cursorTable`, `heightVersionedTable`, `encodeCanonical`, `encodeRow`, `contentsHash`, `POINTS`, `UmbraError`.

**Types:** `ModuleDeclaration`, `ItemDeclaration`, `Lifetime`, `FieldKind`, `FieldSchema`, `Migration`, `Revision`,
`PointName`, `PointCallbacks`, `ProcessContext`, `BlockContext`, `ItemSink`, `ReadHandle`, `BlockWriteHandle`,
`SchemaWriteHandle`, `ApiRegistry`, `BlockRef`, `BlockSource`, `LedgerPackage`, `Entry`, `CoreVersion`, `UmbraConfig`,
`ProcessHandle`, `ProcessState`, `ErrorCode`, `ParsedTransaction`, `LedgerTask`.

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
| PGlite: roles, `SET LOCAL ROLE`, cross-schema writes denied, `SECURITY DEFINER` with a fixed `search_path` and `PUBLIC` revoked, PL/pgSQL row triggers, a `BEFORE TRUNCATE` trigger refusing, `jsonpath` `.type()`/`.floor()` in a `CHECK`, advisory-lock functions | Probe against `@electric-sql/pglite` 0.5.10 (published 2026-10-14) in Node.js v24.9.0, 2026-10-22: every item passed | Verified (probe); task 0.1 commits the probe as a test |
| `jsonpath` `.string()` keeps a JSON number's scale: `1.0` → `"1.0"`, `100.00` → `"100.00"`, `1e2` → `"100"` (Q57) | PostgreSQL 17.11 (`postgres:17-alpine`) and PGlite 0.5.10, 2026-10-23 | Verified (run); task 7.1's test re-checks it |
| PGlite 0.5.10 embeds PostgreSQL 18.6 (production is PostgreSQL 17) | `select version()` on 0.5.10 | Verified; the cross-backend differentials (A55, A105, A135) are the guard against differences |
| PGlite does not stop two processes opening one data directory | Probe: two Node.js processes opened and wrote one directory | Verified (probe); hence the operating-system lock of §4 |
| PGlite with OPFS storage in a browser worker; Web Locks exclusion | Probe in a Chromium-based browser, 2026-10-22: PGlite 0.5.10 in a module worker with `opfs-ahp://` wrote a row, closed, reopened and read it back; a second `navigator.locks.request(…, { ifAvailable: true })` on a held lock got `null` | Verified (probe) |
| An operating-system lock from Node.js (`node:sqlite`, `BEGIN EXCLUSIVE`) | Probe in Node.js v24.9.0, 2026-10-22: second process refused while the holder ran and while it was stopped; taken at once after `SIGKILL` | Verified (probe); `node:sqlite` is marked experimental in Node.js 24 |
| zod 4: per-field metadata read back (`shape[f].meta().kind`), defaults, issue paths, `z.toJSONSchema` keeping `kind` | Probe on `zod` 4.4.3, 2026-10-22 | Verified (probe) |
| `ws`: WebSocket server over `https` requiring client certificates | Probe on `ws` 8.22.0 (2026-09-26), 2026-10-22: with a certificate connected; without, `ERR_SSL_TLSV13_ALERT_CERTIFICATE_REQUIRED` | Verified (probe) |
| `esbuild` bundles a worker entry with a WASM asset | Probe on `esbuild` 0.28.2 (2026-08-08), 2026-10-22: 0 errors, the asset emitted | Verified (probe) |
| `midnight_ledgerStateRoot(at)` | `midnight-node/pallets/midnight/rpc/src/lib.rs:60-61` (node 2.1.0-rc.4) | Verified (reference) |
| `system_properties.genesis_state` holds the genesis ledger state | `midnight-indexer/chain-indexer/src/infra/subxt_node.rs:562-575` | Verified (reference) |
| One `MNSV` digest per block, block 0 included | `midnight-node/pallets/version/src/lib.rs:32,55`; `midnight-node/node/src/service.rs:172-190` | Verified (reference) |
| Content decoded with the parent state's metadata at an upgrade | `midnight-indexer/chain-indexer/src/infra/subxt_node.rs:185-200,266-290` | Verified (reference) |
| Block 0 algorithm | `midnight-indexer/chain-indexer/src/application.rs:543-583`; `infra/subxt_node/runtimes.rs:292,327-342` | Verified (reference) |
| Replay rules | `midnight-indexer/chain-indexer/src/domain/ledger_state.rs:44-85` | Verified (reference) |
| Mainnet 1.0 boundary at F = 1,774,492 | `midnight-indexer/chain-indexer/src/infra/subxt_node/header.rs:56-91` | Verified (reference fixture) |
| Storage layout `layout-v2`, children with embedded nodes, `gc-v1` | `midnight-ledger/storage-core/src/db/sql.rs:258-262`, `arena.rs:285-331`, `gc.rs:93-250`, `backend.rs:771-790` | Verified (reference) |
| The VM's log decoding | `midnight-ledger/onchain-vm/src/vm.rs:241-275` | Verified (reference) |
| The published v9 WASM lacks the functions of §5.2 | `midnight-ledger/ledger-wasm/src/state.rs` (`@midnight/ledger-v9` 1.0.0-rc.5): `LedgerState` offers whole-state `serialize`/`deserialize` (`state.rs:206-212`) and no state root, node-store loading, flush, persist/release, child references, eviction, contract keys or log decoding (searched 2026-10-22) | Verified (reference); these are the patches of §5.2 |
| The v8→v9 conversion builds to WASM | `v8-to-v9-state-translation` at `midnight-ledger` `da96e33d78ee9b7d3867b15c1037510d499cd909` (pinned by `midnight-node/Cargo.toml:115`): `cargo check --target wasm32-unknown-unknown` succeeds with `getrandom`'s `wasm_js` backend (2026-10-22) | Verified (compile check); running it is task 0.2 |
| Genesis cNight registrations are enumerated by key | `midnight-indexer/chain-indexer/src/infra/subxt_node/runtimes/v2_1_0.rs:403-412` iterates the double map; `state_getKeysPaged` in `midnight-node/docs/openrpc.json:769` | Verified (reference) |
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
