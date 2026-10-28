import { setTimeout as sleep } from "node:timers/promises";
import { expect } from "vitest";
import { commandBuild } from "../../src/cli/build-modules.js";
import { loadConfig } from "../../src/config/load.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type LoopInput } from "../../src/runner/loop.js";
import type { BackupSignals, ProcessHandle } from "../../src/runner/process.js";
import type { CliProject } from "../cli/cli-fixtures.js";
import { coreSettings, startProcess } from "../runner/process-build.js";
import { type BackupBackend, hashOf, PATIENCE_MS } from "./backup-fixtures.js";

/**
 * What A163's tests share (task 15.1a; BK-1 as amended, owner decision Q152 B; `design.md` §9.1): a running process on
 * PGlite, paused and resumed between heights (`ProcessHandle.pause()`, `resume()`), and its backup on SIGUSR2
 * (`backupOnSignal`, CF-4).
 *
 * **The build** is the backups' (`./backup-fixtures.ts`: the `umbradb` command's build, module `ticker`) with a second
 * user module, `recorder`, from a module file of the command project, so that `umbradb restore` reads the same file
 * and build. `recorder` writes a row at every height and records each of its points once its work ended — at
 * `on-finalized`, `on-compute` and `on-after-db-write` after a statement on its read — as `<point>@<height>` in one
 * array of this test process ({@link timeline}); a test's hooks (`<point>@<height>`, {@link hookAt}) run there first.
 * The process's log lines go into the same array (`log: <line>`), so one timeline shows where the loop was when it
 * paused, and what ran while a backup was written.
 *
 * **The chain** is the in-memory one with every block known at once. On PGlite the loop then never yields to the event
 * loop while it has heights to do (its statements settle within microtasks; `./backup-fixtures.ts`'s `feed`), so the
 * tests act from inside a height, through the hooks — a pause asked for at `on-db-write` of 10, a SIGUSR2 that arrives
 * at `on-compute` of 20 — and the loop, held, then yields: a loop that did not pause would run to the head before the
 * test looks again, which makes the negative controls (`./pause.negative-control.test.ts`) fail every time.
 */

/** Where the recorder modules of this test process write, and the hooks they run (`<point>@<height>`). */
interface RecorderGlobals {
  __umbradbA163Timeline?: string[];
  __umbradbA163Hooks?: Map<string, () => void>;
}

const globals = globalThis as RecorderGlobals;

/** The one timeline of this test process: the recorder's points and the processes' log lines (see the module comment). */
export function timeline(): string[] {
  globals.__umbradbA163Timeline ??= [];
  return globals.__umbradbA163Timeline;
}

/** The hooks the recorder runs at its points. */
function hooks(): Map<string, () => void> {
  globals.__umbradbA163Hooks ??= new Map();
  return globals.__umbradbA163Hooks;
}

/** Runs `hook` when the recorder's `point` at `height` ended its work, before it records it; once. */
export function hookAt(point: string, height: bigint, hook: () => void): void {
  const key = `${point}@${height}`;
  hooks().set(key, () => {
    hooks().delete(key);
    hook();
  });
}

