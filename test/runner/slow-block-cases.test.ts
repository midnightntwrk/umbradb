import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { type ProbeRecord, startProber, statusWhen } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { loggingModule } from "./process-build.js";
import {
  type AskedSource,
  askedSource,
  bodySlowOf,
  goneProblems,
  slowLines,
  hold,
  HOLD_MS,
  holding,
  jsonBigint,
  type Observed,
  observe,
  preparingSource,
  type Seen,
  SLOW_HEIGHT,
  slowOf,
  STATUS_SCHEMA,
  startSlow,
  WITHIN_MS,
} from "./slow-block-harness.js";

/**
 * What RN-17 leaves to the design, settled by task 5.5 and tested here through the process on PostgreSQL 18 and PGlite
 * 0.5.10 (A142 itself is `./slow-block.test.ts`):
 * - **the module** at a point in waves is the first whose callback runs, in the point's order; once it ended, the next;
 * - **no callback running:** in the block transaction — the loop's cursor check before the `COMMIT`, the wait for its
 *   `BEGIN` — the point is `on-db-write` and the module null;
 * - **a height that commits in time** is never reported: its timer ends with its window;
 * - **a halt** clears the condition, and logs that the slow height stopped without committing;
 * - **a held height's retry** (IN-10, task 10.4) is a run of its own: its window opens where it resumes, so neither the
 *   earlier attempt nor the back-off counts;
 * - **a height the source prepares ahead** (its `on-fetch` and `on-parse` in the source's queue, as the node source
 *   runs them): its window opens when the loop asks for it if its `on-parse` runs then — the point and module the
 *   queue's —, and the queue's work for it while the heights before it ran is not its time;
 * - **a callback that blocks the main thread** stops the watchdog's timer and every publication: `/status`, answered
 *   from the snapshot published before the block, shows no `slow-block` throughout, then the height commits once and no
 *   read after the commit shows the condition.
 *
 * Each test waits on purpose (seconds of callbacks): its budget is that plus Vitest's 60 s.
 */

const BUDGET_MS = 10_000 + 60_000;

/** The `slow-block` conditions `status()` showed, with when. */
const shownOf = (observed: Observed) =>
  observed.statuses.flatMap(({ at, status }) => {
    const slow = slowOf(status);
    return slow === undefined ? [] : [{ at, point: slow.point as string, module: slow.module as string | null, height: slow.height }];
  });

/** A module that writes a row per height and, at height 2's `on-db-write`, marks `flag` once its row is written. */
function marking(flag: { wrote: boolean }): ModuleDeclaration {
  const base = loggingModule("mark", [], ["on-db-write"]);
  const write = base.points["on-db-write"] as NonNullable<ModuleDeclaration["points"]["on-db-write"]>;
  return {
    ...base,
    points: {
      ...base.points,
      async "on-db-write"(p, b, w) {
        await write.call(base.points, p, b, w);
        if (b.height === SLOW_HEIGHT) flag.wrote = true;
      },
    },
  };
}

/** How long the block transaction's waits below last, and when the wait began (`performance.now()`). */
const WAIT_MS = 4_000;
interface Wait {
  at?: number;
}

/**
 * The in-memory chain whose cursor read inside height 2's block transaction — the loop's check, once every
 * `on-db-write` callback has ended — waits {@link WAIT_MS} once.
 */
function slowCheck(flag: { wrote: boolean }, wait: Wait): AskedSource {
  const inner = askedSource(SLOW_HEIGHT);
  return {
    ...inner,
    source: {
      ...inner.source,
      cursor: async (read) => {
        if (flag.wrote && wait.at === undefined) {
          wait.at = performance.now();
          await sleep(WAIT_MS);
        }
        return inner.source.cursor(read);
      },
    },
  };
}

/**
 * A loop whose block transaction for height 2 waits {@link WAIT_MS} before its `BEGIN`, every `on-compute` callback
 * having ended (as on PGlite's queue, or the lockstep wait).
 */
