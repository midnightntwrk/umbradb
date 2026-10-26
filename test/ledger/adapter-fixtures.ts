import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as v8 from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import * as v9 from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import type { ApplyInput } from "../../src/ledger/types.js";
import { free } from "./node-format.js";

// Task 12.1 of `openspec/changes/core-arch` (A98): blocks for the adapter test suite, built with the vendored packages'
// published API — never through the adapters under test — so that no network and no node is needed.
//
// - A deploy is proven with a proving provider that returns empty proofs and then bound, as a chain transaction is
//   (`(signature, proof, pedersen-schnorr)`), so it has the ledger's own transaction hash; with proof checks off
//   (LG-15) the ledger never looks at the proofs. Its one operation, `emit`, carries the verifier key in
//   `fixtures/verifier-key/` (a deploy needs one).
// - A contract call is proof-erased (`(signature, (), pedersen)`), as `midnight-ledger`'s own integration tests apply
//   calls without a prover (`integration-tests/src/test/utils/log-contract.ts`): proving a call would need its circuit.
// - The system transaction is `DistributeReserve(1000000000000000)`: for v8 the bytes 0.9.5's replay decoder test
//   decodes (`design/full-chain-storage-design.md` §3.2's captured devnet sample), for v9 the same payload under v9's
//   tag.

export type Ledger = "v8" | "v9";

/**
 * The two packages share every constructor these fixtures use; the tests use both through v9's declarations (the
 * declared classes differ in members these fixtures do not touch).
 */
export type RawPackage = typeof v9;

export const RAW: Readonly<Record<Ledger, RawPackage>> = { v8: v8 as unknown as RawPackage, v9 };

/** The network id every fixture and adapter in these tests uses. */
export const NETWORK_ID = "undeployed";

/** The block time of the fixture blocks, in milliseconds. */
export const T0 = 1_750_000_000_000;

/** The ledger's `global_ttl` of the initial parameters (3,600 s), for intents just outside or inside it. */
export const GLOBAL_TTL_MS = 3_600_000;

export const VERIFIER_KEY = Uint8Array.from(
  readFileSync(new URL("./fixtures/verifier-key/spend.verifier", import.meta.url)),
);

export const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
export const fromHex = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));
export const sha256 = (bytes: Uint8Array): Uint8Array => Uint8Array.from(createHash("sha256").update(bytes).digest());
export const utf8 = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "utf8"));

/** A proving provider for transactions whose proofs nobody checks: every proof is empty. */
const EMPTY_PROVER = {
  async lookupKey(): Promise<undefined> {
    return undefined;
  },
  async check(): Promise<undefined[]> {
    return new Array<undefined>(256).fill(undefined);
  },
  async prove(): Promise<Uint8Array> {
    return Uint8Array.from([...Buffer.from("midnight:proof-versioned:", "latin1"), 1, 0]);
  },
};

/** A contract the fixtures deploy, with one operation `emit`, and the bytes of its deploy. */
export interface ContractFixture {
  /** The contract's address (32 bytes). */
  readonly address: Uint8Array;
  /** The deploy, proven and bound. */
  readonly deploy: Uint8Array;
}

function emitOperation(raw: RawPackage): v9.ContractOperation {
  const operation = new raw.ContractOperation();
  operation.verifierKey = VERIFIER_KEY;
  return operation;
}

function newDeploy(raw: RawPackage): v9.ContractDeploy {
  const state = new raw.ContractState();
  state.setOperation("emit", emitOperation(raw));
  state.data = new raw.ChargedState(raw.StateValue.newArray());
  return new raw.ContractDeploy(state);
}

/** Proves an unproven transaction with {@link EMPTY_PROVER} and binds it, as a chain transaction is. */
async function proveAndBind(raw: RawPackage, unproven: v9.UnprovenTransaction): Promise<Uint8Array> {
  const proven = await unproven.prove(EMPTY_PROVER, raw.CostModel.initialCostModel());
  return proven.bind().serialize();
}

