import Value from "typebox/value";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { tokenColor } from "../../../src/features/token-metadata/color.js";
import { DEFAULT_MAX_CONCURRENT_REQUESTS, registerRoutes, typedRoute } from "../../../src/features/token-metadata-api/router.js";
import { TokensRequest, TokensResponse } from "../../../src/features/token-metadata-api/schemas.js";
import { encodeCursor, markJson } from "../../../src/features/token-metadata-api/handlers.js";
import { commonRecords, EVENT_NAME, metadataRecord, toHex, withdrawRecords } from "../../../src/features/token-metadata/codec/index.js";
import type { Field } from "../../../src/features/token-metadata/rules.js";
import type { ApiRegistry } from "../../../src/modules/declaration.js";
import type { UmbraDBHandle } from "../../../src/library/start-umbradb.js";
import { cursorReaches } from "../../library/library-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, get, type Got, miscData, post, startRun, TOKENS_PATH } from "../token-metadata/harness.js";

/**
 * `token-metadata-api`'s one route, `POST /token-metadata-api/v1/tokens`, on the module API listener, on PostgreSQL 18
 * and PGlite, over one chain with a token per mark, a symbol group, hostile text, an image and a withdrawn token.
 * Every answer is checked against the route's own answer schema.
 *
 * - **The four selectors:** colors (both kinds of a color, several colors at once), a contract (paged, its cursor bound
 *   to it), a contract and domain separator (its kinds), and all three with the kind.
 * - **A token:** every defined field in key order, the common fields, its group by symbol, its mark, its image pending.
 * - **Marks:** `ok`, `partial` and `incorrect` through the route; `unresolved` through `markJson` (an unresolved site
 *   through the process: `events.test.ts`).
 * - **Input:** a body that matches no selector is 400 `BAD_REQUEST`, naming the rule and never the input; a forged or
 *   foreign cursor is 400. The module API's own 404 and 405 are as they are. 503 `BUSY` beyond eight requests at once.
 * - **Output:** ASCII JSON with hostile text, the response headers and the core's `X-Umbra-*`.
 */

const S = 1_000;
const HEAD = 1_004;
const A = contract(0xa1);
const B = contract(0xb2);
const C = contract(0xc3);
const H = contract(0xd4);
const W = contract(0xe5);
const D7 = domain(7);
const D8 = domain(8);
const HOSTILE_NAME = "‮evil<script>&é";
const IMAGE = "https://example.invalid/a.png";

const hex = (b: Uint8Array) => toHex(b);
const colorOf = (c: Uint8Array, d: Uint8Array) => hex(tokenColor(d, c));

const LOGS = new Map([
  [
    BigInt(S + 1),
    blockLogs(
      [0, A, eventData(D7, 1, [...commonRecords({ name: "Acme Gold", symbol: "AG", decimals: 6 }), metadataRecord.uri("image", IMAGE)])],
      [0, A, eventData(D7, 2, commonRecords({ name: "Acme Gold (unshielded)", symbol: "AGU", decimals: 6 }))],
      [1, B, eventData(D7, 1, commonRecords({ name: "Only a name" }))],
      [2, C, eventData(D7, 1, commonRecords({ name: "Cee", symbol: "C", decimals: 0 }))],
      [2, C, miscData(EVENT_NAME, Uint8Array.of(1, 2, 3))],
    ),
  ],
  [
    BigInt(S + 2),
    blockLogs(
      [0, H, eventData(D7, 1, commonRecords({ name: HOSTILE_NAME, symbol: "H", decimals: 2 }))],
      [0, A, eventData(D8, 1, commonRecords({ name: "Acme Two", symbol: "AG", decimals: 6 }))],
      [1, W, eventData(D7, 3, commonRecords({ name: "Gone" }))],
    ),
  ],
  [BigInt(S + 3), blockLogs([0, W, eventData(D7, 3, withdrawRecords())])],
]);

