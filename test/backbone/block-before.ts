import { z } from "zod";
import { type CoreBlockCommitOptions, coreBlockCommit } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { CORE_LEDGER_STATE_ID, type CoreLedgerStateOptions } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { BlockContext, BlockRun, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import type { LoopPauses } from "../../src/runner/pause.js";
import type { LostCommit } from "../runner/block-continues-harness.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { recordingLoads, type SeenLoad } from "./ledger-restart.js";
import { type DagRun, runDag } from "./refcount-process.js";

/**
 * The runs of the extended DAG fixture through the real process (`./refcount-process.ts`) that show what
 * `core-ledger-state` and `core-block-commit` read of the block before, shared by `ledger-block-before.test.ts` and its
 * negative control. Imports nothing of Vitest.
 * - Every callback of the two modules that is given a handle records the statements it sends through it
 *   ({@link recordingStatements}); the reads of the block before are named by their text ({@link BLOCK_BEFORE_READS}).
 * - The worker's loads are recorded: the state key each height's `on-compute` asked it to hold.
 * - The process's loop loses the `COMMIT` of one height when asked, with its transaction rolled back or after it
 *   landed, and may change the database while the process waits for its retry. A loop may also say `continues` false
 *   at every height (the memory off), or true at every height above the first (a height whose kept block is not
 *   h − 1 then).
 * - Module `block-before-faults`, which requires `ledger-state`, so that it runs after `core-ledger-state` at each
 *   point, fails once where asked, and calls the test at its `on-db-write` (where a test arms a proxy's lost `COMMIT`).
 * - A negative control's build gives the two modules block contexts that say `continues` at every height above the
 *   first ({@link BeforeRunOptions.ignoring}).
 */

/** The statements one callback of a module sent through the handle it was given. */
export interface SentCall {
  readonly module: string;
  readonly point: string;
  /** Its block's height; at `on-settle` the run's last. */
  readonly height: bigint;
  readonly texts: string[];
}

/** The points whose callbacks are given a handle, the third argument: a read or the block write handle. */
const HANDLE_POINTS: ReadonlySet<string> = new Set(["on-compute", "on-db-write", "on-settle"]);

type Statement = (sql: string, ...rest: unknown[]) => Promise<unknown>;

/** `handle`, each statement sent through it recorded in `texts` before it is sent. */
function recordingHandle(handle: Record<string, unknown>, texts: string[]): unknown {
  const query = handle.query as Statement;
  const execute = handle.execute as Statement | undefined;
  return Object.freeze({
    get height(): unknown {
      return handle.height;
    },
    query: (sql: string, ...rest: unknown[]) => {
      texts.push(sql);
      return query.call(handle, sql, ...rest);
    },
    ...(execute === undefined
      ? {}
      : {
          execute: (sql: string, ...rest: unknown[]) => {
            texts.push(sql);
            return execute.call(handle, sql, ...rest);
          },
        }),
  });
}

/** `module`, each of its callbacks given a handle recording what it sends in `calls` (see the module comment). */
export function recordingStatements(module: ModuleDeclaration, calls: SentCall[]): ModuleDeclaration {
  const points = Object.fromEntries(
    Object.entries(module.points).map(([name, point]) => [
      name,
      !HANDLE_POINTS.has(name)
        ? point
        : async (p: unknown, at: BlockContext | BlockRun, handle: Record<string, unknown>, ...rest: unknown[]) => {
            const texts: string[] = [];
            const height = "last" in at ? at.last : at.height;
            calls.push({ module: module.id, point: name, height, texts });
            return (point as (...args: unknown[]) => Promise<unknown>).call(module.points, p, at, recordingHandle(handle, texts), ...rest);
          },
    ]),
  );
  return { ...module, points: points as ModuleDeclaration["points"] };
}

/** `module`, whose `on-db-write` handle calls `after` once each statement it sent resolved (see {@link BeforeRunOptions}). */
export function afterWriteStatements(
  module: ModuleDeclaration,
  after: (module: string, b: BlockContext, sql: string) => void,
): ModuleDeclaration {
  const write = module.points["on-db-write"];
  if (write === undefined) return module;
  type Statement = (sql: string, params?: readonly unknown[]) => Promise<unknown>;
  const points = {
    ...module.points,
    "on-db-write": (p: unknown, b: BlockContext, w: Record<string, unknown>) => {
      const execute = w.execute as Statement;
      const query = w.query as Statement;
      const handle = Object.freeze({
        get height(): unknown {
          return w.height;
        },
        query: (sql: string, params?: readonly unknown[]) => query.call(w, sql, params),
        execute: async (sql: string, params?: readonly unknown[]) => {
          const result = await execute.call(w, sql, params);
          after(module.id, b, sql);
          return result;
        },
      });
      return (write as (...args: unknown[]) => Promise<void>).call(module.points, p, b, handle);
    },
  };
  return { ...module, points: points as unknown as ModuleDeclaration["points"] };
}

/**
 * `module`, its callbacks given block contexts that say the block before continues at every height above 0: a
 * negative control's build that uses what it kept whenever the kept block is h − 1.
 */
export function ignoringContinues(module: ModuleDeclaration): ModuleDeclaration {
  const points = Object.fromEntries(
    Object.entries(module.points).map(([name, point]) => [
      name,
      name !== "on-compute" && name !== "on-db-write"
        ? point
        : async (p: unknown, b: BlockContext, ...rest: unknown[]) =>
            (point as (...args: unknown[]) => Promise<unknown>).call(module.points, p, Object.freeze({ ...b, continues: b.height > 0n }), ...rest),
    ]),
  );
  return { ...module, points: points as ModuleDeclaration["points"] };
}

/**
 * The reads of the block before, by name, as their texts are sent (whitespace collapsed): `core-ledger-state`'s state
 * at h − 1, its parent time and the keys of the states a block releases, and `core-block-commit`'s parent hash.
 */
export const BLOCK_BEFORE_READS = Object.freeze({
  state:
    "SELECT s.state_key, s.state_root, b.hash, b.ledger_version FROM core_ledger_state.states s JOIN core_block_commit.blocks b ON b.height = s.height WHERE s.height = $1",
  time: "SELECT (extract(epoch FROM block_time) * 1000)::bigint AS ms FROM core_block_commit.blocks WHERE height = $1",
  keys: "SELECT height, state_key FROM core_ledger_state.states WHERE height >= $1 AND height < $2 ORDER BY height",
  parent: "SELECT hash FROM core_block_commit.blocks WHERE height = $1",
} as const);

/** A read of the block before. */
export type BlockBeforeRead = keyof typeof BLOCK_BEFORE_READS;

const READ_NAMES = Object.keys(BLOCK_BEFORE_READS) as BlockBeforeRead[];

/** The read `text` is, if it is one of {@link BLOCK_BEFORE_READS}. */
function readOf(text: string): BlockBeforeRead | undefined {
  const flat = text.replace(/\s+/g, " ").trim();
  return READ_NAMES.find((name) => BLOCK_BEFORE_READS[name] === flat);
}

/** A module's short name in {@link readsOf}: `ledger` for `core-ledger-state`, `commit` for `core-block-commit`. */
const shortName = (id: string): string => (id === CORE_LEDGER_STATE_ID ? "ledger" : id === "core-block-commit" ? "commit" : id);

/**
 * Where each read of the block before was sent, by read: one `<module> <point>@<h>#<n>` per statement, `n` counting the
 * module's calls of that point at that height (a height made again calls them twice).
 */
export function readsOf(calls: readonly SentCall[]): Record<BlockBeforeRead, string[]> {
  const sent = Object.fromEntries(READ_NAMES.map((name) => [name, [] as string[]])) as Record<BlockBeforeRead, string[]>;
  const counts = new Map<string, number>();
  for (const call of calls) {
    const at = `${shortName(call.module)} ${call.point}@${call.height}`;
    const n = (counts.get(at) ?? 0) + 1;
    counts.set(at, n);
    for (const text of call.texts) {
      const name = readOf(text);
      if (name !== undefined) sent[name].push(`${at}#${n}`);
    }
  }
  return sent;
}

/** A height whose callbacks read the block before (see {@link readsAt}). */
export interface ReadHeight {
  readonly height: bigint;
  /** Which call of `core-ledger-state`'s `on-compute` at the height reads: the first unless given. */
  readonly compute?: number;
  /** Which call of `core-block-commit`'s `on-db-write` at the height reads: `compute`'s unless given. */
  readonly write?: number;
  /** False for a block that releases no state, whose `on-compute` reads no keys. */
  readonly keys?: boolean;
}

/**
 * What {@link readsOf} gives for a run whose callbacks read the block before at `heights` only: at each,
 * `core-ledger-state`'s `on-compute` reads the state at h − 1, the parent time and the keys of the states the block
 * releases, and `core-block-commit`'s `on-db-write` reads the parent's hash.
 */
export function readsAt(heights: readonly ReadHeight[]): Record<BlockBeforeRead, string[]> {
  const compute = ({ height, compute: n = 1 }: ReadHeight): string => `ledger on-compute@${height}#${n}`;
  return {
    state: heights.map(compute),
    time: heights.map(compute),
    keys: heights.filter(({ keys }) => keys !== false).map(compute),
    parent: heights.map(({ height, compute: n = 1, write = n }) => `commit on-db-write@${height}#${write}`),
  };
}

/** Heights `from` to `to`, each read at its first call (see {@link readsAt}). */
export const heightsFrom = (from: bigint, to: bigint): { readonly height: bigint }[] =>
  Array.from({ length: Number(to - from + 1n) }, (_, i) => ({ height: from + BigInt(i) }));

/** The error a lost `COMMIT` gives. */
const lostCommit = (): UmbraError => new UmbraError("connection-lost", "the connection was lost during the COMMIT (the test's database)");

/** A `COMMIT` to lose (see the module comment): at which height, how, and what changes while the process is away. */
export interface LoseCommit {
  readonly at: bigint;
  readonly how: LostCommit;
  /** Runs in a transaction of its own once the lost `COMMIT` failed, before the process's retry. */
  readonly then?: (tx: Transaction) => Promise<void>;
}

/** `db`, whose next block transaction loses its `COMMIT` once `state.armed` is set (see {@link LoseCommit}). */
function losing(db: Database, state: { armed: LoseCommit | undefined }): Database {
  return {
    read: (body, options) => db.read(body, options),
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      let lost: LoseCommit | undefined;
      let result: T;
      try {
        result = await db.transaction(async (tx) => {
          const value = await body(tx);
          lost = state.armed;
          state.armed = undefined;
          if (lost?.how === "lost") throw lostCommit();
          return value;
        });
      } catch (error) {
        if (lost?.then !== undefined) await db.transaction(lost.then);
        throw error;
      }
      if (lost?.how === "landed") {
        if (lost.then !== undefined) await db.transaction(lost.then);
        throw lostCommit();
      }
      return result;
    },
    close: () => db.close(),
    writerSession: () => db.writerSession(),
  };
}

