/**
 * Where each ledger version's package comes from (`openspec/changes/core-arch/specs/ledger/spec.md` LG-5; CF-4's
 * `ledgerSources`; `design.md` §5.2; question Q116; tasks 12.2, 12.2b): this build carries vendored packages only, so a
 * version the build carries whose source is `released` refuses startup with `invalid-configuration` (`reason:
 * "ledger-source-unavailable"`) naming the setting — the released packages lack the exports `LedgerPackage` needs.
 * `v10` has no package in this build, so its source is not read.
 *
 * Imports no Node.js: the browser build's startup check (`browser/src/ledger/identity.ts`) refuses the same settings
 * with it, while Node.js's (`./identity.ts`) also checks each package's files.
 */

import { UmbraError } from "../db/errors.js";
import type { LedgerName } from "./types.js";
import { CARRIED_LEDGERS } from "./version-table.js";

/** Where a ledger version's packages come from (CF-4's `ledgerSources`). */
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
      "released packages lack the exports the ledger adapters need (LG-5, design.md section 5.2); set it to vendored",
    { reason: "ledger-source-unavailable", ledger, source },
  );
}

/** Refuses the source of every version the build carries unless it is vendored (see the module comment). */
export function checkLedgerSources(sources: LedgerSourceSettings = {}): void {
  for (const ledger of CARRIED_LEDGERS) checkLedgerSource(ledger, sources);
}
