import { EventEmitter } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { FinalizedLoop, type HeightRun } from "../../src/runner/loop.js";
import type { LoopPauses } from "../../src/runner/pause.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, PATIENCE_MS, tickerModule } from "./backup-fixtures.js";
import {
  backupAtPause,
  eachHeightOnce,
  goesOn,
  hookAt,
  type LoopClass,
  pausedBetweenHeights,
  type Pausable,
  recorderModule,
  startPausable,
  stopEndsWhilePaused,
  within,
  writePausableConfig,
} from "./pause-fixtures.js";

/**
 * A163's committed negative controls (task 15.1a; BK-1, RN-13, owner decision Q152 B), on PGlite 0.5.10, each a loop
 * (`ProcessInput.loop`) that pauses wrongly, run through `./pause.test.ts`'s scenario and oracles
 * (`./pause-fixtures.ts`), each oracle seen failing:
 * - **inside the height:** a loop that pauses in a height's block transaction, before its `on-db-write`, instead of
 *   between heights — "paused between heights" fails (the last point is the height's `on-compute`, a transaction open);
 * - **not held:** a loop that tells the pause it arrived but goes on — "starts nothing while paused" fails, and so does
 *   "SIGUSR2 writes a backup at its next pause" (the backup is of a later height than the pause's, points ran meanwhile);
 * - **stays paused:** a loop that never goes on once paused — "resumed, it goes on" fails;
 * - **ignores the stop:** a loop whose pause a stop does not end — RN-13's "a stop while paused ends the process" fails;
 * - **ends the run:** a loop that pauses by ending its run, which the process runs again (as after a lost connection) —
 *   "loses and repeats no height" fails: the run again re-delivers the cursor's `on-after-db-write` (RN-11).
 */

const TEST_TIMEOUT_MS = 900_000;

/** How long a negative control's process is given to do what the real loop does at once. */
const SHORT_MS = 15_000;

const PGLITE = BACKUP_BACKENDS[1] as BackupBackend;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  project.write("recorder.ts", recorderModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-pause-nc-"));
  await PGLITE.start();
}, 300_000);

