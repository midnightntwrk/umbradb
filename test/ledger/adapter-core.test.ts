import { describe, expect, it } from "vitest";
import * as v8 from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import {
  addCosts,
  COST_MAX,
  createLedgerAdapter,
  eventKindOf,
  fieldBytes,
  ledgerEventOf,
  networkIdOf,
  type RawEvent,
  type RawLedgerPackage,
  type RawState,
  type RawTransaction,
  type RawTransactionResult,
  type SyntheticCost,
  vmLogOf,
} from "../../src/ledger/adapter.js";
import type { ApplyInput, LedgerPackage } from "../../src/ledger/types.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import { LEDGER_RELEASES } from "../../src/ledger/releases.js";
import { block, contractFixture, hex, NETWORK_ID, RAW } from "./adapter-fixtures.js";

// Task 12.1 of `openspec/changes/core-arch` (LG-8, LG-15, LG-16, CC-2): the shared implementation of the adapters
// (`src/ledger/adapter.ts`) on inputs the fixture blocks cannot give it — events shaped as the packages' declarations
// give them (`vendor/ledger/<version>/pkg/ledger-v*.d.ts`, `EventDetails`) for the kinds no fixture block emits without
// a wallet (zswap inputs, DUST events, parameter changes); a package that records what `apply` hands it (the block
// context, the strictness, the times, the fullness the post-block update gets, the parameters a system transaction's
// cost is taken with, what a transaction the chain reports failed is spared — task 12.1a), which a real package does
// not show; and a cost the package cannot compute.

const SOURCE = { logicalSegment: 1, physicalSegment: 2 };
const SERIALIZED = Uint8Array.of(0x6d, 0x69);
const UNSUPPORTED = "notYetSupportedEventType";

function event(content: Record<string, unknown> & { tag: string }, debug = ""): RawEvent {
  return { source: SOURCE, content, serialize: () => SERIALIZED, toString: () => debug };
}

const A = "ab".repeat(32);
const C = "cd".repeat(32);
const bytesOf = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));
const NONE = { nullifier: null, commitment: null, treeIndex: null, contractAddress: null };

describe("fieldBytes: a field element as the ledger serializes it", () => {
  it("is 32 bytes, little-endian", () => {
    expect(hex(fieldBytes(0n))).toBe("00".repeat(32));
    expect(hex(fieldBytes(0x0102n))).toBe(`0201${"00".repeat(30)}`);
    expect(hex(fieldBytes(2n ** 256n - 1n))).toBe("ff".repeat(32));
  });

  it("refuses what is not one", () => {
    expect(() => fieldBytes(2n ** 256n)).toThrow(RangeError);
    expect(() => fieldBytes(-1n)).toThrow(RangeError);
  });
});

describe("eventKindOf: an event's kind (LG-16)", () => {
  it("reads the kinds the packages describe from their tag", () => {
    const tags = {
      zswapInput: "zswap-input",
      zswapOutput: "zswap-output",
      contractLog: "contract-log",
      dustInitialUtxo: "dust-initial-utxo",
      dustGenerationDtimeUpdate: "dust-generation-dtime-update",
      dustSpendProcessed: "dust-spend-processed",
    };
    for (const [tag, kind] of Object.entries(tags)) expect(eventKindOf(event({ tag }))).toBe(kind);
  });

  it("reads the others from the variant their Debug rendering names", () => {
    const variants = {
      ZswapInput: "zswap-input",
      ZswapOutput: "zswap-output",
      ContractDeploy: "contract-deploy",
      ContractLog: "contract-log",
      ParamChange: "param-change",
      DustInitialUtxo: "dust-initial-utxo",
      DustGenerationDtimeUpdate: "dust-generation-dtime-update",
      DustSpendProcessed: "dust-spend-processed",
    };
    for (const [variant, kind] of Object.entries(variants)) {
      expect(eventKindOf(event({ tag: UNSUPPORTED }, `Event { source: …, content: ${variant} {`))).toBe(kind);
    }
  });

  it("refuses a kind it does not know, naming it", () => {
    const mystery = event({ tag: UNSUPPORTED }, "Event { content: Mystery { x: 1 } }");
    expect(() => eventKindOf(mystery)).toThrow(/does not know: Mystery/);
    expect(() => eventKindOf(event({ tag: "somethingNew" }))).toThrow(/does not know: somethingNew/);
  });
});

