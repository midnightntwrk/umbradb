/**
 * The tape's records: their five kinds, the check that a value is one, and the one line the writer writes for each.
 * [TT-1]
 *
 * A record is the object its line holds, so a test writes records as plain values:
 * - a **call**: `{ "method", "params", "result" | "error", "delayMs"? }` — answered with `result` (or the JSON-RPC
 *   `error`, any JSON value as recorded) `delayMs` milliseconds after the call (an integer from 0 to 2^31 − 1, the
 *   longest timer Node.js keeps);
 * - a **subscription**: `{ "subscribe": id, "method", "params" }` — the subscription call `method(params)`, answered
 *   with `id` (a string or a safe integer, unique within its session); and a **notification** of it:
 *   `{ "notify": id, "result" }`, which must follow a `subscribe` record with that id in the same session;
 * - a **disconnect**: `{ "disconnect": true }`, which ends a session;
 * - a **fault**: `{ "fault": "timeout" | "error", "method", "params", "code"? }` (`code` a safe integer, used by an
 *   `error` fault and ignored by a `timeout` one).
 *
 * `method` is a non-empty string; `params` an array or an object (JSON-RPC 2.0's "structured value"). A record has no
 * other field. Given as a value, a record's field set to `undefined` is left out, as `JSON.stringify` leaves it out (so
 * `{ ...call, delayMs: undefined }` is the call without a delay); inside a value, `undefined` is refused. [TT-1]
 *
 * **The line** ({@link recordText}): the record's fields in the order listed above, each value in the tape's one JSON
 * form (`./json.ts`), with no space; the reader accepts a line only in this form (`./tape.ts`). [TT-1]
 */

import { TapeError, type TapeProblem } from "./errors.js";
import { type Json, jsonText, NotJsonError } from "./json.js";

/** A subscription's id, as the node answered the subscription call. */
export type SubscriptionId = string | number;

/** A call's parameters: JSON-RPC 2.0's structured value. */
export type Params = readonly Json[] | { readonly [key: string]: Json };

/** A call and its answer. */
export type CallRecord =
  | { readonly method: string; readonly params: Params; readonly result: Json; readonly delayMs?: number }
  | { readonly method: string; readonly params: Params; readonly error: Json; readonly delayMs?: number };

/** A subscription call and the id it was answered with. */
export interface SubscribeRecord {
  readonly subscribe: SubscriptionId;
  readonly method: string;
  readonly params: Params;
}

/** A notification of a subscription. */
export interface NotifyRecord {
  readonly notify: SubscriptionId;
  readonly result: Json;
}

/** The end of a session: the tape node drops the connection. */
export interface DisconnectRecord {
  readonly disconnect: true;
}

/** The next matching call times out (no answer) or fails with `code`. */
export interface FaultRecord {
  readonly fault: "timeout" | "error";
  readonly method: string;
  readonly params: Params;
  readonly code?: number;
}

export type TapeRecord = CallRecord | SubscribeRecord | NotifyRecord | DisconnectRecord | FaultRecord;

export type RecordKind = "call" | "subscribe" | "notify" | "disconnect" | "fault";

/** Each kind's fields, in the tape format's order: the order the writer writes them in. [TT-1] */
export const FIELD_ORDER: Readonly<Record<RecordKind, readonly string[]>> = Object.freeze({
  call: Object.freeze(["method", "params", "result", "error", "delayMs"]),
  subscribe: Object.freeze(["subscribe", "method", "params"]),
  notify: Object.freeze(["notify", "result"]),
  disconnect: Object.freeze(["disconnect"]),
  fault: Object.freeze(["fault", "method", "params", "code"]),
});

/** The field that names each kind, checked in this order (a call is named by `method`, which a fault also has). */
const KIND_FIELDS: readonly (readonly [string, RecordKind])[] = [
  ["subscribe", "subscribe"],
  ["notify", "notify"],
  ["disconnect", "disconnect"],
  ["fault", "fault"],
  ["method", "call"],
];

/** Each kind's fields besides the one naming it that a record must have (a call also needs `result` or `error`). */
const REQUIRED: Readonly<Record<RecordKind, readonly string[]>> = Object.freeze({
  call: Object.freeze(["params"]),
  subscribe: Object.freeze(["method", "params"]),
  notify: Object.freeze(["result"]),
  disconnect: Object.freeze([]),
  fault: Object.freeze(["method", "params"]),
});

/** The longest delay a timer of Node.js keeps (a longer one fires at once). */
export const MAX_DELAY_MS = 2 ** 31 - 1;

/** Whether a record has a field: an own one whose value is not `undefined` (a field set to `undefined` is left out). */
export function hasField(record: object, field: string): boolean {
  return Object.hasOwn(record, field) && (record as Record<string, unknown>)[field] !== undefined;
}

const has = hasField;

/** Whether a value is a plain object (an array's prototype is `Array.prototype`, so an array is not). */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function shown(value: unknown): string {
  try {
    const text = jsonText(value);
    return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  } catch {
    return typeof value;
  }
}

function kindOf(value: object): RecordKind | undefined {
  return KIND_FIELDS.find(([field]) => has(value, field))?.[1];
}

/** The kind of a record already checked (by {@link checkRecord}). */
export function recordKind(record: TapeRecord): RecordKind {
  return kindOf(record) as RecordKind;
}

