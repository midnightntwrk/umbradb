# Spec delta — `determinism` capability

EARS forms and terms as in `specs/runner/spec.md`. The public database must be a pure function of the chain, S and the
configuration history (entries, their data fields and versions); this capability provides the encoding and hashes that
let two machines check it.

## ADDED Requirements

### Requirement: DT-1 One canonical row encoding

THE system SHALL encode a row as a CBOR array of its column values in column order, using RFC 8949 §4.2.1 core
deterministic encoding: `smallint`/`int`/`bigint` → CBOR integer; `numeric` without a declared scale above 0 → text
string in canonical form (an optional `-`, then digits without leading zeros, `0` for zero, no `+`, fraction or
exponent); `bytea` → byte string; `text` and `varchar(n)` → text string; `uuid` → byte string of its 16 bytes; `boolean`
→ `true`/`false`; `timestamptz` → CBOR integer of microseconds since `1970-01-01T00:00:00Z` (owner decision Q74; an
`infinity` or `-infinity` value fails); arrays → arrays; `jsonb` → the JSON value as CBOR with map keys sorted by their
encoded bytes; `null` → `null`. IF a `numeric` value's text has a fraction, a zero fraction such as `100.00` included
(owner decision Q57), or a `jsonb` value contains a number that is not an integer within 64 bits THEN the encoding SHALL
fail. No other type SHALL be encoded (owner decision Q58; `design.md` §4's column-type table gives each refused type's
reason). THE encoder SHALL be written in this repository for exactly this subset (no CBOR dependency).

#### Scenario: RFC test vectors
- **WHEN** the encoder encodes the integer, text, byte-string, array and map examples of RFC 8949 Appendix A that fall
  in this subset
- **THEN** each output equals the RFC's bytes

#### Scenario: Map key order
- **WHEN** a `jsonb` value `{"b": 1, "a": 2, "aa": 3}` is encoded
- **THEN** the keys are emitted in the order `a`, `b`, `aa` (shorter encoded key first, then bytewise)

### Requirement: DT-2 Primary-key order

THE system SHALL order rows by their primary-key columns in order, comparing integers numerically, `timestamptz` by time
(Q74), `boolean` with `false` first, and `bytea`, `text`, `varchar(n)` and `uuid` by their bytes (`COLLATE "C"` for
`text` and `varchar`). A primary-key column of any other type is refused (DT-6; owner decision Q58).

#### Scenario: Text keys with mixed case
- **WHEN** a table with a `text` primary key holds `"b"`, `"B"`, `"a"`
- **THEN** the order is `"B"`, `"a"`, `"b"` on both PostgreSQL and PGlite

#### Scenario: `uuid` and `boolean` keys
- **WHEN** a table keyed by `(id uuid, shielded boolean)` holds rows
- **THEN** they are listed by the `uuid`'s bytes, then `false` before `true`, on both PostgreSQL and PGlite

### Requirement: DT-3 The contents hash

THE system SHALL compute a database's contents hash — the core's database or a private process's, under the same rules
(owner decision Q75) — as SHA-256 of one canonical CBOR array holding, for each schema of the database except
PostgreSQL's own (`pg_*`, `information_schema`) and `public` — module schemas and any schema an operator created —
and then each table in name order (byte order), the array `[schema, table, [column names], [rows in primary-key
order]]`. A table whose module declared it `deterministic: false` (MD-1, owner decision Q76) SHALL appear as
`[schema, table, null, null]`: its name is hashed, its columns and rows are not.

#### Scenario: Same data, two backends
- **WHEN** the same rows are written to PostgreSQL and to PGlite
- **THEN** the two contents hashes are equal, and changing one byte of one row changes the hash

### Requirement: DT-4 Per-block changes of every module table

THE database API SHALL capture, for every module table not declared `deterministic: false` (owner decisions Q76, Q84),
every row whose primary key was written at height h — by any statement, including helper triggers and provider
functions — as the row at the end of h − 1 and the row at the end of h, and SHALL record one change per primary key:
`["insert", new row]` (absent before), `["delete", old row]` (absent after) or `["update", new row]` (present and
different). Several writes to one row in a block SHALL give one change; a write that leaves a row as it was SHALL give
none. A table's `changes at h` SHALL be the canonical CBOR array of its changes, ordered by primary key.

#### Scenario: Insert then update in one block
- **WHEN** a module inserts row k and then updates it in the same `on-db-write`
- **THEN** the changes at h contain exactly one `insert` of k with its final values

#### Scenario: Rewriting the same value
- **WHEN** a module updates row k to the values it already had
- **THEN** the changes at h contain nothing for k

### Requirement: DT-5 The `core-digest` part keeps one digest per table, and checkpoints

