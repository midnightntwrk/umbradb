import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { statusWhen } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS } from "./process-backends.js";
import {
  a161Problems,
  AFTER_COMMIT_MS,
  bodySlowOf,
  HOLD_MS,
  holding,
  jsonBigint,
  type Observed,
  observe,
  type Seen,
  SLOW_HEIGHT,
  slowOf,
  STATUS_SCHEMA,
  startSlow,
  WITHIN_MS,
} from "./slow-block-harness.js";

/**
 * A161 (task 5.5a; RN-17 as amended by the owner's decision Q145 B, AE-3, AE-5) through the process on PostgreSQL 18
 * and PGlite 0.5.10: the runner times, each as a window of its own, the callbacks it awaits outside a height's
 * processing — `on-after-db-write` and `on-stop-height` after each commit (one window, from the commit to the end of
 * `on-stop-height`), each `on-finalized`, and RN-11's re-delivery at a run's start —, each raising the same
 * `slow-block` with the height (which may have committed), the point and the module, cleared when its window ends;
 * nothing is cancelled or retried. With `slowBlockMs` 1000, module `slow`'s `on-after-db-write` at height 2 awaiting
 * 3 s, and likewise its `on-finalized` announcing height 2 as the head: `/status` (and `status()`) show `slow-block`
 * with height 2, that point and `slow` within 2 s, and the condition is gone once that callback ends (the oracle
 * `a161Problems`, `./slow-block-harness.ts`). Also here, through the process: RN-11's re-delivery at a restart, and a
 * failure in a window after the commit (a halt clears it). A142 is unchanged (`./slow-block.test.ts`); the windows'
 * settled cases at the loop level are `./slow-block-windows.test.ts`, the committed negative controls
 * `./slow-block-outside.negative-control.test.ts`.
 *
 * Each test waits on purpose (the callback's 3 s, then 1.5 s after it): its budget is that plus Vitest's 60 s.
 */

const BUDGET_MS = 2 * HOLD_MS + AFTER_COMMIT_MS + 60_000;

/** The `slow-block` conditions `status()` showed at height 2, with when. */
const shownOf = (observed: Observed) =>
  observed.statuses.flatMap(({ at, status }) => {
    const slow = slowOf(status);
    return slow === undefined ? [] : [{ at, ...slow }];
  });

