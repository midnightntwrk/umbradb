import { createServer, type Server, type Socket, connect } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import { inMemoryBlock } from "../../src/runner/in-memory-source.js";
import { PRIVATE_BACKENDS, type PrivateBackend, READER_LOGIN, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPrivate, type PrivateSeen, startPublicCore } from "./builds.js";
import { endedWithin, rawClient } from "./raw-client.js";

/**
 * Block intake over the real process transport (task 14.2; PP-3, PP-4, PP-5; A114 `[FAULT]` with the transport itself,
 * not task 14.1's stand-in `./link.ts`): a private process with `coreTransport` is woken by the core's `committed`
 * messages and by every (re)connection only — no poll (14.1's 1 s poll is the wake-up only without a transport) —, and
 * on PGlite reads its public database through the core (`read` messages), on PostgreSQL directly (`publicDatabase`).
 * A proxy between the two (`TransportProxy`) drops the transport: every connection closed and every new one refused
 * while the public cursor advances 50 heights, the `committed` messages of those heights going nowhere; once it lets
 * connections through again, the private process reconnects (IN-10's back-off) and processes the 50 heights in order.
 */

/** A TCP proxy to `target` that can drop every connection and refuse new ones (see the module comment). */
class TransportProxy {
  readonly #server: Server;
  readonly #sockets = new Set<Socket>();
  #open = true;
  /** Connections refused while dropped. */
  refused = 0;

  private constructor(server: Server, target: { host: string; port: number }) {
    this.#server = server;
    server.on("connection", (incoming) => {
      if (!this.#open) {
        this.refused += 1;
        incoming.destroy();
        return;
      }
      const outgoing = connect(target.port, target.host);
      for (const socket of [incoming, outgoing]) {
        this.#sockets.add(socket);
        socket.on("close", () => this.#sockets.delete(socket));
        socket.on("error", () => undefined);
      }
      incoming.pipe(outgoing).pipe(incoming);
      incoming.on("close", () => outgoing.destroy());
      outgoing.on("close", () => incoming.destroy());
    });
  }

  static async start(address: string): Promise<TransportProxy> {
    const colon = address.lastIndexOf(":");
    const server = createServer();
    const proxy = new TransportProxy(server, { host: address.slice(0, colon), port: Number(address.slice(colon + 1)) });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    return proxy;
  }

  get address(): string {
    const bound = this.#server.address() as { port: number };
    return `127.0.0.1:${bound.port}`;
  }

  /** Closes every connection and refuses new ones. */
  drop(): void {
    this.#open = false;
    for (const socket of this.#sockets) socket.destroy();
  }

  /** Lets connections through again. */
  connect(): void {
    this.#open = true;
  }

  async close(): Promise<void> {
    this.drop();
    await new Promise<void>((resolve) => this.#server.close(() => resolve()));
  }
}

const writes = (seen: readonly PrivateSeen[], from = 0): bigint[] =>
  seen.slice(from).filter((call) => call.point === "on-db-write").map((call) => call.height);

const heights = (from: number, to: number): bigint[] => Array.from({ length: to - from + 1 }, (_, i) => BigInt(from + i));

async function rowsIn(db: TestDatabase): Promise<[number, string][]> {
  const rows = await db.read((read) => read.query("SELECT height::int AS h, public_hash FROM pm.rows ORDER BY height"), privateCursorHeight);
  return rows.map((row) => [Number(row.h), Buffer.from(row.public_hash as Uint8Array).toString("hex")]);
}

const FROM = 5;
const TO = FROM + 50;

describe.each(PRIVATE_BACKENDS)("intake over the process transport on $name (PP-3, A114)", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("A114: dropped while the public cursor advances 50 heights, the private process processes them in order after reconnecting", async () => {
    const publicDb = await backend.database("public");
    const privateDb = await backend.database("private");
    const core = await startPublicCore({ database: publicDb.setting, head: BigInt(FROM), extra: { listen: { transport: "127.0.0.1:0" } } });
    const proxy = await TransportProxy.start(core.transport());
    const seen: PrivateSeen[] = [];
    const lines: string[] = [];
    const running = launchPrivate({
      database: privateDb.setting,
      seen,
      lines,
      coreTransport: proxy.address,
      ...(backend.kind === "postgres" ? { publicDatabase: publicDb.readerSetting as string } : {}),
    });
    let cursorDuringDrop: bigint | null;
    let reconnectedAt: number;
    const address = core.transport();
    try {
      await running.handle.started;
      await running.reach(BigInt(FROM));
      // Woken by committed messages: a height the core commits reaches the private process.
      await core.advance(BigInt(FROM + 1));
      await running.reach(BigInt(FROM + 1));
      proxy.drop();
      await core.advance(BigInt(TO));
      // Time for anything else that could wake the private process to do so (14.1's poll would, every second).
      await sleep(3_000);
      cursorDuringDrop = running.handle.status().cursor;
      reconnectedAt = seen.length;
      proxy.connect();
      await running.reach(BigInt(TO));
      await running.stop();
      // The private process's stop closed its connection: the core sees it go.
      const deadline = Date.now() + 20_000;
      const disconnects = () => core.lines.filter((line) => line === "transport: instance instance-1 disconnected").length;
      while (disconnects() < 2 && Date.now() < deadline) await sleep(20);
      // Before the core stops (which would close every connection itself).
      expect(disconnects()).toBe(2);
    } finally {
      await running.stop();
      await proxy.close();
      await core.stop();
    }
    // Each hello gave the private cursor: S − 1 before the first commit (on PGlite it connects at startup, to read), or
    // the heights it processed reading PostgreSQL directly before its first wait; then the height it had reached.
    const connects = core.lines.filter((line) => line.startsWith("transport: instance instance-1 connected at "));
    expect(connects[0]).toBe(`transport: instance instance-1 connected at ${backend.kind === "pglite" ? 0 : FROM}`);
    expect(connects.at(-1)).toBe(`transport: instance instance-1 connected at ${FROM + 1}`);
    // The core's stop closed its transport: nothing listens there.
    expect((await endedWithin(rawClient(`ws://${address}/`))).opened).toBe(false);
    // On PostgreSQL the public reads go to publicDatabase directly, never through the core, with the transport there.
    if (backend.kind === "postgres") {
      expect((await publicDb.sessions?.())?.some((session) => session.login === READER_LOGIN)).toBe(true);
    }
    expect(cursorDuringDrop).toBe(BigInt(FROM + 1));
    expect(proxy.refused).toBeGreaterThan(0);
    expect(writes(seen, reconnectedAt)).toEqual(heights(FROM + 2, TO));
    expect(writes(seen).slice(0, FROM + 1)).toEqual(heights(1, FROM + 1));
    // Each row holds the public block's hash at its height, read from the public database (through the core on PGlite).
    const rows = await rowsIn(privateDb);
    expect(rows).toEqual(heights(1, TO).map((h) => [Number(h), Buffer.from(inMemoryBlock(h).hash).toString("hex")]));
    expect(lines.join("\n")).toMatch(/transport: .*connecting again in \d+ ms/);
    expect(lines.filter((line) => line.includes("transport: connected to the core")).length).toBeGreaterThanOrEqual(2);
  }, TEST_TIMEOUT_MS);
});
