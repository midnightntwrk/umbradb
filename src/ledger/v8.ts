/**
 * The ledger v8 adapter: ledger-8.1.2, vendored in `vendor/ledger/v8`, through the shared implementation of
 * `./adapter.ts`. That implementation does what 0.9.5's replay decoder (`chain-archive-sync/tx-replay-decoder.ts`) did
 * for v8 transactions. [LG-6; design §5.1]
 *
 * A v8 `ContractLog` carries the raw logged value, not a MIP-0002 event, and the v8 VM has no log decoding. So
 * `decodeLogItem` returns null for every input, and `apply` reports no logs and no contract-log events; the official
 * indexer drops v8 contract logs too. There is no `convertFromV8`: only the v9 adapter converts a v8 state.
 * [CC-2, Q54, LG-9]
 */

import type * as V8Package from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import { createLedgerAdapter } from "./adapter.js";
import { LEDGER_RELEASES } from "./releases.js";
import type { LedgerPackage, LedgerPackageOptions } from "./types.js";

/** The v8 adapter over the loaded package (its Node.js entry, or the browser's). */
export function createV8Adapter(raw: typeof V8Package, options: LedgerPackageOptions): LedgerPackage {
  return createLedgerAdapter({
    ledger: "v8",
    release: LEDGER_RELEASES.v8,
    raw,
    networkId: options.networkId,
    decodeLogItem: () => null,
    loggedValue: null,
  });
}
