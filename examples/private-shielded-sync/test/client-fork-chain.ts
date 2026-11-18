/**
 * A chain across a ledger 8 → 9 upgrade, as Preprod's history is (its wallet A coins were made under ledger 8): a
 * synthetic tape (`test/backbone/ledger-tapes.ts`) of real proof-erased transactions built with the vendored v8 and v9
 * packages, the upgrade at F = 4 (runtime 2.1, as the repository's upgrade scenarios).
 *
 * Blocks (positions are tree indices; outputs merged in one offer take the ledger's order):
 * 1. (v8) A gets 10, 20; B gets 5.                      → 0–2
 * 2. (v8) A gets 30.                                    → 3
 * 3. (v8) A spends its 10: 4 to B, 6 back to A.         → 4, 5; one nullifier (a ledger 8 spend)
 * 4. (v9, F) empty.
 * 5. (v9) A gets 40; B gets 7.                           → 6, 7
 * 6. (v9) A spends its 20 (a ledger 8 coin): 15 to B, 5 back. → 8, 9; one nullifier
 * 7. (v9) A gets 50.                                    → 10
 *
 * Each wallet keeps a ledger 8 `ZswapLocalState` applying every offer, carried to ledger 9 at F by its serialization.
 */

import { type LedgerScenario, ledgerScenario, type LedgerTx, RUNTIME_2_1 } from "../../../test/backbone/ledger-tapes.js";
import { NETWORK_ID, RAW } from "../../../test/ledger/adapter-fixtures.js";

/* eslint-disable @typescript-eslint/no-explicit-any -- two packages' classes in one wallet */
type Any = any;

export interface ForkWallet {
  readonly seed: Uint8Array;
  readonly keys8: Any;
  readonly keys9: Any;
  local: Any;
}

export interface ForkChain {
  readonly scenario: LedgerScenario;
  readonly wallets: { readonly A: ForkWallet; readonly B: ForkWallet };
}

export async function forkChain(): Promise<ForkChain> {
  const wallet = (fill: number): ForkWallet => {
    const seed = new Uint8Array(32).fill(fill);
    return { seed, keys8: RAW.v8.ZswapSecretKeys.fromSeed(seed), keys9: RAW.v9.ZswapSecretKeys.fromSeed(seed), local: new RAW.v8.ZswapLocalState() };
  };
  const A = wallet(0xa8);
  const B = wallet(0xb8);
  const wallets = [A, B];
  const blocks: LedgerTx[][] = [[]];
  let raw: Any = RAW.v8;
  const keysOf = (w: ForkWallet): Any => (raw === RAW.v8 ? w.keys8 : w.keys9);
  const token = (): string => raw.shieldedToken().raw;
  const output = (to: ForkWallet, value: bigint): Any => {
    const keys = keysOf(to);
    return raw.ZswapOffer.fromOutput(raw.ZswapOutput.new(raw.createShieldedCoinInfo(token(), value), 0, keys.coinPublicKey, keys.encryptionPublicKey), token(), value);
  };
  const merge = (offers: readonly Any[]): Any => offers.reduce((a, b) => a.merge(b));
  const add = (offers: readonly Any[]): void => {
    blocks.push(offers.map((offer) => ({ bytes: raw.Transaction.fromParts(NETWORK_ID, offer).eraseProofs().serialize(), kind: "regular" as const })));
    for (const offer of offers) for (const w of wallets) w.local = w.local.apply(keysOf(w), offer);
  };
  const spend = (from: ForkWallet, value: bigint, outputs: readonly Any[]): Any => {
    const coin = [...from.local.coins].find((c: Any) => c.value === value);
    if (coin === undefined) throw new Error(`no coin of ${value}`);
    const [, input] = from.local.spend(keysOf(from), coin, 0);
    return merge([raw.ZswapOffer.fromInput(input, token(), value), ...outputs]);
  };

  add([merge([output(A, 10n), output(A, 20n), output(B, 5n)])]);
  add([output(A, 30n)]);
  add([spend(A, 10n, [output(B, 4n), output(A, 6n)])]);
  // F: the upgrade. The wallets' states cross to ledger 9 by their serialization (`zswap-local-state[v6]` in both).
  blocks.push([]);
  raw = RAW.v9;
  for (const w of wallets) w.local = RAW.v9.ZswapLocalState.deserialize(w.local.serialize());
  add([output(A, 40n), output(B, 7n)]);
  add([spend(A, 20n, [output(B, 15n), output(A, 5n)])]);
  add([output(A, 50n)]);

  const scenario = await ledgerScenario({
    ledger: "v8",
    genesis: RAW.v8.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks,
    upgrade: { at: 4, runtime: RUNTIME_2_1 },
  });
  for (const [h, height] of scenario.heights.entries()) {
    const failed = height.types.filter((type) => type !== "success");
    if (failed.length > 0) throw new Error(`forkChain: block ${h} has ${failed.join(", ")} transactions: a fixture problem`);
  }
  return { scenario, wallets: { A, B } };
}
