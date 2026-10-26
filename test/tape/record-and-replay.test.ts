import { describe, expect, it } from "vitest";
import {
  type ConnectSocket,
  connectWebSocket,
  NodeClient,
  type NodeClientOptions,
  type NodeRetry,
} from "../../src/node/index.js";
import {
  errorText,
  firstDifference,
  in8Tour,
  readTape,
  recordAndReplay,
  RecordingError,
  type ReplaySession,
  type TapeRecord,
  tapeId,
} from "../../tools/tape/index.js";
import { MAINNET, MAINNET_BLOCK, recorded } from "../node/fake-node.js";
import { in8Methods, outsideIn8 } from "../node/in8.js";
import { ManualTimers, until } from "../node/manual-timers.js";
import { type Script, ScriptedNode, type Step } from "./scripted-node.js";

/**
 * A71 `[CI]` through the node client of `src/node/` (`openspec/changes/core-arch/acceptance.md` §9; TT-4; task 9.2),
 * unchanged: `recordAndReplay` (`tools/tape/replay-check.ts`) runs a `NodeClient` session through the recording
 * builder against a scripted node, replays the tape it recorded through the tape node with a new client, and compares
 * every frame each connection sent and received. Its default session, the IN-8 tour, is what A71's `[MANUAL]` half runs
 * against a real Midnight node (`tools/tape/main.ts check`); here the scripted node answers it with the mainnet answers
 * task 10.1 recorded (`test/node/fixtures/mainnet-answers.json`).
 */

const TEST_TIMEOUT_MS = 60_000;
// The heartbeat moved out of the way: the longest timer Node.js keeps (these clients may run on the real clock).
const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });

/** The header the scripted node notifies: the recorded mainnet header. */
const HEADER = recorded("chain_getHeader").result;

/** Answers the IN-8 tour from the recorded mainnet answers; `extra` overrides a method. */
function mainnetScript(extra: (request: { method: string; params: unknown }) => readonly Step[] | undefined = () =>
  undefined): Script {
  const subscriptions = new Map<string, number>();
  return (request) => {
    const special = extra(request);
    if (special !== undefined) return special;
    const notification = {
      chain_subscribeNewHeads: "chain_newHead",
      chain_subscribeFinalizedHeads: "chain_finalizedHead",
    }[request.method];
    if (notification !== undefined) {
      const made = (subscriptions.get(request.method) ?? 0) + 1;
      subscriptions.set(request.method, made);
      const id = `${notification}-${made}`;
      const count = request.method === "chain_subscribeFinalizedHeads" ? 2 : 1;
      const notify: Step = { notify: notification, subscription: id, result: HEADER };
      return [{ result: id }, ...Array.from({ length: count }, () => notify)];
    }
    if (request.method === "chain_getFinalizedHead") return [{ result: MAINNET_BLOCK }];
    if (request.method === "state_getMetadata") return [{ result: "0x6d657461" }];
    const call = MAINNET.calls.find(
      (candidate) =>
        candidate.method === request.method && JSON.stringify(candidate.params) === JSON.stringify(request.params),
    );
    if (call === undefined) return [{ error: { code: -32000, message: `no answer for ${request.method}` } }];
    return [{ result: call.result }];
  };
}

async function withScripted<T>(script: Script, body: (node: ScriptedNode) => Promise<T>): Promise<T> {
  const node = await ScriptedNode.start(script);
  try {
    return await body(node);
  } finally {
    await node.stop();
  }
}

const methodsOf = (records: readonly TapeRecord[]): string[] =>
  records.flatMap((record) => ("method" in record ? [record.method] : []));

