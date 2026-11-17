/** The Dust file's chunks (spec 00062 FR-001 to FR-006): round trips, the cases the format stores specially, and bad bytes. */

import { describe, expect, it } from "vitest";
import {
  decodeDustChunk,
  dustChunkLayout,
  dustChunkOf,
  dustChunkRanges,
  dustEntryAt,
  DUST_CHUNK_ENTRIES,
  DUST_MAX_FEE,
  dustPrefix,
  dustPrefixOfField,
  type DustEntry,
  encodeDustChunk,
  findDustPrefix,
} from "../shared/index.ts";

const prefix = (n: number): Uint8Array => Uint8Array.of(n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff);

/** `count` entries with rising positions, times that mostly rise, and three fees that repeat among unique ones. */
function entries(count: number, seed = 1): DustEntry[] {
  let state = seed >>> 0;
  const next = (): number => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0);
  const common = [641_409_709_129_482n, 320_704_854_564_741n, 1n];
  const out: DustEntry[] = [];
  let time = 1_794_000_000;
  let position = 100;
  for (let i = 0; i < count; i++) {
    time += (next() % 40) - 6;
    position += 1 + (next() % 8 === 0 ? next() % 500 : 0);
    const fee = next() % 4 === 0 ? BigInt(next()) * 1_000_003n + BigInt(i) : common[next() % 3]!;
    out.push({ prefix: prefix(next()), time, fee, position });
  }
  return out;
}

const same = (a: DustEntry, b: DustEntry): void => {
  expect([...a.prefix]).toEqual([...b.prefix]);
  expect(a.time).toBe(b.time);
  expect(a.fee).toBe(b.fee);
  expect(a.position).toBe(b.position);
};

