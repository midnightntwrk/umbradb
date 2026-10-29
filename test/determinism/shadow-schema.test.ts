import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SHADOW_SCHEMA, shadowTableName } from "../../src/db/change-capture.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { type ConsistentRead, ModuleContentsError } from "../../src/determinism/module-tables.js";
import { catalogRelations, catalogTables } from "../../src/deterministic-postgresql/index.js";
import type { BlockWriteHandle } from "../../src/db/api.js";
import { type Chain, digestRows, runBlocks, startChain, testModule } from "../backbone/core-digest/chain.js";
import { BACKENDS, type TestDatabase } from "../db/backends.js";

/**
 * On PostgreSQL 18 and on PGlite 0.5.10, the contents hash leaves out `core_digest_shadow`, change capture's scratch
 * schema, as it leaves out PostgreSQL's own schemas and `public`. This holds whatever the schema holds (columns,
 * tables, rows, and what the rules would refuse elsewhere), while the same change in a module schema changes the hash.
 * [A150, DT-3, Q101]
 *
 * `core_chain` and `core_digest` stay hashed, because a damaged digest table must not hash as a sound one; so does an
 * operator's schema whose name merely starts with the scratch schema's. [Q101]
 *
 * Shown on a database built by hand, and on chains whose shadow tables the real change capture made
 * (`src/db/change-capture.ts`, `test/backbone/core-digest/chain.ts`): a release whose capture adds a column to every
 * shadow table hashes the same as the release before it. [Q101]
 *
 * The expected hash of the database built by hand is not computed by the code under test: its CBOR bytes are written
 * out by hand (RFC 8949: heads per §3, shortest form) and only SHA-256 is computed here. The negative controls run the
 * same checks through a handle whose catalog statements carry another schema list — the shadow schema back in, and
 * `core_digest` left out too — and show them failing.
 */

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The text the catalog statements leave the scratch schema out by; the negative controls replace it. */
const LEFT_OUT = `'${SHADOW_SCHEMA}'`;

/**
 * Handles whose statements carry `replacement` where they name the scratch schema: the hash as another schema list
 * would make it (the negative controls). `changed` counts the statements rewritten through every handle it made, so a
 * control cannot pass because the text it looks for is gone.
 */
function relisting(replacement: string): { wrap(read: ConsistentRead): ConsistentRead; changed(): number } {
  let changed = 0;
  return {
    wrap: (read) => ({
      query(sql, params) {
        if (sql.includes(LEFT_OUT)) changed++;
        return read.query(sql.replaceAll(LEFT_OUT, replacement), params);
      },
    }),
    changed: () => changed,
  };
}

/** The shadow schema back in the list (a name already left out stands in for it). */
const SHADOW_BACK_IN = "'information_schema'";
/** `core_digest` left out too: the rejected alternative that also leaves out the digest schema. [Q101] */
const CORE_DIGEST_OUT_TOO = `${LEFT_OUT}, 'core_digest'`;

async function refusal(run: () => Promise<unknown>): Promise<ModuleContentsError> {
  try {
    await run();
  } catch (error) {
    if (error instanceof ModuleContentsError) return error;
    throw error;
  }
  throw new Error("expected a ModuleContentsError, but the hash succeeded");
}

/**
 * The reserved schemas UmbraDB creates, filled by hand: `core_chain` and `core_digest` with one table each, the scratch
 * schema with what the hash must not see — a shadow table holding a row, a table without a primary key and with a
 * float, one with a `timestamp` defaulting to `now()`, an unlogged table and a sequence (each refused in a module
 * schema) —, an operator's schema `core_digest_shadow_x`, and a module schema `m`. [DT-6]
 */