/** The module file of `recorder` (see the module comment), importing `defineModule` from `builders`. */
export function recorderModule(builders: string): string {
  return [
    'import { z } from "zod";',
    `import { defineModule } from ${JSON.stringify(builders)};`,
    "",
    "const shared = globalThis as { __umbradbA163Timeline?: string[]; __umbradbA163Hooks?: Map<string, () => void> };",
    "const at = (point: string, height: bigint): void => {",
    "  shared.__umbradbA163Hooks?.get(`${point}@${height}`)?.();",
    "  (shared.__umbradbA163Timeline ??= []).push(`${point}@${height}`);",
    "};",
    "",
    "export const recorder = defineModule({",
    '  id: "recorder",',
    '  version: "1.0.0",',
    '  side: "public",',
    '  requires: ["block-header"],',
    '  provides: [{ name: "recorder-rows", lifetimes: ["table"], table: { schema: "recorder", tables: ["rows"], kind: "append-only" } }],',
    "  startsMidChain: true,",
    "  configSchema: z.object({}),",
    '  migrations: [{ id: "001", sql: "CREATE TABLE recorder.rows (height bigint PRIMARY KEY)" }],',
    "  points: {",
    '    async "on-finalized"(_p, head, read) {',
    '      await read.query("SELECT 1");',
    '      at("on-finalized", head.height);',
    "    },",
    '    async "on-fetch"(_p, b) {',
    '      at("on-fetch", b.height);',
    "    },",
    '    async "on-parse"(_p, b) {',
    '      at("on-parse", b.height);',
    "    },",
    '    async "on-compute"(_p, b, read) {',
    '      await read.query("SELECT 1");',
    '      at("on-compute", b.height);',
    "    },",
    '    async "on-db-write"(_p, b, w) {',
    '      await w.execute("INSERT INTO recorder.rows (height) VALUES ($1)", [b.height]);',
    '      at("on-db-write", b.height);',
    "    },",
    '    async "on-after-db-write"(_p, b, read) {',
    '      await read.query("SELECT 1");',
    '      at("on-after-db-write", b.height);',
    "    },",
    "  },",
    "});",
    "",
  ].join("\n");
}

/** What a configuration file of A163's tests holds. */
export interface PausableConfig {
  /** The `database` setting. */
  readonly database: string;
  /** The core's stop. */
  readonly stop?: number;
  /** S, and the modules' start; 1 unless given. */
  readonly start?: number;
  /** More `core` settings (`backupOnSignal`). */
  readonly extra?: Readonly<Record<string, unknown>>;
}

let files = 0;

/**
 * Writes a configuration file (under its own name: Node.js caches a file's first evaluation) that imports `ticker` and
 * `recorder` from the project's `./ticker.ts` and `./recorder.ts`, exports them as `modules` and lists the core and both
 * from S; returns its absolute path.
 */
export function writePausableConfig(project: CliProject, options: PausableConfig): string {
  files += 1;
  const core = JSON.stringify(coreSettings(options.database, { listen: { admin: "127.0.0.1:0" }, ...options.extra }));
  const stop = options.stop === undefined ? "" : `, stop: ${options.stop}`;
  const start = options.start ?? 1;
  return project.write(
    `pause-${files}.config.ts`,
    [
      `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
      'import { ticker } from "./ticker.ts";',
      'import { recorder } from "./recorder.ts";',
      "export const modules = [ticker, recorder];",
      "export default defineConfig({",
      "  entries: [",
      `    coreEntry({ start: ${start}${stop}, config: ${core} }),`,
      `    ticker.entry({ start: ${start}, config: {} }),`,
      `    recorder.entry({ start: ${start}, config: {} }),`,
      "  ],",
      "});",
      "",
    ].join("\n"),
  );
}

/** The loop of a process, by its class: the real one, or a negative control's. */
export type LoopClass = new (input: LoopInput) => FinalizedLoop;

/** A running process of A163's tests. */
export interface Pausable {
  readonly handle: ProcessHandle;
  readonly source: InMemoryBlockSource;
  /** The process's loop, once startup made it. */
  loop(): FinalizedLoop | undefined;
  /** This process's part of the timeline: its recorder's points and its log lines (`log: <line>`). */
  timeline(): string[];
  /** Its recorder's points only. */
  points(): string[];
  /** Its log lines only. */
  lines(): string[];
  /** Waits until the cursor is at least `height`; rejects if processing ends first or `patienceMs` passes. */
  reach(height: bigint, patienceMs?: number): Promise<void>;
}

/** What {@link startPausable} takes besides the file. */
export interface PausableOptions {
  /** The in-memory chain's head (every block known at once). */
  readonly head: bigint;
  /** The negative controls' loop. */
  readonly loop?: LoopClass;
  /** Where SIGUSR2 comes from (`backupOnSignal`): a test's emitter. */
  readonly backupSignals?: BackupSignals;
}

/** Whether a timeline entry is a recorder's point (not a log line). */
export const isPoint = (entry: string): boolean => !entry.startsWith("log: ");

/** Starts the process of the configuration `file` over the in-memory chain up to `options.head` (see the module comment). */
export async function startPausable(file: string, options: PausableOptions): Promise<Pausable> {
  const loaded = await loadConfig({ file });
  const source = new InMemoryBlockSource({ head: options.head });
  const shared = timeline();
  hooks().clear();
  const from = shared.length;
  let instance: FinalizedLoop | undefined;
  const Base: LoopClass = options.loop ?? FinalizedLoop;
  class Watched extends Base {
    constructor(input: LoopInput) {
      super(input);
      instance = this;
    }
  }
  const handle = startProcess({
    declarations: commandBuild(loaded.modules),
    config: { data: loaded.data, file: loaded.file },
    source,
    loop: Watched,
    ...(options.backupSignals === undefined ? {} : { backupSignals: options.backupSignals }),
    log: (line) => shared.push(`log: ${line}`),
  });
  const own = () => shared.slice(from);
  return {
    handle,
    source,
    loop: () => instance,
    timeline: own,
    points: () => own().filter(isPoint),
    lines: () =>
      own()
        .filter((entry) => !isPoint(entry))
        .map((entry) => entry.slice("log: ".length)),
    async reach(height, patienceMs = PATIENCE_MS) {
      const deadline = Date.now() + patienceMs;
      for (;;) {
        const status = handle.status();
        if (status.cursor !== null && status.cursor >= height) return;
        if (status.ended !== null) throw new Error(`processing ended (${status.ended.kind}) at ${String(status.cursor)}`);
        if (Date.now() > deadline) throw new Error(`the cursor is ${String(status.cursor)}, not ${height}, after ${patienceMs} ms`);
        await sleep(10);
      }
    },
  };
}

/** Resolves with `promise`, or rejects with `message` once `ms` passed. */
export async function within<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${message} (within ${ms} ms)`)), ms);
  });
  try {
    return await Promise.race([promise, late]);
  } finally {
    clearTimeout(timer);
  }
}

