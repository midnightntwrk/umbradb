# Private shielded sync: benchmark on preprod

Snapshot `0d3644b065be6459…` at height 3,439,524 (block `44cfe1a013b99757…`): 69,329 shielded outputs, 57,812 nullifiers, `pathSplit` k = 16, 32 requests per query call, PIR scheme ipir-sp (built for this run). Run from 2026-11-16T05:01:38.441Z to 2026-11-16T05:02:12.038Z; wallets A, B. Written by `examples/private-shielded-sync/bench/bench.ts`; every number is in `results.json` beside this file.

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
| Load average (1, 5, 15 min) | start 11.82 / 8.85 / 10.52; end 12.06 / 9.28 / 10.61 |
| PIR scheme ipir-sp | digitBits 19, digits 2, maskBits 29, pBits 16, qBits 54, queryBits 49, responseBits 22, ring 2048 |
| Artifacts | blockRoots 64 B, nullifierPublic 14.5 KiB, nullifierTable 8.00 MiB, pathPublic 72.5 KiB, pathTable 40.0 MiB, readPublic 14.5 KiB, readTable 8.00 MiB, scan 2.38 MiB |
| Artifacts on disk | blockRoots 64 B, nullifierPublic 14.5 KiB, nullifierTable 8.00 MiB, pathPublic 72.5 KiB, pathTable 40.0 MiB, readPublic 14.5 KiB, readTable 8.00 MiB, scan 2.38 MiB |

## The PIR tables

One request selects one row of the table (a group) and its answer carries the group's records. A table is R × C cells. Request and response are the bytes of one query in a call body and in its answer (after the 40-byte header), measured on the first call to the table; "held" is what the served table says it holds in the server's memory (from the module's status).

| Table | Records × bytes | Cells R × C | Groups × records per group | Table file | masks | Request / response per query | Held |
|---|---|---|---|---|---|---|---|
| read | 69,329 × 98 B | 2,048 × 2,048 | 2,048 × 41 | 8.00 MiB | 14.5 KiB | 40,228 B / 5,700 B | 40.0 MiB |
| path | 69,329 × 512 B | 2,048 × 10,240 | 2,048 × 40 | 40.0 MiB | 72.5 KiB | 40,228 B / 28,228 B | 200.2 MiB |
| nullifier | 57,812 × 40 B | 2,048 × 2,048 | 2,048 × 102 | 8.00 MiB | 14.5 KiB | 40,228 B / 5,700 B | 40.0 MiB |

The benchmark asked the server for this snapshot (ipir-sp); it was served 8.13 s after the request. The server process's resident memory (process 53587, `ps -o rss=` every 200 ms): 947.1 MiB before the request, a peak of 1.15 GiB until the snapshot was served, 1.15 GiB once served (the median of its peaks over 250 ms windows from 1 to 3 s after); the build statistics' own peak, sampled every 10 ms in the process, 1.19 GiB.

## The measurements of spec §8

Each part on its own row for the server and for each wallet's client (FR-151). Time is wall-clock; "without network waits" subtracts the time spent in requests. Memory is the peak resident size of the process (the server's, as sampled; the client's is the benchmark's own process, which runs each wallet as a fresh client one after the other). Each wallet syncs from an empty cache, so it downloads every artifact. The server's build rows come from the server's build-stats.json (admin build at 3439524, 6 threads); the event read is the module's query run by the benchmark against the database at the snapshot height. "—": not part of the metric.

