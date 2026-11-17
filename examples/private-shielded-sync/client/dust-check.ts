/**
 * The wallet's private check of its Dust chains (spec 00062 story 3, FR-023): the record at a derived coin's position
 * in the Dust check table, read by PIR through the table's scheme (`../pir/scheme.ts`), must be the coin's commitment.
 *
 * The wallet reads the check's manifest (its identifier is the SHA-256 of its bytes, which must be the one the server
 * names), downloads the table's public artifact once, and checks coins in calls of exactly `queriesPerCall` requests,
 * padded with random groups (`paddedCalls`, as the snapshot's tables are read): one call covers up to that many chains,
 * so the server learns neither which positions were read nor how many chains asked. A coin at a position the table does
 * not reach yet (it was built at an earlier height) is not read: it is "not checkable yet".
 *
 * To spend a coin (phase 9) the wallet reads its Merkle path the same way: its k lower siblings from the snapshot's
 * path table by PIR, in one call padded to `queriesPerCall` requests (the path table's public artifact is downloaded
 * then, once per snapshot), and the upper 32 − k from the public block roots; the root they give from the coin's
 * commitment must be the snapshot's. The generation records are one public file.
 */

import { createHash } from "node:crypto";
import type { Kernel } from "../kernel/index.ts";
import type { DustCache } from "./dust.ts";
import { HttpError, type PssHttp } from "./http.ts";
import { paddedCalls } from "./pir-calls.ts";
import { openWalletScheme, type WalletScheme, type WalletSchemeOptions, type WalletTable } from "../pir/index.ts";
import {
  type ArtifactRef,
  decodeAnswerBody,
  decodeDustCheckManifest,
  decodeDustGenerationRecords,
  type DustCheckManifest,
  dustCheckCell,
  dustCheckId,
  type DustGenerationRecord,
  encodeQueryBody,
  equalBytes,
  fromHex,
  toHex,
} from "../shared/index.ts";
import { type Hash2, NODE_BYTES, rootFromPath, siblingsOf, TREE_DEPTH, treeLevels } from "./tree.ts";

const sha256 = (b: Uint8Array): Uint8Array => new Uint8Array(createHash("sha256").update(b).digest());

/** A coin's check: its record is its commitment, it is not, or the table does not reach its position. */
export type DustCheckOutcome = "match" | "mismatch" | "beyond";

/** What the check moved and cost. */
export interface DustCheckStats {
  calls: number;
  /** The query calls' bodies and answers. */
  bytesUp: number;
  bytesDown: number;
  /** The manifest and the public artifact, downloaded once (the artifact not at all when the cache holds it). */
  manifestBytes: number;
  publicBytes: number;
  publicCached: boolean;
  ms: number;
}

/** What reading paths and the generation records moved and cost (phase 9). */
export interface DustPathStats {
  /** The path table's calls. */
  calls: number;
  bytesUp: number;
  bytesDown: number;
  /** Downloaded once per snapshot (0 when the cache held them): the path table's public artifact, the block roots, the generation records. */
  pathPublicBytes: number;
  blockRootsBytes: number;
  generationBytes: number;
  ms: number;
}

/** A coin's Merkle path in the Dust commitment tree: 32 siblings, leaf upward, and the root they give (the snapshot's). */
export interface DustCoinPath {
  readonly position: number;
  readonly siblings: readonly Uint8Array[];
  readonly root: Uint8Array;
  /** Read by PIR (k of them), or taken from the public block roots. */
  readonly lower: number;
}

/** The check table, opened: its manifest and the scheme's table, ready for calls. */
export class DustChecker {
  readonly manifest: DustCheckManifest;
  readonly id: string;
  readonly stats: DustCheckStats;
  readonly pathStats: DustPathStats = { calls: 0, bytesUp: 0, bytesDown: 0, pathPublicBytes: 0, blockRootsBytes: 0, generationBytes: 0, ms: 0 };
  #cache: DustCache | undefined;
  #pathTable: WalletTable | null = null;
  #blockRoots: Uint8Array | null = null;
  readonly #idBytes: Uint8Array;
  readonly #http: PssHttp;
  readonly #scheme: WalletScheme;
  readonly #table: WalletTable;

