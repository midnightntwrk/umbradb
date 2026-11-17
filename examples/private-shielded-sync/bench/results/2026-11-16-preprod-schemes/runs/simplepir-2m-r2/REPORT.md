# Private shielded sync: benchmark on preprod

Snapshot `25f9609d23e7146b…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 2,000,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme simplepir, padded to 2,000,000 entries (debug) (built for this run). Run from 2026-11-16T05:36:16.928Z to 2026-11-16T05:41:37.040Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Load average (1, 5, 15 min) | start 20.35 / 20.64 / 19.64; end 12.87 / 16.01 / 17.77 |
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

The benchmark asked the server for this snapshot (simplepir, padded to 2,000,000); it was served 1 min 4 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 2.62 GiB before the request, a peak of 4.21 GiB until the snapshot was served, 1.14 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 4.51 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 68.7 MiB | 2.90 GiB | — | 245 ms |
| Build tree and paths | server | 64 B block roots | 2.95 GiB | — | 4.60 s, 15,080 hashes/s (69,353 hashes) |
| Build read table and setup data | server | table 335.7 MiB, setup data 51.9 MiB | table 3.37 GiB; setup 3.54 GiB | — | table 559 ms, setup 8.01 s |
| Build path table and setup data | server | table 1.70 GiB, setup data 35.6 MiB | table 4.51 GiB; setup 3.28 GiB | — | table 4.14 s, setup 40.80 s |
| Build nullifier table and setup data | server | table 172.1 MiB, setup data 43.0 MiB | table 1.57 GiB; setup 1.68 GiB | — | table 1.40 s, setup 3.96 s |
| Download scan file, block roots, setup data | client A | 163.6 MiB cache | — | scan file 68.7 MiB in 140 ms; block roots 64 B in 4.1 ms; read setup data 51.9 MiB in 64 ms; nullifier setup data 43.0 MiB in 61 ms | — |
| Download scan file, block roots, setup data | client B | 163.6 MiB cache | — | scan file 68.7 MiB in 225 ms; block roots 64 B in 6.3 ms; read setup data 51.9 MiB in 130 ms; nullifier setup data 43.0 MiB in 89 ms | — |
| Scan | client A | — | 876.7 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 1.37 GiB | — | 2 min 2 s for 2,000,000 outputs on 8 threads (61.1 µs/output) |
| Read coins (one call) | server (A's call) | — | 728.7 MiB | — | answer 272 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 876.7 MiB | 1.62 MiB up, 1.62 MiB down, round trip 286 ms | build 125 ms, decode 30 ms |
| Read coins (one call) | server (B's call) | — | 842.5 MiB | — | answer 249 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 1.37 GiB | 1.62 MiB up, 1.62 MiB down, round trip 257 ms | build 65 ms, decode 17 ms |
| Nullifier lookups (one call) | server (A's call) | — | 832.5 MiB | — | answer 140 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 705.4 MiB | 1.00 MiB up, 1.34 MiB down, round trip 147 ms | build 38 ms, decode 17 ms |
| Nullifier lookups (one call) | server (B's call) | — | 966.0 MiB | — | answer 124 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 676.5 MiB | 1.00 MiB up, 1.34 MiB down, round trip 131 ms | build 58 ms, decode 13 ms |
| Lower paths to spend (one call) | server (A's call) | — | 2.54 GiB | — | answer 1.27 s (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 1.08 GiB | 12.2 MiB up, 1.11 MiB down, round trip 1.29 s | build 376 ms, decode 12 ms |
| Lower paths to spend (one call) | server (B's call) | — | 2.49 GiB | — | answer 1.26 s (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 1.10 GiB | 12.2 MiB up, 1.11 MiB down, round trip 1.28 s | build 365 ms, decode 11 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.5 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 3.9 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.5 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 4.2 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 876.7 MiB | 2.62 MiB up, 166.7 MiB down (8 requests) | 2 min 5 s wall-clock; 2 min 4 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 1.37 GiB | 2.62 MiB up, 166.7 MiB down (8 requests) | 2 min 3 s wall-clock; 2 min 2 s without network waits |
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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.92 KiB | — | 0.01 ms | 26 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 68.7 MiB | — | 0.07 ms | 140 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.05 ms | 4.0 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 51.9 MiB | — | 0.04 ms | 64 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 43.0 MiB | — | 0.03 ms | 61 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.62 MiB | 1.62 MiB | — | 272 ms | 286 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.00 MiB | 1.34 MiB | — | 140 ms | 147 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.5 ms | 3.9 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.92 KiB | — | 0.01 ms | 5.4 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 68.7 MiB | — | 0.10 ms | 225 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.06 ms | 6.2 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 51.9 MiB | — | 0.03 ms | 130 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 43.0 MiB | — | 0.04 ms | 89 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.62 MiB | 1.62 MiB | — | 249 ms | 257 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.00 MiB | 1.34 MiB | — | 124 ms | 131 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.5 ms | 4.2 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.83 KiB | 0.02 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 327.2 MiB | 0.42 ms |
| `POST /pss/v1/query/read` | 2 | 3.23 MiB | 3.24 MiB | 521 ms |
| `POST /pss/v1/query/nullifier` | 2 | 2.00 MiB | 2.69 MiB | 264 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 3.0 ms |

A wallet sends one call to each table for every 32 distinct columns it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 1 min 4 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 245 ms | 68.7 MiB | 2.90 GiB | — |
| tree | 4.60 s | 64 B | 2.95 GiB | — |
| readTable | 559 ms | 335.7 MiB | 3.37 GiB | — |
| readSetup | 8.01 s | 51.9 MiB | 3.54 GiB | — |
| pathTable | 4.14 s | 1.70 GiB | 4.51 GiB | — |
| pathSetup | 40.80 s | 35.6 MiB | 3.28 GiB | — |
| nullifierTable | 1.40 s | 172.1 MiB | 1.57 GiB | — |
| nullifierSetup | 3.96 s | 43.0 MiB | 1.68 GiB | — |
| manifest | 385 ms | 1.92 KiB | 1.12 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 0.90 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
