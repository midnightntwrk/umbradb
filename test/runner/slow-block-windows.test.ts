import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import {
  FinalizedLoop,
  HeightFailure,
  type HeightActivity,
  type LockstepWait,
  type LoopEnd,
  type LoopInput,
  type SlowBlockEvent,
  type SlowWindow,
} from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { InMemoryBlockSource, loopInput, RUNNER_BACKENDS, type Started, startWith } from "./loop-harness.js";

/**
 * The windows of the slow-block watchdog outside a height's processing (`src/runner/loop.ts`), at the loop level on
 * PostgreSQL 18 and PGlite 0.5.10. These are the details that the through-the-process test
 * (`./slow-block-outside.test.ts`) leaves to the design: [RN-17, Q145 B, A161]
 * - **after a commit, one window** from the commit to the end of `on-stop-height`: `on-after-db-write` and
 *   `on-stop-height` together past `slowBlockMs` are slow, each alone not; the point is the last that began;
 * - **each `on-finalized` its own window**, named by the height of the head it announces: two in a row, each within
 *   `slowBlockMs`, are never slow, however long the loop waited between them;
 * - **the callbacks delivered again** at a run's start, at the cursor's height [RN-11];
 * - **a `COMMIT` that landed though its connection was lost**: the retry's points after it are the window after the
 *   commit [IN-11];
 * - **a failure closes the window** it happened in (the event says it did not complete); **a height stopped at the
 *   lockstep wait** closes its window too, so nothing is raised once the loop ended [PP-6].
 *
 * The observer's events and `slowBlock()` are read directly (`window` names which window), and only those of the
 * windows a case holds open are compared. A window no case holds (a height's own processing, on PostgreSQL its
 * `on-db-write` and `COMMIT`, or a callback's read) can pass `slowBlockMs` on a loaded machine and raise a correct
 * `slow-block` of its own. A held window's own reads count toward its time: each case leaves them at least 0.8 s,
 * which the `on-finalized` and lockstep cases get from a `slowBlockMs` of 2,000 with their holds raised alike.
 *
 * Each test waits on purpose (callbacks of up to 2.5 s, waits of up to 2.7 s): its budget is that plus Vitest's 60 s.
 */

const BUDGET_MS = 10_000 + 60_000;

/** The windows a case holds open, each `<window>@<height>`: the only ones its checks compare. */
type Held = readonly `${SlowWindow}@${bigint}`[];

/** Whether the window `window` at `height` is one of `held`. */
const isHeld = (held: Held, window: SlowWindow, height: bigint): boolean => held.includes(`${window}@${height}`);

/** What the test saw of the watchdog: the observer's events and `slowBlock()` every 10 ms, each with when. */
interface Watched {
  readonly events: { readonly at: number; readonly event: SlowBlockEvent }[];
  readonly reads: { readonly at: number; readonly slow: HeightActivity | null }[];
}

/** A loop of `started` over `source` with `slowBlockMs` (and more input), watched; its stop. */
function watchedLoop(
  started: Started,
  source: InMemoryBlockSource,
  slowBlockMs: number,
  extra: Partial<Pick<LoopInput, "db" | "lockstep">> = {},
): { readonly loop: FinalizedLoop; readonly stop: AbortController; readonly watched: Watched } {
  const stop = new AbortController();
  const watched: Watched = { events: [], reads: [] };
  const loop = new FinalizedLoop({
    ...loopInput(started, source, stop),
    ...extra,
    slowBlockMs,
    observer: { slow: (event) => void watched.events.push({ at: performance.now(), event }) },
  });
  return { loop, stop, watched };
}

/**
 * Runs `loop` once, reading `slowBlock()` every 10 ms, until it waits for a head above `above` (then stopped) or ends;
 * resolves with its end or its failure.
 */
async function runWatched(
  loop: FinalizedLoop,
  source: InMemoryBlockSource,
  stop: AbortController,
  watched: Watched,
  above: bigint,
): Promise<LoopEnd | unknown> {
  const poll = setInterval(() => watched.reads.push({ at: performance.now(), slow: loop.slowBlock() }), 10);
  const running = loop.run().then(
    (end) => end,
    (error: unknown) => error,
  );
  try {
    const outcome = await Promise.race([source.waiting(above).then(() => "waiting" as const), running]);
    if (outcome === "waiting") stop.abort();
    return await running;
  } finally {
    clearInterval(poll);
  }
}

/** The events of `watched` in the windows `held`, in order. */
const eventsOf = (watched: Watched, held: Held) =>
  watched.events.filter(({ event }) =>
    event.kind === "raised" ? isHeld(held, event.activity.window, event.activity.height) : isHeld(held, event.window, event.height),
  );

