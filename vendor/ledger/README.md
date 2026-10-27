# Vendored ledger builds

UmbraDB runs Midnight's ledger (`midnight-ledger`) as WebAssembly, one package per ledger major version
(`openspec/changes/core-arch/design.md` §5.2, requirement LG-5). The published `@midnight-ntwrk/ledger-v*` packages
keep the ledger state in memory and serialize it whole; UmbraDB keeps it in its database as the node keeps it on disk,
one content-addressed node at a time. The functions that needs are added by patches to the upstream source, and the
packages are built here, reproducibly, from a pinned upstream commit.

| Directory | Upstream source | Release (`versionName`) | Why this release |
|---|---|---|---|
| `v8/` | `midnightntwrk/midnight-ledger` `36d7442172136758e33009f75ff4aa56616cff40` | `ledger-8.1.2` | The v8 ledger of `midnight-node` 2.1.0-rc.4 (`Cargo.toml` `mn-ledger-8 = "=8.1.2"`); the mainnet node reports `=8.1.2` for block 0 |
| `v9-rc3/` | `midnightntwrk/midnight-ledger` `4823b5351b17cc49e30f19760dbd30a73cf95e22` | `ledger-9.1.0.0-rc.3` | The v9 ledger of `midnight-node` 2.0.0-rc.4, which runtime 2.0 (`spec_version` 2,000,000–2,000,999; stagenet) builds (`Cargo.toml:445` `crate-ledger-9.1.0.0-rc.3`); a package of its own (owner decision Q139 A, task 12.2a) |
| `v9/` | `midnightntwrk/midnight-ledger` `67f9f97246339539af0091c4d8c6bc5ab236a191` | `ledger-9.1.0.0-rc.5` | The v9 ledger of `midnight-node` 2.1.0-rc.4 (per-crate tags `crate-ledger-9.1.0.0-rc.5` etc., each an isolate commit of this tree), runtime 2.1 on |

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

### v9-rc3: ledger v9 as runtime 2.0 built it

Runtime 2.0 is `midnight-node` 2.0.0-rc.4's, which builds v9 from `crate-ledger-9.1.0.0-rc.3`; rc.3 → rc.5 changed rules
the state root depends on (DUST generation's uniqueness, `fresh_dust_output`'s times, `verify.rs`), so the rc.5 package
gives stagenet another root than its node's from block 1 on (decision record Q139). The two releases share one storage
format — no stored type's tag differs, nor `storage-core`'s hashing — so a state the rc.3 package stored loads in the
rc.5 package with the same root and serialization, which is how a chain's 2.0 → 2.1 upgrade carries its state (the
ledger worker's engine; acceptance A159).

`v9-rc3/` is built from the workspace tag `ledger-9.1.0.0-rc.3` (`4823b53`), as `v9/` is from its workspace tag. The
node's `Cargo.lock` takes the v9 crates from per-crate tags: `crate-ledger-9.1.0.0-rc.3`, `zswap-9.0.0-rc.3`,
`base-crypto-1.1.0-rc.2`, `transient-crypto-3.0.0-rc.2`, `onchain-state-4.0.0-rc.3` and `zkir-2.2.0-rc.3` are isolate
commits of `4823b53`, and `coin-structure-3.0.0-rc.1`, `onchain-runtime-4.0.0-rc.2`, `onchain-vm-4.0.0-rc.2` and
`serialize-1.2.0-rc.1` (other parents) hold the same crate sources as `4823b53` (each tag differs from it in its
`Cargo.toml` only; checked with `git diff`). Its storage crates come from crates.io — `midnight-storage` 2.0.1 and
`midnight-storage-core` 1.2.0, the versions this tree's `storage/` and `storage-core/` carry —, whose sources differ
from the tree's in dependency versions (`crypto::digest` against `digest`), a refactoring of `arena.rs` and one guard:
the tree's `MerklePatriciaTrie::remove` returns the trie unchanged for a path shorter than an extension node, where the
crates.io one indexes past the path's end. The roots agree: the package replays stagenet's blocks with its node's roots
(`test/ledger/ledger-v9-rc3.test.ts` on blocks 0–3; `test/backbone/ledger-state.test.ts` on the tape's 10,001 blocks).
Its patches are v9's where they apply:

- `0001-storage-core-external-node-store.patch` — v9's, byte for byte (`storage-core` is the same source at both tags);
- `0002-onchain-vm-public-decode-event.patch` — v9's but for its `index` line (`vm.rs` differs at the two tags);
- `0003-ledger-wasm-node-store-exports.patch` — v9's, with the `Cargo.lock` line naming this tree's
  `midnight-storage-core 1.2.0`;
- `0004-wasm-bindgen-0.2.108.patch` — as `v8/patches/0002-…`: ledger-9.1.0.0-rc.3 pins wasm-bindgen 0.2.104 too, moved
  to 0.2.108 (`js-sys`/`web-sys` 0.3.85, `wasm-bindgen-futures` 0.4.58); its `Cargo.lock` hunks also give the workspace
  members the versions their `Cargo.toml`s carry (this tag's lock records older ones, which `cargo --locked` refuses);
- `0005-ledger-wasm-exact-post-block-update.patch` — v9's `0006-…` without the conversion around it, citing
  `midnight-node` 2.0.0-rc.4 (`ledger/helpers/src/versions/common/mod.rs` `clamp_and_normalize`,
  `compute_overall_fullness`; `ledger/src/versions/common/api/ledger.rs` `Ledger::post_block_update`,
  `apply_system_tx`): the update is the ledger's `post_block_update`, whose prevalidation a clamped fullness always
  passes, as that node calls it;
- `0006-ledger-wasm-state-trees.patch` — LG-16's tree values, as v8's `0005-…` and v9's `0007-…` (below).

v9's `0004-…` (the translation's timers) and `0005-…` (the conversion) do not apply: `midnight-node` 2.0.0-rc.4 carries
no v8 → v9 translation, and the rc.3 package has no `convertFromV8`. The build takes about a minute and a half on this
repository's arm64 Mac (77 s recording, 64 s rebuilding, both from a clean container); the package is 10 MB (its `.wasm`
10.2 MB, without the translation and the v8 ledger the v9 package carries).

