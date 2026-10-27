import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT } from "../../src/cli/command.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { BACKUP_BACKENDS, type BackupBackend, startTicker, tickerModule, writeTickerConfig } from "../backup/backup-fixtures.js";
import { backupAt, chain, restoreRun, restoreTarget } from "../backup/restore-fixtures.js";

/**
 * A147's backup part (MD-1, BK-2; owner decision Q76; task 15.2), the last part of `design.md` §4's component-table row
 * of the opt-out (`./component-table.test.ts`), on PostgreSQL 18.6 and PGlite 0.5.10 — the backups' backends
 * (`../backup/backup-fixtures.ts`: `pg_dump` from the pinned image, `pglite-tools`): a table declared `deterministic:
 * false`, with a `serial` key and a `now()` time (`ticker.log`), travels in a backup with its rows and its sequence's
 * position; restored and continued, its rows are the backup's and the next `serial` values follow the restored ones.
 */

const TEST_TIMEOUT_MS = 900_000;
const H = 12n;
const BACKENDS: readonly BackupBackend[] = BACKUP_BACKENDS;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-opt-out-backup-"));
  await Promise.all(BACKENDS.map((backend) => backend.start()));
  process.env.UMBRADB_PG_DUMP = (BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

const LOG_SQL = "SELECT id::text, height::text, at::text FROM ticker.log ORDER BY id";

describe.each(BACKENDS)("A147: a table declared deterministic: false through a backup, on $name (backup part)", (backend) => {
  it(
    "A147: a backup carries its rows and its sequence's position, so after a restore the next serial value follows " +
      "the restored ones",
    async () => {
      const { file, source } = await backupAt(project, backend, H, join(dir, `${backend.kind}.backup`));
      const { db, config } = await restoreTarget(project, backend);
      const restored = await restoreRun(project, file, config, chain(H + 20n));
      expect(restored.code).toBe(EXIT.ok);
      const rows = await source.query(LOG_SQL);
      expect(rows).toHaveLength(Number(H));
      expect(await db.query(LOG_SQL)).toEqual(rows);
      const [sequence] = await db.query("SELECT last_value::text AS last, is_called FROM ticker.log_id_seq");
      expect(sequence).toEqual({ last: String(H), is_called: true });
      const end = H + 8n;
      const ticker = await startTicker(writeTickerConfig(project, { database: db.setting, stop: Number(end) }), end + 2n);
      try {
        expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: end });
      } finally {
        await ticker.handle.stop();
      }
      const after = await db.query("SELECT id::text, height::text FROM ticker.log WHERE height > " + String(H) + " ORDER BY id");
      expect(after).toEqual(
        Array.from({ length: Number(end - H) }, (_, i) => ({ id: String(Number(H) + 1 + i), height: String(Number(H) + 1 + i) })),
      );
    },
    TEST_TIMEOUT_MS,
  );
});
