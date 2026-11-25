/**
 * The module API's session logic: what every carrier of the module API shares, apart from the carriers themselves.
 * It answers an HTTP request once its body is read, answers a fetch-style `Request` (the browser demo's `api.fetch`),
 * and runs the subscription protocol over any carrier of whole text messages — a WebSocket of the listener or of a
 * host's server (`./api-socket.ts`), or a host's channel (`api.connect`, {@link connectChannel}). It imports nothing
 * of Node.js at run time, so the engine, which the browser build bundles, answers through it while the browser carries
 * the socket carrier only as its build's stub.
 *
 * **HTTP.** A request's body is read up to {@link ModuleApiLimits.maxBodyBytes} (413 `request-too-large` past it) as
 * UTF-8 (400 `invalid-request` otherwise) and passed with the URL's path and query to `ModuleApi.answer`. A body read
 * before the module API got the request is refused 400 `invalid-request`.
 *
 * **Subscriptions.** Each message is a JSON text of at most {@link ModuleApiLimits.maxMessageBytes}:
 * - `{ "type": "subscribe", "topics": [...] }` adds topics (`<module-id>.<name>`), all or none, and is answered
 *   `{ "type": "subscribed", "topics": [...held], "height" }`: the next frame is for `height + 1` (`height` null before
 *   any commit), so a client reads routes up to `height` and follows the frames from there;
 * - `{ "type": "unsubscribe", "topics": [...] }` is answered `{ "type": "unsubscribed", "topics": [...held] }`;
 * - frames are the topic bus's (`./topic-bus.ts`), one per committed height from a `subscribe` (`topics: []` follows
 *   the heights alone) until an `unsubscribe` leaves no topic (`topics: []` stops a heights-only one) or it closes;
 * - what cannot be done is `{ "type": "error", "error": { "code", "message" } }` (the module API's codes).
 *
 * **Slow subscribers never hold the loop.** A subscriber whose carrier still holds more than {@link MAX_BUFFERED_BYTES}
 * unsent when a frame comes is disconnected; it catches up through routes. A carrier that does not tell what it holds
 * bounds its own queue.
 *
 * **Over a channel** (`api.connect`): the module API's own rules, not the private link's — no envelope, no ping (the
 * host owns the channel's lifetime). A message that is no text is answered as a WebSocket's binary frame is; one over
 * the message limit, and a slow subscriber, end the connection as a WebSocket's 1009 and disconnect do: the channel is
 * closed (it carries no close code). A channel whose `bufferedAmount` cannot be read (its getter or the call throws)
 * has ended too, as one whose `send` throws: it is closed, and nothing is sent on it. The module API's close closes
 * every channel it serves, at once.
 */

import { parseJsonLossless } from "../deterministic-postgresql/index.js";
import { exceedsUtf8, type PrivateLinkChannel } from "../library/channels.js";
import { type CoreHeaders, withCoreHeaders } from "./api-answers.js";
import type { RequestHeaders } from "../modules/declaration.js";
import { type ApiError, apiErrorResponse, type ApiResponse, encodeJson, type ModuleApi } from "./module-api.js";
import type { TopicBus, TopicSubscriber } from "./topic-bus.js";

/** A request body's limit, by default: 1 MiB. */
export const DEFAULT_MAX_BODY_BYTES = 1_048_576;
/** How long a closing connection waits for the client's close before it is disconnected. */
export const CLOSE_TIMEOUT_MS = 2_000;
/** A subscription message's limit, by default: 64 KiB. */
export const DEFAULT_MAX_MESSAGE_BYTES = 65_536;
/** How much a subscriber may hold unsent before it is disconnected: 1 MiB. */
export const MAX_BUFFERED_BYTES = 1_048_576;

/** The limits of the module API's handlers (see the module comment), and the negative controls' changes of them. */
export interface ModuleApiLimits {
  readonly maxBodyBytes?: number;
  readonly maxMessageBytes?: number;
  /** How much a subscriber may hold unsent: {@link MAX_BUFFERED_BYTES} unless given (a negative control's). */
  readonly maxBufferedBytes?: number;
  /**
   * Whether a subscription message the handlers cannot act on is answered with an error: always, but for a negative
   * control (`false`), whose connection answers none.
   */
  readonly answersErrors?: boolean;
}

