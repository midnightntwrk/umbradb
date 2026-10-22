# Spec delta — `admin-endpoints` capability

EARS forms and terms as in `specs/runner/spec.md`. **Lag** is the block source's finalized head minus the cursor.

## ADDED Requirements

### Requirement: AE-1 Four read-only endpoints on the admin listener

THE process SHALL serve `GET /health/live`, `GET /health/ready`, `GET /status` and `GET /config` on its admin listener
(default `0.0.0.0:8081`, separate from the module API listener), from process start to exit, and SHALL answer them from
the runner's memory only, without database reads. Any other method or path SHALL answer 404.

#### Scenario: Endpoints answer while the database is busy
- **WHEN** a PGlite block transaction holds the database queue for 5 s
- **THEN** each endpoint answers within 1 s

### Requirement: AE-2 A heartbeat independent of the work

THE runner SHALL tick a heartbeat every second, independently of callbacks and database work, and `GET /health/live`
SHALL answer 200 while the last tick is within the liveness timeout (default 30 s) and 503 otherwise, in every state.

#### Scenario: A long callback does not fail liveness
- **WHEN** an `on-compute` callback runs for 60 s without yielding to the database
- **THEN** `/health/live` answers 200 throughout

### Requirement: AE-3 States and conditions

THE process SHALL be in exactly one state — `starting` (startup and migrations), `refused`, `syncing` (lag above the
following threshold), `following` (lag at or below it; default 3), `stopped`, `halted`, `stopping` (after SIGTERM) —
with zero or more conditions; this change defines the conditions `upgrade-required` and `waiting-for-source`, and later
projects add theirs. A refused or halted process SHALL stay up and live.

#### Scenario: A refused start stays up
- **WHEN** startup refuses because a migration checksum changed
- **THEN** the process keeps running, `/health/live` answers 200, `/health/ready` answers 503, and `/status` reports
  `refused` with the reason

### Requirement: AE-4 Readiness

`GET /health/ready` SHALL answer 200 when the state is `following` or `stopped`, or `syncing` with no readiness lag
set; and 503 while `starting`, `refused`, `halted`, `stopping`, or while the lag exceeds a set readiness lag.

#### Scenario: Catching up past the readiness lag
- **WHEN** the readiness lag is 10 and the process is 500 blocks behind
- **THEN** `/health/ready` answers 503 until the lag is 10 or less, then 200

### Requirement: AE-5 `/status` and `/config` contents

`GET /status` SHALL answer 200 with JSON holding: state and conditions (with reason, height, module and point for
`refused` and `halted`); cursor; finalized head and lag; per module: id, version, side, start, stop, stopped or not,
and the digest at the cursor if opted in; instance role, uptime and last commit time (wall-clock, reported only). Fields
with no value yet SHALL be `null`. `GET /config` SHALL answer 200 with JSON holding: the entries in effect and the
configuration history; the operational fields; enabled modules with their declarations (without callbacks); the
database backend and version and whether the writer lock is held; the build version and commit.

#### Scenario: Before the first block
- **WHEN** `/status` is read on an empty database before block S commits
- **THEN** `cursor` is `null`

### Requirement: AE-6 Secrets and errors are never leaked

THE endpoints SHALL show fields of kind `secret`, and credentials inside URLs, as `[redacted]`, and SHALL produce error
texts from error codes and allowlisted fields only, never from raw exception messages.

#### Scenario: A credential in an exception
- **WHEN** a callback throws an error whose message contains the database password, and processing halts
- **THEN** `/status` shows the error code, height, module and point, and the password appears nowhere in the response
