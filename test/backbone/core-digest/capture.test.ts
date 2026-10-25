import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../../src/db/api.js";
import {
  CAPTURE_TRIGGER,
  captureFunctionName,
  captureTables,
  SHADOW_SCHEMA,
  shadowTableName,
} from "../../../src/db/change-capture.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { BACKENDS } from "../../db/backends.js";
import { concatBytes, fromHex } from "../../determinism/cbor-decoder.js";
import { type Chain, digestRows, runBlock, startChain, testModule } from "./chain.js";

/**
 * Change capture across startups (DT-4; task 7.1; `src/db/change-capture.ts`), on both backends: what the database API
 * does after each part's migrations and when startup ends, so that a block's digests hold the block's changes and
 * nothing else — not a part's `on-start-db` writes, not a migration's — and follow the tables as their migrations change
 * them: a column added, a column dropped, a table renamed, a partition added, a table declared `deterministic: false`
 * later, a trigger disabled by hand, a shared item's table.
 *
 * Expected digests are computed here with `node:crypto` from CBOR written out by hand (RFC 8949).
 */

const hex = (text: string): Uint8Array => fromHex(text.replace(/\s+/g, ""));
const text = (value: string): Uint8Array => concatBytes(new Uint8Array([0x60 + value.length]), new TextEncoder().encode(value));
const sha256 = (...parts: Uint8Array[]): string => createHash("sha256").update(concatBytes(...parts)).digest("hex");

/** Module `m` with `tables` in one item, `migrations`, and an `on-db-write` running the statements `writes` gives. */
function moduleM(options: {
  readonly tables: readonly string[];
  readonly migrations: readonly string[];
  readonly writes?: (h: bigint) => readonly string[];
  readonly setup?: readonly string[];
  readonly optedOut?: readonly string[];
}): ModuleDeclaration {
  const deterministic = options.tables.filter((table) => !(options.optedOut ?? []).includes(table));
  return testModule("m", {
    provides: [
      ...(deterministic.length === 0
        ? []
        : [{ name: "m-rows", lifetimes: ["table" as const], table: { schema: "m", tables: deterministic, kind: "mutable" as const } }]),
      ...((options.optedOut ?? []).length === 0
        ? []
        : [
            {
              name: "m-free",
              lifetimes: ["table" as const],
              table: { schema: "m", tables: [...(options.optedOut ?? [])], kind: "mutable" as const, deterministic: false as const },
            },
          ]),
    ],
    migrations: options.migrations.map((sql, i) => ({ id: String(i + 1).padStart(3, "0"), sql })),
    points: {
      ...(options.setup === undefined
        ? {}
        : {
            async "on-start-db"(_p, w) {
              for (const sql of options.setup ?? []) await w.execute(sql);
            },
          }),
      async "on-db-write"(_p, b, w) {
        for (const sql of options.writes?.(b.height) ?? []) await w.execute(sql);
      },
    },
  });
}

