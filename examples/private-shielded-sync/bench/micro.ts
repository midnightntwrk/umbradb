/**
 * Micro-benchmarks of the PIR library and the scan kernel (plan task C8). Writes one JSON file.
 *
 *   node examples/private-shielded-sync/bench/micro.ts [--out <file>] [--records 10000,100000,1000000]
 *        [--sizes 704,40] [--threads <server threads>] [--scan-threads 1,2,4,8,15] [--quick]
 *
 * - Scan: the 16,384 test-vector entries per thread count; µs per entry (wall time × threads / entries) and effective
 *   µs per entry (wall time / entries).
 * - PIR, for each record count and record size: build the grid, its digest, the setup data H (worker threads), the
 *   server's answer to 1 and to 32 vectors (worker threads), and the client's query build and answer decode for 1 and
 *   32 queries on one thread (as a wallet would) and on worker threads. Every decoded record is checked against a
 *   direct read. Times are the best of a few runs; setup is run once. The multiply workers are warmed first (their
 *   first call pays the JIT's compilation, recorded as `workerWarmUpMs`).
 *
 * Records are generated from their index (not stored), so a table of a million 704-byte records needs only its grid
 * (2 bytes per cell) in memory.
 */

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism, cpus, loadavg, platform, release, totalmem } from "node:os";
import { dirname } from "node:path";
import { parseArgs } from "node:util";
import { committedKernelDigest, compileKernel, KERNEL_PATH, ScanPool } from "../kernel/index.ts";
import {
  answerQueries,
  buildPositionalGrid,
  buildQueries,
  buildSetup,
  columnRecords,
  decodeAnswers,
  deriveSeed,
  gridDigest,
  inlineMultiplier,
  type Multiplier,
  positionOf,
  setupMatrix,
  setupBytes,
  WorkerMultiplier,
} from "../pir/index.ts";
import { CALL_HEADER_BYTES } from "../shared/index.ts";

const { values: args } = parseArgs({
  options: {
    out: { type: "string" },
    records: { type: "string", default: "10000,100000,1000000" },
    sizes: { type: "string", default: "704,40" },
    threads: { type: "string" },
    "scan-threads": { type: "string" },
    quick: { type: "boolean", default: false },
  },
});

const list = (s: string) => s.split(",").map((x) => Number(x.trim()));
const serverThreads = Number(args.threads ?? Math.max(1, availableParallelism() - 1));
const recordCounts = args.quick ? [10_000] : list(args.records!);
const recordSizes = list(args.sizes!);
const scanThreads = args["scan-threads"] ? list(args["scan-threads"]) : [1, 2, 4, 8, serverThreads].filter((t, i, a) => a.indexOf(t) === i);
const today = new Date().toISOString().slice(0, 10);
const out = args.out ?? new URL(`./results/micro-${today}.json`, import.meta.url).pathname;

const ms = (t0: number) => Math.round((performance.now() - t0) * 100) / 100;
async function best<T>(runs: number, f: () => Promise<T> | T): Promise<{ ms: number; value: T }> {
  let bestMs = Infinity;
  let value!: T;
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    value = await f();
    bestMs = Math.min(bestMs, ms(t0));
  }
  return { ms: bestMs, value };
}
const log = (...a: unknown[]) => console.error(new Date().toISOString().slice(11, 19), ...a);

/** Record `i` of a table: xorshift bytes seeded by the index and the size. */
function record(i: number, size: number): Uint8Array {
  const b = new Uint8Array(size);
  let x = (i * 2654435761 + size * 40503 + 1) | 0 || 1;
  for (let k = 0; k < size; k++) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    b[k] = x & 0xff;
  }
  return b;
}

