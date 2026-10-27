import { describe, expect, it } from "vitest";
import {
  decodeParameter,
  decodeValue,
  encodeParameter,
  encodeValue,
  type Message,
  MESSAGE_SCHEMAS,
  MESSAGE_TYPES,
  type MessageType,
  messageText,
  parseMessage,
} from "../../src/private/messages.js";

/**
 * A115 `[CI]`, its schemas (task 14.2; PP-4, `design.md` §8): every message type round-trips through the zod schemas —
 * written as the transport writes it and read back equal — and fails on a missing or a mistyped field, each field of
 * each type; an unknown `v` or `type`, and a text that is not JSON, are told apart from a message failing its schema
 * (each closes the connection: `./transport.test.ts`). Also the values' encoding, by type, and its inverse, on values
 * as the database API gives them (the round trip through a real core's read is `./transport.test.ts`'s).
 */

const HASH = `0x${"ab".repeat(32)}`;
const OTHER = `0x${"cd".repeat(32)}`;

/** One valid message of each type, every optional field given where the schema has one. */
export const SAMPLES: Readonly<Record<MessageType, Message>> = {
  hello: { v: 1, type: "hello", instance: "instance-1", version: "0.9.5", height: "41", hash: HASH },
  "hello-ack": {
    v: 1,
    type: "hello-ack",
    lockstep: false,
    genesis: OTHER,
    start: "1",
    cursor: "42",
    refused: null,
  },
  committed: { v: 1, type: "committed", height: "42", hash: HASH },
  report: { v: 1, type: "report", height: "42", hash: HASH },
  read: {
    v: 1,
    type: "read",
    id: "7",
    statements: [
      { sql: "SELECT height FROM core_block_commit.blocks WHERE height = $1", params: ["42"] },
      { sql: "SELECT $1::bytea AS b, $2::jsonb AS j", params: [HASH, { a: [1, "x", null] }] },
    ],
  },
  "read-result": {
    v: 1,
    type: "read-result",
    id: "7",
    height: "42",
    results: [
      { columns: [{ name: "height", type: "bigint" }], rows: [["42"]] },
      {
        columns: [
          { name: "b", type: "bytea" },
          { name: "j", type: "jsonb" },
        ],
        rows: [[HASH, { a: [1, "x", null] }]],
      },
    ],
  },
  api: { v: 1, type: "api", id: "8", module: "stats", method: "totals", params: { from: "1" } },
  "api-result": { v: 1, type: "api-result", id: "8", result: { total: "12" } },
};

/** The other valid forms each type has: nulls where a field may be null, the other branch of a choice. */
const VARIANTS: readonly Message[] = [
  { v: 1, type: "hello", instance: "i", version: "v", height: "0", hash: null },
  { v: 1, type: "hello-ack", lockstep: true, genesis: HASH, start: "0", cursor: null, refused: "duplicate-instance" },
  { v: 1, type: "hello-ack", lockstep: true, genesis: HASH, start: "0", cursor: null, refused: "lockstep-behind" },
  { v: 1, type: "read", id: "1", statements: [] },
  { v: 1, type: "read-result", id: "1", height: null, results: [] },
  { v: 1, type: "read-result", id: "1", height: "3", error: "query-timeout" },
  { v: 1, type: "api", id: "2", module: "m", method: "x", params: null },
  { v: 1, type: "api-result", id: "2", result: null },
  { v: 1, type: "api-result", id: "2", error: "not-found" },
  // A JSON value with an integer beyond ±(2^53 − 1), kept exactly on the wire.
  { v: 1, type: "api-result", id: "3", result: { big: 123456789012345678901234567890n, list: [-9007199254740993n] } },
];

/** A value that is wrong for each kind of field (a mistyped field). */
function mistyped(value: unknown): unknown {
  if (typeof value === "string") return 42;
  if (typeof value === "number") return "1";
  if (typeof value === "boolean") return "true";
  if (value === null) return 5;
  if (Array.isArray(value)) return "a list";
  return "an object";
}

