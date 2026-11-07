import { describe, expect, it } from "vitest";
import { type BlockEventSource, systemEventsKey } from "../../src/backbone/core-block-fetch/events.js";
import { readRuntimeMetadata, type RuntimeMetadataView } from "../../src/backbone/core-block-fetch/metadata.js";
import { ScaleReader } from "../../src/backbone/core-block-fetch/scale.js";
import {
  bindCoreChainEvents,
  boundEventSource,
  chainEventsOf,
  metadataView,
  writeEventRows,
} from "../../src/backbone/core-chain-events/core-chain-events.js";
import { type ChainEvent, decodeChainEvents } from "../../src/backbone/core-chain-events/events.js";
import type { BlockContext, ProcessContext } from "../../src/modules/declaration.js";
import { canonicalJson, MAX_DEPTH, type ScaleValue, ValueReader } from "../../src/backbone/core-chain-events/scale-value.js";
import {
  dispatchInfo,
  ev,
  SYSTEM_EVENTS_STORAGE,
  eventsValue,
  metadataV14,
  midnightMetadata,
  moduleError,
  record,
  Registry,
  V2_0,
  V2_1,
} from "./events-fixtures.js";
import { compact } from "./fetch-fixtures.js";

/**
 * The decoding of chain events. The tests cover the metadata's storage entries, the values read with a type registry
 * and their canonical JSON, and a block's chain events: every phase, topics, the records' bytes, an upgrade block's
 * events against the old and the new runtime, and every refusal. [CD-4]
 *
 * The process-level criteria are tested in `chain-data.test.ts`. [A91, A92, A93]
 */

const bytesOf = (...values: number[]): Uint8Array => Uint8Array.from(values);
const fill = (byte: number, length = 32): Uint8Array => new Uint8Array(length).fill(byte);
const hexOf = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

// ── XXH64 and twox128, written here from the algorithm's definition, to check the storage key ──────────────────────

const MASK = (1n << 64n) - 1n;
const P1 = 11400714785074694791n;
const P2 = 14029467366897019727n;
const P3 = 1609587929392839161n;
const P4 = 9650029242287828579n;
const P5 = 2870177450012600261n;
const rotl = (x: bigint, r: bigint): bigint => ((x << r) | (x >> (64n - r))) & MASK;
const round = (acc: bigint, input: bigint): bigint => (rotl((acc + input * P2) & MASK, 31n) * P1) & MASK;
const merge = (acc: bigint, value: bigint): bigint => (((acc ^ round(0n, value)) * P1) + P4) & MASK;
const le = (data: Uint8Array, at: number, width: number): bigint => {
  let value = 0n;
  for (let i = width - 1; i >= 0; i--) value = (value << 8n) | BigInt(data[at + i] as number);
  return value;
};

function xxh64(data: Uint8Array, seed: bigint): bigint {
  let at = 0;
  let h: bigint;
  if (data.length >= 32) {
    let v = [(seed + P1 + P2) & MASK, (seed + P2) & MASK, seed, (seed - P1) & MASK];
    for (; at + 32 <= data.length; at += 32) v = v.map((acc, i) => round(acc, le(data, at + 8 * i, 8)));
    h = (rotl(v[0] as bigint, 1n) + rotl(v[1] as bigint, 7n) + rotl(v[2] as bigint, 12n) + rotl(v[3] as bigint, 18n)) & MASK;
    for (const acc of v) h = merge(h, acc);
  } else {
    h = (seed + P5) & MASK;
  }
  h = (h + BigInt(data.length)) & MASK;
  for (; at + 8 <= data.length; at += 8) h = ((rotl(h ^ round(0n, le(data, at, 8)), 27n) * P1) + P4) & MASK;
  if (at + 4 <= data.length) {
    h = ((rotl(h ^ ((le(data, at, 4) * P1) & MASK), 23n) * P2) + P3) & MASK;
    at += 4;
  }
  for (; at < data.length; at++) h = (rotl(h ^ ((BigInt(data[at] as number) * P5) & MASK), 11n) * P1) & MASK;
  h ^= h >> 33n;
  h = (h * P2) & MASK;
  h ^= h >> 29n;
  h = (h * P3) & MASK;
  return h ^ (h >> 32n);
}

const twox128 = (value: string): string => {
  const data = new TextEncoder().encode(value);
  const word = (x: bigint): string => Buffer.from(Array.from({ length: 8 }, (_, i) => Number((x >> BigInt(8 * i)) & 0xffn))).toString("hex");
  return word(xxh64(data, 0n)) + word(xxh64(data, 1n));
};

describe("the System::Events storage key", () => {
  it("is twox128(System) ++ twox128(Events): the prefix the mainnet answers hold, and the node's whitelisted key", () => {
    // test/node/fixtures/mainnet-answers.json holds twox128("System") as the prefix of every System key it read.
    expect(twox128("System")).toBe("26aa394eea5630e07c48ae0c9558cef7");
    expect(twox128("Number")).toBe("02a5c1b19ab7a04f536c519aca4983ac");
    expect(hexOf(systemEventsKey())).toBe(`0x${twox128("System")}${twox128("Events")}`);
    expect(hexOf(systemEventsKey())).toBe(SYSTEM_EVENTS_STORAGE);
    // A new array at every call: one caller cannot change another's.
    systemEventsKey()[0] = 0;
    expect(systemEventsKey()[0]).toBe(0x26);
  });
});