describe.each(PROCESS_BACKENDS)("A161: slow-block outside a height's processing on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  for (const point of ["on-after-db-write", "on-finalized"] as const) {
    it(
      `with slowBlockMs 1000 and ${point} at height 2 awaiting 3 s: shown within 2 s with the height, the point and the ` +
        "module; gone once that callback ends; nothing cancelled or retried",
      async () => {
        const seen: Seen = { calls: [] };
        const run = startSlow(await backend.database(), { slowBlockMs: 1_000, user: [holding("slow", seen, { point })] });
        try {
          const observed = await observe(run, SLOW_HEIGHT, () => seen.end);
          expect(a161Problems(observed, seen, run, point)).toEqual([]);
        } finally {
          await run.handle.stop();
        }
      },
      BUDGET_MS,
    );
  }

  it(
    "RN-11's re-delivery at a restart is a window of its own: slow-block at the cursor's height in on-after-db-write",
    async () => {
      const db = await backend.database();
      // The first process commits heights 1 and 2, its on-after-db-write at 2 fast; the second, on the same database,
      // re-delivers height 2's on-after-db-write (RN-11), which awaits 3 s, and processes nothing else (the head is 2).
      const quick: Seen = { calls: [] };
      const first = startSlow(db, { slowBlockMs: 1_000, user: [holding("slow", quick, { point: "on-after-db-write", ms: 0 })] });
      try {
        await observe(first);
      } finally {
        await first.handle.stop();
      }
      const seen: Seen = { calls: [] };
      const run = startSlow(db, { slowBlockMs: 1_000, user: [holding("slow", seen, { point: "on-after-db-write" })] });
      try {
        const observed = await observe(run, SLOW_HEIGHT, () => seen.end);
        expect(seen.calls.filter((call) => call === "slow on-after-db-write@2")).toHaveLength(1);
        expect(seen.calls.filter((call) => call.endsWith("@2") && !call.includes("on-after-db-write"))).toEqual([]);
        const shown = shownOf(observed);
        expect(shown[0], JSON.stringify(shown[0], jsonBigint)).toMatchObject({
          code: "slow-block",
          height: SLOW_HEIGHT,
          point: "on-after-db-write",
          module: "slow",
        });
        expect(shown[0]!.at - (seen.start as number)).toBeLessThanOrEqual(WITHIN_MS);
        expect(shown[0]!.at - run.startedAt).toBeGreaterThan(1_000);
        const body = observed.bodies.find((read) => bodySlowOf(read.body) !== undefined);
        expect(body && bodySlowOf(body.body)).toEqual({ code: "slow-block", height: "2", point: "on-after-db-write", module: "slow" });
        expect(STATUS_SCHEMA.problems(body!.body)).toEqual([]);
        const lines = run.lines.filter((line) => line.startsWith("slow block: "));
        expect(lines).toEqual([
          "slow block: height 2 is still processing after slowBlockMs (1000 ms), in on-after-db-write of slow " +
            "(its re-delivery at the run's start)",
          expect.stringMatching(/^slow block: height 2's re-delivery ended after \d+ ms$/),
        ]);
        const end = run.lineAt[run.lines.indexOf(lines[1] as string)] as number;
        expect(end).toBeGreaterThanOrEqual(seen.end as number);
        expect(observed.statuses.filter(({ at, status }) => at > end && slowOf(status, null) !== undefined)).toEqual([]);
        expect(observed.statuses.filter(({ at }) => at > end).length).toBeGreaterThan(0);
        expect(observed.bodies.filter(({ at, body }) => at > end + 1_000 && bodySlowOf(body, null) !== undefined)).toEqual([]);
        expect(run.handle.status().state).toBe("following");
      } finally {
        await run.handle.stop();
      }
    },
    2 * BUDGET_MS,
  );

  it(
    "a failure in the window after the commit clears it: the halted process shows none, the log says it failed",
    async () => {
      const seen: Seen = { calls: [] };
      const failing = holding("slow", seen, {
        point: "on-after-db-write",
        ms: 2_500,
        calls: () => ({ then: new Error("the test's failure") }),
      });
      const run = startSlow(await backend.database(), { slowBlockMs: 1_000, user: [failing] });
      try {
        const observed = await observe(run, SLOW_HEIGHT, () => seen.end);
        expect(shownOf(observed).at(-1)).toMatchObject({ height: SLOW_HEIGHT, point: "on-after-db-write", module: "slow" });
        const status = run.handle.status();
        expect(status.state).toBe("halted");
        expect(status.cursor).toBe(SLOW_HEIGHT);
        expect(status.reason).toMatchObject({ code: "callback-error", height: SLOW_HEIGHT, module: "slow", point: "on-after-db-write" });
        expect(slowOf(status, null)).toBeUndefined();
        const body = await statusWhen(await run.origin(), (shown) => shown.state === "halted");
        expect(bodySlowOf(body, null)).toBeUndefined();
        // The window after height 2's commit, and the halt: a height's own processing, if a loaded machine made it slow,
        // logs lines of its own, which this case does not hold (issue 00043).
        const lines = run.lines.filter(
          (line) => (line.startsWith("slow block: ") && line.includes("after its commit")) || line.startsWith("processing halted"),
        );
        expect(lines).toEqual([
          "slow block: height 2 is still processing after slowBlockMs (1000 ms), in on-after-db-write of slow (after its commit)",
          expect.stringMatching(/^slow block: height 2's points after its commit failed after \d+ ms$/),
          expect.stringMatching(/^processing halted \(callback-error\): /),
        ]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );
});
