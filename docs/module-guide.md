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