## Rebuilding

```sh
npm run vendor:ledger                  # rebuild every version and compare with SHA256SUMS and pkg/ (exit 1 on a difference)
npm run vendor:ledger -- v9            # one version (v8, v9-rc3 or v9)
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

The node's end-of-block update (`v8/patches/0004-…`, `v9/patches/0006-…`; owner decision Q113 A, task 12.1a). The
published `LedgerParameters.normalizeFullness` and `LedgerState.postBlockUpdate` pass a block's fullness through
JavaScript numbers, which cannot hold a `FixedPoint` (a deploy's block usage of 2,635 of 200,000 is the node's
`FixedPoint(243035853171123343)` and comes back as `…328`), and refuse a block above its limits; the published
`SystemTransaction` has no cost. Both packages export, following `midnight-node` 2.1.0-rc.4:

- `postBlockUpdateExact(state, tblock, fullness)`: the node's post-block update (`Ledger::apply_post_block_update`,
  which `pallet-midnight`'s `on_finalize` runs) for a block whose transactions cost `fullness` in all — clamped to the
  state's block limits and normalized to them (`clamp_and_normalize`), its largest dimension taken
  (`compute_overall_fullness`), then the ledger's `post_block_update` (v8) or `apply_post_block_update` (v9);
- `blockFullness(params, fullness)`: the `FixedPoint`s that update uses, each as the integer `value × 2^64`;
- `systemTransactionCost(tx, params)`: a system transaction's cost, which the node adds to the block's fullness
  (`Ledger::apply_system_tx`).

`test/ledger/fixtures/post-block-update/` holds the node's values for a table of block costs, computed in Rust at the
pinned commits (`oracle/`), which `test/ledger/post-block-update.test.ts` checks the packages and the adapters against.

LG-16's tree values (`v8/patches/0005-…`, `v9/patches/0007-…`, `v9-rc3/patches/0006-…`; owner decision Q138 A, task
12.1b). The published packages give a state's zswap first free index only; the official indexer stores, per block, the
zswap commitment tree's first free index and root and the DUST commitment and generation trees' first free indexes and
roots. Every package exports `stateTrees(state)`: `{ zswapFirstFree, zswapRoot, dustCommitmentFirstFree,
dustCommitmentRoot, dustGenerationFirstFree, dustGenerationRoot }`, read from the ledger's Rust state as that indexer
reads them (`midnight-indexer` `indexer-common/src/domain/ledger/ledger_state.rs`: `zswap.first_free`,
`zswap.coin_coms.rehash().root()`, `dust.utxo.commitments_first_free`, `dust.utxo.commitments.rehash().root()`,
`dust.generation.generating_tree_first_free`, `dust.generation.generating_tree.rehash().root()`), each index a `bigint`
and each root its untagged serialization. Ledger 8 has DUST state too, so the six exist in every version; an empty tree
(mainnet's genesis state has three) has first free index 0 and root `00`, the zero digest as a SCALE compact integer.
`test/ledger/fixtures/state-trees/` holds the six values of fixed states, computed in Rust at the pinned commits
(`oracle/`), which `test/ledger/state-trees.test.ts` checks the packages and the adapters against.

The v8 package has no `decodeLogItem`: v8 contract logs are not MIP-0002 events, and the v8 adapter returns null for
them (owner decision Q54). The owner proposes these patches upstream, as a few pull requests, once `midnight-ledger`
is stable (owner decision Q56); each is dropped once upstream releases it (LG-5).

## Updating a version

Change `commit`, `tag` and `versionName` in `upstream.json`, rebase the patches onto the new commit (regenerate the
`Cargo.lock` hunks with `cargo`), run `npm run vendor:ledger -- --record <version>`, then `npm test`
(`test/ledger/`), and commit `upstream.json`, `patches/`, `pkg/` and `SHA256SUMS` together. A rewritten `SHA256SUMS`
(new patches too) changes the package's identity: set its `sha256` in `src/ledger/releases.ts` to the new manifest's
SHA-256, which `test/ledger/package-identity.test.ts` prints; the core version changes with it. The two Rust oracles
of `test/ledger/fixtures/` (`post-block-update/oracle/`, `state-trees/oracle/`) are run again at the new commit and
their `expected.json` re-assembled.
