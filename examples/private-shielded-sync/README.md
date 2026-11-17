# private-shielded-sync

A proof of concept of a Midnight wallet that finds, reads and spends its shielded coins while the server cannot tell
which coins are its own. The server publishes a scan file of 36 bytes per shielded output; the wallet tests every entry
locally with its encryption secret key, then reads its own outputs and checks its nullifiers with single-server private
information retrieval, so the server answers without learning which records were read. Two PIR schemes are available,
chosen per snapshot: SimplePIR (the default) and IPIR+SP (spec 00058, below), which removes the large per-snapshot
download at the cost of a larger upload per call.

The wallet also follows its Dust (spec 00062, below, "Dust"): the server publishes every Dust spend of the current
ledger era as one file of about 9 bytes per spend; the wallet finds its own spends in it by a 4-byte nullifier prefix,
derives its coins with the ledger's own functions, and confirms each chain's last coin with one PIR read.

This folder holds:

- `server/`: the server, an UmbraDB module (below);
- `client/`: the client, a Node.js command line (below);
- `pir/`: the scheme interface both schemes implement (`scheme.ts`), SimplePIR (tables, setup data, queries, answers,
  decoding), IPIR+SP's table layout and its server and wallet sides, and the nullifier buckets;
- `ipir/`: IPIR+SP's Rust workspace: the upstream crates it is built on (`vendor/`), the proof of concept's layer over
  them (`core/`), the server's native add-on (`node/`) and the wallet's WebAssembly (`wasm/`, built into
  `pss-ipir.wasm`), with their TypeScript loaders (below, "IPIR+SP");
- `shared/`: the wire formats, record layouts and the snapshot manifest;
- `kernel/`: the scan kernel, a WebAssembly build of the ownership test, decryption and Poseidon on the Midnight
  ledger's own Rust crates, with its Node.js loader and worker pool;
- `gpu/`: WebGPU versions of the scan, SimplePIR's multiply and IPIR+SP's answer, byte-equal to the CPU kernels, for
  Deno and browsers ([`gpu/README.md`](gpu/README.md));
- `run/sync.mjs`: runs UmbraDB with the module against a node in Docker;
- `bench/`: the benchmark of the whole flow (`bench.ts`, spec §8), micro-benchmarks (`micro.ts`), the Dust file's
  sizes on a real chain (`dust-sizes.ts`) and the Dust walk's time on a synthetic file (`dust-walk.ts`);
- `web/`: a page that runs the client one step at a time in a browser, with each step's debug output (below);
- `run/probe.ts`: checks a running server against the database it is built from, without a wallet;
- `test/`.

Neither `pir/`, `shared/`, `ipir/` nor `kernel/` imports anything from UmbraDB, so the server module and the client use
them unchanged. The client imports nothing from `server/`; the benchmark, an operator's tool, imports both.

`ipir/vendor/` is upstream code, copied unchanged under `MIT OR Apache-2.0` (below, "IPIR+SP", and
[`ipir/vendor/ORIGIN.md`](ipir/vendor/ORIGIN.md)).

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
| `PSS_INDEXER_HTTP`, `PSS_INDEXER_WS`, `PSS_BLOCKFROST_PROJECT_ID` | `send` with `--dust-fee sdk` (the default): the indexer the Dust fee wallet reads, and its key (sent only to it, as its `project_id` header); `--dust-fee private` needs none |
| `PSS_PROOF_SERVER` | `send`: the local proof server (default `http://127.0.0.1:49343`) |

**1. Build and install.** The server runs this checkout's build; the client's Midnight packages are its own:

```sh
npm ci && npm run build
npm ci --ignore-scripts --prefix examples/private-shielded-sync/client
examples/private-shielded-sync/ipir/build.sh native     # only for IPIR+SP snapshots: the server's add-on (Rust, rustup)
```

The wallet's IPIR+SP WebAssembly (`ipir/pss-ipir.wasm`) is committed; the add-on is built per machine and git ignores
it. Without the add-on the server builds and serves SimplePIR snapshots only (below, "IPIR+SP").

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

The snapshot's PIR scheme is the setting `scheme` (`simplepir` by default, or `ipir-sp`); the admin body's `"scheme"`
overrides it for one build, so both schemes can be built at one height one after the other, for example
`-d '{"height": 3439524, "scheme": "ipir-sp"}'`. The manifest names the scheme and the wallet follows it. The server
serves the latest snapshot and keeps the one before it. The Docker launch above was not run with IPIR+SP (spec 00058
keeps it on SimplePIR): the add-on is built for the host, and one built on macOS does not load in its Linux container,
so there the scheme is unavailable (below).

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
node $E $C send $T --dust-fee private --no-submit   # the fee paid by the wallet's own Dust coin (below, "Dust"): no indexer
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
6. read lower Merkle paths from the path table by PIR, as a spend does (its public artifact is downloaded then), each
   checked against its block's root;
7. get the tail, scan its outputs, and check each fetched position's full 32-hash path against the tail's root;
8. show the coins and the balance;
9. Dust (below, "Dust"): get the Dust file, the parameters and the wallet's first coins and generation updates, with
   the Dust seed of the mnemonic step 1 took (a wallet given by its Zswap seed has none); chunks and the check table's
   public artifact are kept by SHA-256 for the page's life, so a second run downloads only the new ones, and the step
   says how many came from the cache;
10. walk each Dust chain through the file, locally: per chain, the first coin, the spends found with their file
    entries, and the current coin (sequence number, position, creation time, value, commitment);
11. check each chain's end by PIR in the Dust check table, all chains in calls padded to the same number of requests,
    dropping a false match; per chain checked, dropped or not checkable, and the Dust sync's bytes split as the
    command line splits them;
12. read the paying coin's Merkle path (its lower siblings by PIR from the Dust snapshot's path table in one padded
    call, the upper ones from the public block roots), download the generation records, build the ledger's Dust local
    state, check both its roots against the snapshot's, and spend the coin in memory for the fee of a transaction
    holding only that spend; the path read's bytes, the roots compared and the fee. Nothing is proven or sent.

The page runs on either scheme, following the manifest. On an IPIR+SP snapshot the worker also fetches
`pss-ipir.wasm` (beside the page; `build.ts` copies it and builds its committed SHA-256 into the worker) and compiles
it only if the digest matches; a SimplePIR snapshot never fetches it. Every panel that shows sizes or shapes speaks for the scheme in use: SimplePIR's setup data, grid and query vectors as before; IPIR+SP's
masks, rows × columns of 16-bit cells with records per row, and each request's and answer's byte counts.

A call's work is spread over Web Workers: one fewer than the browser's processors, at most 8.
- IPIR+SP: the call's 32 requests are dealt to `ipir-worker.js` workers (`ipir/pool.ts`), each with its own instance of
  the WebAssembly and its secrets drawn from that worker's `crypto.getRandomValues`.
- SimplePIR: the two multiplications of a call (`A × s` to build it, `H × s` to decode its answer) are split by rows
  over `multiply-worker.js` workers on shared memory (`web/multiply-web.ts`). Expanding the public matrix A and
  sampling the errors stay on the client's thread.
- The page starts these workers and hands each to the client over a `MessagePort` (`web/call-workers.ts`): a worker
  that starts its own workers fails to load them in some embedded browsers.

`explain.html`, linked from the page, explains each step on a small example chain of 9 outputs and 5 spends, in three lanes:
the wallet, the wire and the server, with time going down. It covers:
- the read table, the nullifier buckets and the tree;
- a worked SimplePIR example with small numbers, computed in the page, and one slide on what IPIR+SP changes for the
  wallet, with its measured sizes at today's chain size;
- a `gpu` tag on the steps the GPU kernels speed up, and a hover on every size, showing values at 1M and 10M entries;
- one slide on Dust (steps 9 to 11): the file, the walk and the check, and what the server sees (the Dust public key).

