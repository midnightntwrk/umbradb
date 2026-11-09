import { CORE_LEDGER_STATE_ID, type CoreLedgerStateOptions } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { COUNTERS, countersMemory, type RefusalData } from "../ledger/fixtures/sweep-test-loader.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { modelOfFixture, type TableSnapshot } from "./ledger-graph-tapes.js";
import { nodeSet } from "./refcount-model.js";
import { runDag } from "./refcount-process.js";

/**
 * The eviction-restart runs, shared by `ledger-eviction-restart.test.ts` and its negative controls. Imports nothing of
 * Vitest.
 * - The original DAG fixture runs through the real process (`./refcount-process.ts`: a new root every block, the rows
 *   of a released state deleted from the block after its release, {@link refusalHeight} the first).
 * - Its test package (`test/ledger/fixtures/sweep-test-loader.ts`) refuses every eviction after applying block h in
 *   the first `threads` worker threads, as if a live object the worker cannot free held a deleted node.
 * - The threads' counters are read from memory they share with this thread.
 */

/** The first block whose reclamation step deletes nodes, by the model of the fixture: where the test package refuses. */
export function refusalHeight(): bigint {
  const at = modelOfFixture().findIndex((step) => step.deleted.length > 0);
  if (at <= 0) throw new Error("the DAG fixture deletes no node");
  return BigInt(at);
}

/** What a run gave: its status, its tables after every height and batches, its `states` rows, its counters, its worker. */
export interface FixtureRun {
  readonly status: Awaited<ReturnType<typeof runDag>>["status"];
  readonly lines: readonly string[];
  readonly tables: Map<bigint, TableSnapshot>;
  readonly batches: Map<bigint, NodeBatch>;
  /** The keys each height had the worker evict. */
  readonly evicted: ReadonlyMap<bigint, readonly string[]>;
  /** `height state_key state_root`, `0x`-less hex, in height order. */
  readonly states: readonly string[];
  /** The test package's counters, by {@link COUNTERS}' names. */
  readonly counters: Readonly<Record<keyof typeof COUNTERS, number>>;
  readonly restarts: number;
  readonly failure: string | null;
}

/** What a run is given: the refusal (none: an uninterrupted run), and `core-ledger-state`'s options. */
export interface FixtureRunOptions {
  readonly refuse?: { readonly at: bigint; readonly threads: number };
  readonly core?: CoreLedgerStateOptions;
  /** Wait for a halt instead of the fixture's last height. */
  readonly halts?: boolean;
}

/** Runs the fixture on `db` (see the module comment). */
export async function runFixture(db: ProcessDatabase, options: FixtureRunOptions = {}): Promise<FixtureRun> {
  const memory = countersMemory();
  const data: RefusalData = {
    counters: memory,
    ...(options.refuse === undefined ? {} : { refuseAt: `${options.refuse.at}`, threads: options.refuse.threads }),
  };
  const run = await runDag(db, {
    data,
    ...(options.core === undefined ? {} : { core: options.core }),
    ...(options.halts === undefined ? {} : { halts: options.halts }),
  });
  const rows = await db.query(
    "SELECT height::text AS h, encode(state_key, 'hex') AS k, encode(state_root, 'hex') AS r FROM core_ledger_state.states ORDER BY height",
  );
  const shared = new Int32Array(memory);
  const counters = Object.fromEntries(Object.entries(COUNTERS).map(([name, slot]) => [name, Atomics.load(shared, slot)])) as Record<keyof typeof COUNTERS, number>;
  return {
    status: run.status,
    lines: run.lines,
    tables: run.tables,
    batches: run.batches,
    evicted: run.evicted,
    states: rows.map((row) => `${row.h as string} ${row.k as string} ${row.r as string}`),
    counters,
    restarts: run.restarts,
    failure: run.failure,
  };
}

/** The tables whose rows count byte for byte: every table of `core_ledger_state` but its content-defined three. */
const BYTE_TABLES = (snapshot: TableSnapshot): string[] =>
  [...snapshot.digests.keys()].filter((table) => !["nodes", "ref_counts", "unreferenced"].includes(table));

/**
 * The heights at which two runs differ in the rows of a table that is not content-defined or in their node sets, each
 * with what differs; empty when they agree throughout.
 */
export function tableDifferences(got: ReadonlyMap<bigint, TableSnapshot>, expected: ReadonlyMap<bigint, TableSnapshot>): string[] {
  const problems: string[] = [];
  const keys = (snapshot: TableSnapshot): string => [...nodeSet(snapshot.rows)].sort().join(",");
  for (const [height, want] of expected) {
    const have = got.get(height);
    if (have === undefined) {
      problems.push(`no tables after ${height}`);
      continue;
    }
    const tables = BYTE_TABLES(want).filter((table) => have.digests.get(table) !== want.digests.get(table));
    if (keys(have) !== keys(want)) tables.push("the node set");
    if (tables.length > 0) problems.push(`after ${height}: ${tables.join(", ")} differ`);
  }
  for (const height of got.keys()) if (!expected.has(height)) problems.push(`tables after ${height}, which the other run has not`);
  return problems;
}

/** The expected halt reason: `callback-error` at `height`, in `core-ledger-state`'s `on-compute`. */
export const refusalHalt = (height: bigint) => ({
  state: "halted",
  cursor: height - 1n,
  reason: { code: "callback-error", height, module: CORE_LEDGER_STATE_ID, point: "on-compute" },
});