/** Deploys a contract with an empty array as its state, in an intent whose TTL is `ttlMs`. */
export async function contractFixture(raw: RawPackage, ttlMs: number = T0 + 60_000): Promise<ContractFixture> {
  const deploy = newDeploy(raw);
  const address = fromHex(deploy.address);
  const intent = raw.Intent.new(new Date(ttlMs)).addDeploy(deploy);
  const unproven = raw.Transaction.fromParts(NETWORK_ID, undefined, undefined, intent);
  return { address, deploy: await proveAndBind(raw, unproven) };
}

/** One transaction deploying a contract in segment 2 and another in segment 1 (its intents set in that order). */
export async function twoSegmentDeploy(
  raw: RawPackage,
): Promise<{ bytes: Uint8Array; addresses: [Uint8Array, Uint8Array] }> {
  const [first, second] = [newDeploy(raw), newDeploy(raw)];
  const ttl = new Date(T0 + 60_000);
  const unproven = raw.Transaction.fromParts(NETWORK_ID, undefined, undefined, raw.Intent.new(ttl).addDeploy(first));
  unproven.intents = new Map([
    [2, raw.Intent.new(ttl).addDeploy(second)],
    [1, unproven.intents!.get(1)!],
  ]);
  return { bytes: await proveAndBind(raw, unproven), addresses: [fromHex(first.address), fromHex(second.address)] };
}

/**
 * One unproven intent holding a call of `emit` on `contract`, a deploy and a maintenance update of `contract`, in that
 * order: parseable, never on a chain. Returns the bytes and the deployed contract's address.
 */
export function mixedIntent(raw: RawPackage, contract: ContractFixture): { bytes: Uint8Array; deployed: Uint8Array } {
  const empty = { value: [], alignment: [] };
  const call = new raw.ContractCallPrototype(
    hex(contract.address),
    "emit",
    emitOperation(raw),
    { gas: GAS, effects: EMPTY_EFFECTS, program: logProgram([cellValue(Uint8Array.of(1))]) },
    undefined,
    [],
    empty,
    empty,
    raw.communicationCommitmentRandomness(),
    "emit",
  );
  const deploy = newDeploy(raw);
  const update = new raw.MaintenanceUpdate(hex(contract.address), [], 0n);
  const intent = raw.Intent.new(new Date(T0 + 60_000)).addCall(call).addDeploy(deploy).addMaintenanceUpdate(update);
  const bytes = raw.Transaction.fromParts(NETWORK_ID, undefined, undefined, intent).serialize();
  return { bytes, deployed: fromHex(deploy.address) };
}

/** An unproven deploy (`(signature, proof-preimage, embedded-fr)`): parseable, never on a chain. */
export function unprovenDeploy(raw: RawPackage): Uint8Array {
  const intent = raw.Intent.new(new Date(T0 + 60_000)).addDeploy(newDeploy(raw));
  return raw.Transaction.fromParts(NETWORK_ID, undefined, undefined, intent).serialize();
}

const EMPTY_EFFECTS = {
  claimedNullifiers: [],
  claimedShieldedReceives: [],
  claimedShieldedSpends: [],
  claimedContractCalls: [],
  shieldedMints: new Map(),
  unshieldedMints: new Map(),
  unshieldedInputs: new Map(),
  unshieldedOutputs: new Map(),
  claimedUnshieldedSpends: new Map(),
};

const GAS = { readTime: 0n, computeTime: 10_000_000_000n, bytesWritten: 65_536n, bytesDeleted: 65_536n };

/** A bytes atom of `length`, whose value is `bytes` (no trailing zero byte: the atom's normal form). */
export function atom(bytes: Uint8Array, length: number = bytes.length): v9.AlignedValue {
  return { value: [bytes], alignment: [{ tag: "atom", value: { tag: "bytes", length } }] };
}

/** A cell holding `bytes`, as the VM's `push` takes it. */
export function cellValue(bytes: Uint8Array, length: number = bytes.length): v9.EncodedStateValue {
  return { tag: "cell", content: atom(bytes, length) };
}

/** A MIP-0002 log value: `[version (4 bytes), event type (1 byte), data]` (CC-3). */
export function wrappedLog(version: number, eventType: number, data: v9.EncodedStateValue): v9.EncodedStateValue {
  return {
    tag: "array",
    content: [cellValue(Uint8Array.of(version), 4), cellValue(Uint8Array.of(eventType), 1), data],
  };
}

