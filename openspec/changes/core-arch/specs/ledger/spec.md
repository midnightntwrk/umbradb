# Spec delta — `ledger` capability

EARS forms and terms as in `specs/runner/spec.md`. The **ledger** is Midnight's transaction and state logic
(`midnight-ledger`), in major versions v8, v9 and v10; a **ledger package** is the WASM build of one version. A runtime
upgrade is enacted (`set_code`) in block **U**; **F** = U + 1 is the first block built by the new runtime. The **ledger
state** is a tree of content-addressed **ledger nodes**; its **state key** is its root node's key, and the **state
root** the node reports (`midnight_ledgerStateRoot`) must equal a replay's.

## ADDED Requirements

### Requirement: LG-1 Each block's ledger version comes from its `MNSV` digest

THE system SHALL look up the `spec_version` in each block's `MNSV` consensus digest in the ledger version table, a list
of rows `{ specVersionMin, specVersionMax, ledger }` with inclusive bounds. IF a block has no `MNSV` digest or more than
one (`bad-version-digest`), or its `spec_version` matches no row or two rows, THEN processing SHALL halt. THE node's
`midnight_ledgerVersion` SHALL NOT be used.

#### Scenario: An unknown runtime
- **WHEN** a block carries `spec_version` 3_000_000 and no row covers it
- **THEN** processing halts with `unknown-runtime` and the block

### Requirement: LG-2 Height pins check the table

THE ledger version table MAY hold pins `{ height, hash, specVersion }`, each naming a first block F; IF the block at a
pinned height has another hash or another `MNSV` version THEN processing SHALL halt. Rows alone SHALL choose the ledger.

#### Scenario: The mainnet 1.0 pin
- **WHEN** mainnet block 1,774,492 is processed with the built-in table
- **THEN** its hash is `0x3802…1a0b`, its `MNSV` is 1_000_000, and the pin passes

### Requirement: LG-3 Built-in tables per network

THE system SHALL ship, as a versioned data file, one ledger version table per known network keyed by genesis hash —
`spec_version` 22_000–22_999 and 1_000_000–1_999_999 → v8; 2_000_000–2_000_999 → v9 as runtime 2.0 built it
(`ledger-9.1.0.0-rc.3`, a package of its own, owner decision Q139); 2_001_000–2_999_999 → v9 (`ledger-9.1.0.0-rc.5`)
— with the mainnet pin at F = 1,774,492 (hash `0x380266656e11208adbcaa5ab62a6beb9c09ef86de1cb886eac721099177a1a0b`),
and with every other network's genesis hash, runtime at genesis and upgrade boundaries (hash and `MNSV` of U and F)
read from that network's node before they become pins; a boundary not read that way SHALL NOT be a pin. THE `core`
entry's `ledgerTable` MAY add or replace rows and pins; a network not in the file SHALL set its own table.

#### Scenario: An undeployed network
- **WHEN** a devnet's configuration sets "every `spec_version` → v8"
- **THEN** every block is parsed with ledger v8

### Requirement: LG-4 Block content is decoded with its parent state's runtime

THE system SHALL decode a block's extrinsics and events with the metadata of the runtime in its parent's state —
`state_getMetadata` at the parent hash (block 0: at block 0) — and SHALL halt (`metadata-mismatch`) IF that runtime's
`spec_version` (`state_getRuntimeVersion` at the same hash) differs from the block's `MNSV` version. Metadata SHALL be
cached by `spec_version`. Reads of a block's own state SHALL use the runtime in that state.

#### Scenario: The enactment block
- **WHEN** block U enacts a runtime upgrade
- **THEN** U is decoded with the old metadata (from U − 1) and F = U + 1 with the new (from U), and the cache never
  stores the new metadata under the old `spec_version`

### Requirement: LG-5 Ledger packages are vendored or released, and identified

THE system SHALL load each ledger version from a vendored build or a released package, chosen per version by the
`core` entry's `ledgerSources` (default vendored), and SHALL record each package's name, version and SHA-256 in the
core version (CF-2). Every vendored build SHALL be reproducible from a pinned upstream source commit and the patches
kept in this repository, by a build script in this repository; every patch SHALL be listed, with what it adds, in
`vendor/ledger/README.md`, and dropped when upstream releases it (proposing the patches upstream is outside this
change: the owner does it once `midnight-ledger` is stable, owner decision Q56). IF a loaded package's SHA-256 differs
from the recorded one THEN startup SHALL refuse.

#### Scenario: Rebuilding the vendored v9 package
- **WHEN** the build script runs twice from the pinned source and patches
- **THEN** both builds have the SHA-256 recorded in the repository

### Requirement: LG-6 One adapter interface per ledger version

