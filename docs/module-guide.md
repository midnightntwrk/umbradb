# UmbraDB module guide

A module is the code you add to UmbraDB to index what you need from the Midnight chain: it declares its tables, reads
each finalized block, writes rows, and serves them over its own API. This guide shows one complete module first
(§2), then each part in detail. Every code block imports from the package, `umbradb`.

## 1. Overview

- **What a module is.** One `defineModule({ … })` declaration, exported from a TypeScript file: its `id` (also its
  database schema, `-` becoming `_`) and semver `version`; the items it `requires` and `provides` (below); its
  `migrations`, the SQL that creates its tables; its settings, `configSchema`; and its callbacks, `points`, each under
  the name of the point where UmbraDB calls it. The configuration file imports the module; nothing is loaded by name.
  Modules are trusted code: database roles stop a module from writing another's tables by mistake, and nothing more
  is enforced, so the rules in this guide are yours to keep ([threat model](THREAT_MODEL.md)).
- **What UmbraDB does for it.** It reads finalized blocks from a Midnight node and decodes them; calls each module's
  callbacks in requirement order; runs every module's writes for a height in one transaction with the height reached
  (the cursor), so a height is stored whole or not at all; serves each module's HTTP routes and subscriptions; checks
  that the same chain gives the same rows on every machine (§4); and stops at the first failing callback, saying why
  on its admin endpoints (§12).
- **A block's path through a module.**

  ```text
  startup     migrations ─▶ on-start-db ─▶ on-start-api
  per height  on-fetch ─▶ on-parse ─▶ on-compute ─▶ on-db-write ══ COMMIT ══▶ on-after-db-write
                                      (reads h − 1)  (block transaction)      (reads h; notifies)
  ```

  Most modules need only `on-db-write`, `on-start-api` and, for subscriptions, `on-after-db-write` (all twelve: §3).
- **Items.** Modules exchange data as named items, each with one or more lifetimes: `block`, one block's data, read
  from `block.items` (`block-parsed`); `table`, tables its provider writes and others read with SQL (`blocks` is
  `core_block_commit.blocks`); `process`, a value set once per process (`db`, a read-only database). A module lists
  what it reads in `requires`, and startup refuses a configuration in which a required item has no provider at a
  height the module runs. UmbraDB's core modules provide the chain's data (§6, §9).

## 2. A first module: `stats-module`

`stats-module` stores one row per height — the block's hash, how many Midnight transactions it carried, how many
failed, and a running total — and serves the rows over HTTP and a subscription. The complete module is in
[`examples/stats-module/`](../examples/stats-module/): `stats-module.ts`, its SQL in `sql.ts`, its configuration
`umbradb.config.ts`, and the scripts `run.sh` and `try.sh`. The blocks below are excerpts of those files.

### 2.1 The declaration

```ts
import { z } from "zod";
import { answerChainData, defineModule, type ParsedTransaction } from "umbradb";
import { insertRow, lastTotal, migrations, recentRows, rowAt } from "./sql.ts";

type Outcome = "success" | "partial" | "failure";

export const statsModule = defineModule({
  id: "stats-module", // its schema is stats_module
  version: "1.0.0",
  // "public": it stores only public chain data, no private information (no keys), so its database can be shared.
  side: "public",
  // The items it needs from other modules, all from UmbraDB's core: `blocks`, the core's blocks table (read for each
  // block's time); `block-parsed`, the block's parsed transactions; `tx-results`, each transaction's outcome.
  requires: ["blocks", "block-parsed", "tx-results"],
  // The items it offers other modules: its table, which another module may read by requiring
  // `stats-module-blocks`. "append-only": rows are only added, never changed, so private modules may read it too.
  provides: [
    {
      name: "stats-module-blocks",
      lifetimes: ["table"],
      table: { schema: "stats_module", tables: ["blocks"], kind: "append-only" },
    },
  ],
  startsMidChain: false, // the running total needs every height from 0
  // Its settings, given by its entry in the configuration file and checked at startup. Each field has a kind:
  // "data" changes what is stored, so it is recorded and may change only from a future height; "operational" does
  // not, and may change at any restart.
  configSchema: z.object({
    // Whether system transactions count too, not only regular ones.
    countSystem: z.boolean().default(true).meta({ kind: "data" }),
    // How many rows /stats-module/recent returns when the request gives no ?limit= (1 to 100).
    recentLimit: z.number().int().min(1).max(100).default(10).meta({ kind: "operational" }),
  }),
  // SQL migrations: they create the module's table in its own schema, once each and in order (./sql.ts).
  migrations,
  // The points: where the module's code runs. The runner calls each callback at its point, at startup or for every
  // block: on-db-write inside the block's transaction, on-start-api to register routes, on-after-db-write after the
  // commit.
  points: {/* §2.3, §2.4 */},
});
```

