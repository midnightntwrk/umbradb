/**
 * The log reader of `token-metadata`: the bytes of a `Misc` contract log's value, read from `contract-logs`' `data`
 * on the main thread, without the ledger. [TM-2, TM-3; design D6]
 *
 * **What `data` holds.** The ledger's tagged serialization of the logged value (`serializeStateValue`):
 * `midnight:impact-state-value[v2]:`, then the value's storage nodes in topological order — a SCALE compact count, and
 * for each node its child count, its children's indices (compact) and its data (a compact length and the bytes).
 * A cell is two nodes: its aligned value (no children) and the cell itself (one child, index 0, data `01`). The
 * aligned value is its `Value` then its `Alignment`, each in the ledger's flagged-int encoding
 * (`base-crypto/src/fab/serialize.rs` at ledger-9.1.0.0-rc.5): a byte whose two top bits are flags and whose bit 5
 * says one more byte follows (and in that byte, bit 7 a third). A `Misc` event Compact emits is one such cell holding
 * one atom, its trailing zero bytes stripped (the ledger's normal form), declared `Bytes<288>` — name and payload.
 *
 * **What the reader gives.** For a cell holding exactly one atom of at most 288 bytes, the atom's bytes; for any other
 * value under the known tag (null, a map, an array, a cell of several atoms, an atom over 288 bytes, a body that does
 * not parse as the ledger writes it), `null`: not a candidate. For data under any other tag, or not tagged at all,
 * it throws {@link UnknownLogSerialization}: a serialization this build does not know must stop the block rather than
 * hide every event behind it. Every length is checked before the bytes it covers are read.
 */

/** The tag of the ledger's serialization of a state value, as both vendored v9 packages write it. */
export const STATE_VALUE_TAG = "impact-state-value[v2]";

/** The most bytes a `Misc` event's name and payload take together. */
export const MISC_DATA_SIZE = 288;

const PREFIX = "midnight:";
const CELL = 1;

/** A log's data in a serialization this build does not know. */
export class UnknownLogSerialization extends Error {
  override readonly name = "UnknownLogSerialization";
  constructor(readonly tag: string | null) {
    super(tag === null ? "the log's data is not a tagged serialization" : `the log's data has the unknown tag ${tag}`);
  }
}

/** A malformed body under the known tag; caught inside the reader, never thrown out of it. */
class NotACell extends Error {}

class Reader {
  private offset: number;
  constructor(
    private readonly bytes: Uint8Array,
    start: number,
  ) {
    this.offset = start;
  }

  get done(): boolean {
    return this.offset === this.bytes.length;
  }

  u8(): number {
    if (this.offset >= this.bytes.length) throw new NotACell();
    return this.bytes[this.offset++]!;
  }

  take(length: number): Uint8Array {
    if (length > this.bytes.length - this.offset) throw new NotACell();
    const out = this.bytes.subarray(this.offset, this.offset + length);
    this.offset += length;
    return out;
  }

  /** A SCALE compact integer of at most four bytes (larger counts or lengths cannot occur here). */
  compact(): number {
    const first = this.u8();
    switch (first & 0b11) {
      case 0b00:
        return first >> 2;
      case 0b01:
        return (first | (this.u8() << 8)) >>> 2;
      case 0b10: {
        const value = first | (this.u8() << 8) | (this.u8() << 16) | (this.u8() << 24);
        return value >>> 2;
      }
      default:
        throw new NotACell();
    }
  }

  /** The ledger's flagged int: its two flags and its value, refusing what the ledger's own reader refuses. */
  flagged(): { x: boolean; y: boolean; int: number } {
    const first = this.u8();
    const x = (first & 0x80) !== 0;
    const y = (first & 0x40) !== 0;
    const a = first & 0x1f;
    if ((first & 0x20) === 0) return { x, y, int: a };
    const second = this.u8();
    const b = second & 0x7f;
    if ((second & 0x80) === 0) {
      if (b === 0) throw new NotACell();
      return { x, y, int: a | (b << 5) };
    }
    const third = this.u8();
    const c = third & 0x7f;
    if ((third & 0x80) !== 0 || c === 0) throw new NotACell();
    return { x, y, int: a | (b << 5) | (c << 12) };
  }
}

