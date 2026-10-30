/**
 * Where each ledger version's package comes from (the `core` entry's `ledgerSources` setting). This build carries
 * vendored packages only, because the released packages lack the exports `LedgerPackage` needs. So if a version the
 * build carries has the source `released`, startup fails with `invalid-configuration` (`reason:
 * "ledger-source-unavailable"`), naming the setting. `v10` has no package in this build, so its source is not read.
 * [LG-5, CF-4, Q116; design §5.2]
 *
 * Imports no Node.js: the browser build's startup check (`browser/src/ledger/identity.ts`) uses it to reject the same
 * settings, while the Node.js check (`./identity.ts`) also checks each package's files.
 */

import { UmbraError } from "../db/errors.js";
import type { LedgerName } from "./types.js";
import { CARRIED_LEDGERS } from "./version-table.js";

/** Where a ledger version's packages come from (the `core` entry's `ledgerSources`). [CF-4] */
export type LedgerSource = "vendored" | "released";

/** The `core` entry's `ledgerSources`: each version's source, vendored unless given. */
export type LedgerSourceSettings = Readonly<Partial<Record<LedgerName, LedgerSource>>>;

/** Refuses `ledger`'s source in `sources` unless it is vendored (see the module comment). */
export function checkLedgerSource(ledger: LedgerName, sources: LedgerSourceSettings = {}): void {
  const source = sources[ledger] ?? "vendored";
  if (source === "vendored") return;
  throw new UmbraError(
    "invalid-configuration",
    `ledgerSources.${ledger} is ${source}, and this build carries the vendored ledger ${ledger} package only: the ` +
      "released packages lack the exports the ledger adapters need; set it to vendored",
    { reason: "ledger-source-unavailable", ledger, source },
  );
}

/** Refuses the source of every version the build carries unless it is vendored (see the module comment). */
export function checkLedgerSources(sources: LedgerSourceSettings = {}): void {
  for (const ledger of CARRIED_LEDGERS) checkLedgerSource(ledger, sources);
}
