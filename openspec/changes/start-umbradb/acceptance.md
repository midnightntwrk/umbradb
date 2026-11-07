# Acceptance — START-UMBRADB: UmbraDB as a library

Every criterion is numbered, individually checkable, and tagged with how it is verified (the tags of `core-arch`'s
`acceptance.md`): `[CI]` CI test, `[FAULT]` crash or fault injection, `[DIFF]` differential, `[STATIC]` static check,
`[DOC]` documentation artifact. `[NEG]` marks a criterion whose test carries a negative control that is seen failing
for its own reason with the fault put back. Database criteria run on PostgreSQL 18 in Docker and on PGlite, as
`core-arch`'s do, unless a criterion names one backend. The requirements each criterion verifies are in parentheses.

## Definition of done

1. Every criterion below passes; every `[NEG]` control fails for its own reason with the fault put back.
2. L54 passes from the packed, installed package, with no access to the repository's `src/`.
3. The runtime criteria L1–L12 and L14 pass on PGlite (in memory and on a directory) and on PostgreSQL; L13 passes on
   the final tree.
4. The `core-arch` criteria rewritten in §8 pass with their new text; every other `core-arch` criterion passes
   unchanged, its tests moved from `startProcess` to the engine or to `startUmbraDB`.
5. The 0.10.0 release checklist's gates and the conformance gate pass again on the PR head carrying this change (owner
   decision D-9).

## 1. Library-mode guarantees

- **L1** `[CI][NEG]` Start → blocks → `backup()` (PGlite) → `stop()` adds no listener to `process`, for any event.
  (LM-2)
