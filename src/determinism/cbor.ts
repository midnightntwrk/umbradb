/**
 * The canonical row encoding of DT-1 (`openspec/changes/core-arch/specs/determinism/spec.md`): RFC 8949 §4.2.1 core
 * deterministic encoding, written here for exactly the subset UmbraDB stores, with no CBOR dependency.
 *
 * The subset: integers within CBOR's 64-bit range (−2^64 to 2^64 − 1, major types 0 and 1), byte strings, text
 * strings, arrays, maps whose keys are text strings (a `jsonb` object), `false`, `true` and `null`. Every argument is
 * written in its shortest form, every length is definite, and map keys are sorted by the bytewise order of their
 * encodings (RFC 8949 §4.2.1). Floats, tags, other simple values and indefinite lengths are never written.
 *
 * The encoder works with an explicit stack, so deeply nested `jsonb` values do not exhaust the call stack, and it
 * refuses cyclic values. Anything outside the subset fails with a {@link CanonicalEncodingError} naming where it is.
 */

import { explain, refusalOfTypeName } from "./column-rules.js";

/**
 * A value {@link encodeCanonical} accepts: an integer (`number` within ±(2^53 − 1), or `bigint` within CBOR's 64-bit
 * range), a text string, a byte string, a boolean, `null`, an array, or a plain object (text keys).
 */
export type CanonicalValue =
  | null
  | boolean
  | number
  | bigint
  | string
  | Uint8Array
  | readonly CanonicalValue[]
  | { readonly [key: string]: CanonicalValue };

/**
 * The column types of DT-1, named as PostgreSQL's `format_type(type, NULL)` names them (`character varying` for
 * `varchar(n)`; `varchar` and `uuid` since owner decision Q58). `./column-rules.ts` allows exactly these, and their
 * arrays, in a public table.
 */
export const SCALAR_COLUMN_TYPES = [
  "smallint",
  "integer",
  "bigint",
  "numeric",
  "bytea",
  "text",
  "character varying",
  "uuid",
  "boolean",
  "jsonb",
] as const;

/** A scalar column type of DT-1. */
export type ScalarColumnType = (typeof SCALAR_COLUMN_TYPES)[number];

/** A column type of DT-1: a scalar type, or an array of one (any number of dimensions, as in PostgreSQL). */
export type ColumnType = ScalarColumnType | `${ScalarColumnType}[]`;

/** Why a value could not be encoded. */
export type CanonicalEncodingFailure =
  /** A number that is not an integer (a fraction, NaN or an infinity). */
  | "not-integer"
  /** An integral `number` beyond ±(2^53 − 1): it may have been rounded, so it must arrive as `bigint`. */
  | "unsafe-integer"
  /** An integer outside the range of its column type, of `jsonb` (signed 64 bits), or of CBOR (64 bits). */
  | "integer-out-of-range"
  /** A `numeric` value with a fraction. */
  | "numeric-fraction"
  /** A `numeric` value that is not an optional `-` followed by decimal digits. */
  | "numeric-invalid"
  /** A `uuid` value that is not PostgreSQL's output of one: 32 lowercase hex digits in groups 8-4-4-4-12. */
  | "uuid-invalid"
  /** A text string holding a lone UTF-16 surrogate, which has no UTF-8 encoding. */
  | "lone-surrogate"
  /** A value with no encoding in the subset (`undefined`, a function, a `Map`, a class instance, …). */
  | "unsupported-value"
  /** A row value whose JavaScript type does not match its column type. */
  | "type-mismatch"
  /** A column type outside DT-1 (`design.md` §4's column-type table gives the reason). */
  | "unsupported-column-type"
  /** A floating-point column type, which DT-6 refuses with this code (`design.md` §4's column-type table). */
  | "non-deterministic-column"
  /** A row whose number of values differs from its number of column types. */
  | "row-length"
  /** An array or object that contains itself. */
  | "cyclic-value";

/** An encoding failure: `reason` says why, `path` says where (`$` is the value, `$[2]["k"]` a column's nested key). */
export class CanonicalEncodingError extends Error {
  override readonly name = "CanonicalEncodingError";

  constructor(
    readonly reason: CanonicalEncodingFailure,
    readonly path: string,
    detail: string,
  ) {
    super(`${path}: ${reason}: ${detail}`);
  }
}

/** Encodes `value` with RFC 8949 §4.2.1 core deterministic encoding. */
export function encodeCanonical(value: CanonicalValue): Uint8Array {
  const writer = new Writer();
  run(writer, [{ value, mode: "canonical", path: ROOT }]);
  return writer.result();
}

