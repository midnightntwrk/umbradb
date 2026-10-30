import { DatabaseSync } from "node:sqlite";
import { setTimeout as sleep } from "node:timers/promises";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { acquirePgliteLock, pgliteLockFile } from "../../src/db/pglite-lock.js";

/**
 * A PGlite writer in a process of its own, for the writer-lock process tests: `pglite-writer-processes.test.ts` and the
 * single-writer test of `writer-lock.test.ts`. Started with `node --import tsx` and one JSON argument ({@link Job});
 * it reports each event as one JSON line on stdout ({@link WorkerEvent}). [A17, DB-11]
 *
 * - `write`: opens the data directory through the database API (`openPglite`, with the development opt-in), creates
 *   the test schema if it is absent, reads its cursor — the highest committed height of `t.blocks` — reports `opened`
 *   with it, then commits one block after another, each a transaction writing the next height and this process's id,
 *   reporting `committed` after each, until it is killed or has written `blocks` blocks (then it closes and exits).
 * - `lock`: takes only the writer lock (`acquirePgliteLock`), reports `locked`, and holds it until it is killed.
 *
 * A refusal is reported as `refused` with its code, and the process exits 0. `startAt` (milliseconds since the epoch)
 * makes the process wait until then before it takes the lock, so that processes started together race for it.
 *
 * `lockKind: "statement-scoped"` is for the negative controls only: instead of the API's lock, the process takes a
 * lock that is released when its statement ends — `BEGIN EXCLUSIVE` and `COMMIT` on the same lock file, which a second
 * process waiting for it would also pass — and then opens PGlite on the engine seam (`openPgliteOn`), which takes no
 * lock. The writer-lock checks must fail with it. [A17]
 */

export interface Job {
  readonly mode: "write" | "lock";
  readonly dataDir: string;
  readonly startAt?: number;
  /** `write`: stop after this many blocks (default: never). */
  readonly blocks?: number;
  /** `write`: milliseconds between two blocks (default 5). */
  readonly paceMs?: number;
  readonly lockKind?: "api" | "statement-scoped";
}

export type WorkerEvent =
  | { readonly event: "opened"; readonly from: number; readonly lockMs: number; readonly openMs: number }
  | { readonly event: "locked"; readonly lockMs: number }
  | { readonly event: "committed"; readonly height: number }
  | { readonly event: "refused"; readonly code: string; readonly ms: number; readonly message: string }
  | { readonly event: "done" };

/** The test schema: each block's height and the process that wrote it. */
export const WORKER_SCHEMA = [
  "CREATE SCHEMA IF NOT EXISTS t",
  "CREATE TABLE IF NOT EXISTS t.blocks (height bigint PRIMARY KEY, writer integer NOT NULL)",
];

function report(event: WorkerEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

/** Keeps references to the negative control's lock files for the process's life. */
const held: DatabaseSync[] = [];

/** The negative controls' lock: taken and released by one statement each, so it holds nothing afterwards. */
function statementScopedLock(dataDir: string): void {
  const lock = new DatabaseSync(pgliteLockFile(dataDir)!);
  lock.exec("PRAGMA busy_timeout = 100");
  lock.exec("BEGIN EXCLUSIVE");
  lock.exec("COMMIT");
  held.push(lock);
}

async function open(job: Job): Promise<{ db: Database; lockMs: number }> {
  // Loaded here, not above, so that a `lock` process starts quickly (the writer-lock races start many of them).
  const { PGlite } = await import("@electric-sql/pglite");
  const { openPglite, openPgliteOn, PGLITE_START_PARAMS } = await import("../../src/db/pglite.js");
  if (job.lockKind === "statement-scoped") {
    const started = performance.now();
    statementScopedLock(job.dataDir);
    const lockMs = performance.now() - started;
    const engine = await PGlite.create(job.dataDir, { startParams: [...PGLITE_START_PARAMS] });
    return { db: await openPgliteOn(engine, { committedHeight: cursor }), lockMs };
  }
  // The lock is the first thing `openPglite` does after the opt-in check; its time is measured on its own below.
  const db = await openPglite({ dataDir: job.dataDir, committedHeight: cursor, developmentOptIn: true });
  return { db, lockMs: Number.NaN };
}

const cursor = async (read: { query(sql: string): Promise<Record<string, unknown>[]> }): Promise<bigint | null> => {
  const [row] = await read.query("SELECT max(height) AS height FROM t.blocks");
  return (row?.height ?? null) as bigint | null;
};

async function main(): Promise<void> {
  const job = JSON.parse(process.argv[2] ?? "{}") as Job;
  if (job.startAt !== undefined) {
    while (Date.now() < job.startAt) {
      // Busy-wait: every process leaves this loop within the same millisecond.
    }
  }
  const started = performance.now();
  try {
    if (job.mode === "lock") {
      await acquirePgliteLock(job.dataDir);
      report({ event: "locked", lockMs: performance.now() - started });
      setInterval(() => undefined, 1 << 30);
      return;
    }
    let lockMs = Number.NaN;
    if (job.lockKind !== "statement-scoped") {
      // Measure the lock alone: take it, as `openPglite` will (the same process reuses the lock it holds).
      await acquirePgliteLock(job.dataDir).then((lock) => lock?.endUse());
      lockMs = performance.now() - started;
    }
    const opened = await open(job);
    if (!Number.isNaN(opened.lockMs)) lockMs = opened.lockMs;
    const { db } = opened;
    await db.transaction(async (tx) => {
      for (const statement of WORKER_SCHEMA) await tx.execute(statement);
    });
    const from = Number((await db.read(async (read) => read.height)) ?? 0n);
    report({ event: "opened", from, lockMs, openMs: performance.now() - started });
    for (let height = from + 1; job.blocks === undefined || height <= from + job.blocks; height++) {
      await db.transaction((tx) =>
        tx.execute("INSERT INTO t.blocks (height, writer) VALUES ($1::bigint, $2::integer)", [height, process.pid]),
      );
      report({ event: "committed", height });
      await sleep(job.paceMs ?? 5);
    }
    await db.close();
    report({ event: "done" });
  } catch (error) {
    if (error instanceof UmbraError) {
      report({ event: "refused", code: error.code, ms: performance.now() - started, message: error.message });
      process.exit(0);
    }
    throw error;
  }
}

await main();
