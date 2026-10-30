import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import type { BlockItemSource } from "../../src/backbone/core-block-fetch/index.js";
import type { BlockEventSource } from "../../src/backbone/core-block-fetch/events.js";
import type { BlockContext, ModuleDeclaration, PointName } from "../../src/modules/declaration.js";
import type { BlockRef, BlockSource, PreparedBlock, QueueRunner } from "../../src/runner/block-source.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { FinalizedLoop, LoopInput } from "../../src/runner/loop.js";
import type { ProcessHandle, ProcessStatus } from "../../src/runner/process.js";
import { ask, type StatusBody } from "../admin/admin-harness.js";
import { schemaFile, validatorOf } from "../admin/json-schema.js";
import type { ProcessDatabase } from "./process-backends.js";
import { core, entryOf, loggingModule, startProcess, testBuild } from "./process-build.js";

/**
 * What the slow-block watchdog's tests share:
 * - a process of the test build with its admin endpoints on `127.0.0.1:0` and its `slowBlockMs` set;
 * - the in-memory chain, wrapped so that the tests know when the loop asked for each block;
 * - modules that hold a point at a height (awaiting, or blocking the main thread);
 * - the observation of the runner's published state (`status()`, polled on the main thread) and of `/status` (polled
 *   over HTTP), from the start until a while after the slow height committed;
 * - the oracles over what was observed.
 *
 * [RN-17, AE-3, AE-5, Q71]
 *
 * **A slow height** (the oracle {@link a142Problems}). With `slowBlockMs` 1000 and module `slow`'s `on-compute` at
 * height 2 awaiting 3 s:
 * - `status()` and `/status` show `slow-block` with height 2, `on-compute` and `slow` within 2 s of the callback's
 *   start (and not before height 2 has run 1 s), and the process is still ready;
 * - the height commits once: the callback ran once, to its end, before the commit; no retry was logged or raised;
 *   nothing halted;
 * - no `status()` or `/status` read after the commit shows the condition.
 *
 * With `slowBlockMs` 5000 ({@link quietProblems}) nothing shows the condition or logs it, and the height commits once.
 * [A142]
 *
 * **A slow callback outside a height's processing** (the oracle {@link a161Problems}). The same holds for a callback
 * the loop awaits outside a height's processing (`on-after-db-write` after height 2's commit, or `on-finalized`
 * announcing height 2), and the condition is gone once that callback ends. [A161, Q145 B]
 *
 * Imports nothing of Vitest: the oracles are applied to the real watchdog and to the negative controls' wrong ones.
 */

/** The committed `/status` schema, which a body showing `slow-block` must also hold to. [A66] */
export const STATUS_SCHEMA = validatorOf(schemaFile(new URL("../backbone/core-status/status.schema.json", import.meta.url)));

/** The slow height: height 1 is processed fast before it. [A142] */
export const SLOW_HEIGHT = 2n;
/** How long the slow callback awaits. [A142] */
export const HOLD_MS = 3_000;
/** The bound: the condition shows within 2 s of the callback's start. [A142] */
export const WITHIN_MS = 2_000;
/** How long the observation goes on after the slow height committed: more than one heartbeat tick (1 s). */
export const AFTER_COMMIT_MS = 1_500;

/** The test module that holds a point: what it saw. */
export interface Seen {
  /** `<id> <point>@<height>`, for its `on-compute`, `on-db-write` and held points, in call order. */
  readonly calls: string[];
  /** When its held callback started and ended (`performance.now()`); undefined until then. */
  start?: number;
  end?: number;
  /** The same on `process.hrtime.bigint()`, the clock the prober's worker reads too. */
  startNs?: bigint;
  endNs?: bigint;
}

/** How a module holds its point: awaiting (`await`: a timer) or blocking the main thread (`block`: a busy loop). */
export type HoldMode = "await" | "block";

