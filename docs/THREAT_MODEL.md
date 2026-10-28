# UmbraDB 0.10.0 threat model

This covers UmbraDB's standalone Midnight indexer, its Node.js and browser processes, databases, network
services, ledger packages and backups. Its `path:line` references were checked by reading the code on 2026-10-28,
against the tree of the commit that adds this file (task 17.4c, on `69dba1f`); A178's test
(`test/library-surface/threat-model.test.ts`) keeps every cited file in the tree and at least as long as the cited
line. References are relative to the repository root; requirement ids refer to
`openspec/changes/core-arch/specs/<capability>/spec.md`. Current controls are distinguished from work still planned.

## Assets and actors

| Asset | Property to protect |
|---|---|
| Public database | Finalized-only, atomic block writes; reproducible module data, cursor and digests. |
| Private databases | Confidentiality and integrity of each instance's module data and private inputs. |
| Secrets and keys | Database passwords, node credentials, transport keys and keys held by private modules. |
| Node connection | Correct chain identity, authentic peer, intact replies and continued availability. |
| Backups | Consistent height, intact contents, known origin and confidentiality where data is private. |
| Build and configuration | Reviewed executable code, checked ledger identities and recorded data settings. |

The operator controls configuration, modules, deployment, credentials, transport trust roots and backups.
The host, database administrator and storage are trusted. Module authors supply trusted executable code,
including SQL; modules within a process are not mutually isolated. Database roles protect against mistakes,
not malicious modules (`src/db/roles.ts:27`;
`openspec/changes/core-arch/proposal.md:83`).

Network peers and readers of exposed services can be hostile. Admin callers should be restricted to operators,
but the server does not authenticate them (`src/admin/serve.ts:66`). A private process trusts its public
database for inputs; lockstep operation trusts peers to report progress honestly
(`src/backbone/core-private-source/core-private-source.ts:715`, `src/private/lockstep.ts:97`).
The backup producer and browser hosting origin must also be trusted. Dependency producers, local patches and
build tools supply executable code within these trust domains.

The core does not manage private keys or provide TEE attestation; private modules own their key handling
(`openspec/changes/core-arch/proposal.md:80`). The configured Midnight node is trusted for finality and block
contents, subject to the consistency checks described below.

## Boundaries, threats and controls

### 1. Operator files and module code → process

The TypeScript configuration executes before its exported data is checked
(`src/config/load.ts:97`, `src/config/load.ts:121`). Settings validation and configuration history catch
malformed settings and changes to already processed data settings; they do not sandbox imports
(`src/config/validate.ts:748`, `src/config/history.ts:539`; CF-1, CF-3, CF-6).
A malicious configuration or module has process privileges.

Secret-kind settings are redacted, and text redaction covers known configuration secrets and URL credentials
(`src/config/redact.ts:223`, `src/config/redact.ts:216`). Redaction cannot catch arbitrary encodings or values
unknown to configuration (`src/config/redact.ts:24`). Modules must classify secrets correctly and protect their
own logs, responses and keys. Private query values need separate care; see “Private reads of public data”.

### 2. Midnight node → public process

WebSocket RPC supplies headers, extrinsics, events, metadata and ledger state
(`src/node/methods.ts:9`). Startup checks compare genesis and the stored cursor with the configured node;
conflicting finalized notifications and stored parent mismatches halt processing
(`src/backbone/core-chain/core-chain.ts:240`, `src/backbone/core-chain/core-chain.ts:267`,
`src/backbone/core-block-fetch/node-source.ts:471`,
`src/backbone/core-block-commit/core-block-commit.ts:196`).

These are consistency controls. Their trust limit, optional ledger replay check and transport exposure are
described in “The Midnight node”. Heartbeats and bounded prefetch help with stalled connections and queued work;
they do not establish that node data is honest
(`src/node/ws-socket.ts:37`, `src/backbone/core-block-fetch/node-source.ts:21`; IN-5, IN-6).

### 3. Runner and modules → PostgreSQL 18 or PGlite

