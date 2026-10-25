# UmbraDB module guide

How to write a module's tables and SQL so that UmbraDB's determinism rules accept them and every machine that runs the
module holds the same data.

## Time values

Store times as `timestamptz`, and write every time with an offset, `Z`. This is the preferred time type for module
tables and for anything UmbraDB itself represents (owner decisions Q68 and Q74 of the `core-arch` change).

- **`timestamptz` is allowed everywhere.** Every module table may store it, as a value and in a primary key. UmbraDB
  hashes it as its microseconds since `1970-01-01T00:00:00Z` and orders keys by time. A query reads it back as RFC 3339
  text in UTC: `2025-05-21T14:30:00Z`, with the fraction when there is one, up to microseconds
  (`2025-05-21T14:30:00.123456Z`). The text is the same in every process and on both backends, whatever the machine's
  time zone.
- **Write it with `Z`.** Write a literal as `'2025-05-21T14:30:00Z'`, or pass the time as a parameter. A time a query
  read back can be sent back unchanged, and a JavaScript `Date` is sent with `Z`.
- **Do not rely on the session's time zone.** A literal without an offset (`'2025-05-21 14:30:00'`) is read in the
  session's `TimeZone`. UmbraDB pins every session to UTC, and a module must not change it (`SET TimeZone`, `SET LOCAL
  TimeZone`): a time written without an offset would then be another instant, and UmbraDB refuses to read a
  `timestamptz` printed in another time zone (`database-error`, `reason: unreadable-result`).
- **Use `NULL` for "no time".** `infinity` and `-infinity` can be stored, but they have no microseconds since 1970, so
  the contents hash refuses them (`unencodable-row`). A time outside the years 0001 to 9999 cannot be read back
  (`unreadable-result`).
- **Take times from the block, never from the clock.** A default such as `now()` or `CURRENT_TIMESTAMP` gives each
  machine a different value, and startup refuses it (`non-deterministic-column`).
- **`bigint` is allowed** for a time as a number, for example milliseconds since 1970, the form the node gives block
  times in. Present it as `timestamptz` text where people read it.
- **A time in `text` is allowed, but it is not good practice.** Nothing checks its form, two spellings of one instant
  (`2025-05-21T14:30:00Z` and `2025-05-21T16:30:00+02:00`) hash and compare as different values, and it sorts as text,
  not by time.
- **The other date and time types are refused** at startup with `unsupported-column-type`: `timestamp` and `date` hold
  no time zone, so one value is a different instant in each time zone; a `time` or `timetz` is a time of day, not an
  instant; an `interval` compares as if a month were 30 days and a day 24 hours, so equal intervals print differently.
  Use `timestamptz`, written with `Z`; for a time of day or a length of time, `bigint` microseconds. Floating-point
  types are refused too, and a time inside `jsonb` is text, with `jsonb`'s rules.

## Migrations

A module creates and changes its tables with migrations: the `migrations` list of its declaration, each `{ id, sql }`,
in order (DB-9 of the `core-arch` change).

- **Each runs once, in order, with its record.** At every startup, before any block, UmbraDB applies the migrations the
  database has not applied yet, in the order of the list, one at a time. Each runs in a transaction of its own together
  with its record in `core_chain.migrations`: the module, the migration's id, the SHA-256 of its SQL as UTF-8, and its
  position in the list. A migration that fails rolls back with its record, the ones before it stay applied, and startup
  stops with `migration-failed` and the database's error.
- **Never change or remove an applied migration.** The checksum covers every byte of the SQL, spaces and comments
  included. Startup refuses, before any migration runs, a migration a database applied whose SQL changed
  (`migration-checksum-changed`, with both checksums) or that the build no longer declares (`migration-missing`). Put
  each change in a new migration at the end of the list: one inserted before an applied migration is refused as well
  (`migration-missing`, out of order), because another database would apply them in another order.
- **One migration may hold several statements**, with function bodies and comments. Do not write `BEGIN`, `COMMIT` or
  `ROLLBACK` in it: UmbraDB runs it inside its own transaction, and a migration that ends that transaction is refused
  (`migration-failed`), since its changes could no longer be recorded with it.
- **Your own schema only, every name written with it.** Migrations run under your module's database role (a provider of
  a shared item: under the item's role), which creates and changes only your schema (the item's) and reads the others.
  Write every name with its schema, `CREATE TABLE my_module.events (…)`: UmbraDB sets no `search_path`, and a `CREATE`
  without a schema fails ("permission denied for schema public").
- **`TRUNCATE` only in a migration.** In a block and in `on-start-db` it fails with `truncate-not-allowed`: `TRUNCATE`
  fires no row trigger, so the rows it removed would escape the per-block digests. Delete rows with `DELETE`.
- **Functions other modules call.** A function another module calls to change your tables is created by your
  migration as `SECURITY DEFINER`, with `SET search_path = pg_catalog, my_module, pg_temp` (`pg_temp` last, so no
  temporary table can stand in for one of yours). UmbraDB grants `EXECUTE` on it to the modules that require your item,
  and to no one else; another module cannot change your tables directly.
- **`on-start-db` after your migrations.** Your `on-start-db` callback runs at every startup, after your migrations, in
  a transaction of its own under your role. Make it idempotent: it runs again at each restart. Change schemas in
  migrations, not there.

## Writing in callbacks

A module writes its tables in two callbacks only, each through the write handle it is given (DB-3 of the `core-arch`
change): `on-db-write`, inside the block's transaction, and `on-start-db`, at every startup after your migrations.

- **Use the handle while your callback runs, and keep none.** A write handle closes when its callback returns or
  throws. A handle used later — stored for the next block, used from a timer, or from another callback — fails with
  `handle-closed`, and processing halts, even if your code catches that error.
- **Your own schema only, every name written with it,** as in migrations: callbacks run under your module's database
  role (a provider of a shared item: under the item's), and UmbraDB sets no `search_path`.
- **One statement per call.** `query` returns rows, `execute` the number of rows changed. Change rows only, never
  schemas, and do not change the role or the session's settings.
- **Await every statement before you return.** A statement you sent but did not await still runs, under your role, but
  its failure fails the block without telling you which statement it was.

## Reading through `db`

A module that requires the `process` item `db` gets a read-only database: it offers `read` and nothing else (CD-1 and
RN-4 of the `core-arch` change, owner decision Q73). You cannot write, open a transaction or close the database through
it: a module writes only through the handles its callbacks are given. These are guidelines; nothing enforces them beyond what is said
here (modules are trusted code).

- **Inside a callback, use the handle it is given.** `on-db-write`'s block write handle reads the committed data plus
  what this block's earlier callbacks, and your own, wrote; `on-start-db`'s schema write handle reads the committed data
  plus your setup's own writes; a read handle reads the height the runner gives its point (for example `on-compute` the
  height before the block, `on-after-db-write` the block's). The write handles and the read handles of the points are
  never cut off by a timeout; only the read of a module API request is bounded, by `apiReadTimeoutMs`.
- **Use `db.read` for work outside the points:** a timer, a background job, a check at startup. `db.read(async (read)
  => …)` reads the latest committed height and reports it as `read.height` (`null` before any block commits); every
  statement of one read sees that height. It reads any module's tables: write every name with its schema.
- **Never call `db.read` inside a callback that has a handle.** On PGlite all database work is one queue that runs one
  job at a time, and such a callback runs inside its handle's job — the block's transaction, `on-start-db`'s
  transaction, the point's read — so the read could never start: it fails at once with `database-error`,
  `reason: nested-call`. On PostgreSQL it runs on another connection and reads committed data only: inside `on-db-write`
  it sees the state before the block, without any of the block's writes, so whatever you compute from it misses them.
- **Write nothing derived from a `db.read`.** It reads whatever height is committed when it runs, which no block
  decides. The rows your callbacks write must come from what the points give them — the block, its items, your settings
  and the handles — or two machines fed the same chain could write different rows (only a table declared
  `deterministic: false` may hold data that is not a function of the chain: see "Data that is not a function of the
  chain").
- **The read option.** `db.read(body)` is not bounded. `db.read(body, { timeoutMs })` bounds it on PostgreSQL: a
  statement running `timeoutMs` milliseconds, or the read left idle that long — between two statements, or after its
  last one while your body still runs — ends it with `query-timeout` (not retryable), even if your code caught the
  statement's error. Do slow work that is not the database's outside the read. PGlite enforces neither timeout, so there
  the read is not bounded. On both, `timeoutMs` must be a whole number from 1 to 2147483647, else the read is refused
  with `invalid-configuration` before it starts.
- **Keep reads short, and keep no read handle.** A read handle closes when your body settles; using it later fails with
  `handle-closed`. On PGlite a read holds the one queue while its body runs, so the next block waits for it; on
  PostgreSQL it holds one of the pooled read connections.

## Data that is not a function of the chain

Most of a module's data is computed from the chain: the block, its items and the module's settings. Two machines fed
the same chain then hold the same rows, and UmbraDB checks that they do (the contents hash, the per-block digests). Some
data is not a function of the chain by nature: the time an API request arrived, a cache, an operator's notes. Keep such
data in tables declared `deterministic: false` (MD-1 of the `core-arch` change, owner decision Q76).

- **Declare it on the `table` item.** The flag goes on the item's `table` and covers every table the item lists:

  ```ts
  provides: [
    {
      name: "key-requests",
      lifetimes: ["table"],
      table: { schema: "keys", tables: ["requests"], kind: "append-only", deterministic: false },
    },
  ],
  ```

  A table is deterministic unless declared so, and only `false` may be written: `deterministic: true` is refused at
  startup (`invalid-declaration`).
- **What it skips.** The determinism rules do not apply to the tables it lists, to their partitions, or to the sequences
  their columns own: such a table may have a `serial` or identity column, a `now()` default, a `timestamp` or a
  floating-point column, no primary key, and it may be unlogged. Its `jsonb` and `numeric` columns get no `CHECK`, and
  the contents hash records its schema and name only: two databases that differ only in its rows hash equal, and a
  database without the table hashes differently. The per-block digests skip it, and `TRUNCATE` is not refused on it,
  since that refusal exists to keep the digests complete.
- **What it keeps.** Everything else is as for any table: your module's role and schema, your migrations (once, in
  order, checksummed), and backups, which carry its rows and its sequences' positions. And the flag is per item, so
  every other table of the module is still checked.
- **Nothing deterministic may be computed from such a table.** No row of a table without the flag may depend on what a
  table with it holds: not through a query in a callback, not through a value your code keeps, not in any other way.
  Data derived from a `db.read`, which reads whatever height is committed when it runs, belongs only in such a table
  too (see "Reading through `db`"). Read these tables to answer API requests or for work outside the points. These are
  guidelines: UmbraDB cannot see what your code computes from what (modules are trusted code), but two machines whose
  deterministic rows differ show it in their contents hashes and digests.
- **Keep the two kinds apart.** A table that would hold both kinds of data cannot be half declared: split it in two,
  one table in an item with the flag and one in an item without it. A table is listed by one item only.
- **Shared items.** An item several modules provide is declared alike by each, with the same schema and migrations,
  and every provider of a shared item declares the same flag; otherwise startup refuses with
  `shared-item-migrations-differ`.

## Upgrades

A new version of a module runs from a future height, as a new revision of its configuration; the rows written before
that height stay as the old version wrote them (owner decisions Q33 and Q43 of the `core-arch` change).

- **Upgrade migrations only add.** The list is cumulative: a version keeps every migration of the versions before it
  and adds its own at the end. A migration applied to tables that already hold rows only adds tables, nullable columns
  or columns with defaults, indexes, constraints and functions. It never does any of these: drop a table or a column,
  change a column's type, or change a stored value. UmbraDB does not check this (modules are trusted): a database that
  synced through the upgrade and one built after it must hold the same rows.
- **A version that must change stored values requires a resync.** Declare `requiresResync: true` in that version. It is
  accepted only by a database none of whose committed heights another version of the module covers: a new database,
  synced with this version from the module's first revision. Any other database refuses it at startup with
  `requires-resync`, naming the module and the version, before any migration runs. A database built with it restarts
  normally.
