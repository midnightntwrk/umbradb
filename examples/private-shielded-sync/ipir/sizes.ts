/**
 * The IPIR+SP profile's constants, and every byte length as a pure function of a table's shape. No imports: the
 * server side (`native.ts`), the wallet side (`wallet.ts`) and the scheme code use the same functions.
 *
 * The profile is upstream's deployed native two-mask profile (`vendor/ORIGIN.md`): ring size 2,048, modulus 2^54,
 * 16-bit cells, key digits base 2^19 × 2, Gaussian secrets, two published masks at 29 bits, query at 49 bits per
 * row (nearest), answer at 22 bits per column.
 *
 * A table is `rows × cols` 16-bit cells, both non-zero multiples of 2,048, at most 2^30 cells and 32,768 rows, held
 * column-major:
 * cell (row, col) is at index `col × rows + row`. One request reads one whole row of `cols` cells.
 *
 * | Bytes | Formula | 2,048 × 2,048 |
 * |---|---|---|
 * | one request | 36 + 27,648 + ⌈49 · rows / 8⌉ | 40,228 |
 * | one answer | 68 + ⌈22 · cols / 8⌉ | 5,700 |
 * | published masks (once per table and snapshot) | 36 + ⌈58 · cols / 8⌉ | 14,884 |
 * | the table's cells on the server | 2 · rows · cols | 8,388,608 |
 */

/** Ring size; rows and columns are multiples of it. */
export const IPIR_RING = 2048;
/** log2 of the modulus q. */
export const IPIR_Q_BITS = 54;
/** log2 of the plaintext modulus: one cell is 16 bits. */
export const IPIR_P_BITS = 16;
/** Bits per key digit (gadget base 2^19). */
export const IPIR_DIGIT_BITS = 19;
/** Key digits. */
export const IPIR_DIGITS = 2;
/** Bits per published mask coefficient. */
export const IPIR_MASK_BITS = 29;
/** Bits per query coefficient (one per row). */
export const IPIR_QUERY_BITS = 49;
/** Bits per answer coefficient (one per column). */
export const IPIR_RESPONSE_BITS = 22;
/** Most cells one table may hold. */
export const IPIR_MAX_CELLS = 2 ** 30;
/**
 * Most rows one table may have: with the query rounded to 49 bits, upstream's correctness certificate stays below
 * 2^-128 only up to 32,768 rows (`docs/research/00058-ipir-sp-review.md`, finding F4). The longest request is then
 * `ipirRequestBytes(32,768)` = 228,388 bytes.
 */
export const IPIR_MAX_ROWS = 2 ** 15;
/** A cell decodes correctly while its phase error is below 2 to this power (q / 2p). */
export const IPIR_PHASE_LIMIT_LOG2 = IPIR_Q_BITS - IPIR_P_BITS - 1;
/** Every request, answer and mask file starts with a 4-byte magic and the 32-byte setup identifier. */
export const IPIR_HEADER_BYTES = 36;
/** Bytes of the key in each request (27,648). */
export const IPIR_KEY_BYTES = (IPIR_DIGITS * IPIR_RING * IPIR_Q_BITS) / 8;

/** The byte lengths of one table shape. */
export interface IpirSizes {
  /** One request. */
  readonly requestBytes: number;
  /** One answer. */
  readonly responseBytes: number;
  /** The table's published masks. */
  readonly masksBytes: number;
  /** The table's cells on the server. */
  readonly tableBytes: number;
}

/** Bytes of one request to a table of `rows` rows. */
export function ipirRequestBytes(rows: number): number {
  return IPIR_HEADER_BYTES + IPIR_KEY_BYTES + Math.ceil((IPIR_QUERY_BITS * rows) / 8);
}

/** Bytes of one answer from a table of `cols` columns (the header, SHA-256 of the request, one coefficient a column). */
export function ipirResponseBytes(cols: number): number {
  return IPIR_HEADER_BYTES + 32 + Math.ceil((IPIR_RESPONSE_BITS * cols) / 8);
}

/** Bytes of the published masks of a table of `cols` columns (two coefficients a column). */
export function ipirMasksBytes(cols: number): number {
  return IPIR_HEADER_BYTES + Math.ceil((2 * IPIR_MASK_BITS * cols) / 8);
}

/**
 * Throws unless rows and columns are non-zero multiples of 2,048, the table holds at most 2^30 cells and has at most
 * 32,768 rows.
 */
export function checkIpirShape(rows: number, cols: number): void {
  const multiple = (n: number): boolean => Number.isSafeInteger(n) && n > 0 && n % IPIR_RING === 0;
  if (!multiple(rows) || !multiple(cols)) {
    throw new Error(`an IPIR+SP table's rows and columns must be non-zero multiples of ${IPIR_RING}, got ${rows} × ${cols}`);
  }
  if (rows * cols > IPIR_MAX_CELLS) throw new Error(`an IPIR+SP table holds at most 2^30 cells, ${rows} × ${cols} is more`);
  if (rows > IPIR_MAX_ROWS) throw new Error(`an IPIR+SP table has at most ${IPIR_MAX_ROWS} rows (the decoding bound of 49-bit queries), got ${rows}`);
}

/** The byte lengths of a table shape; throws on a shape {@link checkIpirShape} refuses. */
export function ipirSizes(rows: number, cols: number): IpirSizes {
  checkIpirShape(rows, cols);
  return {
    requestBytes: ipirRequestBytes(rows),
    responseBytes: ipirResponseBytes(cols),
    masksBytes: ipirMasksBytes(cols),
    tableBytes: 2 * rows * cols,
  };
}
