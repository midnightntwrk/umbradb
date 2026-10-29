import { afterEach, describe, expect, it, vi } from "vitest";
import {
  backendPid,
  connect,
  pgTerminateBackend,
  registerSuiteLifecycle,
  spawnCrashWorker,
  SUITE_WATCHDOG_MS,
  SuiteWatchdogTimeoutError,
  withSuiteWatchdog,
  type CrashWorkerHandle,
  type Sql,
} from "../../postgres/setup.js";

/**
 * The crash harness's smoke tests, the kept required ids 1–4 (`crash-harness.smoke.*`): the fault primitives — a
 * worker spawned and SIGKILLed with the shared container left up, `pg_terminate_backend` of a chosen backend with the
 * pool recovering — and the suite watchdog, with an override and at its default. One shared container for the file.
 * [design §13]
 *
 * Ids 5–10 of this file were retired with the 0.9.5 operations the worker ran at its pause points. The worker is to be
 * retargeted to drive the runner, keeping these four.
 */

const { sql: getSql, connectionUri } = registerSuiteLifecycle();

/** Pools a test opened, ended after it. */
let openPools: Sql[] = [];
/** Workers a test spawned, killed after it. */
let liveWorkers: CrashWorkerHandle[] = [];

function pool(max = 1): Sql {
  const p = connect(connectionUri(), max);
  openPools.push(p);
  return p;
}

function worker(...args: Parameters<typeof spawnCrashWorker>): CrashWorkerHandle {
  const h = spawnCrashWorker(...args);
  liveWorkers.push(h);
  return h;
}

afterEach(async () => {
  for (const w of liveWorkers) {
    try {
      w.sigkill();
    } catch {
      /* already gone */
    }
  }
  // Wait for each worker to end, bounded, so its connection is released before the next test.
  await Promise.all(
    liveWorkers.map((w) =>
      withSuiteWatchdog(w.waitForExit(), { label: "afterEach-worker-exit", timeoutMs: 15_000 }).catch(() => {}),
    ),
  );
  liveWorkers = [];
  await Promise.all(openPools.map((p) => p.end({ timeout: 5 }).catch(() => {})));
  openPools = [];
});

describe("crash-harness fault primitives and watchdog", () => {
  it("[[crash-harness.smoke.spawn-sigkill-container-survives]] spawning and SIGKILLing the worker leaves the shared container up and a fresh client connects", async () => {
    const h = worker({ connectionUri: connectionUri(), hook: "before-commit" });
    const ready = await h.waitForReady();
    expect(ready.hook).toBe("before-commit");
    expect(ready.pid).toBeGreaterThan(0);
    expect(ready.backendPid).toBeGreaterThan(0);

    h.sigkill();
    const exit = await withSuiteWatchdog(h.waitForExit(), { label: "worker-exit", timeoutMs: 15_000 });
    expect(exit.signal).toBe("SIGKILL");

    // The container is unaffected: the shared pool still answers, and a new client connects.
    const shared = await withSuiteWatchdog(getSql()<{ ok: number }[]>`SELECT 1 AS ok`, {
      label: "shared-ping",
      timeoutMs: 10_000,
    });
    expect(shared[0]!.ok).toBe(1);
    const fresh = pool();
    const freshRows = await withSuiteWatchdog(fresh<{ ok: number }[]>`SELECT 1 AS ok`, {
      label: "fresh-connect",
      timeoutMs: 10_000,
    });
    expect(freshRows[0]!.ok).toBe(1);
  });

  it("[[crash-harness.smoke.pg-terminate-backend-drops-and-recovers]] pg_terminate_backend drops a targeted backend and the dedicated pool recovers", async () => {
    const probe = pool(1);
    const pid = await withSuiteWatchdog(() => backendPid(probe), { label: "capture-pid", timeoutMs: 10_000 });
    expect(pid).toBeGreaterThan(0);

    // Terminate the probe's backend from a second connection (the shared admin pool).
    const terminated = await withSuiteWatchdog(() => pgTerminateBackend(getSql(), pid), {
      label: "terminate",
      timeoutMs: 10_000,
    });
    expect(terminated).toBe(true);

    // The pool reconnects on a later query, to a new backend; the first query after the drop may see the loss.
    let pid2 = -1;
    for (let attempt = 0; attempt < 3 && pid2 < 0; attempt++) {
      try {
        pid2 = await withSuiteWatchdog(() => backendPid(probe), { label: "recover-pid", timeoutMs: 10_000 });
      } catch {
        /* reconnect on the next attempt */
      }
    }
    expect(pid2).toBeGreaterThan(0);
    expect(pid2).not.toBe(pid);
  });

  it("[[crash-harness.smoke.suite-watchdog-bounds-stalled-backend]] the suite watchdog bounds a stalled backend with a typed error, not a hang", async () => {
    expect(SUITE_WATCHDOG_MS).toBeGreaterThan(0);
    const stall = pool(1);
    // pg_sleep(30) outlasts the 1.5 s override by far, and no server timeout is set on this connection: only the
    // watchdog can end the wait.
    const started = Date.now();
    await expect(
      withSuiteWatchdog(stall<{ slept: unknown }[]>`SELECT pg_sleep(30) AS slept`, {
        label: "stalled-backend",
        timeoutMs: 1_500,
      }),
    ).rejects.toBeInstanceOf(SuiteWatchdogTimeoutError);
    expect(Date.now() - started).toBeLessThan(8_000);
  });

  it("[[crash-harness.smoke.suite-watchdog-default-bound]] withSuiteWatchdog with NO override applies SUITE_WATCHDOG_MS as the default bound", async () => {
    // Fake timers, so the default 60 s bound is exercised without a real 60 s wait.
    vi.useFakeTimers();
    try {
      const never = new Promise<never>(() => {});
      let outcome: unknown = "pending";
      const raced = withSuiteWatchdog(never, { label: "default-bound" }).then(
        () => {
          outcome = "resolved";
        },
        (e: unknown) => {
          outcome = e;
        },
      );
      await vi.advanceTimersByTimeAsync(SUITE_WATCHDOG_MS - 1);
      expect(outcome).toBe("pending");
      await vi.advanceTimersByTimeAsync(1);
      await raced;
      expect(outcome).toBeInstanceOf(SuiteWatchdogTimeoutError);
      expect((outcome as SuiteWatchdogTimeoutError).timeoutMs).toBe(SUITE_WATCHDOG_MS);
    } finally {
      vi.useRealTimers();
    }
  });
});
