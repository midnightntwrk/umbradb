import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { type RunCheck, type RunFault, RunReclaim } from "../../src/backbone/core-ledger-state/run-reclaim.js";
import { hex } from "../ledger/node-format.js";
import { type HistoryScript, historyScripts } from "./refcount-model.js";
import {
  againstModel,
  applied,
  embedded,
  haltReason,
  inconsistencies,
  inRuns,
  made,
  madeBlocks,
  type ModelBlock,
  modelBlocks,
  NO_TABLES,
  ref,
  remadeAgainstModel,
  runTables,
} from "./run-reclaim.js";

/**
 * The negative controls of the reclamation of a run of blocks (`src/backbone/core-ledger-state/run-reclaim.ts`), on
 * the computation alone: each puts one fault into it through its seam ({@link RunFault}), or leaves one check out
 * ({@link RunCheck}), and what `./run-reclaim.test.ts` requires of the build must then fail, for that fault's own
 * reason. One control per rule of the computation:
 *
 * | Rule | Fault | Fails by |
 * |---|---|---|
 * | the last child list written wins | `first-list-kept` | the rows are not the model's |
 * | the flush rule is checked | `unreached-node` left out | a node nothing reaches is not kept the block the model keeps it |
 * | step 1 | `unchanged-counted` | `ref_counts` is not the model's |
 * | step 2 | `increment-once-per-parent`, `second-occurrence-not-decremented` | `ref_counts` is not the model's |
 * | step 3 | `missing-reference` left out | the tables break closure |
 * | step 3, at the block that needs it | `judged-at-end` | a reference a later block supplies, and a count below 0 that a later block brings back, commit |
 * | step 4, the roots after the block before the last | `released-in-block` | the state the last block releases is gone |
 * | step 4, the last block's protection only | `run-as-one-block` | `unexpected-queued`; without that check, rows the model deleted |
 * | step 4, what the last block's replaced lists referenced | `dropped-unprotected` | a row the model keeps is gone |
 * | a run made again when only those lists keep a node | kept as computed (the test helper's `remakes` false) | on histories in two forms the rows are not the model's |
 * | step 5 | `old-queue-only` | `unexpected-queued`; without that check, rows the model deleted |
 * | step 6 | `first-round-only`, `referenced-queued-deleted` | `unexpected-queued`; a row the model keeps is gone |
 * | step 7 | each check left out, under a fault only it finds | a count of -1 reaches the net write; the nodes a cut cascade leaves are stored |
 * | step 8 | `queue-change-dropped` | `unreferenced` is not the model's |
 * | one setting of sweep per run | a run not ended at a change of sweep | the tables are not the model's |
 *
 * The controls of the net write's statements need a database and are not here.
 */

const SEED = 20261115;
const RUNS = 120;

/** A history with `sweep` on at every block. */
const sweeping = (script: HistoryScript): HistoryScript => ({ ...script, blocks: script.blocks.map((block) => ({ ...block, on: true })) });
const oneForm = historyScripts({ oneForm: true }).map(sweeping);
const twoForms = historyScripts({ oneForm: false, flushRule: true }).map(sweeping);

/**
 * The first finding of the comparison with the model over `histories`, in runs of each of `sizes`, with the
 * computation given `fault` and `unchecked`; the build gives none, and a control must give one.
 */
async function finding(
  histories: fc.Arbitrary<HistoryScript>,
  sizes: readonly number[],
  given: { readonly fault?: RunFault; readonly unchecked?: RunCheck; readonly cutAtSweep?: boolean },
): Promise<string> {
  const result = await fc.check(
    fc.asyncProperty(histories, async (script) => {
      for (const size of sizes) {
        const found = await againstModel(script, { size, feed: "per-block", ...given });
        if (found.length > 0) throw new Error(found.join("\n"));
      }
    }),
    { seed: SEED, numRuns: RUNS, endOnFailure: true },
  );
  expect(result.failed, `no finding with ${JSON.stringify(given)}`).toBe(true);
  return String(result.errorInstance);
}

