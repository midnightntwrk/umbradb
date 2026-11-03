import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { NodeBatch } from "../../src/ledger/types.js";
import { extendedCases, type FixtureNode, LAST, REQUEUE, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { fixtureProblems } from "./refcount-checks.js";
import { dagHistory, type Facets, historyDifferences, NODE_ROWS } from "./refcount-histories.js";

/**
 * `[DIFF]` Determinism across worker histories on the DAG fixture, on PostgreSQL 18 and PGlite 0.5.10. [R28, DT-3,
 * LG-11; design §4.4]
 *
 * The extended DAG fixture's test package keeps a node's old child list when it creates the node again
 * (`keeps-old-copy`, as the ledger's back-end keeps the old copy of a node it already holds), unless its thread holds
 * no copy: a thread that loaded the state before from the database writes the new one. Two runs of the fixture's chain:
 * - one that never restarts: its thread keeps the old child list of each node the fixture writes in its other form
 *   (`rewrite to-ref` at TO_REF, `rewrite to-embedded` at TO_EMBEDDED, `requeue` at REQUEUE);
 * - one stopped after the block before each of those blocks and started again, a new process with a new worker thread
 *   that reads back only the database, so it writes each new child list.
 * Their `nodes` rows differ from TO_REF on; after every block they hold the same node set, `root_counts`, rows of
 * `states`, `segment_results` and `events`, `core_digest.tables` and contents hash (`./refcount-histories.ts`), and R3
 * passes on both.
 *
 * The recorded tapes' cases are in `ledger-refcount-determinism-preprod-{postgres,pglite}.test.ts` and
 * `ledger-refcount-determinism-devnet.test.ts`; the committed negative control (`nodes` hashed by its raw rows) in
 * `ledger-refcount-determinism.negative-control.test.ts`. [R28]
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The blocks at which the fixture writes a stored node in its other form, each with that node in its new form. */
const REWRITES: readonly (readonly [number, FixtureNode])[] = [
  [TO_REF, extendedCases(TO_REF).toRef.node],
  [TO_EMBEDDED, extendedCases(TO_EMBEDDED).toEmbedded.node],
  [REQUEUE, extendedCases(REQUEUE).requeue.node],
];

/** The cursors the restarted run stops at: the block before each rewrite. */
const RESTARTS = REWRITES.map(([height]) => height - 1);

/** The child list `batch` writes for `node`'s key, as hex; undefined when it writes none. */
const writtenFor = (batch: NodeBatch | undefined, node: FixtureNode): string | undefined => {
  const found = batch?.inserts.find((insert) => hex(insert.key) === hex(node.key));
  return found === undefined ? undefined : hex(found.children);
};

/** The heights at which two runs' `name` facets differ, in order. */
const differingAt = (a: ReadonlyMap<bigint, Facets>, b: ReadonlyMap<bigint, Facets>, name: string): bigint[] =>
  [...a.keys()].filter((height) => a.get(height)?.get(name) !== b.get(height)?.get(name)).sort((x, y) => (x < y ? -1 : 1));

describe.each(PROCESS_BACKENDS)("R28 (DT-3, LG-11): determinism across worker histories on the DAG fixture, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("R28: a run that never restarts keeps a rewritten node's old child list and one restarted before each rewrite writes the new one; their nodes rows differ, and after every block their node sets, root_counts, rows of states, segment_results and events, core_digest.tables and contents hashes are equal", async () => {
    const never = await dagHistory(await backend.database(), "keeps-old-copy");
    const restarted = await dagHistory(await backend.database(), "keeps-old-copy", RESTARTS);

    // Both reach the fixture's last height with no halt and no worker restart; the restarted run's segments each stop
    // at their cursor.
    expect(never.runs.map((run) => run.cursor)).toEqual([BigInt(LAST)]);
    expect(restarted.runs.map((run) => run.cursor)).toEqual([...RESTARTS, LAST].map(BigInt));
    for (const run of [...never.runs, ...restarted.runs]) {
      expect(run.status).toMatchObject({ reason: null, ended: null });
      expect([run.failure, run.restarts]).toEqual([null, 0]);
    }
    // Each new process's worker thread loaded the state at its cursor from the database; the never-restarted run's one
    // thread never read a state from it.
    expect(never.counters).toMatchObject({ threads: 1, storeLoads: 0, refusals: 0 });
    expect(restarted.counters).toMatchObject({ threads: RESTARTS.length + 1, storeLoads: RESTARTS.length, storeLoadHeight: REQUEUE - 1, refusals: 0 });

    // The case: at each rewrite the restarted run writes the node's new child list; the run that never restarted keeps
    // the old one and writes nothing for it.
    for (const [height, node] of REWRITES) {
      expect(writtenFor(restarted.batches.get(BigInt(height)), node), `${height}`).toBe(hex(node.children));
      expect(writtenFor(never.batches.get(BigInt(height)), node), `${height}`).toBeUndefined();
    }
    // So the two databases' nodes rows differ from TO_REF to the last height.
    const rowsDiffer = differingAt(restarted.facets, never.facets, NODE_ROWS);
    expect(rowsDiffer[0]).toBe(BigInt(TO_REF));
    expect(rowsDiffer).toEqual(Array.from({ length: LAST - TO_REF + 1 }, (_, i) => BigInt(TO_REF + i)));

    // What they agree on, after every block, the contents hash taken at every one.
    expect([...never.facets.keys()].sort((a, b) => (a < b ? -1 : 1))).toEqual(Array.from({ length: LAST + 1 }, (_, h) => BigInt(h)));
    expect([...never.facets.values()].every((facets) => facets.has("contents hash"))).toBe(true);
    expect(historyDifferences(restarted.facets, never.facets)).toEqual([]);

    // R3's check passes on both. [R3]
    expect(fixtureProblems("extended", never.tables, never.batches, LAST)).toEqual([]);
    expect(fixtureProblems("extended", restarted.tables, restarted.batches, LAST)).toEqual([]);
  }, PATIENCE_MS * 8);
});
