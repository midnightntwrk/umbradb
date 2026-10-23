import { PGlite, type Transaction } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Task 0.1 of `openspec/changes/core-arch` (design.md §4 and §14): characterization tests of the pinned
// `@electric-sql/pglite` 0.5.10. They turn the stage-1 probe into tests of the database features the PGlite
// backend relies on — per-module roles under `SET LOCAL ROLE` (DB-6), provider functions (DB-7), PL/pgSQL row
// triggers (DT-4), the `TRUNCATE` refusal (DB-14), the `jsonb` number check (DT-6) and the advisory-lock functions
// (DB-11). They test PGlite itself, not UmbraDB code: a failure here means the pinned dependency no longer behaves
// as the design assumes.

const INSUFFICIENT_PRIVILEGE = "42501";
const CHECK_VIOLATION = "23514";
const RAISE_EXCEPTION = "P0001";

let db: PGlite;

/** Runs `body` in one transaction after `SET LOCAL ROLE role`, as the database API runs module callbacks. */
function asRole<T>(role: string, body: (tx: Transaction) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.exec(`SET LOCAL ROLE ${role}`);
    return body(tx);
  });
}

/** The SQLSTATE and message of the error `run` rejects with; fails the test if it resolves. */
async function sqlError(run: () => Promise<unknown>): Promise<{ code: string | undefined; message: string }> {
  try {
    await run();
  } catch (error) {
    const { code, message } = error as { code?: string; message: string };
    return { code, message };
  }
  return expect.unreachable("the statement was expected to fail");
}

