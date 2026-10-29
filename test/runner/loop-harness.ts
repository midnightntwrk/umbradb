import { CORE_BLOCK_COMMIT, cursorHeight, readCursor } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { BlockWriteHandle, Database, Transaction } from "../../src/db/api.js";
import { startDatabase } from "../../src/db/migrate.js";
import type { SchemaPlan } from "../../src/db/roles.js";
import { migrationPart, schemaPlan } from "../../src/modules/adapters.js";
import type { ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import { type EntryRange, type ResolvedGraph, resolveGraph } from "../../src/modules/graph.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type LoopInput } from "../../src/runner/loop.js";
import { blockFetchStandIn } from "../backbone/block-fetch-stand-in.js";
import { startPgliteServer, type PgliteTestServer } from "../db/pglite-server.js";
import { startPostgresServer, type PostgresTestServer } from "../db/postgres-server.js";
import { CORE_CHAIN, CORE_DIGEST } from "../modules/graph-fixtures.js";
import { Contexts } from "./fixtures.js";

/**
 * What the finalized loop's tests share: a database on each backend opened with the cursor table's committed height,
 * the test backbone with the real cursor table, a startup as the runner's (validated declarations, the graph from the
 * cursor, the schema plan, `startDatabase`), and a run of the loop until it waits for the in-memory source's head.
 * [RN-1, RN-2, RN-4–RN-6, RN-14; design §2, §3]
 */

/** A database for the loop, opened through the API with `cursorHeight` (the cursor table's last height). */
export interface RunnerDatabase {
  readonly db: Database;
  /**
   * How many transactions are open on the database right now, other than the test's own: on PostgreSQL the API's
   * sessions (`application_name` `umbradb`) that `pg_stat_activity` lists with a transaction; on PGlite 1 while its one
   * engine is inside a transaction, else 0.
   */
  openTransactions(): Promise<number>;
}

export interface RunnerBackend {
  readonly name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  database(): Promise<RunnerDatabase>;
}

function postgresRunner(): RunnerBackend {
  let server: PostgresTestServer | undefined;
  return {
    name: "PostgreSQL 18",
    async start() {
      server = await startPostgresServer();
    },
    async stop() {
      await server?.stop();
    },
    async database() {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      const db = database.open({ committedHeight: cursorHeight });
      return {
        db,
        async openTransactions() {
          const rows = await database.admin.unsafe(
            "SELECT count(*)::int AS open FROM pg_stat_activity WHERE datname = current_database() " +
              "AND pid <> pg_backend_pid() AND backend_type = 'client backend' AND application_name = 'umbradb' " +
              "AND xact_start IS NOT NULL",
          );
          return (rows[0] as unknown as { open: number }).open;
        },
      };
    },
  };
}

function pgliteRunner(): RunnerBackend {
  let server: PgliteTestServer | undefined;
  return {
    name: "PGlite 0.5.10",
    async start() {
      server = await startPgliteServer();
    },
    async stop() {
      await server?.stop();
    },
    async database() {
      if (server === undefined) throw new Error("backend not started");
      const database = await server.createDatabase();
      const db = await database.open({ committedHeight: cursorHeight });
      return { db, openTransactions: async () => (database.engine.isInTransaction() ? 1 : 0) };
    },
  };
}

/** PostgreSQL 18 and PGlite 0.5.10, each with direct access to its open transactions. */
export const RUNNER_BACKENDS: readonly RunnerBackend[] = [postgresRunner(), pgliteRunner()];

/**
 * The test backbone (`test/modules/graph-fixtures.ts`) with the real blocks table, `core-block-commit`
 * (`src/backbone/core-block-commit/`): `core-chain` (its items, no points), the stand-in `core-block-fetch` of
 * `test/backbone/block-fetch-stand-in.ts` (it puts the `block-header` and `ledger-version` items the blocks table's
 * row needs), the blocks table and `core-digest` (its schema, no points), in the backbone's fixed order. [RN-3]
 */
export const LOOP_BACKBONE: readonly ModuleDeclaration[] = [CORE_CHAIN, blockFetchStandIn(), CORE_BLOCK_COMMIT, CORE_DIGEST];

/** A database started as the runner starts one, and what the loop is given. */
export interface Started {
  readonly db: Database;
  readonly graph: ResolvedGraph;
  readonly plan: SchemaPlan;
  readonly contexts: Contexts;
}

/**
 * Starts `db` as the runner does: the declarations validated, the cursor read, the graph resolved from it, the schema
 * plan of its modules, and `startDatabase` with the parts in startup order — each `on-start-db` with its module's
 * process context.
 */
export async function startWith(
  db: Database,
  user: readonly ModuleDeclaration[],
  entries: readonly EntryRange[],
  options: {
    readonly start?: bigint;
    readonly backbone?: readonly ModuleDeclaration[];
    readonly contexts?: Contexts;
  } = {},
): Promise<Started> {
  const contexts = options.contexts ?? new Contexts();
  const cursor = (await db.read((read) => readCursor(read)))?.height ?? null;
  const graph = resolveGraph({
    declarations: validateDeclarations({ backbone: options.backbone ?? LOOP_BACKBONE, core: [], user }),
    start: options.start ?? 1n,
    entries,
    developmentOptIn: false,
    cursor,
  });
  const plan = schemaPlan(graph.modules);
  await startDatabase(db, {
    plan,
    parts: graph.modules.map((d) => migrationPart(d, contexts.of(d.id))),
    committedVersions: new Map(),
    handles: { height: cursor },
  });
  return { db, graph, plan, contexts };
}

/** A loop's input over `started` and `source`, stopped by `controller`. */
export function loopInput(started: Started, source: InMemoryBlockSource, controller: AbortController): LoopInput {
  return {
    db: started.db,
    graph: started.graph,
    plan: started.plan,
    source,
    contextOf: (id) => started.contexts.of(id),
    signal: controller.signal,
  };
}

/** Builds a loop of some class from its input (the real {@link FinalizedLoop}, or a negative control's). */
export type LoopClass = new (input: LoopInput) => FinalizedLoop;

/**
 * Runs a loop of `kind` over `started` and `source` until it waits for a head above `above` (`source.waiting`), then
 * stops it; rejects with the loop's failure if it fails first.
 */
export async function runUntilWaiting(
  started: Started,
  source: InMemoryBlockSource,
  above: bigint,
  kind: LoopClass = FinalizedLoop,
): Promise<void> {
  const controller = new AbortController();
  const running = new kind(loopInput(started, source, controller)).run();
  try {
    await Promise.race([source.waiting(above), running]);
  } finally {
    controller.abort();
  }
  await running;
}

/** The failure a loop of `kind` stops with; fails the test if it does not fail before waiting above `above`. */
export async function failureOf(
  started: Started,
  source: InMemoryBlockSource,
  above: bigint,
  kind: LoopClass = FinalizedLoop,
): Promise<unknown> {
  try {
    await runUntilWaiting(started, source, above, kind);
  } catch (error) {
    return error;
  }
  throw new Error("expected the loop to fail");
}

/** The cursor of `db`: the height of the last row of the cursor table, null before any. */
export async function cursorOf(db: Database): Promise<bigint | null> {
  return (await db.read((read) => readCursor(read)))?.height ?? null;
}

/** The heights in `table` (`schema.table`, a `height` column), in order. */
export async function heightsIn(db: Database, table: string): Promise<bigint[]> {
  const rows = await db.read((read) => read.query(`SELECT height FROM ${table} ORDER BY height`));
  return rows.map((row) => row.height as bigint);
}

/** One call a recording module saw: the point, and the height its arguments name (none for on-start-db). */
export interface SeenCall {
  readonly module: string;
  readonly point: PointName;
  readonly height?: bigint;
}

/** The height a callback's arguments name: the block's, the head's, the entry's; none for the others. */
function heightOf(point: PointName, args: readonly unknown[]): bigint | undefined {
  const first = args[0] as { height?: unknown } | undefined;
  if (point === "on-start-db" || point === "on-start-api" || point === "on-rollback") return undefined;
  return first?.height as bigint | undefined;
}

/**
 * A module `id` (from `test/modules/declarations.ts`'s `declaration`: one table `<schema>.rows (height)`) that registers
 * every point and records each call in `seen`; its `on-db-write` inserts the block's height into its table.
 */
export function recordingModule(
  id: string,
  seen: SeenCall[],
  base: (id: string, rest?: Partial<ModuleDeclaration>) => ModuleDeclaration,
  rest: Partial<ModuleDeclaration> = {},
): ModuleDeclaration {
  const points: Record<string, (...args: unknown[]) => Promise<void>> = {};
  for (const point of POINT_NAMES) {
    points[point] = async (_p: unknown, ...args: unknown[]) => {
      const height = heightOf(point, args);
      seen.push(height === undefined ? { module: id, point } : { module: id, point, height });
      if (point === "on-db-write") {
        const [b, w] = args as [{ height: bigint }, BlockWriteHandle];
        await w.execute(`INSERT INTO ${id.replaceAll("-", "_")}.rows (height) VALUES ($1)`, [b.height]);
      }
    };
  }
  return base(id, { ...rest, points: points as ModuleDeclaration["points"] });
}

const POINT_NAMES: readonly PointName[] = [
  "on-start-db",
  "on-start-api",
  "on-best-block",
  "on-fetch",
  "on-parse",
  "on-rollback",
  "on-finalized",
  "on-start-height",
  "on-compute",
  "on-db-write",
  "on-after-db-write",
  "on-stop-height",
];

/** A `Database` that counts the transactions asked of it and passes everything else through. */
export function countingTransactions(db: Database): { readonly db: Database; readonly count: () => number } {
  let count = 0;
  return {
    db: {
      read: (body, options) => db.read(body, options),
      transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
        count++;
        return db.transaction(body);
      },
      close: () => db.close(),
    },
    count: () => count,
  };
}

export { InMemoryBlockSource };
