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
- **A block's own time is in the blocks table.** `core_block_commit.blocks.block_time`, a `timestamptz`, holds each
  committed block's time, converted exactly from the node's milliseconds. Require the item `blocks` and read it there
  (`SELECT block_time FROM core_block_commit.blocks WHERE height = $1`) rather than keeping a copy.
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

## Stored values and digests

UmbraDB checks the tables your migrations create, and records per block what your callbacks change in them, so that two
machines fed the same chain can show they hold the same data (DT-4 to DT-6 of the `core-arch` change).

- **Each migration leaves your tables deterministic.** In each migration's own transaction, after its SQL and before
  its record, UmbraDB reads your schema's tables and refuses what the determinism rules refuse: a table without a
  primary key (`no-primary-key`), a key column or a column of a type the rules do not allow (`unsupported-key-type`,
  `unsupported-column-type`; see "Time values" for the date and time types), an identity or `serial` column, a
  floating-point column, a default that is not immutable such as `now()` or `random()` (`non-deterministic-column`), a
  sequence or an unlogged table (`non-deterministic-table`). The refusal names your module, the table, the column and
  its declared type, says why, and says what to use instead. The migration rolls back and is not recorded, so fix its
  SQL and start again. Create each table with its primary key in one migration, not in a later one. The tables of
  earlier startups are checked again at every startup, after your pending migrations: one made by hand, or one whose
  item no longer declares `deterministic: false` (see "Data that is not a function of the chain").
