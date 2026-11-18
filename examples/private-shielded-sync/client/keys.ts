/**
 * The wallet's shielded keys (spec FR-090, FR-091).
 *
 * The Zswap seed comes from the wallet's 24-word mnemonic (BIP-39 seed with no passphrase, then the wallet SDK's
 * `HDWallet` at `m/44'/2400'/0'/3/0`; `sdk/seeds.ts`) or, in tests, from a fixed 32-byte seed. `ZswapSecretKeys.fromSeed`
 * gives the keys. The encryption secret key's scalar, which only the local scan kernel takes, is read from the ledger
 * package's explicit serialization and checked against the package's own encryption public key.
 */

import { type Kernel, encryptionSecretKeyScalar } from "../kernel/index.ts";
import { equalBytes, fromHex } from "../shared/index.ts";
import type { Ledger, ZswapSecretKeys } from "./ledger.ts";

/** What the client holds of a wallet. Never logged, never sent. */
export interface WalletKeys {
  readonly zswap: ZswapSecretKeys;
  /** 32 bytes. */
  readonly coinPublicKey: Uint8Array;
  /** 32 bytes, compressed. */
  readonly encryptionPublicKey: Uint8Array;
  /** The encryption secret key's scalar, 32 bytes little-endian: for the scan kernel only (FR-091). */
  readonly scanSecret: Uint8Array;
}

/** The keys of a Zswap seed (32 bytes). */
export function keysFromZswapSeed(ledger: Ledger, seed: Uint8Array, kernel: Kernel): WalletKeys {
  if (seed.length !== 32) throw new Error("a Zswap seed is 32 bytes");
  return walletKeys(ledger.ZswapSecretKeys.fromSeed(seed), kernel);
}

/** The client's view of ledger keys; refuses keys whose serialized secret does not give their public key. */
export function walletKeys(zswap: ZswapSecretKeys, kernel: Kernel): WalletKeys {
  const scanSecret = encryptionSecretKeyScalar(zswap.encryptionSecretKey.yesIKnowTheSecurityImplicationsOfThis_serialize());
  const encryptionPublicKey = fromHex(zswap.encryptionPublicKey, 32);
  if (!equalBytes(kernel.publicKey(scanSecret), encryptionPublicKey)) {
    throw new Error("the encryption secret key's scalar does not give the package's encryption public key");
  }
  return { zswap, coinPublicKey: fromHex(zswap.coinPublicKey, 32), encryptionPublicKey, scanSecret };
}
