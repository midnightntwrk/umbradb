/**
 * The scheme seam (spec 00058 FR-001 to FR-004, FR-022), with SimplePIR behind it:
 *
 * - a snapshot built from a fixed synthetic index has the same table and setup-data files as before the seam was
 *   introduced: the digests below were recorded from the builder at `990e41d4`, before any change, for the same input
 *   (the manifest's own bytes are not pinned: its format changed with the seam);
 * - every record read back through the interface (the wallet's table, the server's table adopted from the build and
 *   loaded from its file) is the record put in, with SimplePIR's request and response sizes (C × 4, R × 4);
 * - the padded-build estimate is SimplePIR's formula from before the seam;
 * - a scheme this build does not have is refused by name everywhere: manifest, registries, settings, builder.
 *
 * The input is made here from counters, not from ledger transactions, so it is the same on every run: 300 outputs over
 * 10 heights (every 7th without a ciphertext) and 37 nullifiers. Two builds: unpadded, and padded to 1,000 entries
 * (which fills the tables with the builder's deterministic noise first). Both at path split 2.
 */

import { createHash, randomInt } from "node:crypto";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { compileKernel, Kernel } from "../kernel/index.ts";
import {
  bucketOf,
  cellsPerRecord,
  findInBucket,
  inlineMultiplier,
  LWE_N,
  MAX_COLUMNS,
  openWalletScheme,
  positionalShape,
  positionOf,
  SchemeUnavailable,
  type ServerTable,
  type WalletTable,
  widestShape,
} from "../pir/index.ts";
import { maxRequestBytes, openServerScheme, serverSchemeEntry } from "../pir/server-schemes.ts";
import { decodeReadRecord, encodeReadRecord, type Manifest, NULLIFIER_RECORD_BYTES, pathRecordBytes, READ_RECORD_BYTES, SCAN_ENTRY_BYTES } from "../shared/index.ts";
import { BuildError, type BuildJob, type BuildResult, buildSnapshot, BUILDS_DIR, MANIFEST_FILE, paddedBuildBytes, SNAPSHOTS_DIR } from "../server/build.ts";
import { SETTINGS_SCHEMA } from "../server/settings.ts";
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

/** Output i: its commitment, and a 224-byte ciphertext unless i is a multiple of 7. */
function outputOf(i: number, height: number): OutputEvent {
  const commitment = sha("pss-pin/commitment/", String(i));
  if (i % 7 === 0) return { height, txIndex: i % 3, position: i, commitment, evidence: "none", ciphertext: null };
  const ciphertext = new Uint8Array(224);
  for (let b = 0; b < 7; b++) ciphertext.set(sha("pss-pin/ciphertext/", String(i), "/", String(b)), 32 * b);
  return { height, txIndex: i % 3, position: i, commitment, evidence: "ciphertext", ciphertext };
}

let kernel: Kernel;
let dataDir: string;
let index: ZswapIndex;
let expectedRoot: Uint8Array;

function job(padding?: number): BuildJob {
  return {
    height: HEIGHTS,
    blockHash: sha("pss-pin/block/", String(HEIGHTS)),
    genesisHash: sha("pss-pin/genesis"),
    network: "custom",
    expectedFirstFree: OUTPUTS,
    expectedRoot,
    pathSplit: K,
    queriesPerCall: 4,
    scheme: "simplepir",
    threads: 1,
    dataDir,
    slice: index.slice(OUTPUTS, NULLIFIERS),
    ...(padding === undefined ? {} : { padding }),
  };
}

const build = (j: BuildJob): Promise<BuildResult> => buildSnapshot(j, { kernel, multiplier: inlineMultiplier });

/**
 * The digests of the files that must not change: the scan file, the block roots, each table and its setup data (under
 * the seam, SimplePIR's public artifact: `readPublic` was `readSetup`, and so on).
 */
function digestsOf(m: Manifest): Record<string, string> {
  const a = m.artifacts;
  return {
    scan: a.scan.digest,
    blockRoots: a.blockRoots.digest,
    readTable: a.readTable.digest,
    readSetup: a.readPublic.digest,
    pathTable: a.pathTable!.digest,
    pathSetup: a.pathPublic!.digest,
    nullifierTable: a.nullifierTable.digest,
    nullifierSetup: a.nullifierPublic.digest,
  };
}

