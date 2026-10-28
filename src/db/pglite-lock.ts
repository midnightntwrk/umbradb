/**
 * The PGlite writer lock in Node.js (DB-11; `openspec/changes/core-arch/design.md` §4 "Writer lock"; owner decision
 * Q50, fail stop). PGlite does not guard its data directory itself — two processes can open one directory — so before
 * PGlite opens a directory the process takes an operating-system lock and holds it until the process ends: it opens
 * `<data directory>.lock.sqlite` with the built-in `node:sqlite` (`DatabaseSync`), sets a busy timeout, and runs
 * `BEGIN EXCLUSIVE`, never committing. SQLite's file locks are operating-system locks: a second process fails to take
 * it (`database is locked`) and refuses with `writer-lock-held`; the operating system releases it only when the holder
 * ends — a paused or sleeping holder keeps it, a crashed holder's restart takes it at once. There is no unlock command.
 *
 * - **Busy timeout 100 ms, not 0 (decision record Q92, open).** With 0, processes started at one instant can all fail:
 *   `BEGIN EXCLUSIVE` takes SHARED, RESERVED, then EXCLUSIVE, which needs every other SHARED lock gone, and a racing
 *   starter holds one for an instant (probe: 4 of 30 rounds of ten processes ended with no holder). With a busy timeout
 *   SQLite's busy handler drops the starter's SHARED lock before it waits, and exactly one takes the lock (50 of 50
 *   rounds at 10–100 ms); a second process facing a live holder refuses after the timeout, ~0.1 s.
 * - **One lock file per directory, however the directory is written:** the path is resolved and its symbolic links
 *   followed (a directory not yet created: its parent's real path and its name), so `pgdata`, `pgdata/`, `./pgdata`,
 *   `file://…/pgdata` and a link to it share one lock file. Nothing else in the process may open that file: closing any
 *   descriptor of a file drops every POSIX lock the process holds on it (SQLite guards its own descriptors only).
 * - **Held for the process's life.** Closing the database does not release it; the same process may open the directory
 *   again (it reuses the lock it holds), but only once at a time: a second opening while the first is open is
 *   `writer-lock-held` too.
 * - **`memory://`** (and an empty data directory, which PGlite also keeps in memory) takes no lock: each in-memory
 *   database is its own, and no other process can open it. The browser's file systems (`idb://`, `opfs-ahp://`) are
 *   refused in Node.js; the browser build takes a Web Locks lock instead (task 16.1).
 * - The data directory must be on a local file system, whose locks the operating system keeps (DB-11).
 * - **A missing directory and its missing parents** are created by what writes the database — a process, a restore into
 *   its target — with {@link createPgliteDirectory} before the lock is taken (CF-4, owner decision Q163; task 2.2c):
 *   the lock's file sits beside the directory, so its parent must exist. The lock itself creates nothing, and refuses a
 *   directory whose parent is missing (`open-failed`), as do the read-only uses, which never call it.
 *
 * `node:sqlite` prints an experimental warning on Node.js 24 when first loaded, so it is loaded only when a directory is
 * locked.
 */

