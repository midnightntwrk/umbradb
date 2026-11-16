/**
 * IPIR+SP's server side behind the scheme seam (`./scheme.ts`, spec 00058 FR-010 to FR-015, FR-022, FR-023), over the
 * native add-on (`../ipir/native.ts`): the Rust implementation builds each table and answers its requests on libuv's
 * thread pool, never on the main thread.
 *
 * - **Layout** (`./ipir/shape.ts`, `./ipir/encode.ts`): rows × cols 16-bit cells; a group is a row of `perGroup`
 *   records; the shape is the one whose request and answer are the fewest bytes. Cells are written column-major in
 *   JavaScript once, as the table file (no header), and dropped once written: the add-on reads the file itself.
 * - **Setup** (FR-012, FR-013): the table's public seed is `deriveSeed(name, file digest)` as under SimplePIR, and the
 *   upstream setup's snapshot input is the file digest. The build is deterministic, so the same records give the same
 *   file, masks and manifest.
 * - **Public artifact** (FR-014): the table's published masks, `ipirMasksBytes(cols)` bytes.
 * - **Build check** (FR-015): the add-on reads sampled rows back through a real request, answer and decode and rejects
 *   a table that does not decode; its measurements, the largest phase error against the limit among them, are the
 *   setup step's statistics.
 * - **Calls**: a request is `ipirRequestBytes(rows)` bytes, an answer `ipirResponseBytes(cols)`; the add-on answers
 *   the requests of a call one after another.
 * - **Across threads**: the build runs in a worker thread; a table crosses to the server's thread as its handle in the
 *   add-on's registry (which is the process's). The transfer owns the table until `adoptTable` takes it (checking the
 *   handle's shape with the add-on) or `discardTransfer` frees it.
 * - **At start**: a stored table is built again from its file, and refused unless its masks come out equal to the
 *   stored ones.
 * - **Padded builds** (Q57): every cell starts as a uniformly random 16-bit value, then the records are written.
 *
 * The add-on is `../ipir/pss-ipir.node` (built per machine by `ipir/build.sh native`), or the file the environment
 * variable `PSS_IPIR_ADDON` names, read when the scheme is opened. Without it the scheme is unavailable: its builds are
 * refused and SimplePIR keeps working.
 */

import { readFileSync, statSync } from "node:fs";
import { adoptIpirTable, buildIpirTable, type IpirAddon, type IpirBuildReport, IPIR_ADDON_PATH, type IpirServerTable, ipirAddonAvailable, loadIpirAddon } from "../ipir/native.ts";
import { IPIR_DIGIT_BITS, IPIR_DIGITS, IPIR_MASK_BITS, IPIR_P_BITS, IPIR_Q_BITS, IPIR_QUERY_BITS, IPIR_RESPONSE_BITS, IPIR_RING } from "../ipir/sizes.ts";
import { positionOf } from "./grid.ts";
import { putIpirRecord } from "./ipir/encode.ts";
import { bucketIpirShape, estimatedBucketIpirShape, IPIR_CELL_BYTES, IPIR_MAX_REQUEST_BYTES, type IpirBucketShape, type IpirShape, positionalIpirShape } from "./ipir/shape.ts";
import { deriveSeed, type TableName } from "./matrix.ts";
import { type EncodedTable, RequestRefused, SchemeUnavailable, type ServerScheme, type ServerSchemeEntry, type ServerTable, type TableSource, type TableSpec, type TableTransfer } from "./scheme.ts";
import { fromHex, type IpirSpParams, type PirTableRef, toHex } from "../shared/manifest.ts";

/** IPIR+SP's parameters as the manifest records them (`Manifest.pir`). */
export const IPIR_SP_PARAMS: IpirSpParams = Object.freeze({
  ring: IPIR_RING,
  qBits: IPIR_Q_BITS,
  pBits: IPIR_P_BITS,
  digitBits: IPIR_DIGIT_BITS,
  digits: IPIR_DIGITS,
  maskBits: IPIR_MASK_BITS,
  queryBits: IPIR_QUERY_BITS,
  responseBits: IPIR_RESPONSE_BITS,
});

/** Bytes of compiled packing matrices the add-on keeps per 2,048 columns (measured, phase 1). */
export const IPIR_PACKING_BYTES_PER_BLOCK = 33_587_200;
/** Scratch of one output block being prepared (about 250–300 MB, measured upstream and in phase 1). */
export const IPIR_PREPARE_SCRATCH_BYTES = 300 * 2 ** 20;

/** Where the add-on is looked for: `PSS_IPIR_ADDON` when set, else `ipir/pss-ipir.node`. */
export function ipirAddonPath(): string {
  const set = process.env.PSS_IPIR_ADDON;
  return set === undefined || set === "" ? IPIR_ADDON_PATH : set;
}

