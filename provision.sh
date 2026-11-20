#!/usr/bin/env bash
# shellcheck disable=SC2029 # ssh commands expand on the laptop on purpose: they hold only fixed values.
# Prepares the umbradb host for deploy.sh: PostgreSQL 18 on /mnt/data with a database per network, the umbradb user
# and role, its settings (~umbradb/config.json, from deploy/config.json when missing), Node.js, the
# umbradb@ systemd unit and the token explorer's, and nginx + Let's Encrypt on $DOMAIN. Run it once, and again after changing any of these: it
# is idempotent, never overwrites the settings and never upgrades installed packages.
#
#   CERTBOT_EMAIL=... ./provision.sh    (the email is optional: Let's Encrypt's expiry notices)
set -euo pipefail
# shellcheck source=deploy/common.sh
source "$(dirname "${BASH_SOURCE[0]}")/deploy/common.sh"

# ---- on the laptop ------------------------------------------------------------------------------------------------

provision() {
  cd "$(dirname "${BASH_SOURCE[0]}")"
  log "copying provision.sh to $HOST"
  ssh "$HOST" "mkdir -p umbradb-provision/deploy"
  scp -q provision.sh "$HOST:umbradb-provision/"
  scp -q deploy/common.sh deploy/config.json "$HOST:umbradb-provision/deploy/"
  ssh "$HOST" "sudo bash ~/umbradb-provision/provision.sh --on-host $(printf '%q' "${CERTBOT_EMAIL:-}")"
}

# ---- on the host, as root -----------------------------------------------------------------------------------------

export DEBIAN_FRONTEND=noninteractive

psql_admin() { (cd / && runuser -u postgres -- psql -X -q -v ON_ERROR_STOP=1 "$@"); }

on_host() {
  [[ $EUID -eq 0 ]] || die "--on-host runs as root"
  local email=${1:-}
  local here; here=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
  mountpoint -q "$DATA_MOUNT" || die "$DATA_MOUNT is not mounted"

  log "packages"
  local codename
  # shellcheck disable=SC1091 # the host's file
  codename=$(. /etc/os-release && echo "$VERSION_CODENAME")
  if [[ ! -f /etc/apt/sources.list.d/pgdg.list ]]; then
    install -d /usr/share/postgresql-common/pgdg
    curl -fsSLo /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc
    echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $codename-pgdg main" \
      > /etc/apt/sources.list.d/pgdg.list
  fi
  # Without this, installing the server creates a cluster on /var/lib.
  install -d /etc/postgresql-common
  touch /etc/postgresql-common/createcluster.conf
  grep -q '^create_main_cluster' /etc/postgresql-common/createcluster.conf \
    || echo 'create_main_cluster = false' >> /etc/postgresql-common/createcluster.conf
  apt-get update -qq
  # --no-upgrade: installs what is missing, never upgrades (and restarts) PostgreSQL or nginx.
  apt-get install -y -qq --no-upgrade "postgresql-$PG_VERSION" "postgresql-client-$PG_VERSION" nginx certbot rsync curl xz-utils > /dev/null

  log "postgresql $PG_VERSION on $DATA_MOUNT"
  if ! pg_lsclusters -h | awk -v v="$PG_VERSION" '$1 == v && $2 == "main"' | grep -q .; then
    local taken; taken=$(pg_lsclusters -h | awk '$3 == 5432 { print $1 "/" $2 }')
    [[ -z $taken ]] || die "cluster $taken holds port 5432: drop it first (sudo pg_dropcluster ${taken/\// } --stop)"
    install -d -o postgres -g postgres -m 700 "$DATA_MOUNT/postgresql"
    pg_createcluster "$PG_VERSION" main -d "$DATA_MOUNT/postgresql/$PG_VERSION/main" -p 5432
  fi
  local pg_changed=0
  # 7 GB of RAM shared with three node processes. fsync, full_page_writes and synchronous_commit stay at their
  # defaults: UmbraDB's durability probe refuses or warns on the others.
  put "/etc/postgresql/$PG_VERSION/main/conf.d/umbradb.conf" 0644 postgres:postgres <<'EOF' && pg_changed=1
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB
max_wal_size = 4GB
checkpoint_timeout = 15min
wal_compression = on
EOF
  put "/etc/systemd/system/$PG_UNIT.service.d/mount.conf" 0644 root:root <<EOF && { systemctl daemon-reload; pg_changed=1; }
[Unit]
RequiresMountsFor=$DATA_MOUNT
EOF
  systemctl enable -q postgresql
  if ((pg_changed)); then systemctl restart "$PG_UNIT"; else systemctl start "$PG_UNIT"; fi

  log "user, role and databases"
  id umbradb &> /dev/null || useradd --system --create-home --home-dir "$APP" --shell /usr/sbin/nologin umbradb
  install -d -m 0750 -o umbradb -g umbradb "$APP"
  install -d -o umbradb -g umbradb "$APP/src" "$APP/node_modules"
  # Peer authentication: the umbradb OS user logs in as the umbradb role over the socket. CREATEROLE lets it create
  # the module roles; owning the databases lets it create their schemas.
  psql_admin <<'SQL'
SELECT 'CREATE ROLE umbradb LOGIN CREATEROLE' WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'umbradb') \gexec
SQL
  local net
  for net in "${NETWORKS[@]}"; do
    psql_admin -v db="umbradb_$net" <<'SQL'
