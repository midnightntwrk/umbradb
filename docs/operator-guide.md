# UmbraDB operator guide

For the operator who runs an UmbraDB indexer: the commands it ships and what each needs on the machine. The
specification is the OpenSpec change `core-arch` (`openspec/changes/core-arch/`); this guide names its requirements
where it relies on them.

## The database

The `core` entry's `database` names where the indexer keeps its data (CF-4): a PostgreSQL URL (`postgres://…` or
`postgresql://…`) or, under the development opt-in (`developmentOptIn: true`, CF-9), `pglite:<directory>` — a PGlite
database in that directory, a relative path read from the process's working directory — or `pglite:memory`, a
database that lives inside its process only. The setting is secret: logs and `/config` show it as `[redacted]`.

A PGlite directory that does not exist yet is created, with any missing parent directory, by what writes the database:
`umbradb run` (and a host program's process) and `umbradb restore` into its target (owner decision Q163). In a new
checkout, `pglite:data/preview` creates `data/` and `data/preview` at the first `umbradb run`; a mistyped path creates
a new, empty database instead of failing. What only reads creates nothing: `umbradb config check --database` checks a
missing directory as a new database, and `umbradb backup` refuses one (`no-committed-height`). Beside the directory
the process keeps its writer lock, `<directory>.lock.sqlite` (DB-11): one process at a time opens a PGlite directory.

## The node on `/status`

On the core, `/status` (the admin endpoints on `listen.admin`) shows in `node` what the process knows of its node
(AE-5). Heights are decimal text:

- `finalizedHead`: the node's finalized head the process last read.
- `bestHead`: the best head the node announced last, the height of its latest new-heads notification (lower than an
  earlier one after the node switched to another branch); null until the node announced one.
- `connection`: the state of the process's one connection to the node. `connecting` before it first connected,
  `connected` while it is open, `retrying` from a failed or lost connection until the next one opens, `closed` once
  the process closed it (a stop, a refused start). Null only for the moment before the process makes its client.
- `retries`: how many times the node has failed in the retry now under way (the condition `node-retrying`); 0 when
  none is.
- `queueDepth`: how many best blocks above the finalized head are queued, fetched and parsed ahead of finality
  (IN-6); 0 during startup and while the process catches up, when it queues none.
- `tipCap`: the most best blocks the queue holds (the `core` entry's `tipCap`).
- `finalityStall`: whether the queue is full, so that new best blocks wait for finality (the condition
  `finality-stall`).

A private process has no node: its `node` is null. The process publishes what `/status` shows at least once a second,
and at once when the connection's state changes.

## A paused loop on `/status`

The loop that processes finalized blocks can be paused between two heights: by a host program through its handle's
`pause()` until `resume()`, or by a backup on SIGUSR2 (below) until that backup is written. While it is paused,
`/status` lists the condition `paused` (AE-3, owner decision Q174):

```json
{ "code": "paused", "since": "2026-10-28T09:15:02.5Z", "by": "pause" }
```

- `since`: when the loop paused, as RFC 3339 text in UTC. It stays the same for as long as the loop stays paused.
- `by`: `pause` while a host program's `pause()` holds the loop — it goes on only after `resume()` —, else `signal`
  while only a backup on SIGUSR2 does; it goes on once the backup is written.

The condition is gone as soon as the loop may run again, and is published at once when it appears or goes. A paused
loop reads no new head, so `head` and `lag` are those it read before the pause, and readiness does not change:
`/health/ready` answers as for an unpaused process with that lag (AE-4). A pause that lasts while the chain moves on
therefore keeps a ready instance ready on data that grows stale; watch for `paused` with an old `since` if a host
program pauses the loop for long.

## Backups

A backup is a `pg_dump` file of the indexer's database at one committed height, with UmbraDB's manifest as its first
line (BK-1, BK-2). Use it to move an indexer to a new server, or to start a new instance mid-chain without syncing from
genesis. Checking that two databases hold the same data is a different job: compare their contents hashes and per-table
digests (`/status`), not their backup files — two backups of equal data need not be equal byte for byte.

### Writing a backup

```sh
umbradb backup --out indexer-1774000.backup [--config umbradb.config.ts]
```

The command reads the configuration file — `--config`, or `umbradb.config.ts` in the working directory, as `umbradb
run` does — for the database, the side (core or private) and the development opt-in, and writes the file once the
backup is complete: a failed or interrupted backup leaves no file at that path, and an earlier file there is kept. It
prints the file, the height, the contents hash and the tool, and exits 0; it exits 1 when refused, and 2 on a wrong
argument.

- **On PostgreSQL** it runs the PostgreSQL 18 client's `pg_dump`, in the snapshot of a read that also reads the
  manifest: the backup holds exactly one committed height while the indexer goes on writing beside it. `pg_dump` is
  not a dependency of UmbraDB: install the PostgreSQL 18 client (`postgresql-client-18` on Debian and Ubuntu,
  `postgresql18` on Alpine and Fedora, `postgresql@18` with Homebrew) and put its `pg_dump` on `PATH`, or name it with
  `UMBRADB_PG_DUMP=/path/to/pg_dump`. A missing `pg_dump`, or one of another major version, fails with
  `backup-tools-missing` and says what to install. The database URL's password reaches `pg_dump` in its environment,
  never on its command line.
- **On PGlite** (a development database, under the development opt-in) it runs `pg_dump` of
  `@electric-sql/pglite-tools`, which is not installed with UmbraDB either: `npm install
  @electric-sql/pglite-tools@0.4.10`, the version made for UmbraDB's PGlite 0.5.10. A PGlite directory opens in one
  process at a time: while the indexer runs on it the command refuses with `writer-lock-held`. Back a running PGlite
  indexer up through the process itself — set `backupOnSignal` and send it SIGUSR2, or set `backupAtStop`, both
  below, or, from a host program, call its handle's `backup(file)`, which runs between two blocks.
- **A private process's database** is not backed up by UmbraDB unless the development opt-in is set (PP-12):
  `private-backup-refused`. PostgreSQL's own tools can still copy it; that rule governs only what UmbraDB writes.

### A backup at the core's stop

Set the `core` entry's `backupAtStop` to a file path (relative to the process's working directory): right after the
core's stop height commits, the process writes a backup of that height there (CORE-ARCH §4.15). A restart with the
cursor at the stop writes none while the file there is a backup of that height; a backup of another height there is
replaced once the new one is complete. A file there that is not an UmbraDB backup is never overwritten: the process
logs `backup at stop failed (backup-format-unknown)` and stays `stopped`.

### A backup of a running process (SIGUSR2)

Set the `core` entry's `backupOnSignal` to a file path (relative to the process's working directory) and send the
running process SIGUSR2 — `kill -USR2 <pid>` — to write a backup there without stopping it (BK-1, owner decision
Q152): the process finishes the height it is on, pauses between two heights, writes the backup of its last committed
height, and goes on from the next one. This is how to back up a running PGlite indexer from a shell; it works the same
on PostgreSQL. At startup the process logs `SIGUSR2 writes a backup to <path> at the loop's next pause
(backupOnSignal)`; for each signal it logs what it did:

