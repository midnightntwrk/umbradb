/**
 * The admin listener (`openspec/changes/core-arch/specs/admin-endpoints/spec.md` AE-1, AE-2; `design.md` §1; CORE-ARCH
 * §4.18): `node:http` answering the admin route table (`./routes.ts`) from the latest snapshot the runner sent and the
 * heartbeat's shared memory. It runs in a worker thread of its own (`./worker.ts`, started by `./server.ts`), so a
 * callback that blocks the main thread, or a block that holds the database, delays no answer: it reads nothing but the
 * snapshot it holds and the last tick (`../runner/heartbeat.ts`), never the database.
 *
 * **Messages** ({@link ToAdmin}, {@link FromAdmin}) over its channel — the worker's `parentPort`: `snapshot` replaces
 * the snapshot it answers from (one reference, swapped in one assignment on this thread: a request reads it once, so no
 * answer mixes two publications); `close` ends the listener and every connection, answered `closed` once. It tells
 * `listening` with the bound address (port 0 asks the system for one), or `listen-failed` with Node.js's code.
 *
 * **Answers** are JSON (`Content-Type: application/json; charset=utf-8`, `Content-Length`, `Cache-Control: no-store`);
 * the request's body is not read.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { tickAgeMs } from "../runner/heartbeat.js";
import { ADMIN_ROUTES, answerAdmin, FAILED } from "./routes.js";
import type { AdminAnswer, AdminSnapshot, AdminView } from "./types.js";

/** What the runner sends the admin listener. */
export type ToAdmin = { readonly type: "snapshot"; readonly snapshot: AdminSnapshot } | { readonly type: "close" };

/** What the admin listener tells the runner. */
export type FromAdmin =
  | { readonly type: "listening"; readonly host: string; readonly port: number }
  | { readonly type: "listen-failed"; readonly code: string; readonly message: string }
  | { readonly type: "closed" };

/** The channel to the runner: the worker's `parentPort`, or one end of a `MessageChannel`. */
export interface AdminChannel {
  on(event: "message", listener: (message: unknown) => void): unknown;
  postMessage(message: FromAdmin): void;
}

/** The content type of every answer. */
export const ADMIN_CONTENT_TYPE = "application/json; charset=utf-8";

/** What {@link serveAdmin} takes. */
export interface AdminServeOptions {
  /** Where to listen: `listen.admin` parsed (a bracketed IPv6 address unbracketed). */
  readonly host: string;
  readonly port: number;
  /** The heartbeat's shared memory. */
  readonly beat: SharedArrayBuffer;
  /** The snapshot to answer from until another comes. */
  readonly snapshot: AdminSnapshot;
  readonly channel: AdminChannel;
  /** How a request is answered; the admin route table's ({@link answerAdmin} of `ADMIN_ROUTES`) unless given. */
  readonly answer?: (method: string, url: string, view: AdminView) => AdminAnswer | Promise<AdminAnswer>;
}

/** Whether `message` is a {@link ToAdmin} of `type`. */
const isMessage = (message: unknown, type: ToAdmin["type"]): boolean =>
  typeof message === "object" && message !== null && (message as { type?: unknown }).type === type;

/** Serves the admin endpoints (see the module comment) until it is sent `close`. */
export function serveAdmin(options: AdminServeOptions): void {
  const { channel, beat } = options;
  const answer = options.answer ?? ((method: string, url: string, view: AdminView) => answerAdmin(ADMIN_ROUTES, method, url, view));
  let snapshot = options.snapshot;
  let closing = false;

  // A server's request always has its method and URL.
  const respond = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const view: AdminView = { snapshot, beatAgeMs: tickAgeMs(beat) };
    const { status, body } = await Promise.resolve()
      .then(() => answer(request.method as string, request.url as string, view))
      .catch(() => FAILED);
    const text = JSON.stringify(body);
    response.writeHead(status, {
      "Content-Type": ADMIN_CONTENT_TYPE,
      "Content-Length": Buffer.byteLength(text),
      "Cache-Control": "no-store",
    });
    // A HEAD answer gets the headers only: Node.js does not send its body.
    response.end(text);
  };

  const server = createServer((request, response) => void respond(request, response));
  server.once("error", (error: NodeJS.ErrnoException) => {
    // A listen error always has its code (`EADDRINUSE`, `EACCES`, `EADDRNOTAVAIL`).
    channel.postMessage({ type: "listen-failed", code: error.code as string, message: error.message });
  });
  server.listen(options.port, options.host, () => {
    const { address, port } = server.address() as { address: string; port: number };
    channel.postMessage({ type: "listening", host: address, port });
  });
  channel.on("message", (message) => {
    if (isMessage(message, "snapshot")) {
      snapshot = (message as Extract<ToAdmin, { type: "snapshot" }>).snapshot;
    } else if (isMessage(message, "close") && !closing) {
      closing = true;
      server.close(() => channel.postMessage({ type: "closed" }));
      server.closeAllConnections();
    }
  });
}
