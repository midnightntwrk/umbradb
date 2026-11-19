import { z } from "zod";
import type { ReadHandle } from "../../src/db/api.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";

/**
 * The equality check of fast-sync mode (`fast-sync-equality*.test.ts`, `fast-sync-failures.test.ts`,
 * `fast-sync-feature-module.test.ts`): at every height the database holds, row for row in every table of every
 * schema, what the mode off holds. A watcher module hashes the tables, each with its rows in their text form in order:
 * - `inside`: at each block's `on-compute`, the state after the block before, through the callback's read (a view of
 *   the open transaction for a block after a chunk's first, so after the block before's cursor check);
 * - `committed`: at each block's `on-after-db-write`, through its own read at the committed height.
 * Which tables are compared, and where, are the check's parameters. Imports nothing of Vitest.
 */

/** What the check compares. */
export interface EqualityOptions {
  /** The tables compared, by `schema.table`; every table of every schema unless given. */
  readonly tables?: (table: string) => boolean;
  /** Where the tables are hashed; both unless given. */
  readonly where?: readonly ("inside" | "committed")[];
}

/** The hashes the watcher took: by height, each table's hash. */
export interface Hashed {
  readonly inside: Map<bigint, Map<string, string>>;
  readonly committed: Map<bigint, Map<string, string>>;
}

/** An empty {@link Hashed}. */
export const hashed = (): Hashed => ({ inside: new Map(), committed: new Map() });

/** Every table of every schema but the system's, as `schema.table`, through `read`, filtered by `options.tables`. */
async function tablesOf(read: Pick<ReadHandle, "query">, options: EqualityOptions): Promise<string[]> {
  const rows = await read.query(
    `SELECT n.nspname || '.' || c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE c.relkind IN ('r', 'p') AND NOT c.relispartition AND n.nspname NOT IN ('pg_catalog', 'information_schema')
       AND n.nspname NOT LIKE 'pg\\_%' ORDER BY 1`,
  );
  return rows.map((row) => row.t as string).filter((table) => options.tables?.(table) ?? true);
}

/** Each table's hash through `read`: its rows' text forms in order. */
export async function hashTables(read: Pick<ReadHandle, "query">, options: EqualityOptions = {}): Promise<Map<string, string>> {
  const hashes = new Map<string, string>();
  for (const table of await tablesOf(read, options)) {
    const [schema, name] = table.split(".") as [string, string];
    const [row] = await read.query(`SELECT md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), '')) AS d FROM "${schema}"."${name}" r`);
    hashes.set(table, row?.d as string);
  }
  return hashes;
}

/** The watcher module `eq-watch` (see the module comment), recording into `seen`. */
export function equalityWatcher(seen: Hashed, options: EqualityOptions = {}): ModuleDeclaration {
  const where = options.where ?? ["inside", "committed"];
  return {
    id: "eq-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "eq-watch-rows", lifetimes: ["table"], table: { schema: "eq_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE eq_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b: BlockContext, read: ReadHandle) {
        if (where.includes("inside") && b.height > 0n) seen.inside.set(b.height - 1n, await hashTables(read, options));
      },
      async "on-after-db-write"(_p, _b: BlockContext, read: ReadHandle) {
        if (where.includes("committed") && read.height !== null) seen.committed.set(read.height, await hashTables(read, options));
      },
    },
  };
}

/** A module with no point, from a height its entry gives: its start splits the graph's ranges there. */
export const SPLITTER: ModuleDeclaration = {
  id: "splitter",
  version: "1.0.0",
  side: "public",
  requires: ["block-header"],
  provides: [{ name: "splitter-rows", lifetimes: ["table"], table: { schema: "splitter", tables: ["rows"], kind: "append-only" } }],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [{ id: "001", sql: "CREATE TABLE splitter.rows (height bigint PRIMARY KEY)" }],
  points: {},
};

/**
 * Where `got` differs from `want`: at each height both hashed, each table whose hash differs or that one of them
 * lacks; empty when they agree. `got` must have hashed at least one height.
 */
export function hashDifferences(got: ReadonlyMap<bigint, ReadonlyMap<string, string>>, want: ReadonlyMap<bigint, ReadonlyMap<string, string>>): string[] {
  const problems: string[] = [];
  let compared = 0;
  for (const [height, tables] of got) {
    const other = want.get(height);
    if (other === undefined) continue;
    compared += 1;
    const names = new Set([...tables.keys(), ...other.keys()]);
    const differing = [...names].filter((name) => tables.get(name) !== other.get(name)).sort();
    if (differing.length > 0) problems.push(`after ${height}: ${differing.join(", ")}`);
  }
  if (compared === 0) problems.push("no height hashed in both runs");
  return problems;
}
