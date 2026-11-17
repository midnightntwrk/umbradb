/**
 * IPIR+SP's request and answer bytes as the GPU responder (`ipir.ts`) reads and writes them, and a reference of the
 * server's arithmetic in `BigInt` for checking. No WebGPU and no Node module: it runs in Deno, Node and a browser.
 *
 * Upstream's server (`ipir/vendor/ipir-sp/ipir-sp/src/native.rs`, `NativeServer::respond`), for one request:
 *
 * - request (RNQ3): `"RNQ3"`, the 32-byte setup id, the key K_g as `2 × 2,048` words of 54 bits, then one selection
 *   word of 49 bits per table row; little-endian bit packing (`ipir-native-client/src/bits.rs`). A selection word x
 *   is lifted to the ring as `x << 5` (`wire.rs`, `up`).
 * - first pass: for every column c, `Σ_r cell[r, c] · (x_r << 5) mod 2^54` (`native_kernel.rs`, `dot`).
 * - packing: for every output block k of 2,048 columns, `H_k · K_g mod 2^54`, H_k the block's compiled matrix of
 *   2,048 × 4,096 signed entries (`native_matrix.rs`, `multiply`), plus the block's first-pass values
 *   (`native.rs`, `finish_two_mask`).
 * - answer (RNR2): `"RNR2"`, the setup id, SHA-256 of the whole request, then each column's sum rounded to 22 bits,
 *   `((v + 2^31) >> 32) mod 2^22` (`wire.rs`, `down`), packed at 22 bits.
 *
 * Every table shape here (rows and columns multiples of 2,048) gives segments that end on a byte boundary, and the
 * selection starts at byte 27,684, a multiple of 4: a request is a whole number of 32-bit words, and so is an
 * answer's packed part (it starts at byte 68).
 */

import { IPIR_DIGITS, IPIR_Q_BITS, IPIR_QUERY_BITS, IPIR_RESPONSE_BITS, IPIR_RING, ipirRequestBytes, ipirResponseBytes } from "../ipir/sizes.ts";

export const IPIR_REQUEST_MAGIC = "RNQ3";
export const IPIR_RESPONSE_MAGIC = "RNR2";
/** Byte offset of the key K_g in a request (after the magic and the setup id). */
export const IPIR_KEY_OFFSET = 36;
/** Key words per request (two limbs of 2,048). */
export const IPIR_KEY_WORDS = IPIR_DIGITS * IPIR_RING;
/** Byte offset of the selection words in a request. */
export const IPIR_SELECTION_OFFSET = IPIR_KEY_OFFSET + (IPIR_KEY_WORDS * IPIR_Q_BITS) / 8;
/** Byte offset of the packed coefficients in an answer (magic, setup id, SHA-256 of the request). */
export const IPIR_ANSWER_OFFSET = 68;
/** Bits a selection word is shifted left by when lifted to the ring (54 − 49). */
export const IPIR_QUERY_SHIFT = IPIR_Q_BITS - IPIR_QUERY_BITS;

const Q_MASK = (1n << BigInt(IPIR_Q_BITS)) - 1n;
const ASCII = new TextEncoder();

/**
 * Checks `count` requests laid end to end before any work, as the add-on does: the total length, then each one's
 * magic and setup id. Throws on the first that fails.
 */
export function checkIpirRequests(requests: Uint8Array, count: number, rows: number, setupId: Uint8Array): void {
  const each = ipirRequestBytes(rows);
  if (!Number.isSafeInteger(count) || count < 1) throw new Error(`a call holds at least one request, got ${count}`);
  if (requests.length !== count * each) {
    throw new Error(`${count} requests to this table are ${count * each} bytes, got ${requests.length}`);
  }
  if (setupId.length !== 32) throw new Error(`a setup id is 32 bytes, got ${setupId.length}`);
  const magic = ASCII.encode(IPIR_REQUEST_MAGIC);
  for (let i = 0; i < count; i++) {
    const at = i * each;
    const ok = magic.every((b, j) => requests[at + j] === b) && setupId.every((b, j) => requests[at + 4 + j] === b);
    if (!ok) throw new Error(`request ${i} is not for this table's setup (magic or setup id)`);
  }
}

/** `bits` bits of `bytes` from bit `offset`, little-endian (`bits.rs`, `read_bits`). */
export function readBits(bytes: Uint8Array, offset: number, bits: number): bigint {
  let value = 0n;
  for (let i = 0; i < bits; i++) {
    const bit = offset + i;
    if ((bytes[bit >>> 3]! >>> (bit & 7)) & 1) value |= 1n << BigInt(i);
  }
  return value;
}

