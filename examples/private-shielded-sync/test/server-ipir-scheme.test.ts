/**
 * IPIR+SP through the scheme seam, in process (spec 00058 FR-010 to FR-015, FR-020 to FR-023, FR-031, the edge
 * cases), with the native add-on and the committed WebAssembly:
 *
 * - from one fixed synthetic index (as `server-scheme.test.ts`: 300 outputs over 10 heights, every 7th without a
 *   ciphertext; 37 nullifiers; k = 2) the builder makes an IPIR+SP snapshot whose three tables give back, through the
 *   wallet's WebAssembly and the server's add-on, the same records as SimplePIR's (FR-010); with its masks as the
 *   public artifact (FR-014), its noise sample in the build statistics (FR-015), deterministically (FR-013);
 * - tables adopted from the build (also across the build's worker thread) and loaded from their files;
 * - a padded build, an empty chain, wrong lengths, released and unknown tables, a failed build's tables freed;
 * - without the add-on the scheme is refused and SimplePIR still builds; a wallet without the WebAssembly, or with
 *   another file, stops with a message naming it.
 *
 * Needs the add-on (`ipir/build.sh native`); without it the file fails with that instruction (Q12).
 */

import { createHash, randomInt } from "node:crypto";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { compileKernel, Kernel } from "../kernel/index.ts";
import type { IpirWorkers } from "../ipir/engine.ts";
import { loadIpirAddon, type IpirAddon } from "../ipir/native.ts";
import { nodeIpirPool } from "../ipir/pool-node.ts";
import { ipirMasksBytes, ipirRequestBytes, ipirResponseBytes } from "../ipir/sizes.ts";
import { type IpirRequest, IpirTableClient } from "../ipir/wallet.ts";
import { compileIpirWasm, IPIR_WASM_PATH } from "../ipir/wallet-node.ts";
import { bucketOf, findInBucket, inlineMultiplier, MAX_COLUMNS, openWalletScheme, positionOf, RequestRefused, SchemeUnavailable, type ServerTable, TableTooLarge, type WalletTable } from "../pir/index.ts";
import { IPIR_PACKING_BYTES_PER_BLOCK, IPIR_PREPARE_SCRATCH_BYTES, IPIR_SP_PARAMS, IPIR_SP_SERVER } from "../pir/ipir-sp-server.ts";
import { estimatedBucketIpirShape, positionalIpirShape } from "../pir/ipir/shape.ts";
import { maxRequestBytes, openServerScheme, serverSchemeEntry } from "../pir/server-schemes.ts";
import { decodeManifest, decodeReadRecord, encodeManifest, encodeReadRecord, fromHex, type Manifest, pathRecordBytes, READ_RECORD_BYTES, SCAN_ENTRY_BYTES, toHex } from "../shared/index.ts";
import { BuildError, type BuildJob, type BuildResult, buildSnapshot, BUILDS_DIR, paddedBuildBytes, SNAPSHOTS_DIR } from "../server/build.ts";
import { runBuildWorker } from "../server/build-host.ts";
import { buildTree } from "../server/tree.ts";
import { type NullifierEvent, type OutputEvent, ZswapIndex } from "../server/zswap-index.ts";

const LONG = 300_000;
const OUTPUTS = 300;
const NULLIFIERS = 37;
const HEIGHTS = 10;
const K = 2;

const sha = (...parts: (string | Uint8Array)[]): Uint8Array => {
  const h = createHash("sha256");
  for (const p of parts) h.update(p);
  return new Uint8Array(h.digest());
};

/** Output i: its commitment, and a 224-byte ciphertext unless i is a multiple of 7 (as `server-scheme.test.ts`). */
function outputOf(i: number, height: number): OutputEvent {
  const commitment = sha("pss-pin/commitment/", String(i));
  if (i % 7 === 0) return { height, txIndex: i % 3, position: i, commitment, evidence: "none", ciphertext: null };
  const ciphertext = new Uint8Array(224);
  for (let b = 0; b < 7; b++) ciphertext.set(sha("pss-pin/ciphertext/", String(i), "/", String(b)), 32 * b);
  return { height, txIndex: i % 3, position: i, commitment, evidence: "ciphertext", ciphertext };
}

const nullifierOf = (j: number): Uint8Array => sha("pss-pin/nullifier/", String(j));

let kernel: Kernel;
let addon: IpirAddon;
let wasm: WebAssembly.Module;
let dataDir: string;
let index: ZswapIndex;
let expectedRoot: Uint8Array;

