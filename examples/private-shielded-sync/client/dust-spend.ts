/**
 * Spending a privately synced Dust coin (spec 00062 phase 9): the wallet's `DustLocalState` from the coin's Merkle path
 * and the generation records, and the fee of a transaction paid with it.
 *
 * - **The local state** (ledger `DustLocalState::spend` needs the coin tracked, its leaf and path in the commitment
 *   tree, its Night's generation record and path in the generation tree, and the map from the Night's initial nonce to
 *   the record's index): every generation record inserted in index order (`insertGenerationInfo`, the wallet's own with
 *   their initial nonce, the others collapsed), so the ledger computes each leaf; the commitment tree around the coin
 *   from its 32 siblings as collapsed updates (`./tree.ts` `spendUpdatesFromPath`: one update over the positions before
 *   it, the coin inserted at its position, one update per non-empty right sibling); the coin added by its nullifier.
 *   Both roots must be the Dust snapshot's (which the server checked against the core's), or nothing is built.
 * - **The fee** (as the wallet SDK balances Dust, `wallet-sdk-dust-wallet` `v2/Transacting.js`): the spend goes in a
 *   balancing intent's `DustActions`, dated at the snapshot's block time, merged with the transaction it pays for; the
 *   fee is that merged transaction's `feesWithMargin` under the ledger parameters in force, and the spend's `vFee` is
 *   raised until it covers it.
 * - **The check** (as the SDK's `validateTransaction`): `wellFormed` against a blank ledger state holding the
 *   parameters in force, balancing, signatures and limits enforced.
 *
 * The chain dates a Dust spend's roots by its declared time: it checks the proof against the roots it recorded at the
 * last block at or before that time (ledger `verify.rs`, `TimeFilterMap::get`), and keeps those roots for its global
 * TTL; a spend's time must also be within the Dust grace period of the block that includes it. So a spend built from a
 * snapshot is dated at the snapshot's block time and is good until the earlier of those limits; the snapshot is
 * rebuilt by hand (the admin route).
 */

import type { Kernel } from "../kernel/index.ts";
import { type DustGenerationRecord, fromHex, toHex } from "../shared/index.ts";
import type { DustChecker, DustCoinPath } from "./dust-check.ts";
import { type DustChain, type DustCoin, fieldBytes } from "./dust.ts";
import type { Ledger } from "./ledger.ts";
import { leToBigInt, serializeCollapsedUpdate, spendUpdatesFromPath } from "./tree.ts";

type DustLocalState = InstanceType<Ledger["DustLocalState"]>;
type DustSecretKey = Parameters<Ledger["dustNullifier"]>[1];
type DustParameters = InstanceType<Ledger["DustParameters"]>;
type LedgerParameters = ReturnType<Ledger["LedgerParameters"]["initialParameters"]>;
type UnprovenTransaction = ReturnType<Ledger["Transaction"]["fromParts"]>;
type UnprovenDustSpend = ReturnType<DustLocalState["spend"]>[1];

/** A Dust coin ready to be spent: its chain, path, the local state holding it and the spend's time. */
export interface DustSpendable {
  /** The chain's index among the wallet's chains. */
  readonly chain: number;
  readonly coin: DustCoin;
  /** Its value at `ctime`, in Specks: the most a fee paid with it can be. */
  readonly value: bigint;
  readonly path: DustCoinPath;
  readonly records: number;
  readonly state: DustLocalState;
  /** The spend's declared time: the Dust snapshot's block time (the chain checks the spend against its roots then). */
  readonly ctime: Date;
  /** The snapshot's roots, 32 bytes little-endian, hexadecimal; the local state's are equal to them. */
  readonly roots: { readonly commitment: string; readonly generation: string };
  /** Milliseconds: the path read, the generation records, the local state. */
  readonly ms: { readonly path: number; readonly records: number; readonly state: number };
}

/**
 * The chain whose current coin pays: one the snapshot holds (its position below the snapshot's commitments, checked by
 * PIR or the public first coin), worth the most at the snapshot's block time; null when none is.
 */