/**
 * `host:port`, as the configuration writes addresses: a host name or IPv4 address, or a bracketed IPv6 address; the
 * port.
 */
const ADDRESS = /^(?:\[([0-9A-Fa-f:.]+)\]|([^\s:/[\]@]+)):(\d{1,5})$/;

/** `address` (`host:port`) as a host and a port; throws a `TypeError` for anything else. */
export function parseAddress(address: string): { readonly host: string; readonly port: number } {
  const match = typeof address === "string" ? ADDRESS.exec(address) : null;
  const port = Number(match?.[3]);
  if (match === null || port > 65_535) {
    throw new TypeError(`expected an address host:port, its port from 0 to 65535, not ${JSON.stringify(address)}`);
  }
  return { host: (match[1] ?? match[2]) as string, port };
}

const INVALID = "invalid-request";

/** The answer to a request whose body a host's server read before the module API got it. */
export const BODY_READ_ALREADY: ApiResponse = apiErrorResponse(INVALID, "the request body was read before the module API got the request");

/** The answer to a body over `max` bytes. */
export const bodyTooLarge = (max: number): ApiResponse => apiErrorResponse("request-too-large", `the request body is larger than ${max} bytes`);

/** The answer to a body that is no UTF-8. */
export const BODY_NOT_UTF8: ApiResponse = apiErrorResponse(INVALID, "the request body is not UTF-8");

/** The answer to a request whose body could not be read (its stream failed). */
export const BODY_UNREADABLE: ApiResponse = apiErrorResponse(INVALID, "the request could not be read");

/** `bytes` as UTF-8 text, or null when they are none. */
export function utf8Text(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** The request's `Range` and `If-Match`, `get` giving a header by its lowercase name. */
export function rangeHeaders(get: (name: string) => string | null | undefined): RequestHeaders {
  const range = get("range");
  const ifMatch = get("if-match");
  return { ...(typeof range === "string" ? { range } : {}), ...(typeof ifMatch === "string" ? { ifMatch } : {}) };
}

/**
 * The module API's answer to a request whose body was read (`text`): `url` its URL, undefined when it cannot be read.
 * The module API reads a POST's body only. Never rejects (`ModuleApi.answer` does not).
 */
export function answerRequest(
  api: ModuleApi,
  method: string,
  url: URL | undefined,
  text: string,
  headers: RequestHeaders = {},
): Promise<ApiResponse> {
  if (url === undefined) return Promise.resolve(apiErrorResponse(INVALID, "the request URL cannot be read"));
  return api.answer({ method, path: url.pathname, query: url.searchParams, body: text, headers });
}

/** The statuses whose answer has no body (a `Response` refuses one). */
const NO_BODY: ReadonlySet<number> = new Set([204, 205, 304]);

/**
 * `answer` as a fetch `Response`, with the core's headers `core` set; null leaves the headers as the answer has them (a
 * negative control's, as the Node.js handlers' `coreHeaders: "none"`).
 */
export function responseOf(answer: ApiResponse, core: CoreHeaders | null): Response {
  // An object of text values in, an object of text values out: `withCoreHeaders` keeps the form it is given.
  const headers = core === null ? answer.headers : (withCoreHeaders(answer.headers, core) as Record<string, string>);
  const body = NO_BODY.has(answer.status) ? null : answer.body;
  return new Response(body as BodyInit | null, { status: answer.status, headers });
}

/** The body of a fetch `request`: its text, or the answer refusing it (see the module comment). */
async function fetchBody(request: Request, max: number): Promise<{ readonly text: string } | { readonly refused: ApiResponse }> {
  if (request.bodyUsed) return { refused: BODY_READ_ALREADY };
  if (request.body === null) return { text: "" };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        // The rest is never read.
        reader.cancel().catch(() => undefined);
        return { refused: bodyTooLarge(max) };
      }
      chunks.push(value);
    }
  } catch {
    return { refused: BODY_UNREADABLE };
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, at);
    at += chunk.byteLength;
  }
  const text = utf8Text(bytes);
  return text === null ? { refused: BODY_NOT_UTF8 } : { text };
}

/** A fetch-style handler: a `Request` in, its `Response` out; it never rejects. */
export type FetchHandler = (request: Request) => Promise<Response>;

