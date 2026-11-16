/**
 * The snapshot manifest (spec FR-021, FR-022; 00058 FR-003): JSON naming the height, block hash, `first_free`, root,
 * the PIR scheme and every other artifact's digest, size and parameters. It is encoded canonically (keys sorted, no
 * whitespace, integers only except σ), so building the same snapshot twice gives the same bytes; the snapshot
 * identifier is their SHA-256, so two schemes at one height give two identifiers.
 *
 * Digests, hashes and the seed are lower-case hex. The root is the tree root as a 32-byte little-endian field element.
 *
 * Each PIR table's entry has the scheme-independent fields (records, record size, groups, records per group) and the
 * scheme's own `layout`; the manifest's `pir` holds the scheme's parameters. Both are tagged by the manifest's
 * `scheme`, and checked here by that scheme's rules (`SCHEME_RULES`).
 */

import { createHash } from "node:crypto";
import type { PirParams } from "../pir/params.ts";
import { isSchemeName, type SchemeName, SchemeUnavailable } from "../pir/scheme.ts";
import { FORMAT_VERSION } from "./constants.ts";

export interface ArtifactRef {
  /** SHA-256 of the artifact's bytes, lower-case hex. */
  readonly digest: string;
  readonly size: number;
}

/** SimplePIR's parameters (FR-050): q = 2^logQ, LWE dimension n, error σ, bits per cell and p = 2^cellBits. */
export type SimplePirParams = PirParams;

/** A scheme's parameters, tagged by `Manifest.scheme`. */
export type SchemeParams = SimplePirParams;

/** A SimplePIR table's grid: R rows × C columns of cells (a group is a column), and the seed of its public matrix A. */
export interface SimplePirLayout {
  /** R = perGroup × cellsPerRecord. */
  readonly rows: number;
  /** C = groups. */
  readonly cols: number;
  /** E = ⌈8 × recordBytes / cellBits⌉. */
  readonly cellsPerRecord: number;
  readonly seed: string;
}

/** A scheme's layout of one table, tagged by `Manifest.scheme`. */
export type TableLayout = SimplePirLayout;

/** A PIR table: its file, how a wallet addresses its records, and the scheme's layout. */
export interface PirTableRef extends ArtifactRef {
  /** How many records the table holds (the rest of its slots are unused). */
  readonly records: number;
  readonly recordBytes: number;
  /** How many groups a request selects among. */
  readonly groups: number;
  /** Records per group: record i is slot i mod perGroup of group ⌊i / perGroup⌋. */
  readonly perGroup: number;
  readonly layout: TableLayout;
}

/** The nullifier table: bucket j is group j, of `capacity` = perGroup entries (FR-062–064). */
export interface NullifierTableRef extends PirTableRef {
  readonly bucketBits: number;
  readonly capacity: number;
}

