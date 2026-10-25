import { PGlite } from "@electric-sql/pglite";
import { setTimeout as sleep } from "node:timers/promises";
import { openPglite } from "../../src/db/pglite.js";
import { SHOW_TIMEOUTS } from "../deterministic-postgresql/zero-timeouts-checks.js";

/**
 * A PGlite engine in a process of its own, for `pglite-timeouts.test.ts`: a nonzero `idle_in_transaction_session_timeout`,
 * `transaction_timeout` or `idle_session_timeout` hangs PGlite 0.5.10 — synchronously, so the process's event loop
 * stops (design §14; probe 2026-10-25) — and only a parent that kills the process can bound that. Started with
 * `node --import tsx` and one JSON argument ({@link Job}); it reports each step as one JSON line on stdout
 * ({@link WorkerEvent}): what `SHOW` reports for the timeouts, then `sent` just before the statement that follows 2 s
 * idle in a transaction, then `answered` if that statement returns.
 *
 * - `engine`: an engine on `dataDir` started with `startParams` (the backend's, or a variant without the zeros):
 *   `BEGIN`, the settings, 2 s idle, a statement.
 * - `api-read`: the database API on an in-memory PGlite database: one read with the read option (`timeoutMs` 1000,
 *   which on PGlite sets nothing): the settings, 2 s idle, a statement. With `setsTimeouts`, the read's body first sets
 *   the two timeouts as PostgreSQL's bounded read does (`SET LOCAL`) — what a PGlite backend that applied the option
 *   would run: the negative control of A141's PGlite check.
 */

export type Job =
  | { readonly mode: "engine"; readonly dataDir: string; readonly startParams: readonly string[] }
  | { readonly mode: "api-read"; readonly setsTimeouts: boolean };

export type WorkerEvent =
  | { readonly event: "settings"; readonly settings: Record<string, unknown> }
  | { readonly event: "sent" }
  | { readonly event: "answered" }
  | { readonly event: "failed"; readonly message: string };

const IDLE_MS = 2_000;

function report(event: WorkerEvent): void {
  process.stdout.write(`${JSON.stringify(event)}\n`);
}

async function engine(dataDir: string, startParams: readonly string[]): Promise<void> {
  const db = await PGlite.create(dataDir, { startParams: [...startParams] });
  await db.query("BEGIN");
  report({ event: "settings", settings: (await db.query<Record<string, unknown>>(SHOW_TIMEOUTS)).rows[0] ?? {} });
  await sleep(IDLE_MS);
  report({ event: "sent" });
  await db.query("SELECT 1");
  report({ event: "answered" });
  await db.query("COMMIT");
  await db.close();
}

async function apiRead(setsTimeouts: boolean): Promise<void> {
  const db = await openPglite({ dataDir: "memory://", committedHeight: async () => null, developmentOptIn: true });
  await db.read(async (read) => {
    if (setsTimeouts) {
      await read.query("SET LOCAL statement_timeout = 1000");
      await read.query("SET LOCAL idle_in_transaction_session_timeout = 1000");
    }
    report({ event: "settings", settings: (await read.query(SHOW_TIMEOUTS))[0] ?? {} });
    await sleep(IDLE_MS);
    report({ event: "sent" });
    await read.query("SELECT 1 AS one");
    report({ event: "answered" });
  }, { timeoutMs: 1_000 });
  await db.close();
}

const job = JSON.parse(process.argv[2] as string) as Job;
try {
  if (job.mode === "engine") await engine(job.dataDir, job.startParams);
  else await apiRead(job.setsTimeouts);
} catch (error) {
  report({ event: "failed", message: error instanceof Error ? error.message : String(error) });
}