/** What a run is given. */
export interface BeforeRunOptions {
  /** The tape's last height. */
  readonly last: number;
  /** The cursor the database already holds, for a run that restarts there. */
  readonly resume?: bigint;
  /** `core-ledger-state`'s options (the checking option, a kept value changed). */
  readonly core?: CoreLedgerStateOptions;
  /** `core-block-commit`'s options (the checking option); the real part unless given. */
  readonly commit?: CoreBlockCommitOptions;
  /** More `core` settings (`retainStates`). */
  readonly settings?: Readonly<Record<string, unknown>>;
  /** The `COMMIT` lost once; none unless given. */
  readonly lose?: LoseCommit;
  /**
   * What module `block-before-faults` throws, once each: `<point>@<h>` (`on-compute`, `on-db-write`, `on-settle`,
   * `on-after-db-write`, `on-stop-height`) to the error.
   */
  readonly faults?: ReadonlyMap<string, Error>;
  /** Called at module `block-before-faults`'s `on-db-write` of each height, before its fault. */
  readonly atWrite?: (height: bigint) => void;
  /** Awaited at module `block-before-faults`'s `on-compute` of each height, given the loop's database. */
  readonly atCompute?: (height: bigint, db: Database) => Promise<void>;
  /** Awaited once, right after the `COMMIT` of `after` answered, before the loop goes on: given the loop's database. */
  readonly between?: { readonly after: bigint; readonly act: (db: Database) => Promise<void> };
  /** Module `block-before-faults`'s entry starts here (an activation boundary); S unless given. */
  readonly faultsFrom?: number;
  /** Module `block-before-faults`'s entry stops here (its `on-stop-height` runs there); none unless given. */
  readonly faultsStop?: number;
  /**
   * A pause between `at` and the height after it: once `at`'s `COMMIT` answered the test holds the process's pause
   * (the loop's `LoopPauses`), and releases it 50 ms after the loop paused, calling `reached` then.
   */
  readonly pauseAfter?: { readonly at: bigint; readonly reached: () => void };
  /** The `core` entry's stop: the process stops there, as before an upgrade. */
  readonly stop?: bigint;
  /** Later revisions of the `core` entry (a `retainStates` change). */
  readonly revisions?: readonly { readonly start: bigint; readonly settings: Readonly<Record<string, unknown>> }[];
  /** More user modules (one that changes a published value). */
  readonly user?: readonly ModuleDeclaration[];
  /** The loop's `continues`: `off` false at every height, `always` true at every height above the first. */
  readonly continues?: "off" | "always";
  /** A negative control's build: the two modules told the block before continues at every height above 0. */
  readonly ignoring?: boolean;
  /** Wait for a halt as well as the last height. */
  readonly halts?: boolean;
  /**
   * Called once each statement `core-ledger-state`'s or `core-block-commit`'s `on-db-write` sent through its handle has
   * resolved, before that callback goes on: the module's id, the block context and the statement's text.
   */
  readonly afterWriteStatement?: (module: string, b: BlockContext, sql: string) => void;
}

