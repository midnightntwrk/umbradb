import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type LoopEnd, type LoopInput, type SlowBlockEvent } from "../../src/runner/loop.js";
import { LoopPauses } from "../../src/runner/pause.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { InMemoryBlockSource, loopInput, RUNNER_BACKENDS, type Started, startWith } from "./loop-harness.js";

/**
 * Task 17.5b (the mutation pass task 5.5a deferred): a height's own window at the loop level on PGlite — the event
 * that ends it says whether the height committed and how long the window was open, a window of a failed height ends
 * not completed; no timer at all when `slowBlockMs` is off; an observer without `slow`, or none, is not called. And
 * `LoopPauses.idle` leaves the loop no longer between heights once its wait ends (task 15.1a's pass).
 *
 * The holds wait on purpose (up to 900 ms): each test's budget is that plus Vitest's.
 */

const PGLITE = RUNNER_BACKENDS.find((backend) => backend.name.startsWith("PGlite"));
if (PGLITE === undefined) throw new Error("the loop harness has no PGlite backend");

/** Module `id`: at `on-db-write` of `height`, awaits `ms`, then throws `fails` if given; else a row per height. */
function slowWrite(id: string, height: bigint, ms: number, fails?: Error): ModuleDeclaration {
  return declaration(id, {
    points: {
      async "on-db-write"(_p, b, w) {
        if (b.height === height) {
          const start = performance.now();
          while (performance.now() < start + ms) await sleep(Math.ceil(start + ms - performance.now()));
          if (fails !== undefined) throw fails;
        }
        await w.execute(`INSERT INTO ${id}.rows (height) VALUES ($1)`, [b.height]);
      },
    },
  });
}

/** Runs a loop of `started` with `input` until it waits for a head above `above`, or fails; its end or failure. */
async function runOnce(started: Started, source: InMemoryBlockSource, above: bigint, input: Partial<LoopInput>) {
  const stop = new AbortController();
  const loop = new FinalizedLoop({ ...loopInput(started, source, stop), ...input });
  const running = loop.run().then(
    (end: LoopEnd) => end,
    (error: unknown) => error,
  );
  const outcome = await Promise.race([source.waiting(above).then(() => "waiting" as const), running]);
  if (outcome === "waiting") stop.abort();
  return { outcome: await running, loop };
}

describe("a height's own slow-block window at the loop level on PGlite (task 17.5b)", () => {
  beforeAll(() => PGLITE.start(), 180_000);
  afterAll(() => PGLITE.stop(), 60_000);

  it("ends a slow height that committed as completed, with the time its window was open", async () => {
    const { db } = await PGLITE.database();
    const started = await startWith(db, [slowWrite("w", 2n, 900)], [entry("w", 1)]);
    const source = new InMemoryBlockSource({ head: 2n });
    const events: SlowBlockEvent[] = [];
    const began = performance.now();
    const { outcome } = await runOnce(started, source, 2n, { slowBlockMs: 300, observer: { slow: (event) => void events.push(event) } });
    const took = performance.now() - began;
    expect(outcome).toEqual({ kind: "signal" });
    const ended = events.filter((event) => event.kind === "ended" && event.window === "height" && event.height === 2n);
    expect(ended).toEqual([expect.objectContaining({ completed: true })]);
    const ms = (ended[0] as { ms: number }).ms;
    expect(ms).toBeGreaterThanOrEqual(900);
    expect(ms).toBeLessThanOrEqual(took);
    expect(events.some((event) => event.kind === "raised" && event.activity.height === 2n && event.activity.point === "on-db-write"))
      .toBe(true);
  }, 120_000);

  it("ends a slow height whose on-db-write failed as not completed", async () => {
    const { db } = await PGLITE.database();
    const started = await startWith(db, [slowWrite("f", 2n, 600, new Error("the test's failure"))], [entry("f", 1)]);
    const source = new InMemoryBlockSource({ head: 2n });
    const events: SlowBlockEvent[] = [];
    const { outcome } = await runOnce(started, source, 2n, { slowBlockMs: 200, observer: { slow: (event) => void events.push(event) } });
    expect(outcome).toBeInstanceOf(Error);
    const ended = events.filter((event) => event.kind === "ended" && event.window === "height" && event.height === 2n);
    expect(ended).toEqual([expect.objectContaining({ completed: false })]);
  }, 120_000);

  it("starts no timer with slowBlockMs off, and calls no observer that has no slow, or none", async () => {
    const { db } = await PGLITE.database();
    const started = await startWith(db, [slowWrite("o", 2n, 400)], [entry("o", 1)]);
    const source = new InMemoryBlockSource({ head: 2n });
    const events: SlowBlockEvent[] = [];
    const off = await runOnce(started, source, 2n, { slowBlockMs: null, observer: { slow: (event) => void events.push(event) } });
    expect(off.outcome).toEqual({ kind: "signal" });
    expect(events).toEqual([]);
    expect(off.loop.slowBlock()).toBeNull();
    for (const observer of [{}, undefined]) {
      const { db: next } = await PGLITE.database();
      const again = await startWith(next, [slowWrite("o", 2n, 400)], [entry("o", 1)]);
      const run = await runOnce(again, new InMemoryBlockSource({ head: 2n }), 2n, { slowBlockMs: 100, observer });
      expect(run.outcome).toEqual({ kind: "signal" });
    }
  }, 120_000);
});

describe("LoopPauses.idle (task 17.5b)", () => {
  it("leaves the loop not between heights once its wait ends: a hold asked for after it is not reached at once", async () => {
    const pauses = new LoopPauses();
    expect(await pauses.idle(async () => 1)).toBe(1);
    expect(pauses.paused).toBe(false);
    const hold = pauses.hold();
    let reached = false;
    void hold.reached.then(() => {
      reached = true;
    });
    await sleep(10);
    expect(reached).toBe(false);
    expect(pauses.paused).toBe(false);
    hold.release();
    await expect(pauses.idle(async () => Promise.reject(new Error("the wait failed")))).rejects.toThrow("the wait failed");
    expect(pauses.paused).toBe(false);
    expect(pauses.hold().reached).toBeInstanceOf(Promise);
    expect(pauses.pausedAt).toBeNull();
  });
});