/**
 * The module API's fetch-style handler over `api` (see the module comment): the same rules as its Node.js handlers —
 * the body limit, the read timeout of `api`, the core's headers `core` on every answer.
 */
export function moduleApiFetch(api: ModuleApi, options: { readonly maxBodyBytes?: number; readonly core: CoreHeaders | null }): FetchHandler {
  const max = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  return async (request) => {
    const body = await fetchBody(request, max);
    const answer = "refused" in body ? body.refused : await answerRequest(api, request.method, new URL(request.url), body.text, rangeHeaders((name) => request.headers.get(name)));
    return responseOf(answer, options.core);
  };
}

/** A subscription protocol error message. */
const errorMessage = (code: ApiError["code"], message: string) => ({ type: "error", error: { code, message } });

/** A connection's rules: how much a subscriber may hold unsent, and whether it is told what cannot be done. */
export interface ConnectionRules {
  readonly maxBufferedBytes: number;
  readonly answersErrors: boolean;
}

/** The rules of `limits`, the defaults where they give none. */
export const connectionRules = (limits: ModuleApiLimits): ConnectionRules => ({
  maxBufferedBytes: limits.maxBufferedBytes ?? MAX_BUFFERED_BYTES,
  answersErrors: limits.answersErrors ?? true,
});

/** What carries one subscriber's connection: whole text messages to the client. */
export interface SubscriptionCarrier {
  /** Sends one message; dropped once the carrier ended. */
  send(text: string): void;
  /** The bytes it holds unsent, or null when it does not know them. */
  bufferedAmount(): number | null;
  /** Disconnects the subscriber at once: the carrier tells its end on a later turn, never inside the caller's turn. */
  disconnect(): void;
}

/**
 * One subscriber's connection (see the module comment): its carrier gives it each message the client sent
 * ({@link received}) and tells it when it ended ({@link ended}).
 */
export class SubscriptionConnection implements TopicSubscriber {
  readonly #carrier: SubscriptionCarrier;
  readonly #topics: TopicBus;
  readonly #rules: ConnectionRules;

  constructor(carrier: SubscriptionCarrier, api: ModuleApi, rules: ConnectionRules) {
    this.#carrier = carrier;
    this.#topics = api.topics;
    this.#rules = rules;
  }

  /** Writes `text`, unless the subscriber holds more than its limit unsent: then it is disconnected instead. */
  #write(text: string): void {
    const held = this.#carrier.bufferedAmount();
    if (held !== null && held > this.#rules.maxBufferedBytes) this.#carrier.disconnect();
    else this.#carrier.send(text);
  }

  #send(message: unknown): void {
    this.#write(encodeJson(message) as string);
  }

  /** Tells the client what cannot be done (`message`, an error message), unless a negative control's rules say not. */
  #refuse(message: ReturnType<typeof errorMessage>): void {
    if (this.#rules.answersErrors) this.#send(message);
  }

  /** A frame of the topic bus. */
  deliver(text: string): void {
    this.#write(text);
  }

  /** One message the client sent: its text, or undefined for one that is no text (a binary frame). */
  received(text: string | undefined): void {
    let message: unknown;
    try {
      if (text === undefined) throw new Error("binary");
      message = parseJsonLossless(text);
    } catch {
      message = undefined;
    }
    const { type, topics } = (message ?? {}) as Record<string, unknown>;
    if (typeof message !== "object" || message === null || Array.isArray(message) || typeof type !== "string") {
      this.#refuse(errorMessage(INVALID, "a message is a JSON object with a type"));
    } else if (type !== "subscribe" && type !== "unsubscribe") {
      this.#refuse(errorMessage(INVALID, "a message's type is subscribe or unsubscribe"));
    } else if (!Array.isArray(topics) || !topics.every((topic) => typeof topic === "string")) {
      this.#refuse(errorMessage(INVALID, `${type} takes topics, a list of strings`));
    } else if (type === "subscribe") {
      const unknown = topics.find((topic) => !this.#topics.has(topic));
      if (unknown !== undefined) {
        this.#refuse(errorMessage("not-found", `no topic is named ${String(unknown).slice(0, 200)}`));
        return;
      }
      const held = this.#topics.subscribe(this, topics);
      this.#send({ type: "subscribed", topics: held, height: this.#topics.height });
    } else {
      this.#send({ type: "unsubscribed", topics: this.#topics.unsubscribe(this, topics) });
    }
  }

  /** The carrier ended: the connection holds no topics any more. */
  ended(): void {
    this.#topics.detach(this);
  }
}