  private constructor(http: PssHttp, manifest: DustCheckManifest, idBytes: Uint8Array, scheme: WalletScheme, table: WalletTable, stats: DustCheckStats) {
    this.#http = http;
    this.manifest = manifest;
    this.#idBytes = idBytes;
    this.id = toHex(idBytes);
    this.#scheme = scheme;
    this.#table = table;
    this.stats = stats;
  }

  /**
   * Reads the check's manifest and public artifact (from `cache` when it holds the artifact's SHA-256, kept there once
   * downloaded) and opens its table through its scheme.
   */
  static async open(http: PssHttp, options: WalletSchemeOptions = {}, cache?: DustCache): Promise<DustChecker> {
    const started = performance.now();
    const { bytes, servedId } = await http.dustCheckManifest();
    const manifest = decodeDustCheckManifest(bytes);
    const idBytes = dustCheckId(bytes);
    if (servedId !== null && servedId !== toHex(idBytes)) throw new Error(`the Dust check manifest's SHA-256 is ${toHex(idBytes)}, the server names ${servedId}`);
    const ref = manifest.public;
    const kept = cache?.get(ref.digest);
    const publicCached = kept !== undefined && kept.length === ref.size && toHex(sha256(kept)) === ref.digest;
    const publicArtifact = publicCached ? kept : await http.dustCheckBlob(ref.digest, ref.size);
    if (!publicCached) cache?.set(ref.digest, publicArtifact);
    const scheme = await openWalletScheme(manifest, options);
    try {
      const table = await scheme.openTable(manifest.table, publicArtifact);
      const stats: DustCheckStats = { calls: 0, bytesUp: 0, bytesDown: 0, manifestBytes: bytes.length, publicBytes: publicArtifact.length, publicCached, ms: performance.now() - started };
      const checker = new DustChecker(http, manifest, idBytes, scheme, table, stats);
      checker.#cache = cache;
      return checker;
    } catch (error) {
      scheme.dispose();
      throw error;
    }
  }

