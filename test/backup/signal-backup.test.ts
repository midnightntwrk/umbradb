import type { ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT } from "../../src/cli/command.js";
import { statusWhen } from "../admin/admin-harness.js";
import { spawnChild } from "../child-processes.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { chainNode, exitWithin, runCoreSettings, runInChild } from "../cli/run-fixtures.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  hashOf,
  heightsAt,
  manifestOf,
  PATIENCE_MS,
  tableHeights,
  tickerModule,
} from "./backup-fixtures.js";
import { recorderModule, writePausableConfig } from "./pause-fixtures.js";
import { chain, restoreRun } from "./restore-fixtures.js";
import type { SignalEvent, SignalJob } from "./signal-backup.worker.js";

/**
 * A163 `[CI]` with a real signal (task 15.1a; BK-1's scenario "A backup of a running PGlite process", CF-4's
 * `backupOnSignal`, RN-13; owner decision Q152 B): a process of its own on PGlite (`./signal-backup.worker.ts`, started
 * as `umbradb run` starts one, its chain finalizing a block every 20 ms) receives SIGUSR2 from the test while blocks
 * commit, writes a backup at its next pause, goes on from the next height, and ends on SIGTERM; the file restores with
 * `umbradb restore` like any other, every check of BK-3 passing. Then the command itself: `umbradb run` (the bundled
 * command, a tape node's chain) on PGlite given SIGUSR2 from outside writes the backup, keeps running, and exits 0 on
 * SIGTERM — the way to back up a running PGlite indexer from a shell.
 */

