import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { UmbraError } from "../../src/db/errors.js";
import { channelCarrier } from "../../src/private/private-channels.js";
import { type CarrierConnection, type CarrierEvents, type PrivateCarrier, PrivateTransport } from "../../src/private/private-transport.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { MAX_BUFFERED_BYTES, PING_INTERVAL_MS } from "../../src/private/core-transport.js";
import { CoreChannels } from "../../src/private/core-channels.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS } from "../private/backends.js";
import { channelPair, controlledTimers, type ControlledTimers, peerHello, rawPeer, type RawPeer, type TestEnd, until } from "./channel-fixtures.js";
import { channelCore, channelPrivate, linkTo, type Logged } from "./channel-processes.js";
import { cursorReaches } from "./library-fixtures.js";
import { l39Problems } from "./refused-channels.js";

/**
 * The channel link's queue and its ends `[CI]`, on PostgreSQL 18 (Docker) and PGlite 0.5.10:
 * - `[NEG]`: before the link starts (a module's `on-start-db` held), 64 channels queue and answer pings and the
 *   65th closes 1013 `try-again`; a queued channel whose first message is not a `hello` closes `hello-first`, one sending
 *   a second message `hello-pending`, one whose `hello` is over 64 KiB `too-large`; a queued peer that sends its `hello`
 *   and answers pings through three intervals (a controlled clock) stays queued and is activated (`hello-ack`) when the
 *   link starts; all 64 are pinged at the first interval and kept while they answer; one that stops answering closes
 *   `no-pong` at the second and frees its place — the queue full until then, the faults silent, so a channel accepted
 *   right after is queued only in the freed place; at a class-B refusal (the held `on-start-db` throws) every queued
 *   channel closes `private-link-not-accepting`. Negative control: the queue's limit lifted (the channel link's seam),
 *   the 65th is queued, and the oracle fails.
 * - `[NEG]`: `accept()` on a process not accepting channels (no channel request), after a refusal and after
 *   `stop()`: the channel closes `private-link-not-accepting`, a line is logged, nothing throws (a carrier that throws
 *   included; the run and oracle are `./refused-channels.ts`'s). Negative control,
 *   `./channel-queue.negative-control.test.ts`: the not-accepting paths keeping the channel fail the same oracle.
 * - A `connect()` that rejects is retried with the back-off (1 s, doubling up to `backoffCeilingMs`), each
 *   logged, until one resolves; the private process then follows. A value whose channel members cannot be read (a
 *   getter or a proxy's trap that throws) is no channel, and a rejection whose error cannot be read is logged by its
 *   type: each a lost connection (`failed`, then `ended` 1006), with no rejection unhandled.
 * - `[NEG]`: a `connect()` that never settles does not delay `stop()`; a channel it resolves after `stop()` is
 *   closed; a rejection after it is not unhandled; no retry starts; a value whose members cannot be read, resolved
 *   after it, is left alone, nothing unhandled. Negative control: a carrier that waits for its `connect()` at the stop
 *   and ignores the signal (the fault) fails the same oracle, at the transport.
 * - `[NEG]` beyond the core's own sends (`./channel-link.test.ts`): on the private side, a channel holding more
 *   than `MAX_BUFFERED_BYTES` undelivered is closed 1008 `too-slow` at its next send (the `hello`), and the transport
 *   connects again; on a queued channel of the core, at its next ping, and at its answer to the peer's ping. Negative
 *   controls: the limit raised beyond any amount (the carrier's and the queue's seams, channels only): the slow channel
 *   stays, and each oracle fails.
 */

/** A promise the test opens, and whether the code that awaits it reached it. */
function gate() {
  let open!: () => void;
  let fail!: (error: unknown) => void;
  let reach!: () => void;
  const reached = new Promise<void>((resolve) => {
    reach = resolve;
  });
  const passed = new Promise<void>((resolve, reject) => {
    open = resolve;
    fail = reject;
  });
  return { reached, wait: () => (reach(), passed), open, fail };
}

/** A user module whose `on-start-db` waits at `held`: the link starts only after it. */
function heldModule(held: ReturnType<typeof gate>): ModuleDeclaration {
  return defineModule({
    id: "held",
    version: "1.0.0",
    side: "public",
    requires: ["block-header"],
    provides: [],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [],
    points: {
      async "on-start-db"() {
        await held.wait();
      },
    },
  } as ModuleDeclaration);
}

/** Lets what the clock's tick sent reach its peers and their answers come back. */
async function tick(clock: ControlledTimers, ms: number): Promise<void> {
  clock.advance(ms);
  await new Promise((resolve) => setTimeout(resolve, 60));
}