function lateBegin(wait: Wait): new (input: LoopInput) => FinalizedLoop {
  return class LateBegin extends FinalizedLoop {
    protected override async commit(run: HeightRun): Promise<void> {
      if (run.height === SLOW_HEIGHT) {
        wait.at = performance.now();
        await sleep(WAIT_MS);
      }
      await super.commit(run);
    }
  };
}

/** When a timed callback began and ended (`performance.now()`), by `<point>@<height>`. */
type Times = Map<string, { readonly start: number; readonly end: number }>;

/**
 * Module `p`: its `on-parse` and `on-compute` at each `<point>@<height>` of `holds` await that many milliseconds,
 * recording in `times` when each began and ended.
 */
function timed(holds: Readonly<Record<string, number>>, times: Times): ModuleDeclaration {
  const base = loggingModule("p", [], ["on-db-write"]);
  const at = async (name: string): Promise<void> => {
    const ms = holds[name];
    if (ms === undefined) return;
    const start = performance.now();
    await hold(ms, "await");
    times.set(name, { start, end: performance.now() });
  };
  return {
    ...base,
    points: {
      ...base.points,
      async "on-parse"(_p, b: BlockContext) {
        await at(`on-parse@${b.height}`);
      },
      async "on-compute"(_p, b: BlockContext) {
        await at(`on-compute@${b.height}`);
      },
    },
  };
}

/** The in-memory chain whose block 2 the source gives only after 3 s (a node slow to answer). */
function slowFetch(): AskedSource {
  const inner = askedSource(SLOW_HEIGHT);
  return {
    ...inner,
    source: {
      ...inner.source,
      block: async (height) => {
        const block = inner.source.block(height);
        if (height === SLOW_HEIGHT) await sleep(HOLD_MS);
        return block;
      },
    },
  };
}

/** Every `slow-block` problem of a run that must never show one: in `status()`, in `/status`, in the log. */
function neverShown(observed: Observed, lines: readonly string[]): string[] {
  const problems: string[] = [];
  const shown = shownOf(observed);
  if (shown.length > 0) problems.push(`status() showed slow-block: ${JSON.stringify(shown[0], jsonBigint)}`);
  if (observed.bodies.some(({ body }) => bodySlowOf(body) !== undefined)) problems.push("/status showed slow-block");
  const logged = slowLines(lines);
  if (logged.length > 0) problems.push(`slow-block was logged: ${logged.join(" | ")}`);
  if (observed.committedAt === undefined) problems.push(`height ${SLOW_HEIGHT} never committed`);
  return problems;
}

