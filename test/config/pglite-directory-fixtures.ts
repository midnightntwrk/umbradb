import { existsSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { UmbraError } from "../../src/db/errors.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { core, settle, startProcess, testBuild } from "../runner/process-build.js";

/**
 * The first check of creating a missing PGlite directory, shared by its test (`./pglite-directory.test.ts`) and its
 * committed negative control (`./pglite-directory.negative-control.test.ts`). It runs the runner's `startProcess` on
 * `database: { kind: "pglite", path: <directory> }` under the development opt-in, with the directory's parent
 * missing, over an in-memory chain whose head is S, and reads what it left on disk. [A166, CF-4, Q163 A]
 */

/** S, and the in-memory chain's head: the process commits block S and waits for the next. */
export const S = 1n;

/** What one process on a PGlite directory whose parent was missing showed, and left. */
export interface ProcessObservation {
  /** Startup's refusal (`code reason`), null when it started. */
  readonly refused: string | null;
  /** How processing ended before it waited for the block after S, null when it waited. */
  readonly ended: string | null;
  /** Whether the directory exists afterwards. */
  readonly created: boolean;
  /** Whether block S is in `core_block_commit.blocks`. */
  readonly committedS: boolean;
  /** Whether the writer lock's file is beside the directory (taken once the directory existed). [DB-11] */
  readonly lockBeside: boolean;
  /** The lines the process logged. */
  readonly lines: readonly string[];
}

/**
 * The rows `sql` reads from the PGlite database in `directory`, through a plain engine (no writer lock, which this
 * process may hold for the directory; the process that wrote it has stopped).
 */
export async function rowsIn(directory: string, sql: string): Promise<Record<string, unknown>[]> {
  const engine = await PGlite.create(directory);
  try {
    return (await engine.query<Record<string, unknown>>(sql)).rows;
  } finally {
    await engine.close();
  }
}

/** Whether block `height` is committed in the PGlite database in `directory` (false without one there). */
export async function committedIn(directory: string, height: bigint): Promise<boolean> {
  if (!existsSync(join(directory, "PG_VERSION"))) return false;
  const [table] = await rowsIn(directory, "SELECT to_regclass('core_block_commit.blocks') IS NOT NULL AS present");
  if (table?.present !== true) return false;
  const rows = await rowsIn(directory, `SELECT 1 AS one FROM core_block_commit.blocks WHERE height = ${height}`);
  return rows.length === 1;
}

/** Starts a process on the PGlite `directory` (see the module comment) until it waits past S; stops it. */
export async function processOn(directory: string): Promise<ProcessObservation> {
  const source = new InMemoryBlockSource({ head: S });
  const lines: string[] = [];
  const handle = startProcess({
    declarations: testBuild([]).declarations,
    config: { data: { entries: [core({ kind: "pglite", path: directory }, Number(S))] } },
    source,
    log: (line) => lines.push(line),
  });
  let refused: string | null = null;
  let ended: string | null = null;
  try {
    const how = await settle(handle, source, S);
    if (how !== "waiting") ended = how.kind;
  } catch (error) {
    const details = error instanceof UmbraError ? (error.details as { reason?: unknown } | undefined) : undefined;
    refused = error instanceof UmbraError ? `${error.code} ${String(details?.reason)}` : String(error);
  } finally {
    await handle.stop();
  }
  const created = existsSync(directory);
  return {
    refused,
    ended,
    created,
    committedS: created && (await committedIn(directory, S)),
    lockBeside: existsSync(`${directory}.lock.sqlite`),
    lines,
  };
}

/** The first check's oracle: every problem with what a process showed, none when the check holds. [A166] */
export function processProblems(observed: ProcessObservation): string[] {
  const problems: string[] = [];
  if (observed.refused !== null) problems.push(`startup refused (${observed.refused})`);
  if (observed.ended !== null) problems.push(`processing ended (${observed.ended})`);
  if (!observed.created) problems.push("the directory was not created");
  if (!observed.committedS) problems.push("block S was not committed");
  if (!observed.lockBeside) problems.push("no writer lock file beside the directory");
  // The process says it created the directory, naming it as configured. [Q165 B, Q167 A]
  if (!observed.lines.some((line) => /^created a new PGlite data directory .+ \(and 1 missing parent directory\)$/.test(line))) {
    problems.push("no log line names the directory created");
  }
  return problems;
}
