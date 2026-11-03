import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { type Child, encodeChildren, hex, nodeKey } from "../ledger/node-format.js";
import {
  driveHistory,
  EMPTY_TABLES,
  historyScripts,
  oracle,
  type R1Case,
  R1_CASES,
  RefcountModel,
  type RefcountFault,
  RefcountModelHalt,
  refcountModelStep,
  type RefcountTables,
} from "./refcount-model.js";

/**
 * The reference model of LG-14's reference counting (`./refcount-model.ts`) against its reachability oracle. [R1]
 *
 * - Hand-made blocks: the two rewrites of a queued node, a released state deleted the block after its release with
 *   its own rows (and what each fault does to that), and the checks that halt a block.
 * - The property (fast-check, seed 20261103): after every block of generated histories, I1–I5 hold for every batch,
 *   I6 (with `S_h = K_h` where `sweep` is on) for every admissible one, and `R_{h−1} ⊆ S_h` for every batch; every case
 *   R1 lists occurs in the runs.
 * - The committed negative control: the model with rule 4's root conditions removed fails the oracle's
 *   `R_{h−1} ⊆ S_h`; so does the same model with a released state's rows deleted in the block that releases it, and the
 *   failure names them.
 */

/** The fast-check seed and run count of the properties here. */
const SEED = 20261103;
const RUNS = 200;

/** A child given to {@link node}: a key, referenced, or a node, embedded. */
type Given = Uint8Array | { readonly tree: Child[]; readonly data: Uint8Array };

/** A node over `children`, its key the format's. */
function node(label: string, children: readonly Given[] = []) {
  const data = Uint8Array.from(Buffer.from(label));
  const tree: Child[] = children.map((child) =>
    child instanceof Uint8Array ? { ref: child } : { direct: { data: child.data, children: child.tree } },
  );
  const keyBytes = nodeKey(
    data,
    children.map((child) => (child instanceof Uint8Array ? child : nodeKey(child.data, childKeys(child.tree)))),
  );
  return { key: hex(keyBytes), keyBytes, data, tree, children: encodeChildren(tree) };
}
const childKeys = (tree: readonly Child[]): Uint8Array[] =>
  tree.map((child) => ("ref" in child ? child.ref : nodeKey(child.direct.data, childKeys(child.direct.children))));

/** The halt `run` throws (it must throw one). */
function haltOf(run: () => unknown): RefcountModelHalt {
  try {
    run();
  } catch (error) {
    if (error instanceof RefcountModelHalt) return error;
    throw error;
  }
  throw new Error("the step did not halt");
}

/** Tables at h − 1 as given. */
function tables(
  rows: readonly { readonly key: string; readonly children: Uint8Array }[],
  refs: Readonly<Record<string, number>>,
  queue: readonly string[],
  roots: Readonly<Record<string, number>> = {},
): RefcountTables {
  return {
    rows: new Map(rows.map((row) => [row.key, row.children])),
    refs: new Map(Object.entries(refs)),
    roots: new Map(Object.entries(roots)),
    queue: new Set(queue),
  };
}