/** What {@link holding} holds. */
export interface HoldSpec {
  /** The point held; `on-compute` unless given (`on-finalized` holds the announcement of `height` as the head). */
  readonly point?: Exclude<PointName, "on-start-db" | "on-start-api" | "on-best-block" | "on-rollback">;
  /** The height held; {@link SLOW_HEIGHT} unless given. */
  readonly height?: bigint;
  /** How long; {@link HOLD_MS} unless given. */
  readonly ms?: number;
  readonly mode?: HoldMode;
  /**
   * Per call at the held height (1, 2, …): what it does after holding — `"return"`, or an error to throw — and how
   * long it holds; every call holds `ms` and returns unless given.
   */
  readonly calls?: (call: number) => { readonly ms?: number; readonly then?: Error };
}

/** Holds the main thread (`block`) or awaits (`await`) for `ms`, by `performance.now()`. */
export async function hold(ms: number, mode: HoldMode): Promise<void> {
  const until = performance.now() + ms;
  if (mode === "block") {
    while (performance.now() < until) {
      // Computation on the main thread: nothing else of it runs meanwhile, as with a blocking callback. [AE-2]
    }
    return;
  }
  while (performance.now() < until) await sleep(Math.ceil(until - performance.now()));
}

/**
 * Module `id`: a row per height in `on-db-write`; at `spec.height` its `spec.point` holds `spec.ms` — the time it held
 * recorded in `seen` — then returns, or throws what `spec.calls` gives for that call.
 */
export function holding(id: string, seen: Seen, spec: HoldSpec = {}): ModuleDeclaration {
  const point = spec.point ?? "on-compute";
  const at = spec.height ?? SLOW_HEIGHT;
  const base = loggingModule(id, seen.calls, ["on-db-write"]);
  let calls = 0;
  const held = async (height: bigint): Promise<void> => {
    if (height !== at) return;
    calls += 1;
    const { ms = spec.ms ?? HOLD_MS, then } = spec.calls?.(calls) ?? {};
    seen.startNs = process.hrtime.bigint();
    seen.start = performance.now();
    await hold(ms, spec.mode ?? "await");
    seen.end = performance.now();
    seen.endNs = process.hrtime.bigint();
    if (then !== undefined) throw then;
  };
  const points: Record<string, (...args: unknown[]) => Promise<void>> = {
    ...(base.points as Record<string, (...args: unknown[]) => Promise<void>>),
    async "on-compute"(_p: unknown, ...args: unknown[]) {
      const b = args[0] as BlockContext;
      seen.calls.push(`${id} on-compute@${b.height}`);
      if (point === "on-compute") await held(b.height);
    },
  };
  if (point !== "on-compute") {
    const inner = points[point];
    points[point] = async (p: unknown, ...args: unknown[]) => {
      const first = args[0] as { readonly height: bigint };
      if (point !== "on-db-write") seen.calls.push(`${id} ${point}@${first.height}`);
      await inner?.(p, ...args);
      await held(first.height);
    };
  }
  return { ...base, points: points as ModuleDeclaration["points"] };
}

/** The in-memory chain at `head`, and when the loop first asked it for each block (`performance.now()`). */
export interface AskedSource {
  readonly source: BlockSource & BlockItemSource & BlockEventSource;
  readonly memory: InMemoryBlockSource;
  readonly asked: Map<bigint, number>;
}

/** The in-memory chain at `head` (see {@link AskedSource}), every optional member of the in-memory source passed on. */
export function askedSource(head: bigint, memory = new InMemoryBlockSource({ head })): AskedSource {
  const asked = new Map<bigint, number>();
  const source: BlockSource & BlockItemSource & BlockEventSource = {
    cursor: (read) => memory.cursor(read),
    finalizedHead: () => memory.finalizedHead(),
    waitForHead: (above, signal) => memory.waitForHead(above, signal),
    block: async (height) => {
      if (!asked.has(height)) asked.set(height, performance.now());
      return memory.block(height);
    },
    blockItems: (block: BlockRef) => memory.blockItems(block),
    blockEvents: (block: BlockRef) => memory.blockEvents(block),
  };
  return { source, memory, asked };
}

