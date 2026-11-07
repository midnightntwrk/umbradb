# Spec delta — `private-processes` capability

Modifies `core-arch`'s `specs/private-processes/spec.md` (`start-umbradb` `design.md` §0: `core-arch` is archived
first). Each requirement is restated in full; the change is the library entry of `start-umbradb`
(`specs/library-mode/spec.md`).

## MODIFIED Requirements

### Requirement: PP-4 The process transport

THE core SHALL listen for private processes on its `listen.privateLink` address over WebSocket, or, in a library
process, at the address or over the channels its network request gives (LM-3, LM-6; the browser demo's `MessagePort`s,
direct calls in tests), exchanging JSON messages `{ "v": 1, "type", … }` with heights as decimal strings and hashes as
`0x`-prefixed lowercase hex, exactly as the schemas of `core-arch` `design.md` §8 define them: `hello` (private → core:
`instance`, `version`, `height`, `hash` or null); `hello-ack` (core → private: `lockstep`, `genesis`, `start`, `cursor`,
`refused` — null, `duplicate-instance` or `lockstep-behind` —, `configHash`); `committed` (core → private: `height`,
`hash`, `configHash`); `report` (lockstep private → core: `height`, `hash`); `read` (private → core: `id`, `statements`
— an array of `{ sql, params }` run as one consistent read; used when the public database is PGlite) and `read-result`
(core → private: `id`, `height` — `null` before the first commit —, `configHash`, and either, per statement, `columns`
(name and PostgreSQL type of each column) with `rows`, or `error`, a code, with `refused` naming the statement when the
code is `read-refused`) — and no other message (owner decision Q140: a private process uses this connection and its
reads of public data, and nothing calls a module across it). `configHash` SHALL be the core's configuration hash
(RN-16), which a private process checks on every message that carries it (PP-14, owner decision Q147). In rows and
params, `bigint` and `numeric` values SHALL be decimal strings, `bytea` values `0x`-prefixed hex, and `jsonb` values
JSON; a parameter string of `0x` and lowercase hex pairs SHALL be sent to the database as `bytea`, so it has a `bytea`
column's own type and index, every other string as text (owner decision Q141). A private module's read handle through
the core SHALL send one `read` per statement, each a consistent read at or above the handle's height, so two statements
of one callback may see two heights (owner decision Q142). THE core SHALL run a `read`'s statements only when each is
one read — its command `SELECT`, `WITH`, `VALUES` or `TABLE`, one statement, naming no function or catalog the core
refuses (`core-arch` `design.md` §8, **Confined reads**) —, so that none leaves the read-only transaction or changes the
session; IF one is not THEN the core SHALL run none of them, answer `read-refused` naming it, and keep the connection
(task 14.2b, A172). IF a message fails its schema, or has an unknown `v` or `type`, THEN the connection SHALL close; IF
an instance id is already connected THEN the second `hello` SHALL be refused with `duplicate-instance`.

#### Scenario: A read through the core
- **WHEN** a private process sends `read` with id `7` and two statements while the public database is PGlite
- **THEN** it receives `read-result` with id `7`, the committed height read, and two row arrays whose `bigint` values
  are decimal strings

### Requirement: PP-14 A changed public configuration halts a private process

WHEN a private process starts, THE system SHALL run its full checks of the public side (PP-2, PP-13) and compare the
core's configuration hash (RN-16) — its first `hello-ack`'s, and the hash of the public configuration history it read —
with the hash it accepted when it last ran, kept in its private database; IF they differ THEN startup SHALL stop with
`public-config-changed`, naming the new hash and how to accept it, and the private process SHALL accept a new hash only
when its operator starts it with that hash (`umbradb run --update-hash=<hash>`; `startUmbraDB`'s
`acceptPublicConfigHash`), after which it runs its full checks and records it; a first start records the hash it finds
(owner decision Q159). THE private process SHALL compare the `configHash` of every `hello-ack`, `committed` and
`read-result` it receives with the recorded hash, and IF they differ THEN it SHALL halt with `public-config-changed`
before it processes another height. WHERE a private process has no transport connection to the core, it SHALL instead
read the public configuration history again at each reconnection to its public database, and halt alike IF its hash
differs from the one it read at startup. A restart SHALL run the full checks again (owner decision Q147), and stops as
above until the operator accepts the new hash.

#### Scenario: The core restarts with another configuration
- **WHEN** a private process runs against a core that restarts with a data field of its configuration changed
- **THEN** the private process halts with `public-config-changed` at its next message from the core, before it
  processes another height; against a core restarted with the same configuration, nothing changes
