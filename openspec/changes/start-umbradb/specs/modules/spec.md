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
