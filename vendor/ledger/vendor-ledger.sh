#!/usr/bin/env bash
# `npm run vendor:ledger` (vendor/ledger/README.md).
#
#   vendor-ledger.sh [--record] [VERSION...]
#
# Rebuilds each vendored ledger package (default: every vendor/ledger/v*/ directory) in Docker from
# its pinned upstream commit and patches, then checks that the new build and the committed pkg/
# both have exactly the files and SHA-256 recorded in that version's SHA256SUMS. Exits 1 on any
# difference. With --record, the new build replaces pkg/ and SHA256SUMS is rewritten instead. With the
# environment's VENDOR_LEDGER_KEEP set to a directory, a rebuilt package that differs is copied there.
set -euo pipefail

ledger_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
record=0
versions=""
for arg in "$@"; do
  case "$arg" in
    --record) record=1 ;;
    -*) echo "vendor:ledger: unknown option $arg" >&2; exit 2 ;;
    *) versions="$versions $arg" ;;
  esac
done
if [ -z "$versions" ]; then
  for dir in "$ledger_dir"/v*/; do
    versions="$versions $(basename "$dir")"
  done
fi

work=$(mktemp -d "${TMPDIR:-/tmp}/umbradb-vendor-ledger.XXXXXX")
trap 'rm -rf "$work"' EXIT

status=0
for version in $versions; do
  dir="$ledger_dir/$version"
  if [ ! -f "$dir/upstream.json" ] || [ ! -x "$dir/build.sh" ]; then
    echo "vendor:ledger: $version is not a vendored ledger version" >&2
    exit 2
  fi
  out="$work/$version"
  echo "vendor:ledger: building $version" >&2
  "$dir/build.sh" "$out"
  bash "$ledger_dir/lib.sh" sums "$out" > "$work/$version.sums"
  if [ "$record" = 1 ]; then
    rm -rf "$dir/pkg"
    cp -R "$out" "$dir/pkg"
    cp "$work/$version.sums" "$dir/SHA256SUMS"
    echo "vendor:ledger: $version recorded:" >&2
    cat "$dir/SHA256SUMS" >&2
    continue
  fi
  if ! diff -u "$dir/SHA256SUMS" "$work/$version.sums"; then
    echo "vendor:ledger: $version: the rebuilt package differs from SHA256SUMS" >&2
    status=1
    # With VENDOR_LEDGER_KEEP, the differing build is kept there (CI uploads it) to compare with the committed pkg/.
    if [ -n "${VENDOR_LEDGER_KEEP:-}" ]; then
      mkdir -p "$VENDOR_LEDGER_KEEP"
      cp -R "$out" "$VENDOR_LEDGER_KEEP/$version"
      echo "vendor:ledger: $version: the rebuilt package is kept in $VENDOR_LEDGER_KEEP/$version" >&2
    fi
  else
    echo "vendor:ledger: $version: the rebuilt package matches SHA256SUMS" >&2
  fi
  bash "$ledger_dir/lib.sh" sums "$dir/pkg" > "$work/$version.committed.sums"
  if ! diff -u "$dir/SHA256SUMS" "$work/$version.committed.sums"; then
    echo "vendor:ledger: $version: the committed pkg/ differs from SHA256SUMS" >&2
    status=1
  fi
done
exit "$status"