/** A raw peer on a new test-owned channel `core` accepts. */
function accepted(core: Logged): { peer: RawPeer; end: TestEnd } {
  const [coreEnd, peerEnd] = channelPair();
  core.handle.privateLink.accept(coreEnd);
  return { peer: rawPeer(peerEnd), end: coreEnd };
}

/** What one run saw. */
interface QueueRun {
  readonly sixtyFifth: unknown;
  /** How many of the 64 queued channels were pinged by the first interval and still open then. */
  readonly pingedAtFirst: number;
  /** How many of the 63 that answer were still open after the second interval, the dead one's. */
  readonly openAtSecond: number;
  readonly faults: Readonly<Record<string, unknown>>;
  readonly healthy: { readonly pings: number; readonly endedWhileQueued: unknown; readonly ack: unknown };
  readonly dead: unknown;
  readonly afterDead: unknown;
  readonly queuedOpen: number;
  readonly activated: number;
}

/**
 * One run on `backend` with the queue's limit `queueMax` (the control's seam), or the link's own. The queue stays
 * full — 64 channels, the three faults among them, silent — until the dead peer's `no-pong` at the second interval, so
 * that the late channel accepted then is queued only when the dead one freed its place; the faults' messages come
 * after it.
 */
async function queueRun(backend: PrivateBackend, queueMax?: number): Promise<QueueRun> {
  const clock = controlledTimers();
  const held = gate();
  const module = heldModule(held);
  const core = channelCore(await backend.database("public"), {
    head: 2n,
    modules: [module],
    seams: { timers: clock.timers, ...(queueMax === undefined ? {} : { queueMax }) },
  });
  try {
    await held.reached;
    // 64 channels: the healthy one, the dead one, the three faults, and 59 more peers that greet and answer pings.
    const healthy = accepted(core);
    const dead = accepted(core);
    const faults = { first: accepted(core), pending: accepted(core), large: accepted(core) };
    const others = Array.from({ length: 59 }, () => accepted(core));
    const sixtyFifth = accepted(core);
    await until(() => sixtyFifth.peer.end !== null || core.lines.some((line) => line.includes("try-again")), "the 65th's answer", 2_000).catch(() => undefined);
    const queued = [healthy, dead, ...Object.values(faults), ...others];
    // The greeting peers' hellos; the faults wait, answering pings, so the queue stays full.
    healthy.peer.send(peerHello("q-healthy"));
    dead.peer.send(peerHello("q-dead"));
    dead.peer.answersPings = false;
    others.forEach((other, index) => other.peer.send(peerHello(`q-${index}`)));
    // The first interval: every queued channel is pinged, and answers.
    await tick(clock, PING_INTERVAL_MS);
    const pingedAtFirst = queued.filter((one) => one.peer.pings >= 1 && one.peer.end === null).length;
    // The second: the dead one is ended no-pong and its place freed, the 63 others kept.
    await tick(clock, PING_INTERVAL_MS);
    const deadEnd = dead.peer.end;
    const openAtSecond = queued.filter((one) => one !== dead && one.peer.end === null).length;
    // A full queue but for the dead one's place: the late channel takes it.
    const late = accepted(core);
    late.peer.send(peerHello("q-late"));
    await until(() => late.peer.end !== null, "the late channel's close", 200).catch(() => undefined);
    // The faults' messages, now.
    faults.first.peer.send({ v: 1, type: "read", id: "1", statements: [] });
    faults.pending.peer.send(peerHello("q-pending"));
    faults.pending.peer.send({ v: 1, type: "read", id: "1", statements: [] });
    faults.large.peer.send({ ...peerHello("q-large"), version: "x".repeat(64 * 1024) });
    await until(() => Object.values(faults).every((one) => one.peer.end !== null), "the faults' closes", 10_000).catch(() => undefined);
    // The third interval: the healthy one stays queued.
    await tick(clock, PING_INTERVAL_MS);
    const endedWhileQueued = healthy.peer.end;
    const pings = healthy.peer.pings;
    const queuedOpen = [healthy, late, ...others].filter((one) => one.peer.end === null).length;
    held.open();
    await core.handle.started;
    const ack = await healthy.peer.next("hello-ack", 30_000).catch((error: Error) => error.message);
    let activated = 0;
    for (const one of [late, ...others]) {
      if ((await one.peer.next("hello-ack", 30_000).catch(() => null)) !== null) activated += 1;
    }
    return {
      sixtyFifth: sixtyFifth.peer.end,
      pingedAtFirst,
      openAtSecond,
      faults: Object.fromEntries(Object.entries(faults).map(([name, one]) => [name, one.peer.end])),
      healthy: { pings, endedWhileQueued, ack },
      dead: deadEnd,
      afterDead: late.peer.end,
      queuedOpen,
      activated,
    };
  } finally {
    held.open();
    await core.handle.stop();
  }
}

