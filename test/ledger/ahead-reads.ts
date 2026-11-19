import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { StoredNode } from "../../src/ledger/types.js";
import { type AppliedState, type ApplyBlock, type BlockId, LedgerEngine } from "../../src/ledger/worker/engine.js";
import { type LedgerHost, type LedgerWorkerOptions, startLedgerWorker } from "../../src/ledger/worker/host.js";
import type { NodeReader } from "../../src/ledger/worker/node-bridge.js";
import { callTransaction, cellValue, contractFixture, hex, logProgram, NETWORK_ID, RAW, T0, zswapOutputTransaction } from "./adapter-fixtures.js";

/**
 * Shared by `worker-ahead-reads.test.ts` and its negative control: a chain on the real v9 package whose block 3, applied
 * ahead in a worker thread that loaded the state after block 1 from the node store, reads stored nodes through the main
 * thread. Block 0 is a blank genesis, block 1 a contract's deploy and a zswap output, block 2 empty, block 3 a call of
 * that contract and a zswap output. Imports nothing of Vitest.
 */

export const LONG = 240_000;
const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
export const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });

const hosts: LedgerHost[] = [];
/** A worker thread on the real packages, closed by {@link closeHosts}. */
export const started = (options: LedgerWorkerOptions = {}): LedgerHost => {
  const host = startLedgerWorker(options);
  hosts.push(host);
  return host;
};
/** Closes every worker {@link started} made. */
export const closeHosts = async (): Promise<void> => {
  await Promise.all(hosts.splice(0).map((host) => host.close()));
};

export function applyBlock(height: bigint, transactions: number): ApplyBlock {
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

/** The chain's stored nodes and transactions (see the head comment), made by an engine of this thread. */
export interface Chain {
  /** The state after block 0, and the nodes block 0 wrote. */
  readonly zero: { readonly stateKey: Uint8Array; readonly nodes: readonly StoredNode[] };
  /** The state after block 1, and the nodes block 1 wrote. */
  readonly one: { readonly stateKey: Uint8Array; readonly stateRoot: Uint8Array; readonly nodes: readonly StoredNode[] };
  /** Block 3's transactions. */
  readonly three: readonly Uint8Array[];
  /** The keys of the nodes block 1 wrote that block 0 had not, hex. */
  readonly written: ReadonlySet<string>;
}

/** Made once: the engines of this thread share one package, which flushes a node the first time only. */
let chainMade: Promise<Chain> | undefined;
export const chain = (): Promise<Chain> => (chainMade ??= makeChain());

async function makeChain(): Promise<Chain> {
  const engine = new LedgerEngine({ load: loadLedgerPackage });
  const zero = await engine.genesis({
    ledger: "v9",
    ...at(0n),
    parentHash: new Uint8Array(32),
    timestampMs: BigInt(T0),
    transactions: 0,
    genesisState: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: true,
  });
  engine.commit(at(0n));
  const contract = await contractFixture(RAW.v9);
  await engine.parse("v9", at(1n), [contract.deploy, zswapOutputTransaction(RAW.v9)]);
  const one = await engine.apply(applyBlock(1n, 2));
  const before = new Set(zero.batch.inserts.map((node) => hex(node.key)));
  return {
    zero: { stateKey: zero.stateKey, nodes: zero.batch.inserts },
    one: { stateKey: one.stateKey, stateRoot: one.stateRoot, nodes: one.batch.inserts },
    three: [callTransaction(RAW.v9, contract, logProgram([cellValue(Uint8Array.of(5))])), zswapOutputTransaction(RAW.v9)],
    written: new Set(one.batch.inserts.map((node) => hex(node.key)).filter((key) => !before.has(key))),
  };
}

/**
 * A reader over `nodes` that reports the committed height `height` and answers after a turn of the event loop, as a
 * read of a database does; `queries` records the keys of each statement.
 */
export function mapReader(nodes: readonly StoredNode[], height: bigint | null) {
  const stored = new Map(nodes.map((node) => [hex(node.key), node]));
  const queries: string[][] = [];
  return {
    height,
    queries,
    async query(_sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
      await new Promise((resolve) => setImmediate(resolve));
      const keys = (params[0] as Uint8Array[]).map(hex);
      queries.push(keys);
      return keys.flatMap((key) => {
        const node = stored.get(key);
        return node === undefined ? [] : [{ node_key: node.key, data: node.data, children: node.children }];
      });
    },
  };
}

/**
 * `host` holding the state after block 1, loaded from the node store through `read`, and block 2 (empty) applied on it
 * and pending, with block 3 parsed: what the worker holds when block 2's settle sends block 3's apply ahead.
 */
export async function atBlockTwo(host: LedgerHost, made: Chain, read: NodeReader): Promise<void> {
  const loaded = await host.load({ ledger: "v9", ...at(1n), stateKey: made.one.stateKey }, read);
  if (hex(loaded.stateRoot) !== hex(made.one.stateRoot)) throw new Error("the state loaded after block 1 has another root than the chain's");
  await host.apply(applyBlock(2n, 0), read);
  await host.parse("v9", at(3n), [...made.three]);
}

/**
 * Block 3 applied at its turn, through a read that sees block 1, in a thread of its own: what every other apply of it
 * must give. Made once.
 */
export const serialThree = (made: Chain): Promise<AppliedState> => (serialMade ??= applySerialThree(made));
let serialMade: Promise<AppliedState> | undefined;

async function applySerialThree(made: Chain): Promise<AppliedState> {
  const host = started();
  const read = mapReader([...made.zero.nodes, ...made.one.nodes], 1n);
  await atBlockTwo(host, made, read);
  if (!(await host.commit(at(2n)))) throw new Error("block 2 was not pending in the serial thread");
  const three = await host.apply(applyBlock(3n, 2), read);
  const outcomes = three.output.results.map((result) => result.outcome);
  if (outcomes.join() !== "success,success") throw new Error(`block 3 applied at its turn gave ${outcomes.join()}, not two successes`);
  return three;
}
