/**
 * IPIR+SP's server answer on the GPU (spec story 6, FR-061): `GpuIpirTable.respond(requests, count)` returns the same
 * bytes as `IpirServerTable.respond` (`ipir/native.ts`) for the same table and requests, with the first pass and the
 * packing computed in WebGPU (`ipir-wgsl.ts`; the arithmetic is stated in `ipir-wire.ts`).
 *
 * A table is set up once (`create`): its cells (column-major, as the add-on takes them) are copied to the GPU and laid
 * out row-major there, and each output block's compiled packing matrix (the add-on's `ipirGpuReference`, public
 * values) is copied and laid out column-major. Both stay on the GPU until `release`. A call then moves only its
 * requests and its answers: all the call's requests are answered in one scan of the table (the CPU answers them one
 * after another), then the packing of every block and request in one dispatch, then the sums are rounded and packed.
 * Buffers are split so that no binding exceeds `chunkBytes` (default: the device's limit, at most 1 GiB).
 *
 * Also: `firstPass` and `packingProduct` (the two steps alone, unrounded, to check each against upstream's) and
 * `hints` (preparation's hint columns: the first pass over the 2,048 public query-mask columns, FR-062).
 *
 * Imports no Node module, so it runs in Deno and in a browser.
 */

import { checkIpirShape, IPIR_Q_BITS, IPIR_QUERY_BITS, IPIR_RESPONSE_BITS, IPIR_RING, ipirRequestBytes, ipirResponseBytes } from "../ipir/sizes.ts";
import { compileShader, writeView } from "./device.ts";
import {
  finishAnswerWgsl,
  finishWordsWgsl,
  IPIR_PARAMS_BYTES,
  IPIR_WORKGROUP,
  packWgsl,
  scanWgsl,
  unpackWgsl,
  uploadCellsWgsl,
  uploadMatrixWgsl,
} from "./ipir-wgsl.ts";
import { answerHead, checkIpirRequests, IPIR_ANSWER_OFFSET, IPIR_KEY_OFFSET, IPIR_KEY_WORDS, IPIR_QUERY_SHIFT, IPIR_SELECTION_OFFSET, sha256 } from "./ipir-wire.ts";

const MAX_GROUPS = 65535;
/** Invocations a dispatch should have at least, to keep the GPU busy; segments of rows are split until it has. */
const TARGET_INVOCATIONS = 65536;
/** Rows per segment of the first pass: powers of two, so each divides every table's rows (multiples of 2,048). */
const SEGMENT_ROWS = [2048, 1024, 512, 256] as const;
/** Largest partial-sum buffer a call makes; past it, segments get longer. */
const PARTIAL_BUDGET = 512 * 2 ** 20;
const D = IPIR_RING;
const MATRIX_COLS = IPIR_KEY_WORDS;
const MATRIX_BYTES = D * MATRIX_COLS * 4;
const Q = 1n << BigInt(IPIR_Q_BITS);

export interface GpuIpirTableInput {
  readonly rows: number;
  readonly cols: number;
  /** `rows × cols` column-major cells (cell (r, c) at `c × rows + r`), as `buildIpirTable` takes them. */
  readonly cells: Uint16Array;
  /** The table's setup id (32 bytes): every request must carry it. */
  readonly setupId: Uint8Array;
  /** Each output block's compiled packing matrix, 2,048 × 4,096 row-major (`IpirGpuReference.blocks[k].matrix`). */
  readonly matrices: readonly Int32Array[];
}

export interface GpuIpirOptions {
  /** Largest buffer bound to one dispatch, in bytes; by default the device's limit, at most 1 GiB. */
  readonly chunkBytes?: number;
  /** Most requests per invocation of the first pass and the packing (1, 2, 4, 8 or 16; default 2). */
  readonly requestsPerInvocation?: number;
  /** Rows per segment of the first pass (256, 512, 1,024 or 2,048); by default chosen per call for occupancy. */
  readonly segmentRows?: number;
  /** Key-word segments of the packing (1, 2, 4, 8 or 16); by default chosen per call for occupancy. */
  readonly packSegments?: number;
  /** Adjacent table columns per invocation of the first pass and the hints: 2, 4 or 8 (default 8). */
  readonly columnsPerInvocation?: number;
  /** Adjacent matrix rows per invocation of the packing: 1, 2 or 4 (default 4). */
  readonly matrixRowsPerInvocation?: number;
  /** Which index varies fastest between neighbouring invocations of the first pass and the hints: the request group
   * ("group", the default: invocations reading the same table words run together) or the column group ("pair"). */
  readonly scanOrder?: "pair" | "group";
  /** The same for the packing: the request group ("group") or the matrix rows ("row", the default). */
  readonly packOrder?: "row" | "group";
  /** Measure the GPU's execution time of each stage (`lastStagesMs`), if the device has `timestamp-query`. */
  readonly timestamps?: boolean;
}

