import { type ChildProcess, spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PointName } from "../../src/modules/declaration.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import type { EntryBoundary } from "../../src/runner/dispatch.js";
import { InMemoryBlockSource, inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { FinalizedLoop, type HeightRun, type LoopInput } from "../../src/runner/loop.js";
import { startProcess } from "../../src/runner/process.js";
import { type CrashCall, type CrashEvent, crashModule } from "./crash-module.js";
import type { CrashJob, CrashWorkerEvent } from "./crash.worker.js";
import { cursorIn, pairs, PROCESS_BACKENDS, type ProcessBackend } from "./process-backends.js";
import { core, settle, testBuild } from "./process-build.js";

/**
 * A44 and A46 (task 5.4; RN-5, RN-9, RN-11) with a real process killed by SIGKILL at the stated points, on PostgreSQL 18
 * and PGlite: the process is `crash.worker.ts`, started as `umbradb run` starts one (`startProcess` with its
 * configuration file); module `c` (`crash-module.ts`) holds for ever at the point and height the test names, so the
 * kill always comes exactly there; the restart runs in the test's own process with the same declaration and logs what
 * `c` was given.
 * - **A44** — killed after `c`'s `on-start-height` at its start h (4), inside `c`'s `on-db-write` of h with its row
 *   written, so before h commits: after the restart `on-start-height` fires for `c` at h again, before its
 *   `on-compute` at h (RN-9's at least once).
 * - **A46** — killed after the COMMIT of h (5), inside `c`'s `on-after-db-write` of h: after the restart
 *   `on-after-db-write` fires for h before any callback of h + 1, with h's height, hash and settings and no `block`
 *   items, and no `on-after-db-write` ever receives `block` items, re-delivered or not, though `c` puts one in each
 *   height's `on-parse` (RN-5, RN-11).
 */

const WORKER = fileURLToPath(new URL("./crash.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const HEAD = 8;
/** How long a worker may take to reach its hold, or to die after SIGKILL, under a loaded machine. */
const PATIENCE_MS = 120_000;

/** A worker process and its events. */
interface Worker {
  readonly child: ChildProcess;
  readonly events: CrashWorkerEvent[];
  next(event: CrashWorkerEvent["event"]): Promise<void>;
  readonly exited: Promise<{ readonly code: number | null; readonly signal: NodeJS.Signals | null }>;
}

function startWorker(job: CrashJob): Worker {
  const child = spawn(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const events: CrashWorkerEvent[] = [];
  let stderr = "";
  child.stderr!.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  createInterface({ input: child.stdout! }).on("line", (line) => {
    if (line.startsWith("{")) events.push(JSON.parse(line) as CrashWorkerEvent);
  });
  const exited = once(child, "close").then(() => ({ code: child.exitCode, signal: child.signalCode }));
  return {
    child,
    events,
    exited,
    async next(event) {
      const deadline = Date.now() + PATIENCE_MS;
      while (!events.some((e) => e.event === event)) {
        if (child.exitCode !== null || child.signalCode !== null || Date.now() > deadline) {
          throw new Error(`no ${event} event; events ${JSON.stringify(events.slice(-6))}; stderr ${stderr.slice(-2000)}`);
        }
        await sleep(20);
      }
    },
  };
}

/** What one crash run showed. */
interface CrashObservation {
  /** `c`'s events in the killed process, up to its hold. */
  readonly killed: readonly CrashWorkerEvent[];
  readonly exit: { readonly code: number | null; readonly signal: NodeJS.Signals | null };
  /** The cursor and `c`'s rows after the kill. */
  readonly cursor: number | null;
  readonly rows: readonly number[];
  /** `c`'s calls in the restart, in order, and the cursor and rows once it reached the head. */
  readonly restart: readonly CrashCall[];
  readonly restartCursor: number | null;
  readonly restartRows: readonly number[];
}

/**
 * Starts the worker on a new database of `backend` — `c` from `start` with `k = 7` —, kills it with SIGKILL once `c`
 * holds at `hold`, then restarts in this process (with `loop`, a control's) up to the head.
 */
async function crashRun(
  backend: ProcessBackend,
  hold: CrashJob["hold"],
  start: number,
  loop?: new (input: LoopInput) => FinalizedLoop,
): Promise<CrashObservation> {
  const db = await backend.database();
  const directory = mkdtempSync(join(tmpdir(), "umbradb-crash-"));
  try {
    const configFile = join(directory, "umbradb.config.ts");
    const entries = [core(db.setting), { id: "c", start, version: "1.0.0", config: { k: 7 } }];
    writeFileSync(configFile, `export default ${JSON.stringify({ entries })};\n`);
    const worker = startWorker({ configFile, head: HEAD, hold });
    try {
      await worker.next("hold");
      worker.child.kill("SIGKILL");
      await Promise.race([worker.exited, sleep(PATIENCE_MS)]);
    } finally {
      if (worker.child.exitCode === null && worker.child.signalCode === null) worker.child.kill("SIGKILL");
    }
    const exit = await worker.exited;
    const rowsOf = async () => (await pairs(db, "SELECT height::int AS h, 0 AS v FROM c.rows ORDER BY height")).map(([h]) => h);
    const cursor = await cursorIn(db);
    const rows = await rowsOf();

    const seen: CrashEvent[] = [];
    const build = testBuild([crashModule({ report: (event) => seen.push(event) })]);
    const source = new InMemoryBlockSource({ head: BigInt(HEAD) });
    const handle = startProcess({
      declarations: build.declarations,
      config: { file: configFile },
      source,
      onChecked: build.onChecked,
      log: () => undefined,
      ...(loop === undefined ? {} : { loop }),
    });
    try {
      expect(await settle(handle, source, BigInt(HEAD))).toBe("waiting");
    } finally {
      await handle.stop();
    }
    const restart = seen.filter((event): event is CrashCall => event.event === "call");
    return { killed: [...worker.events], exit, cursor, rows, restart, restartCursor: await cursorIn(db), restartRows: await rowsOf() };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

const calls = (events: readonly CrashWorkerEvent[]): CrashCall[] =>
  events.filter((event): event is CrashCall => event.event === "call");
const at = (point: PointName, height: number) => (call: CrashCall) => call.point === point && call.height === height;
const range = (from: number, to: number): number[] => Array.from({ length: to - from + 1 }, (_, index) => from + index);

/** What both oracles check of the kill itself and of the restart's end (`c` writing from `from`). */
function killAndEnd(observed: CrashObservation, hold: CrashJob["hold"], from: number, cursor: number): string[] {
  const rows = range(from, cursor);
  const problems: string[] = [];
  const holds = observed.killed.filter((event) => event.event === "hold");
  if (holds.length !== 1 || holds[0]?.point !== hold.point || holds[0].height !== hold.height) {
    problems.push(`the process was not killed holding at ${hold.point} of ${hold.height}: ${JSON.stringify(holds)}`);
  }
  if (observed.exit.signal !== "SIGKILL") problems.push(`the process ended by ${observed.exit.signal ?? `code ${observed.exit.code}`}, not SIGKILL`);
  if (observed.cursor !== cursor) problems.push(`the kill left the cursor at ${observed.cursor}, not ${cursor}`);
  if (observed.rows.join(",") !== rows.join(",")) problems.push(`the kill left c's rows ${observed.rows.join(",")}, not ${rows.join(",")}`);
  if (observed.restartCursor !== HEAD) problems.push(`the restart left the cursor at ${observed.restartCursor}`);
  if (observed.restartRows.join(",") !== range(from, HEAD).join(",")) {
    problems.push(`the restart left c's rows ${observed.restartRows.join(",")}`);
  }
  return problems;
}

const A44_HOLD = { point: "on-db-write", height: 4 } as const;
const A46_HOLD = { point: "on-after-db-write", height: 5 } as const;

/** A44's oracle (c from 4, killed in its `on-db-write` of 4): every problem, none when A44 holds. */
function a44Problems(observed: CrashObservation): string[] {
  const problems = killAndEnd(observed, A44_HOLD, 4, 3);
  const before = calls(observed.killed);
  const started = before.findIndex(at("on-start-height", 4));
  if (started === -1 || started > before.findIndex(at("on-db-write", 4))) {
    problems.push("the killed process had not fired on-start-height for c at 4 before its on-db-write of 4");
  }
  const again = observed.restart.filter(at("on-start-height", 4));
  if (again.length === 0) problems.push("the restart did not fire on-start-height for c at 4 again");
  else {
    if (again.length > 1) problems.push(`the restart fired on-start-height for c at 4 ${again.length} times`);
    if (observed.restart.findIndex(at("on-start-height", 4)) > observed.restart.findIndex(at("on-compute", 4))) {
      problems.push("the restart fired on-start-height for c at 4 after its on-compute at 4");
    }
  }
  return problems;
}

/** A46's oracle (c from 1 with k = 7, killed in its `on-after-db-write` of 5): every problem, none when A46 holds. */
function a46Problems(observed: CrashObservation): string[] {
  const problems = killAndEnd(observed, A46_HOLD, 1, 5);
  const h = A46_HOLD.height;
  const before = calls(observed.killed);
  const committed = before.find(at("on-db-write", h));
  if (committed === undefined) problems.push(`the killed process had not run on-db-write of ${h}`);
  const index = observed.restart.findIndex(at("on-after-db-write", h));
  const redelivered = observed.restart[index];
  if (redelivered === undefined) problems.push(`the restart did not fire on-after-db-write for ${h}`);
  else {
    const earlier = observed.restart.slice(0, index).filter((call) => call.height > h);
    if (earlier.length > 0) {
      problems.push(`the re-delivered on-after-db-write at ${h} came after a callback of ${earlier[0]?.height}`);
    }
    const hash = Buffer.from(inMemoryBlock(BigInt(h)).hash).toString("hex");
    if (redelivered.hash !== hash || redelivered.hash !== committed?.hash) {
      problems.push(`the re-delivered on-after-db-write at ${h} had the hash ${redelivered.hash}, not block ${h}'s`);
    }
    if (JSON.stringify(redelivered.settings) !== JSON.stringify({ k: 7 })) {
      problems.push(`the re-delivered on-after-db-write at ${h} had the settings ${JSON.stringify(redelivered.settings)}`);
    }
    if (redelivered.items?.length !== 0) {
      problems.push(`the re-delivered on-after-db-write at ${h} received block items ${redelivered.items?.join(",")}`);
    }
  }
  for (const [name, list] of [
    ["the killed process", before],
    ["the restart", observed.restart],
  ] as const) {
    for (const call of list) {
      if (call.point === "on-after-db-write" && call.items?.length !== 0 && call !== redelivered) {
        problems.push(`in ${name} on-after-db-write at ${call.height} received block items ${call.items?.join(",")}`);
      }
      // The items the check relies on exist: each height's on-compute sees c's note.
      if (call.point === "on-compute" && call.items?.join(",") !== "c-note") {
        problems.push(`in ${name} on-compute at ${call.height} saw the items ${call.items?.join(",")}, not c-note`);
      }
    }
  }
  const afterWrites = observed.restart.filter((call) => call.point === "on-after-db-write").map((call) => call.height);
  if (afterWrites.join(",") !== range(h, HEAD).join(",")) problems.push(`the restart's on-after-db-write ran at ${afterWrites.join(",")}`);
  return problems;
}

/** A negative control's loop: at a restart it fires no module's on-start-height at the first height it processes. */
class SkipsStartAtRestart extends FinalizedLoop {
  #first: bigint | undefined;
  protected override startingAt(run: HeightRun): EntryBoundary {
    this.#first ??= run.height;
    const starting = super.startingAt(run);
    return run.height === this.#first ? { core: starting.core, modules: [] } : starting;
  }
}

/** A negative control's loop: `on-after-db-write` gets a stale block item. */
class ItemsAfterWrite extends FinalizedLoop {
  protected override afterWriteItems(): ReadonlyMap<string, unknown> {
    return new Map([["c-note", "stale"]]);
  }
}

/** A negative control's loop: the cursor's re-delivery comes after the next height. */
class LateRedelivery extends FinalizedLoop {
  #pending: BlockRef | undefined;
  protected override async redeliver(cursor: BlockRef): Promise<void> {
    this.#pending = cursor;
  }
  protected override async after(run: HeightRun): Promise<void> {
    await super.after(run);
    const pending = this.#pending;
    this.#pending = undefined;
    if (pending !== undefined) await super.redeliver(pending);
  }
}

describe("A44 and A46: delivery after a crash (RN-9, RN-11), with a real process killed by SIGKILL", () => {
  beforeAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.start())), 180_000);
  afterAll(() => Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop())), 60_000);

  it("[[runner.fault.start-height-at-least-once]] A44: killed after on-start-height of c at its start h and before h commits, on-start-height fires for c at h again after the restart, on PostgreSQL and on PGlite", async () => {
    for (const backend of PROCESS_BACKENDS) {
      expect(a44Problems(await crashRun(backend, A44_HOLD, 4)), backend.name).toEqual([]);
    }
  }, 600_000);

  it("negative control: a restart that skips the re-delivered on-start-height fails A44", async () => {
    for (const backend of PROCESS_BACKENDS) {
      expect(a44Problems(await crashRun(backend, A44_HOLD, 4, SkipsStartAtRestart)), backend.name).toEqual([
        "the restart did not fire on-start-height for c at 4 again",
      ]);
    }
  }, 600_000);

  it("[[runner.fault.after-write-at-least-once]] A46: killed after the COMMIT of h and before its on-after-db-write completed, on-after-db-write fires for h after the restart before any callback of h + 1, with h's height, hash and settings and no block items; no on-after-db-write receives block items, on PostgreSQL and on PGlite", async () => {
    for (const backend of PROCESS_BACKENDS) {
      expect(a46Problems(await crashRun(backend, A46_HOLD, 1)), backend.name).toEqual([]);
    }
  }, 600_000);

  it("negative control: a re-delivered on-after-db-write that carries block items fails A46", async () => {
    for (const backend of PROCESS_BACKENDS) {
      expect(a46Problems(await crashRun(backend, A46_HOLD, 1, ItemsAfterWrite)), backend.name).toEqual([
        "the re-delivered on-after-db-write at 5 received block items c-note",
        "in the restart on-after-db-write at 6 received block items c-note",
        "in the restart on-after-db-write at 7 received block items c-note",
        "in the restart on-after-db-write at 8 received block items c-note",
      ]);
    }
  }, 600_000);

  it("negative control: a re-delivered on-after-db-write that comes after a callback of h + 1 fails A46", async () => {
    for (const backend of PROCESS_BACKENDS) {
      expect(a46Problems(await crashRun(backend, A46_HOLD, 1, LateRedelivery)), backend.name).toEqual([
        "the re-delivered on-after-db-write at 5 came after a callback of 6",
        "the restart's on-after-db-write ran at 6,5,7,8",
      ]);
    }
  }, 600_000);
});
