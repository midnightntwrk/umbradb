import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEFAULT_MAX_CONCURRENT_REQUESTS, encodeCursor, markJson, registerMetadataApi } from "../../../src/features/token-metadata/api.ts";
import { tokenColor } from "../../../src/features/token-metadata/color.ts";
import {
  commonRecords,
  EVENT_NAME,
  record,
  toHex,
  withdrawRecords,
} from "../../../src/features/token-metadata/vendor/mip0018/codec/src/index.ts";
import type { Field } from "../../../src/features/token-metadata/state.ts";
import type { ApiRegistry } from "../../../src/modules/declaration.js";
import type { UmbraDBHandle } from "../../../src/library/start-umbradb.js";
import { cursorReaches } from "../../library/library-fixtures.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, get, type Got, miscData, startRun } from "./harness.js";

/**
 * `token-metadata`'s `/v1` API on the module API listener, on PostgreSQL 18 and PGlite, over one chain with an
 * identity per mark, a symbol group, hostile text, an image and a withdrawn identity. [TM-11 … TM-13, TM-15; task 3.3,
 * 4.1]
 *
 * - **M13**: `ok`, `partial` and `incorrect` through the routes; `none` and `unresolved` through `markJson` (an
 *   unresolved site needs `fast-logs-unresolved`).
 * - **M15** (the module's part): 400 `BAD_REQUEST` for each bad input, 404 `NOT_FOUND` for what is not there, cursors bound
 *   to their endpoint, limits 1–500, ASCII JSON with hostile text, the response headers and the core's `X-Umbra-*`;
 *   503 `BUSY` beyond eight requests at once. The module API's own 404 and 405 are checked as they are.
 * - **M17**: lookup of a described kind-1 identity's computed color.
 * - **M18** (its served part): an identity with an `image` URI is served `pending`, with no fetch.
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
const identity = (c: Uint8Array, d: Uint8Array, kind: number) => `/v1/identities/${hex(c)}/${hex(d)}/${kind}`;

const LOGS = new Map([
  [
    BigInt(S + 1),
    blockLogs(
      [0, A, eventData(D7, 1, [...commonRecords({ name: "Acme Gold", symbol: "AG", decimals: 6 }), record.uri("image", IMAGE)])],
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

describe.each(PROCESS_BACKENDS)("token-metadata's API on $name", (backend: ProcessBackend) => {
  let handle: UmbraDBHandle;
  let origin: string;
  const at = (path: string, method?: string): Promise<Got> => get(origin, path, method);

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

  it("M13: an identity's mark is ok, partial or incorrect (with its contract's reasons) as tokenMark gives it", async () => {
    const ok = await at(identity(A, D7, 1));
    expect(ok.status).toBe(200);
    expect(ok.json.mark).toEqual({ mark: "ok", reasons: [], reasonCount: 0, unresolved: { count: 0, positions: [] }, missing: [], tags: [] });
    const partial = await at(identity(B, D7, 1));
    expect(partial.json.mark).toMatchObject({ mark: "partial", missing: ["symbol", "decimals"], reasons: [] });
    const incorrect = await at(identity(C, D7, 1));
    expect(incorrect.json.mark).toMatchObject({ mark: "incorrect", reasonCount: 1, missing: [] });
    expect(incorrect.json.mark.reasons).toHaveLength(1);
    const events = await at(`/v1/events?contract=${hex(C)}`);
    expect(events.json.items.map((e: { classification: string; reason: string | null }) => [e.classification, e.reason])).toEqual([
      ["accept", null],
      ["reject", incorrect.json.mark.reasons[0]],
    ]);
  }, 60_000);

  it("serves an identity: common fields, a key-ordered field page, its group by symbol, its image pending (M18)", async () => {
    const a = (await at(identity(A, D7, 1))).json;
    expect(a).toMatchObject({
      contractAddress: hex(A),
      domainSep: hex(D7),
      kind: 1,
      kindName: "shielded-utxo",
      color: hex(tokenColor(D7, A)),
      minted: null,
      described: true,
      common: { name: "Acme Gold", symbol: "AG", decimals: "6", standards: null },
      fieldCount: 4,
      fieldsNextCursor: null,
      group: { symbol: { hex: hex(new TextEncoder().encode("AG")), utf8: "AG" }, memberCount: 2 },
      image: { url: IMAGE, status: "pending", imageUrl: null },
    });
    expect(a.fields.map((f: { key: { utf8: string } }) => f.key.utf8)).toEqual(["decimals", "image", "name", "symbol"]);
    expect(a.group.members).toEqual([
      { domainSep: hex(D7), kind: 1 },
      { domainSep: hex(D8), kind: 1 },
    ]);
    const page = await at(`${identity(A, D7, 1)}?limit=2`);
    expect(page.json.fields).toHaveLength(2);
    const next = await at(`${identity(A, D7, 1)}?limit=2&cursor=${page.json.fieldsNextCursor}`);
    expect(next.json.fields.map((f: { key: { utf8: string } }) => f.key.utf8)).toEqual(["name", "symbol"]);
    expect(next.json.fieldsNextCursor).toBeNull();
  }, 60_000);

  it("a withdrawn identity is 404 NOT_FOUND, as one never described; its contract is still known", async () => {
    expect(await at(identity(W, D7, 3))).toMatchObject({ status: 404, json: { error: { code: "NOT_FOUND" } } });
    expect(await at(identity(W, D7, 1))).toMatchObject({ status: 404, json: { error: { code: "NOT_FOUND" } } });
    expect(await at(`/v1/contracts/${hex(W)}/tokens`)).toMatchObject({ status: 200, json: { items: [], groups: [], nextCursor: null } });
    expect(await at(`/v1/contracts/${hex(contract(0x99))}/tokens`)).toMatchObject({ status: 404, json: { error: { code: "NOT_FOUND" } } });
  }, 60_000);

  it("M17: lookup by a computed color, held shielded and unshielded; the zero color; /v1/tokens/{color}", async () => {
    const color = hex(tokenColor(D7, A));
    const shielded = (await at(`/v1/lookup/${color}?held=shielded`)).json;
    expect(shielded).toMatchObject({ found: true, result: "identity", identity: { contractAddress: hex(A), domainSep: hex(D7), kind: 1 } });
    expect(shielded.indexedRange).toEqual({ from: S, to: HEAD });
    expect((await at(`/v1/lookup/${color}?held=unshielded`)).json).toMatchObject({ found: false, result: "not-minted-in-indexed-range", identity: null });
    const zero = "00".repeat(32);
    expect((await at(`/v1/lookup/${zero}?held=shielded`)).json).toMatchObject({ found: false, result: "shielded-zero-color" });
    expect((await at(`/v1/lookup/${zero}?held=unshielded`)).json).toMatchObject({ found: true, result: "builtin", builtin: { symbol: "NIGHT" } });
    const token = (await at(`/v1/tokens/${color}`)).json;
    expect(token).toMatchObject({ color, builtin: null, contractAddress: hex(A), domainSep: hex(D7), related: [] });
    expect(token.identities.map((i: { kind: number }) => i.kind)).toEqual([1]);
    expect(await at(`/v1/tokens/${hex(tokenColor(D7, W))}`)).toMatchObject({ status: 404, json: { error: { code: "NOT_FOUND" } } });
  }, 60_000);

  it("M15: /v1/tokens pages NIGHT, DUST, then the identities by (contract, domainSep, kind), the same at any limit", async () => {
    const all = (await at("/v1/tokens?limit=500")).json;
    expect(all.nextCursor).toBeNull();
    expect(all.items.map((t: { id: string }) => t.id)).toEqual([
      "builtin/NIGHT",
      "builtin/DUST",
      `identity/${hex(A)}/${hex(D7)}/1`,
      `identity/${hex(A)}/${hex(D8)}/1`,
      `identity/${hex(B)}/${hex(D7)}/1`,
      `identity/${hex(C)}/${hex(D7)}/1`,
      `identity/${hex(H)}/${hex(D7)}/1`,
    ]);
    const paged: unknown[] = [];
    let cursor: string | null = null;
    do {
      const page: Got = await at(`/v1/tokens?limit=2${cursor === null ? "" : `&cursor=${cursor}`}`);
      paged.push(...page.json.items);
      cursor = page.json.nextCursor;
    } while (cursor !== null);
    expect(paged).toEqual(all.items);
  }, 60_000);

  it("M15: hostile text travels as ASCII escapes and parses back exactly", async () => {
    const got = await at(identity(H, D7, 1));
    expect(got.json.common.name).toBe(HOSTILE_NAME);
    expect(/^[\x20-\x7e]*$/.test(got.text)).toBe(true);
    expect(got.text).not.toMatch(/[<>&]/);
  }, 60_000);

  it("M15: the response headers, and the core's view, height and hash", async () => {
    const got = await at("/v1/status");
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
    expect(got.json).toMatchObject({ startHeight: S, indexedHeight: HEAD, archiveHeight: HEAD, scanner: "following", unresolvedEvents: 0 });
  }, 60_000);

  it("M15: bad input is 400 BAD_REQUEST without echoing it; a cursor works only where it was issued", async () => {
    const tokensCursor = (await at("/v1/tokens?limit=1")).json.nextCursor as string;
    const bad = [
      "/v1/tokens/zz",
      `/v1/identities/${hex(A)}/${hex(D7)}/4`,
      `/v1/identities/${hex(A).slice(2)}/${hex(D7)}/1`,
      "/v1/tokens?limit=0",
      "/v1/tokens?limit=501",
      "/v1/tokens?limit=01",
      "/v1/tokens?other=1",
      "/v1/tokens?limit=",
      `/v1/events?contract=${hex(A)}&cursor=${tokensCursor}`,
      `/v1/contracts/${hex(A)}/tokens?cursor=${tokensCursor}`,
      `/v1/tokens?cursor=${encodeCursor({ e: "tokens", s: 1, k: ["x", "y", 1] })}`,
      "/v1/tokens?cursor=not-a-cursor!",
      "/v1/events",
      `/v1/lookup/${hex(A)}`,
      `/v1/lookup/${hex(A)}?held=both`,
    ];
    for (const path of bad) {
      const got = await at(path);
      expect([path, got.status, got.json?.error?.code]).toEqual([path, 400, "BAD_REQUEST"]);
      expect(got.text).not.toContain("not-a-cursor");
    }
  }, 60_000);

  it("the module API's own answers: an unknown path 404, another method 405 with Allow", async () => {
    expect(await at("/v1/nothing")).toMatchObject({ status: 404, json: { error: { code: "not-found" } } });
    const post = await at("/v1/status", "POST");
    expect(post).toMatchObject({ status: 405, json: { error: { code: "method-not-allowed" } } });
    expect(post.headers.allow).toBe("GET");
  }, 60_000);
});

describe("M13: the marks no chain of the harness gives yet", () => {
  const summary = (unresolved: number, reasons: string[] = []) => ({
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

  it("none: an identity without fields, from a contract with nothing against it", () => {
    expect(markJson({ described: false, fields: new Map() }, summary(0))).toMatchObject({ mark: "none", reasons: [], missing: [], tags: [] });
  });

  it("unresolved: a complete identity of a contract with an unresolved site, with reason unresolved-log and the position", () => {
    expect(markJson({ described: true, fields }, summary(1))).toEqual({
      mark: "unresolved",
      reasons: ["unresolved-log"],
      reasonCount: 0,
      unresolved: { count: 1, positions: [{ height: 5, txIndex: 0, eventIndex: 0 }] },
      missing: [],
      tags: [],
    });
  });

  it("precedence: incorrect over unresolved (its reasons end with unresolved-log), unresolved over partial", () => {
    expect(markJson({ described: true, fields }, summary(1, ["truncated"]))).toMatchObject({ mark: "incorrect", reasons: ["truncated", "unresolved-log"] });
    expect(markJson({ described: true, fields: new Map() }, summary(1))).toMatchObject({ mark: "unresolved" });
    expect(markJson({ described: true, fields }, summary(0))).toMatchObject({ mark: "ok" });
  });
});

describe("M15: BUSY beyond eight requests at once", () => {
  it("answers the ninth request in flight 503 BUSY with Retry-After, and serves again once one ends", async () => {
    const handlers = new Map<string, Parameters<ApiRegistry["http"]>[2]>();
    registerMetadataApi({ http: (_m, path, handler) => void handlers.set(path, handler), subscription: () => undefined });
    const status = handlers.get("/v1/status")!;
    let release!: () => void;
    const held = new Promise<void>((resolve) => (release = resolve));
    const blocking = {
      height: 5n,
      query: async (sql: string) => {
        if (sql.includes("core_block_commit")) return [{ hash: new Uint8Array(32) }];
        await held;
        return [];
      },
    };
    const inFlight = Array.from({ length: DEFAULT_MAX_CONCURRENT_REQUESTS }, () => status({ params: {}, body: undefined }, blocking));
    const busy = await status({ params: {}, body: undefined }, blocking);
    expect(busy.status).toBe(503);
    expect(busy.headers).toMatchObject({ "retry-after": "1" });
    expect(JSON.parse(busy.body as string)).toEqual({ error: { code: "BUSY", message: "too many requests in progress; retry shortly" } });
    release();
    await Promise.all(inFlight);
    const fine = await status({ params: {}, body: undefined }, { height: 5n, query: async (sql: string) => (sql.includes("core_block_commit") ? [{ hash: new Uint8Array(32) }] : []) });
    expect(fine.status).toBe(200);
  });
});
