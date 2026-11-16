# Private shielded sync: benchmark on preprod

Snapshot `d9625443b503ae17…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 100,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme ipir-sp, padded to 100,000 entries (debug) (built for this run). Run from 2026-11-16T05:07:06.476Z to 2026-11-16T05:07:34.586Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Load average (1, 5, 15 min) | start 17.87 / 14.52 / 12.66; end 16.01 / 14.32 / 12.64 |
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

The benchmark asked the server for this snapshot (ipir-sp, padded to 100,000); it was served 8.19 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 1.40 GiB before the request, a peak of 1.44 GiB until the snapshot was served, 1.37 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 1.44 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 3.43 MiB | 1.42 GiB | — | 29 ms |
| Build tree and paths | server | 64 B block roots | 1.44 GiB | — | 4.65 s, 14,906 hashes/s (69,353 hashes) |
| Build read table and masks | server | table 16.0 MiB, masks 29.0 KiB | table 1014.2 MiB; setup 1.23 GiB | — | table 101 ms, setup 754 ms |
| Build path table and masks | server | table 64.0 MiB, masks 58.0 KiB | table 1.26 GiB; setup 1.37 GiB | — | table 143 ms, setup 1.55 s |
| Build nullifier table and masks | server | table 8.00 MiB, masks 14.5 KiB | table 1.37 GiB; setup 1.37 GiB | — | table 28 ms, setup 377 ms |
| Download scan file, block roots, masks | client A | 3.48 MiB cache | — | scan file 3.43 MiB in 20 ms; block roots 64 B in 36 ms; read masks 29.0 KiB in 22 ms; nullifier masks 14.5 KiB in 2.9 ms | — |
| Download scan file, block roots, masks | client B | 3.48 MiB cache | — | scan file 3.43 MiB in 10 ms; block roots 64 B in 26 ms; read masks 29.0 KiB in 18 ms; nullifier masks 14.5 KiB in 43 ms | — |
| Scan | client A | — | 909.1 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 743.5 MiB | — | 6.59 s for 100,000 outputs on 8 threads (65.9 µs/output) |
| Read coins (one call) | server (A's call) | — | 1.36 GiB | — | answer 43 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 909.1 MiB | 1.23 MiB up, 354.2 KiB down, round trip 51 ms | build 265 ms, decode 2.1 ms |
| Read coins (one call) | server (B's call) | — | 1.30 GiB | — | answer 65 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 748.4 MiB | 1.23 MiB up, 354.2 KiB down, round trip 87 ms | build 268 ms, decode 1.1 ms |
| Nullifier lookups (one call) | server (A's call) | — | 1.36 GiB | — | answer 27 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 704.0 MiB | 1.23 MiB up, 178.2 KiB down, round trip 33 ms | build 248 ms, decode 0.88 ms |
| Nullifier lookups (one call) | server (B's call) | — | 1.30 GiB | — | answer 65 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 748.5 MiB | 1.23 MiB up, 178.2 KiB down, round trip 83 ms | build 253 ms, decode 0.37 ms |
| Lower paths to spend (one call) | server (A's call) | — | 1.35 GiB | — | answer 74 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 711.8 MiB | 1.61 MiB up, 706.2 KiB down, round trip 78 ms | build 334 ms, decode 1.2 ms |
| Lower paths to spend (one call) | server (B's call) | — | 1.30 GiB | — | answer 107 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 754.1 MiB | 1.61 MiB up, 706.2 KiB down, round trip 116 ms | build 343 ms, decode 0.44 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.4 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 18 ms | 1.5 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.9 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 21 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 909.1 MiB | 2.46 MiB up, 4.11 MiB down (8 requests) | 7.37 s wall-clock; 7.17 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 748.5 MiB | 2.46 MiB up, 4.11 MiB down (8 requests) | 7.43 s wall-clock; 7.13 s without network waits |
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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.93 KiB | — | 0.01 ms | 17 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 3.43 MiB | — | 0.12 ms | 20 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 36 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 29.0 KiB | — | 0.05 ms | 22 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.04 ms | 2.9 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.23 MiB | 354.2 KiB | — | 43 ms | 51 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 178.2 KiB | — | 27 ms | 33 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.4 ms | 18 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.93 KiB | — | 0.01 ms | 15 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 3.43 MiB | — | 0.05 ms | 10 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 26 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 29.0 KiB | — | 0.04 ms | 18 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.06 ms | 43 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.23 MiB | 354.2 KiB | — | 65 ms | 87 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 178.2 KiB | — | 65 ms | 83 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.9 ms | 21 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.86 KiB | 0.01 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 6.95 MiB | 0.44 ms |
| `POST /pss/v1/query/read` | 2 | 2.46 MiB | 708.3 KiB | 108 ms |
| `POST /pss/v1/query/nullifier` | 2 | 2.46 MiB | 356.3 KiB | 92 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 3.3 ms |

A wallet sends one call to each table for every 32 distinct rows it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 7.70 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 29 ms | 3.43 MiB | 1.42 GiB | — |
| tree | 4.65 s | 64 B | 1.44 GiB | — |
| readTable | 101 ms | 16.0 MiB | 1014.2 MiB | — |
| readSetup | 754 ms | 29.0 KiB | 1.23 GiB | hints 53 ms, packing 658 ms, check 32 ms, packing held 64.1 MiB, largest phase error 2^34.17 of 2^37 over 3 rows |
| pathTable | 143 ms | 64.0 MiB | 1.26 GiB | — |
| pathSetup | 1.55 s | 58.0 KiB | 1.37 GiB | hints 155 ms, packing 1.32 s, check 53 ms, packing held 128.1 MiB, largest phase error 2^34.20 of 2^37 over 3 rows |
| nullifierTable | 28 ms | 8.00 MiB | 1.37 GiB | — |
| nullifierSetup | 377 ms | 14.5 KiB | 1.37 GiB | hints 24 ms, packing 323 ms, check 25 ms, packing held 32.0 MiB, largest phase error 2^34.39 of 2^37 over 3 rows |
| manifest | 4.4 ms | 1.93 KiB | 1.37 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 8.7 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
