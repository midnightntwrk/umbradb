import type { LinkTimers, PrivateLinkChannel } from "../../src/library/channels.js";
import { parseJsonLossless } from "../../src/deterministic-postgresql/index.js";

/**
 * What the channel tests share: a controlled clock for the endpoints' pings, test-owned channels that follow the
 * `PrivateLinkChannel` contract (whole messages in order, kept until a listener registers, delivered on a later turn
 * as a `MessagePort` does), and a raw peer that speaks the channel envelope itself — written here from the envelope's
 * documented shape, never with the code under test — so a test can be the other end of a process's link. Imports
 * nothing of Vitest.
 */

/** A controlled clock: an endpoint's interval falls due only when the test moves the clock. */
export interface ControlledTimers {
  readonly timers: LinkTimers;
  /** Moves the clock by `ms`, running each interval that falls due on the way, in time order. */
  advance(ms: number): void;
  /** How many intervals run now (one per open endpoint). */
  readonly active: number;
}

/** A clock for the tests of liveness (see {@link ControlledTimers}). */
export function controlledTimers(): ControlledTimers {
  let now = 0;
  const intervals = new Set<{ due: number; readonly ms: number; readonly tick: () => void }>();
  return {
    timers: {
      every(ms, tick) {
        const entry = { due: now + ms, ms, tick };
        intervals.add(entry);
        return () => {
          intervals.delete(entry);
        };
      },
    },
    advance(ms) {
      const until = now + ms;
      for (;;) {
        let next: { due: number; readonly ms: number; readonly tick: () => void } | undefined;
        for (const entry of intervals) if (entry.due <= until && (next === undefined || entry.due < next.due)) next = entry;
        if (next === undefined) break;
        now = next.due;
        next.due += next.ms;
        next.tick();
      }
      now = until;
    },
    get active() {
      return intervals.size;
    },
  };
}

/** How a test-owned end behaves. */
export interface TestEndOptions {
  /** What its `bufferedAmount()` answers; the end has no `bufferedAmount` without it. */
  readonly bufferedAmount?: () => number;
  /** When set, its `onClose` listeners are never called (a carrier that tells no close). */
  readonly silent?: boolean;
  /** When set, the end has a `terminate()`. */
  readonly terminate?: boolean;
}

/** One end of a test-owned channel, with what was done to it. */
export interface TestEnd extends PrivateLinkChannel {
  /** How often its `close()` and `terminate()` were called. */
  readonly closes: number;
  readonly terminations: number;
  /** How many listeners of each kind it holds now (UmbraDB disposes of its own at the end). */
  readonly listeners: { readonly message: number; readonly close: number };
  /** Whether the channel ended (either end closed). */
  readonly ended: boolean;
}

/** A test-owned channel: two ends, each delivering to the other (see the module comment). */
export function channelPair(a: TestEndOptions = {}, b: TestEndOptions = {}): [TestEnd, TestEnd] {
  let ended = false;
  const make = (options: TestEndOptions) => {
    const messageListeners = new Set<(message: string) => void>();
    const closeListeners = new Set<() => void>();
    const kept: string[] = [];
    const state = { closes: 0, terminations: 0 };
    const deliver = (message: string): void => {
      if (messageListeners.size === 0) {
        kept.push(message);
        return;
      }
      for (const listener of [...messageListeners]) listener(message);
    };
    const end = (): void => {
      if (ended) return;
      ended = true;
      setImmediate(() => {
        for (const one of ends) one.told();
      });
    };
    const channel = {
      deliver,
      told: () => {
        if (options.silent === true) return;
        for (const listener of [...closeListeners]) listener();
      },
      end: {
        send(message: string) {
          if (ended) return;
          // A message sent before the channel ended is delivered, before the end is told (as a MessagePort does).
          const other = ends.find((one) => one !== self) as (typeof ends)[number];
          setImmediate(() => other.deliver(message));
        },
        onMessage(listener: (message: string) => void) {
          messageListeners.add(listener);
          const now = kept.splice(0);
          if (now.length > 0) {
            setImmediate(() => {
              for (const message of now) listener(message);
            });
          }
          return () => {
            messageListeners.delete(listener);
          };
        },
        onClose(listener: () => void) {
          closeListeners.add(listener);
          return () => {
            closeListeners.delete(listener);
          };
        },
        close() {
          state.closes += 1;
          end();
        },
        ...(options.terminate === true
          ? {
              terminate() {
                state.terminations += 1;
                end();
              },
            }
          : {}),
        ...(options.bufferedAmount === undefined ? {} : { bufferedAmount: options.bufferedAmount }),
        get closes() {
          return state.closes;
        },
        get terminations() {
          return state.terminations;
        },
        get listeners() {
          return { message: messageListeners.size, close: closeListeners.size };
        },
        get ended() {
          return ended;
        },
      } as TestEnd,
    };
    const self = channel;
    return channel;
  };
  const ends = [make(a), make(b)];
  return [(ends[0] as (typeof ends)[number]).end, (ends[1] as (typeof ends)[number]).end];
}

