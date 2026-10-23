import { describe, expect, it } from "vitest";
import * as v8 from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import * as v9 from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { runInFreshInstance } from "./fresh-instance.js";
import { bigCell, cell, contractAddress, makeV8State, makeV9State, V9_PACKAGE_PATH } from "./ledger-states.js";
import { decodeChildren, free, hex, refsOf, storedNodeKey, taggedRootKey } from "./node-format.js";
import { describeNodeStoreExports, nodesOf } from "./node-store-suite.js";

// Task 0.2 of `openspec/changes/core-arch` (design.md §5.2, specs/ledger LG-9, specs/contract-data CC-3): the vendored
// ledger v9 package (ledger-9.1.0.0-rc.5 with the patches in vendor/ledger/v9/patches), exercised on the built package.

describeNodeStoreExports("vendored ledger v9", {
  packagePath: V9_PACKAGE_PATH,
  stateTag: "ledger-state[v18]",
  api: v9,
  makeState: makeV9State,
  contractAddress,
  contractStateSerialized(state, address) {
    const contract = state.index(hex(address));
    if (!contract) throw new Error("the state has no such contract");
    const bytes = contract.serialize();
    free(contract);
    return bytes;
  },
  emptyZswapStateSerialized() {
    const zswap = new v9.ZswapChainState();
    const bytes = zswap.serialize();
    free(zswap);
    return bytes;
  },
});

const atom = (bytes: Uint8Array, length: number): v9.AlignedValue => ({
  value: [bytes],
  alignment: [{ tag: "atom", value: { tag: "bytes", length } }],
});
const smallCell = (n: number, length: number): v9.StateValue =>
  v9.StateValue.newCell(atom(n === 0 ? new Uint8Array() : Uint8Array.of(n), length));
const arrayOf = (items: v9.StateValue[]): v9.StateValue =>
  items.reduce((array, item) => array.arrayPush(item), v9.StateValue.newArray());
const logValue = (version: number, eventType: number, data: v9.StateValue): v9.StateValue =>
  arrayOf([smallCell(version, 4), smallCell(eventType, 1), data]);

describe("vendored ledger v9: decodeLogItem, the VM's own log decoding", () => {
  const data = arrayOf([v9.StateValue.newCell(cell("log", 0)), v9.StateValue.newCell(cell("log", 1))]);

  it("decodes a well-formed log value into its version, event type and data", () => {
    const item = v9.decodeLogItem(v9.serializeStateValue(logValue(1, 5, data)));
    expect(item).not.toBeNull();
    expect(item!.version).toBe(1);
    expect(item!.eventType).toBe("UnshieldedReceive");
    expect(hex(item!.data)).toBe(hex(v9.serializeStateValue(data)));
    expect(taggedRootKey(item!.data).tag).toBe("impact-state-value[v2]");

    const misc = v9.decodeLogItem(v9.serializeStateValue(logValue(7, 10, data)));
    expect([misc!.version, misc!.eventType]).toEqual([7, "Misc"]);
  });

  it("makes a malformed wrapper a version-0 Misc log of the whole value", () => {
    for (const value of [
      arrayOf([smallCell(1, 4), data]),
      logValue(1, 11, data),
      v9.StateValue.newCell(cell("log", 2)),
      v9.StateValue.newNull(),
    ]) {
      const serialized = v9.serializeStateValue(value);
      const item = v9.decodeLogItem(serialized);
      expect(item).not.toBeNull();
      expect(item!.version).toBe(0);
      expect(item!.eventType).toBe("Misc");
      expect(hex(item!.data)).toBe(hex(serialized));
    }
  });

  it("gives no log when the data exceeds the emitted-log bound", () => {
    const big = arrayOf(Array.from({ length: 14 }, (_, i) => v9.StateValue.newCell(cell("big", i))));
    expect(v9.decodeLogItem(v9.serializeStateValue(logValue(1, 5, big)))).toBeNull();
    expect(v9.decodeLogItem(v9.serializeStateValue(big))).toBeNull();
  });

  it("refuses bytes that are not a serialized state value", () => {
    const serialized = v9.serializeStateValue(data);
    expect(() => v9.decodeLogItem(serialized.subarray(0, serialized.length - 1))).toThrow();
    expect(() => v9.decodeLogItem(Uint8Array.of(1, 2, 3))).toThrow();
    const contract = new v9.ContractState();
    expect(() => v9.decodeLogItem(contract.serialize())).toThrow();
    free(contract);
  });
});