/** The tag of `data` and the offset its body starts at; throws {@link UnknownLogSerialization} without one. */
function tagOf(data: Uint8Array): { tag: string; body: number } {
  if (data.length < PREFIX.length) throw new UnknownLogSerialization(null);
  for (let i = 0; i < PREFIX.length; i++) if (data[i] !== PREFIX.charCodeAt(i)) throw new UnknownLogSerialization(null);
  const limit = Math.min(data.length, PREFIX.length + 128);
  for (let i = PREFIX.length; i < limit; i++) {
    if (data[i] === 0x3a) {
      return { tag: String.fromCharCode(...data.subarray(PREFIX.length, i)), body: i + 1 };
    }
  }
  throw new UnknownLogSerialization(null);
}

/** One atom of a `Value`, in the ledger's normal form, from its flagged int already read. */
function atomWith(reader: Reader, x: boolean, y: boolean, int: number): Uint8Array {
  if (x) throw new NotACell();
  if (!y) {
    if (int < 1 || int > 31) throw new NotACell();
    return Uint8Array.of(int);
  }
  const bytes = reader.take(int);
  if (int > 0 && bytes[int - 1] === 0) throw new NotACell();
  if (int === 1 && bytes[0]! < 32) throw new NotACell();
  return bytes;
}

function atom(reader: Reader): Uint8Array {
  const { x, y, int } = reader.flagged();
  return atomWith(reader, x, y, int);
}

/** An `Alignment`, read only to check that it is well formed and to reach its end. */
function alignment(reader: Reader, depth: number): void {
  if (depth > 32) throw new NotACell();
  const { x, y, int } = reader.flagged();
  if (x && y) {
    if (int === 1) throw new NotACell();
    for (let i = 0; i < int; i++) segment(reader, depth + 1);
    return;
  }
  segmentWith(reader, x, y, int, depth);
}

function segment(reader: Reader, depth: number): void {
  const { x, y, int } = reader.flagged();
  segmentWith(reader, x, y, int, depth);
}

function segmentWith(reader: Reader, x: boolean, y: boolean, int: number, depth: number): void {
  if (!x) {
    if (y && int > 1) throw new NotACell();
    return;
  }
  if (y) throw new NotACell();
  for (let i = 0; i < int; i++) alignment(reader, depth + 1);
}

/** The atom of a cell's aligned value, or null when the value holds several atoms. */
function singleAtom(data: Uint8Array): Uint8Array | null {
  const reader = new Reader(data, 0);
  const { x, y, int } = reader.flagged();
  let only: Uint8Array | null = null;
  if (x && y) throw new NotACell();
  if (x) {
    if (int === 1) throw new NotACell();
    for (let i = 0; i < int; i++) atom(reader);
  } else {
    only = atomWith(reader, x, y, int);
  }
  alignment(reader, 0);
  if (!reader.done) throw new NotACell();
  return only;
}

/**
 * The bytes of `data`'s logged value when it is a cell of one atom of at most {@link MISC_DATA_SIZE} bytes (the atom
 * in normal form: trailing zero bytes stripped), else `null`; throws {@link UnknownLogSerialization} when `data` is
 * not the tagged state-value serialization.
 */
export function miscAtom(data: Uint8Array): Uint8Array | null {
  const { tag, body } = tagOf(data);
  if (tag !== STATE_VALUE_TAG) throw new UnknownLogSerialization(tag);
  try {
    const reader = new Reader(data, body);
    if (reader.compact() !== 2) return null;
    if (reader.compact() !== 0) return null;
    const valueNode = reader.take(reader.compact());
    if (reader.compact() !== 1 || reader.compact() !== 0) return null;
    const cellNode = reader.take(reader.compact());
    if (!reader.done || cellNode.length !== 1 || cellNode[0] !== CELL) return null;
    const bytes = singleAtom(valueNode);
    return bytes === null || bytes.length > MISC_DATA_SIZE ? null : Uint8Array.from(bytes);
  } catch (error) {
    if (error instanceof NotACell) return null;
    throw error;
  }
}
