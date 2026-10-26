import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import {
  ANSWER_MS,
  type AdminRun,
  ENDPOINTS,
  type Hold,
  mainThreadAdmin,
  newHold,
  PROBES_DURING_HOLD,
  type ProbeRecord,
  startProber,
  startWithAdmin,
  statusWhen,
  timingProblems,
} from "../../admin/admin-harness.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { loggingModule } from "../../runner/process-build.js";

/**
 * A63 (task 8.2; AE-2) through the process on PostgreSQL 18 and PGlite, with a 5 s liveness timeout set in the `core`
 * entry: while an `on-compute` callback awaits a 15 s operation, `/health/live` answers 200 throughout — awaiting leaves
 * the main thread's heartbeat ticking —; while one runs a 15 s synchronous loop, `/health/live` answers 503 from 5 s
 * into the loop on, every endpoint still answering within 1 s (the admin worker reads the last tick from shared memory
 * and needs nothing of the blocked main thread), and 200 again once the loop has ended.
 *
 * **How it is timed** (as A62, `test/admin/admin-server.test.ts`): the prober is a worker thread of the test's own,
 * requesting the four endpoints in turn every 150 ms, each answer timed from its request on `process.hrtime.bigint()`,
 * the clock the callbacks read when their hold starts and ends and the heartbeat writes its ticks with. The last tick
 * before the loop is at most as old as the loop, so from 5 s into it the tick is older than 5 s: `/health/live` must
 * answer 503 to every request sent from then until 1 s before the loop ends (a later one may be answered after it), at
 * least 4 of them; and 200 to every request sent from 1 s after the loop on, at least 4 of them.
 *
 * Committed negative control: an admin server on the main thread (liveness read there, not on 8.1's worker) fails
 * A63's "every endpoint keeps answering within 1 s".
 */

/** The liveness timeout A63 sets. */
const TIMEOUT_MS = 5_000;
/** How long A63's callbacks hold. */
const HOLD_MS = 15_000;
const NS = 1_000_000n;

/** Module `m`: at height 2 its `on-compute` runs a synchronous loop of `ms` (`block`) or awaits `ms` (`await`). */
function holding(hold: Hold, ms: number, mode: "block" | "await"): ModuleDeclaration {
  const base = loggingModule("m", [], ["on-db-write"]);
  return {
    ...base,
    points: {
      ...base.points,
      async "on-compute"(_p, b) {
        if (b.height !== 2n) return;
        hold.start = process.hrtime.bigint();
        const until = hold.start + BigInt(ms) * NS;
        if (mode === "block") {
          while (process.hrtime.bigint() < until) {
            // Computation on the main thread (AE-2's scenario): nothing else of this thread runs meanwhile.
          }
        } else {
          // An awaited operation, at least `ms` by the clock the prober reads.
          while (process.hrtime.bigint() < until) await sleep(Number((until - process.hrtime.bigint()) / NS) + 1);
        }
        hold.end = process.hrtime.bigint();
      },
    },
  };
}

/** Runs `run` through its hold at height 2 with the prober on the four endpoints, until 3 s after the hold; the records. */
async function probedThrough(run: AdminRun, hold: Hold): Promise<ProbeRecord[]> {
  const origin = await run.origin();
  await statusWhen(origin, (body) => body.cursor === "1");
  const prober = await startProber(origin, ENDPOINTS);
  await sleep(300);
  run.memory?.finalize(3n);
  await statusWhen(origin, (body) => body.cursor === "3", 60_000);
  const after = hold.end + 3_000n * NS;
  while (process.hrtime.bigint() < after) await sleep(100);
  return prober.stop();
}

/** The `/health/live` records sent from `from` to `to` (hrtime, both included). */
const liveBetween = (records: readonly ProbeRecord[], from: bigint, to: bigint) =>
  records.filter((record) => record.path === "/health/live" && BigInt(record.sent) >= from && BigInt(record.sent) <= to);

/**
 * A63's liveness oracle for a synchronous loop held in `hold`: 200 before it; 503 to every request sent from
 * {@link TIMEOUT_MS} into it to 1 s before its end, at least {@link PROBES_DURING_HOLD} of them; 200 to every request
 * sent from 1 s after it on, at least as many.
 */
