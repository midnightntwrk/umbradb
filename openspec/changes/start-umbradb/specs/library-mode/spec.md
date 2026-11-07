# Spec delta — `library-mode` capability

EARS forms and terms as in `core-arch`'s `specs/runner/spec.md`. A **host** is the program that calls
`startUmbraDB`; a **surface** is the module API, admin, or one side of the private link; a **mounted handler** is one
the host calls from its own server; a **channel** is a `PrivateLinkChannel` the host provides; the **engine** is the
internal lifecycle every entry point calls (`design.md` §3).

## ADDED Requirements

### Requirement: LM-1 One in-process entry point

THE package SHALL export `startUmbraDB(options)`, which SHALL return its handle synchronously and run the indexer in
the calling process: it SHALL NOT spawn a process, run a binary or start a shell to run the indexer, and SHALL use
threads only for the ledger worker (when the build needs the ledger) and the admin thread (when admin listens). IT
SHALL NOT throw for bad options or a bad configuration: every refusal SHALL reject `started` (LM-9). `umbradb run`, the
browser demo and `startUmbraDB` SHALL start through one engine, and SHALL assemble the build — and `umbradb config
check`, `umbradb backup` and `umbradb restore` theirs — through one resolver (`design.md` §3.2).

#### Scenario: A module test needs nothing else
- **WHEN** a host calls `startUmbraDB({ config: { data }, modules: [m], source: new InMemoryBlockSource({ head: 10n }) })`
  on PGlite in memory
- **THEN** `started` resolves, the cursor reaches 10, no child process ran and no socket was opened

### Requirement: LM-2 No program-level behaviour by default

WHILE a process runs through `startUmbraDB`, THE system SHALL add no listener to `process`; SHALL write nothing to
stdout or stderr unless the host gives `log`, to which the worker threads' output goes — except what PGlite itself
writes with `console.error` on its internal failure paths (a failed extension fetch, a failed file write, a protocol
read error), which UmbraDB does not route and documents; SHALL start no child process
unless the host calls `backup()` on PostgreSQL; SHALL open no port unless the network request asks (LM-3); SHALL look
for and read no configuration file except `config.file`; SHALL neither end the host process nor set its exit status,
and leave no unhandled rejection — except that PGlite's runtime contains an assignment to `process.exitCode`, not
reached on a start, a failed query or a close in memory or on a directory (a run on Node.js 24.9.0 with PGlite 0.5.10,
2026-11-01), which planning prevents where it can and otherwise documents for PGlite's fatal paths (owner decision
D-22); SHALL resolve every relative path against `cwd` (default `process.cwd()`); and SHALL
read the global `process` only for `cwd()` in the Node entry, `hrtime` (heartbeat, admin), `pid` and `env` inside
`backup()`, and `emitWarning` around the `node:sqlite` import, whose `ExperimentalWarning` it SHALL drop through one
shared import (`design.md` §7.1, G1–G10). IF `backupAtStop` or `backupOnSignal` is set in the process's core
revision THEN startup SHALL refuse with `library-setting-refused` naming the setting. `closed` SHALL always resolve, and
every close step SHALL run even if an earlier one fails, its failure going to `log`.

#### Scenario: A quiet host
- **WHEN** a host starts UmbraDB without `log` on a PGlite directory, takes a backup and stops it
- **THEN** nothing was written to stdout or stderr, `process.listenerCount` is unchanged for every event, and
  `process.exitCode` is unchanged

### Requirement: LM-3 The network request

THE `network` option SHALL hold `api`, `admin` and `privateLink: { publicSide, privateSide }`, each absent or `false`
by default — no listener, handlers on the handle, no link —, `true` for the address written in the process's core
revision, `{ host?, port }` for an address given in code (`host` default `127.0.0.1`, port 0 a free port), and, for
the link only, `publicSide: { channels: true }` or `privateSide: { connect }`. THE engine SHALL combine the request with
the addresses written in the process's core revision into one plan that every link decision keys on, and SHALL refuse
before anything opens: an address both written and given in code, or requested with `true` and not written
(`network-address-conflict`, `both` / `no-address`); an address written for a surface of the process's side that the
request does not use as an address (`network-address-conflict`, `unused`); a `privateLink` sub-key of the other side
(`private-link-misconfigured`, `wrong-side`); on PostgreSQL, a public link given in the request without
`transportReader` (`private-link-misconfigured`, `reader-missing`); a malformed request (`invalid-configuration`,
reason `invalid-option`). A `listen.privateLink` written on a private process SHALL be ignored, as today. `umbradb run`
SHALL request each surface whose address is written, and admin at its default when none is written. `/config` SHALL
show the plan's addresses as bound and a `network` field naming each surface's mode (`design.md` §5.2).

