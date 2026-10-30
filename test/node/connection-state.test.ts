import { describe, expect, it } from "vitest";
import { type ConnectSocket, NodeClient, type NodeClientOptions, type NodeSocketEvents } from "../../src/node/index.js";
import { ManualTimers, turns } from "./manual-timers.js";

/**
 * The node connection's state as `/status` shows it. {@link NodeClient.connection} is:
 * - `connecting` before the first connection opened (the client unused, or its first attempt pending);
 * - `connected` while a connection is open;
 * - `retrying` from a failed or lost connection until the next one opens (its back-off and each attempt);
 * - `closed` once the client is closed.
 *
 * `onConnectionChange` is told each change once, in order, and nothing else. The sockets are driven by hand and the
 * back-off runs on a clock moved by hand (`./manual-timers.ts`): no network. [AE-5, A168]
 */

/** One socket the client asked for, driven by the test. */
interface HandSocket {
  readonly events: NodeSocketEvents;
  /** Whether `closed` was reported for it. */
  ended: boolean;
}

/** A connector whose sockets the test opens, fails and ends by hand. */
class HandSockets {
  readonly made: HandSocket[] = [];

  readonly connect: ConnectSocket = (_url, events) => {
    const socket: HandSocket = { events, ended: false };
    this.made.push(socket);
    return {
      send: () => undefined,
      // The client's own close: the socket reports it ended, as a WebSocket's close frame would make it.
      close: () => this.end(socket, { kind: "closed", code: 1000 }),
    };
  };

  /** The last socket asked for. */
  get last(): HandSocket {
    const socket = this.made.at(-1);
    if (socket === undefined) throw new Error("no socket was asked for");
    return socket;
  }

  open(socket: HandSocket = this.last): void {
    socket.events.open();
  }

  /** Reports `failure` for `socket` (once). */
  end(socket: HandSocket = this.last, failure: Parameters<NodeSocketEvents["closed"]>[0] = { kind: "closed", code: 1006 }): void {
    if (socket.ended) return;
    socket.ended = true;
    socket.events.closed(failure);
  }
}

/** A client over hand-driven sockets on a hand-moved clock, recording every connection change it reports. */
function handClient(options: Partial<NodeClientOptions> = {}) {
  const sockets = new HandSockets();
  const timers = new ManualTimers();
  const changes: string[] = [];
  const client = new NodeClient({
    url: "ws://node.test:9944",
    connect: sockets.connect,
    timers,
    onConnectionChange: (connection) => changes.push(connection),
    ...options,
  });
  return { client, sockets, timers, changes };
}

/** Settles `promise` to its rejection (attached at once, so no rejection goes unhandled meanwhile). */
const settled = (promise: Promise<unknown>): Promise<unknown> => promise.then(() => undefined, (error: unknown) => error);

describe("the node connection's state (AE-5; task 8.3a)", () => {
  it("is connecting before the first connection opened, connected once it did, and closed once closed", async () => {
    const { client, sockets, changes } = handClient();
    // Not used yet: the first connection is still to come.
    expect(client.connection).toBe("connecting");
    const call = settled(client.finalizedHead());
    expect(sockets.made).toHaveLength(1);
    expect(client.connection).toBe("connecting");
    expect(changes).toEqual([]);
    sockets.open();
    expect(client.connection).toBe("connected");
    expect(changes).toEqual(["connected"]);
    await client.close();
    expect(client.connection).toBe("closed");
    expect(changes).toEqual(["connected", "closed"]);
    expect(await call).toMatchObject({ code: "handle-closed" });
  });

  it("is retrying from a lost connection through its back-off and each attempt, until the next one opens", async () => {
    const { client, sockets, timers, changes } = handClient();
    void settled(client.finalizedHead());
    sockets.open();
    sockets.end(sockets.last, { kind: "closed", code: 1006 });
    expect(client.connection).toBe("retrying");
    expect(changes).toEqual(["connected", "retrying"]);
    // The back-off's end starts an attempt: still retrying, and no change is reported.
    await timers.advance(1_000);
    expect(sockets.made).toHaveLength(2);
    expect(client.connection).toBe("retrying");
    sockets.end(sockets.last, { kind: "connect-failed", code: "ECONNREFUSED" });
    expect(client.connection).toBe("retrying");
    await timers.advance(2_000);
    expect(sockets.made).toHaveLength(3);
    expect(client.connection).toBe("retrying");
    expect(changes).toEqual(["connected", "retrying"]);
    sockets.open();
    expect(client.connection).toBe("connected");
    expect(changes).toEqual(["connected", "retrying", "connected"]);
    await client.close();
    expect(changes).toEqual(["connected", "retrying", "connected", "closed"]);
  });

  it("is retrying when the first connection fails, and closed when closed during the back-off", async () => {
    const { client, sockets, timers, changes } = handClient();
    void settled(client.finalizedHead());
    sockets.end(sockets.last, { kind: "connect-failed", code: "ECONNREFUSED" });
    expect(client.connection).toBe("retrying");
    expect(changes).toEqual(["retrying"]);
    await client.close();
    expect(client.connection).toBe("closed");
    expect(changes).toEqual(["retrying", "closed"]);
    // No attempt after the close, and no change either.
    await timers.advance(60_000);
    expect(sockets.made).toHaveLength(1);
    expect(changes).toEqual(["retrying", "closed"]);
  });

  it("is retrying after an attempt not open within the call timeout, and after a handshake refused", async () => {
    const { client, sockets, timers, changes } = handClient({ callTimeoutMs: 5_000 });
    void settled(client.finalizedHead());
    await timers.advance(5_000);
    expect(client.connection).toBe("retrying");
    expect(changes).toEqual(["retrying"]);
    await timers.advance(1_000);
    sockets.end(sockets.last, { kind: "http-status", status: 401 });
    expect(client.connection).toBe("retrying");
    expect(changes).toEqual(["retrying"]);
    await client.close();
  });

  it("is closed when closed before its first connection opened, or never used; told once, and no more after", async () => {
    const pending = handClient();
    const call = settled(pending.client.finalizedHead());
    await pending.client.close();
    expect(pending.client.connection).toBe("closed");
    expect(pending.changes).toEqual(["closed"]);
    expect(await call).toMatchObject({ code: "handle-closed" });
    // Its socket's own end after the close changes nothing, nor does a second close.
    pending.sockets.end(pending.sockets.last);
    await pending.client.close();
    await turns();
    expect(pending.changes).toEqual(["closed"]);

    const unused = handClient();
    await unused.client.close();
    expect(unused.client.connection).toBe("closed");
    expect(unused.changes).toEqual(["closed"]);
    expect(unused.sockets.made).toHaveLength(0);
  });

  it("works without onConnectionChange", async () => {
    const sockets = new HandSockets();
    const client = new NodeClient({ url: "ws://node.test:9944", connect: sockets.connect, timers: new ManualTimers() });
    void settled(client.finalizedHead());
    sockets.open();
    expect(client.connection).toBe("connected");
    sockets.end();
    expect(client.connection).toBe("retrying");
    await client.close();
    expect(client.connection).toBe("closed");
  });
});
