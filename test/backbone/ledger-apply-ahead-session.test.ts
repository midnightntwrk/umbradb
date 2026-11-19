import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { WRITER_LOCK_CLASS, WRITER_LOCK_KEY } from "../../src/db/writer-lock.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { startTrace, stopTrace } from "../../src/trace/trace.js";
import { FLIP, LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { AHEAD, aheadTrace, AT_ITS_TURN, tablesText } from "./ledger-apply-ahead.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * The next block applied ahead when the writer's session is replaced between two heights, through the real process on
 * PostgreSQL 18 (PGlite has one session): after h's `COMMIT`, with h + 1 applied ahead by h's settle, another writer
 * ends the process's writer session and holds the writer lock for a moment. h + 1's block context then says it does not
 * continue h, so its result applied ahead is dropped and h + 1 is applied at its turn; the run stores at every height
 * what the run without blocks ahead stores, with the same replacement.
 */

/** A loop after whose `COMMIT` of `at` another writer replaces the process's writer session once. */
function replacingLoop(db: ProcessDatabase, at: bigint): new (input: LoopInput) => FinalizedLoop {
  let acted = false;
  return class extends FinalizedLoop {
    protected override async commit(run: HeightRun): Promise<void> {
      await super.commit(run);
      if (run.height !== at || acted) return;
      acted = true;
      await anotherWriter(db, this.input.db);
    }
  };
}

/** Ends the process's writer session, takes the writer lock on a session of its own, and gives it back. */
async function anotherWriter(db: ProcessDatabase, loopDb: Database): Promise<void> {
  await (db.terminateWriter as () => Promise<number>)();
  const session = (): number | null | undefined => (loopDb as Partial<Pick<Database, "writerSession">>).writerSession?.();
  for (let attempt = 0; attempt < 200 && session() !== null; attempt++) await new Promise((resolve) => setTimeout(resolve, 25));
  if (!(await (db.takeWriterLock as () => Promise<boolean>)())) throw new Error("the test's writer could not take the writer lock");
  await db.query(`SELECT pg_advisory_unlock(${WRITER_LOCK_CLASS}, hashtext('${WRITER_LOCK_KEY}'))`);
}

describe("the next block applied ahead and a replaced writer's session, through the process on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as ProcessBackend;
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  it("the writer's session replaced after h's COMMIT: h + 1 does not continue h, its result applied ahead is dropped, and the tables are a run's without blocks ahead", async () => {
    const h = BigInt(FLIP + 1);
    const runs = [];
    for (const settings of [AT_ITS_TURN, AHEAD]) {
      const db = await backend.database();
      const trace = aheadTrace();
      startTrace(trace.sink, { steps: false });
      try {
        runs.push({ run: await runDag(db, { dag: "flip", settings, loop: replacingLoop(db, h) }), trace });
      } finally {
        stopTrace();
      }
    }
    const [serial, ahead] = runs as [(typeof runs)[number], (typeof runs)[number]];
    for (const { run } of runs) {
      expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(runProblems(run, "flip")).toEqual([]);
    }
    expect(serial.trace.dropped()).toEqual([]);
    expect(ahead.trace.dropped()).toEqual([Number(h + 1n)]);
    expect(ahead.trace.used()).toContain(Number(h));
    expect(ahead.trace.used()).toContain(Number(h + 2n));
    expect(ahead.run.restarts).toBe(0);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
  }, PATIENCE_MS * 4);
});
