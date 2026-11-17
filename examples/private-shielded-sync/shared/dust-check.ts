/**
 * The Dust snapshot's manifest (spec 00062 FR-012, FR-023, phase 9): canonical JSON, like the snapshot manifest
 * (`./manifest.ts`), whose SHA-256 is its identifier. Built at one height, it names what a wallet needs to confirm and
 * to spend its Dust:
 *
 * - **The check table**: the Dust commitment tree's leaves by position, record `p` the 32-byte little-endian commitment
 *   of the coin at position `p` for every `p` below `commitments`, read by PIR (record `p` is slot `p mod perGroup` of
 *   group `⌊p / perGroup⌋`, as in the read table). A wallet confirms the last coin it derived for a chain with it.
 * - **The commitment tree** (`tree`): its root, one root per block of 2^k leaves (public, `blockRoots`), and a path
 *   table holding each position's k lower siblings (read by PIR, `pathTable`, absent when k is 0). The tree is the
 *   Zswap tree's (height 32, the same leaf and node hashes), its leaves the commitments; the root equals the core's
 *   `dust_commitment_root` at `height`.
 * - **The generation tree** (`generation`): every generation record of the era at `height` (public, one file), from
 *   which a wallet builds the tree in its local state (the ledger computes each record's leaf); the root equals the
 *   core's `dust_generation_root`.
 * - `blockTime`: the block's time, in seconds. A spend built from these trees is dated at it: the chain checks a spend
 *   against the roots it recorded at the spend's time (the block at or before it).
 *
 * The generation file: `PSSDGEN1`, the record count (u32), then per record 88 bytes: the value (u128), the owner (a
 * field element, 32 bytes), the Night output's initial nonce (32 bytes) and the time its Night was spent (u64 seconds;
 * all ones when not spent), integers little-endian. Record `i` is generation index `i`.
 */

import type { SchemeName } from "../pir/scheme.ts";
import { type ArtifactRef, canonicalJson, type PirTableRef, type SchemeParams, snapshotId, validateSchemeTable } from "./manifest.ts";

/** Bytes of one check-table record: a commitment. */
export const DUST_CHECK_RECORD_BYTES = 32;
/** Bytes of one generation record in the generation file. */
export const DUST_GENERATION_RECORD_BYTES = 88;
const GENERATION_MAGIC = new TextEncoder().encode("PSSDGEN1");
const NOT_SPENT = (1n << 64n) - 1n;

export interface DustCheckManifest {
  readonly version: 2;
  /** The first height of the ledger era the snapshot covers. */
  readonly eraHeight: number;
  /** The block height it was built at. */
  readonly height: number;
  /** The block's time at `height`, in seconds since the Unix epoch. */
  readonly blockTime: number;
  /** The commitments listed: positions `0 … commitments − 1` (the core's `dust_commitment_first_free` at `height`). */
  readonly commitments: number;
  readonly scheme: SchemeName;
  /** The scheme's parameters. */
  readonly pir: SchemeParams;
  /** Requests in every call. */
  readonly queriesPerCall: number;
  readonly table: PirTableRef;
  /** The check table's public artifact (SimplePIR's setup data, IPIR+SP's masks), downloaded once per identifier. */
  readonly public: ArtifactRef;
  readonly tree: {
    /** k: the tree is cut k levels above the leaves. */
    readonly pathSplit: number;
    /** The root, 32 bytes little-endian, hexadecimal. */
    readonly root: string;
    readonly blockRoots: ArtifactRef & { readonly blocks: number };
    /** Each position's k lower siblings; absent when k is 0 (the block roots are then the leaves). */
    readonly pathTable?: PirTableRef;
    readonly pathPublic?: ArtifactRef;
  };
  readonly generation: {
    readonly records: number;
    /** The root, 32 bytes little-endian, hexadecimal. */
    readonly root: string;
    readonly file: ArtifactRef;
  };
}

function need(cond: boolean, what: string): void {
  if (!cond) throw new Error(`invalid Dust check manifest: ${what}`);
}

const isCount = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v >= 0;
const HEX32 = /^[0-9a-f]{64}$/;
const isRef = (r: ArtifactRef | undefined): boolean => typeof r === "object" && r !== null && HEX32.test(r.digest) && isCount(r.size);