/** The raised events of `watched` in the windows `held`, as plain data. */
const raisedOf = (watched: Watched, held: Held) =>
  eventsOf(watched, held).flatMap(({ at, event }) => (event.kind === "raised" ? [{ at, ...event.activity }] : []));

/** The ended events of `watched` in the windows `held`, as plain data. */
const endedOf = (watched: Watched, held: Held) =>
  eventsOf(watched, held).flatMap(({ at, event }) => (event.kind === "ended" ? [{ at, ...event }] : []));

/** The reads of `slowBlock()` in `watched` that showed one of the windows `held`. */
const shownOf = (watched: Watched, held: Held) =>
  watched.reads.filter(({ slow }) => slow !== null && isHeld(held, slow.window, slow.height));

/** When a module's timed callback began and ended (`performance.now()`), by `<point>@<height>`. */
type Times = Map<string, { readonly start: number; readonly end: number }>;

/**
 * Module `id`: a row per height at `on-db-write`; each `<point>@<height>` of `holds` awaits that many milliseconds — the
 * callback's times recorded in `times` — then throws `fails`'s error for that name, if any. `on-finalized` is named by
 * the head it announces. `armed` gates the holds (a later run's only); `onWrite` is told of each height written.
 */
function holder(
  id: string,
  holds: Readonly<Record<string, number>>,
  times: Times,
  options: {
    readonly fails?: Readonly<Record<string, Error>>;
    readonly armed?: () => boolean;
    readonly onWrite?: (height: bigint) => void;
  } = {},
): ModuleDeclaration {
  const at = async (name: string): Promise<void> => {
    const ms = holds[name];
    if (ms === undefined || options.armed?.() === false) return;
    const start = performance.now();
    while (performance.now() < start + ms) await sleep(Math.ceil(start + ms - performance.now()));
    times.set(name, { start, end: performance.now() });
    const failure = options.fails?.[name];
    if (failure !== undefined) throw failure;
  };
  return declaration(id, {
    points: {
      async "on-db-write"(_p, b, w) {
        await w.execute(`INSERT INTO ${id}.rows (height) VALUES ($1)`, [b.height]);
        options.onWrite?.(b.height);
      },
      async "on-after-db-write"(_p, b) {
        await at(`on-after-db-write@${b.height}`);
      },
      async "on-stop-height"(_p, e) {
        await at(`on-stop-height@${e.height}`);
      },
      async "on-finalized"(_p, head) {
        await at(`on-finalized@${head.height}`);
      },
    },
  });
}

/** `db`, whose next block transaction, once `state.armed`, loses its `COMMIT` after it landed. [IN-11, DB-13] */
function landingCommits(db: Database): { readonly db: Database; readonly state: { armed: boolean } } {
  const state = { armed: false };
  const wrapped: Database = {
    read: (body, options) => db.read(body, options),
    async transaction<T>(body: (tx: Transaction) => Promise<T>): Promise<T> {
      let landed = false;
      const result = await db.transaction(async (tx) => {
        const value = await body(tx);
        landed = state.armed;
        state.armed = false;
        return value;
      });
      if (landed) throw new UmbraError("connection-lost", "the connection was lost during the COMMIT (the test's database)");
      return result;
    },
    close: () => db.close(),
  };
  return { db: wrapped, state };
}

