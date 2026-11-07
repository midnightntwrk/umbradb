import { expect } from "vitest";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { startWriter } from "../../src/db/writer-lock.js";
import { firstOf, startWriterProcess, type WriterProcess } from "./pglite-processes.js";
import type { Job, WorkerEvent } from "./pglite-writer.worker.js";
import type { PostgresTestDatabase } from "./postgres-server.js";

/**
 * The writer lock checks, shared by the tests that must pass (`writer-lock.test.ts`, `pglite-writer-processes.test.ts`)
 * and the committed negative controls that must make them fail (`writer-lock.negative-control.test.ts`, and the
 * statement-scoped lock of the process tests). Each check runs its scenario and asserts with `expect`, so a failing
 * check throws an assertion error that names what went wrong. [A17, DB-11]
 */

/**
 * The writer lock of the current database as PostgreSQL lists it: session advisory lock (3, hashtext('umbradb-writer')),
 * granted. `pg_locks` lists every database's locks; an advisory lock belongs to one database.
 */
export const WRITER_LOCK_HOLDERS_SQL =
  "SELECT pid FROM pg_locks WHERE locktype = 'advisory' AND classid = 3 " +
  "AND objid = (hashtext('umbradb-writer'))::oid AND objsubid = 2 AND granted " +
  "AND database = (SELECT oid FROM pg_database WHERE datname = current_database())";

/** The backend pids holding the writer lock of `database`, read outside the API. */
export async function writerLockHolders(database: PostgresTestDatabase): Promise<number[]> {
  return (await database.admin.unsafe(WRITER_LOCK_HOLDERS_SQL)).map((row) => Number(row.pid));
}

/** How long a closed or terminated session's backend may take to end: it ends at once; this is load's margin. [A153] */
export const BACKEND_END_MS = 30_000;

/**
 * Waits until no session holds the writer lock (a closed session's backend ends a moment after the client closes), at
 * most {@link BACKEND_END_MS}.
 */
export async function lockReleased(database: PostgresTestDatabase): Promise<void> {
  const deadline = Date.now() + BACKEND_END_MS;
  while (Date.now() < deadline) {
    if ((await writerLockHolders(database)).length === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`the writer lock is still held ${BACKEND_END_MS / 1_000} s after its holder closed`);
}

/** The error `run` rejects with; an assertion failure when it resolves. */
export async function rejection(run: () => Promise<unknown>): Promise<UmbraError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  return expect.fail("expected an UmbraError, but the call resolved");
}

const pidOf = async (handle: { query(sql: string): Promise<Record<string, unknown>[]> }): Promise<number> =>
  (await handle.query("SELECT pg_backend_pid() AS pid"))[0]?.pid as number;

/**
 * The writer's next transaction after its backend was terminated: `db.transaction(body)`, run once more if it failed
 * with `connection-lost` before its body ran. `terminate` returns once PostgreSQL no longer lists the backend, but the
 * driver learns of the loss only when the server's close reaches it — through Docker's port proxy, later on a loaded
 * machine (reproduced 2026-10-26: 1 of 40 rounds at a load average of about 22) — and a transaction started before then
 * fails on its `BEGIN` with `connection-lost` (retryable, nothing written), as `postgres-faults.test.ts`'s "at most one
 * connection-lost" shows; the next one opens a new session. The retried attempt is the one the check judges. [DB-13]
 */
export async function nextTransaction<T>(
  db: Pick<Database, "transaction">,
  body: (tx: Transaction) => Promise<T>,
): Promise<T> {
  let ran = false;
  try {
    return await db.transaction((tx) => {
      ran = true;
      return body(tx);
    });
  } catch (error) {
    if (!(error instanceof UmbraError) || error.code !== "connection-lost" || ran) throw error;
    expect(error.retryable).toBe(true);
    return db.transaction(body);
  }
}

/** Creates the table the checks write: one row per write, naming the writer. */
export async function writesTable(database: PostgresTestDatabase): Promise<void> {
  await database.exec("CREATE SCHEMA IF NOT EXISTS w; CREATE TABLE IF NOT EXISTS w.writes (writer text NOT NULL, n integer NOT NULL)");
}

async function write(db: Database, writer: string, n: number): Promise<void> {
  await db.transaction((tx) => tx.execute("INSERT INTO w.writes (writer, n) VALUES ($1, $2::integer)", [writer, n]));
}

