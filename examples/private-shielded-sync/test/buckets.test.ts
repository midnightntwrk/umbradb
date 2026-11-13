/** Nullifier buckets (spec FR-062–064) and FR-141's lookup check: present and absent keys agree with a direct lookup. */

import { randomBytes } from "node:crypto";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  answerQueries,
  bucketOf,
  bucketShape,
  buildNullifierTable,
  buildQueries,
  buildSetup,
  chooseBucketBits,
  columnRecords,
  decodeAnswers,
  decodeNullifierRecord,
  deriveSeed,
  encodeNullifierRecord,
  findInBucket,
  gridDigest,
  inlineMultiplier,
  maxLoad,
  MAX_BUCKET_BITS,
  MIN_BUCKET_BITS,
  noiseBoundHolds,
  type NullifierEntry,
  readRecord,
  setupBytes,
  setupMatrix,
} from "../pir/index.ts";

const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");

function entries(count: number): NullifierEntry[] {
  const seen = new Set<string>();
  const out: NullifierEntry[] = [];
  while (out.length < count) {
    const nullifier = new Uint8Array(randomBytes(32));
    if (seen.has(hex(nullifier))) continue;
    seen.add(hex(nullifier));
    out.push({ nullifier, height: out.length * 7 + 1, txIndex: out.length % 5 });
  }
  return out;
}

/** Looks nullifiers up by PIR, one call for all of them. */
async function pirLookup(list: readonly NullifierEntry[], keys: readonly Uint8Array[]) {
  const table = buildNullifierTable(list);
  const seed = deriveSeed("nullifier", gridDigest(table.grid));
  const setup = setupMatrix(setupBytes(await buildSetup(table.grid, seed, inlineMultiplier)), table.grid.rows);
  const columns = keys.map((k) => bucketOf(k, table.bucketBits));
  const batch = await buildQueries({ ...table.grid, seed }, columns);
  const answers = await answerQueries(table.grid, batch.queries, columns.length);
  const decoded = await decodeAnswers(setup, batch, answers);
  return keys.map((k, v) => findInBucket(columnRecords(table.grid, decoded[v]!), k));
}

describe("nullifier records (FR-062)", () => {
  it("are 40 bytes: nullifier, height and transaction index little-endian", () => {
    const e = { nullifier: new Uint8Array(32).fill(9), height: 0x01020304, txIndex: 0x0a0b0c0d };
    const bytes = encodeNullifierRecord(e);
    expect(bytes.length).toBe(40);
    expect([...bytes.subarray(32)]).toEqual([4, 3, 2, 1, 0x0d, 0x0c, 0x0b, 0x0a]);
    expect(decodeNullifierRecord(bytes)).toEqual(e);
  });
});

describe("buckets (FR-063)", () => {
  it("take the first bits of byte 0, most significant first", () => {
    const n = Uint8Array.of(0b1011_0011, 0b0101_0000, 0xff, ...new Uint8Array(29));
    expect(bucketOf(n, 4)).toBe(0b1011);
    expect(bucketOf(n, 8)).toBe(0b1011_0011);
    expect(bucketOf(n, 12)).toBe(0b1011_0011_0101);
    expect(bucketOf(n, 24)).toBe(0xb350ff);
  });

  it("hold their nullifiers sorted, padded with zero records, capacity = the largest load", () => {
    const list = entries(500);
    const table = buildNullifierTable(list);
    expect(table.capacity).toBe(maxLoad(list.map((e) => e.nullifier), table.bucketBits));
    expect(table.grid.cols).toBe(2 ** table.bucketBits);
    for (let column = 0; column < table.grid.cols; column++) {
      const inBucket = list.filter((e) => bucketOf(e.nullifier, table.bucketBits) === column).map((e) => hex(e.nullifier)).sort();
      const stored = Array.from({ length: table.capacity }, (_, s) => readRecord(table.grid, column, s));
      expect(stored.slice(0, inBucket.length).map((r) => hex(r.subarray(0, 32)))).toEqual(inBucket);
      for (const r of stored.slice(inBucket.length)) expect(r).toEqual(new Uint8Array(40));
    }
  });

  it("refuse duplicate nullifiers", () => {
    const [a] = entries(1);
    expect(() => buildNullifierTable([a!, { ...a!, height: 99 }])).toThrow(/duplicate/);
  });
});

describe("bucketBits (FR-064)", () => {
  it("minimises R + C over [4, 24] among sizes passing the noise check", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 3000 }), (count) => {
        const nullifiers = entries(count).map((e) => e.nullifier);
        const choice = chooseBucketBits(nullifiers);
        let best = Infinity;
        for (let bits = MIN_BUCKET_BITS; bits <= MAX_BUCKET_BITS; bits++) {
          if (!noiseBoundHolds(2 ** bits)) continue;
          const shape = bucketShape(count, bits, Math.max(1, maxLoad(nullifiers, bits)));
          best = Math.min(best, shape.rows + shape.cols);
        }
        const chosen = bucketShape(count, choice.bucketBits, choice.capacity);
        expect(chosen.rows + chosen.cols).toBe(best);
        expect(choice.bucketBits).toBeGreaterThanOrEqual(MIN_BUCKET_BITS);
        expect(noiseBoundHolds(chosen.cols)).toBe(true);
      }),
      { numRuns: 20 },
    );
  });
});

describe("PIR lookups agree with direct lookups (FR-141)", () => {
  it("for random nullifier sets, present and absent keys", async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 0, max: 400 }), fc.integer({ min: 1, max: 6 }), async (count, absent) => {
        const list = entries(count);
        const direct = new Map(list.map((e) => [hex(e.nullifier), e]));
        const keys = [
          ...list.slice(0, 6).map((e) => e.nullifier),
          ...entries(absent).map((e) => e.nullifier).filter((n) => !direct.has(hex(n))),
        ];
        const got = await pirLookup(list, keys);
        keys.forEach((k, v) => expect(got[v]).toEqual(direct.get(hex(k)) ?? null));
      }),
      { numRuns: 15 },
    );
  });

  it("for an empty table (one row, every lookup absent)", async () => {
    const table = buildNullifierTable([]);
    expect(table.capacity).toBe(1);
    const [got] = await pirLookup([], [new Uint8Array(randomBytes(32))]);
    expect(got).toBeNull();
  });

  it("for a key sharing its bucket with present ones", async () => {
    const list = entries(200);
    const table = buildNullifierTable(list);
    const near = list[0]!.nullifier.slice();
    near[31]! ^= 1;
    expect(bucketOf(near, table.bucketBits)).toBe(bucketOf(list[0]!.nullifier, table.bucketBits));
    const [hit, miss] = await pirLookup(list, [list[0]!.nullifier, near]);
    expect(hit).toEqual(list[0]);
    expect(miss).toBeNull();
  });
});
