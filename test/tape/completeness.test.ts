import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type ConnectSocket, connectWebSocket } from "../../src/node/index.js";
import {
  completenessProblems,
  EVENTS_KEY,
  recordRange,
  REGISTRATION_PREFIXES,
  type TapeRecord,
} from "../../tools/tape/index.js";
import { ScriptedNode } from "./scripted-node.js";
import { type SyntheticChain, syntheticChain } from "./synthetic-chain.js";

/**
 * The completeness check (`tools/tape/completeness.ts`), which shows that every allowed node call of every height is on
 * the tape: a tape of the range `from`–`to` is complete when it is one session without faults or error answers and
 * holds, for every height h of the range, `chain_getBlockHash [h]` and, at its hash, `chain_getHeader` (the block's
 * number h, its parent the hash of h − 1), `chain_getBlock`, `state_getRuntimeVersion`, `state_getStorage
 * [System.Events]` and `midnight_ledgerStateRoot`; `state_getMetadata` at the range's first block and wherever the
 * state's runtime changes; for block 0, `system_properties` and every page of both registration prefixes with each
 * key's value; and the live window: the finalized head with its header, and both head subscriptions with a notification
 * each. Each problem is named — the height, the call and its params — so a test failing on one says what is missing.
 * [Q123, IN-8]
 */

const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });

let node: ScriptedNode;
let chain: SyntheticChain;
let records: readonly TapeRecord[] = [];
const RANGE = { from: 0, to: 20, keysPage: 2 } as const;

beforeAll(async () => {
  chain = syntheticChain({ length: 30, upgrades: [{ height: 9, specVersion: 1_000_000 }], registrations: 3 });
  node = await ScriptedNode.start(chain.script);
  ({ records } = await recordRange({ node: node.url, ...RANGE, chunkHeights: 6, liveWindowMs: 20, connect: quietConnect }));
});
afterAll(async () => {
  await node.stop();
});

const isCall = (record: TapeRecord, method: string, params?: readonly unknown[]): boolean =>
  "method" in record &&
  !("subscribe" in record) &&
  !("fault" in record) &&
  record.method === method &&
  (params === undefined || JSON.stringify(record.params) === JSON.stringify(params));

const without = (method: string, params?: readonly unknown[]) => records.filter((record) => !isCall(record, method, params));

