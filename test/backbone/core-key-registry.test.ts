import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  type AdmittedKey,
  CORE_KEY_REGISTRY,
  CORE_KEY_REGISTRY_ID,
  coreKeyRegistry,
  keyIdOf,
  pendingKeysOf,
  testKeyConflict,
  type TestKey,
} from "../../src/backbone/core-key-registry/index.js";
import { privateBackbone } from "../../src/backbone/private.js";
import { privateIntake } from "../../src/backbone/core-private-source/index.js";
import type { SchemaWriteHandle, BlockWriteHandle, ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import type { BlockContext, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";

/**
 * `core-key-registry`'s parts that need no database (task 14.4; PP-8, PP-10, CF-11): the key id, CF-11's startup
 * checks against the keys a private database admitted, and the part's points over handles the test gives — its
 * `on-start-db` reading the admitted keys and keeping the keys that become pending, at which height, for the loop's
 * `on-key` (`pendingKeysOf`); its `on-compute` putting `admitted-keys`, the keys of the height with `arrived_height`
 * the height; its `on-db-write` writing them, an id already admitted left unchanged. The process on both backends is
 * `test/private/keys.test.ts`'s (A119, A123).
 */

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;
const bytesOf = (text: string): Uint8Array => new Uint8Array(Buffer.from(text.slice(2), "hex"));

/** Obviously fake key bytes: 0x11 repeated, 0x22 repeated. */
const KEY_A: TestKey = { kind: "viewing", bytes: `0x${"11".repeat(32)}`, start: 4 };
const KEY_B: TestKey = { kind: "viewing", bytes: `0x${"22".repeat(32)}`, start: 6 };

/** SHA-256(UTF-8 kind ‖ bytes), computed here with Node.js's own hash. */
const expectedId = (key: TestKey): Uint8Array =>
  new Uint8Array(createHash("sha256").update(Buffer.concat([Buffer.from(key.kind, "utf8"), Buffer.from(bytesOf(key.bytes))])).digest());

/** The registry's process context with the `core` entry's revisions from `start`, the test keys `keys` in their settings. */
function contextOf(keys: readonly TestKey[], start = 1n): ProcessContext {
  return {
    items: new Map(),
    revisions: [Object.freeze({ start, stop: null, version: "0.0.0", settings: Object.freeze({ testKeys: keys }) })],
    publish: () => undefined,
  };
}

/** A schema write handle at `cursor` whose `core_key_registry.keys` holds `admitted` (key id hex → arrived height). */
function startHandle(cursor: bigint | null, admitted: ReadonlyMap<string, bigint>): SchemaWriteHandle & { readonly sql: string[] } {
  const sql: string[] = [];
  return {
    height: cursor,
    sql,
    query: async (text, params = []) => {
      sql.push(text);
      if (/FROM core_key_registry\.keys/.test(text)) {
        const id = hex(params[0] as Uint8Array);
        const arrived = admitted.get(id);
        return arrived === undefined ? [] : [{ arrived_height: arrived }];
      }
      throw new Error(`unexpected statement: ${text}`);
    },
    execute: async (text) => {
      sql.push(text);
      return 0;
    },
  };
}

/** A block context at `height` with the `block` items `items`. */
function blockAt(height: bigint, items: ReadonlyMap<string, unknown> = new Map()): BlockContext {
  return { height, hash: new Uint8Array(32), parentHash: new Uint8Array(32), items, settings: {}, active: () => true };
}

/** What `registry`'s `on-compute` puts at `height`. */
async function computed(registry: ModuleDeclaration, p: ProcessContext, height: bigint): Promise<readonly AdmittedKey[]> {
  const puts = new Map<string, unknown>();
  const read: ReadHandle = { height: height - 1n, query: async () => [] };
  await registry.points["on-compute"]?.(p, blockAt(height), read, { put: (item, value) => puts.set(item, value) });
  expect([...puts.keys()]).toEqual(["admitted-keys"]);
  return puts.get("admitted-keys") as readonly AdmittedKey[];
}

/** The statements and parameters `registry`'s `on-db-write` runs at `height` with `admitted` as its block's item. */
async function written(registry: ModuleDeclaration, p: ProcessContext, height: bigint, admitted: readonly AdmittedKey[]) {
  const calls: { readonly sql: string; readonly params: readonly unknown[] }[] = [];
  const w: BlockWriteHandle = {
    height: height - 1n,
    query: async () => [],
    execute: async (sql, params = []) => {
      calls.push({ sql, params });
      return 1;
    },
  };
  await registry.points["on-db-write"]?.(p, blockAt(height, new Map([["admitted-keys", admitted]])), w);
  return calls;
}

/** The `UmbraError` `pending` rejects with; fails the test when it resolves. */
async function refusalOf(pending: Promise<unknown>): Promise<UmbraError> {
  try {
    await pending;
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  return expect.unreachable("expected a refusal");
}

describe("the key id (PP-8)", () => {
  it("is SHA-256 of the UTF-8 kind followed by the bytes", () => {
    expect(hex(keyIdOf(KEY_A.kind, bytesOf(KEY_A.bytes)))).toBe(hex(expectedId(KEY_A)));
    expect(hex(keyIdOf("vié", new Uint8Array([1, 2])))).toBe(
      hex(new Uint8Array(createHash("sha256").update(Buffer.from([0x76, 0x69, 0xc3, 0xa9, 1, 2])).digest())),
    );
    expect(keyIdOf("a", new Uint8Array([0x62]))).toEqual(keyIdOf("ab", new Uint8Array([])));
    expect(keyIdOf(KEY_A.kind, bytesOf(KEY_A.bytes))).toHaveLength(32);
  });
});

describe("CF-11's startup checks against the admitted keys (test-key-conflict)", () => {
  const none = new Map<string, bigint>();
  const admittedAt = (key: TestKey, height: bigint) => new Map([[hex(expectedId(key)), height]]);

  it("accepts a key admitted at its start, and one not yet admitted whose start is above the private cursor", () => {
    expect(testKeyConflict([KEY_A], admittedAt(KEY_A, 4n), 9n, 1n)).toBeNull();
    expect(testKeyConflict([KEY_B], none, 5n, 1n)).toBeNull();
    // Before the first block the private cursor is S − 1: a key may start at S.
    expect(testKeyConflict([{ ...KEY_A, start: 1 }], none, null, 1n)).toBeNull();
    expect(testKeyConflict([], none, 9n, 1n)).toBeNull();
  });

  it("refuses a key admitted with another start (start-changed), naming it by its place and both heights, never its bytes", () => {
    const refusal = testKeyConflict([KEY_B, { ...KEY_A, start: 5 }], admittedAt(KEY_A, 4n), 5n, 1n) as UmbraError;
    expect(refusal).toBeInstanceOf(UmbraError);
    expect(refusal.code).toBe("test-key-conflict");
    expect(refusal.retryable).toBe(false);
    expect(refusal.details).toEqual({ reason: "start-changed", index: 1, admitted: "4", start: "5" });
    expect(refusal.message).toContain("testKeys[1]");
    expect(refusal.message).toContain("arrived_height 4");
    expect(refusal.message).toContain("start 5");
    expect(refusal.message).toContain("CF-11");
    for (const form of [KEY_A.bytes, KEY_A.bytes.slice(2), hex(expectedId(KEY_A)), hex(expectedId(KEY_A)).slice(2)]) {
      expect(refusal.message).not.toContain(form);
    }
  });

  it("refuses a key not yet admitted whose start is at or below the private cursor (start-passed)", () => {
    const at = testKeyConflict([{ ...KEY_B, start: 5 }], none, 5n, 1n) as UmbraError;
    expect(at.code).toBe("test-key-conflict");
    expect(at.details).toEqual({ reason: "start-passed", index: 0, cursor: "5", start: "5" });
    expect(at.message).toContain("at or below the private cursor 5");
    expect((testKeyConflict([{ ...KEY_B, start: 2 }], none, 5n, 1n) as UmbraError).details.reason).toBe("start-passed");
    // A new private database: its cursor is S − 1, so a start below S can never be admitted.
    const below = testKeyConflict([{ ...KEY_B, start: 2 }], none, null, 3n) as UmbraError;
    expect(below.details).toEqual({ reason: "start-passed", index: 0, cursor: "2", start: "2" });
    expect(below.message).not.toContain(KEY_B.bytes.slice(2));
  });

  it("names the first conflicting key in the list's order", () => {
    const refusal = testKeyConflict([KEY_A, { ...KEY_B, start: 2 }], admittedAt(KEY_A, 3n), 5n, 1n) as UmbraError;
    expect(refusal.details).toMatchObject({ reason: "start-changed", index: 0 });
  });
});

describe("core-key-registry's points (PP-8)", () => {
  it("is the private backbone's second part, providing admitted-keys as a block item and its table", () => {
    expect(CORE_KEY_REGISTRY.id).toBe(CORE_KEY_REGISTRY_ID);
    expect(CORE_KEY_REGISTRY).toMatchObject({ side: "private", requires: [], startsMidChain: true });
    expect(Object.keys(CORE_KEY_REGISTRY.points).sort()).toEqual(["on-compute", "on-db-write", "on-start-db"]);
    expect(privateBackbone(privateIntake())[1]).toBe(CORE_KEY_REGISTRY);
    const other = coreKeyRegistry();
    expect(privateBackbone(privateIntake(), other)[1]).toBe(other);
  });

  it("on-start-db reads each test key's row, refuses a conflict, and keeps the keys not admitted by their start", async () => {
    const p = contextOf([KEY_A, KEY_B]);
    const w = startHandle(4n, new Map([[hex(expectedId(KEY_A)), 4n]]));
    await CORE_KEY_REGISTRY.points["on-start-db"]?.(p, w);
    expect(w.sql.filter((sql) => /core_key_registry\.keys/.test(sql))).toHaveLength(2);
    const pending = pendingKeysOf(p);
    // KEY_A was admitted at 4 (its start): never pending again; KEY_B becomes pending at 6.
    expect(pending.at(4n)).toEqual([]);
    expect(pending.at(5n)).toEqual([]);
    const [key] = pending.at(6n);
    expect(key).toEqual({ keyId: expectedId(KEY_B), kind: "viewing", bytes: bytesOf(KEY_B.bytes) });
    expect(Object.isFrozen(key)).toBe(true);
    // Each call gives new byte arrays: a module that changes its copy changes no other module's.
    expect(pending.at(6n)[0]?.bytes).not.toBe(key?.bytes);
    expect(pending.at(7n)).toEqual([]);

    const conflicting = contextOf([{ ...KEY_A, start: 3 }]);
    const refusal = await refusalOf(
      Promise.resolve(CORE_KEY_REGISTRY.points["on-start-db"]?.(conflicting, startHandle(4n, new Map([[hex(expectedId(KEY_A)), 4n]])))),
    );
    expect(refusal.code).toBe("test-key-conflict");
    expect(() => pendingKeysOf(conflicting).at(5n)).toThrow(/on-start-db/);
  });

  it("on-start-db takes the private cursor from its handle and S from the core entry's first revision", async () => {
    const refusal = await refusalOf(
      Promise.resolve(CORE_KEY_REGISTRY.points["on-start-db"]?.(contextOf([{ ...KEY_B, start: 3 }], 4n), startHandle(null, new Map()))),
    );
    expect(refusal.details).toEqual({ reason: "start-passed", index: 0, cursor: "3", start: "3" });
    const p = contextOf([{ ...KEY_B, start: 4 }], 4n);
    await CORE_KEY_REGISTRY.points["on-start-db"]?.(p, startHandle(null, new Map()));
    expect(pendingKeysOf(p).at(4n)).toHaveLength(1);
  });

  it("pendingKeysOf refuses a context whose on-start-db has not run", () => {
    expect(() => pendingKeysOf(contextOf([KEY_A])).at(1n)).toThrow(/on-start-db/);
  });

  it("on-compute puts the keys of the height with arrived_height the height, every other height none", async () => {
    const p = contextOf([KEY_A, KEY_B, { kind: "spending", bytes: "0x33", start: 6 }]);
    await CORE_KEY_REGISTRY.points["on-start-db"]?.(p, startHandle(null, new Map()));
    expect(await computed(CORE_KEY_REGISTRY, p, 3n)).toEqual([]);
    const at4 = await computed(CORE_KEY_REGISTRY, p, 4n);
    expect(at4).toEqual([{ keyId: expectedId(KEY_A), kind: "viewing", bytes: bytesOf(KEY_A.bytes), arrivedHeight: 4n }]);
    expect(Object.isFrozen(at4)).toBe(true);
    expect(Object.isFrozen(at4[0])).toBe(true);
    const at6 = await computed(CORE_KEY_REGISTRY, p, 6n);
    expect(at6.map((key) => [key.kind, hex(key.bytes), key.arrivedHeight])).toEqual([
      ["viewing", KEY_B.bytes, 6n],
      ["spending", "0x33", 6n],
    ]);
    // A height processed again (its block not committed): its keys are taken again.
    expect(await computed(CORE_KEY_REGISTRY, p, 4n)).toEqual(at4);
    expect(await computed(CORE_KEY_REGISTRY, p, 5n)).toEqual([]);
  });

  it("on-db-write writes the height's admitted keys, an id already admitted left unchanged, and nothing else", async () => {
    const p = contextOf([KEY_A]);
    await CORE_KEY_REGISTRY.points["on-start-db"]?.(p, startHandle(null, new Map()));
    const keys = await computed(CORE_KEY_REGISTRY, p, 4n);
    const calls = await written(CORE_KEY_REGISTRY, p, 4n, keys);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.sql).toMatch(/^INSERT INTO core_key_registry\.keys \(key_id, kind, key_bytes, arrived_height\)/);
    expect(calls[0]?.sql).toMatch(/ON CONFLICT \(key_id\) DO NOTHING$/);
    expect(calls[0]?.params).toEqual([expectedId(KEY_A), "viewing", bytesOf(KEY_A.bytes), 4n]);
    expect(await written(CORE_KEY_REGISTRY, p, 5n, [])).toEqual([]);
  });

  it("the negative control's registry (admission: again) re-admits a known key at the first height after its cursor", async () => {
    const again = coreKeyRegistry({ admission: "again" });
    const p = contextOf([KEY_A]);
    await again.points["on-start-db"]?.(p, startHandle(9n, new Map([[hex(expectedId(KEY_A)), 4n]])));
    expect(pendingKeysOf(p).at(10n)).toHaveLength(1);
    const keys = await computed(again, p, 10n);
    expect(keys.map((key) => key.arrivedHeight)).toEqual([10n]);
    const [call] = await written(again, p, 10n, keys);
    expect(call?.sql).toMatch(/DO UPDATE SET arrived_height = EXCLUDED\.arrived_height$/);
  });
});
