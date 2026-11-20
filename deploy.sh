#!/usr/bin/env bash
# shellcheck disable=SC2029 # ssh commands expand on the laptop on purpose: they hold only fixed values.
# Deploys the working tree (tracked files, and untracked ones git does not ignore) to the umbradb host, provisioned by
# provision.sh, and builds it. Each network is a systemd instance, umbradb@<network>; a deploy restarts the enabled ones
# and leaves the others off, so what runs is the host's choice (start and stop below), and survives deploys and reboots.
# The token explorer's code comes from another repository, so only --explorer deploys it (from
# ../umbra-token-explorer-frontend, or UMBRADB_EXPLORER_DIR). It shows the enabled networks.
#
#   ./deploy.sh [--explorer]               deploy (and the token explorer's code)
#   ./deploy.sh status                     each instance's state and sync, and the explorer's health
#   ./deploy.sh logs <network|explorer>    follow a service's log
#   ./deploy.sh config                     edit the host's settings (node URLs); applied when an instance (re)starts
#   ./deploy.sh start <network>            enable and start that network's instance
#   ./deploy.sh stop <network>             stop and disable it
#   ./deploy.sh restore <network> <file>   restore a backup on the host into that network's database (empty, stopped)
#
# deploy/runbook.md has the common tasks.
#
# A deploy installs deploy/umbradb.config.ts as ~umbradb/umbradb.config.ts; the host's own settings (node URLs) are
# ~umbradb/config.json next to it (provision.sh), which a deploy never touches.
set -euo pipefail
# shellcheck source=deploy/common.sh
source "$(dirname "${BASH_SOURCE[0]}")/deploy/common.sh"

# The host's copy of the working tree, kept between deploys so rsync sends only changes (relative to the login's home).
STAGE=umbradb-deploy
EXPLORER_STAGE=$STAGE-explorer

# ---- on the laptop ------------------------------------------------------------------------------------------------

# sync <git working tree> <host directory>: copies exactly git's files (tracked, and untracked ones not ignored), each
# included by its anchored, escaped path, everything else excluded and deleted; records the commit in .commit.
sync() {
  local commit; commit=$(git -C "$1" rev-parse --short HEAD)
  [[ -z $(git -C "$1" status --porcelain) ]] || commit+="-dirty"
  log "syncing $(basename "$(realpath "$1")") $commit to $HOST"
  git -C "$1" ls-files -co --exclude-standard | sed 's/[][*?\\]/\\&/g; s|^|/|' \
    | rsync -az --delete --delete-excluded --prune-empty-dirs --exclude='.git/' --exclude='node_modules/' \
      --include='*/' --include-from=- --exclude='*' "$1/" "$HOST:$2/"
  ssh "$HOST" "echo $commit > $2/.commit"
}

deploy() {
  local with_explorer=${1:-}
  cd "$(dirname "${BASH_SOURCE[0]}")"
  local explorer=${UMBRADB_EXPLORER_DIR:-../umbra-token-explorer-frontend}
  [[ -z $with_explorer || -d $explorer/.git ]] || die "no token explorer checkout at $explorer: set UMBRADB_EXPLORER_DIR"
  ssh "$HOST" "command -v rsync > /dev/null && test -f /etc/systemd/system/umbradb-explorer.service" \
    || die "$HOST is not provisioned (or not since the token explorer): run ./provision.sh"

  sync . "$STAGE"
  [[ -z $with_explorer ]] || sync "$explorer" "$EXPLORER_STAGE"

  ssh -t "$HOST" "sudo bash ~/$STAGE/deploy.sh --on-host $with_explorer"
  status
}

status() {
  log "status"
  local net
  for net in "${NETWORKS[@]}"; do
    printf '%s (%s): ' "$net" "$(ssh "$HOST" "systemctl is-enabled umbradb@$net 2> /dev/null; true" | head -n1)"
    # state, cursor, head and lag, the start of /status
    curl -fsS --max-time 10 "https://$DOMAIN/$net/admin/status" 2> /dev/null | head -c 120 || printf 'not answering'
    echo
  done
  printf 'explorer: '
  curl -fsS --max-time 10 -o /dev/null -w 'HTTP %{http_code}\n' "https://$DOMAIN/healthz" || echo 'not answering'
}

logs() {
  local unit
  case ${1:-} in
    explorer) unit=umbradb-explorer ;;
    "") die "usage: ./deploy.sh logs <network|explorer>" ;;
    *) index_of "$1" > /dev/null; unit=umbradb@$1 ;;
  esac
  ssh -t "$HOST" "sudo journalctl -u $unit -n 100 -f"
}