/** GPU execution of each stage of the last measured call, in milliseconds (null: not measured or not written). */
export interface GpuIpirStagesMs {
  readonly unpack: number | null;
  readonly scan: number | null;
  readonly pack: number | null;
  readonly finish: number | null;
  /** The sum of the stages that ran (null if one of them was not measured). The stages run one after another. */
  readonly total: number | null;
}

/** How a call was laid out on the GPU (for results files). */
export interface GpuIpirCallShape {
  readonly count: number;
  readonly countPadded: number;
  readonly requestsPerInvocation: number;
  readonly segmentRows: number;
  readonly scanSegments: number;
  readonly packSegments: number;
  /** Bytes of the buffers the call made (requests, limbs, partial sums, output, read-back). */
  readonly scratchBytes: number;
}

interface Chunk {
  readonly buffer: GPUBuffer;
  readonly row0: number;
  readonly rows: number;
}

interface MatrixChunk {
  readonly buffer: GPUBuffer;
  readonly block0: number;
  readonly blocks: number;
}

interface Pipelines {
  readonly uploadCells: GPUComputePipeline;
  readonly uploadMatrix: GPUComputePipeline;
  readonly unpackQuery: GPUComputePipeline;
  readonly unpackKey: GPUComputePipeline;
  readonly scan: ReadonlyMap<number, GPUComputePipeline>;
  readonly pack: ReadonlyMap<number, GPUComputePipeline>;
  readonly hint: GPUComputePipeline;
  readonly finishAnswer: GPUComputePipeline;
  readonly finishWords: GPUComputePipeline;
}

type Mode = "answer" | "first-pass" | "packing";

const compiled = new WeakMap<GPUDevice, Map<string, Promise<Pipelines>>>();

/** The kernel variant a table uses. */
interface Variant {
  readonly gMax: number;
  /** Table words (two columns each) per invocation of the first pass and the hints. */
  readonly words: number;
  /** Matrix rows per invocation of the packing. */
  readonly rowsPer: number;
  readonly order: "pair" | "group";
  readonly packOrder: "row" | "group";
}

/** Workgroups for `invocations`, split over two dimensions when one is not enough. */
function grid(invocations: number): [number, number] {
  const groups = Math.max(1, Math.ceil(invocations / IPIR_WORKGROUP));
  if (groups <= MAX_GROUPS) return [groups, 1];
  return [MAX_GROUPS, Math.ceil(groups / MAX_GROUPS)];
}

/** Four 16-bit limbs of a value below 2^54, as consecutive words. */
function putLimbs(out: Uint32Array, at: number, value: bigint): void {
  const lo = Number(value & 0xffff_ffffn);
  const hi = Number(value >> 32n);
  out[at] = lo & 0xffff;
  out[at + 1] = lo >>> 16;
  out[at + 2] = hi & 0xffff;
  out[at + 3] = hi >>> 16;
}

export class GpuIpirTable {
  readonly rows: number;
  readonly cols: number;
  readonly setupId: Uint8Array;
  /** Bytes kept on the GPU between calls: the cells (2 per cell) and the compiled matrices (32 MiB per block). */
  readonly residentBytes: number;
  /** Rows per table chunk (each chunk one buffer of at most `chunkBytes`). */
  readonly chunkRows: number;
  /** GPU execution of the stages of the last call that measured them. */
  lastStagesMs: GpuIpirStagesMs | null = null;
  /** The layout of the last call. */
  lastCall: GpuIpirCallShape | null = null;

  readonly #device: GPUDevice;
  readonly #pipelines: Pipelines;
  readonly #chunks: readonly Chunk[];
  readonly #matrices: readonly MatrixChunk[];
  readonly #gMax: number;
  readonly #words: number;
  readonly #rowsPer: number;
  readonly #segmentRows: number | undefined;
  readonly #packSegmentsFixed: number | undefined;
  readonly #querySet: GPUQuerySet | null;
  #querySetBusy = false;
  #released = false;

