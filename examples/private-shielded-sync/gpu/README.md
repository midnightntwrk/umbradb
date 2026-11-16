# GPU kernels

The ownership test (the scan) and the PIR multiply on a GPU through WebGPU, with the same inputs, outputs and refusals
as the CPU kernels (spec story 7). WebGPU exists in Deno and in browsers, not in Node, so the server module and the
client's command line keep the CPU kernels; code running where WebGPU exists passes a device and gets the same
interfaces. IPIR+SP's server answer runs here too, byte for byte as the native add-on's ([IPIR+SP](#ipirsp)).

## Example

```ts
import { buildSetup } from "../pir/index.ts";
import { openGpu } from "./device.ts";
import { GpuMultiplier } from "./multiply.ts";
import { GpuScanner } from "./scan.ts";
import type { Scanner } from "./scanner.ts";

const gpu = await openGpu(); // null without WebGPU: keep ScanPool and WorkerMultiplier
if (!gpu) throw new Error("no WebGPU");
const poseidon = await (await fetch(new URL("../test/fixtures/poseidon-constants.json", import.meta.url))).json();

// The ownership test: as ScanPool.scan and ScanPool.scanValues.
const scanner: Scanner = await GpuScanner.create(gpu.device, poseidon);
const positions = await scanner.scan(entries, secret); // 36-byte entries, 32-byte secret scalar

// The PIR multiply: a Multiplier (FR-066), as WorkerMultiplier.
const multiplier = await GpuMultiplier.create(gpu.device);
multiplier.pin(grid); // the table stays on the GPU; it must not change until unpinned
const h = await buildSetup(grid, seed, multiplier); // setup data, 1,024 vectors, row-major
const answers = await multiplier.multiply(grid, queries, 32); // a query call's answers, vector-major
```

`ScanPool` satisfies `Scanner` as it is, and `GpuMultiplier` implements `pir/multiply.ts`'s `Multiplier`, so code
written against those interfaces takes either.

## The check

The spec's independent test for story 7: each GPU kernel returns results byte-equal to the CPU kernel on the same
input. From the repository's root, with Deno 2.7 or later and Node 24:

```sh
deno task --config examples/private-shielded-sync/gpu/deno.json check            # about 1.5 minutes
deno task --config examples/private-shielded-sync/gpu/deno.json check --quick    # small inputs, no results file
```

It type-checks this folder (`deno check`), then:

1. builds the inputs ([inputs.ts](inputs.ts)): the 16,384 test vectors; a 70,000-entry set the size of Preprod's
   outputs (the vectors, other points of the prime-order subgroup, outputs without a ciphertext, and entries for every
   path: forced 4-byte matches on subgroup points, on points outside the subgroup, on the identity and the small-order
   points, and encodings that do not decode); a read table of 69,255 random 705-byte records (6,897 × 6,296) and a
   nullifier table of 57,770 random nullifiers (1,656 × 2,048), each with 32 query vectors from `buildQueries` and the
   1,024 columns of its matrix A; the client's H·s and A·s (32-bit matrices); small odd shapes;
2. runs the GPU kernels with timings;
3. writes the inputs to a temporary folder and runs the CPU kernels on them under Node
   ([cpu-reference.ts](cpu-reference.ts): `ScanPool`, `WorkerMultiplier` and one thread, 8 threads by default);
4. compares every output byte for byte, and the vectors' values and hits with the ledger's (`pads.bin`, `mine.bin`);
5. negative controls: one tag bit changed in a hit loses exactly that hit; one point byte changed changes exactly that
   entry's value; one grid cell changed changes exactly that row's answers; one query value changed changes exactly
   that vector's answers;
6. decodes a PIR call whose setup data and answers the GPU computed, against the tables' records;
7. writes `results/check-<date>.json` and exits 1 if any check fails.

Options after the task name: `--threads N` (CPU threads), `--out FILE`, `--work DIR` and `--keep` (keep the inputs
and the CPU's outputs), `--quick`.

## Results

[results/check-2026-11-13.json](results/check-2026-11-13.json): Apple M4 Max, Deno 2.7.5, Node 24.9.0, 8 CPU threads;
the machine was shared with a Preprod sync (load average 5.5 at the start, 6.4 at the end). All 24 checks passed.

Scan, per entry (GPU wall time is the best of three calls; GPU execution from timestamp queries):

| Set | GPU wall | GPU execution | CPU, 8 threads (`ScanPool`) | CPU, one thread | GPU over 8 threads |
|---|---|---|---|---|---|
| 16,384 test vectors | 3.1 µs (51 ms) | 2.3 µs | 66.4 µs (1.09 s) | 525 µs | 21× |
| 70,000, Preprod's size | 2.8 µs (199 ms) | 2.2 µs | 68.3 µs (4.78 s) | 510 µs | 24× |

In a browser (Chromium, the same GPU), one scan with no match, median of the calls: 6,861 entries take 22 ms back to
back and 39 ms after a second of idle GPU; 16,384 entries take 38 ms and 62 ms. A scan covers up to a few thousand
entries in about 16 ms (one entry's chain of products on one GPU thread) and costs about 2 µs per entry beyond that.
The shader compiles in about 0.5 s the first time a browser sees it and in about 30 ms from the browser's cache after.

Multiply (GPU: the table pinned, best call; CPU: `WorkerMultiplier` after three warm-up calls, best / median of the
runs, and one thread, median):

| Call | GPU wall | GPU execution | GPU, 16 calls together, per call | CPU, 8 threads | CPU, one thread |
|---|---|---|---|---|---|
| Read table answer, 6,897 × 6,296 × 32 vectors | 13.8 ms | 1.4 ms | 3.7 ms | 44 / 195 ms | 326 ms |
| Read table setup, 6,897 × 6,296 × 1,024 | 102 ms | 81 ms | — | 1.44 / 1.46 s | not timed |
| Nullifier table answer, 1,656 × 2,048 × 32 | 12.4 ms | — | 2.2 ms | 3.5 / 3.8 ms | 25.6 ms |
| Nullifier table setup, 1,656 × 2,048 × 1,024 | 22.0 ms | 5.7 ms | — | 116 / 118 ms | 815 ms |
| Client H·s, 6,897 × 1,024 (32-bit) × 32 | 16.8 ms | 0.4 ms | — | 8.4 / 8.9 ms | 55.5 ms |
| Client A·s, 4,096 × 1,024 (32-bit) × 32 | 15.3 ms | — | — | 4.7 / 18.5 ms | 32.9 ms |

Without pinning, the read table's answer call takes about 29 ms (its 87 MB of cells copied each time). Under Deno every
call pays a floor of about 12 ms (below), which dominates the short calls; "—" is a time the run did not measure.

## How the GPU matches the CPU

The scan ([scan-wgsl.ts](scan-wgsl.ts), [scan.ts](scan.ts)) follows `kernel/src/lib.rs` entry by entry: an entry of 36
zero bytes has the value zero and never matches; a point is decoded as `JubjubAffine::from_bytes` decodes it (v below
p, u² a square, u = 0 with the sign bit refused), and a point that does not decode has the value zero; otherwise
k* = point × secret (complete twisted Edwards formulas), k = Poseidon(k*.u, k*.v), value =
Poseidon(k, 0). An entry whose 4 bytes equal the value's is a candidate; a second pass over the candidates only runs the
ledger's check (r·point = identity, point not the identity; FR-103). The field ([field.ts](field.ts)) is 20 limbs of 13
bits in Montgomery form; its additions and products are generated as straight-line WGSL.

The values are the CPU's; the way to them is shaped for the GPU, where one entry is a chain of field products on one
GPU thread (about 4,500 now, about 6,000 at first):

- **Products without carries between limbs.** A limb is a 32-bit sum of up to 40 products of 26 bits, and carries are
  propagated once, at the end of a product. A square forms each pair of limbs once.
- **One recoding of the scalar for all entries.** The host turns the scalar into signed digits (width-4 non-adjacent
  form); every entry doubles once per digit and adds a point of its own four-point table for about one digit in
  five, instead of once per 1 bit.
- **The square root of a quotient without the division** (decoding a point), and fixed exponents (inversion, the
  square root's) by a table of odd powers.
- **Poseidon's partial rounds in sparse form**: five products a round instead of nine. The constant table is derived
  from the ledger's constants, and building it checks the sparse form against the plain permutation.

The multiply ([multiply-wgsl.ts](multiply-wgsl.ts), [multiply.ts](multiply.ts)) computes in `u32`, which wraps
modulo 2^32 as the CPU's `Math.imul` and `| 0` do; a 16-bit cell is sign-extended first. Two cells share a 32-bit word
(the `Int16Array`'s own bytes; a row with an odd column count gets a zero cell). The call's vectors are rewritten
column-major on the GPU, so one invocation reads its 8 vectors' values for a column as two `vec4<u32>`. Matrices larger
than the device's binding limit (at most 1 GiB) are split into row chunks. A matrix is copied to the GPU on every call
unless pinned.

## IPIR+SP

IPIR+SP's server answer (spec 00058, story 6) on the GPU: `GpuIpirTable.respond(requests, count)` ([ipir.ts](ipir.ts))
returns the same bytes as the native add-on's `IpirServerTable.respond` (`../ipir/native.ts`) for the same table and
requests.

```ts
// Node, once per table: upstream's preparation repeated by the add-on, public values only.
import { ipirGpuReference } from "../ipir/native.ts";
const ref = await ipirGpuReference({ cellsPath, rows, cols, seed, snapshot }, new Uint8Array(0), 0);
// `ref.setupId` and `ref.blocks[k].matrix` (and the table's cells) go to where WebGPU is: Deno or a page.

// Deno or a browser:
import { GpuIpirTable } from "./ipir.ts";
const table = await GpuIpirTable.create(device, { rows, cols, cells, setupId, matrices });
const answers = await table.respond(requests, count); // = IpirServerTable.respond(requests, count)
const hints = await table.hints(queryMasks); // preparation's hint columns, as upstream computes them
table.release();
```

**What runs on the GPU.** A table is set up once: its 16-bit cells (column-major, as the add-on takes them) are copied
and laid out row-major, and each output block's compiled packing matrix (2,048 × 4,096 signed 32-bit entries, 32 MiB
per 2,048 columns) is copied and laid out column-major; both stay resident. A call then runs, on the GPU: unpacking of
the requests' 49-bit selection words and 54-bit key words; the first pass of every request of the call in one scan of
the table (`Σ_r cell · (x << 5) mod 2^54` per column; the CPU answers a call's requests one after another, each with
its own scan); the packing product of every block (`H · K_g mod 2^54`); the sums rounded to 22 bits and packed. The host
checks each request's magic and setup id and writes the 68-byte heads (SHA-256 of each request, WebCrypto).
`firstPass` and `packingProduct` return the two steps alone, unrounded. `hints` computes preparation's hint columns
with the first pass's kernel, against the 2,048 public query-mask columns.

**Not on the GPU.** The rest of preparation (aggregation by an integer ring FFT, floor division by 2,048, digit
decomposition, the two trace chains of 1,023 dependent steps each, matrix compilation): it runs once per table and
snapshot, takes about 0.34–0.43 s per 2,048 columns on the CPU, and needs integers up to 2^65 and a long sequential
chain. The wallet's math: its Gaussian draws must come from the platform's random source, its ring products (about 6
of 20 ms of a request at 32,768 rows, natively) would put the secret in GPU memory, and decoding takes under 0.2 ms.

**Limb layout.** WGSL has 32-bit integers only. A 54-bit word is four 16-bit limbs in a `vec4<u32>`; a cell times a
limb fits 32 bits. A sum keeps four 32-bit accumulators of weights 2^0, 2^16, 2^32 and 2^48: the two low ones receive
only 16-bit pieces of each product (exact over up to 16,384 rows), the two high ones may wrap (their weights make the
wrap vanish modulo 2^54). A signed matrix entry h is `hs · 2^16 + h0` (h0 unsigned 16-bit, hs signed), so both its
products with a limb are exact in 32 bits. The sums of segments of rows (and of key words) are added modulo 2^54 at the
end. One invocation of the first pass reads 8 adjacent columns of its rows (one `vec4<u32>` per row) for up to 2
requests; the packing, 4 adjacent matrix rows for up to 2 requests; buffers bound to one dispatch stay below 1 GiB.
These shapes were the fastest measured here (more than 16 `vec4` accumulators per invocation spill registers and run
3–15 times slower); all are options of `create`.

**The check.** From the repository's root, with the add-on built (`examples/private-shielded-sync/ipir/build.sh native`):

```sh
deno task --config examples/private-shielded-sync/gpu/deno.json ipir-check --work <folder>          # about 3 minutes here
deno task --config examples/private-shielded-sync/gpu/deno.json ipir-check --quick                  # 2,048 × 2,048 only
```

For tables of 2,048 × 2,048, 4,096 × 12,288 and 32,768 × 12,288 (random 16-bit cells, and every cell 0xFFFF), the CPU
side under Node ([ipir-cpu-reference.ts](ipir-cpu-reference.ts)) builds the table with the add-on, makes 32 requests
with the wallet's WebAssembly, answers calls of 1 and 32 with `IpirServerTable.respond`, decodes the answers against
the table, and exports the compiled matrices, hint columns and upstream's unrounded first pass and packing product
(`ipirGpuReference`). The GPU side compares byte for byte: the first pass and the packing product of the 32 requests,
the answers to the calls of 1 and 32, and (random tables) the hint columns; for one table also a table split into
small chunks and negative controls (one changed selection word, key word or cell changes exactly the values it should;
a request of another setup is refused). Options: `--runs N`, `--out FILE`, `--keep`, `--only ID`. The cell files of
the largest table take 805 MB in the work folder while it runs.

**Results.** [results/ipir-check-2026-11-16.json](results/ipir-check-2026-11-16.json): Apple M4 Max, Deno 2.7.5, Node
24.9.0. All 59 checks passed: every first pass, packing product, answer and hint column equal to the CPU's. Medians of
9 timed runs, random tables; "exec" is the GPU's own execution time (timestamp queries), "wall" runs from the call to
the result in host memory and includes Deno's floor of about 12 ms per read-back:

| Table | Requests | GPU first pass, exec | GPU packing, exec | GPU answer, wall (exec) | 16 calls at once, per call | CPU `respond` (first pass, packing) |
|---|---|---|---|---|---|---|
| 2,048 × 2,048 | 1 | 0.35 ms | 0.37 ms | 14.6 ms (0.97 ms) | 4.0 ms | 1.05 ms (0.38, 0.33) |
| 2,048 × 2,048 | 32 | 1.56 ms | 5.06 ms | 20.8 ms (4.3 ms) | 8.4 ms | 36.3 ms (12.1, 11.8) |
| 4,096 × 12,288 | 1 | 0.24 ms | 1.10 ms | 15.0 ms (0.80 ms) | 5.2 ms | 3.75 ms (1.82, 1.52) |
| 4,096 × 12,288 | 32 | 3.78 ms | 6.47 ms | 29.0 ms (10.4 ms) | 20.2 ms | 150 ms (77.5, 74.6) |
| 32,768 × 12,288 | 1 | 4.36 ms | 1.05 ms | 17.2 ms (2.58 ms) | 10.0 ms | 26.7 ms (17.0, 3.5) |
| 32,768 × 12,288 | 32 | 39.7 ms | 8.59 ms | 58.4 ms (37.3 ms) | 83.4 ms | 796 ms (560, 103) |

| Table | Upload (cells and matrices) | GPU memory: resident + one call of 1 / of 32 | Hint columns: GPU / CPU (add-on build) |
|---|---|---|---|
| 2,048 × 2,048 | 21 ms | 40 MiB + 0.5 / 12.6 MiB | 183 ms / 32 ms |
| 4,096 × 12,288 | 70–113 ms | 288 MiB + 3.2 / 25.7 MiB | 572 ms / 364 ms |
| 32,768 × 12,288 | 158–163 ms | 960 MiB + 8.3 / 81.0 MiB | 2.92 s / 3.08 s |

- The CPU is the add-on on this machine (upstream's code; on arm64 it takes its scalar paths, no NEON), with rayon over
  16 cores, answering a call's requests one after another; first pass and packing are upstream's own timers. The
  machine was shared with another lane's benchmarks (load average 17–33 during the run), which slows the CPU's figures
  most: earlier, less loaded runs measured 9–11 ms (phase 1) and 43 ms per answer at 32,768 × 12,288, and 515 ms for 32.
- The GPU computes each hint column directly (rows × 2,048 products), the CPU by NTT products: the GPU is slower at
  2,048 rows and about even at 32,768.
- The all-0xFFFF tables gave the same GPU times within noise (in the results file).

**In a browser.** [results/ipir-browser-2026-11-16.json](results/ipir-browser-2026-11-16.json): the same `GpuIpirTable`
in the desktop app's Chromium 156 ([ipir-browser.ts](ipir-browser.ts) bundles and serves
[ipir-browser-page.ts](ipir-browser-page.ts); `node examples/private-shielded-sync/gpu/ipir-browser.ts --out FILE`,
then open the printed address), on synthetic tables (random cells and matrices, requests of random words), with
sampled first-pass and packing values checked against `BigInt` sums (all equal). Medians of 9:

| Table | Answer of 1, wall | Answer of 32, wall (exec) | First pass of 32, exec |
|---|---|---|---|
| 2,048 × 2,048 | 5.8 ms | 11.4 ms (6.8 ms) | 1.57 ms |
| 4,096 × 12,288 | 2.3 ms | 15.9 ms (10.4 ms) | 4.39 ms |
| 32,768 × 12,288 | 5.9 ms | 66.9 ms (48.2 ms) | 33.2 ms |

The scan check of spec 00053 found Chromium's WebGPU running the scan shader about seven times faster than Deno's. For
these kernels the GPU's execution times in the two are close (first pass of 32 requests at 32,768 × 12,288: 33 ms in
Chromium, 37–40 ms in Deno); what differs is the floor per read-back, about 12 ms in Deno and 1–2 ms in Chromium, so a
single answer takes 2–6 ms in the page and 15–17 ms in Deno. Chromium's timestamps are quantized to 65.5 µs.

## Files

| File | What it holds |
|---|---|
| [device.ts](device.ts) | `openGpu`, shader compilation, `writeView`, timestamp spans |
| [field.ts](field.ts) | The field in WGSL and its constant table (Poseidon's constants and the curve's) |
| [scan-wgsl.ts](scan-wgsl.ts), [scan.ts](scan.ts), [scanner.ts](scanner.ts) | The ownership test: shader, `GpuScanner`, the `Scanner` interface |
| [multiply-wgsl.ts](multiply-wgsl.ts), [multiply.ts](multiply.ts) | The PIR multiply: shaders, `GpuMultiplier` |
| [check.ts](check.ts), [inputs.ts](inputs.ts), [jobs.ts](jobs.ts), [cpu-reference.ts](cpu-reference.ts) | The check (Deno), its inputs, the files it exchanges with the CPU side, the CPU side (Node) |
| [ipir-wgsl.ts](ipir-wgsl.ts), [ipir.ts](ipir.ts), [ipir-wire.ts](ipir-wire.ts) | IPIR+SP: shaders, `GpuIpirTable`, request and answer bytes and the `BigInt` reference |
| [ipir-check.ts](ipir-check.ts), [ipir-jobs.ts](ipir-jobs.ts), [ipir-cpu-reference.ts](ipir-cpu-reference.ts) | IPIR+SP's check (Deno), the files it exchanges with the CPU side, the CPU side (Node, the add-on and the wallet's WebAssembly) |
| [ipir-browser.ts](ipir-browser.ts), [ipir-browser-page.ts](ipir-browser-page.ts) | IPIR+SP's kernels in a browser: the serving script (Node, esbuild) and the page |
| [deno.json](deno.json), [node-globals.d.ts](node-globals.d.ts) | Deno's configuration: the `check`, `ipir-check` and `typecheck` tasks |
| `results/` | Results of the checks |

The GPU modules (`device`, `field`, `scan*`, `multiply*`, `ipir`, `ipir-wgsl`, `ipir-wire`) import no Node module at
run time, so they also run in a browser once bundled; IPIR+SP's were run in Chromium ([IPIR+SP](#ipirsp)), the others
were not.

## Type checking

This folder is left out of `npm run typecheck` (the example's `tsconfig.json` excludes `gpu/**`): Node's TypeScript
setup has no WebGPU types. `deno task --config examples/private-shielded-sync/gpu/deno.json typecheck` checks it with
Deno's (`strict`, `noUncheckedIndexedAccess`); `check` and `ipir-check` run it first. `node-globals.d.ts` declares
Node's `Buffer`, which `pir/matrix.ts` uses. `ipir-wire.ts` has no WebGPU types and is also checked by the example's
`tsc` (the test `test/ipir-gpu-reference.test.ts` imports it); `ipir-browser.ts` runs under Node and is checked by
neither.

## Deno's WebGPU on Apple silicon

Measured with Deno 2.7.5 on an Apple M4 Max:

- Every await on the GPU (`mapAsync`, `onSubmittedWorkDone`) returns after about 12–13 ms even with no work, so a call
  that reads back once costs at least that. Calls in flight together share it; the check reports 16 concurrent answer
  calls.
- Timestamp queries leave the end of a short pass (about a millisecond or less) unwritten; such calls report no GPU
  execution time.
- `queue.writeBuffer` refuses a bare `ArrayBuffer` with offsets; views (also of a `SharedArrayBuffer`) work.
- The field arithmetic written with loops ran about six times slower than as straight-line code.
- `node:worker_threads` under Deno runs the CPU multiply's workers about 20 times slower than Node does, which is why the
  CPU side of the check runs under Node.
