/**
 * The `database` setting given as parts. The `core` entry's `database`, a private process's `publicDatabase` and a
 * public process's `transportReader` are objects of parts, never a connection string.
 *
 * - PostgreSQL: `{ kind: "postgres", host, port, user, password, name, ssl }`.
 *   - `port` is 5432 unless given.
 *   - `password` may be absent; the driver then takes `PGPASSWORD`, as libpq does.
 *   - `ssl` is one of {@link SSL_MODES}. It defaults to `require`, or to `disable` for a loopback host
 *     ({@link LOOPBACK_HOSTS}) or a Unix socket directory (a `host` starting with `/`); see {@link defaultSsl}.
 * - PGlite: `{ kind: "pglite", path }` (a directory, relative to the working directory) or `{ kind: "pglite", memory:
 *   true }`.
 *
 * Only `password` is secret. The other parts are operational and are shown in `/config` and the log; the redaction
 * (`./redact.ts`) hides a `password` part inside an operational field.
 *
 * Imports nothing of Node.js, so the browser build uses it as it is.
 */

/** How the connection to PostgreSQL is protected: no TLS, TLS without checks, TLS checked against the roots. */
export type SslMode = "disable" | "require" | "verify-full";

/** The `ssl` modes, from least to most protected. */
export const SSL_MODES: readonly SslMode[] = Object.freeze(["disable", "require", "verify-full"]);

/** The hosts that never leave the machine, whose `ssl` defaults to `disable`. */
export const LOOPBACK_HOSTS: readonly string[] = Object.freeze(["localhost", "127.0.0.1", "::1"]);

/** PostgreSQL's port unless `port` is given. */
export const DEFAULT_POSTGRES_PORT = 5432;

/** A PostgreSQL database's parts, as parsed (every default applied). */
export interface PostgresParts {
  readonly kind: "postgres";
  /** A host name, an IP address, or a Unix socket directory (starting with `/`). */
  readonly host: string;
  readonly port: number;
  readonly user: string;
  /** Secret. When absent, none is sent unless the environment's `PGPASSWORD` gives one. */
  readonly password?: string;
  /** The database's name. */
  readonly name: string;
  readonly ssl: SslMode;
}

/** A PGlite database in a directory. */
export interface PglitePathParts {
  readonly kind: "pglite";
  /** The data directory, relative to the working directory unless absolute. */
  readonly path: string;
}

/** A PGlite database in memory (it lives as long as the process holding it). */
export interface PgliteMemoryParts {
  readonly kind: "pglite";
  readonly memory: true;
}

/** The `database` setting as parsed. */
export type DatabaseParts = PostgresParts | PglitePathParts | PgliteMemoryParts;

/** A PostgreSQL database's parts as written: `port` and `ssl` may be left to their defaults. */
export type PostgresPartsInput = Omit<PostgresParts, "port" | "ssl"> & {
  readonly port?: number;
  readonly ssl?: SslMode;
};

/** The `database` setting as written in a configuration. */
export type DatabasePartsInput = PostgresPartsInput | PglitePathParts | PgliteMemoryParts;

/**
 * `core.transportReader`: the login the transport's reads use. Its other parts are those of `database`.
 */
export interface TransportReader {
  readonly user: string;
  /** Secret. */
  readonly password?: string;
}

/** The default `ssl` for `host`: `disable` on a loopback host or a socket directory, else `require`. */
export function defaultSsl(host: string): SslMode {
  return host.startsWith("/") || LOOPBACK_HOSTS.includes(host) ? "disable" : "require";
}

/** Whether `parts` is a PGlite database kept in memory. */
export function isMemoryDatabase(parts: DatabaseParts): parts is PgliteMemoryParts {
  return parts.kind === "pglite" && "memory" in parts;
}

/**
 * How a log line or a message names the database of `parts`, without its password: `postgres umbradb@db.internal:5432/
 * indexer (ssl require)`, `pglite data/preview`, `pglite in memory`.
 */
export function databaseText(parts: DatabaseParts): string {
  if (parts.kind === "postgres") {
    const host = parts.host.includes(":") ? `[${parts.host}]` : parts.host;
    return `postgres ${parts.user}@${host}:${parts.port}/${parts.name} (ssl ${parts.ssl})`;
  }
  return "memory" in parts ? "pglite in memory" : `pglite ${parts.path}`;
}
