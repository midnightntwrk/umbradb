# Design — CORE-ARCH: the standalone indexer's core architecture

This design implements the owner-approved CORE-ARCH spec (2026-10-22, amended by Q45) as one change, by the owner's
decision Q47 ("one PR for the complete architecture"). CORE-ARCH lives in the owner's organizer workspace; every rule
this change relies on is restated in `specs/`. Owner decisions cited as Qn are in the organizer's decision record.

## 1. Source layout

| Path | Contents |
|---|---|
| `src/runner/` | Points, dispatch and order, the finalized loop, block context, item sink, start/stop and upgrade-boundary handling, the lockstep wait, heartbeat, process state |
| `src/db/` | The database API (`api.ts`; its PostgreSQL rules from `src/deterministic-postgresql/`), the PostgreSQL backend (refactored from `src/postgres/client.ts`), the PGlite backend, roles and grants, migrations (refactored from `src/postgres/migrate.ts`), the writer lock (refactored from `src/postgres/transaction-lease.ts`), the durability probe (moved from `src/postgres/durability-probe.ts`), change capture for digests |
| `src/modules/` | `ModuleDeclaration` and related types, `defineModule`, declaration validation, graph resolution per height range |
| `src/config/` | `defineConfig`, `coreEntry`, `versionEntry`, the loader, the plain-data check, schema validation, the history comparison, the version check |
| `src/determinism/` | The canonical CBOR encoder, primary-key order, the contents hash, digests |
| `src/deterministic-postgresql/` | The `deterministic_postgresql` component (§4, Q69): every rule UmbraDB imposes on PostgreSQL — column types, non-deterministic columns and tables, the `jsonb` and `numeric` checks, rows-only block transactions, the pinned session settings and timeouts, the result mapping and parameter texts; and `UmbraError` with its codes, which the mapping throws and `src/db/errors.ts` re-exports (Q79); it imports nothing else of `src/`, and its tests are `test/deterministic-postgresql/` |
| `src/helpers/` | The cursor table (from `src/postgres/watermarks.ts`) and the height-versioned table (from `src/postgres/temporal-kv.ts`) |
| `src/node/` | The node client (refactored from `chain-archive-sync/node-rpc-client.ts`): JSON-RPC over WebSocket, subscriptions, reconnect, back-off |
| `src/backbone/` | `core-chain`, `core-block-fetch` (the queue and the finalized prefetch), `core-block-commit`, `core-digest`; the admin endpoints `core-health`, `core-status`, `core-config` (Q70), each in its own folder with its tests; private: `core-private-source`, `core-key-registry` |
| `src/core-modules/` | `core-chain-events`, `core-block-parsed`, `core-tx-results`, `core-ledger-state`, `core-contract-states`, `core-contract-logs-full`, `core-contract-logs-fast` |
| `src/ledger/` | The `LedgerPackage` adapters (v8 from the 0.9.5 `chain-archive-sync/tx-replay-decoder.ts`, v9), the ledger worker, the node-store bridge, the sweep, the built-in version tables (`networks.json`) |
| `vendor/ledger/` | Vendored ledger builds: per version the pinned upstream source reference, the patches, the build script and the built WASM with its SHA-256 (§5.2) |
| `src/private/` | The process transport (core server, private client), lockstep bookkeeping (no key API: not core, Q70) |
| `src/backup/` | `umbradb backup` and `umbradb restore` around `pg_dump` and `pglite-tools` (§9.1) |
| `src/admin/` | The admin HTTP server (`node:http`) in its own worker thread, reading a state snapshot the runner publishes through a `SharedArrayBuffer` and messages, and running the endpoints of `core-health`, `core-status` and `core-config` on it; 404 for anything else; the redaction and sanitized-error helpers they share (AE-1, AE-6, Q70) |
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
| `on-key` | Private: a key became pending (PP-8) | Read handle at the cursor | In series |

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
- **Lossless `jsonb`.** Both backends read `json` and `jsonb` with UmbraDB's own reader of RFC 8259's grammar
  (`parseJsonLossless` in `src/deterministic-postgresql/mapping.ts`), not `JSON.parse` (Q78). It returns a `bigint` for
  every integer written outside ±(2^53 − 1) (DB-2), which plain `JSON.parse` rounds (the `postgres` driver uses it,
  `node_modules/postgres/src/types.js:18-21`). `JSON.parse` is avoided because of a V8 bug in Node.js 24 (reproduced
  here on 24.9.0, not on 24.2.0; reported upstream on 24.13.1–24.21.0) and Node.js 26 (reported on 26.3.0–26.10.0): once
  a parse in the process has read an object key that is a single backslash, a later parse can silently read an object
  key that is one escape sequence (`"\t"`, `"\n"`, `"\""`, …) as a backslash, so two different documents read back, and
  hash, equal (`nodejs/node#63785`; fixed in V8 by commit `93cd21e`, 2026-09-17; the Node.js backport
  `nodejs/node#66542` is not merged as of 2026-10-23). Once every Node.js version UmbraDB supports carries that fix, the
  reader may be replaced by `JSON.parse` with a reviver using source text access (`context.source`), as task 2.1 had it
  (`docs/issues/00007`).
