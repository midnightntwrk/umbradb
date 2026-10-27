import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Transaction } from "../../src/db/api.js";
import { FinalizedLoop, type HeightRun, type LockstepWait, type LoopEnd } from "../../src/runner/loop.js";
import { settlesWithin } from "../db/backends.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import {
  cursorOf,
  heightsIn,
  InMemoryBlockSource,
  type LoopClass,
  loopInput,
  type RunnerDatabase,
  RUNNER_BACKENDS,
  startWith,
} from "./loop-harness.js";

/**
 * The finalized loop's lockstep wait (task 14.3; PP-6, RN-6, RN-13; A117's "before `BEGIN` with no transaction open",
 * `design.md` §2, §8), on PostgreSQL 18.6 and PGlite 0.5.10: given `LoopInput.lockstep` (the core's `Lockstep`,
 * `src/private/lockstep.ts`), the loop awaits it for each height h after h's `on-compute` and before h's block
 * transaction — with every read ended, so no transaction is open (`pg_stat_activity`; PGlite's one engine) and a read
 * of the database is served meanwhile (PGlite's one queue is free) —, commits h when it resolves true, and ends with its
 * signal, h not committed, when it resolves false (a stop while it waits). Committed negative control: a loop that opens
 * its block transaction before it waits fails the oracle.
 */

/** A module recording the points it saw and writing one row per height (`probe.rows`). */
function probe(seen: string[]) {
  return declaration("probe", {
    points: {
      async "on-compute"(_p, b) {
        seen.push(`on-compute ${b.height}`);
      },
      async "on-db-write"(_p, b, w) {
        seen.push(`on-db-write ${b.height}`);
        await w.execute("INSERT INTO probe.rows (height) VALUES ($1)", [b.height]);
      },
    },
  });
}

/** A lockstep wait the test answers: each call is kept until the test settles it. */
function manualGate(seen: string[]) {
  const calls: { height: bigint; settle(value: boolean): void }[] = [];
  const gate: LockstepWait = {
    wait: (height, signal) =>
      new Promise<boolean>((resolve) => {
        seen.push(`lockstep ${height}`);
        const settle = (value: boolean): void => resolve(value);
        signal.addEventListener("abort", () => resolve(false), { once: true });
        calls.push({ height, settle });
      }),
  };
  return { gate, calls };
}

/** Waits until `check` holds, or fails after `ms`. */
async function until(check: () => boolean, what: string, ms = 60_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out: ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

/** What the loop showed while it waited at the gate for `height`. */
interface AtGate {
  readonly height: bigint;
  readonly open: number;
  readonly readServed: boolean;
  readonly cursor: bigint | null;
  readonly seen: readonly string[];
}

/** The oracle of A117's wait at the gate: every problem, none when it waits after on-compute, before BEGIN, holding nothing. */
export function gateProblems(at: AtGate): string[] {
  const problems: string[] = [];
  const h = at.height;
  if (at.open !== 0) problems.push(`${at.open} transaction(s) open while the loop waited for lockstep at ${h}`);
  if (!at.readServed) problems.push(`a read of the database waited while the loop waited for lockstep at ${h}`);
  if (at.cursor !== (h === 1n ? null : h - 1n)) problems.push(`the cursor was ${at.cursor} while the loop waited for lockstep at ${h}`);
  const last = at.seen.at(-1);
  if (last !== `lockstep ${h}` || !at.seen.includes(`on-compute ${h}`)) {
    problems.push(`at the gate for ${h} the loop had run ${at.seen.join(", ")}`);
  }
  if (at.seen.includes(`on-db-write ${h}`)) problems.push(`on-db-write of ${h} ran before the gate let it`);
  return problems;
}

/** A negative control's loop: it waits for lockstep inside its block transaction, holding it open. */
class WaitsInTransaction extends FinalizedLoop {
  protected override async lockstepWait(): Promise<boolean> {
    return true;
  }

  protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
    const gate = this.input.lockstep as LockstepWait;
    if (!(await gate.wait(run.height, this.input.signal as AbortSignal))) throw new Error("stopped at the lockstep wait");
    await super.write(tx, run);
  }
}