describe.each(PROCESS_BACKENDS)("token-metadata-api on $name", (backend: ProcessBackend) => {
  let handle: UmbraDBHandle;
  let origin: string;
  /** POSTs `body` to the tokens route; a 200 answer is checked against the answer schema. */
  const tokens = async (body: unknown): Promise<Got> => {
    const got = await post(origin, TOKENS_PATH, body);
    if (got.status === 200) expect(Value.Check(TokensResponse, got.json), JSON.stringify(got.json).slice(0, 300)).toBe(true);
    return got;
  };
  const ids = (got: Got) => got.json.items.map((t: { contractAddress: string; domainSep: string; kind: number }) => `${t.contractAddress.slice(0, 2)}/${t.domainSep.slice(0, 2)}/${t.kind}`);

  beforeAll(async () => {
    await backend.start();
    const db = await backend.database();
    handle = startRun(db, { start: S, head: HEAD, logs: LOGS }, true);
    await handle.started;
    await cursorReaches(handle, BigInt(HEAD));
    const api = handle.status().listening.api!;
    origin = `http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`;
  }, 240_000);
  afterAll(async () => {
    await handle?.stop();
    await backend.stop();
  }, 60_000);

  it("a token: every defined field in key order, its common fields, group by symbol, mark and image", async () => {
    const got = await tokens({ contract: hex(A), domainSep: hex(D7), kind: 1 });
    expect(got.status).toBe(200);
    expect(got.json.nextCursor).toBeNull();
    const [token] = got.json.items;
    expect(token).toMatchObject({
      contractAddress: hex(A),
      domainSep: hex(D7),
      kind: 1,
      kindName: "shielded-utxo",
      color: colorOf(A, D7),
      common: { name: "Acme Gold", symbol: "AG", decimals: "6", standards: null },
      fieldCount: 4,
      fieldsTruncated: false,
      group: { symbol: { hex: hex(new TextEncoder().encode("AG")), utf8: "AG" }, memberCount: 2, members: [{ domainSep: hex(D7), kind: 1 }, { domainSep: hex(D8), kind: 1 }] },
      mark: { mark: "ok", reasons: [], reasonCount: 0, unresolved: { count: 0, positions: [] }, missing: [], tags: [] },
      image: { url: IMAGE, status: "pending", imageUrl: null },
    });
    expect(token.fields.map((f: { key: { utf8: string } }) => f.key.utf8)).toEqual(["decimals", "image", "name", "symbol"]);
    expect(token.fields[0]).toMatchObject({ valType: 2, valTypeName: "uint", value: { hex: "06", integer: "6" }, usable: true, updatedAt: { height: S + 1, txIndex: 0, eventIndex: 0 } });
  }, 60_000);

  it("by colors: both kinds of a color, several colors at once; a contract token (kind 3) has none", async () => {
    const one = await tokens({ colors: [colorOf(A, D7)] });
    expect(ids(one)).toEqual(["a1/07/1", "a1/07/2"]);
    const many = await tokens({ colors: [colorOf(A, D7), colorOf(H, D7), colorOf(A, D8), colorOf(A, D7)] });
    expect(ids(many)).toEqual(["a1/07/1", "a1/07/2", "a1/08/1", "d4/07/1"]);
    expect(ids(await tokens({ colors: [colorOf(W, D7), "00".repeat(32)] }))).toEqual([]);
  }, 60_000);

  it("by contract and domain separator: its described kinds; with the kind: that one, or none", async () => {
    expect(ids(await tokens({ contract: hex(A), domainSep: hex(D7) }))).toEqual(["a1/07/1", "a1/07/2"]);
    expect(ids(await tokens({ contract: hex(A), domainSep: hex(D7), kind: 2 }))).toEqual(["a1/07/2"]);
    expect(ids(await tokens({ contract: hex(A), domainSep: hex(D7), kind: 3 }))).toEqual([]);
  }, 60_000);

  it("a withdrawn token is referenced nowhere, by any selector", async () => {
    expect(ids(await tokens({ contract: hex(W) }))).toEqual([]);
    expect(ids(await tokens({ contract: hex(W), domainSep: hex(D7) }))).toEqual([]);
    expect(ids(await tokens({ contract: hex(W), domainSep: hex(D7), kind: 3 }))).toEqual([]);
  }, 60_000);

  it("by contract: pages of its tokens by (domainSep, kind), the same at any limit; the cursor is bound to the contract", async () => {
    const whole = await tokens({ contract: hex(A) });
    expect(ids(whole)).toEqual(["a1/07/1", "a1/07/2", "a1/08/1"]);
    const pages: string[] = [];
    let cursor: string | null | undefined;
    do {
      const page: Got = await tokens({ contract: hex(A), limit: 1, ...(cursor ? { cursor } : {}) });
      pages.push(...ids(page));
      cursor = page.json.nextCursor;
    } while (cursor !== null);
    expect(pages).toEqual(ids(whole));
    const first = (await tokens({ contract: hex(A), limit: 1 })).json.nextCursor as string;
    expect(await tokens({ contract: hex(B), cursor: first })).toMatchObject({ status: 400, json: { error: { code: "BAD_REQUEST" } } });
  }, 60_000);

  it("marks: ok, partial (the missing common fields) and incorrect (the contract's rejection reasons)", async () => {
    const [partial] = (await tokens({ contract: hex(B), domainSep: hex(D7), kind: 1 })).json.items;
    expect(partial.mark).toMatchObject({ mark: "partial", missing: ["symbol", "decimals"], reasons: [] });
    const [incorrect] = (await tokens({ contract: hex(C), domainSep: hex(D7), kind: 1 })).json.items;
    expect(incorrect.mark).toMatchObject({ mark: "incorrect", reasonCount: 1, missing: [] });
    expect(incorrect.mark.reasons).toHaveLength(1);
  }, 60_000);

  it("hostile text travels as ASCII escapes and parses back exactly", async () => {
    const got = await tokens({ contract: hex(H), domainSep: hex(D7), kind: 1 });
    expect(got.json.items[0].common.name).toBe(HOSTILE_NAME);
    expect(/^[\x20-\x7e]*$/.test(got.text)).toBe(true);
    expect(got.text).not.toMatch(/[<>&]/);
  }, 60_000);

  it("the response headers, and the core's view, height and hash", async () => {
    const got = await tokens({ contract: hex(A) });
    expect(got.headers).toMatchObject({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-umbra-view": "finalized",
      "x-umbra-height": String(HEAD),
    });
    expect(got.headers["x-umbra-hash"]).toMatch(/^0x[0-9a-f]{64}$/);
  }, 60_000);

  it("a body that matches no selector is 400 BAD_REQUEST naming the rule, never the input", async () => {
    const SECRET = "f".repeat(63) + "x";
    const bad: unknown[] = [
      undefined,
      {},
      [],
      "tokens",
      { colors: [] },
      { colors: Array.from({ length: 101 }, () => colorOf(A, D7)) },
      { colors: [SECRET] },
      { contract: SECRET },
      { contract: hex(A).toUpperCase() },
      { contract: `0x${hex(A)}` },
      { contract: hex(A), kind: 1 },
      { contract: hex(A), domainSep: hex(D7), kind: 4 },
      { contract: hex(A), domainSep: hex(D7), kind: "1" },
      { contract: hex(A), limit: 0 },
      { contract: hex(A), limit: 501 },
      { contract: hex(A), limit: 1.5 },
      { contract: hex(A), cursor: "not a cursor!" },
      { contract: hex(A), cursor: encodeCursor({ c: hex(A), k: ["x", 1] }) },
      { contract: hex(A), domainSep: hex(D7), limit: 1 },
      { colors: [colorOf(A, D7)], contract: hex(A) },
      { contract: hex(A), extra: 1 },
    ];
    for (const body of bad) {
      const got = body === undefined ? await post(origin, TOKENS_PATH, undefined) : await tokens(body);
      expect([JSON.stringify(body)?.slice(0, 80), got.status, got.json?.error?.code]).toEqual([JSON.stringify(body)?.slice(0, 80), 400, "BAD_REQUEST"]);
      expect(got.text).not.toContain(SECRET);
    }
    expect((await tokens({ colors: [SECRET] })).json.error.message).toMatch(/^body\/colors\/0: must match pattern/);
  }, 60_000);

  it("the module API's own answers: an unknown path 404, another method 405 with Allow; no route outside the namespace", async () => {
    expect(await get(origin, "/v1/tokens")).toMatchObject({ status: 404, json: { error: { code: "not-found" } } });
    expect(await get(origin, "/token-metadata-api/v1/nothing")).toMatchObject({ status: 404 });
    const got = await get(origin, TOKENS_PATH);
    expect(got).toMatchObject({ status: 405, json: { error: { code: "method-not-allowed" } } });
    expect(got.headers.allow).toBe("POST");
  }, 60_000);
});

