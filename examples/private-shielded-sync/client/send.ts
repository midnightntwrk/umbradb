/**
 * The transfer's ledger part (spec FR-120–124, story 5), ported from the transfer spike's working sequence
 * (`experiments/00053-transfer-spike/e/e3-transfer.ts`, finalized on Preprod in block 3,399,948):
 *
 * 1. the coin's 32 siblings: the lower k from its PIR record, or from the tail's commitments and outputs when its block
 *    was not full at the snapshot; the upper 32 − k from the current block roots (the snapshot's, then the tail's);
 *    the root they give must equal the tail's root (FR-121);
 * 2. a one-use `ZswapLocalState`: a collapsed update over 0 … i − 1 (the left siblings), `insertCoin` (lands at i), one
 *    single-hash update per non-empty right sibling; its `merkleTreeRoot` must equal that root; then `spend` (FR-122);
 * 3. the payment and the change, each `ZswapOutput.new` with a ciphertext to its owner's encryption key (FR-124);
 * 4. the unproven transaction `Transaction.fromParts(network, offer)`.
 *
 * Fee balancing, proving and submission need the wallet SDK and run in `sdk/transfer.ts`.
 */

import type { Kernel } from "../kernel/index.ts";
import { decodeTailOutput, equalBytes, type splitTail, TAIL_OUTPUT_BYTES } from "../shared/index.ts";
import type { ShieldedAddress } from "./address.ts";
import type { WalletKeys } from "./keys.ts";
import type { Ledger } from "./ledger.ts";
import type { CoinRecord } from "./state.ts";
import {
  type Hash2,
  leToBigInt,
  NODE_BYTES,
  rootFromPath,
  serializeCollapsedUpdate,
  siblingsOf,
  spendUpdatesFromPath,
  TREE_DEPTH,
  treeLevels,
} from "./tree.ts";

/** What the path of a coin is assembled from: the snapshot's block roots and a tail of that snapshot. */
export interface TreeView {
  readonly pathSplit: number;
  readonly snapshotFirstFree: number;
  /** The snapshot's block-roots artifact. */
  readonly snapshotBlockRoots: Uint8Array;
  readonly tail: ReturnType<typeof splitTail>;
}

/** The 32 siblings of `coin` (bottom up) and the root they give, which equals the tail's (FR-121). */
export function coinPath(view: TreeView, coin: Pick<CoinRecord, "position" | "commitment" | "lowerPath">, kernel: Kernel): { siblings: Uint8Array[]; root: Uint8Array } {
  const hash: Hash2 = (a, b) => kernel.hash2(a, b)!;
  const k = view.pathSplit;
  const size = 2 ** k;
  const f = view.snapshotFirstFree;
  const t0 = Math.floor(f / size) * size;
  const tailFirstFree = view.tail.header.firstFree;
  const position = coin.position;
  if (position >= tailFirstFree) throw new Error(`position ${position} is not in the tree (first_free ${tailFirstFree})`);
  const block = Math.floor(position / size);
  let lower: Uint8Array[];
  if (coin.lowerPath !== null) {
    if (coin.lowerPath.length !== k) throw new Error(`a lower path of ${coin.lowerPath.length} hashes, not ${k}`);
    lower = coin.lowerPath.map((h) => Buffer.from(h, "hex"));
  } else {
    if (block * size < t0) throw new Error(`position ${position} has no lower path and lies below the tail's first block: sync again`);
    const leaves: Uint8Array[] = [];
    for (let i = block * size; i < Math.min((block + 1) * size, tailFirstFree); i++) {
      const commitment =
        i < f
          ? view.tail.commitments.subarray((i - t0) * NODE_BYTES, (i - t0 + 1) * NODE_BYTES)
          : decodeTailOutput(view.tail.outputs.subarray((i - f) * TAIL_OUTPUT_BYTES, (i - f + 1) * TAIL_OUTPUT_BYTES)).commitment;
      leaves.push(kernel.leaf(commitment));
    }
    lower = siblingsOf(treeLevels(leaves, k, hash), position - block * size);
  }
  const roots: Uint8Array[] = [];
  for (let b = 0; b < t0 / size; b++) roots.push(view.snapshotBlockRoots.subarray(b * NODE_BYTES, (b + 1) * NODE_BYTES));
  for (let off = 0; off < view.tail.blockRoots.length; off += NODE_BYTES) roots.push(view.tail.blockRoots.subarray(off, off + NODE_BYTES));
  const upper = siblingsOf(treeLevels(roots, TREE_DEPTH - k, hash), block);
  const siblings = [...lower, ...upper];
  const root = rootFromPath(kernel.leaf(Buffer.from(coin.commitment, "hex")), position, siblings, hash);
  if (!equalBytes(root, view.tail.header.root)) throw new Error(`the path of position ${position} does not give the tail's root`);
  return { siblings, root };
}

