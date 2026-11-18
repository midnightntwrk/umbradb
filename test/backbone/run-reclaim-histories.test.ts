import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { type HistoryScript, historyScripts } from "./refcount-model.js";
import { againstModel, type Feed, modelBlocks, nothingSeen, onItsOwn, type Remade, remadeAgainstModel, type Seen } from "./run-reclaim.js";

/**
 * The reclamation of a run of blocks (`src/backbone/core-ledger-state/run-reclaim.ts`) on the generated histories, in
 * runs of many lengths, against the reference model (`./refcount-model.ts`): the long cases of the computation's
 * tests, kept apart from `./run-reclaim.test.ts` so that the mutation run, which takes that file's cases for each
 * mutant, is not held by them. They run in the suite as any test does.
 * - **T1.** At every run's end the node tables are the model's after the run's last block, in bytes, on the generated
 *   histories in one form, in runs of 1, 2, 3, 7 and 1,000 blocks, with the flushes of a package told of deletions at
 *   every block and of one told at a run's end only.
 * - **T3.** Histories whose nodes take two forms, in longer runs: the tables are sound at every run's end and hold the
 *   node set the roots of the last two heights give; and, each run made shorter one block at a time while its last
 *   block's replaced lists alone keep a node and it has more than one block, the model's tables in bytes.
 * - **T4.** A history whose `sweep` changes is the model's when a run ends at each change.
 */

const SEED = 20261115;
/** The generated histories of each case in the suite. */
const FULL_RUNS = 120;
/**
 * The generated histories of each case: {@link FULL_RUNS}, unless `UMBRADB_HISTORY_RUNS` says fewer. The mutation run
 * sets it (`vitest.mutation.config.ts`), so that the cases a mutant runs end sooner; the suite leaves it unset.
 */
const RUNS = ((): number => {
  const given = process.env.UMBRADB_HISTORY_RUNS;
  if (given === undefined || given === "") return FULL_RUNS;
  const runs = Number(given);
  if (!Number.isInteger(runs) || runs < 1 || runs > FULL_RUNS) throw new Error(`UMBRADB_HISTORY_RUNS is ${given}, not a whole number from 1 to ${FULL_RUNS}`);
  return runs;
})();
/**
 * A count that shows a case is not vacuous, set for {@link FULL_RUNS} histories; with fewer, a count above 0 is all
 * that is asked (a draw of a few histories need not reach the full count's share).
 */
const atLeast = (count: number): number => (RUNS === FULL_RUNS ? count : 0);
/** The longest history of the families that sweep throughout, so that a run of 1,000 holds a whole history. */
const LONG = 60;
const SIZES = [1, 2, 3, 7, 1_000] as const;
const FEEDS = ["per-block", "per-run"] as const satisfies readonly Feed[];

/** A history with `sweep` on at every block: no run ends early. */
const sweeping = (script: HistoryScript): HistoryScript => ({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });

/** The histories of T4: in one form, with `sweep` off over a stretch in the middle and on around it. */
const stretchOff = (script: HistoryScript): HistoryScript => {
  const from = Math.floor(script.blocks.length / 3);
  const to = Math.max(from + 1, Math.floor((2 * script.blocks.length) / 3));
  return { ...script, blocks: script.blocks.map((block, at) => ({ ...block, on: at < from || at >= to })) };
};

describe("T1: the run computation's tables are the reference model's at every run's end", () => {
  for (const [name, histories_] of [
    ["as drawn, a run ending at each change of sweep", historyScripts({ oneForm: true })],
    [`sweeping throughout, up to ${LONG} blocks`, historyScripts({ oneForm: true, maxBlocks: LONG }).map(sweeping)],
  ] as const) {
    it(`on the generated histories in one form, ${name}, in runs of ${SIZES.join(", ")}, both ways of flushing (seed ${SEED}, ${RUNS} runs)`, async () => {
      const seen = new Map<string, Seen>();
      let histories = 0;
      await fc.assert(
        fc.asyncProperty(histories_, async (script) => {
          histories += 1;
          for (const feed of FEEDS) {
            for (const size of SIZES) {
              const name = `${feed} ${size}`;
              if (!seen.has(name)) seen.set(name, nothingSeen());
              expect(await againstModel(script, { size, feed }, seen.get(name) as Seen)).toEqual([]);
            }
          }
        }),
        { seed: SEED, numRuns: RUNS },
      );
      expect(histories).toBeGreaterThanOrEqual(RUNS);
      const of = (feed: Feed, size: number): Seen => seen.get(`${feed} ${size}`) as Seen;
      for (const feed of FEEDS) {
        // Every size ran every block of every history.
        expect(of(feed, 1).blocks).toBeGreaterThan(atLeast(1_000));
        for (const size of SIZES) expect(of(feed, size).blocks).toBe(of(feed, 1).blocks);
        expect(of(feed, 1).runs).toBe(of(feed, 1).blocks);
        expect(of(feed, 1_000).runs).toBeLessThan(of(feed, 7).runs);
        // A long run never writes most of what its blocks hand over, deletes rows, and deletes more keys than rows:
        // the nodes written and deleted inside it were never rows.
        expect(of(feed, 1_000).written).toBeLessThan(of(feed, 1_000).handed * 0.9);
        expect(of(feed, 7).deleted).toBeGreaterThan(atLeast(100));
        expect(of(feed, 7).evicted).toBeGreaterThan(of(feed, 7).deleted);
        // No statement inside a run: the reads come once per run, whatever its length.
        expect(of(feed, 1_000).reads.queue).toBe(of(feed, 1_000).runs - of(feed, 1_000).off);
      }
      // A package told of deletions at a run's end only flushes fewer nodes: it still holds what a block deleted.
      expect(of("per-run", 7).handed).toBeLessThan(of("per-block", 7).handed);
      expect(of("per-run", 1).handed).toBe(of("per-block", 1).handed);
    }, 900_000);
  }
});

