/**
 * The private link's channels: a carrier a host program gives UmbraDB for one connection of the private link, in
 * place of a socket — a `MessagePort`, a TEE's own transport. A host hands a public process each channel a private
 * process opened (`UmbraDBHandle.privateLink.accept`); a private process asks its host for one on each connection.
 * [LM-6; design §5.4]
 *
 * **The host's obligations.** A channel delivers whole messages in order, without loss or duplication, until it ends;
 * messages sent before UmbraDB registers its listener are kept by the carrier for it (UmbraDB registers in the same
 * turn it is given the channel); a carrier without {@link PrivateLinkChannel.bufferedAmount} bounds its own queue.
 * [LM-6]
 *
 * **The envelope.** Over a channel, every message of the link (`src/private/messages.ts`) travels in an envelope, a
 * JSON object of its own, beside the envelope's control messages, so that what a WebSocket says in its frames survives
 * any carrier — a browser `MessagePort` among them, which may tell no close:
 *
 * | Envelope | Meaning |
 * |---|---|
 * | `{ "link": 1, "kind": "message", "message": { "v": 1, "type", … } }` | one message of the link |
 * | `{ "link": 1, "kind": "ping" }` | asks the peer for a `pong` |
 * | `{ "link": 1, "kind": "pong" }` | answers a `ping` |
 * | `{ "link": 1, "kind": "close", "code", "reason" }` | the channel ends: its code (an integer 1000 to 4999) and reason |
 *
 * Each is a strict object: another key, another `link`, another `kind`, a `close` without its integer code or with a
 * reason that is no text of at most {@link CLOSE_REASON_MAX} characters, is a fault (`invalid-envelope`), and text that
 * is no JSON is `not-json`; a message that fails its own schema is the message's fault, as on a socket. The close codes
 * are the WebSocket ones the link uses: 1008 for a fault of the protocol (`report-hash-mismatch`, which halts a lockstep
 * instance, `too-slow`, `hello-first`, …), 1009 `too-large`, 1011 `report-unchecked` (connect again), 1013 `try-again`,
 * 1001 at a stop. [LM-6, PP-4, PP-6]
 *
 * **An endpoint** ({@link ChannelEndpoint}) is UmbraDB's end of one channel, on either side of the link:
 * - it registers its listeners when it is made, and disposes of them when the channel ends;
 * - it checks every incoming message: text (else `not-text`) of at most its limit in UTF-8 bytes, beside the envelope's
 *   own {@link ENVELOPE_BYTES} (else 1009 `too-large`), before reading it;
 * - it pings its peer one interval after it is made ({@link PING_INTERVAL_MS}), then every interval, answers its peer's
 *   pings, and gives up on a peer whose ping is still unanswered at the next interval (`no-pong`): a dead peer is found
 *   within two intervals;
 * - it tells the bytes the channel has not delivered yet, when the channel knows them;
 * - its own close or terminate sends the peer a `close` envelope and ends the channel at once — its listeners disposed,
 *   its owner told —, whatever the carrier's own close does. [LM-6, L42]
 */

import { MAX_MESSAGE_BYTES, PING_INTERVAL_MS, type Received } from "../private/core-transport.js";
import { messageOfValue } from "../private/messages.js";
import { parseJsonLossless } from "../deterministic-postgresql/index.js";
import { unrefTimer } from "../private/timers.js";

/** One channel of the private link (see the module comment). [LM-6] */
export interface PrivateLinkChannel {
  /** Sends one message, in order, with no loss and no duplication until the channel ends. */
  send(message: string): void;
  /** Registers a listener for each message the peer sends; returns its disposer. */
  onMessage(listener: (message: string) => void): () => void;
  /** Registers a listener for the carrier's end; returns its disposer. */
  onClose(listener: () => void): () => void;
  /** Ends the channel gracefully. */
  close(): void;
  /** Ends the channel at once; `close()` when the carrier has no forced end. */
  terminate?(): void;
  /** The bytes queued and not yet delivered, when the carrier knows them. */
  bufferedAmount?(): number;
}

/**
 * A `MessagePort` as {@link messagePortChannel} uses it: a browser's, or a Node.js `worker_threads` one. [LM-6]
 */
