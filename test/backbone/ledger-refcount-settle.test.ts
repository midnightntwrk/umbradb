import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_LEDGER_STATE_ID } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import type { BlockWriteHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockWrites } from "../../src/db/write-handles.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { LAST } from "../ledger/fixtures/sweep-fixture.js";
import { COUNTERS, countersMemory } from "../ledger/fixtures/sweep-test-loader.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { tableDifferences } from "./eviction-restart.js";
import { PATIENCE_MS } from "./ingest-harness.js";
import { NO_TABLES } from "./refcount-checks.js";
import { type DagRun, type DagRunOptions, runDag, runProblems } from "./refcount-process.js";
import { referenceProblems } from "./refcount-reference.js";

/**
 * `core-ledger-state`'s reclamation through the `on-settle` point, on PostgreSQL 18 and PGlite 0.5.10, on the extended
 * DAG fixture through the real process (`./refcount-process.ts`). The engine passes a run of one block, so the block's
 * reclamation is computed, its eviction sent and its net write made inside the block's transaction:
 * - (a) a loop and a ledger worker that record what they do show, at every block, the eviction sent after the block's
 *   `on-db-write` callbacks ended and before its `COMMIT`, and the next block's apply sent only after that `COMMIT`;
 * - (b) the node tables after every block equal the per-block step (`./refcount-step.ts`, the reference) applied to
 *   the tables after the block before and the flush the worker recorded for the block, row for row;
 * - (c) a package that refuses one block's eviction in every thread: the worker thread is replaced once, the block
 *   commits, nothing halts, the next block loads the state after h from the database, and the node set is that of a
 *   run with no refusal;
 * - (d) the same with the restart turned off (`restartOnRefusedEviction: false`) halts at h in `on-settle` with nothing
 *   of h stored;
 * - (e) a lost connection in `on-settle`: the height is made again from `on-compute` (applied and handed over again),
 *   and its tables are a clean run's at every block, so the record the settle computed held that block alone.
 */

/** What a run's loop and ledger worker did, in order: a word and the height it was for. */
type Event = readonly [string, bigint];

/** A loop recording the end of each block's `on-db-write` callbacks, its `on-settle` point, its body and its `COMMIT`. */
function recordingLoop(events: Event[], settling: { height: bigint | null }): new (input: LoopInput) => FinalizedLoop {
  return class RecordingLoop extends FinalizedLoop {
    protected override async settlePoint(run: HeightRun, writes: BlockWrites): Promise<void> {
      events.push(["writes-ended", run.height]);
      settling.height = run.height;
      try {
        await super.settlePoint(run, writes);
      } finally {
        settling.height = null;
      }
      events.push(["settled", run.height]);
    }

    protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
      await super.write(tx, run);
      events.push(["body-ended", run.height]);
    }

    protected override async commit(run: HeightRun): Promise<void> {
      await super.commit(run);
      events.push(["committed", run.height]);
    }
  };
}

/** `host` recording each apply and each eviction when it is sent, the eviction under the height applied last. */
function recordingHost(events: Event[]): (host: LedgerHost) => LedgerHost {
  return (host) => {
    let height: bigint | null = null;
    return {
      useDatabase: (database) => host.useDatabase(database),
      parse: (ledger, block, transactions) => host.parse(ledger, block, transactions),
      genesisRoot: (ledger, bytes) => host.genesisRoot(ledger, bytes),
      genesis(input, read) {
        events.push(["apply", input.height]);
        height = input.height;
        return host.genesis(input, read);
      },
      apply(input, read) {
        events.push(["apply", input.height]);
        height = input.height;
        return host.apply(input, read);
      },
      commit: (block) => host.commit(block),
      release: (drop) => host.release(drop),
      load: (input, read) => host.load(input, read),
      retained: (input, read) => host.retained(input, read),
      evict(keys) {
        events.push(["evict", height ?? -1n]);
        return host.evict(keys);
      },
      tasks: (input, read) => host.tasks(input, read),
      probe: () => host.probe(),
      restart: () => host.restart(),
      get restarts() {
        return host.restarts;
      },
      activity: () => host.activity(),
      bridge: () => host.bridge(),
      get failure() {
        return host.failure;
      },
      close: () => host.close(),
    };
  };
}