/** A connection a carrier serves, as the module API's close sees it. */
export interface ServedConnection {
  /** Closes it, going away; resolves once it ended (its end unsubscribes its subscriptions). */
  close(): Promise<void>;
}

/** What {@link connectChannel} takes besides the channel and the module API. */
export interface ChannelConnectOptions {
  readonly rules: ConnectionRules;
  /**
   * The message limit: {@link DEFAULT_MAX_MESSAGE_BYTES} unless given (a negative control's); 0 is none, as for `ws`'s
   * `maxPayload` on a WebSocket.
   */
  readonly maxMessageBytes?: number;
  /** Told once when the connection ended, whichever way. */
  readonly ended?: () => void;
}

/**
 * Serves the subscription protocol on `channel` over `api` (see **Over a channel** in the module comment). Its
 * listeners are registered now, in the caller's turn, as the host's carrier needs. Throws nothing: a channel that throws
 * while it is set up is closed, as far as UmbraDB goes; every member of the channel it reads or calls later — `send`,
 * `bufferedAmount` (a getter of it included), `close`, `terminate`, the disposers — is read inside its own guard, so
 * nothing is thrown into the carrier's message listener or out of a module's `emit`.
 */
export function connectChannel(channel: PrivateLinkChannel, api: ModuleApi, options: ChannelConnectOptions): ServedConnection {
  const max = options.maxMessageBytes ?? DEFAULT_MAX_MESSAGE_BYTES;
  /** Until it ended. */
  let open = true;
  /** Until it ended or was disconnected: nothing is sent or read after a disconnect. */
  let live = true;
  const disposers: (() => void)[] = [];
  const quietly = (run: () => void): void => {
    try {
      run();
    } catch {
      // The host's carrier failed: as far as UmbraDB goes, the channel has ended.
    }
  };
  /** Ends the connection once: its listeners disposed, its subscriptions unsubscribed. */
  const end = (): void => {
    if (!open) return;
    open = false;
    live = false;
    for (const dispose of disposers.splice(0)) quietly(dispose);
    connection.ended();
    options.ended?.();
  };
  const carrier: SubscriptionCarrier = {
    send(text) {
      if (!live) return;
      try {
        channel.send(text);
      } catch {
        // A send that throws ends the channel, after the module's emit returned.
        live = false;
        queueMicrotask(end);
      }
    },
    bufferedAmount() {
      if (!live) return null;
      let held: unknown;
      try {
        const { bufferedAmount } = channel;
        if (typeof bufferedAmount !== "function") return null;
        held = Reflect.apply(bufferedAmount, channel, []);
      } catch {
        // Reading it is the carrier's, getter and call alike: a carrier that cannot tell what it holds cannot be held
        // to the limit, so it has ended — nothing sent on it, closed, and its end after the module's emit returned, so
        // an unsubscribe never runs inside it.
        live = false;
        queueMicrotask(() => {
          if (!open) return;
          quietly(() => channel.close());
          end();
        });
        return null;
      }
      return typeof held === "number" && Number.isFinite(held) ? held : null;
    },
    disconnect() {
      if (!live) return;
      live = false;
      quietly(() => (typeof channel.terminate === "function" ? channel.terminate() : channel.close()));
      // Its end comes after the module's emit returned, so an unsubscribe never runs inside it.
      queueMicrotask(end);
    },
  };
  const connection = new SubscriptionConnection(carrier, api, options.rules);
  try {
    disposers.push(
      channel.onMessage((message: unknown) => {
        if (!live) return;
        if (typeof message === "string" && max > 0 && exceedsUtf8(message, max)) {
          quietly(() => channel.close());
          end();
          return;
        }
        connection.received(typeof message === "string" ? message : undefined);
      }),
    );
    disposers.push(channel.onClose(end));
  } catch {
    quietly(() => channel.close());
    end();
  }
  return {
    close: async () => {
      if (!open) return;
      quietly(() => channel.close());
      end();
    },
  };
}