/**
 * Encodes a row as DT-1 defines it: a CBOR array of its column values in column order, each by its column type.
 *
 * The values are what the database API returns (DB-2):
 * - `smallint` and `integer` as `number`; `bigint` as `bigint` (a safe-integer `number` is accepted too); each within
 *   its PostgreSQL range;
 * - `numeric` as PostgreSQL's decimal text, which must be an integer — an optional `-` and digits — and is encoded as
 *   canonical text (`-0` and leading zeros removed); a value with a fraction fails;
 * - `bytea` as a `Uint8Array` (a `Buffer` is one); `text` and `character varying` as a string; `boolean` as a
 *   boolean;
 * - `uuid` as PostgreSQL prints it, which both drivers return unchanged: 32 lowercase hex digits in groups 8-4-4-4-12,
 *   encoded as the byte string of its 16 bytes; any other form (upper case, braces, no hyphens) cannot have come from
 *   a `uuid` column and fails;
 * - `jsonb` as the value parsed without loss: integers within ±(2^53 − 1) as `number`, others as `bigint`; every
 *   number must be an integer within the signed 64-bit range of DT-6;
 * - an array as a JavaScript array, nested for more dimensions, with `null` elements;
 * - `null` for NULL in any column.
 *
 * A column type outside DT-1 fails with the code and the reason of its row in `design.md` §4's column-type table, as
 * far as its name tells (`refusalOfTypeName` of `./column-rules.ts`: without the catalog, an enum or a domain reads as
 * "any other type").
 */
export function encodeRow(values: readonly unknown[], types: readonly ColumnType[]): Uint8Array {
  if (values.length !== types.length) {
    throw new CanonicalEncodingError("row-length", ROOT_PATH, `${values.length} values for ${types.length} columns`);
  }
  const tasks: Task[] = [];
  for (let i = values.length - 1; i >= 0; i--) {
    const type: string = types[i] as string;
    const path: PathNode = { parent: ROOT, key: i };
    if (!COLUMN_TYPES.has(type)) {
      const { code, because } = refusalOfTypeName(type);
      const detail = `column type ${JSON.stringify(type)} is refused. ${explain(because)}`;
      throw new CanonicalEncodingError(code, render(path), detail);
    }
    const value = values[i];
    if (type.endsWith("[]") && value !== null && !Array.isArray(value)) {
      throw new CanonicalEncodingError("type-mismatch", render(path), `${type} needs an array, got ${kindOf(value)}`);
    }
    tasks.push({ value, mode: type === "jsonb" || type === "jsonb[]" ? "json" : (type as ColumnMode), path });
  }
  const writer = new Writer();
  writer.head(MAJOR_ARRAY, values.length);
  run(writer, tasks);
  return writer.result();
}

/**
 * The head of a definite-length array of `length` items: followed by the encodings of its items, it is the
 * encoding of the array. Lets a caller stream rows into one array (the contents hash, a block's changes) without
 * holding them all.
 */
export function encodeArrayHead(length: number): Uint8Array {
  checkSafeInteger(length, ROOT);
  if (length < 0) throw new CanonicalEncodingError("integer-out-of-range", ROOT_PATH, `negative length ${length}`);
  const writer = new Writer();
  writer.head(MAJOR_ARRAY, length);
  return writer.result();
}

// ── internals ───────────────────────────────────────────────────────────────────────────────────────────────────────

const MAJOR_UNSIGNED = 0;
const MAJOR_NEGATIVE = 1;
const MAJOR_BYTES = 2;
const MAJOR_TEXT = 3;
const MAJOR_ARRAY = 4;
const MAJOR_MAP = 5;
const MAJOR_SIMPLE = 7;
const SIMPLE_FALSE = 20;
const SIMPLE_TRUE = 21;
const SIMPLE_NULL = 22;

const CBOR_MAX = 2n ** 64n - 1n;
const CBOR_MIN = -(2n ** 64n);
const INT64_MAX = 2n ** 63n - 1n;
const INT64_MIN = -(2n ** 63n);
const SAFE_MAX = BigInt(Number.MAX_SAFE_INTEGER);

/** The range of each integer column type. */
const INTEGER_RANGES: Readonly<Record<string, readonly [bigint, bigint]>> = {
  smallint: [-(2n ** 15n), 2n ** 15n - 1n],
  integer: [-(2n ** 31n), 2n ** 31n - 1n],
  bigint: [INT64_MIN, INT64_MAX],
};

