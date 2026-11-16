/** Wire formats, records and the manifest (spec §5.7, FR-021–022, FR-030, FR-060, FR-065, FR-067, FR-081). */

import { createHash, randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  CALL_HEADER_BYTES,
  canonicalJson,
  decodeAnswerBody,
  decodeManifest,
  decodeQueryBody,
  decodePathRecord,
  decodeReadRecord,
  decodeTailHeader,
  decodeTailOutput,
  encodeAnswerBody,
  encodeManifest,
  encodeQueryBody,
  encodePathRecord,
  encodeReadRecord,
  encodeTailHeader,
  encodeTailOutput,
  FORMAT_VERSION,
  type Manifest,
  NULLIFIER_RECORD_BYTES,
  queryBodyLimit,
  pathRecordBytes,
  READ_RECORD_BYTES,
  rebuildElements,
  ROUTES,
  scanEntry,
  SHRUNK_ELEMENTS_BYTES,
  shrinkElements,
  snapshotId,
  splitTail,
  TAIL_HEADER_BYTES,
  TAIL_OUTPUT_BYTES,
  type TailHeader,
  toHex,
  WireError,
} from "../shared/index.ts";
import { SchemeUnavailable } from "../pir/scheme.ts";

const bytes = (n: number) => new Uint8Array(randomBytes(n));

/**
 * A call body after its header is the scheme's bytes (00058 FR-022): `count` requests (or responses) of a length the
 * table gives. Here a SimplePIR table of 17 columns and 5 rows: requests of 17 × 4 bytes, responses of 5 × 4.
 */
describe("query and answer bodies", () => {
  const id = bytes(32);

  it("round-trip, with a 40-byte header: magic, version, snapshot, count", () => {
    const payload = bytes(3 * 17 * 4);
    const body = encodeQueryBody({ snapshotId: id, count: 3, payload }, 17 * 4);
    expect(body.length).toBe(CALL_HEADER_BYTES + 3 * 17 * 4);
    expect(new TextDecoder().decode(body.subarray(0, 4))).toBe("PSSQ");
    expect(body[4]).toBe(FORMAT_VERSION);
    expect(body[38]).toBe(3);
    const back = decodeQueryBody(body, 17 * 4, { queriesPerCall: 3, snapshotId: id });
    expect(back.payload).toEqual(payload);
    expect(back.snapshotId).toEqual(id);
    const answer = encodeAnswerBody({ snapshotId: id, count: 3, payload: bytes(3 * 5 * 4) }, 5 * 4);
    expect(new TextDecoder().decode(answer.subarray(0, 4))).toBe("PSSA");
    expect(decodeAnswerBody(answer, 5 * 4, { count: 3 }).count).toBe(3);
  });

  it("decode from an unaligned offset", () => {
    const payload = bytes(2 * 9 * 4);
    const body = encodeQueryBody({ snapshotId: id, count: 2, payload }, 9 * 4);
    const shifted = new Uint8Array(body.length + 1);
    shifted.set(body, 1);
    expect(decodeQueryBody(shifted.subarray(1), 9 * 4).payload).toEqual(payload);
  });

  it("are refused when anything is off (400), or name another snapshot (409)", () => {
    const body = encodeQueryBody({ snapshotId: id, count: 2, payload: bytes(2 * 9 * 4) }, 9 * 4);
    const refuse = (b: Uint8Array, expect: Parameters<typeof decodeQueryBody>[2] = {}, requestBytes = 9 * 4) => {
      try {
        decodeQueryBody(b, requestBytes, expect);
      } catch (e) {
        return (e as WireError).status;
      }
      return 0;
    };
    expect(refuse(body.subarray(0, 39))).toBe(400);
    expect(refuse(body.subarray(0, body.length - 1))).toBe(400);
    expect(refuse(Uint8Array.of(...body, 0))).toBe(400);
    expect(refuse(body, {}, 10 * 4)).toBe(400);
    const magic = body.slice();
    magic[0] = 0;
    expect(refuse(magic)).toBe(400);
    const version = body.slice();
    version[4] = 9;
    expect(refuse(version)).toBe(400);
    expect(refuse(body, { queriesPerCall: 32 })).toBe(400);
    expect(refuse(body, { snapshotId: bytes(32) })).toBe(409);
    // A call for a replaced snapshot has that snapshot's request length: still 409, not 400 (FR-067).
    expect(refuse(body, { snapshotId: bytes(32) }, 10 * 4)).toBe(409);
    expect(refuse(encodeAnswerBody({ snapshotId: id, count: 2, payload: bytes(18 * 4) }, 9 * 4))).toBe(400);
    expect(refuse(body)).toBe(0);
  });

  it("size the query routes' body limit as queriesPerCall × the largest request plus the header (FR-079); SimplePIR's request is C × 4", () => {
    expect(queryBodyLimit(32, 25_000 * 4)).toBe(40 + 32 * 25_000 * 4);
  });

  it("refuse to encode an inconsistent call, or a request length below 1 byte", () => {
    expect(() => encodeQueryBody({ snapshotId: id, count: 2, payload: bytes(5 * 4) }, 3 * 4)).toThrow();
    expect(() => encodeQueryBody({ snapshotId: bytes(31), count: 1, payload: bytes(3 * 4) }, 3 * 4)).toThrow();
    expect(() => encodeQueryBody({ snapshotId: id, count: 0, payload: bytes(0) }, 3 * 4)).toThrow();
    expect(() => decodeQueryBody(encodeQueryBody({ snapshotId: id, count: 1, payload: bytes(4) }, 4), 0)).toThrow(/at least 1 byte/);
  });
});

