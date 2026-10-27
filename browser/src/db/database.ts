/**
 * Opening the database a configuration names, in the browser build, in place of `src/config/database.ts`
 * (`openspec/changes/core-arch/specs/browser/spec.md` BR-1; `specs/configuration/spec.md` CF-4, CF-9; `design.md`
 * §7, §9.2; task 16.1): the browser runs PGlite only — PostgreSQL needs a network connection a page cannot make —, in
 * memory (`pglite:memory`, the default) or in the origin's private file system (`pglite:<name>`, OPFS, PGlite's
 * `opfs-ahp://` storage), under its Web Lock (`./web-lock.ts`). The opening itself is the database API's own
 * (`openPglite`, `src/db/pglite.ts`): the development opt-in is checked first (`development-opt-in-required`), the lock
 * taken, then the engine started with the pinned start parameters.
 */

import type { CommittedHeight, Database } from "../../../src/db/api.js";
import { UmbraError } from "../../../src/db/errors.js";
import { openPglite, type PgliteOptions } from "../../../src/db/pglite.js";
import type { PlainObject } from "../../../src/config/plain-data.js";
import type { CheckedEntry } from "../../../src/config/validate.js";

/** Where a `database` setting points: in the browser, always PGlite (see the module comment). */
export type DatabaseTarget = { readonly backend: "pglite"; readonly dataDir: string };

const PGLITE = "pglite:";

/** The PGlite location of a `database` setting; `invalid-configuration` for a PostgreSQL URL. */
export function databaseTarget(database: string): DatabaseTarget {
  if (!database.startsWith(PGLITE)) {
    throw new UmbraError(
      "invalid-configuration",
      "the browser build runs PGlite only: its database is pglite:memory or pglite:<name> (the origin's private file " +
        "system), never a PostgreSQL URL",
      { parameter: "database" },
    );
  }
  const rest = database.slice(PGLITE.length);
  return { backend: "pglite", dataDir: rest === "memory" ? "memory://" : `opfs-ahp://${rest}` };
}

/** What {@link databaseOptions} and {@link openConfiguredDatabase} take besides the revision. */
export interface ConfiguredDatabaseOptions {
  readonly committedHeight: CommittedHeight;
}

/** The backend a revision's `database` names, with the options it is opened with. */
export type ConfiguredDatabase = { readonly backend: "pglite"; readonly options: PgliteOptions };

/** How the database of `entry` is opened (see the module comment). */
export function databaseOptions(entry: CheckedEntry, options: ConfiguredDatabaseOptions): ConfiguredDatabase {
  const settings = entry.settings as PlainObject;
  const { dataDir } = databaseTarget(String(settings.database));
  return {
    backend: "pglite",
    options: { dataDir, committedHeight: options.committedHeight, developmentOptIn: settings.developmentOptIn === true },
  };
}

/** Opens the database of `entry` (see the module comment). */
export async function openConfiguredDatabase(entry: CheckedEntry, options: ConfiguredDatabaseOptions): Promise<Database> {
  return openPglite(databaseOptions(entry, options).options);
}
