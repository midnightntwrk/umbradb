import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { startTrace, stopTrace } from "../../src/trace/trace.js";
import { type FixtureDag, FLIP, LAST } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { refusalHalt, refusalHeight } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import {
  AHEAD,
  aheadOrderProblems,
  aheadTrace,
  AT_ITS_TURN,
  type Event,
  evictedAt,
  holdsAgain,
  losesNetWriteOnce,
  losingCommitLoop,
  orderHost,
  orderLoop,
  restartAfterAheads,
  tablesText,
} from "./ledger-apply-ahead.js";
import { modelOfFixture } from "./ledger-graph-tapes.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "./refcount-process.js";

/**
 * The next block applied ahead (`src/backbone/core-ledger-state/apply-ahead.ts`) on the process's failure paths, on
 * PostgreSQL 18 and PGlite 0.5.10, over the DAG fixtures, each run against the run that applies every block at its
 * turn (`applyAhead` off) with the same failure. Each of the events after which the block an apply ahead ran on top of
 * is not known to be the committed one drops that result:
 * - a lost connection at h's net write, inside `on-settle`, after h + 1's apply ahead was sent: the settle throws, the
 *   result is dropped at once, h is made again (from its kept items: the node source prepares the heights above afresh
 *   in the loop's run after the retry, so h's second settle has no h + 1 to apply ahead), and h + 1 is applied at its
 *   turn, with no restart: the same tables and cursor as the run without blocks ahead;
 * - h's `COMMIT` lost before it landed (h made again, as above) and after it landed (h committed, and h + 1 does not
 *   continue it, so h + 1's result is dropped and h + 1 applied at its turn): the same tables and cursor;
 * - the package traps on a block's apply, here applied ahead: the process halts at that block with the halt of the run
 *   without blocks ahead (the same cursor, reason and failure), the blocks below it stored as there;
 * - a package that refuses to forget a node in every thread: one restart at the block that deletes it, which commits,
 *   no halt, and the tables of a run with no refusal, as without blocks ahead;
 * - the same with the restart turned off: the block halts in `on-settle`, nothing of it stored, as without;
 * - a result applied ahead in a thread that a refused eviction ended (its restart made to wait for that apply's answer,
 *   so that the result comes from the ended thread, which still counts the deleted nodes stored): dropped by rule 2,
 *   the block applied at its turn in the new thread; the tables of a run with no refusal;
 * - on PGlite and PostgreSQL alike, each apply reading a stored node through the node store (the extended package's
 *   `applyReads`), with a refused eviction restarting the thread: the applies ahead in the new thread read their node
 *   while the block before's transaction is open or the next block's `on-compute` holds its read, and the run ends.
 * The writer's session replaced between two heights is in `ledger-apply-ahead-session.test.ts` (PostgreSQL only).
 */

/** The block whose apply the test package traps on. */
const TRAP = 50;

