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
        sha256: "0xb193681813bcc22d7789d4060b0c578ae1c9fcd47be5f4d0760e1b23a240a775",
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
        sha256: "0xeafe8b0053c08858775df53932d3632e64ee8f09d7f420fcd86856eee93f2e6e",
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
        sha256: "0x8aa03dda19b5128b10e09ec577a9b507d9b6ed0d6440737f809292e46c02b54b",
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
        sha256: "0xaf06a8968d47773b1bf5f586ac155dd2c195502d7c7529d49edabdf646ca70dc",
      }),
    ] as const),
  }),
}) satisfies Readonly<Record<"v8" | "v9-rc3" | "v9-rc5" | "v9", LedgerRelease>>;
