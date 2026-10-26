import { EventEmitter } from "node:events";
import { createServer } from "node:http";
import type { Server as NetServer } from "node:net";
import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";
import { WebSocket } from "ws";
import {
  FAULT_RPC_CODE,
  NOT_ON_TAPE_RPC_CODE,
  SYSTEM_CLOCK,
  type TapeClock,
  TapeError,
  TapeNode,
  type TapeRecord,
} from "../../tools/tape/index.js";
import { listenOnRandomPort, PORT_ATTEMPTS, randomPort } from "../../tools/tape/port.js";
import { ManualTimers, until } from "../node/manual-timers.js";
import {
  expectAnswersByOccurrence,
  expectDelayHonoured,
  expectNotificationsAfterCalls,
  manualClock,
  withNode,
} from "./checks.js";
import { BARRIER_METHOD, RawClient } from "./raw-client.js";

/**
 * A69 and A70 `[CI]` (`openspec/changes/core-arch/acceptance.md` §9; TT-1 to TT-3) over a bare WebSocket client, so
 * that the exact frames are checked: the tape node answers calls by occurrence and repeats the last answer, answers an
 * unrecorded call `not-on-tape`, delays a call record's answer by its `delayMs` and no other; delivers notifications in
 * file order once the calls before them are answered; drops the connection at a `disconnect` and serves the next
 * session to the next connection; and times out or fails the next matching call at a `fault`. `node-client.test.ts`
 * runs the same rules through the node client of `src/node/`.
 *
 * No test waits for a length of time to see that something did not happen: a barrier (`raw-client.ts`) or the clock
 * moved by hand (`ManualTimers`, which the tape node takes as its clock) shows it. One test checks the delay on the
 * real clock, by its lower bound only, which load can only make longer.
 */

const TEST_TIMEOUT_MS = 60_000;

/** Opens a connection the tape node drops at once; resolves with its close code. */
function dropped(url: string): Promise<number> {
  const socket = new WebSocket(url);
  socket.on("error", () => {});
  return new Promise((resolve) => socket.on("close", resolve));
}