describe.each(PROCESS_BACKENDS)("slow-block's settled cases on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it(
    "at a point in waves: the first module running in the point's order, then the next once it ended",
    async () => {
      const a: Seen = { calls: [] };
      const b: Seen = { calls: [] };
      const run = startSlow(await backend.database(), {
        slowBlockMs: 1_000,
        user: [holding("a", a, { ms: 2_500 }), holding("b", b, { ms: 4_000 })],
      });
      try {
        const observed = await observe(run);
        const shown = shownOf(observed);
        // One wave (each requires only the backbone's block-header): on PostgreSQL a and b run together; on PGlite each
        // callback's read is a job of the one queue, so b's waits for a's — b is running (its read opening) meanwhile.
        if (backend.kind === "postgres") expect(b.start as number).toBeLessThan(a.end as number);
        else expect(b.start as number).toBeGreaterThanOrEqual(a.end as number);
        const computing = shown.filter(({ point }) => point === "on-compute");
        expect(computing[0]).toMatchObject({ height: SLOW_HEIGHT, point: "on-compute", module: "a" });
        // a while its callback runs (its read's end included), then b, never a again; b only once a's callback ended.
        const order = computing.map(({ module }) => module).filter((module, index, all) => module !== all[index - 1]);
        expect(order).toEqual(["a", "b"]);
        const firstB = computing.find(({ module }) => module === "b");
        expect(firstB!.at).toBeGreaterThan(a.end as number);
        expect(computing.filter(({ at }) => at < (a.end as number)).every(({ module }) => module === "a")).toBe(true);
        expect(goneProblems(observed)).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "in the block transaction with no callback running — the cursor check, the wait for BEGIN — on-db-write, no module",
    async () => {
      // slowBlockMs 2000: height 2 is slow during the 4 s wait, also when a loaded machine took it 2 s to get there.
      for (const [name, start] of [
        ["the cursor check", (db: Awaited<ReturnType<typeof backend.database>>, wait: Wait) => {
          const flag = { wrote: false };
          return startSlow(db, { slowBlockMs: 2_000, user: [marking(flag)], source: slowCheck(flag, wait) });
        }],
        ["the wait for BEGIN", (db: Awaited<ReturnType<typeof backend.database>>, wait: Wait) =>
          startSlow(db, { slowBlockMs: 2_000, user: [marking({ wrote: false })], loop: lateBegin(wait) })],
      ] as const) {
        const wait: Wait = {};
        const run = start(await backend.database(), wait);
        try {
          const observed = await observe(run);
          const began = wait.at as number;
          // While it waits no callback runs: on-db-write, no module (after it, on-db-write's callbacks may show).
          const waiting = shownOf(observed).filter(({ at }) => at > began && at < began + WAIT_MS);
          expect(waiting.length, name).toBeGreaterThan(0);
          expect(new Set(waiting.map(({ point, module }) => `${point} ${module}`)), name).toEqual(new Set(["on-db-write null"]));
          // /status a heartbeat after the wait began (a snapshot published earlier may still be served until then).
          const bodies = observed.bodies.filter(({ at, body }) => at > began + 1_500 && at < began + WAIT_MS && bodySlowOf(body));
          expect(bodies.length, name).toBeGreaterThan(0);
          for (const { body } of bodies) {
            expect(bodySlowOf(body), name).toEqual({ code: "slow-block", height: String(SLOW_HEIGHT), point: "on-db-write", module: null });
            expect(STATUS_SCHEMA.problems(body), name).toEqual([]);
          }
          const [raised, cleared] = slowLines(run.lines);
          if ((shownOf(observed)[0]?.at ?? 0) > began) {
            expect(raised, name).toBe("slow block: height 2 is still processing after slowBlockMs (2000 ms), in on-db-write");
          }
          expect(cleared, name).toMatch(/^slow block: height 2 committed after \d+ ms$/);
          expect(goneProblems(observed), name).toEqual([]);
        } finally {
          await run.handle.stop();
        }
      }
    },
    2 * BUDGET_MS,
  );

  it(
    "a height that committed within slowBlockMs is never reported afterwards: its timer ends with its window",
    async () => {
      // Heights 1 and 2 commit fast; the watch is read until 2.5 s after the last commit, past both timers' due time.
      const run = startSlow(await backend.database(), { slowBlockMs: 2_000, user: [marking({ wrote: false })] });
      try {
        const observed = await observe(run);
        while (performance.now() < (observed.committedAt ?? 0) + 2_500) await sleep(100);
        expect(run.lines.filter((line) => line.startsWith("slow block"))).toEqual([]);
        expect(observed.statuses.filter(({ status }) => slowOf(status, null) !== undefined)).toEqual([]);
        expect(slowOf(run.handle.status(), null)).toBeUndefined();
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "a halt clears it: the halted process shows no slow-block, and the log says the height stopped without committing",
    async () => {
      const seen: Seen = { calls: [] };
      const failing = holding("slow", seen, { ms: 2_500, calls: () => ({ then: new Error("the test's failure") }) });
      const run = startSlow(await backend.database(), { slowBlockMs: 1_000, user: [failing] });
      try {
        const observed = await observe(run);
        expect(shownOf(observed).at(-1)).toMatchObject({ height: SLOW_HEIGHT, point: "on-compute", module: "slow" });
        const status = run.handle.status();
        expect(status.state).toBe("halted");
        expect(status.reason).toMatchObject({ code: "callback-error", height: SLOW_HEIGHT, module: "slow", point: "on-compute" });
        expect(slowOf(status)).toBeUndefined();
        const body = await statusWhen(await run.origin(), (shown) => shown.state === "halted");
        expect(bodySlowOf(body)).toBeUndefined();
        const lines = run.lines.filter((line) => slowLines([line]).length > 0 || line.startsWith("processing halted"));
        expect(lines).toEqual([
          expect.stringMatching(/^slow block: height 2 is still processing after slowBlockMs \(1000 ms\), in on-/),
          expect.stringMatching(/^slow block: height 2 stopped without committing after \d+ ms$/),
          expect.stringMatching(/^processing halted \(callback-error\): /),
        ]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "a held height's retry is a run of its own: neither the earlier attempts nor the back-offs count",
    async () => {
      const seen: Seen = { calls: [] };
      // Three attempts fail after 800 ms (node-unreachable: retried), with back-offs of 1, 2 and 4 s; the fourth
      // commits. Counted from the first attempt, or through the last back-off alone, height 2 would pass slowBlockMs
      // 2500; each run is 800 ms and the commit (well within it on a loaded machine).
      const unreachable = () => new UmbraError("node-unreachable", "the test's node did not answer");
      const flaky = holding("slow", seen, { ms: 800, calls: (call) => (call < 4 ? { then: unreachable() } : {}) });
      const run = startSlow(await backend.database(), { slowBlockMs: 2_500, user: [flaky], extra: { backoffCeilingMs: 4_000 } });
      try {
        const observed = await observe(run);
        expect(seen.calls.filter((call) => call === "slow on-compute@2")).toHaveLength(4);
        const retries = run.lines.filter((line) => /^processing retries in \d+ ms \(node-retrying, attempt \d\)/.test(line));
        expect(retries.map((line) => /in (\d+) ms/.exec(line)?.[1])).toEqual(["1000", "2000", "4000"]);
        expect(neverShown(observed, run.lines)).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "a height the source prepares: from when the loop asks for it while its on-parse runs in the queue, that point and module",
    async () => {
      const seen: Seen = { calls: [] };
      const source = preparingSource(askedSource(SLOW_HEIGHT), 1);
      const run = startSlow(await backend.database(), {
        slowBlockMs: 1_000,
        user: [holding("slow", seen, { point: "on-parse" })],
        source,
      });
      try {
        const observed = await observe(run);
        const shown = shownOf(observed);
        expect(shown[0]).toMatchObject({ height: SLOW_HEIGHT, point: "on-parse", module: "slow" });
        const asked = source.asked.get(SLOW_HEIGHT) as number;
        expect(shown[0]!.at - asked).toBeGreaterThan(1_000);
        expect(shown[0]!.at - (seen.start as number)).toBeLessThanOrEqual(WITHIN_MS);
        expect(slowLines(run.lines)[0]).toBe(
          "slow block: height 2 is still processing after slowBlockMs (1000 ms), in on-parse of slow",
        );
        expect(goneProblems(observed)).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "a height whose on-parse already runs in the queue when the loop asks for it: from the ask, that point and module",
    async () => {
      const times: Times = new Map();
      // Height 2's on-parse (4 s, in the queue) begins beside height 1's on-compute (0.9 s): the loop asks for 2 while
      // it runs. From the ask, 2 is slow 1.5 s later; from the queue's start it would be 0.9 s earlier.
      const source = preparingSource(askedSource(SLOW_HEIGHT), 2);
      const holds = { "on-compute@1": 900, "on-parse@2": 4_000 };
      const run = startSlow(await backend.database(), { slowBlockMs: 1_500, user: [timed(holds, times)], source });
      try {
        const observed = await observe(run);
        const parse = times.get("on-parse@2") as { start: number; end: number };
        const asked = source.asked.get(SLOW_HEIGHT) as number;
        expect(asked > parse.start && asked < parse.end).toBe(true);
        const shown = shownOf(observed);
        expect(shown[0]).toMatchObject({ height: SLOW_HEIGHT, point: "on-parse", module: "p" });
        expect(shown[0]!.at - asked).toBeGreaterThan(1_500);
        expect(goneProblems(observed)).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "the node's fetch before a height's first callback is not its time",
    async () => {
      const run = startSlow(await backend.database(), { slowBlockMs: 1_000, user: [marking({ wrote: false })], source: slowFetch() });
      try {
        expect(neverShown(await observe(run), run.lines)).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "a height prepared ahead while the one before it ran: the queue's earlier work for it is not its time",
    async () => {
      const times: Times = new Map();
      // Height 2's on-parse (2 s, in the queue) runs beside height 1's on-compute (2 s); then its own on-compute (2 s).
      // From the queue's start height 2 would be slow at slowBlockMs 3000; its own window is about 2 s.
      const source = preparingSource(askedSource(SLOW_HEIGHT), 2);
      const holds = { "on-compute@1": 2_000, "on-parse@2": 2_000, "on-compute@2": 2_000 };
      const run = startSlow(await backend.database(), { slowBlockMs: 3_000, user: [timed(holds, times)], source });
      try {
        const observed = await observe(run);
        const parse = times.get("on-parse@2");
        const first = times.get("on-compute@1");
        expect(parse !== undefined && first !== undefined && parse.start < first.end).toBe(true);
        expect(neverShown(observed, run.lines)).toEqual([]);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );

  it(
    "a callback that blocks the main thread: /status shows no slow-block while it blocks, and none after the commit",
    async () => {
      const seen: Seen = { calls: [] };
      const run = startSlow(await backend.database(), {
        slowBlockMs: 1_000,
        user: [holding("slow", seen, { mode: "block" })],
        source: askedSource(1n),
      });
      try {
        const origin = await run.origin();
        await statusWhen(origin, (body) => body.cursor === "1", 60_000);
        const prober = await startProber(origin, ["/status"], 100, { bodies: true });
        let records: ProbeRecord[];
        let observed: Observed;
        try {
          await sleep(300);
          run.source.memory.finalize(SLOW_HEIGHT);
          observed = await observe(run);
        } finally {
          records = await prober.stop();
        }
        const startNs = seen.startNs as bigint;
        const endNs = seen.endNs as bigint;
        // Requests sent while the main thread blocked, up to 1 s before it ended (a later one may be answered after).
        const during = records.filter((record) => BigInt(record.sent) >= startNs && BigInt(record.sent) <= endNs - 1_000_000_000n);
        expect(during.length).toBeGreaterThanOrEqual(4);
        for (const record of during) {
          expect(record.status).toBe(200);
          expect(record.ms).toBeLessThan(1_000);
          expect(bodySlowOf(JSON.parse(record.body as string))).toBeUndefined();
        }
        // The main thread's reads: none while it blocked; none showing slow-block after the commit.
        expect(observed.statuses.some(({ at }) => at > (seen.start as number) && at < (seen.end as number))).toBe(false);
        expect(seen.calls.filter((call) => call === "slow on-compute@2")).toHaveLength(1);
        expect(goneProblems(observed)).toEqual([]);
        // Once the thread is free the expired timer may fire before the commit (seen on PostgreSQL, whose read's end and
        // BEGIN wait for I/O; on PGlite the height committed first): then it is raised once, with the point and module
        // of that moment.
        for (const shown of shownOf(observed)) expect(shown.at).toBeGreaterThan(seen.end as number);
        const raised = run.lines.filter((line) => line.startsWith("slow block: height 2 is still processing"));
        expect(raised.length).toBeLessThanOrEqual(1);
        for (const line of raised) expect(line).toMatch(/after slowBlockMs \(1000 ms\), in on-(compute|db-write)( of slow)?$/);
      } finally {
        await run.handle.stop();
      }
    },
    BUDGET_MS,
  );
});