const FIXED_DATABASE = `
  CREATE SCHEMA m;
  CREATE SCHEMA core_digest_shadow_x;
  CREATE SCHEMA ${SHADOW_SCHEMA};
  CREATE SCHEMA core_digest;
  CREATE SCHEMA core_chain;
  CREATE TABLE m.t (k bigint PRIMARY KEY, v text);
  INSERT INTO m.t VALUES (4, 'a');
  CREATE TABLE core_digest_shadow_x.t (k bigint PRIMARY KEY);
  INSERT INTO core_digest_shadow_x.t VALUES (3);
  CREATE TABLE ${SHADOW_SCHEMA}.t_a (xact bigint NOT NULL, existed boolean NOT NULL, c0 bigint NOT NULL, c1 text,
    PRIMARY KEY (c0));
  INSERT INTO ${SHADOW_SCHEMA}.t_a VALUES (7, true, 4, 'a');
  CREATE TABLE ${SHADOW_SCHEMA}.t_nokey (x double precision);
  INSERT INTO ${SHADOW_SCHEMA}.t_nokey VALUES (0.5);
  CREATE TABLE ${SHADOW_SCHEMA}.t_time (k bigint PRIMARY KEY, at timestamp DEFAULT now());
  INSERT INTO ${SHADOW_SCHEMA}.t_time (k) VALUES (1);
  CREATE UNLOGGED TABLE ${SHADOW_SCHEMA}.u (k bigint PRIMARY KEY);
  CREATE SEQUENCE ${SHADOW_SCHEMA}.s;
  CREATE TABLE core_digest.tables ("schema" text, "table" text, height bigint NOT NULL, digest bytea NOT NULL,
    PRIMARY KEY ("schema", "table"));
  INSERT INTO core_digest.tables VALUES ('m', 't', 7, '\\x00ff');
  CREATE TABLE core_chain.c (k bigint PRIMARY KEY);
  INSERT INTO core_chain.c VALUES (1);
`;

/**
 * The contents hash's array for {@link FIXED_DATABASE}, item by item. Schemas by bytes: "core_chain" (…5f 63) before
 * "core_digest" (…5f 64), "core_digest" before "core_digest_shadow_x" (a prefix first), both before "m";
 * `core_digest_shadow` is not there. [DT-3]
 */
const EXPECTED_CBOR: readonly (readonly [string, string])[] = [
  ["array(4): four tables, none of the scratch schema", "84"],

  ["array(4): core_chain.c", "84"],
  ['text(10) "core_chain"', "6a 63 6f 72 65 5f 63 68 61 69 6e"],
  ['text(1) "c"', "61 63"],
  ['["k"]', "81 61 6b"],
  ["[[1]]", "81 81 01"],

  ["array(4): core_digest.tables", "84"],
  ['text(11) "core_digest"', "6b 63 6f 72 65 5f 64 69 67 65 73 74"],
  ['text(6) "tables"', "66 74 61 62 6c 65 73"],
  [
    '["schema", "table", "height", "digest"]',
    "84 66 73 63 68 65 6d 61 65 74 61 62 6c 65 66 68 65 69 67 68 74 66 64 69 67 65 73 74",
  ],
  ["[[\"m\", \"t\", 7, h'00ff']]", "81 84 61 6d 61 74 07 42 00 ff"],

  ["array(4): core_digest_shadow_x.t", "84"],
  ['text(20) "core_digest_shadow_x"', "74 63 6f 72 65 5f 64 69 67 65 73 74 5f 73 68 61 64 6f 77 5f 78"],
  ['text(1) "t"', "61 74"],
  ['["k"]', "81 61 6b"],
  ["[[3]]", "81 81 03"],

  ["array(4): m.t", "84"],
  ['text(1) "m"', "61 6d"],
  ['text(1) "t"', "61 74"],
  ['["k", "v"]', "82 61 6b 61 76"],
  ['[[4, "a"]]', "81 82 04 61 61"],
];

const EXPECTED_HASH = createHash("sha256")
  .update(Buffer.from(EXPECTED_CBOR.map(([, bytes]) => bytes.replace(/ /g, "")).join(""), "hex"))
  .digest("hex");

/** A shadow table's definition as change capture writes one (`xact`, `existed`, the key's copy). */
const SHADOW_LIKE = "(xact bigint NOT NULL, existed boolean NOT NULL, c0 text NOT NULL, PRIMARY KEY (c0))";
/** A table the rules refuse in a module schema: no primary key, a float, a `timestamp`, `now()`. */
const REFUSED_LIKE = "(n real, at timestamp DEFAULT now())";