SQL, parameters and computed block data cross into storage. The runner puts a finalized height's writes in one
transaction and checks that its cursor matches the block before commit
(`src/runner/loop.ts:726`, `src/runner/loop.ts:747`; RN-6).
PostgreSQL writer sessions take the writer lock and run the durability probe
(`src/db/postgres.ts:516`, `src/db/postgres.ts:517`; DB-11, DB-12).
These controls depend on cooperating code and trusted database administration.

Per-module `NOLOGIN` roles, role switching and restricted routine grants limit accidental cross-module writes
(`src/db/roles.ts:453`, `src/db/roles.ts:476`, `src/db/roles.ts:477`,
`src/db/roles.ts:486`). They do not isolate hostile module code.

Canonical row encoding, primary-key order and captured changes support reproducible contents hashes and digests
(`src/determinism/contents-hash.ts:54`, `src/determinism/digest.ts:71`,
`src/backbone/core-digest/core-digest.ts:16`; DT-1–DT-6).
These unsigned comparisons do not protect against an administrator rewriting both data and hashes.

`database` is given as parts, never a connection string, and only its `password` is secret
(`src/config/core-settings.ts:131`, `src/config/core-settings.ts:165`, `src/config/redact.ts:129`; CF-4, Q167).
Its `ssl` reaches the PostgreSQL driver as the driver reads it
(`src/db/postgres.ts:100`, `src/db/postgres.ts:580`); see “Exposure defaults and hash limits”.

### 4. Main thread ↔ ledger worker

Block bytes, requests and plain results cross a worker message channel; stored ledger node keys and bytes cross
shared memory. Native ledger objects remain in the worker
(`src/ledger/worker/host.ts:6`; LG-10).
The shared memory grows to at most 256 MiB
(`src/ledger/worker/node-bridge.ts:50`).
A WASM trap marks the worker failed, fails requests and halts processing through the failed callback
(`src/ledger/worker/run.ts:102`, `src/ledger/worker/host.ts:22`).
The worker is not a security sandbox for malicious packages.

Task 12.2b now checks ledger packages before use. In `Process.#open`, startup invokes `checkLedgerPackages`
before starting the worker when the graph requires ledger parsing or replay; a graph loading no ledger package
does not invoke that check, as decided in Q176 A
(`src/runner/process.ts:1233`, `src/runner/process.ts:1239`, `src/runner/process.ts:1240`).
The check validates recorded manifests and their listed files, refusing unavailable `released` sources
(`src/ledger/identity.ts:201`, `src/ledger/identity.ts:169`, `src/ledger/sources.ts:25`).

Each package's `import()` also follows `checkLedgerPackage`; successful file checks are cached once per thread
(`src/ledger/load.ts:28`, `src/ledger/load.ts:31`, `src/ledger/load.ts:34`,
`src/ledger/identity.ts:191`).
This checks package identity against the build's recorded identity, not whether that code is benign.
Ledger work has no execution deadline; expensive or stalled work remains an availability risk
(`src/ledger/worker/host.ts:16`; RN-17).

### 5. Module API readers → process

Optional HTTP routes and WebSocket subscriptions carry requests, parameters and module responses.
HTTP handlers read a committed snapshot with the configured PostgreSQL read timeout
(`src/runner/module-api.ts:367`).
Default limits are 1 MiB for HTTP bodies, 64 KiB for WebSocket messages and 1 MiB buffered output before a slow
subscriber is disconnected (`src/runner/api-server.ts:70`, `src/runner/api-server.ts:74`,
`src/runner/api-server.ts:76`, `src/runner/api-server.ts:265`).

The listener supplies no authentication, authorization, TLS or WebSocket Origin policy
(`src/runner/api-server.ts:408`, `src/runner/api-server.ts:418`).
A handler serving private data can therefore disclose it to anyone reaching the listener.
Aggregate connection and subscription admission limits are also absent
(`src/runner/api-server.ts:402`, `src/runner/api-server.ts:234`; gaps 5 and 6).

Every HTTP answer identifies the build and configuration hash. View, height and block-hash envelopes require
module use of the envelope helpers (`src/runner/api-server.ts:92`, `src/runner/api-server.ts:99`; RN-16).
These fields neither authenticate the server nor prove its database contents.

