/**
 * Wallet seeds from a 24-word mnemonic (spec FR-090): BIP-39 seed with no passphrase, then the wallet SDK's `HDWallet`
 * at `m/44'/2400'/0'/role/0` (role 3 Zswap, 0 Night, 2 Dust; `WalletSeeds.fromMasterSeed`). The network does not enter
 * the derivation. Needs the client's install (`@scure/bip39`, `@midnightntwrk/wallet-sdk`).
 */

import { mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { WalletSeeds } from "@midnightntwrk/wallet-sdk/hd";

export type Seeds = WalletSeeds;

/** The three seeds of a mnemonic. The master seed is wiped before this returns. */
export function seedsFromMnemonic(mnemonic: string): Seeds {
  const words = mnemonic.trim().split(/\s+/).join(" ");
  if (!validateMnemonic(words, wordlist)) throw new Error("the mnemonic is not a valid BIP-39 phrase");
  const master = mnemonicToSeedSync(words);
  try {
    return WalletSeeds.fromMasterSeed(master);
  } finally {
    master.fill(0);
  }
}
