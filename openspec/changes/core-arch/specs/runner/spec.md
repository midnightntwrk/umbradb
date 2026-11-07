# Spec delta — `runner` capability

Requirements are written in **EARS** (Easy Approach to Requirements Syntax): ubiquitous `THE <system> SHALL …`,
event-driven `WHEN <trigger> THE <system> SHALL …`, state-driven `WHILE <state> THE <system> SHALL …`, unwanted
behaviour `IF <condition> THEN THE <system> SHALL …`, optional `WHERE <feature> THE <system> SHALL …`. Every
requirement has an id; `acceptance.md` maps each id to the criteria that verify it.

Terms: a **point** is a named step of the runner where callbacks attach; a **module** declares requirements, provided
data items and callbacks (`modules` capability); the **backbone** is the core's own parts, registered at the same
points; an **entry** is one revision of the core's or a module's configuration with a start, an optional stop and a
version (`configuration` capability); the **cursor** is the last committed height and hash; **committed data at h**
means data committed up to and including height h − 1 while height h is processed; the **block source** is the
interface through which the runner learns the cursor, the finalized head and each finalized block.

## ADDED Requirements

### Requirement: RN-1 The main program is a fixed sequence of points

THE runner SHALL run, at process start, `on-start-db` and then `on-start-api`; and THEN, for every height h from
cursor + 1 up to the block source's finalized head, in ascending order and without skipping a height:
`on-finalized` (once per new finalized head, before its heights are processed), `on-fetch`, `on-parse`,
`on-start-height` (entries starting at h), `on-compute`, the block transaction with `on-db-write` inside it,
`on-after-db-write`, and `on-stop-height` (entries stopping at h). THE runner SHALL expose `on-best-block` and
`on-rollback` only through its dispatch interface, for the block source's queue to call (IN-6), and SHALL NOT call
them itself.

#### Scenario: Points run in order for each height
- **WHEN** an in-memory block source reports finalized head 3 on an empty database with S = 1
- **THEN** a recording module observes, for each of heights 1, 2 and 3 in that order, `on-fetch`, `on-parse`,
  `on-compute`, `on-db-write`, `on-after-db-write`, preceded once by `on-finalized` for head 3

### Requirement: RN-2 The runner does only its five duties

THE runner SHALL perform only these duties: resolve the module graph into an ordered callback list per point and per
height range; drive the block source; call the points in order; wait for lockstep reports (PP-6), then open each block's
transaction, call `on-db-write` and commit; and publish its state, from its own memory, to the admin worker, where the
backbone parts `core-health`, `core-status` and `core-config` answer the admin endpoints (AE-1, Q70). Configuration
checks, chain identity, fetching, parsing and writing SHALL be done by callbacks of backbone parts or modules.

#### Scenario: The runner writes nothing itself
- **WHEN** a height is processed with only a test backbone and no modules
- **THEN** every row written at that height was written by a callback, through a write handle

### Requirement: RN-3 Callbacks within a point run in a fixed order

THE runner SHALL call the callbacks registered at a point in this order: first the backbone parts present, in the fixed
order `core-chain`, `core-block-fetch`, `core-block-commit`; then every other module in the requirement graph's
topological order computed by Kahn's algorithm, choosing among ready modules the smallest id by UTF-8 byte order; and,
at `on-db-write` only, the backbone part `core-digest` last. WHERE a point is marked "in series" (§ table in `design.md`
§2) THE runner SHALL await each callback before calling the next. WHERE a point is marked "parallel where the graph
allows" (`on-fetch`, `on-parse`, `on-compute`) THE runner MAY run concurrently callbacks with no requirement path
between them, and SHALL start a callback only after every callback of a module it requires has completed. At startup
(DB-9) THE runner SHALL run the parts' migrations and `on-start-db` in one order: the backbone parts present in their
fixed order, with `core-digest` right after the core's and the private processes' own parts, so that its tables exist
before any module migrates; then every other module by Kahn's algorithm over the union of every range's requirements,
the smallest id by UTF-8 byte order first; a cycle only that union has SHALL refuse startup with `graph-cycle` (Q95).

#### Scenario: Unrelated modules write in id order
- **WHEN** modules `b-mod` and `a-mod`, with no requirement path between them, both write in `on-db-write`
- **THEN** on every height `a-mod` runs before `b-mod`, after the backbone parts and before `core-digest`

#### Scenario: A provider finishes before its consumer starts
- **WHEN** module `consumer` requires an item provided by `provider` in `on-compute`
- **THEN** `consumer`'s `on-compute` starts only after `provider`'s has completed, on every height

