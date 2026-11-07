#!/usr/bin/env bash
# Builds and runs `main.rs` (LG-16's tree values, read from the ledger's Rust state as the official
# indexer reads them) against an unpatched checkout of `midnight-ledger` at a vendored version's
# pinned commit, inside the vendored ledger build image (`vendor/ledger/Dockerfile`), for the state
# files it is given as `<name>=<path>`, and writes that version's JSON to `/out/<version>.json`
# (`../expected.json` assembles the three versions' outputs):
#
#   docker run --rm -v "$PWD/test/ledger/fixtures/state-trees/oracle:/oracle:ro" \
#     -v "$PWD/test/ledger/fixtures:/fixtures:ro" \
#     -v "<out>:/out" umbradb-ledger-build:<tag> bash /oracle/run.sh v8 36d7442172136758e33009f75ff4aa56616cff40 \
#     mainnet-genesis=/fixtures/genesis/genesis_state_mainnet.mn ... (each state of ../expected.json)
#
# The oracle is a crate of its own that depends on the checkout's crates by path, with the
# checkout's own `Cargo.lock` and its `[patch.crates-io]` section, as
# `../../post-block-update/oracle/run.sh`.
set -euo pipefail
version=$1
commit=$2
shift 2
case "$version" in
  v8) ledger=midnight-ledger ;;
  v9 | v9-rc3) ledger=midnight-ledger-v9 ;;
  *) echo "run.sh: unknown version $version" >&2; exit 2 ;;
esac

src=/build/src
git init -q "$src"
git -C "$src" fetch -q --depth 1 https://github.com/midnightntwrk/midnight-ledger "$commit"
git -C "$src" -c advice.detachedHead=false checkout -q FETCH_HEAD
[ "$(git -C "$src" rev-parse HEAD)" = "$commit" ] || { echo "run.sh: fetched another commit" >&2; exit 1; }

oracle=/build/oracle
mkdir -p "$oracle/src"
cp /oracle/main.rs "$oracle/src/main.rs"
cp "$src/Cargo.lock" "$oracle/Cargo.lock"
{
  cat <<EOT
[package]
name = "umbradb-state-trees-oracle"
version = "0.0.0"
edition = "2024"
publish = false

[dependencies]
mn_ledger = { package = "$ledger", path = "$src/ledger", default-features = false }
serialize = { package = "midnight-serialize", path = "$src/serialize" }
storage = { package = "midnight-storage", path = "$src/storage" }
storage-core = { package = "midnight-storage-core", path = "$src/storage-core", features = ["layout-v2", "gc-v1"] }

[workspace]

EOT
  # Upstream's [patch.crates-io] section, its paths made absolute.
  awk '/^\[patch\.crates-io\]/ { on = 1; print; next } /^\[/ { on = 0 } on' "$src/Cargo.toml" \
    | sed -E "s|path = \"([^\"]+)\"|path = \"$src/\\1\"|"
} > "$oracle/Cargo.toml"

cd "$oracle"
cargo run --quiet --release -- "$@" > "/out/$version.json"
if [ -n "${HOST_UID:-}" ]; then chown "$HOST_UID:$HOST_GID" "/out/$version.json"; fi
echo "run.sh: $version written" >&2
