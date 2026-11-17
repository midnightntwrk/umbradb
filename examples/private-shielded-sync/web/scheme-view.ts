/**
 * What the step page shows of a snapshot's PIR scheme (spec 00058 FR-060): each table's shape and sizes, a call's plan,
 * and a call's request and answer bodies and a public artifact decoded part by part, each in the words of the scheme
 * in use. SimplePIR's texts are the page's earlier ones, unchanged. No DOM and no Node.js module: the page and its
 * worker bundle it, and the tests run it under Node.
 *
 * - **SimplePIR**: a table is R rows × C columns of cells; a request (a query vector) selects a column, one 32-bit value
 *   per column; an answer is one 32-bit value per row; the public artifact is the setup data H = table × A.
 * - **IPIR+SP**: a table is rows × columns of 16-bit cells; a request selects a row and is its header (`RNQ3` and the
 *   32-byte setup id), its key (2 × 2,048 numbers of 54 bits, 27,648 bytes) and one 49-bit number per row; an answer
 *   is its header (`RNR2`, the setup id, the SHA-256 of its request) and one 22-bit number per column; the public
 *   artifact is the table's two masks (`RNP3`, the setup id, then two numbers of 29 bits per column).
 */

import {
  IPIR_DIGITS,
  IPIR_HEADER_BYTES,
  IPIR_KEY_BYTES,
  IPIR_MASK_BITS,
  IPIR_P_BITS,
  IPIR_Q_BITS,
  IPIR_QUERY_BITS,
  IPIR_RESPONSE_BITS,
  IPIR_RING,
  ipirMasksBytes,
  ipirRequestBytes,
  ipirResponseBytes,
} from "../ipir/sizes.ts";
import type { SchemeName } from "../pir/scheme.ts";
import type { Manifest, NullifierTableRef, PirTableRef } from "../shared/manifest.ts";

type Json = Record<string, unknown>;