describe("the metadata's storage entries", () => {
  it("reads each pallet's storage prefix and entries: names, modifiers, plain and map types with their hashers", () => {
    const view = readRuntimeMetadata(midnightMetadata(V2_0));
    const system = view.pallets.find((pallet) => pallet.name === "System");
    expect(system?.storage?.prefix).toBe("System");
    expect(system?.storage?.entries.map((entry) => [entry.name, entry.modifier, entry.kind])).toEqual([
      ["Number", "default", "plain"],
      ["Events", "default", "plain"],
    ]);
    const events = system?.storage?.entries[1];
    expect(events?.kind === "plain" && view.types.get(events.value)?.def.kind).toBe("sequence");
    expect(view.pallets.find((pallet) => pallet.name === "Timestamp")?.storage).toBeNull();
    // A map entry, an optional modifier and every hasher, around a registry of two types.
    const t = new Registry();
    const u32 = t.primitive("u32");
    const u64 = t.primitive("u64");
    const map = readRuntimeMetadata(
      metadataV14(t, [{ name: "Pool", index: 7, storage: { prefix: "Pool", entries: [{ name: "Totals", kind: "map", hashers: [0, 1, 2, 3, 4, 5, 6], key: u32, value: u64 }] } }], u32, u32),
    );
    expect(map.pallets[0]?.storage).toEqual({
      prefix: "Pool",
      entries: [
        {
          name: "Totals",
          modifier: "default",
          kind: "map",
          hashers: ["Blake2_128", "Blake2_256", "Blake2_128Concat", "Twox128", "Twox256", "Twox64Concat", "Identity"],
          key: u32,
          value: u64,
        },
      ],
    });
    expect(Object.isFrozen(map.pallets[0]?.storage)).toBe(true);
    expect(Object.isFrozen(map.pallets[0]?.storage?.entries[0])).toBe(true);
  });

  it("refuses a storage entry that names a type the registry lacks", () => {
    const t = new Registry();
    const u32 = t.primitive("u32");
    const bytes = metadataV14(t, [{ name: "Pool", index: 7, storage: { prefix: "Pool", entries: [{ name: "Gone", kind: "plain", value: 9 }] } }], u32, u32);
    expect(() => readRuntimeMetadata(bytes)).toThrow(/the pallet Pool names the type 9, which the registry lacks/);
    const key = metadataV14(t, [{ name: "Pool", index: 7, storage: { prefix: "Pool", entries: [{ name: "Gone", kind: "map", hashers: [6], key: 8, value: u32 }] } }], u32, u32);
    expect(() => readRuntimeMetadata(key)).toThrow(/names the type 8/);
  });
});

/** Reads one value of the type `id` of `t`'s registry from `bytes`, which must be read to the end. */
function read(t: Registry, id: number, bytes: readonly number[]): ScaleValue {
  const types = readRuntimeMetadata(metadataV14(t, [], id, id)).types;
  const r = new ScaleReader(Uint8Array.from(bytes), "a test value");
  const value = new ValueReader(types).value(r, id);
  r.end();
  return value;
}

