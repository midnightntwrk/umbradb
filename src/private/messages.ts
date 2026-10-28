/**
 * The process transport's messages (`openspec/changes/core-arch/specs/private-processes/spec.md` PP-4; `design.md` §8;
 * CORE-ARCH §4.14; tasks 14.2, 14.2a): one JSON object per message, `{ "v": 1, "type", … }`, validated against these
 * zod schemas on both ends — the core's server (`./core-transport.ts`) and a private process's client
 * (`./private-transport.ts`) — and no other message: a private process uses this connection and its reads of public
 * data, and nothing calls a module across it (owner decision Q140 C), so an `api` or `api-result` message, which
 * task 14.2 carried, is an unknown `type`.
 *
 * | Type | Direction | Fields (`H` a height as decimal text, `X` `0x`-prefixed lowercase hex) |
 * |---|---|---|
 * | `hello` | private → core | `instance`, `version`, `height: H` (its cursor; its S − 1 before its first commit), `hash: X` or null |
 * | `hello-ack` | core → private | `lockstep`, `genesis: X`, `start: H`, `cursor: H` or null, `refused`: null, `duplicate-instance` or `lockstep-behind`, `configHash: X` |
 * | `committed` | core → private | `height: H`, `hash: X`, `configHash: X` |
 * | `report` | private → core | `height: H`, `hash: X` |
 * | `read` | private → core | `id`, `statements`: `[{ sql, params: Value[] }]`, run as one consistent read |
 * | `read-result` | core → private | `id`, `height: H` or null (before the first commit), `configHash: X`, and `results` — per statement `{ columns: [{ name, type }], rows: Value[][] }` — or `error`, a code — `read-refused` with `refused: { statement, reason, name }`, the statement the core refused (task 14.2b) |
 *
 * **`refused`** (task 14.2b, A172; `./read-gate.ts`): a `read` whose statement is not one read — transaction or session
 * control, a second statement, a function or catalog the core refuses — is answered `error: read-refused` and nothing
 * of it runs; `refused` names the statement: `statement`, its index in `statements` (from 0), `reason` (`command`,
 * `function`, `statements` or `unreadable`) and `name` (its first word, `COMMIT`, or the function, `pg_advisory_lock`;
 * null when none). It is there exactly when the error is `read-refused`.
 *
 * **`configHash`** (PP-4, PP-14, RN-16; owner decision Q147, task 14.1b): the core's configuration hash, 32 bytes, on
 * each of its three messages — which a private process compares with the one its first `hello-ack` gave
 * (`./private-transport.ts`).
 *
 * **Strict.** Every object is a strict object — a field it does not have fails its schema as a missing or mistyped one
 * does — and a message is `v: 1` with one of these `type`s; {@link parseMessage} tells the three failures apart
 * (`unknown-version`, `unknown-type`, `invalid-message`, besides `not-json`), and the transport closes the connection on
 * any of them (PP-4). Hashes (`hello`'s, `hello-ack`'s `genesis`, `committed`'s, `report`'s, each `configHash`) are 32 bytes; ids are text
 * of 1 to 128 characters, unique per connection for its requests.
 *
 * **Values** ({@link encodeValue}, {@link decodeValue}). A value in a row or a parameter is `null`, a boolean, a string
 * or JSON: `bigint` and `numeric` as decimal text, `bytea` as `X`, `json` and `jsonb` as their JSON value, the other
 * types as the database API maps them (DB-2: `smallint`, `integer`, `oid` and finite floats as numbers, a float's
 * `NaN` or infinity as its text; dates and times as their RFC 3339 or ISO text; `text`, `uuid` and the rest as text),
 * an array as a JSON array of its elements so written. Each statement's `columns` give every column's PostgreSQL type
 * name (`format_type(oid, NULL)`, `bigint[]` for an array), which says how to read each value back: the private side
 * gives a `bigint` column's values as `bigint`s, a `bytea` column's as `Uint8Array`s, a `json`/`jsonb` column's as the
 * JSON value — an integer outside ±(2^53 − 1) inside it a `bigint`, as the database API gives it —, a float's text as
 * its number, and every other value as written; so a value decodes back to the value the core read. The wire's JSON
 * keeps every integer exactly: it is written with `bigint`s as JSON numbers ({@link messageText}) and read with the
 * component's lossless reader (`parseJsonLossless`).
 *
 * **Parameters** carry no types (the schema's `params: Value[]`), and the database API sends every parameter as untyped
 * text, which PostgreSQL types from the statement (DB-2): so the core reads a parameter that is a string of `0x` and
 * lowercase hex pairs as bytes ({@link decodeParameter}) — a `bytea` parameter written as `X` —, every other string as
 * text, numbers, booleans and null as themselves, a JSON array as an array (its elements read the same way) and a JSON
 * object as JSON. A text parameter that is itself such hex is therefore sent as bytes (decision record question
 * Q141).
 */

