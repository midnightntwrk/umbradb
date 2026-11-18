#!/usr/bin/env bash
# Builds the scan kernel (`pss-kernel.wasm`) reproducibly in Docker and records its SHA-256.
#
#   ./build.sh           build, write pss-kernel.wasm and pss-kernel.wasm.sha256
#   ./build.sh --check   build into a temporary folder and compare with the committed digest; exit 1 if it differs
#   ./build.sh --vectors <dir> <count>
#                        run the native coin-vector generator (src/bin/coin-vectors.rs) and write into <dir>
#   ./build.sh --test [args]
#                        run the crate's native tests (args go to the test binary, e.g. --ignored --nocapture)
#
# The image is pinned by digest and the build uses the committed Cargo.lock (`--locked`), so the same source gives the
# same bytes. Paths are remapped so neither the host folder nor the container's cargo home ends up in the binary.
# PSS_KERNEL_CARGO_CACHE names a Docker volume to keep the crate downloads between runs (it does not change the output).
set -euo pipefail

IMAGE="rust:1.95-slim-bookworm@sha256:d7482085ff5b415f84dba5647ae71606650bdef00db7aeb69f4b3d170c3e4082"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WASM="pss-kernel.wasm"
MODE="${1:-build}"

cache=()
if [[ -n "${PSS_KERNEL_CARGO_CACHE:-}" ]]; then
  cache=(-v "${PSS_KERNEL_CARGO_CACHE}:/usr/local/cargo/registry")
fi

# Copies the crate (without any host build output) to /build inside the container and runs the given commands there.
run() {
  # `${a[@]+…}`: an empty array under `set -u` in bash 3.2 (macOS).
  docker run --rm ${cache[@]+"${cache[@]}"} -v "$HERE:/src:ro" "$@"
}
PREPARE='mkdir -p /build && cp -r /src/Cargo.toml /src/Cargo.lock /src/src /build/ && cd /build'
REMAP='--remap-path-prefix=/build=/pss-kernel --remap-path-prefix=/usr/local/cargo/registry/src=/crates --remap-path-prefix=/usr/local/rustup=/rustup'
# `blst` (BLS12-381, a dependency of `midnight-curves`) is C; for wasm32 it needs clang and an archiver that indexes
# wasm objects. Debian bookworm's clang 14 and llvm 14, at this exact version.
CLANG_VERSION="1:14.0.6-12"
CLANG="apt-get update -qq && apt-get install -y -qq --no-install-recommends clang-14=$CLANG_VERSION llvm-14=$CLANG_VERSION >/dev/null
      export CC_wasm32_unknown_unknown=clang-14 AR_wasm32_unknown_unknown=llvm-ar-14
      export CFLAGS_wasm32_unknown_unknown='-ffile-prefix-map=/usr/local/cargo/registry/src=/crates'"

case "$MODE" in
  build|--check)
    out="$(mktemp -d)"
    trap 'rm -rf "$out"' EXIT
    run -v "$out:/out" "$IMAGE" bash -c "set -euo pipefail; $CLANG; $PREPARE
      rustup target add wasm32-unknown-unknown >/dev/null 2>&1
      RUSTFLAGS='--cfg getrandom_backend=\"unsupported\" $REMAP' \
        cargo build --locked --release --lib --target wasm32-unknown-unknown
      cp target/wasm32-unknown-unknown/release/pss_kernel.wasm /out/$WASM"
    digest="$(shasum -a 256 "$out/$WASM" | cut -d' ' -f1)"
    if [[ "$MODE" == "--check" ]]; then
      committed="$(cut -d' ' -f1 "$HERE/$WASM.sha256")"
      echo "built     $digest"
      echo "committed $committed"
      if [[ "$digest" != "$committed" ]] || ! cmp -s "$out/$WASM" "$HERE/$WASM"; then
        echo "the rebuilt kernel differs from the committed one" >&2
        exit 1
      fi
      echo "the rebuilt kernel equals the committed one"
    else
      cp "$out/$WASM" "$HERE/$WASM"
      echo "$digest  $WASM" > "$HERE/$WASM.sha256"
      echo "$digest  $WASM ($(wc -c < "$HERE/$WASM" | tr -d ' ') bytes)"
    fi
    ;;
  --vectors)
    dir="$(cd "$2" && pwd)"
    run -v "$dir:/out" "$IMAGE" bash -c "set -euo pipefail; $PREPARE
      cargo run --locked --release --bin coin-vectors -- /out $3"
    ;;
  --test)
    shift
    run "$IMAGE" bash -c "set -euo pipefail; $PREPARE; cargo test --locked --release --lib -- $*"
    ;;
  *)
    echo "usage: $0 [--check | --vectors <dir> <count> | --test]" >&2
    exit 2
    ;;
esac