### Requirement: RN-4 Each point has fixed read and write permissions

THE runner SHALL give callbacks only these handles: `on-start-db` (called after the module's migrations, DB-9) a schema
write handle for the module's own schema; `on-db-write` a block write handle (committed data plus what earlier callbacks
wrote for this block, writes to its own schema only); `on-compute` a read handle at committed height h − 1;
`on-after-db-write` and `on-stop-height` a read handle at h; `on-finalized` a read handle at the cursor; `on-start-api`
a registry whose handlers get a read handle per request; and no database handle to `on-best-block`, `on-fetch` (core
side), `on-parse` and `on-rollback`. A module MAY also read through the read-only `db` item (CD-1) for work outside the
points, as the module guide describes; inside a callback it SHALL use the handle it was given. IF a callback tries to
write outside the handle it was given THEN THE runner SHALL treat it as a callback error (RN-8).

#### Scenario: `on-compute` sees only committed data
- **WHEN** module `m` reads its own table in `on-compute` at height h
- **THEN** the read reports committed height h − 1 and contains no row written at h

### Requirement: RN-5 The block context carries one height's items

WHEN processing of height h begins THE runner SHALL create a block context holding h, its hash and parent hash, the
`block` items published so far for h, the calling module's settings for the revision covering h, and an `active`
predicate over the entry ranges at h; and SHALL drop it after `on-stop-height` of h. THE runner SHALL accept an item
through `ItemSink.put` only from the module that declares it with a `block` lifetime, at most once per item per block,
and SHALL make it visible only to callbacks that run after the publishing callback has completed and before the block's
COMMIT. `on-after-db-write` and `on-stop-height` SHALL receive the block's height, hash, parent hash and settings but no
`block` items: they read committed data instead, so the same context can be rebuilt after a restart (RN-11).

#### Scenario: An item reaches a later callback of the same block
- **WHEN** `provider` puts item `x` in `on-parse` at h and `consumer` (which requires `x`) reads it in `on-compute`
- **THEN** `consumer` sees the value put at h, and at h + 1 it sees only the value put at h + 1

#### Scenario: A second put is an error
- **WHEN** a module puts the same item twice for one block
- **THEN** the second put is a callback error (RN-8)

### Requirement: RN-6 Each finalized height is committed in exactly one transaction

THE runner SHALL commit each finalized height in exactly one `BEGIN … COMMIT` that contains every active callback's
`on-db-write` for that height, and SHALL NOT put two heights in one transaction, including during catch-up. WHILE the
runner waits for the block source THE runner SHALL hold no transaction open.

#### Scenario: Catch-up still commits per height
- **WHEN** the block source reports a finalized head 100 heights above the cursor
- **THEN** the database log shows 100 separate transactions, one per height, in ascending order

### Requirement: RN-7 Entry ranges and revisions decide which callbacks run

THE runner SHALL call a module's callbacks for height h only when an entry revision of that module covers h
(`start ≤ h ≤ stop`), and SHALL pass that revision's settings in the block context. WHEN a revision of a module starts
at h with the same version as the build's, THE runner SHALL switch to its settings at h without a mid-chain start.

#### Scenario: Settings change at a revision boundary
- **WHEN** module `m` has revisions starting at 1 (setting `k = 1`) and at 5 (setting `k = 2`)
- **THEN** `m`'s callbacks see `k = 1` for heights 1–4 and `k = 2` from height 5

### Requirement: RN-8 A failure before COMMIT leaves nothing and halts

IF a callback of `on-fetch`, `on-parse`, `on-start-height`, `on-compute` or `on-db-write` fails, or the database
reports an error other than a lost connection before COMMIT, THEN THE runner SHALL roll back the block transaction (if
open), keep nothing of height h, discard the block context, and halt processing with the reason, height, module and
point; the process SHALL stay up in state `halted`. IF a callback of `on-after-db-write` or `on-stop-height` fails THEN
THE runner SHALL halt with height h committed.

#### Scenario: A failing writer leaves no row of its block
- **WHEN** the second of two modules throws in `on-db-write` at height h
- **THEN** no row written at h exists, the cursor is h − 1, and `/status` reports `halted` with h, the module and the
  point

### Requirement: RN-9 Start-height notifications fire before the entry's first work

WHEN height h is the start of an entry (the core's or a module's) THE runner SHALL fire `on-start-height` for it
before any `on-compute` at h — the core's first, then modules in graph order. IF the process stops before the entry's
first block commits THEN THE runner SHALL fire it again on the next start (at least once).