import { z } from "zod";
import { parseJsonLossless } from "../deterministic-postgresql/index.js";
import { NAME_MAX, READ_REFUSAL_REASONS } from "./read-gate.js";

/** The protocol version every message carries. */
export const PROTOCOL_VERSION = 1;

/** A height as decimal text. */
const HEIGHT = /^(?:0|[1-9][0-9]*)$/;
/** A 32-byte hash as `0x` and 64 lowercase hex digits. */
const HASH = /^0x[0-9a-f]{64}$/;
/** Bytes as `0x` and lowercase hex pairs. */
export const HEX_BYTES = /^0x(?:[0-9a-f]{2})*$/;

const height = () => z.string().regex(HEIGHT);
const hash = () => z.string().regex(HASH);
const id = () => z.string().min(1).max(128);

/** Whether `value` is JSON as the lossless reader gives it: `bigint`s allowed, numbers finite, objects plain. */
export function isJsonValue(value: unknown, depth = 0): boolean {
  if (depth > 256) return false;
  if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "bigint") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every((element) => isJsonValue(element, depth + 1));
  if (typeof value !== "object") return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Object.values(value).every((element) => isJsonValue(element, depth + 1));
}

/** A JSON value (see {@link isJsonValue}). */
export type JsonValue = null | boolean | number | bigint | string | readonly JsonValue[] | { readonly [key: string]: JsonValue };

const json = () => z.custom<JsonValue>((value) => isJsonValue(value), { message: "expected a JSON value" });

/** A row's or a parameter's value: null, a boolean, a string, or JSON (see the module comment). */
const value = json;

const base = <T extends string>(type: T) => ({ v: z.literal(PROTOCOL_VERSION), type: z.literal(type) });

/** `hello` (private → core). */
export const HELLO = z.strictObject({
  ...base("hello"),
  instance: z.string().min(1),
  version: z.string().min(1),
  height: height(),
  hash: hash().nullable(),
});

/** Why the core refused a `hello`. */
export const REFUSED = z.enum(["duplicate-instance", "lockstep-behind"]);

/** `hello-ack` (core → private). */
export const HELLO_ACK = z.strictObject({
  ...base("hello-ack"),
  lockstep: z.boolean(),
  genesis: hash(),
  start: height(),
  cursor: height().nullable(),
  refused: REFUSED.nullable(),
  configHash: hash(),
});

/** `committed` (core → private): sent after each public commit. */
export const COMMITTED = z.strictObject({ ...base("committed"), height: height(), hash: hash(), configHash: hash() });

/** `report` (lockstep private → core): sent after each private commit (task 14.3). */
export const REPORT = z.strictObject({ ...base("report"), height: height(), hash: hash() });

/** One statement of a `read`. */
const STATEMENT = z.strictObject({ sql: z.string().min(1), params: z.array(value()) });

/** `read` (private → core): its statements run as one consistent read. */
export const READ = z.strictObject({ ...base("read"), id: id(), statements: z.array(STATEMENT) });

/** One column of a statement's result: its name and its PostgreSQL type's name. */
const COLUMN = z.strictObject({ name: z.string(), type: z.string().min(1) });

/** One statement's result: its columns and rows, each row a value per column. */
const RESULT = z.strictObject({ columns: z.array(COLUMN), rows: z.array(z.array(value())) });

/** The error of a `read` the core refused (task 14.2b; `./read-gate.ts`): `read-result.refused` names the statement. */
export const READ_REFUSED = "read-refused";

