/**
 * The GPU kernels' check (spec story 7, independent test): each GPU kernel returns results byte-equal to the CPU
 * kernel on the same input. Run with Deno (WebGPU), from the repository root:
 *
 *     deno task --config examples/private-shielded-sync/gpu/deno.json check [-- options]
 *
 * Options: `--threads N` (CPU worker threads, default 8), `--out FILE` (results, default
 * `gpu/results/check-<date>.json`), `--work DIR` (input/output exchange folder, default a temporary one, removed
 * after), `--keep` (keep it), `--quick` (small inputs, for development; results not written unless `--out`).
 *
 * Steps: builds the inputs (`inputs.ts`), runs the GPU kernels (`GpuScanner`, `GpuMultiplier`) with timings, runs the
 * CPU kernels on the same input files under Node (`cpu-reference.ts`: `ScanPool`, `WorkerMultiplier`, and one thread),
 * compares every output byte for byte (and the vectors' expected values and hits), runs negative controls (a changed
 * input gives a different result, only where it should), decodes a PIR call answered by the GPU, and writes the
 * results file. Exit code 1 if any check fails.
 */

import { loadavg } from "node:os";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { gridDigest, readRecord, type Grid } from "../pir/grid.ts";
import { deriveSeed, matrixRows, type TableName } from "../pir/matrix.ts";
import type { Layout, Matrix } from "../pir/multiply.ts";
import { LWE_N } from "../pir/params.ts";
import { buildQueries, columnRecords, decodeAnswers, type QueryBatch } from "../pir/query.ts";
import { matrixColumns } from "../pir/setup.ts";
import { openGpu } from "./device.ts";
import type { PoseidonConstants } from "./field.ts";
import { type Fixtures, nullifierTable, preprodSet, randomVectors, readTable, Rng, type ScanSet, vectorSet } from "./inputs.ts";
import { type CpuReport, type Job, outputs, readBytes, readJson, writeBytes, writeJson } from "./jobs.ts";
import { GpuMultiplier } from "./multiply.ts";
import { GpuScanner } from "./scan.ts";
import type { Scanner } from "./scanner.ts";
import type { ScanPool } from "../kernel/scan-pool.ts";

// The CPU pool satisfies the GPU scanner's interface as it is (checked by `deno check`).
type _PoolIsScanner = ScanPool extends Scanner ? true : never;
const _poolIsScanner: _PoolIsScanner = true;
void _poolIsScanner;

const ENTRY_BYTES = 36;
const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// ---- Options ----

function option(name: string): string | undefined {
  const i = Deno.args.indexOf(name);
  return i >= 0 ? Deno.args[i + 1] : undefined;
}
const quick = Deno.args.includes("--quick");
const keep = Deno.args.includes("--keep");
const threads = Number(option("--threads") ?? 8);
const date = new Date().toISOString().slice(0, 10);
const outPath = option("--out") ?? (quick ? undefined : here(`./results/check-${date}.json`));

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

/** Byte comparison: equal, or how many bytes differ and where the first is. */
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

