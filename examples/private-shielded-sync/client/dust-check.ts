/**
 * The wallet's private check of its Dust chains (spec 00062 story 3, FR-023): the record at a derived coin's position
 * in the Dust check table, read by PIR through the table's scheme (`../pir/scheme.ts`), must be the coin's commitment.
 *
 * The wallet reads the check's manifest (its identifier is the SHA-256 of its bytes, which must be the one the server
 * names), downloads the table's public artifact once, and checks coins in calls of exactly `queriesPerCall` requests,
 * padded with random groups (`paddedCalls`, as the snapshot's tables are read): one call covers up to that many chains,
 * so the server learns neither which positions were read nor how many chains asked. A coin at a position the table does
 * not reach yet (it was built at an earlier height) is not read: it is "not checkable yet".
 */

import { HttpError, type PssHttp } from "./http.ts";
import { paddedCalls } from "./pir-calls.ts";
import { openWalletScheme, type WalletScheme, type WalletSchemeOptions, type WalletTable } from "../pir/index.ts";
import { decodeAnswerBody, decodeDustCheckManifest, type DustCheckManifest, dustCheckCell, dustCheckId, encodeQueryBody, equalBytes, toHex } from "../shared/index.ts";

/** A coin's check: its record is its commitment, it is not, or the table does not reach its position. */
export type DustCheckOutcome = "match" | "mismatch" | "beyond";

/** What the check moved and cost. */
export interface DustCheckStats {
  calls: number;
  /** The query calls' bodies and answers. */
  bytesUp: number;
  bytesDown: number;
  /** The manifest and the public artifact, downloaded once. */
  manifestBytes: number;
  publicBytes: number;
  ms: number;
}

/** The check table, opened: its manifest and the scheme's table, ready for calls. */
export class DustChecker {
  readonly manifest: DustCheckManifest;
  readonly id: string;
  readonly stats: DustCheckStats;
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

  /** Reads the check's manifest and public artifact and opens its table through its scheme. */
  static async open(http: PssHttp, options: WalletSchemeOptions = {}): Promise<DustChecker> {
    const started = performance.now();
    const { bytes, servedId } = await http.dustCheckManifest();
    const manifest = decodeDustCheckManifest(bytes);
    const idBytes = dustCheckId(bytes);
    if (servedId !== null && servedId !== toHex(idBytes)) throw new Error(`the Dust check manifest's SHA-256 is ${toHex(idBytes)}, the server names ${servedId}`);
    const publicArtifact = await http.dustCheckBlob(manifest.public.digest, manifest.public.size);
    const scheme = await openWalletScheme(manifest, options);
    try {
      const table = await scheme.openTable(manifest.table, publicArtifact);
      const stats: DustCheckStats = { calls: 0, bytesUp: 0, bytesDown: 0, manifestBytes: bytes.length, publicBytes: publicArtifact.length, ms: performance.now() - started };
      return new DustChecker(http, manifest, idBytes, scheme, table, stats);
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

  dispose(): void {
    this.#table.dispose();
    this.#scheme.dispose();
  }
}

/** Whether an error is the server's refusal of a call to a check table it has replaced (409): open the new one. */
export const isDustCheckReplaced = (error: unknown): boolean => error instanceof HttpError && error.status === 409 && error.code === "dust-check-replaced";
