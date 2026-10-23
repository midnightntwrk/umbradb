import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import postgres, { type Sql } from "postgres";
import type { Database } from "../../src/db/api.js";
import { openPostgres, type PostgresOptions } from "../../src/db/postgres.js";

/**
 * A PostgreSQL 17 server for the database API's tests (`postgres:17-alpine` through Testcontainers, which maps it to a
 * random free host port — Docker's ephemeral range, above 32768 — and removes the container when {@link
 * PostgresTestServer.stop} runs).
 *
 * Each test gets a fresh database (`CREATE DATABASE`). Setup and fault injection go through `admin`, a plain `postgres`
 * 3.4.9 connection that is not the database API; the database under test is opened with {@link
 * PostgresTestDatabase.open}, the API's own backend.
 */

/** One empty database on the test server. */
export interface PostgresTestDatabase {
  /** The database's URL, as the `database` setting gives it (CF-4). */
  readonly url: string;
  /** A plain driver connection to the database, outside the API: setup SQL and fault injection only. */
  readonly admin: Sql;
  /** Runs setup SQL (several statements allowed) through `admin`, committed when it returns. */
  exec(sql: string): Promise<void>;
  /** Opens the API's PostgreSQL backend on this database; closed by {@link PostgresTestServer.stop} if not before. */
  open(options?: Partial<PostgresOptions>): Database;
  /** Terminates a backend with `pg_terminate_backend` and waits until PostgreSQL no longer lists it. */
  terminate(pid: number): Promise<void>;
}

/** A PostgreSQL 17 server that hands out empty databases. */
export interface PostgresTestServer {
  readonly container: StartedPostgreSqlContainer;
  createDatabase(): Promise<PostgresTestDatabase>;
  stop(): Promise<void>;
}

const noCommittedHeight = async (): Promise<bigint | null> => null;

export async function startPostgresServer(): Promise<PostgresTestServer> {
  // Each test database holds an admin connection and the API's own (a writer and its readers): room for many databases.
  const container = await new PostgreSqlContainer("postgres:17-alpine")
    .withCommand(["postgres", "-c", "max_connections=400"])
    .start();
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
        admin,
        exec: async (text) => {
          await admin.unsafe(text).simple();
        },
        open(options) {
          const db = openPostgres({ url: url.toString(), committedHeight: noCommittedHeight, ...options });
          opened.push(db);
          return db;
        },
        async terminate(pid) {
          await admin.unsafe("SELECT pg_terminate_backend($1)", [pid]);
          for (let attempt = 0; attempt < 200; attempt++) {
            const rows = await admin.unsafe("SELECT 1 FROM pg_stat_activity WHERE pid = $1", [pid]);
            if (rows.length === 0) return;
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
          throw new Error(`backend ${pid} still listed after pg_terminate_backend`);
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
