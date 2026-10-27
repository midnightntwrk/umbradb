/**
 * The PostgreSQL backend in the browser build, in place of `src/db/postgres.ts` (`openspec/changes/core-arch/design.md`
 * §9.2; task 16.1): a page cannot open a connection to a PostgreSQL server, so the browser runs PGlite only
 * (`./database.ts`). The one caller left in the bundle is a private process's `publicDatabase` read directly
 * (`src/backbone/core-private-source/public-database.ts`); in the browser a private instance reads public data through
 * the core's transport (`coreTransport`), and a PostgreSQL `publicDatabase` refuses here.
 */

import type { Database } from "../../../src/db/api.js";
import { UmbraError } from "../../../src/db/errors.js";

/** The options `src/db/postgres.ts` takes, for the same types. */
export interface PostgresOptions {
  readonly url: string;
}

/** Refuses: there is no PostgreSQL in the browser. */
export function openPostgres(_options: PostgresOptions): Database {
  throw new UmbraError(
    "invalid-configuration",
    "the browser build has no PostgreSQL backend: a private instance reads public data through the core's transport " +
      "(coreTransport), not through publicDatabase",
    { parameter: "publicDatabase" },
  );
}
