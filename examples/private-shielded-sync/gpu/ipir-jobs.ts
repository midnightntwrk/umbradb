/**
 * The files the IPIR+SP GPU check (`ipir-check.ts`, Deno) and its CPU side (`ipir-cpu-reference.ts`, Node, the native
 * add-on and the wallet's WebAssembly) exchange in a work folder: the check writes a table's cells and `job.json`; the
 * CPU side builds the table, makes the requests, answers them, exports the public values a GPU responder needs, and
 * writes them with its timings (`cpu.json`). Binary files are little-endian.
 */

export interface IpirJob {
  readonly id: string;
  readonly rows: number;
  readonly cols: number;
  /** Raw column-major 16-bit cells (`buildIpirTable` reads the path). */
  readonly cells: string;
  /** The table's public seed and snapshot digest, 32 bytes each, in hex. */
  readonly seed: string;
  readonly snapshot: string;
  /** One request per entry, for that row, in this order. */
  readonly wantedRows: readonly number[];
  /** Calls to answer and time: the first `count` requests each. */
  readonly counts: readonly number[];
  /** Untimed calls first, then timed runs, per call size. */
  readonly warmups: number;
  readonly runs: number;
  /** Also export every block's hint columns. */
  readonly hints: boolean;
}

/** Output files of a job. */
export const ipirOutputs = {
  setupId: "setup-id.bin",
  masks: "masks.bin",
  requests: "requests.bin",
  answers: (count: number) => `answers-${count}.bin`,
  firstPass: "first-pass.bin",
  packing: "packing.bin",
  queryMasks: "query-masks.bin",
  matrix: (block: number) => `matrix-${block}.bin`,
  hints: (block: number) => `hints-${block}.bin`,
};

/** Upstream's timing of one answer's stages (`IpirAnswerStages`), summed over a call's requests. */
export interface IpirStagesMs {
  readonly deserializeMs: number;
  readonly matrixVectorMs: number;
  readonly packingMs: number;
  readonly serializationMs: number;
}

export interface IpirRespondTiming {
  readonly count: number;
  /** Wall time of `IpirServerTable.respond` for the call, each timed run. */
  readonly respondMs: readonly number[];
  /** Upstream's stage timing of each timed run of `respondTimed` (summed over the call's requests). */
  readonly stages: readonly IpirStagesMs[];
  /** `respondTimed`'s answers equal `respond`'s. */
  readonly timedEqual: boolean;
}

export interface IpirCpuReport {
  readonly node: string;
  readonly cpus: number;
  readonly loadBefore: readonly number[];
  readonly loadAfter: readonly number[];
  /** The add-on's build report (`IpirBuildReport`) and the wall time of `buildIpirTable`. */
  readonly build: Record<string, unknown>;
  readonly buildMs: number;
  /** Wall time of `ipirGpuReference` (upstream's preparation repeated, first pass and packing of every request). */
  readonly referenceMs: number;
  /** `ipirGpuReference`'s masks equal the build's. */
  readonly referenceMasksEqual: boolean;
  /** Largest absolute entry of the compiled matrices. */
  readonly matrixMaxAbs: number;
  readonly respond: readonly IpirRespondTiming[];
  /** The wallet (WebAssembly in Node): opening the table, each request, each decode of the largest call's answers. */
  readonly wallet: { readonly openMs: number; readonly requestMs: readonly number[]; readonly decodeMs: readonly number[] };
  /** Rows of the largest call decoded by the wallet that differ from the table's (0 expected). */
  readonly decodedWrong: number;
  readonly decodedRows: number;
}
