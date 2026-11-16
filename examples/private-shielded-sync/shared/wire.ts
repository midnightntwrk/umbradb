/**
 * Binary wire formats of the module's HTTP API (spec §5.7, FR-081), defined once for the server and the client.
 * Integers are little-endian.
 *
 * Query body (`POST /query/read`, `/query/path`, `/query/nullifier`), 40-byte header then the requests:
 *
 * | Offset | Bytes | Field |
 * |---|---|---|
 * | 0 | 4 | Magic `PSSQ` |
 * | 4 | 2 | Format version |
 * | 6 | 32 | Snapshot identifier |
 * | 38 | 2 | Request count |
 * | 40 | count × request bytes | The requests, one after the other |
 *
 * Answer body: the same header with magic `PSSA`, then count × response bytes, one response per request in order.
 *
 * The bytes after the header are the PIR scheme's (`../pir/scheme.ts`, 00058 FR-022): the table gives the length of
 * one request and of one response, and this file checks only that a body is whole. Under SimplePIR a request is the
 * table's C query values and a response its R answer values, 32-bit little-endian.
 *
 * Tail body (`GET /tail`), 132-byte header then four sections in this order: commitments (32 bytes each), outputs
 * (`TAIL_OUTPUT_BYTES` each), nullifiers (`NULLIFIER_RECORD_BYTES` each), block roots (32 bytes each):
 *
 * | Offset | Bytes | Field |
 * |---|---|---|
 * | 0 | 4 | Magic `PSST` |
 * | 4 | 2 | Format version |
 * | 6 | 2 | Reserved, zero |
 * | 8 | 32 | Snapshot identifier |
 * | 40 | 4 | Height |
 * | 44 | 32 | Block hash |
 * | 76 | 8 | `first_free` |
 * | 84 | 32 | Root (field element, little-endian) |
 * | 116 | 16 | Section lengths in bytes (u32 each): commitments, outputs, nullifiers, block roots |
 */

import { FORMAT_VERSION } from "./constants.ts";
import { HASH_BYTES, NULLIFIER_RECORD_BYTES, TAIL_OUTPUT_BYTES } from "./records.ts";

const ascii = (s: string): number => new DataView(new TextEncoder().encode(s).buffer).getUint32(0, true);
const QUERY_MAGIC = ascii("PSSQ");
const ANSWER_MAGIC = ascii("PSSA");
const TAIL_MAGIC = ascii("PSST");

/** Bytes of the query and answer headers. */
export const CALL_HEADER_BYTES = 40;
/** Bytes of the tail header. */
export const TAIL_HEADER_BYTES = 132;
export const SNAPSHOT_ID_BYTES = 32;
export const MAX_VECTOR_COUNT = 0xffff;

/** A query or answer body: its header's fields, and the `count` requests or responses after it. */
export interface CallBody {
  readonly snapshotId: Uint8Array;
  readonly count: number;
  /** `count` items of the scheme's request (or response) length, one after the other. */
  readonly payload: Uint8Array;
}

function checkItemBytes(itemBytes: number): void {
  if (!Number.isSafeInteger(itemBytes) || itemBytes < 1) throw new Error(`a request or response must be at least 1 byte: ${itemBytes}`);
}

function encodeCall(magic: number, body: CallBody, itemBytes: number): Uint8Array {
  checkItemBytes(itemBytes);
  if (body.snapshotId.length !== SNAPSHOT_ID_BYTES) throw new Error("snapshot identifier must be 32 bytes");
  if (!Number.isInteger(body.count) || body.count < 1 || body.count > MAX_VECTOR_COUNT) {
    throw new Error(`vector count out of range: ${body.count}`);
  }
  if (body.payload.length !== body.count * itemBytes) {
    throw new Error(`expected ${body.count} × ${itemBytes} bytes, got ${body.payload.length}`);
  }
  const out = new Uint8Array(CALL_HEADER_BYTES + body.payload.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, magic, true);
  view.setUint16(4, FORMAT_VERSION, true);
  out.set(body.snapshotId, 6);
  view.setUint16(38, body.count, true);
  out.set(body.payload, CALL_HEADER_BYTES);
  return out;
}