A side panel lists every request the server saw, with its size and time. Clicking one shows it whole: the request's
headers and body and the answer's, each with its size and SHA-256, decoded where the format is known (manifest, query
and answer bodies, tail header, scan file, block roots, setup data or masks), as text or a hex dump (the first 64 KB;
"Show all" up to 4 MB; any size can be downloaded). An IPIR+SP query body is decoded request by request: the header and
setup id, the 27,648-byte key, one 49-bit number per row; its answer as the header with the SHA-256 of its request
(checked against the request sent) and one 22-bit number per column. The keys stay in the page's worker.

    npm ci --ignore-scripts --prefix examples/private-shielded-sync/client      # once
    node examples/private-shielded-sync/web/build.ts                            # writes web/dist/
    O=<the sync's out folder>
    node examples/private-shielded-sync/web/serve.ts --port 10490 --server http://127.0.0.1:10480 \
      --db-url postgres://postgres@127.0.0.1:<port>/umbradb --db-password-file $O/pg-password \
      --admin-secret-file $O/pss-admin-secret
    # open http://127.0.0.1:10490/

`serve.ts` serves the page cross-origin isolated (the PIR library keeps its matrices in a `SharedArrayBuffer`) on
127.0.0.1 and passes `/pss/v1/…` to the module's API, except the admin routes. `build.ts` writes a brotli and a gzip
copy of each page file, and `serve.ts` sends the one the browser accepts: the 12.0 MB of files (10.8 MB of it the
ledger's WASM) load as 4.3 MB. The PIR routes are not compressed: queries, answers and public artifacts are
pseudorandom and do not shrink. `--dir <folder>` serves a build written elsewhere (`build.ts --out <folder>`).

Two options turn on debug routes that are no part of the private protocol:
- **`--db-url`** reads the server's database directly, so the page can compare what PIR returned with what UmbraDB
  stored, and can fill real nullifiers.
- **`--admin-secret-file`** adds `POST /debug/reload-snapshot` and a "Reload the snapshot" control in step 2. The route
  builds a new snapshot, waits for it (up to two hours), and answers with the new and previous snapshots. Its body is
  `{}` for the synced height or `{"height": h}`, and optionally `"padding": N` and `"scheme": "simplepir"` or
  `"ipir-sp"` (the module's setting without it); the module refuses a height below the served snapshot's and a scheme
  it does not have. The control's "table size" drop-down sets the padding (none, 100k, 1M, 2M, 10M, 20M, 100M), its
  "PIR scheme" drop-down the scheme, so one page can switch the same height between the two schemes; it shows the
  build's step while it runs, then gets the new snapshot's files and clears the later steps. The page never holds the
  secret. For example:

      curl -X POST -H 'Content-Type: application/json' -d '{"padding": 1000000}' http://127.0.0.1:10490/debug/reload-snapshot
      curl -X POST -H 'Content-Type: application/json' -d '{"height": 3439524, "scheme": "ipir-sp"}' http://127.0.0.1:10490/debug/reload-snapshot

The page was checked on both schemes in Chromium against a Preprod snapshot at 3,439,524 (69,329 outputs), and on
both padded to 1,000,000 entries. Each call moved the bytes the command line's does. Read calls of 32 requests,
measured in the page at 1,000,000 entries (height 3,444,622):

| Scheme | Build, one thread | Build, 8 workers | Decode, one thread | Decode, 8 workers |
|---|---|---|---|---|
| IPIR+SP | 375 ms | 49–58 ms | 1.5 ms | 1–3 ms |
| SimplePIR | 279–346 ms | 180–207 ms | 80–110 ms | 13–15 ms |

SimplePIR's remaining build time is the expansion of A (AES-128-CTR in TypeScript) and the error sampling, on one
thread. At the real size, on one thread, an IPIR+SP read call took about 250 ms to build and 0.5 ms to decode, and
SimplePIR's about 100 ms and 24 ms; the workers were not timed at that size.

The worker runs the client's files bundled by esbuild:
- `web/shims/` replaces the Node.js modules they import: SHA-256 from `@noble/hashes`, AES-128-CTR in plain
  TypeScript (checked equal to Node.js's), and `crypto.getRandomValues`.
- `@midnightntwrk/ledger-v9` is loaded from its `.wasm` (`web/ledger-v9.ts`).

`web/scheme-view.ts` holds what the page shows of each scheme (table lines, call plans, the body and artifact
decoders, the digest-checked compile), without the DOM, so `test/web-scheme-view.test.ts` checks it under Node. The
Dust steps are `web/dust-steps.ts` (the command line's `dust` and `dust --spend`, from `client/dust.ts`,
`client/dust-check.ts` and `client/dust-spend.ts`, cut into the four steps) and `web/dust-view.ts` (the chains, bytes
and spend as the page shows them), both without the DOM, so `test/server-web-dust.test.ts` runs them under Node in
both schemes. The request panel decodes the Dust routes too: a chunk's header and the bytes of each part, the Dust
snapshot's public files (the check and path tables' public artifacts, the block roots, the generation records), and
the check and path tables' query and answer bodies.
`npx tsc -p examples/private-shielded-sync/web` type-checks the page and the worker.

## Checks

```sh
npm run typecheck                                        # includes this folder (tsconfig.json here, server/tsconfig.json)
npm run typecheck --prefix examples/private-shielded-sync/client   # the client with the wallet SDK (after its install)
npx vitest run examples/private-shielded-sync --maxWorkers=4       # the tests below (the IPIR+SP ones need the add-on)
node examples/private-shielded-sync/bench/micro.ts       # micro-benchmarks, JSON under bench/results/
examples/private-shielded-sync/kernel/build.sh --check   # rebuilds the kernel in Docker, compares with the committed one
examples/private-shielded-sync/ipir/build.sh --check     # rebuilds pss-ipir.wasm, compares with the committed one
(cd examples/private-shielded-sync/ipir && cargo test --release)   # the IPIR+SP core crate's round trips
```

The `.ts` files run directly under Node.js 24 (its own type stripping): the multiply, scan and IPIR+SP worker threads
load `pir/multiply-worker.ts`, `kernel/scan-worker.ts` and `ipir/pool-worker-node.ts` as they are. So the code here uses only TypeScript that strips to
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
| `dust-index.ts` | The Dust events of the current ledger era: the Dust file, first coins and updates by owner, the parameters, the commitments by position (below, "Dust") |
| `dust-check.ts`, `dust-check-worker.ts` | The Dust snapshot's builder (check table, commitment tree, path table, generation records) and its worker thread |
| `dust-tree.ts` | The Dust commitment tree (the Zswap tree's code) and every position's lower path, the last partial block's too |

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
| `scheme` | `simplepir` | The PIR scheme of the next snapshot: `simplepir`, or `ipir-sp` where this build has it (its add-on; a build of a scheme it lacks is refused, 501 `scheme-unavailable`) |
| `queriesPerCall` | 32 | Requests in every query call (SimplePIR's query vectors) |
| `snapshotEvery` | 0 | Build at every height that is a multiple of this while the node's finalized head is less than this many heights ahead; 0: only on request |
| `adminSecret` | none | `secret`, 16 characters or more: the admin routes need `Authorization: Bearer <secret>`; without one they answer 403 |
| `threads` | 0 | Threads for SimplePIR's multiplication (answers and setup data); 0: one fewer than the CPUs, at most 8. IPIR+SP's add-on answers on its own thread pool (all cores; no limit is set) |
| `dustEraHeight` | 3,348,434 | The first height of the ledger era the Dust file covers (Preprod's); events below it are not read (below, "Dust") |

**Routes** (all under `/pss/v1`; integers little-endian; errors are `{ "error": { "code", "message" } }`):

| Route | Answer |
|---|---|
| `GET /manifest` | The manifest's canonical JSON bytes; `Pss-Snapshot-Id` = its SHA-256 (the snapshot identifier). 503 `no-snapshot` before the first |
| `GET /blob/<digest>` | An artifact of the latest or previous snapshot (or a manifest by the snapshot identifier), streamed with `Range` (206, 416), `ETag`, `Cache-Control: immutable`. 404 otherwise |
| `GET /tail` | Header (132 bytes: `PSST`, version, snapshot id, height, block hash, `first_free`, root, four section lengths), then the commitments of positions T0 … F − 1 (32 each), the outputs from F on (257 each: flags, commitment, ciphertext), the nullifiers spent after S (40 each), the current roots of the blocks from T0's on (32 each) |
| `POST /query/read`, `POST /query/path`, `POST /query/nullifier` | Body `application/octet-stream`: `PSSQ`, version, snapshot id, count = `queriesPerCall`, count requests of the table's scheme (SimplePIR: C values each; IPIR+SP: `36 + 27,648 + ⌈49·rows/8⌉` bytes each); answer `PSSA`, version, snapshot id, count, count responses (SimplePIR: R values each; IPIR+SP: `68 + ⌈22·cols/8⌉` bytes each). 409 `snapshot-replaced` (with `snapshot`) for another snapshot, 400 for another count or length, 400 `invalid-query` for IPIR+SP requests made for another table's setup, 415 for another content type |
| `POST /admin/snapshot` | JSON `{ "height"?, "padding"?, "scheme"? }` (default: the latest indexed height, not below the served snapshot's; the settings' scheme): 202 and the build starts; 409 while one runs; 400 `invalid-scheme`, 501 `scheme-unavailable`; 507 for a padded build too large (`padding-too-large` for memory, `table-too-large` for an IPIR+SP table over its cell limit) |
| `GET /admin/snapshot` | The index, the tip, the served and previous snapshots, the running and last build, the Dust index and the Dust snapshot (with the bytes its check and path tables hold) |
| `GET /dust/…`, `POST /dust/check/query`, `POST /dust/check/path` | The Dust file, a key's first coins, the Dust parameters and the Dust snapshot (check table, path table, public files): below, "Dust" |

Each request is logged as one JSON line on stdout (`event: "request"`: route, status, body and answer lengths, range,
milliseconds), never its body; builds, loads and faults are logged the same way.

**Data directory.** `snapshots/<id>/` holds `manifest.json`, each artifact as the file named by its SHA-256, and
`build-stats.json`: per step (`scan`, `tree`, `readTable`, `readSetup`, `pathTable`, `pathSetup`, `nullifierTable`, `nullifierSetup`,
`manifest`) the duration, the artifact's size, the tree's hashes per second, and the process's peak resident memory
while the step ran; the index's load at start; the process's peak. Under IPIR+SP the `…Setup` steps are the add-on's
setup of each table, and carry its report (`scheme`: the stage times and the build check's largest phase error). `builds/`
holds builds in progress (removed at start). At start the latest snapshot and the one before it are loaded again; an
IPIR+SP table is set up again from its file and refused unless its masks equal the stored ones, and a stored snapshot
of a scheme this build cannot open (IPIR+SP without its add-on) is ignored (`snapshot-ignored`).

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
2. The scan file, block roots and the read and nullifier tables' public artifacts (SimplePIR's setup data, IPIR+SP's
   masks), each by `GET /blob/<digest>` unless cached; digest and size checked while streaming. The block roots must
   give the manifest's root. The manifest's scheme is opened; a scheme this client lacks stops the sync with a message
   naming it.
3. The scan (`kernel/`'s `ScanPool`, `--threads`): the positions whose 4 bytes match.
4. PIR reads of those positions' 98-byte records: their distinct groups (SimplePIR's columns, IPIR+SP's rows) in calls
   of exactly `queriesPerCall` requests, padded with uniformly random groups; one full call when nothing matched. A record is the commitment's first 16
   bytes and ciphertext elements 1–5 shrunk to 82 bytes; the client rebuilds the elements from its own pads. Element 0
   encrypts zero, so the 224-byte ciphertext is rebuilt as point, pad 0, elements 1–5, and decrypted by the ledger's own
   decryption (the kernel's `decrypt_coin`); the coin is kept only if its commitment starts with the record's 16 bytes.
   A match that fails a check is dropped and listed as rejected. No Merkle path is read: `send` reads a coin's lower
   path from the path table (`POST /query/path`, its public artifact downloaded then) and checks it against its block's
   root.
5. Each coin's nullifier (`coinNullifier`) looked up in the nullifier table by PIR, the same way.
6. `GET /tail`: every tail output is tested (the client has their ciphertexts), tail nullifiers mark spends, and the
   snapshot's and the tail's block roots must give the tail's root.
7. The local state: per coin its position, token type, value, nonce, commitment, nullifier, lower path (null until a
   spend reads it), source and where it was spent; the snapshot and tail it reflects; pending transfers.

A 409 (the snapshot was replaced) or a tail of another snapshot starts the sync again from the new manifest (three
attempts). Every request is recorded without its body (method, path, lengths, time) for the statistics.

On an IPIR+SP snapshot `sync`, `send` and `cross-check` work the same way. For `sync` and `send`'s path read the
command line reads `ipir/pss-ipir.wasm` and compiles it only if its SHA-256 equals `ipir/pss-ipir.wasm.sha256`
(`compileIpirWasm`); a missing file or another digest stops the wallet with a message naming the file, and a SimplePIR
snapshot never reads it. Code that calls `sync()` itself passes a function giving the compiled module as
`SyncOptions.ipirWasm`.

A call's 32 IPIR+SP requests are made on `--threads` worker threads (`nodeIpirPool`, `ipir/pool-node.ts`; given to
`sync()` as `SyncOptions.ipirWorkers`), started only for an IPIR+SP snapshot: request `q` goes to worker
`q mod threads`, each worker has its own instance of the WebAssembly, and the worker that made a request decodes its
answer. With 8 threads a call builds in about 32 ms instead of 245 ms (45 ms instead of 357 ms at 1,000,000 records).
With `--threads 1`, or without `ipirWorkers`, the requests are made one after the other on the calling thread.

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

With `--dust-fee private`, step 1 is skipped (no SDK wallet, no indexer) and step 4's fee comes from the wallet's own
Dust coin (below, "Dust", "Spending a Dust coin"): the Dust sync with the check, the coin's path read by PIR, the
ledger's Dust local state, a balancing intent spending the coin, then proving at the local proof server with the SDK's
HTTP prover client, binding, and the SDK's own well-formedness check (`Capabilities.v9WellFormedCheck`, what
`validateTransaction` runs) against the ledger parameters the module serves; submission as above.

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
| `dust.ts`, `dust-check.ts` | The Dust sync: the file's download, the walk of each chain, the check of each chain's last coin, a coin's path (below, "Dust") |
| `dust-spend.ts` | The paying Dust coin, the ledger's Dust local state from its path and the generation records, the fee paid with it (below, "Dust") |
| `sdk-api.ts`, `sdk/` | The wallet SDK part (seeds, fee wallet, proving, validation, submission), loaded only when needed |

`npm run typecheck` checks the client except `sdk/`, which needs the install:
`npm run typecheck --prefix examples/private-shielded-sync/client`. The tests run the client with the repository's
vendored ledger 9 build (the same release as the npm package); the command-line test runs only with the install.

## PIR library (`pir/`)

`pir/scheme.ts` is the interface a scheme implements, above its arithmetic. A table holds records in groups: a request
selects one group, and its answer gives all of the group's records (SimplePIR's group is a column, IPIR+SP's a row).
Each table has a table file the server loads and a public artifact every wallet downloads once per snapshot. The
server side (`pir/server-schemes.ts`, Node.js only) lays a table out, sets it up and answers calls; the wallet side
(`pir/wallet-schemes.ts`, also bundled into the page) opens a table from its manifest entry and public artifact, makes
a call's requests and decodes the answer. What stays common: which record goes in which table, the padding of calls
with random groups, the call header, the routes and the rest of the manifest. IPIR+SP is described in its own section
below; the rest of this section is SimplePIR.

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

## IPIR+SP (`ipir/`)

IPIR+SP is the PIR scheme of the Zcash wallet services (`valargroup/ipir-sp`): SimplePIR's pass over the table on the
server, followed by a Ring-LWE packing step (InsPIRe, ePrint 2025/1352; ReinsPIRe, ePrint 2026/1934) that shrinks the
answer and replaces SimplePIR's setup data with two small public masks per table. In exchange every request carries its
own key, so a wallet uploads more per call and downloads far less per snapshot. The Rust code is upstream's, unchanged;
this folder adds a thin layer over it, a native add-on for the server and a WebAssembly file for the wallet.

**Profile** (upstream's deployed native two-mask profile; `ipir/sizes.ts`, `ipir/core/`): ring size 2,048, modulus
q = 2^54, 16-bit cells, key digits of base 2^19 × 2, secret and error from a discrete Gaussian with σ = 6.4, two
published masks rounded to 29 bits, the query rounded to 49 bits per row (nearest), the answer to 22 bits per column.
The manifest records it as `pir`; a wallet refuses a snapshot whose parameters differ from its own.

**Tables** (`pir/ipir/shape.ts`, `pir/ipir/encode.ts`): rows × columns of 16-bit cells, both multiples of 2,048, at
most 2^30 cells and at most 32,768 rows. A request selects a row; a record of B bytes takes ⌈B/2⌉ cells, and a row
holds ⌊columns / cells per record⌋ records. The shape is the one whose request plus answer is the fewest bytes,
`36 + 27,648 + ⌈49·rows/8⌉ + 68 + ⌈22·columns/8⌉` (ties to fewer cells, then fewer rows). The nullifier table has 2^bits
rows (bits 11 to 15), a row holding the fullest bucket. The row cap keeps upstream's correctness certificate below
2^-128 with 49-bit queries; a table that needs more cells grows in columns. At k = 16 a path record is 256 cells, so the
path table holds at most 4,194,304 records: a padded build above that is refused (507 `table-too-large`).

**Artifacts.** The table file is the raw column-major cells (`2 × rows × cols` bytes, no header). Its SHA-256 seeds the
table (`deriveSeed(name, digest)`, as under SimplePIR) and is the setup's snapshot input, so the same records give the
same masks and snapshot identifier. The public artifact is the table's masks: `RNP3`, the 32-byte setup id, then two
masks of 29 bits per column (`36 + ⌈58·cols/8⌉` bytes). The add-on holds the cells and the compiled packing matrices
(33,587,200 bytes per 2,048 columns); only the cells and the masks are stored, so a restarted server sets every table up
again from its file and checks that the masks come out equal.

**A call.** The common 40-byte header, then `queriesPerCall` requests, each with its own fresh secret and key:
`RNQ3`, the setup id, the key (2 × 2,048 numbers of 54 bits, 27,648 bytes), one 49-bit number per row;
`36 + 27,648 + ⌈49·rows/8⌉` bytes (40,228 at 2,048 rows, 228,388 at 32,768). The answer: the header, then per request
`RNR2`, the setup id, the SHA-256 of the request, one 22-bit number per column, `68 + ⌈22·cols/8⌉` bytes. Requests made
for another table's setup are refused before any work (400 `invalid-query`). The add-on answers the requests of a call
one after another, each on rayon's thread pool (all cores), never on Node's main thread. The wallet decodes only
the wanted requests' answers and frees every request's secret after the call.

**Sizes**, measured on this example's Preprod stack at height 3,439,524 (69,329 outputs, 57,812 nullifiers):
- real size: the three tables are 2,048 × 2,048, 2,048 × 10,240 and 2,048 × 2,048 cells; a wallet downloads 29,768
  bytes of masks per snapshot for the read and nullifier tables, against SimplePIR's 16,875,520 bytes of setup data; a
  read call is 1,287,336 bytes up and 182,440 down, against 317,096 and 315,432;
- padded to 1,000,000 entries: 178,248 against 63,045,632 bytes per snapshot (0.28%); a read call 1,688,744 bytes up
  and 1,083,560 down, against 1,196,328 and 1,205,288.

The upload is larger because each of the 32 requests carries its own key. A request costs the wallet about 8 ms at
2,048 rows to 19 ms at 10,240 on one WebAssembly thread (about 250 ms per call of 32 at the real size); the server's
tables hold 3.6 times SimplePIR's memory at the real size and 1.3 times at 1,000,000.
[`bench/results/2026-11-16-preprod-schemes/REPORT.md`](bench/results/2026-11-16-preprod-schemes/REPORT.md) has every
figure (memory, disk, network, time) for both schemes at the real size, 100,000, 1,000,000 and 2,000,000 entries, each
marked measured or calculated.

**Correctness.** Each build reads the first row, the last row and sampled rows back through a real request, answer and
decode, and fails a table with a wrong cell or a phase error at 2^37 or above; the largest error is the setup step's
statistics in `build-stats.json` (2^34.1 to 2^34.4 in the benchmark). Upstream's certificate (`certify_native.py`,
fed by the example `ipir/core/examples/noise_report.rs`, which reads a stored table file and checks that its masks equal
the served ones) bounds the probability that one answer decodes wrongly: at most 2^-303 to 2^-268 on the tables of the
real and the 1,000,000-entry snapshots (the report's section 7).

**Security status.** Upstream calls this profile experimental; its release gates (an independent review of the
key-dependent-message composition, a certificate per served snapshot, a timing audit) are open. A lattice estimate gives
more than 128 bits only under one cost model: about 2^137 under MATZOV, against 2^109.5 classical and 2^96 to 2^99
quantum under Core-SVP. Answers are not authenticated, under either scheme. The profile is also not the scheme the two
papers analyse: it sends one key and decodes with two masks where the papers send two keys and return one mask, and it
rounds the query, the answer and the masks; neither change has a published analysis. The papers' privacy theorem still
covers it, because the server sees a function of a subset of what the theorem lets it see; correctness rests on
upstream's certificate. The review of the code against the papers and upstream's specification, and the estimate, are in
[`docs/research/00058-ipir-sp-review.md`](../../docs/research/00058-ipir-sp-review.md).

**Building.** `ipir/build.sh` builds on the host with the toolchain `ipir/rust-toolchain.toml` pins (1.92.0 and the
`wasm32-unknown-unknown` target; rustup installs them on first use), from the committed `Cargo.lock`:
- `native`: the server's add-on, `ipir/pss-ipir.node` (N-API, `ipir/node/`), for this machine; git ignores it;
- `wasm`: the wallet's `ipir/pss-ipir.wasm` and `pss-ipir.wasm.sha256`, both committed (paths are remapped, so the
  bytes depend only on the source and the toolchain);
- `--check`: rebuilds the WebAssembly in `ipir/target/check` and compares it with the committed file and digest.

The server opens the add-on when the scheme is first used, from the file `PSS_IPIR_ADDON` names, else
`ipir/pss-ipir.node`. If it is missing, does not load or reports another profile, IPIR+SP is unavailable: an admin
build of it is refused (501 `scheme-unavailable`), a `snapshotEvery` build is logged as `build-refused`, a stored
IPIR+SP snapshot is ignored at start, and SimplePIR keeps working. A wallet whose WebAssembly is missing or has another
digest stops with a message naming `ipir/pss-ipir.wasm`. The WebAssembly has one import, `env.fill_random`, answered
from `crypto.getRandomValues` in Node and in browsers; it zeroes each buffer before the host fills it and refuses a draw
of 16 bytes or more that comes back all zero or equal to the previous one, so a broken random source fails the request
instead of repeating a secret. That comparison is per instance; when a call's requests are made in several workers,
the pool also refuses a call in which two requests carry the same key (`checkDistinctKeys`, `ipir/engine.ts`).

| File | Does |
|---|---|
| `ipir/sizes.ts` | The profile's constants and every byte length as a function of the shape |
| `ipir/native.ts` | The add-on's loader (refuses another profile), table build from cells or a cell file, answers, release, hand-over between threads |
| `ipir/wallet.ts`, `ipir/wallet-node.ts` | The WebAssembly's wrapper (no Node.js import; the page loads it) and its digest-checked compile in Node |
| `ipir/engine.ts` | One instance as tables and calls; a call's requests on the calling thread; the duplicate-key check |
| `ipir/pool.ts`, `ipir/pool-worker.ts` | A call's requests dealt to worker threads, each with its own instance; what one worker does with a message (no Node.js import) |
| `ipir/pool-node.ts`, `ipir/pool-worker-node.ts` | The pool over Node's `worker_threads` |
| `ipir/core/` | The Rust crate `pss-ipir-core`: profile, setup from (seed, snapshot digest), server table with its build check, client; `examples/noise_report.rs` for the certificate |
| `ipir/node/`, `ipir/wasm/` | The add-on's and the WebAssembly's exports |
| `ipir/vendor/` | Upstream's crates, unchanged |
| `pir/ipir/`, `pir/ipir-sp-server.ts`, `pir/ipir-sp-wallet.ts` | The shape rule and cells; the scheme's server and wallet sides |

**GPU.** The server's per-request math (the pass over the table and the packing product) also runs in WebGPU, equal
byte for byte to the add-on's answers: [`gpu/README.md`, "IPIR+SP"](gpu/README.md#ipirsp). The server module answers on
the CPU.

**Origin and licence.** `ipir/vendor/ipir-sp/` is a copy of five crates of `valargroup/ipir-sp` at a recorded commit,
with no copied file changed; [`ipir/vendor/ORIGIN.md`](ipir/vendor/ORIGIN.md) gives the commit, each crate's declared
licence and what was left out. The repository has no licence file at its root; each crate is published on crates.io
at the copied version under `MIT OR Apache-2.0`, and both texts are in `ipir/vendor/`.

## Dust (spec 00062)

A wallet's Dust follows from public data and its Dust secret key. Each Night output starts a chain of Dust coins whose
first coin the ledger publishes (`dust-initial-utxo`, with the generation record behind it). Each spend publishes the
spent coin's nullifier with the time it declared, the fee it paid and the position of the new coin's commitment
(`dust-spend-processed`), and the next coin is the ledger's `successorDustUtxo` of those and the wallet's key. The core
stores all of these in `core_ledger_state.events`. The module serves every spend of the current ledger era as one file;
the wallet searches it for its own coins' nullifier prefixes, derives each next coin, and checks each chain's last
coin by PIR. The server sees which Dust public key asked for its first coins, and nothing of which spends are its.

**The ledger era.** The Dust state restarts where the ledger's event format changes: on Preprod the first
`midnight:event[v14]:` event is at height 3,348,434, where the commitment positions and generation indexes start again
from 0 (that block re-creates 100 first coins). The setting `dustEraHeight` (that height by default) is where the file
starts; events below it are not read.

**The file** (`shared/dust-file.ts`). One entry per spend, in chain order (height, transaction, event): the first 4
bytes of the nullifier's 32-byte little-endian encoding, the declared time as a signed difference from the previous
entry's, the fee as its place in the chunk's list of fees that occur more than once or in full, and the commitment
position as the difference from the previous one minus one (integers LEB128). The entries are cut into chunks of 4,096
that decode alone: a chunk's header gives its first entry's number, block height, declared time and position, and the
prefixes come first, at a fixed width, so a wallet searches them without decoding the rest. A chunk is a function of
its entries, so a full chunk never changes and chunk n at a given count never does either. The manifest (JSON) gives
the era's first height, the last height listed, the entry count, and each chunk's entry range, heights, length and
SHA-256.

**Sizes on Preprod** (`bench/dust-sizes.ts`; [`bench/results/2026-11-17-preprod-dust/REPORT.md`](bench/results/2026-11-17-preprod-dust/REPORT.md),
to height 3,448,835):

| | Current era (served) | Earlier era (measured only) |
|---|---|---|
| Spends | 65,035 (heights 3,349,439 to 3,448,835) | 908,018 (heights 1,207 to 3,348,427) |
| File | 594,615 bytes in 16 chunks, 9.14 per entry | 7,170,736 bytes in 222 chunks, 7.90 per entry |
| Per entry: prefix, time, fee, fee lists, position | 4.00, 1.02, 2.57, 0.55, 1.00 | 4.00, 1.08, 1.67, 0.14, 1.00 |
| Compressed chunk by chunk (brotli to gzip) | 6.88 to 7.25 bytes per entry | 5.61 to 5.83 bytes per entry |
| Fees stored by their place in the chunk's list | 80.5% | 90.2% |

Reading and decoding the 973,053 events of both eras took 13.5 s, building the files 0.5 s.

**The walk** (`client/dust.ts`). The wallet's Dust key comes from the mnemonic's Dust seed (`DustSecretKey.fromSeed`,
as the wallet SDK derives it). It downloads the manifest and each chunk at the entry count the manifest lists (checked
against its SHA-256), its first coins and generation updates (`GET /dust/coins?owner=…`) and the parameters. For each
first coin of its key, it computes the coin's nullifier and searches the file for its prefix from the first entry whose
position is above the coin's own (a spend's new commitment is always appended after the coin it spends); on a match it
derives the next coin from the entry's time, fee and position, and searches on from the entry after. The generation
record passed is the first coin's, with the `dtime` of its update when there is one (a Night output is spent once): a
`dtime` later than a spend's declared time leaves the derived coin unchanged, an earlier one lowers its value. The
file is read once for all of a wallet's chains (a map from each chain's wanted prefix to the chains waiting on it): over
10,000,000 entries, 17 ms for 1 chain, 19 ms for 100 and 150 ms for 10,000, against 13 ms, 1.0 s and 104 s for a search
per chain (`bench/dust-walk.ts`, by hand, with stand-in ledger functions).

**The check** (`server/dust-check.ts`, `client/dust-check.ts`). A 4-byte prefix can match another wallet's spend (one search over
65,035 entries has about one chance in 66,000), and the coin derived from it is wrong. So the module also publishes a
PIR table of the Dust commitment tree's leaves by position: each spend's new commitment, and each first coin's
(`dustCommitment` of its output). It is part of the Dust snapshot, built in a worker thread at start and whenever a
snapshot build starts, in that build's scheme, through the same seam as the snapshot's tables (as a positional table
named `read`), with a manifest of its own (`shared/dust-check.ts`, canonical JSON, its SHA-256 the check's identifier;
the snapshot's other parts are below, "Spending a Dust coin"). The build is refused
with its reason unless the commitments fill positions 0 to n − 1 exactly once, with n the core's
`dust_commitment_first_free` at the height. Once no chain finds a further match, the wallet checks the last coin of
every chain with a spend in one call of exactly `queriesPerCall` requests, padded with random groups: the record at the
coin's position must be its commitment. A mismatch drops that match, the search resumes after it from the coin before,
and the new end is checked in a further call. A chain without a spend needs no check (its first coin is public); a coin
at a position the table does not reach yet (it was built at an earlier height) is reported as not checkable yet. A
wallet with nothing to check still sends one call.

On Preprod at 74,260 commitments (height 3,457,201), for one chain:

| | SimplePIR | IPIR+SP |
|---|---|---|
| Table | 1,457 groups × 51 records; file 4,309,838 bytes | 2,048 groups × 128 records; file 8,388,608 bytes |
| Built in | 0.23 s | 0.43 s |
| Downloaded once per check table (public artifact) | 6,057,984 bytes of setup data | 14,884 bytes of masks |
| One call: up / down | 186,536 / 189,352 bytes | 1,287,336 / 182,440 bytes |

**Spending a Dust coin** (`server/dust-tree.ts`, `client/dust-spend.ts`). The ledger's `DustLocalState::spend`
needs the coin's leaf and path in the Dust commitment tree, the generation record of its Night output with its path in
the generation tree, and the map from the Night's initial nonce to the record's index. The Dust snapshot holds the
rest of what that takes, all built at one height:

- the commitment tree over the check table's commitments. It is the Zswap tree (`server/tree.ts`, unchanged): height
  32, each leaf the scan kernel's `leaf` of the commitment's 32 little-endian bytes, the same node hash, an empty
  subtree 0 and not hashed. Its root must be the core's `dust_commitment_root` at the height (the build fails with
  `root-mismatch` otherwise). Cut k levels above the leaves (`pathSplit`) like the Zswap tree: its block roots are
  public, each position's k lower siblings are a positional PIR table named `path` (the last, partial block's too);
- the era's generation records, one public file (`PSSDGEN1`, 88 bytes a record: value, owner, the Night output's
  initial nonce, the time its Night was spent or all ones). A record's leaf (`merkle_hash`) is not exposed in
  JavaScript, so the tree is the ledger's: every record inserted in index order into a Dust local state. Its root
  must be the core's `dust_generation_root` (`generation-root-mismatch` otherwise). The ledger takes about 7 ms a
  record (12 s for Preprod's 1,680), so the build worker computes it, not the server's event loop;
- the block's time, in whole seconds (the stored time without its milliseconds, as the ledger keys its roots).

The wallet takes the coin that pays: a chain's end confirmed by the check, or a public first coin, that the snapshot
holds (position below its commitments), worth the most at the snapshot's block time (`--dust-chain` picks one). It
reads the coin's k lower siblings in one call of exactly `queriesPerCall` requests padded with random groups (the
path table's public artifact downloaded then, once per snapshot), takes the upper 32 − k from the block roots, and
refuses a root other than the snapshot's. It inserts every generation record in index order (its own with their
initial nonce), applies the commitment tree around its coin as collapsed updates from the 32 siblings (the Zswap
tree's serialization, which `DustStateMerkleTreeCollapsedUpdate.deserialize` takes), inserts the coin at its
position, and checks both roots against the snapshot's. The fee is paid as the wallet SDK balances Dust: a balancing
intent whose `DustActions`, dated at the snapshot's block time, spend the coin; the spend's `vFee` is raised until it
covers the merged transaction's `feesWithMargin` (margin 5 blocks, the SDK's) under the ledger parameters in force,
which the module serves from the core's `ledger-state` item.

