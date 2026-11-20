# Shared by provision.sh and deploy.sh, on the laptop and on the host. Sourced, not run.
# shellcheck shell=bash disable=SC2034 # the settings are used by the scripts that source this

HOST=${UMBRADB_HOST:-umbradb}
DOMAIN=midnight-tokens.zkdojo.com
NETWORKS=(preview preprod mainnet)
NODE_VERSION=24.11.1
PG_VERSION=18
PG_UNIT=postgresql@$PG_VERSION-main
DATA_MOUNT=/mnt/data
# The umbradb user's home: its configuration (umbradb.config.ts), the code (src/) and the token explorer (explorer/).
APP=/home/umbradb
# The token explorer (../umbra-token-explorer-frontend), which nginx serves at the site's root.
EXPLORER_PORT=10591

log() { printf '\n\033[1m==> %s\033[0m\n' "$*" >&2; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }

# preview → 1, preprod → 2, mainnet → 3: its admin port is 808N, its API port 809N.
index_of() {
  local i
  for i in "${!NETWORKS[@]}"; do [[ ${NETWORKS[$i]} == "$1" ]] && { echo $((i + 1)); return; }; done
  die "unknown network: $1"
}

# put <path> <mode> <owner:group> < content: writes the file only if it differs; succeeds only if it changed.
put() {
  local tmp; tmp=$(mktemp)
  cat > "$tmp"
  if [[ -f $1 ]] && cmp -s "$tmp" "$1"; then rm -f "$tmp"; return 1; fi
  install -D -m "$2" -o "${3%%:*}" -g "${3##*:}" "$tmp" "$1"
  rm -f "$tmp"
}
