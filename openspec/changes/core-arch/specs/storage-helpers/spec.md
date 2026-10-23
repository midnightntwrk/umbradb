# Spec delta — `storage-helpers` capability

EARS forms and terms as in `specs/runner/spec.md`. Storage helpers are library functions, not modules: they create
tables inside the calling module's own schema, and their tables are written only from that module's `on-db-write`, so
stopping, digests and dropping work per module.

## ADDED Requirements

### Requirement: SH-1 The cursor table (from 0.9.5's Watermarks)

THE system SHALL provide a cursor-table helper that creates, in the calling module's schema, a table with one row per
key, `key text` → `value jsonb` (canonical), where the last write of a key wins; it SHALL be written only through the
module's block write handle.

#### Scenario: Last write wins
- **WHEN** a module writes key `k` = 1 at height 5 and `k` = 2 at height 6
- **THEN** reading `k` at height 6 or later returns 2

### Requirement: SH-2 The height-versioned table (from 0.9.5's TemporalKV)

THE system SHALL provide a height-versioned-table helper that creates, in the calling module's schema, a current table
and a history table filled by a trigger, where a version of key k covers the half-open height range `[from, to)` and
the current version has `to` null; writing k at height h SHALL close the current version at h and insert a new one
from h; deleting k at h SHALL close it at h without a new one; writing the value k already has SHALL add no version.

#### Scenario: Reading as of a height
- **WHEN** k is written with value A at 10, value B at 20, and deleted at 30
- **THEN** reading k at 9 returns nothing, at 10–19 returns A, at 20–29 returns B, and at 30 or later returns nothing

### Requirement: SH-3 One write per key per block

IF a module writes the same key of a height-versioned table twice in one block THEN THE helper SHALL fail the write,
which is a callback error (RN-8).

#### Scenario: A second write in the same block
- **WHEN** a module writes k twice in one `on-db-write`
- **THEN** the second write fails and the block rolls back
