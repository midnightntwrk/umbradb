import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { runInChild } from "../cli/run-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, PATIENCE_MS, tickerModule } from "./backup-fixtures.js";
import { type Pausable, recorderModule, startPausable, writePausableConfig } from "./pause-fixtures.js";
import { listenerProblems, pacedNode, sigusr2Ignored, writeRunConfig } from "./signal-ignored-fixtures.js";

/**
 * A175 `[CI]` (task 15.1c; BK-1 as amended, its scenario "SIGUSR2 to `umbradb run` without `backupOnSignal`"; owner
 * decision Q173 C): `umbradb run` — the bundled command, in a child process — on PGlite without `backupOnSignal`, sent
 * SIGUSR2 from outside while blocks commit (a tape node's chain answered slowly, so heights keep committing), logs one
 * line naming the signal and `backupOnSignal`, writes no file, keeps committing heights and exits 0 on SIGTERM
 * (`./signal-ignored-fixtures.ts`'s `sigusr2Ignored`). A process a host program starts with `startProcess` without
 * `backupOnSignal` adds no SIGUSR2 listener while it starts, runs or closes (`listenerProblems`), so Node.js's default or
 * the host's own handler applies; with `backupOnSignal` it adds one while it runs (task 15.1a), which shows the count
 * sees the process's listener. The negative controls are `./signal-ignored.negative-control.test.ts`.
 */

/** Each test waits on purpose for processes (task 0.5's notes): its own budget, for a loaded machine. */
const TEST_TIMEOUT_MS = 900_000;

const PGLITE = BACKUP_BACKENDS[1] as BackupBackend;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject({ cli: true });
  project.write("ticker.ts", tickerModule(project.builders));
  project.write("recorder.ts", recorderModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-sigusr2-"));
  await PGLITE.start();
}, 300_000);

afterAll(async () => {
  await PGLITE.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

describe("A175: SIGUSR2 without backupOnSignal (BK-1, Q173 C)", () => {
  it(
    "A175: umbradb run on PGlite without backupOnSignal, sent SIGUSR2 while blocks commit, logs one line naming the " +
      "signal and backupOnSignal, writes no file, keeps committing heights and exits 0 on SIGTERM",
    async () => {
      const node = await pacedNode();
      const cwd = join(dir, "command");
      mkdirSync(cwd);
      try {
        const config = writeRunConfig(project, "ignored-run.config.ts", { kind: "pglite", path: join(cwd, "db") }, node.url);
        const run = runInChild(project, ["--config", config], cwd);
        await sigusr2Ignored(run, cwd, "db", PATIENCE_MS);
        expect(run.stderr()).toMatch(/^SIGUSR2 ignored: backupOnSignal is not set, so no backup is written$/m);
        expect(run.stderr()).not.toMatch(/startup refused|processing halted/);
      } finally {
        await node.close();
      }
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A175: a process started with startProcess without backupOnSignal adds no SIGUSR2 listener; with it, one while " +
      "it runs",
    async () => {
      const pausable = (extra: Readonly<Record<string, unknown>>) => {
        let run: Pausable | undefined;
        return {
          async start() {
            const db = await PGLITE.database();
            run = await startPausable(writePausableConfig(project, { database: db.setting, extra }), { head: 6n });
          },
          running: async () => (run as Pausable).reach(3n),
          stop: async () => (run as Pausable).handle.stop(),
        };
      };
      expect(await listenerProblems(pausable({}))).toEqual([]);
      expect(await listenerProblems(pausable({ backupOnSignal: join(dir, "listened.backup") }), 1)).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );
});