THE backbone part `core-digest` SHALL run last in `on-db-write` and, for each table with changes at h, SHALL set its
row of `core_digest.tables` — `(schema, table) → (height, digest)` — to `(h, SHA-256(previous ‖ CBOR(h) ‖ changes at
h))`, where `previous` is the table's digest before h, or 32 zero bytes before its first change; a table without
changes at h SHALL keep its row (owner decisions Q84, Q86). AT every height h with h mod 14,400 = 0, it SHALL also
write into `core_digest.checkpoints` the row `(h, schema, table, digest)` for every table that has a row in
`core_digest.tables`, so every instance checkpoints at the same heights whatever its S; 14,400 (about 24 hours at one
block per 6 s) is a constant of the build, not a setting. Equal rows of `core_digest.tables` at the same cursor mean
the tables recorded the same changes at the same heights.

#### Scenario: Two runs, one difference
- **WHEN** two databases are built from the same blocks, except that one test module writes a different value into its
  table t at height 7
- **THEN** their rows of `core_digest.tables` are equal for every other table, and for t equal up to height 6 and
  different from height 7 on

#### Scenario: Checkpoints at the same heights
- **WHEN** two databases with the same history pass height 28,800
- **THEN** both hold checkpoint rows at heights 14,400 and 28,800, and the rows are equal

### Requirement: DT-6 Stored data avoids non-deterministic values

THE database API SHALL refuse, at migration time, a module table — in the core's database or a private process's, under
the same rules (owner decision Q75) and not declared `deterministic: false` by its module (owner decision Q76) — that
has no primary key (`no-primary-key`), a primary-key column of a type DT-2 does not order (`unsupported-key-type`), a
column of a type DT-1 does not encode (`unsupported-column-type`; a `numeric` with a declared scale above 0 included),
an identity column, a floating-point column, or a column whose default is not immutable — one that calls a function
PostgreSQL marks stable or volatile or uses an SQL value function, so `now()`, `CURRENT_TIMESTAMP`, `random()`,
`gen_random_uuid()` and a `serial` column's `nextval()` included (`non-deterministic-column`); and it SHALL refuse a
module schema that holds a sequence or an unlogged table (`non-deterministic-table`; owner decision Q61), except a
sequence owned by a column of a table declared `deterministic: false` and such a table itself when unlogged (owner
decision Q76). Each refusal SHALL name the module, the table or sequence, the column and its declared type where there
is one, state why it cannot be stored deterministically, and say what to use instead, as `design.md` §4 gives them
(owner decisions Q58, Q59, Q60); the contents hash (DT-3) SHALL refuse the same tables, sequences and columns with the
same codes and messages, in every schema it hashes (DT-3; owner decision Q61). THE database API SHALL add to every
`jsonb` and `numeric` column of a module table not declared `deterministic: false`, and to every array of either, a
`CHECK` constraint that rejects any JSON number that is not an integer within the signed 64-bit range or whose text has
a fraction, a zero fraction such as `1.0` included (owner decision Q57: no stored number carries a scale, so equal
contents hashes mean equal query results), and any `numeric` value with a fraction, `NaN` or an infinity, so such a
write fails. Values a module computes from anything other than the chain, S
and the configuration (wall-clock time, randomness, process state) are a module developer's error the database cannot
see; they are caught by the convergence tests (two runs, two backends, restarts) and by digests.

#### Scenario: A serial column
- **WHEN** a test module's migration creates a table with a `serial` column
- **THEN** startup refuses with `non-deterministic-column`, the module, the table and the column, and the message
  says a sequence's next value depends on rolled-back and retried blocks and to derive keys from the block

#### Scenario: A time column
- **WHEN** a test module's migration creates a table with a `timestamp` column
- **THEN** startup refuses with `unsupported-column-type`; the message names the module, the table, the column and
  `timestamp without time zone`, says it holds no time zone, and says to use `timestamptz`, written with `Z` (Q74)

#### Scenario: A `CURRENT_TIMESTAMP` default
- **WHEN** a test module's migration creates a `bigint` column with the default
  `extract(epoch from CURRENT_TIMESTAMP)::bigint`
- **THEN** startup refuses with `non-deterministic-column`, and the message says each machine gets a different value
  and to compute the value from the block in `on-db-write`

#### Scenario: An unlogged table
- **WHEN** a test module's migration creates an unlogged table
- **THEN** startup refuses with `non-deterministic-table`, and the message says PostgreSQL empties it after a crash

#### Scenario: A table no module declared
- **WHEN** an operator creates `ops.notes (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, body text)` in a
  public schema by hand
- **THEN** the contents hash refuses with `non-deterministic-column`, naming `ops.notes.id`

#### Scenario: A table without a primary key
- **WHEN** a test module's migration creates a table with no primary key
- **THEN** startup refuses with `no-primary-key`, the module and the table, and the message says rows are hashed in
  primary-key order

#### Scenario: A fractional JSON number
- **WHEN** a module writes `{"x": 1.5}` to a `jsonb` column in `on-db-write`
- **THEN** the write fails the `CHECK` and the block rolls back

#### Scenario: A JSON number with a zero fraction
- **WHEN** a module writes `{"x": 1.0}` to a `jsonb` column in `on-db-write`
- **THEN** the write fails the `CHECK` and the block rolls back

#### Scenario: A fractional `numeric`
- **WHEN** a module writes `100.00` to a `numeric` column in `on-db-write`
- **THEN** the write fails the `CHECK` and the block rolls back
