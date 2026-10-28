import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { EXIT } from "../../src/cli/command.js";
import { openPostgres } from "../../src/db/postgres.js";
import type { ReadHandle } from "../../src/db/api.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { startPostgresServer, type PostgresTestServer } from "../db/postgres-server.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  type BackupDatabase,
  catalogOf,
  hashOf,
  manifestOf,
  startTicker,
  tickerModule,
  writeTickerConfig,
} from "./backup-fixtures.js";
import { backupAt, chain, codeIn, emptied, restoreRun } from "./restore-fixtures.js";
import { connectionOfUrl, partsOfUrl } from "../db/connection.js";

/**
 * A125's owners and grants with a login that is not a superuser (task 15.2; BK-3, DB-6, DB-7, decision record Q90), on a
 * PostgreSQL 18.6 server of its own, where no module role exists yet: a login without `CREATEROLE` is refused — the
 * restore rolled back, the target empty —, and a `CREATEROLE` login restores, creating the module roles and granting
 * itself their use, as startup's `prepareSchemas` would; its restored database's catalogs equal those of a database it
 * built by migrations. The backup is one PGlite wrote (`umbradb backup` needs no `pg_dump` for it).
 */

const TEST_TIMEOUT_MS = 900_000;
const H = 12n;

let project: CliProject;
let dir: string;
let server: PostgresTestServer;
const PGLITE = BACKUP_BACKENDS[1] as BackupBackend;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  dir = mkdtempSync(join(tmpdir(), "umbradb-restore-login-"));
  [server] = await Promise.all([startPostgresServer(), PGLITE.start()]);
}, 300_000);

afterAll(async () => {
  await Promise.all([server?.stop(), PGLITE.stop()]);
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

/** A database of the server, read and written as `login`. */
async function databaseAs(login: string): Promise<BackupDatabase> {
  const created = await server.createDatabase();
  await created.exec(`GRANT CREATE ON DATABASE ${new URL(created.url).pathname.slice(1)} TO ${login}`);
  const url = new URL(created.url);
  url.username = login;
  url.password = login;
  const setting = partsOfUrl(url.toString());
  const read = async <T>(body: (r: ReadHandle) => Promise<T>) => {
    const db = openPostgres({ connection: connectionOfUrl(url.toString()), committedHeight: cursorHeight, readConnections: 1 });
    try {
      return await db.read(body);
    } finally {
      await db.close();
    }
  };
  return { setting, read, query: (sql) => read((r) => r.query(sql)) };
}

describe("A125: a restore by a login that is not a superuser (Q90)", () => {
  it(
    "A125: a CREATEROLE login restores, creating the module roles, with the owners and grants of a database it built " +
      "by migrations; a login without CREATEROLE is refused, the target empty",
    async () => {
      const root = postgres(server.container.getConnectionUri(), { max: 1, onnotice: () => undefined });
      try {
        await root.unsafe("CREATE ROLE plain_login LOGIN PASSWORD 'plain_login'");
        await root.unsafe("CREATE ROLE restorer LOGIN CREATEROLE PASSWORD 'restorer'");
      } finally {
        await root.end({ timeout: 5 });
      }
      const { file } = await backupAt(project, PGLITE, H, join(dir, "pglite.backup"));
      const backend = { kind: "postgres" } as BackupBackend;

      const plain = await databaseAs("plain_login");
      const refused = await restoreRun(project, file, writeTickerConfig(project, { database: plain.setting }), chain(40n));
      expect(refused.code).toBe(EXIT.failed);
      expect(codeIn(refused.stderr)).toBe("invalid-configuration");
      expect(refused.stderr).toContain("lacks CREATEROLE");
      expect(await emptied(backend, plain)).toBe(true);

      const target = await databaseAs("restorer");
      const restored = await restoreRun(project, file, writeTickerConfig(project, { database: target.setting }), chain(40n));
      expect(restored.stderr).toBe("");
      expect(restored.code).toBe(EXIT.ok);
      expect(await hashOf(target)).toBe(manifestOf(file).contentsHash);

      const reference = await databaseAs("restorer");
      const ticker = await startTicker(writeTickerConfig(project, { database: reference.setting, stop: Number(H) }), H + 5n);
      try {
        expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: H });
      } finally {
        await ticker.handle.stop();
      }
      expect(await catalogOf(target)).toEqual(await catalogOf(reference));
    },
    TEST_TIMEOUT_MS,
  );
});