describe("T3: histories in two forms, in longer runs", () => {
  for (const [name, histories] of [
    ["as drawn", historyScripts({ oneForm: false, flushRule: true })],
    [`sweeping throughout, up to ${LONG} blocks`, historyScripts({ oneForm: false, flushRule: true, maxBlocks: LONG }).map(sweeping)],
  ] as const) {
    it(`${name}: sound at every run's end, with the node set of the roots of the last two heights, in runs of ${SIZES.join(", ")} (seed ${SEED}, ${RUNS} runs)`, async () => {
      const seen = new Map(SIZES.map((size) => [size, nothingSeen()] as const));
      await fc.assert(
        fc.asyncProperty(histories, async (script) => {
          for (const size of SIZES) expect(await onItsOwn(script, { size }, seen.get(size) as Seen)).toEqual([]);
        }),
        { seed: SEED, numRuns: RUNS },
      );
      for (const size of SIZES) {
        const of = seen.get(size) as Seen;
        expect(of.blocks).toBeGreaterThan(atLeast(1_000));
        // Not vacuous: rows are written over with another child list and rows are deleted (a whole history in one
        // run finds no row), and nodes are deleted.
        if (size <= 7) expect(of.replaced).toBeGreaterThan(atLeast(50));
        if (size <= 7) expect(of.deleted).toBeGreaterThan(atLeast(100));
        expect(of.evicted).toBeGreaterThan(atLeast(1_000));
      }
    }, 900_000);
  }
});

describe("T3: histories in two forms, each run made shorter while its last block's replaced lists alone keep a node", () => {
  for (const [name, histories] of [
    ["as drawn", historyScripts({ oneForm: false, flushRule: true })],
    [`sweeping throughout, up to ${LONG} blocks`, historyScripts({ oneForm: false, flushRule: true, maxBlocks: LONG }).map(sweeping)],
  ] as const) {
    it(`${name}: the model's tables in bytes at every run's end, in runs of ${SIZES.filter((size) => size > 1).join(", ")} (seed ${SEED}, ${RUNS} runs)`, async () => {
      // The flushes are the model's own (a package told of every block's deletions); a run whose last block's
      // replaced lists alone keep a node is computed again without that block, as many times as that takes, down to
      // one block.
      const sizes = SIZES.filter((size) => size > 1);
      const seen = new Map(sizes.map((size) => [size, { runs: 0, remade: 0, kept: 0, replaced: 0, longest: 0, oneBlockKept: 0 } as Remade] as const));
      await fc.assert(
        fc.asyncProperty(histories, async (script) => {
          const blocks = modelBlocks(script);
          for (const size of sizes) expect(await remadeAgainstModel(blocks, size, seen.get(size) as Remade)).toEqual([]);
        }),
        { seed: SEED, numRuns: RUNS },
      );
      for (const size of sizes) {
        const of = seen.get(size) as Remade;
        // Not vacuous: runs are made shorter, rows are written over with another child list.
        expect(of.remade, `runs of ${size}`).toBeGreaterThan(atLeast(20));
        // One run is made shorter more than once where it can be, and runs of one block are committed with a node
        // their block's replaced lists alone keep: the procedure's both ends are reached.
        // (Reached on the full histories; with fewer, a draw need not reach them.)
        if (size >= 3 && RUNS === FULL_RUNS) expect(of.longest, `runs of ${size}`).toBeGreaterThanOrEqual(2);
        if (RUNS === FULL_RUNS) expect(of.oneBlockKept, `runs of ${size}`).toBeGreaterThan(0);
        if (size <= 7) expect(of.replaced, `runs of ${size}`).toBeGreaterThan(atLeast(50));
      }
    }, 900_000);
  }
});

describe("T4: sweep off, and a change of sweep", () => {
  it(`a history whose sweep is off over a stretch is the model's at every run's end, a run ending at each change (seed ${SEED}, ${RUNS} runs)`, async () => {
    const seen = new Map<string, Seen>();
    await fc.assert(
      fc.asyncProperty(historyScripts({ oneForm: true }).map(stretchOff), async (script) => {
        for (const feed of FEEDS) {
          for (const size of SIZES) {
            const name = `${feed} ${size}`;
            if (!seen.has(name)) seen.set(name, nothingSeen());
            expect(await againstModel(script, { size, feed }, seen.get(name) as Seen)).toEqual([]);
          }
        }
      }),
      { seed: SEED, numRuns: RUNS },
    );
    for (const feed of FEEDS) {
      const whole = seen.get(`${feed} 1000`) as Seen;
      // Each history is three runs at most: on, off, on.
      expect(whole.runs).toBeLessThanOrEqual(3 * RUNS * 2);
      expect(whole.off).toBeGreaterThanOrEqual(RUNS);
      // The queue is read whole once per run that sweeps, and by key in the others.
      expect(whole.reads.queue).toBe(whole.runs - whole.off);
      expect(whole.reads.queued).toBeGreaterThan(0);
      expect(whole.reads.queued).toBeLessThanOrEqual(whole.off);
    }
  }, 900_000);
});
