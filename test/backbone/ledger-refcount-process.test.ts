import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AGAIN, CHANGE, extendedCases, LAST, REQUEUE, REVERT, stateNodes, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { heldNodeProblems } from "./ledger-storage-checks.js";
import type { RefcountModelStep } from "./refcount-model.js";
import { type DagRun, runDag, runProblems } from "./refcount-process.js";
import { modelOfBatches, modelProblems, type TableSnapshot } from "./sweep-tapes.js";

/**
 * `core-ledger-state`'s reclamation by reference counting through the real process, on PostgreSQL 18 and PGlite
 * 0.5.10. [A105 DIFF, R3 CI, LG-11, LG-14]
 *
 * The input is the extended DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`, `"extended"`): wide trees, a new
 * root every block, content reused after a deletion, children shared between versions, a child repeated in one child
 * list, embedded children holding references, a stored node written again with its small child in the other form
 * (both ways), a stored node written again unchanged, and a queued key referenced again. Its test package
 * (`sweep-test-loader.ts`) flushes, from each key whose root count rises, the nodes whose child list it does not
 * believe stored, and honours evictions. Checked, after every block and on both backends:
 * - R1's model (`./refcount-model.ts`), fed the block's batch, holds the implementation's rows (with their child
 *   lists), counts, root counts and queue; the new and rewritten nodes it computes are those the tables show; the keys
 *   it deletes are those the worker was told to evict;
 * - R3's database check passes (`./refcount-checks.ts`);
 * - every `core_ledger_state` table is equal between the two backends;
 * - subtree 0's first version, deleted while its second version stood, is inserted again at REVERT;
 * - with `sweep: off` nothing is deleted.
 * [A105 DIFF, R3]
 *
 * The committed negative controls (R12's six faults, R3's own) are in `ledger-refcount-process.negative-control.test.ts`.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/**
 * The heights at which the new or rewritten nodes the tables show differ from the model's: a key whose row appears is
 * new, one whose child list changes is rewritten (a new node is never deleted in its block; a rewritten one can be).
 */
function classificationProblems(tables: ReadonlyMap<bigint, TableSnapshot>, model: readonly RefcountModelStep[]): string[] {
  const problems: string[] = [];
  for (const [h, step] of model.entries()) {
    const before = tables.get(BigInt(h - 1))?.rows ?? new Map<string, Uint8Array>();
    const after = tables.get(BigInt(h))?.rows ?? new Map<string, Uint8Array>();
    const fresh = [...after.keys()].filter((key) => !before.has(key)).sort();
    const rewritten = [...after.keys()].filter((key) => before.has(key) && Buffer.compare(before.get(key) as Uint8Array, after.get(key) as Uint8Array) !== 0).sort();
    if (JSON.stringify(fresh) !== JSON.stringify(step.newNodes)) problems.push(`after ${h}: the new nodes differ from the model's`);
    const kept = step.rewritten.filter((key) => !step.deleted.includes(key));
    if (JSON.stringify(rewritten) !== JSON.stringify(kept)) problems.push(`after ${h}: the rewritten nodes differ from the model's`);
  }
  return problems;
}

/** The tables of every height as text, for comparing two runs. */
const tablesText = (run: DagRun): string =>
  JSON.stringify([...run.tables].map(([h, t]) => [`${h}`, [...t.rows].map(([k, c]) => `${k}:${hex(c)}`), [...t.refs], [...t.roots], [...t.queue], [...t.digests]]));

