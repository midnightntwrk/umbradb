# UmbraDB third-party component inventory (SBOM)

Every third-party component UmbraDB depends on, grouped by ecosystem. Grounded in the real
manifests in this repo (paths cited per section). The **Pinning** column records *how* each
component is fixed — this is the security signal: `sha256` / image `@sha256:` digest / exact git
`rev` are tamper-evident; a semver `range` or a floating git `ref` is not (the resolved version or
locked rev is the real pin behind a range).

- **Project license:** Apache-2.0 (`LICENSE`, `NOTICE` — Copyright 2026 Charles Hoskinson).
- **npm totals:** 19 direct (5 runtime + 14 dev) · **307 packages total** in `package-lock.json`
  (lockfileVersion 3) · **307/307 resolved from `registry.npmjs.org` with a `sha512` integrity
  hash** · 5 packages declare an install script (all dev/optional — see npm-dev note).
- **Nix:** 6 flake inputs (5 locked + 1 source-only) · 3 pinned release binaries (sha256) ·
  2 Docker images (digest) · ~15 nixpkgs packages.
- **Test image:** 1 Docker image (digest), the PostgreSQL of the tests, benchmarks and pack smoke test (§5).
- **Lean:** toolchain `v4.32.0` · 9 Lake packages (mathlib + 8 transitive), each an exact git rev.
- **Vendored ledger WASM:** 2 runtime packages (ledger v8, v9) built in this repository from pinned
  `midnight-ledger` commits plus the patches in `vendor/ledger/`, every output file pinned by SHA-256 and rebuilt
  and compared by CI (§9).

---

## 1. npm — runtime dependencies

Source: `package.json` (`dependencies`) + resolved from `package-lock.json`. All five are
**zero-dependency** packages (`ws`'s optional peers `bufferutil` and `utf-8-validate` are not
installed), so the entire *runtime* trust surface is these five nodes. `@electric-sql/pglite`
and `ws` are pinned exactly, at the versions their characterization tests in
`test/dependencies/` run against.

| Component | Version/Pin | Pinning | Source | Integrity (sha512, truncated) | License | Purpose | Update-watch |
|---|---|---|---|---|---|---|---|
| `@electric-sql/pglite` | **0.5.10** | exact (no caret) | registry.npmjs.org | `sha512-tXc/25U3…hCOBYw==` | Apache-2.0 | PostgreSQL compiled to WASM — the in-process database backend (Node.js and browser) | PGlite releases / advisories |
| `postgres` | `^3.4.9` → **3.4.9** | range → locked | registry.npmjs.org | `sha512-GD3qdB0x…KDLnaw==` | Unlicense | The Postgres client driver | GH advisories / `npm audit` on `postgres` |
| `typescript` | `^5.9.0` → **5.9.3** | range → locked | registry.npmjs.org | `sha512-jl1vZzPD…5TgSw==` | Apache-2.0 | Compiler API for `umbradb config check`; also typechecking (`tsc --noEmit`), `.d.ts` | TS releases / advisories |
| `ws` | **8.22.0** | exact (no caret) | registry.npmjs.org | `sha512-Ydggc987…U+1DOg==` | MIT | WebSocket server of the process transport, with opt-in mutual TLS | ws releases / advisories |
| `zod` | `^4.0.0` → **4.4.3** | range → locked | registry.npmjs.org | `sha512-ytENFjIJ…HJyTQ==` | MIT | Runtime schema validation (settings schemas, messages, stored/loaded state) | advisories / `npm audit` on `zod` |

---

## 2. npm — direct dev dependencies

Source: `package.json` (`devDependencies`) + resolved from `package-lock.json`. Build/test/docs
tooling only — never shipped in the runtime path.

