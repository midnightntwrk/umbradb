import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Transaction } from "../../src/db/api.js";
import { type BlockWrites, openBlockWrites } from "../../src/db/write-handles.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { entry } from "../modules/graph-fixtures.js";
import { type LoopClass, RUNNER_BACKENDS, runUntilWaiting, startWith } from "./loop-harness.js";
import {
  HEAD,
  LoggedSource,
  loggingTransactions,
  orderProblems,
  seen as newSeen,
  settlingModules,
} from "./settle-point-harness.js";

/**
 * The committed negative controls of the `on-settle` point's order (`settle-point.test.ts`), each failing the order's
 * oracle (`orderProblems`, in `./settle-point-harness.ts`) on PostgreSQL 18 and PGlite 0.5.10:
 * - a loop that calls the point after the block's `COMMIT`, in a transaction of its own;
 * - a loop that calls it inside the block transaction, but after the cursor check.
 * Each calls every callback with the same run and stores the same rows, so the order is the only thing the oracle can
 * catch.
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

/** A loop whose `on-settle` point runs inside the block transaction, but after the cursor check. */
class SettlesAfterTheCursorCheck extends FinalizedLoop {
  #late = false;

  protected override async settlePoint(run: HeightRun, writes: BlockWrites): Promise<void> {
    if (this.#late) await super.settlePoint(run, writes);
  }

  protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
    await super.write(tx, run);
    this.#late = true;
    try {
      await this.settlePoint(run, openBlockWrites(tx, this.input.plan, { height: run.previous?.height ?? null }));
    } finally {
      this.#late = false;
    }
  }
}

describe.each(RUNNER_BACKENDS)("the negative controls of the on-settle point's order on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** The order's problems of `kind` over 1 to HEAD. */
  async function problemsOf(kind: LoopClass): Promise<string[]> {
    const { db } = await backend.database();
    const seen = newSeen();
    const started = await startWith(db, settlingModules(seen), [entry("alpha", 1), entry("beta", 1)]);
    const logged = { ...started, db: loggingTransactions(started.db, seen.log) };
    await runUntilWaiting(logged, new LoggedSource(seen.log, { head: HEAD }), HEAD, kind);
    return orderProblems(seen, [1n, 2n, 3n]);
  }

  it("a loop that calls on-settle after the COMMIT fails the order's oracle at the first height's cursor check", async () => {
    const problems = await problemsOf(SettlesAfterCommit);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^the log differs at line 8: cursor where alpha on-settle@1\.\.1 was expected/);
    expect(problems[0]).toContain("beta on-db-write@1, cursor, COMMIT, BEGIN, alpha on-settle@1..1, beta on-settle@1..1, COMMIT");
  }, 60_000);

  it("a loop that calls on-settle after the cursor check fails the order's oracle there, in the same transaction", async () => {
    const problems = await problemsOf(SettlesAfterTheCursorCheck);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^the log differs at line 8: cursor where alpha on-settle@1\.\.1 was expected/);
    expect(problems[0]).toContain("beta on-db-write@1, cursor, alpha on-settle@1..1, beta on-settle@1..1, COMMIT");
  }, 60_000);
});
