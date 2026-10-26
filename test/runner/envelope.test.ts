import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import type { ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import {
  answerChainData,
  CHAIN_DATA_HEADERS,
  type ChainDataView,
  chainDataHeaders,
  NO_COMMITTED_HEIGHT_STATUS,
  readChainDataView,
  withViewExtensions,
} from "../../src/runner/envelope.js";
import { BACKENDS } from "../db/backends.js";

/**
 * The chain-data envelope of module API responses (task 5.2; RN-16, CORE-ARCH §4.20): a response states the view it
 * answers from (`finalized`), and the height and hash of the read's committed height — as the headers `X-Umbra-View`,
 * `X-Umbra-Height` and `X-Umbra-Hash` over HTTP, and in a GraphQL response's `extensions`, its `data` unchanged —; a
 * read before any height commits is refused with `no-committed-height`, HTTP 503. Heights are written as decimal
 * strings and hashes as `0x`-prefixed lowercase hex, as the process transport writes them (CORE-ARCH §4.14). Mounting
 * the handlers on `listen.api` and A75 through a registered handler are task 5.2a's.
 */

const HASH = Uint8Array.from({ length: 32 }, (_, i) => i * 8);
const HEX = `0x${Buffer.from(HASH).toString("hex")}`;
const VIEW: ChainDataView = { view: "finalized", height: 120n, hash: HASH };

/** A read handle at `height` whose cursor table holds `rows` (height → hash), recording what it was asked. */
function readAt(height: bigint | null, rows: ReadonlyMap<bigint, Uint8Array>, asked: unknown[][] = []): ReadHandle {
  return {
    height,
    query: async (sql, params) => {
      asked.push([sql, ...(params ?? [])]);
      const hash = rows.get(params?.[0] as bigint);
      return hash === undefined ? [] : [{ hash }];
    },
  };
}

describe("the chain-data envelope (RN-16)", () => {
  it("names its three headers", () => {
    expect(CHAIN_DATA_HEADERS).toEqual({ view: "X-Umbra-View", height: "X-Umbra-Height", hash: "X-Umbra-Hash" });
    expect(Object.isFrozen(CHAIN_DATA_HEADERS)).toBe(true);
    expect(NO_COMMITTED_HEIGHT_STATUS).toBe(503);
  });

  it("reads the view of a read: finalized, its committed height and that block's hash, in the read's snapshot", async () => {
    const asked: unknown[][] = [];
    const view = await readChainDataView(readAt(120n, new Map([[120n, HASH]]), asked));
    expect(view).toEqual(VIEW);
    expect(Object.isFrozen(view)).toBe(true);
    expect(asked).toEqual([["SELECT hash FROM core_block_commit.blocks WHERE height = $1", 120n]]);
  });

  it("refuses a read before any height commits with no-committed-height, and asks nothing", async () => {
    const asked: unknown[][] = [];
    const refused = await readChainDataView(readAt(null, new Map(), asked)).catch((error: unknown) => error);
    expect(refused).toBeInstanceOf(UmbraError);
    expect((refused as UmbraError).code).toBe("no-committed-height");
    expect((refused as UmbraError).retryable).toBe(false);
    expect((refused as UmbraError).message).toBe(
      "no height has committed yet: chain data is answered once block S commits (RN-16)",
    );
    expect(asked).toEqual([]);
  });

  it("throws when the read's height has no cursor row, which only a read not given cursorHeight can have", async () => {
    await expect(readChainDataView(readAt(7n, new Map([[6n, HASH]])))).rejects.toThrow(
      "the read reports the committed height 7, which the cursor table does not hold: a read's committed height " +
        "comes from the cursor table (cursorHeight)",
    );
  });

  it("writes the headers: the view, the height in decimal and the hash in 0x-prefixed lowercase hex", () => {
    expect(chainDataHeaders(VIEW)).toEqual({ "X-Umbra-View": "finalized", "X-Umbra-Height": "120", "X-Umbra-Hash": HEX });
    expect(chainDataHeaders({ ...VIEW, height: 2n ** 70n })["X-Umbra-Height"]).toBe("1180591620717411303424");
  });

  it("adds the view to a GraphQL response's extensions, its data and errors unchanged", () => {
    const data = { blocks: [{ height: 120 }] };
    const errors = [{ message: "partial" }];
    const body = { data, errors };
    const answered = withViewExtensions(body, VIEW);
    expect(answered).toEqual({ data, errors, extensions: { view: "finalized", height: "120", hash: HEX } });
    expect(answered.data).toBe(data);
    expect(answered.errors).toBe(errors);
    expect(body).toEqual({ data, errors });
  });

  it("keeps a response's own extensions beside the view, the view's names winning", () => {
    const answered = withViewExtensions({ data: null, extensions: { cost: 3, height: "spoofed" } }, VIEW);
    expect(answered.extensions).toEqual({ cost: 3, view: "finalized", height: "120", hash: HEX });
  });

  it("refuses extensions that are not an object", () => {
    for (const extensions of [null, "x", 3, ["a"]]) {
      expect(() => withViewExtensions({ data: null, extensions }, VIEW)).toThrow(
        "a GraphQL response's extensions must be an object (GraphQL's response format) to carry the view",
      );
    }
  });

  it("answers an HTTP request with the module's answer and the envelope's headers, which win over the module's", async () => {
    const read = readAt(120n, new Map([[120n, HASH]]));
    const answer = await answerChainData(read, async (view) => {
      expect(view).toEqual(VIEW);
      return {
        status: 200,
        headers: { "Content-Type": "application/json", "x-umbra-height": "1", "X-UMBRA-HASH": "0x00" },
        body: { ok: true },
      };
    });
    expect(answer).toEqual({
      status: 200,
      headers: { "Content-Type": "application/json", "X-Umbra-View": "finalized", "X-Umbra-Height": "120", "X-Umbra-Hash": HEX },
      body: { ok: true },
    });
  });

  it("answers an HTTP request whose answer has no headers", async () => {
    const answer = await answerChainData(readAt(120n, new Map([[120n, HASH]])), async () => ({ status: 201, body: "made" }));
    expect(answer).toEqual({ status: 201, headers: chainDataHeaders(VIEW), body: "made" });
  });

  it("answers 503 no-committed-height before any height commits, without calling the module", async () => {
    let called = false;
    const answer = await answerChainData(readAt(null, new Map()), async () => {
      called = true;
      return { status: 200, body: null };
    });
    expect(called).toBe(false);
    expect(answer).toEqual({
      status: 503,
      headers: {},
      body: {
        error: {
          code: "no-committed-height",
          message: "no height has committed yet: chain data is answered once block S commits (RN-16)",
        },
      },
    });
  });

  it("passes on any other error, the module's included", async () => {
    const error = new Error("module broke");
    await expect(answerChainData(readAt(120n, new Map([[120n, HASH]])), () => Promise.reject(error))).rejects.toBe(error);
    await expect(answerChainData(readAt(7n, new Map()), async () => ({ status: 200, body: null }))).rejects.toThrow(
      /which the cursor table does not hold/,
    );
  });
});

describe.each(BACKENDS)("the chain-data envelope over a database on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("reads the view of the committed height and its hash through the database API", async () => {
    const empty = await backend.database("SELECT 1", cursorHeight);
    const refused = await empty.db.read((read) => readChainDataView(read)).catch((error: unknown) => error);
    expect((refused as UmbraError).code).toBe("no-committed-height");
    const { db } = await backend.database(
      "CREATE SCHEMA core_block_commit; " +
        "CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL, parent_hash bytea NOT NULL); " +
        `INSERT INTO core_block_commit.blocks VALUES (119, '\\x01', '\\x00'), (120, '\\x${HEX.slice(2)}', '\\x01')`,
      cursorHeight,
    );
    expect(await db.read((read) => readChainDataView(read))).toEqual(VIEW);
    const answer = await db.read((read) => answerChainData(read, async () => ({ status: 200, body: { data: 1 } })));
    expect(answer.headers).toEqual({ "X-Umbra-View": "finalized", "X-Umbra-Height": "120", "X-Umbra-Hash": HEX });
  }, 60_000);
});
