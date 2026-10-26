import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { BlockItemSource } from "../../src/backbone/core-block-fetch/index.js";
import type { BlockWriteHandle, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { BlockRef, BlockSource } from "../../src/runner/block-source.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import type { ProcessReason } from "../../src/runner/failures.js";
import { InMemoryBlockSource, inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { chainDataHeaders, readChainDataView } from "../../src/runner/envelope.js";
import { FinalizedLoop, type HeightRun, type LoopEnd, type LoopInput } from "../../src/runner/loop.js";
import type { ProcessingEnd, ProcessStatus } from "../../src/runner/process.js";
import { cursorIn, PROCESS_BACKENDS, type ProcessDatabase } from "./process-backends.js";
import { core, entryOf, loggingModule, startProcess, testBuild } from "./process-build.js";

/**
 * A43 (task 5.4; RN-8) through the process from its configuration, on PostgreSQL 18 and PGlite: a thrown error in each
 * of `on-fetch`, `on-parse`, `on-start-height`, `on-compute`, the first and the last `on-db-write` callback leaves no
 * row of h, the cursor h − 1, and the state `halted` with h, the module and the point; an error in `on-after-db-write`
 * (and, RN-8's other point after the commit, `on-stop-height`) halts with h committed. The process stays up: its module
 * API keeps answering at the cursor until it is stopped. Then the halts' other codes of `design.md` §11 through the
 * process: the cause's own code where §11 names one, `callback-error` for a misuse, `unexpected-cursor` for the loop's
 * cursor check, `database-error` for any other failure.
 *
 * The build: `a-first`, `early` (1–5), `late` (from 5), `m-mid` and `z-last`, each writing one row per height in its
 * `on-db-write` and logging every point, in that order — so at `on-db-write` `core-block-commit` is the first callback
 * of the block transaction (it writes the cursor row) and `z-last` the last, after every other module wrote its row —,
 * and `reader`, whose module API answers with the height it read.
 */

const H = 5;
const HEAD = 8n;
/** How long a process may take to halt after its callback failed, under a loaded machine (the controls wait it out). */
const PATIENCE_MS = 30_000;
const POINTS: readonly PointName[] = [
  "on-fetch",
  "on-parse",
  "on-start-height",
  "on-compute",
  "on-db-write",
  "on-after-db-write",
  "on-stop-height",
];
const TABLES = ["a_first", "early", "late", "m_mid", "z_last"] as const;

/** One row of A43's table: the point and the module whose callback throws at H, and whether H committed first. */
interface A43Case {
  readonly name: string;
  readonly point: PointName;
  readonly module: string;
  readonly committed: boolean;
}

const A43_CASES: readonly A43Case[] = [
  { name: "on-fetch", point: "on-fetch", module: "m-mid", committed: false },
  { name: "on-parse", point: "on-parse", module: "m-mid", committed: false },
  { name: "on-start-height", point: "on-start-height", module: "late", committed: false },
  { name: "on-compute", point: "on-compute", module: "m-mid", committed: false },
  { name: "the first on-db-write callback", point: "on-db-write", module: "core-block-commit", committed: false },
  { name: "the last on-db-write callback", point: "on-db-write", module: "z-last", committed: false },
  { name: "on-after-db-write", point: "on-after-db-write", module: "m-mid", committed: true },
  { name: "on-stop-height", point: "on-stop-height", module: "early", committed: true },
];

/** `declaration` whose `point` callback, at `height`, does its work and then throws `error`, after telling `failed`. */
function failingAt(
  declaration: ModuleDeclaration,
  point: PointName,
  height: number,
  error: Error,
  failed: () => void,
): ModuleDeclaration {
  const callback = declaration.points[point] as (...args: unknown[]) => Promise<void>;
  const points = {
    ...declaration.points,
    async [point](...args: unknown[]) {
      await callback.apply(points, args);
      if ((args[1] as { readonly height: bigint }).height === BigInt(height)) {
        failed();
        throw error;
      }
    },
  };
  return { ...declaration, points: points as ModuleDeclaration["points"] };
}

/** A43's modules, logging to `log`. */
function a43Modules(log: string[]): ModuleDeclaration[] {
  const reader = loggingModule("reader", log, [], {
    points: {
      async "on-start-api"(_p, api) {
        // The module states its height itself, with the envelope's helpers (RN-16; task 5.2b).
        api.http("GET", "/height", async (_request, read) => ({
          status: 200,
          headers: chainDataHeaders(await readChainDataView(read)),
          body: { height: read.height },
        }));
      },
    },
  });
  return [...["a-first", "early", "late", "m-mid", "z-last"].map((id) => loggingModule(id, log, POINTS)), reader];
}

/** A43's configuration on `database`. */
function a43Entries(database: string, user: readonly ModuleDeclaration[]) {
  const of = (id: string) => user.find((part) => part.id === id) as ModuleDeclaration;
  return [
    core(database, 1, { extra: { listen: { api: "127.0.0.1:0" } } }),
    entryOf(of("a-first"), 1),
    entryOf(of("early"), 1, {}, H),
    entryOf(of("late"), H),
    entryOf(of("m-mid"), 1),
    entryOf(of("z-last"), 1),
    entryOf(of("reader"), 1),
  ];
}

/** How a run ended: processing's end, the source waiting at the head, or nothing within the patience. */
type Outcome = ProcessingEnd | "waiting" | "timeout";

/** What one A43 run showed. */
interface A43Observation {
  readonly outcome: Outcome;
  readonly status: ProcessStatus;
  readonly log: readonly string[];
  readonly lines: readonly string[];
  /** The module API's `X-Umbra-Height` once processing ended, and whether the process had closed by itself. */
  readonly served: string | null;
  readonly closedByItself: boolean;
  readonly cursor: number | null;
  /** Each module table's rows at H and above H. */
  readonly rows: Readonly<Record<string, { readonly at: number; readonly above: number }>>;
}

/** Runs A43's build on `db` with `failing` failing at H, until processing ends (or the patience runs out). */
async function a43Run(
  db: ProcessDatabase,
  failing: A43Case,
  loop?: new (input: LoopInput) => FinalizedLoop,
): Promise<A43Observation> {
  const log: string[] = [];
  const lines: string[] = [];
  let failed!: () => void;
  const thrown = new Promise<void>((resolve) => {
    failed = resolve;
  });
  const error = new Error(`${failing.point} of ${failing.module} fails at ${H}`);
  const fail = (part: ModuleDeclaration) =>
    part.id === failing.module ? failingAt(part, failing.point, H, error, failed) : part;
  const user = a43Modules(log).map(fail);
  const build = testBuild(user, { log, backbone: fail });
  const source = new InMemoryBlockSource({ head: HEAD });
  const handle = startProcess({
    declarations: build.declarations,
    config: { data: { entries: a43Entries(db.setting, user) } },
    source,
    log: (line) => lines.push(line),
    ...(loop === undefined ? {} : { loop }),
  });
  const patience = new AbortController();
  let observed: Omit<A43Observation, "cursor" | "rows">;
  try {
    const { api } = await handle.started;
    const outcome = await Promise.race<Outcome>([
      source.waiting(HEAD).then(() => "waiting" as const),
      handle.ended,
      thrown.then(() => sleep(PATIENCE_MS, "timeout" as const, { signal: patience.signal })),
    ]);
    const status = handle.status();
    const closedByItself = await Promise.race([handle.closed.then(() => true), sleep(50, false)]);
    const response = await fetch(`http://${api!.host}:${api!.port}/height`);
    observed = { outcome, status, log: [...log], lines: [...lines], served: response.headers.get("x-umbra-height"), closedByItself };
  } finally {
    patience.abort();
    await handle.stop();
  }
  const rows: Record<string, { at: number; above: number }> = {};
  for (const table of TABLES) {
    const [row] = await db.query(
      `SELECT count(*) FILTER (WHERE height = ${H})::int AS at, count(*) FILTER (WHERE height > ${H})::int AS above ` +
        `FROM ${table}.rows`,
    );
    rows[`${table}.rows`] = { at: Number(row?.at), above: Number(row?.above) };
  }
  return { ...observed, cursor: await cursorIn(db), rows };
}

const showReason = (reason: ProcessReason | null | undefined): string =>
  reason === null || reason === undefined
    ? "none"
    : `${reason.code} at ${reason.height}${reason.point === null ? "" : ` in ${reason.point}`}${
        reason.module === null ? "" : ` of ${reason.module}`
      }`;

const showOutcome = (outcome: Outcome): string =>
  typeof outcome === "string"
    ? outcome === "waiting"
      ? "with the source waiting at the head"
      : `nowhere within ${PATIENCE_MS} ms of the failure`
    : outcome.kind;

/** A43's oracle for one row of its table: every problem with what was observed, none when A43 holds. */
function a43Problems(failing: A43Case, observed: A43Observation): string[] {
  const problems: string[] = [];
  const { status } = observed;
  const cursor = failing.committed ? H : H - 1;
  const expected: ProcessReason = { code: "callback-error", height: BigInt(H), module: failing.module, point: failing.point };
  if (status.state !== "halted") problems.push(`the state is ${status.state}, not halted`);
  if (status.ready) problems.push("the process is ready");
  if (showReason(status.reason) !== showReason(expected)) {
    problems.push(`the reason is ${showReason(status.reason)}, not ${showReason(expected)}`);
  }
  if (typeof observed.outcome === "string" || observed.outcome.kind !== "failed") {
    problems.push(`processing ended ${showOutcome(observed.outcome)}, not failed`);
  }
  if (observed.cursor !== cursor) problems.push(`the cursor is ${observed.cursor}, not ${cursor}`);
  if (status.cursor !== BigInt(cursor)) problems.push(`the state's cursor is ${status.cursor}, not ${cursor}`);
  for (const [table, { at, above }] of Object.entries(observed.rows)) {
    if (at !== (failing.committed ? 1 : 0)) problems.push(`${table} holds ${at} rows of ${H}`);
    if (above > 0) problems.push(`${table} holds rows above ${H}`);
  }
  if (observed.log.some((line) => Number(/@(\d+)/.exec(line)?.[1]) > H)) problems.push(`a callback ran above ${H}`);
  if (!failing.committed && observed.log.some((line) => / on-(after-db-write|stop-height)@5\b/.test(line))) {
    problems.push(`a point after the commit ran at ${H}`);
  }
  if (observed.served !== String(cursor)) problems.push(`the module API answered at ${observed.served}, not at ${cursor}`);
  if (observed.closedByItself) problems.push("the process closed by itself");
  return problems;
}

/** A negative control's loop: a failure of `z-last`'s `on-db-write` is ignored, so the block commits without it. */
class CommitsDespiteLastWrite extends FinalizedLoop {
  protected override async write(tx: Transaction, run: HeightRun): Promise<void> {
    try {
      await super.write(tx, run);
    } catch (error) {
      if (!(error instanceof CallbackFailure && error.module === "z-last")) throw error;
    }
  }
}

/** A negative control's loop: it stops processing on a failure without telling the process, until it is stopped. */
class SilentHalt extends FinalizedLoop {
  override async run(): Promise<LoopEnd> {
    try {
      return await super.run();
    } catch {
      const { signal } = this.input;
      await new Promise<void>((resolve) => signal?.addEventListener("abort", () => resolve(), { once: true }));
      return { kind: "signal" };
    }
  }
}

/** Runs a build of `user` on `db` with head 8 until processing ends; the outcome and the state. */
async function haltOf(
  db: ProcessDatabase,
  user: readonly ModuleDeclaration[],
  source: BlockSource = new InMemoryBlockSource({ head: HEAD }),
): Promise<{ readonly ended: ProcessingEnd; readonly status: ProcessStatus; readonly lines: readonly string[] }> {
  const build = testBuild(user);
  const lines: string[] = [];
  const handle = startProcess({
    declarations: build.declarations,
    config: { data: { entries: [core(db.setting), ...user.map((part) => entryOf(part, 1))] } },
    source,
    log: (line) => lines.push(line),
  });
  try {
    const ended = await handle.ended;
    return { ended, status: handle.status(), lines: [...lines] };
  } finally {
    await handle.stop();
  }
}

describe("A43: a failure before COMMIT leaves nothing and halts; after it, halts with h committed (RN-8), on PostgreSQL and on PGlite", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it("[[runner.fault.pre-commit-failure-leaves-nothing]] A43: each point's thrown error halts at h with its module and point, nothing of h kept before the commit, h committed after it, on PostgreSQL and on PGlite", async () => {
    for (const backend of PROCESS_BACKENDS) {
      for (const failing of A43_CASES) {
        const label = `${backend.name}: ${failing.name}`;
        const observed = await a43Run(await backend.database(), failing);
        expect(a43Problems(failing, observed), label).toEqual([]);
        expect(observed.lines, label).toEqual([
          `processing halted (callback-error): ${(observed.outcome as { error: Error }).error.message}`,
        ]);
        expect(observed.lines[0], label).toContain(`${failing.point} of ${failing.module} fails at ${H}`);
      }
    }
  }, 900_000);

  it("negative control: a loop that commits h despite a failure in the last on-db-write callback fails A43", async () => {
    const last = A43_CASES.find((failing) => failing.name === "the last on-db-write callback") as A43Case;
    for (const backend of PROCESS_BACKENDS) {
      const problems = a43Problems(last, await a43Run(await backend.database(), last, CommitsDespiteLastWrite));
      expect(problems, backend.name).toEqual([
        "the state is following, not halted",
        "the process is ready",
        `the reason is none, not callback-error at ${H} in on-db-write of z-last`,
        "processing ended with the source waiting at the head, not failed",
        "the cursor is 8, not 4",
        "the state's cursor is 8, not 4",
        `a_first.rows holds 1 rows of ${H}`,
        `a_first.rows holds rows above ${H}`,
        `early.rows holds 1 rows of ${H}`,
        `late.rows holds 1 rows of ${H}`,
        `late.rows holds rows above ${H}`,
        `m_mid.rows holds 1 rows of ${H}`,
        `m_mid.rows holds rows above ${H}`,
        `z_last.rows holds 1 rows of ${H}`,
        `z_last.rows holds rows above ${H}`,
        `a callback ran above ${H}`,
        `a point after the commit ran at ${H}`,
        "the module API answered at 8, not at 4",
      ]);
    }
  }, 300_000);

  it("negative control: a process whose state stays syncing after a halt fails A43", async () => {
    const compute = A43_CASES.find((failing) => failing.point === "on-compute") as A43Case;
    for (const backend of PROCESS_BACKENDS) {
      const problems = a43Problems(compute, await a43Run(await backend.database(), compute, SilentHalt));
      expect(problems, backend.name).toEqual([
        "the state is syncing, not halted",
        "the process is ready",
        `the reason is none, not callback-error at ${H} in on-compute of m-mid`,
        `processing ended nowhere within ${PATIENCE_MS} ms of the failure, not failed`,
      ]);
    }
  }, 300_000);
});

describe.each(PROCESS_BACKENDS)("halts (RN-8, design §11) on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  describe("the halts' codes through the process (design §11)", () => {
    it("a TRUNCATE in on-db-write halts with truncate-not-allowed, the module and the point (DB-14)", async () => {
      const truncating = loggingModule("truncating", [], [], {
        points: {
          async "on-db-write"(_p, b, w) {
            await w.execute("INSERT INTO truncating.rows (height) VALUES ($1)", [b.height]);
            if (b.height === 3n) await w.execute("TRUNCATE truncating.rows");
          },
        },
      });
      const db = await backend.database();
      const { status } = await haltOf(db, [truncating]);
      expect(status).toMatchObject({
        state: "halted",
        reason: { code: "truncate-not-allowed", height: 3n, module: "truncating", point: "on-db-write" },
        cursor: 2n,
      });
      expect(await cursorIn(db)).toBe(2);
    }, 180_000);

    it("a statement the database refuses in on-db-write halts with database-error, the module and the point", async () => {
      const duplicating = loggingModule("duplicating", [], [], {
        points: {
          async "on-db-write"(_p, b, w) {
            await w.execute("INSERT INTO duplicating.rows (height) VALUES ($1)", [b.height]);
            if (b.height === 4n) await w.execute("INSERT INTO duplicating.rows (height) VALUES ($1)", [b.height]);
          },
        },
      });
      const { status } = await haltOf(await backend.database(), [duplicating]);
      expect(status).toMatchObject({
        state: "halted",
        ready: false,
        reason: { code: "database-error", height: 4n, module: "duplicating", point: "on-db-write" },
      });
    }, 180_000);

    it("a block write handle kept and used in a later block halts with callback-error naming the module that kept it (DB-3)", async () => {
      let kept: BlockWriteHandle | undefined;
      const keeper = loggingModule("keeper", [], [], {
        points: {
          async "on-db-write"(_p, b, w) {
            await w.execute("INSERT INTO keeper.rows (height) VALUES ($1)", [b.height]);
            if (b.height === 2n) kept = w;
          },
        },
      });
      const borrower = loggingModule("borrower", [], [], {
        points: {
          async "on-db-write"(_p, b: BlockContext) {
            if (b.height === 3n) await kept?.execute("INSERT INTO keeper.rows (height) VALUES (99)").catch(() => 0);
          },
        },
      });
      const { status } = await haltOf(await backend.database(), [keeper, borrower]);
      expect(status).toMatchObject({
        state: "halted",
        reason: { code: "callback-error", height: 3n, module: "keeper", point: "on-db-write" },
      });
    }, 180_000);

    it("a block whose cursor row is not the height's halts with unexpected-cursor, naming no module or point", async () => {
      const source = new InMemoryBlockSource({ head: HEAD });
      const blocks: BlockSource & BlockItemSource = {
        cursor: (read) => source.cursor(read),
        finalizedHead: () => source.finalizedHead(),
        waitForHead: (above, signal) => source.waitForHead(above, signal),
        // core-block-fetch's items, as the source gives them (task 10.3).
        blockItems: (block: BlockRef) => source.blockItems(block),
        // The source answers height 3 with the block of height 4: core-block-commit writes the cursor row at 4.
        block: async (height): Promise<BlockRef> => (height === 3n ? inMemoryBlock(4n) : source.block(height)),
      };
      const db = await backend.database();
      const { status, ended } = await haltOf(db, [], blocks);
      expect(ended).toMatchObject({ kind: "failed" });
      expect(status).toMatchObject({
        state: "halted",
        reason: { code: "unexpected-cursor", height: 3n, module: null, point: null },
      });
      expect(await cursorIn(db)).toBe(2);
    }, 180_000);

    it("a source that cannot give a block halts with database-error at that height, naming no module or point", async () => {
      const source = new InMemoryBlockSource({ head: HEAD });
      const failing: BlockSource & BlockItemSource = {
        cursor: (read) => source.cursor(read),
        finalizedHead: () => source.finalizedHead(),
        waitForHead: (above, signal) => source.waitForHead(above, signal),
        // core-block-fetch's items, as the source gives them (task 10.3).
        blockItems: (block: BlockRef) => source.blockItems(block),
        block: async (height) => {
          if (height === 6n) throw new Error("the source lost block 6");
          return source.block(height);
        },
      };
      const { status } = await haltOf(await backend.database(), [], failing);
      expect(status).toMatchObject({ state: "halted", reason: { code: "database-error", height: 6n, module: null, point: null } });
    }, 180_000);

    it("a node-requirement in on-fetch halts with node-requirement, the module and the point (IN-9)", async () => {
      const fetching = loggingModule("fetching", [], [], {
        points: {
          async "on-fetch"(_p, b) {
            if (b.height === 2n) throw new UmbraError("node-requirement", "the node no longer has the state at 2");
          },
        },
      });
      const { status, lines } = await haltOf(await backend.database(), [fetching]);
      expect(status).toMatchObject({
        state: "halted",
        reason: { code: "node-requirement", height: 2n, module: "fetching", point: "on-fetch" },
        cursor: 1n,
      });
      expect(lines.filter((line) => line.startsWith("processing halted (node-requirement): "))).toHaveLength(1);
    }, 180_000);

    it("a failure of the height in progress when stop() was called ends processing failed, the process stopping with its reason", async () => {
      let reached!: () => void;
      const atThree = new Promise<void>((resolve) => {
        reached = resolve;
      });
      let fail!: () => void;
      const failing = new Promise<void>((resolve) => {
        fail = resolve;
      });
      const late = loggingModule("late", [], [], {
        points: {
          async "on-compute"(_p, b) {
            if (b.height !== 3n) return;
            reached();
            await failing;
            throw new Error("on-compute fails while the process stops");
          },
        },
      });
      const db = await backend.database();
      const build = testBuild([late]);
      const lines: string[] = [];
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting), entryOf(late, 1)] } },
        source: new InMemoryBlockSource({ head: HEAD }),
        log: (line) => lines.push(line),
      });
      await atThree;
      const stopping = handle.stop();
      fail();
      await stopping;
      expect(await handle.ended).toMatchObject({ kind: "failed" });
      expect(handle.status()).toMatchObject({
        state: "stopping",
        ready: false,
        reason: { code: "callback-error", height: 3n, module: "late", point: "on-compute" },
      });
      expect(lines).toHaveLength(1);
      expect(lines[0]).toMatch(/^processing halted \(callback-error\): /);
      expect(await cursorIn(db)).toBe(2);
    }, 180_000);

    it("stays halted until stop(), then stopping, its reason kept", async () => {
      const failing = loggingModule("failing", [], [], {
        points: {
          async "on-compute"(_p, b) {
            if (b.height === 2n) throw new Error("on-compute fails");
          },
        },
      });
      const db = await backend.database();
      const build = testBuild([failing]);
      const handle = startProcess({
        declarations: build.declarations,
        config: { data: { entries: [core(db.setting), entryOf(failing, 1)] } },
        source: new InMemoryBlockSource({ head: HEAD }),
        log: () => undefined,
      });
      expect(await handle.ended).toMatchObject({ kind: "failed" });
      await sleep(200);
      const halted = handle.status();
      expect(halted).toMatchObject({ state: "halted", ready: false, cursor: 1n });
      expect(halted.ended).toBe(await handle.ended);
      const stopping = handle.stop();
      expect(handle.status()).toMatchObject({ state: "stopping", ready: false, reason: halted.reason });
      await stopping;
    }, 180_000);
  });
});
