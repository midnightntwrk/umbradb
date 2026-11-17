/**
 * The ledger releases this build carries. For each ledger version: the release its packages were built from
 * (`versionName`), and the name, version and SHA-256 of its one package. These match what
 * `vendor/ledger/<version>/upstream.json`, the package's own `package.json` and its manifest `SHA256SUMS` record
 * (`test/ledger/adapter-checks.ts` and `test/ledger/package-identity.test.ts` keep them equal). They are constants, not
 * read from those files, because the adapters and the core version (`../config/build.ts`) also run where no file can be
 * read (the browser build).
 *
 * A package's `sha256` is the SHA-256 of its manifest, which lists every file of the package with its own SHA-256;
 * `./identity.ts` checks the files against it at startup (`package-hash-mismatch`). When
 * `npm run vendor:ledger -- --record` rewrites a manifest, its constant here changes with it, and so does the core
 * version, which the configuration history records for every `core` revision.
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
        sha256: "0x10f2c55b3e664cd52995d29c29e487351700c4f42513ba3d6471ba4c48ca9d6c",
      }),
    ] as const),
  }),
  // Ledger v9 as runtime 2.0 built it (`midnight-node` 2.0.0-rc.4: `crate-ledger-9.1.0.0-rc.3`), a package of its own.
  "v9-rc3": Object.freeze({
    versionName: "ledger-9.1.0.0-rc.3",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v9-rc3",
        version: "1.0.0-rc.3",
        sha256: "0x7439b543010b63ee079d19af77d628e69295caf9f770bdd15a442a0f93467241",
      }),
    ] as const),
  }),
  // Ledger v9 as runtime 2.1.0 built it (`midnight-node` 2.1.0-rc.4: `crate-ledger-9.1.0.0-rc.5`), a package of its own.
  "v9-rc5": Object.freeze({
    versionName: "ledger-9.1.0.0-rc.5",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v9-rc5",
        version: "1.0.0-rc.5",
        sha256: "0x12df0531e2b9f6d48196b956b4a8e3cb090358809e15c7b06cc49ffc78bed4bd",
      }),
    ] as const),
  }),
  // Ledger v9 as runtime 2.1.100 builds it (`midnight-node` 2.1.101: `midnight-ledger-v9` 1.0.1, `ledger-9.1.0.1`).
  v9: Object.freeze({
    versionName: "ledger-9.1.0.1",
    packages: Object.freeze([
      Object.freeze({
        name: "@umbradb/vendored-ledger-v9",
        version: "1.0.1",
        sha256: "0xaf2cfeff5f0f9c5569ad7e5e38b781ee77349a04af36f9eee8600b5a5c6e246a",
      }),
    ] as const),
  }),
}) satisfies Readonly<Record<"v8" | "v9-rc3" | "v9-rc5" | "v9", LedgerRelease>>;