THE system SHALL wrap every ledger version in an adapter with the `LedgerPackage` interface of `design.md` §5.1 —
including `versionName` and `rawPackages()` — so that the ledger worker and ledger tasks use every version the same way.

#### Scenario: Two versions, one call
- **WHEN** the adapter test suite calls `stateRoot` on a v8 state and on a v9 state
- **THEN** both calls go through the same interface and return each state's root

### Requirement: LG-7 Each block is parsed once, in the ledger worker

THE system SHALL parse each block once, in the ledger worker, with its version's package; the native parsed objects
SHALL stay in the worker (owner decision Q49), and the `block` item `block-parsed` SHALL reach modules as the plain data
of `design.md` §5.1 (per transaction: index, hash, kind, size, raw bytes, and per segment its contract calls and
deploys). There SHALL be no version-neutral model beyond that plain data.

#### Scenario: No second parse
- **WHEN** three modules and two ledger tasks read a block's transactions in one block
- **THEN** the package's parse function was called once per transaction

### Requirement: LG-8 The replay rules are reproduced

WHEN a block built by runtime 0.22, by runtime 1.0 below 1.0.300 (`spec_version` < 1_000_300) or by runtime 2.0 is
applied, THE system SHALL accept its first regular transaction to apply, and any failed regular transactions before
it, if well formed at the block time or at the parent block's timestamp + 12,000 ms; every other transaction, and every
transaction of runtimes ≥ 1.0.300 and 2.1, SHALL be checked at the block time only; state changes SHALL use the block
time; block 0 SHALL be excluded. Block fullness SHALL add each transaction's stateless cost only for successful and
partially successful transactions.

#### Scenario: Mainnet block 1,788,980
- **WHEN** a mainnet range including block 1,788,980 is replayed
- **THEN** its first ledger transaction is accepted and the root matches the node's

### Requirement: LG-9 The v8→v9 conversion runs before F

WHEN the first block F built by a v9 runtime after v8 blocks is processed, `core-ledger-state` SHALL convert the
state from v8 to v9 in its `on-compute`, before applying F, with the conversion built from the ledger team's conversion
crate and shipped with the vendored ledger; the conversion resets DUST state, which later blocks rebuild.

#### Scenario: A fork block with no transactions
- **WHEN** F contains no transactions
- **THEN** the conversion still runs, and the root at F matches the node's

### Requirement: LG-10 Ledger work runs in a worker thread

THE system SHALL run ledger parsing, applying, state loading and ledger tasks in a worker thread (Node.js
`worker_threads`; a Web Worker in the browser), so that the runner and the admin endpoints stay responsive during long
ledger steps and the ledger can read stored nodes synchronously from a database owned by another thread (`design.md`
§5.3).

#### Scenario: A long conversion
- **WHEN** the v8→v9 conversion takes 60 s
- **THEN** `/health/live` answers 200 throughout

### Requirement: LG-11 The ledger state lives in the database

THE system SHALL store the ledger state only in `core_ledger_state`, on the ledger's storage contract with the node's
`layout-v2` layout: each ledger node as its key, `data` and `children` (the ledger's serialization of its child list,
references and embedded children included); and root counts per key. Per block, `core-ledger-state` SHALL write the
ledger's flushed batch (inserted nodes, changed root counts) with the block's row of `core_ledger_state.states` in the
block's `on-db-write`, and persist the state after the block. Whole serialized states SHALL NOT be stored. Reads SHALL
check each node's hash against its key. WHEN the process restarts THE ledger worker SHALL load the state at the cursor
from its state key and the stored nodes. THE flushed batch SHALL carry each changed root count as a signed change,
which the writer adds to the stored count, deleting a count that reaches 0 (owner decision Q53).

#### Scenario: Restart from the database alone
- **WHEN** the process is killed and restarted at cursor h
- **THEN** the state loaded from the database has the root stored for h, and the next block's root matches the node's

### Requirement: LG-12 The retention window

THE system SHALL keep the latest state and the `retainStates` states before it alive (a data field of the `core`
entry, default 0): when block h commits, the state of h − `retainStates` − 1 SHALL be released; a revision that raises
it SHALL fill the window from its start, and one that lowers it SHALL release the states leaving the window in its first
block. `core-ledger-state` SHALL offer modules a function that loads the state at a height inside the window, and fail
with `state-not-retained` outside it.

#### Scenario: A state just outside the window
- **WHEN** `retainStates` is 1,000, the cursor is 5,000, and a module loads the state at 3,999
- **THEN** the call fails with `state-not-retained`; at 4,000 it succeeds

### Requirement: LG-13 Contract states stay alive

THE system SHALL persist every contract state key and zswap-state key that `core-contract-states` stores, and SHALL
never release them.

