/** Wire formats, records and the manifest (spec §5.7, FR-021–022, FR-030, FR-060, FR-065, FR-067, FR-081). */

import { createHash, randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  CALL_HEADER_BYTES,
  canonicalJson,
  decodeAnswerBody,
  decodeManifest,
  decodeQueryBody,
  decodeReadRecord,
  decodeTailHeader,
  decodeTailOutput,
  encodeAnswerBody,
  encodeManifest,
  encodeQueryBody,
  encodeReadRecord,
  encodeTailHeader,
  encodeTailOutput,
  FORMAT_VERSION,
  type Manifest,
  NULLIFIER_RECORD_BYTES,
  queryBodyLimit,
  readRecordBytes,
  ROUTES,
  scanEntry,
  snapshotId,
  splitTail,
  TAIL_HEADER_BYTES,
  TAIL_OUTPUT_BYTES,
  type TailHeader,
  toHex,
  WireError,
} from "../shared/index.ts";

const bytes = (n: number) => new Uint8Array(randomBytes(n));
const words = (n: number) => new Uint32Array(randomBytes(n * 4).buffer);

describe("query and answer bodies", () => {
  const id = bytes(32);

  it("round-trip, with a 40-byte header: magic, version, snapshot, count", () => {
    const values = words(3 * 17);
    const body = encodeQueryBody({ snapshotId: id, count: 3, values }, 17);
    expect(body.length).toBe(CALL_HEADER_BYTES + 3 * 17 * 4);
    expect(new TextDecoder().decode(body.subarray(0, 4))).toBe("PSSQ");
    expect(body[4]).toBe(FORMAT_VERSION);
    expect(body[38]).toBe(3);
    const back = decodeQueryBody(body, 17, { queriesPerCall: 3, snapshotId: id });
    expect(back.values).toEqual(values);
    expect(back.snapshotId).toEqual(id);
    const answer = encodeAnswerBody({ snapshotId: id, count: 3, values: words(3 * 5) }, 5);
    expect(new TextDecoder().decode(answer.subarray(0, 4))).toBe("PSSA");
    expect(decodeAnswerBody(answer, 5, { count: 3 }).count).toBe(3);
  });

  it("decode from an unaligned offset", () => {
    const values = words(2 * 9);
    const body = encodeQueryBody({ snapshotId: id, count: 2, values }, 9);
    const shifted = new Uint8Array(body.length + 1);
    shifted.set(body, 1);
    expect(decodeQueryBody(shifted.subarray(1), 9).values).toEqual(values);
  });

  it("are refused when anything is off (400), or name another snapshot (409)", () => {
    const body = encodeQueryBody({ snapshotId: id, count: 2, values: words(2 * 9) }, 9);
    const refuse = (b: Uint8Array, expect: Parameters<typeof decodeQueryBody>[2] = {}, cols = 9) => {
      try {
        decodeQueryBody(b, cols, expect);
      } catch (e) {
        return (e as WireError).status;
      }
      return 0;
    };
    expect(refuse(body.subarray(0, 39))).toBe(400);
    expect(refuse(body.subarray(0, body.length - 1))).toBe(400);
    expect(refuse(Uint8Array.of(...body, 0))).toBe(400);
    expect(refuse(body, {}, 10)).toBe(400);
    const magic = body.slice();
    magic[0] = 0;
    expect(refuse(magic)).toBe(400);
    const version = body.slice();
    version[4] = 9;
    expect(refuse(version)).toBe(400);
    expect(refuse(body, { queriesPerCall: 32 })).toBe(400);
    expect(refuse(body, { snapshotId: bytes(32) })).toBe(409);
    // A call for a replaced snapshot has that snapshot's column count: still 409, not 400 (FR-067).
    expect(refuse(body, { snapshotId: bytes(32) }, 10)).toBe(409);
    expect(refuse(encodeAnswerBody({ snapshotId: id, count: 2, values: words(18) }, 9))).toBe(400);
    expect(refuse(body)).toBe(0);
  });

  it("size the query routes' body limit as queriesPerCall × C × 4 plus the header (FR-079)", () => {
    expect(queryBodyLimit(32, 25_000)).toBe(40 + 32 * 25_000 * 4);
  });

  it("refuse to encode an inconsistent call", () => {
    expect(() => encodeQueryBody({ snapshotId: id, count: 2, values: words(5) }, 3)).toThrow();
    expect(() => encodeQueryBody({ snapshotId: bytes(31), count: 1, values: words(3) }, 3)).toThrow();
    expect(() => encodeQueryBody({ snapshotId: id, count: 0, values: words(0) }, 3)).toThrow();
  });
});

describe("records", () => {
  it("scan entry: point and first 4 bytes of element 0, or 36 zeros (FR-030)", () => {
    const ct = bytes(224);
    expect(scanEntry(ct)).toEqual(ct.subarray(0, 36));
    expect(scanEntry(null)).toEqual(new Uint8Array(36));
  });

  it("read record: 193 + 32k bytes with flags, commitment, elements 1–5, lower path (FR-060)", () => {
    for (const k of [0, 8, 16]) {
      expect(readRecordBytes(k)).toBe(193 + 32 * k);
      const full = { commitment: bytes(32), elements: bytes(160), lowerPath: Array.from({ length: k }, () => bytes(32)) };
      const enc = encodeReadRecord(full, k);
      expect(enc[0]).toBe(3);
      expect(decodeReadRecord(enc, k)).toEqual(full);
      const bare = { commitment: bytes(32), elements: null, lowerPath: null };
      const enc2 = encodeReadRecord(bare, k);
      expect(enc2[0]).toBe(0);
      expect(enc2.subarray(33)).toEqual(new Uint8Array(160 + 32 * k));
      expect(decodeReadRecord(enc2, k)).toEqual(bare);
    }
    const bad = encodeReadRecord({ commitment: bytes(32), elements: null, lowerPath: null }, 2);
    bad[0] = 4;
    expect(() => decodeReadRecord(bad, 2)).toThrow(/flags/);
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
      readTable: { digest: hex32(), size: 32 + 627 * 1000 * 2, rows: 627, cols: 1000, perColumn: 1, cellsPerRecord: 627, recordBytes: 705, records: 1000, seed: hex32() },
      readSetup: { digest: hex32(), size: 627 * 1024 * 4 },
      nullifierTable: { digest: hex32(), size: 32 + 36 * 3 * 16 * 2, rows: 108, cols: 16, perColumn: 3, cellsPerRecord: 36, recordBytes: 40, records: 20, seed: hex32(), bucketBits: 4, capacity: 3 },
      nullifierSetup: { digest: hex32(), size: 108 * 1024 * 4 },
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
    expect(() => encodeManifest({ ...m, formatVersion: 2 })).toThrow(/formatVersion/);
  });

  it("names the routes under /pss/v1", () => {
    for (const r of Object.values(ROUTES)) expect(r.startsWith("/pss/v1/")).toBe(true);
  });
});
