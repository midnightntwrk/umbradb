/**
 * Padded snapshots (debug, decision Q57): the scan file, the read table and the nullifier table hold N entries, the
 * real outputs spread among deterministic noise.
 *
 * - the slot mapping: output i at ⌊i·N/R⌋, and back; noise slots map to no position;
 * - the read table's shape caps its columns at the noise check's limit;
 * - a padded build of the test chain: every real output's scan entry and read record (read back by PIR) equal the
 *   unpadded snapshot's; every spent nullifier is in its bucket among the noise; noise scan entries copy real points;
 *   two builds give the same identifier, and the unpadded build's identifier is not changed by the padding code.
 */

import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { LedgerEvent } from "../../../src/ledger/types.js";
import { compileKernel, Kernel } from "../kernel/index.ts";
import {
  answerQueries,
  bucketOf,
  buildQueries,
  columnRecords,
  decodeAnswers,
  findInBucket,
  type Grid,
  inlineMultiplier,
  MAX_COLUMNS,
  positionalShape,
  positionOf,
  readRecord,
  setupMatrix,
  widestShape,
} from "../pir/index.ts";
import { fromHex, type Manifest, positionAtSlot, READ_RECORD_BYTES, slotCount, slotOf } from "../shared/index.ts";
import { type BuildJob, type BuildResult, buildSnapshot, paddedBuildBytes } from "../server/build.ts";
import { rootFromStored } from "../server/tree.ts";
import { ZswapIndex } from "../server/zswap-index.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 300_000;
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");
let chain: ScenarioChain;
let kernel: Kernel;
let dataDir: string;

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

function jobAt(c: ScenarioChain, index: ZswapIndex, height: number, padding?: number): BuildJob {
  const h = c.scenario.heights[height]!;
  return {
    height,
    blockHash: c.scenario.chain[height]!.hash,
    genesisHash: c.scenario.chain[0]!.hash,
    network: "custom",
    expectedFirstFree: Number(h.zswapFirstFree),
    expectedRoot: rootFromStored(h.trees.zswapRoot),
    pathSplit: 2,
    queriesPerCall: 4,
    threads: 1,
    dataDir,
    slice: index.slice(index.outputsAt(height), index.nullifiersAt(height)),
    ...(padding === undefined ? {} : { padding }),
  };
}

const build = (job: BuildJob): Promise<BuildResult> => buildSnapshot(job, { kernel, multiplier: inlineMultiplier });
const gridOf = (t: NonNullable<BuildResult["pathGrid"]>): Grid => ({ ...t, cells: new Int16Array(t.cells) });
const file = (r: BuildResult, name: keyof Manifest["artifacts"]): Uint8Array => new Uint8Array(readFileSync(join(r.dir, r.manifest.artifacts[name]!.digest)));

beforeAll(async () => {
  chain = await scenarioChain();
  kernel = new Kernel(compileKernel());
  dataDir = mkdtempSync(join(tmpdir(), "pss-padding-"));
}, LONG);

afterAll(() => {
  if (dataDir !== undefined) rmSync(dataDir, { recursive: true, force: true });
});

describe("the slot mapping", () => {
  it("puts output i at ⌊i·N/R⌋ and maps every slot back to its output or to none", () => {
    for (const [r, n] of [[1, 1], [1, 7], [15, 15], [15, 1000], [69_310, 100_000], [69_310, 10_000_000], [7, 9]] as const) {
      const m = { firstFree: r, padding: { size: n } };
      const seen = new Set<number>();
      for (let i = 0; i < r; i++) {
        const s = slotOf(m, i);
        expect(s).toBe(Math.floor((i * n) / r));
        expect(positionAtSlot(m, s)).toBe(i);
        seen.add(s);
      }
      expect(seen.size).toBe(r);
      if (n <= 1000) for (let s = 0; s < n; s++) expect(positionAtSlot(m, s) === null).toBe(!seen.has(s));
      expect(slotCount(m)).toBe(n);
    }
  });

  it("is the identity without padding, and refuses positions and slots outside the snapshot", () => {
    const m = { firstFree: 15 };
    expect(slotOf(m, 14)).toBe(14);
    expect(positionAtSlot(m, 3)).toBe(3);
    expect(() => slotOf(m, 15)).toThrow(/not in the snapshot/);
    expect(() => positionAtSlot({ firstFree: 15, padding: { size: 40 } }, 40)).toThrow(/not in the snapshot/);
  });
});

describe("the tables' shapes", () => {
  it("read table: about square below the column limit (Preprod's 69,310 records of 98 bytes: 2,464 × 2,476), capped above it", () => {
    const preprod = positionalShape(69_310, READ_RECORD_BYTES);
    expect([preprod.rows, preprod.cols, preprod.perColumn]).toEqual([2_464, 2_476, 28]);
    // The 705-byte records of the first layout: the same shape as before the cap.
    const old = positionalShape(69_310, 705);
    expect([old.rows, old.cols, old.perColumn]).toEqual([6_897, 6_301, 11]);
    for (const n of [20_000_000, 100_000_000]) {
      const s = positionalShape(n, 705);
      expect(s.cols).toBeLessThanOrEqual(MAX_COLUMNS);
      expect(s.perColumn * s.cols).toBeGreaterThanOrEqual(n);
    }
  });

  it("path table: as wide as the noise check allows (Q58)", () => {
    const preprod = widestShape(69_310, 512);
    expect([preprod.rows, preprod.cols, preprod.perColumn]).toEqual([456, 69_310, 1]);
    const tenMillion = widestShape(10_000_000, 512);
    expect([tenMillion.rows, tenMillion.cols, tenMillion.perColumn]).toEqual([44_688, 102_041, 98]);
    expect(tenMillion.cols).toBeLessThanOrEqual(MAX_COLUMNS);
  });

  it("estimates a 10M build under 24 GiB and a 20M build over it", () => {
    expect(paddedBuildBytes(10_000_000, 16)).toBeLessThan(24 * 2 ** 30);
    expect(paddedBuildBytes(20_000_000, 16)).toBeGreaterThan(24 * 2 ** 30);
  });
});