- **Stored numbers are integers.** Every `jsonb`, `numeric`, `jsonb[]` and `numeric[]` column of your tables gets a
  `CHECK` named `umbradb_integers_<column>`: a JSON number must be an integer within the signed 64-bit range, written
  without a fraction (`1.0` and `100.00` are refused; `1e2`, which PostgreSQL stores as `100`, is not), and a `numeric`
  must have no fraction (`100.00` is refused) and be neither `NaN` nor an infinity. NULL is allowed. A write that breaks
  it fails the block with `database-error` (SQLSTATE `23514` and the constraint's name). Store amounts in smallest
  units. Leave these constraints as UmbraDB made them.
- **What the digests record.** At every height UmbraDB records, per table, the rows the block changed — inserted,
  deleted, or updated to other values — and chains them into the table's digest in `core_digest.tables`, which every
  module may read (require the item `digest-tables` to read it in your `on-db-write`, where it holds the digests up to
  the height before). A row rewritten with its own values is no change, and neither is a row inserted and deleted in
  one block. What a migration or `on-start-db` writes is not a block's change: the next block finds those rows and
  compares with them. `TRUNCATE` is refused in a block because it would remove rows without recording them.

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

## Cursor tables

A module that keeps one value per key — a cursor per wallet, per contract, per key id — can let the cursor-table helper
define the table (SH-1 of the `core-arch` change, owner decision Q30). The helper is a library, not a module: the table
is yours, in your schema, with your other tables.

```ts
const cursors = cursorTable({ schema: "my_module", table: "cursors" });

// In the declaration:
//   migrations: [cursors.migration("001"), …your later migrations],
//   points: {
//     async "on-db-write"(p, b, w) { await cursors.write(w, "wallet-1", { height: b.height }); },
//     async "on-after-db-write"(p, b, read) { const cursor = await cursors.read(read, "wallet-1"); … },
//   },
```

- **Include its migration once, and keep it.** `migration(id)` creates `my_module.cursors (key text PRIMARY KEY, value
  jsonb NOT NULL)`; its SQL never changes, so its checksum stays valid. Change the table, if you must, in a later
  migration of your own; never index `value`.
- **Write in `on-db-write`, through its handle.** `write(w, key, value)` runs inside the block's transaction, under your
  role: a block that fails takes its writes with it. Nothing stops a write through `on-start-db`'s handle, but such a
  write is no block's change; keep to `on-db-write`.
- **The last write of a key wins,** also within one block: there is no history. For a value as of a past height, use the
  height-versioned table.
- **Values are JSON, with stored numbers as integers** (see "Stored values and digests"): a fraction, or an integer
  beyond the signed 64-bit range, fails the block. Integers beyond 2^53 are kept exactly: write and read them as
  `bigint`. `null` is a value; `read` gives `undefined` for a key never written.
- **Read through any handle.** `read(handle, key)` through a read handle sees the height it reads; through your block
  write handle it sees the block's writes so far. Other modules may read your cursor table; only you write it.

## Height-versioned tables

A module that answers "what was this key's value at block h" — a token's metadata as of a height — can let the
height-versioned-table helper define the tables (SH-2 and SH-3 of the `core-arch` change, owner decision Q30). Like the
cursor table, it is a library, not a module: the tables are yours, in your schema, with your other tables.

```ts
const metadata = heightVersionedTable({ schema: "my_module", table: "metadata" });

// In the declaration:
//   migrations: [metadata.migration("001"), …your later migrations],
//   points: {
//     async "on-db-write"(p, b, w) { await metadata.write(w, b, "token-1", { name: "Night" }); },
//     async "on-after-db-write"(p, b, read) { const then = await metadata.read(read, "token-1", b.height - 10n); … },
//   },
```

- **Include its migration once, and keep it.** `migration(id)` creates `my_module.metadata (key, value, from_height)`
  with each key's current version, `my_module.metadata_history (key, from_height, to_height, value)` with the closed
  ones, each covering the heights `[from_height, to_height)`, and the trigger that fills the history; its SQL never
  changes. The table's name has at most 54 bytes, so that the history table and the trigger's function fit
  PostgreSQL's 63. If you declare a `table` item for them, list both tables.
- **Write and delete in `on-db-write`, at the block you are given.** `write(w, b, key, value)` and `delete(w, b, key)`
  take that callback's block write handle and block: the change is at `b.height`, where the key's current version
  closes. Writing the value a key has already adds no version and changes nothing.
- **Change each key at most once per block.** A second change of a key in one block — another value, or a write and a
  delete — fails the block (`database-error`, SQLSTATE `23505`), and processing halts, even if your code catches the
  error: the failed statement ended the block's transaction. Gather a block's changes of a key, then write it once.
- **Write the tables only through the helper.** Its trigger refuses a `DELETE` of your own and an `UPDATE` changing a
  key (SQLSTATE `0A000`), and a change at a height below the key's versions (`23P01`).
- **Read through any handle.** `read(handle, key, height)` gives the value as of `height`, `undefined` if the key had
  none then; `read(handle, key)` the current one. Through a read handle you see what the height it reads knows; through
  your block write handle, also your block's changes, at its height. Values follow the cursor table's rules (JSON,
  stored numbers integers within 64 bits, `bigint` beyond 2^53). Other modules may read your tables; only you write
  them.

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

## Settings

A module's settings are its `configSchema`, a zod 4 object schema. An operator writes them in the module's
configuration entry, `entry({ start, config })`, and startup validates them against the schema of the version the
build carries (CF-3 and CF-4 of the `core-arch` change).

- **Every setting has a kind.** `data` if it can change what the module stores: it is recorded in the configuration
  history and can change only from a future height. `operational` if it cannot: it is not recorded and may change at
  any restart. `secret` for an operational setting that is never shown, logged or reported: it reads `[redacted]`. Set
  the kind with `.meta({ kind })` on the field's outermost schema, after `.default()` or `.optional()`, which hide
  metadata set before them; startup refuses a setting without one (`field-no-kind`).

  ```ts
  configSchema: z.object({
    batchSize: z.number().int().min(1).default(100).meta({ kind: "data" }),
    pollMs: z.number().int().meta({ kind: "operational" }),
    apiKey: z.string().meta({ kind: "secret" }),
    feed: z
      .strictObject({ url: z.string(), retries: z.number().int().default(3) })
      .prefault({ url: "https://feed.example" })
      .meta({ kind: "operational" }),
  }),
  ```

- **Defaults fill what is left out.** A setting left out takes its `.default()`. The parsed settings, every default
  applied, are what your callbacks get and what the history records. For an object setting whose own fields have
  defaults, use `.prefault(…)`: zod 4's `.default({})` gives `{}` as it is, without filling the fields inside.
- **An unknown setting is refused.** Startup refuses a setting your schema does not declare, whether the schema is
  `z.object` or not (`z.object` alone would drop it without a word). Inside a setting, declare objects with
  `z.strictObject`, so that a misspelled field there is refused too rather than dropped.
- **Settings are plain data, in and out.** A configuration holds objects, arrays, strings, booleans, `null` and integers
  from 0 to 2^53 − 1 only (CF-1), so a setting typed `z.bigint()`, `z.date()` or a fraction can never be given: write
  heights and counts as numbers and times as RFC 3339 text. Your schema's output is recorded and shown, so it must be
  plain data too: do not coerce or transform a setting into a bigint, a `Date`, a `Map` or a class instance (startup
  refuses it). Byte values are `0x`-prefixed lowercase hex strings; `hexBytes()` (`src/config/core-settings.ts`) checks
  one. The schema parses synchronously and refuses a value with an issue, never by throwing.
- **Keep secrets in `secret` settings.** UmbraDB redacts every `secret` setting's value, in every form it knows, from
  what it shows and logs, and from every message it builds from your schema's issues; a custom message should still
  not repeat the value it refuses. Credentials inside a URL are redacted in any setting, but a URL that carries them
  belongs in a `secret` setting.
- **A new version may rename a setting.** Only the revisions whose version is the build's are validated against its
  schema. An earlier revision is written with `versionEntry({ id, start, version, config })`, its `config` the data
  recorded for it, which startup compares with the history.

## Running a module with the `umbradb` command

The `umbradb` command loads nothing by name: the configuration file is its host program (MD-1). The file imports your
module like any other import, lists its entries, and exports it in `modules`; `umbradb config check` then checks its
entries against your schema, and `umbradb run` runs it, next to UmbraDB's own modules (CF-1, owner decision Q106).

```ts
import { coreEntry, defineConfig } from "umbradb";
import { stats } from "@example/umbradb-stats";

export const modules = [stats];

export default defineConfig({
  entries: [
    coreEntry({ start: 0, config: { network: "preprod", node: process.env.NODE_URL!, database: process.env.DB_URL! } }),
    stats.entry({ start: 0, config: { label: "daily" } }),
  ],
});
```

- **List each module once.** The modules are the build's user modules, in the order given; startup refuses a module
  listed twice (`duplicate-id`), an id of UmbraDB's own (`core`, `core-…`: `reserved-prefix`) and an element that is no
  declaration (`invalid-declaration`): `umbradb config check` names its place (`modules[1]`), and `umbradb run` logs the
  refusal, naming the module and its position, and exits 1. A `modules` export that is not a list is refused as the
  file's (`modules-not-a-list`).
- **A refused configuration stops the command.** When the file cannot be loaded, is not plain data or fails its
  schemas — or lists modules startup refuses —, `umbradb run` logs every finding with its path, serves no admin
  endpoint and exits 1 (owner decision Q137 of the `core-arch` change); run `umbradb config check` first to see the
  same findings. A refusal found later (the database, the node, a migration) leaves the process up and refused, its
  admin endpoints saying why, until it is stopped.
- **An entry needs its module in `modules`.** An entry whose id is neither UmbraDB's nor in the list is refused, naming
  the module; a module in the list without an entry is in the build but does not run.
- **A program that calls `startProcess` itself** gives its own declarations; the file's `modules` are then not used.

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

## Process items and APIs

A `process` item is set once per process, by its provider, and read by the modules that require it (MD-7, RN-15 and
RN-16 of the `core-arch` change).

- **Publish a process item from your `on-start-db`, once.** `p.publish(item, value)` takes only an item your module
  declares with the `process` lifetime; it throws for any other item, for a second publish of the item (by you or by
  another provider of it: one value per item for the whole process), and when called anywhere but your own
  `on-start-db` — a later point, a timer, another module's callback. Such a call fails your callback even if you catch
  the error, so startup refuses, or processing stops at the block in progress.
- **UmbraDB's own process items** come from the backbone part `core-chain`: `config` (the validated configuration),
  `node-client` (the process's one node client, on a process that has a node: the connection its block source reads
  the chain through), `db` (the database, for reads only: see "Reading through `db`") and `ledger-table` (the ledger
  version table in effect: the network's built-in table with the configuration's rows and pins).
- **Read it from `on-start-api` on.** `p.items` holds the published items your module requires or provides; it is
  empty during `on-start-db`, so no setup depends on the order of other modules' setups. If an item a running module
  requires was not published once every `on-start-db` has run, startup refuses with `process-item-missing`, naming the
  item, the modules requiring it and its providers.
- **Register your API in `on-start-api`.** `api.http(method, path, handler)` takes `GET` or `POST` and a path of `/`
  and segments, each a literal (letters, digits and `-._~!$&'()*+,;=@`) or a parameter `:name`; a literal segment wins
  over a parameter. `api.subscription(name, handler)` takes a non-empty name. Register nothing later: the registry
  closes when your callback ends. Two registrations of one method and path (parameters' names aside), or of one
  subscription name, refuse startup with `duplicate-api-route`, naming both modules — also across a handover, so two
  modules that serve the same route at different heights need distinct paths.
- **A handler gets `{ params, body }` and a read handle.** `params` holds the query's parameters and the path's (the
  path's win a name both have); a `POST`'s body is parsed JSON (integers beyond ±(2^53 − 1) as `bigint`). The read sees
  the latest committed height (`read.height`) and is bounded by `apiReadTimeoutMs` on PostgreSQL (`query-timeout`,
  answered 504): do slow work that is not the database's outside the handler. Do not call `db.read` from a handler: on
  PGlite it fails with `nested-call`.
- **Answer `{ status, headers?, body }`; the client gets it as you wrote it.** The status is an integer from 200 to
  599. The body is written as JSON — a `bigint` as decimal text, bytes as `0x` hex — unless you give a `Content-Type`
  with a string or bytes, which are sent as they are. UmbraDB changes no body, a GraphQL response's included (owner
  decisions Q104 and Q105), and adds two headers on every HTTP answer on the API listener — yours, its own errors and
  the subscriptions' upgrade: `X-Umbra-Version`, the build's version (owner decision Q131), and `X-Umbra-Config-Hash`,
  the process's configuration hash (owner decision Q147): a hash of the configuration's data fields as the history
  records them, computed once when the process starts, holding no secret. A client that sees it change knows the
  process restarted with another configuration.
- **The `X-Umbra-` prefix holds the headers every module shares.** UmbraDB owns `X-Umbra-Version` and
  `X-Umbra-Config-Hash`: a header of either name in your answer, in any letter case, is replaced, never sent beside it.
  The helpers below write `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash`. Name your own headers without the
  prefix.
- **State the view, height and hash you read with the helpers** of `src/runner/envelope.ts`, if your clients want
  them: `readChainDataView(read)` gives `finalized`, your read's committed height and that block's hash;
  `chainDataHeaders(view)` writes them as `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash`; `withViewExtensions(body,
  view)` puts them in a GraphQL response's `extensions`, its `data` unchanged; `answerChainData(read, answer)` adds the
  headers to your answer and answers 503 itself before the first block commits. Your handler is called before the
  first block commits too (`read.height` is null): `readChainDataView` then fails with `no-committed-height`, which,
  if you do not catch it, is answered 503 `no-committed-height`. A handler that throws anything else is answered 500
  `internal-error` with a fixed message: the client never sees your error.
- **Notify subscribers from your `on-after-db-write`.** A subscription handler gets the subscriber's arguments and an
  `emit`, and returns its unsubscribe; keep the `emit`s you were given and call them from `on-after-db-write`, which
  reads the committed block. Each `next` carries the value as you emitted it: put in it the height a subscriber needs
  (your `on-after-db-write` has `b.height`, `b.hash` and `read.height`). `emit` never waits: a subscriber that falls
  more than 1 MiB behind is disconnected and unsubscribed, and after the unsubscribe `emit` does nothing. A value `emit`
  cannot write as JSON (a cyclic one) throws at your `emit`. Clients speak JSON messages over WebSocket on the API
  listener: `subscribe` (`id`, `name`, `args`), answered `subscribed`, then `next` with each value; `unsubscribe`,
  answered `complete`; `error` for what cannot be done.

## Start and stop heights

A module's entries say from which height to which height it runs; UmbraDB tells it when it starts and stops (RN-7,
RN-9 to RN-12 of the `core-arch` change).

- **Revisions that follow each other are one run.** `m.entry({ start: 1, config: { k: 1 } })` and `m.entry({ start: 5,
  config: { k: 2 } })` give your callbacks `b.settings.k` 1 at heights 1 to 4 and 2 from 5, and the module does not
  start again at 5. A revision with its own `stop` below the next one's start leaves a gap: the module stops at that
  stop and starts again at the next revision.
- **`on-start-height` comes before your first work.** It fires at your entry's start (its first height processed),
  after `on-parse` and before `on-compute`, with `{ entryId, height }` and a read at h − 1; the core's first, then the
  modules in graph order. It fires again after a restart if the start height had not committed: make it idempotent.
- **`on-stop-height` comes after your last block.** It fires once the stop height has committed, after
  `on-after-db-write`, with a read at h; the stopping modules in reverse graph order, then the core. Your callbacks
  are not called after it, and your tables stay as they were at that height.
- **Both after-commit points are delivered at least once.** At a restart with the cursor c, `on-after-db-write` for
  c and `on-stop-height` for the entries stopping at c fire again, with c's block context and no `block` items,
  before c + 1: a crash may have come before they completed. They are the callbacks of the build now running, even
  when c belongs to an earlier version's revision. Make them idempotent: they write nothing, but a notification you
  send from them may go out twice.
- **The core's stop ends processing.** After it the process stays up in the state `stopped`, ready, serving reads at
  that height; restarted at or above the stop it processes nothing and fires the core's `on-stop-height` again. The
  core's stop is operational: raise or remove it at a restart and processing goes on.
- **A new version stops the old build at its boundary.** A `versionEntry({ id, start, version })` naming a version the
  build does not carry stops processing after `start − 1` (committed, its `on-after-db-write` and `on-stop-height`
  done) with the condition `upgrade-required`, ready and serving reads there. Start the build that carries the
  version, its `m.entry({ start, config })` in the configuration: it continues from `start`, and your module does not
  start again there.

## When a callback fails

A callback that throws stops processing for good, and the process stays up to say why (RN-8, RN-11, IN-10 and IN-12
of the `core-arch` change).

- **Before the commit, nothing of the height stays.** An error in `on-fetch`, `on-parse`, `on-start-height`,
  `on-compute` or `on-db-write` at h rolls the block back: no row of h is kept, in your tables or any other, and the
  cursor stays at h − 1. An error in `on-after-db-write` or `on-stop-height` leaves h committed. Either way the process
  enters the state `halted` with the reason's code (`callback-error`, or the error's own code where it has one, such
  as `truncate-not-allowed`), the height, your module and the point. It stays up, not ready, its module API answering
  at the cursor, until it is stopped; fix the cause and restart it.