describe("values read with the type registry", () => {
  it("reads every primitive: bool, char, str, unsigned and signed integers as numbers up to 32 bits, bigints above", () => {
    const t = new Registry();
    const ids = Object.fromEntries(
      (["bool", "char", "str", "u8", "u16", "u32", "u64", "u128", "i8", "i16", "i32", "i64", "i128"] as const).map((name) => [name, t.primitive(name)]),
    ) as Record<string, number>;
    const u256 = t.add([], [5, 8]);
    const i256 = t.add([], [5, 14]);
    const at = (name: string) => ids[name] as number;
    expect(read(t, at("bool"), [0])).toBe(false);
    expect(read(t, at("bool"), [1])).toBe(true);
    expect(() => read(t, at("bool"), [2])).toThrow(/a bool 2, not 0 or 1/);
    expect(read(t, at("char"), [0x41, 0, 0, 0])).toBe("A");
    expect(read(t, at("char"), [0x00, 0xf6, 0x01, 0])).toBe("😀");
    expect(() => read(t, at("char"), [0x00, 0xd8, 0, 0])).toThrow(/a char 55296, which is no Unicode scalar value/);
    expect(() => read(t, at("char"), [0x00, 0x00, 0x11, 0])).toThrow(/no Unicode scalar value/);
    expect(read(t, at("str"), [...compact(3), 0x61, 0x62, 0x63])).toBe("abc");
    expect(() => read(t, at("str"), [...compact(1), 0xff])).toThrow(/not UTF-8/);
    expect(read(t, at("u8"), [0xff])).toBe(255);
    expect(read(t, at("u16"), [0x34, 0x12])).toBe(0x1234);
    expect(read(t, at("u32"), [0xff, 0xff, 0xff, 0xff])).toBe(4_294_967_295);
    expect(read(t, at("u64"), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])).toBe(18_446_744_073_709_551_615n);
    expect(read(t, at("u128"), [1, ...new Array<number>(15).fill(0)])).toBe(1n);
    expect(read(t, u256, [...new Array<number>(31).fill(0), 0x80])).toBe(1n << 255n);
    expect(read(t, at("i8"), [0xff])).toBe(-1);
    expect(read(t, at("i8"), [0x80])).toBe(-128);
    expect(read(t, at("i16"), [0x00, 0x80])).toBe(-32_768);
    expect(read(t, at("i32"), [0xfe, 0xff, 0xff, 0xff])).toBe(-2);
    expect(read(t, at("i64"), [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f])).toBe(9_223_372_036_854_775_807n);
    expect(read(t, at("i64"), [0, 0, 0, 0, 0, 0, 0, 0x80])).toBe(-9_223_372_036_854_775_808n);
    expect(read(t, at("i128"), new Array<number>(16).fill(0xff))).toBe(-1n);
    expect(read(t, i256, [0x05, ...new Array<number>(31).fill(0)])).toBe(5n);
    expect(() => read(t, at("u32"), [1, 2])).toThrow(/4 bytes are needed and 2 are left/);
  });

  it("reads compacts as their integer type, through single-field composites, and refuses one too large or not unsigned", () => {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const u32 = t.primitive("u32");
    const u64 = t.primitive("u64");
    const i32 = t.primitive("i32");
    const str = t.primitive("str");
    const c8 = t.compactOf(u8);
    const c32 = t.compactOf(u32);
    const c64 = t.compactOf(u64);
    const perbill = t.composite(["sp_arithmetic", "Perbill"], [[null, u32]]);
    const cPerbill = t.compactOf(perbill);
    const cSigned = t.compactOf(i32);
    const cText = t.compactOf(str);
    expect(read(t, c32, compact(1_000_000))).toBe(1_000_000);
    expect(read(t, c64, compact(2n ** 64n - 1n))).toBe(2n ** 64n - 1n);
    expect(read(t, cPerbill, compact(500_000_000))).toBe(500_000_000);
    expect(read(t, c8, compact(255))).toBe(255);
    expect(() => read(t, c8, compact(256))).toThrow(/the compact 256, too large for u8/);
    expect(() => read(t, c32, compact(2n ** 32n))).toThrow(/too large for u32/);
    expect(() => read(t, cSigned, compact(1))).toThrow(/a compact of the type \d+, which is no unsigned integer/);
    expect(() => read(t, cText, compact(1))).toThrow(/no unsigned integer/);
  });

  it("reads byte sequences and arrays as bytes (copies), other sequences, arrays and tuples as arrays", () => {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const u16 = t.primitive("u16");
    const bytes = t.sequence(u8);
    const four = t.array(4, u8);
    const words = t.sequence(u16);
    const pair = t.array(2, u16);
    const tuple = t.tuple([u8, u16]);
    const unit = t.tuple([]);
    const input = Uint8Array.from([...compact(3), 9, 8, 7]);
    const types = readRuntimeMetadata(metadataV14(t, [], u8, u8)).types;
    const value = new ValueReader(types).value(new ScaleReader(input, "bytes"), bytes) as Uint8Array;
    expect(value).toEqual(bytesOf(9, 8, 7));
    input[1] = 0;
    expect(value[0]).toBe(9);
    expect(read(t, four, [1, 2, 3, 4])).toEqual(bytesOf(1, 2, 3, 4));
    expect(read(t, words, [...compact(2), 1, 0, 2, 0])).toEqual([1, 2]);
    expect(read(t, pair, [1, 0, 2, 0])).toEqual([1, 2]);
    expect(read(t, tuple, [5, 6, 0])).toEqual([5, 6]);
    expect(read(t, unit, [])).toEqual([]);
    expect(Object.isFrozen(read(t, words, [...compact(1), 1, 0]))).toBe(true);
  });

  it("reads composites by name, a single unnamed field as its value, several unnamed as an array, none as []", () => {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const named = t.composite(["Named"], [["a", u8], ["b", u8]]);
    const newtype = t.composite(["Newtype"], [[null, u8]]);
    const pair = t.composite(["Pair"], [[null, u8], [null, u8]]);
    const empty = t.composite(["Empty"], []);
    expect(read(t, named, [1, 2])).toEqual({ a: 1, b: 2 });
    expect(Object.isFrozen(read(t, named, [1, 2]))).toBe(true);
    expect(read(t, newtype, [7])).toBe(7);
    expect(read(t, pair, [1, 2])).toEqual([1, 2]);
    expect(read(t, empty, [])).toEqual([]);
  });

  it("reads a variant as its name, or { name: fields }, by its index; refuses an index the type does not have", () => {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const option = t.variant(["Option"], [{ name: "None", index: 0 }, { name: "Some", index: 1, fields: [[null, u8]] }]);
    const sparse = t.variant(["Sparse"], [{ name: "Ten", index: 10, fields: [["x", u8], ["y", u8]] }]);
    expect(read(t, option, [0])).toBe("None");
    expect(read(t, option, [1, 9])).toEqual({ Some: 9 });
    expect(read(t, sparse, [10, 1, 2])).toEqual({ Ten: { x: 1, y: 2 } });
    expect(() => read(t, sparse, [2])).toThrow(/at byte 0: the variant index 2, which the type \d+ does not have/);
  });

  it("reads bit sequences by their store's width, and refuses a store that is no u8, u16, u32 or u64", () => {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const u32 = t.primitive("u32");
    const u128 = t.primitive("u128");
    const lsb0 = t.composite(["bitvec", "order", "Lsb0"], []);
    const bits8 = t.bits(u8, lsb0);
    const bits32 = t.bits(u32, lsb0);
    const bits128 = t.bits(u128, lsb0);
    expect(read(t, bits8, [...compact(10), 0xff, 0x03])).toEqual({ bits: 10, data: bytesOf(0xff, 0x03) });
    expect(read(t, bits32, [...compact(10), 0xff, 0x03, 0, 0])).toEqual({ bits: 10, data: bytesOf(0xff, 0x03, 0, 0) });
    expect(read(t, bits8, [...compact(0)])).toEqual({ bits: 0, data: bytesOf() });
    expect(() => read(t, bits128, [...compact(1), 1])).toThrow(/a bit sequence stored in the type \d+, which is not u8, u16, u32 or u64/);
  });

  it("refuses a type id the registry lacks, and types nested deeper than the limit", () => {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const missing = t.sequence(99);
    expect(() => read(t, missing, [...compact(1), 0])).toThrow(/the type id 99, which the type registry lacks/);
    const types = readRuntimeMetadata(metadataV14(t, [], u8, u8)).types;
    expect(() => new ValueReader(types).value(new ScaleReader(bytesOf(0), "x"), 42)).toThrow(/the type id 42/);
    // A composite of itself: every level reads nothing, so only the depth limit ends it.
    const r = new Registry();
    r.composite(["Loop"], [[null, 0]]);
    expect(() => read(r, 0, [])).toThrow(new RegExp(`types nested deeper than ${MAX_DEPTH}`));
    // Nesting at the limit is read: MAX_DEPTH − 1 nested single-field composites around a u8.
    const deep = new Registry();
    const base = deep.primitive("u8");
    let top = base;
    for (let level = 0; level < MAX_DEPTH / 2 - 1; level++) top = deep.composite([`L${level}`], [[null, top]]);
    expect(read(deep, top, [5])).toBe(5);
  });
});

