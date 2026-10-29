/**
 * Opening the database a configuration names, in the browser build, in place of `src/config/database.ts`. The browser
 * runs PGlite only, since PostgreSQL needs a network connection a page cannot make. It runs in memory
 * (`{ kind: "pglite", memory: true }`, the default) or in the origin's private file system
 * (`{ kind: "pglite", path: <name> }`, OPFS, PGlite's `opfs-ahp://` storage), under its Web Lock (`./web-lock.ts`).
 * [BR-1, CF-4, CF-9; design §7, §9.2]
 *
 * The opening itself is the database API's own (`openPglite`, `src/db/pglite.ts`): the development opt-in is checked
 * first (`development-opt-in-required`), the lock taken, then the engine started with the pinned start parameters.
 */

import type { CommittedHeight, Database } from "../../../src/db/api.js";
import { UmbraError } from "../../../src/db/errors.js";
import { openPglite, type PgliteOptions } from "../../../src/db/pglite.js";
import type { DatabaseParts } from "../../../src/config/database-parts.js";
import type { PlainObject } from "../../../src/config/plain-data.js";
import type { CheckedEntry } from "../../../src/config/validate.js";

/** Where a `database` setting points: in the browser, always PGlite (see the module comment). */
export type DatabaseTarget = { readonly backend: "pglite"; readonly dataDir: string };

/** The PGlite location of a `database` setting's parts; `invalid-configuration` for PostgreSQL's. */
export function databaseTarget(database: DatabaseParts): DatabaseTarget {
  if (database.kind !== "pglite") {
    throw new UmbraError(
      "invalid-configuration",
      'the browser build runs PGlite only: its database is { kind: "pglite", memory: true } or { kind: "pglite", ' +
        "path: <name> } (the origin's private file system), never PostgreSQL",
      { parameter: "database" },
    );
  }
  return { backend: "pglite", dataDir: "memory" in database ? "memory://" : `opfs-ahp://${database.path}` };
}

/** What {@link databaseOptions} and {@link openConfiguredDatabase} take besides the revision. */
export interface ConfiguredDatabaseOptions {
  readonly committedHeight: CommittedHeight;
  /** As in Node.js; the browser creates no directory, so nothing is told. */
  readonly log?: (line: string) => void;
}

/** The backend a revision's `database` names, with the options it is opened with. */
export type ConfiguredDatabase = { readonly backend: "pglite"; readonly options: PgliteOptions };

/** How the database of `entry` is opened (see the module comment). */
export function databaseOptions(entry: CheckedEntry, options: ConfiguredDatabaseOptions): ConfiguredDatabase {
  const settings = entry.settings as PlainObject;
  const { dataDir } = databaseTarget(settings.database as unknown as DatabaseParts);
  return {
    backend: "pglite",
    options: { dataDir, committedHeight: options.committedHeight, developmentOptIn: settings.developmentOptIn === true },
  };
}

/** Opens the database of `entry` (see the module comment). */
export async function openConfiguredDatabase(entry: CheckedEntry, options: ConfiguredDatabaseOptions): Promise<Database> {
  return openPglite(databaseOptions(entry, options).options);
}