describe.each(BACKENDS)("change capture across startups, on $name (DT-4)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** Starts `module` again on the chain's database, continuing at the chain's cursor (a restart with a new build). */
  async function restart(chain: Chain, module: ModuleDeclaration): Promise<Chain> {
    const next = await startChain(chain.db, [module]);
    next.cursor = chain.cursor;
    return next;
  }

  async function shadowRows(db: Database, schema: string, table: string): Promise<number | null> {
    const [row] = await db.read((read) =>
      read.query(`SELECT to_regclass($1) IS NOT NULL AS present`, [`${SHADOW_SCHEMA}.${shadowTableName(schema, table)}`]),
    );
    if (row?.present !== true) return null;
    const [count] = await db.read((read) =>
      read.query(`SELECT count(*)::int AS n FROM ${SHADOW_SCHEMA}."${shadowTableName(schema, table)}"`),
    );
    return count?.n as number;
  }

  it("records no change for what a part's on-start-db writes: the shadow tables are empty when startup ends", async () => {
    const { db } = await backend.database("SELECT 1");
    const module = moduleM({
      tables: ["t"],
      migrations: ["CREATE TABLE m.t (k bigint PRIMARY KEY, v text NOT NULL)"],
      setup: ["INSERT INTO m.t (k, v) VALUES (0, 'setup') ON CONFLICT (k) DO NOTHING"],
      writes: (h) => (h === 1n ? ["INSERT INTO m.t (k, v) VALUES (1, 'a')"] : ["UPDATE m.t SET v = 'b' WHERE k = 0"]),
    });
    const chain = await startChain(db, [module]);
    expect(await shadowRows(db, "m", "t")).toBe(0);
    await runBlock(chain);
    const d1 = sha256(new Uint8Array(32), hex("01"), hex("81 82"), text("insert"), hex("82 01"), text("a"));
    expect((await digestRows(db))["m.t"]).toEqual({ height: 1n, digest: d1 });
    // A restart runs the setup again (it writes nothing now); the next block changes the setup's row.
    const again = await restart(chain, module);
    await runBlock(again);
    const d2 = sha256(hex(d1), hex("02"), hex("81 82"), text("update"), hex("82 00"), text("b"));
    expect((await digestRows(db))["m.t"]).toEqual({ height: 2n, digest: d2 });
  }, 60_000);

  it("follows a column a later migration adds; that migration's own writes are no block's changes", async () => {
    const { db } = await backend.database("SELECT 1");
    const v1 = ["CREATE TABLE m.t (k bigint PRIMARY KEY, v text NOT NULL)"];
    const chain = await startChain(db, [moduleM({ tables: ["t"], migrations: v1, writes: () => ["INSERT INTO m.t (k, v) VALUES (1, 'a')"] })]);
    await runBlock(chain);
    const before = (await digestRows(db))["m.t"];
    const function1 = await captureFunction(db, "m", "t");
    const v2 = [...v1, "ALTER TABLE m.t ADD COLUMN z bigint; UPDATE m.t SET z = 7"];
    const again = await restart(chain, moduleM({ tables: ["t"], migrations: v2, writes: () => ["UPDATE m.t SET v = 'b' WHERE k = 1"] }));
    // The migration's UPDATE changed no digest; the capture was written again for the new column.
    expect((await digestRows(db))["m.t"]).toEqual(before);
    expect(await shadowRows(db, "m", "t")).toBe(0);
    expect(await captureFunction(db, "m", "t")).not.toEqual(function1);
    await runBlock(again);
    const d2 = sha256(hex(before?.digest ?? ""), hex("02"), hex("81 82"), text("update"), hex("83 01"), text("b"), hex("07"));
    expect((await digestRows(db))["m.t"]).toEqual({ height: 2n, digest: d2 });
  }, 60_000);

  it("lets a migration drop a column the old capture function names: it records nothing in a migration", async () => {
    const { db } = await backend.database("SELECT 1");
    const v1 = ["CREATE TABLE m.t (k bigint PRIMARY KEY, x bigint, v text NOT NULL)"];
    const chain = await startChain(db, [moduleM({ tables: ["t"], migrations: v1, writes: () => ["INSERT INTO m.t (k, x, v) VALUES (1, 5, 'a')"] })]);
    await runBlock(chain);
    const before = (await digestRows(db))["m.t"];
    // The UPDATE fires the trigger with the function written for (k, x, v): it returns at once in a migration.
    const v2 = [...v1, "ALTER TABLE m.t DROP COLUMN x; UPDATE m.t SET v = 'c'"];
    const again = await restart(chain, moduleM({ tables: ["t"], migrations: v2, writes: () => ["UPDATE m.t SET v = 'd' WHERE k = 1"] }));
    expect((await digestRows(db))["m.t"]).toEqual(before);
    await runBlock(again);
    const d2 = sha256(hex(before?.digest ?? ""), hex("02"), hex("81 82"), text("update"), hex("82 01"), text("d"));
    expect((await digestRows(db))["m.t"]).toEqual({ height: 2n, digest: d2 });
  }, 60_000);

  it("follows a renamed table and a table declared deterministic: false later, dropping the shadow tables no table uses", async () => {
    const { db } = await backend.database("SELECT 1");
    const v1 = ["CREATE TABLE m.t (k bigint PRIMARY KEY)", "CREATE TABLE m.u (k bigint PRIMARY KEY)"];
    const writes = (h: bigint) => [`INSERT INTO m.t (k) VALUES (${h})`];
    const chain = await startChain(db, [moduleM({ tables: ["t", "u"], migrations: v1, writes })]);
    await runBlock(chain);
    expect(await shadowRows(db, "m", "u")).toBe(0);
    const v2 = [...v1, "ALTER TABLE m.u RENAME TO u2"];
    const again = await restart(
      chain,
      moduleM({
        tables: ["t", "u2"],
        optedOut: ["t"],
        migrations: v2,
        writes: (h) => [`INSERT INTO m.t (k) VALUES (${h})`, `INSERT INTO m.u2 (k) VALUES (${h})`],
      }),
    );
    expect(await shadowRows(db, "m", "u")).toBeNull();
    expect(await shadowRows(db, "m", "t")).toBeNull();
    expect(await shadowRows(db, "m", "u2")).toBe(0);
    expect(await captured(db)).toEqual(["core_block_commit.blocks", "m.u2"]);
    const t1 = (await digestRows(db))["m.t"];
    await runBlock(again);
    const rows = await digestRows(db);
    // m.t keeps the row of its last digested change; m.u2 is digested from its first change on.
    expect(rows["m.t"]).toEqual(t1);
    expect(rows["m.u2"]?.height).toBe(2n);
    expect(rows["m.u"]).toBeUndefined();
  }, 60_000);

  it("captures a partition a later migration adds, through its partitioned table", async () => {
    const { db } = await backend.database("SELECT 1");
    const v1 = [
      "CREATE TABLE m.p (height bigint PRIMARY KEY) PARTITION BY RANGE (height); " +
        "CREATE TABLE m.p_1 PARTITION OF m.p FOR VALUES FROM (0) TO (10)",
    ];
    const chain = await startChain(db, [moduleM({ tables: ["p"], migrations: v1, writes: (h) => [`INSERT INTO m.p VALUES (${h})`] })]);
    await runBlock(chain);
    const v2 = [...v1, "CREATE TABLE m.p_2 PARTITION OF m.p FOR VALUES FROM (10) TO (20)"];
    const again = await restart(chain, moduleM({ tables: ["p"], migrations: v2, writes: () => ["INSERT INTO m.p VALUES (15)"] }));
    const before = (await digestRows(db))["m.p"];
    await runBlock(again);
    const d2 = sha256(hex(before?.digest ?? ""), hex("02"), hex("81 82"), text("insert"), hex("81 0f"));
    expect((await digestRows(db))["m.p"]).toEqual({ height: 2n, digest: d2 });
  }, 60_000);

  it("enables again at the next startup a capture trigger disabled by hand", async () => {
    const { db } = await backend.database("SELECT 1");
    const module = moduleM({ tables: ["t"], migrations: ["CREATE TABLE m.t (k bigint PRIMARY KEY)"] });
    const chain = await startChain(db, [module]);
    await db.transaction((tx) => tx.execute(`ALTER TABLE m.t DISABLE TRIGGER ${CAPTURE_TRIGGER}`));
    expect(await triggerEnabled(db, "m.t")).toBe(false);
    await restart(chain, module);
    expect(await triggerEnabled(db, "m.t")).toBe(true);
  }, 60_000);

  it("takes a block's first touch over a row written outside any block: only this transaction's touches count", async () => {
    const { db } = await backend.database("SELECT 1");
    const module = moduleM({
      tables: ["t"],
      migrations: ["CREATE TABLE m.t (k bigint PRIMARY KEY, v text NOT NULL)"],
      writes: (h) => (h === 1n ? ["INSERT INTO m.t (k, v) VALUES (1, 'a')"] : ["UPDATE m.t SET v = 'c' WHERE k = 1"]),
    });
    const chain = await startChain(db, [module]);
    await runBlock(chain);
    const d1 = (await digestRows(db))["m.t"];
    // Writes outside any block (no block's changes, DT-4) leave shadow rows of their own transaction behind.
    await db.transaction(async (tx) => {
      await tx.execute("SET LOCAL ROLE umbradb_m_m");
      await tx.execute("UPDATE m.t SET v = 'b' WHERE k = 1");
      await tx.execute("INSERT INTO m.t (k, v) VALUES (2, 'z')");
    });
    expect(await shadowRows(db, "m", "t")).toBe(2);
    // The next block's first touch of key 1 replaces its row: its change is from the row as the block found it ('b');
    // key 2, which the block did not touch, is no change of the block.
    await runBlock(chain);
    const d2 = sha256(hex(d1?.digest ?? ""), hex("02"), hex("81 82"), text("update"), hex("82 01"), text("c"));
    expect((await digestRows(db))["m.t"]).toEqual({ height: 2n, digest: d2 });
    expect(await shadowRows(db, "m", "t")).toBe(0);
  }, 60_000);

  it("reads an ordinary table with ONLY: a table inheriting from it is a table of its own", async () => {
    const { db } = await backend.database("SELECT 1");
    const module = moduleM({
      tables: ["t", "child"],
      migrations: [
        "CREATE TABLE m.t (k bigint PRIMARY KEY, v text NOT NULL); " +
          "CREATE TABLE m.child (PRIMARY KEY (k)) INHERITS (m.t)",
      ],
      writes: (h) => (h === 1n ? ["INSERT INTO m.child (k, v) VALUES (1, 'kid')"] : ["INSERT INTO m.t (k, v) VALUES (1, 'parent')"]),
    });
    const chain = await startChain(db, [module]);
    await runBlock(chain);
    await runBlock(chain);
    // m.t's change at 2 is its own row, not the child's row of the same key.
    const t2 = sha256(new Uint8Array(32), hex("02"), hex("81 82"), text("insert"), hex("82 01"), text("parent"));
    const child1 = sha256(new Uint8Array(32), hex("01"), hex("81 82"), text("insert"), hex("82 01"), text("kid"));
    const rows = await digestRows(db);
    expect(rows["m.t"]).toEqual({ height: 2n, digest: t2 });
    expect(rows["m.child"]).toEqual({ height: 1n, digest: child1 });
  }, 60_000);

  it("keys its shadow tables with the columns' own collations, and orders changes by the keys' bytes", async () => {
    const { db } = await backend.database("SELECT 1");
    const module = moduleM({
      tables: ["names"],
      migrations: ['CREATE TABLE m.names (a text COLLATE "C", b text COLLATE "und-x-icu", PRIMARY KEY (a, b))'],
      writes: () => ["INSERT INTO m.names (a, b) VALUES ('b', 'x'), ('B', 'x'), ('a', 'y'), ('a', 'B')"],
    });
    const chain = await startChain(db, [module]);
    await runBlock(chain);
    // DT-2: by the bytes of the key, column by column — "B" < "a" < "b", and in the second column "B" < "y".
    const changes = concatBytes(
      hex("84"),
      ...[
        ["B", "x"],
        ["a", "B"],
        ["a", "y"],
        ["b", "x"],
      ].map(([a, b]) => concatBytes(hex("82"), text("insert"), hex("82"), text(a as string), text(b as string))),
    );
    expect((await digestRows(db))["m.names"]).toEqual({ height: 1n, digest: sha256(new Uint8Array(32), hex("01"), changes) });
  }, 60_000);

  it.runIf(backend.name.startsWith("PostgreSQL"))(
    "keys a shadow table with a nondeterministic collation as its table does: one change for one key (PostgreSQL)",
    async () => {
      // PGlite 0.5.10's ICU treats this collation as deterministic ('a' = 'A' is false there), so this runs on
      // PostgreSQL alone (docs/issues: nondeterministic collations differ between the backends).
      const { db } = await backend.database("SELECT 1");
      const module = moduleM({
        tables: ["names"],
        migrations: [
          "CREATE COLLATION m.ci (provider = icu, locale = 'und-u-ks-level2', deterministic = false); " +
            "CREATE TABLE m.names (k text COLLATE m.ci PRIMARY KEY, v bigint NOT NULL)",
        ],
        writes: (h) =>
          h === 1n
            ? ["INSERT INTO m.names (k, v) VALUES ('a', 1)"]
            : ["DELETE FROM m.names WHERE k = 'a'", "INSERT INTO m.names (k, v) VALUES ('A', 2)"],
      });
      const chain = await startChain(db, [module]);
      await runBlock(chain);
      const d1 = (await digestRows(db))["m.names"];
      await runBlock(chain);
      // 'a' and 'A' are one key in the table: one change, the row as it is now.
      const d2 = sha256(hex(d1?.digest ?? ""), hex("02"), hex("81 82"), text("update"), hex("82"), text("A"), hex("02"));
      expect((await digestRows(db))["m.names"]).toEqual({ height: 2n, digest: d2 });
    },
    60_000,
  );

  it("refuses to capture a table without a primary key: DT-6's check, which refuses it first, runs before", async () => {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [moduleM({ tables: ["t"], migrations: ["CREATE TABLE m.t (k bigint PRIMARY KEY)"] })]);
    await db.transaction(async (tx) => {
      await tx.execute("SET LOCAL ROLE umbradb_m_m");
      await tx.execute("CREATE TABLE m.nokey (v text)");
    });
    const refused = await db.transaction((tx) => captureTables(tx, chain.plan, ["m"])).then(
      () => undefined,
      (error: unknown) => error,
    );
    expect((refused as Error).message).toBe("change capture: m.nokey has no primary key (DT-6's check runs first)");
  }, 60_000);

  it("digests a shared item's table, written under the item's role", async () => {
    const { db } = await backend.database("SELECT 1");
    const provider = testModule("logs-full", {
      provides: [
        {
          name: "contract-logs",
          lifetimes: ["block", "table"],
          table: { schema: "contract_logs", tables: ["logs"], kind: "append-only" },
        },
      ],
      migrations: [{ id: "001", sql: "CREATE TABLE contract_logs.logs (height bigint PRIMARY KEY, n numeric)" }],
      points: {
        async "on-db-write"(_p, b, w) {
          await w.execute("INSERT INTO contract_logs.logs (height, n) VALUES ($1, 1)", [b.height]);
        },
      },
    });
    const chain = await startChain(db, [provider]);
    await runBlock(chain);
    const d1 = sha256(new Uint8Array(32), hex("01"), hex("81 82"), text("insert"), hex("82 01"), text("1"));
    expect((await digestRows(db))["contract_logs.logs"]).toEqual({ height: 1n, digest: d1 });
  }, 60_000);
});

async function captureFunction(db: Database, schema: string, table: string): Promise<string> {
  const [row] = await db.read((read) =>
    read.query(
      `SELECT prosrc FROM pg_proc WHERE proname = $1 AND pronamespace = '${SHADOW_SCHEMA}'::regnamespace`,
      [captureFunctionName(schema, table)],
    ),
  );
  return row?.prosrc as string;
}

async function captured(db: Database): Promise<string[]> {
  const rows = await db.read((read) =>
    read.query(`SELECT tgrelid::regclass::text AS t FROM pg_trigger WHERE tgname = '${CAPTURE_TRIGGER}' AND tgparentid = 0`),
  );
  return rows.map((row) => row.t as string).sort();
}

async function triggerEnabled(db: Database, table: string): Promise<boolean> {
  const [row] = await db.read((read) =>
    read.query(`SELECT tgenabled <> 'D' AS enabled FROM pg_trigger WHERE tgname = '${CAPTURE_TRIGGER}' AND tgrelid = $1::regclass`, [table]),
  );
  return row?.enabled === true;
}
