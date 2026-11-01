import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { UmbraError } from "../../src/db/errors.js";
import { channelCarrier } from "../../src/private/private-channels.js";
import { type CarrierConnection, type CarrierEvents, type PrivateCarrier, PrivateTransport } from "../../src/private/private-transport.js";
import { defineModule, type ModuleDeclaration } from "../../src/modules/declaration.js";
import { PING_INTERVAL_MS } from "../../src/private/core-transport.js";
import { startUmbraDB } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS } from "../private/backends.js";
import { channelPair, controlledTimers, type ControlledTimers, peerHello, rawPeer, type RawPeer, type TestEnd, until } from "./channel-fixtures.js";
import { channelCore, channelPrivate, linkTo, type Logged } from "./channel-processes.js";
import { cursorReaches, libraryData } from "./library-fixtures.js";

/**
 * The channel link's queue and its ends `[CI]`, on PostgreSQL 18 (Docker) and PGlite 0.5.10 [LM-6, N9]:
 * - **L38** `[NEG]`: before the link starts (a module's `on-start-db` held), 64 channels queue and answer pings and the
 *   65th closes 1013 `try-again`; a queued channel whose first message is not a `hello` closes `hello-first`, one sending
 *   a second message `hello-pending`, one whose `hello` is over 64 KiB `too-large`; a queued peer that sends its `hello`
 *   and answers pings through three intervals (a controlled clock) stays queued and is activated (`hello-ack`) when the
 *   link starts; one that stops answering closes `no-pong` and frees its place; at a class-B refusal (the held
 *   `on-start-db` throws) every queued channel closes `private-link-not-accepting`. Negative control: the queue's limit
 *   lifted (the channel link's seam), the 65th is queued, and the oracle fails.
 * - **L39** `[NEG]`: `accept()` on a process not accepting channels (no channel request), after a refusal and after
 *   `stop()`: the channel closes `private-link-not-accepting`, a line is logged, nothing throws (a carrier that throws
 *   included). Negative control: the same oracle on a process that accepts channels fails.
 * - **L40**: a `connect()` that rejects is retried with the back-off (1 s, doubling up to `backoffCeilingMs`), each
 *   logged, until one resolves; the private process then follows.
 * - **L41** `[NEG]`: a `connect()` that never settles does not delay `stop()`; a channel it resolves after `stop()` is
 *   closed; a rejection after it is not unhandled; no retry starts. Negative control: a carrier that waits for its
 *   `connect()` at the stop and ignores the signal (the fault) fails the same oracle, at the transport.
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

/** What one L38 run saw. */
interface QueueRun {
  readonly sixtyFifth: unknown;
  readonly faults: Readonly<Record<string, unknown>>;
  readonly healthy: { readonly pings: number; readonly endedWhileQueued: unknown; readonly ack: unknown };
  readonly dead: unknown;
  readonly afterDead: unknown;
  readonly queuedOpen: number;
  readonly activated: number;
}

/** One L38 run on `backend` with the queue's limit `queueMax` (the control's seam), or the link's own. */
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
    // Their messages, once all 64 wait.
    healthy.peer.send(peerHello("q-healthy"));
    dead.peer.send(peerHello("q-dead"));
    dead.peer.answersPings = false;
    faults.first.peer.send({ v: 1, type: "read", id: "1", statements: [] });
    faults.pending.peer.send(peerHello("q-pending"));
    faults.pending.peer.send({ v: 1, type: "read", id: "1", statements: [] });
    faults.large.peer.send({ ...peerHello("q-large"), version: "x".repeat(64 * 1024) });
    others.forEach((other, index) => other.peer.send(peerHello(`q-${index}`)));
    await until(() => Object.values(faults).every((one) => one.peer.end !== null), "the faults' closes", 10_000).catch(() => undefined);
    // Three intervals: the dead one is ended at its second, its place freed for another.
    await tick(clock, PING_INTERVAL_MS);
    await tick(clock, PING_INTERVAL_MS);
    const deadEnd = dead.peer.end;
    const late = accepted(core);
    late.peer.send(peerHello("q-late"));
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

