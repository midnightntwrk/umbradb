import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { BACKOFF_BASE_MS, backoffDelay } from "../../src/node/backoff.js";
import { connectionFailure, rpcFailure } from "../../src/node/errors.js";

/**
 * The node client's two retry rules as pure functions, checked here case by case; the client's suite checks them end
 * to end (`client.test.ts`):
 * - the back-off: from 1 s, doubling up to `backoffCeilingMs`, with no limit on attempts;
 * - which node failure is retried and which halts. `node-unreachable` is retried: a connection error, a timeout, a
 *   handshake refused with HTTP 429 or a 5xx status, the node's own rate limit. `node-requirement` (the node's state
 *   is unavailable) halts, and so does `node-error`, everything else. [IN-9]
 * [IN-10]
 */

describe("backoffDelay (IN-10)", () => {
  it("is 1 s for the first retry, doubling each time, never above the ceiling, and has no last attempt", () => {
    expect(BACKOFF_BASE_MS).toBe(1_000);
    const ceiling = 30_000;
    expect([1, 2, 3, 4, 5, 6, 7, 8].map((attempt) => backoffDelay(attempt, ceiling))).toEqual([
      1_000, 2_000, 4_000, 8_000, 16_000, 30_000, 30_000, 30_000,
    ]);
    // Without limit: far attempts stay at the ceiling (2 ** 1999 is Infinity), never NaN or 0.
    expect(backoffDelay(1_000, ceiling)).toBe(30_000);
    expect(backoffDelay(2_000, ceiling)).toBe(30_000);
    expect([1, 2, 3, 4, 5].map((attempt) => backoffDelay(attempt, 5_000))).toEqual([1_000, 2_000, 4_000, 5_000, 5_000]);
    expect([1, 2].map((attempt) => backoffDelay(attempt, 500))).toEqual([500, 500]);
    expect([1, 2].map((attempt) => backoffDelay(attempt, 1_000))).toEqual([1_000, 1_000]);
    expect(backoffDelay(3, 4_000)).toBe(4_000);
  });
});

describe("rpcFailure: a JSON-RPC error answer", () => {
  it("is node-requirement when the node says the state is gone, node-unreachable on its rate limit, else node-error", () => {
    const cases: readonly [unknown, string, boolean, Record<string, unknown>][] = [
      [
        { code: 4003, message: "Client error: UnknownBlock: State already discarded for 0xab" },
        "node-requirement",
        false,
        { reason: "state-unavailable", rpcCode: 4003 },
      ],
      [{ code: -32000, message: "State already discarded for 0x01" }, "node-requirement", false, { rpcCode: -32000 }],
      [{ code: -32999, message: "RPC rate limit exceeded" }, "node-unreachable", true, { reason: "rate-limited" }],
      [{ code: -32998, message: "RPC rate limit exceeded" }, "node-error", false, { reason: "rpc-error" }],
      [{ code: -32601, message: "Method not found" }, "node-error", false, { reason: "rpc-error", rpcCode: -32601 }],
      [{ code: 4003, message: "state already discarded" }, "node-error", false, { reason: "rpc-error" }],
      [{ code: 0, message: "" }, "node-error", false, { reason: "rpc-error", rpcCode: 0, rpcMessage: "" }],
    ];
    for (const [answer, code, retryable, details] of cases) {
      const error = rpcFailure("state_getStorage", answer);
      expect(error, JSON.stringify(answer)).toBeInstanceOf(UmbraError);
      expect(error, JSON.stringify(answer)).toMatchObject({
        code,
        retryable,
        details: { method: "state_getStorage", rpcMessage: (answer as { message: string }).message, ...details },
      });
      expect(error.message).toContain("state_getStorage");
    }
  });

  it("is a bad answer when the error is not a JSON-RPC error object", () => {
    for (const [answer, found] of [
      [null, "null"],
      ["boom", "string"],
      [[1], "array"],
      [{ message: "no code" }, "object"],
      [{ code: "1", message: "m" }, "object"],
      [{ code: 1.5, message: "m" }, "object"],
      [{ code: 1, message: 5 }, "object"],
    ] as const) {
      expect(rpcFailure("chain_getHeader", answer), JSON.stringify(answer)).toMatchObject({
        code: "node-error",
        details: { method: "chain_getHeader", reason: "bad-answer", path: "error", found },
      });
    }
  });
});

describe("connectionFailure: a connection that failed, ended or was refused", () => {
  it("is retried for a network failure, a closed connection, a timeout, 429 and 5xx; halts for any other status", () => {
    const cases: readonly [Parameters<typeof connectionFailure>[0], string, boolean, Record<string, unknown>][] = [
      [
        { kind: "connect-failed", code: "ECONNREFUSED" },
        "node-unreachable",
        true,
        { reason: "connect-failed", cause: "ECONNREFUSED" },
      ],
      [{ kind: "connect-failed" }, "node-unreachable", true, { reason: "connect-failed" }],
      [{ kind: "closed", code: 1006 }, "node-unreachable", true, { reason: "connection-closed", closeCode: 1006 }],
      [{ kind: "closed", code: 1000 }, "node-unreachable", true, { reason: "connection-closed", closeCode: 1000 }],
      [{ kind: "connect-timeout" }, "node-unreachable", true, { reason: "connect-timeout", timeoutMs: 7_000 }],
      [{ kind: "http-status", status: 429 }, "node-unreachable", true, { reason: "http-status", status: 429 }],
      [{ kind: "http-status", status: 500 }, "node-unreachable", true, { reason: "http-status", status: 500 }],
      [{ kind: "http-status", status: 599 }, "node-unreachable", true, { status: 599 }],
      [{ kind: "http-status", status: 600 }, "node-error", false, { reason: "handshake-refused", status: 600 }],
      [{ kind: "http-status", status: 499 }, "node-error", false, { reason: "handshake-refused", status: 499 }],
      [{ kind: "http-status", status: 428 }, "node-error", false, { status: 428 }],
      [{ kind: "http-status", status: 430 }, "node-error", false, { status: 430 }],
      [{ kind: "http-status", status: 200 }, "node-error", false, { status: 200 }],
      [{ kind: "http-status", status: 101 }, "node-error", false, { status: 101 }],
      [{ kind: "bad-frame" }, "node-error", false, { reason: "bad-answer", path: "message" }],
    ];
    for (const [failure, code, retryable, details] of cases) {
      const error = connectionFailure(failure, "chain_getBlock", 7_000);
      expect(error, JSON.stringify(failure)).toMatchObject({
        code,
        retryable,
        details: { method: "chain_getBlock", ...details },
      });
      expect(error.message.length).toBeGreaterThan(20);
    }
    expect(connectionFailure({ kind: "connect-failed" }, "chain_getBlock", 1).details).not.toHaveProperty("cause");
    expect(connectionFailure({ kind: "closed", code: 1006 }, null, 1).details).toMatchObject({ method: null });
  });
});
