import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import { FinalizedLoop } from "../../src/runner/loop.js";
import { LoopPauses, type PauseHold } from "../../src/runner/pause.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { cursorOf, InMemoryBlockSource, loopInput, RUNNER_BACKENDS, startWith } from "./loop-harness.js";

/**
 * The pause of the finalized loop between heights (`src/runner/pause.ts`, `src/runner/loop.ts`): the holds of
 * {@link LoopPauses} on their own, then the loop itself on PostgreSQL 18.6 and PGlite 0.5.10. [BK-1, Q152 B]
 * - A hold asked for anywhere in a height (at `on-fetch`, at `on-compute`, inside the block transaction) is reached only
 *   once that height committed and its points after the commit ended, with no transaction open on the database.
 * - One asked for while the loop waits for the head is reached at once, and the loop then starts nothing though the
 *   head rose.
 * - Released, the loop goes on from the next height, every height's points once.
 * - A stop while paused ends the run.
 *
 * The process-level half (a running process, `ProcessHandle.pause()`/`resume()`, the backup on SIGUSR2) is
 * `test/backup/pause.test.ts`. [A163]
 */

/** A few turns of the event loop, for a promise that would settle to settle. */
async function turns(count = 10): Promise<void> {
  for (let turn = 0; turn < count; turn++) await new Promise((resolve) => setImmediate(resolve));
}

/** Whether `promise` has settled. */
async function settled(promise: Promise<unknown>): Promise<boolean> {
  let done = false;
  void promise.then(
    () => {
      done = true;
    },
    () => {
      done = true;
    },
  );
  await turns(2);
  return done;
}

describe("LoopPauses: the holds of the pause between heights (BK-1, Q152 B)", () => {
  it("lets the loop through at once while no hold is kept", async () => {
    const pauses = new LoopPauses();
    expect(pauses.held).toBe(false);
    expect(pauses.paused).toBe(false);
    await pauses.between(new AbortController().signal);
    expect(await pauses.idle(async () => 7)).toBe(7);
  });

  it("reaches a hold asked for before the loop's next pause only when the loop gets there, and holds it until released", async () => {
    const pauses = new LoopPauses();
    const hold = pauses.hold();
    expect(pauses.held).toBe(true);
    expect(pauses.paused).toBe(false);
    expect(await settled(hold.reached)).toBe(false);
    const between = pauses.between(new AbortController().signal);
    expect(await settled(hold.reached)).toBe(true);
    expect(pauses.paused).toBe(true);
    expect(await settled(between)).toBe(false);
    hold.release();
    await between;
    expect(pauses.held).toBe(false);
    expect(pauses.paused).toBe(false);
  });

  it("reaches a hold at once while the loop waits for the head, and holds the loop once the wait ends", async () => {
    const pauses = new LoopPauses();
    let wake!: () => void;
    const waiting = pauses.idle(() => new Promise<string>((resolve) => (wake = () => resolve("head"))));
    const hold = pauses.hold();
    expect(await settled(hold.reached)).toBe(true);
    expect(pauses.paused).toBe(true);
    wake();
    expect(await waiting).toBe("head");
    // The loop's next step is the pause between heights: held there.
    const between = pauses.between(new AbortController().signal);
    expect(await settled(between)).toBe(false);
    hold.release();
    await between;
  });

  it("tells a hold asked for while the loop waits at the pause at once, and holds until the last hold is released", async () => {
    const pauses = new LoopPauses();
    const first = pauses.hold();
    const between = pauses.between(new AbortController().signal);
    await first.reached;
    const second = pauses.hold();
    expect(await settled(second.reached)).toBe(true);
    first.release();
    first.release();
    expect(await settled(between)).toBe(false);
    expect(pauses.held).toBe(true);
    second.release();
    await between;
    expect(pauses.held).toBe(false);
  });

  it("resolves a hold released before the loop reached it, and the loop does not pause for it", async () => {
    const pauses = new LoopPauses();
    const hold = pauses.hold();
    hold.release();
    expect(await settled(hold.reached)).toBe(true);
    expect(await settled(pauses.between(new AbortController().signal))).toBe(true);
  });

  it("ends the pause when the loop's signal aborts (a stop while paused, RN-13), the hold still kept", async () => {
    const pauses = new LoopPauses();
    const hold = pauses.hold();
    const stop = new AbortController();
    const between = pauses.between(stop.signal);
    await hold.reached;
    expect(await settled(between)).toBe(false);
    stop.abort();
    await between;
    expect(pauses.held).toBe(true);
    expect(pauses.paused).toBe(false);
    // With the signal aborted already, the loop tells the holds it arrived and goes through.
    const again = pauses.hold();
    await pauses.between(stop.signal);
    expect(await settled(again.reached)).toBe(true);
    hold.release();
    again.release();
  });
});

/** The modules' calls, as `<point>@<height>`, and markers the test adds (`--- <what>`). */
type Seen = string[];

/** The points `rec` records. */
const RECORDED: readonly PointName[] = ["on-finalized", "on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"];

/**
 * Module `rec`: records each of its points (`<point>@<height>`) once its callback's work ended — at `on-finalized`,
 * `on-compute` and `on-after-db-write` after a statement on its read, at `on-db-write` after its row — and calls
 * `hooks[<point>@<height>]` there first (a test's hold asked for inside a height).
 */
