import { MessageChannel } from "node:worker_threads";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  ChannelEndpoint,
  CLOSE_REASON_MAX,
  ENVELOPE_BYTES,
  type EndpointEvents,
  exceedsUtf8,
  messagePortChannel,
  readEnvelope,
} from "../../src/library/channels.js";
import { MAX_MESSAGE_BYTES, PING_INTERVAL_MS } from "../../src/private/core-transport.js";
import { channelPair, controlledTimers, rawPeer, until } from "./channel-fixtures.js";

/**
 * The private link's channels, unit by unit `[CI]` [LM-6; design §5.4]:
 * - `messagePortChannel` over a real `worker_threads` `MessageChannel`: text both ways, a message kept until the
 *   listener registers, the peer's close heard, the listeners disposed;
 * - the envelope: each kind, and every fault of its shape;
 * - the UTF-8 count of a message, against Node.js's own (`Buffer.byteLength`);
 * - an endpoint: its own close and terminate end the channel whatever the carrier tells (L42), the pings on a
 *   controlled clock (L34's rule), the size of a message (L36's rule), `bufferedAmount`, and a carrier that throws.
 */

/** An endpoint's events, recorded. */
function recorder() {
  const seen: { received: unknown[]; oversized: [number, string][]; unanswered: number; ended: [number, string][] } = {
    received: [],
    oversized: [],
    unanswered: 0,
    ended: [],
  };
  const events: EndpointEvents = {
    received: (received) => seen.received.push(received),
    oversized: (code, reason) => seen.oversized.push([code, reason]),
    unanswered: () => {
      seen.unanswered += 1;
    },
    ended: (code, reason) => seen.ended.push([code, reason]),
  };
  return { seen, events };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

describe("messagePortChannel over a worker_threads MessageChannel (LM-6)", () => {
  it("carries text both ways, keeps a message sent before the listener, hears the peer's close, disposes its listeners", async () => {
    const { port1, port2 } = new MessageChannel();
    const a = messagePortChannel(port1);
    const b = messagePortChannel(port2);
    a.send("before any listener");
    const heard: string[] = [];
    const stop = b.onMessage((message) => heard.push(message));
    await until(() => heard.length === 1, "the kept message");
    b.send("back");
    const back: string[] = [];
    a.onMessage((message) => back.push(message));
    await until(() => back.length === 1, "the answer");
    expect(heard).toEqual(["before any listener"]);
    expect(back).toEqual(["back"]);
    // A disposed listener hears nothing more; one registered after it hears what follows. (A Node.js port holds its
    // close event back while a message waits with no listener, so the second listener also lets the close through.)
    stop();
    const later: string[] = [];
    b.onMessage((message) => later.push(message));
    a.send("after the disposer");
    await until(() => later.length === 1, "the later listener's message");
    expect(heard).toEqual(["before any listener"]);
    expect(later).toEqual(["after the disposer"]);
    let closed = 0;
    b.onClose(() => {
      closed += 1;
    });
    a.close();
    await until(() => closed === 1, "the peer's close");
  });

  it("is a PrivateLinkChannel without bufferedAmount or terminate (a port tells neither)", () => {
    const { port1, port2 } = new MessageChannel();
    const channel = messagePortChannel(port1);
    expect(channel.bufferedAmount).toBeUndefined();
    expect(channel.terminate).toBeUndefined();
    port1.close();
    port2.close();
  });
});

describe("the envelope (LM-6)", () => {
  it("reads each kind", () => {
    expect(readEnvelope('{"link":1,"kind":"ping"}')).toEqual({ kind: "ping" });
    expect(readEnvelope('{"link":1,"kind":"pong"}')).toEqual({ kind: "pong" });
    expect(readEnvelope('{"link":1,"kind":"close","code":1008,"reason":"too-slow"}')).toEqual({ kind: "close", code: 1008, reason: "too-slow" });
    const hello = { v: 1, type: "hello", instance: "a", version: "0.10.0", height: "0", hash: null };
    expect(readEnvelope(JSON.stringify({ link: 1, kind: "message", message: hello }))).toEqual({
      kind: "message",
      message: { ok: true, message: hello },
    });
  });

  it("a message failing its own schema is the message's fault, as on a socket", () => {
    const read = (message: unknown) => readEnvelope(JSON.stringify({ link: 1, kind: "message", message }));
    expect(read({ v: 2, type: "hello" })).toMatchObject({ kind: "message", message: { ok: false, fault: "unknown-version" } });
    expect(read({ v: 1, type: "api" })).toMatchObject({ kind: "message", message: { ok: false, fault: "unknown-type" } });
    expect(read({ v: 1, type: "hello", instance: "a b", version: "x", height: "0", hash: null })).toMatchObject({
      kind: "message",
      message: { ok: false, fault: "invalid-message" },
    });
    expect(read([1])).toMatchObject({ kind: "message", message: { ok: false, fault: "invalid-message" } });
  });

  it("every other shape is a fault: not-json, or invalid-envelope", () => {
    expect(readEnvelope("not json")).toEqual({ kind: "fault", fault: "not-json" });
    for (const text of [
      "[]",
      "null",
      '{"kind":"ping"}',
      '{"link":2,"kind":"ping"}',
      '{"link":1,"kind":"other"}',
      '{"link":1,"kind":"ping","extra":1}',
      '{"link":1,"kind":"message"}',
      '{"link":1,"kind":"message","message":{},"extra":1}',
      '{"link":1,"kind":"close","code":999,"reason":""}',
      '{"link":1,"kind":"close","code":5000,"reason":""}',
      '{"link":1,"kind":"close","code":1008.5,"reason":""}',
      '{"link":1,"kind":"close","code":"1008","reason":""}',
      '{"link":1,"kind":"close","code":1008}',
      '{"link":1,"kind":"close","code":1008,"reason":7}',
      JSON.stringify({ link: 1, kind: "close", code: 1008, reason: "r".repeat(CLOSE_REASON_MAX + 1) }),
    ]) {
      expect(readEnvelope(text), text).toEqual({ kind: "fault", fault: "invalid-envelope" });
    }
    expect(readEnvelope(JSON.stringify({ link: 1, kind: "close", code: 1000, reason: "r".repeat(CLOSE_REASON_MAX) }))).toMatchObject({ kind: "close" });
  });
});

describe("a message's size in UTF-8 bytes (LM-6)", () => {
  it("agrees with Buffer.byteLength at and around every limit (fast-check, seed 6006, 300 runs)", () => {
    fc.assert(
      fc.property(fc.string({ unit: "binary", maxLength: 40 }), fc.integer({ min: 0, max: 200 }), (text, limit) => {
        expect(exceedsUtf8(text, limit)).toBe(Buffer.byteLength(text, "utf8") > limit);
      }),
      { seed: 6006, numRuns: 300 },
    );
  });

  it("counts each kind of code unit: 1, 2, 3 bytes, a surrogate pair 4, a lone surrogate 3", () => {
    expect(exceedsUtf8("a", 0)).toBe(true);
    expect(exceedsUtf8("é", 1)).toBe(true);
    expect(exceedsUtf8("é", 2)).toBe(false);
    expect(exceedsUtf8("€", 2)).toBe(true);
    expect(exceedsUtf8("€", 3)).toBe(false);
    expect(exceedsUtf8("😀", 3)).toBe(true);
    expect(exceedsUtf8("😀", 4)).toBe(false);
    expect(exceedsUtf8("\ud800", 2)).toBe(true);
    expect(exceedsUtf8("\ud800", 3)).toBe(false);
    expect(exceedsUtf8("\ud800x", 4)).toBe(false);
  });
});

describe("an endpoint (LM-6)", () => {
  it("L42: its own close ends the channel at once — listeners disposed, the owner told — when the carrier never tells a close", async () => {
    const [ours, theirs] = channelPair({ silent: true });
    const peer = rawPeer(theirs);
    const { seen, events } = recorder();
    const endpoint = new ChannelEndpoint(ours, events);
    expect(ours.listeners).toEqual({ message: 1, close: 1 });
    endpoint.close(1008, "too-slow");
    expect(endpoint.open).toBe(false);
    expect(seen.ended).toEqual([[1008, "too-slow"]]);
    expect(ours.listeners).toEqual({ message: 0, close: 0 });
    expect(ours.closes).toBe(1);
    // The peer was told why before the carrier closed.
    expect(await peer.ended).toEqual({ code: 1008, reason: "too-slow" });
    // Closing again, or a late carrier event, tells nothing more.
    endpoint.close(1000, "again");
    endpoint.terminate(1000, "again");
    endpoint.send("{}");
    expect(seen.ended).toHaveLength(1);
  });

  it("terminate uses the carrier's terminate when it has one, else its close", () => {
    const [withTerminate] = channelPair({ terminate: true });
    new ChannelEndpoint(withTerminate, recorder().events).terminate(1008, "no-pong");
    expect({ terminations: withTerminate.terminations, closes: withTerminate.closes }).toEqual({ terminations: 1, closes: 0 });
    const [without] = channelPair();
    new ChannelEndpoint(without, recorder().events).terminate(1008, "no-pong");
    expect(without.closes).toBe(1);
  });

  it("the peer's close and the carrier's end are told with their code and reason", async () => {
    const [ours, theirs] = channelPair();
    const { seen, events } = recorder();
    const endpoint = new ChannelEndpoint(ours, events);
    theirs.send(JSON.stringify({ link: 1, kind: "close", code: 1011, reason: "report-unchecked" }));
    await until(() => seen.ended.length === 1, "the peer's close");
    expect(seen.ended).toEqual([[1011, "report-unchecked"]]);
    expect(endpoint.open).toBe(false);
    const [second, other] = channelPair();
    const two = recorder();
    new ChannelEndpoint(second, two.events);
    other.close();
    await until(() => two.seen.ended.length === 1, "the carrier's end");
    expect(two.seen.ended).toEqual([[1006, ""]]);
  });

  it("pings one interval after it is made, then every interval; an unanswered ping is told at the next interval", async () => {
    const clock = controlledTimers();
    const [ours, theirs] = channelPair();
    const peer = rawPeer(theirs);
    peer.answersPings = false;
    const { seen, events } = recorder();
    new ChannelEndpoint(ours, events, { timers: clock.timers });
    clock.advance(PING_INTERVAL_MS - 1);
    await settle();
    expect(peer.pings).toBe(0);
    clock.advance(1);
    await until(() => peer.pings === 1, "the first ping");
    expect(seen.unanswered).toBe(0);
    clock.advance(PING_INTERVAL_MS);
    expect(seen.unanswered).toBe(1);
  });

  it("a peer answering every ping is never told unanswered, through many intervals; the endpoint answers the peer's pings", async () => {
    const clock = controlledTimers();
    const [ours, theirs] = channelPair();
    const peer = rawPeer(theirs);
    const { seen, events } = recorder();
    const endpoint = new ChannelEndpoint(ours, events, { timers: clock.timers });
    for (let interval = 1; interval <= 5; interval++) {
      clock.advance(PING_INTERVAL_MS);
      await until(() => peer.pings === interval, `ping ${interval}`);
      // The pong arrives on a later turn, before the next interval.
      await settle();
      await settle();
    }
    expect(seen.unanswered).toBe(0);
    // Its own pong to the peer's ping is a control message, never told as a message of the link.
    const pongs: string[] = [];
    theirs.onMessage((text) => pongs.push(text));
    peer.ping();
    await until(() => pongs.includes('{"link":1,"kind":"pong"}'), "the pong");
    expect(seen.received).toEqual([]);
    endpoint.close(1000, "done");
    expect(clock.active).toBe(0);
  });

  it("L36's rule: a message over its limit in UTF-8 bytes (beside the envelope's own) is told oversized, one at it is read", async () => {
    const [ours, theirs] = channelPair();
    const { seen, events } = recorder();
    new ChannelEndpoint(ours, events, { maxMessageBytes: 100 });
    const atLimit = JSON.stringify({ link: 1, kind: "ping", pad: "" });
    // An envelope of exactly the limit plus the envelope's bytes passes the size check (and is then read).
    const fill = "x".repeat(100 + ENVELOPE_BYTES - atLimit.length);
    theirs.send(JSON.stringify({ link: 1, kind: "ping", pad: fill }));
    theirs.send(JSON.stringify({ link: 1, kind: "ping", pad: `${fill}é` }));
    await until(() => seen.received.length + seen.oversized.length === 2, "both");
    expect(seen.received).toEqual([{ ok: false, fault: "invalid-envelope" }]);
    expect(seen.oversized).toEqual([[1009, "too-large"]]);
    // The link's default is MAX_MESSAGE_BYTES.
    expect(MAX_MESSAGE_BYTES).toBe(64 * 1024 * 1024);
  });

  it("a message that is no text is told not-text", async () => {
    const [ours, theirs] = channelPair();
    const { seen, events } = recorder();
    new ChannelEndpoint(ours, events);
    rawPeer(theirs).sendRaw({ not: "text" });
    await until(() => seen.received.length === 1, "the fault");
    expect(seen.received).toEqual([{ ok: false, fault: "not-text" }]);
  });

  it("tells the carrier's bufferedAmount, null without one or when it throws or is no number", () => {
    let amount = 7;
    const [told] = channelPair({ bufferedAmount: () => amount });
    const endpoint = new ChannelEndpoint(told, recorder().events);
    expect(endpoint.bufferedAmount()).toBe(7);
    amount = Number.NaN;
    expect(endpoint.bufferedAmount()).toBeNull();
    const [throwing] = channelPair({
      bufferedAmount: () => {
        throw new Error("x");
      },
    });
    expect(new ChannelEndpoint(throwing, recorder().events).bufferedAmount()).toBeNull();
    const [none] = channelPair();
    expect(new ChannelEndpoint(none, recorder().events).bufferedAmount()).toBeNull();
  });

  it("a carrier whose send throws has ended; one whose registration throws is told ended once made", async () => {
    const [ours] = channelPair();
    const throwing = {
      ...ours,
      onMessage: ours.onMessage,
      onClose: ours.onClose,
      close: () => ours.close(),
      send: () => {
        throw new Error("gone");
      },
    };
    const { seen, events } = recorder();
    const endpoint = new ChannelEndpoint(throwing, events);
    endpoint.send("{}");
    expect(endpoint.open).toBe(false);
    expect(seen.ended).toEqual([[1006, ""]]);
    const refusing = {
      ...ours,
      onMessage: () => {
        throw new Error("no");
      },
    };
    const late = recorder();
    const never = new ChannelEndpoint(refusing, late.events);
    expect(never.open).toBe(false);
    expect(late.seen.ended).toEqual([]);
    await Promise.resolve();
    expect(late.seen.ended).toEqual([[1006, ""]]);
  });

  it("a message handed over as the listener registers is read once the endpoint is made, in order", async () => {
    const delivered: ((message: string) => void)[] = [];
    const eager = {
      send: () => undefined,
      onMessage(listener: (message: string) => void) {
        delivered.push(listener);
        listener(JSON.stringify({ link: 1, kind: "message", message: { v: 1, type: "nope" } }));
        return () => undefined;
      },
      onClose: () => () => undefined,
      close: () => undefined,
    };
    const { seen, events } = recorder();
    const endpoint = new ChannelEndpoint(eager, { ...events, received: () => undefined });
    endpoint.attach(events);
    (delivered[0] as (message: string) => void)("not json");
    expect(seen.received).toEqual([]);
    await Promise.resolve();
    expect(seen.received).toEqual([
      { ok: false, fault: "unknown-type", detail: expect.any(String) },
      { ok: false, fault: "not-json" },
    ]);
  });
});
