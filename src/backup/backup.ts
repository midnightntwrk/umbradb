/**
 * Writing a backup (`openspec/changes/core-arch/specs/backups/spec.md` BK-1, BK-2; `specs/private-processes/spec.md`
 * PP-12; `design.md` §9.1; owner decisions Q83, Q85): a `pg_dump` file of a database at one committed height, its
 * manifest (`./manifest.ts`) as the first line. Used by `umbradb backup` (`src/cli/backup.ts`), by a process's
 * `backup` and by the backup at stop (`src/runner/process.ts`).
 *
 * **In this order:** a private process's backup refused without the development opt-in (`private-backup-refused`,
 * PP-12); the tool found (`./tools.ts`: `backup-tools-missing`); then one snapshot for the manifest and the dump:
 * - **PostgreSQL:** one read of the database API — a `REPEATABLE READ READ ONLY` transaction on a read connection
 *   (DB-2) — reads the manifest's facts (`./facts.ts`: the cursor, the identity, the history, the migrations, the state
 *   root, the contents hash), refuses a private database without the opt-in, exports its snapshot
 *   (`pg_export_snapshot()`) and, while it stays open, runs `pg_dump --snapshot=<id> --inserts --no-owner
 *   --no-privileges`, whose output follows the manifest line in the file. The database URL's password reaches
 *   `pg_dump` in its environment (`PGPASSWORD`), never on its command line.
 * - **PGlite:** one exclusive job of the database's queue (`exclusiveJob`, DB-4), so commits wait: the facts in a read
 *   inside the job, then `pg_dump` of `@electric-sql/pglite-tools` on the engine (it adds `--inserts`; its `DEALLOCATE
 *   ALL` and everything its `pg_dump` set on the one session end with the job); the dump's own header must name a
 *   `pg_dump` of major version 18, else `backup-tools-missing`.
 * Any committed height is a block boundary (RN-6), so the dump holds whole blocks. **The file** is written next to its
 * path under a temporary name, flushed to disk and renamed over the path only once complete, so a failed or interrupted
 * backup leaves no file at the path and never half a file; the temporary file is removed on failure.
 */

import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createReadStream, createWriteStream, type WriteStream } from "node:fs";
import { open, rename, rm, stat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import { UMBRADB_VERSION } from "../config/build.js";
import type { ProcessSide } from "../config/core-settings.js";
import type { Database } from "../db/api.js";
import { UmbraError } from "../db/errors.js";
import { exclusiveJob } from "../db/pglite.js";
import type { TableName } from "../deterministic-postgresql/index.js";
import { type BackupFacts, isPrivateDatabase, readBackupFacts } from "./facts.js";
import { BACKUP_FORMAT, type Manifest, manifestLine, type ManifestTool, readManifestLine } from "./manifest.js";
import {
  type Environment,
  findPgDump,
  loadPgliteDump,
  PG_DUMP_MAJOR,
  type PgDumpTool,
  type PgliteDump,
  pgDumpVersion,
} from "./tools.js";

/** The database a backup reads, by backend: a PostgreSQL URL (for `pg_dump`), or PGlite (its engine, in the job). */
export type BackupTarget = { readonly backend: "postgres"; readonly url: string } | { readonly backend: "pglite" };

/** What {@link writeBackup} backs up, and where. */
export interface BackupInput {
  /** The database, opened through the database API on the backend {@link target} names. */
  readonly db: Database;
  readonly target: BackupTarget;
  /** The file to write: replaced only once the new backup is complete. */
  readonly out: string;
  /** The tables declared `deterministic: false` (MD-1, Q76): the contents hash records them by name only. */
  readonly optedOut: readonly TableName[];
  /** The process's side: a private process's backup needs the development opt-in (PP-12). */
  readonly side?: ProcessSide;
  /** The development opt-in of the process's `core` revision (CF-4, Q102). */
  readonly developmentOptIn: boolean;
  /** `PATH` and `UMBRADB_PG_DUMP`; this process's environment unless given. */
  readonly env?: Environment;
}

/** What the tests replace. */
export interface BackupSeams {
  /** The `pglite-tools` module to import (a missing one: A124's `backup-tools-missing` on PGlite). */
  readonly pgliteTools?: string;
  /**
   * A124's negative control only: the dump taken outside the manifest's snapshot — the facts read and their read ended,
   * then `between` awaited (while blocks commit), then the dump in a snapshot of its own.
   */
  readonly outsideSnapshot?: { between(): Promise<void> };
}

/** A backup written: its file and its manifest. */
export interface BackupWritten {
  readonly file: string;
  readonly manifest: Manifest;
}

/** `private-backup-refused` (PP-12). */
function privateRefused(): UmbraError {
  return new UmbraError(
    "private-backup-refused",
    "UmbraDB does not back up a private process's database unless the development opt-in is set (PP-12): a private " +
      "database holds what its modules computed from their private inputs; no file was written. PostgreSQL's own " +
      "tools can still copy it, outside this rule",
    { feature: "private-backup" },
  );
}

/** A temporary file next to `out`, created now (never an existing file's name). */
async function temporaryFile(out: string): Promise<string> {
  const path = join(dirname(out), `.${basename(out)}.${process.pid}.${randomBytes(6).toString("hex")}.partial`);
  await (await open(path, "wx")).close();
  return path;
}

/** Writes `text` to `stream` and waits until it is taken. */
function writeText(stream: WriteStream, text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.write(text, (error) => (error === null || error === undefined ? resolve() : reject(error)));
  });
}

