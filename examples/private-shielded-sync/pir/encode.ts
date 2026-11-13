/**
 * Cell encoding (spec FR-051): a record's bytes are read as a bit string, least significant bit of each byte first,
 * cut into groups of b = 9 bits (the last group zero-padded). A group's value v is stored centred, as v − p/2.
 */

import { CELL_BITS, HALF_PLAIN, PLAIN_MODULUS } from "./params.ts";

const MASK = PLAIN_MODULUS - 1;

/** E: the cells (grid rows) one record of `recordBytes` bytes takes. */
export function cellsPerRecord(recordBytes: number): number {
  if (!Number.isInteger(recordBytes) || recordBytes < 1) throw new Error(`record size must be ≥ 1 byte: ${recordBytes}`);
  return Math.ceil((8 * recordBytes) / CELL_BITS);
}

/** The stored (centred) value of a cell holding plaintext value 0, the value of every unused cell. */
export const ZERO_CELL = -HALF_PLAIN;

/**
 * Writes the centred cells of `bytes` to `out[offset + g × stride]` for g = 0 … E − 1. Cells past the record's last
 * bit get the value 0 (stored as −p/2).
 */
export function encodeRecord(bytes: Uint8Array, cells: number, out: Int16Array, offset: number, stride: number): void {
  let acc = 0;
  let nbits = 0;
  let g = 0;
  for (let i = 0; i < bytes.length; i++) {
    acc |= bytes[i]! << nbits;
    nbits += 8;
    while (nbits >= CELL_BITS) {
      out[offset + g * stride] = (acc & MASK) - HALF_PLAIN;
      acc >>>= CELL_BITS;
      nbits -= CELL_BITS;
      g++;
    }
  }
  if (nbits > 0) {
    out[offset + g * stride] = (acc & MASK) - HALF_PLAIN;
    g++;
  }
  for (; g < cells; g++) out[offset + g * stride] = ZERO_CELL;
}

/**
 * Reassembles `recordBytes` bytes from E plaintext cell values (each in [0, p), centring already undone) at
 * `values[start … start + E − 1]`.
 */
export function decodeRecord(values: Uint16Array | Uint32Array, start: number, recordBytes: number): Uint8Array {
  const out = new Uint8Array(recordBytes);
  let acc = 0;
  let nbits = 0;
  let o = 0;
  for (let g = start; o < recordBytes; g++) {
    acc |= (values[g]! & MASK) << nbits;
    nbits += CELL_BITS;
    while (nbits >= 8 && o < recordBytes) {
      out[o++] = acc & 0xff;
      acc >>>= 8;
      nbits -= 8;
    }
  }
  return out;
}
