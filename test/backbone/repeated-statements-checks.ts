import { z } from "zod";
import { SHADOW_SCHEMA } from "../../src/db/change-capture.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { runDag } from "./refcount-process.js";

/**
 * The statements without parameters that the engine marks as repeated at every block (`src/db/repeated-statements.ts`),
 * as a run of the real process leaves them on the writer's session of a PostgreSQL database: the original DAG fixture
 * of `./refcount-process.ts` to height {@link LAST_HEIGHT}, with a user module that reads `pg_prepared_statements`
 * through its block write handle, which runs on that session. Imports nothing of Vitest: the test and its negative
 * control (`./repeated-statements-process.test.ts`, `./repeated-statements-process.negative-control.test.ts`) run the
 * same checks.
 */

/** The run's last height: the process commits heights 0 to this one. */
export const LAST_HEIGHT = 12;

/**
 * How many times, at least, a family's statements ran by name when the last height's write looks. Each family runs once
 * a block, and the look comes before the last block's own digest, probe and drains.
 */
export const RUNS_AT_LEAST = LAST_HEIGHT - 2;

/** The marked statements, by what they read: each family's name, and which prepared texts are its own. */
export const FAMILIES: readonly { readonly name: string; readonly is: (statement: string) => boolean }[] = Object.freeze([
  {
    name: "the head read",
    is: (statement: string) =>
      statement === "SELECT height, hash, parent_hash FROM core_block_commit.blocks ORDER BY height DESC LIMIT 1",
  },
  {
    name: "the queue read",
    is: (statement: string) => statement === "SELECT node_key FROM core_ledger_state.unreferenced",
  },
  {
    name: "the digest read",
    is: (statement: string) => statement === 'SELECT "schema", "table", digest FROM core_digest.tables',
  },
  {
    name: "the shadow tables' probe",
    is: (statement: string) => statement.startsWith(`SELECT 0 AS i WHERE EXISTS (SELECT 1 FROM ${SHADOW_SCHEMA}.`),
  },
  {
    name: "a shadow table's drain",
    is: (statement: string) => statement.startsWith(`WITH d AS (DELETE FROM ${SHADOW_SCHEMA}.`),
  },
]);

/** One prepared statement of a session: its text, and how many times it ran. */
export interface PreparedStatement {
  readonly statement: string;
  readonly runs: number;
}

/** A user module that records, at each height's `on-db-write`, the statements the writer's session holds prepared. */
function preparedWatcher(seen: Map<bigint, PreparedStatement[]>): ModuleDeclaration {
  return {
    id: "prepared-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [
      {
        name: "prepared-watch-rows",
        lifetimes: ["table"],
        table: { schema: "prepared_watch", tables: ["rows"], kind: "append-only" },
      },
    ],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE prepared_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, b, w) {
        const rows = await w.query(
          "SELECT statement, (generic_plans + custom_plans)::int AS runs FROM pg_prepared_statements",
        );
        seen.set(
          b.height,
          rows.map((row) => ({ statement: row.statement as string, runs: row.runs as number })),
        );
      },
    },
  };
}

/** Runs the fixture on `db` and returns the writer session's prepared statements as the last height's write saw them. */
export async function preparedOnWriter(db: ProcessDatabase): Promise<PreparedStatement[]> {
  const seen = new Map<bigint, PreparedStatement[]>();
  const run = await runDag(db, { last: LAST_HEIGHT, user: [preparedWatcher(seen)] });
  if (run.cursor !== BigInt(LAST_HEIGHT)) {
    throw new Error(`the run stopped at ${run.cursor}, not ${LAST_HEIGHT}: ${run.lines.join("\n")}`);
  }
  const prepared = seen.get(BigInt(LAST_HEIGHT));
  if (prepared === undefined) throw new Error(`no write at height ${LAST_HEIGHT} was seen`);
  return prepared;
}

/**
 * One sentence for each family the writer's session does not run by name at every block: a family with no prepared
 * statement, one with a text prepared more than once, and one whose statements ran fewer than {@link RUNS_AT_LEAST}
 * times. Empty when every family is prepared once per text and ran at every block.
 */
export function preparedProblems(prepared: readonly PreparedStatement[]): string[] {
  const problems: string[] = [];
  for (const family of FAMILIES) {
    const own = prepared.filter((row) => family.is(row.statement));
    const texts = new Set(own.map((row) => row.statement));
    const runs = own.reduce((sum, row) => sum + row.runs, 0);
    if (own.length === 0) problems.push(`${family.name}: the writer's session holds no prepared statement of it`);
    else if (texts.size !== own.length) problems.push(`${family.name}: a text of it is prepared more than once`);
    else if (runs < RUNS_AT_LEAST) problems.push(`${family.name}: its statements ran by name ${runs} times`);
  }
  return problems;
}
