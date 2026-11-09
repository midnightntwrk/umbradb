import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { MAX_BUFFERED_BYTES, MAX_MESSAGE_BYTES, PING_INTERVAL_MS } from "../../src/private/core-transport.js";
import { ENVELOPE_BYTES, type LinkTimers } from "../../src/library/channels.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, type TestDatabase, TRANSPORT_LOGIN } from "../private/backends.js";
import { channelPair, controlledTimers, peerHello, rawPeer, type RawPeer, type TestEndOptions, until } from "./channel-fixtures.js";
import { channelCore, channelPrivate, linkTo, type Logged } from "./channel-processes.js";
import { cursorReaches } from "./library-fixtures.js";
import { UmbraError } from "../../src/db/errors.js";
import { CoreChannels } from "../../src/private/core-channels.js";
import { channelCarrier } from "../../src/private/private-channels.js";
import { PrivateTransport } from "../../src/private/private-transport.js";

/**
 * The private link over channels between library processes `[CI]`, on PostgreSQL 18 (Docker) and PGlite 0.5.10
 *:
 * - A public process with `publicSide: { channels: true }` and a private one with `privateSide: { connect }`,
 *   over real `MessageChannel`s (`node:worker_threads`, through `messagePortChannel`): the private process follows with
 *   a PGlite public database (the core's own, read through the link) or none (PostgreSQL: read through the link), in
 *   lockstep when listed (the core waits at S, cursor null, until the instance connects).
 * - (PostgreSQL): the link's reads over channels run on the reader login — `current_user` in a read is
 *   `core.transportReader`'s.
 * - `[FAULT][NEG]`: on a controlled clock, a peer that stops answering pings is ended `no-pong` at the second
 *   interval, not before its first ping is outstanding; its instance id is free: a reconnect with it is answered
 *   `hello-ack` with `refused: null`. The committed negative control is the same run with the endpoints' interval never
 *   falling due (no liveness): the dead peer stays connected, its id held (the reconnect refused `duplicate-instance`),
 *   and the oracle fails.
 * - `[NEG]`: a channel whose `bufferedAmount` is above `MAX_BUFFERED_BYTES` is closed 1008 `too-slow` at the
 *   core's next send; at the limit it is not. Negative control: the check's limit raised beyond any amount (the link's
 *   limit seam, channels only): the oracle fails.
 * - `[NEG]`: a message above `MAX_MESSAGE_BYTES` (UTF-8 bytes, beside the envelope's own) closes the channel
 *   1009 `too-large`. Negative control: the channel link's limit doubled: the message is read, and the oracle fails.
 * - `report-hash-mismatch` over a channel (a test-owned relay rewrites the instance's report) halts the private
 *   process; `report-unchecked` (PostgreSQL: the reader login loses its read of the public tables) makes it connect
 *   again over a new channel, which `connect()` opens; the same at the link itself, on any backend (the core's link
 *   over channels and a private transport over `connect`, the core's read of the report failing).
 * - UmbraDB's own close of a channel frees its instance id at once, when the carrier never tells a close.
 */

/** How long a process may take to follow on a loaded machine. */
const FOLLOWS_MS = 300_000;

/** A `report` envelope's hash rewritten (the last byte changed): what a relay that corrupts reports sends. */
function corruptReport(text: string): string {
  const envelope = JSON.parse(text) as { kind: string; message?: { type?: string; hash?: string } };
  if (envelope.kind !== "message" || envelope.message?.type !== "report" || typeof envelope.message.hash !== "string") return text;
  const hash = envelope.message.hash;
  envelope.message.hash = `${hash.slice(0, -2)}${hash.endsWith("00") ? "01" : "00"}`;
  return JSON.stringify(envelope);
}

/** A raw peer on a new test-owned channel of `core` (`options` the core's end's), past its `hello` as `instance`. */
async function greeted(core: Logged, instance: string, options: TestEndOptions = {}): Promise<RawPeer> {
  const [coreEnd, peerEnd] = channelPair(options);
  core.handle.privateLink.accept(coreEnd);
  const peer = rawPeer(peerEnd);
  peer.send(peerHello(instance));
  await peer.next("hello-ack");
  return peer;
}

