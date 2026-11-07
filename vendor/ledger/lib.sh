#!/usr/bin/env bash
# Host side of the vendored ledger builds (vendor/ledger/README.md). Works with bash 3.2 (macOS).
#
#   lib.sh build <version-dir> <out-dir>   build one package into an empty <out-dir>
#   lib.sh sums <dir>                      print "<sha256>  pkg/<file>" for every file under <dir>
set -euo pipefail

ledger_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

file_sha256() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d' ' -f1
  else
    shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

# The SHA256SUMS format: one line per file, paths relative to the version directory, sorted.
sums() {
  (
    cd "$1"
    find . -type f | LC_ALL=C sort | sed 's|^\./||' | while IFS= read -r file; do
      printf '%s  pkg/%s\n' "$(file_sha256 "$file")" "$file"
    done
  )
}

# The image is named after the Dockerfile's content, so a changed Dockerfile builds a new image.
build_image() {
  local tag
  tag="umbradb-ledger-build:$(file_sha256 "$ledger_dir/Dockerfile" | cut -c1-16)"
  if ! docker image inspect "$tag" >/dev/null 2>&1; then
    echo "vendor:ledger: building image $tag" >&2
    docker build -t "$tag" - < "$ledger_dir/Dockerfile" >&2
  fi
  printf '%s\n' "$tag"
}

build() {
  local version_dir out image
  version_dir=$(cd "$1" && pwd)
  mkdir -p "$2"
  out=$(cd "$2" && pwd)
  if [ -n "$(ls -A "$out")" ]; then
    echo "vendor:ledger: output directory $out is not empty" >&2
    exit 1
  fi
  image=$(build_image)
  docker run --rm \
    -v "$version_dir:/in:ro" \
    -v "$ledger_dir/build-in-container.sh:/usr/local/bin/build-in-container.sh:ro" \
    -v "$out:/out" \
    -e HOST_UID="$(id -u)" -e HOST_GID="$(id -g)" \
    "$image" bash /usr/local/bin/build-in-container.sh
}

case "${1:-}" in
  build)
    [ $# -eq 3 ] || { echo "usage: lib.sh build <version-dir> <out-dir>" >&2; exit 2; }
    build "$2" "$3"
    ;;
  sums)
    [ $# -eq 2 ] || { echo "usage: lib.sh sums <dir>" >&2; exit 2; }
    sums "$2"
    ;;
  *)
    echo "usage: lib.sh build <version-dir> <out-dir> | lib.sh sums <dir>" >&2
    exit 2
    ;;
esac
