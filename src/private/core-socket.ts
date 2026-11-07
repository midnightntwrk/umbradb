/**
 * The socket carrier of the core's side of the process transport: the link over WebSocket (`ws`) on an `http` or
 * `https` server at the address the network plan gives it, each connection one session of `./core-transport.ts`.
 * The carrier owns what only a socket has: the server and its handshake, binary frames, `ws`'s limit on a message
 * (`maxPayload`), the WebSocket pings, and the close handshake's deadline. [PP-4, PP-11; design §1, §8]
 *
 * **Mutual TLS** is opt-in, through the `core` entry's `tls`: `certificate` and `key` (the core's own) and
 * `trustedRoots` (the certificate authorities whose certificates it accepts), each PEM text. With `tls` set, the server
 * is an `https` server that requires a client certificate signed by one of `trustedRoots` (`requestCert`,
 * `rejectUnauthorized`). A private process without such a certificate is refused in the TLS handshake, before any
 * WebSocket exists (`CERTIFICATE_REQUIRED`). Without `tls`, it is a plain `http` server and the transport is
 * unauthenticated: for trusted networks, one host, or a TEE with its own channel. TEE attestation is out of scope.
 * [PP-11, Q34; design §14]
 *
 * **Pings.** Every {@link PING_INTERVAL_MS} the carrier pings each connection; one that has not answered the previous
 * ping by then is ended (`no-pong`), so a half-open connection does not hold its instance id. [PP-4]
 */

import { createServer as createHttpServer, type IncomingMessage, type Server } from "node:http";
import { createServer as createHttpsServer, type ServerOptions } from "node:https";
import type { AddressInfo } from "node:net";
import { type WebSocket, WebSocketServer } from "ws";
import {
  CLOSE_PROTOCOL,
  type CoreLink,
  type CoreSessionOptions,
  coreSessions,
  type LinkSession,
  TRANSPORT_LIMITS,
  type TransportLimits,
  type TransportTls,
} from "./core-transport.js";
import { parseMessage } from "./messages.js";
import { unrefTimer } from "./timers.js";

/** What {@link startCoreTransport} takes: the sessions' options, and where and how it listens. */
export interface CoreTransportOptions extends CoreSessionOptions {
  /** The plan's address of the link (`listen.privateLink` for the command), `host:port` (port 0 for a free one). */
  readonly address: string;
  /** The `tls` setting; plain WebSocket without it. */
  readonly tls?: TransportTls | undefined;
  /** The negative controls' `https` options from `tls`; {@link mutualTlsOptions} unless given. */
  readonly serverTls?: (tls: TransportTls) => ServerOptions;
  /**
   * Told the address once the server listens, before the line that logs it, so that its owner shows the address from
   * then on: a host reading where the link listens on that line finds it. [LM-3, LM-9, L21]
   */
  readonly listening?: (address: { readonly host: string; readonly port: number }) => void;
}

/** The core's running transport over WebSocket. */
export interface CoreTransport extends CoreLink {
  /** The address it listens on. */
  readonly host: string;
  readonly port: number;
  /** Stops listening and closes every connection (1001); resolves once the server closed. */
  close(): Promise<void>;
}

/** The `https` options of mutual TLS from `tls` (see the module comment). */
export function mutualTlsOptions(tls: TransportTls): ServerOptions {
  return {
    cert: tls.certificate,
    key: tls.key,
    ca: [...tls.trustedRoots],
    requestCert: true,
    rejectUnauthorized: true,
  };
}

/** `host:port` split; a bracketed IPv6 host without its brackets. */
export function splitAddress(address: string): { readonly host: string; readonly port: number } {
  const colon = address.lastIndexOf(":");
  const host = address.slice(0, colon);
  return { host: host.startsWith("[") ? host.slice(1, -1) : host, port: Number(address.slice(colon + 1)) };
}

/** One WebSocket and its session. */
interface Connected {
  readonly socket: WebSocket;
  readonly session: LinkSession;
  alive: boolean;
}

/** Starts the core's transport (see the module comment): resolves once it listens; rejects with `listen`'s error. */
export async function startCoreTransport(options: CoreTransportOptions): Promise<CoreTransport> {
  const { host, port } = splitAddress(options.address);
  const limits: TransportLimits = { ...TRANSPORT_LIMITS, ...options.limits };
  const server: Server =
    options.tls === undefined
      ? createHttpServer()
      : createHttpsServer((options.serverTls ?? mutualTlsOptions)(options.tls));
  const wss = new WebSocketServer({ noServer: true, maxPayload: limits.maxMessageBytes, perMessageDeflate: false });
  const sessions = coreSessions(options);
  const open = new Set<Connected>();

  wss.on("connection", (socket: WebSocket) => {
    const session = sessions.open({
      isOpen: () => socket.readyState === socket.OPEN,
      bufferedAmount: () => socket.bufferedAmount,
      send: (text) => socket.send(text),
      close: (code, reason) => {
        socket.close(code, reason);
        // A peer that never completes the close handshake is ended after it.
        unrefTimer(setTimeout(() => socket.terminate(), 5_000));
      },
      terminate: () => socket.terminate(),
    });
    const connected: Connected = { socket, session, alive: true };
    open.add(connected);
    socket.on("message", (data, binary) => {
      if (binary) {
        session.drop(CLOSE_PROTOCOL, "binary-frame");
        return;
      }
      // A text frame, whole: `ws` gives it as one Buffer (its default `binaryType`).
      session.received(parseMessage((data as Buffer).toString("utf8")));
    });
    socket.on("pong", () => {
      connected.alive = true;
    });
    socket.on("error", () => undefined);
    socket.on("close", () => {
      open.delete(connected);
      session.closed();
    });
  });
  server.on("upgrade", (request: IncomingMessage, socket, head) => {
    wss.handleUpgrade(request, socket, head, (client) => wss.emit("connection", client, request));
  });
  server.on("tlsClientError", () => undefined);

  const pings = setInterval(() => {
    for (const connected of open) {
      if (!connected.alive) {
        connected.session.terminate("no-pong");
        continue;
      }
      connected.alive = false;
      connected.socket.ping();
    }
  }, limits.pingIntervalMs);
  unrefTimer(pings);

  await new Promise<void>((resolve, reject) => {
    const failed = (error: Error): void => {
      clearInterval(pings);
      reject(error);
    };
    server.once("error", failed);
    server.listen(port, host, () => {
      server.off("error", failed);
      resolve();
    });
  });
  const bound = server.address() as AddressInfo;
  options.listening?.(Object.freeze({ host, port: bound.port }));
  options.log(`transport listening on ${host}:${bound.port}${options.tls === undefined ? "" : " (mutual TLS)"}`);

  let closing: Promise<void> | undefined;
  return Object.freeze({
    host,
    port: bound.port,
    committed: sessions.committed,
    instances: sessions.instances,
    close() {
      closing ??= (async () => {
        clearInterval(pings);
        for (const connected of open) connected.socket.close(1001, "the core is stopping");
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
          // Sockets that do not finish their close handshake.
          unrefTimer(
            setTimeout(() => {
              for (const connected of open) connected.socket.terminate();
              server.closeAllConnections();
            }, 1_000),
          );
        });
        await new Promise<void>((resolve) => wss.close(() => resolve()));
      })();
      return closing;
    },
  });
}