Unexpected handler failures receive a fixed client-facing error, while the error itself reaches the reporting
callback and process log (`src/runner/module-api.ts:377`, `src/runner/process.ts:1308`).
This limits disclosure to API callers without establishing that logs contain no private values.

### 6. Admin callers → admin worker

The admin service exposes `/health/live`, `/health/ready`, `/status` and `/config`, including operational,
module and instance metadata (`src/admin/routes.ts:3`; AE-1, AE-5).
Only mounted GET routes are served. Answers use published snapshots, in a separate Node.js worker, without
database reads on the request path
(`src/admin/routes.ts:77`, `src/admin/serve.ts:68`, `src/admin/server.ts:86`).

Responses disable caching, and displayed errors use fixed messages and allowlisted details
(`src/admin/serve.ts:76`, `src/admin/errors.ts:94`, `src/admin/errors.ts:105`).
These controls reduce accidental disclosure and keep monitoring separate from database work.
They do not authorize callers or conceal metadata from the network: the HTTP request path has no authentication
(`src/admin/serve.ts:66`), and admin defaults to all interfaces
(`src/config/core-settings.ts:60`; gap 5).

### 7. Public process/database ↔ private process

A private process reads public tables directly through PostgreSQL or sends SQL and parameters through the core
transport (`src/backbone/core-private-source/public-database.ts:179`,
`src/private/private-transport.ts:313`).
Direct access needs an operator-provided login that may only read; opening a read-only API handle does not
establish that login's privileges (`src/backbone/core-private-source/public-database.ts:171`).

Task 14.2b now prechecks every statement of a transport `read` before any statement runs.
Each must contain one statement whose first word, after opening parentheses, is `SELECT`, `WITH`, `VALUES`
or `TABLE`; it must name nothing starting with `pg_`, `dblink` or `binary_upgrade_`, and none of the listed
functions such as `set_config`, `nextval`, `setval`, large-object functions and SQL-through-text functions
(`src/private/read-gate.ts:74`, `src/private/read-gate.ts:77`, `src/private/read-gate.ts:86`,
`src/private/read-gate.ts:286`).
Unreadable text is refused too (`src/private/read-gate.ts:307`).

A refusal returns `read-refused` and runs nothing from the request; its log names the instance and statement
number, never the statement text (`src/private/core-transport.ts:382`,
`src/private/core-transport.ts:369`, `src/private/core-transport.ts:376`).
Accepted statements execute inside the read-only transaction opened by `Database.read`
(`src/private/core-transport.ts:389`, `src/db/postgres.ts:342`, `src/db/pglite.ts:393`;
PP-4, design §8 “Confined reads”).

On PostgreSQL these reads run on a read pool of their own, logged in as `core.transportReader`
(`{ user, password }`), which is required there with `listen.transport` and refused on PGlite
(`src/config/core-settings.ts:224`, `src/runner/process.ts:1165`, `src/runner/process.ts:1283`; CF-4, Q175 A).
Before the transport listens, startup refuses `transport-reader-can-write` when that login is a superuser, holds
`CREATEROLE`, `CREATEDB` or `BYPASSRLS`, is a member of the writer's login, or holds a privilege beyond reading on
the database or a public schema, table or sequence (`src/private/transport-reader.ts:89`,
`src/private/transport-reader.ts:107`, `src/runner/process.ts:1176`).
A write the gate misses is then refused by PostgreSQL itself, and the writer's session cannot be ended from the
reader's. On PGlite the gate and the read-only transaction remain the only barriers: there is one session, the
writer's. The gate stays in front of the reader login on both backends, since advisory locks and session settings
are open to any login.

Binding checks compare public genesis and start height; transport messages wake intake rather than replace
public database reads (`src/backbone/core-private-source/core-private-source.ts:288`,
`src/backbone/core-private-source/core-private-source.ts:296`,
`src/backbone/core-private-source/core-private-source.ts:818`; PP-2, PP-3).
Public configuration changes halt private processing until accepted; without transport, database reconnection
is the recheck point (`src/private/private-transport.ts:484`,
`src/backbone/core-private-source/core-private-source.ts:707`; PP-14).

