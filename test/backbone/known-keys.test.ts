import { describe, expect, it } from "vitest";
import {
  KNOWN_KEYS_MAX,
  KnownKeySet,
  keyText,
  type RunFault,
  RunReclaim,
} from "../../src/backbone/core-ledger-state/run-reclaim.js";
import { UmbraError } from "../../src/db/errors.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { hex } from "../ledger/node-format.js";
import { applied, haltReason, made, type MadeNode, type NodeTables, ref, runTables } from "./run-reclaim.js";

/**
 * The set of keys known to be rows (`src/backbone/core-ledger-state/run-reclaim.ts`'s `KnownKeySet`), which
 * `core-ledger-state` keeps from one settle to the next (`stored-keys.ts`), and the run computation over it:
 * - the set forgets, empties, and holds at most its bound: a key that would pass it empties it before it enters;
 * - the computation asks the database only about the referenced keys the set lacks, learns those found stored, and
 *   asks nothing when the set holds them all;
 * - a key the set holds whose row was deleted by hand, still queued: the cascade deletes it as a candidate that is no
 *   row, and the set drops it with the other keys the run deletes;
 * - three runs on one set: a key found stored by the first, deleted by the second, referenced by the third without
 *   being flushed: the third halts with `missing-reference`, since the second's deletion took the key out of the set.
 *   The negative control (`deleted-kept-known`: the deleted keys stay in the set) passes the third, which must fail.
 *
 * A run finding more keys stored than the set has room for is `known-keys-bound.test.ts` (kept out of the mutation run
 * for its time). Where the module empties the set, through its callbacks and through the process, is
 * `stored-keys.test.ts`; the process-level halt of the third run's case is `ledger-refcount-halts.test.ts`.
 */

/** The text of a distinct key for each `n`. */
const text = (n: number): string => keyText(keyOf(n));

/** A 32-byte key holding `n` in its last six bytes. */
function keyOf(n: number): Uint8Array {
  const key = Buffer.alloc(32);
  key.writeUIntBE(n, 26, 6);
  return new Uint8Array(key.buffer, key.byteOffset, 32);
}

/** A block's flush: `inserts`, and a root count raised for each of `persist`. */
const flush = (inserts: readonly MadeNode[], persist: readonly MadeNode[] = []): NodeBatch => ({
  inserts: inserts.map((node) => ({ key: node.keyBytes, data: node.data, children: node.children })),
  rootCounts: persist.map((node) => ({ key: node.keyBytes, delta: 1 })),
});

describe("the set of keys known to be rows", () => {
  it("forgets a key, a key it does not hold changing nothing, and is emptied by clear", () => {
    const known = new KnownKeySet(4);
    for (const n of [1, 2, 3]) known.learn(text(n));
    known.forget(text(2));
    known.forget(text(9));
    expect([known.has(text(1)), known.has(text(2)), known.has(text(3)), known.size]).toEqual([true, false, true, 2]);
    known.clear();
    expect([known.size, known.has(text(1))]).toEqual([0, false]);
  });

  it("at a bound of 4: keys up to it are kept, a key it holds adds nothing, and a key that would pass it empties it before it enters; never more than 4", () => {
    const known = new KnownKeySet(4);
    let most = 0;
    const learn = (n: number): void => {
      known.learn(text(n));
      most = Math.max(most, known.size);
    };
    for (const n of [1, 2, 3, 4]) learn(n);
    learn(1);
    learn(4);
    expect([known.size, known.emptied]).toEqual([4, 0]);
    // One key more would pass it: emptied, then the key enters.
    learn(5);
    expect([known.size, known.has(text(5)), known.has(text(1)), known.has(text(4)), known.emptied]).toEqual([1, true, false, false, 1]);
    for (const n of [6, 7, 8]) learn(n);
    learn(9);
    expect([known.size, known.has(text(9)), known.has(text(8)), known.emptied]).toEqual([1, true, false, 2]);
    expect(most).toBe(4);
    // Emptied by clear while it holds a key counts; an empty set cleared does not.
    known.clear();
    known.clear();
    expect([known.size, known.emptied]).toEqual([0, 3]);
    // A bound below one key is refused.
    for (const bound of [0, -1, 1.5, Number.NaN]) expect(() => new KnownKeySet(bound), `${bound}`).toThrow(RangeError);
    const one = new KnownKeySet(1);
    one.learn(text(1));
    one.learn(text(2));
    expect([one.size, one.has(text(2)), one.emptied]).toEqual([1, true, 1]);
  });

  it("at its bound of 500,000: keys up to it are kept, and the key after them empties it first; never more", () => {
    expect(KNOWN_KEYS_MAX).toBe(500_000);
    const known = new KnownKeySet();
    let most = 0;
    for (let n = 0; n < KNOWN_KEYS_MAX; n++) {
      known.learn(text(n));
      if (known.size > most) most = known.size;
    }
    expect([known.size, most, known.emptied]).toEqual([KNOWN_KEYS_MAX, KNOWN_KEYS_MAX, 0]);
    known.learn(text(0));
    expect([known.size, known.emptied]).toEqual([KNOWN_KEYS_MAX, 0]);
    known.learn(text(KNOWN_KEYS_MAX));
    expect([known.size, known.has(text(KNOWN_KEYS_MAX)), known.has(text(0)), known.emptied]).toEqual([1, true, false, 1]);
  });
});

