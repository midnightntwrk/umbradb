# Spec delta — `runner` capability

Modifies `core-arch`'s `specs/runner/spec.md` (`start-umbradb` `design.md` §0: `core-arch` is archived first). Each
requirement is restated in full; the change is the library entry of `start-umbradb` (`specs/library-mode/spec.md`).

## MODIFIED Requirements

### Requirement: RN-13 SIGTERM stops cleanly

WHEN the process receives SIGTERM (`umbradb run`), or its host calls `stop()` or aborts its `signal` (`startUmbraDB`),
THE runner SHALL enter `stopping`, start no new height, let a block whose transaction is open commit or roll back, and
then exit (`umbradb run`) or resolve `closed` (a library process). During startup it SHALL stop before startup's next
step and end any wait for the node at once, an unreachable node's retries included.

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

### Requirement: RN-15 Module APIs are registered once, at startup

WHEN `on-start-api` runs, THE runner SHALL collect every handler registered through `ApiRegistry` and serve the HTTP
handlers and the subscriptions (WebSocket) through the module API's handlers — on the module API listener (`listen.api`)
WHERE one listens, and through the handlers a library host mounts (`api.http`, `api.upgrade`, LM-4); IF two modules
register the same method and path, or the same subscription name, THEN startup SHALL refuse and name both modules. Each
request SHALL get a read handle at the latest committed height; a subscription SHALL be notified from the module's
`on-after-db-write` through `emit`.

#### Scenario: Two modules claim one path
- **WHEN** modules `a` and `b` both register `GET /api/v4/graphql`
- **THEN** startup refuses with `duplicate-api-route`, the route, `a` and `b`

### Requirement: RN-16 Chain-data reads name their view and height

THE system SHALL answer every module API request from finalized data only: each request's read SHALL report its view
(`finalized`), the committed height it read and that block's hash, and IF no height has committed yet THEN the read
SHALL fail with `no-committed-height`, which a handler that does not catch it answers with HTTP 503. A module SHALL
decide what its answers and its subscriptions' notifications carry: THE system SHALL NOT change a module's answer,
except that on every HTTP answer the module API writes — on `listen.api` and from mounted handlers (LM-4) —, the
subscription upgrade response included, it SHALL set the header `X-Umbra-Version` to the build's version (owner decision
Q131) and, once the hash exists (after `on-start-db`; before, the header SHALL be absent, a wildcard for a client
comparing hashes, owner decision D-17), the header `X-Umbra-Config-Hash` to the process's **configuration hash**: a hash
of its configuration without secrets (its data fields; `core-arch` `design.md` §8 gives the exact input), computed once
at startup and kept in memory, so it changes only when the process restarts with another configuration (PP-14, owner
decision Q147). The `X-Umbra-` prefix SHALL hold the headers shared by every module: the core owns `X-Umbra-Version` and
`X-Umbra-Config-Hash`, replacing a module's own header of either name, and SHALL provide helpers a module may use to
state the view, height and hash it read — the `X-Umbra-View`, `X-Umbra-Height` and `X-Umbra-Hash` headers on HTTP, or
the `extensions` object of a GraphQL response — so its bodies stay compatible with existing clients (owner decisions
Q104, Q105).

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