Optional mutual TLS checks certificates against configured roots, and duplicate connected ids are refused
(`src/private/core-transport.ts:198`, `src/private/core-transport.ts:305`).
Certificates are not bound to instance ids; initial lockstep heights are accepted without checking their hash
(`src/private/core-transport.ts:311`, `src/private/core-transport.ts:318`; gap 4).
Later reports are checked against public block hashes, not private computation
(`src/private/core-transport.ts:345`).
A listed peer can stall progress by withholding it (`src/private/lockstep.ts:144`).
Query confidentiality is addressed in “Private reads of public data”.

### 8. Database ↔ backup file → restore target

Plain SQL and a manifest cross the filesystem boundary.
PostgreSQL dumps use the manifest read's exported snapshot; PGlite gathers facts and dump text in one exclusive
queued job (`src/backup/backup.ts:215`, `src/backup/backup.ts:201`,
`src/backup/pglite-backup.ts:103`; BK-1).

Task 15.1b creates backup files owner-only from creation: `ownerOnlyFile` opens a new file with
`BACKUP_FILE_MODE` (`0600`) and applies that mode before writing, regardless of umask
(`src/backup/backup.ts:68`, `src/backup/backup.ts:98`, `src/backup/backup.ts:100`).
A refused `chmod` fails the backup and removes the temporary file; completion renames the temporary file
(`src/backup/backup.ts:99`, `src/backup/backup.ts:252`).
Where POSIX modes do not apply, folder or mount access controls determine confidentiality
(`docs/operator-guide.md:246`).

Restore checks compatibility before loading and contents after loading
(`src/backup/restore.ts:300`, `src/backup/restore.ts:416`).
These checks do not make hostile SQL safe. Restore authority, origin and encryption are addressed in
“Backups and restore”.

### 9. Browser origin → page, workers and storage

The browser build runs processes in dedicated workers with their own PGlite databases; transport, module API and
admin calls use page-controlled message channels
(`browser/src/process-worker.ts:2`, `browser/src/process-worker.ts:14`; BR-1, BR-3).
Web Locks prevent cooperating tabs or workers from opening the same OPFS database
(`browser/src/db/web-lock.ts:83`).

The build checks each ledger version's `SHA256SUMS` against the recorded manifest hash and checks every package
file it bundles against that manifest (`browser/build.ts:171`, `browser/build.ts:183`,
`browser/build.ts:294`).
The ledger worker also hashes fetched WASM before instantiation
(`browser/src/ledger/instantiate.ts:29`, `browser/src/ledger/instantiate.ts:37`).
Displayed log lines use text content (`browser/src/page.ts:283`).

Trust in the hosting origin is separate from those checks: that origin supplies the executable bundles and
expected hashes (`browser/src/ledger/identity.ts:9`).
A compromised origin can replace both and access same-origin data. Workers and OPFS do not protect secrets
from that origin. Trust its scripts and do not bundle production secrets.
The node's acceptance of a page's WebSocket Origin is not authentication of the page's user (BR-3).

### 10. Dependency producers and build pipeline → installed code

npm dependencies, vendored ledger JS/WASM, Rust crates and local patches become executable code.
The supply-chain workflow installs from the lockfile, asserts lifecycle scripts are disabled and blocks
high or critical runtime npm advisories
(`.github/workflows/supply-chain.yml:65`, `.github/workflows/supply-chain.yml:56`,
`.github/workflows/supply-chain.yml:78`; `.npmrc:8`).
Its secret scan covers full history (`.github/workflows/supply-chain.yml:39`,
`.github/workflows/supply-chain.yml:109`).

Vendored ledger sources are commit-pinned, and their build image is digest-pinned
(`vendor/ledger/v8/upstream.json:3`, `vendor/ledger/v9-rc3/upstream.json:3`,
`vendor/ledger/v9/upstream.json:3`, `vendor/ledger/Dockerfile:16`).
CI is configured to rebuild all three carried versions on amd64 and arm64 and compare them with `SHA256SUMS`
(`.github/workflows/vendored-ledger.yml:31`, `.github/workflows/vendored-ledger.yml:45`).
Runtime and browser package checks are described above.