- `backup on signal written to <path>: height <h>, contents hash <hash>`;
- `backup on signal: <path> holds a backup of height <h> already, so none was written` — nothing committed since that
  backup;
- `backup on signal failed (<code>): …` — the file at the path is not an UmbraDB backup and is left as it is
  (`backup-format-unknown`), the tool is missing (`backup-tools-missing`), nothing is committed yet
  (`no-committed-height`), or a private process's backup without the development opt-in (`private-backup-refused`).

The file is written as `umbradb backup` writes one: under a temporary name, renamed only once complete. A SIGUSR2
while a backup is pending or being written adds none; one after the process stopped at the core's stop height writes
the backup of that height at once; a stop while a backup is written waits for it.

Without `backupOnSignal`, `umbradb run` still listens for SIGUSR2 (owner decision Q173): a SIGUSR2 sent by mistake
logs `SIGUSR2 ignored: backupOnSignal is not set, so no backup is written`, writes no file, and the indexer keeps
running. While it is still starting it logs `SIGUSR2 ignored: the process is starting and has not listened for it
(backupOnSignal not set or not yet read)` instead: a process that sets `backupOnSignal` listens once its configuration
is validated, so send the signal once it has logged `SIGUSR2 writes a backup to <path> …`. A process a host program
starts with `startProcess` adds no SIGUSR2 listener unless it sets `backupOnSignal`: there SIGUSR2 does what Node.js or
the host program's own handler does (by default, it ends the process). A host program can pause and resume the loop
itself with its handle's `pause()` and `resume()`.

### What a backup holds

Every table of the database, as plain SQL (`--inserts --no-owner --no-privileges`), at the manifest's height — tables
declared `deterministic: false` with their rows and their sequences' positions. A sequence is not transactional:
taken beside a running indexer on PostgreSQL, its position in the file can be ahead of its table's rows (never behind
them), so values a restored indexer gives such a column may skip some numbers.

