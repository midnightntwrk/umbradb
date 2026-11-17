/**
 * The Dust check table's manifest (spec 00062 FR-012, FR-023): canonical JSON, like the snapshot manifest
 * (`./manifest.ts`), whose SHA-256 is the check's identifier. A wallet reads it, downloads the table's public artifact
 * once per identifier, and confirms the last coin it derived for a chain by reading, with one PIR request through the
 * manifest's scheme, the record at the coin's position.
 *
 * The table holds the Dust commitment tree's leaves of the current ledger era by position: record `p` is the 32-byte
 * little-endian commitment of the coin at position `p`, for every `p` below `commitments`. Record `p` is slot
 * `p mod perGroup` of group `⌊p / perGroup⌋`, as in the read table.
 */

import type { SchemeName } from "../pir/scheme.ts";
import { type ArtifactRef, canonicalJson, type PirTableRef, type SchemeParams, snapshotId, validateSchemeTable } from "./manifest.ts";

/** Bytes of one record: a commitment. */
export const DUST_CHECK_RECORD_BYTES = 32;

export interface DustCheckManifest {
  readonly version: 1;
  /** The first height of the ledger era the table covers. */
  readonly eraHeight: number;
  /** The block height the table was built at. */
  readonly height: number;
  /** The commitments listed: positions `0 … commitments − 1` (the core's `dust_commitment_first_free` at `height`). */
  readonly commitments: number;
  readonly scheme: SchemeName;
  /** The scheme's parameters. */
  readonly pir: SchemeParams;
  /** Requests in every call. */
  readonly queriesPerCall: number;
  readonly table: PirTableRef;
  /** The table's public artifact (SimplePIR's setup data, IPIR+SP's masks), downloaded once per identifier. */
  readonly public: ArtifactRef;
}

function need(cond: boolean, what: string): void {
  if (!cond) throw new Error(`invalid Dust check manifest: ${what}`);
}

const isCount = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v >= 0;

/** Checks a Dust check manifest; a scheme this build does not know throws `SchemeUnavailable`. */
export function validateDustCheckManifest(m: DustCheckManifest): void {
  need(typeof m === "object" && m !== null, "not an object");
  need(m.version === 1, `version ${String(m.version)}`);
  for (const k of ["eraHeight", "height", "commitments"] as const) need(isCount(m[k]), k);
  need(m.commitments >= 1, "commitments ≥ 1");
  need(isCount(m.queriesPerCall) && m.queriesPerCall >= 1 && m.queriesPerCall <= 0xffff, "queriesPerCall");
  validateSchemeTable(m.scheme, m.pir, m.table, m.public, "table", "public");
  need(m.table.records === m.commitments, "table.records = commitments");
  need(m.table.recordBytes === DUST_CHECK_RECORD_BYTES, `table.recordBytes = ${DUST_CHECK_RECORD_BYTES}`);
}

/** The manifest's bytes, as served and as digested. */
export function encodeDustCheckManifest(m: DustCheckManifest): Uint8Array {
  validateDustCheckManifest(m);
  return new TextEncoder().encode(canonicalJson(m));
}

/** Parses and checks manifest bytes; they must be in canonical form. */
export function decodeDustCheckManifest(bytes: Uint8Array): DustCheckManifest {
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const m = JSON.parse(text) as DustCheckManifest;
  validateDustCheckManifest(m);
  need(canonicalJson(m) === text, "not in canonical form");
  return m;
}

/** The check's identifier: SHA-256 of its manifest's bytes. A query names it where a snapshot's call names the snapshot. */
export const dustCheckId = (manifestBytes: Uint8Array): Uint8Array => snapshotId(manifestBytes);

/** Where position `p` sits in the table: its group and its slot there. */
export function dustCheckCell(m: Pick<DustCheckManifest, "table">, position: number): { group: number; slot: number } {
  return { group: Math.floor(position / m.table.perGroup), slot: position % m.table.perGroup };
}