describe("the request schema's four selectors", () => {
  it("accepts exactly the four shapes", () => {
    const h = "a".repeat(64);
    for (const ok of [{ colors: [h] }, { contract: h }, { contract: h, limit: 10, cursor: "abc" }, { contract: h, domainSep: h }, { contract: h, domainSep: h, kind: 3 }]) {
      expect([ok, Value.Check(TokensRequest, ok)]).toEqual([ok, true]);
    }
  });
});

describe("the marks no chain of the harness gives here", () => {
  const inputs = (unresolved: number, reasons: string[] = []) => ({
    count: reasons.length,
    reasons,
    unresolved: { count: unresolved, positions: Array.from({ length: unresolved }, (_, i) => ({ height: 5, txIndex: 0, eventIndex: i })) },
  });
  const usable = (text: string): Field => ({ key: new Uint8Array(), valType: 1, value: new TextEncoder().encode(text), usable: true, position: { block: 1, tx: 0, event: 0, record: 0 } });
  const fields = new Map<string, Field>([
    [hex(new TextEncoder().encode("name")), usable("N")],
    [hex(new TextEncoder().encode("symbol")), usable("S")],
    [hex(new TextEncoder().encode("decimals")), { ...usable("x"), valType: 2, integer: 6n }],
  ]);

  it("unresolved: a complete token of a contract with an unresolved site, with reason unresolved-log and the position", () => {
    expect(markJson(fields, inputs(1))).toEqual({
      mark: "unresolved",
      reasons: ["unresolved-log"],
      reasonCount: 0,
      unresolved: { count: 1, positions: [{ height: 5, txIndex: 0, eventIndex: 0 }] },
      missing: [],
      tags: [],
    });
  });

  it("precedence: incorrect over unresolved (its reasons end with unresolved-log), unresolved over partial", () => {
    expect(markJson(fields, inputs(1, ["truncated"]))).toMatchObject({ mark: "incorrect", reasons: ["truncated", "unresolved-log"] });
    expect(markJson(new Map(), inputs(1))).toMatchObject({ mark: "unresolved" });
    expect(markJson(fields, inputs(0))).toMatchObject({ mark: "ok" });
  });
});