/** Recorded at `990e41d4` (before the seam). */
const PINNED: Record<"plain" | "padded", Record<string, string>> = {
  plain: {
    scan: "2f45006bdc767dbfa33fc3628b8bc1f2da2dd9b243243c103441600bc61e242e",
    blockRoots: "41ce7a46b01dba23996367bdb74ca081d3f031bbfc7453786b86d9d414d2dd85",
    readTable: "3cd2dff3448819fbf2841023ab51919d96e110bea686d914a81b77aeae1e7d4b",
    readSetup: "4fd6a776a266a593087a9e565a87ed12719c75256a601c963633e5ccb2d6c0de",
    pathTable: "b82805e9731adfd45b991fb869086ce129e54a0fdabd035c79f2a3c9b0446a43",
    pathSetup: "d8e1081621444f396b5c181368b64fa790a5e7ea36fbbae58e9bdaa3b3036df1",
    nullifierTable: "df93df1934871bceefc78fd32d2e998a6f351e4066235875ec01d8135c350f4e",
    nullifierSetup: "92bbbcff67005e3c526ec22b1063eebaea3a0858771a263099ed971862333af9",
  },
  padded: {
    scan: "4aab1cf5f0d1762f60b7738b43904825b48e169cb6cc6dbb048afb017fa0f151",
    blockRoots: "41ce7a46b01dba23996367bdb74ca081d3f031bbfc7453786b86d9d414d2dd85",
    readTable: "b4ceb8075ed1b3f56e1cc1f972369a0629e35130d33c6140c4c13ef0aeb6e2b9",
    readSetup: "ace17bbe36c59669eea95a75cba610e8f0f192085fd7b989e6d55b35add999c9",
    pathTable: "09d98ebc509da487e1e572514e2b3601111129ddb7938348894810ac2535cdb3",
    pathSetup: "91318c157f1e05e9c4b713acd7e5c1df48ba0824b21b1e5ce729b048786bf6c1",
    nullifierTable: "303133fe6bfc92256e6a609d71e5568151c1a1970e2573aa7a8c17dbba3bb823",
    nullifierSetup: "f83a9e7b937888017a08e1baf2abe74cbe654bd65ea1bd98a9a601754c1be059",
  },
};

beforeAll(() => {
  kernel = new Kernel(compileKernel());
  dataDir = mkdtempSync(join(tmpdir(), "pss-scheme-"));
  index = new ZswapIndex();
  const per = OUTPUTS / HEIGHTS;
  for (let h = 1; h <= HEIGHTS; h++) {
    const outputs = Array.from({ length: per }, (_, j) => outputOf((h - 1) * per + j, h));
    const nullifiers: NullifierEvent[] = [];
    for (let j = 0; j < NULLIFIERS; j++) if (j % HEIGHTS === h - 1) nullifiers.push({ height: h, txIndex: j % 3, nullifier: sha("pss-pin/nullifier/", String(j)) });
    index.appendHeight(h, outputs, nullifiers);
  }
  const hash = (x: Uint8Array, y: Uint8Array): Uint8Array => kernel.hash2(x, y)!;
  expectedRoot = buildTree(OUTPUTS, K, (i) => kernel.leaf(sha("pss-pin/commitment/", String(i))), hash).root;
}, LONG);

afterAll(() => {
  if (dataDir !== undefined) rmSync(dataDir, { recursive: true, force: true });
});

describe("SimplePIR behind the scheme seam (FR-004)", () => {
  it("builds the same table and setup-data files as before the seam, unpadded and padded", { timeout: LONG }, async () => {
    const got: Record<string, Record<string, string>> = {};
    for (const [label, padding] of [["plain", undefined], ["padded", 1000]] as const) {
      const result = await build(job(padding));
      const digests = digestsOf(result.manifest);
      // Every artifact is in the snapshot's directory under its digest.
      expect(readdirSync(result.dir).sort()).toEqual([...new Set([MANIFEST_FILE, ...Object.values(digests)])].sort());
      got[label] = digests;
    }
    expect(got).toEqual(PINNED);
  });
});

/** The nullifiers of the synthetic index with their place, in index order. */
const nullifiersOf = (): { nullifier: Uint8Array; height: number; txIndex: number }[] =>
  Array.from({ length: NULLIFIERS }, (_, j) => ({ nullifier: sha("pss-pin/nullifier/", String(j)), height: (j % HEIGHTS) + 1, txIndex: j % 3 }));

