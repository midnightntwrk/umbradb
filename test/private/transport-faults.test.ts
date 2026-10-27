import { createServer, type Server } from "node:http";
import { createServer as createNetServer } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { type WebSocket, WebSocketServer } from "ws";
import type { ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type ResultColumn, RESULT_COLUMNS } from "../../src/deterministic-postgresql/index.js";
import { type CoreTransport, type CoreTransportOptions, splitAddress, startCoreTransport } from "../../src/private/core-transport.js";
import { Lockstep } from "../../src/private/lockstep.js";
import { hexOf, type Message, messageText, parseMessage } from "../../src/private/messages.js";
import { PrivateTransport, type PrivateTransportOptions } from "../../src/private/private-transport.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPublicCore } from "./builds.js";
import { endedWithin, hello, rawClient } from "./raw-client.js";

/**
 * The process transport's faults and limits (tasks 14.2, 14.3; PP-4, PP-5, PP-6, PP-7, IN-10): what closes a connection
 * on the core's side — too many reads at once, a reader too slow, a peer that does not answer pings, a frame that is no
 * WebSocket frame, a `report` whose hash is not the public block's —, a result too large, a report checked and counted,
 * a listed instance behind the public cursor refused `lockstep-behind`, a listener that cannot listen; and on a private
 * process's side, against a stand-in core, every reply of the core it closes on, retries after (a refused `hello`, a
 * lost connection, no pong, an HTTP answer), the reads while it is connecting, connected, waiting and closed, its
 * `connection()` and `report()`, and the core's `report-hash-mismatch`, which refuses it for good. The limits are the
 * tests' smaller ones (`limits`), the code the process runs. Committed negative control: a core whose report check
 * compares nothing fails the report oracle.
 */

const quiet = () => undefined;

/** Rows as the database API returns them: values by column name, with their columns kept (`mapRows`). */
function rowsOf(columns: readonly ResultColumn[], values: readonly Record<string, unknown>[]): Record<string, unknown>[] {
  const rows = values.map((row) => ({ ...row }));
  Object.defineProperty(rows, RESULT_COLUMNS, { value: columns, enumerable: false });
  return rows;
}

/** A public database whose reads the test answers: `answer` gives each statement's rows (or throws, or hangs). */
function fakeDb(answer: (sql: string, params: readonly unknown[]) => Promise<Record<string, unknown>[]>): CoreTransportOptions["db"] {
  return {
    read: async <T>(body: (read: ReadHandle) => Promise<T>) =>
      body({ height: 9n, query: (sql: string, params: unknown[] = []) => answer(sql, params) }),
  } as CoreTransportOptions["db"];
}

/** The hash of the public block at `height` in {@link blocksDb}: 32 bytes of the height. */
const blockHash = (height: bigint): Uint8Array => new Uint8Array(32).fill(Number(height));

/** A public database holding blocks 1 to `top` ({@link blockHash}); every read fails when `failing()` says so. */
function blocksDb(top: bigint, failing: () => boolean = () => false): CoreTransportOptions["db"] {
  return fakeDb(async (sql, params) => {
    if (failing()) throw new UmbraError("connection-lost", "the public database is away", {});
    if (!sql.includes("core_block_commit.blocks")) return rowsOf([], []);
    const height = params[0] as bigint;
    return rowsOf([{ name: "hash", type: 17 }], height >= 1n && height <= top ? [{ hash: blockHash(height) }] : []);
  });
}

/** A core transport over `db`, its log kept. */
async function core(db: CoreTransportOptions["db"], rest: Partial<CoreTransportOptions> = {}) {
  const lines: string[] = [];
  const transport = await startCoreTransport({
    address: "127.0.0.1:0",
    db,
    genesis: new Uint8Array(32),
    start: 1n,
    cursor: () => 9n,
    lockstepInstances: [],
    readTimeoutMs: 30_000,
    log: (line) => lines.push(line),
    ...rest,
  });
  return { transport, lines, url: `ws://127.0.0.1:${transport.port}/` };
}

const opened: CoreTransport[] = [];
afterEach(async () => {
  for (const transport of opened.splice(0)) await transport.close();
});

/** A greeted raw client of `url` as `instance`, its `hello` at `height`. */
async function greeted(url: string, instance: string, options: Parameters<typeof rawClient>[1] = {}, height = "0") {
  const client = rawClient(url, options);
  await client.opened;
  client.send(hello(instance, height));
  await client.next("hello-ack");
  return client;
}

