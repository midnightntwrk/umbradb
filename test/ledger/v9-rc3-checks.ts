import { readFileSync } from "node:fs";
import type { ApplyInput, ChainOutcome, LedgerPackage, StateHandle, StoredNode } from "../../src/ledger/types.js";
import { fromHex, hex } from "./adapter-fixtures.js";
import { runInFreshInstance } from "./fresh-instance.js";

// Task 12.2a of `openspec/changes/core-arch` (A159, A99; LG-3, LG-5; owner decision Q139 A): the clauses the tests of
// ledger v9 as runtime 2.0 built it (`ledger-v9-rc3.test.ts`) run against the real packages and its committed negative
// controls (`ledger-v9-rc3.negative-control.test.ts`) run against the wrong ones. The oracle is stagenet's node: its
// genesis state and the roots it reported after blocks 0 to 3, and blocks 1 to 3 as `core-ledger-state` hands them to
// the ledger worker, each with one `CNightGeneratesDustUpdate` system transaction (DUST generation, whose rules
// ledger-9.1.0.0-rc.3 → rc.5 changed: task 0.2, question Q139), all extracted from task 0.3's tape stagenet-0-10000
// (`fixtures/stagenet/blocks.json`). Each check returns a line per problem, none when it holds.

interface StagenetBlockJson {
  height: number;
  hash: string;
  parentHash: string;
  timestampMs: string;
  parentTimestampMs: string;
  firstRegularAtParentTime: boolean;
  outcomes: ChainOutcome[];
  transactions: string[];
}

interface StagenetFixtureJson {
  specVersion: number;
  genesis: { hash: string; file: string };
  nodeRoots: { height: number; hash: string; stateRoot: string }[];
  blocks: StagenetBlockJson[];
}

const FIXTURES = new URL("./fixtures/stagenet/", import.meta.url);
const FIXTURE = JSON.parse(readFileSync(new URL("blocks.json", FIXTURES), "utf8")) as StagenetFixtureJson;
const bytes = (text: string): Uint8Array => fromHex(text.replace(/^0x/, ""));

/** Stagenet from genesis, as its node gave it (see the header). */
export const STAGENET = Object.freeze({
  /** The `MNSV` version of every block: runtime 2.0. */
  specVersion: FIXTURE.specVersion,
  genesisState: Uint8Array.from(readFileSync(new URL(FIXTURE.genesis.file, FIXTURES))),
  /** The node's `midnight_ledgerStateRoot` after each block, hex, by height. */
  nodeRoots: new Map(FIXTURE.nodeRoots.map((root) => [BigInt(root.height), root.stateRoot])),
  /** Blocks 1 to 3, as the ledger worker applies them. */
  blocks: FIXTURE.blocks.map(
    (block): ApplyInput => ({
      transactions: block.transactions.map(bytes),
      outcomes: block.outcomes,
      height: BigInt(block.height),
      hash: bytes(block.hash),
      parentHash: bytes(block.parentHash),
      timestampMs: BigInt(block.timestampMs),
      parentTimestampMs: BigInt(block.parentTimestampMs),
      firstRegularAtParentTime: block.firstRegularAtParentTime,
    }),
  ),
});

/** The state after stagenet's last fixture block as `adapter` replays it from genesis, with what differs from the node. */
export interface StagenetReplay {
  /** A line for each height whose root is not the node's. */
  readonly problems: string[];
  /** The state after the last block (the caller disposes it). */
  readonly state: StateHandle;
  readonly height: bigint;
}

/**
 * A99 at the adapter: stagenet's genesis state (block 0's, whose root is the node's) and blocks 1 to 3 applied with
 * `adapter`, each root held to the node's.
 */
export function stagenetReplay(adapter: LedgerPackage): StagenetReplay {
  const problems: string[] = [];
  const check = (height: bigint, state: StateHandle): void => {
    const root = hex(adapter.stateRoot(state));
    if (root !== STAGENET.nodeRoots.get(height)) {
      problems.push(`${adapter.ledger}: the root after block ${height} is ${root}, the node's ${STAGENET.nodeRoots.get(height)}`);
    }
  };
  let state = adapter.genesisState(STAGENET.genesisState);
  check(0n, state);
  for (const block of STAGENET.blocks) {
    for (const [index, transaction] of block.transactions.entries()) adapter.parseTransaction(transaction, index);
    const { state: after } = adapter.apply(state, block);
    adapter.dispose(state);
    state = after;
    check(block.height, state);
  }
  return { problems, state, height: STAGENET.blocks.at(-1)!.height };
}

/** Every node each adapter flushed so far, by its ledger: the database it would have written (a package flushes a node once). */
const flushed = new Map<string, Map<string, StoredNode>>();

/** `adapter`'s flushed nodes, this flush's added. */
function flushInto(adapter: LedgerPackage): StoredNode[] {
  const store = flushed.get(adapter.ledger) ?? new Map<string, StoredNode>();
  flushed.set(adapter.ledger, store);
  for (const node of adapter.flush().inserts) store.set(hex(node.key), node);
  return [...store.values()];
}

/**
 * A159: the state `from` holds after stagenet's block 3 — persisted and flushed, the nodes a database holds — loaded by
 * its key in a fresh instance of the package at `packagePath` (a worker of its own, which holds nothing of this
 * thread's), has the state's own root, the node's, and the same serialization: a 2.0 → 2.1 upgrade, whose first rc.5
 * block applies on the state rc.3 stored, carries it.
 */
export async function carriedLoadProblems(from: LedgerPackage, packagePath: string): Promise<string[]> {
  const replay = stagenetReplay(from);
  const problems = [...replay.problems];
  const root = hex(from.stateRoot(replay.state));
  // A state handle is the package's own `LedgerState`, whose `serialize` is the ledger's tagged serialization.
  const serialized = hex((replay.state as unknown as { serialize(): Uint8Array }).serialize());
  const key = from.stateKey(replay.state);
  from.persist(key);
  const nodes = flushInto(from);
  from.release(key);
  flushInto(from);
  from.dispose(replay.state);
  const loaded = await runInFreshInstance({ packagePath, op: "load", key, nodes });
  if (loaded.error !== undefined) return [...problems, `the ${from.ledger} state at ${replay.height} does not load: ${loaded.error}`];
  if (hex(loaded.stateRoot!) !== root) problems.push(`the loaded state's root is ${hex(loaded.stateRoot!)}, the stored state's ${root}`);
  if (hex(loaded.stateRoot!) !== STAGENET.nodeRoots.get(replay.height)) problems.push(`the loaded state's root is not the node's at ${replay.height}`);
  if (hex(loaded.serialized!) !== serialized) problems.push("the loaded state serializes otherwise than the stored one");
  return problems;
}
