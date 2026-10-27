import { createServer, type Server } from "node:http";
import { createServer as createNetServer } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { type WebSocket, WebSocketServer } from "ws";
import type { ReadHandle } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { type ResultColumn, RESULT_COLUMNS } from "../../src/deterministic-postgresql/index.js";
import { type CoreTransport, type CoreTransportOptions, splitAddress, startCoreTransport } from "../../src/private/core-transport.js";
import { type Message, messageText, parseMessage } from "../../src/private/messages.js";
import { PrivateTransport, type PrivateTransportOptions } from "../../src/private/private-transport.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPublicCore } from "./builds.js";
import { endedWithin, hello, rawClient } from "./raw-client.js";

/**
 * The process transport's faults and limits (task 14.2; PP-4, PP-5, IN-10): what closes a connection on the core's side
 * — too many reads at once, a reader too slow, a peer that does not answer pings, a frame that is no WebSocket frame —,
 * a result too large, a report kept, a listener that cannot listen; and on a private process's side, against a stand-in
 * core, every reply of the core it closes on, retries after (a refused `hello`, a lost connection, no pong, an HTTP
 * answer), the reads while it is connecting, connected, waiting and closed, and what it answers to the core's own
 * messages. The limits are the tests' smaller ones (`limits`), the code the process runs.
 */

const quiet = () => undefined;

/** Rows as the database API returns them: values by column name, with their columns kept (`mapRows`). */
function rowsOf(columns: readonly ResultColumn[], values: readonly Record<string, unknown>[]): Record<string, unknown>[] {
  const rows = values.map((row) => ({ ...row }));
  Object.defineProperty(rows, RESULT_COLUMNS, { value: columns, enumerable: false });
  return rows;
}

/** A public database whose reads the test answers: `answer` gives each statement's rows (or throws, or hangs). */
function fakeDb(answer: (sql: string) => Promise<Record<string, unknown>[]>): CoreTransportOptions["db"] {
  return {
    read: async <T>(body: (read: ReadHandle) => Promise<T>) => body({ height: 9n, query: (sql: string) => answer(sql) }),
  } as CoreTransportOptions["db"];
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

/** A greeted raw client of `url` as `instance`. */
async function greeted(url: string, instance: string, options: Parameters<typeof rawClient>[1] = {}) {
  const client = rawClient(url, options);
  await client.opened;
  client.send(hello(instance));
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

  it("keeps an instance's report (task 14.3's), shows connected instances, and ignores an api-result", async () => {
    const { transport, url } = await core(fakeDb(async () => rowsOf([], [])), { lockstepInstances: ["reporter"] });
    opened.push(transport);
    const client = await greeted(url, "reporter");
    expect(transport.instances()).toEqual([{ instance: "reporter", lockstep: true, height: 0n, hash: null }]);
    const hash = `0x${"5a".repeat(32)}`;
    client.send({ v: 1, type: "report", height: "7", hash });
    client.send({ v: 1, type: "api-result", id: "x", error: "not-found" });
    client.send({ v: 1, type: "api", id: "probe", module: "m", method: "x", params: null });
    await client.next("api-result");
    expect(transport.instances()).toEqual([{ instance: "reporter", lockstep: true, height: 7n, hash }]);
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

  it("answers the core's api with not-found and its id; ignores an api-result and a read-result of no read", async () => {
    const answers: Message[] = [];
    const core = await standIn((socket, message) => {
      if (message.type === "hello") {
        socket.send(messageText(ACK));
        socket.send(messageText({ v: 1, type: "api-result", id: "z", result: null }));
        socket.send(messageText({ v: 1, type: "read-result", id: "none", height: null, results: [] }));
        socket.send(messageText({ v: 1, type: "api", id: "q", module: "m", method: "x", params: null }));
      } else answers.push(message);
    });
    const { transport } = client(core.address);
    try {
      await transport.next(new AbortController().signal);
      await until(() => answers.length > 0, "the api-result");
      expect(answers).toEqual([{ v: 1, type: "api-result", id: "q", error: "not-found" }]);
      expect(transport.state).toBe("connected");
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