- **The reason never carries your message.** `/status` shows the code, the height, the module and the point, never an
  error's text, which may hold a credential; the full error goes to the process's log, redacted.
- **A failing `on-start-db` or `on-start-api` refuses startup.** The process enters `refused`, with `callback-error`,
  your module and the point, and its database is closed, so a fixed build can start at once.
- **A lost connection is retried, not a failure.** When the database connection is lost, or the node cannot be
  reached, the process waits and runs again (the condition `database-retrying` or `node-retrying`). A height the loss
  stopped after its `on-parse` runs again from `on-compute` (from `on-start-height` if `on-compute` had not begun),
  with the `block` items `on-fetch` and `on-parse` published, and without those of the `on-compute` that ran before:
  `on-compute` and `on-db-write` may run twice for a height, `on-fetch` and `on-parse` do not. A `COMMIT` whose answer
  was lost is settled by the cursor: if the height committed, its `on-after-db-write` fires and processing goes on; if
  not, it runs again from `on-compute`. A loss before `on-parse` ended runs the height again from `on-fetch`, after
  `on-after-db-write` of the cursor fires again. Catching such an error and throwing your own turns it into a failure
  that halts.
- **After a crash, some points run again.** `on-db-write` runs exactly once per committed height: a block that did not
  commit left nothing. `on-start-height` fires again if your start height had not committed, and `on-after-db-write`
  and `on-stop-height` fire again for the cursor; `on-fetch`, `on-parse` and `on-compute` may run again for a height.
  `on-after-db-write` never gets `block` items, re-delivered or not: read what your `on-db-write` stored instead.