/** `read-result.refused`: the statement the core refused — its index in `statements` —, why, and what it names. */
const REFUSED_STATEMENT = z.strictObject({
  statement: z.number().int().nonnegative(),
  reason: z.enum(READ_REFUSAL_REASONS),
  name: z.string().min(1).max(NAME_MAX).nullable(),
});

/** `read-result` (core → private): the read's results, or its error, with the height it read. */
export const READ_RESULT = z
  .strictObject({
    ...base("read-result"),
    id: id(),
    height: height().nullable(),
    configHash: hash(),
    results: z.array(RESULT).optional(),
    error: z.string().min(1).optional(),
    refused: REFUSED_STATEMENT.optional(),
  })
  .refine((message) => (message.results === undefined) !== (message.error === undefined), {
    message: "a read-result has either results or error",
  })
  .refine((message) => (message.refused === undefined) === (message.error !== READ_REFUSED), {
    message: "a read-result has refused exactly when its error is read-refused",
  })
  .refine((message) => message.results === undefined || message.results.every((result) => rowsFit(result)), {
    message: "every row of a result has one value per column",
  });

/** The schemas, by message type. */
export const MESSAGE_SCHEMAS = Object.freeze({
  hello: HELLO,
  "hello-ack": HELLO_ACK,
  committed: COMMITTED,
  report: REPORT,
  read: READ,
  "read-result": READ_RESULT,
} as const);

/** A message type. */
export type MessageType = keyof typeof MESSAGE_SCHEMAS;

/** The message types, in design §8's order. */
export const MESSAGE_TYPES = Object.freeze(Object.keys(MESSAGE_SCHEMAS) as MessageType[]);

export type Hello = z.infer<typeof HELLO>;
export type HelloAck = z.infer<typeof HELLO_ACK>;
export type Committed = z.infer<typeof COMMITTED>;
export type Report = z.infer<typeof REPORT>;
export type Read = z.infer<typeof READ>;
export type ReadResult = z.infer<typeof READ_RESULT>;

/** A message of the transport. */
export type Message = Hello | HelloAck | Committed | Report | Read | ReadResult;

/** A statement's result in a `read-result`. */
export type StatementResult = z.infer<typeof RESULT>;

function rowsFit(result: { readonly columns: readonly unknown[]; readonly rows: readonly (readonly unknown[])[] }): boolean {
  return result.rows.every((row) => row.length === result.columns.length);
}

/** Why a text is no message: not JSON, an unknown `v` or `type`, or a message failing its schema. */
export type MessageFault = "not-json" | "unknown-version" | "unknown-type" | "invalid-message";

/** {@link parseMessage}'s answer. */
export type Parsed =
  | { readonly ok: true; readonly message: Message }
  | { readonly ok: false; readonly fault: MessageFault; readonly detail: string };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Reads one message's text (see the module comment): the message, or why it is none. */
export function parseMessage(text: string): Parsed {
  let parsed: unknown;
  try {
    parsed = parseJsonLossless(text);
  } catch {
    return { ok: false, fault: "not-json", detail: "the message is not JSON" };
  }
  if (!isObject(parsed)) return { ok: false, fault: "invalid-message", detail: "the message is not a JSON object" };
  if (parsed.v !== PROTOCOL_VERSION) {
    return { ok: false, fault: "unknown-version", detail: `v is ${describe(parsed.v)}, where this build speaks v 1` };
  }
  const { type } = parsed;
  if (typeof type !== "string" || !Object.hasOwn(MESSAGE_SCHEMAS, type)) {
    return { ok: false, fault: "unknown-type", detail: `type is ${describe(type)}, which is no message type` };
  }
  const result = MESSAGE_SCHEMAS[type as MessageType].safeParse(parsed);
  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue === undefined || issue.path.length === 0 ? "" : ` at ${issue.path.join(".")}`;
    return { ok: false, fault: "invalid-message", detail: `a ${type} message fails its schema${where}: ${issue?.message}` };
  }
  return { ok: true, message: result.data as Message };
}

/** A found value, for a fault's detail (never more than its kind, or a short text). */
function describe(found: unknown): string {
  if (found === undefined) return "missing";
  if (typeof found === "string") return JSON.stringify(found.length > 32 ? `${found.slice(0, 32)}…` : found);
  if (typeof found === "number" || typeof found === "bigint" || typeof found === "boolean") return String(found);
  return found === null ? "null" : typeof found;
}