const COLUMN_TYPES: ReadonlySet<string> = new Set([
  ...SCALAR_COLUMN_TYPES,
  ...SCALAR_COLUMN_TYPES.map((type) => `${type}[]`),
]);

/** PostgreSQL's decimal output of an integral `numeric`: an optional `-` and ASCII digits. */
const NUMERIC_INTEGER = /^(-?)([0-9]+)$/;
/** PostgreSQL's decimal output of a `numeric` with a fraction. */
const NUMERIC_FRACTION = /^-?[0-9]+\.[0-9]+$/;
/** PostgreSQL's output of a `uuid` (`uuid_out`): lowercase hex digits in groups of 8, 4, 4, 4 and 12. */
const UUID_TEXT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
/** In a `u` regular expression a well-formed surrogate pair is one code point, so this matches only lone surrogates. */
const LONE_SURROGATE = /\p{Cs}/u;

const utf8 = new TextEncoder();

/**
 * How a value is read: `canonical` for {@link encodeCanonical}; `json` for a `jsonb` value (no byte strings, integers
 * within signed 64 bits); a scalar column type for a column value; `T[]` for an array column or one of its elements,
 * where a nested array is another dimension.
 */
type ColumnMode = Exclude<ColumnType, "jsonb" | "jsonb[]">;
type Mode = "canonical" | "json" | ColumnMode;

interface PathNode {
  readonly parent: PathNode | undefined;
  readonly key: string | number | undefined;
}

const ROOT: PathNode = { parent: undefined, key: undefined };
const ROOT_PATH = "$";

/** A value to encode, raw bytes to write (a map key already encoded), or the end of a container being encoded. */
type Task =
  | { readonly value: unknown; readonly mode: Mode; readonly path: PathNode }
  | { readonly raw: Uint8Array }
  | { readonly close: object };

function render(path: PathNode): string {
  const keys: (string | number)[] = [];
  for (let node: PathNode | undefined = path; node !== undefined; node = node.parent) {
    if (node.key !== undefined) keys.push(node.key);
  }
  let out = ROOT_PATH;
  for (let i = keys.length - 1; i >= 0; i--) {
    out += `[${JSON.stringify(keys[i])}]`;
  }
  return out;
}

/** Names a value that failed, for the error's detail; `null` and arrays never fail on their own kind. */
function kindOf(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value instanceof Uint8Array) return "a byte array";
  if (typeof value === "object") return `an object (${Object.prototype.toString.call(value)})`;
  return `a ${typeof value}`;
}

function fail(reason: CanonicalEncodingFailure, path: PathNode, detail: string): never {
  throw new CanonicalEncodingError(reason, render(path), detail);
}

/** The bytes of the encoded values, growing as needed. */
class Writer {
  private bytes: Uint8Array;
  private view: DataView;
  private length = 0;

  constructor(capacity = 256) {
    this.bytes = new Uint8Array(capacity);
    this.view = new DataView(this.bytes.buffer);
  }

  private reserve(extra: number): void {
    const needed = this.length + extra;
    if (needed <= this.bytes.length) return;
    let size = this.bytes.length * 2;
    while (size < needed) size *= 2;
    const next = new Uint8Array(size);
    next.set(this.bytes.subarray(0, this.length));
    this.bytes = next;
    this.view = new DataView(next.buffer);
  }

  /** Writes a head with a non-negative safe-integer argument, in its shortest form. */
  head(major: number, argument: number): void {
    const initial = major << 5;
    this.reserve(9);
    if (argument < 24) {
      this.bytes[this.length++] = initial | argument;
    } else if (argument < 0x100) {
      this.bytes[this.length++] = initial | 24;
      this.bytes[this.length++] = argument;
    } else if (argument < 0x1_0000) {
      this.bytes[this.length++] = initial | 25;
      this.view.setUint16(this.length, argument);
      this.length += 2;
    } else if (argument < 0x1_0000_0000) {
      this.bytes[this.length++] = initial | 26;
      this.view.setUint32(this.length, argument);
      this.length += 4;
    } else {
      this.bytes[this.length++] = initial | 27;
      this.view.setUint32(this.length, Math.floor(argument / 0x1_0000_0000));
      this.view.setUint32(this.length + 4, argument >>> 0);
      this.length += 8;
    }
  }

  /** Writes a head with an argument from 0 to 2^64 − 1, in its shortest form. */
  headBig(major: number, argument: bigint): void {
    if (argument <= SAFE_MAX) {
      this.head(major, Number(argument));
      return;
    }
    this.reserve(9);
    this.bytes[this.length++] = (major << 5) | 27;
    this.view.setBigUint64(this.length, argument);
    this.length += 8;
  }

