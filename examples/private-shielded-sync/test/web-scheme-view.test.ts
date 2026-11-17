/**
 * The step page's scheme-specific presentation (`web/scheme-view.ts`, spec 00058 FR-060, FR-031), without a browser:
 *
 * - SimplePIR's table lines, call lines and body decoding are the page's earlier ones, character for character.
 * - IPIR+SP's table lines carry rows × columns of 16-bit cells, records per row, and the per-request byte counts by part.
 * - A real IPIR+SP call (the add-on's table and answers, the wallet's WebAssembly requests) decodes part by part: header
 *   and setup id (the masks' own), key of 27,648 bytes, one 49-bit number per row; each answer's header carries the
 *   SHA-256 of its request, then one 22-bit number per column. A changed request is reported.
 * - The masks decode as their header and two masks of 29-bit numbers.
 * - The WebAssembly is compiled only when its SHA-256 is the committed one.
 *
 * Needs the add-on (`examples/private-shielded-sync/ipir/build.sh native`); fails without it, as `ipir-roundtrip`.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ipirKeyWords } from "../gpu/ipir-wire.ts";
import { buildIpirTable, type IpirBuiltTable } from "../ipir/native.ts";
import { IpirWallet } from "../ipir/wallet.ts";
import { committedIpirWasmDigest, compileIpirWasm, IPIR_WASM_PATH } from "../ipir/wallet-node.ts";
import type { Manifest, NullifierTableRef, PirTableRef } from "../shared/manifest.ts";
import { encodeAnswerBody, encodeQueryBody } from "../shared/wire.ts";
import {
  callPlan,
  callText,
  cellOf,
  cellText,
  compileChecked,
  describeCallBody,
  describePublicArtifact,
  kb,
  pathTableText,
  readBits,
  tableOfRoute,
  tableSummary,
  tableText,
} from "../web/scheme-view.ts";

const sha256 = (b: Uint8Array): Uint8Array => new Uint8Array(createHash("sha256").update(b).digest());
const sha256Hex = async (b: Uint8Array): Promise<string> => createHash("sha256").update(b).digest("hex");
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");

/** Tables as a SimplePIR manifest at the real size describes them (the stack's snapshot `004805f1…`). */
const SP_READ: PirTableRef = { digest: "aa".repeat(32), size: 1, records: 69_329, recordBytes: 98, groups: 2477, perGroup: 28, layout: { rows: 2464, cols: 2477, cellsPerRecord: 88, seed: "11".repeat(32) } };
const SP_PATH: PirTableRef = { digest: "bb".repeat(32), size: 1, records: 69_329, recordBytes: 512, groups: 69_329, perGroup: 1, layout: { rows: 456, cols: 69_329, cellsPerRecord: 456, seed: "22".repeat(32) } };
const SP_NULLIFIER: NullifierTableRef = { digest: "cc".repeat(32), size: 1, records: 57_812, recordBytes: 40, groups: 2048, perGroup: 46, bucketBits: 11, capacity: 46, layout: { rows: 1656, cols: 2048, cellsPerRecord: 36, seed: "33".repeat(32) } };
/** The same tables under IPIR+SP (the stack's snapshot `0d3644b0…`). */
const IP_READ: PirTableRef = { digest: "dd".repeat(32), size: 1, records: 69_329, recordBytes: 98, groups: 2048, perGroup: 41, layout: { rows: 2048, cols: 2048, cellsPerRecord: 49, seed: "44".repeat(32) } };
const IP_PATH: PirTableRef = { digest: "ee".repeat(32), size: 1, records: 69_329, recordBytes: 512, groups: 2048, perGroup: 40, layout: { rows: 2048, cols: 10_240, cellsPerRecord: 256, seed: "55".repeat(32) } };
const IP_NULLIFIER: NullifierTableRef = { digest: "ff".repeat(32), size: 1, records: 57_812, recordBytes: 40, groups: 2048, perGroup: 102, bucketBits: 11, capacity: 102, layout: { rows: 2048, cols: 2048, cellsPerRecord: 20, seed: "66".repeat(32) } };

