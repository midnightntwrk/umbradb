import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { blake2b256 } from "../../src/backbone/core-block-fetch/blake2b.js";
import { blockTimeOf, decodeExtrinsics } from "../../src/backbone/core-block-fetch/extrinsics.js";
import { encodeHeader, headerHash } from "../../src/backbone/core-block-fetch/header.js";
import { readRuntimeMetadata, readTypeRegistry } from "../../src/backbone/core-block-fetch/metadata.js";
import { concatBytes, encodeCompact, ScaleError, ScaleReader } from "../../src/backbone/core-block-fetch/scale.js";
import { headerAnswer } from "../../src/node/decode.js";
import {
  bareExtrinsic,
  compact,
  hex,
  ledgerTransaction,
  MAINNET_PALLETS,
  metadataOf,
  type PalletSpec,
  timestampSet,
  unhex,
} from "./fetch-fixtures.js";

/**
 * What `core-block-fetch` decodes a block with: BLAKE2b-256 and a header's hash, SCALE, the runtime metadata V14, the
 * extrinsics and the block's time. [CD-2, LG-4, IN-6]
 *
 * The oracles are independent of the code:
 * - RFC 7693's and Python's `hashlib` vectors for BLAKE2b;
 * - the real mainnet block 3,174,332 the node gave on 2026-10-25 (`test/node/fixtures/mainnet-answers.json`). Its
 *   header hashes to the hash `chain_getBlockHash` answered for it. Its seven extrinsics decode, with the indices of
 *   the runtime that built it, to the calls the Midnight node's own metadata names there and to the time of the
 *   recording day.
 */

const MAINNET = JSON.parse(
  readFileSync(new URL("../node/fixtures/mainnet-answers.json", import.meta.url), "utf8"),
) as { calls: { method: string; params: unknown[]; result: unknown }[] };
const answer = (method: string, index = 0) => (MAINNET.calls.filter((call) => call.method === method)[index] as { result: unknown; params: unknown[] });
const MAINNET_HEADER = answer("chain_getHeader");
const MAINNET_BLOCK = answer("chain_getBlock").result as { block: { extrinsics: string[] } };

describe("BLAKE2b-256 (RFC 7693)", () => {
  // Python 3's hashlib.blake2b(data, digest_size=32), and RFC 7693's "abc" (Appendix A gives BLAKE2b-512's; the
  // 256-bit digest of "abc" is the widely published bddd813c…).
  const vectors: [string, Uint8Array, string][] = [
    ["the empty input", new Uint8Array(0), "0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8"],
    ["abc", Uint8Array.from(Buffer.from("abc")), "bddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319"],
    ["one full block (0..127)", Uint8Array.from({ length: 128 }, (_, i) => i), "c3582f71ebb2be66fa5dd750f80baae97554f3b015663c8be377cfcb2488c1d1"],
    ["two full blocks (0..255)", Uint8Array.from({ length: 256 }, (_, i) => i), "39a7eb9fedc19aabc83425c6755dd90e6f9d0c804964a1f4aaeea3b9fb599835"],
  ];
  it.each(vectors)("hashes %s", (_name, data, digest) => {
    expect(Buffer.from(blake2b256(data)).toString("hex")).toBe(digest);
  });

  it("hashes inputs around a block's edge to 32 bytes each, all different", () => {
    const digests = [127, 128, 129, 255, 256, 257].map((length) => hex(blake2b256(new Uint8Array(length).fill(7))));
    expect(new Set(digests).size).toBe(6);
    for (const digest of digests) expect(digest).toHaveLength(66);
  });
});

describe("a block header's hash", () => {
  it("is the hash chain_getBlockHash gives for the real mainnet header of block 3,174,332", () => {
    const header = headerAnswer("chain_getHeader", "result", MAINNET_HEADER.result);
    expect(hex(headerHash(header))).toBe(MAINNET_HEADER.params[0]);
    expect(hex(headerHash(header))).toBe(answer("chain_getBlockHash", 1).result);
  });

  it("encodes the header as the runtime does: parent, compact number, roots, compact digest length, items", () => {
    const header = headerAnswer("chain_getHeader", "result", MAINNET_HEADER.result);
    const encoded = encodeHeader(header);
    const expected = concatBytes([
      header.parentHash,
      Uint8Array.from(compact(header.number)),
      header.stateRoot,
      header.extrinsicsRoot,
      Uint8Array.from(compact(header.digest.length)),
      ...header.digest,
    ]);
    expect(encoded).toEqual(expected);
    // Another number gives another hash: the number is in the hashed bytes.
    expect(hex(headerHash({ ...header, number: header.number + 1n }))).not.toBe(MAINNET_HEADER.params[0]);
  });
});

