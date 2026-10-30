/**
 * The PostgreSQL backend in the browser build, in place of `src/db/postgres.ts`: a page cannot open a connection to a
 * PostgreSQL server, so the browser runs PGlite only (`./database.ts`). The one caller left in the bundle is a private
 * process's `publicDatabase` read directly (`src/backbone/core-private-source/public-database.ts`), and a core's
 * transport reader (`src/runner/process.ts`), which needs a PostgreSQL database; in the browser a private instance
 * reads public data through the core's transport (`coreTransport`), and a PostgreSQL `publicDatabase` refuses here.
 * [design §9.2]
 */

import type { SslMode } from "../../../src/config/database-parts.js";
import type { Database } from "../../../src/db/api.js";
import { UmbraError } from "../../../src/db/errors.js";

/** The options `src/db/postgres.ts` takes, for the same types. */
export interface PostgresOptions {
  readonly connection: PostgresConnection;
}

/** The connection `src/db/postgres.ts` takes, for the same types. */
export type PostgresConnection = {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password?: string;
  readonly name: string;
  readonly ssl: SslMode;
};

/** Refuses: there is no PostgreSQL in the browser. */
export function openPostgres(_options: PostgresOptions): Database {
  throw new UmbraError(
    "invalid-configuration",
    "the browser build has no PostgreSQL backend: a private instance reads public data through the core's transport " +
      "(coreTransport), not through publicDatabase",
    { parameter: "publicDatabase" },
  );
}