const bytesOf = (a: ArrayBufferView) => new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(1)} ms`);
const best = (xs: readonly number[]) => Math.min(...xs);
/** The measured values of a list that may hold nulls (unmeasured), or null if none was measured. */
const measured = (xs: readonly (number | null)[]): number[] | null => {
  const m = xs.filter((x): x is number => x !== null);
  return m.length ? m : null;
};
const median = (xs: readonly number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2;
};

async function timed<T>(f: () => Promise<T>): Promise<{ ms: number; value: T }> {
  const t = performance.now();
  const value = await f();
  return { ms: performance.now() - t, value };
}

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
console.log(`GPU: ${gpu.description}; Deno ${Deno.version.deno}; CPU threads for the reference: ${threads}${quick ? "; quick" : ""}`);

const fixture = (name: string) => Deno.readFileSync(here(`../test/fixtures/${name}`));
const fixtures: Fixtures = {
  entries: fixture("entries.bin"),
  pads: fixture("pads.bin"),
  mine: fixture("mine.bin"),
  scalar: fixture("scalar.bin"),
};
const poseidon = JSON.parse(new TextDecoder().decode(fixture("poseidon-constants.json"))) as PoseidonConstants;
const kernel = new Kernel(compileKernel());

const work = option("--work") ?? (await Deno.makeTempDir({ prefix: "pss-gpu-check-" }));
await Deno.mkdir(work, { recursive: true });
console.log(`work folder: ${work}`);

// ---- Inputs ----

let t0 = performance.now();
const scanSets: ScanSet[] = [vectorSet(fixtures), preprodSet(fixtures, kernel, quick ? 20_000 : 70_000)];
console.log(`scan sets built in ${fmt(performance.now() - t0)}`);
t0 = performance.now();
const read = readTable(quick ? 5_000 : 69_255);
const nullifier = nullifierTable(quick ? 4_000 : 57_770);
console.log(
  `tables built in ${fmt(performance.now() - t0)}: read ${read.rows} × ${read.cols}, nullifier ${nullifier.grid.rows} × ${nullifier.grid.cols} (${nullifier.bucketBits} bucket bits, capacity ${nullifier.capacity})`,
);

const rng = new Rng(2026);
interface Table {
  readonly name: TableName;
  readonly grid: Grid;
  readonly seed: Uint8Array;
  readonly columns: number[];
  readonly batch: QueryBatch;
}
async function table(name: TableName, grid: Grid): Promise<Table> {
  const seed = deriveSeed(name, gridDigest(grid));
  const columns = rng.shuffle(Array.from({ length: grid.cols }, (_, i) => i)).slice(0, Math.min(32, grid.cols));
  const batch = await buildQueries({ ...grid, seed }, columns);
  return { name, grid, seed, columns, batch };
}
const tables = [await table("read", read), await table("nullifier", nullifier.grid)];

/** A multiply job's inputs, kept here to run on the GPU and to compare. */
interface MultiplyCase {
  readonly id: string;
  readonly what: string;
  readonly matrix: Matrix;
  readonly vectors: Uint32Array;
  readonly count: number;
  readonly layout: Layout;
  readonly runs: number;
  readonly singleThread: boolean;
  readonly pinned: boolean;
}
const cases: MultiplyCase[] = [];
for (const t of tables) {
  const count = t.columns.length;
  cases.push({
    id: `${t.name}-answer`,
    what: `${t.name} table answer: ${t.grid.rows} × ${t.grid.cols} 16-bit grid × ${count} query vectors (vector-major)`,
    matrix: t.grid,
    vectors: t.batch.queries,
    count,
    layout: "vector-major",
    // The machine is shared: nine runs give medians that one stalled run does not move.
    runs: 9,
    singleThread: true,
    pinned: true,
  });
  cases.push({
    id: `${t.name}-setup`,
    what: `${t.name} table setup H = grid × A: ${t.grid.rows} × ${t.grid.cols} grid × ${LWE_N} columns of A (row-major)`,
    matrix: t.grid,
    vectors: matrixColumns(t.seed, t.grid.cols),
    count: LWE_N,
    layout: "row-major",
    runs: 3,
    singleThread: t.name !== "read",
    pinned: true,
  });
}
{
  // The client's steps (32-bit matrices): H·s over the read table's setup shape, A·s over one 4,096-row chunk of A.
  const rows = read.rows;
  const h = new Int32Array(rows * LWE_N);
  new Uint32Array(h.buffer).set(randomVectors(rng, rows, LWE_N));
  const secrets = randomVectors(rng, 32, LWE_N);
  cases.push({
    id: "client-hs",
    what: `client H·s: ${rows} × ${LWE_N} 32-bit matrix × 32 secrets (vector-major)`,
    matrix: { rows, cols: LWE_N, cells: h },
    vectors: secrets,
    count: 32,
    layout: "vector-major",
    runs: 5,
    singleThread: true,
    pinned: false,
  });
  const aRows = Math.min(4096, read.cols);
  const a = new Int32Array(aRows * LWE_N);
  matrixRows(tables[0]!.seed, 0, aRows, new Uint32Array(a.buffer));
  cases.push({
    id: "client-as",
    what: `client A·s: ${aRows} × ${LWE_N} rows of A × 32 secrets (vector-major)`,
    matrix: { rows: aRows, cols: LWE_N, cells: a },
    vectors: secrets,
    count: 32,
    layout: "vector-major",
    runs: 5,
    singleThread: true,
    pinned: false,
  });
}
// Small odd shapes: padding of odd column counts, vector counts that are not a multiple of the invocation's.
for (const [rows, cols, count, layout, bits] of [
  [1, 1, 1, "row-major", 16],
  [5, 7, 1, "vector-major", 16],
  [37, 51, 3, "row-major", 16],
  [101, 1023, 33, "vector-major", 16],
  [13, 9, 65, "row-major", 32],
  [3, 2049, 7, "vector-major", 32],
] as const) {
  const cells = bits === 16 ? new Int16Array(rows * cols) : new Int32Array(rows * cols);
  for (let i = 0; i < cells.length; i++) cells[i] = bits === 16 ? rng.below(512) - 256 : rng.u32() | 0;
  cases.push({
    id: `odd-${rows}x${cols}x${count}-${bits}`,
    what: `odd shape: ${rows} × ${cols} ${bits}-bit × ${count} vectors (${layout})`,
    matrix: { rows, cols, cells },
    vectors: randomVectors(rng, count, cols),
    count,
    layout,
    runs: 1,
    singleThread: true,
    pinned: false,
  });
}

// ---- Job files for the CPU reference ----

const jobs: Job[] = [];
for (const s of scanSets) {
  jobs.push({
    kind: "scan",
    id: `scan-${s.name}`,
    entries: writeBytes(work, `scan-${s.name}.entries.bin`, s.entries),
    secret: writeBytes(work, `scan-${s.name}.secret.bin`, s.secret),
    singleThreadSample: 512,
  });
}
const written = new Map<ArrayBufferView, string>();
const once = (name: string, a: ArrayBufferView) => {
  const known = written.get(a);
  if (known) return known;
  const file = writeBytes(work, name, a);
  written.set(a, file);
  return file;
};
for (const c of cases) {
  jobs.push({
    kind: "multiply",
    id: c.id,
    cells: once(`${c.id}.cells.bin`, c.matrix.cells),
    cellBits: c.matrix.cells instanceof Int16Array ? 16 : 32,
    rows: c.matrix.rows,
    cols: c.matrix.cols,
    vectors: once(`${c.id}.vectors.bin`, c.vectors),
    count: c.count,
    layout: c.layout,
    warmups: c.count === LWE_N ? 1 : 3,
    runs: c.runs,
    singleThread: c.singleThread,
  });
}
writeJson(work, "jobs.json", { threads, jobs });

// ---- GPU runs ----

interface GpuScanTiming {
  readonly firstValuesMs: number;
  readonly valuesMs: number[];
  readonly scanMs: number[];
  /** The GPU's own execution time of each timed call (timestamp queries), when available. */
  readonly valuesGpuMs: (number | null)[];
  readonly scanGpuMs: (number | null)[];
}

// Deno's WebGPU answers any await on the GPU (`mapAsync`, `onSubmittedWorkDone`) after a floor of about 12 ms, with no
// work at all; every call's wall time includes it once per read-back.
const floorMs: number[] = [];
for (let r = 0; r < 7; r++) floorMs.push((await timed(() => device.queue.onSubmittedWorkDone())).ms);
console.log(`Deno WebGPU round trip with no work: median ${fmt(median(floorMs))}`);
const gpuScan = new Map<string, { values: Uint8Array; hits: number[]; timing: GpuScanTiming }>();
t0 = performance.now();
const scanner = await GpuScanner.create(device, poseidon, { timestamps: true });
const scannerCreateMs = performance.now() - t0;
for (const s of scanSets) {
  const first = await timed(() => scanner.scanValues(s.entries, s.secret));
  const valuesMs: number[] = [];
  const scanMs: number[] = [];
  const valuesGpuMs: (number | null)[] = [];
  const scanGpuMs: (number | null)[] = [];
  let values = first.value;
  let hits: number[] = [];
  for (let r = 0; r < 3; r++) {
    const v = await timed(() => scanner.scanValues(s.entries, s.secret));
    valuesMs.push(v.ms);
    valuesGpuMs.push(scanner.lastGpuMs);
    values = v.value;
    const h = await timed(() => scanner.scan(s.entries, s.secret));
    scanMs.push(h.ms);
    scanGpuMs.push(scanner.lastGpuMs);
    hits = h.value;
  }
  if (compareBytes(values, first.value).differing !== 0) record(`scan ${s.name}: repeat runs agree`, false, "two GPU runs differ");
  gpuScan.set(s.name, { values, hits, timing: { firstValuesMs: first.ms, valuesMs, scanMs, valuesGpuMs, scanGpuMs } });
  console.log(`  gpu scan ${s.name}: values best ${fmt(best(valuesMs))}, scan best ${fmt(best(scanMs))}, ${hits.length} hits`);
}

interface GpuMultiplyTiming {
  readonly unpinnedMs: number[];
  readonly pinMs: number | null;
  readonly pinnedMs: number[];
  /** The GPU's own execution time of each pinned (else unpinned) call, when available. */
  readonly gpuMs: (number | null)[];
  /** `concurrent` pinned calls in flight together: wall time of all, and per call. */
  readonly concurrent: { calls: number; totalMs: number; perCallMs: number; allEqual: boolean } | null;
}
const gpuMultiply = new Map<string, { answers: Uint32Array; unpinned: Uint32Array; timing: GpuMultiplyTiming }>();
t0 = performance.now();
const multiplier = await GpuMultiplier.create(device, { timestamps: true });
const multiplierCreateMs = performance.now() - t0;
for (const c of cases) {
  const unpinnedMs: number[] = [];
  const gpuMs: (number | null)[] = [];
  let unpinned: Uint32Array = new Uint32Array(0);
  const unpinnedRuns = c.pinned ? Math.min(c.runs, 3) : c.runs + 1;
  for (let r = 0; r < unpinnedRuns; r++) {
    const u = await timed(() => multiplier.multiply(c.matrix, c.vectors, c.count, c.layout));
    unpinnedMs.push(u.ms);
    if (!c.pinned) gpuMs.push(multiplier.lastGpuMs);
    unpinned = u.value;
  }
  let pinMs: number | null = null;
  const pinnedMs: number[] = [];
  let answers: Uint32Array = unpinned;
  if (c.pinned) {
    const t = performance.now();
    multiplier.pin(c.matrix);
    await device.queue.onSubmittedWorkDone();
    pinMs = performance.now() - t;
    for (let r = 0; r < c.runs + 1; r++) {
      const p = await timed(() => multiplier.multiply(c.matrix, c.vectors, c.count, c.layout));
      pinnedMs.push(p.ms);
      gpuMs.push(multiplier.lastGpuMs);
      answers = p.value;
    }
  }
  // A server answers many clients: query calls in flight together share the round-trip floor.
  let concurrent: GpuMultiplyTiming["concurrent"] = null;
  if (c.pinned && c.layout === "vector-major") {
    const calls = 16;
    const all = await timed(() =>
      Promise.all(Array.from({ length: calls }, () => multiplier.multiply(c.matrix, c.vectors, c.count, c.layout))),
    );
    const allEqual = all.value.every((a) => compareBytes(bytesOf(a), bytesOf(answers)).equal);
    concurrent = { calls, totalMs: all.ms, perCallMs: all.ms / calls, allEqual };
    if (!allEqual) record(`multiply ${c.id}: concurrent calls agree`, false, "a concurrent call's answers differ");
  }
  gpuMultiply.set(c.id, { answers, unpinned, timing: { unpinnedMs, pinMs, pinnedMs, gpuMs, concurrent } });
  if (!c.id.startsWith("odd-")) {
    console.log(
      `  gpu ${c.id}: unpinned best ${fmt(best(unpinnedMs))}${pinnedMs.length ? `, pinned best ${fmt(best(pinnedMs))}` : ""}` +
        `${measured(gpuMs) ? `, GPU execution ${fmt(median(measured(gpuMs)!))}` : ""}` +
        `${concurrent ? `, ${concurrent.calls} concurrent ${fmt(concurrent.perCallMs)} per call` : ""}`,
    );
  }
}

// ---- Negative controls (GPU on changed inputs) ----

interface Controls {
  readonly scanTag: { position: number; hits: number[] } | null;
  readonly scanPoint: { position: number; values: Uint8Array } | null;
  readonly cell: { row: number; col: number; answers: Uint32Array };
  readonly vector: { vector: number; col: number; answers: Uint32Array };
}
const preprod = scanSets[1]!;
const preprodGpu = gpuScan.get("preprod")!;
const hit = preprodGpu.hits[0];
let scanTag: Controls["scanTag"] = null;
let scanPoint: Controls["scanPoint"] = null;
if (hit !== undefined) {
  const changed = preprod.entries.slice();
  changed[hit * ENTRY_BYTES + 32]! ^= 1;
  scanTag = { position: hit, hits: await scanner.scan(changed, preprod.secret) };
  const changed2 = preprod.entries.slice();
  changed2[hit * ENTRY_BYTES]! ^= 1;
  scanPoint = { position: hit, values: await scanner.scanValues(changed2, preprod.secret) };
}
const readAnswer = cases.find((c) => c.id === "read-answer")!;
const cellRow = Math.floor(read.rows / 3);
const cellCol = Math.floor(read.cols / 2);
const changedGrid: Grid = { ...read, cells: read.cells.slice() };
changedGrid.cells[cellRow * read.cols + cellCol] = changedGrid.cells[cellRow * read.cols + cellCol]! === 255 ? 254 : changedGrid.cells[cellRow * read.cols + cellCol]! + 1;
const cellAnswers = await multiplier.multiply(changedGrid, readAnswer.vectors, readAnswer.count, readAnswer.layout);
const vecIndex = 5 % readAnswer.count;
const vecCol = Math.floor(read.cols / 4);
const changedVectors = readAnswer.vectors.slice();
changedVectors[vecIndex * read.cols + vecCol] = (changedVectors[vecIndex * read.cols + vecCol]! + 1) >>> 0;
const vectorAnswers = await multiplier.multiply(read, changedVectors, readAnswer.count, readAnswer.layout);
const controls: Controls = {
  scanTag,
  scanPoint,
  cell: { row: cellRow, col: cellCol, answers: cellAnswers },
  vector: { vector: vecIndex, col: vecCol, answers: vectorAnswers },
};

// ---- PIR round trip with the GPU as the server ----

const roundTrip: { table: string; records: number; mismatches: number }[] = [];
for (const t of tables) {
  const h = gpuMultiply.get(`${t.name}-setup`)!.answers;
  const answers = gpuMultiply.get(`${t.name}-answer`)!.answers;
  const setup: Matrix = { rows: t.grid.rows, cols: LWE_N, cells: new Int32Array(h.buffer, h.byteOffset, h.length) };
  const decoded = await decodeAnswers(setup, t.batch, answers);
  let records = 0;
  let mismatches = 0;
  t.columns.forEach((column, v) => {
    columnRecords(t.grid, decoded[v]!).forEach((rec, slot) => {
      records++;
      if (compareBytes(rec, readRecord(t.grid, column, slot)).differing !== 0) mismatches++;
    });
  });
  roundTrip.push({ table: t.name, records, mismatches });
}

// ---- CPU reference (Node) ----

console.log(`CPU reference under Node (${threads} threads)…`);
t0 = performance.now();
const node = await new Deno.Command("node", {
  args: [here("./cpu-reference.ts"), work],
  stdout: "inherit",
  stderr: "inherit",
}).output();
const cpuWallMs = performance.now() - t0;
if (!node.success) {
  console.error(`the CPU reference failed (exit ${node.code})`);
  Deno.exit(1);
}
const cpu = readJson<CpuReport>(work, "cpu.json");

// ---- Comparisons ----

for (const s of scanSets) {
  const g = gpuScan.get(s.name)!;
  const id = `scan-${s.name}`;
  const cpuValues = readBytes(work, outputs.scanValues(id));
  const cpuHits = readJson<number[]>(work, outputs.scanHits(id));
  const v = compareBytes(g.values, cpuValues);
  record(
    `scan ${s.name}: GPU scanValues = CPU ScanPool.scanValues`,
    v.equal,
    v.equal ? `${s.entries.length / ENTRY_BYTES} entries, ${g.values.length} bytes equal` : `${v.differing} bytes differ, first at byte ${v.first}`,
  );
  const hitsEqual = JSON.stringify(g.hits) === JSON.stringify(cpuHits);
  record(`scan ${s.name}: GPU scan = CPU ScanPool.scan`, hitsEqual, `GPU ${g.hits.length} hits, CPU ${cpuHits.length} hits`);
}
{
  const g = gpuScan.get("vectors")!;
  const v = compareBytes(g.values, fixtures.pads);
  record("scan vectors: GPU values = the ledger's (pads.bin)", v.equal, v.equal ? "16,384 values equal" : `${v.differing} bytes differ`);
  const want = [...fixtures.mine].flatMap((m, i) => (m ? [i] : []));
  record("scan vectors: GPU hits = the ledger's (mine.bin)", JSON.stringify(g.hits) === JSON.stringify(want), `${g.hits.length} of ${want.length}`);
}
for (const c of cases) {
  const g = gpuMultiply.get(c.id)!;
  const cpuAnswers = new Uint8Array(readBytes(work, outputs.answers(c.id)));
  const pinned = compareBytes(bytesOf(g.answers), cpuAnswers);
  const unpinned = compareBytes(bytesOf(g.unpinned), cpuAnswers);
  const ok = pinned.equal && unpinned.equal;
  record(
    `multiply ${c.id}: GPU = CPU WorkerMultiplier`,
    ok,
    ok ? `${c.what}; ${cpuAnswers.length} bytes equal${c.pinned ? " (pinned and unpinned)" : ""}` : `pinned ${pinned.differing}, unpinned ${unpinned.differing} bytes differ`,
  );
}
for (const m of cpu.multiplies) {
  if (m.inlineEqualsWorkers === false) record(`multiply ${m.id}: CPU one thread = CPU workers`, false, "the CPU's own two paths differ");
}

// Negative controls against the CPU's outputs of the unchanged inputs.
{
  const cpuHits = readJson<number[]>(work, outputs.scanHits("scan-preprod"));
  const cpuValues = readBytes(work, outputs.scanValues("scan-preprod"));
  if (controls.scanTag) {
    const { position, hits } = controls.scanTag;
    const missing = cpuHits.filter((h) => !hits.includes(h));
    const extra = hits.filter((h) => !cpuHits.includes(h));
    const ok = JSON.stringify(hits) !== JSON.stringify(cpuHits) && missing.length === 1 && missing[0] === position && extra.length === 0;
    record("negative control, scan: one tag bit changed in a hit", ok, `GPU hits differ from the CPU's for the original: lost ${JSON.stringify(missing)}, gained ${JSON.stringify(extra)}`);
  } else {
    record("negative control, scan: one tag bit changed in a hit", false, "the set has no hit");
  }
  if (controls.scanPoint) {
    const { position, values } = controls.scanPoint;
    const differingEntries: number[] = [];
    for (let i = 0; i < values.length / 32; i++) {
      if (compareBytes(values.subarray(i * 32, i * 32 + 32), cpuValues.subarray(i * 32, i * 32 + 32)).differing) differingEntries.push(i);
    }
    const ok = differingEntries.length === 1 && differingEntries[0] === position;
    record("negative control, scan: one point byte changed", ok, `entries whose value differs from the CPU's for the original: ${JSON.stringify(differingEntries)} (changed ${position})`);
  }
  const cpuRead = new Uint32Array(readBytes(work, outputs.answers("read-answer")).slice().buffer);
  const rows = read.rows;
  const rowsHit = new Set<number>();
  let words = 0;
  controls.cell.answers.forEach((x, i) => {
    if (x !== cpuRead[i]) {
      words++;
      rowsHit.add(i % rows);
    }
  });
  record(
    "negative control, multiply: one grid cell changed",
    words > 0 && rowsHit.size === 1 && rowsHit.has(controls.cell.row),
    `${words} answer values differ from the CPU's for the original, all in row(s) ${JSON.stringify([...rowsHit])} (changed row ${controls.cell.row})`,
  );
  const vectorsHit = new Set<number>();
  words = 0;
  controls.vector.answers.forEach((x, i) => {
    if (x !== cpuRead[i]) {
      words++;
      vectorsHit.add(Math.floor(i / rows));
    }
  });
  record(
    "negative control, multiply: one query value changed",
    words > 0 && vectorsHit.size === 1 && vectorsHit.has(controls.vector.vector),
    `${words} answer values differ, all in vector(s) ${JSON.stringify([...vectorsHit])} (changed vector ${controls.vector.vector})`,
  );
}
for (const r of roundTrip) {
  record(`PIR round trip, ${r.table} table, GPU answers and setup`, r.mismatches === 0 && r.records > 0, `${r.records} records decoded, ${r.mismatches} differ from the table`);
}
if (lost) record("GPU device", false, `lost: ${lost}`);