describe("SimplePIR, as the page showed it before", () => {
  it("table lines", () => {
    // The page's earlier templates, filled by hand for these tables.
    expect(tableText("simplepir", "read", tableSummary("simplepir", SP_READ))).toBe("2464 × 2477 cells, 28 records of 98 bytes per column, 69,329 records");
    expect(tableText("simplepir", "path", tableSummary("simplepir", SP_PATH, 1_867_776))).toBe(
      "456 × 69329 cells, 1 records of 512 bytes per column; its setup data, 1.78 MB, is downloaded only to spend (step 6)",
    );
    expect(tableText("simplepir", "nullifier", tableSummary("simplepir", SP_NULLIFIER))).toBe("1656 × 2048 cells, 11 bucket bits, capacity 46");
    expect(pathTableText("simplepir", tableSummary("simplepir", SP_PATH))).toBe(
      "456 × 69329 cells, 1 records of 512 bytes per column (as wide as the noise check allows, so its setup data is small)",
    );
    expect(tableSummary("simplepir", SP_READ)).toEqual({ rows: 2464, cols: 2477, recordsPerColumn: 28, records: 69_329, recordBytes: 98 });
    expect(tableSummary("simplepir", SP_NULLIFIER)).toEqual({ rows: 1656, cols: 2048, bucketBits: 11, capacity: 46 });
  });

  it("call and cell lines", () => {
    const plan = [{ real: [3, 9], groups: [3, 9, 100, 7] }];
    const calls = callPlan("simplepir", plan, false, "n");
    expect(calls).toEqual([{ call: 1, vectors: 4, realColumns: [3, 9], paddingColumns: 2, note: "n" }]);
    expect(callText(calls[0]!)).toBe("call 1: 4 vectors, real columns [3, 9], 2 random");
    const buckets = callPlan("simplepir", plan, true);
    expect(buckets).toEqual([{ call: 1, vectors: 4, realBuckets: [3, 9], paddingBuckets: 2 }]);
    expect(callText(buckets[0]!)).toBe("call 1: 4 vectors, real buckets [3, 9], 2 random");
    expect(cellText(cellOf("simplepir", 5, 2))).toBe("col 5, slot 2");
    expect(kb(1023)).toBe("1023 B");
    expect(kb(14_884)).toBe("14.5 KB");
  });

  it("a query and an answer body", () => {
    const snapshotId = new Uint8Array(32).fill(7);
    const values = new Uint32Array(2 * 3).map((_, i) => i + 1);
    const body = encodeQueryBody({ snapshotId, count: 2, payload: new Uint8Array(values.buffer) }, 12);
    expect(describeCallBody("simplepir", "request", body, SP_READ, null, sha256)).toEqual({
      format: "query body: 40-byte header, then the query vectors (u32, little-endian)",
      magic: "PSSQ",
      formatVersion: 3,
      snapshotId: "07".repeat(32),
      vectors: 2,
      valuesPerVector: 3,
      meaning: "each vector is A·s + e + Δ·u over the table's 3 columns: one is the wanted column (or a random padding column), the server cannot tell which",
      firstValuesOfVector0: [1, 2, 3, 4, 5, 6],
    });
    const answer = encodeAnswerBody({ snapshotId, count: 2, payload: new Uint8Array(values.buffer) }, 12);
    expect(describeCallBody("simplepir", "response", answer, SP_READ, body, sha256)).toMatchObject({
      format: "answer body: 40-byte header, then the answer vectors (u32, little-endian)",
      magic: "PSSA",
      meaning: "each vector is the table (3 rows) times one query vector; only the client can remove A·s and read its column",
    });
    const setup = new Uint8Array(4 * 1024 * 2);
    expect(describePublicArtifact("simplepir", setup, null)).toEqual({ layout: "rows × 1024 u32 (H = table × A), 2 rows", firstValues: [0, 0, 0, 0, 0, 0, 0, 0] });
  });
});