describe("BUSY beyond eight requests at once", () => {
  it("answers the ninth request in flight 503 BUSY with Retry-After, and serves again once one ends", async () => {
    const handlers = new Map<string, Parameters<ApiRegistry["http"]>[2]>();
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    const slow = typedRoute({ method: "POST", path: "/v1/tokens", body: TokensRequest, response: TokensResponse, handle: async () => (await held, { items: [], nextCursor: null }) });
    registerRoutes({ http: (_m, path, handler) => void handlers.set(path, handler), subscription: () => undefined }, "token-metadata-api", [slow]);
    const handler = handlers.get(TOKENS_PATH)!;
    const read = { height: 5n, query: async (sql: string) => (sql.includes("core_block_commit") ? [{ hash: new Uint8Array(32) }] : []) };
    const req = { params: {}, body: { contract: "a".repeat(64) } };
    const inFlight = Array.from({ length: DEFAULT_MAX_CONCURRENT_REQUESTS }, () => handler(req, read));
    const busy = await handler(req, read);
    expect(busy.status).toBe(503);
    expect(busy.headers).toMatchObject({ "retry-after": "1" });
    expect(JSON.parse(busy.body as string)).toEqual({ error: { code: "BUSY", message: "too many requests in progress; retry shortly" } });
    release();
    await Promise.all(inFlight);
    expect((await handler(req, read)).status).toBe(200);
  });
});
