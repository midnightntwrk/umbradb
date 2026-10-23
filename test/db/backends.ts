import type { CommittedHeight, Database } from "../../src/db/api.js";
import { type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * The backends the database API's backend-neutral tests run on (DB-1, A7). Task 2.1 builds the PostgreSQL backend;
 * task 2.2 adds PGlite here, and every suite that iterates {@link BACKENDS} then runs on both.
 */
export interface TestBackend {
  readonly name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  /** A fresh, empty database with `setup` applied outside the API, opened through the API. */
  database(setup: string, committedHeight?: CommittedHeight): Promise<TestDatabase>;
}

export interface TestDatabase {
  readonly db: Database;
  /** Runs SQL (several statements allowed) outside the API, committed when it returns. */
  exec(sql: string): Promise<void>;
}

function postgresBackend(): TestBackend {
  let server: PostgresTestServer | undefined;
  return {
    name: "PostgreSQL 17",
    async start() {
      server = await startPostgresServer();
    },
    async stop() {
      await server?.stop();
    },
    async database(setup, committedHeight) {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      await database.exec(setup);
      return {
        db: database.open(committedHeight === undefined ? {} : { committedHeight }),
        exec: (sql) => database.exec(sql),
      };
    },
  };
}

export const BACKENDS: readonly TestBackend[] = [postgresBackend()];

/** The committed height of the test schema `t`: the highest height in `t.blocks`, null when it is empty. */
export const TEST_CURSOR: CommittedHeight = async (read) => {
  const [row] = await read.query("SELECT max(height) AS height FROM t.blocks");
  return (row?.height ?? null) as bigint | null;
};

/** The test schema `t`: a cursor table and a second table each committed height writes to. */
export const TEST_SCHEMA = `
  CREATE SCHEMA t;
  CREATE TABLE t.blocks (height bigint PRIMARY KEY);
  CREATE TABLE t.rows (height bigint PRIMARY KEY, label text NOT NULL);
`;