**Which roots a spend is checked against.** The chain keeps each tree's root per block time and checks a Dust spend
against the root recorded at the last block at or before its declared time (ledger `verify.rs`, `root_history.get`);
at every block it drops the roots older than that block's time less the global TTL (3,600 s in the initial
parameters). So a spend dated at the snapshot's block time is good for about an hour after that block; `send` refuses
to submit one from a snapshot more than 3,000 s old. The snapshot is rebuilt by hand, with the admin route
(`POST /admin/snapshot`): nothing rebuilds it on a timer.

On Preprod at 76,018 commitments and 1,681 generation records (height 3,459,760, k = 16; the IPIR+SP row at
3,459,704, 75,940 commitments), for one coin:

| | SimplePIR | IPIR+SP |
|---|---|---|
| Path table | 69,328,448 bytes | 41,943,040 bytes (2,048 groups × 40 records) |
| Snapshot built in (worker; tree, path table, generation tree) | 19.9 s (5.7, 1.9, 12.0) | 20.9 s |
| Downloaded once per snapshot | path table's setup data 1,867,776, block roots 64, generation records 147,940 bytes | masks 74,276, block roots 64, generation records 147,676 bytes |
| The path call: up / down | 9,730,344 / 58,408 bytes | 1,287,336 / 903,336 bytes |
| The local state (1,681 inserts) | 11.8 s | 12.2 s |