describe("R1: the reference model of LG-14 by hand", () => {
  it("a queued unrooted node rewritten to reference a node the batch writes new, no root rising: kept and queued", () => {
    const g = node("g");
    const c = node("c", [g.keyBytes]);
    const before = node("w", [c]); // w embeds c, which holds a reference to g
    const after = node("w", [c.keyBytes]);
    expect(after.key).toBe(before.key);
    const step = refcountModelStep(
      tables([before, g], { [g.key]: 1 }, [before.key]),
      { inserts: [after, c], rootCounts: [] },
      { on: true },
    );
    expect([step.newNodes, step.rewritten, step.deleted]).toEqual([[c.key], [before.key], [before.key]]);
    expect([...step.after.rows.keys()].sort()).toEqual([c.key, g.key].sort());
    expect(step.after.refs).toEqual(new Map([[g.key, 1]]));
    expect(step.after.queue).toEqual(new Set([c.key]));
  });

  it("a queued unrooted node rewritten to embed a child it referenced: the node deleted, the child kept and queued", () => {
    const g = node("g");
    const c = node("c", [g.keyBytes]);
    const before = node("w", [c.keyBytes]);
    const after = node("w", [c]);
    const step = refcountModelStep(
      tables([before, c, g], { [c.key]: 1, [g.key]: 1 }, [before.key]),
      { inserts: [after], rootCounts: [] },
      { on: true },
    );
    expect([step.newNodes, step.rewritten, step.deleted]).toEqual([[], [before.key], [before.key]]);
    expect([...step.after.rows.keys()].sort()).toEqual([c.key, g.key].sort());
    expect(step.after.refs).toEqual(new Map([[g.key, 1]]));
    expect(step.after.queue).toEqual(new Set([c.key]));
  });

  it("retainStates 0: a released state queued, deleted with its own rows the block after; what the faults change", () => {
    const leaf = node("l");
    const a = node("a", [leaf.keyBytes]);
    const b = node("b");
    const s0 = node("s0", [a.keyBytes, b.keyBytes]);
    const c = node("c");
    const s1 = node("s1", [b.keyBytes, c.keyBytes]);
    const blocks = [
      { inserts: [s0, a, b, leaf], rootCounts: [{ key: s0.key, delta: 1 }] },
      { inserts: [s1, c], rootCounts: [{ key: s0.key, delta: -1 }, { key: s1.key, delta: 1 }] },
      { inserts: [], rootCounts: [] },
    ];
    const run = (model: RefcountModel) => blocks.map((batch) => model.block(batch, true));

    const [, released, after] = run(new RefcountModel());
    expect(released?.deleted).toEqual([]);
    expect(released?.after.queue).toEqual(new Set([s0.key]));
    expect(after?.deleted).toEqual([s0.key, a.key, leaf.key].sort());
    expect(after?.rounds).toBe(3);
    expect([...(after?.after.rows.keys() ?? [])].sort()).toEqual([s1.key, b.key, c.key].sort());

    // Without rule 4's root conditions nothing here changes: the released root is not in the queue the cascade
    // starts from, and no rooted key loses its last reference.
    const [, bare, bareAfter] = run(new RefcountModel("no-root-conditions"));
    expect([bare?.deleted, bareAfter?.deleted]).toEqual([[], [s0.key, a.key, leaf.key].sort()]);
    // Started from the released keys too, the state goes in the block that releases it, which the worker still holds.
    const [, early] = run(new RefcountModel("released-in-block"));
    expect(early?.deleted).toEqual([s0.key, a.key, leaf.key].sort());
    // With the cascade stopped after its first round, the state's own rows wait in the queue.
    const [, , cut] = run(new RefcountModel("first-round-only"));
    expect(cut?.deleted).toEqual([s0.key]);
    expect(cut?.after.queue).toEqual(new Set([a.key]));
  });

  it("halts with missing-reference when a deleted rewritten node's new child list names a key the cascade deletes", () => {
    // The check names every reference of a rewritten node's batch child list, the node deleted or not: x, which w
    // embedded and now references, has no other reference, so the cascade deletes it after w.
    const x = node("x");
    const before = node("w", [x]);
    const after = node("w", [x.keyBytes]);
    const halt = haltOf(() =>
      refcountModelStep(tables([before, x], {}, [before.key, x.key]), { inserts: [after], rootCounts: [] }, { on: true }),
    );
    expect(halt).toMatchObject({ reason: "missing-reference", key: x.key });
  });

  it("halts with negative-count below 0 and with missing-reference for a rising key that is no row", () => {
    const c = node("c");
    const p = node("p", [c.keyBytes]);
    expect(
      haltOf(() => refcountModelStep(tables([p, c], {}, [p.key]), { inserts: [], rootCounts: [] }, { on: true })),
    ).toMatchObject({ reason: "negative-count", key: c.key });
    expect(
      haltOf(() =>
        refcountModelStep(EMPTY_TABLES, { inserts: [], rootCounts: [{ key: c.key, delta: 1 }] }, { on: true }),
      ),
    ).toMatchObject({ reason: "missing-reference", key: c.key });
    // With sweep off nothing is deleted: the counts and the queue still follow the rows.
    const off = refcountModelStep(
      tables([p, c], { [c.key]: 1 }, [p.key]),
      { inserts: [], rootCounts: [] },
      { on: false },
    );
    expect([off.deleted, [...off.after.queue]]).toEqual([[], [p.key]]);
  });
});

/** Runs one history through the model and the oracle; the first block's problems, or none. */
function problemsOf(script: Parameters<typeof driveHistory>[0], seen: Map<R1Case, number>): string[] {
  for (const block of driveHistory(script)) {
    const report = oracle(block);
    if (report.problems.length > 0) return report.problems.map((problem) => `${problem} (block ${block.height})`);
    for (const name of report.cases) seen.set(name, (seen.get(name) ?? 0) + 1);
  }
  return [];
}

describe("R1: the reference model of LG-14 against the reachability oracle", () => {
  it(`I1–I5 after every block, I6 after every admissible one, on generated histories (seed ${SEED}, ${RUNS} runs)`, () => {
    const seen = new Map<R1Case, number>();
    fc.assert(
      fc.property(historyScripts({ oneForm: false }), (script) => {
        expect(problemsOf(script, seen)).toEqual([]);
      }),
      { seed: SEED, numRuns: RUNS },
    );
    // Not vacuous: the runs show every case R1 lists, admissible and non-admissible batches among them.
    const missing = R1_CASES.filter((name) => (seen.get(name) ?? 0) === 0);
    expect(missing).toEqual([]);
  });

  it(`negative control: rule 4 without its root conditions fails R_{h−1} ⊆ S_h (seed ${SEED}, ${RUNS} runs)`, () => {
    /** The first failure of the oracle's `R_{h−1} ⊆ S_h` on the histories, with the model given `fault`. */
    const failure = (fault: RefcountFault): string => {
      const result = fc.check(
        fc.property(historyScripts({ oneForm: false }), (script) => {
          try {
            for (const block of driveHistory(script, new RefcountModel(fault))) {
              const failed = oracle(block).problems.filter((problem) => problem.startsWith("R_{h−1} ⊆ S_h"));
              if (failed.length > 0) throw new Error(failed.join("\n"));
            }
          } catch (error) {
            // A history the fault makes halt ends there; only the oracle's check is under test.
            if (!(error instanceof RefcountModelHalt)) throw error;
          }
        }),
        { seed: SEED, numRuns: RUNS, endOnFailure: true },
      );
      expect(result.failed).toBe(true);
      return String(result.errorInstance);
    };
    // The conditions removed: a rooted key whose last reference goes is deleted (a contract key, a state's root).
    expect(failure("no-root-conditions")).toMatch(/R_\{h−1\} ⊆ S_h fails at height \d+: \w+, a row/);
    // And with the cascade started from the keys the block releases: the released state's rows go in that block.
    expect(failure("released-in-block")).toMatch(
      /R_\{h−1\} ⊆ S_h fails at height \d+: \w+, a row of a state released at h, is deleted/,
    );
  });
});
