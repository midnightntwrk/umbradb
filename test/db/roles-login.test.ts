import { randomBytes } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { startDatabase } from "../../src/db/migrate.js";
import { planSchemas, prepareSchemas, type SchemaModule, type SchemaPlan, setModuleRole } from "../../src/db/roles.js";
import { guardTables } from "../../src/db/truncate-guard.js";
import { type PostgresTestDatabase, type PostgresTestServer, startPostgresServer } from "./postgres-server.js";

/**
 * What the writer's login must hold on PostgreSQL 18 (task 2.3, decision record Q90, `design.md` §4 "Roles"): a login
 * that is not a superuser but has `CREATEROLE` and `CREATE` on the database creates the module roles and schemas, grants
 * itself each role `WITH INHERIT TRUE, SET TRUE` (PostgreSQL 16 and later give its creator `ADMIN` only), and the roles
 * then guard as they do under a superuser (A13, A73); a login lacking a privilege, or facing a role another login
 * created, is refused with `invalid-configuration` (`reason: writer-privileges`) before anything is created. PGlite runs
 * as its superuser `postgres` only, so this is PostgreSQL's alone. Roles belong to the whole server, so each test uses
 * module ids of its own.
 */

let server: PostgresTestServer;

beforeAll(async () => {
  server = await startPostgresServer();
}, 180_000);

afterAll(async () => {
  await server?.stop();
});

function tableModule(id: string): SchemaModule {
  const schema = id.replace(/-/g, "_");
  return { id, requires: [], provides: [{ name: `${id}-rows`, table: { schema, tables: ["t"] } }], migrations: [] };
}

/** A login role made by the server's superuser, with `attributes`, and the API opened on `database` as that login. */
async function loginOn(
  database: PostgresTestDatabase,
  name: string,
  attributes: string,
  grantCreate: boolean,
): Promise<Database> {
  // A password made at run time: no secret in the repository.
  const password = randomBytes(16).toString("hex");
  await database.exec(`CREATE ROLE ${name} LOGIN ${attributes} PASSWORD '${password}'`);
  if (grantCreate) await database.exec(`GRANT CREATE ON DATABASE ${new URL(database.url).pathname.slice(1)} TO ${name}`);
  const url = new URL(database.url);
  url.username = name;
  url.password = password;
  return database.open({ url: url.toString() });
}

async function outcome(run: Promise<unknown>): Promise<unknown> {
  return run.then(
    () => "resolved",
    (error: unknown) => error,
  );
}

async function setUp(db: Database, plan: SchemaPlan, ids: readonly string[]): Promise<void> {
  await db.transaction((tx) => prepareSchemas(tx, plan));
  for (const id of ids) {
    const schema = id.replace(/-/g, "_");
    await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, id);
      await tx.execute(`CREATE TABLE ${schema}.t (k bigint PRIMARY KEY)`);
    });
  }
  await db.transaction((tx) => guardTables(tx, plan));
}

