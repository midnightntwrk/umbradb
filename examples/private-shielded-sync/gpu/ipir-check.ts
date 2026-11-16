/**
 * The IPIR+SP GPU check (spec story 6, FR-061, FR-062, SC-007): the GPU's first pass, packing and answers equal the
 * CPU's byte for byte, and their timings next to the CPU's. Run with Deno (WebGPU), from the repository root:
 *
 *     deno task --config examples/private-shielded-sync/gpu/deno.json ipir-check [-- options]
 *
 * Options: `--work DIR` (exchange folder; default a temporary one, removed after), `--keep` (keep it), `--out FILE`
 * (results; default `gpu/results/ipir-check-<date>.json`), `--runs N` (timed runs per measurement, default 9),
 * `--quick` (2,048 × 2,048 tables only; results not written unless `--out`), `--only ID` (one case).
 *
 * For each table (random 16-bit cells, and every cell 0xFFFF; 2,048 × 2,048, 4,096 × 12,288 and 32,768 × 12,288):
 *
 * 1. writes the cells to the work folder;
 * 2. runs the CPU side under Node (`ipir-cpu-reference.ts`): the native add-on builds the table, the wallet's
 *    WebAssembly makes 32 requests, `IpirServerTable.respond` answers calls of 1 and 32 (timed), the wallet decodes the
 *    answers against the table, and `ipirGpuReference` exports the compiled matrices, the hint columns, the query
 *    masks and upstream's unrounded first pass and packing product;
 * 3. uploads the table and matrices to the GPU (`GpuIpirTable`) and compares, byte for byte: the first pass of the 32
 *    requests with upstream's, the packing product with upstream's, the answers to the calls of 1 and of 32 with
 *    `IpirServerTable.respond`'s, and (random tables) the hint columns with upstream's;
 * 4. for one table, also a GPU table split into small chunks, and negative controls (one changed selection word, key
 *    word or cell changes exactly the results it should; a request of another setup is refused);
 * 5. times the GPU's first pass, packing and whole answer (wall time and the GPU's own execution time), the upload, and
 *    16 calls in flight together, next to the CPU's times.
 *
 * Writes the results file and exits 1 if any check fails.
 */

import { loadavg } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ipirRequestBytes } from "../ipir/sizes.ts";
import { openGpu } from "./device.ts";
import { GpuIpirTable, type GpuIpirCallShape, type GpuIpirStagesMs } from "./ipir.ts";
import { type IpirCpuReport, type IpirJob, ipirOutputs } from "./ipir-jobs.ts";
import { readBytes, readJson, writeBytes, writeJson } from "./jobs.ts";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// ---- Options ----

function option(name: string): string | undefined {
  const i = Deno.args.indexOf(name);
  return i >= 0 ? Deno.args[i + 1] : undefined;
}
const quick = Deno.args.includes("--quick");
const keep = Deno.args.includes("--keep");
const runs = Number(option("--runs") ?? (quick ? 3 : 9));
const only = option("--only");
const date = new Date().toISOString().slice(0, 10);
const outPath = option("--out") ?? (quick ? undefined : here(`./results/ipir-check-${date}.json`));

// ---- Results ----

interface Check {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}
const checks: Check[] = [];
function record(name: string, ok: boolean, detail: string): void {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`);
}

const bytesOf = (a: ArrayBufferView) => new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
function compareBytes(a: Uint8Array, b: Uint8Array): { equal: boolean; differing: number; first: number } {
  if (a.length !== b.length) return { equal: false, differing: Math.abs(a.length - b.length), first: Math.min(a.length, b.length) };
  let differing = 0;
  let first = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      differing++;
      if (first < 0) first = i;
    }
  }
  return { equal: differing === 0, differing, first };
}
const describe = (c: { equal: boolean; differing: number; first: number }, what: string) =>
  c.equal ? `${what} equal` : `${c.differing} bytes differ, first at byte ${c.first}`;
const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(2)} ms`);
const median = (xs: readonly number[]) => {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2;
};
const measured = (xs: readonly (number | null)[]) => xs.filter((x): x is number => x !== null);
const medianOrNull = (xs: readonly (number | null)[]) => (measured(xs).length ? median(measured(xs)) : null);