/** What a run gave. */
export interface BeforeRun {
  readonly run: DagRun;
  /** The statements of every callback of `core-ledger-state` and `core-block-commit` given a handle, in order. */
  readonly calls: readonly SentCall[];
  /** The worker's loads, in order: the state key each `on-compute` above 0 asked it to hold. */
  readonly loads: readonly SeenLoad[];
  /** The parent time each apply was given, by height, in order. */
  readonly applies: readonly { readonly height: bigint; readonly parentTimestampMs: bigint }[];
  /**
   * Every row of the backbone's and the ledger modules' tables ({@link rowsOf}) after each committed height, read at
   * the next height's `on-compute` and, for the cursor, once the process stopped (after a halt too).
   */
  readonly rows: ReadonlyMap<bigint, Readonly<Record<string, string>>>;
}

/** The schemas whose every row a run compares: the backbone's and the ledger modules'. */
const ROW_SCHEMAS = ["core_block_commit", "core_ledger_state", "core_digest", "core_chain_events", "core_block_parsed", "core_tx_results"];

/**
 * Every row of the tables of {@link ROW_SCHEMAS} through `read`, by table: the MD5 of the rows' text in order, `nodes`
 * with its payloads and child lists, the counts and the queue included.
 */
export async function rowsOf(read: { query(sql: string): Promise<Record<string, unknown>[]> }): Promise<Record<string, string>> {
  const tables = await read.query(
    `SELECT n.nspname || '.' || c.relname AS t FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname IN (${ROW_SCHEMAS.map((schema) => `'${schema}'`).join(", ")}) AND c.relkind IN ('r', 'p') AND NOT c.relispartition
     ORDER BY 1`,
  );
  const rows: Record<string, string> = {};
  for (const { t } of tables) {
    const [row] = await read.query(`SELECT md5(coalesce(string_agg(r::text, ',' ORDER BY r::text), '')) AS d FROM ${t as string} r`);
    rows[t as string] = row?.d as string;
  }
  return rows;
}

