import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import postgres, { type Sql } from "postgres";
import { POSTGRES_IMAGE } from "../postgres-image.js";
import type { Database } from "../../src/db/api.js";
import { openPostgres, type PostgresOptions } from "../../src/db/postgres.js";
import { startContainer } from "../containers.js";
import type { PostgresParts } from "../../src/config/database-parts.js";
import { connectionOfUrl, partsOfUrl } from "./connection.js";

/**
 * A PostgreSQL 18 server for the database API's tests (the repository's one image, `../postgres-image.ts`, through
 * Testcontainers, which maps it to a random free host port — Docker's ephemeral range, above 32768 — and removes the
 * container when {@link PostgresTestServer.stop} runs).
 *
 * Each test gets a fresh database (`CREATE DATABASE`). Setup and fault injection go through `admin`, a plain `postgres`
 * 3.4.9 connection that is not the database API; the database under test is opened with {@link
 * PostgresTestDatabase.open}, the API's own backend.
 */

/** One empty database on the test server. */
export interface PostgresTestDatabase {
  /** The database's URL, for the tests' own plain driver connections. */
  readonly url: string;
  /** The database's parts, as the `database` setting gives them, with `ssl` set to `disable`. [CF-4, Q167 A] */
  readonly setting: PostgresParts;
  /** A plain driver connection to the database, outside the API: setup SQL and fault injection only. */
  readonly admin: Sql;
  /** Runs setup SQL (several statements allowed) through `admin`, committed when it returns. */
  exec(sql: string): Promise<void>;
  /** Opens the API's PostgreSQL backend on this database; closed by {@link PostgresTestServer.stop} if not before. */
  open(options?: Partial<PostgresOptions>): Database;
  /** Terminates a backend with `pg_terminate_backend` and waits until PostgreSQL no longer lists it. */
  terminate(pid: number): Promise<void>;
  /**
   * Sets `[name, value]` pairs as this database's defaults — `ALTER DATABASE … SET` and `ALTER ROLE <the login> IN
   * DATABASE … SET` (a session of the login on this database takes the role's) — and returns what a new session that
   * pins nothing then starts with, for each name: the control that they are in effect. Sessions already open keep their
   * values (`admin`'s among them).
   */
  setDefaults(defaults: readonly (readonly [string, string])[]): Promise<Record<string, string>>;
}

/** A PostgreSQL 18 server that hands out empty databases. */
export interface PostgresTestServer {
  readonly container: StartedPostgreSqlContainer;
  createDatabase(): Promise<PostgresTestDatabase>;
  stop(): Promise<void>;
}

const noCommittedHeight = async (): Promise<bigint | null> => null;

/** The server's password for its login `test`. */
export const TEST_PASSWORD = "pw-umbradb-test-server";

/** How long a terminated backend may take to leave `pg_stat_activity`: it leaves at once; this is load's margin. */
const BACKEND_END_MS = 30_000;

export async function startPostgresServer(): Promise<PostgresTestServer> {
  // Each test database holds an admin connection and the API's own (a writer and its readers): room for many databases.
  const container = await startContainer(
    // A password unlike the login's name (`test`): the redaction hides a password wherever it appears, so a login
    // whose name equals it would be hidden too. [CF-4, Q167 A]
    new PostgreSqlContainer(POSTGRES_IMAGE)
      .withPassword(TEST_PASSWORD)
      .withCommand(["postgres", "-c", "max_connections=400"]),
  );
  const root = postgres(container.getConnectionUri(), { max: 1, onnotice: () => undefined });
  const admins: Sql[] = [];
  const opened: Database[] = [];
  let next = 0;
  return {
    container,
    async createDatabase() {
      const name = `api_${next++}`;
      await root.unsafe(`CREATE DATABASE ${name}`);
      const url = new URL(container.getConnectionUri());
      url.pathname = `/${name}`;
      const admin = postgres(url.toString(), { max: 1, onnotice: () => undefined });
      admins.push(admin);
      return {
        url: url.toString(),
        setting: partsOfUrl(url.toString()),
        admin,
        exec: async (text) => {
          await admin.unsafe(text).simple();
        },
        open(options) {
          const db = openPostgres({ connection: connectionOfUrl(url.toString()), committedHeight: noCommittedHeight, ...options });
          opened.push(db);
          return db;
        },
        async terminate(pid) {
          await admin.unsafe("SELECT pg_terminate_backend($1)", [pid]);
          const deadline = Date.now() + BACKEND_END_MS;
          while (Date.now() < deadline) {
            const rows = await admin.unsafe("SELECT 1 FROM pg_stat_activity WHERE pid = $1", [pid]);
            if (rows.length === 0) return;
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
          throw new Error(`backend ${pid} still listed ${BACKEND_END_MS / 1_000} s after pg_terminate_backend`);
        },
        async setDefaults(defaults) {
          if (defaults.length === 0) return {};
          for (const [setting, value] of defaults) {
            await admin.unsafe(`ALTER DATABASE ${name} SET ${setting} = '${value}'`);
            await admin.unsafe(`ALTER ROLE CURRENT_USER IN DATABASE ${name} SET ${setting} = '${value}'`);
          }
          const plain = postgres(url.toString(), { max: 1, onnotice: () => undefined });
          try {
            const shown = defaults.map(([setting]) => `current_setting('${setting}') AS "${setting}"`).join(", ");
            const [row] = await plain.unsafe(`SELECT ${shown}`);
            return { ...(row as Record<string, string>) };
          } finally {
            await plain.end({ timeout: 5 });
          }
        },
      };
    },
    async stop() {
      await Promise.allSettled(opened.map((db) => db.close()));
      await Promise.all(admins.map((admin) => admin.end({ timeout: 5 })));
      await root.end({ timeout: 5 });
      await container.stop();
    },
  };
}