/** The oracle: every problem of `run`, none when it holds. */
function queueProblems(run: QueueRun): string[] {
  const problems: string[] = [];
  const json = (value: unknown) => JSON.stringify(value);
  if (json(run.sixtyFifth) !== json({ code: 1013, reason: "try-again" })) problems.push(`the 65th: ${json(run.sixtyFifth)}`);
  if (run.pingedAtFirst !== 64) problems.push(`${run.pingedAtFirst} of the 64 queued channels pinged and open at the first interval`);
  if (run.openAtSecond !== 63) problems.push(`${run.openAtSecond} of the 63 answering channels open after the second interval`);
  const expected = { first: { code: 1008, reason: "hello-first" }, pending: { code: 1008, reason: "hello-pending" }, large: { code: 1009, reason: "too-large" } };
  if (json(run.faults) !== json(expected)) problems.push(`the faults: ${json(run.faults)}`);
  if (run.healthy.endedWhileQueued !== null || run.healthy.pings < 3) problems.push(`the healthy peer while queued: ${json(run.healthy)}`);
  if (typeof run.healthy.ack !== "object" || (run.healthy.ack as { refused?: unknown }).refused !== null) problems.push(`the healthy peer's hello-ack: ${json(run.healthy.ack)}`);
  if (json(run.dead) !== json({ code: 1008, reason: "no-pong" })) problems.push(`the dead peer: ${json(run.dead)}`);
  if (run.afterDead !== null) problems.push(`the channel after the dead one freed its place: ${json(run.afterDead)}`);
  if (run.queuedOpen !== 61) problems.push(`${run.queuedOpen} queued channels open after three intervals, not 61`);
  if (run.activated !== 60) problems.push(`${run.activated} queued channels activated, not 60`);
  return problems;
}