// ---- Timings ----

const scanTimings = scanSets.map((s) => {
  const g = gpuScan.get(s.name)!.timing;
  const c = cpu.scans.find((x) => x.id === `scan-${s.name}`)!;
  const n = s.entries.length / ENTRY_BYTES;
  const gpuBest = best(g.valuesMs);
  return {
    set: s.name,
    entries: n,
    composition: s.composition,
    gpu: {
      firstCallMs: g.firstValuesMs,
      scanValuesMs: g.valuesMs,
      scanMs: g.scanMs,
      bestUsPerEntry: (gpuBest * 1000) / n,
      executionScanValuesMs: g.valuesGpuMs,
      executionScanMs: g.scanGpuMs,
      executionUsPerEntry: measured(g.valuesGpuMs) ? (median(measured(g.valuesGpuMs)!) * 1000) / n : null,
    },
    cpu: {
      threads: c.threads,
      poolScanValuesMs: c.poolValuesMs,
      poolScanMs: c.poolScanMs,
      poolUsPerEntry: (c.poolValuesMs * 1000) / n,
      singleThreadUsPerEntry: (c.singleThreadMs * 1000) / c.singleThreadSample,
      singleThreadSample: c.singleThreadSample,
    },
    speedupOverPool: c.poolValuesMs / gpuBest,
    speedupOverOneThread: ((c.singleThreadMs / c.singleThreadSample) * n) / gpuBest,
  };
});
const multiplyTimings = cases
  .filter((c) => !c.id.startsWith("odd-"))
  .map((c) => {
    const g = gpuMultiply.get(c.id)!.timing;
    const m = cpu.multiplies.find((x) => x.id === c.id)!;
    const gpuBest = g.pinnedMs.length ? best(g.pinnedMs) : best(g.unpinnedMs);
    const macs = c.matrix.rows * c.matrix.cols * c.count;
    return {
      id: c.id,
      what: c.what,
      rows: c.matrix.rows,
      cols: c.matrix.cols,
      vectors: c.count,
      layout: c.layout,
      multiplyAdds: macs,
      gpu: {
        unpinnedMs: g.unpinnedMs,
        pinMs: g.pinMs,
        pinnedMs: g.pinnedMs,
        bestMs: gpuBest,
        executionMs: g.gpuMs,
        executionMedianMs: measured(g.gpuMs) ? median(measured(g.gpuMs)!) : null,
        executionGMultiplyAddsPerSecond: measured(g.gpuMs) ? macs / median(measured(g.gpuMs)!) / 1e6 : null,
        concurrent: g.concurrent,
      },
      cpu: {
        threads: m.threads,
        workerMs: m.workerMs,
        workerBestMs: best(m.workerMs),
        workerMedianMs: median(m.workerMs),
        singleThreadMs: m.singleThreadMs,
        singleThreadMedianMs: m.singleThreadMs.length ? median(m.singleThreadMs) : null,
      },
      speedupOverWorkers: median(m.workerMs) / gpuBest,
      speedupOverOneThread: m.singleThreadMs.length ? median(m.singleThreadMs) / gpuBest : null,
    };
  });

