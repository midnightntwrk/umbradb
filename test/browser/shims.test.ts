import { createHash as nodeCreateHash } from "node:crypto";
import * as posix from "node:path/posix";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { withDevelopmentOptIn, databaseOf } from "../../browser/src/configuration.js";
import { databaseTarget } from "../../browser/src/db/database.js";
import { pgliteLockFile, WEB_LOCK_PREFIX } from "../../browser/src/db/web-lock.js";
import { jsonSafe, crossedError } from "../../browser/src/protocol.js";
import { Buffer as ShimBuffer } from "../../browser/src/shims/buffer.js";
import { createHash } from "../../browser/src/shims/crypto.js";
import * as browserPath from "../../browser/src/shims/path.js";
import { Sha256, sha256 } from "../../browser/src/shims/sha256.js";
import { UmbraError } from "../../src/db/errors.js";

/**
 * What the browser build replaces of Node.js, held to Node.js's own, since the browser must give the same results:
 * SHA-256 — synchronous, incremental, fed in any pieces — and the `Buffer` operations UmbraDB's sources use, each on
 * random inputs against Node.js's (fast-check, seed recorded); and the browser's pure pieces: the database's location,
 * the Web Lock's name, the development opt-in and the page's JSON-ready values. [BR-4]
 */

const SEED = 20261027;
const RUNS = 300;

/** `bytes` cut at `cuts` (positions in any order, out of range ignored). */
function pieces(bytes: Uint8Array, cuts: readonly number[]): Uint8Array[] {
  const points = [...new Set(cuts.map((cut) => cut % (bytes.length + 1)))].sort((a, b) => a - b);
  const out: Uint8Array[] = [];
  let from = 0;
  for (const point of [...points, bytes.length]) {
    out.push(bytes.subarray(from, point));
    from = point;
  }
  return out;
}

describe("the browser build's SHA-256 (node:crypto's createHash in the browser)", () => {
  it("gives the FIPS 180-4 test vectors", () => {
    const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString("hex");
    expect(hex(sha256(new Uint8Array(0)))).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(hex(sha256(new TextEncoder().encode("abc")))).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(hex(sha256(new TextEncoder().encode("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")))).toBe(
      "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
    );
    expect(hex(sha256(new Uint8Array(1_000_000).fill(0x61)))).toBe("cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0");
  });

  it(`equals Node.js's on random bytes fed in random pieces, across every padding boundary (seed=${SEED})`, () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 300 }), fc.array(fc.nat(400), { maxLength: 6 }), (bytes, cuts) => {
        const ours = new Sha256();
        const theirs = nodeCreateHash("sha256");
        for (const piece of pieces(bytes, cuts)) {
          ours.update(piece);
          theirs.update(piece);
        }
        expect(Buffer.from(ours.digest()).toString("hex")).toBe(theirs.digest("hex"));
      }),
      { seed: SEED, numRuns: RUNS },
    );
    for (let length = 50; length <= 130; length++) {
      const bytes = Uint8Array.from({ length }, (_, i) => (i * 7 + length) & 0xff);
      expect(Buffer.from(sha256(bytes)).toString("hex")).toBe(nodeCreateHash("sha256").update(bytes).digest("hex"));
    }
  });

  it("equals Node.js's fed byte by byte and in pieces of every size up to a block and one, and past 2^32 bits", () => {
    const bytes = Uint8Array.from({ length: 200 }, (_, i) => (i * 31 + 7) & 0xff);
    for (let size = 1; size <= 65; size++) {
      const ours = new Sha256();
      const theirs = nodeCreateHash("sha256");
      for (let at = 0; at < bytes.length; at += size) {
        ours.update(bytes.subarray(at, at + size));
        theirs.update(bytes.subarray(at, at + size));
      }
      expect(Buffer.from(ours.digest()).toString("hex"), `pieces of ${size}`).toBe(theirs.digest("hex"));
    }
    // A message of 512 MiB and one byte: its length in bits needs the high word (a large database's contents hash).
    const chunk = Uint8Array.from({ length: 1 << 20 }, (_, i) => i & 0xff);
    const ours = new Sha256();
    const theirs = nodeCreateHash("sha256");
    for (let i = 0; i < 512; i++) {
      ours.update(chunk);
      theirs.update(chunk);
    }
    ours.update(Uint8Array.of(7));
    theirs.update(Uint8Array.of(7));
    expect(Buffer.from(ours.digest()).toString("hex")).toBe(theirs.digest("hex"));
  });

  it(`createHash("sha256") takes bytes and text as Node.js's does, and digests to a Buffer or hex (seed=${SEED})`, () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(fc.string(), fc.uint8Array({ maxLength: 40 })), { maxLength: 5 }), (parts) => {
        const ours = createHash("sha256");
        const theirs = nodeCreateHash("sha256");
        for (const part of parts) {
          ours.update(part);
          theirs.update(part);
        }
        const digest = ours.digest();
        expect(digest).toBeInstanceOf(ShimBuffer);
        expect(digest.toString("hex")).toBe(theirs.digest("hex"));
      }),
      { seed: SEED, numRuns: RUNS },
    );
    expect(createHash("sha256").update("ab", "utf8").update("ff", "hex").digest("hex")).toBe(
      nodeCreateHash("sha256").update("ab", "utf8").update("ff", "hex").digest("hex"),
    );
    expect(() => createHash("sha512")).toThrow(/SHA-256 only/);
    const used = createHash("sha256");
    used.digest();
    expect(() => used.digest()).toThrow("Digest already called");
    expect(() => used.update("x")).toThrow("Digest already called");
  });
});

