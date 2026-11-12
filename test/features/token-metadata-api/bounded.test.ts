import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { MAX_TOKEN_FIELDS } from "../../../src/features/token-metadata-api/schemas.js";
import { commonRecords } from "../../../src/features/token-metadata/codec/index.js";
import type { ReadHandle } from "../../../src/db/api.js";
import type { ApiRegistry } from "../../../src/modules/declaration.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, readStopped, runTo, TOKENS_PATH } from "../token-metadata/harness.js";

/**
 * Bounded cost of the API, on PostgreSQL 18 and PGlite. Chain-controlled cardinalities are written straight into the
 * indexer's tables of a stopped database — a token with 10,000 keys, 10,000 rejected events of its contract, and 1,000
 * tokens of that contract sharing its symbol — then the route's handler answers through a read handle that counts the
 * rows each answer reads back. Every answer is small: the first {@link MAX_TOKEN_FIELDS} fields with `fieldCount` and
 * `fieldsTruncated`, the first 100 reasons and the first 100 members with their counts, a contract a page at a time, a
 * hundred colors in a fixed number of statements; none reads back more than {@link MAX_ROWS} rows. **Negative control:**
 * the same group under a 12-character symbol, which may be the cut of longer ones, reads every row sharing it, and the
 * bound sees it.
 */

const S = 3_000;
const N = 10_000;
const MEMBERS = 1_000;
const MAX_ROWS = 1_000;
const X = contract(0xc0);
const DA = domain(0xda);
const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
type Json = any;
type Handler = Parameters<ApiRegistry["http"]>[2];

/** Seeds the hostile cardinalities, the group's members with `symbol`. */
async function seed(db: ProcessDatabase, symbol: string): Promise<void> {
  const x = `'\\x${hex(X)}'::bytea`;
  await db.query(
    `INSERT INTO token_metadata.fields (contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined,
       set_height, set_tx, set_event, set_record)
     SELECT ${x}, '\\x${hex(DA)}'::bytea, 3, convert_to('k' || lpad(i::text, 6, '0'), 'UTF8'), 1, '\\x76'::bytea, NULL, NULL, true, ${S + 1}, 0, 0, i
     FROM generate_series(1, ${N}) AS i`,
  );
  await db.query(`UPDATE token_metadata.fields SET value = convert_to('${symbol}', 'UTF8') WHERE contract_address = ${x} AND key = convert_to('symbol', 'UTF8')`);
  await db.query(
    `INSERT INTO token_metadata.fields (contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined,
       set_height, set_tx, set_event, set_record)
     SELECT ${x}, decode('ee' || lpad(to_hex(i), 62, '0'), 'hex'), 3, convert_to('symbol', 'UTF8'), 1, convert_to('${symbol}', 'UTF8'), NULL, true, true,
       ${S + 1}, 0, 1, i
     FROM generate_series(1, ${MEMBERS - 1}) AS i`,
  );
  await db.query(
    `INSERT INTO token_metadata.events (height, tx_index, event_index, tx_hash, contract_address, entry_point, classification, reason)
     SELECT ${S + 1}, 100 + i, 0, sha256(int4send(i)), ${x}, '\\x'::bytea, 'reject', 'no-records' FROM generate_series(1, ${N}) AS i`,
  );
  await db.query("ANALYZE token_metadata.fields");
  await db.query("ANALYZE token_metadata.events");
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
      const got = await handler({ params: {}, body }, counting);
      const text = got.body as string;
      return { status: got.status, size: text.length, json: JSON.parse(text), rows, statements };
    });

  beforeAll(async () => {
    const handlers = new Map<string, Handler>();
    await TOKEN_METADATA_API.points["on-start-api"]!({ items: new Map(), revisions: [], publish: () => undefined } as never, {
      http: (_m, path, h) => void handlers.set(path, h),
      subscription: () => undefined,
    });
    handler = handlers.get(TOKENS_PATH)!;
    await backend.start();
    const logs = new Map([[BigInt(S + 1), blockLogs([0, X, eventData(DA, 3, commonRecords({ name: "Big", symbol: "SPAM", decimals: 6 }))])]]);
    db = await backend.database();
    await runTo(db, { start: S, head: S + 2, logs });
    await seed(db, "SPAM");
    spam = await backend.database();
    await runTo(spam, { start: S, head: S + 2, logs });
    await seed(spam, "SPAMSPAMSPAM");
  }, 300_000);
  afterAll(() => backend.stop(), 60_000);

  it("a token: its first 256 fields with fieldCount, its common fields, a group of 100 members, 100 reasons", async () => {
    const got = await tokens(db, { contract: hex(X), domainSep: hex(DA), kind: 3 });
    expect(got.status).toBe(200);
    const [token] = got.json.items;
    expect([token.fields.length, token.fieldCount, token.fieldsTruncated]).toEqual([MAX_TOKEN_FIELDS, N + 3, true]);
    expect(token.fields.every((f: Json, i: number) => i === 0 || f.key.hex > token.fields[i - 1].key.hex)).toBe(true);
    expect(token.common).toEqual({ name: "Big", symbol: "SPAM", decimals: "6", standards: null });
    expect([token.group.memberCount, token.group.members.length, token.mark.reasonCount, token.mark.reasons.length]).toEqual([MEMBERS, 100, N, 100]);
    expect(got.size).toBeLessThan(96_000);
    expect(got.rows).toBeLessThan(MAX_ROWS);
  }, 120_000);

  it("a contract a page at a time: each token's fields and its group, read once per symbol", async () => {
    const got = await tokens(db, { contract: hex(X), limit: 10 });
    expect(got.json.items).toHaveLength(10);
    expect(typeof got.json.nextCursor).toBe("string");
    expect(got.json.items.every((t: Json) => t.group.memberCount === MEMBERS)).toBe(true);
    // One of the ten carries the full 256 fields (about 160 KB of the page); the other nine one field each.
    expect(got.size).toBeLessThan(200_000);
    expect(got.rows).toBeLessThan(MAX_ROWS);
  }, 120_000);

  it("a hundred colors take a fixed number of statements", async () => {
    const colors = Array.from({ length: 100 }, (_, i) => i.toString(16).padStart(64, "0"));
    const got = await tokens(db, { colors });
    expect([got.status, got.json.items.length]).toEqual([200, 0]);
    expect(got.statements).toBeLessThanOrEqual(3);
  }, 120_000);

  it("[NEG] a group under a 12-character symbol reads every row sharing it, and the bound sees it", async () => {
    const got = await tokens(spam, { contract: hex(X), domainSep: hex(DA), kind: 3 });
    const [token] = got.json.items;
    expect([token.group.symbol.utf8, token.group.memberCount, token.group.members.length]).toEqual(["SPAMSPAMSPAM", MEMBERS, 100]);
    expect(got.rows).toBeGreaterThan(MAX_ROWS);
  }, 120_000);
});
