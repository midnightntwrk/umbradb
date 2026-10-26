import { once } from "node:events";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { MessageChannel } from "node:worker_threads";
import { afterEach, describe, expect, it } from "vitest";
import { type AdminServeOptions, type FromAdmin, serveAdmin } from "../../src/admin/serve.js";
import { ADMIN_CLOSE_TIMEOUT_MS, type AdminServer, startAdminServer, workerEntry } from "../../src/admin/server.js";
import type { AdminSnapshot } from "../../src/admin/types.js";
import { reasonOf } from "../../src/runner/failures.js";
import { Heartbeat } from "../../src/runner/heartbeat.js";
import { ask, ENDPOINTS, newHold, startProber, timingProblems } from "./admin-harness.js";

/**
 * The admin listener without a process (task 8.1; AE-1, AE-2): `serveAdmin` — `node:http` answering the route table
 * from the latest snapshot it was sent and the heartbeat's shared memory — and `startAdminServer`, which runs it in a
 * worker thread of its own: the messages between them (the snapshot in, `listening`, `listen-failed` and `closed` out),
 * the headers, a stale heartbeat, closing (the worker exits: no thread left), a listener that cannot listen (an error
 * the runner's reason calls `listen-failed`), the worker's entry from the sources and from a build, and a worker that
 * fails after it listened.
 */

/** A snapshot of a process in `state`, ready or not. */
function snapshot(state: AdminSnapshot["status"]["state"] = "following", ready = true, liveness = 30_000): AdminSnapshot {
  return {
    livenessTimeoutMs: liveness,
    status: { state, ready, conditions: [], cursor: "3", head: "3", lag: "0", reason: null },
    config: { core: null },
  };
}

/** A port held by another listener, and its release. */
async function heldPort(): Promise<{ readonly port: number; release(): Promise<void> }> {
  const server: Server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address() as { port: number };
  return { port, release: () => new Promise<void>((resolve) => server.close(() => resolve())) };
}

const servers: AdminServer[] = [];
const heartbeats: Heartbeat[] = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => server.close()));
  for (const heartbeat of heartbeats.splice(0)) heartbeat.stop();
});

/** A heartbeat stopped at once: its buffer holds one tick. */
function beat(): Heartbeat {
  const heartbeat = new Heartbeat();
  heartbeat.stop();
  heartbeats.push(heartbeat);
  return heartbeat;
}

