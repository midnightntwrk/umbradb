import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { FinalizedLoop, type HeightActivity, type HeightRun, type LoopInput, type ReadOpener } from "../../src/runner/loop.js";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { a142Problems, HOLD_MS, holding, observe, quietProblems, type Seen, SLOW_HEIGHT, startSlow } from "./slow-block-harness.js";

/**
 * A142's committed negative controls (task 5.5; RN-17, Q71): wrong watchdogs, each a loop of the process
 * (`ProcessInput.loop`), each failing A142's own oracle (`./slow-block-harness.ts`) through the process on PostgreSQL
 * 18 and PGlite 0.5.10 —
 * - one that never clears the condition fails "the condition is gone after the commit";
 * - one that retries the slow height (a retryable failure once its `on-compute` has run `slowBlockMs`) and one that
 *   cancels it (a plain failure then: a halt) fail "the height commits once, with no retry";
 * - one that ignores `slowBlockMs` (a fixed threshold of 1000 ms) fails the 5000 case, and one with a fixed 2500 ms
 *   fails "within 2 s" of the 1000 case.
 */

const BUDGET_MS = 2 * HOLD_MS + 60_000;

/** A watchdog that never clears: it keeps giving the last slow height it gave. */
class NeverClears extends FinalizedLoop {
  #last: HeightActivity | null = null;

  override slowBlock(): HeightActivity | null {
    this.#last = super.slowBlock() ?? this.#last;
    return this.#last;
  }
}

/**
 * A watchdog that cuts a slow `on-compute` off: once it has run `slowBlockMs`, the height fails with `failure()` — the
 * first time only, the callback left running.
 */
function cutting(failure: () => Error): new (input: LoopInput) => FinalizedLoop {
  return class CutsSlow extends FinalizedLoop {
    #cut = false;

    protected override async compute(run: HeightRun, open: ReadOpener): Promise<void> {
      const computing = super.compute(run, open);
      if (this.#cut) return computing;
      computing.catch(() => undefined);
      let timer: ReturnType<typeof setTimeout> | undefined;
      const cut = new Promise<"cut">((resolve) => {
        timer = setTimeout(() => resolve("cut"), this.slowBlockMs() as number);
      });
      const outcome = await Promise.race([computing.then(() => "done" as const), cut]);
      clearTimeout(timer);
      if (outcome === "cut") {
        this.#cut = true;
        throw failure();
      }
    }
  };
}

/** A watchdog whose threshold is `ms`, whatever `slowBlockMs` says. */
function fixed(ms: number): new (input: LoopInput) => FinalizedLoop {
  return class FixedThreshold extends FinalizedLoop {
    protected override slowBlockMs(): number | null {
      return ms;
    }
  };
}

/** Waits until `seen`'s held callback ended (a cut-off callback still runs), up to 30 s. */
async function ended(seen: Seen): Promise<void> {
  const until = performance.now() + 30_000;
  while (seen.end === undefined && performance.now() < until) await sleep(50);
}

describe.each(PROCESS_BACKENDS)("A142's negative controls on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A142's 1000 case run with `loop`: its problems. */
  async function problemsOf(loop: new (input: LoopInput) => FinalizedLoop, slowBlockMs = 1_000): Promise<string[]> {
    const seen: Seen = { calls: [] };
    const run = startSlow(await backend.database(), { slowBlockMs, user: [holding("slow", seen)], loop, extra: { backoffCeilingMs: 50 } });
    try {
      const observed = await observe(run);
      await ended(seen);
      return slowBlockMs === 1_000
        ? a142Problems(observed, seen, run.lines, run.source.asked.get(SLOW_HEIGHT))
        : quietProblems(observed, seen, run.lines);
    } finally {
      await run.handle.stop();
    }
  }

  it(
    "a watchdog that never clears fails 'gone after the commit'",
    async () => {
      expect(await problemsOf(NeverClears)).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^status\(\) showed slow-block after the commit, \d+ times$/),
          expect.stringMatching(/^\/status showed slow-block after the commit, \d+ times$/),
        ]),
      );
    },
    BUDGET_MS,
  );

  it(
    "a watchdog that retries the slow height fails 'commits once, with no retry'",
    async () => {
      const retries = cutting(() => new UmbraError("connection-lost", "the watchdog cut the slow height off to retry it"));
      expect(await problemsOf(retries)).toEqual(
        expect.arrayContaining([
          `slow's on-compute at ${SLOW_HEIGHT} ran 2 times, not once`,
          expect.stringMatching(/^a retry was logged: processing retries in \d+ ms \(database-retrying, attempt 1\)/),
          "conditions other than slow-block were raised: database-retrying",
        ]),
      );
    },
    BUDGET_MS,
  );

  it(
    "a watchdog that cancels the slow height fails 'commits once'",
    async () => {
      const cancels = cutting(() => new Error("the watchdog cancelled the slow height"));
      expect(await problemsOf(cancels)).toEqual(
        expect.arrayContaining([`height ${SLOW_HEIGHT} never committed`, expect.stringMatching(/^the process was halted: /)]),
      );
    },
    BUDGET_MS,
  );

  it(
    "a watchdog that ignores slowBlockMs fails the 5000 case (fixed at 1000 ms) and 'within 2 s' (fixed at 2500 ms)",
    async () => {
      expect(await problemsOf(fixed(1_000), 5_000)).toEqual(
        expect.arrayContaining([expect.stringMatching(/^status\(\) showed slow-block \d+ times/), expect.stringMatching(/^slow-block was logged: /)]),
      );
      expect(await problemsOf(fixed(2_500))).toEqual(
        expect.arrayContaining([expect.stringMatching(/^status\(\) showed slow-block \d+ ms after on-compute began, not within 2 s$/)]),
      );
    },
    2 * BUDGET_MS,
  );
});