/** A transcript program that logs each value in order. */
export function logProgram(values: v9.EncodedStateValue[]): v9.Op<v9.AlignedValue>[] {
  return values.flatMap((value) => [{ push: { storage: false, value } }, "log" as const]);
}

/** A fallible transcript that fails when it runs: it pops an empty stack. */
export const FAILING_PROGRAM: v9.Op<v9.AlignedValue>[] = ["ckpt", "pop"];

/**
 * A call of `emit` on `contract`, proof-erased: its guaranteed transcript runs `guaranteed`, its fallible one (if any)
 * runs `fallible`.
 */
export function callTransaction(
  raw: RawPackage,
  contract: ContractFixture,
  guaranteed: v9.Op<v9.AlignedValue>[] | undefined,
  fallible?: v9.Op<v9.AlignedValue>[],
  ttlMs: number = T0 + 60_000,
  entryPoint: string | Uint8Array = "emit",
): Uint8Array {
  const transcript = (program: v9.Op<v9.AlignedValue>[] | undefined): v9.Transcript<v9.AlignedValue> | undefined =>
    program === undefined ? undefined : { gas: GAS, effects: EMPTY_EFFECTS, program };
  const empty = { value: [], alignment: [] };
  const call = new raw.ContractCallPrototype(
    hex(contract.address),
    entryPoint,
    emitOperation(raw),
    transcript(guaranteed),
    transcript(fallible),
    [],
    empty,
    empty,
    raw.communicationCommitmentRandomness(),
    "emit",
  );
  const intent = raw.Intent.new(new Date(ttlMs)).addCall(call);
  return raw.Transaction.fromParts(NETWORK_ID, undefined, undefined, intent).eraseProofs().serialize();
}

/** A proof-erased transaction with only a guaranteed zswap output of 10 units of the shielded native token. */
export function zswapOutputTransaction(raw: RawPackage): Uint8Array {
  const token = raw.shieldedToken().raw;
  const output = raw.ZswapOutput.new(
    raw.createShieldedCoinInfo(token, 10n),
    0,
    raw.sampleCoinPublicKey(),
    raw.sampleEncryptionPublicKey(),
  );
  const offer = raw.ZswapOffer.fromOutput(output, token, 10n);
  return raw.Transaction.fromParts(NETWORK_ID, offer, undefined, undefined).eraseProofs().serialize();
}

/** `DistributeReserve(1000000000000000)` (see the header). */
export function systemTransaction(ledger: Ledger): Uint8Array {
  return systemTransactionOf(ledger, "05");
}

/**
 * `PayBlockRewardsToTreasury { amount: 1000000000000000 }` (the same payload under variant 2), which a blank state
 * refuses: the amount exceeds the block reward pool.
 */
export function failingSystemTransaction(ledger: Ledger): Uint8Array {
  return systemTransactionOf(ledger, "02");
}

function systemTransactionOf(ledger: Ledger, variant: string): Uint8Array {
  const tag = ledger === "v8" ? "system-transaction[v6]" : "system-transaction[v9]";
  return Uint8Array.from([...Buffer.from(`midnight:${tag}:`, "latin1"), ...fromHex(`${variant}0f0080c6a47e8d03`)]);
}

/** A block at height 1 by default, at {@link T0}, whose parent is 6 s older. */
export function block(transactions: Uint8Array[], options: Partial<Omit<ApplyInput, "transactions">> = {}): ApplyInput {
  return {
    transactions,
    height: 1n,
    hash: new Uint8Array(32).fill(0x11),
    parentHash: new Uint8Array(32).fill(0x22),
    timestampMs: BigInt(T0),
    parentTimestampMs: BigInt(T0 - 6_000),
    firstRegularAtParentTime: false,
    ...options,
  };
}

/** The markers `Transaction.deserialize` takes, for the two forms these fixtures use. */
export function markersOf(bytes: Uint8Array): ["signature", "proof" | "no-proof", "binding" | "no-binding"] {
  const tag = Buffer.from(bytes.subarray(0, 96)).toString("latin1");
  return tag.includes(",(),") ? ["signature", "no-proof", "no-binding"] : ["signature", "proof", "binding"];
}

