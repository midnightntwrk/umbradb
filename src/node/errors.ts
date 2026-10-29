/**
 * The node client's errors: each an `UmbraError` whose code says whether the failure is retried or halts the process.
 * [IN-9, IN-10]
 *
 * - **`node-unreachable`, retryable** (retried with back-off): the connection could not be made
 *   (`reason: connect-failed`, `cause`: the system's code), was refused with HTTP 429 or a 5xx status (`http-status`,
 *   `status`), or was lost (`connection-closed`, `closeCode`); a call or a connection attempt got no answer within its
 *   timeout (`timeout`, `connect-timeout`, `timeoutMs`); or the node applied its own rate limit (`rate-limited`).
 *   [IN-10]
 * - **`node-requirement`, not retryable** (the process halts, since the node cannot serve what the indexer needs): the
 *   node has no block it must serve (a `null` block hash, header or block: `block-unavailable`, with `height` or
 *   `block`), or says the state at a block is gone, as a pruned node does (`state-unavailable`). [IN-9]
 * - **`node-error`, not retryable** (a halt at a finalized height): any other JSON-RPC error answer (`rpc-error`); a
 *   handshake refused with another status (`handshake-refused`, `status`); an answer, an error or a frame of the wrong
 *   shape (`bad-answer`, with `path`, what it `found`, and a short `value`); or a method outside the allowed node calls
 *   (`method-not-allowed`). [RN-8, IN-8]
 *
 * Every error also names the node `method` it failed in (`null` for a connection attempt no call is waiting on), and a
 * JSON-RPC error's `rpcCode` and `rpcMessage`. None names the node's URL, its host or its port: the URL is a `secret`
 * field, and a system error's text may hold the host, so only its code is kept. [IN-8, CF-4]
 *
 * Over WebSocket an HTTP status exists only for the handshake, so a rate limit ("HTTP 429") is read there, and in the
 * open connection as the node's own rate-limit answer: Substrate's RPC server answers a call over its rate limit with
 * `{ code: -32999, message: "RPC rate limit exceeded" }` (`polkadot-sdk` stable2606,
 * `substrate/client/rpc-servers/src/middleware/mod.rs:151`). A pruned state is answered `4003 "Client error:
 * UnknownBlock: State already discarded for 0x…"` (`substrate/client/db/src/lib.rs:2833`, through
 * `substrate/client/rpc-api/src/state/error.rs`), whose text is what {@link rpcFailure} looks for.
 */

import { type ErrorCode, UmbraError } from "../db/errors.js";
import type { NodeMethod } from "./methods.js";
import type { SocketFailure } from "./socket.js";

/** Substrate's answer to a call over the node's RPC rate limit. */
export const RATE_LIMITED_RPC_CODE = -32999;

/** Substrate's text for a state the node no longer has (a pruned node). */
export const STATE_DISCARDED_TEXT = "State already discarded";

/** How a connection failed, as the client sees it: the socket's own report, or the client's verdict on it. */
export type ConnectionFailure =
  | SocketFailure
  /** No `open` within the call timeout. */
  | { readonly kind: "connect-timeout" }
  /** A frame that is not JSON-RPC 2.0: the connection cannot be trusted to pair answers with calls any more. */
  | { readonly kind: "bad-frame" };

