/**
 * SimplePIR for the private shielded sync example (spec §5.5), and the seam a PIR scheme plugs into (`./scheme.ts`,
 * spec 00058). Imports nothing from UmbraDB, so the server module and the client use it unchanged. The server's scheme
 * registry (`./server-schemes.ts`) is not exported here: the page loads this file.
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
export * from "./scheme.ts";
export { openWalletScheme } from "./wallet-schemes.ts";