async function writesBy(database: PostgresTestDatabase, writer: string): Promise<number> {
  const [row] = await database.admin.unsafe("SELECT count(*)::int AS n FROM w.writes WHERE writer = $1", [writer]);
  return Number(row?.n);
}

/**
 * PostgreSQL, a second writer: `a` and `b` open one database; `a` starts its writer and holds the lock on its writer
 * session; `b`'s writer start and `b`'s transactions refuse with `writer-lock-held` (not retryable) and write nothing,
 * while `a` writes.
 */
export async function expectSecondPostgresWriterRefused(database: PostgresTestDatabase): Promise<void> {
  await writesTable(database);
  const a = database.open();
  const b = database.open();
  await startWriter(a);
  const aPid = await a.transaction(pidOf);
  expect(await writerLockHolders(database)).toEqual([aPid]);

  const started = performance.now();
  const refused = await rejection(() => startWriter(b));
  expect(refused.code).toBe("writer-lock-held");
  expect(refused.retryable).toBe(false);
  expect(performance.now() - started).toBeLessThan(5_000);
  const refusedWrite = await rejection(() => write(b, "b", 1));
  expect(refusedWrite.code).toBe("writer-lock-held");
  expect(await writesBy(database, "b")).toBe(0);

  await write(a, "a", 1);
  expect(await writesBy(database, "a")).toBe(1);
  expect(await writerLockHolders(database)).toEqual([aPid]);
  await Promise.all([a.close(), b.close()]);
}

/**
 * PostgreSQL, the re-take: after `a`'s writer backend is terminated, `a`'s next transaction (after at most one
 * `connection-lost` before its body, {@link nextTransaction}) runs on a new session that holds the writer lock before
 * the transaction's first statement (checked from inside it), and a second writer is still refused.
 */
export async function expectLockRetakenAfterTermination(database: PostgresTestDatabase): Promise<void> {
  await writesTable(database);
  const a = database.open();
  await startWriter(a);
  const firstPid = await a.transaction(pidOf);
  await database.terminate(firstPid);
  expect(await writerLockHolders(database)).toEqual([]);

  const seenInside = await nextTransaction(a, async (tx) => {
    const pid = await pidOf(tx);
    const holders = (await tx.query(WRITER_LOCK_HOLDERS_SQL)).map((row) => Number(row.pid));
    await tx.execute("INSERT INTO w.writes (writer, n) VALUES ('a', 1)");
    return { pid, holders };
  });
  expect(seenInside.pid).not.toBe(firstPid);
  expect(seenInside.holders).toEqual([seenInside.pid]);

  const b = database.open();
  expect((await rejection(() => startWriter(b))).code).toBe("writer-lock-held");
  await Promise.all([a.close(), b.close()]);
}

/**
 * PostgreSQL, the lock taken meanwhile: `a`'s writer backend is terminated, `b` starts its writer and takes the lock;
 * `a`'s next transaction (after at most one `connection-lost` before its body, {@link nextTransaction}) fails with
 * `writer-lock-lost` (not retryable) before its body runs, and so does every later one — also after `b` closed and
 * released the lock — while `b` wrote.
 */
export async function expectLockLostWhenTakenMeanwhile(database: PostgresTestDatabase): Promise<void> {
  await writesTable(database);
  const a = database.open();
  await startWriter(a);
  await write(a, "a", 1);
  await database.terminate(await a.transaction(pidOf));

  const b = database.open();
  await startWriter(b);
  await write(b, "b", 1);

  let bodyRan = false;
  const lost = await rejection(() =>
    nextTransaction(a, async (tx) => {
      bodyRan = true;
      await tx.execute("INSERT INTO w.writes (writer, n) VALUES ('a', 2)");
    }),
  );
  expect(lost.code).toBe("writer-lock-lost");
  expect(lost.retryable).toBe(false);
  expect(bodyRan).toBe(false);

  await b.close();
  await lockReleased(database);
  expect((await rejection(() => write(a, "a", 3))).code).toBe("writer-lock-lost");
  expect((await rejection(() => startWriter(a))).code).toBe("writer-lock-lost");
  expect(await writesBy(database, "a")).toBe(1);
  expect(await writesBy(database, "b")).toBe(1);
  expect(await writerLockHolders(database)).toEqual([]);
  await a.close();
}

