# Private shielded sync: benchmark on preprod

Snapshot `a099c11ae94b3a72…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 2,000,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme ipir-sp, padded to 2,000,000 entries (debug) (built for this run). Run from 2026-11-16T05:41:38.507Z to 2026-11-16T05:46:17.501Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

## Setup

|  |  |
|---|---|
| Machine | Apple M4 Max, 16 cores, 48.0 GiB, darwin 24.6.0 arm64 |
| Node.js (client, benchmark) | v24.9.0 |
| UmbraDB | 0.10.0 at `e1f7637250b6 (with uncommitted changes)` |
| Scan kernel | `pss-kernel.wasm` SHA-256 `b34f9b0003e1b1f9…` |
| Client ledger package | @midnightntwrk/ledger-v9 1.0.1 |
| Network | preprod |
| Server | http://127.0.0.1:10580; its process: Node.js v24.9.0, darwin arm64, 16 CPUs (from its build statistics); 6 PIR threads |
| Server modules | core-chain 0.10.0, core-block-fetch 0.10.0, core-block-commit 0.10.0, core-digest 0.10.0, core-health 0.10.0, core-status 0.10.0, core-config 0.10.0, core-chain-events 0.10.0, core-block-parsed 0.10.0, core-tx-results 0.10.0, core-ledger-state 0.10.0, core-contract-logs-full 0.10.0, core-contract-states 0.10.0, private-shielded-sync 0.1.0 |
| Server memory | process 53587, `ps -o rss=` every 200 ms |
| Server log | the file /Users/edwardalvarado/todo/Umbra/resources/00058-poc-ipir/stack/run.log; 20 of 20 requests paired with a server line |
| Load average (1, 5, 15 min) | start 12.87 / 16.01 / 17.77; end 12.08 / 14.23 / 16.41 |
| PIR scheme ipir-sp | digitBits 19, digits 2, maskBits 29, pBits 16, qBits 54, queryBits 49, responseBits 22, ring 2048 |
| Artifacts | blockRoots 64 B, nullifierPublic 87.0 KiB, nullifierTable 96.0 MiB, pathPublic 261.0 KiB, pathTable 1008.0 MiB, readPublic 116.0 KiB, readTable 192.0 MiB, scan 68.7 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 87.0 KiB, nullifierTable 96.0 MiB, pathPublic 261.0 KiB, pathTable 1008.0 MiB, readPublic 116.0 KiB, readTable 192.0 MiB, scan 68.7 MiB |

## The PIR tables

One request selects one row of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | masks | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 2,000,000 × 98 B | 6,144 × 16,384 | 6,144 × 334 | 192.0 MiB | 116.0 KiB | 65,316 B / 45,124 B | 448.3 MiB |
| path | 2,000,000 × 512 B | 14,336 × 36,864 | 14,336 × 144 | 1008.0 MiB | 261.0 KiB | 115,492 B / 101,444 B | 1.55 GiB |
| nullifier | 2,000,000 × 40 B | 4,096 × 12,288 | 4,096 × 614 | 96.0 MiB | 87.0 KiB | 52,772 B / 33,860 B | 288.2 MiB |

The benchmark asked the server for this snapshot (ipir-sp, padded to 2,000,000); it was served 20.94 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 2.69 GiB before the request, a peak of 5.26 GiB until the snapshot was served, 4.70 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 5.26 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 68.7 MiB | 2.85 GiB | — | 198 ms |
| Build tree and paths | server | 64 B block roots | 2.90 GiB | — | 4.53 s, 15,316 hashes/s (69,353 hashes) |
| Build read table and masks | server | table 192.0 MiB, masks 116.0 KiB | table 3.19 GiB; setup 3.78 GiB | — | table 211 ms, setup 2.99 s |
| Build path table and masks | server | table 1008.0 MiB, masks 261.0 KiB | table 4.76 GiB; setup 4.93 GiB | — | table 1.36 s, setup 7.90 s |
| Build nullifier table and masks | server | table 96.0 MiB, masks 87.0 KiB | table 5.16 GiB; setup 5.26 GiB | — | table 796 ms, setup 2.23 s |
| Download scan file, block roots, masks | client A | 68.9 MiB cache | — | scan file 68.7 MiB in 133 ms; block roots 64 B in 4.7 ms; read masks 116.0 KiB in 2.6 ms; nullifier masks 87.0 KiB in 2.0 ms | — |
| Download scan file, block roots, masks | client B | 68.9 MiB cache | — | scan file 68.7 MiB in 371 ms; block roots 64 B in 14 ms; read masks 116.0 KiB in 3.7 ms; nullifier masks 87.0 KiB in 3.5 ms | — |
| Scan | client A | — | 850.4 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 781.9 MiB | — | 2 min 3 s for 2,000,000 outputs on 8 threads (61.3 µs/output) |
| Read coins (one call) | server (A's call) | — | 792.3 MiB | — | answer 404 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 850.4 MiB | 1.99 MiB up, 1.38 MiB down, round trip 418 ms | build 465 ms, decode 8.6 ms |
| Read coins (one call) | server (B's call) | — | 880.5 MiB | — | answer 157 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 296.5 MiB | 1.99 MiB up, 1.38 MiB down, round trip 169 ms | build 431 ms, decode 2.4 ms |
| Nullifier lookups (one call) | server (A's call) | — | 1.06 GiB | — | answer 285 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 283.3 MiB | 1.61 MiB up, 1.03 MiB down, round trip 295 ms | build 383 ms, decode 4.5 ms |
| Nullifier lookups (one call) | server (B's call) | — | 1.15 GiB | — | answer 111 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 303.9 MiB | 1.61 MiB up, 1.03 MiB down, round trip 118 ms | build 352 ms, decode 1.2 ms |
| Lower paths to spend (one call) | server (A's call) | — | 2.64 GiB | — | answer 974 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 319.0 MiB | 3.52 MiB up, 3.10 MiB down, round trip 990 ms | build 780 ms, decode 4.9 ms |
| Lower paths to spend (one call) | server (B's call) | — | 2.72 GiB | — | answer 511 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 341.9 MiB | 3.52 MiB up, 3.10 MiB down, round trip 521 ms | build 774 ms, decode 1.9 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 5.9 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 20 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.5 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 3.7 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 850.4 MiB | 3.60 MiB up, 71.4 MiB down (8 requests) | 2 min 7 s wall-clock; 2 min 6 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 781.9 MiB | 3.60 MiB up, 71.4 MiB down (8 requests) | 2 min 4 s wall-clock; 2 min 3 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**6 cells without a value:** Chain sync (core modules) / server / storage (no database given (--db-url)); Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 2,000,000 × 256 B + 2,000,000 × 32 B = **549.3 MiB** (576,000,000 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 71.4 MiB | 0.13× | 68.9 MiB | 2.53 MiB | 0.005× | 3.60 MiB |
| B | 71.4 MiB | 0.13× | 68.9 MiB | 2.53 MiB | 0.005× | 3.60 MiB |

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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.95 KiB | — | 0.01 ms | 13 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 68.7 MiB | — | 0.07 ms | 133 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 4.6 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 116.0 KiB | — | 0.02 ms | 2.5 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 87.0 KiB | — | 0.02 ms | 2.0 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.99 MiB | 1.38 MiB | — | 404 ms | 418 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.61 MiB | 1.03 MiB | — | 285 ms | 295 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 5.9 ms | 20 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.95 KiB | — | 0.01 ms | 24 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 68.7 MiB | — | 0.04 ms | 371 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 14 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 116.0 KiB | — | 0.03 ms | 3.6 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 87.0 KiB | — | 0.02 ms | 3.5 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.99 MiB | 1.38 MiB | — | 157 ms | 169 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.61 MiB | 1.03 MiB | — | 111 ms | 118 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.5 ms | 3.6 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.89 KiB | 0.02 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 137.7 MiB | 0.29 ms |
| `POST /pss/v1/query/read` | 2 | 3.99 MiB | 2.75 MiB | 561 ms |
| `POST /pss/v1/query/nullifier` | 2 | 3.22 MiB | 2.07 MiB | 396 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 7.4 ms |

A wallet sends one call to each table for every 32 distinct rows it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 20.43 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 198 ms | 68.7 MiB | 2.85 GiB | — |
| tree | 4.53 s | 64 B | 2.90 GiB | — |
| readTable | 211 ms | 192.0 MiB | 3.19 GiB | — |
| readSetup | 2.99 s | 116.0 KiB | 3.78 GiB | hints 359 ms, packing 2.48 s, check 89 ms, packing held 256.3 MiB, largest phase error 2^34.28 of 2^37 over 3 rows |
| pathTable | 1.36 s | 1008.0 MiB | 4.76 GiB | — |
| pathSetup | 7.90 s | 261.0 KiB | 4.93 GiB | hints 1.66 s, packing 5.72 s, check 198 ms, packing held 576.6 MiB, largest phase error 2^34.28 of 2^37 over 3 rows |
| nullifierTable | 796 ms | 96.0 MiB | 5.16 GiB | — |
| nullifierSetup | 2.23 s | 87.0 KiB | 5.26 GiB | hints 203 ms, packing 1.91 s, check 68 ms, packing held 192.2 MiB, largest phase error 2^34.26 of 2^37 over 3 rows |
| manifest | 153 ms | 1.95 KiB | 4.70 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 2.0 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