export interface MessagePortLike {
  postMessage(message: string): void;
  addEventListener(type: "message", listener: (event: { readonly data: unknown }) => void): void;
  addEventListener(type: "close", listener: () => void): void;
  removeEventListener(type: "message", listener: (event: { readonly data: unknown }) => void): void;
  removeEventListener(type: "close", listener: () => void): void;
  /** Starts the delivery of its messages (a browser port's listeners need it; a Node.js port starts by itself). */
  start?(): void;
  close(): void;
}

/**
 * A channel over `port` (see the module comment): `send` posts the text, `onMessage` hears each message's data, and
 * `onClose` its `close` event, which a Node.js port fires on both ends and a browser's may never. The port's queue
 * keeps what arrives before the listener: the port starts once a message listener is registered. It has no
 * `bufferedAmount`: a port tells none. [LM-6]
 */
export function messagePortChannel(port: MessagePortLike): PrivateLinkChannel {
  return Object.freeze({
    send(message: string) {
      port.postMessage(message);
    },
    onMessage(listener: (message: string) => void) {
      const heard = (event: { readonly data: unknown }): void => listener(event.data as string);
      port.addEventListener("message", heard);
      port.start?.();
      return () => port.removeEventListener("message", heard);
    },
    onClose(listener: () => void) {
      const heard = (): void => listener();
      port.addEventListener("close", heard);
      return () => port.removeEventListener("close", heard);
    },
    close() {
      port.close();
    },
  });
}

/** The longest close reason an envelope carries, in characters. */
export const CLOSE_REASON_MAX = 256;

/** The protocol version of the envelope, its `link` field. */
export const ENVELOPE_VERSION = 1;

/** The text before a message's own text in its envelope (see the module comment). */
const MESSAGE_PREFIX = `{"link":${ENVELOPE_VERSION},"kind":"message","message":`;

/** The bytes a message's envelope adds to its text: a limit on a message is checked with them added. */
export const ENVELOPE_BYTES = MESSAGE_PREFIX.length + 1;

/** The WebSocket close code of a message too large for its limit. [LM-6] */
export const CLOSE_TOO_LARGE = 1009;

/** The envelope of a message of the link, whose text is `text` (`messageText`). */
export const messageEnvelope = (text: string): string => `${MESSAGE_PREFIX}${text}}`;

/** The envelope of a control message. */
export function controlEnvelope(control: { readonly kind: "ping" | "pong" } | { readonly kind: "close"; readonly code: number; readonly reason: string }): string {
  return JSON.stringify({ link: ENVELOPE_VERSION, ...control });
}

/** What {@link readEnvelope} found in an envelope's text. */
export type Envelope =
  | { readonly kind: "message"; readonly message: Received }
  | { readonly kind: "ping" | "pong" }
  | { readonly kind: "close"; readonly code: number; readonly reason: string }
  | { readonly kind: "fault"; readonly fault: "not-json" | "invalid-envelope" };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Whether `value` has exactly the keys `keys`. */
const hasKeys = (value: Record<string, unknown>, keys: readonly string[]): boolean => {
  const own = Object.keys(value);
  return own.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
};

/**
 * Reads an envelope's text (see the module comment); `message` reads the value of a `message` envelope (the link's
 * schemas, `messageOfValue`, unless given: a negative control's).
 */
export function readEnvelope(text: string, message: (value: unknown) => Received = messageOfValue): Envelope {
  let value: unknown;
  try {
    value = parseJsonLossless(text);
  } catch {
    return { kind: "fault", fault: "not-json" };
  }
  if (!isObject(value) || value.link !== ENVELOPE_VERSION) return { kind: "fault", fault: "invalid-envelope" };
  switch (value.kind) {
    case "message":
      return hasKeys(value, ["link", "kind", "message"])
        ? { kind: "message", message: message(value.message) }
        : { kind: "fault", fault: "invalid-envelope" };
    case "ping":
    case "pong":
      return hasKeys(value, ["link", "kind"]) ? { kind: value.kind } : { kind: "fault", fault: "invalid-envelope" };
    case "close": {
      const { code, reason } = value;
      const valid =
        hasKeys(value, ["link", "kind", "code", "reason"]) &&
        typeof code === "number" &&
        Number.isInteger(code) &&
        code >= 1000 &&
        code <= 4999 &&
        typeof reason === "string" &&
        reason.length <= CLOSE_REASON_MAX;
      return valid ? { kind: "close", code: code as number, reason: reason as string } : { kind: "fault", fault: "invalid-envelope" };
    }
    default:
      return { kind: "fault", fault: "invalid-envelope" };
  }
}

