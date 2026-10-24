import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import type { Database } from "../../src/db/api.js";
import { openPgliteOn, PGLITE_START_PARAMS } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";

/**
 * A139's child process (`time-values.test.ts`): started with `node --import tsx` and a time zone in `TZ`, it opens one
 * backend through the database API — PostgreSQL by the URL of the parent's test database, or a PGlite engine of its
 * own, created in this process's time zone with the backend's pinned start parameters and the parent's setup SQL — runs
 * the parent's query and prints, on one line after {@link MARKER}, what it read:
 *
 * - `rows`: the API's mapped rows, every value tagged with its JavaScript type where JSON would hide it (a `Date`, a
 *   `bigint`), so the parent compares the values the API gave, not their JSON text;
 * - `dateMapping`: the control, the mapping task 2.1 shipped (`new Date(text).toISOString()`), applied here to the same
 *   values' PostgreSQL text (the query's `…_text` columns), so the parent sees that such a mapping does depend on the
 *   process's time zone;
 * - `timeZone` and `offsetMinutes`: what this process's clock is set to (`Intl` and the offset of 2025-05-21 14:30
 *   local time), so the parent knows the time zone took effect.
 *
 * The job is the first argument, as JSON: `{ backend, url?, setup?, sql, textColumns }`.
 */

export const MARKER = "TIME-VALUES-RESULT ";

interface Job {
  readonly backend: "PostgreSQL" | "PGlite";
  readonly url?: string;
  readonly setup?: string;
  readonly sql: string;
  /** The columns holding a value's PostgreSQL text, for the control. */
  readonly textColumns: readonly string[];
}

/** JSON text of a value with every `Date` and `bigint` tagged, so that neither reads back as a string or a number. */
function tagged(value: unknown): string {
  return JSON.stringify(value, function (this: Record<string, unknown>, key: string, replaced: unknown) {
    const original = this[key];
    if (original instanceof Date) {
      return { $date: Number.isNaN(original.getTime()) ? "Invalid Date" : original.toISOString() };
    }
    if (typeof original === "bigint") return { $bigint: original.toString() };
    return replaced;
  });
}

async function open(job: Job): Promise<{ readonly db: Database; readonly engine?: PGlite }> {
  const committedHeight = async (): Promise<bigint | null> => null;
  if (job.backend === "PostgreSQL") {
    if (job.url === undefined) throw new Error("a PostgreSQL job needs the database's url");
    return { db: openPostgres({ url: job.url, committedHeight, readConnections: 1 }) };
  }
  const engine = await PGlite.create("memory://", { startParams: [...PGLITE_START_PARAMS] });
  if (job.setup !== undefined) await engine.exec(job.setup);
  return { db: await openPgliteOn(engine, { committedHeight }), engine };
}

async function main(): Promise<void> {
  const job = JSON.parse(process.argv[2] as string) as Job;
  const { db } = await open(job);
  try {
    const rows = await db.read((read) => read.query(job.sql));
    const dateMapping = rows.map((row) =>
      Object.fromEntries(
        job.textColumns.map((column) => {
          const text = row[column];
          if (typeof text !== "string") return [column, null];
          const date = new Date(text);
          return [column, Number.isNaN(date.getTime()) ? "Invalid Date" : date.toISOString()];
        }),
      ),
    );
    const report = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offsetMinutes: new Date(2025, 4, 21, 14, 30).getTimezoneOffset(),
      rows: JSON.parse(tagged(rows)) as unknown,
      dateMapping,
    };
    process.stdout.write(`${MARKER}${JSON.stringify(report)}\n`);
  } finally {
    await db.close();
  }
}

// Runs only as a child's entry point; the test imports this module for MARKER alone.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`);
    process.exitCode = 1;
  });
}
