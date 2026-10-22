# Proposal — CORE-ARCH project 1: runner and database (`core-arch-01-runner-and-database`)

> **Status:** Proposed. Change id `core-arch-01-runner-and-database`; capabilities `library-surface`, `database-api`,
> `modules`, `configuration`, `runner`, `determinism`, `storage-helpers`, `admin-endpoints`, `test-tape`, and the
> removal of `temporal-kv`. Awaiting the stage-1 gate: the cold adversarial review of this spec and the owner's approval.

## Why

UmbraDB 0.9.5 is a PostgreSQL storage library for wallet state. The owner approved, on 2026-10-22, a new architecture
for it: a standalone Midnight indexer built from modules that attach to named points of one runner, storing only
finalized blocks, one database transaction per block, on PostgreSQL or PGlite. That architecture is specified in
**CORE-ARCH** (an organizer document, not in this repository; its rules are restated here where this change relies on
them) and is delivered in seven projects. This is project 1: the foundation every later project builds on.

Without it nothing else can be built: ingest (project 2) needs the runner and the database API to write blocks; the
ledger (project 3) needs modules, configuration and determinism; every feature module needs the module system.

## What changes

1. **The 0.9.5 code becomes the indexer's foundation (breaking change).** The storage library's public API of 36
   symbols is replaced by the runner, module, database, configuration and helper APIs. Parts are refactored, kept or
   retired as the owner decided (CORE-ARCH §3.4, decisions Q25, Q27, Q30):

   | 0.9.5 part | In this change |
   |---|---|
   | `src/interfaces/` + `src/postgres/` split, error hierarchy | Refactored into the shared database API and its PostgreSQL backend; a PGlite backend is added |
   | `src/postgres/client.ts` | Refactored into the PostgreSQL backend's connections |
   | `runMigrations`, per-schema lineages, migration lock | Refactored into per-module migrations with checksums |
   | Durability probe | Kept, with its explicit `full_page_writes` override |
   | Transaction/Lease | Refactored into the single-writer lock |
   | `saveAndAdvance` | Function retired; its rule (data and cursor in one transaction) becomes the runner's one transaction per block |
   | Watermarks | Refactored into the cursor-table helper |
   | TemporalKV | Refactored into the height-versioned-table helper (versions keyed by block height) |
   | CheckpointStore, WalletStateEnvelope | Retired |
   | TransactionHistory | Kept in the repository, unexported and outside the build, for the later private wallet-data feature |
   | `chain_archive` schema and `chain-archive-sync` | **Not touched here** (project 2 refactors them) |
   | Quality gates | Kept and applied to the new code; the proofs and required test ids of retired parts are listed for the owner's approval (`design.md` §8) |

2. **The runner and its named points:** the fixed sequence of points (`on-start-db` … `on-stop-height`), the order of
   callbacks within a point, the block context and its items, one `BEGIN … COMMIT` per finalized height around
   `on-db-write`, the delivery guarantees after a crash, start and stop heights, and the upgrade-boundary stop. The
   runner takes finalized blocks from a **block source**; project 2 supplies the node-backed source and the backbone
   parts that fetch and commit blocks. This change ships the runner with the source interface and tests it with an
   in-memory source.

3. **The shared database API** over PostgreSQL (one writer connection, a read pool) and PGlite (one connection, one
   serialized queue): read handles at one committed height, write handles only inside `on-db-write` and
   `on-start-db`, one database role per module with `SET LOCAL ROLE`, `SECURITY DEFINER` provider functions, schemas
   named after modules and shared items, checksummed forward-only migrations, single-writer locks, and the durability
   probe.

4. **The module system:** the module declaration, its validation, the requirement graph resolved per height range,
   Kahn ordering with the smallest-id tie-break, the mid-chain rule, and shared-item providers.

5. **Configuration:** `umbradb.config.ts` with `defineConfig` and the `coreEntry` / `entry` / `pastEntry` builders,
   loaded with Node.js type stripping, evaluated to plain data, validated against zod settings schemas, recorded as
   the configuration history, future-only, with revisions by `(id, start)`, the development opt-in, the one-version-per
   -build check, and `umbradb config check`.

6. **Determinism tooling:** the canonical row encoding (deterministic CBOR), the contents hash, per-block digests for
   modules that opt in, and the `core-digest` backbone part.

7. **Storage helpers:** the cursor table and the height-versioned table.

8. **Admin endpoints:** `/health/live`, `/health/ready`, `/status`, `/config`, answered from memory, with the process
   states and conditions.

9. **The test tape:** the tape file format, a tape node that replaces the Midnight node in tests, and a recording
   builder with variant transforms.

## Non-goals (what this change does NOT cover)

- **No chain ingest.** No node subscription, finalized prefetch, best-block queue, block-0 handling, parent-hash
  checks, or the backbone parts `core-chain` (beyond its configuration tables), `core-block-fetch`,
  `core-block-commit`, `core-chain-events` — all project 2. The runner here is driven by the block-source interface.
- **No `chain_archive` or `chain-archive-sync` change** — project 2 refactors them into the core block tables and the
  node client.
- **No ledger:** no ledger packages, version table, ledger worker, ledger state, sweep or retention (project 3); no
  contract states or logs (project 4).
- **No private processes, process transport, key API, lockstep or mutual TLS** (project 5). The runner has no
  lockstep wait in this change.
- **No snapshot export or import** (project 6); this change provides the canonical encoding and contents hash they use.
- **No browser build** (project 7); the PGlite backend here runs in Node.js only.
- **No feature module** of the FEATURES catalogue.
- **No migration of 0.9.5 databases:** the indexer always starts a new database (CORE-ARCH §3.4).
- **No tip in the database and no tip queries** (deferred by the owner, Q1, Q18).

## Impact

- **Breaking:** every 0.9.5 export is removed or replaced; the package version becomes `0.10.0`; `CHANGELOG.md` and the
  pull request say so. Nobody is known to depend on the 0.9.5 library in a way this blocks (owner, Q25).
- **New runtime dependency** (exact pin, through the supply-chain gate): `@electric-sql/pglite`; `typescript` moves
  from development to runtime dependencies (for `umbradb config check`); settings schemas use the existing `zod` 4
  dependency (owner decision Q45). **New development dependency:** `ws` (tape node and recording proxy). Versions are
  chosen and verified in task 0.1.
- **Gates:** the Lean, mutation and conformance gates stay; their targets move to the new code. Proofs and required
  test ids that cover retired parts are retired with them, listed in `design.md` §8 and approved by the owner in the
  pull request (CORE-ARCH SC-010).
- **Later projects** build on the interfaces fixed here: the block source, the backbone order, the database handles,
  the module declaration, the configuration builders and the canonical encoding.
