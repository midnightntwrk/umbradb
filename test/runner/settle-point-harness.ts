import type { Database, ReadHandle, Transaction } from "../../src/db/api.js";
import { schemaName } from "../../src/db/roles.js";
import type { BlockRun, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import { InMemoryBlockSource, type InMemorySourceOptions } from "../../src/runner/in-memory-source.js";
import { declaration } from "../modules/declarations.js";

/**
 * What the tests of the `on-settle` point share (`settle-point.test.ts` and its negative control): the modules `alpha`
 * and `beta`, a database that logs each transaction's `BEGIN` and its end, a block source that logs each read of its
 * cursor, and the order a height's callbacks and its block transaction keep.
 *
 * Each module writes its row of the block at `on-db-write` (`<schema>.rows`). At `on-settle` it counts the rows of the
 * run that the block's `on-db-write` callbacks wrote and stores that count in `<schema>.settled`, at the run's last
 * height; `alpha` counts its own rows, `beta` (which requires `alpha`'s table) its own and `alpha`'s. At
 * `on-after-db-write` each reads its `settled` row of the height back.
 */

/** The heights the tests process first: 1 to `HEAD`. */
export const HEAD = 3n;

/** The two modules, in the order `on-db-write` and `on-settle` call them. */
export const MODULES = ["alpha", "beta"] as const;

/** What the modules saw. */
export interface Seen {
  /**
   * The calls, as `<module> <point>@<height>` (`@<first>..<last>` at `on-settle`), each transaction's `BEGIN` and its
   * end (`COMMIT`, or `ROLLBACK` when it failed), and each read of the block source's cursor (`cursor`: a run's first,
   * and the check before each block's `COMMIT`), in the order they happened.
   */
  readonly log: string[];
  /** Each `on-settle` call's run, as given, by module. */
  readonly runs: { readonly module: string; readonly run: BlockRun; readonly args: number }[];
  /** At each `on-after-db-write`: `<module> read settled@<height>: <count>`, or `none` when no row was there. */
  readonly settled: string[];
}

/** A fault to throw once, after its callback's work, keyed `<module> <point>@<height>`. */
export type Faults = Map<string, unknown>;

/** A new, empty {@link Seen}. */
export const seen = (): Seen => ({ log: [], runs: [], settled: [] });

/** Throws the fault planted for `key`, once. */
function fault(faults: Faults, key: string): void {
  if (!faults.has(key)) return;
  const error = faults.get(key);
  faults.delete(key);
  throw error;
}

/**
 * Module `id` (see the module comment): `on-parse`, `on-compute`, `on-db-write`, `on-settle` and `on-after-db-write`
 * logged in `seen`, each throwing its fault of `faults` after its work; `counts` the modules whose rows its
 * `on-settle` counts.
 */
function module(id: string, counts: readonly string[], seen: Seen, faults: Faults, requires: string[]): ModuleDeclaration {
  const schema = schemaName(id);
  const note = (point: PointName, at: string) => {
    seen.log.push(`${id} ${point}@${at}`);
    fault(faults, `${id} ${point}@${at}`);
  };
  const counted = counts
    .map((other) => `(SELECT count(*) FROM ${schemaName(other)}.rows WHERE height BETWEEN $1::bigint AND $2::bigint)`)
    .join(" + ");
  return declaration(id, {
    requires: ["block-header", ...requires],
    provides: [
      { name: `${id}-rows`, lifetimes: ["table"], table: { schema, tables: ["rows", "settled"], kind: "append-only" } },
    ],
    migrations: [
      {
        id: "001",
        sql:
          `CREATE TABLE ${schema}.rows (height bigint PRIMARY KEY);\n` +
          `CREATE TABLE ${schema}.settled (height bigint PRIMARY KEY, block_rows integer NOT NULL);`,
      },
    ],
    points: {
      async "on-parse"(_p, b) {
        note("on-parse", `${b.height}`);
      },
      async "on-compute"(_p, b) {
        note("on-compute", `${b.height}`);
      },
      async "on-db-write"(_p, b, w) {
        await w.execute(`INSERT INTO ${schema}.rows (height) VALUES ($1)`, [b.height]);
        note("on-db-write", `${b.height}`);
      },
      async "on-settle"(...args) {
        const [, run, w] = args;
        seen.runs.push({ module: id, run, args: args.length });
        const [row] = await w.query(`SELECT (${counted})::int AS n`, [run.first, run.last]);
        await w.execute(`INSERT INTO ${schema}.settled (height, block_rows) VALUES ($1, $2)`, [run.last, row?.n]);
        note("on-settle", `${run.first}..${run.last}`);
      },
      async "on-after-db-write"(_p, b, read) {
        const [row] = await read.query(`SELECT block_rows FROM ${schema}.settled WHERE height = $1`, [b.height]);
        seen.settled.push(`${id} read settled@${b.height}: ${row === undefined ? "none" : String(row.block_rows)}`);
        note("on-after-db-write", `${b.height}`);
      },
    },
  });
}

/** `alpha` and `beta` (see the module comment), logging in `seen` and throwing the faults of `faults`. */
export function settlingModules(seen: Seen, faults: Faults = new Map()): ModuleDeclaration[] {
  return [module("alpha", ["alpha"], seen, faults, []), module("beta", ["alpha", "beta"], seen, faults, ["alpha-rows"])];
}

/**
 * `db`, logging in `log` each transaction's `BEGIN` when its body starts and its end once it settled: `COMMIT` when it
 * committed, `ROLLBACK` when it failed.
 */
export function loggingTransactions(db: Database, log: string[]): Database {
  return {
    read: (body, options) => db.read(body, options),
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      try {
        const result = await db.transaction((tx) => {
          log.push("BEGIN");
          return body(tx);
        });
        log.push("COMMIT");
        return result;
      } catch (error) {
        log.push("ROLLBACK");
        throw error;
      }
    },
    close: () => db.close(),
  };
}