function stuckProblems(records: readonly ProbeRecord[], hold: Hold): string[] {
  const problems: string[] = [];
  if (hold.start === 0n || hold.end <= hold.start) return ["the hold never started or never ended"];
  const before = liveBetween(records, 0n, hold.start - 1n).filter((record) => record.status !== 200);
  for (const record of before) problems.push(`before the loop: /health/live answered ${record.status ?? record.error}, not 200`);
  // 10 ms past the timeout, so that no rounding of the clock reads makes the tick exactly as old as the timeout.
  const stuck = liveBetween(records, hold.start + BigInt(TIMEOUT_MS + 10) * NS, hold.end - BigInt(ANSWER_MS) * NS);
  if (stuck.length < PROBES_DURING_HOLD) problems.push(`only ${stuck.length} requests from 5 s into the loop, not ${PROBES_DURING_HOLD}`);
  for (const record of stuck) {
    if (record.status !== 503) {
      const at = Number(BigInt(record.sent) - hold.start) / 1e6;
      problems.push(`${Math.round(at)} ms into the loop: /health/live answered ${record.status ?? record.error}, not 503`);
    }
  }
  const recovered = liveBetween(records, hold.end + BigInt(ANSWER_MS) * NS, BigInt(Number.MAX_SAFE_INTEGER) * NS);
  if (recovered.length < PROBES_DURING_HOLD) problems.push(`only ${recovered.length} requests after the loop, not ${PROBES_DURING_HOLD}`);
  for (const record of recovered) {
    if (record.status !== 200) problems.push(`after the loop: /health/live answered ${record.status ?? record.error}, not 200`);
  }
  return problems;
}

/** The statuses each endpoint may answer during A63's synchronous loop. */
const DURING_LOOP: Readonly<Record<string, readonly number[]>> = {
  "/health/live": [200, 503],
  "/health/ready": [200, 503],
  "/status": [200],
  "/config": [200],
};

describe.each(PROCESS_BACKENDS)("A63: /health/live through the heartbeat on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A process whose module holds at height 2; its admin server on the main thread when `onMainThread`. */
  const start = async (hold: Hold, mode: "block" | "await", onMainThread = false) =>
    startWithAdmin({
      database: (await backend.database()).setting,
      user: [holding(hold, HOLD_MS, mode)],
      head: 1n,
      extra: { livenessTimeoutMs: TIMEOUT_MS },
      ...(onMainThread ? { starter: mainThreadAdmin() } : {}),
    });

  it("A63: during an on-compute callback that awaits a 15 s operation, /health/live answers 200 throughout", async () => {
    const hold = newHold();
    const run = await start(hold, "await");
    const records = await probedThrough(run, hold);
    expect(Number(hold.end - hold.start) / 1e6).toBeGreaterThanOrEqual(HOLD_MS);
    const during = liveBetween(records, hold.start, hold.end);
    expect(during.length).toBeGreaterThanOrEqual(PROBES_DURING_HOLD);
    expect(during.filter((record) => record.status !== 200)).toEqual([]);
    const expected = { "/health/live": [200], "/health/ready": [200, 503], "/status": [200], "/config": [200] };
    expect(timingProblems(records, hold, expected)).toEqual([]);
    await run.handle.stop();
  }, 120_000);

  it("A63: during a 15 s synchronous loop it answers 503 after 5 s, every endpoint within 1 s; 200 again once it ends", async () => {
    const hold = newHold();
    const run = await start(hold, "block");
    const records = await probedThrough(run, hold);
    expect(Number(hold.end - hold.start) / 1e6).toBeGreaterThanOrEqual(HOLD_MS);
    expect(stuckProblems(records, hold)).toEqual([]);
    expect(timingProblems(records, hold, DURING_LOOP)).toEqual([]);
    await run.handle.stop();
  }, 120_000);

  it("negative control: liveness read on the main thread (an admin server there) fails A63's 'every endpoint within 1 s'", async () => {
    const hold = newHold();
    const run = await start(hold, "block", true);
    const records = await probedThrough(run, hold);
    const problems = timingProblems(records, hold, DURING_LOOP);
    expect(problems.join("\n")).toMatch(/answered \d+ after \d+ ms|only \d+ requests were sent during the hold/);
    await run.handle.stop();
  }, 120_000);
});
