import { CORE_LEDGER_STATE_ID, type CoreLedgerStateOptions } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { type FixtureDag, LAST } from "../ledger/fixtures/sweep-fixture.js";
import type { FixtureData } from "../ledger/fixtures/sweep-test-loader.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { committed, ingest, PATIENCE_MS, until } from "./ingest-harness.js";
import { restartAt } from "./ledger-restart.js";
import { fixtureProblems } from "./refcount-checks.js";
import {
  recordingWorker,
  seenTables,
  SWEEP_LOADER,
  sweepCore,
  sweepTables,
  sweepTape,
  sweepWatcher,
  type TableSnapshot,
  workerRecord,
} from "./sweep-tapes.js";

/**
 * A run of the DAG fixture through the real process, shared by the reclamation tests on it (A105 and R12's controls,
 * R3, R11, A160): the tape of `./sweep-tapes.ts`, its test package told what `FixtureData` asks, `core-ledger-state`
 * with a negative control's rules, the watcher recording the tables at every cursor and every block's batch, and every
 * error `core-ledger-state`'s callbacks threw. Imports nothing of Vitest. [A105, R3, R11, LG-14]
 */

/** What a run is given. */
export interface DagRunOptions {
  /** The DAG: the original unless given. */
  readonly dag?: FixtureDag;
  /** The test package's data beyond the DAG (its keeping, a refusal, a fault). */
  readonly data?: Omit<FixtureData, "dag">;
  /** `core-ledger-state`'s rules (a negative control's). */
  readonly core?: CoreLedgerStateOptions;
  /** More `core` settings (`sweep: off`), and later revisions. */
  readonly settings?: Readonly<Record<string, unknown>>;
  readonly revisions?: readonly { readonly start: bigint; readonly settings: Readonly<Record<string, unknown>> }[];
  /** The tape's last height: the fixture's last unless given. */
  readonly last?: number;
  /** Wait for a halt as well as the last height (a run that does not halt there stops at the last height). */
  readonly halts?: boolean;
  /** The cursor the database already holds, for a run that restarts there: the tape answers the startup's checks. */
  readonly resume?: bigint;
}

/** What a run gave. */
export interface DagRun {
  readonly status: ReturnType<Awaited<ReturnType<typeof ingest>>["handle"]["status"]>;
  readonly lines: readonly string[];
  /** The tables after every height the run committed, the last read once the process stopped. */
  readonly tables: Map<bigint, TableSnapshot>;
  /** The tables as the watcher read them at each cursor, before the next block (none read after the process stopped). */
  readonly watched: ReadonlyMap<bigint, TableSnapshot>;
  /** Each block's batch as the watcher saw it (the worker's answer to the block's last apply). */
  readonly batches: Map<bigint, NodeBatch>;
  /** The keys each height had the worker evict. */
  readonly evicted: Map<bigint, string[]>;
  /** What `core-ledger-state`'s callbacks threw, in order. */
  readonly errors: readonly unknown[];
  readonly restarts: number;
  readonly failure: string | null;
  /** The cursor the run stopped at: the last height whose tables are recorded. */
  readonly cursor: bigint;
}

/** `module` with each callback's thrown error also pushed to `errors`. */
function capturing(module: ModuleDeclaration, errors: unknown[]): ModuleDeclaration {
  const points = Object.fromEntries(
    Object.entries(module.points).map(([name, point]) => [
      name,
      async (...args: unknown[]) => {
        try {
          return await (point as (...a: unknown[]) => Promise<unknown>)(...args);
        } catch (error) {
          errors.push(error);
          throw error;
        }
      },
    ]),
  );
  return { ...module, points: points as ModuleDeclaration["points"] };
}

/** Runs the fixture on `db` (see the module comment). */
export async function runDag(db: ProcessDatabase, options: DagRunOptions = {}): Promise<DagRun> {
  const dag = options.dag ?? "original";
  const last = options.last ?? LAST;
  const record = workerRecord();
  const seen = seenTables();
  const errors: unknown[] = [];
  const core = sweepCore(options.core).map((module) => (module.id === CORE_LEDGER_STATE_ID ? capturing(module, errors) : module));
  const data: FixtureData = { ...options.data, ...(dag === "original" ? {} : { dag }) };
  let host: LedgerHost | undefined;
  const { records } = sweepTape(last, dag);
  const process = await ingest(db, options.resume === undefined ? records : restartAt(records, options.resume), {
    start: 0n,
    core,
    user: [sweepWatcher(seen, record)],
    ...(options.settings === undefined ? {} : { settings: options.settings }),
    ...(options.revisions === undefined ? {} : { revisions: options.revisions }),
    ledgerWorker: () => (host = recordingWorker(startLedgerWorker({ loader: SWEEP_LOADER, loaderData: data }), record)),
  });
  let status;
  let restarts = 0;
  let failure: string | null = null;
  try {
    if (options.halts === true) {
      const stopped = (): boolean => process.handle.status().state === "halted" || process.handle.status().cursor === BigInt(last);
      await until(process, stopped, `a halt or the cursor at ${last}`, PATIENCE_MS * 2);
    } else await committed(process, BigInt(last), PATIENCE_MS * 2);
    status = process.handle.status();
    restarts = host?.restarts ?? 0;
    failure = host?.failure?.message ?? null;
  } finally {
    await process.close();
  }
  const cursor = (status.cursor ?? -1n) as bigint;
  const tables = new Map([...seen.tables].filter(([height]) => height <= cursor));
  if (cursor >= 0n) tables.set(cursor, await sweepTables(db));
  const batches = new Map([...seen.batches].filter(([height]) => height <= cursor));
  return { status, lines: process.lines, tables, watched: seen.tables, batches, evicted: record.evicted, errors, restarts, failure, cursor };
}

/** R3's problems on `run` after every height it committed (see `./refcount-checks.ts`). */
export function runProblems(run: DagRun, dag: FixtureDag = "original", on: (h: number) => boolean = () => true): string[] {
  return fixtureProblems(dag, run.tables, run.batches, Number(run.cursor), { on });
}
