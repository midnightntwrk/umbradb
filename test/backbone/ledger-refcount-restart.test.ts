import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AGAIN, LAST, REQUEUE, REVERT, TO_EMBEDDED, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import {
  databaseNow,
  type Hold,
  jobFor,
  mixProblems,
  type ObservedRun,
  observedRun,
  type RestartPoint,
  restartProblems,
  type RunPlan,
  runSegment,
} from "./refcount-restart.js";

/**
 * Restarts and crashes of the process at named points, on PostgreSQL 18 and PGlite 0.5.10: each run is one or more
 * processes of their own, the next reading back only the database the one before it left
 * (`./refcount-restart.ts`). [R13 FAULT, R14 FAULT, LG-11, LG-14, RN-6]
 *
 * - **R13** on the extended DAG fixture (`test/ledger/fixtures/sweep-fixture.ts`): stopped after the `COMMIT` of every
 *   37th height (37, 74) and restarted, each stop reported where it was reached, the run has after every block the
 *   node set, `root_counts`, `states`, the other byte-hashed tables and the contents hash of an uninterrupted run, and
 *   R3's check passes after every block. The bytes of the content-defined tables are not compared (`design.md` §4.4).
 *   R13 on the recorded preprod tape is in `ledger-refcount-restart-preprod-{postgres,pglite}.test.ts`.
 * - **R14**: the extended DAG fixture crashed (SIGKILL) at each named point of a block — in `on-compute` before the
 *   step; after the eviction and before the block's transaction; in `on-db-write` after the node writes and before the
 *   step's other writes; between the step's writes; just before and just after the `COMMIT` — each reported reached at
 *   its height. The database is then the uninterrupted run's after h − 1 (before the `COMMIT`) or after h (after it):
 *   every `core_ledger_state` table, byte for byte, and the contents hash; and the restarted run's node set and
 *   byte-hashed tables (`core_ledger_state`'s rows, `core_digest.tables`) are the uninterrupted run's after every
 *   block, its contents hash after h − 1, h, h + 1 and the last height, and R3 passes after every block.
 *
 * The committed negative controls (a restart that empties `unreferenced`; a build writing `ref_counts` and
 * `unreferenced` in a transaction of their own) are in `ledger-refcount-restart.negative-control.test.ts`.
 */

/** R13's stops on the DAG fixture: after the `COMMIT` of every 37th height. */
const DAG_STOPS = Array.from({ length: Math.floor(LAST / 37) }, (_, i) => 37 * (i + 1));

/** R14's points, each at a height of its own (every block from 2 on deletes rows, so each point is passed). */
const CRASHES: readonly { readonly point: RestartPoint; readonly height: number }[] = [
  // A stored node rewritten, its small child becoming a row of its own.
  { point: "before-step", height: TO_REF },
  // The small child a rewrite stopped referencing, deleted and evicted.
  { point: "after-eviction", height: TO_EMBEDDED + 1 },
  // A child a rewrite stops referencing, queued.
  { point: "after-node-writes", height: REQUEUE },
  // That queued child referenced again by a new node.
  { point: "between-step-writes", height: REQUEUE + 1 },
  // A stored node written again unchanged.
  { point: "before-commit", height: AGAIN },
  // Content deleted earlier inserted again.
  { point: "after-commit", height: REVERT },
];

/** How long one segment on the DAG fixture may take: a contents hash after every block costs PostgreSQL's round trips. */
const SEGMENT_MS = PATIENCE_MS * 2;

/** Where a segment stops: at `point` of block `height`, held there for the kill or its process stopped. */
const holdAt = (point: RestartPoint, height: number, then: Hold["then"]): Hold => ({ point, height, then });