describe.each(RUNNER_BACKENDS)("slow-block's windows outside a height's processing on $name (Q145 B)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it(
    "after a commit, one window from the commit to the end of on-stop-height: both points together are slow, each alone not",
    async () => {
      const { db } = await backend.database();
      const times: Times = new Map();
      // on-after-db-write at 2 awaits 800 ms, on-stop-height at 2 (m stops at 2) 1,500 ms: each below slowBlockMs 1,600,
      // together above it, so the window raises in on-stop-height.
      const m = holder("m", { "on-after-db-write@2": 800, "on-stop-height@2": 1_500 }, times);
      const started = await startWith(db, [m], [entry("m", 1, 2)]);
      const source = new InMemoryBlockSource({ head: 2n });
      const { loop, stop, watched } = watchedLoop(started, source, 1_600);
      expect(await runWatched(loop, source, stop, watched, 2n)).toEqual({ kind: "signal" });
      const held: Held = ["after-commit@2"];
      const stopping = times.get("on-stop-height@2") as { start: number; end: number };
      expect(raisedOf(watched, held)).toEqual([
        expect.objectContaining({ window: "after-commit", height: 2n, point: "on-stop-height", module: "m" }),
      ]);
      const raised = raisedOf(watched, held)[0]!;
      expect(raised.at).toBeGreaterThan(stopping.start);
      // Raised by the window's 1,600 ms, not by on-stop-height's 1,500 (a Node.js timer may fire up to a millisecond
      // before performance.now() counts its delay).
      expect(raised.sinceMs).toBeGreaterThanOrEqual(1_600 - 2);
      expect(endedOf(watched, held)).toEqual([expect.objectContaining({ window: "after-commit", height: 2n, completed: true })]);
      expect(endedOf(watched, held)[0]!.at).toBeGreaterThanOrEqual(stopping.end);
      // slowBlock() showed it in on-stop-height only, and none after the window ended.
      const shown = shownOf(watched, held);
      expect(new Set(shown.map(({ slow }) => `${slow!.window} ${slow!.height} ${slow!.point} ${slow!.module}`))).toEqual(
        new Set(["after-commit 2 on-stop-height m"]),
      );
      expect(shown.every(({ at }) => at >= stopping.start && at <= endedOf(watched, held)[0]!.at)).toBe(true);
      expect(loop.slowBlock()).toBeNull();
    },
    BUDGET_MS,
  );

  it(
    "each on-finalized is a window of its own, named by the head it announces, the wait between heads not counted",
    async () => {
      const { db } = await backend.database();
      const times: Times = new Map();
      // Head 1's on-finalized awaits 1 s, head 2's (announced after the loop waited 1.5 s) 2.5 s; slowBlockMs 2,000. Each
      // window's own read counts too: head 1's has 1 s left for it on a loaded machine.
      const f = holder("f", { "on-finalized@1": 1_000, "on-finalized@2": 2_500 }, times);
      const started = await startWith(db, [f], [entry("f", 1)]);
      const source = new InMemoryBlockSource({ head: 1n });
      const { loop, stop, watched } = watchedLoop(started, source, 2_000);
      const running = runWatched(loop, source, stop, watched, 2n);
      await source.waiting(1n);
      await sleep(1_500);
      source.finalize(2n);
      expect(await running).toEqual({ kind: "signal" });
      const held: Held = ["finalized@1", "finalized@2"];
      const first = times.get("on-finalized@1") as { start: number; end: number };
      const second = times.get("on-finalized@2") as { start: number; end: number };
      const raised = raisedOf(watched, held);
      expect(raised).toEqual([expect.objectContaining({ window: "finalized", height: 2n, point: "on-finalized", module: "f" })]);
      // The window that raised opened after head 1's callback had ended: neither it nor the wait is in it.
      expect(raised[0]!.at - raised[0]!.sinceMs).toBeGreaterThanOrEqual(first.end);
      // About 2 s into head 2's callback, less its read's opening; head 1's time carried into it would raise it within 1 s.
      expect(raised[0]!.at - second.start).toBeGreaterThan(1_200);
      expect(endedOf(watched, held)).toEqual([expect.objectContaining({ window: "finalized", height: 2n, completed: true })]);
      expect(shownOf(watched, held).filter(({ at }) => at < second.start)).toEqual([]);
      expect(loop.slowBlock()).toBeNull();
    },
    BUDGET_MS,
  );

  it(
    "RN-11's re-delivery at a run's start is a window of its own, at the cursor's height",
    async () => {
      const { db } = await backend.database();
      const times: Times = new Map();
      // The first run commits 1 and 2 (holds off); the second re-delivers 2's on-after-db-write, which awaits 1,500 ms.
      let armed = false;
      const m = holder("m", { "on-after-db-write@2": 1_500 }, times, { armed: () => armed });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const source = new InMemoryBlockSource({ head: 2n });
      const first = watchedLoop(started, source, 1_000);
      expect(await runWatched(first.loop, source, first.stop, first.watched, 2n)).toEqual({ kind: "signal" });
      // The first run held nothing (its heights' own windows are not this case's).
      expect(times.has("on-after-db-write@2")).toBe(false);
      armed = true;
      const { loop, stop, watched } = watchedLoop(started, source, 1_000);
      expect(await runWatched(loop, source, stop, watched, 2n)).toEqual({ kind: "signal" });
      expect(times.has("on-after-db-write@2")).toBe(true);
      const held: Held = ["redelivery@2"];
      expect(raisedOf(watched, held)).toEqual([
        expect.objectContaining({ window: "redelivery", height: 2n, point: "on-after-db-write", module: "m" }),
      ]);
      expect(endedOf(watched, held)).toEqual([expect.objectContaining({ window: "redelivery", height: 2n, completed: true })]);
      expect(loop.slowBlock()).toBeNull();
    },
    BUDGET_MS,
  );

  it(
    "a COMMIT that landed though its connection was lost: the retry's points after it are the window after the commit",
    async () => {
      const { db: raw } = await backend.database();
      const times: Times = new Map();
      const losing = landingCommits(raw);
      // Height 2's on-db-write arms the database once: its COMMIT lands, then the connection is reported lost.
      const m = holder("m", { "on-after-db-write@2": 1_500 }, times, {
        onWrite: (height) => {
          if (height === 2n && !times.has("armed")) {
            times.set("armed", { start: 0, end: 0 });
            losing.state.armed = true;
          }
        },
      });
      const started = await startWith(raw, [m], [entry("m", 1)]);
      const source = new InMemoryBlockSource({ head: 2n });
      const { loop, stop, watched } = watchedLoop(started, source, 1_000, { db: losing.db });
      const failure = await runWatched(loop, source, stop, watched, 2n);
      expect(failure).toBeInstanceOf(HeightFailure);
      expect(failure).toMatchObject({ height: 2n, committed: false });
      expect(times.has("on-after-db-write@2")).toBe(false);
      const held: Held = ["after-commit@2"];
      expect(raisedOf(watched, held)).toEqual([]);
      // The retry, on the same loop: the cursor read finds 2 committed; its on-after-db-write (1,500 ms) runs in the
      // window after the commit, which opens there.
      expect(await runWatched(loop, source, stop, watched, 2n)).toEqual({ kind: "signal" });
      expect(times.has("on-after-db-write@2")).toBe(true);
      expect(raisedOf(watched, held)).toEqual([
        expect.objectContaining({ window: "after-commit", height: 2n, point: "on-after-db-write", module: "m" }),
      ]);
      expect(endedOf(watched, held)).toEqual([expect.objectContaining({ window: "after-commit", height: 2n, completed: true })]);
      expect(loop.slowBlock()).toBeNull();
    },
    BUDGET_MS,
  );

  it(
    "a failure closes the window it happened in: the event says it did not complete, and nothing shows afterwards",
    async () => {
      const { db } = await backend.database();
      const times: Times = new Map();
      const m = holder("m", { "on-after-db-write@2": 1_500 }, times, { fails: { "on-after-db-write@2": new Error("m fails") } });
      const started = await startWith(db, [m], [entry("m", 1)]);
      const source = new InMemoryBlockSource({ head: 2n });
      const { loop, stop, watched } = watchedLoop(started, source, 1_000);
      const failure = await runWatched(loop, source, stop, watched, 2n);
      expect(failure).toBeInstanceOf(HeightFailure);
      expect(failure).toMatchObject({ height: 2n, committed: true, point: "on-after-db-write", module: "m" });
      const held: Held = ["after-commit@2"];
      expect(raisedOf(watched, held)).toEqual([
        expect.objectContaining({ window: "after-commit", height: 2n, point: "on-after-db-write", module: "m" }),
      ]);
      expect(endedOf(watched, held)).toEqual([expect.objectContaining({ window: "after-commit", height: 2n, completed: false })]);
      expect(loop.slowBlock()).toBeNull();
      await sleep(1_200);
      expect(eventsOf(watched, held)).toHaveLength(2);
    },
    BUDGET_MS,
  );

  it(
    "a height stopped at the lockstep wait closes its window: raised before the stop, ended with it, nothing after",
    async () => {
      // slowBlockMs 2,000: height 1's window opens at its first callback, and its reads before the lockstep wait count
      // too — at least 1.8 s is left for them on a loaded machine.
      const held: Held = ["height@1"];
      for (const [stopAfterMs, raises] of [
        [2_700, true],
        [200, false],
      ] as const) {
        const { db } = await backend.database();
        const started = await startWith(db, [holder("m", {}, new Map())], [entry("m", 1)]);
        const source = new InMemoryBlockSource({ head: 1n });
        let asked: () => void = () => undefined;
        const gate: LockstepWait = {
          wait: (_height, signal) =>
            new Promise<boolean>((resolve) => {
              asked();
              signal.addEventListener("abort", () => resolve(false), { once: true });
            }),
        };
        const { loop, stop, watched } = watchedLoop(started, source, 2_000, { lockstep: gate });
        const atGate = new Promise<void>((resolve) => {
          asked = resolve;
        });
        const running = loop.run();
        await atGate;
        await sleep(stopAfterMs);
        stop.abort();
        expect(await running).toEqual({ kind: "signal" });
        expect(loop.slowBlock()).toBeNull();
        if (raises) {
          expect(raisedOf(watched, held)).toEqual([
            expect.objectContaining({ window: "height", height: 1n, point: "on-compute", module: null }),
          ]);
          expect(endedOf(watched, held)).toEqual([expect.objectContaining({ window: "height", height: 1n, completed: false })]);
        }
        // Past the timer's due time (at most 2 s after the wait began) with the loop ended: nothing more is raised.
        await sleep(2_300);
        expect(eventsOf(watched, held).map(({ event }) => event.kind)).toEqual(raises ? ["raised", "ended"] : []);
        expect(loop.slowBlock()).toBeNull();
      }
    },
    BUDGET_MS,
  );
});
