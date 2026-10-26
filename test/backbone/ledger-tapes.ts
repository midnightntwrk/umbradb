import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import type { ApplyInput, ApplyOutput, ChainOutcome, StateHandle } from "../../src/ledger/types.js";
import type { TapeRecord } from "../../tools/tape/index.js";
import { RAW, referenceReplay } from "../ledger/adapter-fixtures.js";
import { E, type EventSpec, type TransactionSpec, transactionSpec } from "./chain-data-tapes.js";
import { type EventsRuntime, eventsRuntime, eventsValue, finalizedWithEvents, remarkExtrinsic, RUNTIME_2_0, systemExtrinsic, V2_0 } from "./events-fixtures.js";
import { type ChainBlock, chainOf, compact, hex, ledgerTransaction, opening } from "./fetch-fixtures.js";

/**
 * The synthetic tapes of task 12.3's process tests (`ledger-state.test.ts` and its negative controls; A82, A99, A106,
 * A107; IN-7, LG-8, LG-15, LG-16), from genesis, in the node's answer shapes (`./fetch-fixtures.ts`,
 * `./events-fixtures.ts`): each block's real ledger transactions (`test/ledger/adapter-fixtures.ts`) with the chain events
 * that place them and give their outcomes (CD-5, CD-6), `system_properties` with the genesis state (IN-7) and
 * `midnight_ledgerStateRoot` at every block — the root the reference replay of task 12.1 reaches (the packages' own
 * API, never the adapters), or the node's own recorded root for the real genesis states of task 0.2.
 *
 * Each height also carries what the test's own adapter (in this thread) gives for it — the rows LG-16 stores are the
 * adapter's output, so `core_ledger_state` is held to it — and the reference replay's result types and event names, an
 * independent account of the same block.
 */

/** A transaction of a block, with the outcome the chain's events give it (`success` unless given). */
export interface LedgerTx {
  readonly bytes: Uint8Array;
  readonly kind: "regular" | "system";
  readonly outcome?: ChainOutcome;
}

/** What a scenario is made of. */
export interface LedgerScenarioOptions {
  readonly ledger: "v8" | "v9";
  /** The runtime that builds every block (its `spec_version` selects the ledger through preprod's table). */
  readonly runtime?: EventsRuntime;
  /** `system_properties.genesis_state`. */
  readonly genesis: Uint8Array;
  /** IN-7's case: the genesis state already holds block 0's transactions (the node's root at 0 is the genesis's). */
  readonly includesBlockZero: boolean;
  /** Each block's transactions, from block 0, in their application order. */
  readonly blocks: readonly (readonly LedgerTx[])[];
}

/** One height of a scenario, as the node and the oracles see it. */
export interface LedgerHeight {
  readonly height: bigint;
  /** The node's `midnight_ledgerStateRoot` after the block (the tape's answer). */
  readonly root: Uint8Array;
  readonly stateKey: Uint8Array;
  readonly zswapFirstFree: bigint;
  /** The test's adapter's output for the block (block 0: on the state IN-7's case gives). */
  readonly output: ApplyOutput;
  /** The reference replay's result type of each transaction (`success`, `partialSuccess`, `system`, `malformed`, …). */
  readonly types: readonly string[];
  /** The reference replay's event names of each transaction. */
  readonly events: readonly (readonly string[])[];
}

/** A tape from genesis and what the database must hold after it. */
export interface LedgerScenario {
  readonly records: TapeRecord[];
  readonly start: 0n;
  readonly head: bigint;
  readonly chain: readonly ChainBlock[];
  readonly heights: readonly LedgerHeight[];
  readonly transactions: readonly TransactionSpec[];
  readonly ledger: "v8" | "v9";
  readonly networkId: string;
}

/** The runtime of the v8 scenarios: 1_000_000 (v8 through preprod's table), runtime 2.0's event layout. */
export const RUNTIME_1_0 = eventsRuntime(1_000_000, V2_0);