function job(scheme: BuildJob["scheme"], options: { padding?: number; dir?: string; slice?: BuildJob["slice"]; outputs?: number; root?: Uint8Array } = {}): BuildJob {
  return {
    height: HEIGHTS,
    blockHash: sha("pss-pin/block/", String(HEIGHTS)),
    genesisHash: sha("pss-pin/genesis"),
    network: "custom",
    expectedFirstFree: options.outputs ?? OUTPUTS,
    expectedRoot: options.root ?? expectedRoot,
    pathSplit: K,
    queriesPerCall: 4,
    scheme,
    threads: 1,
    dataDir: options.dir ?? dataDir,
    slice: options.slice ?? index.slice(OUTPUTS, NULLIFIERS),
    ...(options.padding === undefined ? {} : { padding: options.padding }),
  };
}

const build = (j: BuildJob): Promise<BuildResult> => buildSnapshot(j, { kernel, multiplier: inlineMultiplier });

type Name = "read" | "path" | "nullifier";
const refsOf = (m: Manifest, name: Name) => {
  const a = m.artifacts;
  return name === "read" ? { ref: a.readTable, publicRef: a.readPublic } : name === "path" ? { ref: a.pathTable!, publicRef: a.pathPublic! } : { ref: a.nullifierTable, publicRef: a.nullifierPublic };
};

/** One call of `perCall` requests (the wanted groups, then random ones) through a wallet table and a server table. */
async function call(wallet: WalletTable, server: ServerTable, wanted: readonly number[], perCall: number): Promise<Uint8Array[][]> {
  const groups = [...wanted];
  while (groups.length < perCall) groups.push(randomInt(wallet.groups));
  const prepared = await wallet.prepareCall(groups);
  expect(prepared.requests.length).toBe(perCall * wallet.requestBytes);
  const answers = await server.answer(prepared.requests, perCall);
  expect(answers.length).toBe(perCall * server.responseBytes);
  return prepared.decode(answers, wanted.length);
}

/**
 * Every record of a positional table, and every nullifier's lookup, read by PIR through `scheme`'s wallet side and the
 * server's tables (adopted from the build, or loaded from the snapshot's files).
 */
async function readAll(result: BuildResult, source: "adopted" | "loaded", perCall = 8, ipirWorkers?: IpirWorkers): Promise<{ read: Uint8Array[]; path: Uint8Array[]; spent: (readonly [number, number] | null)[]; absent: boolean }> {
  const m = result.manifest;
  const server = await openServerScheme(m.scheme, { threads: 1, multiplier: inlineMultiplier });
  const wallet = await openWalletScheme(m, { multiplier: inlineMultiplier, ipirWasm: () => wasm, ...(ipirWorkers === undefined ? {} : { ipirWorkers }) });
  const tables: ServerTable[] = [];
  try {
    const open = async (name: Name) => {
      const { ref, publicRef } = refsOf(m, name);
      const t = source === "adopted" ? await server.adoptTable(ref, result.tables[name]!) : await server.loadTable(ref, join(result.dir, ref.digest), join(result.dir, publicRef.digest));
      tables.push(t);
      const w = await wallet.openTable(ref, new Uint8Array(readFileSync(join(result.dir, publicRef.digest))));
      return { t, w, ref };
    };
    const positional = async (name: "read" | "path"): Promise<Uint8Array[]> => {
      const { t, w, ref } = await open(name);
      const groups = [...new Set(Array.from({ length: OUTPUTS }, (_, i) => positionOf(i, ref.perGroup).column))];
      const byGroup = new Map<number, Uint8Array[]>();
      for (let from = 0; from < groups.length; from += perCall) {
        const part = groups.slice(from, from + perCall);
        (await call(w, t, part, perCall)).forEach((records, q) => byGroup.set(part[q]!, records));
      }
      w.dispose();
      return Array.from({ length: OUTPUTS }, (_, i) => byGroup.get(positionOf(i, ref.perGroup).column)![positionOf(i, ref.perGroup).slot]!);
    };
    const read = await positional("read");
    const path = await positional("path");
    const { t, w, ref } = await open("nullifier");
    const bits = (ref as typeof m.artifacts.nullifierTable).bucketBits;
    const absentValue = sha("pss-pin/absent");
    const all = [...Array.from({ length: NULLIFIERS }, (_, j) => nullifierOf(j)), absentValue];
    const found: (readonly [number, number] | null)[] = [];
    for (let from = 0; from < all.length; from += perCall) {
      const part = all.slice(from, from + perCall);
      const records = await call(w, t, part.map((n) => bucketOf(n, bits)), perCall);
      part.forEach((n, q) => {
        const e = findInBucket(records[q]!, n);
        found.push(e === null ? null : [e.height, e.txIndex]);
      });
    }
    w.dispose();
    return { read, path, spent: found.slice(0, NULLIFIERS), absent: found[NULLIFIERS] === null };
  } finally {
    for (const t of tables) t.release();
    wallet.dispose();
    await server.close();
  }
}

