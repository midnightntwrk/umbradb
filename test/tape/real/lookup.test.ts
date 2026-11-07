import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { tapeId, type TapeRecord, writeTape } from "../../../tools/tape/index.js";
import {
  findTape,
  MANIFEST,
  MANIFEST_PATH,
  manifestProblems,
  readManifest,
  type RealTape,
  TAPES_ENV,
  TapeRefusedError,
} from "./real-tapes.js";

/**
 * The lookup every real-tape test uses: a recorded tape is found in the directory named by `UMBRADB_TAPES` under its
 * manifest's file name, refused when its size or SHA-256 is not the manifest's, and otherwise — the variable unset, or
 * no such file — reported absent with the tape's name as the reason, which `tapeTest` turns into Vitest's skip
 * (`real-tapes.negative-control.test.ts` checks the skip as the reporter shows it). The committed manifest
 * (`test/tape/real/manifest.json`) names each tape's network, range, SHA-256, size, source endpoint, the node version
 * it reported and the day it was recorded. [Q130; acceptance's tape note]
 */

const RECORDS: readonly TapeRecord[] = [
  { method: "chain_getBlockHash", params: [0], result: `0x${"11".repeat(32)}` },
  { method: "chain_getHeader", params: [`0x${"11".repeat(32)}`], result: { number: "0x0" } },
];
const BYTES = writeTape(RECORDS);

/** A manifest entry for {@link BYTES}, as the committed manifest writes one. */
function entry(changes: Partial<RealTape> = {}): RealTape {
  return {
    name: "synthetic-0-0",
    file: "synthetic-0-0.tape.jsonl",
    network: "custom",
    from: 0,
    to: 0,
    sha256: tapeId(BYTES),
    bytes: BYTES.length,
    records: RECORDS.length,
    source: { endpoint: "ws://127.0.0.1:10001", nodeVersion: "0.0.0-test", recorded: "2026-10-26" },
    bounds: "a synthetic tape of these tests",
    ...changes,
  };
}

let directory = "";
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-real-tapes-"));
});
afterEach(() => {
  rmSync(directory, { recursive: true, force: true });
});