/**
 * A source that prepares heights ahead through the runner's queue (`attach`, `prepared`), shaped like the node source's
 * finalized prefetch. When the loop asks for a height, it prepares that height and the `ahead` − 1 above it up to the
 * head (`on-fetch` and `on-parse` through the queue runner), and hands the loop the asked one once prepared. [IN-5]
 */
export function preparingSource(inner: AskedSource, ahead: number): AskedSource {
  const { memory, asked } = inner;
  let runner: QueueRunner | undefined;
  const preparing = new Map<bigint, Promise<PreparedBlock>>();
  const begin = (height: bigint, through: QueueRunner): Promise<PreparedBlock> => {
    const started = (async () => {
      const block = await memory.block(height);
      return { block, items: await through.prepare(block) };
    })();
    started.catch(() => undefined);
    preparing.set(height, started);
    return started;
  };
  const source: BlockSource & BlockItemSource & BlockEventSource = {
    ...inner.source,
    attach(given) {
      runner = given;
      return () => {
        runner = undefined;
        preparing.clear();
      };
    },
    async prepared(height) {
      if (runner === undefined) throw new Error("the test's preparing source prepares only while the loop runs");
      if (!asked.has(height)) asked.set(height, performance.now());
      for (let next = height; next < height + BigInt(ahead) && next <= memory.head; next++) {
        if (!preparing.has(next)) begin(next, runner);
      }
      const prepared = await (preparing.get(height) as Promise<PreparedBlock>);
      preparing.delete(height);
      return prepared;
    },
  };
  return { source, memory, asked };
}

/** What {@link startSlow} takes. */
export interface SlowOptions {
  readonly slowBlockMs: number;
  readonly user: readonly ModuleDeclaration[];
  /** The source; {@link askedSource} at {@link SLOW_HEIGHT} unless given. */
  readonly source?: AskedSource;
  /** The negative controls' loop. */
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  /** More settings of the `core` entry. */
  readonly extra?: Readonly<Record<string, unknown>>;
}

/** A process of the test build with its admin endpoints (see the module comment). */
export interface SlowRun {
  readonly handle: ProcessHandle;
  readonly lines: string[];
  /** When each of {@link lines} was logged (`performance.now()`), by its index. */
  readonly lineAt: number[];
  /** When the process was started (`performance.now()`): before any of its windows opened. */
  readonly startedAt: number;
  readonly source: AskedSource;
  /** `http://127.0.0.1:<port>` of its admin listener, once it listens. */
  origin(): Promise<string>;
}

/** Starts a process of `options.user` on `db` (see the module comment). */
export function startSlow(db: ProcessDatabase, options: SlowOptions): SlowRun {
  const build = testBuild(options.user);
  const lines: string[] = [];
  const lineAt: number[] = [];
  const source = options.source ?? askedSource(SLOW_HEIGHT);
  const extra = { slowBlockMs: options.slowBlockMs, listen: { admin: "127.0.0.1:0" }, ...options.extra };
  const startedAt = performance.now();
  const handle = startProcess({
    declarations: build.declarations,
    config: { data: { entries: [core(db.setting, 1, { extra }), ...options.user.map((part) => entryOf(part, 1))] } },
    source: source.source,
    log: (line) => {
      lines.push(line);
      lineAt.push(performance.now());
    },
    admin: true,
    ...(options.loop === undefined ? {} : { loop: options.loop }),
  });
  const origin = async (): Promise<string> => {
    const until = performance.now() + 60_000;
    for (;;) {
      const line = lines.find((text) => text.startsWith("admin endpoints listening on "));
      if (line !== undefined) return `http://${line.slice("admin endpoints listening on ".length)}`;
      if (performance.now() > until) throw new Error(`the admin listener never listened; log: ${lines.join(" | ")}`);
      await sleep(20);
    }
  };
  return { handle, lines, lineAt, startedAt, source, origin };
}

