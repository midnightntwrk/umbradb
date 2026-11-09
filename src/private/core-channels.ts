/**
 * The channel carrier of the core's side of the process transport: the link over the channels a library host hands
 * the public process (`UmbraDBHandle.privateLink.accept`), each one a session of `./core-transport.ts` once the link
 * has started, over UmbraDB's end of the channel (`ChannelEndpoint`, `src/library/channels.ts`: the envelope, the
 * pings, the size of a message).
 *
 * **Before the link starts** (it starts after the migrations and the read of the configuration hash, as a socket link
 * does), each channel accepted waits in a queue of at most {@link CHANNEL_QUEUE_MAX}; one beyond is closed 1013
 * `try-again`. A queued channel is pinged and answers pings as an open one does, so a healthy peer stays queued through
 * any number of intervals and a dead one is ended `no-pong` within two, its place freed. Its messages are read as they
 * arrive, as on a socket, each at most {@link MAX_HELLO_BYTES} (else 1009 `too-large`): a first message that is not a
 * `hello` closes it 1008 `hello-first`, an invalid `hello` closes it as on a socket (its fault: the instance id rule, a
 * message's schema, its `v` and `type`), and a second message closes it 1008 `hello-pending`; the valid `hello` is held.
 * When the link starts, each queued channel, in the order it was accepted, becomes a session, its held `hello` its
 * first message.
 *
 * **Once the link has started**, a channel accepted is a session at once, with the link's {@link MAX_MESSAGE_BYTES}.
 *
 * **Not accepting.** Once the link stops accepting — at a refusal of startup, at `stop()`, and once it closed — every
 * queued channel is closed `private-link-not-accepting`, and so is every channel accepted after; a line is logged, and
 * nothing is thrown. Its close ends every open session as a socket link's does (1001).
 *
 * A session the channel's end ends (its peer's `close`, the carrier's end, UmbraDB's own close or terminate) frees its
 * instance id at once, whatever the carrier does after.
 */

import {
  ChannelEndpoint,
  type EndpointEvents,
  type LinkTimers,
  type PrivateLinkChannel,
} from "../library/channels.js";
import type { BlockRef } from "../runner/block-source.js";
import {
  CLOSE_PROTOCOL,
  type CoreLink,
  type CoreSessionOptions,
  type CoreSessions,
  coreSessions,
  type InstanceView,
  type LinkConnection,
  type LinkSession,
  type Received,
  TRANSPORT_LIMITS,
  type TransportLimits,
} from "./core-transport.js";
import type { Hello } from "./messages.js";

/** The most channels that wait for the link to start. */
export const CHANNEL_QUEUE_MAX = 64;

/** The largest message of a queued channel, its `hello`, in UTF-8 bytes. */
export const MAX_HELLO_BYTES = 64 * 1024;

/** The close code of a channel beyond the queue: try again later. */
export const CLOSE_TRY_AGAIN = 1013;

/** The close reason of a channel the link does not accept. */
export const NOT_ACCEPTING = "private-link-not-accepting";

/** The negative controls' and the tests' changes of the channel link only; none unless given. */
export interface CoreChannelSeams {
  /** The endpoints' clock (the liveness tests' controlled one). */
  readonly timers?: LinkTimers;
  /** How a message envelope's value is read (a control without the link's schemas). */
  readonly message?: (value: unknown) => Received;
  /** The sessions' handling of a second `hello` of a connected id (a control's `"accept"`). */
  readonly duplicates?: CoreSessionOptions["duplicates"];
  /** The sessions' read path (a control's `"unconfined"`). */
  readonly reads?: CoreSessionOptions["reads"];
  /** The link's limits (the largest message, the ping's interval). */
  readonly limits?: Partial<TransportLimits>;
  /** The most channels that wait for the link to start; {@link CHANNEL_QUEUE_MAX} unless given (a control's). */
  readonly queueMax?: number;
}

/** What {@link CoreChannels} takes. */
export interface CoreChannelsOptions extends CoreChannelSeams {
  /** Where log lines go. */
  readonly log: (line: string) => void;
}

/** The events of an endpoint no one is told of yet (until attached), or ever (a refused channel). */
const ignore = (): void => undefined;
const QUIET: EndpointEvents = Object.freeze({ received: ignore, oversized: ignore, backlogged: ignore, unanswered: ignore, ended: ignore });

/** A queued channel and its held `hello`. */
interface Queued {
  readonly endpoint: ChannelEndpoint;
  hello: Hello | null;
}

/**
 * Closes `channel`, which the process does not accept (`private-link-not-accepting`), and logs why; never throws.
 */
export function refuseChannel(channel: PrivateLinkChannel, log: (line: string) => void, why: string): void {
  // The endpoint catches whatever the carrier throws: a carrier that throws is ended as far as this process goes.
  new ChannelEndpoint(channel, QUIET).close(CLOSE_PROTOCOL, NOT_ACCEPTING);
  log(`private link: a channel was closed (${NOT_ACCEPTING}): ${why}`);
}

/** The core's link over channels (see the module comment). */
export class CoreChannels implements CoreLink {
  readonly #options: CoreChannelsOptions;
  readonly #limits: TransportLimits;
  #state: "queueing" | "open" | "closed" = "queueing";
  /** Why it accepts no more, once it does not. */
  #why = "";
  readonly #queue: Queued[] = [];
  readonly #open = new Set<ChannelEndpoint>();
  #sessions: CoreSessions | undefined;

  constructor(options: CoreChannelsOptions) {
    this.#options = options;
    this.#limits = { ...TRANSPORT_LIMITS, ...options.limits };
  }

