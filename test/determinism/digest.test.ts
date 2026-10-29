import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { encodeRow } from "../../src/determinism/cbor.js";
import {
  DIGEST_BYTES,
  isCheckpointHeight,
  nextDigest,
  tableChanges,
  type TouchedRow,
  ZERO_DIGEST,
} from "../../src/determinism/digest.js";
import { concatBytes, fromHex } from "./cbor-decoder.js";

/**
 * A table's changes and its chained digest, as pure functions (`src/determinism/digest.ts`):
 * - a table's `changes at h` is the canonical CBOR array of one change per primary key the block wrote, in
 *   primary-key order: `["insert", new row]`, `["delete", old row]` or `["update", new row]`, and nothing for a key
 *   that ends as it began; [DT-4]
 * - its digest at h is `SHA-256(previous ‖ CBOR(h) ‖ changes at h)`, with 32 zero bytes before its first change;
 *   [DT-5]
 * - checkpoints fall at every height h with h mod the build's interval = 0. [DT-5]
 *
 * Every expected byte below is written by hand from RFC 8949 (a 1-element array is `0x81`, a text of 6 bytes `0x66`, the
 * integer 7 `0x07`, 24 `0x18 0x18`, 14,400 `0x19 0x38 0x40`), and every expected digest is computed here with
 * `node:crypto` from those bytes, not by the code under test.
 */

const TYPES = ["bigint", "text"] as const;
const hex = (text: string): Uint8Array => fromHex(text.replace(/\s+/g, ""));
const sha256 = (...parts: Uint8Array[]): Uint8Array => new Uint8Array(createHash("sha256").update(concatBytes(...parts)).digest());

/** `"insert"`, `"delete"`, `"update"` as CBOR text strings. */
const INSERT = hex("66 696e73657274");
const DELETE = hex("66 64656c657465");
const UPDATE = hex("66 757064617465");
/** The row `[1, "a"]` and `[1, "b"]`, `[2, "b"]` as the canonical encoder writes them under `bigint, text`. [DT-1] */
const ROW_1A = hex("82 01 6161");
const ROW_1B = hex("82 01 6162");
const ROW_2B = hex("82 02 6162");

describe("DT-4: a table's changes at a height", () => {
  it("writes an inserted, a deleted and an updated key as [kind, row], in the order given, with the array's head", () => {
    const touched: TouchedRow[] = [
      { before: null, after: [1n, "a"] },
      { before: [2n, "b"], after: null },
      { before: [3n, "c"], after: [3n, "d"] },
    ];
    const { count, bytes } = tableChanges(TYPES, touched);
    expect(count).toBe(3);
    expect(bytes).toEqual(
      concatBytes(
        hex("83"),
        hex("82"),
        INSERT,
        ROW_1A,
        hex("82"),
        DELETE,
        ROW_2B,
        hex("82"),
        UPDATE,
        hex("82 03 6164"),
      ),
    );
  });

  it("records the old row for a delete and the new row for an insert and an update", () => {
    expect(tableChanges(TYPES, [{ before: [1n, "a"], after: null }]).bytes).toEqual(concatBytes(hex("81 82"), DELETE, ROW_1A));
    expect(tableChanges(TYPES, [{ before: null, after: [1n, "b"] }]).bytes).toEqual(concatBytes(hex("81 82"), INSERT, ROW_1B));
    expect(tableChanges(TYPES, [{ before: [1n, "a"], after: [1n, "b"] }]).bytes).toEqual(
      concatBytes(hex("81 82"), UPDATE, ROW_1B),
    );
  });

  it("records nothing for a key that ends as it began: rewritten with its own values, or inserted then deleted", () => {
    expect(tableChanges(TYPES, [{ before: [1n, "a"], after: [1n, "a"] }])).toEqual({ count: 0, bytes: hex("80") });
    expect(tableChanges(TYPES, [{ before: null, after: null }])).toEqual({ count: 0, bytes: hex("80") });
    expect(tableChanges(TYPES, [])).toEqual({ count: 0, bytes: hex("80") });
    // Only the changed key of three is recorded.
    const mixed = tableChanges(TYPES, [
      { before: [1n, "a"], after: [1n, "a"] },
      { before: [2n, "a"], after: [2n, "b"] },
      { before: null, after: null },
    ]);
    expect(mixed).toEqual({ count: 1, bytes: concatBytes(hex("81 82"), UPDATE, ROW_2B) });
  });

  it("compares rows by their canonical encoding: equal values written differently are no change", () => {
    // A safe integer as a number or a bigint, and jsonb keys in another order, encode the same. [DT-1]
    expect(tableChanges(TYPES, [{ before: [1, "a"], after: [1n, "a"] }]).count).toBe(0);
    const doc = ["bigint", "jsonb"] as const;
    expect(tableChanges(doc, [{ before: [1n, { b: 1, a: 2 }], after: [1n, { a: 2, b: 1 }] }]).count).toBe(0);
    expect(tableChanges(doc, [{ before: [1n, { a: 2 }], after: [1n, { a: 3 }] }]).count).toBe(1);
  });

  it("encodes each row as DT-1's encodeRow does, so a value DT-1 refuses fails the changes too", () => {
    const row = [7n, "x"];
    expect(tableChanges(TYPES, [{ before: null, after: row }]).bytes).toEqual(
      concatBytes(hex("81 82"), INSERT, encodeRow(row, TYPES)),
    );
    expect(() => tableChanges(["bigint", "numeric"], [{ before: null, after: [1n, "1.5"] }])).toThrow(/fraction/);
  });
});

