/**
 * IPIR+SP's table shapes and cell encoding (spec 00058 FR-011), without the add-on: pure functions.
 *
 * - The shape rule gives, for the sizes of the plan's design section, the shapes written here; each is also the
 *   cheapest of every allowed shape found by brute force, and the cap on rows never binds.
 * - Nullifier buckets: 2^bits rows with bits ≥ 11, a row holding the fullest bucket, from real `nullifierSource`s.
 * - A record is ⌈B / 2⌉ little-endian 16-bit cells in its row, the table column-major; reading back gives it again.
 */

import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { IPIR_MAX_CELLS, IPIR_RING, ipirMasksBytes, ipirRequestBytes, ipirResponseBytes } from "../ipir/sizes.ts";
import { nullifierSource } from "../pir/buckets.ts";
import { ipirRowRecords, putIpirRecord, readIpirRecord } from "../pir/ipir/encode.ts";
import {
  bucketIpirShape,
  estimatedBucketIpirShape,
  IPIR_MAX_BUCKET_BITS,
  IPIR_MAX_REQUEST_BYTES,
  IPIR_MAX_ROWS,
  IPIR_MIN_BUCKET_BITS,
  ipirCallBytes,
  ipirCellsPerRecord,
  type IpirShape,
  positionalIpirShape,
} from "../pir/ipir/shape.ts";
import { MAX_COLUMNS } from "../pir/params.ts";
import { TableTooLarge } from "../pir/scheme.ts";

/** Every allowed shape, cheapest by the rule (call bytes, then cells, then rows); `maxRows` lifts the row cap. */
function bruteForce(records: number, recordBytes: number, maxRows = IPIR_MAX_ROWS): IpirShape | null {
  const e = Math.ceil(recordBytes / 2);
  let best: (IpirShape & { cost: number }) | null = null;
  for (let rows = IPIR_RING; rows <= maxRows && rows * IPIR_RING <= IPIR_MAX_CELLS; rows += IPIR_RING) {
    for (let cols = IPIR_RING; rows * cols <= IPIR_MAX_CELLS; cols += IPIR_RING) {
      const perGroup = Math.floor(cols / e);
      if (perGroup < 1 || rows * perGroup < records) continue;
      const cost = ipirRequestBytes(rows) + ipirResponseBytes(cols);
      const better = best === null || cost < best.cost || (cost === best.cost && rows * cols < best.rows * best.cols);
      if (better) best = { rows, cols, cellsPerRecord: e, perGroup, cost };
      break; // more columns at this row count only cost more
    }
  }
  if (best === null) return null;
  const { cost: _cost, ...shape } = best;
  return shape;
}

/** Sizes of one shape as the design section lists them. */
const sizes = (s: IpirShape) => ({ request: ipirRequestBytes(s.rows), response: ipirResponseBytes(s.cols), masks: ipirMasksBytes(s.cols) });

/** `count` distinct pseudo-random 32-byte nullifiers as the builder's columns. */
function nullifiers(count: number, label: string) {
  const values = new Uint8Array(count * 32);
  for (let i = 0; i < count; i++) values.set(createHash("sha256").update(`${label}/${i}`).digest(), 32 * i);
  return nullifierSource({ count, values, heights: new Uint32Array(count), txs: new Uint32Array(count) });
}