A backup holds every row of the database — a private process's too, when written under the development opt-in — so
every backup file UmbraDB writes (`umbradb backup`, at the core's stop, on SIGUSR2, a handle's `backup(file)`) is
created with mode `0600`, whatever the process's umask: its owner, the user the indexer runs as, can read and write it;
no one else can. Its temporary file has that mode from its creation, before its first byte, and keeps it when it is
renamed to the path; a file it replaces there does not pass its own mode on. Where file modes do not apply — on
Windows, where Node.js's file modes set only whether a file can be written, and on file systems mounted without POSIX
permissions — the folder's or the mount's permissions decide who can read a backup; a file system that refuses to set
the mode fails the backup, and no file is written. UmbraDB neither encrypts nor signs a backup: storing, moving and
encrypting backups, and knowing where each one came from, are the operator's (owner decision Q178; the threat model's
[Backups and restore](THREAT_MODEL.md#backups-and-restore)).

### Restoring a backup

```sh
umbradb restore indexer-1774000.backup [--config umbradb.config.ts]
```

**Restore only backups from a source you trust — your own.** A restore runs the file's SQL with the database login's
rights: a file that was changed, or written by someone else, can create functions, triggers or views, change any
table, and on a server whose login is a superuser do more than that, before any check after loading can refuse it
(BK-3, owner decision Q83). The manifest's checks and the contents hash catch a backup that is damaged or from another
chain; they do not make a hostile file safe to run. UmbraDB keeps it that way on purpose — a restore runs the file's
SQL with the writer's rights before its checks after loading, so restore only backups you wrote (owner decision Q177;
the threat model's [Backups and restore](THREAT_MODEL.md#backups-and-restore)).

The command restores into the configuration file's database, which must be empty — a new PostgreSQL database, or a
PGlite directory with no database in it (the command creates it, with any missing parent directory, once the checks
before loading have passed: a refused restore creates nothing). The configuration must be the one the backup's indexer
ran with: the same S and the same entries up to the backup's height (later changes, above it, are allowed), and a
build that carries their versions and every migration the backup's database applied. The command reads the
configuration's node to check the chain. It refuses, and leaves the target as it was, when:

| Code | Why |
|---|---|
| `restore-target-not-empty` | the target holds a schema, or anything in `public` |
| `backup-format-unknown` | the file is no backup of format 1, or its SQL holds what a restore does not run (a `psql` meta-command other than `\restrict`/`\unrestrict`, a `COPY … FROM stdin`, a cut-off end) |
| `backup-history-mismatch` | the configuration's S or its history up to the backup's height differs from the backup's |
| `backup-build-mismatch` | the build lacks the version of an entry at the backup's height + 1, or a migration the backup applied |
| `backup-genesis-mismatch` | the node serves another chain |
| `backup-block-not-finalized` | the node has not finalized the backup's block, or finalized another one at its height |
| `contents-hash-mismatch` | the restored data is not what the backup's manifest says (checked before the commit) |
| `backup-root-mismatch` | with `core-ledger-state`, the stored ledger state root at the backup's height is not the node's |

The first six are checked before anything is loaded; the last two after loading, inside the restore's one transaction,
which then rolls back. A restore interrupted halfway — a crash, a kill — leaves the target empty, and can be run again.
The restored database gets UmbraDB's module roles (created on the server if missing: the login needs `CREATEROLE`, as
for a first start) and the owners and grants a database built by migrations has. Start the indexer on it with the same
configuration: it keeps the backup's S and resumes from the backup's height + 1.

A private process's backup (written under the development opt-in) is restored the same way, with the private
process's configuration: the command checks it against the configured public database instead of a node — read as the
private process reads it, a PostgreSQL `publicDatabase` directly or else through the core's transport at
`coreTransport`, so a PGlite public database needs its core running —: the public database's genesis hash and S must
be the ones the backup's database is bound to, else `private-binding-mismatch` names which (`public-not-started`,
`network` and `private-start-below` before loading; `genesis` and `start`, read from the backup's own binding, after
loading, inside the restore's transaction), and the public database's committed block at the backup's height must be
the backup's (`backup-block-not-finalized`). The restored private process continues from its public database at the
backup's height + 1.

## A private process and a changed public configuration

A private process keeps the public configuration hash it accepted: `X-Umbra-Config-Hash`, which every answer of the
core's module API carries, a hash of the core's recorded configuration that leaves out secrets and operational
settings (PP-14, RN-16). Its first start records the hash it finds. When the core restarts with another configuration
— a data field, a revision, the table items a module provides —, a running private process halts with
`public-config-changed`, and each later start stops with the same code, its log line naming the new hash and the flag
that accepts it. Check that the core's new configuration still provides what the private modules read, then start the
private process with that hash:

```sh
umbradb run --update-hash=0x<64 hex digits> [--config umbradb.config.ts]
```

That start runs every check of the public side — the binding, the public table items its modules require — and
records the hash once they pass; later starts need no flag. A hash given that is not the one found accepts nothing, and
the start stops as before; a value that is not `0x` and 64 lowercase hex digits prints the usage (exit 2). A start can
also stop when the core's configuration changes during it, or when `coreTransport` and `publicDatabase` are not one
core's: start it again once both give one hash. A restored private backup holds the hash its process had accepted, so
the restored process's first start compares it the same way.