`dust --spend` prints it (`--dust-chain 2`, the test wallet's chain with 5 spends):

```
spend: chain 2, coin seq 5 at position 21,383, worth 15,991,566,433,802,881,266 Specks at the Dust snapshot's block time 2026-11-17T15:31:30.000Z (height 3,459,627)
  path read: 16 lower siblings by PIR in 1 call of 32 requests, 9,712,808 bytes up and 58,408 down; 16 upper from the block roots; once per snapshot: path table's setup data 0, block roots 0, generation records 0 bytes down; 397 ms
  commitment root from the path c14a9a1a6a12c7c2… = the snapshot's
  local state (1,676 generation records, 12033 ms): commitment root = the snapshot's, generation root = the snapshot's
  spent in memory, dated at the snapshot's block time: the fee of a transaction holding only this spend is 156,032,600,344,324 Specks (vFee 156,032,600,344,324, ledger parameters at height 3,459,666); nullifier 0x24a7cedd97e42345…; not proven, not sent
```

`send --dust-fee private --no-submit` of 100 pssUSD from the 750 coin, with the fee paid by that Dust coin: the fee
385,524,859,401,903 Specks, proven at the local proof server in 2.0 s, validated, 18,526 bytes, nothing submitted.

What is manual or missing: the Dust snapshot is rebuilt by hand (the admin route) and a spend is good for about an
hour after its block; the generation tree costs about 7 ms a record in the ledger, on the server's worker and on the
wallet at each spend (12 s on Preprod); the SDK's validation runs against a blank ledger state, which holds no Dust
roots, so the roots are checked only by the module against the core's and by the chain at inclusion; no transaction
has been submitted this way yet.

**Routes** (under `/pss/v1`; each logged as the others are, never with a query string):

| Route | Answer |
|---|---|
| `GET /dust/manifest` | The Dust file's manifest, JSON |
| `GET /dust/chunk/<n>[?count=<c>]` | Chunk n's bytes, with its first c entries when `count` is given (the count the manifest lists); cached for good when full or with a count. 404 beyond the file, 400 for a number that is not plain decimal |
| `GET /dust/coins?owner=<key>` | JSON: that Dust public key's `dust-initial-utxo` and `dust-generation-dtime-update` events, each `{height, bytes}` with the bytes in hexadecimal, in chain order. 400 for a key that is not plain decimal |
| `GET /dust/parameters` | JSON: the Dust parameters in force (decimal strings): the ledger's initial ones, or the era's last `param-change` event's; and the ledger parameters in force (`ledgerParameters`, the ledger's tagged serialization in hexadecimal, from the core's `ledger-state` item, with `ledgerParametersHeight`; null until a block is committed after start) |
| `GET /dust/check/manifest` | The Dust snapshot's manifest bytes; `Pss-Dust-Check-Id` = its SHA-256. 503 `no-dust-check` (with the last build's reason) before one is built |
| `GET /dust/check/blob/<digest>` | A public file of the current Dust snapshot or the one before: the check and path tables' public artifacts, the block roots, the generation records |
| `POST /dust/check/query`, `POST /dust/check/path` | The query wire format (below) to the check table or the path table, the snapshot's identifier in the snapshot identifier's place; 409 `dust-check-replaced` (with `check`) for another one |