describe("canonical JSON", () => {
  it("sorts keys, writes bigints as decimal strings, bytes as 0x hex, and no space", () => {
    expect(canonicalJson({ b: 1, a: [true, false], c: { z: "x\"y", y: 2n ** 64n } })).toBe(
      '{"a":[true,false],"b":1,"c":{"y":"18446744073709551616","z":"x\\"y"}}',
    );
    expect(canonicalJson(bytesOf(0, 0xab, 0x10))).toBe('"0x00ab10"');
    expect(canonicalJson([])).toBe("[]");
    expect(canonicalJson({})).toBe("{}");
    expect(canonicalJson("None")).toBe('"None"');
    expect(canonicalJson(-5)).toBe("-5");
    expect(canonicalJson(-(2n ** 127n))).toBe('"-170141183460469231731687303715884105728"');
    // Keys in UTF-16 code-unit order, as JavaScript's sort: "B" (66) before "a" (97), "a" before "ab".
    expect(canonicalJson({ ab: 1, a: 2, B: 3 })).toBe('{"B":3,"a":2,"ab":1}');
  });
});

describe("a block's chain events (CD-4)", () => {
  const metadata = (shape = V2_0): RuntimeMetadataView => readRuntimeMetadata(midnightMetadata(shape));
  const A = fill(0xaa);
  const B = fill(0xbb);
  const T1 = fill(0x01);
  const T2 = fill(0x02);
  const records = [
    ev.newSession("initialization", 7),
    ev.success(0, dispatchInfo(185_012_000n, 1_493n, 2, 0)),
    ev.txApplied(1, A),
    ev.success(1, dispatchInfo(77_708_157_001n, 0n, 0, 0)),
    ev.failed(2, moduleError(5, [3, 0, 0, 0]), dispatchInfo(1n, 2n, 1, 1)),
    ev.payout(3, 2n ** 100n, bytesOf(1, 2, 3)),
    ev.systemApplied(3, B, bytesOf(9, 9)),
    ev.remarked(3, fill(0x33), fill(0x44), [T1, T2]),
    ev.newAuthorities("finalization", [[fill(0x55), 1n], [fill(0x66), 2n]]),
  ];

  it("decodes every event in order: index, phase, extrinsic index, pallet, name, fields, topics and the record's bytes", () => {
    const value = eventsValue(records);
    const events = decodeChainEvents(metadata(), value, 9n);
    expect(events.map((e) => [e.index, e.phase, e.extrinsicIndex, e.pallet, e.palletIndex, e.name, e.eventIndex])).toEqual([
      [0, "initialization", null, "Session", 30, "NewSession", 0],
      [1, "apply-extrinsic", 0, "System", 0, "ExtrinsicSuccess", 0],
      [2, "apply-extrinsic", 1, "Midnight", 5, "TxApplied", 2],
      [3, "apply-extrinsic", 1, "System", 0, "ExtrinsicSuccess", 0],
      [4, "apply-extrinsic", 2, "System", 0, "ExtrinsicFailed", 1],
      [5, "apply-extrinsic", 3, "Midnight", 5, "PayoutMinted", 4],
      [6, "apply-extrinsic", 3, "MidnightSystem", 6, "SystemTransactionApplied", 0],
      [7, "apply-extrinsic", 3, "System", 0, "Remarked", 5],
      [8, "finalization", null, "Grandpa", 3, "NewAuthorities", 0],
    ]);
    expect(events.map((e) => canonicalJson(e.fields))).toEqual([
      '{"session_index":7}',
      '{"dispatch_info":{"class":"Mandatory","pays_fee":"Yes","weight":{"proof_size":"1493","ref_time":"185012000"}}}',
      `{"tx_hash":"${hexOf(A)}"}`,
      '{"dispatch_info":{"class":"Normal","pays_fee":"Yes","weight":{"proof_size":"0","ref_time":"77708157001"}}}',
      '{"dispatch_error":{"Module":{"error":"0x03000000","index":5}},"dispatch_info":{"class":"Operational","pays_fee":"No","weight":{"proof_size":"2","ref_time":"1"}}}',
      '{"amount":"1267650600228229401496703205376","receiver":"0x010203"}',
      `{"hash":"${hexOf(B)}","serialized_system_transaction":"0x0909"}`,
      `{"hash":"${hexOf(fill(0x44))}","sender":"${hexOf(fill(0x33))}"}`,
      `{"authority_set":[["${hexOf(fill(0x55))}","1"],["${hexOf(fill(0x66))}","2"]]}`,
    ]);
    expect(events[7]?.topics).toEqual([T1, T2]);
    expect(events.filter((e) => e.index !== 7).every((e) => e.topics.length === 0)).toBe(true);
    // Each event's bytes are its record exactly; the count and the records give the storage value back.
    expect(events.map((e) => [...e.bytes])).toEqual(records);
    expect(eventsValue(events.map((e) => [...e.bytes]))).toEqual(value);
    expect(Object.isFrozen(events)).toBe(true);
    expect(events.every((e) => Object.isFrozen(e))).toBe(true);
  });

  it("gives no events for a block without a System::Events value, and an empty list for an empty value", () => {
    expect(decodeChainEvents(metadata(), null, 0n)).toEqual([]);
    expect(decodeChainEvents(metadata(), eventsValue([]), 4n)).toEqual([]);
  });

  it("decodes an upgrade block's events with the runtime that wrote them; another runtime's metadata cannot", () => {
    // Runtime 2.0 writes CodeUpdated without fields; 2.1's has { hash } (the real change, the node's metadata files).
    const u = eventsValue([ev.success(0), ev.codeUpdated(1), ev.success(1, dispatchInfo(5n, 6n, 2, 1))]);
    const old = decodeChainEvents(metadata(V2_0), u, 3n);
    expect(old.map((e) => `${e.pallet}.${e.name} ${canonicalJson(e.fields)}`)).toEqual([
      'System.ExtrinsicSuccess {"dispatch_info":{"class":"Normal","pays_fee":"Yes","weight":{"proof_size":"0","ref_time":"0"}}}',
      "System.CodeUpdated []",
      'System.ExtrinsicSuccess {"dispatch_info":{"class":"Mandatory","pays_fee":"No","weight":{"proof_size":"6","ref_time":"5"}}}',
    ]);
    expect(() => decodeChainEvents(metadata(V2_1), u, 3n)).toThrow(/cannot read the events of block 3 as SCALE/);
    // And the other way: F's events, written by 2.1, read with 2.0's metadata, stop where 2.0 sees no fields.
    const f = eventsValue([ev.codeUpdated(1, fill(0x77))]);
    expect(decodeChainEvents(metadata(V2_1), f, 4n).map((e) => canonicalJson(e.fields))).toEqual([`{"hash":"${hexOf(fill(0x77))}"}`]);
    expect(() => decodeChainEvents(metadata(V2_0), f, 4n)).toThrow(/bytes are left after the value|cannot read/);
  });

  it("refuses bytes that end early or go on, a pallet, event or phase index the metadata lacks", () => {
    const view = metadata();
    const one = eventsValue([ev.success(0)]);
    expect(() => decodeChainEvents(view, one.slice(0, -1), 5n)).toThrow(/cannot read the events of block 5 as SCALE/);
    expect(() => decodeChainEvents(view, Uint8Array.from([...one, 0]), 5n)).toThrow(/1 bytes are left after the value/);
    expect(() => decodeChainEvents(view, Uint8Array.from([...compact(2), ...ev.success(0)]), 5n)).toThrow(/cannot read the events/);
    expect(() => decodeChainEvents(view, eventsValue([record(0, 99, 0, [])]), 5n)).toThrow(
      /event 0 is of the pallet index 99, which the metadata's RuntimeEvent does not have/,
    );
    expect(() => decodeChainEvents(view, eventsValue([record(0, 5, 3, [])]), 5n)).toThrow(/event 0 is Midnight's event index 3, which the metadata does not have/);
    expect(() => decodeChainEvents(view, Uint8Array.from([...compact(1), 3, 0, 0]), 5n)).toThrow(/event 0 has the phase index 3/);
    expect(() => decodeChainEvents(view, eventsValue([ev.success(0), record(1, 0, 9, [])]), 5n)).toThrow(/event 1 is System's event index 9/);
  });

  it("refuses metadata without the System::Events entry, or whose entry is no sequence of { phase, event, topics }", () => {
    expect(() => decodeChainEvents(metadata({ ...V2_0, noEventsEntry: true }), eventsValue([]), 6n)).toThrow(
      /block 6's events are decoded with no storage entry System::Events/,
    );
    // Hand-built registries around one System pallet, each wrong in one way.
    const build = (make: (t: Registry) => { value: number; kind?: "plain" | "map" }): RuntimeMetadataView => {
      const t = new Registry();
      const spec = make(t);
      const entry = spec.kind === "map" ? { name: "Events", kind: "map" as const, hashers: [6], key: spec.value, value: spec.value } : { name: "Events", kind: "plain" as const, value: spec.value };
      return readRuntimeMetadata(metadataV14(t, [{ name: "System", index: 0, storage: { prefix: "System", entries: [entry] } }], spec.value, spec.value));
    };
    const parts = (t: Registry) => {
      const u32 = t.primitive("u32");
      const u8 = t.primitive("u8");
      const phase = t.variant(["Phase"], [{ name: "ApplyExtrinsic", index: 0, fields: [[null, u32]] }, { name: "Finalization", index: 1 }, { name: "Initialization", index: 2 }]);
      const event = t.variant(["RuntimeEvent"], [{ name: "System", index: 0, fields: [[null, t.variant(["Event"], [{ name: "Done", index: 0 }])]] }]);
      const topics = t.sequence(t.array(32, u8));
      return { u32, u8, phase, event, topics };
    };
    const ok = build((t) => {
      const p = parts(t);
      return { value: t.sequence(t.composite(["EventRecord"], [["phase", p.phase], ["event", p.event], ["topics", p.topics]])) };
    });
    expect(decodeChainEvents(ok, eventsValue([record("finalization", 0, 0, [])]), 6n).map((e) => e.name)).toEqual(["Done"]);
    expect(() => decodeChainEvents(build((t) => ({ value: t.primitive("u32"), kind: "map" })), eventsValue([]), 6n)).toThrow(/System::Events a map/);
    expect(() => decodeChainEvents(build((t) => ({ value: t.primitive("u32") })), eventsValue([]), 6n)).toThrow(/System::Events a primitive, not a sequence/);
    const noTopics = build((t) => {
      const p = parts(t);
      return { value: t.sequence(t.composite(["EventRecord"], [["phase", p.phase], ["event", p.event], ["other", p.topics]])) };
    });
    expect(() => decodeChainEvents(noTopics, eventsValue([]), 6n)).toThrow(/an event record that is not the composite \{ phase, event, topics \}/);
    const badPhase = build((t) => {
      const p = parts(t);
      const phase = t.variant(["Phase"], [{ name: "ApplyExtrinsic", index: 0, fields: [[null, p.u8]] }, { name: "Finalization", index: 1 }, { name: "Initialization", index: 2 }]);
      return { value: t.sequence(t.composite(["EventRecord"], [["phase", phase], ["event", p.event], ["topics", p.topics]])) };
    });
    expect(() => decodeChainEvents(badPhase, eventsValue([]), 6n)).toThrow(/a phase variant ApplyExtrinsic, not ApplyExtrinsic\(u32\)/);
    const twoPhases = build((t) => {
      const p = parts(t);
      const phase = t.variant(["Phase"], [{ name: "ApplyExtrinsic", index: 0, fields: [[null, p.u32]] }, { name: "Finalization", index: 1 }]);
      return { value: t.sequence(t.composite(["EventRecord"], [["phase", phase], ["event", p.event], ["topics", p.topics]])) };
    });
    expect(() => decodeChainEvents(twoPhases, eventsValue([]), 6n)).toThrow(/a phase that is not ApplyExtrinsic\(u32\), Finalization and Initialization/);
    const flatEvent = build((t) => {
      const p = parts(t);
      const event = t.variant(["RuntimeEvent"], [{ name: "System", index: 0 }]);
      return { value: t.sequence(t.composite(["EventRecord"], [["phase", p.phase], ["event", event], ["topics", p.topics]])) };
    });
    expect(() => decodeChainEvents(flatEvent, eventsValue([]), 6n)).toThrow(/a RuntimeEvent that is not an enum of one pallet event each/);
    const textTopics = build((t) => {
      const p = parts(t);
      return { value: t.sequence(t.composite(["EventRecord"], [["phase", p.phase], ["event", p.event], ["topics", t.primitive("str")]])) };
    });
    expect(() => decodeChainEvents(textTopics, eventsValue([]), 6n)).toThrow(/topics that are not a sequence/);
    const wordTopics = build((t) => {
      const p = parts(t);
      return { value: t.sequence(t.composite(["EventRecord"], [["phase", p.phase], ["event", p.event], ["topics", t.sequence(p.u32)]])) };
    });
    expect(() => decodeChainEvents(wordTopics, eventsValue([[1, 0, 0, ...compact(1), 7, 0, 0, 0]]), 6n)).toThrow(/event 0's topics are not hashes/);
  });
});

describe("core-chain-events' module functions", () => {
  const block = (items: Record<string, unknown>, height = 7n) =>
    ({ height, hash: fill(0x11), parentHash: fill(0x22), items: new Map(Object.entries(items)) }) as unknown as BlockContext;
  const source = (bytes: Uint8Array | null): BlockEventSource => ({ blockEvents: async () => bytes });

  it("binds once per process context, and refuses a callback the runner did not bind", () => {
    const context = {} as ProcessContext;
    expect(() => boundEventSource(context)).toThrow(/core-chain-events ran with a process context the runner did not bind/);
    bindCoreChainEvents(context, source(null));
    expect(() => bindCoreChainEvents(context, source(null))).toThrow(/bound once per process context/);
    expect(typeof boundEventSource(context).blockEvents).toBe("function");
  });

  it("reads no metadata for a block without an Events value, and refuses one without a runtime-metadata item", async () => {
    expect(await chainEventsOf(source(null), block({}))).toEqual([]);
    await expect(chainEventsOf(source(eventsValue([])), block({}))).rejects.toThrow(
      /the block at height 7 has no runtime-metadata item core-chain-events can read/,
    );
    await expect(chainEventsOf(source(eventsValue([])), block({ "runtime-metadata": { specVersion: 1, metadata: "x" } }))).rejects.toThrow(TypeError);
    const events = await chainEventsOf(source(eventsValue([ev.success(0)])), block({ "runtime-metadata": { specVersion: 1, metadata: midnightMetadata(V2_0) } }));
    expect(events.map((e) => e.name)).toEqual(["ExtrinsicSuccess"]);
  });

  it("names the metadata it cannot read, once per metadata array", () => {
    const broken = Uint8Array.of(1, 2, 3);
    expect(() => metadataView(broken, 9n)).toThrow(/the runtime metadata block 9's events are decoded with cannot be read: cannot read the runtime metadata/);
    const bytes = midnightMetadata(V2_0);
    expect(metadataView(bytes, 1n)).toBe(metadataView(bytes, 2n));
  });

  it("writes nothing for a block without events, and refuses one without its item or above the extrinsic column", async () => {
    const statements: unknown[][] = [];
    const w = { execute: async (sql: string, params: unknown[]) => (statements.push([sql, params]), 1) };
    await writeEventRows(w, block({ "chain-events": [] }));
    expect(statements).toEqual([]);
    await expect(writeEventRows(w, block({}))).rejects.toThrow(/the block at height 7 has no chain-events item core-chain-events can read/);
    const [event] = decodeChainEvents(readRuntimeMetadata(midnightMetadata(V2_0)), eventsValue([ev.success(0)]), 7n);
    const far = { ...(event as ChainEvent), extrinsicIndex: 2_147_483_648 };
    await expect(writeEventRows(w, block({ "chain-events": [far] }))).rejects.toThrow(
      /event 0 of block 7 is under the extrinsic index 2147483648, above the 2147483647 the column extrinsic_index holds/,
    );
    await writeEventRows(w, block({ "chain-events": [{ ...(event as ChainEvent), extrinsicIndex: 2_147_483_647 }] }));
    expect((statements[0]?.[1] as unknown[])[3]).toEqual([2_147_483_647]);
  });

  it("refuses record types it cannot read: a record that is no composite, no phase enum, a pallet event that is no enum", () => {
    const build = (make: (t: Registry) => number): RuntimeMetadataView => {
      const t = new Registry();
      const value = make(t);
      return readRuntimeMetadata(metadataV14(t, [{ name: "System", index: 0, storage: { prefix: "System", entries: [{ name: "Events", kind: "plain", value }] } }], value, value));
    };
    const u8 = (t: Registry) => t.primitive("u8");
    expect(() => decodeChainEvents(build((t) => t.sequence(t.variant(["Record"], [{ name: "A", index: 0 }]))), eventsValue([]), 1n)).toThrow(
      /an event record that is not the composite/,
    );
    expect(() => decodeChainEvents(build((t) => t.sequence(42)), eventsValue([]), 1n)).toThrow(/an event record that is not the composite/);
    expect(() =>
      decodeChainEvents(
        build((t) => {
          const topics = t.sequence(t.array(32, u8(t)));
          const event = t.variant(["RuntimeEvent"], [{ name: "System", index: 0, fields: [[null, t.variant(["E"], [{ name: "Done", index: 0 }])]] }]);
          return t.sequence(t.composite(["EventRecord"], [["phase", t.primitive("u32")], ["event", event], ["topics", topics]]));
        }),
        eventsValue([]),
        1n,
      ),
    ).toThrow(/a phase that is not ApplyExtrinsic\(u32\), Finalization and Initialization/);
    const flat = build((t) => {
      const u32 = t.primitive("u32");
      const phase = t.variant(["Phase"], [{ name: "ApplyExtrinsic", index: 0, fields: [[null, u32]] }, { name: "Finalization", index: 1 }, { name: "Initialization", index: 2 }]);
      const event = t.variant(["RuntimeEvent"], [{ name: "System", index: 0, fields: [[null, u32]] }]);
      return t.sequence(t.composite(["EventRecord"], [["phase", phase], ["event", event], ["topics", t.sequence(t.array(32, u8(t)))]]));
    });
    expect(() => decodeChainEvents(flat, eventsValue([record(0, 0, 0, [])]), 1n)).toThrow(/at byte 6: the pallet System's event type is no enum/);
  });
});

describe("the value reader's remaining refusals", () => {
  it("refuses a compact of a recursive or non-integer composite, and a bit sequence stored in a composite", () => {
    const t = new Registry();
    const loop = t.composite(["Loop"], [[null, 0]]);
    const compactLoop = t.compactOf(loop);
    const u8 = t.primitive("u8");
    const variant = t.variant(["V"], [{ name: "A", index: 0 }]);
    const compactVariant = t.compactOf(variant);
    const wrapped = t.composite(["W"], [[null, u8]]);
    const bits = t.bits(wrapped, u8);
    expect(() => read(t, compactLoop, compact(1))).toThrow(/types nested deeper than/);
    expect(() => read(t, compactVariant, compact(1))).toThrow(/which is no unsigned integer/);
    expect(() => read(t, bits, [...compact(1), 1])).toThrow(/a bit sequence stored in the type \d+, which is not u8/);
  });
});

describe("the System::Events types found by name, never by position", () => {
  /** A registry with the record types, the phase variants at `phaseIndices` (ApplyExtrinsic, Finalization, Initialization). */
  function metadataWith(options: { readonly phaseIndices?: readonly [number, number, number]; readonly before?: boolean }): RuntimeMetadataView {
    const t = new Registry();
    const u8 = t.primitive("u8");
    const u32 = t.primitive("u32");
    const [apply, final, init] = options.phaseIndices ?? [0, 1, 2];
    const phase = t.variant(["Phase"], [
      { name: "Finalization", index: final },
      { name: "Initialization", index: init },
      { name: "ApplyExtrinsic", index: apply, fields: [[null, u32]] },
    ]);
    const event = t.variant(["RuntimeEvent"], [{ name: "System", index: 0, fields: [[null, t.variant(["E"], [{ name: "Done", index: 0 }])]] }]);
    const records = t.sequence(t.composite(["EventRecord"], [["phase", phase], ["event", event], ["topics", t.sequence(t.array(32, u8))]]));
    // Another pallet with storage — an entry named Events too — listed before System.
    const other = { name: "Aura", index: 2, storage: { prefix: "Aura", entries: [{ name: "Events", kind: "plain" as const, value: u32 }] } };
    const system = { name: "System", index: 0, storage: { prefix: "System", entries: [{ name: "Events", kind: "plain" as const, value: records }] } };
    return readRuntimeMetadata(metadataV14(t, options.before === true ? [other, system] : [system], u8, u8));
  }

  it("reads each phase by its variant's name and index, wherever the metadata puts them", () => {
    const view = metadataWith({ phaseIndices: [2, 0, 1] });
    // ApplyExtrinsic(9) is variant 2, Finalization 0, Initialization 1; each record then pallet 0, event 0, no topics.
    const value = Uint8Array.from([...compact(3), 2, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
    expect(decodeChainEvents(view, value, 1n).map((e) => [e.phase, e.extrinsicIndex])).toEqual([
      ["apply-extrinsic", 9],
      ["finalization", null],
      ["initialization", null],
    ]);
  });

  it("finds the entry of the pallet whose storage prefix is System, not the first pallet with storage", () => {
    const view = metadataWith({ before: true });
    expect(decodeChainEvents(view, eventsValue([record(0, 0, 0, [])]), 1n).map((e) => `${e.phase} ${e.pallet}.${e.name}`)).toEqual([
      "apply-extrinsic System.Done",
    ]);
  });

  it("gives no events for no value without reading the metadata's types, which may lack the entry", () => {
    expect(decodeChainEvents(readRuntimeMetadata(midnightMetadata({ ...V2_0, noEventsEntry: true })), null, 0n)).toEqual([]);
  });
});
