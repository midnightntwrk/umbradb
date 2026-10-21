#!/usr/bin/env bash
# Runs scripts/graphify/graph.py (`refresh` / `check`) inside the pinned graphify environment.
#
# The environment is built from requirements.txt with every hash verified, and cached outside
# the repo keyed by that file's content, so bumping the pin rebuilds it automatically. The
# Python minor version is part of the pin: clustering iterates hash-ordered sets, so another
# minor version may assign communities differently and fail CI's reproducibility check.
set -euo pipefail

# Any failure before graph.py starts (not in a checkout, no interpreter, a failed or tampered
# install) exits 3, never 1: callers read 1 as "the graph is stale" and 2 as "invalid".
trap 'echo "error: could not prepare the graphify environment" >&2; exit 3' ERR

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

python_version="3.12"
requirements="scripts/graphify/requirements.txt"
key="$(git hash-object "$requirements" | cut -c1-16)"
# Spelled out rather than "${XDG_CACHE_HOME:-$HOME/.cache}": with both unset, that expansion trips
# `set -u`, which exits 1 without running the ERR trap.
if [ -n "${XDG_CACHE_HOME:-}" ]; then
  cache_root="$XDG_CACHE_HOME"
elif [ -n "${HOME:-}" ]; then
  cache_root="$HOME/.cache"
else
  echo "error: set HOME or XDG_CACHE_HOME; the graphify environment is cached there" >&2
  exit 3
fi
venv="$cache_root/umbradb-graphify/py${python_version}-${key}"

if [ ! -f "$venv/.complete" ]; then
  rm -rf "$venv"
  if command -v uv >/dev/null 2>&1; then
    uv venv --quiet --python "$python_version" "$venv"
    uv pip install --quiet --python "$venv/bin/python" --require-hashes --no-deps -r "$requirements"
  elif command -v "python${python_version}" >/dev/null 2>&1; then
    "python${python_version}" -m venv "$venv"
    "$venv/bin/pip" install --quiet --disable-pip-version-check --require-hashes --no-deps -r "$requirements"
  else
    echo "error: building the graphify environment needs uv or python${python_version} on PATH" >&2
    exit 3
  fi
  touch "$venv/.complete"
fi

# A fixed hash seed makes set iteration (and so clustering) reproducible. -s and -P keep the
# user site-packages and the script directory off sys.path; -I would also do that but ignores
# PYTHONHASHSEED.
unset PYTHONPATH PYTHONHOME PYTHONSTARTUP PYTHONUSERBASE
export PYTHONHASHSEED=0
# From here on the exit status is graph.py's own (0 fresh, 1 stale, 2 invalid, 3 error).
trap - ERR
exec "$venv/bin/python" -s -P scripts/graphify/graph.py "$@"