describe("A69: calls are answered by occurrence, the last answer repeated", { timeout: TEST_TIMEOUT_MS }, () => {
  it("TT-2's scenario: heads A, B, C, four calls get A, B, C, C; each method and params counts alone", async () => {
    await expectAnswersByOccurrence();
  });

  it("answers with the request's own id, a number or a string, in JSON-RPC 2.0 frames", async () => {
    const records: TapeRecord[] = [
      { method: "chain_getBlockHash", params: [1], result: "0x01" },
      { method: "chain_getBlockHash", params: [1], result: { nested: [1, 2n ** 64n] } },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      await client.call("chain_getBlockHash", [1], "first");
      await client.call("chain_getBlockHash", [1], 41);
      expect(client.texts).toEqual([
        '{"jsonrpc":"2.0","id":"first","result":"0x01"}',
        '{"jsonrpc":"2.0","id":41,"result":{"nested":[1,18446744073709551616]}}',
      ]);
      await client.close();
    });
  });

  it("answers an error record with its error, and repeats it", async () => {
    const error = { code: 4003, message: "Client error: UnknownBlock: State already discarded for 0x01", data: [1] };
    await withNode([{ method: "state_getStorage", params: ["0x02", "0x01"], error }], async (node) => {
      const client = await RawClient.open(node.url);
      expect((await client.call("state_getStorage", ["0x02", "0x01"])).error).toEqual(error);
      expect((await client.call("state_getStorage", ["0x02", "0x01"])).error).toEqual(error);
      await client.close();
    });
  });

  it("answers the error of a call record whose result is left undefined", async () => {
    const record = { method: "m", params: [], result: undefined, error: { code: 1, message: "e" } };
    await withNode([record as unknown as TapeRecord], async (node) => {
      const client = await RawClient.open(node.url);
      await client.call("m", [], 1);
      expect(client.texts).toEqual(['{"jsonrpc":"2.0","id":1,"error":{"code":1,"message":"e"}}']);
      await client.close();
    });
  });

  it("repeats the last call record of the pair, not a fault recorded after it", async () => {
    const records: TapeRecord[] = [
      { method: "chain_getFinalizedHead", params: [], result: "x" },
      { fault: "error", method: "chain_getFinalizedHead", params: [], code: -32000 },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      expect((await client.call("chain_getFinalizedHead", [])).result).toBe("x");
      expect((await client.call("chain_getFinalizedHead", [])).error?.code).toBe(-32000);
      expect((await client.call("chain_getFinalizedHead", [])).result).toBe("x");
      expect((await client.call("chain_getFinalizedHead", [])).result).toBe("x");
      await client.close();
    });
  });

  it("counts requests in the order they arrive, also when sent together", async () => {
    const records: TapeRecord[] = [
      { method: "chain_getFinalizedHead", params: [], result: 1 },
      { method: "chain_getFinalizedHead", params: [], result: 2 },
      { method: "chain_getFinalizedHead", params: [], result: 3 },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      const ids = [1, 2, 3, 4].map(() => client.request("chain_getFinalizedHead", []));
      const answers = await Promise.all(ids.map((id) => client.answer(id)));
      expect(answers.map((frame) => frame.result)).toEqual([1, 2, 3, 3]);
      await client.close();
    });
  });

  it("compares parameters as JSON values: object keys in any order, 2.0 as 2, absent params as []", async () => {
    const records: TapeRecord[] = [
      { method: "m", params: { a: 1, b: [1, 2] }, result: "object" },
      { method: "m", params: [], result: "empty" },
      { method: "k", params: ["0xab"], result: "lower" },
      { method: "k", params: [18446744073709551616n], result: "big" },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      client.send('{"jsonrpc":"2.0","id":"r1","method":"m","params":{"b":[1,2.0],"a":1}}');
      expect((await client.answer("r1")).result).toBe("object");
      client.send('{"jsonrpc":"2.0","id":"r2","method":"m"}');
      expect((await client.answer("r2")).result).toBe("empty");
      expect((await client.call("k", ["0xAB"])).error?.message).toBe("not-on-tape: k");
      expect((await client.call("k", ["0xab"])).result).toBe("lower");
      client.send('{"jsonrpc":"2.0","id":"r5","method":"k","params":[18446744073709551617]}');
      expect((await client.answer("r5")).error?.message).toBe("not-on-tape: k");
      client.send('{"jsonrpc":"2.0","id":"r6","method":"k","params":[18446744073709551616]}');
      expect((await client.answer("r6")).result).toBe("big");
      await client.close();
    });
  });
});

describe("A69: an unrecorded call gets not-on-tape", { timeout: TEST_TIMEOUT_MS }, () => {
  it("answers a JSON-RPC error naming the method, with the params and session", async () => {
    await withNode([{ method: "chain_getBlockHash", params: [1], result: "0x01" }], async (node) => {
      const client = await RawClient.open(node.url);
      await client.call("chain_getBlockHash", [9], 3);
      expect(client.texts).toEqual([
        '{"jsonrpc":"2.0","id":3,"error":{"code":-32090,"message":"not-on-tape: chain_getBlockHash",' +
          '"data":{"method":"chain_getBlockHash","params":[9],"session":1}}}',
      ]);
      expect(NOT_ON_TAPE_RPC_CODE).toBe(-32090);
      await client.close();
    });
  });

  it("answers not-on-tape for a call recorded only in another session", async () => {
    const records: TapeRecord[] = [{ disconnect: true }, { method: "system_properties", params: [], result: {} }];
    await withNode(records, async (node) => {
      expect(await dropped(node.url)).toBe(1006);
      const second = await RawClient.open(node.url);
      expect((await second.call("system_properties", [])).result).toEqual({});
      await second.close();
      const third = await RawClient.open(node.url);
      const answer = await third.call("system_properties", []);
      expect(answer.error).toEqual({
        code: -32090,
        message: "not-on-tape: system_properties",
        data: { method: "system_properties", params: [], session: 3 },
      });
      await third.close();
    });
  });

  it("does not repeat a subscription: one subscribe record answers one subscription call", async () => {
    await withNode([{ subscribe: "s", method: "chain_subscribeNewHeads", params: [] }], async (node) => {
      const client = await RawClient.open(node.url);
      expect((await client.call("chain_subscribeNewHeads", [])).result).toBe("s");
      expect((await client.call("chain_subscribeNewHeads", [])).error?.message).toBe(
        "not-on-tape: chain_subscribeNewHeads",
      );
      await client.close();
    });
  });

  it("answers not-on-tape for a pair whose records are all faults, once they are used", async () => {
    await withNode([{ fault: "error", method: "m", params: [], code: 7 }], async (node) => {
      const client = await RawClient.open(node.url);
      expect((await client.call("m", [])).error?.code).toBe(7);
      expect((await client.call("m", [])).error?.code).toBe(NOT_ON_TAPE_RPC_CODE);
      await client.close();
    });
  });
});