const WORKER = fileURLToPath(new URL("./signal-backup.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));

/** Each test waits on purpose for processes (task 0.5's notes): its own budget, for a loaded machine. */
const TEST_TIMEOUT_MS = 900_000;

const PGLITE = BACKUP_BACKENDS[1] as BackupBackend;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject({ cli: true });
  project.write("ticker.ts", tickerModule(project.builders));
  project.write("recorder.ts", recorderModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-signal-"));
  await PGLITE.start();
}, 300_000);

afterAll(async () => {
  await PGLITE.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

/** A worker process and what it reported. */
interface Worker {
  readonly child: ChildProcess;
  readonly events: SignalEvent[];
  lines(): string[];
  cursor(): bigint | null;
  readonly exited: Promise<{ readonly code: number | null; readonly signal: NodeJS.Signals | null }>;
  /** Waits until `ready()`, failing once the worker ended or `PATIENCE_MS` passed. */
  until(ready: () => boolean, what: string): Promise<void>;
}

function startWorker(job: SignalJob): Worker {
  const child = spawnChild(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const events: SignalEvent[] = [];
  let stderr = "";
  child.stderr!.on("data", (chunk: Buffer) => {
    stderr += chunk.toString();
  });
  createInterface({ input: child.stdout! }).on("line", (line) => {
    if (line.startsWith("{")) events.push(JSON.parse(line) as SignalEvent);
  });
  const exited = once(child, "close").then(() => ({ code: child.exitCode, signal: child.signalCode }));
  const lines = () => events.flatMap((event) => (event.event === "log" ? [event.line] : []));
  return {
    child,
    events,
    exited,
    lines,
    cursor() {
      const last = events.findLast((event) => event.event === "cursor");
      return last?.event === "cursor" ? BigInt(last.height) : null;
    },
    async until(ready, what) {
      const deadline = Date.now() + PATIENCE_MS;
      while (!ready()) {
        if (child.exitCode !== null || child.signalCode !== null || Date.now() > deadline) {
          throw new Error(`not ${what}; events ${JSON.stringify(events.slice(-8))}; stderr ${stderr.slice(-2000)}`);
        }
        await sleep(20);
      }
    },
  };
}

describe("A163: a real SIGUSR2 to a running PGlite process (BK-1, Q152 B)", () => {
  it(
    "A163: SIGUSR2 while blocks commit writes a backup at the next pause; the process goes on, ends on SIGTERM, and " +
      "the file restores like any other, every check of BK-3 passing",
    async () => {
      const db = await PGLITE.database();
      const out = join(dir, "real.backup");
      const config = writePausableConfig(project, { database: db.setting, extra: { backupOnSignal: out } });
      const worker = startWorker({ configFile: config, feedMs: 20 });
      let height: bigint;
      try {
        await worker.until(() => (worker.cursor() ?? 0n) >= 20n, "at height 20");
        expect(worker.lines()).toContain(`SIGUSR2 writes a backup to ${out} at the loop's next pause (backupOnSignal)`);
        worker.child.kill("SIGUSR2");
        const prefix = `backup on signal written to ${out}: height `;
        await worker.until(() => worker.lines().some((line) => line.startsWith(prefix)), "the backup written");
        height = BigInt(/^backup on signal written to .*: height (\d+), /.exec(worker.lines().find((l) => l.startsWith(prefix)) as string)?.[1] as string);
        // It goes on: blocks keep committing after the backup.
        await worker.until(() => (worker.cursor() ?? 0n) >= height + 5n, `at height ${height + 5n}`);
        worker.child.kill("SIGTERM");
        expect(await worker.exited).toEqual({ code: 0, signal: null });
      } finally {
        worker.child.kill("SIGKILL");
      }
      expect(worker.events).toContainEqual({ event: "closed", ended: "signal" });
      const lines = worker.lines();
      const asked = lines.indexOf(`SIGUSR2: a backup to ${out} at the loop's next pause`);
      expect(asked).toBeGreaterThanOrEqual(0);
      expect(lines.indexOf(`backup on signal: processing paused at height ${height}`)).toBeGreaterThan(asked);
      expect(lines.some((line) => /^backup on signal failed/.test(line))).toBe(false);
      const manifest = manifestOf(out);
      expect(manifest.height).toBe(String(height));
      const target = await PGLITE.database();
      const head = height + 100n;
      const restored = await restoreRun(project, out, writePausableConfig(project, { database: target.setting }), chain(head));
      expect(restored.stderr).toBe("");
      expect(restored.code).toBe(EXIT.ok);
      expect(await tableHeights(target)).toEqual(heightsAt(manifest.height));
      expect(await hashOf(target)).toBe(manifest.contentsHash);
    },
    TEST_TIMEOUT_MS,
  );

  it("umbradb run on PGlite with backupOnSignal: SIGUSR2 from a shell writes the backup, the command keeps running and exits 0 on SIGTERM", async () => {
    const tape = await chainNode();
    const directory = join(dir, "run-db");
    const out = join(dir, "run.backup");
    const config = project.write(
      "signal-run.config.ts",
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        `const core = coreEntry({ start: 1, config: ${runCoreSettings(`pglite:${directory}`, tape.url, { backupOnSignal: out })} });`,
        "export default defineConfig({ entries: [core] });",
        "",
      ].join("\n"),
    );
    try {
      const run = runInChild(project, ["--config", config]);
      try {
        const port = await run.adminPort(PATIENCE_MS);
        await statusWhen(
          `http://127.0.0.1:${port}`,
          (body) => {
            if (body.state === "refused" || body.state === "halted") throw new Error(`the process ${body.state}`);
            return body.cursor !== null && BigInt(body.cursor) >= 5n;
          },
          PATIENCE_MS,
        );
        run.child.kill("SIGUSR2");
        const deadline = Date.now() + PATIENCE_MS;
        while (!run.stderr().includes(`backup on signal written to ${out}: height 5, contents hash `)) {
          if (run.child.exitCode !== null || Date.now() > deadline) throw new Error(`no backup written:\n${run.stderr()}`);
          await sleep(25);
        }
        expect(run.child.exitCode).toBeNull();
        run.child.kill("SIGTERM");
        expect(await exitWithin(run, PATIENCE_MS)).toBe(EXIT.ok);
        expect(run.stderr()).not.toMatch(/startup refused|processing halted|backup on signal failed/);
      } finally {
        run.child.kill("SIGKILL");
      }
    } finally {
      await tape.close();
    }
    expect(manifestOf(out)).toMatchObject({ height: "5", tool: { name: "pglite-tools" } });
  }, TEST_TIMEOUT_MS);
});