/** Where the order of `events` breaks the rule of (a) at a committed height; none when it holds. */
function orderProblems(events: readonly Event[], cursor: bigint): string[] {
  const problems: string[] = [];
  const at = (word: string, height: bigint): number => events.findIndex(([w, h]) => w === word && h === height);
  for (let h = 0n; h <= cursor; h++) {
    const ended = at("writes-ended", h);
    const settled = at("settled", h);
    const body = at("body-ended", h);
    const committed = at("committed", h);
    if (!(ended >= 0 && ended < settled && settled < body && body < committed)) problems.push(`at ${h}: the loop's points are out of order`);
    for (const [index, [word, height]] of events.entries()) {
      if (word !== "evict" || height !== h) continue;
      if (!(ended < index && index < settled)) problems.push(`at ${h}: an eviction sent outside on-settle (after the on-db-write callbacks, before the COMMIT)`);
    }
    const next = at("apply", h + 1n);
    if (next >= 0 && next < committed) problems.push(`at ${h}: the apply of ${h + 1n} sent before ${h}'s COMMIT`);
  }
  return problems;
}

/** Where the run's tables after each block it committed differ from the reference step's; none when they agree. */
async function referenceRunProblems(run: DagRun): Promise<string[]> {
  const problems: string[] = [];
  for (let h = 0n; h <= run.cursor; h++) {
    const after = run.tables.get(h);
    const flushed = run.batches.get(h);
    const before = h === 0n ? NO_TABLES : run.tables.get(h - 1n);
    if (after === undefined || flushed === undefined || before === undefined) {
      problems.push(`at ${h}: no tables or flush recorded`);
      continue;
    }
    problems.push(...(await referenceProblems(h, before, after, flushed)));
  }
  return problems;
}

/** The counters a refusal's run reads from the test package's threads. */
function countersOf(memory: SharedArrayBuffer): Record<keyof typeof COUNTERS, number> {
  const shared = new Int32Array(memory);
  return Object.fromEntries(Object.entries(COUNTERS).map(([name, slot]) => [name, Atomics.load(shared, slot)])) as Record<keyof typeof COUNTERS, number>;
}

/** How many rows `core_ledger_state.states` holds once the run stopped. */
const stateRows = (run: DagRun): number => run.tables.get(run.cursor)?.states.size ?? 0;

