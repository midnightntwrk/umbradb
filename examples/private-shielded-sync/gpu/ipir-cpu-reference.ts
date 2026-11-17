/**
 * The CPU side of the IPIR+SP GPU check, run under Node by `ipir-check.ts` for one table:
 *
 *     node examples/private-shielded-sync/gpu/ipir-cpu-reference.ts <work folder>
 *
 * Reads `job.json` (`ipir-jobs.ts`). Builds the table with the native add-on from the cell file, makes one request per
 * wanted row with the wallet's WebAssembly (fresh secrets), answers each call size with `IpirServerTable.respond` (the
 * reference the GPU must equal byte for byte) and times it, decodes the largest call's answers with the wallet and
 * compares them with the table's rows, then exports the public values a GPU responder needs and upstream's unrounded
 * first pass and packing product (`ipirGpuReference`). Writes the outputs and `cpu.json`.
 */

import { availableParallelism, loadavg } from "node:os";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { buildIpirTable, ipirGpuReference, ipirRequestBytes, ipirResponseBytes } from "../ipir/native.ts";
import { IpirWallet, type IpirRequestState } from "../ipir/wallet.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { type IpirCpuReport, type IpirJob, ipirOutputs, type IpirRespondTiming, type IpirStagesMs } from "./ipir-jobs.ts";
import { readJson, writeBytes, writeJson } from "./jobs.ts";

const hex = (s: string) => Uint8Array.from(s.match(/../g)!.map((b) => parseInt(b, 16)));

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

async function main(): Promise<void> {
  const dir = process.argv[2];
  if (!dir) throw new Error("usage: node ipir-cpu-reference.ts <work folder>");
  const job = readJson<IpirJob>(dir, "job.json");
  const loadBefore = loadavg();
  const { rows, cols } = job;
  const seed = hex(job.seed);
  const snapshot = hex(job.snapshot);
  const cellsPath = join(dir, job.cells);

  let t = performance.now();
  const built = await buildIpirTable({ cells: cellsPath, rows, cols, seed, snapshot });
  const buildMs = performance.now() - t;
  writeBytes(dir, ipirOutputs.masks, built.masks);

  // Requests from the wallet, each with a fresh secret.
  const wallet = new IpirWallet(compileIpirWasm());
  t = performance.now();
  const client = wallet.openTable({ rows, cols, seed, snapshot, masks: built.masks });
  const openMs = performance.now() - t;
  const each = ipirRequestBytes(rows);
  const requests = new Uint8Array(job.wantedRows.length * each);
  const states: IpirRequestState[] = [];
  const requestMs: number[] = [];
  job.wantedRows.forEach((row, i) => {
    const t0 = performance.now();
    const { bytes, state } = client.request(row);
    requestMs.push(performance.now() - t0);
    requests.set(bytes, i * each);
    states.push(state);
  });
  writeBytes(dir, ipirOutputs.requests, requests);

  // Answers and their timings, per call size.
  const respond: IpirRespondTiming[] = [];
  let largest: Uint8Array = new Uint8Array(0);
  for (const count of job.counts) {
    const call = requests.subarray(0, count * each);
    let answers: Uint8Array = new Uint8Array(0);
    for (let w = 0; w < job.warmups; w++) answers = await built.table.respond(call, count);
    const respondMs: number[] = [];
    for (let r = 0; r < job.runs; r++) {
      const t0 = performance.now();
      answers = await built.table.respond(call, count);
      respondMs.push(performance.now() - t0);
    }
    const stages: IpirStagesMs[] = [];
    let timedEqual = true;
    for (let r = 0; r < job.runs; r++) {
      const timed = await built.table.respondTimed(call, count);
      timedEqual &&= equalBytes(timed.answers, answers);
      stages.push({
        deserializeMs: timed.stages.reduce((s, x) => s + x.deserializeMs, 0),
        matrixVectorMs: timed.stages.reduce((s, x) => s + x.matrixVectorMs, 0),
        packingMs: timed.stages.reduce((s, x) => s + x.packingMs, 0),
        serializationMs: timed.stages.reduce((s, x) => s + x.serializationMs, 0),
      });
    }
    writeBytes(dir, ipirOutputs.answers(count), answers);
    respond.push({ count, respondMs, stages, timedEqual });
    if (count === Math.max(...job.counts)) largest = answers;
    console.log(`  cpu ${job.id} respond ×${count}: median ${median(respondMs).toFixed(1)} ms`);
  }
  built.table.release();

  // The wallet decodes the largest call's answers; each must be its row.
  const cells = readFileSync(cellsPath);
  const cell = (r: number, c: number) => cells.readUInt16LE(2 * (c * rows + r));
  const answerBytes = ipirResponseBytes(cols);
  const decodeMs: number[] = [];
  const decodedRows = largest.length / answerBytes;
  let decodedWrong = 0;
  for (let i = 0; i < decodedRows; i++) {
    const t0 = performance.now();
    const row = client.decode(states[i]!, largest.subarray(i * answerBytes, (i + 1) * answerBytes));
    decodeMs.push(performance.now() - t0);
    const want = job.wantedRows[i]!;
    let ok = row.length === cols;
    for (let c = 0; ok && c < cols; c++) ok = row[c] === cell(want, c);
    if (!ok) decodedWrong++;
  }
  for (const s of states) s.free();
  client.free();

  // Upstream's preparation repeated: the public values for the GPU, and the unrounded steps of every request.
  t = performance.now();
  const reference = await ipirGpuReference({ cellsPath, rows, cols, seed, snapshot }, requests, job.wantedRows.length, { hints: job.hints });
  const referenceMs = performance.now() - t;
  writeBytes(dir, ipirOutputs.setupId, reference.setupId);
  writeBytes(dir, ipirOutputs.queryMasks, reference.queryMasks);
  writeBytes(dir, ipirOutputs.firstPass, reference.firstPass);
  writeBytes(dir, ipirOutputs.packing, reference.packing);
  let matrixMaxAbs = 0;
  reference.blocks.forEach((b, k) => {
    for (const x of b.matrix) matrixMaxAbs = Math.max(matrixMaxAbs, Math.abs(x));
    writeBytes(dir, ipirOutputs.matrix(k), b.matrix);
    if (b.hints) writeBytes(dir, ipirOutputs.hints(k), b.hints);
  });

  const report: IpirCpuReport = {
    node: process.version,
    cpus: availableParallelism(),
    loadBefore,
    loadAfter: loadavg(),
    build: { ...built.report },
    buildMs,
    referenceMs,
    referenceMasksEqual: equalBytes(reference.masks, built.masks),
    matrixMaxAbs,
    respond,
    wallet: { openMs, requestMs, decodeMs },
    decodedWrong,
    decodedRows,
  };
  writeJson(dir, "cpu.json", report);
}

function median(xs: readonly number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2;
}

await main();
