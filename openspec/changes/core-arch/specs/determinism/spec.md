# Spec delta — `determinism` capability

EARS forms and terms as in `specs/runner/spec.md`. The public database must be a pure function of the chain, S and the
configuration history (entries, their data fields and versions); this capability provides the encoding and hashes that
let two machines check it.

## ADDED Requirements

### Requirement: DT-1 One canonical row encoding

THE system SHALL encode a row as a CBOR array of its column values in column order, using RFC 8949 §4.2.1 core
deterministic encoding: `smallint`/`int`/`bigint` → CBOR integer; `numeric` → text string in canonical form (an optional
`-`, then digits without leading zeros, `0` for zero, no `+`, fraction or exponent); `bytea` → byte string; `text` →
text string; `boolean` → `true`/`false`; arrays → arrays; `jsonb` → the JSON value as CBOR with map keys sorted by
their encoded bytes; `null` → `null`. IF a `numeric` value's text has a fraction, a zero fraction such as `100.00`
included (owner decision Q57), or a `jsonb` value contains a number that is not an integer within 64 bits THEN the
encoding SHALL fail. THE encoder SHALL be written in this repository for exactly
this subset (no CBOR dependency).

#### Scenario: RFC test vectors
- **WHEN** the encoder encodes the integer, text, byte-string, array and map examples of RFC 8949 Appendix A that fall
  in this subset
- **THEN** each output equals the RFC's bytes

#### Scenario: Map key order
- **WHEN** a `jsonb` value `{"b": 1, "a": 2, "aa": 3}` is encoded
- **THEN** the keys are emitted in the order `a`, `b`, `aa` (shorter encoded key first, then bytewise)

### Requirement: DT-2 Primary-key order

THE system SHALL order rows by their primary-key columns in order, comparing integers numerically and `bytea` and
`text` by their bytes (`COLLATE "C"`).

#### Scenario: Text keys with mixed case
- **WHEN** a table with a `text` primary key holds `"b"`, `"B"`, `"a"`
- **THEN** the order is `"B"`, `"a"`, `"b"` on both PostgreSQL and PGlite

### Requirement: DT-3 The contents hash

THE system SHALL compute a database's contents hash as SHA-256 of one canonical CBOR array holding, for each public
schema and then each table in name order (byte order), the array `[schema, table, [column names], [rows in primary-key
order]]`.

#### Scenario: Same data, two backends
- **WHEN** the same rows are written to PostgreSQL and to PGlite
- **THEN** the two contents hashes are equal, and changing one byte of one row changes the hash

### Requirement: DT-4 Per-block digests for modules that opt in

WHERE a module sets `digest: true`, THE database API SHALL capture, for every row of that module's schema whose primary
key was written at height h — by any statement, including helper triggers and provider functions — the row at the end
of h − 1 and the row at the end of h, and SHALL record one change per primary key: `["insert", table, new row]`
(absent before), `["delete", table, old row]` (absent after) or `["update", table, new row]` (present and different).
Several writes to one row in a block SHALL give one change; a write that leaves a row as it was SHALL give none.
`changes at h` SHALL be the canonical CBOR array of the changes, ordered by table name and then primary key.

#### Scenario: Insert then update in one block
- **WHEN** a module inserts row k and then updates it in the same `on-db-write`
- **THEN** the changes at h contain exactly one `insert` of k with its final values

#### Scenario: Rewriting the same value
- **WHEN** a module updates row k to the values it already had
- **THEN** the changes at h contain nothing for k

### Requirement: DT-5 The `core-digest` part chains the digests

THE backbone part `core-digest` SHALL run last in `on-db-write` and SHALL write, for each opted-in module active at h,
the row `(h, module, digest)` of `core_digest.digests`, where `digest(start) = SHA-256(32 zero bytes ‖ changes at
start)` and `digest(h) = SHA-256(digest(h − 1) ‖ changes at h)` for every later height, including heights with no
changes.

#### Scenario: Two runs, one difference
- **WHEN** two databases are built from the same blocks, except that one test module writes a different value at
  height 7
- **THEN** their digests for that module are equal up to height 6 and differ from height 7 on

### Requirement: DT-6 Stored data avoids non-deterministic values

THE database API SHALL refuse, at migration time, a public module table that uses a sequence, serial or identity column,
a floating-point column, or a column whose default is a wall-clock or random function, naming the module, the table and
the column. THE database API SHALL add to every `jsonb` column of a public module table a `CHECK` constraint that
rejects any JSON number that is not an integer within the signed 64-bit range or whose text has a fraction, a zero
fraction such as `1.0` included (owner decision Q57: no stored number carries a scale, so equal contents hashes mean
equal query results), so such a write fails whether or not the module opts into digests. Values a module computes from
anything other than the chain, S and the configuration (wall-clock time, randomness, process state) are a module
developer's error the database cannot see; they are caught by the convergence tests (two runs, two backends, restarts)
and by digests.

#### Scenario: A serial column
- **WHEN** a test module's migration creates a table with a `serial` column
- **THEN** startup refuses with `non-deterministic-column`, the module, the table and the column

#### Scenario: A fractional JSON number
- **WHEN** a module without `digest` writes `{"x": 1.5}` to a `jsonb` column in `on-db-write`
- **THEN** the write fails the `CHECK` and the block rolls back

#### Scenario: A JSON number with a zero fraction
- **WHEN** a module writes `{"x": 1.0}` to a `jsonb` column in `on-db-write`
- **THEN** the write fails the `CHECK` and the block rolls back