describe.each(PROCESS_BACKENDS)("R13, R14 (LG-11, LG-14, RN-6): restarts and crashes at named points, on $name", (backend: ProcessBackend) => {
  let directory: string;
  let uninterrupted: Promise<ObservedRun> | undefined;
  let runs = 0;
  beforeAll(async () => {
    directory = mkdtempSync(join(tmpdir(), "umbradb-refcount-restart-"));
    await backend.start();
  }, 180_000);
  afterAll(async () => {
    await backend.stop();
    rmSync(directory, { recursive: true, force: true });
  }, 60_000);

  /**
   * A plan on the extended DAG fixture, every block recorded whole, its observations in a file of its own: the contents
   * hash after every block, or after the heights `hashed` names.
   */
  const dagPlan = (hashed?: readonly number[]): RunPlan => ({
    chain: { dag: "extended" },
    last: LAST,
    observe: join(directory, `run-${runs++}.jsonl`),
    full: "every",
    ...(hashed === undefined ? {} : { hashed }),
  });

  /** The uninterrupted run on the extended DAG fixture, one per backend. */
  const uninterruptedDag = (): Promise<ObservedRun> =>
    (uninterrupted ??= (async () => {
      const db = await backend.database();
      const plan = dagPlan();
      const outcome = await runSegment(db, await jobFor(db, plan), SEGMENT_MS);
      expect(outcome.ended).toMatchObject({ why: "last", cursor: `${LAST}`, reason: null });
      const run = observedRun(plan.observe);
      expect(run.problems).toEqual([]);
      return run;
    })());

  it(`R13 [FAULT]: the extended DAG fixture stopped after the COMMIT of every 37th height (${DAG_STOPS.join(", ")}) and restarted, each stop reported, has after every block the node set, root_counts, states and the contents hash of an uninterrupted run, and R3 passes`, async () => {
    const expected = await uninterruptedDag();
    const db = await backend.database();
    const plan = dagPlan();
    for (const stop of DAG_STOPS) {
      const outcome = await runSegment(db, await jobFor(db, plan, { hold: holdAt("after-commit", stop, "stop") }), SEGMENT_MS);
      expect(outcome.reached, `the stop at ${stop}`).toEqual({ event: "reached", point: "after-commit", height: stop });
      expect(outcome.ended, `the stop at ${stop}`).toMatchObject({ why: "stopped", cursor: `${stop}`, reason: null });
    }
    const last = await runSegment(db, await jobFor(db, plan), SEGMENT_MS);
    expect(last.ended).toMatchObject({ why: "last", cursor: `${LAST}`, reason: null });
    const restarted = observedRun(plan.observe);
    expect(restartProblems(restarted, expected, "extended", LAST)).toEqual([]);
  }, SEGMENT_MS * 4);

  for (const { point, height } of CRASHES) {
    it(`R14 [FAULT]: killed at ${point} of block ${height} (reported reached there), the database is the uninterrupted run's after ${point === "after-commit" ? "h" : "h − 1"}, never a mix, and the restarted run's node set and byte-hashed tables after every block and contents hash after h − 1, h, h + 1 and the last are the uninterrupted run's, with R3 passing after every block`, async () => {
      const expected = await uninterruptedDag();
      const db = await backend.database();
      // The contents hash where the crash left the database and the restart went on, and at the end.
      const plan = dagPlan([height - 1, height, height + 1, LAST]);
      const killed = await runSegment(db, await jobFor(db, plan, { hold: holdAt(point, height, "hold") }), SEGMENT_MS);
      expect(killed.reached).toEqual({ event: "reached", point, height });
      expect(killed.killed).toBe(true);
      expect(mixProblems(await databaseNow(db, PATIENCE_MS), expected, point === "after-commit" ? height : height - 1)).toEqual([]);
      const restarted = await runSegment(db, await jobFor(db, plan), SEGMENT_MS);
      expect(restarted.ended).toMatchObject({ why: "last", cursor: `${LAST}`, reason: null });
      expect(restartProblems(observedRun(plan.observe), expected, "extended", LAST)).toEqual([]);
    }, SEGMENT_MS * 3);
  }
});