Pins, byte comparisons and package checks do not establish that upstream code is benign.
Vendored Rust advisory coverage and release provenance remain open
(`docs/issues/00048-vendored-crates-advisories-and-provenance.md:8`).
Workflow definitions are evidence of configured controls, not evidence that this commit passed them.

## The Midnight node

The owner's resolution, Q179 A on 2026-10-28, adds no new check: the core trusts its one configured Midnight node
for finality and block contents (`openspec/changes/core-arch/tasks.md:3995`).
The process constructs its node connection from that configured URL
(`src/backbone/core-chain/core-chain.ts:284`).

The checks compare configured genesis, stored genesis and cursor hashes, stored parent links, and conflicting
finalized notifications (`src/backbone/core-chain/core-chain.ts:240`,
`src/backbone/core-chain/core-chain.ts:257`, `src/backbone/core-chain/core-chain.ts:268`,
`src/backbone/core-block-commit/core-block-commit.ts:196`,
`src/backbone/core-block-fetch/node-source.ts:471`).
With `core-ledger-state`, the replayed state root must match the root served by that same node
(`src/backbone/core-ledger-state/core-ledger-state.ts:472`,
`src/backbone/core-ledger-state/core-ledger-state.ts:525`).
These checks catch an inconsistent node, not a lying one that supplies consistent answers.

Finality justifications are not verified: finalized head comes from RPC, and the block decoder retains header
and extrinsics while leaving justifications unused
(`src/node/client.ts:250`, `src/node/decode.ts:100`).
The `node` setting accepts `ws://` to any host; the socket uses the configured URL without a TLS-only policy
(`src/config/core-settings.ts:140`, `src/node/ws-socket.ts:30`).

Run or trust your own node, and use `wss://` across networks.
An authenticated channel protects the connection to that node; it does not remove trust in the node's answers.

## Private reads of public data

The owner's resolution, Q180 A on 2026-10-28, documents disclosure through reads of public data
(`openspec/changes/core-arch/tasks.md:3997`).
A private process's SQL text and parameters reach the public database. Through transport they also reach the
core, which decodes parameters and executes the supplied SQL
(`src/private/private-transport.ts:313`, `src/private/private-transport.ts:368`,
`src/private/core-transport.ts:392`).
Direct reads use the configured public PostgreSQL connection
(`src/backbone/core-private-source/public-database.ts:179`).

The public database operator can observe those queries and values. Treat database logging and query inspection,
including `log_statement`, `log_min_duration_statement`, `auto_explain` and `pg_stat_statements`, as disclosure
surfaces. A query containing a private-derived identifier or filter can disclose private information even when
every result row is public.

A database error can echo a parameter. UmbraDB retains the server's error message and cause, and its own errors,
details and logs may carry private values (`src/db/postgres.ts:203`, `src/db/postgres.ts:226`,
`src/db/errors.ts:78`, `src/runner/process.ts:1308`).
Process log redaction knows configuration secrets, not arbitrary private-derived query values
(`src/runner/process.ts:1054`, `src/config/redact.ts:16`).

Task 14.2b keeps a refused read's statement text out of the core's refusal log
(`src/private/core-transport.ts:369`).
No broader check of query-value disclosure paths is established by that task.
Keep private-derived values out of public queries where possible: for example, read public rows by height and
filter them inside the private process.

## Backups and restore

The owner's resolution, Q177 A on 2026-10-28, leaves restore unchanged: restore only backups you wrote
(`openspec/changes/core-arch/tasks.md:3993`).
Restore runs the file's SQL with the database login's, or writer's, rights. The load loop executes statements
before restoring ownership and checking the loaded contents hash and ledger root
(`src/backup/restore.ts:407`, `src/backup/restore.ts:412`, `src/backup/restore.ts:416`,
`src/backup/restore.ts:431`).

