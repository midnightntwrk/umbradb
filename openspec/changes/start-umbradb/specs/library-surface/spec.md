# Spec delta — `library-surface` capability

Modifies `core-arch`'s `specs/library-surface/spec.md` (`start-umbradb` `design.md` §0: `core-arch` is archived first).
Each requirement is restated in full; the change is the library entry of `start-umbradb` (`specs/library-mode/spec.md`).

## MODIFIED Requirements

### Requirement: LS-1 The package exports exactly the new surface

THE package SHALL export from `"."` exactly the values and types listed in `core-arch` `design.md` §12 as amended by
`start-umbradb` `core-arch` `design.md` §4, and nothing else; a test SHALL pin the sorted list of value exports and the
list of type exports, and `package.json` SHALL expose only `"."` and the `umbradb` command.

#### Scenario: An extra export
- **WHEN** a source file adds an export to `src/index.ts` that is not in the list
- **THEN** the surface test fails and names the export