/** A message of the link as a peer reads it: a JSON object with its `type`. */
export type PeerMessage = Readonly<Record<string, unknown>> & { readonly type: string };

/** How a peer's channel ended: the other end's `close` envelope, or the carrier's end with none. */
export type PeerEnd = { readonly code: number; readonly reason: string } | { readonly carrier: true };

/** A raw peer of a process's link over `channel` (see the module comment). */
export interface RawPeer {
  /** Every message of the link received, in order. */
  readonly received: PeerMessage[];
  /** How many pings it received. */
  readonly pings: number;
  /** Whether it answers pings (true unless set). */
  answersPings: boolean;
  /** Sends `message` (an object) in its envelope. */
  send(message: Readonly<Record<string, unknown>>): void;
  /** Sends `text` as it is: an envelope written by hand, or text that is none. */
  sendRaw(text: unknown): void;
  /** Sends a ping. */
  ping(): void;
  /** The next message of `type` received (one received already included), within `ms`. */
  next(type: string, ms?: number): Promise<PeerMessage>;
  /** Resolves with how the channel ended. */
  readonly ended: Promise<PeerEnd>;
  /** How it ended, or null while it has not. */
  readonly end: PeerEnd | null;
}

/** A `hello` of `instance` at `height`, as a peer sends it. */
export const peerHello = (instance: string, height = "0"): Readonly<Record<string, unknown>> => ({
  v: 1,
  type: "hello",
  instance,
  version: "0.10.0",
  height,
  hash: null,
});

/** A raw peer over `channel` (see {@link RawPeer}). */
export function rawPeer(channel: PrivateLinkChannel): RawPeer {
  const received: PeerMessage[] = [];
  let pings = 0;
  let end: PeerEnd | null = null;
  let resolveEnded: (found: PeerEnd) => void = () => undefined;
  const ended = new Promise<PeerEnd>((resolve) => {
    resolveEnded = resolve;
  });
  const finish = (found: PeerEnd): void => {
    if (end !== null) return;
    end = found;
    resolveEnded(found);
  };
  const post = (envelope: Readonly<Record<string, unknown>>): void => channel.send(JSON.stringify(envelope));
  const peer: RawPeer = {
    received,
    get pings() {
      return pings;
    },
    answersPings: true,
    send(message) {
      post({ link: 1, kind: "message", message });
    },
    sendRaw(text) {
      channel.send(text as string);
    },
    ping() {
      post({ link: 1, kind: "ping" });
    },
    async next(type, ms = 30_000) {
      const deadline = Date.now() + ms;
      for (;;) {
        const found = received.find((message) => message.type === type);
        if (found !== undefined) {
          received.splice(received.indexOf(found), 1);
          return found;
        }
        if (Date.now() > deadline) throw new Error(`no ${type} within ${ms} ms; received ${JSON.stringify(received)}; ended ${JSON.stringify(end)}`);
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    },
    ended,
    get end() {
      return end;
    },
  };
  channel.onMessage((text) => {
    const envelope = parseJsonLossless(text) as Record<string, unknown>;
    if (envelope.kind === "ping") {
      pings += 1;
      if (peer.answersPings) post({ link: 1, kind: "pong" });
    } else if (envelope.kind === "close") {
      finish({ code: envelope.code as number, reason: envelope.reason as string });
    } else if (envelope.kind === "message") {
      received.push(envelope.message as PeerMessage);
    }
  });
  channel.onClose(() => finish({ carrier: true }));
  return peer;
}

/** Waits until `holds` is true, or rejects after `ms`. */
export async function until(holds: () => boolean, what: string, ms = 30_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!holds()) {
    if (Date.now() > deadline) throw new Error(`${what} did not happen within ${ms} ms`);
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}