describe.each(PRIVATE_BACKENDS)("the private link over channels between library processes on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("publicSide { channels } and privateSide { connect } over MessageChannels: the private process follows in lockstep, reading through the core", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    const core = channelCore(publicDb, { head: 4n, extra: { lockstepInstances: ["ch-lockstep"] } });
    try {
      await core.handle.started;
      // The core waits at S for the instance it lists: its lockstep is real.
      await until(() => core.handle.status().conditions.some((one) => one.code === "waiting-for-lockstep"), "waiting-for-lockstep", 60_000);
      expect(core.handle.status().cursor).toBeNull();
      expect(core.lines).toContain("private link: accepting channels");
      expect(core.handle.status().listening.privateLink).toBeNull();
      const link = linkTo(core.handle);
      const instance = channelPrivate(privateDb, publicDb, { instanceId: "ch-lockstep", connect: link.connect });
      try {
        await instance.handle.started;
        await cursorReaches(core.handle, 4n, FOLLOWS_MS);
        await cursorReaches(instance.handle, 4n, FOLLOWS_MS);
        expect(link.opened).toBe(1);
        expect(instance.lines).toContain("transport: connected to the core over a channel");
        expect(core.lines).toContain("transport: instance ch-lockstep connected at 0");
        // The private process read its public data through the core: it has no public database of its own to read.
        expect(instance.handle.status().listening.privateLink).toBeNull();
      } finally {
        await instance.handle.stop();
      }
    } finally {
      await core.handle.stop();
    }
  }, FOLLOWS_MS * 2);

  it("report-hash-mismatch over a channel halts the private process; the core logs the mismatch and holds the instance", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    const core = channelCore(publicDb, { head: 3n, extra: { lockstepInstances: ["ch-mismatch"] } });
    try {
      await core.handle.started;
      const link = linkTo(core.handle, corruptReport);
      const instance = channelPrivate(privateDb, publicDb, { instanceId: "ch-mismatch", connect: link.connect, extra: { backoffCeilingMs: 1_000 } });
      try {
        await until(() => instance.handle.status().state === "halted", "the halt", FOLLOWS_MS);
        expect(instance.handle.status().reason?.code).toBe("report-hash-mismatch");
        expect(instance.handle.status().cursor).toBe(1n);
        expect(instance.lines.some((line) => line.startsWith("transport: the core refused instance ch-mismatch for good: report-hash-mismatch"))).toBe(true);
        const truth = `0x${Buffer.from(inMemoryBlock(1n).hash).toString("hex")}`;
        expect(core.lines.some((line) => line.startsWith("transport: instance ch-mismatch reported height 1 with hash ") && line.endsWith(`the public block there has hash ${truth}: report-hash-mismatch`))).toBe(true);
        // Refused for good: no new channel is asked for.
        expect(link.opened).toBe(1);
        expect(core.handle.status().cursor).toBe(1n);
      } finally {
        await instance.handle.stop();
      }
    } finally {
      await core.handle.stop();
    }
  }, FOLLOWS_MS * 2);

  it("UmbraDB's own close frees the instance id at once, on a carrier that never tells a close", async () => {
    const publicDb = await backend.database("public");
    const core = channelCore(publicDb, { head: 2n });
    try {
      await core.handle.started;
      const first = await greeted(core, "held-id", { silent: true });
      // A message that fails its schema: the core closes the channel itself.
      first.send({ v: 1, type: "read", id: "1", statements: [], extra: true });
      expect(await first.ended).toEqual({ code: 1008, reason: "invalid-message" });
      // The id is free at once: a new channel's hello with it is answered, not refused duplicate-instance.
      const second = await greeted(core, "held-id");
      expect(core.lines).toContain("transport: instance held-id disconnected");
      second.send({ v: 1, type: "read", id: "1", statements: [] });
      expect((await second.next("read-result")).id).toBe("1");
    } finally {
      await core.handle.stop();
    }
  }, 120_000);
});

