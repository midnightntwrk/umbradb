/**
 * The snapshot builder (spec §5.2–5.5, story 1, FR-145) on real ledger data, without a database: the index is filled
 * from the events the vendored v9 ledger emitted for the chain of `./server-chain.ts`, and each build is checked
 * against the reference replay's tree values and against values computed here independently:
 *
 * - the scan file is 36 bytes per output: the ciphertext's first 36 bytes, or zeros for the contract's output;
 * - the root equals the ledger's `zswap_root`; a wrong expected root or `first_free` fails the build and leaves
 *   nothing behind; positions that are not dense break the index;
 * - every read record, read back by PIR through the client's decode, is the record built here from the events, and
 *   its lower path rebuilds its block's root;
 * - every spent nullifier is found by PIR with its height and transaction, and absent ones are not;
 * - two builds of one height give the same digests and identifier; another k gives another identifier.
 */

import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { LedgerEvent } from "../../../src/ledger/types.js";
import { compileKernel, Kernel } from "../kernel/index.ts";
import {
  bucketOf,
  buildQueries,
  columnRecords,
  decodeAnswers,
  deriveSeed,
  findInBucket,
  gridDigest,
  inlineMultiplier,
  positionOf,
  setupMatrix,
  type TableInfo,
  WorkerMultiplier,
} from "../pir/index.ts";
import { decodeManifest, decodePathRecord, decodeReadRecord, fromHex, READ_RECORD_BYTES, shrinkElements, snapshotId, toHex } from "../shared/index.ts";
import { BuildError, type BuildJob, type BuildResult, buildSnapshot, MANIFEST_FILE, SNAPSHOTS_DIR } from "../server/build.ts";
import { runBuildWorker } from "../server/build-host.ts";
import { blockLevels, NODE_BYTES, rootFromStored } from "../server/tree.ts";
import { ZswapIndex } from "../server/zswap-index.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

let chain: ScenarioChain;
let kernel: Kernel;
let multiplier: WorkerMultiplier;
let dataDir: string;
const LONG = 300_000;
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");

const hash = (a: Uint8Array, b: Uint8Array): Uint8Array => kernel.hash2(a, b)!;

/** The index after every height of the chain (outputs and nullifiers from the ledger's own events). */
function indexOf(c: ScenarioChain): ZswapIndex {
  const index = new ZswapIndex();
  for (const h of c.scenario.heights) {
    const height = Number(h.height);
    const events = h.output.events as readonly LedgerEvent[];
    index.appendHeight(
      height,
      events
        .filter((e) => e.kind === "zswap-output")
        .map((e) => ({ height, txIndex: e.transaction, position: Number(e.treeIndex), commitment: e.commitment!, evidence: e.evidence!, ciphertext: e.ciphertext })),
      events.filter((e) => e.kind === "zswap-input").map((e) => ({ height, txIndex: e.transaction, nullifier: e.nullifier! })),
    );
  }
  return index;
}

/** Every output event of the chain, by position. */
function outputsOf(c: ScenarioChain): LedgerEvent[] {
  const out: LedgerEvent[] = [];
  for (const h of c.scenario.heights) for (const e of h.output.events as readonly LedgerEvent[]) if (e.kind === "zswap-output") out[Number(e.treeIndex)] = e;
  return out;
}

function jobAt(c: ScenarioChain, index: ZswapIndex, height: number, k: number, dir = dataDir): BuildJob {
  const h = c.scenario.heights[height]!;
  return {
    height,
    blockHash: c.scenario.chain[height]!.hash,
    genesisHash: c.scenario.chain[0]!.hash,
    network: "custom",
    expectedFirstFree: Number(h.zswapFirstFree),
    expectedRoot: rootFromStored(h.trees.zswapRoot),
    pathSplit: k,
    queriesPerCall: 4,
    threads: 2,
    dataDir: dir,
    slice: index.slice(index.outputsAt(height), index.nullifiersAt(height)),
  };
}