afterAll(async () => {
  await PGLITE.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

/** A signal that never aborts, or one aborted already. */
const never = (): AbortSignal => new AbortController().signal;
const aborted = (): AbortSignal => AbortSignal.abort();

/** Resolves once `signal` aborts. */
const abortOf = (signal: AbortSignal | undefined): Promise<void> =>
  new Promise((resolve) => (signal ?? never()).addEventListener("abort", () => resolve(), { once: true }));

/** Pauses in the height's block transaction, before its `on-db-write`, and never between heights. */
class PausesInsideTheHeight extends FinalizedLoop {
  protected override pauseBetween(): Promise<void> {
    return Promise.resolve();
  }

  protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
    await this.input.pause?.between(this.input.signal ?? never());
    await super.write(tx, run);
  }
}

/** Tells a hold it was reached, and goes on. */
class DoesNotHold extends FinalizedLoop {
  protected override async pauseBetween(): Promise<void> {
    await this.input.pause?.between(aborted());
  }
}

/** Once paused, never goes on (until stopped). */
class StaysPaused extends FinalizedLoop {
  #paused = false;

  protected override async pauseBetween(): Promise<void> {
    if ((this.input.pause as LoopPauses).held) this.#paused = true;
    await super.pauseBetween();
    if (this.#paused) await abortOf(this.input.signal);
  }
}

/** Its pause does not end at the stop: only a resume ends it. */
class IgnoresTheStop extends FinalizedLoop {
  protected override async pauseBetween(): Promise<void> {
    await this.input.pause?.between(never());
  }
}

/** Pauses by ending its run with a retryable failure (the hold told first): the process runs it again. */
class EndsTheRun extends FinalizedLoop {
  protected override async pauseBetween(): Promise<void> {
    const pauses = this.input.pause as LoopPauses;
    if (!pauses.held) return;
    await pauses.between(aborted());
    throw new UmbraError("connection-lost", "the run ends to pause (a negative control)");
  }
}

/** A process of `loop` over a chain up to 80, a pause asked for at `on-db-write` of 10; the pause's promise. */
async function pausedAt10(loop: LoopClass): Promise<{ readonly run: Pausable; readonly paused: () => Promise<void> }> {
  const db = await PGLITE.database();
  const run = await startPausable(writePausableConfig(project, { database: db.setting }), { head: 80n, loop });
  let paused: Promise<void> | undefined;
  hookAt("on-db-write", 10n, () => {
    paused = run.handle.pause();
  });
  await run.handle.started;
  const deadline = Date.now() + PATIENCE_MS;
  while (paused === undefined) {
    const ended = run.handle.status().ended;
    if (ended !== null) throw new Error(`processing ended (${ended.kind}) before the pause at 10: ${run.lines().join(" | ")}`);
    if (Date.now() > deadline) throw new Error("never asked to pause at 10");
    await sleep(10);
  }
  return { run, paused: () => paused as Promise<void> };
}

/** Ends `run`: resumed, then stopped. */
async function end(run: Pausable): Promise<void> {
  run.handle.resume();
  await run.handle.stop();
}

describe("A163's negative controls: loops that pause wrongly fail its oracles (BK-1, RN-13, Q152 B)", () => {
  it("a loop that pauses inside the height (in its block transaction) fails \"paused between heights\"", async () => {
    const { run, paused } = await pausedAt10(PausesInsideTheHeight);
    try {
      await expect(pausedBetweenHeights(run, paused(), 10n)).rejects.toThrow(/the last point before the pause/);
      expect(run.points().at(-1)).toBe("on-compute@11");
      expect(run.loop()?.blockTransaction()).not.toBeNull();
    } finally {
      await end(run);
    }
  }, TEST_TIMEOUT_MS);

  it("a loop that goes on though paused fails \"starts nothing while paused\"", async () => {
    const { run, paused } = await pausedAt10(DoesNotHold);
    try {
      // It went on at once: past the height it paused at, before the test could look, or while paused.
      await expect(pausedBetweenHeights(run, paused(), 10n)).rejects.toThrow(
        /the pause's height|points run while paused|the last point before the pause/,
      );
      expect(run.handle.status().cursor as bigint).toBeGreaterThan(10n);
    } finally {
      await end(run);
    }
  }, TEST_TIMEOUT_MS);

  it("a loop that goes on though paused fails \"SIGUSR2 writes a backup at its next pause\"", async () => {
    const db = await PGLITE.database();
    const out = join(dir, "not-held.backup");
    const signals = new EventEmitter();
    const run = await startPausable(writePausableConfig(project, { database: db.setting, extra: { backupOnSignal: out } }), {
      head: 80n,
      loop: DoesNotHold,
      backupSignals: signals,
    });
    hookAt("on-compute", 20n, () => signals.emit("SIGUSR2"));
    try {
      await run.handle.started;
      await within(run.source.waiting(80n), PATIENCE_MS, "the loop waiting at 80");
      const deadline = Date.now() + PATIENCE_MS;
      while (!run.lines().some((line) => line.startsWith(`backup on signal written to ${out}`))) {
        if (Date.now() > deadline) throw new Error(`no backup written: ${run.lines().join(" | ")}`);
        await sleep(10);
      }
    } finally {
      await end(run);
    }
    expect(() => backupAtPause(run, out)).toThrow(/the backup of height \d+ written|points run while the backup was written/);
  }, TEST_TIMEOUT_MS);

  it("a loop that stays paused after resume() fails \"resumed, it goes on\"", async () => {
    const { run, paused } = await pausedAt10(StaysPaused);
    try {
      expect(await pausedBetweenHeights(run, paused(), 10n)).toBe(10n);
      await expect(goesOn(run, 10n, SHORT_MS)).rejects.toThrow(/the cursor is 10, not 13/);
    } finally {
      await end(run);
    }
  }, TEST_TIMEOUT_MS);

  it("a loop whose pause the stop does not end fails RN-13's \"a stop while paused ends the process\"", async () => {
    const { run, paused } = await pausedAt10(IgnoresTheStop);
    try {
      await expect(stopEndsWhilePaused(run, paused(), SHORT_MS)).rejects.toThrow(/a stop while paused did not end the process/);
    } finally {
      await end(run);
    }
    expect(await run.handle.ended).toEqual({ kind: "signal" });
  }, TEST_TIMEOUT_MS);

  it("a loop that pauses by ending its run fails \"loses and repeats no height\"", async () => {
    const { run, paused } = await pausedAt10(EndsTheRun);
    try {
      // Its pause may look right for a while (the process waits its back-off before running the loop again).
      await pausedBetweenHeights(run, paused(), 10n).catch(() => undefined);
      await goesOn(run, 10n);
      await within(run.source.waiting(80n), PATIENCE_MS, "the loop waiting at 80");
    } finally {
      await end(run);
    }
    expect(run.lines().some((line) => line.startsWith("processing retries in "))).toBe(true);
    expect(() => eachHeightOnce(run.points(), 1n, 80n)).toThrow();
    // The cursor's on-after-db-write ran again at each run after the pause (once, or more under load).
    expect(run.points().filter((point) => point === "on-after-db-write@10").length).toBeGreaterThanOrEqual(2);
  }, TEST_TIMEOUT_MS);
});
