import { EventEmitter } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { type AdminServer, type AdminStarter, startAdminServer } from "../../../src/admin/server.js";
import type { AdminSnapshot } from "../../../src/admin/types.js";
import { commandBuild } from "../../../src/cli/build-modules.js";
import { loadConfig } from "../../../src/config/load.js";
import type { ReadOnlyDatabase } from "../../../src/db/api.js";
import { InMemoryBlockSource } from "../../../src/runner/in-memory-source.js";
import type { ProcessHandle } from "../../../src/runner/process.js";
import { ask } from "../../admin/admin-harness.js";
import { schemaFile, validatorOf } from "../../admin/json-schema.js";
import { PATIENCE_MS, tickerModule } from "../../backup/backup-fixtures.js";
import { hookAt, recorderModule } from "../../backup/pause-fixtures.js";
import { type CliProject, cliProject } from "../../cli/cli-fixtures.js";
import type { ProcessDatabase } from "../../runner/process-backends.js";
import { coreSettings, startProcess } from "../../runner/process-build.js";
import type { DatabaseParts } from "../../../src/config/database-parts.js";

/**
 * `/status`, read over HTTP from a running process's admin endpoints, lists the condition `paused` while the finalized
 * loop is paused, and none once it runs again. The condition carries `since`, the time the loop paused as RFC 3339 UTC
 * text, and `by`. [A176, AE-3, Q174 B, Q68]
 *
 * `/health/ready` answers as an unpaused process with the same lag would. [AE-4]
 *
 * Shared by `paused.test.ts` and its negative control's file; imports nothing of Vitest.
 *
 * **The process** is the pause tests' process (`test/backup/pause-fixtures.ts`: the `umbradb` command's build with
 * modules `ticker` and `recorder`, whose hooks act from inside a height), plus a module `keeper` that keeps the core's
 * `db` item. It runs on the in-memory chain with every block known at once, its admin endpoints on `127.0.0.1:0`
 * through a starter a negative control may wrap, with `readinessLag` 5 and `followingThreshold` 3 (the default).
 * [A163, CF-4]
 *
 * **The run of `pause()`** ({@link pauseRun}, PostgreSQL 18.6 and PGlite 0.5.10), each phase entered once the process
 * itself shows its precondition, then `/status` read until it shows the phase's body or the patience ran out:
 * 1. `pause()` asked at `on-compute` of 10 with the head at 40: paused at 10, `syncing`, lag 30, not ready (503) —
 *    `paused` by `pause`, `since` between the call and its resolution, the only condition;
 * 2. 300 ms later: the same `since`;
 * 3. `resume()`: the loop runs to 40, `following`, ready, no condition — and no body read after `resume()` with the
 *    cursor above 10 lists `paused`;
 * 4. `pause()` while the loop waits for the head at 40: `paused` by `pause` at once, `following`, lag 0, ready (200);
 * 5. `pause()` asked again 300 ms later: the same pause, the same `since`;
 * 6. `resume()` and the head at 45: the loop runs to 45, no condition — and no body read after it with the cursor
 *    above 40 lists `paused`.
 *
 * **The run of SIGUSR2** ({@link signalRun}, PGlite 0.5.10), `backupOnSignal` set and a test's emitter as the signal:
 * at 10, waiting for the head, no condition; a read of the test holds PGlite's queue, so the backup, which runs as one
 * job of it, waits; SIGUSR2: the loop paused (`backup on signal: processing paused at height 10`) and, until the
 * read ends and the backup is written, `paused` by `signal`, `since` after the signal, `following`, ready; once written
 * no condition, and none when the loop ran on to 15.
 *
 * Every `/status` body read is checked against `./status.schema.json`. The problems found are returned as text, one
 * per phase and check; a passing run has none. [A66]
 */

const STATUS_SCHEMA = validatorOf(schemaFile(new URL("./status.schema.json", import.meta.url)));

/** The readiness lag of these processes: 30 behind is not ready, 0 is. */
const READINESS_LAG = 5n;
/** How long a phase waits before it reads `/status` again, to see that the pause's time stays. */
const STILL_MS = 300;

/** What a test project gives the runs: the command's project with the three modules `ticker`, `recorder`, `keeper`. */
export async function a176Project(): Promise<CliProject> {
  const project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  project.write("recorder.ts", recorderModule(project.builders));
  project.write("keeper.ts", keeperModule(project.builders));
  return project;
}

