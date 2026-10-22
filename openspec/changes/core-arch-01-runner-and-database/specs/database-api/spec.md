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
`Uint8Array`, `numeric` to a decimal string and `jsonb` to parsed JSON in query results.

#### Scenario: A multi-statement read does not straddle a commit
- **WHEN** a read handle runs two statements while the writer commits height h between them
- **THEN** both statements see the same height, and the handle reports it

### Requirement: DB-3 Writes only through a write handle

THE database API SHALL create a block write handle only for an `on-db-write` callback, inside the block transaction,
and a schema write handle only for an `on-start-db` callback, inside its own transaction; each SHALL allow writes only
to the calling module's schema. A block write handle SHALL also read committed data plus the rows earlier callbacks
wrote in the same block transaction.

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
callback under `SET LOCAL ROLE` of its module, whose role may write only its own schema and read the others; and SHALL
run each `on-start-db` callback under the same role. IF a callback writes to another module's schema THEN THE database
SHALL reject the statement, and THE runner SHALL halt (RN-8). The same mechanism SHALL work on PostgreSQL and on PGlite.

#### Scenario: Writing into another module's schema is rejected by the database
- **WHEN** module `a` executes an `INSERT` into module `b`'s table through its block write handle
- **THEN** the database rejects it with a permission error, and the block rolls back

### Requirement: DB-7 Cross-module functions are owned by the provider

WHERE a module offers a function that another module calls to change the provider's tables, THE provider SHALL define
it as a `SECURITY DEFINER` function owned by its role, and THE database API SHALL grant `EXECUTE` on it to the roles of
modules that require the provider's item.

#### Scenario: A consumer changes the provider's table only through its function
- **WHEN** a consumer calls the provider's function in `on-db-write`, then tries a direct `UPDATE` on the same table
- **THEN** the function call succeeds and the direct `UPDATE` is rejected

### Requirement: DB-8 Schemas are named after modules and shared items

THE database API SHALL name each module's schema after its id with `-` replaced by `_` (e.g. `core-chain-events` →
`core_chain_events`). WHERE several modules provide one shared item, THE database API SHALL create one schema named
after the item, owned by a role named after the item, under which the provider active at each height writes; IF two
providers of one shared item declare different migrations (ids or checksums) THEN startup SHALL refuse.

#### Scenario: Two providers of one item with different migrations
- **WHEN** two test providers of item `shared-x` declare migration `001` with different SQL
- **THEN** startup refuses and names the item

### Requirement: DB-9 Bootstrap and migrations

WHEN a process starts, THE database API SHALL first create the schema `core_chain` and its table `core_chain.migrations`
(module, migration id, checksum, position) if absent, and THEN run each backbone part's and each module's migrations in
its `on-start-db`, in the order of RN-3, each migration in its own transaction together with its `migrations` row.
THE checksum of a migration SHALL be SHA-256 of its UTF-8 SQL text. Migrations SHALL be forward-only and cumulative.
IF an applied migration's checksum differs from the build's, or a migration recorded as applied is missing from the
build, THEN startup SHALL refuse.

#### Scenario: A changed migration refuses startup
- **WHEN** a module's applied migration `001` is edited (one character) and the process restarts
- **THEN** startup refuses with the module, the migration id and both checksums, and no migration runs

#### Scenario: An interrupted migration leaves no record
- **WHEN** a migration's SQL fails halfway
- **THEN** none of its changes is visible, it is not recorded, and startup refuses with the error

### Requirement: DB-10 Exactly one writer per database

THE database API SHALL let exactly one process write each database. WHERE the backend is PostgreSQL, THE writer SHALL
hold a session advisory lock on its writer connection for its lifetime; a second writer SHALL refuse to start; WHEN the
writer connection is lost THE database API SHALL re-acquire the lock on reconnection before any further write, and IF
another process holds it by then THEN processing SHALL halt. WHERE the backend is PGlite in Node.js, THE process SHALL
hold an exclusive lock file next to the data directory; a second process SHALL refuse to start.

#### Scenario: A second writer refuses
- **WHEN** two processes start against the same PostgreSQL database
- **THEN** exactly one runs; the other refuses with `writer-lock-held` and stays up, not ready

### Requirement: DB-11 The durability probe guards PostgreSQL

WHERE the backend is PostgreSQL, startup SHALL refuse when `fsync` is `off`, when a transaction pooler is detected, or
when `full_page_writes` is `off` unless the operator set its explicit override. WHERE the backend is PGlite, THE process
SHALL start only under the development opt-in, because PGlite runs without fsync.

#### Scenario: PGlite without the development opt-in
- **WHEN** a configuration selects PGlite and does not set the development opt-in
- **THEN** startup refuses and names the development opt-in

### Requirement: DB-12 A lost connection is a distinct, retryable error

IF the database connection is lost THEN THE database API SHALL report a distinct error marked retryable, so that the
caller (project 2's error policy) can retry; every other database error SHALL be reported as not retryable.

#### Scenario: Killing the writer connection
- **WHEN** the PostgreSQL server terminates the writer connection mid-transaction
- **THEN** the API reports the retryable lost-connection error, not a generic error