import { existsSync, mkdirSync, realpathSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { UmbraError } from "./errors.js";

/** The lock file's name: the data directory's, followed by this. */
export const PGLITE_LOCK_SUFFIX = ".lock.sqlite";

/** How long `BEGIN EXCLUSIVE` may wait for a racing starter's SHARED lock (decision record Q92). */
export const PGLITE_LOCK_BUSY_TIMEOUT_MS = 100;

/** SQLite's result codes for a lock another connection holds (`SQLITE_BUSY`, `SQLITE_LOCKED`). */
const BUSY_CODES: ReadonlySet<number> = new Set([5, 6]);

/** The lock this process holds for a data directory, and whether a database of the API has it open. */
interface Held {
  readonly lock: DatabaseSync;
  inUse: boolean;
}

/** Every lock this process took, by lock file: kept, and referenced, until the process ends. */
const held = new Map<string, Held>();

/** A lock {@link acquirePgliteLock} handed out: the database that opened the directory ends its use when it closes. */
export interface PgliteLockUse {
  /** The lock file. */
  readonly file: string;
  /** The directory is no longer open in this process; the lock stays held. */
  endUse(): void;
}

function openFailed(why: string, cause?: unknown): UmbraError {
  return new UmbraError(
    "database-error",
    `the PGlite data directory cannot be locked: ${why}`,
    { reason: "open-failed" },
    cause === undefined ? undefined : { cause },
  );
}

function lockHeld(holder: "this process" | "another process"): UmbraError {
  const what =
    holder === "this process"
      ? "this process already has the PGlite data directory open"
      : "another process holds the PGlite data directory's lock (an exclusive SQLite transaction on its .lock.sqlite " +
        "file, which the operating system releases when that process ends)";
  return new UmbraError(
    "writer-lock-held",
    `${what}: exactly one process writes each database (DB-11); stop the other, or give this one another directory`,
    { backend: "pglite", holder },
  );
}

/**
 * The path of the data directory `dataDir`, resolved against the working directory (PGlite's own reading of it:
 * `file://` and a bare path are a directory; `memory://` and an empty text are in memory), or undefined for one kept in
 * memory. Throws `invalid-configuration` for the browser's file systems.
 */
function directoryPath(dataDir: string): string | undefined {
  if (dataDir === "" || dataDir.startsWith("memory://")) return undefined;
  if (dataDir.startsWith("idb://") || dataDir.startsWith("opfs-ahp://")) {
    throw new UmbraError(
      "invalid-configuration",
      "idb:// and opfs-ahp:// are PGlite's browser file systems; in Node.js the database is a directory (or memory://)",
      { parameter: "database" },
    );
  }
  return resolve(dataDir.startsWith("file://") ? dataDir.slice("file://".length) : dataDir);
}

/**
 * Creates the data directory `dataDir` (read as {@link pgliteLockFile} reads it) when it does not exist, with every
 * missing parent directory, so that its lock's file can sit beside it (CF-4, owner decision Q163): what writes the
 * database calls it before the lock is taken — a process opening its configured database, a restore opening its target
 * —, never what only reads it. Does nothing for a database kept in memory or a path that exists (a file there is the
 * lock's refusal, "not a directory"). Throws `invalid-configuration` for the browser's file systems and
 * `database-error` (`reason: open-failed`) when a directory cannot be created (a file on the path, no permission); the
 * message names no path (CF-4: `database` is secret).
 */
export function createPgliteDirectory(dataDir: string): void {
  const path = directoryPath(dataDir);
  if (path === undefined || existsSync(path)) return;
  try {
    mkdirSync(path, { recursive: true });
  } catch (error) {
    throw new UmbraError(
      "database-error",
      "the PGlite data directory cannot be created: it, or one of its missing parent directories, cannot be made",
      { reason: "open-failed" },
      { cause: error },
    );
  }
}

/**
 * The lock file of the data directory `dataDir` (PGlite's own reading of it: `file://` and a bare path are a directory;
 * `memory://` and an empty text are in memory), or undefined for one kept in memory. Throws `invalid-configuration`
 * for the browser's file systems and `database-error` (`reason: open-failed`) for a path that is not a directory or
 * whose parent does not exist.
 */
export function pgliteLockFile(dataDir: string): string | undefined {
  const path = directoryPath(dataDir);
  if (path === undefined) return undefined;
  let directory: string;
  try {
    if (existsSync(path)) {
      if (!statSync(path).isDirectory()) throw openFailed("its path is not a directory");
      directory = realpathSync(path);
    } else {
      directory = join(realpathSync(dirname(path)), basename(path));
    }
  } catch (error) {
    if (error instanceof UmbraError) throw error;
    throw openFailed("its parent directory does not exist or cannot be read", error);
  }
  return `${directory}${PGLITE_LOCK_SUFFIX}`;
}

/**
 * Takes the writer lock of the data directory `dataDir` for the rest of the process's life, before PGlite opens it, or
 * resolves with undefined for a database kept in memory. Rejects with `writer-lock-held` (not retryable) when another
 * process holds it, after at most {@link PGLITE_LOCK_BUSY_TIMEOUT_MS}, or when this process has the directory open
 * already; with `database-error` (`reason: open-failed`) when the lock file cannot be opened.
 */
export async function acquirePgliteLock(dataDir: string): Promise<PgliteLockUse | undefined> {
  const file = pgliteLockFile(dataDir);
  if (file === undefined) return undefined;
  const { DatabaseSync } = await import("node:sqlite");
  // From here on nothing awaits, so no other opening in this process interleaves.
  let entry = held.get(file);
  if (entry !== undefined) {
    if (entry.inUse) throw lockHeld("this process");
    entry.inUse = true;
  } else {
    let lock: DatabaseSync;
    try {
      lock = new DatabaseSync(file);
    } catch (error) {
      throw openFailed("its lock file cannot be opened", error);
    }
    try {
      lock.exec(`PRAGMA busy_timeout = ${PGLITE_LOCK_BUSY_TIMEOUT_MS}`);
      lock.exec("BEGIN EXCLUSIVE");
    } catch (error) {
      lock.close();
      const code = (error as { errcode?: unknown }).errcode;
      if (typeof code === "number" && BUSY_CODES.has(code)) throw lockHeld("another process");
      throw openFailed("its lock file cannot be locked", error);
    }
    entry = { lock, inUse: true };
    held.set(file, entry);
  }
  const use = entry;
  return {
    file,
    endUse: () => {
      use.inUse = false;
    },
  };
}