describe("the shape rule for positional tables (FR-011)", () => {
  it("gives the shapes of the design section, each the cheapest allowed shape", () => {
    const cases: [number, number, IpirShape, { request: number; response: number; masks: number }][] = [
      // Preprod's read table: 69,310 records of 98 bytes (49 cells), 41 to a row.
      [69_310, 98, { rows: 2048, cols: 2048, cellsPerRecord: 49, perGroup: 41 }, { request: 40_228, response: 5_700, masks: 14_884 }],
      [1_000_000, 98, { rows: 4096, cols: 12_288, cellsPerRecord: 49, perGroup: 250 }, { request: 52_772, response: 33_860, masks: 89_124 }],
      // The path table at k = 16: 512-byte records (256 cells).
      [1_000_000, 512, { rows: 10_240, cols: 26_624, cellsPerRecord: 256, perGroup: 104 }, { request: 90_404, response: 73_284, masks: 193_060 }],
      [69_310, 512, { rows: 2048, cols: 10_240, cellsPerRecord: 256, perGroup: 40 }, { request: 40_228, response: 28_228, masks: 74_276 }],
      [100_000, 98, { rows: 2048, cols: 4096, cellsPerRecord: 49, perGroup: 83 }, { request: 40_228, response: 11_332, masks: 29_732 }],
      [2_000_000, 98, { rows: 6144, cols: 16_384, cellsPerRecord: 49, perGroup: 334 }, { request: 65_316, response: 45_124, masks: 118_820 }],
      // The test chain's path table at k = 2 (64 bytes) and an empty table: the smallest shape.
      [300, 64, { rows: 2048, cols: 2048, cellsPerRecord: 32, perGroup: 64 }, { request: 40_228, response: 5_700, masks: 14_884 }],
      [0, 98, { rows: 2048, cols: 2048, cellsPerRecord: 49, perGroup: 41 }, { request: 40_228, response: 5_700, masks: 14_884 }],
    ];
    for (const [records, recordBytes, shape, bytes] of cases) {
      const got = positionalIpirShape(records, recordBytes);
      expect(got, `${records} × ${recordBytes}`).toEqual(shape);
      expect(sizes(got), `${records} × ${recordBytes}`).toEqual(bytes);
      expect(bruteForce(records, recordBytes), `${records} × ${recordBytes}`).toEqual(shape);
      expect(got.rows * got.perGroup).toBeGreaterThanOrEqual(records);
    }
  });

  it("agrees with brute force across sizes, and the cap of 32,768 rows does not bind them", () => {
    for (const recordBytes of [1, 40, 64, 98, 255, 512, 1024]) {
      for (const records of [1, 2048, 83_969, 300_000, 3_000_000, 9_000_000]) {
        const capped = bruteForce(records, recordBytes);
        if (capped === null) {
          expect(() => positionalIpirShape(records, recordBytes)).toThrow(TableTooLarge);
          continue;
        }
        expect(positionalIpirShape(records, recordBytes), `${records} × ${recordBytes}`).toEqual(capped);
        // Without the cap the rule picks the same shape.
        expect(bruteForce(records, recordBytes, 2 ** 30 / IPIR_RING), `${records} × ${recordBytes} uncapped`).toEqual(capped);
      }
    }
  });

  it("caps rows at 32,768 (review F4): the longest request is 228,388 bytes; a table that needs more rows grows in columns", () => {
    expect(IPIR_MAX_ROWS).toBe(32_768);
    expect(IPIR_MAX_REQUEST_BYTES).toBe(36 + 27_648 + (49 * 32_768) / 8);
    expect(IPIR_MAX_REQUEST_BYTES).toBe(228_388);
    expect(IPIR_MAX_REQUEST_BYTES).toBeLessThan(MAX_COLUMNS * 4);
    expect(ipirCallBytes(2048, 2048)).toBe(40_228 + 5_700);
    // Even for nearly full tables the cheapest shape has at most 22,528 rows, so the cap does not change it.
    for (const recordBytes of [2, 40, 98, 512]) {
      const records = Math.floor((0.9 * 2 ** 30) / Math.ceil(recordBytes / 2));
      const capped = positionalIpirShape(records, recordBytes);
      expect(capped, `${recordBytes} bytes`).toEqual(bruteForce(records, recordBytes, 2 ** 30 / IPIR_RING));
      expect(capped.rows, `${recordBytes} bytes`).toBe(22_528);
    }
  });

  it("refuses a table no shape holds, with the estimate (edge case: over 2^30 cells)", () => {
    const largest = 21_911_552; // 2,048 rows × ⌊524,288 / 49⌋ records of 98 bytes
    expect(positionalIpirShape(largest, 98)).toEqual({ rows: 2048, cols: 524_288, cellsPerRecord: 49, perGroup: 10_699 });
    const error = (() => {
      try {
        positionalIpirShape(largest + 1, 98, "read");
        return null;
      } catch (e) {
        return e;
      }
    })();
    expect(error).toBeInstanceOf(TableTooLarge);
    expect(error).toMatchObject({ scheme: "ipir-sp", table: "read", neededCells: (largest + 1) * 49, maxCells: 2 ** 30 });
    expect((error as Error).message).toMatch(/ipir-sp: the read table of 21,911,553 records of 98 bytes needs at least 1,073,666,097 cells; a table holds at most 1,073,741,824/);
    expect(() => positionalIpirShape(-1, 98)).toThrow(/record count/);
    expect(() => ipirCellsPerRecord(0)).toThrow(/record size/);
  });
});

