# Spec delta — `admin-endpoints` capability

Modifies `core-arch`'s `specs/admin-endpoints/spec.md` (`start-umbradb` `design.md` §0: `core-arch` is archived first).
Each requirement is restated in full; the change is the library entry of `start-umbradb` (`specs/library-mode/spec.md`).

## MODIFIED Requirements

### Requirement: AE-1 Four read-only endpoints on the admin listener

THE process SHALL serve `GET /health/live`, `GET /health/ready`, `GET /status` and `GET /config` on its admin listener —
for `umbradb run` always (default `0.0.0.0:8081`), for a library process (`startUmbraDB`) only WHERE its network request
asks (LM-3); separate from the module API listener — from the moment its configuration and its network plan are
validated to exit — a configuration refused at startup ends the process before the listener opens (AE-3, owner decision
Q137) —, from a worker thread of its own that answers from a state snapshot the runner publishes to it (shared memory),
without database reads, so a busy main thread or a held database never delays an answer. Any other method or path SHALL
answer 404. Each endpoint SHALL be provided by a backbone part, as a function of that snapshot which the admin worker
runs: `core-health` (`GET /health/live`, `GET /health/ready`), `core-status` (`GET /status`) and `core-config` (`GET
/config`); only backbone parts SHALL provide admin endpoints — a module's endpoints are on the module API listener
(RN-15) (Q70).

A library process SHALL also answer these endpoints through its mounted handler (`admin.http`, LM-4) from
`startUmbraDB`'s return on, on the host's thread, from the same snapshot kept in memory, with no database read per
request (LM-5).

#### Scenario: Endpoints answer while the database is busy
- **WHEN** a PGlite block transaction holds the database queue for 5 s
- **THEN** each endpoint answers within 1 s

### Requirement: AE-2 A heartbeat independent of the work

THE runner SHALL tick a heartbeat every second on its main thread, and `GET /health/live` on the admin listener SHALL
answer 200 while the last tick is within the liveness timeout (default 30 s) and 503 otherwise, in every state. A
mounted admin handler runs on the host's thread, so it cannot observe a blocked thread: its `GET /health/live` SHALL
answer 200 whenever it answers, with `"thread": "host"` and the heartbeat's age (LM-5). A callback that awaits I/O (the
database, the network, a worker) SHALL NOT stop the heartbeat; a callback that blocks the main thread with computation
longer than the liveness timeout SHALL make `/health/live` on the admin listener answer 503, because the process is then stuck by definition —
long computation belongs in a worker thread (as the ledger's does, project 3).

#### Scenario: A long awaiting callback does not fail liveness
- **WHEN** an `on-compute` callback awaits a 60 s operation
- **THEN** `/health/live` answers 200 throughout

#### Scenario: A blocking callback fails liveness, and the endpoints still answer
- **WHEN** an `on-compute` callback runs a 60 s synchronous loop in a process whose admin listens
- **THEN** `/health/live` on the admin listener answers 503 after 30 s, and every endpoint on it keeps answering within
  1 s; a mounted admin handler, on the blocked thread, answers only once the loop ends

### Requirement: AE-3 States and conditions

THE process SHALL be in exactly one state — `starting` (startup and migrations), `refused`, `syncing` (lag above the
following threshold), `following` (lag at or below it; default 3), `stopped`, `halted`, `stopping` (after SIGTERM) —
with zero or more conditions — `waiting-for-node`, `waiting-for-lockstep`, `finality-stall`, `node-retrying`,
`database-retrying`, `upgrade-required`, `slow-block` (RN-17), `paused` (while the finalized loop is paused between
heights, BK-1: with `since` and `by`, `pause` for `UmbraDBHandle.pause()` or `signal` for a backup on SIGUSR2; owner
decision Q174). A refused or halted process SHALL stay up and live, except that IF the build's module declarations fail
their validation (MD-2), or the configuration cannot be loaded, is not plain data (CF-1) or fails its schemas (CF-2,
CF-3), THEN `umbradb run` SHALL log every finding with its path and exit with a non-zero code, having served no admin
endpoint (owner decisions Q137, Q148). A library process refused at its configuration step — those cases, and the
library's option and network-plan checks (LM-10) — SHALL end `refused` with `closed` resolved and no admin listener
opened, its mounted admin handler still answering (LM-5). **Lag** is, for the core, the node's finalized head minus the
cursor and, for a private process, the public cursor minus its own.

#### Scenario: A refused start stays up
- **WHEN** startup refuses because a migration checksum changed
- **THEN** the process keeps running, `/health/live` answers 200, `/health/ready` answers 503, and `/status` reports
  `refused` with the reason

#### Scenario: A paused loop
- **WHEN** a host program calls `pause()` and the loop stays paused
- **THEN** `/status` lists the condition `paused` with `by: "pause"` and the time it paused, until `resume()` lets the
  loop run again

#### Scenario: A refused configuration ends the process
- **WHEN** `umbradb run` refuses at startup because a setting fails its schema (`livenessTimeoutMs: "30s"`)
- **THEN** every finding is logged with its path, the process exits with a non-zero code, and no admin listener was
  opened; started with `startUmbraDB`, the same configuration ends `refused` with `closed` resolved, the findings in
  `started`'s rejection and on `log`, and no admin listener opened

#### Scenario: A fault of the build's declarations ends the process
- **WHEN** `umbradb run` refuses at startup because the configuration file exports `modules = [stats, stats]`
  (`duplicate-id`, MD-2)
- **THEN** the finding is logged with the module and its position, the process exits with a non-zero code, and no
  admin listener was opened; started with `startUmbraDB` and `modules: [stats, stats]`, it ends `refused` with
  `closed` resolved, the finding in `started`'s rejection and on `log`, and no admin listener opened

### Requirement: AE-5 `/status` and `/config` contents

`GET /status` SHALL answer 200 with JSON holding: state and conditions (with reason, height, module and point for
`refused` and `halted`); cursor; lag; for the core, the node's finalized and best heads, connection state (`connecting`,
`connected`, `retrying` or `closed`) and retry count, the queue depth, the tip cap and whether finality stalls; per
module: id, version, side, start, stop, stopped or not, and its tables' rows of `core_digest.tables` (each table's
last-changed height and digest, DT-5); the ledger version, package and last root check; private instances (on the core:
id, connection, lockstep, synced height; on a private process: its cursor, the public cursor, lag, lockstep); instance
role, uptime and last commit time (wall-clock, reported only, as RFC 3339 text in UTC, `2025-05-21T14:30:00Z`, Q68).
Fields with no value yet SHALL be `null`. `GET /config` SHALL answer 200 with JSON holding: the entries in effect and
the configuration history; the operational fields; enabled modules with their declarations (without callbacks); the
chain identity; the ledger version table in effect with package identities; the database backend and version and whether
the writer lock is held; the build version — no build commit: a running build does not know the commit it was built from
(owner decision Q134).

`instance.role` SHALL be `null` until the process's side is known. Before the configuration is validated (a mounted
handler only), `/config` SHALL hold every field null but the build version. `/config` SHALL show the process revision's
`listen` and `privateLink` as the network plan's addresses, as bound, and a `network` field naming each surface's mode
(LM-3; `start-umbradb` `design.md` §5.2).

#### Scenario: Before the first block
- **WHEN** `/status` is read on an empty database before block S commits
- **THEN** `cursor` is `null`
