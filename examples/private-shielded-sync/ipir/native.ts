/**
 * The IPIR+SP server side in Node: a typed wrapper over the native add-on `pss-ipir.node`, built for this machine by
 * `build.sh native` from `node/` (N-API; the binary is not committed). Builds and answers run on libuv's thread pool,
 * never on the main thread.
 *
 * Interface:
 *
 * - `ipirSizes(rows, cols)`, `ipirRequestBytes(rows)`, `ipirResponseBytes(cols)`, `ipirMasksBytes(cols)`,
 *   `checkIpirShape(rows, cols)` and the profile constants: pure functions of the shape (`sizes.ts`, re-exported).
 * - `ipirAddonAvailable(path?)`: whether the add-on file exists.
 * - `loadIpirAddon(path?)`: loads the add-on; throws an error naming `build.sh native` when the file is absent, and
 *   refuses an add-on built for another profile.
 * - `buildIpirTable({ cells, rows, cols, seed, snapshot, options? }, addon?) → Promise<{ table, masks, report }>`:
 *   `cells` is a `Uint16Array` of `rows × cols` column-major cells (index `col × rows + row`), or the path of a raw
 *   file of the same cells as little-endian 16-bit words (read by the worker thread, so a 1–2 GB table never passes
 *   through the JavaScript heap). `seed` and `snapshot` are 32 bytes each. `masks` are the table's published masks
 *   (`ipirMasksBytes(cols)` bytes), `report` an {@link IpirBuildReport}. The build reads back sampled rows through a
 *   real request, answer and decode and rejects a table whose rows do not decode (phase error ≥ 2^37).
 * - `IpirServerTable.respond(requests, count) → Promise<Uint8Array>`: `count` requests laid end to end (each
 *   `ipirRequestBytes(rows)` bytes) → `count` answers laid end to end (each `ipirResponseBytes(cols)` bytes), same
 *   order. Wrong lengths reject before any work.
 * - `IpirServerTable.respondTimed(requests, count) → Promise<{ answers, stages }>`: the same answers, with upstream's
 *   timing of each one's stages (parse, first pass, packing, encoding).
 * - `IpirServerTable.release()`: frees the table (an answer in flight keeps it until it finishes). A table that is
 *   garbage-collected without `release()` is released then.
 * - `IpirServerTable.detach() → handle` and `adoptIpirTable(handle, rows, cols) → { table, info }`: a table built in
 *   one thread (the build's worker) answered from another (the server's). The add-on's registry belongs to the
 *   process, so a handle is valid in every thread; `tableInfo(handle)` describes the table under it, or null.
 * - `ipirGpuReference({ cellsPath, rows, cols, seed, snapshot }, requests, count, { hints? })`: the public values a GPU
 *   responder needs (compiled packing matrices, query masks, hint columns) and upstream's unrounded first pass and
 *   packing product for the requests, to set up and check `gpu/ipir.ts`.
 */

import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  checkIpirShape,
  IPIR_DIGIT_BITS,
  IPIR_DIGITS,
  IPIR_KEY_BYTES,
  IPIR_MASK_BITS,
  IPIR_MAX_CELLS,
  IPIR_MAX_ROWS,
  IPIR_P_BITS,
  IPIR_PHASE_LIMIT_LOG2,
  IPIR_Q_BITS,
  IPIR_QUERY_BITS,
  IPIR_RESPONSE_BITS,
  IPIR_RING,
  ipirSizes,
  type IpirSizes,
} from "./sizes.ts";

export {
  checkIpirShape,
  IPIR_PHASE_LIMIT_LOG2,
  IPIR_RING,
  ipirMasksBytes,
  ipirRequestBytes,
  ipirResponseBytes,
  ipirSizes,
  type IpirSizes,
} from "./sizes.ts";

/** Where `build.sh native` puts the add-on. */
export const IPIR_ADDON_PATH = fileURLToPath(new URL("./pss-ipir.node", import.meta.url));

