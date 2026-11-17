# Private shielded sync: benchmark on preprod

Snapshot `004805f18b8e91a0…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 57,812 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme simplepir (built for this run). Run from 2026-11-16T05:01:04.621Z to 2026-11-16T05:01:36.993Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

## Setup

|  |  |
|---|---|
| Machine | Apple M4 Max, 16 cores, 48.0 GiB, darwin 24.6.0 arm64 |
| Node.js (client, benchmark) | v24.9.0 |
| UmbraDB | 0.10.0 at `c372e0aa7ada` |
| Scan kernel | `pss-kernel.wasm` SHA-256 `b34f9b0003e1b1f9…` |
| Client ledger package | @midnightntwrk/ledger-v9 1.0.1 |
| Network | preprod |
| Server | http://127.0.0.1:10580; its process: Node.js v24.9.0, darwin arm64, 16 CPUs (from its build statistics); 6 PIR threads |
| Server modules | core-chain 0.10.0, core-block-fetch 0.10.0, core-block-commit 0.10.0, core-digest 0.10.0, core-health 0.10.0, core-status 0.10.0, core-config 0.10.0, core-chain-events 0.10.0, core-block-parsed 0.10.0, core-tx-results 0.10.0, core-ledger-state 0.10.0, core-contract-logs-full 0.10.0, core-contract-states 0.10.0, private-shielded-sync 0.1.0 |
| Server memory | process 53587, `ps -o rss=` every 200 ms |
| Server log | the stack's run.log; 20 of 20 requests paired with a server line |
| Load average (1, 5, 15 min) | start 7.31 / 7.8 / 10.23; end 11.82 / 8.85 / 10.52 |
| SimplePIR | q = 2^32, n = 1024, σ = 6.4, 9 bits per cell (p = 512) |
| Artifacts | blockRoots 64 B, nullifierPublic 6.47 MiB, nullifierTable 6.47 MiB, pathPublic 1.78 MiB, pathTable 60.3 MiB, readPublic 9.63 MiB, readTable 11.6 MiB, scan 2.38 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 6.47 MiB, nullifierTable 6.47 MiB, pathPublic 1.78 MiB, pathTable 60.3 MiB, readPublic 9.63 MiB, readTable 11.6 MiB, scan 2.38 MiB |

## The PIR tables

One request selects one column of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | setup data | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 69,329 × 98 B | 2,464 × 2,477 | 2,477 × 28 | 11.6 MiB | 9.63 MiB | 9,908 B / 9,856 B | 11.6 MiB |
| path | 69,329 × 512 B | 456 × 69,329 | 69,329 × 1 | 60.3 MiB | 1.78 MiB | 277,316 B / 1,824 B | 60.3 MiB |
| nullifier | 57,812 × 40 B | 1,656 × 2,048 | 2,048 × 46 | 6.47 MiB | 6.47 MiB | 8,192 B / 6,624 B | 6.47 MiB |

The benchmark asked the server for this snapshot (simplepir); it was served 7.68 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 859.1 MiB before the request, a peak of 1.67 GiB until the snapshot was served, 1.62 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 1.67 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's query run by the benchmark against the database at the snapshot height. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | 18.4 GiB database | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 1.15 GiB | — | 588 ms, 216,350 rows/s (127,141 rows) |
| Build scan file | server | 2.38 MiB | 937.9 MiB | — | 23 ms |
| Build tree and paths | server | 64 B block roots | 1.06 GiB | — | 4.67 s, 14,853 hashes/s (69,353 hashes) |
| Build read table and setup data | server | table 11.6 MiB, setup data 9.63 MiB | table 1.06 GiB; setup 1.12 GiB | — | table 105 ms, setup 386 ms |
| Build path table and setup data | server | table 60.3 MiB, setup data 1.78 MiB | table 1.18 GiB; setup 1.65 GiB | — | table 207 ms, setup 1.84 s |
| Build nullifier table and setup data | server | table 6.47 MiB, setup data 6.47 MiB | table 1.66 GiB; setup 1.67 GiB | — | table 26 ms, setup 216 ms |
| Download scan file, block roots, setup data | client A | 18.5 MiB cache | — | scan file 2.38 MiB in 24 ms; block roots 64 B in 37 ms; read setup data 9.63 MiB in 22 ms; nullifier setup data 6.47 MiB in 27 ms | — |
| Download scan file, block roots, setup data | client B | 18.5 MiB cache | — | scan file 2.38 MiB in 25 ms; block roots 64 B in 20 ms; read setup data 9.63 MiB in 36 ms; nullifier setup data 6.47 MiB in 15 ms | — |
| Scan | client A | — | 763.8 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 1.03 GiB | — | 5.00 s for 69,329 outputs on 8 threads (72.1 µs/output) |
| Read coins (one call) | server (A's call) | — | 1.59 GiB | — | answer 28 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 763.8 MiB | 309.7 KiB up, 308.0 KiB down, round trip 33 ms | build 29 ms, decode 10 ms |
| Read coins (one call) | server (B's call) | — | 1.60 GiB | — | answer 9.6 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 1.03 GiB | 309.7 KiB up, 308.0 KiB down, round trip 19 ms | build 31 ms, decode 5.9 ms |
| Nullifier lookups (one call) | server (A's call) | — | 1.59 GiB | — | answer 5.0 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 725.9 MiB | 256.0 KiB up, 207.0 KiB down, round trip 23 ms | build 11 ms, decode 3.2 ms |
| Nullifier lookups (one call) | server (B's call) | — | 1.60 GiB | — | answer 6.4 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 1.06 GiB | 256.0 KiB up, 207.0 KiB down, round trip 25 ms | build 9.2 ms, decode 2.6 ms |
| Lower paths to spend (one call) | server (A's call) | — | 1.60 GiB | — | answer 48 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 1.01 GiB | 8.46 MiB up, 57.0 KiB down, round trip 63 ms | build 273 ms, decode 1.1 ms |
| Lower paths to spend (one call) | server (B's call) | — | 1.61 GiB | — | answer 55 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 1.19 GiB | 8.46 MiB up, 57.0 KiB down, round trip 82 ms | build 301 ms, decode 1.0 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.7 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 4.0 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.5 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 3.6 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 763.8 MiB | 565.7 KiB up, 19.1 MiB down (8 requests) | 5.51 s wall-clock; 5.32 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 1.06 GiB | 565.7 KiB up, 19.1 MiB down (8 requests) | 5.21 s wall-clock; 5.06 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**5 cells without a value:** Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 69,329 × 256 B + 57,812 × 32 B = **18.7 MiB** (19,598,208 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 19.1 MiB | 1.02× | 18.5 MiB | 635.6 KiB | 0.033× | 565.7 KiB |
| B | 19.1 MiB | 1.02× | 18.5 MiB | 635.6 KiB | 0.033× | 565.7 KiB |

A first sync downloads the snapshot's artifacts once (the scan file, block roots and the read and nullifier tables' setup data, the same for every wallet); a later sync against the same snapshot moves only the manifest, the query calls and the tail. Both include the tail (outputs after the snapshot, in full, for every wallet); the baseline counts only the snapshot.

## The read and path tables at each `pathSplit` (FR-153, Q58)

The served snapshot has k = 16. For each k below, the benchmark read the snapshot's stored events with the module's own query and ran the module's own builder in-process (6 threads); the build checks the core's root at the height. A read record is 98 bytes at every k (the commitment's first 16 bytes, ciphertext elements 1–5 shrunk); the k lower path hashes are in the path table, 32k bytes a record, which a wallet reads only to spend (none at k = 0). Each call is one call of 32 requests with client and server in the benchmark's process (no network), after one warm-up call; every record of its groups was checked against the table file's own. A table is R × C cells; one request selects one column (a group) of the records in brackets.

| k | Read record | Read table R × C (records per column) | Path record | Path table R × C (records per column) | Block roots | Read table / setup data | Path table / setup data | Tree | Tables and setups | Peak | Same as served |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 16 | 98 B | 2,464 × 2,477 (28) | 512 B | 456 × 69,329 (1) | 64 B (2) | 11.6 MiB / 9.63 MiB | 60.3 MiB / 1.78 MiB | 4.70 s, 14,771 hashes/s | readTable 100 ms, readSetup 320 ms, pathTable 227 ms, pathSetup 1.83 s | 1.70 GiB | yes (same identifier) |

| k | Call | Up | Down | Client build | Server answer | Client decode | Peak | Records checked |
|---|---|---|---|---|---|---|---|---|
| 16 | read (each sync) | 309.7 KiB | 308.0 KiB | 14 ms | 9.4 ms | 4.4 ms | 1.29 GiB | 896 |
| 16 | path (each spend) | 8.46 MiB | 57.0 KiB | 244 ms | 54 ms | 0.95 ms | 1.79 GiB | 32 |

## The scan by thread count

Not measured.

## What the server observes (FR-154)

Each request of each wallet's sync as the client sent it, with the line the module logged for it (route, status, body and answer lengths, `Range`, milliseconds; never a body). This is everything a sync shows the server, beside the client's network address and the requests' timing.

The sequences of method, path and body length are **identical** for A, B (FR-142), whatever coins each holds.

### A: 8 requests, 10 coins found (7 unspent), 10 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.86 KiB | — | 0.01 ms | 18 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 2.38 MiB | — | 0.17 ms | 24 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.16 ms | 37 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 9.63 MiB | — | 0.05 ms | 22 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 6.47 MiB | — | 0.07 ms | 27 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 309.7 KiB | 308.0 KiB | — | 28 ms | 33 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 256.0 KiB | 207.0 KiB | — | 5.0 ms | 23 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.7 ms | 4.0 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.86 KiB | — | 0.01 ms | 5.0 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 2.38 MiB | — | 0.10 ms | 25 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.05 ms | 20 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 9.63 MiB | — | 0.06 ms | 36 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 6.47 MiB | — | 0.06 ms | 15 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 309.7 KiB | 308.0 KiB | — | 9.6 ms | 19 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 256.0 KiB | 207.0 KiB | — | 6.4 ms | 25 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.5 ms | 3.6 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.73 KiB | 0.03 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 36.9 MiB | 0.72 ms |
| `POST /pss/v1/query/read` | 2 | 619.3 KiB | 616.1 KiB | 38 ms |
| `POST /pss/v1/query/nullifier` | 2 | 512.1 KiB | 414.1 KiB | 11 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 3.2 ms |

A wallet sends one call to each table for every 32 distinct columns it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Database: 18.4 GiB at cursor 3,440,520; the process runs core-chain, core-block-fetch, core-block-commit, core-digest, core-health, core-status, core-config, core-chain-events, core-block-parsed, core-tx-results, core-ledger-state, core-contract-logs-full, core-contract-states, private-shielded-sync.

| Schema | Size |
|---|---|
| `core_ledger_state` | 13.2 GiB |
| `core_chain_events` | 3.99 GiB |
| `core_block_commit` | 933.5 MiB |
| `core_contract_states` | 123.8 MiB |
| `core_block_parsed` | 94.7 MiB |
| `core_tx_results` | 63.9 MiB |
| `contract_logs` | 13.8 MiB |
| `core_digest_shadow` | 1.27 MiB |
| `core_digest` | 504.0 KiB |
| `core_chain` | 112.0 KiB |

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 7.57 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 23 ms | 2.38 MiB | 937.9 MiB | — |
| tree | 4.67 s | 64 B | 1.06 GiB | — |
| readTable | 105 ms | 11.6 MiB | 1.06 GiB | — |
| readSetup | 386 ms | 9.63 MiB | 1.12 GiB | — |
| pathTable | 207 ms | 60.3 MiB | 1.18 GiB | — |
| pathSetup | 1.84 s | 1.78 MiB | 1.65 GiB | — |
| nullifierTable | 26 ms | 6.47 MiB | 1.66 GiB | — |
| nullifierSetup | 216 ms | 6.47 MiB | 1.67 GiB | — |
| manifest | 18 ms | 1.86 KiB | 1.67 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 1.3 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