`block-parsed` (the block's transactions) and `tx-results` (their outcomes) are `block` items; `blocks` is the core's
blocks table, read for each block's time. `provides` lists the tables the migrations create, so that other modules can
require them. `countSystem` changes what is stored, so it is a `data` setting, changed only from a future height;
`recentLimit` does not, so it is `operational` and may change at any restart (§8).

### 2.2 Its table

The module keeps its SQL in `sql.ts`: the migrations, the statements it writes with and the queries its routes serve.

```ts
import type { BlockWriteHandle, Migration, ReadHandle } from "umbradb";

export const migrations: Migration[] = [
  {
    id: "001",
    sql: `CREATE TABLE stats_module.blocks (
        height bigint PRIMARY KEY,
        hash bytea NOT NULL,
        tx_count integer NOT NULL,
        failed_count integer NOT NULL,
        total_tx bigint NOT NULL
      )`,
  },
  { id: "002", sql: "CREATE INDEX blocks_with_transactions ON stats_module.blocks (height) WHERE tx_count > 0" },
];
```

Each migration runs once, in order. Write every name with its schema: UmbraDB sets no `search_path`. `002` shows how a
table changes later: a new migration at the end, never an edit of `001`, whose checksum is recorded (§15). Every table
has a primary key and uses the types of §4.

### 2.3 Writing each block

```ts
    async "on-db-write"(_processContext, block, writer) {
      const { transactions } = block.items.get("block-parsed") as { transactions: readonly ParsedTransaction[] };
      const outcomes = block.items.get("tx-results") as readonly Outcome[]; // one per transaction, same order
      const counted = outcomes.filter(
        (_outcome, index) => transactions[index]?.kind === "regular" || block.settings.countSystem === true,
      );
      const failed = counted.filter((outcome) => outcome === "failure").length;
      const totalTx = (await lastTotal(writer)) + BigInt(counted.length);
      await insertRow(writer, {
        height: block.height,
        hash: block.hash,
        txCount: counted.length,
        failedCount: failed,
        totalTx,
      });
    },
```

In `sql.ts`:

```ts
const SELECT_LAST_TOTAL = "SELECT total_tx FROM stats_module.blocks ORDER BY height DESC LIMIT 1";
const INSERT_ROW =
  "INSERT INTO stats_module.blocks (height, hash, tx_count, failed_count, total_tx) VALUES ($1, $2, $3, $4, $5)";

export async function lastTotal(writer: BlockWriteHandle): Promise<bigint> {
  const [last] = await writer.query(SELECT_LAST_TOTAL);
  return (last?.total_tx as bigint | undefined) ?? 0n;
}

export async function insertRow(writer: BlockWriteHandle, row: StatsRow): Promise<void> {
  await writer.execute(INSERT_ROW, [row.height, row.hash, row.txCount, row.failedCount, row.totalTx]);
}
```

`on-db-write` runs inside the height's transaction, through its write handle `writer`: if any module fails at this
height, nothing of the height is stored. Every value comes from the block, its items, the settings and the module's own
table, never from the clock, so every machine writes the same row (§4). A `bigint` column reads back as a `bigint`.

### 2.4 Serving it

In `sql.ts`, a row joined with its block's time from the core's blocks table:

```ts
const SELECT_ROWS = `
  SELECT stats.height, stats.hash, chain.block_time, stats.tx_count, stats.failed_count, stats.total_tx
  FROM stats_module.blocks stats JOIN core_block_commit.blocks chain USING (height)`;
const SELECT_ROW_AT = `${SELECT_ROWS} WHERE stats.height = $1`;

export async function rowAt(read: ReadHandle, height: bigint): Promise<Record<string, unknown> | undefined> {
  return (await read.query(SELECT_ROW_AT, [height]))[0];
}
```

Beside the declaration:

```ts
const subscribers = new Set<{ minTx: number; emit: (value: unknown) => void }>();
```

In `points`:

```ts
    async "on-start-api"(processContext, api) {
      const recentLimit = Number(processContext.revisions.at(-1)?.settings.recentLimit ?? 10);

      api.http("GET", "/stats-module/latest", async (_request, read) =>
        answerChainData(read, async (view) => {
          const row = await rowAt(read, view.height);
          return row === undefined ? { status: 404, body: { error: "no-row" } } : { status: 200, body: row };
        }),
      );

      api.subscription("stats-module-blocks", (args, emit) => {
        const subscriber = { minTx: Number((args as { minTx?: number } | null)?.minTx ?? 0), emit };
        subscribers.add(subscriber);
        return () => subscribers.delete(subscriber);
      });
    },

    async "on-after-db-write"(_processContext, block, read) {
      const row = subscribers.size > 0 ? await rowAt(read, block.height) : undefined;
      for (const subscriber of subscribers) {
        if (row !== undefined && Number(row.tx_count) >= subscriber.minTx) subscriber.emit(row);
      }
    },
```

Routes are registered in `on-start-api`, and only there; each request gets a read of the latest committed height.
`answerChainData` adds the headers `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash` (what the read saw) and answers
503 before the first height commits. The body goes out as JSON: a `bigint` as decimal text, bytes as `0x` hex, and
`block_time` as the RFC 3339 text it reads back as. `on-after-db-write` runs after the commit: it notifies and writes
nothing. The example file has two more routes, `/stats-module/blocks/:height` and `/stats-module/recent` (which uses
`recentLimit`).

### 2.5 The configuration file

```ts
import { CORE_BLOCK_PARSED, CORE_CHAIN_EVENTS, CORE_TX_RESULTS, coreEntry, defineConfig } from "umbradb";
import { statsModule } from "./stats-module.ts";

export const modules = [statsModule];

export default defineConfig({
  entries: [
    coreEntry({
      start: 0,
      config: {
        network: "preview",
        node: process.env.STATS_NODE ?? "wss://rpc.preview.midnight.network",
        database: { kind: "pglite", path: "data/preview" },
        listen: {
          api: process.env.STATS_API ?? "127.0.0.1:18080",
          admin: process.env.STATS_ADMIN ?? "127.0.0.1:18081",
        },
        developmentOptIn: true, // PGlite is a development database
      },
    }),
    CORE_CHAIN_EVENTS.entry({ start: 0, config: {} }),
    CORE_BLOCK_PARSED.entry({ start: 0, config: {} }),
    CORE_TX_RESULTS.entry({ start: 0, config: {} }),
    statsModule.entry({ start: 0, config: { countSystem: true, recentLimit: 5 } }),
  ],
});
```

`modules` puts the module in the build; an entry runs it from a height (`start`) with its settings. The `core` entry
names the network, the node, the database and where the API and the admin endpoints listen; the environment variables
let you point the example at another node or other addresses. The database is given as parts: `{ kind: "pglite",
path }` here, a directory created at the first run; in production `{ kind: "postgres", host, port, user, password,
name, ssl }`, of which only `password` is secret (the [operator guide](operator-guide.md#the-database) lists the parts).
`block-parsed` and `tx-results` come from core modules that are off unless they have an entry, and both need
`core-chain-events`; the `blocks` table is always there.

### 2.6 Running and calling it

From the repository, after `npm ci && npm run build` at its root:

```sh
cd examples/stats-module
./run.sh check     # umbradb config check umbradb.config.ts: checks the file without starting anything
./run.sh           # umbradb run: syncs preview from genesis; Ctrl-C stops it
# from a second terminal (./try.sh sends these and more):
curl -i http://127.0.0.1:18080/stats-module/latest   # X-Umbra-Height and X-Umbra-Hash, then the row as JSON
curl http://127.0.0.1:18081/status                   # state, cursor, node head, lag, modules
```

In a project that installed the package (the README's quick start), the same commands are `npx umbradb config check
umbradb.config.ts` and `npx umbradb run`. For the subscription, a WebSocket client connects to `ws://127.0.0.1:18080`
and exchanges JSON messages (`./try.sh subscribe` does):

```text
→ {"type":"subscribe","id":"s1","name":"stats-module-blocks","args":{"minTx":1}}
← {"type":"subscribed","id":"s1"}
← {"type":"next","id":"s1","value":{"height":"…","hash":"0x…","tx_count":2,…}}
```

Next: types §4, chain data §6 and §9, routes §7, settings §8, ready-made tables §10, private data §14, changes §15–16.

## 3. Callbacks and points

| Point | When | Gets | Runs |
|---|---|---|---|
| `on-start-db` | each start, after your migrations | schema write handle | in series |
| `on-start-api` | each start | the API registry | in series |
| `on-best-block` | the node announced a new best block | its header | in series |
| `on-fetch` | a block is read | item sink (private module: also a read of public data) | in waves |
| `on-parse` | after the items it requires are put | item sink | in waves |
| `on-rollback` | queued best blocks were dropped | their headers | in series |
| `on-finalized` | a new finalized head, before its heights | read at the cursor | in series |
| `on-start-height` | your entry's start height | read at h − 1 | in series |
| `on-compute` | before the block transaction opens | read at h − 1, item sink | in waves |
| `on-db-write` | inside the block transaction | block write handle | in series |
| `on-after-db-write` | after the commit; no `block` items | read at h | in series |
| `on-stop-height` | after your entry's stop height committed | read at h | in series |

- **Arguments.** Every callback gets the process context `processContext` first (§8, §13). The block points get `block`:
  `height`, `hash`, `parentHash`, `items`, `settings` (your revision's at this height) and `active(moduleId)`.
- **Which point for which job.** Compute in `on-compute`: it reads the state before the block, and modules there run in
  parallel. Write in `on-db-write`, the only point inside the block's transaction. Notify in `on-after-db-write`, once
  the height is committed. Set up in `on-start-db`; register routes in `on-start-api`.
- **Order between modules.** A module's callback runs after those of the modules it requires, directly or through
  others. "In waves" means modules that do not depend on one another run at the same time. A failing callback ends the
  point: nothing after it runs.
- **Best blocks and rollbacks** (rarely needed). `on-best-block` and `on-rollback` get headers only (height, hash,
  parent hash) and no database handle; `on-rollback` names the dropped blocks, lowest first. `on-fetch` and `on-parse`
  also run for heights fetched ahead and for best blocks, maybe more than once: keep in them no state that outlives the
  block. Nothing of a best block is stored.

## 4. Deterministic PostgreSQL

Every machine fed the same chain must hold the same rows. UmbraDB hashes each module's tables and the rows each block
changes to show that they do, and refuses at startup a table that could break it.

### 4.1 Column types

| For | Type | As a key | Reads back as |
|---|---|---|---|
| integers | `smallint`, `integer` / `bigint` | yes | `number` / `bigint` |
| integers wider than 64 bits | `numeric`, `numeric(p)`: no fraction | no | decimal text |
| bytes: hashes, addresses | `bytea` | yes, by bytes | `Uint8Array` |
| text | `text`, `varchar(n)` | yes, by bytes | `string` |
| flags | `boolean` | yes | `boolean` |
| ids | `uuid` (no `gen_random_uuid()` default) | yes, by bytes | lowercase text |
| times | `timestamptz`, written with `Z` | yes, by time | RFC 3339 text in UTC, `2025-05-21T14:30:00Z` |
| structured data | `jsonb`: numbers are integers | no | the JSON value; integers beyond 2^53 as `bigint` |
| lists | arrays of the types above | no | arrays |

Refused, with what to use instead: `real` and `double precision` (integers in fixed units); `numeric(p,s)` with a
fraction (`numeric(p)` in smallest units); `timestamp` and `date` (`timestamptz`); `time`, `timetz` and `interval`
(`bigint` microseconds); `json` (`jsonb`); `char(n)` (`text`); `money` (`bigint`); enums, domains and composite types
(their base type; `text` with a `CHECK` for an enum); any other type. Appendix A.3 says why for each.

A block's own time is `core_block_commit.blocks.block_time` (require `blocks`): read it there rather than keep a copy.
Write time literals with an offset (`'2025-05-21T14:30:00Z'`), or pass them as parameters.

### 4.2 Rules

- **Tables.** Every table has a primary key, created in the migration that creates the table. No `serial` or identity
  column, no sequence, no unlogged table, no default that is not immutable (`now()`, `random()`). A migration that
  breaks a rule rolls back, and startup refuses with the rule's code (`no-primary-key`, `unsupported-column-type`, …),
  naming the table, the column and what to use instead.
- **Integers only.** UmbraDB adds to each `jsonb` and `numeric` column a `CHECK` named `umbradb_integers_<column>`: a
  write of a fraction fails the block. Store amounts in smallest units.
- **`TRUNCATE` only in a migration**; in a block it fails with `truncate-not-allowed`. Delete rows with `DELETE`.
- **Values come from the chain.** What a callback writes may depend only on the block, its items, the module's settings
  and stored rows: never on the clock, `random()`, a `db.read` (§5), a network call or a value kept from elsewhere.

### 4.3 Data that is not a function of the chain: `deterministic: false`

Some data is not a function of the chain by nature: the time a request arrived, a cache, an operator's notes. It goes
in the tables of an item declared `deterministic: false`:

```ts
table: { schema: "keys", tables: ["requests"], kind: "append-only", deterministic: false },
```

- **What it skips.** The rules of §4.1 and §4.2 do not apply to the tables the item lists, and the digests skip it:
  the contents hash records its schema and name only, and `TRUNCATE` is not refused on it. The flag is per item, so
  every other table of the module is still checked.
- **What it keeps.** Your role and schema, your migrations, and backups, which carry its rows.
- **Nothing deterministic may be computed from such a table.** Read it to answer API requests or for work outside the
  points. Data derived from a `db.read` belongs only in such a table too. A table that would hold both kinds of data:
  split it in two, one table in an item with the flag and one in an item without it.
- **Shared items** (§13): every provider of a shared item declares the same flag, else startup refuses with
  `shared-item-migrations-differ`.

## 5. Reading and writing tables

- **The handles.** `on-db-write` gets the block write handle and `on-start-db` a schema write handle: `query(sql,
  params)` returns rows, `execute(sql, params)` the number of rows changed. They see their transaction's writes; the
  block's handle also sees what earlier callbacks of the block wrote. The other points get a read handle (`query`
  only) at the height §3 gives; `read.height` says which. One statement per call; await each before you return.
  Inside a callback, use the handle it is given: the handles of the points are never cut off by a timeout.
- **Keep no handle.** A handle closes when its callback returns: one kept and used later fails with `handle-closed`
  and halts processing, even if your code catches the error.
- **Parameters** are sent as text: numbers and `bigint`s as digits, a `Uint8Array` as `bytea`, a plain object as JSON.
  Cast where the statement does not give the type (`$1::bigint`).
- **Your schema and names.** Your schema is your id with `-` replaced by `_`. Write every name with its schema, in
  migrations and callbacks: UmbraDB sets no `search_path`, so `CREATE TABLE events (…)` fails with "permission denied
  for schema public". You read every module's tables and write only your own. Do not change the role or a session
  setting (`SET TimeZone`): sessions are pinned to UTC, and the result mapping depends on it.
- **Reading outside the points: `db.read`.** Use `db.read` for work outside the points: a timer, a background job, a
  check at startup. Require the `process` item `db`:

  ```ts
  import type { ReadHandle } from "umbradb";

  type ReadOnlyDatabase = {
    read<T>(body: (read: ReadHandle) => Promise<T>, options?: { timeoutMs?: number }): Promise<T>;
  };
  const db = p.items.get("db") as ReadOnlyDatabase;
  const rows = await db.read((read) => read.query("SELECT count(*) AS n FROM stats_module.blocks"), {
    timeoutMs: 5_000,
  });
  ```

  It reads the latest committed height (`read.height`, `null` before the first commit). `db.read(body)` is not
  bounded; `db.read(body, { timeoutMs })` ends a statement, or the read left idle, after `timeoutMs` on PostgreSQL with
  `query-timeout`. PGlite enforces neither timeout. Never call `db.read` inside a callback that has a handle, or from an
  API handler: on PGlite it fails at once (`database-error`, `reason: nested-call`), and on PostgreSQL it reads the
  state before the block, without any of the block's writes. Store nothing derived from it outside tables declared
  `deterministic: false` (§4.3). Keep reads short: on PGlite a read holds the database's one queue, and the next block
  waits.

## 6. Blocks, events and transactions

| Item | Provider | Lifetime | From | Holds |
|---|---|---|---|---|
| `block-header` | `core-block-fetch` | block | `on-fetch` | height, hashes, roots, `specVersion`, `timestampMs` |
| `block-body` | `core-block-fetch` | block | `on-fetch` | the extrinsics; an unsigned one's call decoded |
| `runtime-metadata` | `core-block-fetch` | block | `on-fetch` | the runtime's `spec_version` and metadata bytes |
| `ledger-version` | `core-block-fetch` | block | `on-fetch` | the block's ledger version (`v8`, `v9`) |
| `blocks` | `core-block-commit` | table | any read | `core_block_commit.blocks`: hashes, versions, `block_time` |
| `chain-events` | `core-chain-events` | both | `on-fetch` | `System::Events`; `core_chain_events.events` |
| `block-parsed` | `core-block-parsed` | both | `on-parse` | transactions; `core_block_parsed.transactions` |
| `tx-results` | `core-tx-results` | both | `on-parse` | one outcome each; `core_tx_results.results` |
| `digest-tables` | `core-digest` | table | any read | each table's digest per height; `core_digest.tables` |

- **Enabling the core modules.** `core-block-fetch`, `core-block-commit` and `core-digest` always run. The others run
  only where the configuration has an entry for them (`CORE_CHAIN_EVENTS.entry({ start, config: {} })`), together with
  what they require: `core-block-parsed` needs `core-chain-events`, `core-tx-results` both. A module that requires an
  item where its provider does not run is refused at startup (`item-no-provider`, `item-not-available`).
- **An event** has `index`, `phase` (`initialization`, `apply-extrinsic` with `extrinsicIndex`, `finalization`),
  `pallet`, `name`, `fields`, `topics` and `bytes`. Fields are decoded with the runtime that wrote them: integers up to
  32 bits as numbers, wider ones as `bigint`, byte strings as `Uint8Array`, a struct as an object, an enum as its
  variant's name or `{ <variant>: <fields> }`. The table stores them as JSON (wide integers as text, bytes as `0x` hex).
- **`block-parsed`** is `{ ledger, transactions }`, in the order the ledger applied them; each transaction (the
  package's `ParsedTransaction` type) has `index`, `hash`, `kind` (`regular` or `system`), `size`, `bytes` and
  `segments` (each one's calls and deploys), and where the chain put it (`phase`, `extrinsicIndex`, `eventIndex`). Use
  these; do not parse the bytes again.
- **`tx-results`** is `success`, `partial` or `failure` per transaction, in `block-parsed`'s order; which segment failed
  is in `segment-results` (§9). A block whose events do not account for its transactions halts processing.
- **Lifetimes.** "both" is `block` and `table`. A `block` item is in `block.items` from the point in "From" through
  `on-db-write`; `on-after-db-write` gets none.

## 7. The module API

- **Routes.** `api.http(method, path, handler)` takes `GET` or `POST` and a path of `/` and segments, each a literal
  (letters, digits and ``-._~!$&'()*+,;=@``) or a parameter `:name`; a literal wins over a parameter. The handler gets
  `{ params, body }` and a read handle: `params` holds the query's and the path's parameters (the path's win), and a
  `POST`'s `body` is its parsed JSON (integers beyond 2^53 as `bigint`). Two registrations of one method and path, by
  you or another module, refuse startup with `duplicate-api-route`, even when the two modules run at different heights.
- **Answers.** Return `{ status, headers?, body }`, the status from 200 to 599. The body is sent as JSON unless you set
  a `Content-Type` and give a string or bytes; UmbraDB changes no body. It adds two headers to every answer:
  `X-Umbra-Version` (the build) and `X-Umbra-Config-Hash` (it changes when the process restarts with other
  configuration data). Name your own headers without `X-Umbra-`. A handler that throws is answered 500
  `internal-error` with a fixed message, its error going to the log. On PostgreSQL a request's read is bounded by the
  core entry's `apiReadTimeoutMs` (504 `query-timeout`).
- **Stating the height you read.** `answerChainData(read, answer)` as in §2.4. For other shapes:
  `readChainDataView(read)` gives `{ view, height, hash }`, `chainDataHeaders(view)` the three headers, and
  `withViewExtensions(body, view)` puts them in a GraphQL response's `extensions`, its `data` unchanged.
- **Subscriptions.** `api.subscription(name, handler)`: the handler gets the subscriber's `args` and an `emit`, and
  returns its unsubscribe. Call the `emit`s from `on-after-db-write`, putting in each value the height a subscriber
  needs. `emit` never waits: a subscriber more than 1 MiB behind is disconnected. After a restart a subscriber may see
  a height twice (§12).

## 8. Settings

`configSchema` is a zod 4 object, each field with its kind, set with `.meta({ kind })` after `.default()` or
`.optional()` (which hide metadata set before them):

```ts
configSchema: z.object({
  batchSize: z.number().int().min(1).default(100).meta({ kind: "data" }),
  pollMs: z.number().int().meta({ kind: "operational" }),
  apiKey: z.string().meta({ kind: "secret" }),
}),
```

- **The kinds.** `data` can change what is stored: it is recorded in the configuration history and changes only from
  a future height. `operational` cannot: it is not recorded and may change at any restart. `secret` is an operational
  setting never shown or logged (`[redacted]`); never put its value in your own messages or answers either.
- **What is accepted.** A setting left out takes its `.default()`; for an object whose fields have defaults, use
  `.prefault({…})`. An undeclared setting is refused; inside a setting, declare objects with `z.strictObject`.
  Settings are plain data: objects, arrays, strings, booleans, `null` and integers from 0 to 2^53 − 1. Write heights as
  numbers, times as RFC 3339 text and bytes as `0x` lowercase hex (`hexBytes()` checks one); transform none into a
  `bigint`, a `Date` or a class instance. The schema parses synchronously and refuses a value with an issue, never by
  throwing.
- **Reading them.** `block.settings` holds your revision's settings at the block's height. Where there is no block, as
  in `on-start-api`, `processContext.revisions` lists your revisions (`start`, `stop`, `version`, `settings`):
  `processContext.revisions.at(-1)?.settings.recentLimit`.

## 9. Ledger state, contract states and contract logs

- **`core-ledger-state`** applies every block to the ledger state and halts with `root-mismatch`, storing nothing of
  the block, when the state root is not the node's. It needs `core-block-parsed` and `core-tx-results`, and starts only
  at 0 (or on a database restored from a backup that holds the state). Its `block` items, from `on-compute` on:
  `ledger-state` (the state after the block as plain data: its key, its root, the ledger parameters, the zswap and DUST
  trees' first free indexes and roots); `ledger-events` (every ledger event but contract logs: zswap inputs and
  outputs, deploys, DUST events, …); `segment-results` (per transaction, its outcome and each segment's success);
  `vm-logs` (the contract logs of the applied segments; none on ledger `v8`).
- **Earlier states.** The core entry's `retainStates` (default 0) keeps the states of that many blocks before the
  latest. With `ledger-state` required, `retainedStatesOf(p).load(height, read)` loads the state after `height` and
  gives its key and root; outside the window it rejects with `state-not-retained`, which your code may catch.
- **Contract states.** `core-contract-states` (needs `core-ledger-state`; from 0 or a restored backup) stores, per
  contract a block touched, one row of `core_contract_states.states`: `contract_address`, `height`, and the keys of its
  state and zswap state after the block. Its `block` item `contract-states` holds the same rows.
- **Contract logs.** Require `contract-logs`, not a provider: the operator picks one, and one may hand over to the
  other at a height. `core-contract-logs-full` (needs `vm-logs`; from 0 or a restored backup) stores the logs the ledger
  emitted while applying the block. `core-contract-logs-fast` (development only; any start height) reads them from the
  transcripts and halts with `fast-log-unsupported` at a log it cannot read that way. Both fill `contract_logs.logs`:
  `height`, `tx_index`, `log_index` (its number in the block), `contract_address`, `entry_point`, `logical_segment`,
  `log_version`, `event_type`, `data`. The `block` item, read from `on-compute` on, is an array of `{ transaction,
  index, address, entryPoint, logicalSegment, version, eventType, data }`. With the vendored v9 ledger,
  `logical_segment` is 0 for every log, whichever segment emitted it: the ledger labels a fallible segment's contract
  events with the guaranteed segment, so the column cannot tell a guaranteed log from a fallible one.

Their entries are written as for the others: `CORE_LEDGER_STATE.entry({ start: 0, config: {} })`,
`CORE_CONTRACT_STATES`, `CORE_CONTRACT_LOGS_FULL`, `CORE_CONTRACT_LOGS_FAST`.

## 10. Ready-made tables: cursor and height-versioned

Two helpers create a table in your schema; put their migration in your list, keep it as it is, and change the table, if
you must, in a later migration of your own.

```ts
import { cursorTable, heightVersionedTable } from "umbradb";

const cursors = cursorTable({ schema: "my_module", table: "cursors" }); // migration: cursors.migration("001")
await cursors.write(writer, "wallet-1", { height: block.height });      // in on-db-write
const value = await cursors.read(read, "wallet-1");                     // through any handle

const metadata = heightVersionedTable({ schema: "my_module", table: "metadata" });
await metadata.write(writer, block, "token-1", { name: "Night" });      // in on-db-write; or metadata.delete(…)
const then = await metadata.read(read, "token-1", block.height - 10n);  // as of a height; without one, the current
```

- **Cursor table: one value per key.** The last write of a key wins, also within one block. `read` gives `undefined`
  for a key never written.
- **Height-versioned table: a key's value at any height.** Closed versions go to `<table>_history`. Change a key at most
  once per block (a second change fails the block and halts); write these tables only through the helper; table names
  have at most 54 bytes. A `table` item for them lists both tables.
- **Values** in both are JSON whose numbers are integers within 64 bits (beyond 2^53 as `bigint`).

## 11. Start and stop heights

- **Entries and revisions.** Each entry is a revision: `statsModule.entry({ start, stop?, config })`. Revisions that
  follow each other are one run: with entries starting at 1 and 5, `block.settings` holds the first's settings at
  heights 1 to 4 and the second's from 5, and the module does not start again at 5. A revision whose `stop` is below the
  next one's start leaves a gap: the module stops there and starts again.
- **Starting mid-chain.** A module may start above height 0 only if it declares `startsMidChain: true`, promising that,
  started at any height h, it writes from h the rows a run from 0 would write; otherwise startup refuses with
  `cannot-start-mid-chain`. Only starts above the cursor are checked, so a restored backup continues as it was.
- **`on-start-height` and `on-stop-height`.** The first fires at a run's first height, before `on-compute`, with
  `{ entryId, height }`, and again after a restart if that height had not committed. The second fires once the run's
  last height has committed; your callbacks are not called after it. Make both idempotent.

## 12. When a callback fails

- **A failing callback halts.** Before the commit (`on-fetch` to `on-db-write`) nothing of the height is stored; after
  it (`on-after-db-write`, `on-stop-height`) the height stays. The process stays up in the state `halted`, its API
  answering at the last committed height, until it is stopped: fix the cause and restart it. `/status` shows the code
  (`callback-error`, or the error's own code), the height, the module and the point, never your error's message, which
  goes to the process's log, redacted.
- **Startup refusals.** A failing `on-start-db` or `on-start-api` leaves the process up in `refused`, its admin
  endpoints saying why. A configuration that cannot be loaded or fails its schemas ends `umbradb run` at once with exit
  status 1, each finding logged with its path; `umbradb config check` shows the same findings without starting.
- **What may run again.** A lost database connection or an unreachable node is retried, never a failure (unless your
  code catches the error and throws its own):

| Point | May run again for one height | So |
|---|---|---|
| `on-fetch`, `on-parse` | fetched ahead, for best blocks, after a lost connection | keep no state past the block |
| `on-start-height` | after a restart, if the start height had not committed | make it idempotent |
| `on-compute`, `on-db-write` | after a lost connection; only a committed run's writes stay | no outside effects |
| `on-after-db-write`, `on-stop-height` | after a restart, for the last committed height | a notification may repeat |

## 13. Providing items to other modules

- **`block` items.** Declare the item with the `block` lifetime and put it once per block with `out.put(item, value)`,
  from `on-fetch`, `on-parse` or `on-compute`; the modules that require it run after you and read `block.items`.
- **`table` items** list your tables (`schema`, `tables`, `kind`: `append-only` if rows are only added, else
  `mutable`). Others require the item to read them; private modules read only append-only ones (§14).
- **`process` items.** Declare the item with the `process` lifetime and publish it once, from your `on-start-db`:
  `p.publish(item, value)`. Modules that require it read `p.items.get(item)` from `on-start-api` on; startup refuses
  with `process-item-missing` an item a running module requires that no one published. UmbraDB's own are `config`,
  `node-client`, `db` and `ledger-table`.
- **Shared items and provider functions** (rarely needed). Several modules may provide one item if at most one runs at
  each height, as the two contract-log providers do; a shared `table` item's schema is the item's name, and every
  provider declares the same migrations. To let others change your tables, create a `SECURITY DEFINER` function in a
  migration, with `SET search_path = pg_catalog, my_module, pg_temp`: UmbraDB grants `EXECUTE` on it to the modules
  that require your item.

## 14. Private modules

- **What a private process is.** A module declared `side: "private"` runs in a private process: another `umbradb
  run`, whose `core` entry has an `instanceId` and no `node`, and reaches the public data through `publicDatabase` (a
  PostgreSQL database's parts) or the public process's transport (`coreTransport`, the public `listen.transport`). It
  keeps its own database; §4 applies to it, so two private processes with the same configuration, bound to the same
  public database, hold the same private rows.
- **Reading public data in `on-fetch`.** `on-fetch(processContext, block, out, read)` gets a fourth argument, a read of
  the public database at its committed height, which may be above `block.height`. Read public tables by height (`WHERE
  height = $1`), and only append-only ones: their rows for a height never change. Through `coreTransport` each statement
  must be one read — its first word `SELECT`, `WITH`, `VALUES` or `TABLE`, naming no `pg_` function and none of the
  others the [threat model](THREAT_MODEL.md) lists —, else it fails with `read-refused` and the core runs nothing of it.
- **Which public items you may require.** Public `table` items (`blocks`, `ledger-events`, a public module's tables):
  require each one you read, and startup checks that the public process provides it at every height you run. Public
  `block` and `process` items (`block-header`, `node-client`) are not available; a private process has its own
  `config`, `db` and `ledger-table`.
- **Mutable public tables need lockstep.** Declare `needsLockstep: true` and run the module on an instance the public
  `core` entry lists in `lockstepInstances`, with `coreTransport` set (`needs-lockstep-not-listed` otherwise). The
  public process then waits for the instance at each height, so your read sees exactly `block.height`. An instance that
  falls behind halts with `lockstep-behind`; one listed late needs a new private database starting above the public
  cursor.
- **Binding and public changes.** A private database is bound to the public database it first started against
  (`private-binding-mismatch` for another). It keeps the public configuration hash it accepted: when the public process
  restarts with other configuration data, the private process halts with `public-config-changed`, and each later start
  stops the same way, naming the new hash, until the operator starts it with `umbradb run --update-hash=<hash>`, which
  checks the public items again before it records the hash.
- **Private inputs are the module's.** UmbraDB takes no keys for you: take them through `secret` settings or your own
  API on the private process, keep them in your private tables, and never put them in an error message or an API
  answer. Your reads of public data are seen — by the public database's operator and logs and, through
  `coreTransport`, by the core —: read public rows by height and filter them in your module, so that values derived
  from private data stay out of the queries.

## 15. Migrations

- **How they run.** At every start, before any block, UmbraDB applies the migrations the database has not applied, in
  list order, each in its own transaction under your module's role, with its record (its id and the SHA-256 of its
  SQL). A failing one rolls back with its record and stops startup (`migration-failed`); the ones before it stay.
- **Rules.** Never change or remove an applied migration: startup refuses (`migration-checksum-changed`,
  `migration-missing`), since another database would hold other tables. Add each change at the end of the list. One
  migration may hold several statements, function bodies and comments, but no `BEGIN`, `COMMIT` or `ROLLBACK`.
- **`on-start-db`** runs at every start after your migrations, in its own transaction under your role: make it
  idempotent, and change schemas in migrations, not there.

## 16. Upgrades

- **A new version from a future height.** It runs as a new revision from a height above the cursor:
  `statsModule.entry({ start, config })` in the build that carries it, the earlier revision kept as `versionEntry({ id,
  start, version, config })`. A build that does not carry the new version stops before its start
  (`upgrade-required`), serving reads, until the new build starts.
- **Upgrade migrations only add.** On tables that hold rows, a new version's migrations may add tables, nullable
  columns or columns with defaults, indexes, constraints and functions; they never drop a table or a column, change a
  column's type or change a stored value. A database synced through the upgrade and one built after it must hold the
  same rows. UmbraDB does not check this.
- **`requiresResync: true`** marks a version that must change stored values: only a database no other version of the
  module wrote accepts it; any other refuses at startup with `requires-resync`.

## 17. Trying a module against another node

- **Another node.** `STATS_NODE=ws://127.0.0.1:9944 ./run.sh` runs the example against a local node — a devnet, or a
  node of your own on preview — instead of the public one; the database directory keeps the chain it first synced, so
  give each chain its own `path`.
- **Starting near the head.** A module that declares `startsMidChain: true` can start near the node's head on a new
  database (`start` above 0 in every entry), and reach `following` within a minute instead of syncing from genesis.
  `stats-module` keeps a running total from 0, so it cannot.

## Appendix A. Reference

- **A.1 The declaration's fields.** Required: `id`, `version`, `side`, `requires` (at least one item), `provides`,
  `startsMidChain`, `configSchema`, `migrations`, `points`. Optional: `needsLockstep` (§14), `developmentOnly` (needs
  the core entry's `developmentOptIn`), `requiresResync` (§16). Ids and item names are lowercase words joined by
  hyphens, at most 40 bytes; a user module's id may not be `core` or start with `core-` or `on-`.
- **A.2 Codes a module author meets.**
  - Startup, the declaration: `invalid-declaration`, `unknown-point`, `field-no-kind`, `reserved-prefix`,
    `duplicate-id`.
  - Startup, requirements: `item-no-provider`, `item-not-available`, `graph-cycle`, `providers-overlap`,
    `cannot-start-mid-chain`, `development-opt-in-required`, `process-item-missing`, `duplicate-api-route`,
    `needs-lockstep-not-listed`.
  - Startup, migrations and tables: `migration-failed`, `migration-checksum-changed`, `migration-missing`,
    `requires-resync`, `no-primary-key`, `unsupported-column-type`, `unsupported-key-type`,
    `non-deterministic-column`, `non-deterministic-table`, `shared-item-migrations-differ`.
  - Processing halts: `callback-error`, `handle-closed`, `truncate-not-allowed`, `database-error`, `root-mismatch`,
    `fast-log-unsupported`, `lockstep-behind`, `public-config-changed`.
  - A call your code may catch: `query-timeout`, `no-committed-height`, `state-not-retained`, `read-refused`.
- **A.3 Refused column types, and why.** `real`, `double precision`: approximate, so one value computed two ways can
  differ in its last bits. `numeric(p,s)` with s > 0: every value prints with s decimals, and stored numbers must be
  integers. `timestamp`, `date`: no time zone, so one value is a different instant in each zone. `time`, `timetz`: a
  time of day is not an instant. `interval`: equal intervals print differently (`1 day`, `24:00:00`). `json`: keeps its
  input text, so different texts read back equal. `char(n)`: padded, so its value depends on how it is read. `money`:
  its text depends on a locale setting. Enums, domains, composite and other types: no canonical encoding. As keys only:
  `numeric` (its text does not sort by value), `jsonb` and arrays (PostgreSQL's order is not their encoding's).
- **A.4 The `umbradb` command.** `umbradb run [--config <file>]` runs the file (`umbradb.config.ts` by default) until
  SIGTERM or Ctrl-C, which let the height in progress finish; it exits 1 when startup refused or processing halted.
  `umbradb config check <file> [--database]` type-checks the file and validates its entries, and with `--database`
  checks them against the configuration history of the database the file names, read only. `backup` and `restore`: see
  the [operator guide](operator-guide.md#backups). The file's `modules` export is the build's user modules: a module
  listed twice, an id of UmbraDB's own or an element that is no declaration is refused, and an entry needs its module
  in `modules`.
- **A.5 Module API wire format.** UmbraDB's own errors are `{ "error": { "code", "message" } }`: 400
  `invalid-request`, 404 `not-found`, 405 `method-not-allowed`, 413 `request-too-large` (a body over 1 MiB), 500
  `internal-error`, 503 `no-committed-height`, 504 `query-timeout`. WebSocket, on the API address, any path:
  `subscribe` (`id`, `name`, `args`) is answered `subscribed`, then `next` with each `value`; `unsubscribe` (`id`) is
  answered `complete`; what cannot be done, `error`. A message has at most 64 KiB.

The specification is the OpenSpec change [`core-arch`](../openspec/changes/core-arch/).
