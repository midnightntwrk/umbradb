# Spec delta — `backups` capability

Modifies `core-arch`'s `specs/backups/spec.md` (`ledger-refcount` `design.md` §0: `core-arch` is archived first, then
`start-umbradb`, which modifies BK-1 only, then this change). EARS forms and terms as in `core-arch`'s
`specs/runner/spec.md`. The requirement is restated in full; the change is the restore's contents-hash step for the
content-defined tables of `core-ledger-state` (DT-3 as this change modifies it; `design.md` §2.5).

## MODIFIED Requirements

### Requirement: BK-3 Restore into an empty database, checked before and after loading

THE system SHALL restore a backup with `umbradb restore <file>` into an empty database only. Before loading anything it
SHALL refuse IF the target is not empty (`restore-target-not-empty`); the manifest's format is unknown
(`backup-format-unknown`); the configuration's history differs from the manifest's up to its height, versions included
(`backup-history-mismatch`); the build does not carry the versions of the revisions covering height + 1 or every
recorded migration with the same ids and checksums (`backup-build-mismatch`); the genesis hash differs from the node's
(`backup-genesis-mismatch`); or the manifest's block is not finalized on the node with the same hash
(`backup-block-not-finalized`). It SHALL then, in one transaction on the writer connection, run the file's SQL itself,
give every schema, table, sequence and function the owner and grants DB-6 and DB-7 require (creating the module roles if
the server lacks them), recompute the contents hash and compare it with the manifest's (`contents-hash-mismatch`) —
the content-defined tables of `core-ledger-state` taking part by their content, so that a row of them whose key does not
match its content, or counts and a queue that do not match its rows, refuses with `ledger-refcount-invalid` (DT-3) —
and, WHERE `core-ledger-state` is in the history, compare the stored state root at the manifest's height with the
node's (`backup-root-mismatch`); any failure SHALL roll the whole restore back, leaving the target empty. WHERE the
backup is a private process's (PP-12), THE checks against the node SHALL be made against the configured public database
instead: the binding the backup records (PP-2: the public genesis hash and S) SHALL be the public database's, else the
restore refuses with `private-binding-mismatch` and the binding's `details.reason`, and the manifest's block SHALL be
the public database's committed block at that height (`backup-block-not-finalized`) (owner decision Q153). Because a
restore runs the file's SQL with the writer's rights, THE operator documentation SHALL say to restore only backups from
a trusted source.

#### Scenario: A changed row
- **WHEN** one value in a backup file's `INSERT` statements is changed, in a row the contents hash covers byte by byte
  (DT-3: not in `public` or PostgreSQL's own schemas, nor in a table declared `deterministic: false`, nor in a
  content-defined table)
- **THEN** restore refuses with `contents-hash-mismatch` and the target stays empty

#### Scenario: A changed ledger node row
- **WHEN** one byte of a `core_ledger_state.nodes` row's payload or child list in a backup file is changed
- **THEN** restore refuses with `ledger-refcount-invalid` and the target stays empty

#### Scenario: The same node, spelled the other way
- **WHEN** a backup file's `core_ledger_state.nodes` row holds a node's child list with a small child referenced where
  the backed-up database embedded it (same key, the referenced child's row and the counts and queue present and
  consistent)
- **THEN** the contents hash equals the manifest's, since the node set is the same, and the restore goes on to its
  state-root check
