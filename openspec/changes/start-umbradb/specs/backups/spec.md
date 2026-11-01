# Spec delta — `backups` capability

Modifies `core-arch`'s `specs/backups/spec.md` (`start-umbradb` `design.md` §0: `core-arch` is archived first). Each
requirement is restated in full; the change is the library entry of `start-umbradb` (`specs/library-mode/spec.md`).

## MODIFIED Requirements

### Requirement: BK-1 Backup

THE system SHALL write a backup with `umbradb backup --out <file>` while the process runs, and automatically right after
the core's `on-stop-height` WHERE `backupAtStop` is set and no backup for that height exists yet. On PostgreSQL it SHALL
run the PostgreSQL 18 client's `pg_dump`; on PGlite, `pg_dump` of `@electric-sql/pglite-tools`. Neither tool is a
dependency of UmbraDB: the command SHALL look for it when it runs and, IF it is missing or not of major version 18, fail
with `backup-tools-missing` and say what to install (owner decision Q85). The dump and the manifest SHALL see the same
committed height: on PostgreSQL the command reads the cursor and computes the contents hash in one `REPEATABLE READ READ
ONLY` transaction whose snapshot `pg_dump` uses (`--snapshot`); on PGlite all of it runs as one queued job, so commits
wait. THE finalized loop SHALL pause and continue on request (`UmbraDBHandle.pause()`, `resume()`) only between heights
— no transaction open and the height's reads finished —, so a paused process loses and repeats no height; WHERE
`backupOnSignal` (CF-4) is set, a running process SHALL, on SIGUSR2, write a backup to that path at its next pause, as
the backup at stop writes one, and continue (owner decision Q152): the way to back up from a shell a running PGlite
process, whose directory the command cannot open while the process holds it (DB-11). `umbradb run` SHALL listen for
SIGUSR2 WHERE `backupOnSignal` is not set too and, on one, log that it was ignored, naming `backupOnSignal`, and
continue; a library process (`startUmbraDB`) SHALL add no SIGUSR2 listener and SHALL refuse `backupAtStop` and
`backupOnSignal` (`library-setting-refused`, LM-2), its host writing backups with `UmbraDBHandle.backup` (owner decision
Q173). Every backup file the system writes on Node.js — `umbradb backup`, at stop, on SIGUSR2, `UmbraDBHandle.backup` —
SHALL be created owner-only (mode `0600`) from its first byte, its temporary file included, and keep that mode through
its rename.

#### Scenario: Backup while syncing
- **WHEN** a backup is written while blocks keep committing
- **THEN** every table in it reflects the height in its manifest, and its contents hash equals the manifest's

#### Scenario: A backup of a running PGlite process
- **WHEN** a process on PGlite with `backupOnSignal` set receives SIGUSR2 while blocks commit
- **THEN** it writes a backup at its next pause and goes on from the next height, and the file restores like any other

#### Scenario: SIGUSR2 to `umbradb run` without `backupOnSignal`
- **WHEN** `umbradb run` without `backupOnSignal` receives SIGUSR2 while blocks commit
- **THEN** it logs that the signal was ignored because `backupOnSignal` is not set, writes no file, and keeps running

#### Scenario: No `pg_dump` on the machine
- **WHEN** `umbradb backup` runs against PostgreSQL on a machine without the PostgreSQL 18 client
- **THEN** it fails with `backup-tools-missing`, naming the tool and the version it needs, and writes no file
