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
- **Answer `{ status, headers?, body }`.** The status is an integer from 200 to 599. The body is written as JSON — a
  `bigint` as decimal text, bytes as `0x` hex — unless you give a `Content-Type` with a string or bytes, which are sent
  as they are. Every answer carries `X-Umbra-View: finalized`, `X-Umbra-Height` and `X-Umbra-Hash` of the height your
  read saw; an object of only `data`, `errors` and `extensions` (a GraphQL response) also gets them in its
  `extensions`. Before the first block commits every request is answered 503 `no-committed-height` without calling
  you. A handler that throws is answered 500 `internal-error` with a fixed message: the client never sees your error.
- **Notify subscribers from your `on-after-db-write`.** A subscription handler gets the subscriber's arguments and an
  `emit`, and returns its unsubscribe; keep the `emit`s you were given and call them from `on-after-db-write`, which
  reads the committed block. `emit` never waits: a subscriber that falls more than 1 MiB behind is disconnected and
  unsubscribed, and after the unsubscribe `emit` does nothing. A value `emit` cannot write as JSON (a cyclic one)
  throws at your `emit`. Clients speak JSON messages over WebSocket on the API listener: `subscribe` (`id`, `name`,
  `args`), answered `subscribed`, then `next` with each value; `unsubscribe`, answered `complete`; `error` for what
  cannot be done.

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
  reached, the process waits and runs again from the cursor (the condition `database-retrying` or `node-retrying`): a
  height whose transaction was lost runs again from `on-fetch`, and `on-after-db-write` of the cursor fires again.
  Catching such an error and throwing your own turns it into a failure that halts.
- **After a crash, some points run again.** `on-db-write` runs exactly once per committed height: a block that did not
  commit left nothing. `on-start-height` fires again if your start height had not committed, and `on-after-db-write`
  and `on-stop-height` fire again for the cursor; `on-fetch`, `on-parse` and `on-compute` may run again for a height.
  `on-after-db-write` never gets `block` items, re-delivered or not: read what your `on-db-write` stored instead.
