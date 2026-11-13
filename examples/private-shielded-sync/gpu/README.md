# GPU kernels

The ownership test (the scan) and the PIR multiply on a GPU through WebGPU, with the same inputs, outputs and refusals
as the CPU kernels (spec story 7). WebGPU exists in Deno and in browsers, not in Node, so the server module and the
client's command line keep the CPU kernels; code running where WebGPU exists passes a device and gets the same
interfaces.

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
the machine was shared with a Preprod sync (load average 7.6 at the start, 15.6 at the end). All 24 checks passed.

Scan, per entry (GPU wall time is the best of three calls; GPU execution from timestamp queries):

| Set | GPU wall | GPU execution | CPU, 8 threads (`ScanPool`) | CPU, one thread | GPU over 8 threads |
|---|---|---|---|---|---|
| 16,384 test vectors | 5.3 µs (87 ms) | 4.6 µs | 70.5 µs (1.16 s) | 529 µs | 13× |
| 70,000, Preprod's size | 5.4 µs (380 ms) | 5.6 µs | 69.2 µs (4.85 s) | 544 µs | 13× |

Multiply (GPU: the table pinned, best call; CPU: `WorkerMultiplier` after three warm-up calls, best / median of the
runs, and one thread, median):

| Call | GPU wall | GPU execution | GPU, 16 calls together, per call | CPU, 8 threads | CPU, one thread |
|---|---|---|---|---|---|
| Read table answer, 6,897 × 6,296 × 32 vectors | 14.9 ms | 1.7 ms | 3.6 ms | 45 / 51 ms | 362 ms |
| Read table setup, 6,897 × 6,296 × 1,024 | 100 ms | 82 ms | — | 2.15 / 2.24 s | not timed |
| Nullifier table answer, 1,656 × 2,048 × 32 | 13.7 ms | 0.4 ms | 2.4 ms | 3.4 / 3.7 ms | 25.5 ms |
| Nullifier table setup, 1,656 × 2,048 × 1,024 | 20.9 ms | 5.7 ms | — | 116 / 117 ms | 811 ms |
| Client H·s, 6,897 × 1,024 (32-bit) × 32 | 16.0 ms | — | — | 7.3 / 8.2 ms | 62.8 ms |
| Client A·s, 4,096 × 1,024 (32-bit) × 32 | 15.1 ms | 0.6 ms | — | 7.1 / 20.7 ms | 32.4 ms |

Without pinning, the read table's answer call takes about 27 ms (its 87 MB of cells copied each time). Under Deno every
call pays a floor of about 12 ms (below), which dominates the short calls; "—" is a time the run did not measure.

## How the GPU matches the CPU

The scan ([scan-wgsl.ts](scan-wgsl.ts), [scan.ts](scan.ts)) follows `kernel/src/lib.rs` entry by entry: an entry of 36
zero bytes has the value zero and never matches; a point is decoded as `JubjubAffine::from_bytes` decodes it (v below
p, u² a square, u = 0 with the sign bit refused), and a point that does not decode has the value zero; otherwise
k* = point × secret (complete twisted Edwards formulas, extended coordinates), k = Poseidon(k*.u, k*.v), value =
Poseidon(k, 0). An entry whose 4 bytes equal the value's is a candidate; a second pass over the candidates only runs the
ledger's check (r·point = identity, point not the identity; FR-103). The field ([field.ts](field.ts)) is 20 limbs of 13
bits in Montgomery form; its additions and products are generated as straight-line WGSL.

The multiply ([multiply-wgsl.ts](multiply-wgsl.ts), [multiply.ts](multiply.ts)) computes in `u32`, which wraps
modulo 2^32 as the CPU's `Math.imul` and `| 0` do; a 16-bit cell is sign-extended first. Two cells share a 32-bit word
(the `Int16Array`'s own bytes; a row with an odd column count gets a zero cell). The call's vectors are rewritten
column-major on the GPU, so one invocation reads its 8 vectors' values for a column as two `vec4<u32>`. Matrices larger
than the device's binding limit (at most 1 GiB) are split into row chunks. A matrix is copied to the GPU on every call
unless pinned.

## Files

| File | What it holds |
|---|---|
| [device.ts](device.ts) | `openGpu`, shader compilation, `writeView`, timestamp spans |
| [field.ts](field.ts) | The field in WGSL and its constant table (Poseidon's constants and the curve's) |
| [scan-wgsl.ts](scan-wgsl.ts), [scan.ts](scan.ts), [scanner.ts](scanner.ts) | The ownership test: shader, `GpuScanner`, the `Scanner` interface |
| [multiply-wgsl.ts](multiply-wgsl.ts), [multiply.ts](multiply.ts) | The PIR multiply: shaders, `GpuMultiplier` |
| [check.ts](check.ts), [inputs.ts](inputs.ts), [jobs.ts](jobs.ts), [cpu-reference.ts](cpu-reference.ts) | The check (Deno), its inputs, the files it exchanges with the CPU side, the CPU side (Node) |
| [deno.json](deno.json), [node-globals.d.ts](node-globals.d.ts) | Deno's configuration: the `check` and `typecheck` tasks |
| `results/` | Results of the check |

The GPU modules (`device`, `field`, `scan*`, `multiply*`) import no Node module at run time, so they also run in a
browser once bundled; that runtime was not exercised here.

## Type checking

This folder is left out of `npm run typecheck` (the example's `tsconfig.json` excludes `gpu/**`): Node's TypeScript
setup has no WebGPU types. `deno task --config examples/private-shielded-sync/gpu/deno.json typecheck` checks it with
Deno's (`strict`, `noUncheckedIndexedAccess`); `check` runs it first. `node-globals.d.ts` declares Node's `Buffer`,
which `pir/matrix.ts` uses.

## Deno's WebGPU on Apple silicon

Measured with Deno 2.7.5 on an Apple M4 Max:

- Every await on the GPU (`mapAsync`, `onSubmittedWorkDone`) returns after about 12–13 ms even with no work, so a call
  that reads back once costs at least that. Calls in flight together share it; the check reports 16 concurrent answer
  calls.
- Timestamp queries leave the end of a short pass (about a millisecond or less) unwritten; such calls report no GPU
  execution time.
- `queue.writeBuffer` refuses a bare `ArrayBuffer` with offsets; views (also of a `SharedArrayBuffer`) work.
- The field arithmetic written with loops ran at about 42 µs per scan entry, against about 5 µs as straight-line code.
- `node:worker_threads` under Deno runs the CPU multiply's workers about 20 times slower than Node does, which is why the
  CPU side of the check runs under Node.
