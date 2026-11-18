# private-shielded-sync

A proof of concept of a Midnight wallet that finds, reads and spends its shielded coins while the server cannot tell
which coins are its own. The server publishes a scan file of 36 bytes per shielded output; the wallet tests every entry
locally with its encryption secret key, then reads its own outputs and checks its nullifiers with single-server private
information retrieval (SimplePIR), so the server answers without learning which records were read.

This folder holds:

- `server/`: the server, an UmbraDB module (below);
- `client/`: the client, a Node.js command line (below);
- `pir/`: SimplePIR (tables, setup data, queries, answers, decoding) and the nullifier buckets;
- `shared/`: the wire formats, record layouts and the snapshot manifest;
- `kernel/`: the scan kernel, a WebAssembly build of the ownership test, decryption and Poseidon on the Midnight
  ledger's own Rust crates, with its Node.js loader and worker pool;
- `gpu/`: WebGPU versions of the scan and the PIR multiply, byte-equal to the CPU kernels, for Deno and browsers
  ([`gpu/README.md`](gpu/README.md));
- `run/sync.mjs`: runs UmbraDB with the module against a node in Docker;
- `bench/`: the benchmark of the whole flow (`bench.ts`, spec §8) and micro-benchmarks (`micro.ts`);
- `web/`: a page that runs the client one step at a time in a browser, with each step's debug output (below);
- `run/probe.ts`: checks a running server against the database it is built from, without a wallet;
- `test/`.

Neither `pir/`, `shared/` nor `kernel/` imports anything from UmbraDB, so the server module and the client use them
unchanged. The client imports nothing from `server/`; the benchmark, an operator's tool, imports both.

## Running it end to end

Every command runs from the repository's root, with Node.js 24 and Docker. The placeholders:

- `<node-ws>`: the Midnight node's WebSocket URL (for Preprod, a node of release 2.1.101);
- `<out>`: a folder outside the repository for the server's configuration, records and snapshots;
- `<data>`: a folder outside the repository for the client's wallet states, artifact cache and transfer records;
- `<secrets.env>`: a file outside the repository (mode 600) holding the secrets as environment variables, read only
  with `node --env-file`:

| Variable | Used by |
|---|---|
| `PSS_MNEMONIC_A`, `PSS_MNEMONIC_B`, … | `--wallet A`, `--wallet B`, …: the wallet's 24 words |
| `PSS_NETWORK` | `address`, `send`; `sync` and `bench.ts` check the manifest names it (`preprod`) |
| `PSS_NODE_WS`, `PSS_NODE_HTTP` | `send`: the node's WebSocket and JSON-RPC URLs |
| `PSS_INDEXER_HTTP`, `PSS_INDEXER_WS`, `PSS_BLOCKFROST_PROJECT_ID` | `send`: the indexer the Dust fee wallet reads, and its key (sent only to it, as its `project_id` header) |
| `PSS_PROOF_SERVER` | `send`: the local proof server (default `http://127.0.0.1:49343`) |

**1. Build and install.** The server runs this checkout's build; the client's Midnight packages are its own:

```sh
npm ci && npm run build
npm ci --ignore-scripts --prefix examples/private-shielded-sync/client
```

**2. Start the server**: `umbradb run` with the core modules the module needs and the module itself, PostgreSQL 18
beside it, both in Docker on one network (`run/sync.mjs`). It syncs the network from height 0 and keeps following it.
The module's settings are a JSON file; the admin secret is a random string only the operator holds:

```sh
mkdir -p <out> && chmod 700 <out>
node -e 'process.stdout.write(require("node:crypto").randomBytes(24).toString("hex"))' > <out>/pss-admin-secret
node -e 'const fs = require("node:fs"); fs.writeFileSync(process.argv[1] + "/pss.json", JSON.stringify({ dataDir: "pss-data",
  pathSplit: 16, queriesPerCall: 32, snapshotEvery: 0, threads: 6, adminSecret: fs.readFileSync(process.argv[1] + "/pss-admin-secret", "utf8") }),
  { mode: 0o600 })' <out>
PSS_NODE_WS=<node-ws> node examples/private-shielded-sync/run/sync.mjs up --label preprod --out <out> --build "$PWD" \
  --api-port 10480 --admin-port 10481 \
  --module "$PWD/examples/private-shielded-sync/server/module.ts#pssModule" --module-config <out>/pss.json
node examples/private-shielded-sync/run/sync.mjs record --label preprod --out <out> &   # until killed
curl -s http://127.0.0.1:10481/status                                                    # state, cursor, head
```

`up` prints (and appends to `<out>/runs.jsonl`) where everything listens: the module API (`api`), the admin endpoints
(`admin`) and the database (`database`, user `postgres`, database `umbradb`, password in `<out>/pg-password`). The
containers are `pss-preprod-run` and `pss-preprod-pg`. `record` appends every change of `/status` to
`<out>/status.jsonl` and the run's output to `<out>/run.log`; it follows one container, so start it again after every
`up`. A sync of Preprod from height 0 takes about a day.

The module owns no tables and declares `startsMidChain`, so it can also join a database the same script synced
without it: `sync.mjs down`, then the same `up` with `--module`; it starts above the stored cursor (or at
`--module-start <height>`). `sync.mjs config` (same arguments) writes `<out>/umbradb.config.ts` without starting
anything, for `node dist/cli/main.js config check <out>/umbradb.config.ts`.

**3. Build a snapshot** at the latest committed height (or `{"height": h}`), and wait until it is served:

```sh
A="Authorization: Bearer $(cat <out>/pss-admin-secret)"
curl -s -X POST -H "$A" -H "Content-Type: application/json" -d '{}' http://127.0.0.1:10480/pss/v1/admin/snapshot
curl -s -H "$A" http://127.0.0.1:10480/pss/v1/admin/snapshot      # again until "building" is null and "last" is ok
curl -s http://127.0.0.1:10480/pss/v1/manifest
```

With `snapshotEvery: N` the module also builds one at every multiple of N once it follows the head.

