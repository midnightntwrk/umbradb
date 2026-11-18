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

/**
 * The read record (FR-060, decision Q58): what a sync reads by PIR for each scan match, 98 bytes.
 *
 * - **16 bytes of the commitment.** The wallet recomputes the commitment of the coin it decrypts and compares these
 *   bytes: that drops a scan match that is not the wallet's (the scan compares 4 bytes) and a ciphertext a sender
 *   forged (the ledger does not check that a ciphertext matches its commitment), at 128-bit strength.
 * - **Ciphertext elements 1–5, shrunk to 82 bytes.** Element i is `Poseidon(k, i) + m_i`; the coin's messages are the
 *   nonce's last byte (1), its other 31 bytes (2), the token type's last byte (3), its other 31 bytes (4) and the value
 *   (5, 16 bytes). The wallet computes every pad, so a short message needs only its element's low bytes:
 *   `m = (e − pad) mod 2^(8b)`, then `e = pad + m` in the field. Elements 1 and 3 keep 1 byte, 5 keeps 16; 2 and 4 keep
 *   all 32 (a 31-byte message plus its pad passes the prime about 1 time in 200, and only the top byte tells).
 *   Zero bytes: the output has no ciphertext.
 *
 * The lower Merkle path is not here: a wallet reads it from the path table only when it spends (`encodePathRecord`).
 */
export const COMMITMENT_PREFIX_BYTES = 16;
/** The shrunk elements 1–5: (element, low bytes kept). */
const SHRUNK: readonly (readonly [number, number])[] = [
  [1, 1],
  [2, 32],
  [3, 1],
  [4, 32],
  [5, 16],
];
export const SHRUNK_ELEMENTS_BYTES = SHRUNK.reduce((n, [, b]) => n + b, 0);
export const READ_RECORD_BYTES = COMMITMENT_PREFIX_BYTES + SHRUNK_ELEMENTS_BYTES;

/** The scalar field's prime (BLS12-381), in which ciphertext elements and pads live. */
const FIELD_PRIME = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;

function leBig(bytes: Uint8Array): bigint {
  let v = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) v = (v << 8n) | BigInt(bytes[i]!);
  return v;
}

function bigLe(v: bigint, length: number): Uint8Array {
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

/** A read record's fields. */
export interface ReadRecord {
  /** The commitment's first 16 bytes. */
  readonly commitmentPrefix: Uint8Array;
  /** Elements 1–5 shrunk (82 bytes), or null when the output has no ciphertext. */
  readonly elements: Uint8Array | null;
}

/** Elements 1–5 of a full ciphertext (point, elements 0–5), shrunk to 82 bytes. */
export function shrinkElements(ciphertext: Uint8Array): Uint8Array {
  checkLength(ciphertext, CIPHERTEXT_BYTES, "ciphertext");
  const out = new Uint8Array(SHRUNK_ELEMENTS_BYTES);
  let at = 0;
  for (const [element, keep] of SHRUNK) {
    const from = POINT_BYTES + element * ELEMENT_BYTES;
    out.set(ciphertext.subarray(from, from + keep), at);
    at += keep;
  }
  return out;
}

/**
 * Elements 1–5 in full (160 bytes) from their shrunk form and the ciphertext's six pads (6 × 32 bytes, the wallet's
 * own `Poseidon(k, i)`). Garbage, not an error, for a ciphertext that is not the wallet's: its decryption then fails.
 */
export function rebuildElements(shrunk: Uint8Array, pads: Uint8Array): Uint8Array {
  checkLength(shrunk, SHRUNK_ELEMENTS_BYTES, "shrunk elements");
  checkLength(pads, 6 * ELEMENT_BYTES, "pads");
  const out = new Uint8Array(5 * ELEMENT_BYTES);
  let at = 0;
  for (const [element, keep] of SHRUNK) {
    const low = shrunk.subarray(at, at + keep);
    at += keep;
    const to = (element - 1) * ELEMENT_BYTES;
    if (keep === ELEMENT_BYTES) {
      out.set(low, to);
      continue;
    }
    const pad = pads.subarray(element * ELEMENT_BYTES, (element + 1) * ELEMENT_BYTES);
    const mask = (1n << BigInt(8 * keep)) - 1n;
    const message = (leBig(low) - (leBig(pad) & mask)) & mask;
    out.set(bigLe((leBig(pad) + message) % FIELD_PRIME, ELEMENT_BYTES), to);
  }
  return out;
}

export function encodeReadRecord(commitment: Uint8Array, ciphertext: Uint8Array | null): Uint8Array {
  checkLength(commitment, COMMITMENT_BYTES, "commitment");
  const out = new Uint8Array(READ_RECORD_BYTES);
  out.set(commitment.subarray(0, COMMITMENT_PREFIX_BYTES), 0);
  if (ciphertext !== null) out.set(shrinkElements(ciphertext), COMMITMENT_PREFIX_BYTES);
  return out;
}

export function decodeReadRecord(bytes: Uint8Array): ReadRecord {
  checkLength(bytes, READ_RECORD_BYTES, "read record");
  const elements = bytes.slice(COMMITMENT_PREFIX_BYTES);
  return { commitmentPrefix: bytes.slice(0, COMMITMENT_PREFIX_BYTES), elements: elements.some((b) => b !== 0) ? elements : null };
}

/**
 * The path record (Q58): a position's k lower sibling hashes, leaf upward, read by PIR only to spend. Zero bytes when
 * its block was not full at the snapshot (the tail then gives the path); a full block's path has no zero hash.
 */
export function pathRecordBytes(pathSplit: number): number {
  if (!Number.isInteger(pathSplit) || pathSplit < 1 || pathSplit > 32) throw new Error(`a path table needs a path split from 1 to 32: ${pathSplit}`);
  return HASH_BYTES * pathSplit;
}

export function encodePathRecord(lowerPath: readonly Uint8Array[] | null, pathSplit: number): Uint8Array {
  const out = new Uint8Array(pathRecordBytes(pathSplit));
  if (lowerPath === null) return out;
  if (lowerPath.length !== pathSplit) throw new Error(`lower path must have ${pathSplit} hashes`);
  lowerPath.forEach((h, i) => {
    checkLength(h, HASH_BYTES, "path hash");
    out.set(h, HASH_BYTES * i);
  });
  return out;
}

export function decodePathRecord(bytes: Uint8Array, pathSplit: number): Uint8Array[] | null {
  checkLength(bytes, pathRecordBytes(pathSplit), "path record");
  if (!bytes.some((b) => b !== 0)) return null;
  return Array.from({ length: pathSplit }, (_, i) => bytes.slice(HASH_BYTES * i, HASH_BYTES * (i + 1)));
}

/** A tail output (FR-070): flags (1, bit 0 = has ciphertext), commitment (32), ciphertext (224, zero when absent). */
export const TAIL_OUTPUT_BYTES = 1 + COMMITMENT_BYTES + CIPHERTEXT_BYTES;

/** Tail-output flag: the output has a ciphertext. */
export const FLAG_CIPHERTEXT = 1;

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
