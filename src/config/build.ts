/**
 * The build's own version (`openspec/changes/core-arch/specs/configuration/spec.md` CF-2, CF-8; `specs/ledger/spec.md`
 * LG-5; CORE-ARCH §4.12): the core version `coreEntry` fills in, which the configuration history records for every
 * `core` revision (CF-7) and the version check compares (CF-8, task 4.3). A build carries one version of UmbraDB and of
 * each ledger package (decision record Q43).
 *
 * The UmbraDB version is a constant, not read from `package.json` at run time, because `coreEntry` also runs where no
 * file can be read — in the browser build the configuration is bundled into the page (CORE-ARCH §4.12) — and
 * `test/config/builders.test.ts` holds it equal to `package.json`'s `version`.
 */

/** A ledger major version (LG-1). */
export type LedgerName = "v8" | "v9" | "v10";

/** One WASM package of a ledger version, identified by its content hash (LG-5). */
export type LedgerPackageIdentity = {
  readonly name: string;
  readonly version: string;
  /** SHA-256 of the package, `0x`-prefixed lowercase hex. */
  readonly sha256: string;
};

/** A ledger version the build carries: its release name and its packages (LG-5, LG-6's `versionName`). */
export type CoreLedgerVersion = {
  readonly ledger: LedgerName;
  readonly versionName: string;
  readonly packages: readonly LedgerPackageIdentity[];
};

/**
 * The core version (CF-2; CORE-ARCH §4.12): the UmbraDB version and, per ledger version the build carries, its release
 * name and packages. The `core` entry's `version`.
 */
export type CoreVersion = {
  readonly umbradb: string;
  readonly ledgers: readonly CoreLedgerVersion[];
};

/** This build's UmbraDB version: `package.json`'s `version`. */
export const UMBRADB_VERSION = "0.9.5";

/**
 * This build's core version, as a new plain object at every call (so that no caller's change reaches another's). Its
 * `ledgers` lists the ledger versions the build carries, one item each (LG-5): none yet — the `LedgerPackage` adapters
 * and their package identities are tasks 12.1 and 12.2, which add them here, copied at every call as well.
 */
export function buildCoreVersion(): CoreVersion {
  return { umbradb: UMBRADB_VERSION, ledgers: [] };
}