/** The L38 oracle: every problem of `run`, none when it holds. */
function queueProblems(run: QueueRun): string[] {
  const problems: string[] = [];
  const json = (value: unknown) => JSON.stringify(value);
  if (json(run.sixtyFifth) !== json({ code: 1013, reason: "try-again" })) problems.push(`the 65th: ${json(run.sixtyFifth)}`);
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

describe.each(PRIVATE_BACKENDS)("the channel link's queue and ends on $name (LM-6)", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("L38: 64 channels queue and answer pings, the 65th try-again; hello-first, hello-pending, too-large; a healthy peer stays and is activated; a dead one no-pong", async () => {
    expect(queueProblems(await queueRun(backend))).toEqual([]);
  }, 120_000);

  it("L38 negative control (committed): with the queue's limit lifted, the 65th is queued, and the oracle fails", async () => {
    const problems = queueProblems(await queueRun(backend, Number.POSITIVE_INFINITY));
    expect(problems.some((problem) => problem.startsWith("the 65th:"))).toBe(true);
  }, 120_000);

  it("L38: at a class-B refusal every queued channel closes private-link-not-accepting; L39: one accepted after it too", async () => {
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

  it("L39: accept() on a process not accepting channels, or after stop(): closed private-link-not-accepting, a line logged, nothing thrown", async () => {
    const lines: string[] = [];
    const plain = startUmbraDB({
      config: { data: libraryData((await backend.database("public")).setting) },
      source: new InMemoryBlockSource({ head: 2n }),
      log: (line) => lines.push(line),
    });
    try {
      await plain.started;
      const [coreEnd, peerEnd] = channelPair();
      const peer = rawPeer(peerEnd);
      expect(() => plain.privateLink.accept(coreEnd)).not.toThrow();
      expect(await peer.ended).toEqual({ code: 1008, reason: "private-link-not-accepting" });
      expect(lines).toContain("private link: a channel was closed (private-link-not-accepting): this process accepts no channels");
      // A carrier that throws at every call: nothing reaches the host.
      const throwing = {
        send: () => {
          throw new Error("send");
        },
        onMessage: () => {
          throw new Error("onMessage");
        },
        onClose: () => {
          throw new Error("onClose");
        },
        close: () => {
          throw new Error("close");
        },
      } satisfies PrivateLinkChannel;
      expect(() => plain.privateLink.accept(throwing)).not.toThrow();
    } finally {
      await plain.stop();
    }
    const core = channelCore(await backend.database("public"), { head: 2n });
    await core.handle.started;
    const open = accepted(core);
    open.peer.send(peerHello("open-at-stop"));
    await open.peer.next("hello-ack");
    await core.handle.stop();
    // The stop closed the open session as a socket link's does.
    expect(await open.peer.ended).toEqual({ code: 1001, reason: "the core is stopping" });
    const after = accepted(core);
    expect(await after.peer.ended).toEqual({ code: 1008, reason: "private-link-not-accepting" });
    expect(core.lines).toContain("private link: a channel was closed (private-link-not-accepting): the process is stopping");
  }, 120_000);

  it("L39 negative control (committed): the same oracle on a process that accepts channels fails", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n });
    try {
      await core.handle.started;
      const one = accepted(core);
      one.peer.send(peerHello("accepted"));
      await one.peer.next("hello-ack");
      expect(one.peer.end).toBeNull();
      expect(core.lines.some((line) => line.includes("private-link-not-accepting"))).toBe(false);
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("L40: a rejecting connect() is retried with the back-off, each attempt logged, until one resolves; the private process then follows", async () => {
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

  it("L41: a connect() that never settles does not delay stop(); a channel it resolves after stop() is closed; no retry starts", async () => {
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

  it("L41: a rejection of connect() after stop() is consumed, not unhandled, and starts no retry", async () => {
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

/** The L41 oracle at the transport: a stop with a `connect()` pending, then a channel resolved after it. */
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

describe("L41 at the transport: the stop and a pending connect() (LM-6)", () => {
  it("the channel carrier: the stop does not wait, the late channel is closed, no retry", async () => {
    expect(await stopProblems((connect) => channelCarrier(connect))).toEqual([]);
  }, 30_000);

  it("negative control (committed): a carrier that waits for connect() at the stop and ignores the signal fails the oracle", async () => {
    const problems = await stopProblems(waitingCarrier);
    expect(problems).toContain("the stop waited for connect()");
    expect(problems.some((problem) => problem.startsWith("the channel resolved after the stop was closed 0"))).toBe(true);
  }, 30_000);
});