function recorder(seen: Seen, hooks: Map<string, () => void>): ModuleDeclaration {
  const at = (point: PointName, height: bigint) => {
    hooks.get(`${point}@${height}`)?.();
    seen.push(`${point}@${height}`);
  };
  return declaration("rec", {
    points: {
      async "on-finalized"(_p, head, read) {
        await read.query("SELECT 1");
        at("on-finalized", head.height);
      },
      async "on-fetch"(_p, b) {
        at("on-fetch", b.height);
      },
      async "on-parse"(_p, b) {
        at("on-parse", b.height);
      },
      async "on-compute"(_p, b, read) {
        await read.query("SELECT 1");
        at("on-compute", b.height);
      },
      async "on-db-write"(_p, b, w) {
        await w.execute("INSERT INTO rec.rows (height) VALUES ($1)", [b.height]);
        at("on-db-write", b.height);
      },
      async "on-after-db-write"(_p, b, read) {
        await read.query("SELECT 1");
        at("on-after-db-write", b.height);
      },
    },
  });
}

/** The heights' own points, in order: each height's `on-fetch` … `on-after-db-write`, `on-finalized` left out. */
function heightPoints(seen: Seen): string[] {
  return seen.filter((call) => !call.startsWith("on-finalized@") && !call.startsWith("---"));
}

/** Every height from `from` to `to` with its points once, in order, and nothing else. */
function eachHeightOnce(from: bigint, to: bigint): string[] {
  const calls: string[] = [];
  for (let height = from; height <= to; height++) {
    for (const point of RECORDED) if (point !== "on-finalized") calls.push(`${point}@${height}`);
  }
  return calls;
}

describe.each(RUNNER_BACKENDS)("the loop pauses between heights on $name (BK-1, Q152 B)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it(
    "a hold asked for at on-fetch, at on-compute or inside the block transaction is reached once that height " +
      "committed and its later points ended, no transaction open; while waiting for the head at once; released, the " +
      "loop goes on, every height once",
    async () => {
      const { db, openTransactions } = await backend.database();
      const seen: Seen = [];
      const hooks = new Map<string, () => void>();
      const pauses = new LoopPauses();
      const holds: PauseHold[] = [];
      for (const call of ["on-fetch@3", "on-compute@5", "on-db-write@7"]) hooks.set(call, () => holds.push(pauses.hold()));
      const started = await startWith(db, [recorder(seen, hooks)], [entry("rec", 1)]);
      const source = new InMemoryBlockSource({ head: 10n });
      const stop = new AbortController();
      const loop = new FinalizedLoop({ ...loopInput(started, source, stop), pause: pauses });
      const running = loop.run();
      try {
        for (const [index, height] of [3n, 5n, 7n].entries()) {
          while (holds[index] === undefined) await turns(1);
          const hold = holds[index] as PauseHold;
          await hold.reached;
          seen.push(`--- paused at ${height}`);
          // Between heights: the height of the hold committed, its points after the commit ended, nothing open.
          expect(heightPoints(seen).at(-1)).toBe(`on-after-db-write@${height}`);
          expect(loop.blockTransaction()).toBeNull();
          expect(await openTransactions()).toBe(0);
          expect(await cursorOf(db)).toBe(height);
          // Held: nothing starts though heights wait above the cursor.
          await sleep(100);
          await turns();
          expect(seen.at(-1)).toBe(`--- paused at ${height}`);
          expect(await cursorOf(db)).toBe(height);
          hold.release();
        }
        await source.waiting(10n);
        // While the loop waits for the head, a hold is reached at once; the loop then starts nothing once the head rose.
        const idle = pauses.hold();
        await idle.reached;
        seen.push("--- paused waiting");
        source.finalize(14n);
        await sleep(100);
        await turns();
        expect(seen.at(-1)).toBe("--- paused waiting");
        expect(await openTransactions()).toBe(0);
        expect(await cursorOf(db)).toBe(10n);
        idle.release();
        await source.waiting(14n);
      } finally {
        for (const hold of holds) hold.release();
        stop.abort();
      }
      expect(await running).toEqual({ kind: "signal" });
      expect(heightPoints(seen)).toEqual(eachHeightOnce(1n, 14n));
      expect(await cursorOf(db)).toBe(14n);
    },
    120_000,
  );

  it("a hold asked for before the run is reached at the run's first pause; a stop while paused ends the run (RN-13)", async () => {
    const { db, openTransactions } = await backend.database();
    const seen: Seen = [];
    const pauses = new LoopPauses();
    const started = await startWith(db, [recorder(seen, new Map())], [entry("rec", 1)]);
    const source = new InMemoryBlockSource({ head: 4n });
    const hold = pauses.hold();
    const stop = new AbortController();
    const running = new FinalizedLoop({ ...loopInput(started, source, stop), pause: pauses }).run();
    await hold.reached;
    expect(seen).toEqual([]);
    expect(await openTransactions()).toBe(0);
    expect(await cursorOf(db)).toBeNull();
    stop.abort();
    expect(await running).toEqual({ kind: "signal" });
    expect(seen).toEqual([]);
    expect(pauses.held).toBe(true);
    hold.release();
  });
});
