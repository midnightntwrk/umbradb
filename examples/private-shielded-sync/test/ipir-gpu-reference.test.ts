/**
 * What the GPU responder (`gpu/ipir.ts`) is checked against, checked itself without a GPU: the add-on's
 * `gpuReference` export (`ipir/core/src/gpu.rs`) and the answer arithmetic of `gpu/ipir-wire.ts`.
 *
 * - The public values it repeats (setup id, published masks) equal the ones the real build gives.
 * - Its first pass and packing product equal an independent `BigInt` computation from the cells, the exported
 *   matrix and the request's words, on sampled columns and rows.
 * - First pass plus packing, rounded and packed as `gpu/ipir-wire.ts` does, give exactly the bytes
 *   `IpirServerTable.respond` returns, for every request of a call: the GPU computes the same three steps.
 * - The hint columns equal the product of the cells with the public query masks as `gpu/ipir.ts` lays it out.
 * - `respondTimed` gives `respond`'s answers with upstream's timing of each answer's stages.
 *
 * Needs the add-on (`examples/private-shielded-sync/ipir/build.sh native`); fails without it, as `ipir-roundtrip`.
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  addMod54,
  checkIpirRequests,
  ipirKeyWords,
  ipirQueryWords,
  referenceAnswer,
  referenceFirstPass,
  referencePacking,
} from "../gpu/ipir-wire.ts";
import { buildIpirTable, type IpirBuiltTable, ipirGpuReference, type IpirGpuReference, ipirRequestBytes, ipirResponseBytes } from "../ipir/native.ts";
import { IpirWallet } from "../ipir/wallet.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";

const SEED = new Uint8Array(32).fill(21);
const SNAPSHOT = new Uint8Array(32).fill(22);
const SCRATCH = fileURLToPath(new URL("../ipir/target/vitest-ipir-gpu-reference/", import.meta.url));
const ROWS = 2048;
const COLS = 2048;
const Q = 1n << 54n;

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

let built: IpirBuiltTable;
let reference: IpirGpuReference;
let cells: Uint16Array;
let requests: Uint8Array;
let answers: Uint8Array;
const wanted = [7, 1500, 2047];

beforeAll(async () => {
  mkdirSync(SCRATCH, { recursive: true });
  cells = randomCells(ROWS, COLS, 0x5eed);
  const cellsPath = `${SCRATCH}cells.bin`;
  writeFileSync(cellsPath, cells);
  built = await buildIpirTable({ cells: cellsPath, rows: ROWS, cols: COLS, seed: SEED, snapshot: SNAPSHOT });
  const client = new IpirWallet(compileIpirWasm()).openTable({ rows: ROWS, cols: COLS, seed: SEED, snapshot: SNAPSHOT, masks: built.masks });
  const each = ipirRequestBytes(ROWS);
  requests = new Uint8Array(wanted.length * each);
  wanted.forEach((row, i) => {
    const { bytes, state } = client.request(row);
    requests.set(bytes, i * each);
    state.free();
  });
  client.free();
  answers = await built.table.respond(requests, wanted.length);
  reference = await ipirGpuReference(
    { cellsPath, rows: ROWS, cols: COLS, seed: SEED, snapshot: SNAPSHOT },
    requests,
    wanted.length,
    { hints: true },
  );
}, 60_000);

afterAll(() => {
  built?.table.release();
  rmSync(SCRATCH, { recursive: true, force: true });
});

/** Plain bytes, so that a Node `Buffer` and a `Uint8Array` with the same bytes compare equal. */
const plain = (a: Uint8Array) => Uint8Array.from(a);
const request = (i: number) => requests.subarray(i * ipirRequestBytes(ROWS), (i + 1) * ipirRequestBytes(ROWS));