describe.each(PRIVATE_BACKENDS)("the channel link's queue and ends on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("64 channels queue and answer pings, the 65th try-again; hello-first, hello-pending, too-large; a healthy peer stays and is activated; a dead one no-pong", async () => {
    expect(queueProblems(await queueRun(backend))).toEqual([]);
  }, 120_000);

  it("negative control (committed): with the queue's limit lifted, the 65th is queued, and the oracle fails", async () => {
    const problems = queueProblems(await queueRun(backend, Number.POSITIVE_INFINITY));
    expect(problems.some((problem) => problem.startsWith("the 65th:"))).toBe(true);
  }, 120_000);

  it("at a class-B refusal every queued channel closes private-link-not-accepting; one accepted after it too", async () => {
    const held = gate();
    const core = channelCore(await backend.database("public"), { head: 2n, modules: [heldModule(held)] });
    try {
      await held.reached;
      const greetedOne = accepted(core);
      greetedOne.peer.send(peerHello("q-refused"));
      const silent = accepted(core);
      await new Promise((resolve) => setTimeout(resolve, 50));
      held.fail(new Error("refused on purpose"));
      await expect(core.handle.started).rejects.toMatchObject({ code: "callback-error" });
      expect(await greetedOne.peer.ended).toEqual({ code: 1008, reason: "private-link-not-accepting" });
      expect(await silent.peer.ended).toEqual({ code: 1008, reason: "private-link-not-accepting" });
      expect(core.lines).toContain("private link: 2 queued channels were closed (private-link-not-accepting): startup was refused");
      const after = accepted(core);
      expect(await after.peer.ended).toEqual({ code: 1008, reason: "private-link-not-accepting" });
      expect(core.lines).toContain("private link: a channel was closed (private-link-not-accepting): startup was refused");
      expect(after.end.listeners).toEqual({ message: 0, close: 0 });
    } finally {
      held.open();
      await core.handle.stop();
    }
  }, 120_000);

  it("accept() on a process not accepting channels, or after stop(): closed private-link-not-accepting, a line logged, nothing thrown", async () => {
    // The run and its oracle (`./refused-channels.ts`): no channel request, then a channel core after its stop.
    expect(await l39Problems(backend)).toEqual([]);
  }, 120_000);

  it("a rejecting connect() is retried with the back-off, each attempt logged, until one resolves; the private process then follows", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    const core = channelCore(publicDb, { head: 3n });
    try {
      await core.handle.started;
      const link = linkTo(core.handle);
      const calls: number[] = [];
      const connect = async (signal: AbortSignal) => {
        calls.push(performance.now());
        if (calls.length <= 3) throw new Error("the host has no channel yet");
        return link.connect(signal);
      };
      const instance = channelPrivate(privateDb, publicDb, { instanceId: "ch-retry", connect, extra: { backoffCeilingMs: 2_000 } });
      try {
        await cursorReaches(instance.handle, 3n, 300_000);
        expect(calls.length).toBe(4);
        expect(link.opened).toBe(1);
        const waits = instance.lines.filter((line) => line.startsWith("transport: the host's connect() rejected (Error); connecting again in "));
        expect(waits).toEqual([
          "transport: the host's connect() rejected (Error); connecting again in 1000 ms (attempt 1)",
          "transport: the host's connect() rejected (Error); connecting again in 2000 ms (attempt 2)",
          "transport: the host's connect() rejected (Error); connecting again in 2000 ms (attempt 3)",
        ]);
        // Each new call came no earlier than its back-off (a timer never fires early; no upper bound is assumed).
        const gaps = calls.slice(1).map((at, index) => at - (calls[index] as number));
        expect(gaps.map((gap, index) => gap >= [1_000, 2_000, 2_000][index]! - 5)).toEqual([true, true, true]);
      } finally {
        await instance.handle.stop();
      }
    } finally {
      await core.handle.stop();
    }
  }, 600_000);

  it("a connect() that never settles does not delay stop(); a channel it resolves after stop() is closed; no retry starts", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    let resolve!: (channel: PrivateLinkChannel) => void;
    const signals: AbortSignal[] = [];
    const connect = (signal: AbortSignal) => {
      signals.push(signal);
      return new Promise<PrivateLinkChannel>((done) => {
        resolve = done;
      });
    };
    const instance = channelPrivate(privateDb, publicDb, { instanceId: "ch-never", connect, extra: { backoffCeilingMs: 1_000 } });
    await until(() => signals.length === 1, "the first connect()");
    const stopped = await Promise.race([
      instance.handle.stop().then(() => "stopped"),
      new Promise((done) => setTimeout(() => done("still stopping after 20 s"), 20_000)),
    ]);
    expect(stopped).toBe("stopped");
    expect(signals[0]?.aborted).toBe(true);
    const [late] = channelPair();
    resolve(late);
    await until(() => late.closes === 1, "the late channel's close");
    // No retry: the back-off would have called it again within 1 s.
    await new Promise((done) => setTimeout(done, 1_500));
    expect(signals).toHaveLength(1);
  }, 120_000);

  it("a rejection of connect() after stop() is consumed, not unhandled, and starts no retry", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    let reject!: (error: unknown) => void;
    let calls = 0;
    const connect = () => {
      calls += 1;
      return new Promise<PrivateLinkChannel>((_, fail) => {
        reject = fail;
      });
    };
    const unhandled: unknown[] = [];
    const listener = (reason: unknown) => unhandled.push(reason);
    process.on("unhandledRejection", listener);
    try {
      const instance = channelPrivate(privateDb, publicDb, { instanceId: "ch-rejects", connect, extra: { backoffCeilingMs: 1_000 } });
      await until(() => calls === 1, "the first connect()");
      await instance.handle.stop();
      reject(new UmbraError("handle-closed", "the host's channel went away", {}));
      await new Promise((done) => setTimeout(done, 1_500));
      expect(unhandled).toEqual([]);
      expect(calls).toBe(1);
      expect(instance.lines.some((line) => line.includes("connect() rejected"))).toBe(false);
    } finally {
      process.off("unhandledRejection", listener);
    }
  }, 120_000);
});

/** The oracle at the transport: a stop with a `connect()` pending, then a channel resolved after it. */
async function stopProblems(carrierOf: (connect: (signal: AbortSignal) => Promise<PrivateLinkChannel>) => PrivateCarrier): Promise<string[]> {
  const problems: string[] = [];
  let resolve!: (channel: PrivateLinkChannel) => void;
  let calls = 0;
  const transport = new PrivateTransport({
    carrier: carrierOf(() => {
      calls += 1;
      return new Promise((done) => {
        resolve = done;
      });
    }),
    instance: "transport-stop",
    version: "0.10.0",
    position: () => ({ height: 0n, hash: null }),
    backoffCeilingMs: 1_000,
    log: () => undefined,
  });
  void transport.connection().catch(() => undefined);
  await until(() => calls === 1, "the connect()");
  const stopped = await Promise.race([transport.close().then(() => true), new Promise((done) => setTimeout(() => done(false), 2_000))]);
  if (!stopped) problems.push("the stop waited for connect()");
  const [late] = channelPair();
  resolve(late);
  await new Promise((done) => setTimeout(done, 1_500));
  if (late.closes !== 1) problems.push(`the channel resolved after the stop was closed ${late.closes} times`);
  if (calls !== 1) problems.push(`connect() was called ${calls} times`);
  await transport.close();
  return problems;
}