/** Where two runs' rows differ, height by height (see {@link BeforeRun.rows}); empty when every row agrees. */
export function rowDifferences(
  got: ReadonlyMap<bigint, Readonly<Record<string, string>>>,
  expected: ReadonlyMap<bigint, Readonly<Record<string, string>>>,
): string[] {
  const problems: string[] = [];
  for (const [height, want] of expected) {
    const have = got.get(height);
    if (have === undefined) {
      problems.push(`no rows after ${height}`);
      continue;
    }
    const tables = [...new Set([...Object.keys(want), ...Object.keys(have)])].filter((table) => have[table] !== want[table]);
    if (tables.length > 0) problems.push(`after ${height}: ${tables.join(", ")} differ`);
  }
  for (const height of got.keys()) if (!expected.has(height)) problems.push(`rows after ${height}, which the other run has not`);
  return problems;
}

/** The user module that reads every row at each height's `on-compute` (the tables after the height before). */
function rowsWatcher(rows: Map<bigint, Record<string, string>>): ModuleDeclaration {
  return {
    id: "block-before-rows",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "block-before-rows-seen", lifetimes: ["table"], table: { schema: "block_before_rows", tables: ["seen"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE block_before_rows.seen (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        if (b.height > 0n) rows.set(b.height - 1n, await rowsOf(read));
      },
    },
  };
}

/** `host`, the parent time of each apply recorded in `applies`. */
function recordingApplies(host: LedgerHost, applies: { height: bigint; parentTimestampMs: bigint }[]): LedgerHost {
  return new Proxy(host, {
    get(target, property, receiver) {
      if (property !== "apply") return Reflect.get(target, property, receiver);
      return (input: Parameters<LedgerHost["apply"]>[0], read: Parameters<LedgerHost["apply"]>[1]) => {
        applies.push({ height: input.height, parentTimestampMs: input.parentTimestampMs });
        return target.apply(input, read);
      };
    },
  });
}

/** Module `block-before-faults` (see the module comment). */
function faultsModule(options: BeforeRunOptions, holder: { db?: Database }): ModuleDeclaration {
  const faults = new Map(options.faults ?? []);
  const fail = (key: string): void => {
    const fault = faults.get(key);
    if (fault === undefined) return;
    faults.delete(key);
    throw fault;
  };
  return {
    id: "block-before-faults",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "ledger-state"],
    provides: [
      { name: "block-before-faults-rows", lifetimes: ["table"], table: { schema: "block_before_faults", tables: ["rows"], kind: "append-only" } },
    ],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE block_before_faults.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b) {
        if (options.atCompute !== undefined && holder.db !== undefined) await options.atCompute(b.height, holder.db);
        fail(`on-compute@${b.height}`);
      },
      async "on-db-write"(_p, b) {
        options.atWrite?.(b.height);
        fail(`on-db-write@${b.height}`);
      },
      async "on-settle"(_p, run) {
        fail(`on-settle@${run.last}`);
      },
      async "on-after-db-write"(_p, b) {
        fail(`on-after-db-write@${b.height}`);
      },
      async "on-stop-height"(_p, at) {
        fail(`on-stop-height@${at.height}`);
      },
    },
  };
}