async function count(table: string): Promise<number> {
  const result = await db.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${table}`);
  return result.rows[0]!.n;
}

beforeAll(async () => {
  db = await PGlite.create();
  // Two module roles and an unrelated third, each owning (or not) a schema, with the grants of design.md §4:
  // `USAGE` on the other module schemas, `SELECT` on their tables through default privileges, and `EXECUTE` on
  // functions revoked from `PUBLIC` as a default privilege of each module role.
  await db.exec(`
    CREATE ROLE umbradb_m_a NOLOGIN;
    CREATE ROLE umbradb_m_b NOLOGIN;
    CREATE ROLE umbradb_m_c NOLOGIN;
    CREATE SCHEMA a AUTHORIZATION umbradb_m_a;
    CREATE SCHEMA b AUTHORIZATION umbradb_m_b;
    GRANT USAGE ON SCHEMA a TO umbradb_m_b, umbradb_m_c;
    GRANT USAGE ON SCHEMA b TO umbradb_m_a, umbradb_m_c;
    ALTER DEFAULT PRIVILEGES FOR ROLE umbradb_m_a IN SCHEMA a GRANT SELECT ON TABLES TO umbradb_m_b, umbradb_m_c;
    ALTER DEFAULT PRIVILEGES FOR ROLE umbradb_m_b IN SCHEMA b GRANT SELECT ON TABLES TO umbradb_m_a, umbradb_m_c;
    ALTER DEFAULT PRIVILEGES FOR ROLE umbradb_m_a REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
    ALTER DEFAULT PRIVILEGES FOR ROLE umbradb_m_b REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
  `);
});

afterAll(async () => {
  await db?.close();
});

describe("@electric-sql/pglite 0.5.10 — roles and SET LOCAL ROLE (DB-6)", () => {
  it("creates NOLOGIN module roles that own their schemas", async () => {
    const roles = await db.query<{ rolname: string; rolcanlogin: boolean; rolsuper: boolean }>(
      "SELECT rolname, rolcanlogin, rolsuper FROM pg_roles WHERE rolname LIKE 'umbradb\\_m\\_%' ORDER BY rolname",
    );
    expect(roles.rows).toEqual([
      { rolname: "umbradb_m_a", rolcanlogin: false, rolsuper: false },
      { rolname: "umbradb_m_b", rolcanlogin: false, rolsuper: false },
      { rolname: "umbradb_m_c", rolcanlogin: false, rolsuper: false },
    ]);
    const owners = await db.query<{ nspname: string; owner: string }>(
      "SELECT nspname, pg_get_userbyid(nspowner) AS owner FROM pg_namespace WHERE nspname IN ('a', 'b') ORDER BY nspname",
    );
    expect(owners.rows).toEqual([
      { nspname: "a", owner: "umbradb_m_a" },
      { nspname: "b", owner: "umbradb_m_b" },
    ]);
  });

  it("switches the current role for one transaction only, and the role writes its own schema", async () => {
    const inside = await asRole("umbradb_m_a", async (tx) => {
      await tx.exec("CREATE TABLE a.items (k text PRIMARY KEY, v bigint NOT NULL)");
      await tx.query("INSERT INTO a.items (k, v) VALUES ($1, $2)", ["one", 1]);
      const who = await tx.query<{ current_user: string; session_user: string }>(
        "SELECT current_user, session_user",
      );
      return who.rows[0];
    });
    expect(inside).toEqual({ current_user: "umbradb_m_a", session_user: "postgres" });

    const after = await db.query<{ current_user: string }>("SELECT current_user");
    expect(after.rows[0]!.current_user).toBe("postgres");

    const owner = await db.query<{ owner: string }>(
      "SELECT tableowner AS owner FROM pg_tables WHERE schemaname = 'a' AND tablename = 'items'",
    );
    expect(owner.rows[0]!.owner).toBe("umbradb_m_a");
    expect(await count("a.items")).toBe(1);
  });

  it("denies a write into another role's schema, while reads through the granted SELECT succeed", async () => {
    await asRole("umbradb_m_a", (tx) => tx.exec("CREATE TABLE a.owned (k text PRIMARY KEY, v bigint NOT NULL)"));
    await asRole("umbradb_m_a", (tx) => tx.query("INSERT INTO a.owned (k, v) VALUES ('x', 1)"));

    const read = await asRole("umbradb_m_b", (tx) => tx.query<{ k: string }>("SELECT k FROM a.owned"));
    expect(read.rows).toEqual([{ k: "x" }]);

    const writes = [
      "INSERT INTO a.owned (k, v) VALUES ('y', 2)",
      "UPDATE a.owned SET v = 3 WHERE k = 'x'",
      "DELETE FROM a.owned WHERE k = 'x'",
      "CREATE TABLE a.intruder (k text)",
    ];
    for (const statement of writes) {
      const denied = await sqlError(() => asRole("umbradb_m_b", (tx) => tx.exec(statement)));
      expect(denied.code, statement).toBe(INSUFFICIENT_PRIVILEGE);
      expect(denied.message, statement).toMatch(/permission denied/);
    }

    const rows = await db.query<{ k: string; v: number }>("SELECT k, v::int AS v FROM a.owned");
    expect(rows.rows).toEqual([{ k: "x", v: 1 }]);

    // The same role writes its own schema without restriction.
    await asRole("umbradb_m_b", async (tx) => {
      await tx.exec("CREATE TABLE b.own (k text PRIMARY KEY)");
      await tx.exec("INSERT INTO b.own (k) VALUES ('mine')");
    });
    expect(await count("b.own")).toBe(1);
  });
});

describe("@electric-sql/pglite 0.5.10 — provider functions (DB-7)", () => {
  beforeAll(async () => {
    await asRole("umbradb_m_a", (tx) =>
      tx.exec(`
        CREATE TABLE a.store (k text PRIMARY KEY, v bigint NOT NULL);
        CREATE FUNCTION a.persist(p_key text, p_value bigint) RETURNS void
          LANGUAGE plpgsql SECURITY DEFINER
          SET search_path = pg_catalog, a, pg_temp
          AS $$ BEGIN INSERT INTO store (k, v) VALUES (p_key, p_value); END $$;
        GRANT EXECUTE ON FUNCTION a.persist(text, bigint) TO umbradb_m_b;
        -- Negative control: the same function without pg_temp in its search_path, which PostgreSQL then searches
        -- first, so a caller's temporary table shadows the provider table.
        CREATE FUNCTION a.persist_unpinned(p_key text, p_value bigint) RETURNS void
          LANGUAGE plpgsql SECURITY DEFINER
          SET search_path = a
          AS $$ BEGIN INSERT INTO store (k, v) VALUES (p_key, p_value); END $$;
        GRANT EXECUTE ON FUNCTION a.persist_unpinned(text, bigint) TO umbradb_m_b;
      `),
    );
  });

  it("records SECURITY DEFINER, the fixed search_path and the provider role as owner", async () => {
    const fn = await db.query<{ owner: string; prosecdef: boolean; proconfig: string[] }>(
      "SELECT pg_get_userbyid(proowner) AS owner, prosecdef, proconfig FROM pg_proc WHERE oid = 'a.persist(text, bigint)'::regprocedure",
    );
    expect(fn.rows).toEqual([
      { owner: "umbradb_m_a", prosecdef: true, proconfig: ["search_path=pg_catalog, a, pg_temp"] },
    ]);
  });

  it("revokes EXECUTE from PUBLIC through the default privilege and grants it to the consumer only", async () => {
    const privileges = await db.query<{ role: string; allowed: boolean }>(`
      SELECT r AS role, has_function_privilege(r, 'a.persist(text, bigint)', 'EXECUTE') AS allowed
      FROM unnest(ARRAY['umbradb_m_a', 'umbradb_m_b', 'umbradb_m_c']) AS r ORDER BY r
    `);
    expect(privileges.rows).toEqual([
      { role: "umbradb_m_a", allowed: true },
      { role: "umbradb_m_b", allowed: true },
      { role: "umbradb_m_c", allowed: false },
    ]);
    const acl = await db.query<{ acl: string }>(
      "SELECT proacl::text AS acl FROM pg_proc WHERE oid = 'a.persist(text, bigint)'::regprocedure",
    );
    // A PUBLIC entry in an ACL is written with an empty grantee (`=X/owner`); there is none.
    expect(acl.rows[0]!.acl).not.toMatch(/[{,]=/);

    const denied = await sqlError(() =>
      asRole("umbradb_m_c", (tx) => tx.query("SELECT a.persist('from-c', 1)")),
    );
    expect(denied.code).toBe(INSUFFICIENT_PRIVILEGE);
    expect(denied.message).toMatch(/permission denied for function persist/);
  });

  it("lets the consumer change the provider table only through the function, never shadowed by pg_temp", async () => {
    // The caller creates a temporary table named like the provider table and opens it to every role, so a
    // provider function that searched pg_temp first could write into it.
    const shadowTable = `
      CREATE TEMPORARY TABLE store (k text, v bigint) ON COMMIT DROP;
      GRANT INSERT ON pg_temp.store TO PUBLIC;
    `;
    const temp = await asRole("umbradb_m_b", async (tx) => {
      await tx.exec(shadowTable);
      await tx.query("SELECT a.persist($1, $2)", ["via-provider", 2]);
      const shadow = await tx.query<{ n: number }>("SELECT count(*)::int AS n FROM pg_temp.store");
      return shadow.rows[0]!.n;
    });
    expect(temp).toBe(0);
    const stored = await db.query<{ k: string; v: number }>("SELECT k, v::int AS v FROM a.store");
    expect(stored.rows).toEqual([{ k: "via-provider", v: 2 }]);

    const direct = await sqlError(() =>
      asRole("umbradb_m_b", (tx) => tx.query("UPDATE a.store SET v = 3 WHERE k = 'via-provider'")),
    );
    expect(direct.code).toBe(INSUFFICIENT_PRIVILEGE);

    // Negative control: without pg_temp last, the caller's temporary table receives the write.
    const shadowed = await asRole("umbradb_m_b", async (tx) => {
      await tx.exec(shadowTable);
      await tx.query("SELECT a.persist_unpinned($1, $2)", ["shadowed", 4]);
      const shadow = await tx.query<{ n: number }>("SELECT count(*)::int AS n FROM pg_temp.store");
      return shadow.rows[0]!.n;
    });
    expect(shadowed).toBe(1);
    expect(await count("a.store")).toBe(1);
  });
});

describe("@electric-sql/pglite 0.5.10 — triggers (DT-4, DB-14)", () => {
  beforeAll(async () => {
    await asRole("umbradb_m_a", (tx) =>
      tx.exec(`
        CREATE TABLE a.tracked (k text PRIMARY KEY, v bigint NOT NULL);
        CREATE TABLE a.changes (op text NOT NULL, k text NOT NULL, old_v bigint, new_v bigint);
        CREATE FUNCTION a.capture() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
          IF TG_OP = 'DELETE' THEN
            INSERT INTO a.changes (op, k, old_v, new_v) VALUES (TG_OP, OLD.k, OLD.v, NULL);
            RETURN OLD;
          END IF;
          INSERT INTO a.changes (op, k, old_v, new_v)
            VALUES (TG_OP, NEW.k, CASE WHEN TG_OP = 'UPDATE' THEN OLD.v END, NEW.v);
          RETURN NEW;
        END $$;
        CREATE TRIGGER tracked_capture AFTER INSERT OR UPDATE OR DELETE ON a.tracked
          FOR EACH ROW EXECUTE FUNCTION a.capture();
        CREATE FUNCTION a.refuse_truncate() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
          RAISE EXCEPTION 'truncate-not-allowed';
        END $$;
        CREATE TRIGGER tracked_no_truncate BEFORE TRUNCATE ON a.tracked
          FOR EACH STATEMENT EXECUTE FUNCTION a.refuse_truncate();
        -- Control: the same row trigger, no TRUNCATE trigger.
        CREATE TABLE a.unguarded (k text PRIMARY KEY, v bigint NOT NULL);
        CREATE TRIGGER unguarded_capture AFTER INSERT OR UPDATE OR DELETE ON a.unguarded
          FOR EACH ROW EXECUTE FUNCTION a.capture();
      `),
    );
  });

  it("fires a PL/pgSQL row trigger for every inserted, updated and deleted row with OLD and NEW", async () => {
    await asRole("umbradb_m_a", async (tx) => {
      await tx.exec("INSERT INTO a.tracked (k, v) VALUES ('p', 1), ('q', 2)");
      await tx.exec("UPDATE a.tracked SET v = 10 WHERE k = 'p'");
      await tx.exec("DELETE FROM a.tracked WHERE k = 'q'");
    });
    const changes = await db.query<{ op: string; k: string; old_v: number | null; new_v: number | null }>(
      "SELECT op, k, old_v::int AS old_v, new_v::int AS new_v FROM a.changes ORDER BY op, k",
    );
    expect(changes.rows).toEqual([
      { op: "DELETE", k: "q", old_v: 2, new_v: null },
      { op: "INSERT", k: "p", old_v: null, new_v: 1 },
      { op: "INSERT", k: "q", old_v: null, new_v: 2 },
      { op: "UPDATE", k: "p", old_v: 1, new_v: 10 },
    ]);
  });

  it("refuses TRUNCATE through a BEFORE TRUNCATE statement trigger and keeps the rows", async () => {
    const before = await count("a.tracked");
    expect(before).toBeGreaterThan(0);
    const refused = await sqlError(() => asRole("umbradb_m_a", (tx) => tx.exec("TRUNCATE a.tracked")));
    expect(refused.code).toBe(RAISE_EXCEPTION);
    expect(refused.message).toBe("truncate-not-allowed");
    expect(await count("a.tracked")).toBe(before);
  });

  it("control: without the TRUNCATE trigger, TRUNCATE empties the table and fires no row trigger", async () => {
    await asRole("umbradb_m_a", (tx) => tx.exec("INSERT INTO a.unguarded (k, v) VALUES ('u', 1)"));
    const logged = await count("a.changes");
    await asRole("umbradb_m_a", (tx) => tx.exec("TRUNCATE a.unguarded"));
    expect(await count("a.unguarded")).toBe(0);
    expect(await count("a.changes")).toBe(logged);
  });
});

describe("@electric-sql/pglite 0.5.10 — jsonpath number check (DT-6)", () => {
  beforeAll(async () => {
    await asRole("umbradb_m_a", (tx) =>
      tx.exec(`
        CREATE FUNCTION a.jsonb_numbers_ok(value jsonb) RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
          SELECT NOT jsonb_path_exists(value,
            'lax $.** ? (@.type() == "number" && (@ != @.floor() || @ < -9223372036854775808 || @ > 9223372036854775807))')
        $$;
        CREATE TABLE a.docs (k text PRIMARY KEY, body jsonb NOT NULL CHECK (a.jsonb_numbers_ok(body)));
      `),
    );
  });

  const insert = (k: string, body: string) =>
    asRole("umbradb_m_a", (tx) => tx.query("INSERT INTO a.docs (k, body) VALUES ($1, $2::jsonb)", [k, body]));

  it("is an immutable SQL function, usable in a CHECK constraint", async () => {
    const fn = await db.query<{ provolatile: string }>(
      "SELECT provolatile FROM pg_proc WHERE oid = 'a.jsonb_numbers_ok(jsonb)'::regprocedure",
    );
    expect(fn.rows[0]!.provolatile).toBe("i");
  });

  it("rejects a fractional number, at the top level and nested in arrays and objects", async () => {
    for (const [k, body] of [
      ["top", "1.5"],
      ["field", '{"n": 1.5}'],
      ["nested", '{"list": [1, [2, 2.25]]}'],
      ["deep", '{"a": {"b": {"c": -0.5}}}'],
    ] as const) {
      const rejected = await sqlError(() => insert(k, body));
      expect(rejected.code, body).toBe(CHECK_VIOLATION);
    }
    expect(await count("a.docs")).toBe(0);
  });

  it("accepts integers within the signed 64-bit range, and strings that look like numbers", async () => {
    await insert("int", '{"n": 2}');
    await insert("max", '{"n": 9223372036854775807}');
    await insert("min", '{"n": -9223372036854775808}');
    await insert("text", '{"s": "1.5", "list": [1, 2, {"m": 3}]}');
    expect(await count("a.docs")).toBe(4);
  });

  it("rejects integers outside the signed 64-bit range", async () => {
    for (const body of ['{"n": 9223372036854775808}', '{"n": -9223372036854775809}']) {
      const rejected = await sqlError(() => insert(`out-${body}`, body));
      expect(rejected.code, body).toBe(CHECK_VIOLATION);
    }
  });
});

describe("@electric-sql/pglite 0.5.10 — advisory-lock functions (DB-11)", () => {
  it("takes, reports and releases a two-key session advisory lock", async () => {
    const taken = await db.query<{ got: boolean }>(
      "SELECT pg_try_advisory_lock(3, hashtext('umbradb-writer')) AS got",
    );
    expect(taken.rows[0]!.got).toBe(true);

    const held = await db.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory' AND classid = 3 AND objsubid = 2 AND granted",
    );
    expect(held.rows[0]!.n).toBe(1);

    const released = await db.query<{ released: boolean }>(
      "SELECT pg_advisory_unlock(3, hashtext('umbradb-writer')) AS released",
    );
    expect(released.rows[0]!.released).toBe(true);
    const again = await db.query<{ released: boolean }>(
      "SELECT pg_advisory_unlock(3, hashtext('umbradb-writer')) AS released",
    );
    expect(again.rows[0]!.released).toBe(false);

    const after = await db.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory' AND classid = 3 AND objsubid = 2",
    );
    expect(after.rows[0]!.n).toBe(0);
  });

  it("releases a transaction advisory lock at the end of its transaction", async () => {
    const inside = await db.transaction(async (tx) => {
      const got = await tx.query<{ got: boolean }>("SELECT pg_try_advisory_xact_lock(3, 7) AS got");
      const held = await tx.query<{ n: number }>(
        "SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory' AND classid = 3 AND objid = 7",
      );
      return { got: got.rows[0]!.got, held: held.rows[0]!.n };
    });
    expect(inside).toEqual({ got: true, held: 1 });
    const after = await db.query<{ n: number }>(
      "SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory' AND classid = 3 AND objid = 7",
    );
    expect(after.rows[0]!.n).toBe(0);
  });
});
