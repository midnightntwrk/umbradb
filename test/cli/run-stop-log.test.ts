import { EventEmitter } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT, runProcessCommand } from "../../src/cli/command.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import { openHold } from "../library/fixtures/import-holds.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { type CliProject, cliProject, inProcess } from "./cli-fixtures.js";
import { chainNode, HEAD, runCoreSettings, statsConfig, statsModule } from "./run-fixtures.js";

/**
 * A stop of `umbradb run` by SIGTERM or SIGINT is in its log, on PostgreSQL 18 and PGlite 0.5.10: the
 * command in this process (`runProcessCommand`) with the test's own signal source, the real admin worker, a tape node
 * serving the synthetic chain of `./run-fixtures.ts` (S = 1, head 5).
 *
 * Two lines, the engine's, so a host's `log` gets them as the command's standard error does:
 * - when the stop begins, what asked for it (the signal, by its name) and what was in progress: a height, which then
 *   commits or stores nothing, none, or startup;
 * - once processing has ended by the stop, the last height the process saw committed, or that it saw none; a restart
 *   resumes after the cursor the database stored, which the line does not claim to know (a `COMMIT` whose answer was
 *   lost can leave it one height above what the process saw).
 *
 * The cases: SIGTERM at the head; SIGINT while height 3 waits in a module's `on-db-write`; SIGTERM during startup,
 * while it retries an unreachable node.
 */

/** How long a process may take to reach the head, and to end after its signal, on a loaded machine. */
const PATIENCE_MS = Number(process.env.UMBRADB_TEST_PATIENCE_MS ?? 240_000);

/** The hold the module `held` waits at in its `on-db-write` of height 3 (the test's registry on `globalThis`). */
const HOLD = "run-stop-log";

let project: CliProject;

beforeAll(async () => {
  project = await cliProject();
  project.write("stats.ts", statsModule(project.builders));
  project.write(
    "held.ts",
    [
      'import { z } from "zod";',
      `import { defineModule } from ${JSON.stringify(project.builders)};`,
      'const HOLDS = Symbol.for("umbradb.test.library.import-holds");',
      "export const held = defineModule({",
      '  id: "held", version: "1.0.0", side: "public", requires: ["block-header"], provides: [], startsMidChain: true,',
      "  configSchema: z.object({}), migrations: [],",
      "  points: {",
      '    async "on-db-write"(_p, b) {',
      "      if (b.height !== 3n) return;",
      `      const hold = globalThis[HOLDS]?.get(${JSON.stringify(HOLD)});`,
      "      if (hold === undefined) return;",
      "      hold.entered.resolve();",
      "      await hold.release.promise;",
      "    },",
      "  },",
      "});",
      "",
    ].join("\n"),
  );
}, 120_000);

afterAll(() => project?.remove());

let files = 0;
/** A configuration file under its own name (Node.js caches a file's first evaluation), relative to the project. */
function write(options: Parameters<typeof statsConfig>[1]): string {
  files += 1;
  const name = `stop-log-${files}.config.ts`;
  project.write(name, statsConfig(project.builders, options));
  return name;
}

/** `umbradb run --config <file>` in this process, its signals the test's and its handle told to the test. */
function runHere(file: string) {
  const signals = new EventEmitter();
  let handle: ProcessHandle | undefined;
  const run = runProcessCommand({ signals, started: (started) => (handle = started) });
  const result = inProcess(["run", "--config", file], project.dir, { run });
  return { signals, result, handle: () => handle };
}

/** Waits until `check` holds, or fails naming `what` once `PATIENCE_MS` passed. */
async function until(check: () => boolean, what: () => string): Promise<void> {
  const deadline = Date.now() + PATIENCE_MS;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out: ${what()}`);
    await sleep(20);
  }
}

/** The stop's lines of a log (see the module comment), in order. */
const stopLines = (stderr: string): string[] =>
  stderr.split("\n").filter((line) => /^(stopping|processing stopped|startup stopped) \(/.test(line));

/** The rows `stats` wrote, as `height label` lines. */
async function statsRows(db: ProcessDatabase): Promise<string[]> {
  const rows = await db.query("SELECT height::int AS h, label FROM stats.rows ORDER BY height");
  return rows.map((row) => `${row.h} ${row.label}`);
}

describe.each(PROCESS_BACKENDS)("umbradb run logs its stop by a signal, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("SIGTERM at the head: the stop with nothing in progress, then the last height the process saw committed", async () => {
    const tape = await chainNode();
    try {
      const db = await backend.database();
      const run = runHere(write({ core: runCoreSettings(db.setting, tape.url), statsConfig: '{ label: "head" }' }));
      await until(() => run.handle()?.status().cursor === HEAD, () => `the cursor at ${HEAD}: ${run.handle()?.status().state}`);
      run.signals.emit("SIGTERM");
      const { code, stderr } = await run.result;
      expect(code).toBe(EXIT.ok);
      expect(stopLines(stderr)).toEqual([
        "stopping (signal: SIGTERM): no height in progress, and no new height starts",
        `processing stopped (signal: SIGTERM): the last height this process saw committed is ${HEAD}; a restart resumes after the stored cursor`,
      ]);
    } finally {
      await tape.close();
    }
  }, PATIENCE_MS * 2);

  it("SIGINT while height 3 is in its on-db-write: the stop names height 3, which commits, the last height seen committed", async () => {
    const tape = await chainNode();
    const hold = openHold(HOLD);
    try {
      const db = await backend.database();
      const file = write({
        core: runCoreSettings(db.setting, tape.url),
        statsConfig: '{ label: "held" }',
        before: ['import { held } from "./held.ts";'],
        modules: "[stats, held]",
        entries: ["held.entry({ start: 1, config: {} })"],
      });
      const run = runHere(file);
      await hold.entered;
      run.signals.emit("SIGINT");
      hold.release();
      const { code, stderr } = await run.result;
      expect(code).toBe(EXIT.ok);
      expect(stopLines(stderr)).toEqual([
        "stopping (signal: SIGINT): height 3 is in progress; it commits or stores nothing, and no new height starts",
        "processing stopped (signal: SIGINT): the last height this process saw committed is 3; a restart resumes after the stored cursor",
      ]);
      // Height 3 committed whole, and no height after it started.
      expect(await statsRows(db)).toEqual(["1 held", "2 held", "3 held"]);
    } finally {
      hold.release();
      await tape.close();
    }
  }, PATIENCE_MS * 2);

  it("SIGTERM during startup, the node unreachable: the stop during startup, then that the process saw no height committed", async () => {
    const db = await backend.database();
    const run = runHere(write({ core: runCoreSettings(db.setting, "ws://127.0.0.1:9/node"), statsConfig: '{ label: "start" }' }));
    await until(
      () => run.handle()?.status().conditions.some((condition) => condition.code === "node-retrying") === true,
      () => `node-retrying: ${JSON.stringify(run.handle()?.status().conditions)}`,
    );
    expect(run.handle()?.status().state).toBe("starting");
    run.signals.emit("SIGTERM");
    const { code, stderr } = await run.result;
    expect(code).toBe(EXIT.ok);
    expect(stopLines(stderr)).toEqual([
      "stopping (signal: SIGTERM): during startup, which ends before its next step",
      "startup stopped (signal: SIGTERM): this process saw no height committed; a restart resumes after the stored cursor, if any",
    ]);
  }, PATIENCE_MS * 2);
});
