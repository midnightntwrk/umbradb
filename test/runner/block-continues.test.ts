import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import type { PostgresParts } from "../../src/config/database-parts.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { FinalizedLoop } from "../../src/runner/loop.js";
import { LoopPauses, type PauseHold } from "../../src/runner/pause.js";
import { blockFetchStandIn } from "../backbone/block-fetch-stand-in.js";
import { type ChainBlock, chainOf, finalized, opening, RUNTIME } from "../backbone/fetch-fixtures.js";
import { committed, ingest, PATIENCE_MS, slow } from "../backbone/ingest-harness.js";
import { entry } from "../modules/graph-fixtures.js";
import {
  continuesExpected,
  continuesModule,
  continuesOf,
  continuesProblems,
  type COptions,
  H,
  HEAD,
  losingCommits,
} from "./block-continues-harness.js";
import { type CommitFault, CommitProxy } from "./commit-proxy.js";
import { cursorOf, InMemoryBlockSource, LOOP_BACKBONE, loopInput, RUNNER_BACKENDS, startWith } from "./loop-harness.js";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { core, entryOf, settle, startProcess, testBuild } from "./process-build.js";

/**
 * A block context's `continues` through the finalized loop (`src/runner/loop.ts`) on PostgreSQL 18 and PGlite 0.5.10,
 * and through the process on PostgreSQL 18 with a real lost `COMMIT`. It is true when the block before was committed
 * by this run of the loop, with no failure between: the `COMMIT` of h − 1 answered in the same run. So, for heights 1
 * to 5, h = 3 the one a test interrupts:
 * - one run: false at its first height, true from its second on;
 * - always false at `on-fetch` and `on-parse`, which may run before the block before committed;
 * - a `COMMIT` lost before it landed: h made again in the next run is its first height, false; h + 1 true;
 * - a `COMMIT` lost after it landed: the next run's cursor read finds h committed; h's points after the commit and
 *   h + 1 (the run's first height) false, h + 2 true;
 * - a height held after a lost connection before its `COMMIT`: as a `COMMIT` lost before it landed;
 * - the re-delivery at a run's start: false there and at the next height, true after, also when the same loop runs
 *   again after a retryable failure in h's `on-after-db-write` (h released already by that loop);
 * - a range boundary inside a run (another module starting at h), a change of the blocks' ledger version at h, and a
 *   pause between h − 1 and h released: true at h, as at any other height of the run;
 * - through the process over the node source, which fetches and parses heights ahead of the loop (its prefetch
 *   window): always false at `on-fetch` and `on-parse`, whose callbacks run in the source's queue, and true from the
 *   run's second height at the other points;
 * - a process stopped at h and a new one started on the same database, as at an upgrade boundary (the old build stops
 *   before the new one's first height): the re-delivery of h and the new process's first height, h + 1, false; h + 2
 *   true.
 * The negative control (a loop that keeps `continues` true after a retry) is in
 * `block-continues.negative-control.test.ts`.
 */