describe("completenessProblems", () => {
  it("passes a tape the recording driver recorded", () => {
    expect(completenessProblems(records, RANGE)).toEqual([]);
    expect(completenessProblems(records, { from: 3, to: 20 })).toEqual([`height 3: no state_getMetadata ["${chain.hashes[3]}"] (the range's first block)`]);
  });

  it("names a height whose block hash is missing, and checks nothing else of it", () => {
    expect(completenessProblems(without("chain_getBlockHash", [7]), RANGE)).toEqual([
      "height 7: no chain_getBlockHash [7]",
      `height 8: no chain_getBlockHash [7] to check its parent hash against`,
    ]);
  });

  it("names each per-height call that is missing, with its params", () => {
    const hash = chain.hashes[5] as string;
    for (const [method, params] of [
      ["chain_getHeader", [hash]],
      ["chain_getBlock", [hash]],
      ["state_getRuntimeVersion", [hash]],
      ["state_getStorage", [EVENTS_KEY, hash]],
      ["midnight_ledgerStateRoot", [hash]],
    ] as const) {
      expect(completenessProblems(without(method, params), RANGE), method).toEqual([
        `height 5: no ${method} ${JSON.stringify(params)}`,
      ]);
    }
  });

  it("names the metadata missing where the runtime changes, and at the range's first block", () => {
    expect(completenessProblems(without("state_getMetadata", [chain.hashes[9]]), RANGE)).toEqual([
      `height 9: no state_getMetadata ["${chain.hashes[9]}"] (the state's runtime changes from 22000 to 1000000)`,
    ]);
    expect(completenessProblems(without("state_getMetadata", [chain.hashes[0]]), RANGE)).toEqual([
      `height 0: no state_getMetadata ["${chain.hashes[0]}"] (the range's first block)`,
    ]);
  });

  it("names block 0's calls that are missing: system_properties, a page of keys, a key's value", () => {
    const [mappings, mapping] = REGISTRATION_PREFIXES;
    const h0 = chain.hashes[0];
    const key = chain.registrationKeys[2] as string;
    expect(completenessProblems(without("system_properties"), RANGE)).toEqual(["block 0: no system_properties []"]);
    expect(completenessProblems(without("state_getKeysPaged", [mappings, 2, chain.registrationKeys[1], h0]), RANGE)).toEqual([
      `block 0: no state_getKeysPaged ${JSON.stringify([mappings, 2, chain.registrationKeys[1], h0])}`,
    ]);
    expect(completenessProblems(without("state_getKeysPaged", [mapping, 2, null, h0]), RANGE)).toEqual([
      `block 0: no state_getKeysPaged ${JSON.stringify([mapping, 2, null, h0])}`,
    ]);
    expect(completenessProblems(without("state_getStorage", [key, h0]), RANGE)).toEqual([
      `block 0: no state_getStorage ${JSON.stringify([key, h0])}`,
    ]);
    // A different page size is another set of calls: the tape's pages are not the 1000-key pages a client asks.
    expect(completenessProblems(records, { from: 0, to: 20 })).toContain(
      `block 0: no state_getKeysPaged ${JSON.stringify([mappings, 1000, null, h0])}`,
    );
  });

  it("names the live window's records that are missing", () => {
    expect(completenessProblems(without("chain_getFinalizedHead"), RANGE)).toEqual(["no chain_getFinalizedHead []"]);
    expect(completenessProblems(without("chain_getHeader", [chain.hashes[29]]), RANGE)).toEqual([
      `no chain_getHeader ["${chain.hashes[29]}"] (the finalized head)`,
    ]);
    const unsubscribed = records.filter((record) => !("subscribe" in record && record.method === "chain_subscribeNewHeads"));
    const ids = new Set(records.filter((record) => "subscribe" in record && record.method === "chain_subscribeNewHeads").map((record) => JSON.stringify((record as { subscribe: unknown }).subscribe)));
    const quiet = unsubscribed.filter((record) => !("notify" in record && ids.has(JSON.stringify(record.notify))));
    expect(completenessProblems(quiet, RANGE)).toEqual(["no chain_subscribeNewHeads subscription"]);
    const silent = records.filter((record) => !("notify" in record));
    expect(completenessProblems(silent, RANGE)).toEqual([
      "no notification of chain_subscribeNewHeads",
      "no notification of chain_subscribeFinalizedHeads",
    ]);
  });

  it("names a header that is not its block's, and a chain that does not link", () => {
    const hash5 = chain.hashes[5] as string;
    const changed = records.map((record) => {
      if (!isCall(record, "chain_getHeader", [hash5])) return record;
      const header = (record as { result: Record<string, unknown> }).result;
      return { ...record, result: { ...header, number: "0x6", parentHash: chain.hashes[1] } } as TapeRecord;
    });
    expect(completenessProblems(changed, RANGE)).toEqual([
      "height 5: chain_getHeader's number is 0x6, not 0x5",
      `height 5: its parent hash ${chain.hashes[1]} is not the hash of height 4, ${chain.hashes[4]}`,
    ]);
  });

  it("names an answer it cannot read: a null block hash, a header without a number, a runtime version without a spec_version", () => {
    const changed = records.map((record) => {
      if (isCall(record, "chain_getBlockHash", [4])) return { ...record, result: null } as TapeRecord;
      if (isCall(record, "chain_getHeader", [chain.hashes[6]])) return { ...record, result: { parentHash: chain.hashes[5] } } as TapeRecord;
      if (isCall(record, "state_getRuntimeVersion", [chain.hashes[7]])) return { ...record, result: {} } as TapeRecord;
      return record;
    });
    expect(completenessProblems(changed, RANGE)).toEqual([
      "height 4: chain_getBlockHash [4] answered null, not a block hash",
      "height 5: no chain_getBlockHash [4] to check its parent hash against",
      "height 6: chain_getHeader's number is undefined, not 0x6",
      "height 7: state_getRuntimeVersion's answer has no specVersion",
    ]);
  });

  it("refuses a tape of two sessions, one with a fault, and one with an error answer, naming each line", () => {
    const at = records.findIndex((record) => isCall(record, "chain_getBlock", [chain.hashes[2]]));
    const twoSessions = [...records.slice(0, 3), { disconnect: true } as const, ...records.slice(3)];
    expect(completenessProblems(twoSessions, RANGE)[0]).toBe(
      "line 4: a disconnect: a complete tape is one session, which every client's one connection replays",
    );
    const faulted = records.map((record, index) =>
      index === at ? ({ fault: "timeout", method: "chain_getBlock", params: [chain.hashes[2]] } as TapeRecord) : record,
    );
    expect(completenessProblems(faulted, RANGE)).toEqual([
      `line ${at + 1}: a fault record (chain_getBlock), which no node answered`,
      `height 2: no chain_getBlock ["${chain.hashes[2]}"]`,
    ]);
    const failed = records.map((record, index) =>
      index === at ? ({ method: "chain_getBlock", params: [chain.hashes[2]], error: { code: -32603, message: "x" } } as TapeRecord) : record,
    );
    expect(completenessProblems(failed, RANGE)).toEqual([
      `line ${at + 1}: chain_getBlock ["${chain.hashes[2]}"] answered an error: {"code":-32603,"message":"x"}`,
      `height 2: no chain_getBlock ["${chain.hashes[2]}"]`,
    ]);
  });

  it("refuses a range it cannot check", () => {
    expect(() => completenessProblems(records, { from: 2, to: 1 })).toThrow("from (2) is above to (1)");
    expect(() => completenessProblems(records, { from: -1, to: 1 })).toThrow("from must be a height");
    expect(() => completenessProblems(records, { from: 0, to: 1, keysPage: 0 })).toThrow("keysPage must be an integer from 1 to 1000");
  });

  it("names a call of a method outside IN-8, and a page of keys that is no list", () => {
    const [mappings] = REGISTRATION_PREFIXES;
    const h0 = chain.hashes[0];
    const extra: TapeRecord[] = [{ method: "system_version", params: [], result: "x" }, ...records];
    expect(completenessProblems(extra, RANGE)).toEqual(["line 1: system_version is not an allowed node call"]);
    const notList = records.map((record) =>
      isCall(record, "state_getKeysPaged", [mappings, 2, null, h0]) ? ({ ...record, result: "0x00" } as TapeRecord) : record,
    );
    expect(completenessProblems(notList, RANGE)).toEqual([
      `block 0: state_getKeysPaged ${JSON.stringify([mappings, 2, null, h0])} answered "0x00", not a list of keys`,
    ]);
  });

  it("names a block hash that is text but no hash, and a first parent link that does not hold (the range's second block)", () => {
    const hash1 = chain.hashes[1] as string;
    const changed = records.map((record) => {
      if (isCall(record, "chain_getBlockHash", [4])) return { ...record, result: "0x12" } as TapeRecord;
      if (!isCall(record, "chain_getHeader", [hash1])) return record;
      const header = (record as { result: Record<string, unknown> }).result;
      return { ...record, result: { ...header, parentHash: chain.hashes[7] } } as TapeRecord;
    });
    expect(completenessProblems(changed, RANGE)).toEqual([
      `height 1: its parent hash ${chain.hashes[7]} is not the hash of height 0, ${chain.hashes[0]}`,
      'height 4: chain_getBlockHash [4] answered "0x12", not a block hash',
      "height 5: no chain_getBlockHash [4] to check its parent hash against",
    ]);
  });
});

