import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { backupSignalRelay } from "../../src/cli/run.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, PATIENCE_MS, tickerModule } from "./backup-fixtures.js";
import { type Pausable, recorderModule, startPausable, writePausableConfig } from "./pause-fixtures.js";
import {
  listenerProblems,
  pacedNode,
  runWorkerInChild,
  sigusr2Ignored,
  type WorkerSignals,
  writeRunConfig,
} from "./signal-ignored-fixtures.js";

/**
 * A175's negative controls (task 15.1c; BK-1, owner decision Q173 C), each failing an oracle of
 * `./signal-ignored-fixtures.ts` that `./signal-ignored.test.ts` passes:
 *
 * - **A command that does not listen** — `runProcess` (`./signal-ignored.worker.ts`, the command's stand-in) whose
 *   SIGUSR2 reaches no listener, as task 15.1a shipped it without `backupOnSignal` — fails `sigusr2Ignored`: Node.js's
 *   default ends it at the signal. The same stand-in with the command's own signals passes, so the failure is the
 *   missing listener, not the stand-in.
 * - **A host program's process that listens anyway** — `startProcess` given the command's relay of SIGUSR2 (Q173's
 *   option B: every process listens) — fails `listenerProblems`: one SIGUSR2 listener more while it runs.
 */

const TEST_TIMEOUT_MS = 900_000;

const PGLITE = BACKUP_BACKENDS[1] as BackupBackend;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  project.write("recorder.ts", recorderModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-sigusr2-control-"));
  await PGLITE.start();
}, 300_000);

afterAll(async () => {
  await PGLITE.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

/** A175's oracle applied to the command's stand-in with `signals`. */
async function standIn(signals: WorkerSignals): Promise<void> {
  const node = await pacedNode();
  const cwd = join(dir, signals);
  mkdirSync(cwd);
  try {
    const config = writeRunConfig(project, `${signals}.config.ts`, { kind: "pglite", path: join(cwd, "db") }, node.url);
    await sigusr2Ignored(runWorkerInChild({ configFile: config, cwd, signals }), cwd, "db", PATIENCE_MS);
  } finally {
    await node.close();
  }
}

describe("A175 negative controls (BK-1, Q173 C)", () => {
  it(
    "the command's stand-in with its own signals passes A175's oracle",
    async () => {
      await standIn("command");
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "a command whose SIGUSR2 reaches no listener fails A175's oracle: the signal ends it",
    async () => {
      await expect(standIn("unconnected")).rejects.toThrow(/the command ended on SIGUSR2 \(exit null, signal SIGUSR2\)/);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "startProcess that listens for SIGUSR2 without backupOnSignal fails A175's listener count",
    async () => {
      let run: Pausable | undefined;
      let relay: ReturnType<typeof backupSignalRelay> | undefined;
      const problems = await listenerProblems({
        async start() {
          relay = backupSignalRelay(process, () => {});
          const db = await PGLITE.database();
          run = await startPausable(writePausableConfig(project, { database: db.setting }), {
            head: 6n,
            backupSignals: relay.signals,
          });
        },
        running: async () => (run as Pausable).reach(3n),
        async stop() {
          try {
            await (run as Pausable).handle.stop();
          } finally {
            relay?.dispose();
          }
        },
      });
      expect(problems).toEqual(["while it runs: 1 SIGUSR2 listeners added, not 0"]);
    },
    TEST_TIMEOUT_MS,
  );
});
