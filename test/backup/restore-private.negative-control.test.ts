import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privateCursorHeight, readPrivateBinding } from "../../src/backbone/core-private-source/index.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend } from "./backup-fixtures.js";
import { emptied } from "./restore-fixtures.js";
import {
  BACKUP_HEIGHT,
  PRIVATE_START,
  privateBackup,
  privateHashOf,
  restorePrivate,
  startPrivateFile,
  startPublicSide,
  pmModule,
  writePrivateConfig,
} from "./restore-private.js";

/**
 * The committed negative control of task 15.2a's restore of a private process's backup (BK-3, PP-2, PP-12; A164), on
 * PostgreSQL 18.6 and PGlite 0.5.10: the restore with the comparison of the binding the backup records taken away
 * (`RestoreSeams.skip.binding`) — what A164's test would see without it. A private process's backup taken against one
 * public database (S 1), restored against another of the same chain (S 2), commits: the restored database is bound to
 * the first, and the private process then started on it against the second refuses at startup with
 * `private-binding-mismatch` (`start`), where the guarded restore refused it and left the target empty.
 */

const TEST_TIMEOUT_MS = 900_000;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("pm.ts", pmModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-private-restore-control-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  process.env.UMBRADB_PG_DUMP = (BACKUP_BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

describe.each(BACKUP_BACKENDS)("the private restore's negative control on $name", (backend) => {
  it("a restore that skips the binding check accepts another public database's backup", async () => {
    const { bound, file, manifest } = await privateBackup(project, backend, join(dir, `${backend.kind}-control.backup`));
    const other = await startPublicSide(backend, { head: BACKUP_HEIGHT, start: 2 });
    try {
      const guarded = await backend.database();
      const guardedConfig = { database: guarded.setting, start: PRIVATE_START, public: other.setting };
      const refused = await restorePrivate(project, file, writePrivateConfig(project, guardedConfig));
      expect(refused).toMatchObject({ error: { code: "private-binding-mismatch", details: { reason: "start" } } });
      expect(await emptied(backend, guarded)).toBe(true);

      const db = await backend.database();
      const config = writePrivateConfig(project, { database: db.setting, start: PRIVATE_START, public: other.setting });
      const accepted = await restorePrivate(project, file, config, { restore: { skip: { binding: true } } });
      expect(accepted, accepted.line).toMatchObject({ restored: true });
      expect(await privateHashOf(db)).toBe(manifest.contentsHash);
      // Bound to the backup's public database (S 1), not to the one it was restored against (S 2).
      const binding = await db.read((read) => readPrivateBinding(read), privateCursorHeight);
      expect(binding?.start).toBe(1n);

      const started = await startPrivateFile(config);
      try {
        await expect(started.handle.started).rejects.toMatchObject({
          code: "private-binding-mismatch",
          details: { reason: "start", recorded: "1", public: "2" },
        });
      } finally {
        await started.handle.stop();
      }
    } finally {
      await other.core.stop();
      await bound.core.stop();
    }
  }, TEST_TIMEOUT_MS);
});
