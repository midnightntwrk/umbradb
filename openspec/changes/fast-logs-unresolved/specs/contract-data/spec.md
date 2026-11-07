# Spec delta — `contract-data` capability

Modifies `core-arch`'s `specs/contract-data/spec.md`. EARS forms and terms as in `core-arch`'s `specs/runner/spec.md`.
A **log site** is a `log` op of an applied part of a transaction, in the ledger's execution order; an **unresolved
site** is one whose logged value the transcript does not show (`not-a-literal`, `conditional`) or that belongs to a
partially successful transaction (`partial-transaction`).

## MODIFIED Requirements

### Requirement: CC-3 `core-contract-logs-fast` stores the logs it can read, and records the rest as unresolved

WHERE `core-contract-logs-fast` is enabled (development only), it SHALL read log sites from the transcripts in a ledger
task without state (LG-17), number every site of the block from 0 in execution order, store each literal site of a fully
successful transaction as a log decoded by `decodeLogItem`, and record every unresolved site, with its reason, in
`contract_logs.unresolved` instead of halting. It SHALL store exactly `-full`'s rows on every block without an
unresolved site. It MAY start mid-chain.

#### Scenario: Fast equals full without unresolved sites
- **WHEN** a range whose logs are all literals of fully successful transactions is processed once with `-full` and
  once with `-fast`
- **THEN** both `contract_logs.logs` tables are identical, and `contract_logs.unresolved` is empty

#### Scenario: A computed log value
- **WHEN** a contract emits a value read from its state
- **THEN** the block commits, no log is stored for that site, and `contract_logs.unresolved` holds the site with reason
  `not-a-literal`, its transaction, `log_index`, contract and entry point

#### Scenario: A partially successful transaction
- **WHEN** a partially successful transaction has two literal log sites
- **THEN** both are recorded unresolved with reason `partial-transaction`, and the block's later logs keep the
  `log_index` their site order gives

## ADDED Requirements

### Requirement: CC-5 Unresolved sites are part of the contract-logs item

THE shared item `contract-logs` SHALL carry, beside each block's logs, the block's unresolved sites in `log_index`
order, and its schema SHALL hold `contract_logs.unresolved (height, tx_index, log_index)`, append-only and
range-partitioned by height, created by the item's migration `002` (DB-8, DB-9). `core-contract-logs-full` SHALL never
write to it.

#### Scenario: A consumer reads both
- **WHEN** a module requiring `contract-logs` reads a block's item at `on-compute`
- **THEN** it sees the block's logs and its unresolved sites, each with its `log_index`
