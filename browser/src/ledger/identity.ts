/**
 * `src/ledger/identity.ts` in the browser build: the startup check that the process (`src/runner/process.ts`) and the
 * ledger worker's loader (`src/ledger/load.ts`) call, without its reading of files, since a browser reads none.
 * `ledgerSources` is refused as in Node.js (`src/ledger/sources.ts`: `invalid-configuration` naming the setting).
 * [LG-5, A173; design §9.2]
 *
 * The packages' bytes are checked where the browser gets them instead:
 * - `browser/build.ts` checks every file of a vendored package it bundles against the package's `SHA256SUMS`, and that
 *   manifest against the SHA-256 the build records (`LEDGER_RELEASES`), so a changed package fails the build, naming
 *   the file;
 * - the ledger worker checks the WebAssembly it fetches against its manifest line (`./instantiate.ts`).
 *
 * The bundles themselves are the page's code, which the browser takes from the page's origin as it takes any page's.
 * [design §5.2]
 */

import { checkLedgerSources, type LedgerSourceSettings } from "../../../src/ledger/sources.js";
import type { LedgerName } from "../../../src/ledger/types.js";

/** The process's startup check: each `ledgerSources` entry of a version the build carries must be `vendored`. */
export function checkLedgerPackages(options: { readonly root?: string; readonly sources?: LedgerSourceSettings } = {}): void {
  checkLedgerSources(options.sources);
}

/** The check before a version's package is imported: nothing to read here (see the module comment). */
export function checkLedgerPackage(_ledger: LedgerName, _options: { readonly root?: string } = {}): void {}
