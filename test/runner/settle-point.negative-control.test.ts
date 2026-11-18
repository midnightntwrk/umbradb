import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type BlockWrites, openBlockWrites } from "../../src/db/write-handles.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { entry } from "../modules/graph-fixtures.js";
import { InMemoryBlockSource, RUNNER_BACKENDS, runUntilWaiting, startWith } from "./loop-harness.js";
import { HEAD, loggingTransactions, orderProblems, seen as newSeen, settlingModules } from "./settle-point-harness.js";

/**
 * The committed negative control of the `on-settle` point's order (`settle-point.test.ts`): a loop that calls the point
 * after the block's `COMMIT`, in a transaction of its own, fails the order's oracle (`orderProblems`, in
 * `./settle-point-harness.ts`) on PostgreSQL 18 and PGlite 0.5.10. It calls each callback with the same run and stores
 * the same rows, so the order is the only thing the oracle can catch.
 */

/** A loop whose `on-settle` point runs after the block's `COMMIT`, in a transaction of its own. */
class SettlesAfterCommit extends FinalizedLoop {
  #afterCommit = false;

  protected override async settlePoint(run: HeightRun, writes: BlockWrites): Promise<void> {
    if (this.#afterCommit) await super.settlePoint(run, writes);
  }

  protected override async commit(run: HeightRun): Promise<void> {
    await super.commit(run);
    this.#afterCommit = true;
    try {
      const { db, plan } = this.input;
      await db.transaction((tx) => this.settlePoint(run, openBlockWrites(tx, plan, { height: run.height })));
    } finally {
      this.#afterCommit = false;
    }
  }
}

describe.each(RUNNER_BACKENDS)("the negative control of the on-settle point's order on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("a loop that calls on-settle after the COMMIT fails the order's oracle at the first height's first on-settle", async () => {
    const { db } = await backend.database();
    const seen = newSeen();
    const started = await startWith(db, settlingModules(seen), [entry("alpha", 1), entry("beta", 1)]);
    const logged = { ...started, db: loggingTransactions(started.db, seen.log) };
    await runUntilWaiting(logged, new InMemoryBlockSource({ head: HEAD }), HEAD, SettlesAfterCommit);
    const problems = orderProblems(seen, [1n, 2n, 3n]);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^the log differs at line 7: COMMIT where alpha on-settle@1\.\.1 was expected/);
  }, 60_000);
});