A Dust failure (an event that cannot be decoded, a position that does not rise) breaks only the Dust routes, with its
reason (500 `dust-broken`).

**Running it** against a server (step 2 above; on Preprod the index loads in about 2 s):

```sh
node --env-file=<secrets.env> examples/private-shielded-sync/client/main.ts dust --wallet A --server http://127.0.0.1:10480
```

It prints the file, the parameters and the check table, then per chain the spends found (with their file entries), the
check, the false matches dropped and the current coin (sequence number, position, value at creation and now,
commitment), and the bytes moved; `--json` prints the same as JSON, `--no-check` walks without the check. Chunks and
the Dust snapshot's public files are kept by SHA-256 in `--data`'s `cache/` (beside the snapshot's artifacts), so a
later run downloads only the chunks that are new; the first line says how many came from the cache. `--spend` also
reads the paying coin's path and spends it in memory (above, "Spending a Dust coin"). The step page runs the same code
in four steps (above, "The step-by-step page", steps 9 to 12). For example, on Preprod, one of a wallet's two chains
in the era and the totals:

```
chain 2: first coin at height 3,398,886, generation index 1052, backed by 5,001,000,000 Stars of Night
  spends found: 5 (file entries 19845, 19848, 19851, 19854, 20330)
  check: checked: the record at position 21383 is the last coin's commitment
  false matches dropped: 0
  current coin: seq 5, position 21383, created 2026-11-13T05:47:12.000Z, value at creation 253,921,104,116,881,266 Specks, value now 15,785,552,934,341,881,266 Specks
downloaded 6,918,127 bytes in 24 requests (manifest 3,023, chunks 665,787, coins 1,260, parameters 146, check 6,247,911); uploaded 186,536 bytes of request bodies; 223 ms
```

**Not covered.** The earlier ledger era, whose events are
decoded only to measure the file's size; hiding the Dust public key when asking for its first coins (the coins request
names it, and the server sees it). A `param-change` event inside the era is read from the event's text rendering
(the ledger package does not decode it); Preprod's era has none, so that path is tested on a rendering only.