/** Ends `stream`, waiting for its last write. */
function endStream(stream: WriteStream): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.once("error", reject);
    stream.end(() => resolve());
  });
}

/** The URL without its password, and the password (for `PGPASSWORD`), decoded. */
function withoutPassword(url: string): { readonly url: string; readonly password: string | null } {
  const parsed = new URL(url);
  if (parsed.password === "") return { url, password: null };
  const password = decodeURIComponent(parsed.password);
  parsed.password = "";
  return { url: parsed.toString(), password };
}

/**
 * Runs `pg_dump` (`tool`) on the database `url` names, in the snapshot `snapshot` (none: its own), appending its output
 * to `stream`; rejects with `database-error` (`reason: pg-dump-failed`, its message) when it fails.
 */
async function runPgDump(
  tool: PgDumpTool,
  url: string,
  snapshot: string | null,
  stream: WriteStream,
  env: Environment,
): Promise<void> {
  const target = withoutPassword(url);
  const args = [
    "--format=plain",
    "--inserts",
    "--no-owner",
    "--no-privileges",
    ...(snapshot === null ? [] : [`--snapshot=${snapshot}`]),
    `--dbname=${target.url}`,
  ];
  const childEnv: Record<string, string> = {};
  for (const [name, value] of Object.entries(env)) if (value !== undefined) childEnv[name] = value;
  if (target.password !== null) childEnv.PGPASSWORD = target.password;
  childEnv.PGAPPNAME = "umbradb-backup";
  const child = spawn(tool.path, args, { env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
  let stderr = "";
  child.stderr.setEncoding("utf8").on("data", (chunk: string) => {
    if (stderr.length < 65_536) stderr += chunk;
  });
  const exited = new Promise<number | null>((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) => resolve(code));
  });
  child.stdout.pipe(stream, { end: false });
  const code = await exited;
  child.stdout.unpipe(stream);
  if (code !== 0) {
    throw new UmbraError(
      "database-error",
      `pg_dump ${tool.version} failed (exit status ${code}): ${stderr.trim() || "no message"}; no file was written`,
      { reason: "pg-dump-failed", status: code },
    );
  }
}

/** The manifest of `facts`, written by `tool`. */
function manifestOf(facts: BackupFacts, tool: ManifestTool): Manifest {
  return Object.freeze({ format: BACKUP_FORMAT, ...facts.manifest, umbradb: UMBRADB_VERSION, tool });
}

/** The facts of the database `read` sees, a private database refused without the opt-in (PP-12). */
async function factsOf(
  read: Parameters<typeof readBackupFacts>[0],
  input: BackupInput,
): Promise<BackupFacts> {
  if (!input.developmentOptIn && (await isPrivateDatabase(read))) throw privateRefused();
  return readBackupFacts(read, { optedOut: input.optedOut });
}

/** A PostgreSQL backup into `stream` (see the module comment); resolves with its manifest. */
async function postgresBackup(
  input: BackupInput & { readonly target: { readonly url: string } },
  tool: PgDumpTool,
  stream: WriteStream,
  env: Environment,
  seams: BackupSeams,
): Promise<Manifest> {
  const name: ManifestTool = { name: "pg_dump", version: tool.version };
  if (seams.outsideSnapshot !== undefined) {
    const facts = await input.db.read((read) => factsOf(read, input));
    await seams.outsideSnapshot.between();
    const manifest = manifestOf(facts, name);
    await writeText(stream, manifestLine(manifest));
    await runPgDump(tool, input.target.url, null, stream, env);
    return manifest;
  }
  return input.db.read(async (read) => {
    const facts = await factsOf(read, input);
    const manifest = manifestOf(facts, name);
    const [exported] = await read.query("SELECT pg_export_snapshot() AS snapshot");
    await writeText(stream, manifestLine(manifest));
    await runPgDump(tool, input.target.url, exported?.snapshot as string, stream, env);
    return manifest;
  });
}