/** The process's log line of a retry of a lost database connection. */
const RETRIED = /processing retries in \d+ ms \(database-retrying/;

describe.each(PROCESS_BACKENDS)("blocks applied ahead on failure paths, on $name", (backend: ProcessBackend) => {
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

  it("a lost connection at h's net write after h + 1's apply ahead was sent: dropped at once, h made again, h + 1 applied at its turn; the tables and cursor of a run without blocks ahead", async () => {
    const h = BigInt(FLIP + 1);
    const serial = await traced("flip", AT_ITS_TURN, { core: losesNetWriteOnce(h) });
    expect(serial.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(serial.run.lines.filter((line) => RETRIED.test(line))).toHaveLength(1);
    const events: Event[] = [];
    const settling = { height: null as bigint | null };
    const ahead = await traced("flip", AHEAD, { core: losesNetWriteOnce(h), loop: orderLoop(events, settling), worker: orderHost(events, settling) });
    expect(ahead.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(ahead.run.lines.filter((line) => RETRIED.test(line))).toHaveLength(1);
    expect(runProblems(ahead.run, "flip")).toEqual([]);
    // h + 1 was applied ahead by h's first attempt, after its eviction; that result was not used (its transaction
    // failed): h + 1 was applied at its turn, after h committed, with no restart (the same input).
    expect(events.filter(([word, height]) => word === "ahead" && height === h + 1n)).toHaveLength(1);
    expect(events.filter(([word, height]) => word === "apply" && height === h + 1n)).toHaveLength(1);
    expect(events.filter(([word, height]) => word === "settle" && height === h)).toHaveLength(2);
    expect(aheadOrderProblems(events)).toEqual([]);
    expect(ahead.trace.dropped()).toEqual([Number(h + 1n)]);
    expect(ahead.trace.used()).not.toContain(Number(h + 1n));
    expect(ahead.trace.used().length).toBeGreaterThan(LAST / 2);
    expect(ahead.run.restarts).toBe(0);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
  }, PATIENCE_MS * 4);

  it.each(["lost", "landed"] as const)("h's COMMIT %s with h + 1 applied ahead: the tables and cursor of a run without blocks ahead", async (how) => {
    const h = BigInt(FLIP + 1);
    const serial = await traced("flip", AT_ITS_TURN, { loop: losingCommitLoop(h, how) });
    expect(serial.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const ahead = await traced("flip", AHEAD, { loop: losingCommitLoop(h, how) });
    expect(ahead.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(ahead.run.lines.filter((line) => RETRIED.test(line))).toHaveLength(1);
    expect(runProblems(ahead.run, "flip")).toEqual([]);
    expect(ahead.run.restarts).toBe(0);
    // Landed: h committed, and h + 1 does not continue it. Lost: h was made again, its first attempt's result dropped.
    // Either way h + 1's result applied ahead is dropped, and h + 1 applied at its turn.
    expect(ahead.trace.dropped()).toEqual([Number(h + 1n)]);
    expect(ahead.trace.used()).not.toContain(Number(h + 1n));
    expect(ahead.trace.used()).toContain(Number(h + 2n));
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
  }, PATIENCE_MS * 4);

  it("a block whose apply traps, applied ahead while the block below it is processed, halts the process at that block with the halt of a run without blocks ahead; the blocks below it stored the same", async () => {
    const trap = { trapAt: `${TRAP}` };
    const serial = await traced("original", AT_ITS_TURN, { data: trap });
    expect(serial.run.status).toMatchObject({
      state: "halted",
      cursor: BigInt(TRAP - 1),
      reason: { code: "callback-error", height: BigInt(TRAP), module: "core-ledger-state", point: "on-compute" },
    });
    expect(serial.run.failure).toMatch(/RuntimeError: unreachable/);
    const events: Event[] = [];
    const settling = { height: null as bigint | null };
    const ahead = await traced("original", AHEAD, { data: trap, loop: orderLoop(events, settling), worker: orderHost(events, settling) });
    // The trapping block was applied ahead, and again at its turn.
    expect(events.filter(([word, height]) => word === "ahead" && height === BigInt(TRAP))).toHaveLength(1);
    expect(events.filter(([word, height]) => word === "apply" && height === BigInt(TRAP))).toHaveLength(1);
    // The halt is the run's without blocks ahead: the same block, cursor, reason and failure.
    expect(ahead.run.status.state).toBe(serial.run.status.state);
    expect(ahead.run.status.reason).toEqual(serial.run.status.reason);
    expect(ahead.run.status.cursor).toBe(serial.run.status.cursor);
    expect(ahead.run.failure).toBe(serial.run.failure);
    const messages = (run: DagRun): string[] => run.errors.map((error) => (error as Error).message);
    expect(messages(ahead.run)).toEqual(messages(serial.run));
    expect(runProblems(ahead.run)).toEqual([]);
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
    // Its trap ahead ended that thread only: a new one took its place, and the block's own apply trapped there.
    expect(ahead.run.restarts).toBe(1);
  }, PATIENCE_MS * 4);

  it("a package that refuses to forget a node in every thread: one restart, the block commits, no halt, and the tables of a run with no refusal, as without blocks ahead", async () => {
    const h = refusalHeight();
    const key = modelOfFixture()[Number(h)]?.deleted[0];
    expect(key).toBeDefined();
    const refuse = (memory: SharedArrayBuffer) => ({ counters: memory, refuseKey: key as string, threads: 1_000 });
    const counted = (memory: SharedArrayBuffer, slot: keyof typeof COUNTERS): number => Atomics.load(new Int32Array(memory), COUNTERS[slot]);
    const plain = await traced("original", AT_ITS_TURN);
    expect(plain.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    for (const settings of [AT_ITS_TURN, AHEAD]) {
      const memory = countersMemory();
      const { run } = await traced("original", settings, { data: refuse(memory) });
      const where = `applyAhead ${settings.applyAhead}`;
      expect(run.status, where).toMatchObject({ cursor: BigInt(LAST), reason: null });
      expect(run.tables.get(h)?.rows.has(key as string), where).toBe(false);
      expect(run.restarts, where).toBe(1);
      // The package's first try and the worker's second, once.
      expect(counted(memory, "refusals"), where).toBe(2);
      expect(counted(memory, "storeLoadHeight"), where).toBe(Number(h));
      expect(runProblems(run), where).toEqual([]);
      expect(tablesText(run), where).toBe(tablesText(plain.run));
    }
  }, PATIENCE_MS * 6);

  it("a refused eviction with the restart turned off: the block halts in on-settle, nothing of it stored, as without blocks ahead", async () => {
    const h = refusalHeight();
    const refuse = { counters: countersMemory(), refuseAt: `${h}`, threads: 1 };
    const serial = await traced("original", AT_ITS_TURN, { data: refuse, core: { restartOnRefusedEviction: false } });
    const ahead = await traced("original", AHEAD, { data: { ...refuse, counters: countersMemory() }, core: { restartOnRefusedEviction: false } });
    for (const { run } of [serial, ahead]) {
      expect(run.status).toMatchObject(refusalHalt(h));
      expect(run.restarts).toBe(0);
      expect(run.tables.get(h - 1n)?.states.has(h)).toBe(false);
    }
    expect(tablesText(ahead.run)).toBe(tablesText(serial.run));
  }, PATIENCE_MS * 4);

  it("a result applied ahead in a thread that a refused eviction ended is dropped (rule 2), the block applied at its turn in the new thread; the tables of a run with no refusal", async () => {
    const plain = await traced("flip", AT_ITS_TURN);
    expect(plain.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(holdsAgain(plain.run, FLIP + 2, evictedAt(plain.run, FLIP + 1))).toBe(true);
    const ahead = await traced("flip", AHEAD, {
      data: { counters: countersMemory(), refuseAt: `${FLIP + 1}`, threads: 1 },
      worker: restartAfterAheads,
    });
    expect(ahead.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(ahead.run.restarts).toBe(1);
    expect(ahead.trace.dropped()).toEqual([FLIP + 2]);
    expect(runProblems(ahead.run, "flip")).toEqual([]);
    expect(tablesText(ahead.run)).toBe(tablesText(plain.run));
  }, PATIENCE_MS * 4);

  it("each apply reading a stored node, a refused eviction restarting the thread: the applies ahead in the new thread read theirs, and the run ends with the tables of a run with no refusal", async () => {
    const h = 20n;
    const plain = await traced("extended", AHEAD, { data: { applyReads: true } });
    expect(plain.run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    const memory = countersMemory();
    const { run, trace } = await traced("extended", AHEAD, { data: { applyReads: true, counters: memory, refuseAt: `${h}`, threads: 1 } });
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(run.restarts).toBe(1);
    expect(Atomics.load(new Int32Array(memory), COUNTERS.threads)).toBe(2);
    // The new thread applied blocks ahead from h + 2 on, each reading its node.
    expect(trace.used().filter((height) => height > Number(h) + 1).length).toBeGreaterThan(LAST - Number(h) - 10);
    expect(runProblems(run, "extended")).toEqual([]);
    expect(tablesText(run)).toBe(tablesText(plain.run));
  }, PATIENCE_MS * 4);
});
