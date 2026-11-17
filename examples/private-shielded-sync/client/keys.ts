/**
 * The wallet's shielded keys (spec FR-090, FR-091).
 *
 * The Zswap seed comes from the wallet's 24-word mnemonic (BIP-39 seed with no passphrase, then the wallet SDK's
 * `HDWallet` at `m/44'/2400'/0'/3/0`; `sdk/seeds.ts`) or, in tests, from a fixed 32-byte seed. `ZswapSecretKeys.fromSeed`
 * gives the keys. The encryption secret key's scalar, which only the local scan kernel takes, is read from the ledger
 * package's explicit serialization and checked against the package's own encryption public key.
 */

import { type Kernel, encryptionSecretKeyScalar } from "../kernel/index.ts";
import { equalBytes, fromHex, toHex } from "../shared/index.ts";
import { formatDustAddress, formatShieldedAddress, formatUnshieldedAddress } from "./address.ts";
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

/**
 * The user address (32 bytes, hex) of the Night signing key made from a wallet's Night seed (HD role 0, the SDK's
 * `WalletSeeds.unshielded`), as the SDK's unshielded key store makes it: a Schnorr signing key whose value is the seed,
 * its verifying key, the ledger's `addressFromKey`.
 */
export function nightAddress(ledger: Ledger, nightSeed: Uint8Array): string {
  if (nightSeed.length !== 32) throw new Error("a Night seed is 32 bytes");
  return ledger.addressFromKey(ledger.signatureVerifyingKey({ tag: "schnorr", value: toHex(nightSeed) }));
}

/** A wallet's three addresses; the Dust and unshielded ones only from a mnemonic's seeds (a Zswap seed has neither). */
export interface WalletAddresses {
  readonly network: string;
  readonly shielded: string;
  readonly dust: string | null;
  readonly unshielded: string | null;
}

export function walletAddresses(ledger: Ledger, o: { readonly keys: WalletKeys; readonly dustSeed: Uint8Array | null; readonly nightSeed: Uint8Array | null; readonly network: string }): WalletAddresses {
  let dust: string | null = null;
  if (o.dustSeed !== null) {
    const key = ledger.DustSecretKey.fromSeed(o.dustSeed);
    try {
      dust = formatDustAddress(key.publicKey, o.network);
    } finally {
      key.clear();
    }
  }
  return {
    network: o.network,
    shielded: formatShieldedAddress({ coinPublicKey: toHex(o.keys.coinPublicKey), encryptionPublicKey: toHex(o.keys.encryptionPublicKey) }, o.network),
    dust,
    unshielded: o.nightSeed === null ? null : formatUnshieldedAddress(nightAddress(ledger, o.nightSeed), o.network),
  };
}
