import { readFileSync } from "node:fs";
import { expect } from "vitest";
import { readTape, type TapeClock, TapeNode, type TapeRecord, writeTape } from "../../tools/tape/index.js";
import { ManualTimers } from "../node/manual-timers.js";
import { RawClient } from "./raw-client.js";

/**
 * The tape checks that the committed negative controls (`tape.negative-control.test.ts`) run against wrong tape tools,
 * and that `format.test.ts` and `node.test.ts` run against the real ones: each fails when the rule it names is broken.
 * [A68, A69, A70, TT-1 to TT-3; acceptance §9]
 */

/** The committed tape holding every record kind, written by hand in the writer's form (not by the writer). [TT-1] */
export const GOLDEN_PATH = new URL("./fixtures/every-kind.tape.jsonl", import.meta.url);

/** Its SHA-256, computed by `shasum -a 256` when the file was written (2026-10-25). */
export const GOLDEN_ID = "d7e844d4bd63c526e8379b5c036d1419223ddefdd890b9bffcb2a475f231358b";

const HASH_1 = `0x${"11".repeat(32)}`;
const HASH_2 = `0x${"22".repeat(32)}`;
const HASH_3 = `0x${"33".repeat(32)}`;
const HASH_4 = `0x${"44".repeat(32)}`;

/** The committed tape's records, as values. */
export const GOLDEN_RECORDS: readonly TapeRecord[] = [
  { method: "system_properties", params: [], result: { genesis_state: "0x00", ss58Format: 42, tokenDecimals: 6 } },
  { method: "chain_getBlockHash", params: [0], result: HASH_1 },
  { method: "chain_getFinalizedHead", params: [], result: HASH_2, delayMs: 2000 },
  {
    method: "state_getStorage",
    params: ["0x26aa394eea5630e07c48ae0c9558cef7", HASH_3],
    error: { code: 4003, message: `Client error: UnknownBlock: State already discarded for ${HASH_3}` },
  },
  { subscribe: "s-1", method: "chain_subscribeFinalizedHeads", params: [] },
  {
    notify: "s-1",
    result: { parentHash: "0x00", number: "0x1", stateRoot: "0x00", extrinsicsRoot: "0x00", digest: { logs: [] } },
  },
  { fault: "timeout", method: "chain_getBlock", params: [HASH_4] },
  { fault: "error", method: "chain_getBlock", params: [HASH_4], code: -32999 },
  { fault: "error", method: "midnight_ledgerStateRoot", params: ["0x55"] },
  {
    method: "state_getMetadata",
    params: { at: "0x66", flag: true },
    result: [
      1,
      -2,
      3.5,
      1e21,
      5e-7,
      18446744073709551616n,
      -9007199254740993n,
      true,
      false,
      null,
      'é"\\\n\u0001\u001f😀/',
    ],
  },
  { method: "chain_getHeader", params: ["0x77"], result: { b: { d: [], c: {} }, a: "", 1: "one" } },
  { disconnect: true },
  { subscribe: 7, method: "chain_subscribeNewHeads", params: [] },
  { notify: 7, result: null },
  { subscribe: "s-1", method: "chain_subscribeFinalizedHeads", params: [] },
  { notify: "s-1", result: { number: "0x2" } },
  { method: "chain_getFinalizedHead", params: [], result: HASH_2, delayMs: 0 },
  { disconnect: true },
];

/**
 * The round trip of the committed tape: its records read back as written, then written back to its very bytes. [A68]
 */
export function expectGoldenRoundTrip(): void {
  const bytes = readFileSync(GOLDEN_PATH);
  expect(Buffer.from(writeTape(GOLDEN_RECORDS)).toString("utf8")).toBe(bytes.toString("utf8"));
  const tape = readTape(bytes);
  expect(tape.records).toEqual(GOLDEN_RECORDS);
  expect(tape.id).toBe(GOLDEN_ID);
  const again = writeTape(tape.records);
  expect(Buffer.from(again).toString("utf8")).toBe(bytes.toString("utf8"));
  expect(Buffer.compare(Buffer.from(again), bytes)).toBe(0);
}

/** A {@link TapeClock} on a clock the test moves by hand. */
export function manualClock(timers: ManualTimers): TapeClock {
  return { setTimeout: timers.setTimeout, clearTimeout: timers.clearTimeout, now: () => timers.now };
}

