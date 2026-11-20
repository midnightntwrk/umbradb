import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { commonRecords } from "../../../src/features/token-metadata/codec/index.js";
import { tokenColor } from "../../../src/features/token-metadata/color.js";
import type { ReadHandle } from "../../../src/db/api.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { type ApiHandler, blockLogs, contract, domain, eventData, readStopped, runTo, tokensHandler, tokensParams } from "../token-metadata/harness.js";

/**
 * Bounded cost of the API, on PostgreSQL 18 and PGlite. Large cardinalities are written straight into the
 * indexer's tables of a stopped database — 1,000 tokens of a contract sharing its symbol — then the route's handler answers through a read handle that counts the
 * rows each answer reads back. Every answer is small: a token's own fields, the first 100 members of its group with
 * their count, a contract a page at a time, a
 * hundred colors in a fixed number of statements, and a page of tokens with different symbols in the same number of
 * statements whatever its size; none reads back more than {@link MAX_ROWS} rows. **Negative control:**
 * the same group under a 12-character symbol, which may be the cut of longer ones, reads every row sharing it, and the
 * bound sees it.
 */

const S = 3_000;
const MEMBERS = 1_000;
const MAX_ROWS = 1_000;
const X = contract(0xc0);
/** A contract whose tokens each have a symbol of their own. */
const Y = contract(0xc1);
const DISTINCT = 300;
const DA = domain(0xda);
/** Bytes as SQL writes them (`raw`) and as the route takes and gives them (`hex`: `0x` and lowercase hex). */
const raw = (b: Uint8Array) => Buffer.from(b).toString("hex");
const hex = (b: Uint8Array) => `0x${raw(b)}`;
type Json = any;
type Handler = ApiHandler;

/** A token's id in SQL: `sha256(pad(32, "midnight:derive_token") ‖ domain_sep ‖ contract_address)`. */
const ID_SQL = (domainSep: string, contract: string) =>
  `sha256('\\x6d69646e696768743a6465726976655f746f6b656e0000000000000000000000'::bytea || ${domainSep} || ${contract})`;

/**
 * Seeds the hostile cardinality, the group's members with `symbol`: 999 more tokens of the contract with the symbol.
 * A token's own fields cannot be many: the indexer stores at most
 * the six keys MIP-0018 defines.
 */
async function seed(db: ProcessDatabase, symbol: string): Promise<void> {
  const x = `'\\x${raw(X)}'::bytea`;
  const id = `'\\x${raw(tokenColor(DA, X))}'::bytea`;
  await db.query(`UPDATE token_metadata.fields SET value = convert_to('${symbol}', 'UTF8') WHERE token_id = ${id} AND key = convert_to('symbol', 'UTF8')`);
  await db.query(`UPDATE token_metadata.tokens SET symbol = convert_to('${symbol}', 'UTF8') WHERE id = ${id}`);
  await db.query(
    `INSERT INTO token_metadata.tokens (id, kind, contract_address, domain_sep, symbol)
     SELECT ${ID_SQL("d", x)}, 3, ${x}, d, convert_to('${symbol}', 'UTF8')
     FROM (SELECT decode('ee' || lpad(to_hex(i), 62, '0'), 'hex') AS d FROM generate_series(1, ${MEMBERS - 1}) AS i) AS m`,
  );
  await db.query(
    `INSERT INTO token_metadata.fields (token_id, kind, key, val_type, value, uint_value, usable, set_height, set_tx, set_event, set_record)
     SELECT id, 3, convert_to('symbol', 'UTF8'), 1, symbol, NULL, true, ${S + 1}, 0, 1, 0 FROM token_metadata.tokens WHERE id <> ${id}`,
  );
  await db.query("ANALYZE token_metadata.tokens");
  await db.query("ANALYZE token_metadata.fields");
}

/** Seeds contract {@link Y} with {@link DISTINCT} tokens, each with a different symbol (`S1`, `S2`, …). */
async function seedDistinctSymbols(db: ProcessDatabase): Promise<void> {
  const y = `'\\x${raw(Y)}'::bytea`;
  await db.query(
    `INSERT INTO token_metadata.tokens (id, kind, contract_address, domain_sep, symbol)
     SELECT ${ID_SQL("d", y)}, 3, ${y}, d, convert_to('S' || i::text, 'UTF8')
     FROM (SELECT i, decode('dd' || lpad(to_hex(i), 62, '0'), 'hex') AS d FROM generate_series(1, ${DISTINCT}) AS i) AS m`,
  );
  await db.query(
    `INSERT INTO token_metadata.fields (token_id, kind, key, val_type, value, uint_value, usable, set_height, set_tx, set_event, set_record)
     SELECT id, 3, convert_to('symbol', 'UTF8'), 1, symbol, NULL, true, ${S + 1}, 0, 2, 0 FROM token_metadata.tokens WHERE contract_address = ${y}`,
  );
  await db.query("ANALYZE token_metadata.tokens");
  await db.query("ANALYZE token_metadata.fields");
}

