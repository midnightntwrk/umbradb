import { PGlite } from "@electric-sql/pglite";
import { cpSync, rmSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import postgres from "postgres";
import { CORE_LEDGER_STATE_ID } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { extendedCases, TO_REF } from "../ledger/fixtures/sweep-fixture.js";
import { UNKNOWN_KEY } from "../ledger/fixtures/sweep-test-loader.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { modelOfBatches, modelProblems, sweepTables, type TableSnapshot } from "./ledger-graph-tapes.js";
import type { DagRun, DagRunOptions } from "./refcount-process.js";
import { runDag, runProblems } from "./refcount-process.js";

/**
 * The faults on the extended DAG fixture, shared by `ledger-refcount-halts.test.ts` and its negative controls. Each
 * makes one block's step fail one of its checks; the controls run the same fault with that check left out
 * (`core-ledger-state`'s `refcountUnchecked`). Imports nothing of Vitest.
 * - `negative-count`: a database is built to 5 and copied ({@link copyDatabase}), and the copy has the count of
 *   `repeat leaf 0` lowered from 4 to 1; at 6 the deletion of `repeat 0`, which lists it twice, takes it to −1.
 * - `missing-reference`, three test packages: at 10 the flush leaves out `shared leaf 2`, which the new `shared 1`
 *   references; at TO_REF it leaves out `small to-ref`, which the rewritten `rewrite to-ref` now references; at 20 it
 *   also persists a key no node has.
 * - `row-count-mismatch`: at 3 a seam has the queue's insert (the root of the state released at 3) send one key
 *   fewer, so it affects one row fewer than the step computed.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** A fault of R11: the block it fails at, the reason, the point, its `details` beyond the reason and height. */
export interface Fault {
  readonly name: string;
  readonly height: number;
  readonly reason: "negative-count" | "missing-reference" | "row-count-mismatch";
  readonly point: "on-compute" | "on-db-write";
  readonly details: Readonly<Record<string, unknown>>;
  /** The run's options beyond the extended DAG and its last height. */
  readonly options: Omit<DagRunOptions, "dag" | "last" | "halts">;
}

/** The count lowered and the block whose deletion takes it below 0. */
export const LOWERED = Object.freeze({ at: 5, key: hex(extendedCases(0).repeated.leaf.key), from: 4, to: 1 });

/** The queue's insert at `height` sending one key fewer: the seam of `row-count-mismatch`. */
export function oneRowFewer(height: bigint): (w: Pick<BlockWriteHandle, "execute">, at: bigint) => Pick<BlockWriteHandle, "execute"> {
  return (w, at) =>
    at !== height
      ? w
      : {
          execute(sql, params) {
            if (!sql.startsWith("INSERT INTO core_ledger_state.unreferenced")) return w.execute(sql, params);
            const [keys, ...rest] = params ?? [];
            return w.execute(sql, [(keys as readonly Uint8Array[]).slice(0, -1), ...rest]);
          },
        };
}

/** The three package faults of `missing-reference`. */
export const MISSING: readonly Fault[] = Object.freeze([
  {
    name: "a new node referencing a key not stored",
    height: 10,
    reason: "missing-reference",
    point: "on-compute",
    details: { key: `0x${hex(extendedCases(10).shared.leaves[1].key)}` },
    options: { data: { withhold: { at: "10", key: hex(extendedCases(10).shared.leaves[1].key) } } },
  },
  {
    name: "a stored node rewritten with a child list referencing a key not stored",
    height: TO_REF,
    reason: "missing-reference",
    point: "on-compute",
    details: { key: `0x${hex(extendedCases(TO_REF).toRef.small.key)}` },
    options: { data: { withhold: { at: `${TO_REF}`, key: hex(extendedCases(TO_REF).toRef.small.key) } } },
  },
  {
    name: "a root count raised for a key neither flushed nor stored",
    height: 20,
    reason: "missing-reference",
    point: "on-compute",
    details: { key: `0x${hex(UNKNOWN_KEY)}` },
    options: { data: { persistUnknown: "20" } },
  },
]);

/** The `row-count-mismatch` fault. */
export const ONE_ROW_FEWER: Fault = Object.freeze({
  name: "the queue's insert affecting one row fewer",
  height: 3,
  reason: "row-count-mismatch",
  point: "on-db-write",
  details: { statement: "insert-unreferenced", expected: 1, actual: 0 },
  options: { core: { refcountWriter: oneRowFewer(3n) } },
});

/** The `negative-count` fault. */
export const NEGATIVE: Fault = Object.freeze({
  name: "a stored count lowered so that a deletion takes it below 0",
  height: LOWERED.at + 1,
  reason: "negative-count",
  point: "on-compute",
  details: { key: `0x${LOWERED.key}` },
  options: {},
});

/**
 * A copy of `db`, made while no process holds it: on PGlite its data directory copied; on PostgreSQL a database created
 * from it as its template, from the server's maintenance database, once every session on it has ended (its plain
 * driver connection among them). `close` ends the copy's own connection.
 */
export async function copyDatabase(db: ProcessDatabase): Promise<{ readonly copy: ProcessDatabase; close(): Promise<void> }> {
  const { setting } = db;
  if (setting.kind === "pglite") {
    const directory = `${db.directory as string}-copy`;
    cpSync(db.directory as string, directory, { recursive: true });
    const query = async (sql: string): Promise<Record<string, unknown>[]> => {
      const engine = await PGlite.create(directory);
      try {
        return (await engine.query<Record<string, unknown>>(sql)).rows;
      } finally {
        await engine.close();
      }
    };
    return { copy: { setting: { kind: "pglite", path: directory }, directory, query }, close: async () => rmSync(directory, { recursive: true, force: true }) };
  }
  if (setting.kind !== "postgres") throw new Error("copyDatabase copies a PostgreSQL database or a PGlite directory");
  const url = (name: string): string =>
    `postgres://${encodeURIComponent(setting.user)}:${encodeURIComponent(setting.password ?? "")}@${setting.host}:${setting.port}/${name}`;
  const name = `${setting.name}_copy`;
  const server = postgres(url("postgres"), { max: 1, onnotice: () => undefined });
  try {
    for (let attempt = 0; ; attempt++) {
      await server.unsafe("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()", [setting.name]);
      try {
        await server.unsafe(`CREATE DATABASE ${name} TEMPLATE ${setting.name}`);
        break;
      } catch (error) {
        if (attempt >= 200 || !/being accessed by other users/.test(String(error))) throw error;
        await sleep(25);
      }
    }
  } finally {
    await server.end({ timeout: 5 });
  }
  const admin = postgres(url(name), { max: 1, onnotice: () => undefined });
  return {
    copy: { setting: { ...setting, name }, admin, query: async (sql) => [...(await admin.unsafe(sql))] as Record<string, unknown>[] },
    close: () => admin.end({ timeout: 5 }),
  };
}

/** What {@link runFault} gives: the run, the database it ran on, the tables before it when a count was lowered. */
export interface FaultRun {
  readonly run: DagRun;
  readonly db: ProcessDatabase;
  readonly lowered: TableSnapshot | null;
  /** Ends what the run opened beyond `db`'s backend (a copy's connection). */
  close(): Promise<void>;
}

/**
 * Runs `fault` on `db` until it halts or commits its block, the check it fails left out when `unchecked`.
 * For `negative-count`, `db` is first built to 5 and copied, and the copy, its count lowered, is what the fault runs on;
 * its tables then are returned as `lowered`.
 */
export async function runFault(db: ProcessDatabase, fault: Fault, unchecked = false): Promise<FaultRun> {
  let lowered: TableSnapshot | null = null;
  let target = db;
  let close = async (): Promise<void> => undefined;
  if (fault.reason === "negative-count") {
    const built = await runDag(db, { dag: "extended", last: LOWERED.at });
    if (built.status.cursor !== BigInt(LOWERED.at) || built.tables.get(BigInt(LOWERED.at))?.refs.get(LOWERED.key) !== LOWERED.from) {
      throw new Error(`the database built to ${LOWERED.at} does not count ${LOWERED.key} ${LOWERED.from} times`);
    }
    const copied = await copyDatabase(db);
    target = copied.copy;
    close = () => copied.close();
    await target.query(`UPDATE core_ledger_state.ref_counts SET count = ${LOWERED.to} WHERE node_key = decode('${LOWERED.key}', 'hex')`);
    lowered = await sweepTables(target);
  }
  const core = { ...fault.options.core, ...(unchecked ? { refcountUnchecked: fault.reason } : {}) };
  const resume = lowered === null ? {} : { resume: BigInt(LOWERED.at) };
  const run = await runDag(target, { ...fault.options, ...resume, dag: "extended", core, last: fault.height, halts: true });
  return { run, db: target, lowered, close };
}

/**
 * What differs from the halt for `fault` in `run`: halted at its block with `ledger-refcount-invalid`, the reason,
 * height and key or statement in the error's `details`, the log naming them, and nothing of the block stored — the
 * database at h − 1: the tables `lowered` held before the run, else those the watcher read at h − 1 before the block,
 * else the model fed the blocks before it, and the `states` and blocks of h − 1 the last. Empty when it holds.
 */
export async function haltProblems(db: ProcessDatabase, run: DagRun, fault: Fault, lowered: TableSnapshot | null): Promise<string[]> {
  const problems: string[] = [];
  const h = BigInt(fault.height);
  const expected = { state: "halted", cursor: h - 1n, reason: { code: "ledger-refcount-invalid", height: h, module: CORE_LEDGER_STATE_ID, point: fault.point } };
  const text = (value: unknown): string => JSON.stringify(value, (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v));
  const got = { state: run.status.state, cursor: run.status.cursor, reason: run.status.reason };
  if (text(got) !== text(expected)) problems.push(`the process is ${text(got)}, not ${text(expected)}`);
  const error = run.errors.at(-1);
  const details = { reason: fault.reason, height: h, ...fault.details };
  if (!(error instanceof UmbraError) || error.code !== "ledger-refcount-invalid") problems.push(`core-ledger-state threw ${String(error)}`);
  else if (text(error.details) !== text(details)) problems.push(`its details are ${text(error.details)}, not ${text(details)}`);
  const named = (line: string): boolean =>
    line.startsWith("processing halted (ledger-refcount-invalid): ") && line.includes(`block ${h}: `) && line.includes(`(${fault.reason})`);
  if (!run.lines.some(named)) {
    problems.push("no log line names the halt");
  }
  // Nothing of the block stored: the database at h − 1.
  const now = run.tables.get(h - 1n);
  const before = lowered ?? run.watched.get(h - 1n) ?? null;
  if (now === undefined) problems.push(`no tables after ${h - 1n}`);
  else if (before !== null) {
    const differing = [...before.digests.keys()].filter((table) => before.digests.get(table) !== now.digests.get(table));
    if (differing.length > 0) problems.push(`${differing.join(", ")} changed after ${h - 1n}`);
  } else {
    problems.push(...modelProblems(new Map([[h - 1n, now]]), modelOfBatches(run.batches, fault.height - 1)).filter((p) => p.startsWith(`after ${h - 1n}:`)));
  }
  if (now !== undefined && Math.max(...[...now.states.keys()].map(Number)) !== fault.height - 1) problems.push(`states holds another last height than ${h - 1n}`);
  const [block] = await db.query("SELECT max(height)::text AS h FROM core_block_commit.blocks");
  if (block?.h !== `${h - 1n}`) problems.push(`the blocks table ends at ${String(block?.h)}`);
  return problems;
}

/** The problems of `run` at its last height: what a block that committed with the check left out did. */
export function damageAt(run: DagRun, height: number): string[] {
  return runProblems(run, "extended").filter((problem) => problem.startsWith(`after ${height}: `));
}