/** The loop of a run (see the module comment). */
function loopOf(options: BeforeRunOptions, holder: { db?: Database }): new (input: LoopInput) => FinalizedLoop {
  const { lose, continues, between, pauseAfter } = options;
  const state: { armed: LoseCommit | undefined; done: boolean; acted: boolean; paused: boolean } = {
    armed: undefined,
    done: false,
    acted: false,
    paused: false,
  };
  return class extends FinalizedLoop {
    constructor(input: LoopInput) {
      const db = losing(input.db, state);
      holder.db = db;
      super({ ...input, db });
    }

    protected override async commit(run: HeightRun): Promise<void> {
      if (lose !== undefined && run.height === lose.at && !state.done) {
        state.done = true;
        state.armed = lose;
      }
      await super.commit(run);
      if (between !== undefined && run.height === between.after && !state.acted && holder.db !== undefined) {
        state.acted = true;
        await between.act(holder.db);
      }
      if (pauseAfter !== undefined && run.height === pauseAfter.at && !state.paused) {
        state.paused = true;
        const hold = (this.input.pause as LoopPauses | undefined)?.hold("pause");
        if (hold === undefined) throw new Error("the process gave its loop no pause to hold");
        void hold.reached.then(() => {
          pauseAfter.reached();
          setTimeout(() => hold.release(), 50);
        });
      }
    }

    protected override continues(run: HeightRun): boolean {
      if (continues === "off") return false;
      if (continues === "always") return run.previous !== null;
      return super.continues(run);
    }
  };
}