/** An IPIR+SP table on its way from the build's thread to the server's: its handle in the add-on's registry. */
export interface IpirSpTransfer extends TableTransfer {
  readonly scheme: "ipir-sp";
  readonly handle: number;
  readonly rows: number;
  readonly cols: number;
}

function transferOf(t: TableTransfer): IpirSpTransfer {
  if (t.scheme !== "ipir-sp") throw new Error(`a ${t.scheme} table is not an IPIR+SP table`);
  return t as IpirSpTransfer;
}

/** The setup step's statistics: the add-on's report as numbers (FR-015: the phase error against its limit). */
function statsOf(r: IpirBuildReport): Readonly<Record<string, number>> {
  return {
    rows: r.rows,
    cols: r.cols,
    setupMs: r.setupMs,
    readMs: r.readMs,
    hintsMs: r.hintsMs,
    packingMs: r.packingMs,
    layoutMs: r.layoutMs,
    prepareMs: r.prepareMs,
    publishMs: r.publishMs,
    checkMs: r.checkMs,
    totalMs: r.totalMs,
    tableBytes: r.tableBytes,
    packingBytes: r.packingBytes,
    masksBytes: r.masksBytes,
    checkedRows: r.checkedRows.length,
    maxPhaseError: r.maxPhaseError,
    maxPhaseErrorLog2: r.maxPhaseErrorLog2,
    phaseLimitLog2: r.phaseLimitLog2,
  };
}

/**
 * The first bytes of every request of the profile (upstream's two-mask query encoding, `request_magic` in
 * `ipir-native-client`), followed by the 32-byte setup identifier of the table it was made for.
 */
const REQUEST_MAGIC = new TextEncoder().encode("RNQ3");

/** A table the add-on holds, answered through it. */
class IpirSpTable implements ServerTable {
  readonly requestBytes: number;
  readonly responseBytes: number;
  readonly heldBytes: number;
  readonly #table: IpirServerTable;
  /** The magic and the setup identifier every request to this table starts with. */
  readonly #prefix: Uint8Array;

  constructor(table: IpirServerTable, heldBytes: number, setupId: Uint8Array) {
    if (setupId.length !== 32) throw new Error(`a setup identifier is 32 bytes, got ${setupId.length}`);
    this.#table = table;
    this.requestBytes = table.sizes.requestBytes;
    this.responseBytes = table.sizes.responseBytes;
    this.heldBytes = heldBytes;
    this.#prefix = new Uint8Array(36);
    this.#prefix.set(REQUEST_MAGIC, 0);
    this.#prefix.set(setupId, 4);
  }

  /** Refuses, before any work, a call holding a request made for another table (another setup) or no request at all. */
  async answer(requests: Uint8Array, count: number): Promise<Uint8Array> {
    if (requests.length === count * this.requestBytes) {
      for (let q = 0; q < count; q++) {
        const at = q * this.requestBytes;
        if (!Buffer.from(requests.buffer, requests.byteOffset + at, 36).equals(this.#prefix)) {
          throw new RequestRefused(`request ${q} of the call is not a request of this IPIR+SP table (another table's setup, or not a request)`);
        }
      }
    }
    return this.#table.respond(requests, count);
  }

  release(): void {
    this.#table.release();
  }
}

/** Throws unless the manifest's entry is the shape the stored or transferred table is. */
function checkRef(ref: PirTableRef, rows: number, cols: number): void {
  const l = ref.layout;
  if (l.rows !== rows || l.cols !== cols || ref.groups !== rows || ref.perGroup !== Math.floor(cols / l.cellsPerRecord)) {
    throw new Error(`the IPIR+SP table (${rows} × ${cols}) is not the manifest's (${l.rows} × ${l.cols})`);
  }
}

class IpirSpServer implements ServerScheme {
  readonly name = "ipir-sp" as const;
  readonly params = IPIR_SP_PARAMS;
  readonly #addon: IpirAddon;

  constructor(addon: IpirAddon) {
    this.#addon = addon;
  }