describe("a padded build of the test chain", () => {
  it("keeps every real output's scan entry and read record, and every spent nullifier, among deterministic noise", { timeout: LONG }, async () => {
    const index = indexOf(chain);
    const plain = await build(jobAt(chain, index, 7));
    const plainAgain = await build(jobAt(chain, index, 7));
    expect(plainAgain.id).toBe(plain.id);
    expect(plain.manifest.padding).toBeUndefined();

    const n = 1000;
    const padded = await build(jobAt(chain, index, 7, n));
    const m = padded.manifest;
    expect(m.padding).toEqual({ size: n });
    expect(m.root).toBe(plain.manifest.root);
    expect(m.artifacts.blockRoots.digest).toBe(plain.manifest.artifacts.blockRoots.digest);
    expect(m.artifacts.scan.size).toBe(36 * n);
    expect(m.artifacts.readTable.records).toBe(n);
    expect(m.artifacts.nullifierTable.records).toBe(n);
    expect((await build(jobAt(chain, index, 7, n))).id).toBe(padded.id);

    // Scan file: the real entries at their slots; the noise copies real points.
    const plainScan = file(plain, "scan");
    const scan = file(padded, "scan");
    const points = new Set<string>();
    for (let i = 0; i < m.firstFree; i++) {
      const s = slotOf(m, i);
      expect(hex(scan.subarray(36 * s, 36 * s + 36))).toBe(hex(plainScan.subarray(36 * i, 36 * i + 36)));
      points.add(hex(plainScan.subarray(36 * i, 36 * i + 32)));
    }
    let copies = 0;
    for (let s = 0; s < n; s++) {
      if (positionAtSlot(m, s) !== null) continue;
      expect(points.has(hex(scan.subarray(36 * s, 36 * s + 32)))).toBe(true);
      if (scan.subarray(36 * s, 36 * s + 36).some((b) => b !== 0)) copies++;
    }
    expect(copies).toBeGreaterThan(n / 2);

    // Read table: every real record, read back by PIR, equals the unpadded table's.
    const plainRead = gridOf(plain.readGrid);
    const read = gridOf(padded.readGrid);
    const ref = m.artifacts.readTable;
    const setup = setupMatrix(file(padded, "readSetup"), ref.rows);
    const info = { ...ref, seed: fromHex(ref.seed, 32) };
    for (let i = 0; i < m.firstFree; i++) {
      const at = positionOf(slotOf(m, i), ref.perColumn);
      const want = readRecord(plainRead, positionOf(i, plain.manifest.artifacts.readTable.perColumn).column, positionOf(i, plain.manifest.artifacts.readTable.perColumn).slot);
      expect(hex(readRecord(read, at.column, at.slot))).toBe(hex(want));
      const batch = await buildQueries(info, [at.column, (at.column + 1) % ref.cols], inlineMultiplier);
      const answers = await answerQueries(read, batch.queries, 2, inlineMultiplier);
      const [values] = await decodeAnswers(setup, batch, answers, inlineMultiplier);
      expect(hex(columnRecords(ref, values!)[at.slot]!)).toBe(hex(want));
    }

    // Path table: every real output's path record equals the unpadded table's.
    const plainPath = gridOf(plain.pathGrid!);
    const pathGrid = gridOf(padded.pathGrid!);
    const pt = m.artifacts.pathTable!;
    const plainPt = plain.manifest.artifacts.pathTable!;
    for (let i = 0; i < m.firstFree; i++) {
      const at = positionOf(slotOf(m, i), pt.perColumn);
      const was = positionOf(i, plainPt.perColumn);
      expect(hex(readRecord(pathGrid, at.column, at.slot)), `path ${i}`).toBe(hex(readRecord(plainPath, was.column, was.slot)));
    }

    // Nullifier table: each spent nullifier in its bucket, with its height and transaction.
    const nullifiers = gridOf(padded.nullifierGrid);
    const nt = m.artifacts.nullifierTable;
    for (const spend of chain.spends) {
      const v = fromHex(spend.nullifier, 32);
      const column = bucketOf(v, nt.bucketBits);
      const records = Array.from({ length: nt.perColumn }, (_, slot) => readRecord(nullifiers, column, slot));
      const found = findInBucket(records, v);
      expect(found?.height).toBe(spend.height);
    }
  });

  it("refuses padding below the outputs", { timeout: LONG }, async () => {
    await expect(build(jobAt(chain, indexOf(chain), 7, 14))).rejects.toThrow(/padding 14 must be/);
  });
});