## Private modules

A private module runs in a private process, next to its own private database, and takes its blocks from the public
database the core writes (PP-1 to PP-5 of the `core-arch` change).

- **Declare `side: "private"`.** A private process runs private modules only, the core public ones: an entry for a
  module of the other side refuses the configuration. `needsLockstep` is a private module's own: a public module that
  declares it is refused.
- **Your `on-fetch` reads public data.** In a private process `on-fetch(p, b, out, read)` gets a fourth argument, a
  read of the public database at its committed height — the public cursor, at least `b.height`, and maybe above it
  when your process lags. Read public tables by height (`WHERE height = $1`, or `<=`), and only append-only ones: the
  rows of a height never change once committed, so you read the same whenever you run (PP-5). A mutable public table
  would show you a later height than the one you process; that needs lockstep (below). The core's `on-fetch` gets no
  such argument. When the public database is PGlite, or the private process has no `publicDatabase`, the read
  goes through the core's process transport (`coreTransport`): each `query` of it is then its own read at the public
  cursor when it runs, never below `read.height`, and its values come back as the core reads them (a `bigint` as a
  `bigint`, `bytea` as bytes, `jsonb` as its value). A parameter that is a string of `0x` and lowercase hex pairs is
  sent as bytes. Through the core each statement must be one read, since the core runs it on the public database: its
  first word `SELECT`, `WITH`, `VALUES` or `TABLE`, one statement, naming nothing that starts with `pg_` (PostgreSQL's
  own functions and catalogs, `pg_advisory_lock` among them) and none of `set_config`, `setseed`, `nextval`, `setval`,
  the large-object functions, `query_to_xml` and the others `design.md` §8 lists (**Confined reads**). Anything else —
  `BEGIN`, `COMMIT`, `SET`, a second statement — fails with `read-refused` (not retried), its message and `details`
  naming the statement, and the core runs nothing of it. Plain `SELECT`s by height are all `on-fetch` needs.