/** One `status()` read, and when (`performance.now()`). */
export interface StatusRead {
  readonly at: number;
  readonly status: ProcessStatus;
}

/** One `/status` answer, and when it arrived (`performance.now()`). */
export interface BodyRead {
  readonly at: number;
  readonly body: StatusBody & Record<string, unknown>;
}

/** What a run showed: every `status()` read and every `/status` answer, in order. */
export interface Observed {
  readonly statuses: StatusRead[];
  readonly bodies: BodyRead[];
  /** When `status()` first showed the slow height committed; undefined when it never did. */
  readonly committedAt: number | undefined;
}

/**
 * The condition `slow-block` of a status at `height` ({@link SLOW_HEIGHT} unless given; any with null), as the runner
 * raises it. The tests look at the slow height only: on a loaded machine height 1, fast, may still pass 1 s.
 */
export const slowOf = (status: ProcessStatus, height: bigint | null = SLOW_HEIGHT): Readonly<Record<string, unknown>> | undefined =>
  status.conditions.find(
    (condition) => (condition.code as string) === "slow-block" && (height === null || (condition as { height?: bigint }).height === height),
  ) as Readonly<Record<string, unknown>> | undefined;

/** The condition `slow-block` of a `/status` body at `height` (see {@link slowOf}). */
export const bodySlowOf = (body: StatusBody, height: bigint | null = SLOW_HEIGHT): Readonly<Record<string, unknown>> | undefined =>
  body.conditions.find((condition) => condition.code === "slow-block" && (height === null || condition.height === String(height)));

/** The log lines about the slow height's `slow-block`. */
export const slowLines = (lines: readonly string[]): string[] =>
  lines.filter((line) => line.startsWith(`slow block: height ${SLOW_HEIGHT} `));

/**
 * Reads `run`'s `status()` every 20 ms and its `/status` every 50 ms from now until `status()` has shown `height`
 * committed for {@link AFTER_COMMIT_MS}, or processing ended, or 60 s passed. With `ended`, it reads that long after
 * the later of the commit and the moment `ended` gives (for a callback outside a height: the held callback's end).
 * [A161]
 */
export async function observe(run: SlowRun, height = SLOW_HEIGHT, ended?: () => number | undefined): Promise<Observed> {
  const statuses: StatusRead[] = [];
  const bodies: BodyRead[] = [];
  const origin = await run.origin();
  let committedAt: number | undefined;
  let done = false;
  const until = performance.now() + 60_000;
  const poll = setInterval(() => {
    const status = run.handle.status();
    const at = performance.now();
    statuses.push({ at, status });
    if (committedAt === undefined && status.cursor !== null && status.cursor >= height) committedAt = at;
    const end = ended?.();
    const from = ended === undefined ? committedAt : committedAt === undefined || end === undefined ? undefined : Math.max(committedAt, end);
    if ((from !== undefined && at - from > AFTER_COMMIT_MS) || status.ended !== null || at > until) done = true;
  }, 20);
  try {
    while (!done) {
      const answer = await ask(origin, "/status");
      if (answer.status === 200 && answer.json !== undefined) {
        bodies.push({ at: performance.now(), body: answer.json as BodyRead["body"] });
      }
      await sleep(50);
    }
  } finally {
    clearInterval(poll);
  }
  return { statuses, bodies, committedAt };
}

/** Milliseconds as text, rounded. */
const ms = (value: number): string => `${Math.round(value)} ms`;

/**
 * "The height commits once, with no retry": the held callback ran once and to its end, its `on-db-write` once, and
 * after it; no retry logged or raised, nothing halted, the cursor at the height.
 */
