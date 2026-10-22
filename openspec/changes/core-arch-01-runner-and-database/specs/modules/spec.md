# Spec delta — `modules` capability

EARS forms and terms as in `specs/runner/spec.md`. A **data item** is a named piece of data a module provides and
others require, with one or more lifetimes: `process` (set once per process), `block` (valid while one block is
processed, passed in its block context), `table` (stored in the provider's tables; marked `append-only` or `mutable`).

## ADDED Requirements

### Requirement: MD-1 A module is a declaration the host imports

THE system SHALL define a module as a TypeScript package exporting a `ModuleDeclaration` with: `id`, `version`
(semver), `side` (`public` or `private`), `requires` (item names), `provides` (items with lifetimes and, for `table`
items, schema, tables and kind), `startsMidChain`, optional `needsLockstep`, `developmentOnly`, `digest` and
`keyKinds` / `validateKey`, `configSchema` (a zod 4 object schema whose every property carries the metadata
`kind: "data" | "operational" | "secret"`), `migrations` (`{ id, sql }`, cumulative) and `points` (callbacks by point
name). THE host program SHALL import the modules it ships; THE system SHALL NOT load a module by name at run time.

#### Scenario: A declaration with an unknown point name
- **WHEN** a module declares a callback under `on-fetched`
- **THEN** the TypeScript compiler rejects it, and startup validation refuses it if it was built without types

### Requirement: MD-2 Declarations are validated at startup

IF a declaration has an id used by another module, a user module's id starts with `core-` or `on-`, the declaration
requires no item, an item is provided without a lifetime, a `table` item has no kind, or a property of `configSchema`
has no `kind`, THEN startup SHALL refuse and name the module and the cause.

#### Scenario: A user module named like a core module
- **WHEN** the host ships a user module with id `core-x`
- **THEN** startup refuses with `reserved-prefix` and the id

### Requirement: MD-3 The requirement graph is resolved per height range

WHEN a process starts, THE runner SHALL resolve the requirement graph separately for each height range between entry
boundaries (every start and stop of every revision), and IF in some range a required item has no enabled provider, two
enabled providers of one item overlap, the graph has a cycle, or a module's [start, stop] is not covered by the
availability of every item it requires (an item is available from its provider's start to its provider's stop) THEN
startup SHALL refuse, naming the range, the module and the item.

#### Scenario: A consumer starts before its provider
- **WHEN** `consumer` starts at 10 and its provider starts at 20
- **THEN** startup refuses with `item-not-available`, the range 10–19, `consumer` and the item

#### Scenario: A cycle
- **WHEN** module `a` requires `b`'s item and `b` requires `a`'s item
- **THEN** startup refuses with `graph-cycle` naming both modules

### Requirement: MD-4 Modules start mid-chain only when they promise it

THE system SHALL let a module start above S (the database's start height) only if it and every provider it requires
declare `startsMidChain: true`, or the database was restored from a snapshot holding its data (project 6); otherwise
startup SHALL refuse and name the module. A module declaring `startsMidChain: true` promises that, started at any height
h with its providers available from h, it writes for every height ≥ h exactly the rows a run from S would write.

#### Scenario: A module that needs history from S
- **WHEN** a module with `startsMidChain: false` is added with a start above S on a database not restored from a
  snapshot
- **THEN** startup refuses with `cannot-start-mid-chain` and the module

### Requirement: MD-5 Development-only modules need the development opt-in

IF a module with `developmentOnly: true` is enabled and the core entry does not set the development opt-in THEN startup
SHALL refuse and name the module.

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