/** Where `keeper` puts the core's `db` item in this test process. */
interface KeeperGlobals {
  __umbradbA176Db?: ReadOnlyDatabase;
}

/** The module file of `keeper`: keeps the core's `db` item (read-only) from its `on-start-api` on. */
function keeperModule(builders: string): string {
  return [
    'import { z } from "zod";',
    `import { defineModule } from ${JSON.stringify(builders)};`,
    "",
    "export const keeper = defineModule({",
    '  id: "keeper",',
    '  version: "1.0.0",',
    '  side: "public",',
    '  requires: ["db"],',
    "  provides: [],",
    "  startsMidChain: true,",
    "  configSchema: z.object({}),",
    "  migrations: [],",
    "  points: {",
    '    async "on-start-api"(p) {',
    '      (globalThis as { __umbradbA176Db?: unknown }).__umbradbA176Db = p.items.get("db");',
    "    },",
    "  },",
    "});",
    "",
  ].join("\n");
}

let files = 0;

/** Writes a configuration file of the process on `database`, with `extra` `core` settings; its absolute path. */
function writeConfig(project: CliProject, database: DatabaseParts, extra: Readonly<Record<string, unknown>> = {}): string {
  files += 1;
  const core = JSON.stringify(
    coreSettings(database, { listen: { admin: "127.0.0.1:0" }, readinessLag: Number(READINESS_LAG), ...extra }),
  );
  return project.write(
    `a176-${files}.config.ts`,
    [
      `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
      'import { ticker } from "./ticker.ts";',
      'import { recorder } from "./recorder.ts";',
      'import { keeper } from "./keeper.ts";',
      "export const modules = [ticker, recorder, keeper];",
      "export default defineConfig({",
      "  entries: [",
      `    coreEntry({ start: 1, config: ${core} }),`,
      "    ticker.entry({ start: 1, config: {} }),",
      "    recorder.entry({ start: 1, config: {} }),",
      "    keeper.entry({ start: 1, config: {} }),",
      "  ],",
      "});",
      "",
    ].join("\n"),
  );
}

/** A running process of these tests. */
interface Running {
  readonly handle: ProcessHandle;
  readonly source: InMemoryBlockSource;
  readonly lines: string[];
  /** The admin listener's origin, once it listens. */
  origin(): Promise<string>;
}

/** Starts the process of `file` on the chain at `head`; its admin endpoints through `wrap(startAdminServer)`. */
async function start(
  file: string,
  head: bigint,
  wrap: (start: AdminStarter) => AdminStarter,
  signals?: EventEmitter,
): Promise<Running> {
  const loaded = await loadConfig({ file });
  const source = new InMemoryBlockSource({ head });
  const lines: string[] = [];
  let listening!: (server: AdminServer) => void;
  let failed!: (error: unknown) => void;
  const server = new Promise<AdminServer>((resolve, reject) => {
    listening = resolve;
    failed = reject;
  });
  server.catch(() => undefined);
  const handle = startProcess({
    declarations: commandBuild(loaded.modules),
    config: { data: loaded.data, file: loaded.file },
    source,
    log: (line) => lines.push(line),
    ...(signals === undefined ? {} : { backupSignals: signals }),
    admin: async (options) => {
      try {
        const started = await wrap(startAdminServer)(options);
        if (started.port < 10_000) throw new Error(`the admin listener listens on port ${started.port}, below 10000`);
        listening(started);
        return started;
      } catch (error) {
        failed(error);
        throw error;
      }
    },
  });
  return {
    handle,
    source,
    lines,
    origin: async () => {
      const { host, port } = await server;
      return `http://${host}:${port}`;
    },
  };
}

/** Waits until `ready()`, or rejects with `what` once `PATIENCE_MS` passed or processing ended otherwise. */
async function until(run: Running, ready: () => boolean, what: string): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!ready()) {
    const ended = run.handle.status().ended;
    if (ended !== null) throw new Error(`not ${what}: processing ended (${ended.kind}): ${run.lines.join(" | ")}`);
    if (Date.now() > deadline) throw new Error(`not ${what} within ${PATIENCE_MS} ms: ${run.lines.join(" | ")}`);
    await sleep(10);
  }
}

/** Waits until `run`'s cursor is at least `height`. */
const reach = (run: Running, height: bigint): Promise<void> =>
  until(run, () => (run.handle.status().cursor ?? -1n) >= height, `at ${height}`);