export const hex = (b: Uint8Array): string => Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
export const ascii4 = (b: Uint8Array): string => String.fromCharCode(...b.subarray(0, 4));
export const kb = (n: number): string => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`);
const count = (n: number): string => n.toLocaleString("en-US");

/** Up to `n` little-endian 32-bit words of `b` from byte `at`. */
export function u32s(b: Uint8Array, at: number, n: number): number[] {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const out: number[] = [];
  for (let i = 0; i < n && at + 4 * i + 4 <= b.length; i++) out.push(v.getUint32(at + 4 * i, true));
  return out;
}

/** `bits` bits of `bytes` from bit `offset`, least significant first (upstream's packing of every IPIR+SP number). */
export function readBits(bytes: Uint8Array, offset: number, bits: number): bigint {
  let value = 0n;
  for (let i = 0; i < bits; i++) {
    const bit = offset + i;
    if (((bytes[bit >>> 3] ?? 0) >>> (bit & 7)) & 1) value |= 1n << BigInt(i);
  }
  return value;
}

/** The first `n` numbers of `bits` bits each, packed from byte `at`, as decimal strings (54 bits exceed a double). */
export function packed(bytes: Uint8Array, at: number, bits: number, n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < n && 8 * at + (i + 1) * bits <= 8 * bytes.length; i++) out.push(readBits(bytes, 8 * at + i * bits, bits).toString());
  return out;
}

// ── tables ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** What a request selects, in the scheme's words: SimplePIR's group is a column, IPIR+SP's a row. */
export const GROUP: Readonly<Record<SchemeName, { one: string; many: string; short: string }>> = Object.freeze({
  simplepir: { one: "column", many: "columns", short: "col" },
  "ipir-sp": { one: "row", many: "rows", short: "row" },
});

/** The per-request byte lengths of an IPIR+SP table, by part (FR-060). */
export function ipirParts(rows: number, cols: number): Json {
  const selection = Math.ceil((IPIR_QUERY_BITS * rows) / 8);
  const coefficients = Math.ceil((IPIR_RESPONSE_BITS * cols) / 8);
  return {
    requestBytes: ipirRequestBytes(rows),
    request: { headerAndSetupId: IPIR_HEADER_BYTES, key: IPIR_KEY_BYTES, selection, selectionWords: rows, selectionBits: IPIR_QUERY_BITS },
    responseBytes: ipirResponseBytes(cols),
    response: { headerSetupIdAndRequestHash: IPIR_HEADER_BYTES + 32, coefficients, coefficientWords: cols, coefficientBits: IPIR_RESPONSE_BITS },
    masksBytes: ipirMasksBytes(cols),
  };
}

/**
 * A table's summary for the files and paths steps. SimplePIR: the fields the page showed before (rows, columns,
 * records per column). IPIR+SP: rows × columns of 16-bit cells, records per row and cells per record, and the
 * per-request byte lengths by part.
 */
export function tableSummary(scheme: SchemeName, ref: PirTableRef | NullifierTableRef, publicBytes?: number): Json {
  const l = ref.layout;
  const bucket = "bucketBits" in ref ? { bucketBits: ref.bucketBits, capacity: ref.capacity } : {};
  if (scheme === "simplepir") {
    if ("bucketBits" in ref) return { rows: l.rows, cols: l.cols, ...bucket };
    return { rows: l.rows, cols: l.cols, recordsPerColumn: ref.perGroup, records: ref.records, recordBytes: ref.recordBytes, ...(publicBytes === undefined ? {} : { setupBytes: publicBytes }) };
  }
  return {
    rows: l.rows,
    cols: l.cols,
    cellBits: IPIR_P_BITS,
    recordsPerRow: ref.perGroup,
    cellsPerRecord: l.cellsPerRecord,
    records: ref.records,
    recordBytes: ref.recordBytes,
    ...bucket,
    ...ipirParts(l.rows, l.cols),
    ...(publicBytes === undefined ? {} : { masksBytes: publicBytes }),
  };
}

/** One table's line in the files step, from {@link tableSummary}. */
export function tableText(scheme: SchemeName, which: "read" | "path" | "nullifier", t: Json): string {
  if (scheme === "simplepir") {
    if (which === "read") return `${t.rows} × ${t.cols} cells, ${t.recordsPerColumn} records of ${t.recordBytes} bytes per column, ${Number(t.records).toLocaleString("en-US")} records`;
    if (which === "path") return `${t.rows} × ${t.cols} cells, ${t.recordsPerColumn} records of ${t.recordBytes} bytes per column; its setup data, ${kb(Number(t.setupBytes))}, is downloaded only to spend (step 6)`;
    return `${t.rows} × ${t.cols} cells, ${t.bucketBits} bucket bits, capacity ${t.capacity}`;
  }
  const shape = `${count(Number(t.rows))} rows × ${count(Number(t.cols))} columns of ${t.cellBits}-bit cells`;
  const call = `a request ${count(Number(t.requestBytes))} B, its answer ${count(Number(t.responseBytes))} B`;
  if (which === "read") return `${shape}; a row holds ${t.recordsPerRow} records of ${t.recordBytes} bytes (${t.cellsPerRecord} cells each); ${count(Number(t.records))} records; ${call}`;
  if (which === "path") return `${shape}; a row holds ${t.recordsPerRow} records of ${t.recordBytes} bytes (${t.cellsPerRecord} cells each); ${call}; its masks, ${kb(Number(t.masksBytes))}, are downloaded only to spend (step 6)`;
  return `${shape}; ${t.bucketBits} bucket bits, a bucket is a row of up to ${t.capacity} entries; ${call}`;
}

/** The path step's table line, from {@link tableSummary}. */
export function pathTableText(scheme: SchemeName, t: Json): string {
  if (scheme === "simplepir") return `${t.rows} × ${t.cols} cells, ${t.recordsPerColumn} records of ${t.recordBytes} bytes per column (as wide as the noise check allows, so its setup data is small)`;
  return `${count(Number(t.rows))} rows × ${count(Number(t.cols))} columns of ${t.cellBits}-bit cells, ${t.recordsPerRow} records of ${t.recordBytes} bytes (${t.cellsPerRecord} cells each) per row; a request ${count(Number(t.requestBytes))} B, its answer ${count(Number(t.responseBytes))} B`;
}

// ── calls ────────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * A call's plan as the page lists it: SimplePIR's keys (`vectors`, `realColumns`, `paddingColumns`) as before; IPIR+SP's
 * `requests`, `realRows`, `paddingRows`. For the nullifier table the groups are buckets under both.
 */
export function callPlan(scheme: SchemeName, plan: readonly { real: readonly number[]; groups: readonly number[] }[], buckets: boolean, note?: string): Json[] {
  return plan.map((c, i) => {
    const real = [...c.real];
    const padding = c.groups.length - c.real.length;
    const size = scheme === "simplepir" ? { vectors: c.groups.length } : { requests: c.groups.length };
    const groups = buckets
      ? { realBuckets: real, paddingBuckets: padding }
      : scheme === "simplepir"
        ? { realColumns: real, paddingColumns: padding }
        : { realRows: real, paddingRows: padding };
    return { call: i + 1, ...size, ...groups, ...(note === undefined ? {} : { note }) };
  });
}

/** One call's line, from {@link callPlan}. */
export function callText(c: Json): string {
  const size = c.vectors !== undefined ? `${c.vectors} vectors` : `${c.requests} requests`;
  const list = (v: unknown): string => (v as number[]).join(", ");
  if (c.realBuckets !== undefined) return `call ${c.call}: ${size}, real buckets [${list(c.realBuckets)}], ${c.paddingBuckets} random`;
  if (c.realRows !== undefined) return `call ${c.call}: ${size}, real rows [${list(c.realRows)}], ${c.paddingRows} random`;
  return `call ${c.call}: ${size}, real columns [${list(c.realColumns)}], ${c.paddingColumns} random`;
}

/** Where a record sits, as the read and path steps list it: SimplePIR `column`/`slotInColumn`, IPIR+SP `row`/`slotInRow`. */
export function cellOf(scheme: SchemeName, group: number, slot: number): Json {
  return scheme === "simplepir" ? { column: group, slotInColumn: slot } : { row: group, slotInRow: slot };
}

/** A record's place, from {@link cellOf}. */
export function cellText(x: Json): string {
  return x.row !== undefined ? `row ${x.row}, slot ${x.slotInRow}` : `col ${x.column}, slot ${x.slotInColumn}`;
}

// ── bodies ───────────────────────────────────────────────────────────────────────────────────────────────────────

/** The table a query route reads, from the manifest of the call's snapshot. */
export function tableOfRoute(manifest: Manifest, route: string): PirTableRef | null {
  const a = manifest.artifacts;
  if (route === "/query/read") return a.readTable;
  if (route === "/query/path") return a.pathTable ?? null;
  if (route === "/query/nullifier") return a.nullifierTable;
  return null;
}

/** What the call header holds (`../shared/wire.ts`): magic, format version, snapshot identifier, count. */
function callHeader(b: Uint8Array): Json {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  return { magic: ascii4(b), formatVersion: v.getUint16(4, true), snapshotId: hex(b.subarray(6, 38)), count: v.getUint16(38, true) };
}

/** SimplePIR's query or answer body, decoded as the page decoded it before this project. */
function simplePirBody(b: Uint8Array, side: "request" | "response"): Json {
  const h = callHeader(b);
  const count = Number(h.count);
  const perVector = (b.length - 40) / 4 / Math.max(1, count);
  return {
    format: side === "request" ? "query body: 40-byte header, then the query vectors (u32, little-endian)" : "answer body: 40-byte header, then the answer vectors (u32, little-endian)",
    magic: h.magic,
    formatVersion: h.formatVersion,
    snapshotId: h.snapshotId,
    vectors: count,
    valuesPerVector: perVector,
    meaning:
      side === "request"
        ? `each vector is A·s + e + Δ·u over the table's ${perVector} columns: one is the wanted column (or a random padding column), the server cannot tell which`
        : `each vector is the table (${perVector} rows) times one query vector; only the client can remove A·s and read its column`,
    firstValuesOfVector0: u32s(b, 40, 8),
  };
}

