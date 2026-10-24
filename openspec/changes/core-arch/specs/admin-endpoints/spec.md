# Spec delta — `admin-endpoints` capability

EARS forms and terms as in `specs/runner/spec.md`. **Lag** is the block source's finalized head minus the cursor.

## ADDED Requirements

### Requirement: AE-1 Four read-only endpoints on the admin listener

THE process SHALL serve `GET /health/live`, `GET /health/ready`, `GET /status` and `GET /config` on its admin listener
(default `0.0.0.0:8081`, separate from the module API listener), from process start to exit, from a worker thread of
its own that answers from a state snapshot the runner publishes to it (shared memory), without database reads, so a
busy main thread or a held database never delays an answer. Any other method or path SHALL answer 404. Each endpoint
SHALL be provided by a backbone part, as a function of that snapshot which the admin worker runs: `core-health`
(`GET /health/live`, `GET /health/ready`), `core-status` (`GET /status`) and `core-config` (`GET /config`); only
backbone parts SHALL provide admin endpoints — a module's endpoints are on the module API listener (RN-15) (Q70).

#### Scenario: Endpoints answer while the database is busy
- **WHEN** a PGlite block transaction holds the database queue for 5 s
- **THEN** each endpoint answers within 1 s

### Requirement: AE-2 A heartbeat independent of the work

THE runner SHALL tick a heartbeat every second on its main thread, and `GET /health/live` SHALL answer 200 while the
last tick is within the liveness timeout (default 30 s) and 503 otherwise, in every state. A callback that awaits I/O
(the database, the network, a worker) SHALL NOT stop the heartbeat; a callback that blocks the main thread with
computation longer than the liveness timeout SHALL make `/health/live` answer 503, because the process is then stuck by
definition — long computation belongs in a worker thread (as the ledger's does, project 3).

#### Scenario: A long awaiting callback does not fail liveness
- **WHEN** an `on-compute` callback awaits a 60 s operation
- **THEN** `/health/live` answers 200 throughout

#### Scenario: A blocking callback fails liveness, and the endpoints still answer
- **WHEN** an `on-compute` callback runs a 60 s synchronous loop
- **THEN** `/health/live` answers 503 after 30 s, and every endpoint keeps answering within 1 s

### Requirement: AE-3 States and conditions

THE process SHALL be in exactly one state — `starting` (startup and migrations), `refused`, `syncing` (lag above the
following threshold), `following` (lag at or below it; default 3), `stopped`, `halted`, `stopping` (after SIGTERM) —
with zero or more conditions — `waiting-for-node`, `waiting-for-lockstep`, `finality-stall`, `node-retrying`,
`database-retrying`, `upgrade-required`, `slow-block` (RN-17). A refused or halted process SHALL stay up and live.
**Lag** is, for the core, the node's finalized head minus the cursor and, for a private process, the public cursor minus
its own.

#### Scenario: A refused start stays up
- **WHEN** startup refuses because a migration checksum changed
- **THEN** the process keeps running, `/health/live` answers 200, `/health/ready` answers 503, and `/status` reports
  `refused` with the reason

### Requirement: AE-4 Readiness

`GET /health/ready` SHALL decide in this order: 503 while `starting`, `refused`, `halted` or `stopping`; 200 while
`stopped`, whatever the lag (a stopped process serves its height by design); otherwise (`syncing` or `following`) 200
when no readiness lag is set or the lag is at or below it, and 503 when the lag exceeds it.

#### Scenario: Catching up past the readiness lag
- **WHEN** the readiness lag is 10 and the process is 500 blocks behind
- **THEN** `/health/ready` answers 503 until the lag is 10 or less, then 200

### Requirement: AE-5 `/status` and `/config` contents

`GET /status` SHALL answer 200 with JSON holding: state and conditions (with reason, height, module and point for
`refused` and `halted`); cursor; lag; for the core, the node's finalized and best heads, connection state and retry
count, the queue depth, the tip cap and whether finality stalls; per module: id, version, side, start, stop, stopped or
not, and its tables' rows of `core_digest.tables` (each table's last-changed height and digest, DT-5); the ledger
version, package and last root check; private instances (on the core: id, connection, lockstep, synced height; on a
private process: its cursor, the public cursor, lag, lockstep); instance role, uptime and last commit time (wall-clock,
reported only, as RFC 3339 text in UTC, `2025-05-21T14:30:00Z`, Q68). Fields with no value yet SHALL be `null`. `GET
/config` SHALL answer 200 with JSON holding: the entries in effect and the configuration history; the operational
fields; enabled modules with their declarations (without callbacks); the chain identity; the ledger version table in
effect with package identities; the database backend and version and whether the writer lock is held; the build version
and commit.

#### Scenario: Before the first block
- **WHEN** `/status` is read on an empty database before block S commits
- **THEN** `cursor` is `null`

### Requirement: AE-6 Secrets and errors are never leaked

THE endpoints SHALL show fields of kind `secret`, and credentials inside URLs, as `[redacted]`, and SHALL produce error
texts from error codes and allowlisted fields only, never from raw exception messages.

#### Scenario: A credential in an exception
- **WHEN** a callback throws an error whose message contains the database password, and processing halts
- **THEN** `/status` shows the error code, height, module and point, and the password appears nowhere in the response
