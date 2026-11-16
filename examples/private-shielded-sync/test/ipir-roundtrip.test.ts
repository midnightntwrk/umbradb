/**
 * IPIR+SP end to end through the two pieces the example runs: the native add-on builds a table and answers calls
 * (`ipir/native.ts`), the wallet's WebAssembly makes the requests and decodes the answers (`ipir/wallet.ts`).
 *
 * Needs the add-on, which is built for this machine and not committed: `examples/private-shielded-sync/ipir/build.sh
 * native`. Without it the tests fail with that instruction rather than being skipped.
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  buildIpirTable,
  IPIR_PHASE_LIMIT_LOG2,
  ipirMasksBytes,
  ipirRequestBytes,
  ipirResponseBytes,
  ipirSizes,
  loadIpirAddon,
  type IpirAddon,
  type IpirBuiltTable,
  IpirServerTable,
} from "../ipir/native.ts";
import { IpirWallet, type IpirTableClient } from "../ipir/wallet.ts";
import { committedIpirWasmDigest, compileIpirWasm, IPIR_WASM_PATH } from "../ipir/wallet-node.ts";

const SEED = new Uint8Array(32).fill(11);
const SNAPSHOT = new Uint8Array(32).fill(12);
const SCRATCH = fileURLToPath(new URL("../ipir/target/vitest-ipir-roundtrip/", import.meta.url));

/** Deterministic pseudo-random cells (xorshift32), column-major. */
function randomCells(rows: number, cols: number, seed: number): Uint16Array {
  const cells = new Uint16Array(rows * cols);
  let x = seed >>> 0 || 1;
  for (let i = 0; i < cells.length; i++) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    cells[i] = x & 0xffff;
  }
  return cells;
}

function rowOf(cells: Uint16Array, rows: number, cols: number, row: number): Uint16Array {
  const out = new Uint16Array(cols);
  for (let col = 0; col < cols; col++) out[col] = cells[col * rows + row]!;
  return out;
}

