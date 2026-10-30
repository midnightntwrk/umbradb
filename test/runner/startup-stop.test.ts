import { performance } from "node:perf_hooks";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ask, statusWhen } from "../admin/admin-harness.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { runCoreSettings, runInChild } from "../cli/run-fixtures.js";
import { PROCESS_BACKENDS } from "./process-backends.js";
import { freePort } from "./process-harness.js";
import {
  a167Problems,
  a167Run,
  CEILING_MS,
  PATIENCE_MS,
  privateProblems,
  privateRun,
  STOP_LIMIT_MS,
  type StopBy,
} from "./startup-stop-harness.js";

/**
 * `[CI]` With the node unreachable (a closed port) and startup retrying it, SIGTERM, and likewise
 * `ProcessHandle.stop()`, ends the process within 5 s: `stopping`, then `ended` of kind `signal`, the node client
 * closed, no connection attempt after the stop, no second signal; `umbradb run` exits 0. [A167 CI, RN-13, IN-10]
 *
 * On PostgreSQL 18.6 and PGlite 0.5.10, each a new database that startup opened before it asked the node for block 0
 * (`core-chain`'s `checkChain`): in this process (`startup-stop-harness.ts`), and through the bundled command in a
 * child process with a real SIGTERM. Also a private process whose startup waits for its public side (a core transport
 * that never answers) ends at its stop. The committed negative control is `startup-stop.negative-control.test.ts`.
 * [IN-3]
 */

/** No problem on either backend. */
const NONE = Object.fromEntries(PROCESS_BACKENDS.map((backend) => [backend.name, []]));

/** Each run: the startup until it retries, the bound, the watch, and the clean-up; a loaded machine. */
const RUN_TIMEOUT_MS = 2 * PATIENCE_MS + 120_000;

describe("A167: a stop during startup with the node unreachable ends the process (RN-13, task 5.3b)", () => {
  let project: CliProject;
  beforeAll(async () => {
    const built = cliProject({ cli: true });
    // Awaited below; a failure meanwhile is not left unhandled.
    built.catch(() => undefined);
    await Promise.all(PROCESS_BACKENDS.map((backend) => backend.start()));
    project = await built;
  }, 240_000);
  afterAll(async () => {
    project?.remove();
    await Promise.all(PROCESS_BACKENDS.map((backend) => backend.stop()));
  }, 60_000);

  it.each<[StopBy, string]>([
    ["stop", "ProcessHandle.stop()"],
    ["sigterm", "SIGTERM (terminationSignal)"],
  ])(
    "A167: %s — %s while startup retries an unreachable node for block 0 ends the process within 5 s: stopping, ended by the signal, the node client closed, no connection attempt after the stop, the database closed; on PostgreSQL and on PGlite",
    async (by) => {
      const found: Record<string, string[]> = {};
      for (const backend of PROCESS_BACKENDS) {
        const observed = await a167Run(backend, await backend.database(), by);
        const clients = observed.clients === 1 ? [] : [`the process made ${observed.clients} node clients, not 1`];
        found[backend.name] = [...a167Problems(observed), ...clients];
      }
      expect(found).toEqual(NONE);
    },
    2 * RUN_TIMEOUT_MS,
  );

  it(
    "RN-13 (task 5.3b): a private process whose startup waits for a core transport that never answers ends at its stop within 5 s, on PostgreSQL and on PGlite",
    async () => {
      const found: Record<string, string[]> = {};
      for (const backend of PROCESS_BACKENDS) {
        found[backend.name] = privateProblems(await privateRun(backend, await backend.database()));
      }
      expect(found).toEqual(NONE);
    },
    2 * RUN_TIMEOUT_MS,
  );

  it(
    "A167: umbradb run (the bundled command, a child process) — one SIGTERM while startup retries an unreachable node — exits 0 by itself within 5 s, its admin listener closed; on PostgreSQL and on PGlite",
    async () => {
      let files = 0;
      const found: Record<string, string[]> = {};
      const logs: string[] = [];
      for (const backend of PROCESS_BACKENDS) {
        const db = await backend.database();
        files += 1;
        const name = `a167-${files}.config.ts`;
        const node = `ws://127.0.0.1:${await freePort()}`;
        project.write(
          name,
          [
            `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
            "export const modules = [];",
            `export default defineConfig({ entries: [coreEntry({ start: 1, config: ${runCoreSettings(db.setting, node, { backoffCeilingMs: CEILING_MS })} })] });`,
            "",
          ].join("\n"),
        );
        const run = runInChild(project, ["--config", name]);
        try {
          const port = await run.adminPort(PATIENCE_MS);
          const origin = `http://127.0.0.1:${port}`;
          const before = await statusWhen(
            origin,
            (body) =>
              body.state === "starting" &&
              body.conditions.some((condition) => condition.code === "node-retrying" && Number(condition.attempts) >= 2),
            PATIENCE_MS,
          );
          expect(before.reason, backend.name).toBeNull();
          const from = performance.now();
          run.child.kill("SIGTERM");
          const code = await Promise.race([run.exited, sleep(STOP_LIMIT_MS, null)]);
          const ms = performance.now() - from;
          const problems: string[] = [];
          if (code === null) problems.push(`umbradb run did not exit within ${STOP_LIMIT_MS} ms of its SIGTERM`);
          else if (code !== 0 || run.child.signalCode !== null) {
            problems.push(`umbradb run ended with ${code} (${run.child.signalCode}) after ${Math.round(ms)} ms, not exit 0`);
          }
          if (/startup refused|processing halted/.test(run.stderr())) problems.push("umbradb run logged a refusal or a halt");
          // Nothing listens once it exited: the admin listener closed with the process.
          if (code !== null && (await ask(origin, "/health/live")).status !== null) {
            problems.push("the admin listener still answered after the exit");
          }
          found[backend.name] = problems;
          if (problems.length > 0) logs.push(`${backend.name}:\n${run.stderr().slice(-3000)}`);
        } finally {
          if (run.child.exitCode === null && run.child.signalCode === null) run.child.kill("SIGKILL");
          await run.exited;
        }
      }
      expect(found, logs.join("\n")).toEqual(NONE);
    },
    2 * RUN_TIMEOUT_MS,
  );
});