/** How many numbers of each part the decoded panel lists. */
const SHOWN = 6;

/** One IPIR+SP request (`RNQ3`), part by part. */
export function ipirRequestParts(r: Uint8Array, rows: number): Json {
  const keyAt = IPIR_HEADER_BYTES;
  const selectionAt = keyAt + IPIR_KEY_BYTES;
  return {
    header: { bytes: IPIR_HEADER_BYTES, magic: ascii4(r), setupId: hex(r.subarray(4, 36)) },
    key: {
      bytes: IPIR_KEY_BYTES,
      numbers: `${IPIR_DIGITS} × ${count(IPIR_RING)} numbers of ${IPIR_Q_BITS} bits (the key the server packs the answer with; made from this request's own secret)`,
      first: packed(r, keyAt, IPIR_Q_BITS, SHOWN),
    },
    selection: {
      bytes: r.length - selectionAt,
      numbers: `${count(rows)} numbers of ${IPIR_QUERY_BITS} bits, one per table row: together they encrypt a 1 at the wanted row and 0 at the others, so the server cannot tell which`,
      first: packed(r, selectionAt, IPIR_QUERY_BITS, SHOWN),
    },
  };
}

/** One IPIR+SP answer (`RNR2`), part by part; `request` (when known) is checked against the hash it carries. */
export function ipirResponseParts(a: Uint8Array, cols: number, request: Uint8Array | null, sha256: (b: Uint8Array) => Uint8Array): Json {
  const digest = hex(a.subarray(36, 68));
  return {
    header: {
      bytes: IPIR_HEADER_BYTES + 32,
      magic: ascii4(a),
      setupId: hex(a.subarray(4, 36)),
      requestSha256: digest,
      ...(request === null ? {} : { equalsSha256OfItsRequest: hex(sha256(request)) === digest }),
    },
    coefficients: {
      bytes: a.length - IPIR_HEADER_BYTES - 32,
      numbers: `${count(cols)} numbers of ${IPIR_RESPONSE_BITS} bits, one per table column; only the request's secret turns them into the row's ${count(cols)} cells`,
      first: packed(a, IPIR_HEADER_BYTES + 32, IPIR_RESPONSE_BITS, SHOWN),
    },
  };
}