/** One run on `db`: a peer that stops answering pings, on the endpoints' clock `clock`. */
async function livenessRun(db: TestDatabase, clock: { readonly timers: LinkTimers; advance(ms: number): void }) {
  const core = channelCore(db, { head: 2n, seams: { timers: clock.timers } });
  try {
    await core.handle.started;
    const peer = await greeted(core, "dead-peer");
    peer.answersPings = false;
    const tick = async (ms: number) => {
      clock.advance(ms);
      // What the core sent on the tick reaches the peer on a later turn.
      await new Promise((resolve) => setTimeout(resolve, 50));
    };
    await tick(PING_INTERVAL_MS - 1);
    const beforeFirst = { pings: peer.pings, end: peer.end };
    await tick(1);
    const atFirst = { pings: peer.pings, end: peer.end };
    await tick(PING_INTERVAL_MS);
    const atSecond = { pings: peer.pings, end: peer.end };
    // A reconnect with the same id: its hello-ack, whose `refused` is null only when the id was freed (a connected id
    // is refused duplicate-instance).
    const [coreEnd, peerEnd] = channelPair();
    core.handle.privateLink.accept(coreEnd);
    const second = rawPeer(peerEnd);
    second.ended.catch(() => undefined);
    second.send(peerHello("dead-peer"));
    const ack = await second.next("hello-ack").catch(() => null);
    const again = ack === null ? null : { refused: "refused" in ack ? ack.refused : "absent" };
    return { beforeFirst, atFirst, atSecond, again, lines: [...core.lines] };
  } finally {
    await core.handle.stop();
  }
}

/** The oracle: every problem of `run`, none when it holds. */
function livenessProblems(run: Awaited<ReturnType<typeof livenessRun>>): string[] {
  const problems: string[] = [];
  if (run.beforeFirst.pings !== 0 || run.beforeFirst.end !== null) problems.push(`before the first interval: ${JSON.stringify(run.beforeFirst)}`);
  if (run.atFirst.pings !== 1 || run.atFirst.end !== null) problems.push(`at the first interval it was not pinged and kept: ${JSON.stringify(run.atFirst)}`);
  if (JSON.stringify(run.atSecond.end) !== JSON.stringify({ code: 1008, reason: "no-pong" })) {
    problems.push(`at the second interval it was not ended no-pong: ${JSON.stringify(run.atSecond)}`);
  }
  if (!run.lines.includes("transport: closed the connection of dead-peer: no-pong")) problems.push("no-pong was not logged");
  if (!run.lines.includes("transport: instance dead-peer disconnected")) problems.push("its id was not freed");
  if (run.again === null) problems.push("a reconnect with its id was not answered");
  else if (run.again.refused !== null) problems.push(`a reconnect with its id was refused ${String(run.again.refused)}`);
  return problems;
}

/** A clock whose intervals never fall due: the endpoints never ping (the negative control's fault). */
const STOPPED_CLOCK = { timers: { every: () => () => undefined } satisfies LinkTimers, advance: () => undefined };

