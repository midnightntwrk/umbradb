import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CORE_DIGEST, CORE_DIGEST_MIGRATIONS } from "../../../src/backbone/core-digest/index.js";
import { CAPTURE_TRIGGER, SHADOW_SCHEMA, shadowTableName } from "../../../src/db/change-capture.js";
import type { BlockWriteHandle, Database } from "../../../src/db/api.js";
import type { ItemDeclaration, ModuleDeclaration } from "../../../src/modules/declaration.js";
import { BACKBONE_ORDER } from "../../../src/modules/graph.js";
import { validateDeclarations } from "../../../src/modules/validation.js";
import { CORE_LEDGER_STATE } from "../../../src/backbone/core-ledger-state/core-ledger-state.js";
import { LEDGER_NODE_TABLES } from "../../../src/backbone/core-ledger-state/node-set.js";
import { CORE_LEDGER_STATE_MIGRATIONS } from "../../../src/backbone/core-ledger-state/sql.js";
import { BACKENDS } from "../../db/backends.js";
import { concatBytes, fromHex } from "../../determinism/cbor-decoder.js";
import { BLOCK_COMMIT, type Chain, checkpointRows, digestRows, runBlocks, startChain, testModule } from "./chain.js";

/**
 * Table digests, on both backends. `core-digest`:
 * - keeps one digest per module table, `SHA-256(previous ‖ CBOR(h) ‖ changes at h)`, set in a block that changes the
 *   table and kept otherwise, with 32 zero bytes before its first change;
 * - writes checkpoints at exactly the heights h ≥ S with h mod 14,400 = 0, equal to the tables' rows there;
 * - digests every module table with no flag set, and not a table declared `deterministic: false`, nor a
 *   content-defined one (`core-ledger-state`'s node tables, as the build's own `ledger-state` item declares them),
 *   whose `TRUNCATE` guard and column rules stay.
 *
 * The chains run through `schemaPlan`, `startDatabase` and the block write handles, with a block loop standing in for
 * the runner's (`./chain.ts`). The interval shortened by a build flag is tested in `checkpoints.build-flag.test.ts`.
 *
 * Expected digests are computed here with `node:crypto` from CBOR written out by hand (RFC 8949), not by the code
 * under test.
 */

const hex = (text: string): Uint8Array => fromHex(text.replace(/\s+/g, ""));
const sha256 = (...parts: Uint8Array[]): string => createHash("sha256").update(concatBytes(...parts)).digest("hex");
const text = (value: string): Uint8Array => concatBytes(new Uint8Array([0x60 + value.length]), new TextEncoder().encode(value));

/** What module `m` writes at a height, in each chain; `differ` is the value chain B writes into `m.t` at height 7. */
function writes(differ: string): Readonly<Record<string, readonly (readonly [string, unknown[]])[]>> {
  return {
    "1": [
      ["INSERT INTO m.t (k, v) VALUES (1, 'a')", []],
      ["INSERT INTO m.u (k, v) VALUES (1, 'u1')", []],
    ],
    "2": [["UPDATE m.t SET v = 'b' WHERE k = 1", []]],
    "3": [["INSERT INTO m.t (k, v) VALUES (2, 'c')", []]],
    "4": [["INSERT INTO m.u (k, v) VALUES (2, 'u2')", []]],
    // A rewrite that leaves the row as it was: no change, so m.t keeps its row of height 3.
    "5": [["UPDATE m.t SET v = v WHERE k = 1", []]],
    "6": [["DELETE FROM m.t WHERE k = 2", []]],
    "7": [["INSERT INTO m.t (k, v) VALUES (3, $1)", [differ]]],
    "8": [["UPDATE m.t SET v = 'd' WHERE k = 1", []]],
    "10": [["DELETE FROM m.u WHERE k = 1", []]],
  };
}

