#!/usr/bin/env bash
# Builds the IPIR+SP native add-on and the wallet's WebAssembly with the toolchain `rust-toolchain.toml` pins
# (on the host; rustup installs the toolchain and the wasm target on first use).
#
#   ./build.sh native    build the N-API add-on and place it at pss-ipir.node (for this machine; git-ignored)
#   ./build.sh wasm      build pss-ipir.wasm and write pss-ipir.wasm.sha256 (both committed)
#   ./build.sh --check   rebuild the wasm in a separate target folder and compare it with the committed file and
#                        digest; exit 1 if either differs
#
# The wasm build uses the committed Cargo.lock (`--locked`) and remaps this folder, the cargo registry and the
# toolchain's location out of the binary, so the same source and toolchain give the same bytes.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"
WASM="pss-ipir.wasm"
MODE="${1:-}"

REMAP="--remap-path-prefix=$HERE=/pss-ipir"
REMAP="$REMAP --remap-path-prefix=${CARGO_HOME:-$HOME/.cargo}/registry/src=/crates"
REMAP="$REMAP --remap-path-prefix=${RUSTUP_HOME:-$HOME/.rustup}=/rustup"

# Builds the wasm into the target folder $1 and prints the path of the result.
build_wasm() {
  RUSTFLAGS="--cfg getrandom_backend=\"custom\" $REMAP" CARGO_TARGET_DIR="$1" \
    cargo build --locked --profile wasm --target wasm32-unknown-unknown -p pss-ipir-wasm >&2
  echo "$1/wasm32-unknown-unknown/wasm/pss_ipir_wasm.wasm"
}

case "$MODE" in
  native)
    cargo build --locked --release -p pss-ipir-node
    case "$(uname -s)" in
      Darwin) lib="target/release/libpss_ipir_node.dylib" ;;
      Linux) lib="target/release/libpss_ipir_node.so" ;;
      *) echo "build.sh native: no add-on name known for $(uname -s)" >&2; exit 2 ;;
    esac
    # Copy then rename, so that a Node process holding the previous add-on keeps its file.
    cp "$lib" pss-ipir.node.tmp
    mv -f pss-ipir.node.tmp pss-ipir.node
    echo "pss-ipir.node ($(wc -c < pss-ipir.node | tr -d ' ') bytes)"
    ;;
  wasm)
    built="$(build_wasm "$HERE/target")"
    digest="$(shasum -a 256 "$built" | cut -d' ' -f1)"
    cp "$built" "$WASM.tmp"
    mv -f "$WASM.tmp" "$WASM"
    echo "$digest  $WASM" > "$WASM.sha256"
    echo "$digest  $WASM ($(wc -c < "$WASM" | tr -d ' ') bytes)"
    ;;
  --check)
    built="$(build_wasm "$HERE/target/check")"
    digest="$(shasum -a 256 "$built" | cut -d' ' -f1)"
    committed="$(cut -d' ' -f1 "$WASM.sha256")"
    echo "built     $digest"
    echo "committed $committed"
    if [[ "$digest" != "$committed" ]] || ! cmp -s "$built" "$WASM"; then
      echo "the rebuilt pss-ipir.wasm differs from the committed one" >&2
      exit 1
    fi
    echo "the rebuilt pss-ipir.wasm equals the committed one"
    ;;
  *)
    echo "usage: $0 native | wasm | --check" >&2
    exit 2
    ;;
esac
