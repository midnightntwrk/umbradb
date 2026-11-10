import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { encodeCursor, registerMetadataApi } from "../../../src/features/token-metadata-api/api.js";
import { servedIdentities } from "../token-metadata/served-state.js";
import { commonRecords } from "../../../src/features/token-metadata/codec/index.js";
import type { ReadHandle } from "../../../src/db/api.js";
import type { ApiRegistry } from "../../../src/modules/declaration.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { blockLogs, contract, domain, eventData, readStopped, runTo } from "../token-metadata/harness.js";

/**
 * The API's edges no chain of the harness reaches, on PostgreSQL 18 and PGlite: rows written straight into a stopped
 * database — an `unresolved` event (as the module stores an unresolved log site), a type-4 value that is not UTF-8 (which
 * the codec never accepts; it shows the text view following the bytes), two
 * symbol groups on one contract — answered through the handlers; cursors of the right endpoint but the wrong shape or
 * filter, and one that is no JSON; a read that fails (not the handlers' own error) passed on to the module API; and
 * the served field (`fieldOf`) without a `usable` answer.
 */

const S = 5_000;
const A = contract(0xa5);
const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");
type Json = any;
type Handler = Parameters<ApiRegistry["http"]>[2];

const handlers = new Map<string, Handler>();
registerMetadataApi({ http: (_m, path, handler) => void handlers.set(path, handler), subscription: () => undefined });

/** Answers `path` through `route`'s handler at the stopped database's cursor. */
async function answer(db: ProcessDatabase, route: string, path: string): Promise<{ status: number; json: Json }> {
  const url = new URL(path, "http://x");
  const segments = url.pathname.split("/");
  const params: Record<string, string> = Object.fromEntries(url.searchParams);
  route.split("/").forEach((s, i) => {
    if (s.startsWith(":")) params[s.slice(1)] = segments[i]!;
  });
  return readStopped(db, async (read) => {
    const got = await handlers.get(route)!({ params, body: undefined }, read);
    return { status: got.status, json: JSON.parse(got.body as string) };
  });
}