  private constructor(
    device: GPUDevice,
    input: GpuIpirTableInput,
    pipelines: Pipelines,
    chunks: readonly Chunk[],
    matrices: readonly MatrixChunk[],
    chunkRows: number,
    options: GpuIpirOptions,
    variant: Variant,
  ) {
    this.#device = device;
    this.rows = input.rows;
    this.cols = input.cols;
    this.setupId = input.setupId.slice();
    this.#pipelines = pipelines;
    this.#chunks = chunks;
    this.#matrices = matrices;
    this.chunkRows = chunkRows;
    this.#gMax = variant.gMax;
    this.#words = variant.words;
    this.#rowsPer = variant.rowsPer;
    this.#segmentRows = options.segmentRows;
    this.#packSegmentsFixed = options.packSegments;
    this.residentBytes = input.rows * input.cols * 2 + input.matrices.length * MATRIX_BYTES;
    const timestamps = (options.timestamps ?? false) && device.features.has("timestamp-query");
    this.#querySet = timestamps ? device.createQuerySet({ type: "timestamp", count: 8 }) : null;
  }

  /**
   * Copies the table and its compiled matrices to the GPU, compiling the kernels first if this device has not yet
   * (`compileKernels`). Resolves once the copies have finished on the GPU.
   */
  static async create(device: GPUDevice, input: GpuIpirTableInput, options: GpuIpirOptions = {}): Promise<GpuIpirTable> {
    const { rows, cols, cells, setupId, matrices } = input;
    checkIpirShape(rows, cols);
    if (cells.length !== rows * cols) throw new Error(`a ${rows} × ${cols} table has ${rows * cols} cells, got ${cells.length}`);
    if (setupId.length !== 32) throw new Error(`a setup id is 32 bytes, got ${setupId.length}`);
    if (matrices.length !== cols / D) throw new Error(`a table of ${cols} columns has ${cols / D} packing matrices, got ${matrices.length}`);
    for (const m of matrices) if (m.length !== D * MATRIX_COLS) throw new Error(`a packing matrix has ${D * MATRIX_COLS} entries, got ${m.length}`);
    const variant = GpuIpirTable.#variant(options);
    if (options.packSegments !== undefined && ![1, 2, 4, 8, 16].includes(options.packSegments)) {
      throw new Error(`key-word segments must be 1, 2, 4, 8 or 16: ${options.packSegments}`);
    }
    if (options.segmentRows !== undefined && !(SEGMENT_ROWS as readonly number[]).includes(options.segmentRows)) {
      throw new Error(`rows per segment must be one of ${SEGMENT_ROWS.join(", ")}: ${options.segmentRows}`);
    }
    const limit = Math.min(device.limits.maxStorageBufferBindingSize, device.limits.maxBufferSize, 2 ** 30);
    const chunkBytes = Math.min(options.chunkBytes ?? limit, limit);
    const rowBytes = cols * 2;
    let chunkRows = Math.floor(chunkBytes / rowBytes);
    chunkRows = chunkRows >= 2048 ? chunkRows - (chunkRows % 2048) : chunkRows - (chunkRows % 256);
    if (chunkRows < 256) throw new Error(`a chunk of ${chunkBytes} bytes holds fewer than 256 rows of ${cols} cells`);
    chunkRows = Math.min(chunkRows, rows);

    const pipelines = await GpuIpirTable.#compile(device, variant);
    const U = GPUBufferUsage;
    const chunks: Chunk[] = [];
    for (let row0 = 0; row0 < rows; row0 += chunkRows) {
      const n = Math.min(chunkRows, rows - row0);
      chunks.push({ buffer: device.createBuffer({ size: n * rowBytes, usage: U.STORAGE | U.COPY_DST }), row0, rows: n });
    }
    const perMatrixChunk = Math.max(1, Math.floor(chunkBytes / MATRIX_BYTES));
    const matrixChunks: MatrixChunk[] = [];
    for (let block0 = 0; block0 < matrices.length; block0 += perMatrixChunk) {
      const n = Math.min(perMatrixChunk, matrices.length - block0);
      matrixChunks.push({ buffer: device.createBuffer({ size: n * MATRIX_BYTES, usage: U.STORAGE }), block0, blocks: n });
    }
    const made: GPUBuffer[] = [];
    try {
      // Cells: slabs of whole columns (each contiguous in the column-major input), laid out row-major per chunk.
      const colBytes = rows * 2;
      const slabCols = Math.max(2, Math.floor((32 * 2 ** 20) / colBytes / 2) * 2);
      const slab = device.createBuffer({ size: Math.min(slabCols, cols) * colBytes, usage: U.STORAGE | U.COPY_DST });
      made.push(slab);
      for (let c0 = 0; c0 < cols; c0 += slabCols) {
        const n = Math.min(slabCols, cols - c0);
        writeView(device, slab, 0, cells.subarray(c0 * rows, (c0 + n) * rows));
        const enc = device.createCommandEncoder();
        for (const chunk of chunks) {
          const params = GpuIpirTable.#params(device, made, [rows, c0, n, chunk.row0, chunk.rows, cols / 2]);
          GpuIpirTable.#dispatch(device, enc, pipelines.uploadCells, [slab, chunk.buffer, params], (n / 2) * chunk.rows);
        }
        device.queue.submit([enc.finish()]);
      }
      // Matrices: one block at a time, row-major in, column-major out.
      const source = device.createBuffer({ size: MATRIX_BYTES, usage: U.STORAGE | U.COPY_DST });
      made.push(source);
      for (const mc of matrixChunks) {
        for (let k = 0; k < mc.blocks; k++) {
          writeView(device, source, 0, matrices[mc.block0 + k]!);
          const enc = device.createCommandEncoder();
          const params = GpuIpirTable.#params(device, made, [D, MATRIX_COLS, k * D * MATRIX_COLS]);
          GpuIpirTable.#dispatch(device, enc, pipelines.uploadMatrix, [source, mc.buffer, params], D * MATRIX_COLS);
          device.queue.submit([enc.finish()]);
        }
      }
      await device.queue.onSubmittedWorkDone();
    } catch (e) {
      for (const c of chunks) c.buffer.destroy();
      for (const m of matrixChunks) m.buffer.destroy();
      throw e;
    } finally {
      for (const b of made) b.destroy();
    }
    return new GpuIpirTable(device, input, pipelines, chunks, matrixChunks, chunkRows, options, variant);
  }