const build = (job: BuildJob): Promise<BuildResult> => buildSnapshot(job, { kernel, multiplier: inlineMultiplier });

/** A naive tree of `leaves` (32 bytes each) of depth `depth`: the ledger's rules written as a recursion. */
function naiveRoot(leaves: readonly Uint8Array[], depth: number, from = 0): Uint8Array | null {
  if (from >= leaves.length) return null;
  if (depth === 0) return leaves[from]!;
  const half = 2 ** (depth - 1);
  const left = naiveRoot(leaves, depth - 1, from);
  const right = naiveRoot(leaves, depth - 1, from + half);
  return hash(left ?? new Uint8Array(32), right ?? new Uint8Array(32));
}

beforeAll(async () => {
  chain = await scenarioChain();
  kernel = new Kernel(compileKernel());
  multiplier = new WorkerMultiplier(2);
  dataDir = mkdtempSync(join(tmpdir(), "pss-build-"));
}, LONG);

afterAll(async () => {
  await multiplier?.close();
  if (dataDir !== undefined) rmSync(dataDir, { recursive: true, force: true });
});

describe("the chain the tests use", () => {
  it("stores 15 outputs (one without a ciphertext, a contract's) and 3 nullifiers, as the module comment says", () => {
    const outputs = outputsOf(chain);
    expect(outputs).toHaveLength(15);
    expect(outputs.map((e) => e.evidence).filter((e) => e !== "ciphertext")).toEqual(["none"]);
    const none = outputs.find((e) => e.evidence === "none")!;
    expect(hex(none.contractAddress!)).toBe(hex(chain.contract));
    const inputs = chain.scenario.heights.flatMap((h) => (h.output.events as readonly LedgerEvent[]).filter((e) => e.kind === "zswap-input").map((e) => [Number(h.height), hex(e.nullifier!)]));
    expect(inputs).toEqual(chain.spends.map((s) => [s.height, s.nullifier]));
    expect(chain.scenario.heights.map((h) => Number(h.zswapFirstFree))).toEqual([0, 5, 5, 7, 9, 11, 14, 15]);
  });
});