/** The fault: a carrier that waits at the stop for its `connect()` and ignores the signal (it keeps a late channel). */
function waitingCarrier(connect: (signal: AbortSignal) => Promise<PrivateLinkChannel>): PrivateCarrier {
  return {
    where: "over a channel",
    dial(_events: CarrierEvents): CarrierConnection {
      const pending = connect(new AbortController().signal);
      return {
        send: () => undefined,
        close: () => undefined,
        shutdown: async () => {
          await Promise.race([pending, new Promise((done) => setTimeout(done, 3_000))]);
        },
      };
    },
  };
}

describe("at the transport: the stop and a pending connect()", () => {
  it("the channel carrier: the stop does not wait, the late channel is closed, no retry", async () => {
    expect(await stopProblems((connect) => channelCarrier(connect))).toEqual([]);
  }, 30_000);

  it("negative control (committed): a carrier that waits for connect() at the stop and ignores the signal fails the oracle", async () => {
    const problems = await stopProblems(waitingCarrier);
    expect(problems).toContain("the stop waited for connect()");
    expect(problems.some((problem) => problem.startsWith("the channel resolved after the stop was closed 0"))).toBe(true);
  }, 30_000);
});

/** A private transport over `carrier`, its log kept. */
function transportOver(carrier: PrivateCarrier) {
  const lines: string[] = [];
  const transport = new PrivateTransport({
    carrier,
    instance: "carrier-unit",
    version: "0.10.0",
    position: () => ({ height: 0n, hash: null }),
    backoffCeilingMs: 1_000,
    log: (line) => lines.push(line),
  });
  void transport.connection().catch(() => undefined);
  return { transport, lines };
}

/** A hello-ack a stand-in core sends. */
const ACK = {
  v: 1,
  type: "hello-ack",
  lockstep: false,
  genesis: `0x${"00".repeat(32)}`,
  start: "1",
  cursor: null,
  refused: null,
  configHash: `0x${"c1".repeat(32)}`,
};

/** The unhandled rejections seen until `stop()` (UmbraDB leaves none). */
function unhandledRejections(): { readonly unhandled: unknown[]; stop(): void } {
  const unhandled: unknown[] = [];
  const listener = (reason: unknown): void => {
    unhandled.push(reason);
  };
  process.on("unhandledRejection", listener);
  return { unhandled, stop: () => process.off("unhandledRejection", listener) };
}

/** A channel over a test-owned end whose `member` cannot be read: its getter throws. */
function unreadableMember(member: "send" | "onMessage" | "onClose" | "close"): () => unknown {
  return () => {
    const [end] = channelPair();
    const channel: Record<string, unknown> = {
      send: (message: string) => end.send(message),
      onMessage: (listener: (message: string) => void) => end.onMessage(listener),
      onClose: (listener: () => void) => end.onClose(listener),
      close: () => end.close(),
    };
    Object.defineProperty(channel, member, {
      get() {
        throw new Error(`host ${member} getter`);
      },
    });
    return channel;
  };
}

/**
 * Values a host's `connect()` may resolve with whose channel members cannot be read: each member's getter
 * that throws, and a proxy whose trap throws for them (not for `then`, which the promise reads first).
 */
const UNREADABLE_CHANNELS: readonly (readonly [string, () => unknown])[] = [
  ["a channel whose send getter throws", unreadableMember("send")],
  ["a channel whose onMessage getter throws", unreadableMember("onMessage")],
  ["a channel whose onClose getter throws", unreadableMember("onClose")],
  ["a channel whose close getter throws", unreadableMember("close")],
  [
    "a proxy whose get trap throws for a channel's members",
    () =>
      new Proxy(channelPair()[0], {
        get(target, key, receiver) {
          if (key === "then") return Reflect.get(target, key, receiver);
          throw new Error("host get trap");
        },
      }),
  ],
];

/**
 * One connection of the channel carrier over `connect`, its events recorded: `running`, the value resolved while the
 * transport wants it; `stopped`, after the transport's signal aborted; `closed`, after the connection's own close.
 * What its events and the unhandled rejections were 50 ms after.
 */