describe("ledgerEventOf: LG-16's extracted fields", () => {
  it("takes a zswap input's nullifier and contract", () => {
    expect(ledgerEventOf(event({ tag: "zswapInput", nullifier: A, contract: C }), "zswap-input", 4)).toEqual({
      transaction: 4,
      kind: "zswap-input",
      ...SOURCE,
      bytes: SERIALIZED,
      ...NONE,
      nullifier: bytesOf(A),
      contractAddress: bytesOf(C),
    });
    const ownerless = event({ tag: "zswapInput", nullifier: A, contract: undefined });
    expect(ledgerEventOf(ownerless, "zswap-input", 0).contractAddress).toBeNull();
  });

  it("takes a zswap output's commitment, tree index and contract", () => {
    const created = event({ tag: "zswapOutput", commitment: C, contract: A, mtIndex: 5n });
    expect(ledgerEventOf(created, "zswap-output", 1)).toMatchObject({
      commitment: bytesOf(C),
      treeIndex: 5n,
      contractAddress: bytesOf(A),
      nullifier: null,
    });
  });

  it("takes the DUST events' indexes, nullifier and commitment", () => {
    const initial = ledgerEventOf(event({ tag: "dustInitialUtxo", generationIndex: 3n }), "dust-initial-utxo", 0);
    expect(initial).toMatchObject({ ...NONE, treeIndex: 3n });
    const spent = event({ tag: "dustSpendProcessed", nullifier: 7n, commitment: 9n, commitmentIndex: 4n });
    expect(ledgerEventOf(spent, "dust-spend-processed", 0)).toMatchObject({
      nullifier: fieldBytes(7n),
      commitment: fieldBytes(9n),
      treeIndex: 4n,
      contractAddress: null,
    });
    const update = event({ tag: "dustGenerationDtimeUpdate" });
    expect(ledgerEventOf(update, "dust-generation-dtime-update", 0)).toMatchObject(NONE);
    expect(ledgerEventOf(event({ tag: UNSUPPORTED }), "param-change", 0)).toMatchObject(NONE);
  });

  it("takes a deploy's address from its Debug rendering, and refuses one without", () => {
    const debug = `Event { source: … }, content: ContractDeploy { address: ContractAddress(${C}), initial_state: … } }`;
    expect(ledgerEventOf(event({ tag: UNSUPPORTED }, debug), "contract-deploy", 0).contractAddress).toEqual(bytesOf(C));
    const bare = event({ tag: UNSUPPORTED }, "content: ContractDeploy {");
    expect(() => ledgerEventOf(bare, "contract-deploy", 0)).toThrow(/without its address/);
  });
});

describe("vmLogOf: a contract log (CC-2)", () => {
  const log = (eventType: string, entryPoint: Uint8Array | string): RawEvent =>
    event({ tag: "contractLog", address: A, entryPoint, loggedItem: { version: 2, eventType, data: "the value" } });
  const serialize = (data: unknown): Uint8Array => Uint8Array.from(Buffer.from(String(data)));

  it("names the event type as the ledger does and serializes the value", () => {
    expect(vmLogOf(log("shielded-mint", "emit"), 3, 7, serialize)).toEqual({
      version: 2,
      eventType: "ShieldedMint",
      data: serialize("the value"),
      transaction: 3,
      index: 7,
      address: bytesOf(A),
      entryPoint: Uint8Array.from(Buffer.from("emit")),
      ...SOURCE,
    });
    expect(vmLogOf(log("paused", Uint8Array.of(0xff)), 0, 0, serialize).entryPoint).toEqual(Uint8Array.of(0xff));
  });

  it("refuses an event type it does not know", () => {
    expect(() => vmLogOf(log("fireworks", "emit"), 0, 0, serialize)).toThrow(/does not know: fireworks/);
  });
});

