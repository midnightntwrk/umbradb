/**
 * A small chain of real ledger transactions for the server's tests: a synthetic tape (`test/backbone/ledger-tapes.ts`)
 * whose blocks hold proof-erased v9 transactions built with the vendored package's own API, so that `core-ledger-state`
 * applies them as the node would and stores real `zswap-output` (with ciphertexts, and one a contract owns, without)
 * and `zswap-input` events, and real tree roots. The tape also carries the reference replay's state after every block.
 *
 * Wallets keep a `ZswapLocalState` that applies every offer in chain order, so its tree is the chain's and a spend's
 * root is a root the chain recorded (a block's spends are made from the states at the block's start).
 *
 * Blocks (positions are tree indices; an offer's outputs are in the ledger's order within it):
 * 1. A gets 100, 200, 300; B gets 50, 60.            → positions 0–4
 * 2. a contract is deployed.
 * 3. an output the contract owns (claimed by a call); A gets 70. → 5, 6 (one of them without a ciphertext)
 * 4. A spends its 100: 40 to B, 60 back to A.         → 7, 8; one nullifier
 * 5. B spends its 50 to A; B gets 1.                  → 9, 10; one nullifier
 * 6. A gets 7, 8, 9.                                  → 11–13
 * 7. A spends its 200 to B.                           → 14; one nullifier
 */

import { CHAIN_START_MS } from "../../../test/backbone/fetch-fixtures.js";
import { type LedgerScenario, ledgerScenario, type LedgerTx } from "../../../test/backbone/ledger-tapes.js";
import { contractFixture, fixtureGas, hex, NETWORK_ID, RAW, VERIFIER_KEY } from "../../../test/ledger/adapter-fixtures.js";
import type * as V9 from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { encryptionSecretKeyScalar } from "../kernel/secret-key.ts";

type Raw = typeof RAW.v9;
type Offer = V9.ZswapOffer<V9.PreProof>;

/** A test wallet: its keys (from a fixed seed), its local state, its encryption secret as the kernel's scalar. */
export interface ChainWallet {
  readonly name: string;
  readonly keys: V9.ZswapSecretKeys;
  local: V9.ZswapLocalState;
  readonly secret: Uint8Array;
}

export interface ScenarioChain {
  readonly scenario: LedgerScenario;
  readonly wallets: { readonly A: ChainWallet; readonly B: ChainWallet };
  /** The contract that owns one output. */
  readonly contract: Uint8Array;
  /** Every spend: its height and nullifier (hex). */
  readonly spends: readonly { readonly height: number; readonly nullifier: string }[];
}

function wallet(raw: Raw, name: string, fill: number): ChainWallet {
  const keys = raw.ZswapSecretKeys.fromSeed(new Uint8Array(32).fill(fill));
  const secret = encryptionSecretKeyScalar(keys.encryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize());
  return { name, keys, local: new raw.ZswapLocalState(), secret };
}

function output(raw: Raw, token: string, to: ChainWallet, value: bigint): Offer {
  const out = raw.ZswapOutput.new(raw.createShieldedCoinInfo(token, value), 0, to.keys.coinPublicKey, to.keys.encryptionPublicKey);
  return raw.ZswapOffer.fromOutput(out, token, value);
}

const merge = (offers: readonly Offer[]): Offer => offers.reduce((a, b) => a.merge(b as never) as Offer);

const erased = (raw: Raw, offer: Offer, intent?: V9.Intent<V9.SignatureEnabled, V9.PreProof, V9.PreBinding>): Uint8Array =>
  raw.Transaction.fromParts(NETWORK_ID, offer as never, undefined, intent as never).eraseProofs().serialize();

/** A spend of `from`'s coin of `value`, with outputs; made from the wallet's state at the block's start. */
function spend(raw: Raw, token: string, from: ChainWallet, value: bigint, outputs: readonly Offer[]): { offer: Offer; nullifier: string } {
  const coin = [...from.local.coins].find((c) => c.value === value);
  if (coin === undefined) throw new Error(`${from.name} holds no coin of ${value}`);
  const [, input] = from.local.spend(from.keys, coin, 0);
  return { offer: merge([raw.ZswapOffer.fromInput(input, token, value), ...outputs]), nullifier: input.nullifier };
}