describe.each(PROCESS_BACKENDS)("the reclamation through on-settle, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A run of the extended DAG on a new database. */
  const dagRun = async (options: Omit<DagRunOptions, "dag"> = {}): Promise<DagRun> => runDag(await backend.database(), { dag: "extended", ...options });
  let clean: Promise<{ readonly run: DagRun; readonly events: readonly Event[] }> | undefined;
  /** The run with no fault, recording its loop's points and its worker's applies and evictions (made once). */
  const cleanRun = (): Promise<{ readonly run: DagRun; readonly events: readonly Event[] }> => {
    clean ??= (async () => {
      const events: Event[] = [];
      const run = await dagRun({ loop: recordingLoop(events, { height: null }), worker: recordingHost(events) });
      return { run, events };
    })();
    return clean;
  };
  /** The first block whose reclamation deletes nodes. */
  const deletingHeight = async (): Promise<bigint> => {
    const { run } = await cleanRun();
    const found = [...run.evicted].filter(([, keys]) => keys.length > 0).map(([height]) => height).sort((a, b) => (a < b ? -1 : 1));
    expect(found.length).toBeGreaterThan(0);
    return found[0] as bigint;
  };

  it("(a) at every block the eviction is sent after its on-db-write callbacks and before its COMMIT, and the next block's apply after that COMMIT", async () => {
    const { run, events } = await cleanRun();
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    expect(runProblems(run, "extended")).toEqual([]);
    // Not vacuous: blocks that evict, each eviction once.
    const evictions = events.filter(([word]) => word === "evict");
    expect(evictions.length).toBeGreaterThan(5);
    expect(new Set(evictions.map(([, h]) => h)).size).toBe(evictions.length);
    expect(orderProblems(events, run.cursor)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("(b) the node tables after every block equal the reference step over the tables after the block before and the block's recorded flush", async () => {
    const { run } = await cleanRun();
    expect(run.cursor).toBe(BigInt(LAST));
    expect(await referenceRunProblems(run)).toEqual([]);
  }, PATIENCE_MS * 4);

  it("(c) a package refusing h's eviction in every thread: one restart, h commits, no halt, the state after h loaded from the database for h + 1, the node set of a run with no refusal", async () => {
    const h = await deletingHeight();
    const { run: plain } = await cleanRun();
    const memory = countersMemory();
    const refused = await dagRun({ data: { counters: memory, refuseAt: `${h}`, threads: 1_000 } });
    expect(refused.status).toMatchObject({ cursor: BigInt(LAST), reason: null, ended: null });
    expect(refused.failure).toBeNull();
    expect(refused.restarts).toBe(1);
    // The first thread refused both tries of h's eviction; the second never applied h, and loaded the state after h
    // from the database for h + 1.
    expect(countersOf(memory)).toMatchObject({ threads: 2, refusals: 2, storeLoads: 1, storeLoadHeight: Number(h) });
    expect(refused.evicted.get(h)).toBeUndefined();
    expect(tableDifferences(refused.tables, plain.tables)).toEqual([]);
    expect(runProblems(refused, "extended")).toEqual([]);
    expect(await referenceRunProblems(refused)).toEqual([]);
  }, PATIENCE_MS * 6);

  it("(d) with the restart turned off, the refused eviction halts h in on-settle with callback-error, nothing of h stored", async () => {
    const h = await deletingHeight();
    const memory = countersMemory();
    const run = await dagRun({ data: { counters: memory, refuseAt: `${h}`, threads: 1 }, core: { restartOnRefusedEviction: false }, halts: true });
    expect(run.status).toMatchObject({
      state: "halted",
      cursor: h - 1n,
      reason: { code: "callback-error", height: h, module: CORE_LEDGER_STATE_ID, point: "on-settle" },
    });
    expect(run.lines.some((line) => /processing halted \(callback-error\).*refuses to forget/.test(line))).toBe(true);
    expect(run.restarts).toBe(0);
    expect(countersOf(memory)).toMatchObject({ threads: 1, refusals: 2, storeLoads: 0 });
    // Nothing of h: every table of core_ledger_state as the watcher read it at h's on-compute, the states up to h − 1.
    const before = run.watched.get(h - 1n);
    const now = run.tables.get(h - 1n);
    expect(before).toBeDefined();
    expect([...(now?.digests ?? [])]).toEqual([...(before?.digests ?? [])]);
    expect(stateRows(run)).toBe(Number(h));
  }, PATIENCE_MS * 4);

  it("(e) a lost connection in on-settle: the height is made again from on-compute, and the tables after every block are a clean run's", async () => {
    const h = await deletingHeight();
    const { run: plain } = await cleanRun();
    const events: Event[] = [];
    const settling = { height: null as bigint | null };
    let failedIn: string | null = null;
    const failOnce = (w: Pick<BlockWriteHandle, "execute">, height: bigint): Pick<BlockWriteHandle, "execute"> =>
      height !== h || failedIn !== null
        ? w
        : {
            execute: async () => {
              failedIn = settling.height === h ? "on-settle" : "elsewhere";
              throw new UmbraError("connection-lost", "the writer's connection was lost (the test's fault)");
            },
          };
    const run = await dagRun({
      core: { refcountWriter: failOnce },
      settings: { backoffCeilingMs: 20 },
      loop: recordingLoop(events, settling),
      worker: recordingHost(events),
    });
    expect(failedIn).toBe("on-settle");
    expect(run.lines.filter((line) => line.includes("retries in"))).toHaveLength(1);
    expect(run.status).toMatchObject({ cursor: BigInt(LAST), reason: null });
    // h applied twice (its on-compute ran again), its eviction sent twice, each after its on-db-write callbacks.
    expect(events.filter(([word, height]) => word === "apply" && height === h)).toHaveLength(2);
    expect(events.filter(([word, height]) => word === "evict" && height === h)).toHaveLength(2);
    expect(orderProblems(events, run.cursor)).toEqual([]);
    // Every table of core_ledger_state after every block as the clean run's, and the reference step's.
    for (let height = 0n; height <= BigInt(LAST); height++) {
      expect([...(run.tables.get(height)?.digests ?? [])], `after ${height}`).toEqual([...(plain.tables.get(height)?.digests ?? [])]);
    }
    expect(await referenceRunProblems(run)).toEqual([]);
  }, PATIENCE_MS * 6);
});
