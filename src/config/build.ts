/**
 * The build's own version: the core version that `coreEntry` fills in. The configuration history records it for every
 * `core` revision, and the version check compares it. A build carries one version of UmbraDB and of each ledger
 * package. [CF-2, CF-7, CF-8, LG-5, Q43; CORE-ARCH §4.12]
 *
 * The UmbraDB version is a constant, not read from `package.json` at run time, because `coreEntry` also runs where no
 * file can be read: in the browser build, the configuration is bundled into the page. `test/config/builders.test.ts`
 * keeps it equal to `package.json`'s `version`. The ledger versions are the releases of `../ledger/releases.ts`,
 * constants for the same reason. Each package is identified by the SHA-256 of its manifest, and `../ledger/identity.ts`
 * checks the files against it at startup. [CORE-ARCH §4.12]
 */

import { LEDGER_RELEASES } from "../ledger/releases.js";

/**
 * A ledger version: a major version, or `v9-rc3`, which is ledger v9 as runtime 2.0 built it (`ledger-9.1.0.0-rc.3`, a
 * package of its own). `v9` is the rc.5 release that runtime 2.1 builds. [LG-1, Q139 A]
 */
export type LedgerName = "v8" | "v9-rc3" | "v9" | "v10";

/** One WASM package of a ledger version, identified by its content hash. [LG-5] */
export type LedgerPackageIdentity = {
  readonly name: string;
  readonly version: string;
  /** SHA-256 of the package, `0x`-prefixed lowercase hex. */
  readonly sha256: string;
};

/** A ledger version the build carries: its release name (`versionName`) and its packages. [LG-5, LG-6] */
export type CoreLedgerVersion = {
  readonly ledger: LedgerName;
  readonly versionName: string;
  readonly packages: readonly LedgerPackageIdentity[];
};

/**
 * The core version, which is the `core` entry's `version`: the UmbraDB version and, for each ledger version the build
 * carries, its release name and packages. [CF-2; CORE-ARCH §4.12]
 */
export type CoreVersion = {
  readonly umbradb: string;
  readonly ledgers: readonly CoreLedgerVersion[];
};

/** This build's UmbraDB version: `package.json`'s `version`. */
export const UMBRADB_VERSION = "0.10.0";

/**
 * This build's core version, as a new plain object at every call, so no caller's change reaches another's.
 *
 * Its `ledgers` lists the ledger versions the build carries, one item each, in version order: v8, then v9 as runtime
 * 2.0 built it (rc.3), then v9 (rc.5). Each item has the release name of its adapter (`versionName`) and each package's
 * name, version and SHA-256. [LG-5, LG-6]
 *
 * A build that changes a ledger package is a new core version. An existing database then needs a `versionEntry` for
 * the old one and a revision starting above the cursor. [CF-8, Q43]
 */
export function buildCoreVersion(): CoreVersion {
  return {
    umbradb: UMBRADB_VERSION,
    ledgers: (Object.keys(LEDGER_RELEASES) as (keyof typeof LEDGER_RELEASES)[]).map((ledger) => ({
      ledger,
      versionName: LEDGER_RELEASES[ledger].versionName,
      packages: LEDGER_RELEASES[ledger].packages.map(({ name, version, sha256 }) => ({ name, version, sha256 })),
    })),
  };
}
