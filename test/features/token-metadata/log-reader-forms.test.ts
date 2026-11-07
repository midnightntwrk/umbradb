import { describe, expect, it } from "vitest";
import { miscAtom, STATE_VALUE_TAG, UnknownLogSerialization } from "../../../src/features/token-metadata/log-reader.ts";
import { cellData } from "./harness.js";

/**
 * The log reader on the encodings a cell can take that the stagenet logs and the vendored packages' normal output do
 * not show: SCALE compact integers in their two- and four-byte forms (and the big-integer form, which no length here
 * can take), the ledger's flagged ints in their three-byte form, and the malformed variants of each, which give no
 * candidate rather than a throw; and a tag cut short of its `:`. Each test builds the data with {@link encode}, whose
 * one-byte forms give exactly what the vendored v9 package writes. [TM-2, TM-3; M4, M6]
 */

const PREFIX = new TextEncoder().encode(`midnight:${STATE_VALUE_TAG}:`);

/** A SCALE compact integer in its 1-, 2- or 4-byte form, or the big-integer form's first byte (`0b11`). */
function compact(n: number, form: 1 | 2 | 4 | "big" = 1): number[] {
  if (form === 1) return [n << 2];
  if (form === 2) {
    const v = (n << 2) | 1;
    return [v & 0xff, (v >> 8) & 0xff];
  }
  if (form === 4) {
    const v = ((n << 2) | 2) >>> 0;
    return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
  }
  return [0b11, 0, 0, 0, 0];
}

/** The ledger's flagged int (flags x, y and the value) in its 1-, 2- or 3-byte form. */
function flagged(x: boolean, y: boolean, int: number, width: 1 | 2 | 3): number[] {
  const flags = (x ? 0x80 : 0) | (y ? 0x40 : 0);
  if (width === 1) return [flags | int];
  if (width === 2) return [flags | 0x20 | (int & 0x1f), (int >> 5) & 0x7f];
  return [flags | 0x20 | (int & 0x1f), 0x80 | ((int >> 5) & 0x7f), (int >> 12) & 0x7f];
}

/** A cell of one atom `bytes` (x = 0, y = 1, its length as a flagged int of `width`), its alignment one empty byte. */
function valueNode(bytes: readonly number[], width: 1 | 2 | 3 = bytes.length < 32 ? 1 : 2): number[] {
  return [...flagged(false, true, bytes.length, width), ...bytes, 0x00];
}

/** A log's data: the tag, then a `Value` node (its length a compact of `form`) and the cell node. */
function encode(node: readonly number[], form: 1 | 2 | 4 | "big" = node.length < 64 ? 1 : 2): Uint8Array {
  return Uint8Array.from([...PREFIX, ...compact(2), ...compact(0), ...compact(node.length, form), ...node, ...compact(1), ...compact(0), ...compact(1), 1]);
}

const atom = (n: number) => Array.from({ length: n }, (_, i) => 0x41 + (i % 26));

describe("the log reader on every form of its integers", () => {
  it("reads the one-byte forms as the vendored package writes them (the encoder's baseline)", () => {
    expect(miscAtom(encode(valueNode(atom(5))))).toEqual(Uint8Array.from(atom(5)));
    // A real cell of the same atom, as the vendored v9 package serializes it, reads the same.
    expect(miscAtom(cellData(Uint8Array.from(atom(5))))).toEqual(Uint8Array.from(atom(5)));
  });

  it("reads a node length in the compact's two- and four-byte forms", () => {
    const node = valueNode(atom(5));
    expect(miscAtom(encode(node, 2))).toEqual(Uint8Array.from(atom(5)));
    expect(miscAtom(encode(node, 4))).toEqual(Uint8Array.from(atom(5)));
  });

  it("gives no candidate for the compact's big-integer form, which no length here can take", () => {
    expect(miscAtom(encode(valueNode(atom(5)), "big"))).toBeNull();
  });

  it("reads an atom length in the flagged int's three-byte form (4,096 and above, so past 288 bytes: no candidate)", () => {
    expect(miscAtom(encode(valueNode(atom(5000), 3), 4))).toBeNull();
    // A smaller length written in three bytes is not minimal (its third byte is 0), which the ledger refuses too.
    expect(miscAtom(encode(valueNode(atom(100), 3)))).toBeNull();
  });

  it("gives no candidate for a flagged int the ledger refuses: an empty continuation, or a third byte that continues", () => {
    // Two bytes whose second holds 0 and no continuation (the value fits one byte).
    expect(miscAtom(encode([0x40 | 0x20 | 5, 0x00, ...atom(5), 0x00]))).toBeNull();
    // Three bytes whose third holds 0, or sets the continuation bit.
    expect(miscAtom(encode([0x40 | 0x20 | 5, 0x80, 0x00, ...atom(5), 0x00]))).toBeNull();
    expect(miscAtom(encode([0x40 | 0x20 | 5, 0x80, 0x81, ...atom(5), 0x00]))).toBeNull();
  });

  it("gives no candidate for an alignment segment the ledger refuses (y with a count above 1)", () => {
    expect(miscAtom(encode([...flagged(false, true, 5, 1), ...atom(5), ...flagged(false, true, 2, 1)]))).toBeNull();
  });

  it("reads an alignment of segments that nest alignments, and refuses a segment with both flags", () => {
    const a = [...flagged(false, true, 5, 1), ...atom(5)];
    // Two segments: the first (x) holds one nested alignment, the second is empty.
    expect(miscAtom(encode([...a, ...flagged(true, true, 2, 1), ...flagged(true, false, 1, 1), 0x00, 0x00]))).toEqual(Uint8Array.from(atom(5)));
    // A segment with both flags set.
    expect(miscAtom(encode([...a, ...flagged(true, true, 2, 1), ...flagged(true, true, 1, 1), 0x00]))).toBeNull();
    // Alignments nested past the ledger's depth.
    const deep = [...a, ...Array.from({ length: 40 }, () => flagged(true, false, 1, 1)).flat(), 0x00];
    expect(miscAtom(encode(deep))).toBeNull();
  });

  it("throws UnknownLogSerialization for a tag with no ':' in its first 128 bytes", () => {
    const data = Uint8Array.from([...new TextEncoder().encode("midnight:"), ...new Array(200).fill(0x61)]);
    expect(() => miscAtom(data)).toThrow(UnknownLogSerialization);
    expect(() => miscAtom(new TextEncoder().encode("midnight:"))).toThrow(UnknownLogSerialization);
  });
});