describe.each(RUNNER_BACKENDS)("the loop's lockstep wait on $name (PP-6, A117)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Runs a loop of `kind` with a manual gate over heights 1–3, letting each height through; what it saw at each. */
  async function throughGate(kind: LoopClass = FinalizedLoop): Promise<{ at: AtGate[]; heights: bigint[]; end: LoopEnd }> {
    const opened: RunnerDatabase = await backend.database();
    const seen: string[] = [];
    const started = await startWith(opened.db, [probe(seen)], [entry("probe", 1)]);
    const source = new InMemoryBlockSource({ head: 3n });
    const controller = new AbortController();
    const { gate, calls } = manualGate(seen);
    const running = new kind({ ...loopInput(started, source, controller), lockstep: gate }).run();
    const at: AtGate[] = [];
    try {
      for (const height of [1n, 2n, 3n]) {
        await until(() => calls.some((call) => call.height === height), `the gate asked for ${height}`);
        at.push({
          height,
          open: await opened.openTransactions(),
          readServed: await settlesWithin(opened.db.read(async () => undefined), 5_000),
          cursor: await Promise.race([cursorOf(opened.db), new Promise<null>((resolve) => setTimeout(() => resolve(null), 5_000))]),
          seen: [...seen],
        });
        calls.find((call) => call.height === height)?.settle(true);
      }
      await source.waiting(3n);
    } finally {
      controller.abort();
    }
    const end = await running;
    return { at, heights: await heightsIn(opened.db, "probe.rows"), end };
  }

  it("A117: waits for lockstep after on-compute and before BEGIN, holding no transaction and no queue, then commits", async () => {
    const { at, heights } = await throughGate();
    expect(at.flatMap(gateProblems)).toEqual([]);
    expect(heights).toEqual([1n, 2n, 3n]);
  }, 120_000);

  it("A117 negative control (committed): a loop that opens its transaction before waiting fails the oracle", async () => {
    const { at } = await throughGate(WaitsInTransaction);
    const problems = at.flatMap(gateProblems);
    expect(problems).toContain("1 transaction(s) open while the loop waited for lockstep at 1");
    // On PGlite the open transaction holds the one queue: a read waits behind it.
    if (backend.name.startsWith("PGlite")) expect(problems).toContain("a read of the database waited while the loop waited for lockstep at 1");
  }, 120_000);

  it("a stop while it waits ends the loop with its signal, the height not committed (RN-13: no transaction was open)", async () => {
    const opened = await backend.database();
    const seen: string[] = [];
    const started = await startWith(opened.db, [probe(seen)], [entry("probe", 1)]);
    const controller = new AbortController();
    const { gate, calls } = manualGate(seen);
    const running = new FinalizedLoop({ ...loopInput(started, new InMemoryBlockSource({ head: 3n }), controller), lockstep: gate }).run();
    await until(() => calls.length === 1, "the gate asked for 1");
    calls[0]?.settle(true);
    await until(() => calls.length === 2, "the gate asked for 2");
    controller.abort();
    expect(await running).toEqual({ kind: "signal" });
    expect(await heightsIn(opened.db, "probe.rows")).toEqual([1n]);
    expect(seen).not.toContain("on-db-write 2");
    expect(seen.filter((call) => call.startsWith("lockstep"))).toEqual(["lockstep 1", "lockstep 2"]);
  }, 120_000);

  it("a wait that resolves false ends the loop the same way; without a lockstep wait the loop does not wait", async () => {
    const opened = await backend.database();
    const seen: string[] = [];
    const started = await startWith(opened.db, [probe(seen)], [entry("probe", 1)]);
    const controller = new AbortController();
    const refusing: LockstepWait = { wait: async () => false };
    expect(await new FinalizedLoop({ ...loopInput(started, new InMemoryBlockSource({ head: 3n }), controller), lockstep: refusing }).run()).toEqual({
      kind: "signal",
    });
    expect(await heightsIn(opened.db, "probe.rows")).toEqual([]);
    const source = new InMemoryBlockSource({ head: 2n });
    const running = new FinalizedLoop(loopInput(started, source, controller)).run();
    try {
      await Promise.race([source.waiting(2n), running]);
    } finally {
      controller.abort();
    }
    expect(await running).toEqual({ kind: "signal" });
    expect(await heightsIn(opened.db, "probe.rows")).toEqual([1n, 2n]);
    expect(seen.filter((call) => call.startsWith("lockstep"))).toEqual([]);
  }, 120_000);
});