describe("SCALE", () => {
  it("reads and writes compact integers in each of the four modes", () => {
    for (const value of [0n, 1n, 63n, 64n, 16_383n, 16_384n, 1_073_741_823n, 1_073_741_824n, 2n ** 64n - 1n, 2n ** 100n]) {
      const bytes = encodeCompact(value);
      expect([...bytes], `${value}`).toEqual(compact(value));
      const r = new ScaleReader(bytes, "a test value");
      expect(r.compact()).toBe(value);
      r.end();
    }
    expect(() => encodeCompact(-1n)).toThrow(RangeError);
  });

  it("refuses bytes that end too soon, a count above 2^32 - 1, an option tag other than 0 or 1, a string not UTF-8", () => {
    const short = new ScaleReader(Uint8Array.of(0x01), "a short value");
    expect(() => short.compact()).toThrow(ScaleError);
    expect(() => new ScaleReader(Uint8Array.from(encodeCompact(2n ** 32n)), "a count").count()).toThrow(/above 2\^32/);
    expect(() => new ScaleReader(Uint8Array.of(2), "an option").option(() => 0)).toThrow(/option tag 2/);
    expect(() => new ScaleReader(Uint8Array.of(4, 0xff, 0xfe), "a string").string()).toThrow(/not UTF-8/);
    const left = new ScaleReader(Uint8Array.of(0, 1), "a value with a byte left");
    left.u8();
    expect(() => left.end()).toThrow(/1 bytes are left/);
    expect(new ScaleReader(Uint8Array.of(0xff, 0xff, 0xff, 0xff), "a u32").u32()).toBe(0xffff_ffff);
    expect(new ScaleError("x", 3, "why").message).toBe("cannot read x as SCALE at byte 3: why");
  });
});