/**
 * The reference replay of one block with the published API alone, written from the official indexer's algorithm
 * (`midnight-indexer` `chain-indexer/src/domain/ledger_state.rs` `apply_transactions`,
 * `indexer-common/src/domain/ledger/ledger_state.rs` `apply_regular_transaction`, `apply_system_transaction`,
 * `finalize_apply_transactions`) and the node's (`midnight-node` `ledger/src/ledger_8/api/ledger.rs`
 * `apply_verified_transaction`: a ledger failure fails the extrinsic, which leaves the state as it was), for the
 * adapters' results to be compared with. Returns the state after the block, each transaction's result type, and the
 * ledger's name for each event it emitted (the variant its own `Debug` rendering names, e.g. `ContractLog`).
 */
export function referenceReplay(
  raw: RawPackage,
  start: v9.LedgerState,
  input: ApplyInput,
): { state: v9.LedgerState; types: string[]; events: string[][] } {
  const strictness = new raw.WellFormedStrictness();
  strictness.enforceBalancing = false;
  strictness.verifyNativeProofs = false;
  strictness.verifyContractProofs = false;
  const blockTime = new Date(Number(input.timestampMs));
  const bumped = new Date(Number(input.parentTimestampMs) + 12_000);
  let state = start;
  let fullness = { readTime: 0n, computeTime: 0n, blockUsage: 0n, bytesWritten: 0n, bytesChurned: 0n };
  let regularApplied = false;
  const types: string[] = [];
  const events: string[][] = [];
  const names = (emitted: v9.Event[]): string[] =>
    emitted.map((event) => /content: ([A-Za-z]+)/.exec(event.toString(true))?.[1] ?? "?");
  for (const bytes of input.transactions) {
    const tag = Buffer.from(bytes.subarray(0, 40)).toString("latin1");
    if (tag.startsWith("midnight:system-transaction")) {
      const [next, emitted] = state.applySystemTx(raw.SystemTransaction.deserialize(bytes), blockTime);
      state = next;
      types.push("system");
      events.push(names(emitted));
      continue;
    }
    const tx = raw.Transaction.deserialize(...markersOf(bytes), bytes);
    const at = (time: Date): v9.VerifiedTransaction | undefined => {
      try {
        return tx.wellFormed(state, strictness, time);
      } catch {
        return undefined;
      }
    };
    const verified = at(blockTime) ?? (input.firstRegularAtParentTime && !regularApplied ? at(bumped) : undefined);
    if (verified === undefined) {
      types.push("malformed");
      events.push([]);
      continue;
    }
    const cost = tx.cost(state.parameters, true);
    const context = new raw.TransactionContext(state, {
      secondsSinceEpoch: input.timestampMs / 1000n,
      secondsSinceEpochErr: 30,
      parentBlockHash: hex(input.parentHash),
      lastBlockTime: input.parentTimestampMs / 1000n,
    });
    const [next, result] = state.apply(verified, context);
    types.push(result.type);
    events.push(names(result.events));
    if (result.type === "failure") continue;
    state = next;
    regularApplied = true;
    fullness = {
      readTime: fullness.readTime + cost.readTime,
      computeTime: fullness.computeTime + cost.computeTime,
      blockUsage: fullness.blockUsage + cost.blockUsage,
      bytesWritten: fullness.bytesWritten + cost.bytesWritten,
      bytesChurned: fullness.bytesChurned + cost.bytesChurned,
    };
  }
  const normalized = state.parameters.normalizeFullness(fullness);
  const overall = Math.max(
    normalized.readTime,
    normalized.computeTime,
    normalized.blockUsage,
    normalized.bytesWritten,
    normalized.bytesChurned,
  );
  return { state: state.postBlockUpdate(blockTime, normalized, overall), types, events };
}

/** Frees each ledger object now (see `free` in node-format.ts). */
export function freeAll(...objects: object[]): void {
  for (const object of objects) free(object);
}