describe("the computation over a set kept from one run to the next", () => {
  it("asks the database only about the referenced keys the set lacks, learns those found stored, and asks nothing when it holds them all", async () => {
    const [k1, k2, k3, k8] = (["k1", "k2", "k3", "k8"] as const).map((name) => made(name)) as [MadeNode, MadeNode, MadeNode, MadeNode];
    // k1, k2 and k3 are rows; k8 is not.
    const tables: NodeTables = { rows: new Map([k1, k2, k3].map((node) => [node.key, node.children])), refs: new Map(), queue: new Set() };
    const known = new KnownKeySet();
    const asked: string[][] = [];
    const settle = (height: bigint, node: MadeNode): Promise<unknown> => {
      const read = runTables(tables, new Map([[node.key, 1]]));
      const run = new RunReclaim({ first: height, on: true });
      run.collect(height, flush([node], [node]), true);
      return run.compute({ ...read, missing: async (keys) => (asked.push(keys.map(hex).sort()), read.missing(keys)) }, known).catch((error: unknown) => error);
    };
    // p1 references k1, k2 and k8: the three are asked; k8 is no row, so the run halts; k1 and k2 were learned.
    expect(haltReason(await settle(1n, made("p1", [ref(k1), ref(k2), ref(k8)])))).toBe("missing-reference");
    expect(asked).toEqual([[k1.key, k2.key, k8.key].sort()]);
    expect([k1, k2, k3, k8].map((node) => known.has(keyText(node.keyBytes)))).toEqual([true, true, false, false]);
    // p2 references k1 and k3: only k3 is asked, and learned.
    expect(haltReason(await settle(2n, made("p2", [ref(k1), ref(k3)])))).toBeUndefined();
    expect(asked[1]).toEqual([k3.key]);
    expect(known.size).toBe(3);
    // p3 references k1, k2 and k3: the set holds them all, and the database is asked nothing.
    expect(haltReason(await settle(3n, made("p3", [ref(k1), ref(k2), ref(k3)])))).toBeUndefined();
    expect(asked).toHaveLength(2);
  });
});