/** Checks that `value` is a tape record and returns its kind; throws `bad-tape-record` at `line` otherwise. [TT-1] */
export function checkRecord(value: unknown, line: number): RecordKind {
  const fail = (reason: TapeProblem, detail: string): never => {
    throw new TapeError(line, reason, detail);
  };
  if (!isPlainObject(value)) {
    const what = Array.isArray(value) ? "an array" : value === null ? "null" : typeof value;
    return fail("not-a-record", `a record is a JSON object, not ${what === "object" ? "a class instance" : what}`);
  }
  const kind = kindOf(value);
  if (kind === undefined) {
    return fail("unknown-kind", `${shown(value)} has none of the fields method, subscribe, notify, disconnect, fault`);
  }
  const fields = FIELD_ORDER[kind];
  for (const field of Object.keys(value)) {
    if (has(value, field) && !fields.includes(field)) {
      fail("unexpected-field", `a ${kind} record has no field ${JSON.stringify(field)}`);
    }
  }
  for (const field of REQUIRED[kind]) {
    if (!has(value, field)) fail("missing-field", `a ${kind} record needs the field ${JSON.stringify(field)}`);
  }
  if (kind === "call" && has(value, "result") === has(value, "error")) {
    if (has(value, "result")) fail("result-and-error", "a call record holds a result or an error, not both");
    fail("missing-field", 'a call record needs the field "result" or "error"');
  }
  if (has(value, "method") && (typeof value.method !== "string" || value.method === "")) {
    fail("bad-method", `method must be a non-empty string, not ${shown(value.method)}`);
  }
  if (has(value, "params") && !Array.isArray(value.params) && !isPlainObject(value.params)) {
    fail("bad-params", `params must be an array or an object, not ${shown(value.params)}`);
  }
  if (has(value, "delayMs")) {
    const delay = value.delayMs;
    if (!Number.isSafeInteger(delay) || (delay as number) < 0 || (delay as number) > MAX_DELAY_MS) {
      fail("bad-delay", `delayMs must be an integer from 0 to ${MAX_DELAY_MS}, not ${shown(delay)}`);
    }
  }
  for (const field of ["subscribe", "notify"]) {
    if (!has(value, field)) continue;
    const id = value[field];
    if (typeof id !== "string" && !Number.isSafeInteger(id)) {
      fail("bad-subscription-id", `${field} must be a string or a safe integer, not ${shown(id)}`);
    }
  }
  if (kind === "disconnect" && value.disconnect !== true) {
    fail("bad-disconnect", `disconnect must be true, not ${shown(value.disconnect)}`);
  }
  if (kind === "fault" && value.fault !== "timeout" && value.fault !== "error") {
    fail("bad-fault", `fault must be "timeout" or "error", not ${shown(value.fault)}`);
  }
  if (has(value, "code") && !Number.isSafeInteger(value.code)) {
    fail("bad-code", `code must be a safe integer, not ${shown(value.code)}`);
  }
  return kind;
}

/** The line the writer writes for a record already checked (by {@link checkRecord}), without its newline. */
export function recordText(record: TapeRecord): string {
  const fields = FIELD_ORDER[recordKind(record)];
  const values = record as unknown as Record<string, unknown>;
  const members: string[] = [];
  for (const field of fields) {
    if (has(record, field)) members.push(`${JSON.stringify(field)}:${jsonText(values[field], `$.${field}`)}`);
  }
  return `{${members.join(",")}}`;
}

/** Checks a record and returns its line; throws `bad-tape-record` at `line` for a value JSON cannot hold too. */
export function recordLine(value: unknown, line: number): string {
  checkRecord(value, line);
  try {
    return recordText(value as TapeRecord);
  } catch (error) {
    // A checked record's fields are plain data; the only error writing them can meet is a value JSON cannot hold.
    throw new TapeError(line, "not-json-value", (error as NotJsonError).message);
  }
}

/**
 * A check of what subscriptions need across lines, given each record in turn with its line: each session's
 * subscription ids are unique, and each notification follows a `subscribe` record with its id in the same session (ids
 * compared as JSON: the string `"1"` is not the number `1`). Throws `bad-tape-record` at the record's line. [TT-3]
 */
export function sessionCheck(): (record: TapeRecord, line: number) => void {
  let ids = new Set<string>();
  return (record, line) => {
    const kind = recordKind(record);
    if (kind === "disconnect") ids = new Set();
    if (kind === "subscribe") {
      const id = jsonText((record as SubscribeRecord).subscribe);
      if (ids.has(id)) throw new TapeError(line, "duplicate-subscription", `the subscription id ${id} is in use`);
      ids.add(id);
    }
    if (kind === "notify") {
      const id = jsonText((record as NotifyRecord).notify);
      if (!ids.has(id)) {
        throw new TapeError(line, "unknown-subscription", `no subscribe record of this session has the id ${id}`);
      }
    }
  };
}

/**
 * Checks records as a tape: each one a tape record (`bad-tape-record` at its place, from 1), and the subscription rules
 * held. [TT-1, TT-3]
 */
export function checkTape(records: readonly TapeRecord[]): void {
  const check = sessionCheck();
  records.forEach((record, index) => {
    recordLine(record, index + 1);
    check(record, index + 1);
  });
}