- **L2** `[CI][NEG]` The same run without `log`, and a refused start, a failed SQL statement and a halt, write nothing
  to stdout or stderr, with PGlite in memory, a PGlite directory (the `node:sqlite` import) and PostgreSQL. (PGlite's
  own `console.error` on its internal failure paths is LM-2's documented exception, not exercised here.) (LM-2)
- **L3** `[CI][NEG]` The `node:sqlite` `ExperimentalWarning` is dropped; another `ExperimentalWarning` emitted while
  the wrapper is installed reaches the host's listeners; a host that replaced `process.emitWarning` meanwhile keeps its
  replacement; two overlapping PGlite directory acquisitions, finishing in either order, share one import and leave
  the original `process.emitWarning` installed. (LM-2)
- **L4** `[CI][NEG]` With `log` given, the ledger worker's and the admin worker's output reaches `log` and nothing
  else. (LM-2)
- **L5** `[CI]` No child process starts without `backup()`; `backup()` on PostgreSQL spawns exactly `pg_dump
  --version` and `pg_dump`. (LM-2)
- **L6** `[CI][NEG]` No listening socket exists without a request. (LM-2, LM-3)
- **L7** `[CI][NEG]` No configuration file is looked for or read except `config.file`: a `umbradb.config.ts` in `cwd`
  is not read. (LM-2, CF-1)
- **L8** `[CI][NEG]` `process.exitCode` is unchanged after a start, a refused start, a failed SQL statement, a halt and a
  stop, in memory, on a PGlite directory and on PostgreSQL; the negative control sets it in the engine's stop. (PGlite's
  fatal paths are LM-2's documented exception, owner decision D-22.) (LM-2)
- **L9** `[FAULT][NEG]` A close step that rejects is logged, later steps run, `closed` resolves, and no rejection is
  unhandled — in `stop()`'s close, startup's refusal cleanup, and a configuration refusal's end. (LM-2)
- **L10** `[CI]` With `cwd` ≠ `process.cwd()`: a `{ file }`, a `{ data }` PGlite path and a backup target resolve
  against `cwd`. (LM-2)
- **L11** `[CI]` Without `cwd`, relative paths resolve against `process.cwd()`. (LM-2)
- **L12** `[CI]` No ledger worker runs for a build without the ledger; no admin thread runs without a listening admin.
  (LM-1)
- **L13** `[STATIC][NEG]` The `process`-access check fails, under `src/` outside `src/cli/` and
  `src/library/start-umbradb.ts`, on each of: the global `process`, `globalThis.process`, `global.process`,
  `globalThis["process"]`, `(globalThis as T).process`, a one-argument `path.resolve`; it passes a local binding named
  `process`; `loadConfig` has no `cwd` default. (LM-2)
- **L14** `[CI]` Aborting `signal` stops like `stop()`: `closed` resolves, and no rejection is unhandled. (LM-9,
  RN-13)

## 2. Network

- **L15** `[CI][NEG]` An address written and also given in code is refused `network-address-conflict` (`both`).
  (LM-3)
- **L16** `[CI][NEG]` `admin: true` with no `listen.admin` written is refused `network-address-conflict`
  (`no-address`). (LM-3)
- **L17** `[CI][NEG]` An address written for a surface of the process's side and not requested, and one written while
  the link is requested over `channels` / `connect`, are refused `network-address-conflict` (`unused`). (LM-3)
- **L18** `[CI][NEG]` `private-link-misconfigured` `wrong-side` for a `privateSide` request on a public process and
  the reverse; `reader-missing` for PostgreSQL with `publicSide: { channels: true }`, and with `publicSide: { host,
  port }`, without `transportReader`; with a written listen address and no `transportReader`, `umbradb run` refuses it
  through the schema, as today. (LM-3, CF-4)
- **L19** `[CI]` Library private processes over TCP: `privateSide: { host, port }` connects to a library public
  process listening at `publicSide: { host: "127.0.0.1", port: 0 }` (its address read from `status().listening`); and
  `publicSide: true` / `privateSide: true` with the addresses and mutual `tls` written in the configuration connect
  over TLS; in both, the private process follows and lockstep works when listed. (LM-3, PP-4)
- **L20** `[CI]` On PostgreSQL, a public link over channels with `transportReader`: the link's reads run on the reader
  login (`current_user` in a read is it). (LM-3, CF-4)
- **L21** `[CI]` `port: 0` on `api`, `admin` and `publicSide`: each bound address appears in `status().listening` as
  it binds; after a class-B refusal the admin address stays (it keeps answering) and a closed listener's is null; after
  `closed` all are null. (LM-3, LM-9)
- **L22** `[CI]` `/config` of a library process shows the process revision's `listen` and `privateLink` as the plan's
  addresses as bound (a requested port 0 as the bound port), absent where nothing listens or connects at an address,
  and `network` naming each surface's mode; the command's `/config` keeps its `listen` values and gains `network`.
  (LM-3, AE-5)
- **L23** `[CI]` Every module-API answer, mounted and on the listener, carries `X-Umbra-Version`;
  `X-Umbra-Config-Hash` is absent before the hash exists and present after. (LM-4, RN-16)
- **L24** `[CI][NEG]` Mounted `api.http`: a body over the limit gets 413 on both backends; on PostgreSQL, a read past
  `apiReadTimeoutMs` fails `query-timeout` as on the listener; on PGlite the read is not bounded, as on the listener
  (DB-15). (LM-4, DB-15)

## 3. Lifecycle

- **L25** `[CI]` `starting`, mounted: `/health/live` 200 with `{ live: true, heartbeatAgeMs, livenessTimeoutMs,
  thread: "host" }`, `/health/ready` 503, `/status` 200 with `instance.role` null until the side is known, `/config`
  200 with every field but `build` null before the configuration is validated; the module API answers 503 with
  `{ error: { code: "not-serving", … }, state: "starting", reason: null }`. (LM-5, AE-2, AE-5)
- **L26** `[CI]` Serving: `status().state` is `syncing`, then `following` once the lag is at or below the following
  threshold; with a readiness lag set, mounted and listening `/health/ready` answer 503 while the lag exceeds it and
  200 after; the module API answers and subscriptions work through `api.upgrade`; a module's own 503 and the module
  API's `no-committed-height` 503 keep their bodies. (LM-5, AE-4)
- **L27** `[CI]` `stopped` at an upgrade boundary: `/health/ready` 200 and reads answer at the cursor; after `stop()`
  the mounted module API answers 503 with the lifecycle body (`stopping`) and closes its subscriptions, and a listening
  module API closes its listener; `/status` answers 200 `stopping`, and mounted admin still answers after `closed`.
  (LM-5, RN-12)
- **L28** `[CI]` `halted`: `/health/live` 200, `/health/ready` 503, `/status` 200 with the reason; reads answer at the
  cursor until `stop()`. (LM-5)
- **L29** `[CI]` A class-A refusal in the library: mounted `/health/live` 200, `/health/ready` 503, `/status` 200
  `refused` with the reason; the module API answers 503 with the lifecycle body carrying the same reason; `started`
  rejects with that code; `closed` resolves; nothing was opened; with no handler attached to `started`, no rejection
  is unhandled. (LM-5, LM-9, LM-10, AE-3)
- **L30** `[CI][NEG]` Class-B refusals in the library: an injected `on-start-db` failure makes `started` reject with
  `callback-error` naming the module and point, `cause` the thrown value, and `status().reason.code` is
  `callback-error`; the module API's or the link's port already in use makes it `listen-failed`; a listening admin
  keeps answering (`/health/live` 200, `/status` 200 `refused`) until `stop()`; `closed` waits for `stop()`. (LM-9,
  LM-10)
- **L31** `[CI]` The command, unchanged: a refusal of the configuration logs its findings and exits 1 with no admin
  listener opened; after a later refusal (its admin bound) the admin listener answers `/health/live` 200,
  `/health/ready` 503 and `/status` `refused` until SIGTERM, then the process exits 1; during a SIGTERM drain
  `/status` answers 200 `stopping`. (AE-3, RN-13)
- **L32** `[CI]` `startUmbraDB` returns synchronously; `stop()` during a slow `{ file }` import ends the start,
  `started` rejects with an `AbortError`, the state is `stopping` with `reason` null, and `closed` resolves; aborting
  the host's `signal` with a reason R during startup makes `started` reject with R; with no handler on `started`, no
  rejection is unhandled. (LM-1, LM-9)

## 4. Channels

- **L33** `[CI]` Public `{ channels: true }` and private `{ connect }` over `messagePortChannel`: the private process
  follows with a PGlite or absent `publicDatabase` (reads through the core); lockstep works when listed. (LM-6, PP-4)
- **L34** `[FAULT][NEG]` With controlled timers, a peer that stops answering pings is terminated at the second interval
  (not before the first ping is outstanding); its instance id is free; a reconnect succeeds. (LM-6)
- **L35** `[CI][NEG]` A `bufferedAmount` above `MAX_BUFFERED_BYTES` closes the channel `too-slow`. (LM-6)
- **L36** `[CI][NEG]` A message above `MAX_MESSAGE_BYTES` (UTF-8 bytes) closes the channel `too-large`. (LM-6)
- **L37** `[CI]` `report-hash-mismatch` over a channel halts the private process; `report-unchecked` makes it
  reconnect over a new channel. (LM-6, PP-4)
- **L38** `[CI][NEG]` Before the link is ready: 64 channels queue and answer pings, the 65th closes `try-again`; a
  queued channel whose first message is not a `hello` closes `hello-first`, one sending a second application message
  closes `hello-pending`, one sending a `hello` over 64 KiB closes `too-large`; a queued peer that sends its `hello` and
  then answers pings through three intervals stays queued and is activated when the link starts; a queued peer that
  stops answering pings closes `no-pong` and frees its slot; at a class-B refusal every queued channel closes
  `private-link-not-accepting`. (LM-6)
- **L39** `[CI][NEG]` `accept()` on a process not accepting channels, or after `stop()`: the channel closes
  `private-link-not-accepting`, a line is logged, nothing throws. (LM-6)
- **L40** `[CI]` A rejecting `connect()` is retried with the back-off. (LM-6)
- **L41** `[CI][NEG]` A `connect()` that never settles does not delay `stop()`; a channel it resolves after `stop()`
  is closed; a later rejection is not unhandled; no retry starts after `stop()`. (LM-6)
- **L42** `[CI]` UmbraDB's own `close()` releases the instance id even when the carrier never calls `onClose`. (LM-6)

## 5. Modules and the ledger worker

- **L43** `[CI]` `{ data, modules: [m] }` (no ledger tasks) with `core-block-parsed` starts. (LM-7)
- **L44** `[CI][NEG]` `modules-given-twice` for `modules` with `{ file }`, `modules` with `modulesFrom`, and
  `modulesFrom` with `{ file }`. (LM-7)
- **L45** `[CI][NEG]` `modules` objects declaring ledger tasks are refused `ledger-tasks-need-modules-from`. (LM-7)
- **L46** `[CI]` `modulesFrom` with ledger tasks: the tasks run in the worker. (LM-7, MD-1)

## 6. Options, refusals and the handle

- **L47** `[CI][NEG]` `library-setting-refused` for each of `backupAtStop`, `backupOnSignal`. (LM-2, BK-1)
- **L48** `[CI][NEG]` `source-refused` for a subclass carrying a hook, a hook-free subclass, a plain object
  implementing the interface, and a `source` on a private process. (LM-8)
- **L49** `[CI]` With an in-memory `source`, no node client is created and no outbound connection is opened to
  `node`. (LM-8)
- **L50** `[CI]` `acceptPublicConfigHash: B` lets a private database that recorded A continue; without it, startup
  stops with `public-config-changed`. (LM-9, PP-14)
- **L51** `[CI][NEG]` A renamed key (`listen.transport`, `coreTransport`) is refused with `renamed-setting` naming the
  new key, by `startUmbraDB` and by each command. (CF-4)
- **L52** `[CI]` The handle has no member beyond `design.md` §4's; `backup` takes one argument; `UmbraDBStarted` holds
  no setting. (LM-9)
- **L53** `[CI]` `finalizedHeight` answers against a node; rejects `node-unreachable` after `timeoutMs`; rejects with
  the abort reason when its signal aborts. (LM-1)
- **L54** `[CI]` The packed package installed into an empty project runs a module test: a `custom` network whose
  genesis hash is the in-memory chain's block 0 hash, with explicit `ledgerTable.rows` written in the fixture
  (mainnet's built-in rows below runtime 2.0, then `{ specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger:
  "v9" }`, covering the in-memory runtime `2_001_000`, as `TEST_NETWORK` in `test/runner/process-build.ts`); start 0;
  `node: "ws://127.0.0.1:9"` (never contacted); `database: { kind: "pglite", memory: true }`; the development opt-in;
  one module with one route; `InMemoryBlockSource({ head: 10n })`; it asserts cursor 10 and the route's answer through
  `api.http`. (LM-1, LS-1)

## 7. The command and shared resolution

- **L55** `[CI]` `umbradb run`'s existing tests keep their assertions (keys renamed); `--update-hash` reaches the
  private source; the worker threads' output reaches the process's stdout and stderr as today. (LM-1, RN-13)
- **L56** `[STATIC][NEG]` No module outside `src/runner/resolve.ts` calls `commandBuild`, `buildDeclarations`,
  `inferSide`, `validateConfig` or `processCoreEntry`, and none outside the engine calls `planNetwork`; the negative
  control adds such a call to `src/cli/backup.ts`. (LM-1)
- **L57** `[CI]` `config check`, `backup` and `restore` keep their existing tests' assertions (keys renamed),
  `test/backup/restore-private.test.ts` included; `config check` still reports a declarations refusal at
  `modules[<i>]` beside the validation findings, and a refused validation is redacted as today. (LM-1, CF-10)
- **L58** `[CI][DIFF]` The browser demo: public and lockstep private workers over a new `MessageChannel` for each
  (re)connection; subscriptions through `api.connect`; a reload resumes; the same contents hash as Node.js; the bundle
  carries the socket carriers only as `UNAVAILABLE` stubs. (LM-11, BR-1, BR-4)
- **L59** `[DOC]` The CHANGELOG lists the key renames, the `node:sqlite` warning no longer printed, the six new refusal
  codes, `callback-error` and `listen-failed` added to `ERROR_CODES`, and the removed exports; the module guide's
  "try your module" recipe (removed with issue 00053) is restored, using `startUmbraDB` with L54's fixture. (LS-1)

## 8. Mounted admin, the database, security through the new paths, and the review's additions

- **L60** `[CI]` In one host, a second handle on a PGlite directory refuses `writer-lock-held` while the first is
  open, and opens after the first handle's `closed`. (LM-2)
- **L61** `[CI][NEG]` Mounted admin's `/status` and `/config`, with no admin listener, reach the expected
  `core_digest.tables` rows, database version and identity anchor — read independently from the database at the
  committed height through a separate read handle — after startup's open with no commit yet (a restart on a database
  with a cursor), after commits, and after a forced interleaving in which a commit lands during a fact read; a
  listening admin on the same database reaches the same expected values; the negative control disables the follow-up
  read after an interleaved commit and fails the freshness assertion; no database read runs per request; the
  heartbeat's timer does not keep the host's event loop alive. (LM-5, AE-1, AE-5)
- **L62** `[CI][NEG]` A malformed option — `config` with neither `file` nor `data`, `modules` not an array,
  `modulesFrom` not a `URL`, `network: "configured"`, `api: { port: 1.5 }`, `publicSide: { channels: false }`, an
  unknown `network` key — makes `started` reject with `invalid-configuration`, reason `invalid-option`, naming the
  option's path; `startUmbraDB` throws in none of these cases. (LM-1, LM-3, LM-10)
- **L63** `[CI][NEG]` A `modulesFrom` that fails to import is refused `invalid-configuration` (`load-failed`) naming
  the URL; one whose `modules` export is missing, or not an array, is refused `modules-not-a-list`. (LM-7)
- **L64** `[CI]` `umbradb run` on a private configuration that writes `listen.privateLink` starts as today, opens no
  listener for it and refuses nothing; `startUmbraDB` on the same configuration does the same. (LM-3, CF-4)
- **L65** `[CI][NEG]` Secrets through mounted `admin.http`. On PostgreSQL, with a password in `database` and in
  `transportReader`, a TLS key and a node URL with credentials; on PGlite, with a TLS key and a node URL with
  credentials (PGlite refuses `transportReader`, CF-4): `/config` shows each secret as `[redacted]`; a callback that
  throws an error whose message holds one of them makes `/status` show the code, height, module and point and the
  secret nowhere; the negative control serves the raw settings on the mounted path and fails. The same holds for the
  error answers of mounted `api.http`. (LM-4, AE-6)
- **L66** `[CI][NEG]` Over a channel link (public `{ channels: true }`, private `{ connect }`): a `read` whose
  statement is not one read is answered `read-refused` naming it and runs nothing (A172's cases); a message failing its
  schema, or with an unknown `v` or `type`, closes the channel; a second `hello` with a connected instance id is
  refused `duplicate-instance`; an instance id outside the id rule closes the channel; each negative control (the check
  removed on the channel path only) fails. (LM-6, PP-4)
- **L67** `[CI][NEG]` On PostgreSQL with `publicSide: { channels: true }`: a `transportReader` login that is a
  superuser, holds `CREATEROLE`, is a member of the writer's login or holds `INSERT` on a public table refuses startup
  `transport-reader-can-write`, as A177 does on the socket link; the negative control skips the check for channels and
  fails. (LM-3, LM-6, CF-4)
- **L68** `[CI][NEG]` Through mounted `api.upgrade`, as on the listener (`src/runner/api-server.ts`): a message that is
  not a JSON object with a `type`, a `subscribe` without a valid `id` and `name`, and an unknown `type` are answered
  `invalid-request`; an unknown subscription name is answered as on the listener; a message over
  `DEFAULT_MAX_MESSAGE_BYTES` closes the connection; a subscriber holding more than the module API's
  `MAX_BUFFERED_BYTES` unsent is terminated; the upgrade response carries `X-Umbra-Version` and, once the hash exists,
  `X-Umbra-Config-Hash`, which holds no secret: it neither holds nor changes with a password in `database` (on
  PostgreSQL) or a TLS key and a node URL's credentials (on PGlite, whose `database` has no password, CF-4); each
  negative control removes its check on the mounted path only and fails. (LM-4, RN-15, RN-16)

## 9. `core-arch` criteria rewritten by this change

Each replaces the `core-arch` criterion of the same id; only what is in bold changed.

- **A1** `[STATIC]` A test pins the sorted value exports and the type exports of `"."` to `core-arch` `design.md` §12
  **as amended by `start-umbradb` `design.md` §4**; adding or removing an export fails it with the name. (LS-1)
- **A74** `[CI]` A process item published in its provider's `on-start-db` is visible to a requiring module from
  `on-start-api` on; publishing twice, publishing from `on-compute`, or publishing an undeclared item fails the
  callback; a required process item left unpublished refuses startup with `process-item-missing`, **except
  `node-client` when the host gives an in-memory `source`: a module requiring it finds none in its items, and startup
  goes on and processes the chain; with the same `source`, another required process item left unpublished is still
  refused**. (MD-7, **LM-8**)
- **A157** `[CI]` A configuration file that cannot be loaded, one that is not plain data and one that fails its
  schemas, and a build whose module declarations fail MD-2 (an invalid declaration), each make `umbradb run` log every
  finding with its path and exit with a non-zero code, and make **`startUmbraDB` end `refused` with `closed` resolved**,
  with no admin listener opened at any time; a refusal after the configuration is validated (a changed migration
  checksum) still answers the four endpoints. (AE-1, AE-3, owner decisions Q137, Q148)
- **A162** `[CI]` On both backends, a private process running against a core that restarts with a data field of its
  configuration changed halts with `public-config-changed` at its next message from the core, before it processes
  another height; a core restarted with the same configuration changes nothing; every module API answer **written
  after the hash exists (after `on-start-db`)** carries `X-Umbra-Config-Hash`, which holds no secret (with a password
  in `database` **on PostgreSQL**, the header neither holds it nor changes with it); a private process without a transport, reading the
  public configuration history again at a reconnection to its public database, halts alike. (PP-14, RN-16, PP-4,
  owner decision Q147)
- **A166** `[CI]` Under the opt-in, a PGlite `path` `<tmp>/a/b` with `<tmp>/a` missing: **`startUmbraDB`** and
  `umbradb run` create `<tmp>/a/b`, log that they created it, naming it, and commit block S; `umbradb restore` into
  `<tmp>/c/d` creates it and restores; `umbradb config check --database` on a file naming `<tmp>/e/f` and `umbradb
  backup` of `<tmp>/g/h` create no directory. (CF-4, owner decisions Q163, Q165)
- **A167** `[CI]` With the node unreachable (a closed port) and startup retrying it, SIGTERM — and likewise
  **`UmbraDBHandle.stop()`** — ends the process within 5 s: `stopping`, then `ended` of kind `signal`, the node client
  closed, no connection attempt after the stop, no second signal; `umbradb run` exits 0. A committed negative control
  (a startup whose wait for the node ignores the stop) fails it. (RN-13)
- **A169** `[CI]` A tape node answers up to height h and then refuses connections; SIGTERM — and likewise
  **`UmbraDBHandle.stop()`** — while the running loop waits for h + 1's block, and, with `core-ledger-state`, while its
  `on-compute` at h + 1 awaits the state root, ends the process within 5 s: `ended` of kind `signal`, no connection
  attempt after the stop, nothing of h + 1 stored; a restart against a node that answers again processes h + 1. A
  committed negative control (a loop whose node calls ignore the stop) fails it. (RN-13, issue 00042)
- **A174** `[CI]` With a umask of `000`, every backup file UmbraDB writes on Node.js — `umbradb backup`, at stop, on
  SIGUSR2, **`UmbraDBHandle.backup`** — has mode `0600` from creation (its temporary file included) to after its
  rename. (BK-1, the threat model draft's gap 7)
- **A175** `[CI]` `umbradb run` on PGlite without `backupOnSignal`, sent SIGUSR2 while blocks commit, logs one line
  naming the signal and `backupOnSignal`, writes no backup, keeps committing heights and exits 0 on SIGTERM; a process
  started with **`startUmbraDB`** adds no SIGUSR2 listener **(`backupOnSignal` is refused there, L47)**. (BK-1, owner
  decision Q173)
- **A177** `[CI]` On PostgreSQL 18.6 with **`listen.privateLink`**: a core whose `transportReader` login has only
  `SELECT` on the public schemas serves a private process's reads on that login (`current_user` in a read is it); one
  whose login is a superuser, holds `CREATEROLE`, is a member of the writer's login or holds `INSERT` on a public table
  refuses startup with `transport-reader-can-write`, naming it; without `transportReader` the start is refused with its
  path; with the gate turned off (a test seam), a `read` that writes is refused by the database. `ssl` defaults to
  `disable` for `localhost` and to `require` for another host. (CF-4, PP-4, owner decisions Q175, Q182)

The `/status` and `/config` JSON schemas that A66 validates against gain `instance.role: null` while starting and
the `network` field of `/config` (`design.md` §5.2); A66's text is unchanged.

## 10. Requirement coverage

| Requirement | Criteria |
|---|---|
| LM-1 | L12, L32, L53, L54, L55, L56, L57, L62 |
| LM-2 | L1–L11, L13, L47, L60 |
| LM-3 | L6, L15–L22, L62, L64, L67 |
| LM-4 | L23, L24, L65, L68 |
| LM-5 | L25–L29, L61 |
| LM-6 | L33–L42, L66, L67 |
| LM-7 | L43–L46, L63 |
| LM-8 | L48, L49, A74 |
| LM-9 | L14, L21, L29, L30, L32, L50, L52 |
| LM-10 | L29, L30, L62 |
| LM-11 | L58 |
| AE-1, AE-2, AE-3, AE-5 | L25, L29, L31, L61, A157 |
| RN-13, RN-15, RN-16 | L14, L23, L26, L31, A162, A167, A169 |
| CF-1, CF-4 | L7, L18, L20, L51, L64, A166, A177 |
| MD-1 | L46 |
| MD-7 | A74 |
| PP-4, PP-14 | L19, L33, L37, L50, A162 |
| BK-1 | L47, A174, A175 |
| LS-1 | L54, L59, A1 |