function concat(parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

let addon: IpirAddon;
let wallet: IpirWallet;
const built: IpirBuiltTable[] = [];

beforeAll(() => {
  addon = loadIpirAddon();
  wallet = new IpirWallet(compileIpirWasm());
  mkdirSync(SCRATCH, { recursive: true });
});

afterAll(() => {
  for (const { table } of built) table.release();
  rmSync(SCRATCH, { recursive: true, force: true });
});

async function build(cells: Uint16Array | string, rows: number, cols: number, snapshot = SNAPSHOT): Promise<IpirBuiltTable> {
  const result = await buildIpirTable({ cells, rows, cols, seed: SEED, snapshot });
  built.push(result);
  return result;
}

function open(rows: number, cols: number, masks: Uint8Array, snapshot = SNAPSHOT): IpirTableClient {
  return wallet.openTable({ rows, cols, seed: SEED, snapshot, masks });
}

describe("sizes", () => {
  it("are the profile's formulas, in TypeScript, in the add-on and in the WebAssembly", () => {
    for (const [rows, cols] of [
      [2048, 2048],
      [4096, 6144],
      [32_768, 12_288],
      [2048, 32_768],
    ] as const) {
      const sizes = ipirSizes(rows, cols);
      expect(sizes).toEqual({
        requestBytes: 36 + 27_648 + (49 * rows) / 8,
        responseBytes: 68 + (22 * cols) / 8,
        masksBytes: 36 + (58 * cols) / 8,
        tableBytes: 2 * rows * cols,
      });
      const { tableBytes: _, ...wire } = sizes;
      expect(addon.sizes(rows, cols)).toEqual(wire);
      expect(wallet.moduleSizes(rows, cols)).toEqual(wire);
    }
    expect(ipirSizes(32_768, 12_288)).toMatchObject({ requestBytes: 228_388, responseBytes: 33_860, masksBytes: 89_124 });
    expect(() => ipirSizes(2048, 1000)).toThrow(/multiples of 2048/);
    expect(() => ipirSizes(65_536, 32_768)).toThrow(/2\^30 cells/);
    // At most 32,768 rows (review F4), in TypeScript, in the add-on and in the WebAssembly's setup.
    expect(() => ipirSizes(34_816, 2048)).toThrow(/at most 32768 rows/);
    expect(() => addon.sizes(34_816, 2048)).toThrow(/at most 32768 rows/);
    expect(addon.profile().maxRows).toBe(32_768);
    expect(() => addon.sizes(2048, 1000)).toThrow(/multiples of 2048/);
  });

  it("the WebAssembly is the committed one", () => {
    expect(committedIpirWasmDigest()).toMatch(/^[0-9a-f]{64}$/);
    expect(() => compileIpirWasm({ expectedDigest: "0".repeat(64) })).toThrow(/digest/);
    expect(IPIR_WASM_PATH.endsWith("pss-ipir.wasm")).toBe(true);
  });
});

describe.each([
  [2048, 2048, "cells"],
  [4096, 6144, "file"],
] as const)("a %i × %i table built from %s", (rows, cols, source) => {
  const cells = randomCells(rows, cols, rows ^ cols);
  let table: IpirBuiltTable;

  beforeAll(async () => {
    let input: Uint16Array | string = cells;
    if (source === "file") {
      input = `${SCRATCH}cells-${rows}x${cols}.bin`;
      writeFileSync(input, new Uint8Array(cells.buffer, cells.byteOffset, cells.byteLength));
    }
    // The build runs on the thread pool: timers keep firing on the main thread while it runs.
    let ticks = 0;
    const timer = setInterval(() => ticks++, 5);
    table = await build(input, rows, cols);
    clearInterval(timer);
    expect(ticks).toBeGreaterThan(5);
  }, 120_000);

  it("reports the build, with sampled rows that decode", () => {
    const { report, masks } = table;
    expect(report.rows).toBe(rows);
    expect(report.cols).toBe(cols);
    expect(report.tableBytes).toBe(2 * rows * cols);
    expect(report.masksBytes).toBe(masks.length);
    expect(report.checkedRows).toHaveLength(3);
    expect(report.checkedRows[0]).toBe(0);
    expect(report.checkedRows[2]).toBe(rows - 1);
    expect(report.phaseLimitLog2).toBe(IPIR_PHASE_LIMIT_LOG2);
    expect(report.maxPhaseError).toBeGreaterThan(0);
    expect(report.maxPhaseErrorLog2).toBeLessThan(IPIR_PHASE_LIMIT_LOG2);
    expect(report.totalMs).toBeGreaterThan(report.checkMs);
    console.log(
      `${rows} × ${cols} from ${source}: build ${report.totalMs.toFixed(0)} ms (read ${report.readMs.toFixed(1)}, ` +
        `setup ${report.setupMs.toFixed(1)}, prepare ${report.prepareMs.toFixed(0)}, check ${report.checkMs.toFixed(0)}), ` +
        `packing ${report.packingBytes} bytes, phase error 2^${report.maxPhaseErrorLog2.toFixed(2)}`,
    );
  });

  it("answers 3 requests in one call, each decoding to its row", async () => {
    expect(table.masks.length).toBe(ipirMasksBytes(cols));
    const client = open(rows, cols, table.masks);
    const wanted = [5, rows / 2 + 1, rows - 1];
    let t = performance.now();
    const requests = wanted.map((row) => client.request(row));
    const requestMs = (performance.now() - t) / wanted.length;
    for (const { bytes } of requests) expect(bytes.length).toBe(ipirRequestBytes(rows));
    t = performance.now();
    const answers = await table.table.respond(concat(requests.map((r) => r.bytes)), wanted.length);
    const respondMs = performance.now() - t;
    const each = ipirResponseBytes(cols);
    expect(answers.length).toBe(wanted.length * each);
    t = performance.now();
    const decoded = requests.map(({ state }, i) => client.decode(state, answers.subarray(i * each, (i + 1) * each)));
    const decodeMs = (performance.now() - t) / wanted.length;
    wanted.forEach((row, i) => expect(decoded[i]).toEqual(rowOf(cells, rows, cols, row)));
    console.log(
      `${rows} × ${cols}: request ${requestMs.toFixed(1)} ms each (${ipirRequestBytes(rows)} bytes), ` +
        `call of 3 answered in ${respondMs.toFixed(1)} ms (${each} bytes each), decode ${decodeMs.toFixed(2)} ms each`,
    );
    for (const { state } of requests) state.free();
    client.free();
  });
});

describe("a 2,048 × 2,048 table", () => {
  const rows = 2048;
  const cols = 2048;
  const cells = randomCells(rows, cols, 99);
  let table: IpirBuiltTable;

  beforeAll(async () => {
    table = await build(cells, rows, cols);
  }, 60_000);

  it("has the same masks and report when built again from the same input", async () => {
    const again = await build(cells, rows, cols);
    expect(Buffer.from(again.masks).equals(Buffer.from(table.masks))).toBe(true);
    expect(again.report.checkedRows).toEqual(table.report.checkedRows);
    expect(again.report.maxPhaseError).toBe(table.report.maxPhaseError);
    const other = await build(cells, rows, cols, new Uint8Array(32).fill(13));
    expect(Buffer.from(other.masks).equals(Buffer.from(table.masks))).toBe(false);
    expect(() => open(rows, cols, table.masks, new Uint8Array(32).fill(13))).toThrow(/cannot open the IPIR\+SP table/);
  }, 60_000);

  it("rejects a request of the wrong length before any work", async () => {
    const client = open(rows, cols, table.masks);
    const { bytes, state } = client.request(1);
    await expect(table.table.respond(bytes.subarray(1), 1)).rejects.toThrow(/are 40228 bytes, got 40227/);
    await expect(table.table.respond(bytes, 2)).rejects.toThrow(/2 requests to this table are 80456 bytes/);
    await expect(table.table.respond(bytes, 0)).rejects.toThrow(/at least one request/);
    const foreign = bytes.slice();
    foreign[10]! ^= 1;
    await expect(table.table.respond(foreign, 1)).rejects.toThrow(/request\/profile\/setup mismatch/);
    const answer = await table.table.respond(bytes, 1);
    expect(client.decode(state, answer)).toEqual(rowOf(cells, rows, cols, 1));
    client.free();
  });

  it("gives every request a fresh secret, and decodes only its own answer", async () => {
    const client = open(rows, cols, table.masks);
    const a = client.request(42);
    const b = client.request(42);
    expect(Buffer.from(a.bytes.subarray(0, 36)).equals(Buffer.from(b.bytes.subarray(0, 36)))).toBe(true);
    expect(Buffer.from(a.bytes.subarray(36)).equals(Buffer.from(b.bytes.subarray(36)))).toBe(false);
    const answerA = await table.table.respond(a.bytes, 1);
    expect(() => client.decode(b.state, answerA)).toThrow(/cannot decode the IPIR\+SP answer/);
    expect(() => client.decode(a.state, answerA.subarray(1))).toThrow(/is 5700 bytes, got 5699/);
    expect(client.decode(a.state, answerA)).toEqual(rowOf(cells, rows, cols, 42));
    a.state.free();
    a.state.free();
    expect(() => client.decode(a.state, answerA)).toThrow(/freed/);
    const second = open(rows, cols, table.masks);
    expect(() => second.decode(b.state, answerA)).toThrow(/not made by this table client/);
    second.free();
    expect(() => client.request(rows)).toThrow(/outside a table/);
    expect(() => open(rows, cols, table.masks.subarray(1))).toThrow(/masks are 14884 bytes/);
    client.free();
    expect(() => client.request(0)).toThrow(/freed/);
  });

  it("checks lengths and handles in the add-on itself, and refuses a released table", async () => {
    const raw = await addon.buildTableFromCells(cells, rows, cols, SEED, SNAPSHOT);
    const client = open(rows, cols, raw.masks);
    const { bytes, state } = client.request(0);
    await expect(addon.respond(raw.handle, bytes.subarray(1), 1)).rejects.toThrow(/are 40228 bytes, got 40227/);
    await expect(addon.respond(raw.handle, bytes, 0)).rejects.toThrow(/at least one request/);
    const wrapped = new IpirServerTable(addon, raw.handle, rows, cols);
    const before = addon.tableCount();
    expect(client.decode(state, await wrapped.respond(bytes, 1))).toEqual(rowOf(cells, rows, cols, 0));
    wrapped.release();
    wrapped.release();
    expect(wrapped.released).toBe(true);
    expect(addon.tableCount()).toBe(before - 1);
    expect(addon.release(raw.handle)).toBe(false);
    await expect(wrapped.respond(bytes, 1)).rejects.toThrow(/released/);
    expect(() => addon.respond(raw.handle, bytes, 1)).toThrow(/no IPIR\+SP table has handle/);
    client.free();
  }, 60_000);
});