| Component | Version/Pin | Pinning | Source | Integrity (truncated) | License | Purpose | Update-watch |
|---|---|---|---|---|---|---|---|
| `esbuild` | **0.28.2** | exact (no caret) | registry.npmjs.org | `sha512-HKVLS8dv…h32wIA==` | MIT | Bundler for the browser build (page and workers with WASM assets) | esbuild releases / advisories |
| `@types/ws` | **8.18.2** | exact (no caret) | registry.npmjs.org | `sha512-67MQl+fp…iVd0/w==` | MIT | Type declarations for `ws` | DefinitelyTyped |
| `vitest` | `^4.1.10` → **4.1.10** | range → locked | registry.npmjs.org | `sha512-R9jUTe5S…GUPw==` | MIT | Test runner (conformance + live tiers) | vitest releases / advisories |
| `tsx` | `^4.23.1` → **4.23.1** | range → locked | registry.npmjs.org | `sha512-GQHnkIfx…2wcWQ==` | MIT | TS execution for the `archive:sync` CLI | advisories (pulls `esbuild`) |
| `typedoc` | `^0.28.0` → **0.28.20** | range → locked | registry.npmjs.org | `sha512-uSKqkh8C…mplg==` | Apache-2.0 | API docs generation (`docs:storage`) | typedoc releases |
| `@testcontainers/postgresql` | `^12.0.4` → **12.0.4** | range → locked | registry.npmjs.org | `sha512-a/pLU6j5…qhgZA==` | MIT | Disposable Postgres container for conformance tests | testcontainers releases |
| `@types/node` | `^26.1.1` → **26.1.1** | range → locked | registry.npmjs.org | `sha512-nxAkRSVk…GgZREw==` | MIT | Node type definitions (matches Node ≥24) | DefinitelyTyped |
| `effect` | **3.22.0** | exact (no caret) | registry.npmjs.org | `sha512-jhYFe0zT…SPNz3g==` | MIT | Functional-effect utilities in test/harness code | effect releases |
| `fast-check` | `^4.9.0` → **4.9.0** | range → locked | registry.npmjs.org | `sha512-7ms6T7Sy…PCllg==` | MIT | Property-based testing (P1–P10 properties) | fast-check releases |
| `@midnightntwrk/wallet-sdk-abstractions` | **3.0.0-canary.20260716150734-e744d99** | exact canary build | registry.npmjs.org | `sha512-8oJ+0o09…7LDLw==` | Apache-2.0 | Wallet-state type/shape reference for test fixtures; test-only per the indexer-agnostic boundary | Midnight SDK — canary, watch closely |

> **Install scripts.** 5 of the 307 packages declare an install/lifecycle script — all in the
> **dev/optional** toolchain, **none in the runtime (`@electric-sql/pglite`, `postgres`,
> `typescript`, `ws`, `zod`) tree**: `esbuild@0.28.2`, `protobufjs@7.6.5`, `ssh2@1.17.0`, and the optional
> `cpu-features@0.0.10` + `fsevents@2.3.3` (darwin-only). This corrects the "zero install scripts"
> phrasing in `openspec/changes/v1.0.0-infosec-signoff/design.md §4`: the lockfile flags five.
> The planned G18 `.npmrc` `ignore-scripts=true` neutralizes all of them (and any future one)
> regardless. On Linux CI the two optional ones are not installed at all.

---

## 3. Nix — flake inputs (git-pinned)

Source: `nix/midnight-env/flake.nix` (`inputs`) + `nix/midnight-env/flake.lock`. Every input is
locked to an **exact commit**. The design rule: update these **deliberately, not via
`nix flake update`**.

| Component | Pinned rev | Pinning | Source | Purpose | Update-watch |
|---|---|---|---|---|---|
| `nixpkgs` | `241313f4e8e508cb9b13278c2b0fa25b9ca27163` (locked; `flake.nix` ref `nixos-unstable`) | floating ref → locked rev | github:NixOS/nixpkgs | Base package set (postgresql_18, openssl, glibc…) | nixpkgs; G18 flake-lock gate guards the floating ref |
| `flake-utils` | `11707dc2f618dd54ca8739b309ec4fc024de578b` | ref → locked rev | github:numtide/flake-utils | `eachSystem` helper | numtide/flake-utils |
| `midnight-ledger` | `e1edad2d7019e1520d173f3e22e9991903225cef` | **exact rev in `flake.nix`** | github:midnightntwrk/midnight-ledger | Ledger flake (Ledger 8 lineage) | Midnight ledger releases |
| `midnight-wallet` | `27c5352d760c2450f04cc08651a49aaba3e4081a` | **exact rev in `flake.nix`** | github:midnightntwrk/midnight-wallet | Wallet SDK/flake | Midnight wallet releases |
| `midnight-dapp-connector-api` | `da90f631d45338d640365fb3d868e095130b4d6d` | **exact rev in `flake.nix`** | github:midnightntwrk/midnight-dapp-connector-api | dApp connector API | Midnight connector releases |
| `midnight-node-src` | `f92fc29684fc088f4591f04777a58c526f3b3828` (tag `node-1.0.1`) | **exact rev**, `flake=false` | github:midnightntwrk/midnight-node | Source-only reference for the pinned node binary (not built) | midnight-node tags |

