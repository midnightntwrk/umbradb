# UmbraDB in a browser

The browser build runs the same core in a page: the core in a Web Worker with PGlite, the ledger in a worker of its
own, the database held through a Web Lock. The [README](../README.md#quick-start-browser)'s quick start starts it; this
page covers how it is configured and built, and how it differs from `umbradb run`.

## Build and serve

From a clone of the repository, after `npm ci`:

```sh
node browser/build.ts --configuration browser/src/config.ts   # writes dist-browser/
node browser/serve.ts                                         # serves dist-browser/ on 127.0.0.1:8090
```

`npm run web` runs both with the default configuration. It rebuilds first, so after a build with your own
configuration serve with `node browser/serve.ts`. `node browser/build.ts` also takes `--out <dir>`, and
`node browser/serve.ts` takes `--dir <dir>` and `--port <port>` (or `WEB_PORT`).

The page needs two headers: `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy:
require-corp`. It must be cross-origin isolated for the ledger worker's `SharedArrayBuffer`. `browser/serve.ts` sends
both; any static server works if it does. Without them the page's log shows
`the worker could not start its process: SharedArrayBuffer is not defined`. Opening `dist-browser/index.html` as a file
does not work.

## The configuration

The page has no `umbradb.config.ts`. Its configuration is a TypeScript module bundled into the page at build time: the
one `--configuration` names, `browser/src/config.ts` unless given. Changing it means building the page again.

A configuration file for `umbradb run` is data written in advance. In the page, some of it is known only when the page
runs: the node it was pointed at, where its database lives, and S, its first height. So the module's default export
makes each process's configuration from the run (`browser/src/configuration.ts` defines the types):

```ts
interface BrowserConfiguration {
  core(run: BrowserRun): ProcessConfiguration;                  // the core (public) process
  instances?(run: BrowserRun): readonly PrivateInstance[];      // private instances, none unless given
}

interface BrowserRun {
  node: string;                                // the page's `node` parameter
  storage: string;                             // `memory`, or a database name in the origin's private file system
  start: number;                               // S: the node's finalized head when this database was created
  params: Readonly<Record<string, string>>;    // every parameter of the page's address
}

interface ProcessConfiguration {
  data: unknown;                               // `{ entries }`, what a configuration file's default export holds
  modules: readonly unknown[];                 // the user modules, what a configuration file's `modules` export holds
}
```

The default, `browser/src/config.ts`, in short:

```ts
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import { coreEntry, defineConfig } from "../../src/config/entries.js";
import { type BrowserConfiguration, type BrowserRun, databaseOf } from "./configuration.js";

function core(run: BrowserRun) {
  const network = run.params.network ?? "preview";          // the full file also checks the name and takes `custom`
  const modules = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS].map((module) => ({
    id: module.id,
    version: module.version,
    start: run.start,
    config: {},
  }));
  return {
    data: defineConfig({
      entries: [
        coreEntry({
          start: run.start,
          config: { network, node: run.node, database: databaseOf(run.storage, "core"), developmentOptIn: true },
        }),
        ...modules,
      ],
    }),
    modules: [],
  };
}

const configuration: BrowserConfiguration = { core };
export default configuration;
```

- **Database:** `databaseOf(run.storage, name)` gives the `database` setting: PGlite in memory, or a database in the
  origin's private file system (OPFS) named after `storage`, plus `-<instance id>` for a private instance.
- **Your own modules:** add each module's declaration to `modules` and its entry to `data.entries`, as a configuration
  file does. A module's own settings can read the page's parameters through `run.params`.
- **Private instances:** `instances(run)` returns `{ id, configure(run) }` for each; each runs in a worker of its own
  beside the core. The core listens for them on the page's message network (`listen: { transport: "core:1" }`) and a
  private instance connects with `coreTransport: "core:1"`. `test/browser/fixtures/configuration.ts` is a complete
  example with a user module and a private instance.
- **Imports:** the default and the tests' configuration import UmbraDB from the repository's `src/` and
  `browser/src/configuration.ts` by relative path, so the build bundles the sources and replaces what a browser lacks
  (below).
- **The development opt-in** is set on every `core` entry by the build, whatever the module says.

## What the default page runs

From S, the node's finalized head when its database was created, it runs `core-chain-events`, `core-block-parsed` and
`core-tx-results`, and shows the core's state, cursor, head and lag. `core-ledger-state` is not enabled: it needs the
chain from genesis or a restored backup. The page reaches only its own origin and the node.

## The page's parameters

- `node`: the node's WebSocket URL (required); the node must accept the page's origin.
- `storage`: `memory` (the default: a new database at each load), or a name: a database in OPFS, kept across reloads.
  A second tab on the same name refuses with `writer-lock-held`.
- `network`: `preview` (the default), `preprod`, `mainnet`, `stagenet`, or `custom` with `genesis=<hash>`.
- `restore`: with a `storage` name, the page waits for a backup file to restore into that new database before it
  starts the core, then resumes from the backup's height + 1.

For example, `http://127.0.0.1:8090/?node=wss://rpc.preview.midnight.network&storage=preview-1` keeps its database
across reloads. A configuration may read parameters of its own from `run.params`.

## Backups and status

The page's Back up button saves a backup of the database as a file; the `restore` parameter loads one. In the console,
`await umbradb.core.call("admin", "/status")` answers what `/status` answers.

## How the page is built

`browser/build.ts` bundles with esbuild into `dist-browser/`: the page (`index.html`, `page.js`), the core and private
workers (`core-worker.js`, `private-worker.js`, one process each), the ledger worker (`ledger-worker.js`), PGlite's
WebAssembly and data files, `pglite-tools`' `pg_dump` WebAssembly for the Back up button, and the vendored ledger
packages' WebAssembly (`ledger/<version>/`). `dist-browser/` is not part of the npm package.

The workers bundle UmbraDB's sources unchanged — the runner, the modules, the database API on PGlite, the node client,
the ledger worker — and replace only what a browser does not have, each in one place:

- **Node.js built-ins:** `node:crypto` (SHA-256), `node:worker_threads` (Web Workers), `node:fs` (no file is read),
  `node:http`, `node:https` and `ws` (the page's message network), `node:path`, `node:async_hooks` and `Buffer` have
  replacements under `browser/src/shims/` and `browser/src/net/`. Any other built-in a file of UmbraDB's imports fails
  the build, naming it.
- **Whole modules:** opening the database (PGlite in memory or OPFS, never PostgreSQL), the writer lock (Web Locks),
  the configuration loader (the bundled module, no file), the node client's socket (the browser's `WebSocket`) and the
  module API's listener (the worker's message channel).
