/**
 * A PGlite database's backup as text: its manifest (`./manifest.ts`) and the dump that the `pg_dump` of
 * `@electric-sql/pglite-tools` writes. Both are taken in one exclusive job of the database's queue (`exclusiveJob`), so
 * commits wait and both see one committed height. [BK-1, BK-2, DB-4; design §9.1, §9.2]
 *
 * `writeBackup` (`./backup.ts`) writes them to a file; the browser page's core worker hands them to the page, which
 * saves them. This module imports nothing of Node.js, so the browser build bundles it as it is. The caller brings the
 * `pg_dump` function: `./tools.ts`'s `loadPgliteDump` in Node.js, the page's bundled `pglite-tools` in the browser.
 * [BK-5]
 *
 * **In this order:**
 * - A private process's backup is refused without the development opt-in (`private-backup-refused`): by its side,
 *   before anything is read, and by its database (`core_private_source.cursor`) inside the job. [PP-12]
 * - The facts (`./facts.ts`) are read in the job.
 * - The engine is dumped. The tool adds `--inserts`, and `--no-owner` and `--no-privileges` are given. Its
 *   `DEALLOCATE ALL`, and everything it set on the one session, end with the job.
 * - The dump's own header must name a `pg_dump` of major version {@link PG_DUMP_MAJOR}, else `backup-tools-missing`.
 */

import type { PGlite } from "@electric-sql/pglite";
import { UMBRADB_VERSION } from "../config/build.js";
import type { ProcessSide } from "../config/core-settings.js";
import type { Database } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { exclusiveJob } from "../db/pglite.js";
import type { TableName } from "../deterministic-postgresql/index.js";
import { type BackupFacts, isPrivateDatabase, readBackupFacts } from "./facts.js";
import { BACKUP_FORMAT, type Manifest, type ManifestTool } from "./manifest.js";

/** The PostgreSQL major version both backends run, and so the one `pg_dump` must have. [Q82] */
export const PG_DUMP_MAJOR = 18;

/** The version `pg_dump --version` printed (`pg_dump (PostgreSQL) 18.6 …`), or null when it printed none. */
export function pgDumpVersion(printed: string): { readonly major: number; readonly version: string } | null {
  const match = /\(PostgreSQL\)\s+(\d+)(?:\.(\d+))?/.exec(printed);
  if (match === null) return null;
  return { major: Number(match[1]), version: match[2] === undefined ? (match[1] as string) : `${match[1]}.${match[2]}` };
}

/** `pg_dump` of `@electric-sql/pglite-tools`, as its module exports it. */
export type PgliteDump = (options: { readonly pg: PGlite; readonly args?: string[] }) => Promise<Blob>;

/** What a backup reads, besides where it is written. */
export interface DumpInput {
  /** The database, opened through the database API. */
  readonly db: Database;
  /** The tables declared `deterministic: false`: the contents hash records them by name only. [MD-1, Q76] */
  readonly optedOut: readonly TableName[];
  /** The process's side: a private process's backup needs the development opt-in. [PP-12] */
  readonly side?: ProcessSide;
  /** The development opt-in of the process's `core` revision. [CF-4, Q102] */
  readonly developmentOptIn: boolean;
}

/** What the negative controls replace. */
export interface SnapshotSeams {
  /**
   * For the negative control of the consistent-snapshot test only: the dump is taken outside the manifest's snapshot.
   * The facts are read and their read ended, then `between` is awaited (while blocks commit), then the dump is taken
   * in a snapshot of its own. [A124]
   */
  readonly outsideSnapshot?: { between(): Promise<void> };
}

/** `private-backup-refused`. [PP-12] */
export function privateRefused(): UmbraError {
  return new UmbraError(
    "private-backup-refused",
    "UmbraDB does not back up a private process's database unless the development opt-in is set: a private " +
      "database holds what its modules computed from their private inputs; no file was written. PostgreSQL's own " +
      "tools can still copy it, outside this rule",
    { feature: "private-backup" },
  );
}

/** The manifest of `facts`, written by `tool`. */
export function manifestOf(facts: BackupFacts, tool: ManifestTool): Manifest {
  return Object.freeze({ format: BACKUP_FORMAT, ...facts.manifest, umbradb: UMBRADB_VERSION, tool });
}

/** The facts of the database `read` sees, a private database refused without the opt-in. [PP-12] */
export async function factsOf(read: Parameters<typeof readBackupFacts>[0], input: DumpInput): Promise<BackupFacts> {
  if (!input.developmentOptIn && (await isPrivateDatabase(read))) throw privateRefused();
  return readBackupFacts(read, { optedOut: input.optedOut });
}

/** The dump's own header line naming its `pg_dump`'s version, and that version. */
function dumpedBy(dump: string): string | null {
  const match = /^-- Dumped by pg_dump version (\S+)/m.exec(dump.slice(0, 4_096));
  return match === null ? null : (match[1] as string);
}

/** The facts and the dump's text (see the module comment). */
async function factsAndDump(
  input: DumpInput,
  dump: PgliteDump,
  seams: SnapshotSeams,
): Promise<{ readonly facts: BackupFacts; readonly text: string }> {
  const run = (engine: PGlite) => dump({ pg: engine, args: ["--no-owner", "--no-privileges"] });
  let result: { readonly facts: BackupFacts; readonly text: string } | null;
  if (seams.outsideSnapshot !== undefined) {
    const facts = await input.db.read((read) => factsOf(read, input));
    await seams.outsideSnapshot.between();
    const job = exclusiveJob(input.db, async ({ engine }) => (await run(engine)).text());
    result = job === null ? null : { facts, text: await job };
  } else {
    result = await exclusiveJob(input.db, async ({ read, engine }) => {
      const facts = await read((handle) => factsOf(handle, input));
      return { facts, text: await (await run(engine)).text() };
    });
  }
  if (result === null) throw new Error("writeBackup: a PGlite target's database is not one the PGlite backend opened");
  return result;
}

/**
 * A backup of the PGlite database `input.db` (see the module comment): its manifest and the dump's text, which follows
 * the manifest's line (`manifestLine`) in the file. Rejects with `private-backup-refused`, `backup-tools-missing`,
 * `no-committed-height`, or the database's and the tool's failures.
 */
export async function pgliteBackupText(
  input: DumpInput,
  dump: PgliteDump,
  seams: SnapshotSeams = {},
): Promise<{ readonly manifest: Manifest; readonly text: string }> {
  if (input.side === "private" && !input.developmentOptIn) throw privateRefused();
  const { facts, text } = await factsAndDump(input, dump, seams);
  const version = dumpedBy(text);
  const major = version === null ? null : pgDumpVersion(`(PostgreSQL) ${version}`)?.major;
  if (major !== PG_DUMP_MAJOR) {
    throw new UmbraError(
      "backup-tools-missing",
      `pg_dump of @electric-sql/pglite-tools is of PostgreSQL ${version ?? "an unknown version"}, not ` +
        `${PG_DUMP_MAJOR}: install the version made for this build's PGlite; no file was written`,
      { tool: "pglite-tools", needed: String(PG_DUMP_MAJOR), version },
    );
  }
  return Object.freeze({ manifest: manifestOf(facts, { name: "pglite-tools", version: version as string }), text });
}