/** A worker's first outcome: it opened (or locked), was refused, or ended without either. */
export async function outcomeOf(process: WriterProcess): Promise<WorkerEvent | { readonly event: "ended" }> {
  try {
    return await process.next(firstOf("opened", "locked", "refused"), 120_000);
  } catch {
    return { event: "ended" };
  }
}

/**
 * PGlite, a second writer process: a first process opens the data directory and writes; a second process started
 * against it refuses with `writer-lock-held` within a second and never opens PGlite. `lockKind` selects the lock both
 * processes take (the negative control's lock is released when its statement ends).
 */
export async function expectSecondPgliteProcessRefused(dataDir: string, lockKind: Job["lockKind"] = "api"): Promise<void> {
  const first = startWriterProcess({ mode: "write", dataDir, lockKind });
  expect(await outcomeOf(first)).toMatchObject({ event: "opened" });
  await first.next((event) => event.event === "committed" && event.height >= 5);
  const second = startWriterProcess({ mode: "write", dataDir, lockKind });
  const outcome = await outcomeOf(second);
  expect(outcome).toMatchObject({ event: "refused", code: "writer-lock-held" });
  expect((outcome as { ms: number }).ms).toBeLessThan(1_000);
  await second.exited;
  expect(second.events.some((event) => event.event === "opened" || event.event === "committed")).toBe(false);
  await first.signal("SIGKILL");
}

/**
 * PGlite, ten processes started together (released at one instant) against one new data directory: exactly one opens
 * and runs, the other nine refuse with `writer-lock-held` and exit; the one running keeps committing, and every row is
 * its own.
 */
export async function expectTenStartersOneRuns(
  dataDir: string,
  readBlocks: (dataDir: string) => Promise<{ readonly writer: number }[]>,
  lockKind: Job["lockKind"] = "api",
): Promise<void> {
  const startAt = Date.now() + 2_000;
  const processes = Array.from({ length: 10 }, () => startWriterProcess({ mode: "write", dataDir, startAt, lockKind }));
  const outcomes = await Promise.all(processes.map(outcomeOf));
  const opened = processes.filter((_, index) => outcomes[index]!.event === "opened");
  const refused = outcomes.filter((outcome) => outcome.event === "refused");
  expect({ opened: opened.length, refused: refused.length }).toEqual({ opened: 1, refused: 9 });
  for (const outcome of refused) expect(outcome).toMatchObject({ code: "writer-lock-held" });
  const runner = opened[0]!;
  await Promise.all(processes.filter((process) => process !== runner).map((process) => process.exited));
  await runner.next((event) => event.event === "committed" && event.height >= 10);
  expect(processes.filter((process) => process.child.exitCode === null && process.child.signalCode === null)).toEqual([runner]);
  await runner.signal("SIGKILL");
  const writers = new Set((await readBlocks(dataDir)).map((row) => row.writer));
  expect([...writers]).toEqual([runner.child.pid]);
}

/** PGlite, the lock alone: ten `lock` processes released at one instant; exactly one takes it, nine refuse. */
export async function expectTenLockersOneHolds(dataDir: string): Promise<void> {
  const startAt = Date.now() + 1_500;
  const processes = Array.from({ length: 10 }, () => startWriterProcess({ mode: "lock", dataDir, startAt }));
  const outcomes = await Promise.all(processes.map(outcomeOf));
  const kinds = outcomes.map((outcome) => (outcome.event === "refused" ? `refused:${outcome.code}` : outcome.event));
  expect(kinds.filter((kind) => kind === "locked")).toHaveLength(1);
  expect(kinds.filter((kind) => kind === "refused:writer-lock-held")).toHaveLength(9);
  await Promise.all(processes.map((process) => process.signal("SIGKILL")));
}

const sleepUntil = (time: number) => new Promise((resolve) => setTimeout(resolve, Math.max(0, time - Date.now())));

/** Heights 1..n, in order. */
const oneTo = (n: number): number[] => Array.from({ length: n }, (_, index) => index + 1);

/** What {@link expectPausedWriterKeepsLock} measured, for the test's log. */
export interface PauseReport {
  readonly pausedMs: number;
  readonly heightAtStop: number;
  readonly refusals: number;
  readonly rows: number;
}

/**
 * PGlite, a paused writer: a process opens the data directory and writes; it is stopped with `SIGSTOP` for
 * `stopSeconds`; a second process started at once, at half the pause and 5 s before its end (when the pause is long
 * enough) refuses each time with `writer-lock-held` within a second and never opens PGlite; nothing is committed while
 * the writer is stopped; after `SIGCONT` the writer continues committing; every row of the directory is the first
 * process's, with no height missing.
 */