describe("A115: every message type round-trips through design §8's schemas", () => {
  it("the types are design §8's eight", () => {
    expect(MESSAGE_TYPES).toEqual(["hello", "hello-ack", "committed", "report", "read", "read-result", "api", "api-result"]);
  });

  it.each([...MESSAGE_TYPES.map((type) => [type, SAMPLES[type]] as const), ...VARIANTS.map((m) => [`${m.type} (other form)`, m] as const)])(
    "%s: written as the transport writes it and read back, equal",
    (_name, message) => {
      const text = messageText(message);
      const parsed = parseMessage(text);
      expect(parsed).toEqual({ ok: true, message });
      // The schema is the type's own.
      expect(MESSAGE_SCHEMAS[message.type].safeParse(message).success).toBe(true);
    },
  );
});

describe("A115: a missing or mistyped field fails the schema", () => {
  const cases = MESSAGE_TYPES.flatMap((type) =>
    Object.keys(SAMPLES[type])
      .filter((field) => field !== "v" && field !== "type")
      .map((field) => [type, field] as const),
  );

  it.each(cases)("%s without %s", (type, field) => {
    const message: Record<string, unknown> = { ...SAMPLES[type] };
    delete message[field];
    // An api-result without its result is one without either branch.
    expect(parseMessage(JSON.stringify(message))).toMatchObject({ ok: false, fault: "invalid-message" });
  });

  it.each(cases)("%s with %s mistyped", (type, field) => {
    const message: Record<string, unknown> = { ...SAMPLES[type] };
    // A JSON field (`params`, `result`) takes any JSON value: its mistyped value is a number JSON cannot hold exactly.
    const json = (type === "api" && field === "params") || (type === "api-result" && field === "result");
    message[field] = json ? "__MISTYPED__" : mistyped(message[field]);
    const text = JSON.stringify(message).replace('"__MISTYPED__"', "1e400");
    expect(parseMessage(text)).toMatchObject({ ok: false, fault: "invalid-message" });
  });

  it.each(MESSAGE_TYPES)("%s with a field its type does not have", (type) => {
    expect(parseMessage(JSON.stringify({ ...SAMPLES[type], extra: 1 }))).toMatchObject({ ok: false, fault: "invalid-message" });
  });

  it.each([
    ["a field the type does not have", { ...SAMPLES.committed, extra: 1 }],
    ["a height that is no decimal text", { ...SAMPLES.committed, height: "-1" }],
    ["a height with a leading zero", { ...SAMPLES.committed, height: "042" }],
    ["a hash of 31 bytes", { ...SAMPLES.committed, hash: `0x${"ab".repeat(31)}` }],
    ["a hash in upper case", { ...SAMPLES.committed, hash: HASH.toUpperCase().replace("0X", "0x") }],
    ["a refusal no hello-ack gives", { ...SAMPLES["hello-ack"], refused: "busy" }],
    ["a read-result with results and error", { ...SAMPLES["read-result"], error: "database-error" }],
    ["a read-result with neither", { v: 1, type: "read-result", id: "1", height: null }],
    ["a row with a value too few", { ...SAMPLES["read-result"], results: [{ columns: [{ name: "a", type: "bigint" }], rows: [[]] }] }],
    ["an api-result with result and error", { ...SAMPLES["api-result"], error: "not-found" }],
    ["an api-result with neither", { v: 1, type: "api-result", id: "1" }],
    ["an empty id", { ...SAMPLES.read, id: "" }],
    ["a statement without its SQL", { ...SAMPLES.read, statements: [{ params: [] }] }],
  ])("%s", (_name, message) => {
    expect(parseMessage(JSON.stringify(message))).toMatchObject({ ok: false, fault: "invalid-message" });
  });

  it("a parameter that is no JSON value JavaScript can hold (a number beyond a double's range)", () => {
    const text = '{"v":1,"type":"read","id":"7","statements":[{"sql":"SELECT 1","params":[1e400]}]}';
    expect(parseMessage(text)).toMatchObject({ ok: false, fault: "invalid-message" });
  });
});