Transitive flake inputs locked in `flake.lock` (pulled in by the Midnight inputs): `fenix`,
`zkir` (`48b80c5d…`), `nix-inclusive`, `manveru/nix-lib`, `nix-systems/default`, `rust-analyzer`
(nightly). All locked to exact revs in `flake.lock`.

---

## 4. Nix — pinned release binaries (`fetchurl` + sha256)

Source: `nix/midnight-env/flake.nix`. Pre-built upstream release tarballs, content-pinned by
`sha256` — a mismatched hash hard-fails the build.

| Component | Version | Pinning | Source URL | sha256 | Purpose | Update-watch |
|---|---|---|---|---|---|---|
| cardano-node (+ cardano-cli) | **11.0.1** | sha256 | github.com/IntersectMBO/cardano-node releases `11.0.1/cardano-node-11.0.1-linux-amd64.tar.gz` | `40e88a543564251338c4888ef79fde51d2306c18b48ac308c9eab3220e3a13f0` | Cardano node the stack syncs against | IntersectMBO/cardano-node releases |
| cardano-db-sync | **13.7.1.0** | sha256 | github.com/IntersectMBO/cardano-db-sync releases `13.7.1.0/cardano-db-sync-13.7.1.0-linux.tar.gz` | `2e35bdfe91490acafa030afa07bb9a504a6ed48d8fa5eeb0ecee65b034975b75` | Chain→Postgres indexer (db-sync) | IntersectMBO/cardano-db-sync releases |
| midnight-node | **1.0.1** | sha256 | github.com/midnightntwrk/midnight-node releases `node-1.0.1/midnight-node-1.0.1-linux-amd64.tar.gz` | `7c911f64e16436e1005832f85b5438d9cfe38857825c21297902b563534fecd9` | Midnight node binary (Ledger 8); bundles res/ chain-specs | midnightntwrk/midnight-node releases |

---

## 5. Docker images (digest-pinned)

Source: `nix/midnight-env/flake.nix` (`midnightDockerImages`) and `scripts/start-stack.sh`.
Pinned by immutable `@sha256:` **content digest**. Digest pinning gives immutability, *not* CVE
freedom — hence the scheduled Trivy scan (G18).

| Image | Tag | Digest | Pinning | Purpose | Update-watch |
|---|---|---|---|---|---|
| `midnightntwrk/indexer-standalone` | 4.3.3 | `sha256:03afd079b00bcd229df29a24771439c5e7695c339cd89216d0763ce40731cc4b` | image digest | Standalone Midnight indexer (test infra) | G18 Trivy scan (weekly) + Midnight releases |
| `midnightntwrk/proof-server` | 8.1.0 | `sha256:801bbc0340e9e96f16735f77b523f23c7459e3359842f7c79c2c53f4e994d531` | image digest | Midnight proof server | G18 Trivy scan + Midnight releases |

The PostgreSQL image of the tests, their Testcontainers helpers, the benchmarks and the pack smoke test is pinned the
same way, once, in `test/postgres-image.ts` (owner decision Q82, `openspec/changes/core-arch` A148). The supply-chain
gate's image-pin agreement step checks it against the reviewed pin, and `test/dependencies/postgres-image.test.ts` fails
if any file names another PostgreSQL image. It is test infrastructure, not in the Trivy scan.

| Image | Tag | Digest | Pinning | Purpose | Update-watch |
|---|---|---|---|---|---|
| `postgres` (official image) | 18-alpine (PostgreSQL 18.6, Alpine 3.24.2) | `sha256:77f585114c32fbca283dc835b0596f4e52b51b4c6662d7810b2f4084f60a1873` | image index digest (multi-platform) | Disposable PostgreSQL for tests, benchmarks and the pack smoke test | `docker-library/repo-info` `repos/postgres/remote/18-alpine.md`; a build at least 7 days old when bumped |

---

## 6. Nix — nixpkgs packages (from the locked nixpkgs)

Source: `nix/midnight-env/flake.nix`. Versions follow the locked `nixpkgs` rev
(`241313f4…`); pinning is transitive through that single rev + `flake.lock` narHash.

| Component | Version/Pin | Pinning | Purpose |
|---|---|---|---|
| `postgresql_18` | pkgs pin (v18) | via nixpkgs rev | The Postgres server the stack + tests run against |
| `openssl` | nixpkgs | via nixpkgs rev | TLS for midnight-node / db-sync-over-TLS |
| `glibc`, `gmp`, `ncurses`, `zlib`, `systemd` | nixpkgs | via nixpkgs rev | `autoPatchelfHook` runtime libs for the release binaries |
| `postgresql.lib` | nixpkgs | via nixpkgs rev | libpq for cardano-db-sync |
| `docker` | nixpkgs | via nixpkgs rev | Runs the indexer/proof-server images |
| `coreutils`, `gnutar`, `gzip`, `rsync`, `jq` | nixpkgs | via nixpkgs rev | Backup/restore + start/stop stack scripts |
| `autoPatchelfHook` | nixpkgs | via nixpkgs rev | Patches release-binary ELF interpreters |