  raw(bytes: Uint8Array): void {
    this.reserve(bytes.length);
    this.bytes.set(bytes, this.length);
    this.length += bytes.length;
  }

  result(): Uint8Array {
    return this.bytes.slice(0, this.length);
  }
}

function checkSafeInteger(value: number, path: PathNode): void {
  if (Number.isSafeInteger(value)) return;
  if (Number.isInteger(value)) fail("unsafe-integer", path, `${value} is beyond ±(2^53 - 1); pass it as a bigint`);
  fail("not-integer", path, `${value} is not an integer`);
}

function writeInteger(writer: Writer, value: number | bigint, min: bigint, max: bigint, path: PathNode): void {
  if (typeof value === "number") {
    checkSafeInteger(value, path);
    if (value < min || value > max) fail("integer-out-of-range", path, `${value} is outside [${min}, ${max}]`);
    if (value >= 0) writer.head(MAJOR_UNSIGNED, value);
    else writer.head(MAJOR_NEGATIVE, -1 - value);
    return;
  }
  if (value < min || value > max) fail("integer-out-of-range", path, `${value} is outside [${min}, ${max}]`);
  if (value >= 0n) writer.headBig(MAJOR_UNSIGNED, value);
  else writer.headBig(MAJOR_NEGATIVE, -1n - value);
}

function utf8Of(text: string, path: PathNode): Uint8Array {
  if (LONE_SURROGATE.test(text)) fail("lone-surrogate", path, "the text holds a lone UTF-16 surrogate");
  return utf8.encode(text);
}

function writeText(writer: Writer, text: string, path: PathNode): void {
  const bytes = utf8Of(text, path);
  writer.head(MAJOR_TEXT, bytes.length);
  writer.raw(bytes);
}

/** The 16 bytes of a uuid in PostgreSQL's output form (already checked against {@link UUID_TEXT}). */
function uuidBytes(text: string): Uint8Array {
  const hex = text.replace(/-/g, "");
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) bytes[i] = Number.parseInt(hex.slice(2 * i, 2 * i + 2), 16);
  return bytes;
}

function writeBytes(writer: Writer, bytes: Uint8Array): void {
  writer.head(MAJOR_BYTES, bytes.length);
  writer.raw(bytes);
}

function compareBytes(a: Uint8Array, b: Uint8Array): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = (a[i] as number) - (b[i] as number);
    if (d !== 0) return d;
  }
  return a.length - b.length;
}

function isPlainObject(value: object): boolean {
  const prototype: unknown = Object.getPrototypeOf(value);
  return (prototype === Object.prototype || prototype === null) && Object.getOwnPropertySymbols(value).length === 0;
}

/** The runner of the explicit stack: pops tasks until none is left. */
function run(writer: Writer, tasks: Task[]): void {
  const open = new Set<object>();
  for (let task = tasks.pop(); task !== undefined; task = tasks.pop()) {
    if ("raw" in task) writer.raw(task.raw);
    else if ("close" in task) open.delete(task.close);
    else encodeOne(writer, tasks, open, task.value, task.mode, task.path);
  }
}

/** Opens a container: refuses a cycle, and schedules its closing after its children. */
function enter(tasks: Task[], open: Set<object>, container: object, path: PathNode): void {
  if (open.has(container)) fail("cyclic-value", path, "the value contains itself");
  open.add(container);
  tasks.push({ close: container });
}

function pushArray(
  writer: Writer,
  tasks: Task[],
  open: Set<object>,
  items: readonly unknown[],
  mode: Mode,
  path: PathNode,
): void {
  enter(tasks, open, items, path);
  writer.head(MAJOR_ARRAY, items.length);
  for (let i = items.length - 1; i >= 0; i--) tasks.push({ value: items[i], mode, path: { parent: path, key: i } });
}

function pushMap(writer: Writer, tasks: Task[], open: Set<object>, object: object, mode: Mode, path: PathNode): void {
  enter(tasks, open, object, path);
  const record = object as Record<string, unknown>;
  const entries = Object.keys(record).map((key) => {
    const keyPath: PathNode = { parent: path, key };
    const bytes = utf8Of(key, keyPath);
    const keyWriter = new Writer(bytes.length + 9);
    keyWriter.head(MAJOR_TEXT, bytes.length);
    keyWriter.raw(bytes);
    return { encodedKey: keyWriter.result(), value: record[key], path: keyPath };
  });
  entries.sort((a, b) => compareBytes(a.encodedKey, b.encodedKey));
  writer.head(MAJOR_MAP, entries.length);
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i] as (typeof entries)[number];
    tasks.push({ value: entry.value, mode, path: entry.path });
    tasks.push({ raw: entry.encodedKey });
  }
}