describe("the browser build's Buffer (the operations UmbraDB's sources use)", () => {
  it(`reads and writes text as Node.js's Buffer does: UTF-8, hex, latin1, base64, ascii (seed=${SEED})`, () => {
    const encodings = ["utf8", "utf-8", "hex", "latin1", "binary", "base64", "ascii"] as const;
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 200 }), fc.constantFrom(...encodings), (bytes, encoding) => {
        const ours = ShimBuffer.from(bytes);
        const theirs = Buffer.from(bytes);
        expect(ours.toString(encoding)).toBe(theirs.toString(encoding));
        const text = theirs.toString(encoding);
        expect([...ShimBuffer.from(text, encoding)]).toEqual([...Buffer.from(text, encoding)]);
        expect(ShimBuffer.byteLength(text, encoding)).toBe(Buffer.byteLength(text, encoding));
      }),
      { seed: SEED, numRuns: RUNS },
    );
    fc.assert(
      fc.property(fc.string({ unit: "grapheme", maxLength: 60 }), (text) => {
        expect([...ShimBuffer.from(text)]).toEqual([...Buffer.from(text)]);
        expect(ShimBuffer.byteLength(text, "utf8")).toBe(Buffer.byteLength(text, "utf8"));
        expect(ShimBuffer.from(text).toString()).toBe(Buffer.from(text).toString());
      }),
      { seed: SEED, numRuns: RUNS },
    );
    // Node.js's hex reading stops at the first pair that is not hex; base64 takes URL-safe letters and stops at "=".
    for (const text of ["0a1", "0aZZ0b", "", "ff00gg", "DEADbeef"]) {
      expect([...ShimBuffer.from(text, "hex")]).toEqual([...Buffer.from(text, "hex")]);
    }
    for (const text of ["aGVsbG8=", "aGVsbG8", "-_-_", "a b\nc", "QQ==QQ=="]) {
      expect([...ShimBuffer.from(text, "base64")]).toEqual([...Buffer.from(text, "base64")]);
    }
    expect(() => ShimBuffer.from("x", "ucs2")).toThrow("Unknown encoding");
    expect(ShimBuffer.from("\u{1F600}x", "latin1").toString("hex")).toBe(Buffer.from("\u{1F600}x", "latin1").toString("hex"));
    const long = new Uint8Array(100_000).map((_, i) => i & 0xff);
    expect(ShimBuffer.from(long).toString("latin1")).toBe(Buffer.from(long).toString("latin1"));
  });

  it(`views, copies, compares, concatenates and allocates as Node.js's Buffer does (seed=${SEED})`, () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 40 }), fc.uint8Array({ maxLength: 40 }), (a, b) => {
        expect(ShimBuffer.compare(a, b)).toBe(Buffer.compare(a, b));
        expect(ShimBuffer.from(a).equals(b)).toBe(Buffer.from(a).equals(b));
        expect(ShimBuffer.from(a).equals(a)).toBe(true);
        expect([...ShimBuffer.concat([a, b])]).toEqual([...Buffer.concat([a, b])]);
        expect([...ShimBuffer.concat([a, b], 7)]).toEqual([...Buffer.concat([a, b], 7)]);
        expect(ShimBuffer.byteLength(a)).toBe(Buffer.byteLength(a));
      }),
      { seed: SEED, numRuns: RUNS },
    );
    const backing = new Uint8Array([1, 2, 3, 4, 5]);
    const view = ShimBuffer.from(backing.buffer, 1, 3);
    backing[2] = 9;
    expect([...view]).toEqual([2, 9, 4]);
    const copy = ShimBuffer.from(backing);
    backing[0] = 7;
    expect(copy[0]).toBe(1);
    expect([...ShimBuffer.from(new DataView(backing.buffer, 3, 2))]).toEqual([4, 5]);
    expect([...ShimBuffer.from([1, 257, -1])]).toEqual([...Buffer.from([1, 257, -1])]);
    expect([...ShimBuffer.alloc(3)]).toEqual([0, 0, 0]);
    expect([...ShimBuffer.alloc(2, 7)]).toEqual([7, 7]);
    expect(ShimBuffer.isBuffer(ShimBuffer.alloc(1))).toBe(true);
    expect(ShimBuffer.isBuffer(new Uint8Array(1))).toBe(false);
    expect(ShimBuffer.from(new Uint8Array([104, 105])).toString("utf8", 1)).toBe("i");
    expect(() => ShimBuffer.from(5)).toThrow(TypeError);
  });
});