beforeAll(() => {
  addon = loadIpirAddon();
  wasm = compileIpirWasm();
  kernel = new Kernel(compileKernel());
  dataDir = mkdtempSync(join(tmpdir(), "pss-ipir-scheme-"));
  index = new ZswapIndex();
  const per = OUTPUTS / HEIGHTS;
  for (let h = 1; h <= HEIGHTS; h++) {
    const outputs = Array.from({ length: per }, (_, j) => outputOf((h - 1) * per + j, h));
    const nullifiers: NullifierEvent[] = [];
    for (let j = 0; j < NULLIFIERS; j++) if (j % HEIGHTS === h - 1) nullifiers.push({ height: h, txIndex: j % 3, nullifier: nullifierOf(j) });
    index.appendHeight(h, outputs, nullifiers);
  }
  const hash = (x: Uint8Array, y: Uint8Array): Uint8Array => kernel.hash2(x, y)!;
  expectedRoot = buildTree(OUTPUTS, K, (i) => kernel.leaf(sha("pss-pin/commitment/", String(i))), hash).root;
}, LONG);

afterAll(() => {
  if (dataDir !== undefined) rmSync(dataDir, { recursive: true, force: true });
});

describe("an IPIR+SP snapshot (FR-010 to FR-015)", () => {
  let ipir: BuildResult;
  let simple: BuildResult;

  beforeAll(async () => {
    ipir = await build(job("ipir-sp"));
    simple = await build(job("simplepir"));
  }, LONG);

  it("its manifest names IPIR+SP, its profile and each table's shape; the public artifacts are the masks, with no setup data", () => {
    const m = ipir.manifest;
    expect(m.scheme).toBe("ipir-sp");
    expect(m.pir).toEqual(IPIR_SP_PARAMS);
    expect(m.pir).toEqual({ ring: 2048, qBits: 54, pBits: 16, digitBits: 19, digits: 2, maskBits: 29, queryBits: 49, responseBits: 22 });
    const a = m.artifacts;
    // 300 records of 98 bytes (49 cells, 41 to a row); of 64 bytes (32 cells, 64 to a row); 37 nullifiers in 2^11 buckets.
    expect(a.readTable).toMatchObject({ records: 300, recordBytes: 98, groups: 2048, perGroup: 41, size: 2 * 2048 * 2048, layout: { rows: 2048, cols: 2048, cellsPerRecord: 49 } });
    expect(a.pathTable).toMatchObject({ records: 300, recordBytes: 64, groups: 2048, perGroup: 64, layout: { rows: 2048, cols: 2048, cellsPerRecord: 32 } });
    expect(a.nullifierTable).toMatchObject({ records: 37, recordBytes: 40, groups: 2048, perGroup: 102, bucketBits: 11, capacity: 102, layout: { rows: 2048, cols: 2048, cellsPerRecord: 20 } });
    for (const name of ["read", "path", "nullifier"] as const) {
      const { ref, publicRef } = refsOf(m, name);
      expect(publicRef.size, name).toBe(ipirMasksBytes(ref.layout.cols));
      // FR-012: the seed is derived from the table's name and its file's digest, as SimplePIR's.
      expect(ref.layout.seed).toBe(toHex(sha("umbradb-pss/seed/v1", name, fromHex(ref.digest, 32))));
    }
    // The snapshot's files: the manifest, scan, block roots, three tables and three mask files.
    expect(readdirSync(ipir.dir).length).toBe(9);
    // The scan file and block roots do not depend on the scheme; the snapshot identifier does (FR-003).
    expect([a.scan.digest, a.blockRoots.digest]).toEqual([simple.manifest.artifacts.scan.digest, simple.manifest.artifacts.blockRoots.digest]);
    expect(ipir.id).not.toBe(simple.id);
    expect(decodeManifest(ipir.manifestBytes)).toEqual(m);
  });

  it("FR-015: each table's setup step records the add-on's noise sample, below the limit", async () => {
    const outcome = await runBuildWorker(job("ipir-sp", { dir: mkdtempSync(join(dataDir, "worker-")) }));
    try {
      for (const step of ["readSetup", "pathSetup", "nullifierSetup"] as const) {
        const s = outcome.steps[step]!.scheme!;
        expect(s, step).toMatchObject({ rows: 2048, cols: 2048, checkedRows: 3, phaseLimitLog2: 37, masksBytes: ipirMasksBytes(2048) });
        expect(s.maxPhaseErrorLog2!, step).toBeGreaterThan(30);
        expect(s.maxPhaseErrorLog2!, step).toBeLessThan(37);
        expect(s.tableBytes).toBe(2 * 2048 * 2048);
        expect(s.packingBytes).toBe(IPIR_PACKING_BYTES_PER_BLOCK);
      }
      // The worker's build is the in-process one, and its tables cross threads as handles the add-on holds.
      expect(outcome.result.id).toBe(ipir.id);
      const server = await openServerScheme("ipir-sp", { threads: 1 });
      const t = await server.adoptTable(outcome.result.manifest.artifacts.readTable, outcome.result.tables.read);
      expect(t.heldBytes).toBe(2 * 2048 * 2048 + IPIR_PACKING_BYTES_PER_BLOCK);
      t.release();
      for (const name of ["path", "nullifier"] as const) server.discardTransfer(outcome.result.tables[name]!);
    } finally {
      rmSync(outcome.result.dir, { recursive: true, force: true });
    }
  });

  it("FR-010: every record read back through the wallet's WebAssembly and the add-on is SimplePIR's, adopted and loaded", { timeout: LONG }, async () => {
    const reference = await readAll(simple, "adopted");
    for (let i = 0; i < OUTPUTS; i++) {
      const o = outputOf(i, 1);
      expect(Buffer.from(reference.read[i]!).equals(Buffer.from(encodeReadRecord(o.commitment, o.ciphertext))), `SimplePIR read ${i}`).toBe(true);
    }
    expect(reference.spent.every((e) => e !== null)).toBe(true);
    for (const source of ["adopted", "loaded"] as const) {
      const got = await readAll(ipir, source);
      expect(got.read.map(toHex), source).toEqual(reference.read.map(toHex));
      expect(got.path.map(toHex), source).toEqual(reference.path.map(toHex));
      expect(got.spent, source).toEqual(reference.spent);
      expect(got.absent).toBe(true);
      expect(decodeReadRecord(got.read[7]!).elements).toBeNull();
    }
    // The same through the wallet's worker threads (`ipir/pool.ts`): each call's requests dealt to 3 workers.
    const pool = nodeIpirPool(3);
    try {
      const got = await readAll(ipir, "loaded", 8, pool);
      expect(got.read.map(toHex)).toEqual(reference.read.map(toHex));
      expect(got.path.map(toHex)).toEqual(reference.path.map(toHex));
      expect(got.spent).toEqual(reference.spent);
      expect(got.absent).toBe(true);
    } finally {
      await pool.close();
    }
  });

  it("FR-013: two builds of the same records give the same files, masks and identifier", { timeout: LONG }, async () => {
    const other = mkdtempSync(join(tmpdir(), "pss-ipir-again-"));
    try {
      const again = await buildSnapshot(job("ipir-sp", { dir: other }), { kernel: new Kernel(compileKernel()) });
      expect(again.id).toBe(ipir.id);
      expect(Buffer.from(again.manifestBytes).equals(Buffer.from(ipir.manifestBytes))).toBe(true);
      expect(readdirSync(again.dir).sort()).toEqual(readdirSync(ipir.dir).sort());
      for (const name of ["read", "path", "nullifier"] as const) {
        const { publicRef } = refsOf(again.manifest, name);
        expect(readFileSync(join(again.dir, publicRef.digest)).equals(readFileSync(join(ipir.dir, publicRef.digest)))).toBe(true);
        discardTable(again, name);
      }
    } finally {
      rmSync(other, { recursive: true, force: true });
    }
  });

  it("calls: a request is ipirRequestBytes(rows), an answer ipirResponseBytes(cols); another length, a released table and an unknown handle are refused", { timeout: LONG }, async () => {
    const m = ipir.manifest;
    const server = await openServerScheme("ipir-sp", { threads: 1 });
    const t = await server.loadTable(m.artifacts.readTable, join(ipir.dir, m.artifacts.readTable.digest), join(ipir.dir, m.artifacts.readPublic.digest));
    expect([t.requestBytes, t.responseBytes]).toEqual([ipirRequestBytes(2048), ipirResponseBytes(2048)]);
    expect([t.requestBytes, t.responseBytes]).toEqual([40_228, 5_700]);
    await expect(t.answer(new Uint8Array(t.requestBytes - 1), 1)).rejects.toThrow(/bytes/);
    await expect(t.answer(new Uint8Array(2 * t.requestBytes), 1)).rejects.toThrow(/bytes/);
    // Bytes of the right length that are not a request of this table are refused before any work: zeros, and a
    // genuine request of the nullifier table (same shape, another setup).
    await expect(t.answer(new Uint8Array(t.requestBytes), 1)).rejects.toThrow(RequestRefused);
    const wallet = await openWalletScheme(m, { ipirWasm: () => wasm });
    const own = await wallet.openTable(m.artifacts.readTable, new Uint8Array(readFileSync(join(ipir.dir, m.artifacts.readPublic.digest))));
    const foreign = await wallet.openTable(m.artifacts.nullifierTable, new Uint8Array(readFileSync(join(ipir.dir, m.artifacts.nullifierPublic.digest))));
    const theirs = (await foreign.prepareCall([5])).requests;
    expect(theirs.length).toBe(t.requestBytes);
    await expect(t.answer(theirs, 1)).rejects.toThrow(/request 0 of the call is not a request of this IPIR\+SP table/);
    // Its own requests, one after another in one call, each decode to their row.
    const call2 = await own.prepareCall([0, 7]);
    const answered = await t.answer(call2.requests, 2);
    const [first, second] = await call2.decode(answered, 2);
    expect(toHex(first![0]!)).toBe(toHex(encodeReadRecord(outputOf(0, 1).commitment, outputOf(0, 1).ciphertext)));
    expect(toHex(second![0]!)).toBe(toHex(encodeReadRecord(outputOf(7 * 41, 1).commitment, outputOf(7 * 41, 1).ciphertext)));
    await expect(call2.decode(answered, 2)).rejects.toThrow(/decoded once/);
    const late = (await own.prepareCall([1])).requests;
    wallet.dispose();
    t.release();
    await expect(t.answer(late, 1)).rejects.toThrow(/released/);
    // A transfer whose handle the add-on does not hold, or whose shape is not the manifest's, is not adopted.
    await expect(server.adoptTable(m.artifacts.readTable, { scheme: "ipir-sp", handle: 0x7fff_fff0, rows: 2048, cols: 2048 } as never)).rejects.toThrow(/no table under handle/);
    await expect(server.adoptTable(m.artifacts.readTable, { scheme: "ipir-sp", handle: 1, rows: 4096, cols: 2048 } as never)).rejects.toThrow(/not the manifest's/);
    await expect(server.adoptTable(m.artifacts.readTable, { scheme: "simplepir" } as never)).rejects.toThrow(/not an IPIR\+SP table/);
    // A table whose stored masks are not the ones it sets up again is not loaded.
    const wrong = join(dataDir, "wrong-masks");
    writeFileSync(wrong, readFileSync(join(ipir.dir, m.artifacts.nullifierPublic.digest)));
    const before = addon.tableCount();
    await expect(server.loadTable(m.artifacts.readTable, join(ipir.dir, m.artifacts.readTable.digest), wrong)).rejects.toThrow(/differ from the stored ones/);
    expect(addon.tableCount()).toBe(before);
    // A table file that is not the manifest's table is refused.
    await expect(server.loadTable(m.artifacts.readTable, join(ipir.dir, m.artifacts.scan.digest), join(ipir.dir, m.artifacts.readPublic.digest))).rejects.toThrow(/must be/);
  });
});

/** Frees a build's table that a test does not adopt. */
function discardTable(result: BuildResult, name: Name): void {
  const t = result.tables[name];
  if (t !== null) addon.release((t as unknown as { handle: number }).handle);
}

describe("padded and empty IPIR+SP snapshots", () => {
  it("padded to 1,000 entries (Q57): the real records at their slots among noise; the same identifier twice", { timeout: LONG }, async () => {
    const padded = await build(job("ipir-sp", { padding: 1000 }));
    try {
      const m = padded.manifest;
      expect(m.padding).toEqual({ size: 1000 });
      expect([m.artifacts.readTable.records, m.artifacts.nullifierTable.records]).toEqual([1000, 1000]);
      // The table starts as noise: cells outside the records are not zero.
      const cells = new Uint16Array(new Uint8Array(readFileSync(join(padded.dir, m.artifacts.readTable.digest))).buffer);
      expect(cells.filter((c) => c === 0).length).toBeLessThan(cells.length / 1000);
      // Every real output's record at its slot, every spent nullifier found (read back through the scheme).
      const server = await openServerScheme("ipir-sp", { threads: 1 });
      const wallet = await openWalletScheme(m, { ipirWasm: () => wasm });
      const read = await server.adoptTable(m.artifacts.readTable, padded.tables.read);
      const w = await wallet.openTable(m.artifacts.readTable, new Uint8Array(readFileSync(join(padded.dir, m.artifacts.readPublic.digest))));
      const slots = [0, 1, 150, 299].map((i) => ({ i, slot: Math.floor((i * 1000) / OUTPUTS) }));
      const groups = [...new Set(slots.map((s) => positionOf(s.slot, m.artifacts.readTable.perGroup).column))];
      const records = await call(w, read, groups, 4);
      for (const { i, slot } of slots) {
        const { column, slot: at } = positionOf(slot, m.artifacts.readTable.perGroup);
        const o = outputOf(i, 1);
        expect(toHex(records[groups.indexOf(column)]![at]!), `output ${i}`).toBe(toHex(encodeReadRecord(o.commitment, o.ciphertext)));
      }
      read.release();
      w.dispose();
      wallet.dispose();
      for (const name of ["path", "nullifier"] as const) server.discardTransfer(padded.tables[name]!);
      const again = await buildSnapshot(job("ipir-sp", { padding: 1000, dir: mkdtempSync(join(dataDir, "padded-")) }), { kernel });
      expect(again.id).toBe(padded.id);
      for (const name of ["read", "path", "nullifier"] as const) server.discardTransfer(again.tables[name]!);
    } finally {
      rmSync(padded.dir, { recursive: true, force: true });
    }
  });

  it("an empty chain gives 2,048 × 2,048 tables of zeros that still answer a call (edge case)", { timeout: LONG }, async () => {
    const empty = new ZswapIndex();
    empty.appendHeight(0, [], []);
    const result = await build({ ...job("ipir-sp", { slice: empty.slice(0, 0), outputs: 0, root: new Uint8Array(32) }), height: 0, pathSplit: 16 });
    const m = result.manifest;
    expect([m.firstFree, m.artifacts.readTable.records, m.artifacts.nullifierTable.records]).toEqual([0, 0, 0]);
    const server = await openServerScheme("ipir-sp", { threads: 1 });
    const wallet = await openWalletScheme(m, { ipirWasm: () => wasm });
    for (const name of ["read", "path", "nullifier"] as const) {
      const { ref, publicRef } = refsOf(m, name);
      expect(ref.layout).toMatchObject({ rows: 2048, cols: 2048 });
      const t = await server.adoptTable(ref, result.tables[name]!);
      const w = await wallet.openTable(ref, new Uint8Array(readFileSync(join(result.dir, publicRef.digest))));
      const [records] = await call(w, t, [0], 4);
      expect(records!.length, name).toBe(ref.perGroup);
      expect(records!.every((r) => r.every((b) => b === 0)), name).toBe(true);
      t.release();
      w.dispose();
    }
    wallet.dispose();
  });
});

describe("limits and refusals", () => {
  it("a build that fails after setting tables up frees them in the add-on, and leaves nothing on disk", { timeout: LONG }, async () => {
    const dir = mkdtempSync(join(tmpdir(), "pss-ipir-fail-"));
    try {
      // The same nullifier twice: the nullifier table fails after the read and path tables were set up.
      const twice = new ZswapIndex();
      for (let h = 1; h <= HEIGHTS; h++) {
        const per = OUTPUTS / HEIGHTS;
        twice.appendHeight(h, Array.from({ length: per }, (_, j) => outputOf((h - 1) * per + j, h)), h <= 2 ? [{ height: h, txIndex: 0, nullifier: nullifierOf(0) }] : []);
      }
      const before = addon.tableCount();
      const failure = await build(job("ipir-sp", { dir, slice: twice.slice(OUTPUTS, 2) })).catch((e: unknown) => e);
      expect((failure as Error).message).toMatch(/duplicate nullifier/);
      expect(addon.tableCount()).toBe(before);
      for (const sub of [SNAPSHOTS_DIR, BUILDS_DIR]) expect(readdirSync(join(dir, sub))).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("an IPIR+SP request is at most 228,388 bytes (32,768 rows, review F4); the query routes' body limit, the largest of any scheme, stays SimplePIR's", () => {
    expect(serverSchemeEntry("ipir-sp")).toBe(IPIR_SP_SERVER);
    expect(IPIR_SP_SERVER.maxRequestBytes).toBe(36 + 27_648 + (49 * 32_768) / 8);
    expect(IPIR_SP_SERVER.maxRequestBytes).toBe(228_388);
    expect(maxRequestBytes()).toBe(MAX_COLUMNS * 4);
  });

  it("estimates a padded build from the add-on's cells and packing, one table's cells in JavaScript and one block's scratch; refuses a table over 2^30 cells with the estimate", () => {
    const formula = (size: number, k: number): number => {
      const shapes = [positionalIpirShape(size, READ_RECORD_BYTES), ...(k > 0 ? [positionalIpirShape(size, pathRecordBytes(k))] : []), estimatedBucketIpirShape(size, 40)];
      const cells = shapes.map((s) => 2 * s.rows * s.cols);
      const held = shapes.reduce((n, s, i) => n + cells[i]! + IPIR_PACKING_BYTES_PER_BLOCK * (s.cols / 2048), 0);
      return held + Math.max(...cells) + IPIR_PREPARE_SCRATCH_BYTES + size * SCAN_ENTRY_BYTES + size * (32 + 12);
    };
    for (const [size, k] of [[1000, 2], [1_000_000, 16], [2_000_000, 0]] as const) expect(paddedBuildBytes(size, k, "ipir-sp"), `${size}`).toBe(formula(size, k));
    // 1,000,000 at k = 16: the path table (10,240 × 26,624, 545 MB of cells) dominates; 2.26 GiB in all.
    expect(paddedBuildBytes(1_000_000, 16, "ipir-sp")).toBe(2_425_369_600);
    expect(() => paddedBuildBytes(30_000_000, 16, "ipir-sp")).toThrow(TableTooLarge);
    expect(() => paddedBuildBytes(30_000_000, 16, "ipir-sp")).toThrow(/ipir-sp: the read table of 30,000,000 records/);
    // At k = 16 a path record is 256 cells: the path table holds at most 4,194,304 records.
    expect(() => paddedBuildBytes(4_194_304, 16, "ipir-sp")).not.toThrow();
    expect(() => paddedBuildBytes(4_194_305, 16, "ipir-sp")).toThrow(/ipir-sp: the path table of 4,194,305 records of 512 bytes/);
  });

  it("without the add-on IPIR+SP is refused by name (open and build), and SimplePIR still builds (edge case)", { timeout: LONG }, async () => {
    const dir = mkdtempSync(join(tmpdir(), "pss-ipir-none-"));
    process.env.PSS_IPIR_ADDON = join(dir, "pss-ipir.node");
    try {
      await expect(openServerScheme("ipir-sp", { threads: 1 })).rejects.toThrow(SchemeUnavailable);
      await expect(openServerScheme("ipir-sp", { threads: 1 })).rejects.toThrow(/"ipir-sp" is not available in this build: its native add-on is not built .*build\.sh native/);
      const failure = await build(job("ipir-sp", { dir })).catch((e: unknown) => e);
      expect(failure).toBeInstanceOf(BuildError);
      expect((failure as BuildError).code).toBe("scheme-unavailable");
      expect((await build(job("simplepir", { dir }))).manifest.scheme).toBe("simplepir");
    } finally {
      delete process.env.PSS_IPIR_ADDON;
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("the wallet (FR-031, story 2 scenario 3)", () => {
  let m: Manifest;
  let walletDir: string;
  const masksOf = (manifest: Manifest): Uint8Array => new Uint8Array(readFileSync(join(walletDir, manifest.artifacts.readPublic.digest)));

  beforeAll(async () => {
    const result = await build(job("ipir-sp", { dir: mkdtempSync(join(dataDir, "wallet-")) }));
    m = result.manifest;
    walletDir = result.dir;
    for (const name of ["read", "path", "nullifier"] as const) discardTable(result, name);
  }, LONG);

  it("without its WebAssembly, with a file of another digest, or on another profile, stops with a message naming it", async () => {
    await expect(openWalletScheme(m, { multiplier: inlineMultiplier })).rejects.toThrow(SchemeUnavailable);
    await expect(openWalletScheme(m)).rejects.toThrow(/PIR scheme "ipir-sp" is not available in this build: this wallet was not given its WebAssembly \(ipir\/pss-ipir\.wasm\)/);
    const other = join(dataDir, "other.wasm");
    writeFileSync(other, Buffer.concat([readFileSync(IPIR_WASM_PATH), Buffer.from([0])]));
    await expect(openWalletScheme(m, { ipirWasm: () => compileIpirWasm({ path: other }) })).rejects.toThrow(/WebAssembly \(ipir\/pss-ipir\.wasm\) cannot be loaded: .* has digest .*not the expected/);
    await expect(openWalletScheme({ ...m, pir: { ...IPIR_SP_PARAMS, maskBits: 30 } }, { ipirWasm: () => wasm })).rejects.toThrow(/parameters/);
    // Negative control: given the committed file, it opens; masks of another table are refused.
    const scheme = await openWalletScheme(m, { ipirWasm: () => wasm });
    await expect(scheme.openTable(m.artifacts.readTable, new Uint8Array(ipirMasksBytes(2048)))).rejects.toThrow();
    scheme.dispose();
  });

  it("review F8: a random source that returns without writing, or returns the same bytes again, gives no request; the wallet stays usable", async () => {
    const scheme = await openWalletScheme(m, { ipirWasm: () => wasm });
    const table = await scheme.openTable(m.artifacts.readTable, masksOf(m));
    const spy = vi.spyOn(globalThis.crypto, "getRandomValues");
    try {
      // Writes nothing: the seed would be all zero.
      spy.mockImplementation((a) => a);
      await expect(table.prepareCall([0])).rejects.toThrow(/cannot make an IPIR\+SP request: .*entropy unavailable/);
      // The same bytes every time: the first request's seed is taken, the second is refused (it equals the first).
      spy.mockImplementation((a) => {
        new Uint8Array(a!.buffer, a!.byteOffset, a!.byteLength).fill(0x5a);
        return a;
      });
      await expect(table.prepareCall([0, 1])).rejects.toThrow(/entropy unavailable/);
    } finally {
      spy.mockRestore();
    }
    // A working source again: requests are made, with distinct keys.
    const call = await table.prepareCall([0, 0]);
    const each = table.requestBytes;
    expect(Buffer.from(call.requests.subarray(36, each)).equals(Buffer.from(call.requests.subarray(each + 36, 2 * each)))).toBe(false);
    scheme.dispose();
  });

  it("review F7: every request's state is freed after its decode, on a failed decode or call, and for a call never answered when its table or scheme is disposed", async () => {
    const made: { state: IpirRequest["state"]; freed: boolean }[] = [];
    const request = IpirTableClient.prototype.request;
    const spy = vi.spyOn(IpirTableClient.prototype, "request").mockImplementation(function (this: IpirTableClient, row: number) {
      const r = request.call(this, row);
      const entry = { state: r.state, freed: false };
      const free = r.state.free.bind(r.state);
      (r.state as { free(): void }).free = () => {
        entry.freed = true;
        free();
      };
      made.push(entry);
      return r;
    });
    const live = () => made.filter((e) => !e.freed).length;
    try {
      const server = await openServerScheme("ipir-sp", { threads: 1 });
      const t = await server.loadTable(m.artifacts.readTable, join(walletDir, m.artifacts.readTable.digest), join(walletDir, m.artifacts.readPublic.digest));
      const scheme = await openWalletScheme(m, { ipirWasm: () => wasm });
      const table = await scheme.openTable(m.artifacts.readTable, masksOf(m));
      // Decoded: all four freed, the padding ones too.
      const answered = await table.prepareCall([0, 1, 2, 3]);
      await answered.decode(await t.answer(answered.requests, 4), 2);
      expect([made.length, live()]).toEqual([4, 0]);
      // A decode that fails (an answer of another length): freed.
      const failed = await table.prepareCall([0, 1]);
      await expect(failed.decode(new Uint8Array(5), 1)).rejects.toThrow(/bytes/);
      expect(live()).toBe(0);
      // A call that fails part-way (row outside the table): the requests already made are freed.
      await expect(table.prepareCall([0, 1, 4096])).rejects.toThrow(/outside a table/);
      expect(live()).toBe(0);
      // Calls whose answers never come: freed when the table is disposed, or when the scheme is.
      await table.prepareCall([5, 6]);
      expect(live()).toBe(2);
      table.dispose();
      expect(live()).toBe(0);
      await expect(table.prepareCall([0])).rejects.toThrow(/disposed/);
      const other = await scheme.openTable(m.artifacts.readTable, masksOf(m));
      await other.prepareCall([7, 8, 9]);
      expect(live()).toBe(3);
      scheme.dispose();
      expect(live()).toBe(0);
      t.release();
    } finally {
      spy.mockRestore();
    }
  });

  it("an IPIR+SP manifest is checked against its files' sizes and its profile", () => {
    expect(() => encodeManifest(m)).not.toThrow();
    const r = m.artifacts.readTable;
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readPublic: { ...m.artifacts.readPublic, size: m.artifacts.readPublic.size - 1 } } })).toThrow(/readPublic.size = 36/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, size: r.size + 32 } } })).toThrow(/readTable.size matches its shape/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, perGroup: 40 } } })).toThrow(/perGroup/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, layout: { ...r.layout, cols: 2047 } } } })).toThrow(/multiples of 2048/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, groups: 1024 } } })).toThrow(/layout.rows = groups/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, layout: { ...r.layout, cellsPerRecord: 50 } } } })).toThrow(/cellsPerRecord/);
    expect(() => encodeManifest({ ...m, pir: { logQ: 32, n: 1024, sigma: 6.4, cellBits: 9, plainModulus: 512 } })).toThrow(/invalid manifest: pir.ring/);
  });
});
