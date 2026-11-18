#!/usr/bin/env bash
# Rebuilds this vendored ledger package into an empty <out-dir>, in Docker, from the upstream
# commit in upstream.json and the patches in patches/ (see ../README.md).
#
#   build.sh <out-dir>
set -euo pipefail
here=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
[ $# -eq 1 ] || { echo "usage: build.sh <out-dir>" >&2; exit 2; }
exec bash "$here/../lib.sh" build "$here" "$1"