- **Mutable public tables need lockstep.** Declare `needsLockstep: true`, and run your module on an instance the core
  lists in its `lockstepInstances`, with `coreTransport` set to the core's `listen.transport`: the private process
  refuses to start otherwise (`needs-lockstep-not-listed`, naming your module), before any migration. A lockstep
  instance processes each height only while the public cursor is that height — the core waits before committing the
  next one until the instance has committed it (PP-6) —, so your `on-fetch` read sees the public data of exactly
  `b.height` (`read.height` is it). The instance checks it: when the public cursor is past the height — at the read's
  start, or, through the core, read again after your callback, since each `query` there is its own read (Q142) — it
  halts with `lockstep-behind` instead of storing data from another height. A lockstep instance stopped makes the core
  wait (`waiting-for-lockstep` in the core's `/status`), and one listed after the public cursor passed it is refused
  `lockstep-behind`: the mutable state of the heights it missed is gone, so give it a new private database starting
  above the public cursor.
- **Require private items, and the public tables you read.** Your requirements order you among the private
  process's parts: the core's process items `config`, `db` and `ledger-table` (no node client: a private process never
  talks to the node) and `core-private-source`'s `private-cursor`. You may also require a public `table` item —
  `core-block-commit`'s `blocks`, `core-ledger-state`'s `ledger-events`, a public module's own (PP-13) —, and you
  should require each one whose table you read in `on-fetch`: the private process reads which `table` items the public
  core provides at which heights from the public database's configuration history, and refuses to start, with
  `item-no-provider` or `item-not-available` naming the item, when the public core does not provide it at every height
  you run. It gives you the table only — read it through `on-fetch`'s read of public data — and never a public `block`
  or `process` item (`block-header`, `node-client`: require them and startup refuses). The items of the private
  process's own backbone parts (`chain-identity`, the digests) are its own database's, and an item of yours may not
  take the name of a public item the public core provides at the same heights (`providers-overlap`). The check is made
  at the private process's startup, against the public configuration as it is then.
- **A changed public configuration halts you, until the operator accepts it.** The private process keeps, in its own
  database, the public core's configuration hash it accepted (PP-14): its first start records the hash it finds — the
  `configHash` of the core's first `hello-ack` through `coreTransport`, or, without a transport, the hash of the public
  configuration history it read. When the core restarts with another configuration — a data field, a revision, the
  `table` items a module provides —, the running process halts with `public-config-changed` at the core's next
  message, before it processes another height, since the public tables you read may no longer be what startup checked;
  without `coreTransport` it notices when it next connects to its public database again. Each later start stops with
  the same code, naming the new hash, until the operator starts it with `umbradb run --update-hash=<hash>` (a host
  program: `startProcess`'s `updateHash`): that start checks the public side again (and refuses, naming the item, if
  what you require is gone), then records the new hash, and later starts need no flag. A core restarted with the same
  configuration, or with only secrets or operational settings changed, keeps its hash, and nothing happens. The hash
  is kept in `core_private_source.accepted_config`, out of the digests and the contents hash: which hashes an instance
  accepted on the way never changes its private data.
- **The same determinism rules.** Your private tables are checked, digested and hashed as the core's are (Q75): the
  sections above all apply, `deterministic: false` included. Two private processes with the same configuration, bound
  to the same public database, hold the same private data at the same height.
- **Your database is bound to one public database.** At every start the public database's genesis hash must be your
  configured network's (`network`, and `genesisHash` for `custom`); its first start records the public database's
  genesis hash and start height; a later start against another public database is refused (`private-binding-mismatch`,
  its `details.reason` saying why: `network`, `genesis`, `start`), and so is one whose start height is below the public
  one's (`private-start-below`) or against a public database whose core never started (`public-not-started`).
- **Your private inputs are your module's.** UmbraDB takes no keys or other private values for you: the core only
  launches the private process, which reads public data and runs your modules (owner decision Q154). Take what your
  module needs as you choose — your own `secret` settings, which `/config` shows as `[redacted]` and whose values the
  process's log lines redact as written (`0x` and lowercase hex, say), or your own API on the private process's
  `listen.api` — and keep it in your own private tables. The core's `/status` shows of each private instance only its
  id, whether it is connected, whether it is lockstep and its synced height (PP-9), and nothing calls your module
  across the process transport (PP-4). What your module computes from its private inputs is yours to keep private
  (Q16): never put them in an error message, which the process logs when it halts (a secret setting's value in any
  other form than the one written is not redacted), in an API answer, or in a read of public data through the core
  (its statements and parameters cross the transport).

## Blocks from the node

The backbone part `core-block-fetch` reads the chain from the node and gives every block's data to the modules that
require it (CD-2, IN-4 to IN-7 of the `core-arch` change).

- **Four `block` items, from `on-fetch` on.** `block-header` (height, hash, parent hash, roots, digest items, the
  `spec_version` of the runtime that built the block and its own time in milliseconds), `block-body` (the extrinsics as
  fetched, in body order, each with its version and, for an unsigned one, its call — pallet and call by name — decoded
  with the metadata of the runtime in the block's parent's state), `runtime-metadata` (that runtime's `spec_version` and
  metadata bytes, to decode the rest with: at a runtime upgrade the enacting block is still decoded with the old one)
  and `ledger-version` (`v8`, `v9`). Require the ones you read; a signed extrinsic's call is left for you to decode.
- **`on-fetch` and `on-parse` may run ahead, and more than once.** They run for finalized heights fetched ahead of the
  cursor (up to `prefetchWindow` of them, several at once) and for best blocks the node announces while processing
  follows the head; a best block that is then finalized goes on to `on-compute` with the items it has, and one that is
  not is announced to `on-rollback`. Keep these callbacks free of state that outlives the block — they write nothing and
  read nothing stored — and key anything you keep from `on-best-block` by the block's hash.
- **`on-best-block` and `on-rollback` get headers only** (height, hash, parent hash) and no database handle;
  `on-rollback` names the dropped blocks lowest first, once per switch. Nothing of a best block is ever stored.
- **Testing with `InMemoryBlockSource`.** With UmbraDB's backbone, `core-block-fetch` puts the in-memory source's own
  items: blocks of runtime 2.0 (`spec_version` 2,000,000, ledger `v9`), six seconds apart, with no extrinsics and empty
  metadata, unless its `items` option gives a block's own runtime, time or ledger.

## Chain events, transactions and their outcomes

The core modules `core-chain-events`, `core-block-parsed` and `core-tx-results` (CD-4 to CD-6 of the `core-arch`
change) give every block's chain events, its Midnight transactions and their outcomes. They are off unless the
configuration enables them (each with an entry and a start height, as any module); a module that requires one of their
items needs them enabled where it runs.

- **`chain-events`** (from `on-fetch` on): the block's `System::Events` in their order, each with its index, phase
  (`initialization`, `apply-extrinsic` with the extrinsic's index, `finalization`), pallet and event name, its fields
  decoded with the metadata of the runtime in the block's parent's state — the runtime that wrote them, also at an
  upgrade's enacting block — its topics and its SCALE bytes. A field's value: integers up to 32 bits as numbers, wider
  ones as `bigint`s, byte strings as `Uint8Array`s, a struct as an object by field name, a newtype as its one field, an
  enum as its variant's name or `{ <variant>: <fields> }`. Stored in `core_chain_events.events`, the fields as JSON
  (64-bit and wider integers as decimal text, bytes as `0x` hex) and the bytes as the node sent them, so a reader with
  the metadata can decode more.
- **`block-parsed`** (from `on-parse` on): `{ ledger, transactions }`, the transactions in the order the ledger applied
  them — the order of their chain events, a system transaction where its `SystemTransactionApplied` is; block 0's in
  body order —, each parsed once with the block's ledger version: its index, hash, kind (`regular` or `system`), size,
  bytes and segments (the calls and deploys of each), and where the chain put it (phase, extrinsic index, event index).
  Use these plain data; do not parse the bytes again. Stored in `core_block_parsed.transactions` (hash, kind, size).
- **`tx-results`** (from `on-parse` on): one outcome per transaction, in `block-parsed`'s order — `success`
  (`TxApplied`, `SystemTransactionApplied`), `partial` (`TxPartialSuccess`) or `failure` (`ExtrinsicFailed`; the chain
  left its state as it was) —, block 0's all `success`. Which segments failed is not here (the chain's event does not
  say): `core-ledger-state` gives it. Stored in `core_tx_results.results`.
- **A block whose events do not account for its transactions is refused**: a Midnight transaction with no outcome event
  or with two, an outcome under an extrinsic that carries no Midnight transaction. Processing halts there at a finalized
  height (a best block is dropped and fetched again at finality).
- **Testing with `InMemoryBlockSource`**: its blocks have no extrinsics and no events, so the three items are empty;
  the node source over a tape node gives them their content.

## The ledger state

The core module `core-ledger-state` (LG-8 to LG-16 of the `core-arch` change) applies every block to the ledger
state, from genesis, in the ledger worker — a thread of its own, so a long ledger step never holds your callbacks or
the admin endpoints —, and halts processing (`root-mismatch`, nothing of the block stored) at any block whose state
root is not the node's. It requires `core-block-parsed` and `core-tx-results`, which must be enabled with it, and it
cannot start mid-chain: enable it at 0 on a database synced from genesis (or restored from a backup holding it); an
entry starting above 0 is refused at startup with `cannot-start-mid-chain`. Its `block` items, from `on-compute` on
(require them, and read them in your `on-compute` or `on-db-write`):

- **`ledger-state`**: the state after the block, as plain data — its root node's key, its root (the node's), the ledger
  parameters after the block, the zswap tree's first free index. The state itself stays in the worker; what a module
  needs of it that this does not give is a ledger task's (see "Ledger tasks").