---

## 7. Lean / mathlib toolchain

Source: `Formal/Lean/lean-toolchain` + `Formal/Lean/lake-manifest.json` (version 1.2.0). Formal
proofs only — not in the runtime or npm path. Every package is an **exact git rev**; mathlib is
`inputRev v4.32.0` (matches the toolchain), the rest are inherited transitive Lake deps.

| Component | Pinned rev | inputRev | Pinning | Source | Purpose |
|---|---|---|---|---|---|
| Lean toolchain | `leanprover/lean4:v4.32.0` | — | version string | elan/lean4 | The Lean 4 compiler + `lake` |
| `mathlib` | `81a5d257c8e410db227a6665ed08f64fea08e997` | `v4.32.0` | exact rev | github.com/leanprover-community/mathlib4 | Mathematics library the proofs import |
| `batteries` | `023ce7d62a0531e22a5331e20b587817a80d49ff` | `main` | exact rev | leanprover-community/batteries | Std extensions (transitive) |
| `aesop` | `a7dbf0c63b694e47f425f3dcddbc0e178bb432d3` | `master` | exact rev | leanprover-community/aesop | Proof automation (transitive) |
| `Qq` (quote4) | `38d591e778f100aec9762bb582f9c7f55f50e9dc` | `master` | exact rev | leanprover-community/quote4 | Quotation metaprogramming (transitive) |
| `proofwidgets` | `6e311e2a844da9b2cc3971187df2fe0066947b93` | `main` | exact rev | leanprover-community/ProofWidgets4 | Proof UI widgets (transitive) |
| `importGraph` | `7e9612bf0b9ee66db3cb5b9988a35afc706f5a12` | `main` | exact rev | leanprover-community/import-graph | Import-graph tooling (transitive) |
| `LeanSearchClient` | `c5d5b8fe6e5158def25cd28eb94e4141ad97c843` | `main` | exact rev | leanprover-community/LeanSearchClient | mathlib search client (transitive) |
| `plausible` | `e12c1910fe855cbfc38803cd4e55543906d5fa62` | `main` | exact rev | leanprover-community/plausible | Randomized testing (transitive) |
| `Cli` (lean4-cli) | `88679d088c9720c27ebdf2ba4dafe17341747f94` | `v4.32.0` | exact rev | leanprover/lean4-cli | CLI parsing for Lake tooling (transitive) |

---

## 8. Host / toolchain dependencies

Tools the build, test, and CI depend on that are not captured as package entries above.

| Component | Version/Pin | Where required | Purpose | Update-watch |
|---|---|---|---|---|
| Node.js | **≥24** | `package.json` `engines`; CI `setup-node@…` `node-version: "24"` | JS/TS runtime for all npm scripts | Node LTS releases |
| npm | ≥9.5 (for `--provenance`, planned) | CI | Deterministic install (`npm ci`) | ships with Node |
| Docker daemon | host | conformance CI (Testcontainers), nix stack | Runs disposable Postgres + Midnight images | Docker releases |
| `@testcontainers/postgresql` | 12.0.4 (npm, §2) | conformance tests | Disposable Postgres container | testcontainers |
| Nix (flakes) | host | `nix/midnight-env/` dev env | Reproducible dev stack | Nix releases |
| `lake` / `elan` (Lean) | with `v4.32.0` | `Formal/Lean/` | Build/check proofs | lean4 releases |
| `openspec` CLI | host | change-spec workflow (`openspec/`) | Manages change proposals/specs | openspec releases |
| GitHub Actions (pinned by SHA) | `actions/checkout@11d5960…` (v4), `actions/setup-node@49933ea…` (v4) | `.github/workflows/conformance.yml` | CI runner actions, SHA-pinned | Dependabot / action releases |
| `gitleaks` | CI-side (G18, this change) | `supply-chain.yml` | Full-history secret scan | gitleaks releases |
| `trivy` | CI-side (G18, this change) | `supply-chain.yml` | HIGH/CRITICAL CVE scan of the two image digests | trivy releases |

---

## 9. Vendored ledger WASM builds (`vendor/ledger/`)

