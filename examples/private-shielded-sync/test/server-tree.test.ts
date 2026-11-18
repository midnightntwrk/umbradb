/**
 * The server's tree (spec §2.2, FR-040–043) against two oracles:
 *
 * - the vendored v9 ledger: states built by applying transactions with outputs, whose stored `zswap_root`
 *   (`stateSummary`, the ledger's untagged serialization) the tree must reproduce for every cut k;
 * - a naive recursion of the ledger's rules (an empty subtree is 0 and never hashed; a node with one empty child is
 *   hashed with 0), over random leaves, for the incremental trees, the block cut and the tail's tree.
 */

import { randomBytes } from "node:crypto";
import fc from "fast-check";
import { beforeAll, describe, expect, it } from "vitest";
import { loadLedgerPackage } from "../../../src/ledger/load.js";
import type { LedgerEvent } from "../../../src/ledger/types.js";
import { block, NETWORK_ID, RAW, T0 } from "../../../test/ledger/adapter-fixtures.js";
import { compileKernel, Kernel } from "../kernel/index.ts";
import { TailTree } from "../server/tail.ts";
import { buildTree, IncrementalTree, rootFromStored, TREE_DEPTH, writeLowerPath, blockLevels } from "../server/tree.ts";

let kernel: Kernel;
const hash = (a: Uint8Array, b: Uint8Array): Uint8Array => kernel.hash2(a, b)!;
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");

/** A random leaf: a field element (31 random bytes, the top byte zero, as `degrade_to_transient` gives). */
const leaf = (): Uint8Array => {
  const out = new Uint8Array(32);
  out.set(randomBytes(31));
  return out;
};

function naive(leaves: readonly Uint8Array[], depth: number, from = 0): Uint8Array | null {
  if (from >= leaves.length) return null;
  if (depth === 0) return leaves[from]!;
  const half = 2 ** (depth - 1);
  const left = naive(leaves, depth - 1, from);
  const right = naive(leaves, depth - 1, from + half);
  return hash(left ?? new Uint8Array(32), right ?? new Uint8Array(32));
}
const naiveRoot = (leaves: readonly Uint8Array[], depth: number): Uint8Array => naive(leaves, depth) ?? new Uint8Array(32);

beforeAll(() => {
  kernel = new Kernel(compileKernel());
});

describe("the tree against the ledger's stored root", () => {
  it("states with 3, 6, 9, 12 outputs: the root of every cut equals the stored zswap_root decoded", { timeout: 120_000 }, async () => {
    const adapter = await loadLedgerPackage("v9", { networkId: NETWORK_ID });
    const raw = RAW.v9;
    const token = raw.shieldedToken().raw;
    let state = adapter.emptyState();
    const commitments: Uint8Array[] = [];
    for (let b = 0; b < 4; b++) {
      const keys = raw.ZswapSecretKeys.fromSeed(new Uint8Array(32).fill(b + 1));
      const offers = [0, 1, 2].map((j) => {
        const out = raw.ZswapOutput.new(raw.createShieldedCoinInfo(token, 10n + BigInt(j)), 0, keys.coinPublicKey, keys.encryptionPublicKey);
        return raw.ZswapOffer.fromOutput(out, token, 10n + BigInt(j));
      });
      const offer = offers.reduce((x, y) => x.merge(y));
      const bytes = raw.Transaction.fromParts(NETWORK_ID, offer, undefined, undefined).eraseProofs().serialize();
      const ms = BigInt(T0 + b * 6_000);
      const applied = adapter.apply(state, block([bytes], { height: BigInt(b + 1), timestampMs: ms, parentTimestampMs: ms - 6_000n }));
      expect(applied.output.results.map((r) => r.outcome)).toEqual(["success"]);
      state = applied.state;
      for (const e of applied.output.events as readonly LedgerEvent[]) if (e.kind === "zswap-output") commitments[Number(e.treeIndex)] = e.commitment!;
      const summary = adapter.stateSummary(state);
      expect(Number(summary.zswapFirstFree)).toBe(commitments.length);
      // The stored form: a ScaleBigInt (here 0x73 and 32 little-endian bytes).
      expect(summary.zswapRoot.length).toBeGreaterThan(1);
      for (const k of [0, 1, 2, 3, 16, 20]) {
        const tree = buildTree(commitments.length, k, (i) => kernel.leaf(commitments[i]!), hash);
        expect(hex(tree.root), `${commitments.length} outputs, k ${k}`).toBe(hex(rootFromStored(summary.zswapRoot)));
      }
    }
  });

  it("rootFromStored: the one-byte zero, a full 32-byte value, and refusals", () => {
    expect(hex(rootFromStored(Uint8Array.of(0)))).toBe("00".repeat(32));
    const value = randomBytes(32);
    value[31] = 0x0f;
    expect(hex(rootFromStored(Uint8Array.from([0x73, ...value])))).toBe(hex(value));
    expect(() => rootFromStored(Uint8Array.from([0x73, ...value, 0]))).toThrow(/trailing/);
    expect(() => rootFromStored(Uint8Array.from([0x77, ...randomBytes(33)]))).toThrow(/33 value bytes|non-canonical/);
  });
});

