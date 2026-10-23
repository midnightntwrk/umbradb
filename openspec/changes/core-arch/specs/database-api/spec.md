# Spec delta — `database-api` capability

EARS forms and terms as in `specs/runner/spec.md`. The **database API** is the one interface every caller uses to read
and write a database, over two backends: PostgreSQL (several connections) and PGlite (one connection).

## ADDED Requirements

### Requirement: DB-1 One API over two backends

THE database API SHALL offer the same operations, with the same observable results, on PostgreSQL and on PGlite, and
SHALL be the only way the runner, backbone parts and modules reach a database.

#### Scenario: Same test, two backends
- **WHEN** the database-API conformance suite runs once on PostgreSQL 17 and once on PGlite
- **THEN** every test passes on both, with identical query results

### Requirement: DB-2 A read handle sees one committed height

THE database API SHALL run every read through a read handle that sees exactly one committed height and reports it
(`ReadHandle.height`, `null` before any height commits): on PostgreSQL as one `REPEATABLE READ READ ONLY` transaction
on a pooled read connection; on PGlite as one queued job. THE database API SHALL map `bigint` to `bigint`, `bytea` to
`Uint8Array`, `numeric` to a decimal string, and `jsonb` to JSON parsed without loss: a JSON integer outside the safe
integer range (±(2^53 − 1)) SHALL become a `bigint`, never a rounded `number`.

#### Scenario: A multi-statement read does not straddle a commit
- **WHEN** a read handle runs two statements while the writer commits height h between them
- **THEN** both statements see the same height, and the handle reports it

#### Scenario: Large JSON integers stay distinct
- **WHEN** two rows hold the `jsonb` values `9007199254740992` and `9007199254740993`
- **THEN** reading them returns two different `bigint` values

### Requirement: DB-3 Writes only through a write handle

THE database API SHALL create a block write handle only for an `on-db-write` callback, inside the block transaction,
and a schema write handle only for an `on-start-db` callback, inside that callback's own transaction; each SHALL allow
writes only to the calling module's schema. A block write handle SHALL also read committed data plus the rows earlier
callbacks wrote in the same block transaction.

#### Scenario: A write handle cannot be kept
- **WHEN** a module stores its block write handle and uses it after `on-db-write` returns
- **THEN** the call fails, and the failure is a callback error

### Requirement: DB-4 PGlite serializes all work in one queue

WHERE the backend is PGlite THE database API SHALL run all work as jobs of one queue; a block transaction SHALL be one
exclusive job, during which only that transaction's own callbacks read and write (through its handle); every read from
elsewhere SHALL wait until the job ends.

#### Scenario: No outside read inside a block transaction
- **WHEN** reads arrive continuously from an API load generator while blocks commit on PGlite
- **THEN** an instrumented test records zero outside reads that ran between a block's `BEGIN` and its `COMMIT`

### Requirement: DB-5 PostgreSQL has one writer connection and a read pool

WHERE the backend is PostgreSQL THE database API SHALL run block transactions and migrations on one writer connection,
and reads on a pool of read-only connections that see committed data only.

#### Scenario: Readers never see an uncommitted block
- **WHEN** a reader queries while the writer's block transaction for h is open
- **THEN** the reader sees no row written at h until the COMMIT

### Requirement: DB-6 Each module's schema is guarded by its own database role

THE database API SHALL create one database role per module, owning that module's schema; SHALL run each `on-db-write`
callback after `SET LOCAL ROLE` to its module's role, whose role may write only its own schema and read the others; and
SHALL run each `on-start-db` callback and each migration under the same role. IF a callback writes to another module's
schema under its own role THEN THE database SHALL reject the statement, and THE runner SHALL halt (RN-8). The same
mechanism SHALL work on PostgreSQL and on PGlite. Modules are trusted code that the operator builds into the host
program (owner decision Q46): the roles guard against mistakes, not against a module that deliberately selects another
role, and THE system SHALL NOT add enforcement beyond them.

#### Scenario: Writing into another module's schema is rejected by the database
- **WHEN** module `a` executes an `INSERT` into module `b`'s table through its block write handle
- **THEN** the database rejects it with a permission error, and the block rolls back

### Requirement: DB-7 Cross-module functions are owned by the provider