describe("a CREATEROLE login on PostgreSQL 18 (Q90)", () => {
  it("creates the roles, grants itself each WITH INHERIT TRUE, SET TRUE, and the roles guard as under a superuser", async () => {
    const database = await server.createDatabase();
    const db = await loginOn(database, "writer_one", "CREATEROLE", true);
    const plan = planSchemas([tableModule("login-a"), tableModule("login-b")]);
    await setUp(db, plan, ["login-a", "login-b"]);

    const [login] = await db.read((read) =>
      read.query("SELECT current_user AS name, rolsuper AS superuser FROM pg_roles WHERE rolname = current_user"),
    );
    expect(login).toEqual({ name: "writer_one", superuser: false });
    const memberships = await database.admin.unsafe<{ role: string; grantor: string; admin: boolean; inherit: boolean; set: boolean }[]>(`
      SELECT r.rolname AS role, g.rolname AS grantor, am.admin_option AS admin, am.inherit_option AS inherit,
             am.set_option AS set
        FROM pg_auth_members am JOIN pg_roles r ON r.oid = am.roleid JOIN pg_roles m ON m.oid = am.member
        JOIN pg_roles g ON g.oid = am.grantor
       WHERE m.rolname = 'writer_one' ORDER BY 1, 2`);
    expect([...memberships]).toEqual([
      { role: "umbradb_m_login_a", grantor: "test", admin: true, inherit: false, set: false },
      { role: "umbradb_m_login_a", grantor: "writer_one", admin: false, inherit: true, set: true },
      { role: "umbradb_m_login_b", grantor: "test", admin: true, inherit: false, set: false },
      { role: "umbradb_m_login_b", grantor: "writer_one", admin: false, inherit: true, set: true },
    ]);

    // A13 under this login: a's write into b's table is rejected and the transaction rolls back.
    const cross = (await outcome(
      db.transaction(async (tx) => {
        await setModuleRole(tx, plan, "login-a");
        await tx.execute("INSERT INTO login_a.t VALUES (1)");
        await tx.execute("INSERT INTO login_b.t VALUES (1)");
      }),
    )) as UmbraError;
    expect(cross).toBeInstanceOf(UmbraError);
    expect(cross.details.sqlstate).toBe("42501");
    // The login's read pool reads every module table (INHERIT): nothing was committed.
    expect(await db.read((read) => read.query("SELECT (SELECT count(*) FROM login_a.t)::int AS a, (SELECT count(*) FROM login_b.t)::int AS b"))).toEqual([
      { a: 0, b: 0 },
    ]);
    // A73 under this login: the TRUNCATE trigger was attached, and refuses in a block.
    const truncate = (await outcome(
      db.transaction(async (tx) => {
        await setModuleRole(tx, plan, "login-b");
        await tx.execute("TRUNCATE login_b.t");
      }),
    )) as UmbraError;
    expect(truncate).toBeInstanceOf(UmbraError);
    expect(truncate.code).toBe("truncate-not-allowed");
    // Startup again: nothing to create, nothing refused.
    await db.transaction((tx) => prepareSchemas(tx, plan));
  });

  it("migrates under it: core_chain.migrations is the login's, each module's tables its role's, readable by the other roles (task 2.4)", async () => {
    const database = await server.createDatabase();
    const db = await loginOn(database, "writer_migrate", "CREATEROLE", true);
    const parts = ["mig-a", "mig-b"].map((id) => {
      const schema = id.replace(/-/g, "_");
      return {
        ...tableModule(id),
        version: "1.0.0",
        migrations: [{ id: "001", sql: `CREATE TABLE ${schema}.t (k bigint PRIMARY KEY); INSERT INTO ${schema}.t VALUES (1)` }],
      };
    });
    const plan = planSchemas(parts);
    await startDatabase(db, { plan, parts, committedVersions: new Map() });
    const owners = await database.admin.unsafe<{ relation: string; owner: string }[]>(`
      SELECT c.oid::regclass::text AS relation, pg_get_userbyid(c.relowner) AS owner FROM pg_class c
       WHERE c.oid IN ('core_chain.migrations'::regclass, 'mig_a.t'::regclass, 'mig_b.t'::regclass) ORDER BY 1`);
    expect([...owners]).toEqual([
      { relation: "core_chain.migrations", owner: "writer_migrate" },
      { relation: "mig_a.t", owner: "umbradb_m_mig_a" },
      { relation: "mig_b.t", owner: "umbradb_m_mig_b" },
    ]);
    const seen = await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "mig-a");
      return tx.query("SELECT (SELECT count(*) FROM core_chain.migrations)::int AS rows, (SELECT count(*) FROM mig_b.t)::int AS b");
    });
    expect(seen).toEqual([{ rows: 2, b: 1 }]);
    // Startup again under the same login: nothing to apply, nothing refused.
    expect(await startDatabase(db, { plan, parts, committedVersions: new Map() })).toEqual([]);
  });

  it("uses a role the login created itself beforehand, holding ADMIN only, and grants itself SET and INHERIT", async () => {
    const database = await server.createDatabase();
    const db = await loginOn(database, "writer_early", "CREATEROLE", true);
    // As an operator might, ahead of the first start: the creator then holds the role WITH ADMIN only (PostgreSQL 16+).
    await db.transaction((tx) => tx.execute("CREATE ROLE umbradb_m_early_a NOLOGIN"));
    const plan = planSchemas([tableModule("early-a")]);
    await setUp(db, plan, ["early-a"]);
    const options = await database.admin.unsafe<{ inherit: boolean; set: boolean }[]>(`
      SELECT bool_or(am.inherit_option) AS inherit, bool_or(am.set_option) AS set
        FROM pg_auth_members am JOIN pg_roles r ON r.oid = am.roleid JOIN pg_roles m ON m.oid = am.member
       WHERE r.rolname = 'umbradb_m_early_a' AND m.rolname = 'writer_early'`);
    expect([...options]).toEqual([{ inherit: true, set: true }]);
    expect(await db.transaction(async (tx) => {
      await setModuleRole(tx, plan, "early-a");
      return tx.query("SELECT current_user AS role");
    })).toEqual([{ role: "umbradb_m_early_a" }]);
  });

  it("sets up under a superuser login that lacks the CREATEROLE attribute (a superuser needs none)", async () => {
    const database = await server.createDatabase();
    const db = await loginOn(database, "writer_super", "SUPERUSER NOCREATEROLE", false);
    const plan = planSchemas([tableModule("super-a")]);
    await setUp(db, plan, ["super-a"]);
    const owner = await database.admin.unsafe<{ owner: string }[]>(
      "SELECT pg_get_userbyid(nspowner) AS owner FROM pg_namespace WHERE nspname = 'super_a'",
    );
    expect([...owner]).toEqual([{ owner: "umbradb_m_super_a" }]);
  });

  it("refuses a login without CREATEROLE before creating anything, naming what it lacks", async () => {
    const database = await server.createDatabase();
    const db = await loginOn(database, "writer_plain", "", true);
    const plan = planSchemas([tableModule("plain-a")]);
    const error = (await outcome(db.transaction((tx) => prepareSchemas(tx, plan)))) as UmbraError;
    expect(error).toBeInstanceOf(UmbraError);
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toMatchObject({ reason: "writer-privileges", login: "writer_plain" });
    expect(error.message).toContain("CREATEROLE");
    expect(error.message).toContain("umbradb_m_plain_a");
    const created = await database.admin.unsafe(
      "SELECT 1 FROM pg_roles WHERE rolname = 'umbradb_m_plain_a' UNION ALL SELECT 1 FROM pg_namespace WHERE nspname IN ('plain_a', 'core_chain')",
    );
    expect(created.length).toBe(0);
  });

  it("refuses a login without CREATE on the database, naming the privilege", async () => {
    const database = await server.createDatabase();
    const db = await loginOn(database, "writer_nocreate", "CREATEROLE", false);
    const error = (await outcome(db.transaction((tx) => prepareSchemas(tx, planSchemas([tableModule("nocreate-a")]))))) as UmbraError;
    expect(error).toBeInstanceOf(UmbraError);
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toMatchObject({ reason: "writer-privileges", login: "writer_nocreate" });
    expect(error.message).toContain("CREATE on the database");
    const roles = await database.admin.unsafe("SELECT 1 FROM pg_roles WHERE rolname = 'umbradb_m_nocreate_a'");
    expect(roles.length).toBe(0);
  });

  it("refuses a login facing a role another login created, naming the GRANT that lets it use the role", async () => {
    const first = await server.createDatabase();
    const firstDb = await loginOn(first, "writer_first", "CREATEROLE", true);
    const plan = planSchemas([tableModule("shared-name")]);
    await setUp(firstDb, plan, ["shared-name"]);

    const second = await server.createDatabase();
    const secondDb = await loginOn(second, "writer_second", "CREATEROLE", true);
    const error = (await outcome(secondDb.transaction((tx) => prepareSchemas(tx, plan)))) as UmbraError;
    expect(error).toBeInstanceOf(UmbraError);
    expect(error.code).toBe("invalid-configuration");
    expect(error.details).toMatchObject({ reason: "writer-privileges", login: "writer_second" });
    expect(error.message).toContain("GRANT umbradb_m_shared_name TO writer_second WITH INHERIT TRUE, SET TRUE");

    // What the message says an administrator can run; then the second database starts.
    await second.exec("GRANT umbradb_m_shared_name TO writer_second WITH INHERIT TRUE, SET TRUE");
    await setUp(secondDb, plan, ["shared-name"]);
    const owner = await second.admin.unsafe<{ owner: string }[]>(
      "SELECT pg_get_userbyid(nspowner) AS owner FROM pg_namespace WHERE nspname = 'shared_name'",
    );
    expect([...owner]).toEqual([{ owner: "umbradb_m_shared_name" }]);
  });
});
