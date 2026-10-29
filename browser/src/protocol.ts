/**
 * What the page and a process worker of the browser build say to each other. [BR-1, BR-3; design §9.2]
 *
 * The page starts the process (`start`), then calls it (`call`) for:
 * - its state (`status`);
 * - the admin endpoints (`admin`: `GET` of `/health/live`, `/health/ready`, `/status`, `/config`) [BR-3];
 * - its database's contents hash [DT-3];
 * - a read of its database, one `REPEATABLE READ READ ONLY` read [DB-2];
 * - its module API (`api`, `subscribe`, `unsubscribe`);
 * - a backup of its database and, before the core's process starts, a restore into it (`backup`, `restore`) [BK-5];
 * - its stop [RN-13].
 *
 * The worker sends its log lines, S once chosen, its startup's outcome and how processing ended. Every value crosses as
 * JSON-ready data ({@link jsonSafe}): heights and other integers beyond 2^53 as decimal text, bytes as `0x` hex.
 */

import type { BrowserRun } from "./configuration.js";

/** A call the page makes of a process worker. */
export type CallMethod =
  | "status"
  | "admin"
  | "contents-hash"
  | "read"
  | "api"
  | "subscribe"
  | "unsubscribe"
  | "backup"
  | "restore"
  | "stop";

/** The run the page starts a process with: S is null for a new database of the core, chosen by the worker. [BR-2] */
export type StartRun = Omit<BrowserRun, "start"> & { readonly start: number | null };

/** From the page to a process worker. */
export type ToProcessWorker =
  | {
      readonly type: "start";
      readonly side: "public" | "private";
      /** A private process's instance id; null for the core. */
      readonly instance: string | null;
      readonly run: StartRun;
      /** The worker's port on the page's message network (`./net/network.ts`). */
      readonly network: MessagePort;
    }
  | { readonly type: "call"; readonly id: number; readonly method: CallMethod; readonly args: readonly unknown[] };

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
  /** Startup completed; `api` is where the module API answers (the worker's channel), null without `listen.api`. */
  | { readonly type: "started"; readonly api: { readonly host: string; readonly port: number } | null }
  | { readonly type: "refused"; readonly error: CrossedError }
  | { readonly type: "ended"; readonly end: unknown }
  | { readonly type: "result"; readonly id: number; readonly ok: true; readonly value: unknown }
  | { readonly type: "result"; readonly id: number; readonly ok: false; readonly error: CrossedError }
  | { readonly type: "next"; readonly subscription: string; readonly value: unknown };

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
