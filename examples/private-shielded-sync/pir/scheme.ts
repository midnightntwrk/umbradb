/**
 * The seam between the proof of concept and a PIR scheme (spec FR-001 to FR-004, FR-022).
 *
 * A scheme decides how a table is laid out, what its files hold and what the bytes of a call's requests and answers
 * are. Everything else is the proof of concept's own and the same for every scheme: which records go in which table,
 * the padding of calls with random groups, the 40-byte call header, the routes and the rest of the manifest.
 *
 * - **Groups.** A table holds records of one size in groups: one request selects one group, and its answer gives back
 *   all of the group's `perGroup` records. Record `i` of a positional table (read, path) is slot `i mod perGroup` of
 *   group `⌊i / perGroup⌋`; bucket `j` of the nullifier table is group `j`. SimplePIR's group is a column of its grid;
 *   IPIR+SP's is a row.
 * - **Files.** Each table has two artifacts, both served by digest: the table file, which the server loads at start,
 *   and a public artifact every wallet downloads once per snapshot (SimplePIR's setup data, IPIR+SP's masks).
 * - **Calls.** After the 40-byte header, a call body is `count` requests of `requestBytes` each and its answer `count`
 *   responses of `responseBytes` each. The table sets both; the wire code only checks lengths against them.
 *
 * The `Multiplier` (`./multiply.ts`) sits below this seam and stays SimplePIR's: it carries 32-bit words.
 *
 * A scheme is registered twice: its server side in `./server-schemes.ts` (Node.js only) and its wallet side in
 * `./wallet-schemes.ts` (also loaded by the page's worker). This file has no Node.js import, so the page can load it.
 */

import type { Manifest, NullifierTableRef, PirTableRef, SchemeParams, TableLayout } from "../shared/manifest.ts";
import type { IpirWorkers } from "../ipir/engine.ts";
import type { TableName } from "./matrix.ts";
import type { Multiplier } from "./multiply.ts";

/** Every scheme name a manifest or a setting may carry; which of them a build can run is in the registries. */
export const SCHEME_NAMES = ["simplepir", "ipir-sp"] as const;
export type SchemeName = (typeof SCHEME_NAMES)[number];

/** The scheme of a snapshot when the settings name none (FR-001). */
export const DEFAULT_SCHEME: SchemeName = "simplepir";

export function isSchemeName(value: unknown): value is SchemeName {
  return typeof value === "string" && (SCHEME_NAMES as readonly string[]).includes(value);
}

/** What each scheme's public artifact is, for messages and reports. */
export const PUBLIC_ARTIFACT: Readonly<Record<SchemeName, string>> = Object.freeze({ simplepir: "setup data", "ipir-sp": "masks" });

/** A scheme this build cannot run: unknown, not registered, or missing a file it needs (an add-on, a WebAssembly file). */
export class SchemeUnavailable extends Error {
  readonly scheme: string;
  constructor(scheme: string, detail?: string) {
    super(`PIR scheme ${JSON.stringify(scheme)} is not available in this build${detail === undefined ? "" : `: ${detail}`}`);
    this.scheme = scheme;
  }
}

/**
 * A call of the right length whose bytes are not requests of the table (IPIR+SP: a request made for another table's
 * setup), refused before any work; the server answers 400 `invalid-query`.
 */
export class RequestRefused extends Error {}

/**
 * A table the scheme cannot lay out within its size limit (IPIR+SP: 2^30 cells). A padded build is refused with it
 * before anything is read (spec 00058 edge cases); a build from the chain fails with it.
 */
export class TableTooLarge extends Error {
  readonly scheme: SchemeName;
  readonly table: TableName;
  /** The fewest cells the table's records take, and the most a table may hold. */
  readonly neededCells: number;
  readonly maxCells: number;
  constructor(scheme: SchemeName, table: TableName, records: number, recordBytes: number, neededCells: number, maxCells: number) {
    super(
      `${scheme}: the ${table} table of ${records.toLocaleString("en-US")} records of ${recordBytes} bytes needs at least ` +
        `${neededCells.toLocaleString("en-US")} cells; a table holds at most ${maxCells.toLocaleString("en-US")}`,
    );
    this.scheme = scheme;
    this.table = table;
    this.neededCells = neededCells;
    this.maxCells = maxCells;
  }
}

// ── server side ──────────────────────────────────────────────────────────────────────────────────────────────────

/** A table as the builder describes it before any record is placed. */
export interface TableSpec {
  readonly name: TableName;
  /** Records the table holds; the rest of its slots, if any, are zero (or noise in a padded build). */
  readonly records: number;
  readonly recordBytes: number;
}