/**
 * `DistributeReserve(amount)` of `ledger` (task 12.1's system-transaction fixture with another amount, so that two
 * blocks of one scenario do not hold the same bytes): the variant 5, then the amount as a SCALE compact integer.
 */
export function distributeReserve(ledger: "v8" | "v9", amount: bigint): Uint8Array {
  const tag = ledger === "v8" ? "system-transaction[v6]" : "system-transaction[v9]";
  return Uint8Array.from([...Buffer.from(`midnight:${tag}:`, "latin1"), 5, ...compact(amount)]);
}

/** LG-8's skewing runtimes, written out (the official indexer's ranges), for the reference replay's input. */
const skews = (specVersion: number): boolean =>
  (specVersion >= 22_000 && specVersion < 23_000) ||
  (specVersion >= 1_000_000 && specVersion < 1_000_300) ||
  (specVersion >= 2_000_000 && specVersion < 2_001_000);

/** A genesis state's network id, as its own `Debug` rendering names it (`LedgerState { network_id: "…", …`). */
export function genesisNetworkId(ledger: "v8" | "v9", genesis: Uint8Array): string {
  const state = RAW[ledger].LedgerState.deserialize(genesis);
  const id = /^LedgerState \{ network_id: "([^"]*)"/.exec(state.toString(true))?.[1];
  (state as unknown as { free(): void }).free();
  if (id === undefined) throw new Error("a genesis state without its network id");
  return id;
}

/** The chain events of a block after 0 for `transactions` (each regular one its own extrinsic, from 1). */
function eventsOf(transactions: readonly LedgerTx[]): EventSpec[] {
  const events: EventSpec[] = [E.success(0)];
  transactions.forEach((transaction, index) => {
    const i = index + 1;
    if (transaction.kind === "system") events.push(E.systemApplied(i, transaction.bytes), E.success(i));
    else if (transaction.outcome === "failure") events.push(E.moduleFailed(i, 5, 3));
    else if (transaction.outcome === "partial") events.push(E.txPartial(i, transaction.bytes), E.success(i));
    else events.push(E.txApplied(i, transaction.bytes), E.success(i));
  });
  return events;
}