describe("the core's side: limits and faults", () => {
  it("more reads at once than the limit closes the connection (too-many-reads)", async () => {
    let release = (): void => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    const { transport, url, lines } = await core(
      fakeDb(async () => {
        await held;
        return rowsOf([], []);
      }),
      { limits: { maxPendingReads: 2 } },
    );
    opened.push(transport);
    const client = await greeted(url, "busy");
    for (const id of ["1", "2", "3"]) client.send({ v: 1, type: "read", id, statements: [{ sql: "SELECT 1", params: [] }] });
    expect(await endedWithin(client)).toMatchObject({ code: 1008, reason: "too-many-reads" });
    expect(lines.join("\n")).toContain("transport: closed the connection of busy: too-many-reads");
    // The held reads finish after their connection closed: their answers go nowhere, and nothing breaks.
    release();
    await sleep(50);
    expect((await greeted(url, "after")).received).toEqual([]);
  });

  it("a result whose message would exceed the largest message is answered result-too-large", async () => {
    const columns = [{ name: "t", type: 25 }];
    const { transport, url } = await core(fakeDb(async () => rowsOf(columns, [{ t: "x".repeat(4_096) }])), {
      limits: { maxMessageBytes: 1_024 },
    });
    opened.push(transport);
    const client = await greeted(url, "large");
    client.send({ v: 1, type: "read", id: "big", statements: [{ sql: "SELECT t", params: [] }] });
    expect(await client.next("read-result")).toEqual({ v: 1, type: "read-result", id: "big", height: "9", error: "result-too-large" });
    client.close();
  });

  it("a failure that is no UmbraError is answered database-error, never its message; an UmbraError by its code", async () => {
    const { transport, url } = await core(
      fakeDb(async (sql) => {
        if (sql === "boom") throw new Error("password=hunter2 in the message");
        throw new UmbraError("query-timeout", "slow", {});
      }),
    );
    opened.push(transport);
    const client = await greeted(url, "fails");
    client.send({ v: 1, type: "read", id: "a", statements: [{ sql: "boom", params: [] }] });
    client.send({ v: 1, type: "read", id: "b", statements: [{ sql: "slow", params: [] }] });
    expect(await client.next("read-result")).toEqual({ v: 1, type: "read-result", id: "a", height: null, error: "database-error" });
    expect(await client.next("read-result")).toEqual({ v: 1, type: "read-result", id: "b", height: null, error: "query-timeout" });
    client.close();
  });

  it("each read is bounded by the process's apiReadTimeoutMs, as a module API request's is (DB-15)", async () => {
    const seen: unknown[] = [];
    const db = {
      read: async <T>(body: (read: ReadHandle) => Promise<T>, options?: unknown) => {
        seen.push(options);
        return body({ height: 9n, query: async () => rowsOf([], []) });
      },
    } as CoreTransportOptions["db"];
    const { transport, url } = await core(db, { readTimeoutMs: 1_234 });
    opened.push(transport);
    const client = await greeted(url, "bounded");
    client.send({ v: 1, type: "read", id: "t", statements: [] });
    await client.next("read-result");
    expect(seen).toEqual([{ timeoutMs: 1_234 }]);
    client.close();
  });

  it("a second hello on one connection is refused, whatever its id, and the connection closed", async () => {
    const { transport, url } = await core(fakeDb(async () => rowsOf([], [])));
    opened.push(transport);
    const client = await greeted(url, "first-id");
    client.send(hello("second-id"));
    expect(await client.next("hello-ack")).toMatchObject({ refused: "duplicate-instance" });
    expect(await endedWithin(client)).toMatchObject({ code: 1008, reason: "duplicate-instance second-id" });
    await until(() => transport.instances().length === 0, "the first id freed with its connection");
  });

  it("a reader that leaves more than the limit waiting in its socket is dropped (too-slow, PP-5)", async () => {
    const columns = [{ name: "t", type: 25 }];
    const { transport, url, lines } = await core(fakeDb(async () => rowsOf(columns, [{ t: "y".repeat(4 * 1024 * 1024) }])), {
      limits: { maxBufferedBytes: 1_024 },
    });
    opened.push(transport);
    const client = rawClient(url);
    await client.opened;
    client.send(hello("slow"));
    await client.next("hello-ack");
    // The client stops reading its socket; the core keeps answering.
    pauseOf(client);
    for (let id = 0; id < 8; id++) client.send({ v: 1, type: "read", id: `${id}`, statements: [{ sql: "SELECT t", params: [] }] });
    const deadline = Date.now() + 30_000;
    while (!lines.some((line) => line.endsWith("slow: too-slow")) && Date.now() < deadline) await sleep(20);
    expect(lines.join("\n")).toContain("transport: closed the connection of slow: too-slow");
    client.close();
  });

  it("a peer that does not answer a ping is ended (no-pong), its id free again", async () => {
    const { transport, url, lines } = await core(fakeDb(async () => rowsOf([], [])), { limits: { pingIntervalMs: 100 } });
    opened.push(transport);
    const client = await greeted(url, "silent", { autoPong: false });
    const end = await endedWithin(client, 10_000);
    expect(end.code).toBe(1006);
    expect(lines.join("\n")).toContain("transport: closed the connection of silent: no-pong");
    await until(() => lines.includes("transport: instance silent disconnected"), "the core's view of the close");
    const again = await greeted(url, "silent");
    again.close();
  });

  it("keeps an instance's report once its hash is the public block's, and shows connected instances", async () => {
    const { transport, url } = await core(blocksDb(9n), { lockstepInstances: ["reporter"] });
    opened.push(transport);
    // In step with the public cursor (9): at 8, the height before it.
    const client = await greeted(url, "reporter", {}, "8");
    expect(transport.instances()).toEqual([{ instance: "reporter", lockstep: true, height: 8n, hash: null }]);
    const hash = hexOf(blockHash(9n));
    client.send({ v: 1, type: "report", height: "9", hash });
    await until(() => transport.instances()[0]?.height === 9n, "the report counted");
    expect(transport.instances()).toEqual([{ instance: "reporter", lockstep: true, height: 9n, hash }]);
    client.close();
    await endedWithin(client);
  });

  it("bytes that are no WebSocket frame end the connection", async () => {
    const { transport, url } = await core(fakeDb(async () => rowsOf([], [])));
    opened.push(transport);
    const client = await greeted(url, "garbled");
    socketOf(client).write(Buffer.from([0xff, 0xff, 0xff, 0xff]));
    expect((await endedWithin(client)).opened).toBe(true);
  });

  it("close ends a connection that never finishes its close handshake", async () => {
    const { transport, url } = await core(fakeDb(async () => rowsOf([], [])));
    const client = await greeted(url, "stuck");
    pauseOf(client);
    const started = Date.now();
    await transport.close();
    expect(Date.now() - started).toBeLessThan(10_000);
    await transport.close();
  });

  it("an address another listener holds rejects with listen's error", async () => {
    const holder = createNetServer();
    await new Promise<void>((resolve) => holder.listen(0, "127.0.0.1", resolve));
    const { port } = holder.address() as { port: number };
    try {
      await expect(core(fakeDb(async () => rowsOf([], [])), { address: `127.0.0.1:${port}` })).rejects.toMatchObject({
        code: "EADDRINUSE",
        syscall: "listen",
      });
    } finally {
      await new Promise<void>((resolve) => holder.close(() => resolve()));
    }
  });

  it("splits an address, a bracketed IPv6 host without its brackets", () => {
    expect(splitAddress("[::1]:9000")).toEqual({ host: "::1", port: 9000 });
    expect(splitAddress("0.0.0.0:0")).toEqual({ host: "0.0.0.0", port: 0 });
  });
});

