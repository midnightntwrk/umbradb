# UmbraDB operator guide

For the operator who runs an UmbraDB indexer: the commands it ships and what each needs on the machine.

## The database

The `core` entry's `database` names where the indexer keeps its data, as parts, never a connection string
: a URL such as `postgres://…` or a `pglite:` text is refused, with its path, before anything
opens.

```ts
// PostgreSQL
database: { kind: "postgres", host: "db.internal", port: 5432, user: "umbradb", password: "…", name: "indexer" },
// PGlite in a directory, under the development opt-in (developmentOptIn: true)
database: { kind: "pglite", path: "data/preview" },
// PGlite in memory, under the development opt-in: the database lives inside its process only
database: { kind: "pglite", memory: true },
```

- `port` is 5432 unless given. `password` may be left out: the PostgreSQL driver then takes `PGPASSWORD` from the
  process's environment, as libpq does.
- A `host` starting with `/` is a Unix socket directory: the process connects to `<host>/.s.PGSQL.<port>`.
- A PGlite `path` is a directory, a relative one read from the process's working directory (a host program's
  `startUmbraDB` reads it from its `cwd`).
- Only `password` is secret: `/config` shows it as `[redacted]`, and every log line and error hides it wherever it
  appears. The host, port, user, name, `ssl` and a PGlite `path` are shown in `/config` and in the log, so a mistyped
  host or directory can be seen.

### TLS to PostgreSQL: `ssl`

`ssl` says how the connection to PostgreSQL is protected:

- `disable`: no TLS.
- `require`: TLS, the server's certificate not checked. The traffic is encrypted, but a machine that can intercept it
  can pose as the server.
- `verify-full`: TLS, the certificate checked against Node.js's built-in trust roots and the host name checked against
  the certificate.

Without `ssl`, the default is `disable` for a host that never leaves the machine — `localhost`, `127.0.0.1`, `::1`, or
a socket directory — and `require` for every other host. A port forwarded to `localhost` therefore runs in clear by
default; write `ssl: "require"` or `ssl: "verify-full"` for it.

`verify-full` takes no setting for another certificate authority: it checks against Node.js's built-in roots only. A
server whose certificate comes from a private CA (common for self-hosted and some managed PostgreSQL) cannot be
verified this way; use `require` for it, or give the server a certificate from a public CA. Node.js reads extra roots
from `NODE_EXTRA_CA_CERTS` at its start, which is the process's own trust configuration, not UmbraDB's.

`umbradb backup` hands the same parts to `pg_dump` in libpq's environment (`PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`,
`PGPASSWORD`, `PGSSLMODE`); for `verify-full` it adds `PGSSLROOTCERT=system`, which makes libpq check against the
operating system's trust store, the closest libpq has to Node.js's roots.

### A PGlite directory that does not exist

