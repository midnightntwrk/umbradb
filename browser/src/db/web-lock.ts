/**
 * The PGlite writer lock in the browser build, in place of `src/db/pglite-lock.ts` (`openspec/changes/core-arch/specs/
 * browser/spec.md` BR-1; `specs/database-api/spec.md` DB-11; `design.md` §4, §9.2; owner decision Q50; task 16.1):
 * one worker owns each database, through a Web Locks lock named after it, taken before PGlite opens it and held for
 * the worker's life — the browser releases it when the worker ends (a reload, a closed tab, a crash), never while it
 * lives, as the operating system does the Node.js lock (`node:sqlite`'s exclusive transaction). A second tab, or a
 * second worker, on the same database refuses with `writer-lock-held` and never opens it.
 *
 * - `memory://` (and an empty location) is kept in memory, per worker: no lock.
 * - `opfs-ahp://<name>` is a database in the origin's private file system (OPFS): the lock `umbradb-database:<name>`,
 *   asked with `ifAvailable`, so a held lock refuses at once instead of waiting.
 * - Anything else — a Node.js directory, `file://`, `idb://` — is not a browser database: `invalid-configuration`.
 *
 * As in Node.js, the same worker opens a database it closed again with the lock it holds, and a second opening while
 * the first is open is `writer-lock-held` (`holder: "this process"`).
 *
 * **The negative control** (task 16.1, A129): a build made with the control `ignore-web-lock` (`browser/build.ts`)
 * takes no lock at all, so a second tab opens a second writer.
 */

import { UmbraError } from "../../../src/db/errors.js";

/** Kept for the same exports as `src/db/pglite-lock.ts`: the browser's lock is no file. */
export const PGLITE_LOCK_SUFFIX = ".lock.sqlite";

/** Kept for the same exports as `src/db/pglite-lock.ts`: a Web Lock asked with `ifAvailable` answers at once. */
export const PGLITE_LOCK_BUSY_TIMEOUT_MS = 0;

/** The prefix of a database's Web Lock's name. */
export const WEB_LOCK_PREFIX = "umbradb-database:";

/** The OPFS database names the browser build takes: a path segment of letters, digits, `.`, `_` and `-`. */
const OPFS_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

const OPFS = "opfs-ahp://";

/** A lock {@link acquirePgliteLock} handed out (as `src/db/pglite-lock.ts`'s). */
export interface PgliteLockUse {
  /** The lock's name. */
  readonly file: string;
  /** The database is no longer open in this worker; the lock stays held. */
  endUse(): void;
}

/** The locks this worker holds, by name, and whether a database of the API has each open. */
const held = new Map<string, { inUse: boolean }>();

function lockHeld(holder: "this process" | "another process"): UmbraError {
  const what =
    holder === "this process"
      ? "this worker already has the PGlite database open"
      : "another tab or worker holds the PGlite database's Web Lock (which the browser releases when that worker ends)";
  return new UmbraError(
    "writer-lock-held",
    `${what}: exactly one worker writes each database (DB-11, BR-1); close the other tab, or give this one another ` +
      "database",
    { backend: "pglite", holder },
  );
}

/**
 * The lock name of the database at `dataDir`, or undefined for one kept in memory; throws `invalid-configuration` for
 * a location that is no browser database.
 */
export function pgliteLockFile(dataDir: string): string | undefined {
  if (dataDir === "" || dataDir.startsWith("memory://")) return undefined;
  const name = dataDir.startsWith(OPFS) ? dataDir.slice(OPFS.length) : null;
  if (name === null || !OPFS_NAME.test(name)) {
    throw new UmbraError(
      "invalid-configuration",
      "the browser build keeps a database in memory ({ kind: \"pglite\", memory: true }) or in the origin's private " +
        "file system ({ kind: \"pglite\", path: <name> }, a name of letters, digits, '.', '_' and '-')",
      { parameter: "database" },
    );
  }
  return `${WEB_LOCK_PREFIX}${name}`;
}

/** Asks for the Web Lock `name` without waiting: resolves true once held (for the worker's life), false if held. */
function takeWebLock(name: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    navigator.locks
      .request(name, { mode: "exclusive", ifAvailable: true }, (lock) => {
        resolve(lock !== null);
        // Held until the worker ends: the promise never settles.
        return lock === null ? undefined : new Promise<never>(() => undefined);
      })
      .catch(reject);
  });
}

/**
 * Takes the Web Lock of the database at `dataDir` for the rest of the worker's life, before PGlite opens it, or
 * resolves with undefined for a database kept in memory. Rejects with `writer-lock-held` when another tab or worker
 * holds it, or when this worker has the database open already.
 */
export async function acquirePgliteLock(dataDir: string): Promise<PgliteLockUse | undefined> {
  const name = pgliteLockFile(dataDir);
  if (name === undefined) return undefined;
  if (__UMBRADB_BROWSER_CONTROL__ === "ignore-web-lock") return { file: name, endUse: () => undefined };
  let entry = held.get(name);
  if (entry !== undefined) {
    if (entry.inUse) throw lockHeld("this process");
    entry.inUse = true;
  } else {
    // A second opening in this worker while this one waits for the lock is refused as the first's.
    entry = { inUse: true };
    held.set(name, entry);
    let taken: boolean;
    try {
      taken = await takeWebLock(name);
    } catch (error) {
      held.delete(name);
      throw new UmbraError("database-error", "the browser's Web Locks could not be asked for the database's lock", {
        reason: "open-failed",
      }, { cause: error });
    }
    if (!taken) {
      held.delete(name);
      throw lockHeld("another process");
    }
  }
  const use = entry;
  return {
    file: name,
    endUse: () => {
      use.inUse = false;
    },
  };
}