For timing at sizes the chain has not reached, the admin route also takes `"padding": N` (debug): the scan file and
both PIR tables then hold N entries, output i at slot ⌊i·N/first_free⌋ and the other slots deterministic noise
(scan entries copying real points, random read cells, random nullifiers). The manifest records `"padding": {"size":
N}` and clients map positions to slots. A build is refused with its estimate when it would need more than half the
memory available at the time, or more than half the machine's memory with the served snapshot. A 10M build needs about 14.5 GiB.
While a build runs, the status names its step.

**4. Sync wallets, read balances, check them against the ledger:**

```sh
C=examples/private-shielded-sync/client/main.ts
E=--env-file=<secrets.env>
D="--data <data> --server http://127.0.0.1:10480"
node $E $C sync --wallet A $D                 # writes <data>/wallets/A/state.json, prints the balance
node $E $C sync --wallet B $D --stats <data>/b-stats.json   # … and each step's time, bytes and requests
node $E $C balance --wallet A --data <data>   # from the local state, no network
node $E $C address --wallet B                 # mn_shield-addr_preprod1…
node $E $C cross-check --wallet A --data <data> --db-url postgres://postgres@<database>/umbradb \
  --db-password-file <out>/pg-password       # replays the stored events with the ledger; exit 1 on a difference
```

**5. Send** a part of one coin from A to B. Proving needs a local proof server of the network's ledger release (for
Preprod's ledger 9.1: `midnightntwrk/proof-server:9.0.0`); the fee wallet syncs its Dust through the indexer first
(minutes):

```sh
docker run -d --name pss-proof-server -p 127.0.0.1:49343:6300 midnightntwrk/proof-server:9.0.0
T="--wallet A $D --to $(node $E $C address --wallet B) --token <token type, 64 hex> --amount <base units>"
node $E $C send $T --dry-run      # sync, coin, path, root checks against the node, spend; no fee wallet
node $E $C send $T --no-submit    # also the fee wallet, Dust balancing, proving and validation; nothing submitted
node $E $C send $T                # submits, waits for finality, writes the record under <data>/transfers/
node $E $C sync --wallet B $D && node $E $C sync --wallet A $D   # B finds the coin; A sees the spend and the change
```

`--position <i>` picks the coin; without it, the smallest unspent coin of the token that covers the amount.

**6. Benchmark** the whole flow (below, "Benchmarks"):

```sh
node --expose-gc $E examples/private-shielded-sync/bench/bench.ts run --wallet A --wallet B --generated \
  --server http://127.0.0.1:10480 --build --admin-secret-file <out>/pss-admin-secret \
  --pss-data <out>/pss-data --sync-records <out> --status-url http://127.0.0.1:10481/status \
  --server-container pss-preprod-run \
  --db-url postgres://postgres@<database>/umbradb --db-password-file <out>/pg-password \
  --transfer <data>/transfers/<time>.json
```

**7. Stop:**

```sh
node examples/private-shielded-sync/run/sync.mjs down --label preprod --out <out>     # the database stays
node examples/private-shielded-sync/run/sync.mjs destroy --label preprod --out <out>  # run, database, volume, network
docker rm -f pss-proof-server
```

## The step-by-step page (`web/`)

A page that runs the client's own code in the browser, one step per button, and shows what each step did:

0. load the scan kernel and the ledger package (WebAssembly);
1. derive the wallet's keys from a mnemonic or a Zswap seed (or generate a test wallet);
2. get the manifest and the four shared files, each checked against the manifest;
3. scan for the wallet's outputs (one CPU thread, or WebGPU);
4. fetch read-table records by PIR, for the scan's matches or for positions typed in (any output can be fetched, to
   test before a wallet has coins in the synced range); each record is checked for ownership and, with the debug
   routes, against the stored output;
5. look up nullifiers by PIR, for the found coins' or for nullifiers typed in (or filled from stored spends);
6. get the tail, scan its outputs, and check each fetched position's full 32-hash path against the tail's root;
7. show the coins and the balance.

`explain.html`, linked from the page, explains each step on a small example chain of 9 outputs and 5 spends, in three lanes:
the wallet, the wire and the server, with time going down. It covers:
- the read table, the nullifier buckets and the tree;
- a worked SimplePIR example with small numbers, computed in the page;
- a `gpu` tag on the steps the GPU kernels speed up, and a hover on every size, showing values at 1M and 10M entries.

