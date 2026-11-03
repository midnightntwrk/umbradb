import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { extendedCases, REQUEUE, rootOf, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import type { TableSnapshot } from "./ledger-graph-tapes.js";
import { closureProblems, fixtureProblems } from "./refcount-checks.js";
import { runDag, runProblems } from "./refcount-process.js";
import { joined, readingLoads, rowProblems } from "./refcount-rewrite.js";

/**
 * R27: a stored node written again in its other form, through the real process on PostgreSQL 18 and PGlite 0.5.10, on
 * the extended DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`) and its test package (`sweep-test-loader.ts`,
 * which writes each node with the child list the fixture has at the height). [R27, LG-11, LG-14]
 *
 * The fixture's two cases: `rewrite to-ref` embeds `small to-ref` before TO_REF and references it from there on;
 * `rewrite to-embedded` references `small to-embedded` before TO_EMBEDDED and embeds it from there on, so that key is
 * then referenced by no stored child list. Checked, at each:
 * - after the block the row holds the new child list (the row check, `./refcount-rewrite.ts`);
 * - the old list's references are subtracted and the new ones added: R3 (a) after the block, and R3 whole after every
 *   block of the run;
 * - the key only the old list referenced is not deleted at that block, is queued, and is deleted at the next block —
 *   unless referenced by then (the fixture's `requeue`, rewritten the same way at REQUEUE, whose `requeued` a new node
 *   references at REQUEUE + 1) or persisted by then (the test package persisting `small to-embedded` at
 *   TO_EMBEDDED + 1);
 * - a worker restarted after the block (a new process on the same database) loads the new child list from the database
 *   (the rows the node-store bridge read for its load) and its next state root is the node's.
 *
 * The committed negative controls (the first copy kept; the key deleted in the same block) are in
 * `ledger-refcount-rewrite.negative-control.test.ts`.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

const toRefBefore = extendedCases(TO_REF - 1).toRef;
const toRef = extendedCases(TO_REF).toRef;
const toEmbeddedBefore = extendedCases(TO_EMBEDDED - 1).toEmbedded;
const toEmbedded = extendedCases(TO_EMBEDDED).toEmbedded;

describe.each(PROCESS_BACKENDS)("R27 (LG-11, LG-14): a stored node written again in its other form, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("R27: each rewrite's row holds the new child list after its block; its counts follow it (R3 (a)); the key only the old list referenced is queued at that block and deleted at the next, or kept when a new node references it by then", async () => {
    // One node, two forms: the same key, two child lists.
    expect(hex(toRef.node.key)).toBe(hex(toRefBefore.node.key));
    expect(hex(toRef.node.children)).not.toBe(hex(toRefBefore.node.children));
    expect(hex(toEmbedded.node.key)).toBe(hex(toEmbeddedBefore.node.key));
    expect(hex(toEmbedded.node.children)).not.toBe(hex(toEmbeddedBefore.node.children));

    const last = REQUEUE + 1;
    const run = await runDag(await backend.database(), { dag: "extended", last });
    expect(run.status).toMatchObject({ cursor: BigInt(last), reason: null });
    expect(runProblems(run, "extended")).toEqual([]);
    const at = (h: number): TableSnapshot => run.tables.get(BigInt(h)) as TableSnapshot;
    const written = (h: number): string[] => (run.batches.get(BigInt(h))?.inserts ?? []).map((node) => hex(node.key));

    // Embedded → referenced at TO_REF: written again, the row takes the new list, which adds a reference to the small
    // child (a row of its own from there on); the old list, which embedded it, referenced nothing.
    expect(rowProblems(at(TO_REF - 1), toRefBefore.node)).toEqual([]);
    expect(written(TO_REF)).toContain(hex(toRef.node.key));
    expect(rowProblems(at(TO_REF), toRef.node, toRefBefore.node)).toEqual([]);
    expect(closureProblems(at(TO_REF))).toEqual([]);
    const smallRef = hex(toRef.small.key);
    expect(at(TO_REF - 1).rows.has(smallRef)).toBe(false);
    expect(at(TO_REF).refs.get(smallRef)).toBe(1);

    // Referenced → embedded at TO_EMBEDDED: the row takes the new list, the old list's one reference to the small child
    // is subtracted, and that child, which only the old list referenced, stays a row, queued, until the next block.
    const smallEmbedded = hex(toEmbedded.small.key);
    expect(rowProblems(at(TO_EMBEDDED - 1), toEmbeddedBefore.node)).toEqual([]);
    expect(written(TO_EMBEDDED)).toContain(hex(toEmbedded.node.key));
    expect(rowProblems(at(TO_EMBEDDED), toEmbedded.node, toEmbeddedBefore.node)).toEqual([]);
    expect(closureProblems(at(TO_EMBEDDED))).toEqual([]);
    expect(at(TO_EMBEDDED - 1).refs.get(smallEmbedded)).toBe(1);
    expect(at(TO_EMBEDDED).refs.has(smallEmbedded)).toBe(false);
    expect(at(TO_EMBEDDED).rows.has(smallEmbedded)).toBe(true);
    expect(at(TO_EMBEDDED).queue.has(smallEmbedded)).toBe(true);
    expect(run.evicted.get(BigInt(TO_EMBEDDED)) ?? []).not.toContain(smallEmbedded);
    expect(at(TO_EMBEDDED + 1).rows.has(smallEmbedded)).toBe(false);
    expect(run.evicted.get(BigInt(TO_EMBEDDED + 1))).toContain(smallEmbedded);

    // The same rewrite at REQUEUE, whose child a new node references at the next block: kept, out of the queue.
    const requeue = extendedCases(REQUEUE).requeue;
    const requeued = hex(requeue.requeued.key);
    expect(rowProblems(at(REQUEUE), requeue.node, extendedCases(REQUEUE - 1).requeue.node)).toEqual([]);
    expect(at(REQUEUE - 1).refs.get(requeued)).toBe(1);
    expect(at(REQUEUE).refs.has(requeued)).toBe(false);
    expect(at(REQUEUE).queue.has(requeued)).toBe(true);
    expect(at(REQUEUE + 1).rows.has(requeued)).toBe(true);
    expect(at(REQUEUE + 1).queue.has(requeued)).toBe(false);
    expect(at(REQUEUE + 1).refs.get(requeued)).toBe(1);
    expect(run.evicted.get(BigInt(REQUEUE + 1)) ?? []).not.toContain(requeued);
  }, PATIENCE_MS * 2);

  it("R27: the key only the old list referenced, persisted by the next block, is kept there and leaves the queue", async () => {
    const smallEmbedded = hex(toEmbedded.small.key);
    const last = TO_EMBEDDED + 2;
    const run = await runDag(await backend.database(), {
      dag: "extended",
      data: { persist: { at: `${TO_EMBEDDED + 1}`, key: smallEmbedded } },
      last,
    });
    expect(run.status).toMatchObject({ cursor: BigInt(last), reason: null });
    // R3 after every block, the key persisted from TO_EMBEDDED + 1 on among the persisted keys.
    const persisted = (h: number): readonly string[] => (h > TO_EMBEDDED ? [smallEmbedded] : []);
    expect(fixtureProblems("extended", run.tables, run.batches, last, { persisted })).toEqual([]);
    const at = (h: number): TableSnapshot => run.tables.get(BigInt(h)) as TableSnapshot;
    expect(at(TO_EMBEDDED).queue.has(smallEmbedded)).toBe(true);
    expect(run.batches.get(BigInt(TO_EMBEDDED + 1))?.rootCounts.map((count) => [hex(count.key), count.delta])).toContainEqual([smallEmbedded, 1]);
    for (const h of [TO_EMBEDDED + 1, TO_EMBEDDED + 2]) {
      expect(at(h).rows.has(smallEmbedded), `at ${h}`).toBe(true);
      expect(at(h).queue.has(smallEmbedded), `at ${h}`).toBe(false);
      expect(at(h).roots.get(smallEmbedded), `at ${h}`).toBe(1);
    }
    expect([...run.evicted.values()].flat()).not.toContain(smallEmbedded);
  }, PATIENCE_MS * 2);

  it("R27: a worker restarted after each rewrite loads the new child list from the database, and its next state root is the node's", async () => {
    const db = await backend.database();
    const counters = countersMemory();
    const shared = new Int32Array(counters);
    const first = await runDag(db, { dag: "extended", data: { counters }, last: TO_REF });
    expect(first.status).toMatchObject({ cursor: BigInt(TO_REF), reason: null });

    // A new process after TO_REF: its worker loads the state after TO_REF from the database, `rewrite to-ref` with its
    // new list, and its root after TO_REF + 1 passes the root check.
    const afterToRef = new Map<string, Uint8Array>();
    const second = await runDag(db, {
      dag: "extended",
      data: { counters },
      last: TO_EMBEDDED,
      resume: BigInt(TO_REF),
      worker: (host) => readingLoads(host, afterToRef),
    });
    expect(second.status).toMatchObject({ cursor: BigInt(TO_EMBEDDED), reason: null });
    expect([Atomics.load(shared, COUNTERS.storeLoads), Atomics.load(shared, COUNTERS.storeLoadHeight)]).toEqual([1, TO_REF]);
    expect(hex(afterToRef.get(hex(toRef.node.key)) ?? new Uint8Array(0))).toBe(hex(toRef.node.children));

    // A new process after TO_EMBEDDED: `rewrite to-embedded` loaded with its new list, embedding its small child.
    const afterToEmbedded = new Map<string, Uint8Array>();
    const third = await runDag(db, {
      dag: "extended",
      data: { counters },
      last: TO_EMBEDDED + 1,
      resume: BigInt(TO_EMBEDDED),
      worker: (host) => readingLoads(host, afterToEmbedded),
    });
    expect(third.status).toMatchObject({ cursor: BigInt(TO_EMBEDDED + 1), reason: null });
    expect([Atomics.load(shared, COUNTERS.storeLoads), Atomics.load(shared, COUNTERS.storeLoadHeight)]).toEqual([2, TO_EMBEDDED]);
    expect(hex(afterToEmbedded.get(hex(toEmbedded.node.key)) ?? new Uint8Array(0))).toBe(hex(toEmbedded.node.children));

    // The next state root after each restart is the node's (the root check passed; the stored root is the tape's).
    const roots = await db.query(
      `SELECT height::int AS h, encode(state_root, 'hex') AS root FROM core_ledger_state.states WHERE height IN (${TO_REF + 1}, ${TO_EMBEDDED + 1}) ORDER BY height`,
    );
    expect(roots).toEqual([
      { h: TO_REF + 1, root: hex(rootOf(TO_REF + 1, "extended")) },
      { h: TO_EMBEDDED + 1, root: hex(rootOf(TO_EMBEDDED + 1, "extended")) },
    ]);
    // R3 after every block of the three runs, and the queued key deleted at the block after the restart.
    const { tables, batches } = joined([first, second, third]);
    expect(fixtureProblems("extended", tables, batches, TO_EMBEDDED + 1)).toEqual([]);
    expect(tables.get(BigInt(TO_EMBEDDED))?.queue.has(hex(toEmbedded.small.key))).toBe(true);
    expect(tables.get(BigInt(TO_EMBEDDED + 1))?.rows.has(hex(toEmbedded.small.key))).toBe(false);
  }, PATIENCE_MS * 3);
});
