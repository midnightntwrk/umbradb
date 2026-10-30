import { CORE_LEDGER_STATE_ID, type CoreLedgerStateOptions } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { COUNTERS, countersMemory, type RefusalData } from "../ledger/fixtures/sweep-test-loader.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { committed, halted, ingest, PATIENCE_MS } from "./ingest-harness.js";
import { modelOfFixture, SWEEP_LOADER, sweepCore, sweepTape, sweepWatcher, type TableSnapshot, tablesByHeight } from "./sweep-tapes.js";

/**
 * The eviction-restart runs, shared by `ledger-eviction-restart.test.ts` and its negative controls. Imports nothing of
 * Vitest. [A160, LG-14, Q144 B]
 * - The sweep's DAG fixture runs through the real process (`./sweep-tapes.ts`: K = 50, a new root every block, nodes
 *   deleted from block {@link refusalHeight} on).
 * - Its test package (`test/ledger/fixtures/sweep-test-loader.ts`) refuses every eviction after applying block h in
 *   the first `threads` worker threads, as if a live object the worker cannot free held a swept node.
 * - The threads' counters are read from memory they share with this thread.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The first block whose sweep step deletes nodes: where the test package refuses. */
export function refusalHeight(): bigint {
  const at = modelOfFixture().findIndex((snapshot) => snapshot.deleted.length > 0);
  if (at <= 0) throw new Error("the sweep fixture deletes no node");
  return BigInt(at);
}

/** What a run gave: its status, its tables after every height, its `states` rows, its counters and its worker. */
export interface FixtureRun {
  readonly status: ReturnType<Awaited<ReturnType<typeof ingest>>["handle"]["status"]>;
  readonly lines: readonly string[];
  readonly tables: Map<bigint, TableSnapshot>;
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
  const seen = new Map<bigint, TableSnapshot>();
  let host: LedgerHost | undefined;
  const process = await ingest(db, sweepTape().records, {
    start: 0n,
    core: sweepCore(options.core),
    user: [sweepWatcher(seen)],
    ledgerWorker: () => (host = startLedgerWorker({ loader: SWEEP_LOADER, loaderData: data })),
  });
  let status;
  let restarts = 0;
  let failure: string | null = null;
  try {
    if (options.halts === true) await halted(process);
    else await committed(process, BigInt(LAST), PATIENCE_MS * 2);
    status = process.handle.status();
    restarts = host?.restarts ?? 0;
    failure = host?.failure?.message ?? null;
  } finally {
    await process.close();
  }
  const last = (status.cursor ?? 0n) as bigint;
  const rows = await db.query(
    "SELECT height::text AS h, encode(state_key, 'hex') AS k, encode(state_root, 'hex') AS r FROM core_ledger_state.states ORDER BY height",
  );
  const shared = new Int32Array(memory);
  const counters = Object.fromEntries(Object.entries(COUNTERS).map(([name, slot]) => [name, Atomics.load(shared, slot)])) as Record<keyof typeof COUNTERS, number>;
  return {
    status,
    lines: process.lines,
    tables: await tablesByHeight(seen, db, last),
    states: rows.map((row) => `${row.h as string} ${row.k as string} ${row.r as string}`),
    counters,
    restarts,
    failure,
  };
}

/** The heights whose sweep tables differ between two runs, each with what differs; empty when they agree throughout. */
export function tableDifferences(got: ReadonlyMap<bigint, TableSnapshot>, expected: ReadonlyMap<bigint, TableSnapshot>): string[] {
  const text = (value: unknown): string => JSON.stringify(value, (_k, v: unknown) => (typeof v === "bigint" ? `${v}` : v));
  const problems: string[] = [];
  for (const [height, want] of expected) {
    const have = got.get(height);
    if (have === undefined) {
      problems.push(`no tables after ${height}`);
      continue;
    }
    const fields = (["cycle", "phase", "sweepAfter", "grey", "marks", "nodes"] as const).filter((field) => text(have[field]) !== text(want[field]));
    if (fields.length > 0) problems.push(`after ${height}: ${fields.join(", ")} differ`);
  }
  for (const height of got.keys()) if (!expected.has(height)) problems.push(`tables after ${height}, which the other run has not`);
  return problems;
}

/** The expected halt reason: `callback-error` at `height`, in `core-ledger-state`'s `on-compute`. [A160] */
export const refusalHalt = (height: bigint) => ({
  state: "halted",
  cursor: height - 1n,
  reason: { code: "callback-error", height, module: CORE_LEDGER_STATE_ID, point: "on-compute" },
});

export { hex };
