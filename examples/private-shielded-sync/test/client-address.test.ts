/**
 * The wallet's three addresses (phase 12), made by the example's own code (`client/address.ts`, `client/keys.ts`
 * `walletAddresses`, the vendored ledger 9 build) as the page's worker and the command line's `address` make them,
 * against the wallet SDK's for the same seeds: its address codecs (`@midnightntwrk/wallet-sdk-address-format`) over keys
 * the SDK's ledger package (`@midnightntwrk/ledger-v9`) derives, and, for the unshielded (Night) address, the SDK's
 * own key store (`createKeystore`, as the SDK's unshielded wallet makes its address). The seeds come from the SDK's HD
 * derivation of BIP-39 mnemonics (`client/sdk/seeds.ts`): the public test vector and a new random one. Runs with the
 * client's install (`npm ci --ignore-scripts --prefix examples/private-shielded-sync/client`).
 */

import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { bech32mDecode, formatDustAddress, formatUnshieldedAddress } from "../client/address.ts";
import { keysFromZswapSeed, nightAddress, walletAddresses } from "../client/keys.ts";
import type { Ledger } from "../client/ledger.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";

const installed = existsSync(new URL("../client/node_modules/@midnightntwrk/wallet-sdk-address-format/package.json", import.meta.url));
const L = ledger as unknown as Ledger;
const sdk = (path: string) => import(new URL(`../client/node_modules/${path}`, import.meta.url).href);

describe.skipIf(!installed)("the wallet's addresses equal the wallet SDK's (phase 12)", () => {
  it("shielded, Dust and unshielded (Night), on Preprod, mainnet and a local network, for two mnemonics", { timeout: 60_000 }, async () => {
    const { seedsFromMnemonic } = await import(new URL("../client/sdk/seeds.ts", import.meta.url).href);
    const { generateMnemonic } = await sdk("@scure/bip39/index.js");
    const { wordlist } = await sdk("@scure/bip39/wordlists/english.js");
    const format = await sdk("@midnightntwrk/wallet-sdk-address-format/dist/index.js");
    const sdkLedger = await sdk("@midnightntwrk/ledger-v9/midnight_ledger_wasm_v9.js");
    const { createKeystore } = await sdk("@midnightntwrk/wallet-sdk-unshielded-wallet/dist/v2/index.js");
    const kernel = new Kernel(compileKernel());
    // BIP-39's public test vector and a new random mnemonic: neither is a wallet anyone holds.
    for (const mnemonic of [`${"abandon ".repeat(23)}art`, generateMnemonic(wordlist, 256) as string]) {
      const seeds = seedsFromMnemonic(mnemonic) as { shielded: Uint8Array; unshielded: Uint8Array; dust: Uint8Array };
      for (const network of ["preprod", "mainnet", "undeployed"]) {
        const ours = walletAddresses(L, { keys: keysFromZswapSeed(L, seeds.shielded, kernel), dustSeed: seeds.dust, nightSeed: seeds.unshielded, network });
        // The SDK's: keys from its ledger package, its codecs, its key store.
        const zswap = sdkLedger.ZswapSecretKeys.fromSeed(seeds.shielded);
        const shielded = new format.ShieldedAddress(
          new format.ShieldedCoinPublicKey(Buffer.from(zswap.coinPublicKey, "hex")),
          new format.ShieldedEncryptionPublicKey(Buffer.from(zswap.encryptionPublicKey, "hex")),
        );
        const dustKey = sdkLedger.DustSecretKey.fromSeed(seeds.dust);
        const expected = {
          network,
          shielded: format.ShieldedAddress.codec.encode(network, shielded).asString(),
          dust: format.DustAddress.encodePublicKey(network, dustKey.publicKey),
          unshielded: createKeystore({ kind: "schnorr", secret: seeds.unshielded }, network).getBech32Address().asString(),
        };
        expect(ours, `${network}`).toEqual(expected);
        const segment = network === "mainnet" ? "" : `_${network}`;
        expect([ours.shielded.startsWith(`mn_shield-addr${segment}1`), ours.dust!.startsWith(`mn_dust${segment}1`), ours.unshielded!.startsWith(`mn_addr${segment}1`)]).toEqual([true, true, true]);
        // And they decode back with the SDK's parser to the same keys.
        expect(format.MidnightBech32m.parse(ours.dust!).decode(format.DustAddress, network).data).toBe(dustKey.publicKey);
        expect(format.MidnightBech32m.parse(ours.unshielded!).decode(format.UnshieldedAddress, network).hexString).toBe(nightAddress(L, seeds.unshielded));
        dustKey.clear?.();
      }
    }
  });

  it("the Dust address's payload is the SCALE compact encoding of the key at every length; a Zswap seed alone gives the shielded address only", async () => {
    const format = await sdk("@midnightntwrk/wallet-sdk-address-format/dist/index.js");
    for (const key of [0n, 63n, 64n, 16_383n, 16_384n, (1n << 30n) - 1n, 1n << 30n, (1n << 32n) - 1n, 1n << 200n, format.BLSScalar.modulus - 1n]) {
      expect(formatDustAddress(key, "preprod"), String(key)).toBe(format.DustAddress.encodePublicKey("preprod", key));
      expect(Buffer.from(bech32mDecode(formatDustAddress(key, "preprod")).data).equals(format.ScaleBigInt.encode(key))).toBe(true);
    }
    expect(() => formatUnshieldedAddress("ab", "preprod")).toThrow("32 bytes");
    const a = walletAddresses(L, { keys: keysFromZswapSeed(L, new Uint8Array(32).fill(7), new Kernel(compileKernel())), dustSeed: null, nightSeed: null, network: "preprod" });
    expect([a.dust, a.unshielded]).toEqual([null, null]);
    expect(a.shielded).toMatch(/^mn_shield-addr_preprod1/);
  });
});
