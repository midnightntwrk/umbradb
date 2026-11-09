/**
 * The socket carrier of a private process's side of the process transport: each connection a WebSocket (`ws`) to the
 * link's address, `ws or wss://<address>/`, the latter with the `core` entry's `tls` — its certificate and key
 * presented to the core, the core's certificate checked against `trustedRoots`. The carrier owns what only a socket has: `ws`'s limit
 * on a message (`maxPayload`), binary frames, the WebSocket pings, and the close handshake's deadline at the stop.
 * The session logic is `./private-transport.ts`'s.
 *
 * **Pings.** Once open, the carrier pings the core every `PING_INTERVAL_MS`; a core that has not answered the previous
 * ping by then is left (the connection ended), and the transport connects again.
 */

import { WebSocket } from "ws";
import { TRANSPORT_LIMITS, type TransportLimits, type TransportTls } from "./core-transport.js";
import { parseMessage } from "./messages.js";
import { type CarrierConnection, type CarrierEvents, type PrivateCarrier, PrivateTransport, type PrivateTransportOptions } from "./private-transport.js";
import { unrefTimer } from "./timers.js";

/** The limits of the socket carrier: the largest message and the ping's interval (the tests give smaller ones). */
export type SocketLimits = Partial<Pick<TransportLimits, "maxMessageBytes" | "pingIntervalMs">>;

/** What a binary frame from the core is to the session logic: a fault that closes the connection. */
const BINARY_FRAME = Object.freeze({ ok: false as const, fault: "binary-frame" });

/** The socket carrier to `address` (`host:port`), over mutual TLS with `tls` (see the module comment). */
export function socketCarrier(address: string, tls: TransportTls | undefined, limits: SocketLimits = {}): PrivateCarrier {
  const { maxMessageBytes, pingIntervalMs } = { ...TRANSPORT_LIMITS, ...limits };
  return Object.freeze({
    where: `at ${address}`,
    dial(events: CarrierEvents): CarrierConnection {
      const url = `${tls === undefined ? "ws" : "wss"}://${address}/`;
      const socket = new WebSocket(url, {
        maxPayload: maxMessageBytes,
        perMessageDeflate: false,
        ...(tls === undefined ? {} : { cert: tls.certificate, key: tls.key, ca: [...tls.trustedRoots] }),
      });
      let pinger: NodeJS.Timeout | undefined;
      let alive = true;
      socket.on("open", () => {
        alive = true;
        events.opened();
        pinger = setInterval(() => {
          if (!alive) {
            events.failed("the core did not answer a ping");
            socket.terminate();
            return;
          }
          alive = false;
          socket.ping();
        }, pingIntervalMs);
        unrefTimer(pinger);
      });
      socket.on("pong", () => {
        alive = true;
      });
      socket.on("message", (data, binary) => {
        events.received(binary ? BINARY_FRAME : parseMessage(data.toString()));
      });
      socket.on("error", (error: Error & { code?: string }) => {
        events.failed(error.code ?? error.message);
      });
      socket.on("close", (code, why) => {
        clearInterval(pinger);
        events.ended(code, why.toString());
      });
      return Object.freeze({
        send: (text: string) => socket.send(text),
        close: (code: number, reason: string) => {
          clearInterval(pinger);
          socket.close(code, reason);
        },
        shutdown: async () => {
          clearInterval(pinger);
          if (socket.readyState === socket.CLOSED) return;
          await new Promise<void>((resolve) => {
            socket.once("close", () => resolve());
            socket.close(1001, "the private process is stopping");
            unrefTimer(
              setTimeout(() => {
                socket.terminate();
                resolve();
              }, 1_000),
            );
          });
        },
      });
    },
  });
}

/** What {@link privateSocketTransport} takes: the transport's options, with the link's address and `tls`. */
export interface PrivateSocketTransportOptions extends Omit<PrivateTransportOptions, "carrier"> {
  /** The link's address (`privateLink` for the command), `host:port`. */
  readonly address: string;
  /** The `tls` setting; plain WebSocket without it. */
  readonly tls?: TransportTls | undefined;
  /** The tests' limits (the largest message, the ping's interval); `TRANSPORT_LIMITS` unless given. */
  readonly limits?: SocketLimits;
}

/** A private process's transport over WebSocket to `options.address` (see the module comment). */
export function privateSocketTransport(options: PrivateSocketTransportOptions): PrivateTransport {
  const { address, tls, limits, ...rest } = options;
  return new PrivateTransport({ ...rest, carrier: socketCarrier(address, tls, limits) });
}