/** The read or the path table: `records` records read by their index (a slot of the snapshot). */
export interface PositionalSource extends TableSpec {
  readonly name: "read" | "path";
  /**
   * Debug (Q57): a deterministic byte stream. When given, the table's contents start random instead of zero, so the
   * slots no record is put in cost what a real record does; the scheme decides what "random" means for its cells.
   */
  readonly noise?: (out: Uint8Array) => void;
  /** Calls `put(index, record)` for every record to write, in index order. */
  fill(put: (index: number, record: Uint8Array) => void): void;
}

/** The nullifier table: entries cut into `2^bits` buckets by their first bits (FR-063); the scheme chooses `bits`. */
export interface BucketSource extends TableSpec {
  readonly name: "nullifier";
  /** The fullest bucket's load when the entries are cut by `bits` bits. */
  maxLoad(bits: number): number;
  /** Calls `put(bucket, slot, record)` for every entry cut by `bits` bits, each bucket's entries in their order. */
  fill(bits: number, put: (bucket: number, slot: number, record: Uint8Array) => void): void;
}

export type TableSource = PositionalSource | BucketSource;

/** A table laid out and encoded (the build step `<table>Table`), before the scheme's setup. */
export interface EncodedTable {
  /** How many groups a request selects among. */
  readonly groups: number;
  /** Records per group (for the nullifier table: the fullest bucket's load, its capacity). */
  readonly perGroup: number;
  /** The nullifier table only: the bits that cut entries into its `groups = 2^bucketBits` buckets. */
  readonly bucketBits?: number;
  /** The table file, in parts, written as given (without copying) under its SHA-256. */
  readonly file: readonly Uint8Array[];
  /**
   * The scheme's setup of the table once its file is written (the build step `<table>Setup`): `fileDigest` is the
   * file's SHA-256, from which the scheme derives the table's public seed (FR-012); `filePath` is where the file was
   * written, which the scheme may read back instead of holding the cells twice (IPIR+SP's add-on does). The file is
   * moved into the snapshot's directory after the build, so the path is valid only during this call. Called once; the
   * encoded table holds no cells after it.
   */
  setup(fileDigest: Uint8Array, filePath: string): Promise<PreparedTable>;
}

/** A table set up: what the manifest and the server need of it. */
export interface PreparedTable {
  /** The public artifact, in parts, written under its SHA-256 and served by digest. */
  readonly public: readonly Uint8Array[];
  /** The scheme's part of the table's manifest entry (`PirTableRef.layout`). */
  readonly layout: TableLayout;
  /** What the server needs to answer from the table, sent from the build's thread (structured clone). */
  readonly transfer: TableTransfer;
  /** The scheme's own measurements, recorded in the build statistics (for IPIR+SP the noise sample, FR-015). */
  readonly stats?: Readonly<Record<string, number>>;
}

/**
 * A table on its way from the build's worker thread to the server's thread; the scheme gives its other fields. It owns
 * what it carries until `adoptTable` takes it or `discardTransfer` frees it; closing the scheme that made it does not
 * free it.
 */
export interface TableTransfer {
  readonly scheme: SchemeName;
}

/** A table the server answers from. */
export interface ServerTable {
  /** Bytes of one request in a call body, and of one response in its answer (FR-022). */
  readonly requestBytes: number;
  readonly responseBytes: number;
  /** Memory the table holds, counted against a padded build's estimate (Q57). */
  readonly heldBytes: number;
  /**
   * Answers `count` requests (`count × requestBytes` bytes, length checked by the caller) with `count × responseBytes`
   * bytes, in the same order. Rejects with {@link RequestRefused} when a request is not one of this table's.
   */
  answer(requests: Uint8Array, count: number): Promise<Uint8Array>;
  /**
   * The table is no longer served. Memory the scheme holds outside the garbage collector (a native table) is freed once
   * every answer already started has finished; an answer asked for after this is refused.
   */
  release(): void;
}

export interface ServerSchemeOptions {
  /** Threads for the scheme's work, at least 1 (SimplePIR: the multiplication's worker pool). */
  readonly threads: number;
  /** SimplePIR: a multiplication to use instead of a pool of `threads` (tests give the inline one). Not closed. */
  readonly multiplier?: Multiplier;
}