export interface Manifest {
  readonly formatVersion: number;
  /** The PIR scheme of every table (00058 FR-003). */
  readonly scheme: SchemeName;
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
  /**
   * Debug (Q57): the scan file, the read table and the nullifier table hold `size` entries, the real outputs spread
   * among noise (`./padding.ts`). Absent on every snapshot built from the chain alone.
   */
  readonly padding?: { readonly size: number };
  /** The scheme's parameters. */
  readonly pir: SchemeParams;
  readonly artifacts: {
    readonly scan: ArtifactRef;
    readonly blockRoots: ArtifactRef & { readonly blocks: number };
    readonly readTable: PirTableRef;
    /** The read table's public artifact, which every wallet downloads (SimplePIR's setup data). */
    readonly readPublic: ArtifactRef;
    /** Lower Merkle paths, read only to spend (Q58); absent when pathSplit is 0 (no lower path). */
    readonly pathTable?: PirTableRef;
    readonly pathPublic?: ArtifactRef;
    readonly nullifierTable: NullifierTableRef;
    readonly nullifierPublic: ArtifactRef;
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

/** The scheme-independent fields of a table's entry. */
function checkTable(t: PirTableRef | undefined, name: string): void {
  checkRef(t, name);
  for (const k of ["records", "recordBytes", "groups", "perGroup"] as const) {
    need(isCount(t![k]) && (k === "records" || t![k] > 0), `${name}.${k}`);
  }
  need(t!.records <= t!.groups * t!.perGroup, `${name}.records ≤ groups × perGroup`);
  need(typeof t!.layout === "object" && t!.layout !== null, `${name}.layout`);
}

/** What the manifest's checks know of a scheme: its parameters, and a table's layout against its files' sizes. */
interface SchemeRules {
  checkParams(pir: SchemeParams): void;
  checkTable(t: PirTableRef, publicRef: ArtifactRef, pir: SchemeParams, name: string, publicName: string): void;
}

/** SimplePIR: the table file is a 32-byte header and R × C 16-bit cells; the setup data R × n 32-bit values. */
const SIMPLEPIR_RULES: SchemeRules = {
  checkParams(pir) {
    for (const k of ["logQ", "n", "cellBits", "plainModulus"] as const) need(isCount(pir[k]) && pir[k] > 0, `pir.${k}`);
    need(typeof pir.sigma === "number" && pir.sigma > 0, "pir.sigma");
  },
  checkTable(t, publicRef, pir, name, publicName) {
    const l = t.layout;
    for (const k of ["rows", "cols", "cellsPerRecord"] as const) need(isCount(l[k]) && l[k] > 0, `${name}.layout.${k}`);
    need(l.cols === t.groups, `${name}.layout.cols = groups`);
    need(l.cellsPerRecord === Math.ceil((8 * t.recordBytes) / pir.cellBits), `${name}.layout.cellsPerRecord = ⌈8 × recordBytes / cellBits⌉`);
    need(l.rows === t.perGroup * l.cellsPerRecord, `${name}.layout.rows = perGroup × cellsPerRecord`);
    need(t.size === 32 + l.rows * l.cols * 2, `${name}.size matches its shape`);
    need(HEX32.test(l.seed), `${name}.layout.seed`);
    need(publicRef.size === l.rows * pir.n * 4, `${publicName}.size = R × n × 4`);
  },
};

/** The schemes whose manifests this build can read. */
const SCHEME_RULES: { readonly [S in SchemeName]?: SchemeRules } = { simplepir: SIMPLEPIR_RULES };

/**
 * Checks a manifest. A scheme this build does not know throws {@link SchemeUnavailable}, whose message names it (a
 * wallet stops on it, 00058 story 2); anything else wrong throws "invalid manifest: …".
 */
export function validateManifest(m: Manifest): void {
  need(typeof m === "object" && m !== null, "not an object");
  need(m.formatVersion === FORMAT_VERSION, `formatVersion ${String(m.formatVersion)}`);
  need(typeof m.scheme === "string" && m.scheme.length > 0, "scheme");
  const rules = isSchemeName(m.scheme) ? SCHEME_RULES[m.scheme] : undefined;
  if (rules === undefined) throw new SchemeUnavailable(m.scheme, "this build cannot read its manifest");
  need(typeof m.network === "string" && m.network.length > 0, "network");
  for (const k of ["genesisHash", "blockHash", "root"] as const) need(HEX32.test(m[k]), k);
  for (const k of ["height", "firstFree"] as const) need(isCount(m[k]), k);
  need(isCount(m.pathSplit) && m.pathSplit <= 32, "pathSplit");
  need(isCount(m.queriesPerCall) && m.queriesPerCall >= 1 && m.queriesPerCall <= 0xffff, "queriesPerCall");
  need(typeof m.pir === "object" && m.pir !== null, "pir");
  rules.checkParams(m.pir);
  let slots = m.firstFree;
  if (m.padding !== undefined) {
    need(typeof m.padding === "object" && m.padding !== null && Object.keys(m.padding).length === 1, "padding is {size}");
    need(isCount(m.padding.size) && m.firstFree >= 1 && m.padding.size >= m.firstFree, "padding.size ≥ firstFree ≥ 1");
    slots = m.padding.size;
  }
  const a = m.artifacts;
  need(typeof a === "object" && a !== null, "artifacts");
  checkRef(a.scan, "scan");
  need(a.scan.size === 36 * slots, "scan.size = 36 × slots");
  checkRef(a.blockRoots, "blockRoots");
  need(isCount(a.blockRoots.blocks) && a.blockRoots.size === 32 * a.blockRoots.blocks, "blockRoots.blocks");
  checkTable(a.readTable, "readTable");
  need(a.readTable.records === slots, "readTable.records = slots");
  need(a.readTable.recordBytes === 98, "readTable.recordBytes = 98");
  checkRef(a.readPublic, "readPublic");
  rules.checkTable(a.readTable, a.readPublic, m.pir, "readTable", "readPublic");
  if (m.pathSplit === 0) {
    need(a.pathTable === undefined && a.pathPublic === undefined, "no path table when pathSplit is 0");
  } else {
    checkTable(a.pathTable, "pathTable");
    need(a.pathTable!.records === slots, "pathTable.records = slots");
    need(a.pathTable!.recordBytes === 32 * m.pathSplit, "pathTable.recordBytes = 32 × pathSplit");
    checkRef(a.pathPublic, "pathPublic");
    rules.checkTable(a.pathTable!, a.pathPublic!, m.pir, "pathTable", "pathPublic");
  }
  checkTable(a.nullifierTable, "nullifierTable");
  need(a.nullifierTable.recordBytes === 40, "nullifierTable.recordBytes = 40");
  need(isCount(a.nullifierTable.bucketBits) && a.nullifierTable.groups === 2 ** a.nullifierTable.bucketBits, "nullifierTable.bucketBits");
  need(isCount(a.nullifierTable.capacity) && a.nullifierTable.capacity === a.nullifierTable.perGroup, "nullifierTable.capacity");
  checkRef(a.nullifierPublic, "nullifierPublic");
  rules.checkTable(a.nullifierTable, a.nullifierPublic, m.pir, "nullifierTable", "nullifierPublic");
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
