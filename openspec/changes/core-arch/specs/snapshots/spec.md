# Spec delta — `snapshots` capability

EARS forms and terms as in `specs/runner/spec.md` and `specs/determinism/spec.md`. A **snapshot** is a file holding a
public database's contents at one committed height, with its manifest.

## ADDED Requirements

### Requirement: SN-1 Export

THE system SHALL export a snapshot with `umbradb snapshot export --out <file>` while the process runs, and
automatically right after the core's `on-stop-height` WHERE `snapshotAtStop` is set and no snapshot for that height
exists yet; the export SHALL read one committed height through one consistent read (on PGlite one queued job, so
commits wait).

#### Scenario: Export while syncing
- **WHEN** a snapshot is exported while blocks keep committing
- **THEN** every table in it reflects the same height, the one in its manifest

### Requirement: SN-2 The file format

THE snapshot file SHALL be a CBOR sequence (RFC 8742) of canonical CBOR items: first the manifest — a map with
`format` (1), `genesisHash`, `start` (S), `height`, `blockHash`, `stateRoot` (or null), `history` (every
`core_chain.config` row), `migrations` (every `core_chain.migrations` row) and `contentsHash` — then, for each public
table in contents-hash order, the item `[schema, table, [column names], [column types], row count]` followed by that
many row encodings in primary-key order; the contents hash SHALL be computed from the same encodings (DT-3).

#### Scenario: Two stopped instances
- **WHEN** two instances with the same configuration history stop at the same height with `snapshotAtStop` set, one on
  PostgreSQL and one on PGlite
- **THEN** their snapshots' contents hashes are equal

### Requirement: SN-3 Import into an empty database

THE system SHALL import a snapshot with `umbradb snapshot import <file>` into an empty database only, and SHALL refuse
IF the format version is unknown; the configuration's history differs from the snapshot's up to its height (versions
included); the build does not carry the versions of the revisions covering height + 1 or every recorded migration (same
ids and checksums); the contents hash does not match (a table declared `deterministic: false` is carried with its rows
but hashed by name only, DT-3, Q76); the genesis hash differs from the node's; the snapshot's block is
not finalized on the node with the same hash; or, WHERE `core-ledger-state` is in the history, its state root differs
from the node's at that height.

#### Scenario: A tampered snapshot
- **WHEN** one row byte of a snapshot file is changed
- **THEN** import refuses with `contents-hash-mismatch` and the database stays empty

### Requirement: SN-4 Import is all or nothing

THE import SHALL run in the empty target database itself, without staging schemas: it SHALL first write an import
marker, then create every schema by running the recorded migrations unchanged, check that each table's columns and
types equal the file's, load the rows, and, in one final transaction, write the chain identity and remove the marker;
the database SHALL count as restored only after that transaction. IF a process starts and finds an import marker THEN
it SHALL drop every schema the import created and refuse with `snapshot-import-interrupted`, leaving the database empty
for a new import. THE restored database SHALL keep the snapshot's S and resume from its height + 1.

#### Scenario: An import killed half-way
- **WHEN** the import is killed while loading rows
- **THEN** the next start finds the marker, empties the database, and refuses with `snapshot-import-interrupted`; a
  new import then succeeds

### Requirement: SN-5 A restored database continues like one that never stopped

WHEN a snapshot taken at h is imported and the process continues to h + 100, THE database SHALL have the same contents
hash as an instance that synced to h + 100 without stopping, on either backend.

#### Scenario: Restore on the other backend
- **WHEN** a snapshot exported on PostgreSQL at h is imported on PGlite and both continue to h + 100
- **THEN** the two contents hashes at h + 100 are equal