describe.each(PROCESS_BACKENDS)("bounded cost on $name", (backend: ProcessBackend) => {
  let db: ProcessDatabase;
  let spam: ProcessDatabase;
  let handler: Handler;

  /** Answers `body` through the handler at `on`'s cursor: the answer, its size, the rows read and the statements sent. */
  const tokens = (on: ProcessDatabase, body: unknown): Promise<{ status: number; size: number; json: Json; rows: number; statements: number }> =>
    readStopped(on, async (read) => {
      let rows = 0;
      let statements = 0;
      const counting: ReadHandle = {
        height: read.height,
        query: async (sql, values) => {
          const out = await read.query(sql, values);
          rows += out.length;
          statements++;
          return out;
        },
      };
      const got = await handler({ params: tokensParams(body as object), body: undefined }, counting);
      const text = got.body as string;
      return { status: got.status, size: text.length, json: JSON.parse(text), rows, statements };
    });

  beforeAll(async () => {
    handler = await tokensHandler();
    await backend.start();
    const logs = new Map([[BigInt(S + 1), blockLogs([0, X, eventData(DA, 3, commonRecords({ name: "Big", symbol: "SPAM", decimals: 6 }))])]]);
    db = await backend.database();
    await runTo(db, { start: S, head: S + 2, logs });
    await seed(db, "SPAM");
    await seedDistinctSymbols(db);
    spam = await backend.database();
    await runTo(spam, { start: S, head: S + 2, logs });
    await seed(spam, "SPAMSPAMSPAM");
  }, 300_000);
  afterAll(() => backend.stop(), 60_000);

  it("a token: its fields, its common fields, a group of 100 members", async () => {
    const got = await tokens(db, { contract: hex(X), domainSep: hex(DA), kind: 3 });
    expect(got.status).toBe(200);
    const [token] = got.json.items;
    expect(token.fields.map((f: Json) => f.key.utf8)).toEqual(["decimals", "name", "symbol"]);
    expect(token.fields.every((f: Json, i: number) => i === 0 || f.key.hex > token.fields[i - 1].key.hex)).toBe(true);
    expect(token.common).toEqual({ name: "Big", symbol: "SPAM", decimals: "6", standards: null, image: null, imageSha256: null });
    expect([token.group.memberCount, token.group.members.length]).toEqual([MEMBERS, 100]);
    expect(got.size).toBeLessThan(96_000);
    expect(got.rows).toBeLessThan(MAX_ROWS);
  }, 120_000);

  it("a contract a page at a time: each token's fields and its group, read once per symbol", async () => {
    const got = await tokens(db, { contract: hex(X), limit: 10 });
    expect(got.json.items).toHaveLength(10);
    expect(typeof got.json.nextCursor).toBe("string");
    expect(got.json.items.every((t: Json) => t.group.memberCount === MEMBERS)).toBe(true);
    // Each of the ten carries its own few fields and the first 100 members of the group they share.
    expect(got.size).toBeLessThan(200_000);
    expect(got.rows).toBeLessThan(MAX_ROWS);
  }, 120_000);

  it("a hundred colors take a fixed number of statements", async () => {
    const colors = Array.from({ length: 100 }, (_, i) => `0x${i.toString(16).padStart(64, "0")}`);
    const got = await tokens(db, { colors });
    expect([got.status, got.json.items.length]).toEqual([200, 0]);
    expect(got.statements).toBeLessThanOrEqual(3);
  }, 120_000);

  it("a page of tokens with different symbols takes the same number of statements whatever its size", async () => {
    const small = await tokens(db, { contract: hex(Y), limit: 10 });
    const large = await tokens(db, { contract: hex(Y), limit: 100 });
    expect([small.json.items.length, large.json.items.length]).toEqual([10, 100]);
    expect(large.json.items.every((t: Json) => t.group === null && t.common.symbol.startsWith("S"))).toBe(true);
    // One count for all the page's symbols: ten times the tokens, not one statement more.
    expect(large.statements).toBe(small.statements);
    expect(large.statements).toBeLessThanOrEqual(8);
  }, 120_000);

  it("with no parameter: a page of every contract's tokens holds 20, the largest 100, in a fixed number of statements; the next continues it", async () => {
    const first = await tokens(db, {});
    expect([first.status, first.json.items.length, typeof first.json.nextCursor]).toEqual([200, 20, "string"]);
    const largest = await tokens(db, { limit: 100 });
    expect([largest.json.items.length, typeof largest.json.nextCursor]).toEqual([100, "string"]);
    expect(largest.json.items.slice(0, 20)).toEqual(first.json.items);
    expect((await tokens(db, { limit: 101 })).status).toBe(400);
    // The members of a group are read once for the page, whatever the number of its tokens that carry them.
    expect(largest.statements).toBe(first.statements);
    expect(largest.statements).toBeLessThanOrEqual(8);
    expect(largest.rows).toBeLessThan(MAX_ROWS);
    // The worst pages: tokens that each carry the first 100 members of one group. About 0.2 MB by default, 1 MB at most.
    expect(first.size).toBeLessThan(250_000);
    expect(largest.size).toBeLessThan(1_200_000);
    const second = await tokens(db, { cursor: first.json.nextCursor });
    expect(second.json.items).toEqual(largest.json.items.slice(20, 40));
  }, 120_000);

  it("[NEG] a group under a 12-character symbol reads every row sharing it, and the bound sees it", async () => {
    const got = await tokens(spam, { contract: hex(X), domainSep: hex(DA), kind: 3 });
    const [token] = got.json.items;
    expect([token.group.symbol.utf8, token.group.memberCount, token.group.members.length]).toEqual(["SPAMSPAMSPAM", MEMBERS, 100]);
    expect(got.rows).toBeGreaterThan(MAX_ROWS);
  }, 120_000);
});