describe.each(PROCESS_BACKENDS)("the API's edges on $name", (backend: ProcessBackend) => {
  let db: ProcessDatabase;

  beforeAll(async () => {
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
    await db.query("INSERT INTO token_metadata.counts (id, unresolved) VALUES (1, 1)");
    await db.query(
      `INSERT INTO token_metadata.fields (contract_address, domain_sep, kind, key, val_type, value, uint_value, usable, defined,
         set_height, set_tx, set_event, set_record)
       VALUES ('\\x${hex(A)}'::bytea, '\\x${hex(domain(1))}'::bytea, 1, convert_to('image', 'UTF8'), 4, '\\xff00ff'::bytea, NULL, false, true,
         ${S + 1}, 0, 0, 9)`,
    );
  }, 240_000);
  afterAll(() => backend.stop(), 60_000);

  it("an unresolved event marks its contract's complete identities unresolved, with its position; status counts it", async () => {
    const id = await answer(db, "/v1/identities/:contract/:domainSep/:kind", `/v1/identities/${hex(A)}/${hex(domain(3))}/1`);
    expect(id.json.mark).toEqual({
      mark: "unresolved",
      reasons: ["unresolved-log"],
      reasonCount: 0,
      unresolved: { count: 1, positions: [{ height: S + 1, txIndex: 7, eventIndex: 0 }] },
      missing: [],
      tags: [],
    });
    expect((await answer(db, "/v1/status", "/v1/status")).json.unresolvedEvents).toBe(1);
    const events = await answer(db, "/v1/events", `/v1/events?contract=${hex(A)}&limit=500`);
    expect(events.json.items.at(-1)).toMatchObject({ classification: "unresolved", reason: "not-a-literal", txHash: "77".repeat(32) });
  }, 60_000);

  it("a type-4 value that is not UTF-8 is served as hex only, with no text view", async () => {
    // The codec rejects a type-4 value that is not an RFC 3986 URI, so no chain stores this row; written here, it shows
    // the field's text view following the bytes. Its `image` follows the type (an accepted type-4 value is a URI), its
    // URL as the bytes' Latin-1 text.
    const id = await answer(db, "/v1/identities/:contract/:domainSep/:kind", `/v1/identities/${hex(A)}/${hex(domain(1))}/1`);
    const image = id.json.fields.find((f: Json) => f.key.utf8 === "image");
    expect(image).toMatchObject({ valType: 4, valTypeName: "uri", value: { hex: "ff00ff" }, usable: false });
    expect(image.value.text).toBeUndefined();
    expect(id.json.image).toEqual({ url: "\u00ff\u0000\u00ff", status: "pending", imageUrl: null });
  }, 60_000);

  it("a contract's page lists each of its groups once, by symbol bytes", async () => {
    const tokens = await answer(db, "/v1/contracts/:address/tokens", `/v1/contracts/${hex(A)}/tokens`);
    expect(tokens.json.groups.map((g: Json) => [g.symbol.utf8, g.memberCount])).toEqual([
      ["AG", 2],
      ["ZZ", 2],
    ]);
  }, 60_000);

  it("events page in chain order through their cursor, and a cursor is refused under another filter or shape", async () => {
    const first = await answer(db, "/v1/events", `/v1/events?contract=${hex(A)}&limit=2`);
    const second = await answer(db, "/v1/events", `/v1/events?contract=${hex(A)}&limit=2&cursor=${first.json.nextCursor}`);
    const all = await answer(db, "/v1/events", `/v1/events?contract=${hex(A)}&limit=500`);
    expect([...first.json.items, ...second.json.items]).toEqual(all.json.items.slice(0, 4));
    const refused = [
      `/v1/events?tx=${"77".repeat(32)}&cursor=${first.json.nextCursor}`,
      `/v1/events?contract=${hex(A)}&cursor=${encodeCursor({ e: "events", f: [hex(A), null], k: [1, 2] })}`,
      `/v1/events?contract=${hex(A)}&cursor=abc`,
      // A transaction or event index above the integer columns is no position, so no cursor (not a 500).
      `/v1/events?contract=${hex(A)}&cursor=${encodeCursor({ e: "events", f: [hex(A), null], k: [1, 2 ** 31, 0] })}`,
      `/v1/events?contract=${hex(A)}&cursor=${encodeCursor({ e: "events", f: [hex(A), null], k: [1, 0, 2 ** 31] })}`,
    ];
    for (const path of refused) expect([path, (await answer(db, "/v1/events", path)).status]).toEqual([path, 400]);
    const tokens = `/v1/contracts/${hex(A)}/tokens?cursor=${encodeCursor({ e: "contract-tokens", c: hex(A), k: ["zz", 1] })}`;
    expect((await answer(db, "/v1/contracts/:address/tokens", tokens)).status).toBe(400);
  }, 60_000);

  it("a read that fails is passed on (the module API answers it 500), never answered as the handlers' own error", async () => {
    const failing: ReadHandle = {
      height: 5n,
      query: async (sql: string) => {
        if (sql.includes("core_block_commit")) return [{ hash: new Uint8Array(32) }];
        throw new Error("the database went away");
      },
    };
    await expect(handlers.get("/v1/status")!({ params: {}, body: undefined }, failing)).rejects.toThrow("the database went away");
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

describe("/v1/status names the network by its genesis hash", () => {
  const statusOf = async (genesis: string) => {
    const read: ReadHandle = {
      height: 5n,
      query: async (sql: string) => {
        if (sql.includes("core_block_commit")) return [{ hash: new Uint8Array(32) }];
        if (sql.includes("core_chain.identity")) return [{ genesis_hash: Buffer.from(genesis.slice(2), "hex"), start_height: "3" }];
        return [{ n: 0 }];
      },
    };
    const got = await handlers.get("/v1/status")!({ params: {}, body: undefined }, read);
    return JSON.parse(got.body as string) as { network: string; genesisHash: string };
  };

  it("gives each of UmbraDB's built-in networks its name, and an unknown chain its genesis hash", async () => {
    const { BUILT_IN_NETWORKS } = await import("../../../src/ledger/networks.js");
    const named = BUILT_IN_NETWORKS.filter((entry) => entry.genesis !== null);
    expect(named.map((entry) => entry.network)).toEqual(expect.arrayContaining(["mainnet", "preprod", "preview"]));
    for (const entry of named) expect(await statusOf(entry.genesis!.hash)).toMatchObject({ network: entry.network, genesisHash: entry.genesis!.hash });
    const other = `0x${"ab".repeat(32)}`;
    expect(await statusOf(other)).toMatchObject({ network: other, genesisHash: other });
  });
});