  /** Compiles the kernels for `device` ahead of `create` (so that `create`'s time is the upload's alone). */
  static async compileKernels(device: GPUDevice, options: GpuIpirOptions = {}): Promise<void> {
    await GpuIpirTable.#compile(device, GpuIpirTable.#variant(options));
  }

  static #variant(options: GpuIpirOptions): Variant {
    const gMax = options.requestsPerInvocation ?? 2;
    if (![1, 2, 4, 8, 16].includes(gMax)) throw new Error(`requests per invocation must be 1, 2, 4, 8 or 16: ${gMax}`);
    const columns = options.columnsPerInvocation ?? 8;
    if (![2, 4, 8].includes(columns)) throw new Error(`columns per invocation must be 2, 4 or 8: ${columns}`);
    const rowsPer = options.matrixRowsPerInvocation ?? 4;
    if (![1, 2, 4].includes(rowsPer)) throw new Error(`matrix rows per invocation must be 1, 2 or 4: ${rowsPer}`);
    return { gMax, words: columns / 2, rowsPer, order: options.scanOrder ?? "group", packOrder: options.packOrder ?? "row" };
  }

  /** The kernels for `device` and a variant, compiled once per device and kept (a second table needs no compiling). */
  static #compile(device: GPUDevice, variant: Variant): Promise<Pipelines> {
    let perDevice = compiled.get(device);
    if (!perDevice) {
      perDevice = new Map();
      compiled.set(device, perDevice);
    }
    const key = `${variant.gMax}/${variant.words}/${variant.rowsPer}/${variant.order}/${variant.packOrder}`;
    let pipelines = perDevice.get(key);
    if (!pipelines) {
      pipelines = GpuIpirTable.#compileNow(device, variant);
      perDevice.set(key, pipelines);
      pipelines.catch(() => perDevice.delete(key));
    }
    return pipelines;
  }

  static async #compileNow(device: GPUDevice, { gMax, words, rowsPer, order, packOrder }: Variant): Promise<Pipelines> {
    const gs = [...new Set([1, 2, 4, gMax])].filter((g) => g <= gMax);
    const pipeline = async (code: string, label: string, entryPoint: string) =>
      device.createComputePipelineAsync({
        layout: "auto",
        compute: { module: await compileShader(device, code, label), entryPoint },
      });
    const unpack = unpackWgsl(IPIR_QUERY_BITS, IPIR_Q_BITS, IPIR_QUERY_SHIFT);
    const [uploadCells, uploadMatrix, unpackQuery, unpackKey, hint, finishAnswer, finishWords, ...rest] = await Promise.all([
      pipeline(uploadCellsWgsl(), "IPIR upload cells", "upload_cells"),
      pipeline(uploadMatrixWgsl(), "IPIR upload matrix", "upload_matrix"),
      pipeline(unpack, "IPIR unpack", "unpack_query"),
      pipeline(unpack, "IPIR unpack", "unpack_key"),
      pipeline(scanWgsl(gMax, "hint", words, order), `IPIR hint (${gMax})`, "hint"),
      pipeline(finishAnswerWgsl(IPIR_RESPONSE_BITS, IPIR_Q_BITS), "IPIR finish answer", "finish_answer"),
      pipeline(finishWordsWgsl(), "IPIR finish words", "finish_words"),
      ...gs.map((g) => pipeline(scanWgsl(g, "scan", words, order), `IPIR scan (${g})`, "scan")),
      ...gs.map((g) => pipeline(packWgsl(g, rowsPer, packOrder), `IPIR pack (${g})`, "pack")),
    ]);
    return {
      uploadCells,
      uploadMatrix,
      unpackQuery,
      unpackKey,
      hint,
      finishAnswer,
      finishWords,
      scan: new Map(gs.map((g, i) => [g, rest[i]!])),
      pack: new Map(gs.map((g, i) => [g, rest[gs.length + i]!])),
    };
  }

  /** A uniform buffer of up to 16 words, recorded in `made` for destruction after the work. */
  static #params(device: GPUDevice, made: GPUBuffer[], words: readonly number[]): GPUBuffer {
    const b = device.createBuffer({ size: IPIR_PARAMS_BYTES, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    made.push(b);
    const data = new Uint32Array(IPIR_PARAMS_BYTES / 4);
    data.set(words);
    device.queue.writeBuffer(b, 0, data);
    return b;
  }

  /** One compute pass of `pipeline` over `invocations`, its buffers bound in order. */
  static #dispatch(
    device: GPUDevice,
    enc: GPUCommandEncoder,
    pipeline: GPUComputePipeline,
    buffers: readonly GPUBuffer[],
    invocations: number,
    timestampWrites?: GPUComputePassTimestampWrites,
  ): void {
    const pass = enc.beginComputePass(timestampWrites ? { timestampWrites } : {});
    pass.setPipeline(pipeline);
    pass.setBindGroup(
      0,
      device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: buffers.map((buffer, binding) => ({ binding, resource: { buffer } })),
      }),
    );
    pass.dispatchWorkgroups(...grid(invocations));
    pass.end();
  }

  #open(): void {
    if (this.#released) throw new Error("this GPU IPIR+SP table was released");
  }

  /** Requests per invocation for a call of `count` requests, and the padded count. */
  #group(count: number): { g: number; padded: number } {
    const g = Math.min(this.#gMax, count <= 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 4 : this.#gMax);
    return { g, padded: Math.ceil(count / g) * g };
  }

  /** Rows per segment of the first pass for a call: long enough to stay within the budget, short enough to fill the GPU. */
  #segmentRowsFor(groups: number, padded: number): number {
    const fits = SEGMENT_ROWS.filter((s) => this.chunkRows % s === 0);
    if (this.#segmentRows !== undefined) {
      if (!fits.includes(this.#segmentRows as (typeof SEGMENT_ROWS)[number])) {
        throw new Error(`rows per segment ${this.#segmentRows} do not divide the chunks' ${this.chunkRows} rows`);
      }
      return this.#segmentRows;
    }
    const pairs = this.cols / (2 * this.#words);
    const budgetOk = (s: number) => (this.rows / s) * padded * this.cols * 8 <= PARTIAL_BUDGET;
    const candidates = fits.filter(budgetOk);
    if (candidates.length === 0) return fits[0]!;
    for (const s of candidates) if (pairs * groups * (this.rows / s) >= TARGET_INVOCATIONS) return s;
    return candidates[candidates.length - 1]!;
  }

  /** Key-word segments of the packing for a call (a power of two up to 16). */
  #packSegments(groups: number): number {
    if (this.#packSegmentsFixed !== undefined) return this.#packSegmentsFixed;
    const blocks = this.cols / D;
    let s = 1;
    while (s < 16 && blocks * (D / this.#rowsPer) * groups * s < TARGET_INVOCATIONS) s *= 2;
    return s;
  }

  /** Answers `count` requests laid end to end: the same bytes as `IpirServerTable.respond`. */
  async respond(requests: Uint8Array, count: number): Promise<Uint8Array> {
    this.#open();
    checkIpirRequests(requests, count, this.rows, this.setupId);
    const each = ipirRequestBytes(this.rows);
    const digests = Promise.all(Array.from({ length: count }, (_, i) => sha256(requests.subarray(i * each, (i + 1) * each))));
    const words = await this.#run(requests, count, "answer");
    const answerBytes = ipirResponseBytes(this.cols);
    const body = answerBytes - IPIR_ANSWER_OFFSET;
    const packed = new Uint8Array(words.buffer, words.byteOffset, words.byteLength);
    const out = new Uint8Array(count * answerBytes);
    const heads = await digests;
    for (let i = 0; i < count; i++) {
      out.set(answerHead(this.setupId, heads[i]!), i * answerBytes);
      out.set(packed.subarray(i * body, (i + 1) * body), i * answerBytes + IPIR_ANSWER_OFFSET);
    }
    return out;
  }

  /** The first pass alone: `count × cols` values modulo 2^54, request-major (upstream's `dot` per column). */
  async firstPass(requests: Uint8Array, count: number): Promise<BigUint64Array> {
    this.#open();
    checkIpirRequests(requests, count, this.rows, this.setupId);
    const words = await this.#run(requests, count, "first-pass");
    return new BigUint64Array(words.buffer, words.byteOffset, count * this.cols);
  }

  /** The packing product alone (compiled matrices × key words, modulo 2^54): `count × cols` values, request-major. */
  async packingProduct(requests: Uint8Array, count: number): Promise<BigUint64Array> {
    this.#open();
    checkIpirRequests(requests, count, this.rows, this.setupId);
    const words = await this.#run(requests, count, "packing");
    return new BigUint64Array(words.buffer, words.byteOffset, count * this.cols);
  }

  /** Takes the timestamp query set for one call, if it is free. */
  #takeQuerySet(): GPUQuerySet | null {
    if (!this.#querySet || this.#querySetBusy) return null;
    this.#querySetBusy = true;
    return this.#querySet;
  }

  async #run(requests: Uint8Array, count: number, mode: Mode): Promise<Uint32Array> {
    const device = this.#device;
    const U = GPUBufferUsage;
    const { g, padded } = this.#group(count);
    const groups = padded / g;
    const scan = mode !== "packing";
    const pack = mode !== "first-pass";
    const segmentRows = scan ? this.#segmentRowsFor(groups, padded) : 0;
    const scanSegments = scan ? this.rows / segmentRows : 0;
    const packSegments = pack ? this.#packSegments(groups) : 0;
    const segments = scanSegments + packSegments;
    const each = ipirRequestBytes(this.rows);
    const outWords = mode === "answer" ? (count * this.cols * IPIR_RESPONSE_BITS) / 32 : count * this.cols * 2;
    const made: GPUBuffer[] = [];
    let scratch = 0;
    const buffer = (size: number, usage: number) => {
      const b = device.createBuffer({ size: Math.max(4, size), usage });
      made.push(b);
      scratch += size;
      return b;
    };
    const querySet = this.#takeQuerySet();
    const stamp = (begin: number, end: number): GPUComputePassTimestampWrites | undefined =>
      querySet ? { querySet, beginningOfPassWriteIndex: begin, endOfPassWriteIndex: end } : undefined;
    const stampBegin = (i: number): GPUComputePassTimestampWrites | undefined =>
      querySet ? { querySet, beginningOfPassWriteIndex: i } : undefined;
    const stampEnd = (i: number): GPUComputePassTimestampWrites | undefined => (querySet ? { querySet, endOfPassWriteIndex: i } : undefined);
    try {
      // The requests as words, plus two words of zeros for the unpacking's 64-bit reads.
      const raw = buffer(requests.length + 8, U.STORAGE | U.COPY_DST);
      writeView(device, raw, 0, requests);
      const partial = buffer(segments * padded * this.cols * 8, U.STORAGE);
      const out = buffer(outWords * 4, U.STORAGE | U.COPY_SRC);
      const staging = buffer(outWords * 4, U.MAP_READ | U.COPY_DST);
      const enc = device.createCommandEncoder();
      const unpackParams = this.#paramsFor(made, [count, padded, each / 4, scan ? this.rows : IPIR_KEY_WORDS, IPIR_SELECTION_OFFSET * 8, IPIR_KEY_OFFSET * 8]);
      let queryLimbs: GPUBuffer | null = null;
      let keyLimbs: GPUBuffer | null = null;
      // Unpack: one pass for the selection words, one for the key words.
      if (scan) {
        queryLimbs = buffer(this.rows * padded * 16, U.STORAGE);
        GpuIpirTable.#dispatch(device, enc, this.#pipelines.unpackQuery, [raw, queryLimbs, unpackParams], count * this.rows, pack ? stampBegin(0) : stamp(0, 1));
      }
      if (pack) {
        keyLimbs = buffer(IPIR_KEY_WORDS * padded * 16, U.STORAGE);
        const keyParams = this.#paramsFor(made, [count, padded, each / 4, IPIR_KEY_WORDS, IPIR_SELECTION_OFFSET * 8, IPIR_KEY_OFFSET * 8]);
        GpuIpirTable.#dispatch(device, enc, this.#pipelines.unpackKey, [raw, keyLimbs, keyParams], count * IPIR_KEY_WORDS, scan ? stampEnd(1) : stamp(0, 1));
      }
      // First pass: one dispatch per table chunk.
      if (scan && queryLimbs) {
        this.#chunks.forEach((chunk, i) => {
          const params = this.#paramsFor(made, [
            this.cols / (2 * this.#words),
            segmentRows,
            chunk.rows / segmentRows,
            chunk.row0,
            chunk.row0 / segmentRows,
            padded,
            groups,
            this.cols,
            D,
            0,
          ]);
          const first = i === 0;
          const last = i === this.#chunks.length - 1;
          const ts = first && last ? stamp(2, 3) : first ? stampBegin(2) : last ? stampEnd(3) : undefined;
          GpuIpirTable.#dispatch(
            device,
            enc,
            this.#pipelines.scan.get(g)!,
            [chunk.buffer, queryLimbs!, partial, params],
            (this.cols / (2 * this.#words)) * groups * (chunk.rows / segmentRows),
            ts,
          );
        });
      }
      // Packing: one dispatch per matrix buffer.
      if (pack && keyLimbs) {
        this.#matrices.forEach((mc, i) => {
          const params = this.#paramsFor(made, [
            mc.blocks,
            mc.block0,
            packSegments,
            MATRIX_COLS / packSegments,
            padded,
            groups,
            this.cols,
            scanSegments,
            D,
            MATRIX_COLS,
          ]);
          const first = i === 0;
          const last = i === this.#matrices.length - 1;
          const ts = first && last ? stamp(4, 5) : first ? stampBegin(4) : last ? stampEnd(5) : undefined;
          GpuIpirTable.#dispatch(
            device,
            enc,
            this.#pipelines.pack.get(g)!,
            [mc.buffer, keyLimbs!, partial, params],
            mc.blocks * (D / this.#rowsPer) * groups * packSegments,
            ts,
          );
        });
      }
      const finishParams = this.#paramsFor(made, [count, padded, this.cols, segments]);
      if (mode === "answer") {
        GpuIpirTable.#dispatch(device, enc, this.#pipelines.finishAnswer, [partial, out, finishParams], count * (this.cols / 16), stamp(6, 7));
      } else {
        GpuIpirTable.#dispatch(device, enc, this.#pipelines.finishWords, [partial, out, finishParams], count * this.cols, stamp(6, 7));
      }
      enc.copyBufferToBuffer(out, 0, staging, 0, outWords * 4);
      let resolved: GPUBuffer | null = null;
      let stampStaging: GPUBuffer | null = null;
      if (querySet) {
        resolved = buffer(64, U.QUERY_RESOLVE | U.COPY_SRC);
        stampStaging = buffer(64, U.MAP_READ | U.COPY_DST);
        enc.resolveQuerySet(querySet, 0, 8, resolved, 0);
        enc.copyBufferToBuffer(resolved, 0, stampStaging, 0, 64);
      }
      device.queue.submit([enc.finish()]);
      await Promise.all([staging.mapAsync(GPUMapMode.READ), stampStaging?.mapAsync(GPUMapMode.READ)]);
      const result = new Uint32Array(staging.getMappedRange().slice(0));
      staging.unmap();
      if (stampStaging) {
        const t = new BigUint64Array(stampStaging.getMappedRange().slice(0));
        const span = (a: number, b: number) => {
          const [x, y] = [t[a]!, t[b]!];
          return x && y && y > x ? Number(y - x) / 1e6 : null;
        };
        const stages = { unpack: span(0, 1), scan: scan ? span(2, 3) : null, pack: pack ? span(4, 5) : null, finish: span(6, 7) };
        const ran = [stages.unpack, stages.finish, ...(scan ? [stages.scan] : []), ...(pack ? [stages.pack] : [])];
        this.lastStagesMs = { ...stages, total: ran.every((x) => x !== null) ? ran.reduce((a, x) => a! + x!, 0) : null };
      }
      this.lastCall = { count, countPadded: padded, requestsPerInvocation: g, segmentRows, scanSegments, packSegments, scratchBytes: scratch };
      return result;
    } finally {
      if (querySet) this.#querySetBusy = false;
      for (const b of made) b.destroy();
    }
  }

  #paramsFor(made: GPUBuffer[], words: readonly number[]): GPUBuffer {
    return GpuIpirTable.#params(this.#device, made, words);
  }

  /**
   * Preparation's hint columns (FR-062): for every column c and coefficient k, `Σ_r cell[r, c] · M[r, k] mod 2^54`
   * with M the negacyclic expansion of the public query masks (`queryMasks`: `rows` coefficients, polynomial b at
   * `b × 2,048`; `ipir-wgsl.ts`). Returns `cols × 2,048` values as 32-bit word pairs (the bytes of 64-bit
   * little-endian values), column-major: the layout of the add-on's hint columns, block after block. Runs in batches
   * of `batch` coefficients, one submission each.
   */
  async hints(queryMasks: BigUint64Array, options: { readonly batch?: number } = {}): Promise<Uint32Array> {
    this.#open();
    if (queryMasks.length !== this.rows) throw new Error(`a table of ${this.rows} rows has ${this.rows} query-mask coefficients, got ${queryMasks.length}`);
    const batch = options.batch ?? 256;
    if (batch % this.#gMax !== 0 || D % batch !== 0) throw new Error(`a hint batch must divide ${D} and be a multiple of ${this.#gMax}: ${batch}`);
    const device = this.#device;
    const U = GPUBufferUsage;
    // Each polynomial followed by its negation: entry b · 2d + u is poly_b[u − d] for u ≥ d, −poly_b[u] below.
    const polys = this.rows / D;
    const ext = new Uint32Array(polys * 2 * D * 4);
    for (let b = 0; b < polys; b++) {
      for (let u = 0; u < 2 * D; u++) {
        const x = u >= D ? queryMasks[b * D + u - D]! : (Q - queryMasks[b * D + u]!) % Q;
        putLimbs(ext, (b * 2 * D + u) * 4, x);
      }
    }
    const made: GPUBuffer[] = [];
    try {
      const extBuffer = device.createBuffer({ size: ext.byteLength, usage: U.STORAGE | U.COPY_DST });
      made.push(extBuffer);
      writeView(device, extBuffer, 0, ext);
      const values = this.cols * D;
      const chunks = this.#chunks.length;
      const partial = device.createBuffer({ size: chunks * values * 8, usage: U.STORAGE | U.COPY_SRC });
      made.push(partial);
      const groups = batch / this.#gMax;
      for (let k0 = 0; k0 < D; k0 += batch) {
        const enc = device.createCommandEncoder();
        this.#chunks.forEach((chunk, i) => {
          const per = this.cols / (2 * this.#words);
          const params = this.#paramsFor(made, [per, chunk.rows, 1, chunk.row0, i, batch, groups, this.cols, D, k0]);
          GpuIpirTable.#dispatch(device, enc, this.#pipelines.hint, [chunk.buffer, extBuffer, partial, params], per * groups);
        });
        device.queue.submit([enc.finish()]);
        await device.queue.onSubmittedWorkDone();
      }
      let result = partial;
      if (chunks > 1) {
        result = device.createBuffer({ size: values * 8, usage: U.STORAGE | U.COPY_SRC });
        made.push(result);
        const enc = device.createCommandEncoder();
        const params = this.#paramsFor(made, [1, 1, values, chunks]);
        GpuIpirTable.#dispatch(device, enc, this.#pipelines.finishWords, [partial, result, params], values);
        device.queue.submit([enc.finish()]);
      }
      const staging = device.createBuffer({ size: values * 8, usage: U.MAP_READ | U.COPY_DST });
      made.push(staging);
      const enc = device.createCommandEncoder();
      enc.copyBufferToBuffer(result, 0, staging, 0, values * 8);
      device.queue.submit([enc.finish()]);
      await staging.mapAsync(GPUMapMode.READ);
      const out = new Uint32Array(staging.getMappedRange().slice(0));
      staging.unmap();
      return out;
    } finally {
      for (const b of made) b.destroy();
    }
  }

  /** Frees the table's GPU buffers. The device stays open (it belongs to the caller). Idempotent. */
  release(): void {
    if (this.#released) return;
    this.#released = true;
    for (const c of this.#chunks) c.buffer.destroy();
    for (const m of this.#matrices) m.buffer.destroy();
    this.#querySet?.destroy();
  }
}
