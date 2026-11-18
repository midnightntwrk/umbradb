import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { BlockWrites } from "../../src/db/write-handles.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import {
  DIGEST_BACKBONE,
  heightsIn,
  InMemoryBlockSource,
  LOOP_BACKBONE,
  RUNNER_BACKENDS,
  runUntilWaiting,
  startWith,
} from "./loop-harness.js";

/**
 * The work the loop does for the `on-settle` point (`src/runner/loop.ts`), on PostgreSQL 18 and PGlite 0.5.10. The loop
 * decides once per resolved range whether any part of it declares the point: it builds the point's schedule at the
 * range's first block and keeps it. In a range where no part declares it, a block neither schedules nor calls the
 * point; where one does, each block calls it with the schedule built once.
 *
 * The dispatch's `scheduleAt` is wrapped here (`vi.mock`) to count the schedules the loop builds, by point.
 */

/** The points of each `scheduleAt` call the loop made, in order. */
const built = vi.hoisted(() => ({ points: [] as string[] }));

vi.mock("../../src/runner/dispatch.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/runner/dispatch.js")>();
  return {
    ...actual,
    scheduleAt: (...args: Parameters<typeof actual.scheduleAt>) => {
      built.points.push(args[1]);
      return actual.scheduleAt(...args);
    },
  };
});

const HEAD = 3n;

/** A loop that counts its calls of the `on-settle` point. */
class CountingSettles extends FinalizedLoop {
  static calls = 0;

  protected override async settlePoint(run: HeightRun, writes: BlockWrites): Promise<void> {
    CountingSettles.calls += 1;
    await super.settlePoint(run, writes);
  }
}

describe.each(RUNNER_BACKENDS)("the loop's work for the on-settle point on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Runs `plain` (a row per height at `on-db-write`) over 1 to HEAD on `backbone`: on-settle schedules, its calls. */
  async function counted(backbone: typeof LOOP_BACKBONE): Promise<{ readonly schedules: number; readonly calls: number }> {
    const { db } = await backend.database();
    const plain = declaration("plain", {
      points: {
        async "on-db-write"(_p, b, w) {
          await w.execute("INSERT INTO plain.rows (height) VALUES ($1)", [b.height]);
        },
      },
    });
    const started = await startWith(db, [plain], [entry("plain", 1)], { backbone });
    built.points.length = 0;
    CountingSettles.calls = 0;
    await runUntilWaiting(started, new InMemoryBlockSource({ head: HEAD }), HEAD, CountingSettles);
    expect(await heightsIn(db, "plain.rows")).toEqual([1n, 2n, 3n]);
    return { schedules: built.points.filter((point) => point === "on-settle").length, calls: CountingSettles.calls };
  }

  it("in a range where no part declares on-settle, it decides so once and no block schedules or calls the point", async () => {
    // The test backbone's core-digest declares no point, and neither does plain.
    expect(await counted(LOOP_BACKBONE)).toEqual({ schedules: 1, calls: 0 });
  }, 60_000);

  it("in a range where a part declares it (the real core-digest), the schedule is built once and called at every block", async () => {
    expect(await counted(DIGEST_BACKBONE)).toEqual({ schedules: 1, calls: Number(HEAD) });
  }, 60_000);
});
