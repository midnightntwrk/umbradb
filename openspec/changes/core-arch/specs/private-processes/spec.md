# Spec delta — `private-processes` capability

EARS forms and terms as in `specs/runner/spec.md`. A **private process** runs the private backbone and private
modules, owns its own **private database**, may run in a TEE together with that database, and never talks to the node.
The **core process** owns the public database. An instance is **independent** (default) or **lockstep** (listed in the
core's `lockstepInstances`).

## ADDED Requirements

### Requirement: PP-1 Processes and databases

THE system SHALL run one core process, the only one that talks to the node, owning the public database, and zero or
more private processes, each owning its own private database. A private process MAY read public data; the public side
SHALL NOT read private data and MAY call only the private calls of PP-9. A private database SHALL follow the same
determinism rules as the public one (DT-3, DT-6; owner decision Q75): it is a function of its public database, its
configuration and the private inputs its modules take, which are each module's own — the core handles no keys (owner
decision Q154).

#### Scenario: The core never reads a private database
- **WHEN** a core process and a private process run with a test private module
- **THEN** the core's database connections reach only the public database

### Requirement: PP-2 A private database is bound to one public database

WHEN a private database is first started, THE private backbone part `core-private-source` SHALL record the public
database's genesis hash and S in `core_private_source.cursor`, which also holds the private cursor's height, hash and
parent hash, written in each block's transaction (owner decision Q124). On every start, before any migration, IF the
public database's core has never started (it has no chain identity; Q125), or its genesis hash is not the configured
network's (the built-in table's for a known network, `genesisHash` for `custom`; Q136), THEN startup SHALL refuse; and
IF the recorded genesis hash or S differ from the public database's, or the private S is below the public S, THEN
startup SHALL refuse. Each of these refusals is `private-binding-mismatch`, its `details.reason` naming which:
`public-not-started`, `network`, `genesis`, `start` or `private-start-below`.

#### Scenario: Pointed at another public database
- **WHEN** a private database bound to network A starts against a public database of network B
- **THEN** startup refuses with `private-binding-mismatch`

#### Scenario: Configured for another network
- **WHEN** a private process configured for `mainnet` starts for the first time against the public database of a
  preprod core
- **THEN** startup refuses with `private-binding-mismatch` (`details.reason` `network`, both genesis hashes) before any
  migration, and the private database records no binding

#### Scenario: The public core never started
- **WHEN** a private process starts against a public database whose core has never started
- **THEN** startup refuses with `private-binding-mismatch` (`details.reason` `public-not-started`)

### Requirement: PP-3 Private processes take blocks from the public database

WHEN a private process starts and after every reconnect, `core-private-source` SHALL read the public cursor and process
every height from its own cursor + 1 up to it, in order, reading public data at each height, firing `on-finalized` and
`on-fetch`; the core's `committed` messages SHALL only wake it, so it never depends on receiving every message.

#### Scenario: Messages lost during a disconnect
- **WHEN** the transport drops while the public cursor advances 50 heights
- **THEN** after reconnecting the private process processes those 50 heights in order

### Requirement: PP-4 The process transport

THE core SHALL listen for private processes on its `listen.transport` address over WebSocket (`postMessage` between
browser workers, direct calls in tests), exchanging JSON messages `{ "v": 1, "type", … }` with heights as decimal
strings and hashes as `0x`-prefixed lowercase hex, exactly as the schemas of `design.md` §8 define them:
`hello` (private → core: `instance`, `version`, `height`, `hash` or null); `hello-ack` (core → private: `lockstep`,
`genesis`, `start`, `cursor`, `refused` — null, `duplicate-instance` or `lockstep-behind` —, `configHash`); `committed`
(core → private: `height`, `hash`, `configHash`); `report` (lockstep private → core: `height`, `hash`); `read` (private
→ core: `id`, `statements` — an array of `{ sql, params }` run as one consistent read; used when the public database is
PGlite) and `read-result` (core → private: `id`, `height` — `null` before the first commit —, `configHash`, and either,
per statement, `columns` (name and PostgreSQL type of each column) with `rows`, or `error`, a code, with `refused`
naming the statement when the code is `read-refused`) — and no other message (owner decision Q140: a private process
uses this connection and its reads of public data, and nothing calls a module across it). `configHash` SHALL be the
core's configuration hash (RN-16), which a private process checks on every message that carries it (PP-14, owner
decision Q147). In rows and params, `bigint` and `numeric` values SHALL be decimal strings, `bytea` values `0x`-prefixed
hex, and `jsonb` values JSON; a parameter string of `0x` and lowercase hex pairs SHALL be sent to the database as
`bytea`, so it has a `bytea` column's own type and index, every other string as text (owner decision Q141). A private
module's read handle through the core SHALL send one `read` per statement, each a consistent read at or above the
handle's height, so two statements of one callback may see two heights (owner decision Q142). THE core SHALL run a
`read`'s statements only when each is one read — its command `SELECT`, `WITH`, `VALUES` or `TABLE`, one statement,
naming no function or catalog the core refuses (`design.md` §8, **Confined reads**) —, so that none leaves the read-only
transaction or changes the session; IF one is not THEN the core SHALL run none of them, answer `read-refused` naming it,
and keep the connection (task 14.2b, A172). IF a message fails its schema, or has an unknown `v` or `type`, THEN the
connection SHALL close; IF an instance id is already connected THEN the second `hello` SHALL be refused with
`duplicate-instance`.

#### Scenario: A read through the core
- **WHEN** a private process sends `read` with id `7` and two statements while the public database is PGlite
- **THEN** it receives `read-result` with id `7`, the committed height read, and two row arrays whose `bigint` values
  are decimal strings

### Requirement: PP-5 Independent instances lag as they need

