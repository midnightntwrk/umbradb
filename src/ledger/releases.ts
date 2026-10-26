/**
 * The ledger releases this build carries (`openspec/changes/core-arch/specs/ledger/spec.md` LG-5, LG-6; `design.md`
 * §5.2; task 12.1): per ledger version, the release its packages were built from (`versionName`) and each package's
 * name and version, as `vendor/ledger/<version>/upstream.json` and the package's own `package.json` record them
 * (`test/ledger/adapter-checks.ts` holds them equal). Constants, not read from those files, because the adapters also
 * run where no file can be read (the browser build, task 16.1). Task 12.2 adds each package's SHA-256 to the core
 * version (CF-2) and checks it at startup (`package-hash-mismatch`).
 */

/** A WASM package of a ledger release. */
export interface LedgerReleasePackage {
  readonly name: string;
  readonly version: string;
}

/** A ledger release: its name and its packages. */
export interface LedgerRelease {
  readonly versionName: string;
  readonly packages: readonly LedgerReleasePackage[];
}

/** The release of each ledger version this build carries. */
export const LEDGER_RELEASES = Object.freeze({
  v8: Object.freeze({
    versionName: "ledger-8.1.2",
    packages: Object.freeze([Object.freeze({ name: "@umbradb/vendored-ledger-v8", version: "8.1.2" })]),
  }),
  v9: Object.freeze({
    versionName: "ledger-9.1.0.0-rc.5",
    packages: Object.freeze([Object.freeze({ name: "@umbradb/vendored-ledger-v9", version: "1.0.0-rc.5" })]),
  }),
}) satisfies Readonly<Record<"v8" | "v9", LedgerRelease>>;