config() {
  ssh -t "$HOST" "sudo -u umbradb editor $APP/config.json"
  echo "Applied when an instance starts: ./deploy.sh (restarts every enabled one), or ./deploy.sh stop/start <network>."
}

# on_host_command <command> <args…>: runs the host's deploy.sh, which only a deploy updates, so it must be this one.
# -t: a terminal, so that Ctrl-C stops the command on the host too, not just ssh.
on_host_command() {
  [[ $(ssh "$HOST" "sudo cat $APP/src/deploy.sh" | sha256sum) == $(sha256sum < "${BASH_SOURCE[0]}") ]] \
    || die "the host's deploy.sh is not this one: run ./deploy.sh first"
  local args; args=$(printf ' %q' "$@")
  ssh -t "$HOST" "sudo bash $APP/src/deploy.sh$args"
}

restore() {
  local net=${1:-} file=${2:-}
  [[ -n $net && -n $file ]] || die "usage: ./deploy.sh restore <network> <backup file on $HOST>"
  index_of "$net" > /dev/null
  on_host_command --on-host-restore "$net" "$file"
}

start_stop() {
  local command=$1 net=${2:-}
  [[ -n $net ]] || die "usage: ./deploy.sh $command <network>"
  index_of "$net" > /dev/null
  on_host_command "--on-host-$command" "$net"
}

# ---- on the host, as root -----------------------------------------------------------------------------------------

# Runs in the current directory.
as_umbradb() { runuser -u umbradb -- env HOME="$APP" PATH="/opt/node/bin:/usr/bin:/bin" "$@"; }
# umbradb <network> <command…>: the CLI as an instance runs it, on the host's configuration.
umbradb() { local net=$1; shift; (cd "$APP" && as_umbradb env UMBRADB_NETWORK="$net" node "$APP/src/dist/cli/main.js" "$@"); }
enabled() { systemctl is-enabled -q "umbradb@$1" 2> /dev/null; }

# update_explorer [restart]: points the token explorer at the enabled networks (it greys out the others instead of
# failing on them), and restarts it when that changed or when asked.
update_explorer() {
  local restart=${1:-} net
  {
    echo "HOST=127.0.0.1"
    echo "PORT=$EXPLORER_PORT"
    for net in "${NETWORKS[@]}"; do
      if enabled "$net"; then echo "${net^^}_API=http://127.0.0.1:809$(index_of "$net")"; else echo "${net^^}_API="; fi
    done
  } | put "$APP/explorer.env" 0644 umbradb:umbradb && restart=1
  if [[ ! -f $APP/explorer/src/main.mjs ]]; then
    echo "token explorer: not deployed yet (./deploy.sh --explorer)"
  elif [[ -n $restart ]]; then
    systemctl enable -q umbradb-explorer
    systemctl restart umbradb-explorer
    echo "token explorer $(cat "$APP/explorer/.commit"): restarted"
  else
    echo "token explorer $(cat "$APP/explorer/.commit"): unchanged"
  fi
}

on_host() {
  local with_explorer=${1:-}
  [[ $EUID -eq 0 ]] || die "--on-host runs as root"
  local stage; stage=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

  log "build $(cat "$stage/.commit")"
  # Downtime is fine: stop every instance so nothing runs from a dist/ being rebuilt.
  systemctl stop 'umbradb@*.service' 2> /dev/null || true
  rsync -a --delete --exclude=/node_modules --exclude=/dist --chown=umbradb:umbradb "$stage/" "$APP/src/"
  local lock_key; lock_key="$NODE_VERSION $(sha256sum < "$APP/src/package-lock.json")"
  if [[ ! -d $APP/src/node_modules || $(cat "$APP/.npm-ci" 2> /dev/null) != "$lock_key" ]]; then
    (cd "$APP/src" && as_umbradb npm ci --no-audit --no-fund --loglevel=error)
    echo "$lock_key" > "$APP/.npm-ci"
  fi
  (cd "$APP/src" && as_umbradb npm run --silent build)

  log "instances"
  install -m 0644 -o umbradb -g umbradb "$APP/src/deploy/umbradb.config.ts" "$APP/umbradb.config.ts"
  local net
  for net in "${NETWORKS[@]}"; do
    if enabled "$net"; then
      umbradb "$net" config check "$APP/umbradb.config.ts" || die "$APP/umbradb.config.ts fails for $net (above)"
      systemctl start "umbradb@$net"
      echo "$net: started"
    else
      echo "$net: off (./deploy.sh start $net)"
    fi
  done
  log "token explorer"
  if [[ -n $with_explorer ]]; then
    rsync -a --delete --chown=umbradb:umbradb "$stage-explorer/" "$APP/explorer/"
    update_explorer restart
  else
    update_explorer
  fi

  echo "$(cat "$stage/.commit") explorer $(cat "$APP/explorer/.commit" 2> /dev/null || echo none) $(date -u +%FT%TZ)" \
    > "$APP/DEPLOYED"
}