/** One full call (the wanted groups, then random ones) through a wallet table and a server table: the wanted groups' records. */
async function call(wallet: WalletTable, server: ServerTable, wanted: readonly number[], perCall: number): Promise<Uint8Array[][]> {
  const groups = [...wanted];
  while (groups.length < perCall) groups.push(randomInt(wallet.groups));
  const prepared = await wallet.prepareCall(groups);
  expect(prepared.requests.length).toBe(perCall * wallet.requestBytes);
  const answers = await server.answer(prepared.requests, perCall);
  expect(answers.length).toBe(perCall * server.responseBytes);
  return prepared.decode(answers, wanted.length);
}

describe("SimplePIR through the scheme interface (FR-004, FR-022)", () => {
  it("reads every record back through the wallet's and the server's tables, adopted from the build and loaded from its file", { timeout: LONG }, async () => {
    const result = await build(job());
    const m = result.manifest;
    const a = m.artifacts;
    expect(m.scheme).toBe("simplepir");
    const server = await openServerScheme("simplepir", { threads: 1, multiplier: inlineMultiplier });
    const wallet = await openWalletScheme(m, { multiplier: inlineMultiplier });
    try {
      for (const source of ["adopted", "loaded"] as const) {
        const open = (name: "read" | "path" | "nullifier") => {
          const [ref, publicRef] = name === "read" ? [a.readTable, a.readPublic] : name === "path" ? [a.pathTable!, a.pathPublic!] : [a.nullifierTable, a.nullifierPublic];
          return source === "adopted" ? server.adoptTable(ref, result.tables[name]!) : server.loadTable(ref, join(result.dir, ref.digest), join(result.dir, publicRef.digest));
        };
        // Read table: record i is output i's 98-byte record.
        const read = await open("read");
        const readWallet = await wallet.openTable(a.readTable, new Uint8Array(readFileSync(join(result.dir, a.readPublic.digest))));
        expect([read.requestBytes, read.responseBytes, read.heldBytes]).toEqual([a.readTable.layout.cols * 4, a.readTable.layout.rows * 4, a.readTable.size - 32]);
        expect([readWallet.requestBytes, readWallet.responseBytes, readWallet.groups, readWallet.perGroup]).toEqual([read.requestBytes, read.responseBytes, a.readTable.groups, a.readTable.perGroup]);
        const positions = [0, 1, 7, 150, 299];
        const groups = [...new Set(positions.map((i) => positionOf(i, a.readTable.perGroup).column))];
        const records = await call(readWallet, read, groups, m.queriesPerCall);
        for (const i of positions) {
          const { column, slot } = positionOf(i, a.readTable.perGroup);
          const o = outputOf(i, 1);
          const got = decodeReadRecord(records[groups.indexOf(column)]![slot]!);
          expect(Buffer.from(encodeReadRecord(o.commitment, o.ciphertext)).equals(Buffer.from(records[groups.indexOf(column)]![slot]!)), `${source} read ${i}`).toBe(true);
          expect(got.elements === null).toBe(o.ciphertext === null);
        }
        // Path table: its records are k × 32 bytes; group sizes as the manifest says.
        const path = await open("path");
        const pathWallet = await wallet.openTable(a.pathTable!, new Uint8Array(readFileSync(join(result.dir, a.pathPublic!.digest))));
        const pathRecords = await call(pathWallet, path, [0], m.queriesPerCall);
        expect(pathRecords[0]!.length).toBe(a.pathTable!.perGroup);
        expect(pathRecords[0]!.every((r) => r.length === 32 * K)).toBe(true);
        // Nullifier table: every nullifier in its bucket with its place; an absent one is not.
        const nullifier = await open("nullifier");
        const nullifierWallet = await wallet.openTable(a.nullifierTable, new Uint8Array(readFileSync(join(result.dir, a.nullifierPublic.digest))));
        const spent = nullifiersOf();
        const absent = sha("pss-pin/absent");
        const buckets = [...new Set([...spent.map((e) => e.nullifier), absent].map((n) => bucketOf(n, a.nullifierTable.bucketBits)))];
        for (let from = 0; from < buckets.length; from += m.queriesPerCall) {
          const part = buckets.slice(from, from + m.queriesPerCall);
          const got = await call(nullifierWallet, nullifier, part, m.queriesPerCall);
          for (const e of spent) {
            const at = part.indexOf(bucketOf(e.nullifier, a.nullifierTable.bucketBits));
            if (at < 0) continue;
            const found = findInBucket(got[at]!, e.nullifier);
            expect([found?.height, found?.txIndex], `${source} nullifier`).toEqual([e.height, e.txIndex]);
          }
          const at = part.indexOf(bucketOf(absent, a.nullifierTable.bucketBits));
          if (at >= 0) expect(findInBucket(got[at]!, absent)).toBeNull();
        }
      }
    } finally {
      wallet.dispose();
      await server.close();
    }
  });

  it("refuses a request body of another length before any work, and a wallet on other SimplePIR parameters", { timeout: LONG }, async () => {
    const result = await build(job());
    const m = result.manifest;
    await expect(openWalletScheme({ ...m, pir: { ...m.pir, n: 512 } })).rejects.toThrow(/parameters/);
    const server = await openServerScheme("simplepir", { threads: 1, multiplier: inlineMultiplier });
    try {
      const table = await server.loadTable(m.artifacts.readTable, join(result.dir, m.artifacts.readTable.digest), join(result.dir, m.artifacts.readPublic.digest));
      await expect(table.answer(new Uint8Array(table.requestBytes - 4), 1)).rejects.toThrow();
      // A table file that is not the manifest's entry is refused.
      await expect(server.loadTable(m.artifacts.readTable, join(result.dir, m.artifacts.nullifierTable.digest), join(result.dir, m.artifacts.readPublic.digest))).rejects.toThrow();
    } finally {
      await server.close();
    }
  });

  it("estimates a padded build as before the seam: SimplePIR's tables, setup data and A, the scan file and the nullifier arrays", () => {
    const before = (size: number, k: number): number => {
      const table = (t: { rows: number; cols: number } | null) => (t === null ? 0 : t.rows * t.cols * 2 + t.cols * LWE_N * 4 + t.rows * LWE_N * 4);
      const read = positionalShape(size, READ_RECORD_BYTES);
      const path = k > 0 ? widestShape(size, pathRecordBytes(k)) : null;
      return table(read) + table(path) + 1.5 * size * cellsPerRecord(NULLIFIER_RECORD_BYTES) * 2 + size * SCAN_ENTRY_BYTES + size * (32 + 12);
    };
    for (const [size, k] of [[1000, 2], [1_000_000, 16], [10_000_000, 16], [2_000_000, 0]] as const) {
      expect(paddedBuildBytes(size, k, "simplepir"), `${size} at k ${k}`).toBe(before(size, k));
    }
  });

  it("fixes the query routes' body limit from SimplePIR's widest table, as before the seam (MAX_COLUMNS × 4 per request)", () => {
    expect(maxRequestBytes()).toBe(MAX_COLUMNS * 4);
    expect(serverSchemeEntry("simplepir").maxRequestBytes).toBe(MAX_COLUMNS * 4);
  });
});