export function commitsOnceProblems(observed: Observed, seen: Seen, lines: readonly string[], id = "slow"): string[] {
  const problems: string[] = [];
  const count = (call: string) => seen.calls.filter((made) => made === call).length;
  const computes = count(`${id} on-compute@${SLOW_HEIGHT}`);
  if (computes !== 1) problems.push(`${id}'s on-compute at ${SLOW_HEIGHT} ran ${computes} times, not once`);
  const writes = count(`${id} on-db-write@${SLOW_HEIGHT}`);
  if (writes !== 1) problems.push(`${id}'s on-db-write at ${SLOW_HEIGHT} ran ${writes} times, not once`);
  if (seen.start === undefined || seen.end === undefined) problems.push(`${id}'s held callback never ended`);
  else if (seen.end - seen.start < HOLD_MS - 5) problems.push(`${id}'s held callback ended after ${ms(seen.end - seen.start)}`);
  if (observed.committedAt === undefined) problems.push(`height ${SLOW_HEIGHT} never committed`);
  else if (seen.end !== undefined && observed.committedAt < seen.end) problems.push(`height ${SLOW_HEIGHT} committed before its callback ended`);
  for (const line of lines) if (/retries in /.test(line)) problems.push(`a retry was logged: ${line}`);
  const others = new Set(observed.statuses.flatMap(({ status }) => status.conditions.map((condition) => condition.code as string)));
  others.delete("slow-block");
  if (others.size > 0) problems.push(`conditions other than slow-block were raised: ${[...others].join(", ")}`);
  const halted = observed.statuses.find(({ status }) => status.state === "halted" || status.state === "refused");
  if (halted !== undefined) problems.push(`the process was ${halted.status.state}: ${JSON.stringify(halted.status.reason, jsonBigint)}`);
  return problems;
}

/** What `slow-block` must say while module `slow`'s `on-compute` holds height 2. [A142] */
const EXPECTED = { code: "slow-block", height: SLOW_HEIGHT, point: "on-compute", module: "slow" };

/**
 * The slow height's oracle for `slowBlockMs` 1000 (see the module comment); `asked` is when the loop asked for height
 * 2. [A142]
 */
export function a142Problems(observed: Observed, seen: Seen, lines: readonly string[], asked: number | undefined): string[] {
  const problems = commitsOnceProblems(observed, seen, lines);
  const start = seen.start ?? Number.NaN;
  // status(): the runner's published state.
  const first = observed.statuses.find(({ status }) => slowOf(status) !== undefined);
  if (first === undefined) problems.push("status() never showed slow-block");
  else {
    const shown = slowOf(first.status);
    if (JSON.stringify(shown, jsonBigint) !== JSON.stringify(EXPECTED, jsonBigint)) {
      problems.push(`status() showed ${JSON.stringify(shown, jsonBigint)}, not ${JSON.stringify(EXPECTED, jsonBigint)}`);
    }
    if (first.at - start > WITHIN_MS) problems.push(`status() showed slow-block ${ms(first.at - start)} after on-compute began, not within 2 s`);
    if (asked === undefined || first.at - asked <= 1_000) {
      problems.push(`status() showed slow-block ${asked === undefined ? "before the loop asked for height 2" : `${ms(first.at - asked)} after the loop asked for height 2`}, before slowBlockMs`);
    }
    if (!first.status.ready || first.status.state !== "following") {
      problems.push(`the process was ${first.status.state}, ready ${first.status.ready}, with slow-block: a condition changes no readiness`);
    }
  }
  // /status, through core-status.
  const body = observed.bodies.find((read) => bodySlowOf(read.body) !== undefined);
  if (body === undefined) problems.push("/status never showed slow-block");
  else {
    const shown = bodySlowOf(body.body);
    const expected = { ...EXPECTED, height: String(SLOW_HEIGHT) };
    if (JSON.stringify(shown) !== JSON.stringify(expected)) problems.push(`/status showed ${JSON.stringify(shown)}, not ${JSON.stringify(expected)}`);
    if (body.at - start > WITHIN_MS) problems.push(`/status showed slow-block ${ms(body.at - start)} after on-compute began, not within 2 s`);
    const invalid = STATUS_SCHEMA.problems(body.body);
    if (invalid.length > 0) problems.push(`/status with slow-block fails its schema: ${invalid.join("; ")}`);
  }
  problems.push(...goneProblems(observed));
  const raised = slowLines(lines);
  const wanted = [`slow block: height ${SLOW_HEIGHT} is still processing after slowBlockMs (1000 ms), in on-compute of slow`];
  if (raised.length !== 2 || raised[0] !== wanted[0] || !/^slow block: height 2 committed after \d+ ms$/.test(raised[1] ?? "")) {
    problems.push(`the slow-block log lines were ${JSON.stringify(raised)}`);
  }
  return problems;
}