WHERE an instance is independent, it SHALL read only append-only public tables, by height, and the core SHALL never
wait for it.

#### Scenario: An independent instance stopped for 100 blocks
- **WHEN** an independent instance is stopped for 100 blocks and restarted
- **THEN** the core never paused, and the instance processes the 100 heights from public data

### Requirement: PP-6 Lockstep instances process each height at that height

WHERE an instance is listed in `lockstepInstances`, it SHALL process height h only while the public cursor is exactly h,
checking this in each block's consistent read and halting (`lockstep-behind`) if the cursor is past h; THE core SHALL,
before opening the transaction for h, wait with no transaction open until every listed instance has reported a
committed height ≥ h − 1 (an instance that has not committed its first block reports its start − 1); a listed instance
that is not connected, including one not seen since the core started, counts as down and the core SHALL wait for it
(Q24). THE core SHALL learn each instance's height from `hello` and `report`, so a core restart cannot deadlock. IF a
`report` hash differs from the public block's hash THEN that instance SHALL halt. A module declaring `needsLockstep`
SHALL refuse to run on an instance whose `hello-ack` says `lockstep: false`.

#### Scenario: A lockstep instance is stopped
- **WHEN** a lockstep instance stops and the core reaches its next block
- **THEN** the core waits before `BEGIN` with no transaction open, reports `waiting-for-lockstep`, and resumes when the
  instance reports

### Requirement: PP-7 A lockstep instance that is behind is refused

IF a listed instance's `hello` reports a height below the public cursor − 1 (it was listed late, or its database was
replaced) THEN the core SHALL answer `refused: lockstep-behind`, keep waiting for it (Q24) and report it; it SHALL NOT
run, because the mutable public state of the heights it missed is gone.

#### Scenario: Listed after the cursor passed it
- **WHEN** an instance at height 100 is added to the lockstep list while the public cursor is 500
- **THEN** its `hello` is refused with `lockstep-behind`, and the core waits and names it

<!-- PP-8 withdrawn by owner decision Q154 (keys are a module's, not the core's) -->

### Requirement: PP-9 What the public side may call

THE public side SHALL call nothing on a private process except its `GET /status` admin endpoint and the fields of
`hello` and `report`.

#### Scenario: The core's view of an instance
- **WHEN** `/status` of the core is read
- **THEN** it shows each instance's id, connection, lockstep flag and synced height, and nothing else from it

<!-- PP-10 withdrawn by owner decision Q154 (keys are a module's, not the core's) -->

### Requirement: PP-11 Opt-in mutual TLS

WHERE the operator configures certificates and trusted roots (`tls`), THE process transport SHALL require mutual TLS;
WHERE not, it SHALL run unauthenticated, for trusted networks, one host, a TEE with its own
channel, or a browser. TEE attestation is out of scope.

#### Scenario: A client without a certificate
- **WHEN** mutual TLS is configured and a private process connects without a client certificate
- **THEN** the core refuses the connection

### Requirement: PP-12 Private databases are not backed up by UmbraDB

THE system SHALL refuse `umbradb backup` of a private database unless the development opt-in is set (BK-1). An operator
can still copy the database with PostgreSQL's own tools; this rule governs only what UmbraDB writes. A private backup
written under the opt-in SHALL be restored as any backup is (BK-3, BK-4), checked against its public database instead
of the node (owner decision Q153).

#### Scenario: A production private backup
- **WHEN** `umbradb backup` runs against a private process without the development opt-in
- **THEN** it refuses with `private-backup-refused` and writes no file

### Requirement: PP-13 A private module may require public table items

WHEN a private process resolves its requirement graph (MD-3, MD-4), THE private backbone SHALL count as provided, for
each height range, the public `table` items that the public core's enabled modules provide there, read from the public
database (owner decision Q126); IF a private module requires a public `table` item that no public module provides at a
height the private module runs THEN startup SHALL refuse, as MD-4 refuses a core module's: `item-no-provider` when no
public module provides it, `item-not-available` when one provides it only at other heights. A private module SHALL NOT
require a public `block` or `process` item.

#### Scenario: A wallet module on the public ledger events
- **WHEN** a private module requires `ledger-events`, and the public core enables `core-ledger-state` from S
- **THEN** the private process starts; against a public core that does not enable `core-ledger-state`, startup refuses
  with `item-no-provider` naming `ledger-events`

### Requirement: PP-14 A changed public configuration halts a private process

WHEN a private process starts, THE system SHALL run its full checks of the public side (PP-2, PP-13) and compare the
core's configuration hash (RN-16) — its first `hello-ack`'s, and the hash of the public configuration history it read —
with the hash it accepted when it last ran, kept in its private database; IF they differ THEN startup SHALL stop with
`public-config-changed`, naming the new hash and how to accept it, and the private process SHALL accept a new hash only
when its operator starts it with that hash (`umbradb run --update-hash=<hash>`; `startProcess`'s `updateHash`), after
which it runs its full checks and records it; a first start records the hash it finds (owner decision Q159). THE
private process SHALL compare the `configHash` of
every `hello-ack`, `committed` and `read-result` it receives with the recorded hash, and IF they differ THEN it SHALL
halt with `public-config-changed` before it processes another height. WHERE a private process has no transport
connection to the core, it SHALL instead read the public configuration history again at each reconnection to its
public database, and halt alike IF its hash differs from the one it read at startup. A restart SHALL run the full
checks again (owner decision Q147), and stops as above until the operator accepts the new hash.

#### Scenario: The core restarts with another configuration
- **WHEN** a private process runs against a core that restarts with a data field of its configuration changed
- **THEN** the private process halts with `public-config-changed` at its next message from the core, before it
  processes another height; against a core restarted with the same configuration, nothing changes