export interface TransferPlan {
  /** The unproven transaction (`Transaction.fromParts`), serialized. */
  readonly unproven: Uint8Array;
  readonly nullifier: string;
  readonly payment: { readonly commitment: string; readonly value: string; readonly tokenType: string; readonly nonce: string };
  readonly change: { readonly commitment: string; readonly value: string; readonly tokenType: string; readonly nonce: string } | null;
  /** Timings, ms: the one-use state, the spend. */
  readonly stateMs: number;
  readonly spendMs: number;
  readonly leftHashes: number;
  readonly rightUpdates: number;
}

/**
 * Builds the transfer of `amount` of `coin` to `recipient`, the rest back to this wallet (FR-120, one coin per
 * transfer), from the coin's path and the root it gives.
 */
export function planTransfer(args: {
  readonly ledger: Ledger;
  readonly keys: WalletKeys;
  readonly network: string;
  readonly coin: CoinRecord;
  readonly siblings: readonly Uint8Array[];
  readonly root: Uint8Array;
  readonly recipient: ShieldedAddress;
  readonly amount: bigint;
}): TransferPlan & {
  readonly transaction: ReturnType<Ledger["Transaction"]["fromParts"]>;
  readonly offer: ReturnType<Ledger["ZswapOffer"]["fromInput"]>;
} {
  const { ledger, keys, coin, siblings, root, recipient, amount } = args;
  const value = BigInt(coin.value);
  if (amount <= 0n) throw new Error("the amount must be positive");
  if (amount > value) throw new Error(`the amount ${amount} exceeds the coin's value ${value} (one coin per transfer)`);
  const info = { type: coin.tokenType, nonce: coin.nonce, value };
  if (ledger.coinCommitment(info, keys.zswap.coinPublicKey) !== coin.commitment) throw new Error("the coin's commitment does not match its record");

  let t = performance.now();
  const { left, right } = spendUpdatesFromPath(coin.position, siblings);
  const update = (u: Parameters<typeof serializeCollapsedUpdate>[0]) => ledger.MerkleTreeCollapsedUpdate.deserialize(serializeCollapsedUpdate(u));
  let local = new ledger.ZswapLocalState();
  if (left !== null) local = local.applyCollapsedUpdate(update(left));
  if (local.firstFree !== BigInt(coin.position)) throw new Error(`the local state's first_free is ${local.firstFree}, not ${coin.position}`);
  local = local.insertCoin(keys.zswap, info);
  for (const u of right) local = local.applyCollapsedUpdate(update(u));
  if (local.merkleTreeRoot !== leToBigInt(root)) throw new Error("the one-use local state's root differs from the path's root");
  const stateMs = performance.now() - t;

  t = performance.now();
  const [, input] = local.spend(keys.zswap, { ...info, mt_index: BigInt(coin.position) }, 0);
  const spendMs = performance.now() - t;
  if (input.nullifier !== coin.nullifier) throw new Error("the spend's nullifier differs from the coin's");

  const pay = ledger.createShieldedCoinInfo(coin.tokenType, amount);
  const outPay = ledger.ZswapOutput.new(pay, 0, recipient.coinPublicKey, recipient.encryptionPublicKey);
  let offer = ledger.ZswapOffer.fromInput(input).merge(ledger.ZswapOffer.fromOutput(outPay));
  let change: TransferPlan["change"] = null;
  if (amount < value) {
    const back = ledger.createShieldedCoinInfo(coin.tokenType, value - amount);
    const outBack = ledger.ZswapOutput.new(back, 0, keys.zswap.coinPublicKey, keys.zswap.encryptionPublicKey);
    offer = offer.merge(ledger.ZswapOffer.fromOutput(outBack));
    change = { commitment: outBack.commitment, value: back.value.toString(), tokenType: back.type, nonce: back.nonce };
  }
  const delta = offer.deltas.get(coin.tokenType) ?? 0n;
  if (delta !== 0n) throw new Error(`the offer is not balanced in its token: delta ${delta}`);
  const transaction = ledger.Transaction.fromParts(args.network, offer);
  return {
    transaction,
    offer,
    unproven: transaction.serialize(),
    nullifier: input.nullifier,
    payment: { commitment: outPay.commitment, value: amount.toString(), tokenType: coin.tokenType, nonce: pay.nonce },
    change,
    stateMs,
    spendMs,
    leftHashes: left?.hashes.length ?? 0,
    rightUpdates: right.length,
  };
}

/** The coin to spend: the given position, or the smallest unspent coin of `tokenType` holding at least `amount`. */
export function chooseCoin(coins: readonly CoinRecord[], tokenType: string, amount: bigint, position?: number): CoinRecord {
  if (position !== undefined) {
    const c = coins.find((x) => x.position === position);
    if (c === undefined) throw new Error(`no unspent coin at position ${position}`);
    if (c.tokenType !== tokenType) throw new Error(`the coin at ${position} is of token ${c.tokenType}`);
    return c;
  }
  const fits = coins.filter((c) => c.tokenType === tokenType && BigInt(c.value) >= amount).sort((a, b) => (BigInt(a.value) < BigInt(b.value) ? -1 : 1));
  if (fits.length === 0) throw new Error(`no single unspent coin of token ${tokenType} holds ${amount} (one coin per transfer)`);
  return fits[0]!;
}