/**
 * "The condition is gone after the commit": no `status()` or `/status` read with the cursor at the slow height shows
 * it, and they were read for a while after it.
 */
export function goneProblems(observed: Observed): string[] {
  const problems: string[] = [];
  const after = observed.statuses.filter(({ status }) => status.cursor !== null && status.cursor >= SLOW_HEIGHT);
  if (after.length === 0 || after[after.length - 1]!.at - after[0]!.at < AFTER_COMMIT_MS) {
    problems.push(`status() was read for less than ${AFTER_COMMIT_MS} ms after the commit`);
  }
  const still = after.filter(({ status }) => slowOf(status, null) !== undefined);
  if (still.length > 0) problems.push(`status() showed slow-block after the commit, ${still.length} times`);
  const bodies = observed.bodies.filter(({ body }) => body.cursor !== null && BigInt(body.cursor) >= SLOW_HEIGHT);
  if (bodies.length === 0) problems.push("/status never showed the commit");
  const shown = bodies.filter(({ body }) => bodySlowOf(body, null) !== undefined);
  if (shown.length > 0) problems.push(`/status showed slow-block after the commit, ${shown.length} times`);
  return problems;
}

/** The oracle for `slowBlockMs` 5000: nothing shows `slow-block` or logs it, and the height commits once. [A142] */
export function quietProblems(observed: Observed, seen: Seen, lines: readonly string[]): string[] {
  const problems = commitsOnceProblems(observed, seen, lines);
  const statuses = observed.statuses.filter(({ status }) => slowOf(status) !== undefined);
  if (statuses.length > 0) problems.push(`status() showed slow-block ${statuses.length} times: ${JSON.stringify(slowOf(statuses[0]!.status), jsonBigint)}`);
  const bodies = observed.bodies.filter(({ body }) => bodySlowOf(body) !== undefined);
  if (bodies.length > 0) problems.push(`/status showed slow-block ${bodies.length} times`);
  const logged = slowLines(lines);
  if (logged.length > 0) problems.push(`slow-block was logged: ${logged.join(" | ")}`);
  return problems;
}

/** The points the loop awaits outside a height's processing. [A161, RN-17, Q145 B] */
export type OutsidePoint = "on-after-db-write" | "on-finalized";

/**
 * The points of a height's own window. A `slow-block` at one of them belongs to that height's processing, never to a
 * window outside a height. No test holds these points, but on a loaded machine a height's `on-db-write` and `COMMIT`
 * can pass `slowBlockMs` 1000 and raise the condition, correctly. [RN-17]
 */
export const HEIGHT_POINTS: ReadonlySet<string> = new Set(["on-fetch", "on-parse", "on-start-height", "on-compute", "on-db-write"]);

/** Whether `condition` (a `slow-block`, in `status()` or `/status`) is outside a height's processing. [A161] */
const outsideHeight = (condition: Readonly<Record<string, unknown>> | undefined): boolean =>
  condition !== undefined && !HEIGHT_POINTS.has(condition.point as string);

/**
 * The log line that raises the condition outside a height: module `slow`'s `point` at height 2 (`on-finalized`
 * announces height 2 as the finalized head), after `slowBlockMs` 1000. [A161]
 */
