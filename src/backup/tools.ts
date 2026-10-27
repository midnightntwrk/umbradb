/**
 * The tools a backup runs (`openspec/changes/core-arch/specs/backups/spec.md` BK-1; `design.md` §9.1; owner decision
 * Q85: "the command fails if not installed, instead of a dependency"): neither is a dependency of UmbraDB, and each is
 * looked for only when a backup runs.
 *
 * - **PostgreSQL:** the PostgreSQL 18 client's `pg_dump` — the file `UMBRADB_PG_DUMP` names, else the first `pg_dump`
 *   on `PATH` —, asked for its version (`pg_dump --version`); a tool that is missing, cannot be run or is of another
 *   major version than 18 (a newer one may write what 18 cannot restore; fix check NF-04) fails with
 *   `backup-tools-missing`, saying what to install.
 * - **PGlite:** `pg_dump` of `@electric-sql/pglite-tools`, an optional peer dependency imported only now; without it,
 *   `backup-tools-missing` with the command that installs the version made for this build's PGlite. Its `pg_dump`'s
 *   version is checked on the dump it writes (`./backup.ts`).
 */

import { execFile } from "node:child_process";
import { accessSync, constants, statSync } from "node:fs";
import { delimiter, join } from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import { UmbraError } from "../db/errors.js";

/** The PostgreSQL major version both backends run (Q82), and so the one `pg_dump` must have. */
export const PG_DUMP_MAJOR = 18;

/** The environment variable naming the `pg_dump` to run, in place of the one on `PATH`. */
export const PG_DUMP_VARIABLE = "UMBRADB_PG_DUMP";

/** The `pglite-tools` module a PGlite backup imports, and the version made for this build's PGlite (0.5.10). */
export const PGLITE_TOOLS_MODULE = "@electric-sql/pglite-tools/pg_dump";
export const PGLITE_TOOLS_VERSION = "0.4.10";

/** What installs the PostgreSQL 18 client. */
const PG_DUMP_HINT =
  "install the PostgreSQL 18 client — the postgresql-client-18 package (Debian, Ubuntu), postgresql18 (Alpine, Fedora " +
  `and others) or postgresql@18 (Homebrew) — and put its pg_dump on PATH, or name it with ${PG_DUMP_VARIABLE}`;

/** The environment a backup reads (`PATH`, {@link PG_DUMP_VARIABLE}). */
export type Environment = Readonly<Record<string, string | undefined>>;

/** `backup-tools-missing` for a PostgreSQL database: what was found (`found`), and what to install. */
function pgDumpMissing(found: string, details: Readonly<Record<string, unknown>>): UmbraError {
  return new UmbraError(
    "backup-tools-missing",
    `a backup of a PostgreSQL database runs the PostgreSQL ${PG_DUMP_MAJOR} client's pg_dump, and ${found}: ` +
      `${PG_DUMP_HINT} (BK-1); no file was written`,
    { tool: "pg_dump", needed: String(PG_DUMP_MAJOR), ...details },
  );
}

/** Whether `path` is a file this process may run. */
function runnable(path: string): boolean {
  try {
    if (!statSync(path).isFile()) return false;
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/** The `pg_dump` to run: {@link PG_DUMP_VARIABLE}'s, else the first on `PATH`; null when there is none. */
function locatePgDump(env: Environment): { readonly path: string; readonly from: string } | null {
  const named = env[PG_DUMP_VARIABLE];
  if (named !== undefined && named !== "") return { path: named, from: PG_DUMP_VARIABLE };
  for (const dir of (env.PATH ?? "").split(delimiter)) {
    if (dir === "") continue;
    // `pg_dump.exe` is Windows's name; on other systems there is none.
    for (const name of ["pg_dump", "pg_dump.exe"]) {
      const path = join(dir, name);
      if (runnable(path)) return { path, from: "PATH" };
    }
  }
  return null;
}

/** The version `pg_dump --version` printed (`pg_dump (PostgreSQL) 18.6 …`), or null when it printed none. */
export function pgDumpVersion(printed: string): { readonly major: number; readonly version: string } | null {
  const match = /\(PostgreSQL\)\s+(\d+)(?:\.(\d+))?/.exec(printed);
  if (match === null) return null;
  return { major: Number(match[1]), version: match[2] === undefined ? (match[1] as string) : `${match[1]}.${match[2]}` };
}

/** The `pg_dump` a backup of a PostgreSQL database runs: its path and its version. */
export interface PgDumpTool {
  readonly path: string;
  readonly version: string;
}

/**
 * Finds the PostgreSQL 18 client's `pg_dump` (see the module comment) and asks it for its version; rejects with
 * `backup-tools-missing` when it is missing, cannot be run or is not of major version 18.
 */
export async function findPgDump(env: Environment): Promise<PgDumpTool> {
  const located = locatePgDump(env);
  if (located === null) {
    throw pgDumpMissing(`no pg_dump is on PATH and ${PG_DUMP_VARIABLE} is not set`, { found: null });
  }
  const printed = await new Promise<string | Error>((resolve) => {
    execFile(located.path, ["--version"], { timeout: 60_000, env: { ...env } }, (error, stdout) => {
      resolve(error === null ? String(stdout) : error);
    });
  });
  if (printed instanceof Error) {
    throw pgDumpMissing(`the pg_dump ${located.from} names could not be run (${printed.message})`, {
      found: located.from,
    });
  }
  const version = pgDumpVersion(printed);
  if (version === null) {
    throw pgDumpMissing(`the pg_dump ${located.from} names printed no PostgreSQL version`, { found: located.from });
  }
  if (version.major !== PG_DUMP_MAJOR) {
    throw pgDumpMissing(`the pg_dump ${located.from} names is of PostgreSQL ${version.version}`, {
      found: located.from,
      version: version.version,
    });
  }
  return Object.freeze({ path: located.path, version: version.version });
}

/** `pg_dump` of `@electric-sql/pglite-tools`, as its module exports it. */
export type PgliteDump = (options: { readonly pg: PGlite; readonly args?: string[] }) => Promise<Blob>;

/**
 * Imports `pg_dump` of `@electric-sql/pglite-tools` (`module`, {@link PGLITE_TOOLS_MODULE} unless given); rejects with
 * `backup-tools-missing`, naming what to install, when it cannot be imported.
 */
export async function loadPgliteDump(module: string = PGLITE_TOOLS_MODULE): Promise<PgliteDump> {
  let loaded: { readonly pgDump?: unknown };
  try {
    loaded = (await import(module)) as { readonly pgDump?: unknown };
  } catch (error) {
    throw new UmbraError(
      "backup-tools-missing",
      `a backup of a PGlite database runs pg_dump of @electric-sql/pglite-tools, which could not be imported ` +
        `(${(error as Error).message}): install it with npm install @electric-sql/pglite-tools@` +
        `${PGLITE_TOOLS_VERSION}, the version made for this build's PGlite (BK-1); no file was written`,
      { tool: "pglite-tools", needed: PGLITE_TOOLS_VERSION, found: null },
      { cause: error },
    );
  }
  if (typeof loaded.pgDump !== "function") {
    throw new UmbraError(
      "backup-tools-missing",
      `the module ${module} has no pgDump function: install @electric-sql/pglite-tools@${PGLITE_TOOLS_VERSION} ` +
        "(BK-1); no file was written",
      { tool: "pglite-tools", needed: PGLITE_TOOLS_VERSION, found: module },
    );
  }
  return loaded.pgDump as PgliteDump;
}
