/**
 * SimplePIR parameters (spec FR-050), fixed for the proof of concept and recorded in the manifest.
 *
 * "One Server for the Price of Two: Simple and Fast Single-Server Private Information Retrieval", ePrint 2022/949.
 * Arithmetic is modulo q = 2^32: every sum and product wraps at 32 bits (`Math.imul`, `| 0`, `>>> 0`).
 * Byte layouts are little-endian; the library uses typed arrays' own bytes, so it refuses a big-endian host.
 */

if (new Uint8Array(new Uint16Array([1]).buffer)[0] !== 1) throw new Error("the PIR library needs a little-endian host");

/** log2 of the modulus q. */
export const LOG_Q = 32;
/** LWE dimension n: the length of a query secret and the width of the setup data. */
export const LWE_N = 1024;
/** Standard deviation of the discrete Gaussian error. */
export const SIGMA = 6.4;
/** Bits per grid cell, b. */
export const CELL_BITS = 9;
/** Plaintext modulus p = 2^b. */
export const PLAIN_MODULUS = 1 << CELL_BITS;
/** Half the plaintext modulus: cells are stored centred, as v − p/2. */
export const HALF_PLAIN = PLAIN_MODULUS >> 1;
/** log2 of the scale Δ = q / p. */
export const LOG_DELTA = LOG_Q - CELL_BITS;
/** The scale Δ = 2^23. */
export const DELTA = 2 ** LOG_DELTA;

/** The parameters as the manifest records them. */
export interface PirParams {
  readonly logQ: number;
  readonly n: number;
  readonly sigma: number;
  readonly cellBits: number;
  readonly plainModulus: number;
}

export const PIR_PARAMS: PirParams = Object.freeze({
  logQ: LOG_Q,
  n: LWE_N,
  sigma: SIGMA,
  cellBits: CELL_BITS,
  plainModulus: PLAIN_MODULUS,
});

/** The largest column count the noise check accepts (FR-058): `8 σ (p/2) √C < Δ/2`. */
export function noiseBoundHolds(cols: number): boolean {
  return 8 * SIGMA * HALF_PLAIN * Math.sqrt(cols) < DELTA / 2;
}

/** Throws if a grid of `cols` columns could decode wrongly (FR-058). */
export function checkNoise(cols: number): void {
  if (!noiseBoundHolds(cols)) {
    throw new Error(
      `PIR noise check failed: 8·${SIGMA}·${HALF_PLAIN}·√${cols} ≥ Δ/2 = ${DELTA / 2}; the grid has too many columns`,
    );
  }
}

/** The largest column count that passes the noise check. */
export const MAX_COLUMNS: number = (() => {
  // √C < Δ / (16 σ (p/2)); the largest integer strictly below the bound's square.
  let c = Math.floor((DELTA / (16 * SIGMA * HALF_PLAIN)) ** 2);
  while (!noiseBoundHolds(c)) c--;
  while (noiseBoundHolds(c + 1)) c++;
  return c;
})();