export const a161Raised = (point: OutsidePoint): string =>
  point === "on-after-db-write"
    ? `slow block: height ${SLOW_HEIGHT} is still processing after slowBlockMs (1000 ms), in on-after-db-write of slow (after its commit)`
    : `slow block: height ${SLOW_HEIGHT} is still processing after slowBlockMs (1000 ms), in on-finalized of slow (the new finalized head)`;

/** The log line that ends the window outside a height: its points ended. [A161] */
export const a161Ended = (point: OutsidePoint): RegExp =>
  point === "on-after-db-write"
    ? new RegExp(`^slow block: height ${SLOW_HEIGHT}'s points after its commit ended after \\d+ ms$`)
    : new RegExp(`^slow block: height ${SLOW_HEIGHT}'s on-finalized ended after \\d+ ms$`);

/**
 * The oracle for a slow callback outside a height's processing. With `slowBlockMs` 1000, module `slow`'s `point` at
 * height 2 awaits 3 s (`on-after-db-write` after height 2's commit, or `on-finalized` announcing height 2 as the head):
 * - `status()` and `/status` show `slow-block` with height 2, `point` and `slow` within 2 s of the callback's start,
 *   and not before its window was open for `slowBlockMs`;
 * - the condition is gone once that callback ends: no `status()` read after the window's end (its log line), and no
 *   `/status` answer a heartbeat after it, shows the condition at `point`; each is read for a while;
 * - nothing is cancelled or retried: the callback ran once, to its end; height 2 committed once, with no retry, no
 *   other condition and no halt.
 *
 * A `slow-block` at a height's own points ({@link HEIGHT_POINTS}) is not this condition and is not compared.
 * [A161, RN-17, Q145 B]
 */
