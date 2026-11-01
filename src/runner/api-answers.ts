/**
 * What the module API's handlers write besides a module's own answer: the core's headers, and the lifecycle's answer
 * while the module API does not serve. Both the module API listener (`./api-server.ts`) and the handlers a library
 * host mounts in its own server write them. The module imports nothing of Node.js at run time, so the engine — which
 * the browser build bundles — can answer through it. [RN-16, LM-4, LM-5; design §5.2 N8, §5.3]
 *
 * **The core's headers.** Every HTTP answer the module API writes carries {@link VERSION_HEADER}, the build's version,
 * and, once the process's configuration hash exists (it is read after `on-start-db`), {@link CONFIG_HASH_HEADER}; before
 * that the hash header is absent, which a client comparing hashes takes as a wildcard. Each is set once, replacing a
 * header of its name in any letter case ({@link withCoreHeaders}). [RN-16, Q131, Q147, D-17]
 *
 * **The lifecycle's answer.** While the module API does not serve — the process `starting`, `refused`, or `stopping`
 * once its drain ended (or stopped before the module API ever opened) — a request gets 503 with the module API's error
 * envelope, the state and the reason: `{ "error": { "code": "not-serving", "message" }, "state", "reason" }`, the
 * message made of the state's name only and the reason of its code, height, module and point, never a failure's text.
 * An upgrade gets the same answer on its socket, which then ends; a fetch-style request gets it as a `Response`; a
 * channel offered for subscriptions gets the body as its one message, then is closed. Nothing else writes this body:
 * never in place of a module's own answer, nor of the module API's own `503 no-committed-height`.
 * [LM-5, LM-11, AE-6, RN-16]
 */

import type { IncomingMessage, OutgoingHttpHeader, OutgoingHttpHeaders, ServerResponse } from "node:http";
import type { Duplex } from "node:stream";
import { UMBRADB_VERSION } from "../config/build.js";
import type { PrivateLinkChannel } from "../library/channels.js";
import type { ProcessReason } from "./failures.js";
import type { ProcessState } from "./process.js";

/**
 * The header the core sets on every HTTP answer of the module API (see the module comment): the build's version. The
 * `X-Umbra-` prefix holds the headers every module shares. This one is the core's; the envelope's helpers write
 * `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash` (`./envelope.ts`) for a module that calls them. [RN-16]
 */
export const VERSION_HEADER = "X-Umbra-Version";

/**
 * The header the core sets beside {@link VERSION_HEADER} once the process's configuration hash exists: the hash,
 * computed once at startup. [RN-16, PP-14, Q147]
 */
export const CONFIG_HASH_HEADER = "X-Umbra-Config-Hash";

/** A handler of Node.js's HTTP server `request` event, which a host calls from its own server. [LM-4] */
export type NodeHttpHandler = (request: IncomingMessage, response: ServerResponse) => void;

/** A handler of Node.js's HTTP server `upgrade` event (the module API's WebSocket subscriptions). [LM-4] */
export type NodeUpgradeHandler = (request: IncomingMessage, socket: Duplex, head: Buffer) => void;

/** The core's headers, by their names in lower case (HTTP's header names are case-insensitive). */
const CORE_HEADER_NAMES: ReadonlySet<string> = new Set(["x-umbra-version", "x-umbra-config-hash"]);

/** Whether `name` is one of the core's headers, in any letter case. */
const isCoreHeader = (name: unknown): boolean => typeof name === "string" && CORE_HEADER_NAMES.has(name.toLowerCase());

/** The core's headers as name and value: the build's version, and the configuration hash when there is one. */
export type CoreHeaders = readonly (readonly [string, string])[];

/** The core's headers (see the module comment): the build's version, and `configHash` when it exists. [RN-16] */
export const coreHeaders = (configHash: string | undefined): CoreHeaders => [
  [VERSION_HEADER, UMBRADB_VERSION],
  ...(configHash === undefined ? [] : [[CONFIG_HASH_HEADER, configHash] as const]),
];

/** Headers as `writeHead` takes them: an object, or a flat list of names and values. */
export type HeadersArgument = OutgoingHttpHeaders | OutgoingHttpHeader[];