/**
 * Whether `text` is more than `limit` bytes in UTF-8, counted without encoding it: a UTF-16 code unit is 1 to 3 bytes,
 * a surrogate pair 4, a lone surrogate 3 (its replacement character). [LM-6]
 */
export function exceedsUtf8(text: string, limit: number): boolean {
  if (text.length > limit) return true;
  if (text.length * 3 <= limit) return false;
  let bytes = 0;
  for (let index = 0; index < text.length; index++) {
    const unit = text.charCodeAt(index);
    if (unit < 0x80) bytes += 1;
    else if (unit < 0x800) bytes += 2;
    else if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = text.charCodeAt(index + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        bytes += 4;
        index += 1;
      } else bytes += 3;
    } else bytes += 3;
    if (bytes > limit) return true;
  }
  return false;
}

/** How an endpoint keeps its interval: every `ms`, `tick`, until the returned function is called. [LM-6] */
export interface LinkTimers {
  every(ms: number, tick: () => void): () => void;
}

/** The timers a process runs with: an `unref`'d interval, which keeps nothing alive on its own. */
export const REAL_TIMERS: LinkTimers = Object.freeze({
  every(ms: number, tick: () => void) {
    const timer = setInterval(tick, ms);
    unrefTimer(timer);
    return () => clearInterval(timer);
  },
});

/** What an endpoint tells its owner: the core's session, the core's queue of channels, a private transport. */
export interface EndpointEvents {
  /** A message of the link, or why what the peer sent is none (`not-text`, `not-json`, `invalid-envelope`, …). */
  received(received: Received): void;
  /** A message over the limit: the owner closes the channel with `code` (1009) and `reason` (`too-large`). */
  oversized(code: number, reason: string): void;
  /** The peer did not answer the last ping by the next interval: the owner ends the channel (`no-pong`). */
  unanswered(): void;
  /** The channel ended — by the peer's `close`, the carrier's end (1006, no reason), or the endpoint's own close. */
  ended(code: number, reason: string): void;
}

/** What makes an endpoint. */
export interface EndpointOptions {
  /** The largest incoming message, in UTF-8 bytes, beside the envelope's own; {@link MAX_MESSAGE_BYTES} unless given. */
  readonly maxMessageBytes?: number;
  /** The interval of its pings; {@link PING_INTERVAL_MS} unless given. */
  readonly pingIntervalMs?: number;
  /** Its interval's clock; {@link REAL_TIMERS} unless given (the tests' controlled clock). */
  readonly timers?: LinkTimers;
  /** How a `message` envelope's value is read: the link's schemas unless given (a negative control's). */
  readonly message?: (value: unknown) => Received;
}

/** The close code of a carrier that ended without UmbraDB's or its peer's `close` (a WebSocket's abnormal closure). */
export const CLOSE_ABNORMAL = 1006;

/** UmbraDB's end of one channel (see the module comment). [LM-6] */
export class ChannelEndpoint {
  readonly #channel: PrivateLinkChannel;
  #events: EndpointEvents;
  #maxMessageBytes: number;
  readonly #message: (value: unknown) => Received;
  #ended = false;
  /** Whether a ping is sent and not answered yet. */
  #awaiting = false;
  readonly #dispose: (() => void)[] = [];
  /**
   * What arrived before the endpoint was made and its owner could attach (a carrier may hand a kept message to the
   * listener as it registers): read in order once the constructor has returned, null from then on.
   */
  #held: unknown[] | null = [];

