/**
 * The node client's transport in the browser build, in place of `src/node/ws-socket.ts`: the browser's own
 * `WebSocket`, behind the same `connect` interface (`src/node/socket.ts`), so the node client (`src/node/client.ts`)
 * runs unchanged. [design §9.2]
 *
 * What the browser does not give:
 * - a handshake's HTTP status: a refused handshake and a connection that could not be made both end with `error`, then
 *   `close` 1006, before `open`. So every failed handshake reads as `connect-failed` and is retried [IN-10];
 * - the system's error code;
 * - WebSocket pings, which only the browser itself sends. So the transport has no heartbeat of its own: a connection
 *   that goes quiet is found by the client's own call timeouts.
 *
 * The node must allow the page's origin (a Substrate node's `--rpc-cors`). [BR-3]
 */

import type { NodeSocket, NodeSocketEvents, NodeTimers } from "../../../src/node/socket.js";

/** Kept for the same exports as `src/node/ws-socket.ts`; the browser's transport has no heartbeat (see above). */
export const DEFAULT_HEARTBEAT_MS = 30_000;

/** Opens a WebSocket to `url` with the browser's `WebSocket`. */
export function connectWebSocket(
  url: string,
  events: NodeSocketEvents,
  _timers: NodeTimers,
  _options: { readonly heartbeatMs?: number } = {},
): NodeSocket {
  let opened = false;
  let socket: WebSocket;
  try {
    socket = new WebSocket(url);
  } catch {
    // An URL the browser refuses (a scheme or port it blocks): reported as the connection failing, asynchronously.
    queueMicrotask(() => events.closed({ kind: "connect-failed" }));
    return { send: () => undefined, close: () => undefined };
  }
  socket.addEventListener("open", () => {
    opened = true;
    events.open();
  });
  socket.addEventListener("message", (event: MessageEvent) => {
    if (typeof event.data === "string") events.message(event.data);
  });
  socket.addEventListener("close", (event: CloseEvent) => {
    events.closed(opened ? { kind: "closed", code: event.code } : { kind: "connect-failed" });
  });
  return {
    send: (text) => {
      if (socket.readyState === WebSocket.OPEN) socket.send(text);
    },
    close: () => socket.close(opened ? 1000 : undefined),
  };
}
