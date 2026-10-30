# stats-module

A small public module. For each height it stores one row: the block's hash, how many Midnight transactions the block
carried, how many of them failed, and a running total. It serves the rows over HTTP and a subscription. The
[module guide](../../docs/module-guide.md) §2 walks through the code.

## Files

- `stats-module.ts`: the module. It holds the `defineModule` declaration (id, requires, provides, settings) and the
  module's points:
  - `on-db-write` counts each block's transactions and stores the row;
  - `on-start-api` registers the routes and the subscription;
  - `on-after-db-write` sends new rows to subscribers.
- `sql.ts`: all of the module's SQL. It holds the migrations that create `stats_module.blocks`, the `StatsRow` type,
  and the functions that read and write rows (`lastTotal`, `insertRow`, `rowAt`, `recentRows`).
- `umbradb.config.ts`: the configuration that `umbradb run` reads. It holds:
  - the core entry (network, node, database, listen addresses);
  - the entries of the three core modules the example needs;
  - the module's own entry, with its settings.
- `run.sh`: starts the process (`./run.sh`), or checks the configuration without starting anything
  (`./run.sh check`). It uses the repository's built command in `dist/`.
- `try.sh`: calls a running process. It requests the admin status, every route and a bad request, then opens the
  subscription.
- `tsconfig.json`: maps the `"umbradb"` import to the repository's `src/`, so `npm run typecheck` checks the example
  against the current source.
- `.gitignore`: keeps `data/` out of git. `data/` holds the PGlite database, created on the first run.

## Launching it

From the repository's root, build the command once:

```sh
npm ci && npm run build
```

Then, from this folder:

```sh
./run.sh check   # validates umbradb.config.ts and starts nothing
./run.sh         # syncs preview from genesis into data/preview; Ctrl-C stops it
```

From a second terminal, while it runs:

```sh
./try.sh          # every request below
./try.sh latest   # just one of: status latest block recent bad subscribe
curl -i http://127.0.0.1:18080/stats-module/latest
curl http://127.0.0.1:18081/status
```

The routes are:
- `GET /stats-module/latest`;
- `GET /stats-module/blocks/:height`;
- `GET /stats-module/recent?limit=N`;
- the subscription `stats-module-blocks`, which takes `args: { "minTx": n }`.

Three environment variables change where it connects and listens. They apply to both scripts:

| Variable | Default | Meaning |
|---|---|---|
| `STATS_NODE` | `wss://rpc.preview.midnight.network` | The node to sync from: a preview node (see below). |
| `STATS_API` | `127.0.0.1:18080` | Where the module API listens. |
| `STATS_ADMIN` | `127.0.0.1:18081` | Where the admin endpoints listen. |

`STATS_NODE` must name a preview node, because the configuration says `network: "preview"`.

```sh
STATS_NODE=ws://127.0.0.1:9944 STATS_API=127.0.0.1:28080 STATS_ADMIN=127.0.0.1:28081 ./run.sh
```

To start over, stop the process and delete `data/`.

In a project that installed the package from npm, copy the three `.ts` files there. The commands are then
`npx umbradb config check umbradb.config.ts` and `npx umbradb run`.
