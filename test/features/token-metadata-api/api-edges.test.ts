import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TOKEN_METADATA_API } from "../../../src/features/token-metadata-api/token-metadata-api.js";
import { encodeCursor } from "../../../src/features/token-metadata-api/tokens.js";
import { servedIdentities } from "../token-metadata/served-state.js";
import { commonRecords } from "../../../src/features/token-metadata/codec/index.js";
import type { ReadHandle } from "../../../src/db/api.js";
import type { ApiRegistry } from "../../../src/modules/declaration.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, readStopped, runTo, TOKENS_PATH } from "../token-metadata/harness.js";

/**
 * The API's edges no chain of the harness reaches, on PostgreSQL 18 and PGlite: rows written straight into a stopped
 * database — an `unresolved` event (as the indexer stores an unresolved log site), a type-4 value that is not UTF-8
 * (which the codec never accepts; it shows the text view following the bytes), two symbol groups on one contract —
 * answered through the route's handler as the module registers it; cursors of the right shape but another contract or
 * kind, and ones that are no cursor; a read that fails (not the handler's own error) passed on to the module API; and
 * the served field (`fieldOf`) without a `usable` answer.
 */

const S = 5_000;
const A = contract(0xa5);
const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
type Json = any;
type Handler = Parameters<ApiRegistry["http"]>[2];

/** The tokens route's handler, as `token-metadata-api` registers it on the module API. */
async function tokensHandler(): Promise<Handler> {
  const handlers = new Map<string, Handler>();
  await TOKEN_METADATA_API.points["on-start-api"]!(
    { items: new Map(), revisions: [], publish: () => undefined } as never,
    { http: (_m, path, handler) => void handlers.set(path, handler), subscription: () => undefined },
  );
  return handlers.get(TOKENS_PATH)!;
}

