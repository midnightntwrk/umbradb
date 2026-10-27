import { setTimeout as sleep } from "node:timers/promises";
import { describe, expect, it } from "vitest";
import { NetworkBroker } from "../../browser/src/net/broker.js";
import { createServer } from "../../browser/src/net/http.js";
import { connect, listen, unlisten, useNetwork } from "../../browser/src/net/network.js";
import { PortSocket } from "../../browser/src/net/socket.js";
import { WebSocket, WebSocketServer } from "../../browser/src/net/ws.js";

/**
 * The page's message network, which carries the process transport between the browser's workers (task 16.1;
 * `browser/src/net/`), in one Node.js process over Node.js's own `MessageChannel`: the broker hands each connection a
 * channel, and the sockets on it do what `src/private/` needs of `ws` — text both ways, a ping answered by a pong, a
 * close whose code and reason both sides see (PP-6's `report-hash-mismatch` is one), `terminate` as 1006, a refused
 * connection, an address in use. Chrome runs the same code in `browser.test.ts` (A129).
 */

/** The next event `name` of `emitter`, with its arguments. */
const next = (emitter: PortSocket | WebSocket, name: string): Promise<unknown[]> =>
  new Promise((resolve) => emitter.once(name, (...args: unknown[]) => resolve(args)));

const broker = new NetworkBroker();
useNetwork(broker.join());

/** A connected pair of sockets: the accepting side's and the connecting side's. */
async function pair(address: string): Promise<{ readonly server: PortSocket; readonly client: PortSocket }> {
  const accepted = new Promise<MessagePort>((resolve) => listen(address, resolve));
  const port = await connect(address);
  const server = new PortSocket();
  server.attach(await accepted);
  const client = new PortSocket();
  client.attach(port);
  unlisten(address);
  return { server, client };
}

describe("the page's message network (task 16.1)", () => {
  it("connects through the broker, carries text both ways in order, and answers a ping with a pong", async () => {
    const listening = new Promise<MessagePort>((resolve) => listen("core:10", resolve));
    await sleep(20);
    expect(broker.addresses()).toContain("core:10");
    unlisten("core:10");
    await sleep(20);
    expect(broker.addresses()).not.toContain("core:10");
    void listening;
    const { server, client } = await pair("core:11");
    const received = next(server, "message");
    client.send("hello");
    const [data, binary] = await received;
    expect(String(data)).toBe("hello");
    expect(binary).toBe(false);
    const texts: string[] = [];
    client.on("message", (text: unknown) => texts.push(String(text)));
    for (const text of ["a", "b", "c"]) server.send(text);
    const pong = next(client, "pong");
    client.ping();
    await pong;
    await sleep(10);
    expect(texts).toEqual(["a", "b", "c"]);
    expect(client.readyState).toBe(client.OPEN);
    expect(client.bufferedAmount).toBe(0);
    client.terminate();
  });

  it("lets both sides see a close's code and reason, and terminate as 1006", async () => {
    const first = await pair("core:12");
    const atServer = next(first.server, "close");
    const atClient = next(first.client, "close");
    first.server.close(1008, "report-hash-mismatch");
    for (const [code, reason] of [await atServer, await atClient]) {
      expect(code).toBe(1008);
      expect(String(reason)).toBe("report-hash-mismatch");
    }
    expect(first.server.readyState).toBe(first.server.CLOSED);
    first.server.send("dropped");
    first.server.close(1000, "again");

    const second = await pair("core:13");
    const cut = next(second.server, "close");
    second.client.terminate();
    const [code, reason] = await cut;
    expect(code).toBe(1006);
    expect(String(reason)).toBe("");
  });

  it("refuses a connection nothing listens for, and an address already listened at", async () => {
    await expect(connect("core:14")).rejects.toMatchObject({ code: "ECONNREFUSED" });
    listen("core:15", () => undefined);
    expect(() => listen("core:15", () => undefined)).toThrow(expect.objectContaining({ code: "EADDRINUSE" }));
    unlisten("core:15");
    unlisten("core:15");
    await expect(connect("core:15")).rejects.toMatchObject({ code: "ECONNREFUSED" });
  });

  it("serves ws's WebSocket and noServer WebSocketServer over node:http's createServer and upgrade", async () => {
    const server = createServer();
    const wss = new WebSocketServer({ noServer: true });
    const clients: PortSocket[] = [];
    server.on("upgrade", (request: unknown, socket: { port: MessagePort }, head: unknown) =>
      wss.handleUpgrade(request, socket, head, (client) => {
        clients.push(client);
        client.on("message", (text: unknown) => client.send(`echo ${String(text)}`));
      }),
    );
    await new Promise<void>((resolve) => server.listen(16, "core", resolve));
    expect(server.address()).toEqual({ address: "core", port: 16, family: "message-channel" });

    const socket = new WebSocket("ws://core:16/");
    expect(socket.readyState).toBe(socket.CONNECTING);
    await next(socket, "open");
    const echoed = next(socket, "message");
    socket.send("hi");
    expect(String((await echoed)[0])).toBe("echo hi");

    const refused = new WebSocket("ws://core:17/");
    const [error] = await next(refused, "error");
    expect(error).toMatchObject({ code: "ECONNREFUSED" });
    expect(refused.readyState).toBe(refused.CLOSED);
    const tls = new WebSocket("wss://core:16/");
    const [tlsError] = await next(tls, "error");
    expect(tlsError).toMatchObject({ code: "ERR_TLS_UNAVAILABLE" });

    const early = new WebSocket("ws://core:16/");
    const earlyClosed = next(early, "close");
    early.close();
    expect((await earlyClosed)[0]).toBe(1006);

    const listening = new Promise<void>((resolve) => server.close(resolve));
    await listening;
    expect(server.address()).toBeNull();
    await expect(connect("core:16")).rejects.toMatchObject({ code: "ECONNREFUSED" });
    const taken = createServer();
    const second = createServer();
    await new Promise<void>((resolve) => taken.listen(18, "core", resolve));
    const failed = new Promise<unknown>((resolve) => second.once("error", resolve));
    second.listen(18, "core");
    expect(await failed).toMatchObject({ code: "EADDRINUSE" });
    taken.close();
    await new Promise<void>((resolve) => wss.close(resolve));
    socket.terminate();
    for (const client of clients) client.terminate();
  });
});
