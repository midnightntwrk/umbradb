import postgres, { type Sql, type TransactionSql } from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startPostgresServer, type PostgresTestServer } from "../db/postgres-server.js";

// The PostgreSQL facts the design relies on, re-checked on the pinned PostgreSQL 18 image (`test/postgres-image.ts`).
// They were checked on PostgreSQL 17 before the image was pinned, and `pglite.test.ts` checks the same on PGlite
// 0.5.10 (PostgreSQL 18.6): [Q82, A148; design §14]
// - per-module roles under `SET LOCAL ROLE` [DB-6];
// - provider functions [DB-7];
// - PL/pgSQL row triggers [DT-4];
// - the `TRUNCATE` refusal [DB-14];
// - the `jsonb` number check and `.string()` keeping a number's scale [DT-6, Q57];
// - `REPEATABLE READ READ ONLY` reads [DB-2];
// - advisory locks [DB-11].
//
// They test PostgreSQL itself, not UmbraDB code: a failure here means the pinned image no longer behaves as the design
// assumes.

const INSUFFICIENT_PRIVILEGE = "42501";
const CHECK_VIOLATION = "23514";
const RAISE_EXCEPTION = "P0001";
const READ_ONLY_SQL_TRANSACTION = "25006";

let server: PostgresTestServer;
let sql: Sql;
/** A second session on the same database. */
let other: Sql;

/** Runs `body` in one transaction after `SET LOCAL ROLE role`, as the database API runs module callbacks. */
function asRole<T>(role: string, body: (tx: TransactionSql) => Promise<T>): Promise<T> {
  return sql.begin(async (tx) => {
    await tx.unsafe(`SET LOCAL ROLE ${role}`);
    return body(tx);
  }) as Promise<T>;
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
  const rows = await sql.unsafe<{ n: number }[]>(`SELECT count(*)::int AS n FROM ${table}`);
  return rows[0]!.n;
}