/** How a table is built. */
export interface IpirBuildOptions {
  /** Output blocks of 2,048 columns prepared at once (default 1; each in flight needs about 250–300 MB). */
  readonly concurrentBlocks?: number;
  /** Rows read back before the table is accepted (default 3, at least 1): the first, the last, and drawn rows. */
  readonly checkRows?: number;
}

/** What a build measured. Times in milliseconds; "summed" times add up the output blocks (block-milliseconds). */
export interface IpirBuildReport {
  readonly rows: number;
  readonly cols: number;
  /** Expanding the public setup. */
  readonly setupMs: number;
  /** Copying the cells from JavaScript, or reading the cell file. */
  readonly readMs: number;
  /** Hints (cells × public query masks), summed. */
  readonly hintsMs: number;
  /** Packing preparation, summed. */
  readonly packingMs: number;
  /** Re-tiling the cells for the host's scan (0 where the column-major layout is kept). */
  readonly layoutMs: number;
  /** Upstream's whole preparation, wall time. */
  readonly prepareMs: number;
  readonly publishMs: number;
  /** The read-back of the checked rows. */
  readonly checkMs: number;
  /** From the call to the table being ready, wall time. */
  readonly totalMs: number;
  /** Bytes of the cells in memory. */
  readonly tableBytes: number;
  /** Bytes of the compiled packing matrices in memory. */
  readonly packingBytes: number;
  readonly masksBytes: number;
  /** The rows read back, in increasing order. */
  readonly checkedRows: readonly number[];
  /** The largest phase error over the checked rows' cells, and its log2. */
  readonly maxPhaseError: number;
  readonly maxPhaseErrorLog2: number;
  /** Decoding is correct below 2 to this power (37). */
  readonly phaseLimitLog2: number;
}

interface RawBuilt {
  readonly handle: number;
  readonly masks: Uint8Array;
  readonly report: IpirBuildReport;
}

/** The add-on's exports (`node/src/lib.rs`). */
export interface IpirAddon {
  profile(): {
    ring: number;
    qBits: number;
    pBits: number;
    digitBits: number;
    digits: number;
    maskBits: number;
    queryBits: number;
    responseBits: number;
    keyBytes: number;
    maxCells: number;
    maxRows: number;
    phaseLimitLog2: number;
  };
  sizes(rows: number, cols: number): { requestBytes: number; responseBytes: number; masksBytes: number };
  buildTableFromCells(
    cells: Uint16Array,
    rows: number,
    cols: number,
    seed: Uint8Array,
    snapshot: Uint8Array,
    options?: IpirBuildOptions,
  ): Promise<RawBuilt>;
  buildTableFromFile(
    path: string,
    rows: number,
    cols: number,
    seed: Uint8Array,
    snapshot: Uint8Array,
    options?: IpirBuildOptions,
  ): Promise<RawBuilt>;
  respond(handle: number, requests: Uint8Array, count: number): Promise<Uint8Array>;
  /** As `respond`, with upstream's timing of each answer's stages (added for the GPU check; absent in older builds). */
  respondTimed?(handle: number, requests: Uint8Array, count: number): Promise<{ answers: Uint8Array; stages: IpirAnswerStages[] }>;
  release(handle: number): boolean;
  tableCount(): number;
  tableInfo(handle: number): IpirTableInfo | null;
}

/** Upstream's own timing of one answer's stages (`NativeTiming`), in milliseconds. */
export interface IpirAnswerStages {
  /** Parsing the request and lifting its words. */
  readonly deserializeMs: number;
  /** The first pass over the table. */
  readonly matrixVectorMs: number;
  /** The packing of every output block. */
  readonly packingMs: number;
  /** Rounding and encoding the answer. */
  readonly serializationMs: number;
}

/** A held table as the add-on describes it (`tableInfo`). */
export interface IpirTableInfo {
  readonly rows: number;
  readonly cols: number;
  /** The setup identifier (32 bytes). */
  readonly setupId: Uint8Array;
  /** Bytes of the cells and of the compiled packing matrices in memory. */
  readonly tableBytes: number;
  readonly packingBytes: number;
}