const ok = checks.every((c) => c.ok);
const results = {
  date: new Date().toISOString(),
  ok,
  environment: {
    gpu: gpu.description,
    deno: Deno.version.deno,
    node: cpu.node,
    cpus: cpu.cpus,
    cpuThreads: threads,
    loadAverage: { before: loadBefore, cpuBefore: cpu.loadBefore, cpuAfter: cpu.loadAfter, after: loadavg() },
    quick,
  },
  notes: [
    "GPU times are wall-clock from the call to the result in host memory (upload of the call's input, dispatches, read-back); 'pinned' means the matrix was copied to the GPU once before (GpuMultiplier.pin), as a server does with its tables.",
    "Deno's WebGPU answers every await on the GPU after a floor of about 12 ms even with no work (setup.denoRoundTripFloorMs); each call pays it once per read-back. 'execution' times are the GPU's own, from timestamp queries around the call's dispatches (null where Deno 2.7.5 on Apple silicon left the end timestamp of a short pass unwritten); 'concurrent' is 16 pinned calls in flight together, which share the floor.",
    "CPU times come from Node (cpu-reference.ts): ScanPool after one warm-up call and WorkerMultiplier after three (one for the 1,024-vector setup), with the given threads, and one thread (Kernel.scanValues on a sample, inlineMultiplier).",
    "On this shared machine the CPU worker multiply is bimodal: the same call takes either about its best time or several times longer (a worker held back by the load), so both the best and the median are given.",
    "The machine was shared with a running Preprod sync; see the load averages.",
  ],
  setup: { scannerCreateMs, multiplierCreateMs, cpuReferenceWallMs: cpuWallMs, denoRoundTripFloorMs: floorMs },
  tables: {
    read: { rows: read.rows, cols: read.cols, records: read.records, recordBytes: read.recordBytes, perColumn: read.perColumn },
    nullifier: {
      rows: nullifier.grid.rows,
      cols: nullifier.grid.cols,
      records: nullifier.grid.records,
      bucketBits: nullifier.bucketBits,
      capacity: nullifier.capacity,
    },
  },
  checks,
  scan: scanTimings,
  multiply: multiplyTimings,
};

