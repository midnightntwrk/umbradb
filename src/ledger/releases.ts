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

/** The release of each ledger version this build carries, in release order (the core version lists them so). */
export const LEDGER_RELEASES = Object.freeze({
  v8: Object.freeze({
    versionName: "ledger-8.1.2",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v8",
        version: "8.1.2",
        sha256: "0x9c016702dcb1dd3645fd00c2eaf26923f8eed959d82a2d3037e50564438505f5",
      }),
    ] as const),
  }),
  // Ledger v9 as runtime 2.0 built it (`midnight-node` 2.0.0-rc.4: `crate-ledger-9.1.0.0-rc.3`), a package of its own
  // (owner decision Q139 A, task 12.2a).
  "v9-rc3": Object.freeze({
    versionName: "ledger-9.1.0.0-rc.3",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v9-rc3",
        version: "1.0.0-rc.3",
        sha256: "0x7e77e5a376361ccca2285666ba5615a2edeb4757d2722cb1356091f290608c3c",
      }),
    ] as const),
  }),
  v9: Object.freeze({
    versionName: "ledger-9.1.0.0-rc.5",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v9",
        version: "1.0.0-rc.5",
        sha256: "0xd70c497117dc1a89aa037011ba4d24abbda67c1009c94ff0c39c0a9c2bf57cc9",
      }),
    ] as const),
  }),
}) satisfies Readonly<Record<"v8" | "v9-rc3" | "v9", LedgerRelease>>;
