# Private shielded sync: benchmark on preprod

Snapshot `c90fc1c7a943054d…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 100,000 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme simplepir, padded to 100,000 entries (debug) (built for this run). Run from 2026-11-16T05:06:30.685Z to 2026-11-16T05:07:05.006Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Load average (1, 5, 15 min) | start 16.19 / 13.88 / 12.37; end 18.73 / 14.63 / 12.69 |
| SimplePIR | q = 2^32, n = 1024, σ = 6.4, 9 bits per cell (p = 512) |
| Artifacts | blockRoots 64 B, nullifierPublic 10.4 MiB, nullifierTable 10.4 MiB, pathPublic 1.78 MiB, pathTable 87.0 MiB, readPublic 11.7 MiB, readTable 16.8 MiB, scan 3.43 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 10.4 MiB, nullifierTable 10.4 MiB, pathPublic 1.78 MiB, pathTable 87.0 MiB, readPublic 11.7 MiB, readTable 16.8 MiB, scan 3.43 MiB |

## The PIR tables

One request selects one column of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | setup data | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 100,000 × 98 B | 2,992 × 2,942 | 2,942 × 34 | 16.8 MiB | 11.7 MiB | 11,768 B / 11,968 B | 16.8 MiB |
| path | 100,000 × 512 B | 456 × 100,000 | 100,000 × 1 | 87.0 MiB | 1.78 MiB | 400,000 B / 1,824 B | 87.0 MiB |
| nullifier | 100,000 × 40 B | 2,664 × 2,048 | 2,048 × 74 | 10.4 MiB | 10.4 MiB | 8,192 B / 10,656 B | 10.4 MiB |

The benchmark asked the server for this snapshot (simplepir, padded to 100,000); it was served 10.11 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 945.7 MiB before the request, a peak of 2.00 GiB until the snapshot was served, 1.85 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 2.00 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's own load at start. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | **not measured:** no database given (--db-url) | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 758.3 MiB | — | 818 ms, 155,503 rows/s (127,141 rows) |
| Build scan file | server | 3.43 MiB | 1.06 GiB | — | 36 ms |
| Build tree and paths | server | 64 B block roots | 1.10 GiB | — | 5.96 s, 11,640 hashes/s (69,353 hashes) |
| Build read table and setup data | server | table 16.8 MiB, setup data 11.7 MiB | table 1.10 GiB; setup 1.14 GiB | — | table 151 ms, setup 469 ms |
| Build path table and setup data | server | table 87.0 MiB, setup data 1.78 MiB | table 1.16 GiB; setup 1.98 GiB | — | table 414 ms, setup 2.47 s |
| Build nullifier table and setup data | server | table 10.4 MiB, setup data 10.4 MiB | table 1.99 GiB; setup 2.00 GiB | — | table 60 ms, setup 282 ms |
| Download scan file, block roots, setup data | client A | 25.5 MiB cache | — | scan file 3.43 MiB in 25 ms; block roots 64 B in 7.6 ms; read setup data 11.7 MiB in 73 ms; nullifier setup data 10.4 MiB in 34 ms | — |
| Download scan file, block roots, setup data | client B | 25.5 MiB cache | — | scan file 3.43 MiB in 15 ms; block roots 64 B in 5.0 ms; read setup data 11.7 MiB in 80 ms; nullifier setup data 10.4 MiB in 26 ms | — |
| Scan | client A | — | 750.7 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 1.10 GiB | — | 7.59 s for 100,000 outputs on 8 threads (75.9 µs/output) |
| Read coins (one call) | server (A's call) | — | 1.35 GiB | — | answer 17 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 750.7 MiB | 367.8 KiB up, 374.0 KiB down, round trip 22 ms | build 38 ms, decode 7.6 ms |
| Read coins (one call) | server (B's call) | — | 1.37 GiB | — | answer 12 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 1.11 GiB | 367.8 KiB up, 374.0 KiB down, round trip 18 ms | build 40 ms, decode 10 ms |
| Nullifier lookups (one call) | server (A's call) | — | 1.35 GiB | — | answer 8.5 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 709.6 MiB | 256.0 KiB up, 333.0 KiB down, round trip 12 ms | build 13 ms, decode 5.7 ms |
| Nullifier lookups (one call) | server (B's call) | — | 1.37 GiB | — | answer 7.4 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 1.11 GiB | 256.0 KiB up, 333.0 KiB down, round trip 25 ms | build 11 ms, decode 14 ms |
| Lower paths to spend (one call) | server (A's call) | — | 1.37 GiB | — | answer 66 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 1.09 GiB | 12.2 MiB up, 57.0 KiB down, round trip 80 ms | build 389 ms, decode 0.93 ms |
| Lower paths to spend (one call) | server (B's call) | — | 1.39 GiB | — | answer 66 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 1.21 GiB | 12.2 MiB up, 57.0 KiB down, round trip 84 ms | build 434 ms, decode 0.96 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.3 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 3.8 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.4 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 5.0 ms | 1.3 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 750.7 MiB | 623.8 KiB up, 26.3 MiB down (8 requests) | 11.00 s wall-clock; 10.82 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 1.11 GiB | 623.8 KiB up, 26.3 MiB down (8 requests) | 7.86 s wall-clock; 7.68 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**6 cells without a value:** Chain sync (core modules) / server / storage (no database given (--db-url)); Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 100,000 × 256 B + 100,000 × 32 B = **27.5 MiB** (28,800,000 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 26.3 MiB | 0.959× | 25.5 MiB | 827.7 KiB | 0.029× | 623.8 KiB |
| B | 26.3 MiB | 0.959× | 25.5 MiB | 827.7 KiB | 0.029× | 623.8 KiB |

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
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.90 KiB | — | 0.01 ms | 6.0 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 3.43 MiB | — | 0.09 ms | 25 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.08 ms | 7.4 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 11.7 MiB | — | 0.06 ms | 73 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 10.4 MiB | — | 0.04 ms | 34 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 367.8 KiB | 374.0 KiB | — | 17 ms | 22 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 256.0 KiB | 333.0 KiB | — | 8.5 ms | 12 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.3 ms | 3.8 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.90 KiB | — | 0.04 ms | 7.0 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 3.43 MiB | — | 0.06 ms | 15 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.05 ms | 5.0 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 11.7 MiB | — | 0.05 ms | 80 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 10.4 MiB | — | 0.04 ms | 26 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 367.8 KiB | 374.0 KiB | — | 12 ms | 18 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 256.0 KiB | 333.0 KiB | — | 7.4 ms | 25 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.4 ms | 4.9 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.79 KiB | 0.04 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 51.1 MiB | 0.48 ms |
| `POST /pss/v1/query/read` | 2 | 735.6 KiB | 748.1 KiB | 29 ms |
| `POST /pss/v1/query/nullifier` | 2 | 512.1 KiB | 666.1 KiB | 16 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 2.7 ms |

A wallet sends one call to each table for every 32 distinct columns it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Not measured.

## Transfer

Not run: no transfer record was given (`--transfer <record written by send>`).

## Server build steps

From the server's build-stats.json (admin build at 3439524, 6 threads); total 9.93 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 36 ms | 3.43 MiB | 1.06 GiB | — |
| tree | 5.96 s | 64 B | 1.10 GiB | — |
| readTable | 151 ms | 16.8 MiB | 1.10 GiB | — |
| readSetup | 469 ms | 11.7 MiB | 1.14 GiB | — |
| pathTable | 414 ms | 87.0 MiB | 1.16 GiB | — |
| pathSetup | 2.47 s | 1.78 MiB | 1.98 GiB | — |
| nullifierTable | 60 ms | 10.4 MiB | 1.99 GiB | — |
| nullifierSetup | 282 ms | 10.4 MiB | 2.00 GiB | — |
| manifest | 7.9 ms | 1.90 KiB | 2.00 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 1.5 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
- No database was given: the chain sync's size, the event read and the pathSplit builds (FR-153) were not measured.
