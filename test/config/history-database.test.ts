import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readConfigHash, readConfigRows, recordHistory } from "../../src/backbone/core-chain/index.js";
import { readPublicConfiguration } from "../../src/backbone/core-private-source/index.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { versionEntry } from "../../src/config/entries.js";
import { canonicalJson, configHashOf, dataHash } from "../../src/config/history.js";
import type { Database, Transaction } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { schemaPlan } from "../../src/modules/adapters.js";
import { CORE_BLOCK_COMMIT } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { BACKENDS } from "../db/backends.js";
import {
  CORE,
  CORE_DATA,
  core,
  HISTORIC,
  M_0_9,
  M_1_0,
  M_1_1,
  M_BAR,
  M_FOO,
  moduleM,
  oldCore,
} from "./history-fixtures.js";
import { historyInput, historyRows, migrationRows, rejection, startup, storedRows } from "./history-startup.js";

/**
 * The configuration history in `core_chain.config`, on both backends, through a startup standing in for the
 * runner's (`./history-startup.ts`). The history is read and checked before any migration. Then `startDatabase` runs
 * with `core-chain` first: its migration `001` creates the table, and its `on-start-db` compares again and records, in
 * one transaction. The pure rules are tested in `./history.test.ts`; this file tests the rows, the transactions and
 * what the database holds after each startup. [CF-5, CF-6, CF-7, CF-8, A28, A30, A31, A33]
 *
 * Tested elsewhere: "startup refuses" through the runner's refused state, "processing continues" after the core's stop
 * is raised, and the cursor read from the `blocks` table. Here the cursor is given. [A72]
 *
 * The committed negative controls:
 * - the version check run after the migrations instead of before: the refusal still comes, but a
 *   `core_chain.migrations` row was added, which must not happen; [A33]
 * - the delete of an omitted row above the cursor committed outside the transaction that records: a failure between
 *   the delete and the insert then leaves a history no configuration was accepted with. [A30, Q103 B]
 */

/** `m` 1.0.0's revision from `start`. */
function m(start: number, config: Record<string, unknown> = {}, stop?: number) {
  return M_1_0.entry({ start, ...(stop === undefined ? {} : { stop }), config });
}

const M_DEFAULTS = { limit: 10, mode: "full" } as const;

/** `m`'s table item for a build whose `m` 1.0.0 names its table item otherwise (for the test of `provides`). */
const M_ALL = { name: "m-all", lifetimes: ["table" as const], table: { schema: "m", tables: ["rows"], kind: "append-only" as const } };

/** Each row's `provides`, as `<id>@<start> <items…>`, in key order. [PP-13] */
async function providesRows(db: Database): Promise<string[]> {
  const rows = await db.read((read) =>
    read.query(`SELECT entry_id, start, provides FROM core_chain.config ORDER BY entry_id COLLATE "C", start`),
  );
  return rows.map((row) => [`${row.entry_id as string}@${String(row.start)}`, ...(row.provides as string[])].join(" "));
}

/** The core version's canonical JSON, as `core_chain.config.version` holds it. */
const CORE_VERSION_TEXT = canonicalJson(buildCoreVersion());

/** The failure {@link failingSecondWrite} injects. */
const FAILURE = "failure between the delete and the insert";

/** A statement's verb: `DELETE`, `INSERT`, … */
const verbOf = (sql: string): string => sql.trimStart().split(/\s/, 1)[0] as string;

/**
 * `tx` with its writes logged in `statements` by verb, failing the second write of the log — in recording a moved
 * entry, the second of its delete and its insert, whichever comes first: a failure between the two.
 */
function failingSecondWrite(tx: Pick<Transaction, "query" | "execute">, statements: string[]): Pick<Transaction, "query" | "execute"> {
  return {
    query: (sql, params) => tx.query(sql, params),
    execute: async (sql, params) => {
      statements.push(verbOf(sql));
      if (statements.length === 2) throw new Error(FAILURE);
      return tx.execute(sql, params);
    },
  };
}

/** `tx` running only the deletes of a recording (its inserts dropped), each logged in `statements`. */
function deletesOnly(tx: Pick<Transaction, "query" | "execute">, statements: string[]): Pick<Transaction, "query" | "execute"> {
  return {
    query: (sql, params) => tx.query(sql, params),
    execute: async (sql, params) => {
      if (verbOf(sql) !== "DELETE") return 0;
      statements.push(verbOf(sql));
      return tx.execute(sql, params);
    },
  };
}