describe.each(PRIVATE_BACKENDS)("the channel link's own rules on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("on a controlled clock, a peer that stops answering pings is ended no-pong at the second interval; its id is free; a reconnect is answered", async () => {
    expect(livenessProblems(await livenessRun(await backend.database("public"), controlledTimers()))).toEqual([]);
  }, 120_000);

  it("negative control (committed): with no interval falling due (no liveness), the dead peer stays, and the oracle fails", async () => {
    const problems = livenessProblems(await livenessRun(await backend.database("public"), STOPPED_CLOCK));
    expect(problems.some((problem) => problem.startsWith("at the first interval it was not pinged"))).toBe(true);
    expect(problems.some((problem) => problem.startsWith("at the second interval it was not ended no-pong"))).toBe(true);
    // The dead peer still holds its id: the reconnect is answered, refused duplicate-instance.
    expect(problems).toContain("a reconnect with its id was refused duplicate-instance");
  }, 120_000);

  it("a bufferedAmount above MAX_BUFFERED_BYTES closes the channel too-slow at the core's next send; at the limit it does not", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n });
    try {
      await core.handle.started;
      const [atEnd, atPeer] = channelPair({ bufferedAmount: () => MAX_BUFFERED_BYTES });
      core.handle.privateLink.accept(atEnd);
      const atLimit = rawPeer(atPeer);
      atLimit.send(peerHello("at-limit"));
      await atLimit.next("hello-ack");
      const [overEnd, overPeer] = channelPair({ bufferedAmount: () => MAX_BUFFERED_BYTES + 1 });
      core.handle.privateLink.accept(overEnd);
      const over = rawPeer(overPeer);
      over.send(peerHello("over-limit"));
      expect(await over.ended).toEqual({ code: 1008, reason: "too-slow" });
      expect(over.received).toEqual([]);
      expect(core.lines).toContain("transport: closed the connection of over-limit: too-slow");
      expect(atLimit.end).toBeNull();
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("negative control (committed): the channel link's too-slow limit raised beyond any amount: the slow channel stays, and the oracle fails", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n, seams: { limits: { maxBufferedBytes: Number.MAX_SAFE_INTEGER } } });
    try {
      await core.handle.started;
      const [overEnd, overPeer] = channelPair({ bufferedAmount: () => MAX_BUFFERED_BYTES + 1 });
      core.handle.privateLink.accept(overEnd);
      const over = rawPeer(overPeer);
      over.send(peerHello("over-limit"));
      await over.next("hello-ack");
      expect(over.end).toBeNull();
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("a channel whose bufferedAmount getter throws is a carrier that ended: the core's answer to its hello throws nothing, the channel ends, its id is free, the core follows on", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n });
    try {
      await core.handle.started;
      const [coreEnd, peerEnd] = channelPair();
      const unreadable = Object.defineProperty(
        {
          send: (message: string) => coreEnd.send(message),
          onMessage: (listener: (message: string) => void) => coreEnd.onMessage(listener),
          onClose: (listener: () => void) => coreEnd.onClose(listener),
          close: () => coreEnd.close(),
        },
        "bufferedAmount",
        {
          get: () => {
            throw new Error("host bufferedAmount getter");
          },
        },
      );
      core.handle.privateLink.accept(unreadable);
      const peer = rawPeer(peerEnd);
      peer.send(peerHello("unreadable-amount"));
      // The carrier failed at the core's first send, its hello-ack: no close envelope, the carrier closed.
      expect(await peer.ended).toEqual({ carrier: true });
      expect([peer.received, coreEnd.closes, coreEnd.listeners]).toEqual([[], 1, { message: 0, close: 0 }]);
      // Its instance id is free: a reconnect with it is answered, refused by nothing.
      const [healthyEnd, healthyPeerEnd] = channelPair();
      core.handle.privateLink.accept(healthyEnd);
      const again = rawPeer(healthyPeerEnd);
      again.send(peerHello("unreadable-amount"));
      expect((await again.next("hello-ack")).refused).toBeNull();
      await cursorReaches(core.handle, 2n);
      expect(core.handle.status().state).toBe("following");
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("a message above MAX_MESSAGE_BYTES in UTF-8 bytes closes the channel too-large (1009)", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n });
    try {
      await core.handle.started;
      const peer = await greeted(core, "large");
      // Two bytes each: one character fewer than the limit in characters, past it in bytes.
      const prefix = '{"link":1,"kind":"message","message":{"v":1,"type":"read","id":"1","statements":[{"sql":"';
      const suffix = '","params":[]}]}}';
      const room = MAX_MESSAGE_BYTES + ENVELOPE_BYTES - prefix.length - suffix.length;
      peer.sendRaw(`${prefix}${"é".repeat(Math.floor(room / 2) + 1)}${suffix}`);
      expect(await peer.ended).toEqual({ code: 1009, reason: "too-large" });
      expect(core.lines).toContain("transport: closed the connection of large: too-large");
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("negative control (committed): the channel link's limit doubled: the message is read, and the oracle fails", async () => {
    const core = channelCore(await backend.database("public"), { head: 2n, seams: { limits: { maxMessageBytes: 2 * MAX_MESSAGE_BYTES } } });
    try {
      await core.handle.started;
      const peer = await greeted(core, "large");
      // A statement the read gate refuses at its first word, so nothing of it reaches the database.
      const prefix = '{"link":1,"kind":"message","message":{"v":1,"type":"read","id":"1","statements":[{"sql":"BEGIN ';
      const suffix = '","params":[]}]}}';
      const room = MAX_MESSAGE_BYTES + ENVELOPE_BYTES - prefix.length - suffix.length;
      peer.sendRaw(`${prefix}${"é".repeat(Math.floor(room / 2) + 1)}${suffix}`);
      // Read, not refused for its size: the core answers it (read-refused, the gate's answer to BEGIN).
      const answer = await peer.next("read-result", 120_000);
      expect(answer.id).toBe("1");
      expect(peer.end).toBeNull();
    } finally {
      await core.handle.stop();
    }
  }, 240_000);
});

const POSTGRES = PRIVATE_BACKENDS.find((backend) => backend.kind === "postgres");
if (POSTGRES === undefined) throw new Error("no PostgreSQL backend");