describe("A71 through the node client", { timeout: TEST_TIMEOUT_MS }, () => {
  it("the IN-8 tour, recorded and replayed: every frame of every connection byte-identical", async () => {
    await withScripted(mainnetScript(), async (node) => {
      const result = await recordAndReplay({ node: node.url, client: { connect: quietConnect } });
      expect(result.difference).toBeUndefined();
      expect(result.identical).toBe(true);
      expect(result.replayed).toEqual(result.recorded);
      expect(result.recorded).toHaveLength(1);
      // Twelve answers, the two subscriptions' three notifications.
      expect(result.recorded[0]?.sent).toHaveLength(12);
      expect(result.recorded[0]?.received).toHaveLength(15);
      expect(result.recorded[0]?.received).toEqual(node.sent[0]);
      // The tour makes every call IN-8 allows, and no other.
      expect(new Set(methodsOf(result.records))).toEqual(new Set(in8Methods()));
      expect(outsideIn8(methodsOf(result.records))).toEqual([]);
      expect(result.id).toBe(tapeId(result.bytes));
      expect(readTape(result.bytes).records).toEqual(result.records);
    });
  });

  it("a drop, the client's back-off, its new subscription and its retried call: identical frames", async () => {
    const timers = new ManualTimers();
    const retries: NodeRetry[] = [];
    let blocks = 0;
    const script = mainnetScript((request) => {
      if (request.method !== "chain_getBlock") return undefined;
      blocks += 1;
      return blocks === 1 ? [{ drop: true }] : undefined;
    });
    const events: string[][] = [];
    const session: ReplaySession = async (client) => {
      const seen: string[] = [];
      events.push(seen);
      const start = retries.length;
      await client.subscribeFinalizedHeads({
        header: (header) => seen.push(`header ${header.number}`),
        restarted: () => seen.push("restarted"),
      });
      const head = await client.finalizedHead();
      const block = client.block(head);
      await until(() => retries.length - start === 2, "the drop's retries");
      expect(retries.slice(start).map((retry) => [retry.operation, retry.delayMs])).toEqual([
        ["connect", 1000],
        ["chain_getBlock", 1000],
      ]);
      await timers.advance(1000);
      expect((await block).extrinsics.length).toBeGreaterThan(0);
      await client.blockHash(0n);
    };
    const options: Omit<NodeClientOptions, "url"> = {
      timers,
      connect: quietConnect,
      onRetry: (retry) => {
        retries.push(retry);
      },
    };
    await withScripted(script, async (node) => {
      const result = await recordAndReplay({ node: node.url, session, client: options });
      expect(result.difference).toBeUndefined();
      expect(result.replayed).toEqual(result.recorded);
      expect(result.recorded).toHaveLength(2);
      expect(events).toHaveLength(2);
      expect(events[1]).toEqual(events[0]);
      expect(events[0]).toEqual([
        "header 3174332",
        "header 3174332",
        "restarted",
        "header 3174332",
        "header 3174332",
      ]);
      const kinds = result.records.map((record) => Object.keys(record)[0]);
      expect(kinds).toEqual([
        "subscribe",
        "notify",
        "notify",
        "method",
        "fault",
        "disconnect",
        "subscribe",
        "notify",
        "notify",
        "method",
        "method",
      ]);
      expect(result.records[4]).toEqual({ fault: "timeout", method: "chain_getBlock", params: [MAINNET_BLOCK] });
    });
  });

  it("reports the first difference when the session does not make the same calls twice", async () => {
    let runs = 0;
    const session: ReplaySession = async (client) => {
      runs += 1;
      await client.blockHash(runs === 1 ? 0n : 3174332n).catch(() => undefined);
    };
    await withScripted(mainnetScript(), async (node) => {
      const result = await recordAndReplay({ node: node.url, session, client: { connect: quietConnect } });
      expect(result.identical).toBe(false);
      expect(result.difference).toBe(
        'connection 1, frame 1 sent: recorded {"jsonrpc":"2.0","id":1,"method":"chain_getBlockHash","params":[0]}, ' +
          'replayed {"jsonrpc":"2.0","id":1,"method":"chain_getBlockHash","params":[3174332]}',
      );
    });
  });

  it("reports a replayed session that fails as the difference", async () => {
    let runs = 0;
    const session: ReplaySession = async (client) => {
      runs += 1;
      await client.blockHash(runs === 1 ? 0n : 7n);
    };
    await withScripted(mainnetScript(), async (node) => {
      const result = await recordAndReplay({ node: node.url, session, client: { connect: quietConnect } });
      expect(result.identical).toBe(false);
      expect(result.difference).toMatch(/^the replayed session failed: .*not-on-tape: chain_getBlockHash/);
    });
  });

  it("throws the recorded session's error, and the builder's refusal before it", async () => {
    await withScripted(mainnetScript(), async (node) => {
      const failing: ReplaySession = async () => {
        throw new Error("the session's own error");
      };
      await expect(recordAndReplay({ node: node.url, session: failing })).rejects.toThrow("the session's own error");
    });
    const spelled = mainnetScript((request) =>
      request.method === "chain_getBlockHash" ? [{ raw: '{"jsonrpc":"2.0","result":"0x00","id":1}' }] : undefined,
    );
    await withScripted(spelled, async (node) => {
      const error = await recordAndReplay({ node: node.url, client: { connect: quietConnect } }).catch(
        (caught: unknown) => caught,
      );
      expect(error).toBeInstanceOf(RecordingError);
      expect(error).toMatchObject({ reason: "not-replayable" });
    });
  });

  it("throws a client it cannot make, having stopped the builder", async () => {
    await withScripted(mainnetScript(), async (node) => {
      await expect(recordAndReplay({ node: node.url, client: { callTimeoutMs: -1 } })).rejects.toMatchObject({
        code: "invalid-configuration",
      });
      expect(node.connections).toBe(0);
    });
  });

  it("the tour fails at once against a node it cannot reach, and when headers do not come in time", async () => {
    await expect(recordAndReplay({ node: "ws://127.0.0.1:1" })).rejects.toMatchObject({ code: "node-unreachable" });
    const silent = mainnetScript((request) =>
      request.method === "chain_subscribeFinalizedHeads" ? [{ result: "quiet" }] : undefined,
    );
    await withScripted(silent, async (node) => {
      const client = new NodeClient({ url: node.url, connect: quietConnect });
      try {
        await expect(in8Tour(client, { headerTimeoutMs: 50 })).rejects.toThrow(
          "the IN-8 tour waited 50 ms for 1 new head and 2 finalized heads, and received 1 and 0",
        );
      } finally {
        await client.close();
      }
    });
  });

  it("the tour waits for a new head too, not only the finalized ones", async () => {
    const quiet = mainnetScript((request) =>
      request.method === "chain_subscribeNewHeads" ? [{ result: "quiet" }] : undefined,
    );
    await withScripted(quiet, async (node) => {
      const client = new NodeClient({ url: node.url, connect: quietConnect });
      try {
        await expect(in8Tour(client, { headerTimeoutMs: 50 })).rejects.toThrow(
          "the IN-8 tour waited 50 ms for 1 new head and 2 finalized heads, and received 0 and 2",
        );
      } finally {
        await client.close();
      }
    });
  });

  it("the tour fails when a header cannot be read", async () => {
    const unreadable = mainnetScript((request) =>
      request.method === "chain_subscribeNewHeads"
        ? [{ result: "n" }, { notify: "chain_newHead", subscription: "n", result: { number: "not hex" } }]
        : undefined,
    );
    await withScripted(unreadable, async (node) => {
      const client = new NodeClient({ url: node.url, connect: quietConnect });
      try {
        await expect(in8Tour(client)).rejects.toMatchObject({ code: "node-error" });
      } finally {
        await client.close();
      }
    });
  });
});

