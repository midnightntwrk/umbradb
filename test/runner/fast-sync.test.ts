import { describe, expect, it } from "vitest";
import { chunkEnd, FAST_SYNC_DEFAULT, FAST_SYNC_MAX_BLOCKS, type FastSync } from "../../src/runner/fast-sync.js";

/**
 * Fast-sync mode's policy (`src/runner/fast-sync.ts`): where the chunk starting at a height ends, or null when that
 * height is processed alone. The end is the lowest of first + `blocks` − 1, the head − `distance`, the end of the
 * range of the resolved graph holding first, and the loop's last height; null when the mode is off (`blocks` < 2),
 * when that end is not above first, or when first is at or below `alone`.
 */

const on = (blocks: number, distance = 0): FastSync => ({ blocks, distance });
const open = { head: 10_000n, rangeEnd: null, last: null, alone: null } as const;

describe("chunkEnd", () => {
  it("the defaults: off, 600 heights from the head, at most 1,000 blocks", () => {
    expect(FAST_SYNC_DEFAULT).toEqual({ blocks: 0, distance: 600 });
    expect(FAST_SYNC_MAX_BLOCKS).toBe(1_000);
    expect(chunkEnd(FAST_SYNC_DEFAULT, 1n, open)).toBeNull();
  });

  it("blocks 0 and 1 are off: no chunk anywhere", () => {
    expect(chunkEnd(on(0), 1n, open)).toBeNull();
    expect(chunkEnd(on(1), 1n, open)).toBeNull();
    expect(chunkEnd(on(1, 0), 500n, open)).toBeNull();
  });

  it("bounded by blocks: first + blocks − 1", () => {
    expect(chunkEnd(on(2), 1n, open)).toBe(2n);
    expect(chunkEnd(on(7), 10n, open)).toBe(16n);
    expect(chunkEnd(on(1_000), 1n, open)).toBe(1_000n);
  });

  it("bounded by the head less distance: only heights distance or more behind the head", () => {
    expect(chunkEnd(on(100, 600), 1n, { ...open, head: 650n })).toBe(50n);
    expect(chunkEnd(on(100, 0), 1n, { ...open, head: 40n })).toBe(40n);
    expect(chunkEnd(on(100, 5), 1n, { ...open, head: 40n })).toBe(35n);
  });

  it("bounded by the end of the range holding first", () => {
    expect(chunkEnd(on(100), 1n, { ...open, rangeEnd: 9n })).toBe(9n);
    expect(chunkEnd(on(100), 1n, { ...open, rangeEnd: 200n })).toBe(100n);
  });

  it("bounded by the loop's last height", () => {
    expect(chunkEnd(on(100), 1n, { ...open, last: 12n })).toBe(12n);
  });

  it("the lowest bound wins", () => {
    expect(chunkEnd(on(50, 10), 1n, { head: 100n, rangeEnd: 70n, last: 60n, alone: null })).toBe(50n);
    expect(chunkEnd(on(50, 10), 1n, { head: 50n, rangeEnd: 70n, last: 60n, alone: null })).toBe(40n);
    expect(chunkEnd(on(50, 10), 1n, { head: 100n, rangeEnd: 30n, last: 60n, alone: null })).toBe(30n);
    expect(chunkEnd(on(50, 10), 1n, { head: 100n, rangeEnd: 70n, last: 20n, alone: null })).toBe(20n);
  });

  it("an end not above first: null, first is processed alone", () => {
    expect(chunkEnd(on(100, 600), 1n, { ...open, head: 601n })).toBeNull();
    expect(chunkEnd(on(100, 600), 50n, { ...open, head: 600n })).toBeNull();
    expect(chunkEnd(on(100), 9n, { ...open, rangeEnd: 9n })).toBeNull();
    expect(chunkEnd(on(100), 12n, { ...open, last: 12n })).toBeNull();
    expect(chunkEnd(on(100, 600), 1n, { ...open, head: 602n })).toBe(2n);
  });

  it("alone: no chunk starts at or below it", () => {
    expect(chunkEnd(on(10), 5n, { ...open, alone: 7n })).toBeNull();
    expect(chunkEnd(on(10), 7n, { ...open, alone: 7n })).toBeNull();
    expect(chunkEnd(on(10), 8n, { ...open, alone: 7n })).toBe(17n);
  });
});