- **What the browser does not carry:** `umbradb backup`'s file writer is bundled as a stub that fails when used; the
  page's Back up button and `restore` run the same backup code without it.
- **The vendored ledger packages** are checked as the build reads them: each version's `SHA256SUMS`, then every file
  bundled and every WebAssembly written, against it. A changed or unlisted file fails the build with
  `package-hash-mismatch`. The page checks each WebAssembly again when the ledger worker loads it.

## Differences from `umbradb run`

| | `umbradb run` (Node.js) | The browser page |
|---|---|---|
| Configuration | `umbradb.config.ts`, read at each start (`--config`) | A module bundled at build time (`--configuration`); rebuild to change it |
| Its shape | Default export `defineConfig({ entries })`; `modules` export | Default export `{ core(run), instances?(run) }`, each giving `{ data, modules }` |
| Node, start, database | Written in the file | From the run: the `node` parameter, S, `storage` |
| First height | `start` as written (0 for genesis) | S, the node's finalized head when the database was created |
| Database | PostgreSQL 18, or PGlite on disk | PGlite only: in memory or OPFS |
| Development opt-in | Required for PGlite, set in the file | Always set by the build |
| Imports | `umbradb` (the package) | The repository's `src/` by relative path |
| Private processes | Another `umbradb run`, its own database and file | Workers in the same page, from `instances(run)` |
| Process transport | `listen.transport` / `coreTransport` as `host:port` | Names on the page's message network (`core:1`) |
| Module API | HTTP on `listen.api` (`host:port`) | The core worker's message channel (`listen.api` as a name, e.g. `core:2`) |
| `/status`, `/health/*`, `/config` | HTTP on `listen.admin` | `umbradb.core.call("admin", "/status")` (or another path) in the console |
| Backups | `umbradb backup`, `backupOnSignal` (SIGUSR2), `pg_dump` | The Back up button; `restore` parameter to load one |
| Writer lock | PostgreSQL: a session advisory lock; PGlite: an OS file lock beside the directory | A Web Lock; a second tab gets `writer-lock-held` |
| Ledger worker | A worker thread | A Web Worker, with `SharedArrayBuffer` (hence the two headers) |
| Install | The release tarball or a build of the package | A clone of the repository; not in the npm package |
