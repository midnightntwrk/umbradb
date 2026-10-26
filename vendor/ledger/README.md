# Vendored ledger builds

UmbraDB runs Midnight's ledger (`midnight-ledger`) as WebAssembly, one package per ledger major version
(`openspec/changes/core-arch/design.md` §5.2, requirement LG-5). The published `@midnight-ntwrk/ledger-v*` packages
keep the ledger state in memory and serialize it whole; UmbraDB keeps it in its database as the node keeps it on disk,
one content-addressed node at a time. The functions that needs are added by patches to the upstream source, and the
packages are built here, reproducibly, from a pinned upstream commit.

| Directory | Upstream source | Release (`versionName`) | Why this release |
|---|---|---|---|
| `v8/` | `midnightntwrk/midnight-ledger` `36d7442172136758e33009f75ff4aa56616cff40` | `ledger-8.1.2` | The v8 ledger of `midnight-node` 2.1.0-rc.4 (`Cargo.toml` `mn-ledger-8 = "=8.1.2"`); the mainnet node reports `=8.1.2` for block 0 |
| `v9/` | `midnightntwrk/midnight-ledger` `67f9f97246339539af0091c4d8c6bc5ab236a191` | `ledger-9.1.0.0-rc.5` | The v9 ledger of `midnight-node` 2.1.0-rc.4 (per-crate tags `crate-ledger-9.1.0.0-rc.5` etc., each an isolate commit of this tree) |

The v9 package also contains the ledger team's v8 → v9 state translation (`v8-to-v9-state-translation` at
`midnight-ledger` `da96e33d78ee9b7d3867b15c1037510d499cd909`, the revision `midnight-node` 2.1.0-rc.4 pins) and ledger
v8 8.1.2, built against this v9 tree exactly as the node builds them: the translation's crates.io dependencies on the
v9 crates resolve to this tree, so v8 and v9 share one storage crate (see `v9/patches/0005-…`).

Each version directory holds:

- `upstream.json` — the repository, commit, tag and release name (`versionName`), the WASM crate, the
  `wasm-bindgen` version the patched `Cargo.lock` pins, and the name the built package carries;
- `patches/NNNN-*.patch` — applied with `git apply`, in file-name order;
- `build.sh <out-dir>` — rebuilds the package into an empty directory, in Docker;
- `pkg/` — the built package (the WASM module, the JavaScript bindings, the TypeScript declarations, a Node.js entry
  `*_fs.js`, a browser entry, `package.json`);
- `SHA256SUMS` — the SHA-256 of every file in `pkg/`. Its own SHA-256 is the package's identity in the core version
  (LG-5; `src/ledger/releases.ts`), and startup refuses with `package-hash-mismatch` when it, or any file it lists, is
  not the recorded one (`src/ledger/identity.ts`).

## Rebuilding

```sh
npm run vendor:ledger                  # rebuild every version and compare with SHA256SUMS and pkg/ (exit 1 on a difference)
npm run vendor:ledger -- v9            # one version
npm run vendor:ledger -- --record v9   # replace pkg/ with the new build and rewrite SHA256SUMS
```

The build needs Docker and network access (GitHub for the upstream source and the translation, crates.io for
dependencies; `Cargo.lock` pins every one by checksum or commit). It takes a few minutes per version.

Everything that goes into a build is pinned (`Dockerfile`): the Rust 1.98.1 image by its multi-architecture index digest,
clang 14 and the other Debian packages at exact versions from a dated Debian snapshot, `wasm-bindgen-cli` 0.2.108 built
with `cargo install --locked`, and binaryen `version_133` checked against its SHA-256. ledger-8.1.2 pins wasm-bindgen
0.2.104, whose CLI numbers its generated adapters differently from run to run on the same input (three runs, three
outputs); `v8/patches/0002-…` moves it to 0.2.108, the version ledger-9.1.0.0-rc.5 pins, which gave the same bytes in
six runs. The build follows
upstream's own release recipe (`midnight-ledger` `bagel.nix`): `cargo build --profile wasm` for
`wasm32-unknown-unknown`, `wasm-bindgen --target bundler --omit-default-module-path --weak-refs --reference-types`,
`wasm-opt -Os --enable-reference-types`, the hand-written declarations assembled from the template. Paths inside the
container are fixed, so the bytes do not depend on where the repository is checked out. Each host runs the image's
native variant (the amd64 Rust toolchain cannot run under emulation on an arm64 Mac); CI rebuilds on amd64 and arm64
runners and compares both with `SHA256SUMS` (`.github/workflows/vendored-ledger.yml`).

## What the patches add

`storage-core` (both versions):

- a **node source**: a synchronous function the arena consults when a node is neither in memory nor in its database,
  checking that the returned payload and child keys hash to the requested key (a node that does not is a corrupt store
  and aborts the module);
- `take_reachable_pending(roots)`: hands over the nodes created since the last call that the given keys reach, instead
  of writing them to the database, and marks them stored — so what is written never depends on which objects happen to
  be alive;
- `forget_stored(keys)`: forgets the in-memory copies of nodes the store deleted, so a node needed again is written
  again; it refuses a key a live object still holds.

`ledger-wasm` exports (both versions, `src/umbradb.rs`, declared in the package's `.d.ts`): `loadState(stateKey, store)`,
`stateRoot(state)` (the node's `midnight_ledgerStateRoot` value), `stateKey(state)`, `flushNodes()` (the new nodes and
the net root-count change per key), `persistKey`, `releaseKey`, `childRefs(children)`, `evictKeys(keys)`,
`contractStateKey(state, address)`, `contractZswapStateKey(state, address)`. The v9 package adds `decodeLogItem(value)`
(the VM's own `decode_event`, made public by `v9/patches/0002-…`), `serializeStateValue(value)` (its input) and
`convertFromV8(v8StateKey, store)` (the translation, with the node's step budget; `v9/patches/0004-…` makes the translation's
profiling timers zero on `wasm32`, where `std::time::Instant` panics). The exports write a panic's message to the console
before the module aborts (the build aborts on panic, so a panic is fatal to the instance). Builds keep the node's
storage layout (`layout-v2`, `gc-v1`). `v8/patches/0002-…` moves ledger-8.1.2 from wasm-bindgen 0.2.104 to 0.2.108 (above).

The v8 package has no `decodeLogItem`: v8 contract logs are not MIP-0002 events, and the v8 adapter returns null for
them (owner decision Q54). The owner proposes these patches upstream, as a few pull requests, once `midnight-ledger`
is stable (owner decision Q56); each is dropped once upstream releases it (LG-5).

## Updating a version

Change `commit`, `tag` and `versionName` in `upstream.json`, rebase the patches onto the new commit (regenerate the
`Cargo.lock` hunks with `cargo`), run `npm run vendor:ledger -- --record <version>`, then `npm test`
(`test/ledger/`), and commit `upstream.json`, `patches/`, `pkg/` and `SHA256SUMS` together. A rewritten `SHA256SUMS`
(new patches too) changes the package's identity: set its `sha256` in `src/ledger/releases.ts` to the new manifest's
SHA-256, which `test/ledger/package-identity.test.ts` prints; the core version changes with it.