/** How long the oracles watch a paused process for anything it starts. */
export const PAUSED_MS = 300;

/** The heights' own points: `on-finalized` left out (a head's, not a height's). */
export const heightPoints = (points: readonly string[]): string[] => points.filter((point) => !point.startsWith("on-finalized@"));

/** The height a point names. */
const heightOf = (point: string): bigint => BigInt(point.slice(point.indexOf("@") + 1));

/**
 * A163's "paused between heights" (BK-1): once `paused` — `handle.pause()` asked for while the loop processed height
 * `at` — resolved, the loop is between two heights — the last point recorded is a height's `on-after-db-write` (its
 * points after the commit, their reads, ended), that height is the cursor, and it is `at`: the next pause after the
 * request; no block transaction is open — and, held, it starts nothing for {@link PAUSED_MS} though heights wait above
 * the cursor. Resolves with the cursor.
 */
export async function pausedBetweenHeights(run: Pausable, paused: Promise<void>, at: bigint): Promise<bigint> {
  await within(paused, PATIENCE_MS, "pause() did not resolve");
  const points = run.points();
  const last = heightPoints(points).at(-1) as string;
  expect(last, "the last point before the pause").toMatch(/^on-after-db-write@\d+$/);
  const cursor = run.handle.status().cursor as bigint;
  expect(cursor).toBe(heightOf(last));
  expect(cursor, "the pause's height").toBe(at);
  expect(run.loop()?.blockTransaction() ?? null, "a block transaction open while paused").toBeNull();
  expect(run.source.head, "heights wait above the cursor").toBeGreaterThan(cursor);
  await sleep(PAUSED_MS);
  expect(run.points().slice(points.length), "points run while paused").toEqual([]);
  expect(run.handle.status().cursor).toBe(cursor);
  return cursor;
}

/**
 * A163's "resumed": after `handle.resume()`, the loop goes on from the cursor's next height and reaches `cursor + 3`
 * within `patienceMs`.
 */
export async function goesOn(run: Pausable, cursor: bigint, patienceMs: number = PATIENCE_MS): Promise<void> {
  run.handle.resume();
  await run.reach(cursor + 3n, patienceMs);
}

