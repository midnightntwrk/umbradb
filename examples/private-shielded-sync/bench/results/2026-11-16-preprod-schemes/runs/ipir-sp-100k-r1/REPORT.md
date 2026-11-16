# Private shielded sync: benchmark on preprod

Snapshot `d9625443b503ae17…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 100,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme ipir-sp, padded to 100,000 entries (debug) (built for this run). Run from 2026-11-16T05:05:01.048Z to 2026-11-16T05:05:28.363Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

## Setup

|  |  |
|---|---|
| Machine | Apple M4 Max, 16 cores, 48.0 GiB, darwin 24.6.0 arm64 |
| Node.js (client, benchmark) | v24.9.0 |
| UmbraDB | 0.10.0 at `c372e0aa7ada (with uncommitted changes)` |
| Scan kernel | `pss-kernel.wasm` SHA-256 `b34f9b0003e1b1f9…` |
| Client ledger package | @midnightntwrk/ledger-v9 1.0.1 |
| Network | preprod |
| Server | http://127.0.0.1:10580; its process: Node.js v24.9.0, darwin arm64, 16 CPUs (from its build statistics); 6 PIR threads |
| Server modules | core-chain 0.10.0, core-block-fetch 0.10.0, core-block-commit 0.10.0, core-digest 0.10.0, core-health 0.10.0, core-status 0.10.0, core-config 0.10.0, core-chain-events 0.10.0, core-block-parsed 0.10.0, core-tx-results 0.10.0, core-ledger-state 0.10.0, core-contract-logs-full 0.10.0, core-contract-states 0.10.0, private-shielded-sync 0.1.0 |
| Server memory | process 53587, `ps -o rss=` every 200 ms |
| Server log | the file /Users/edwardalvarado/todo/Umbra/resources/00058-poc-ipir/stack/run.log; 20 of 20 requests paired with a server line |
| Load average (1, 5, 15 min) | start 19.64 / 13.68 / 12.15; end 16.9 / 13.5 / 12.13 |
| PIR scheme ipir-sp | digitBits 19, digits 2, maskBits 29, pBits 16, qBits 54, queryBits 49, responseBits 22, ring 2048 |
| Artifacts | blockRoots 64 B, nullifierPublic 14.5 KiB, nullifierTable 8.00 MiB, pathPublic 58.0 KiB, pathTable 64.0 MiB, readPublic 29.0 KiB, readTable 16.0 MiB, scan 3.43 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 14.5 KiB, nullifierTable 8.00 MiB, pathPublic 58.0 KiB, pathTable 64.0 MiB, readPublic 29.0 KiB, readTable 16.0 MiB, scan 3.43 MiB |

## The PIR tables

One request selects one row of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | masks | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 100,000 × 98 B | 2,048 × 4,096 | 2,048 × 83 | 16.0 MiB | 29.0 KiB | 40,228 B / 11,332 B | 80.1 MiB |
| path | 100,000 × 512 B | 4,096 × 8,192 | 4,096 × 32 | 64.0 MiB | 58.0 KiB | 52,772 B / 22,596 B | 192.1 MiB |
| nullifier | 100,000 × 40 B | 2,048 × 2,048 | 2,048 × 102 | 8.00 MiB | 14.5 KiB | 40,228 B / 5,700 B | 40.0 MiB |

The benchmark asked the server for this snapshot (ipir-sp, padded to 100,000); it was served 7.66 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 1.29 GiB before the request, a peak of 1.34 GiB until the snapshot was served, 1.31 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 1.34 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 3.43 MiB | 1.31 GiB | — | 22 ms |
| Build tree and paths | server | 64 B block roots | 1.34 GiB | — | 4.65 s, 14,914 hashes/s (69,353 hashes) |
| Build read table and masks | server | table 16.0 MiB, masks 29.0 KiB | table 715.6 MiB; setup 1.06 GiB | — | table 87 ms, setup 744 ms |
| Build path table and masks | server | table 64.0 MiB, masks 58.0 KiB | table 1.17 GiB; setup 1.27 GiB | — | table 132 ms, setup 1.53 s |
| Build nullifier table and masks | server | table 8.00 MiB, masks 14.5 KiB | table 1.28 GiB; setup 1.32 GiB | — | table 28 ms, setup 369 ms |
| Download scan file, block roots, masks | client A | 3.48 MiB cache | — | scan file 3.43 MiB in 24 ms; block roots 64 B in 37 ms; read masks 29.0 KiB in 13 ms; nullifier masks 14.5 KiB in 19 ms | — |
| Download scan file, block roots, masks | client B | 3.48 MiB cache | — | scan file 3.43 MiB in 30 ms; block roots 64 B in 8.8 ms; read masks 29.0 KiB in 11 ms; nullifier masks 14.5 KiB in 4.8 ms | — |
| Scan | client A | — | 863.4 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 706.5 MiB | — | 6.51 s for 100,000 outputs on 8 threads (65.1 µs/output) |
| Read coins (one call) | server (A's call) | — | 1.27 GiB | — | answer 52 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 863.4 MiB | 1.23 MiB up, 354.2 KiB down, round trip 78 ms | build 268 ms, decode 2.0 ms |
| Read coins (one call) | server (B's call) | — | 1.24 GiB | — | answer 44 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 662.4 MiB | 1.23 MiB up, 354.2 KiB down, round trip 58 ms | build 263 ms, decode 1.1 ms |
| Nullifier lookups (one call) | server (A's call) | — | 1.27 GiB | — | answer 51 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 635.7 MiB | 1.23 MiB up, 178.2 KiB down, round trip 74 ms | build 257 ms, decode 1.1 ms |
| Nullifier lookups (one call) | server (B's call) | — | 1.23 GiB | — | answer 35 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 662.4 MiB | 1.23 MiB up, 178.2 KiB down, round trip 40 ms | build 249 ms, decode 0.31 ms |
| Lower paths to spend (one call) | server (A's call) | — | 1.24 GiB | — | answer 75 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 635.3 MiB | 1.61 MiB up, 706.2 KiB down, round trip 82 ms | build 336 ms, decode 1.1 ms |
| Lower paths to spend (one call) | server (B's call) | — | 1.23 GiB | — | answer 71 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 668.1 MiB | 1.61 MiB up, 706.2 KiB down, round trip 84 ms | build 338 ms, decode 0.55 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.4 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 16 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 2.0 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 6.0 ms | 1.1 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 863.4 MiB | 2.46 MiB up, 4.11 MiB down (8 requests) | 7.32 s wall-clock; 7.06 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 706.5 MiB | 2.46 MiB up, 4.11 MiB down (8 requests) | 7.22 s wall-clock; 7.04 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**6 cells without a value:** Chain sync (core modules) / server / storage (no database given (--db-url)); Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 100,000 × 256 B + 100,000 × 32 B = **27.5 MiB** (28,800,000 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 4.11 MiB | 0.15× | 3.48 MiB | 652.9 KiB | 0.023× | 2.46 MiB |
| B | 4.11 MiB | 0.15× | 3.48 MiB | 652.9 KiB | 0.023× | 2.46 MiB |

A first sync downloads the snapshot's artifacts once (the scan file, block roots and the read and nullifier tables' masks, the same for every wallet); a later sync against the same snapshot moves only the manifest, the query calls and the tail. Both include the tail (outputs after the snapshot, in full, for every wallet); the baseline counts only the snapshot.

## The read and path tables at each `pathSplit` (FR-153, Q58)

**Not measured:** no database was given (`--db-url`), so the read table could not be built in-process.

## The scan by thread count

Not measured.

## What the server observes (FR-154)

Each request of each wallet's sync as the client sent it, with the line the module logged for it (route, status, body and answer lengths, `Range`, milliseconds; never a body). This is everything a sync shows the server, beside the client's network address and the requests' timing.

The sequences of method, path and body length are **identical** for A, B (FR-142), whatever coins each holds.

### A: 8 requests, 10 coins found (7 unspent), 10 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.93 KiB | — | 0.01 ms | 5.0 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 3.43 MiB | — | 0.07 ms | 24 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.06 ms | 37 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 29.0 KiB | — | 0.07 ms | 13 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.08 ms | 19 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.23 MiB | 354.2 KiB | — | 52 ms | 78 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 178.2 KiB | — | 51 ms | 74 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.4 ms | 16 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.93 KiB | — | 0.01 ms | 22 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 3.43 MiB | — | 0.05 ms | 30 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 8.7 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 29.0 KiB | — | 0.15 ms | 11 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.05 ms | 4.7 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.23 MiB | 354.2 KiB | — | 44 ms | 58 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 178.2 KiB | — | 35 ms | 40 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 2.0 ms | 6.0 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.86 KiB | 0.02 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 6.95 MiB | 0.57 ms |
| `POST /pss/v1/query/read` | 2 | 2.46 MiB | 708.3 KiB | 95 ms |
| `POST /pss/v1/query/nullifier` | 2 | 2.46 MiB | 356.3 KiB | 86 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 3.5 ms |

A wallet sends one call to each table for every 32 distinct rows it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 7.64 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 22 ms | 3.43 MiB | 1.31 GiB | — |
| tree | 4.65 s | 64 B | 1.34 GiB | — |
| readTable | 87 ms | 16.0 MiB | 715.6 MiB | — |
| readSetup | 744 ms | 29.0 KiB | 1.06 GiB | hints 51 ms, packing 649 ms, check 33 ms, packing held 64.1 MiB, largest phase error 2^34.17 of 2^37 over 3 rows |
| pathTable | 132 ms | 64.0 MiB | 1.17 GiB | — |
| pathSetup | 1.53 s | 58.0 KiB | 1.27 GiB | hints 163 ms, packing 1.29 s, check 52 ms, packing held 128.1 MiB, largest phase error 2^34.20 of 2^37 over 3 rows |
| nullifierTable | 28 ms | 8.00 MiB | 1.28 GiB | — |
| nullifierSetup | 369 ms | 14.5 KiB | 1.32 GiB | hints 24 ms, packing 316 ms, check 23 ms, packing held 32.0 MiB, largest phase error 2^34.39 of 2^37 over 3 rows |
| manifest | 0.67 ms | 1.93 KiB | 1.32 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 0.80 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