SELECT format('CREATE DATABASE %I OWNER umbradb', :'db') WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'db') \gexec
SQL
  done

  log "configuration"
  # The configuration imports "umbradb": these links resolve it to the code deploy.sh builds, and give `config check`'s
  # type check that build's @types (Node.js's), which it looks up from the configuration's directory.
  ln -sfn ../src "$APP/node_modules/umbradb"
  ln -sfn ../src/node_modules/@types "$APP/node_modules/@types"
  chown -h umbradb:umbradb "$APP/node_modules/umbradb" "$APP/node_modules/@types"
  install -d -o umbradb -g umbradb "$APP/history"
  if [[ -f $APP/config.json ]]; then
    echo "$APP/config.json exists: kept as it is"
  else
    install -m 0640 -o umbradb -g umbradb "$here/deploy/config.json" "$APP/config.json"
    echo "$APP/config.json installed: set the node URLs in it (sudo -u umbradb editor $APP/config.json)"
  fi

  log "node $NODE_VERSION"
  if [[ $(/opt/node/bin/node --version 2> /dev/null) != "v$NODE_VERSION" ]]; then
    local tmp base=node-v$NODE_VERSION-linux-x64.tar.xz
    tmp=$(mktemp -d)
    curl -fsSLo "$tmp/$base" "https://nodejs.org/dist/v$NODE_VERSION/$base"
    curl -fsSLo "$tmp/SHASUMS256.txt" "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt"
    (cd "$tmp" && grep " $base\$" SHASUMS256.txt | sha256sum -c --quiet -)
    rm -rf /opt/node && install -d /opt/node
    tar -xJf "$tmp/$base" -C /opt/node --strip-components=1
    rm -rf "$tmp"
  fi

  log "systemd unit"
  # Ordered after PostgreSQL, so at shutdown each instance gets SIGTERM (the height in progress finishes) before the
  # database stops. deploy.sh enables and starts the instances.
  put /etc/systemd/system/umbradb@.service 0644 root:root <<EOF && systemctl daemon-reload
[Unit]
Description=UmbraDB %i
Requires=$PG_UNIT.service
After=$PG_UNIT.service network-online.target
Wants=network-online.target

[Service]
User=umbradb
Group=umbradb
WorkingDirectory=$APP
Environment=UMBRADB_NETWORK=%i
Environment=UMBRADB_PG_DUMP=/usr/lib/postgresql/$PG_VERSION/bin/pg_dump
ExecStart=/opt/node/bin/node $APP/src/dist/cli/main.js run --config $APP/umbradb.config.ts
TimeoutStopSec=300
Restart=on-failure
RestartSec=30
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=full

[Install]
WantedBy=multi-user.target
EOF

  # The token explorer: deploy.sh puts its code in $APP/explorer and its settings in $APP/explorer.env.
  put /etc/systemd/system/umbradb-explorer.service 0644 root:root <<EOF && systemctl daemon-reload
[Unit]
Description=UmbraDB token explorer
After=network.target

