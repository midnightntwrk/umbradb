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
 *   `pg_dump` of major version 18, else `backup-tools-missing` — `./pglite-backup.ts`, which the browser page's backup
 *   runs too (BK-5).
 * Any committed height is a block boundary (RN-6), so the dump holds whole blocks. **The file** is written next to its
 * path under a temporary name, flushed to disk and renamed over the path only once complete, so a failed or interrupted
 * backup leaves no file at the path and never half a file; the temporary file is removed on failure.
 *
 * **Owner-only from creation** (task 15.1b, the threat model draft's gap 7; A174): a backup holds every row of the
 * database, so the temporary file is created with mode {@link BACKUP_FILE_MODE} (`0600`; a umask only takes bits away,
 * so it is never wider, even for an instant) and set to exactly that on its handle before its first byte (for a umask
 * that took the owner's bits too); a file system that refuses the `chmod` fails the backup, its temporary file removed.
 * The manifest line and the dump — PGlite's text, or `pg_dump`'s output, piped in: `pg_dump` never opens the file — go
 * through that one handle, which is flushed to disk and closed before the rename, so the file is never opened again by
 * name. The rename keeps its mode; an earlier file at the path is replaced, its mode not carried over.
 */

import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createReadStream, type WriteStream } from "node:fs";
import { type FileHandle, open, rename, rm, stat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { finished } from "node:stream/promises";
import { UmbraError } from "../db/errors.js";
import { type Manifest, manifestLine, type ManifestTool, readManifestLine } from "./manifest.js";
import {
  type DumpInput,
  factsOf,
  manifestOf,
  type PgliteDump,
  pgliteBackupText,
  privateRefused,
  type SnapshotSeams,
} from "./pglite-backup.js";
import { type Environment, findPgDump, loadPgliteDump, type PgDumpTool } from "./tools.js";

/** The database a backup reads, by backend: a PostgreSQL URL (for `pg_dump`), or PGlite (its engine, in the job). */
export type BackupTarget = { readonly backend: "postgres"; readonly url: string } | { readonly backend: "pglite" };

/** What {@link writeBackup} backs up, and where (the database, its opt-outs, side and opt-in: `DumpInput`). */
export interface BackupInput extends DumpInput {
  readonly target: BackupTarget;
  /** The file to write: replaced only once the new backup is complete. */
  readonly out: string;
  /** `PATH` and `UMBRADB_PG_DUMP`; this process's environment unless given. */
  readonly env?: Environment;
}

/** The mode of every backup file written, and of its temporary file from its creation: its owner's only (A174). */
export const BACKUP_FILE_MODE = 0o600;

/** What the tests replace (the dump outside the manifest's snapshot: `SnapshotSeams`). */
export interface BackupSeams extends SnapshotSeams {
  /** The `pglite-tools` module to import (a missing one: A124's `backup-tools-missing` on PGlite). */
  readonly pgliteTools?: string;
  /**
   * Creates the temporary file at `path` (a new name) and opens it for writing: A174's negative control creates it
   * other ways. The backup writes through the handle, closes it and removes the file on failure.
   */
  readonly createTemporary?: (path: string) => Promise<FileHandle>;
}

/** A backup written: its file and its manifest. */
export interface BackupWritten {
  readonly file: string;
  readonly manifest: Manifest;
}

/** A temporary file's name next to `out`, new to this backup. */
function temporaryPath(out: string): string {
  return join(dirname(out), `.${basename(out)}.${process.pid}.${randomBytes(6).toString("hex")}.partial`);
}

/**
 * Creates the file `path` (never an existing one: `wx`) with mode {@link BACKUP_FILE_MODE}, sets exactly that mode on
 * its handle, and resolves with the handle, open for writing; on a refused `chmod` closes and removes the file and
 * rejects with that error.
 */
async function ownerOnlyFile(path: string): Promise<FileHandle> {
  const handle = await open(path, "wx", BACKUP_FILE_MODE);
  try {
    await handle.chmod(BACKUP_FILE_MODE);
    return handle;
  } catch (error) {
    await handle.close().catch(() => undefined);
    await rm(path, { force: true });
    throw error;
  }
}

/** Writes `text` to `stream` and waits until it is taken. */
function writeText(stream: WriteStream, text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    stream.write(text, (error) => (error === null || error === undefined ? resolve() : reject(error)));
  });
}

/** Ends `stream`, waiting until its last write is flushed to disk and its file closed (`flush`, `autoClose`). */
async function endStream(stream: WriteStream): Promise<void> {
  stream.end();
  await finished(stream);
}

/** Ends `stream` after a failure, waiting until its file is closed; its own errors give way to the failure. */
async function abandonStream(stream: WriteStream): Promise<void> {
  stream.destroy();
  await finished(stream).catch(() => undefined);
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
  const temporary = temporaryPath(input.out);
  const handle = await (seams.createTemporary ?? ownerOnlyFile)(temporary);
  try {
    // The one handle: the stream fsyncs it (`flush`) and closes it (`autoClose`) when it ends.
    const stream = handle.createWriteStream({ flush: true });
    let manifest: Manifest;
    try {
      if (input.target.backend === "postgres") {
        manifest = await postgresBackup({ ...input, target: input.target }, pgDump as PgDumpTool, stream, env, seams);
      } else {
        const backup = await pgliteBackupText(input, pgliteDump as PgliteDump, seams);
        manifest = backup.manifest;
        await writeText(stream, manifestLine(manifest));
        await writeText(stream, backup.text);
      }
    } catch (error) {
      await abandonStream(stream);
      throw error;
    }
    await endStream(stream);
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
