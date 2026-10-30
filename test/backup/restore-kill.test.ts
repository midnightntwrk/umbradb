import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT } from "../../src/cli/command.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, hashOf, killedRestore, manifestOf, tickerModule } from "./backup-fixtures.js";
import { backupAt, chain, emptied, restoreRun, restoreTarget } from "./restore-fixtures.js";

/**
 * On PostgreSQL 18.6 and PGlite 0.5.10: `umbradb restore`'s work in a process of its own (`./restore-kill.worker.ts`),
 * killed with SIGKILL while it runs the file's SQL — 20 statements in, inside its one transaction —, leaves the target
 * empty, and a new restore into it then succeeds. [A127 FAULT, BK-3]
 *
 * Its committed negative control (the statements each committed on their own) is `./restore.negative-control.test.ts`.
 */

const TEST_TIMEOUT_MS = 900_000;
const H = 12n;
const HEAD = 40n;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-restore-kill-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  process.env.UMBRADB_PG_DUMP = (BACKUP_BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

describe.each(BACKUP_BACKENDS)("A127: a restore killed while loading on $name (BK-3)", (backend) => {
  it(
    "A127: a restore killed while running the file's SQL leaves the target empty, and a new restore into it then succeeds",
    async () => {
      const { file } = await backupAt(project, backend, H, join(dir, `${backend.kind}.backup`));
      const { db, config } = await restoreTarget(project, backend);
      const killed = await killedRestore({ file, config, cwd: project.dir, head: Number(HEAD), killAt: 20 });
      expect(killed.signal).toBe("SIGKILL");
      expect(killed.stdout).toBe("loading 20\n");
      expect(await emptied(backend, db)).toBe(true);
      const again = await restoreRun(project, file, config, chain(HEAD));
      expect(again.stderr).toBe("");
      expect(again.code).toBe(EXIT.ok);
      expect(await hashOf(db)).toBe(manifestOf(file).contentsHash);
    },
    TEST_TIMEOUT_MS,
  );
});
