/**
 * The channel carrier of a private process's side of the process transport: each connection a new channel its host
 * opens (`privateSide: { connect }`), over UmbraDB's end of it (`ChannelEndpoint`, `src/library/channels.ts`: the
 * envelope, the pings, the size of a message). The session logic is `./private-transport.ts`'s, as over a socket.
 * [LM-6, PP-4; design §5.4]
 *
 * **Each (re)connection** calls `connect(signal)` and takes the channel it resolves with; the endpoint registers on it
 * in the same turn, and the transport sends its `hello`. A `connect()` that rejects (or resolves with no channel, or
 * throws) is a lost connection: the transport connects again after its back-off, as after a socket that did not open.
 *
 * **At the stop** the transport's signal aborts: `connect()` is not waited for, a channel it resolves later is closed at
 * once, a later rejection is consumed, and no retry starts. A channel open at the stop is closed (1001). [LM-6, L41]
 *
 * The endpoint gives up on a core that does not answer its ping by the next interval ("the core did not answer a
 * ping", `no-pong`), as the socket carrier does, and closes a channel that holds more than the link's
 * `MAX_BUFFERED_BYTES` undelivered at a send (`too-slow`); the transport then connects again. [LM-6, L35]
 */

import {
  ChannelEndpoint,
  type LinkTimers,
  type PrivateLinkChannel,
} from "../library/channels.js";
import { UmbraError } from "../db/errors.js";
import { CLOSE_PROTOCOL, type Received, TRANSPORT_LIMITS, type TransportLimits } from "./core-transport.js";
import type { CarrierConnection, CarrierEvents, PrivateCarrier } from "./private-transport.js";

/** How a private process's host opens one channel of the link: a new one on each call. [LM-6] */
export type ConnectChannel = (signal: AbortSignal) => Promise<PrivateLinkChannel>;

/** The tests' changes of the channel carrier: the endpoints' clock, the link's limits, a control's message reading. */
export interface ChannelCarrierSeams {
  readonly timers?: LinkTimers;
  readonly limits?: Partial<Pick<TransportLimits, "maxMessageBytes" | "maxBufferedBytes" | "pingIntervalMs">>;
  /** How a message envelope's value is read: the link's schemas unless given (a negative control's). [L66] */
  readonly message?: (value: unknown) => Received;
}

/** Whether `found` has a channel's members (see `PrivateLinkChannel`). */
function isChannel(found: unknown): found is PrivateLinkChannel {
  if (typeof found !== "object" || found === null) return false;
  const channel = found as Record<string, unknown>;
  return ["send", "onMessage", "onClose", "close"].every((member) => typeof channel[member] === "function");
}

/** A rejection of the host's `connect()`, in a log line: its code or its kind, never its message. */
function rejection(error: unknown): string {
  if (error instanceof UmbraError) return error.code;
  if (error instanceof Error) return error.name;
  return typeof error;
}

/** Closes a channel the transport no longer wants; a carrier whose close throws is ended as far as it goes. */
function discard(channel: unknown): void {
  if (!isChannel(channel)) return;
  try {
    channel.close();
  } catch {
    // Ended as far as this process goes.
  }
}

/** The channel carrier over the host's `connect` (see the module comment). [LM-6] */
export function channelCarrier(connect: ConnectChannel, seams: ChannelCarrierSeams = {}): PrivateCarrier {
  const { maxMessageBytes, maxBufferedBytes, pingIntervalMs } = { ...TRANSPORT_LIMITS, ...seams.limits };
  return Object.freeze({
    where: "over a channel",
    dial(events: CarrierEvents, signal: AbortSignal): CarrierConnection {
      let endpoint: ChannelEndpoint | undefined;
      /** Set once the transport ended this connection, or it ended: a channel resolved after it is closed at once. */
      let done = false;
      const opened = (channel: PrivateLinkChannel): void => {
        endpoint = new ChannelEndpoint(
          channel,
          {
            received: (received) => events.received(received),
            oversized: (code, reason) => {
              events.failed(reason);
              endpoint?.close(code, reason);
            },
            // A core that reads so slowly that the channel holds more than the limit: closed so, and connected again.
            // [LM-6, L35]
            backlogged: (_code, reason) => events.failed(reason),
            unanswered: () => {
              events.failed("the core did not answer a ping");
              endpoint?.terminate(CLOSE_PROTOCOL, "no-pong");
            },
            ended: (code, reason) => {
              done = true;
              events.ended(code, reason);
            },
          },
          {
            maxMessageBytes,
            maxBufferedBytes,
            pingIntervalMs,
            ...(seams.timers === undefined ? {} : { timers: seams.timers }),
            ...(seams.message === undefined ? {} : { message: seams.message }),
          },
        );
        if (endpoint.open) events.opened();
      };
      // Called on a later turn, so a `connect` that throws is a rejection, and no event comes before `dial` returns.
      void Promise.resolve()
        .then(() => connect(signal))
        .then(
          (channel) => {
            if (done || signal.aborted) {
              discard(channel);
              return;
            }
            if (!isChannel(channel)) {
              done = true;
              events.failed("the host's connect() resolved with no channel");
              events.ended(1006, "");
              return;
            }
            opened(channel);
          },
          (error: unknown) => {
            // After the stop a rejection is consumed: no retry starts. [L41]
            if (done || signal.aborted) return;
            done = true;
            events.failed(`the host's connect() rejected (${rejection(error)})`);
            events.ended(1006, "");
          },
        );
      return Object.freeze({
        send: (text: string) => endpoint?.send(text),
        close: (code: number, reason: string) => {
          done = true;
          endpoint?.close(code, reason);
        },
        shutdown: async () => {
          done = true;
          endpoint?.close(1001, "the private process is stopping");
        },
      });
    },
  });
}
