import { describe, expect, it } from "vitest";
import {
  errorFrame,
  isSubscribeMethod,
  notificationFrame,
  notificationMethod,
  readRequest,
  resultFrame,
} from "../../tools/tape/index.js";

/**
 * The frames the tape node writes and the recording builder checks a node's frames against (`tools/tape/frames.ts`;
 * TT-2 to TT-4; tasks 9.1, 9.2): their exact text, written here by hand, the subscription methods the builder records
 * as subscriptions, and the notification names the tape node sends.
 */

describe("the tape's JSON-RPC frames", () => {
  it("writes answers and notifications in jsonrpsee's field order, each value in the tape's JSON form", () => {
    expect(resultFrame(1, { b: [1n << 64n], a: "é" })).toBe(
      '{"jsonrpc":"2.0","id":1,"result":{"b":[18446744073709551616],"a":"é"}}',
    );
    expect(resultFrame("x", null)).toBe('{"jsonrpc":"2.0","id":"x","result":null}');
    expect(errorFrame(null, { code: -32700, message: "Parse error" })).toBe(
      '{"jsonrpc":"2.0","id":null,"error":{"code":-32700,"message":"Parse error"}}',
    );
    expect(notificationFrame("chain_newHead", 7, { number: "0x1" })).toBe(
      '{"jsonrpc":"2.0","method":"chain_newHead","params":{"subscription":7,"result":{"number":"0x1"}}}',
    );
    // A method name is a JSON string too: a quote in it is escaped.
    expect(notificationFrame('a"b', "s", 1)).toBe(
      '{"jsonrpc":"2.0","method":"a\\"b","params":{"subscription":"s","result":1}}',
    );
  });

  it("names the head subscriptions' notifications as Substrate does, any other by its own method", () => {
    expect(notificationMethod("chain_subscribeNewHeads")).toBe("chain_newHead");
    expect(notificationMethod("chain_subscribeFinalizedHeads")).toBe("chain_finalizedHead");
    expect(notificationMethod("state_subscribeStorage")).toBe("state_subscribeStorage");
  });

  it("takes only the two head subscriptions as subscriptions to record", () => {
    expect(isSubscribeMethod("chain_subscribeNewHeads")).toBe(true);
    expect(isSubscribeMethod("chain_subscribeFinalizedHeads")).toBe(true);
    for (const method of ["chain_unsubscribeNewHeads", "state_subscribeStorage", "chain_subscribeAllHeads", "m"]) {
      expect(isSubscribeMethod(method)).toBe(false);
    }
  });

  it("reads a request as the tape node matches it: params absent as []", () => {
    const bare = '{"jsonrpc":"2.0","id":1,"method":"m"}';
    expect(readRequest(bare)).toEqual({ valid: true, id: 1, method: "m", params: [] });
    expect(readRequest('{"jsonrpc":"2.0","id":1,"method":"m","params":{"a":1}}')).toEqual({
      valid: true,
      id: 1,
      method: "m",
      params: { a: 1 },
    });
    expect(readRequest("{oops")).toMatchObject({ valid: false, id: null, error: { code: -32700 } });
    expect(readRequest('{"jsonrpc":"2.0","id":2,"method":"m","params":1}')).toMatchObject({
      valid: false,
      id: 2,
      error: { code: -32600 },
    });
  });
});