export function a161Problems(observed: Observed, seen: Seen, run: Pick<SlowRun, "lines" | "lineAt" | "startedAt">, point: OutsidePoint): string[] {
  const problems: string[] = [];
  const count = (call: string) => seen.calls.filter((made) => made === call).length;
  const held = count(`slow ${point}@${SLOW_HEIGHT}`);
  if (held !== 1) problems.push(`slow's ${point} at ${SLOW_HEIGHT} ran ${held} times, not once`);
  const writes = count(`slow on-db-write@${SLOW_HEIGHT}`);
  if (writes !== 1) problems.push(`slow's on-db-write at ${SLOW_HEIGHT} ran ${writes} times, not once`);
  if (seen.start === undefined || seen.end === undefined) problems.push(`slow's ${point} never ended`);
  else if (seen.end - seen.start < HOLD_MS - 5) problems.push(`slow's ${point} ended after ${ms(seen.end - seen.start)}`);
  if (observed.committedAt === undefined) problems.push(`height ${SLOW_HEIGHT} never committed`);
  for (const line of run.lines) if (/retries in /.test(line)) problems.push(`a retry was logged: ${line}`);
  const others = new Set(observed.statuses.flatMap(({ status }) => status.conditions.map((condition) => condition.code as string)));
  others.delete("slow-block");
  if (others.size > 0) problems.push(`conditions other than slow-block were raised: ${[...others].join(", ")}`);
  const halted = observed.statuses.find(({ status }) => status.state === "halted" || status.state === "refused");
  if (halted !== undefined) problems.push(`the process was ${halted.status.state}: ${JSON.stringify(halted.status.reason, jsonBigint)}`);
  const start = seen.start ?? Number.NaN;
  const expected = { code: "slow-block", height: SLOW_HEIGHT, point, module: "slow" };
  // status(): the first read showing it, and a read known to come before its window opened — the last before the
  // commit for on-after-db-write (its window opens at the commit), the process's start for on-finalized. Height 2's own
  // processing, if a loaded machine made it slow, is not the condition checked here.
  const index = observed.statuses.findIndex(({ status }) => outsideHeight(slowOf(status)));
  const first = observed.statuses[index];
  if (first === undefined) problems.push("status() never showed slow-block");
  else {
    const shown = slowOf(first.status);
    if (JSON.stringify(shown, jsonBigint) !== JSON.stringify(expected, jsonBigint)) {
      problems.push(`status() showed ${JSON.stringify(shown, jsonBigint)}, not ${JSON.stringify(expected, jsonBigint)}`);
    }
    if (first.at - start > WITHIN_MS) problems.push(`status() showed slow-block ${ms(first.at - start)} after ${point} began, not within 2 s`);
    const before =
      point === "on-after-db-write"
        ? observed.statuses.slice(0, index).findLast(({ status }) => status.cursor === null || status.cursor < SLOW_HEIGHT)?.at
        : run.startedAt;
    // A Node.js timer may fire up to a millisecond before performance.now() counts its delay: 2 ms of slack.
    if (before === undefined || first.at - before < 1_000 - 2) {
      problems.push(`status() showed slow-block before its window was open for slowBlockMs`);
    }
    if (point === "on-after-db-write" && (!first.status.ready || first.status.state !== "following")) {
      problems.push(`the process was ${first.status.state}, ready ${first.status.ready}, with slow-block: a condition changes no readiness`);
    }
  }
  // /status, through core-status.
  const body = observed.bodies.find((read) => outsideHeight(bodySlowOf(read.body)));
  if (body === undefined) problems.push("/status never showed slow-block");
  else {
    const shown = bodySlowOf(body.body);
    const wanted = { ...expected, height: String(SLOW_HEIGHT) };
    if (JSON.stringify(shown) !== JSON.stringify(wanted)) problems.push(`/status showed ${JSON.stringify(shown)}, not ${JSON.stringify(wanted)}`);
    if (body.at - start > WITHIN_MS) problems.push(`/status showed slow-block ${ms(body.at - start)} after ${point} began, not within 2 s`);
    const invalid = STATUS_SCHEMA.problems(body.body);
    if (invalid.length > 0) problems.push(`/status with slow-block fails its schema: ${invalid.join("; ")}`);
  }
  // Logged when raised and when its window ended, after the callback ended.
  const logged = run.lines.map((line, at) => ({ line, at: run.lineAt[at] as number })).filter(({ line }) => line.startsWith("slow block: "));
  const raised = logged.filter(({ line }) => line === a161Raised(point));
  const ends = logged.filter(({ line }) => a161Ended(point).test(line));
  if (raised.length !== 1 || ends.length !== 1) problems.push(`the slow-block log lines were ${JSON.stringify(logged.map(({ line }) => line))}`);
  const end = ends[0]?.at;
  if (end === undefined) problems.push(`the window of ${point} never ended`);
  else {
    if (seen.end !== undefined && end < seen.end) problems.push(`the window of ${point} ended before its callback`);
    // Gone once that callback ended: status() from the window's end on (the same thread: at once), /status a heartbeat
    // later (the process publishes at once; a request may still be answered from the snapshot before).
    const after = observed.statuses.filter(({ at }) => at > end);
    if (after.length === 0 || after[after.length - 1]!.at - end < AFTER_COMMIT_MS - 100) {
      problems.push(`status() was read for less than ${AFTER_COMMIT_MS} ms after the window ended`);
    }
    const still = after.filter(({ status }) => slowOf(status, null)?.point === point);
    if (still.length > 0) problems.push(`status() showed slow-block in ${point} after the callback ended, ${still.length} times`);
    const bodies = observed.bodies.filter(({ at }) => at > end + 1_000);
    if (bodies.length === 0) problems.push("/status was not read a heartbeat after the window ended");
    const shown = bodies.filter(({ body }) => bodySlowOf(body, null)?.point === point);
    if (shown.length > 0) problems.push(`/status showed slow-block in ${point} after the callback ended, ${shown.length} times`);
  }
  return problems;
}

/** `JSON.stringify`'s replacer for `bigint`s. */
export const jsonBigint = (_key: string, value: unknown): unknown => (typeof value === "bigint" ? `${value}n` : value);