describe("apply: a transaction whose cost the package cannot compute (LG-8)", () => {
  it("is a failure that leaves the state as it was, as the node's failed extrinsic does", {
    timeout: 120_000,
  }, async () => {
    const real = RAW.v8 as unknown as RawLedgerPackage;
    const costless: RawLedgerPackage = {
      ...(v8 as unknown as RawLedgerPackage),
      Transaction: {
        deserialize(...args) {
          const transaction = real.Transaction.deserialize(...args);
          const wrapped: RawTransaction = {
            wellFormed: (state, strictness, tblock) => transaction.wellFormed(state, strictness, tblock),
            cost: () => {
              throw new Error("outside the time to dismiss");
            },
            serialize: () => transaction.serialize(),
            intents: transaction.intents,
            fallibleOffer: transaction.fallibleOffer,
          };
          return wrapped;
        },
      },
    };
    const adapter = createLedgerAdapter({
      ledger: "v8",
      release: LEDGER_RELEASES.v8,
      raw: costless,
      networkId: NETWORK_ID,
      decodeLogItem: () => null,
      loggedValue: null,
    });
    const contract = await contractFixture(RAW.v8);
    const { state, output } = adapter.apply(adapter.emptyState(), block([contract.deploy]));
    expect(output.results).toEqual([
      { outcome: "failure", segments: [0, 1].map((segment) => ({ segment, success: false })) },
    ]);
    const empty = adapter.apply(adapter.emptyState(), block([])).state;
    expect(hex(adapter.stateRoot(state))).toBe(hex(adapter.stateRoot(empty)));
  });
});

describe("loadLedgerPackage", () => {
  it("refuses a ledger version this build carries no adapter for", async () => {
    await expect(loadLedgerPackage("v10", { networkId: NETWORK_ID })).rejects.toThrow(/no ledger v10 adapter/);
  });
});

// A package that records what `apply` hands it. A transaction's bytes are a regular transaction's tag followed by its
// number in `TRANSACTIONS`; a system transaction's, the system tag followed by any byte.

const REGULAR_TAG = "midnight:transaction[v9](signature[v1],proof,pedersen-schnorr[v1]):";
const SYSTEM_TAG = "midnight:system-transaction[v6]:";
const ZERO: SyntheticCost = { readTime: 0n, computeTime: 0n, blockUsage: 0n, bytesWritten: 0n, bytesChurned: 0n };

interface FakeTransaction {
  /** The times it is malformed at (ms); any other is well formed. */
  malformedAt?: number[];
  result?: RawTransactionResult;
  cost?: SyntheticCost;
  intents?: number[];
  fallibleOffer?: number[];
}

interface Recorded {
  wellFormed: { state: string; time: number; strictness: Record<string, boolean> }[];
  contexts: unknown[];
  applied: string[];
  costs: string[];
  system: number[];
  systemCosts: string[];
  post: { state: string; time: number; fullness: SyntheticCost } | null;
}

const regular = (n: number): Uint8Array => Uint8Array.from([...Buffer.from(REGULAR_TAG, "latin1"), n]);
const system = (): Uint8Array => Uint8Array.from([...Buffer.from(SYSTEM_TAG, "latin1"), 0]);
const result = (
  type: RawTransactionResult["type"],
  successfulSegments?: Map<number, boolean>,
): RawTransactionResult => Object.assign({ type, successfulSegments, events: [] }, { free() {} });

