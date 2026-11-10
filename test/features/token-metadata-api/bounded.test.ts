import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { registerMetadataApi } from "../../../src/features/token-metadata-api/api.js";
import { commonRecords } from "../../../src/features/token-metadata/codec/index.js";
import type { ReadHandle } from "../../../src/db/api.js";
import type { ApiRegistry } from "../../../src/modules/declaration.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, readStopped, runTo } from "../token-metadata/harness.js";

/**
 * Bounded cost of the API, on PostgreSQL 18 and PGlite.
 * Chain-controlled cardinalities are written straight into the module's tables of a stopped database — an identity with
 * 10,000 keys, 10,000 rejected events of its contract, and 1,000 identities of that contract sharing its symbol — then
 * the API's handlers answer through a read handle that counts the rows each answer reads back. Every answer is small
 * and serves the first page, the first 100 reasons and the first 100 members with their counts, and none reads back
 * more than {@link MAX_ROWS} rows. **Negative control:** the same group under a 12-character symbol, which may be the
 * cut of longer ones, reads every row sharing it, and the bound sees it.
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

const handlers = new Map<string, Handler>();
registerMetadataApi({ http: (_m, path, handler) => void handlers.set(path, handler), subscription: () => undefined });

/** Seeds the hostile cardinalities, the group's members with `symbol`. */
async function seed(db: ProcessDatabase, symbol: string): Promise<void> {
  const x = `'\\x${hex(X)}'::bytea`;
  await db.query(
    `INSERT INTO token_metadata.fields (contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined,
       set_height, set_tx, set_event, set_record)
     SELECT ${x}, '\\x${hex(DA)}'::bytea, 3, convert_to('k' || lpad(i::text, 6, '0'), 'UTF8'), 1, '\\x76'::bytea, NULL, NULL, true, ${S + 1}, 0, 0, i
     FROM generate_series(1, ${N}) AS i`,
  );
  await db.query(
    `UPDATE token_metadata.fields SET value = convert_to('${symbol}', 'UTF8')
     WHERE contract_address = ${x} AND key = convert_to('symbol', 'UTF8')`,
  );
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

/** Answers `path` (with its query) through the handlers at the stopped database's cursor: the answer and the rows read. */
async function answer(db: ProcessDatabase, route: string, path: string): Promise<{ status: number; size: number; json: Json; rows: number }> {
  const url = new URL(path, "http://x");
  const segments = url.pathname.split("/");
  const params: Record<string, string> = Object.fromEntries(url.searchParams);
  route.split("/").forEach((s, i) => {
    if (s.startsWith(":")) params[s.slice(1)] = segments[i]!;
  });
  return readStopped(db, async (read) => {
    let rows = 0;
    const counting: ReadHandle = {
      height: read.height,
      query: async (sql, values) => {
        const out = await read.query(sql, values);
        rows += out.length;
        return out;
      },
    };
    const got = await handlers.get(route)!({ params, body: undefined }, counting);
    const body = got.body as string;
    return { status: got.status, size: body.length, json: JSON.parse(body), rows };
  });
}

describe.each(PROCESS_BACKENDS)("bounded cost on $name", (backend: ProcessBackend) => {
  let db: ProcessDatabase;
  let spam: ProcessDatabase;

  beforeAll(async () => {
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

  it("the token list reads only the common keys and the first 100 reasons; reasonCount counts them all", async () => {
    const list = await answer(db, "/v1/tokens", "/v1/tokens?limit=4");
    expect(list.status).toBe(200);
    const big = list.json.items.find((t: Json) => t.domainSep === hex(DA));
    expect([big.name, big.symbol, big.decimals, big.described]).toEqual(["Big", "SPAM", "6", true]);
    expect([big.mark.mark, big.mark.reasons.length, big.mark.reasonCount]).toEqual(["incorrect", 100, N]);
    expect(list.size).toBeLessThan(16_000);
    expect(list.rows).toBeLessThan(MAX_ROWS);
  }, 120_000);

  it("an identity: one page of fields with fieldCount, its common fields, a group of 100 members with memberCount", async () => {
    const route = "/v1/identities/:contract/:domainSep/:kind";
    const id = await answer(db, route, `/v1/identities/${hex(X)}/${hex(DA)}/3`);
    expect(id.status).toBe(200);
    expect([id.json.fields.length, id.json.fieldCount, typeof id.json.fieldsNextCursor]).toEqual([100, N + 3, "string"]);
    expect(id.json.commonFields.map((f: Json) => f.key.utf8).sort()).toEqual(["decimals", "name", "symbol"]);
    expect(id.json.common).toEqual({ name: "Big", symbol: "SPAM", decimals: "6", standards: null });
    expect([id.json.group.memberCount, id.json.group.members.length, id.json.mark.reasonCount, id.json.mark.reasons.length]).toEqual([MEMBERS, 100, N, 100]);
    expect(id.size).toBeLessThan(96_000);
    expect(id.rows).toBeLessThan(MAX_ROWS);
    // Keyset pages of 500 continue in key order.
    let cursor = id.json.fieldsNextCursor as string;
    let last = id.json.fields.at(-1).key.hex as string;
    for (let page = 0; page < 3; page++) {
      const p = await answer(db, route, `/v1/identities/${hex(X)}/${hex(DA)}/3?limit=500&cursor=${cursor}`);
      expect(p.json.fields.length).toBe(500);
      expect(p.json.fields[0].key.hex > last).toBe(true);
      expect(p.json.fields.every((f: Json, i: number) => i === 0 || f.key.hex > p.json.fields[i - 1].key.hex)).toBe(true);
      expect(p.size).toBeLessThan(160_000);
      expect(p.rows).toBeLessThan(MAX_ROWS);
      last = p.json.fields.at(-1).key.hex;
      cursor = p.json.fieldsNextCursor;
    }
  }, 120_000);

  it("a contract's tokens: its page's groups, each with its first 100 members; its events a page at a time", async () => {
    const ct = await answer(db, "/v1/contracts/:address/tokens", `/v1/contracts/${hex(X)}/tokens?limit=10`);
    expect(ct.json.groups.map((g: Json) => [g.symbol.utf8, g.memberCount, g.members.length])).toEqual([["SPAM", MEMBERS, 100]]);
    expect(ct.json.items).toHaveLength(10);
    expect(ct.size).toBeLessThan(48_000);
    expect(ct.rows).toBeLessThan(MAX_ROWS);
    const ev = await answer(db, "/v1/events", `/v1/events?contract=${hex(X)}&limit=20`);
    expect([ev.json.items.length, ev.json.items.filter((e: Json) => e.classification === "reject").length, typeof ev.json.nextCursor]).toEqual([20, 19, "string"]);
    expect(ev.size).toBeLessThan(16_000);
    expect(ev.rows).toBeLessThan(MAX_ROWS);
    const status = await answer(db, "/v1/status", "/v1/status");
    expect(status.size).toBeLessThan(4_000);
  }, 120_000);

  it("[NEG] a group under a 12-character symbol reads every row sharing it, and the bound sees it", async () => {
    const id = await answer(spam, "/v1/identities/:contract/:domainSep/:kind", `/v1/identities/${hex(X)}/${hex(DA)}/3`);
    expect([id.json.group.symbol.utf8, id.json.group.memberCount, id.json.group.members.length]).toEqual(["SPAMSPAMSPAM", MEMBERS, 100]);
    expect(id.rows).toBeGreaterThan(MAX_ROWS);
  }, 120_000);
});