describe("a key the set holds whose row was deleted by hand", () => {
  for (const fault of [undefined, "deleted-kept-known"] as const) {
    it(`${fault === undefined ? "" : "control: with deleted-kept-known, "}the cascade deletes it as a candidate that is no row, while it stays queued, and the set ${fault === undefined ? "drops" : "keeps"} it`, async () => {
      const k = made("k");
      const p1 = made("p1", [ref(k)]);
      const known = new KnownKeySet();
      const runOf = (height: bigint): RunReclaim => new RunReclaim({ first: height, on: true, ...(fault === undefined ? {} : { fault }) });
      // Run 1: p1, new and persisted, references k, a row: the missing read finds k stored, and the set learns it.
      const first = runOf(1n);
      first.collect(1n, flush([p1], [p1]), true);
      await first.compute(runTables({ rows: new Map([[k.key, k.children]]), refs: new Map(), queue: new Set() }, new Map([[p1.key, 1]])), known);
      expect(known.has(keyText(k.keyBytes))).toBe(true);
      // The tables damaged by hand: k's row gone, k queued with no reference and no root count. Run 2 flushes nothing.
      const second = runOf(2n);
      second.collect(2n, flush([]), true);
      const outcome = await second.compute(runTables({ rows: new Map(), refs: new Map(), queue: new Set([k.key]) }, new Map()), known);
      expect([outcome.net.deleted.map(hex), outcome.evict.map(hex)]).toEqual([[k.key], [k.key]]);
      expect(known.has(keyText(k.keyBytes))).toBe(fault !== undefined);
    });
  }
});

describe("a key found stored, deleted, and referenced again: three runs on one set", () => {
  /**
   * The three runs, each with `fault` (none in a build), on one set. Resolves with what the third did, and the keys
   * each `missing` read asked.
   */
  async function thirdRun(fault?: RunFault): Promise<{ readonly third: "halted" | "passed"; readonly asked: readonly string[][] }> {
    const c = made("c");
    const p0 = made("p0", [ref(c)]);
    const p1 = made("p1", [ref(c)]);
    const p2 = made("p2", [ref(c)]);
    const known = new KnownKeySet();
    const asked: string[][] = [];
    const settle = (height: bigint, tables: NodeTables, roots: ReadonlyMap<string, number>, inserts: readonly MadeNode[]) => {
      const run = new RunReclaim({ first: height, on: true, ...(fault === undefined ? {} : { fault }) });
      run.collect(height, flush(inserts, inserts), true);
      const read = runTables(tables, roots);
      return run.compute({ ...read, missing: async (keys) => (asked.push(keys.map(hex)), read.missing(keys)) }, known);
    };

    // Run 1: p0 and c are rows, p0 persisted. p1, new and persisted, references c: the missing read finds c stored.
    const before: NodeTables = { rows: new Map([[p0.key, p0.children], [c.key, c.children]]), refs: new Map([[c.key, 1]]), queue: new Set() };
    const one = await settle(1n, before, new Map([[p0.key, 1], [p1.key, 1]]), [p1]);
    expect(asked).toEqual([[c.key]]);
    expect(known.has(keyText(c.keyBytes))).toBe(true);
    expect(one.evict).toEqual([]);

    // Run 2: p0 and p1 are queued (both released since) and hold c's two references: the run deletes the three.
    const queued: NodeTables = {
      rows: new Map([[p0.key, p0.children], [p1.key, p1.children], [c.key, c.children]]),
      refs: new Map([[c.key, 2]]),
      queue: new Set([p0.key, p1.key]),
    };
    const two = await settle(2n, queued, new Map(), []);
    expect(two.net.deleted.map(hex).sort()).toEqual([p0.key, p1.key, c.key].sort());
    expect(asked).toHaveLength(1);

    // Run 3, on the tables run 2 left: p2, new and persisted, references c, which is no row and which it does not flush.
    const after = applied(queued, two.net).tables;
    expect(after.rows.size).toBe(0);
    try {
      await settle(3n, after, new Map([[p2.key, 1]]), [p2]);
    } catch (error) {
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).details).toMatchObject({ reason: "missing-reference", height: 3n, key: `0x${c.key}` });
      return { third: "halted", asked };
    }
    return { third: "passed", asked };
  }

  it("the third run halts with missing-reference: the run that deleted c took it out of the set, so the database is asked about c again", async () => {
    const { third, asked } = await thirdRun();
    expect(third).toBe("halted");
    expect(asked.map((keys) => keys.length)).toEqual([1, 1]);
  });

  it("control: with deleted-kept-known (the run keeps the keys it deletes in the set), the third run passes the check it must fail, the database not asked about c", async () => {
    const { third, asked } = await thirdRun("deleted-kept-known");
    expect(third).toBe("passed");
    expect(asked.map((keys) => keys.length)).toEqual([1]);
  });
});
