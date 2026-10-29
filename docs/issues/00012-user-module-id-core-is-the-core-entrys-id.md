# 00012 — A user module may be named `core`, the id of the `core` configuration entry

- **Status:** CLOSED — fixed by task 4.1 of `openspec/changes/core-arch` (2026-10-25): declaration validation refuses
  a user module whose id is `core` with `reserved-prefix`, and MD-2 and A21 name the case (see "Resolution").
- **Verified:** COMPLETED — re-checked 2026-10-29 at `258cec6`: the fix is present and has not regressed.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-25, during task 3.2 of `openspec/changes/core-arch` (graph resolution per height range), while
  deciding what the graph does with an entry whose id is `core`.

## Problem

The configuration is one flat list of entries identified by `(id, start)`, where the core's own entries have the id
`core` (CF-2: `coreEntry` "fills `id: "core"`"; CF-4, CF-5, CF-7) and every other entry has a module's id. Declaration
validation (task 3.1) refuses a user module whose id starts with `core-` or `on-` (MD-2, `reserved-prefix`), but not one
whose id *is* `core`: DB-8's pattern allows it, and `core` does not start with `core-`. A host can therefore ship a user
module named `core`, whose entries — `core.entry({ start, config })` from its CF-2 builder — would have the same id as the
core's, so the configuration history (`core_chain.config`, keyed by `(entry_id, start)`), the version check (CF-8), the
revision rule (CF-5) and the requirement graph's input could not tell the module's revisions from the core's.

Checked on the clone at `233d91d`: `validateDeclarations({ backbone: [], core: [], user: [<a valid declaration with id
"core">] })` returns it without a refusal.

## Evidence

- `src/modules/validation.ts:381` — `const PREFIXES = ["core-", "on-"];` and the `reserved-prefix` rule after it, which
  tests `id.startsWith(prefix)`.
- `src/db/roles.ts` — `ID_PATTERN` (`^[a-z][a-z0-9]*(-[a-z0-9]+)*$`) matches `core`.
- `openspec/changes/core-arch/specs/configuration/spec.md` CF-2 (`id: "core"`), CF-5 (entries identified by `(id,
  start)`); `specs/modules/spec.md` MD-2 (only the prefixes are reserved).

## Suggested fix

Refuse a user module whose id is `core` with `reserved-prefix` (its words already explain that `core-` ids are
UmbraDB's own), or name the case in MD-2 ("a user module's id that is `core` or starts with `core-` or `on-`"), with a
row in A21's table. Task 4.1 or 4.3 could also refuse a module entry whose id is `core`, but the declaration is where the
name is chosen. The requirement graph (task 3.2) takes module entries only and throws for an entry whose id no module of
the build has, so with the fix an entry `core` can never reach it as a module's.

## Resolution

Fixed in the declaration, where the name is chosen, as suggested: MD-2's `reserved-prefix` rule
(`src/modules/validation.ts`, `reservedPrefix`) now refuses a user module whose id is `CORE_ENTRY_ID` (`core`,
`src/config/entries.ts`, the id `coreEntry` fills), with `details: { module: "core" }` and a message saying that the
configuration identifies an entry by its id and start (CF-2, CF-5) and could not tell the module's revisions from the
core's. MD-2's text and A21 name the case, and A21's table has its row (`test/modules/validation.test.ts`, "the id core,
the core entry's"); the controls keep `cores`, `corelog`, `online-stats` and `on` as ordinary user ids. Refusing it in
the configuration's entries instead was not possible: an entry `{ id: "core" }` is the core's own, so the entries cannot
tell a module of that name from the core. Backbone parts and core modules are UmbraDB's own and are not checked (none is
named `core`).