Before loading, restore checks the target, manifest, configuration history, migrations and chain identity
(`src/backup/restore.ts:455`, `src/backup/restore.ts:302`, `src/backup/restore.ts:316`,
`src/backup/restore.ts:329`, `src/backup/restore.ts:361`).
The splitter is a format reader, not a SQL safety policy: apart from malformed or truncated input, it refuses
`psql` meta-commands other than matching `\restrict` and `\unrestrict`, and `COPY … FROM stdin`
(`src/backup/statements.ts:169`, `src/backup/statements.ts:197`,
`src/backup/statements.ts:201`, `src/backup/statements.ts:219`).
It does not restrict SQL to safe data-loading operations.

Post-load checks can refuse damaged or incompatible data, but run after the file has exercised the writer's
authority. The enclosing transaction is not a security boundary for hostile SQL
(`src/backup/restore.ts:470`, `src/backup/restore.ts:407`).
The operator guide therefore says to restore only backups from a trusted source, your own
(`docs/operator-guide.md:259`).

Q178 A assigns backup origin and confidentiality to the operator
(`openspec/changes/core-arch/tasks.md:3994`).
UmbraDB neither signs nor encrypts backups: it writes a manifest and plain dump output
(`src/backup/manifest.ts:54`, `src/backup/manifest.ts:73`, `src/backup/backup.ts:162`,
`src/backup/backup.ts:244`).
Manifest hashes compare loaded contents with claims carried in the same file; they establish self-consistency,
not who wrote the file or whether its SQL is safe (`src/backup/restore.ts:417`).

Storing, moving and encrypting backups, and knowing their origin, are the operator's responsibilities.
A private instance's backup requires development opt-in and contains its private data in clear
(`src/backup/backup.ts:228`, `src/backup/backup.ts:245`, `docs/operator-guide.md:241`).
Owner-only file permissions reduce local exposure; they do not provide encryption or authenticate origin.

## Exposure defaults and hash limits

The current defaults are:

- **Admin:** plain HTTP on `0.0.0.0:8081`, without caller authentication
  (`src/config/core-settings.ts:60`, `src/admin/serve.ts:82`).
- **Module API:** no listener unless `listen.api` is set; then HTTP and WebSocket
  (`src/runner/api-server.ts:483`, `src/runner/api-server.ts:408`,
  `src/runner/api-server.ts:418`).
- **Private transport:** no configured listener by default; without `tls`, its server is plaintext HTTP/WebSocket
  (`src/config/core-settings.ts:170`, `src/private/core-transport.ts:264`).
- **PostgreSQL:** the database's parts, `ssl` passed to the driver explicitly: `require` unless the host is loopback
  or a socket directory, where it is `disable` (`src/config/database.ts:69`, `src/db/postgres.ts:250`,
  `src/config/database-parts.ts:77`).
  The lockfile pins `postgres` 3.4.9 (`package-lock.json:5054`).
- **API reads:** a default 30-second PostgreSQL statement and idle timeout; PGlite validates the option but does
  not apply it (`src/config/core-settings.ts:185`, `src/db/postgres.ts:377`, `src/db/pglite.ts:308`).
- **Development features:** opt-in defaults to false; PGlite and private backups require it
  (`src/config/core-settings.ts:190`, `src/db/durability-probe.ts:11`, `src/backup/backup.ts:228`).
- **Browser:** development opt-in, memory storage by default, optional OPFS, and a new database starting at the
  node's finalized head (`browser/src/config.ts:33`, `browser/src/page.ts:95`,
  `browser/src/db/database.ts:33`, `browser/src/process-worker.ts:186`).

Transport `tls` applies to that transport, not the admin listener, module API or database
(`src/private/core-transport.ts:266`, `src/admin/serve.ts:82`,
`src/runner/api-server.ts:408`, `src/db/postgres.ts:250`).
Browser transport uses page message channels and refuses the TLS option
(`browser/src/net/https.ts:9`).
Browser admin monitoring shares its process worker and can stall with it
(`browser/src/process-worker.ts:14`, `browser/src/admin.ts:42`).