describe.each(BACKENDS)("the configuration history in core_chain.config, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop());

  const fresh = async (): Promise<Database> => (await backend.database("SELECT 1")).db;

  describe("CF-7: the table and its rows", () => {
    it("is created by core-chain's migration 001, as the login, with design §10's columns, key and checks", async () => {
      const db = await fresh();
      const started = await startup(db, { entries: [CORE, m(0)], user: [M_1_0], cursor: null });
      expect(started.applied).toEqual([
        { module: "core-chain", migration: "001", position: 1 },
        { module: "m", migration: "001", position: 1 },
      ]);
      const columns = await db.read((read) =>
        read.query(
          `SELECT attname AS name, format_type(atttypid, atttypmod) AS type, attnotnull AS not_null
             FROM pg_attribute WHERE attrelid = 'core_chain.config'::regclass AND attnum > 0 AND NOT attisdropped
             ORDER BY attnum`,
        ),
      );
      expect(columns).toEqual([
        { name: "entry_id", type: "text", not_null: true },
        { name: "start", type: "bigint", not_null: true },
        { name: "stop", type: "bigint", not_null: false },
        { name: "version", type: "text", not_null: true },
        { name: "data", type: "jsonb", not_null: false },
        { name: "data_hash", type: "bytea", not_null: false },
        { name: "provides", type: "text[]", not_null: true },
      ]);
      const constraints = await db.read((read) =>
        read.query(
          `SELECT contype AS type, pg_get_constraintdef(oid) AS definition FROM pg_constraint
             WHERE conrelid = 'core_chain.config'::regclass AND contype IN ('p', 'c')
             ORDER BY contype, pg_get_constraintdef(oid) COLLATE "C"`,
        ),
      );
      expect(constraints.map((row) => `${row.type as string} ${row.definition as string}`)).toEqual([
        "c CHECK ((((data IS NULL) AND (data_hash IS NULL)) OR ((data IS NOT NULL) AND (octet_length(data_hash) = 32))))",
        "c CHECK (((entry_id <> 'core'::text) OR (stop IS NULL)))",
        "c CHECK ((start >= 0))",
        "c CHECK ((stop >= start))",
        "p PRIMARY KEY (entry_id, start)",
      ]);
      const [owner] = await db.read((read) =>
        read.query("SELECT pg_get_userbyid(relowner) = current_user AS login FROM pg_class WHERE oid = 'core_chain.config'::regclass"),
      );
      expect(owner).toEqual({ login: true });
      // Every module role reads it (through the default privileges on core_chain); none writes it. [DB-6]
      for (const { role } of schemaPlan(started.graph.modules).schemas) {
        const [privileges] = await db.read((read) =>
          read.query(
            "SELECT has_table_privilege($1, 'core_chain.config', 'SELECT') AS reads, has_table_privilege($1, 'core_chain.config', 'INSERT') AS writes",
            [role],
          ),
        );
        expect(privileges).toEqual({ reads: true, writes: false });
      }
    });

    it("records every entry of a new database: stops as written (null for core), versions, canonical data and data_hash", async () => {
      const db = await fresh();
      await startup(db, {
        entries: [core(0, { tipCap: 9 }, 10), m(0, { limit: 3, pollMs: 7, token: "t-4-3" }), m(50, {}, 70), versionEntry({ id: "m", start: 90, version: "1.1.0" })],
        user: [M_1_0],
        cursor: null,
      });
      const rows = await historyRows(db);
      expect(rows.map(({ dataHash: _hash, ...row }) => row)).toEqual([
        { id: "core", start: 0n, stop: null, version: CORE_VERSION_TEXT, data: CORE_DATA },
        { id: "m", start: 0n, stop: null, version: "1.0.0", data: { limit: 3, mode: "full" } },
        { id: "m", start: 50n, stop: 70n, version: "1.0.0", data: M_DEFAULTS },
        { id: "m", start: 90n, stop: null, version: "1.1.0", data: null },
      ]);
      const hex = (bytes: Uint8Array | null) => (bytes === null ? null : Buffer.from(bytes).toString("hex"));
      expect(rows.map((row) => hex(row.dataHash))).toEqual([
        hex(dataHash(CORE_DATA)),
        hex(dataHash({ limit: 3, mode: "full" })),
        hex(dataHash(M_DEFAULTS)),
        null,
      ]);
      // The data column holds the canonical JSON's value; operational and secret settings are nowhere.
      const stored = await storedRows(db);
      for (const [index, expected] of [CORE_DATA, { limit: 3, mode: "full" }, M_DEFAULTS].entries()) {
        const [same] = await db.read((read) =>
          read.query("SELECT data = $1::jsonb AS same FROM core_chain.config WHERE entry_id = $2 AND start = $3", [
            canonicalJson(expected),
            stored[index]?.entry_id,
            stored[index]?.start,
          ]),
        );
        expect(same).toEqual({ same: true });
      }
      const text = JSON.stringify(stored, (_key, value: unknown) => (typeof value === "bigint" ? String(value) : value));
      expect(text).not.toMatch(/t-4-3|tipCap|pollMs|token/);
      // One transaction wrote them all: core-chain's on-start-db.
      expect(new Set(stored.map((row) => row.xmin)).size).toBe(1);
    });

    it("records each revision's table items in provides: the backbone's under core, a module's, a scheduled one's this build's (PP-13)", async () => {
      const db = await fresh();
      const entries = [CORE, m(0), m(50, {}, 70), versionEntry({ id: "m", start: 90, version: "1.1.0" })];
      await startup(db, { entries, user: [M_1_0], cursor: null, backbone: [CORE_BLOCK_COMMIT] });
      expect(await providesRows(db)).toEqual(["core@0 blocks", "m@0 m-rows", "m@50 m-rows", "m@90 m-rows"]);
      // One transaction wrote them all, with the rest of each row: core-chain's on-start-db.
      expect(new Set((await storedRows(db)).map((row) => row.xmin)).size).toBe(1);
      // A build whose m 1.0.0 declares another table item: the revisions above the cursor (40) take it, and those at
      // or below it keep theirs, the core's from 0 too. An unchanged restart then writes nothing. [CF-6]
      const other = moduleM("1.0.0", { provides: [M_ALL] });
      const restart = { entries, user: [other], cursor: 40n, backbone: [CORE_BLOCK_COMMIT] } as const;
      await startup(db, restart);
      expect(await providesRows(db)).toEqual(["core@0 blocks", "m@0 m-rows", "m@50 m-all", "m@90 m-all"]);
      const before = await storedRows(db);
      await startup(db, restart);
      expect(await storedRows(db)).toEqual(before);
    });

    it("keeps a core row's stop null: the table refuses one with a stop (A31)", async () => {
      const db = await fresh();
      await startup(db, { entries: [core(0, {}, 10)], user: [], cursor: null });
      expect((await historyRows(db))[0]?.stop).toBeNull();
      const error = await rejection(
        db.transaction((tx) => tx.execute("UPDATE core_chain.config SET stop = 10 WHERE entry_id = 'core'")),
      );
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).details.sqlstate).toBe("23514");
    });
  });

  describe("A31: configuration changes only the future (CF-6)", () => {
    /** A database that recorded `m` from 10 (and the core from 0) at its first startup, then committed up to 20. */
    async function recorded(entries: readonly unknown[] = [CORE, m(10)]): Promise<Database> {
      const db = await fresh();
      await startup(db, { entries, user: [M_1_0], cursor: null });
      return db;
    }

    it("refuses a changed data field or version of an entry starting at or below the cursor, changing nothing", async () => {
      const db = await recorded();
      const before = [await storedRows(db), await migrationRows(db)];
      const data = await rejection(startup(db, { entries: [CORE, m(10, { limit: 11 }), m(30)], user: [M_1_0], cursor: 20n }));
      expect(data).toBeInstanceOf(UmbraError);
      expect((data as UmbraError).code).toBe("changes-past");
      expect((data as UmbraError).details.findings).toMatchObject([{ rule: "data", path: "entries[1].config.limit", field: "limit" }]);
      const version = await rejection(startup(db, { entries: [CORE, M_1_1.entry({ start: 10, config: {} })], user: [M_1_1], cursor: 20n }));
      expect((version as UmbraError).code).toBe("changes-past");
      expect((version as UmbraError).details.findings).toMatchObject([{ rule: "version", field: "version" }]);
      // Nothing was recorded — not even the revision from 30 — and no migration ran (1.1.0's 002 among them).
      expect([await storedRows(db), await migrationRows(db)]).toEqual(before);
    });

    it("accepts a module's stop changed above the cursor in both values, re-recording that row only", async () => {
      const db = await recorded([CORE, m(10, {}, 30), m(40)]);
      const before = await storedRows(db);
      await startup(db, { entries: [CORE, m(10, {}, 35), m(40)], user: [M_1_0], cursor: 20n });
      const after = await storedRows(db);
      expect(after.map((row) => [row.entry_id, row.start, row.stop])).toEqual([
        ["core", 0n, null],
        ["m", 10n, 35n],
        ["m", 40n, null],
      ]);
      expect(after.map((row, i) => row.xmin === before[i]?.xmin)).toEqual([true, false, true]);
    });

    it("accepts a revision starting above the cursor and records it in the same transaction as the comparison", async () => {
      const db = await recorded();
      const started = await startup(db, { entries: [CORE, m(10), m(30, { limit: 3 })], user: [M_1_0], cursor: 20n });
      expect(started.recorded.writes.map((row) => [row.id, row.start])).toEqual([["m", 30n]]);
      expect((await historyRows(db)).find((row) => row.start === 30n)?.data).toEqual({ limit: 3, mode: "full" });
    });

    it("records in the caller's transaction: rolled back with it, and compared with what that transaction sees", async () => {
      const db = await recorded();
      const before = await storedRows(db);
      const input = historyInput([CORE, m(10), m(30, { limit: 3 })], 20n, [M_1_0]);
      // Rolled back with the transaction that records: nothing of it stays.
      const sentinel = new Error("roll back");
      const rolled = await rejection(
        db.transaction(async (tx) => {
          await recordHistory(tx, input);
          const [row] = await tx.query("SELECT count(*)::int AS n FROM core_chain.config WHERE start = 30");
          expect(row).toEqual({ n: 1 });
          throw sentinel;
        }),
      );
      expect(rolled).toBe(sentinel);
      expect(await storedRows(db)).toEqual(before);
      // The comparison reads within the transaction: a change made earlier in it, not committed, is compared.
      const compared = await rejection(
        db.transaction(async (tx) => {
          await tx.execute(`UPDATE core_chain.config SET data = '{"limit": 1, "mode": "full"}' WHERE entry_id = 'm' AND start = 10`);
          await recordHistory(tx, input);
        }),
      );
      expect((compared as UmbraError).code).toBe("changes-past");
      expect(await storedRows(db)).toEqual(before);
    });

    it("leaves core_chain.config unchanged — the same rows, written by the same transactions — when only operational fields change", async () => {
      const db = await recorded([core(0, { tipCap: 5 }), m(10, { pollMs: 5 })]);
      const before = await storedRows(db);
      const started = await startup(db, {
        entries: [core(0, { tipCap: 6, slowBlockMs: 7, node: "wss://other" }), m(10, { pollMs: 6, token: "secret-4-3" })],
        user: [M_1_0],
        cursor: 20n,
      });
      expect(started.recorded.writes).toEqual([]);
      expect(await storedRows(db)).toEqual(before);
    });

    it("gives the configuration hash of the recorded rows: the same after only operational or secret fields changed, another after a data field (RN-16, PP-14)", async () => {
      const db = await recorded([core(0, { tipCap: 5 }), m(10, { pollMs: 5 }), m(30, { limit: 4 })]);
      const first = await db.read((read) => readConfigHash(read));
      expect(first).toMatch(/^0x[0-9a-f]{64}$/);
      const rows = await db.read((read) => readConfigRows(read));
      expect(first).toBe(configHashOf(rows ?? []));
      expect(rows?.map((row) => `${row.id}@${row.start} ${row.version === CORE_VERSION_TEXT ? "core" : row.version}`).sort()).toEqual([
        "core@0 core",
        "m@10 1.0.0",
        "m@30 1.0.0",
      ]);
      // A private process reads the same hash from the public database (its check without a transport). [PP-14]
      expect((await db.read((read) => readPublicConfiguration(read))).configHash).toBe(first);
      await startup(db, {
        entries: [core(0, { tipCap: 6, node: "wss://u:other-secret@node" }), m(10, { pollMs: 6, token: "secret-4-3" }), m(30, { limit: 4 })],
        user: [M_1_0],
        cursor: 20n,
      });
      expect(await db.read((read) => readConfigHash(read))).toBe(first);
      // The revision above the cursor with a data field changed: the same rows, another data_hash.
      await startup(db, { entries: [core(0, { tipCap: 6 }), m(10, { pollMs: 6 }), m(30, { limit: 5 })], user: [M_1_0], cursor: 20n });
      expect(await db.read((read) => readConfigHash(read))).not.toBe(first);
      // Before the table exists: the hash of no rows, and no public configuration.
      const empty = await fresh();
      expect(await empty.read((read) => readConfigRows(read))).toBeNull();
      expect(await empty.read((read) => readConfigHash(read))).toBe(configHashOf([]));
      expect(await empty.read((read) => readPublicConfiguration(read))).toEqual({ items: [], configHash: null });
    });

    it("accepts a restart after the core stopped at its stop 10 with stop 20, or without a stop, with no history change", async () => {
      const db = await recorded([core(0, {}, 10), m(0)]);
      const before = await storedRows(db);
      for (const entries of [[core(0, {}, 20), m(0)], [CORE, m(0)]]) {
        const started = await startup(db, { entries, user: [M_1_0], cursor: 10n });
        expect(await storedRows(db)).toEqual(before);
        // Nothing the startup gives the runner ends at 10: the graph runs on past it (the runner's stop is tested elsewhere).
        expect(started.graph.rangeAt(11n)?.order.map((part) => part.id)).toContain("m");
        expect(started.graph.ranges.at(-1)?.range.to).toBeNull();
      }
    });
  });

  describe("A30: revisions by (id, start) (CF-5)", () => {
    it("refuses a configuration omitting a recorded entry at or below the cursor with missing-entry, changing nothing", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(1), m(50)], user: [M_1_0], cursor: null });
      const before = await storedRows(db);
      const error = await rejection(startup(db, { entries: [CORE, m(1)], user: [M_1_0], cursor: 50n }));
      expect((error as UmbraError).code).toBe("missing-entry");
      expect((error as UmbraError).details.missing).toEqual([{ id: "m", start: 50 }]);
      expect(await storedRows(db)).toEqual(before);
    });

    it("draws Q103's line exactly: an entry starting at the cursor must stay, one at cursor + 1 is deleted when omitted", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0), m(20), m(21)], user: [M_1_0], cursor: null });
      const before = await storedRows(db);
      const error = await rejection(startup(db, { entries: [CORE, m(0), m(21)], user: [M_1_0], cursor: 20n }));
      expect((error as UmbraError).code).toBe("missing-entry");
      expect((error as UmbraError).details.missing).toEqual([{ id: "m", start: 20 }]);
      expect(await storedRows(db)).toEqual(before);
      const started = await startup(db, { entries: [CORE, m(0), m(20)], user: [M_1_0], cursor: 20n });
      expect(started.recorded.deletes.map((row) => [row.id, row.start])).toEqual([["m", 21n]]);
      expect(started.recorded.writes).toEqual([]);
      // The rows kept are untouched — written by the same transactions as before —, and (m, 21) is gone.
      expect(await storedRows(db)).toEqual(before.slice(0, 3));
      expect(before[3]).toMatchObject({ entry_id: "m", start: 21n });
    });

    it("deletes only the omitted row: the rows of its id before and after it stay as they were", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0), m(30), m(60)], user: [M_1_0], cursor: null });
      const before = await storedRows(db);
      const started = await startup(db, { entries: [CORE, m(0), m(60)], user: [M_1_0], cursor: 20n });
      expect(started.recorded.deletes.map((row) => [row.id, row.start])).toEqual([["m", 30n]]);
      expect(await storedRows(db)).toEqual([before[0], before[1], before[3]]);
    });

    it("accepts CF-5's scenario 'A scheduled entry is moved': (m, 50) deleted and (m, 100) recorded by core-chain", async () => {
      const db = await fresh();
      const scheduled = (start: number) => versionEntry({ id: "m", start, version: "1.1.0" });
      await startup(db, { entries: [CORE, core(30, { retainStates: 1 }), m(0), scheduled(50)], user: [M_1_0], cursor: null });
      const before = await storedRows(db);
      const started = await startup(db, { entries: [CORE, m(0), scheduled(100)], user: [M_1_0], cursor: 20n });
      expect(started.recorded.deletes.map((row) => [row.id, row.start])).toEqual([
        ["core", 30n],
        ["m", 50n],
      ]);
      expect(started.recorded.writes.map((row) => [row.id, row.start])).toEqual([["m", 100n]]);
      const after = await storedRows(db);
      expect(after.map((row) => [row.entry_id, row.start, row.version, row.data])).toEqual([
        ["core", 0n, CORE_VERSION_TEXT, before[0]?.data],
        ["m", 0n, "1.0.0", before[2]?.data],
        ["m", 100n, "1.1.0", null],
      ]);
      expect([after[0], after[1]]).toEqual([before[0], before[2]]);
      // The 1.0.0 build runs on past 50: m's revision from 0 ends at 99, the moved one's start − 1.
      expect(started.check.graphEntries).toEqual([
        { id: "m", start: 0n, stop: 99n },
        { id: "m", start: 100n, stop: null },
      ]);
    });

    it("deletes and records in the caller's transaction: both rolled back with it", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0), m(50)], user: [M_1_0], cursor: null });
      const before = await storedRows(db);
      const input = historyInput([CORE, m(0), m(100)], 20n, [M_1_0]);
      const sentinel = new Error("roll back");
      const rolled = await rejection(
        db.transaction(async (tx) => {
          const check = await recordHistory(tx, input);
          expect(check.deletes.map((row) => [row.id, row.start])).toEqual([["m", 50n]]);
          // Within the transaction: (m, 50) deleted, (m, 100) recorded.
          const rows = await tx.query("SELECT start FROM core_chain.config WHERE entry_id = 'm' ORDER BY start");
          expect(rows).toEqual([{ start: 0n }, { start: 100n }]);
          throw sentinel;
        }),
      );
      expect(rolled).toBe(sentinel);
      expect(await storedRows(db)).toEqual(before);
    });

    it("leaves the history as it was when recording fails between the delete and the insert", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0), m(50)], user: [M_1_0], cursor: null });
      const before = await storedRows(db);
      const input = historyInput([CORE, m(0), m(100)], 20n, [M_1_0]);
      const statements: string[] = [];
      const error = await rejection(db.transaction((tx) => recordHistory(failingSecondWrite(tx, statements), input)));
      expect((error as Error).message).toBe(FAILURE);
      expect([...statements].sort()).toEqual(["DELETE", "INSERT"]);
      expect(await storedRows(db)).toEqual(before);
    });

    it("negative control (committed): a delete outside the recording transaction fails the atomicity test", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0), m(50)], user: [M_1_0], cursor: null });
      const before = await storedRows(db);
      const input = historyInput([CORE, m(0), m(100)], 20n, [M_1_0]);
      const statements: string[] = [];
      // The same statements and the same failure, but the delete committed by a transaction of its own first.
      await db.transaction((tx) => recordHistory(deletesOnly(tx, statements), input));
      const error = await rejection(db.transaction((tx) => recordHistory(failingSecondWrite(tx, statements), input)));
      expect((error as Error).message).toBe(FAILURE);
      expect(statements).toEqual(["DELETE", "INSERT"]);
      const after = await storedRows(db);
      expect(after).not.toEqual(before);
      // (m, 50) is gone and (m, 100) was never recorded: a history no configuration was accepted with.
      expect(after.map((row) => [row.entry_id, row.start])).toEqual([
        ["core", 0n],
        ["m", 0n],
      ]);
    });

    it("lets a later revision supersede the earlier one from its start: a module that cannot start mid-chain continues", async () => {
      const db = await fresh();
      const started = await startup(db, {
        entries: [CORE, HISTORIC.entry({ start: 0, config: {} }), HISTORIC.entry({ start: 50, config: { limit: 2 } })],
        user: [HISTORIC],
        cursor: null,
      });
      expect(started.graph.segments.get("historic")).toEqual([{ from: 0n, to: null }]);
      expect((await historyRows(db)).filter((row) => row.id === "historic").map((row) => [row.start, row.stop, row.data])).toEqual([
        [0n, null, M_DEFAULTS],
        [50n, null, { limit: 2, mode: "full" }],
      ]);
    });
  });

  describe("A28's history half: versionEntry revisions against their recorded rows (CF-3, CF-6)", () => {
    it("upgrades a module whose new schema renames a setting: the old revision as a versionEntry equal to its row", async () => {
      const db = await fresh();
      await startup(db, {
        entries: [CORE, M_FOO.entry({ start: 1, config: { foo: 1 } }), versionEntry({ id: "m", start: 50, stop: 80, version: "1.1.0" })],
        user: [M_FOO],
        cursor: null,
      });
      // A scheduled revision is recorded with id, start, stop and version only.
      expect((await storedRows(db)).find((row) => row.start === 50n)).toMatchObject({
        entry_id: "m",
        stop: 80n,
        version: "1.1.0",
        data: null,
        data_hash: null,
      });
      // One carrying a config is refused by the configuration validation, and nothing is recorded.
      const before = await storedRows(db);
      const scheduled = await rejection(
        startup(db, {
          entries: [CORE, M_FOO.entry({ start: 1, config: { foo: 1 } }), versionEntry({ id: "m", start: 50, stop: 80, version: "1.1.0", config: { bar: 1 } })],
          user: [M_FOO],
          cursor: 20n,
        }),
      );
      expect((scheduled as UmbraError).code).toBe("invalid-configuration");
      expect(await storedRows(db)).toEqual(before);
      // The 1.0.0 build stopped at 49; the 1.1.0 build starts with 1.0.0's revision written as recorded. [RN-12]
      const old = versionEntry({ id: "m", start: 1, version: "1.0.0", config: { foo: 1 } });
      const started = await startup(db, { entries: [CORE, old, M_BAR.entry({ start: 50, stop: 80, config: { bar: 1 } })], user: [M_BAR], cursor: 49n });
      expect(started.applied).toEqual([{ module: "m", migration: "002", position: 2 }]);
      expect((await historyRows(db)).filter((row) => row.id === "m").map((row) => [row.start, row.version, row.data])).toEqual([
        [1n, "1.0.0", { foo: 1 }],
        [50n, "1.1.0", { bar: 1 }],
      ]);
      // A versionEntry that differs from its row refuses startup.
      const changed = versionEntry({ id: "m", start: 1, version: "1.0.0", config: { foo: 2 } });
      const error = await rejection(startup(db, { entries: [CORE, changed, M_BAR.entry({ start: 50, stop: 80, config: { bar: 1 } })], user: [M_BAR], cursor: 60n }));
      expect((error as UmbraError).code).toBe("changes-past");
      expect((error as UmbraError).details.findings).toMatchObject([{ rule: "data", path: "entries[1].config.foo" }]);
    });

    it("re-records an entry above the cursor that changed between restarts", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0), m(50, { limit: 1 })], user: [M_1_0], cursor: null });
      await startup(db, { entries: [CORE, m(0), m(50, { limit: 2 }, 70)], user: [M_1_0], cursor: 20n });
      await startup(db, { entries: [CORE, m(0), m(50, { mode: "fast" }, 60)], user: [M_1_0], cursor: 30n });
      const row = (await historyRows(db)).find((r) => r.start === 50n);
      expect(row).toMatchObject({ stop: 60n, data: { limit: 10, mode: "fast" } });
      // A scheduled revision whose version changes between restarts is re-recorded with it.
      await startup(db, { entries: [CORE, m(0), m(50, { mode: "fast" }, 60), versionEntry({ id: "m", start: 90, version: "1.1.0" })], user: [M_1_0], cursor: 30n });
      await startup(db, { entries: [CORE, m(0), m(50, { mode: "fast" }, 60), versionEntry({ id: "m", start: 90, version: "1.2.0" })], user: [M_1_0], cursor: 40n });
      expect((await historyRows(db)).find((r) => r.start === 90n)).toMatchObject({ version: "1.2.0", data: null });
      expect(Buffer.from(row?.dataHash as Uint8Array).toString("hex")).toBe(Buffer.from(dataHash({ limit: 10, mode: "fast" })).toString("hex"));
    });
  });

  describe("A33: one version per build (CF-8)", () => {
    const asRecorded = versionEntry({ id: "m", start: 0, version: "1.0.0", config: M_DEFAULTS });

    /** A database built by `m` 1.0.0 from 0, committed up to 20: its tables, records and history. */
    async function builtWith100(): Promise<Database> {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0)], user: [M_1_0], cursor: null });
      return db;
    }

    /** What a refused startup leaves: the history, the migration records and `m.rows`' columns. */
    async function state(db: Database) {
      const columns = await db.read((read) =>
        read.query("SELECT attname FROM pg_attribute WHERE attrelid = to_regclass('m.rows') AND attnum > 0 ORDER BY attnum"),
      );
      return { rows: await storedRows(db), migrations: await migrationRows(db), columns };
    }

    it("refuses a newer and an older build of a module with upgrade-required, adding no core_chain.migrations row", async () => {
      for (const [user, build] of [
        [[M_1_1], "1.1.0"],
        [[M_0_9], "0.9.0"],
      ] as const) {
        const db = await builtWith100();
        const before = await state(db);
        const entries = build === "1.1.0" ? [CORE, asRecorded, M_1_1.entry({ start: 50, config: {} })] : [CORE, asRecorded];
        const error = (await rejection(startup(db, { entries, user, cursor: 20n }))) as UmbraError;
        expect(error.code).toBe("upgrade-required");
        expect(error.details.entries).toEqual([{ id: "m", start: 0, needed: "1.0.0", build }]);
        expect(await state(db)).toEqual(before);
      }
    });

    it("refuses an older and a newer build of UmbraDB (the core entry), adding no row", async () => {
      for (const umbradb of ["0.9.4", "0.9.6"]) {
        const db = await builtWith100();
        // As recorded by that build: its core version in the row.
        await db.transaction((tx) =>
          tx.execute("UPDATE core_chain.config SET version = $1 WHERE entry_id = 'core'", [canonicalJson({ ledgers: [], umbradb })]),
        );
        const before = await state(db);
        const error = (await rejection(startup(db, { entries: [oldCore(0, umbradb), core(100), m(0)], user: [M_1_0], cursor: 20n }))) as UmbraError;
        expect(error.code).toBe("upgrade-required");
        expect(error.details.entries).toEqual([
          { id: "core", start: 0, needed: { umbradb, ledgers: [] }, build: buildCoreVersion() },
        ]);
        expect(await state(db)).toEqual(before);
      }
    });

    it("refuses on a new database before the bootstrap: no core_chain.migrations table at all", async () => {
      const db = await fresh();
      const error = await rejection(startup(db, { entries: [CORE, versionEntry({ id: "m", start: 0, version: "1.1.0" })], user: [M_1_0], cursor: null }));
      expect((error as UmbraError).code).toBe("upgrade-required");
      const [present] = await db.read((read) => read.query("SELECT to_regnamespace('core_chain') IS NOT NULL AS schema"));
      expect(present).toEqual({ schema: false });
    });

    it("negative control (committed): the version check after the migrations still refuses, but adds the rows A33 forbids", async () => {
      const db = await builtWith100();
      const before = await state(db);
      const entries = [CORE, asRecorded, M_1_1.entry({ start: 50, config: {} })];
      const error = (await rejection(startup(db, { entries, user: [M_1_1], cursor: 20n, versionCheckAfterMigrations: true }))) as UmbraError;
      expect(error.code).toBe("upgrade-required");
      const after = await state(db);
      expect(after.migrations).toEqual([...before.migrations, "m/002"]);
      expect(after.columns).not.toEqual(before.columns);
      // On a new database: core-chain's and m's migrations recorded before the refusal.
      const empty = await fresh();
      const late = await rejection(
        startup(empty, { entries: [CORE, versionEntry({ id: "m", start: 0, version: "1.1.0" })], user: [M_1_0], cursor: null, versionCheckAfterMigrations: true }),
      );
      expect((late as UmbraError).code).toBe("upgrade-required");
      expect(await migrationRows(empty)).toEqual(["core-chain/001", "m/001"]);
    });
  });

  describe("DB-10's input from the history: the versions that cover committed heights", () => {
    it("refuses a version requiring a resync where another version's revision covers committed heights", async () => {
      const db = await fresh();
      await startup(db, { entries: [CORE, m(0)], user: [M_1_0], cursor: null });
      const resync = moduleM("2.0.0", { requiresResync: true });
      const entries = [CORE, versionEntry({ id: "m", start: 0, version: "1.0.0", config: M_DEFAULTS }), resync.entry({ start: 21, config: {} })];
      const error = (await rejection(startup(db, { entries, user: [resync], cursor: 20n }))) as UmbraError;
      expect(error.code).toBe("requires-resync");
      expect(error.details).toEqual({ module: "m", version: "2.0.0", committedVersions: ["1.0.0"] });
      // A database built with it from its first revision restarts normally.
      const built = await fresh();
      await startup(built, { entries: [CORE, resync.entry({ start: 0, config: {} })], user: [resync], cursor: null });
      const again = await startup(built, { entries: [CORE, resync.entry({ start: 0, config: {} })], user: [resync], cursor: 20n });
      expect(again.check.committedVersions).toEqual(new Map([["m", ["2.0.0"]]]));
    });
  });
});