describe("a Dust chunk", () => {
  it("decodes to the entries it was built from", () => {
    const all = entries(1000);
    const bytes = encodeDustChunk(dustChunkOf(4096, 3_400_000, all));
    const chunk = decodeDustChunk(bytes);
    expect(chunk.first).toBe(4096);
    expect(chunk.firstHeight).toBe(3_400_000);
    expect(chunk.count).toBe(1000);
    expect(chunk.prefixBytes).toBe(4);
    all.forEach((e, i) => same(dustEntryAt(chunk, i), e));
  });

  it("keeps a time earlier than the previous entry's, a position jump and the largest fee", () => {
    const all: DustEntry[] = [
      { prefix: prefix(1), time: 1000, fee: 5n, position: 7 },
      { prefix: prefix(2), time: 400, fee: DUST_MAX_FEE, position: 8 },
      { prefix: prefix(3), time: 12_000, fee: 0n, position: 1_000_000 },
    ];
    const chunk = decodeDustChunk(encodeDustChunk(dustChunkOf(0, 0, all)));
    all.forEach((e, i) => same(dustEntryAt(chunk, i), e));
  });

  it("stores a fee that repeats once in the list and by its place after that", () => {
    const fee = 641_409_709_129_482n;
    const all = Array.from({ length: 200 }, (_, i): DustEntry => ({ prefix: prefix(i), time: 1000 + i, fee, position: i }));
    const layout = dustChunkLayout(encodeDustChunk(dustChunkOf(0, 0, all)));
    expect(layout.feeListValues).toBe(1);
    expect(layout.feesByIndex).toBe(200);
    // One byte per entry for the fee, the time and the position, plus each field's length.
    expect(layout.fees).toBe(200 + 2);
    expect(layout.times).toBe(200 + 2);
    expect(layout.positions).toBe(200 + 2);
    expect(layout.prefixes).toBe(800);
    expect(layout.total).toBe(layout.header + layout.prefixes + layout.feeList + layout.times + layout.fees + layout.positions);
  });

  it("stores a fee that occurs once in full", () => {
    const all = Array.from({ length: 50 }, (_, i): DustEntry => ({ prefix: prefix(i), time: 1000, fee: 300_000_000_000_000n + BigInt(i), position: i }));
    const layout = dustChunkLayout(encodeDustChunk(dustChunkOf(0, 0, all)));
    expect(layout.feeListValues).toBe(0);
    expect(layout.feesByIndex).toBe(0);
    // A marker byte and seven bytes of value each.
    expect(layout.fees).toBe(50 * 8 + 2);
  });

  it("is the same bytes whatever follows it in the file", () => {
    const all = entries(3 * DUST_CHUNK_ENTRIES + 500, 7);
    const build = (upTo: number): Uint8Array[] =>
      dustChunkRanges(upTo).map(({ first, count }) => encodeDustChunk(dustChunkOf(first, 3_400_000 + first, all.slice(first, first + count))));
    const shorter = build(2 * DUST_CHUNK_ENTRIES + 10);
    const longer = build(all.length);
    expect(shorter).toHaveLength(3);
    expect(longer).toHaveLength(4);
    expect(shorter[0]).toEqual(longer[0]);
    expect(shorter[1]).toEqual(longer[1]);
    expect(shorter[2]).not.toEqual(longer[2]);
  });

  it("finds a prefix from a given entry on", () => {
    const all = entries(300, 3);
    const wanted = prefix(0xdeadbeef);
    all[40] = { ...all[40]!, prefix: wanted };
    all[250] = { ...all[250]!, prefix: wanted };
    const chunk = decodeDustChunk(encodeDustChunk(dustChunkOf(0, 0, all)));
    expect(findDustPrefix(chunk, wanted)).toBe(40);
    expect(findDustPrefix(chunk, wanted, 41)).toBe(250);
    expect(findDustPrefix(chunk, wanted, 251)).toBe(-1);
  });

  it("refuses entries it cannot hold", () => {
    const one: DustEntry = { prefix: prefix(1), time: 10, fee: 1n, position: 5 };
    expect(() => encodeDustChunk(dustChunkOf(0, 0, []))).toThrow(/at least one entry/);
    expect(() => encodeDustChunk(dustChunkOf(0, 0, [one, { ...one, position: 5 }]))).toThrow(/does not follow/);
    expect(() => encodeDustChunk(dustChunkOf(0, 0, [{ ...one, fee: DUST_MAX_FEE + 1n }]))).toThrow(/128 bits/);
    expect(() => dustChunkOf(0, 0, [{ ...one, prefix: Uint8Array.of(1, 2) }])).toThrow(/prefix/);
  });

  it("refuses bytes that are not exactly one chunk", () => {
    const bytes = encodeDustChunk(dustChunkOf(0, 0, entries(20)));
    expect(() => decodeDustChunk(bytes.subarray(0, bytes.length - 1))).toThrow();
    expect(() => decodeDustChunk(Uint8Array.of(...bytes, 0))).toThrow(/after its last field/);
    const wrongMagic = bytes.slice();
    wrongMagic[0] = 0x51;
    expect(() => decodeDustChunk(wrongMagic)).toThrow(/PSSDUST1/);
  });
});

describe("a nullifier's prefix", () => {
  it("is the first bytes of its little-endian encoding, from bytes or from the field element", () => {
    const field = 257155665760788300841043065854322383933872265012001313587136265781717650284n;
    const bytes = new Uint8Array(32);
    let rest = field;
    for (let i = 0; i < 32; i++) {
      bytes[i] = Number(rest & 0xffn);
      rest >>= 8n;
    }
    expect([...dustPrefix(bytes)]).toEqual([...bytes.subarray(0, 4)]);
    expect([...dustPrefixOfField(field)]).toEqual([...bytes.subarray(0, 4)]);
    expect([...dustPrefixOfField(field, 3)]).toEqual([...bytes.subarray(0, 3)]);
  });
});

describe("the file's chunk ranges", () => {
  it("cover every entry once", () => {
    expect(dustChunkRanges(0)).toEqual([]);
    expect(dustChunkRanges(4096)).toEqual([{ first: 0, count: 4096 }]);
    expect(dustChunkRanges(4097)).toEqual([{ first: 0, count: 4096 }, { first: 4096, count: 1 }]);
  });
});