`database` and a private process's `publicDatabase` use parts:
`{ kind: "postgres", host, port, user, password, name, ssl }`,
`{ kind: "pglite", path }` or `{ kind: "pglite", memory: true }`.
Connection strings are refused by the schema, and only `password` is secret; the host, port, user, name, `ssl` and
a PGlite `path` are shown in `/config` and the log
(`src/config/core-settings.ts:131`, `src/config/core-settings.ts:279`, `src/config/redact.ts:224`; CF-4, Q167).
A process or restore that creates a PGlite directory logs the path
(`src/config/database.ts:88`; Q165 B).

`ssl` reaches the PostgreSQL driver. It defaults to `require`, except for `localhost`, `127.0.0.1`, `::1` and
socket-directory hosts, which default to `disable` under Q182 B (`src/config/database-parts.ts:77`).
A port forwarded to `localhost` therefore runs in clear unless its configuration sets `ssl`.
`require` encrypts without checking the server's identity; `verify-full` checks the certificate and host name against
Node.js's built-in roots only, with no CA setting under Q183 A (`src/db/postgres.ts:100`).
A server with a private CA can therefore be reached only with `require`, which an active network attacker can
impersonate. Backups hand `pg_dump` the same parts through libpq's environment, `verify-full` against the system's
roots (`src/backup/backup.ts:134`).

The configuration hash covers recorded revision identities, heights, versions, data hashes and provided table
items, including scheduled revisions. It excludes operational settings and secrets
(`src/config/history.ts:354`, `src/config/history.ts:365`).
It detects changes; it is not a credential, code attestation or contents hash.
A transport's first connection accepts the hash it finds (`src/private/private-transport.ts:478`; PP-14).

The contents hash excludes `public`, PostgreSQL's own schemas and capture scratch tables, and does not attest
every database object (`src/determinism/module-tables.ts:5`, `src/determinism/module-tables.ts:16`).
A `deterministic: false` table contributes its schema and name but no rows
(`src/determinism/contents-hash.ts:44`).
Those tables are also excluded from change capture and digests (`src/db/change-capture.ts:117`).
Comparison requires compatible chain, configuration, modules and private inputs; hashes do not force trusted
module code to compute deterministically.

## Residual risks and scope

The operator must protect database access, host files, executable configuration, backups and TLS keys.
Module trust and database administration remain outside the protection supplied by module roles
(`src/db/roles.ts:27`). Private modules must define their own key custody, API authorization and retention;
core key handling and TEE attestation are outside scope
(`openspec/changes/core-arch/proposal.md:80`).

Private database separation does not conceal queries sent to public infrastructure, authenticate transport
instance ids or authorize module API callers
(`src/private/private-transport.ts:313`, `src/private/core-transport.ts:311`,
`src/runner/api-server.ts:408`).
No independent consensus verification is claimed (`src/node/decode.ts:105`).
The default browser configuration omits `core-ledger-state`, so it performs no ledger root replay check
(`browser/src/config.ts:6`).
PGlite and browser operation are development facilities, not a production privacy boundary
(`src/db/durability-probe.ts:11`, `browser/src/process-worker.ts:8`).

Resource exhaustion, node unavailability and lockstep peer failures remain availability risks
(`docs/issues/00047-service-resource-bounds.md:8`, `src/private/lockstep.ts:144`).
The controls described here do not establish protection against a hostile host, database administrator,
module, backup producer or browser origin.

