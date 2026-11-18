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
        sha256: "0x36f5d7e2761279f94e0884b63600677552438324c181212b025d5961b2d1a990",
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
        sha256: "0x21afac0bee90137b973a84d30d5b25dcae86aa8d368f24b1d58bf19acf8174ba",
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
        sha256: "0xdbe08c97f4fa506d088ad4a780d20b8e78e178228e9adff14ac84fe2ee883413",
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
        sha256: "0x58b81bbff16e775afe93170c3118b7a7ad847d3c8801b50970eeb81e25b8c1ac",
      }),
    ] as const),
  }),
}) satisfies Readonly<Record<"v8" | "v9-rc3" | "v9-rc5" | "v9", LedgerRelease>>;