describe("a snapshot built from the index (story 1)", () => {
  it("manifest: height, block hash, first_free and a root equal to the ledger's; scan file of 36 × first_free bytes, entry i the point and 4 bytes of element 0, or zeros", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const outputs = outputsOf(chain);
    for (const [height, k] of [[4, 2], [7, 2], [7, 0], [3, 16]] as const) {
      const job = jobAt(chain, index, height, k);
      const result = await build(job);
      const m = decodeManifest(result.manifestBytes);
      expect(result.id).toBe(toHex(snapshotId(result.manifestBytes)));
      expect([m.height, m.blockHash, m.firstFree, m.root, m.pathSplit, m.queriesPerCall]).toEqual([
        height,
        toHex(chain.scenario.chain[height]!.hash),
        Number(chain.scenario.heights[height]!.zswapFirstFree),
        toHex(rootFromStored(chain.scenario.heights[height]!.trees.zswapRoot)),
        k,
        4,
      ]);
      const scan = new Uint8Array(readFileSync(join(result.dir, m.artifacts.scan.digest)));
      expect(scan.length).toBe(36 * m.firstFree);
      for (let i = 0; i < m.firstFree; i++) {
        const e = outputs[i]!;
        const expected = e.ciphertext === null ? new Uint8Array(36) : e.ciphertext.subarray(0, 36);
        expect(hex(scan.subarray(36 * i, 36 * i + 36)), `entry ${i}`).toBe(hex(expected));
      }
      // Every artifact is the file named by its digest, in the snapshot's directory.
      const names = readdirSync(result.dir).sort();
      expect(names).toEqual([...new Set([MANIFEST_FILE, ...Object.values(m.artifacts).map((a) => a.digest)])].sort());
    }
  });

  it("block roots: each block's root under the ledger's rules, the partial block's too; the whole root from them", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const leaves = outputsOf(chain).map((e) => kernel.leaf(e.commitment!));
    for (const k of [0, 1, 2, 3]) {
      const result = await build(jobAt(chain, index, 7, k));
      const roots = new Uint8Array(readFileSync(join(result.dir, result.manifest.artifacts.blockRoots.digest)));
      const blocks = Math.ceil(15 / 2 ** k);
      expect(result.manifest.artifacts.blockRoots.blocks).toBe(blocks);
      for (let b = 0; b < blocks; b++) {
        const expected = naiveRoot(leaves.slice(b * 2 ** k, (b + 1) * 2 ** k), k)!;
        expect(hex(roots.subarray(32 * b, 32 * b + 32)), `k ${k} block ${b}`).toBe(hex(expected));
      }
      const blockRoots = Array.from({ length: blocks }, (_, b) => roots.slice(32 * b, 32 * b + 32));
      expect(hex(naiveRoot(blockRoots, 32 - k)!)).toBe(result.manifest.root);
    }
  });

  it("read table: every position read by PIR through the client's decode is its output's 98-byte record (Q58)", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const outputs = outputsOf(chain);
    const k = 2;
    const result = await build(jobAt(chain, index, 7, k));
    const t = result.manifest.artifacts.readTable;
    const table: TableInfo = { ...t, seed: fromHex(t.seed, 32) };
    const setup = setupMatrix(new Uint8Array(readFileSync(join(result.dir, result.manifest.artifacts.readSetup.digest))), t.rows);
    expect(t.recordBytes).toBe(READ_RECORD_BYTES);
    // The seed is the grid digest's (FR-053): the table file's SHA-256.
    expect(t.seed).toBe(toHex(deriveSeed("read", fromHex(t.digest, 32))));
    const grid = { ...result.readGrid, cells: new Int16Array(result.readGrid.cells) };
    expect(toHex(gridDigest(grid))).toBe(t.digest);
    const positions = Array.from({ length: 15 }, (_, i) => i);
    const columns = positions.map((i) => positionOf(i, t.perColumn).column);
    const batch = await buildQueries(table, columns, multiplier);
    const { answerQueries } = await import("../pir/index.ts");
    const answers = await answerQueries(grid, batch.queries, columns.length, multiplier);
    const values = await decodeAnswers(setup, batch, answers, multiplier);
    positions.forEach((i, q) => {
      const record = decodeReadRecord(columnRecords(t, values[q]!)[positionOf(i, t.perColumn).slot]!);
      const e = outputs[i]!;
      expect(hex(record.commitmentPrefix), `commitment ${i}`).toBe(hex(e.commitment!.subarray(0, 16)));
      expect(record.elements === null ? null : hex(record.elements), `elements ${i}`).toBe(e.ciphertext === null ? null : hex(shrinkElements(e.ciphertext)));
    });
  });

  it("path table: every position read by PIR is its lower path in a full block and zeros elsewhere; none at k = 0 (Q58)", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const outputs = outputsOf(chain);
    const k = 2;
    const result = await build(jobAt(chain, index, 7, k));
    const t = result.manifest.artifacts.pathTable!;
    expect(t.recordBytes).toBe(32 * k);
    expect(t.seed).toBe(toHex(deriveSeed("path", fromHex(t.digest, 32))));
    // As wide as the noise check allows: 15 records fit one row of records.
    expect([t.perColumn, t.cols]).toEqual([1, 15]);
    const table: TableInfo = { ...t, seed: fromHex(t.seed, 32) };
    const setup = setupMatrix(new Uint8Array(readFileSync(join(result.dir, result.manifest.artifacts.pathSetup!.digest))), t.rows);
    const grid = { ...result.pathGrid!, cells: new Int16Array(result.pathGrid!.cells) };
    const positions = Array.from({ length: 15 }, (_, i) => i);
    const columns = positions.map((i) => positionOf(i, t.perColumn).column);
    const batch = await buildQueries(table, columns, multiplier);
    const { answerQueries } = await import("../pir/index.ts");
    const answers = await answerQueries(grid, batch.queries, columns.length, multiplier);
    const values = await decodeAnswers(setup, batch, answers, multiplier);
    const leaves = outputs.map((e) => kernel.leaf(e.commitment!));
    positions.forEach((i, q) => {
      const lowerPath = decodePathRecord(columnRecords(t, values[q]!)[positionOf(i, t.perColumn).slot]!, k);
      const full = i < Math.floor(15 / 4) * 4;
      expect(lowerPath !== null, `path ${i}`).toBe(full);
      if (lowerPath === null) return;
      let node = leaves[i]!;
      lowerPath.forEach((sibling, l) => {
        node = ((i >> l) & 1) === 0 ? hash(node, sibling) : hash(sibling, node);
      });
      const block = Math.floor(i / 4);
      expect(hex(node), `path ${i}`).toBe(hex(naiveRoot(leaves.slice(block * 4, block * 4 + 4), 2)!));
    });
    const flat = await build(jobAt(chain, index, 7, 0));
    expect([flat.manifest.artifacts.pathTable, flat.manifest.artifacts.pathSetup, flat.pathGrid]).toEqual([undefined, undefined, null]);
  });

  it("nullifier table: every spent nullifier is found by PIR with its height and transaction; absent ones are not", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const result = await build(jobAt(chain, index, 7, 2));
    const t = result.manifest.artifacts.nullifierTable;
    const table: TableInfo = { ...t, seed: fromHex(t.seed, 32) };
    const setup = setupMatrix(new Uint8Array(readFileSync(join(result.dir, result.manifest.artifacts.nullifierSetup.digest))), t.rows);
    const grid = { ...result.nullifierGrid, cells: new Int16Array(result.nullifierGrid.cells) };
    const { answerQueries } = await import("../pir/index.ts");
    const absent = [new Uint8Array(32).fill(3), new Uint8Array(32).fill(0xfe)];
    const looked = [...chain.spends.map((s) => fromHex(s.nullifier, 32)), ...absent];
    const batch = await buildQueries(table, looked.map((n) => bucketOf(n, t.bucketBits)), multiplier);
    const values = await decodeAnswers(setup, batch, await answerQueries(grid, batch.queries, looked.length, multiplier), multiplier);
    const found = looked.map((n, q) => findInBucket(columnRecords(t, values[q]!), n));
    const txOf = (s: { height: number }) =>
      (chain.scenario.heights[s.height]!.output.events as readonly LedgerEvent[]).find((e) => e.kind === "zswap-input")!.transaction;
    expect(found.slice(0, 3).map((f) => f && [hex(f.nullifier), f.height, f.txIndex])).toEqual(chain.spends.map((s) => [s.nullifier, s.height, txOf(s)]));
    expect(found.slice(3)).toEqual([null, null]);
    // At height 4 only the first spend is in the table.
    const at4 = await build(jobAt(chain, index, 4, 2));
    expect(at4.manifest.artifacts.nullifierTable.records).toBe(1);
  });
});