/** An output `contract` owns, claimed by a call of the contract as a receive (as lane A's evidence tests build it). */
function contractOutput(raw: Raw, token: string, contract: Uint8Array, ttlMs: number): { offer: Offer; bytes: Uint8Array } {
  const out = raw.ZswapOutput.newContractOwned(raw.createShieldedCoinInfo(token, 5n), 0, hex(contract));
  const offer = raw.ZswapOffer.fromOutput(out, token, 5n);
  const bytesAtom = (bytes: Uint8Array, length: number) => ({
    value: [bytes],
    alignment: [{ tag: "atom" as const, value: { tag: "bytes" as const, length } }],
  });
  const program = [
    { swap: { n: 0 } },
    { idx: { cached: true, pushPath: true, path: [{ tag: "value" as const, value: bytesAtom(Uint8Array.of(1), 1) }] } },
    { push: { storage: false, value: { tag: "cell" as const, content: bytesAtom(Buffer.from(out.commitment, "hex"), 32) } } },
    { push: { storage: false, value: { tag: "null" as const } } },
    { ins: { cached: true, n: 2 } },
    { swap: { n: 0 } },
  ];
  const effects = {
    claimedNullifiers: [],
    claimedShieldedReceives: [out.commitment],
    claimedShieldedSpends: [],
    claimedContractCalls: [],
    shieldedMints: new Map(),
    unshieldedMints: new Map(),
    unshieldedInputs: new Map(),
    unshieldedOutputs: new Map(),
    claimedUnshieldedSpends: new Map(),
  };
  const operation = new raw.ContractOperation();
  operation.verifierKey = VERIFIER_KEY;
  const empty = { value: [], alignment: [] };
  const call = new raw.ContractCallPrototype(
    hex(contract),
    "emit",
    operation,
    { gas: fixtureGas(raw), effects, program } as never,
    undefined,
    [],
    empty,
    empty,
    raw.communicationCommitmentRandomness(),
    "emit",
  );
  const intent = raw.Intent.new(new Date(ttlMs)).addCall(call);
  return { offer, bytes: erased(raw, offer, intent as never) };
}

/** Builds the chain of the module comment. */
export async function scenarioChain(): Promise<ScenarioChain> {
  const raw = RAW.v9;
  const token = raw.shieldedToken().raw;
  const A = wallet(raw, "A", 0xa1);
  const B = wallet(raw, "B", 0xb2);
  const wallets = [A, B];
  const contract = await contractFixture(raw);
  const blocks: LedgerTx[][] = [[]];
  const spends: { height: number; nullifier: string }[] = [];
  const ttlAt = (height: number): number => Number(CHAIN_START_MS) + height * 6_000 + 60_000;
  /** Adds a block of transactions, each an offer; applies every offer to every wallet in order. */
  const add = (txs: readonly { readonly offer: Offer; readonly bytes?: Uint8Array }[]): void => {
    blocks.push(txs.map((tx) => ({ bytes: tx.bytes ?? erased(raw, tx.offer), kind: "regular" as const })));
    for (const tx of txs) for (const w of wallets) w.local = w.local.apply(w.keys, tx.offer as never);
  };
  const plain = (offer: Offer) => ({ offer });

  add([plain(merge([output(raw, token, A, 100n), output(raw, token, A, 200n), output(raw, token, A, 300n)])), plain(merge([output(raw, token, B, 50n), output(raw, token, B, 60n)]))]);
  blocks.push([{ bytes: contract.deploy, kind: "regular" }]);
  add([contractOutput(raw, token, contract.address, ttlAt(3)), plain(output(raw, token, A, 70n))]);
  {
    const s = spend(raw, token, A, 100n, [output(raw, token, B, 40n), output(raw, token, A, 60n)]);
    spends.push({ height: 4, nullifier: s.nullifier });
    add([plain(s.offer)]);
  }
  {
    const s = spend(raw, token, B, 50n, [output(raw, token, A, 50n)]);
    spends.push({ height: 5, nullifier: s.nullifier });
    add([plain(s.offer), plain(output(raw, token, B, 1n))]);
  }
  add([plain(merge([output(raw, token, A, 7n), output(raw, token, A, 8n), output(raw, token, A, 9n)]))]);
  {
    const s = spend(raw, token, A, 200n, [output(raw, token, B, 200n)]);
    spends.push({ height: 7, nullifier: s.nullifier });
    add([plain(s.offer)]);
  }
  const scenario = await ledgerScenario({
    ledger: "v9",
    genesis: raw.LedgerState.blank(NETWORK_ID).serialize(),
    includesBlockZero: false,
    blocks,
  });
  for (const [h, height] of scenario.heights.entries()) {
    const failed = height.types.filter((type) => type !== "success");
    if (failed.length > 0) throw new Error(`scenarioChain: block ${h} has ${failed.join(", ")} transactions: a fixture problem`);
  }
  return { scenario, wallets: { A, B }, contract: contract.address, spends };
}
