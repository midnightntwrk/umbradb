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
configuration (test keys included) and the heights its keys arrived at.

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
`genesis`, `start`, `cursor`, `refused` — null, `duplicate-instance` or `lockstep-behind`); `committed` (core → private:
`height`, `hash`); `report` (lockstep private → core: `height`, `hash`); `read` (private → core: `id`, `statements` —
an array of `{ sql, params }` run as one consistent read; used when the public database is PGlite) and `read-result`
(core → private: `id`, `height` — `null` before the first commit — and either, per statement, `columns` (name and
PostgreSQL type of each column) with `rows`, or `error`, a code); `api` (either way: `id`,
`module`, `method`, `params`) and `api-result` (`id`, and `result` or `error`). In rows and params, `bigint` and
`numeric` values SHALL be decimal strings, `bytea` values `0x`-prefixed hex, and `jsonb` values JSON. IF a message
fails its schema, or has an unknown `v` or `type`, THEN the connection SHALL close; IF an instance id is already
connected THEN the second `hello` SHALL be refused with `duplicate-instance`.

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

### Requirement: PP-8 Keys enter through the key registry

THE backbone part `core-key-registry` SHALL admit keys whose `kind` a configured private module declared (`keyKinds`)
and whose `bytes` pass that module's `validateKey`; `key_id` = SHA-256(UTF-8 kind ‖ bytes); an id already admitted SHALL
be left unchanged. In this change keys enter only as configured test keys (CF-11): an endpoint that accepts keys over
the network (a key API) is not core and is not part of this change, and a later, non-core module can offer one by
feeding the registry (Q70). A test key whose `start` is h SHALL become pending, firing `on-key`, before block h's
`on-compute` begins. WHEN a block's `on-compute` begins, the registry SHALL take every pending key, give it that block's
height as `arrived_height`, publish the set as the `block` item `admitted-keys`, and write them in that block's
`on-db-write`. IF the block does not commit and is processed again THEN its keys SHALL be taken again; IF processing
halts or the process stops or crashes first THEN pending keys SHALL be dropped, and become pending again when their
block is next processed.

#### Scenario: A test key admitted at its start
- **WHEN** a private process's configuration lists a test key with start h, and block h commits
- **THEN** `on-key` fired once before h's `on-compute`, and the key is stored with `arrived_height` h

### Requirement: PP-9 What the public side may call

THE public side SHALL call nothing on a private process except its `GET /status` admin endpoint and the fields of
`hello` and `report`.

#### Scenario: The core's view of an instance
- **WHEN** `/status` of the core is read
- **THEN** it shows each instance's id, connection, lockstep flag and synced height, and nothing else from it

### Requirement: PP-10 Keys never reach the public side

THE system SHALL never log or report key bytes, and SHALL keep keys and everything private modules compute from them in
the private process; keeping module output private is each module developer's responsibility (Q16).

#### Scenario: Searching for a key
- **WHEN** a test key is registered and blocks are processed
- **THEN** its bytes appear in no public table, log line, status field or API response

### Requirement: PP-11 Opt-in mutual TLS

WHERE the operator configures certificates and trusted roots (`tls`), THE process transport SHALL require mutual TLS;
WHERE not, it SHALL run unauthenticated, for trusted networks, one host, a TEE with its own
channel, or a browser. TEE attestation is out of scope.

#### Scenario: A client without a certificate
- **WHEN** mutual TLS is configured and a private process connects without a client certificate
- **THEN** the core refuses the connection

### Requirement: PP-12 Private databases are not backed up by UmbraDB

THE system SHALL refuse `umbradb backup` of a private database unless the development opt-in is set (BK-1). An operator
can still copy the database with PostgreSQL's own tools; this rule governs only what UmbraDB writes.

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