describe.each(PROCESS_BACKENDS)("the API's edges on $name", (backend: ProcessBackend) => {
  let db: ProcessDatabase;
  let handler: Handler;
  /** Answers `body` through the handler at the stopped database's cursor. */
  const tokens = (body: unknown): Promise<{ status: number; json: Json }> =>
    readStopped(db, async (read) => {
      const got = await handler({ params: {}, body }, read);
      return { status: got.status, json: JSON.parse(got.body as string) };
    });

  beforeAll(async () => {
    handler = await tokensHandler();
    await backend.start();
    db = await backend.database();
    const logs = new Map([
      [
        BigInt(S + 1),
        blockLogs(
          [0, A, eventData(domain(1), 1, commonRecords({ name: "One", symbol: "AG", decimals: 0 }))],
          [0, A, eventData(domain(2), 1, commonRecords({ name: "Two", symbol: "AG", decimals: 0 }))],
          [1, A, eventData(domain(3), 1, commonRecords({ name: "Three", symbol: "ZZ", decimals: 0 }))],
          [1, A, eventData(domain(4), 1, commonRecords({ name: "Four", symbol: "ZZ", decimals: 0 }))],
        ),
      ],
    ]);
    await runTo(db, { start: S, head: S + 2, logs });
    await db.query(
      `INSERT INTO token_metadata.events (height, tx_index, event_index, tx_hash, contract_address, entry_point, classification, reason)
       VALUES (${S + 1}, 7, 0, '\\x${"77".repeat(32)}'::bytea, '\\x${hex(A)}'::bytea, '\\x'::bytea, 'unresolved', 'not-a-literal')`,
    );
    await db.query(
      `INSERT INTO token_metadata.fields (contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined,
         set_height, set_tx, set_event, set_record)
       VALUES ('\\x${hex(A)}'::bytea, '\\x${hex(domain(1))}'::bytea, 1, convert_to('image', 'UTF8'), 4, '\\xff00ff'::bytea, NULL, false, true,
         ${S + 1}, 0, 0, 9)`,
    );
  }, 240_000);
  afterAll(() => backend.stop(), 60_000);

  it("an unresolved event marks its contract's complete tokens unresolved, with its position", async () => {
    const got = await tokens({ contract: hex(A), domainSep: hex(domain(3)), kind: 1 });
    expect(got.json.items[0].mark).toEqual({
      mark: "unresolved",
      reasons: ["unresolved-log"],
      reasonCount: 0,
      unresolved: { count: 1, positions: [{ height: S + 1, txIndex: 7, eventIndex: 0 }] },
      missing: [],
      tags: [],
    });
  }, 60_000);

  it("a type-4 value that is not UTF-8 is served as hex only, with no text view", async () => {
    // The codec rejects a type-4 value that is not an RFC 3986 URI, so no chain stores this row; written here, it shows
    // the field's text view following the bytes. Its `image` follows the type (an accepted type-4 value is a URI), its
    // URL as the bytes' Latin-1 text.
    const [token] = (await tokens({ contract: hex(A), domainSep: hex(domain(1)), kind: 1 })).json.items;
    const image = token.fields.find((f: Json) => f.key.utf8 === "image");
    expect(image).toMatchObject({ valType: 4, valTypeName: "uri", value: { hex: "ff00ff" }, usable: false });
    expect(image.value.text).toBeUndefined();
    expect(token.image).toEqual({ url: "ÿ\u0000ÿ", status: "pending", imageUrl: null });
  }, 60_000);

  it("each token of a contract carries its own group, by symbol bytes", async () => {
    const got = await tokens({ contract: hex(A) });
    expect(got.json.items.map((t: Json) => [t.domainSep.slice(-2), t.group.symbol.utf8, t.group.memberCount])).toEqual([
      ["01", "AG", 2],
      ["02", "AG", 2],
      ["03", "ZZ", 2],
      ["04", "ZZ", 2],
    ]);
  }, 60_000);

  it("a contract's pages continue through their cursor; a cursor of another contract, kind or shape is refused", async () => {
    const first = await tokens({ contract: hex(A), limit: 2 });
    const second = await tokens({ contract: hex(A), limit: 2, cursor: first.json.nextCursor });
    const all = await tokens({ contract: hex(A) });
    expect([...first.json.items, ...second.json.items]).toEqual(all.json.items);
    expect(second.json.nextCursor).toBeNull();
    const refused = [
      encodeCursor({ c: hex(contract(0xb0)), k: [hex(domain(1)), 1] }),
      encodeCursor({ c: hex(A), k: [hex(domain(1)), 4] }),
      encodeCursor({ c: hex(A), k: ["zz", 1] }),
      Buffer.from(JSON.stringify({ c: hex(A), k: [hex(domain(1)), 1], extra: 1 })).toString("base64url"),
      Buffer.from("not json").toString("base64url"),
      "abc",
    ];
    for (const cursor of refused) expect([cursor, (await tokens({ contract: hex(A), cursor })).status]).toEqual([cursor, 400]);
  }, 60_000);

  it("a read that fails is passed on (the module API answers it 500), never answered as the handler's own error", async () => {
    const failing: ReadHandle = {
      height: 5n,
      query: async (sql: string) => {
        if (sql.includes("core_block_commit")) return [{ hash: new Uint8Array(32) }];
        throw new Error("the database went away");
      },
    };
    await expect(handler({ params: {}, body: { contract: hex(A) } }, failing)).rejects.toThrow("the database went away");
  });
});

describe("the served fields (fieldOf)", () => {
  it("serve a field with no usable answer without one, and a type-2 value with its integer", async () => {
    const row = (key: string, valType: number, usable: boolean | null, uint: string | null) => ({
      contract_address: new Uint8Array(32),
      domain_sep: new Uint8Array(32),
      kind: 3,
      key: new TextEncoder().encode(key),
      val_type: valType,
      value: Uint8Array.of(6),
      uint_value: uint,
      usable,
      set_height: "1",
      set_tx: 0,
      set_event: 0,
      set_record: 0,
    });
    const [identity] = await servedIdentities({ query: async () => [row("custom", 0, null, null), row("decimals", 2, true, "6")] }, "n");
    const custom = identity!.fields.get(Buffer.from("custom").toString("hex"))!;
    expect("usable" in custom).toBe(false);
    expect(identity!.fields.get(Buffer.from("decimals").toString("hex"))).toMatchObject({ usable: true, integer: 6n });
  });
});