/** Module `m`: two deterministic tables and one declared `deterministic: false`, written as {@link writes} says. */
function moduleM(differ: string): ModuleDeclaration {
  const plan = writes(differ);
  return testModule("m", {
      provides: [
        { name: "m-rows", lifetimes: ["table"], table: { schema: "m", tables: ["t", "u"], kind: "mutable" } },
        {
          name: "m-cache",
          lifetimes: ["table"],
          table: { schema: "m", tables: ["cache"], kind: "mutable", deterministic: false },
        },
      ],
      migrations: [
        {
          id: "001",
          sql:
            "CREATE TABLE m.t (k bigint PRIMARY KEY, v text NOT NULL); CREATE TABLE m.u (k bigint PRIMARY KEY, v text); " +
            "CREATE TABLE m.cache (k bigint PRIMARY KEY, v text)",
        },
      ],
      points: {
        async "on-db-write"(_p, b, w: BlockWriteHandle) {
          for (const [sql, params] of plan[String(b.height)] ?? []) await w.execute(sql, params);
          // The opted-out table changes at every height.
          await w.execute("INSERT INTO m.cache (k, v) VALUES ($1, 'x') ON CONFLICT (k) DO UPDATE SET v = 'y'", [b.height % 3n]);
        },
      },
    });
}

/** A key of 32 bytes, all `byte`. */
const key32 = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);

/**
 * `core-ledger-state`'s tables as the build's own `ledger-state` item declares them (`nodes`, `ref_counts` and
 * `unreferenced` content-defined), made by the part's own migration and written by a stand-in that inserts,
 * rewrites and deletes nodes, and changes the counts, the queue and `root_counts`, at heights 1 to 3; at
 * `truncateAt`, it truncates `table` instead.
 */
function ledgerTables(options: { readonly truncateAt?: bigint; readonly table?: string } = {}): ModuleDeclaration {
  const item = CORE_LEDGER_STATE.provides.find((candidate) => candidate.name === "ledger-state");
  const writes: Readonly<Record<string, readonly (readonly [string, unknown[]])[]>> = {
    "1": [
      ["INSERT INTO core_ledger_state.nodes VALUES ($1, '\\x01', '\\x00'), ($2, '\\x02', '\\x00')", [key32(1), key32(2)]],
      ["INSERT INTO core_ledger_state.root_counts VALUES ($1, 1)", [key32(1)]],
      ["INSERT INTO core_ledger_state.unreferenced VALUES ($1)", [key32(2)]],
    ],
    "2": [
      ["UPDATE core_ledger_state.nodes SET children = $2 WHERE node_key = $1", [key32(1), Uint8Array.of(4, 0, ...key32(2))]],
      ["INSERT INTO core_ledger_state.ref_counts VALUES ($1, 1)", [key32(2)]],
      ["DELETE FROM core_ledger_state.unreferenced WHERE node_key = $1", [key32(2)]],
    ],
    "3": [
      ["UPDATE core_ledger_state.root_counts SET count = 2 WHERE node_key = $1", [key32(1)]],
      ["INSERT INTO core_ledger_state.nodes VALUES ($1, '\\x03', '\\x00')", [key32(3)]],
      ["INSERT INTO core_ledger_state.unreferenced VALUES ($1)", [key32(3)]],
      ["DELETE FROM core_ledger_state.nodes WHERE node_key = $1", [key32(3)]],
      ["DELETE FROM core_ledger_state.unreferenced WHERE node_key = $1", [key32(3)]],
    ],
  };
  return testModule("core-ledger-state", {
    provides: [{ ...(item as ItemDeclaration), lifetimes: ["table"] }],
    migrations: CORE_LEDGER_STATE_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
    points: {
      async "on-db-write"(_p, b, w: BlockWriteHandle) {
        if (b.height === options.truncateAt) await w.execute(`TRUNCATE core_ledger_state.${options.table ?? "nodes"}`);
        for (const [sql, params] of writes[String(b.height)] ?? []) await w.execute(sql, params);
      },
    },
  });
}