describe("the runtime metadata V14 (state_getMetadata's answer)", () => {
  it("reads the pallets with their indices and call enums, and the types they name", () => {
    const view = readRuntimeMetadata(metadataOf(MAINNET_PALLETS));
    expect(view.version).toBe(14);
    expect(view.pallets.map(({ name, index }) => [name, index])).toEqual(MAINNET_PALLETS.map(({ name, index }) => [name, index]));
    const timestamp = view.pallets.find((pallet) => pallet.name === "Timestamp");
    const calls = view.types.get(timestamp?.calls as number)?.def;
    expect(calls).toMatchObject({ kind: "variant", variants: [{ name: "set", index: 0 }] });
    expect(Object.isFrozen(view)).toBe(true);
    expect(Object.isFrozen(view.pallets)).toBe(true);
  });

  it("steps over every part of a real runtime's V14: a generic type, typed fields, events, errors, constants, signed extensions", () => {
    const view = readRuntimeMetadata(metadataOf(MAINNET_PALLETS, 14, true));
    expect(view.pallets.map(({ name, index }) => [name, index])).toEqual(MAINNET_PALLETS.map(({ name, index }) => [name, index]));
    const events = view.pallets[0]?.event as number;
    expect(view.pallets.every((pallet) => pallet.event === events && pallet.error === events)).toBe(true);
    expect(view.types.get(events)?.def).toMatchObject({ kind: "variant", variants: [{ name: "Done", index: 0, fields: [] }] });
    const option = [...view.types.values()].find((type) => type.path[0] === "Option");
    expect(option?.params).toEqual([{ name: "T", type: 1 }]);
    expect(option?.def).toMatchObject({ kind: "variant", variants: [{ name: "None" }, { name: "Some", fields: [{ name: null, type: 1, typeName: "u64" }] }] });
    const record = [...view.types.values()].find((type) => type.path.at(-1) === "Record");
    expect(record?.def).toEqual({
      kind: "composite",
      fields: [
        { name: "amount", type: 2, typeName: null },
        { name: "note", type: 3, typeName: null },
      ],
    });
    // The full metadata reads to its very end, like the short one.
    expect(readRuntimeMetadata(metadataOf(MAINNET_PALLETS, 15, true)).pallets).toHaveLength(5);
  });

  it("reads V15 up to its pallets, whose documentation it steps over", () => {
    const view = readRuntimeMetadata(metadataOf(MAINNET_PALLETS, 15));
    expect(view.version).toBe(15);
    expect(view.pallets.map((pallet) => pallet.index)).toEqual([0, 1, 5, 13, 45]);
  });

  it("refuses another magic, another version, bytes left after V14, and a pallet naming a type the registry lacks", () => {
    const good = metadataOf(MAINNET_PALLETS);
    expect(() => readRuntimeMetadata(Uint8Array.from([0x6d, 0x65, 0x74, 0x62, ...good.slice(4)]))).toThrow(/no magic/);
    for (const version of [13, 16]) {
      const other = Uint8Array.from(good);
      other[4] = version;
      expect(() => readRuntimeMetadata(other)).toThrow(new RegExp(`metadata version ${version}`));
    }
    expect(() => readRuntimeMetadata(Uint8Array.from([...good, 0]))).toThrow(/1 bytes are left/);
    expect(() => readRuntimeMetadata(good.slice(0, good.length - 1))).toThrow(ScaleError);
    // Two pallets with one index.
    const twice: PalletSpec[] = [...MAINNET_PALLETS, { name: "Again", index: 5 }];
    expect(() => readRuntimeMetadata(metadataOf(twice))).toThrow(/two pallets with the index 5/);
  });

  it("refuses a registry with an unknown type definition, primitive, storage entry, hasher or modifier", () => {
    const r = (bytes: number[]) => new ScaleReader(Uint8Array.from(bytes), "a registry");
    // One type, id 0, no path, no params, then the definition.
    const one = (def: number[]) => [4, 0, 0, 0, ...def, 0];
    expect(() => readTypeRegistry(r(one([8])))).toThrow(/type definition 8/);
    expect(() => readTypeRegistry(r(one([5, 15])))).toThrow(/primitive type 15/);
    expect(readTypeRegistry(r(one([3, 2, 0, 0, 0, 0]))).get(0)?.def).toEqual({ kind: "array", length: 2, type: 0 });
    expect(readTypeRegistry(r(one([4, 4, 0]))).get(0)?.def).toEqual({ kind: "tuple", types: [0] });
    expect(readTypeRegistry(r(one([7, 0, 4]))).get(0)?.def).toEqual({ kind: "bitSequence", store: 0, order: 1 });
    expect(() => readTypeRegistry(r([8, 0, 0, 0, 5, 3, 0, 0, 0, 0, 5, 3, 0]))).toThrow(/type id 0 given twice/);
  });

  it("reads storage entries of both kinds and refuses malformed ones", () => {
    // Metadata with one pallet whose storage holds a plain and a map entry, built by hand around metadataOf's registry.
    const base = metadataOf([]);
    // The registry ends where the (empty) pallet list, one byte, starts; the tail is 4 bytes (the extrinsic type, the
    // extrinsic version, no signed extensions, the runtime type).
    const head = base.slice(0, base.length - 1 - 4);
    const tail = base.slice(base.length - 4);
    const storage = (entries: number[][]): number[] => [1, ...compact(4), ...Buffer.from("Pool"), ...compact(entries.length), ...entries.flat()];
    const entry = (modifier: number, kind: number[]): number[] => [...compact(4), ...Buffer.from("item"), modifier, ...kind, ...compact(0), 0];
    const pallet = (store: number[]) => [...compact(4), ...Buffer.from("Pool"), ...store, 0, 0, 0, 0, 7];
    const build = (store: number[]) => Uint8Array.from([...head, ...compact(1), ...pallet(store), ...tail]);
    // Plain(type 1); Map { hashers [Blake2_128 (0), Identity (6)], key 1, value 1 }.
    const plain = [0, ...compact(1)];
    const map = (hashers: number[]) => [1, ...compact(hashers.length), ...hashers, ...compact(1), ...compact(1)];
    const view = readRuntimeMetadata(build(storage([entry(0, plain), entry(1, map([0, 6]))])));
    // The entries are read (core-chain-events finds System::Events' type there); each is read whole.
    expect(view.pallets).toEqual([
      {
        name: "Pool",
        index: 7,
        calls: null,
        event: null,
        error: null,
        storage: {
          prefix: "Pool",
          entries: [
            { name: "item", modifier: "optional", kind: "plain", value: 1 },
            { name: "item", modifier: "default", kind: "map", hashers: ["Blake2_128", "Identity"], key: 1, value: 1 },
          ],
        },
      },
    ]);
    expect(() => readRuntimeMetadata(build(storage([entry(2, plain)])))).toThrow(/storage modifier 2/);
    expect(() => readRuntimeMetadata(build(storage([entry(0, [2, ...compact(1)])])))).toThrow(/storage entry type 2/);
    expect(() => readRuntimeMetadata(build(storage([entry(0, map([7]))])))).toThrow(/storage hasher 7/);
    // A pallet naming a type the registry lacks.
    const missing = Uint8Array.from([...head, ...compact(1), ...compact(4), ...Buffer.from("Pool"), 0, 1, ...compact(99), 0, 0, 0, 7, ...tail]);
    expect(() => readRuntimeMetadata(missing)).toThrow(/names the type 99/);
  });
});

