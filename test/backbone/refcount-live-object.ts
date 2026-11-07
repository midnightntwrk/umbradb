import type { CoreLedgerStateOptions } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { LedgerName } from "../../src/ledger/types.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import { extendedCases, type FixtureNode, TO_EMBEDDED } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory, type FixtureData, type Keeping } from "../ledger/fixtures/sweep-test-loader.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { SWEEP_LOADER, sweepTape } from "./ledger-graph-tapes.js";
import { readStopped } from "./refcount-histories.js";
import { type DagRun, runDag } from "./refcount-process.js";

/**
 * The runs of a live object holding a row the stored child lists no longer reach, shared by
 * `ledger-refcount-live-object.test.ts` and its negative control. Imports nothing of Vitest.
 * [R30, LG-11, LG-14, Q144 B]
 *
 * The extended DAG fixture runs through the real process (`./refcount-process.ts`) to {@link LIVE_AT}. With
 * `holds-by-reference` its test package writes what `writes-again` writes, but its live states keep each node in the
 * form the thread first built it: at TO_EMBEDDED `rewrite to-embedded` ({@link PARENT}) is written embedding
 * `small to-embedded` ({@link HELD}, x), whose row then has no stored reference and no root and is queued, while the
 * thread's live states still hold x by reference. At {@link LIVE_AT} the reclamation step deletes x and the worker is
 * told to evict it, which the package refuses as long as a live state holds it (`test/ledger/fixtures/
 * sweep-test-loader.ts`): on both tries, so the core ends the worker thread and applies the block again in a new one,
 * which loads the state at TO_EMBEDDED from the database (the path of `./eviction-restart.ts`).
 */

/** The block whose reclamation step deletes x: the one after TO_EMBEDDED. */
export const LIVE_AT = BigInt(TO_EMBEDDED + 1);

/** x: `small to-embedded`, referenced by its parent before TO_EMBEDDED and embedded in it from there on. */
export const HELD: FixtureNode = extendedCases(TO_EMBEDDED).toEmbedded.small;

/** x's parent, `rewrite to-embedded`, in the form written at TO_EMBEDDED (x embedded). */
export const PARENT: FixtureNode = extendedCases(TO_EMBEDDED).toEmbedded.node;

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** What a run gave. */
export interface LiveObjectRun {
  readonly run: DagRun;
  /** `height state_key state_root` of every `states` row, `0x`-less hex, in height order. */
  readonly states: readonly string[];
  /** The test package's counters over every thread of the run, by {@link COUNTERS}' names. */
  readonly counters: Readonly<Record<keyof typeof COUNTERS, number>>;
  /**
   * The state after {@link LIVE_AT} loaded from the database by a new ledger worker once the process stopped: its root
   * (`0x`-less hex), whether the worker read it from the database, and the states its package read from it; null when
   * the run did not commit {@link LIVE_AT}.
   */
  readonly loaded: { readonly stateRoot: string; readonly loaded: boolean; readonly storeLoads: number } | null;
}

/** What a run is given: how the package keeps nodes, and `core-ledger-state`'s options (a negative control's). */
export interface LiveObjectOptions {
  readonly keeping: Keeping;
  readonly core?: CoreLedgerStateOptions;
  /** Wait for a halt as well as {@link LIVE_AT}. */
  readonly halts?: boolean;
}

/** The counters in `memory`, by name. */
const countersOf = (memory: SharedArrayBuffer): Record<keyof typeof COUNTERS, number> => {
  const shared = new Int32Array(memory);
  return Object.fromEntries(Object.entries(COUNTERS).map(([name, slot]) => [name, Atomics.load(shared, slot)])) as Record<keyof typeof COUNTERS, number>;
};

/** Runs the extended DAG fixture on `db` to {@link LIVE_AT} (see the module comment). */
export async function runLiveObject(db: ProcessDatabase, options: LiveObjectOptions): Promise<LiveObjectRun> {
  const memory = countersMemory();
  const run = await runDag(db, {
    dag: "extended",
    data: { keeping: options.keeping, counters: memory },
    last: Number(LIVE_AT),
    ...(options.core === undefined ? {} : { core: options.core }),
    ...(options.halts === undefined ? {} : { halts: options.halts }),
  });
  const rows = await db.query(
    "SELECT height::text AS h, encode(state_key, 'hex') AS k, encode(state_root, 'hex') AS r FROM core_ledger_state.states ORDER BY height",
  );
  const states = rows.map((row) => `${row.h as string} ${row.k as string} ${row.r as string}`);
  const loaded = run.cursor === LIVE_AT ? await loadAfter(db, options.keeping) : null;
  return { run, states, counters: countersOf(memory), loaded };
}

/**
 * The state after {@link LIVE_AT} loaded from `db` by a new ledger worker (its test package told `keeping`), through a
 * read of the database API: its root, whether it was read from the database, and the states the package read. [R30]
 */
async function loadAfter(db: ProcessDatabase, keeping: Keeping): Promise<NonNullable<LiveObjectRun["loaded"]>> {
  const memory = countersMemory();
  const host = startLedgerWorker({ loader: SWEEP_LOADER, loaderData: { dag: "extended", keeping, counters: memory } satisfies FixtureData });
  try {
    const block = sweepTape(Number(LIVE_AT), "extended").chain[Number(LIVE_AT)];
    if (block === undefined) throw new Error(`the fixture's chain has no block ${LIVE_AT}`);
    const state = await readStopped(db, async (read) => {
      const [row] = await read.query(
        `SELECT b.ledger_version AS ledger, s.state_key AS key FROM core_ledger_state.states s
           JOIN core_block_commit.blocks b USING (height) WHERE s.height = $1`,
        [LIVE_AT],
      );
      if (row === undefined) throw new Error(`no state is stored after ${LIVE_AT}`);
      const stateKey = Uint8Array.from(row.key as Uint8Array);
      return host.load({ ledger: row.ledger as LedgerName, height: LIVE_AT, hash: block.hash, stateKey }, read);
    });
    return { stateRoot: hex(state.stateRoot), loaded: state.loaded, storeLoads: countersOf(memory).storeLoads };
  } finally {
    await host.close();
  }
}