function equal(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

async function benchScan() {
  const fixtures = new URL("../test/fixtures/", import.meta.url);
  const entries = new Uint8Array(readFileSync(new URL("entries.bin", fixtures)));
  const secret = new Uint8Array(readFileSync(new URL("scalar.bin", fixtures)));
  const expected = [...readFileSync(new URL("mine.bin", fixtures))].flatMap((m, i) => (m ? [i] : []));
  const count = entries.length / 36;
  const module = compileKernel();
  const rows = [];
  for (const threads of scanThreads) {
    const pool = new ScanPool({ module, threads });
    try {
      await pool.scan(entries.subarray(0, 36 * 64 * threads), secret); // warm every worker
      const r = await best(2, () => pool.scan(entries, secret));
      if (JSON.stringify(r.value) !== JSON.stringify(expected)) throw new Error("scan result differs from the vectors");
      const row = {
        threads,
        entries: count,
        ms: r.ms,
        microsPerEntryPerThread: Math.round(((r.ms * 1000 * threads) / count) * 10) / 10,
        effectiveMicrosPerEntry: Math.round(((r.ms * 1000) / count) * 100) / 100,
        projectedSecondsPerMillion: Math.round((r.ms / count) * 1e6) / 1000,
      };
      log("scan", row);
      rows.push(row);
    } finally {
      await pool.close();
    }
  }
  return rows;
}

async function benchPir(count: number, size: number, workers: Multiplier) {
  log(`pir: ${count} records of ${size} bytes`);
  let t0 = performance.now();
  const grid = buildPositionalGrid(count, size, (i) => record(i, size));
  const buildGridMs = ms(t0);
  t0 = performance.now();
  const digest = gridDigest(grid);
  const digestMs = ms(t0);
  const seed = deriveSeed("read", digest);
  t0 = performance.now();
  const h = await buildSetup(grid, seed, workers);
  const setupMs = ms(t0);
  log(`  grid ${grid.rows}×${grid.cols} in ${buildGridMs} ms, digest ${digestMs} ms, setup ${setupMs} ms`);
  const setup = setupMatrix(setupBytes(h), grid.rows);
  const info = { ...grid, seed };
  // Columns to read: spread over the table.
  const indices = Array.from({ length: 32 }, (_, k) => Math.floor(((k + 0.5) * count) / 32) % Math.max(1, count));
  const columns = indices.map((i) => positionOf(i, grid.perColumn).column);
  const runs = count >= 1_000_000 ? 2 : 3;

  const timings: Record<string, number> = { buildGridMs, digestMs, setupMs };
  for (const n of [1, 32]) {
    const cols = columns.slice(0, n);
    const build1 = await best(runs, () => buildQueries(info, cols, inlineMultiplier));
    const buildW = await best(runs, () => buildQueries(info, cols, workers));
    const answer = await best(runs, () => answerQueries(grid, build1.value.queries, n, workers));
    const decode1 = await best(runs, () => decodeAnswers(setup, build1.value, answer.value, inlineMultiplier));
    const decodeW = await best(runs, () => decodeAnswers(setup, build1.value, answer.value, workers));
    // Every decoded record equals the direct one.
    cols.forEach((_, v) => {
      const i = indices[v]!;
      const got = columnRecords(grid, decode1.value[v]!)[positionOf(i, grid.perColumn).slot]!;
      if (count > 0 && !equal(got, record(i, size))) throw new Error(`PIR read of ${i} differs from the direct read`);
    });
    Object.assign(timings, {
      [`serverAnswer${n}Ms`]: answer.ms,
      [`clientBuild${n}OneThreadMs`]: build1.ms,
      [`clientBuild${n}WorkersMs`]: buildW.ms,
      [`clientDecode${n}OneThreadMs`]: decode1.ms,
      [`clientDecode${n}WorkersMs`]: decodeW.ms,
    });
    log(`  ${n} vector(s): answer ${answer.ms} ms; client build ${build1.ms}/${buildW.ms} ms, decode ${decode1.ms}/${decodeW.ms} ms (1 thread / workers)`);
  }
  const memory = process.memoryUsage();
  return {
    records: count,
    recordBytes: size,
    grid: { rows: grid.rows, cols: grid.cols, perColumn: grid.perColumn, cellsPerRecord: grid.cellsPerRecord },
    bytes: {
      tableFile: 32 + grid.cells.byteLength,
      setup: h.byteLength,
      publicMatrixA: grid.cols * 1024 * 4,
      queryBody32: CALL_HEADER_BYTES + 32 * grid.cols * 4,
      answerBody32: CALL_HEADER_BYTES + 32 * grid.rows * 4,
      rawRecords: count * size,
    },
    timings,
    memoryAfter: { rss: memory.rss, arrayBuffers: memory.arrayBuffers },
    check: "every decoded record equals the direct read",
  };
}

const started = { time: new Date().toISOString(), loadavg: loadavg() };
log(`server threads ${serverThreads}; scan threads ${scanThreads.join(",")}; records ${recordCounts.join(",")} × ${recordSizes.join(",")} bytes`);
/** Runs both multiply loops on every worker until the JIT has compiled them (about 0.6 s cold on 15 threads). */
async function warm(workers: Multiplier) {
  const t0 = performance.now();
  const rows = 4 * 4 * serverThreads;
  const cols = 8192;
  const vec = new Uint32Array(32 * cols).fill(7);
  for (let k = 0; k < 3; k++) {
    await workers.multiply({ rows, cols, cells: new Int16Array(rows * cols).fill(3) }, vec, 32);
    await workers.multiply({ rows, cols, cells: new Int32Array(rows * cols).fill(3) }, vec, 32);
  }
  return ms(t0);
}

const scan = await benchScan();
const workers = new WorkerMultiplier(serverThreads);
const warmUpMs = await warm(workers);
log(`multiply workers warmed in ${warmUpMs} ms`);
const pir = [];
try {
  for (const size of recordSizes) for (const count of recordCounts) pir.push(await benchPir(count, size, workers));
} finally {
  await workers.close();
}
const result = {
  kind: "private-shielded-sync micro-benchmarks",
  started,
  finished: { time: new Date().toISOString(), loadavg: loadavg() },
  machine: {
    cpu: cpus()[0]?.model,
    cores: availableParallelism(),
    memoryBytes: totalmem(),
    platform: `${platform()} ${release()}`,
    node: process.version,
  },
  kernel: {
    digest: committedKernelDigest(),
    bytes: readFileSync(KERNEL_PATH).length,
    sha256Checked: createHash("sha256").update(readFileSync(KERNEL_PATH)).digest("hex") === committedKernelDigest(),
  },
  serverThreads,
  workerWarmUpMs: warmUpMs,
  scan,
  pir,
};
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
log(`wrote ${out}`);
