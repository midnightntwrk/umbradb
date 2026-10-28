import type { PostgresParts } from "../../src/config/database-parts.js";
import type { PostgresConnection } from "../../src/db/postgres.js";

/**
 * The tests' PostgreSQL servers as the `database` setting's parts (task 4.5; CF-4, owner decision Q167 A): a
 * Testcontainers server hands out a URL (`getConnectionUri()`), which the tests' own plain driver connections still
 * use, while the database API and the configuration take parts. The test servers serve no TLS, so `ssl` is `disable`
 * whatever the host (a remote Docker host's name would otherwise default to `require`, Q182 B).
 */

/** The parts of the PostgreSQL URL `url` (`postgres://user:password@host:port/name`), `ssl` `disable`. */
export function connectionOfUrl(url: string): PostgresConnection {
  const parsed = new URL(url);
  const password = decodeURIComponent(parsed.password);
  return {
    host: parsed.hostname.startsWith("[") ? parsed.hostname.slice(1, -1) : parsed.hostname,
    port: parsed.port === "" ? 5432 : Number(parsed.port),
    user: decodeURIComponent(parsed.username),
    ...(password === "" ? {} : { password }),
    name: decodeURIComponent(parsed.pathname.slice(1)),
    ssl: "disable",
  };
}

/** The `database` setting of the PostgreSQL URL `url`: {@link connectionOfUrl} with its `kind`. */
export function partsOfUrl(url: string): PostgresParts {
  return { kind: "postgres", ...connectionOfUrl(url) };
}