describe("negative controls: the build's findings are none", () => {
  it("on the histories every control below runs over", async () => {
    for (const [histories, sizes] of [
      [oneForm, [1, 2, 3, 7]],
      [twoForms, [1]],
    ] as const) {
      const result = await fc.check(
        fc.asyncProperty(histories, async (script) => {
          for (const size of sizes) {
            const found = await againstModel(script, { size, feed: "per-block" });
            if (found.length > 0) throw new Error(found.join("\n"));
          }
        }),
        { seed: SEED, numRuns: RUNS, endOnFailure: true },
      );
      expect(result.failed, String(result.errorInstance)).toBe(false);
    }
  }, 600_000);
});

describe("negative controls: a fault in the run computation", () => {
  const c = made("c");
  const wEmbedding = made("w", [embedded(c)]);
  const wReferencing = made("w", [ref(c)]);

  it("first-list-kept: the run keeps the first child list flushed for a key, and the rows are not the model's", async () => {
    const [r1, r2] = [made("r1", [ref(wEmbedding)]), made("r2", [ref(wReferencing)])];
    const blocks = madeBlocks([
      { inserts: [wEmbedding, r1], persist: [r1] },
      { inserts: [c, wReferencing, r2], persist: [r2], release: [r1] },
    ]);
    expect(await inRuns(blocks, { size: 2, feed: "per-block" })).toEqual([]);
    const found = await inRuns(blocks, { size: 2, feed: "per-block", fault: "first-list-kept" });
    // The node keeps its first list, and the child only the second references is not written.
    expect(found.join("\n")).toMatch(/after 1, runs of 2, per-block: nodes differs: 1 rows the model lacks .*, 2 it has and these lack/);
  });

  it("the flush rule not checked: a node nothing reaches, flushed by a run's last block, is not kept the block the model keeps it", async () => {
    const [a, orphan] = [made("a"), made("orphan")];
    const r1 = made("r1", [ref(a)]);
    const blocks = madeBlocks([{ inserts: [] }, { inserts: [a, orphan, r1], persist: [r1] }]);
    expect((blocks[1] as ModelBlock).step.after.queue.has(orphan.key)).toBe(true);
    expect((await inRuns(blocks, { size: 2, feed: "per-block" })).join("\n")).toMatch(/halt unreached-node/);
    const found = await inRuns(blocks, { size: 2, feed: "per-block", unchecked: "unreached-node" });
    expect(found.join("\n")).toMatch(/nodes differs: 0 rows the model lacks \(\), 1 it has and these lack/);
    expect(found.join("\n")).toMatch(/unreferenced differs/);
  });

  it(`unchanged-counted: a node flushed with its row's child list is counted again, and ref_counts is not the model's (seed ${SEED})`, async () => {
    expect(await finding(oneForm, [1, 3], { fault: "unchanged-counted" })).toMatch(/ref_counts differs: 1 rows the model lacks \(\w+\), 1 it has and these lack/);
  }, 600_000);

  it(`increment-once-per-parent, second-occurrence-not-decremented: a repeated child counted once one way, and ref_counts is not the model's (seed ${SEED})`, async () => {
    // Counted once when added: the count is below its references while the parent is stored.
    expect(await finding(oneForm, [1, 3], { fault: "increment-once-per-parent" })).toMatch(/ref_counts differs: 1 rows the model lacks \(\w+\), 1 it has and these lack/);
    // Subtracted once when its parent goes: the count stays above its references.
    expect(await finding(oneForm, [1, 3], { fault: "second-occurrence-not-decremented" })).toMatch(/ref_counts differs: 1 rows the model lacks \(\w+\), 1 it has and these lack/);
  }, 600_000);

  it("missing-reference not checked: a flushed node that references a key stored nowhere reaches the tables, which break closure", async () => {
    const x = made("x");
    const r = made("r", [ref(x)]);
    const compute = async (unchecked?: RunCheck) => {
      const reclaim = new RunReclaim({ first: 0n, last: 0n, on: true, ...(unchecked === undefined ? {} : { unchecked }) });
      reclaim.collect(0n, { inserts: [{ key: r.keyBytes, data: r.data, children: r.children }], rootCounts: [{ key: r.keyBytes, delta: 1 }] }, true);
      return reclaim.compute(runTables(NO_TABLES, new Map()));
    };
    expect(haltReason(await compute().catch((error: unknown) => error))).toBe("missing-reference");
    const outcome = await compute("missing-reference");
    const next = applied(NO_TABLES, outcome.net);
    expect(inconsistencies(next.tables, new Map([[r.key, 1]])).join("\n")).toMatch(new RegExp(`closure: ${r.key.slice(0, 12)} references ${x.key.slice(0, 12)}, which is no row`));
  });

  it("judged-at-end: step 3 judged once at the run's end lets through a reference a later block supplies, and a count below 0 that a later block brings back", async () => {
    const data = Uint8Array.of(7);
    const flushed = (...nodes: readonly ReturnType<typeof made>[]) => nodes.map((node) => ({ key: node.keyBytes, data, children: node.children }));
    const raise = (...nodes: readonly ReturnType<typeof made>[]) => nodes.map((node) => ({ key: node.keyBytes, delta: 1 }));
    const outcomeOf = (work: Promise<unknown>) => work.then((given) => given, (error: unknown) => `${haltReason(error) ?? String(error)} at ${String((error as { details?: { height?: bigint } }).details?.height)}`);
    // Block 1 writes r1 over x, which block 2 is the first to flush.
    const x = made("x");
    const [r1, r2] = [made("r1", [ref(x)]), made("r2", [ref(x)])];
    const late = async (fault?: RunFault) => {
      const reclaim = new RunReclaim({ first: 1n, last: 2n, on: true, ...(fault === undefined ? {} : { fault }) });
      reclaim.collect(1n, { inserts: flushed(r1), rootCounts: raise(r1) }, true);
      reclaim.collect(2n, { inserts: flushed(x, r2), rootCounts: [...raise(r2), { key: r1.keyBytes, delta: -1 }] }, true);
      return outcomeOf(reclaim.compute(runTables(NO_TABLES, new Map([[r1.key, 1]]))));
    };
    expect(await late()).toBe("missing-reference at 1");
    expect(typeof (await late("judged-at-end"))).toBe("object");
    // Block 1 takes c below 0 on tables that count it 0 though w's stored list references it; block 2 brings it back.
    const r0 = made("r0", [ref(wReferencing)]);
    const [s1, p] = [made("s1", [ref(wEmbedding)]), made("p", [ref(c)])];
    const found = { rows: new Map([[r0.key, r0.children], [wReferencing.key, wReferencing.children], [c.key, c.children]]), refs: new Map([[wReferencing.key, 1]]), queue: new Set([c.key]) };
    const roots = new Map([[r0.key, 1], [s1.key, 1]]);
    const falls = async (fault?: RunFault) => {
      const reclaim = new RunReclaim({ first: 1n, last: 2n, on: true, ...(fault === undefined ? {} : { fault }) });
      reclaim.collect(1n, { inserts: flushed(wEmbedding, s1), rootCounts: raise(s1) }, true);
      reclaim.collect(2n, { inserts: flushed(p), rootCounts: raise(p) }, true);
      return outcomeOf(reclaim.compute(runTables(found, roots)));
    };
    expect(await falls()).toBe("negative-count at 1");
    // With the fault the run commits, and its tables break closure: the cascade deleted c, which p references.
    const outcome = await falls("judged-at-end");
    expect(typeof outcome).toBe("object");
    const next = applied(found, (outcome as Awaited<ReturnType<RunReclaim["compute"]>>).net);
    expect(inconsistencies(next.tables, new Map([...roots, [p.key, 1]])).join("\n")).toMatch(new RegExp(`closure: ${p.key.slice(0, 12)} references ${c.key.slice(0, 12)}, which is no row`));
  });

  it(`released-in-block: without the roots after the block before the last, the state the last block releases is gone (seed ${SEED})`, async () => {
    expect(await finding(oneForm, [1, 2, 7], { fault: "released-in-block" })).toMatch(/nodes differs: 0 rows the model lacks \(\), \d+ it has and these lack/);
  }, 600_000);

  it(`run-as-one-block: the per-block step's protection and frontier over a whole run keep what the model deleted (seed ${SEED})`, async () => {
    // A run of one block is the per-block step, so the fault changes nothing there.
    const single = await fc.check(
      fc.asyncProperty(oneForm, async (script) => {
        const found = await againstModel(script, { size: 1, feed: "per-block", fault: "run-as-one-block" });
        if (found.length > 0) throw new Error(found.join("\n"));
      }),
      { seed: SEED, numRuns: RUNS, endOnFailure: true },
    );
    expect(single.failed, String(single.errorInstance)).toBe(false);
    // In a longer run the states inside it stay, queued: the check on the queue halts.
    expect(await finding(oneForm, [3], { fault: "run-as-one-block" })).toMatch(/halt unexpected-queued/);
    // Without that check they are stored.
    expect(await finding(oneForm, [3], { fault: "run-as-one-block", unchecked: "unexpected-queued" })).toMatch(/nodes differs: \d+ rows the model lacks \(\w+/);
  }, 600_000);

  it(`dropped-unprotected: a key that a list replaced by the last block referenced is deleted in that block (seed ${SEED})`, async () => {
    expect(await finding(twoForms, [1], { fault: "dropped-unprotected" })).toMatch(/nodes differs: 0 rows the model lacks \(\), \d+ it has and these lack/);
  }, 600_000);

  it(`old-queue-only: the cascade started from the queue the run found only leaves the run's own garbage (seed ${SEED})`, async () => {
    expect(await finding(oneForm, [3, 7], { fault: "old-queue-only" })).toMatch(/halt unexpected-queued/);
    expect(await finding(oneForm, [3, 7], { fault: "old-queue-only", unchecked: "unexpected-queued" })).toMatch(/nodes differs: \d+ rows the model lacks \(\w+/);
  }, 600_000);

  it(`first-round-only, referenced-queued-deleted: the cascade cut short, and a queued key deleted though a new node references it (seed ${SEED})`, async () => {
    expect(await finding(oneForm, [1, 3], { fault: "first-round-only" })).toMatch(/halt unexpected-queued/);
    expect(await finding(oneForm, [1, 3], { fault: "referenced-queued-deleted" })).toMatch(/nodes differs: 0 rows the model lacks \(\), \d+ it has and these lack/);
  }, 600_000);

  it(`the two checks of step 7 left out, each under a fault only it finds (seed ${SEED})`, async () => {
    // negative-count: a parent of a repeated child, made and released inside a run. Its list adds one reference
    // under the fault and takes two back, so the child's count would be -1: the check halts, and without it the
    // count reaches the net write.
    const parent = made("p", [ref(c), ref(c)]);
    const [r0, r1, r2] = [made("r0", [ref(parent)]), made("r1"), made("r2")];
    const blocks = madeBlocks([
      { inserts: [c, parent, r0], persist: [r0] },
      { inserts: [r1], persist: [r1], release: [r0] },
      { inserts: [r2], persist: [r2], release: [r1] },
    ]);
    expect(await inRuns(blocks, { size: 3, feed: "per-block" })).toEqual([]);
    expect((await inRuns(blocks, { size: 3, feed: "per-block", fault: "increment-once-per-parent" })).join("\n")).toMatch(/halt negative-count/);
    const below = (await inRuns(blocks, { size: 3, feed: "per-block", fault: "increment-once-per-parent", unchecked: "negative-count" })).join("\n");
    expect(below).not.toMatch(/halt/);
    expect(below).toMatch(new RegExp(`the count of ${c.key.slice(0, 12)} falls to -1`));
    // unexpected-queued: the nodes the cut cascade leaves are stored and queued.
    const left = await finding(oneForm, [1, 3], { fault: "first-round-only", unchecked: "unexpected-queued" });
    expect(left).not.toMatch(/halt/);
    expect(left).toMatch(/nodes differs: \d+ rows the model lacks \(\w+/);
  }, 600_000);

  it(`a run kept as computed, though its last block's replaced lists alone keep a node: on histories in two forms the tables are not the model's (seed ${SEED})`, async () => {
    const result = await fc.check(
      fc.asyncProperty(twoForms, async (script) => {
        const blocks = modelBlocks(script);
        for (const size of [2, 3, 7]) {
          const found = await remadeAgainstModel(blocks, size, { runs: 0, remade: 0, kept: 0, replaced: 0 }, false);
          if (found.length > 0) throw new Error(found.join("\n"));
        }
      }),
      { seed: SEED, numRuns: RUNS, endOnFailure: true },
    );
    expect(result.failed).toBe(true);
    // The rows more are the nodes only a replaced list referenced, kept and queued.
    expect(String(result.errorInstance)).toMatch(/nodes differs: \d+ rows the model lacks \(\w+.*\), 0 it has and these lack/);
    expect(String(result.errorInstance)).toMatch(/unreferenced differs/);
  }, 600_000);

  it(`queue-change-dropped: one key's change of the queue left out of the net write (seed ${SEED})`, async () => {
    expect(await finding(oneForm, [1, 3], { fault: "queue-change-dropped" })).toMatch(/unreferenced differs/);
  }, 600_000);

  it(`a run not ended at a change of sweep is not the model's (seed ${SEED})`, async () => {
    // Sweep off over a stretch in the middle: a run that spans a change takes its first block's setting.
    const stretchOff = historyScripts({ oneForm: true }).map((script) => {
      const from = Math.floor(script.blocks.length / 3);
      const to = Math.max(from + 1, Math.floor((2 * script.blocks.length) / 3));
      return { ...script, blocks: script.blocks.map((block, at) => ({ ...block, on: at < from || at >= to })) };
    });
    expect(await finding(stretchOff, [7, 1_000], { cutAtSweep: false })).toMatch(/nodes differs|unreferenced differs/);
    // Ended at each change, the same histories are the model's.
    const cut = await fc.check(
      fc.asyncProperty(stretchOff, async (script) => {
        for (const size of [7, 1_000]) {
          const found = await againstModel(script, { size, feed: "per-block" });
          if (found.length > 0) throw new Error(found.join("\n"));
        }
      }),
      { seed: SEED, numRuns: RUNS, endOnFailure: true },
    );
    expect(cut.failed, String(cut.errorInstance)).toBe(false);
  }, 600_000);

  it("gives every key back as its own bytes under a fault too", async () => {
    // The seams change what is computed, not how keys leave: a control's deleted keys are still plain keys.
    const blocks = madeBlocks([{ inserts: [c, wReferencing], persist: [wReferencing] }, { inserts: [], release: [wReferencing] }, { inserts: [] }]);
    const reclaim = new RunReclaim({ first: 0n, last: 2n, on: true, fault: "first-round-only", unchecked: "unexpected-queued" });
    for (const block of blocks) reclaim.collect(BigInt(block.height), { inserts: block.flushed.inserts.map(({ key, children }) => ({ key: Uint8Array.from(Buffer.from(key, "hex")), data: Uint8Array.of(7), children })), rootCounts: block.flushed.rootCounts.map(({ key, delta }) => ({ key: Uint8Array.from(Buffer.from(key, "hex")), delta })) }, true);
    const outcome = await reclaim.compute(runTables(NO_TABLES, (blocks[2] as ModelBlock).before.roots));
    // One round: the node goes, and the child only it referenced stays.
    expect(outcome.evict.map(hex)).toEqual([wReferencing.key]);
    expect(outcome.rounds).toBe(1);
  });
});