describe("A105 (LG-14): reclamation by reference counting, against R1's model and R3's check, on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it("[[ledger.refcount-cross-backend-identical]] A105: on the extended DAG fixture the new and rewritten nodes, counts, queue, deleted set and rows are R1's model's after every block, on PostgreSQL and on PGlite, the evicted keys its deleted ones, every core_ledger_state table equal between the backends, and R3's check passing after every block", async () => {
    const runs: DagRun[] = [];
    for (const backend of PROCESS_BACKENDS) {
      const db = await backend.database();
      const run = await runDag(db, { dag: "extended" });
      expect(run.status, backend.name).toMatchObject({ cursor: BigInt(LAST), reason: null });
      const model = modelOfBatches(run.batches, LAST);
      expect(modelProblems(run.tables, model), backend.name).toEqual([]);
      expect(classificationProblems(run.tables, model), backend.name).toEqual([]);
      // The keys the worker was told to evict at each block are those the model deletes there.
      for (const [h, step] of model.entries()) expect(run.evicted.get(BigInt(h)) ?? [], `${backend.name} at ${h}`).toEqual(step.deleted);
      expect(runProblems(run, "extended"), backend.name).toEqual([]);
      expect(await heldNodeProblems(db), backend.name).toEqual([]);

      // The fixture has what the test needs. [A105]
      const at = (h: number): RefcountModelStep => model[h] as RefcountModelStep;
      const key = (node: { readonly key: Uint8Array }): string => hex(node.key);
      // Deletions in cascades of more than one round, every block from 2 on.
      expect(model.slice(2).every((step) => step.deleted.length > 0), backend.name).toBe(true);
      expect(Math.max(...model.map((step) => step.rounds)), backend.name).toBeGreaterThanOrEqual(3);
      // A child repeated in one child list: counted twice.
      expect(at(0).after.refs.get(key(extendedCases(0).repeated.leaf)), backend.name).toBe(2);
      // A rewrite each way: the embedded child becomes a row of its own at TO_REF; at TO_EMBEDDED the child's only
      // reference goes, so it is queued, and deleted at the next block.
      const toRef = extendedCases(TO_REF).toRef;
      expect(at(TO_REF).rewritten, backend.name).toContain(key(toRef.node));
      expect(at(TO_REF).newNodes, backend.name).toContain(key(toRef.small));
      const toEmbedded = extendedCases(TO_EMBEDDED).toEmbedded;
      expect(at(TO_EMBEDDED).rewritten, backend.name).toContain(key(toEmbedded.node));
      expect(at(TO_EMBEDDED).after.queue.has(key(toEmbedded.small)), backend.name).toBe(true);
      expect(at(TO_EMBEDDED + 1).deleted, backend.name).toContain(key(toEmbedded.small));
      // A stored node written again unchanged, which changes nothing.
      expect(at(AGAIN).unchanged, backend.name).toContain(key(extendedCases(AGAIN).again.node));
      // A queued key referenced again by a new node: kept, out of the queue, counted once.
      const requeued = key(extendedCases(REQUEUE).requeue.requeued);
      expect(at(REQUEUE).after.queue.has(requeued), backend.name).toBe(true);
      expect(at(REQUEUE + 1).deleted.includes(requeued) || at(REQUEUE + 1).after.queue.has(requeued), backend.name).toBe(false);
      expect(at(REQUEUE + 1).after.refs.get(requeued), backend.name).toBe(1);
      // A row deleted and needed again is inserted again: subtree 0's first version, deleted while its second stood.
      const again = stateNodes(0).slice(1, 6).map(key);
      const deletedAt = model.findIndex((step) => again.some((k) => step.deleted.includes(k)));
      expect(deletedAt, backend.name).toBeGreaterThan(CHANGE);
      expect(deletedAt, backend.name).toBeLessThan(REVERT);
      for (const k of again) {
        expect(run.tables.get(BigInt(REVERT - 1))?.rows.has(k), `${backend.name}: ${k} before ${REVERT}`).toBe(false);
        expect(run.tables.get(BigInt(REVERT))?.rows.has(k), `${backend.name}: ${k} at ${REVERT}`).toBe(true);
      }
      runs.push(run);
    }
    // Every table of core_ledger_state, the same rows on both backends after every block.
    expect(tablesText(runs[0] as DagRun)).toBe(tablesText(runs[1] as DagRun));
  }, PATIENCE_MS * 4);

  it("A105: with sweep off nothing is deleted or evicted, the counts and queue are still R1's model's, and R3's (a), (b) and R_{h−1} ⊆ S_h hold after every block", async () => {
    for (const backend of PROCESS_BACKENDS) {
      const db = await backend.database();
      const run = await runDag(db, { dag: "extended", settings: { sweep: "off" } });
      expect(run.status, backend.name).toMatchObject({ cursor: BigInt(LAST), reason: null });
      const model = modelOfBatches(run.batches, LAST, () => true);
      expect(modelProblems(run.tables, model), backend.name).toEqual([]);
      expect([...run.evicted.values()].flat(), backend.name).toEqual([]);
      expect(runProblems(run, "extended", () => false), backend.name).toEqual([]);
      // Every row stays: the rows after each block hold those before it, and the queue grows with the released roots.
      let before: ReadonlySet<string> = new Set();
      for (let h = 0; h <= LAST; h++) {
        const rows = (run.tables.get(BigInt(h)) as TableSnapshot).rows;
        expect([...before].every((k) => rows.has(k)), `${backend.name} at ${h}`).toBe(true);
        before = new Set(rows.keys());
      }
      expect((run.tables.get(BigInt(LAST)) as TableSnapshot).queue.size, backend.name).toBeGreaterThanOrEqual(LAST);
    }
  }, PATIENCE_MS * 4);
});
