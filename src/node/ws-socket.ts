/**
 * The node client's WebSocket transport in Node.js, over `ws` (8.22.0, pinned by task 0.1), and its heartbeat.
 *
 * **Failures.** A handshake the server answers with an HTTP status instead of 101 is reported with that status (`ws`'s
 * `unexpected-response`), so the client can retry 429 and 5xx and halt on the rest (IN-10); a connection that could
 * not be made is reported with the system's error code only (`ECONNREFUSED`, `ENOTFOUND`, …) — never `ws`'s message,
 * which may name the host — since the node's URL is a `secret` field (CF-4).
 *
 * **Heartbeat.** A connection the node stops answering on (a cut cable, a NAT that forgot it) can stay open for a long
 * time without an error, and a subscription on it then just goes quiet. So every `heartbeatMs` (30 s by default) the
 * transport pings; when neither the pong nor any other frame arrived since the previous ping, it ends the connection
 * (`closed` with 1006), and the client connects again. A dead connection is thus found within two heartbeats. Pings
 * are WebSocket control frames: the node, a tape node and a recording proxy answer them without any JSON-RPC call.
 */

import { WebSocket } from "ws";
import type { NodeSocket, NodeSocketEvents, NodeTimers } from "./socket.js";

/** The heartbeat's interval. */
export const DEFAULT_HEARTBEAT_MS = 30_000;

/** Opens a WebSocket to `url` with `ws`; `heartbeatMs` sets the heartbeat's interval. */
export function connectWebSocket(
  url: string,
  events: NodeSocketEvents,
  timers: NodeTimers,
  options: { readonly heartbeatMs?: number } = {},
): NodeSocket {
  const heartbeatMs = options.heartbeatMs ?? DEFAULT_HEARTBEAT_MS;
  const socket = new WebSocket(url);
  let opened = false;
  let status: number | undefined;
  let code: string | undefined;
  let heard = true;
  let beat: unknown;

  const heartbeat = (): void => {
    if (!heard) {
      socket.terminate();
      return;
    }
    heard = false;
    socket.ping();
    beat = timers.setTimeout(heartbeat, heartbeatMs);
  };

  socket.on("unexpected-response", (_request, response) => {
    status = response.statusCode;
    socket.terminate();
  });
  socket.on("open", () => {
    opened = true;
    beat = timers.setTimeout(heartbeat, heartbeatMs);
    events.open();
  });
  socket.on("message", (data) => {
    heard = true;
    events.message(String(data));
  });
  socket.on("pong", () => {
    heard = true;
  });
  socket.on("error", (error: NodeJS.ErrnoException) => {
    code ??= error.code;
  });
  socket.on("close", (closeCode) => {
    timers.clearTimeout(beat);
    if (opened) events.closed({ kind: "closed", code: closeCode });
    else if (status !== undefined) events.closed({ kind: "http-status", status });
    else events.closed(code === undefined ? { kind: "connect-failed" } : { kind: "connect-failed", code });
  });

  return {
    send: (text) => socket.send(text),
    close: () => (opened ? socket.close(1000) : socket.terminate()),
  };
}