export function chooseDustChain(ledger: Ledger, chains: readonly DustChain[], params: DustParameters, commitments: number, ctime: Date): { chain: number; value: bigint } | null {
  let best: { chain: number; value: bigint } | null = null;
  chains.forEach((c, i) => {
    if (c.status !== "checked" && c.status !== "no-spend") return;
    if (Number(c.coin.mtIndex) >= commitments || c.coin.ctime.getTime() > ctime.getTime()) return;
    const value = ledger.updatedValue(c.coin.ctime, c.coin.initialValue, c.generation, ctime, params);
    if (best === null || value > best.value) best = { chain: i, value };
  });
  return best;
}

/**
 * Reads the chosen coin's path privately (`checker.readPath`), downloads the generation records and builds the local
 * state holding the coin (`dustLocalState`), dated at the snapshot's block time. Throws when no coin of the wallet is
 * in the snapshot (each is newer than it, or unchecked: rebuild the snapshot with the admin route, sync again).
 */
export async function dustSpendable(
  ledger: Ledger,
  args: {
    readonly checker: DustChecker;
    readonly chains: readonly DustChain[];
    readonly params: DustParameters;
    readonly secretKey: DustSecretKey;
    readonly owner: bigint;
    readonly kernel: Kernel;
    /** The chain to pay from; the one `chooseDustChain` picks when absent. */
    readonly chain?: number;
  },
): Promise<DustSpendable> {
  const m = args.checker.manifest;
  const ctime = new Date(m.blockTime * 1000);
  let chosen = chooseDustChain(ledger, args.chains, args.params, m.commitments, ctime);
  if (args.chain !== undefined) {
    const c = args.chains[args.chain];
    if (c === undefined) throw new Error(`the wallet has no Dust chain ${args.chain + 1}`);
    const only = chooseDustChain(ledger, [c], args.params, m.commitments, ctime);
    chosen = only === null ? null : { chain: args.chain, value: only.value };
  }
  if (chosen === null) {
    throw new Error(`no Dust coin of this wallet is in the Dust snapshot at height ${m.height} (positions below ${m.commitments}, checked): rebuild the snapshot (the admin route) and sync again`);
  }
  const chain = args.chains[chosen.chain]!;
  const coin = chain.coin;
  let started = performance.now();
  const path = await args.checker.readPath(Number(coin.mtIndex), fieldBytes(ledger.dustCommitment(coin)), args.kernel);
  const pathMs = performance.now() - started;
  started = performance.now();
  const records = await args.checker.generationRecords();
  const recordsMs = performance.now() - started;
  const { state, ms: stateMs } = dustLocalState(ledger, {
    params: args.params,
    secretKey: args.secretKey,
    owner: args.owner,
    coin,
    siblings: path.siblings,
    records,
    commitmentRoot: fromHex(m.tree.root, 32),
    generationRoot: fromHex(m.generation.root, 32),
  });
  return {
    chain: chosen.chain,
    coin,
    value: chosen.value,
    path,
    records: records.length,
    state,
    ctime,
    roots: { commitment: toHex(fieldBytes(state.commitmentTreeRoot()!)), generation: toHex(fieldBytes(state.generatingTreeRoot()!)) },
    ms: { path: pathMs, records: recordsMs, state: stateMs },
  };
}

/** The ledger's record type from the file's. */
export function generationInfoOf(r: DustGenerationRecord): Parameters<Ledger["successorDustUtxo"]>[4] {
  return { value: r.value, owner: r.owner, nonce: r.nonce, dtime: r.dtime === null ? undefined : new Date(r.dtime * 1000) };
}

/**
 * The wallet's local state holding `coin` (at its position, with the 32 `siblings` read for it) and every generation
 * record; throws unless its two roots are `commitmentRoot` and `generationRoot` (32 bytes, little-endian each).
 */