/** Why a body was refused; `status` is the HTTP status the server answers with. */
export class WireError extends Error {
  readonly status: 400 | 409 | 413;
  constructor(message: string, status: 400 | 409 | 413) {
    super(message);
    this.status = status;
  }
}

function decodeCall(
  magic: number,
  what: string,
  bytes: Uint8Array,
  itemBytes: number,
  expect: { count?: number; snapshotId?: Uint8Array },
): CallBody {
  checkItemBytes(itemBytes);
  if (bytes.length < CALL_HEADER_BYTES) throw new WireError(`${what} shorter than its header`, 400);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(0, true) !== magic) throw new WireError(`not a ${what}`, 400);
  if (view.getUint16(4, true) !== FORMAT_VERSION) throw new WireError(`${what} has format version ${view.getUint16(4, true)}`, 400);
  const snapshotId = bytes.slice(6, 38);
  const count = view.getUint16(38, true);
  if (count < 1) throw new WireError(`${what} carries no vectors`, 400);
  if (expect.count !== undefined && count !== expect.count) {
    throw new WireError(`${what} carries ${count} vectors; exactly ${expect.count} are required`, 400);
  }
  // Another snapshot is 409 before the length is checked: a call built for a replaced snapshot has that snapshot's
  // request length, so its length differs too, and the client must learn the snapshot changed (FR-067).
  if (expect.snapshotId && !equalBytes(snapshotId, expect.snapshotId)) {
    throw new WireError(`${what} names another snapshot`, 409);
  }
  const expected = CALL_HEADER_BYTES + count * itemBytes;
  if (bytes.length !== expected) throw new WireError(`${what} must be ${expected} bytes, got ${bytes.length}`, 400);
  // A view, not a copy: the scheme copies what it needs aligned.
  return { snapshotId, count, payload: bytes.subarray(CALL_HEADER_BYTES) };
}

/** Encodes a query call: `count` requests of `requestBytes` each (the table's, from its scheme). */
export function encodeQueryBody(body: CallBody, requestBytes: number): Uint8Array {
  return encodeCall(QUERY_MAGIC, body, requestBytes);
}

/**
 * Decodes a query call to a table whose requests are `requestBytes` long, strictly: exact length, `queriesPerCall`
 * requests when given (FR-065), and the current snapshot when given (409 otherwise, FR-067).
 */
export function decodeQueryBody(
  bytes: Uint8Array,
  requestBytes: number,
  expect: { queriesPerCall?: number; snapshotId?: Uint8Array } = {},
): CallBody {
  return decodeCall(QUERY_MAGIC, "query body", bytes, requestBytes, { count: expect.queriesPerCall, snapshotId: expect.snapshotId });
}

/** Encodes an answer: `count` responses of `responseBytes` each. */
export function encodeAnswerBody(body: CallBody, responseBytes: number): Uint8Array {
  return encodeCall(ANSWER_MAGIC, body, responseBytes);
}

export function decodeAnswerBody(
  bytes: Uint8Array,
  responseBytes: number,
  expect: { count?: number; snapshotId?: Uint8Array } = {},
): CallBody {
  return decodeCall(ANSWER_MAGIC, "answer body", bytes, responseBytes, expect);
}

/** The request-body limit of a query route (FR-079): `queriesPerCall` requests of at most `requestBytes`. */
export function queryBodyLimit(queriesPerCall: number, requestBytes: number): number {
  return CALL_HEADER_BYTES + queriesPerCall * requestBytes;
}

/** The tail header's fields. */
export interface TailHeader {
  readonly snapshotId: Uint8Array;
  readonly height: number;
  readonly blockHash: Uint8Array;
  readonly firstFree: number;
  readonly root: Uint8Array;
  /** Byte lengths of the four sections. */
  readonly sections: TailSectionLengths;
}

export interface TailSectionLengths {
  readonly commitments: number;
  readonly outputs: number;
  readonly nullifiers: number;
  readonly blockRoots: number;
}