describe("DT-5: a table's digest at a height, chained", () => {
  const CHANGES = concatBytes(hex("81 82"), INSERT, ROW_1A);

  it("is SHA-256(32 zero bytes ‖ CBOR(h) ‖ changes at h) for a table's first change", () => {
    expect(ZERO_DIGEST).toEqual(new Uint8Array(32));
    expect(DIGEST_BYTES).toBe(32);
    expect(nextDigest(null, 7n, CHANGES)).toEqual(sha256(new Uint8Array(32), hex("07"), CHANGES));
    expect(nextDigest(null, 24n, CHANGES)).toEqual(sha256(new Uint8Array(32), hex("18 18"), CHANGES));
    expect(nextDigest(null, 14_400n, CHANGES)).toEqual(sha256(new Uint8Array(32), hex("19 3840"), CHANGES));
    expect(nextDigest(null, 0n, CHANGES)).toEqual(sha256(new Uint8Array(32), hex("00"), CHANGES));
  });

  it("chains each later change on the digest before it", () => {
    const first = nextDigest(null, 1n, CHANGES);
    const second = concatBytes(hex("81 82"), DELETE, ROW_1A);
    expect(nextDigest(first, 5n, second)).toEqual(sha256(first, hex("05"), second));
    // The same changes at another height, or on another previous digest, give another digest.
    expect(nextDigest(first, 6n, second)).not.toEqual(nextDigest(first, 5n, second));
    expect(nextDigest(ZERO_DIGEST, 5n, second)).not.toEqual(nextDigest(first, 5n, second));
    // 32 zero bytes given as the previous digest are the same as none.
    expect(nextDigest(ZERO_DIGEST, 1n, CHANGES)).toEqual(first);
  });

  it("refuses a previous digest that is not 32 bytes long, and a negative height", () => {
    expect(() => nextDigest(new Uint8Array(31), 1n, CHANGES)).toThrow(/32 bytes/);
    expect(() => nextDigest(null, -1n, CHANGES)).toThrow(/height/);
  });
});

describe("DT-5: checkpoint heights", () => {
  it("are the heights h with h mod the interval = 0, genesis included", () => {
    const heights = [0n, 1n, 14_399n, 14_400n, 14_401n, 28_800n, 43_199n].filter((h) => isCheckpointHeight(h, 14_400n));
    expect(heights).toEqual([0n, 14_400n, 28_800n]);
    expect([0n, 1n, 2n, 3n, 4n, 8n, 9n, 12n].filter((h) => isCheckpointHeight(h, 4n))).toEqual([0n, 4n, 8n, 12n]);
  });

  it("refuses an interval that is not a positive integer, and a negative height", () => {
    expect(() => isCheckpointHeight(1n, 0n)).toThrow(/interval/);
    expect(() => isCheckpointHeight(1n, -4n)).toThrow(/interval/);
    expect(() => isCheckpointHeight(-4n, 4n)).toThrow(/height/);
  });
});