describe("A69: delayMs delays that answer only", { timeout: TEST_TIMEOUT_MS }, () => {
  it("TT-2's scenario on a clock moved by hand: answered at 2000 ms, not 1999, the next record at once", async () => {
    await expectDelayHonoured();
  });

  it("delays a repeat of a delayed record too", async () => {
    const timers = new ManualTimers();
    await withNode(
      [{ method: "m", params: [], result: "x", delayMs: 100 }],
      async (node) => {
        const client = await RawClient.open(node.url);
        const first = client.request("m", []);
        await client.barrier();
        await timers.advance(100);
        await client.answer(first);
        const repeat = client.request("m", []);
        await client.barrier();
        expect(client.answered(repeat)).toBe(false);
        await timers.advance(99);
        await client.barrier();
        expect(client.answered(repeat)).toBe(false);
        await timers.advance(1);
        expect((await client.answer(repeat)).result).toBe("x");
        await client.close();
      },
      manualClock(timers),
    );
  });

  it("answers delayMs 0 at once", async () => {
    const timers = new ManualTimers();
    await withNode(
      [{ method: "m", params: [], result: "x", delayMs: 0 }],
      async (node) => {
        const client = await RawClient.open(node.url);
        const id = client.request("m", []);
        await client.barrier();
        expect(client.answered(id)).toBe(true);
        expect(timers.pending()).toEqual([]);
        await client.close();
      },
      manualClock(timers),
    );
  });

  it("waits again when its clock's timer fires before the delay has passed", async () => {
    let now = 0;
    const armed: { readonly ms: number; readonly run: () => void }[] = [];
    const clock: TapeClock = {
      setTimeout: (run, ms) => armed.push({ ms, run }),
      clearTimeout: () => {},
      now: () => now,
    };
    await withNode(
      [{ method: "m", params: [], result: "x", delayMs: 2000 }],
      async (node) => {
        const client = await RawClient.open(node.url);
        now = 1000;
        const id = client.request("m", []);
        await client.barrier();
        expect(armed.map((timer) => timer.ms)).toEqual([2000]);
        now = 2500.25;
        armed[0]?.run();
        await client.barrier();
        expect(client.answered(id)).toBe(false);
        expect(armed.map((timer) => timer.ms)).toEqual([2000, 500]);
        now = 3000;
        armed[1]?.run();
        expect((await client.answer(id)).result).toBe("x");
        await client.close();
      },
      clock,
    );
  });

  it("on the real clock, answers a 2000 ms record no earlier than 2000 ms after the call", async () => {
    await withNode([{ method: "m", params: [], result: "x", delayMs: 2000 }], async (node) => {
      const client = await RawClient.open(node.url);
      const sent = performance.now();
      await client.call("m", []);
      expect(performance.now() - sent).toBeGreaterThanOrEqual(2000);
      await client.close();
    });
  });

  it("drops a delayed answer whose client went away first", async () => {
    const timers = new ManualTimers();
    await withNode(
      [{ method: "m", params: [], result: "x", delayMs: 100 }],
      async (node) => {
        const client = await RawClient.open(node.url);
        client.request("m", []);
        await client.barrier();
        expect(timers.pending()).toEqual([100]);
        await client.close();
        await until(() => timers.pending().length === 0, "the delay cleared");
        await timers.advance(1000);
        expect(node.calls.map((call) => call.outcome)).toEqual(["answered", "not-on-tape"]);
      },
      manualClock(timers),
    );
  });

  it("never sends a delayed answer once the node is closed", async () => {
    const timers = new ManualTimers();
    const node = await TapeNode.start({
      records: [{ method: "m", params: [], result: "x", delayMs: 100 }],
      clock: manualClock(timers),
    });
    const client = await RawClient.open(node.url);
    const id = client.request("m", []);
    await client.barrier();
    await node.close();
    await client.closed;
    expect(timers.pending()).toEqual([]);
    await timers.advance(1000);
    expect(client.answered(id)).toBe(false);
  });
});

