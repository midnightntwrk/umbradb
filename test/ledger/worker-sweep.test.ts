import { afterEach, describe, expect, it } from "vitest";
import type { StoredNode } from "../../src/ledger/types.js";
import type { AppliedState, ApplyBlock, BlockId } from "../../src/ledger/worker/engine.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { callTransaction, cellValue, contractFixture, hex, NETWORK_ID, RAW, T0 } from "./adapter-fixtures.js";

// The ledger worker's side of the sweep, in a real worker thread over a map of the nodes written so far. The thread has
// its own instance of the v9 package, which nothing of this thread's (the transactions built here, their builders'
// objects) can hold. Checked:
// - the nodes the sweep deletes are evicted from the package, so a node needed again is flushed again;
// - a kept parse's native objects are freed when the parse is dropped, and freed at once when a kept transaction holds
//   a node the sweep deletes (the eviction is then tried again);
// - evicting a node of a state the engine holds is refused.
//
// The test package's loader records what the package was asked. [LG-14; design §5.4]

const LONG = 240_000;
const LOADER = new URL("./fixtures/ledger-test-loader.ts", import.meta.url);
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });

/** A read handle over the nodes written so far, as the bridge queries `core_ledger_state.nodes`. */
function reader(stored: ReadonlyMap<string, StoredNode>) {
  return {
    async query(_sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
      return (params[0] as Uint8Array[]).map(hex).flatMap((k) => {
        const node = stored.get(k);
        return node === undefined ? [] : [{ node_key: node.key, data: node.data, children: node.children }];
      });
    },
  };
}

/** Block `height`'s apply input (v9, at T0 + 6 s × height). */
function input(height: bigint, transactions: number): ApplyBlock {
  return {
    ledger: "v9",
    ...at(height),
    parentHash: at(height - 1n).hash,
    timestampMs: BigInt(T0) + height * 6_000n,
    parentTimestampMs: BigInt(T0) + (height - 1n) * 6_000n,
    firstRegularAtParentTime: false,
    transactions,
  };
}

/** A call replacing the contract's state with a cell of 1,500 bytes of `fill` (a node of its own in the state). */
const setCell = (contract: { address: Uint8Array; deploy: Uint8Array }, fill: number, height: bigint): Uint8Array =>
  callTransaction(RAW.v9, contract, [{ push: { storage: true, value: cellValue(new Uint8Array(1_500).fill(fill)) } }, { swap: { n: 0 } }, "pop"] as never, undefined, T0 + Number(height) * 6_000 + 60_000);

interface Probe {
  readonly evictions: readonly { readonly keys: readonly string[]; readonly refused: boolean }[];
  readonly forgotten: readonly number[];
}

let host: LedgerHost | undefined;
afterEach(() => host?.close());

describe("the ledger worker's side of the sweep (task 12.5; LG-14)", () => {
  it("evicts deleted nodes, so a node needed again is flushed again; frees a dropped parse's natives; frees kept parses when one holds a deleted node", { timeout: LONG }, async () => {
    host = startLedgerWorker({ loader: LOADER, loaderData: { recordEvictions: true } });
    const worker = host;
    const nodes = new Map<string, StoredNode>();
    const read = reader(nodes);
    const write = (applied: AppliedState): void => {
      for (const node of applied.batch.inserts) nodes.set(hex(node.key), node);
    };
    const step = async (block: ApplyBlock, transactions: Uint8Array[]): Promise<AppliedState> => {
      await worker.parse("v9", block, transactions);
      const applied = await worker.apply(block, read);
      write(applied);
      expect(await worker.commit(block)).toBe(true);
      expect(await worker.release({ upTo: block.height })).toBe(1);
      return applied;
    };
    write(
      await worker.genesis(
        { ledger: "v9", ...at(0n), parentHash: new Uint8Array(32), timestampMs: BigInt(T0), transactions: 0, genesisState: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(), includesBlockZero: true },
        read,
      ),
    );
    await worker.commit(at(0n));
    const contract = await contractFixture(RAW.v9);
    await step(input(1n, 1), [contract.deploy]);
    const withX = await step(input(2n, 1), [setCell(contract, 7, 2n)]);
    const cellX = withX.batch.inserts.find((node) => node.data.length > 1_400) as StoredNode;
    expect(cellX).toBeDefined();
    const withY = await step(input(3n, 1), [setCell(contract, 8, 3n)]);
    const cellY = withY.batch.inserts.find((node) => node.data.length > 1_400) as StoredNode;
    // Each dropped parse's native objects were freed.
    expect(((await worker.probe()) as Probe).forgotten).toEqual([1, 1, 1]);

    // Block 4 sets X again: its transaction, parsed and kept, holds X's value while the sweep deletes X's node. The
    // first eviction is refused; the kept parses' natives are freed; the second takes.
    await worker.parse("v9", at(4n), [setCell(contract, 7, 4n)]);
    expect(await worker.evict([cellX.key])).toBe(1);
    let probe = (await worker.probe()) as Probe;
    expect(probe.evictions).toEqual([
      { keys: [hex(cellX.key)], refused: true },
      { keys: [hex(cellX.key)], refused: false },
    ]);
    expect(probe.forgotten).toEqual([1, 1, 1, 1]);
    // X needed again at 4: flushed again, as the package forgot it had stored it (its transaction parsed again).
    nodes.delete(hex(cellX.key));
    const reinserted = await worker.apply(input(4n, 1), read);
    expect(reinserted.output.results.map((r) => r.outcome)).toEqual(["success"]);
    expect(reinserted.batch.inserts.map((node) => hex(node.key))).toContain(hex(cellX.key));
    write(reinserted);
    await worker.commit(at(4n));

    // A node of a state the engine holds (the state at 4 holds X) is refused, both tries, and fails the request.
    await expect(worker.evict([cellX.key])).rejects.toThrow(/still held by a live object/);
    // Y, held by nothing any more, is evicted at the first try.
    expect(await worker.evict([cellY.key])).toBe(1);
    expect(await worker.evict([])).toBe(0);
    probe = (await worker.probe()) as Probe;
    expect(probe.evictions.slice(2)).toEqual([
      { keys: [hex(cellX.key)], refused: true },
      { keys: [hex(cellX.key)], refused: true },
      { keys: [hex(cellY.key)], refused: false },
    ]);
    expect(worker.failure).toBeNull();
  });
});
