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
} from "../../src/runner/loop.js";
import { declaration } from "../modules/declarations.js";
import { entry } from "../modules/graph-fixtures.js";
import { InMemoryBlockSource, loopInput, RUNNER_BACKENDS, type Started, startWith } from "./loop-harness.js";

/**
 * The windows of the slow-block watchdog outside a height's processing (task 5.5a; RN-17 as amended by the owner's
 * decision Q145 B; `src/runner/loop.ts`), at the loop level on PostgreSQL 18 and PGlite 0.5.10 — what A161
 * (`./slow-block-outside.test.ts`, through the process) leaves to the design:
 * - **after a commit, one window** from the commit to the end of `on-stop-height`: `on-after-db-write` and
 *   `on-stop-height` together past `slowBlockMs` are slow, each alone not; the point is the last that began;
 * - **each `on-finalized` its own window**, named by the height of the head it announces: two in a row, each within
 *   `slowBlockMs`, are never slow, however long the loop waited between them;
 * - **RN-11's re-delivery** at a run's start, at the cursor's height;
 * - **a `COMMIT` that landed though its connection was lost** (IN-11): the retry's points after it are the window after
 *   the commit;
 * - **a failure closes the window** it happened in (the event says it did not complete); **a height stopped at the
 *   lockstep wait** (PP-6, task 14.3) closes its window too, so nothing is raised once the loop ended.
 * The observer's events and `slowBlock()` are read directly (`window` names which window).
 *
 * Each test waits on purpose (callbacks of up to 1.5 s): its budget is that plus Vitest's 60 s.
 */

const BUDGET_MS = 10_000 + 60_000;

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

/** The raised events of `watched`, as plain data. */
const raisedOf = (watched: Watched) =>
  watched.events.flatMap(({ at, event }) => (event.kind === "raised" ? [{ at, ...event.activity }] : []));

/** The ended events of `watched`, as plain data. */
const endedOf = (watched: Watched) => watched.events.flatMap(({ at, event }) => (event.kind === "ended" ? [{ at, ...event }] : []));

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

/** `db`, whose next block transaction, once `state.armed`, loses its `COMMIT` after it landed (IN-11, DB-13). */
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
      const stopping = times.get("on-stop-height@2") as { start: number; end: number };
      expect(raisedOf(watched)).toEqual([
        expect.objectContaining({ window: "after-commit", height: 2n, point: "on-stop-height", module: "m" }),
      ]);
      const raised = raisedOf(watched)[0]!;
      expect(raised.at).toBeGreaterThan(stopping.start);
      // Raised by the window's 1,600 ms, not by on-stop-height's 1,500 (a Node.js timer may fire up to a millisecond
      // before performance.now() counts its delay).
      expect(raised.sinceMs).toBeGreaterThanOrEqual(1_600 - 2);
      expect(endedOf(watched)).toEqual([expect.objectContaining({ window: "after-commit", height: 2n, completed: true })]);
      expect(endedOf(watched)[0]!.at).toBeGreaterThanOrEqual(stopping.end);
      // slowBlock() showed it in on-stop-height only, and none after the window ended.
      const shown = watched.reads.filter(({ slow }) => slow !== null);
      expect(new Set(shown.map(({ slow }) => `${slow!.window} ${slow!.height} ${slow!.point} ${slow!.module}`))).toEqual(
        new Set(["after-commit 2 on-stop-height m"]),
      );
      expect(shown.every(({ at }) => at >= stopping.start && at <= endedOf(watched)[0]!.at)).toBe(true);
      expect(loop.slowBlock()).toBeNull();
    },
    BUDGET_MS,
  );

  it(
    "each on-finalized is a window of its own, named by the head it announces, the wait between heads not counted",
    async () => {
      const { db } = await backend.database();
      const times: Times = new Map();
      // Head 1's on-finalized awaits 700 ms, head 2's (announced after the loop waited 1.2 s) 1,500 ms; slowBlockMs 1,000.
      const f = holder("f", { "on-finalized@1": 700, "on-finalized@2": 1_500 }, times);
      const started = await startWith(db, [f], [entry("f", 1)]);
      const source = new InMemoryBlockSource({ head: 1n });
      const { loop, stop, watched } = watchedLoop(started, source, 1_000);
      const running = runWatched(loop, source, stop, watched, 2n);
      await source.waiting(1n);
      await sleep(1_200);
      source.finalize(2n);
      expect(await running).toEqual({ kind: "signal" });
      const second = times.get("on-finalized@2") as { start: number; end: number };
      const raised = raisedOf(watched);
      expect(raised).toEqual([expect.objectContaining({ window: "finalized", height: 2n, point: "on-finalized", module: "f" })]);
      expect(raised[0]!.at - second.start).toBeGreaterThan(500);
      expect(endedOf(watched)).toEqual([expect.objectContaining({ window: "finalized", height: 2n, completed: true })]);
      expect(watched.reads.filter(({ at, slow }) => slow !== null && at < second.start)).toEqual([]);
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
      expect(first.watched.events).toEqual([]);
      armed = true;
      const { loop, stop, watched } = watchedLoop(started, source, 1_000);
      expect(await runWatched(loop, source, stop, watched, 2n)).toEqual({ kind: "signal" });
      expect(times.has("on-after-db-write@2")).toBe(true);
      expect(raisedOf(watched)).toEqual([
        expect.objectContaining({ window: "redelivery", height: 2n, point: "on-after-db-write", module: "m" }),
      ]);
      expect(endedOf(watched)).toEqual([expect.objectContaining({ window: "redelivery", height: 2n, completed: true })]);
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
      expect(raisedOf(watched)).toEqual([]);
      // The retry, on the same loop: the cursor read finds 2 committed; its on-after-db-write (1,500 ms) runs in the
      // window after the commit, which opens there.
      expect(await runWatched(loop, source, stop, watched, 2n)).toEqual({ kind: "signal" });
      expect(times.has("on-after-db-write@2")).toBe(true);
      expect(raisedOf(watched)).toEqual([
        expect.objectContaining({ window: "after-commit", height: 2n, point: "on-after-db-write", module: "m" }),
      ]);
      expect(endedOf(watched)).toEqual([expect.objectContaining({ window: "after-commit", height: 2n, completed: true })]);
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
      expect(raisedOf(watched)).toEqual([
        expect.objectContaining({ window: "after-commit", height: 2n, point: "on-after-db-write", module: "m" }),
      ]);
      expect(endedOf(watched)).toEqual([expect.objectContaining({ window: "after-commit", height: 2n, completed: false })]);
      expect(loop.slowBlock()).toBeNull();
      await sleep(1_200);
      expect(watched.events).toHaveLength(2);
    },
    BUDGET_MS,
  );

  it(
    "a height stopped at the lockstep wait closes its window: raised before the stop, ended with it, nothing after",
    async () => {
      for (const [stopAfterMs, raises] of [
        [1_200, true],
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
        const { loop, stop, watched } = watchedLoop(started, source, 500, { lockstep: gate });
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
          expect(raisedOf(watched)).toEqual([expect.objectContaining({ window: "height", height: 1n, point: "on-compute", module: null })]);
          expect(endedOf(watched)).toEqual([expect.objectContaining({ window: "height", height: 1n, completed: false })]);
        }
        // Past the timer's due time with the loop ended: nothing more is raised.
        await sleep(800);
        expect(watched.events.map(({ event }) => event.kind)).toEqual(raises ? ["raised", "ended"] : []);
        expect(loop.slowBlock()).toBeNull();
      }
    },
    BUDGET_MS,
  );
});