/**
 * A query route's body, decoded for the request panel. SimplePIR's as before. IPIR+SP's: the call header, then each
 * request's (or answer's) parts with their byte counts, shown for the first; the requests' setup ids are checked equal,
 * and each answer's request hash against its request when the call's request body is given.
 */
export function describeCallBody(
  scheme: SchemeName,
  side: "request" | "response",
  b: Uint8Array,
  table: PirTableRef | null,
  request: Uint8Array | null,
  sha256: (b: Uint8Array) => Uint8Array,
): Json {
  if (scheme === "simplepir") return simplePirBody(b, side);
  const h = callHeader(b);
  const n = Math.max(1, Number(h.count));
  const each = (b.length - 40) / n;
  const generic = {
    format: `${side === "request" ? "query" : "answer"} body: 40-byte header, then ${h.count} ${side === "request" ? "requests" : "responses"} of the ${scheme} scheme`,
    magic: h.magic,
    formatVersion: h.formatVersion,
    snapshotId: h.snapshotId,
    vectors: h.count,
    bytesPerItem: each,
  };
  if (table === null) return generic;
  const { rows, cols } = table.layout;
  const expected = side === "request" ? ipirRequestBytes(rows) : ipirResponseBytes(cols);
  if (each !== expected || !Number.isInteger(each)) return { ...generic, note: `not ${expected}-byte items: decoded generically` };
  const item = (i: number): Uint8Array => b.subarray(40 + i * each, 40 + (i + 1) * each);
  const setupIds = new Set(Array.from({ length: n }, (_, i) => hex(item(i).subarray(4, 36))));
  if (side === "request") {
    return {
      format: `query body: 40-byte call header, then ${h.count} IPIR+SP requests of ${count(each)} bytes, each its own secret and key`,
      callHeader: { bytes: 40, ...h },
      requests: h.count,
      bytesPerRequest: each,
      partsOfEachRequest: `${IPIR_HEADER_BYTES} (RNQ3 and setup id) + ${count(IPIR_KEY_BYTES)} (key) + ${count(each - IPIR_HEADER_BYTES - IPIR_KEY_BYTES)} (${count(rows)} × ${IPIR_QUERY_BITS} bits) = ${count(each)} bytes`,
      request0: ipirRequestParts(item(0), rows),
      sameSetupIdInEveryRequest: setupIds.size === 1,
      meaning: `each request selects one of the table's ${count(rows)} rows (the wanted one, or a random padding row); the server cannot tell which`,
    };
  }
  const reqEach = ipirRequestBytes(rows);
  const requestOf = (i: number): Uint8Array | null =>
    request !== null && request.length === 40 + n * reqEach ? request.subarray(40 + i * reqEach, 40 + (i + 1) * reqEach) : null;
  const hashes = request === null ? null : Array.from({ length: n }, (_, i) => {
    const r = requestOf(i);
    return r !== null && hex(sha256(r)) === hex(item(i).subarray(36, 68));
  });
  return {
    format: `answer body: 40-byte call header, then ${h.count} IPIR+SP answers of ${count(each)} bytes, one per request, in order`,
    callHeader: { bytes: 40, ...h },
    answers: h.count,
    bytesPerAnswer: each,
    partsOfEachAnswer: `${IPIR_HEADER_BYTES + 32} (RNR2, setup id, SHA-256 of the request) + ${count(each - IPIR_HEADER_BYTES - 32)} (${count(cols)} × ${IPIR_RESPONSE_BITS} bits) = ${count(each)} bytes`,
    answer0: ipirResponseParts(item(0), cols, requestOf(0), sha256),
    sameSetupIdInEveryAnswer: setupIds.size === 1,
    ...(hashes === null ? {} : { everyAnswerCarriesItsRequestsSha256: hashes.every(Boolean) }),
    meaning: `each answer is the table's packed reply to one request; only that request's secret decodes it, into the row's ${count(cols)} cells`,
  };
}