describe("records", () => {
  it("scan entry: point and first 4 bytes of element 0, or 36 zeros (FR-030)", () => {
    const ct = bytes(224);
    expect(scanEntry(ct)).toEqual(ct.subarray(0, 36));
    expect(scanEntry(null)).toEqual(new Uint8Array(36));
  });

  it("read record: 98 bytes, the commitment's first 16 and elements 1–5 shrunk to 82; zeros without a ciphertext (FR-060, Q58)", () => {
    expect(READ_RECORD_BYTES).toBe(98);
    expect(SHRUNK_ELEMENTS_BYTES).toBe(82);
    const commitment = bytes(32);
    const ct = bytes(224);
    const enc = encodeReadRecord(commitment, ct);
    expect(enc.length).toBe(98);
    const r = decodeReadRecord(enc);
    expect(r.commitmentPrefix).toEqual(commitment.subarray(0, 16));
    // Element 1's first byte, element 2, element 3's first byte, element 4, element 5's first 16 bytes.
    const e = (i: number) => ct.subarray(32 + 32 * i, 64 + 32 * i);
    expect(r.elements).toEqual(new Uint8Array([...e(1).subarray(0, 1), ...e(2), ...e(3).subarray(0, 1), ...e(4), ...e(5).subarray(0, 16)]));
    expect(shrinkElements(ct)).toEqual(r.elements);
    const bare = decodeReadRecord(encodeReadRecord(commitment, null));
    expect(bare).toEqual({ commitmentPrefix: commitment.subarray(0, 16), elements: null });
    expect(() => decodeReadRecord(new Uint8Array(97))).toThrow(/98 bytes/);
  });

  it("elements 1–5 rebuilt from their shrunk form and the pads equal the ciphertext's, the ledger's field arithmetic", () => {
    const p = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;
    const big = (b: Uint8Array) => b.reduceRight((v, x) => (v << 8n) | BigInt(x), 0n);
    const le = (v: bigint) => Uint8Array.from({ length: 32 }, (_, i) => Number((v >> BigInt(8 * i)) & 0xffn));
    const below = (bits: number) => big(bytes(32)) & ((1n << BigInt(bits)) - 1n);
    for (let trial = 0; trial < 200; trial++) {
      // Pads anywhere in the field. In the last trials the pads of elements 2 and 4 sit right under the prime, so their
      // 31-byte messages wrap past it: those elements are kept whole, so they are still exact. (A 1- or 16-byte message
      // wraps only when its pad is within 2^8 or 2^128 of the prime: 2^-247 or 2^-127 for a pad uniform in the field.)
      const pads = Array.from({ length: 6 }, (_, i) => (trial >= 190 && (i === 2 || i === 4) ? p - 1n - below(64) : big(bytes(32)) % p));
      // Messages as the ledger's coin encodes them: 1 byte, 31 bytes, 1 byte, 31 bytes, 16 bytes.
      const messages = [0n, below(8), below(248), below(8), below(248), below(128)];
      const ct = new Uint8Array(224);
      ct.set(bytes(32), 0);
      pads.forEach((pad, i) => ct.set(le((pad + messages[i]!) % p), 32 + 32 * i));
      const padBytes = new Uint8Array(192);
      pads.forEach((pad, i) => padBytes.set(le(pad), 32 * i));
      expect(rebuildElements(shrinkElements(ct), padBytes), `trial ${trial}`).toEqual(ct.subarray(64));
    }
  });

  it("path record: the k lower hashes, 32k bytes; zeros outside the full blocks; no table at k = 0 (Q58)", () => {
    for (const k of [1, 8, 16]) {
      expect(pathRecordBytes(k)).toBe(32 * k);
      const path = Array.from({ length: k }, () => bytes(32));
      expect(decodePathRecord(encodePathRecord(path, k), k)).toEqual(path);
      expect(encodePathRecord(null, k)).toEqual(new Uint8Array(32 * k));
      expect(decodePathRecord(new Uint8Array(32 * k), k)).toBeNull();
    }
    expect(() => pathRecordBytes(0)).toThrow(/path split/);
    expect(() => encodePathRecord([bytes(32)], 2)).toThrow(/2 hashes/);
  });

  it("tail output: flags, commitment, ciphertext (257 bytes)", () => {
    const o = { commitment: bytes(32), ciphertext: bytes(224) };
    expect(TAIL_OUTPUT_BYTES).toBe(257);
    expect(decodeTailOutput(encodeTailOutput(o))).toEqual(o);
    expect(decodeTailOutput(encodeTailOutput({ ...o, ciphertext: null }))).toEqual({ ...o, ciphertext: null });
  });
});