export async function expectPausedWriterKeepsLock(
  dataDir: string,
  stopSeconds: number,
  readBlocks: (dataDir: string) => Promise<{ readonly height: number; readonly writer: number }[]>,
  lockKind: Job["lockKind"] = "api",
): Promise<PauseReport> {
  const first = startWriterProcess({ mode: "write", dataDir, lockKind });
  expect(await outcomeOf(first)).toMatchObject({ event: "opened" });
  await first.next((event) => event.event === "committed" && event.height >= 20);
  await first.signal("SIGSTOP");
  const stoppedAt = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 500)); // lines written before the stop arrive
  const heightAtStop = first.lastCommitted()!;
  const seconds: WriterProcess[] = [];
  const another = async (): Promise<void> => {
    const second = startWriterProcess({ mode: "write", dataDir, lockKind });
    seconds.push(second);
    const outcome = await outcomeOf(second);
    expect(outcome).toMatchObject({ event: "refused", code: "writer-lock-held" });
    expect((outcome as { ms: number }).ms).toBeLessThan(1_000);
    await second.exited;
  };
  const stopMs = stopSeconds * 1_000;
  await another();
  await sleepUntil(stoppedAt + stopMs / 2);
  await another();
  if (stopMs >= 20_000) {
    await sleepUntil(stoppedAt + stopMs - 5_000);
    await another();
  }
  await sleepUntil(stoppedAt + stopMs);
  const pausedMs = Date.now() - stoppedAt;
  expect(pausedMs).toBeGreaterThanOrEqual(stopMs);
  expect(first.lastCommitted()).toBe(heightAtStop);
  first.child.kill("SIGCONT");
  await first.next((event) => event.event === "committed" && event.height >= heightAtStop + 20, 60_000);
  await first.signal("SIGKILL");
  for (const second of seconds) {
    expect(second.events.some((event) => event.event === "opened" || event.event === "committed")).toBe(false);
  }
  const rows = await readBlocks(dataDir);
  expect(new Set(rows.map((row) => row.writer))).toEqual(new Set([first.child.pid]));
  expect(rows.map((row) => row.height)).toEqual(oneTo(rows.length));
  return { pausedMs, heightAtStop, refusals: seconds.length, rows: rows.length };
}

/**
 * PGlite, a crashed writer: a process writes and is killed with `SIGKILL`; a process started again takes the lock at
 * once (within a second), opens the directory, reads its cursor — at least the last height the first process reported
 * committed — and continues from it: its first block is the cursor's next height, every row up to the cursor is the
 * first process's, every row after it the second's, and no height is missing or repeated.
 */
export async function expectRestartAfterKillContinues(
  dataDir: string,
  readBlocks: (dataDir: string) => Promise<{ readonly height: number; readonly writer: number }[]>,
): Promise<{ readonly acknowledged: number; readonly from: number; readonly lockMs: number }> {
  const first = startWriterProcess({ mode: "write", dataDir });
  expect(await outcomeOf(first)).toMatchObject({ event: "opened" });
  await first.next((event) => event.event === "committed" && event.height >= 30);
  await first.signal("SIGKILL");
  const acknowledged = first.lastCommitted()!;

  const second = startWriterProcess({ mode: "write", dataDir });
  const opened = await outcomeOf(second);
  expect(opened).toMatchObject({ event: "opened" });
  const { from, lockMs } = opened as { from: number; lockMs: number };
  expect(lockMs).toBeLessThan(1_000);
  expect(from).toBeGreaterThanOrEqual(acknowledged);
  await second.next((event) => event.event === "committed" && event.height >= from + 20);
  await second.signal("SIGKILL");
  const firstCommitted = second.events.find((event) => event.event === "committed") as { height: number };
  expect(firstCommitted.height).toBe(from + 1);

  const rows = await readBlocks(dataDir);
  expect(rows.map((row) => row.height)).toEqual(oneTo(rows.length));
  expect(rows.filter((row) => row.height <= from).every((row) => row.writer === first.child.pid)).toBe(true);
  expect(rows.filter((row) => row.height > from).every((row) => row.writer === second.child.pid)).toBe(true);
  expect(rows.filter((row) => row.height > from).length).toBeGreaterThanOrEqual(20);
  return { acknowledged, from, lockMs };
}