describe("IPIR+SP lines", () => {
  it("tables: rows × columns of 16-bit cells, records per row, byte counts by part", () => {
    const read = tableSummary("ipir-sp", IP_READ);
    expect(read).toMatchObject({
      rows: 2048,
      cols: 2048,
      cellBits: 16,
      recordsPerRow: 41,
      cellsPerRecord: 49,
      requestBytes: 40_228,
      request: { headerAndSetupId: 36, key: 27_648, selection: 12_544, selectionWords: 2048, selectionBits: 49 },
      responseBytes: 5700,
      response: { headerSetupIdAndRequestHash: 68, coefficients: 5632, coefficientWords: 2048, coefficientBits: 22 },
      masksBytes: 14_884,
    });
    expect(tableText("ipir-sp", "read", read)).toBe(
      "2,048 rows × 2,048 columns of 16-bit cells; a row holds 41 records of 98 bytes (49 cells each); 69,329 records; a request 40,228 B, its answer 5,700 B",
    );
    const path = tableSummary("ipir-sp", IP_PATH, 74_276);
    expect(path).toMatchObject({ masksBytes: 74_276, responseBytes: 28_228, requestBytes: 40_228 });
    expect(tableText("ipir-sp", "path", path)).toBe(
      "2,048 rows × 10,240 columns of 16-bit cells; a row holds 40 records of 512 bytes (256 cells each); a request 40,228 B, its answer 28,228 B; its masks, 72.5 KB, are downloaded only to spend (step 6)",
    );
    expect(pathTableText("ipir-sp", path)).toBe(
      "2,048 rows × 10,240 columns of 16-bit cells, 40 records of 512 bytes (256 cells each) per row; a request 40,228 B, its answer 28,228 B",
    );
    expect(tableText("ipir-sp", "nullifier", tableSummary("ipir-sp", IP_NULLIFIER))).toBe(
      "2,048 rows × 2,048 columns of 16-bit cells; 11 bucket bits, a bucket is a row of up to 102 entries; a request 40,228 B, its answer 5,700 B",
    );
  });

  it("calls and cells", () => {
    const plan = [{ real: [12], groups: [12, 4, 2000] }];
    const calls = callPlan("ipir-sp", plan, false);
    expect(calls).toEqual([{ call: 1, requests: 3, realRows: [12], paddingRows: 2 }]);
    expect(callText(calls[0]!)).toBe("call 1: 3 requests, real rows [12], 2 random");
    expect(callText(callPlan("ipir-sp", plan, true)[0]!)).toBe("call 1: 3 requests, real buckets [12], 2 random");
    expect(cellText(cellOf("ipir-sp", 1600, 40))).toBe("row 1600, slot 40");
  });

  it("routes name their tables", () => {
    const manifest = { artifacts: { readTable: IP_READ, pathTable: IP_PATH, nullifierTable: IP_NULLIFIER } } as unknown as Manifest;
    expect(tableOfRoute(manifest, "/query/read")).toBe(IP_READ);
    expect(tableOfRoute(manifest, "/query/path")).toBe(IP_PATH);
    expect(tableOfRoute(manifest, "/query/nullifier")).toBe(IP_NULLIFIER);
    expect(tableOfRoute(manifest, "/tail")).toBeNull();
  });
});