/** The key words of one request (4,096 values of 54 bits). */
export function ipirKeyWords(request: Uint8Array): BigUint64Array {
  const out = new BigUint64Array(IPIR_KEY_WORDS);
  for (let i = 0; i < out.length; i++) out[i] = readBits(request, IPIR_KEY_OFFSET * 8 + i * IPIR_Q_BITS, IPIR_Q_BITS);
  return out;
}

/** The selection words of one request lifted to the ring (`x << 5`, one per row). */
export function ipirQueryWords(request: Uint8Array, rows: number): BigUint64Array {
  const out = new BigUint64Array(rows);
  for (let r = 0; r < rows; r++) {
    out[r] = readBits(request, IPIR_SELECTION_OFFSET * 8 + r * IPIR_QUERY_BITS, IPIR_QUERY_BITS) << BigInt(IPIR_QUERY_SHIFT);
  }
  return out;
}

/** One answer coefficient from its unrounded value modulo 2^54 (`wire.rs`, `down`). */
export function roundAnswer(value: bigint): number {
  const shift = BigInt(IPIR_Q_BITS - IPIR_RESPONSE_BITS);
  return Number(((value + (1n << (shift - 1n))) >> shift) & ((1n << BigInt(IPIR_RESPONSE_BITS)) - 1n));
}

/** Packs values of `bits` bits little-endian (`bits.rs`, `u64s_to_contiguous_bytes`). */
export function packBits(values: ArrayLike<number>, bits: number): Uint8Array {
  const out = new Uint8Array(Math.ceil((values.length * bits) / 8));
  for (let i = 0; i < values.length; i++) {
    const v = values[i]!;
    for (let j = 0; j < bits; j++) {
      if ((v / 2 ** j) % 2 >= 1) {
        const bit = i * bits + j;
        out[bit >>> 3]! |= 1 << (bit & 7);
      }
    }
  }
  return out;
}

/** SHA-256 of `bytes` (WebCrypto: Deno, Node and browsers). */
export async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes as Uint8Array<ArrayBuffer>));
}

/** The 68-byte head of an answer: magic, setup id, SHA-256 of the request. */
export function answerHead(setupId: Uint8Array, requestDigest: Uint8Array): Uint8Array {
  const out = new Uint8Array(IPIR_ANSWER_OFFSET);
  out.set(ASCII.encode(IPIR_RESPONSE_MAGIC), 0);
  out.set(setupId, 4);
  out.set(requestDigest, 36);
  return out;
}

/**
 * The answer to one request from its unrounded per-column sums (first pass plus packing, modulo 2^54): what the
 * server sends.
 */
export async function referenceAnswer(setupId: Uint8Array, request: Uint8Array, sums: BigUint64Array): Promise<Uint8Array> {
  const cols = sums.length;
  const out = new Uint8Array(ipirResponseBytes(cols));
  out.set(answerHead(setupId, await sha256(request)), 0);
  out.set(packBits(Array.from(sums, roundAnswer), IPIR_RESPONSE_BITS), IPIR_ANSWER_OFFSET);
  return out;
}

/** The first pass of one column in `BigInt`: `Σ_r cell[r, c] · query[r] mod 2^54` (column-major cells). */
export function referenceFirstPass(cells: Uint16Array, rows: number, col: number, query: BigUint64Array): bigint {
  let sum = 0n;
  for (let r = 0; r < rows; r++) sum += BigInt(cells[col * rows + r]!) * query[r]!;
  return sum & Q_MASK;
}

/** Row `row` of a block's packing product in `BigInt`: `Σ_j H[row, j] · key[j] mod 2^54` (row-major signed H). */
export function referencePacking(matrix: Int32Array, row: number, key: BigUint64Array): bigint {
  const width = key.length;
  let sum = 0n;
  for (let j = 0; j < width; j++) sum += BigInt(matrix[row * width + j]!) * key[j]!;
  return ((sum % (Q_MASK + 1n)) + Q_MASK + 1n) & Q_MASK;
}

/** Sums modulo 2^54, element by element. */
export function addMod54(a: BigUint64Array, b: BigUint64Array): BigUint64Array {
  if (a.length !== b.length) throw new Error("sums of different lengths");
  return BigUint64Array.from(a, (x, i) => (x + b[i]!) & Q_MASK);
}
