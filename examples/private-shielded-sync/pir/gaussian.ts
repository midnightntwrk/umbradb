/**
 * The query error (spec FR-055, FR-059): a discrete Gaussian over the integers with standard deviation σ = 6.4, drawn
 * from a cryptographic random source by inversion of its cumulative distribution table.
 *
 * The table covers |x| ≤ 12σ (≈ 77); the mass outside is about 10^-31. Each draw takes 53 uniform bits, so values
 * whose probability is below 2^-53 are never drawn (|x| ≳ 54); this truncation is far below the noise margin of
 * FR-058. The sampler is not constant-time: it runs in the client's own process on its own secrets.
 */

import { randomFillSync } from "node:crypto";
import { SIGMA } from "./params.ts";

const TAIL = Math.ceil(12 * SIGMA);

/** cdf[i] = P(X ≤ i − TAIL), normalised so the last entry is 1. */
const CDF: Float64Array = (() => {
  const weights = new Float64Array(2 * TAIL + 1);
  let total = 0;
  for (let i = 0; i < weights.length; i++) {
    const x = i - TAIL;
    weights[i] = Math.exp(-(x * x) / (2 * SIGMA * SIGMA));
    total += weights[i]!;
  }
  const cdf = new Float64Array(weights.length);
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i]! / total;
    cdf[i] = acc;
  }
  cdf[cdf.length - 1] = 1;
  return cdf;
})();

/** Fills `out` with uniform 32-bit values from the operating system's cryptographic source. */
export function randomWords(out: Uint32Array): Uint32Array {
  randomFillSync(out);
  return out;
}

/** Fills `out` with independent discrete Gaussian samples (as signed 32-bit integers). */
export function gaussianSamples(out: Int32Array): Int32Array {
  const bits = randomWords(new Uint32Array(out.length * 2));
  for (let i = 0; i < out.length; i++) {
    // 53 uniform bits: 27 from one word, 26 from the next.
    const u = ((bits[2 * i]! >>> 5) * 67108864 + (bits[2 * i + 1]! >>> 6)) / 9007199254740992;
    let lo = 0;
    let hi = CDF.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (CDF[mid]! > u) hi = mid;
      else lo = mid + 1;
    }
    out[i] = lo - TAIL;
  }
  return out;
}
