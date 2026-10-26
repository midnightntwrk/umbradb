/**
 * The ledger releases this build carries (`openspec/changes/core-arch/specs/ledger/spec.md` LG-5, LG-6; `design.md`
 * §5.2; tasks 12.1, 12.2): per ledger version, the release its packages were built from (`versionName`) and its one
 * package's name, version and SHA-256, as `vendor/ledger/<version>/upstream.json`, the package's own `package.json`
 * and its manifest `SHA256SUMS` record them (`test/ledger/adapter-checks.ts` and `test/ledger/package-identity.test.ts`
 * hold them equal). Constants, not read from those files, because the adapters and the core version (CF-2,
 * `../config/build.ts`) also run where no file can be read (the browser build, task 16.1).
 *
 * A package's `sha256` is the SHA-256 of its manifest, which lists every file of the package with its own SHA-256
 * (`./identity.ts`, which checks the files against it at startup: `package-hash-mismatch`). When
 * `npm run vendor:ledger -- --record` rewrites a manifest, its constant here changes with it — and so does the core
 * version, which the configuration history records for every `core` revision (CF-7, CF-8).
 */

/** A WASM package of a ledger release, identified by its manifest's SHA-256 (`0x`-prefixed lowercase hex). */
export interface LedgerReleasePackage {
  readonly name: string;
  readonly version: string;
  readonly sha256: string;
}

/** A ledger release: its name and its one package. */
export interface LedgerRelease {
  readonly versionName: string;
  readonly packages: readonly [LedgerReleasePackage];
}

/** The release of each ledger version this build carries. */
export const LEDGER_RELEASES = Object.freeze({
  v8: Object.freeze({
    versionName: "ledger-8.1.2",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v8",
        version: "8.1.2",
        sha256: "0x693819c6bb7e38d875919a5e9feefe0769a25c7c0b6bf7414eb784960eff6a61",
      }),
    ] as const),
  }),
  v9: Object.freeze({
    versionName: "ledger-9.1.0.0-rc.5",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v9",
        version: "1.0.0-rc.5",
        sha256: "0xdbf4d86c2a1be3bf3e5b0c282af2d160d0f775f6704f75b46e2496fbdf2028bc",
      }),
    ] as const),
  }),
}) satisfies Readonly<Record<"v8" | "v9", LedgerRelease>>;