## Wire formats (`shared/`)

All integers little-endian; binary bodies are `application/octet-stream`; routes under `/pss/v1`.

- **Query body** (`POST /query/read`, `POST /query/path`, `POST /query/nullifier`): magic `PSSQ` (4), format version (2), snapshot
  identifier (32), vector count (2), then count requests, each of the length the table's scheme gives
  (`pir/scheme.ts`; SimplePIR: C 32-bit values; IPIR+SP: above, "A call"). Decoding is strict: exact length, the
  required vector count, and the current snapshot (a `WireError` with status 400, or 409 for another snapshot).
- **Answer body**: the same 40-byte header with magic `PSSA`, then count responses (SimplePIR: R values each; IPIR+SP:
  one answer per request).
- **Tail** (`GET /tail`): a 132-byte header (magic `PSST`, version, reserved, snapshot identifier, height, block hash,
  `first_free` as 64 bits, root, and the byte lengths of four sections), then the sections: commitments (32 bytes
  each), outputs (257 bytes: flags, commitment, 224-byte ciphertext), nullifier records (40 bytes), block roots (32).
- **Records** (`records.ts`): scan entry (point and the first 4 bytes of element 0, or 36 zero bytes); read record
  (98 bytes: the commitment's first 16 bytes, then element 1's first byte, element 2, element 3's first byte, element 4
  and element 5's first 16 bytes; elements zero without a ciphertext); path record (the k lower hashes, 32k bytes; zero
  outside the full blocks); tail output. Elements 1–5 hold the nonce's last byte and other 31 bytes, the token type's
  last byte and other 31 bytes, and the value; the client recovers each short message as `(element − pad) mod 2^(8b)`.