describe.each(RUNNER_BACKENDS)("a block context's continues through the loop on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** Module `c` over a fresh database, its block transactions able to lose a `COMMIT`, and loops over them. */
  async function setUp(options: COptions = {}, head: bigint = HEAD) {
    const { db: raw } = await backend.database();
    const log: string[] = [];
    const losing = losingCommits(raw);
    const module = continuesModule(log, options);
    const started = await startWith(raw, [module], [entry("c", 1)]);
    const source = new InMemoryBlockSource({ head });
    /** A new loop, as a process makes one at its start. */
    const loopOf = () => {
      const stop = new AbortController();
      return { loop: new FinalizedLoop({ ...loopInput(started, source, stop), db: losing.db }), stop };
    };
    /** One run of `made`'s loop: its failure, or — once it waits for a head above the source's, stopped — undefined. */
    const run = async ({ loop, stop }: ReturnType<typeof loopOf>): Promise<unknown> => {
      const running = loop.run().then(
        () => undefined,
        (error: unknown) => error,
      );
      if ((await Promise.race([source.waiting(source.head).then(() => "waiting" as const), running])) === "waiting") stop.abort();
      return running;
    };
    return { raw, log, losing, source, loopOf, run };
  }

  it("false at a run's first height, true from its second on; always false at on-fetch and on-parse", async () => {
    const { raw, log, loopOf, run } = await setUp();
    expect(await run(loopOf())).toBeUndefined();
    expect(continuesProblems(continuesOf(log), continuesExpected(HEAD))).toEqual([]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a COMMIT lost before it landed: h made again in the next run is its first height, false; h + 1 true", async () => {
    const armed = { done: false };
    const { raw, losing, loopOf, run, log } = await setUp({
      atWrite: (height) => {
        if (height === H && !armed.done) {
          armed.done = true;
          losing.state.armed = "lost";
        }
      },
    });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    expect(await cursorOf(raw)).toBe(H - 1n);
    expect(await run(made)).toBeUndefined();
    const expected = continuesExpected(HEAD, {
      [`on-compute@${H}`]: [true, false],
      [`on-db-write@${H}`]: [true, false],
      [`on-after-db-write@${H}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a COMMIT lost after it landed: h's points after the commit and h + 1, the next run's first height, false; h + 2 true", async () => {
    const armed = { done: false };
    const { raw, losing, loopOf, run, log } = await setUp({
      atWrite: (height) => {
        if (height === H && !armed.done) {
          armed.done = true;
          losing.state.armed = "landed";
        }
      },
    });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    expect(await cursorOf(raw)).toBe(H);
    expect(await run(made)).toBeUndefined();
    const expected = continuesExpected(HEAD, {
      [`on-after-db-write@${H}`]: [false],
      [`on-compute@${H + 1n}`]: [false],
      [`on-db-write@${H + 1n}`]: [false],
      [`on-after-db-write@${H + 1n}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a height held after a lost connection in its on-db-write: false when processed again, true for the height after it", async () => {
    const faults = new Map([[`on-db-write@${H}`, new UmbraError("connection-lost", "the writer's connection was lost")]]);
    const { raw, loopOf, run, log } = await setUp({ faults });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: false });
    expect(await run(made)).toBeUndefined();
    const expected = continuesExpected(HEAD, {
      [`on-compute@${H}`]: [true, false],
      [`on-db-write@${H}`]: [true, false],
      [`on-after-db-write@${H}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("the re-delivery at a run's start: false there and at the next height, true after", async () => {
    const { raw, source, loopOf, run, log } = await setUp({}, H);
    expect(await run(loopOf())).toBeUndefined();
    expect(await cursorOf(raw)).toBe(H);
    source.finalize(HEAD);
    // A new loop, as after a restart: it delivers the cursor's on-after-db-write again first.
    expect(await run(loopOf())).toBeUndefined();
    const expected = continuesExpected(HEAD, {
      [`on-after-db-write@${H}`]: [true, false],
      [`on-compute@${H + 1n}`]: [false],
      [`on-db-write@${H + 1n}`]: [false],
      [`on-after-db-write@${H + 1n}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);
  /** One run of module `c` over heights 1 to HEAD with `build`'s backbone, more modules and pause; its log. */
  async function oneRun(
    build: {
      readonly backbone?: readonly ModuleDeclaration[];
      readonly modules?: readonly { readonly module: ModuleDeclaration; readonly start: number }[];
      readonly pause?: LoopPauses;
      readonly options?: COptions;
    },
    log: string[] = [],
  ) {
    const { db: raw } = await backend.database();
    const modules = build.modules ?? [];
    const started = await startWith(
      raw,
      [continuesModule(log, build.options ?? {}), ...modules.map(({ module }) => module)],
      [entry("c", 1), ...modules.map(({ module, start }) => entry(module.id, start))],
      build.backbone === undefined ? {} : { backbone: build.backbone },
    );
    const source = new InMemoryBlockSource({ head: HEAD });
    const stop = new AbortController();
    const loop = new FinalizedLoop({ ...loopInput(started, source, stop), ...(build.pause === undefined ? {} : { pause: build.pause }) });
    const running = loop.run().then(
      () => undefined,
      (error: unknown) => error,
    );
    if ((await Promise.race([source.waiting(HEAD).then(() => "waiting" as const), running])) === "waiting") stop.abort();
    expect(await running).toBeUndefined();
    expect(await cursorOf(raw)).toBe(HEAD);
    return log;
  }

  it("a retryable failure in h's on-after-db-write, then the same loop's next run: its re-delivery of h and h + 1 false, h + 2 true", async () => {
    const faults = new Map([[`on-after-db-write@${H}`, new UmbraError("connection-lost", "the connection was lost (the test's fault)")]]);
    const { raw, loopOf, run, log } = await setUp({ faults });
    const made = loopOf();
    expect(await run(made)).toMatchObject({ height: H, committed: true });
    expect(await run(made)).toBeUndefined();
    const expected = continuesExpected(HEAD, {
      [`on-after-db-write@${H}`]: [true, false],
      [`on-compute@${H + 1n}`]: [false],
      [`on-db-write@${H + 1n}`]: [false],
      [`on-after-db-write@${H + 1n}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(await cursorOf(raw)).toBe(HEAD);
  }, 60_000);

  it("a range boundary inside a run (module e starting at h): true at h", async () => {
    const log = await oneRun({ modules: [{ module: quietModule("e"), start: Number(H) }] });
    expect(continuesProblems(continuesOf(log), continuesExpected(HEAD))).toEqual([]);
  }, 60_000);

  it("the blocks' ledger version changing at h (v8 below it, v9 from it): true at h", async () => {
    const fetch = blockFetchStandIn({ ledger: (b) => (b.height < H ? "v8" : "v9") });
    const backbone = LOOP_BACKBONE.map((part) => (part.id === "core-block-fetch" ? fetch : part));
    const log = await oneRun({ backbone });
    expect(continuesProblems(continuesOf(log), continuesExpected(HEAD))).toEqual([]);
  }, 60_000);

  it("a pause between h − 1 and h, released: true at h", async () => {
    const pauses = new LoopPauses();
    let hold: PauseHold | undefined;
    /** Where the loop paused: the number of `c`'s calls logged by then. */
    let pausedAfter = -1;
    const log: string[] = [];
    await oneRun(
      {
        pause: pauses,
        options: {
          atCompute: async (height) => {
            if (height !== H - 1n || hold !== undefined) return;
            const held = pauses.hold();
            hold = held;
            // Released once the loop paused after h − 1 committed.
            void held.reached.then(() => {
              pausedAfter = log.length;
              held.release();
            });
          },
        },
      },
      log,
    );
    expect(pausedAfter).toBeGreaterThan(0);
    expect(log.slice(0, pausedAfter).at(-1)).toBe(`c on-after-db-write@${H - 1n} true`);
    expect(continuesProblems(continuesOf(log), continuesExpected(HEAD))).toEqual([]);
  }, 60_000);
});

/** Through the process on PostgreSQL 18: the writer's backend terminated at the `COMMIT` of H by a proxy. */
describe("continues through the process with a lost COMMIT on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres") as (typeof PROCESS_BACKENDS)[number];
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** A process through a {@link CommitProxy} on a fresh database, with `c`, the proxy armed at H. */
  async function processRun(fault: CommitFault): Promise<{ readonly log: string[]; readonly cursor: number; readonly faults: readonly string[] }> {
    const db = await backend.database();
    const proxy = await CommitProxy.start(db.setting as PostgresParts);
    const log: string[] = [];
    const terminate = () => (db.terminateWriter as () => Promise<number>)();
    let armed = false;
    const module = continuesModule(log, {
      atWrite: (height) => {
        if (height !== H || armed) return;
        armed = true;
        void proxy.arm(fault, { terminate });
      },
    });
    const source = new InMemoryBlockSource({ head: HEAD });
    const handle = startProcess({
      declarations: testBuild([module]).declarations,
      config: {
        data: {
          entries: [core(proxy.setting(db.setting as PostgresParts), 1, { extra: { backoffCeilingMs: 20 } }), entryOf(module, 1)],
        },
      },
      source,
      log: (line) => log.push(`log ${line}`),
    });
    try {
      expect(await Promise.race([settle(handle, source, HEAD), handle.ended])).toBe("waiting");
    } finally {
      await handle.stop();
      await proxy.close();
    }
    const [row] = await db.query("SELECT max(height)::int AS h FROM core_block_commit.blocks");
    return { log, cursor: Number(row?.h), faults: proxy.faults };
  }

  it("lost before it landed: h made again after the retry false, h + 1 true", async () => {
    const { log, cursor, faults } = await processRun("before");
    expect(faults).toEqual(["before"]);
    const expected = continuesExpected(HEAD, {
      [`on-compute@${H}`]: [true, false],
      [`on-db-write@${H}`]: [true, false],
      [`on-after-db-write@${H}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(cursor).toBe(Number(HEAD));
  }, 120_000);

  it("lost after it landed: h's points after the commit and h + 1 false after the retry, h + 2 true", async () => {
    const { log, cursor, faults } = await processRun("after");
    expect(faults).toEqual(["after"]);
    const expected = continuesExpected(HEAD, {
      [`on-after-db-write@${H}`]: [false],
      [`on-compute@${H + 1n}`]: [false],
      [`on-db-write@${H + 1n}`]: [false],
      [`on-after-db-write@${H + 1n}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(log.some((line) => line.startsWith("log processing retries in"))).toBe(true);
    expect(cursor).toBe(Number(HEAD));
  }, 120_000);
});

/** A module with a table and no points, so that its entry's start makes a range boundary. */
function quietModule(id: string): ModuleDeclaration {
  return {
    id,
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [{ name: `${id}-rows`, lifetimes: ["table"], table: { schema: id, tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: `CREATE TABLE ${id}.rows (height bigint PRIMARY KEY)` }],
    points: {},
  };
}

/** Through the process over the node source and a tape node, whose queue prepares heights ahead of the loop. */
describe.each(PROCESS_BACKENDS)("continues with the node source's prefetching, through the process on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  const LAST = 12;

  it("on-fetch and on-parse, run ahead in the source's queue, always false; the other points true from the run's second height", async () => {
    const db = await backend.database();
    const chain = chainOf(BigInt(LAST));
    const records = [
      ...opening(chain[0] as ChainBlock, chain[LAST] as ChainBlock),
      ...chain.slice(1).flatMap((block, index) => finalized(block, RUNTIME, index === 0)),
    ];
    const log: string[] = [];
    // A slow on-compute keeps the loop behind the prefetch, so heights are fetched and parsed ahead of it.
    const run = await ingest(db, records, { start: 1n, settings: { prefetchWindow: 8 }, user: [continuesModule(log), slow(20)] });
    try {
      await committed(run, BigInt(LAST), PATIENCE_MS);
    } finally {
      await run.close();
    }
    // The source prepared a height ahead: its on-fetch came before the loop's on-compute of the height below it.
    const ahead = Array.from({ length: LAST - 1 }, (_, i) => BigInt(i + 1)).filter(
      (h) => log.indexOf(`c on-fetch@${h + 1n} false`) >= 0 && log.indexOf(`c on-fetch@${h + 1n} false`) < log.indexOf(`c on-compute@${h} ${String(h > 1n)}`),
    );
    expect(ahead.length).toBeGreaterThan(0);
    expect(continuesProblems(continuesOf(log), continuesExpected(BigInt(LAST)))).toEqual([]);
  }, PATIENCE_MS * 2);
});

/** A process stopped and a new one started on the same database, as at an upgrade boundary. */
describe.each(PROCESS_BACKENDS)("continues across a process restart on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("the re-delivery of the cursor's block and the new process's first height false, the height after true", async () => {
    const db = await backend.database();
    const log: string[] = [];
    const module = continuesModule(log);
    const runTo = async (head: bigint): Promise<void> => {
      const source = new InMemoryBlockSource({ head });
      const handle = startProcess({
        declarations: testBuild([module]).declarations,
        config: { data: { entries: [core(db.setting, 1), entryOf(module, 1)] } },
        source,
        log: () => undefined,
      });
      try {
        expect(await Promise.race([settle(handle, source, head), handle.ended])).toBe("waiting");
      } finally {
        await handle.stop();
      }
    };
    await runTo(H);
    log.push("restart");
    await runTo(HEAD);
    const after = log.slice(log.indexOf("restart"));
    const expected = continuesExpected(HEAD, {
      [`on-after-db-write@${H}`]: [true, false],
      [`on-compute@${H + 1n}`]: [false],
      [`on-db-write@${H + 1n}`]: [false],
      [`on-after-db-write@${H + 1n}`]: [false],
    });
    expect(continuesProblems(continuesOf(log), expected)).toEqual([]);
    expect(after[1]).toBe(`c on-after-db-write@${H} false`);
  }, 120_000);
});