async function timed<T>(f: () => Promise<T>): Promise<{ ms: number; value: T }> {
  const t = performance.now();
  const value = await f();
  return { ms: performance.now() - t, value };
}

/** xorshift32, for cells and row choices that repeat from run to run. */
function xorshift(seed: number): () => number {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x;
  };
}

// ---- Cases ----

interface Case {
  readonly id: string;
  readonly rows: number;
  readonly cols: number;
  readonly kind: "random" | "ffff";
  readonly hints: boolean;
  /** Also check a second GPU table of the same cells split into chunks of this many bytes. */
  readonly chunked?: number;
  /** Run the negative controls on this table. */
  readonly controls?: boolean;
}
const allCases: Case[] = quick
  ? [
      { id: "2048x2048-random", rows: 2048, cols: 2048, kind: "random", hints: true, chunked: 2 * 2 ** 20, controls: true },
      { id: "2048x2048-ffff", rows: 2048, cols: 2048, kind: "ffff", hints: false },
    ]
  : [
      { id: "2048x2048-random", rows: 2048, cols: 2048, kind: "random", hints: true, chunked: 2 * 2 ** 20, controls: true },
      { id: "2048x2048-ffff", rows: 2048, cols: 2048, kind: "ffff", hints: false },
      { id: "4096x12288-random", rows: 4096, cols: 12288, kind: "random", hints: true, chunked: 16 * 2 ** 20 },
      { id: "4096x12288-ffff", rows: 4096, cols: 12288, kind: "ffff", hints: false },
      { id: "32768x12288-random", rows: 32768, cols: 12288, kind: "random", hints: true },
      { id: "32768x12288-ffff", rows: 32768, cols: 12288, kind: "ffff", hints: false },
    ];
const cases = only ? allCases.filter((c) => c.id === only) : allCases;
if (cases.length === 0) throw new Error(`no case ${only}`);
const COUNTS = [1, 32] as const;
const REQUESTS = 32;

// ---- Setup ----

const gpu = await openGpu();
if (!gpu) {
  console.error("no WebGPU adapter in this runtime");
  Deno.exit(2);
}
const { device } = gpu;
let lost: string | undefined;
device.lost.then((l) => {
  lost = l.message || "device lost";
});
const loadBefore = loadavg();
console.log(`GPU: ${gpu.description}; Deno ${Deno.version.deno}; ${runs} timed runs${quick ? "; quick" : ""}`);
const floorMs: number[] = [];
for (let r = 0; r < 7; r++) floorMs.push((await timed(() => device.queue.onSubmittedWorkDone())).ms);
console.log(`Deno WebGPU round trip with no work: median ${fmt(median(floorMs))}`);
const compile = await timed(() => GpuIpirTable.compileKernels(device));
console.log(`kernels compiled in ${fmt(compile.ms)}`);

const work = option("--work") ?? (await Deno.makeTempDir({ prefix: "pss-ipir-gpu-check-" }));
await Deno.mkdir(work, { recursive: true });
console.log(`work folder: ${work}`);

interface StageTimes {
  /** Wall time of each timed call: from the call to the result in host memory. */
  readonly wallMs: number[];
  /** The GPU's own execution time of the stages of each timed call (timestamp queries). */
  readonly stages: (GpuIpirStagesMs | null)[];
}

interface CaseResult {
  readonly id: string;
  readonly rows: number;
  readonly cols: number;
  readonly kind: string;
  readonly cpu: IpirCpuReport;
  readonly gpu: {
    readonly firstCreateMs: number;
    readonly uploadMs: number;
    readonly residentBytes: number;
    readonly chunkRows: number;
    readonly calls: Record<string, { shape: GpuIpirCallShape | null; firstPass: StageTimes; packing: StageTimes; answer: StageTimes; concurrent: { calls: number; totalMs: number; perCallMs: number; allEqual: boolean } }>;
    readonly hintsMs: number | null;
  };
}
const results: CaseResult[] = [];

async function stageTimes(call: () => Promise<unknown>, table: GpuIpirTable): Promise<StageTimes> {
  const wallMs: number[] = [];
  const stages: (GpuIpirStagesMs | null)[] = [];
  await call();
  for (let r = 0; r < runs; r++) {
    table.lastStagesMs = null;
    const t = await timed(call);
    wallMs.push(t.ms);
    stages.push(table.lastStagesMs);
  }
  return { wallMs, stages };
}

