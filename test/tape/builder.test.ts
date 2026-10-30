import { createServer, type Server as NetServer } from "node:net";
import { describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import {
  RecordingError,
  readTape,
  SessionRecording,
  TapeBuilder,
  type TapeRecord,
  tapeId,
  tapeText,
  writeTape,
} from "../../tools/tape/index.js";
import { closeServer, listenOnRandomPort } from "../node/fake-node.js";
import { until } from "../node/manual-timers.js";
import {
  A71_TAPE_ID,
  A71_TAPE_PATH,
  a71TapeText,
  expectRecordReplayIdentical,
  runA71Session,
} from "./builder-checks.js";
import { withNode } from "./checks.js";
import { RawClient } from "./raw-client.js";
import { type Script, ScriptedNode, type Step } from "./scripted-node.js";

/**
 * The recording builder — a WebSocket proxy a client connects to, forwarding to a node and recording the session as a
 * tape — and its rules: what it records for each frame, the order it records in, how a connection's end is recorded,
 * how it starts and stops, and what it refuses. The record-and-replay check itself is `builder-checks.ts`'s;
 * `record-and-replay.test.ts` runs it through the node client of `src/node/`. [A71 CI, TT-4; acceptance §9]
 */

const TEST_TIMEOUT_MS = 60_000;

/** Runs `body` with a scripted node answering by `script` and a builder in front of it; stops both afterwards. */
async function withBuilder<T>(
  script: Script,
  body: (builder: TapeBuilder, node: ScriptedNode) => Promise<T>,
): Promise<T> {
  const node = await ScriptedNode.start(script);
  const builder = await TapeBuilder.start({ node: node.url });
  try {
    return await body(builder, node);
  } finally {
    await builder.stop().catch(() => undefined);
    await node.stop();
  }
}

/** A script answering each method by a fixed list of steps (a method it lacks stays unanswered). */
function answers(table: Readonly<Record<string, readonly Step[]>>): Script {
  return (request) => table[request.method] ?? [];
}

/** What a refused recording left: the builder's error, and the client's connection. */
interface Refusal {
  readonly error: RecordingError;
  readonly client: RawClient;
  readonly close: number;
}

/** Records with `script`, has the client do `act`, and returns the refusal the builder must meet. */
async function refusal(script: Script, act: (client: RawClient) => void): Promise<Refusal> {
  return withBuilder(script, async (builder) => {
    const client = await RawClient.open(builder.url);
    act(client);
    const failure = await builder.failed;
    const close = await client.closed;
    const error = await builder.stop().then(
      () => {
        throw new Error("stop() resolved after a refusal");
      },
      (caught: unknown) => caught,
    );
    expect(error).toBe(failure);
    expect(builder.failure).toBe(failure);
    expect(error).toBeInstanceOf(RecordingError);
    return { error: error as RecordingError, client, close };
  });
}

describe("A71: record and replay give byte-identical answers and notifications", { timeout: TEST_TIMEOUT_MS }, () => {
  it("A71's session, recorded and replayed: the same frames in the same order, the same connection ends", async () => {
    const recorded = await expectRecordReplayIdentical();
    // Nine answers and five notifications; four answers and one notification; none; one answer.
    expect(recorded.frames.map((frames) => frames.texts.length)).toEqual([14, 5, 0, 1]);
    expect(recorded.frames.map((frames) => frames.close)).toEqual([1006, "client", 1006, "client"]);
  });

  it("records the committed tape, written by hand, byte for byte", async () => {
    const recorded = await expectRecordReplayIdentical();
    expect(tapeText(recorded.records)).toBe(a71TapeText());
    expect(tapeId(writeTape(recorded.records))).toBe(A71_TAPE_ID);
    expect(readTape(writeTape(recorded.records)).id).toBe(A71_TAPE_ID);
    expect(String(A71_TAPE_PATH)).toMatch(/a71-recorded\.tape\.jsonl$/);
  });

  it("forwards the node's frames and the client's requests unchanged", async () => {
    const recorded = await expectRecordReplayIdentical();
    expect(recorded.frames[0]?.texts).toEqual(recorded.sent[0]);
    expect(recorded.frames[1]?.texts).toEqual(recorded.sent[1]);
    // The scripted node refused the third handshake, so the client's fourth connection was its third.
    expect(recorded.frames[3]?.texts).toEqual(recorded.sent[2]);
    expect(recorded.received).toHaveLength(15);
    expect(recorded.received[0]).toBe('{"jsonrpc":"2.0","id":1,"method":"system_properties"}');
    expect(recorded.received[5]).toBe('{"jsonrpc":"2.0","id":"six","method":"chain_getFinalizedHead","params":[]}');
    expect(recorded.received[8]).toBe(
      '{"jsonrpc":"2.0","id":9,"method":"state_getMetadata","params":{"at":"0xf2"}}',
    );
  });

  it("the replayed session asks nothing the tape lacks", async () => {
    const recorded = await expectRecordReplayIdentical();
    await withNode(recorded.records, async (node) => {
      await runA71Session(node.url);
      const outcomes = node.calls.map((call) => call.outcome);
      expect(outcomes).not.toContain("not-on-tape");
      expect(outcomes).not.toContain("repeated");
      expect(outcomes.filter((outcome) => outcome === "fault-timeout")).toHaveLength(1);
      expect(node.connections).toBe(4);
    });
  });
});

describe("the builder's records", { timeout: TEST_TIMEOUT_MS }, () => {
  it("records two answers of one method and params in request order, whatever order they came in", async () => {
    const pending: number[] = [];
    const script: Script = (request) => {
      if (request.method === "chain_subscribeNewHeads") return [{ result: "s" }];
      pending.push(request.id as number);
      if (pending.length === 1) return [];
      // The second request is answered first, then a notification, then the first request.
      return [
        { result: "B" },
        { notify: "chain_newHead", subscription: "s", result: 1 },
        { raw: `{"jsonrpc":"2.0","id":${pending[0]},"result":"A"}` },
      ];
    };
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      await client.call("chain_subscribeNewHeads", [], 1);
      client.request("chain_getFinalizedHead", [], 2);
      client.request("chain_getFinalizedHead", [], 3);
      expect((await client.answer(2)).result).toBe("A");
      expect((await client.answer(3)).result).toBe("B");
      await client.close();
      const records = await builder.stop();
      expect(records).toEqual([
        { subscribe: "s", method: "chain_subscribeNewHeads", params: [] },
        { notify: "s", result: 1 },
        { method: "chain_getFinalizedHead", params: [], result: "A" },
        { method: "chain_getFinalizedHead", params: [], result: "B" },
      ]);
      await withNode(records, async (node) => {
        const replay = await RawClient.open(node.url);
        await replay.call("chain_subscribeNewHeads", [], 1);
        replay.request("chain_getFinalizedHead", [], 2);
        replay.request("chain_getFinalizedHead", [], 3);
        // Each request gets the very frame it got through the builder (the order of their arrival may differ).
        await replay.answer(2);
        await replay.answer(3);
        const answerText = (texts: readonly string[], id: number) => texts.find((text) => text.includes(`"id":${id}`));
        expect(answerText(replay.texts, 2)).toBe(answerText(client.texts, 2));
        expect(answerText(replay.texts, 3)).toBe(answerText(client.texts, 3));
        expect(answerText(replay.texts, 3)).toBe('{"jsonrpc":"2.0","id":3,"result":"B"}');
        await replay.close();
      });
    });
  });

  it("records answers of one method with other params in the order they came", async () => {
    let asked = 0;
    const script: Script = () => {
      asked += 1;
      if (asked === 1) return [];
      return [{ result: "two" }, { raw: '{"jsonrpc":"2.0","id":1,"result":"one"}' }];
    };
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      client.request("m", [1], 1);
      client.request("m", [2], 2);
      await client.answer(1);
      await client.close();
      expect(await builder.stop()).toEqual([
        { method: "m", params: [2], result: "two" },
        { method: "m", params: [1], result: "one" },
      ]);
    });
  });

  it("writes every answer that waited once the earlier one of its pair is written, before later frames", async () => {
    let asked = 0;
    const script: Script = (request) => {
      if (request.method === "chain_subscribeNewHeads") return [{ result: "s" }];
      asked += 1;
      if (asked < 3) return [];
      return [
        { raw: '{"jsonrpc":"2.0","id":3,"result":"C"}' },
        { raw: '{"jsonrpc":"2.0","id":2,"result":"B"}' },
        { raw: '{"jsonrpc":"2.0","id":1,"result":"A"}' },
        { notify: "chain_newHead", subscription: "s", result: "after" },
      ];
    };
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      await client.call("chain_subscribeNewHeads", [], "sub");
      for (const id of [1, 2, 3]) client.request("m", [], id);
      await client.waitFor((frame) => frame.params?.result === "after", "the notification after the answers");
      await client.close();
      expect(await builder.stop()).toEqual([
        { subscribe: "s", method: "chain_subscribeNewHeads", params: [] },
        { method: "m", params: [], result: "A" },
        { method: "m", params: [], result: "B" },
        { method: "m", params: [], result: "C" },
        { notify: "s", result: "after" },
      ]);
    });
  });

  it("at a connection's end, writes the faults and the answers that waited in request order", async () => {
    let asked = 0;
    const script: Script = (request) => {
      asked += 1;
      // m #1 never answered; m #2 answered (it waits behind m #1); n never answered; then the drop.
      if (request.method === "m" && asked === 2) return [{ result: "second" }];
      if (request.method === "drop") return [{ drop: true }];
      return [];
    };
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      client.request("m", [], 1);
      await client.call("m", [], 2);
      client.request("n", [], 3);
      client.request("drop", [], 4);
      await client.closed;
      expect(await builder.stop()).toEqual([
        { fault: "timeout", method: "m", params: [] },
        { method: "m", params: [], result: "second" },
        { fault: "timeout", method: "n", params: [] },
        { fault: "timeout", method: "drop", params: [] },
        { disconnect: true },
      ]);
    });
  });

  it("records a subscription answered with an error as a call", async () => {
    const error = { code: -32000, message: "no" };
    await withBuilder(answers({ chain_subscribeNewHeads: [{ error }] }), async (builder) => {
      const client = await RawClient.open(builder.url);
      await client.call("chain_subscribeNewHeads", []);
      await client.close();
      expect(await builder.stop()).toEqual([{ method: "chain_subscribeNewHeads", params: [], error }]);
    });
  });

  it("records a request still waiting for its answer at the node's drop as a timeout fault, last", async () => {
    const script = answers({ a: [{ result: 1 }], b: [{ drop: true }] });
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      client.request("never", [1], 1);
      await client.call("a", [], 2);
      client.request("b", { x: 1 }, 3);
      expect(await client.closed).toBe(1006);
      expect(await builder.stop()).toEqual([
        { method: "a", params: [], result: 1 },
        { fault: "timeout", method: "never", params: [1] },
        { fault: "timeout", method: "b", params: { x: 1 } },
        { disconnect: true },
      ]);
    });
  });

  it("an answer after an earlier request of its pair left unanswered keeps its place behind that fault", async () => {
    let asked = 0;
    const script: Script = (request) => {
      asked += 1;
      if (asked === 1) return [];
      return [{ result: `second ${String(request.id)}` }, { drop: true }];
    };
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      client.request("m", [], 1);
      client.request("m", [], 2);
      expect((await client.answer(2)).result).toBe("second 2");
      await client.closed;
      expect(await builder.stop()).toEqual([
        { fault: "timeout", method: "m", params: [] },
        { method: "m", params: [], result: "second 2" },
        { disconnect: true },
      ]);
    });
  });

  it("records answers to methods other than the two head subscriptions as calls, unsubscribing too", async () => {
    const script = answers({
      chain_unsubscribeNewHeads: [{ result: true }],
      state_subscribeStorage: [{ result: "k" }],
    });
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      await client.call("chain_unsubscribeNewHeads", ["s"]);
      await client.call("state_subscribeStorage", [["0x01"]]);
      await client.close();
      expect(await builder.stop()).toEqual([
        { method: "chain_unsubscribeNewHeads", params: ["s"], result: true },
        { method: "state_subscribeStorage", params: [["0x01"]], result: "k" },
      ]);
    });
  });

  it("ends a session the client ends with a disconnect only when another session follows it", async () => {
    await withBuilder(answers({ m: [{ result: "x" }] }), async (builder) => {
      const first = await RawClient.open(builder.url);
      await first.call("m", []);
      first.request("n", [], 9);
      await first.close();
      const second = await RawClient.open(builder.url);
      await second.call("m", []);
      await second.close();
      expect(builder.sessions).toBe(2);
      expect(await builder.stop()).toEqual([
        { method: "m", params: [], result: "x" },
        { fault: "timeout", method: "n", params: [] },
        { disconnect: true },
        { method: "m", params: [], result: "x" },
      ]);
    });
  });

  it("ends a last session the node ends with a disconnect, as the replay must drop it too", async () => {
    await withBuilder(answers({ m: [{ result: "x" }, { drop: true }] }), async (builder) => {
      const client = await RawClient.open(builder.url);
      await client.call("m", []);
      expect(await client.closed).toBe(1006);
      expect(await builder.stop()).toEqual([{ method: "m", params: [], result: "x" }, { disconnect: true }]);
    });
  });

  it("drops the client once the node's last frame is written out, recording nothing sent meanwhile", async () => {
    const big = "x".repeat(16 * 1024 * 1024);
    const node = await ScriptedNode.start(answers({ big: [{ result: big }, { drop: true }] }));
    let client: RawClient | undefined;
    const ended: string[] = [];
    const builder = await TapeBuilder.start({
      node: node.url,
      onSessionEnd: (session, end, records) => {
        ended.push(`${session} ${end} ${records}`);
        // The builder still writes the answer out to the paused client: what the client sends now is not read, a
        // frame it could not record included.
        client?.request("after", [], 2);
        client?.send("{oops");
      },
    });
    try {
      client = await RawClient.open(builder.url);
      client.pause();
      client.request("big", [], 1);
      await until(() => ended.length === 1, "the node's drop");
      client.resume();
      expect(((await client.answer(1)).result as string).length).toBe(big.length);
      expect(await client.closed).toBe(1006);
      expect(ended).toEqual(["1 node 1"]);
      const records = await builder.stop();
      expect(records).toEqual([{ method: "big", params: [], result: big }, { disconnect: true }]);
      expect(node.received.map((request) => request.method)).toEqual(["big"]);
    } finally {
      await builder.stop().catch(() => undefined);
      await node.stop();
    }
  });

  it("stop() ends a connection the node dropped while its last frames still wait for a paused client", async () => {
    const big = "y".repeat(16 * 1024 * 1024);
    const node = await ScriptedNode.start(answers({ big: [{ result: big }, { drop: true }] }));
    const ended: string[] = [];
    const builder = await TapeBuilder.start({ node: node.url, onSessionEnd: (_session, end) => ended.push(end) });
    try {
      const client = await RawClient.open(builder.url);
      client.pause();
      client.request("big", [], 1);
      await until(() => ended.length === 1, "the node's drop");
      expect(await builder.stop()).toEqual([{ method: "big", params: [], result: big }, { disconnect: true }]);
      client.resume();
      expect(await client.closed).toBe(1006);
    } finally {
      await builder.stop().catch(() => undefined);
      await node.stop();
    }
  });

  it("records nothing the node sends after the client ended the session", async () => {
    const node = await ScriptedNode.start(answers({ m: [{ result: "x" }] }));
    const late = '{"jsonrpc":"2.0","method":"chain_newHead","params":{"subscription":"s","result":1}}';
    const builder = await TapeBuilder.start({
      node: node.url,
      // Sent before the builder closes the node's connection, so it reaches the builder after the session ended.
      onSessionEnd: (_session, end) => {
        if (end === "client") node.send(1, late);
      },
    });
    try {
      const client = await RawClient.open(builder.url);
      await client.call("m", []);
      await client.close();
      // The node's connection ends after the builder read the late frame, which came before the node's close.
      await until(() => node.open === 0, "the node's connection to end");
      expect(await builder.stop()).toEqual([{ method: "m", params: [], result: "x" }]);
    } finally {
      await builder.stop().catch(() => undefined);
      await node.stop();
    }
  });

  it("records a connection whose node handshake fails as a session dropped as it opens", async () => {
    await withBuilder(answers({ m: [{ result: "x" }] }), async (builder, node) => {
      node.refuse = (upgrade) => (upgrade <= 2 ? [503, 404][upgrade - 1] : undefined);
      for (let attempt = 0; attempt < 2; attempt++) {
        const socket = new WebSocket(builder.url);
        socket.on("error", () => {});
        expect(await new Promise((resolve) => socket.on("close", resolve))).toBe(1006);
      }
      const client = await RawClient.open(builder.url);
      expect((await client.call("m", [])).result).toBe("x");
      await client.close();
      expect(await builder.stop()).toEqual([
        { disconnect: true },
        { disconnect: true },
        { method: "m", params: [], result: "x" },
      ]);
    });
  });

  it("holds the client's frames until the node's connection opens, then forwards them in order", async () => {
    let open: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      open = resolve;
    });
    await withBuilder(
      (request) => [{ result: `${request.method}:${String(request.id)}` }],
      async (builder, node) => {
        node.handshake = gate;
        const client = await RawClient.open(builder.url);
        client.request("one", [], 1);
        client.request("two", [], 2);
        await until(() => node.upgrades === 1, "the node's handshake");
        expect(node.received).toEqual([]);
        open();
        expect((await client.answer(2)).result).toBe("two:2");
        expect(node.received.map((request) => request.method)).toEqual(["one", "two"]);
        await client.close();
        expect(await builder.stop()).toEqual([
          { method: "one", params: [], result: "one:1" },
          { method: "two", params: [], result: "two:2" },
        ]);
      },
    );
  });

  it("records a request sent while the node's connection never opened, the client leaving, as a fault", async () => {
    // A TCP server that accepts and never answers the WebSocket handshake (it reads, so it sees the builder leave).
    const silent: NetServer = createServer((socket) => {
      socket.on("error", () => {});
      socket.resume();
    });
    const port = await listenOnRandomPort(silent);
    const builder = await TapeBuilder.start({ node: `ws://127.0.0.1:${port}` });
    try {
      const client = await RawClient.open(builder.url);
      client.request("m", [1], 1);
      await client.close();
      await until(() => builder.sessions === 1, "the session");
      expect(await builder.stop()).toEqual([{ fault: "timeout", method: "m", params: [1] }]);
    } finally {
      await builder.stop().catch(() => undefined);
      await closeServer(silent);
    }
  });

  it("records concurrent connections as sessions in the order they were accepted", async () => {
    await withBuilder((request) => [{ result: request.method }], async (builder) => {
      const a = await RawClient.open(builder.url);
      await until(() => builder.sessions === 1, "the first connection");
      const b = await RawClient.open(builder.url);
      await until(() => builder.sessions === 2, "the second connection");
      await b.call("from-b", []);
      await a.call("from-a", []);
      await b.close();
      await a.close();
      const records = await builder.stop();
      expect(records).toEqual([
        { method: "from-a", params: [], result: "from-a" },
        { disconnect: true },
        { method: "from-b", params: [], result: "from-b" },
      ]);
      await withNode(records, async (node) => {
        const first = await RawClient.open(node.url);
        await until(() => node.connections === 1, "the first replayed connection");
        const second = await RawClient.open(node.url);
        expect((await second.call("from-b", [])).result).toBe("from-b");
        expect((await first.call("from-a", [])).result).toBe("from-a");
        await first.close();
        await second.close();
      });
    });
  });

  it("stop() ends open connections: a waiting request is a fault, no disconnect ends the last session", async () => {
    await withBuilder(answers({ m: [{ result: "x" }] }), async (builder, node) => {
      const client = await RawClient.open(builder.url);
      await client.call("m", []);
      client.request("waiting", [], 5);
      await until(() => node.received.length === 2, "the request waiting for its answer");
      const stopped = builder.stop();
      expect(builder.stop()).toBe(stopped);
      expect(await stopped).toEqual([
        { method: "m", params: [], result: "x" },
        { fault: "timeout", method: "waiting", params: [] },
      ]);
      expect(await client.closed).toBe(1006);
      const late = new WebSocket(builder.url);
      late.on("error", () => {});
      await new Promise((resolve) => late.on("close", resolve));
    });
  });

  it("ends the session of a client that breaks the WebSocket protocol as one the client ended", async () => {
    await withBuilder(answers({ m: [{ result: 1 }] }), async (builder) => {
      const broken = await RawClient.open(builder.url);
      await broken.call("m", []);
      broken.sendTextBytes(Uint8Array.of(0xff, 0xfe));
      expect(await broken.closed).toBe(1007);
      const client = await RawClient.open(builder.url);
      await client.call("m", []);
      await client.close();
      expect(await builder.stop()).toEqual([
        { method: "m", params: [], result: 1 },
        { disconnect: true },
        { method: "m", params: [], result: 1 },
      ]);
    });
  });

  it("asks the node for no compression, so frames pass as they are", async () => {
    await withBuilder(answers({ m: [{ result: 1 }] }), async (builder, node) => {
      const client = await RawClient.open(builder.url);
      await client.call("m", []);
      await client.close();
      expect(node.handshakes).toHaveLength(1);
      expect(node.handshakes[0]?.["sec-websocket-extensions"]).toBeUndefined();
    });
  });

  it("answers the client's pings itself", async () => {
    await withBuilder(answers({}), async (builder) => {
      const socket = new WebSocket(builder.url);
      await new Promise((resolve) => socket.on("open", resolve));
      const pong = new Promise((resolve) => socket.on("pong", resolve));
      socket.ping();
      await pong;
      socket.close();
      await new Promise((resolve) => socket.on("close", resolve));
      expect(await builder.stop()).toEqual([]);
    });
  });

  it("listens on 127.0.0.1 at a port of at least 10000, and records nothing without a connection", async () => {
    await withBuilder(answers({}), async (builder) => {
      expect(builder.url).toBe(`ws://127.0.0.1:${builder.port}`);
      expect(builder.port).toBeGreaterThanOrEqual(10_000);
      expect(builder.sessions).toBe(0);
      expect(builder.failure).toBeUndefined();
      const records: readonly TapeRecord[] = await builder.stop();
      expect(records).toEqual([]);
      expect(Object.isFrozen(records)).toBe(true);
    });
  });

  it("refuses a node URL that is not ws:// or wss://, without showing it", async () => {
    for (const node of ["http://user:secret@example.test/rpc", "not a url", "ftp://example.test"]) {
      const error = await TapeBuilder.start({ node }).catch((caught: unknown) => caught);
      expect(error).toBeInstanceOf(TypeError);
      expect(String((error as Error).message)).not.toContain("secret");
      expect(String((error as Error).message)).not.toContain("example");
      expect((error as Error).message).toBe("the tape builder's node must be a ws:// or wss:// URL");
    }
  });
});