Commit policy belongs in [SECURITY.md](../SECURITY.md#commit-policy).
Vulnerability reporting, including the private reporting route and fallback contact, also belongs in
[SECURITY.md](../SECURITY.md#disclosing-a-security-issue).

## Known gaps

1. **Transport SQL confinement — fixed by tasks 14.2b and 4.5, as built.** The gate checks the whole request before
   execution and returns `read-refused` without running any statement; on PostgreSQL the transport's reads run as
   `core.transportReader`, a login startup checks cannot write; PGlite keeps the gate and the read-only transaction
   only (`src/private/core-transport.ts:382`, `src/private/read-gate.ts:318`, `src/runner/process.ts:1165`,
   `src/private/transport-reader.ts:107`).

2. **Database parts and TLS — fixed by task 4.5, as built.** The setting is parts with only `password` secret, and
   `ssl` reaches the driver; what remains is the default `disable` on loopback hosts and `verify-full`'s built-in
   roots only, both described above (`src/config/core-settings.ts:131`, `src/config/redact.ts:129`,
   `src/db/postgres.ts:100`, `src/config/database-parts.ts:77`).

3. **Ledger verification invocation — fixed by task 12.2b, as built.** Startup checks precede the ledger worker when
   the graph loads ledger packages, checks precede package imports once per thread, and browser build checks plus
   fetched-WASM hashing are present; browser hosting-origin trust remains separate
   (`src/runner/process.ts:1239`, `src/ledger/load.ts:28`, `src/ledger/identity.ts:191`,
   `browser/build.ts:171`, `browser/build.ts:294`, `browser/src/ledger/instantiate.ts:29`).

4. **Certificate-to-instance binding — open, issue 00045.** Mutual TLS checks roots but accepts a self-declared
   instance id and counts its initial height without checking its hash
   (`docs/issues/00045-transport-mtls-instance-binding.md:3`, `src/private/core-transport.ts:198`,
   `src/private/core-transport.ts:311`, `src/private/core-transport.ts:318`).

5. **Admin and module API access policy — open, issue 00046.** Admin defaults to all interfaces, and HTTP services
   supply no caller authentication or WebSocket Origin policy
   (`docs/issues/00046-admin-and-api-exposure-defaults.md:3`, `src/config/core-settings.ts:60`,
   `src/admin/serve.ts:66`, `src/runner/api-server.ts:408`, `src/runner/api-server.ts:418`).

6. **Service resource bounds — open, issue 00047.** Connections and subscriptions have no aggregate admission limit,
   transport results are materialized before the size check, PGlite read timeouts are not applied and ledger work has
   no deadline (`docs/issues/00047-service-resource-bounds.md:3`, `src/private/core-transport.ts:456`,
   `src/private/core-transport.ts:392`, `src/private/core-transport.ts:405`,
   `src/runner/api-server.ts:234`, `src/db/pglite.ts:308`, `src/ledger/worker/host.ts:16`).

7. **Backup file mode — fixed by task 15.1b, as built.** Files are created owner-only and set to `0600` before writing,
   with backup failure if `chmod` is refused; encryption and origin remain the operator's responsibilities
   (`src/backup/backup.ts:68`, `src/backup/backup.ts:98`, `src/backup/backup.ts:100`,
   `src/backup/backup.ts:99`, `openspec/changes/core-arch/tasks.md:3994`).

8. **Vendored Rust advisories and release provenance — open, issue 00048.** Ledger rebuild comparisons do not provide
   an advisory scan of the patched crate graphs or release provenance
   (`docs/issues/00048-vendored-crates-advisories-and-provenance.md:3`,
   `docs/issues/00048-vendored-crates-advisories-and-provenance.md:8`,
   `.github/workflows/vendored-ledger.yml:45`, `.github/workflows/supply-chain.yml:78`).

9. **Commit policy — fixed by task 17.4b, as built.** [SECURITY.md](../SECURITY.md#commit-policy) now holds the
   no-secrets rule and locally generated, ignored `0600` secret-file policy, with exact historical fingerprints in
   `.gitleaksignore` and full-history gitleaks configured in CI
   (`SECURITY.md:70`, `SECURITY.md:76`, `.gitleaksignore:17`,
   `.github/workflows/supply-chain.yml:109`).

Related **issue 00051 remains open**: transport instance ids accept arbitrary non-empty text, including line
breaks, which reaches core log lines and instance status
(`docs/issues/00051-transport-instance-id-unbounded.md:3`, `src/private/messages.ts:97`,
`src/private/core-transport.ts:321`, `src/private/core-transport.ts:369`, `src/private/instances.ts:40`).
This remains true of task 14.2b's refusal log even though that log excludes the read's statement text.