/** A scheme's server side, opened (its threads started, its add-on loaded). */
export interface ServerScheme {
  readonly name: SchemeName;
  /** The scheme's parameters as the manifest records them (`Manifest.pir`). */
  readonly params: SchemeParams;
  /** Lays out and encodes a table (the build step `<table>Table`); the scheme picks the shape. */
  encodeTable(source: TableSource): EncodedTable;
  /**
   * A table set up in another thread (the build's), made answerable in this one; the table takes over the transfer. One
   * that throws has not taken it (the caller discards it).
   */
  adoptTable(ref: PirTableRef, transfer: TableTransfer): Promise<ServerTable>;
  /** Frees a transfer that will not be adopted (a build superseded, or failed after its setup). */
  discardTransfer(transfer: TableTransfer): void;
  /**
   * A stored table, from its file (at start). `publicPath` is the table's stored public artifact: a scheme that sets
   * the table up again (IPIR+SP) refuses a table whose public artifact comes out different (FR-013).
   */
  loadTable(ref: PirTableRef, path: string, publicPath: string): Promise<ServerTable>;
  /** Stops the scheme's threads. Tables it answers from are unusable after; transfers it made are not freed. */
  close(): Promise<void>;
}

/** A scheme the server module has (`./server-schemes.ts`): what is known of it before it is opened. */
export interface ServerSchemeEntry {
  readonly name: SchemeName;
  /**
   * The largest request (bytes after the header, per request) any table of this scheme can take. The query routes'
   * body limit is fixed from it at registration, for the largest table any snapshot can have (FR-022).
   */
  readonly maxRequestBytes: number;
  /** About the most memory building these tables holds at once, for the refusal of padded builds (Q57). */
  buildBytes(tables: readonly TableSpec[]): number;
  /** Starts the scheme's threads and loads what it needs; throws {@link SchemeUnavailable} when a file is missing. */
  open(options: ServerSchemeOptions): Promise<ServerScheme>;
}

// ── wallet side ──────────────────────────────────────────────────────────────────────────────────────────────────

export interface WalletSchemeOptions {
  /** SimplePIR: the multiplication for the wallet's A·s and H·s (the command line's worker pool, the page's inline one). */
  readonly multiplier?: Multiplier;
  /**
   * IPIR+SP: gives the wallet's compiled WebAssembly (`ipir/pss-ipir.wasm`), its digest already checked against the
   * committed one (FR-031): in Node `compileIpirWasm` (`../ipir/wallet-node.ts`), in the page the worker's own check.
   * Called only when a snapshot uses IPIR+SP; without it, or when it throws, the wallet stops with
   * {@link SchemeUnavailable} naming the file.
   */
  readonly ipirWasm?: () => WebAssembly.Module | Promise<WebAssembly.Module>;
  /**
   * IPIR+SP: worker threads that make a call's requests (`../ipir/pool.ts`; the command line's `nodeIpirPool`, the
   * page's Web Workers). Started only when a snapshot uses IPIR+SP, and closed by the caller. Without them the requests
   * are made one after the other on the calling thread.
   */
  readonly ipirWorkers?: IpirWorkers;
}

/** A scheme's wallet side for one snapshot (its parameters checked against this build's). */
export interface WalletScheme {
  readonly name: SchemeName;
  /**
   * Prepares calls to one table from its manifest entry and its public artifact's bytes (already checked against the
   * manifest's digest and size).
   */
  openTable(ref: PirTableRef | NullifierTableRef, publicArtifact: Uint8Array): Promise<WalletTable>;
  /** Frees what the scheme holds (a WebAssembly instance); its tables are unusable after. */
  dispose(): void;
}

/** One table of a snapshot, as a wallet calls it. */
export interface WalletTable {
  readonly groups: number;
  readonly perGroup: number;
  /** Bytes of one request in a call body and of one response in its answer: the same for every wallet (FR-021). */
  readonly requestBytes: number;
  readonly responseBytes: number;
  /**
   * One request per entry of `groups`, in order, each with its own fresh secret (FR-020). The caller puts the wanted
   * groups first and pads with random ones.
   */
  prepareCall(groups: readonly number[]): Promise<WalletCall>;
  dispose(): void;
}

/** A call's requests and the private state that decodes its answer (held in the object, never sent). */
export interface WalletCall {
  /** The call body after the header: `count × requestBytes` bytes. */
  readonly requests: Uint8Array;
  /**
   * Decodes the answer body after the header (`count × responseBytes` bytes): for each of the first `wanted`
   * requests, its group's `perGroup` records in slot order. Called once.
   */
  decode(responses: Uint8Array, wanted: number): Promise<Uint8Array[][]>;
}

/** A scheme the wallet has (`./wallet-schemes.ts`). */
export interface WalletSchemeEntry {
  readonly name: SchemeName;
  /** Checks the snapshot's parameters against this build's and loads what the scheme needs (a WebAssembly instance). */
  open(manifest: Pick<Manifest, "scheme" | "pir">, options: WalletSchemeOptions): Promise<WalletScheme>;
}