/** Runs the extended DAG on `db` (see the module comment). */
export async function beforeRun(db: ProcessDatabase, options: BeforeRunOptions): Promise<BeforeRun> {
  const calls: SentCall[] = [];
  const loads: SeenLoad[] = [];
  const applies: { height: bigint; parentTimestampMs: bigint }[] = [];
  const ids = new Set([CORE_LEDGER_STATE_ID, "core-block-commit"]);
  const holder: { db?: Database } = {};
  const rows = new Map<bigint, Record<string, string>>();
  const run = await runDag(db, {
    dag: "extended",
    last: options.last,
    ...(options.resume === undefined ? {} : { resume: options.resume }),
    ...(options.core === undefined ? {} : { core: options.core }),
    ...(options.halts === undefined ? {} : { halts: options.halts }),
    ...(options.stop === undefined ? {} : { stop: options.stop }),
    ...(options.revisions === undefined ? {} : { revisions: options.revisions }),
    ...(options.faultsFrom === undefined ? {} : { startOf: (id: string) => (id === "block-before-faults" ? (options.faultsFrom as number) : 0) }),
    ...(options.faultsStop === undefined ? {} : { stopOf: (id: string) => (id === "block-before-faults" ? options.faultsStop : undefined) }),
    settings: { backoffCeilingMs: 20, ...options.settings },
    user: [faultsModule(options, holder), rowsWatcher(rows), ...(options.user ?? [])],
    loop: loopOf(options, holder),
    ...(options.commit === undefined ? {} : { commit: coreBlockCommit(options.commit) }),
    modules: (module) => {
      if (!ids.has(module.id)) return module;
      const after = options.afterWriteStatement === undefined ? module : afterWriteStatements(module, options.afterWriteStatement);
      return recordingStatements(options.ignoring === true ? ignoringContinues(after) : after, calls);
    },
    worker: (host: LedgerHost) => recordingApplies(recordingLoads(host, loads), applies),
  });
  // The rows at the cursor, once the process stopped (after a halt, the rows the halt left).
  for (const height of [...rows.keys()]) if (height > run.cursor) rows.delete(height);
  if (run.cursor >= 0n) rows.set(run.cursor, await rowsOf(db));
  return { run, calls, loads, applies, rows };
}

/** The state key the run stored after each height, `0x`-less hex (as `sweepTables` reads it). */
export function storedKeys(run: DagRun): ReadonlyMap<bigint, string> {
  return run.tables.get(run.cursor)?.states ?? new Map();
}

/** The state key each load asked for, by the height loaded, `0x`-less hex, in order (`h − 1` for `on-compute` at h). */
export function loadedKeys(loads: readonly SeenLoad[]): string[] {
  return loads.map((load) => `${load.height} ${Buffer.from(load.stateKey).toString("hex")}`);
}

/** Sets the state key stored after `height` to the one stored after `from`, in a transaction of its own. */
export const keyOf =
  (height: bigint, from: bigint) =>
  async (tx: Transaction): Promise<void> => {
    await tx.execute(
      "UPDATE core_ledger_state.states SET state_key = (SELECT state_key FROM core_ledger_state.states WHERE height = $2) WHERE height = $1",
      [height, from],
    );
  };

/**
 * What a run must show whose `COMMIT` of `at` was lost after it landed, the state key stored after `at` changed to
 * `changed` (`0x`-less hex) while the process was away, as problems (none when it holds): the run's first height,
 * at + 1, reads the state at `at` from the database; its `on-compute` asks the worker to hold the key the database
 * holds now; and the process halts there, in `core-ledger-state`'s `on-compute`, the state loaded for `at` having
 * another root than the stored one (so the reads after the load, the parent time and the keys, are not reached).
 */
export function changedRowProblems(before: BeforeRun, at: bigint, changed: string): string[] {
  const problems: string[] = [];
  const first = at + 1n;
  const reads = JSON.stringify(readsOf(before.calls));
  const expected = JSON.stringify({ ...readsAt([]), state: [`ledger on-compute@${first}#1`] });
  if (reads !== expected) problems.push(`the reads of the block before were ${reads}, not ${expected}`);
  const asked = loadedKeys(before.loads.filter((load) => load.height === at)).at(-1);
  if (asked !== `${at} ${changed}`) problems.push(`the last load of ${at} asked for ${asked ?? "nothing"}, not the key the database holds now (${changed})`);
  const { status } = before.run;
  const reason = status.reason as { readonly code?: string; readonly height?: bigint; readonly module?: string; readonly point?: string } | null;
  if (status.state !== "halted" || reason?.height !== first || reason.module !== CORE_LEDGER_STATE_ID || reason.point !== "on-compute") {
    problems.push(`the process ended ${status.state} at ${String(status.cursor)} (${JSON.stringify(reason, (_k, v: unknown) => (typeof v === "bigint" ? String(v) : v))}), not halted at ${first} in core-ledger-state's on-compute`);
  }
  return problems;
}
