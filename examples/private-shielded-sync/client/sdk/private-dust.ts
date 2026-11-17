/**
 * The proof and the validation of a transfer whose fee the wallet paid itself with its privately synced Dust coin (spec
 * 00062 phase 9, `send --dust-fee private`), with the wallet SDK's own pieces and none of its indexer-fed wallets:
 *
 * - proving at the local proof server, as the SDK's proving service does (`HttpProverClient.proveTransaction` with
 *   ledger 9's initial cost model, then `bind`); FR-126: the Dust spend's proof input holds the Dust secret key, so the
 *   prover must be on this machine (the caller checks the address);
 * - validation with the SDK's own check (`Capabilities.v9WellFormedCheck`, what `WalletFacade.validateTransaction`
 *   runs): well-formed against a blank ledger state holding the ledger parameters in force, balancing, signatures and
 *   limits enforced. The parameters are the module's (`/dust/parameters`, from the core's `ledger-state` item), where
 *   the SDK fetches the latest block's from the indexer.
 *
 * Submission is `./fee-wallet.ts` `submitFinalized`, the same as the SDK fee's.
 */

import * as ledger from "@midnightntwrk/ledger-v9";
import { Capabilities, HttpProverClient } from "@midnightntwrk/wallet-sdk";
import { describe } from "./fee-wallet.ts";

export interface Proven {
  readonly txHash: string;
  readonly identifiers: readonly string[];
  /** The finalized transaction (proven and bound), serialized: what submission sends. */
  readonly bytes: Uint8Array;
  readonly validation: "ok";
  readonly timings: { readonly proveMs: number; readonly validateMs: number };
}

/** Proves `unproven` (serialized, its fee already paid) at `proofServer`, binds it and validates it as the SDK does. */
export async function proveAndValidate(
  unproven: Uint8Array,
  options: { readonly network: string; readonly proofServer: string; readonly ledgerParameters: Uint8Array; readonly now?: Date; readonly log?: (line: string) => void },
): Promise<Proven> {
  const log = options.log ?? (() => {});
  const tx = ledger.Transaction.deserialize<ledger.SignatureEnabled, ledger.PreProof, ledger.PreBinding>("signature", "pre-proof", "pre-binding", unproven);
  let t = performance.now();
  const proven = await new HttpProverClient({ url: options.proofServer }).proveTransaction(tx, ledger.CostModel.initialCostModel());
  const finalized = proven.bind();
  const proveMs = performance.now() - t;
  log(`proof: proved at ${options.proofServer} and bound in ${Math.round(proveMs)} ms`);
  t = performance.now();
  try {
    Capabilities.v9WellFormedCheck(finalized, {
      networkId: options.network,
      ledgerParameters: ledger.LedgerParameters.deserialize(options.ledgerParameters),
      flags: { enforceBalancing: true, verifySignatures: true, enforceLimits: true },
      now: options.now ?? new Date(),
    });
  } catch (error) {
    throw new Error(`the transaction failed validation: ${describe(error)}`, { cause: error });
  }
  const validateMs = performance.now() - t;
  log(`validated in ${Math.round(validateMs)} ms`);
  return { txHash: finalized.transactionHash(), identifiers: finalized.identifiers(), bytes: finalized.serialize(), validation: "ok", timings: { proveMs, validateMs } };
}
