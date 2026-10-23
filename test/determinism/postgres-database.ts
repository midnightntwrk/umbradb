import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import postgres, { type Sql } from "postgres";
import type { ConsistentRead } from "../../src/determinism/public-tables.js";

/**
 * A test-only adapter over `postgres` 3.4.9 that gives task 1.2's tests the read handle the database API will give
 * (`openspec/changes/core-arch/design.md` §4, DB-2), until task 2.1 builds it: each read is one
 * `REPEATABLE READ READ ONLY` transaction, and results are mapped as DB-2 maps them — `bigint` to `bigint`, `bytea` to
 * `Uint8Array` (a `Buffer` is one), `numeric` to its decimal text (the driver's default), and `jsonb` parsed without
 * loss, so a JSON integer beyond ±(2^53 − 1) becomes a `bigint` (JSON.parse source text access, Node.js 24).
 *
 * Every test database is a fresh `CREATE DATABASE` on one PostgreSQL 17 container (Testcontainers maps the server to a
 * random free host port, ≥ 32768 on Docker; the container is stopped by {@link TestServer.stop}).
 */

/** One empty test database. */
export interface TestDatabase {
  /** Runs setup SQL (several statements allowed) outside any read, committed when it returns. */
  exec(sql: string): Promise<void>;
  /** Runs `body` with a read handle: one `REPEATABLE READ READ ONLY` transaction, as DB-2 specifies. */
  read<T>(body: (read: ConsistentRead) => Promise<T>): Promise<T>;
  /**
   * Runs `body` with a handle whose statements each run in their own transaction, so they may see different
   * commits — a handle DB-2 forbids, used only as the negative control of the snapshot test.
   */
  readWithoutSnapshot<T>(body: (read: ConsistentRead) => Promise<T>): Promise<T>;
}

/** A PostgreSQL 17 server that hands out empty databases. */
export interface TestServer {
  create(): Promise<TestDatabase>;
  stop(): Promise<void>;
}

/** JSON.parse with a reviver that keeps every integer outside ±(2^53 − 1) exact, as a `bigint` (DB-2). */
export function parseJsonLossless(text: string): unknown {
  const reviver = (_key: string, value: unknown, context?: { source?: string }): unknown => {
    if (typeof value === "number" && !Number.isSafeInteger(value) && /^-?[0-9]+$/.test(context?.source ?? "")) {
      return BigInt(context?.source as string);
    }
    return value;
  };
  return JSON.parse(text, reviver as (this: unknown, key: string, value: unknown) => unknown);
}

const JSON_OID = 114;
const JSONB_OID = 3802;

function connect(uri: string): Sql<{ bigint: bigint }> {
  return postgres(uri, {
    max: 4,
    onnotice: () => undefined,
    types: {
      bigint: postgres.BigInt,
      json: { to: JSONB_OID, from: [JSON_OID, JSONB_OID], serialize: JSON.stringify, parse: parseJsonLossless },
    },
  });
}

/** The `query` of a handle over one `postgres` transaction or connection. */
function handleOver(sql: Sql<{ bigint: bigint }> | postgres.TransactionSql<{ bigint: bigint }>): ConsistentRead {
  return {
    query: async (text, params) =>
      [...(await sql.unsafe(text, (params ?? []) as postgres.ParameterOrJSON<never>[]))] as Record<string, unknown>[],
  };
}

export async function startPostgres(): Promise<TestServer> {
  const container: StartedPostgreSqlContainer = await new PostgreSqlContainer("postgres:17-alpine").start();
  const admin = connect(container.getConnectionUri());
  const clients: Sql<{ bigint: bigint }>[] = [];
  let next = 0;
  return {
    async create() {
      const name = `contents_${next++}`;
      await admin.unsafe(`CREATE DATABASE ${name}`);
      const url = new URL(container.getConnectionUri());
      url.pathname = `/${name}`;
      const sql = connect(url.toString());
      clients.push(sql);
      return {
        exec: async (text) => {
          await sql.unsafe(text).simple();
        },
        read: async <T>(body: (read: ConsistentRead) => Promise<T>): Promise<T> => {
          let result: T | undefined;
          await sql.begin("ISOLATION LEVEL REPEATABLE READ READ ONLY", async (tx) => {
            result = await body(handleOver(tx));
          });
          return result as T;
        },
        readWithoutSnapshot: (body) => body(handleOver(sql)),
      };
    },
    async stop() {
      await Promise.all(clients.map((sql) => sql.end({ timeout: 5 })));
      await admin.end({ timeout: 5 });
      await container.stop();
    },
  };
}