/** [what changes, the change, its undoing]: in the scratch schema, each leaves the hash as it was. */
const UNCHANGED: readonly (readonly [string, string, string])[] = [
  [
    "a column added to a shadow table",
    `ALTER TABLE ${SHADOW_SCHEMA}.t_a ADD COLUMN c2 bigint`,
    `ALTER TABLE ${SHADOW_SCHEMA}.t_a DROP COLUMN c2`,
  ],
  ["a shadow table added", `CREATE TABLE ${SHADOW_SCHEMA}.t_b ${SHADOW_LIKE}`, `DROP TABLE ${SHADOW_SCHEMA}.t_b`],
  [
    "a row added to a shadow table",
    `INSERT INTO ${SHADOW_SCHEMA}.t_a VALUES (8, false, 5, NULL)`,
    `DELETE FROM ${SHADOW_SCHEMA}.t_a WHERE c0 = 5`,
  ],
  [
    "a table the rules refuse added to the scratch schema",
    `CREATE TABLE ${SHADOW_SCHEMA}.t_c ${REFUSED_LIKE}`,
    `DROP TABLE ${SHADOW_SCHEMA}.t_c`,
  ],
  [
    "a sequence and an unlogged table added to the scratch schema",
    `CREATE SEQUENCE ${SHADOW_SCHEMA}.s2; CREATE UNLOGGED TABLE ${SHADOW_SCHEMA}.u2 (k bigint PRIMARY KEY)`,
    `DROP SEQUENCE ${SHADOW_SCHEMA}.s2; DROP TABLE ${SHADOW_SCHEMA}.u2`,
  ],
];

/** [what changes, the change, its undoing]: the same changes elsewhere, each changing the hash. */
const CHANGED: readonly (readonly [string, string, string])[] = [
  ["a column added to a module table", "ALTER TABLE m.t ADD COLUMN c2 bigint", "ALTER TABLE m.t DROP COLUMN c2"],
  ["a table added to a module schema", `CREATE TABLE m.t_b ${SHADOW_LIKE}`, "DROP TABLE m.t_b"],
  ["a row added to a module table", "INSERT INTO m.t VALUES (5, NULL)", "DELETE FROM m.t WHERE k = 5"],
  [
    "a column added to a core_digest table (the digests stay hashed)",
    "ALTER TABLE core_digest.tables ADD COLUMN c2 bigint",
    "ALTER TABLE core_digest.tables DROP COLUMN c2",
  ],
  ["a table added to core_digest", `CREATE TABLE core_digest.t_b ${SHADOW_LIKE}`, "DROP TABLE core_digest.t_b"],
  [
    "a digest changed in core_digest",
    "UPDATE core_digest.tables SET digest = '\\x01ff'",
    "UPDATE core_digest.tables SET digest = '\\x00ff'",
  ],
  ["a table added to core_chain", `CREATE TABLE core_chain.t_b ${SHADOW_LIKE}`, "DROP TABLE core_chain.t_b"],
  [
    "a table added to core_digest_shadow_x, an operator's schema named like the scratch schema",
    `CREATE TABLE core_digest_shadow_x.t_b ${SHADOW_LIKE}`,
    "DROP TABLE core_digest_shadow_x.t_b",
  ],
  [
    "a table added to pgx, an operator's schema named like PostgreSQL's own (pg_*) but not one of them",
    `CREATE SCHEMA pgx; CREATE TABLE pgx.t_b ${SHADOW_LIKE}`,
    "DROP SCHEMA pgx CASCADE",
  ],
];

/** Module `m` of the chains: one table, written at every height (an upsert, and a delete every third height). */
const MODULE_M = testModule("m", {
  provides: [{ name: "m-rows", lifetimes: ["table"], table: { schema: "m", tables: ["t"], kind: "mutable" } }],
  migrations: [{ id: "001", sql: "CREATE TABLE m.t (k bigint PRIMARY KEY, v text NOT NULL)" }],
  points: {
    async "on-db-write"(_p, b, w: BlockWriteHandle) {
      await w.execute("INSERT INTO m.t (k, v) VALUES ($1, $2) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v", [
        b.height % 4n,
        `v${b.height}`,
      ]);
      if (b.height % 3n === 0n) await w.execute("DELETE FROM m.t WHERE k = $1", [(b.height + 1n) % 4n]);
    },
  },
});

