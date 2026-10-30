import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { FinalizedLoop, type HeightActivity, type LoopInput, type SlowWindow } from "../../src/runner/loop.js";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { a161Problems, AFTER_COMMIT_MS, HOLD_MS, holding, observe, type OutsidePoint, type Seen, SLOW_HEIGHT, startSlow } from "./slow-block-harness.js";

/**
 * The committed negative controls for slow activity outside a height's processing: wrong watchdogs, each a loop of the
 * process (`ProcessInput.loop`). Each fails that case's own oracle (`./slow-block-harness.ts`, `a161Problems`) through
 * the process on PostgreSQL 18 and PGlite 0.5.10. [A161, RN-17, Q145 B]
 * - One that never times the points after a commit (the earlier watchdog) fails "shown" for `on-after-db-write`.
 * - One that never times `on-finalized` fails "shown" for it.
 * - One that does not clear the condition when the point ends (it keeps the last slow activity outside a height's
 *   processing) fails "gone once that callback ends".
 *
 * Height 2's own processing, which these watchdogs still time, can pass `slowBlockMs` 1000 on a loaded machine. The
 * oracle does not count that `slow-block` as the outside activity's, so a control fails for its own reason only.
 */

const BUDGET_MS = 2 * HOLD_MS + AFTER_COMMIT_MS + 60_000;

/** A watchdog that times no window of the kind `skipped`: no threshold for it (the seam `slowBlockMs(window)`). */
function untimed(skipped: SlowWindow): new (input: LoopInput) => FinalizedLoop {
  return class Untimed extends FinalizedLoop {
    protected override slowBlockMs(window: SlowWindow): number | null {
      return window === skipped ? null : super.slowBlockMs(window);
    }
  };
}

/**
 * A watchdog that does not clear the windows outside a height's processing: it keeps giving the last slow activity it
 * gave there. A height's own window, which a loaded machine can make slow, it gives only while open, as the real one
 * does. If it were kept, it would replace the outside activity in what the control shows. [A161]
 */
class NeverClears extends FinalizedLoop {
  #last: HeightActivity | null = null;

  override slowBlock(): HeightActivity | null {
    const now = super.slowBlock();
    if (now !== null && now.window !== "height") this.#last = now;
    return now ?? this.#last;
  }
}

describe.each(PROCESS_BACKENDS)("A161's negative controls on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** The outside-activity case for `point` run with `loop`: its problems. [A161] */
  async function problemsOf(loop: new (input: LoopInput) => FinalizedLoop, point: OutsidePoint): Promise<string[]> {
    const seen: Seen = { calls: [] };
    const run = startSlow(await backend.database(), { slowBlockMs: 1_000, user: [holding("slow", seen, { point })], loop });
    try {
      const observed = await observe(run, SLOW_HEIGHT, () => seen.end);
      return a161Problems(observed, seen, run, point);
    } finally {
      await run.handle.stop();
    }
  }

  it(
    "a watchdog that never times the points after a commit fails 'shown' for on-after-db-write",
    async () => {
      expect(await problemsOf(untimed("after-commit"), "on-after-db-write")).toEqual(
        expect.arrayContaining(["status() never showed slow-block", "/status never showed slow-block", "the window of on-after-db-write never ended"]),
      );
    },
    BUDGET_MS,
  );

  it(
    "a watchdog that never times on-finalized fails 'shown' for it",
    async () => {
      expect(await problemsOf(untimed("finalized"), "on-finalized")).toEqual(
        expect.arrayContaining(["status() never showed slow-block", "/status never showed slow-block", "the window of on-finalized never ended"]),
      );
    },
    BUDGET_MS,
  );

  it(
    "a watchdog that does not clear when the point ends fails 'gone once that callback ends'",
    async () => {
      for (const point of ["on-after-db-write", "on-finalized"] as const) {
        expect(await problemsOf(NeverClears, point), point).toEqual(
          expect.arrayContaining([
            expect.stringMatching(new RegExp(`^status\\(\\) showed slow-block in ${point} after the callback ended, \\d+ times$`)),
            expect.stringMatching(new RegExp(`^/status showed slow-block in ${point} after the callback ended, \\d+ times$`)),
          ]),
        );
      }
    },
    2 * BUDGET_MS,
  );
});
