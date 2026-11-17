/**
 * PIR reads of the read table and lookups in the nullifier table (spec FR-055–059, FR-112, stories 3 and 4), through
 * the snapshot's scheme (`../pir/scheme.ts`): this file decides which groups a call asks for and pads it; the scheme's
 * table makes the request bytes and decodes the answer.
 *
 * Every call carries exactly `queriesPerCall` requests: the groups the wallet needs (each once), then groups chosen
 * uniformly at random from a cryptographic source; each request has its own fresh secret. A wallet that needs nothing
 * still sends one full call, so the number of calls is the only thing that depends on how many coins a wallet has (one
 * per `queriesPerCall` distinct groups).
 */

import { randomInt } from "node:crypto";
import { bucketOf, findInBucket, type NullifierEntry, positionOf, type TableName, type WalletTable } from "../pir/index.ts";
import { decodeAnswerBody, encodeQueryBody, fromHex, type Manifest, type PirTableRef, slotOf } from "../shared/index.ts";
import type { PssHttp } from "./http.ts";

/** Where a call's time went (spec §8: client build, round trip, client decode) and what it moved. */
export interface CallStats {
  calls: number;
  buildMs: number;
  roundTripMs: number;
  decodeMs: number;
  bytesUp: number;
  bytesDown: number;
}

export function emptyCallStats(): CallStats {
  return { calls: 0, buildMs: 0, roundTripMs: 0, decodeMs: 0, bytesUp: 0, bytesDown: 0 };
}

/** The distinct `wanted` groups, cut into calls of `perCall`, each padded with uniformly random groups (FR-112). */
export function paddedCalls(wanted: readonly number[], groups: number, perCall: number): { real: number[]; groups: number[] }[] {
  const distinct = [...new Set(wanted)];
  const calls: { real: number[]; groups: number[] }[] = [];
  for (let from = 0; from === 0 || from < distinct.length; from += perCall) {
    const real = distinct.slice(from, from + perCall);
    const padded = [...real];
    while (padded.length < perCall) padded.push(randomInt(groups));
    calls.push({ real, groups: padded });
  }
  return calls;
}

/** Runs the calls for `wanted` against one table; the records of each wanted group, in slot order. */
async function pirGroups(
  http: PssHttp,
  name: TableName,
  table: WalletTable,
  manifest: Manifest,
  snapshotId: Uint8Array,
  wanted: readonly number[],
  stats: CallStats,
): Promise<Map<number, Uint8Array[]>> {
  const out = new Map<number, Uint8Array[]>();
  for (const call of paddedCalls(wanted, table.groups, manifest.queriesPerCall)) {
    let t = performance.now();
    const prepared = await table.prepareCall(call.groups);
    const body = encodeQueryBody({ snapshotId, count: call.groups.length, payload: prepared.requests }, table.requestBytes);
    stats.buildMs += performance.now() - t;
    t = performance.now();
    const answer = await http.query(name, body);
    stats.roundTripMs += performance.now() - t;
    stats.bytesUp += body.length;
    stats.bytesDown += answer.length;
    t = performance.now();
    const decoded = decodeAnswerBody(answer, table.responseBytes, { count: call.groups.length, snapshotId });
    const records = await prepared.decode(decoded.payload, call.real.length);
    call.real.forEach((group, q) => out.set(group, records[q]!));
    stats.decodeMs += performance.now() - t;
    stats.calls++;
  }
  return out;
}

/**
 * Where tree position `position` sits in a positional table (the read table, or the path table): its slot
 * (`../shared/padding.ts`), group and place there.
 */
export function readCell(manifest: Manifest, position: number, ref: PirTableRef = manifest.artifacts.readTable): { index: number; group: number; slot: number } {
  const index = slotOf(manifest, position);
  const { column, slot } = positionOf(index, ref.perGroup);
  return { index, group: column, slot };
}

/** The records at tree positions `positions` of a positional table, read by PIR; record bytes by position. */
async function readPositional(
  http: PssHttp,
  name: "read" | "path",
  ref: PirTableRef,
  manifest: Manifest,
  snapshotId: Uint8Array,
  table: WalletTable,
  positions: readonly number[],
  stats: CallStats,
): Promise<Map<number, Uint8Array>> {
  const cells = positions.map((p) => readCell(manifest, p, ref));
  const groups = await pirGroups(http, name, table, manifest, snapshotId, cells.map((c) => c.group), stats);
  const out = new Map<number, Uint8Array>();
  positions.forEach((p, i) => out.set(p, groups.get(cells[i]!.group)![cells[i]!.slot]!));
  return out;
}

/**
 * Reads the records of tree positions `positions` from the read table by PIR (story 3), through `table` (the
 * scheme's, opened from the manifest's `readTable` and `readPublic`); record bytes by position.
 */
export async function readPositions(
  http: PssHttp,
  manifest: Manifest,
  snapshotId: Uint8Array,
  table: WalletTable,
  positions: readonly number[],
  stats: CallStats = emptyCallStats(),
): Promise<Map<number, Uint8Array>> {
  return readPositional(http, "read", manifest.artifacts.readTable, manifest, snapshotId, table, positions, stats);
}

/**
 * Reads the path records of tree positions `positions` from the path table by PIR (Q58: only to spend), through
 * `table` (opened from `pathTable` and `pathPublic`); record bytes by position. Throws when the snapshot has no path
 * table (its path split is 0).
 */
export async function readPaths(
  http: PssHttp,
  manifest: Manifest,
  snapshotId: Uint8Array,
  table: WalletTable,
  positions: readonly number[],
  stats: CallStats = emptyCallStats(),
): Promise<Map<number, Uint8Array>> {
  const ref = manifest.artifacts.pathTable;
  if (ref === undefined) throw new Error("the snapshot has no path table (path split 0)");
  return readPositional(http, "path", ref, manifest, snapshotId, table, positions, stats);
}

/**
 * Looks up `nullifiers` (hex) in the nullifier table by PIR (story 4), through `table` (opened from `nullifierTable`
 * and `nullifierPublic`): the entry where present, else null.
 */
export async function lookupNullifiers(
  http: PssHttp,
  manifest: Manifest,
  snapshotId: Uint8Array,
  table: WalletTable,
  nullifiers: readonly string[],
  stats: CallStats = emptyCallStats(),
): Promise<Map<string, NullifierEntry | null>> {
  const ref = manifest.artifacts.nullifierTable;
  const bytes = nullifiers.map((n) => fromHex(n, 32));
  const buckets = await pirGroups(http, "nullifier", table, manifest, snapshotId, bytes.map((n) => bucketOf(n, ref.bucketBits)), stats);
  const out = new Map<string, NullifierEntry | null>();
  nullifiers.forEach((hex, i) => out.set(hex, findInBucket(buckets.get(bucketOf(bytes[i]!, ref.bucketBits))!, bytes[i]!)));
  return out;
}