/** A package whose transactions are `transactions` and whose system transactions cost `systemCost`. */
function fakePackage(
  transactions: FakeTransaction[],
  systemCost: SyntheticCost = ZERO,
): { adapter: LedgerPackage; recorded: Recorded } {
  const recorded: Recorded = {
    wellFormed: [],
    contexts: [],
    applied: [],
    costs: [],
    system: [],
    systemCosts: [],
    post: null,
  };
  let made = 0;
  class State implements RawState {
    constructor(readonly name: string) {}
    get parameters() {
      return { of: this.name, serialize: () => Uint8Array.of(7), free() {} };
    }
    get zswap() {
      return { firstFree: 0n, free() {} };
    }
    apply(verified: object, context: object): [RawState, RawTransactionResult] {
      const { name, outcome } = verified as { name: string; outcome: RawTransactionResult };
      const { state, block } = context as { state: State; block: unknown };
      recorded.contexts.push({ state: state.name, block });
      recorded.applied.push(name);
      return [new State(`after ${name} (${made++})`), outcome];
    }
    applySystemTx(_transaction: object, tblock: Date): [RawState, RawEvent[]] {
      recorded.system.push(tblock.getTime());
      return [new State(`after system (${made++})`), []];
    }
    free() {}
  }
  class Strictness {
    enforceBalancing = true;
    verifyNativeProofs = true;
    verifyContractProofs = true;
    verifySignatures = true;
    enforceLimits = true;
    free() {}
  }
  const raw = {
    LedgerState: {
      blank: (networkId: string) => new State(`blank ${networkId}`),
      deserialize: () => new State("genesis"),
    },
    Transaction: {
      deserialize(_s: string, _p: string, _b: string, bytes: Uint8Array): RawTransaction {
        const n = bytes[bytes.length - 1]!;
        const spec = transactions[n]!;
        const keys = (segments: number[] | undefined) =>
          segments === undefined ? undefined : new Map(segments.map((segment) => [segment, { actions: [] }]));
        return {
          wellFormed(state: RawState, strictness: object, tblock: Date) {
            const flags = { ...(strictness as Strictness) } as unknown as Record<string, boolean>;
            recorded.wellFormed.push({ state: (state as State).name, time: tblock.getTime(), strictness: flags });
            if (spec.malformedAt?.includes(tblock.getTime())) throw new Error("malformed");
            return { name: `tx ${n}`, outcome: spec.result ?? result("success"), free() {} };
          },
          cost: (params) => {
            recorded.costs.push(`tx ${n} with ${(params as unknown as { of: string }).of}`);
            return spec.cost ?? ZERO;
          },
          serialize: () => bytes,
          intents: keys(spec.intents ?? [1]),
          fallibleOffer: keys(spec.fallibleOffer),
        };
      },
    },
    SystemTransaction: { deserialize: () => ({ serialize: () => system() }) },
    TransactionContext: class {
      constructor(
        readonly state: unknown,
        readonly block: unknown,
      ) {}
      free() {}
    },
    WellFormedStrictness: Strictness,
    ContractCall: class {},
    ContractDeploy: class {},
    systemTransactionCost(_transaction: unknown, params: { of: string }) {
      recorded.systemCosts.push(params.of);
      return systemCost;
    },
    postBlockUpdateExact(state: State, tblock: Date, fullness: SyntheticCost) {
      recorded.post = { state: state.name, time: tblock.getTime(), fullness };
      return new State("after the block");
    },
  } as unknown as RawLedgerPackage;
  const adapter = createLedgerAdapter({
    ledger: "v9",
    release: LEDGER_RELEASES.v9,
    raw,
    networkId: NETWORK_ID,
    decodeLogItem: () => null,
    loggedValue: null,
  });
  return { adapter, recorded };
}

const T = 1_750_000_000_000;
const input = (transactions: Uint8Array[], options: Partial<ApplyInput> = {}): ApplyInput => ({
  transactions,
  height: 9n,
  hash: new Uint8Array(32).fill(0xaa),
  parentHash: new Uint8Array(32).fill(0xbb),
  timestampMs: BigInt(T),
  parentTimestampMs: BigInt(T - 6_000),
  firstRegularAtParentTime: false,
  ...options,
});
const cost = (n: bigint): SyntheticCost => ({
  readTime: n,
  computeTime: 2n * n,
  blockUsage: 3n * n,
  bytesWritten: 4n * n,
  bytesChurned: 5n * n,
});