describe("the tree against the naive recursion", () => {
  it("IncrementalTree: root after every append, with an extra leaf, full, and its state round trip", { timeout: 120_000 }, () => {
    for (const depth of [0, 1, 3, 5]) {
      const tree = new IncrementalTree(depth, hash);
      const leaves: Uint8Array[] = [];
      expect(hex(tree.root())).toBe("00".repeat(32));
      for (let i = 0; i < 2 ** depth; i++) {
        const extra = leaf();
        expect(hex(tree.root(extra)), `depth ${depth} size ${i} extra`).toBe(hex(naiveRoot([...leaves, extra], depth)));
        leaves.push(extra);
        tree.append(extra);
        expect(hex(tree.root()), `depth ${depth} size ${i + 1}`).toBe(hex(naiveRoot(leaves, depth)));
        const again = new IncrementalTree(depth, hash, tree.state());
        expect(hex(again.root())).toBe(hex(tree.root()));
      }
      expect(tree.full).toBe(true);
      expect(() => tree.append(leaf())).toThrow(/full/);
      expect(() => tree.root(leaf())).toThrow(/no position/);
    }
    // Depth 32, a few leaves: the whole tree's shape.
    const big = new IncrementalTree(TREE_DEPTH, hash);
    const leaves = [leaf(), leaf(), leaf()];
    for (const l of leaves) big.append(l);
    expect(hex(big.root())).toBe(hex(naiveRoot(leaves, TREE_DEPTH)));
  });

  it("buildTree: block roots, lower paths of full blocks, and the root, for random sizes and cuts", { timeout: 120_000 }, () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 40 }), fc.integer({ min: 0, max: 4 }), (n, k) => {
        const leaves = Array.from({ length: n }, leaf);
        const tree = buildTree(n, k, (i) => leaves[i]!, hash);
        const size = 2 ** k;
        expect(tree.blocks).toBe(Math.ceil(n / size));
        expect(tree.fullLeaves).toBe(Math.floor(n / size) * size);
        for (let b = 0; b < tree.blocks; b++) {
          expect(hex(tree.blockRoots.subarray(32 * b, 32 * b + 32))).toBe(hex(naiveRoot(leaves.slice(b * size, (b + 1) * size), k)));
        }
        for (let i = 0; i < tree.fullLeaves; i++) {
          let node = leaves[i]!;
          for (let l = 0; l < k; l++) {
            const sibling = tree.paths.subarray((i * k + l) * 32, (i * k + l + 1) * 32);
            node = ((i >> l) & 1) === 0 ? hash(node, sibling) : hash(sibling, node);
          }
          expect(hex(node)).toBe(hex(tree.blockRoots.subarray(32 * (i >> k), 32 * (i >> k) + 32)));
        }
        expect(hex(tree.root)).toBe(hex(naiveRoot(leaves, TREE_DEPTH)));
      }),
      { numRuns: 25 },
    );
    const levels = blockLevels(new Uint8Array(4 * 32), 2, hash);
    const out = new Uint8Array(64);
    writeLowerPath(levels, 3, out, 0);
    expect(hex(out.subarray(32))).toBe(hex(levels[1]!.subarray(0, 32)));
  });

  it("TailTree: from a build's states or from a snapshot's block roots, it follows appended outputs; block roots from T0 and the whole root", { timeout: 120_000 }, () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 30 }), fc.integer({ min: 0, max: 20 }), fc.integer({ min: 0, max: 3 }), (f, more, k) => {
        const leaves = Array.from({ length: f + more }, leaf);
        const built = buildTree(f, k, (i) => leaves[i]!, hash);
        const fromStates = TailTree.fromStates(k, hash, built.upper, built.partial);
        const fromSnapshot = TailTree.fromSnapshot(k, hash, built.blockRoots, f, (i) => leaves[i]!);
        const size = 2 ** k;
        const t0 = Math.floor(f / size) * size;
        for (const tail of [fromStates, fromSnapshot]) {
          expect([tail.t0, tail.next]).toEqual([t0, f]);
          for (let i = f; i < f + more; i++) tail.append(leaves[i]!);
          expect(tail.next).toBe(f + more);
          expect(hex(tail.root())).toBe(hex(naiveRoot(leaves, TREE_DEPTH)));
          const blocks = Math.ceil((f + more) / size) - t0 / size;
          const expected = Array.from({ length: Math.max(0, blocks) }, (_, j) => hex(naiveRoot(leaves.slice(t0 + j * size, t0 + (j + 1) * size), k))).join("");
          expect(hex(tail.blockRoots())).toBe(expected);
        }
      }),
      { numRuns: 25 },
    );
  });
});
