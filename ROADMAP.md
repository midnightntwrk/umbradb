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
- [x] The deferred testing (task 17.5): the mutation passes and the coverage floors held back while the build moved.
  The mutation gate scores 87.98 % against its break of 65, and no coverage floor is pending.
- [x] The required test ids (task 18.4): the 18 ids of `acceptance.md` §17 whose tests exist are in the conformance
  gate's manifest, which fails the gate if any of them is missing, skipped or failing.
- [ ] A pre-release of 0.10.0, its pull request and GitHub release open for review and feedback; the release gates
  below follow it.
- [ ] Review and the pull-request record (`docs/PULL_REQUEST_CHECKLIST.md`), then the merge.

**Gates.** The conformance gate (`npm run test:conformance`: every suite, the coverage floors of `vitest.config.ts`,
and the required test ids), mutation testing at break 65 on the targets of design §13, the Lean gate (W1 for the
cursor table and the interval fact T5 rests on, [`Formal/STORAGE_ALGEBRA.md`](Formal/STORAGE_ALGEBRA.md)), the
supply-chain gate, the vendored ledger rebuild, and `npm run graph:check`.

## After 0.10.0

### Release gates still to run

0.10.0 goes out first as a pre-release; these whole-system runs follow it (`tasks.md` §18):

- **The crash sweeps** (18.1): kill the runner at every point that matters and at 100 random ones, with test modules,
  and check every restart ends with the same data as a run that never stopped; the same with 20 restarts; and a
  negative control the sweep must catch.
- **The full-core runs** (18.2): stagenet and preview from genesis to block 10,000 with every core module, every
  ledger state root matching the node's; the crash sweep repeated on that chain; PostgreSQL, PGlite in Node.js and
  PGlite in Chrome giving the same contents hash.
- **The ingest benchmark** (18.3): UmbraDB against the official Midnight indexer over stagenet 0–10,000, on the same
  machine.
- **The tape-apply baseline** (18.5): the time to apply 2,000 recorded stagenet blocks on each backend, committed as
  a reference.
- **The last four required test ids**, which the crash runs bring.

### Later core work

Deferred from the core by the feature catalogue, for a version after 0.10.0:

- **D1. Unfinalized blocks in the database:** storing the tip, with rollbacks and queries that choose the latest or
  the finalized data.
- **D2. Tip queries:** for example a quick, not yet final, confirmation that a transaction is in a block. It needs D1
  or a core endpoint over the in-memory best-block queue.
- **D3. A raw block archive** in the database, so a full node is not needed for every block.

### Feature modules

The features planned on top of the core, from the owner's catalogue of 2026-10-22. Each is a module (or a public and a
private module) built on the items the core modules provide ("Builds on"), and each gets its own specification and
pull request before it is built: the catalogue fixes what each needs from the core, not how it is built. Priority is
the catalogue's, where it sets one.

| ID | Feature | Side | What it gives | Builds on | Priority |
|---|---|---|---|---|---|
| F1 | Public API, wallets | Public | The official indexer's wallet operations: `block`, `transactions`, and the `blocks`, `unshieldedTransactions`, `zswapLedgerEvents` and `dustLedgerEvents` subscriptions | `blocks`, `chain-events`, `block-parsed`, `tx-results`, `segment-results`, `ledger-events` | P1 |
| F2 | Public API, dApps | Public | The official indexer's contract operations: `contractAction`, `contract`, `contractZswapState`, and the `contractActions` and `contractEvents` subscriptions | F1's items, `contract-states`, `contract-logs`, retained ledger states (`retainStates`) | — |
| F3 | Public API, SPO | Public | The stake-pool operator data a Midnight node can serve | `blocks`, `chain-events`, node runtime calls | — |
| F4 | Token metadata (MIP-0018) | Public | Token metadata from MIP-0018 events: the latest value per contract, token and key | `contract-logs` | P1 |
| F5 | Unshielded token state (MIP-0014, NIGHT) | Public | Balances of NIGHT and MIP-0014 unshielded tokens | `block-parsed`, `segment-results` | — |
| F6 | Shielded token state (MIP-0011), MIP-0006 data | Public and private | Public data on MIP-0011 shielded tokens and what MIP-0006 atomic swaps need on chain | `ledger-events`; F9's items on the private side | — |
| F7 | Fast DUST sync | Public and private | A usable DUST state for a wallet quickly: a keyless public mirror of the DUST trees, the key's work in a private process | `ledger-events`, the ledger states (DUST tree indices and roots) | P2 |
| F8 | Fast shielded sync | Private, public mirror | Shielded wallet sync, client-side by default, server-assisted as the fast option | `ledger-events`, the ledger states (zswap first-free index and root) | P2 |
| F9 | Private wallet data | Private | What a viewing key finds in public data, kept in a private database; 0.9.5's TransactionHistory, unexported under `legacy/`, is its starting point | `ledger-events`, `tx-results`, `segment-results`, F12's values | — |
| F10 | JSON-RPC for Passport | Private, in a TEE | Token balances for a viewing key: NIGHT, DUST, MIP-0011, MIP-0014, with MIP-0018 metadata | F4, F5, F7, F9 | P3 |
| F11 | Explorer | Public | Browsable blocks, transactions, chain events and contract logs, on a server or in the browser build | `blocks`, `block-parsed`, `chain-events`, `contract-logs` | — |
| F12 | User secrets (`user-secrets`) | Private | The private values private modules need (viewing keys and others), kept only in the private database | The private process; no core item | — |

### Also next

- **Publication on npm.** Until then each version's package is attached to its GitHub release, and UmbraDB can be
  built from the repository ([Building from source](docs/building-from-source.md)).
- **Open issues** are tracked in [`docs/issues/`](docs/issues/) and, once approved, on GitHub.

## Non-goals

- **No unfinalized data in 0.10.0.** No tip in the database, no tip queries, no rollback of stored data; D1 and D2
  above may add them later.
- **No other data source** than the Midnight node. In 0.10.0 there is no raw block archive either: the node serves
  every block and its state (D3 above).
- **No security boundary against modules.** Modules and configuration files are trusted code.
- **No migration of 0.9.5 databases.** The indexer always starts a new database.
- **Not a distributed store.** One writer per database, held by the writer lock.