Source: `vendor/ledger/*/upstream.json`, `vendor/ledger/*/patches/`, `vendor/ledger/Dockerfile`,
`vendor/ledger/*/SHA256SUMS` (`vendor/ledger/README.md`). The ledger the indexer runs, built from source rather than
taken from npm: the published `@midnight-ntwrk/ledger-v*` packages lack the node-store functions UmbraDB needs, which
the patches add. Each package is rebuilt by `npm run vendor:ledger` and by `.github/workflows/vendored-ledger.yml` (amd64
and arm64 runners), which fail on any file whose SHA-256 differs from `SHA256SUMS`. These are **runtime** artifacts,
outside `npm audit`'s scope: their Rust crate graphs are pinned by the patched `Cargo.lock` (crates.io checksums, git
commits).

| Component | Version/Pin | Pinning | Source | Purpose | Update-watch |
|---|---|---|---|---|---|
| ledger v8 package (`vendor/ledger/v8/pkg/`) | `ledger-8.1.2` | exact commit `36d7442172136758e33009f75ff4aa56616cff40` + patches; output SHA-256 | github.com/midnightntwrk/midnight-ledger | Ledger v8 for blocks built by v8 runtimes | midnight-ledger releases; the v8 ledger midnight-node pins |
| ledger v9 package (`vendor/ledger/v9/pkg/`) | `ledger-9.1.0.0-rc.5` | exact commit `67f9f97246339539af0091c4d8c6bc5ab236a191` + patches; output SHA-256 | github.com/midnightntwrk/midnight-ledger | Ledger v9, and the v8 → v9 state translation | midnight-ledger releases; the v9 ledger midnight-node pins |
| `v8-to-v9-state-translation` (in the v9 package) | rev `da96e33d78ee9b7d3867b15c1037510d499cd909` | exact git rev in the patched `Cargo.lock` | github.com/midnightntwrk/midnight-ledger | The ledger team's v8 → v9 state translation (LG-9) | the revision midnight-node pins |
| Build image base `rust:1.98.1-slim-bookworm` | 1.98.1 | index digest `sha256:ff521445a372125ed4f76e1453a1f8098f2d05332d1601d30db1c1f62757e730` | Docker Hub (official image) | Rust toolchain for the builds | Rust releases |
| clang 14, llvm 14, git, jq, curl (in the image) | `1:14.0.6-12`, `1:2.39.5-0+deb12u3`, `1.6-2.1+deb12u2`, `7.88.1-10+deb12u15` | exact versions from snapshot.debian.org `20260918T000000Z` | Debian bookworm | C toolchain for `blst` on wasm32; source fetch; build scripting | Debian security updates |
| `wasm-bindgen-cli` (in the image) | 0.2.108 | exact version, `cargo install --locked` | crates.io | JavaScript bindings (the version ledger-9.1.0.0-rc.5 pins; the v8 patches move ledger-8.1.2 from 0.2.104, whose output varies from run to run, to it) | wasm-bindgen releases |
| binaryen `wasm-opt` (in the image) | `version_133` | release tarball SHA-256 (`x86_64` `2dc9c781…7489`, `aarch64` `89c07ea5…9bf8`) | github.com/WebAssembly/binaryen releases | Size optimization (`-Os`), as upstream's release recipe | binaryen releases |

## License summary

- **UmbraDB:** Apache-2.0.
- **npm direct deps:** Apache-2.0 (`typescript`, `typedoc`, `wallet-sdk-abstractions`),
  MIT (`zod`, `vitest`, `tsx`, `@testcontainers/postgresql`, `@types/node`, `effect`,
  `fast-check`), Unlicense (`postgres`).
- **Full npm graph (307 pkgs) license spread:** MIT 224 · ISC 23 · Apache-2.0 22 · BSD-3-Clause 13 ·
  MPL-2.0 12 · BlueOak-1.0.0 5 · BSD-2-Clause 1 · 0BSD 1 · Unlicense 2 · Python-2.0 1 ·
  unspecified 3. All permissive; no copyleft beyond weak/file-scoped MPL-2.0. (Counts from
  `package-lock.json`.)
- **Pinned binaries / images:** Cardano components Apache-2.0 (IntersectMBO); Midnight components
  Apache-2.0 (midnightntwrk). Lean/mathlib: Apache-2.0.
- **Vendored ledger builds:** `midnight-ledger` and the translation crate Apache-2.0 (midnightntwrk); the patches
  are UmbraDB's (Apache-2.0); their crate dependencies are listed in each patched `Cargo.lock`.