  encodeTable(source: TableSource): EncodedTable {
    const shape: IpirShape | IpirBucketShape = source.name === "nullifier" ? bucketIpirShape(source) : positionalIpirShape(source.records, source.recordBytes, source.name);
    const { rows, cols, cellsPerRecord: e, perGroup } = shape;
    // One copy in JavaScript, written as the table file and dropped once written (`setup` reads the file).
    let cells: Uint16Array | null = new Uint16Array(rows * cols);
    if (source.name === "nullifier") {
      const bits = (shape as IpirBucketShape).bucketBits;
      const c = cells;
      source.fill(bits, (bucket, slot, record) => putIpirRecord(c, rows, bucket, slot, e, record));
    } else {
      if (source.noise !== undefined) source.noise(new Uint8Array(cells.buffer));
      const c = cells;
      source.fill((index, record) => {
        const { column: group, slot } = positionOf(index, perGroup);
        putIpirRecord(c, rows, group, slot, e, record);
      });
    }
    const file: Uint8Array[] = [new Uint8Array(cells.buffer)];
    const addon = this.#addon;
    const name: TableName = source.name;
    return {
      groups: rows,
      perGroup,
      ...(source.name === "nullifier" ? { bucketBits: (shape as IpirBucketShape).bucketBits } : {}),
      file,
      async setup(fileDigest, filePath) {
        // The file holds the cells now: drop them before the add-on reads its own copy.
        const buffer = cells?.buffer as (ArrayBuffer & { transfer?(length: number): ArrayBuffer }) | undefined;
        cells = null;
        file.length = 0;
        buffer?.transfer?.(0);
        const seed = deriveSeed(name, fileDigest);
        const built = await buildIpirTable({ cells: filePath, rows, cols, seed, snapshot: fileDigest }, addon);
        const transfer: IpirSpTransfer = { scheme: "ipir-sp", handle: built.table.detach(), rows, cols };
        return {
          public: [built.masks],
          layout: { rows, cols, cellsPerRecord: e, seed: toHex(seed) },
          transfer,
          stats: statsOf(built.report),
        };
      },
    };
  }

  async adoptTable(ref: PirTableRef, transfer: TableTransfer): Promise<ServerTable> {
    const t = transferOf(transfer);
    checkRef(ref, t.rows, t.cols);
    const { table, info } = adoptIpirTable(t.handle, t.rows, t.cols, this.#addon);
    return new IpirSpTable(table, info.tableBytes + info.packingBytes, info.setupId);
  }

  discardTransfer(transfer: TableTransfer): void {
    this.#addon.release(transferOf(transfer).handle);
  }

  /** Builds the table again from its file (the add-on reads it) and checks its masks against the stored ones. */
  async loadTable(ref: PirTableRef, path: string, publicPath: string): Promise<ServerTable> {
    const { rows, cols, seed } = ref.layout;
    checkRef(ref, rows, cols);
    const expected = rows * cols * IPIR_CELL_BYTES;
    if (statSync(path).size !== expected) throw new Error(`${path} must be ${expected} bytes`);
    const built = await buildIpirTable({ cells: path, rows, cols, seed: fromHex(seed, 32), snapshot: fromHex(ref.digest, 32) }, this.#addon);
    const stored = readFileSync(publicPath);
    if (!stored.equals(built.masks)) {
      built.table.release();
      throw new Error(`the masks set up again from ${path} differ from the stored ones (${publicPath})`);
    }
    // The masks start with their magic and the table's setup identifier.
    return new IpirSpTable(built.table, built.report.tableBytes + built.report.packingBytes, built.masks.subarray(4, 36));
  }

  /** The add-on has no threads of its own to stop; tables and transfers are not freed (see `ServerScheme.close`). */
  async close(): Promise<void> {}
}

/** About the memory building these tables holds at once (see `IPIR_SP_SERVER.buildBytes`). */
function ipirBuildBytes(tables: readonly TableSpec[]): number {
  let held = 0;
  let transient = 0;
  for (const t of tables) {
    const shape = t.name === "nullifier" ? estimatedBucketIpirShape(t.records, t.recordBytes) : positionalIpirShape(t.records, t.recordBytes, t.name);
    const cells = shape.rows * shape.cols * IPIR_CELL_BYTES;
    // Kept until the snapshot is served: the add-on's cells and compiled packing.
    held += cells + IPIR_PACKING_BYTES_PER_BLOCK * (shape.cols / IPIR_RING);
    // While one table is built: its cells in JavaScript (dropped once written) and one block's preparation.
    transient = Math.max(transient, cells + IPIR_PREPARE_SCRATCH_BYTES);
  }
  return held + transient;
}

/** IPIR+SP as the server module registers it (`./server-schemes.ts`). */
export const IPIR_SP_SERVER: ServerSchemeEntry = {
  name: "ipir-sp",
  // The longest request of a table of the most rows allowed (32,768, review F4): 228,388 bytes.
  maxRequestBytes: IPIR_MAX_REQUEST_BYTES,
  /**
   * The add-on's cells and compiled packing (33,587,200 bytes per 2,048 columns) of every table, plus the largest
   * table's cells in JavaScript and one block's preparation scratch (300 MiB), which are freed before the next table.
   * Throws {@link TableTooLarge} for a table no shape holds.
   */
  buildBytes: ipirBuildBytes,
  async open(): Promise<ServerScheme> {
    const path = ipirAddonPath();
    if (!ipirAddonAvailable(path)) throw new SchemeUnavailable("ipir-sp", `its native add-on is not built (${path}): run examples/private-shielded-sync/ipir/build.sh native`);
    let addon: IpirAddon;
    try {
      addon = loadIpirAddon(path);
    } catch (cause) {
      throw new SchemeUnavailable("ipir-sp", cause instanceof Error ? cause.message : String(cause));
    }
    return new IpirSpServer(addon);
  },
};