A side panel lists every request the server saw, with its size and time. Clicking one shows it whole: the request's
headers and body and the answer's, each with its size and SHA-256, decoded where the format is known (manifest, query
and answer bodies, tail header, scan file, block roots, setup data), as text or a hex dump (the first 64 KB; "Show
all" up to 4 MB; any size can be downloaded). The keys stay in the page's worker.

    npm ci --ignore-scripts --prefix examples/private-shielded-sync/client      # once
    node examples/private-shielded-sync/web/build.ts                            # writes web/dist/
    O=<the sync's out folder>
    node examples/private-shielded-sync/web/serve.ts --port 10490 --server http://127.0.0.1:10480 \
      --db-url postgres://postgres@127.0.0.1:<port>/umbradb --db-password-file $O/pg-password \
      --admin-secret-file $O/pss-admin-secret
    # open http://127.0.0.1:10490/

`serve.ts` serves the page cross-origin isolated (the PIR library keeps its matrices in a `SharedArrayBuffer`) on
127.0.0.1 and passes `/pss/v1/…` to the module's API, except the admin routes. `build.ts` writes a brotli and a gzip
copy of each page file, and `serve.ts` sends the one the browser accepts: the 11.9 MB of files (10.8 MB of it the
ledger's WASM) load as 4.3 MB. The PIR routes are not compressed: queries, answers and setup data are pseudorandom
and do not shrink.

Two options turn on debug routes that are no part of the private protocol:
- **`--db-url`** reads the server's database directly, so the page can compare what PIR returned with what UmbraDB
  stored, and can fill real nullifiers.
- **`--admin-secret-file`** adds `POST /debug/reload-snapshot` and a "Reload the snapshot" control in step 2. The route
  builds a new snapshot, waits for it (up to two hours), and answers with the new and previous snapshots. Its body is
  `{}` for the synced height or `{"height": h}`, and optionally `"padding": N`; the module refuses a height below the
  served snapshot's. The control's "table size" drop-down sets the padding (none, 100k, 1M, 2M, 10M, 20M, 100M) and
  shows the build's step while it runs. The control then gets the new snapshot's files and clears the later steps. The
  page never holds the secret. For example:

      curl -X POST -H 'Content-Type: application/json' -d '{"padding": 1000000}' http://127.0.0.1:10490/debug/reload-snapshot

The worker runs the client's files bundled by esbuild:
- `web/shims/` replaces the Node.js modules they import: SHA-256 from `@noble/hashes`, AES-128-CTR in plain
  TypeScript (checked equal to Node.js's), and `crypto.getRandomValues`.
- `@midnightntwrk/ledger-v9` is loaded from its `.wasm` (`web/ledger-v9.ts`).

`npx tsc -p examples/private-shielded-sync/web` type-checks the page and the worker.

## Checks

```sh
npm run typecheck                                        # includes this folder (tsconfig.json here, server/tsconfig.json)
npm run typecheck --prefix examples/private-shielded-sync/client   # the client with the wallet SDK (after its install)
npx vitest run examples/private-shielded-sync --maxWorkers=4       # the tests below
node examples/private-shielded-sync/bench/micro.ts       # micro-benchmarks, JSON under bench/results/
examples/private-shielded-sync/kernel/build.sh --check   # rebuilds the kernel in Docker, compares with the committed one
```

The `.ts` files run directly under Node.js 24 (its own type stripping): the multiply and scan worker threads load
`pir/multiply-worker.ts` and `kernel/scan-worker.ts` as they are. So the code here uses only TypeScript that strips to
JavaScript unchanged (`erasableSyntaxOnly`, `verbatimModuleSyntax`).

## The libraries in code

A server, in outline:

```ts
import { buildPositionalGrid, buildSetup, deriveSeed, gridDigest, answerQueries, WorkerMultiplier } from "./pir/index.ts";
import { decodeQueryBody, encodeAnswerBody } from "./shared/index.ts";

const workers = new WorkerMultiplier();                       // one thread fewer than the CPUs
const grid = buildPositionalGrid(count, recordBytes, records); // read table: record i at column i div perColumn
const seed = deriveSeed("read", gridDigest(grid));            // seeds the public matrix A
const setup = await buildSetup(grid, seed, workers);          // H = grid × A, published for clients
// per call:
const q = decodeQueryBody(body, grid.cols, { queriesPerCall: 32, snapshotId });
const answers = await answerQueries(grid, q.values, q.count, workers);
const reply = encodeAnswerBody({ snapshotId, count: q.count, values: answers }, grid.rows);
```

and a client:

```ts
import { buildQueries, decodeAnswers, columnRecords, positionOf, setupMatrix } from "./pir/index.ts";
import { ScanPool, encryptionSecretKeyScalar } from "./kernel/index.ts";

const secret = encryptionSecretKeyScalar(keys.encryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize());
const positions = await new ScanPool().scan(scanFile, secret);
const columns = positions.map((i) => positionOf(i, table.perColumn).column); // padded to 32 with random columns
const batch = await buildQueries(table, columns);                             // table: manifest shape + seed
// send batch.queries, receive answers
const values = await decodeAnswers(setupMatrix(setupFile, table.rows), batch, answers);
const records = values.map((v, k) => columnRecords(table, v)[positionOf(positions[k], table.perColumn).slot]);
```

## Server module (`server/`)

`server/module.ts` exports `pssModule`, a public-side module (`private-shielded-sync`) that requires `ledger-events`,
`ledger-state`, `blocks` and `config`, owns no tables and declares `startsMidChain: true`, so it can be added to a
database that is already synced, above its cursor. A configuration file imports it by path; `umbradb` resolves through
the repository's own package name, so a built checkout (`npm ci && npm run build`) serves it.

| File | Does |
|---|---|
| `declaration.ts`, `module.ts` | The declaration (only types from `umbradb`) and `defineModule` of it |
| `settings.ts` | The settings schema |
| `zswap-index.ts`, `sql.ts` | The in-memory index of outputs (by tree position) and Zswap nullifiers, and its reads |
| `tree.ts` | The commitment tree with the ledger's rules: leaves, block roots, lower paths, incremental trees, the stored root's decoding |
| `build.ts`, `build-worker.ts`, `build-host.ts` | The snapshot builder, its worker thread, and the per-step measurements |
| `store.ts` | The data directory |
| `tail.ts` | The tail's tree and body |
| `server.ts` | Points, snapshots, tail, routes, logging |

**How it works.** At start (`on-start-db`) it reads every stored `zswap-output` and `zswap-input` row of
`core_ledger_state.events` into memory; after each committed height it adds that height's events, taken from the
`ledger-events` and `ledger-state` items. Positions must be dense. A snapshot is built at a committed height S in a
worker thread from that index: the outputs at or below S must be exactly the core's `zswap_first_free` at S, and the
tree's root must equal the core's `zswap_root` at S, else the build fails and nothing is published. The latest snapshot
and the one before it are kept (and loaded again at start); the latest one's PIR tables are held in memory. The tail
(everything after S) is kept after each height, its root checked against the core's. A fault in the module is logged
and refuses builds or tails with its reason; it never halts the core's processing.

**Settings** (all `operational` but the secret):

| Setting | Default | Meaning |
|---|---|---|
| `dataDir` | required | Where snapshots are written; relative to the process's working directory |
| `pathSplit` | 16 | k, 0–20: the tree is cut k levels above the leaves; the path table holds each position's k lower siblings, read only to spend (none at 0) |
| `queriesPerCall` | 32 | Vectors in every query call |
| `snapshotEvery` | 0 | Build at every height that is a multiple of this while the node's finalized head is less than this many heights ahead; 0: only on request |
| `adminSecret` | none | `secret`, 16 characters or more: the admin routes need `Authorization: Bearer <secret>`; without one they answer 403 |
| `threads` | 0 | Threads for the PIR multiplication (answers and setup data); 0: one fewer than the CPUs, at most 8 |

**Routes** (all under `/pss/v1`; integers little-endian; errors are `{ "error": { "code", "message" } }`):

| Route | Answer |
|---|---|
| `GET /manifest` | The manifest's canonical JSON bytes; `Pss-Snapshot-Id` = its SHA-256 (the snapshot identifier). 503 `no-snapshot` before the first |
| `GET /blob/<digest>` | An artifact of the latest or previous snapshot (or a manifest by the snapshot identifier), streamed with `Range` (206, 416), `ETag`, `Cache-Control: immutable`. 404 otherwise |
| `GET /tail` | Header (132 bytes: `PSST`, version, snapshot id, height, block hash, `first_free`, root, four section lengths), then the commitments of positions T0 … F − 1 (32 each), the outputs from F on (257 each: flags, commitment, ciphertext), the nullifiers spent after S (40 each), the current roots of the blocks from T0's on (32 each) |
| `POST /query/read`, `POST /query/path`, `POST /query/nullifier` | Body `application/octet-stream`: `PSSQ`, version, snapshot id, count = `queriesPerCall`, count × C values; answer `PSSA`, version, snapshot id, count, count × R values. 409 `snapshot-replaced` (with `snapshot`) for another snapshot, 400 for another count or length, 415 for another content type |
| `POST /admin/snapshot` | JSON `{ "height"? }` (default: the latest indexed height; not below the served snapshot's): 202 and the build starts; 409 while one runs |
| `GET /admin/snapshot` | The index, the tip, the served and previous snapshots, the running and last build |

Each request is logged as one JSON line on stdout (`event: "request"`: route, status, body and answer lengths, range,
milliseconds), never its body; builds, loads and faults are logged the same way.

**Data directory.** `snapshots/<id>/` holds `manifest.json`, each artifact as the file named by its SHA-256, and
`build-stats.json`: per step (`scan`, `tree`, `readTable`, `readSetup`, `pathTable`, `pathSetup`, `nullifierTable`, `nullifierSetup`,
`manifest`) the duration, the artifact's size, the tree's hashes per second, and the process's peak resident memory
while the step ran; the index's load at start; the process's peak. `builds/` holds builds in progress (removed at
start).

**Running it**: steps 2 and 3 of "Running it end to end" above. A module entry in any UmbraDB configuration works the
same way: import `pssModule` from `server/module.ts` and add `pssModule.entry({ start, config: { dataDir, … } })`
beside the core entries (`core-chain-events`, `core-block-parsed`, `core-tx-results`, `core-ledger-state`).

## Client (`client/`)

A Node.js 24 command line that syncs a wallet with the module's routes, prints its balance, spends one coin, and checks
its result against the ledger's own replay of the stored events.

**Install.** The Midnight packages it needs (`@midnightntwrk/ledger-v9` 1.0.1, `ledger-v8` 8.1.3, the wallet SDK 2.0.0,
`@scure/bip39`, …) are in the client's own `package.json` and lock file, never in umbradb's dependencies:

```sh
npm ci --ignore-scripts --prefix examples/private-shielded-sync/client
```

**Secrets** come only from the environment, loaded from a file outside the repository with `node --env-file`: the
wallet's mnemonic (`PSS_MNEMONIC_<WALLET>` for `--wallet <WALLET>`, or the variable `--mnemonic-env` names) and, for
`send`, the indexer key (`PSS_BLOCKFROST_PROJECT_ID`) and endpoints (`PSS_NETWORK`, `PSS_NODE_WS`, `PSS_NODE_HTTP`,
`PSS_INDEXER_HTTP`, `PSS_INDEXER_WS`, `PSS_PROOF_SERVER`). Nothing secret is printed, logged or sent to the server; the
indexer key goes only to the indexer, as its `project_id` header. A generated test wallet can be given as a file holding
its 32-byte Zswap seed in hex (`--zswap-seed-file`).

The commands are in steps 4 and 5 of "Running it end to end"; `main.ts help` lists every option. State and cache live
under `--data` (default `~/.pss-client`): `wallets/<label>/state.json` (directory 700, file 600), `cache/<digest>`
(artifacts are the same for every wallet, so wallets share it) and `transfers/<time>.json`. `sync --stats <file>` and
`send`'s record include the process's peak resident memory (`client/memory.ts`).

**`sync`** (spec FR-110–115):

1. `GET /manifest`; its SHA-256 is the snapshot identifier, checked against `Pss-Snapshot-Id`.
2. The scan file, block roots and both setup-data artifacts, each by `GET /blob/<digest>` unless cached; digest and size
   checked while streaming. The block roots must give the manifest's root.
3. The scan (`kernel/`'s `ScanPool`, `--threads`): the positions whose 4 bytes match.
4. PIR reads of those positions' 98-byte records: their distinct columns in calls of exactly `queriesPerCall` vectors,
   padded with uniformly random columns; one full call when nothing matched. A record is the commitment's first 16
   bytes and ciphertext elements 1–5 shrunk to 82 bytes; the client rebuilds the elements from its own pads. Element 0
   encrypts zero, so the 224-byte ciphertext is rebuilt as point, pad 0, elements 1–5, and decrypted by the ledger's own
   decryption (the kernel's `decrypt_coin`); the coin is kept only if its commitment starts with the record's 16 bytes.
   A match that fails a check is dropped and listed as rejected. No Merkle path is read: `send` reads a coin's lower
   path from the path table (`POST /query/path`, its setup data downloaded then) and checks it against its block's root.
5. Each coin's nullifier (`coinNullifier`) looked up in the nullifier table by PIR, the same way.
6. `GET /tail`: every tail output is tested (the client has their ciphertexts), tail nullifiers mark spends, and the
   snapshot's and the tail's block roots must give the tail's root.
7. The local state: per coin its position, token type, value, nonce, commitment, nullifier, lower path (null until a
   spend reads it), source and where it was spent; the snapshot and tail it reflects; pending transfers.

A 409 (the snapshot was replaced) or a tail of another snapshot starts the sync again from the new manifest (three
attempts). Every request is recorded without its body (method, path, lengths, time) for the statistics.

**`send`** (spec FR-120–128; the transfer spike's sequence):

1. The Dust fee wallet: the wallet SDK's facade from the mnemonic's seeds, its indexer behind a loopback proxy that adds
   the Blockfrost header, its Dust wallet started at Preprod's ledger 9 fork (minutes; done first so the root is fresh).
2. A sync, the coin (the smallest unspent coin of the token that holds the amount, or `--position`), its 32 siblings:
   the lower k from its PIR record or from the tail's commitments, the upper 32 − k from the block roots. They must
   give the tail's root; the tail must be at most `--max-lag` (300) blocks behind the node's finalized head, and the
   node's `midnight_zswapStateRoot` after the tail's block must equal it. Three attempts.
3. A one-use `ZswapLocalState`: one collapsed update over 0 … i − 1 (the left siblings), `insertCoin`, one single-hash
   update per non-empty right sibling; its root checked; `spend`. The payment and the change, each `ZswapOutput.new`
   with a ciphertext to its owner; `Transaction.fromParts`.
4. Dust-only balancing, signing, proving at the local proof server (never a remote one: the proof input holds the coin
   secret key), `validateTransaction`, submission as `midnight.sendMnTransaction` through the SDK's node client, wait for
   finality. The spent coin and the change's commitment are kept as a pending transfer until a sync sees both.

A record of the transfer (public data only) is written under `<data>/transfers/`.

**`cross-check`** (spec FR-140): reads every stored `zswap-output` and `zswap-input` event up to the local state's tail
height from the database, replays them with the ledger's own `ZswapLocalState.replayRawEvents` and the wallet's keys
(ledger 8 heights with `@midnightntwrk/ledger-v8`, ledger 9 heights with `ledger-v9`, the state carried across by its
serialization), and compares every coin, spend and the unspent set with the local state. Exit code 1 on a difference.

| File | Does |
|---|---|
| `main.ts` | The command line |
| `keys.ts`, `ledger.ts` | Keys from a Zswap seed and the scan secret; the ledger package's type and loader |
| `http.ts`, `cache.ts` | Requests (recorded, no bodies) and artifacts cached by digest |
| `pir-calls.ts` | Padded PIR read and nullifier calls |
| `sync.ts`, `state.ts` | The sync and its checks; the local state and the balance |
| `tree.ts`, `send.ts`, `address.ts`, `node-rpc.ts` | Paths and collapsed updates; the spend; shielded addresses; node checks |
| `cross-check.ts` | The ledger cross-check |
| `sdk-api.ts`, `sdk/` | The wallet SDK part (seeds, fee wallet, proving, submission), loaded only when needed |

`npm run typecheck` checks the client except `sdk/`, which needs the install:
`npm run typecheck --prefix examples/private-shielded-sync/client`. The tests run the client with the repository's
vendored ledger 9 build (the same release as the npm package); the command-line test runs only with the install.

## PIR library (`pir/`)

SimplePIR ("One Server for the Price of Two", ePrint 2022/949) with fixed parameters: modulus q = 2^32 (every sum and
product wraps at 32 bits), LWE dimension n = 1024, discrete Gaussian error with σ = 6.4, uniform secret, 9 bits per
cell (p = 512, Δ = 2^23).

- **Cells** (`encode.ts`): a record's bytes are read least significant bit first and cut into 9-bit groups (the last
  zero-padded); a group's value v is stored as v − 256. A record takes E = ⌈8 × bytes / 9⌉ cells.
- **Grid** (`grid.ts`): R rows × C columns, row-major, one `Int16Array` (2 bytes per cell) in a `SharedArrayBuffer`.
  A column stacks `perColumn` records; record slot s of column j fills rows s·E … s·E + E − 1. Unused cells hold
  value 0. The read table puts record i in column `i div perColumn`, slot `i mod perColumn`, with
  `perColumn = max(1, round(√(N·E) / E))` and C = max(1, ⌈N / perColumn⌉).
- **Noise check** (`params.ts`): `8 σ (p/2) √C < Δ/2`, so at most 102,399 columns; creating a larger grid throws.
- **Table file**: a 32-byte header (magic `PSSG`, format version, reserved, then R, C, perColumn, E, record size,
  record count as 32-bit little-endian) followed by the cells as 16-bit little-endian integers, row by row. The grid
  digest is the file's SHA-256.
- **Public matrix A** (`matrix.ts`): C rows of n 32-bit words, the AES-128-CTR keystream under
  `SHA-256("umbradb-pss/A/v1" ‖ seed)[0..16]` from a zero 128-bit big-endian counter, read as little-endian words. The
  seed is `SHA-256("umbradb-pss/seed/v1" ‖ table name ‖ grid digest)`, with table names `read` and `nullifier`. Row r
  starts at counter block r·256, so a client expands A in chunks and never holds all of it.
- **Setup data** (`setup.ts`): `H = grid × A`, R × n 32-bit words, little-endian, row by row.
- **Queries, answers, decoding** (`query.ts`): for column j, a fresh uniform secret s and fresh Gaussian error e from
  the operating system's random source; `query = A·s + e + Δ·unit(j)`. The server answers `grid × query`. The client
  computes `x = answer − H·s` and each cell `round(x / Δ) + 256 mod 512`, then reassembles the column's records.
- **Multiply** (`multiply.ts`): one interface, `multiply(matrix, vectors, count, layout)`, for the server's answers
  and setup data and for the client's `A·s` and `H·s`. `WorkerMultiplier` splits the rows across `worker_threads`
  (matrix, vectors and output in shared memory); `inlineMultiplier` runs on the calling thread. The loop
  (`multiply-core.ts`) walks the matrix in tiles of 4 rows × 2,048 columns with eight register accumulators (4 rows ×
  2 vectors), so each cell is read from memory once per call and used for every vector in it.
- **Nullifier buckets** (`buckets.ts`): a record is the nullifier (32), height and transaction index (32-bit
  little-endian each), 40 bytes. A nullifier's bucket is its first `bucketBits` bits (byte 0 first, most significant
  bit first); bucket j is column j, holding `capacity` records sorted by nullifier and padded with zero records.
  `capacity` is the largest bucket's load (at least 1). `bucketBits` minimises R + C over [4, 24] among the values
  whose 2^bits columns pass the noise check (ties to the smaller). A lookup decodes the bucket's column and searches it.

## Wire formats (`shared/`)

All integers little-endian; binary bodies are `application/octet-stream`; routes under `/pss/v1`.

- **Query body** (`POST /query/read`, `POST /query/path`, `POST /query/nullifier`): magic `PSSQ` (4), format version (2), snapshot
  identifier (32), vector count (2), then count × C 32-bit values, vector by vector. Decoding is strict: exact length,
  the required vector count, and the current snapshot (a `WireError` with status 400, or 409 for another snapshot).
- **Answer body**: the same 40-byte header with magic `PSSA`, then count × R values.
- **Tail** (`GET /tail`): a 132-byte header (magic `PSST`, version, reserved, snapshot identifier, height, block hash,
  `first_free` as 64 bits, root, and the byte lengths of four sections), then the sections: commitments (32 bytes
  each), outputs (257 bytes: flags, commitment, 224-byte ciphertext), nullifier records (40 bytes), block roots (32).
- **Records** (`records.ts`): scan entry (point and the first 4 bytes of element 0, or 36 zero bytes); read record
  (98 bytes: the commitment's first 16 bytes, then element 1's first byte, element 2, element 3's first byte, element 4
  and element 5's first 16 bytes; elements zero without a ciphertext); path record (the k lower hashes, 32k bytes; zero
  outside the full blocks); tail output. Elements 1–5 hold the nonce's last byte and other 31 bytes, the token type's
  last byte and other 31 bytes, and the value; the client recovers each short message as `(element − pad) mod 2^(8b)`.
- **Manifest** (`manifest.ts`): JSON in canonical form (keys sorted, no whitespace); the snapshot identifier is its
  SHA-256. It names the network, genesis hash, height, block hash, `first_free`, root, `pathSplit`,
  `queriesPerCall`, the PIR parameters, and the digest, size and parameters of eight artifacts (six at k = 0): scan
  file, block roots, read table, read setup data, path table and path setup data (the path table as wide as the noise
  check allows, so its setup data is small), nullifier table (with `bucketBits` and `capacity`), nullifier setup data.

A ciphertext is 224 bytes throughout: the one-time point's 32-byte compressed encoding, then elements 0–5, each its
32-byte little-endian integer.

## Scan kernel (`kernel/`)

`kernel/src/lib.rs` is compiled to `wasm32-unknown-unknown` (`pss-kernel.wasm`, committed with its SHA-256 in
`pss-kernel.wasm.sha256`). It uses the ledger's published crates at the versions the `node-2.1.101` release of
`midnight-node` locks (the `ledger-9.1.0.1` crate set): `midnight-transient-crypto` 3.0.1, `midnight-coin-structure`
3.0.1, `midnight-base-crypto` 1.1.1, `midnight-serialize` 1.2.1, `midnight-curves` 0.3.1, `midnight-circuits` 7.3.0;
`Cargo.lock` holds every crate the node also locks at the node's version.

Exports, over plain linear memory (allocate with `alloc`, free with `dealloc`); every one returns 1 for success, 0 for
a rejected input, −1 for an invalid secret:

| Export | Does |
|---|---|
| `scan(entries, count, secret, out)` | The ownership test on 36-byte entries; writes matching positions. The point is decompressed without the subgroup check; only an entry whose 4 bytes match is decoded again the ledger's way (curve, canonical, prime-order subgroup, not the identity) before it counts. All-zero entries never match. |
| `scan_values(entries, count, secret, out)` | The 32-byte value the test compares, `Poseidon(k, 0)`, per entry (for checks and a future GPU kernel). |
| `pads(point, secret, out)` | The six pads `Poseidon(k, i)`, i = 0 … 5. |
| `hash2_raw(a, b, out)` | Poseidon of two field elements. |
| `decrypt_coin(ciphertext, secret, out)` | The ledger's own `SecretKey::decrypt::<CoinInfo>` (what Zswap's `try_decrypt` calls): ok flag, value (16 bytes LE), token type (32), nonce (32). |
| `leaf(commitment, out)` | `degrade_to_transient(commitment)`, the commitment's tree leaf. |
| `commitment(coin, coinPublicKey, out)` | `coinCommitment`, via the crate's `Info::commitment`. |
| `public_key(secret, out)` | `G × secret`, compressed: the bytes of the ledger package's `encryptionPublicKey`. |

Poseidon runs the crate's own permutation (`midnight_circuits::hash::poseidon::permutation_cpu`) with its partial-round
precomputation built once; the ledger's `transient_hash` builds it on every call (natively 32 µs against 11 µs per
hash). A native test checks the two agree on random inputs.

`kernel.ts` reads the `.wasm`, checks its SHA-256 against the committed one and refuses a mismatch, then instantiates
it. The module lists wasm-bindgen placeholder imports (from `reqwest`, which `midnight-base-crypto` depends on); none of
the exports calls them, and the loader binds each to a function that throws. `ScanPool` runs `scan` across worker
threads (each with its own instance) over the entries in shared memory; the thread count is an option.

### The secret: from the ledger package's key to the kernel's scalar

The kernel takes the encryption secret key's scalar, 32 bytes little-endian (`SecretKey::repr`). The TypeScript ledger
package gives it only through `EncryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize()`, which writes
the key's `Serializable` form (`transient-crypto/src/encryption.rs`: `SecretKey(EmbeddedFr)`, derived field by field;
`transient-crypto/src/curve.rs`: an `EmbeddedFr` serializes as a `ScaleBigInt` of its little-endian bytes;
`serialize/src/util.rs`: the encoding):

- the low two bits of the first byte select the form: `00` one byte (value = byte >> 2); `01` two bytes (14 bits);
  `10` four bytes (30 bits); `11` `(first >> 2) + 4` little-endian value bytes follow, the last non-zero;
- a key derived by `ZswapSecretKeys.fromSeed` is uniform below the Jubjub subgroup order (about 2^251.9), so it is
  almost always `0x73` followed by the 32 value bytes, and about one key in fifteen (top byte zero) is `0x6f` followed
  by 31 bytes.

`encryptionSecretKeyScalar(bytes)` (`kernel/secret-key.ts`) decodes either form (and the tagged form, which adds the
prefix `midnight:encryption-secret-key[v1]:`), refuses non-canonical encodings and trailing bytes, checks the value is
below the subgroup order and zero-pads it to 32 bytes. A client can confirm the conversion with
`kernel.publicKey(scalar)`, which must equal `keys.encryptionPublicKey`; the tests do this against the repository's
vendored ledger package. The scalar is a secret: it goes only to the local kernel.

### Building the kernel

`kernel/build.sh` builds in Docker with `rust:1.95-slim-bookworm` pinned by digest and the committed `Cargo.lock`
(`--locked`). `blst`, a C dependency of `midnight-curves`, needs clang and an archiver that indexes wasm objects for
this target; the script installs Debian bookworm's `clang-14` and `llvm-14` at exactly `1:14.0.6-12`. Paths are
remapped so the output does not depend on where the source sits. `--check` rebuilds into a temporary folder and
compares with the committed file and digest; `--test` runs the crate's native tests; `--vectors <dir> <count>` writes
the coin decryption fixtures. Set `PSS_KERNEL_CARGO_CACHE` to a Docker volume name to keep crate downloads between
runs. A rebuild on an x86-64 host resolves the same image index to its amd64 variant; the output has been checked only
on arm64.

## GPU kernels (`gpu/`)

`GpuScanner` and `GpuMultiplier` implement the scan's `Scanner` and the PIR library's `Multiplier` on WebGPU, with the
same outputs and refusals as `ScanPool` and `WorkerMultiplier`. Node has no WebGPU, so the server module and the
client's command line keep the CPU kernels; Deno and browsers pass a device. One command compares both with the CPU
on real-sized inputs and writes the timings to `gpu/results/`:

    deno task --config examples/private-shielded-sync/gpu/deno.json check

On an Apple M4 Max the GPU scan takes about 2.8 µs per output against about 68 µs on 8 CPU threads, and a 32-vector
read call's multiply about 14 ms against about 44 ms. [`gpu/README.md`](gpu/README.md) has the interfaces, the check
and the measurements.

## Tests

| File | Covers |
|---|---|
| `test/kernel.test.ts` | Kernel digest; all 16,384 test vectors (hit flag and full value of every entry), single- and multi-threaded; the four worked samples (point, shared point, key, pads) against an independent BigInt reference; Poseidon against that reference; an entry outside the prime-order subgroup whose 4 bytes match is rejected; coin decryption and commitments on 48 vectors; the secret conversion, `coinCommitment` and `degradeToTransient` against the vendored ledger package. |
| `test/pir.test.ts` | Cell encoding; grid shape; table file; noise check; A against AES directly; Gaussian error statistics; PIR read equals direct read for random tables and positions, every position of a table, a 705-byte table across threads, an empty table; two queries for one column differ in every value; the multiply interface. |
| `test/buckets.test.ts` | Nullifier records; bucket bits; sorted, padded buckets; the `bucketBits` choice against brute force; PIR lookups of present and absent nullifiers equal direct lookups. |
| `test/wire.test.ts` | Query, answer and tail formats with their strict checks; record layouts; the manifest's canonical form and identifier. |
| `test/server-tree.test.ts` | The tree's roots against the vendored ledger's stored `zswap_root` (k 0–3, 16, 20); incremental, block and tail trees against a naive recursion of the ledger's rules. |
| `test/server-build.test.ts` | The builder on real v9 ledger events (`test/server-chain.ts`): manifest, scan file, block roots, every read record and nullifier by PIR, determinism, a wrong root or `first_free`, dense positions, the worker thread, an empty chain. |
| `test/server-module.test.ts` | The module in UmbraDB's real process on PostgreSQL 18 over a tape of the same chain: story 1, the tail, both query routes with a PIR round trip, refusals, the admin guard, builds on request (a changed stored root fails), pruning, logging, a restart, joining a synced database. |
| `test/client-sync.test.ts` | The client against the module in the real process (PostgreSQL 18) over the synthetic chain, snapshot at 4 and tail to 7: three wallets' coins, spends and balances equal the ledger's replay (FR-140, SC-001) and the wallets' own local states; identical request shapes (FR-142); no key, public key, nullifier or commitment in any request (FR-143); one full call with no coins; cache; local state file; rejected matches (FR-111); a snapshot replaced mid-sync. |
| `test/client-send.test.ts` | Paths give the core's root (FR-121); spends from PIR, partial-block and tail paths accepted by the chain's Zswap state, outputs found by both wallets; a wrong sibling refused; collapsed-update bytes equal the ledger's (FR-123); coin choice; pending transfers (FR-128); shielded addresses (and, with the install, equal to the SDK's codec and the npm package's keys). |
| `test/client-fork.test.ts` | Across a ledger 8 → 9 upgrade: ledger 8 coins and spends, a ledger 8 coin spent under ledger 9; the client equals the replay with both packages. |
| `test/client-cli.test.ts` | With the install: `sync`, `balance`, `address`, `cross-check` (and a negative control) as separate processes. |
| `test/server-config.test.ts` | `run/sync.mjs config` and `umbradb config check` on a built checkout (type check with erasable syntax, evaluation, settings), and a negative control. |
| `test/bench-run.test.ts` | The benchmark against the module in the real process (PostgreSQL 18) over the synthetic chain, wallets A, B and C: every cell of spec §8 has a value for the server and each client, and the report renders it; the snapshot's counts and versions; per-step values and the server's times from its log; the naive baseline; the read table at k = 16, 8, 2 and 0 (k 2 gives the served snapshot); the server's view of every request and identical request shapes; the scan by thread count; the transfer row (and a dry-run record); no key, seed, nonce or nullifier in `results.json`; exactly the cells without their input reported missing; `--build`; the command line (`run`, `report --transfer`, with the install); log pairing, speed and formatting rules. |

Fixtures (`test/fixtures/`): `entries.bin`, `pads.bin`, `mine.bin`, `scalar.bin` and `sample.txt` are 16,384 scan
entries made with the ledger's `encrypt` (about one in a thousand to the test key), the ledger's value for each, which
are the test key's, the test key's scalar, and four worked entries. `coins.bin`, `coin-secret.bin` and
`coin-public-key.bin` are 48 coins encrypted with the ledger's `encrypt` (two thirds to the test key) with their
commitments, written by `kernel/build.sh --vectors`. `poseidon-constants.json` holds `midnight-circuits` 7.3.0's
Poseidon constants (Apache-2.0) for the BigInt reference. Every key in the fixtures is a test key from a fixed seed.

## Benchmarks

### The whole flow (`bench/bench.ts`, spec §8)

`bench.ts run` runs the flow of spec §1 against a running server for one or more wallets and writes `results.json`
and `REPORT.md` under `bench/results/<date>-<network>/` (or `--out`): the machine, the software versions, the network,
the snapshot's height, output and nullifier counts, and a value for every cell of spec §8, for the server and for each
wallet's client on their own rows (FR-151), then the naive baseline (FR-152), the read table at k = 16, 8 and 0
(FR-153), the scan by thread count, and what the server observed (FR-154). A cell whose input was not given says so;
the run's log names the cells still without a value. `bench.ts help` lists every option.

In order, it:

1. with `--build`, asks the server for a snapshot at its latest height (the admin route) and waits until it is served;
2. reads the manifest, and the snapshot's `build-stats.json` from the module's data directory (`--pss-data`);
3. syncs each wallet with the client's own `sync()` as a fresh client (an empty cache, its own scan and PIR threads),
   one after the other, timing each step and sampling the peak memory of its own process and of the server meanwhile;
4. scans the snapshot's scan file at each `--scan-threads` count;
5. with `--db-url`: the database's size; the snapshot's stored events read with the module's own query; for each
   `--path-splits` k, the module's own builder run in-process on them (a temporary directory; the build checks the
   core's root, and at the served k it reproduces the served snapshot's identifier) and one read call of
   `queriesPerCall` vectors with client and server in the benchmark's process;
6. reads the server's request lines (`--server-container`: `docker logs`; or `--server-log <file>`) and pairs each with
   the client's request; computes the sync's speed from `--sync-records` and reads the transfer from `--transfer`.

| Row of spec §8 | Source |
|---|---|
| Chain sync | `--db-url` (size per schema), `--sync-records` (`status.jsonl`: heights per second while syncing, restarts left out) |
| Read events for a snapshot | The module's query for every Zswap row up to the snapshot height, run by the benchmark (`--db-url`) |
| Build scan file, tree and paths, read and nullifier tables and setup data | The snapshot's `build-stats.json` (`--pss-data`); without it, the benchmark's own build at the served k |
| Download, scan, read coins, nullifier lookups, tail, whole `sync` (client) | Each wallet's sync, step by step (`client/sync.ts`'s `onStep`) |
| Read coins, nullifier lookups (server) | The module's request line for the call (decode, multiply, encode: `--server-container` or `--server-log`); its memory from `docker stats` (`--server-container`) or `ps` (`--server-pid`) |
| Transfer | The record `send` wrote (`--transfer`); "not run" without it |