describe("the nullifier buckets (FR-011)", () => {
  it("2^bits rows with 11 ≤ bits ≤ 15, a row holding the fullest bucket, the bits the cheapest by the rule", () => {
    for (const [count, expected] of [
      [0, { rows: 2048, cols: 2048, bucketBits: 11 }],
      [37, { rows: 2048, cols: 2048, bucketBits: 11 }],
      // Preprod at 3,439,524: 57,812 nullifiers.
      [57_812, { rows: 2048, cols: 2048, bucketBits: 11 }],
      [1_000_000, { rows: 4096, cols: 6144, bucketBits: 12 }],
    ] as const) {
      const source = nullifiers(count, "ipir-shape");
      const shape = bucketIpirShape(source);
      expect(shape, `${count} nullifiers`).toMatchObject({ ...expected, cellsPerRecord: 20, perGroup: Math.floor(expected.cols / 20) });
      expect(shape.rows).toBe(2 ** shape.bucketBits);
      expect(shape.perGroup).toBeGreaterThanOrEqual(source.maxLoad(shape.bucketBits));
      // The cheapest over every allowed bit count, with the fewest columns that hold the fullest bucket.
      let best = Number.POSITIVE_INFINITY;
      for (let bits = IPIR_MIN_BUCKET_BITS; bits <= IPIR_MAX_BUCKET_BITS; bits++) {
        const cols = Math.max(IPIR_RING, Math.ceil((Math.max(1, source.maxLoad(bits)) * 20) / IPIR_RING) * IPIR_RING);
        best = Math.min(best, ipirCallBytes(2 ** bits, cols));
      }
      expect(ipirCallBytes(shape.rows, shape.cols)).toBe(best);
    }
  });

  it("estimates the shape of a padded build's nullifier table from half again the mean load", () => {
    expect(estimatedBucketIpirShape(1_000_000, 40)).toEqual({ rows: 4096, cols: 8192, cellsPerRecord: 20, perGroup: 409, bucketBits: 12 });
    expect(estimatedBucketIpirShape(0, 40)).toEqual({ rows: 2048, cols: 2048, cellsPerRecord: 20, perGroup: 102, bucketBits: 11 });
    // A load no shape holds is refused.
    expect(() => bucketIpirShape({ records: 1, recordBytes: 40, maxLoad: () => 2 ** 26 })).toThrow(TableTooLarge);
  });
});

describe("the cell encoding (FR-011)", () => {
  it("a record of B bytes is ⌈B / 2⌉ little-endian cells in its row's columns, column-major; reading it back gives it", () => {
    const rows = 4;
    for (const recordBytes of [1, 2, 3, 40, 97, 98]) {
      const e = ipirCellsPerRecord(recordBytes);
      expect(e).toBe(Math.ceil(recordBytes / 2));
      const perGroup = 3;
      const cols = perGroup * e + 1;
      const cells = new Uint16Array(rows * cols).fill(0xbeef);
      const record = Uint8Array.from({ length: recordBytes }, (_, i) => (i * 37 + recordBytes) & 0xff);
      putIpirRecord(cells, rows, 2, 1, e, record);
      // Cell j of slot 1 in row 2 is column e + j: index (e + j) × rows + 2, bytes 2j (low) and 2j + 1 (high).
      for (let j = 0; j < e; j++) {
        const hi = 2 * j + 1 < recordBytes ? record[2 * j + 1]! : 0;
        expect(cells[(e + j) * rows + 2], `${recordBytes} bytes, cell ${j}`).toBe(record[2 * j]! | (hi << 8));
      }
      // Nothing else changed.
      const touched = new Set(Array.from({ length: e }, (_, j) => (e + j) * rows + 2));
      expect(cells.every((v, i) => touched.has(i) || v === 0xbeef)).toBe(true);
      expect(readIpirRecord(cells, rows, 2, 1, e, recordBytes)).toEqual(record);
      // The decoded row (its cells in column order) gives the record in its slot.
      const row = Uint16Array.from({ length: cols }, (_, col) => cells[col * rows + 2]!);
      const records = ipirRowRecords(row, perGroup, e, recordBytes);
      expect(records).toHaveLength(perGroup);
      expect(records[1]).toEqual(record);
    }
  });

  it("refuses a record that does not fit and a slot outside the table", () => {
    const cells = new Uint16Array(4 * 10);
    expect(() => putIpirRecord(cells, 4, 0, 0, 2, new Uint8Array(5))).toThrow(/does not fit/);
    expect(() => putIpirRecord(cells, 4, 4, 0, 2, new Uint8Array(4))).toThrow(/outside/);
    expect(() => putIpirRecord(cells, 4, 0, 5, 2, new Uint8Array(4))).toThrow(/outside/);
    expect(() => ipirRowRecords(new Uint16Array(5), 3, 2, 4)).toThrow(/holds no/);
  });
});