#### Scenario: An old contract state survives the sweep
- **WHEN** a contract's state stored at height 10 has not changed for 10,000 blocks and many sweep cycles completed
- **THEN** that state still loads from its stored key

### Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep

THE system SHALL reclaim unused ledger nodes with the algorithm of the ledger's `gc-v1`, run over `core_ledger_state`
with a budget of K = 10,000 node units per block (a constant of the UmbraDB version), computed in `on-compute` and
written in `on-db-write`, in this order each block: (1) when no cycle runs, every key with a positive root count becomes
grey and the phase becomes `mark`; (2) every key whose root count rose in this block and is neither marked nor grey
becomes grey; (3) while budget remains and the grey set is not empty, the smallest grey keys (byte order) up to the
remaining budget are visited — each removed from the grey set, marked, one unit spent, and its referenced keys not yet
marked or grey added to the grey set; a grey key with no stored node is marked and adds nothing; (4) only when the grey
set is empty, stored nodes after the sweep position are scanned in key order, one unit each, unmarked ones deleted, and
the position moved; (5) when the scan passes the last node, the marks and position are cleared and the phase becomes
`idle`. Nodes the sweep deletes SHALL be evicted from the worker's caches; IF the ledger package still refuses an
eviction after the worker freed every object it can, THEN THE system SHALL end the worker thread and start a new one,
which loads the state at h − 1 from the database and applies block h again, without halting — only a refusal on that
retry SHALL fail the block, with `callback-error` (owner decision Q144). WHERE the `core` entry sets `sweep: off`
(development only), no node SHALL be deleted.

#### Scenario: Same deletions on two machines
- **WHEN** the same chain is synced on PostgreSQL and on PGlite
- **THEN** after every block the set of stored ledger nodes is identical

#### Scenario: Reused content after a deletion
- **WHEN** a node deleted by the sweep at block h1 is needed again by the state at h2
- **THEN** the ledger inserts it again at h2, and loading the state at h2 succeeds

### Requirement: LG-15 Every state root is checked

WHEN a block is applied, THE system SHALL compare the state root after it with the node's `midnight_ledgerStateRoot`
at that block and SHALL halt (`root-mismatch`) on any difference; proofs SHALL NOT be re-verified.

#### Scenario: A wrong replay
- **WHEN** a test ledger package returns a wrong root for one block
- **THEN** processing halts with `root-mismatch` and that height, and nothing of the block is stored

### Requirement: LG-16 What `core-ledger-state` provides

WHERE `core-ledger-state` is enabled, it SHALL provide the `block` and `table` items `ledger-state` (mutable),
`ledger-events`, `segment-results` and `vm-logs` (the `ContractLog` events of applied segments, numbered per block in
emission order); store per block the state key, state root, zswap first-free index and root, and DUST commitment and
generation first-free indexes and roots (`core_ledger_state.states`; each read from the ledger state as the official
indexer reads it, through a vendored patch, none of them null — owner decision Q138); store each segment's success
(`core_ledger_state.segment_results`) and each ledger event other than logs with its kind, segments, bytes and the
extracted nullifier, commitment, tree index and contract address (`core_ledger_state.events`). It SHALL NOT start
mid-chain: it needs history from genesis or a backup (BK-3).

#### Scenario: A partially successful transaction
- **WHEN** a transaction's guaranteed segment succeeds and one fallible segment fails
- **THEN** `segment_results` records the guaranteed segment as successful and that fallible segment as failed

### Requirement: LG-17 Ledger tasks give modules the native objects

WHERE a module needs more than the plain data of `block-parsed`, it SHALL declare ledger tasks (`ledgerTasks` in its
declaration, `design.md` §5.5): functions the ledger worker runs for each block, after parsing and before the block's
`on-compute`, with the block's native parsed objects and `rawPackages()`, each returning plain data that becomes a
`block` item the module provides. A task that declares `needsState: true` SHALL also receive the ledger state before the
block (read-only), and its module SHALL require the item `ledger-state` (so the graph of MD-3 refuses it where
`core-ledger-state` is not active); a task without it SHALL receive no state and MAY run mid-chain. A task's result
SHALL be structured-cloneable plain data; IF it is not, or the task throws, THEN the block SHALL fail as a callback
error (RN-8). Ledger tasks SHALL NOT write anything and SHALL NOT keep native objects between blocks. Callbacks on the
main thread SHALL never receive a native ledger object.

#### Scenario: A module reads decoded call arguments
- **WHEN** a module's ledger task decodes each contract call's arguments with the native objects and returns them
- **THEN** the module's `on-compute` receives them as its `block` item, and the package parsed each transaction once

#### Scenario: A task returns a native object
- **WHEN** a ledger task returns a WASM-backed object
- **THEN** the block fails with `callback-error`, naming the module and the task