| Part | Side | Storage | Memory (peak) | In flight | Computing |
|---|---|---|---|---|---|
| Chain sync (core modules) | server | 18.4 GiB database | — | — | **not measured:** no sync records given (--sync-records) |
| Read events for a snapshot | server | — | 662.7 MiB | — | 385 ms, 330,430 rows/s (127,141 rows) |
| Build scan file | server | 2.38 MiB | 952.8 MiB | — | 6.7 ms |
| Build tree and paths | server | 64 B block roots | 979.0 MiB | — | 4.64 s, 14,952 hashes/s (69,353 hashes) |
| Build read table and masks | server | table 8.00 MiB, masks 14.5 KiB | table 989.7 MiB; setup 1.19 GiB | — | table 76 ms, setup 431 ms |
| Build path table and masks | server | table 40.0 MiB, masks 72.5 KiB | table 1.08 GiB; setup 1.14 GiB | — | table 108 ms, setup 2.05 s |
| Build nullifier table and masks | server | table 8.00 MiB, masks 14.5 KiB | table 1.10 GiB; setup 1.18 GiB | — | table 17 ms, setup 397 ms |
| Download scan file, block roots, masks | client A | 2.41 MiB cache | — | scan file 2.38 MiB in 19 ms; block roots 64 B in 4.7 ms; read masks 14.5 KiB in 34 ms; nullifier masks 14.5 KiB in 15 ms | — |
| Download scan file, block roots, masks | client B | 2.41 MiB cache | — | scan file 2.38 MiB in 18 ms; block roots 64 B in 8.7 ms; read masks 14.5 KiB in 25 ms; nullifier masks 14.5 KiB in 14 ms | — |
| Scan | client A | — | 890.6 MiB | — | **not measured:** no scan by thread count (--scan-threads) |
| Scan | client B | — | 688.3 MiB | — | 4.98 s for 69,329 outputs on 8 threads (71.8 µs/output) |
| Read coins (one call) | server (A's call) | — | 1.12 GiB | — | answer 29 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client A | — | 890.6 MiB | 1.23 MiB up, 178.2 KiB down, round trip 35 ms | build 253 ms, decode 1.5 ms |
| Read coins (one call) | server (B's call) | — | 1.12 GiB | — | answer 27 ms (the route's time: decode the body, answer, encode) |
| Read coins (one call) | client B | — | 694.4 MiB | 1.23 MiB up, 178.2 KiB down, round trip 56 ms | build 249 ms, decode 0.69 ms |
| Nullifier lookups (one call) | server (A's call) | — | 1.12 GiB | — | answer 26 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client A | — | 652.0 MiB | 1.23 MiB up, 178.2 KiB down, round trip 35 ms | build 247 ms, decode 0.92 ms |
| Nullifier lookups (one call) | server (B's call) | — | 1.14 GiB | — | answer 22 ms (the route's time: decode the body, answer, encode) |
| Nullifier lookups (one call) | client B | — | 694.4 MiB | 1.23 MiB up, 178.2 KiB down, round trip 26 ms | build 246 ms, decode 0.38 ms |
| Lower paths to spend (one call) | server (A's call) | — | 1.12 GiB | — | answer 64 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client A | — | 658.7 MiB | 1.23 MiB up, 882.2 KiB down, round trip 68 ms | build 296 ms, decode 1.3 ms |
| Lower paths to spend (one call) | server (B's call) | — | 1.14 GiB | — | answer 56 ms (the route's time: decode the body, answer, encode) |
| Lower paths to spend (one call) | client B | — | 700.6 MiB | 1.23 MiB up, 882.2 KiB down, round trip 74 ms | build 295 ms, decode 0.56 ms |
| Tail | server (served to A) | 118.7 KiB tail (built and served in 1.4 ms) | — | — | — |
| Tail | client A | — | — | 118.7 KiB in 9.9 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Tail | server (served to B) | 118.7 KiB tail (built and served in 1.5 ms) | — | — | — |
| Tail | client B | — | — | 118.7 KiB in 3.5 ms | 1.2 ms (0 outputs scanned, 0 nullifiers) |
| Whole `sync` | client A | 5.52 KiB local state | 890.6 MiB | 2.46 MiB up, 2.87 MiB down (8 requests) | 5.58 s wall-clock; 5.42 s without network waits |
| Whole `sync` | client B | 1,014 B local state | 694.4 MiB | 2.46 MiB up, 2.87 MiB down (8 requests) | 5.67 s wall-clock; 5.49 s without network waits |
| Transfer | client | — | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) | **not measured:** not run (no transfer record given: --transfer) |

**5 cells without a value:** Chain sync (core modules) / server / computing (no sync records given (--sync-records)); Scan / client A / computing (no scan by thread count (--scan-threads)); Transfer / client / memory (not run (no transfer record given: --transfer)); Transfer / client / inFlight (not run (no transfer record given: --transfer)); Transfer / client / computing (not run (no transfer record given: --transfer)).

## Naive baseline (FR-152)

Without the scan file and PIR, a wallet would download every output in full (commitment and ciphertext, 256 bytes) and every nullifier (32 bytes) of the snapshot: 69,329 × 256 B + 57,812 × 32 B = **18.7 MiB** (19,598,208 bytes). What each wallet's sync moved instead:

| Wallet | Down, first sync | ÷ naive | Of which artifacts | Down, later syncs (artifacts cached) | ÷ naive | Up |
|---|---|---|---|---|---|---|
| A | 2.87 MiB | 0.154× | 2.41 MiB | 476.9 KiB | 0.025× | 2.46 MiB |
| B | 2.87 MiB | 0.154× | 2.41 MiB | 476.9 KiB | 0.025× | 2.46 MiB |

A first sync downloads the snapshot's artifacts once (the scan file, block roots and the read and nullifier tables' masks, the same for every wallet); a later sync against the same snapshot moves only the manifest, the query calls and the tail. Both include the tail (outputs after the snapshot, in full, for every wallet); the baseline counts only the snapshot.

## The read and path tables at each `pathSplit` (FR-153, Q58)

The served snapshot has k = 16. For each k below, the benchmark read the snapshot's stored events with the module's own query and ran the module's own builder in-process (6 threads); the build checks the core's root at the height. A read record is 98 bytes at every k (the commitment's first 16 bytes, ciphertext elements 1–5 shrunk); the k lower path hashes are in the path table, 32k bytes a record, which a wallet reads only to spend (none at k = 0). Each call is one call of 32 requests with client and server in the benchmark's process (no network), after one warm-up call; every record of its groups was checked against the table file's own. A table is R × C cells; one request selects one row (a group) of the records in brackets.

| k | Read record | Read table R × C (records per row) | Path record | Path table R × C (records per row) | Block roots | Read table / masks | Path table / masks | Tree | Tables and setups | Peak | Same as served |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 16 | 98 B | 2,048 × 2,048 (41) | 512 B | 2,048 × 10,240 (40) | 64 B (2) | 8.00 MiB / 14.5 KiB | 40.0 MiB / 72.5 KiB | 4.66 s, 14,888 hashes/s | readTable 74 ms, readSetup 392 ms, pathTable 103 ms, pathSetup 1.82 s | 1.34 GiB | yes (same identifier) |

| k | Call | Up | Down | Client build | Server answer | Client decode | Peak | Records checked |
|---|---|---|---|---|---|---|---|---|
| 16 | read (each sync) | 1.23 MiB | 178.2 KiB | 250 ms | 24 ms | 1.5 ms | 1.30 GiB | 1,189 |
| 16 | path (each spend) | 1.23 MiB | 882.2 KiB | 297 ms | 58 ms | 4.4 ms | 1.42 GiB | 1,120 |

## The scan by thread count

Not measured.

## What the server observes (FR-154)

Each request of each wallet's sync as the client sent it, with the line the module logged for it (route, status, body and answer lengths, `Range`, milliseconds; never a body). This is everything a sync shows the server, beside the client's network address and the requests' timing.

The sequences of method, path and body length are **identical** for A, B (FR-142), whatever coins each holds.

### A: 8 requests, 10 coins found (7 unspent), 10 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.90 KiB | — | 0.02 ms | 6.7 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 2.38 MiB | — | 0.14 ms | 19 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.08 ms | 4.7 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.12 ms | 33 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.05 ms | 15 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.23 MiB | 178.2 KiB | — | 29 ms | 35 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 178.2 KiB | — | 26 ms | 35 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.4 ms | 9.9 ms |

### B: 8 requests, 1 coins found (1 unspent), 1 scan matches, 0 rejected

| # | Request | Status | Body | Answer | Range | Server | Client |
|---|---|---|---|---|---|---|---|
| 1 | `GET /pss/v1/manifest` | 200 | 0 B | 1.90 KiB | — | 0.07 ms | 24 ms |
| 2 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 2.38 MiB | — | 0.05 ms | 18 ms |
| 3 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 64 B | — | 0.04 ms | 8.6 ms |
| 4 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.08 ms | 25 ms |
| 5 | `GET /pss/v1/blob/<digest>` | 200 | 0 B | 14.5 KiB | — | 0.04 ms | 14 ms |
| 6 | `POST /pss/v1/query/read` | 200 | 1.23 MiB | 178.2 KiB | — | 27 ms | 56 ms |
| 7 | `POST /pss/v1/query/nullifier` | 200 | 1.23 MiB | 178.2 KiB | — | 22 ms | 26 ms |
| 8 | `GET /pss/v1/tail` | 200 | 0 B | 118.7 KiB | — | 1.5 ms | 3.5 ms |

All wallets together:

| Route | Calls | Bodies | Answers | Server time |
|---|---|---|---|---|
| `GET /pss/v1/manifest` | 2 | 0 B | 3.80 KiB | 0.09 ms |
| `GET /pss/v1/blob/<digest>` | 8 | 0 B | 4.82 MiB | 0.62 ms |
| `POST /pss/v1/query/read` | 2 | 2.46 MiB | 356.3 KiB | 56 ms |
| `POST /pss/v1/query/nullifier` | 2 | 2.46 MiB | 356.3 KiB | 48 ms |
| `GET /pss/v1/tail` | 2 | 0 B | 237.4 KiB | 2.9 ms |

A wallet sends one call to each table for every 32 distinct rows it reads (at least one): the number of calls is the only part of a sync that depends on how many coins it holds, and the server sees it.

## Chain sync

Database: 18.4 GiB at cursor 3,440,526; the process runs core-chain, core-block-fetch, core-block-commit, core-digest, core-health, core-status, core-config, core-chain-events, core-block-parsed, core-tx-results, core-ledger-state, core-contract-logs-full, core-contract-states, private-shielded-sync.

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

From the server's build-stats.json (admin build at 3439524, 6 threads); total 7.79 s.

| Step | Duration | Size | Peak | The scheme's own figures |
|---|---|---|---|---|
| scan | 6.7 ms | 2.38 MiB | 952.8 MiB | — |
| tree | 4.64 s | 64 B | 979.0 MiB | — |
| readTable | 76 ms | 8.00 MiB | 989.7 MiB | — |
| readSetup | 431 ms | 14.5 KiB | 1.19 GiB | hints 31 ms, packing 368 ms, check 26 ms, packing held 32.0 MiB, largest phase error 2^34.09 of 2^37 over 3 rows |
| pathTable | 108 ms | 40.0 MiB | 1.08 GiB | — |
| pathSetup | 2.05 s | 72.5 KiB | 1.14 GiB | hints 170 ms, packing 1.80 s, check 58 ms, packing held 160.2 MiB, largest phase error 2^34.33 of 2^37 over 3 rows |
| nullifierTable | 17 ms | 8.00 MiB | 1.10 GiB | — |
| nullifierSetup | 397 ms | 14.5 KiB | 1.18 GiB | hints 26 ms, packing 341 ms, check 25 ms, packing held 32.0 MiB, largest phase error 2^34.26 of 2^37 over 3 rows |
| manifest | 3.6 ms | 1.90 KiB | 1.17 GiB | — |

The module's load of the stored events at start: 127,141 rows up to height 3,440,511 in 818 ms (peak 758.3 MiB).

The build's read of its in-memory index at the snapshot height: 127,141 rows in 0.96 ms.

## Notes

- Each wallet is a fresh client in the benchmark's process: its own empty cache, scan threads and PIR threads (whose first call pays their compilation), as a new `client/main.ts sync` would be.
- "Per call" values are a sync's totals divided by its calls.
- The server's time for a query route is what it logged for the request: the body decoded, the scheme's answer to every request of the call, the answer encoded.
- "Lower paths to spend" is the read `send` makes before a transfer (`lowerPathsByPir`), run after each wallet's sync: the path table's public artifact once, then one call for the wallet's unspent coins whose block was full at the snapshot (random groups only when it has none); every path read is checked against its block's root.
- Results hold wallet labels and counts only: no keys, positions, values or nullifiers.
