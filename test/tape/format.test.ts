import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  readTape,
  readTapeFile,
  recordKind,
  TapeError,
  type TapeRecord,
  tapeId,
  writeTape,
  writeTapeFile,
} from "../../tools/tape/index.js";
import { expectGoldenRoundTrip, GOLDEN_ID, GOLDEN_PATH, GOLDEN_RECORDS } from "./checks.js";

/**
 * A68 `[CI]` (`openspec/changes/core-arch/acceptance.md` §9; TT-1): tapes round-trip through the reader and writer byte
 * for byte; a malformed line fails with `bad-tape-record` and its line number; the tape id is the SHA-256 of the file.
 *
 * A tape is read only in the one form the writer writes (each record's fields in TT-1's order, JSON without spaces,
 * strings and numbers as `JSON.stringify` writes them, a newline after every record), so every tape the reader accepts
 * is written back to the same bytes, and one tape has one id. Determinism: the property runs with a pinned, reported
 * fast-check seed.
 */

const SEED = 20261025;
const RUNS = 200;

const encoder = new TextEncoder();

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/** Eleven valid lines, so that the line under test is line 12 (TT-1's scenario). */
const ELEVEN = [
  '{"method":"chain_getFinalizedHead","params":[],"result":"0xaa"}',
  '{"subscribe":"s","method":"chain_subscribeFinalizedHeads","params":[]}',
  '{"notify":"s","result":{"number":"0x1"}}',
  '{"method":"chain_getBlockHash","params":[1],"result":"0xbb","delayMs":5}',
  '{"fault":"timeout","method":"chain_getBlock","params":["0xbb"]}',
  '{"fault":"error","method":"chain_getBlock","params":["0xbb"],"code":-32000}',
  '{"method":"state_getStorage","params":["0x01","0xbb"],"error":{"code":4003,"message":"gone"}}',
  '{"method":"chain_getBlock","params":["0xbb"],"result":null}',
  '{"notify":"s","result":{"number":"0x2"}}',
  '{"method":"system_properties","params":[],"result":{}}',
  '{"method":"chain_getHeader","params":["0xbb"],"result":[]}',
];

/** The error `read` fails with; fails the test if it does not fail with a `TapeError`. */
function tapeFailure(read: () => unknown): TapeError {
  try {
    read();
  } catch (error) {
    if (error instanceof TapeError) return error;
    throw error;
  }
  throw new Error("expected a bad-tape-record error, but the tape was accepted");
}

function textTape(lines: readonly string[]): Uint8Array {
  return encoder.encode(lines.map((line) => `${line}\n`).join(""));
}

