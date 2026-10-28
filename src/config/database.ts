/**
 * Opening the database a configuration names (`openspec/changes/core-arch/specs/configuration/spec.md` CF-4, CF-9;
 * `specs/database-api/spec.md` DB-1, DB-12; `design.md` §7; task 2.5's note (c)): the `database` setting of the
 * process's `core` revision (`./process.ts`, decision record Q102 resolved A), given as parts (owner decision Q167 A,
 * task 4.5; `./database-parts.ts`), chooses the backend — `{ kind: "pglite", memory: true }` an in-memory
 * PGlite database, `{ kind: "pglite", path }` one in that directory (a relative one resolving against the working
 * directory, as PGlite and its lock do), `{ kind: "postgres", … }` PostgreSQL with its host, port, login, name and
 * `ssl` — and the revision's `developmentOptIn` and `fullPageWritesOffAllowed` go to the backend that takes them.
 *
 * CF-9's PGlite half is the backend's own: `openPglite` refuses without the development opt-in before anything is
 * opened or created (`development-opt-in-required`, `details { feature: "pglite" }`, task 2.5), so nothing here checks
 * it again — and a PGlite `path` is created here, with any missing parent directory, under the opt-in only,
 * before `openPglite` takes its writer lock beside the directory (CF-4, owner decision Q163; task 2.2c:
 * `createPgliteDirectory`), and the process logs that it did, naming the path as configured (owner decisions Q165 B,
 * Q167 A). Node.js only (`openPglite`'s lock reads the file system); the browser build opens its own
 * (task 16.x).
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

/** The backend and location of a `database` setting's parts, as task 4.5's schema gives them (defaults applied). */
export function databaseTarget(database: DatabaseParts): DatabaseTarget {
  if (database.kind === "postgres") {
    const { kind: _kind, ...connection } = database;
    return { backend: "postgres", connection };
  }
  return { backend: "pglite", dataDir: "memory" in database ? "memory://" : database.path };
}

/** What {@link databaseOptions} and {@link openConfiguredDatabase} take besides the revision. */
export interface ConfiguredDatabaseOptions {
  /** How a read learns its committed height (DB-2): the block source's cursor (tasks 5.2, 10.2). */
  readonly committedHeight: CommittedHeight;
  /** Where the line saying a PGlite directory was created goes (Q165 B); nowhere unless given. */
  readonly log?: (line: string) => void;
}

/** The backend a revision's `database` names, with the options it is opened with. */
export type ConfiguredDatabase =
  | { readonly backend: "pglite"; readonly options: PgliteOptions }
  | { readonly backend: "postgres"; readonly options: PostgresOptions };

/**
 * How the database of `entry` — the process's `core` revision (`processCoreEntry`), its settings parsed with every
 * default (task 4.2) — is opened: on the backend its `database` names, PGlite with the revision's `developmentOptIn`,
 * PostgreSQL with its `fullPageWritesOffAllowed` (the durability probe's override, DB-12).
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
 * Opens the database of `entry` as {@link databaseOptions} says: PGlite refuses without the development opt-in (CF-9),
 * and under it a directory that does not exist is created first with its missing parents (CF-4, Q163), which
 * `options.log` is told, naming the path as configured (Q165 B, Q167 A); PostgreSQL makes no connection until one is
 * needed. Rejects with the backends' refusals and failures (`development-opt-in-required`, `writer-lock-held`,
 * `database-error`, `invalid-configuration`).
 */
export async function openConfiguredDatabase(
  entry: CheckedEntry,
  options: ConfiguredDatabaseOptions,
): Promise<Database> {
  const configured = databaseOptions(entry, options);
  if (configured.backend === "postgres") return openPostgres(configured.options);
  // Without the opt-in nothing is created: `openPglite` refuses first (CF-9).
  if (configured.options.developmentOptIn) {
    const created = createPgliteDirectory(configured.options.dataDir);
    if (created !== null) options.log?.(createdDirectoryLine(configured.options.dataDir, created));
  }
  return openPglite(configured.options);
}
