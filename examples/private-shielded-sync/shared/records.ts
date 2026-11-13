/**
 * Record layouts shared by the server and the client (spec FR-030, FR-060, FR-062, FR-070).
 *
 * A ciphertext is 224 bytes: the point's 32-byte compressed encoding, then elements 0–5, each its 32-byte
 * little-endian integer (the layout of the stored ledger event, FR-C2).
 */

export {
  decodeNullifierRecord,
  encodeNullifierRecord,
  NULLIFIER_RECORD_BYTES,
  type NullifierEntry,
} from "../pir/buckets.ts";

export const CIPHERTEXT_BYTES = 224;
export const POINT_BYTES = 32;
export const ELEMENT_BYTES = 32;
export const COMMITMENT_BYTES = 32;
export const HASH_BYTES = 32;

/** Scan entry (FR-030): the point (32), then the first 4 bytes of element 0. */
export const SCAN_ENTRY_BYTES = 36;

/** The scan entry of an output: zero bytes when it has no ciphertext. */
export function scanEntry(ciphertext: Uint8Array | null): Uint8Array {
  const out = new Uint8Array(SCAN_ENTRY_BYTES);
  if (ciphertext) {
    checkLength(ciphertext, CIPHERTEXT_BYTES, "ciphertext");
    out.set(ciphertext.subarray(0, POINT_BYTES + 4));
  }
  return out;
}

/** Read-record flag: the output has a ciphertext (elements 1–5 present). */
export const FLAG_CIPHERTEXT = 1;
/** Read-record flag: the lower Merkle path is present. */
export const FLAG_LOWER_PATH = 2;

/** Bytes of a read record for tree cut `k` (FR-060): flags (1), commitment (32), elements 1–5 (160), path (32k). */
export function readRecordBytes(pathSplit: number): number {
  if (!Number.isInteger(pathSplit) || pathSplit < 0 || pathSplit > 32) throw new Error(`path split out of range: ${pathSplit}`);
  return 193 + 32 * pathSplit;
}

/** A read record's fields (FR-060). */
export interface ReadRecord {
  readonly commitment: Uint8Array;
  /** Elements 1–5 (160 bytes), or null when the output has no ciphertext. */
  readonly elements: Uint8Array | null;
  /** The k lower sibling hashes, leaf upward (32 bytes each), or null when the block was not full at the snapshot. */
  readonly lowerPath: readonly Uint8Array[] | null;
}

export function encodeReadRecord(record: ReadRecord, pathSplit: number): Uint8Array {
  const out = new Uint8Array(readRecordBytes(pathSplit));
  checkLength(record.commitment, COMMITMENT_BYTES, "commitment");
  out.set(record.commitment, 1);
  let flags = 0;
  if (record.elements) {
    checkLength(record.elements, 5 * ELEMENT_BYTES, "elements 1–5");
    out.set(record.elements, 33);
    flags |= FLAG_CIPHERTEXT;
  }
  if (record.lowerPath) {
    if (record.lowerPath.length !== pathSplit) throw new Error(`lower path must have ${pathSplit} hashes`);
    record.lowerPath.forEach((h, i) => {
      checkLength(h, HASH_BYTES, "path hash");
      out.set(h, 193 + 32 * i);
    });
    flags |= FLAG_LOWER_PATH;
  }
  out[0] = flags;
  return out;
}

export function decodeReadRecord(bytes: Uint8Array, pathSplit: number): ReadRecord {
  checkLength(bytes, readRecordBytes(pathSplit), "read record");
  const flags = bytes[0]!;
  if (flags & ~(FLAG_CIPHERTEXT | FLAG_LOWER_PATH)) throw new Error(`unknown read-record flags ${flags}`);
  const lowerPath =
    flags & FLAG_LOWER_PATH
      ? Array.from({ length: pathSplit }, (_, i) => bytes.slice(193 + 32 * i, 225 + 32 * i))
      : null;
  return {
    commitment: bytes.slice(1, 33),
    elements: flags & FLAG_CIPHERTEXT ? bytes.slice(33, 193) : null,
    lowerPath,
  };
}

/** A tail output (FR-070): flags (1, bit 0 = has ciphertext), commitment (32), ciphertext (224, zero when absent). */
export const TAIL_OUTPUT_BYTES = 1 + COMMITMENT_BYTES + CIPHERTEXT_BYTES;

export interface TailOutput {
  readonly commitment: Uint8Array;
  readonly ciphertext: Uint8Array | null;
}

export function encodeTailOutput(o: TailOutput): Uint8Array {
  const out = new Uint8Array(TAIL_OUTPUT_BYTES);
  checkLength(o.commitment, COMMITMENT_BYTES, "commitment");
  out.set(o.commitment, 1);
  if (o.ciphertext) {
    checkLength(o.ciphertext, CIPHERTEXT_BYTES, "ciphertext");
    out.set(o.ciphertext, 33);
    out[0] = FLAG_CIPHERTEXT;
  }
  return out;
}

export function decodeTailOutput(bytes: Uint8Array): TailOutput {
  checkLength(bytes, TAIL_OUTPUT_BYTES, "tail output");
  const flags = bytes[0]!;
  if (flags & ~FLAG_CIPHERTEXT) throw new Error(`unknown tail-output flags ${flags}`);
  return { commitment: bytes.slice(1, 33), ciphertext: flags & FLAG_CIPHERTEXT ? bytes.slice(33) : null };
}

export function checkLength(bytes: Uint8Array, length: number, what: string): void {
  if (bytes.length !== length) throw new Error(`${what} must be ${length} bytes, got ${bytes.length}`);
}
