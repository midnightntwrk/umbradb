import type { ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import postgres from "postgres";
import { afterAll, beforeAll } from "vitest";
import { POSTGRES_IMAGE } from "../postgres-image.js";
import { spawnChild } from "../child-processes.js";
import { startContainer } from "../containers.js";

/**
 * The crash harness's fault primitives, for the kept required ids 1–4 (`crash-harness.smoke.*`,
 * `test/integration/crash/crash-harness.smoke.test.ts`; `openspec/changes/core-arch/design.md` §13): one shared
 * PostgreSQL container per test file, a crash worker spawned as a real process and SIGKILLed, `pg_terminate_backend` of
 * a chosen backend, and the suite watchdog that bounds every operation.
 *
 * Core-arch task 17.2 retired the 0.9.5 parts this file used to set up (its client, migration runner and the crash
 * worker's checkpoint, watermark, key-value and lease operations) with the required ids 5–25 that drove them: the
 * connections here are plain `postgres` ones, no schema is migrated, and the worker only holds a transaction open
 * (`crash-worker.ts`). Task 18.1 retargets the worker to drive the runner, keeping ids 1–4.
 */

export type Sql = postgres.Sql;

let container: StartedPostgreSqlContainer | undefined;
let adminSql: Sql | undefined;

/** A connection to the shared container: `max` connections (1 makes the backend pid of its queries deterministic). */
export function connect(connectionUri: string, max = 5): Sql {
  return postgres(connectionUri, { max, connect_timeout: 10, onnotice: () => {} });
}

export async function startTestDatabase(): Promise<Sql> {
  container = await startContainer(new PostgreSqlContainer(POSTGRES_IMAGE));
  adminSql = connect(container.getConnectionUri());
  return adminSql;
}

export async function stopTestDatabase(): Promise<void> {
  await adminSql?.end({ timeout: 5 });
  await container?.stop();
}

/**
 * Starts the shared container before the file's tests and stops it after them. `sql()` is the shared admin pool;
 * `connectionUri()` lets a test open its own small pool on the same database, or hand it to a worker.
 */
export function registerSuiteLifecycle(): { sql: () => Sql; connectionUri: () => string } {
  let sql: Sql;
  beforeAll(async () => {
    sql = await startTestDatabase();
  }, 120_000);
  afterAll(async () => {
    await stopTestDatabase();
  }, 60_000); // container.stop() can exceed the 10 s default under heavy host load
  return {
    sql: () => sql,
    connectionUri: () => {
      if (container === undefined) throw new Error("registerSuiteLifecycle(): the shared container has not started");
      return container.getConnectionUri();
    },
  };
}

// ---- Backend pid and pg_terminate_backend ---------------------------------------------------------------------------

/**
 * The backend pid serving `sql`. Deterministic only on a single-connection pool (`connect(uri, 1)`): on a larger pool
 * the query may land on any backend.
 */
export async function backendPid(sql: Sql): Promise<number> {
  const rows = await withSuiteWatchdog(sql<{ pid: number }[]>`SELECT pg_backend_pid()::int AS pid`, {
    label: "backendPid",
  });
  return rows[0]!.pid;
}

/**
 * Terminates backend `pid` from a second connection `admin` and returns `pg_terminate_backend`'s answer once the
 * backend is gone: the two-argument form waits up to `terminateTimeoutMs` for the backend to end, and
 * {@link waitForBackendGone} then polls `pg_stat_activity` until no row has that pid, so a caller never races a backend
 * still finishing its work.
 */
export async function pgTerminateBackend(
  admin: Sql,
  pid: number,
  opts: { terminateTimeoutMs?: number; confirmDeathTimeoutMs?: number } = {},
): Promise<boolean> {
  const terminateTimeoutMs = opts.terminateTimeoutMs ?? 5_000;
  const rows = await withSuiteWatchdog(
    admin<{ terminated: boolean }[]>`SELECT pg_terminate_backend(${pid}, ${terminateTimeoutMs}) AS terminated`,
    { label: "pgTerminateBackend" },
  );
  await waitForBackendGone(admin, pid, opts.confirmDeathTimeoutMs ?? 10_000);
  return rows[0]!.terminated;
}

/** Polls `pg_stat_activity` until no backend has `pid`, or throws {@link SuiteWatchdogTimeoutError} after `timeoutMs`. */
export async function waitForBackendGone(admin: Sql, pid: number, timeoutMs = 10_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const rows = await withSuiteWatchdog(
      admin<{ n: number }[]>`SELECT count(*)::int AS n FROM pg_stat_activity WHERE pid = ${pid}`,
      { label: "waitForBackendGone-probe", timeoutMs: 10_000 },
    );
    if (rows[0]!.n === 0) return;
    if (Date.now() >= deadline) throw new SuiteWatchdogTimeoutError(`pg backend ${pid} did not terminate`, timeoutMs);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// ---- The crash worker: spawn and SIGKILL ----------------------------------------------------------------------------

/** The one point the worker pauses at: inside an open transaction, before its `COMMIT`. */
export type CrashHook = "before-commit";

/** What the worker prints once it has paused. */
export interface CrashWorkerReady {
  hook: CrashHook;
  /** The worker's operating-system process id. */
  pid: number;
  /** The backend pid of the connection holding the open transaction. */
  backendPid: number;
}

export interface SpawnCrashWorkerOptions {
  /** The shared container's connection URI (`registerSuiteLifecycle().connectionUri()`). */
  connectionUri: string;
  hook: CrashHook;
}

/** The sentinels the worker writes on stdout, so the parent finds its lines among other output. */
export const CRASH_WORKER_READY_SENTINEL = "@@CRASH_WORKER_READY@@";
export const CRASH_WORKER_ERROR_SENTINEL = "@@CRASH_WORKER_ERROR@@";

export interface CrashWorkerHandle {
  readonly child: ChildProcess;
  readonly pid: number | undefined;
  /** Resolves once the worker has paused; rejects if it errors, exits first, or `timeoutMs` passes (and kills it). */
  waitForReady(timeoutMs?: number): Promise<CrashWorkerReady>;
  /** Resolves once the process has exited. */
  waitForExit(): Promise<{ code: number | null; signal: NodeJS.Signals | null }>;
  /** SIGKILL: the "kill the process mid-operation" primitive. */
  sigkill(): void;
  stdout(): string;
  stderr(): string;
}

const WORKER_ENTRYPOINT = fileURLToPath(new URL("../integration/crash/crash-worker.ts", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DEFAULT_READY_TIMEOUT_MS = 30_000;

/**
 * Spawns `crash-worker.ts` as its own process (`node --import tsx`, no shell, so `child.pid` is the worker and
 * `sigkill()` kills it), connected to the shared container, through {@link spawnChild} so a test process that dies
 * never leaves it running. Its environment is the parent's without any `UMBRADB_CRASH_*` variable, plus the options.
 */
export function spawnCrashWorker(opts: SpawnCrashWorkerOptions): CrashWorkerHandle {
  const env: Record<string, string | undefined> = { ...(process.env as Record<string, string | undefined>) };
  for (const key of Object.keys(env)) {
    if (key.startsWith("UMBRADB_CRASH_") || key === "UMBRADB_TEST_CONNECTION_URI") delete env[key];
  }
  env.UMBRADB_TEST_CONNECTION_URI = opts.connectionUri;
  env.UMBRADB_CRASH_HOOK = opts.hook;

  const child = spawnChild(process.execPath, ["--import", "tsx", WORKER_ENTRYPOINT], {
    cwd: REPO_ROOT,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdoutBuf = "";
  let stderrBuf = "";
  let scanPos = 0;
  let ready: CrashWorkerReady | undefined;
  let readyErr: Error | undefined;
  let exited: { code: number | null; signal: NodeJS.Signals | null } | undefined;
  const readyWaiters: Array<() => void> = [];
  const exitWaiters: Array<() => void> = [];
  const settleReady = (): void => {
    while (readyWaiters.length) readyWaiters.shift()!();
  };

  /** Reads complete lines only: a chunk may end in the middle of the readiness line. */
  const scanStdout = (): void => {
    let nl: number;
    while ((nl = stdoutBuf.indexOf("\n", scanPos)) >= 0) {
      const line = stdoutBuf.slice(scanPos, nl);
      scanPos = nl + 1;
      if (ready !== undefined || readyErr !== undefined) continue;
      const r = line.indexOf(CRASH_WORKER_READY_SENTINEL);
      if (r >= 0) {
        try {
          ready = JSON.parse(line.slice(r + CRASH_WORKER_READY_SENTINEL.length)) as CrashWorkerReady;
        } catch (err) {
          readyErr = new Error(`crash worker readiness line was not valid JSON: ${String(err)}`);
        }
        settleReady();
        continue;
      }
      const e = line.indexOf(CRASH_WORKER_ERROR_SENTINEL);
      if (e >= 0) {
        readyErr = new Error(`crash worker reported an error: ${line.slice(e + CRASH_WORKER_ERROR_SENTINEL.length).trim()}`);
        settleReady();
      }
    }
  };

  child.stdout?.setEncoding("utf8");
  child.stdout?.on("data", (chunk: string) => {
    stdoutBuf += chunk;
    scanStdout();
  });
  child.stderr?.setEncoding("utf8");
  child.stderr?.on("data", (chunk: string) => {
    stderrBuf += chunk;
  });
  child.on("exit", (code, signal) => {
    exited = { code, signal };
    scanStdout();
    if (ready === undefined && readyErr === undefined) {
      readyErr = new Error(
        `crash worker exited (code=${String(code)}, signal=${String(signal)}) before signalling readiness.\nstderr:\n${stderrBuf}`,
      );
      settleReady();
    }
    while (exitWaiters.length) exitWaiters.shift()!();
  });
  child.on("error", (err) => {
    if (ready === undefined && readyErr === undefined) {
      readyErr = new Error(`failed to spawn crash worker: ${err.message}`);
      settleReady();
    }
  });

  return {
    child,
    get pid() {
      return child.pid;
    },
    stdout: () => stdoutBuf,
    stderr: () => stderrBuf,
    waitForReady(timeoutMs = DEFAULT_READY_TIMEOUT_MS): Promise<CrashWorkerReady> {
      return new Promise<CrashWorkerReady>((resolve, reject) => {
        const done = (): void => {
          if (ready !== undefined) resolve(ready);
          else reject(readyErr ?? new Error("crash worker readiness settled without a result"));
        };
        if (ready !== undefined || readyErr !== undefined) {
          done();
          return;
        }
        const waiter = (): void => {
          clearTimeout(timer);
          done();
        };
        const timer = setTimeout(() => {
          const index = readyWaiters.indexOf(waiter);
          if (index >= 0) readyWaiters.splice(index, 1);
          try {
            child.kill("SIGKILL");
          } catch {
            /* already gone */
          }
          reject(new SuiteWatchdogTimeoutError("crash-worker readiness", timeoutMs));
        }, timeoutMs);
        readyWaiters.push(waiter);
      });
    },
    waitForExit(): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
      return new Promise((resolve) => {
        if (exited !== undefined) {
          resolve(exited);
          return;
        }
        exitWaiters.push(() => resolve(exited!));
      });
    },
    sigkill(): void {
      child.kill("SIGKILL");
    },
  };
}

// ---- The suite watchdog ---------------------------------------------------------------------------------------------

/**
 * The bound on every operation of the crash harness, independent of the server's own timeouts, so a half-dead
 * PostgreSQL fails an operation with a typed error instead of hanging the suite. A call's `timeoutMs` overrides it.
 */
export const SUITE_WATCHDOG_MS = 60_000;

/** What {@link withSuiteWatchdog} rejects with when its bound passes. */
export class SuiteWatchdogTimeoutError extends Error {
  readonly label: string;
  readonly timeoutMs: number;
  constructor(label: string, timeoutMs: number) {
    super(`suite watchdog: "${label}" did not complete within ${timeoutMs}ms`);
    this.name = "SuiteWatchdogTimeoutError";
    this.label = label;
    this.timeoutMs = timeoutMs;
  }
}

type Cancellable = { cancel?: () => unknown };

/**
 * Races `work` against `timeoutMs` (default {@link SUITE_WATCHDOG_MS}). If the bound passes first it cancels the work
 * when it can (a `postgres` query has `.cancel()`), calls `onTimeout`, and rejects with
 * {@link SuiteWatchdogTimeoutError}; otherwise it passes the work's result or rejection through.
 */
export async function withSuiteWatchdog<T>(
  work: (PromiseLike<T> & Cancellable) | (() => PromiseLike<T> & Cancellable) | (() => PromiseLike<T>),
  opts: { timeoutMs?: number; label?: string; onTimeout?: () => void } = {},
): Promise<T> {
  const timeoutMs = opts.timeoutMs ?? SUITE_WATCHDOG_MS;
  const label = opts.label ?? "operation";
  const promise = (typeof work === "function" ? work() : work) as PromiseLike<T> & Cancellable;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const watchdog = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      try {
        promise.cancel?.();
      } catch {
        /* best effort */
      }
      void Promise.resolve(promise).then(undefined, () => {}); // the cancelled work's late rejection
      try {
        opts.onTimeout?.();
      } catch {
        /* best effort */
      }
      reject(new SuiteWatchdogTimeoutError(label, timeoutMs));
    }, timeoutMs);
  });
  try {
    return await Promise.race([promise, watchdog]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
