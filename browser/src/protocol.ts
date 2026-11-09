/**
 * What the page and a process worker of the browser build say to each other.
 *
 * The page starts the process (`start`), then calls it (`call`) for:
 * - its state (`status`);
 * - the admin endpoints (`admin`: `GET` of `/health/live`, `/health/ready`, `/status`, `/config`), answered by the
 *   process's own fetch-style admin handler (`admin.fetch`);
 * - its database's contents hash;
 * - a read of its database, one `REPEATABLE READ READ ONLY` read;
 * - its module API (`api`: one request, answered by the module API's fetch-style handler, `api.fetch`; `connect-api`:
 *   a `MessagePort` the page made, on which the process serves the module API's subscriptions, `api.connect`);
 * - a backup of its database and, before the core's process starts, a restore into it (`backup`, `restore`);
 * - its stop.
 *
 * **The private link** runs over `MessageChannel`s the page makes (`./link.ts`): a private worker asks for one at each
 * (re)connection (`link-connect`); the page gives one end to the core worker (`link-accept`) and the other to the
 * private worker (`link-channel`); a link the page drops is told to both (`link-drop`).
 *
 * The worker sends its log lines, S once chosen, its startup's outcome and how processing ended. Every value crosses as
 * JSON-ready data ({@link jsonSafe}): heights and other integers beyond 2^53 as decimal text, bytes as `0x` hex.
 */

import type { BrowserRun } from "./configuration.js";

/** A call the page makes of a process worker. */
export type CallMethod = "status" | "admin" | "contents-hash" | "read" | "api" | "connect-api" | "backup" | "restore" | "stop";

/** The run the page starts a process with: S is null for a new database of the core, chosen by the worker. */
export type StartRun = Omit<BrowserRun, "start"> & { readonly start: number | null };

/** From the page to a process worker. */
export type ToProcessWorker =
  | {
      readonly type: "start";
      readonly side: "public" | "private";
      /** A private process's instance id; null for the core. */
      readonly instance: string | null;
      readonly run: StartRun;
    }
  /** A call; a `MessagePort` among its arguments is transferred (`connect-api`'s). */
  | { readonly type: "call"; readonly id: number; readonly method: CallMethod; readonly args: readonly unknown[] }
  /** To the core worker: one end of link channel `link`, for its process's `privateLink.accept`. */
  | { readonly type: "link-accept"; readonly link: number; readonly port: MessagePort }
  /** To a private worker: the other end of link channel `link`, the answer to its `link-connect` `ask`. */
  | { readonly type: "link-channel"; readonly ask: number; readonly link: number; readonly port: MessagePort }
  /** To both workers of link channel `link`: the page dropped it. */
  | { readonly type: "link-drop"; readonly link: number };

/** An error as it crosses: its name, message and, for an `UmbraError`, its code and details. */
export interface CrossedError {
  readonly name: string;
  readonly message: string;
  readonly code: string | null;
  readonly details: unknown;
}

/** From a process worker to the page. */
export type FromProcessWorker =
  | { readonly type: "log"; readonly line: string }
  /** S, and the private instances the configuration has (the core's only). */
  | { readonly type: "chosen"; readonly start: number; readonly instances: readonly string[] }
  /** Startup completed. */
  | { readonly type: "started" }
  | { readonly type: "refused"; readonly error: CrossedError }
  | { readonly type: "ended"; readonly end: unknown }
  | { readonly type: "result"; readonly id: number; readonly ok: true; readonly value: unknown }
  | { readonly type: "result"; readonly id: number; readonly ok: false; readonly error: CrossedError }
  /** A private worker's process asks for a new link channel (its `connect`), `ask` naming the request. */
  | { readonly type: "link-connect"; readonly ask: number };

const HEX = Array.from({ length: 256 }, (_, byte) => byte.toString(16).padStart(2, "0"));

/** `0x` and the bytes' lowercase hex. */
export function hexOf(bytes: Uint8Array): string {
  let out = "0x";
  for (const byte of bytes) out += HEX[byte];
  return out;
}

/** An error as it crosses (see {@link CrossedError}). */
export function crossedError(error: unknown): CrossedError {
  if (!(error instanceof Error)) return { name: "Error", message: String(error), code: null, details: null };
  const { code, details } = error as { code?: unknown; details?: unknown };
  return {
    name: error.name,
    message: error.message,
    code: typeof code === "string" ? code : null,
    details: details === undefined ? null : jsonSafe(details),
  };
}

/** `value` as JSON-ready data (see the module comment). */
export function jsonSafe(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Uint8Array) return hexOf(value);
  if (value instanceof Error) return crossedError(value);
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, jsonSafe(item)]));
  }
  return value;
}