#### Scenario: Start height fires again after a crash
- **WHEN** the process is killed after `on-start-height` of module `m` at its start h but before h commits
- **THEN** after restart `on-start-height` fires for `m` at h again, before `on-compute` at h

### Requirement: RN-10 Stop heights end an entry after its last block

WHEN the block of an entry's stop height s commits THE runner SHALL fire `on-stop-height` for every entry stopping at
s — stopping modules in reverse graph order, then the core — and SHALL no longer call a stopped module's callbacks.
WHEN the core's stop height commits THE runner SHALL stop processing and enter state `stopped`, ready and serving reads
at s. WHEN the process starts with the cursor at or above the core's stop THE runner SHALL process nothing, enter
`stopped`, and fire the core's `on-stop-height` again.

#### Scenario: The core stops at its stop height
- **WHEN** the core's stop is 10 and the block source's finalized head is 20
- **THEN** the cursor ends at 10, `on-stop-height` has fired for the core at 10, and `/status` reports `stopped`

### Requirement: RN-11 After-write notifications are delivered at least once

WHEN the process starts with a cursor c THE runner SHALL fire `on-after-db-write` for c again, and `on-stop-height`
for every entry stopping at c again, before processing c + 1, because a crash may have come before they completed.
The re-delivered callbacks SHALL get the context of RN-5 for c (no `block` items) and SHALL be those of the build now
running, even if the revision covering c names another version: these points write nothing, so a newer callback cannot
change stored data, and modules SHALL make them idempotent.
`on-db-write` SHALL run exactly once per committed height (a rolled-back attempt leaves nothing), and
`on-best-block`, `on-fetch`, `on-parse`, `on-rollback`, `on-finalized` and `on-compute` MAY run again for a height
after a restart.

#### Scenario: A crash after COMMIT re-delivers the after-write notification
- **WHEN** the process is killed after the COMMIT of h and before `on-after-db-write` of h completes
- **THEN** after restart `on-after-db-write` fires for h before any callback for h + 1

### Requirement: RN-12 The runner stops at an upgrade boundary

WHEN the next height H to process is the start of a revision whose version differs from the version this build
carries for that entry (CORE-ARCH Q43) THE runner SHALL commit H − 1, complete its `on-after-db-write` and
`on-stop-height`, stop processing, and enter state `stopped` with
the condition `upgrade-required`, naming each entry, the version needed and the build's version; and SHALL keep serving
reads at H − 1.

#### Scenario: A newer module version is scheduled
- **WHEN** module `m` built at version 1.0.0 has a recorded revision with version 1.1.0 starting at 50
- **THEN** the runner commits 49, `/status` reports `stopped` with `upgrade-required` for `m` (needs 1.1.0, build
  1.0.0), and `/health/ready` answers 200

### Requirement: RN-13 SIGTERM stops cleanly

WHEN the process receives SIGTERM THE runner SHALL enter `stopping`, start no new height, let a block whose
transaction is open commit or roll back, and then exit. During startup it SHALL stop before startup's next step and
end any wait for the node at once, an unreachable node's retries included.

#### Scenario: SIGTERM during a block transaction
- **WHEN** SIGTERM arrives while `on-db-write` of h is running
- **THEN** after exit the database holds h either completely or not at all, and a restart resumes from the cursor

#### Scenario: SIGTERM during startup, the node unreachable
- **WHEN** SIGTERM arrives while startup retries a node it cannot reach
- **THEN** the process enters `stopping`, makes no further connection attempt, closes what startup opened and exits,
  without a second signal

