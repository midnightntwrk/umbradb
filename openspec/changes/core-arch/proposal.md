# Proposal — CORE-ARCH: the standalone indexer's core architecture (`core-arch`)

> **Status:** Approved — by the owner on 2026-10-22, at commit `52cc6d4`, after the stage-1 gate: two cold
> adversarial reviews (Codex `gpt-6-astra`), their fixes, and targeted fix checks ending in PASS. Change id `core-arch`;
> capabilities `library-surface`, `database-api`, `modules`, `configuration`, `runner`, `determinism`,
> `storage-helpers`, `admin-endpoints`, `test-tape`, `ingest`, `chain-data`, `ledger`, `contract-data`,
> `private-processes`, `snapshots`, `browser`, and the removal of `temporal-kv`. Next: stage 2, the test-first build.

## Why

UmbraDB 0.9.5 is a PostgreSQL storage library for wallet state. The owner approved, on 2026-10-22, a new architecture
for it: a standalone Midnight indexer that reads only from a Midnight node, stores only finalized blocks with one
database transaction per block, runs on PostgreSQL or PGlite, in Node.js or a browser, with modules attached to the
named points of one runner, versioned ledger parsing, the ledger state in the database, and optional private processes.
That architecture is specified in **CORE-ARCH** (an organizer document, not in this repository; every rule this change
relies on is restated here).

**One change, one pull request.** CORE-ARCH §10 planned seven delivery projects. The owner decided (Q47) to deliver the
complete architecture as one change and one pull request — the architecture is the feature being built — leaving out
only what the core architecture does not need. `openspec/config.yaml` asks that independently deliverable features be
split; this change is one feature by the owner's decision, recorded here as the written reason.

## What changes

1. **The 0.9.5 code becomes the indexer's foundation (breaking change).** The public API of 36 symbols is replaced by
   the runner, module, database, configuration and helper APIs. As the owner decided (CORE-ARCH §3.4; Q25, Q27, Q30):

   | 0.9.5 part | In this change |
   |---|---|
   | `src/interfaces/` + `src/postgres/` split, error hierarchy | Refactored into the shared database API and its PostgreSQL backend; a PGlite backend is added |
   | `src/postgres/client.ts` | Refactored into the PostgreSQL backend's connections |
   | `runMigrations`, per-schema lineages, migration lock | Refactored into per-module migrations with checksums |
   | Durability probe | Kept, with its explicit `full_page_writes` override |
   | Transaction/Lease | Refactored into the single-writer lock |
   | `saveAndAdvance` | Function retired; its rule becomes the runner's one transaction per block |
   | Watermarks | Refactored into the cursor-table helper |
   | TemporalKV | Refactored into the height-versioned-table helper |
   | CheckpointStore, WalletStateEnvelope | Retired |
   | TransactionHistory | Kept in the repository, unexported and outside the build, for the later private wallet-data feature |
   | `chain_archive` schema and store | Refactored into the core block tables, keeping range partitioning by height and the parent-hash and genesis checks |
   | `chain-archive-sync` | `indexer-client.ts` deleted (the indexer reads only from the node); `node-rpc-client.ts` → the node client; `tx-replay-decoder.ts` → the v8 ledger adapter; the sync loop → the runner |
   | Quality gates | Kept and applied to the new code; proofs and required test ids of retired parts are listed for the owner's approval (`design.md` §13) |

2. **The runner and its named points**, the block context, one `BEGIN … COMMIT` per finalized height, delivery
   guarantees after a crash, start and stop heights, the upgrade-boundary stop, and module APIs with their
   view/height/hash envelope.
3. **The shared database API** over PostgreSQL and PGlite: read and write handles, per-module roles, checksummed
   forward-only migrations, the single-writer lock, the durability probe.
4. **The module system** and **the TypeScript configuration** (`umbradb.config.ts`, zod settings schemas, the history,
   future-only revisions, one version per build).
5. **Ingest:** finalized-only storage, bootstrap and startup checks, finalized processing with prefetch, the in-memory
   best-block queue with branch switches, block 0, the error and retry rules, refusals and halts.
6. **Chain data:** the backbone parts `core-chain`, `core-block-fetch`, `core-block-commit`, `core-digest`, and the core
   modules `core-chain-events`, `core-block-parsed`, `core-tx-results`.
7. **The ledger:** version selection from the `MNSV` digest with built-in tables and pins, metadata at runtime
   upgrades, vendored and released ledger packages behind one adapter interface, the replay rules, the v8→v9
   conversion, the ledger worker, the ledger state stored in the database with a retention window and a fixed-budget
   mark-and-sweep, and the state-root check on every block (`core-ledger-state`).
8. **Contract data:** `core-contract-states` (state and zswap-state keys), `core-contract-logs-full`, and the
   development-only `core-contract-logs-fast`.
9. **Private processes:** binding, block intake from the public database, the process transport, independent and
   lockstep instances, the key API, opt-in mutual TLS.
10. **Determinism tooling, snapshots and storage helpers:** the canonical encoding, contents hash, per-block digests,
    snapshot export and import, the cursor and height-versioned tables.
11. **Admin endpoints** (`/health/live`, `/health/ready`, `/status`, `/config`), **the browser build** (development),
    and **the test tape** (owner decision Q48).

## Non-goals (what this change does NOT cover)

- **No feature module** of the FEATURES catalogue (public wallet and dApp APIs, token metadata, DUST and shielded sync,
  private wallet data, Passport, explorer); each gets its own spec later.
- **No tip in the database, no tip queries, no rollbacks of stored data** (Q1, Q18).
- **No raw block archive** (Q8): the node must serve every block and its state.
- **No backfill mechanism for private keys** (Q35) and **no TEE attestation** (Q34).
- **No migration of 0.9.5 databases**: the indexer always starts a new database (CORE-ARCH §3.4).
- **No security boundary against modules**: modules are trusted code (Q46).
- **No data source other than the Midnight node**, Celestia included (Q39).

## Impact

- **Breaking:** every 0.9.5 export is removed or replaced; the package version becomes `0.10.0`; `CHANGELOG.md` and the
  pull request say so. Nobody is known to depend on the 0.9.5 library in a way this blocks (owner, Q25).
- **New runtime dependencies** (exact pins, through the supply-chain gate): `@electric-sql/pglite`, `ws`, and the
  vendored ledger packages (built in this repository); `typescript` moves to runtime dependencies (for
  `umbradb config check`); settings schemas use the existing `zod` 4 (Q45). **New development dependency:** `esbuild`
  (browser build). Versions are chosen and verified in tasks 0.1–0.2.
- **Gates:** the Lean, mutation and conformance gates stay; their targets move to the new code; the vendored ledger
  builds are rebuilt and checked in CI. Proofs and required test ids that cover retired parts are retired with them,
  listed in `design.md` §13 and approved by the owner in the pull request (CORE-ARCH SC-010).
- **Size:** one large pull request, by the owner's decision; `tasks.md` orders the work so each task lands with its
  tests.