/** Entry size of each tail section. */
export const TAIL_ENTRY_BYTES: TailSectionLengths = Object.freeze({
  commitments: HASH_BYTES,
  outputs: TAIL_OUTPUT_BYTES,
  nullifiers: NULLIFIER_RECORD_BYTES,
  blockRoots: HASH_BYTES,
});

const SECTION_ORDER = ["commitments", "outputs", "nullifiers", "blockRoots"] as const;

export function encodeTailHeader(h: TailHeader): Uint8Array {
  for (const [what, b] of [["snapshot identifier", h.snapshotId], ["block hash", h.blockHash], ["root", h.root]] as const) {
    if (b.length !== 32) throw new Error(`${what} must be 32 bytes`);
  }
  if (!Number.isSafeInteger(h.firstFree) || h.firstFree < 0) throw new Error("first_free out of range");
  const out = new Uint8Array(TAIL_HEADER_BYTES);
  const view = new DataView(out.buffer);
  view.setUint32(0, TAIL_MAGIC, true);
  view.setUint16(4, FORMAT_VERSION, true);
  view.setUint16(6, 0, true);
  out.set(h.snapshotId, 8);
  view.setUint32(40, h.height, true);
  out.set(h.blockHash, 44);
  view.setBigUint64(76, BigInt(h.firstFree), true);
  out.set(h.root, 84);
  SECTION_ORDER.forEach((name, i) => {
    const len = h.sections[name];
    if (!Number.isInteger(len) || len < 0 || len > 0xffffffff || len % TAIL_ENTRY_BYTES[name] !== 0) {
      throw new Error(`tail section ${name} has an invalid length ${len}`);
    }
    view.setUint32(116 + 4 * i, len, true);
  });
  return out;
}

export function decodeTailHeader(bytes: Uint8Array): TailHeader {
  if (bytes.length < TAIL_HEADER_BYTES) throw new WireError("tail shorter than its header", 400);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(0, true) !== TAIL_MAGIC) throw new WireError("not a tail", 400);
  if (view.getUint16(4, true) !== FORMAT_VERSION) throw new WireError(`tail has format version ${view.getUint16(4, true)}`, 400);
  if (view.getUint16(6, true) !== 0) throw new WireError("tail reserved field is not zero", 400);
  const firstFree = view.getBigUint64(76, true);
  if (firstFree > BigInt(Number.MAX_SAFE_INTEGER)) throw new WireError("tail first_free out of range", 400);
  const lengths = SECTION_ORDER.map((_, i) => view.getUint32(116 + 4 * i, true));
  const sections = Object.fromEntries(SECTION_ORDER.map((n, i) => [n, lengths[i]!])) as unknown as TailSectionLengths;
  for (const name of SECTION_ORDER) {
    if (sections[name] % TAIL_ENTRY_BYTES[name] !== 0) throw new WireError(`tail section ${name} is not whole entries`, 400);
  }
  return {
    snapshotId: bytes.slice(8, 40),
    height: view.getUint32(40, true),
    blockHash: bytes.slice(44, 76),
    firstFree: Number(firstFree),
    root: bytes.slice(84, 116),
    sections,
  };
}

/** Splits a whole tail body into its header and sections, checking the total length. */
export function splitTail(bytes: Uint8Array): { header: TailHeader } & Record<(typeof SECTION_ORDER)[number], Uint8Array> {
  const header = decodeTailHeader(bytes);
  const total = TAIL_HEADER_BYTES + SECTION_ORDER.reduce((a, n) => a + header.sections[n], 0);
  if (bytes.length !== total) throw new WireError(`tail must be ${total} bytes, got ${bytes.length}`, 400);
  let off = TAIL_HEADER_BYTES;
  const parts = {} as Record<(typeof SECTION_ORDER)[number], Uint8Array>;
  for (const name of SECTION_ORDER) {
    parts[name] = bytes.subarray(off, off + header.sections[name]);
    off += header.sections[name];
  }
  return { header, ...parts };
}

export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