describe("determinism and the build's checks", () => {
  it("FR-145: two builds of one height give the same digests and identifier; another k another identifier", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const other = mkdtempSync(join(tmpdir(), "pss-build-again-"));
    try {
      const first = await build(jobAt(chain, index, 6, 2));
      const second = await buildSnapshot(jobAt(chain, index, 6, 2, other), { kernel: new Kernel(compileKernel()), multiplier });
      expect(second.id).toBe(first.id);
      expect(Buffer.from(second.manifestBytes).equals(Buffer.from(first.manifestBytes))).toBe(true);
      expect(readdirSync(second.dir).sort()).toEqual(readdirSync(first.dir).sort());
      const third = await build(jobAt(chain, index, 6, 3));
      expect(third.id).not.toBe(first.id);
    } finally {
      rmSync(other, { recursive: true, force: true });
    }
  });

  it("FR-041: a root other than the ledger's fails the build and leaves no snapshot or partial build", { timeout: LONG }, async () => {
    const dir = mkdtempSync(join(tmpdir(), "pss-build-root-"));
    try {
      const index = indexOf(chain);
      const job = jobAt(chain, index, 5, 2, dir);
      const wrong = job.expectedRoot.slice();
      wrong[0]! ^= 1;
      const failure = await build({ ...job, expectedRoot: wrong }).catch((e: unknown) => e);
      expect(failure).toBeInstanceOf(BuildError);
      expect((failure as BuildError).code).toBe("root-mismatch");
      expect(readdirSync(join(dir, SNAPSHOTS_DIR))).toEqual([]);
      expect(readdirSync(join(dir, "builds"))).toEqual([]);
      // The same through the worker thread: a failure with its code.
      await expect(runBuildWorker({ ...job, expectedRoot: wrong })).rejects.toMatchObject({ code: "root-mismatch" });
      // Negative control: the right root builds.
      expect((await build(job)).manifest.height).toBe(5);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("FR-013: outputs other than the core's first_free fail the build; positions that are not dense break the index", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const job = jobAt(chain, index, 5, 2);
    await expect(build({ ...job, expectedFirstFree: job.expectedFirstFree + 1 })).rejects.toMatchObject({ code: "first-free-mismatch" });
    const gap = new ZswapIndex();
    const c = new Uint8Array(32);
    gap.appendHeight(1, [{ height: 1, txIndex: 0, position: 0, commitment: c, evidence: "none", ciphertext: null }], []);
    expect(gap.error).toBeNull();
    gap.appendHeight(2, [{ height: 2, txIndex: 0, position: 2, commitment: c, evidence: "none", ciphertext: null }], []);
    expect(gap.error).toMatch(/not dense at height 2: expected 1, found 2/);
    expect(gap.outputs).toBe(1);
    // A malformed event is refused without changing the index.
    const bad = new ZswapIndex();
    expect(() => bad.appendHeight(1, [{ height: 1, txIndex: 0, position: 0, commitment: c, evidence: "ciphertext", ciphertext: null }], [])).toThrow(/ciphertext/);
    expect([bad.outputs, bad.height]).toEqual([0, -1]);
  });

  it("the worker thread builds what the builder builds, and reports every step with its peak memory", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const dir = mkdtempSync(join(tmpdir(), "pss-build-worker-"));
    try {
      const job = jobAt(chain, index, 7, 2, dir);
      const direct = await build({ ...job, dataDir: dataDir });
      const outcome = await runBuildWorker(job);
      expect(outcome.result.id).toBe(direct.id);
      expect(Object.keys(outcome.steps)).toEqual(["scan", "tree", "readTable", "readSetup", "pathTable", "pathSetup", "nullifierTable", "nullifierSetup", "manifest"]);
      for (const step of Object.values(outcome.steps)) expect(step!.peakRssBytes).toBeGreaterThan(0);
      expect(outcome.steps.tree!.hashes).toBeGreaterThan(0);
      expect(existsSync(join(dir, SNAPSHOTS_DIR, outcome.result.id, MANIFEST_FILE))).toBe(true);
      // The grids come back in shared memory, the same cells.
      expect(toHex(gridDigest({ ...outcome.result.readGrid, cells: new Int16Array(outcome.result.readGrid.cells) }))).toBe(direct.manifest.artifacts.readTable.digest);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("an empty chain gives tables a call can still query, and the empty tree's root", { timeout: LONG }, async () => {
    const index = new ZswapIndex();
    index.appendHeight(0, [], []);
    const job = jobAt(chain, index, 0, 16);
    const result = await build(job);
    expect(result.manifest.firstFree).toBe(0);
    expect(result.manifest.root).toBe(toHex(new Uint8Array(32)));
    expect([result.manifest.artifacts.scan.size, result.manifest.artifacts.blockRoots.size]).toEqual([0, 0]);
    expect([result.readGrid.cols, result.nullifierGrid.records]).toEqual([1, 0]);
    expect(NODE_BYTES).toBe(32);
    expect(blockLevels(new Uint8Array(32), 0, hash)).toHaveLength(1);
  });
});
