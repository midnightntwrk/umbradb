# Spec delta — `configuration` capability

EARS forms and terms as in `specs/runner/spec.md`. The **configuration** of a process is one flat list of entries,
one per revision of the core or of a module; S is the database's start height (the first `core` entry's start). The
**configuration history** is every entry's data fields with its start, stop and version, stored in
`core_chain.config`.

## ADDED Requirements

### Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data

THE process SHALL load one configuration file at startup — `umbradb.config.ts` in the working directory by default, or
the path given with `--config` — through Node.js's built-in type stripping, and SHALL take its default export, built
with `defineConfig({ entries: [ … ] })`. IF the evaluated export contains anything other than plain data — objects,
arrays, strings, booleans, `null` and integers from 0 to 2^53 − 1 (a function, class instance, `undefined`, bigint or
non-integer number) — THEN startup SHALL refuse and name the path inside the configuration. Only the evaluated data,
not the source text, SHALL be validated, compared with the history, recorded and shown.

#### Scenario: A function in the configuration
- **WHEN** a module's `config` contains `{ onError: () => 0 }`
- **THEN** startup refuses with `not-plain-data` at `entries[1].config.onError`

### Requirement: CF-2 Builders fill identity and version from the build

THE system SHALL export `coreEntry({ start, stop?, config })`, which fills `id: "core"` and the core version from the
build (`{ umbradb: <package version>, ledgers: [] }` in this change); SHALL give every module package an
`entry({ start, stop?, config })` builder that fills `id` and `version` from the imported declaration and types
`config` with the module's settings schema; and SHALL export `pastEntry({ id, start, stop?, version, config })` for a
revision already in the history whose version this build does not carry. Builders SHALL return plain data.

#### Scenario: A misspelled setting is a type error
- **WHEN** an operator writes `coreEntry({ start: 0, config: { databse: "…" } })`
- **THEN** `tsc --noEmit` on the configuration file reports the unknown property, and startup refuses it as well

### Requirement: CF-3 Every entry is validated against its schema at startup

THE process SHALL validate each entry's shape (`{ id, start, stop?, version, config }`, no unknown property, `stop ≥
start`) and each `config` against its module's zod schema at startup, apply declared defaults to absent fields, and
refuse startup on any violation, naming the entry and the field. Byte values SHALL be `0x`-prefixed lowercase hex
strings.

#### Scenario: A wrong type
- **WHEN** `livenessTimeoutMs` is the string `"30000"`
- **THEN** startup refuses with the entry `core`, the field and the expected type

### Requirement: CF-4 Every field is data, operational or secret

THE system SHALL treat every settings field by its declared kind: `data` fields can change stored data and SHALL be
recorded in the history; `operational` fields cannot and SHALL NOT be recorded; `secret` fields are operational and
SHALL never be shown, logged or reported (`[redacted]`). An entry's `start`, `stop` and `version` SHALL be data. In this
change the `core` entry's fields are:

| Field | Kind | Type and default |
|---|---|---|
| `database` | secret | a PostgreSQL URL, `pglite:<directory>` or `pglite:memory` |
| `listen` | operational | `{ api?, admin? }` addresses; admin default `0.0.0.0:8081` |
| `livenessTimeoutMs` | operational | integer; 30000 |
| `followingThreshold` | operational | integer; 3 |
| `readinessLag` | operational | integer; absent |
| `fullPageWritesOffAllowed` | operational | boolean; false (the durability-probe override, DB-11) |
| `developmentOptIn` | operational | boolean; false |

Later projects add fields as new UmbraDB versions; the core's `stop` is the entry's `stop`, and for the core it is
operational.

#### Scenario: A secret never appears
- **WHEN** `/config` is read and the logs are collected for a process whose `database` URL contains a password
- **THEN** the URL appears only as `[redacted]`

### Requirement: CF-5 Entries are revised by `(id, start)`

THE system SHALL identify an entry by `(id, start)`. WHEN a later entry has the same id, THE system SHALL treat the
earlier one as stopping at the later one's start − 1 and the module as continuing without a mid-chain start. IF the
configuration omits an entry recorded in the history THEN startup SHALL refuse and name it.

#### Scenario: A recorded entry is missing
- **WHEN** the history holds `(m, 1)` and `(m, 50)` and the file lists only `(m, 1)`
- **THEN** startup refuses with `missing-entry` and `(m, 50)`

### Requirement: CF-6 Configuration changes only the future

WHEN a process starts with a cursor c, THE `core-chain` part SHALL compare the file with `core_chain.config` and SHALL
refuse startup IF an entry starting at or below c differs in any data field or in its version, except a `stop` that is
above c in both the recorded and the new value. Entries starting above c SHALL be accepted and recorded in the same
transaction as the comparison. Operational changes SHALL be accepted with no change to the history.

#### Scenario: Changing the past
- **WHEN** an entry starting at 10 changes a data field and the cursor is 20
- **THEN** startup refuses with `changes-past`, the entry and the field

#### Scenario: Adding a future revision
- **WHEN** a revision starting at cursor + 10 is added
- **THEN** startup accepts it and `core_chain.config` gains its row with its `data_hash`

### Requirement: CF-7 The history row and its hash

THE `core-chain` part SHALL store, per entry, a row of `core_chain.config` keyed by `(entry_id, start)` with `stop`
(null when absent), `version` (the module's semver, or the canonical JSON of the core version), `data` (the data fields
as canonical JSON) and `data_hash` = SHA-256 of the canonical encoding (`determinism` capability) of the data fields.

#### Scenario: The same entry gives the same hash
- **WHEN** two processes record the same entry, with its fields written in a different order
- **THEN** both rows have the same `data_hash`

### Requirement: CF-8 One version per build

WHEN a process starts, BEFORE any `on-start-db` runs, THE process SHALL compare, for every entry, the version of the
revision covering cursor + 1 (S on an empty database) with the version this build carries, and IF any differs THEN
startup SHALL refuse with `upgrade-required`, naming each entry, the version needed and the build's version, and SHALL
run no migration. Revisions starting above cursor + 1 MAY name versions the build does not carry.

#### Scenario: The new build deployed too early
- **WHEN** a build carrying module `m` 1.1.0 starts on a database whose revision covering cursor + 1 names 1.0.0
- **THEN** startup refuses with `upgrade-required` for `m`, before any migration runs

### Requirement: CF-9 The development opt-in gates development-only features

THE system SHALL run development-only features — development-only modules and the PGlite backend in this change —
only when the `core` entry sets `developmentOptIn: true`; otherwise startup SHALL refuse and name the feature.

#### Scenario: PGlite without the opt-in
- **WHEN** `database` is `pglite:memory` and `developmentOptIn` is false
- **THEN** startup refuses and names PGlite and the opt-in

### Requirement: CF-10 `umbradb config check`

THE package SHALL provide the command `umbradb config check <file>`, which type-checks the file with the TypeScript
compiler (`noEmit`), evaluates it, and runs CF-1 and CF-3 without starting a process or opening a database; it SHALL
exit 0 only if every check passes, and SHALL print each finding with its path.

#### Scenario: A file with a type error and a schema error
- **WHEN** `umbradb config check` runs on a file with one unknown property and one wrong type
- **THEN** it prints both findings with their paths and exits non-zero
