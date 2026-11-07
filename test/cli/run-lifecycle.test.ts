import { EventEmitter } from "node:events";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT, runProcessCommand } from "../../src/cli/command.js";
import type { ProcessHandle } from "../../src/runner/process.js";
import { ask, observe, stateProblems, statusWhen } from "../admin/admin-harness.js";
import { openHold } from "../library/fixtures/import-holds.js";
import { freePort } from "../runner/process-harness.js";
import { type CliProject, cliProject, inProcess } from "./cli-fixtures.js";
import { chainNode, runCoreSettings, statsConfig, statsModule } from "./run-fixtures.js";

/**
 * L31: the command's lifecycle is unchanged by the library's (PGlite 0.5.10, `umbradb run` in this process with the
 * real admin worker on the file's `listen.admin`, its signals the test's). [L31 CI, AE-3, RN-13]
 *
 * - A refusal of the configuration logs its findings and exits 1 by itself, with no admin listener opened.
 * - After a later refusal (its admin bound: PGlite without the development opt-in, `development-opt-in-required`)
 *   the admin listener answers `/health/live` 200, `/health/ready` 503 and `/status` `refused` until SIGTERM, and the
 *   process then exits 1.
 * - During a SIGTERM drain — a block's `on-db-write` held at a test hold — `/status` answers 200 `stopping`; once the
 *   block committed, the command exits 0.
 *
 * `test/admin/refused-configuration.test.ts` runs the first two cases over every refused file, with their controls.
 */

let project: CliProject;
let files = 0;

beforeAll(async () => {
  project = await cliProject({ cli: true });
  project.write("stats.ts", statsModule(project.builders));
  // A module whose `on-db-write` at height 3 waits at the hold `l31-drain` (the test's registry on `globalThis`).
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
      '      const hold = globalThis[HOLDS]?.get("l31-drain");',
      "      if (hold === undefined) return;",
      "      hold.entered.resolve();",
      "      await hold.release.promise;",
      "    },",
      "  },",
      "});",
      "",
    ].join("\n"),
  );
}, 180_000);

afterAll(() => project?.remove());

/** A configuration file of the project under its own name, with `stats` and `extra` modules and entries. */
function write(core: string, more: { readonly before?: readonly string[]; readonly modules?: string; readonly entries?: readonly string[] } = {}): string {
  files += 1;
  const name = `l31-${files}.config.ts`;
  project.write(name, statsConfig(project.builders, { core, ...more }));
  return name;
}

/** `umbradb run --config <file>` in this process, its handle told to the test. */
function runHere(file: string) {
  const signals = new EventEmitter();
  let handle: ProcessHandle | undefined;
  const run = runProcessCommand({ signals, started: (started) => (handle = started) });
  const result = inProcess(["run", "--config", file], project.dir, { run });
  return { signals, result, handle: () => handle };
}

describe("L31: umbradb run's lifecycle, unchanged (PGlite 0.5.10)", () => {
  it("a refusal of the configuration logs its findings and exits 1 by itself, no admin listener opened", async () => {
    const port = await freePort();
    const file = write(
      runCoreSettings({ kind: "pglite", path: join(project.dir, `db-${files + 1}`) }, "ws://127.0.0.1:9/node", {
        listen: { admin: `127.0.0.1:${port}` },
        livenessTimeoutMs: "30s",
      }),
    );
    const run = runHere(file);
    const ended = await Promise.race([run.result.then(() => true), sleep(60_000, false)]);
    if (!ended) run.signals.emit("SIGTERM");
    const { code, stderr } = await run.result;
    expect(ended).toBe(true);
    expect(code).toBe(EXIT.failed);
    expect(stderr.split("\n").some((line) => line.startsWith("startup refused: ") && line.includes("entries[0].config.livenessTimeoutMs"))).toBe(true);
    expect(stderr).not.toMatch(/admin endpoints listening/);
    expect(run.handle()?.listening().admin ?? null).toBeNull();
    expect((await ask(`http://127.0.0.1:${port}`, "/health/live")).status).toBeNull();
  }, 120_000);

  it("after a later refusal its admin listener answers live 200, ready 503, /status refused until SIGTERM; then it exits 1", async () => {
    const file = write(
      runCoreSettings({ kind: "pglite", path: join(project.dir, `db-${files + 1}`) }, "ws://127.0.0.1:9/node", { developmentOptIn: false }),
    );
    const run = runHere(file);
    try {
      let admin: { readonly host: string; readonly port: number } | null = null;
      const deadline = Date.now() + 60_000;
      while ((admin = run.handle()?.listening().admin ?? null) === null && Date.now() < deadline) await sleep(20);
      expect(admin).not.toBeNull();
      const origin = `http://${admin?.host}:${admin?.port}`;
      await statusWhen(origin, (body) => body.state === "refused");
      expect(stateProblems(await observe(origin), { state: "refused", ready: false, reason: { code: "development-opt-in-required" } })).toEqual([]);
      expect(await Promise.race([run.result.then(() => true), sleep(1_500, false)])).toBe(false);
    } finally {
      run.signals.emit("SIGTERM");
    }
    expect((await run.result).code).toBe(EXIT.failed);
  }, 120_000);

  it("during a SIGTERM drain /status answers 200 stopping; the block in progress commits and the command exits 0", async () => {
    const tape = await chainNode();
    const hold = openHold("l31-drain");
    try {
      const file = write(runCoreSettings({ kind: "pglite", path: join(project.dir, `db-${files + 1}`) }, tape.url), {
        before: ['import { held } from "./held.ts";'],
        modules: "[stats, held]",
        entries: ['held.entry({ start: 1, config: {} })'],
      });
      const run = runHere(file);
      await hold.entered;
      const admin = run.handle()?.listening().admin;
      expect(admin).not.toBeNull();
      const origin = `http://${admin?.host}:${admin?.port}`;
      run.signals.emit("SIGTERM");
      const status = await statusWhen(origin, (body) => body.state === "stopping", 10_000);
      expect(status.state).toBe("stopping");
      expect((await ask(origin, "/health/live")).status).toBe(200);
      hold.release();
      const { code } = await run.result;
      expect(code).toBe(EXIT.ok);
      // Height 3 committed whole before the process exited.
      expect(run.handle()?.status().cursor).toBe(3n);
    } finally {
      hold.release();
      await tape.close();
    }
  }, 180_000);
});
