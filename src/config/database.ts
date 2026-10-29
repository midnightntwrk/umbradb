/**
 * Opening the database a configuration names. The `database` setting of the process's `core` revision
 * (`./process.ts`) is given as parts (`./database-parts.ts`) and chooses the backend:
 * - `{ kind: "pglite", memory: true }`: an in-memory PGlite database;
 * - `{ kind: "pglite", path }`: a PGlite database in that directory (a relative path resolves against the working
 *   directory, as PGlite and its lock do);
 * - `{ kind: "postgres", … }`: PostgreSQL, with its host, port, login, name and `ssl`.
 *
 * The revision's `developmentOptIn` and `fullPageWritesOffAllowed` go to the backend that takes them.
 * [CF-4, DB-1, DB-12, Q102, Q167 A; design §7]
 *
 * The backend itself enforces the development opt-in for PGlite: `openPglite` refuses without it before anything is
 * opened or created (`development-opt-in-required`, `details { feature: "pglite" }`), so nothing here checks it again.
 * [CF-9]
 *
 * Under the opt-in only, a PGlite `path` is created here, with any missing parent directory, before `openPglite` takes
 * its writer lock beside the directory (`createPgliteDirectory`). The process logs that it did, naming the path as
 * configured. [CF-4, Q163, Q165 B, Q167 A]
 *
 * Node.js only, since `openPglite`'s lock reads the file system; the browser build opens its own database.
 */

import type { CommittedHeight, Database } from "../db/api.js";
import { openPglite, type PgliteOptions } from "../db/pglite.js";
import { createdDirectoryLine, createPgliteDirectory } from "../db/pglite-lock.js";
import { openPostgres, type PostgresConnection, type PostgresOptions } from "../db/postgres.js";
import type { DatabaseParts } from "./database-parts.js";
import type { PlainObject } from "./plain-data.js";
import type { CheckedEntry } from "./validate.js";

/** Where a `database` setting points. */
export type DatabaseTarget =
  | { readonly backend: "pglite"; readonly dataDir: string }
  | { readonly backend: "postgres"; readonly connection: PostgresConnection };

/** The backend and location of a `database` setting's parts, as its schema parses them (defaults applied). */
export function databaseTarget(database: DatabaseParts): DatabaseTarget {
  if (database.kind === "postgres") {
    const { kind: _kind, ...connection } = database;
    return { backend: "postgres", connection };
  }
  return { backend: "pglite", dataDir: "memory" in database ? "memory://" : database.path };
}

/** What {@link databaseOptions} and {@link openConfiguredDatabase} take besides the revision. */
export interface ConfiguredDatabaseOptions {
  /** How a read learns its committed height: the block source's cursor. [DB-2] */
  readonly committedHeight: CommittedHeight;
  /** Where the line saying a PGlite directory was created goes; nowhere unless given. [Q165 B] */
  readonly log?: (line: string) => void;
}

/** The backend a revision's `database` names, with the options it is opened with. */
export type ConfiguredDatabase =
  | { readonly backend: "pglite"; readonly options: PgliteOptions }
  | { readonly backend: "postgres"; readonly options: PostgresOptions };

/**
 * How the database of `entry` is opened. `entry` is the process's `core` revision (`processCoreEntry`), its settings
 * parsed with every default. The database opens on the backend its `database` names: PGlite with the revision's
 * `developmentOptIn`, PostgreSQL with its `fullPageWritesOffAllowed` (the durability probe's override). [DB-12]
 */
export function databaseOptions(entry: CheckedEntry, options: ConfiguredDatabaseOptions): ConfiguredDatabase {
  // A revision of the build's version, as `processCoreEntry` gives it, always has its parsed settings.
  const settings = entry.settings as PlainObject;
  const target = databaseTarget(settings.database as unknown as DatabaseParts);
  const { committedHeight } = options;
  if (target.backend === "pglite") {
    const developmentOptIn = settings.developmentOptIn === true;
    return { backend: "pglite", options: { dataDir: target.dataDir, committedHeight, developmentOptIn } };
  }
  const fullPageWritesOffAllowed = settings.fullPageWritesOffAllowed === true;
  return { backend: "postgres", options: { connection: target.connection, committedHeight, fullPageWritesOffAllowed } };
}

/**
 * Opens the database of `entry` as {@link databaseOptions} says.
 * - PGlite refuses without the development opt-in. [CF-9]
 * - Under the opt-in, a PGlite directory that does not exist is created first, with its missing parents, and
 *   `options.log` is told, naming the path as configured. [CF-4, Q163, Q165 B, Q167 A]
 * - PostgreSQL makes no connection until one is needed.
 *
 * Rejects with the backends' refusals and failures (`development-opt-in-required`, `writer-lock-held`,
 * `database-error`, `invalid-configuration`).
 */
export async function openConfiguredDatabase(
  entry: CheckedEntry,
  options: ConfiguredDatabaseOptions,
): Promise<Database> {
  const configured = databaseOptions(entry, options);
  if (configured.backend === "postgres") return openPostgres(configured.options);
  // Without the opt-in nothing is created: `openPglite` refuses first. [CF-9]
  if (configured.options.developmentOptIn) {
    const created = createPgliteDirectory(configured.options.dataDir);
    if (created !== null) options.log?.(createdDirectoryLine(configured.options.dataDir, created));
  }
  return openPglite(configured.options);
}