describe("a real IPIR+SP call, decoded part by part", () => {
  const ROWS = 2048;
  const COLS = 2048;
  const wanted = [5, 1000, 2047];
  const snapshotId = new Uint8Array(32).fill(9);
  const table: PirTableRef = { ...IP_READ, layout: { ...IP_READ.layout, rows: ROWS, cols: COLS } };
  let built: IpirBuiltTable;
  let query: Uint8Array;
  let answer: Uint8Array;

  beforeAll(async () => {
    const cells = new Uint16Array(ROWS * COLS).map((_, i) => (i * 2_654_435_761) >>> 16);
    built = await buildIpirTable({ cells, rows: ROWS, cols: COLS, seed: new Uint8Array(32).fill(3), snapshot: new Uint8Array(32).fill(4) });
    const wallet = new IpirWallet(compileIpirWasm());
    const client = wallet.openTable({ rows: ROWS, cols: COLS, seed: new Uint8Array(32).fill(3), snapshot: new Uint8Array(32).fill(4), masks: built.masks });
    const requests = wanted.map((row) => client.request(row));
    const payload = new Uint8Array(requests.length * client.sizes.requestBytes);
    requests.forEach((r, i) => payload.set(r.bytes, i * client.sizes.requestBytes));
    query = encodeQueryBody({ snapshotId, count: wanted.length, payload }, client.sizes.requestBytes);
    const responses = await built.table.respond(payload, wanted.length);
    answer = encodeAnswerBody({ snapshotId, count: wanted.length, payload: responses }, client.sizes.responseBytes);
    for (const r of requests) r.state.free();
    client.free();
  }, 120_000);

  afterAll(() => built?.table.release());

  it("the request: header and setup id, key, one 49-bit number per row", () => {
    const d = describeCallBody("ipir-sp", "request", query, table, null, sha256);
    const setupId = hex(built.masks.subarray(4, 36));
    expect(d).toMatchObject({
      callHeader: { bytes: 40, magic: "PSSQ", formatVersion: 3, snapshotId: "09".repeat(32), count: 3 },
      requests: 3,
      bytesPerRequest: 40_228,
      partsOfEachRequest: "36 (RNQ3 and setup id) + 27,648 (key) + 12,544 (2,048 × 49 bits) = 40,228 bytes",
      sameSetupIdInEveryRequest: true,
    });
    const r0 = d.request0 as { header: Record<string, unknown>; key: { bytes: number; first: string[] }; selection: { bytes: number; first: string[] } };
    expect(r0.header).toEqual({ bytes: 36, magic: "RNQ3", setupId });
    expect(r0.key.bytes).toBe(27_648);
    expect(r0.selection.bytes).toBe(12_544);
    // The key's numbers as the GPU responder reads them (gpu/ipir-wire.ts).
    const request0 = query.subarray(40, 40 + 40_228);
    const words = ipirKeyWords(request0);
    expect(r0.key.first).toEqual(Array.from(words.subarray(0, r0.key.first.length), String));
    expect(r0.key.first).toHaveLength(6);
    for (const v of r0.selection.first) expect(BigInt(v) < 1n << 49n).toBe(true);
    expect(r0.selection.first[0]).toBe(readBits(request0, 8 * (36 + 27_648), 49).toString());
  });

  it("the answer: header with its request's SHA-256, one 22-bit number per column", () => {
    const d = describeCallBody("ipir-sp", "response", answer, table, query, sha256);
    expect(d).toMatchObject({
      callHeader: { magic: "PSSA", count: 3 },
      answers: 3,
      bytesPerAnswer: 5700,
      partsOfEachAnswer: "68 (RNR2, setup id, SHA-256 of the request) + 5,632 (2,048 × 22 bits) = 5,700 bytes",
      sameSetupIdInEveryAnswer: true,
      everyAnswerCarriesItsRequestsSha256: true,
    });
    const a0 = d.answer0 as { header: Record<string, unknown>; coefficients: { bytes: number; first: string[] } };
    expect(a0.header).toMatchObject({ bytes: 68, magic: "RNR2", setupId: hex(built.masks.subarray(4, 36)), equalsSha256OfItsRequest: true });
    expect(a0.header.requestSha256).toBe(hex(sha256(query.subarray(40, 40 + 40_228))));
    expect(a0.coefficients.bytes).toBe(5632);
    for (const v of a0.coefficients.first) expect(Number(v)).toBeLessThan(2 ** 22);
    // Without the request, nothing is claimed; with another request, the mismatch shows.
    expect(describeCallBody("ipir-sp", "response", answer, table, null, sha256)).not.toHaveProperty("everyAnswerCarriesItsRequestsSha256");
    const changed = query.slice();
    changed[40 + 40_228 + 100]! ^= 1;
    const other = describeCallBody("ipir-sp", "response", answer, table, changed, sha256);
    expect(other.everyAnswerCarriesItsRequestsSha256).toBe(false);
    expect((other.answer0 as { header: Record<string, unknown> }).header.equalsSha256OfItsRequest).toBe(true);
  });

  it("a body of another shape is described generically", () => {
    const wrong: PirTableRef = { ...table, layout: { ...table.layout, rows: 4096 } };
    expect(describeCallBody("ipir-sp", "request", query, wrong, null, sha256)).toMatchObject({ vectors: 3, bytesPerItem: 40_228, note: "not 52772-byte items: decoded generically" });
    expect(describeCallBody("ipir-sp", "request", query, null, null, sha256)).toMatchObject({ magic: "PSSQ", vectors: 3, bytesPerItem: 40_228 });
  });

  it("the masks: header and two masks of 29-bit numbers", () => {
    const d = describePublicArtifact("ipir-sp", built.masks, COLS);
    expect(built.masks.length).toBe(36 + 2 * ((29 * COLS) / 8));
    expect(d).toMatchObject({ magic: "RNP3", setupId: hex(built.masks.subarray(4, 36)) });
    expect(d.layout).toBe("36-byte header (RNP3 and the setup id), then two masks of 2,048 numbers of 29 bits, one per table column (7,424 bytes each)");
    for (const v of [...(d.firstMask as string[]), ...(d.secondMask as string[])]) expect(Number(v)).toBeLessThan(2 ** 29);
    expect((d.secondMask as string[])[0]).toBe(readBits(built.masks, 8 * (36 + 7424), 29).toString());
  });
});

describe("the wallet's WebAssembly in the page", () => {
  it("is compiled only when its SHA-256 is the committed one", async () => {
    const bytes = new Uint8Array(readFileSync(IPIR_WASM_PATH));
    const module = await compileChecked(bytes, committedIpirWasmDigest(), sha256Hex);
    expect(WebAssembly.Module.imports(module)).toEqual([{ module: "env", name: "fill_random", kind: "function" }]);
    await expect(compileChecked(bytes, "0".repeat(64), sha256Hex)).rejects.toThrow(/not the committed 0{64}/);
    const changed = bytes.slice();
    changed[changed.length - 1]! ^= 1;
    await expect(compileChecked(changed, committedIpirWasmDigest(), sha256Hex)).rejects.toThrow(/SHA-256 is [0-9a-f]{64}, not the committed/);
  });
});
