/**
 * The ledger v9 adapters (`openspec/changes/core-arch/design.md` §5.1, §5.2; `specs/ledger/spec.md` LG-3, LG-6, LG-9;
 * `specs/contract-data/spec.md` CC-2, CC-3; tasks 12.1, 12.2a), through the shared implementation of `./adapter.ts`:
 *
 * - **`v9`**: ledger-9.1.0.0-rc.5 (runtime 2.1 on), vendored in `vendor/ledger/v9` with the ledger team's v8 → v9 state
 *   translation; `convertFromV8` runs the translation on the stored v8 state (LG-9).
 * - **`v9-rc3`**: ledger-9.1.0.0-rc.3, v9 as runtime 2.0 built it (`midnight-node` 2.0.0-rc.4), vendored in
 *   `vendor/ledger/v9-rc3` (owner decision Q139 A, task 12.2a). The same adapter over the rc.3 package, whose API is
 *   the rc.5 one: what differs is the release, the package, and that it has no `convertFromV8` — the node that builds
 *   it carries no translation. Its states share rc.5's storage format: a state it stored loads in the rc.5 package with
 *   the same root, which is how a 2.0 → 2.1 upgrade carries it (the ledger worker's engine, A159).
 *
 * Both decode contract logs with the VM's own decoding (`decodeLogItem`, which the v9 patches export); `apply` reports
 * each contract log an applied segment emitted, its value in the ledger's serialization (`serializeStateValue`, the
 * input `decodeLogItem` takes).
 */

import type * as V9Rc3Package from "../../vendor/ledger/v9-rc3/pkg/midnight_ledger_wasm_v9_fs.js";
import type * as V9Package from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { type AdapterSpec, createLedgerAdapter } from "./adapter.js";
import { LEDGER_RELEASES } from "./releases.js";
import type { LedgerPackage, LedgerPackageOptions } from "./types.js";

/** What a v9 package needs for its contract logs: the VM's decoding and the serialization of a logged value. */
type V9Logs = Pick<typeof V9Package, "decodeLogItem" | "StateValue" | "serializeStateValue">;

/** The contract-log half of a v9 adapter's spec (both packages: the same exports). */
function v9Logs(raw: V9Logs): Pick<AdapterSpec, "decodeLogItem" | "loggedValue"> {
  return {
    decodeLogItem: (value) => raw.decodeLogItem(value),
    loggedValue: (data) => {
      const value = raw.StateValue.decode(data as V9Package.EncodedStateValue);
      const serialized = raw.serializeStateValue(value);
      (value as unknown as { free(): void }).free();
      return serialized;
    },
  };
}

/** The v9 adapter over the loaded rc.5 package (its Node.js entry, or the browser's). */
export function createV9Adapter(raw: typeof V9Package, options: LedgerPackageOptions): LedgerPackage {
  return createLedgerAdapter({
    ledger: "v9",
    release: LEDGER_RELEASES.v9,
    raw,
    networkId: options.networkId,
    ...v9Logs(raw),
    convertFromV8: (v8StateKey, store) => raw.convertFromV8(v8StateKey, store),
  });
}

/** The v9-rc3 adapter over the loaded rc.3 package: the v9 adapter without `convertFromV8` (see the header). */
export function createV9Rc3Adapter(raw: typeof V9Rc3Package, options: LedgerPackageOptions): LedgerPackage {
  return createLedgerAdapter({
    ledger: "v9-rc3",
    release: LEDGER_RELEASES["v9-rc3"],
    raw,
    networkId: options.networkId,
    ...v9Logs(raw as unknown as V9Logs),
  });
}
