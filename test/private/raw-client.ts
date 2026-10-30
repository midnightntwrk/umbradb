import type { ClientRequestArgs } from "node:http";
import { setTimeout as sleep } from "node:timers/promises";
import { type ClientOptions, WebSocket } from "ws";
import { type Message, type MessageType, messageText, parseMessage } from "../../src/private/messages.js";

/**
 * A raw client of the core's process transport for the transport tests. It sends whatever text a test gives it (a
 * message, or text that is not one) and records what the core answers and how the connection ends. Imports nothing of
 * Vitest. [PP-4, PP-11]
 */

/** How a connection ended, or why it never opened. */
export interface Ended {
  /** Whether the WebSocket opened (false: refused before it existed, e.g. in the TLS handshake). */
  readonly opened: boolean;
  readonly code: number | null;
  readonly reason: string;
  /** The socket's error code, if it had one (`ECONNRESET`, `ERR_SSL_TLSV13_ALERT_CERTIFICATE_REQUIRED`, …). */
  readonly error: string | null;
}

/** A raw client. */
export interface RawClient {
  /** The `ws` socket itself (a test reaching under it). */
  readonly raw: WebSocket;
  /** Resolves once open; rejects with how it ended if it never opened. */
  readonly opened: Promise<void>;
  readonly ended: Promise<Ended>;
  /** Every message received, parsed (a text that is none is kept as a string). */
  readonly received: (Message | string)[];
  send(message: Message | string): void;
  sendBinary(bytes: Uint8Array): void;
  /** The next received message of `type` (one received already included), within `ms`. */
  next<T extends MessageType>(type: T, ms?: number): Promise<Extract<Message, { type: T }>>;
  close(): void;
}

/** Connects to `url` (`ws://` or `wss://` with `tls`). */
export function rawClient(url: string, tls: ClientOptions & ClientRequestArgs = {}): RawClient {
  const socket = new WebSocket(url, { perMessageDeflate: false, ...tls });
  const received: (Message | string)[] = [];
  let opened = false;
  let error: string | null = null;
  const openedPromise = new Promise<void>((resolve, reject) => {
    socket.once("open", () => {
      opened = true;
      resolve();
    });
    socket.once("close", () => {
      if (!opened) reject(new Error(`the connection never opened (${error ?? "closed"})`));
    });
  });
  openedPromise.catch(() => undefined);
  socket.on("error", (failure: Error & { code?: string }) => {
    error = failure.code ?? failure.message;
  });
  socket.on("message", (data) => {
    const text = data.toString();
    const parsed = parseMessage(text);
    received.push(parsed.ok ? parsed.message : text);
  });
  const ended = new Promise<Ended>((resolve) => {
    socket.once("close", (code, reason) => resolve({ opened, code, reason: reason.toString(), error }));
  });
  return {
    raw: socket,
    opened: openedPromise,
    ended,
    received,
    send(message) {
      socket.send(typeof message === "string" ? message : messageText(message));
    },
    sendBinary(bytes) {
      socket.send(bytes, { binary: true });
    },
    async next(type, ms = 30_000) {
      const deadline = Date.now() + ms;
      for (;;) {
        const found = received.find((message) => typeof message !== "string" && message.type === type);
        if (found !== undefined) {
          received.splice(received.indexOf(found), 1);
          return found as never;
        }
        if (Date.now() > deadline) throw new Error(`no ${type} within ${ms} ms; received ${JSON.stringify(received, big)}`);
        await sleep(10);
      }
    },
    close() {
      socket.close();
    },
  };
}

/** A JSON replacer writing bigints as text. */
const big = (_key: string, value: unknown): unknown => (typeof value === "bigint" ? `${value}` : value);

/** Resolves with how `client`'s connection ended, or rejects after `ms`. */
export async function endedWithin(client: RawClient, ms = 30_000): Promise<Ended> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      client.ended,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`the connection was still open after ${ms} ms`)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** A `hello` of `instance` at `height` (no hash). */
export function hello(instance: string, height = "0"): Message {
  return { v: 1, type: "hello", instance, version: "0.9.5", height, hash: null };
}