WHERE a module offers a function that another module calls to change the provider's tables, THE provider SHALL define
it as a `SECURITY DEFINER` function owned by its role with a fixed `search_path` that ends with `pg_temp` (`SET
search_path = pg_catalog, <provider schema>, pg_temp`), so that it resolves names the same way whoever calls it and no
temporary table can shadow a provider table; THE database API SHALL revoke `EXECUTE` on functions in module schemas from
`PUBLIC` (as a default privilege of each module role) and grant it to the roles of modules that require the provider's
item.

#### Scenario: A consumer changes the provider's table only through its function
- **WHEN** a consumer calls the provider's function in `on-db-write`, then tries a direct `UPDATE` on the same table
- **THEN** the function call succeeds and the direct `UPDATE` is rejected

#### Scenario: An unrelated module is not granted the function
- **WHEN** a module that does not require the provider's item calls the provider's function
- **THEN** the database rejects the call with a permission error

### Requirement: DB-8 Schema names are unambiguous

THE system SHALL accept module ids and item names that match `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` and are at most 40
bytes long — so that every derived identifier (`umbradb_m_<schema>`, `umbradb_i_<item>`) stays within PostgreSQL's
63-byte limit — and SHALL name each module's schema after its id with `-` replaced by `_` (e.g. `core-chain-events` →
`core_chain_events`), which is one-to-one for such ids. IF a module's schema name or a shared item's schema name equals
another module's, another item's, or a reserved schema (`core_chain`, `core_digest`, `core_digest_shadow`, any name
starting with `pg_`, `information_schema`, `public`) THEN startup SHALL refuse and name both. WHERE several modules
provide one shared item, THE database API SHALL create one schema named after the item, owned by a role named after
the item, under which the provider active at each height writes; IF two providers of one shared item declare different
migrations (ids or checksums) THEN startup SHALL refuse.

#### Scenario: Two providers of one item with different migrations
- **WHEN** two test providers of item `shared-x` declare migration `001` with different SQL
- **THEN** startup refuses and names the item

#### Scenario: An id that is too long
- **WHEN** a module's id is 41 bytes long
- **THEN** startup refuses with `bad-id`, the id and the limit

#### Scenario: An id that aliases a backbone schema
- **WHEN** a user module has the id `core_chain` or a user module has the id `token-index` while an item is named
  `token-index`
- **THEN** startup refuses: the first id does not match the pattern, and the second pair collides

### Requirement: DB-9 Bootstrap, migrations and setup

WHEN a process starts, THE database API SHALL first create the schema `core_chain` and its table `core_chain.migrations`
(module, migration id, checksum, position) if absent; THEN, for each backbone part and each module in the order of RN-3,
SHALL apply its pending migrations one by one, each in its own transaction together with its `migrations` row, and
SHALL THEN call its `on-start-db` callback in a further transaction of its own, for setup that is idempotent. THE
checksum of a migration SHALL be SHA-256 of its UTF-8 SQL text. Migrations SHALL be forward-only and cumulative. IF an
applied migration's checksum differs from the build's, or a migration recorded as applied is missing from the build,
THEN startup SHALL refuse before any migration runs. IF a migration fails THEN its transaction SHALL roll back, the
migrations before it SHALL stay applied, and startup SHALL refuse.

#### Scenario: A changed migration refuses startup
- **WHEN** a module's applied migration `001` is edited (one character) and the process restarts
- **THEN** startup refuses with the module, the migration id and both checksums, and no migration runs

#### Scenario: The second of two migrations fails
- **WHEN** a module's migrations `001` and `002` are pending and `002` fails halfway
- **THEN** `001` is applied and recorded, none of `002`'s changes is visible, `002` is not recorded, the module's
  `on-start-db` callback did not run, and startup refuses with the error

### Requirement: DB-10 Migrations of an upgrade never change stored values

THE system SHALL require, as an obligation of every module version, that a migration applied to tables that already
hold rows only adds — tables, nullable columns or columns with defaults, indexes, constraints and functions — and never
drops a table or column, changes a column's type, or changes a stored value; rows before an upgrade stay as the old
version wrote them (CORE-ARCH Q33). THE system SHALL NOT check this at run time (modules are trusted, Q46). WHERE a
module version declares `requiresResync: true`, THE system SHALL accept that version only while no committed height of
the database is covered by a revision of that module with another version, and SHALL otherwise refuse startup with
`requires-resync`; a database built with that version from its first revision of the module SHALL restart normally.

