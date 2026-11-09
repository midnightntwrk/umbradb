import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readManifestLine } from "../../src/backup/manifest.js";
import { EARLIER_BUILD, earlierBackup, earlierRefusalProblems, type FoldedPart } from "../backbone/earlier-build.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend } from "./backup-fixtures.js";
import { emptied } from "./restore-fixtures.js";
import { ledgerBackup, ledgerChain, restoreLedger } from "./restore-ledger.js";
import { PRIVATE_START, pmModule, privateBackup, restorePrivate, writePrivateConfig } from "./restore-private.js";

/**
 * A backup written by an earlier build is refused by the restore with `backup-build-mismatch`, on PostgreSQL 18.6 and
 * PGlite 0.5.10: its recorded migrations of `core-chain`, `core-ledger-state` or `core-private-source` are that build's
 * `001` and `002` (`../backbone/earlier-build.ts`), and this build declares one migration, `001`, with another
 * checksum. The refusal is the build check before loading (the restore's `checkRecordedMigrations`): it names
 * the part, `001` and both checksums, and the target stays empty.
 *
 * The backups are this build's own, rewritten as an earlier build would have written them (the manifest's rows and the
 * dump's): a ledger process's (`./restore-ledger.ts`: `core-chain` and `core-ledger-state`), restored by the restore
 * itself, and a private process's (`./restore-private.ts`: `core-private-source`), restored by `umbradb restore`'s own
 * work with its configuration file.
 */

const TEST_TIMEOUT_MS = 900_000;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("pm.ts", pmModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-earlier-build-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  // The processes' own backups find pg_dump as the command does: the pinned image's (`./backup-fixtures.ts`).
  process.env.UMBRADB_PG_DUMP = (BACKUP_BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

let files = 0;

/** `file`'s backup with `part`'s recorded migrations an earlier build's, written to a new file; its path. */
function earlierFile(file: string, part: FoldedPart): string {
  const text = readFileSync(file, "utf8");
  const rewritten = earlierBackup(text, part);
  const manifest = readManifestLine(rewritten.slice(0, rewritten.indexOf("\n")));
  const rows = manifest.migrations.filter((row) => row.module === part).map((row) => `${row.migration}:${row.checksum}`);
  expect(rows).toEqual([`001:${EARLIER_BUILD[part][0]}`, `002:${EARLIER_BUILD[part][1]}`]);
  for (const checksum of EARLIER_BUILD[part]) expect(rewritten.slice(rewritten.indexOf("\n"))).toContain(checksum);
  const path = join(dir, `earlier-${part}-${++files}.backup`);
  writeFileSync(path, rewritten, { mode: 0o600 });
  return path;
}

describe.each(BACKUP_BACKENDS)("a backup written by an earlier build, on $name", (backend) => {
  it(
    "a ledger backup carrying an earlier build's migrations of core-chain or core-ledger-state is refused with " +
      "backup-build-mismatch, naming the part, 001 and both checksums, the target empty; this build's own restores",
    async () => {
      const scenario = await ledgerChain();
      const backup = await ledgerBackup(await backend.database(), scenario);
      for (const part of ["core-chain", "core-ledger-state"] as const) {
        const target = await backend.database();
        const error = await restoreLedger(backend, target, { ...backup, file: earlierFile(backup.file, part) }, scenario.records).then(
          () => null,
          (caught: unknown) => caught,
        );
        expect(earlierRefusalProblems(error, part, "backup-build-mismatch"), part).toEqual([]);
        expect(await emptied(backend, target), part).toBe(true);
      }
      // The backup as this build wrote it restores.
      const target = await backend.database();
      const restored = await restoreLedger(backend, target, backup, scenario.records);
      expect(restored.manifest.height).toBe(String(scenario.head));
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "a private process's backup carrying an earlier build's migrations of core-private-source is refused by " +
      "umbradb restore with backup-build-mismatch, naming the part, 001 and both checksums, the target empty",
    async () => {
      const { bound, file } = await privateBackup(project, backend, join(dir, `${backend.kind}-private.backup`));
      try {
        const db = await backend.database();
        const config = writePrivateConfig(project, { database: db.setting, start: PRIVATE_START, public: bound.setting });
        const refused = await restorePrivate(project, earlierFile(file, "core-private-source"), config);
        expect(refused.line).toMatch(/^umbradb restore: backup-build-mismatch: /);
        expect(earlierRefusalProblems(refused.restored ? null : refused.error, "core-private-source", "backup-build-mismatch")).toEqual([]);
        expect(await emptied(backend, db)).toBe(true);
      } finally {
        await bound.core.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
