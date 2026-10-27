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
| `src/admin/` | The admin HTTP server (`node:http`) in its own worker thread, reading a state snapshot the runner publishes through a `SharedArrayBuffer` and messages — the heartbeat's last tick in one 64-bit slot of shared memory (`src/runner/heartbeat.ts`, one atomic store and load), `status()` encoded for JSON on the main thread (heights as decimal text, the reason a sanitized error, the settings redacted), one whole snapshot per message —, and running the endpoints of `core-health`, `core-status` and `core-config` on it; 404 for anything else; the redaction and sanitized-error helpers they share; the runner's side, which `startProcess` runs unless told `admin: false` (Q128 B; task 8.1a): the heartbeat and the publication from startup on, the listener on `listen.admin` once the process's `core` revision is chosen, before the database opens, until `stop()`, and never before: a refusal of the configuration itself ends the process with no listener (AE-1, AE-2, AE-6, Q70, Q137 B; tasks 8.1, 8.1b) |
| `src/cli/` | The `umbradb` command |
| `browser/` | The browser build: page, workers and its build script (§9.2) |
| `tools/tape/` | Tape reader and writer, tape node, recording builder, variant transforms (unexported, for tests) |
| `legacy/transaction-history/` | TransactionHistory source and tests, outside the build (LS-3): moved by task 17.1 to their repository paths below the folder — the source with its migration `004_transaction_history` (out of 0.9.5's `tier1_wallet` lineage), its tests, test doubles, live preprod tests and their fixtures, and its benchmark workload; its own TypeScript program (`npm run typecheck` runs it after the repository's) and Vitest configuration (run by hand); nothing outside the folder imports it |

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
| `on-fetch` | A block is read: in the core from the node; in a private process from the public database at a committed height | Core: none. Private: a read of public data, at the public cursor (at least h; task 14.1) | Parallel where the graph allows |
| `on-parse` | After the items it requires are published | None | Parallel where the graph allows |
| `on-rollback` | Queued blocks were dropped (IN-4, IN-6) | None | In series |
| `on-finalized` | A new finalized head (core) or public commit (private), before its heights | Read handle at the cursor | In series |
| `on-start-height` | An entry's start height, before `on-compute` | Read handle at h − 1 | In series: core, then graph order |
| `on-compute` | Before the transaction opens | Read handle at h − 1 | Parallel where the graph allows |
| `on-db-write` | Inside the block transaction | Block write handle | In series, fixed order |
| `on-after-db-write` | After the commit; no `block` items (RN-5) | Read handle at h | In series |
| `on-stop-height` | After the commit of an entry's stop height; no `block` items | Read handle at h | In series: stopping modules in reverse graph order, then the core |
| `on-key` | Private: a key became pending (until task 14.4a, Q154) | Read handle at the cursor | In series |

Parallel callbacks run in the "waves" of Kahn's algorithm restricted to the modules registered at that point: a module
goes one wave after the latest registered module on a requirement path from it, through modules that do not register
the point too, so it waits for every module it requires (transitively, through items); each wave's callbacks start in
RN-3's order and are awaited together (`Promise.allSettled`) before the next wave starts, so a module may also wait for
modules of the previous wave it does not require. The backbone parts registered at such a point run first, in series in
their fixed order (RN-3's Kahn order covers the other modules). A failing callback ends the point: no later callback in
series and nothing of the next wave runs; the wave's other callbacks are awaited, never cancelled (RN-17), and the first
failure in the point's order is reported with the point and the module (RN-8). At `on-stop-height` the core's parts run
in their fixed order after the stopping modules. Each callback is called as a method of its declaration's `points`,
with its module's process context first (`src/runner/dispatch.ts`, task 5.1). The lockstep wait (PP-6) sits between
`on-compute` and `BEGIN`. Until task 14.4a removes it (owner decision Q154: keys are a module's, not the core's), on a
private process `on-key` (task 14.4) fires for each key that becomes pending at h
after h's `on-start-height` and before its `on-compute` (`LoopInput.keys`, its `core-key-registry`'s), one key after
the other, its callbacks in series in the range's order, each with its own read at the cursor (h − 1); a height
retried from `on-compute` fires none again, one retried from `on-start-height` fires them again.