- **Manifest** (`manifest.ts`, format 3): JSON in canonical form (keys sorted, no whitespace); the snapshot identifier
  is its SHA-256. It names the PIR `scheme`, the network, genesis hash, height, block hash, `first_free`, root,
  `pathSplit`, `queriesPerCall`, the scheme's parameters (`pir`), and the digest and size of eight artifacts (six at
  k = 0): scan file, block roots, and each PIR table (`readTable`, `pathTable`, `nullifierTable`) with its public
  artifact (`readPublic`, `pathPublic`, `nullifierPublic`; under SimplePIR the setup data, under IPIR+SP the masks). A
  table's entry gives its records, record size, `groups` (what a request selects: SimplePIR's columns, IPIR+SP's rows)
  and `perGroup`, and the scheme's `layout` (rows, columns, cells per record, seed, for both); the nullifier table adds
  `bucketBits` and `capacity`.
  Under SimplePIR the path table is as wide as the noise check allows, so its setup data is small.

- **Dust** (`dust-file.ts`, `dust-check.ts`): the Dust file's chunks and manifest, the coins and parameters answers,
  and the Dust snapshot's manifest and generation file: above, "Dust".

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
and the measurements. Its section ["IPIR+SP"](gpu/README.md#ipirsp) has `GpuIpirTable`, which answers IPIR+SP requests
(the pass over the table and the packing product in 32-bit limbs) byte for byte as the add-on does, its check
(`deno task --config examples/private-shielded-sync/gpu/deno.json ipir-check`), and what of the preparation and of the
wallet's math was moved to the GPU and what was not.

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
| `test/client-cli.test.ts` | With the install: `sync`, `balance`, `address`, `cross-check` (and a negative control) and `dust` as separate processes. |
| `test/server-config.test.ts` | `run/sync.mjs config` and `umbradb config check` on a built checkout (type check with erasable syntax, evaluation, settings), and a negative control. |
| `test/server-scheme.test.ts` | The scheme seam with SimplePIR: table and setup-data digests pinned from before the seam, records read back through the interface, the padded-build estimate, an unknown scheme refused everywhere. |
| `test/ipir-shape.test.ts` | IPIR+SP's shape rule against a brute-force search, the row cap, nullifier buckets, the cell encoding (no add-on needed). |
| `test/ipir-roundtrip.test.ts` | The add-on and the WebAssembly together: sizes equal the formulas, the committed WebAssembly's digest, round trips at 2,048 × 2,048 and 4,096 × 6,144, determinism, refusals, a fresh secret per request. |
| `test/server-ipir-scheme.test.ts` | IPIR+SP through the seam in process: the same records as SimplePIR, masks, noise sample, determinism, padded and empty tables, tables across threads, refusals, a failing random source, every request state freed, no add-on or no WebAssembly. |
| `test/client-ipir.test.ts` | IPIR+SP end to end in UmbraDB's real process: three wallets equal the ledger's replay, identical request shapes, the same height under SimplePIR gives the same coins, a spend on an IPIR+SP lower path accepted, refusals, padding, restart with and without the add-on, the command line. |
| `test/ipir-gpu-reference.test.ts` | What the GPU responder is checked against, without a GPU: the add-on's `gpuReference` export and the answer arithmetic of `gpu/ipir-wire.ts`. |
| `test/web-scheme-view.test.ts` | The page's per-scheme presentation: SimplePIR's lines as before, IPIR+SP's sizes, a real IPIR+SP call decoded part by part, the masks, the WebAssembly compiled only with the committed digest. |
| `test/dust-file.test.ts` | The Dust file's chunks: round trips, a negative time difference, a position jump, fees by index and in full, a chunk decoded alone, full chunks unchanged as the file grows, bad bytes. |
| `test/server-dust-index.test.ts` | The Dust index over real Preprod events: each chunk against the entries read from the events, full chunks unchanged as the file grows, a chunk at an earlier count, the era's first height, first coins and updates by owner, the parameters, the commitments by position (a gap and a position filled twice refused), the commitment and generation trees against Preprod's stored roots at three heights and k = 0, 2, 16, the stored state's block time in whole seconds, what breaks it. |
| `test/server-dust.test.ts` | The Dust routes in UmbraDB's real process (PostgreSQL 18) over Preprod events written into the test database: the file, a key's coins, the parameters, refusals; the Dust snapshot built at start in SimplePIR (its commitment and generation roots the stored ones, Preprod's), read through the wallet's code (the check, a coin's path at four positions), refusals, a build refused for another stored `dust_commitment_first_free`, the snapshot rebuilt in IPIR+SP by an IPIR+SP snapshot build and read through it (the check and a path); the ledger parameters served. |
| `test/dust-walk.test.ts` | The walk: a chain of several spends across chunks, a match below the coin's position, a false match without and with a check, a chain with no spend, two chains in one file; with the ledger's functions, a chain found again from the encoded file, and what a generation record's `dtime` changes; the coins answer decoded from real events. |
| `test/server-web-dust.test.ts` | The page's Dust steps under Node in both schemes, over the world of `test/server-dust-world.ts` (also the check test's): a wallet with three chains (the false match dropped, a chain not checkable, a chain with nothing to check), a second run from the page's cache, step 12 (one padded path call, both roots the snapshot's, the spend in memory, the snapshot's files from the page's cache the second time), a generated wallet with no chain (one padded call), the page's rendering of the chains, bytes and spend, refusals. |
| `test/dust-walk-compare.test.ts` | The one-pass walk of all chains against the search per chain it replaced, on the same files: many chains, false matches, chains starting in the middle, two chains wanting one prefix (one starting later), chains with no spend, 2-, 4- and 6-byte prefixes, the ledger's own functions; the same chains, entries, coins, dropped matches, statuses and check batches. |
| `test/server-dust-check.test.ts` | The check in both schemes: the module's builder and the scheme's server table called through the wallet's code; another wallet's spend before the real one dropped by the check, a chain's end beyond the table not checkable, two padded calls of one size; a coin's path in one padded call giving the snapshot's root, the Dust local state's two roots, the spend, a fee paid with it, wrong roots refused, the paying coin chosen, and a build refused for a commitment or generation root other than the core's. |
| `test/bench-run.test.ts` | The benchmark against the module in the real process (PostgreSQL 18) over the synthetic chain, wallets A, B and C: every cell of spec §8 has a value for the server and each client, and the report renders it; the snapshot's counts and versions; per-step values and the server's times from its log; the naive baseline; the read table at k = 16, 8, 2 and 0 (k 2 gives the served snapshot); the server's view of every request and identical request shapes; the scan by thread count; the transfer row (and a dry-run record); no key, seed, nonce or nullifier in `results.json`; exactly the cells without their input reported missing; `--build`; the command line (`run`, `report --transfer`, with the install); log pairing, speed and formatting rules. |

Fixtures (`test/fixtures/`): `entries.bin`, `pads.bin`, `mine.bin`, `scalar.bin` and `sample.txt` are 16,384 scan
entries made with the ledger's `encrypt` (about one in a thousand to the test key), the ledger's value for each, which
are the test key's, the test key's scalar, and four worked entries. `coins.bin`, `coin-secret.bin` and
`coin-public-key.bin` are 48 coins encrypted with the ledger's `encrypt` (two thirds to the test key) with their
commitments, written by `kernel/build.sh --vectors`. `poseidon-constants.json` holds `midnight-circuits` 7.3.0's
Poseidon constants (Apache-2.0) for the BigInt reference. Every key in the fixtures is a test key from a fixed seed.
`dust-events.json` holds every Dust event of Preprod's current era from 3,348,434 to 3,349,867 as the core stores them
(public chain data: 144 spends, 110 first coins, 5 updates; their commitments fill positions 0 to 253).

## Benchmarks

### The whole flow (`bench/bench.ts`, spec §8)

`bench.ts run` runs the flow of spec §1 against a running server for one or more wallets and writes `results.json`
and `REPORT.md` under `bench/results/<date>-<network>/` (or `--out`): the machine, the software versions, the network,
the snapshot's height, output and nullifier counts, and a value for every cell of spec §8, for the server and for each
wallet's client on their own rows (FR-151), then the naive baseline (FR-152), the read table at k = 16, 8 and 0
(FR-153), the scan by thread count, and what the server observed (FR-154). A cell whose input was not given says so;
the run's log names the cells still without a value. `bench.ts help` lists every option.

In order, it:

1. with `--build`, asks the server for a snapshot at its latest height (or `--build-height`; with `--scheme` and
   `--padding` for that one build) through the admin route and waits until it is served, sampling the server's memory
   before, during and after;
2. reads the manifest, and the snapshot's `build-stats.json` from the module's data directory (`--pss-data`); with
   `--admin-secret-file`, the bytes each served table says it holds (the module's status);
3. syncs each wallet with the client's own `sync()` as a fresh client (an empty cache, its own scan and PIR threads),
   one after the other, timing each step and sampling the peak memory of its own process and of the server meanwhile;
   then reads its lower paths from the path table as `send` does (one call; `--skip-path-read` leaves it out);
4. scans the snapshot's scan file at each `--scan-threads` count;
5. with `--db-url`: the database's size; the snapshot's stored events read with the module's own query; for each
   `--path-splits` k, the module's own builder run in-process on them (a temporary directory; the build checks the
   core's root, and at the served k it reproduces the served snapshot's identifier) and one read call of
   `queriesPerCall` requests with client and server in the benchmark's process, every record checked against the table
   file;
6. reads the server's request lines (`--server-container`: `docker logs`; or `--server-log <file>`) and pairs each with
   the client's request; computes the sync's speed from `--sync-records` and reads the transfer from `--transfer`.

| Row of spec §8 | Source |
|---|---|
| Chain sync | `--db-url` (size per schema), `--sync-records` (`status.jsonl`: heights per second while syncing, restarts left out) |
| Read events for a snapshot | The module's query for every Zswap row up to the snapshot height, run by the benchmark (`--db-url`) |
| Build scan file, tree and paths, the tables and their public artifacts (setup data or masks) | The snapshot's `build-stats.json` (`--pss-data`); without it, the benchmark's own build at the served k |
| Download, scan, read coins, nullifier lookups, tail, whole `sync` (client) | Each wallet's sync, step by step (`client/sync.ts`'s `onStep`) |
| Read coins, nullifier lookups, lower paths (server) | The module's request line for the call (decode, answer, encode: `--server-container` or `--server-log`); its memory from `docker stats` (`--server-container`) or `ps` (`--server-pid`) |
| Transfer | The record `send` wrote (`--transfer`); "not run" without it |

