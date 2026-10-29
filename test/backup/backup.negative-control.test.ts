import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  hashOf,
  heightsAt,
  startTicker,
  tableHeights,
  tickerModule,
  writeTickerConfig,
} from "./backup-fixtures.js";

/**
 * The consistent backup's committed negative control: the same backup as `./backup.test.ts`'s "while blocks commit", on
 * PostgreSQL 18.6 and PGlite 0.5.10, but with the dump taken outside the manifest's snapshot (`BackupSeams`'
 * `outsideSnapshot`: the manifest's facts read and their read ended, ten more blocks committed, then the dump in a
 * snapshot of its own). Loaded into a new database, its tables are at another height than its manifest, and its
 * contents hash is not the manifest's. That is what the consistent-backup test would see if the backup did not take
 * both in one snapshot (PostgreSQL) or one job (PGlite). [A124, BK-1]
 */

const TEST_TIMEOUT_MS = 900_000;
const HEAD = 600n;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-backups-control-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  process.env.UMBRADB_PG_DUMP = (BACKUP_BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

describe.each(BACKUP_BACKENDS)("A124's negative control on $name", (backend) => {
  it(
    "a backup whose dump is taken outside the manifest's snapshot, while blocks commit, holds its tables at another " +
      "height than its manifest",
    async () => {
      const db = await backend.database();
      const ticker = await startTicker(writeTickerConfig(project, { database: db.setting }), 1n);
      const out = join(dir, `${backend.kind}-outside.backup`);
      let manifest;
      try {
        await ticker.handle.started;
        ticker.feed(HEAD);
        await ticker.reach(40n);
        const between = async () => {
          await ticker.reach((ticker.handle.status().cursor as bigint) + 10n);
        };
        ({ manifest } = await ticker.handle.backup(out, { outsideSnapshot: { between } }));
      } finally {
        await ticker.handle.stop();
      }
      const loaded = await backend.load(out);
      const heights = await tableHeights(loaded);
      expect(heights).not.toEqual(heightsAt(manifest.height));
      expect(BigInt(heights.rows as string)).toBeGreaterThanOrEqual(BigInt(manifest.height) + 10n);
      expect(BigInt(heights.blocks as string)).toBeGreaterThan(BigInt(manifest.height));
      expect(await hashOf(loaded)).not.toBe(manifest.contentsHash);
    },
    TEST_TIMEOUT_MS,
  );
});