/** A public artifact (setup data, masks), decoded for the request panel; `cols` is its table's column count. */
export function describePublicArtifact(scheme: SchemeName, b: Uint8Array, cols: number | null): Json {
  if (scheme === "simplepir") return { layout: `rows × 1024 u32 (H = table × A), ${b.length / 4 / 1024} rows`, firstValues: u32s(b, 0, 8) };
  if (cols === null) return {};
  const maskBytes = Math.ceil((IPIR_MASK_BITS * cols) / 8);
  return {
    layout: `${IPIR_HEADER_BYTES}-byte header (RNP3 and the setup id), then two masks of ${count(cols)} numbers of ${IPIR_MASK_BITS} bits, one per table column (${count(maskBytes)} bytes each)`,
    magic: ascii4(b),
    setupId: hex(b.subarray(4, 36)),
    firstMask: packed(b, IPIR_HEADER_BYTES, IPIR_MASK_BITS, SHOWN),
    secondMask: packed(b, IPIR_HEADER_BYTES + maskBytes, IPIR_MASK_BITS, SHOWN),
    meaning: "public: every wallet downloads the same masks once per snapshot; with them and a request's secret it decodes an answer",
  };
}

// ── the wallet's WebAssembly ─────────────────────────────────────────────────────────────────────────────────────

/**
 * Compiles the wallet's IPIR+SP WebAssembly only if its SHA-256 (from `digest`, lower-case hex) equals `expected`, the
 * committed digest built into the page (FR-031); throws otherwise, naming both.
 */
export async function compileChecked(bytes: Uint8Array, expected: string, digest: (b: Uint8Array) => Promise<string>): Promise<WebAssembly.Module> {
  const got = await digest(bytes);
  if (got !== expected) throw new Error(`the IPIR+SP WebAssembly's SHA-256 is ${got}, not the committed ${expected}`);
  return WebAssembly.compile(bytes as Uint8Array<ArrayBuffer>);
}
