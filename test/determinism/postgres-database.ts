import type { ConsistentRead } from "../../src/determinism/module-tables.js";
import { startPostgresServer } from "../db/postgres-server.js";

/**
 * The PostgreSQL 18 databases of the determinism suites, read through the database API's own PostgreSQL backend
 * (`src/db/postgres.ts`). Each read is the API's read handle: one `REPEATABLE READ READ ONLY` transaction, with results
 * mapped the way the database API maps them, arrays included. This file used to be a test-only adapter over the
 * `postgres` driver, with its own transaction and JSON parser; that part is retired. [DB-2]
 *
 * What stays here is what the API deliberately does not offer: setup SQL of several statements outside any read (the
 * API runs one statement per call; only the migration runner, `src/db/migrate.ts`, runs several), and the negative
 * control of the snapshot test.
 *
 * Every test database is a fresh `CREATE DATABASE` on one PostgreSQL 18 container (`../db/postgres-server.ts`). Its
 * PGlite twin, behind the same interfaces, is `pglite-database.ts`; `backends.ts` lists both.
 */

/** One empty test database. */
export interface TestDatabase {
  /** Runs setup SQL (several statements allowed) outside any read, committed when it returns. */
  exec(sql: string): Promise<void>;
  /** Runs `body` with the database API's read handle. [DB-2] */
  read<T>(body: (read: ConsistentRead) => Promise<T>): Promise<T>;
  /**
   * Runs `body` with a handle whose statements each run in a read of their own, so they may see different commits.
   * The database API forbids such a handle; it is used only as the negative control of the snapshot test. [DB-2]
   */
  readWithoutSnapshot<T>(body: (read: ConsistentRead) => Promise<T>): Promise<T>;
}

/** A PostgreSQL 18 server that hands out empty databases. */
export interface TestServer {
  create(): Promise<TestDatabase>;
  stop(): Promise<void>;
}

export async function startPostgres(): Promise<TestServer> {
  const server = await startPostgresServer();
  return {
    async create() {
      const database = await server.createDatabase();
      const db = database.open({ readConnections: 2 });
      return {
        exec: (sql) => database.exec(sql),
        read: (body) => db.read(body),
        readWithoutSnapshot: (body) => body({ query: (sql, params) => db.read((read) => read.query(sql, params)) }),
      };
    },
    stop: () => server.stop(),
  };
}