describe("the add-on's gpuReference export", () => {
  it("repeats the real build's public values", () => {
    expect(plain(reference.setupId)).toEqual(plain(request(0).subarray(4, 36)));
    expect(plain(reference.masks)).toEqual(plain(built.masks));
    expect(reference.queryMasks.length).toBe(ROWS);
    expect(reference.blocks.length).toBe(COLS / 2048);
    expect(reference.blocks[0]!.matrix.length).toBe(2048 * 4096);
    expect(reference.blocks[0]!.hints!.length).toBe(2048 * 2048);
    expect(reference.firstPass.length).toBe(wanted.length * COLS);
    expect(reference.packing.length).toBe(wanted.length * COLS);
    for (const x of reference.queryMasks) expect(x < Q).toBe(true);
  });

  it("gives upstream's first pass, equal to a BigInt sum over the cells", () => {
    for (let i = 0; i < wanted.length; i++) {
      const query = ipirQueryWords(request(i), ROWS);
      for (const col of [0, 1, 2, 777, 1024, 2046, 2047]) {
        expect(reference.firstPass[i * COLS + col]).toBe(referenceFirstPass(cells, ROWS, col, query));
      }
    }
  });

  it("gives the packing product, equal to the exported matrix times the key words in BigInt", () => {
    const matrix = reference.blocks[0]!.matrix;
    let largest = 0;
    for (const x of matrix) largest = Math.max(largest, Math.abs(x));
    // Upstream stores these matrices at 27 or 28 bits on hosts with AVX-512 VBMI.
    expect(largest).toBeLessThan(2 ** 28);
    for (let i = 0; i < wanted.length; i++) {
      const key = ipirKeyWords(request(i));
      for (const row of [0, 1, 300, 2047]) {
        expect(reference.packing[i * COLS + row]).toBe(referencePacking(matrix, row, key));
      }
    }
  });

  it("first pass plus packing, rounded and packed, is IpirServerTable.respond byte for byte", async () => {
    const each = ipirResponseBytes(COLS);
    for (let i = 0; i < wanted.length; i++) {
      const sums = addMod54(
        reference.firstPass.subarray(i * COLS, (i + 1) * COLS),
        reference.packing.subarray(i * COLS, (i + 1) * COLS),
      );
      const answer = await referenceAnswer(reference.setupId, request(i), sums);
      expect(plain(answer)).toEqual(plain(answers.subarray(i * each, (i + 1) * each)));
    }
  });

  it("gives hint columns equal to the cells times the public query masks, negacyclic", () => {
    // Hint of column c, coefficient k: Σ_r cell[r, c] · M[r, k] with M[r, k] = poly_b[k − j] when j ≤ k and
    // −poly_b[k − j + d] otherwise (b = r / d, j = r mod d): the layout gpu/ipir.ts uses.
    const d = 2048;
    const hints = reference.blocks[0]!.hints!;
    const masks = reference.queryMasks;
    for (const col of [0, 1337]) {
      for (const k of [0, 1, 1000, 2047]) {
        let sum = 0n;
        for (let r = 0; r < ROWS; r++) {
          const b = Math.floor(r / d);
          const j = r % d;
          const m = j <= k ? masks[b * d + k - j]! : Q - masks[b * d + k - j + d]!;
          sum += BigInt(cells[col * ROWS + r]!) * m;
        }
        expect(hints[col * d + k]).toBe(sum % Q);
      }
    }
  });

  it("respondTimed gives respond's answers and upstream's stage timing of each", async () => {
    const timed = await built.table.respondTimed(requests, wanted.length);
    expect(plain(timed.answers)).toEqual(plain(answers));
    expect(timed.stages.length).toBe(wanted.length);
    for (const s of timed.stages) {
      for (const ms of [s.deserializeMs, s.matrixVectorMs, s.packingMs, s.serializationMs]) expect(ms).toBeGreaterThanOrEqual(0);
    }
    await expect(built.table.respondTimed(requests.subarray(1), wanted.length)).rejects.toThrow(/bytes, got/);
  });

  it("refuses requests of another setup or length", async () => {
    const foreign = requests.slice(0, ipirRequestBytes(ROWS));
    foreign[10]! ^= 1;
    const input = { cellsPath: `${SCRATCH}cells.bin`, rows: ROWS, cols: COLS, seed: SEED, snapshot: SNAPSHOT };
    await expect(ipirGpuReference(input, foreign, 1)).rejects.toThrow(/not for this table's setup/);
    await expect(ipirGpuReference(input, requests.subarray(1), 1)).rejects.toThrow(/bytes, got/);
    expect(() => checkIpirRequests(foreign, 1, ROWS, reference.setupId)).toThrow(/magic or setup id/);
    expect(() => checkIpirRequests(requests, 2, ROWS, reference.setupId)).toThrow(/bytes, got/);
    expect(() => checkIpirRequests(requests, wanted.length, ROWS, reference.setupId)).not.toThrow();
  });
});