describe("A115: an unknown v or type, or a text that is no JSON object, is told apart", () => {
  it.each([
    ['{"v":2,"type":"committed","height":"1","hash":"0x"}', "unknown-version"],
    ['{"type":"committed","height":"1"}', "unknown-version"],
    ['{"v":"1","type":"hello"}', "unknown-version"],
    ['{"v":1,"type":"goodbye"}', "unknown-type"],
    ['{"v":1}', "unknown-type"],
    ['{"v":1,"type":"toString"}', "unknown-type"],
    ['{"v":1,"type":"__proto__"}', "unknown-type"],
    ["not json", "not-json"],
    ['{"v":1,"type":"hello",', "not-json"],
    ["[1,2]", "invalid-message"],
    ["null", "invalid-message"],
  ])("%s → %s", (text, fault) => {
    expect(parseMessage(text)).toMatchObject({ ok: false, fault });
  });

  it.each([
    [`{"v":"${"x".repeat(40)}"}`, `v is "${"x".repeat(32)}…", where this build speaks v 1`],
    ['{"v":true}', "v is true, where this build speaks v 1"],
    ['{"v":null}', "v is null, where this build speaks v 1"],
    ['{"v":{}}', "v is object, where this build speaks v 1"],
    ['{"v":1,"type":7}', "type is 7, which is no message type"],
  ])("its detail names what was found, never more than a short text: %s", (text, detail) => {
    expect(parseMessage(text)).toMatchObject({ ok: false, detail });
  });

  it("a JSON value nested deeper than 256 levels is no value a message carries", () => {
    const deep = `${"[".repeat(300)}1${"]".repeat(300)}`;
    const text = `{"v":1,"type":"api","id":"1","module":"m","method":"x","params":${deep}}`;
    expect(parseMessage(text)).toMatchObject({ ok: false, fault: "invalid-message" });
  });
});

describe("the values' encoding (design §8), and reading them back", () => {
  const bytes = new Uint8Array([0, 1, 0xfe, 0xff]);
  it.each([
    ["bigint", 9007199254740993n, "9007199254740993"],
    ["bigint", -12n, "-12"],
    ["numeric", "12345678901234567890.000000000001", "12345678901234567890.000000000001"],
    ["numeric", "NaN", "NaN"],
    ["bytea", bytes, "0x0001feff"],
    ["bytea", new Uint8Array(0), "0x"],
    ["jsonb", { a: 12345678901234567890n, b: [1, "x", null, true] }, { a: 12345678901234567890n, b: [1, "x", null, true] }],
    ["jsonb", "a string", "a string"],
    ["json", [1, 2], [1, 2]],
    ["integer", 7, 7],
    ["boolean", true, true],
    ["text", "0x0001", "0x0001"],
    ["timestamp with time zone", "2025-05-21T14:30:00.123456Z", "2025-05-21T14:30:00.123456Z"],
    ["double precision", Number.NaN, "NaN"],
    ["double precision", Number.POSITIVE_INFINITY, "Infinity"],
    ["real", -1.5, -1.5],
    ["bigint[]", [1n, null, [2n]], ["1", null, ["2"]]],
    ["bytea[]", [bytes], ["0x0001feff"]],
    ["text", null, null],
  ])("%s %o is carried as %o and read back as the same value", (type, found, carried) => {
    const encoded = encodeValue(type, found);
    expect(encoded).toEqual(carried);
    // Through the wire's JSON, and back.
    const wire = parseMessage(
      messageText({ v: 1, type: "read-result", id: "1", height: "1", results: [{ columns: [{ name: "c", type }], rows: [[encoded]] }] }),
    );
    if (!wire.ok || wire.message.type !== "read-result") throw new Error("not read back");
    const value = (wire.message.results ?? [])[0]?.rows[0]?.[0];
    expect(decodeValue(type, value ?? null)).toEqual(found);
  });

  it("a value no column gives (a function, a JSON column's class instance) is refused, not carried as something else", () => {
    expect(() => encodeValue("text", () => 0)).toThrow(/no message carries/);
    expect(() => encodeValue("jsonb", { at: new Date(0) })).toThrow(/no JSON value/);
    expect(() => encodeParameter(new Map())).toThrow(/no message carries/);
    expect(() => encodeParameter(Symbol("s"))).toThrow(/no message carries/);
  });

  it("parameters: bigints as decimal text, bytes as 0x hex (read back as bytes), arrays element by element", () => {
    const params = [5n, bytes, "plain", 3, true, null, [1n, bytes], { a: 1n }, new Date("2025-05-21T14:30:00.000Z")];
    const carried = params.map(encodeParameter);
    expect(carried).toEqual(["5", "0x0001feff", "plain", 3, true, null, ["1", "0x0001feff"], { a: 1n }, "2025-05-21T14:30:00.000Z"]);
    expect(carried.map((param) => decodeParameter(param))).toEqual(["5", bytes, "plain", 3, true, null, ["1", bytes], { a: 1n }, "2025-05-21T14:30:00.000Z"]);
  });
});