- **Roles.** Each module's role is `umbradb_m_<schema>` (`umbradb_i_<item>` for a shared item, `<item>` in its schema
  form); `NOLOGIN`, owner of its schema; `USAGE` on every other module schema and `SELECT` on its tables (granted at
  every startup and by `ALTER DEFAULT PRIVILEGES`, as each schema's owner). Callbacks and migrations run after `SET
  LOCAL ROLE` to the module role (DB-6). A `table` item declares its schema: its module's own, or the item's name
  (`-` → `_`), which makes it a shared item; a provider of a shared `table` item writes — callbacks, `on-start-db`,
  migrations — under the item's role, so every provider can write the item's tables (Q89). Roles belong to the
  PostgreSQL server, so every UmbraDB database on it shares them (Q90). The writer's login is a superuser, or holds
  `CREATEROLE` and `CREATE` on the database: PostgreSQL 16 and later give a role's creator `ADMIN` on it only, so the
  login grants itself each module role `WITH INHERIT TRUE, SET TRUE` (`SET` for `SET LOCAL ROLE` and `CREATE SCHEMA …
  AUTHORIZATION`, `INHERIT` for its read pool and the `TRUNCATE` triggers); a login lacking a privilege, or facing a
  role another login created, refuses startup with `invalid-configuration` (`reason: writer-privileges`) naming each
  and the `GRANT` that fixes it (checked on PostgreSQL 18.6, 2026-10-24, §14). `src/db/roles.ts` (`planSchemas`,
  `prepareSchemas`, `setModuleRole`). Modules are trusted code (Q46): the roles stop accidental writes into another
  module's schema; nothing more is enforced.
- **Provider functions.** `SECURITY DEFINER`, owned by the provider role, with `SET search_path = pg_catalog, <provider
  schema>, pg_temp` (`pg_temp` last, so no temporary table shadows a provider table); default privileges revoke
  `EXECUTE` from `PUBLIC`; `EXECUTE` on the routines of the schema a provider writes is granted, now and by default
  privilege, to the roles of modules that require one of its items (DB-7). `core-ledger-state` offers `persist(key)`
  this way (LG-13).
- **`TRUNCATE`.** Every module table not declared `deterministic: false` gets a `BEFORE TRUNCATE … FOR EACH STATEMENT`
  trigger raising `truncate-not-allowed` (DB-14) — every partition too, since a statement trigger is not copied to
  partitions, and a partition of an opted-out table is opted out with it. The trigger function,
  `core_chain.truncate_not_allowed()`, refuses unless the transaction carries the migration mark: the setting
  `umbradb.migration` equal to the transaction's own `pg_current_xact_id()`, which the migration runner sets first in
  each migration's transaction, transaction-locally (A73). It fails closed: a block, `on-start-db` or any other
  unmarked transaction is refused; a mark ends with its transaction, and one left on the session by mistake names an
  earlier transaction. It raises the SQLSTATE `UM014`, which both backends report as `truncate-not-allowed`. The
  attachment runs at every startup after the migrations. SQL in `src/deterministic-postgresql/block-transactions.ts`,
  applied by `src/db/truncate-guard.ts`.
- **Column types and stored values (DT-1, DT-2, DT-6, Q57, Q58).** One table of rules,
  `src/deterministic-postgresql/column-rules.ts`, decides for each column of a module table, in every database (the
  core's or a private process's, Q75), whether its type is allowed as a value and as a key, with the reason and the alternative of the column-type table below; the contents hash (DT-3)
  and the migration-time check (DT-6) both use it, so a refusal reads the same in both, and each rule carries a comment
  with its reason. It reads the catalog: `format_type(atttypid, atttypmod)` for the message, the type's base name for
  the rule, `numeric`'s declared scale from the type modifier, and `pg_type.typtype` for enums, domains and composite
  types. `core_chain.jsonb_numbers_ok(jsonb)` (immutable; a `jsonpath` finding any number outside the signed 64-bit
  range or whose text, `.string()`, is not `-?[0-9]+`, so `1.0` fails too, Q57) and `core_chain.numeric_ok(numeric)`
  (`c IS NULL OR coalesce(scale(c) = 0, false)`: `scale()` is null for `NaN`, `Infinity` and `-Infinity`, and a
  `CHECK` passes on null, so that null must become false, while a NULL value stays allowed; checked on PGlite 0.5.10
  (PostgreSQL 18.6), 2026-10-24: `'Infinity'` and `'-Infinity'` passed the first form, `scale(c) = 0 AND c <> 'NaN'`,
  and `coalesce(scale(c) = 0, false)` alone refused NULL; this form accepts NULL and `1` and refuses `1.5`, `NaN` and
  both infinities), with array forms for `jsonb[]` and
  `numeric[]`, back a `CHECK` on every such column of a module table not declared `deterministic: false` (Q76).
- **Migrations and setup (DB-9, DB-10).** `src/db/migrate.ts` (`startDatabase`), refactored from 0.9.5's
  `src/postgres/migrate.ts`. One bootstrap transaction creates `core_chain` with the roles and schemas
  (`prepareSchemas`) and `core_chain.migrations` (§10: checksum = SHA-256 of the UTF-8 SQL; position = the migration's
  place in its part's list, from 1; a shared item's migrations recorded under the item's name, DB-8), grants every
  module role `USAGE` and `SELECT` on `core_chain`, attaches the `TRUNCATE` guard, and checks every part before any
  migration runs: `requires-resync`, `migration-checksum-changed`, `migration-missing` (also for a pending migration
  declared before an applied one, `reason: out-of-order`, Q91); a refusal rolls all of it back. Then, per part in
  RN-3's order, each pending migration in its own transaction: the migration mark first, the part's role (the writer's
  login for `core-chain` and `core-digest`, whose schemas are reserved), the SQL as one text of several statements on
  the simple protocol (`src/db/multi-statement.ts`, which only the runner reaches; a `Transaction`'s `query` and
  `execute` stay one statement each, on the extended protocol), a check that the SQL did not end the transaction
  (`migration-failed`, `reason: transaction-ended`), then its row — so a failing migration rolls back with its row,
  the ones before it stay, and startup refuses with `migration-failed`; then the `TRUNCATE` guard again for the tables
  the part added; then its `on-start-db` in a transaction of its own under its role, unmarked. No `search_path` is
  set: module SQL names its schema (the module guide). Upgrade migrations only add — a module obligation (Q46, the
  module guide); a `requiresResync` version is refused while a committed height of the database is covered by a
  revision of that module with another version (DB-10; the versions come from the configuration history and the
  cursor). The writer lock is taken before any migration, so the 0.9.5 migration advisory lock is gone.
- **Write handles (DB-3, RN-4).** `src/db/write-handles.ts`, on a `Transaction` of the API. The runner opens the block
  transaction and runs each part's `on-db-write` through `openBlockWrites(tx, plan, { height, onClosedUse })`, one
  `write(part, callback)` at a time in RN-3's order (one asked for while another runs is refused, a programming error).
  Each callback starts by setting its part's role — `SET LOCAL ROLE` to its write role (a shared item's provider: the
  item's, Q89), `RESET ROLE` for `core-chain` and `core-digest`, which write as the login — so it never runs under the
  role the callback before it left; after a callback that returned, `RESET ROLE` returns the block to the login, also
  undoing a role the callback selected itself. `on-start-db` runs through `runOnStartDb` in a transaction of its own
  the same way (the migration runner calls it). A handle offers exactly `height`, `query` and `execute` (CORE-ARCH
  §4.10): not the transaction, not the migrations' script path, never the migration mark (so `TRUNCATE` stays refused,
  A73). `height` is what the runner gives: the cursor before the block (h − 1, null for the first block), the cursor at
  startup. When its callback returns or throws, the handle closes: every later `query` or `execute` — from a stored
  reference or a timer, during the block or after it — fails at once with `handle-closed` (`details: { handle:
  "block-write" | "schema-write", module, point }`) before anything is sent, so never under the role of the part that
  runs now, and on PGlite without waiting in the queue; each such use is also passed to `onClosedUse`, so the runner
  halts with `callback-error` whether or not the module's own code caught it (DB-3, RN-8, A10). A statement a callback
  sent and did not await still runs under its role: both backends send a transaction's statements in order.
- **Identifier lengths (DB-8).** Ids and item names are at most 40 bytes, so `umbradb_m_<schema>` and
  `umbradb_i_<item>` stay within PostgreSQL's 63-byte identifiers; shadow tables are named by hash (below).
- **Writer lock (DB-11).** PostgreSQL: `pg_try_advisory_lock(3, hashtext('umbradb-writer'))` on the writer connection
  (classes 1 and 2 were 0.9.5's, `src/postgres/transaction-lease.ts:192-195`), taken whenever the writer opens a
  session, before that session's first transaction: the first time when the writer starts (`startWriter`, the first
  step of startup) or before its first transaction, so before any migration; another holder is then
  `writer-lock-held`, and nothing was written. A lost writer session loses the lock; the next session takes it again
  before the next write, and finding it taken is `writer-lock-lost`, after which that process never writes the
  database again (the runner halts). Advisory locks belong to one database, so two databases on one server each have
  their own. `src/db/writer-lock.ts`, applied by `src/db/postgres.ts`. PGlite in Node.js — which lets two
  processes open one data directory (probe, PGlite 0.5.10, 2026-10-22) — takes an operating-system lock, fail-stop
  (Q50): before opening PGlite, the process opens `<data directory>.lock.sqlite` with `node:sqlite` (`DatabaseSync`),
  sets `busy_timeout` to 100 ms, runs `BEGIN EXCLUSIVE` and keeps that transaction open, never committing, until it
  exits. SQLite's file locks are operating-system locks: a second process gets `database is locked` after at most the
  busy timeout and refuses with `writer-lock-held`; the operating system releases the lock when the holder ends, and
  never while it lives. The busy timeout is not 0 (Q92): with 0, processes started at one instant can all fail, since
  `BEGIN EXCLUSIVE` needs every other SHARED lock gone and a racing starter holds one for an instant (4 of 30 rounds of
  ten processes ended with no holder, 2026-10-24); SQLite's busy handler drops a waiting starter's SHARED lock, so with
  any timeout above 0 exactly one took the lock in every round. The data directory's path is resolved and its
  symbolic links followed, so every spelling of one directory shares one lock file; the lock is held for the process's
  life, and the same process may open the directory again once it closed it (one opening at a time). `memory://` takes
  no lock: each in-memory database is its own. Verified in Node.js v24.9.0 (2026-10-22, and A17's tests, 2026-10-24): a
  second process was refused while the holder ran and while it was stopped with `SIGSTOP`; after `SIGKILL` a new
  process took the lock at once. `node:sqlite` still prints an experimental warning in Node.js 24; it is a built-in
  module, loaded only when a directory is locked, for this development-only backend. Local file systems only.
  `src/db/pglite-lock.ts`, applied by `openPglite`. Browser: a Web Locks lock named after the database (BR-1), which the
  browser releases when the worker ends.
- **Durability probe.** Moved unchanged in behaviour (`fsync` :72-84, `full_page_writes` with the override :61-66 and
  :86, pooler detection :16 of `src/postgres/durability-probe.ts`) to `src/db/durability-probe.ts`; the override is
  `fullPageWritesOffAllowed`. It runs on the writer's session when the writer starts, right after the writer lock and
  before any write; each refusal is an `UmbraError` with its §11 code (`durability-fsync-off`,
  `durability-full-page-writes-off` — both settings off refuse with the first, naming both —, `durability-pooler`), and
  `synchronous_commit=off` is a warning `startWriter` returns. A refused writer ends its session, so it holds no lock.
  PGlite refuses without the development opt-in (`development-opt-in-required`) before anything is opened or created.
  0.9.5's file stays for 0.9.5's `runMigrations` until task 17.2.
- **Change capture for digests (DT-4, DT-5; Q84, Q86).** On every module table not declared `deterministic: false`, a
  row-level `AFTER INSERT OR UPDATE OR DELETE` trigger copies, on the first touch of a primary key in the transaction,
  the old row (or a tombstone) into `core_digest_shadow.t_<first 32 hex digits of SHA-256(schema.table)>`;
  `core-digest`, last in `on-db-write`, reads each shadow row and the current row, computes each table's net changes,
  updates that table's row of `core_digest.tables`, at h mod 14,400 = 0 copies every table's row into
  `core_digest.checkpoints`, and deletes the shadow rows, inside the block transaction. The digest tables stay small:
  one row per table, plus one row per table every 14,400 heights (about 365 a year). A row of `core_digest.tables` is
  updated in place, so PostgreSQL's MVCC leaves dead tuples that autovacuum reclaims (an `UPDATE` that touches no
  indexed column can be a heap-only update when its page has room). The cost of the triggers on ingest is measured by
  A136.
- **Errors.** `UmbraError { code, retryable, details }`, keeping the 0.9.5 retryable split
  (`design/design-interfaces.md` §1.1); a lost connection is `connection-lost` (retryable); an API read ended by its
  timeout is `query-timeout` (not retryable, DB-15).
- **Session settings (Q65) and timeouts (Q71).** Every connection starts with `bytea_output = hex`, `DateStyle = 'ISO,
  MDY'`, `IntervalStyle = postgres`, `TimeZone = UTC` and `extra_float_digits = 1` (PostgreSQL: startup parameters;
  PGlite: start parameters), which take precedence over the server's, the database's and the role's defaults; a
  `database` URL setting one is refused (`invalid-configuration`). Every connection also starts with
  `statement_timeout = 0`, `lock_timeout = 0`, `idle_in_transaction_session_timeout = 0` and `transaction_timeout = 0`
  (PostgreSQL 17 and later), so the writer, migrations and callback reads are never cut off; a read for a module API
  request sets `statement_timeout` and `idle_in_transaction_session_timeout` to `apiReadTimeoutMs` with `SET LOCAL`, so
  they end with that read (DB-15). `statement_timeout` cancels the statement and leaves the session usable;
  `idle_in_transaction_session_timeout` ends the session, so the pool drops that connection and opens a new one. PGlite
  enforces neither (checked on 0.5.10, 2026-10-24: `pg_sleep(3)` ran 3 s under a 1 s `statement_timeout`, and with an
  `idle_in_transaction_session_timeout` above 0 the next statement hung; `electric-sql/pglite#1058`), so on PGlite API
  reads set neither and are not bounded — PGlite is a development backend (DB-12) — and the pinned zeros keep a
  configuration file's timeout from hanging it.
- **Date and time values (Q68, Q74).** PostgreSQL prints a `timestamptz` under the pinned settings as
  `2025-05-21 14:30:00.123456+00`; the mapping (`src/deterministic-postgresql/mapping.ts`) rewrites it to
  `2025-05-21T14:30:00.123456Z` (a `timestamp`'s text the same way, without `Z`; a `date` unchanged; `infinity` and
  `-infinity` as those words), never through a JavaScript `Date`, whose parse of a zone-less text follows the process's
  time zone and keeps milliseconds only (checked on Node.js v24.9.0, 2026-10-23). It reads that form only: a year
  outside 0001–9999, a BC date, or an offset other than `+00` (a session that changed `TimeZone`) is output it cannot
  read, refused with `unreadable-result` (Q81). `timestamptz` is the preferred time type: the module guide
  (`docs/module-guide.md`) says so, and every time UmbraDB itself represents uses it and its `Z` form (Q68). Every
  module table may store it, as a value and a key (Q74): DT-1 encodes it as the integer microseconds since
  `1970-01-01T00:00:00Z`, computed in `bigint` (`src/determinism/cbor.ts`), and DT-2 orders it by time, which is the
  order of those integers; `bigint` stays allowed, a time in `text` is allowed but not good practice, floats stay
  refused, `jsonb` keeps its rules, and `timestamp`, `date`, `time`, `timetz` and `interval` stay refused with "use
  `timestamptz`, written with `Z`" (the column-type table below).

**Column types (Q58).** Every refusal names the module, the table, the column and its declared type, then the reason and
the alternative of its row. A table without a primary key is refused with `no-primary-key`: rows are hashed and digested
in primary-key order (DT-2), and without a key there is no order every database agrees on; add a primary key of the key
types below. An identity or `serial` column is refused with `non-deterministic-column`: a sequence never rolls back, so
its next value depends on rolled-back and retried blocks, not only on the chain; derive keys from the block (height,
transaction index). A default that is not immutable is refused with `non-deterministic-column`: it calls a function
PostgreSQL marks stable or volatile (`now()`, `random()`, `gen_random_uuid()`) or uses an SQL value function
(`CURRENT_TIMESTAMP`, `CURRENT_USER`), so each machine, or each retry, gets a different value; compute the value from
the block in `on-db-write`. An immutable default (`'abc'`, `1 + 2`, `lower('X')`) and a stored generated column, which
PostgreSQL requires to be immutable, are allowed. A module schema holding a sequence is refused with
`non-deterministic-table` (Q61): module code can draw from a sequence at any time, and its values depend on retries;
derive values from the block (height, transaction index), and drop the sequence (Q64). A module schema holding an
unlogged table is refused with `non-deterministic-table` (Q61): PostgreSQL empties an unlogged table after a crash,
while the cursor still records its blocks as committed; make the table logged: create it without `UNLOGGED`, or run
`ALTER TABLE ... SET LOGGED` (Q64). The contents hash refuses all of these too, with the same codes and messages, in every
schema it hashes (Q61, Q75). Detection, checked on PostgreSQL 17.11 and 18.6 and PGlite 0.5.10: `pg_attribute.attidentity`; a default's
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
| `timestamptz` | integer microseconds since `1970-01-01T00:00:00Z`; `infinity` and `-infinity` fail | yes, by time | — (the preferred time type: write every time with an offset, `Z`; Q74) |
| `jsonb` | CBOR, map keys sorted; the `CHECK` on numbers | no | As a key: PostgreSQL's `jsonb` order (by kind, then size, then contents) is not the order of the encoded bytes; use a `text` or `bytea` key |
| arrays of the value types above | array | no | As a key: PostgreSQL compares arrays element by element, while the encoding puts the length first; use a composite key |
| `real`, `double precision` | refused (`non-deterministic-column`) | refused | Approximate: a value computed two ways can differ in its last bits (Q60: in `double precision`, `0.1 + 0.2` is `0.30000000000000004`, not `0.3`; in `real`, `0.1 + 0.6` is `0.70000005`, not `0.7`); use integers in fixed units (`bigint`, `numeric(p)`) |
| `timestamp`, `date`, `time`, `timetz`, `interval` | refused | refused | Per type (Q59, Q74): `timestamp` — it holds no time zone, so one value is a different instant in each time zone (`2025-05-21 14:30:00` is `14:30Z` in UTC and `18:30Z` in New York); `date` — it holds no time zone, so a day starts and ends at a different instant in each time zone; `time` and `timetz` — a time of day is not an instant, and no canonical encoding is defined for it; `interval` — PostgreSQL holds its months, days and microseconds apart but compares them as if a month were 30 days and a day 24 hours, so equal intervals print differently (`1 day` and `24:00:00`), and no canonical encoding is defined for it. Use `timestamptz`, written with `Z`; for a time of day or a length of time, `bigint` microseconds |
| `json` | refused | refused | PostgreSQL keeps `json`'s input text (spaces, key order, duplicate keys), but the drivers parse it, so different stored texts read back equal; use `jsonb` |
| `char(n)` | refused | refused | Stored padded with spaces, compared ignoring them and cast to `text` without them, so its value depends on how it is read; use `text` or `varchar(n)` |
| `money` | refused | refused | Its text depends on the `lc_monetary` setting; use `bigint` smallest units |
| enums, domains, composite types | refused | refused | User-defined: their labels, base type or fields live in the catalog, not in the row, and no rule here covers them; use the base type (`text` with a `CHECK` for an enum or a domain, separate columns for a composite) |
| any other type (network, bit-string, XML, geometric, range, full-text, …) | refused | refused | No canonical encoding is defined; the supported types are those above |

The reasons for the time types, `json`, `char(n)` and `numeric(p,s)` were checked on PGlite 0.5.10 and PostgreSQL 17.11
(2026-10-23, the decision record's Q58), the date and time ones again after Q74 (2026-10-24, task 2.2b), and all of them
on PostgreSQL 18.6 by the suites that rely on them (2026-10-24, task 0.4, Q82).

**The `deterministic_postgresql` component (Q69).** Every rule UmbraDB imposes on PostgreSQL, so that two databases fed
the same chain hold, hash and read back the same values, is one component, `deterministic_postgresql`, in
`src/deterministic-postgresql/`. It imports nothing else of `src/`, so it is tested alone: its suite,
`test/deterministic-postgresql/`, runs every rule on PostgreSQL 18 and on PGlite, under its own coverage floor (§13).
`src/db/` and `src/determinism/` take every rule from it and repeat none. The requirements keep their ids; the component
is where they are implemented and tested together:

| Rule | Requirement | Decided in |
|---|---|---|
| Column types allowed as values and as keys, each refusal with its reason and alternative (the column-type table above) | DT-1, DT-2, DT-6 | Q57–Q60 |
| Text keys ordered by bytes (`COLLATE "C"`) | DT-2 | Q58 |
| Identity, `serial` and non-immutable defaults refused, detected from `pg_attrdef.adbin` as above | DT-6 | Q61–Q63 |
| Sequences and unlogged tables in module schemas refused | DT-6 | Q61, Q64 |
| `core_chain.jsonb_numbers_ok` and `core_chain.numeric_ok` and the `CHECK`s they back | DT-1, DT-6 | Q57 |
| Block transactions change rows only; the `BEFORE TRUNCATE` trigger | DB-14 | Q46, Q76, Q84 |
| The pinned session settings, and the zero timeouts (`statement_timeout`, `lock_timeout`, `idle_in_transaction_session_timeout`, `transaction_timeout`) of the writer and callback reads | DB-2, DB-15 | Q65, Q71 |
| The result mapping and parameter texts: lossless `jsonb`, arrays element by element, date and time as RFC 3339 text, other types as their text | DB-2 | Q66, Q68 |
| The opt-out: a `table` item declared `deterministic: false` — its tables, the sequences their columns own and its unlogged tables are skipped by the refusals and the `CHECK`s; the contents hash records each such table as `[schema, table, null, null]`; digests skip it; backups carry its rows and its sequences' positions | MD-1, DT-3, DT-4, DT-6, BK-2 | Q76 |

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

The declaration is CORE-ARCH §4.10's `ModuleDeclaration`, plus `requiresResync?: boolean` (DB-10); `ProcessContext` also
has `publish(item, value)` for `process` items (MD-7). The `db` item is a `ReadOnlyDatabase` — `read(body)` only:
modules write only through the handles of RN-4 and may read through `db` for work outside the points; the module guide
gives the rules, and nothing else enforces them (Q73, Q46). A `table` item may declare `deterministic: false` for data
that is not a function of the chain, such as the time a request arrived (Q76; §4's component table says what it skips);
the module guide says no deterministic table may be computed from such a table. Ids and item names match
`^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, so the schema name (`-` → `_`) is one-to-one (DB-8). `defineModule(declaration)`
returns it with a typed `entry({ start, stop?, config })` builder (CF-2). Graph resolution computes the boundary heights
of every revision, resolves providers per range (MD-3), and produces per range and per point an ordered callback list,
cached for the process; a revision boundary switches lists between heights, never within one.

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
- **Keys.** Configured test keys are the only key source in this change; a key API is not core and is left to a later
  module that feeds the registry (Q70). Pending keys live in memory until their block's `on-compute` takes them (PP-8).

## 9. Backups and browser

### 9.1 Backups (BK; Q83, Q85)

UmbraDB's own snapshot file is gone: a backup is a `pg_dump` file, and checking that databases agree is the contents
hash's and the digests' job (DT-3 to DT-5). **Backup.** On PostgreSQL the command opens a `REPEATABLE READ READ ONLY`
transaction on a read connection, reads the cursor and the chain identity, computes the contents hash, calls
`pg_export_snapshot()`, and runs the PostgreSQL 18 client's `pg_dump --snapshot=<id> --inserts --no-owner
--no-privileges`, so the dump and the manifest see one committed height; it writes the manifest line, then the dump.
`pg_dump` is looked up on `PATH` (or `UMBRADB_PG_DUMP`) when the command runs; a missing tool or a major version other
than 18 fails with `backup-tools-missing`. On PGlite the whole backup is one queued job that calls `pgDump` of
`@electric-sql/pglite-tools` — an optional peer dependency the command imports only when it runs (an install hint
without it), and that the browser build bundles; its `DEALLOCATE ALL` runs inside the job. Any committed height is a
block boundary (RN-6), so every dump holds whole blocks. **Restore.** The command reads the manifest line, makes the
checks of BK-3 that need no tables, then opens one transaction on the writer connection and runs the file's SQL itself
(no `psql`; statements a tool writes for `psql` alone are handled as `psql` would), creates the module roles the server
lacks and applies DB-6's and DB-7's owners and grants, recomputes the contents hash, checks the state root, and commits
only if all hold; on PGlite the same runs as one queued job. A crash mid-restore leaves nothing, since nothing commits
before the end. A restore runs the file's SQL with the writer's rights, so the operator guide says to restore only
trusted backups.

### 9.2 Browser build (BR)

`browser/` holds a static page and three worker entry points (core, ledger, private), bundled with `esbuild` (a new
development dependency, pinned in task 0.1); PGlite runs in the core and private workers with `memory://` or
`opfs-ahp://` storage (memory by default, OPFS optional; verified by probe, §14); the admin endpoints are message calls
answered by the same backbone parts; the page offers backup and restore of its database (BK-5). `npm run build:browser`
writes `dist-browser/`, which is not part of the npm package.

## 10. Tables

Every column is `NOT NULL` unless marked null; a one-row table has the key `id smallint` with `CHECK (id = 1)`;
per-block tables are append-only and partitioned by height range; no table stores wall-clock time; hashes and keys are
`bytea`; heights and indexes are `bigint`; amounts wider than 64 bits are `numeric`; nothing is a float.

| Owner | Table | Primary key | Other columns |
|---|---|---|---|
| `core-chain` | `core_chain.identity` | id = 1 | genesis_hash, start_height, anchor_hash (null until block S commits) |
| `core-chain` | `core_chain.config` | (entry_id, start) | stop (null; always null for `core`), version (text), data (jsonb, canonical), data_hash |
| database API | `core_chain.migrations` | (module, migration_id) | checksum (SHA-256 of the UTF-8 SQL), position (int, from 1; unique per module) |
| `core-block-commit` | `core_block_commit.blocks` | height | hash, parent_hash, spec_version (int), ledger_version (text), block_time (`timestamptz`, converted exactly from the node's milliseconds, Q74) |
| `core-block-commit` | `core_block_commit.hashes` (not partitioned) | hash | height — makes a repeated hash fail, which the height-partitioned `blocks` table cannot enforce |
| `core-digest` | `core_digest.tables` | (schema, table) | height, digest (DT-5) |
| `core-digest` | `core_digest.checkpoints` | (height, schema, table) | digest — at every height h with h mod 14,400 = 0 |
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
`durability-pooler`, `durability-full-page-writes-off`. **Backup and restore refuse** (the command exits non-zero;
nothing is written or committed): `backup-tools-missing`, `private-backup-refused`, `backup-format-unknown`,
`restore-target-not-empty`, `backup-history-mismatch`, `backup-build-mismatch`, `backup-genesis-mismatch`,
`backup-block-not-finalized`, `contents-hash-mismatch`, `backup-root-mismatch`.

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

**Command:** `umbradb run [--config <file>]`, `umbradb config check <file>`, `umbradb backup --out <file>`,
`umbradb restore <file>`.

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
| Test files | TemporalKV, CheckpointStore, Lease, `saveAndAdvance`, WalletStateEnvelope and cross-part durability tests; `no-consumer-import-in-bench`; `chain-archive-{migrate,rollover,store}` tests (replaced by the core block table tests); `chain-archive-{sync,sync-retry,replay-decode,preprod-cloud-crossval}` integration tests (they drive the official-indexer client, deleted by rule b); `api-surface/chain-archive-routing`; `no-chain-sync-import-guard` (the folder is gone) | `durability-probe.test.ts` (as `test/db/durability-probe.test.ts`); `migrate` (as `test/db/migrate.test.ts`), `client`, `errors` and `chain-archive-sync/node-rpc-client.test.ts` refactored onto `src/db/` and `src/node/`; `migration-lock-timeout` retired with the migration advisory lock (§4: the writer lock keeps a second instance from waiting or migrating, A17, and the zero timeouts keep a migration from being cut off, A141); `watermarks.property.test.ts` (P9) retargeted; `no-sdk-import-guard`; gate machinery | One test file per acceptance group |
| TransactionHistory tests | — | Moved with the source to `legacy/transaction-history/`, excluded from the run (LS-3) | — |
| Coverage floors (`vitest.config.ts:47-60`) | `checkpoint-store`, `save-and-advance`, `watermarks`, `temporal-kv`, `transaction-lease` | `durability-probe` 97/92, `migrate` 90/85, `errors` 95/91 (moved paths) | `src/**` 90/85 by default; `src/determinism/**`, `src/deterministic-postgresql/**`, `src/helpers/**` and `src/ledger/sweep*` 95/90 |
| Mutation (`stryker.conf.json` `mutate`, break 65) | The five 0.9.5 adapters | Break threshold 65 | `src/modules/graph.ts`, `src/runner/order.ts`, `src/config/history.ts`, `src/determinism/cbor.ts`, `src/determinism/digest.ts`, `src/helpers/height-versioned.ts`, `src/helpers/cursor-table.ts`, `src/ledger/sweep.ts`, `src/backbone/block-fetch-queue.ts` |
| Public API pins (`test/api-surface/*`, `test/smoke/pack-install.mjs`) | The 36-symbol pins, the error-catalog and retryability tables of 0.9.5 | The deep-import block; `package-json-strict` (exports only `"."`) | A sorted-name pin of §12; the pack smoke imports §12, syncs a tape on PostgreSQL in Docker, and runs `umbradb config check` |
| Benchmarks (`bench/`, non-gating `bench-smoke.yml`) | TemporalKV, Watermarks, CheckpointStore, Lease and TransactionHistory workloads and their baseline | The non-gating job | `runner.commitEmptyBlock` per backend; the ingest comparison with the official indexer (SC-009, `bench/ingest-vs-official/`); the tape-apply baseline (A143, Q72), reported and never failing |
| Scripts | `archive:sync` | — | `build:browser`, `vendor:ledger` |
| `docs:storage` (`typedoc.json`, not run in CI) | The five 0.9.5 entry points | — | The §12 surface |
| Documents stating "36 symbols" | — | `docs/releases/v0.9.5.md` unchanged (history) | `ROADMAP.md:455` and `docs/v1-implementation-guideline.md:194` updated at close-out |

## 14. External claims and their evidence

| Claim | Evidence | Status |
|---|---|---|
| Node.js 24 loads `.ts` with type stripping | Installed v24.9.0: `process.features.typescript === "strip"` | Verified (installed) |
| JSON.parse source text access in revivers | Node.js v24.9.0: `JSON.parse("[1]", (k, v, c) => c?.source ?? v)` gives `"1"` | Verified (installed); not used since Q78 |
| Node.js 24 and 26 `JSON.parse` reads a one-escape object key as a backslash once a parse has read the key `"\\"` | Reproduced on Node.js v24.9.0 (V8 13.6.233.10), 3 runs of 3, not on v24.2.0 or v22.13.1, 2026-10-23; `nodejs/node#63785` (open; reported on 24.13.1–24.21.0 and 26.3.0–26.10.0, not on 22); V8 fix `93cd21e` (2026-09-17); backport `nodejs/node#66542` (open, 2026-10-05) | Verified (run, upstream); the reason for UmbraDB's own JSON reader (§4, Q78, `docs/issues/00007`) |
| `postgres`: `sql.reserve()` pins a connection; JSON parsed with `JSON.parse`, replaceable | `src/postgres/transaction-lease.ts:135-138, 287-301`; `node_modules/postgres/src/types.js:18-21` (3.4.9) | Verified (installed, in-repo use) |
| PostgreSQL 18 (checked on 17 before Q82, re-checked on 18.6 by task 0.4): `SET LOCAL ROLE`, `SECURITY DEFINER`, `REPEATABLE READ READ ONLY`, session advisory locks, `BEFORE TRUNCATE` triggers, `jsonpath` `.type()`/`.floor()` | https://www.postgresql.org/docs/18/ (sql-set-role, sql-createfunction, sql-set-transaction, functions-admin, sql-createtrigger, functions-json); `test/dependencies/postgresql.test.ts` on the pinned `postgres:18-alpine` (PostgreSQL 18.6), 2026-10-24: every item passed, the `pg_temp` shadowing control included | Verified (test); version-pinned documentation |
| PostgreSQL 18: a session advisory lock belongs to one database (two databases on one server each take `(3, hashtext('umbradb-writer'))`), while `pg_locks` lists every database's locks (filter by `database`); a terminated backend's advisory locks are gone once `pg_stat_activity` no longer lists it; `pg_try_advisory_xact_lock` in autocommit is released when its statement ends | https://www.postgresql.org/docs/18/explicit-locking.html#ADVISORY-LOCKS, view-pg-locks; `test/db/writer-lock.test.ts` and its negative control on the pinned `postgres:18-alpine` (PostgreSQL 18.6), 2026-10-24 (task 2.5) | Verified (test) |
| PostgreSQL 18: a `CREATEROLE` login that is not a superuser holds a role it created with `ADMIN` only (no `SET`, no `INHERIT`; `createrole_self_grant` empty), may grant it to itself `WITH INHERIT TRUE, SET TRUE`, needs `SET` for `SET ROLE` and `CREATE SCHEMA … AUTHORIZATION` and `INHERIT` (or the role itself) for `ALTER DEFAULT PRIVILEGES`, reading the role's tables and creating triggers on them; another `CREATEROLE` login cannot use or grant that role; a trigger function's `EXECUTE` is not checked when the trigger fires | https://www.postgresql.org/docs/18/runtime-config-client.html (`createrole_self_grant`: "a CREATEROLE user is always implicitly granted ADMIN OPTION on created roles"), sql-createrole, sql-alterdefaultprivileges; probe on the pinned `postgres:18-alpine` (PostgreSQL 18.6), 2026-10-24 (task 2.3); `test/db/roles-login.test.ts` | Verified (test, probe); Q90 |
| PGlite: roles, `SET LOCAL ROLE`, cross-schema writes denied, `SECURITY DEFINER` with a fixed `search_path` and `PUBLIC` revoked, PL/pgSQL row triggers, a `BEFORE TRUNCATE` trigger refusing, `jsonpath` `.type()`/`.floor()` in a `CHECK`, advisory-lock functions | Probe against `@electric-sql/pglite` 0.5.10 (published 2026-10-14) in Node.js v24.9.0, 2026-10-22: every item passed | Verified (probe); task 0.1 commits the probe as a test |
| `jsonpath` `.string()` keeps a JSON number's scale: `1.0` → `"1.0"`, `100.00` → `"100.00"`, `1e2` → `"100"` (Q57) | PostgreSQL 17.11 (`postgres:17-alpine`) and PGlite 0.5.10, 2026-10-23; PostgreSQL 18.6 (the pinned `postgres:18-alpine`), 2026-10-24, `test/dependencies/postgresql.test.ts` | Verified (run, test); task 7.1's test re-checks it |
| PGlite 0.5.10 embeds PostgreSQL 18.6; production is PostgreSQL 18 too (Q82) | `select version()` on 0.5.10; the pinned image reports PostgreSQL 18.6 too (`test/dependencies/postgresql.test.ts`) | Verified; both backends run one major version (in the tests one minor version, 18.6), and the cross-backend differentials (A55, A105, A135) guard the rest |
| The PostgreSQL image of the tests, benchmarks and pack smoke test (A148): `postgres:18-alpine@sha256:77f585114c32fbca283dc835b0596f4e52b51b4c6662d7810b2f4084f60a1873` is the official image's multi-platform index, PostgreSQL 18.6 on Alpine 3.24.2 | `docker-library/repo-info` `repos/postgres/remote/18-alpine.md` at `23406aef` (the tag's index from 2026-09-21 to 2026-10-22); pulled by digest 2026-10-24: `postgres --version` 18.6, `/etc/alpine-release` 3.24.2 | Verified (pulled); pinned in `test/postgres-image.ts`, checked by the supply-chain gate's image-pin agreement and `test/dependencies/postgres-image.test.ts` |
| PGlite does not stop two processes opening one data directory | Probe: two Node.js processes opened and wrote one directory | Verified (probe); hence the operating-system lock of §4 |
| PGlite with OPFS storage in a browser worker; Web Locks exclusion | Probe in a Chromium-based browser, 2026-10-22: PGlite 0.5.10 in a module worker with `opfs-ahp://` wrote a row, closed, reopened and read it back; a second `navigator.locks.request(…, { ifAvailable: true })` on a held lock got `null` | Verified (probe) |
| An operating-system lock from Node.js (`node:sqlite`, `BEGIN EXCLUSIVE`) | Probe in Node.js v24.9.0, 2026-10-22: second process refused while the holder ran and while it was stopped; taken at once after `SIGKILL`. Probe, 2026-10-24: with `busy_timeout` 0, 4 of 30 rounds of ten processes started at one instant ended with no holder; with 10–100 ms, exactly one holder in 50 of 50 rounds (Q92); A17's tests (`test/db/pglite-writer-processes.test.ts`) | Verified (probe, test); `node:sqlite` is marked experimental in Node.js 24 |
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
| `new Date(text)` reads a zone-less timestamp in the process's time zone and keeps milliseconds only | Node.js v24.9.0, 2026-10-23: `2025-05-21 14:30:00` reads as `14:30Z`, `18:30Z` and `05:30Z` under `TZ` `UTC`, `America/New_York` and `Asia/Tokyo`; `…:00.123456+00` as `…:00.123Z` | Verified (run); the reason for Q68's text mapping |
| PostgreSQL startup parameters take precedence over server, database and role defaults | Task 2.1, 2026-10-23, on PostgreSQL 17.11: with hostile database defaults the five pinned settings won (Q65); the same test (`test/db/results.test.ts`) on PostgreSQL 18.6, 2026-10-24 (task 0.4) | Verified (test) |
| PGlite 0.5.10 enforces `statement_timeout` and `idle_in_transaction_session_timeout` | Checked 2026-10-24 (orchestrator, and the targeted fix check): `pg_sleep(3)` completes after 3 s under `statement_timeout = 1000`; with `idle_in_transaction_session_timeout = 1000`, a statement after 2 s idle hangs (killed after 10 s), with 0 it answers; `electric-sql/pglite#1058` | Verified: it enforces neither; API reads on PGlite are not bounded (DB-15) |

## 15. Relation to the existing design documents

- `design/design.md` §2 (TemporalKV), §3 (checkpoint chunker), §4 (Watermarks) and §5 (commit/transaction layer)
  describe the parts this change retires or refactors; §5's transaction rule survives as one transaction per block
  (RN-6) and its lease as the writer lock (DB-11). Those sections stay as the record of 0.9.5; `ROADMAP.md` points here.
- `design/design-interfaces.md` §1.1 (thrown, `code`-discriminated errors with retryability) is kept; §3.1–§3.4 are
  superseded by §12 of this document.
- `Formal/STORAGE_ALGEBRA.md`: W1 is kept (cursor table); T5's interval rule is restated for heights (SH-2); the other
  laws are retired as in §13, each listed for the owner's approval.
