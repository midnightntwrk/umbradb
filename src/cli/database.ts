/**
 * Reading a database for `umbradb config check --database` (`openspec/changes/core-arch/specs/configuration/spec.md`
 * CF-10; `design.md` §7; task 2.5's note (c), task 4.3's note (a)) — the database the file's `core` revision configures
 * (owner decision Q167 A, task 4.5: the flag takes no value) —: the cursor and the rows of
 * `core_chain.config`, read read-only — no migration, no write, no writer lock — in one read, so the two are of one
 * committed height.
 *
 * - **PostgreSQL:** the database API's PostgreSQL backend with one read connection; only `Database.read` runs
 *   (`BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY` … `ROLLBACK`, DB-2), so the writer session is never opened and
 *   the writer lock never taken: the check runs beside a process writing the same database.
 * - **PGlite:** only under the development opt-in, which comes from the configuration file — the process's `core`
 *   revision (decision record Q102) — and refuses before anything is opened (CF-9, `development-opt-in-required`). A
 *   directory that holds no PGlite database yet (no `PG_VERSION`) is a new database, which startup would create: it is
 *   neither opened nor created, and reads as one (no cursor, no history), since opening it would run PGlite's `initdb`
 *   there. Otherwise the backend opens it as the process does, taking the directory's operating-system lock (DB-11): a
 *   database another process has open is refused with `writer-lock-held`. PGlite has no read-only mode: opening,
 *   reading and closing the directory change PostgreSQL's own files in it (probed on 0.5.10: hint bits on the pages
 *   read, the relation cache's init files, `pg_control`, the write-ahead log), as any read and restart does on
 *   PostgreSQL, but no statement writes a row, a table or a migration — the read is the same read-only transaction. A
 *   relative directory is read from the working directory. A PGlite database in memory is refused by the command (it
 *   exists only inside its own process).
 *
 * The cursor is `core-block-commit`'s (`core_block_commit.blocks`, task 5.2; task 10.2 completes the table), read as
 * the database API's committed height; the rows by `readHistory` (none before `core_chain.config` exists).
 */

import { join, resolve } from "node:path";
import { cursorHeight } from "../backbone/core-block-commit/core-block-commit.js";
import { readHistory } from "../backbone/core-chain/history.js";
import type { HistoryRow } from "../config/history.js";
import { databaseTarget } from "../config/database.js";
import type { DatabaseParts } from "../config/database-parts.js";
import type { Database } from "../db/api.js";
import { pgliteNeedsDevelopmentOptIn } from "../db/durability-probe.js";
import { openPglite } from "../db/pglite.js";
import { openPostgres } from "../db/postgres.js";
import { isRegularFile } from "./type-check.js";

/** What a database holds for the history checks. */
export type DatabaseState =
  /** Read: its cursor (null when nothing is committed) and its history's rows. */
  | { readonly kind: "read"; readonly cursor: bigint | null; readonly history: readonly HistoryRow[] }
  /** A PGlite directory with no database in it yet: a new database, not opened. */
  | { readonly kind: "absent" };

/** How {@link readDatabaseState} reads. */
export interface ReadDatabaseOptions {
  /** The directory a relative PGlite directory is read from. */
  readonly cwd: string;
  /** The development opt-in of the process's `core` revision (Q102): PGlite opens only under it. */
  readonly developmentOptIn: boolean;
}

/** The file whose presence tells that a PGlite directory holds a database (PGlite's own test before its `initdb`). */
const PGLITE_DATABASE_MARK = "PG_VERSION";

/** Opens the database of `database` for reading only, or tells that no PGlite database is there yet. */
async function open(database: DatabaseParts, options: ReadDatabaseOptions): Promise<Database | null> {
  const target = databaseTarget(database);
  if (target.backend === "postgres") {
    return openPostgres({ connection: target.connection, committedHeight: cursorHeight, readConnections: 1 });
  }
  if (!options.developmentOptIn) throw pgliteNeedsDevelopmentOptIn();
  const dataDir = resolve(options.cwd, target.dataDir);
  if (!isRegularFile(join(dataDir, PGLITE_DATABASE_MARK))) return null;
  return openPglite({ dataDir, committedHeight: cursorHeight, developmentOptIn: true });
}

/**
 * Reads the cursor and the history of the database of `database` (see the module comment), read-only, and closes it.
 * Rejects with the backends' refusals and failures (`development-opt-in-required`, `writer-lock-held`,
 * `connection-lost`, `database-error`).
 */
export async function readDatabaseState(database: DatabaseParts, options: ReadDatabaseOptions): Promise<DatabaseState> {
  const db = await open(database, options);
  if (db === null) return Object.freeze({ kind: "absent" });
  try {
    return await db.read(async (read) =>
      Object.freeze({ kind: "read" as const, cursor: read.height, history: Object.freeze(await readHistory(read)) }),
    );
  } finally {
    await db.close();
  }
}