/**
 * The oracle of PP-6's report check against the transport at `url` whose bookkeeping is `lockstep` (listing `good`, `bad`
 * and `ahead`, each saying `hello` at 8; the public cursor 9, blocks 1–9): every problem, none when a report with the
 * public block's hash counts, and one with another hash, or at a height with no public block, closes its connection
 * (1008, `report-hash-mismatch`) and leaves the instance held, refused, at its earlier height.
 */
export async function reportProblems(url: string, lockstep: Lockstep): Promise<string[]> {
  const problems: string[] = [];
  const entry = (instance: string) => lockstep.instances().find((one) => one.instance === instance);
  const good = await greeted(url, "good", {}, "8");
  good.send({ v: 1, type: "report", height: "9", hash: hexOf(blockHash(9n)) });
  await until(() => entry("good")?.height === 9n, "the good report counted").catch(() =>
    problems.push(`a report with the public block's hash did not count: good at ${entry("good")?.height}`),
  );
  const cases: [string, string, Uint8Array][] = [
    ["bad", "9", new Uint8Array(32).fill(0xee)],
    ["ahead", "10", blockHash(10n)],
  ];
  for (const [instance, height, hash] of cases) {
    const client = await greeted(url, instance, {}, "8");
    client.send({ v: 1, type: "report", height, hash: hexOf(hash) });
    const end = await endedWithin(client, 5_000).catch(() => null);
    if (end === null) {
      problems.push(`${instance}'s report at ${height} with another hash than the public block's left its connection open`);
      client.close();
    } else if (end.code !== 1008 || end.reason !== "report-hash-mismatch") {
      problems.push(`${instance}'s connection closed with ${end.code} ${end.reason}, not 1008 report-hash-mismatch`);
    }
    await until(() => entry(instance)?.connected === false || end === null, `${instance}'s close seen`).catch(() => undefined);
    const seen = entry(instance);
    if (seen?.refused !== "report-hash-mismatch" || seen.height !== 8n) {
      problems.push(`the core counted ${instance}'s report with another hash: ${JSON.stringify(seen, (_k, v) => (typeof v === "bigint" ? `${v}` : v))}`);
    }
  }
  good.close();
  return problems;
}

