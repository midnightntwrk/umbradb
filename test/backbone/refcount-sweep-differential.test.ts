import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  driveHistory,
  type HistoryScript,
  historyScripts,
  nodeSet,
  oracle,
  RefcountModel,
  type RefcountFault,
} from "./refcount-model.js";
import { SweepModel } from "./sweep-model.js";

/**
 * The reference model of reference counting (`./refcount-model.ts`) against the sweep's reference model
 * (`./sweep-model.ts`), both fed the same batches, on generated histories of admissible batches in which every key is
 * written with one child list throughout, deletions and re-insertions included. The sweep's model keeps a node's
 * first child list and counting its last, so they are compared by node set: every key a model holds as a row or
 * embedded in a row. [LG-14, R2]
 *
 * - With a budget that lets every cycle start and end in its block, the node sets are equal at every height: the sweep
 *   keeps what the roots before the block and the keys that rose in it reach, which is what counting keeps for an
 *   admissible batch with no rewrite.
 * - With a budget of 50, a cycle spans blocks and the sweep deletes later, so counting's node set is a subset of the
 *   sweep's at every height.
 * - The committed negative control: counting with its cascade stopped after the first round keeps the rows below a
 *   deleted one, and differs from the sweep where each cycle fits.
 */

/** The fast-check seed and run count of the properties here. */
const SEED = 20261104;
const RUNS = 150;
/** A budget no generated history's cycle reaches: each cycle starts and ends in its block. */
const WHOLE_CYCLE = 1_000_000;

/** What a comparison saw, across the histories of one property. */
interface Seen {
  heights: number;
  deleted: number;
  writtenAgain: number;
  sweepOff: number;
  strictSubset: number;
  cycleUnfinished: number;
}

const seen = (): Seen => ({
  heights: 0,
  deleted: 0,
  writtenAgain: 0,
  sweepOff: 0,
  strictSubset: 0,
  cycleUnfinished: 0,
});

/**
 * Runs `script` through counting (with `fault`, if any) and the sweep's model with `budget`; the first height whose
 * node sets do not stand in `relation`, or null. Every batch is checked to be admissible and every key's child list
 * to be the one written for it first.
 */
function compare(
  script: HistoryScript,
  budget: number,
  relation: "equal" | "subset",
  counts: Seen,
  fault?: RefcountFault,
): string | null {
  const sweep = new SweepModel(budget);
  const lists = new Map<string, Uint8Array>();
  for (const block of driveHistory(script, new RefcountModel(fault))) {
    const h = block.height;
    for (const { key, children } of block.batch.inserts) {
      const first = lists.get(key);
      if (first === undefined) lists.set(key, children);
      else if (Buffer.compare(first, children) !== 0) return `height ${h}: ${key} is written in another form`;
    }
    if (!oracle(block).admissible) return `height ${h}: the batch is not admissible`;
    const swept = sweep.block(
      {
        inserts: block.batch.inserts.map(({ key, children }) => ({ key, children })),
        deltas: block.batch.rootCounts.map(({ key, delta }) => ({ key, delta })),
      },
      block.script.on,
    );
    if (block.script.on && swept.phase !== "idle") {
      if (budget === WHOLE_CYCLE) return `height ${h}: the sweep's cycle does not end in its block`;
      counts.cycleUnfinished += 1;
    }
    const counted = nodeSet(block.step.after.rows);
    const held = nodeSet(swept.nodes.map((key) => [key, lists.get(key) as Uint8Array] as const));
    const onlyCounted = [...counted].filter((key) => !held.has(key)).sort();
    const onlySwept = [...held].filter((key) => !counted.has(key)).sort();
    if (onlyCounted.length > 0 || (relation === "equal" && onlySwept.length > 0)) {
      const only = (keys: readonly string[]): string => `[${keys.join(", ")}]`;
      const which = `only counting holds ${only(onlyCounted)}, only the sweep ${only(onlySwept)}`;
      return `node sets differ at height ${h}: ${which}`;
    }
    counts.heights += 1;
    counts.deleted += block.step.deleted.length;
    counts.writtenAgain += block.step.newNodes.filter((key) => block.before.lists.has(key)).length;
    if (!block.script.on) counts.sweepOff += 1;
    if (onlySwept.length > 0) counts.strictSubset += 1;
  }
  return null;
}

describe("R2: the counting model's node set against the sweep's model's, on admissible batches in one form", () => {
  it(`equals it at every height when each cycle fits in one block (seed ${SEED}, ${RUNS} runs)`, () => {
    const counts = seen();
    fc.assert(
      fc.property(historyScripts({ oneForm: true }), (script) => {
        expect(compare(script, WHOLE_CYCLE, "equal", counts)).toBeNull();
      }),
      { seed: SEED, numRuns: RUNS },
    );
    // Not vacuous: rows were deleted and written again, and `sweep` was off at some heights.
    expect(counts.heights).toBeGreaterThan(1_000);
    expect(counts.deleted).toBeGreaterThan(500);
    expect(counts.writtenAgain).toBeGreaterThan(50);
    expect(counts.sweepOff).toBeGreaterThan(50);
  });

  it(`is a subset of it at every height with a budget of 50 (seed ${SEED}, ${RUNS} runs)`, () => {
    const counts = seen();
    fc.assert(
      fc.property(historyScripts({ oneForm: true }), (script) => {
        expect(compare(script, 50, "subset", counts)).toBeNull();
      }),
      { seed: SEED, numRuns: RUNS },
    );
    // Not vacuous: cycles spanned blocks, and the sweep held more than counting at some heights.
    expect(counts.cycleUnfinished).toBeGreaterThan(50);
    expect(counts.strictSubset).toBeGreaterThan(50);
  });

  it(`negative control: the cascade stopped after its first round differs where each cycle fits (seed ${SEED})`, () => {
    const result = fc.check(
      fc.property(historyScripts({ oneForm: true }), (script) => {
        const difference = compare(script, WHOLE_CYCLE, "equal", seen(), "first-round-only");
        if (difference !== null) throw new Error(difference);
      }),
      { seed: SEED, numRuns: RUNS, endOnFailure: true },
    );
    expect(result.failed).toBe(true);
    // Counting kept rows the sweep deleted: the rows below the first round's.
    expect(String(result.errorInstance)).toMatch(/node sets differ at height \d+: only counting holds \[\w/);
  });
});