describe("A70: notifications, disconnects and faults", { timeout: TEST_TIMEOUT_MS }, () => {
  it("delivers a subscription's notifications in file order, each after the calls recorded before it", async () => {
    await expectNotificationsAfterCalls();
  });

  it("keeps file order across subscriptions, and names each notification after its subscription", async () => {
    const records: TapeRecord[] = [
      { subscribe: 1, method: "chain_subscribeNewHeads", params: [] },
      { subscribe: "f", method: "chain_subscribeFinalizedHeads", params: [] },
      { notify: "f", result: "f1" },
      { notify: 1, result: "n2" },
      { subscribe: "x", method: "state_subscribeStorage", params: [["0x01"]] },
      { notify: "f", result: "f3" },
      { notify: "x", result: "x4" },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      await client.call("chain_subscribeNewHeads", []);
      await client.barrier();
      expect(client.notifications()).toEqual([]);
      await client.call("chain_subscribeFinalizedHeads", []);
      await client.barrier();
      expect(client.notifications()).toEqual([
        { jsonrpc: "2.0", method: "chain_finalizedHead", params: { subscription: "f", result: "f1" } },
        { jsonrpc: "2.0", method: "chain_newHead", params: { subscription: 1, result: "n2" } },
      ]);
      await client.call("state_subscribeStorage", [["0x01"]]);
      await client.barrier();
      expect(client.notifications().slice(2)).toEqual([
        { jsonrpc: "2.0", method: "chain_finalizedHead", params: { subscription: "f", result: "f3" } },
        { jsonrpc: "2.0", method: "state_subscribeStorage", params: { subscription: "x", result: "x4" } },
      ]);
      await client.close();
    });
  });

  it("holds a notification back until the delayed answer before it has been sent", async () => {
    const timers = new ManualTimers();
    const records: TapeRecord[] = [
      { subscribe: "s", method: "chain_subscribeNewHeads", params: [] },
      { method: "m", params: [], result: "slow", delayMs: 500 },
      { notify: "s", result: 1 },
    ];
    await withNode(
      records,
      async (node) => {
        const client = await RawClient.open(node.url);
        await client.call("chain_subscribeNewHeads", []);
        const slow = client.request("m", []);
        await client.barrier();
        expect(client.notifications()).toEqual([]);
        await timers.advance(500);
        await client.answer(slow);
        await client.waitFor((frame) => frame.id === undefined, "the notification");
        const at = client.frames.findIndex((frame) => frame.id === slow);
        expect(client.frames[at + 1]?.params?.result).toBe(1);
        await client.close();
      },
      manualClock(timers),
    );
  });

  it("TT-3's scenario: two notifications, a disconnect, the next session subscribes and gets two more", async () => {
    const records: TapeRecord[] = [
      { subscribe: "a", method: "chain_subscribeFinalizedHeads", params: [] },
      { notify: "a", result: 1 },
      { notify: "a", result: 2 },
      { disconnect: true },
      { subscribe: "b", method: "chain_subscribeFinalizedHeads", params: [] },
      { notify: "b", result: 3 },
      { notify: "b", result: 4 },
    ];
    await withNode(records, async (node) => {
      const first = await RawClient.open(node.url);
      expect((await first.call("chain_subscribeFinalizedHeads", [])).result).toBe("a");
      expect(await first.closed).toBe(1006);
      expect(first.notifications().map((frame) => frame.params?.result)).toEqual([1, 2]);
      const second = await RawClient.open(node.url);
      expect((await second.call("chain_subscribeFinalizedHeads", [])).result).toBe("b");
      await second.waitFor((frame) => frame.params?.result === 4, "the fourth notification");
      expect(second.notifications().map((frame) => frame.params?.result)).toEqual([3, 4]);
      expect(node.connections).toBe(2);
      await second.close();
    });
  });

  it("drops the connection only once every record before the disconnect is done", async () => {
    const records: TapeRecord[] = [{ method: "m", params: [], result: 1 }, { disconnect: true }];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      await client.barrier();
      let ended = false;
      void client.closed.then(() => {
        ended = true;
      });
      await client.barrier();
      expect(ended).toBe(false);
      expect((await client.call("m", [])).result).toBe(1);
      expect(await client.closed).toBe(1006);
    });
  });

  it("drops the connection only once a large answer before it is written out, answering none meanwhile", async () => {
    // 16 MB: more than a paused reader's socket and the node's can hold together (at most 4 MB each on macOS, 6 MB and
    // 4 MB on Linux by default), so the node is still writing the answer, and dropping, when the next request comes.
    const large = "ab".repeat(8_000_000);
    await withNode([{ method: "m", params: [], result: large }, { disconnect: true }], async (node) => {
      const client = await RawClient.open(node.url);
      client.pause();
      const answered = client.request("m", []);
      await until(() => node.calls.length === 1, "the large call");
      const late = client.request("k", [1]);
      await until(() => node.calls.length === 2, "the call that came while the node was dropping");
      client.resume();
      expect(await client.closed).toBe(1006);
      expect(client.frames.find((frame) => frame.id === answered)?.result).toBe(large);
      expect(client.answered(late)).toBe(false);
      expect(node.calls.map((call) => [call.method, call.params, call.outcome])).toEqual([
        ["m", [], "answered"],
        ["k", [1], "dropped"],
      ]);
    });
  });

  it("logs a frame that is not a request as dropped too, once dropping", async () => {
    const large = "ab".repeat(8_000_000);
    await withNode([{ method: "m", params: [], result: large }, { disconnect: true }], async (node) => {
      const client = await RawClient.open(node.url);
      client.pause();
      client.request("m", []);
      await until(() => node.calls.length === 1, "the large call");
      client.send("not json");
      await until(() => node.calls.length === 2, "the frame that came while the node was dropping");
      client.resume();
      await client.closed;
      const dropped = { session: 1, method: null, params: null, occurrence: null, line: null, outcome: "dropped" };
      expect(node.calls[1]).toEqual(dropped);
      expect(client.frames).toHaveLength(1);
    });
  });

  it("gives each session its own occurrence counts, and a connection beyond the last an empty session", async () => {
    const records: TapeRecord[] = [
      { method: "m", params: [], result: 1 },
      { method: "m", params: [], result: 2 },
      { disconnect: true },
      { method: "m", params: [], result: 3 },
    ];
    await withNode(records, async (node) => {
      const first = await RawClient.open(node.url);
      expect((await first.call("m", [])).result).toBe(1);
      expect((await first.call("m", [])).result).toBe(2);
      await first.closed;
      const second = await RawClient.open(node.url);
      expect((await second.call("m", [])).result).toBe(3);
      expect((await second.call("m", [])).result).toBe(3);
      await second.close();
      const third = await RawClient.open(node.url);
      expect((await third.call("m", [])).error?.data).toEqual({ method: "m", params: [], session: 3 });
      await third.close();
      expect(node.connections).toBe(3);
    });
  });

  it("serves sessions in connection order, each connection its own, also at the same time", async () => {
    const records: TapeRecord[] = [
      { method: "m", params: [], result: "one" },
      { disconnect: true },
      { method: "m", params: [], result: "two" },
    ];
    await withNode(records, async (node) => {
      const first = await RawClient.open(node.url);
      const second = await RawClient.open(node.url);
      expect((await second.call("m", [])).result).toBe("two");
      expect((await first.call("m", [])).result).toBe("one");
      await first.closed;
      expect((await second.call("m", [])).result).toBe("two");
      await second.close();
    });
  });

  it("drops a connection at once for a session that starts with a disconnect: an outage is a run of them", async () => {
    const records: TapeRecord[] = [
      { disconnect: true },
      { disconnect: true },
      { method: "m", params: [], result: "back" },
    ];
    await withNode(records, async (node) => {
      for (let attempt = 0; attempt < 2; attempt++) expect(await dropped(node.url)).toBe(1006);
      const client = await RawClient.open(node.url);
      expect((await client.call("m", [])).result).toBe("back");
      await client.close();
      expect(node.connections).toBe(3);
    });
  });

  it("times out the next matching call at a timeout fault: no answer; the next call gets the next record", async () => {
    const records: TapeRecord[] = [
      { subscribe: "s", method: "chain_subscribeNewHeads", params: [] },
      { fault: "timeout", method: "chain_getBlock", params: ["0x01"] },
      { notify: "s", result: "after the fault" },
      { method: "chain_getBlock", params: ["0x01"], result: "block" },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      await client.call("chain_subscribeNewHeads", []);
      const lost = client.request("chain_getBlock", ["0x01"]);
      await client.barrier();
      expect(client.answered(lost)).toBe(false);
      expect(client.notifications().map((frame) => frame.params?.result)).toEqual(["after the fault"]);
      expect((await client.call("chain_getBlock", ["0x01"])).result).toBe("block");
      await client.barrier();
      expect(client.answered(lost)).toBe(false);
      await client.close();
    });
  });

  it("fails the next matching call at an error fault, with its code or JSON-RPC's internal error", async () => {
    const records: TapeRecord[] = [
      { fault: "error", method: "chain_getBlock", params: ["0x01"], code: -32999 },
      { fault: "error", method: "chain_getBlock", params: ["0x01"] },
      { method: "chain_getBlock", params: ["0x01"], result: "block" },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      await client.call("chain_getBlock", ["0x01"], 1);
      await client.call("chain_getBlock", ["0x01"], 2);
      await client.call("chain_getBlock", ["0x01"], 3);
      expect(client.texts).toEqual([
        '{"jsonrpc":"2.0","id":1,"error":{"code":-32999,"message":"tape fault: chain_getBlock"}}',
        '{"jsonrpc":"2.0","id":2,"error":{"code":-32603,"message":"tape fault: chain_getBlock"}}',
        '{"jsonrpc":"2.0","id":3,"result":"block"}',
      ]);
      expect(FAULT_RPC_CODE).toBe(-32603);
      await client.close();
    });
  });

  it("matches a fault by method and params only", async () => {
    const records: TapeRecord[] = [
      { fault: "error", method: "chain_getBlock", params: ["0x01"], code: 1 },
      { method: "chain_getBlock", params: ["0x02"], result: "two" },
    ];
    await withNode(records, async (node) => {
      const client = await RawClient.open(node.url);
      expect((await client.call("chain_getBlock", ["0x02"])).result).toBe("two");
      expect((await client.call("chain_getBlock", ["0x01"])).error?.code).toBe(1);
      await client.close();
    });
  });
});