  /** Takes `channel` (see the module comment); never throws. */
  accept(channel: PrivateLinkChannel): void {
    if (this.#state === "closed") {
      refuseChannel(channel, this.#options.log, this.#why);
      return;
    }
    if (this.#state === "open") {
      this.#session(this.#endpoint(channel, this.#limits.maxMessageBytes), null);
      return;
    }
    const most = this.#options.queueMax ?? CHANNEL_QUEUE_MAX;
    if (this.#queue.length >= most) {
      const endpoint = this.#endpoint(channel, MAX_HELLO_BYTES);
      endpoint.close(CLOSE_TRY_AGAIN, "try-again");
      this.#options.log(`private link: a channel was closed (try-again): ${most} channels wait already for the link to start`);
      return;
    }
    const queued: Queued = { endpoint: this.#endpoint(channel, MAX_HELLO_BYTES), hello: null };
    if (!queued.endpoint.open) return;
    queued.endpoint.attach(this.#queuedEvents(queued));
    this.#queue.push(queued);
  }

  /** Starts the link with the sessions' `options`: every queued channel becomes a session, in order. */
  start(options: Omit<CoreSessionOptions, "duplicates" | "reads" | "limits">): void {
    if (this.#state !== "queueing") return;
    const seams = this.#options;
    this.#sessions = coreSessions({
      ...options,
      ...(seams.duplicates === undefined ? {} : { duplicates: seams.duplicates }),
      ...(seams.reads === undefined ? {} : { reads: seams.reads }),
      limits: this.#limits,
    });
    this.#state = "open";
    for (const queued of this.#queue.splice(0)) {
      queued.endpoint.limit(this.#limits.maxMessageBytes);
      this.#session(queued.endpoint, queued.hello);
    }
  }

  /** Accepts no more channels (`why`, in the line logged for each): the queued ones are closed. */
  stopAccepting(why: string): void {
    if (this.#state === "closed") return;
    this.#state = "closed";
    this.#why = why;
    const queued = this.#queue.splice(0);
    for (const one of queued) one.endpoint.close(CLOSE_PROTOCOL, NOT_ACCEPTING);
    if (queued.length > 0) {
      this.#options.log(`private link: ${queued.length} queued channel${queued.length === 1 ? " was" : "s were"} closed (${NOT_ACCEPTING}): ${why}`);
    }
  }

  committed(block: BlockRef): void {
    this.#sessions?.committed(block);
  }

  instances(): readonly InstanceView[] {
    return this.#sessions?.instances() ?? [];
  }

  /** Accepts no more, closes the queued channels and every open session (1001). */
  async close(): Promise<void> {
    this.stopAccepting("the core is stopping");
    for (const endpoint of [...this.#open]) endpoint.close(1001, "the core is stopping");
  }

  /** UmbraDB's end of `channel`, its messages at most `maxMessageBytes`; told of nothing until attached. */
  #endpoint(channel: PrivateLinkChannel, maxMessageBytes: number): ChannelEndpoint {
    const seams = this.#options;
    return new ChannelEndpoint(channel, QUIET, {
      maxMessageBytes,
      pingIntervalMs: this.#limits.pingIntervalMs,
      maxBufferedBytes: this.#limits.maxBufferedBytes,
      ...(seams.timers === undefined ? {} : { timers: seams.timers }),
      ...(seams.message === undefined ? {} : { message: seams.message }),
    });
  }

  /** A queued channel's events (see the module comment). */
  #queuedEvents(queued: Queued): EndpointEvents {
    const { endpoint } = queued;
    const close = (code: number, reason: string): void => {
      this.#options.log(`private link: closed a queued channel: ${reason}`);
      endpoint.close(code, reason);
    };
    return {
      received: (received) => {
        if (!received.ok) close(CLOSE_PROTOCOL, received.fault);
        else if (queued.hello !== null) close(CLOSE_PROTOCOL, "hello-pending");
        else if (received.message.type !== "hello") close(CLOSE_PROTOCOL, "hello-first");
        else queued.hello = received.message;
      },
      oversized: close,
      // A queued channel sends only the envelope's pings and pongs: one too slow for them is closed so.
      backlogged: close,
      unanswered: () => {
        this.#options.log("private link: closed a queued channel: no-pong");
        endpoint.terminate(CLOSE_PROTOCOL, "no-pong");
      },
      ended: () => {
        const at = this.#queue.indexOf(queued);
        if (at >= 0) this.#queue.splice(at, 1);
      },
    };
  }

  /** `endpoint` as a session of the link, `hello` (held in the queue) its first message. */
  #session(endpoint: ChannelEndpoint, hello: Hello | null): void {
    if (!endpoint.open) return;
    const connection: LinkConnection = {
      isOpen: () => endpoint.open,
      bufferedAmount: () => endpoint.bufferedAmount(),
      send: (text) => endpoint.send(text),
      close: (code, reason) => endpoint.close(code, reason),
      terminate: (reason) => endpoint.terminate(CLOSE_PROTOCOL, reason),
    };
    const session: LinkSession = (this.#sessions as CoreSessions).open(connection);
    this.#open.add(endpoint);
    endpoint.attach({
      received: (received) => session.received(received),
      oversized: (code, reason) => session.drop(code, reason),
      backlogged: (code, reason) => session.drop(code, reason),
      unanswered: () => session.terminate("no-pong"),
      ended: () => {
        this.#open.delete(endpoint);
        session.closed();
      },
    });
    if (hello !== null) session.received({ ok: true, message: hello });
  }
}