describe("tail header", () => {
  const header: TailHeader = {
    snapshotId: bytes(32),
    height: 3_400_000,
    blockHash: bytes(32),
    firstFree: 2 ** 33 + 5,
    root: bytes(32),
    sections: { commitments: 3 * 32, outputs: 2 * TAIL_OUTPUT_BYTES, nullifiers: 4 * NULLIFIER_RECORD_BYTES, blockRoots: 32 },
  };

  it("round-trips its fields and splits a whole tail into sections", () => {
    const h = encodeTailHeader(header);
    expect(h.length).toBe(TAIL_HEADER_BYTES);
    expect(decodeTailHeader(h)).toEqual(header);
    const s = header.sections;
    const body = new Uint8Array(TAIL_HEADER_BYTES + s.commitments + s.outputs + s.nullifiers + s.blockRoots);
    body.set(h);
    body.fill(1, TAIL_HEADER_BYTES, TAIL_HEADER_BYTES + s.commitments);
    const parts = splitTail(body);
    expect(parts.commitments.length).toBe(96);
    expect(parts.commitments.every((b) => b === 1)).toBe(true);
    expect(parts.outputs.length).toBe(2 * 257);
    expect(parts.nullifiers.length).toBe(160);
    expect(parts.blockRoots.length).toBe(32);
    expect(() => splitTail(body.subarray(0, body.length - 1))).toThrow(/bytes/);
  });

  it("refuses sections that are not whole entries", () => {
    expect(() => encodeTailHeader({ ...header, sections: { ...header.sections, outputs: 256 } })).toThrow(/invalid length/);
    const h = encodeTailHeader(header);
    new DataView(h.buffer).setUint32(116, 33, true);
    expect(() => decodeTailHeader(h)).toThrow(/whole entries/);
  });
});