describe("apply, on a package that records what it is handed (LG-8, LG-15)", () => {
  it("gives the ledger the block's context, the current state, a strictness without proof checks or balancing", () => {
    const { adapter, recorded } = fakePackage([{}, {}]);
    adapter.apply(adapter.emptyState(), input([regular(0), regular(1)]));
    const block = {
      secondsSinceEpoch: BigInt(T / 1000),
      secondsSinceEpochErr: 30,
      parentBlockHash: "bb".repeat(32),
      lastBlockTime: BigInt((T - 6_000) / 1000),
    };
    expect(recorded.contexts).toEqual([
      { state: `blank ${NETWORK_ID}`, block },
      { state: "after tx 0 (0)", block },
    ]);
    expect(recorded.wellFormed.map((check) => [check.state, check.time])).toEqual([
      [`blank ${NETWORK_ID}`, T],
      ["after tx 0 (0)", T],
    ]);
    expect(recorded.wellFormed[0]!.strictness).toEqual({
      enforceBalancing: false,
      verifyNativeProofs: false,
      verifyContractProofs: false,
      verifySignatures: true,
      enforceLimits: true,
    });
  });

  it("applies a system transaction at the block time", () => {
    const { adapter, recorded } = fakePackage([]);
    const { output } = adapter.apply(adapter.emptyState(), input([system()]));
    expect(recorded.system).toEqual([T]);
    expect(output.results).toEqual([{ outcome: "success", segments: [] }]);
    expect(recorded.post!.state).toBe("after system (0)");
  });

  it("sums the costs of the transactions that applied, exactly; the post-block update gets the sum at the block time", () => {
    const { adapter, recorded } = fakePackage([
      { cost: cost(1n) },
      { cost: cost(10n) },
      { cost: cost(100n), result: result("failure") },
      { cost: cost(7n), malformedAt: [T] },
    ]);
    const transactions = [regular(0), regular(1), regular(2), regular(3)];
    const { state } = adapter.apply(adapter.emptyState(), input(transactions));
    expect(recorded.post).toEqual({ state: "after tx 1 (1)", time: T, fullness: cost(11n) });
    expect((state as unknown as { name: string }).name).toBe("after the block");
  });

  it("adds a system transaction's cost, taken with the parameters of the state before it (task 12.1a)", () => {
    const { adapter, recorded } = fakePackage([{ cost: cost(1n) }, { cost: cost(10n) }], cost(1_000n));
    adapter.apply(adapter.emptyState(), input([regular(0), system(), regular(1)]));
    expect(recorded.systemCosts).toEqual(["after tx 0 (0)"]);
    expect(recorded.costs).toEqual([`tx 0 with blank ${NETWORK_ID}`, "tx 1 with after system (1)"]);
    expect(recorded.post).toEqual({ state: "after tx 1 (2)", time: T, fullness: cost(1_011n) });
  });

  it("adds the costs as the ledger does, each dimension saturating at 2^64 - 1 (task 12.1a)", () => {
    // `u64::MAX`, written out: the largest cost the package's `SyntheticCost` takes.
    const U64_MAX = 18_446_744_073_709_551_615n;
    expect(COST_MAX).toBe(U64_MAX);
    const near = { ...cost(1n), readTime: U64_MAX - 1n, bytesChurned: U64_MAX };
    const { adapter, recorded } = fakePackage([{ cost: near }, { cost: cost(2n) }]);
    adapter.apply(adapter.emptyState(), input([regular(0), regular(1)]));
    expect(recorded.post!.fullness).toEqual({ ...cost(3n), readTime: U64_MAX, bytesChurned: U64_MAX });
    expect(addCosts({ ...ZERO, blockUsage: U64_MAX - 1n }, { ...ZERO, blockUsage: 1n }).blockUsage).toBe(U64_MAX);
    expect(addCosts({ ...ZERO, blockUsage: 2n ** 63n }, { ...ZERO, blockUsage: 2n ** 63n - 2n }).blockUsage).toBe(
      U64_MAX - 1n,
    );
  });

  it("gives a block that applied nothing a zero fullness", () => {
    const { adapter, recorded } = fakePackage([{ malformedAt: [T] }]);
    adapter.apply(adapter.emptyState(), input([regular(0)]));
    expect(recorded.post).toEqual({ state: `blank ${NETWORK_ID}`, time: T, fullness: ZERO });
  });

  it("does not ask the ledger about a transaction the chain reports failed, nor count its cost (task 12.1a)", () => {
    const { adapter, recorded } = fakePackage(
      [{ cost: cost(1n), intents: [1, 2] }, { cost: cost(10n) }, { cost: cost(100n) }],
      cost(1_000n),
    );
    const { output } = adapter.apply(
      adapter.emptyState(),
      input([regular(0), system(), regular(1), regular(2)], {
        outcomes: ["failure", "failure", "partial", "success"],
      }),
    );
    expect(output.results).toEqual([
      { outcome: "failure", segments: [0, 1, 2].map((segment) => ({ segment, success: false })) },
      { outcome: "failure", segments: [] },
      { outcome: "success", segments: [0, 1].map((segment) => ({ segment, success: true })) },
      { outcome: "success", segments: [0, 1].map((segment) => ({ segment, success: true })) },
    ]);
    expect(recorded.wellFormed.map((check) => check.state)).toEqual([`blank ${NETWORK_ID}`, "after tx 1 (0)"]);
    expect(recorded.costs).toEqual([`tx 1 with blank ${NETWORK_ID}`, "tx 2 with after tx 1 (0)"]);
    expect(recorded.applied).toEqual(["tx 1", "tx 2"]);
    expect([recorded.system, recorded.systemCosts]).toEqual([[], []]);
    expect(recorded.post).toEqual({ state: "after tx 2 (1)", time: T, fullness: cost(110n) });
  });

  it("keeps the parent's time for the first regular transaction after one the chain reports failed (task 12.1a)", () => {
    const { adapter, recorded } = fakePackage([{}, { malformedAt: [T] }]);
    const skewed = input([regular(0), regular(1)], { firstRegularAtParentTime: true, outcomes: ["failure", "success"] });
    const { output } = adapter.apply(adapter.emptyState(), skewed);
    expect(recorded.wellFormed.map((check) => check.time - T)).toEqual([0, 6_000]);
    expect(output.results.map((r) => r.outcome)).toEqual(["failure", "success"]);
  });

  it("refuses chain outcomes that are not one per transaction (task 12.1a)", () => {
    const { adapter, recorded } = fakePackage([{}]);
    expect(() => adapter.apply(adapter.emptyState(), input([regular(0)], { outcomes: [] }))).toThrow(
      new RangeError("block 9: 0 chain outcomes for 1 transactions"),
    );
    expect(() =>
      adapter.apply(adapter.emptyState(), input([regular(0)], { outcomes: ["success", "failure"] })),
    ).toThrow(RangeError);
    expect([recorded.wellFormed, recorded.post]).toEqual([[], null]);
  });

  it("gives a partial success's segments in segment order, the package's failed flags inverted", () => {
    const partial = result("partialSuccess", new Map([[2, true], [0, false], [1, false]]));
    const { adapter } = fakePackage([{ intents: [1, 2], result: partial }]);
    const { output } = adapter.apply(adapter.emptyState(), input([regular(0)]));
    expect(output.results).toEqual([
      {
        outcome: "partial",
        segments: [
          { segment: 0, success: true },
          { segment: 1, success: true },
          { segment: 2, success: false },
        ],
      },
    ]);
  });

  it("counts a fallible offer's segments among a transaction's, in segment order, segment 0 once", () => {
    const { adapter } = fakePackage([
      { intents: [2], fallibleOffer: [0, 3, 1] },
      { intents: [4, 2], malformedAt: [T] },
    ]);
    const { output } = adapter.apply(adapter.emptyState(), input([regular(0), regular(1)]));
    expect(output.results).toEqual([
      { outcome: "success", segments: [0, 1, 2, 3].map((segment) => ({ segment, success: true })) },
      { outcome: "failure", segments: [0, 2, 4].map((segment) => ({ segment, success: false })) },
    ]);
  });

  it("parses a transaction's intents in segment order, whatever order the package gives them in", () => {
    const { adapter } = fakePackage([{ intents: [3, 1, 2] }]);
    expect(adapter.parseTransaction(regular(0), 0).segments.map((segment) => segment.segment)).toEqual([1, 2, 3]);
  });

  it("checks a malformed first regular transaction again at the parent's time + 12 s where it is skewed", () => {
    const { adapter, recorded } = fakePackage([{ malformedAt: [T] }, { malformedAt: [T] }]);
    const skewed = input([regular(0), regular(1)], { firstRegularAtParentTime: true });
    const { output } = adapter.apply(adapter.emptyState(), skewed);
    expect(recorded.wellFormed.map((check) => check.time - T)).toEqual([0, 6_000, 0]);
    expect(output.results.map((r) => r.outcome)).toEqual(["success", "failure"]);
  });
});