describe("the browser build's node:path (POSIX, from /)", () => {
  it(`resolves, joins, normalizes and splits paths as Node.js's node:path/posix does, from / (seed=${SEED})`, () => {
    const segment = fc.constantFrom("", ".", "..", "a", "b.c", "d-e", "/", "//", "x/", "/y", "../z", "./w/");
    const path = fc.array(segment, { maxLength: 6 }).map((parts) => parts.join(fc.sample(fc.constantFrom("/", "//"), 1)[0] as string));
    fc.assert(
      fc.property(fc.array(path, { maxLength: 4 }), (paths) => {
        const expected = posix.resolve("/", ...paths);
        expect(browserPath.resolve(...paths)).toBe(expected);
        expect(browserPath.join(...paths)).toBe(posix.join(...paths));
        for (const one of paths) {
          expect(browserPath.normalize(one), one).toBe(posix.normalize(one));
          // dirname and basename of a normalized path without a trailing "/" (Node.js keeps quirks for the others).
          const clean = posix.normalize(one).replace(/(.)\/$/, "$1");
          expect(browserPath.dirname(clean), clean).toBe(posix.dirname(clean));
          expect(browserPath.basename(clean), clean).toBe(posix.basename(clean));
        }
      }),
      { seed: SEED, numRuns: RUNS },
    );
    expect(browserPath.resolve()).toBe("/");
    expect(browserPath.resolve("backup.sql")).toBe("/backup.sql");
    expect(browserPath.sep).toBe(posix.sep);
  });
});

describe("the browser build's database, lock and configuration", () => {
  it("keeps a database in memory or under an OPFS name, never PostgreSQL, under one Web Lock per OPFS database", () => {
    expect(databaseTarget({ kind: "pglite", memory: true })).toEqual({ backend: "pglite", dataDir: "memory://" });
    expect(databaseTarget({ kind: "pglite", path: "a129" })).toEqual({ backend: "pglite", dataDir: "opfs-ahp://a129" });
    const postgres = { kind: "postgres", host: "h", port: 5432, user: "u", name: "db", ssl: "require" } as const;
    expect(() => databaseTarget(postgres)).toThrow(UmbraError);
    expect(pgliteLockFile("memory://")).toBeUndefined();
    expect(pgliteLockFile("")).toBeUndefined();
    expect(pgliteLockFile("opfs-ahp://a129")).toBe(`${WEB_LOCK_PREFIX}a129`);
    expect(pgliteLockFile("opfs-ahp://a129-p1")).toBe(`${WEB_LOCK_PREFIX}a129-p1`);
    for (const refused of ["/tmp/db", "file:///tmp/db", "idb://x", "opfs-ahp://", "opfs-ahp://a/b", "opfs-ahp://.x"]) {
      expect(() => pgliteLockFile(refused), refused).toThrow(expect.objectContaining({ code: "invalid-configuration" }));
    }
    expect(databaseOf("memory", "core")).toEqual({ kind: "pglite", memory: true });
    expect(databaseOf("memory", "p1")).toEqual({ kind: "pglite", memory: true });
    expect(databaseOf("a129", "core")).toEqual({ kind: "pglite", path: "a129" });
    expect(databaseOf("a129", "p1")).toEqual({ kind: "pglite", path: "a129-p1" });
  });

  it("sets the development opt-in on every core entry and nothing else (BR-1)", () => {
    const data = { entries: [{ id: "core", start: 3, config: { network: "preview" } }, { id: "m", start: 3, config: {} }, { id: "core", start: 9 }] };
    expect(withDevelopmentOptIn(data)).toEqual({
      entries: [
        { id: "core", start: 3, config: { network: "preview", developmentOptIn: true } },
        { id: "m", start: 3, config: {} },
        { id: "core", start: 9, config: { developmentOptIn: true } },
      ],
    });
    expect(withDevelopmentOptIn({ entries: [{ id: "core", config: { developmentOptIn: false } }] })).toEqual({
      entries: [{ id: "core", config: { developmentOptIn: true } }],
    });
    for (const other of [null, 5, "x", {}, { entries: "no" }]) expect(withDevelopmentOptIn(other)).toBe(other);
    expect(withDevelopmentOptIn({ entries: [null, 3] })).toEqual({ entries: [null, 3] });
  });

  it("gives the page JSON-ready values: heights as text, bytes as hex, errors with their code", () => {
    expect(jsonSafe({ a: 1n, b: new Uint8Array([1, 255]), c: [2n, null, "x"], d: { e: true } })).toEqual({
      a: "1",
      b: "0x01ff",
      c: ["2", null, "x"],
      d: { e: true },
    });
    const refused = crossedError(new UmbraError("writer-lock-held", "held", { holder: "another process" }));
    expect(refused).toEqual({ name: "UmbraError", message: "held", code: "writer-lock-held", details: { holder: "another process" } });
    expect(crossedError("text")).toEqual({ name: "Error", message: "text", code: null, details: null });
    expect(crossedError(new TypeError("t"))).toEqual({ name: "TypeError", message: "t", code: null, details: null });
  });
});