async function dialed(connect: () => Promise<unknown>, when: "running" | "stopped" | "closed"): Promise<{ readonly seen: string[]; readonly unhandled: unknown[] }> {
  const seen: string[] = [];
  const { unhandled, stop } = unhandledRejections();
  const controller = new AbortController();
  let release!: () => void;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  const connection = channelCarrier(async () => {
    await released;
    return (await connect()) as PrivateLinkChannel;
  }).dial(
    {
      opened: () => seen.push("opened"),
      received: () => undefined,
      failed: (why) => seen.push(`failed ${why}`),
      ended: (code) => seen.push(`ended ${code}`),
    },
    controller.signal,
  );
  if (when === "stopped") controller.abort();
  if (when === "closed") connection.close(1000, "closed");
  release();
  await new Promise((resolve) => setTimeout(resolve, 50));
  stop();
  return { seen, unhandled };
}

describe("the channel carrier at the transport", () => {
  it("a connect() that resolves with no channel, or throws, is a lost connection; the next one connects", async () => {
    const cores: RawPeer[] = [];
    let calls = 0;
    const { transport, lines } = transportOver(
      channelCarrier((() => {
        calls += 1;
        if (calls === 1) return Promise.resolve(null as unknown as PrivateLinkChannel);
        if (calls === 2) return Promise.resolve({ send: () => undefined } as unknown as PrivateLinkChannel);
        if (calls === 3) throw new TypeError("not a promise at all");
        const [privateEnd, coreEnd] = channelPair();
        cores.push(rawPeer(coreEnd));
        return Promise.resolve(privateEnd);
      }) as (signal: AbortSignal) => Promise<PrivateLinkChannel>),
    );
    try {
      await until(() => cores.length === 1, "the fourth connect()", 15_000);
      (cores[0] as RawPeer).send(ACK);
      await until(() => transport.state === "connected", "connected", 10_000);
      expect(lines.filter((line) => line.includes("connect()"))).toEqual([
        "transport: the host's connect() resolved with no channel; connecting again in 1000 ms (attempt 1)",
        "transport: the host's connect() resolved with no channel; connecting again in 1000 ms (attempt 2)",
        "transport: the host's connect() rejected (TypeError); connecting again in 1000 ms (attempt 3)",
      ]);
      expect(lines).toContain("transport: connected to the core over a channel");
    } finally {
      await transport.close();
    }
  }, 30_000);

  it("a value that is no channel, resolved after the stop, is left alone; a channel is closed", async () => {
    const pending: ((value: unknown) => void)[] = [];
    const { transport } = transportOver(
      channelCarrier(() => new Promise<PrivateLinkChannel>((resolve) => pending.push(resolve as (value: unknown) => void))),
    );
    await until(() => pending.length === 1, "the connect()");
    await transport.close();
    (pending[0] as (value: unknown) => void)("no channel");
    await new Promise((done) => setTimeout(done, 50));
    expect(transport.state).toBe("closed");
  }, 30_000);

  it.each(UNREADABLE_CHANNELS)(
    "a connect() that resolves with %s resolved with no channel: the connection failed, then ended (1006), and no rejection is unhandled",
    async (_name, channelOf) => {
      const { seen, unhandled } = await dialed(async () => channelOf(), "running");
      expect([seen, unhandled]).toEqual([["failed the host's connect() resolved with no channel", "ended 1006"], []]);
    },
  );

  it.each(UNREADABLE_CHANNELS)(
    "%s, resolved after the stop or after the connection's own close, is left alone: no event, and no rejection is unhandled",
    async (_name, channelOf) => {
      for (const when of ["stopped", "closed"] as const) {
        const { seen, unhandled } = await dialed(async () => channelOf(), when);
        expect([when, seen, unhandled]).toEqual([when, [], []]);
      }
    },
  );

  it("a connect() whose channel's members cannot be read is a lost connection, logged as no channel; the next one connects, and nothing is unhandled", async () => {
    // A getter that throws, then a proxy's trap that throws, then a channel.
    const unreadable = [UNREADABLE_CHANNELS[0], UNREADABLE_CHANNELS[4]].map((found) => (found as (typeof UNREADABLE_CHANNELS)[number])[1]);
    const cores: RawPeer[] = [];
    let calls = 0;
    const { unhandled, stop } = unhandledRejections();
    const { transport, lines } = transportOver(
      channelCarrier(async () => {
        calls += 1;
        const channelOf = unreadable[calls - 1];
        if (channelOf !== undefined) return channelOf() as PrivateLinkChannel;
        const [privateEnd, coreEnd] = channelPair();
        cores.push(rawPeer(coreEnd));
        return privateEnd;
      }),
    );
    try {
      await until(() => cores.length === 1, "the third connect()", 15_000);
      (cores[0] as RawPeer).send(ACK);
      await until(() => transport.state === "connected", "connected", 10_000);
      expect(lines.filter((line) => line.includes("connect()"))).toEqual([
        "transport: the host's connect() resolved with no channel; connecting again in 1000 ms (attempt 1)",
        "transport: the host's connect() resolved with no channel; connecting again in 1000 ms (attempt 2)",
      ]);
      expect(unhandled).toEqual([]);
    } finally {
      stop();
      await transport.close();
    }
  }, 30_000);

  it("a connect() that rejects with an error that cannot be read is a lost connection, logged by its type; the next one connects, and nothing is unhandled", async () => {
    const errors: readonly unknown[] = [
      // A name whose getter throws.
      Object.defineProperty(new Error("x"), "name", {
        get() {
          throw new Error("host name getter");
        },
      }),
      // A name that is no text (a symbol: a template literal throws on it).
      Object.defineProperty(new Error("x"), "name", { value: Symbol("name") }),
      // An UmbraError whose code's getter throws.
      Object.create(UmbraError.prototype, {
        code: {
          get() {
            throw new Error("host code getter");
          },
        },
      }),
      // A proxy whose prototype cannot be read (`instanceof` throws), and a revoked one.
      new Proxy(new Error("x"), {
        getPrototypeOf() {
          throw new Error("host getPrototypeOf trap");
        },
      }),
      (() => {
        const { proxy, revoke } = Proxy.revocable(new Error("x"), {});
        revoke();
        return proxy;
      })(),
    ];
    const cores: RawPeer[] = [];
    let calls = 0;
    const { unhandled, stop } = unhandledRejections();
    const { transport, lines } = transportOver(
      channelCarrier(async () => {
        calls += 1;
        if (calls <= errors.length) throw errors[calls - 1];
        const [privateEnd, coreEnd] = channelPair();
        cores.push(rawPeer(coreEnd));
        return privateEnd;
      }),
    );
    try {
      await until(() => cores.length === 1, "the sixth connect()", 20_000);
      (cores[0] as RawPeer).send(ACK);
      await until(() => transport.state === "connected", "connected", 10_000);
      expect(lines.filter((line) => line.includes("connect()"))).toEqual(
        [1, 2, 3, 4, 5].map((attempt) => `transport: the host's connect() rejected (object); connecting again in 1000 ms (attempt ${attempt})`),
      );
      expect(unhandled).toEqual([]);
    } finally {
      stop();
      await transport.close();
    }
  }, 30_000);

  it("a core message over the private side's limit closes its channel too-large (1009), and it connects again", async () => {
    const cores: RawPeer[] = [];
    const { transport, lines } = transportOver(
      channelCarrier(
        async () => {
          const [privateEnd, coreEnd] = channelPair();
          cores.push(rawPeer(coreEnd));
          return privateEnd;
        },
        { limits: { maxMessageBytes: 400 } },
      ),
    );
    try {
      await until(() => cores.length === 1, "the first channel");
      const core = cores[0] as RawPeer;
      core.send({ ...ACK, pad: "x".repeat(400) });
      expect(await core.ended).toEqual({ code: 1009, reason: "too-large" });
      await until(() => cores.length === 2, "a second channel", 10_000);
      expect(lines.some((line) => line.startsWith("transport: too-large (1009 too-large); connecting again in "))).toBe(true);
    } finally {
      await transport.close();
    }
  }, 30_000);

  it("on a controlled clock, a core that stops answering pings is left at the second interval (no-pong), and it connects again", async () => {
    const clock = controlledTimers();
    const cores: RawPeer[] = [];
    const { transport, lines } = transportOver(
      channelCarrier(
        async () => {
          const [privateEnd, coreEnd] = channelPair();
          cores.push(rawPeer(coreEnd));
          return privateEnd;
        },
        { timers: clock.timers },
      ),
    );
    try {
      await until(() => cores.length === 1, "the first channel");
      const core = cores[0] as RawPeer;
      core.answersPings = false;
      core.send(ACK);
      await until(() => transport.state === "connected", "connected");
      await tick(clock, PING_INTERVAL_MS);
      expect(core.pings).toBe(1);
      expect(core.end).toBeNull();
      await tick(clock, PING_INTERVAL_MS);
      expect(await core.ended).toEqual({ code: 1008, reason: "no-pong" });
      await until(() => cores.length === 2, "a second channel", 10_000);
      expect(lines.some((line) => line.startsWith("transport: the core did not answer a ping (1008 no-pong); connecting again in "))).toBe(true);
    } finally {
      await transport.close();
    }
  }, 30_000);
});

