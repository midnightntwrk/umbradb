# Private shielded sync: benchmark on preprod

Snapshot `7372f6d3bbc56186…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 1,000,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme ipir-sp, padded to 1,000,000 entries (debug) (built for this run). Run from 2026-11-16T05:10:42.343Z to 2026-11-16T05:13:28.766Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Server log | the stack's run.log; 20 of 20 requests paired with a server line |
| Load average (1, 5, 15 min) | start 19.13 / 16.34 / 13.78; end 26.62 / 20.97 / 16.15 |
| PIR scheme ipir-sp | digitBits 19, digits 2, maskBits 29, pBits 16, qBits 54, queryBits 49, responseBits 22, ring 2048 |
| Artifacts | blockRoots 64 B, nullifierPublic 87.0 KiB, nullifierTable 48.0 MiB, pathPublic 188.5 KiB, pathTable 520.0 MiB, readPublic 87.0 KiB, readTable 96.0 MiB, scan 34.3 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 87.0 KiB, nullifierTable 48.0 MiB, pathPublic 188.5 KiB, pathTable 520.0 MiB, readPublic 87.0 KiB, readTable 96.0 MiB, scan 34.3 MiB |

## The PIR tables

One request selects one row of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | masks | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 1,000,000 × 98 B | 4,096 × 12,288 | 4,096 × 250 | 96.0 MiB | 87.0 KiB | 52,772 B / 33,860 B | 288.2 MiB |
| path | 1,000,000 × 512 B | 10,240 × 26,624 | 10,240 × 104 | 520.0 MiB | 188.5 KiB | 90,404 B / 73,284 B | 936.4 MiB |
| nullifier | 1,000,000 × 40 B | 2,048 × 12,288 | 2,048 × 614 | 48.0 MiB | 87.0 KiB | 40,228 B / 33,860 B | 240.2 MiB |

The benchmark asked the server for this snapshot (ipir-sp, padded to 1,000,000); it was served 17.86 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 1.49 GiB before the request, a peak of 2.65 GiB until the snapshot was served, 1.85 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 2.76 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 34.3 MiB | 1.59 GiB | — | 126 ms |
| Build tree and paths | server | 64 B block roots | 1.63 GiB | — | 4.73 s, 14,663 hashes/s (69,353 hashes) |
| Build read table and masks | server | table 96.0 MiB, masks 87.0 KiB | table 1.74 GiB; setup 2.15 GiB | — | table 188 ms, setup 2.97 s |
| Build path table and masks | server | table 520.0 MiB, masks 188.5 KiB | table 2.76 GiB; setup 2.67 GiB | — | table 610 ms, setup 6.27 s |
| Build nullifier table and masks | server | table 48.0 MiB, masks 87.0 KiB | table 2.11 GiB; setup 2.30 GiB | — | table 343 ms, setup 2.24 s |
| Download scan file, block roots, masks | client A | 34.5 MiB cache | — | scan file 34.3 MiB in 140 ms; block roots 64 B in 7.2 ms; read masks 87.0 KiB in 3.8 ms; nullifier masks 87.0 KiB in 2.5 ms | — |
| Download scan file, block roots, masks | client B | 34.5 MiB cache | — | scan file 34.3 MiB in 129 ms; block roots 64 B in 8.1 ms; read masks 87.0 KiB in 4.9 ms; nullifier masks 87.0 KiB in 8.6 ms | — |
| Scan | client A | — | 662.5 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 653.4 MiB | — | 1 min 10 s for 1,000,000 outputs on 8 threads (70.0 µs/output) |
| Read coins (one call) | server (A's call) | — | 586.6 MiB | — | answer 255 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 662.5 MiB | 1.61 MiB up, 1.03 MiB down, round trip 290 ms | build 367 ms, decode 3.6 ms |
| Read coins (one call) | server (B's call) | — | 622.3 MiB | — | answer 149 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 197.7 MiB | 1.61 MiB up, 1.03 MiB down, round trip 169 ms | build 366 ms, decode 2.3 ms |
| Nullifier lookups (one call) | server (A's call) | — | 833.8 MiB | — | answer 135 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 205.3 MiB | 1.23 MiB up, 1.03 MiB down, round trip 147 ms | build 312 ms, decode 3.6 ms |
| Nullifier lookups (one call) | server (B's call) | — | 870.8 MiB | — | answer 117 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 208.7 MiB | 1.23 MiB up, 1.03 MiB down, round trip 143 ms | build 308 ms, decode 1.2 ms |
| Lower paths to spend (one call) | server (A's call) | — | 1.76 GiB | — | answer 475 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 231.2 MiB | 2.76 MiB up, 2.24 MiB down, round trip 488 ms | build 606 ms, decode 4.4 ms |
| Lower paths to spend (one call) | server (B's call) | — | 1.77 GiB | — | answer 463 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 233.4 MiB | 2.76 MiB up, 2.24 MiB down, round trip 488 ms | build 597 ms, decode 1.8 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.5 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 15 ms | 1.5 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.6 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 15 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 662.5 MiB | 2.84 MiB up, 36.7 MiB down (8 requests) | 1 min 11 s wall-clock; 1 min 10 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 653.4 MiB | 2.84 MiB up, 36.7 MiB down (8 requests) | 1 min 11 s wall-clock; 1 min 11 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**6 cells without a value:** Chain sync (core modules) / server / storage (no database given (--db-url)); Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 1,000,000 × 256 B + 1,000,000 × 32 B = **274.7 MiB** (288,000,000 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 36.7 MiB | 0.134× | 34.5 MiB | 2.18 MiB | 0.008× | 2.84 MiB |
| B | 36.7 MiB | 0.134× | 34.5 MiB | 2.18 MiB | 0.008× | 2.84 MiB |

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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.94 KiB | — | 0.01 ms | 14 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 34.3 MiB | — | 0.14 ms | 140 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.11 ms | 7.1 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 87.0 KiB | — | 0.05 ms | 3.7 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 87.0 KiB | — | 0.04 ms | 2.5 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.61 MiB | 1.03 MiB | — | 255 ms | 290 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 1.03 MiB | — | 135 ms | 147 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.5 ms | 15 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.94 KiB | — | 0.01 ms | 4.3 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 34.3 MiB | — | 0.06 ms | 129 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.12 ms | 8.0 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 87.0 KiB | — | 0.04 ms | 4.8 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 87.0 KiB | — | 0.04 ms | 8.5 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.61 MiB | 1.03 MiB | — | 149 ms | 169 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 1.03 MiB | — | 117 ms | 143 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.6 ms | 15 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.89 KiB | 0.02 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 69.0 MiB | 0.59 ms |
| `POST /pss/v1/query/read` | 2 | 3.22 MiB | 2.07 MiB | 404 ms |
| `POST /pss/v1/query/nullifier` | 2 | 2.46 MiB | 2.07 MiB | 252 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 3.1 ms |

A wallet sends one call to each table for every 32 distinct rows it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 17.56 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 126 ms | 34.3 MiB | 1.59 GiB | — |
| tree | 4.73 s | 64 B | 1.63 GiB | — |
| readTable | 188 ms | 96.0 MiB | 1.74 GiB | — |
| readSetup | 2.97 s | 87.0 KiB | 2.15 GiB | hints 362 ms, packing 2.44 s, check 99 ms, packing held 192.2 MiB, largest phase error 2^34.54 of 2^37 over 3 rows |
| pathTable | 610 ms | 520.0 MiB | 2.76 GiB | — |
| pathSetup | 6.27 s | 188.5 KiB | 2.67 GiB | hints 1.25 s, packing 4.67 s, check 160 ms, packing held 416.4 MiB, largest phase error 2^34.46 of 2^37 over 3 rows |
| nullifierTable | 343 ms | 48.0 MiB | 2.11 GiB | — |
| nullifierSetup | 2.24 s | 87.0 KiB | 2.30 GiB | hints 164 ms, packing 1.99 s, check 67 ms, packing held 192.2 MiB, largest phase error 2^34.24 of 2^37 over 3 rows |
| manifest | 0.73 ms | 1.94 KiB | 2.30 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 0.72 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
