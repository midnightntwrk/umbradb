# Private shielded sync: benchmark on preprod

Snapshot `bacb7beb8c81b029…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 1,000,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme simplepir, padded to 1,000,000 entries (debug) (built for this run). Run from 2026-11-16T05:07:41.392Z to 2026-11-16T05:10:40.750Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Load average (1, 5, 15 min) | start 14.33 / 14.02 / 12.55; end 19.13 / 16.34 / 13.78 |
| SimplePIR | q = 2^32, n = 1024, σ = 6.4, 9 bits per cell (p = 512) |
| Artifacts | blockRoots 64 B, nullifierPublic 23.3 MiB, nullifierTable 93.4 MiB, pathPublic 17.8 MiB, pathTable 869.8 MiB, readPublic 36.8 MiB, readTable 167.9 MiB, scan 34.3 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 23.3 MiB, nullifierTable 93.4 MiB, pathPublic 17.8 MiB, pathTable 869.8 MiB, readPublic 36.8 MiB, readTable 167.9 MiB, scan 34.3 MiB |

## The PIR tables

One request selects one column of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | setup data | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 1,000,000 × 98 B | 9,416 × 9,346 | 9,346 × 107 | 167.9 MiB | 36.8 MiB | 37,384 B / 37,664 B | 167.9 MiB |
| path | 1,000,000 × 512 B | 4,560 × 100,000 | 100,000 × 10 | 869.8 MiB | 17.8 MiB | 400,000 B / 18,240 B | 869.8 MiB |
| nullifier | 1,000,000 × 40 B | 5,976 × 8,192 | 8,192 × 166 | 93.4 MiB | 23.3 MiB | 32,768 B / 23,904 B | 93.4 MiB |

The benchmark asked the server for this snapshot (simplepir, padded to 1,000,000); it was served 34.88 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 1.27 GiB before the request, a peak of 2.58 GiB until the snapshot was served, 2.17 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 2.60 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 34.3 MiB | 1.17 GiB | — | 132 ms |
| Build tree and paths | server | 64 B block roots | 1.19 GiB | — | 4.66 s, 14,867 hashes/s (69,353 hashes) |
| Build read table and setup data | server | table 167.9 MiB, setup data 36.8 MiB | table 1.15 GiB; setup 1.32 GiB | — | table 365 ms, setup 3.89 s |
| Build path table and setup data | server | table 869.8 MiB, setup data 17.8 MiB | table 2.21 GiB; setup 2.60 GiB | — | table 2.16 s, setup 20.44 s |
| Build nullifier table and setup data | server | table 93.4 MiB, setup data 23.3 MiB | table 2.09 GiB; setup 2.18 GiB | — | table 724 ms, setup 2.33 s |
| Download scan file, block roots, setup data | client A | 94.5 MiB cache | — | scan file 34.3 MiB in 193 ms; block roots 64 B in 33 ms; read setup data 36.8 MiB in 96 ms; nullifier setup data 23.3 MiB in 52 ms | — |
| Download scan file, block roots, setup data | client B | 94.5 MiB cache | — | scan file 34.3 MiB in 141 ms; block roots 64 B in 9.3 ms; read setup data 36.8 MiB in 84 ms; nullifier setup data 23.3 MiB in 68 ms | — |
| Scan | client A | — | 703.1 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 1.26 GiB | — | 1 min 6 s for 1,000,000 outputs on 8 threads (66.4 µs/output) |
| Read coins (one call) | server (A's call) | — | 466.1 MiB | — | answer 161 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 703.1 MiB | 1.14 MiB up, 1.15 MiB down, round trip 175 ms | build 71 ms, decode 20 ms |
| Read coins (one call) | server (B's call) | — | 563.2 MiB | — | answer 164 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 1.26 GiB | 1.14 MiB up, 1.15 MiB down, round trip 182 ms | build 65 ms, decode 21 ms |
| Nullifier lookups (one call) | server (A's call) | — | 569.1 MiB | — | answer 70 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 526.8 MiB | 1.00 MiB up, 747.0 KiB down, round trip 80 ms | build 35 ms, decode 8.1 ms |
| Nullifier lookups (one call) | server (B's call) | — | 602.8 MiB | — | answer 100 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 584.4 MiB | 1.00 MiB up, 747.0 KiB down, round trip 110 ms | build 48 ms, decode 11 ms |
| Lower paths to spend (one call) | server (A's call) | — | 1.46 GiB | — | answer 674 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 1015.8 MiB | 12.2 MiB up, 570.0 KiB down, round trip 688 ms | build 384 ms, decode 5.8 ms |
| Lower paths to spend (one call) | server (B's call) | — | 1.45 GiB | — | answer 684 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 964.3 MiB | 12.2 MiB up, 570.0 KiB down, round trip 716 ms | build 427 ms, decode 7.0 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.7 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 9.1 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.6 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 25 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 703.1 MiB | 2.14 MiB up, 96.5 MiB down (8 requests) | 1 min 11 s wall-clock; 1 min 10 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 1.26 GiB | 2.14 MiB up, 96.5 MiB down (8 requests) | 1 min 7 s wall-clock; 1 min 7 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**6 cells without a value:** Chain sync (core modules) / server / storage (no database given (--db-url)); Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 1,000,000 × 256 B + 1,000,000 × 32 B = **274.7 MiB** (288,000,000 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 96.5 MiB | 0.351× | 94.5 MiB | 2.00 MiB | 0.007× | 2.14 MiB |
| B | 96.5 MiB | 0.351× | 94.5 MiB | 2.00 MiB | 0.007× | 2.14 MiB |

A first sync downloads the snapshot's artifacts once (the scan file, block roots and the read and nullifier tables' setup data, the same for every wallet); a later sync against the same snapshot moves only the manifest, the query calls and the tail. Both include the tail (outputs after the snapshot, in full, for every wallet); the baseline counts only the snapshot.

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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.91 KiB | — | 0.01 ms | 13 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 34.3 MiB | — | 0.06 ms | 193 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.06 ms | 33 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 36.8 MiB | — | 0.06 ms | 96 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 23.3 MiB | — | 0.06 ms | 52 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.14 MiB | 1.15 MiB | — | 161 ms | 175 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.00 MiB | 747.0 KiB | — | 70 ms | 80 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.7 ms | 9.1 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.91 KiB | — | 0.01 ms | 4.9 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 34.3 MiB | — | 0.12 ms | 140 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.05 ms | 9.2 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 36.8 MiB | — | 0.02 ms | 84 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 23.3 MiB | — | 0.07 ms | 67 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.14 MiB | 1.15 MiB | — | 164 ms | 182 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.00 MiB | 747.0 KiB | — | 100 ms | 110 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.6 ms | 25 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.82 KiB | 0.02 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 188.9 MiB | 0.49 ms |
| `POST /pss/v1/query/read` | 2 | 2.28 MiB | 2.30 MiB | 326 ms |
| `POST /pss/v1/query/nullifier` | 2 | 2.00 MiB | 1.46 MiB | 170 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 3.2 ms |

A wallet sends one call to each table for every 32 distinct columns it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 34.86 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 132 ms | 34.3 MiB | 1.17 GiB | — |
| tree | 4.66 s | 64 B | 1.19 GiB | — |
| readTable | 365 ms | 167.9 MiB | 1.15 GiB | — |
| readSetup | 3.89 s | 36.8 MiB | 1.32 GiB | — |
| pathTable | 2.16 s | 869.8 MiB | 2.21 GiB | — |
| pathSetup | 20.44 s | 17.8 MiB | 2.60 GiB | — |
| nullifierTable | 724 ms | 93.4 MiB | 2.09 GiB | — |
| nullifierSetup | 2.33 s | 23.3 MiB | 2.18 GiB | — |
| manifest | 3.3 ms | 1.91 KiB | 2.18 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 0.65 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
