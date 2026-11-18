import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { startTrace, stopTrace } from "../../src/trace/trace.js";
import { type FixtureDag, LAST } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import {
  AHEAD,
  aheadTrace,
  AT_ITS_TURN,
  type Event,
  failsAheadAfterPersist,
  keepsAheadLoop,
  losesComputeReadOnce,
  orderHost,
  tablesText,
  windowRaisedAt,
  windowRaisedWhenNetWriteLost,
} from "./ledger-apply-ahead.js";
import { fixtureProblems } from "./refcount-checks.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "./refcount-process.js";

/**
 * The next block applied ahead (`src/backbone/core-ledger-state/apply-ahead.ts`) when the worker's thread cannot give
 * the block's result at its turn, through the real process, worker thread and engine on PostgreSQL 18 and PGlite
 * 0.5.10, each run against the run that applies every block at its turn (`applyAhead` off) with the same events:
 * - an apply ahead that fails with an ordinary error after the engine persisted the new state's key (the test package's
 *   release throws once): the package holds that key, so the thread applies no block afterwards; the block is applied
 *   at its turn in a new thread, and its state key's root count rises by 1, as without blocks ahead;
 * - a block whose input at its turn differs from the one built ahead (the retention window raised once its turn came),
 *   whose `on-compute` then loses its read's connection before it reads the block before, and is run again: the block
 *   is applied from the turn's input in a new thread, never answered with the result of the input built ahead;
 * - a height made again whose settle finds the next block prepared (a loop that keeps what it gave), that block's input
 *   having changed since the first settle sent its apply ahead (the retention window raised when the net write was
 *   lost): no second apply ahead is sent for a block the thread holds, and the block is applied from the turn's input
 *   in a new thread.
 * Each run stores at every height what the run without blocks ahead stores, and restarts the worker thread once.
 */

/** The block whose apply ahead the tests fail or change the input of. */
const AT = 30n;

