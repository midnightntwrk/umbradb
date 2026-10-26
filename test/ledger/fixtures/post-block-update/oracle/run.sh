#!/usr/bin/env bash
# Builds and runs `main.rs` (the node's end-of-block arithmetic) against an unpatched checkout of
# `midnight-ledger` at a vendored version's pinned commit, inside the vendored ledger build image
# (`vendor/ledger/Dockerfile`), and writes that version's JSON to `/out/<version>.json`:
#
#   docker run --rm -v "$PWD/test/ledger/fixtures/post-block-update/oracle:/oracle:ro" -v "<out>:/out" \
#     umbradb-ledger-build:<tag> bash /oracle/run.sh v8 36d7442172136758e33009f75ff4aa56616cff40
#   ... bash /oracle/run.sh v9 67f9f97246339539af0091c4d8c6bc5ab236a191
#
# The oracle is a crate of its own that depends on the checkout's crates by path, with the
# checkout's own `Cargo.lock` (so every third-party crate is the version upstream pins) and its
# `[patch.crates-io]` section.
set -euo pipefail
version=$1
commit=$2
case "$version" in
  v8) ledger=midnight-ledger; features="" ;;
  v9) ledger=midnight-ledger-v9; features="--features v9" ;;
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
  cat <<EOF
[package]
name = "umbradb-post-block-update-oracle"
version = "0.0.0"
edition = "2024"
publish = false

[features]
v9 = []

[dependencies]
mn_ledger = { package = "$ledger", path = "$src/ledger", default-features = false }
base-crypto = { package = "midnight-base-crypto", path = "$src/base-crypto" }
serialize = { package = "midnight-serialize", path = "$src/serialize" }
storage = { package = "midnight-storage", path = "$src/storage" }
storage-core = { package = "midnight-storage-core", path = "$src/storage-core", features = ["layout-v2", "gc-v1"] }

[workspace]

EOF
  # Upstream's [patch.crates-io] section, its paths made absolute.
  awk '/^\[patch\.crates-io\]/ { on = 1; print; next } /^\[/ { on = 0 } on' "$src/Cargo.toml" \
    | sed -E "s|path = \"([^\"]+)\"|path = \"$src/\\1\"|"
} > "$oracle/Cargo.toml"

cd "$oracle"
# shellcheck disable=SC2086
cargo run --quiet --release $features > "/out/$version.json"
if [ -n "${HOST_UID:-}" ]; then chown "$HOST_UID:$HOST_GID" "/out/$version.json"; fi
echo "run.sh: $version written" >&2