  constructor(channel: PrivateLinkChannel, events: EndpointEvents, options: EndpointOptions = {}) {
    this.#channel = channel;
    this.#events = events;
    this.#maxMessageBytes = options.maxMessageBytes ?? MAX_MESSAGE_BYTES;
    this.#message = options.message ?? messageOfValue;
    // Registered at once: the carrier keeps what arrived before for this listener. A carrier whose registration
    // throws has ended; its owner is told once it holds the endpoint. [LM-6]
    try {
      this.#dispose.push(channel.onMessage((message) => this.#incoming(message)));
      this.#dispose.push(channel.onClose(() => this.#end(CLOSE_ABNORMAL, "")));
    } catch {
      this.#ended = true;
      for (const dispose of this.#dispose.splice(0)) this.#guard(dispose);
      queueMicrotask(() => this.#events.ended(CLOSE_ABNORMAL, ""));
      return;
    }
    this.#dispose.push((options.timers ?? REAL_TIMERS).every(options.pingIntervalMs ?? PING_INTERVAL_MS, () => this.#tick()));
    queueMicrotask(() => {
      const held = this.#held ?? [];
      this.#held = null;
      for (const message of held) this.#incoming(message);
    });
  }

  /** Whether the channel still carries messages. */
  get open(): boolean {
    return !this.#ended;
  }

  /** Who is told of the channel from now on (the core's queue hands a channel to its session). */
  attach(events: EndpointEvents): void {
    this.#events = events;
  }

  /** The largest incoming message from now on (the core's queue holds a `hello` to a smaller one). */
  limit(maxMessageBytes: number): void {
    this.#maxMessageBytes = maxMessageBytes;
  }

  /** Sends a message of the link, whose text is `text`, in its envelope; nothing once the channel ended. */
  send(text: string): void {
    this.#post(messageEnvelope(text));
  }

  /** The bytes the channel has not delivered, when it tells them; null otherwise. */
  bufferedAmount(): number | null {
    const { bufferedAmount } = this.#channel;
    if (bufferedAmount === undefined) return null;
    try {
      const found = bufferedAmount.call(this.#channel);
      return typeof found === "number" && Number.isFinite(found) ? found : null;
    } catch {
      return null;
    }
  }

  /** Ends the channel with `code` and `reason`: the peer is told, then the carrier closed. [LM-6, L42] */
  close(code: number, reason: string): void {
    if (this.#ended) return;
    this.#post(controlEnvelope({ kind: "close", code, reason }));
    this.#end(code, reason, () => this.#channel.close());
  }

  /** Ends the channel at once with `code` and `reason`: the peer is told, then the carrier ended. [LM-6, L42] */
  terminate(code: number, reason: string): void {
    if (this.#ended) return;
    this.#post(controlEnvelope({ kind: "close", code, reason }));
    this.#end(code, reason, () => (this.#channel.terminate === undefined ? this.#channel.close() : this.#channel.terminate()));
  }

  #tick(): void {
    if (this.#ended) return;
    if (this.#awaiting) {
      this.#events.unanswered();
      return;
    }
    this.#awaiting = true;
    this.#post(controlEnvelope({ kind: "ping" }));
  }

  #incoming(message: unknown): void {
    if (this.#ended) return;
    if (this.#held !== null) {
      this.#held.push(message);
      return;
    }
    if (typeof message !== "string") {
      this.#events.received({ ok: false, fault: "not-text" });
      return;
    }
    if (exceedsUtf8(message, this.#maxMessageBytes + ENVELOPE_BYTES)) {
      this.#events.oversized(CLOSE_TOO_LARGE, "too-large");
      return;
    }
    const envelope = readEnvelope(message, this.#message);
    switch (envelope.kind) {
      case "message":
        this.#events.received(envelope.message);
        return;
      case "ping":
        this.#post(controlEnvelope({ kind: "pong" }));
        return;
      case "pong":
        this.#awaiting = false;
        return;
      case "close":
        this.#end(envelope.code, envelope.reason, () => this.#channel.close());
        return;
      default:
        this.#events.received({ ok: false, fault: envelope.fault });
    }
  }

  /** Posts `text` on the channel; a carrier whose `send` throws has ended. */
  #post(text: string): void {
    if (this.#ended) return;
    try {
      this.#channel.send(text);
    } catch {
      this.#end(CLOSE_ABNORMAL, "", () => this.#channel.close());
    }
  }

  /** Ends the channel once: its listeners and its interval disposed, `end` run, the owner told. [LM-6, L42] */
  #end(code: number, reason: string, end?: () => void): void {
    if (this.#ended) return;
    this.#ended = true;
    for (const dispose of this.#dispose.splice(0)) this.#guard(dispose);
    if (end !== undefined) this.#guard(end);
    this.#events.ended(code, reason);
  }

  /** Runs one of the carrier's methods; one that throws ends the channel as far as UmbraDB goes. */
  #guard(work: () => unknown): void {
    try {
      work();
    } catch {
      if (!this.#ended) this.#end(CLOSE_ABNORMAL, "");
    }
  }
}
