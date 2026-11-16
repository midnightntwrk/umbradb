/**
 * The scheme seam (spec FR-001 to FR-004): a snapshot built with SimplePIR from a fixed synthetic index has the same
 * table and setup-data files as before the seam was introduced. The digests below were recorded from the builder at
 * `990e41d4`, before any change of the seam, for the same input; the manifest's own bytes are not pinned (its format
 * changed with the seam).
 *
 * The input is made here from counters, not from ledger transactions, so it is the same on every run: 300 outputs over
 * 10 heights (every 7th without a ciphertext) and 37 nullifiers. Two builds: unpadded, and padded to 1,000 entries
 * (which fills the tables with the builder's deterministic noise first). Both at path split 2.
 */

import { createHash } from "node:crypto";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { compileKernel, Kernel } from "../kernel/index.ts";
import { inlineMultiplier } from "../pir/index.ts";
import type { Manifest } from "../shared/index.ts";
import { type BuildJob, type BuildResult, buildSnapshot, MANIFEST_FILE } from "../server/build.ts";
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
    threads: 1,
    dataDir,
    slice: index.slice(OUTPUTS, NULLIFIERS),
    ...(padding === undefined ? {} : { padding }),
  };
}

const build = (j: BuildJob): Promise<BuildResult> => buildSnapshot(j, { kernel, multiplier: inlineMultiplier });

/** The digests of the files that must not change: the scan file, the block roots, each table and its setup data. */
function digestsOf(m: Manifest): Record<string, string> {
  const a = m.artifacts;
  return {
    scan: a.scan.digest,
    blockRoots: a.blockRoots.digest,
    readTable: a.readTable.digest,
    readSetup: a.readSetup.digest,
    pathTable: a.pathTable!.digest,
    pathSetup: a.pathSetup!.digest,
    nullifierTable: a.nullifierTable.digest,
    nullifierSetup: a.nullifierSetup.digest,
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