/** Runs `body` against a tape node serving `records`, closing both afterwards. */
export async function withNode<T>(
  records: readonly TapeRecord[],
  body: (node: TapeNode) => Promise<T>,
  clock?: TapeClock,
): Promise<T> {
  const node = await TapeNode.start(clock === undefined ? { records } : { records, clock });
  try {
    return await body(node);
  } finally {
    await node.close();
  }
}

/**
 * Answers by occurrence: heads A, B, C recorded, four calls get A, B, C, C — and a pair's count is its own. [A69, TT-2]
 */
export async function expectAnswersByOccurrence(): Promise<void> {
  const records: TapeRecord[] = [
    { method: "chain_getFinalizedHead", params: [], result: "A" },
    { method: "chain_getBlockHash", params: [1], result: "one" },
    { method: "chain_getFinalizedHead", params: [], result: "B" },
    { method: "chain_getBlockHash", params: [2], result: "two" },
    { method: "chain_getFinalizedHead", params: [], result: "C" },
  ];
  await withNode(records, async (node) => {
    const client = await RawClient.open(node.url);
    const heads: unknown[] = [];
    for (let call = 0; call < 4; call++) heads.push((await client.call("chain_getFinalizedHead", [])).result);
    expect(heads).toEqual(["A", "B", "C", "C"]);
    const hashes: unknown[] = [];
    for (const height of [2, 1, 2]) hashes.push((await client.call("chain_getBlockHash", [height])).result);
    expect(hashes).toEqual(["two", "one", "two"]);
    await client.close();
  });
}

/**
 * The delay (on a clock moved by hand): a call record with `delayMs: 2000` is answered when the
 * clock reaches 2000 ms after the call and not before; the next record is answered at once, both while the delayed
 * answer waits and after it. [A69, TT-2]
 */
export async function expectDelayHonoured(): Promise<void> {
  const timers = new ManualTimers();
  const records: TapeRecord[] = [
    { method: "chain_getFinalizedHead", params: [], result: "slow", delayMs: 2000 },
    { method: "chain_getBlockHash", params: [1], result: "next" },
    { method: "chain_getBlockHash", params: [2], result: "after" },
  ];
  await withNode(
    records,
    async (node) => {
      const client = await RawClient.open(node.url);
      const slow = client.request("chain_getFinalizedHead", []);
      const next = client.request("chain_getBlockHash", [1]);
      await client.barrier();
      expect(client.answered(next)).toBe(true);
      expect(client.answered(slow)).toBe(false);
      expect(timers.pending()).toEqual([2000]);
      await timers.advance(1999);
      await client.barrier();
      expect(client.answered(slow)).toBe(false);
      await timers.advance(1);
      expect((await client.answer(slow)).result).toBe("slow");
      const after = client.request("chain_getBlockHash", [2]);
      await client.barrier();
      expect(client.answered(after)).toBe(true);
      expect(timers.pending()).toEqual([]);
      await client.close();
    },
    manualClock(timers),
  );
}

/**
 * A subscription's notifications come in file order, each only once every call recorded before it has been answered,
 * and right after the answer that let it through. [A70, TT-3]
 */
export async function expectNotificationsAfterCalls(): Promise<void> {
  const records: TapeRecord[] = [
    { subscribe: "s", method: "chain_subscribeNewHeads", params: [] },
    { method: "chain_getFinalizedHead", params: [], result: "head" },
    { notify: "s", result: 1 },
    { method: "chain_getBlockHash", params: [1], result: "one" },
    { notify: "s", result: 2 },
  ];
  await withNode(records, async (node) => {
    const client = await RawClient.open(node.url);
    expect((await client.call("chain_subscribeNewHeads", [])).result).toBe("s");
    await client.barrier();
    expect(client.notifications()).toEqual([]);
    const head = client.request("chain_getFinalizedHead", []);
    await client.barrier();
    expect(client.notifications().map((frame) => frame.params?.result)).toEqual([1]);
    const answerAt = client.frames.findIndex((frame) => frame.id === head);
    expect(client.frames[answerAt + 1]).toEqual({
      jsonrpc: "2.0",
      method: "chain_newHead",
      params: { subscription: "s", result: 1 },
    });
    await client.call("chain_getBlockHash", [1]);
    await client.barrier();
    expect(client.notifications().map((frame) => frame.params?.result)).toEqual([1, 2]);
    await client.close();
  });
}