/** `JSON.rawJSON` (Node.js 21 and later), which the TypeScript library in use does not declare yet. */
const rawJson = (JSON as unknown as { rawJSON(text: string): unknown }).rawJSON;

/** A message's text: JSON, every `bigint` (inside a JSON value) written exactly as a JSON number. */
export function messageText(message: Message): string {
  return JSON.stringify(message, (_key, found: unknown) => (typeof found === "bigint" ? rawJson(found.toString()) : found));
}

// ── values ──────────────────────────────────────────────────────────────────────────────────────────────────────

/** The type names whose values are read back as something else than written (see the module comment). */
const FLOATS = new Set(["real", "double precision"]);
const JSONS = new Set(["json", "jsonb"]);

/** The element type of an array type's name (`bigint[]` → `bigint`), or null. */
function elementType(type: string): string | null {
  return type.endsWith("[]") ? type.slice(0, -2) : null;
}

/** `0x`-prefixed lowercase hex of `bytes`. */
export function hexOf(bytes: Uint8Array): string {
  let text = "0x";
  for (const byte of bytes) text += byte.toString(16).padStart(2, "0");
  return text;
}

/** The bytes of `X`, `0x`-prefixed lowercase hex. */
export function bytesOf(hex: string): Uint8Array {
  const bytes = new Uint8Array((hex.length - 2) / 2);
  for (let index = 0; index < bytes.length; index++) bytes[index] = Number.parseInt(hex.slice(2 + index * 2, 4 + index * 2), 16);
  return bytes;
}

/**
 * A value the core read from a column of `type`, as a message carries it (see the module comment). Throws for a value
 * the database API never gives (a function, a class instance other than `Uint8Array`).
 */
export function encodeValue(type: string, found: unknown): JsonValue {
  if (found === null || found === undefined) return null;
  const element = elementType(type);
  // A nested array is a further dimension of the same type.
  if (element !== null && Array.isArray(found)) return found.map((item) => encodeValue(Array.isArray(item) ? type : element, item));
  if (JSONS.has(type)) {
    if (!isJsonValue(found)) throw new Error(`a ${type} value that is no JSON value`);
    return found as JsonValue;
  }
  if (typeof found === "bigint") return found.toString();
  if (found instanceof Uint8Array) return hexOf(found);
  if (typeof found === "number") return Number.isFinite(found) ? found : String(found);
  if (typeof found === "string" || typeof found === "boolean") return found;
  throw new Error(`a ${type} value of ${typeof found} that no message carries`);
}

/** A value of a column of `type` as the private side reads it back: the value the core read (see the module comment). */
export function decodeValue(type: string, found: JsonValue): unknown {
  if (found === null) return null;
  const element = elementType(type);
  if (element !== null && Array.isArray(found)) {
    return found.map((item) => decodeValue(Array.isArray(item) ? type : element, item as JsonValue));
  }
  if (JSONS.has(type)) return found;
  if (type === "bigint" && typeof found === "string") return BigInt(found);
  if (type === "bytea" && typeof found === "string" && HEX_BYTES.test(found)) return bytesOf(found);
  if (FLOATS.has(type) && typeof found === "string") return Number(found);
  return found;
}

/** A parameter as the private side sends it (see the module comment). */
export function encodeParameter(found: unknown): JsonValue {
  if (found === null || found === undefined) return null;
  if (typeof found === "bigint") return found.toString();
  if (found instanceof Uint8Array) return hexOf(found);
  if (found instanceof Date) return found.toISOString();
  if (Array.isArray(found)) return found.map((item) => encodeParameter(item));
  if (typeof found === "number" || typeof found === "string" || typeof found === "boolean") return found;
  if (isJsonValue(found)) return found as JsonValue;
  throw new Error(`a parameter of ${typeof found} that no message carries`);
}

/** A parameter as the core passes it to the database API (see the module comment). */
export function decodeParameter(found: JsonValue): unknown {
  if (typeof found === "string" && HEX_BYTES.test(found)) return bytesOf(found);
  if (Array.isArray(found)) return found.map((item) => decodeParameter(item as JsonValue));
  return found;
}
