import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { blocksIn, cleanUp, workDirectory } from "./pglite-processes.js";
import {
  expectPausedWriterKeepsLock,
  expectRestartAfterKillContinues,
  expectSecondPgliteProcessRefused,
  expectTenLockersOneHolds,
  expectTenStartersOneRuns,
} from "./writer-lock-checks.js";

/**
 * The PGlite writer-lock cases that need processes of their own: a writer paused with `SIGSTOP`, a writer killed with
 * `SIGKILL` and restarted, and ten processes started together. Each is a PGlite writer started with
 * `node --import tsx` (`pglite-writer.worker.ts`) in a temporary directory deleted afterwards.
 * [A17 FAULT, DB-11, Q50]
 *
 * **The pause lasts the required 5 minutes** (300 s) unless `UMBRADB_A17_SIGSTOP_SECONDS` is set: a shorter pause is
 * for local iteration and mutation runs only, and the test's title says how long it ran. The pause costs one test
 * worker 5 minutes of waiting, not CPU, so the conformance run keeps the full length.
 *
 * "Stays up, not ready" (the refused process) and "processing halts" belong to the runner. "Continues from the cursor"
 * is shown with the test's own cursor (the highest height of `t.blocks`), as the runner's cursor will be read.
 *
 * **Committed negative control:** a lock released when its statement ends instead of at process exit
 * (`lockKind: "statement-scoped"`) makes the second-writer, paused-writer and ten-starters checks fail.
 */

const STOP_SECONDS = Number(process.env.UMBRADB_A17_SIGSTOP_SECONDS ?? "300");
/** Rounds of ten processes opening PGlite together, and of ten taking the lock alone (cheaper, so more of them). */
const START_ROUNDS = 3;
const LOCK_ROUNDS = 12;

afterEach(async () => {
  await cleanUp();
});

/** A data directory in a new work directory. */
const dataDirectory = (): string => join(workDirectory(), "pgdata");

/** The assertion error `check` fails with; fails the test if `check` passes or fails otherwise. */
async function assertionFailure(check: Promise<unknown>): Promise<Error> {
  try {
    await check;
  } catch (error) {
    if (error instanceof Error && error.name === "AssertionError") return error;
    throw error;
  }
  throw new Error("the check passed, but the negative control must make it fail");
}

describe("A17 — the PGlite writer lock across processes (DB-11)", () => {
  it(`A17: a writer stopped with SIGSTOP for ${STOP_SECONDS} s keeps its lock (a second process refuses) and continues after SIGCONT; only it writes`, async () => {
    const report = await expectPausedWriterKeepsLock(dataDirectory(), STOP_SECONDS, blocksIn);
    expect(report.pausedMs).toBeGreaterThanOrEqual(STOP_SECONDS * 1_000);
    expect(report.refusals).toBe(STOP_SECONDS * 1_000 >= 20_000 ? 3 : 2);
    console.info(`A17 SIGSTOP: paused ${report.pausedMs} ms at height ${report.heightAtStop}; ${report.refusals} refusals; ${report.rows} rows`);
  }, (STOP_SECONDS + 240) * 1_000);

  it("A17: after SIGKILL the restarted process takes the lock at once and continues from the cursor", async () => {
    const report = await expectRestartAfterKillContinues(dataDirectory(), blocksIn);
    console.info(`A17 SIGKILL: acknowledged ${report.acknowledged}, cursor ${report.from}, lock taken in ${report.lockMs.toFixed(1)} ms`);
  }, 180_000);

  it(`A17: ten processes started together against one PGlite directory end with exactly one running (${START_ROUNDS} rounds)`, async () => {
    for (let round = 0; round < START_ROUNDS; round++) await expectTenStartersOneRuns(dataDirectory(), blocksIn);
  }, 300_000);

  it(`ten processes taking the lock at one instant: exactly one holds it, nine refuse (${LOCK_ROUNDS} rounds)`, async () => {
    for (let round = 0; round < LOCK_ROUNDS; round++) await expectTenLockersOneHolds(dataDirectory());
  }, 300_000);
});

describe("A17's negative control: a lock released when its statement ends instead of at process exit", () => {
  it("makes the second-writer check fail: the second process opens the directory", async () => {
    const failure = await assertionFailure(expectSecondPgliteProcessRefused(dataDirectory(), "statement-scoped"));
    expect(failure.message).toMatch(/^expected \{ event: 'opened'/);
  }, 180_000);

  it("makes the paused-writer check fail: a second process opens the directory while the writer is stopped", async () => {
    const failure = await assertionFailure(expectPausedWriterKeepsLock(dataDirectory(), 2, blocksIn, "statement-scoped"));
    expect(failure.message).toMatch(/^expected \{ event: 'opened'/);
  }, 180_000);

  it("makes the ten-starters check fail: more than one process opens the directory", async () => {
    const failure = await assertionFailure(expectTenStartersOneRuns(dataDirectory(), blocksIn, "statement-scoped"));
    expect(failure.message).toMatch(/refused/);
  }, 300_000);
});
