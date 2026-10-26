import { PGlite } from "@electric-sql/pglite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Sql } from "postgres";
import { startPostgresServer, type PostgresTestServer } from "../db/postgres-server.js";

/**
 * Databases for the process's tests (task 5.3): the process opens its database itself, from the `core` entry's
 * `database` setting (CF-4, Q102), so each test gets a setting — a PostgreSQL 18 URL on a Testcontainers server, or
 * `pglite:<directory>` in a temporary directory — and a way to look at the database from outside the process.
 */

/** One empty database, by its `database` setting. */
export interface ProcessDatabase {
  /** The `database` setting (CF-4). */
  readonly setting: string;
  /**
   * Runs one statement outside the process and returns its rows: on PostgreSQL through a plain driver connection, at
   * any time; on PGlite through a plain engine on the directory, so only while no process holds it.
   */
  query(sql: string): Promise<Record<string, unknown>[]>;
  /** PostgreSQL only: the plain driver connection. */
  readonly admin?: Sql;
  /** PGlite only: the data directory. */
  readonly directory?: string;
}

/** A backend that hands out databases. */
export interface ProcessBackend {
  readonly name: string;
  readonly kind: "postgres" | "pglite";
  start(): Promise<void>;
  stop(): Promise<void>;
  database(): Promise<ProcessDatabase>;
}

function postgresBackend(): ProcessBackend {
  let server: PostgresTestServer | undefined;
  return {
    name: "PostgreSQL 18",
    kind: "postgres",
    async start() {
      server = await startPostgresServer();
    },
    async stop() {
      await server?.stop();
    },
    async database() {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      return {
        setting: database.url,
        admin: database.admin,
        query: async (sql) => [...(await database.admin.unsafe(sql))] as Record<string, unknown>[],
      };
    },
  };
}

function pgliteBackend(): ProcessBackend {
  let root: string | undefined;
  let next = 0;
  return {
    name: "PGlite 0.5.10",
    kind: "pglite",
    async start() {
      root = mkdtempSync(join(tmpdir(), "umbradb-process-"));
    },
    async stop() {
      if (root !== undefined) rmSync(root, { recursive: true, force: true });
    },
    async database() {
      if (root === undefined) throw new Error("backend not started");
      const directory = join(root, `db-${next++}`);
      return {
        setting: `pglite:${directory}`,
        directory,
        async query(sql) {
          const engine = await PGlite.create(directory);
          try {
            return (await engine.query<Record<string, unknown>>(sql)).rows;
          } finally {
            await engine.close();
          }
        },
      };
    },
  };
}

/** PostgreSQL 18 and PGlite 0.5.10. */
export const PROCESS_BACKENDS: readonly ProcessBackend[] = [postgresBackend(), pgliteBackend()];

/** `[height, value]` pairs of `sql`'s rows, whose columns `h` and `v` the query casts to integers or text. */
export async function pairs(db: ProcessDatabase, sql: string): Promise<[number, unknown][]> {
  return (await db.query(sql)).map((row) => [Number(row.h), row.v]);
}

/** The cursor of `db` from outside the process: the cursor table's highest height, null without one. */
export async function cursorIn(db: ProcessDatabase): Promise<number | null> {
  const [present] = await db.query("SELECT to_regclass('core_block_commit.blocks') IS NOT NULL AS present");
  if (present?.present !== true) return null;
  const [row] = await db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks");
  return row?.h === null || row?.h === undefined ? null : Number(row.h);
}
