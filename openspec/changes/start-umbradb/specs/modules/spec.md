# Spec delta — `modules` capability

Modifies `core-arch`'s `specs/modules/spec.md` (`start-umbradb` `design.md` §0: `core-arch` is archived first). Each
requirement is restated in full; the change is the library entry of `start-umbradb` (`specs/library-mode/spec.md`).

## MODIFIED Requirements

### Requirement: MD-1 A module is a declaration the host imports

THE system SHALL define a module as a TypeScript package exporting a `ModuleDeclaration` with: `id`, `version` (semver),
`side` (`public` or `private`), `requires` (item names), `provides` (items with lifetimes and, for `table` items,
schema, tables, kind and an optional `deterministic: false` that opts those tables out of the determinism rules — DT-3,
DT-4, DT-6, owner decision Q76), `startsMidChain`, optional `needsLockstep` and `developmentOnly`, `configSchema` (a zod
4 object schema whose every property carries the metadata `kind: "data" | "operational" | "secret"`), `migrations` (`{
id, sql }`, cumulative), optional `ledgerTasks` (LG-17), optional `requiresResync` (DB-10) and `points` (callbacks by
point name). Ids and item names SHALL match the pattern of DB-8. THE host program SHALL give the modules it ships: for
the `umbradb` command, the configuration file, which exports its user modules (CF-1, owner decision Q106) and which the
main thread and the ledger worker both import; for a library host, the configuration file's `modules` export, `modules`
objects, or `modulesFrom`, a module URL both threads import (LM-7), in place of a host-provided ledger worker entry; THE
system SHALL NOT load a module by name at run time.

#### Scenario: A declaration with an unknown point name
- **WHEN** a module declares a callback under `on-fetched`
- **THEN** the TypeScript compiler rejects it, and startup validation refuses it if it was built without types

### Requirement: MD-7 Process items are published once, at startup

THE system SHALL let the provider of an item with a `process` lifetime publish it once, from its `on-start-db` callback,
through `ProcessContext.publish(item, value)`; the value SHALL be visible in `ProcessContext.items` to every callback of
a module requiring it from `on-start-api` on, for the whole process. IF an item is published twice, published from any
other point, or published by a module that does not declare it, THEN that callback SHALL fail; IF a required `process`
item has not been published when every `on-start-db` callback has run, THEN startup SHALL refuse and name the item —
except the item `node-client` WHERE the host gives an in-memory `source` (LM-8): the engine then makes no node client,
so `node-client` SHALL NOT be published and startup SHALL NOT refuse for it, and a module that requires it finds none in
its `ProcessContext.items`.

#### Scenario: A required process item is never published
- **WHEN** module `consumer` requires the process item `client` and its provider's `on-start-db` does not publish it
- **THEN** startup refuses with `process-item-missing` and the item

#### Scenario: `node-client` with an in-memory source
- **WHEN** a host starts a public process with an in-memory `source`, and a module requires `node-client`, as
  `core-block-fetch` always does
- **THEN** startup goes on and the chain is processed, and the module finds no `node-client` in its items
