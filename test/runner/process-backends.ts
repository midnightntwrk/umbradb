import { PGlite } from "@electric-sql/pglite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import type { Sql } from "postgres";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { TAKE_WRITER_LOCK_SQL, WRITER_LOCK_HOLDER_SQL } from "../../src/db/writer-lock.js";
import { startPostgresServer, type PostgresTestServer } from "../db/postgres-server.js";

/**
 * Databases for the process's tests (task 5.3): the process opens its database itself, from the `core` entry's
 * `database` setting (CF-4, Q102), so each test gets a setting — the parts of a PostgreSQL 18 database on a
 * Testcontainers server, or a PGlite `path` in a temporary directory — and a way to look at the database from outside
 * the process.
 */

/** One empty database, by its `database` setting. */
export interface ProcessDatabase {
  /** The `database` setting's parts (CF-4, owner decision Q167 A). */
  readonly setting: DatabaseParts;
  /**
   * Runs one statement outside the process and returns its rows: on PostgreSQL through a plain driver connection, at
   * any time; on PGlite through a plain engine on the directory, so only while no process holds it.
   */
  query(sql: string): Promise<Record<string, unknown>[]>;
  /** PostgreSQL only: the plain driver connection. */
  readonly admin?: Sql;
  /**
   * PostgreSQL only (task 5.4's retries): terminates the backend holding the process's writer lock — its writer session
   * — with `pg_terminate_backend`, and waits until PostgreSQL no longer lists it; resolves with its pid.
   */
  terminateWriter?(): Promise<number>;
  /** PostgreSQL only: takes the writer lock on the plain driver connection (one session), as another process would. */
  takeWriterLock?(): Promise<boolean>;
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
      const { admin } = database;
      return {
        setting: database.setting,
        admin,
        query: async (sql) => [...(await admin.unsafe(sql))] as Record<string, unknown>[],
        async terminateWriter() {
          const [holder] = await admin.unsafe(WRITER_LOCK_HOLDER_SQL);
          const pid = Number(holder?.pid);
          if (!Number.isSafeInteger(pid)) throw new Error("no session holds the writer lock");
          await admin.unsafe("SELECT pg_terminate_backend($1)", [pid]);
          for (let attempt = 0; attempt < 400; attempt++) {
            if ((await admin.unsafe("SELECT 1 FROM pg_stat_activity WHERE pid = $1", [pid])).length === 0) return pid;
            await sleep(25);
          }
          throw new Error(`backend ${pid} still listed after pg_terminate_backend`);
        },
        async takeWriterLock() {
          const [row] = await admin.unsafe(TAKE_WRITER_LOCK_SQL);
          return row?.locked === true;
        },
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
        setting: { kind: "pglite", path: directory },
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

/**
 * Whether `line` is one of the lines a process logs as it opens its database (CF-4, owner decisions Q165 B, Q167 A; task
 * 4.5): the PGlite directory it created — a new PGlite database of these tests is a directory the process creates — and
 * `database: <the database's parts>`. Tests that count the other lines it logs leave these out.
 */
export const createdDirectory = (line: string): boolean =>
  line.startsWith("created a new PGlite data directory ") || line.startsWith("database: ");