/** The JSON type of a value, as a bad answer reports what it found. */
function kindOf(value: unknown): string {
  if (value === undefined) return "missing";
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** A string shown in a bad answer's details: its first 64 characters. */
function shortened(text: string): string {
  return text.length > 64 ? `${text.slice(0, 64)}…` : text;
}

/** An answer, an error or a frame of the wrong shape (`node-error`, `bad-answer`). */
export function badAnswer(method: NodeMethod | null, path: string, value: unknown, expected: string): UmbraError {
  const found = kindOf(value);
  const shown =
    typeof value === "string"
      ? { value: shortened(value) }
      : typeof value === "number" || typeof value === "boolean"
        ? { value }
        : {};
  const what = found === "missing" ? "nothing" : `a ${found}`;
  return new UmbraError(
    "node-error",
    `${method ?? "the node"} answered ${what} at ${path}, where ${expected} was expected: the node does not speak ` +
      "the JSON-RPC the indexer reads, so this call cannot succeed",
    { method, reason: "bad-answer", path, found, ...shown },
  );
}

/** A JSON-RPC error answer to `method`. */
export function rpcFailure(method: NodeMethod, error: unknown): UmbraError {
  if (!isRecord(error) || !Number.isInteger(error.code) || typeof error.message !== "string") {
    return badAnswer(method, "error", error, "a JSON-RPC error object ({ code, message })");
  }
  const rpc = { rpcCode: error.code as number, rpcMessage: error.message };
  if (error.code === RATE_LIMITED_RPC_CODE) {
    return new UmbraError(
      "node-unreachable",
      `${method}: the node refused the call over its rate limit (${error.code}); it is tried again after a back-off`,
      { method, reason: "rate-limited", ...rpc },
    );
  }
  if (error.message.includes(STATE_DISCARDED_TEXT)) {
    return new UmbraError(
      "node-requirement",
      `${method}: the node no longer has the state at this block (${error.message}); the indexer needs a node that ` +
        "keeps the state of every block from the start height (--state-pruning archive)",
      { method, reason: "state-unavailable", ...rpc },
    );
  }
  return new UmbraError("node-error", `${method}: the node answered with an error: ${error.code} ${error.message}`, {
    method,
    reason: "rpc-error",
    ...rpc,
  });
}

/** A block the node must serve but does not have. [IN-9] */
export function blockUnavailable(method: NodeMethod, where: { height: bigint } | { block: string }): UmbraError {
  const which = "height" in where ? `at height ${where.height}` : where.block;
  return new UmbraError(
    "node-requirement",
    `${method}: the node has no block ${which}; the indexer needs a node that serves every block from the start ` +
      "height",
    { method, reason: "block-unavailable", ...where },
  );
}

/** A call that got no answer within its timeout. */
export function callTimedOut(method: NodeMethod, timeoutMs: number): UmbraError {
  return new UmbraError("node-unreachable", `${method}: the node did not answer within ${timeoutMs} ms`, {
    method,
    reason: "timeout",
    timeoutMs,
  });
}

/** What a failed or ended connection means for a call of `method` on it (`null`: for the connection itself). */
export function connectionFailure(
  failure: ConnectionFailure,
  method: NodeMethod | null,
  timeoutMs: number,
): UmbraError {
  const what = method ?? "the node connection";
  switch (failure.kind) {
    case "connect-failed":
      return new UmbraError(
        "node-unreachable",
        `${what}: could not connect to the node${failure.code === undefined ? "" : ` (${failure.code})`}`,
        { method, reason: "connect-failed", ...(failure.code === undefined ? {} : { cause: failure.code }) },
      );
    case "connect-timeout":
      return new UmbraError(
        "node-unreachable",
        `${what}: the node did not complete the connection within ${timeoutMs} ms`,
        { method, reason: "connect-timeout", timeoutMs },
      );
    case "closed":
      return new UmbraError("node-unreachable", `${what}: the connection to the node was lost (${failure.code})`, {
        method,
        reason: "connection-closed",
        closeCode: failure.code,
      });
    case "http-status": {
      const retried = failure.status === 429 || (failure.status >= 500 && failure.status <= 599);
      const code: ErrorCode = retried ? "node-unreachable" : "node-error";
      return new UmbraError(
        code,
        `${what}: the node's address answered the WebSocket handshake with HTTP ${failure.status}` +
          (retried ? "; it is tried again after a back-off" : ", not a WebSocket JSON-RPC node"),
        { method, reason: retried ? "http-status" : "handshake-refused", status: failure.status },
      );
    }
    case "bad-frame":
      return badAnswer(method, "message", undefined, "a JSON-RPC 2.0 answer or notification");
  }
}

/**
 * A call to a method outside the allowed node calls (or a subscription method through `call`), refused before it is
 * sent. [IN-8]
 */
export function methodNotAllowed(method: unknown): UmbraError {
  return new UmbraError(
    "node-error",
    `${String(method)} is not a node call the indexer makes: it calls only its allowed node methods, and subscribes ` +
      "through subscribeNewHeads and subscribeFinalizedHeads",
    { method, reason: "method-not-allowed" },
  );
}

/** A call's parameter the client cannot send. */
export function invalidParameter(method: NodeMethod, parameter: string, expected: string): UmbraError {
  return new UmbraError("invalid-parameter", `${method}: ${parameter} must be ${expected}`, { method, parameter });
}

/** A client option that cannot be used (the URL never shown). */
export function invalidOption(field: "node" | "callTimeoutMs" | "backoffCeilingMs", reason: string): UmbraError {
  const what =
    field === "node"
      ? "the node's address must be a ws:// or wss:// URL"
      : `${field} must be a positive integer of milliseconds`;
  return new UmbraError("invalid-configuration", `the node client cannot start: ${what}`, { field, reason });
}

/** The client was used after `close()`. */
export function clientClosed(): UmbraError {
  return new UmbraError("handle-closed", "the node client was used after it was closed", { handle: "node-client" });
}