**Process items and module APIs** (task 5.2a: `src/runner/process-context.ts`, `module-api.ts`, `api-server.ts`). Each
module has one process context, the same object in its `on-start-db` and at every point. `publish` takes only an item
the module declares with the `process` lifetime, only from its own `on-start-db`, once per item for the whole process
(a second provider's publish too); any other call throws and fails the callback even when caught — `on-start-db`'s,
`on-start-api`'s, or the loop's point through the loop's misuse reports. `items` shows the published items the module
requires or provides from `on-start-api` on, empty before; once every `on-start-db` ran, an item a running module
requires that was not published refuses startup with `process-item-missing` (MD-7). `on-start-api` then runs once, in
series in the startup order, for the parts active in a range the process may run (the cursor's on): a part whose
revisions all ended below it serves no API. Its routes (`GET`/`POST`, `/` and segments, `:name` parameters, a literal
winning over a parameter) and subscription names are refused with `duplicate-api-route` when two have one method and
path (parameters' names aside) or one name, before anything listens (RN-15). Each request is one `db.read` at the
latest committed height bounded by `apiReadTimeoutMs` (DB-15), the handler inside it and its answer as the handler
wrote it but for one header, `X-Umbra-Version` (the build's `UMBRADB_VERSION`, Q131; task 5.2c): the core adds no
other header and no `extensions` and tells no GraphQL response apart (RN-16, Q104, Q105; task 5.2b), and the helpers
below are the module's to use. Bodies are
JSON (a `bigint` as decimal text, bytes as `0x` hex) unless the handler typed its text or bytes; errors are `{ error: {
code, message } }`: 400 `invalid-request`, 404 `not-found`, 405 `method-not-allowed`, 413 `request-too-large`, 500
`internal-error` (a fixed message; the error goes to the runner's log), 503 `no-committed-height`, 504
`query-timeout`. The listener is `node:http` on `listen.api` in the main thread, subscriptions on WebSocket at it on
any path (`subscribe` → `subscribed`, `next`; `unsubscribe` → `complete`; `error`); a subscriber more than 1 MiB
behind is disconnected, so a module's `emit` from `on-after-db-write` never waits. Without `listen.api` nothing
listens, and `on-start-api` and its checks still run.

**The process** (task 5.3: `src/runner/process.ts`, the loop's start and stop in `loop.ts`). `startProcess` takes the
build's declarations, the configuration (a file, CF-1, or its data) and a block source, returns a handle at once and
starts up: the declarations validated, the configuration loaded and validated, the `core` entry's operational and
secret fields taken from its latest revision of the build's version for the whole run (Q102: the database, the node —
the process's one node client is made from it, and a block source given as a function from that revision and that
client, task 10.3's `nodeSourceOf` —, `listen.api`, the timeouts, the opt-in, the core's stop), the database opened
and its writer started, the cursor, the history and the chain's identity read in one read and the history checked
(`checkHistory`), `core-chain`'s startup checks against the node through the block source
(`checkChain`, task 10.2: `genesis-mismatch` — against the configured network's genesis at every start, task 10.2a,
then on a database with a cursor against the stored one —, a wait with `waiting-for-node` while the head is below the
cursor, `cursor-hash-mismatch`; before any migration), the graph, the schema plan, the contexts with each part's
revisions (a module's from its entries with their effective stops; every backbone part's the `core` entry's, each
one's data fields with the process revision's other fields), `core-chain` bound to its context with what startup checked
and opened (`bindCoreChain`: the node client and the revision's ledger table among them), `core-block-fetch` to the
block source (`bindCoreBlockFetch`) and, when enabled, the core module `core-chain-events` too (`bindCoreChainEvents`,
task 11.1), when the graph has `core-block-parsed` or `core-ledger-state` the process's ledger worker started once and
bound to them (`bindLedgerParser`, `bindCoreLedgerState` with the source's ledger calls; task 12.3, §5.3; closed with
the node client), `startDatabase`, the seal, on a database without a cursor the bootstrap's wait while S is above
the head (`waiting-for-node`, still `starting`, IN-2), `startModuleApi`, then the loop. A refusal closes what startup
opened and rejects `started`. The loop fires
`on-start-height` between `on-parse` and `on-compute` for the core's parts at S and the modules a segment of which
(revisions continuing each other are one) starts at h, each with a read at h − 1, and `on-stop-height` after
`on-after-db-write` for the modules a segment of which ends at h, in reverse order, then the core's parts at its stop,
each with a read at h; at a restart it first re-delivers the cursor's `on-after-db-write` and `on-stop-height` (RN-11).
It ends after the core's stop (with the cursor at or above it, processing nothing) and after the height before the
upgrade boundary — the lowest start of a scheduled revision (RN-12) —, and the process enters `stopped`, ready, the
module API still answering, with `upgrade-required` (entry, needed, build) at a boundary. The state is `starting`,
then `syncing` or `following` by the lag (the head the loop last read minus the cursor) against `followingThreshold`,
`stopped`, `stopping`; ready when `following` or `stopped`, or `syncing` within a set `readinessLag` (`refused` and
`halted` below); the block source's conditions (`finality-stall`) are the process's too. SIGTERM (`terminationSignal`)
or `stop()`: `stopping`, the loop's signal aborted and the loop awaited — the height in progress, its transaction
included, finishes —, then the module API, the node client, the database and the block source closed. Log lines go
through the configuration's redaction.

**Failures** (task 5.4: `src/runner/failures.ts`, `process.ts`). A startup refusal leaves the process up in `refused`
(IN-12, AE-3), its database closed and its writer lock released — except a refusal of the configuration itself, before
the process's `core` revision is known (the build's declarations, the configuration's loading, plain data and
validation, the choice of its revision), which ends the process: every finding logged with its path
(`src/runner/configuration-refusal.ts`), no admin listener opened, `refused` with `closed` resolved, nothing left to
stop (owner decision Q137 B, task 8.1b) —; a failure of the loop leaves it up in `halted` (RN-8)
— before the `COMMIT` the loop rolled the height back, after it the height stays committed —, the module API answering
at the cursor and the database open until `stop()`. Both are not ready and carry a reason: a code of §11, the height,
the module and the point, never a message (AE-5, AE-6). The code is the failure's own where §11 lists it (an
`UmbraError`'s: a refusal's, `truncate-not-allowed`, `writer-lock-lost`, `node-requirement`, `database-error`), else
`callback-error` for a callback's failure or misuse — a failing `on-start-db` or `on-start-api` too, which name their
point and module —, `unexpected-cursor` for the loop's cursor check before the `COMMIT`, `listen-failed` for a module
API listener that cannot listen (decision record Q115), and `database-error` for anything else. The two retryable
codes never halt or refuse (IN-10): `connection-lost` raises `database-retrying`, `node-unreachable` `node-retrying`
(with the attempts and the height); after IN-10's back-off (1 s doubling up to `backoffCeilingMs`) startup runs again
from its database steps, or the same loop runs again. **A height held for the retry** (task 10.4, `loop.ts`): a
retryable failure after h's `on-parse` and before h committed keeps h — its block, the cursor before it, its `block`
items as `on-fetch` and `on-parse` left them —, and the next run first reads the cursor inside a transaction on the
writer, whose new session takes the writer lock again before anything else (DB-11), so nothing can move the cursor
after it is read; then, IN-11: after a lost `COMMIT`, the cursor at h with the block's hash means h committed — its
`on-after-db-write` and `on-stop-height` run and the loop goes on from h + 1 —; the cursor before h means h did not, and
h is processed again from `on-compute` with the kept items (the failed `on-compute`'s dropped; from `on-start-height`
when the failure came before `on-compute` began), nothing fetched or parsed again and the cursor's `on-after-db-write`
not re-delivered (a retryable failure on the way to h keeps it held); any other cursor halts with `unexpected-cursor`
at h. A failure before `on-parse` ended holds
nothing: the loop runs again from the cursor, which it re-delivers. PGlite runs in the process and has no connection to
lose, so only a node failure can hold a height there. The node client retries its own calls and connection without
limit (§3), so a finalized call never fails with `node-unreachable`: while it retries, the process shows
`node-retrying` — the most attempts it counted, the height the loop processes or waits for, null during startup — and
logs each of its retries. A condition clears once startup completes, a height commits or the loop has nothing to
process (the client's when it stops retrying); a stop ends the wait. §11's registry is `test/runner/code-registry.ts`
(A87).

**A slow block** (task 5.5: `src/runner/loop.ts`, `process.ts`; RN-17, Q71). Nothing cuts a height off, times it out or
retries it for its time; it is reported. Each run of a height has a window, from its first callback after `on-finalized`
to its `COMMIT`: from its `on-fetch`; for a height the source prepares ahead (the node source), from when the loop asks
for it if its `on-fetch` or `on-parse` runs in the queue then, else from the first that starts there — so the queue's
work for it beside the heights before it, and the node's fetch before its first callback, are not its time —; for a
held height's retry, from where it resumes, so neither the earlier attempt nor the back-off counts. Once a window has
been open longer than the process revision's `slowBlockMs` (a timer of the main thread), the process shows the
condition `slow-block` with the height, the point it is in — the last of its points that began; from the block
transaction's request on, `on-db-write`: its `BEGIN`, its callbacks, the cursor check, the `COMMIT` — and the first
module whose callback runs there, in the point's order (a callback's read waiting in PGlite's queue counts as its
module's), or null while none runs; it logs `slow block: height <h> is still processing after slowBlockMs (<ms> ms),
in <point>[ of <module>]` and publishes the snapshot at once. The condition clears when the height commits or its run
fails (a halt; a retry, whose run is a window of its own), logged (`… committed after <ms> ms`, `… stopped without
committing after <ms> ms`) and published again; it changes no readiness (AE-4). `on-finalized`, RN-11's re-delivery and
the points after the `COMMIT` (`on-after-db-write`, `on-stop-height`) are in no window as task 5.5 built it; owner
decision Q145 B times each in a window of its own, raising the same condition (RN-17 as amended; task 5.5a). A
callback that blocks the main thread stops the timer and every publication: `/status` answers from
the snapshot published before it, without a condition raised meanwhile, and `/health/live` (AE-2) is the signal of the
block; once the thread is free the condition may show until the commit. The ledger worker's step
(`LedgerHost.activity()`) is not named in the condition: the module whose callback awaits it (`core-ledger-state`,
`core-block-parsed`) is.

## 3. Block source and ingest

```ts
interface BlockRef { height: bigint; hash: Uint8Array; parentHash: Uint8Array }

interface BlockSource {
  cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null>;  // last committed block, null before S
  finalizedHead(): Promise<BlockRef>;                        // the highest height the runner may process
  waitForHead(above: bigint, signal: AbortSignal): Promise<void>;  // resolves when the head exceeds `above`
  block(height: bigint): Promise<BlockRef>;                  // the finalized block at `height`
  // A source that fetches ahead (the node source, task 10.3):
  attach?(runner: QueueRunner): () => void;                  // the runner's queue interface, for one run of the loop
  prepared?(height: bigint): Promise<{ block: BlockRef; items: BlockItems }>;  // on-fetch and on-parse already run
  conditions?(): readonly { code: "finality-stall"; tipCap: number; height: bigint }[];
  close?(): Promise<void>;
}

interface QueueRunner {                                      // given by the finalized loop (RN-1: the queue's points)
  prepare(block: BlockRef): Promise<BlockItems>;             // on-fetch, then on-parse
  bestBlock(header: BlockRef): Promise<void>;                // on-best-block
  rollback(dropped: readonly BlockRef[]): Promise<void>;     // on-rollback
  storedHash(height: bigint): Promise<Uint8Array | null>;    // the blocks table's hash at a height (IN-4)
}
```

- **`core-block-fetch`** (`src/backbone/core-block-fetch/`, task 10.3) implements it over the process's one node
  client (`NodeBlockSource`, made by `nodeSourceOf(core, { nodeClient })`, what `umbradb run` passes as `source`):
  at its first use it subscribes to the finalized and the new heads, then reads the head (`chain_getFinalizedHead`,
  `chain_getHeader`); finalized notifications only raise the head, and after a reconnect the head is read again. A
  notified header's hash is BLAKE2b-256 of its SCALE encoding (notifications carry none). IN-4's finality check: a
  finalized notification at a height whose finalized hash the source read, or at or below the cursor the database's
  (`QueueRunner.storedHash`), naming another hash fails the source with `finality-conflict`, a halt at the loop's next
  call. While the loop runs (`attach`), the **finalized prefetch** prepares the heights from the cursor + 1 to the lower
  of the cursor + `prefetchWindow` and the head the loop last read (so that head's `on-finalized` comes first), eight at
  a time: per height `chain_getBlockHash`, then the queued block of that hash, or `chain_getBlock` and `on-fetch` and
  `on-parse` through the runner; the loop takes each height prepared (`prepared`) and goes on to `on-start-height`.
  The **best-block queue** (IN-6), one change at a time: per new-heads notification above the finalized head and the
  cursor, `on-best-block`, `chain_getBlock` and `on-fetch`/`on-parse`; appended when its parent is the top (the head
  for an empty queue), else the walk over `chain_getHeader` of parents to a queued block or the head, the queued blocks
  above that ancestor dropped with one `on-rollback` (lowest first) and the branch between fetched; its calls without
  retries, any error dropping the block (IN-10); at most `tipCap` blocks, while full none queued and the condition
  `finality-stall` (the process's `status().conditions`); a block queued only while the head is within
  `prefetchWindow` of the cursor (owner decision Q129); a queued block at a height the finalized head
  names with another hash dropped with those above it. At finality a queued block with the finalized hash goes on with
  its items, unfetched (A81); one with another hash is dropped with those above (`on-rollback`) and the block fetched —
  the heights look into the queue in height order, so that is one `on-rollback`, from the lowest. Its `close` (the
  process's stop) ends its subscriptions and ends every pending wait and later call with an error. The part's
  `on-fetch` puts the four `block` items (CD-2) the bound source gives (`bindCoreBlockFetch`): for the node source
  `block-header` (height, hashes, roots, digest, the `MNSV` `spec_version`, the time from the `Timestamp::set`
  inherent, 0 for a block 0 without one), `block-body` (the extrinsics, each unsigned one's call named by the metadata),
  `runtime-metadata` (`RuntimeMetadata.forBlock`: the runtime in the parent's state, block 0's own; LG-4) and
  `ledger-version` (`selectLedgerVersion` over the `ledger-table` item, as text). The metadata is read as V14 — what
  `state_getMetadata` answers — or V15 up to its pallets. Block 0 (IN-7) takes the same path; its ledger path is
  `core-ledger-state`'s (task 12.3). The node source also gives the node's ledger state root after a block and the
  genesis state (`BlockLedgerSource`, task 12.3), with the client's retries.
  Queue-side callbacks get no database handle. The source also gives a block's raw chain events (`blockEvents`,
  `src/backbone/core-block-fetch/events.ts`, task 11.1): `System::Events` read with `state_getStorage` at the block's
  own hash, a best block's without retries, null where the state holds none (block 0); `core-chain-events` decodes them
  (CD-4). A best block the finalized head reaches while it is being prepared is queued as it is, so that its height's
  take uses it or drops it with `on-rollback` instead of fetching and parsing it again (task 11.1).
- **The chain-data core modules** (task 11.1; CD-4 to CD-6; off unless configured): `core-chain-events` (requires
  `block-header`, `runtime-metadata`) decodes at `on-fetch` the events its bound source gives with the
  `runtime-metadata` item — the runtime in the parent's state, which wrote them —, every type of the registry read
  (`scale-value.ts`); `core-block-parsed` (requires `block-body`, `runtime-metadata` for the call arguments,
  `ledger-version`, `chain-events`) places at `on-parse` the block's transactions in the order of their chain events,
  each outcome event matched to its extrinsic by its phase (`TxApplied`, `TxPartialSuccess`, `ExtrinsicFailed` under
  `ApplyExtrinsic(i)` for the regular transaction of extrinsic `i`; `MidnightSystem::SystemTransactionApplied` for a
  system transaction, its bytes the event's), block 0's in body order, refusing a block whose events do not account for
  each Midnight transaction exactly once (decision record question Q132), and has them parsed once in the process's
  ledger worker (`TransactionParser`; task 12.3: `workerParser`, the worker keeping the parse for the block's apply and
  dropping it once the block committed, `on-after-db-write`, or was dropped, `on-rollback`; Q49); `core-tx-results`
  (requires `chain-events`, `block-parsed`) reads each transaction's outcome from the event that placed it, block 0's
  `success`, and puts `tx-results` in the form `ApplyInput.outcomes` takes (task 12.1a).
- **`core-ledger-state`** (task 12.3; LG-8, LG-10, LG-11, LG-15, LG-16, IN-7; off unless configured, never mid-chain:
  `startsMidChain: false`, so the graph refuses it above 0 with `cannot-start-mid-chain`) requires `block-header`,
  `ledger-version`, `block-parsed` and `tx-results`. At `on-compute` its bound ledger worker (§5.3) applies the block on
  the state at h − 1 with the parse it kept, the block's `tx-results` as outcomes, the block's time, its parent's (read
  from `core_block_commit.blocks` at h − 1 through on-compute's read; a parent time of 0, block 0's, is the block's own,
  as the official indexer takes it) and LG-8's first-regular rule for the `MNSV` runtime (`src/ledger/replay.ts`:
  `spec_version` 22,000–22,999, 1,000,000–1,000,299, 2,000,000–2,000,999; never block 0), while it reads the node's root
  after h through its bound block source (`ledgerStateRoot`, `src/backbone/core-block-fetch/ledger-source.ts`:
  `midnight_ledgerStateRoot` at the block's hash, IN-8); block 0's genesis state is the source's `genesisState`
  (`system_properties.genesis_state`), included or not as IN-7 says by comparing its root with the node's at block 0.
  A root other than the node's throws `root-mismatch` (`UmbraError`: height, hash, both roots), a halt before the
  block's transaction, so nothing of it is stored (LG-15). It puts `ledger-state` (the state's key, root, summary and
  parameters, plain), `ledger-events`, `segment-results` and `vm-logs`; at `on-db-write` it writes the batch (nodes,
  root counts as signed changes) and the block's `states`, `segment_results` and `events` rows (§10); at
  `on-after-db-write` it tells the worker the block committed. The state before each block is released in its batch
  (the retention window, LG-12, is task 12.4's), and a worker without the state at h − 1 refuses the block (a restart's
  reload is task 12.4's), as does a block of another ledger than the state's (the conversion, LG-9, task 12.4).
- **`InMemoryBlockSource`** (exported) keeps blocks in memory, for tests and module authors, with the same cursor,
  `core-block-commit`'s blocks table (`src/runner/in-memory-source.ts`, task 5.2): a finalized head that only rises
  (`finalize`), the blocks it was given or else a default chain whose hashes link (`inMemoryBlock`: SHA-256 of
  `umbradb in-memory block <h>`, block 0's parent 32 zero bytes), and `waiting(above)`, which tells a test that a runner
  has processed everything up to `above` and waits. It holds no queue: `on-best-block` and `on-rollback` are the node
  source's (IN-6), and so is IN-4's finality check; IN-4's parent check is `core-block-commit`'s, for every source. It
  gives `core-block-fetch` its own block items (`blockItems`): runtime 2.0's `v9` blocks six seconds apart, with no
  extrinsics and empty metadata, or a block's own runtime, time and ledger from its `items` option (task 10.3).
- **The cursor (the blocks table)** is the last row of `core-block-commit`'s `core_block_commit.blocks`
  (`src/backbone/core-block-commit/`, tasks 5.2 and 10.2; §10's columns, range-partitioned by height: five
  partitions of 1,000,000 heights created by migration `001` (`src/backbone/height-partitions.ts`) and a default that
  takes every higher height. **To update in the future:** a later release adds partitions by migration before mainnet
  passes height 5,000,000, about a year after genesis — the default is correct but unpartitioned (owner decision Q119,
  `docs/issues/00023`). The part writes
  the block's row first in every block (CD-3) — from the block context and the `block` items `block-header` (spec
  version, the block's own time in milliseconds, converted to `block_time` exactly by PostgreSQL's integer interval
  input, never through a float, Q74) and `ledger-version` —, so the cursor is inside the block's transaction; then the
  hash's row in the unpartitioned `core_block_commit.hashes`, whose primary key fails a repeated hash with
  `duplicate-block-hash`; then IN-4's parent check against the block stored at h − 1 (`parent-mismatch`; the anchor S
  has none), after the duplicate so that an earlier block delivered again is named for what it is. `readCursor` reads
  the highest row through a read or the block's transaction (none before the table exists), each source's `cursor` is
  it, and the database API's committed height is its height (`cursorHeight`), so a read's height and its snapshot are
  one. (The cursor-table helper of SH-1, `cursorTable`, is another thing.) A private process's source is
  `core-private-source`'s (§8, task 14.1): its cursor is `core_private_source.cursor`, read as the source's `cursor`
  and its `committedHeight`; the loop's check before the `COMMIT` reads the source's `cursor` in the block's
  transaction, whichever it is.
- **`core-chain`** (`src/backbone/core-chain/`, task 10.2) asks the block source — the node, through `core-block-fetch`
  (task 10.3), or the in-memory source — for what IN-2 and IN-3 ask of the node: the genesis hash (block 0's), the
  finalized head (`finalizedHead`, `waitForHead`) and the finalized hash at the cursor (`block`). Its checks, in order
  (`checkChain`; task 10.2a, decision records Q117, Q120): a known network whose built-in table records no genesis hash
  is refused before the node is asked (`genesis-mismatch`, `details { network, configured: null }`); the node's genesis
  hash against the configured network's, at every start, on an empty database too (`configuredGenesisOf` of the
  process's `core` revision: the built-in table's hash, read through `builtInNetwork`, or `genesisHash` for `custom`;
  `details { network, configured, node }`); on a database with a cursor, against the stored one (`details { stored,
  node }`); the wait while the head is below the cursor; the finalized hash at the cursor, last, since the node's hash
  there is a finalized one only once its head reached the cursor. A `custom` network without `genesisHash` never reaches
  them: the configuration refuses it (CF-4, `invalid-configuration`). A private process's check is its source's, which
  compares the public database's genesis hash with its configured network's (§8; owner decision Q136 B, task 10.2b).
  Its declaration is a constant (`CORE_CHAIN`); the runner binds it to its process context with what startup checked
  and opened (`bindCoreChain`), and its `on-start-db` records the history and, before block S commits, the genesis hash
  and S, and publishes `config`, `node-client` (the process's one `NodeClient`, made from its `node` and shared with the
  block source, closed by the process at stop; task 10.3), `db` (`readOnlyDatabase`) and `ledger-table` (the `core`
  revision's table in effect, `ledgerTable`); its `on-db-write` records the anchor hash in block S's transaction.
- **The finalized loop** (`src/runner/loop.ts`, task 5.2) processes every height from cursor + 1 (S on a new database)
  to the source's finalized head, then waits (`waitForHead`) with no read or transaction open (RN-6, RN-14). Per new
  head it calls `on-finalized` once, before the head's heights, for the modules active at the first of them, each
  callback with its own read at the cursor; per height, through the dispatch in the order of the range holding it:
  `on-fetch` and `on-parse` with the block context and an item sink; `on-compute` with a read at h − 1 and a sink, each
  callback inside its own `Database.read` (on PGlite a `db.read` from inside it then fails with `nested-call`, and a
  failing statement aborts no sibling's read); one `BEGIN … COMMIT` holding every `on-db-write` through
  `openBlockWrites` (the handles' height the cursor before h) and, before the `COMMIT`, a check that the cursor is h
  with the block's hash; `on-after-db-write` with a read at h, each callback in its own read, and no `block` items. A
  block context holds the block's height, hash and parent hash, the items published before its callback started, the
  module's settings for the revision covering h (the last one starting at or before h whose stop, if any, is not below
  it) and `active(id)` from the graph's segments. Items (`src/runner/block-context.ts`): a callback's puts are buffered
  and published when it completes, dropped when it fails; only the module declaring an item with the `block` lifetime
  may put it, once per block; a refused put fails its callback even when caught, and one from a kept sink is reported. A
  failure stops the loop with a `HeightFailure` (height, point, module, whether h committed); a use of a closed write
  handle or a kept sink is a callback error the loop keeps and names — before h's `COMMIT`, once h's last point ended,
  or before the next height. `on-start-height`, `on-stop-height`, the lockstep wait, RN-11's re-delivery and the halt
  itself are tasks 5.3, 14.x and 5.4's.
- **The chain-data envelope** (`src/runner/envelope.ts`, task 5.2; RN-16): `readChainDataView(read)` is the view
  `finalized`, the read's committed height and that block's hash, read in the same read; `chainDataHeaders` writes
  `X-Umbra-View`, `X-Umbra-Height` (decimal) and `X-Umbra-Hash` (`0x`-prefixed lowercase hex, as the process transport
  writes hashes, CORE-ARCH §4.14); `withViewExtensions` adds `view`, `height` (a decimal string) and `hash` to a GraphQL
  response's `extensions`, its `data` unchanged; `answerChainData` answers a request with the module's answer and the
  headers, or, before block S commits, 503 with `{ error: { code: "no-committed-height", message } }`. They are helpers
  a module calls itself: since Q104 and Q105 the module API applies none of them to an answer (task 5.2b).
- **The node client** (`src/node/`, task 10.1) retries per IN-10; every request has a timeout; subscriptions are
  re-established after a reconnect, and the runner re-reads the finalized head instead of trusting lost notifications.
  It sends IN-8's methods only, each naming its block by hash or height (never the node's best block), and reads every
  answer into typed values: a 32-byte hash; a header (`parentHash`, `number` as a `bigint`, `stateRoot`,
  `extrinsicsRoot`, its digest items as bytes); a block's extrinsics; a runtime version; storage values and keys; the
  ledger root; `system_properties`. A malformed answer is an error, never a guess. It keeps one WebSocket from its
  first use, connected again after a back-off of 1 s doubling up to `backoffCeilingMs`, counted over the connections
  the node did not answer on, and ends a connection that answers no ping for two heartbeats (30 s each). A try of a
  call times out after 30 s by default; a call retries unless told not to (the best-block queue's calls, IN-10). A
  subscription is cancelled on the client's side only (IN-8 has no unsubscribe call; the node ends it with the
  connection), and after a reconnect it is made again and its subscriber told before its next header. Its errors are
  `UmbraError`s: `node-unreachable`, retryable — a connection that failed or was lost, a handshake refused with HTTP
  429 or a 5xx status, a timeout, the node's rate limit (`-32999`, the open connection's form of 429);
  `node-requirement`, IN-9's halt — a block the node lacks (`null`), or a state it discarded; `node-error` — any other
  error answer, handshake status or malformed answer, or a method outside IN-8. None shows the node's URL (CF-4).

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
  and the `GRANT` that fixes it (checked on PostgreSQL 18.6, 2026-10-24, §14). Module schemas and item names share one
  namespace — the items of UmbraDB's own parts `core-chain` and `core-digest` included, though their schemas are no
  plan's, so a module named `db` or `config` is refused (`schema-collision`, DB-8). `src/db/roles.ts` (`planSchemas`,
  `prepareSchemas`, `setModuleRole`). Modules are trusted code (Q46): the roles stop accidental writes into another
  module's schema; nothing more is enforced.
- **Provider functions.** `SECURITY DEFINER`, owned by the provider role, with `SET search_path = pg_catalog, <provider
  schema>, pg_temp` (`pg_temp` last, so no temporary table shadows a provider table); default privileges revoke
  `EXECUTE` from `PUBLIC`; `EXECUTE` on the routines of the schema a provider writes is granted, now and by default
  privilege, to the roles of modules that require one of its items (DB-7). No part offers one for LG-13:
  `core-ledger-state` persists contract keys in the block's own batch (§5.4, owner decision Q143 A).
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
  `numeric[]`, back a `CHECK` on every such column of a module table not declared `deterministic: false` (Q76). The
  functions are SQL functions with a standard body, created by the writer's login in the bootstrap at every startup;
  each `CHECK` is named `umbradb_integers_<column>` (the first 32 hex digits of SHA-256 of the column's name instead,
  when that name would exceed 63 bytes), added after the table's part's migrations and dropped from a table later
  declared `deterministic: false`; a `CHECK` on a partitioned table holds on its partitions
  (`src/deterministic-postgresql/checks.ts`, applied by `src/db/module-rules.ts`). DT-6's refusals run at startup
  twice per part: in each migration's own transaction, after its SQL and before its record, so a migration leaving a
  table the rules refuse rolls back unrecorded and startup refuses with the rule's code (fixed, the same build
  starts); and after the part's migrations, before its `on-start-db`, for the tables of earlier startups. A part's
  tables are those of the schema its role writes and of its own; the codes are §11's five, and the message is the
  contents hash's with the module named first.
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
  the ones before it stay, and startup refuses with `migration-failed` (or with DT-6's code for a migration leaving a
  table the rules refuse, above); then the `TRUNCATE` guard again for the tables the part added; then, at every
  startup, DT-6's check of the part's tables, their `CHECK`s and their change capture (below); then its `on-start-db`
  in a transaction of its own under its role, unmarked. When every part has run, the shadow tables of change capture
  are emptied and those no table uses dropped. No `search_path` is
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
  A136. As built (`src/db/change-capture.ts`, task 7.1): each table's trigger (`umbradb_capture_changes`, on a
  partitioned table and so cloned onto its partitions) calls a function of its own, `core_digest_shadow.f_<the same
  digits>()`, `SECURITY DEFINER` and owned by the writer's login with `search_path = pg_catalog, pg_temp`, so a module
  role writes the shadow table through it; the shadow table holds the key, the old row's columns as `c0`, `c1`, … with
  the module table's types and collations, `existed`, and the transaction's id, so only the block's own touches are read
  and a touch left by any other transaction is replaced. The function records nothing in a transaction carrying the
  migration mark: a migration's writes are no block's changes, and a migration may change the table's columns before
  the function is written again. After each part's migrations the database API writes again the shadow table,
  function and trigger of each table whose columns changed (a fingerprint in the shadow table's comment), attaches
  them to new tables, re-enables a disabled trigger and drops the trigger of a table declared `deterministic: false`;
  the parts before `core-digest` are captured once its migrations created `core_digest_shadow` (Q95). When startup
  ends, the shadow tables are emptied of what `on-start-db` callbacks wrote and those no table uses are dropped, so they
  are empty whenever no block is open; the contents hash leaves `core_digest_shadow` out (DT-3, Q101, task 7.1a), so
  a later change to the capture's layout keeps hashes comparable. A table's changes are read in DT-2's key order
  (`ONLY` for an ordinary table)
  and digested by `src/determinism/digest.ts`; `core-digest` (`src/backbone/core-digest/`, migrations only, no
  `on-start-db`) has its checkpoint interval as a build flag (`build-flags.ts`, like A11's), which only a test's own
  build changes. Every role of the plan may read `core_digest`.
- **Errors.** `UmbraError { code, retryable, details }`, keeping the 0.9.5 retryable split
  (`design/design-interfaces.md` §1.1); a lost connection is `connection-lost` (retryable); an API read ended by its
  timeout is `query-timeout` (not retryable, DB-15).
- **Session settings (Q65) and timeouts (Q71).** Every connection starts with `bytea_output = hex`, `DateStyle = 'ISO,
  MDY'`, `IntervalStyle = postgres`, `TimeZone = UTC` and `extra_float_digits = 1` (PostgreSQL: startup parameters;
  PGlite: start parameters), which take precedence over the server's, the database's and the role's defaults; a
  `database` URL setting one is refused (`invalid-configuration`). Every connection also starts with
  `statement_timeout = 0`, `lock_timeout = 0`, `idle_in_transaction_session_timeout = 0` and `transaction_timeout = 0`
  (PostgreSQL 17 and later), and `idle_session_timeout = 0` (Q93: a default for it would end the writer's
  session between blocks, and the writer lock with it), so the writer, migrations, setup and callback reads are
  never cut off; they are applied and refused in a URL the same way (`src/deterministic-postgresql/settings.ts`:
  `PINNED_SETTINGS`, `ZERO_TIMEOUTS`, and `SESSION_SETTINGS`, both, which the backends apply). A read for a module API
  request is `db.read(body, { timeoutMs: apiReadTimeoutMs })` (`ReadOptions`, a whole number of milliseconds from 1 to
  2147483647, else `invalid-configuration`; a read without it is not bounded); it sets `statement_timeout` and
  `idle_in_transaction_session_timeout` to it with `SET LOCAL` in the message of its `BEGIN`, so they end with that read
  (DB-15). `statement_timeout` cancels the statement (`57014`) and leaves the session usable;
  `idle_in_transaction_session_timeout` ends the session, so the pool drops that connection and opens a new one. A read
  either ends fails with `query-timeout` (`details: { timeoutMs, setting }`), also when its body caught the statement's
  error; only such a read reports it (a `57014` or a lost session elsewhere keeps its meaning). The idle end never
  reaches the caller as an error — `postgres` 3.4.9 drops a server error that arrives while no statement is pending, so
  the session is merely lost (checked on PostgreSQL 18.6, 2026-10-25) — so the read tells it by its own clock: once it
  has been idle in its transaction for its timeout, its next statement, and the read itself when its body settles, fail
  with `query-timeout` (`src/db/postgres.ts`, `BoundedRead`). PGlite enforces neither (checked on 0.5.10, 2026-10-24:
  `pg_sleep(3)` ran 3 s under a 1 s `statement_timeout`, and with an `idle_in_transaction_session_timeout` above 0 the
  next statement hung; `electric-sql/pglite#1058`; 2026-10-25: so do `transaction_timeout` and, outside a transaction,
  `idle_session_timeout` above 0, and the hang stops the whole process), so on PGlite API reads set neither and are not
  bounded — PGlite is a development backend (DB-12) — and the pinned zeros keep a configuration file's timeout from
  hanging it.
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
| The pinned session settings, and the zero timeouts (`statement_timeout`, `lock_timeout`, `idle_in_transaction_session_timeout`, `transaction_timeout`, `idle_session_timeout`) of the writer and callback reads | DB-2, DB-15 | Q65, Q71, Q93 |
| The result mapping and parameter texts: lossless `jsonb`, arrays element by element, date and time as RFC 3339 text, other types as their text | DB-2 | Q66, Q68 |
| The opt-out: a `table` item declared `deterministic: false` — its tables, the sequences their columns own and its unlogged tables are skipped by the refusals and the `CHECK`s; the contents hash records each such table as `[schema, table, null, null]`; digests skip it; backups carry its rows and its sequences' positions | MD-1, DT-3, DT-4, DT-6, BK-2 | Q76 |

## 5. Ledger

### 5.1 The `LedgerPackage` interface (LG-6)

```ts
interface LedgerPackage {                                  // one per ledger version, used in the ledger worker
  ledger: "v8" | "v9" | "v10";
  versionName: string;                                     // the ledger release the packages were built from
  rawPackages(): Readonly<Record<string, unknown>>;        // the loaded WASM packages, unwrapped, by package name
  parseTransaction(bytes: Uint8Array, index: number): ParsedTransaction;  // parsed once per Uint8Array (LG-7)
  nativeTransaction(bytes: Uint8Array): unknown;           // the native object that parse made, for ledger tasks
  forgetTransactions(transactions: Uint8Array[]): void;    // frees those parses' native objects now (task 12.5)
  emptyState(networkId?: string): StateHandle;             // block 0 (IN-7): the adapter's, or the given, network id
  genesisState(bytes: Uint8Array): StateHandle;            // from system_properties.genesis_state
  networkIdOf(state: StateHandle): string;                 // a state's own network id (block 0's empty state, IN-7)
  load(stateKey: Uint8Array, store: NodeStore): StateHandle;
  apply(state: StateHandle, block: ApplyInput): AppliedBlock;  // LG-8; `state` itself unchanged
  stateRoot(state: StateHandle): Uint8Array;               // compared with midnight_ledgerStateRoot (LG-15)
  stateSummary(state: StateHandle): StateSummary;          // the trees' first free indexes and roots (LG-16)
  dispose(state: StateHandle): void;                       // frees a state the worker no longer holds
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
interface ApplyInput { transactions: Uint8Array[]; outcomes?: ChainOutcome[];   // one per transaction (Q113)
  height: bigint; hash: Uint8Array; parentHash: Uint8Array;
  timestampMs: bigint; parentTimestampMs: bigint; firstRegularAtParentTime: boolean }
type ChainOutcome = "success" | "partial" | "failure";   // CD-5's events, in CD-6's words
interface AppliedBlock { state: StateHandle; output: ApplyOutput }   // the state stays in the worker
interface ApplyOutput {
  results: { outcome: "success" | "partial" | "failure"; segments: { segment: number; success: boolean }[] }[];
  events: LedgerEvent[]; logs: VmLog[]; parameters: Uint8Array;
}
interface LedgerEvent { transaction: number; kind: LedgerEventKind;   // every event but contract logs (LG-16)
  logicalSegment: number; physicalSegment: number; bytes: Uint8Array;
  nullifier: Uint8Array | null; commitment: Uint8Array | null; treeIndex: bigint | null;
  contractAddress: Uint8Array | null }
interface LogItem { version: number; eventType: LogEventType; data: Uint8Array }   // CC-3
interface VmLog extends LogItem { transaction: number; index: number; address: Uint8Array; entryPoint: Uint8Array;
  logicalSegment: number; physicalSegment: number }                   // numbered per block in emission order
interface StateSummary { zswapFirstFree: bigint; zswapRoot: Uint8Array | null;       // null: not exported (Q138)
  dustCommitmentFirstFree: bigint | null; dustCommitmentRoot: Uint8Array | null;
  dustGenerationFirstFree: bigint | null; dustGenerationRoot: Uint8Array | null }
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

As built (task 12.1, `src/ledger/`; question Q114): `apply` returns the state after the block with the plain
output, which is what crosses to the main thread; `parseTransaction` takes the transaction's index (CD-5's order,
which the bytes do not carry) and keeps the native object under that very `Uint8Array`, so `apply` and
`nativeTransaction` reuse it; an adapter is made for one network id (`loadLedgerPackage(ledger, { networkId })`, which
imports the version's vendored Node.js entry when it is first asked for). A transaction's hash is SHA-256 over the
package's serialization of it, the ledger's own definition for both kinds — taken over the bytes it was parsed from,
which are that serialization (task 12.3: serializing it again would read its nodes, at a parse, where no database read
is open; `core-block-parsed` checks each hash against the one its chain event carries). `apply` follows the official
indexer's replay (strictness without proof checks or balancing; a malformed transaction, one whose cost cannot be
computed and one the ledger fails are a `failure` that leaves the state as it was; the post-block update given the
block's fullness, zero when nothing applied). Task 12.1a (owner decision Q113 A) makes the replay the node's: the
post-block update is the node's (`postBlockUpdateExact`, §5.2: the summed cost clamped to the block limits and
normalized in the package, with no JavaScript number in between, so a block above its limits is clamped, not refused),
each system transaction's cost joins the fullness (`systemTransactionCost`), the costs add up saturating as the ledger's
do, and an extrinsic whose `outcomes` entry is `failure` is skipped as the official indexer skips it (not given to the
ledger, no cost, not the first regular transaction of LG-8's rule). Without `outcomes` every transaction is replayed and
the ledger decides; a chain block gives them (task 12.3), since the v9 node also fails an extrinsic whose cost would
take the block over its limits. `LedgerEventKind` also has `contract-deploy`, which §10's `core_ledger_state.events`
stores too (task 12.3).

As built (task 12.3): the adapter also gives a state's network id (`networkIdOf`, read from the state's own `Debug`
rendering, which names it first: the node makes block 0's empty state with the genesis state's id) and makes an empty
state of a given id (`emptyState(networkId)`), frees a state (`dispose`, wasm-bindgen's `free`), and summarizes a state
for `core_ledger_state.states` (`stateSummary`): the zswap tree's first free index (`LedgerState.zswap.firstFree`); the
zswap root and the DUST commitment and generation trees' first free indexes and roots are null, as the vendored packages
export none of them (decision record question Q138).

### 5.2 Vendored builds (LG-5)

`vendor/ledger/<version>/` holds `upstream.json` (repository URL, commit, release name = `versionName`),
`patches/*.patch` (applied in order), `build.sh` (a Docker image pinned by digest with the Rust toolchain,
`wasm-bindgen-cli` and `wasm-opt`, the tools of upstream's own WASM build), and the built package with `SHA256SUMS`;
`npm run vendor:ledger` rebuilds every version and compares. The functions `LedgerPackage` needs that the published
packages lack (`load`, `stateRoot`, `stateKey`, `flush`, `persist`, `release`, `childRefs`, `evict`, the contract keys,
v9's `decodeLogItem`, the conversion) are the patches; the v9 package also exports `serializeStateValue`, which turns a
native state value into `decodeLogItem`'s input. Both packages also export the node's end-of-block update (task
12.1a, Q113): `postBlockUpdateExact(state, tblock, fullness)`, `blockFullness(params, fullness)` (the `FixedPoint`s it
uses, each as the integer `value × 2^64`) and `systemTransactionCost(tx, params)`, following `midnight-node`
2.1.0-rc.4's `clamp_and_normalize`, `compute_overall_fullness`, `apply_post_block_update` and `apply_system_tx`.
`vendor/ledger/README.md` lists each patch and what it adds; the owner
proposes them upstream, as a few pull requests, once `midnight-ledger` is stable (Q56). v8 is `ledger-8.1.2`, the v8
ledger `midnight-node` 2.1.0-rc.4 pins (`Cargo.toml:86`). v9 is `midnight-ledger` `ledger-9.1.0.0-rc.5` (the reference
used for CORE-ARCH). The v8→v9 conversion is the crate `v8-to-v9-state-translation` at `midnight-ledger` rev
`da96e33d78ee9b7d3867b15c1037510d499cd909`, the revision the node pins (`midnight-node/Cargo.toml:115`); it was written
against v9 tag `crate-ledger-9.1.0.0-rc.3`, and the node's `[patch.crates-io]` (`Cargo.toml:459`) builds it against
the rc.5 crates, so the vendored v9 package and the conversion are both built from rc.5, as the node builds them
(task 0.2). It compiles for `wasm32-unknown-unknown` with `getrandom`'s `wasm_js` backend. CI rebuilds each vendored
package and compares the SHA-256.

As built (task 12.2, `src/ledger/identity.ts`, `releases.ts`): a package's SHA-256 in the core version (CF-2) is the
SHA-256 of its `SHA256SUMS`, which lists every file of the package with its own SHA-256, so it commits to every file;
`releases.ts` holds it as a constant (the browser build reads no file), equal to the manifest's by a test. At startup,
before any package loads, `verifyLedgerPackages` checks each version the build carries — the manifest's SHA-256, then
every file it lists — and refuses with `package-hash-mismatch` (the version, the file, `changed`, `missing` or
`malformed`, the expected and the found SHA-256); a version whose `ledgerSources` is `released` refuses with
`invalid-configuration` (`reason: ledger-source-unavailable`), since this build carries vendored packages only (question
Q116). The CI job is task 0.2's `.github/workflows/vendored-ledger.yml`, its own workflow (Docker, up to two hours
per version and runner), outside `npm test`: a rebuild that matches `SHA256SUMS` has the recorded identity.

### 5.6 Version selection, the built-in tables and the metadata at upgrades (LG-1 to LG-4)

As built (task 12.2, `src/ledger/version-table.ts`, `networks.ts`, `networks.json`, `metadata.ts`):

- **The `MNSV` digest** is the header's one `DigestItem::Consensus(*b"MNSV", spec_version.encode())` (`0x04`, `MNSV`,
  SCALE length 4, the `u32` little-endian; `midnight-node` `pallets/version/src/lib.rs`), read as the node reads it: a
  PreRuntime or Seal item with that engine is not it. `selectLedgerVersion(table, { height, hash, digest })` halts with
  `bad-version-digest` (`missing`, `several`, `malformed`), then with `pin-mismatch` for a block that contradicts any
  pin at its height (naming what differs), then with `unknown-runtime` unless exactly one row covers the version
  (`details.rows`: 0, or 2 and more in a table no validation checked); every halt is a typed `UmbraError` the
  finalized loop turns into its halt (task 5.4). `core-block-fetch` (task 10.3) calls it per block with the
  `ledger-table` item.
- **The built-in tables** are `src/ledger/networks.json` (format `umbradb-ledger-networks`, version 1), checked when the
  module loads: per known network its `genesis` (hash and runtime at genesis, each read from the network's node, with
  the source — node, day, and the file in this repository holding the answers — or null until read), LG-3's `rows`,
  and its `boundaries` (U and F, each height, hash and `MNSV` version, read from the node, with the source); each
  boundary's F is a pin, and a boundary not read from a node is not listed. The file holds LG-3's rows for the four
  known networks and, since task 0.3, every one's genesis and boundaries read from its node (`core-chain` compares the
  node's genesis hash with the configured network's, task 10.2a).
- **The table in effect** (`ledgerTableOf(network, configured)`): a configured row maps the `spec_version`s it covers,
  the built-in rows the rest (cut around it); a configured pin replaces the built-in one at its height and adds one at
  any other; `custom` has no built-in table and must set rows. The `core` schemas check LG-1 and LG-2's rules on the
  configured table (u32 versions, bounds in order, a ledger this build carries, no version in two configured rows, one
  pin a height, each pin's version covered) and give the table in effect as the parsed `ledgerTable` (`.overwrite`), so
  the history records the table a revision ran with.
- **Metadata** (`RuntimeMetadata`): `forBlock(block)` reads the runtime version at the parent hash (block 0: its own),
  halts with `metadata-mismatch` unless its `spec_version` is the block's `MNSV` version, and returns that version's
  metadata, read once at that hash and cached under it (concurrent first reads share one call; a failed read is not
  kept); `forState(hash)` gives the runtime of a block's own state, which differs from its content's only at U.

### 5.3 The ledger worker and the node-store bridge (LG-10, LG-11)

Ledger work runs in a worker thread. The ledger reads nodes synchronously, so `NodeStore.get` in the worker posts a
request to the main thread through a `SharedArrayBuffer` and blocks with `Atomics.wait` until the main thread, which
owns the database, writes the node bytes back (batched: a miss prefetches the node's referenced keys). The main thread
never blocks on the worker; it awaits the worker's results asynchronously. Native parsed objects never leave the
worker (Q49): the main thread receives `block-parsed` as `ParsedTransaction[]` and each ledger task's plain result.

As built (task 12.3, `src/ledger/worker/`): one worker per process, started by the runner when the graph has
`core-block-parsed` or `core-ledger-state` and closed with the process (`startLedgerWorker`; `ProcessInput.ledgerWorker`
for a test package). Its engine (`engine.ts`, the same code the tests run in the main thread) loads each version's
adapter once and keeps each block's parse under the block's hash — the very arrays parsed, so the adapter's native
objects — until the block committed or was dropped, so `core-block-parsed`'s parse (`on-parse`) and
`core-ledger-state`'s apply (`on-compute`) parse each transaction once (LG-7). It holds the state committed at the
cursor and at most one pending state after it, applies a block only on the state at h − 1 (of the block's ledger, its
parent the committed block), gives the same result back for the same block while pending (a height processed again after
a lost transaction: its batch still to be written), and promotes the pending state when the block's `on-after-db-write`
says it committed. Messages are plain data both ways (`protocol.ts`); every request is answered in order. The bridge
(`node-bridge.ts`): a growable `SharedArrayBuffer` (a 16-byte header — state, length, status — and the data), the worker
writing the key, the main thread answering from the read handle the request was given (on-compute's read at h − 1) or,
for a request given none (a parse at `on-parse`: a deploy's address serializes its initial state, whose nodes a stored
state may share), from another request's read in flight, else from a read of the process's database (`useDatabase`) — or
from the read of a request that comes meanwhile: on PGlite `core-ledger-state`'s on-compute read holds the one queue
while its apply waits behind that parse —; the pending block's own nodes, which the database holds only once it
committed, the worker serves itself; a request no read reaches answers "no node" and fails naming why), the node's
referenced nodes — their keys read from its child list without the package, `src/ledger/node-refs.ts` — sent along and
served from the worker's side during the request, the memory grown to fit up to 256 MiB. The store is installed in each
package from the first block on (the package installs one only in `loadState`, so the engine loads the state it just
made, from memory, and drops that copy): a flushed node is stored to the package, whose cache may drop its bytes while
the state still uses it, and reads them again from the database (without it the package aborted at preview's block
3,772); a state's root and summary are read before the flush, as the database holds a block's nodes only once it
committed. A failing read never throws into the package (which would abort): the store answers no node and the request's
error names the read's. A step's time is not bounded (RN-17, Q71): `LedgerHost.activity()` names the step in progress —
its kind, its block's height, how long it has run since it began (a request sent behind others waits for them in the
worker). A worker that ends, throws outside a request, or whose package traps (a WebAssembly `RuntimeError`, after which
the module's memory is in no known state: the thread is ended) fails the request in progress and every later one with
one `LedgerWorkerFailure`: the module awaiting it fails, and processing halts with `callback-error` naming the module
and the point (§11). Loading a stored state through the bridge (`load`) is how a restarted process gets the state at
its cursor (task 12.4, §5.4).

### 5.4 Storage, retention and sweep (LG-11 to LG-14)

Tables in §10. Per block, `on-compute` runs the apply, the conversion when due, the root check and the sweep step's
computation; `on-db-write` writes the flushed batch, the `states` row, the retention releases and the sweep tables. The
sweep follows `gc-v1` (`storage-core/src/gc.rs:93-250`) with a node budget; its grey and mark sets are tables, its
rounds take keys in byte order, and deleted nodes are evicted from the worker's caches so later blocks insert them again
(`layout-v2` writes every created node, `storage-core/src/backend.rs:771-790`).

As built (task 12.4, `src/backbone/core-ledger-state/`, `src/ledger/worker/engine.ts`): **the state at h − 1.** Before
each apply after block 0, `on-compute` reads the state stored after h − 1 (`states.state_key`, `state_root`) with that
block's ledger (`core_block_commit.blocks.ledger_version`) and asks the worker to hold it (`LedgerHost.load`): a worker
that holds it — committed, or pending and committed since in the database — keeps it and reads nothing; a fresh one (a
restarted process) loads it from its key through the node-store bridge, the package checking every node against its key
(a node that does not match aborts it: the worker fails, `callback-error`); the root it gives must be the stored root,
the node's (LG-11). No restart step of its own: the first block after a restart loads the state at the cursor, once.
**The conversion** (LG-9): a v9 block on a v8 state is F; the worker converts the state with the v9 package's
`convertFromV8` (the v8 nodes read through the bridge by the v8 state's key) and applies F to the converted state, F's
batch the v9 package's; any other change of ledger is refused. **The window** (LG-12, `retention.ts`): from the `core`
entry's revisions in the `config` item, L(h) = max(L(h − 1), h − R(h)), the lowest height alive after block h; block h
releases the states of L(h − 1) to L(h) − 1, their keys read from `states` and passed to the worker, which releases them
in the block's batch beside the new state's persisted key. `ledger-state` is also a `process` item, published at
`on-start-db`: `load(height, read)` loads the state after a height between L(c) and the read's cursor c in the worker
and gives its key and root (`RetainedState`), and fails with `state-not-retained` (§11) outside. **Contract keys**
(LG-13): while `core-contract-states` (task 13.1) is active at h, the worker persists the state and zswap-state keys
(`contractStateKey`, `contractZswapStateKey`) of each contract the block's transactions call or deploy, in byte order,
in the block's batch, never to be released; the `ledger-state` item carries them (`contracts`) for that module to store
(owner decision Q143 A). As built (task 13.1): the contracts are also those the block's chain
events name maintained (`Midnight::ContractMaintain`, whose `contract_address` is the ledger's tagged serialization of
the address: a maintenance update changes the contract's state too), and at F every contract deployed below it (the
`contract-deploy` rows of `core_ledger_state.events`, read at h − 1), so that CC-1's rows at F carry the converted
keys; each once, on the state after the block.

As built (task 12.5, `src/backbone/core-ledger-state/sweep.ts`): the step is computed on the main thread in
`on-compute`, after the root check, from the tables as committed at h − 1 (read through on-compute's read: `sweep`,
`grey` and `marks` by key, `root_counts`, `nodes`' child lists, read with `src/ledger/node-refs.ts`) with the block's
batch held over them in memory, and written in `on-db-write` after the batch; only the eviction runs in the worker
(`LedgerHost.evict`, awaited in `on-compute`, before the block commits: a node forgotten and still stored is merely
written again, one deleted and not forgotten would never be). K = 10,000 (`SWEEP_BUDGET`). Step 1's roots are the
counts as committed at h − 1, before the block's batch: the state after h − 1 is still alive in the worker while h is
computed, and a package refuses to forget a node a live object holds, so that state must be marked in a cycle that
starts at h. "Stored" is the committed nodes with the block's inserts; a scan that gives fewer nodes than the budget it
had passed the last node. The first block with `sweep: off` after one with it on clears `grey`, `marks` and
`sweep_after` and makes the phase `idle`; while off, nothing else is written. The worker frees a kept parse's native
objects when it drops the parse (`forgetTransactions`), so that no object the garbage collector has not reached yet
holds a deleted node; should a later block's kept transaction still hold one, it frees every kept parse's natives and
evicts again (those transactions are parsed again at their apply), and a refusal then fails the block as task 12.5
built it; under owner decision Q144 B the worker thread is ended instead and a new one started, which loads the state at
h − 1 from the database and applies h again, a refusal on that retry failing the block (LG-14; task 12.5a).

### 5.5 Ledger tasks (LG-17, Q49)

The host program provides the ledger worker's entry: a small file that imports the same module packages as the main
thread and calls `runLedgerWorker(modules)` (exported); in the browser it is the ledger worker's bundle (§9.2). For each
block, the worker parses the transactions, runs every active module's `ledgerTasks` in the order of RN-3 — each with the
native parsed objects, `rawPackages()` and, for a task that declares `needsState`, the state before the block
(read-only) — checks that each result is
structured-cloneable plain data (a `structuredClone` round trip that preserves it), and posts `block-parsed` and the
task results to the main thread, where they become `block` items before `on-compute`. `core-ledger-state`'s apply, the
conversion and the sweep step then run in the worker as part of `on-compute`. Ledger tasks keep no state between blocks.

As built (task 13.1, before task 12.6): `core-contract-logs-fast` reads the transcripts with a function shaped as a
ledger task without `needsState` — the native transaction and `rawPackages()` in, each `log` operation's site out as
plain data (`src/backbone/core-contract-logs-fast/transcripts.ts`) —, run for now by a reader in the calling thread
(`reader.ts`'s `inThreadLogReader`: the block's ledger adapter loaded there once, each transaction that calls a contract
deserialized a second time and freed once read; none on ledger v8, Q54), as `core-block-parsed` parsed in its own
thread before task 12.3. Task 12.6 runs the same function as a ledger task in the worker, on the block's one parse.

## 6. Modules

The declaration is CORE-ARCH §4.10's `ModuleDeclaration`, plus `requiresResync?: boolean` (DB-10); `ProcessContext` also
has `publish(item, value)` for `process` items (MD-7). The `db` item is a `ReadOnlyDatabase` — `read(body, options?)`
only, the database API's `read` with its read option (DB-15) passed through unchanged (task 2.8: `src/db/read-only.ts`,
`readOnlyDatabase(db)`, a frozen object whose one property is `read`, so no property, prototype or value leads to the
`Database`; frozen because one item is shared by every module that requires it): modules write only through the handles
of RN-4 and may read through `db` for work outside the points; on PGlite a `db.read` from inside a callback's own job —
`on-db-write`, `on-start-db`, a point's read — fails at once with `nested-call` (DB-4), and on PostgreSQL it sees
committed data only; the module guide gives the rules, and nothing else enforces them (Q73, Q46). A `table` item may
declare `deterministic: false` for data that is not a function of the chain, such as the time a request arrived (Q76;
§4's component table says what it skips); the module guide says no deterministic table may be computed from such a
table. Ids and item names match `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, so the schema name (`-` → `_`) is one-to-one (DB-8).
`defineModule(declaration)` returns it with a typed `entry({ start, stop?, config })` builder (CF-2), a non-enumerable
property the validation does not see (task 4.1); its type also
refuses a callback under a name that is not a point in a declaration built first and passed later, which
`Partial<PointCallbacks>` alone accepts (A20). Declarations are validated at startup without their types
(`src/modules/validation.ts`, task 3.1), so a module written in JavaScript or built at run time is held to the same
declaration: the set has three lists — UmbraDB's backbone parts, its core modules, the host's user modules — and every
shape the type forbids is refused with `invalid-declaration`, naming the field — a public module's `keyKinds`,
`validateKey` or `needsLockstep`, a private module's own fields (PP-6; task 14.1; the two key fields leave with task
14.4a, owner decision Q154), included —; then MD-2's
causes, one rule and one code each (`bad-id` through the schema plan's own check, `reserved-prefix` for user modules
only — also for the id `core`, the `core` entry's (task 4.1) —, `duplicate-id`,
`no-requirement` except for backbone parts, `item-no-lifetime`, `table-item-no-kind`, `field-no-kind` read as
`schema.shape[field].meta().kind`, and MD-1's `unknown-point`; Q94). `src/modules/adapters.ts` turns a validated
declaration into the schema plan's module (`schemaModule`; `schemaModules` leaves out `OWN_PARTS`) and the migration
runner's part (`migrationPart`, whose `onStartDb` calls `points["on-start-db"]` with the module's process context). The
opt-out's skip is the component's, written once (`src/deterministic-postgresql/opt-out.ts`): the refusals take the
opted-out tables (`databaseRefusals(tables, relations, { optedOut })`, each relation with the table it belongs to), and
so do the `TRUNCATE` guard and task 7.1's `CHECK`s, change capture and hash. Graph resolution (`src/modules/graph.ts`,
task 3.2, `resolveGraph`) takes the validated declarations, S, every revision of every module entry with its effective
stop (task 4.3: the next revision's start − 1, or its own stop when lower), the development opt-in and the cursor
(null on a new database; Q97). Backbone parts run with the core, from S with no stop (the core's `stop` is
operational and ends processing for every part); a module is enabled when it has an entry. Heights are split at S, at
every revision's start and after every revision's stop into closed ranges `[from, to]` (`to` null for no end), as
entries are closed (RN-7): two providers are adjacent when one's last height + 1
is the other's first, and overlap when they share a height (MD-6); revisions continue each other when one's stop + 1 is
the next's start (CF-5), and after a gap the next one starts the module again. In each range it resolves the providers
and refuses, in this order, each fault naming its range (merged over consecutive ranges with the same fault), module and
item: an enabled development-only module without the opt-in (`development-opt-in-required`, `details.feature`
`development-only-module`, MD-5), two providers of one item at a common height (`providers-overlap`), a required item no
enabled module provides (`item-no-provider`) or none where its module runs (`item-not-available`), a cycle in a range or
one only the union of the ranges has (`graph-cycle`), and a start above 0 (genesis), a start at an S above 0 included
(decision record Q96), of a module that does not declare `startsMidChain: true`, or whose provider not active at the
height before the start does not (`cannot-start-mid-chain`, MD-4, Q98). Startup checks the ranges that hold a height
above the cursor (on a new database, every range from S), a range that ends at the cursor for a cycle only (RN-11
re-delivers there), the starts above the cursor and the development-only modules active at the cursor or later (Q97);
the union's cycle check covers every range, past ones included, since startup orders every part by it (Q99).
Each range's order is the backbone parts present in a fixed order — `core-chain`, `core-block-fetch`,
`core-block-commit`, `core-private-source`, `core-key-registry` (until task 14.4a, Q154), `core-digest`, the admin
parts — then Kahn's algorithm
over the active modules, the ready one with the smallest id by UTF-8 bytes first; at `on-db-write` `core-digest` moves
last (RN-3). Startup (DB-9) runs every part of the database — the backbone and every enabled module, its revisions ended
or not — in one order: the backbone, then Kahn over the union of the ranges' requirements, so `core_digest` exists
before any module migrates (Q95, RN-3). The result gives `startDatabase` its parts (`modules.map(migrationPart)`) and
the schema plan its modules (`schemaPlan(modules)`, whose namespace also holds the items of `core-chain` and
`core-digest`, DB-8), and the runner each range's `order`, `writeOrder` and `providerOf`, computed once for the process,
from the range holding the cursor on: the ranges ending below it are left out, and in the one ending at the cursor,
whose providers are not checked, `providerOf` leaves out an item several parts provide (RN-11's re-delivery reads no
`block` items); a revision boundary switches ranges between heights, never within one.

## 7. Configuration

- **Loading.** `await import(pathToFileURL(file).href)` on Node.js ≥ 24 with type stripping (v24.9.0 reports
  `process.features.typescript === "strip"`); erasable TypeScript only. `loadConfig({ file?, cwd? })`
  (`src/config/load.ts`, task 4.1) resolves the file against the working directory (default `umbradb.config.ts`; 4.4's
  `--config` gives another), imports it, takes its default export and returns `{ file, data, modules }`, `data` the
  plain-data check's frozen copy and `modules` the file's `modules` export as it gives it (CF-1, Q106 B, task 4.4a: its
  user modules' declarations, code and not data, in its order, not checked here; empty without the export). It refuses
  with `invalid-configuration` naming the file and a `reason` — `file-not-found`, `load-failed` (the error as the cause,
  its `code` as `errorCode`; Node.js's own for syntax it cannot erase), `no-default-export`, `modules-not-a-list` (a
  `modules` export that is no array) — or with `not-plain-data`. The browser build bundles its configuration and calls
  `plainData`.
- **Plain-data check.** A walk accepting plain objects (prototype `Object.prototype` or `null`), arrays (prototype
  `Array.prototype`), strings, booleans, `null` and the integers from 0 to 2^53 − 1 (−0 read as 0), reporting the first
  offending place, depth first in property order, as `not-plain-data` with `details.path` (`entries[1].config.onError`;
  a key that is not an identifier as `["feed-url"]`; `""` for the default export) and `details.found` (CF-1). Its
  rules (`PLAIN_DATA_RULES`, `src/config/plain-data.ts`): an empty array slot, a property of an array besides its
  elements, a symbol key, a non-enumerable property, a getter or setter (never called), `undefined`, a function, a
  bigint, a symbol, a non-integer, a negative integer, an integer above 2^53 − 1 (not exact: 2^53 + 1 reads as 2^53), a
  class instance, a cycle. It returns a deeply frozen copy, so later changes to the module's export reach nothing.
- **Builders** (`src/config/entries.ts`, task 4.1). `defineConfig` returns its argument; `coreEntry`, `versionEntry`
  and a module's `entry` build a new entry — the id and version theirs, every other field given passed through for
  validation, a field that is `undefined` left out — and return plain data. `coreEntry`'s version is
  `buildCoreVersion()` (`src/config/build.ts`: `UMBRADB_VERSION`, a constant held equal to `package.json`, since the
  browser cannot read the file; its `ledgers` each ledger version's release and packages, §5.2); its `config` is typed
  as CF-4's table, a public process's fields or a private one's. `defineModule` adds `entry` to the declaration as a
  non-enumerable property, typed by `z.input` of its `configSchema`. `versionEntry`'s `version` is a `CoreVersion` for
  `core`, and its `config` is typed as plain data only.
- **Schemas.** zod 4 (installed 4.4.3; Q45): a module's `configSchema` is a `z.object` whose fields carry `kind` in
  their metadata (`schema.shape[field].meta().kind`, verified on 4.4.3); the `core` entry's are `PUBLIC_CORE_SCHEMA` and
  `PRIVATE_CORE_SCHEMA` (`src/config/core-settings.ts`, task 4.2): CF-4's table with its kinds and defaults, strict at
  every depth, `genesisHash` required with `custom` and refused otherwise, hashes 32 bytes of lowercase hex,
  `apiReadTimeoutMs` from 1 to 2,147,483,647, `testKeys` secret (until task 14.4a, Q154), `ledgerTable` the table in
  effect (§5.6); the
  builders' `CoreSettings` is held equal to their input types by a type test. Only revisions whose version is this
  build's are validated against this build's schema; a `versionEntry` revision is compared with its recorded row, or —
  when it is a later version not yet recorded — recorded as written and validated by the build that carries its
  version (CF-3).
- **Validation** (`src/config/validate.ts`, task 4.2). `validateConfig({ config, declarations, side })` takes the loaded
  data, the validated declarations and the process's side, and runs rules that each report every violation they find,
  all at once (`invalid-configuration`, `details { file, reason: "invalid-entries", findings }`, each finding naming
  its path, its entry `{ index, id, start }` and its field, its message never a setting's value): the top level is
  `{ entries }`; each entry is `{ id, start, stop?, version, config }` with no other property, its id `core` or a core
  or user module (a backbone part's refused) of the process's side (`entry-side`, PP-1; task 14.1: a private process
  runs private modules only, the core public ones), `stop ≥ start`, a semver version or a core version with hex
  hashes, an object `config`, required for a revision of the build's version; `(id, start)` once; a `core` entry; no
  lone UTF-16 surrogate (the history could not hash it); and, for each revision of the build's version, no setting its
  schema lacks (a key check against `schema.shape`, since `z.object` strips unknown keys), the schema's own `safeParse`
  (its messages redacted), and settings that stay plain data; on a private process, until task 14.4a removes the rule
  (owner decision Q154), each test key of a `core` revision of the build's version (`test-keys`; task 14.4) of a kind
  some module the configuration
  enables declares in `keyKinds`, its bytes taken by the `validateKey` of every such module (anything but `true`, or a
  throw, refuses; a finding names `testKeys[i].kind` or `.bytes`, never the key or a thrown message), no key listed
  twice. It returns every revision with its parsed settings (defaults applied), kinds and data fields, and S.
  `entriesAtCursor(checked, cursor)`, once the database is open, refuses a `versionEntry` above the cursor that carries
  a `config` and one at or below it without one, and places each revision (`started`, `scheduled`) for the history's
  comparison (CF-6).
- **Redaction** (`src/config/redact.ts`, task 4.2; CF-4, AE-6). `configRedactor(checked)` knows the configuration's
  secret strings — each string of a `secret` field, the password of every URL with credentials in the other fields —
  and hides each, as written, decoded and in each encoding a text may hold (URI-component with upper- or lower-case hex,
  form, WHATWG userinfo, JSON), in any text, together with a URL's userinfo and its credential query parameters;
  `settings(values, kinds)` shows a `secret` field, or one of unknown kind, as `[redacted]`. `/config`, `/status` and
  the logs use it (tasks 5.x, 8.x).
- **Core stop.** Operational: not stored (`core_chain.config.stop` is null for `core`), changeable at any restart.
- **History** (tasks 4.3, 4.3a). `core_chain.config` (§10) is created by `core-chain`'s migration `001`
  (`src/backbone/core-chain/history.ts`, `CORE_CHAIN_MIGRATIONS`, as the login). `checkHistory`
  (`src/config/history.ts`) takes the validated configuration, the cursor (null on a new database), the build's
  declarations and the rows (`readHistory`, none before the table exists), and refuses, each with every finding of its
  kind: `missing-entry` for a recorded `(id, start)` starting at or below the cursor that the configuration omits (CF-5;
  one starting above it — any on a new database — may be omitted or moved, Q103, task 4.3a); `changes-past` for an entry
  starting at or below the cursor that is not recorded, or differs in its version, a data field or — for a module — its
  stop, unless both stops are above the cursor (no stop counts as above it) (CF-6); `upgrade-required` (entry, needed,
  build) when the revision covering cursor + 1 (S on a new database) is not the build's version (CF-8); and
  `development-opt-in-required` (`feature: "sweep-off"`) for a `core` revision with `sweep: "off"` running above the
  cursor without the opt-in (CF-9). A revision records its stop as written (null for `core`), its version (a module's
  semver, the core version's canonical JSON: RFC 8785 on plain data), its data fields — the build's version's parsed
  `data` settings, or an earlier `versionEntry`'s `config` as written — as `jsonb` and `data_hash`, SHA-256 of their
  canonical encoding (DT-1); a scheduled revision records neither. Effective stops (CF-5): a revision ends at the next
  one's start − 1, or at its own stop when that is lower (a gap; an own stop at or above the next start is superseded);
  the core's own stop bounds no revision. The runner calls `checkHistory` after reading the cursor and before
  `resolveGraph` (its `graphInputOf`: S, every module revision with its effective stop, the opt-in, the cursor) and
  `startDatabase` (its `committedVersions`, DB-10), so every refusal comes before any migration (A33); `core-chain`'s
  `on-start-db` calls `recordHistory`, which checks again with the rows its transaction reads and, in that transaction,
  deletes the check's `deletes` — the omitted rows above the cursor — and records its writes — every entry above the
  cursor that differs from its row or has none, and a module's stop changed above the cursor. `openConfiguredDatabase`
  (`src/config/database.ts`) opens what `database` names (`pglite:memory`, `pglite:<directory>`, a PostgreSQL URL),
  PGlite refusing without the opt-in (CF-9, DB-12).
- **`umbradb config check`** (`src/cli/`, task 4.4; CF-10). Three checks, every finding of each reported with its path
  in one run: the TypeScript compiler (`typescript`, a runtime dependency, 5.9.3 installed) with `noEmit` and fixed
  options, those of a Node.js ES module loaded by type stripping (`NodeNext`, `erasableSyntaxOnly`,
  `verbatimModuleSyntax`, `allowImportingTsExtensions`, `strict`, `skipLibCheck`; a `.ts` file whose nearest
  `package.json` has no `type` is read as an ES module, as Node.js detects it), each diagnostic at `file:line:column`;
  then the loader, the plain-data check, the validation and the process's `core` revision (Q102); then, with
  `--database` only, the cursor and `core_chain.config` read in one read-only read (PostgreSQL: a read connection, no
  writer lock, so beside a running process; PGlite: under the file's opt-in, the directory's lock taken, a directory
  holding no database yet checked as a new one and not created) and `entriesAtCursor` and `historyFindings` run on
  them; without it no database is opened and the report says the history checks were not run. The side comes from
  the file (`instanceId` and no `node`: private); the modules are the command's build's — UmbraDB's backbone parts of
  that side and its core modules — with the file's `modules` as its user modules (Q106 B, task 4.4a:
  `src/cli/build-modules.ts`, `buildDeclarations(loaded.modules, { side })`, validated as any host's user modules, MD-2:
  a list element that is no declaration, a module listed twice or with an id of UmbraDB's own is a finding at
  `modules[<index>]`, and the entries are then not validated); a host program calls `configCheck` with its own
  declarations, and the file's `modules` are not used. Every text is redacted (`configSecrets`, the `--database` value,
  the URL patterns). Exit 0 only if every check that ran passed, else 1.
- **`umbradb run`** (`src/cli/run.ts`, task 4.4a; LS-6, CF-1, Q106 B). Loads the file once (`--config`, or
  `umbradb.config.ts` in the working directory) and calls `startProcess` with its evaluated data, the command's build
  with the file's `modules` as user modules (validated by startup, MD-2), the side from the file — public: the node
  source (`nodeSourceOf`); private: one `privateIntake()` and its backbone —, the admin endpoints by default (Q128 B)
  and the log on stderr; a file that cannot be loaded is given to startup as the file, which refuses it as itself. The
  first SIGTERM or SIGINT stops the process (RN-13; a second one gets Node.js's default); the command exits once it
  closed — 1 when it ended `refused` or `failed`, else 0. A refusal of the configuration itself (the loader, the
  declarations with the file's modules, the validation) ends the process, which logs every finding as `config check`
  names it (`startup refused: <path>: <message> [<code>]`, `src/config/findings.ts`), redacted, and serves no admin
  endpoint: the command exits 1 at once (Q137 B, task 8.1b), adding no line of its own. Any other refused or halted
  process stays up until a signal (IN-12).

## 8. Private processes (PP)

- **Transport.** The core runs a WebSocket server (`ws`) on `listen.transport`; with `tls` set it is an `https` server
  requiring client certificates (`requestCert`, `rejectUnauthorized`; verified with `ws` 8.22.0: a client without a
  certificate is refused with `CERTIFICATE_REQUIRED`). In the browser, `postMessage` between workers; in tests, direct
  calls. One JSON object per message, validated against these schemas (zod) on both ends, and no other message: a
  private process uses this connection and its reads of public data, and nothing calls a module across it (owner
  decision Q140 C, task 14.2a — task 14.2 carried an `api` and an `api-result`, which are now unknown types):

  | Type | Fields (`H` = height, a decimal string; `X` = `0x`-prefixed lowercase hex) |
  |---|---|
  | `hello` | `v: 1`, `instance: string`, `version: string`, `height: H`, `hash: X` or `null` |
  | `hello-ack` | `v: 1`, `lockstep: boolean`, `genesis: X`, `start: H`, `cursor: H` or `null`, `refused`: `null`, `"duplicate-instance"` or `"lockstep-behind"` |
  | `committed`, `report` | `v: 1`, `height: H`, `hash: X` |
  | `read` | `v: 1`, `id: string`, `statements`: an array of `{ sql: string, params: Value[] }` |
  | `read-result` | `v: 1`, `id: string`, `height: H` or `null` (before the first commit), and either `results`: one `{ columns: { name: string, type: string }[], rows: Value[][] }` per statement, or `error: string` (a code); `type` is the PostgreSQL type name that says how to read each `Value` back |

  `Value` is `null`, a boolean, a string (text; `bigint` and `numeric` as decimal strings; `bytea` as `X`), or JSON (for
  `jsonb`); the column types of the statement say how to read each string back.

  As built (tasks 14.2, 14.2a, `src/private/`): `messages.ts` holds the six schemas (zod strict objects: a field a type
  does not have fails it; hashes 32 bytes; ids 1–128 characters; a `read-result` with both or neither of its branches
  fails; a row with another number of values than columns fails), `parseMessage` (tells `not-json`,
  `unknown-version`, `unknown-type` and `invalid-message` apart) and the wire's JSON (written with `bigint`s exact,
  read with the component's lossless reader). Values per column type (`format_type`'s name, `bigint[]` for an array):
  `bigint` and `numeric` decimal text, `bytea` `X`, `json`/`jsonb` the JSON value (an integer beyond ±(2^53 − 1)
  inside it exact), `smallint`/`integer`/`oid` and finite floats numbers, a float's `NaN` or infinity its text, dates
  and times their RFC 3339 or ISO text, the rest text, arrays as JSON arrays; read back to the value the database API
  gives. The database API keeps a result's columns on the rows it returns (`resultColumns`, a non-enumerable property
  `mapRows` sets), which is where the core finds each column's type; a type the mapping does not name is read with
  `format_type` in the same read. Parameters carry no types: the core reads a string of `0x` and lowercase hex pairs
  as bytes, every other string as text (Q141). `core-transport.ts`: the public process starts it once its database
  is open and its chain known, before the bootstrap's wait, when `listen.transport` is set (`transport listening on
  <host>:<port>`, `(mutual TLS)` with `tls`; a taken address refuses startup, `listen-failed`), and closes it at its
  stop. A connection speaks after its `hello`; a `hello` of an id another connection (or this one) holds is answered
  `refused: duplicate-instance` and closed; `committed` goes to every connection past its `hello` after each commit;
  each `read` runs in one `Database.read` bounded by `apiReadTimeoutMs`, its error a code only (`database-error` for
  anything not an `UmbraError`), a result over 64 MiB answered `error: result-too-large`; a `report` is checked and
  counted (**Lockstep** below, task 14.3). A connection closes (1008, the reason a fault's name) on a text that is no
  message (an `api` message among them: `unknown-type`), a binary frame, a message only the core sends, a message
  before `hello`, more than 64 reads (or report checks) at once, more than 128 MiB waiting in its socket (a slow reader:
  PP-5, the core never waits for it), a message over 64 MiB (`maxPayload`), a report whose hash is not the public
  block's (`report-hash-mismatch`), or no pong within 15 s. `private-transport.ts`: a private process with
  `coreTransport` connects at startup's chain check, which waits for its `hello-ack` (task 14.3: that says whether it is
  lockstep; after startup read the private cursor), `wss://` with its `tls`; its `hello` gives the private cursor or
  S − 1 before its first commit;
  a `hello-ack` that connects it wakes its wait (as does each `committed`); a lost or refused connection is retried
  after IN-10's back-off up to `backoffCeilingMs`, without end; meanwhile its wait waits, and a read fails with
  `connection-lost` (retried by the runner, `database-retrying`). A read through the core first sends a `read` with
  no statement (its height is the handle's `height`), then one `read` per `query`, each its own consistent read at
  the public cursor then, at or above the handle's height. A message from the core that is no message (an `api` among
  them), fails its schema or only a private process sends closes the connection, which is made again.
- **The private process** (task 14.1) is task 5.3's `startProcess` with `side: "private"`: the private `core` schema,
  its own database (`database`), and a backbone of `core-chain` (task 10.2's, unchanged: its configuration history, its
  identity, the process items `config`, `db` and `ledger-table`; no node client), then `src/backbone/private.ts`'s
  `core-private-source`, `core-key-registry` (until task 14.4a, owner decision Q154) and `core-digest` (the core's
  part, requiring `core-private-source`'s
  `private-cursor` where the core's requires `blocks`), in RN-3's fixed order; no `core-block-fetch` or
  `core-block-commit`. Its modules are `side: "private"` (an entry of another side's module refuses, `entry-side`), and
  their tables are checked by DT-6, digested and hashed as the core's (Q75); the states, reasons and retries of 5.4,
  and 5.2a's process contexts and module API, are the same. One `privateIntake()` per start gives the process its
  part and its block source, which share the public database: `ProcessInput.source` is the intake's `source(core)`,
  made from the process's `core` revision (Q102), which the part's `on-start-db` then reads. `core-chain`'s startup
  checks against a node (IN-3, `checkChain`) do not apply — a private process never talks to the node (PP-1) —: the
  process runs its source's own check instead (`BlockSource.checkChain`, `PrivateBlockSource.checkChain`), which, before
  any migration, reads the public database's identity and refuses `public-not-started` (Q125), then compares its
  genesis hash with the configured network's — `configuredGenesisOf` of the process's `core` revision: the built-in
  table's for a known network, `genesisHash` for `custom` — and refuses a difference with `private-binding-mismatch`,
  `details { reason: "network", network, configured, public }` (both hashes as `0x` hex; a known network whose built-in
  table records none is refused alike with `configured: null`, as Q117 refuses it on the core; owner decision Q136 B,
  task 10.2b), and gives `core-chain` the public genesis hash, recorded with the private S in the private database's
  `core_chain.identity` (and the anchor at block S); the bootstrap's wait (IN-2) waits, with `waiting-for-node`, for
  the public cursor to reach the private S. With `coreTransport` the check then waits for the transport's `hello-ack`
  (task 14.3) and compares its `genesis` with the configured network's too, refused alike (`network`, the message
  naming the core at `coreTransport`): with a PostgreSQL `publicDatabase` read directly, the core the instance reports
  to is checked nowhere else (task 10.2b's note); with a PGlite or no `publicDatabase` the identity came through that
  same core. The ack's S is not compared with the public database's (owner decision Q149 A: the operator brings a
  correct selection of the database and the core).
- **Binding** (PP-2). `core-private-source`'s `on-start-db`, before any private module migrates, reads the public
  database's identity (`core_chain.identity`: `genesis_hash`, `start_height`, task 10.2's table); on the first start it
  records them in `core_private_source.cursor`; on every start a recorded genesis hash or S that differs, or a private S
  below the public S, refuses with `private-binding-mismatch` (`details.reason` `genesis`, `start`,
  `private-start-below`), and so does a public database whose core has never started (`public-not-started`, Q125).
  These come after the source's check of the configured network, so a start against another network's public database
  is refused for its network first (`network`); the recorded genesis still refuses a database of the configured network
  bound to another public database.
- **Taking blocks** (PP-3, PP-5). `core-private-source`'s block source (`PrivateBlockSource`) runs under the finalized
  loop unchanged: its `cursor` and `committedHeight` are the private cursor's; its finalized head is the public cursor
  (`core-block-commit`'s `readCursor` in a read of the public database; before the core's first commit the height
  before the public S); its block at h is the public block at h (height, hash, parent hash of
  `core_block_commit.blocks`, which 10.2's other columns do not change); `waitForHead` reads the public cursor each
  time the process is woken, so it never depends on a message; and `fetchRead` gives each `on-fetch` callback its own
  read of the public database at its cursor, at least h (Q100). Every read of public tables is in
  `src/backbone/core-private-source/public-database.ts`. The part's `on-db-write` moves the private cursor first in each
  block. The public database is read directly on PostgreSQL (`publicDatabase`, a login that may only read: reads only,
  no writer, no lock); through `read` messages when it is PGlite, which only the core opens, or not given — task
  14.2's transport, at the `core` entry's `coreTransport` (`openPublicSide`); a private process with neither a
  PostgreSQL `publicDatabase` nor a `coreTransport` is refused (`invalid-configuration`, `public-database-transport`).
  What wakes the wait is `PublicWakes`: with `coreTransport`, the `committed` messages and every (re)connection, and
  nothing else; without one, a poll of the public cursor every second (`pollingWakes`). An independent instance lags as
  it needs: nothing makes the core wait for it (PP-5); the lockstep wait is task 14.3's.
- **Public `table` items** (PP-13, owner decision Q126 B, task 14.1a). *Where the public database says them:* the
  column `provides` of `core_chain.config` (§10), which `core-chain` writes in the row of each revision it records
  (CF-7): for a module entry, the `table` items of the build's declaration of that module — for a scheduled revision,
  whose version the build does not carry, the declaration it has, which is how the public graph judges that revision
  too; the build carrying its version rewrites the row, its data then recorded, before the revision starts (RN-12) —;
  for `core`, the `table` items of the build's backbone parts, which run with the core entry from S with no stop. At
  every start `core-chain` gives each revision above the cursor this build's items again (a row whose items differ is
  updated in the history's transaction); a revision at or below the cursor keeps the items it was recorded with, as it
  keeps its version and data (CF-6). An item is a name, the same in both processes' graphs, so a private process needs
  neither the public build nor its user modules. No database exists before task 14.1a: migration `001` of `core-chain`
  gains the column in place (`NOT NULL`). *How a private process reads them:* `PrivateBlockSource.checkChain` reads,
  in its read of the public database's identity, every row's `entry_id`, `start`, `stop` and `provides`
  (`readPublicItems`, `public-database.ts`), and gives each item the heights of its row, from its start to its last
  height by CF-5 — its own stop, or the next revision's start − 1 of the same entry, as `graphEntries` reckons it
  (`publicItemRanges`, `src/config/history.ts`) —, the provider named by the entry (`core` for the backbone's); they
  reach the graph as `ChainCheck.publicItems` and `GraphInput.publicItems`. *How the graph counts them*
  (`src/modules/graph.ts`): in each height range, a public item active at the range's first height is provided there
  for MD-3's coverage, and the ranges are split at the public items' starts and after their stops as at entries'; so
  a private module requiring a public item no public module provides is refused with `item-no-provider`, and one
  whose public providers cover only other heights with `item-not-available` (`details.publicProviders`). Only `table`
  items are recorded, so a public `block` or `process` item never counts (PP-13). A public item named like an item of
  the private backbone — `chain-identity`, `digest-tables`, `digest-checkpoints`: `core-chain` and `core-digest` run in
  both processes, each over its own database — is the private backbone's and is not counted; a private module that
  provides an item a public module provides at a common height is refused with `providers-overlap` (MD-6: one
  provider an item a height; `details.publicModules`; owner decision Q146 A). A public provider takes no
  part in the order (it runs in the core, whose committed heights the private process reads), in cycles or in MD-4 (the
  public core judged its own starts, and its `startsMidChain` is not recorded). *Order:* PP-2's comparisons with the
  recorded binding (`genesis`, `start`, `private-start-below`) run in `checkChain` too, after the configured network
  and before the graph — the startup read of the private cursor reads the binding from the same row — and again in
  `on-start-db`'s transaction, which records the binding: a private process against the wrong public database is
  refused for that, never by the graph reading the wrong database's items. *Reading:* a private module reads a public
  table through its `on-fetch` read of public data (Q100); requiring the item is what makes its startup check that the
  public core writes the table at every height the module runs. The items are read at the private process's startup
  only; a private process halts when the public configuration changes under it (PP-14, owner decision Q147, task 14.1b).
- **Mutual TLS** (PP-11, Q34, task 14.2). `tls` is PEM text: `certificate` and `key` the process's own, `trustedRoots`
  the CAs it trusts. On the core the transport is then an `https` server with `requestCert` and `rejectUnauthorized`
  against `trustedRoots`; a private process presents its certificate and checks the core's against its
  `trustedRoots`. Without `tls` the transport is plain WebSocket, unauthenticated.
- **Lockstep** (PP-6, PP-7, owner decisions Q5, Q24, Q142; task 14.3). *The core's bookkeeping*
  (`src/private/lockstep.ts`, `Lockstep`): a public process whose `core` revision lists `lockstepInstances` keeps one
  for its run; per listed instance, whether a connection past its `hello` holds its id, its committed height last
  learned — the `hello`'s (also below the one known: its database replaced), then each counted `report`'s, which only
  raises it — and whether the core refused it (`lockstep-behind`, `report-hash-mismatch`). A listed instance holds
  height h while it is not connected (one not seen since the core started included: the core cannot know its height,
  and waits, Q24), refused, or below h − 1. *The wait* (`src/runner/loop.ts`, `LoopInput.lockstep`): for each height
  h, after h's `on-compute` and before its block transaction, every read of h ended — no transaction is open, and on
  PGlite the one queue is free, so the instances' reads through the core are served —, the loop awaits the
  bookkeeping until no listed instance holds h; meanwhile the process raises `waiting-for-lockstep` (`height`, and
  each instance holding it with `connected`, `height`, `refused`; `/status` shows it) and logs the instances that hold
  it because they are down or refused, not one that is processing h − 1. A stop ends the wait, h not committed (its
  transaction never began, RN-13). With no `listen.transport` no listed instance can connect, and the core waits. *The
  transport*: a listed instance's `hello` below the public cursor − 1 is answered `refused: lockstep-behind` (PP-7),
  its connection kept — it holds its id and is answered, the core keeps waiting for it and names it, and the instance
  halts by its own check —; a `report` counts once its hash is the public block's at its height (one `Database.read`
  of `core_block_commit.blocks`, bounded as a read); another hash, or no public block there, closes the connection
  (1008, `report-hash-mismatch`), the instance refused until its next `hello`; a report the core cannot check closes
  it 1011 (`report-unchecked`), and the instance connects again. A core restarted while an instance is at the public
  cursor learns its height from its `hello`, so nothing deadlocks. *The private side*
  (`src/backbone/core-private-source/`, `src/private/private-transport.ts`): the instance is lockstep when its
  startup's `hello-ack` said so — kept for the run, so a module needing it never runs unchecked — or a later one does;
  after the graph is resolved and before any migration, a module declaring `needsLockstep` refuses to start on an
  instance that is not lockstep or has no `coreTransport` (`needs-lockstep-not-listed`, `details { modules, transport
  }`; `BlockSource.checkModules`). A lockstep instance takes height h only while the public cursor is h: its block at
  h is read where the read's height is h, and each `on-fetch` read of public data (`BlockSource.fetchRead`, now given
  the height) begins at h and, after the callback, reads the public cursor again — through the core each statement is
  its own read (Q142) —; a cursor past h either time halts it with `lockstep-behind` (`details { height, cursor
  }`). Each block `core-private-source`'s `on-after-db-write` sees committed is sent as `report` while connected to a
  core that lists the instance and has not refused it; the core's close for `report-hash-mismatch` refuses the
  transport for good (no reconnection), and its waits and reads fail with that `UmbraError`, which halts the
  instance.
- **Keys.** None in the core: keys, and private items in general, are a module's (owner decision Q154 A2; FEATURES
  records `user-secrets` as a feature module, specified later). Task 14.4a removes what task 14.4 built, described here
  until then.
  As built (task 14.4, `src/backbone/core-key-registry/`): the private `core` entry's `testKeys` (a secret field, so
  every revision of the backbone part has the process revision's list, Q102) are checked by the configuration's rule
  `test-keys` (§7: kind declared, `validateKey`, no key twice: `invalid-configuration`, before the database opens);
  `core-key-registry`'s `on-start-db` — before any private module migrates — reads each key's row of
  `core_key_registry.keys` (`key_id` = SHA-256(UTF-8 kind ‖ bytes)) and refuses `test-key-conflict` for a key admitted
  with another start (`details.reason` `start-changed`) or one not admitted whose start is at or below the private
  cursor, S − 1 before the first block (`start-passed`); it keeps the keys not admitted for the run, by start. A key
  whose start is h becomes pending as h is processed: the loop fires `on-key` before h's `on-compute` (§2); the part's
  `on-compute` puts them as `admitted-keys` with `arrived_height` h (none at other heights) and its `on-db-write` writes
  them, an id already admitted left unchanged (`ON CONFLICT DO NOTHING`). A height that does not commit and is processed
  again takes them again; a halt, stop or crash drops the run, and the next startup finds them not admitted and makes
  them pending again at h. A restart with an admitted key keeps its height and fires no `on-key`; a key removed from
  the list stays admitted.
- **Private instances in `/status`** (PP-9, AE-5; task 14.4, `src/private/instances.ts`): on the core,
  `privateInstances` lists every instance its `core` revision lists in `lockstepInstances` (from the lockstep
  bookkeeping: connected or not, its height as the core learned it from `hello` and checked `report`s, null when not
  seen since the core started) and every other connected one (from the transport, as not lockstep, at its `hello`'s
  height: an independent instance sends no `report`, owner decision Q151 A), each with exactly `id`, `connected`,
  `lockstep` and `height`; null on a private process and before startup opened the database. On a private process,
  `public.lockstep` is whether it is lockstep (its startup's `hello-ack`, kept for the run, or a later one; false
  without `coreTransport`), null until startup's chain check knows. The core's view is published with the heartbeat,
  so it lags a change by up to a second. No key byte reaches either: `testKeys` is redacted in `/config` and in logs,
  and neither `/status` nor the transport carries a key.

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
without it), and that the browser build bundles; its `DEALLOCATE ALL` runs inside the job, and the job ends with `RESET
ALL` and `RESET ROLE`, since that `pg_dump` sets its session's settings on PGlite's one session. Any committed height is
a block boundary (RN-6), so every dump holds whole blocks. As built (task 15.1, `src/backup/`): the command is `umbradb
backup --out <file> [--config <file>]` — the configuration file, `umbradb.config.ts` unless given as for `run`, names
the database, the opt-in and the side, and its build the tables declared `deterministic: false` —; a process backs its
own database up through `ProcessHandle.backup(out)` and `backupAtStop`, the same code; a PGlite directory opens in one
process at a time (DB-11), so while a process holds it the command refuses with `writer-lock-held` and the process
backs it up itself — on SIGUSR2 at a pause of its loop under owner decision Q152 B (task 15.1a). The manifest's facts
and the contents hash are read in the snapshot; a
private database (its side, or `core_private_source.cursor` in it) is refused without the opt-in before anything is read
(PP-12); the URL's password reaches `pg_dump` as `PGPASSWORD`, never on its command line; the file is written under a
temporary name beside its path, flushed and renamed only once complete. A sequence is not transactional: `pg_dump`
reads a sequence's position when it reads it, so on PostgreSQL beside commits the dump can hold an opted-out table's
sequence ahead of its rows (never behind them). The backup at stop is skipped when the file at `backupAtStop` is a
backup of that height, replaces a backup of another height, and refuses (`backup-format-unknown`, logged; the process
stays `stopped`) a file there that is no backup. **Restore.** The command reads the manifest line, makes the
checks of BK-3 that need no tables, then opens one transaction on the writer connection and runs the file's SQL itself
(no `psql`; statements a tool writes for `psql` alone are handled as `psql` would), creates the module roles the server
lacks and applies DB-6's and DB-7's owners and grants, recomputes the contents hash, checks the state root, and commits
only if all hold; on PGlite the same runs as one queued job. A crash mid-restore leaves nothing, since nothing commits
before the end. A restore runs the file's SQL with the writer's rights, so the operator guide says to restore only
trusted backups. As built (task 15.2, `src/backup/restore.ts`, `statements.ts`): `umbradb restore <file> [--config
<file>]`, its chain the configuration's node (`core-block-fetch`'s node source on one node client); before loading, in
BK-3's order — the target empty (no schema but PostgreSQL's own and `public`, nothing in `public`, no extension but
`plpgsql`; a PGlite directory without a database is empty and not opened), the manifest of format 1 and the whole dump
read once without running it (the statements split as PostgreSQL's lexer reads them; `\restrict`/`\unrestrict` taken as
`psql` takes them, any other meta-command, a `COPY … FROM stdin` or a cut-off end refused as `backup-format-unknown`),
the configuration's S and `checkHistory` against the manifest's rows at its height (`missing-entry` and `changes-past`
are `backup-history-mismatch`; `upgrade-required` and `requires-resync` `backup-build-mismatch`), the recorded
migrations against the build (`checkRecordedMigrations`, the bootstrap's own checks: `backup-build-mismatch`), block 0's
hash, the finalized head and the block at the height; the node's ledger state root read before the transaction when
`core-ledger-state` is in the history. Then, after the writer started: the target checked empty again, each statement
run, `RESET ALL`, `restoreOwnership` (`src/db/roles.ts`: missing module roles created and, for a login that is not a
superuser, granted to it, as `prepareSchemas` does; each module schema and its tables, partitions, views, sequences no
column owns, routines, enums, domains and ranges given to the schema's role; UmbraDB's own schemas stay the login's)
and `restoreGrants` (`src/db/migrate.ts`: `EXECUTE` taken from `PUBLIC` on module routines, then `prepareSchemas`'s
grants as each owner and the bootstrap's `core_chain`/`core_digest` grants), the contents hash with the plan's opt-outs,
the stored root. A restored database's catalogs equal a database built by migrations' up to the order of an ACL's items
(A125). A private process's backup is not restored by the command yet: owner decision Q153 B restores it against
its public database (task 15.2a).

### 9.2 Browser build (BR)

`browser/` holds a static page and three worker entry points (core, ledger, private), bundled with `esbuild` (a new
development dependency, pinned in task 0.1); PGlite runs in the core and private workers with `memory://` or
`opfs-ahp://` storage (memory by default, OPFS optional; verified by probe, §14); the admin endpoints are message calls
answered by the same backbone parts; the page offers backup and restore of its database (BK-5). `npm run build:browser`
writes `dist-browser/`, which is not part of the npm package.

**As built (task 16.1).** `browser/build.ts` (`npm run build:browser`) bundles the page (`index.html`, `src/page.ts`),
the core and private workers (`src/core-worker.ts`, `src/private-worker.ts`: one process each in a dedicated module
worker, `src/process-worker.ts`, started as `umbradb run` starts one — the command's build, the bundled configuration's
data, the node's block source or the private intake) and the ledger worker (`src/ledger-worker.ts`:
`src/ledger/worker/entry.ts` unchanged). The configuration is a module the page bundles (`src/config.ts` by default;
`src/configuration.ts` its shape): it makes each process's data from the run — the node, the storage, S, the page's
parameters — and names its user modules and private instances. The workers bundle UmbraDB's sources unchanged and
replace only what a browser lacks, each in one place: Node.js's built-in modules for the files of `src/` (`node:crypto`
by a synchronous, incremental SHA-256; `node:async_hooks` by nothing, so PGlite's nested-call guard of Q73 is off in the
browser and such a call waits instead of being refused; `node:worker_threads` by Web Workers, the first message carrying
`workerData` and later ones held until the entry listens; `node:fs`; `node:http`, `node:https` and `ws` by the page's
message network; `node:path`, POSIX from `/`), `Buffer` (given to the files of `src/` that name it) and
`process.hrtime.bigint` (`performance.now()`); whole modules — the database's opening (PGlite in memory or OPFS, never
PostgreSQL), the PGlite writer lock (a Web Lock `umbradb-database:<name>` asked with `ifAvailable` and held for the
worker's life, so a second tab refuses with `writer-lock-held` before it opens anything), the configuration loader (no
file), the node client's socket (the browser's `WebSocket`: no handshake status, so a refused handshake reads as
`connect-failed`) and the module API's listener (calls on the worker's channel); and `umbradb backup`'s module (task
15.1), bundled as a stub whose exports fail when used. A built-in module no replacement covers fails the build by name.
The vendored ledger packages' Node.js entries are rewritten to read their `.wasm` beside the ledger worker with a
synchronous request, check it against the package's `SHA256SUMS` (`package-hash-mismatch`) and instantiate it
synchronously, as `readFileSync` does: a top-level `await` there, in the cycle the packages' snippets make (`#self`),
waits on itself once bundled. The process transport of `src/private/` runs unchanged over the page's message network — a
`MessageChannel` per connection, which the page hands to the listening and the connecting worker — with its six
messages, lockstep and close codes; `tls` is refused there (no TLS on the page's channels); its timers are `unref`'d
only where they can be (`src/private/timers.ts`). The admin endpoints are the process's own `ProcessAdmin` with a
starter whose listener is the worker's channel (`answerAdmin` over the backbone parts' routes, BR-3); the heartbeat
ticks in the same worker, so a worker whose loop is blocked answers no call at all, where Node.js's admin thread answers
`/health/live` 503 (AE-2). For a new database the core worker reads the node's finalized head and runs from it as S
(BR-2); the page keeps S per OPFS database in `localStorage`, so a reload and a second tab run the same configuration.
Every `core` entry runs under the development opt-in (BR-1). The page must be cross-origin isolated (COOP `same-origin`,
COEP `require-corp`): the node-store bridge's `SharedArrayBuffer` needs it. Backup and restore in the page (BK-5) wait
for `umbradb backup` and `umbradb restore` (tasks 15.1, 15.2): the page shows them disabled. The tests (`test/browser/`)
drive the machine's Chrome headless over the DevTools protocol, with no test dependency.

## 10. Tables

Every column is `NOT NULL` unless marked null; a one-row table has the key `id smallint` with `CHECK (id = 1)`;
per-block tables are append-only and partitioned by height range; no table stores wall-clock time; hashes and keys are
`bytea`; heights and indexes are `bigint`; amounts wider than 64 bits are `numeric`; nothing is a float.

| Owner | Table | Primary key | Other columns |
|---|---|---|---|
| `core-chain` | `core_chain.identity` | id = 1 | genesis_hash, start_height, anchor_hash (null until block S commits; recorded in block S's transaction) — migration `002`; genesis hash and S recorded at every start until S commits (IN-2) |
| `core-chain` | `core_chain.config` | (entry_id, start) | stop (null; always null for `core`, a `CHECK`), version (text), data (jsonb, canonical; null for a scheduled revision, CF-3), data_hash (32 bytes; null with data, a `CHECK`), provides (`text[]`: the names of the `table` items the revision provides — a module's from its declaration, `core`'s the backbone parts' —, each once, in UTF-8 byte order; what a private process's graph counts, PP-13, task 14.1a) |
| database API | `core_chain.migrations` | (module, migration_id) | checksum (SHA-256 of the UTF-8 SQL), position (int, from 1; unique per module) |
| `core-block-commit` | `core_block_commit.blocks` | height | hash, parent_hash, spec_version (int), ledger_version (text), block_time (`timestamptz`, converted exactly from the node's milliseconds by PostgreSQL's integer interval input, never through a float, Q74) — range-partitioned by height as 0.9.5's `chain_archive` store was: 1,000,000 heights per partition, five from 0 and a default (`src/backbone/height-partitions.ts`, task 10.2) |
| `core-block-commit` | `core_block_commit.hashes` (not partitioned) | hash | height — makes a repeated hash fail, which the height-partitioned `blocks` table cannot enforce |
| `core-digest` | `core_digest.tables` | (schema, table) | height, digest (DT-5) |
| `core-digest` | `core_digest.checkpoints` | (height, schema, table) | digest — at every height h with h mod 14,400 = 0 |
| `core-chain-events` | `core_chain_events.events` | (height, event_index) | phase (text: `initialization`, `apply-extrinsic`, `finalization`), extrinsic_index (int null; set exactly under `apply-extrinsic`, a `CHECK`), pallet, name (text), bytes (SCALE: the event record's own bytes — phase, event, topics — so the count and the rows give `System::Events` back), fields (jsonb, canonical: keys sorted, integers of 64 bits and wider as decimal text, bytes as `0x` hex) — migration `001`, range-partitioned by height (task 11.1) |
| `core-block-parsed` | `core_block_parsed.transactions` | (height, tx_index) | tx_hash (32 bytes, the ledger's), kind (`regular`, `system`), size (int > 0) — range-partitioned by height (task 11.1) |
| `core-tx-results` | `core_tx_results.results` | (height, tx_index) | outcome (`success`, `partial`, `failure`) — range-partitioned by height (task 11.1) |
| `core-ledger-state` | `core_ledger_state.nodes` | node_key | data, children (ledger serialization) — an existing key is left as it is (a node is its key's content) (task 12.3) |
| `core-ledger-state` | `core_ledger_state.root_counts` | node_key | count (int > 0) — each block adds its batch's signed changes, a count reaching 0 deleted (task 12.3) |
| `core-ledger-state` | `core_ledger_state.states` | height | state_key, state_root, zswap_first_free, zswap_root (null), dust_commitment_first_free (null), dust_commitment_root (null), dust_generation_first_free (null), dust_generation_root (null) — the five null until a vendored package exports them (decision record question Q138); range-partitioned by height (task 12.3) |
| `core-ledger-state` | `core_ledger_state.sweep` | id = 1 | cycle, phase (`idle`, `mark`, `sweep`), sweep_after (null) |
| `core-ledger-state` | `core_ledger_state.grey`, `core_ledger_state.marks` | node_key | — |
| `core-ledger-state` | `core_ledger_state.segment_results` | (height, tx_index, segment) | success (boolean) — range-partitioned by height (task 12.3) |
| `core-ledger-state` | `core_ledger_state.events` | (height, tx_index, event_index) | kind (`zswap-input`, `zswap-output`, `contract-deploy`, `dust-initial-utxo`, `dust-generation-dtime-update`, `dust-spend-processed`, `param-change`), logical_segment, physical_segment (int), bytes (ledger serialization), nullifier, commitment, tree_index, contract_address (each null) — event_index numbers each transaction's events from 0 in emission order; range-partitioned by height (task 12.3) |
| `core-contract-states` | `core_contract_states.states` | (contract_address, height) | state_key, zswap_state_key — each 32 bytes, persisted (LG-13); range-partitioned by height (task 13.1) |
| `core-contract-logs-*` | `contract_logs.logs` | (height, tx_index, log_index) | contract_address, entry_point, logical_segment (int), log_version (bigint), event_type (text), data (ledger serialization) — log_index numbers the block's logs from 0 in emission order; event_type one of the eleven MIP-0002 types; the shared item's one migration `001`, recorded under `contract-logs`; range-partitioned by height (task 13.1) |
| `core-key-registry` (private) | `core_key_registry.keys` | key_id | kind (text), key_bytes, arrived_height |
| `core-private-source` (private) | `core_private_source.cursor` | id = 1 | height (null), hash (null), parent_hash (null; Q124), public_genesis_hash, public_start_height |

**Storage helpers' tables (SH-1, SH-2; CORE-ARCH §4.11a, Q30).** A helper's table belongs to the module that calls the
helper: a migration the module includes in its own `migrations` creates it in the module's schema, and the module writes
it through its own handles only, so the rules above, §4's module rules, change capture and backups treat it as any other
table of the module, and other modules may read it but not write it (DB-6). The cursor table
(`src/helpers/cursor-table.ts`, task 6.1, from 0.9.5's Watermarks): `cursorTable({ schema, table })` gives
`<schema>.<table> (key text PRIMARY KEY, value jsonb NOT NULL) WITH (fillfactor = 90)` — the key unique by bytes and
read in DT-2's order by the component's `keyOrderTerm`, so the table names no collation (A138); the value under Q57's
`CHECK`; the fill factor and the rule never to index `value` kept from 0.9.5, for heap-only updates — as
`migration(id)`, whose SQL text never changes (it is in the module's checksum, DB-9); `write(w, key, value)` through the
block write handle, one upsert, so the last write of a key wins, within a block too (SH-3's one write per key per block
is the height-versioned table's); and `read(handle, key)` through any handle's `query`, `undefined` for a key never
written (JSON `null` is a value). 0.9.5's `kind` column (SH-1 has one key) and `updated_at DEFAULT now()` (no wall-clock
time, a non-immutable default) are gone; a value is written as JSON text by the database API's parameter mapping and
read back by its lossless reader (DB-2), so integers beyond 2^53 stay exact.

The height-versioned table (`src/helpers/height-versioned.ts`, task 6.2, from 0.9.5's TemporalKV, with block heights for
its wall-clock times): `heightVersionedTable({ schema, table })` gives, as `migration(id)` (its SQL fixed), the current
table `<schema>.<table> (key text PRIMARY KEY, value jsonb NOT NULL, from_height bigint NOT NULL) WITH (fillfactor =
90)`, the history table `<table>_history (key text, from_height bigint, to_height bigint, value jsonb)` keyed by `(key,
from_height)` with `CHECK (from_height < to_height)`, and the trigger `versions` (`BEFORE INSERT OR UPDATE OR DELETE
… FOR EACH ROW`; its PL/pgSQL function `<table>_versions()` is the module role's, not `SECURITY DEFINER`) that fills
the history (SH-2): `write(w, b, key, value)`, one upsert at `b.height` — the block write handle's own `height` is the
cursor before the block, null for the first one, so the block is passed —, closes the key's current version at h and
makes the value current from h; the value the key has already adds no version (jsonb equality; the row is left as it
is, so nothing is captured); `delete(w, b, key)` closes it at h, in one `DELETE` that first sets the transaction-local
`umbradb.delete_height` for the trigger, as a `DELETE` cannot hand a trigger a value; `read(handle, key, height?)`
returns the version with `from_height ≤ h < to_height`, or without a height the current value. SH-3: the trigger
refuses a write or delete of a key that already changed at h — its version starts at h, or its last closed version
ends at h — with SQLSTATE `23505`, so the write rejects with `database-error`, a callback error that halts with
`callback-error` (RN-8), and the failed statement leaves the block's transaction unable to commit even if the module
catches the error; writes that change nothing (the value the key has, a delete of a key with none) are neither refused
nor counted (task 6.2's question Q110). The trigger also refuses a change at a height below the key's versions
(`23P01`, the code of 0.9.5's exclusion constraint), a `DELETE` not made by `delete` and an `UPDATE` changing a key
(`0A000`). Gone from 0.9.5: `ns` and `scope`, the version counter, the wall-clock `updated_at`, `valid_from` and
`valid_to`, the transaction id `updated_xact`, the `bigserial` id, and the `tstzrange` column with its gist exclusion
constraint (which needed `btree_gist`); both tables get Q57's `CHECK`, change capture and the `TRUNCATE` guard as any
module table.

## 11. Refusals and halts (IN-12)

Each code below has a test that triggers it and checks it, named in `test/runner/code-registry.ts`, or the task that
adds it there (A87; task 10.4): a code added here comes with its test.

**Startup refuses** (state `refused`, live, not ready — but a refusal of the configuration itself, before its core
revision is known, logs every finding and ends the process, serving no admin endpoint: owner decision Q137 B, task
8.1b), with these codes: `genesis-mismatch`, `cursor-hash-mismatch`,
`changes-past`, `missing-entry`, `not-plain-data`, `invalid-configuration`, `upgrade-required`, `requires-resync`,
`migration-checksum-changed`, `migration-missing`, `migration-failed`, `non-deterministic-column`,
`non-deterministic-table`, `no-primary-key`, `unsupported-key-type`, `unsupported-column-type` (DT-6, Q58, Q61),
`shared-item-migrations-differ`, `unknown-point`, `reserved-prefix`, `bad-id`, `schema-collision`, `duplicate-id`,
`item-no-lifetime`, `table-item-no-kind`, `field-no-kind`, `invalid-declaration` (these five: decision record Q94),
`item-no-provider`, `providers-overlap`, `graph-cycle`, `item-not-available`, `no-requirement`,
`cannot-start-mid-chain`, `process-item-missing`, `duplicate-api-route`, `development-opt-in-required`,
`needs-lockstep-not-listed`, `private-binding-mismatch`, `test-key-conflict`, `package-hash-mismatch`,
`writer-lock-held`, `durability-fsync-off`, `durability-pooler`, `durability-full-page-writes-off`; `callback-error` (a
failing `on-start-db` or `on-start-api`, with point and module) and `listen-failed` (a listener that cannot bind)
(Q115). **Backup and restore refuse** (the command exits non-zero; nothing is written or committed):
`backup-tools-missing`, `private-backup-refused`, `backup-format-unknown`, `restore-target-not-empty`,
`backup-history-mismatch`, `backup-build-mismatch`, `backup-genesis-mismatch`, `backup-block-not-finalized`,
`contents-hash-mismatch`, `backup-root-mismatch`.

**Processing halts** (state `halted`, live, not ready, the database at the last committed height), with these codes:
`callback-error` (with point and module), `database-error`, `parent-mismatch`, `finality-conflict`, `node-requirement`,
`duplicate-block-hash`, `unknown-runtime`, `bad-version-digest`, `pin-mismatch`, `metadata-mismatch`, `root-mismatch`,
`fast-log-unsupported`, `unexpected-cursor`, `writer-lock-lost`, `truncate-not-allowed` (a callback error); for a
private instance, `lockstep-behind` and `report-hash-mismatch`.

**The test tape's errors are not `UmbraError` codes** (tasks 9.1, 9.2): the tape is test tooling (`tools/tape/`, §1),
and `ERROR_CODES` is the exported `ErrorCode` (§12). `bad-tape-record` is the tape tools' own `TapeError` (the line,
counting from 1, and a `reason`); `not-on-tape` is the tape node's JSON-RPC error (code −32090, message
`not-on-tape: <method>`), which the node client reads as `node-error` (`rpc-error`) and never retries, so a test whose
indexer calls something its tape lacks fails at once, naming the method, instead of retrying. The recording builder's
`cannot-record` (`RecordingError`: the session, the side the frame came from, a `reason`) voids a recording with a
frame the tape node could not give back byte for byte; the variant transforms' `bad-transform` (`TransformError`, a
`reason`) refuses what a tape lacks or cannot hold.

**A module's call fails** (an `UmbraError` the module may catch; uncaught, its callback fails with `callback-error`):
`state-not-retained` (LG-12: a ledger state outside the retention window, task 12.4).

**`test-key-conflict` names its cause** in `details.reason` (§8; task 14.4): `start-changed` (the key was
admitted with another start: `index`, `admitted`, `start`) or `start-passed` (a key not admitted whose start is at or
below the private cursor, S − 1 before the first block: `index`, `cursor`, `start`). The code leaves with the keys
(owner decision Q154, task 14.4a; Q150 withdrawn).

**`private-binding-mismatch` names its cause** in `details.reason` (PP-2, §8), in the order a private start checks
them: `public-not-started` (the public database's core never started, Q125), `network` (its genesis hash is not the
configured network's, Q136 B: `network`, `configured`, `public`), `genesis` and `start` (it is not the public database
the private database recorded: `recorded`, `public`), `private-start-below` (the private S is below the public S:
`private`, `public`).

## 12. Exported surface and command (LS-1, LS-6)

**Values:** `defineConfig`, `coreEntry`, `versionEntry`, `defineModule`, `startProcess`, `runLedgerWorker`,
`InMemoryBlockSource`,
`cursorTable`, `heightVersionedTable`, `encodeCanonical`, `encodeRow`, `contentsHash`, `POINTS`, `UmbraError`.

**Types:** `ModuleDeclaration`, `ItemDeclaration`, `Lifetime`, `FieldKind`, `FieldSchema`, `Migration`, `Revision`,
`PointName`, `PointCallbacks`, `ProcessContext`, `BlockContext`, `ItemSink`, `ReadHandle`, `BlockWriteHandle`,
`SchemaWriteHandle`, `ApiRegistry`, `BlockRef`, `BlockSource`, `LedgerPackage`, `Entry`, `CoreVersion`, `UmbraConfig`,
`ProcessHandle`, `ProcessState`, `ErrorCode`, `ParsedTransaction`, `LedgerTask`.

**Command:** `umbradb run [--config <file>]`, `umbradb config check <file> [--database <url>]`, `umbradb backup --out
<file> [--config <file>]`, `umbradb restore <file>` — `package.json`'s `bin` `umbradb` (`dist/cli/main.js`, task 4.4).
No command, or any other, or a wrong argument, prints the usage and exits 2; a failed check exits 1; `run` (task 4.4a,
§7) runs until SIGTERM or SIGINT and exits 1 when startup refused or processing halted, else 0, and exits 1 at once
when the configuration itself is refused (Q137 B, task 8.1b); `backup` exits 0 once its file is written and 1 when
refused (task 15.1), `restore` 0 once committed and 1 when refused, nothing committed (task 15.2); 3 is left for a
command a build does not provide. The configuration file's `modules` export is the command's user modules (CF-1,
Q106 B).

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
| Test files | TemporalKV, Watermarks (`test/postgres/watermarks.test.ts`; its cases that still apply rewritten in `test/helpers/cursor-table.test.ts`, Q108), CheckpointStore, Lease, `saveAndAdvance`, WalletStateEnvelope and cross-part durability tests; `no-consumer-import-in-bench`; `chain-archive-{migrate,rollover,store}` tests (replaced by the core block table tests); `chain-archive-{sync,sync-retry,replay-decode,preprod-cloud-crossval}` integration tests (they drive the official-indexer client, deleted by rule b); `api-surface/chain-archive-routing`; `no-chain-sync-import-guard` (the folder is gone) | `durability-probe.test.ts` (as `test/db/durability-probe.test.ts`); `migrate` (as `test/db/migrate.test.ts`), `client`, `errors` and `chain-archive-sync/node-rpc-client.test.ts` refactored onto `src/db/` and `src/node/`; `migration-lock-timeout` retired with the migration advisory lock (§4: the writer lock keeps a second instance from waiting or migrating, A17, and the zero timeouts keep a migration from being cut off, A141); `watermarks.property.test.ts` (P9) retargeted; `no-sdk-import-guard`; gate machinery | One test file per acceptance group |
| TransactionHistory tests | — | Moved with the source to `legacy/transaction-history/`, excluded from the run (LS-3): its unit, property, wallet-SDK adapter and merge-parity tests and the two live preprod tests (`test:live` runs them from there), none with a required id (task 17.1) | A3's static test `test/library-surface/legacy-excluded.test.ts`; the pack smoke's checks that the tarball holds nothing of `legacy/` or TransactionHistory and that its names do not resolve |
| Coverage floors (`vitest.config.ts:47-60`) | `checkpoint-store`, `save-and-advance`, `watermarks`, `temporal-kv`, `transaction-lease` | `durability-probe` 97/92, `migrate` 90/85, `errors` 95/91 (moved paths) | `src/**` 90/85 by default; `src/determinism/**`, `src/deterministic-postgresql/**`, `src/helpers/**` and `src/ledger/sweep*` 95/90; `tools/tape/**` 90/85 (outside the package, measured because the ingest, fault and differential tests stand on it; task 9.1) |
| Mutation (`stryker.conf.json` `mutate`, break 65) | The five 0.9.5 adapters | Break threshold 65 | `src/modules/graph.ts`, `src/runner/order.ts`, `src/config/history.ts`, `src/determinism/cbor.ts`, `src/determinism/digest.ts`, `src/helpers/height-versioned.ts`, `src/helpers/cursor-table.ts`, `src/ledger/sweep.ts`, `src/backbone/block-fetch-queue.ts` |
| Public API pins (`test/api-surface/*`, `test/smoke/pack-install.mjs`) | The 36-symbol pins, the error-catalog and retryability tables of 0.9.5 | The deep-import block; `package-json-strict` (exports only `"."`) | A sorted-name pin of §12; the pack smoke imports §12, syncs a tape on PostgreSQL in Docker, and runs `umbradb config check` |
| Benchmarks (`bench/`, non-gating `bench-smoke.yml`) | TemporalKV, Watermarks, CheckpointStore, Lease and TransactionHistory workloads and their baseline (the TransactionHistory workload left `bench/harness.ts` with the source in task 17.1, to `legacy/transaction-history/bench/`) | The non-gating job | `runner.commitEmptyBlock` per backend; the ingest comparison with the official indexer (SC-009, `bench/ingest-vs-official/`); the tape-apply baseline (A143, Q72), reported and never failing |
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
| `jsonpath` `.string()` keeps a JSON number's scale: `1.0` → `"1.0"`, `100.00` → `"100.00"`, `1e2` → `"100"` (Q57) | PostgreSQL 17.11 (`postgres:17-alpine`) and PGlite 0.5.10, 2026-10-23; PostgreSQL 18.6 (the pinned `postgres:18-alpine`), 2026-10-24, `test/dependencies/postgresql.test.ts` | Verified (run, test); re-checked by task 7.1's `test/deterministic-postgresql/checks.test.ts` on both backends, 2026-10-25 |
| PGlite 0.5.10 embeds PostgreSQL 18.6; production is PostgreSQL 18 too (Q82) | `select version()` on 0.5.10; the pinned image reports PostgreSQL 18.6 too (`test/dependencies/postgresql.test.ts`) | Verified; both backends run one major version (in the tests one minor version, 18.6), and the cross-backend differentials (A55, A105, A135) guard the rest |
| The PostgreSQL image of the tests, benchmarks and pack smoke test (A148): `postgres:18-alpine@sha256:77f585114c32fbca283dc835b0596f4e52b51b4c6662d7810b2f4084f60a1873` is the official image's multi-platform index, PostgreSQL 18.6 on Alpine 3.24.2 | `docker-library/repo-info` `repos/postgres/remote/18-alpine.md` at `23406aef` (the tag's index from 2026-09-21 to 2026-10-22); pulled by digest 2026-10-24: `postgres --version` 18.6, `/etc/alpine-release` 3.24.2 | Verified (pulled); pinned in `test/postgres-image.ts`, checked by the supply-chain gate's image-pin agreement and `test/dependencies/postgres-image.test.ts` |
| PGlite does not stop two processes opening one data directory | Probe: two Node.js processes opened and wrote one directory | Verified (probe); hence the operating-system lock of §4 |
| PGlite with OPFS storage in a browser worker; Web Locks exclusion | Probe in a Chromium-based browser, 2026-10-22: PGlite 0.5.10 in a module worker with `opfs-ahp://` wrote a row, closed, reopened and read it back; a second `navigator.locks.request(…, { ifAvailable: true })` on a held lock got `null` | Verified (probe) |
| The browser build in Chrome: PGlite 0.5.10 in dedicated module workers in memory and with OPFS, a nested worker, a growable `SharedArrayBuffer` waited on with `Atomics.wait` across workers under COOP/COEP, Web Locks with `ifAvailable`, a synchronous request in a worker; the same contents hash as Node.js on PGlite | `test/browser/browser.test.ts` on Chrome 156.0.8078.48 headless (macOS), 2026-10-27 (task 16.1) | Verified (test) |
| OPFS access handles are exclusive: a second opening of a database another tab holds fails `createSyncAccessHandle` | `test/browser/browser.negative-control.test.ts` (a page without the Web Lock), Chrome 156, 2026-10-27 | Verified (test); the Web Lock refuses first, with `writer-lock-held` |
| esbuild 0.28.2 bundles a top-level `await` in a module cycle so that the cycle waits on itself (the vendored packages' snippets import their entry back) | The ledger worker's first parse never answered with the entry awaiting its `.wasm`; synchronous instantiation answers, task 16.1, 2026-10-27 | Verified (run) |
| An operating-system lock from Node.js (`node:sqlite`, `BEGIN EXCLUSIVE`) | Probe in Node.js v24.9.0, 2026-10-22: second process refused while the holder ran and while it was stopped; taken at once after `SIGKILL`. Probe, 2026-10-24: with `busy_timeout` 0, 4 of 30 rounds of ten processes started at one instant ended with no holder; with 10–100 ms, exactly one holder in 50 of 50 rounds (Q92); A17's tests (`test/db/pglite-writer-processes.test.ts`) | Verified (probe, test); `node:sqlite` is marked experimental in Node.js 24 |
| zod 4: per-field metadata read back (`shape[f].meta().kind`), defaults, issue paths, `z.toJSONSchema` keeping `kind` | Probe on `zod` 4.4.3, 2026-10-22 | Verified (probe) |
| `ws`: WebSocket server over `https` requiring client certificates | Probe on `ws` 8.22.0 (2026-09-26), 2026-10-22: with a certificate connected; without, `ERR_SSL_TLSV13_ALERT_CERTIFICATE_REQUIRED` | Verified (probe) |
| `esbuild` bundles a worker entry with a WASM asset | Probe on `esbuild` 0.28.2 (2026-08-08), 2026-10-22: 0 errors, the asset emitted | Verified (probe) |
| Ajv validates JSON Schema draft 2020-12 and, in strict mode, refuses a schema with an unknown keyword (the admin endpoints' schemas, A66) | Probe on `ajv` 8.18.0 (2026-02-14; already in the tree as Stryker's, now an exact development dependency), 2026-10-26: `additionalProperties`, `required`, `pattern`, `$ref` to `$defs` and `oneOf` enforced, a misspelled keyword refused at compile time, `validateSchema` against the 2020-12 meta-schema; zod 4.4.3's `fromJSONSchema` accepted the misspelled keyword silently; `format` needs `ajv-formats`, so the schemas use patterns (`test/admin/json-schema.ts`) | Verified (probe and test) |
| `@electric-sql/pglite-tools` 0.4.10's `pgDump` runs PostgreSQL 18.6's `pg_dump` (WASM) on a PGlite 0.5.10 engine, adds `--inserts`, removes `\restrict`/`\unrestrict`, runs `DEALLOCATE ALL` and restores `search_path` only — the other settings its `pg_dump` sets stay on the session | Package source `src/pg_dump.ts` (0.4.10, published 2026-10-14, peer `@electric-sql/pglite` 0.5.10 exactly, no dependencies); probes and `test/backup/backup.test.ts` (task 15.1), 2026-10-27: on a bare engine `extra_float_digits` 1 → 3 and `synchronize_seqscans` on → off after `pgDump`; a dump through the database API's exclusive job, `Dumped by pg_dump version 18.6`, the session's settings back to the start parameters after it | Verified (source, probe, test); an exact development dependency and optional peer (task 15.1) |
| `midnight_ledgerStateRoot(at)` | `midnight-node/pallets/midnight/rpc/src/lib.rs:60-61` (node 2.1.0-rc.4) | Verified (reference) |
| `midnight_ledgerStateRoot` answers a JSON array of byte values (a `Vec<u8>`, 33 bytes); head notifications (`chain_newHead`, `chain_finalizedHead`) carry the header without its hash; `system_properties.genesis_state` is hex without `0x` | `rpc.mainnet.midnight.network`, 2026-10-25: the answers recorded in `test/node/fixtures/mainnet-answers.json` (its `genesis_state` is `test/ledger/fixtures/genesis/genesis_state_mainnet.mn`) | Verified (run); the node client's readers (task 10.1) |
| Substrate answers a call over the node's RPC rate limit with `-32999` "RPC rate limit exceeded", and a state the node discarded (pruned) with `4003` "Client error: UnknownBlock: State already discarded for 0x…" | `polkadot-sdk` stable2606 at `660acefe`: `substrate/client/rpc-servers/src/middleware/mod.rs:151`, `substrate/client/db/src/lib.rs:2833`, `substrate/client/rpc-api/src/state/error.rs:67` (the node builds the `shieldedtech` fork of stable2606 at `6b0ce48`, not read) | Verified (reference, upstream branch); no pruned node was available to observe it |
| `ws` 8.22.0: a handshake answered with a status other than 101 is reported by `unexpected-response` (with the status); a connection refused reports its system code (`ECONNREFUSED`) on `error`, then `close` 1006 | Probe on `ws` 8.22.0, 2026-10-25 (statuses 200, 404, 429, 503; a closed port); `test/node/client.test.ts` | Verified (probe, test) |
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
| PGlite 0.5.10 enforces `statement_timeout` and `idle_in_transaction_session_timeout` | Checked 2026-10-24 (orchestrator, and the targeted fix check): `pg_sleep(3)` completes after 3 s under `statement_timeout = 1000`; with `idle_in_transaction_session_timeout = 1000`, a statement after 2 s idle hangs (killed after 10 s), with 0 it answers; `electric-sql/pglite#1058`. Probe and tests, 2026-10-25 (task 2.7): with each of `idle_in_transaction_session_timeout`, `transaction_timeout` and (outside a transaction) `idle_session_timeout` at 1 s in `postgresql.auto.conf`, the statement after 2.5 s idle hangs and the process's event loop stops; `-c name=0` start parameters win over the file and it answers (`test/db/pglite-timeouts.test.ts`, in processes of their own) | Verified: it enforces neither, and a timeout that fires hangs it; API reads on PGlite are not bounded, and every session pins the zeros (DB-15, Q93) |

## 15. Relation to the existing design documents

- `design/design.md` §2 (TemporalKV), §3 (checkpoint chunker), §4 (Watermarks) and §5 (commit/transaction layer)
  describe the parts this change retires or refactors; §5's transaction rule survives as one transaction per block
  (RN-6) and its lease as the writer lock (DB-11). Those sections stay as the record of 0.9.5; `ROADMAP.md` points here.
- `design/design-interfaces.md` §1.1 (thrown, `code`-discriminated errors with retryability) is kept; §3.1–§3.4 are
  superseded by §12 of this document.
- `Formal/STORAGE_ALGEBRA.md`: W1 is kept (cursor table); T5's interval rule is restated for heights (SH-2); the other
  laws are retired as in §13, each listed for the owner's approval.
