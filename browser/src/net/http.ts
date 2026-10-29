/**
 * `node:http`'s `createServer`, as the core's process transport uses it (`src/private/core-transport.ts`),
 * over the page's message network (`./network.ts`): `listen(port, host)` names the address `host:port` on the page, and
 * each connection to it is handed to the server's `upgrade` listeners as a socket holding the connection's port, which
 * `./ws.ts`'s `WebSocketServer.handleUpgrade` opens. `address()` gives the address listened at, `close` stops it.
 */

import { listen, unlisten } from "./network.js";
import { Emitter } from "./socket.js";

/** The request an upgrade comes with: nothing of HTTP travels on the page's network. */
const UPGRADE_REQUEST = Object.freeze({ url: "/", headers: Object.freeze({}) });

export class Server extends Emitter {
  #address: { readonly address: string; readonly port: number; readonly family: string } | null = null;

  listen(port: number, host: string, listening?: () => void): this {
    const address = `${host}:${port}`;
    try {
      listen(address, (connection) => this.emit("upgrade", UPGRADE_REQUEST, { port: connection }, new Uint8Array(0)));
    } catch (error) {
      setTimeout(() => this.emit("error", error), 0);
      return this;
    }
    this.#address = Object.freeze({ address: host, port, family: "message-channel" });
    setTimeout(() => listening?.(), 0);
    return this;
  }

  address(): { readonly address: string; readonly port: number; readonly family: string } | null {
    return this.#address;
  }

  close(closed?: () => void): this {
    if (this.#address !== null) unlisten(`${this.#address.address}:${this.#address.port}`);
    this.#address = null;
    setTimeout(() => closed?.(), 0);
    return this;
  }

  /** Every connection is a port its socket closes: nothing more to end. */
  closeAllConnections(): void {}
}

export type IncomingMessage = typeof UPGRADE_REQUEST;

export function createServer(): Server {
  return new Server();
}
