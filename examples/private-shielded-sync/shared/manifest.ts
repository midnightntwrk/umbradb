/**
 * The snapshot manifest (spec FR-021, FR-022): JSON naming the height, block hash, `first_free`, root and every other
 * artifact's digest, size and parameters. It is encoded canonically (keys sorted, no whitespace, integers only except
 * σ), so building the same snapshot twice gives the same bytes; the snapshot identifier is their SHA-256.
 *
 * Digests, hashes and the seed are lower-case hex. The root is the tree root as a 32-byte little-endian field element.
 */

import { createHash } from "node:crypto";
import { FORMAT_VERSION } from "./constants.ts";

export interface ArtifactRef {
  /** SHA-256 of the artifact's bytes, lower-case hex. */
  readonly digest: string;
  readonly size: number;
}

/** A PIR table's artifact and parameters: the grid's shape and the seed of its public matrix A. */
export interface PirTableRef extends ArtifactRef {
  readonly rows: number;
  readonly cols: number;
  readonly perColumn: number;
  readonly cellsPerRecord: number;
  readonly recordBytes: number;
  readonly records: number;
  readonly seed: string;
}

export interface Manifest {
  readonly formatVersion: number;
  readonly network: string;
  readonly genesisHash: string;
  readonly height: number;
  readonly blockHash: string;
  readonly firstFree: number;
  readonly root: string;
  /** k: the tree cut (FR-040). */
  readonly pathSplit: number;
  /** Vectors per query call (FR-065). */
  readonly queriesPerCall: number;
  /** SimplePIR parameters (FR-050). */
  readonly pir: { readonly logQ: number; readonly n: number; readonly sigma: number; readonly cellBits: number; readonly plainModulus: number };
  readonly artifacts: {
    readonly scan: ArtifactRef;
    readonly blockRoots: ArtifactRef & { readonly blocks: number };
    readonly readTable: PirTableRef;
    readonly readSetup: ArtifactRef;
    readonly nullifierTable: PirTableRef & { readonly bucketBits: number; readonly capacity: number };
    readonly nullifierSetup: ArtifactRef;
  };
}

/** Canonical JSON: object keys sorted by code unit, no whitespace; only finite numbers. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("canonical JSON has no non-finite numbers");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
  }
  throw new Error(`canonical JSON cannot encode a ${typeof value}`);
}

/** The manifest's bytes, as served and as digested. */
export function encodeManifest(m: Manifest): Uint8Array {
  validateManifest(m);
  return new TextEncoder().encode(canonicalJson(m));
}

/** The snapshot identifier: SHA-256 of the manifest's bytes (FR-022). */
export function snapshotId(manifestBytes: Uint8Array): Uint8Array {
  return new Uint8Array(createHash("sha256").update(manifestBytes).digest());
}

/** Parses and checks manifest bytes; they must be in canonical form. */
export function decodeManifest(bytes: Uint8Array): Manifest {
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const m = JSON.parse(text) as Manifest;
  validateManifest(m);
  if (canonicalJson(m) !== text) throw new Error("manifest is not in canonical form");
  return m;
}

const HEX32 = /^[0-9a-f]{64}$/;

function need(cond: boolean, what: string): void {
  if (!cond) throw new Error(`invalid manifest: ${what}`);
}

function isCount(v: unknown): v is number {
  return typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
}

function checkRef(r: ArtifactRef | undefined, name: string): void {
  need(typeof r === "object" && r !== null, `${name} missing`);
  need(HEX32.test(r!.digest), `${name}.digest`);
  need(isCount(r!.size), `${name}.size`);
}

function checkTable(t: PirTableRef | undefined, name: string): void {
  checkRef(t, name);
  for (const k of ["rows", "cols", "perColumn", "cellsPerRecord", "recordBytes", "records"] as const) {
    need(isCount(t![k]) && (k === "records" || t![k] > 0), `${name}.${k}`);
  }
  need(t!.rows === t!.perColumn * t!.cellsPerRecord, `${name}.rows = perColumn × cellsPerRecord`);
  need(t!.size === 32 + t!.rows * t!.cols * 2, `${name}.size matches its shape`);
  need(HEX32.test(t!.seed), `${name}.seed`);
}

export function validateManifest(m: Manifest): void {
  need(typeof m === "object" && m !== null, "not an object");
  need(m.formatVersion === FORMAT_VERSION, `formatVersion ${String(m.formatVersion)}`);
  need(typeof m.network === "string" && m.network.length > 0, "network");
  for (const k of ["genesisHash", "blockHash", "root"] as const) need(HEX32.test(m[k]), k);
  for (const k of ["height", "firstFree"] as const) need(isCount(m[k]), k);
  need(isCount(m.pathSplit) && m.pathSplit <= 32, "pathSplit");
  need(isCount(m.queriesPerCall) && m.queriesPerCall >= 1 && m.queriesPerCall <= 0xffff, "queriesPerCall");
  need(typeof m.pir === "object" && m.pir !== null, "pir");
  for (const k of ["logQ", "n", "cellBits", "plainModulus"] as const) need(isCount(m.pir[k]), `pir.${k}`);
  need(typeof m.pir.sigma === "number" && m.pir.sigma > 0, "pir.sigma");
  const a = m.artifacts;
  need(typeof a === "object" && a !== null, "artifacts");
  checkRef(a.scan, "scan");
  need(a.scan.size === 36 * m.firstFree, "scan.size = 36 × firstFree");
  checkRef(a.blockRoots, "blockRoots");
  need(isCount(a.blockRoots.blocks) && a.blockRoots.size === 32 * a.blockRoots.blocks, "blockRoots.blocks");
  checkTable(a.readTable, "readTable");
  need(a.readTable.records === m.firstFree, "readTable.records = firstFree");
  checkRef(a.readSetup, "readSetup");
  need(a.readSetup.size === a.readTable.rows * m.pir.n * 4, "readSetup.size = R × n × 4");
  checkTable(a.nullifierTable, "nullifierTable");
  need(isCount(a.nullifierTable.bucketBits) && a.nullifierTable.cols === 2 ** a.nullifierTable.bucketBits, "nullifierTable.bucketBits");
  need(isCount(a.nullifierTable.capacity) && a.nullifierTable.capacity === a.nullifierTable.perColumn, "nullifierTable.capacity");
  checkRef(a.nullifierSetup, "nullifierSetup");
  need(a.nullifierSetup.size === a.nullifierTable.rows * m.pir.n * 4, "nullifierSetup.size = R × n × 4");
}

export function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("hex");
}

export function fromHex(hex: string, length?: number): Uint8Array {
  if (!/^(?:[0-9a-f]{2})*$/.test(hex)) throw new Error("not lower-case hex");
  const out = new Uint8Array(Buffer.from(hex, "hex"));
  if (length !== undefined && out.length !== length) throw new Error(`expected ${length} bytes of hex, got ${out.length}`);
  return out;
}