describe("the core's side: lockstep (task 14.3; PP-6, PP-7)", () => {
  it("a listed instance whose hello is below the public cursor − 1 is refused lockstep-behind, kept connected and held (PP-7)", async () => {
    const lockstep = new Lockstep({ listed: ["late", "ontime"] });
    const { transport, url, lines } = await core(blocksDb(9n), { lockstepInstances: ["late", "ontime"], lockstep });
    opened.push(transport);
    const ackOf = async (instance: string, height: string) => {
      const client = rawClient(url);
      await client.opened;
      client.send(hello(instance, height));
      return { client, ack: await client.next("hello-ack") };
    };
    const late = await ackOf("late", "7");
    expect(late.ack).toMatchObject({ lockstep: true, cursor: "9", refused: "lockstep-behind" });
    // Its connection stays, answered, holding its id; its report counts for nothing.
    late.client.send({ v: 1, type: "report", height: "9", hash: hexOf(blockHash(9n)) });
    late.client.send({ v: 1, type: "read", id: "r", statements: [] });
    expect(await late.client.next("read-result")).toMatchObject({ id: "r" });
    expect((await ackOf("late", "9")).ack.refused).toBe("duplicate-instance");
    const ontime = await ackOf("ontime", "8");
    expect(ontime.ack).toMatchObject({ lockstep: true, refused: null });
    const free = await ackOf("free", "0");
    expect(free.ack).toMatchObject({ lockstep: false, refused: null });
    await sleep(50);
    expect(lockstep.instances()).toEqual([
      { instance: "late", connected: true, height: 7n, refused: "lockstep-behind" },
      { instance: "ontime", connected: true, height: 8n, refused: null },
    ]);
    // The transport's own view (PP-9) keeps the refused instance at its hello too.
    expect(transport.instances().find((one) => one.instance === "late")).toEqual({ instance: "late", lockstep: true, height: 7n, hash: null });
    expect(lines).toContain("transport: instance late connected at 7; refused lockstep-behind: below the public cursor 9 − 1 (PP-7)");
    for (const client of [late.client, ontime.client, free.client]) client.close();
    await until(() => lockstep.instances().every((one) => !one.connected), "the closes seen");
    expect(lockstep.instances()[0]).toEqual({ instance: "late", connected: false, height: 7n, refused: "lockstep-behind" });
  });

  it("before the first public commit no hello is behind; without its own bookkeeping the transport makes one", async () => {
    const { transport, url } = await core(blocksDb(0n), { lockstepInstances: ["early"], cursor: () => null });
    opened.push(transport);
    const client = rawClient(url);
    await client.opened;
    client.send(hello("early", "0"));
    expect(await client.next("hello-ack")).toMatchObject({ lockstep: true, cursor: null, refused: null });
    client.close();
  });

  it("a report with the public block's hash counts; another hash, or no public block there, closes report-hash-mismatch (PP-6)", async () => {
    const lockstep = new Lockstep({ listed: ["good", "bad", "ahead"] });
    const { transport, url, lines } = await core(blocksDb(9n), { lockstepInstances: lockstep.listed, lockstep });
    opened.push(transport);
    expect(await reportProblems(url, lockstep)).toEqual([]);
    expect(lines).toContain(
      `transport: instance bad reported height 9 with hash ${hexOf(new Uint8Array(32).fill(0xee))}, and the public block ` +
        `there has hash ${hexOf(blockHash(9n))}: report-hash-mismatch (PP-6)`,
    );
    expect(lines).toContain(
      `transport: instance ahead reported height 10 with hash ${hexOf(blockHash(10n))}, and the public database has no ` +
        "block there: report-hash-mismatch (PP-6)",
    );
  });

  it("negative control (committed): a core whose report check compares nothing fails the oracle", async () => {
    const lockstep = new Lockstep({ listed: ["good", "bad", "ahead"] });
    const { transport, url } = await core(blocksDb(9n), { lockstepInstances: lockstep.listed, lockstep, reports: "accept" });
    opened.push(transport);
    const problems = await reportProblems(url, lockstep);
    expect(problems).toContain("bad's report at 9 with another hash than the public block's left its connection open");
    expect(problems).toContain("ahead's report at 10 with another hash than the public block's left its connection open");
  });

  it("a report the core cannot check closes the connection (1011, report-unchecked), the instance's height unchanged", async () => {
    let failing = false;
    const lockstep = new Lockstep({ listed: ["unchecked"] });
    const { transport, url, lines } = await core(
      blocksDb(9n, () => failing),
      { lockstepInstances: ["unchecked"], lockstep },
    );
    opened.push(transport);
    const client = await greeted(url, "unchecked", {}, "8");
    failing = true;
    client.send({ v: 1, type: "report", height: "9", hash: hexOf(blockHash(9n)) });
    expect(await endedWithin(client)).toMatchObject({ code: 1011, reason: "report-unchecked" });
    expect(lockstep.instances()[0]).toMatchObject({ height: 8n, refused: null });
    expect(lines.join("\n")).toContain("transport: the report of unchecked at 9 could not be checked (connection-lost)");
  });

  it("more report checks at once than the limit closes the connection (too-many-reads)", async () => {
    let release = (): void => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    const { transport, url } = await core(
      fakeDb(async () => {
        await held;
        return rowsOf([], []);
      }),
      { lockstepInstances: ["flood"], limits: { maxPendingReads: 2 } },
    );
    opened.push(transport);
    const client = await greeted(url, "flood", {}, "8");
    for (const height of ["1", "2", "3"]) client.send({ v: 1, type: "report", height, hash: hexOf(blockHash(1n)) });
    expect(await endedWithin(client)).toMatchObject({ code: 1008, reason: "too-many-reads" });
    release();
  });
});

