import { describe, expect, it } from "vitest";
import {
  KNOWN_KEYS_MAX,
  type KnownKeys,
  KnownKeySet,
  keyText,
  RunReclaim,
  type RunTables,
} from "../../src/backbone/core-ledger-state/run-reclaim.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { made, type MadeNode } from "./run-reclaim.js";

/**
 * The set of keys known to be rows (`src/backbone/core-ledger-state/run-reclaim.ts`'s `KnownKeySet`) at its bound,
 * through the run computation: a run whose `missing` read finds more keys stored than the set has room for leaves it
 * at most at its bound, and runs that reference only keys it holds ask the database nothing. Apart from
 * `known-keys.test.ts` because it takes about a second, which the mutation run of `run-reclaim.ts` would spend on
 * every mutant it covers.
 */

/** A 32-byte key holding `n` in its last six bytes. */
function keyOf(n: number): Uint8Array {
  const key = Buffer.alloc(32);
  key.writeUIntBE(n, 26, 6);
  return new Uint8Array(key.buffer, key.byteOffset, 32);
}

/** The text of a distinct key for each `n`. */
const text = (n: number): string => keyText(keyOf(n));

/** A block's flush: `inserts`, and a root count raised for each of `persist`. */
const flush = (inserts: readonly MadeNode[], persist: readonly MadeNode[] = []): NodeBatch => ({
  inserts: inserts.map((node) => ({ key: node.keyBytes, data: node.data, children: node.children })),
  rootCounts: persist.map((node) => ({ key: node.keyBytes, delta: 1 })),
});

/** `known`, with the most keys it held after any key entered recorded in `seen.most`. */
function watched(known: KnownKeySet, seen: { most: number }): KnownKeys {
  return {
    has: (key) => known.has(key),
    learn(key) {
      known.learn(key);
      seen.most = Math.max(seen.most, known.size);
    },
    forget: (key) => known.forget(key),
  };
}

/** Tables in which every key a `missing` read is given is stored, and the run's own nodes are new; counted in `reads`. */
function everyReferenceStored(reads: { calls: number; keys: number }): RunTables {
  return {
    rows: async () => [],
    changed: async () => [],
    async missing(keys) {
      reads.calls += 1;
      reads.keys += keys.length;
      return [];
    },
    queue: async () => [],
    queued: async () => [],
    // Only the keys a run raises are asked here: each is new, with no reference, and a root count after the run.
    counts: async (keys) => keys.map((key) => ({ key, row: false, refs: 0, roots: 1 })),
    children: async () => [],
  };
}

describe("the computation over a set at its bound", () => {
  it("a run whose missing read finds 200,000 keys stored, on a set at its bound of 500,000, leaves it holding those 200,000 and never more than the bound; runs that reference only them ask the database nothing", async () => {
    const known = new KnownKeySet();
    for (let n = 0; n < KNOWN_KEYS_MAX; n++) known.learn(text(1_000_000 + n));
    expect(known.size).toBe(KNOWN_KEYS_MAX);
    const seen = { most: known.size };
    const reads = { calls: 0, keys: 0 };
    const stored = Array.from({ length: 200_000 }, (_, n) => keyOf(n));
    // 200 new nodes, each persisted, each referencing 1,000 of the stored keys.
    const parents = Array.from({ length: 200 }, (_, i) => made(`parent ${i}`, stored.slice(i * 1_000, (i + 1) * 1_000).map((key) => ({ ref: key }))));
    const first = new RunReclaim({ first: 1n, on: true });
    first.collect(1n, flush(parents, parents), true);
    await first.compute(everyReferenceStored(reads), watched(known, seen));
    expect([reads.calls, reads.keys]).toEqual([1, 200_000]);
    expect([known.size, known.emptied, known.has(text(1_000_000))]).toEqual([200_000, 1, false]);
    expect(seen.most).toBeLessThanOrEqual(KNOWN_KEYS_MAX);
    // Five runs, each a new node referencing 1,100 of them: answered from the set, the set unchanged.
    for (let height = 2; height <= 6; height++) {
      const node = made(`node ${height}`, stored.slice(height * 1_000, height * 1_000 + 1_100).map((key) => ({ ref: key })));
      const run = new RunReclaim({ first: BigInt(height), on: true });
      run.collect(BigInt(height), flush([node], [node]), true);
      await run.compute(everyReferenceStored(reads), watched(known, seen));
    }
    expect([reads.calls, reads.keys, known.size, known.emptied]).toEqual([1, 200_000, 200_000, 1]);
    expect(seen.most).toBeLessThanOrEqual(KNOWN_KEYS_MAX);
  }, 120_000);

});