/** The process's log line of a retry of a lost database connection. */
const RETRIED = /processing retries in \d+ ms \(database-retrying/;

describe.each(PROCESS_BACKENDS)("a block applied ahead that its thread cannot give at its turn, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  /** A traced run of `dag` with `settings` and `options`, waiting for a halt as well as for the last height. */
  async function traced(
    dag: FixtureDag,
    settings: Readonly<Record<string, unknown>>,
    options: Omit<DagRunOptions, "dag" | "settings"> = {},
  ): Promise<{ run: DagRun; trace: ReturnType<typeof aheadTrace> }> {
    const trace = aheadTrace();
    startTrace(trace.sink, { steps: false });
    try {
      const run = await runDag(await backend.database(), { ...options, dag, settings, halts: true });
      return { run, trace };
    } finally {
      stopTrace();
    }
  }

  it("an apply ahead that fails after the new state's key was persisted: the block is applied at its turn in a new thread, its state key's root count rising by 1 as without blocks ahead", async () => {
    const counted = (memory: SharedArrayBuffer, slot: keyof typeof COUNTERS): number => Atomics.load(new Int32Array(memory), COUNTERS[slot]);
    const serialMemory = countersMemory();
    const serial = await traced("original", AT_ITS_TURN, {
      data: { counters: serialMemory, releaseFailsAt: `${AT}` },
      worker: failsAheadAfterPersist(AT, serialMemory),
    });
    expect(serial.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    // Without blocks ahead nothing arms the failure.
    expect(counted(serialMemory, "releaseFailures")).toBe(0);
    const memory = countersMemory();
    const ahead = await traced("original", AHEAD, { data: { counters: memory, releaseFailsAt: `${AT}` }, worker: failsAheadAfterPersist(AT, memory) });
    // The apply ahead of the block failed in the package, once, after its state key was persisted.
    expect(counted(memory, "releaseFailures")).toBe(1);
    expect(ahead.trace.dropped()).toEqual([Number(AT)]);
    // The root counts the block wrote: its state key raised by 1, the state before it released, as at its turn alone.
    const counts = (run: DagRun) => (run.batches.get(AT)?.rootCounts ?? []).map((count) => count.delta).sort();
    expect(counts(serial.run)).toEqual([-1, 1]);
    expect(counts(ahead.run)).toEqual([-1, 1]);
    expect(ahead.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(runProblems(ahead.run)).toEqual([]);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
    // The thread that failed was ended before the block's apply at its turn: two threads loaded the package.
    expect(ahead.run.restarts).toBe(1);
    expect(counted(memory, "threads")).toBe(2);
    expect(counted(memory, "storeLoadHeight")).toBe(Number(AT) - 1);
    expect(ahead.trace.used().length).toBeGreaterThan(LAST / 2);
  }, PATIENCE_MS * 4);

  it("a block whose input at its turn differs, its on-compute failing before it read the block before and run again: applied from the turn's input in a new thread, never answered with the result of the input built ahead", async () => {
    const serialWindow = windowRaisedAt(AT);
    const serial = await traced("original", AT_ITS_TURN, {
      core: { ...serialWindow.core, checkKept: true },
      user: serialWindow.user,
      modules: losesComputeReadOnce(AT),
    });
    const window = windowRaisedAt(AT);
    const ahead = await traced("original", AHEAD, { core: { ...window.core, checkKept: true }, user: window.user, modules: losesComputeReadOnce(AT) });
    for (const { run } of [serial, ahead]) {
      expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(run.lines.filter((line) => RETRIED.test(line))).toHaveLength(1);
      expect(fixtureProblems("original", run.tables, run.batches, LAST, { retainedFrom: window.window })).toEqual([]);
    }
    // The window was raised: the block released nothing, so the state before it is still stored after it.
    expect(serial.run.tables.get(AT)?.roots.size).toBe(2);
    expect(ahead.run.tables.get(AT)?.roots.size).toBe(2);
    expect((ahead.run.batches.get(AT)?.rootCounts ?? []).map((count) => count.delta)).toEqual([1]);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
    expect(serial.run.restarts).toBe(0);
    expect(ahead.run.restarts).toBe(1);
    expect(ahead.trace.used()).not.toContain(Number(AT));
  }, PATIENCE_MS * 4);

  it("a height made again whose settle finds the next block prepared, that block's input changed since its apply ahead was sent: no second apply ahead for a block the thread holds, and the block applied from the turn's input in a new thread", async () => {
    const h = AT - 1n;
    const serialWindow = windowRaisedWhenNetWriteLost(h);
    const serial = await traced("original", AT_ITS_TURN, { core: serialWindow.core, loop: keepsAheadLoop() });
    const window = windowRaisedWhenNetWriteLost(h);
    const events: Event[] = [];
    const ahead = await traced("original", AHEAD, { core: window.core, loop: keepsAheadLoop(), worker: orderHost(events, { height: null }) });
    for (const { run } of [serial, ahead]) {
      expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(run.lines.filter((line) => RETRIED.test(line))).toHaveLength(1);
      expect(fixtureProblems("original", run.tables, run.batches, LAST, { retainedFrom: window.window })).toEqual([]);
    }
    // The block's apply ahead was sent once, by the first settle of the height before it; the settle of that height
    // made again sent none, and the block was applied at its turn.
    expect(events.filter(([word, height]) => word === "ahead" && height === AT)).toHaveLength(1);
    expect(events.filter(([word, height]) => word === "apply" && height === AT).length).toBeGreaterThanOrEqual(1);
    // The window was raised: the block released nothing.
    expect((serial.run.batches.get(AT)?.rootCounts ?? []).map((count) => count.delta)).toEqual([1]);
    expect((ahead.run.batches.get(AT)?.rootCounts ?? []).map((count) => count.delta)).toEqual([1]);
    expect(ahead.run.tables.get(AT)?.roots.size).toBe(2);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
    expect(ahead.run.restarts).toBe(1);
    expect(ahead.trace.dropped()).toEqual([Number(AT)]);
    expect(ahead.trace.used()).not.toContain(Number(AT));
  }, PATIENCE_MS * 4);
});
