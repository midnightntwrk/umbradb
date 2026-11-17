# Private shielded sync: benchmark on preprod

Snapshot `25f9609d23e7146b…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 2,000,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme simplepir, padded to 2,000,000 entries (debug) (built for this run). Run from 2026-11-16T05:46:18.909Z to 2026-11-16T05:51:26.548Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Server log | the stack's run.log; 20 of 20 requests paired with a server line |
| Load average (1, 5, 15 min) | start 12.08 / 14.23 / 16.41; end 10.52 / 11.72 / 14.52 |
| SimplePIR | q = 2^32, n = 1024, σ = 6.4, 9 bits per cell (p = 512) |
| Artifacts | blockRoots 64 B, nullifierPublic 43.0 MiB, nullifierTable 172.1 MiB, pathPublic 35.6 MiB, pathTable 1.70 GiB, readPublic 51.9 MiB, readTable 335.7 MiB, scan 68.7 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 43.0 MiB, nullifierTable 172.1 MiB, pathPublic 35.6 MiB, pathTable 1.70 GiB, readPublic 51.9 MiB, readTable 335.7 MiB, scan 68.7 MiB |

## The PIR tables

One request selects one column of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | setup data | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 2,000,000 × 98 B | 13,288 × 13,246 | 13,246 × 151 | 335.7 MiB | 51.9 MiB | 52,984 B / 53,152 B | 335.7 MiB |
| path | 2,000,000 × 512 B | 9,120 × 100,000 | 100,000 × 20 | 1.70 GiB | 35.6 MiB | 400,000 B / 36,480 B | 1.70 GiB |
| nullifier | 2,000,000 × 40 B | 11,016 × 8,192 | 8,192 × 306 | 172.1 MiB | 43.0 MiB | 32,768 B / 44,064 B | 172.1 MiB |

The benchmark asked the server for this snapshot (simplepir, padded to 2,000,000); it was served 1 min 1 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 2.74 GiB before the request, a peak of 6.29 GiB until the snapshot was served, 5.23 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 6.29 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 68.7 MiB | 3.01 GiB | — | 214 ms |
| Build tree and paths | server | 64 B block roots | 3.05 GiB | — | 4.50 s, 15,402 hashes/s (69,353 hashes) |
| Build read table and setup data | server | table 335.7 MiB, setup data 51.9 MiB | table 3.48 GiB; setup 3.71 GiB | — | table 561 ms, setup 7.97 s |
| Build path table and setup data | server | table 1.70 GiB, setup data 35.6 MiB | table 5.35 GiB; setup 5.88 GiB | — | table 3.44 s, setup 38.36 s |
| Build nullifier table and setup data | server | table 172.1 MiB, setup data 43.0 MiB | table 6.16 GiB; setup 6.29 GiB | — | table 1.24 s, setup 3.91 s |
| Download scan file, block roots, setup data | client A | 163.6 MiB cache | — | scan file 68.7 MiB in 122 ms; block roots 64 B in 5.5 ms; read setup data 51.9 MiB in 59 ms; nullifier setup data 43.0 MiB in 65 ms | — |
| Download scan file, block roots, setup data | client B | 163.6 MiB cache | — | scan file 68.7 MiB in 127 ms; block roots 64 B in 4.6 ms; read setup data 51.9 MiB in 95 ms; nullifier setup data 43.0 MiB in 72 ms | — |
| Scan | client A | — | 888.5 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 1.49 GiB | — | 1 min 59 s for 2,000,000 outputs on 8 threads (59.3 µs/output) |
| Read coins (one call) | server (A's call) | — | 4.36 GiB | — | answer 238 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 1.06 GiB | 1.62 MiB up, 1.62 MiB down, round trip 248 ms | build 73 ms, decode 19 ms |
| Read coins (one call) | server (B's call) | — | 2.97 GiB | — | answer 234 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 1.49 GiB | 1.62 MiB up, 1.62 MiB down, round trip 242 ms | build 65 ms, decode 16 ms |
| Nullifier lookups (one call) | server (A's call) | — | 4.36 GiB | — | answer 115 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 1.10 GiB | 1.00 MiB up, 1.34 MiB down, round trip 119 ms | build 34 ms, decode 21 ms |
| Nullifier lookups (one call) | server (B's call) | — | 2.97 GiB | — | answer 116 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 1.27 GiB | 1.00 MiB up, 1.34 MiB down, round trip 125 ms | build 32 ms, decode 14 ms |
| Lower paths to spend (one call) | server (A's call) | — | 4.36 GiB | — | answer 1.19 s (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 1.46 GiB | 12.2 MiB up, 1.11 MiB down, round trip 1.21 s | build 349 ms, decode 11 ms |
| Lower paths to spend (one call) | server (B's call) | — | 2.96 GiB | — | answer 1.19 s (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 1.30 GiB | 12.2 MiB up, 1.11 MiB down, round trip 1.21 s | build 364 ms, decode 11 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.4 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 4.1 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.3 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 6.2 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 1.10 GiB | 2.62 MiB up, 166.7 MiB down (8 requests) | 1 min 60 s wall-clock; 1 min 59 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 1.49 GiB | 2.62 MiB up, 166.7 MiB down (8 requests) | 1 min 60 s wall-clock; 1 min 59 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**6 cells without a value:** Chain sync (core modules) / server / storage (no database given (--db-url)); Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 2,000,000 × 256 B + 2,000,000 × 32 B = **549.3 MiB** (576,000,000 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 166.7 MiB | 0.303× | 163.6 MiB | 3.08 MiB | 0.006× | 2.62 MiB |
| B | 166.7 MiB | 0.303× | 163.6 MiB | 3.08 MiB | 0.006× | 2.62 MiB |

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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.92 KiB | — | 0.01 ms | 19 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 68.7 MiB | — | 0.06 ms | 122 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 5.4 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 51.9 MiB | — | 0.04 ms | 59 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 43.0 MiB | — | 0.08 ms | 65 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.62 MiB | 1.62 MiB | — | 238 ms | 248 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.00 MiB | 1.34 MiB | — | 115 ms | 119 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.4 ms | 4.1 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.92 KiB | — | 0.01 ms | 3.4 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 68.7 MiB | — | 0.05 ms | 127 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 4.5 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 51.9 MiB | — | 0.05 ms | 95 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 43.0 MiB | — | 0.04 ms | 72 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.62 MiB | 1.62 MiB | — | 234 ms | 242 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.00 MiB | 1.34 MiB | — | 116 ms | 125 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.3 ms | 6.2 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.83 KiB | 0.01 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 327.2 MiB | 0.39 ms |
| `POST /pss/v1/query/read` | 2 | 3.23 MiB | 3.24 MiB | 471 ms |
| `POST /pss/v1/query/nullifier` | 2 | 2.00 MiB | 2.69 MiB | 231 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 2.7 ms |

A wallet sends one call to each table for every 32 distinct columns it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 1 min 0 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 214 ms | 68.7 MiB | 3.01 GiB | — |
| tree | 4.50 s | 64 B | 3.05 GiB | — |
| readTable | 561 ms | 335.7 MiB | 3.48 GiB | — |
| readSetup | 7.97 s | 51.9 MiB | 3.71 GiB | — |
| pathTable | 3.44 s | 1.70 GiB | 5.35 GiB | — |
| pathSetup | 38.36 s | 35.6 MiB | 5.88 GiB | — |
| nullifierTable | 1.24 s | 172.1 MiB | 6.16 GiB | — |
| nullifierSetup | 3.91 s | 43.0 MiB | 6.29 GiB | — |
| manifest | 181 ms | 1.92 KiB | 6.23 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 1.2 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