describe("the tape node's call log and its refusals", { timeout: TEST_TIMEOUT_MS }, () => {
  it("logs every request with its session, occurrence, record line and outcome", async () => {
    const records: TapeRecord[] = [
      { method: "m", params: [], result: 1 },
      { subscribe: "s", method: "chain_subscribeNewHeads", params: [] },
      { fault: "timeout", method: "t", params: [] },
      { fault: "error", method: "e", params: [1] },
      { disconnect: true },
      { method: "m", params: [], result: 2 },
    ];
    await withNode(records, async (node) => {
      const first = await RawClient.open(node.url);
      await first.call("m", []);
      await first.call("m", []);
      await first.call("chain_subscribeNewHeads", []);
      first.request("t", []);
      await first.call("e", [1]);
      await first.closed;
      const second = await RawClient.open(node.url);
      await second.call("m", []);
      await second.call("absent", { a: 1 });
      await second.close();
      expect(node.calls).toEqual([
        { session: 1, method: "m", params: [], occurrence: 1, line: 1, outcome: "answered" },
        { session: 1, method: "m", params: [], occurrence: 2, line: 1, outcome: "repeated" },
        { session: 1, method: "chain_subscribeNewHeads", params: [], occurrence: 1, line: 2, outcome: "subscribed" },
        { session: 1, method: "t", params: [], occurrence: 1, line: 3, outcome: "fault-timeout" },
        { session: 1, method: "e", params: [1], occurrence: 1, line: 4, outcome: "fault-error" },
        { session: 2, method: "m", params: [], occurrence: 1, line: 6, outcome: "answered" },
        { session: 2, method: "absent", params: { a: 1 }, occurrence: 1, line: null, outcome: "not-on-tape" },
      ]);
      expect(Object.isFrozen(node.calls)).toBe(true);
      expect(Object.isFrozen(node.calls[0])).toBe(true);
      expect(node.count("m")).toBe(3);
      expect(node.count("m", [])).toBe(3);
      expect(node.count("e", [1])).toBe(1);
      expect(node.count("e", [2])).toBe(0);
      expect(node.count("absent", { a: 1 })).toBe(1);
      expect(node.count("nothing")).toBe(0);
    });
  });

  it("answers frames that are not JSON-RPC 2.0 requests with JSON-RPC's errors, and logs them", async () => {
    await withNode([{ method: "m", params: [], result: 1 }], async (node) => {
      const client = await RawClient.open(node.url);
      const frames = [
        "not json",
        "[]",
        '[{"jsonrpc":"2.0","id":1,"method":"m","params":[]}]',
        '"text"',
        '{"jsonrpc":"1.0","id":4,"method":"m","params":[]}',
        '{"id":5,"method":"m","params":[]}',
        '{"jsonrpc":"2.0","id":6,"params":[]}',
        '{"jsonrpc":"2.0","id":7,"method":7,"params":[]}',
        '{"jsonrpc":"2.0","method":"m","params":[]}',
        '{"jsonrpc":"2.0","id":{"x":1},"method":"m","params":[]}',
        '{"jsonrpc":"2.0","id":1.5,"method":"m","params":[]}',
        '{"jsonrpc":"2.0","id":null,"method":"m","params":[]}',
        '{"jsonrpc":"2.0","id":13,"method":"m","params":5}',
        '{"jsonrpc":"2.0","id":14,"method":"m","params":null}',
      ];
      for (const frame of frames) client.send(frame);
      await client.barrier();
      const parse = '{"jsonrpc":"2.0","id":null,"error":{"code":-32700,"message":"Parse error"}}';
      const invalid = (id: string) =>
        `{"jsonrpc":"2.0","id":${id},"error":{"code":-32600,"message":"Invalid Request"}}`;
      expect(client.texts.slice(0, frames.length)).toEqual([
        parse,
        invalid("null"),
        invalid("null"),
        invalid("null"),
        invalid("4"),
        invalid("5"),
        invalid("6"),
        invalid("7"),
        invalid("null"),
        invalid("null"),
        invalid("null"),
        invalid("null"),
        invalid("13"),
        invalid("14"),
      ]);
      const invalidEntry = { session: 1, method: null, params: null, occurrence: null, line: null };
      expect(node.calls.slice(0, frames.length)).toEqual(
        frames.map(() => ({ ...invalidEntry, outcome: "invalid-request" })),
      );
      expect(node.calls.at(-1)?.method).toBe(BARRIER_METHOD);
      expect((await client.call("m", [])).result).toBe(1);
      await client.close();
    });
  });

  it("sends frames uncompressed: a client's offer of permessage-deflate is declined", async () => {
    await withNode([], async (node) => {
      const socket = new WebSocket(node.url, { perMessageDeflate: true });
      await new Promise((resolve) => socket.once("open", resolve));
      expect(socket.extensions).toBe("");
      socket.close();
      await new Promise((resolve) => socket.once("close", resolve));
    });
  });

  it("answers pings, as the node client's heartbeat needs", async () => {
    await withNode([], async (node) => {
      const socket = new WebSocket(node.url);
      await new Promise((resolve) => socket.once("open", resolve));
      const pong = new Promise<string>((resolve) => socket.once("pong", (data) => resolve(String(data))));
      socket.ping("beat");
      expect(await pong).toBe("beat");
      socket.close();
      await new Promise((resolve) => socket.once("close", resolve));
    });
  });

  it("ends a connection whose client breaks the WebSocket protocol, and keeps serving", async () => {
    await withNode([{ method: "m", params: [], result: 1 }], async (node) => {
      const broken = await RawClient.open(node.url);
      broken.sendTextBytes(Uint8Array.of(0xff, 0xfe));
      expect(await broken.closed).toBe(1007);
      const client = await RawClient.open(node.url);
      expect((await client.call("m", [])).error?.data).toEqual({ method: "m", params: [], session: 2 });
      await client.close();
    });
  });

  it("refuses to start on records that are not a tape, naming the line", async () => {
    await expect(TapeNode.start({ records: [{ disconnect: true }, { foo: 1 } as never] })).rejects.toBeInstanceOf(
      TapeError,
    );
    await expect(
      TapeNode.start({ records: [{ notify: "s", result: 1 }] }),
    ).rejects.toMatchObject({ code: "bad-tape-record", line: 1, reason: "unknown-subscription" });
  });

  it("listens on the loopback interface at a port of at least 10000, and closes once", async () => {
    const node = await TapeNode.start({ records: [] });
    expect(node.url).toBe(`ws://127.0.0.1:${node.port}`);
    expect(node.port).toBeGreaterThanOrEqual(10_000);
    const client = await RawClient.open(node.url);
    const closing = node.close();
    expect(node.close()).toBe(closing);
    await closing;
    await client.closed;
    expect(node.connections).toBe(1);
  });
});