The client's memory is the benchmark process's (each wallet runs in it, one after the other; `node --expose-gc` lets it
collect between wallets). `docker stats` reports the container's memory about every 0.5–1 s, so a call shorter than
that gets the nearest samples. The results hold wallet labels and counts only: no key, position, value or nullifier.

`bench.ts report <results.json> [--transfer <record>] [--out <dir>]` renders `REPORT.md` again, adding a transfer
record: the head report can be produced before the transfer and completed after it.

**Both schemes (spec 00058).** `--scheme simplepir|ipir-sp` names the scheme `--build` asks for (without `--build`, the
one the served snapshot must use); an IPIR+SP snapshot needs the add-on on the server's side and the committed
`ipir/pss-ipir.wasm` on the wallet's. `bench.ts compare <results.json>… --out <dir>` reads several runs, groups them by
snapshot size and scheme, and writes `compare.json`, `TABLES.md` and `KEY-TABLES.md` (the key rows only): per size,
both schemes side by side (median,
smallest and largest, number of samples), rows grouped as memory, space, network and time, each marked measured (the
field of `results.json`) or calculated (the formula), and the checks SC-002 and SC-003 of spec 00058. With `--notes
<file.md>` it also writes `REPORT.md`: section 1 is the key rows per size, then the file's own sections, in which
`<!-- shapes -->` becomes the tables' shapes per size and scheme and `<!-- certificates -->` the correctness
certificates found in `--cert <dir>` (`cert-<label>-<table>.json` from upstream's `certify_native.py`).

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
and 40 bytes (`--records`, `--sizes`), building the grid and its digest, the setup data, the server's answer to 1 and 32
vectors, and the client's query build and decode (one thread and worker threads). With `ipir-sp` in `--schemes` (the
default runs both; it needs the add-on) it measures the same for IPIR+SP: the cells in the rule's shape, the add-on's
table build and masks, the answer to 1 and 32 requests, and the wallet's WebAssembly opening the table, making 1 and 32
requests and decoding them, on one thread and on the worker pool (`--wallet-threads`, default 2, 4 and 8). It checks every decoded record and writes JSON to `bench/results/micro-<date>.json`.