/** A scenario from `options` (see the module comment). */
export async function ledgerScenario(options: LedgerScenarioOptions): Promise<LedgerScenario> {
  const { ledger, genesis, blocks } = options;
  const runtime = options.runtime ?? (ledger === "v9" ? RUNTIME_2_0 : RUNTIME_1_0);
  const raw = RAW[ledger];
  const networkId = genesisNetworkId(ledger, genesis);
  const adapter = await loadLedgerPackage(ledger, { networkId });
  const chain = chainOf(BigInt(blocks.length - 1), (h) => ({
    specVersion: runtime.specVersion,
    timestampPallet: runtime.shape.timestampIndex,
    extrinsics: (blocks[Number(h)] as readonly LedgerTx[]).map((t) =>
      h === 0n ? (t.kind === "system" ? systemExtrinsic(t.bytes) : ledgerTransaction([...t.bytes])) : t.kind === "system" ? remarkExtrinsic() : ledgerTransaction([...t.bytes]),
    ),
  }));
  const head = chain.at(-1) as ChainBlock;
  const records: TapeRecord[] = [
    ...opening(chain[0] as ChainBlock, head),
    { method: "system_properties", params: [], result: { genesis_extrinsics: [], genesis_state: Buffer.from(genesis).toString("hex") } },
  ];
  const heights: LedgerHeight[] = [];
  const transactions: TransactionSpec[] = [];
  let reference: InstanceType<typeof raw.LedgerState> | undefined;
  let state: StateHandle | undefined;
  for (const block of chain) {
    const txs = blocks[Number(block.height)] as readonly LedgerTx[];
    const previous = chain[Number(block.height) - 1];
    const parentMs = previous === undefined || previous.timestampMs === 0n ? block.timestampMs : previous.timestampMs;
    const input: ApplyInput = {
      transactions: txs.map((t) => t.bytes),
      outcomes: txs.map((t) => t.outcome ?? "success"),
      height: block.height,
      hash: block.hash,
      parentHash: block.parentHash,
      timestampMs: block.timestampMs,
      parentTimestampMs: parentMs,
      firstRegularAtParentTime: block.height > 0n && skews(runtime.specVersion),
    };
    let replay: ReturnType<typeof referenceReplay>;
    let output: ApplyOutput;
    if (block.height === 0n) {
      const g = raw.LedgerState.deserialize(genesis);
      if (options.includesBlockZero) {
        replay = referenceReplay(raw, raw.LedgerState.blank(networkId), input);
        reference = g;
        output = adapter.apply(adapter.emptyState(), input).output;
        state = adapter.genesisState(genesis);
      } else {
        replay = referenceReplay(raw, g, input);
        reference = replay.state;
        const applied = adapter.apply(adapter.genesisState(genesis), input);
        output = applied.output;
        state = applied.state;
      }
    } else {
      replay = referenceReplay(raw, reference as InstanceType<typeof raw.LedgerState>, input);
      reference = replay.state;
      const applied = adapter.apply(state as StateHandle, input);
      output = applied.output;
      state = applied.state;
    }
    const root = raw.stateRoot(reference);
    if (hex(adapter.stateRoot(state as StateHandle)) !== hex(root)) {
      throw new Error(`the test's adapter and the reference replay disagree at ${block.height}: a fixture problem`);
    }
    heights.push({
      height: block.height,
      root,
      stateKey: raw.stateKey(reference),
      zswapFirstFree: reference.zswap.firstFree,
      output,
      types: replay.types,
      events: replay.events,
    });
    const value = block.height === 0n ? null : eventsValue(eventsOf(txs).map((event) => event.record));
    records.push(
      ...finalizedWithEvents(block, runtime, value, block.height === 0n),
      { method: "midnight_ledgerStateRoot", params: [block.hex], result: [...root] },
    );
    txs.forEach((t, index) => transactions.push(transactionSpec(block.height, index, t.kind, t.bytes, block.height === 0n ? "success" : (t.outcome ?? "success"))));
  }
  return { records, start: 0n, head: head.height, chain, heights, transactions, ledger, networkId };
}

/** `scenario` with the node's root at `height` replaced by `root` (a node that disagrees with the replay). */
export function withNodeRoot(scenario: LedgerScenario, height: bigint, root: Uint8Array): LedgerScenario {
  const block = scenario.chain[Number(height)] as ChainBlock;
  const records = scenario.records.map((record) =>
    "method" in record && record.method === "midnight_ledgerStateRoot" && (record.params as unknown[])[0] === block.hex
      ? { ...record, result: [...root] }
      : record,
  );
  return { ...scenario, records };
}

// ── task 0.2's genesis states, as the nodes served them ───────────────────────────────────────────────────────────────

const GENESIS = new URL("../ledger/fixtures/genesis/", import.meta.url);

/** One network's genesis state and the root its node reported for block 0 (`node-roots.json`). */
export interface RecordedGenesis {
  readonly network: string;
  readonly ledger: "v8" | "v9";
  readonly state: Uint8Array;
  readonly root: Uint8Array;
}

/** The genesis state of `file`'s network, checked against its recorded SHA-256 (`node-roots.json`). */
export function recordedGenesis(file: string): RecordedGenesis {
  const index = JSON.parse(readFileSync(new URL("node-roots.json", GENESIS), "utf8")) as {
    states: { file: string; ledger: "v8" | "v9"; network: string; stateRoot: string; sha256: string }[];
  };
  const entry = index.states.find((candidate) => candidate.file === file);
  if (entry === undefined) throw new Error(`node-roots.json lists no ${file}`);
  const state = Uint8Array.from(readFileSync(new URL(file, GENESIS)));
  if (createHash("sha256").update(state).digest("hex") !== entry.sha256) throw new Error(`${file} is not the recorded file`);
  return { network: entry.network, ledger: entry.ledger, state, root: Uint8Array.from(Buffer.from(entry.stateRoot, "hex")) };
}
