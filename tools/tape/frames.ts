/**
 * The JSON-RPC 2.0 frames of the test tape: how the tape node reads a request, and the very text it writes for an
 * answer and a notification — in one place, so the recording builder (`./builder.ts`) reads a client's requests exactly
 * as the tape node will on replay, and checks each frame a node sends against the text the tape node will send for its
 * record. [TT-2 to TT-4]
 *
 * **Answers** are `{"jsonrpc":"2.0","id":<id>,"result":<value>}` (or `"error"`), **notifications**
 * `{"jsonrpc":"2.0","method":<name>,"params":{"subscription":<id>,"result":<value>}}`, each value in the tape's JSON
 * form (`./json.ts`) — the fields in the order a Substrate node (`jsonrpsee`) writes them. A notification carries
 * Substrate's name for its subscription: `chain_newHead` for `chain_subscribeNewHeads`, `chain_finalizedHead` for
 * `chain_subscribeFinalizedHeads`. The tape format records no name; another subscription method is its own name. [TT-1]
 */

import { type Json, jsonText, parseJsonText } from "./json.js";
import type { SubscriptionId } from "./records.js";

/** A JSON-RPC request id the tape tools take: a string or a safe integer. */
export type RequestId = string | number;

/** A request read from a frame, or why it is not one. */
export type ReadRequest =
  | { readonly valid: true; readonly id: RequestId; readonly method: string; readonly params: Json }
  | { readonly valid: false; readonly id: RequestId | null; readonly error: { code: number; message: string } };

export const PARSE_ERROR = Object.freeze({ code: -32700, message: "Parse error" });
export const INVALID_REQUEST = Object.freeze({ code: -32600, message: "Invalid Request" });

/** Whether a value read from JSON text is an object or an array (JSON-RPC 2.0's structured value). */
function isStructured(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isId(value: unknown): value is RequestId {
  return typeof value === "string" || Number.isSafeInteger(value);
}

/**
 * Reads a frame as a JSON-RPC 2.0 request: an id that is a string or a safe integer, a method, and params that are an
 * array or an object (absent: `[]`, as the tape node matches them).
 */
export function readRequest(text: string): ReadRequest {
  let message: unknown;
  try {
    message = parseJsonText(text);
  } catch {
    return { valid: false, id: null, error: PARSE_ERROR };
  }
  // A batch (an array) is no request: it has no `jsonrpc` field, so it is refused below.
  if (!isStructured(message)) return { valid: false, id: null, error: INVALID_REQUEST };
  const id = isId(message.id) ? message.id : null;
  const params = Object.hasOwn(message, "params") ? message.params : [];
  if (message.jsonrpc !== "2.0" || typeof message.method !== "string" || id === null || !isStructured(params)) {
    return { valid: false, id, error: INVALID_REQUEST };
  }
  return { valid: true, id, method: message.method, params: params as Json };
}

/** The answer frame carrying `result` for the request `id`. */
export function resultFrame(id: RequestId, result: Json): string {
  return `{"jsonrpc":"2.0","id":${jsonText(id)},"result":${jsonText(result)}}`;
}

/** The answer frame carrying the JSON-RPC `error` for the request `id` (null: a frame that was no request). */
export function errorFrame(id: RequestId | null, error: Json): string {
  return `{"jsonrpc":"2.0","id":${jsonText(id)},"error":${jsonText(error)}}`;
}

/** The notification frame of the subscription `subscription`, under the notification method `method`. */
export function notificationFrame(method: string, subscription: SubscriptionId, result: Json): string {
  const params = `{"subscription":${jsonText(subscription)},"result":${jsonText(result)}}`;
  return `{"jsonrpc":"2.0","method":${JSON.stringify(method)},"params":${params}}`;
}

/** The notification method of each subscription method, as Substrate names them. */
const NOTIFICATION_METHODS: ReadonlyMap<string, string> = new Map([
  ["chain_subscribeNewHeads", "chain_newHead"],
  ["chain_subscribeFinalizedHeads", "chain_finalizedHead"],
]);

/** The method a notification of a subscription made with `method` carries. */
export function notificationMethod(method: string): string {
  return NOTIFICATION_METHODS.get(method) ?? method;
}

/** Whether the recording builder records an answer to `method` as a subscription: the two head subscriptions. */
export function isSubscribeMethod(method: string): boolean {
  return NOTIFICATION_METHODS.has(method);
}