/** `serveAdmin` on this thread over a message channel; its messages, and the channel's own end. */
function inThread(given: Omit<AdminServeOptions, "channel">) {
  const { port1, port2 } = new MessageChannel();
  const messages: FromAdmin[] = [];
  port1.on("message", (message: FromAdmin) => messages.push(message));
  serveAdmin({ ...given, channel: port2 });
  const next = async (type: FromAdmin["type"]) => {
    for (let waited = 0; waited < 10_000; waited += 5) {
      const found = messages.find((message) => message.type === type);
      if (found !== undefined) return found;
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    throw new Error(`no ${type} message`);
  };
  return { port1, port2, messages, next };
}

describe("serveAdmin (the worker's server, run here on this thread)", () => {
  it("listens, tells where, and answers from its snapshot and the heartbeat; a new snapshot replaces it", async () => {
    const heartbeat = beat();
    const served = inThread({ host: "127.0.0.1", port: 0, beat: heartbeat.buffer, snapshot: snapshot("starting", false) });
    const listening = (await served.next("listening")) as Extract<FromAdmin, { type: "listening" }>;
    expect(listening).toEqual({ type: "listening", host: "127.0.0.1", port: expect.any(Number) });
    const origin = `http://127.0.0.1:${listening.port}`;
    const status = await ask(origin, "/status");
    expect(status).toMatchObject({ status: 200, contentType: "application/json; charset=utf-8", json: { state: "starting" } });
    expect((await ask(origin, "/health/ready")).status).toBe(503);
    served.port1.postMessage({ type: "snapshot", snapshot: snapshot("following", true) });
    for (let tries = 0; (await ask(origin, "/health/ready")).status !== 200; tries++) expect(tries).toBeLessThan(200);
    expect((await ask(origin, "/status")).json).toMatchObject({ state: "following", ready: true });
    // A message of another kind changes nothing.
    served.port1.postMessage({ type: "unknown" });
    served.port1.postMessage("text");
    served.port1.postMessage(null);
    expect((await ask(origin, "/status")).json).toMatchObject({ state: "following" });
    served.port1.postMessage({ type: "close" });
    await served.next("closed");
    expect(await ask(origin, "/status")).toMatchObject({ status: null, error: "ECONNREFUSED" });
    served.port1.close();
  });

  it("answers JSON with Content-Type, Content-Length (in bytes) and Cache-Control: no-store", async () => {
    // A setting's text that is not ASCII: its length in bytes is not its length in characters.
    const given = { ...snapshot(), config: { core: { start: 1, settings: { label: "héllo ✓ 指数" } } } };
    const served = inThread({ host: "127.0.0.1", port: 0, beat: beat().buffer, snapshot: given });
    const { port } = (await served.next("listening")) as Extract<FromAdmin, { type: "listening" }>;
    const answers = await new Promise<{ headers: Record<string, unknown>; body: string }>((resolve, reject) => {
      import("node:http").then(({ get }) =>
        get(`http://127.0.0.1:${port}/config`, { agent: false }, (answer) => {
          let body = "";
          answer.setEncoding("utf8");
          answer.on("data", (chunk: string) => (body += chunk));
          answer.on("end", () => resolve({ headers: answer.headers, body }));
        }).on("error", reject),
      );
    });
    expect(answers.headers).toMatchObject({
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "content-length": String(Buffer.byteLength(answers.body)),
    });
    expect(Buffer.byteLength(answers.body)).toBeGreaterThan(answers.body.length);
    expect(JSON.parse(answers.body)).toEqual(given.config);
    served.port1.postMessage({ type: "close" });
    await served.next("closed");
    served.port1.close();
  });

  it("/health/live from the heartbeat's age: a tick older than the liveness timeout answers 503", async () => {
    const heartbeat = beat();
    const served = inThread({ host: "127.0.0.1", port: 0, beat: heartbeat.buffer, snapshot: snapshot("following", true, 60_000) });
    const { port } = (await served.next("listening")) as Extract<FromAdmin, { type: "listening" }>;
    const origin = `http://127.0.0.1:${port}`;
    expect(await ask(origin, "/health/live")).toMatchObject({ status: 200, json: { live: true } });
    // The tick as the main thread would have left it 61 s ago.
    Atomics.store(new BigInt64Array(heartbeat.buffer), 0, process.hrtime.bigint() - 61_000_000_000n);
    expect(await ask(origin, "/health/live")).toMatchObject({ status: 503, json: { live: false } });
    heartbeat.tick();
    expect((await ask(origin, "/health/live")).status).toBe(200);
    served.port1.postMessage({ type: "close" });
    await served.next("closed");
    served.port1.close();
  });

  it("an answer that fails is 500 internal-error with a fixed message", async () => {
    const served = inThread({
      host: "127.0.0.1",
      port: 0,
      beat: beat().buffer,
      snapshot: snapshot(),
      answer: async () => {
        throw new Error("postgres://u:hunter2@db/x");
      },
    });
    const { port } = (await served.next("listening")) as Extract<FromAdmin, { type: "listening" }>;
    const answer = await ask(`http://127.0.0.1:${port}`, "/status");
    expect(answer).toMatchObject({ status: 500, json: { error: { code: "internal-error", message: "the admin endpoint failed" } } });
    expect(answer.text).not.toContain("hunter2");
    served.port1.postMessage({ type: "close" });
    await served.next("closed");
    served.port1.close();
  });

  it("a port it cannot listen on: listen-failed with Node.js's code, nothing listening", async () => {
    const held = await heldPort();
    try {
      const served = inThread({ host: "127.0.0.1", port: held.port, beat: beat().buffer, snapshot: snapshot() });
      expect(await served.next("listen-failed")).toEqual({
        type: "listen-failed",
        code: "EADDRINUSE",
        message: expect.stringContaining("EADDRINUSE"),
      });
      expect(served.messages.some((message) => message.type === "listening")).toBe(false);
      served.port1.close();
    } finally {
      await held.release();
    }
  });

  it("closing ends the connections still open, and is answered closed once", async () => {
    const served = inThread({ host: "127.0.0.1", port: 0, beat: beat().buffer, snapshot: snapshot() });
    const { port } = (await served.next("listening")) as Extract<FromAdmin, { type: "listening" }>;
    const { connect } = await import("node:net");
    const idle = connect(port, "127.0.0.1");
    await once(idle, "connect");
    const ended = once(idle, "close");
    served.port1.postMessage({ type: "close" });
    served.port1.postMessage({ type: "close" });
    await served.next("closed");
    await ended;
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(served.messages.filter((message) => message.type === "closed")).toHaveLength(1);
    served.port1.close();
  });
});

describe("startAdminServer: the admin listener in a worker thread of its own", () => {
  it("listens on the address, answers what it is published, and closing ends its thread", async () => {
    const heartbeat = beat();
    const server = await startAdminServer({ address: "127.0.0.1:0", beat: heartbeat.buffer, snapshot: snapshot("starting", false) });
    servers.push(server);
    expect(server.host).toBe("127.0.0.1");
    expect(server.port).toBeGreaterThanOrEqual(10_000);
    expect(server.threadId).toBeGreaterThan(0);
    const origin = `http://127.0.0.1:${server.port}`;
    expect((await ask(origin, "/status")).json).toMatchObject({ state: "starting" });
    server.publish(snapshot("following", true));
    for (let tries = 0; (await ask(origin, "/health/ready")).status !== 200; tries++) expect(tries).toBeLessThan(200);
    const began = Date.now();
    const closing = server.close();
    expect(server.close()).toBe(closing);
    await closing;
    // It closed gracefully: the listener told it closed, so it never waited out the timeout before ending the thread.
    expect(Date.now() - began).toBeLessThan(ADMIN_CLOSE_TIMEOUT_MS);
    expect(server.threadId).toBe(-1);
    expect(await ask(origin, "/status")).toMatchObject({ status: null, error: "ECONNREFUSED" });
    // Publishing to a closed server is harmless.
    server.publish(snapshot());
  });

  it("answers within 1 s while this thread is blocked: the worker needs nothing of it", async () => {
    const server = await startAdminServer({ address: "127.0.0.1:0", beat: beat().buffer, snapshot: snapshot() });
    servers.push(server);
    const prober = await startProber(`http://127.0.0.1:${server.port}`, ENDPOINTS, 100);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const hold = newHold();
    hold.start = process.hrtime.bigint();
    const until = Date.now() + 3_000;
    while (Date.now() < until) {
      // This thread blocked, as a callback's synchronous loop blocks the runner's.
    }
    hold.end = process.hrtime.bigint();
    const records = await prober.stop();
    expect(timingProblems(records, hold, { "/health/live": [200], "/health/ready": [200], "/status": [200], "/config": [200] })).toEqual([]);
  }, 30_000);

  it("a port it cannot listen on rejects with Node.js's code and syscall listen (the runner's listen-failed); its thread ends", async () => {
    const held = await heldPort();
    try {
      const failure = await startAdminServer({ address: `127.0.0.1:${held.port}`, beat: beat().buffer, snapshot: snapshot() }).then(
        () => {
          throw new Error("expected a refusal");
        },
        (error: unknown) => error,
      );
      expect(failure).toMatchObject({
        code: "EADDRINUSE",
        syscall: "listen",
        message: `admin listener: listen EADDRINUSE on 127.0.0.1:${held.port}`,
      });
      expect(reasonOf(failure)).toEqual({ code: "listen-failed", height: null, module: null, point: null });
    } finally {
      await held.release();
    }
  });

  it("refuses an address that is not host:port before any thread starts", async () => {
    await expect(startAdminServer({ address: "8081", beat: beat().buffer, snapshot: snapshot() })).rejects.toThrow(TypeError);
  });

  it("tells onFailure when its worker fails after it listened, and closing it then is harmless", async () => {
    const failing = new URL(
      `data:text/javascript,${encodeURIComponent(`
        import { parentPort, workerData } from "node:worker_threads";
        parentPort.postMessage({ type: "listening", host: workerData.host, port: 54321 });
        setTimeout(() => { throw new Error("the admin worker broke"); }, 20);
      `)}`,
    );
    const failures: unknown[] = [];
    const server = await startAdminServer(
      { address: "127.0.0.1:0", beat: beat().buffer, snapshot: snapshot(), onFailure: (error) => failures.push(error) },
      failing,
    );
    for (let tries = 0; server.threadId !== -1; tries++) {
      expect(tries).toBeLessThan(400);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    expect(failures).toEqual([expect.objectContaining({ message: "the admin worker broke" })]);
    await server.close();
  });

  it("a worker that ends before it listens rejects", async () => {
    const quits = new URL(`data:text/javascript,${encodeURIComponent("process.exit(7);")}`);
    await expect(startAdminServer({ address: "127.0.0.1:0", beat: beat().buffer, snapshot: snapshot() }, quits)).rejects.toThrow(
      "the admin worker exited with code 7 before it listened",
    );
  });

  it("the worker's entry: the built worker.js beside the server, or the TypeScript sources through Node.js's type stripping", () => {
    const directory = mkdtempSync(join(tmpdir(), "umbradb-admin-entry-"));
    try {
      const server = pathToFileURL(join(directory, "server.js")).href;
      // From the sources (no worker.js beside): a module that maps the sources' `.js` imports to their `.ts` files.
      const source = workerEntry(server);
      expect(source.protocol).toBe("data:");
      const code = decodeURIComponent(source.href.slice("data:text/javascript,".length));
      expect(code).toContain("registerHooks");
      expect(code).toContain(JSON.stringify(pathToFileURL(join(directory, "worker.ts")).href));
      // From a build: the compiled worker.js itself.
      writeFileSync(join(directory, "worker.js"), "");
      expect(workerEntry(server).href).toBe(pathToFileURL(join(directory, "worker.js")).href);
      expect(workerEntry().protocol).toBe("data:");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