/**
 * A163's "loses and repeats no height": every height from `from` to `to` has its points once, in order — `on-fetch`,
 * `on-parse`, `on-compute`, `on-db-write`, `on-after-db-write` —, and nothing else ran.
 */
export function eachHeightOnce(points: readonly string[], from: bigint, to: bigint): void {
  const expected: string[] = [];
  for (let height = from; height <= to; height++) {
    for (const point of ["on-fetch", "on-parse", "on-compute", "on-db-write", "on-after-db-write"]) {
      expected.push(`${point}@${height}`);
    }
  }
  expect(heightPoints(points)).toEqual(expected);
}

/**
 * RN-13 while paused: once the pause `paused` resolved, a stop ends the process — `closed` within `patienceMs` —, its
 * processing ended by the signal, the cursor where it was.
 */
export async function stopEndsWhilePaused(run: Pausable, paused: Promise<void>, patienceMs: number = PATIENCE_MS): Promise<void> {
  await within(paused, PATIENCE_MS, "pause() did not resolve");
  const cursor = run.handle.status().cursor;
  void run.handle.stop();
  await within(run.handle.closed, patienceMs, "a stop while paused did not end the process");
  expect(await run.handle.ended).toEqual({ kind: "signal" });
  expect(run.handle.status().cursor).toBe(cursor);
}

/** What {@link backupAtPause} found. */
export interface BackupOnSignal {
  /** The height the loop paused at, and the backup's. */
  readonly height: bigint;
  /** The contents hash the log line names. */
  readonly contentsHash: string;
}

/**
 * A163's "SIGUSR2 writes a backup at its next pause" in `run`'s timeline, for the file `out`: the signal's line, then
 * the loop paused between heights (`backup on signal: processing paused at height h`, the last point before it h's
 * `on-after-db-write`), then the backup of h written (`backup on signal written to <out>: height h, …`) with no point
 * run in between; with `goesOn`, the next height's `on-fetch` the first point after it.
 */
export function backupAtPause(run: Pausable, out: string, goesOnAfter = true): BackupOnSignal {
  const entries = run.timeline();
  const asked = entries.indexOf(`log: SIGUSR2: a backup to ${out} at the loop's next pause`);
  expect(asked, "the signal's log line").toBeGreaterThanOrEqual(0);
  const pausedPrefix = "log: backup on signal: processing paused at height ";
  const paused = entries.findIndex((entry, index) => index > asked && entry.startsWith(pausedPrefix));
  expect(paused, "the pause's log line").toBeGreaterThan(asked);
  const height = BigInt((entries[paused] as string).slice(pausedPrefix.length));
  expect(heightPoints(entries.slice(0, paused).filter(isPoint)).at(-1)).toBe(`on-after-db-write@${height}`);
  const writtenPrefix = `log: backup on signal written to ${out}: height ${height}, contents hash `;
  const written = entries.findIndex((entry, index) => index > paused && entry.startsWith(writtenPrefix));
  expect(written, `the backup of height ${height} written: ${JSON.stringify(entries.slice(paused).filter((e) => !isPoint(e)))}`).toBeGreaterThan(paused);
  expect(entries.slice(paused + 1, written).filter(isPoint), "points run while the backup was written").toEqual([]);
  if (goesOnAfter) expect(heightPoints(entries.slice(written + 1).filter(isPoint))[0]).toBe(`on-fetch@${height + 1n}`);
  return { height, contentsHash: (entries[written] as string).slice(writtenPrefix.length) };
}

/** The contents hash of a new process of A163's build stopped at `height` on `backend` without a pause. */
export async function hashUnpausedAt(project: CliProject, backend: BackupBackend, height: bigint): Promise<string> {
  const db = await backend.database();
  const run = await startPausable(writePausableConfig(project, { database: db.setting, stop: Number(height) }), {
    head: height + 5n,
  });
  try {
    expect(await run.handle.ended).toMatchObject({ kind: "stopped", height, core: true });
  } finally {
    await run.handle.stop();
  }
  return hashOf(db);
}