describe("A68: the committed tape round-trips byte for byte, and its id is its SHA-256", () => {
  it("writes the committed records to the committed bytes, reads them back equal, and writes the same bytes", () => {
    expectGoldenRoundTrip();
  });

  it("names the tape by the SHA-256 of its bytes", () => {
    const bytes = readFileSync(GOLDEN_PATH);
    expect(sha256(bytes)).toBe(GOLDEN_ID);
    expect(tapeId(bytes)).toBe(GOLDEN_ID);
    expect(readTape(bytes).id).toBe(sha256(bytes));
    expect(tapeId(writeTape(GOLDEN_RECORDS))).toBe(GOLDEN_ID);
  });

  it("gives another id for a tape one byte away", () => {
    const bytes = Uint8Array.from(readFileSync(GOLDEN_PATH));
    const changed = Uint8Array.from(bytes);
    const at = Buffer.from(bytes).indexOf("0x1111");
    changed[at + 2] = "2".charCodeAt(0);
    const other = readTape(changed);
    expect(other.id).toBe(sha256(changed));
    expect(other.id).not.toBe(GOLDEN_ID);
    expect(Buffer.from(writeTape(other.records)).equals(Buffer.from(changed))).toBe(true);
  });

  it("reads an empty file as a tape with no records, named by the SHA-256 of nothing", () => {
    const tape = readTape(new Uint8Array());
    expect(tape.records).toEqual([]);
    expect(tape.id).toBe(sha256(new Uint8Array()));
    expect(writeTape([]).length).toBe(0);
  });

  it("knows every record's kind", () => {
    expect(GOLDEN_RECORDS.map(recordKind)).toEqual([
      "call",
      "call",
      "call",
      "call",
      "subscribe",
      "notify",
      "fault",
      "fault",
      "fault",
      "call",
      "call",
      "disconnect",
      "subscribe",
      "notify",
      "subscribe",
      "notify",
      "call",
      "disconnect",
    ]);
  });

  it("returns frozen records", () => {
    const tape = readTape(readFileSync(GOLDEN_PATH));
    expect(Object.isFrozen(tape)).toBe(true);
    expect(Object.isFrozen(tape.records)).toBe(true);
    type Metadata = { readonly params: { readonly at: string }; readonly result: unknown[] };
    const metadata = tape.records[9] as unknown as Metadata;
    expect(Object.isFrozen(metadata)).toBe(true);
    expect(Object.isFrozen(metadata.params)).toBe(true);
    expect(Object.isFrozen(metadata.result)).toBe(true);
  });

  it("reads and writes tape files", () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-tape-"));
    try {
      const path = join(directory, "copy.tape.jsonl");
      expect(writeTapeFile(path, GOLDEN_RECORDS)).toBe(GOLDEN_ID);
      expect(Buffer.compare(readFileSync(path), readFileSync(GOLDEN_PATH))).toBe(0);
      const tape = readTapeFile(path);
      expect(tape.id).toBe(GOLDEN_ID);
      expect(tape.records).toEqual(GOLDEN_RECORDS);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

describe(`A68: any tape the writer writes reads back and is written to the same bytes (seed=${SEED})`, () => {
  const keyArb = fc.oneof(
    fc.string({ unit: "binary", maxLength: 5 }),
    fc.constantFrom("", "a", "b", "1", "10", "01", "__proto__", "é", "\u{1f600}", "result"),
  );
  const { json: jsonArb } = fc.letrec<{ json: unknown }>((tie) => ({
    json: fc.oneof(
      { depthSize: "small" },
      fc.constant(null),
      fc.boolean(),
      fc.maxSafeInteger(),
      fc.double({ noNaN: true, noDefaultInfinity: true }),
      fc.bigInt({ min: -(2n ** 70n), max: 2n ** 70n }),
      fc.string({ unit: "binary", maxLength: 8 }),
      fc.array(tie("json"), { maxLength: 4 }),
      fc.dictionary(keyArb, tie("json"), { maxKeys: 4 }),
    ),
  }));
  const paramsArb = fc.oneof(fc.array(jsonArb, { maxLength: 3 }), fc.dictionary(keyArb, jsonArb, { maxKeys: 3 }));
  const methodArb = fc.string({ unit: "grapheme", minLength: 1, maxLength: 12 });
  const idArb = fc.oneof(fc.string({ maxLength: 6 }), fc.maxSafeInteger());
  type Step = { readonly step: "call" | "subscribe" | "notify" | "disconnect" | "fault"; readonly record: TapeRecord };
  const stepArb: fc.Arbitrary<Step> = fc.oneof(
    fc
      .record({
        method: methodArb,
        params: paramsArb,
        answer: fc.oneof(
          fc.record({ result: jsonArb }),
          fc.record({ error: jsonArb }),
        ),
        delayMs: fc.option(fc.integer({ min: 0, max: 2 ** 31 - 1 }), { nil: undefined }),
      })
      .map(({ method, params, answer, delayMs }) => ({
        step: "call" as const,
        record: { method, params, ...answer, ...(delayMs === undefined ? {} : { delayMs }) } as TapeRecord,
      })),
    fc
      .record({ id: idArb, method: methodArb, params: paramsArb })
      .map(({ id, method, params }) => ({
        step: "subscribe" as const,
        record: { subscribe: id, method, params } as TapeRecord,
      })),
    jsonArb.map((result) => ({ step: "notify" as const, record: { notify: 0, result } as TapeRecord })),
    fc.constant({ step: "disconnect" as const, record: { disconnect: true } as TapeRecord }),
    fc
      .record({
        fault: fc.constantFrom("timeout" as const, "error" as const),
        method: methodArb,
        params: paramsArb,
        code: fc.option(fc.integer({ min: -40_000, max: 40_000 }), { nil: undefined }),
      })
      .map(({ fault, method, params, code }) => ({
        step: "fault" as const,
        record: { fault, method, params, ...(code === undefined ? {} : { code }) } as TapeRecord,
      })),
  );

  /** A valid tape from the steps: each subscription id unique in its session, each notification for one of them. */
  function tapeOf(steps: readonly Step[]): TapeRecord[] {
    const records: TapeRecord[] = [];
    let ids: (string | number)[] = [];
    for (const { step, record } of steps) {
      if (step === "disconnect") ids = [];
      if (step === "subscribe") {
        const id = (record as { subscribe: string | number }).subscribe;
        if (ids.some((other) => JSON.stringify(other) === JSON.stringify(id))) continue;
        ids.push(id);
      }
      if (step === "notify") {
        const id = ids[ids.length - 1];
        if (id === undefined) continue;
        records.push({ notify: id, result: (record as unknown as { result: never }).result });
        continue;
      }
      records.push(record);
    }
    return records;
  }

  it("write, read, write: the same bytes, the id their SHA-256", () => {
    fc.assert(
      fc.property(fc.array(stepArb, { maxLength: 12 }), (steps) => {
        const bytes = writeTape(tapeOf(steps));
        const tape = readTape(bytes);
        expect(Buffer.compare(Buffer.from(writeTape(tape.records)), Buffer.from(bytes))).toBe(0);
        expect(tape.id).toBe(sha256(bytes));
      }),
      { seed: SEED, numRuns: RUNS },
    );
  });
});

describe("A68: a malformed line fails with bad-tape-record and its line number", () => {
  it("TT-1's scenario: line 12 is {\"foo\": 1}", () => {
    const error = tapeFailure(() => readTape(textTape([...ELEVEN, '{"foo": 1}', ELEVEN[0] as string])));
    expect(error.code).toBe("bad-tape-record");
    expect(error.line).toBe(12);
    expect(error.reason).toBe("unknown-kind");
    expect(error.message).toMatch(/^bad-tape-record at line 12: /);
  });

  it("accepts the eleven lines before it", () => {
    expect(readTape(textTape(ELEVEN)).records).toHaveLength(11);
  });

  const MALFORMED: readonly (readonly [string, string, string])[] = [
    ['{"foo":1}', "unknown-kind", "no field of any record kind"],
    ["[]", "not-a-record", "an array"],
    ["null", "not-a-record", "null"],
    ['"call"', "not-a-record", "a string"],
    ["5", "not-a-record", "a number"],
    ['{"method":"m","params":[]', "not-json", "cut short"],
    ["{'method':'m'}", "not-json", "single quotes"],
    ['{"method":"m","params":[],"result":1,"error":2}', "result-and-error", "both an answer and an error"],
    ['{"method":"m","params":[]}', "missing-field", "neither an answer nor an error"],
    ['{"method":"m","result":1}', "missing-field", "a call without params"],
    ['{"params":[],"result":1}', "unknown-kind", "a call without a method"],
    ['{"method":"","params":[],"result":1}', "bad-method", "an empty method"],
    ['{"method":5,"params":[],"result":1}', "bad-method", "a method that is a number"],
    ['{"method":"m","params":5,"result":1}', "bad-params", "params that are a number"],
    ['{"method":"m","params":"x","result":1}', "bad-params", "params that are a string"],
    ['{"method":"m","params":null,"result":1}', "bad-params", "params that are null"],
    ['{"method":"m","params":[],"result":1,"delayMs":-1}', "bad-delay", "a negative delay"],
    ['{"method":"m","params":[],"result":1,"delayMs":1.5}', "bad-delay", "a fractional delay"],
    ['{"method":"m","params":[],"result":1,"delayMs":"5"}', "bad-delay", "a delay that is a string"],
    ['{"method":"m","params":[],"result":1,"delayMs":2147483648}', "bad-delay", "a delay past the timer limit"],
    ['{"method":"m","params":[],"result":1,"delay":5}', "unexpected-field", "an unknown field of a call"],
    ['{"subscribe":true,"method":"m","params":[]}', "bad-subscription-id", "a subscription id that is true"],
    ['{"subscribe":1.5,"method":"m","params":[]}', "bad-subscription-id", "a fractional subscription id"],
    ['{"subscribe":"t","method":"m","params":[],"result":"t"}', "unexpected-field", "a subscription's answer"],
    ['{"subscribe":"t","params":[]}', "missing-field", "a subscription without a method"],
    ['{"subscribe":"t","method":"m","params":{"a":1},"x":0}', "unexpected-field", "an unknown subscription field"],
    ['{"notify":null,"result":1}', "bad-subscription-id", "a notification for the id null"],
    ['{"notify":"s"}', "missing-field", "a notification without a result"],
    ['{"notify":"s","result":1,"method":"chain_newHead"}', "unexpected-field", "a notification's method"],
    ['{"disconnect":false}', "bad-disconnect", "a disconnect that is false"],
    ['{"disconnect":1}', "bad-disconnect", "a disconnect that is 1"],
    ['{"disconnect":true,"delayMs":5}', "unexpected-field", "a disconnect with a delay"],
    ['{"fault":"slow","method":"m","params":[]}', "bad-fault", "a fault that is neither timeout nor error"],
    ['{"fault":"error","method":"m","params":[],"code":"x"}', "bad-code", "a code that is a string"],
    ['{"fault":"error","method":"m","params":[],"code":1.5}', "bad-code", "a fractional code"],
    ['{"fault":"timeout","params":[]}', "missing-field", "a fault without a method"],
    ['{"fault":"timeout","method":"m","params":[],"result":1}', "unexpected-field", "a fault's answer"],
    ['{"fault":"error","method":"m","params":7}', "bad-params", "a fault whose params are a number"],
    ['{"notify":"nobody","result":1}', "unknown-subscription", "a notification of no subscription"],
    ['{"subscribe":"s","method":"chain_subscribeNewHeads","params":[]}', "duplicate-subscription", "an id in use"],
    ['{"params":[],"method":"m","result":1}', "not-canonical", "fields out of TT-1's order"],
    ['{"method": "m","params":[],"result":1}', "not-canonical", "a space after a colon"],
    [' {"disconnect":true}', "not-canonical", "a space before the record"],
    ['{"disconnect":true} ', "not-canonical", "a space after the record"],
    ['{"method":"m","params":[],"result":1.0}', "not-canonical", "a number written 1.0"],
    ['{"method":"m","params":[],"result":1E3}', "not-canonical", "an exponent written E3"],
    ['{"method":"m","params":[],"result":-0}', "not-canonical", "minus zero"],
    ['{"method":"m","params":[],"result":"\\u00e9"}', "not-canonical", "an escape JSON.stringify does not write"],
    ['{"method":"m","params":[],"result":{"b":1,"1":2}}', "not-canonical", "an integer key after a name"],
    ['{"method":"m","method":"m","params":[],"result":1}', "not-canonical", "a field given twice"],
    ['{"method":"m","params":[],"result":1e400}', "not-json-value", "a number too large for a double"],
    ['{"method":"m","params":[],"result":{"__proto__":1},"x":2}', "unexpected-field", "an unknown field"],
    ['{"__proto__":{"method":"m"}}', "unknown-kind", "a __proto__ field"],
  ];

  for (const [line, reason, what] of MALFORMED) {
    it(`refuses ${what} at its line (${reason})`, () => {
      const error = tapeFailure(() => readTape(textTape([...ELEVEN, line])));
      expect([error.code, error.line, error.reason]).toEqual(["bad-tape-record", 12, reason]);
      expect(error.message.startsWith("bad-tape-record at line 12: ")).toBe(true);
    });
  }

  it("says what the writer would write for a line out of its form, the first 200 characters of a long one", () => {
    const error = tapeFailure(() => readTape(textTape(['{"params":[],"method":"m","result":1}'])));
    expect(error.message).toContain('which is {"method":"m","params":[],"result":1}');
    const long = `{"method":"m","params":[],"result":"${"x".repeat(300)}" }`;
    const message = tapeFailure(() => readTape(textTape([long]))).message;
    expect(message).toContain(`which is {"method":"m","params":[],"result":"${"x".repeat(164)}…`);
    expect(message).not.toContain("x".repeat(165));
  });

  it("shows a refused value in its message, the first 80 characters of a long one", () => {
    const short = tapeFailure(() => readTape(textTape(['{"method":"m","params":"abc","result":1}'])));
    expect(short.message).toBe('bad-tape-record at line 1: params must be an array or an object, not "abc"');
    const long = tapeFailure(() => readTape(textTape([`{"method":"m","params":"${"y".repeat(100)}","result":1}`])));
    expect(long.message).toContain(`not "${"y".repeat(79)}…`);
    expect(long.message).not.toContain("y".repeat(80));
  });

  it("refuses a notification of a subscription made in an earlier session", () => {
    const lines = [
      '{"subscribe":"s","method":"chain_subscribeNewHeads","params":[]}',
      '{"notify":"s","result":1}',
      '{"disconnect":true}',
      '{"notify":"s","result":2}',
    ];
    expect(tapeFailure(() => readTape(textTape(lines)))).toMatchObject({ line: 4, reason: "unknown-subscription" });
    const again = [...lines.slice(0, 3), lines[0] as string, lines[3] as string];
    expect(readTape(textTape(again)).records).toHaveLength(5);
  });

  it("tells a subscription id that is a number from one that is a string", () => {
    const lines = ['{"subscribe":1,"method":"m","params":[]}', '{"notify":"1","result":1}'];
    expect(tapeFailure(() => readTape(textTape(lines)))).toMatchObject({ line: 2, reason: "unknown-subscription" });
    const both = ['{"subscribe":1,"method":"m","params":[]}', '{"subscribe":"1","method":"m","params":[]}'];
    expect(readTape(textTape(both)).records).toHaveLength(2);
  });

  it("refuses a last record without its newline, at its line", () => {
    const bytes = encoder.encode(`${ELEVEN.join("\n")}\n{"disconnect":true}`);
    expect(tapeFailure(() => readTape(bytes))).toMatchObject({ line: 12, reason: "no-final-newline" });
    expect(tapeFailure(() => readTape(encoder.encode('{"disconnect":true}')))).toMatchObject({ line: 1 });
  });

  it("refuses an empty line, at its line", () => {
    const bytes = encoder.encode(`${ELEVEN.slice(0, 3).join("\n")}\n\n${ELEVEN[3]}\n`);
    expect(tapeFailure(() => readTape(bytes))).toMatchObject({ line: 4, reason: "empty-line" });
    expect(tapeFailure(() => readTape(encoder.encode("\n")))).toMatchObject({ line: 1, reason: "empty-line" });
  });

  it("refuses a line ended by CRLF", () => {
    const bytes = encoder.encode(`${ELEVEN[0]}\n${ELEVEN[1]}\r\n`);
    expect(tapeFailure(() => readTape(bytes))).toMatchObject({ line: 2, reason: "not-canonical" });
  });

  it("refuses a byte-order mark", () => {
    const bytes = encoder.encode(`\u{feff}${ELEVEN[0]}\n`);
    expect(tapeFailure(() => readTape(bytes))).toMatchObject({ line: 1, reason: "not-json" });
  });

  it("refuses a line that is not UTF-8, at its line", () => {
    const good = encoder.encode(`${ELEVEN[0]}\n${ELEVEN[1]}\n`);
    const bad = Uint8Array.from([...good, ...encoder.encode('{"method":"m","params":[],"result":"'), 0xff, 0x22]);
    const bytes = Uint8Array.from([...bad, ...encoder.encode("}\n")]);
    expect(tapeFailure(() => readTape(bytes))).toMatchObject({ line: 3, reason: "not-utf8" });
  });

  it("reads JSON nested 512 levels deep, the deepest the writer writes", () => {
    const line = (levels: number) => `{"method":"m","params":[],"result":${"[".repeat(levels)}${"]".repeat(levels)}}`;
    expect(readTape(textTape([line(512)])).records).toHaveLength(1);
    expect(tapeFailure(() => readTape(textTape([line(513)])))).toMatchObject({ line: 1, reason: "not-json-value" });
  });

  it("reads the longest delay a timer keeps, 2^31 - 1 ms", () => {
    const line = '{"method":"m","params":[],"result":1,"delayMs":2147483647}';
    expect(readTape(textTape([line])).records[0]).toMatchObject({ delayMs: 2 ** 31 - 1 });
  });

  it("refuses JSON nested deeper than the writer writes", () => {
    const deep = `${"[".repeat(600)}${"]".repeat(600)}`;
    const line = `{"method":"m","params":[],"result":${deep}}`;
    expect(tapeFailure(() => readTape(textTape([line])))).toMatchObject({ line: 1, reason: "not-json-value" });
  });

  it("reports the first bad line of several", () => {
    const lines = [ELEVEN[0] as string, "[]", '{"foo":1}'];
    expect(tapeFailure(() => readTape(textTape(lines)))).toMatchObject({ line: 2, reason: "not-a-record" });
  });
});

describe("A68: the writer refuses what the reader would, naming the record's line", () => {
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  const BAD: readonly (readonly [unknown, string, string])[] = [
    [{ foo: 1 }, "unknown-kind", "an object of no kind"],
    [[1], "not-a-record", "an array"],
    [null, "not-a-record", "null"],
    [new Map([["method", "m"]]), "not-a-record", "a Map"],
    [{ method: "m", params: [], result: undefined }, "missing-field", "an answer left undefined"],
    [{ method: "m", params: [], result: [undefined] }, "not-json-value", "undefined in an answer"],
    [{ method: "m", params: [], result: Number.NaN }, "not-json-value", "NaN"],
    [{ method: "m", params: [], result: Number.POSITIVE_INFINITY }, "not-json-value", "Infinity"],
    [{ method: "m", params: [], result: new Uint8Array([1]) }, "not-json-value", "bytes"],
    [{ method: "m", params: [], result: new Date(0) }, "not-json-value", "a date"],
    [{ method: "m", params: [], result: () => 1 }, "not-json-value", "a function"],
    [{ method: "m", params: [], result: Symbol("s") }, "not-json-value", "a symbol"],
    [{ method: "m", params: [], result: cyclic }, "not-json-value", "a cycle"],
    [{ method: "m", params: [undefined], result: 1 }, "not-json-value", "undefined in params"],
    [{ method: "m", params: [1, , 3], result: 1 }, "not-json-value", "a hole in params"],
    [{ method: "m", params: [], error: { code: 1n, x: undefined } }, "not-json-value", "undefined in an error"],
    [{ notify: "s", result: 1 }, "unknown-subscription", "a notification of no subscription"],
    [{ disconnect: true, extra: 1 }, "unexpected-field", "an extra field"],
  ];
  for (const [record, reason, what] of BAD) {
    it(`refuses ${what} (${reason})`, () => {
      const good = { method: "chain_getFinalizedHead", params: [], result: "0xaa" };
      const error = tapeFailure(() => writeTape([good, good, record as TapeRecord]));
      expect([error.code, error.line, error.reason]).toEqual(["bad-tape-record", 3, reason]);
    });
  }

  it("names what a refused value is", () => {
    const method = tapeFailure(() => writeTape([{ method: (() => 1) as never, params: [], result: 1 }]));
    expect(method.message).toBe("bad-tape-record at line 1: method must be a non-empty string, not function");
    const bytes = tapeFailure(() => writeTape([{ method: "m", params: [], result: new Uint8Array() as never }]));
    expect(bytes.message).toBe("bad-tape-record at line 1: $.result is [object Uint8Array], which is not a JSON value");
    const nan = tapeFailure(() => writeTape([{ method: "m", params: [{ a: [Number.NaN] }], result: 1 }]));
    expect(nan.message).toBe("bad-tape-record at line 1: $.params[0].a[0] is NaN, which is not a JSON value");
    const symbol = tapeFailure(() => writeTape([{ notify: Symbol("s") as never, result: 1 }]));
    expect(symbol.message).toBe("bad-tape-record at line 1: notify must be a string or a safe integer, not symbol");
  });

  it("leaves out a field set to undefined, as JSON.stringify does", () => {
    const records = [
      { method: "m", params: [], result: 1, delayMs: undefined },
      { method: "m", params: [], result: undefined, error: { code: 1 } },
      { disconnect: true, other: undefined },
      { fault: "error", method: "m", params: [], code: undefined },
    ] as unknown as TapeRecord[];
    expect(Buffer.from(writeTape(records)).toString("utf8")).toBe(
      '{"method":"m","params":[],"result":1}\n{"method":"m","params":[],"error":{"code":1}}\n{"disconnect":true}\n' +
        '{"fault":"error","method":"m","params":[]}\n',
    );
    expect(recordKind({ method: "m", params: [], result: 1, notify: undefined } as unknown as TapeRecord)).toBe("call");
  });

  it("takes a record and params that are null-prototype objects", () => {
    const params = Object.assign(Object.create(null) as Record<string, unknown>, { at: "0x01" });
    const record = Object.assign(Object.create(null) as Record<string, unknown>, { method: "m", params, result: 1 });
    const text = Buffer.from(writeTape([record as unknown as TapeRecord])).toString("utf8");
    expect(text).toBe('{"method":"m","params":{"at":"0x01"},"result":1}\n');
  });

  it("writes a null-prototype object like a plain one", () => {
    const result = Object.assign(Object.create(null) as Record<string, unknown>, { a: 1 });
    const text = Buffer.from(writeTape([{ method: "m", params: [], result } as TapeRecord])).toString("utf8");
    expect(text).toBe('{"method":"m","params":[],"result":{"a":1}}\n');
  });

  it("writes an own __proto__ key and reads it back as one", () => {
    const line = '{"method":"m","params":[],"result":{"__proto__":{"x":1},"y":2}}';
    const tape = readTape(textTape([line]));
    const result = (tape.records[0] as { result: Record<string, unknown> }).result;
    expect(Object.keys(result)).toEqual(["__proto__", "y"]);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Buffer.from(writeTape(tape.records)).toString("utf8")).toBe(`${line}\n`);
  });

  it("writes a big integer as its digits, and a safe one read back as a number", () => {
    const text = Buffer.from(writeTape([{ method: "m", params: [2n ** 64n], result: 7n }])).toString("utf8");
    expect(text).toBe('{"method":"m","params":[18446744073709551616],"result":7}\n');
    expect(readTape(encoder.encode(text)).records[0]).toEqual({ method: "m", params: [2n ** 64n], result: 7 });
  });
});