#### Scenario: An address in both places
- **WHEN** the configuration writes `listen.api` and the host passes `api: { port: 9000 }`
- **THEN** `started` rejects with `network-address-conflict` (`both`), and no port was opened

### Requirement: LM-4 Handlers always exist

THE handle SHALL carry the module API's handlers (`api.http` for requests, `api.upgrade` for subscriptions), admin's
(`admin.http`) and the private link's (`privateLink.accept`) from `startUmbraDB`'s return on, whether or not a surface
listens. Mounted handlers SHALL apply UmbraDB's per-request and per-message rules as its listeners do — the request body
limit, read timeouts where the backend enforces them (DB-15: PostgreSQL; PGlite API reads are not bounded), message
schemas and size, the instance id rule, `/config` redaction and error texts from codes only (AE-6) —, and a channel
link SHALL apply the link's as the socket link does (PP-4's message schemas, confined reads, `duplicate-instance`,
the reader login's privilege check), while the host owns TLS,
authentication, Origin policy, connection and rate limits. Every module-API answer UmbraDB writes, mounted or on its
listener, SHALL carry the headers of RN-16.

#### Scenario: A body over the limit, mounted
- **WHEN** a host mounts `api.http` and a client posts a body over the module API's limit
- **THEN** the answer is 413, as on UmbraDB's own listener

### Requirement: LM-5 A standard service lifecycle

THE admin endpoints SHALL answer by AE-2 to AE-5, mounted or listening, in the library and the command. THE module API
SHALL answer `503` with its error envelope plus the state and the reason (`{ error: { code: "not-serving", message },
state, reason }`) WHILE the process is `starting`, `refused`, or `stopping` after its drain; SHALL answer reads at the
cursor WHILE `stopped` or `halted`, until `stop()`; and SHALL NOT write that body in place of a module's own answer or
of its own `no-committed-height` 503. Mounted `/health/live` SHALL answer 200, naming the host's thread, since it runs
on it. WHENEVER admin exists, mounted or listening, THE engine SHALL keep today's publication and fact reads, so mounted
and listening admin answer the same AE-5 fields without a database read per request (`design.md` §5.3).

#### Scenario: A refused start behind an orchestrator
- **WHEN** a host mounts admin, its probe calls `/health/live`, and startup is refused because a migration checksum
  changed
- **THEN** `/health/live` answers 200, `/health/ready` 503, `/status` 200 `refused` with the reason, and the module API
  503 with the same reason

### Requirement: LM-6 The private link over channels