beforeAll(async () => {
  server = await startPostgresServer();
  const database = await server.createDatabase();
  sql = database.admin;
  other = postgres(database.url, { max: 1, onnotice: () => undefined });
  // The same roles, schemas and grants as `pglite.test.ts`. [design §4]
  await database.exec(`
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
}, 120_000);

afterAll(async () => {
  await other?.end({ timeout: 5 });
  await server?.stop();
});

describe("the pinned image is PostgreSQL 18.6 (Q82)", () => {
  it("reports PostgreSQL 18.6, the version PGlite 0.5.10 embeds", async () => {
    const rows = await sql.unsafe<{ version: string; num: number }[]>(
      "SELECT version() AS version, current_setting('server_version_num')::int AS num",
    );
    expect(rows[0]!.version).toMatch(/^PostgreSQL 18\.6 /);
    expect(rows[0]!.num).toBe(180006);
  });
});

describe("PostgreSQL 18 — roles and SET LOCAL ROLE (DB-6)", () => {
  it("switches the current role for one transaction only, and the role writes its own schema", async () => {
    const inside = await asRole("umbradb_m_a", async (tx) => {
      await tx.unsafe("CREATE TABLE a.items (k text PRIMARY KEY, v bigint NOT NULL)");
      await tx.unsafe("INSERT INTO a.items (k, v) VALUES ($1, $2)", ["one", 1]);
      const who = await tx.unsafe<{ current_user: string; rolsuper: boolean }[]>(
        "SELECT current_user, (SELECT rolsuper FROM pg_roles WHERE rolname = current_user) AS rolsuper",
      );
      return who[0];
    });
    expect(inside).toEqual({ current_user: "umbradb_m_a", rolsuper: false });

    const after = await sql.unsafe<{ current_user: string }[]>("SELECT current_user");
    expect(after[0]!.current_user).not.toBe("umbradb_m_a");

    const owner = await sql.unsafe<{ owner: string }[]>(
      "SELECT tableowner AS owner FROM pg_tables WHERE schemaname = 'a' AND tablename = 'items'",
    );
    expect(owner[0]!.owner).toBe("umbradb_m_a");
    expect(await count("a.items")).toBe(1);
  });

  it("denies a write into another role's schema, while reads through the granted SELECT succeed", async () => {
    await asRole("umbradb_m_a", (tx) => tx.unsafe("CREATE TABLE a.owned (k text PRIMARY KEY, v bigint NOT NULL)"));
    await asRole("umbradb_m_a", (tx) => tx.unsafe("INSERT INTO a.owned (k, v) VALUES ('x', 1)"));

    const read = await asRole("umbradb_m_b", (tx) => tx.unsafe<{ k: string }[]>("SELECT k FROM a.owned"));
    expect([...read]).toEqual([{ k: "x" }]);

    for (const statement of [
      "INSERT INTO a.owned (k, v) VALUES ('y', 2)",
      "UPDATE a.owned SET v = 3 WHERE k = 'x'",
      "DELETE FROM a.owned WHERE k = 'x'",
      "CREATE TABLE a.intruder (k text)",
    ]) {
      const denied = await sqlError(() => asRole("umbradb_m_b", (tx) => tx.unsafe(statement)));
      expect(denied.code, statement).toBe(INSUFFICIENT_PRIVILEGE);
      expect(denied.message, statement).toMatch(/permission denied/);
    }
    const rows = await sql.unsafe<{ k: string; v: number }[]>("SELECT k, v::int AS v FROM a.owned");
    expect([...rows]).toEqual([{ k: "x", v: 1 }]);
  });
});

describe("PostgreSQL 18 — provider functions (DB-7)", () => {
  beforeAll(async () => {
    await asRole("umbradb_m_a", (tx) =>
      tx
        .unsafe(`
          CREATE TABLE a.store (k text PRIMARY KEY, v bigint NOT NULL);
          CREATE FUNCTION a.persist(p_key text, p_value bigint) RETURNS void
            LANGUAGE plpgsql SECURITY DEFINER
            SET search_path = pg_catalog, a, pg_temp
            AS $$ BEGIN INSERT INTO store (k, v) VALUES (p_key, p_value); END $$;
          GRANT EXECUTE ON FUNCTION a.persist(text, bigint) TO umbradb_m_b;
          -- Negative control: without pg_temp in its search_path, PostgreSQL searches pg_temp first.
          CREATE FUNCTION a.persist_unpinned(p_key text, p_value bigint) RETURNS void
            LANGUAGE plpgsql SECURITY DEFINER
            SET search_path = a
            AS $$ BEGIN INSERT INTO store (k, v) VALUES (p_key, p_value); END $$;
          GRANT EXECUTE ON FUNCTION a.persist_unpinned(text, bigint) TO umbradb_m_b;
        `)
        .simple(),
    );
  });

  it("records SECURITY DEFINER, the fixed search_path and the provider role as owner, and no EXECUTE for PUBLIC", async () => {
    const fn = await sql.unsafe<{ owner: string; prosecdef: boolean; proconfig: string[]; acl: string }[]>(
      "SELECT pg_get_userbyid(proowner) AS owner, prosecdef, proconfig, proacl::text AS acl FROM pg_proc WHERE oid = 'a.persist(text, bigint)'::regprocedure",
    );
    expect(fn[0]).toMatchObject({
      owner: "umbradb_m_a",
      prosecdef: true,
      proconfig: ["search_path=pg_catalog, a, pg_temp"],
    });
    expect(fn[0]!.acl).not.toMatch(/[{,]=/);
    const denied = await sqlError(() => asRole("umbradb_m_c", (tx) => tx.unsafe("SELECT a.persist('from-c', 1)")));
    expect(denied.code).toBe(INSUFFICIENT_PRIVILEGE);
    expect(denied.message).toMatch(/permission denied for function persist/);
  });

  it("lets the consumer change the provider table only through the function, never shadowed by pg_temp", async () => {
    const shadowTable = "CREATE TEMPORARY TABLE store (k text, v bigint) ON COMMIT DROP; GRANT INSERT ON pg_temp.store TO PUBLIC;";
    const temp = await asRole("umbradb_m_b", async (tx) => {
      await tx.unsafe(shadowTable).simple();
      await tx.unsafe("SELECT a.persist($1, $2)", ["via-provider", 2]);
      return (await tx.unsafe<{ n: number }[]>("SELECT count(*)::int AS n FROM pg_temp.store"))[0]!.n;
    });
    expect(temp).toBe(0);
    expect([...(await sql.unsafe("SELECT k, v::int AS v FROM a.store"))]).toEqual([{ k: "via-provider", v: 2 }]);

    const direct = await sqlError(() =>
      asRole("umbradb_m_b", (tx) => tx.unsafe("UPDATE a.store SET v = 3 WHERE k = 'via-provider'")),
    );
    expect(direct.code).toBe(INSUFFICIENT_PRIVILEGE);

    // Negative control: without pg_temp last, the caller's temporary table receives the write.
    const shadowed = await asRole("umbradb_m_b", async (tx) => {
      await tx.unsafe(shadowTable).simple();
      await tx.unsafe("SELECT a.persist_unpinned($1, $2)", ["shadowed", 4]);
      return (await tx.unsafe<{ n: number }[]>("SELECT count(*)::int AS n FROM pg_temp.store"))[0]!.n;
    });
    expect(shadowed).toBe(1);
    expect(await count("a.store")).toBe(1);
  });
});

describe("PostgreSQL 18 — triggers (DT-4, DB-14)", () => {
  beforeAll(async () => {
    await asRole("umbradb_m_a", (tx) =>
      tx
        .unsafe(`
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
        `)
        .simple(),
    );
  });

  it("fires a PL/pgSQL row trigger for every inserted, updated and deleted row with OLD and NEW", async () => {
    await asRole("umbradb_m_a", async (tx) => {
      await tx.unsafe("INSERT INTO a.tracked (k, v) VALUES ('p', 1), ('q', 2)");
      await tx.unsafe("UPDATE a.tracked SET v = 10 WHERE k = 'p'");
      await tx.unsafe("DELETE FROM a.tracked WHERE k = 'q'");
    });
    const changes = await sql.unsafe(
      "SELECT op, k, old_v::int AS old_v, new_v::int AS new_v FROM a.changes ORDER BY op, k",
    );
    expect([...changes]).toEqual([
      { op: "DELETE", k: "q", old_v: 2, new_v: null },
      { op: "INSERT", k: "p", old_v: null, new_v: 1 },
      { op: "INSERT", k: "q", old_v: null, new_v: 2 },
      { op: "UPDATE", k: "p", old_v: 1, new_v: 10 },
    ]);
  });

  it("refuses TRUNCATE through a BEFORE TRUNCATE statement trigger and keeps the rows", async () => {
    const before = await count("a.tracked");
    expect(before).toBeGreaterThan(0);
    const refused = await sqlError(() => asRole("umbradb_m_a", (tx) => tx.unsafe("TRUNCATE a.tracked")));
    expect(refused.code).toBe(RAISE_EXCEPTION);
    expect(refused.message).toBe("truncate-not-allowed");
    expect(await count("a.tracked")).toBe(before);
  });

  it("control: without the TRUNCATE trigger, TRUNCATE empties the table and fires no row trigger", async () => {
    await asRole("umbradb_m_a", (tx) => tx.unsafe("INSERT INTO a.unguarded (k, v) VALUES ('u', 1)"));
    const logged = await count("a.changes");
    await asRole("umbradb_m_a", (tx) => tx.unsafe("TRUNCATE a.unguarded"));
    expect(await count("a.unguarded")).toBe(0);
    expect(await count("a.changes")).toBe(logged);
  });
});

describe("PostgreSQL 18 — jsonpath number check and .string() (DT-6, Q57)", () => {
  beforeAll(async () => {
    await asRole("umbradb_m_a", (tx) =>
      tx
        .unsafe(`
          CREATE FUNCTION a.jsonb_numbers_ok(value jsonb) RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
            SELECT NOT jsonb_path_exists(value,
              'lax $.** ? (@.type() == "number" && (@ != @.floor() || @ < -9223372036854775808 || @ > 9223372036854775807))')
          $$;
          CREATE TABLE a.docs (k text PRIMARY KEY, body jsonb NOT NULL CHECK (a.jsonb_numbers_ok(body)));
        `)
        .simple(),
    );
  });

  // `$2::text::jsonb`: with `$2::jsonb` the `postgres` driver learns the parameter is `jsonb` and JSON-encodes the string,
  // so `1.5` would arrive as the JSON string "1.5".
  const insert = (k: string, body: string) =>
    asRole("umbradb_m_a", (tx) => tx.unsafe("INSERT INTO a.docs (k, body) VALUES ($1, $2::text::jsonb)", [k, body]));

  it("is an immutable SQL function in a CHECK that refuses fractions and integers outside 64 bits", async () => {
    const fn = await sql.unsafe<{ provolatile: string }[]>(
      "SELECT provolatile FROM pg_proc WHERE oid = 'a.jsonb_numbers_ok(jsonb)'::regprocedure",
    );
    expect(fn[0]!.provolatile).toBe("i");
    for (const body of ["1.5", '{"n": 1.5}', '{"list": [1, [2, 2.25]]}', '{"a": {"b": {"c": -0.5}}}', '{"n": 9223372036854775808}', '{"n": -9223372036854775809}']) {
      const rejected = await sqlError(() => insert(`bad-${body}`, body));
      expect(rejected.code, body).toBe(CHECK_VIOLATION);
    }
    for (const body of ['{"n": 2}', '{"n": 9223372036854775807}', '{"n": -9223372036854775808}', '{"s": "1.5", "list": [1, 2, {"m": 3}]}']) {
      await insert(`ok-${body}`, body);
    }
    expect(await count("a.docs")).toBe(4);
  });

  it("keeps a JSON number's scale in .string(): 1.0, 100.00, 1e2 (design.md §14, Q57)", async () => {
    const rows = await sql.unsafe<{ input: string; text: string }[]>(
      "SELECT input, jsonb_path_query(input::jsonb, '$.string()') #>> '{}' AS text FROM unnest(ARRAY['1.0', '100.00', '1e2', '-0', '7']) WITH ORDINALITY AS t(input, n) ORDER BY n",
    );
    expect(rows.map((row) => [row.input, row.text])).toEqual([
      ["1.0", "1.0"],
      ["100.00", "100.00"],
      ["1e2", "100"],
      ["-0", "0"],
      ["7", "7"],
    ]);
  });
});

describe("PostgreSQL 18 — REPEATABLE READ READ ONLY reads (DB-2) and advisory locks (DB-11)", () => {
  it("reads one snapshot through a later commit, and refuses a write", async () => {
    await sql.unsafe("CREATE TABLE public.snap (k int PRIMARY KEY)");
    await sql.unsafe("INSERT INTO public.snap VALUES (1)");
    const seen = await other.begin("ISOLATION LEVEL REPEATABLE READ READ ONLY", async (tx) => {
      const before = (await tx.unsafe<{ n: number }[]>("SELECT count(*)::int AS n FROM public.snap"))[0]!.n;
      await sql.unsafe("INSERT INTO public.snap VALUES (2)"); // committed by the other session meanwhile
      const during = (await tx.unsafe<{ n: number }[]>("SELECT count(*)::int AS n FROM public.snap"))[0]!.n;
      return { before, during };
    });
    expect(seen).toEqual({ before: 1, during: 1 });
    const write = await sqlError(() =>
      other.begin("ISOLATION LEVEL REPEATABLE READ READ ONLY", (tx) => tx.unsafe("INSERT INTO public.snap VALUES (3)")),
    );
    expect(write.code).toBe(READ_ONLY_SQL_TRANSACTION);
    // Control: a new transaction sees the commit.
    expect(await count("public.snap")).toBe(2);
    expect((await other.unsafe<{ n: number }[]>("SELECT count(*)::int AS n FROM public.snap"))[0]!.n).toBe(2);
  });

  it("takes, reports and releases a two-key session advisory lock, and a transaction lock at its end", async () => {
    const taken = await sql.unsafe<{ got: boolean }[]>("SELECT pg_try_advisory_lock(3, hashtext('umbradb-writer')) AS got");
    expect(taken[0]!.got).toBe(true);
    const busy = await other.unsafe<{ got: boolean }[]>("SELECT pg_try_advisory_lock(3, hashtext('umbradb-writer')) AS got");
    expect(busy[0]!.got).toBe(false);
    const released = await sql.unsafe<{ released: boolean }[]>("SELECT pg_advisory_unlock(3, hashtext('umbradb-writer')) AS released");
    expect(released[0]!.released).toBe(true);
    const again = await sql.unsafe<{ released: boolean }[]>("SELECT pg_advisory_unlock(3, hashtext('umbradb-writer')) AS released");
    expect(again[0]!.released).toBe(false);

    const inside = await sql.begin(async (tx) => {
      const got = await tx.unsafe<{ got: boolean }[]>("SELECT pg_try_advisory_xact_lock(3, 7) AS got");
      const held = await tx.unsafe<{ n: number }[]>(
        "SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory' AND classid = 3 AND objid = 7 AND granted",
      );
      return { got: got[0]!.got, held: held[0]!.n };
    });
    expect(inside).toEqual({ got: true, held: 1 });
    const after = await sql.unsafe<{ n: number }[]>(
      "SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory' AND classid = 3 AND objid = 7",
    );
    expect(after[0]!.n).toBe(0);
  });
});
