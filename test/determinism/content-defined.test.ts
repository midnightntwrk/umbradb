import { createHash } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import {
  type ContentDefinedTables,
  type ContentFunction,
  contentsHash,
} from "../../src/determinism/contents-hash.js";
import type { ConsistentRead, PageOptions } from "../../src/determinism/module-tables.js";
import { DETERMINISM_BACKENDS } from "./backends.js";
import { concatBytes, fromHex } from "./cbor-decoder.js";
import type { TestDatabase, TestServer } from "./postgres-database.js";

/**
 * The contents hash's content-defined tables, on PostgreSQL 18 and PGlite 0.5.10: a table the build declares
 * content-defined appears in the hash as its content function gives it — `[schema, table, [column names], [rows]]`, or
 * `[schema, table, null, null]` for a table recorded by name only — in the table order of every other table, and its
 * own rows are not read by bytes. The content is computed once per hash, through the hash's own read (one snapshot),
 * with its page size. A declaration of tables the database does not hold changes nothing; one whose content function
 * gives nothing for a declared table, or fails, fails the hash.
 *
 * The ledger's node tables, the content function `core-ledger-state` declares, are `../backbone/node-set.test.ts`.
 * The expected hash is computed here from CBOR written out by hand (RFC 8949), not by the code under test.
 */

const DATABASE = `
  CREATE SCHEMA m;
  CREATE TABLE m.t (k integer PRIMARY KEY);
  CREATE TABLE m.n (k bytea PRIMARY KEY, v text NOT NULL);
  CREATE TABLE m.c (k bytea PRIMARY KEY);
  INSERT INTO m.t VALUES (1);
  INSERT INTO m.n VALUES ('\\x03', 'three'), ('\\x01', 'one');
  INSERT INTO m.c VALUES ('\\x02');
`;

/** What one call of a content function was given. */
interface Call {
  readonly read: ConsistentRead;
  readonly options: PageOptions;
}

/** A content function of `m.n` (its keys, in byte order) and `m.c` (by name only), recording its calls. */
function keysOfN(calls: Call[]): ContentFunction {
  return async (read, options) => {
    calls.push({ read, options });
    const rows = await read.query("SELECT k FROM m.n ORDER BY k");
    return new Map([
      ["n", { columns: [{ name: "k", type: "bytea" as const }], rows: rows.map((row) => [row.k]) }],
      ["c", null],
    ]);
  };
}

/** `m.n` and `m.c` content-defined, by `content`. */
const declared = (content: ContentFunction): ContentDefinedTables[] => [{ schema: "m", tables: ["n", "c"], content }];

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

/** The canonical CBOR of DATABASE's contents-hash array with `m.n` and `m.c` content-defined, item by item. */
const EXPECTED_CBOR: readonly (readonly [string, string])[] = [
  ["array(3): the module tables m.c, m.n, m.t, by their names' bytes", "83"],
  ['["m", "c", null, null]: by name only', "84 61 6d 61 63 f6 f6"],
  ['["m", "n", ["k"], [[h\'01\'], [h\'03\']]]: the content, not the rows', "84 61 6d 61 6e 81 61 6b 82 81 41 01 81 41 03"],
  ['["m", "t", ["k"], [[1]]]: by its rows', "84 61 6d 61 74 81 61 6b 81 81 01"],
];