describe("the extrinsics, decoded with the runtime metadata (CD-2, LG-4)", () => {
  const metadata = readRuntimeMetadata(metadataOf(MAINNET_PALLETS));
  const extrinsics = MAINNET_BLOCK.block.extrinsics.map(unhex);

  it("names every call of the real mainnet block 3,174,332 as its runtime does, and reads its time", () => {
    const body = decodeExtrinsics(metadata, extrinsics, 3_174_332n);
    expect(body.map((e) => [e.index, e.version, e.signed, `${e.call?.pallet}.${e.call?.call}`])).toEqual([
      [0, 5, false, "Timestamp.set"],
      [1, 5, false, "CNightObservation.process_tokens"],
      [2, 5, false, "FederatedAuthorityObservation.reset_members"],
      [3, 4, false, "Midnight.send_mn_transaction"],
      [4, 4, false, "Midnight.send_mn_transaction"],
      [5, 4, false, "Midnight.send_mn_transaction"],
      [6, 4, false, "Midnight.send_mn_transaction"],
    ]);
    expect(body[3]?.bytes).toBe(extrinsics[3]);
    expect(body[0]?.call?.args).toEqual(Uint8Array.of(0x0b, 0x60, 0x61, 0x26, 0x75, 0xa1, 0x01));
    // 2026-10-25T22:20:12Z: the day the node was recorded, the block then its finalized head.
    expect(blockTimeOf(metadata, body, 3_174_332n)).toBe(1_792_966_812_000n);
    expect(new Date(1_792_966_812_000).toISOString()).toBe("2026-10-25T22:20:12.000Z");
    expect(Object.isFrozen(body)).toBe(true);
  });

  it("leaves a signed or general extrinsic's call undecoded", () => {
    const signed = Uint8Array.from([...compact(3), 0x84, 1, 2]);
    const general = Uint8Array.from([...compact(2), 0x45, 0]);
    const body = decodeExtrinsics(metadata, [signed, general], 9n);
    expect(body.map((e) => [e.version, e.signed, e.call])).toEqual([
      [4, true, null],
      [5, true, null],
    ]);
  });

  it("refuses an extrinsic whose length prefix lies, whose format is unknown, or whose pallet or call the metadata lacks", () => {
    expect(() => decodeExtrinsics(metadata, [Uint8Array.from([...compact(9), 0x05, 1, 0])], 3n)).toThrow(/length prefix says 9/);
    expect(() => decodeExtrinsics(metadata, [Uint8Array.from([...compact(1), 0x06])], 3n)).toThrow(/format byte 0x06/);
    expect(() => decodeExtrinsics(metadata, [bareExtrinsic(0x05, 2, 0, [])], 3n)).toThrow(/pallet with index 2/);
    expect(() => decodeExtrinsics(metadata, [bareExtrinsic(0x05, 1, 9, [])], 3n)).toThrow(/Timestamp's call with index 9/);
    const noCalls = readRuntimeMetadata(metadataOf([{ name: "Quiet", index: 1 }]));
    expect(() => decodeExtrinsics(noCalls, [bareExtrinsic(0x05, 1, 0, [])], 3n)).toThrow(/Quiet's call with index 0/);
  });

  it("gives block 0 without Timestamp::set the time 0, and refuses any other block without exactly one", () => {
    expect(blockTimeOf(metadata, [], 0n)).toBe(0n);
    expect(blockTimeOf(metadata, decodeExtrinsics(metadata, [timestampSet(5n)], 0n), 0n)).toBe(5n);
    expect(() => blockTimeOf(metadata, [], 1n)).toThrow(/block 1 has no Timestamp::set calls/);
    const two = decodeExtrinsics(metadata, [timestampSet(5n), timestampSet(6n)], 2n);
    expect(() => blockTimeOf(metadata, two, 2n)).toThrow(/block 2 has 2 Timestamp::set calls/);
    const ledgerOnly = decodeExtrinsics(metadata, [ledgerTransaction([1, 2])], 4n);
    expect(() => blockTimeOf(metadata, ledgerOnly, 4n)).toThrow(/no Timestamp::set/);
  });

  it("reads Timestamp::set's argument as the metadata types it, and refuses another type or trailing bytes", () => {
    const plain = readRuntimeMetadata(metadataOf([{ name: "Timestamp", index: 1, calls: [{ name: "set", index: 0, args: ["u64"] }] }]));
    expect(() => blockTimeOf(plain, decodeExtrinsics(plain, [timestampSet(5n)], 3n), 3n)).toThrow(/not one Compact<u64>/);
    // A compact of another integer is not the time either: the compact's inner type is checked too.
    const narrow = readRuntimeMetadata(
      metadataOf([{ name: "Timestamp", index: 1, calls: [{ name: "set", index: 0, args: ["compact-u32"] }] }]),
    );
    expect(() => blockTimeOf(narrow, decodeExtrinsics(narrow, [timestampSet(5n)], 3n), 3n)).toThrow(/not one Compact<u64>/);
    const two = readRuntimeMetadata(
      metadataOf([{ name: "Timestamp", index: 1, calls: [{ name: "set", index: 0, args: ["compact-u64", "compact-u64"] }] }]),
    );
    expect(() => blockTimeOf(two, decodeExtrinsics(two, [timestampSet(5n)], 3n), 3n)).toThrow(/2 field\(s\)/);
    const trailing = bareExtrinsic(0x05, 1, 0, [...compact(5n), 0]);
    expect(() => blockTimeOf(metadata, decodeExtrinsics(metadata, [trailing], 3n), 3n)).toThrow(/1 bytes are left/);
    const huge = bareExtrinsic(0x05, 1, 0, compact(2n ** 64n));
    expect(() => blockTimeOf(metadata, decodeExtrinsics(metadata, [huge], 3n), 3n)).toThrow(/above 2\^64 - 1/);
    // The pallet holding the time is found by its name, wherever the runtime put it.
    const moved = readRuntimeMetadata(metadataOf([{ name: "Timestamp", index: 9, calls: [{ name: "set", index: 0, args: ["compact-u64"] }] }]));
    expect(blockTimeOf(moved, decodeExtrinsics(moved, [timestampSet(77n, 9)], 3n), 3n)).toBe(77n);
  });

  it("names a call enum that is no variant an error of the metadata", () => {
    // Timestamp's call type points at the u64 primitive (type 1): not an enum.
    const bytes = metadataOf([{ name: "Timestamp", index: 1, calls: [{ name: "set", index: 0, args: ["compact-u64"] }] }]);
    const view = readRuntimeMetadata(bytes);
    const broken = { ...view, pallets: view.pallets.map((pallet) => ({ ...pallet, calls: 1 })) };
    expect(() => decodeExtrinsics(broken, [timestampSet(5n)], 3n)).toThrow(/call type that is no enum \(primitive\)/);
  });

  it("is the decoding of an independent copy of the mainnet bytes (no shared buffer)", () => {
    const copy = MAINNET_BLOCK.block.extrinsics.map((text) => Uint8Array.from(Buffer.from(text.slice(2), "hex")));
    const digest = (list: readonly Uint8Array[]) => createHash("sha256").update(Buffer.concat(list.map((x) => Buffer.from(x)))).digest("hex");
    expect(digest(decodeExtrinsics(metadata, copy, 1n).map((e) => e.bytes))).toBe(digest(extrinsics));
  });
});