[Service]
User=umbradb
Group=umbradb
WorkingDirectory=$APP/explorer
EnvironmentFile=$APP/explorer.env
ExecStart=/opt/node/bin/node src/main.mjs
Restart=on-failure
RestartSec=10
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=full

[Install]
WantedBy=multi-user.target
EOF
  install -d -o umbradb -g umbradb "$APP/explorer"

  log "nginx and certificate for ${SITE_NAMES[*]}"
  install -d /var/www/certbot
  rm -f /etc/nginx/sites-enabled/default
  write_nginx
  if ! cert_covers_site; then
    local account=(--register-unsafely-without-email) names=() name
    [[ -n $email ]] && account=(--email "$email")
    for name in "${SITE_NAMES[@]}"; do names+=(-d "$name"); done
    # --expand: adds the names missing from an existing certificate.
    certbot certonly --webroot -w /var/www/certbot --cert-name "$DOMAIN" --expand "${names[@]}" \
      --non-interactive --agree-tos "${account[@]}" --deploy-hook 'systemctl reload nginx' \
      || die "certbot failed: do all of ${SITE_NAMES[*]} point here, and is port 80 open (GCP firewall)?"
    write_nginx
  fi

  log "provisioned: now ./deploy.sh"
}

# The site's names: $DOMAIN, and <network>.$DOMAIN, which opens the token explorer on that network.
SITE_NAMES=("$DOMAIN" "${NETWORKS[@]/%/.$DOMAIN}")

# Whether the certificate names every one of SITE_NAMES.
cert_covers_site() {
  local cert=/etc/letsencrypt/live/$DOMAIN/cert.pem names name
  [[ -f $cert ]] || return 1
  names=$(openssl x509 -in "$cert" -noout -ext subjectAltName)
  for name in "${SITE_NAMES[@]}"; do [[ $names == *"DNS:$name"* ]] || return 1; done
}

# The site: HTTP for the ACME challenge (and a redirect once there is a certificate), HTTPS with the token explorer at
# the root, each network's module API under /<network>/ and its admin endpoints under /<network>/admin/. On
# <network>.$DOMAIN, the root without ?network= redirects to the explorer's link to that network.
# shellcheck disable=SC2016 # nginx's variables, in single quotes
write_nginx() {
  local cert=/etc/letsencrypt/live/$DOMAIN net i
  {
    echo 'map $host $umbradb_host_network {'
    echo '    default "";'
    for net in "${NETWORKS[@]}"; do echo "    $net.$DOMAIN $net;"; done
    echo '}
map "$umbradb_host_network:$arg_network" $umbradb_network_redirect {
    default "";
    "~^([a-z]+):$" $1;
}
map $args $umbradb_more_args {
    "" "";
    default "&$args";
}
'
    cat <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${SITE_NAMES[*]};
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
EOF
    if [[ -f $cert/fullchain.pem ]]; then
        echo '    location / { return 301 https://$host$request_uri; }'
      cat <<EOF
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ${SITE_NAMES[*]};
    ssl_certificate $cert/fullchain.pem;
    ssl_certificate_key $cert/privkey.pem;

    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;

    # The token explorer; each network's own paths below take precedence.
    location / { proxy_pass http://127.0.0.1:$EXPLORER_PORT; }
    location = / {
        if (\$umbradb_network_redirect) { return 302 /?network=\$umbradb_network_redirect\$umbradb_more_args; }
        proxy_pass http://127.0.0.1:$EXPLORER_PORT;
    }
EOF
      for net in "${NETWORKS[@]}"; do
        i=$(index_of "$net")
        cat <<EOF
    location /$net/admin/ { proxy_pass http://127.0.0.1:808$i/; }
    location /$net/ { proxy_pass http://127.0.0.1:809$i/; }
EOF
      done
    else
      echo '    location / { return 404; }'
    fi
    echo '}'
  } | put /etc/nginx/sites-available/umbradb 0644 root:root || true
  ln -sf /etc/nginx/sites-available/umbradb /etc/nginx/sites-enabled/umbradb
  nginx -t -q
  systemctl enable -q nginx
  systemctl reload-or-restart nginx
}

case ${1:-} in
  "") provision ;;
  --on-host) shift; on_host "$@" ;;
  *) die "usage: ./provision.sh" ;;
esac
