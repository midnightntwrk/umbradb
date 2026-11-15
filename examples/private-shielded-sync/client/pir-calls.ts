/**
 * PIR reads of the read table and lookups in the nullifier table (spec FR-055–059, FR-112, stories 3 and 4).
 *
 * Every call carries exactly `queriesPerCall` vectors: the columns the wallet needs (each once), then columns chosen
 * uniformly at random from a cryptographic source; each vector has its own fresh secret and error (`pir/query.ts`). A
 * wallet that needs nothing still sends one full call, so the number of calls is the only thing that depends on how
 * many coins a wallet has (one per `queriesPerCall` distinct columns).
 */

import { randomInt } from "node:crypto";
import {
  bucketOf,
  buildQueries,
  columnRecords,
  decodeAnswers,
  findInBucket,
  type Matrix,
  type Multiplier,
  type NullifierEntry,
  positionOf,
  type TableInfo,
} from "../pir/index.ts";
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

function tableInfo(ref: PirTableRef): TableInfo {
  return {
    rows: ref.rows,
    cols: ref.cols,
    perColumn: ref.perColumn,
    cellsPerRecord: ref.cellsPerRecord,
    recordBytes: ref.recordBytes,
    records: ref.records,
    seed: fromHex(ref.seed, 32),
  };
}

/** The distinct `wanted` columns, cut into calls of `perCall`, each padded with uniformly random columns (FR-112). */
export function paddedCalls(wanted: readonly number[], cols: number, perCall: number): { real: number[]; columns: number[] }[] {
  const distinct = [...new Set(wanted)];
  const calls: { real: number[]; columns: number[] }[] = [];
  for (let from = 0; from === 0 || from < distinct.length; from += perCall) {
    const real = distinct.slice(from, from + perCall);
    const columns = [...real];
    while (columns.length < perCall) columns.push(randomInt(cols));
    calls.push({ real, columns });
  }
  return calls;
}

/** Runs the calls for `columns` against one table; the decoded column (cells) of each real column. */
async function pirColumns(
  http: PssHttp,
  table: "read" | "nullifier",
  ref: PirTableRef,
  manifest: Manifest,
  snapshotId: Uint8Array,
  setup: Matrix,
  wanted: readonly number[],
  multiplier: Multiplier,
  stats: CallStats,
): Promise<Map<number, Uint16Array>> {
  const info = tableInfo(ref);
  const out = new Map<number, Uint16Array>();
  for (const call of paddedCalls(wanted, ref.cols, manifest.queriesPerCall)) {
    let t = performance.now();
    const batch = await buildQueries(info, call.columns, multiplier);
    const body = encodeQueryBody({ snapshotId, count: call.columns.length, values: batch.queries }, ref.cols);
    stats.buildMs += performance.now() - t;
    t = performance.now();
    const answer = await http.query(table, body);
    stats.roundTripMs += performance.now() - t;
    stats.bytesUp += body.length;
    stats.bytesDown += answer.length;
    t = performance.now();
    const decoded = decodeAnswerBody(answer, ref.rows, { count: call.columns.length, snapshotId });
    const values = await decodeAnswers(setup, batch, decoded.values, multiplier);
    call.real.forEach((column, q) => out.set(column, values[q]!));
    stats.decodeMs += performance.now() - t;
    stats.calls++;
  }
  return out;
}

/** Where tree position `position` sits in the read table: its slot (`../shared/padding.ts`), column and place there. */
export function readCell(manifest: Manifest, position: number): { index: number; column: number; slot: number } {
  const index = slotOf(manifest, position);
  return { index, ...positionOf(index, manifest.artifacts.readTable.perColumn) };
}

/** Reads the records of tree positions `positions` from the read table by PIR (story 3); record bytes by position. */
export async function readPositions(
  http: PssHttp,
  manifest: Manifest,
  snapshotId: Uint8Array,
  setup: Matrix,
  positions: readonly number[],
  multiplier: Multiplier,
  stats: CallStats = emptyCallStats(),
): Promise<Map<number, Uint8Array>> {
  const ref = manifest.artifacts.readTable;
  const cells = positions.map((p) => readCell(manifest, p));
  const columns = await pirColumns(http, "read", ref, manifest, snapshotId, setup, cells.map((c) => c.column), multiplier, stats);
  const out = new Map<number, Uint8Array>();
  positions.forEach((p, i) => out.set(p, columnRecords(ref, columns.get(cells[i]!.column)!)[cells[i]!.slot]!));
  return out;
}

/** Looks up `nullifiers` (hex) in the nullifier table by PIR (story 4): the entry where present, else null. */
export async function lookupNullifiers(
  http: PssHttp,
  manifest: Manifest,
  snapshotId: Uint8Array,
  setup: Matrix,
  nullifiers: readonly string[],
  multiplier: Multiplier,
  stats: CallStats = emptyCallStats(),
): Promise<Map<string, NullifierEntry | null>> {
  const ref = manifest.artifacts.nullifierTable;
  const bytes = nullifiers.map((n) => fromHex(n, 32));
  const columns = await pirColumns(http, "nullifier", ref, manifest, snapshotId, setup, bytes.map((n) => bucketOf(n, ref.bucketBits)), multiplier, stats);
  const out = new Map<string, NullifierEntry | null>();
  nullifiers.forEach((hex, i) => {
    const column = bucketOf(bytes[i]!, ref.bucketBits);
    out.set(hex, findInBucket(columnRecords(ref, columns.get(column)!), bytes[i]!));
  });
  return out;
}