/**
 * The private side's run over a channel carrier with `seams`: its first channel holds more than
 * `MAX_BUFFERED_BYTES` undelivered, its second none. Every problem, none when the first was closed `too-slow` before
 * the `hello` went out and the transport connected again.
 */
async function privateSlowProblems(seams: Parameters<typeof channelCarrier>[1] = {}): Promise<string[]> {
  const cores: RawPeer[] = [];
  const { transport, lines } = transportOver(
    channelCarrier(async () => {
      const held = cores.length === 0 ? MAX_BUFFERED_BYTES + 1 : 0;
      const [privateEnd, coreEnd] = channelPair({ bufferedAmount: () => held });
      cores.push(rawPeer(coreEnd));
      return privateEnd;
    }, seams),
  );
  const problems: string[] = [];
  try {
    await until(() => cores.length === 1, "the first channel");
    const first = cores[0] as RawPeer;
    const end = await Promise.race([first.ended, new Promise<null>((resolve) => setTimeout(() => resolve(null), 2_000))]);
    if (JSON.stringify(end) !== JSON.stringify({ code: 1008, reason: "too-slow" })) problems.push(`the slow channel ended ${JSON.stringify(end)}, not 1008 too-slow`);
    if (first.received.length > 0) problems.push(`the slow channel carried ${first.received.length} message(s)`);
    await until(() => cores.length === 2, "a second channel", 5_000).catch(() => problems.push("no second channel was opened"));
    if (!lines.some((line) => line.startsWith("transport: too-slow (1008 too-slow); connecting again in "))) problems.push("too-slow was not logged");
  } finally {
    await transport.close();
  }
  return problems;
}

