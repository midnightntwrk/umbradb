import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { a142Problems, HOLD_MS, holding, observe, quietProblems, type Seen, SLOW_HEIGHT, startSlow } from "./slow-block-harness.js";

/**
 * A142 (task 5.5; RN-17, AE-3, AE-5, Q71) through the process on PostgreSQL 18 and PGlite 0.5.10: with `slowBlockMs`
 * 1000, a test module whose `on-compute` at height 2 awaits 3 s — the runner's published state (`status()`) and
 * `/status` (`core-status`, task 8.3) show `slow-block` with the height, `on-compute` and the module within 2 s; the
 * height commits once, with no retry; the condition is gone after the commit; with `slowBlockMs` 5000 it never
 * appears. The oracles are `./slow-block-harness.ts`'s; the cases RN-17 leaves to the design are
 * `./slow-block-cases.test.ts`, the committed negative controls `./slow-block.negative-control.test.ts`.
 *
 * Each test waits on purpose (the callback's 3 s, then 1.5 s after the commit): its budget is that plus Vitest's 60 s.
 */

const BUDGET_MS = HOLD_MS + 60_000;

describe.each(PROCESS_BACKENDS)("A142: slow-block on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it(
    "with slowBlockMs 1000 and on-compute awaiting 3 s: shown within 2 s with the height, the point and the module; " +
      "committed once; gone after the commit",
    async () => {
      const seen: Seen = { calls: [] };
      const run = startSlow(await backend.database(), { slowBlockMs: 1_000, user: [holding("slow", seen)] });
      try {
        const observed = await observe(run);
        expect(a142Problems(observed, seen, run.lines, run.source.asked.get(SLOW_HEIGHT))).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "with slowBlockMs 5000 and the same callback: never shown, never logged; committed once",
    async () => {
      const seen: Seen = { calls: [] };
      const run = startSlow(await backend.database(), { slowBlockMs: 5_000, user: [holding("slow", seen)] });
      try {
        const observed = await observe(run);
        expect(quietProblems(observed, seen, run.lines)).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );
});