#### Scenario: A version that needs a resync, as an upgrade
- **WHEN** heights covered by module `m` 1.0.0 have committed and the build carries `m` 2.0.0 with
  `requiresResync: true`
- **THEN** startup refuses with `requires-resync`, the module and the version, before any migration runs

#### Scenario: Restarting a database built with that version
- **WHEN** an empty database started with `m` 2.0.0 (`requiresResync: true`), committed blocks, and was restarted
- **THEN** startup accepts it

### Requirement: DB-11 Exactly one writer per database

THE database API SHALL let exactly one process write each database, and SHALL fail stop rather than risk a second writer
(owner decision Q50: a second writer would break determinism). WHERE the backend is PostgreSQL, THE writer SHALL hold a
session advisory lock on its writer connection for its lifetime; a second writer SHALL refuse to start; WHEN the writer
connection is lost THE database API SHALL re-acquire the lock on reconnection before any further write, and IF another
process holds it by then THEN processing SHALL halt. WHERE the backend is PGlite in Node.js — which does not guard its
data directory itself — THE process SHALL hold the lock directory of `design.md` §4, recording its process id, process
start time, host name and a random token; THE system SHALL take over an existing lock only WHEN its holder process is
proven gone (same host, and no live process with that id and start time); IF the holder is alive (including a paused or
sleeping process), is on another host, or cannot be checked, THEN the new process SHALL refuse to start
(`writer-lock-held`), and only `umbradb unlock` (or removing the directory by hand) clears such a lock. THE holder SHALL
check, every second and before every block's `BEGIN` and `COMMIT`, that the lock directory exists and holds its token,
and SHALL halt (`writer-lock-lost`) at the first failed check, writing nothing more.

#### Scenario: A second writer refuses
- **WHEN** two processes start against the same PostgreSQL database
- **THEN** exactly one runs; the other refuses with `writer-lock-held` and stays up, not ready

#### Scenario: A paused writer keeps its lock
- **WHEN** a PGlite writer is paused (`SIGSTOP`) for 5 minutes and a second process starts against the same directory
- **THEN** the second process refuses with `writer-lock-held`; the first resumes and continues; only the first ever
  writes

#### Scenario: A crashed writer's lock is recovered
- **WHEN** a PGlite writer is killed with `SIGKILL` and the process is started again
- **THEN** the new process finds the holder gone, takes the lock, and continues from the cursor

#### Scenario: Two processes race for a dead holder's lock
- **WHEN** a PGlite process was SIGKILLed and two new processes start at the same moment
- **THEN** exactly one takes the lock and runs; the other refuses with `writer-lock-held`

### Requirement: DB-12 The durability probe guards PostgreSQL

WHERE the backend is PostgreSQL, startup SHALL refuse when `fsync` is `off`, when a transaction pooler is detected, or
when `full_page_writes` is `off` unless the operator set its explicit override. WHERE the backend is PGlite, THE process
SHALL start only under the development opt-in, because PGlite runs without fsync.

#### Scenario: PGlite without the development opt-in
- **WHEN** a configuration selects PGlite and does not set the development opt-in
- **THEN** startup refuses and names the development opt-in

### Requirement: DB-13 A lost connection is a distinct, retryable error

IF the database connection is lost THEN THE database API SHALL report a distinct error marked retryable, so that the
caller (project 2's error policy) can retry; every other database error SHALL be reported as not retryable.

#### Scenario: Killing the writer connection
- **WHEN** the PostgreSQL server terminates the writer connection mid-transaction
- **THEN** the API reports the retryable lost-connection error, not a generic error

### Requirement: DB-14 Block transactions change rows only

THE system SHALL require that `on-db-write` callbacks change rows only (`INSERT`, `UPDATE`, `DELETE`, and provider
functions that do the same), and that schema changes happen only in migrations. Because `TRUNCATE` fires no row
triggers and would escape digest capture (DT-4) without an error, THE database API SHALL attach to every table of a
public module a `BEFORE TRUNCATE` statement trigger that raises `truncate-not-allowed`; DDL in a block is a module error
the system does not check (Q46).

#### Scenario: TRUNCATE in a block
- **WHEN** a module runs `TRUNCATE` on its own table in `on-db-write`
- **THEN** the statement fails with `truncate-not-allowed` and the block rolls back