A PGlite directory that does not exist yet is created, with any missing parent directory, by what writes the database:
`umbradb run` (and a host program's process) and `umbradb restore` into its target. Each says
so, naming the path as configured: the process logs, and the restore prints,

```text
created a new PGlite data directory data/preview (and 1 missing parent directory)
```

In a new checkout, `path: "data/preview"` creates `data/` and `data/preview` at the first `umbradb run`; a mistyped
path creates a new, empty database instead of failing, and that line names it. What only reads creates nothing:
`umbradb config check --database` checks a missing directory as a new database, and `umbradb backup` refuses one
(`no-committed-height`). Beside the directory the process keeps its writer lock, `<directory>.lock.sqlite`:
one process at a time opens a PGlite directory.

### Checking a configuration against its database

`umbradb config check <file> --database` reads the configuration history of the database the file's `core` entry
configures, read-only, and checks the file against it. The flag takes no value: to check against another
database, write a file that names it. On PostgreSQL the check uses one read connection and takes no writer lock, so it
runs beside the process that writes the database; on PGlite it needs the file's development opt-in and the
directory's lock, so it cannot run while a process has the directory open. A PGlite database in memory cannot be read
from outside its process, and the check says so.

### The transport reader

A core on PostgreSQL that listens for private processes (`listen.privateLink`) runs their reads on a login of its own,
`transportReader`. The setting is required there, and refused on PGlite, whose database has one
session. A host program that carries the link itself — over channels, or at an address it gives in code
(`startUmbraDB`'s `network`, [module guide](module-guide.md) §18) — needs it too, else startup refuses
`private-link-misconfigured` (`reader-missing`), and the reads run on it as below. A listening core's settings:

```ts
database: { kind: "postgres", host: "db.internal", user: "umbradb", password: "…", name: "indexer" },
listen: { privateLink: "0.0.0.0:7000" },
transportReader: { user: "umbradb_transport", password: "…" },
```

The login uses `database`'s host, port, name and `ssl`; only its `user` and `password` are its own, and its
`password` is secret like `database`'s. The core opens a separate pool of read connections with it, and every `read`
a private process sends runs there, so a statement that tries to write is refused by PostgreSQL itself, whatever its
text. Before the transport listens, the core checks the login and refuses to start with `transport-reader-can-write`,
naming the login and what it found, if the login:

- is a superuser;
- holds `CREATEROLE`, `CREATEDB` or `BYPASSRLS`;
- is a member of `database`'s login (or is that login);
- holds anything beyond reading on the database's own schemas: `CREATE` on the database or on a schema; `INSERT`,
  `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, `TRIGGER` or `MAINTAIN` on a table or view; `USAGE` or `UPDATE` on a
  sequence (`nextval`). Grants to `PUBLIC` and through other roles count.

Create the login once, as a superuser or a role that may grant `pg_read_all_data`:

```sql
CREATE ROLE umbradb_transport LOGIN PASSWORD '…';
GRANT pg_read_all_data TO umbradb_transport;
```

`pg_read_all_data` gives `SELECT` on every table and `USAGE` on every schema, including tables a module creates later,
and nothing else. Allow the login in `pg_hba.conf` for the database. Grant it nothing that writes, and do not make it a
member of the indexer's login: the check refuses such a login at every start. A table that a later
migration creates is checked at the next start.

The core's own rules for a `read` still apply in front of this login: one statement, `SELECT`, `WITH`, `VALUES` or
`TABLE` only, no `pg_` functions and none of a list of others (`docs/THREAT_MODEL.md`). Together they keep a private
process's reads to reads: the rules stop what any login may still do (advisory locks, session settings), and the login
stops a write the rules miss.

## The node on `/status`

On the core, `/status` (the admin endpoints on `listen.admin`) shows in `node` what the process knows of its node
. Heights are decimal text:

- `finalizedHead`: the node's latest finalized head the process holds, from its subscription to the node's finalized
  heads, read without asking the node. It rises as the node finalizes, also while the process is still working through
  the heights up to an earlier head. `/status`'s `head` is the same height, and its `lag` is computed from it.
- `bestHead`: the best head the node announced last, the height of its latest new-heads notification (lower than an
  earlier one after the node switched to another branch); null until the node announced one.
- `connection`: the state of the process's one connection to the node. `connecting` before it first connected,
  `connected` while it is open, `retrying` from a failed or lost connection until the next one opens, `closed` once
  the process closed it (a stop, a refused start). Null only for the moment before the process makes its client.
- `retries`: how many times the node has failed in the retry now under way (the condition `node-retrying`); 0 when
  none is.
- `queueDepth`: how many best blocks above the finalized head are queued, fetched and parsed ahead of finality
; 0 during startup and while the process catches up, when it queues none.
- `tipCap`: the most best blocks the queue holds (the `core` entry's `tipCap`).
- `finalityStall`: whether the queue is full, so that new best blocks wait for finality (the condition
  `finality-stall`).

A private process has no node: its `node` is null. The process publishes what `/status` shows at least once a second,
and at once when the connection's state changes.

## A paused loop on `/status`

The loop that processes finalized blocks can be paused between two heights: by a host program through its handle's
`pause()` until `resume()`, or by a backup on SIGUSR2 (below) until that backup is written. While it is paused,
`/status` lists the condition `paused`:

```json
{ "code": "paused", "since": "2026-10-28T09:15:02.5Z", "by": "pause" }
```

- `since`: when the loop paused, as RFC 3339 text in UTC. It stays the same for as long as the loop stays paused.
- `by`: `pause` while a host program's `pause()` holds the loop — it goes on only after `resume()` —, else `signal`
  while only a backup on SIGUSR2 does; it goes on once the backup is written.

The condition is gone as soon as the loop may run again, and is published at once when it appears or goes. It does
not change readiness itself: `/health/ready` answers as for an unpaused process with the same lag. A paused loop
processes nothing, but on the core `head` is the node's finalized head as the process holds it, so while the chain
moves on the lag grows: with `readinessLag` set, a long pause takes the core out of traffic once the lag exceeds it;
without it, the core stays ready on data that grows stale. A private process's `head` is the highest public cursor its
source has read. If its loop paused while it was waiting for the public process to commit its next height, that wait
goes on and reads the public cursor once the public process has committed that height, so `head` can still rise while
the cursor stays: the lag grows and, with `readinessLag` set, can take the private process out of traffic. Nothing else
raises a private process's `head` during a pause: one paused while it was not waiting, or once that wait has ended,
keeps its `head` and `lag` until the loop runs again. Watch for `paused` with an old `since` if a host program pauses
the loop for long.

## Backups

A backup is a `pg_dump` file of the indexer's database at one committed height, with UmbraDB's manifest as its first
line. Use it to move an indexer to a new server, or to start a new instance mid-chain without syncing from
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
  `backup-tools-missing` and says what to install. The database's parts reach `pg_dump` in libpq's environment (see
  "TLS to PostgreSQL" above), the password as `PGPASSWORD`, never on its command line.
- **On PGlite** (a development database, under the development opt-in) it runs `pg_dump` of
  `@electric-sql/pglite-tools`, which is not installed with UmbraDB either: `npm install
  @electric-sql/pglite-tools@0.4.10`, the version made for UmbraDB's PGlite 0.5.10. A PGlite directory opens in one
  process at a time: while the indexer runs on it the command refuses with `writer-lock-held`. Back a running PGlite
  indexer up through the process itself — set `backupOnSignal` and send it SIGUSR2, or set `backupAtStop`, both
  below, or, from a host program, call its handle's `backup(file)`, which runs between two blocks.
- **A private process's database** is not backed up by UmbraDB unless the development opt-in is set:
  `private-backup-refused`. PostgreSQL's own tools can still copy it; that rule governs only what UmbraDB writes.

### A backup at the core's stop

Set the `core` entry's `backupAtStop` to a file path (relative to the process's working directory): right after the
core's stop height commits, the process writes a backup of that height there. A restart with the
cursor at the stop writes none while the file there is a backup of that height; a backup of another height there is
replaced once the new one is complete. A file there that is not an UmbraDB backup is never overwritten: the process
logs `backup at stop failed (backup-format-unknown)` and stays `stopped`.

### A backup of a running process (SIGUSR2)

Set the `core` entry's `backupOnSignal` to a file path (relative to the process's working directory) and send the
running process SIGUSR2 — `kill -USR2 <pid>` — to write a backup there without stopping it: the process finishes the height it is on, pauses between two heights, writes the backup of its last committed
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

Without `backupOnSignal`, `umbradb run` still listens for SIGUSR2: a SIGUSR2 sent by mistake
logs `SIGUSR2 ignored: backupOnSignal is not set, so no backup is written`, writes no file, and the indexer keeps
running. While it is still starting it logs `SIGUSR2 ignored: the process is starting and has not listened for it
(backupOnSignal not set or not yet read)` instead: a process that sets `backupOnSignal` listens once its configuration
is validated, so send the signal once it has logged `SIGUSR2 writes a backup to <path> …`. A process a host program
starts with `startUmbraDB` adds no SIGUSR2 listener: it refuses `backupOnSignal` and `backupAtStop`
(`library-setting-refused`), so SIGUSR2 there does what Node.js or the host program's own handler does (by default, it
ends the process). A host program writes its backups with its handle's `backup(target)`, and can pause and resume the
loop itself with `pause()` and `resume()`.

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
encrypting backups, and knowing where each one came from, are the operator's (the threat model's
[Backups and restore](THREAT_MODEL.md#backups-and-restore)).

### Restoring a backup

```sh
umbradb restore indexer-1774000.backup [--config umbradb.config.ts]
```

**Restore only backups from a source you trust — your own.** A restore runs the file's SQL with the database login's
rights: a file that was changed, or written by someone else, can create functions, triggers or views, change any
table, and on a server whose login is a superuser do more than that, before any check after loading can refuse it
. The manifest's checks and the contents hash catch a backup that is damaged or from another
chain; they do not make a hostile file safe to run. UmbraDB keeps it that way on purpose — a restore runs the file's
SQL with the writer's rights before its checks after loading, so restore only backups you wrote (the
threat model's [Backups and restore](THREAT_MODEL.md#backups-and-restore)).

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
`privateLink`, so a PGlite public database needs its core running —: the public database's genesis hash and S must
be the ones the backup's database is bound to, else `private-binding-mismatch` names which (`public-not-started`,
`network` and `private-start-below` before loading; `genesis` and `start`, read from the backup's own binding, after
loading, inside the restore's transaction), and the public database's committed block at the backup's height must be
the backup's (`backup-block-not-finalized`). The restored private process continues from its public database at the
backup's height + 1.

## A private process and a changed public configuration

A private process keeps the public configuration hash it accepted: `X-Umbra-Config-Hash`, which every answer of the
core's module API carries, a hash of the core's recorded configuration that leaves out secrets and operational
settings. Its first start records the hash it finds. When the core restarts with another configuration
— a data field, a revision, the table items a module provides —, a running private process halts with
`public-config-changed`, and each later start stops with the same code, its log line naming the new hash and the flag
that accepts it. Check that the core's new configuration still provides what the private modules read, then start the
private process with that hash:

```sh
umbradb run --update-hash=0x<64 hex digits> [--config umbradb.config.ts]
```

That start runs every check of the public side — the binding, the public table items its modules require — and records
the hash once they pass; later starts need no flag. A host program that runs the private process with `startUmbraDB`
gives the hash as its `acceptPublicConfigHash` option. A hash given that is not the one found accepts nothing, and the
start stops as before; a value that is not `0x` and 64 lowercase hex digits prints the usage (exit 2). A start can also
stop when the core's configuration changes during it, or when `privateLink` and `publicDatabase` are not one core's:
start it again once both give one hash. A restored private backup holds the hash its process had accepted, so the
restored process's first start compares it the same way.

## Fast-sync mode: chunks of blocks in one transaction

Far behind the finalized head, a public process can store a chunk of consecutive heights in one transaction instead
of one transaction per block. It is off by default; the `core` entry's operational setting turns it on:

```ts
coreEntry({ start: 0, config: { /* … */ fastSync: { blocks: 100, distance: 600 } } })
```

| Member | Default | |
|---|---|---|
| `blocks` | `0` | The most heights in one chunk, 0 to 1,000. Below 2 the mode is off. Measured, 100 is as fast as the mode off and 1,000 is slower (below). |
| `distance` | `600` | A chunk holds only heights at least this far behind the finalized head the loop read for its pass: about an hour of chain at the default. The heights nearer the head are stored one block per transaction. |

**When a chunk forms, and where it ends.** At each height the loop asks whether a chunk starts there. It ends at the
lowest of: `blocks` heights on; the head less `distance`; the end of the range of the configuration where no module
starts or stops and no revision changes (the `core` entry's revisions included); the core's `stop` or the height before
an upgrade boundary. A chunk holds two blocks or more; any other height is stored alone, as with the mode off. A
private process, and a public process with `lockstepInstances`, never form chunks. A chunk also ends early, with its
`COMMIT`, before its next block when the process is asked to stop or to pause (`pause()`, a backup on SIGUSR2), and
before a block whose computation needs the block before committed (the ledger's v8 → v9 conversion). And chunks form
only while the database has nothing that a `COMMIT` acts on (below).

**What it gains, measured.** By itself the mode does not make a sync faster. On Preprod (four ranges of 1,500
heights, PostgreSQL 18) chunks of 100 ran at 0.98 to 1.03 times the mode off's heights per second, and chunks of 1,000
at 0.93 and 0.85. A chunk saves about 10 statements per block (one `BEGIN` and one `COMMIT` per chunk, no read-only
transaction per block; one statement per block comes back, the read at each block's end, added after these runs) and
costs 0.5 to 1.7 ms per block more in the write of the ledger's node counts. That write slows with a block's place in its chunk: 1.1 times the
mode off's at places 1 to 100, 2.5 times at places 901 to 1,000. Keep `blocks` at 100 or below: above it the mode is
slower than off until the counts are written once per chunk, which this version does not do. A block of a chunk of
100 is committed 0.7 to 1.9 s after it was written, and one of a chunk of 1,000 5 to 12 s; with 1,000 the process
used 62 to 160 MiB more memory.

**What a module's schema can cost.** A chunk holds only blocks for which a `COMMIT` has nothing to do but make their
writes durable. One read says so, at the end of each block: whether the database has a deferrable constraint (declared
`INITIALLY DEFERRED` or `INITIALLY IMMEDIATE`), a constraint trigger, a temporary table or sequence in the writer's
session, or an open cursor. While it finds one, no chunk forms: every height is stored in a transaction of its own, as
with the mode off, with that one read more per block, and whatever a block leaves for its transaction's end (a
deferred check, a deferred trigger, a cursor `WITH HOLD`) is done by that block's own `COMMIT`. A block that makes or
leaves one of them inside a chunk ends the chunk there, with its `COMMIT`. Chunks form again once a block's end finds
nothing. UmbraDB's own schema has none of them: only a module's schema or statements keep the mode from chunking, and
the block trace then shows no `chunk` key.

**What changes for an operator.**
- The cursor, `/status` and the module API move a chunk at a time: a chunk's blocks are committed together, and on
  PostgreSQL other readers see the last committed height meanwhile, up to `blocks` heights behind what is written.
- On PGlite, which has one connection, a read of the module API or the admin endpoints waits for the open chunk's
  `COMMIT`: for as long as the rest of the chunk takes, with no time limit. PGlite is a development backend.
- A crash, a kill or a lost connection loses the open chunk's work: the process starts again from the cursor before
  the chunk.
- A stop or a pause asked while a chunk is open ends it before its next block: the blocks written are committed. An
  open chunk never waits for the node: the blocks and the ledger state roots of a chunk are fetched before its
  transaction opens. A stop or a pause asked while the process waits for them (a node that does not answer) ends the
  wait: no block is taken after the one being fetched, the chunk's first block is stored alone, and the process then
  stops or pauses. While a node does not answer and neither is asked, that first block stays computed and not yet
  stored, where the mode off has stored it.
- A failure inside a chunk is handled as the mode off handles it at the same block: the blocks below the failing one
  are committed where the transaction allows, and stored again one block per transaction where it rolled back (the
  ledger worker's thread is then restarted, and the next blocks load the state from the database). A failure that is
  not retried halts at the same block as with the mode off, and the failing block's callbacks are not called a second
  time. A chunk's `COMMIT` that the server answers with an error is its last block's failure: the blocks below it are
  stored again, and the log names the last block with that error. For failures, three differences remain: a failure of a block's
  `on-after-db-write` halts with the cursor at the chunk's last block, not at that block; a ledger worker that traps
  in a block's writes leaves the cursor at the chunk's first block − 1, since the blocks stored again fail at the
  first (a trap is retried in neither mode); and a finality conflict the node reports while a chunk is open halts once
  it committed, at the height above the chunk, at most `blocks` heights later.
- A block that failed while the blocks below it were not yet committed (its fetch or parse while it was taken for a
  chunk, its computation, its writes) fails when processing reaches it, not before: the blocks below it are stored
  first, also across a retry of one of them, and the log names its height. If one of those blocks halts first, the
  log says that the failure kept for the block above was dropped.
- Memory grows with `blocks`: a chunk keeps every block's items, the ledger worker's parses and the trace's lines until
  its `COMMIT`.
- A chunk takes all its blocks from the node before its transaction opens, and then waits for the ledger state roots
  of its later blocks. With `prefetchWindow` below `blocks`, each chunk waits for the heights above the window (its
  first line's `beginMs`; the roots' wait is in its `prepareMs`); `prefetchWindow` at least `blocks` + 1 avoids it.
- Each block of a chunk costs one more statement, a read of about 0.17 ms on the tests' servers: the read at its
  end. It is sent once more, in a transaction of its own, before a run's first chunk.

What is stored at every height is what the mode off stores, row for row, for the same history of ledger worker
restarts, as long as no module's writes depend on what belongs to the transaction rather than to the block: a setting
made with `SET LOCAL`, `now()`, the transaction id, a sequence's value (the module guide, §12).

## Measuring a sync: the block trace

`umbradb run` writes a block trace when its environment names a file for it:

```sh
mkdir -p run
UMBRADB_TRACE=run/trace.jsonl umbradb run [--config umbradb.config.ts]
```

| Variable | What it does |
|---|---|
| `UMBRADB_TRACE=<file>` | Writes the trace to `<file>` (relative to the working directory, in a folder that exists) and two files beside it. Unset or empty: no trace. |
| `UMBRADB_TRACE_STEPS=1` | Beside `UMBRADB_TRACE`: each height's line also holds its reclamation's count changes (`d`), new nodes (`nn`) and deleted nodes (`del`), each key by its first 6 bytes. A line is then several kB long. |

The trace only measures. A process that is not traced computes, stores, logs and sends between its threads what it
did before; a traced one stores the same tables. Only the command starts it: a host program's process
(`startUmbraDB`) is not traced. The files are appended to, so give each run a new file. Lines are written every 200
heights and when the command ends, a stop by SIGTERM or SIGINT included; a process that is killed, or that dies, loses
the lines of up to 199 heights and the worker's lines since the last write.

The command opens the three files before it starts the process, creating those that do not exist. If it cannot (the
folder does not exist, no permission), it says so on stderr and exits 1 without starting anything. A write that fails
later (a full disk) stops processing: at a flush during the sync, the process halts at the height whose line could not
be written, that height committed, with a message that ends `writing the block trace failed: <reason>`; at the
command's end, the command fails with that error.

| File | Holds |
|---|---|
| `<file>` | One JSON line per committed height: what the main thread's time went to. A chunk's lines are written once its `COMMIT` answered, in height order, each with its own block's work; a chunk that rolled back has none. A height whose work after its commit (`on-after-db-write`) fails has none. A height that failed and was made again has the line of the run that committed it, and its reclamation is in `sh` once. A height whose `COMMIT` lost its answer has its line once the next run finds it committed (none if it did not commit); that line also holds what was sent until then, and no `txMs`. |
| `<file>.stmts.json` | One entry per statement text (`q`, its first 260 characters) the main thread sent on PostgreSQL: how many times it was sent (`n`, those that failed included), its client time from send to answer or failure in ms (`ms`) and its slowest call (`max`). The first 1,024 texts sent are kept by name; the statements of any other text are counted together in a last entry whose `q` is `(other statement texts)`, present once it counts one. On PGlite statements are not traced, so it is `[]`. |
| `<file>.worker.jsonl` | One JSON line per block the ledger worker applied: what the worker thread's time went to since the line before. |

**A height's line.** Times are in ms; every number is rounded to 0.001. A key is absent where its stage did not run at
that height.

| Key | What it is |
|---|---|
| `h`, `t` | The height, and the process's clock when it ended. |
| `beginMs` | The wait for the block from its source, and the height's start. In a chunk, on its first line only, and it holds the taking of every block of the chunk. |
| `chunk` | `[first, last]`: the chunk of heights stored in one transaction this height belongs to (fast-sync mode), on every line of a chunk of two blocks or more. |
| `prepareMs` | The points before the block's transaction (`on-fetch` to `on-compute`). It holds `applyMs` and `collectMs`. |
| `applyMs`, `tx` | The block applied by the ledger worker, as the main thread waited for it, and the block's number of transactions. |
| `rootWaitMs` | Of `applyMs`: the wait for the node's state root once the worker had answered. It is the node's time. |
| `collectMs` | The block's flush handed over to the reclamation, in memory. |
| `stepMs`, `evictMs` | Inside `txMs`, at `on-settle`: the reclamation of the run of blocks the height ends (one block), its reads included, and the eviction of the nodes it deletes from the worker, awaited. |
| `evictRefused` | 1 when the ledger package refused that eviction: the worker thread was ended and the block committed. |
| `reads` | The reclamation's reads, inside `txMs`, each as `[name, keys asked, ms, entries answered]`; the names are `rows`, `changed`, `missing`, `queue`, `queued`, `counts` and `references`. `missing` holds only the keys asked of the database: those the keys found stored, kept between blocks, did not answer (`knownHits`); `counts` and `references` those the copy of the counts and child lists, kept between blocks, did not hold (`copyMisses`), or with `reclamationCache.verify` every key. |
| `knownHits` | At `on-settle`: how many of the keys the reclamation must find stored the keys found stored, kept between blocks, answered without a read. Those keys are the references in the child lists the block flushed that are new or differ from the row's (a list written again as the row holds it is not checked), and the keys whose root count it raises, less the keys it flushed. |
| `knownEmptied` | 1 when the height's settle did not start from what earlier heights learned: its block did not continue the block before (a process's first height, a height made again after a failure, the height after a `COMMIT` whose answer was lost), so the keys found stored were emptied before it, or, while it ran, a key it found stored would have taken them past 500,000, which empties them before the key enters (growing to 500,000 keys empties nothing). The line of a height that commits after failed attempts has it, whatever those attempts did. |
| `copyHits`, `copyMisses` | At `on-settle`: of the keys the reclamation's `counts` and `references` reads asked, how many the copy of the counts and child lists kept between blocks held, and how many it did not; the database is asked the second (with `reclamationCache.verify`, both). Absent with `reclamationCache.keys` 0. |
| `copyEmptied` | 1 when the height's settle did not start from what earlier heights left in that copy: its block did not continue the block before, as for `knownEmptied`, or, while it ran, an update of the copy would have taken it past its bound, `reclamationCache.keys`, which empties it before the key or list enters. |
| `st` | The reclamation's sizes: new, rewritten and unchanged nodes, count changes, deleted nodes, rounds, keys queued, keys unqueued, and keys whose count stays above 0. |
| `sh` | The chain of reclamation outputs: 16 hex digits of a SHA-256 over what every height so far gave, one link per run settled (its first and last heights, its net write, the keys evicted, the rounds). Two runs of the same heights whose last `sh` are equal computed the same reclamation at every height. A build that ran a reclamation step per block in `on-compute` chained other links, so its `sh` does not compare with this one's. |
| `txMs` | The block's transaction, from its `BEGIN` to its `COMMIT` answered. In a chunk, the block's own part of it: its writes, the first block's with the `BEGIN`, the last one's with the `COMMIT`. |
| `writeBlockMs`, `writeRefcountMs` | Inside it: the ledger state's own rows of the block (root counts, `states`, segment results, events) at `on-db-write`, and the reclamation's net write at `on-settle` (nodes, counts, queue, deleted rows). |
| `commitMs` | The client time of the last `COMMIT` sent since the line before: the block's own, unless the process committed another write after it. In a chunk, on its last line only (and on a run's first line, which holds the startup's statements). |
| `sqlN`, `sqlMs` | The statements the main thread sent on PostgreSQL since the line before, and their client time from send to answer or failure. A run's first line also holds the startup's statements, and a module API request's or the admin endpoints' reads during a sync count in the height then in progress. A height that does not commit drops what it counted (the statements' file keeps them). |
| `encMs`, `decMs` | Those statements' parameters encoded, and their rows decoded. |
| `rt.<type>`, `rtN.<type>` | The ledger worker's requests of that type (`apply`, `parse`, `commit`, `evict`, `load`, `release`, …): their round trips, from the post to the answer handled, and how many. |
| `backMs` | From the worker posting an answer to the main thread handling it. |
| `nodeNoticeMs`, `nodeReadMs`, `nodeReads` | The worker's requests for stored nodes: from the worker posting one to the main thread handling it, from then to the worker woken, and how many. |
| `mem` | The main thread's memory in MiB: its JavaScript heap in use, what it holds outside the heap, and the process's resident set. |

Later changes may add keys to a line for the work they measure; the files and the shape of a line do not change.

**A worker's line.** One per applied block; what ran since the block before is in this block's line.

| Key | What it is |
|---|---|
| `h`, `tx` | The height applied and its number of transactions. |
| `spanMs` | The thread's wall time since the line before. The requests' time and the idle time add up to it. |
| `rq.<type>`, `rqN.<type>` | The time the thread ran requests of that type, node waits included, and how many started. |
| `post.<type>` | Of `rq.<type>`: the time posting the answers. |
| `parse`, `adapterApply`, `settle` | The phases: a block's parse; the ledger package's apply, with `deserialize`, `segments`, `wellFormed`, `cost`, `stateApply`, `applySystem`, `events` and `postBlockUpdate` inside it; and what follows the apply, with `stateKey`, `stateRoot`, `summary`, `persist`, `contracts`, `release` and `flush` inside it. |
| `nodeWaitMs`, `nodeWaits` | The time the thread was blocked while the main thread read stored nodes for it, and how many times. |
| `nodeGets`, `nodeGot` | The nodes the package asked its store for, and the nodes the main thread's answers carried. |
| `node.<phase>`, `node.rq.<type>` | Of `nodeWaitMs`: what fell inside that phase, and inside a request of that type. |
| `idleMs`, `transitMs` | The time no request ran, and of it the time a request already posted had not reached the thread. |
| `queuedMs` | What the requests waited between their post and their start, less their transit. It overlaps the requests before them and is not a part of `spanMs`. |
| `gcMs`, `gcN`, `gcMajorMs` | The garbage collections of the thread's JavaScript heap that began in the span, and of them the major ones. A collection reported after its span's line was written is in a later line as `gcOf.<height>` and `gcNOf.<height>`; `gcOf.0` and `gcNOf.0`, in the thread's first line, are collections that began before its trace started. |
| `ext`, `heap`, `rss` | The thread's memory in MiB when the block was applied: what it holds outside its JavaScript heap (the ledger packages' WebAssembly memory), its JavaScript heap in use, and the process's resident set. |

**Reading a trace.** The range bench ([`bench/range/`](../bench/range/README.md)) syncs a stretch of a chain from a
copy of a database with the trace on and reads these files: speed with and without the waits for the node, each
stage's mean, statements per block, the worker thread's time, and two runs side by side.
