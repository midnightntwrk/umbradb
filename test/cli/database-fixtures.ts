import { existsSync, mkdtempSync, rmSync } from "node:fs";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import postgres from "postgres";
import { CORE_BLOCK_COMMIT, cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { Database } from "../../src/db/api.js";
import { openPgliteOn, PGLITE_START_PARAMS } from "../../src/db/pglite.js";
import { startup } from "../config/history-startup.js";
import { type PostgresTestDatabase, type PostgresTestServer, startPostgresServer } from "../db/postgres-server.js";

/**
 * Databases for the `--database` tests of `umbradb config check`. They run on PostgreSQL 18 (the repository's one
 * image through Testcontainers, `../db/postgres-server.ts`) and on PGlite 0.5.10 (a data directory on disk, which
 * another process, such as the command in a child process, can open). Each holds:
 * - a configuration history recorded by a startup standing in for the runner's (`../config/history-startup.ts`, with
 *   `core-block-commit`, whose `core_block_commit.blocks` holds the cursor);
 * - committed blocks up to a cursor, as a process leaves its database.
 * [A35, CF-10]
 *
 * A {@link Snapshot} is what the tests compare before and after a check: every table's row count, and the rows of
 * `core_chain.migrations` and `core_chain.config` with the transaction that wrote each (`xmin`), each list sorted.
 * [A35]
 *
 * Everything here reads and writes outside the command. The PGlite databases are opened through `openPgliteOn`, which
 * takes no operating-system lock, so the command (in this process or another) takes it as it would on a real database.
 */

/** "Unchanged": every table and its row count, and the rows of the two `core_chain` tables with their `xmin`. [A35] */
export interface Snapshot {
  /** Whether a database exists there at all (a PGlite directory may not). */
  readonly exists: boolean;
  readonly tables: Readonly<Record<string, string>>;
  readonly migrations: readonly string[];
  readonly config: readonly string[];
}

/** A database the command checks. */
export interface CheckTarget {
  /** The database's parts, as a configuration file's `database` names it (`--database` takes no value). [Q167 A] */
  readonly database: DatabaseParts;
  /** Records the history of `entries` on a new database (cursor null), then commits blocks 0 to `cursor` (none: null). */
  setup(entries: readonly unknown[], cursor: bigint | null): Promise<void>;
  snapshot(): Promise<Snapshot>;
  /** Runs `body` on the database through the API (the negative controls' writes), then closes it. */
  withDatabase<T>(body: (db: Database) => Promise<T>): Promise<T>;
}

export interface CliBackend {
  readonly name: string;
  /** The password in {@link CheckTarget.database}, which no output may hold; null for PGlite. */
  readonly password: string | null;
  start(): Promise<void>;
  stop(): Promise<void>;
  /** A new database, empty (PostgreSQL) or not yet created (PGlite). */
  target(): Promise<CheckTarget>;
}

const TABLES_SQL = `SELECT quote_ident(n.nspname) || '.' || quote_ident(c.relname) AS name
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r', 'p') AND n.nspname NOT IN ('pg_catalog', 'information_schema')
    AND n.nspname NOT LIKE 'pg_toast%'`;

const rowsSql = (table: string) => `SELECT row_to_json(t)::text || ' xmin ' || t.xmin::text AS row FROM ${table} t`;

/**
 * Commits the blocks 0 to `cursor` into `core_block_commit.blocks` (hash and parent hash from the height; the
 * `spec_version`, `ledger_version` and `block_time` columns fixed).
 */
const blocksSql = (cursor: bigint) =>
  `INSERT INTO core_block_commit.blocks (height, hash, parent_hash, spec_version, ledger_version, block_time)
   SELECT g, decode(lpad(to_hex(g + 1), 64, '0'), 'hex'), decode(lpad(to_hex(g), 64, '0'), 'hex'), 2000000, 'v9',
     timestamptz '2025-06-15T15:06:40Z' + g * interval '6 seconds'
   FROM generate_series(0, ${cursor}) AS g`;

/** The snapshot through `query`, which runs one statement outside the API and returns its rows. */
async function snapshotWith(query: (sql: string) => Promise<Record<string, unknown>[]>): Promise<Snapshot> {
  const tables: Record<string, string> = {};
  const names = (await query(TABLES_SQL)).map(({ name }) => String(name)).sort();
  for (const name of names) {
    const [row] = await query(`SELECT count(*)::text AS n FROM ${name}`);
    tables[name] = String(row?.n);
  }
  const rows = async (table: string) =>
    table in tables ? (await query(rowsSql(table))).map((row) => String(row.row)).sort() : [];
  return { exists: true, tables, migrations: await rows("core_chain.migrations"), config: await rows("core_chain.config") };
}

/** Records the history of `entries` (a startup on a new database), then commits the blocks 0 to `cursor`, if any. */
async function record(db: Database, entries: readonly unknown[], cursor: bigint | null): Promise<void> {
  await startup(db, { entries, user: [], cursor: null, backbone: [CORE_BLOCK_COMMIT] });
  if (cursor === null) return;
  await db.transaction(async (tx) => {
    await tx.execute(blocksSql(cursor));
  });
}

/** PostgreSQL 18: a database per target, checked through a superuser login whose password is distinctive. */
export function postgresCliBackend(): CliBackend {
  const password = "pw-4-4-DATABASE";
  let server: PostgresTestServer | undefined;
  return {
    name: "PostgreSQL 18",
    password,
    async start() {
      server = await startPostgresServer();
      const root = postgres(server.container.getConnectionUri(), { max: 1, onnotice: () => undefined });
      try {
        await root.unsafe(`CREATE ROLE checker LOGIN SUPERUSER PASSWORD '${password}'`);
      } finally {
        await root.end({ timeout: 5 });
      }
    },
    async stop() {
      await server?.stop();
    },
    async target() {
      if (server === undefined) throw new Error("backend not started");
      const database: PostgresTestDatabase = await server.createDatabase();
      const open = () => database.open({ committedHeight: cursorHeight });
      return {
        database: { ...database.setting, user: "checker", password },
        async setup(entries, cursor) {
          const db = open();
          try {
            await record(db, entries, cursor);
          } finally {
            await db.close();
          }
        },
        snapshot: () => snapshotWith(async (sql) => [...(await database.admin.unsafe(sql))]),
        async withDatabase(body) {
          const db = open();
          try {
            return await body(db);
          } finally {
            await db.close();
          }
        },
      };
    },
  };
}

/** PGlite 0.5.10: a data directory on disk per target, under a temporary directory removed by `stop`. */
export function pgliteCliBackend(): CliBackend {
  let root = "";
  let next = 0;
  const openOn = async (dataDir: string): Promise<Database> => {
    const engine = await PGlite.create(dataDir, { startParams: [...PGLITE_START_PARAMS] });
    return openPgliteOn(engine, { committedHeight: cursorHeight });
  };
  return {
    name: "PGlite 0.5.10",
    password: null,
    async start() {
      root = mkdtempSync(join(tmpdir(), "umbradb-cli-pglite-"));
    },
    async stop() {
      if (root !== "") rmSync(root, { recursive: true, force: true });
    },
    async target() {
      const dataDir = join(root, `data-${next++}`);
      const withDatabase = async <T>(body: (db: Database) => Promise<T>): Promise<T> => {
        const db = await openOn(dataDir);
        try {
          return await body(db);
        } finally {
          await db.close();
        }
      };
      return {
        database: { kind: "pglite", path: dataDir },
        setup: (entries, cursor) => withDatabase((db) => record(db, entries, cursor)),
        async snapshot() {
          if (!existsSync(join(dataDir, "PG_VERSION"))) return { exists: false, tables: {}, migrations: [], config: [] };
          const engine = await PGlite.create(dataDir);
          try {
            return await snapshotWith(async (sql) => (await engine.query<Record<string, unknown>>(sql)).rows);
          } finally {
            await engine.close();
          }
        },
        withDatabase,
      };
    },
  };
}

/** Both backends, as the database tests iterate them. */
export const CLI_BACKENDS: readonly (() => CliBackend)[] = [postgresCliBackend, pgliteCliBackend];
