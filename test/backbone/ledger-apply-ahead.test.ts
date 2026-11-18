import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { startTrace, stopTrace } from "../../src/trace/trace.js";
import { FLIP, LAST } from "../ledger/fixtures/sweep-fixture.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import {
  AHEAD,
  aheadOrderProblems,
  aheadTrace,
  AT_ITS_TURN,
  type Event,
  evictedAt,
  holdsAgain,
  orderHost,
  orderLoop,
  tablesText,
  windowRaisedAt,
} from "./ledger-apply-ahead.js";
import { fixtureProblems } from "./refcount-checks.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "./refcount-process.js";
import type { FixtureDag } from "../ledger/fixtures/sweep-fixture.js";

/**
 * The next block applied ahead (`src/backbone/core-ledger-state/apply-ahead.ts`) through the real process, on
 * PostgreSQL 18 and PGlite 0.5.10, over the DAG fixtures and the node source of their tapes, which prepares heights
 * ahead:
 * - on the one-form, extended and flip DAGs, with `applyAhead` on (the default) the run stores at every height what the
 *   run with it off stores, with the same chain of step outputs and the same evictions; nearly every block from 2 on is
 *   applied ahead and its result used, none dropped, and the worker is never restarted; off, none is applied ahead;
 * - the flip DAG brings back at FLIP + 2 nodes that FLIP + 1 deleted: applied ahead after that deletion was sent, FLIP + 2
 *   flushes them again and its result is used;
 * - a loop and a worker that record the order show every apply ahead of a block sent inside the `on-settle` point of the
 *   block before, after that settle's eviction when it sends one, and none before it; with `sweep` off, where a settle
 *   evicts nothing, the apply ahead is sent there all the same;
 * - a block whose input at its turn differs from the one built ahead (the retention window raised once its turn came,
 *   so it releases no state, while its apply ahead released the state before it) has its result dropped: the worker
 *   thread is restarted once, the block applied at its turn, and the run stores what the run with it off stores.
 */

describe.each(PROCESS_BACKENDS)("the next block applied ahead, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);
  afterEach(() => stopTrace());

  /** A traced run of `dag` with `settings`. */
  async function traced(
    dag: FixtureDag,
    settings: Readonly<Record<string, unknown>>,
    options: Omit<DagRunOptions, "dag" | "settings"> = {},
  ): Promise<{ run: DagRun; trace: ReturnType<typeof aheadTrace> }> {
    const trace = aheadTrace();
    startTrace(trace.sink, { steps: false });
    try {
      const run = await runDag(await backend.database(), { ...options, dag, settings });
      return { run, trace };
    } finally {
      stopTrace();
    }
  }

  it.each(["one-form", "extended", "flip"] as const)("on the %s DAG stores at every height what a run without it stores, nearly every block applied ahead and used, the worker never restarted", async (dag) => {
    const serial = await traced(dag, AT_ITS_TURN);
    expect(serial.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(runProblems(serial.run, dag)).toEqual([]);
    // Off: none.
    expect(serial.trace.used()).toEqual([]);
    expect(serial.trace.dropped()).toEqual([]);
    const ahead = await traced(dag, AHEAD);
    expect(ahead.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(runProblems(ahead.run, dag)).toEqual([]);
    expect(ahead.run.restarts).toBe(0);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
    expect(ahead.trace.chain()).toEqual(serial.trace.chain());
    expect([...ahead.run.evicted]).toEqual([...serial.run.evicted]);
    // On: every block from 2 on whose height the source had prepared at the settle of the block before, which is
    // nearly all of them.
    expect(ahead.trace.dropped()).toEqual([]);
    expect(ahead.trace.used().length).toBeGreaterThan(LAST / 2);
    expect(Math.min(...ahead.trace.used())).toBeGreaterThanOrEqual(2);
    if (dag === "flip") {
      // The case is in the fixture: FLIP + 1 deletes nodes that the batch of FLIP + 2 holds again.
      const deleted = evictedAt(serial.run, FLIP + 1);
      expect(holdsAgain(serial.run, FLIP + 2, deleted)).toBe(true);
      expect(holdsAgain(ahead.run, FLIP + 2, deleted)).toBe(true);
    }
  }, PATIENCE_MS * 6);

  it.each([["on"], ["off"]] as const)("sends every apply ahead inside the on-settle point of the block before, after its eviction, and none before (sweep %s)", async (sweep) => {
    const extra = sweep === "off" ? { sweep: "off" } : {};
    const events: Event[] = [];
    const settling = { height: null as bigint | null };
    const run = await runDag(await backend.database(), {
      dag: "flip",
      settings: { ...AHEAD, ...extra },
      loop: orderLoop(events, settling),
      worker: orderHost(events, settling),
    });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(aheadOrderProblems(events)).toEqual([]);
    const aheads = events.filter(([word]) => word === "ahead").map(([, height]) => height);
    expect(aheads.length).toBeGreaterThan(LAST / 2);
    expect(new Set(aheads).size).toBe(aheads.length);
    const evictions = events.filter(([word]) => word === "evict");
    if (sweep === "off") {
      // Nothing evicted: each apply ahead follows its settle's computation.
      expect(evictions).toEqual([]);
    } else {
      // Most settles evict: the apply ahead of the next block is the request sent right after their eviction.
      const followed = events.filter(([word, height], index) => word === "evict" && events[index + 1]?.[0] === "ahead" && events[index + 1]?.[1] === height + 1n);
      expect(followed.length).toBeGreaterThan(LAST / 2);
    }
  }, PATIENCE_MS * 4);

  it("drops the result of a block whose input at its turn differs from the one built ahead: one restart, and the same stored contents", async () => {
    const at = 30n;
    const serialWindow = windowRaisedAt(at);
    const serial = await traced("original", AT_ITS_TURN, { core: serialWindow.core, user: serialWindow.user });
    const window = windowRaisedAt(at);
    const ahead = await traced("original", AHEAD, { core: window.core, user: window.user });
    for (const { run } of [serial, ahead]) {
      expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(fixtureProblems("original", run.tables, run.batches, LAST, { retainedFrom: window.window })).toEqual([]);
    }
    // The window was raised: the state before the block is still stored after it.
    expect(serial.run.tables.get(at)?.roots.size).toBe(2);
    expect(serial.run.restarts).toBe(0);
    expect(ahead.run.restarts).toBe(1);
    expect(ahead.trace.dropped()).toEqual([Number(at)]);
    expect(ahead.trace.used().length).toBeGreaterThan(LAST / 2);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
  }, PATIENCE_MS * 4);
});