describe.each(BACKENDS)("A150: the contents hash leaves out core_digest_shadow, on $name (DT-3, Q101)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  describe("a database built by hand", () => {
    let fixed: TestDatabase;
    // Every check below compares with the hash written out by hand, which the first one shows the code gives.
    const base = EXPECTED_HASH;
    const hashOf = (read: (r: ConsistentRead) => ConsistentRead = (r) => r) =>
      fixed.db.read(async (r) => hex(await contentsHash(read(r))));

    beforeAll(async () => {
      fixed = await backend.database(FIXED_DATABASE);
    }, 120_000);

    /** Runs `check` with `change` applied, and undoes it whatever the check found, so no test sees another's change. */
    async function withChange(change: string, restore: string, check: () => Promise<void>): Promise<void> {
      await fixed.exec(change);
      try {
        await check();
      } finally {
        await fixed.exec(restore);
      }
    }

    it("equals SHA-256 of DT-3's array written by hand: no scratch schema in it, whatever it holds", async () => {
      expect(await hashOf()).toBe(EXPECTED_HASH);
      // At every page size as well.
      expect(hex(await fixed.db.read((r) => contentsHash(r, { pageSize: 1 })))).toBe(EXPECTED_HASH);
    }, 60_000);

    for (const [what, change, restore] of UNCHANGED) {
      it(`does not change with ${what}`, async () => {
        await withChange(change, restore, async () => expect(await hashOf()).toBe(base));
        expect(await hashOf()).toBe(base);
      }, 60_000);
    }

    for (const [what, change, restore] of CHANGED) {
      it(`changes with ${what}, and returns when it is undone`, async () => {
        await withChange(change, restore, async () => expect(await hashOf()).not.toBe(base));
        expect(await hashOf()).toBe(base);
      }, 60_000);
    }

    it("refuses in a module schema the table the scratch schema may hold", async () => {
      await withChange(`CREATE TABLE m.t_c ${REFUSED_LIKE}`, "DROP TABLE m.t_c", async () => {
        const error = await refusal(() => hashOf());
        expect([error.reason, error.schema, error.table]).toEqual(["no-primary-key", "m", "t_c"]);
      });
      expect(await hashOf()).toBe(base);
    }, 60_000);

    it("leaves the scratch schema out of catalog reads given schemas too (DT-6 at startup, the CHECKs)", async () => {
      const schemas = [SHADOW_SCHEMA, "m"];
      const tables = await fixed.db.read((r) => catalogTables(r, { schemas }));
      expect(tables.map((t) => [t.schema, t.name])).toEqual([["m", "t"]]);
      expect(await fixed.db.read((r) => catalogRelations(r, { schemas }))).toEqual([]);
      // Control: the same sequence in a module schema is listed.
      await withChange("CREATE SEQUENCE m.s", "DROP SEQUENCE m.s", async () => {
        const listed = await fixed.db.read((r) => catalogRelations(r, { schemas }));
        expect(listed.map((relation) => [relation.schema, relation.name, relation.kind])).toEqual([["m", "s", "S"]]);
      });
    }, 60_000);

    it("negative control: with the scratch schema back in the list, the hash reads it and refuses it", async () => {
      const back = relisting(SHADOW_BACK_IN);
      const error = await refusal(() => hashOf(back.wrap));
      // The first refusal in the hash's table order: the scratch schema's table without a primary key. [DT-3]
      expect([error.reason, error.schema, error.table]).toEqual(["no-primary-key", SHADOW_SCHEMA, "t_nokey"]);
      // The tables', the columns' and the relations' statements all named it.
      expect(back.changed()).toBe(3);
    }, 60_000);

    it("negative control: with core_digest left out too (Q101's option C), the hash is not DT-3's", async () => {
      const withoutDigests = relisting(CORE_DIGEST_OUT_TOO);
      const without = await hashOf(withoutDigests.wrap);
      expect(withoutDigests.changed()).toBe(3);
      expect(without).not.toBe(EXPECTED_HASH);
      // And a changed digest goes unseen, which the checks above see.
      await withChange(
        "UPDATE core_digest.tables SET digest = '\\x01ff'",
        "UPDATE core_digest.tables SET digest = '\\x00ff'",
        async () => expect(await hashOf(withoutDigests.wrap)).toBe(without),
      );
      expect(await hashOf()).toBe(base);
    }, 60_000);
  });

  describe("chains whose shadow tables the real change capture made", () => {
    /** A chain of module `m` run to height `to`, with its database's own handle for changes outside the API. */
    async function chainTo(to: bigint): Promise<{ readonly chain: Chain; readonly test: TestDatabase }> {
      const test = await backend.database("SELECT 1");
      const chain = await startChain(test.db, [MODULE_M]);
      await runBlocks(chain, to);
      return { chain, test };
    }

    const hashOf = (chain: Chain, read: (r: ConsistentRead) => ConsistentRead = (r) => r) =>
      chain.db.read(async (r) => hex(await contentsHash(read(r), { optedOut: chain.plan.optedOut })));

    /** The shadow tables of a chain's database, by name. */
    const shadowTables = (chain: Chain) =>
      chain.db.read(async (r) =>
        (
          await r.query(
            `SELECT c.relname::text AS name FROM pg_catalog.pg_class c
              WHERE c.relnamespace = '${SHADOW_SCHEMA}'::regnamespace AND c.relkind = 'r' ORDER BY 1`,
          )
        ).map((row) => row.name as string),
      );

    /** What a later release's capture might do: a column more in every shadow table, and one shadow table more. */
    async function changeCaptureLayout(chain: Chain, test: TestDatabase): Promise<void> {
      const tables = await shadowTables(chain);
      for (const name of tables) await test.exec(`ALTER TABLE ${SHADOW_SCHEMA}."${name}" ADD COLUMN extra bigint`);
      await test.exec(
        `CREATE TABLE ${SHADOW_SCHEMA}."${shadowTableName("m", "gone")}" ${SHADOW_LIKE};
         INSERT INTO ${SHADOW_SCHEMA}."${shadowTableName("m", "gone")}" VALUES (1, true, 'left by a crash')`,
      );
    }

    it("hashes equal when one chain's capture has another layout, differently for the same change in m", async () => {
      const a = await chainTo(2n);
      const b = await chainTo(2n);
      // The precondition: capture made the shadow tables of the block table and of m.t.
      expect(await shadowTables(b.chain)).toEqual(
        [shadowTableName("core_block_commit", "blocks"), shadowTableName("m", "t")].sort(),
      );
      await changeCaptureLayout(b.chain, b.test);
      // Capture keeps working with the column more; both chains run the same blocks.
      await runBlocks(a.chain, 7n);
      await runBlocks(b.chain, 7n);
      const rows = (chain: Chain) => chain.db.read((r) => r.query("SELECT k, v FROM m.t ORDER BY k"));
      expect(await rows(b.chain)).toEqual(await rows(a.chain));
      expect((await rows(a.chain)).length).toBeGreaterThan(0);
      // And it captured the same changes: the digests agree, m.t's last changed at 7 (the hash covers them too).
      const digests = await digestRows(a.chain.db);
      expect(digests["m.t"]?.height).toBe(7n);
      expect(await digestRows(b.chain.db)).toEqual(digests);
      const hash = await hashOf(a.chain);
      expect(await hashOf(b.chain)).toBe(hash);
      // The same change in the module's schema: a column more in m.t, then a table more in m.
      await b.test.exec("ALTER TABLE m.t ADD COLUMN extra bigint");
      expect(await hashOf(b.chain)).not.toBe(hash);
      await b.test.exec("ALTER TABLE m.t DROP COLUMN extra");
      expect(await hashOf(b.chain)).toBe(hash);
      await b.test.exec(`CREATE TABLE m."${shadowTableName("m", "gone")}" ${SHADOW_LIKE}`);
      expect(await hashOf(b.chain)).not.toBe(hash);
    }, 180_000);

    it("negative control: with the scratch schema back in the list, the two chains hash differently", async () => {
      const a = await chainTo(3n);
      const b = await chainTo(3n);
      const back = relisting(SHADOW_BACK_IN);
      // Before the layout changes the two agree even so: their shadow tables are alike and empty at rest.
      expect(await hashOf(b.chain, back.wrap)).toBe(await hashOf(a.chain, back.wrap));
      await changeCaptureLayout(b.chain, b.test);
      expect(await hashOf(b.chain, back.wrap)).not.toBe(await hashOf(a.chain, back.wrap));
      expect(back.changed()).toBe(12);
      expect(await hashOf(b.chain)).toBe(await hashOf(a.chain));
    }, 180_000);
  });
});