function encodeOne(writer: Writer, tasks: Task[], open: Set<object>, value: unknown, mode: Mode, path: PathNode): void {
  if (value === null) {
    writer.head(MAJOR_SIMPLE, SIMPLE_NULL);
    return;
  }
  if (mode === "canonical" || mode === "json") {
    encodeGeneric(writer, tasks, open, value, mode, path);
    return;
  }
  if (Array.isArray(value)) {
    if (!mode.endsWith("[]")) fail("type-mismatch", path, `${mode} needs a scalar, got an array`);
    pushArray(writer, tasks, open, value, mode, path);
    return;
  }
  const type = (mode.endsWith("[]") ? mode.slice(0, -2) : mode) as Exclude<ScalarColumnType, "jsonb">;
  encodeColumnScalar(writer, value, type, path);
}

/** A value of {@link encodeCanonical}, or a `jsonb` value (`json`: no byte strings, integers within signed 64 bits). */
function encodeGeneric(
  writer: Writer,
  tasks: Task[],
  open: Set<object>,
  value: unknown,
  mode: "canonical" | "json",
  path: PathNode,
): void {
  switch (typeof value) {
    case "boolean":
      writer.head(MAJOR_SIMPLE, value ? SIMPLE_TRUE : SIMPLE_FALSE);
      return;
    case "number":
    case "bigint":
      if (mode === "json") writeInteger(writer, value, INT64_MIN, INT64_MAX, path);
      else writeInteger(writer, value, CBOR_MIN, CBOR_MAX, path);
      return;
    case "string":
      writeText(writer, value, path);
      return;
    case "object":
      if (Array.isArray(value)) {
        pushArray(writer, tasks, open, value, mode, path);
        return;
      }
      if (value instanceof Uint8Array && mode === "canonical") {
        writeBytes(writer, value);
        return;
      }
      // `null` never gets here: `encodeOne` writes it first.
      if (isPlainObject(value as object)) {
        pushMap(writer, tasks, open, value as object, mode, path);
        return;
      }
  }
  fail("unsupported-value", path, `${kindOf(value)} has no encoding in the subset`);
}

function encodeColumnScalar(
  writer: Writer,
  value: unknown,
  type: Exclude<ScalarColumnType, "jsonb">,
  path: PathNode,
): void {
  switch (type) {
    case "smallint":
    case "integer":
    case "bigint": {
      if (typeof value !== "number" && typeof value !== "bigint") break;
      const [min, max] = INTEGER_RANGES[type] as readonly [bigint, bigint];
      writeInteger(writer, value, min, max, path);
      return;
    }
    case "numeric": {
      if (typeof value !== "string") break;
      const match = NUMERIC_INTEGER.exec(value);
      if (match === null) {
        if (NUMERIC_FRACTION.test(value)) fail("numeric-fraction", path, `${JSON.stringify(value)} has a fraction`);
        fail("numeric-invalid", path, `${JSON.stringify(value)} is not decimal digits with an optional "-"`);
      }
      const digits = (match[2] as string).replace(/^0+(?=[0-9])/, "");
      writeText(writer, digits === "0" ? "0" : (match[1] as string) + digits, path);
      return;
    }
    case "bytea":
      if (!(value instanceof Uint8Array)) break;
      writeBytes(writer, value);
      return;
    case "text":
    case "character varying":
      if (typeof value !== "string") break;
      writeText(writer, value, path);
      return;
    case "uuid":
      if (typeof value !== "string") break;
      if (!UUID_TEXT.test(value)) {
        fail(
          "uuid-invalid",
          path,
          `${JSON.stringify(value)} is not a uuid as PostgreSQL prints it: 32 lowercase hexadecimal digits in groups ` +
            'of 8, 4, 4, 4 and 12, joined by "-"',
        );
      }
      writeBytes(writer, uuidBytes(value));
      return;
    case "boolean":
      if (typeof value !== "boolean") break;
      writer.head(MAJOR_SIMPLE, value ? SIMPLE_TRUE : SIMPLE_FALSE);
      return;
  }
  fail("type-mismatch", path, `${type} cannot hold ${kindOf(value)}`);
}