/** The dump's own header line naming its `pg_dump`'s version, and that version. */
function dumpedBy(dump: string): string | null {
  const match = /^-- Dumped by pg_dump version (\S+)/m.exec(dump.slice(0, 4_096));
  return match === null ? null : (match[1] as string);
}

/** A PGlite backup (see the module comment): its manifest and the dump's text. */
async function pgliteBackup(
  input: BackupInput,
  dump: PgliteDump,
  seams: BackupSeams,
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
 * Writes a backup of `input.db` to `input.out` (see the module comment) and resolves with it; rejects with
 * `private-backup-refused`, `backup-tools-missing`, `no-committed-height`, or the database's and the tool's failures,
 * leaving no file at `input.out` (an earlier one there is kept).
 */
export async function writeBackup(input: BackupInput, seams: BackupSeams = {}): Promise<BackupWritten> {
  if (input.side === "private" && !input.developmentOptIn) throw privateRefused();
  const env = input.env ?? process.env;
  const pgDump = input.target.backend === "postgres" ? await findPgDump(env) : null;
  const pgliteDump = input.target.backend === "pglite" ? await loadPgliteDump(seams.pgliteTools) : null;
  const temporary = await temporaryFile(input.out);
  try {
    const stream = createWriteStream(temporary, { flags: "w" });
    let manifest: Manifest;
    try {
      if (input.target.backend === "postgres") {
        manifest = await postgresBackup({ ...input, target: input.target }, pgDump as PgDumpTool, stream, env, seams);
      } else {
        const { facts, text } = await pgliteBackup(input, pgliteDump as PgliteDump, seams);
        const version = dumpedBy(text);
        const major = version === null ? null : pgDumpVersion(`(PostgreSQL) ${version}`)?.major;
        if (major !== PG_DUMP_MAJOR) {
          throw new UmbraError(
            "backup-tools-missing",
            `pg_dump of @electric-sql/pglite-tools is of PostgreSQL ${version ?? "an unknown version"}, not ` +
              `${PG_DUMP_MAJOR}: install the version made for this build's PGlite (BK-1); no file was written`,
            { tool: "pglite-tools", needed: String(PG_DUMP_MAJOR), version },
          );
        }
        manifest = manifestOf(facts, { name: "pglite-tools", version: version as string });
        await writeText(stream, manifestLine(manifest));
        await writeText(stream, text);
      }
    } finally {
      await endStream(stream);
    }
    const handle = await open(temporary, "r+");
    try {
      await handle.sync();
    } finally {
      await handle.close();
    }
    await rename(temporary, input.out);
    return Object.freeze({ file: input.out, manifest });
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}

/** The first line of the file at `path` (without its `\n`), read until its first `\n` or its end. */
export async function firstLine(path: string): Promise<string> {
  const stream = createReadStream(path, { encoding: "utf8", highWaterMark: 65_536 });
  let line = "";
  try {
    for await (const chunk of stream as AsyncIterable<string>) {
      const end = chunk.indexOf("\n");
      if (end >= 0) return line + chunk.slice(0, end);
      line += chunk;
    }
    return line;
  } finally {
    stream.destroy();
  }
}

/**
 * The backup at stop (CORE-ARCH §4.15, BK-1): writes the backup of the committed height `height` to `input.out`
 * unless the file there is a backup of that height already, which is kept ("no backup for that height exists yet");
 * resolves with what it did. A backup of another height there is replaced once the new one is complete; a file there
 * that is not a backup is left as it is, and the backup refused (`backup-format-unknown`).
 */
export async function backupAtStop(
  input: BackupInput,
  height: bigint,
  seams: BackupSeams = {},
): Promise<{ readonly written: boolean; readonly manifest: Manifest }> {
  const existing = await stat(input.out).then(
    () => true,
    () => false,
  );
  if (existing) {
    let manifest: Manifest;
    try {
      manifest = readManifestLine(await firstLine(input.out));
    } catch (error) {
      if (!(error instanceof UmbraError)) throw error;
      throw new UmbraError(
        "backup-format-unknown",
        "the file at backupAtStop is not an UmbraDB backup, so it was left as it is and no backup was written: move " +
          "it, or set backupAtStop to another path (BK-1)",
        { file: input.out },
        { cause: error },
      );
    }
    if (manifest.height === String(height)) return Object.freeze({ written: false, manifest });
  }
  const { manifest } = await writeBackup(input, seams);
  return Object.freeze({ written: true, manifest });
}
