/**
 * The IPIR+SP GPU kernels in a browser page (bundled and served by `ipir-browser.ts`): the same `GpuIpirTable` as the
 * Deno check, on a synthetic table (cells from xorshift32, random 32-bit matrices, requests with a fixed setup id and
 * random words: any such words are valid). Times the first pass, the packing and the whole answer for calls of 1 and
 * 32 requests, and checks sampled values of the first pass and the packing against `BigInt` sums (`ipir-wire.ts`).
 * Shapes come from the page's query (`?rows=4096&cols=12288&runs=9`). The result is written as JSON into `#result`
 * and posted to the serving script (`/result`).
 */

import { ipirRequestBytes } from "../ipir/sizes.ts";
import { openGpu } from "./device.ts";
import { GpuIpirTable } from "./ipir.ts";
import { ipirKeyWords, ipirQueryWords, referenceFirstPass, referencePacking } from "./ipir-wire.ts";

/** The two elements the page writes (typed here: this folder is checked without the DOM's types). */
interface PageElement {
  textContent: string | null;
}
const page = (globalThis as unknown as { document: { getElementById(id: string): PageElement | null } }).document;
const out = page.getElementById("result")!;
const status = page.getElementById("status")!;
const say = (s: string) => {
  status.textContent = s;
};

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
const median = (xs: readonly number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2]! : (s[s.length / 2 - 1]! + s[s.length / 2]!) / 2;
};

async function main(): Promise<void> {
  const params = new URLSearchParams((globalThis as unknown as { location: { search: string } }).location.search);
  const rows = Number(params.get("rows") ?? 4096);
  const cols = Number(params.get("cols") ?? 12288);
  const runs = Number(params.get("runs") ?? 9);
  const gpu = await openGpu();
  if (!gpu) throw new Error("no WebGPU adapter in this browser");
  const { device } = gpu;
  say(`building a ${rows} × ${cols} table`);
  const next = xorshift(0x5eed ^ rows ^ cols);
  const cells = new Uint16Array(rows * cols);
  for (let i = 0; i < cells.length; i++) cells[i] = next() & 0xffff;
  const matrices = Array.from({ length: cols / 2048 }, () => {
    const m = new Int32Array(2048 * 4096);
    for (let i = 0; i < m.length; i++) m[i] = (next() % (1 << 26)) - (1 << 25);
    return m;
  });
  const setupId = new Uint8Array(32).map(() => next() & 0xff);
  const each = ipirRequestBytes(rows);
  const requests = new Uint8Array(32 * each).map(() => next() & 0xff);
  for (let i = 0; i < 32; i++) {
    requests.set(new TextEncoder().encode("RNQ3"), i * each);
    requests.set(setupId, i * each + 4);
  }

  say("compiling the kernels");
  let t = performance.now();
  await GpuIpirTable.compileKernels(device);
  const compileMs = performance.now() - t;
  say("uploading the table");
  t = performance.now();
  const table = await GpuIpirTable.create(device, { rows, cols, cells, setupId, matrices }, { timestamps: true });
  const uploadMs = performance.now() - t;

  // Sampled values against BigInt sums.
  say("checking sampled values");
  const first = await table.firstPass(requests, 32);
  const packing = await table.packingProduct(requests, 32);
  let sampled = 0;
  let wrong = 0;
  for (const i of [0, 7, 31]) {
    const request = requests.subarray(i * each, (i + 1) * each);
    const query = ipirQueryWords(request, rows);
    const key = ipirKeyWords(request);
    for (const col of new Set([0, 1, 2047, 2048 % cols, cols - 1])) {
      sampled++;
      if (first[i * cols + col] !== referenceFirstPass(cells, rows, col, query)) wrong++;
      const block = Math.floor(col / 2048);
      sampled++;
      if (packing[i * cols + col] !== referencePacking(matrices[block]!, col % 2048, key)) wrong++;
    }
  }

  const timings: Record<string, unknown> = {};
  for (const count of [1, 32]) {
    const call = requests.subarray(0, count * each);
    const measure = async (f: () => Promise<unknown>, stage: "scan" | "pack" | "total") => {
      await f();
      const wall: number[] = [];
      const exec: number[] = [];
      for (let r = 0; r < runs; r++) {
        table.lastStagesMs = null;
        const t0 = performance.now();
        await f();
        wall.push(performance.now() - t0);
        const e = table.lastStagesMs?.[stage];
        if (e !== null && e !== undefined) exec.push(e);
      }
      return { wallMs: wall, execMs: exec, wallMedianMs: median(wall), execMedianMs: exec.length ? median(exec) : null };
    };
    say(`timing calls of ${count}`);
    timings[String(count)] = {
      firstPass: await measure(() => table.firstPass(call, count), "scan"),
      packing: await measure(() => table.packingProduct(call, count), "pack"),
      answer: await measure(() => table.respond(call, count), "total"),
    };
  }
  table.release();
  const result = {
    userAgent: navigator.userAgent,
    gpu: gpu.description,
    rows,
    cols,
    runs,
    compileMs,
    uploadMs,
    residentBytes: rows * cols * 2 + matrices.length * 2048 * 4096 * 4,
    sampled,
    wrong,
    timings,
  };
  device.destroy();
  out.textContent = JSON.stringify(result);
  // The serving script records it (`--out`).
  await fetch("/result", { method: "POST", body: out.textContent, headers: { "content-type": "application/json" } });
  say(wrong === 0 ? `done: ${sampled} sampled values equal` : `done: ${wrong} of ${sampled} sampled values differ`);
}

main().catch((e: unknown) => {
  out.textContent = JSON.stringify({ error: String((e as Error)?.stack ?? e) });
  say("failed");
});
