import { describe, expect, it } from "vitest";
import {
  bytesOfKey,
  hexOfKey,
  KeyMap,
  KeySet,
  nodeKeyOf,
} from "../../src/backbone/core-ledger-state/key-collections.js";

/**
 * The node-key collections of `src/backbone/core-ledger-state/key-collections.ts`, which hold a whole chain's ledger
 * node keys for the contents hash: more than the 2^24 entries one JavaScript `Set` or `Map` holds (Preprod at height
 * 3.5 million gives more), each key once, and every key in byte order.
 */

const keyOf = (hex: string) => nodeKeyOf(Uint8Array.from(Buffer.from(hex, "hex")));

/** A 32-byte key whose bytes are `i` big-endian in the last four and `first` in the first. */
function numbered(i: number, first = (i * 2_654_435_761) >>> 24): string {
  const bytes = Buffer.alloc(32);
  bytes[0] = first;
  bytes.writeUInt32BE(i >>> 0, 28);
  return bytes.toString("latin1");
}

describe("node keys as latin1 strings", () => {
  it("round-trip through bytes and hex, and compare in byte order", () => {
    const hex = "00ff7f8001";
    const key = keyOf(hex);
    expect(key.length).toBe(5);
    expect(hexOfKey(key)).toBe(hex);
    expect(Buffer.from(bytesOfKey(key)).toString("hex")).toBe(hex);
    // A key read from a slice of a larger buffer is the slice's bytes alone.
    const big = Buffer.from("aabbccdd", "hex");
    expect(hexOfKey(nodeKeyOf(big.subarray(1, 3)))).toBe("bbcc");
    // Bytes above 0x7f compare above those below, as in byte order (not as signed or UTF-8 would).
    expect(keyOf("80") > keyOf("7f")).toBe(true);
    expect(keyOf("ff00") > keyOf("80ff")).toBe(true);
  });
});

describe("KeySet", () => {
  it("holds each key once, and gives them in byte order across its shards", () => {
    const hexes = ["ff01", "0001", "8000", "00", "7fff", "8000", "ff", "0001", "ff0100"];
    const set = new KeySet();
    for (const hex of hexes) set.add(keyOf(hex));
    const unique = [...new Set(hexes)];
    expect(set.size).toBe(unique.length);
    expect([...set.sorted()].map(hexOfKey)).toEqual(unique.sort());
    expect([...set.keys()].map(hexOfKey).sort()).toEqual(unique.sort());
    expect(set.has(keyOf("8000"))).toBe(true);
    expect(set.has(keyOf("8001"))).toBe(false);
  });

  it("holds the empty key in the first shard, before every other key", () => {
    const set = new KeySet();
    for (const hex of ["01", "", "00", ""]) set.add(keyOf(hex));
    expect(set.size).toBe(3);
    expect(set.has(keyOf(""))).toBe(true);
    expect([...set.sorted()].map(hexOfKey)).toEqual(["", "00", "01"]);
    const map = new KeyMap<number>();
    map.set(keyOf(""), 7);
    expect(map.get(keyOf(""))).toBe(7);
    expect(map.has(keyOf("00"))).toBe(false);
  });

  it("holds more keys than one Set can (2^24), which a Set refuses", () => {
    const limit = 2 ** 24;
    // Not vacuous: one Set refuses the key after the limit.
    const one = new Set<number>();
    expect(() => {
      for (let i = 0; i <= limit; i++) one.add(i);
    }).toThrow(RangeError);
    one.clear();

    const set = new KeySet();
    for (let i = 0; i <= limit; i++) set.add(numbered(i));
    set.add(numbered(0));
    expect(set.size).toBe(limit + 1);
    expect(set.has(numbered(limit))).toBe(true);
    let previous: string | undefined;
    let count = 0;
    for (const key of set.sorted()) {
      if (previous !== undefined) expect(key > previous).toBe(true);
      previous = key;
      count++;
    }
    expect(count).toBe(limit + 1);
  }, 300_000);
});

describe("KeyMap", () => {
  it("maps each key to its value across its shards", () => {
    const map = new KeyMap<number>();
    map.set(keyOf("00aa"), 1);
    map.set(keyOf("ffaa"), 2);
    map.set(keyOf("00aa"), 3);
    expect(map.get(keyOf("00aa"))).toBe(3);
    expect(map.get(keyOf("ffaa"))).toBe(2);
    expect(map.get(keyOf("80"))).toBeUndefined();
    expect(map.has(keyOf("ffaa"))).toBe(true);
    expect([...map.keys()].map(hexOfKey).sort()).toEqual(["00aa", "ffaa"]);
  });
});