describe("vendored ledger v9: convertFromV8, the ledger team's v8 to v9 state translation", () => {
  it("converts a v8 state stored by the v8 package into the same v9 state in every run", { timeout: 240_000 }, async () => {
    v8.flushNodes();
    const v8State = makeV8State("convert");
    const v8Key = v8.stateKey(v8State);
    v8.persistKey(v8Key);
    const v8Batch = v8.flushNodes();
    const v8Keys = new Set(v8Batch.inserts.map((node) => hex(node.key)));
    for (const node of v8Batch.inserts) {
      for (const ref of refsOf(decodeChildren(node.children))) expect(v8Keys.has(hex(ref))).toBe(true);
    }

    const request = { packagePath: V9_PACKAGE_PATH, op: "convert" as const, key: v8Key, nodes: v8Batch.inserts };
    const [first, second] = await Promise.all([runInFreshInstance(request), runInFreshInstance(request)]);
    expect(first.error).toBeUndefined();
    expect(second.error).toBeUndefined();
    expect(hex(first.stateRoot!)).toBe(hex(second.stateRoot!));
    expect(hex(first.stateKey!)).toBe(hex(second.stateKey!));
    expect(first.batch!.inserts.map((node) => hex(node.key))).toEqual(second.batch!.inserts.map((node) => hex(node.key)));
    for (const node of first.batch!.inserts) expect(hex(storedNodeKey(node.data, node.children))).toBe(hex(node.key));
    expect(first.batch!.rootCounts.map((c) => [hex(c.key), c.delta])).toEqual([[hex(first.stateKey!), 1]]);

    // The converted state is a v9 state holding the v8 state's contract with the same data.
    expect(taggedRootKey(first.serialized!).tag).toBe("ledger-state[v18]");
    expect(hex(taggedRootKey(first.serialized!).key)).toBe(hex(first.stateKey!));
    const converted = v9.LedgerState.deserialize(first.serialized!);
    expect(hex(v9.stateRoot(converted))).toBe(hex(first.stateRoot!));
    const contract = converted.index(hex(contractAddress("convert")));
    expect(contract).toBeDefined();
    const cells = contract!.data.state.asArray()!.map((value) => (value as v9.StateValue).asCell());
    expect(cells).toEqual([...[0, 1, 2].map((i) => cell("convert", i)), bigCell("convert", 0, 1500), bigCell("convert", 1, 1300)]);
    free(contract!);
    free(converted);

    // The converted state's flushed nodes and the v8 nodes are all a fresh instance needs to load it.
    const loaded = await runInFreshInstance({
      packagePath: V9_PACKAGE_PATH,
      op: "load",
      key: first.stateKey!,
      nodes: nodesOf([v8Batch, first.batch!]),
    });
    expect(loaded.error).toBeUndefined();
    expect(hex(loaded.stateRoot!)).toBe(hex(first.stateRoot!));
    expect(hex(loaded.serialized!)).toBe(hex(first.serialized!));
    free(v8State);
  });

  it("fails when the store has no node for the v8 state key", { timeout: 120_000 }, async () => {
    // Node keys carry no type, so the conversion cannot tell a v8 state's root from another node's; the caller passes
    // the key of the state it stored for the last v8 block. A key the store does not have fails cleanly.
    const result = await runInFreshInstance({
      packagePath: V9_PACKAGE_PATH,
      op: "convert",
      key: contractAddress("absent"),
      nodes: [],
    });
    expect(result.error).toMatch(/convertFromV8: the node store has no node/);
  });
});
