/**
 * The node client's transport (`./client.ts`): a WebSocket carrying JSON-RPC text frames, behind a small interface so
 * that the client does not depend on one WebSocket implementation. Node.js gets `ws` (`./ws-socket.ts`, the default),
 * the browser build its own WebSocket, and tests a socket they drive by hand. It also gives a clock that the client and
 * the transport schedule their timers on, which tests move by hand.
 */

/** How a socket ended: it never opened (a network error, or a handshake answered with an HTTP status), or it closed. */
export type SocketFailure =
  /** The connection could not be made (refused, unresolvable, reset, a TLS error); `code` is the system's error. */
  | { readonly kind: "connect-failed"; readonly code?: string }
  /** The server answered the WebSocket handshake with this HTTP status instead of 101 (a proxy's page, a 503, …). */
  | { readonly kind: "http-status"; readonly status: number }
  /** The open connection ended, with the WebSocket close code (1006 when it was cut without a close frame). */
  | { readonly kind: "closed"; readonly code: number };

/** What a socket tells the client, in order: `open` at most once, then `message`s, then `closed` exactly once. */
export interface NodeSocketEvents {
  open(): void;
  /** A frame from the node, as text. */
  message(text: string): void;
  closed(failure: SocketFailure): void;
}

/** A connection to the node. */
export interface NodeSocket {
  /** Sends a text frame; called only after `open`, and never throws. */
  send(text: string): void;
  /** Ends the connection; `closed` follows. */
  close(): void;
}

/** Opens a connection to `url`, reporting through `events`, scheduling any timer of its own on `timers`. */
export type ConnectSocket = (url: string, events: NodeSocketEvents, timers: NodeTimers) => NodeSocket;

/** Timers: Node.js's (and the browser's) by default; a clock moved by hand in tests. */
export interface NodeTimers {
  setTimeout(run: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
}

/** The global timers. */
export const SYSTEM_TIMERS: NodeTimers = Object.freeze({
  setTimeout: (run: () => void, ms: number): unknown => setTimeout(run, ms),
  clearTimeout: (handle: unknown): void => clearTimeout(handle as Parameters<typeof clearTimeout>[0]),
});