/** Checks a Dust check manifest; a scheme this build does not know throws `SchemeUnavailable`. */
export function validateDustCheckManifest(m: DustCheckManifest): void {
  need(typeof m === "object" && m !== null, "not an object");
  need(m.version === 2, `version ${String(m.version)}`);
  for (const k of ["eraHeight", "height", "blockTime", "commitments"] as const) need(isCount(m[k]), k);
  need(m.commitments >= 1, "commitments ≥ 1");
  need(isCount(m.queriesPerCall) && m.queriesPerCall >= 1 && m.queriesPerCall <= 0xffff, "queriesPerCall");
  validateSchemeTable(m.scheme, m.pir, m.table, m.public, "table", "public");
  need(m.table.records === m.commitments, "table.records = commitments");
  need(m.table.recordBytes === DUST_CHECK_RECORD_BYTES, `table.recordBytes = ${DUST_CHECK_RECORD_BYTES}`);
  const t = m.tree;
  need(typeof t === "object" && t !== null, "tree");
  need(isCount(t.pathSplit) && t.pathSplit <= 20, "tree.pathSplit");
  need(HEX32.test(t.root), "tree.root");
  need(isRef(t.blockRoots) && isCount(t.blockRoots.blocks) && t.blockRoots.size === 32 * t.blockRoots.blocks, "tree.blockRoots");
  need(t.blockRoots.blocks === Math.ceil(m.commitments / 2 ** t.pathSplit), "tree.blockRoots.blocks = ⌈commitments / 2^k⌉");
  if (t.pathSplit === 0) {
    need(t.pathTable === undefined && t.pathPublic === undefined, "no path table when tree.pathSplit is 0");
  } else {
    need(t.pathTable !== undefined && t.pathPublic !== undefined, "tree.pathTable");
    validateSchemeTable(m.scheme, m.pir, t.pathTable!, t.pathPublic!, "tree.pathTable", "tree.pathPublic");
    need(t.pathTable!.records === m.commitments, "tree.pathTable.records = commitments");
    need(t.pathTable!.recordBytes === 32 * t.pathSplit, "tree.pathTable.recordBytes = 32 × pathSplit");
  }
  const g = m.generation;
  need(typeof g === "object" && g !== null && isCount(g.records) && HEX32.test(g.root), "generation");
  need(isRef(g.file) && g.file.size === GENERATION_MAGIC.length + 4 + DUST_GENERATION_RECORD_BYTES * g.records, "generation.file");
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

/** Where position `p` sits in a positional table of the snapshot: its group and its slot there. */
export function dustCheckCell(m: { readonly table: Pick<PirTableRef, "perGroup"> }, position: number): { group: number; slot: number } {
  return { group: Math.floor(position / m.table.perGroup), slot: position % m.table.perGroup };
}

// ── the generation file ──────────────────────────────────────────────────────────────────────────────────────────

/** A generation record (the ledger's `DustGenerationInfo`), as the generation file holds it. */
export interface DustGenerationRecord {
  /** Stars of Night. */
  readonly value: bigint;
  /** The Dust public key. */
  readonly owner: bigint;
  /** The Night output's initial nonce, 32 bytes, hexadecimal. */
  readonly nonce: string;
  /** When the Night output was spent, in seconds; null while it is not. */
  readonly dtime: number | null;
}

const putLe = (out: Uint8Array, at: number, value: bigint, bytes: number): void => {
  if (value < 0n || value >= 1n << BigInt(8 * bytes)) throw new Error(`a value outside ${bytes} bytes: ${value}`);
  let v = value;
  for (let i = 0; i < bytes; i++) {
    out[at + i] = Number(v & 0xffn);
    v >>= 8n;
  }
};
const getLe = (b: Uint8Array, at: number, bytes: number): bigint => {
  let v = 0n;
  for (let i = bytes - 1; i >= 0; i--) v = (v << 8n) | BigInt(b[at + i]!);
  return v;
};

export function encodeDustGenerationRecords(records: readonly DustGenerationRecord[]): Uint8Array {
  const out = new Uint8Array(GENERATION_MAGIC.length + 4 + DUST_GENERATION_RECORD_BYTES * records.length);
  out.set(GENERATION_MAGIC);
  new DataView(out.buffer).setUint32(GENERATION_MAGIC.length, records.length, true);
  records.forEach((r, i) => {
    const at = GENERATION_MAGIC.length + 4 + i * DUST_GENERATION_RECORD_BYTES;
    if (!/^[0-9a-f]{64}$/.test(r.nonce)) throw new Error(`record ${i}: a nonce is 32 bytes of hexadecimal`);
    putLe(out, at, r.value, 16);
    putLe(out, at + 16, r.owner, 32);
    for (let k = 0; k < 32; k++) out[at + 48 + k] = parseInt(r.nonce.slice(2 * k, 2 * k + 2), 16);
    putLe(out, at + 80, r.dtime === null ? NOT_SPENT : BigInt(r.dtime), 8);
  });
  return out;
}

export function decodeDustGenerationRecords(bytes: Uint8Array): DustGenerationRecord[] {
  if (bytes.length < GENERATION_MAGIC.length + 4 || GENERATION_MAGIC.some((b, i) => bytes[i] !== b)) throw new Error("not a Dust generation file: its first bytes are not PSSDGEN1");
  const count = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(GENERATION_MAGIC.length, true);
  if (bytes.length !== GENERATION_MAGIC.length + 4 + count * DUST_GENERATION_RECORD_BYTES) throw new Error(`a Dust generation file of ${count} records has ${bytes.length} bytes`);
  const out: DustGenerationRecord[] = [];
  for (let i = 0; i < count; i++) {
    const at = GENERATION_MAGIC.length + 4 + i * DUST_GENERATION_RECORD_BYTES;
    const dtime = getLe(bytes, at + 80, 8);
    if (dtime !== NOT_SPENT && dtime > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`record ${i}: a time beyond 2^53 seconds`);
    out.push({
      value: getLe(bytes, at, 16),
      owner: getLe(bytes, at + 16, 32),
      nonce: Array.from(bytes.subarray(at + 48, at + 80), (b) => b.toString(16).padStart(2, "0")).join(""),
      dtime: dtime === NOT_SPENT ? null : Number(dtime),
    });
  }
  return out;
}