for (const c of cases) {
  console.log(`\n== ${c.id} ==`);
  const dir = join(work, c.id);
  await Deno.mkdir(dir, { recursive: true });
  const { rows, cols } = c;

  // 1. Cells.
  let t0 = performance.now();
  const cells = new Uint16Array(rows * cols);
  if (c.kind === "ffff") cells.fill(0xffff);
  else {
    const next = xorshift(0x1f2e3d4c ^ rows ^ (cols << 8));
    for (let i = 0; i < cells.length; i++) cells[i] = next() & 0xffff;
  }
  writeBytes(dir, "cells.bin", cells);
  const pick = xorshift(rows * 31 + cols);
  const wantedRows = [0, rows - 1, ...Array.from({ length: REQUESTS - 2 }, () => pick() % rows)];
  const hexOf = (fill: number) => Array.from({ length: 32 }, (_, i) => ((fill + i) & 0xff).toString(16).padStart(2, "0")).join("");
  const job: IpirJob = {
    id: c.id,
    rows,
    cols,
    cells: "cells.bin",
    seed: hexOf(rows & 0xff),
    snapshot: hexOf(cols & 0xff ^ (c.kind === "ffff" ? 0x55 : 0)),
    wantedRows,
    counts: [...COUNTS],
    warmups: 2,
    runs,
    hints: c.hints,
  };
  writeJson(dir, "job.json", job);
  console.log(`cells written in ${fmt(performance.now() - t0)}`);

  // 2. The CPU side, under Node.
  t0 = performance.now();
  const node = await new Deno.Command("node", { args: [here("./ipir-cpu-reference.ts"), dir], stdout: "inherit", stderr: "inherit" }).output();
  if (!node.success) {
    record(`${c.id}: CPU side`, false, `the CPU reference failed (exit ${node.code})`);
    continue;
  }
  const cpu = readJson<IpirCpuReport>(dir, "cpu.json");
  console.log(`CPU side in ${fmt(performance.now() - t0)} (build ${fmt(cpu.buildMs)}, reference ${fmt(cpu.referenceMs)})`);
  record(`${c.id}: wallet decodes the CPU's answers to their rows`, cpu.decodedWrong === 0 && cpu.decodedRows === REQUESTS, `${cpu.decodedRows - cpu.decodedWrong} of ${cpu.decodedRows} rows`);
  record(`${c.id}: the exported preparation's masks equal the build's`, cpu.referenceMasksEqual, `matrix entries within ±${cpu.matrixMaxAbs} (2^${Math.log2(cpu.matrixMaxAbs + 1).toFixed(2)})`);
  for (const r of cpu.respond) record(`${c.id}: respondTimed = respond (×${r.count})`, r.timedEqual, "the timed path gives the same answers");

  const setupId = readBytes(dir, ipirOutputs.setupId).slice();
  const requests = readBytes(dir, ipirOutputs.requests).slice();
  const blocks = cols / 2048;
  const matrices = Array.from({ length: blocks }, (_, k) => {
    const b = readBytes(dir, ipirOutputs.matrix(k)).slice();
    return new Int32Array(b.buffer, 0, b.length / 4);
  });
  const each = ipirRequestBytes(rows);

  // 3. The GPU table: upload twice (the second is the one kept and timed).
  const first = await timed(() => GpuIpirTable.create(device, { rows, cols, cells, setupId, matrices }, { timestamps: true }));
  first.value.release();
  const upload = await timed(() => GpuIpirTable.create(device, { rows, cols, cells, setupId, matrices }, { timestamps: true }));
  const table = upload.value;
  console.log(`GPU upload ${fmt(upload.ms)} (first ${fmt(first.ms)}); resident ${(table.residentBytes / 2 ** 20).toFixed(1)} MiB, ${table.chunkRows} rows per chunk`);

  const all = requests.subarray(0, REQUESTS * each);
  const firstPass = await table.firstPass(all, REQUESTS);
  record(`${c.id}: GPU first pass = upstream's (${REQUESTS} requests)`, compareBytes(bytesOf(firstPass), readBytes(dir, ipirOutputs.firstPass)).equal, describe(compareBytes(bytesOf(firstPass), readBytes(dir, ipirOutputs.firstPass)), `${firstPass.length} values mod 2^54`));
  const packing = await table.packingProduct(all, REQUESTS);
  const packingCmp = compareBytes(bytesOf(packing), readBytes(dir, ipirOutputs.packing));
  record(`${c.id}: GPU packing product = upstream's (${REQUESTS} requests)`, packingCmp.equal, describe(packingCmp, `${packing.length} values mod 2^54`));
  for (const count of COUNTS) {
    const answers = await table.respond(requests.subarray(0, count * each), count);
    const cmp = compareBytes(answers, readBytes(dir, ipirOutputs.answers(count)));
    record(`${c.id}: GPU answers = IpirServerTable.respond (×${count})`, cmp.equal, describe(cmp, `${answers.length} bytes`));
  }

  // Hint columns (FR-062).
  let hintsMs: number | null = null;
  if (c.hints) {
    const masksBytes = readBytes(dir, ipirOutputs.queryMasks).slice();
    const queryMasks = new BigUint64Array(masksBytes.buffer, 0, masksBytes.length / 8);
    const h = await timed(() => table.hints(queryMasks));
    hintsMs = h.ms;
    const want = new Uint8Array(cols * 2048 * 8);
    for (let k = 0; k < blocks; k++) want.set(readBytes(dir, ipirOutputs.hints(k)), k * 2048 * 2048 * 8);
    const cmp = compareBytes(bytesOf(h.value), want);
    record(`${c.id}: GPU hint columns = upstream's`, cmp.equal, `${describe(cmp, `${cols} × 2,048 values mod 2^54`)}; GPU ${fmt(h.ms)}`);
  }

  // 4. A table split into small chunks; negative controls.
  if (c.chunked) {
    const small = await GpuIpirTable.create(device, { rows, cols, cells, setupId, matrices }, { chunkBytes: c.chunked });
    const answers = await small.respond(all, REQUESTS);
    const cmp = compareBytes(answers, readBytes(dir, ipirOutputs.answers(REQUESTS)));
    record(`${c.id}: GPU answers with chunks of ${c.chunked} bytes (${small.chunkRows} rows) = IpirServerTable.respond (×${REQUESTS})`, cmp.equal, describe(cmp, `${answers.length} bytes`));
    if (c.hints) {
      const masksBytes = readBytes(dir, ipirOutputs.queryMasks).slice();
      const hints = await small.hints(new BigUint64Array(masksBytes.buffer, 0, masksBytes.length / 8));
      const hintsFull = await table.hints(new BigUint64Array(masksBytes.buffer, 0, masksBytes.length / 8));
      record(`${c.id}: GPU hint columns with chunks = without`, compareBytes(bytesOf(hints), bytesOf(hintsFull)).equal, `${hints.length / 2} values`);
    }
    small.release();
  }
  if (c.controls) {
    const wantFirst = new BigUint64Array(readBytes(dir, ipirOutputs.firstPass).slice().buffer);
    const wantPacking = new BigUint64Array(readBytes(dir, ipirOutputs.packing).slice().buffer);
    const differing = (got: BigUint64Array, want: BigUint64Array) => {
      const requestsHit = new Set<number>();
      const columnsHit = new Set<number>();
      got.forEach((x, i) => {
        if (x !== want[i]) {
          requestsHit.add(Math.floor(i / cols));
          columnsHit.add(i % cols);
        }
      });
      return { requests: [...requestsHit], columns: columnsHit };
    };
    // One selection word of request 5 (row 100): only request 5's first pass changes.
    const sel = all.slice();
    const selBit = (36 + 27_648) * 8 + 100 * 49 + 3;
    sel[5 * each + (selBit >>> 3)]! ^= 1 << (selBit & 7);
    const d1 = differing(await table.firstPass(sel, REQUESTS), wantFirst);
    record("negative control: one selection word changed", d1.requests.length === 1 && d1.requests[0] === 5, `first-pass values differ in request(s) ${JSON.stringify(d1.requests)} (changed 5), ${d1.columns.size} columns`);
    // One key word of request 3: only request 3's packing changes.
    const key = all.slice();
    const keyBit = 36 * 8 + 777 * 54 + 10;
    key[3 * each + (keyBit >>> 3)]! ^= 1 << (keyBit & 7);
    const d2 = differing(await table.packingProduct(key, REQUESTS), wantPacking);
    record("negative control: one key word changed", d2.requests.length === 1 && d2.requests[0] === 3, `packing values differ in request(s) ${JSON.stringify(d2.requests)} (changed 3)`);
    // One cell (row 77, column 1234): only that column's first pass changes.
    const changed = cells.slice();
    changed[1234 * rows + 77] = changed[1234 * rows + 77]! ^ 1;
    const other = await GpuIpirTable.create(device, { rows, cols, cells: changed, setupId, matrices });
    const d3 = differing(await other.firstPass(all, REQUESTS), wantFirst);
    other.release();
    record("negative control: one cell changed", d3.columns.size === 1 && d3.columns.has(1234) && d3.requests.length === REQUESTS, `first-pass values differ in column(s) ${JSON.stringify([...d3.columns])} of ${d3.requests.length} requests (changed column 1234)`);
    // A request of another setup is refused.
    const foreign = all.slice(0, each);
    foreign[10]! ^= 1;
    let refused = "";
    try {
      await table.respond(foreign, 1);
    } catch (e) {
      refused = (e as Error).message;
    }
    record("negative control: a request of another setup is refused", refused.includes("setup"), refused || "accepted");
  }

  // 5. Timings.
  const calls: CaseResult["gpu"]["calls"] = {};
  for (const count of COUNTS) {
    const call = requests.subarray(0, count * each);
    const answer = await stageTimes(() => table.respond(call, count), table);
    const shape = table.lastCall;
    const firstPassTimes = await stageTimes(() => table.firstPass(call, count), table);
    const packingTimes = await stageTimes(() => table.packingProduct(call, count), table);
    const reference = readBytes(dir, ipirOutputs.answers(count));
    const n = 16;
    const together = await timed(() => Promise.all(Array.from({ length: n }, () => table.respond(call, count))));
    const allEqual = together.value.every((a) => compareBytes(a, reference).equal);
    if (!allEqual) record(`${c.id}: concurrent GPU answers (×${count})`, false, "a concurrent call's answers differ");
    calls[String(count)] = {
      shape,
      firstPass: firstPassTimes,
      packing: packingTimes,
      answer,
      concurrent: { calls: n, totalMs: together.ms, perCallMs: together.ms / n, allEqual },
    };
    const cpuRespond = cpu.respond.find((r) => r.count === count)!;
    console.log(
      `×${count}: GPU first pass ${fmt(median(firstPassTimes.wallMs))} (exec ${fmt(medianOrNull(firstPassTimes.stages.map((s) => s?.scan ?? null)) ?? NaN)}), ` +
        `packing ${fmt(median(packingTimes.wallMs))} (exec ${fmt(medianOrNull(packingTimes.stages.map((s) => s?.pack ?? null)) ?? NaN)}), ` +
        `answer ${fmt(median(answer.wallMs))} (exec ${fmt(medianOrNull(answer.stages.map((s) => s?.total ?? null)) ?? NaN)}), ` +
        `${n} together ${fmt(together.ms / n)} per call; CPU respond ${fmt(median(cpuRespond.respondMs))} ` +
        `(first pass ${fmt(median(cpuRespond.stages.map((s) => s.matrixVectorMs)))}, packing ${fmt(median(cpuRespond.stages.map((s) => s.packingMs)))})`,
    );
  }
  table.release();
  results.push({
    id: c.id,
    rows,
    cols,
    kind: c.kind,
    cpu,
    gpu: { firstCreateMs: first.ms, uploadMs: upload.ms, residentBytes: table.residentBytes, chunkRows: table.chunkRows, calls, hintsMs },
  });
  if (!keep) await Deno.remove(dir, { recursive: true });
}
if (lost) record("GPU device", false, `lost: ${lost}`);