describe.each(BACKENDS)("core-digest's per-table digests and checkpoints, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  /** Runs a chain to height 10, recording `core_digest.tables` after each block. */
  async function chainTo10(differ: string): Promise<{ chain: Chain; after: Map<bigint, Awaited<ReturnType<typeof digestRows>>> }> {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [moduleM(differ)]);
    const after = new Map<bigint, Awaited<ReturnType<typeof digestRows>>>();
    await runBlocks(chain, 10n, async (h) => {
      after.set(h, await digestRows(db));
    });
    return { chain, after };
  }

  it("declares core-digest as the backbone expects: its id in BACKBONE_ORDER, valid as a backbone part", () => {
    expect(BACKBONE_ORDER).toContain("core-digest");
    const set = validateDeclarations({ backbone: [BLOCK_COMMIT, CORE_DIGEST], core: [], user: [] });
    expect(set.backbone[1]).toBe(CORE_DIGEST);
    expect(CORE_DIGEST.requires).toEqual(["blocks"]);
    expect(CORE_DIGEST.provides.map((item) => [item.name, item.table?.schema, item.table?.tables])).toEqual([
      ["digest-tables", "core_digest", ["tables"]],
      ["digest-checkpoints", "core_digest", ["checkpoints"]],
    ]);
    expect(Object.keys(CORE_DIGEST.points)).toEqual(["on-db-write"]);
    expect(CORE_DIGEST.migrations).toEqual([...CORE_DIGEST_MIGRATIONS]);
  });

  it("two chains differing at height 7 in table t: other tables equal, t equal up to 6 and different from 7", async () => {
    const a = await chainTo10("x");
    const b = await chainTo10("y");
    for (let h = 1n; h <= 10n; h++) {
      const [ra, rb] = [a.after.get(h), b.after.get(h)];
      expect(Object.keys(ra ?? {}).sort()).toEqual(Object.keys(rb ?? {}).sort());
      for (const table of Object.keys(ra ?? {})) {
        if (table === "m.t" && h >= 7n) {
          expect(ra?.[table]?.digest, `${table} at ${h}`).not.toBe(rb?.[table]?.digest);
          // The height of t's last change is the same in both: only the digest differs.
          expect(ra?.[table]?.height).toBe(rb?.[table]?.height);
        } else {
          expect(ra?.[table], `${table} at ${h}`).toEqual(rb?.[table]);
        }
      }
    }
    // Every deterministic module table has its row; the opted-out one has none at any height.
    expect(Object.keys(a.after.get(10n) ?? {}).sort()).toEqual(["core_block_commit.blocks", "m.t", "m.u"]);
  }, 120_000);

  it("a table without changes at a height keeps its row; a table's row is set at each height that changes it", async () => {
    const { after } = await chainTo10("x");
    const heightOf = (table: string, h: bigint) => after.get(h)?.[table]?.height;
    // m.t changes at 1, 2, 3, 6, 7, 8 (5 rewrites a row as it was); m.u at 1, 4, 10; blocks at every height.
    expect([...after.keys()].map((h) => heightOf("m.t", h))).toEqual([1n, 2n, 3n, 3n, 3n, 6n, 7n, 8n, 8n, 8n]);
    expect([...after.keys()].map((h) => heightOf("m.u", h))).toEqual([1n, 1n, 1n, 4n, 4n, 4n, 4n, 4n, 4n, 10n]);
    expect([...after.keys()].map((h) => heightOf("core_block_commit.blocks", h))).toEqual([...after.keys()]);
    for (const [kept, at] of [
      [4n, 3n],
      [5n, 3n],
      [9n, 8n],
    ] as const) {
      expect(after.get(kept)?.["m.t"]).toEqual(after.get(at)?.["m.t"]);
    }
    expect(after.get(3n)?.["m.u"]).toEqual(after.get(1n)?.["m.u"]);
  }, 120_000);

  it("a table's first digest is SHA-256(32 zero bytes ‖ CBOR(h) ‖ changes at h), and the next one chains on it", async () => {
    const { after } = await chainTo10("x");
    // m.t at height 1: [["insert", [1, "a"]]]; at height 2: [["update", [1, "b"]]].
    const t1 = sha256(new Uint8Array(32), hex("01"), hex("81 82"), text("insert"), hex("82 01"), text("a"));
    expect(after.get(1n)?.["m.t"]).toEqual({ height: 1n, digest: t1 });
    const t2 = sha256(hex(t1), hex("02"), hex("81 82"), text("update"), hex("82 01"), text("b"));
    expect(after.get(2n)?.["m.t"]).toEqual({ height: 2n, digest: t2 });
    // m.t at height 6: [["delete", [2, "c"]]] — the old row.
    const t3 = sha256(hex(t2), hex("03"), hex("81 82"), text("insert"), hex("82 02"), text("c"));
    const t6 = sha256(hex(t3), hex("06"), hex("81 82"), text("delete"), hex("82 02"), text("c"));
    expect(after.get(6n)?.["m.t"]).toEqual({ height: 6n, digest: t6 });
    // core_block_commit.blocks at height 1: [["insert", [1]]].
    const b1 = sha256(new Uint8Array(32), hex("01"), hex("81 82"), text("insert"), hex("81 01"));
    expect(after.get(1n)?.["core_block_commit.blocks"]).toEqual({ height: 1n, digest: b1 });
    // m.u at height 1, a nullable column: [["insert", [1, "u1"]]].
    const u1 = sha256(new Uint8Array(32), hex("01"), hex("81 82"), text("insert"), hex("82 01"), text("u1"));
    expect(after.get(1n)?.["m.u"]).toEqual({ height: 1n, digest: u1 });
  }, 120_000);

  it("digests every module table with no flag set, and leaves the table declared deterministic: false alone", async () => {
    const { chain } = await chainTo10("x");
    expect(await undigested(chain.db, "m", "cache")).toBe(true);
    expect(await undigested(chain.db, "m", "t")).toBe(false);
  }, 120_000);

  it("negative control: change capture that skips the opt-out digests the opted-out table, which the last clause catches", async () => {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [moduleM("x")], { plan: (plan) => ({ ...plan, optedOut: [] }) });
    await runBlocks(chain, 3n);
    expect(await undigested(db, "m", "cache")).toBe(false);
  }, 120_000);

  it("nor a content-defined one: core_ledger_state's nodes, ref_counts and unreferenced are not digested, its root_counts are", async () => {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [moduleM("x")], { core: [ledgerTables()] });
    expect(chain.plan.contentDefined.map(({ schema, tables }) => ({ schema, tables }))).toEqual([
      { schema: "core_ledger_state", tables: ["nodes", "ref_counts", "unreferenced"] },
    ]);
    // Content-defined tables are deterministic: no opt-out.
    expect(chain.plan.optedOut).toEqual([{ schema: "m", table: "cache" }]);
    const after = new Map<bigint, Awaited<ReturnType<typeof digestRows>>>();
    await runBlocks(chain, 3n, async (h) => {
      after.set(h, await digestRows(db));
    });
    for (const table of ["nodes", "ref_counts", "unreferenced"]) {
      expect(await undigested(db, "core_ledger_state", table), table).toBe(true);
    }
    expect(await undigested(db, "core_ledger_state", "root_counts")).toBe(false);
    // root_counts changes at 1 and 3; its digest rows are set at those heights, as any digested table's.
    expect([...after.values()].map((rows) => rows["core_ledger_state.root_counts"]?.height)).toEqual([1n, 1n, 3n]);
    expect(Object.keys(after.get(3n) ?? {}).sort()).toEqual(["core_block_commit.blocks", "core_ledger_state.root_counts", "m.t", "m.u"]);
    const [stored] = await db.read((read) => read.query("SELECT count(*)::int AS n FROM core_ledger_state.nodes"));
    expect(stored?.n).toBe(2);
  }, 120_000);

  it("negative control: change capture that does not skip the content-defined tables digests them, which the clause catches", async () => {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [moduleM("x")], { core: [ledgerTables()], plan: (plan) => ({ ...plan, contentDefined: [] }) });
    await runBlocks(chain, 3n);
    expect(await undigested(db, "core_ledger_state", "nodes")).toBe(false);
  }, 120_000);

  it("keeps the rules and the TRUNCATE guard on content-defined tables", async () => {
    for (const table of ["nodes", "ref_counts", "unreferenced"]) {
      const { db } = await backend.database("SELECT 1");
      const chain = await startChain(db, [], { core: [ledgerTables({ truncateAt: 2n, table })] });
      await runBlocks(chain, 1n);
      await expect(runBlocks(chain, 2n), table).rejects.toMatchObject({ code: "truncate-not-allowed" });
    }
    const { db } = await backend.database("SELECT 1");
    const floats = testModule("core-floats", {
      provides: [
        {
          name: "floats",
          lifetimes: ["table"],
          table: { schema: "core_floats", tables: ["f"], kind: "mutable", contentDefined: { tables: ["f"], content: LEDGER_NODE_TABLES.content } },
        },
      ],
      migrations: [{ id: "001", sql: "CREATE TABLE core_floats.f (k bigint PRIMARY KEY, v real)" }],
    });
    await expect(startChain(db, [], { core: [floats] })).rejects.toMatchObject({ code: "non-deterministic-column" });
  }, 120_000);

  it("checkpoints exist exactly at the heights h >= S with h mod 14,400 = 0, equal to the tables' rows there", async () => {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [moduleM("x")], { start: 14_398n });
    let at14400: Awaited<ReturnType<typeof digestRows>> | undefined;
    await runBlocks(chain, 14_402n, async (h) => {
      if (h === 14_400n) at14400 = await digestRows(db);
    });
    const checkpoints = await checkpointRows(db);
    expect(Object.keys(checkpoints)).toEqual(["14400"]);
    expect(checkpoints["14400"]).toEqual(
      Object.fromEntries(Object.entries(at14400 ?? {}).map(([table, row]) => [table, row.digest])),
    );
    expect(Object.keys(checkpoints["14400"] ?? {}).sort()).toEqual(["core_block_commit.blocks"]);
  }, 120_000);

  it("a chain starting at genesis checkpoints at height 0 (0 mod 14,400 = 0), and at no other height below 14,400", async () => {
    const { db } = await backend.database("SELECT 1");
    const chain = await startChain(db, [moduleM("x")], { start: 0n });
    await runBlocks(chain, 3n);
    const checkpoints = await checkpointRows(db);
    expect(Object.keys(checkpoints)).toEqual(["0"]);
    // At height 0 only the blocks table and the opted-out cache changed; the checkpoint holds the digested one.
    expect(Object.keys(checkpoints["0"] ?? {})).toEqual(["core_block_commit.blocks"]);
  }, 60_000);

  it("keeps every shadow table empty outside a block, and gives core_digest to every module role to read", async () => {
    const { chain } = await chainTo10("x");
    const [row] = await chain.db.read((read) =>
      read.query(
        `SELECT (SELECT count(*)::int FROM ${SHADOW_SCHEMA}."${shadowTableName("m", "t")}") AS t_rows,
                has_table_privilege('umbradb_m_m', 'core_digest.tables', 'SELECT') AS reads_tables,
                has_table_privilege('umbradb_m_m', 'core_digest.checkpoints', 'SELECT') AS reads_checkpoints,
                has_table_privilege('umbradb_m_m', 'core_digest.tables', 'INSERT') AS writes_tables`,
      ),
    );
    expect(row).toEqual({ t_rows: 0, reads_tables: true, reads_checkpoints: true, writes_tables: false });
  }, 120_000);
});

/** True when `schema.table` is not digested: no capture trigger, no shadow table, no row of `core_digest.tables`. */
async function undigested(db: Database, schema: string, table: string): Promise<boolean> {
  const [row] = await db.read((read) =>
    read.query(
      `SELECT NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = '${CAPTURE_TRIGGER}' AND tgrelid = $1::regclass)
              AND to_regclass($2) IS NULL
              AND NOT EXISTS (SELECT 1 FROM core_digest.tables WHERE "schema" = $3 AND "table" = $4) AS undigested`,
      [`${schema}.${table}`, `${SHADOW_SCHEMA}.${shadowTableName(schema, table)}`, schema, table],
    ),
  );
  return row?.undigested === true;
}
