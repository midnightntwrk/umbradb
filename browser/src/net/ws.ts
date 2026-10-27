/**
 * `ws` for the process transport in the browser build (`src/private/core-transport.ts`, `src/private/
 * private-transport.ts`; `openspec/changes/core-arch/design.md` §8, §9.2; task 16.1): its `WebSocket` client and its
 * `WebSocketServer` (`noServer`, connections handed over by `./http.ts`'s upgrade), over the page's message network
 * (`./network.ts`, `./socket.ts`). A client's URL is `ws://<address>/`, the core's `listen.transport` address as the
 * private process's `coreTransport` names it; nothing listening there is a refused connection (`error` with
 * `ECONNREFUSED`, then `close` 1006), which the transport retries. `wss://` (mutual TLS, PP-11) is refused the same
 * way: the page's message channels never leave the page, and a browser cannot present a client certificate here.
 */

import { Buffer } from "../shims/buffer.js";
import { connect } from "./network.js";
import { Emitter, PortSocket } from "./socket.js";

/** `ws`'s type of a received message, for the same types. */
export type RawData = Buffer;

/** A client socket to `ws://<address>/` (see the module comment). */
export class WebSocket extends PortSocket {
  constructor(url: string, _options: unknown = {}) {
    super();
    const plain = /^ws:\/\/([^/]+)\/?$/.exec(url);
    const refuse = (error: Error): void => {
      this.readyState = this.CLOSED;
      this.emit("error", error);
      this.emit("close", 1006, Buffer.alloc(0));
    };
    if (plain === null) {
      setTimeout(() => refuse(Object.assign(new Error("the page's message network carries ws:// only (no TLS)"), { code: "ERR_TLS_UNAVAILABLE" })), 0);
      return;
    }
    connect(plain[1] as string).then(
      (port) => {
        if (this.readyState !== this.CONNECTING) {
          port.close();
          return;
        }
        this.attach(port);
        this.emit("open");
      },
      (error: Error) => refuse(error),
    );
  }

  override close(code = 1005, reason = ""): void {
    if (this.readyState === this.CONNECTING) {
      // Not open yet: ended at once, as `ws` ends a socket closed while it connects.
      this.ended(1006, "");
      return;
    }
    super.close(code, reason);
  }
}

/** The upgrade's socket as `./http.ts` hands it over: the port of the new connection. */
export interface PortUpgrade {
  readonly port: MessagePort;
}

/** `ws`'s server in `noServer` mode (see the module comment). */
export class WebSocketServer extends Emitter {
  constructor(_options: unknown = {}) {
    super();
  }

  handleUpgrade(_request: unknown, socket: PortUpgrade, _head: unknown, done: (client: PortSocket) => void): void {
    const client = new PortSocket();
    client.attach(socket.port);
    done(client);
  }

  close(done?: () => void): void {
    setTimeout(() => done?.(), 0);
  }
}
