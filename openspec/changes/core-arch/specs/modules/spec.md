# Spec delta — `modules` capability

EARS forms and terms as in `specs/runner/spec.md`. A **data item** is a named piece of data a module provides and
others require, with one or more lifetimes: `process` (set once per process), `block` (valid while one block is
processed, passed in its block context), `table` (stored in the provider's tables; marked `append-only` or `mutable`).

## ADDED Requirements

### Requirement: MD-1 A module is a declaration the host imports

THE system SHALL define a module as a TypeScript package exporting a `ModuleDeclaration` with: `id`, `version` (semver),
`side` (`public` or `private`), `requires` (item names), `provides` (items with lifetimes and, for `table` items,
schema, tables, kind and an optional `deterministic: false` that opts those tables out of the determinism rules — DT-3,
DT-4, DT-6, owner decision Q76), `startsMidChain`, optional `needsLockstep`, `developmentOnly` and `keyKinds`
/ `validateKey`, `configSchema` (a zod 4 object schema whose every property carries the metadata `kind: "data" |
"operational" | "secret"`), `migrations` (`{ id, sql }`, cumulative), optional `ledgerTasks` (LG-17), optional
`requiresResync` (DB-10) and `points` (callbacks by point name). Ids and item names SHALL match the pattern of DB-8. THE
host program SHALL import the modules it ships, on the main thread and in the ledger worker's entry (`design.md` §5.5);
THE system SHALL NOT load a module by name at run time.

#### Scenario: A declaration with an unknown point name
- **WHEN** a module declares a callback under `on-fetched`
- **THEN** the TypeScript compiler rejects it, and startup validation refuses it if it was built without types

### Requirement: MD-2 Declarations are validated at startup

IF a declaration has an id used by another module, an id or item name that does not match the pattern of DB-8, a user
module's id that is `core` (the `core` entry's id, CF-2) or starts with `core-` or `on-`, a schema name that collides as
DB-8 describes, no required item, an item provided without a lifetime, a `table` item without a kind, or a field of
`configSchema` without a `kind`, THEN startup SHALL refuse and name the module and the cause.

#### Scenario: A user module named like a core module
- **WHEN** the host ships a user module with id `core-x`
- **THEN** startup refuses with `reserved-prefix` and the id

### Requirement: MD-3 The requirement graph is resolved per height range

WHEN a process starts, THE runner SHALL resolve the requirement graph separately for each height range between entry
boundaries (every start and stop of every revision), and IF in some range a required item has no enabled provider, two
enabled providers of one item overlap, the graph has a cycle, or a module's [start, stop] is not covered by the
availability of every item it requires (an item is available from its provider's start to its provider's stop) THEN
startup SHALL refuse, naming the range, the module and the item. Startup SHALL check every range that holds a height
above the cursor (on a new database, every range from S) and, in a range that ends at the cursor, only that its graph
has no cycle, since RN-11 re-delivers the cursor's callbacks in RN-3's order; a fault that only ranges ending at or
below the cursor have was judged by the builds that processed them, as a build carries one version of each module (Q43,
Q97), except a cycle of the union of every range's requirements, past ranges included, which RN-3 refuses because it
orders every part's migrations and `on-start-db` at startup (Q95, Q99).

#### Scenario: A consumer starts before its provider
- **WHEN** `consumer` starts at 10 and its provider starts at 20
- **THEN** startup refuses with `item-not-available`, the range 10–19, `consumer` and the item

#### Scenario: A cycle
- **WHEN** module `a` requires `b`'s item and `b` requires `a`'s item
- **THEN** startup refuses with `graph-cycle` naming both modules

#### Scenario: An upgrade adds a requirement
- **WHEN** module `m` ran from 500 without requiring `tx-results`, the cursor is 9,999, and a build whose `m` requires
  `tx-results`, provided from 10,000, runs `m`'s new revision from 10,000
- **THEN** startup accepts: the range 500–9,999 ends at the cursor and is checked for a cycle only

### Requirement: MD-4 Modules start mid-chain only when they promise it

THE system SHALL let a module start at a height h above 0 (genesis) — a mid-chain start, a start at an S above 0
included (Q96) — only if it declares `startsMidChain: true` and so does every provider it requires that is not active at
h − 1 (a provider active at h − 1, with h − 1 ≥ S, has run without a gap and holds its data from h on; Q98); otherwise
startup SHALL refuse with `cannot-start-mid-chain` and name the module and, for a provider, the provider and the item.
Startup SHALL check only the starts above the cursor (on a new database, every start): a start at or below the cursor
was judged by the build that processed it, and a database restored from a backup (BK-3) carries the backup's cursor
(Q97). A module declaring `startsMidChain: true` promises that, started at any height h with its providers available
from h, it writes for every height ≥ h exactly the rows a run from S would write.

#### Scenario: A module that needs history from S
- **WHEN** a module with `startsMidChain: false` is added with a start above S on a database not restored from a
  backup
- **THEN** startup refuses with `cannot-start-mid-chain` and the module

#### Scenario: A module that needs history, at an S above genesis
- **WHEN** a new database has S = 2,000,000 and enables a module with `startsMidChain: false` from S
- **THEN** startup refuses with `cannot-start-mid-chain` and the module

#### Scenario: A late module on a provider that has run all along
- **WHEN** a database synced from 0 runs a provider with `startsMidChain: false`, and a module with
  `startsMidChain: true` that requires the provider's item starts at 3,000,000, above the cursor
- **THEN** startup accepts the module

### Requirement: MD-5 Development-only modules need the development opt-in

IF a module with `developmentOnly: true` is enabled at the cursor or above (on a new database, at any height) and the
core entry does not set the development opt-in THEN startup SHALL refuse and name the module; one whose entries all end
below the cursor is not refused (Q97).

#### Scenario: A development-only module in production
- **WHEN** a configuration enables a development-only test module without `developmentOptIn`
- **THEN** startup refuses and names the module and the opt-in

### Requirement: MD-6 Shared items have exactly one active provider per height

WHERE several modules provide one item (a shared item), THE runner SHALL accept them only when their entry ranges do
not overlap, so that at each height at most one provider is active; one provider MAY stop at a height and another start
at the next.

#### Scenario: Provider handoff
- **WHEN** provider `p1` of shared item `x` stops at 99 and provider `p2` starts at 100, with identical migrations
- **THEN** startup accepts it, `p1` writes `x`'s schema up to 99 and `p2` from 100, and a consumer of `x` sees one
  continuous table

### Requirement: MD-7 Process items are published once, at startup

THE system SHALL let the provider of an item with a `process` lifetime publish it once, from its `on-start-db` callback,
through `ProcessContext.publish(item, value)`; the value SHALL be visible in `ProcessContext.items` to every callback of
a module requiring it from `on-start-api` on, for the whole process. IF an item is published twice, published from any
other point, or published by a module that does not declare it, THEN that callback SHALL fail; IF a required `process`
item has not been published when every `on-start-db` callback has run, THEN startup SHALL refuse and name the item.

#### Scenario: A required process item is never published
- **WHEN** module `consumer` requires the process item `client` and its provider's `on-start-db` does not publish it
- **THEN** startup refuses with `process-item-missing` and the item