  /**
   * Checks each coin: the record at its position against its commitment (32 bytes, little-endian). Positions the table
   * covers are read in calls of exactly `queriesPerCall` requests (one call per that many distinct groups).
   */
  async check(coins: readonly { readonly position: number; readonly commitment: Uint8Array }[]): Promise<DustCheckOutcome[]> {
    const started = performance.now();
    const m = this.manifest;
    const readable = coins.filter((c) => c.position < m.commitments);
    const cells = new Map(readable.map((c) => [c.position, dustCheckCell(m, c.position)]));
    const records = new Map<number, Uint8Array[]>();
    // At least one call, even for no coin: a wallet that needs nothing sends what one that needs a little does.
    for (const call of paddedCalls([...cells.values()].map((c) => c.group), this.#table.groups, m.queriesPerCall)) {
      const prepared = await this.#table.prepareCall(call.groups);
      const body = encodeQueryBody({ snapshotId: this.#idBytes, count: call.groups.length, payload: prepared.requests }, this.#table.requestBytes);
      const answer = await this.#http.dustCheckQuery(body);
      this.stats.calls++;
      this.stats.bytesUp += body.length;
      this.stats.bytesDown += answer.length;
      const decoded = decodeAnswerBody(answer, this.#table.responseBytes, { count: call.groups.length, snapshotId: this.#idBytes });
      const groups = await prepared.decode(decoded.payload, call.real.length);
      call.real.forEach((group, q) => records.set(group, groups[q]!));
    }
    this.stats.ms += performance.now() - started;
    return coins.map((c) => {
      const cell = cells.get(c.position);
      if (cell === undefined) return "beyond";
      const record = records.get(cell.group)?.[cell.slot];
      if (record === undefined) throw new Error(`the Dust check table gave no record for position ${c.position}`);
      return equalBytes(record, c.commitment) ? "match" : "mismatch";
    });
  }

  /** A public file of the snapshot, from the cache or downloaded (and kept); the bytes downloaded, 0 from the cache. */
  async #file(ref: ArtifactRef): Promise<{ bytes: Uint8Array; downloaded: number }> {
    const kept = this.#cache?.get(ref.digest);
    if (kept !== undefined && kept.length === ref.size && toHex(sha256(kept)) === ref.digest) return { bytes: kept, downloaded: 0 };
    const bytes = await this.#http.dustCheckBlob(ref.digest, ref.size);
    this.#cache?.set(ref.digest, bytes);
    return { bytes, downloaded: bytes.length };
  }

  /**
   * The Merkle path of the coin at `position` whose commitment is `commitment` (32 bytes, little-endian): its k lower
   * siblings read by PIR from the path table, in one call padded to `queriesPerCall` requests, and the upper ones from
   * the block roots. Throws unless the root they give is the snapshot's.
   */
  async readPath(position: number, commitment: Uint8Array, kernel: Kernel): Promise<DustCoinPath> {
    const started = performance.now();
    const m = this.manifest;
    const t = m.tree;
    if (!Number.isSafeInteger(position) || position < 0 || position >= m.commitments) {
      throw new Error(`position ${position} is not in the Dust snapshot's tree (it holds positions below ${m.commitments}; rebuild the snapshot)`);
    }
    const hash: Hash2 = (a, b) => kernel.hash2(a, b)!;
    const k = t.pathSplit;
    if (this.#blockRoots === null) {
      const roots = await this.#file(t.blockRoots);
      this.#blockRoots = roots.bytes;
      this.pathStats.blockRootsBytes += roots.downloaded;
    }
    let lower: Uint8Array[] = [];
    if (k > 0) {
      if (this.#pathTable === null) {
        const publicArtifact = await this.#file(t.pathPublic!);
        this.pathStats.pathPublicBytes += publicArtifact.downloaded;
        this.#pathTable = await this.#scheme.openTable(t.pathTable!, publicArtifact.bytes);
      }
      const table = this.#pathTable;
      const cell = dustCheckCell({ table: t.pathTable! }, position);
      const [call] = paddedCalls([cell.group], table.groups, m.queriesPerCall);
      const prepared = await table.prepareCall(call!.groups);
      const body = encodeQueryBody({ snapshotId: this.#idBytes, count: call!.groups.length, payload: prepared.requests }, table.requestBytes);
      const answer = await this.#http.dustPathQuery(body);
      this.pathStats.calls++;
      this.pathStats.bytesUp += body.length;
      this.pathStats.bytesDown += answer.length;
      const decoded = decodeAnswerBody(answer, table.responseBytes, { count: call!.groups.length, snapshotId: this.#idBytes });
      const record = (await prepared.decode(decoded.payload, 1))[0]![cell.slot]!;
      lower = Array.from({ length: k }, (_, h) => record.slice(h * NODE_BYTES, (h + 1) * NODE_BYTES));
    }
    const roots = this.#blockRoots;
    const blockNodes = Array.from({ length: roots.length / NODE_BYTES }, (_, b) => roots.subarray(b * NODE_BYTES, (b + 1) * NODE_BYTES));
    const upper = siblingsOf(treeLevels(blockNodes, TREE_DEPTH - k, hash), Math.floor(position / 2 ** k));
    const siblings = [...lower, ...upper];
    const root = rootFromPath(kernel.leaf(commitment), position, siblings, hash);
    this.pathStats.ms += performance.now() - started;
    if (!equalBytes(root, fromHex(t.root, 32))) throw new Error(`the Merkle path read for position ${position} gives the root ${toHex(root)}, not the Dust snapshot's ${t.root}`);
    return { position, siblings, root, lower: lower.length };
  }

  /** Every generation record of the snapshot, record `i` at generation index `i` (one public file). */
  async generationRecords(): Promise<DustGenerationRecord[]> {
    const file = await this.#file(this.manifest.generation.file);
    this.pathStats.generationBytes += file.downloaded;
    const records = decodeDustGenerationRecords(file.bytes);
    if (records.length !== this.manifest.generation.records) throw new Error(`the generation file holds ${records.length} records, the manifest ${this.manifest.generation.records}`);
    return records;
  }

  dispose(): void {
    this.#pathTable?.dispose();
    this.#table.dispose();
    this.#scheme.dispose();
  }
}

/** Whether an error is the server's refusal of a call to a check table it has replaced (409): open the new one. */
export const isDustCheckReplaced = (error: unknown): boolean => error instanceof HttpError && error.status === 409 && error.code === "dust-check-replaced";
