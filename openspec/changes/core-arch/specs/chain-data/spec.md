# Spec delta — `chain-data` capability

EARS forms and terms as in `specs/runner/spec.md`. This capability covers the backbone parts that identify the chain
and fetch and commit blocks, and the core modules that store chain events, parsed transactions and their results.
Core modules are off by default and run only when configured. Every table has the primary key and columns of
`design.md` §10; every column is `NOT NULL` unless marked null; per-block tables are append-only and partitioned by
height range.

## ADDED Requirements

### Requirement: CD-1 `core-chain` records the chain's identity

THE backbone part `core-chain` SHALL provide the `process` items `config`, `node-client`, `db` and `ledger-table`, and
SHALL store `core_chain.identity` (one row: genesis hash, S, anchor hash — null until block S commits) in addition to
the configuration history (CF-6, CF-7).

#### Scenario: Identity after the first block
- **WHEN** block S commits on an empty database
- **THEN** `core_chain.identity` holds the node's genesis hash, S and the anchor hash of block S

### Requirement: CD-2 `core-block-fetch` is the node-backed block source

THE backbone part `core-block-fetch` SHALL implement the block source of RN-14 over the node (IN-4 to IN-6) and SHALL
publish, per block, the `block` items `block-header`, `block-body`, `runtime-metadata` and `ledger-version`, decoding
the block's content with the metadata of the runtime in its parent's state (LG-4).

#### Scenario: Items available to later points
- **WHEN** a module requiring `block-body` runs `on-parse` at h
- **THEN** it reads h's extrinsics as fetched by `core-block-fetch`

### Requirement: CD-3 `core-block-commit` writes the cursor first

THE backbone part `core-block-commit` SHALL run first in every block's `on-db-write` and SHALL write the row of
`core_block_commit.blocks` for h — hash (indexed; distinct per height by the parent-hash chain of IN-4, so no
cross-partition unique constraint is needed), parent hash, `spec_version`, ledger version and the block's own
timestamp in milliseconds — which is also the cursor; it SHALL provide the `table` item `blocks` (append-only).

#### Scenario: The cursor is the last blocks row
- **WHEN** heights 1–10 have committed
- **THEN** `core_block_commit.blocks` holds exactly 10 rows and the cursor is the row of height 10

### Requirement: CD-4 `core-chain-events` stores every runtime event

WHERE `core-chain-events` is enabled, it SHALL read `System::Events` at each block (`state_getStorage`), decode them
with the block's content metadata, publish them as the `block` item `chain-events`, and store one row per event in
`core_chain_events.events` with its phase, extrinsic index, pallet, name, SCALE bytes and decoded fields (canonical
JSON). It MAY start mid-chain.

#### Scenario: A runtime upgrade block
- **WHEN** the enactment block U of a runtime upgrade is processed
- **THEN** its events are decoded with the old runtime's metadata and stored without error

### Requirement: CD-5 `core-block-parsed` parses each block once

WHERE `core-block-parsed` is enabled, it SHALL have each block's transactions parsed once in the ledger worker, with
the ledger package of the block's ledger version (LG-1, LG-7), publish their plain data as the `block` item
`block-parsed`, and store one row per
transaction in `core_block_parsed.transactions` (hash, kind `regular` or `system`, size). It SHALL number transactions
within a block in the order the ledger applies them — the order of their chain events (`TxApplied`,
`TxPartialSuccess` or `ExtrinsicFailed` for regular transactions, `SystemTransactionApplied` for system transactions),
from 0 — and, for block 0, in body order (IN-7). It MAY start mid-chain.

#### Scenario: A system transaction between regular ones
- **WHEN** a block holds regular transaction R1, then a system transaction applied by the runtime, then R2
- **THEN** they are stored as 0 = R1, 1 = system, 2 = R2

### Requirement: CD-6 `core-tx-results` stores outcomes from the chain events

WHERE `core-tx-results` is enabled, it SHALL store, per transaction, `success`, `partial` or `failure` from its chain
events in `core_tx_results.results` and publish them as the `block` item `tx-results`. It MAY start mid-chain.

#### Scenario: A partially successful transaction
- **WHEN** a transaction's event is `TxPartialSuccess`
- **THEN** its outcome is `partial`