describe("manifest (FR-021, FR-022)", () => {
  const hex32 = () => toHex(bytes(32));
  const manifest = (): Manifest => ({
    formatVersion: FORMAT_VERSION,
    scheme: "simplepir",
    network: "preprod",
    genesisHash: hex32(),
    height: 3_400_000,
    blockHash: hex32(),
    firstFree: 1000,
    root: hex32(),
    pathSplit: 16,
    queriesPerCall: 32,
    pir: { logQ: 32, n: 1024, sigma: 6.4, cellBits: 9, plainModulus: 512 },
    artifacts: {
      scan: { digest: hex32(), size: 36_000 },
      blockRoots: { digest: hex32(), size: 32, blocks: 1 },
      readTable: { digest: hex32(), size: 32 + 88 * 1000 * 2, records: 1000, recordBytes: 98, groups: 1000, perGroup: 1, layout: { rows: 88, cols: 1000, cellsPerRecord: 88, seed: hex32() } },
      readPublic: { digest: hex32(), size: 88 * 1024 * 4 },
      pathTable: { digest: hex32(), size: 32 + 456 * 1000 * 2, records: 1000, recordBytes: 512, groups: 1000, perGroup: 1, layout: { rows: 456, cols: 1000, cellsPerRecord: 456, seed: hex32() } },
      pathPublic: { digest: hex32(), size: 456 * 1024 * 4 },
      nullifierTable: { digest: hex32(), size: 32 + 36 * 3 * 16 * 2, records: 20, recordBytes: 40, groups: 16, perGroup: 3, layout: { rows: 108, cols: 16, cellsPerRecord: 36, seed: hex32() }, bucketBits: 4, capacity: 3 },
      nullifierPublic: { digest: hex32(), size: 108 * 1024 * 4 },
    },
  });

  it("is canonical JSON, so its snapshot identifier does not depend on key order", () => {
    const m = manifest();
    // The same manifest with every object's keys in reverse order.
    const reorder = (v: unknown): unknown =>
      v && typeof v === "object" ? Object.fromEntries(Object.entries(v).reverse().map(([k, x]) => [k, reorder(x)])) : v;
    const shuffled = reorder(m) as Manifest;
    expect(Object.keys(shuffled)[0]).toBe("artifacts");
    const a = encodeManifest(m);
    expect(encodeManifest(shuffled)).toEqual(a);
    expect(snapshotId(a)).toEqual(new Uint8Array(createHash("sha256").update(a).digest()));
    expect(decodeManifest(a)).toEqual(m);
    expect(new TextDecoder().decode(a)).toBe(canonicalJson(m));
    expect(new TextDecoder().decode(a)).not.toMatch(/\s/);
  });

  it("refuses non-canonical bytes and inconsistent sizes", () => {
    const m = manifest();
    expect(() => decodeManifest(new TextEncoder().encode(JSON.stringify(m, null, 1)))).toThrow(/canonical/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, scan: { ...m.artifacts.scan, size: 35_999 } } })).toThrow(/scan.size/);
    expect(() => encodeManifest({ ...m, root: "AB" })).toThrow(/root/);
    // The path table (Q58): 32 × pathSplit bytes per record, and none at all when pathSplit is 0.
    expect(() => encodeManifest({ ...m, pathSplit: 8 })).toThrow(/pathTable.recordBytes/);
    expect(() => encodeManifest({ ...m, pathSplit: 0 })).toThrow(/no path table/);
    const { pathTable: _t, pathPublic: _s, ...withoutPath } = m.artifacts;
    expect(() => encodeManifest({ ...m, pathSplit: 0, artifacts: withoutPath })).not.toThrow();
    expect(() => encodeManifest({ ...m, artifacts: withoutPath })).toThrow(/pathTable/);
    expect(() => encodeManifest({ ...m, formatVersion: FORMAT_VERSION + 1 })).toThrow(/formatVersion/);
    // A format-2 manifest (before the scheme seam) is refused: a stored snapshot of it is ignored and rebuilt.
    expect(FORMAT_VERSION).toBe(3);
    expect(() => encodeManifest({ ...m, formatVersion: 2 })).toThrow(/formatVersion 2/);
    // SimplePIR's layout checked against the files' sizes (00058 FR-003).
    const r = m.artifacts.readTable;
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readPublic: { ...m.artifacts.readPublic, size: 87 * 1024 * 4 } } })).toThrow(/readPublic.size/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, layout: { ...r.layout, cols: 999 } } } })).toThrow(/layout.cols = groups/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, layout: { ...r.layout, rows: 87 } } } })).toThrow(/layout.rows/);
    expect(() => encodeManifest({ ...m, artifacts: { ...m.artifacts, readTable: { ...r, records: 1001 } } })).toThrow(/readTable.records/);
  });

  it("names its PIR scheme, part of the snapshot identifier; a scheme this build cannot read is refused with its name (00058 story 2)", () => {
    const m = manifest();
    expect(new TextDecoder().decode(encodeManifest(m))).toContain('"scheme":"simplepir"');
    const other = { ...m, scheme: "ipir-sp" } as Manifest;
    expect(() => encodeManifest(other)).toThrow(SchemeUnavailable);
    expect(() => encodeManifest(other)).toThrow(/PIR scheme "ipir-sp" is not available in this build/);
    expect(() => encodeManifest({ ...m, scheme: "nonesuch" } as unknown as Manifest)).toThrow(/PIR scheme "nonesuch"/);
    const { scheme: _scheme, ...unnamed } = m;
    expect(() => encodeManifest(unnamed as Manifest)).toThrow(/invalid manifest: scheme/);
  });

  it("names the routes under /pss/v1", () => {
    for (const r of Object.values(ROUTES)) expect(r.startsWith("/pss/v1/")).toBe(true);
  });
});