describe("a scheme this build does not have (FR-001, FR-002; story 2, scenario 3)", () => {
  // Both names are registered since phase 3 (IPIR+SP's refusals without its add-on or WebAssembly are in
  // `server-ipir-scheme.test.ts`); a name no registry has stands for a scheme this build lacks.
  it("is refused by name by the registries; the settings accept both names and default to SimplePIR", async () => {
    expect(() => serverSchemeEntry("doublepir")).toThrow(SchemeUnavailable);
    expect(() => serverSchemeEntry("doublepir")).toThrow(/PIR scheme "doublepir" is not available in this build/);
    await expect(openServerScheme("doublepir", { threads: 1 })).rejects.toThrow(/"doublepir"/);
    await expect(openWalletScheme({ scheme: "doublepir" as never, pir: { logQ: 32, n: 1024, sigma: 6.4, cellBits: 9, plainModulus: 512 } })).rejects.toThrow(/PIR scheme "doublepir" is not available in this build/);
    expect(SETTINGS_SCHEMA.parse({ dataDir: "d" }).scheme).toBe("simplepir");
    expect(SETTINGS_SCHEMA.parse({ dataDir: "d", scheme: "ipir-sp" }).scheme).toBe("ipir-sp");
    expect(() => SETTINGS_SCHEMA.parse({ dataDir: "d", scheme: "doublepir" })).toThrow();
  });

  it("fails a build with code scheme-unavailable and leaves nothing behind", { timeout: LONG }, async () => {
    const dir = mkdtempSync(join(tmpdir(), "pss-scheme-none-"));
    try {
      const failure = await build({ ...job(), scheme: "doublepir" as never, dataDir: dir }).catch((e: unknown) => e);
      expect(failure).toBeInstanceOf(BuildError);
      expect((failure as BuildError).code).toBe("scheme-unavailable");
      expect((failure as BuildError).message).toMatch(/"doublepir"/);
      for (const sub of [SNAPSHOTS_DIR, BUILDS_DIR]) expect(existsSync(join(dir, sub)) ? readdirSync(join(dir, sub)) : []).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
