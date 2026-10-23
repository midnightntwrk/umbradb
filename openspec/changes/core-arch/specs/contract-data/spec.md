# Spec delta — `contract-data` capability

EARS forms and terms as in `specs/runner/spec.md` and `specs/ledger/spec.md`. A **MIP-0002 event** is a contract log:
Compact's `emit` runs the VM `Log` operation and the ledger records `ContractLog { address, entry_point, logged_item }`,
where `logged_item` is `{ version: u32, event_type, data }` and `event_type` is one of `ShieldedSpend`,
`ShieldedReceive`, `ShieldedMint`, `ShieldedBurn`, `UnshieldedSpend`, `UnshieldedReceive`, `UnshieldedMint`,
`UnshieldedBurn`, `Paused`, `Unpaused`, `Misc`. The node discards these logs, so they exist only by running the calls.

## ADDED Requirements

### Requirement: CC-1 `core-contract-states` stores each touched contract's keys

WHERE `core-contract-states` is enabled, it SHALL store, for every contract the block touched, one row of
`core_contract_states.states` keyed by `(contract_address, height)` with the key of the contract's end-of-block state
and the key of its zswap state (its filtered view of the shielded commitment tree), both persisted (LG-13); all actions
on one contract in one block SHALL share that one row. WHEN the first block F built by a v9 runtime after v8 blocks is
processed, it SHALL write a row for every contract, with its converted keys. It SHALL NOT start mid-chain.

#### Scenario: Two calls to one contract in one block
- **WHEN** a block holds two transactions calling contract C
- **THEN** `core_contract_states.states` gains exactly one row for C at that height, with the state after both

### Requirement: CC-2 `core-contract-logs-full` stores the ledger's logs

WHERE `core-contract-logs-full` is enabled, it SHALL store every `vm-logs` entry as a row of `contract_logs.logs` keyed
by `(height, tx_index, log_index)` with the contract address, entry point, logical segment, log version, event type and
the logged value in the ledger's serialization. It SHALL NOT start mid-chain. Ledger v8 logs are not MIP-0002 events:
the v8 adapter returns none, so no v8 log is stored (owner decision Q54).

#### Scenario: A v8 log
- **WHEN** a contract call in a v8 block runs the `Log` operation
- **THEN** no row of `contract_logs.logs` is stored for it

#### Scenario: A log in a failed fallible segment
- **WHEN** a transaction's fallible segment that emitted a log fails
- **THEN** that log is not stored (the ledger did not emit it for an applied segment)

### Requirement: CC-3 `core-contract-logs-fast` stores the same logs without state, or halts

WHERE `core-contract-logs-fast` is enabled (development only), it SHALL read logs from the transcripts, in a ledger task
that does not need the state (LG-17), and SHALL store a log only when its transaction succeeded fully and the value the
`Log` operation takes is a literal pushed onto the VM stack by the transcript itself on an unconditional path to it,
decoded by the ledger package's `decodeLogItem` (a malformed wrapper becomes a version-0 `Misc` log of the whole value;
data larger than the ledger's emitted-log bound produces no log). IF a log is anything else — a log in a fallible
segment of a partially successful transaction, a value read from contract state, a value behind a `branch` — THEN it
SHALL halt. On every block it SHALL store exactly the rows `core-contract-logs-full` would, or halt. It MAY start
mid-chain.

#### Scenario: Fast equals full
- **WHEN** a range with literal logs is processed once with `-full` and once with `-fast`
- **THEN** both `contract_logs.logs` tables are identical

#### Scenario: A computed log value
- **WHEN** a contract emits a value read from its state
- **THEN** `-fast` halts with `fast-log-unsupported`, the height and the transaction

### Requirement: CC-4 One provider of contract logs at a time

THE two providers SHALL share the item `contract-logs` and its schema `contract_logs` (DB-8, MD-6): at most one SHALL
be active at any height, and one MAY stop at a height and the other start at the next, with identical migrations.

#### Scenario: Full until a snapshot, fast after it
- **WHEN** `-full` stops at h, a snapshot is taken at h, and a restored database continues with `-fast` from h + 1
- **THEN** startup accepts it and `contract_logs.logs` continues without a gap
