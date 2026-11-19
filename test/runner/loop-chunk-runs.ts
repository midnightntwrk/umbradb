import type { BlockWriteHandle, Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { BlockSource } from "../../src/runner/block-source.js";
import { FinalizedLoop, HeightFailure, type LoopInput } from "../../src/runner/loop.js";
import type { LoopPause } from "../../src/runner/pause.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { loggingFollower } from "./block-continues-harness.js";
import { CHECKED_BACKBONE, recorder, type Seen } from "./loop-chunk-harness.js";
import { InMemoryBlockSource, type RunnerBackend, startWith } from "./loop-harness.js";

/**
 * What the tests of failures and block ends inside chunks share (`loop-chunk-preparation.test.ts`,
 * `loop-chunk-block-end.test.ts`, `loop-chunk-positions.test.ts`): one case run over heights 1 to a head on a new
 * database, with the mode on or off, the loop run again after each retryable failure as the process does, and what the
 * case gave: the failures, the cursor, the follower's facts, the order of module `r`'s points and of the transactions'
 * marks, the failures the loop dropped, and the tables after each `COMMIT`.
 */

/** A fault of module `f`: thrown once at `at` of `height`, as a lost connection when `retryable`. */
export interface Fault {
  readonly at: Extract<PointName, "on-fetch" | "on-parse" | "on-compute" | "on-db-write" | "on-settle" | "on-after-db-write">;
  readonly height: bigint;
  readonly retryable: boolean;
}

/** What a case runs with. */
export interface CaseOptions {
  readonly head: bigint;
  /** The setting's `blocks`, distance 0; none: the mode off. */
  readonly blocks?: number;
  /** Module `f`'s faults, each thrown once. */
  readonly faults?: readonly Fault[];
  /** More modules, each with an entry from 1. */
  readonly modules?: readonly ModuleDeclaration[];
  /** The pause between heights. */
  readonly pause?: LoopPause;
  /** Awaited at each point of `f`, after it logged and before it faults. */
  readonly at?: (point: string, height: bigint) => Promise<void>;
  /** The source over the in-memory chain; the chain itself unless given. */
  readonly source?: (memory: InMemoryBlockSource) => BlockSource;
  /** Tables to read after each `COMMIT`, beside the cursor's and `f.rows`: `schema.table`, each with a `height` column. */
  readonly tables?: readonly string[];
  /** Where `r`'s points and the transactions' marks go; a new list unless given (a test's source adds its own marks). */
  readonly order?: string[];
  /** The loop's class; the real one unless given (a negative control's). */
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  /** Told the loop once it is made. */
  readonly onLoop?: (loop: FinalizedLoop, db: Database, controller: AbortController) => void;
}

/** What a case gave. */
export interface CaseOutcome {
  /** The failure of each run of the loop that failed, in order. */
  readonly failures: HeightFailure[];
  readonly cursor: bigint | null;
  /** The follower's `committed` and `rolledBack` facts, in order. */
  readonly facts: string[];
  /** `f`'s calls, `<point>@<h>`. */
  readonly calls: string[];
  readonly seen: Seen[];
  /** `r`'s points and the transactions' `BEGIN` and `COMMIT`, in order. */
  readonly order: string[];
  /** The heights of the failures the loop dropped (`LoopObserver.dropped`), in order. */
  readonly dropped: bigint[];
  /** The tables after each `COMMIT`, by the cursor's height. */
  readonly snapshots: Map<bigint, string>;
  readonly db: Database;
}

/** Module `f`: logs its calls as `<point>@<h>`, writes its height at `on-db-write`, and throws each of `options.faults` once. */
export function faultingModule(calls: string[], options: Pick<CaseOptions, "faults" | "at">): ModuleDeclaration {
  const fired = new Set<Fault>();
  const reach = async (point: Fault["at"], height: bigint): Promise<void> => {
    calls.push(`${point}@${height}`);
    await options.at?.(point, height);
    const fault = (options.faults ?? []).find((candidate) => candidate.at === point && candidate.height === height && !fired.has(candidate));
    if (fault === undefined) return;
    fired.add(fault);
    if (fault.retryable) throw new UmbraError("connection-lost", `the connection was lost at ${point} of ${height} (the test's module)`);
    throw new Error(`f failed at ${point} of ${height}`);
  };
  return declaration("f", {
    points: {
      "on-fetch": (_p, b: BlockContext) => reach("on-fetch", b.height),
      "on-parse": (_p, b: BlockContext) => reach("on-parse", b.height),
      "on-compute": (_p, b: BlockContext) => reach("on-compute", b.height),
      async "on-db-write"(_p, b: BlockContext, w: BlockWriteHandle) {
        await w.execute("INSERT INTO f.rows (height) VALUES ($1)", [b.height]);
        await reach("on-db-write", b.height);
      },
      "on-settle": (_p, run) => reach("on-settle", run.first),
      "on-after-db-write": (_p, b: BlockContext) => reach("on-after-db-write", b.height),
    },
  });
}

/** The cursor, `f.rows` and `tables` of `db`, as one text. */
async function snapshot(db: Database, tables: readonly string[]): Promise<string> {
  return db.read(async (read) => {
    const blocks = await read.query("SELECT height, hash FROM core_block_commit.blocks ORDER BY height");
    const hex = (value: unknown): string => Buffer.from(value as Uint8Array).toString("hex");
    const shot: Record<string, unknown> = { blocks: blocks.map((row) => `${row.height}:${hex(row.hash)}`) };
    for (const table of ["f.rows", ...tables]) {
      const rows = await read.query(`SELECT * FROM ${table} ORDER BY height`);
      shot[table] = rows.map((row) => JSON.stringify(row, (_key, value: unknown) => (typeof value === "bigint" ? `${value}` : value)));
    }
    return JSON.stringify(shot);
  });
}

/** Whether the process retries `failure`: a retryable `UmbraError`, itself or a callback's. */
function retried(failure: HeightFailure): boolean {
  const { cause } = failure;
  const inner = cause instanceof Error && cause.cause instanceof UmbraError ? cause.cause : cause;
  return inner instanceof UmbraError && inner.retryable;
}

/** Runs heights 1 to `options.head` on a new database of `backend`, the loop again after each retryable failure. */
export async function runCase(backend: RunnerBackend, options: CaseOptions): Promise<CaseOutcome> {
  const { db: raw } = await backend.database();
  const order = options.order ?? [];
  const seen: Seen[] = [];
  const calls: string[] = [];
  const log: string[] = [];
  const dropped: bigint[] = [];
  const snapshots = new Map<bigint, string>();
  const user = [recorder(order, seen), faultingModule(calls, options), ...(options.modules ?? [])];
  const started = await startWith(raw, user, user.map((part) => entry(part.id, 1)), { backbone: CHECKED_BACKBONE });
  const memory = new InMemoryBlockSource({ head: options.head });
  const db: Database = {
    read: (body, readOptions) => raw.read(body, readOptions),
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      const result = await raw.transaction((tx) => {
        order.push("BEGIN");
        return body(tx);
      });
      order.push("COMMIT");
      const shot = await snapshot(raw, options.tables ?? []);
      const { blocks } = JSON.parse(shot) as { blocks: string[] };
      snapshots.set(BigInt(blocks.length), shot);
      return result;
    },
    writerSession: () => raw.writerSession(),
    close: () => raw.close(),
  };
  const controller = new AbortController();
  const input: LoopInput = {
    db,
    graph: started.graph,
    plan: started.plan,
    source: options.source?.(memory) ?? memory,
    contextOf: (id) => started.contexts.of(id),
    signal: controller.signal,
    follower: loggingFollower(log),
    observer: { dropped: (failure) => void dropped.push(failure.height) },
    ...(options.pause === undefined ? {} : { pause: options.pause }),
    ...(options.blocks === undefined ? {} : { fastSync: { blocks: options.blocks, distance: 0 } }),
  };
  const loop = new (options.loop ?? FinalizedLoop)(input);
  options.onLoop?.(loop, raw, controller);
  const failures: HeightFailure[] = [];
  for (let runs = 0; runs < 6; runs++) {
    const running = loop.run().then(
      () => undefined,
      (error: unknown) => error,
    );
    if ((await Promise.race([memory.waiting(options.head).then(() => "waiting" as const), running])) === "waiting") {
      controller.abort();
      await running;
      break;
    }
    const failure = await running;
    // The loop returned: its signal stopped it.
    if (failure === undefined) break;
    if (!(failure instanceof HeightFailure)) throw failure;
    failures.push(failure);
    if (!retried(failure)) break;
  }
  const [cursorRow] = await raw.read((read) => read.query("SELECT max(height) AS h FROM core_block_commit.blocks"));
  return {
    failures,
    cursor: (cursorRow?.h as bigint | null | undefined) ?? null,
    facts: log.filter((line) => !line.startsWith("told written")),
    calls,
    seen,
    order,
    dropped,
    snapshots,
    db: raw,
  };
}

/** A failure's fields, for one assertion. */
export const where = (failure: HeightFailure) => ({ height: failure.height, point: failure.point, module: failure.module, committed: failure.committed });

/** How many times `key` (`<point>@<h>`) is in `calls`. */
export const count = (calls: readonly string[], key: string): number => calls.filter((call) => call === key).length;

/** Checks the tables `on` held after each `COMMIT` against `off`'s at every height both committed. */
export function tablesCompared(on: CaseOutcome, off: CaseOutcome): { readonly compared: number; readonly differing: bigint[] } {
  let compared = 0;
  const differing: bigint[] = [];
  for (const [height, shot] of on.snapshots) {
    const other = off.snapshots.get(height);
    if (other === undefined) continue;
    compared += 1;
    if (other !== shot) differing.push(height);
  }
  return { compared, differing };
}