// ---- Summary ----

const summary = results.flatMap((r) =>
  COUNTS.map((count) => {
    const g = r.gpu.calls[String(count)]!;
    const cpuRespond = r.cpu.respond.find((x) => x.count === count)!;
    const scratch = g.shape?.scratchBytes ?? 0;
    return {
      table: r.id,
      requests: count,
      gpuFirstPassWallMs: median(g.firstPass.wallMs),
      gpuFirstPassExecMs: medianOrNull(g.firstPass.stages.map((s) => s?.scan ?? null)),
      gpuPackingWallMs: median(g.packing.wallMs),
      gpuPackingExecMs: medianOrNull(g.packing.stages.map((s) => s?.pack ?? null)),
      gpuAnswerWallMs: median(g.answer.wallMs),
      gpuAnswerExecMs: medianOrNull(g.answer.stages.map((s) => s?.total ?? null)),
      gpuAnswerConcurrentPerCallMs: g.concurrent.perCallMs,
      gpuUploadMs: r.gpu.uploadMs,
      gpuResidentMiB: r.gpu.residentBytes / 2 ** 20,
      gpuCallScratchMiB: scratch / 2 ** 20,
      cpuRespondMs: median(cpuRespond.respondMs),
      cpuFirstPassMs: median(cpuRespond.stages.map((s) => s.matrixVectorMs)),
      cpuPackingMs: median(cpuRespond.stages.map((s) => s.packingMs)),
    };
  }),
);
console.log("\ntable, requests: GPU first pass wall (exec) | GPU packing wall (exec) | GPU answer wall (exec) | 16 together per call | upload | GPU memory | CPU respond (first pass, packing)");
for (const s of summary) {
  const e = (x: number | null) => (x === null ? "—" : fmt(x));
  console.log(
    `  ${s.table} ×${s.requests}: ${fmt(s.gpuFirstPassWallMs)} (${e(s.gpuFirstPassExecMs)}) | ${fmt(s.gpuPackingWallMs)} (${e(s.gpuPackingExecMs)}) | ${fmt(s.gpuAnswerWallMs)} (${e(s.gpuAnswerExecMs)}) | ${fmt(s.gpuAnswerConcurrentPerCallMs)} | ${fmt(s.gpuUploadMs)} | ${s.gpuResidentMiB.toFixed(0)} + ${s.gpuCallScratchMiB.toFixed(1)} MiB | ${fmt(s.cpuRespondMs)} (${fmt(s.cpuFirstPassMs)}, ${fmt(s.cpuPackingMs)})`,
  );
}

