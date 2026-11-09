import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LAST, REQUEUE } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import {
  databaseNow,
  jobFor,
  mixProblems,
  type ObservedRun,
  observedDifferences,
  observedRun,
  restartProblems,
  type RunPlan,
  runSegment,
} from "./refcount-restart.js";

/**
 * The committed negative controls of R13 and R14 (`ledger-refcount-restart.test.ts`), on PostgreSQL 18 and PGlite
 * 0.5.10, each run against an uninterrupted run of the extended DAG fixture:
 * - A restart that empties `unreferenced` (the segment's `emptiesQueue` seam) after the stop at 37 makes the
 *   node sets differ after the next block, 38: the rows queued at 37 are deleted at 38 by the uninterrupted run only.
 * - A build that writes `ref_counts` and `unreferenced` in a transaction of their own, committed before the
 *   block's (`./refcount-restart.ts`, `control: "own-transaction"`), crashed between the two commits at REQUEUE + 1,
 *   is detected: the database the crash left is a mix (`ref_counts` and `unreferenced` after h, the rest after
 *   h − 1, its contents hash refused with `ledger-refcount-invalid`), and after the restart the node sets differ from
 *   h on.
 */

/** How long one segment on the DAG fixture may take on a loaded machine. */
const SEGMENT_MS = PATIENCE_MS * 2;

describe.each(PROCESS_BACKENDS)("negative controls, on $name", (backend: ProcessBackend) => {
  let directory: string;
  let uninterrupted: Promise<ObservedRun> | undefined;
  let runs = 0;
  beforeAll(async () => {
    directory = mkdtempSync(join(tmpdir(), "umbradb-refcount-restart-control-"));
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    await backend.stop();
    rmSync(directory, { recursive: true, force: true });
  }, 60_000);

  /** A plan on the extended DAG fixture, every block recorded whole, the contents hash after the heights `hashed` names. */
  const dagPlan = (hashed: readonly number[]): RunPlan => ({ chain: { dag: "extended" }, last: LAST, observe: join(directory, `run-${runs++}.jsonl`), full: "every", hashed });

  const uninterruptedDag = (): Promise<ObservedRun> =>
    (uninterrupted ??= (async () => {
      const db = await backend.database();
      // The contents hash where the control crashes.
      const plan = dagPlan([REQUEUE]);
      const outcome = await runSegment(db, await jobFor(db, plan), SEGMENT_MS);
      expect(outcome.ended).toMatchObject({ why: "last", cursor: `${LAST}`, reason: null });
      const run = observedRun(plan.observe);
      // The baseline's contents hash at REQUEUE succeeded: the mix is compared with a hash.
      expect(run.after.get(REQUEUE)?.contents).toEqual({ hash: expect.stringMatching(/^[0-9a-f]+$/) });
      return run;
    })());

  it("negative control: a restart that empties unreferenced makes the node sets differ after the next block", async () => {
    const expected = await uninterruptedDag();
    const db = await backend.database();
    const plan = dagPlan([]);
    const stop = 37;
    const stopped = await runSegment(db, await jobFor(db, plan, { hold: { point: "after-commit", height: stop, then: "stop" } }), SEGMENT_MS);
    expect(stopped.reached).toEqual({ event: "reached", point: "after-commit", height: stop });
    const restarted = await runSegment(db, await jobFor(db, plan, { emptiesQueue: true }), SEGMENT_MS);
    expect(restarted.ended).toMatchObject({ why: "last", cursor: `${LAST}` });
    const run = observedRun(plan.observe);
    // The node sets are equal up to the stop and differ after the block after it, where the uninterrupted run deletes
    // the rows queued at the stop.
    const differing = Array.from({ length: LAST + 1 }, (_, h) => h).filter((h) => run.after.get(h)?.light.nodeSet !== expected.after.get(h)?.light.nodeSet);
    expect(differing[0]).toBe(stop + 1);
    expect(observedDifferences(run, expected, stop + 1, stop + 1)).toEqual([expect.stringMatching(new RegExp(`^after ${stop + 1}: the node set, `))]);
  }, SEGMENT_MS * 3);

  it("negative control: ref_counts and unreferenced written in a transaction of their own, committed before the block's, crashed between the two commits, is detected", async () => {
    const expected = await uninterruptedDag();
    const db = await backend.database();
    const plan = dagPlan([]);
    const h = REQUEUE + 1;
    const killed = await runSegment(db, await jobFor(db, plan, { control: "own-transaction", hold: { point: "between-commits", height: h, then: "hold" } }), SEGMENT_MS);
    expect(killed.reached).toEqual({ event: "reached", point: "between-commits", height: h });
    // The crash left a mix: the two tables after h, the rest after h − 1, so its counts and queue are not its rows'
    // and its contents hash is refused. This damaged case alone inspects a refusal.
    const now = await databaseNow(db, PATIENCE_MS);
    expect(now.contents).toEqual({ refused: expect.stringContaining("tables-inconsistent"), code: "ledger-refcount-invalid" });
    expect(mixProblems(now, expected, h - 1)).toEqual([
      `the database the crash left is not the uninterrupted run's after ${h - 1}: ref_counts, unreferenced differ`,
      expect.stringMatching(/^the database the crash left refused its contents hash: /),
    ]);
    const restarted = await runSegment(db, await jobFor(db, plan), SEGMENT_MS);
    expect(restarted.ended).toMatchObject({ why: "last", cursor: `${LAST}` });
    // Detected after the restart: the restarted block counts its references again, so its deletions and the node set
    // differ from the uninterrupted run's from h on.
    const problems = restartProblems(observedRun(plan.observe), expected, "extended", LAST);
    expect(problems).toContainEqual(expect.stringMatching(new RegExp(`^after ${h}: the node set, `)));
  }, SEGMENT_MS * 3);
});
