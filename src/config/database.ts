/**
 * Opening the database a configuration names. The `database` setting of the process's `core` revision
 * (`./process.ts`) is given as parts (`./database-parts.ts`) and chooses the backend:
 * - `{ kind: "pglite", memory: true }`: an in-memory PGlite database;
 * - `{ kind: "pglite", path }`: a PGlite database in that directory, a relative path resolved against the process's
 *   `cwd` ({@link ConfiguredDatabaseOptions.cwd}), never the host program's own working directory;
 * - `{ kind: "postgres", … }`: PostgreSQL, with its host, port, login, name and `ssl`.
 *
 * The revision's `developmentOptIn` and `fullPageWritesOffAllowed` go to the backend that takes them.
 *
 * The backend itself enforces the development opt-in for PGlite: `openPglite` refuses without it before anything is
 * opened or created (`development-opt-in-required`, `details { feature: "pglite" }`), so nothing here checks it again.
 *
 * Under the opt-in only, a PGlite `path` is created here, with any missing parent directory, before `openPglite` takes
 * its writer lock beside the directory (`createPgliteDirectory`). The process logs that it did, naming the path as
 * configured.
 *
 * Node.js only, since `openPglite`'s lock reads the file system; the browser build opens its own database.
 */

import { resolve } from "node:path";
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

/**
 * The data directory PGlite opens for the configured `dataDir`: a path (bare or `file://`) resolved against `cwd`;
 * any other URL (`memory://`, the browser's `idb://` and `opfs-ahp://`, which the lock refuses) as it is.
 */
export function pgliteDirectory(dataDir: string, cwd: string): string {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(dataDir) && !dataDir.startsWith("file://")) return dataDir;
  return resolve(cwd, dataDir.startsWith("file://") ? dataDir.slice("file://".length) : dataDir);
}

/** What {@link databaseOptions} and {@link openConfiguredDatabase} take besides the revision. */
export interface ConfiguredDatabaseOptions {
  /** How a read learns its committed height: the block source's cursor. */
  readonly committedHeight: CommittedHeight;
  /** The base of a relative PGlite `path`: the process's working directory (`EngineInput.cwd`). */
  readonly cwd: string;
  /** Where the line saying a PGlite directory was created goes; nowhere unless given. */
  readonly log?: (line: string) => void;
}

/** The backend a revision's `database` names, with the options it is opened with. */
export type ConfiguredDatabase =
  | { readonly backend: "pglite"; readonly options: PgliteOptions }
  | { readonly backend: "postgres"; readonly options: PostgresOptions };

/**
 * How the database of `entry` is opened. `entry` is the process's `core` revision (`processCoreEntry`), its settings
 * parsed with every default. The database opens on the backend its `database` names: PGlite with the revision's
 * `developmentOptIn`, PostgreSQL with its `fullPageWritesOffAllowed` (the durability probe's override).
 */
export function databaseOptions(entry: CheckedEntry, options: ConfiguredDatabaseOptions): ConfiguredDatabase {
  // A revision of the build's version, as `processCoreEntry` gives it, always has its parsed settings.
  const settings = entry.settings as PlainObject;
  const target = databaseTarget(settings.database as unknown as DatabaseParts);
  const { committedHeight } = options;
  if (target.backend === "pglite") {
    const developmentOptIn = settings.developmentOptIn === true;
    const dataDir = pgliteDirectory(target.dataDir, options.cwd);
    return { backend: "pglite", options: { dataDir, committedHeight, developmentOptIn } };
  }
  const fullPageWritesOffAllowed = settings.fullPageWritesOffAllowed === true;
  return { backend: "postgres", options: { connection: target.connection, committedHeight, fullPageWritesOffAllowed } };
}

/**
 * Opens the database of `entry` as {@link databaseOptions} says.
 * - PGlite refuses without the development opt-in.
 * - Under the opt-in, a PGlite directory that does not exist is created first, with its missing parents, and
 *   `options.log` is told, naming the path as configured.
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
  // Without the opt-in nothing is created: `openPglite` refuses first.
  if (configured.options.developmentOptIn) {
    const created = createPgliteDirectory(configured.options.dataDir);
    // The line names the path as configured, so a mistyped one is seen as written.
    const written = databaseTarget(entry.settings?.database as unknown as DatabaseParts);
    if (created !== null) options.log?.(createdDirectoryLine(written.backend === "pglite" ? written.dataDir : "", created));
  }
  return openPglite(configured.options);
}
