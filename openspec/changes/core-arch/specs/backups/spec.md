# Spec delta — `backups` capability

EARS forms and terms as in `specs/runner/spec.md` and `specs/determinism/spec.md`. A **backup** is a `pg_dump` file of
a database at one committed height, with UmbraDB's manifest as its first line (owner decisions Q83, Q85). Checking that
two databases hold the same data is the job of the contents hash and the per-block digests (DT-3 to DT-5), not of
backups.

## ADDED Requirements

### Requirement: BK-1 Backup

THE system SHALL write a backup with `umbradb backup --out <file>` while the process runs, and automatically right
after the core's `on-stop-height` WHERE `backupAtStop` is set and no backup for that height exists yet. On PostgreSQL it
SHALL run the PostgreSQL 18 client's `pg_dump`; on PGlite, `pg_dump` of `@electric-sql/pglite-tools`. Neither tool is a
dependency of UmbraDB: the command SHALL look for it when it runs and, IF it is missing or older than PostgreSQL 18,
fail with `backup-tools-missing` and say what to install (owner decision Q85). The dump and the manifest SHALL see the
same committed height: on PostgreSQL the command reads the cursor and computes the contents hash in one `REPEATABLE READ
READ ONLY` transaction whose snapshot `pg_dump` uses (`--snapshot`); on PGlite all of it runs as one queued job, so
commits wait.

#### Scenario: Backup while syncing
- **WHEN** a backup is written while blocks keep committing
- **THEN** every table in it reflects the height in its manifest, and its contents hash equals the manifest's

#### Scenario: No `pg_dump` on the machine
- **WHEN** `umbradb backup` runs against PostgreSQL on a machine without the PostgreSQL 18 client
- **THEN** it fails with `backup-tools-missing`, naming the tool and the version it needs, and writes no file

### Requirement: BK-2 The file

THE backup file SHALL be plain SQL as the tool writes it, with `--inserts` (so PGlite can run it), `--no-owner` and
`--no-privileges` (so it does not name the source's roles), preceded by one line: an SQL comment holding the manifest as
JSON — `format` (1), `genesisHash`, `start` (S), `height`, `blockHash`, `stateRoot` (or null), `history` (every
`core_chain.config` row), `migrations` (every `core_chain.migrations` row), `contentsHash` (DT-3, computed in the same
snapshot as the dump), the UmbraDB version, the PostgreSQL version and the tool that wrote it. A table declared
`deterministic: false` (Q76) is in the file with its rows and its sequences' positions; the contents hash covers it by
name only.

#### Scenario: Both backends write a restorable file
- **WHEN** one backup is written on PostgreSQL 18 and one on PGlite at the same height with the same history
- **THEN** each restores on the other backend, and their manifests hold equal contents hashes

### Requirement: BK-3 Restore into an empty database, checked before and after loading

THE system SHALL restore a backup with `umbradb restore <file>` into an empty database only. Before loading anything it
SHALL refuse IF the target is not empty (`restore-target-not-empty`); the manifest's format is unknown
(`backup-format-unknown`); the configuration's history differs from the manifest's up to its height, versions included
(`backup-history-mismatch`); the build does not carry the versions of the revisions covering height + 1 or every
recorded migration with the same ids and checksums (`backup-build-mismatch`); the genesis hash differs from the node's
(`backup-genesis-mismatch`); or the manifest's block is not finalized on the node with the same hash
(`backup-block-not-finalized`). It SHALL then, in one transaction on the writer connection, run the file's SQL itself,
give every schema, table, sequence and function the owner and grants DB-6 and DB-7 require (creating the module roles if
the server lacks them), recompute the contents hash and compare it with the manifest's (`contents-hash-mismatch`), and,
WHERE `core-ledger-state` is in the history, compare the stored state root at the manifest's height with the node's
(`backup-root-mismatch`); any failure SHALL roll the whole restore back, leaving the target empty. Because a restore
runs the file's SQL with the writer's rights, THE operator documentation SHALL say to restore only backups from a
trusted source.

#### Scenario: A changed row
- **WHEN** one value in a backup file's `INSERT` statements is changed
- **THEN** restore refuses with `contents-hash-mismatch` and the target stays empty

### Requirement: BK-4 A restored database continues like one that never stopped

WHEN a backup taken at h is restored and the process continues to h + 100, THE database SHALL keep the backup's S and
resume from h + 1, and SHALL hold the same contents hash and the same per-table digests as an instance that synced to
h + 100 without stopping, on either backend.

#### Scenario: Restore on the other backend
- **WHEN** a backup written on PostgreSQL 18 at h is restored on PGlite, one written on PGlite is restored on PostgreSQL
  18, and each continues to h + 100
- **THEN** both equal an uninterrupted run at h + 100: the same contents hash and the same digests

### Requirement: BK-5 The browser

THE browser page SHALL offer the same backup and restore on its PGlite database, through `pglite-tools`, with the
checks of BK-3.

#### Scenario: Backup in the page
- **WHEN** the user backs up the page's database and restores the file into a fresh profile
- **THEN** the restore passes every check of BK-3 and the page continues from the backup's height + 1
