/**
 * The ledger v9 adapter (`openspec/changes/core-arch/design.md` §5.1, §5.2; `specs/ledger/spec.md` LG-6, LG-9;
 * `specs/contract-data/spec.md` CC-2, CC-3; task 12.1): ledger-9.1.0.0-rc.5, vendored in `vendor/ledger/v9` with the
 * ledger team's v8 → v9 state translation, through the shared implementation of `./adapter.ts`. Its `decodeLogItem`
 * is the VM's own decoding (`decodeLogItem`, which the v9 patches export); `apply` reports each contract log an
 * applied segment emitted, its value in the ledger's serialization (`serializeStateValue`, the input `decodeLogItem`
 * takes); and `convertFromV8` runs the translation on the stored v8 state (LG-9).
 */

import type * as V9Package from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { createLedgerAdapter } from "./adapter.js";
import { LEDGER_RELEASES } from "./releases.js";
import type { LedgerPackage, LedgerPackageOptions } from "./types.js";

/** The v9 adapter over the loaded package (its Node.js entry, or the browser's). */
export function createV9Adapter(raw: typeof V9Package, options: LedgerPackageOptions): LedgerPackage {
  return createLedgerAdapter({
    ledger: "v9",
    release: LEDGER_RELEASES.v9,
    raw,
    networkId: options.networkId,
    decodeLogItem: (value) => raw.decodeLogItem(value),
    loggedValue: (data) => {
      const value = raw.StateValue.decode(data as V9Package.EncodedStateValue);
      const serialized = raw.serializeStateValue(value);
      (value as unknown as { free(): void }).free();
      return serialized;
    },
    convertFromV8: (v8StateKey, store) => raw.convertFromV8(v8StateKey, store),
  });
}
