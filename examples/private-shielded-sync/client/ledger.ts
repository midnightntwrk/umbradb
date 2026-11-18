/**
 * The Midnight ledger package the client runs on (ledger 9, release `ledger-9.1.0.1`, the one Preprod's node 2.1.101
 * runs).
 *
 * The command line loads `@midnightntwrk/ledger-v9` 1.0.1 from the client's own `node_modules`
 * (`client/package.json`, installed on demand; never a dependency of the umbradb package). The tests hand the client
 * the repository's vendored build of the same release (`vendor/ledger/v9`, which only adds exports), so they run
 * without that install. Both expose the same classes; the client is written against the vendored declarations, which
 * the repository's type check can always see.
 */

import type * as V9 from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import type * as V8 from "../../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";

/** The ledger 9 package's API, as the client uses it. */
export type Ledger = typeof V9;
/** The ledger 8 package's API (only the cross-check replays ledger 8 events with it). */
export type LedgerV8 = typeof V8;

export type ZswapSecretKeys = V9.ZswapSecretKeys;
export type ShieldedCoinInfo = V9.ShieldedCoinInfo;
export type ZswapLocalState = V9.ZswapLocalState;

/** Loads `@midnightntwrk/ledger-v9` from the client's install (`npm ci --prefix examples/private-shielded-sync/client`). */
export async function loadLedger(): Promise<Ledger> {
  try {
    return (await import("@midnightntwrk/ledger-v9" as string)) as Ledger;
  } catch (cause) {
    throw new Error(
      "the client's packages are not installed: run `npm ci --ignore-scripts --prefix examples/private-shielded-sync/client`",
      { cause },
    );
  }
}

/** Loads `@midnightntwrk/ledger-v8` from the client's install (for the cross-check of ledger 8 heights). */
export async function loadLedgerV8(): Promise<LedgerV8> {
  return (await import("@midnightntwrk/ledger-v8" as string)) as LedgerV8;
}