describe("findTape: where a test finds its recorded tape (Q130)", () => {
  it("reports the tape absent, naming it, when UMBRADB_TAPES is not set", () => {
    const tape = entry();
    for (const unset of [undefined, ""]) {
      const lookup = findTape(tape, { directory: unset });
      expect(lookup.found).toBe(false);
      expect(lookup.found ? "" : lookup.reason).toBe(
        `tape synthetic-0-0 (sha256 ${tape.sha256.slice(0, 12)}…) is absent: ${TAPES_ENV} is not set`,
      );
    }
  });

  it("reports the tape absent, naming it and the file looked for, when the directory does not hold it", () => {
    const lookup = findTape(entry(), { directory });
    expect(lookup.found).toBe(false);
    expect(lookup.found ? "" : lookup.reason).toBe(
      `tape synthetic-0-0 (sha256 ${tapeId(BYTES).slice(0, 12)}…) is absent: ${join(directory, "synthetic-0-0.tape.jsonl")} ` +
        "does not exist",
    );
  });

  it("finds a tape whose size and SHA-256 are the manifest's, and gives its bytes", () => {
    writeFileSync(join(directory, "synthetic-0-0.tape.jsonl"), BYTES);
    const lookup = findTape(entry(), { directory });
    expect(lookup.found).toBe(true);
    if (!lookup.found) return;
    expect(lookup.path).toBe(join(directory, "synthetic-0-0.tape.jsonl"));
    expect(Buffer.from(lookup.bytes).equals(Buffer.from(BYTES))).toBe(true);
    expect(lookup.tape).toEqual(entry());
  });

  it("refuses — never skips — a tape with one byte changed: its SHA-256 is not the manifest's", () => {
    const changed = Uint8Array.from(BYTES);
    changed[10] = (changed[10] as number) ^ 0x01;
    writeFileSync(join(directory, "synthetic-0-0.tape.jsonl"), changed);
    let thrown: unknown;
    try {
      findTape(entry(), { directory });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(TapeRefusedError);
    const refused = thrown as TapeRefusedError;
    expect(refused.reason).toBe("sha256");
    expect(refused.expected).toBe(tapeId(BYTES));
    expect(refused.found).toBe(tapeId(changed));
    expect(refused.message).toBe(
      `tape synthetic-0-0 at ${join(directory, "synthetic-0-0.tape.jsonl")} is refused: its SHA-256 is ` +
        `${tapeId(changed)}, where the manifest records ${tapeId(BYTES)}`,
    );
  });

  it("refuses a tape whose size is not the manifest's, before reading its bytes", () => {
    writeFileSync(join(directory, "synthetic-0-0.tape.jsonl"), Buffer.concat([BYTES, Buffer.from("\n")]));
    expect(() => findTape(entry(), { directory })).toThrow(
      new TapeRefusedError(
        "synthetic-0-0",
        join(directory, "synthetic-0-0.tape.jsonl"),
        "size",
        String(BYTES.length),
        String(BYTES.length + 1),
      ),
    );
    expect(() => findTape(entry(), { directory })).toThrow(
      `its size is ${BYTES.length + 1} bytes, where the manifest records ${BYTES.length}`,
    );
  });

  it("finds a committed manifest's tape by its name", () => {
    const [first] = MANIFEST.tapes;
    if (first === undefined) return;
    const lookup = findTape(first.name, { directory });
    expect(lookup.found).toBe(false);
    expect(lookup.tape).toBe(first);
    expect(() => findTape("no-such-tape", { directory })).toThrow(
      "the real-tape manifest has no tape named no-such-tape",
    );
  });
});

describe("the committed manifest (test/tape/real/manifest.json)", () => {
  it("is valid: each tape's name, file, network, range, SHA-256, size, records and source", () => {
    const text = readFileSync(MANIFEST_PATH, "utf8");
    expect(manifestProblems(JSON.parse(text))).toEqual([]);
    expect(MANIFEST.format).toBe("umbradb-real-tapes");
    expect(MANIFEST.version).toBe(1);
    for (const tape of MANIFEST.tapes) {
      expect(tape.file).toBe(`${tape.name}.tape.jsonl`);
      expect(tape.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(tape.from).toBeLessThanOrEqual(tape.to);
      expect(tape.source.recorded).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(tape.source.nodeVersion.length).toBeGreaterThan(0);
      expect(tape.source.endpoint).toMatch(/^wss?:\/\//);
    }
    expect(new Set(MANIFEST.tapes.map((tape) => tape.name)).size).toBe(MANIFEST.tapes.length);
    expect(new Set(MANIFEST.tapes.map((tape) => tape.sha256)).size).toBe(MANIFEST.tapes.length);
  });

  it("is read from its file and frozen", () => {
    expect(readManifest(MANIFEST_PATH)).toEqual(MANIFEST);
    expect(Object.isFrozen(MANIFEST)).toBe(true);
    expect(Object.isFrozen(MANIFEST.tapes)).toBe(true);
  });

  const valid = () => ({ format: "umbradb-real-tapes", version: 1, about: "x", tapes: [entry()] });
  const problemRows: readonly { name: string; data: unknown; says: string }[] = [
    { name: "not an object", data: [], says: "the manifest is a JSON object" },
    { name: "another format", data: { ...valid(), format: "x" }, says: "format" },
    { name: "another version", data: { ...valid(), version: 2 }, says: "version" },
    { name: "a tape without a name", data: { ...valid(), tapes: [{ ...entry(), name: "" }] }, says: "tapes[0].name" },
    {
      name: "a file not named after the tape",
      data: { ...valid(), tapes: [{ ...entry(), file: "other.tape.jsonl" }] },
      says: "tapes[0].file",
    },
    { name: "a SHA-256 in capitals", data: { ...valid(), tapes: [{ ...entry(), sha256: "A".repeat(64) }] }, says: "sha256" },
    { name: "a range the wrong way round", data: { ...valid(), tapes: [{ ...entry(), from: 2, to: 1 }] }, says: "from" },
    { name: "a negative size", data: { ...valid(), tapes: [{ ...entry(), bytes: -1 }] }, says: "tapes[0].bytes" },
    {
      name: "a source without a node version",
      data: { ...valid(), tapes: [{ ...entry(), source: { ...entry().source, nodeVersion: "" } }] },
      says: "tapes[0].source.nodeVersion",
    },
    {
      name: "a source day that is no date",
      data: { ...valid(), tapes: [{ ...entry(), source: { ...entry().source, recorded: "2026-13-01" } }] },
      says: "tapes[0].source.recorded",
    },
    {
      name: "an endpoint that is no WebSocket URL",
      data: { ...valid(), tapes: [{ ...entry(), source: { ...entry().source, endpoint: "https://x" } }] },
      says: "tapes[0].source.endpoint",
    },
    { name: "two tapes of one name", data: { ...valid(), tapes: [entry(), entry({ sha256: "0".repeat(64) })] }, says: "tapes[1].name" },
    { name: "an unknown field", data: { ...valid(), tapes: [{ ...entry(), extra: 1 }] }, says: "extra" },
  ];
  for (const row of problemRows) {
    it(`refuses ${row.name}`, () => {
      const problems = manifestProblems(row.data);
      expect(problems.length, JSON.stringify(problems)).toBeGreaterThan(0);
      expect(problems.join("; ")).toContain(row.says);
      expect(() => readManifest(writeManifest(row.data))).toThrow("the real-tape manifest is not valid");
    });
  }

  function writeManifest(data: unknown): string {
    const path = join(directory, "manifest.json");
    writeFileSync(path, JSON.stringify(data));
    return path;
  }
});