describe("on the private side and on a queued channel", () => {
  it("the private side: a channel over MAX_BUFFERED_BYTES is closed too-slow at its hello, and the transport connects again", async () => {
    expect(await privateSlowProblems()).toEqual([]);
  }, 30_000);

  it("negative control (committed): the private side's limit raised beyond any amount: the slow channel carries the hello and stays, and the oracle fails", async () => {
    const problems = await privateSlowProblems({ limits: { maxBufferedBytes: Number.MAX_SAFE_INTEGER } });
    expect(problems).toContain("the slow channel ended null, not 1008 too-slow");
    expect(problems).toContain("the slow channel carried 1 message(s)");
  }, 30_000);

  /** One queued channel's run on a core link not started, its limit `maxBufferedBytes` (the default unless given). */
  async function queuedSlowProblems(maxBufferedBytes?: number): Promise<string[]> {
    const clock = controlledTimers();
    const lines: string[] = [];
    const link = new CoreChannels({
      log: (line) => lines.push(line),
      timers: clock.timers,
      ...(maxBufferedBytes === undefined ? {} : { limits: { maxBufferedBytes } }),
    });
    const problems: string[] = [];
    // One at its ping, one at its answer to the peer's ping.
    const [pingedEnd, pingedPeerEnd] = channelPair({ bufferedAmount: () => MAX_BUFFERED_BYTES + 1 });
    const [answeringEnd, answeringPeerEnd] = channelPair({ bufferedAmount: () => MAX_BUFFERED_BYTES + 1 });
    link.accept(pingedEnd);
    link.accept(answeringEnd);
    const pinged = rawPeer(pingedPeerEnd);
    const answering = rawPeer(answeringPeerEnd);
    pinged.send(peerHello("queued-pinged"));
    answering.send(peerHello("queued-answering"));
    await new Promise((resolve) => setTimeout(resolve, 60));
    answering.ping();
    await new Promise((resolve) => setTimeout(resolve, 60));
    await tick(clock, PING_INTERVAL_MS);
    for (const [name, peer] of [["at its answer to a ping", answering], ["at its ping", pinged]] as const) {
      if (JSON.stringify(peer.end) !== JSON.stringify({ code: 1008, reason: "too-slow" })) problems.push(`${name}: ended ${JSON.stringify(peer.end)}, not 1008 too-slow`);
    }
    if (lines.filter((line) => line === "private link: closed a queued channel: too-slow").length !== 2) problems.push(`logged ${JSON.stringify(lines)}`);
    await link.close();
    return problems;
  }

  it("a queued channel over MAX_BUFFERED_BYTES is closed too-slow at its ping, and at its answer to the peer's ping", async () => {
    expect(await queuedSlowProblems()).toEqual([]);
  }, 30_000);

  it("negative control (committed): the queue's limit raised beyond any amount: both stay queued, and the oracle fails", async () => {
    const problems = await queuedSlowProblems(Number.MAX_SAFE_INTEGER);
    expect(problems.some((problem) => problem.startsWith("at its ping: ended null"))).toBe(true);
    expect(problems.some((problem) => problem.startsWith("at its answer to a ping: ended null"))).toBe(true);
  }, 30_000);
});
