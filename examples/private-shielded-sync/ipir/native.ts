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
 * - `IpirServerTable.release()`: frees the table (an answer in flight keeps it until it finishes). A table that is
 *   garbage-collected without `release()` is released then.
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
  release(handle: number): boolean;
  tableCount(): number;
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

  /** Frees the table; an answer in flight keeps it until it finishes. Idempotent. */
  release(): void {
    if (this.#handle === undefined) return;
    unreleased.unregister(this);
    this.#addon.release(this.#handle);
    this.#handle = undefined;
  }
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