/** An in-memory block source that logs `cursor` in `log` each time its cursor is read. */
export class LoggedSource extends InMemoryBlockSource {
  readonly #log: string[];

  constructor(log: string[], options: InMemorySourceOptions) {
    super(options);
    this.#log = log;
  }

  override cursor(read: Pick<ReadHandle, "query">): Promise<BlockRef | null> {
    this.#log.push("cursor");
    return super.cursor(read);
  }
}

/**
 * The log of one committed height `h` when both modules run every point there: `on-parse` and `on-compute`, the block
 * transaction with every `on-db-write`, then every `on-settle` of the run `h..h`, the cursor check, its `COMMIT`, then
 * every `on-after-db-write`.
 */
export function heightLog(h: bigint): string[] {
  const each = (point: string, at: string) => MODULES.map((id) => `${id} ${point}@${at}`);
  return [
    ...each("on-parse", `${h}`),
    ...each("on-compute", `${h}`),
    "BEGIN",
    ...each("on-db-write", `${h}`),
    ...each("on-settle", `${h}..${h}`),
    "cursor",
    "COMMIT",
    ...each("on-after-db-write", `${h}`),
  ];
}

/** An `on-settle` call as text: its module, each key of its run with its value and type, and its number of arguments. */
const runText = ({ module, run, args }: Seen["runs"][number]): string =>
  `${module} ${Object.entries(run)
    .map(([key, value]) => `${key}=${String(value)}:${typeof value}`)
    .join(",")} args=${args}`;

/**
 * The oracle of the order: one sentence per problem, none when `seen` holds exactly a run's first cursor read and the
 * log of the heights `heights` ({@link heightLog}), and each `on-settle` was given `{ first: h, last: h }`, both
 * `bigint`s, and nothing else.
 */
export function orderProblems(seen: Seen, heights: readonly bigint[]): string[] {
  const problems: string[] = [];
  const expected = ["cursor", ...heights.flatMap(heightLog)];
  const first = expected.findIndex((line, index) => seen.log[index] !== line);
  if (first >= 0 || seen.log.length !== expected.length) {
    const at = first >= 0 ? first : Math.min(seen.log.length, expected.length);
    problems.push(
      `the log differs at line ${at}: ${seen.log[at] ?? "(nothing)"} where ${expected[at] ?? "(nothing)"} was expected ` +
        `(log: ${seen.log.join(", ")})`,
    );
  }
  const runs = heights.flatMap((h) => MODULES.map((module) => `${module} first=${h}:bigint,last=${h}:bigint args=3`));
  const given = seen.runs.map(runText);
  if (given.join("; ") !== runs.join("; ")) {
    problems.push(`on-settle was given ${given.join("; ")}, not ${runs.join("; ")}`);
  }
  return problems;
}
