# umbradb host runbook

The demo at https://midnight-tokens.zkdojo.com: one UmbraDB instance per network (`umbradb@<network>`) and the token
explorer (`umbradb-explorer`), behind nginx. `preview.`, `preprod.` and `mainnet.` subdomains open the explorer on that
network. Run everything from the laptop, in this repository.

| Task | Command |
|---|---|
| Ship code changes | `./deploy.sh` (add `--explorer` to also ship `../umbra-token-explorer-frontend`) |
| See what is running | `./deploy.sh status` |
| Follow a log | `./deploy.sh logs preview` (or `preprod`, `mainnet`, `explorer`) |
| Change node URLs | `./deploy.sh config`, then `./deploy.sh` |
| Turn a network on/off | `./deploy.sh start mainnet` / `./deploy.sh stop mainnet` (survives deploys and reboots) |
| Restore a backup | `./deploy.sh stop <network>`, then `./deploy.sh restore <network> /mnt/data/db-backup/<file>`, then `./deploy.sh start <network>` |
| Change packages, Postgres, nginx, certificates, systemd units | edit `provision.sh`, then `./provision.sh` |

## Restoring

- The database must be empty: drop and recreate it first if not
  (`sudo -u postgres dropdb umbradb_<network>`, then `./provision.sh` recreates it).
- The `umbradb` user must be able to read the file (`sudo chgrp umbradb <file> && sudo chmod g+r <file>`).
- The restore writes the backup's history to `~umbradb/history/<network>.json`, which the configuration names. A
  backup made by an older build then runs this build's entries from the height after it.
- Every deploy rewrites each network's history file from its database (`umbradb history export`) while the instances
  are stopped, so a new build takes over each running database from its current height.

## On the host

| What | Where |
|---|---|
| Settings (node URLs) | `/home/umbradb/config.json` (never overwritten) |
| Configuration | `/home/umbradb/umbradb.config.ts` (from `deploy/umbradb.config.ts`, each deploy) |
| Code | `/home/umbradb/src`, `/home/umbradb/explorer` |
| What was deployed | `/home/umbradb/DEPLOYED` |
| Databases | PostgreSQL 18 cluster `18/main` on `/mnt/data/postgresql`, one database per network |
| Backups | `/mnt/data/db-backup` |