/**
 * `headers` with the core's headers `core` set: a header of one of their names in any letter case left out, the
 * others kept as they are and in their order. [RN-16]
 */
export function withCoreHeaders(headers: HeadersArgument | undefined, core: CoreHeaders): HeadersArgument {
  if (Array.isArray(headers)) {
    const kept: OutgoingHttpHeader[] = [];
    for (let index = 0; index < headers.length; index += 2) {
      if (!isCoreHeader(headers[index])) kept.push(...headers.slice(index, index + 2));
    }
    return [...kept, ...core.flat()];
  }
  const kept = Object.entries(headers ?? {}).filter(([name]) => !isCoreHeader(name));
  return { ...Object.fromEntries(kept), ...Object.fromEntries(core) };
}

/** What the lifecycle's answer names: the process's state and its reason. */
export interface LifecycleStatus {
  readonly state: ProcessState;
  readonly reason: ProcessReason | null;
}

/** The content type of the lifecycle's answer. */
const JSON_TYPE = "application/json; charset=utf-8";

/** The lifecycle's body for `status` (see the module comment). [LM-5, AE-6] */
export function lifecycleBody(status: LifecycleStatus): string {
  const { reason } = status;
  return JSON.stringify({
    error: { code: "not-serving", message: `the module API does not serve while the process is ${status.state}` },
    state: status.state,
    reason:
      reason === null
        ? null
        : { code: reason.code, height: reason.height === null ? null : String(reason.height), module: reason.module, point: reason.point },
  });
}

/** The bytes of `text` in UTF-8. */
const byteLength = (text: string): number => new TextEncoder().encode(text).byteLength;

/** The lifecycle's answer's headers for `body`, with the core's headers of `configHash`. */
function lifecycleHeaders(body: string, configHash: string | undefined): Record<string, string> {
  return {
    "Content-Type": JSON_TYPE,
    "Content-Length": String(byteLength(body)),
    "Cache-Control": "no-store",
    ...Object.fromEntries(coreHeaders(configHash)),
  };
}

/**
 * Writes the lifecycle's 503 for `status` to `response`, with the core's headers (`configHash` once it exists); nothing
 * when the host's response was answered already or can no longer be written. [LM-5, RN-16]
 */
export function answerNotServing(response: ServerResponse, status: LifecycleStatus, configHash: string | undefined): void {
  try {
    if (response.headersSent) return;
    const body = lifecycleBody(status);
    response.writeHead(503, lifecycleHeaders(body, configHash));
    response.end(body);
  } catch {
    // The host's response could not be written (its connection ended): there is nothing to answer.
  }
}

/**
 * Writes the lifecycle's 503 for `status` on an upgrade's `socket`, with the core's headers (`configHash` once it
 * exists), then ends the socket; a socket that cannot be written is destroyed. [LM-5, RN-16]
 */
export function refuseNotServing(socket: Duplex, status: LifecycleStatus, configHash: string | undefined): void {
  try {
    const body = lifecycleBody(status);
    const headers = { ...lifecycleHeaders(body, configHash), Connection: "close" };
    const head = Object.entries(headers).map(([name, value]) => `${name}: ${value}\r\n`).join("");
    socket.once("finish", () => socket.destroy());
    socket.end(`HTTP/1.1 503 Service Unavailable\r\n${head}\r\n${body}`);
  } catch {
    socket.destroy();
  }
}

/** The lifecycle's 503 for `status` as a fetch `Response`, with the core's headers (`configHash` once it exists). [LM-5, LM-11] */
export function notServingResponse(status: LifecycleStatus, configHash: string | undefined): Response {
  const body = lifecycleBody(status);
  return new Response(body, { status: 503, headers: lifecycleHeaders(body, configHash) });
}

/**
 * Sends a channel offered for the module API's subscriptions the lifecycle's body for `status` as its one message, then
 * closes it; a channel that throws is left, as far as UmbraDB goes, ended. [LM-5, LM-11]
 */
export function refuseChannelNotServing(channel: PrivateLinkChannel, status: LifecycleStatus): void {
  try {
    channel.send(lifecycleBody(status));
  } catch {
    // The host's carrier failed: there is nothing to tell it.
  }
  try {
    channel.close();
  } catch {
    // Closed as far as UmbraDB goes.
  }
}
