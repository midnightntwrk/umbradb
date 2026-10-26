/**
 * The ledger v8 adapter (`openspec/changes/core-arch/design.md` §5.1; `specs/ledger/spec.md` LG-6;
 * `specs/contract-data/spec.md` CC-2; task 12.1): ledger-8.1.2, vendored in `vendor/ledger/v8`, through the shared
 * implementation of `./adapter.ts`, which carries what 0.9.5's replay decoder
 * (`chain-archive-sync/tx-replay-decoder.ts`) did for v8 transactions. A v8 `ContractLog` carries the raw logged value,
 * not a MIP-0002 event, and the v8 VM has no log decoding: `decodeLogItem` returns null for every input, and `apply`
 * reports no logs and no contract-log events (owner decision Q54), as the official indexer drops v8 contract logs. No
 * `convertFromV8`: that is v9's (LG-9).
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