/** Resolves with `promise`, or rejects with `message` once `PATIENCE_MS` passed. */
async function within<T>(promise: Promise<T>, message: string): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${message} (within ${PATIENCE_MS} ms)`)), PATIENCE_MS);
  });
  try {
    return await Promise.race([promise, late]);
  } finally {
    clearTimeout(timer);
  }
}

/** A `/status` body as these tests read it. */
type Body = {
  readonly state: string;
  readonly ready: boolean;
  readonly cursor: string | null;
  readonly lag: string | null;
  readonly conditions: readonly Record<string, unknown>[];
};

/** A `/status` body read, with `/health/ready`'s status read right after it. */
interface Read {
  readonly body: Body;
  readonly readyStatus: number | null;
}

/** The condition `paused` of `body`, if listed. */
const pausedOf = (body: Body): Record<string, unknown> | undefined => body.conditions.find((each) => each.code === "paused");

/** What a phase that shows a pause expects. */
interface PausedExpectation {
  readonly by: "pause" | "signal";
  /** The wall-clock bounds of the moment the loop paused. */
  readonly from: number;
  readonly to: number;
  readonly state: string;
  readonly lag: string;
}

/** Reads `/status` (and `/health/ready`) of a process, checking every body against the schema; collects problems. */
class Reader {
  readonly problems: string[] = [];
  /** Every body read, in order, with the phase it was read in. */
  readonly bodies: { readonly phase: string; readonly body: Body }[] = [];

  constructor(
    private readonly origin: string,
    private readonly patienceMs: number,
  ) {}

  /** One read of `/status` and `/health/ready` in `phase`. */
  async read(phase: string): Promise<Read | undefined> {
    const answer = await ask(this.origin, "/status");
    const body = answer.json as Body | undefined;
    if (answer.status !== 200 || body === undefined) return undefined;
    const invalid = STATUS_SCHEMA.problems(body);
    if (invalid.length > 0) this.problems.push(`${phase}: /status fails its schema: ${invalid.join("; ")}`);
    this.bodies.push({ phase, body });
    const ready = await ask(this.origin, "/health/ready");
    return { body, readyStatus: ready.status };
  }

  /**
   * Reads until `wanted` holds of the body, then records what `checks` finds of it; if it never does within the
   * patience, records that the phase was never shown. Resolves with the read, or undefined.
   */
  async phase(name: string, wanted: (body: Body) => boolean, checks: (read: Read) => string[]): Promise<Read | undefined> {
    const deadline = Date.now() + this.patienceMs;
    for (;;) {
      const read = await this.read(name);
      if (read !== undefined && wanted(read.body)) {
        for (const problem of checks(read)) this.problems.push(`${name}: ${problem}`);
        return read;
      }
      if (Date.now() > deadline) {
        this.problems.push(`${name}: /status never showed it`);
        return undefined;
      }
      await sleep(25);
    }
  }

  /** Records a problem when a body read in `phases` with its cursor above `height` lists `paused`. */
  noPauseAbove(phases: readonly string[], height: bigint, what: string): void {
    const shown = this.bodies.filter(
      ({ phase, body }) => phases.includes(phase) && body.cursor !== null && BigInt(body.cursor) > height && pausedOf(body) !== undefined,
    );
    if (shown.length > 0) this.problems.push(`${what}: /status listed paused with the cursor above ${height}`);
  }
}

/** Readiness of a running process: ready unless the lag exceeds the readiness lag. [AE-4] */
function readinessProblems({ body, readyStatus }: Read): string[] {
  const expected = body.lag !== null && BigInt(body.lag) <= READINESS_LAG;
  const problems: string[] = [];
  if (body.ready !== expected) problems.push(`ready is ${body.ready}, not ${expected} as unpaused with lag ${body.lag}`);
  if (readyStatus !== (expected ? 200 : 503)) {
    problems.push(`/health/ready answered ${readyStatus}, not ${expected ? 200 : 503} as unpaused with lag ${body.lag}`);
  }
  return problems;
}

/** The checks of a body that shows a pause. [A176] */
function pausedProblems(expectation: PausedExpectation): (read: Read) => string[] {
  return (read) => {
    const { body } = read;
    const problems: string[] = [];
    const paused = pausedOf(body);
    const others = body.conditions.filter((each) => each.code !== "paused").map((each) => String(each.code));
    if (others.length > 0) problems.push(`conditions besides paused: ${others.join(", ")}`);
    if (body.conditions.length - others.length !== 1) problems.push(`paused listed ${body.conditions.length - others.length} times`);
    if (paused !== undefined) {
      if (paused.by !== expectation.by) problems.push(`by is ${JSON.stringify(paused.by)}, not "${expectation.by}"`);
      const since = typeof paused.since === "string" ? Date.parse(paused.since) : Number.NaN;
      if (!(since >= expectation.from && since <= expectation.to)) problems.push("since is not the time the loop paused");
    }
    if (body.state !== expectation.state) problems.push(`state is ${body.state}, not ${expectation.state}`);
    if (body.lag !== expectation.lag) problems.push(`lag is ${body.lag}, not ${expectation.lag}`);
    return [...problems, ...readinessProblems(read)];
  };
}

/** The checks of a body of a running loop: no condition, `state`, and readiness by the lag. [A176, AE-4] */
function runningProblems(state: string): (read: Read) => string[] {
  return (read) => {
    const problems: string[] = [];
    if (read.body.conditions.length > 0) {
      problems.push(`conditions listed: ${read.body.conditions.map((each) => String(each.code)).join(", ")}`);
    }
    if (read.body.state !== state) problems.push(`state is ${read.body.state}, not ${state}`);
    return [...problems, ...readinessProblems(read)];
  };
}

/** The `since` of a read's `paused`, or undefined. */
const sinceOf = (read: Read | undefined): unknown => (read === undefined ? undefined : pausedOf(read.body)?.since);

/** Checks that a later read shows the same pause as `first`, with the same `since`. */
function samePause(first: Read | undefined): (read: Read) => string[] {
  return (read) => {
    const problems: string[] = [];
    if (pausedOf(read.body) === undefined) problems.push("no paused listed");
    else if (first !== undefined && sinceOf(read) !== sinceOf(first)) problems.push("since changed while paused");
    return problems;
  };
}

/** Options of the runs. */
export interface A176Options {
  /** How long each phase reads `/status` for what it expects, once the process shows its precondition. */
  readonly patienceMs: number;
  /** Wraps the admin server's start: a negative control's publication. */
  readonly wrap?: (start: AdminStarter) => AdminStarter;
}

/** The run of `pause()` and `resume()` on `db` (see the module comment): the problems found, none when it passes. */
export async function pauseRun(project: CliProject, db: ProcessDatabase, options: A176Options): Promise<string[]> {
  const wrap = options.wrap ?? ((given) => given);
  let asked = 0;
  let paused: Promise<void> | undefined;
  hookAt("on-compute", 10n, () => {
    asked = Date.now();
    paused = run.handle.pause();
  });
  const run = await start(writeConfig(project, db.setting), 40n, wrap);
  try {
    const reader = new Reader(await run.origin(), options.patienceMs);
    await until(run, () => paused !== undefined, "pause() asked at on-compute of 10");
    await within(paused as Promise<void>, "pause() did not resolve");
    const resolved = Date.now();
    const first = await reader.phase(
      "paused by pause() at 10, syncing",
      (body) => body.cursor === "10" && pausedOf(body) !== undefined,
      pausedProblems({ by: "pause", from: asked, to: resolved, state: "syncing", lag: "30" }),
    );
    await sleep(STILL_MS);
    await reader.phase("still paused at 10", (body) => body.cursor === "10", samePause(first));

    run.handle.resume();
    await reach(run, 40n);
    await reader.phase(
      "resumed, following at 40",
      (body) => body.cursor === "40" && pausedOf(body) === undefined,
      runningProblems("following"),
    );
    reader.noPauseAbove(["resumed, following at 40"], 10n, "after the first resume()");

    await within(run.source.waiting(40n), "the loop waiting for the head at 40");
    const askedAgain = Date.now();
    await within(run.handle.pause(), "pause() while waiting for the head did not resolve");
    const resolvedAgain = Date.now();
    const second = await reader.phase(
      "paused by pause() while waiting for the head at 40",
      (body) => {
        const since = pausedOf(body)?.since;
        return body.cursor === "40" && typeof since === "string" && Date.parse(since) >= askedAgain;
      },
      pausedProblems({ by: "pause", from: askedAgain, to: resolvedAgain, state: "following", lag: "0" }),
    );
    await sleep(STILL_MS);
    await within(run.handle.pause(), "pause() asked again did not resolve");
    await reader.phase("pause() asked again, the same pause", (body) => body.cursor === "40", samePause(second));

    run.handle.resume();
    run.source.finalize(45n);
    await reach(run, 45n);
    await reader.phase(
      "resumed, following at 45",
      (body) => body.cursor === "45" && pausedOf(body) === undefined,
      runningProblems("following"),
    );
    reader.noPauseAbove(["resumed, following at 45"], 40n, "after the second resume()");
    return reader.problems;
  } finally {
    await run.handle.stop();
  }
}

/** The run of SIGUSR2 on `db`, a PGlite database (see the module comment): the problems found. */
export async function signalRun(project: CliProject, db: ProcessDatabase, out: string, options: A176Options): Promise<string[]> {
  const wrap = options.wrap ?? ((given) => given);
  const signals = new EventEmitter();
  const run = await start(writeConfig(project, db.setting, { backupOnSignal: out }), 10n, wrap, signals);
  let release: (() => void) | undefined;
  try {
    const reader = new Reader(await run.origin(), options.patienceMs);
    await reach(run, 10n);
    await within(run.source.waiting(10n), "the loop waiting for the head at 10");
    await reader.phase("following at 10, before the signal", (body) => body.cursor === "10", runningProblems("following"));

    // A read of the test holds PGlite's queue: the backup, one job of it, waits until the read ends.
    const kept = (globalThis as KeeperGlobals).__umbradbA176Db;
    if (kept === undefined) throw new Error("keeper did not keep the db item");
    let holding = false;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const read = kept.read(async () => {
      holding = true;
      await gate;
    });
    await until(run, () => holding, "the test's read holding the queue");

    const signalled = Date.now();
    signals.emit("SIGUSR2");
    await until(run, () => run.lines.includes("backup on signal: processing paused at height 10"), "paused for the backup");
    const pausedBy = Date.now();
    await reader.phase(
      "paused by SIGUSR2, the backup waiting",
      (body) => pausedOf(body) !== undefined,
      (shown) => [
        ...pausedProblems({ by: "signal", from: signalled, to: pausedBy, state: "following", lag: "0" })(shown),
        ...(run.lines.some((line) => line.startsWith("backup on signal written")) ? ["the backup was written already"] : []),
      ],
    );
    release?.();
    await read;
    const written = `backup on signal written to ${out}: height 10, contents hash `;
    await until(
      run,
      () => run.lines.some((line) => line.startsWith(written) || line.startsWith("backup on signal failed")),
      "the backup written",
    );
    const failed = run.lines.find((line) => line.startsWith("backup on signal failed"));
    if (failed !== undefined) throw new Error(`the backup on signal failed: ${failed}`);
    await reader.phase("the backup written", (body) => pausedOf(body) === undefined, runningProblems("following"));

    run.source.finalize(15n);
    await reach(run, 15n);
    await reader.phase(
      "the loop ran on to 15",
      (body) => body.cursor === "15" && pausedOf(body) === undefined,
      runningProblems("following"),
    );
    reader.noPauseAbove(["the backup written", "the loop ran on to 15"], 10n, "after the backup");
    return reader.problems;
  } finally {
    release?.();
    await run.handle.stop();
  }
}

/** A publication wrapped by `change`, for the negative controls. */
function publishing(change: (snapshot: AdminSnapshot) => AdminSnapshot): (start: AdminStarter) => AdminStarter {
  return (startServer) => async (options) => {
    const server = await startServer({ ...options, snapshot: change(options.snapshot) });
    return {
      host: server.host,
      port: server.port,
      get threadId() {
        return server.threadId;
      },
      publish: (snapshot) => server.publish(change(snapshot)),
      close: () => server.close(),
    };
  };
}

/** `snapshot` with its conditions as `conditions`. */
const withConditions = (snapshot: AdminSnapshot, conditions: AdminSnapshot["status"]["conditions"]): AdminSnapshot => ({
  ...snapshot,
  status: { ...snapshot.status, conditions },
});

/** A negative control's publication: a process that never publishes the pause (as `/status` was before it listed one). */
export function withoutPause(): (start: AdminStarter) => AdminStarter {
  return publishing((snapshot) =>
    withConditions(
      snapshot,
      snapshot.status.conditions.filter((each) => each.code !== "paused"),
    ),
  );
}

/** A negative control's publication: a process that keeps the last pause it published after the loop runs again. */
export function keepingPause(): (start: AdminStarter) => AdminStarter {
  let last: AdminSnapshot["status"]["conditions"][number] | undefined;
  return publishing((snapshot) => {
    const paused = snapshot.status.conditions.find((each) => each.code === "paused");
    if (paused !== undefined) last = paused;
    return paused !== undefined || last === undefined ? snapshot : withConditions(snapshot, [...snapshot.status.conditions, last]);
  });
}