describe("the tape node's port and clock", { timeout: TEST_TIMEOUT_MS }, () => {
  it("tries another port while the one picked is taken", async () => {
    const taken = createServer();
    const takenPort = await listenOnRandomPort(taken);
    const server = createServer();
    const before = [server.listenerCount("error"), server.listenerCount("listening")];
    let picks = 0;
    const port = await listenOnRandomPort(server, () => (picks++ < 3 ? takenPort : randomPort()));
    expect(picks).toBe(4);
    expect(port).not.toBe(takenPort);
    expect(port).toBeGreaterThanOrEqual(10_000);
    expect(server.address()).toMatchObject({ address: "127.0.0.1", port });
    expect([server.listenerCount("error"), server.listenerCount("listening")]).toEqual(before);
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await new Promise<void>((resolve) => taken.close(() => resolve()));
  });

  it("gives up after twenty taken ports, and fails at once on another error", async () => {
    const taken = createServer();
    const takenPort = await listenOnRandomPort(taken);
    let picks = 0;
    await expect(
      listenOnRandomPort(createServer(), () => {
        picks += 1;
        return takenPort;
      }),
    ).rejects.toThrow("the tape node found no free port at or above 10000 in 20 attempts");
    expect([picks, PORT_ATTEMPTS]).toEqual([20, 20]);
    await new Promise<void>((resolve) => taken.close(() => resolve()));
    const refusing = new EventEmitter() as EventEmitter & { listen(): void };
    refusing.listen = () => {
      refusing.emit("error", Object.assign(new Error("permission denied"), { code: "EACCES" }));
    };
    await expect(listenOnRandomPort(refusing as unknown as NetServer)).rejects.toMatchObject({ code: "EACCES" });
    expect(refusing.listenerCount("listening")).toBe(0);
    expect(refusing.listenerCount("error")).toBe(0);
  });

  it("picks ports from 10000 to 59999", () => {
    for (let draw = 0; draw < 1000; draw++) {
      const port = randomPort();
      expect(Number.isInteger(port) && port >= 10_000 && port < 60_000).toBe(true);
    }
  });

  it("times delays on Node.js's timers and performance.now() by default", async () => {
    const order: string[] = [];
    const cancelled = SYSTEM_CLOCK.setTimeout(() => order.push("cancelled"), 5);
    SYSTEM_CLOCK.clearTimeout(cancelled);
    SYSTEM_CLOCK.setTimeout(() => order.push("ran"), 5);
    const before = SYSTEM_CLOCK.now();
    await new Promise<void>((resolve) => setTimeout(resolve, 40));
    expect(order).toEqual(["ran"]);
    expect(SYSTEM_CLOCK.now()).toBeGreaterThan(before);
    expect(Math.abs(SYSTEM_CLOCK.now() - performance.now())).toBeLessThan(1000);
  });
});