/** Whether the add-on file exists (it is built by `build.sh native`, not committed). */
export function ipirAddonAvailable(path: string = IPIR_ADDON_PATH): boolean {
  return existsSync(path);
}

const loaded = new Map<string, IpirAddon>();

/** Loads the add-on (once per path). Throws when the file is absent or was built for another profile. */
export function loadIpirAddon(path: string = IPIR_ADDON_PATH): IpirAddon {
  const cached = loaded.get(path);
  if (cached) return cached;
  if (!existsSync(path)) {
    throw new Error(
      `the IPIR+SP native add-on is not built (${path}): run examples/private-shielded-sync/ipir/build.sh native`,
    );
  }
  const addon = createRequire(import.meta.url)(path) as IpirAddon;
  const profile = addon.profile();
  const expected = {
    ring: IPIR_RING,
    qBits: IPIR_Q_BITS,
    pBits: IPIR_P_BITS,
    digitBits: IPIR_DIGIT_BITS,
    digits: IPIR_DIGITS,
    maskBits: IPIR_MASK_BITS,
    queryBits: IPIR_QUERY_BITS,
    responseBits: IPIR_RESPONSE_BITS,
    keyBytes: IPIR_KEY_BYTES,
    maxCells: IPIR_MAX_CELLS,
    maxRows: IPIR_MAX_ROWS,
    phaseLimitLog2: IPIR_PHASE_LIMIT_LOG2,
  };
  for (const [key, value] of Object.entries(expected)) {
    const got = (profile as Record<string, number>)[key];
    if (got !== value) {
      throw new Error(`the IPIR+SP add-on at ${path} has ${key} ${got}, expected ${value}: rebuild it with build.sh native`);
    }
  }
  loaded.set(path, addon);
  return addon;
}

/** Releases tables that were garbage-collected without `release()`. */
const unreleased = new FinalizationRegistry<{ addon: IpirAddon; handle: number }>(({ addon, handle }) => {
  addon.release(handle);
});

/** A built table held by the add-on. */
export class IpirServerTable {
  readonly rows: number;
  readonly cols: number;
  readonly sizes: IpirSizes;
  readonly #addon: IpirAddon;
  #handle: number | undefined;

  /** Use {@link buildIpirTable}. */
  constructor(addon: IpirAddon, handle: number, rows: number, cols: number) {
    this.#addon = addon;
    this.#handle = handle;
    this.rows = rows;
    this.cols = cols;
    this.sizes = ipirSizes(rows, cols);
    unreleased.register(this, { addon, handle }, this);
  }

  get released(): boolean {
    return this.#handle === undefined;
  }

