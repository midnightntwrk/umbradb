import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { entry } from "../modules/graph-fixtures.js";
import {
  continuesExpected,
  continuesModule,
  continuesOf,
  continuesProblems,
  H,
  HEAD,
  type LostCommit,
  losingCommits,
} from "./block-continues-harness.js";
import { InMemoryBlockSource, loopInput, RUNNER_BACKENDS, startWith } from "./loop-harness.js";

/**
 * The negative control of `block-continues.test.ts`, on PostgreSQL 18 and PGlite 0.5.10: a loop that keeps `continues`
 * true after a retry — true whenever the height has a block before it, through the protected seam
 * `FinalizedLoop.continues`. In one uninterrupted run it gives what the real loop gives; after a lost `COMMIT` the
 * oracle finds it wrong: the height made again, and the points after the commit and the next height of a height the
 * cursor read found committed, say true where a module's memory may hold rows that were rolled back.
 */

/** A loop whose block contexts say the block before continues whenever there is one. */
class KeepsContinuing extends FinalizedLoop {
  protected override continues(run: HeightRun): boolean {
    return run.previous !== null;
  }
}

describe.each(RUNNER_BACKENDS)("the negative control of continues on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Runs the control's loop over heights 1 to HEAD, losing H's `COMMIT` as `how` says; returns `c`'s log. */
  async function controlRun(how: LostCommit | undefined): Promise<string[]> {
    const { db: raw } = await backend.database();
    const log: string[] = [];
    const losing = losingCommits(raw);
    let armed = false;
    const module = continuesModule(log, {
      atWrite: (height) => {
        if (how === undefined || height !== H || armed) return;
        armed = true;
        losing.state.armed = how;
      },
    });
    const started = await startWith(raw, [module], [entry("c", 1)]);
    const source = new InMemoryBlockSource({ head: HEAD });
    const stop = new AbortController();
    const loop = new KeepsContinuing({ ...loopInput(started, source, stop), db: losing.db });
    for (let runs = 0; runs < 3; runs++) {
      const running = loop.run().then(
        () => undefined,
        (error: unknown) => error,
      );
      if ((await Promise.race([source.waiting(HEAD).then(() => "waiting" as const), running])) === "waiting") {
        stop.abort();
        await running;
        return log;
      }
      expect(await running).toMatchObject({ height: H, committed: false });
    }
    throw new Error("the control's loop did not reach the head");
  }

  it("one uninterrupted run: as the real loop", async () => {
    expect(continuesProblems(continuesOf(await controlRun(undefined)), continuesExpected(HEAD))).toEqual([]);
  }, 60_000);

  it("a COMMIT lost before it landed: the height made again says true", async () => {
    const expected = continuesExpected(HEAD, {
      [`on-compute@${H}`]: [true, false],
      [`on-db-write@${H}`]: [true, false],
      [`on-after-db-write@${H}`]: [false],
    });
    expect(continuesProblems(continuesOf(await controlRun("lost")), expected)).toEqual([
      `on-compute@${H}: [true,true], not [true,false]`,
      `on-db-write@${H}: [true,true], not [true,false]`,
      `on-after-db-write@${H}: [true], not [false]`,
    ]);
  }, 60_000);

  it("a COMMIT lost after it landed: the points after the commit and the next height say true", async () => {
    const expected = continuesExpected(HEAD, {
      [`on-after-db-write@${H}`]: [false],
      [`on-compute@${H + 1n}`]: [false],
      [`on-db-write@${H + 1n}`]: [false],
      [`on-after-db-write@${H + 1n}`]: [false],
    });
    expect(continuesProblems(continuesOf(await controlRun("landed")), expected)).toEqual([
      `on-after-db-write@${H}: [true], not [false]`,
      `on-compute@${H + 1n}: [true], not [false]`,
      `on-db-write@${H + 1n}: [true], not [false]`,
      `on-after-db-write@${H + 1n}: [true], not [false]`,
    ]);
  }, 60_000);
});