describe("a public process whose listen.transport is taken refuses startup (listen-failed)", () => {
  const backend = PRIVATE_BACKENDS.find((one) => one.kind === "pglite") as PrivateBackend;
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("startup is refused with listen-failed, and the process stays up refused until stopped", async () => {
    const holder = createNetServer();
    await new Promise<void>((resolve) => holder.listen(0, "127.0.0.1", resolve));
    const { port } = holder.address() as { port: number };
    const db = await backend.database("public");
    const running = launchPublicCore({ database: db.setting, head: 2n, extra: { listen: { transport: `127.0.0.1:${port}` } } });
    try {
      await expect(running.handle.started).rejects.toMatchObject({ code: "EADDRINUSE" });
      expect(running.handle.status()).toMatchObject({ state: "refused", reason: { code: "listen-failed" } });
    } finally {
      await running.stop();
      await new Promise<void>((resolve) => holder.close(() => resolve()));
    }
  }, TEST_TIMEOUT_MS);
});

// ── a private process's side, against a stand-in core ─────────────────────────────────────────────────────────

/** A stand-in core: a WebSocket server whose replies `reply` writes, per message received. */
async function standIn(
  reply: (socket: WebSocket, message: Message, connection: number) => void,
  options: { readonly autoPong?: boolean } = {},
) {
  const server = createServer();
  const wss = new WebSocketServer({ server, autoPong: options.autoPong ?? true });
  let connections = 0;
  const sockets = new Set<WebSocket>();
  wss.on("connection", (socket) => {
    connections += 1;
    const connection = connections;
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.on("message", (data) => {
      const parsed = parseMessage(data.toString());
      if (parsed.ok) reply(socket, parsed.message, connection);
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };
  return {
    address: `127.0.0.1:${port}`,
    connections: () => connections,
    sockets,
    async close() {
      for (const socket of sockets) socket.terminate();
      await new Promise<void>((resolve) => wss.close(() => resolve()));
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}

const ACK: Message = { v: 1, type: "hello-ack", lockstep: false, genesis: `0x${"00".repeat(32)}`, start: "1", cursor: null, refused: null };

/** A private transport to `address`, its log kept, its back-off 50 ms. */
function client(address: string, rest: Partial<PrivateTransportOptions> = {}) {
  const lines: string[] = [];
  const transport = new PrivateTransport({
    address,
    instance: "p-1",
    version: "0.9.5",
    position: () => ({ height: 4n, hash: new Uint8Array(32).fill(1) }),
    backoffCeilingMs: 50,
    log: (line) => lines.push(line),
    ...rest,
  });
  return { transport, lines };
}

/** Waits until `check` holds, or fails after `ms`. */
async function until(check: () => boolean, what: string, ms = 20_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out: ${what}`);
    await sleep(10);
  }
}

describe("a private process's side against a stand-in core", () => {
  it("a refused hello is retried after the back-off; its hello gives its position; a wait is woken on connecting", async () => {
    const hellos: Message[] = [];
    const core = await standIn((socket, message, connection) => {
      if (message.type !== "hello") return;
      hellos.push(message);
      socket.send(messageText({ ...ACK, refused: connection === 1 ? "duplicate-instance" : null } as Message));
    });
    const { transport, lines } = client(core.address);
    try {
      expect(transport.state).toBe("idle");
      await transport.next(new AbortController().signal);
      expect(transport.state).toBe("connected");
      expect(transport.ack).toMatchObject({ refused: null });
      expect(core.connections()).toBe(2);
      expect(lines[0]).toMatch(/^transport: the core refused instance p-1: duplicate-instance .*connecting again in 50 ms \(attempt 1\)$/);
      expect(hellos[0]).toEqual({ v: 1, type: "hello", instance: "p-1", version: "0.9.5", height: "4", hash: `0x${"01".repeat(32)}` });
      // A connection made starts the back-off again: the next loss is attempt 1 again.
      for (const socket of core.sockets) socket.terminate();
      await until(() => lines.length >= 3, "the next loss logged");
      expect(lines[2]).toMatch(/connecting again in 50 ms \(attempt 1\)$/);
    } finally {
      await transport.close();
      await core.close();
    }
  });

  it.each([
    ["a binary frame", (socket: WebSocket) => socket.send(Buffer.from([1]), { binary: true }), "binary-frame"],
    ["a text that is no JSON", (socket: WebSocket) => socket.send("nope"), "not-json"],
    ["a message only a private process sends", (socket: WebSocket) => socket.send(messageText(hello("x"))), "wrong-direction hello"],
    [
      "an api message (no such type: Q140)",
      (socket: WebSocket) => socket.send('{"v":1,"type":"api","id":"q","module":"m","method":"x","params":null}'),
      "unknown-type",
    ],
    [
      "an api-result message (no such type: Q140)",
      (socket: WebSocket) => socket.send('{"v":1,"type":"api-result","id":"z","result":null}'),
      "unknown-type",
    ],
  ])("%s from the core closes the connection, which is made again", async (_name, fault, reason) => {
    const core = await standIn((socket, message, connection) => {
      if (message.type !== "hello") return;
      socket.send(messageText(ACK));
      if (connection === 1) fault(socket);
    });
    const { transport, lines } = client(core.address);
    try {
      await transport.next(new AbortController().signal);
      await until(() => core.connections() >= 2 && transport.state === "connected", "connected again");
      expect(lines.join("\n")).toContain(`transport: ${reason}`);
    } finally {
      await transport.close();
      await core.close();
    }
  });

  it("ignores a read-result of no read, and answers nothing the core sends", async () => {
    const answers: Message[] = [];
    const core = await standIn((socket, message) => {
      if (message.type === "hello") {
        socket.send(messageText(ACK));
        socket.send(messageText({ v: 1, type: "read-result", id: "none", height: null, results: [] }));
      } else if (message.type === "read") {
        socket.send(messageText({ v: 1, type: "read-result", id: message.id, height: "9", results: [] }));
      } else answers.push(message);
    });
    const { transport, lines } = client(core.address);
    try {
      // The read's answer comes after the read-result of no read, on the same connection: that one was ignored.
      expect(await transport.read(async (read) => read.height)).toBe(9n);
      expect(answers).toEqual([]);
      expect(transport.state).toBe("connected");
      expect(lines.filter((line) => line.includes("connecting again"))).toEqual([]);
    } finally {
      await transport.close();
      await core.close();
    }
  });

  it("reads: a read error's code (an unknown one as database-error), a read lost in flight, while waiting, after close", async () => {
    let mode: "error" | "unknown" | "drop" | "empty" = "empty";
    const core = await standIn((socket, message) => {
      if (message.type === "hello") socket.send(messageText(ACK));
      if (message.type !== "read") return;
      if (message.statements.length === 0 || mode === "empty") {
        socket.send(messageText({ v: 1, type: "read-result", id: message.id, height: null, results: message.statements.map(() => ({ columns: [], rows: [] })) }));
      } else if (mode === "error") {
        socket.send(messageText({ v: 1, type: "read-result", id: message.id, height: "3", error: "query-timeout" }));
      } else if (mode === "unknown") {
        socket.send(messageText({ v: 1, type: "read-result", id: message.id, height: "3", error: "result-too-large" }));
      } else socket.terminate();
    });
    const { transport } = client(core.address, { backoffCeilingMs: 60_000 });
    try {
      // A read made while connecting waits for the connection; on an empty public database its height is null.
      expect(await transport.read(async (read) => read.height)).toBeNull();
      mode = "error";
      await expect(transport.read((read) => read.query("SELECT 1"))).rejects.toMatchObject({ code: "query-timeout" });
      mode = "unknown";
      await expect(transport.read((read) => read.query("SELECT 1"))).rejects.toMatchObject({
        code: "database-error",
        details: { transportCode: "result-too-large" },
      });
      mode = "drop";
      await expect(transport.read((read) => read.query("SELECT 1"))).rejects.toMatchObject({ code: "connection-lost", retryable: true });
      // Now waiting to connect again (a back-off of 1 s): a read fails at once.
      expect(transport.state).toBe("waiting");
      await expect(transport.read(async () => 1)).rejects.toMatchObject({ code: "connection-lost" });
    } finally {
      await transport.close();
      await core.close();
    }
    await expect(transport.read(async () => 1)).rejects.toMatchObject({ code: "connection-lost", message: expect.stringContaining("stopping") });
    expect(transport.state).toBe("closed");
    await transport.close();
  });

  it("a wait stops with its signal's reason, before it starts and while it waits", async () => {
    const core = await standIn(() => undefined);
    const { transport } = client(core.address);
    try {
      const before = new AbortController();
      before.abort(new Error("before"));
      await expect(transport.next(before.signal)).rejects.toThrow("before");
      const during = new AbortController();
      const waiting = transport.next(during.signal);
      during.abort(new Error("during"));
      await expect(waiting).rejects.toThrow("during");
    } finally {
      await transport.close();
      await core.close();
    }
  });

  it("a core that does not answer a ping is left, and the connection made again", async () => {
    const core = await standIn(
      (socket, message) => {
        if (message.type === "hello") socket.send(messageText(ACK));
      },
      { autoPong: false },
    );
    const { transport, lines } = client(core.address, { limits: { pingIntervalMs: 100 } });
    try {
      await transport.next(new AbortController().signal);
      await until(() => lines.some((line) => line.includes("the core did not answer a ping")), "the ping's end");
      await until(() => core.connections() >= 2, "a new connection");
    } finally {
      await transport.close();
      await core.close();
    }
  });

  it("connection() gives the hello-ack once connected, a lockstep-behind one included; it fails while waiting to connect", async () => {
    const core = await standIn((socket, message, connection) => {
      if (message.type !== "hello") return;
      socket.send(messageText({ ...ACK, lockstep: true, refused: connection === 1 ? "lockstep-behind" : null } as Message));
    });
    const { transport, lines } = client(core.address, { backoffCeilingMs: 60_000 });
    try {
      expect(transport.lockstep).toBe(false);
      expect(await transport.connection()).toMatchObject({ lockstep: true, refused: "lockstep-behind" });
      // Refused lockstep-behind, it stays connected (PP-7: the core keeps waiting for it, and it halts by its own check).
      expect([transport.state, transport.lockstep, core.connections()]).toEqual(["connected", true, 1]);
      expect(lines).toContain(`transport: connected to the core at ${core.address}; refused lockstep-behind: this instance is behind the public cursor (PP-7)`);
      // The same ack while connected.
      expect(await transport.connection()).toBe(transport.ack);
      for (const socket of core.sockets) socket.terminate();
      await until(() => transport.state === "waiting", "the loss seen");
      await expect(transport.connection()).rejects.toMatchObject({ code: "connection-lost", retryable: true });
      // The flag of the last ack is kept while away.
      expect(transport.lockstep).toBe(true);
    } finally {
      await transport.close();
      await core.close();
    }
    await expect(transport.connection()).rejects.toMatchObject({ code: "connection-lost", message: expect.stringContaining("stopping") });
  });

  it("report() sends a committed block as report only to a core that lists it, while connected and not refused", async () => {
    const reports: Message[] = [];
    const listing = (lockstep: boolean, refused: "lockstep-behind" | null) =>
      standIn((socket, message) => {
        if (message.type === "hello") socket.send(messageText({ ...ACK, lockstep, refused } as Message));
        if (message.type === "report") reports.push(message);
      });
    const block = { height: 5n, hash: new Uint8Array(32).fill(5), parentHash: new Uint8Array(32) };
    for (const [lockstep, refused, sent] of [
      [false, null, 0],
      [true, "lockstep-behind", 0],
      [true, null, 1],
    ] as const) {
      const core = await listing(lockstep, refused);
      const { transport } = client(core.address);
      reports.splice(0);
      try {
        transport.report(block);
        await transport.connection();
        transport.report(block);
        // A report sent arrives; none sent, a while without one.
        if (sent === 1) await until(() => reports.length === 1, "the report");
        else await sleep(200);
        expect(reports).toEqual(sent === 0 ? [] : [{ v: 1, type: "report", height: "5", hash: `0x${"05".repeat(32)}` }]);
      } finally {
        await transport.close();
        await core.close();
      }
    }
  });

  it("a close for report-hash-mismatch refuses it for good: no new connection, every wait, read and connection fails with it", async () => {
    const core = await standIn((socket, message) => {
      if (message.type === "hello") socket.send(messageText({ ...ACK, lockstep: true }));
      if (message.type === "report") socket.close(1008, "report-hash-mismatch");
    });
    const { transport, lines } = client(core.address);
    try {
      await transport.connection();
      const waiting = transport.next(new AbortController().signal);
      transport.report({ height: 1n, hash: new Uint8Array(32).fill(1) });
      await expect(waiting).rejects.toMatchObject({ code: "report-hash-mismatch", retryable: false });
      expect(transport.state).toBe("refused");
      await expect(transport.next(new AbortController().signal)).rejects.toMatchObject({ code: "report-hash-mismatch" });
      await expect(transport.read(async () => 1)).rejects.toMatchObject({ code: "report-hash-mismatch" });
      await expect(transport.connection()).rejects.toMatchObject({ code: "report-hash-mismatch" });
      // Ten back-off ceilings later, still the one connection it had.
      await sleep(500);
      expect(core.connections()).toBe(1);
      expect(lines).toContain(
        "transport: the core refused instance p-1 for good: report-hash-mismatch (its report's hash is not the public block's, PP-6)",
      );
    } finally {
      await transport.close();
      await core.close();
    }
    expect(transport.state).toBe("closed");
  });

  it("an address that answers HTTP without a WebSocket is a lost connection, logged with its error", async () => {
    const server: Server = createServer((_request, response) => {
      response.statusCode = 404;
      response.end();
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as { port: number };
    const { transport, lines } = client(`127.0.0.1:${port}`);
    try {
      void transport.next(new AbortController().signal).catch(() => undefined);
      await until(() => lines.length > 0, "a log line");
      expect(lines[0]).toMatch(/^transport: Unexpected server response: 404; connecting again in 50 ms \(attempt 1\)$/);
    } finally {
      await transport.close();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});

/** The client's `ws` socket. */
function socketOf(client: ReturnType<typeof rawClient>): import("node:net").Socket {
  return (client.raw as unknown as { readonly _socket: import("node:net").Socket })._socket;
}

/** Stops reading `client`'s socket (a reader that does not keep up). */
function pauseOf(client: ReturnType<typeof rawClient>): void {
  socketOf(client).pause();
}
