# Roadmap

UmbraDB is a Midnight indexer: it reads finalized blocks from a Midnight node and writes what its modules compute into
PostgreSQL 18 or PGlite, one database transaction per block. This page says where the project stands and what comes
next. Each piece of work is an OpenSpec change under `openspec/changes/`, built and reviewed as `AGENTS.md` describes;
the [README](README.md) covers using it.

## 0.9.5 (released)

0.9.5 was a PostgreSQL storage library for wallet state. Its release record is kept:
[`docs/releases/v0.9.5.md`](docs/releases/v0.9.5.md), [`docs/releases/v0.9.5-notes.md`](docs/releases/v0.9.5-notes.md)
and [`docs/recovery/EVIDENCE.md`](docs/recovery/EVIDENCE.md). Its code and documents are in the git history. 0.10.0
carries none of its API or databases over.

## 0.10.0: the core architecture (`openspec/changes/core-arch`)

The change [`core-arch`](openspec/changes/core-arch/) builds the indexer on the parts of 0.9.5 that still apply. The
owner approved it on 2026-10-22 (commit `52cc6d4`) and decided it ships as one change and one pull request.

**The architecture.**

- **One source.** The indexer reads only from a Midnight node, and stores only finalized blocks, each height in one
  `BEGIN … COMMIT`. The database never rolls back; a crash leaves the last whole block and a restart resumes there.
- **One runner, many modules.** A module declares its tables, its callbacks at the runner's named points and its API.
  The core's own parts and modules use the same API: the backbone parts `core-chain`, `core-block-fetch`,
  `core-block-commit`, `core-digest`, `core-health`, `core-status` and `core-config`, and the core modules
  `core-chain-events`, `core-block-parsed`, `core-tx-results`, `core-ledger-state`, `core-contract-states`,
  `core-contract-logs-full` and the development-only `core-contract-logs-fast`. A process runs what its TypeScript
  configuration file names, and nothing else.
- **One database API** over PostgreSQL 18 and PGlite: a role and schema per module, checksummed forward-only
  migrations, a single-writer lock, and the `deterministic_postgresql` component that holds every rule UmbraDB
  imposes on PostgreSQL.
- **Versioned ledger parsing.** The official `midnight-ledger` packages, v8 and v9, built from pinned sources in
  `vendor/ledger/`, parse and apply each block behind one adapter; the ledger runs in a worker, its state is stored in
  the database with a retention window and a fixed-budget sweep, and every block's state root is checked against the
  node's.
- **Determinism.** A canonical CBOR encoding, a digest per table updated every block, and one contents hash that two
  instances compare; backups are `pg_dump` files checked against it on restore.
- **Private processes** run private modules on their own databases, fed from the public one, independently or in
  lockstep; the public database stays shareable.
- **Server and browser.** The same code runs in Node.js and, for development, in a browser page on PGlite.

The exported surface is the one `openspec/changes/core-arch/design.md` §12 lists: 54 names, 27 values and 27 types,
pinned by `test/library-surface/surface.test.ts` (A1); the command is `umbradb` (`run`, `config check`, `backup`,
`restore`).

**Status.**

- [x] Specification: proposal, design, capability specs and acceptance criteria, approved after the stage-1 gate.
- [x] The build, `tasks.md` §0–§17: pins, determinism, the database API, modules, configuration, the runner, the
  storage helpers, digests, the admin endpoints, the test tape, the node client and ingest, chain data, the ledger,
  contract data, private processes, backups, the browser build, the library surface and the moved gates. Each task
  was written test first and lists the acceptance criteria it demonstrated; the conformance gate passes.
- [ ] The deferred testing (task 17.5): the mutation passes and the coverage floors held back while the build moved.
- [ ] The whole-system runs, the owner's (§18): the crash sweeps with test modules and with every core module, the
  stagenet and preview syncs from genesis, the three-backend comparison, the ingest benchmark against the official
  indexer, the required test ids of `acceptance.md` §17, and the tape-apply baseline.
- [ ] Review and the pull-request record (`docs/PULL_REQUEST_CHECKLIST.md`), then the merge.

**Gates.** The conformance gate (`npm run test:conformance`: every suite, the coverage floors of `vitest.config.ts`,
and the required test ids), mutation testing at break 65 on the targets of design §13, the Lean gate (W1 for the
cursor table and the interval fact T5 rests on, [`Formal/STORAGE_ALGEBRA.md`](Formal/STORAGE_ALGEBRA.md)), the
supply-chain gate, the vendored ledger rebuild, and `npm run graph:check`.

## After 0.10.0

- **Feature modules**, each with its own specification: public wallet and dApp APIs, token metadata, DUST and
  shielded sync, private wallet data (the 0.9.5 TransactionHistory code waits for it, unexported, under `legacy/`),
  key handling, Passport and an explorer.
- **Publication on npm.** UmbraDB is built from the repository until then.
- **Open issues** are tracked in [`docs/issues/`](docs/issues/) and, once approved, on GitHub.

## Non-goals

- **No unfinalized data.** No tip in the database, no tip queries, no rollback of stored data.
- **No other data source** than the Midnight node, and no raw block archive: the node serves every block and its
  state.
- **No security boundary against modules.** Modules and configuration files are trusted code.
- **No migration of 0.9.5 databases.** The indexer always starts a new database.
- **Not a distributed store.** One writer per database, held by the writer lock.