describe.each(DETERMINISM_BACKENDS)("content-defined tables in the contents hash, on $name", (backend) => {
  let server: TestServer;

  beforeAll(async () => {
    server = await backend.start();
  }, 180_000);

  afterAll(async () => {
    await server?.stop();
  }, 60_000);

  async function database(sql: string = DATABASE): Promise<TestDatabase> {
    const db = await server.create();
    await db.exec(sql);
    return db;
  }

  it("a content-defined table appears as its content function gives it, in the order of every other table", async () => {
    const db = await database();
    const cbor = concatBytes(...EXPECTED_CBOR.map(([, bytes]) => fromHex(bytes.replace(/\s+/g, ""))));
    const expected = createHash("sha256").update(cbor).digest("hex");
    const calls: Call[] = [];
    expect(hex(await db.read((read) => contentsHash(read, { contentDefined: declared(keysOfN(calls)) })))).toBe(expected);
    // By bytes (no declaration), the same database hashes otherwise: not vacuous.
    expect(hex(await db.read((read) => contentsHash(read)))).not.toBe(expected);
    expect(calls).toHaveLength(1);
  }, 60_000);

  it("the content is computed once per hash, through the hash's own read, with its page size", async () => {
    const db = await database();
    const calls: Call[] = [];
    await db.read(async (read) => {
      await contentsHash(read, { contentDefined: declared(keysOfN(calls)), pageSize: 7 });
      expect(calls).toHaveLength(1);
      expect(calls[0]?.read).toBe(read);
      expect(calls[0]?.options).toEqual({ pageSize: 7 });
    });
    calls.length = 0;
    await db.read((read) => contentsHash(read, { contentDefined: declared(keysOfN(calls)) }));
    expect(calls.map((call) => call.options)).toEqual([{}]);
  }, 60_000);

  it("a content-defined table's own rows are not read by bytes: only what its content gives changes the hash", async () => {
    const db = await database();
    const hashOf = () => db.read(async (read) => hex(await contentsHash(read, { contentDefined: declared(keysOfN([])) })));
    const before = await hashOf();
    await db.exec("UPDATE m.n SET v = 'changed' WHERE k = '\\x01'; INSERT INTO m.c VALUES ('\\x09')");
    expect(await hashOf()).toBe(before);
    await db.exec("INSERT INTO m.n VALUES ('\\x05', 'five')");
    const more = await hashOf();
    expect(more).not.toBe(before);
    await db.exec("DELETE FROM m.n WHERE k = '\\x05'; UPDATE m.t SET k = 2");
    expect(await hashOf()).not.toBe(before);
  }, 60_000);

  it("a table two declarations name takes the first one's content, and the second's is not computed for it", async () => {
    const db = await database();
    const first: Call[] = [];
    const second: Call[] = [];
    const once = await db.read(async (read) => hex(await contentsHash(read, { contentDefined: declared(keysOfN(first)) })));
    const later: ContentDefinedTables = { schema: "m", tables: ["n"], content: keysOfN(second) };
    const twice = await db.read(async (read) =>
      hex(await contentsHash(read, { contentDefined: [...declared(keysOfN(first)), later] })),
    );
    expect(twice).toBe(once);
    expect(first).toHaveLength(2);
    expect(second).toHaveLength(0);
  }, 60_000);

  it("tables a declaration names that the database does not hold change nothing, and their content is not computed", async () => {
    const db = await database();
    const calls: Call[] = [];
    const absent: ContentDefinedTables = { schema: "other", tables: ["x"], content: keysOfN(calls) };
    const byBytes = await db.read(async (read) => hex(await contentsHash(read)));
    expect(await db.read(async (read) => hex(await contentsHash(read, { contentDefined: [absent] })))).toBe(byBytes);
    expect(calls).toHaveLength(0);
  }, 60_000);

  it("a table declared deterministic: false is recorded by name only, even when a declaration names it content-defined", async () => {
    const db = await database();
    const calls: Call[] = [];
    const optedOut = [{ schema: "m", table: "n" }, { schema: "m", table: "c" }];
    const named = await db.read(async (read) => hex(await contentsHash(read, { optedOut })));
    const both = await db.read(async (read) => hex(await contentsHash(read, { optedOut, contentDefined: declared(keysOfN(calls)) })));
    expect(both).toBe(named);
    expect(calls).toHaveLength(0);
  }, 60_000);

  it("a content function that gives nothing for a declared table, or fails, fails the hash", async () => {
    const db = await database();
    const partial: ContentFunction = async () => new Map([["c", null]]);
    await expect(db.read((read) => contentsHash(read, { contentDefined: declared(partial) }))).rejects.toThrow(
      /the content function of m\.n, m\.c gave nothing for m\.n/,
    );
    const refusal = new UmbraError("ledger-refcount-invalid", "refused by the content function", { reason: "tables-inconsistent" });
    const failing: ContentFunction = async () => {
      throw refusal;
    };
    await expect(db.read((read) => contentsHash(read, { contentDefined: declared(failing) }))).rejects.toBe(refusal);
  }, 60_000);
});