  /** Answers `count` requests laid end to end; resolves to the answers laid end to end, in the same order. */
  async respond(requests: Uint8Array, count: number): Promise<Uint8Array> {
    if (this.#handle === undefined) throw new Error("this IPIR+SP table was released");
    if (!Number.isSafeInteger(count) || count < 1) throw new Error(`a call holds at least one request, got ${count}`);
    if (requests.length !== count * this.sizes.requestBytes) {
      throw new Error(
        `${count} requests to this table are ${count * this.sizes.requestBytes} bytes, got ${requests.length}`,
      );
    }
    return await this.#addon.respond(this.#handle, requests, count);
  }

  /**
   * As {@link IpirServerTable.respond}, with upstream's timing of each answer's stages (parse, first pass, packing,
   * encoding); the requests are answered one after another, as `respond` does.
   */
  async respondTimed(requests: Uint8Array, count: number): Promise<{ answers: Uint8Array; stages: IpirAnswerStages[] }> {
    if (this.#handle === undefined) throw new Error("this IPIR+SP table was released");
    if (typeof this.#addon.respondTimed !== "function") {
      throw new Error("this IPIR+SP add-on has no respondTimed export: rebuild it with build.sh native");
    }
    if (!Number.isSafeInteger(count) || count < 1) throw new Error(`a call holds at least one request, got ${count}`);
    if (requests.length !== count * this.sizes.requestBytes) {
      throw new Error(`${count} requests to this table are ${count * this.sizes.requestBytes} bytes, got ${requests.length}`);
    }
    return await this.#addon.respondTimed(this.#handle, requests, count);
  }

  /** Frees the table; an answer in flight keeps it until it finishes. Idempotent. */
  release(): void {
    if (this.#handle === undefined) return;
    unreleased.unregister(this);
    this.#addon.release(this.#handle);
    this.#handle = undefined;
  }

  /**
   * Gives up this object's hold on the table without freeing it, and returns its handle: the caller now owns the table
   * and must hand the handle to {@link adoptIpirTable} (in any thread of the process: the add-on's registry is the
   * process's) or release it. This object refuses every call after.
   */
  detach(): number {
    if (this.#handle === undefined) throw new Error("this IPIR+SP table was released");
    const handle = this.#handle;
    unreleased.unregister(this);
    this.#handle = undefined;
    return handle;
  }
}

/**
 * Takes over a table by its handle (one {@link IpirServerTable.detach} gave, possibly in another thread). Throws, and
 * leaves the table as it was, when the add-on holds no table under the handle or it is not `rows × cols`.
 */
export function adoptIpirTable(handle: number, rows: number, cols: number, addon: IpirAddon = loadIpirAddon()): { table: IpirServerTable; info: IpirTableInfo } {
  const info = addon.tableInfo(handle);
  if (info === null) throw new Error(`the IPIR+SP add-on holds no table under handle ${handle}`);
  if (info.rows !== rows || info.cols !== cols) {
    throw new Error(`the IPIR+SP table under handle ${handle} is ${info.rows} × ${info.cols}, not ${rows} × ${cols}`);
  }
  return { table: new IpirServerTable(addon, handle, rows, cols), info };
}

/** What to build a table from. */
export interface IpirTableInput {
  /** `rows × cols` column-major cells, or the path of a raw file of them as little-endian 16-bit words. */
  readonly cells: Uint16Array | string;
  readonly rows: number;
  readonly cols: number;
  /** The table's public seed, 32 bytes. */
  readonly seed: Uint8Array;
  /** The snapshot's digest, 32 bytes. */
  readonly snapshot: Uint8Array;
  readonly options?: IpirBuildOptions;
}

/** A built table, its published masks and the build's report. */
export interface IpirBuiltTable {
  readonly table: IpirServerTable;
  readonly masks: Uint8Array;
  readonly report: IpirBuildReport;
}

/** One output block of 2,048 columns as a GPU responder takes it (`gpu/ipir.ts`). Public values only. */
export interface IpirGpuBlock {
  /** The compiled packing matrix: 2,048 rows × 4,096 columns, row-major, signed (centred modulo 2^54). */
  readonly matrix: Int32Array;
  /** The hint columns, if asked for: 2,048 columns × 2,048 coefficients modulo 2^54 (column c at `c × 2,048`). */
  readonly hints: BigUint64Array | null;
}

/**
 * Upstream's public preparation of a table and its unrounded intermediate results for given requests, to set up and
 * check a GPU responder (`gpu/ipir.ts`, `gpu/ipir-check.ts`). Every value is public.
 */
export interface IpirGpuReference {
  readonly setupId: Uint8Array;
  /** The published masks: equal to {@link buildIpirTable}'s for the same input. */
  readonly masks: Uint8Array;
  /** The public query masks: `rows` coefficients, polynomial b at `b × 2,048`. */
  readonly queryMasks: BigUint64Array;
  readonly blocks: readonly IpirGpuBlock[];
  /** Upstream's first pass for each request: `count × cols` values modulo 2^54, request-major. */
  readonly firstPass: BigUint64Array;
  /** Upstream's packing product for each request, before the first pass is added: `count × cols` values. */
  readonly packing: BigUint64Array;
}

interface RawGpuReference {
  readonly setupId: Uint8Array;
  readonly masks: Uint8Array;
  readonly queryMasks: Uint8Array;
  readonly blocks: readonly { readonly matrix: Uint8Array; readonly hints?: Uint8Array | null }[];
  readonly firstPass: Uint8Array;
  readonly packing: Uint8Array;
}

/** The add-on's export for the GPU check (`node/src/lib.rs`, `gpuReference`). */
interface IpirGpuExports {
  gpuReference(
    path: string,
    rows: number,
    cols: number,
    seed: Uint8Array,
    snapshot: Uint8Array,
    requests: Uint8Array,
    count: number,
    withHints: boolean,
  ): Promise<RawGpuReference>;
}

/** A typed view of `bytes`, copied when its offset is not aligned for the type. */
function viewOf<T>(bytes: Uint8Array, ctor: { new (b: ArrayBuffer, o: number, n: number): T; BYTES_PER_ELEMENT: number }): T {
  const size = ctor.BYTES_PER_ELEMENT;
  if (bytes.byteLength % size !== 0) throw new Error(`${bytes.byteLength} bytes are not whole ${size}-byte words`);
  const aligned = bytes.byteOffset % size === 0 && bytes.buffer instanceof ArrayBuffer ? bytes : bytes.slice();
  return new ctor(aligned.buffer as ArrayBuffer, aligned.byteOffset, aligned.byteLength / size);
}

/**
 * Repeats upstream's preparation of the table in `cellsPath` (raw column-major 16-bit cells, as
 * {@link buildIpirTable} reads a path) and returns its public values and, for `count` requests laid end to end,
 * upstream's unrounded first pass and packing product (`pss_ipir_core::gpu_reference`). Off the main thread. With
 * `hints`, also every block's hint columns (32 MiB per block). Costs about one table build.
 */
export async function ipirGpuReference(
  input: { readonly cellsPath: string; readonly rows: number; readonly cols: number; readonly seed: Uint8Array; readonly snapshot: Uint8Array },
  requests: Uint8Array,
  count: number,
  options: { readonly hints?: boolean } = {},
  addon: IpirAddon = loadIpirAddon(),
): Promise<IpirGpuReference> {
  const exports = addon as unknown as Partial<IpirGpuExports>;
  if (typeof exports.gpuReference !== "function") {
    throw new Error("this IPIR+SP add-on has no gpuReference export: rebuild it with build.sh native");
  }
  const { cellsPath, rows, cols, seed, snapshot } = input;
  checkIpirShape(rows, cols);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error(`a request count must be a whole number, got ${count}`);
  const raw = await exports.gpuReference(cellsPath, rows, cols, seed, snapshot, requests, count, options.hints ?? false);
  return {
    setupId: raw.setupId,
    masks: raw.masks,
    queryMasks: viewOf(raw.queryMasks, BigUint64Array),
    blocks: raw.blocks.map((b) => ({
      matrix: viewOf(b.matrix, Int32Array),
      hints: b.hints ? viewOf(b.hints, BigUint64Array) : null,
    })),
    firstPass: viewOf(raw.firstPass, BigUint64Array),
    packing: viewOf(raw.packing, BigUint64Array),
  };
}

/** Builds a table off the main thread. Rejects a bad shape, input or option, and a table whose checked rows do not decode. */
export async function buildIpirTable(input: IpirTableInput, addon: IpirAddon = loadIpirAddon()): Promise<IpirBuiltTable> {
  const { cells, rows, cols, seed, snapshot, options } = input;
  checkIpirShape(rows, cols);
  if (seed.length !== 32) throw new Error(`the seed must be 32 bytes, got ${seed.length}`);
  if (snapshot.length !== 32) throw new Error(`the snapshot digest must be 32 bytes, got ${snapshot.length}`);
  for (const [name, value] of Object.entries(options ?? {})) {
    if (value !== undefined && (!Number.isSafeInteger(value) || value < 1 || value > 0xffff_ffff)) {
      throw new Error(`the build option ${name} must be a positive integer, got ${value}`);
    }
  }
  const built =
    typeof cells === "string"
      ? await addon.buildTableFromFile(cells, rows, cols, seed, snapshot, options)
      : await addon.buildTableFromCells(cells, rows, cols, seed, snapshot, options);
  return {
    table: new IpirServerTable(addon, built.handle, rows, cols),
    masks: built.masks,
    report: built.report,
  };
}
