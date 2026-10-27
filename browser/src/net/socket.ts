/**
 * A WebSocket over a `MessagePort` of the page's message network (`./network.ts`; task 16.1): the part of `ws`'s
 * `WebSocket` that `src/private/` uses, on either side of the process transport — text messages (given to listeners as
 * a `Buffer`, as `ws` gives them), pings answered by pongs, a close with its code and reason seen by both sides, and
 * `terminate`, which both sides see as 1006 (no close frame). A port's messages arrive whole and in order, so nothing
 * is ever buffered (`bufferedAmount` is 0). A worker that ends takes its ports with it silently: the transport's own
 * pings then find the peer gone, as they find a half-open WebSocket.
 */

import { Buffer } from "../shims/buffer.js";

/** What travels on a socket's port. */
type Frame =
  | { readonly f: "text"; readonly data: string }
  | { readonly f: "ping" }
  | { readonly f: "pong" }
  | { readonly f: "close"; readonly code: number; readonly reason: string };

type Listener = (...args: never[]) => void;

/** Node.js's event emitter, as far as the transport uses it. */
export class Emitter {
  readonly #listeners = new Map<string, { readonly listener: Listener; readonly once: boolean }[]>();

  on(event: string, listener: Listener): this {
    this.#listeners.set(event, [...(this.#listeners.get(event) ?? []), { listener, once: false }]);
    return this;
  }

  once(event: string, listener: Listener): this {
    this.#listeners.set(event, [...(this.#listeners.get(event) ?? []), { listener, once: true }]);
    return this;
  }

  off(event: string, listener: Listener): this {
    this.#listeners.set(event, (this.#listeners.get(event) ?? []).filter((entry) => entry.listener !== listener));
    return this;
  }

  removeListener(event: string, listener: Listener): this {
    return this.off(event, listener);
  }

  emit(event: string, ...args: unknown[]): boolean {
    const entries = this.#listeners.get(event) ?? [];
    this.#listeners.set(event, entries.filter((entry) => !entry.once));
    for (const entry of entries) (entry.listener as (...values: unknown[]) => void)(...args);
    return entries.length > 0;
  }
}

/** A WebSocket over a port (see the module comment). */
export class PortSocket extends Emitter {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  readonly bufferedAmount = 0;
  readyState = 0;
  #port: MessagePort | null = null;

  /** Opens the socket on `port`. */
  attach(port: MessagePort): void {
    this.#port = port;
    this.readyState = this.OPEN;
    port.onmessage = (event: MessageEvent<Frame>) => this.#receive(event.data);
  }

  send(text: string | Uint8Array): void {
    if (this.readyState !== this.OPEN) return;
    this.#post({ f: "text", data: typeof text === "string" ? text : Buffer.from(text).toString("utf8") });
  }

  ping(): void {
    if (this.readyState === this.OPEN) this.#post({ f: "ping" });
  }

  close(code = 1005, reason = ""): void {
    if (this.readyState === this.CLOSED) return;
    if (this.readyState === this.OPEN) this.#post({ f: "close", code, reason });
    this.ended(code, reason);
  }

  terminate(): void {
    this.close(1006, "");
  }

  /** The socket ended with `code` and `reason`: `close` follows on the next turn, once. */
  ended(code: number, reason: string): void {
    if (this.readyState === this.CLOSED) return;
    this.readyState = this.CLOSED;
    this.#port?.close();
    this.#port = null;
    setTimeout(() => this.emit("close", code, Buffer.from(reason, "utf8")), 0);
  }

  #post(frame: Frame): void {
    this.#port?.postMessage(frame);
  }

  #receive(frame: Frame): void {
    if (this.readyState !== this.OPEN) return;
    switch (frame.f) {
      case "text":
        this.emit("message", Buffer.from(frame.data, "utf8"), false);
        return;
      case "ping":
        this.#post({ f: "pong" });
        return;
      case "pong":
        this.emit("pong");
        return;
      case "close":
        this.ended(frame.code, frame.reason);
        return;
    }
  }
}
