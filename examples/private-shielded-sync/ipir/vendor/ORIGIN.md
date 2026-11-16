# Origin of `vendor/ipir-sp/`

The folders under `vendor/ipir-sp/` are copies of five crates of the IPIR+SP repository of the Zcash wallet services.

| | |
|---|---|
| Repository | `https://github.com/valargroup/ipir-sp` |
| Commit | `791b5287a26e4fe021f6f1a8fe70b7ab23849787` (2026-11-04, "ci: use GitHub-hosted runners for Rust checks (#45)"), crate `ipir-sp` 0.1.0-rc.8 |
| Copied with | `git archive 791b528 inspiring reinspiring ipir-native-client ipir-sp simplepir-kernel \| tar -x` |

## Crates and the licence each declares

| Crate | Version | `license` in its `Cargo.toml` | Licence files it ships |
|---|---|---|---|
| `inspiring` | 0.1.0-rc.3 | `MIT OR Apache-2.0` | `LICENSE-MIT`, `LICENSE-APACHE` |
| `reinspiring` | 0.1.3-rc.1 | `MIT OR Apache-2.0` | none |
| `ipir-native-client` | 0.1.0-rc.1 | `MIT OR Apache-2.0` | `LICENSE-MIT`, `LICENSE-APACHE` |
| `ipir-sp` | 0.1.0-rc.8 | `MIT OR Apache-2.0` | none |
| `simplepir-kernel` | 0.1.0-rc.4 | `MIT OR Apache-2.0` | none |

The repository itself has no licence file at its root. The crates' declarations are the only licence statements;
whether they cover the repository as a whole has not been settled with its authors. Until it is, no file of this
branch is pushed or published (spec 00058, FR-041).

## What was copied and what was left out

Every file the commit tracks in the five crate folders, except:

- `inspiring/bench/`, `ipir-sp/bench/` (benchmark reports);
- `inspiring/fuzz/`, `reinspiring/fuzz/` (separate cargo-fuzz workspaces);
- `inspiring/Makefile`, `inspiring/.cargo/config.toml` (a comment only), `inspiring/Cargo.lock` (unused inside a
  workspace).

Kept: sources, tests and their fixtures, benches and examples (the manifests name them), the Python reference
oracles and the security certificate checker under `tools/` (the unit tests of `reinspiring` run
`tools/python-oracle/native_reference.py`), and each crate's README, SECURITY, SPEC and other notes. The
repository's other folders (`nullifier-pir`, `bench-results`, `plans`, `docs`, `scripts`, CI) are not copied.

## Local changes

None to any copied file: `diff -r` against a fresh `git archive` of the same commit shows only the folders left out
above.

Differences in how the crates are built here, all outside the copied files:

- They are members of the workspace `../Cargo.toml`, which supplies the `spiral-rs` workspace dependency with
  upstream's pin (`valar-spiral-rs =0.5.3-rc.1`) and upstream's release profile (opt-level 3, thin LTO, one codegen
  unit) and its `overflow-checks = false` for `valar-spiral-rs` in dev builds.
- `../Cargo.lock` started as upstream's at this commit: every package version upstream locks is kept; the packages
  only `nullifier-pir` needed are gone; the N-API crates of `node/` are added.
- Toolchain 1.92.0 (`../rust-toolchain.toml`) instead of upstream's 1.89.0.
- For `wasm32-unknown-unknown`, `../wasm` gives both `getrandom` majors a source (the host import
  `env.fill_random`); no copied crate is edited for it.

## Checking the copy

```sh
mkdir fresh && git -C <clone of ipir-sp> archive 791b528 inspiring reinspiring ipir-native-client ipir-sp \
  simplepir-kernel | tar -x -C fresh
diff -r fresh vendor/ipir-sp
```

The only differences reported are `Only in fresh/…` for the files listed under "left out".
