# Spec delta — `determinism` capability

Modifies `core-arch`'s `specs/determinism/spec.md` (`ledger-refcount` `design.md` §0: `core-arch` is archived first,
then `start-umbradb`, which modifies no `determinism` requirement, then this change). EARS forms and terms as in
`core-arch`'s `specs/runner/spec.md`. Each modified requirement is restated in full; the change adds **content-defined
tables**: tables that take part in the contents hash by what they hold rather than by their bytes, and whose rows are
not captured per block (`design.md` §2.5). Only `core-ledger-state`'s `nodes`, `ref_counts` and `unreferenced` are
content-defined (LG-11).

## MODIFIED Requirements

### Requirement: DT-3 The contents hash

THE system SHALL compute a database's contents hash — the core's database or a private process's, under the same rules
(owner decision Q75) — as SHA-256 of one canonical CBOR array holding, for each schema of the database except
PostgreSQL's own (`pg_*`, `information_schema`), `public` and change capture's scratch schema `core_digest_shadow`,
whose tables are empty whenever no block is open (owner decision Q101) — module schemas and any schema an operator
created —
and then each table in name order (byte order), the array `[schema, table, [column names], [rows in primary-key
order]]`. A table whose module declared it `deterministic: false` (MD-1, owner decision Q76) SHALL appear as
`[schema, table, null, null]`: its name is hashed, its columns and rows are not. A content-defined table (LG-11) SHALL
appear by its content: `core_ledger_state.nodes` as `[schema, table, ["node_key"], [[k] for every key of its node set,
in byte order]]`, its node set being the keys of its rows and of every node embedded in them, each once, an embedded
node's key computed as the ledger computes a node's key; `core_ledger_state.ref_counts` and
`core_ledger_state.unreferenced` as `[schema, table, null, null]`, after a check in the same snapshot that they hold
exactly the reference counts and the queue that the rows of `nodes` and `root_counts` give (LG-14). IF that check fails
THEN the computation SHALL fail with `ledger-refcount-invalid`.

#### Scenario: Same data, two backends
- **WHEN** the same rows are written to PostgreSQL and to PGlite
- **THEN** the two contents hashes are equal, and changing one byte of one row changes the hash

#### Scenario: Same nodes, two spellings
- **WHEN** two databases hold the same ledger nodes, one with a small node embedded in its parent and the other with it
  referenced from the parent and stored as its own row, with the reference counts and queue each one's rows give
- **THEN** their contents hashes are equal; a database that also holds one more persisted node, with consistent
  counts and queue, has a different hash

### Requirement: DT-4 Per-block changes of every module table

THE database API SHALL capture, for every module table not declared `deterministic: false` (owner decisions Q76, Q84)
and not content-defined (LG-11), every row whose primary key was written at height h — by any statement, including
helper triggers and provider functions — as the row at the end of h − 1 and the row at the end of h, and SHALL record
one change per primary key: `["insert", new row]` (absent before), `["delete", old row]` (absent after) or
`["update", new row]` (present and different). Several writes to one row in a block SHALL give one change; a write
that leaves a row as it was SHALL give none. A table's `changes at h` SHALL be the canonical CBOR array of its changes,
ordered by primary key. A content-defined table SHALL keep the column rules of DT-6 and the `TRUNCATE` guard of DB-14.

#### Scenario: Insert then update in one block
- **WHEN** a module inserts row k and then updates it in the same `on-db-write`
- **THEN** the changes at h contain exactly one `insert` of k with its final values

#### Scenario: Rewriting the same value
- **WHEN** a module updates row k to the values it already had
- **THEN** the changes at h contain nothing for k

#### Scenario: A content-defined table is not captured
- **WHEN** block h inserts, rewrites and deletes rows of `core_ledger_state.nodes`
- **THEN** the changes at h contain nothing for `nodes`, `ref_counts` or `unreferenced`, `core_digest.tables` holds
  no row for them, and `root_counts`' changes at h are recorded as before
