import { expect } from "vitest";
import { z } from "zod";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_CONTRACT_STATES } from "../../src/backbone/core-contract-states/core-contract-states.js";
import { type CoreLedgerStateOptions, coreLedgerState } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { NodeBatch } from "../../src/ledger/types.js";
import { startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import { committed, ingest } from "./ingest-harness.js";
import { recordingWorker, sweepTables, type TableSnapshot, type WorkerRecord, workerRecord } from "./ledger-graph-tapes.js";
import { cappedAt, devnetSettings } from "./ledger-restart.js";
import { NO_TABLES, type StoredCheck, storedProblems } from "./refcount-checks.js";

/**
 * R3 on a recorded tape (`UMBRADB_TAPES`; the test skipped by name without its tape), on PostgreSQL 18 and PGlite
 * 0.5.10: the tape replayed from genesis through the process, with the ledger's core modules and `core-contract-states`
 * (so that the contract keys `core-ledger-state` persists are among those (b) holds to their rows), and the check
 * (`./refcount-checks.ts`, {@link storedProblems}) after every 100th height and the last ({@link sampledHeights}): a
 * sample, not every block, so that the replays keep to the conformance gate's time. One test file per tape and backend
 * (`ledger-refcount-tape-*.test.ts`; the devnet's, short, holds both), so that the replays run side by side.
 *
 * A watcher module requiring `ledger-state`, so that it runs after `core-ledger-state`'s `on-compute`, does the reading:
 * - at a sampled height h, it keeps the tables as committed at h − 1, read through the check's own queries
 *   (`sweepTables`, without digests), and the batch the worker flushed for h (`recordingWorker`);
 * - at h + 1, it reads the tables after h and runs the check, keeping only its problems and counts, so that a replay
 *   holds at most two heights' tables; the last height's tables are read once the process stopped.
 *
 * (c)'s `R_{h−1}`, `R_h` and `K_h` come from the stored rows and the block's written nodes (`storedReach`), and the test
 * logs, per tape and backend, how many rows were outside `R_{h−1} ∪ R_h` at each height checked that had any (shown
 * with `--reporter=verbose --silent=false`).
 *
 * The rows stored after a block are few (hundreds on stagenet and preprod, tens on the devnet), most of a state's nodes
 * being embedded in them, so the replay itself takes most of the time: on this machine, at a load average near 30, a
 * 10,001-height replay took about 28 minutes on PostgreSQL and 6 on PGlite (2026-11-03).
 */

/** The recorded tapes R3 is checked on. */
export type RefcountTape = "preprod-0-10000" | "stagenet-0-10000" | "devnet-v8-v9-0-235";

/** A replay of 10,001 heights and the checks along it, on a loaded machine. */
const REPLAY_MS = 3 * 3_600_000;

/** The heights between two checks. */
const EVERY = 100n;

/** The devnet's v8 → v9 conversion: U, the last v8 block; F, the first v9 one, which releases the v8 state; F + 1. */
const DEVNET_CONVERSION: readonly bigint[] = [102n, 103n, 104n];

/**
 * The heights R3 is checked at on tape `name` replayed to `last`: every 100th from 0 and the last; on the devnet also
 * its conversion's U, F and F + 1, the block whose cascade deletes the released v8 state's rows.
 */
export function sampledHeights(name: RefcountTape, last: bigint): bigint[] {
  const heights = new Set<bigint>();
  for (let h = 0n; h <= last; h += EVERY) heights.add(h);
  heights.add(last);
  if (name === "devnet-v8-v9-0-235") for (const h of DEVNET_CONVERSION) if (h <= last) heights.add(h);
  return [...heights].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

type Reader = Parameters<typeof sweepTables>[0];

/** What the watcher keeps between the heights of a replay (see the module comment). */
class Sampler {
  readonly checks: StoredCheck[] = [];
  /** A sampled height whose check waits for the tables after it: the tables after h − 1, and h's batch. */
  #pending: { readonly height: bigint; readonly before: TableSnapshot; readonly batch: NodeBatch | undefined } | null = null;

  constructor(
    readonly sampled: ReadonlySet<bigint>,
    readonly record: WorkerRecord,
  ) {}

  /** At height h's `on-compute`, `read` holding the tables after h − 1. */
  async atCompute(height: bigint, read: Reader): Promise<void> {
    let after: TableSnapshot | null = null;
    if (this.#pending?.height === height - 1n) {
      after = await sweepTables(read, { digests: false });
      this.check(after);
    }
    if (this.sampled.has(height)) {
      const before = height === 0n ? NO_TABLES : (after ?? (await sweepTables(read, { digests: false })));
      this.#pending = { height, before, batch: this.record.batches.get(height) };
    }
    // Only the heights still to check stay recorded.
    for (const recorded of [...this.record.batches.keys()]) if (recorded < height) this.record.batches.delete(recorded);
    for (const recorded of [...this.record.evicted.keys()]) if (recorded < height) this.record.evicted.delete(recorded);
  }

  /** The check of the pending height, given the tables after it; none without one. */
  check(after: TableSnapshot): void {
    const pending = this.#pending;
    if (pending === null) return;
    this.#pending = null;
    if (pending.batch === undefined) {
      this.checks.push({ height: pending.height, rows: after.rows.size, outside: 0, problems: [`after ${pending.height}: no batch recorded`] });
      return;
    }
    try {
      this.checks.push(storedProblems(pending.height, pending.before, after, pending.batch));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.checks.push({ height: pending.height, rows: after.rows.size, outside: 0, problems: [`after ${pending.height}: the check failed: ${message}`] });
    }
  }
}

/** The watcher module of a replay (see the module comment): `refcount-tape-watch`, requiring `ledger-state`. */
function sampling(sampler: Sampler): ModuleDeclaration {
  return {
    id: "refcount-tape-watch",
    version: "1.0.0",
    side: "public",
    requires: ["block-header", "ledger-state"],
    provides: [{ name: "refcount-tape-watch-rows", lifetimes: ["table"], table: { schema: "refcount_tape_watch", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE refcount_tape_watch.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-compute"(_p, b, read) {
        await sampler.atCompute(b.height, read);
      },
    },
  };
}

/** A tape's `core` settings: its network's, the devnet's own. */
export const tapeSettings = (found: FoundTape): Readonly<Record<string, unknown>> =>
  found.tape.name === "devnet-v8-v9-0-235" ? devnetSettings(found) : { network: found.tape.network };

/** What a replay is given. */
export interface TapeReplayOptions {
  /** The last height: the tape's end unless given. */
  readonly last?: bigint;
  /** `core-ledger-state`'s rules (a negative control's), given the worker's record of the run. */
  readonly core?: (record: WorkerRecord) => CoreLedgerStateOptions;
}

/** What a replay gave. */
export interface TapeReplay {
  readonly status: ReturnType<Awaited<ReturnType<typeof ingest>>["handle"]["status"]>;
  readonly last: bigint;
  /** The check at each sampled height, in height order. */
  readonly checks: readonly StoredCheck[];
}

/** Replays tape `found` from genesis to its end (or `last`) on `backend` with the check at its sampled heights. */
export async function replayRefcountTape(found: FoundTape, backend: ProcessBackend, options: TapeReplayOptions = {}): Promise<TapeReplay> {
  const name = found.tape.name as RefcountTape;
  const last = options.last ?? BigInt(found.tape.to);
  const record = workerRecord();
  const sampler = new Sampler(new Set(sampledHeights(name, last)), record);
  const core = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, coreLedgerState(options.core?.(record) ?? {}), CORE_CONTRACT_STATES];
  await backend.start();
  try {
    const db = await backend.database();
    const process = await ingest(db, cappedAt(found.read().records, last), {
      start: 0n,
      stop: last,
      core,
      user: [sampling(sampler)],
      settings: tapeSettings(found),
      ledgerWorker: () => recordingWorker(startLedgerWorker(), record),
    });
    let status;
    try {
      await committed(process, last, REPLAY_MS);
      status = process.handle.status();
    } finally {
      await process.close();
    }
    sampler.check(await sweepTables(db, { digests: false }));
    return { status, last, checks: sampler.checks };
  } finally {
    await backend.stop();
  }
}

/** The rows outside `R_{h−1} ∪ R_h` at the heights checked, as the test logs them. */
export function outsideReport(checks: readonly StoredCheck[]): string {
  const some = checks.filter((check) => check.outside > 0);
  const most = checks.reduce((top, check) => (check.outside > top.outside ? check : top), checks[0] as StoredCheck);
  return some.length === 0
    ? `no row outside R_{h−1} ∪ R_h at any of them`
    : `rows outside R_{h−1} ∪ R_h at ${some.length} of them (${some.map((check) => `${check.outside} at ${check.height}`).join(", ")}; at most ${most.outside})`;
}

/** Registers the test of tape `name` on each backend of `kinds` (both unless given; see the module comment). */
export function refcountTapeTests(name: RefcountTape, kinds: readonly ProcessBackend["kind"][] = ["postgres", "pglite"]): void {
  for (const backend of PROCESS_BACKENDS.filter((candidate) => kinds.includes(candidate.kind))) {
    tapeTest(
      name,
      `on ${name}, ${backend.name}: after every 100th height and the last${name === "devnet-v8-v9-0-235" ? " (and the conversion's U, F, F + 1)" : ""}, the check of the database through its own queries finds (a)–(d), with R_{h−1}, R_h and K_h from the stored rows`,
      async (found) => {
        const replay = await replayRefcountTape(found, backend);
        expect(replay.status).toMatchObject({ cursor: replay.last, reason: null });
        expect(replay.checks.map((check) => check.height)).toEqual(sampledHeights(name, replay.last));
        expect(replay.checks.flatMap((check) => check.problems)).toEqual([]);
        const final = replay.checks.at(-1) as StoredCheck;
        expect(final.rows).toBeGreaterThan(0);
        console.info(
          `R3 on ${name} (${backend.name}): ${replay.checks.length} heights checked, no problem; ${final.rows} rows after ` +
            `${replay.last}; ${outsideReport(replay.checks)}`,
        );
      },
      { timeoutMs: REPLAY_MS + 1_800_000 },
    );
  }
}