const ok = checks.every((c) => c.ok);
const output = {
  date: new Date().toISOString(),
  ok,
  environment: {
    gpu: gpu.description,
    deno: Deno.version.deno,
    node: results[0]?.cpu.node ?? null,
    cpus: results[0]?.cpu.cpus ?? null,
    loadAverage: { before: loadBefore, after: loadavg() },
    quick,
    runs,
  },
  notes: [
    "Deno WebGPU figures (Deno's wgpu on Metal). Wall times run from the call to the result in host memory and include Deno's floor of about 12 ms per read-back (setup.denoRoundTripFloorMs); 'exec' times are the GPU's own, from timestamp queries around the stage's passes (null where Deno left a short pass's end timestamp unwritten). 'together' is 16 calls in flight at once, which share the floor.",
    "GPU first pass: the requests' selection words unpacked and the table scanned once for all the call's requests, read back unrounded. GPU packing: the key words unpacked and every block's compiled matrix multiplied, read back unrounded. GPU answer: both, the sums rounded and packed on the GPU, the 68-byte heads (with SHA-256 of each request, WebCrypto) on the host.",
    "CPU: the native add-on (upstream's code, rustc release build, rayon over the machine's cores) under Node; respond is IpirServerTable.respond's wall time, which answers a call's requests one after another; first pass and packing are upstream's own timers (NativeTiming) summed over the call's requests. On arm64 upstream takes its scalar paths (no NEON).",
    "Memory on the GPU: the table's cells (2 bytes each) and the compiled matrices (32 MiB per 2,048 columns) stay resident; a call adds its scratch (requests, limbs, partial sums, output).",
    "The machine was shared with other work; see the load averages.",
  ],
  setup: { kernelsCompileMs: compile.ms, denoRoundTripFloorMs: floorMs },
  checks,
  summary,
  cases: results,
};
if (outPath) {
  await Deno.mkdir(dirname(outPath), { recursive: true });
  await Deno.writeTextFile(outPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`results: ${outPath}`);
}
device.destroy();
if (!keep && !option("--work")) await Deno.remove(work, { recursive: true });
console.log(ok ? `all ${checks.length} checks passed` : `${checks.filter((c) => !c.ok).length} of ${checks.length} checks FAILED`);
Deno.exit(ok ? 0 : 1);
