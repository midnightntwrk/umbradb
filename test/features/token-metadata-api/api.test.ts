import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { tokenColor } from "../../../src/features/token-metadata/color.js";
import { TokensRequest, TokensResponse } from "../../../src/features/token-metadata-api/schemas.js";
import { commonRecords, EVENT_NAME, metadataRecord, toHex, withdrawRecords } from "../../../src/features/token-metadata/codec/index.js";
import type { UmbraDBHandle } from "../../../src/library/start-umbradb.js";
import { cursorReaches } from "../../library/library-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, get, getTokens, type Got, miscData, startRun, TOKENS_PATH } from "../token-metadata/harness.js";

/**
 * `token-metadata-api`'s one route, `GET /token-metadata-api/v1/tokens`, on the module API listener, on PostgreSQL 18
 * and PGlite, over one chain with complete and partial tokens, a contract with a rejected event, a symbol group,
 * hostile text, an image and a withdrawn token.
 * Every answer is checked against the route's own output schema.
 *
 * - **The four selectors:** colors (both kinds of a color, several colors at once), a contract (paged, its cursor bound
 *   to it), a contract and domain separator (its kinds), and all three with the kind.
 * - **A token:** every defined field in key order, the six common fields (its image URI among them), its group by symbol.
 * - **No verdict:** an answer gives a token's fields and nothing about them; a rejected event of its contract changes
 *   nothing in it.
 * - **Input:** a body that matches no selector is 400 `invalid-request`, naming the rule and never the input; a forged or
 *   foreign cursor is 400. The module API's own 404 and 405 are as they are.
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

/** Bytes as the route takes and gives them: `0x` and lowercase hex. */
const hex = (b: Uint8Array) => `0x${toHex(b)}`;
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
  /** GETs the tokens `selector` names (its values as the query's parameters); a 200 answer is checked against the answer schema. */
  const tokens = async (selector: object): Promise<Got> => {
    const got = await getTokens(origin, selector);
    if (got.status === 200) expect(TokensResponse.safeParse(got.json).success, JSON.stringify(got.json).slice(0, 300)).toBe(true);
    return got;
  };
  const ids = (got: Got) => got.json.items.map((t: { contractAddress: string; domainSep: string; kind: number }) => `${t.contractAddress.slice(2, 4)}/${t.domainSep.slice(2, 4)}/${t.kind}`);

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

  it("a token: every defined field in key order, its common fields with its image, and its group by symbol", async () => {
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
      common: { name: "Acme Gold", symbol: "AG", decimals: "6", standards: null, image: IMAGE, imageSha256: null },
      group: { symbol: { hex: hex(new TextEncoder().encode("AG")), utf8: "AG" }, memberCount: 2, members: [{ domainSep: hex(D7), kind: 1 }, { domainSep: hex(D8), kind: 1 }] },
    });
    expect("image" in token).toBe(false);
    expect(token.fields.map((f: { key: { utf8: string } }) => f.key.utf8)).toEqual(["decimals", "image", "name", "symbol"]);
    expect(token.fields[0]).toMatchObject({ valType: 2, valTypeName: "uint", value: { hex: "0x06", integer: "6" }, usable: true, updatedAt: { height: String(S + 1), txIndex: 0, eventIndex: 0 } });
  }, 60_000);

  it("by colors: both kinds of a color, several colors at once; a contract token (kind 3) has none", async () => {
    const one = await tokens({ colors: [colorOf(A, D7)] });
    expect(ids(one)).toEqual(["a1/07/1", "a1/07/2"]);
    const many = await tokens({ colors: [colorOf(A, D7), colorOf(H, D7), colorOf(A, D8), colorOf(A, D7)] });
    expect(ids(many)).toEqual(["a1/07/1", "a1/07/2", "a1/08/1", "d4/07/1"]);
    expect(ids(await tokens({ colors: [colorOf(W, D7), `0x${"00".repeat(32)}`] }))).toEqual([]);
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
    expect(await tokens({ contract: hex(B), cursor: first })).toMatchObject({ status: 400, json: { error: { code: "invalid-request" } } });
  }, 60_000);

  it("an answer carries no verdict: a missing field is null, and a rejected event of the contract changes nothing", async () => {
    const [partial] = (await tokens({ contract: hex(B), domainSep: hex(D7), kind: 1 })).json.items;
    expect(partial.common).toEqual({ name: "Only a name", symbol: null, decimals: null, standards: null, image: null, imageSha256: null });
    expect("mark" in partial).toBe(false);
    // Contract C emitted a malformed event beside this token's: the token is served as its own fields say.
    const [beside] = (await tokens({ contract: hex(C), domainSep: hex(D7), kind: 1 })).json.items;
    expect(beside.common).toEqual({ name: "Cee", symbol: "C", decimals: "0", standards: null, image: null, imageSha256: null });
    expect("mark" in beside).toBe(false);
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

  it("parameters that are no selector are 400 invalid-request naming the rule, never the input", async () => {
    const SECRET = "f".repeat(63) + "x";
    const bad: object[] = [
      {},
      { colors: "" },
      { colors: Array.from({ length: 101 }, () => colorOf(A, D7)) },
      { colors: [SECRET] },
      { colors: `${colorOf(A, D7)},` },
      { colors: `${colorOf(A, D7)} ${colorOf(A, D8)}` },
      { contract: SECRET },
      { contract: hex(A).toUpperCase() },
      { contract: toHex(A) },
      { domainSep: hex(D7) },
      { contract: hex(A), kind: 1 },
      { contract: hex(A), domainSep: hex(D7), kind: 4 },
      { contract: hex(A), domainSep: hex(D7), kind: "one" },
      { contract: hex(A), limit: 0 },
      { contract: hex(A), limit: 501 },
      { contract: hex(A), limit: 1.5 },
      { contract: hex(A), cursor: "not a cursor!" },
      { contract: hex(A), cursor: Buffer.from(JSON.stringify({ c: hex(A), k: ["x", 1] })).toString("base64url") },
      { contract: hex(A), domainSep: hex(D7), limit: 1 },
      { contract: hex(A), domainSep: hex(D7), cursor: "abc" },
      { colors: [colorOf(A, D7)], contract: hex(A) },
      { contract: hex(A), extra: 1 },
    ];
    for (const selector of bad) {
      const got = await tokens(selector);
      const at = JSON.stringify(selector).slice(0, 80);
      expect([at, got.status, got.json?.error?.code]).toEqual([at, 400, "invalid-request"]);
      expect(got.text).not.toContain(SECRET);
    }
    const message = async (selector: object) => (await tokens(selector)).json.error.message;
    expect(await message({ colors: [SECRET] })).toMatch(/^input\/colors: expected 32-byte hashes/);
    expect(await message({ colors: Array.from({ length: 101 }, () => colorOf(A, D7)) })).toBe("input/colors: expected at most 100 colors");
    expect(await message({})).toBe("input: expected colors or contract");
    expect(await message({ colors: [colorOf(A, D7)], contract: hex(A) })).toBe("input: colors is given alone");
    expect(await message({ contract: hex(A), kind: 1 })).toBe("input: kind is given with domainSep");
    expect(await message({ contract: hex(A), domainSep: hex(D7), limit: 1 })).toBe("input: limit and cursor page a contract's tokens: not given with domainSep");
    expect(await message({ contract: hex(A), extra: 1 })).toBe("input/extra: not an input of this route");
  }, 60_000);

  it("a hundred colors in one request are answered, and a JSON body is not an input", async () => {
    const hundred = [colorOf(A, D7), ...Array.from({ length: 99 }, (_, i) => `0x${(i + 1).toString(16).padStart(64, "0")}`)];
    const got = await tokens({ colors: hundred });
    expect(got.status).toBe(200);
    expect(got.json.items.length).toBeGreaterThan(0);
    // The route is a GET: a POST is another method, and the selector is never read from a body.
    const posted = await fetch(`${origin}${TOKENS_PATH}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contract: hex(A) }) });
    expect([posted.status, posted.headers.get("allow")]).toEqual([405, "GET"]);
  }, 60_000);

  it("the module API's own answers: an unknown path 404, another method 405 with Allow; no route outside the namespace", async () => {
    expect(await get(origin, "/v1/tokens")).toMatchObject({ status: 404, json: { error: { code: "not-found" } } });
    expect(await get(origin, "/token-metadata-api/v1/nothing")).toMatchObject({ status: 404 });
    const got = await get(origin, TOKENS_PATH, "POST");
    expect(got).toMatchObject({ status: 405, json: { error: { code: "method-not-allowed" } } });
    expect(got.headers.allow).toBe("GET");
  }, 60_000);
});

describe("the request schema's four selectors", () => {
  const h = `0x${"a".repeat(64)}`;
  it("reads the parameters of each of the four as its selector", () => {
    expect(TokensRequest.parse({ colors: `${h},${h}` })).toEqual({ colors: [h, h] });
    expect(TokensRequest.parse({ contract: h })).toEqual({ contract: h });
    expect(TokensRequest.parse({ contract: h, limit: 10, cursor: "abc" })).toEqual({ contract: h, limit: 10, cursor: "abc" });
    expect(TokensRequest.parse({ contract: h, domainSep: h })).toEqual({ contract: h, domainSep: h });
    expect(TokensRequest.parse({ contract: h, domainSep: h, kind: 3 })).toEqual({ contract: h, domainSep: h, kind: 3 });
  });
  it("refuses a list of colors (a GET parameter is text) and every mix of selectors", () => {
    for (const bad of [{ colors: [h] }, {}, { domainSep: h }, { kind: 1 }, { colors: h, limit: 1 }, { contract: h, kind: 1 }, { contract: h, domainSep: h, cursor: "abc" }]) {
      expect([bad, TokensRequest.safeParse(bad).success]).toEqual([bad, false]);
    }
  });
});