describe("the channel link's reads on the reader login, on PostgreSQL 18", () => {
  const backend = POSTGRES;
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("over channels with transportReader, the link's reads run on the reader login: current_user in a read is it", async () => {
    const db = await backend.database("public");
    const core = channelCore(db, { head: 3n });
    try {
      await core.handle.started;
      const peer = await greeted(core, "reader");
      peer.send({ v: 1, type: "read", id: "who", statements: [{ sql: "SELECT current_user AS who", params: [] }] });
      const answer = (await peer.next("read-result", 120_000)) as { results?: { rows: unknown[][] }[] };
      expect(answer.results?.[0]?.rows).toEqual([[TRANSPORT_LOGIN]]);
      const sessions = (await db.sessions?.()) ?? [];
      expect(sessions).toContainEqual({ login: TRANSPORT_LOGIN, application: "umbradb" });
      // The login's name is its password here, which the log redacts wherever it appears.
      expect(core.lines).toContain("transport reads as [redacted], a login that may only read");
    } finally {
      await core.handle.stop();
    }
  }, 120_000);

  it("report-unchecked (the reader login cannot read the public blocks) makes the private process connect again over a new channel", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    const core = channelCore(publicDb, { head: 3n, extra: { lockstepInstances: ["ch-unchecked"] } });
    try {
      await core.handle.started;
      // The reader keeps its login but loses its read of the public tables: each report's check then fails.
      await publicDb.exec?.(`REVOKE pg_read_all_data FROM ${TRANSPORT_LOGIN}`);
      const link = linkTo(core.handle);
      // Its public reads go to the public database directly, so only its reports need the core's reads.
      const instance = channelPrivate(privateDb, publicDb, {
        instanceId: "ch-unchecked",
        connect: link.connect,
        extra: { publicDatabase: publicDb.readerSetting, backoffCeilingMs: 1_000 },
      });
      try {
        await until(() => link.opened >= 2, "a second channel", FOLLOWS_MS);
        expect(core.lines.some((line) => /^transport: the report of ch-unchecked at \d+ could not be checked \(database-error\); closing its connection$/.test(line))).toBe(true);
        expect(instance.lines.some((line) => line.includes("(1011 report-unchecked)"))).toBe(true);
        await publicDb.exec?.(`GRANT pg_read_all_data TO ${TRANSPORT_LOGIN}`);
        await cursorReaches(core.handle, 3n, FOLLOWS_MS);
        await cursorReaches(instance.handle, 3n, FOLLOWS_MS);
        expect(instance.handle.status().state).not.toBe("halted");
      } finally {
        await instance.handle.stop();
      }
    } finally {
      await publicDb.exec?.(`GRANT pg_read_all_data TO ${TRANSPORT_LOGIN}`);
      await core.handle.stop();
    }
  }, FOLLOWS_MS * 2);
});

describe("at the link: report-unchecked over a channel makes the private transport connect again", () => {
  it("the core's check of a report fails: the channel closes 1011 report-unchecked, and connect() opens a new channel", async () => {
    const lines: string[] = [];
    const core = new CoreChannels({ log: (line) => lines.push(line) });
    core.start({
      db: {
        read: async () => {
          throw new UmbraError("connection-lost", "the public database is away", {});
        },
      },
      genesis: new Uint8Array(32),
      start: 1n,
      cursor: () => 1n,
      lockstepInstances: ["u-1"],
      readTimeoutMs: 30_000,
      configHash: `0x${"c1".repeat(32)}`,
      log: (line) => lines.push(line),
    });
    let opened = 0;
    const privateLines: string[] = [];
    const transport = new PrivateTransport({
      carrier: channelCarrier(async () => {
        opened += 1;
        const [coreEnd, privateEnd] = channelPair();
        core.accept(coreEnd);
        return privateEnd;
      }),
      instance: "u-1",
      version: "0.10.0",
      position: () => ({ height: 0n, hash: null }),
      backoffCeilingMs: 1_000,
      log: (line) => privateLines.push(line),
    });
    try {
      expect((await transport.connection()).lockstep).toBe(true);
      transport.report({ height: 1n, hash: new Uint8Array(32).fill(1) });
      await until(() => opened === 2 && transport.state === "connected", "a new channel, connected", 10_000);
      expect(lines).toContain("transport: the report of u-1 at 1 could not be checked (connection-lost); closing its connection");
      expect(privateLines.some((line) => line.includes("(1011 report-unchecked); connecting again in 1000 ms (attempt 1)"))).toBe(true);
      expect(transport.refusal).toBeNull();
    } finally {
      await transport.close();
      await core.close();
    }
  }, 30_000);
});
