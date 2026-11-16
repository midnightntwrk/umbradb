/**
 * The PIR schemes a wallet can call (`./scheme.ts`), for the command line and the page's worker alike. A manifest
 * naming a scheme not listed here stops the wallet with {@link SchemeUnavailable}, whose message names it.
 *
 * To add a scheme: write its `WalletSchemeEntry` (its `open` may instantiate a WebAssembly module, and must work in a
 * browser worker) and list it in `SCHEMES`.
 */

import { isSchemeName, type SchemeName, SchemeUnavailable, type WalletScheme, type WalletSchemeEntry, type WalletSchemeOptions } from "./scheme.ts";
import { SIMPLEPIR_WALLET } from "./simplepir-wallet.ts";
import type { Manifest } from "../shared/manifest.ts";

const SCHEMES: { readonly [S in SchemeName]?: WalletSchemeEntry } = {
  simplepir: SIMPLEPIR_WALLET,
};

/** Opens the snapshot's scheme for the wallet; throws {@link SchemeUnavailable} when this build does not have it. */
export function openWalletScheme(manifest: Pick<Manifest, "scheme" | "pir">, options: WalletSchemeOptions = {}): Promise<WalletScheme> {
  const entry = isSchemeName(manifest.scheme) ? SCHEMES[manifest.scheme] : undefined;
  if (entry === undefined) return Promise.reject(new SchemeUnavailable(manifest.scheme, "the snapshot uses it and this wallet has no implementation of it"));
  return entry.open(manifest, options);
}
