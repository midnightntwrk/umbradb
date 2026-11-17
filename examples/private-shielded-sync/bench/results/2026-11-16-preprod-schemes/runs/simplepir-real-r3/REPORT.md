# Private shielded sync: benchmark on preprod

Snapshot `004805f18b8e91a0…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 57,812 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme simplepir (built for this run). Run from 2026-11-16T05:03:38.406Z to 2026-11-16T05:04:02.935Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Load average (1, 5, 15 min) | start 21.96 / 12.09 / 11.49; end 21.6 / 12.89 / 11.8 |
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

The benchmark asked the server for this snapshot (simplepir); it was served 8.74 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 594.4 MiB before the request, a peak of 1.31 GiB until the snapshot was served, 1.31 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 1.31 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 2.38 MiB | 708.6 MiB | — | 39 ms |
| Build tree and paths | server | 64 B block roots | 831.1 MiB | — | 5.51 s, 12,578 hashes/s (69,353 hashes) |
| Build read table and setup data | server | table 11.6 MiB, setup data 9.63 MiB | table 608.7 MiB; setup 679.9 MiB | — | table 120 ms, setup 353 ms |
| Build path table and setup data | server | table 60.3 MiB, setup data 1.78 MiB | table 740.6 MiB; setup 1.30 GiB | — | table 295 ms, setup 1.78 s |
| Build nullifier table and setup data | server | table 6.47 MiB, setup data 6.47 MiB | table 1.30 GiB; setup 1.31 GiB | — | table 40 ms, setup 229 ms |
| Download scan file, block roots, setup data | client A | 18.5 MiB cache | — | scan file 2.38 MiB in 16 ms; block roots 64 B in 11 ms; read setup data 9.63 MiB in 65 ms; nullifier setup data 6.47 MiB in 13 ms | — |
| Download scan file, block roots, setup data | client B | 18.5 MiB cache | — | scan file 2.38 MiB in 15 ms; block roots 64 B in 4.0 ms; read setup data 9.63 MiB in 38 ms; nullifier setup data 6.47 MiB in 33 ms | — |
| Scan | client A | — | 778.7 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 1.01 GiB | — | 4.77 s for 69,329 outputs on 8 threads (68.8 µs/output) |
| Read coins (one call) | server (A's call) | — | 755.7 MiB | — | answer 10 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 778.7 MiB | 309.7 KiB up, 308.0 KiB down, round trip 14 ms | build 30 ms, decode 11 ms |
| Read coins (one call) | server (B's call) | — | 766.4 MiB | — | answer 8.6 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 1.02 GiB | 309.7 KiB up, 308.0 KiB down, round trip 19 ms | build 28 ms, decode 5.7 ms |
| Nullifier lookups (one call) | server (A's call) | — | 755.7 MiB | — | answer 4.8 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 708.5 MiB | 256.0 KiB up, 207.0 KiB down, round trip 26 ms | build 12 ms, decode 3.3 ms |
| Nullifier lookups (one call) | server (B's call) | — | 766.4 MiB | — | answer 5.3 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 1.03 GiB | 256.0 KiB up, 207.0 KiB down, round trip 8.3 ms | build 8.9 ms, decode 2.2 ms |
| Lower paths to spend (one call) | server (A's call) | — | 762.5 MiB | — | answer 47 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 1012.3 MiB | 8.46 MiB up, 57.0 KiB down, round trip 67 ms | build 252 ms, decode 0.96 ms |
| Lower paths to spend (one call) | server (B's call) | — | 780.9 MiB | — | answer 47 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 1.09 GiB | 8.46 MiB up, 57.0 KiB down, round trip 61 ms | build 281 ms, decode 1.1 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.4 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 3.5 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 0.01 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 2.0 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 778.7 MiB | 565.7 KiB up, 19.1 MiB down (8 requests) | 5.89 s wall-clock; 5.74 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 1.03 GiB | 565.7 KiB up, 19.1 MiB down (8 requests) | 4.95 s wall-clock; 4.82 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**6 cells without a value:** Chain sync (core modules) / server / storage (no database given (--db-url)); Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 69,329 × 256 B + 57,812 × 32 B = **18.7 MiB** (19,598,208 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 19.1 MiB | 1.02× | 18.5 MiB | 635.6 KiB | 0.033× | 565.7 KiB |
| B | 19.1 MiB | 1.02× | 18.5 MiB | 635.6 KiB | 0.033× | 565.7 KiB |

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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.86 KiB | — | 0.01 ms | 5.0 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 2.38 MiB | — | 0.09 ms | 16 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.10 ms | 11 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 9.63 MiB | — | 0.06 ms | 65 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 6.47 MiB | — | 0.05 ms | 13 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 309.7 KiB | 308.0 KiB | — | 10 ms | 14 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 256.0 KiB | 207.0 KiB | — | 4.8 ms | 26 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.4 ms | 3.5 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.86 KiB | — | 0.01 ms | 3.1 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 2.38 MiB | — | 0.06 ms | 15 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.05 ms | 3.9 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 9.63 MiB | — | 0.03 ms | 38 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 6.47 MiB | — | 0.08 ms | 32 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 309.7 KiB | 308.0 KiB | — | 8.6 ms | 19 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 256.0 KiB | 207.0 KiB | — | 5.3 ms | 8.3 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 0.01 ms | 2.0 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.73 KiB | 0.03 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 36.9 MiB | 0.51 ms |
| `POST /pss/v1/query/read` | 2 | 619.3 KiB | 616.1 KiB | 19 ms |
| `POST /pss/v1/query/nullifier` | 2 | 512.1 KiB | 414.1 KiB | 10 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 1.4 ms |

A wallet sends one call to each table for every 32 distinct columns it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 8.50 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 39 ms | 2.38 MiB | 708.6 MiB | — |
| tree | 5.51 s | 64 B | 831.1 MiB | — |
| readTable | 120 ms | 11.6 MiB | 608.7 MiB | — |
| readSetup | 353 ms | 9.63 MiB | 679.9 MiB | — |
| pathTable | 295 ms | 60.3 MiB | 740.6 MiB | — |
| pathSetup | 1.78 s | 1.78 MiB | 1.30 GiB | — |
| nullifierTable | 40 ms | 6.47 MiB | 1.30 GiB | — |
| nullifierSetup | 229 ms | 6.47 MiB | 1.31 GiB | — |
| manifest | 5.5 ms | 1.86 KiB | 1.31 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 9.5 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