describe("errorText", () => {
  it("puts an error's code first unless its message starts with it", () => {
    expect(errorText(Object.assign(new Error("lost"), { code: "node-unreachable" }))).toBe("node-unreachable: lost");
    expect(errorText(Object.assign(new Error("cannot-record in session 1"), { code: "cannot-record" }))).toBe(
      "cannot-record in session 1",
    );
    expect(errorText(Object.assign(new Error("no code"), { code: 7 }))).toBe("no code");
    expect(errorText(new Error("plain"))).toBe("plain");
    expect(errorText("thrown text")).toBe("thrown text");
  });
});

describe("firstDifference", () => {
  const one = [{ sent: ["a"], received: ["b", "c"] }];
  it("names the first frame or count that differs", () => {
    expect(firstDifference(one, [{ sent: ["a"], received: ["b", "c"] }])).toBeUndefined();
    expect(firstDifference(one, [])).toBe("recorded 1 connections, replayed 0");
    expect(firstDifference(one, [{ sent: ["a", "x"], received: ["b", "c"] }])).toBe(
      "connection 1, frame 2 sent: recorded nothing, replayed x",
    );
    expect(firstDifference(one, [{ sent: ["a"], received: ["b"] }])).toBe(
      "connection 1, frame 2 received: recorded c, replayed nothing",
    );
    expect(firstDifference(one, [{ sent: ["a"], received: ["b", "d"] }])).toBe(
      "connection 1, frame 2 received: recorded c, replayed d",
    );
    const long = "y".repeat(300);
    expect(firstDifference([{ sent: [long], received: [] }], [{ sent: ["z"], received: [] }])).toBe(
      `connection 1, frame 1 sent: recorded ${"y".repeat(200)}…, replayed z`,
    );
  });
});