The client's memory is the benchmark process's (each wallet runs in it, one after the other; `node --expose-gc` lets it
collect between wallets). `docker stats` reports the container's memory about every 0.5–1 s, so a call shorter than
that gets the nearest samples. The results hold wallet labels and counts only: no key, position, value or nullifier.

`bench.ts report <results.json> [--transfer <record>] [--out <dir>]` renders `REPORT.md` again, adding a transfer
record: the head report can be produced before the transfer and completed after it.

**The Preprod report.** With the sync at the node's finalized head and the transfer of step 5 done:

```sh
O=<out>                                     # run/sync.mjs's output folder (the patched sync's)
node --expose-gc --env-file=<secrets.env> examples/private-shielded-sync/bench/bench.ts run \
  --wallet A --wallet B --generated --server http://127.0.0.1:10480 --network preprod \
  --build --admin-secret-file $O/pss-admin-secret --pss-data $O/pss-data --sync-records $O \
  --status-url http://127.0.0.1:10481/status --server-container pss-patched-run \
  --db-url postgres://postgres@127.0.0.1:58171/umbradb --db-password-file $O/pg-password \
  --threads 8 --scan-threads 1,2,4,8 --path-splits 16,8,0 \
  --transfer <data>/transfers/<time>.json
```

It writes `bench/results/<date>-preprod/`; the log's last line must say that every cell of spec §8 has a value
(SC-005). Commit that folder.

### Micro-benchmarks (`bench/micro.ts`)

`bench/micro.ts` measures the scan (per entry, per thread count) and, for 10,000, 100,000 and 1,000,000 records of 704
and 40 bytes, building the grid and its digest, the setup data, the server's answer to 1 and 32 vectors, and the
client's query build and decode (one thread and worker threads). It checks every decoded record and writes JSON to
`bench/results/micro-<date>.json`.