export function dustLocalState(
  ledger: Ledger,
  args: {
    readonly params: DustParameters;
    readonly secretKey: DustSecretKey;
    readonly owner: bigint;
    readonly coin: DustCoin;
    readonly siblings: readonly Uint8Array[];
    readonly records: readonly DustGenerationRecord[];
    readonly commitmentRoot: Uint8Array;
    readonly generationRoot: Uint8Array;
  },
): { state: DustLocalState; ms: number } {
  const started = performance.now();
  const { coin, owner } = args;
  let local = new ledger.DustLocalState(args.params);
  args.records.forEach((r, i) => {
    local = local.insertGenerationInfo(BigInt(i), generationInfoOf(r), r.owner === owner ? r.nonce : undefined);
  });
  const generationRoot = leToBigInt(args.generationRoot);
  if (local.generatingTreeRoot() !== generationRoot) throw new Error(`the local generation tree's root ${local.generatingTreeRoot()?.toString(16)} is not the Dust snapshot's ${generationRoot.toString(16)}`);
  if (local.generationInfo(coin) === undefined) throw new Error("the coin's generation record is not among the records (its Night output's nonce is not this wallet's)");
  const position = Number(coin.mtIndex);
  const { left, right } = spendUpdatesFromPath(position, args.siblings);
  const update = (u: Parameters<typeof serializeCollapsedUpdate>[0]) => ledger.DustStateMerkleTreeCollapsedUpdate.deserialize(serializeCollapsedUpdate(u));
  if (left !== null) local = local.applyCommitmentCollapsedUpdate(update(left));
  if (local.commitmentTreeFirstFree !== coin.mtIndex) throw new Error(`the local commitment tree's first free position is ${local.commitmentTreeFirstFree}, not the coin's ${coin.mtIndex}`);
  local = local.insertCommitment(coin.mtIndex, coin, true);
  for (const u of right) local = local.applyCommitmentCollapsedUpdate(update(u));
  const commitmentRoot = leToBigInt(args.commitmentRoot);
  if (local.commitmentTreeRoot() !== commitmentRoot) throw new Error(`the local commitment tree's root ${local.commitmentTreeRoot()?.toString(16)} is not the Dust snapshot's ${commitmentRoot.toString(16)}`);
  local = local.addUtxo(ledger.dustNullifier(coin, args.secretKey), coin);
  return { state: local, ms: performance.now() - started };
}

/**
 * `base` with its fee paid by `coin`: a balancing intent (segment 1) whose `DustActions`, dated `ctime`, spend the coin
 * for the fee. The fee is the merged transaction's `feesWithMargin(parameters, margin)`; the spend's `vFee` is raised
 * until it covers it (a few rounds: the fee hardly depends on `vFee`).
 */
export function payFeeWithDust(
  ledger: Ledger,
  args: {
    readonly network: string;
    readonly base: UnprovenTransaction;
    readonly local: DustLocalState;
    readonly secretKey: DustSecretKey;
    readonly coin: DustCoin;
    readonly ctime: Date;
    readonly ttl: Date;
    readonly parameters: LedgerParameters;
    readonly margin: number;
  },
): { transaction: UnprovenTransaction; fee: bigint; spend: UnprovenDustSpend; rounds: number } {
  const erasedBase = args.base.eraseProofs();
  let vFee = 0n;
  for (let round = 1; round <= 6; round++) {
    const [, spend] = args.local.spend(args.secretKey, args.coin, vFee, args.ctime);
    const intent = ledger.Intent.new(args.ttl);
    intent.dustActions = new ledger.DustActions("signature", "pre-proof", args.ctime, [spend], []);
    const balancing = ledger.Transaction.fromParts(args.network).addIntent({ tag: "specific", value: 1 }, intent);
    const fee = erasedBase.merge(balancing.eraseProofs()).feesWithMargin(args.parameters, args.margin);
    if (vFee >= fee) return { transaction: args.base.merge(balancing), fee, spend, rounds: round };
    vFee = fee;
  }
  throw new Error("the Dust fee did not settle in six rounds");
}

/** The SDK's validation (`validateTransaction`): `wellFormed` against a blank state holding the parameters in force. */
export function validateLikeTheSdk(ledger: Ledger, transaction: { wellFormed(state: InstanceType<Ledger["LedgerState"]>, strictness: InstanceType<Ledger["WellFormedStrictness"]>, tblock: Date): unknown }, network: string, parameters: LedgerParameters, now: Date): void {
  const state = ledger.LedgerState.blank(network);
  state.parameters = parameters;
  const strictness = new ledger.WellFormedStrictness();
  strictness.enforceBalancing = true;
  strictness.verifySignatures = true;
  strictness.enforceLimits = true;
  transaction.wellFormed(state, strictness, now);
}
