/**
 * SimplePIR for the private shielded sync example (spec §5.5). Imports nothing from UmbraDB, so the server module and
 * the client use it unchanged.
 */

export * from "./params.ts";
export { cellsPerRecord, decodeRecord, encodeRecord, ZERO_CELL } from "./encode.ts";
export * from "./grid.ts";
export * from "./matrix.ts";
export { gaussianSamples, randomWords } from "./gaussian.ts";
export { inlineMultiplier, type Layout, type Matrix, type Multiplier, multiplyRange, WorkerMultiplier } from "./multiply.ts";
export { buildSetup, matrixColumns, setupBytes, setupMatrix } from "./setup.ts";
export * from "./query.ts";
export * from "./buckets.ts";