#### Scenario: SIGTERM while the loop waits on an unreachable node
- **WHEN** SIGTERM arrives while the loop, with no transaction open, waits for a node call that the client retries
  (the next height's block, or a state root an `on-compute` awaits)
- **THEN** that wait ends, the height it belonged to stores nothing, the process exits without a second signal, and a
  restart processes that height again

### Requirement: RN-14 The block source is the runner's only view of the chain

THE runner SHALL learn the cursor, the finalized head and each finalized block's height, hash and parent hash only
through the block source registered by the backbone, and SHALL process heights only up to the finalized head it
reports. THE node-backed source is the backbone part `core-block-fetch` (CD-2); THE change SHALL also ship an
in-memory implementation, used by tests and by module authors.

#### Scenario: The runner waits for the source
- **WHEN** the in-memory source's finalized head equals the cursor
- **THEN** the runner processes nothing, holds no transaction open, and continues when the source reports a higher
  head

### Requirement: RN-15 Module APIs are registered once, at startup

WHEN `on-start-api` runs, THE runner SHALL collect every handler registered through `ApiRegistry` and mount the HTTP
handlers on the module API listener (`listen.api`) and the subscriptions on WebSocket at the same listener; IF two
modules register the same method and path, or the same subscription name, THEN startup SHALL refuse and name both
modules. Each request SHALL get a read handle at the latest committed height; a subscription SHALL be notified from
the module's `on-after-db-write` through `emit`.

#### Scenario: Two modules claim one path
- **WHEN** modules `a` and `b` both register `GET /api/v4/graphql`
- **THEN** startup refuses with `duplicate-api-route`, the route, `a` and `b`

### Requirement: RN-16 Chain-data reads name their view and height

THE system SHALL answer every module API request from finalized data only: each request's read SHALL report its view
(`finalized`), the committed height it read and that block's hash, and IF no height has committed yet THEN the read
SHALL fail with `no-committed-height`, which a handler that does not catch it answers with HTTP 503. A module SHALL
decide what its answers and its subscriptions' notifications carry: THE system SHALL NOT change a module's answer,
except that on every HTTP answer on `listen.api`, the subscription upgrade response included, it SHALL set the header
`X-Umbra-Version` to the build's version (owner decision Q131) and the header `X-Umbra-Config-Hash` to the process's
**configuration hash**: a hash of its configuration without secrets (its data fields; `design.md` §8 gives the exact
input), computed once at startup and kept in memory, so it changes only when the process restarts with another
configuration (PP-14, owner decision Q147). The `X-Umbra-` prefix SHALL hold the headers shared by every module: the
core owns `X-Umbra-Version` and `X-Umbra-Config-Hash`, replacing a module's own header of either name, and SHALL provide
helpers a module may use to state the view, height and hash it read — the `X-Umbra-View`, `X-Umbra-Height` and
`X-Umbra-Hash` headers on HTTP, or the `extensions` object of a GraphQL response — so its bodies stay compatible with
existing clients (owner decisions Q104, Q105).

#### Scenario: A GraphQL module states its height
- **WHEN** a module answers a GraphQL query at committed height 120 through the extensions helper
- **THEN** the response's `extensions` hold view `finalized`, height 120 and that block's hash, and the body's `data` is
  unchanged

#### Scenario: The core leaves an answer as the module wrote it
- **WHEN** a module answers `{ "data": … }` without the helpers
- **THEN** the response's body and headers are the module's own, with `X-Umbra-Version` and `X-Umbra-Config-Hash`
  added

#### Scenario: Every answer names its build
- **WHEN** a build of version 0.10.0 answers any request on `listen.api`, a module's own `X-Umbra-Version: 9` included
- **THEN** the response carries `X-Umbra-Version: 0.10.0` once and its body is the module's

#### Scenario: The configuration hash holds no secret
- **WHEN** two processes run with configurations that differ only in the password of their `database` URL
- **THEN** their answers carry the same `X-Umbra-Config-Hash`, and no header holds the password

### Requirement: RN-17 A slow block is reported, never cut off

WHEN a height's processing — from its first callback after `on-finalized` to its commit — has run longer than
`slowBlockMs` (CF-4), THE runner SHALL raise the condition `slow-block` (AE-3) with the height, the point it is in and,
while a callback runs, the module; it SHALL clear the condition when that height commits or processing halts. THE
runner SHALL time alike, each as a window of its own, the callbacks it awaits outside that window — `on-after-db-write`
and `on-stop-height` after each commit (one window, from the commit to the end of `on-stop-height`), each
`on-finalized`, and RN-11's re-delivery at a restart —: each SHALL raise the same `slow-block` condition, naming the
height (which may have committed; for an `on-finalized`, the head it announces, owner decision Q162), the point and
the module, and clear it when its window ends (owner decision Q145).
THE runner SHALL NOT cancel or retry a height or a callback for being slow (Q71).

#### Scenario: A slow callback
- **WHEN** a test module's `on-compute` awaits 3 s with `slowBlockMs` 1000
- **THEN** `/status` shows `slow-block` with the height, `on-compute` and the module after about 1 s, the height
  commits, and the condition is gone after the commit

#### Scenario: A slow callback after the commit
- **WHEN** a test module's `on-after-db-write` at h awaits 3 s with `slowBlockMs` 1000
- **THEN** `/status` shows `slow-block` with h, `on-after-db-write` and the module after about 1 s, and the condition
  is gone once that callback ends