describe("networkIdOf and the state's summary (task 12.3; IN-7, LG-16)", () => {
  it("reads a state's network id from its rendering, escapes included, and refuses a rendering without one", () => {
    expect(networkIdOf({ toString: () => 'LedgerState { network_id: "mainnet", parameters: … }' })).toBe("mainnet");
    expect(networkIdOf({ toString: () => 'LedgerState { network_id: "a\\"b\\\\c", parameters: … }' })).toBe('a"b\\c');
    expect(() => networkIdOf({ toString: () => "LedgerState { parameters: … }" })).toThrow(/names no network id/);
    expect(() => networkIdOf({ toString: () => 'ZswapState { network_id: "x" }' })).toThrow(/names no network id/);
  });

  it("gives the real states' network ids, an empty state of another network, the zswap first free index, and frees", async () => {
    const adapter = await loadLedgerPackage("v9", { networkId: NETWORK_ID });
    const preview = adapter.emptyState("preview");
    expect(adapter.networkIdOf(preview)).toBe("preview");
    expect(adapter.networkIdOf(adapter.emptyState())).toBe(NETWORK_ID);
    expect(adapter.stateSummary(preview)).toEqual({
      zswapFirstFree: 0n,
      zswapRoot: null,
      dustCommitmentFirstFree: null,
      dustCommitmentRoot: null,
      dustGenerationFirstFree: null,
      dustGenerationRoot: null,
    });
    adapter.dispose(preview);
    expect(() => adapter.stateRoot(preview)).toThrow();
  });
});