# restore_progress <backup file> <network>: every 30 s, how far the restore has read the file (it reads it once to
# check it, then again to load it) and how big the database has grown; it ends with the restore.
restore_progress() {
  local file=$1 net=$2 size pid fd pos last=0 pass=checking msg db
  size=$(stat -c %s "$file")
  sleep 5
  while pid=$(pgrep -u umbradb -f -- "main\.js restore $file" | head -n1) && [[ -n $pid ]]; do
    pos=""
    for fd in /proc/"$pid"/fd/*; do
      if [[ $(readlink "$fd" 2> /dev/null) == "$file" ]]; then
        pos=$(awk '/^pos:/ { print $2 }' "/proc/$pid/fdinfo/${fd##*/}" 2> /dev/null)
        break
      fi
    done
    if [[ -n $pos ]]; then
      ((pos < last)) && pass=loading
      last=$pos
      msg="$pass the file: $((pos * 100 / size))%"
    elif [[ $pass == loading ]]; then
      msg="loaded: checking the contents hash and the ledger root"
    else
      msg="starting"
    fi
    db=$(cd / && runuser -u postgres -- psql -XAtc "SELECT pg_size_pretty(pg_database_size('umbradb_$net'))" 2> /dev/null)
    printf '%s  %s (database %s)\n' "$(date +%T)" "$msg" "${db:-?}"
    sleep 30
  done
}

on_host_start() {
  [[ $EUID -eq 0 ]] || die "--on-host-start runs as root"
  local net=$1
  umbradb "$net" config check "$APP/umbradb.config.ts" || die "$APP/umbradb.config.ts fails for $net (above)"
  systemctl enable -q --now "umbradb@$net"
  echo "$net: started, and starts at boot and after deploys"
  update_explorer
}

on_host_stop() {
  [[ $EUID -eq 0 ]] || die "--on-host-stop runs as root"
  local net=$1
  systemctl disable -q --now "umbradb@$net"
  echo "$net: stopped, and stays off until ./deploy.sh start $net"
  update_explorer
}

on_host_restore() {
  [[ $EUID -eq 0 ]] || die "--on-host-restore runs as root"
  local net=$1 file=$2
  index_of "$net" > /dev/null
  # Enabled, a deploy or a reboot would start it during the restore.
  if enabled "$net" || systemctl is-active -q "umbradb@$net"; then die "umbradb@$net is on: ./deploy.sh stop $net first"; fi
  [[ -f $file ]] || die "no file $file on the host"
  runuser -u umbradb -- test -r "$file" || die "the umbradb user cannot read $file"
  # The backup's core revisions, from the manifest on its first line: the configuration keeps those of an earlier build.
  local history=$APP/history/$net.json
  install -d -o umbradb -g umbradb "$APP/history"
  (cd "$APP" && as_umbradb node "$APP/src/scripts/core-history-from-backup.mjs" "$(realpath "$file")" "$history")
  log "restoring $file into umbradb_$net"
  # The progress in the background, so the restore keeps the terminal (and Ctrl-C).
  restore_progress "$(realpath "$file")" "$net" &
  local progress=$!
  # shellcheck disable=SC2064 # the pid now: $progress is gone by the time the trap runs
  trap "kill $progress 2> /dev/null || true" EXIT
  if ! umbradb "$net" restore "$(realpath "$file")" --config "$APP/umbradb.config.ts"; then
    rm -f "$history"
    die "restore failed: umbradb_$net is unchanged"
  fi
  log "restored: ./deploy.sh start $net"
}

case ${1:-} in
  "") deploy ;;
  --explorer) deploy --explorer ;;
  restore) shift; restore "$@" ;;
  start | stop) start_stop "$@" ;;
  status) status ;;
  logs) shift; logs "$@" ;;
  config) config ;;
  --on-host) shift; on_host "$@" ;;
  --on-host-start) on_host_start "$2" ;;
  --on-host-stop) on_host_stop "$2" ;;
  --on-host-restore) shift; on_host_restore "$@" ;;
  *) die "usage: ./deploy.sh [--explorer] | status | logs <network|explorer> | config | {start|stop} <network> | restore <network> <file>" ;;
esac
