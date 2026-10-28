import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { ask, startWithAdmin } from "../admin/admin-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";

/**
 * A170's process half (task 4.5; CF-4; owner decision Q167 A), on PostgreSQL 18.6 and PGlite 0.5.10: a process whose
 * `database` is given as parts starts and commits; `/config` shows its host, port, user, name and `ssl` (PostgreSQL) or
 * its `path` (PGlite), and the password only as `[redacted]`; the log names the database the same way (`database:
 * postgres <user>@<host>:<port>/<name> (ssl disable)`, `database: pglite <path>`) and never the password. On
 * PostgreSQL the process logs in as a login of its own whose password is distinctive, so that a password anywhere in
 * `/config`'s body or the log is found. The schema half (a connection string refused with its path, the parts'
 * defaults) is `./database-parts.test.ts`; `config check --database` reading the configured database is A35's
 * `../cli/config-check-database.test.ts`.
 */

/** The PostgreSQL login of the process: a superuser (the writer's privileges, Q90) with a distinctive password. */
const LOGIN = "a170_writer";
const PASSWORD = "pw-a170-process";

describe.each(PROCESS_BACKENDS)("A170: a process on the database's parts, on $name", (backend: ProcessBackend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 180_000);

  it("starts and commits; /config and the log show every part but the password, which reads [redacted]", async () => {
    const db = await backend.database();
    let database: DatabaseParts = db.setting;
    if (db.setting.kind === "postgres") {
      await db.query(`CREATE ROLE ${LOGIN} LOGIN SUPERUSER PASSWORD '${PASSWORD}'`);
      database = { ...db.setting, user: LOGIN, password: PASSWORD };
    }
    const run = startWithAdmin({ database, head: 3n, extra: { developmentOptIn: true } });
    try {
      await run.handle.started;
      const config = await ask(await run.origin(), "/config");
      expect(config.status).toBe(200);
      const shown = (config.json as { core: { settings: { database: unknown } } }).core.settings.database;
      if (database.kind === "postgres") {
        const { host, port, name } = database;
        expect(shown).toEqual({ kind: "postgres", host, port, user: LOGIN, password: "[redacted]", name, ssl: "disable" });
        expect(run.lines).toContain(`database: postgres ${LOGIN}@${host}:${port}/${name} (ssl disable)`);
      } else {
        expect(shown).toEqual(database);
        expect(run.lines).toContain(`database: pglite ${(database as { path: string }).path}`);
      }
      expect(config.text).not.toContain(PASSWORD);
      expect(run.lines.join("\n")).not.toContain(PASSWORD);
      // It committed: the cursor reached the chain's head.
      for (let attempt = 0; run.handle.status().cursor !== 3n; attempt++) {
        if (attempt > 2_000) throw new Error(`the process did not commit block 3: ${run.handle.status().state}`);
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    } finally {
      await run.handle.stop();
    }
  }, 300_000);
});