describe("the recorder of one connection", () => {
  it("is closed once: a second end changes nothing", () => {
    const recording = new SessionRecording(1);
    recording.fromClient('{"jsonrpc":"2.0","id":1,"method":"m","params":[]}', false);
    recording.close("node");
    recording.close("client");
    expect(recording.end).toBe("node");
    expect(recording.records).toEqual([{ fault: "timeout", method: "m", params: [] }]);
  });
});

describe("the builder refuses a frame it cannot record, with a clear error", { timeout: TEST_TIMEOUT_MS }, () => {
  const fromNode: readonly (readonly [string, string, string])[] = [
    ["not-json-rpc", "not JSON", "{oops"],
    ["not-json-rpc", "a JSON string", '"text"'],
    ["not-json-rpc", "JSON null", "null"],
    ["not-json-rpc", "a batch", '[{"jsonrpc":"2.0","id":1,"result":1}]'],
    ["not-json-rpc", "another version", '{"jsonrpc":"1.0","id":1,"result":1}'],
    ["not-json-rpc", "an answer with a result and an error", '{"jsonrpc":"2.0","id":1,"result":1,"error":{}}'],
    ["not-json-rpc", "an answer with neither", '{"jsonrpc":"2.0","id":1}'],
    [
      "not-json-rpc",
      "a notification without a subscription",
      '{"jsonrpc":"2.0","method":"chain_newHead","params":{"result":1}}',
    ],
    [
      "not-json-rpc",
      "a notification whose method is not a string",
      '{"jsonrpc":"2.0","method":7,"params":{"subscription":"s","result":1}}',
    ],
    ["not-json-rpc", "a notification without params", '{"jsonrpc":"2.0","method":"chain_newHead"}'],
    ["not-json-rpc", "a notification with null params", '{"jsonrpc":"2.0","method":"chain_newHead","params":null}'],
    [
      "not-json-rpc",
      "a notification of an error",
      '{"jsonrpc":"2.0","method":"chain_newHead","params":{"subscription":"s","error":{}}}',
    ],
    ["not-json-rpc", "a frame that is no answer or notification", '{"jsonrpc":"2.0","method":7,"params":{}}'],
    ["unknown-answer", "an answer to no request", '{"jsonrpc":"2.0","id":99,"result":1}'],
    [
      "unknown-answer",
      "an answer with a null id",
      '{"jsonrpc":"2.0","id":null,"error":{"code":-32700,"message":"Parse error"}}',
    ],
    ["unknown-answer", "an answer to the id as a string", '{"jsonrpc":"2.0","id":"1","result":1}'],
    [
      "unknown-subscription",
      "a notification of no subscription",
      '{"jsonrpc":"2.0","method":"chain_newHead","params":{"subscription":"t","result":1}}',
    ],
    [
      "notification-method",
      "a notification under another name",
      '{"jsonrpc":"2.0","method":"chain_finalizedHead","params":{"subscription":"s","result":1}}',
    ],
    ["not-replayable", "an answer with its fields in another order", '{"jsonrpc":"2.0","result":1,"id":1}'],
    ["not-replayable", "an answer with spaces", '{"jsonrpc": "2.0", "id": 1, "result": 1}'],
    ["not-replayable", "a number spelled otherwise", '{"jsonrpc":"2.0","id":1,"result":1.0}'],
    [
      "not-replayable",
      "a notification's params in another order",
      '{"jsonrpc":"2.0","method":"chain_newHead","params":{"result":1,"subscription":"s"}}',
    ],
    ["not-replayable", "an escape spelled otherwise", '{"jsonrpc":"2.0","id":1,"result":"\\u0041"}'],
  ];

  for (const [reason, what, frame] of fromNode) {
    it(`${reason}: ${what}, from the node`, async () => {
      // A subscription "s" first, then request 1, which the node answers with the frame.
      const script: Script = (request) =>
        request.method === "chain_subscribeNewHeads" ? [{ result: "s" }] : [{ raw: frame }];
      const { error, client, close } = await refusal(script, (raw) => {
        void raw.call("chain_subscribeNewHeads", [], "sub").then(() => raw.request("m", [], 1));
      });
      expect(error).toMatchObject({ code: "cannot-record", reason, session: 1, from: "node" });
      expect(error.message).toContain(`cannot-record in session 1, a frame from the node (${reason}):`);
      expect(error.message).toContain(frame.length > 200 ? frame.slice(0, 200) : frame);
      expect(client.texts).not.toContain(frame);
      expect(close).toBe(1011);
    });
  }

  it("bad-record: a subscription answered with an id the tape cannot hold", async () => {
    for (const id of ["1.5", "{}", "null", "9007199254740993"]) {
      const { error } = await refusal(
        () => [{ raw: `{"jsonrpc":"2.0","id":1,"result":${id}}` }],
        (client) => client.request("chain_subscribeFinalizedHeads", [], 1),
      );
      expect(error).toMatchObject({ reason: "bad-record", from: "node" });
      expect(error.message).toContain("subscribe must be a string or a safe integer");
    }
  });

  it("bad-record: a subscription id already in use on the connection", async () => {
    const { error } = await refusal(
      () => [{ result: "same" }],
      (client) => {
        void client.call("chain_subscribeNewHeads", [], 1).then(() => client.request("chain_subscribeNewHeads", [], 2));
      },
    );
    expect(error).toMatchObject({ reason: "bad-record", from: "node" });
    expect(error.message).toContain('the subscription id "same" is in use');
  });

  it("bad-record: a subscription id that an answer still waiting for its turn holds", async () => {
    let asked = 0;
    const script: Script = (request) => {
      if (request.method === "chain_subscribeFinalizedHeads") return [{ result: "x" }];
      asked += 1;
      return asked === 1 ? [] : [{ result: "x" }];
    };
    const { error } = await refusal(script, (client) => {
      client.request("chain_subscribeNewHeads", [], 1);
      // Asked once the answer "x" to request 2, which waits behind request 1, has come through.
      void client
        .call("chain_subscribeNewHeads", [], 2)
        .then(() => client.request("chain_subscribeFinalizedHeads", [], 3));
    });
    expect(error).toMatchObject({ reason: "bad-record", from: "node" });
    expect(error.message).toContain('the subscription id "x" is in use');
  });

  it("out-of-order: a notification of a subscription answered before an earlier request of its pair", async () => {
    let asked = 0;
    const script: Script = () => {
      asked += 1;
      if (asked === 1) return [];
      return [{ result: "s2" }, { notify: "chain_newHead", subscription: "s2", result: 1 }];
    };
    const { error } = await refusal(script, (client) => {
      client.request("chain_subscribeNewHeads", [], 1);
      client.request("chain_subscribeNewHeads", [], 2);
    });
    expect(error).toMatchObject({ reason: "out-of-order", from: "node" });
  });

  it("a subscription answered out of order with no notification in between is recorded in request order", async () => {
    let asked = 0;
    const script: Script = () => {
      asked += 1;
      if (asked === 1) return [];
      return [{ result: "s2" }, { raw: '{"jsonrpc":"2.0","id":1,"result":"s1"}' }];
    };
    await withBuilder(script, async (builder) => {
      const client = await RawClient.open(builder.url);
      client.request("chain_subscribeNewHeads", [], 1);
      client.request("chain_subscribeNewHeads", [], 2);
      await client.answer(1);
      await client.close();
      expect(await builder.stop()).toEqual([
        { subscribe: "s1", method: "chain_subscribeNewHeads", params: [] },
        { subscribe: "s2", method: "chain_subscribeNewHeads", params: [] },
      ]);
    });
  });

  it("not-json-rpc: a binary frame from the node", async () => {
    const { error } = await refusal(
      () => [{ raw: '{"jsonrpc":"2.0","id":1,"result":1}', binary: true }],
      (client) => client.request("m", [], 1),
    );
    expect(error).toMatchObject({ reason: "not-json-rpc", from: "node" });
    expect(error.message).toContain(
      "an answer or a notification is a text frame; the frame: a binary frame of 35 bytes",
    );
  });

  const fromClient: readonly (readonly [string, string, string])[] = [
    ["bad-request", "not JSON", "{oops"],
    ["bad-request", "a batch", '[{"jsonrpc":"2.0","id":1,"method":"m"}]'],
    ["bad-request", "no id (a notification)", '{"jsonrpc":"2.0","method":"m","params":[]}'],
    ["bad-request", "an id that is not a string or a safe integer", '{"jsonrpc":"2.0","id":1.5,"method":"m"}'],
    ["bad-request", "params that are not structured", '{"jsonrpc":"2.0","id":1,"method":"m","params":"x"}'],
    ["bad-request", "an empty method", '{"jsonrpc":"2.0","id":1,"method":"","params":[]}'],
    ["bad-request", "another version", '{"jsonrpc":"1.0","id":1,"method":"m","params":[]}'],
  ];

  for (const [reason, what, frame] of fromClient) {
    it(`${reason}: ${what}, from the client`, async () => {
      await withBuilder(answers({}), async (builder, node) => {
        const client = await RawClient.open(builder.url);
        client.send(frame);
        const error = await builder.failed;
        expect(error).toMatchObject({ code: "cannot-record", reason, session: 1, from: "client" });
        expect(error.message).toContain(`cannot-record in session 1, a frame from the client (${reason}):`);
        expect(await client.closed).toBe(1011);
        expect(node.received).toEqual([]);
      });
    });
  }

  it("bad-request: a binary frame from the client", async () => {
    await withBuilder(answers({}), async (builder) => {
      const socket = new WebSocket(builder.url);
      socket.on("error", () => {});
      await new Promise((resolve) => socket.on("open", resolve));
      socket.send(Buffer.from('{"jsonrpc":"2.0","id":1,"method":"m"}'), { binary: true });
      const error = await builder.failed;
      expect(error).toMatchObject({ reason: "bad-request", from: "client" });
      expect(error.message).toContain("a request is a text frame; the frame: a binary frame of 37 bytes");
    });
  });

  it("duplicate-id: a request whose id an unanswered request of the connection holds", async () => {
    await withBuilder(answers({}), async (builder) => {
      const client = await RawClient.open(builder.url);
      client.request("m", [], 1);
      client.request("n", [], 1);
      const error = await builder.failed;
      expect(error).toMatchObject({ reason: "duplicate-id", from: "client" });
      expect(error.message).toContain("the id 1 is already waiting for an answer");
    });
  });

  it("after a refusal it ends every connection and closes new ones; its message shows 200 characters", async () => {
    const long = `{"jsonrpc":"2.0","id":1,"result":"${"x".repeat(400)}","extra":1}`;
    await withBuilder(
      (request) => (request.method === "bad" ? [{ raw: long }] : [{ result: "ok" }]),
      async (builder) => {
        const gone = await RawClient.open(builder.url);
        await gone.call("fine", [], 1);
        await gone.close();
        const bystander = await RawClient.open(builder.url);
        await bystander.call("fine", [], 1);
        const client = await RawClient.open(builder.url);
        client.request("bad", [], 1);
        const error = await builder.failed;
        expect(error).toMatchObject({ reason: "not-replayable", session: 3 });
        expect(error.message).toContain(`${long.slice(0, 200)}…`);
        expect(error.message).not.toContain(long.slice(0, 201));
        expect(await bystander.closed).toBe(1011);
        expect(await client.closed).toBe(1011);
        const late = new WebSocket(builder.url);
        late.on("error", () => {});
        expect(await new Promise((resolve) => late.on("close", resolve))).toBe(1011);
        await expect(builder.stop()).rejects.toBe(error);
      },
    );
  });

  it("names no node URL in its errors", async () => {
    const { error } = await refusal(
      () => [{ raw: "{oops" }],
      (client) => client.request("m", [], 1),
    );
    expect(error.message).not.toMatch(/127\.0\.0\.1|ws:\/\//);
  });
});