WHERE the plan's link is over channels (`publicSide: { channels: true }` with `accept(channel)`, or `privateSide:
{ connect }`), THE system SHALL wrap the link's messages in an envelope that also carries `ping`, `pong` and `close`
with its code and reason; SHALL ping every `PING_INTERVAL_MS` from one interval after the channel opens and terminate a
channel whose ping is unanswered at the next interval (`no-pong`); SHALL close a channel whose incoming message exceeds
`MAX_MESSAGE_BYTES` in UTF-8 bytes (`too-large`), or whose `bufferedAmount`, when given, exceeds
`MAX_BUFFERED_BYTES` (`too-slow`); SHALL, before the link is ready, queue at most 64 accepted channels (beyond:
`try-again`), each holding only its `hello` (`hello-first`, `too-large`, `hello-pending` as `design.md` §5.4 lists),
pinged like open ones; SHALL close every queued channel at a refusal or `stop()` (`private-link-not-accepting`); SHALL
release the instance id when it closes a channel, whatever the carrier does; SHALL call `connect(signal)` for every
(re)connection, treat a rejection as a lost connection with the existing back-off, and on `stop()` abort the signal,
not wait for `connect()`, close a channel it resolves later and start no retry; and SHALL close a channel passed to
`accept()` on a process not accepting channels, logging a line and throwing nothing. `messagePortChannel(port)` SHALL
adapt a browser or `worker_threads` `MessagePort`.

#### Scenario: A dead peer over a `MessagePort`
- **WHEN** the private side of a channel link stops answering pings
- **THEN** the public side terminates the channel `no-pong` at the second interval and frees the instance id, and a
  reconnect succeeds

### Requirement: LM-7 User modules for the ledger worker

WITH `config: { data }`, THE host SHALL give its user modules as `modules` objects or as `modulesFrom`, the URL of an
ES module whose `modules` export lists them, which the main thread and the ledger worker both import; a module that
declares ledger tasks SHALL come through `modulesFrom`. WITH `config: { file }`, the user modules SHALL be the file's
`modules` export. IF modules are given twice (`modules` with `{ file }`, `modules` and `modulesFrom`, `modulesFrom`
with `{ file }`) THEN startup SHALL refuse with `modules-given-twice`; IF `modules` objects declare ledger tasks THEN
with `ledger-tasks-need-modules-from`; IF `modulesFrom` fails to import, or its `modules` export is missing or not an
array, THEN with `invalid-configuration` (`load-failed`, `modules-not-a-list`) naming the URL.

#### Scenario: Ledger tasks from a URL
- **WHEN** a host passes `modulesFrom` for a module that declares a ledger task
- **THEN** the task runs in the ledger worker

### Requirement: LM-8 An in-memory block source

WHERE the host passes `source`, THE engine SHALL accept it only on a public process and only when it is exactly an
`InMemoryBlockSource` carrying none of the engine's hook members (otherwise `source-refused`), and SHALL create no node
client: `node` is validated and never contacted.

#### Scenario: A subclass with a hook
- **WHEN** a host passes a subclass of `InMemoryBlockSource` that defines `checkChain`
- **THEN** `started` rejects with `source-refused`

### Requirement: LM-9 The handle and its failures

THE handle SHALL expose exactly `status()`, `started`, `ended`, `closed`, `stop()`, `pause()`, `resume()`,
`backup(target)` and the handlers of LM-4, and no test seam or unredacted setting. `status()` SHALL report AE-3's state
and conditions, the reason, cursor, head, lag, how processing ended, and the bound addresses. WHEN startup is refused or
fails, `started` SHALL reject with an `UmbraError` whose code is the reason code `status()` reports (the failure itself
when it is an `UmbraError` with that code, else a new one whose `cause` is the original value); WHEN `stop()` or the
host's `signal` stops startup, `started` SHALL reject with the abort reason; `started` SHALL be marked handled.
Aborting `signal` SHALL stop the process as `stop()` does. `acceptPublicConfigHash` SHALL be the library's form of
PP-14's accepted hash.

#### Scenario: A callback fails during startup
- **WHEN** a module's `on-start-db` throws `new Error("x")`
- **THEN** `started` rejects with an `UmbraError` of code `callback-error` naming the module and the point, whose
  `cause` is that error, and `status().reason.code` is `callback-error`

### Requirement: LM-10 Refusal classes

THE engine SHALL class a refusal by its startup step: a refusal at the configuration step — loading, resolving, and the
library's option and network-plan checks, before the database opens, the worker starts or a port opens — SHALL end the
process (`refused`, `closed` resolved) while mounted admin keeps answering; a later startup failure SHALL keep the
process up, `refused`, admin answering, until `stop()`; a failure while processing SHALL halt it, reads answering until
`stop()`; and a failure of one connection or channel SHALL affect only it (`design.md` §7.2).

#### Scenario: A configuration refusal in the library
- **WHEN** `startUmbraDB` is given a configuration whose core revision sets `backupAtStop`
- **THEN** `started` rejects with `library-setting-refused`, `closed` resolves, no port opened, and mounted
  `/status` answers 200 `refused` with that reason

### Requirement: LM-11 The browser demo runs on the engine

THE in-repository browser demo SHALL start each process through the engine with `config: { data }`, link its private
instances over `MessageChannel`s with `publicSide: { channels: true }` and `privateSide: { connect }`, serve its API and
admin through the engine's fetch-style handlers and its subscriptions through a channel, and bundle no socket carrier
but as the build's `UNAVAILABLE` stubs.

#### Scenario: The demo with a lockstep private instance
- **WHEN** the demo runs a core and a lockstep private instance in workers over a `MessageChannel`
- **THEN** the private instance follows the core, and the contents hash equals Node.js's for the same chain