console.log("\nscan (µs per entry): GPU wall best | GPU execution | CPU pool | CPU one thread");
for (const s of scanTimings) {
  console.log(
    `  ${s.set} (${s.entries}): ${s.gpu.bestUsPerEntry.toFixed(2)} | ${s.gpu.executionUsPerEntry?.toFixed(2) ?? "—"} | ${s.cpu.poolUsPerEntry.toFixed(2)} (${s.cpu.threads} threads) | ${s.cpu.singleThreadUsPerEntry.toFixed(1)}`,
  );
}
console.log("multiply: GPU wall best (pinned) | GPU execution | GPU 16 concurrent, per call | CPU workers best / median | CPU one thread median");
for (const m of multiplyTimings) {
  console.log(
    `  ${m.id}: ${fmt(m.gpu.bestMs)} | ${m.gpu.executionMedianMs === null ? "—" : fmt(m.gpu.executionMedianMs)} | ${m.gpu.concurrent ? fmt(m.gpu.concurrent.perCallMs) : "—"} | ${fmt(m.cpu.workerBestMs)} / ${fmt(m.cpu.workerMedianMs)} | ${m.cpu.singleThreadMedianMs === null ? "—" : fmt(m.cpu.singleThreadMedianMs)}`,
  );
}

if (outPath) {
  await Deno.mkdir(dirname(outPath), { recursive: true });
  await Deno.writeTextFile(outPath, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`results: ${outPath}`);
}
await scanner.close();
await multiplier.close();
device.destroy();
if (!keep && !option("--work")) await Deno.remove(work, { recursive: true });
console.log(ok ? `all ${checks.length} checks passed` : `${checks.filter((c) => !c.ok).length} of ${checks.length} checks FAILED`);
Deno.exit(ok ? 0 : 1);