- **`ledger-events`**: every ledger event of the block but contract logs — zswap inputs and outputs, contract deploys,
  DUST events, parameter changes —, each with its transaction's index, its segments, its bytes and its nullifier,
  commitment, tree index or contract address where it has one.
- **`segment-results`**: per transaction, in `block-parsed`'s order, its outcome and each segment's success: here a
  partial success says which fallible segment failed. A transaction the chain failed (`tx-results` `failure`) was not
  applied: all its segments failed.
- **`vm-logs`**: the contract logs of the block's applied segments, numbered in the block in emission order (none on
  ledger v8). The `contract-logs` modules store them (task 13.1).

Stored: `core_ledger_state.states` (per block), `segment_results`, `events`, and the state's nodes with their root
counts (`nodes`, `root_counts`), never a whole serialized state. A restarted process loads the state at its cursor
from these tables alone; at the first block a v9 runtime builds after v8 blocks the state is converted to v9 before
the block applies (LG-9).

**Earlier states** (LG-12). The `core` entry's `retainStates` (default 0) keeps the states after the latest block and
the `retainStates` blocks before it; a revision that raises it fills the window from its start, one that lowers it
releases the states leaving the window in its first block. `ledger-state` is also a `process` item: with it
required, `retainedStatesOf(p).load(height, read)` (from `core-ledger-state`'s module) loads the state after `height`
in the ledger worker and gives its key and root, inside the window at the read's cursor (`window(cursor)` gives it);
outside it the call rejects with the `UmbraError` `state-not-retained`, which your callback may catch.

**Reclaiming nodes** (LG-14). Nodes no held state and no persisted key reaches are deleted by an incremental
mark-and-sweep of a fixed budget a block (10,000 node units), so every machine deletes the same nodes at the same block.
The `core` entry's `sweep: off` (development only, with `developmentOptIn`) keeps every node.

**Contracts' states** (LG-13). While `core-contract-states` is active, the `ledger-state` item's `contracts` carries,
for each contract the block touched — its transactions call or deploy it, or its chain events name it maintained, and
at the first v9 block after v8 blocks every contract — the keys of its state and of its zswap state after the block,
persisted and never released: they load from the database whatever later blocks do.

## Contract states and contract logs

Three core modules, off unless the configuration enables them (task 13.1):

- **`core-contract-states`** (requires `ledger-state`; from genesis or a restored backup only) stores, per contract a
  block touched, one row of `core_contract_states.states` (`contract_address`, `height`, `state_key`,
  `zswap_state_key`): the keys of its state and zswap state after the block, so two calls to one contract in one block
  share one row with the state after both. At the first block a v9 runtime builds after v8 blocks, every contract gets a
  row with its converted keys. Its `block` item `contract-states` is the same rows.
- **`core-contract-logs-full`** (requires `vm-logs`; from genesis or a restored backup only) stores the MIP-0002
  events — what Compact's `emit` logs — exactly as the ledger emitted them while applying the block: the logs of
  applied segments, none of a fallible segment that failed, none on ledger v8.
- **`core-contract-logs-fast`** (requires `chain-events` and `block-parsed`; development only, with
  `developmentOptIn`; may start at any height) reads the same logs from the block's transcripts without the ledger
  state: a log whose value the transcript pushes as a literal right before it, with no `branch` or `jmp` before them
  that could skip either, in a transaction that succeeded fully. Anything else — a value read from the contract's
  state or computed, a log behind a branch, any log of a partially successful transaction — halts processing with
  `fast-log-unsupported`, naming the height and the transaction: it stores exactly what `-full` would, or halts.

Both log providers give the item `contract-logs` and its table `contract_logs.logs` (`height`, `tx_index`,
`log_index` — the log's number in the block, in emission order —, `contract_address`, `entry_point`,
`logical_segment`, `log_version`, `event_type`, `data` in the ledger's serialization). Require `contract-logs`, not a
provider: the operator picks one per deployment, and one may stop at a height and the other start at the next — a
database synced with `-full` and backed up can continue with `-fast` after its restore. The `block` item is a frozen
array of `{ transaction, index, address, entryPoint, logicalSegment, version, eventType, data }`, put before
`on-compute` (by `-fast` at `on-parse`, by `-full` at `on-compute`), so read it from `on-compute` on.

## Ledger tasks

`block-parsed` gives each transaction as plain data; the ledger package's own parsed objects stay in the ledger worker
(LG-7, LG-17 of the `core-arch` change). A module that needs more — a contract call's decoded arguments, say —
declares ledger tasks: functions the ledger worker runs for each block on the block's one parse.

```ts
export const callArgs = defineModule({
  id: "call-args",
  // version, side, startsMidChain, configSchema, migrations as for any module
  requires: ["block-parsed"],
  provides: [{ name: "call-arguments", lifetimes: ["block"] }],
  ledgerTasks: [
    { name: "call-arguments", needsState: false, run: ({ transactions, packages }) => decode(transactions, packages) },
  ],
  points: {
    async "on-compute"(p, b, read, out) {
      const calls = b.items.get("call-arguments"); // the task's result, plain data
    },
  },
});
```

- **Its result is a `block` item of the module**, named as the task: provide it with the `block` lifetime, once per
  task. The result is put, frozen, before the module's own callback at the point the task runs, and any module that
  requires the item reads it as any other.
- **What `run` gets:** `height`, `hash`, `ledger` (`v8`, `v9-rc3`, `v9`), `transactions` — the package's own objects
  of the block's one parse, in `block-parsed`'s order —, `packages` (`rawPackages()`: the block's ledger package by
  name, `@umbradb/vendored-ledger-v9-rc3` on runtime 2.0 blocks, whose API is v9's) and, only for a task that declares
  `needsState: true`, `stateBefore`, the ledger state before the block (none at block 0). Read them; change nothing.
- **When it runs:** a task without `needsState` at the module's `on-parse`, so its item is there from `on-parse` on (a
  best block's too) and the module may start mid-chain; one with `needsState` at the module's `on-compute`, after
  `core-ledger-state`'s. A module with tasks requires `block-parsed`, and one with a `needsState` task also
  `ledger-state`: where `core-ledger-state` is not active the graph refuses it (`item-no-provider`).
- **Return plain data only:** `undefined`, `null`, booleans, numbers, `bigint`s, strings, arrays, plain objects and
  `Uint8Array`s. A package's object anywhere in the result (a `LedgerState`, a `ContractCall`, …), or any other class
  instance, fails the block with `callback-error` naming the module and the task, as a task that throws does.
- **Free what you allocate; keep nothing.** Free each object the package's getters give you (`free()`) before the task
  returns: one left live can make the ledger refuse to drop a swept node, which costs a restart of the ledger worker. A
  task writes nothing and keeps nothing between blocks.
- **The worker must have the task.** Functions cannot cross threads, so the worker imports the modules itself: the
  `umbradb` command imports your configuration file there as on the main thread and takes its `modules` export (keep
  the file free of side effects: it runs in both threads, and again when the worker restarts). A program that starts
  processes itself gives `startLedgerWorker` an entry of its own that calls `runLedgerWorker` with UmbraDB's core
  modules' tasks (`CORE_LEDGER_TASK_MODULES`) and its modules. A task the worker lacks fails the block, naming it.
- A private module has no ledger tasks: a private process has no ledger worker.
