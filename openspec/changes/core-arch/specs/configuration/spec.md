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
non-integer number) — THEN startup SHALL refuse and name the path inside the configuration. Only the evaluated data, not
the source text, SHALL be validated, compared with the history, recorded and shown. The file MAY also export `modules`,
the declarations of the host's user modules (`export const modules = [stats]`), which it imports like any other import;
`umbradb run` and `umbradb config check` SHALL take the build's user modules from it, next to UmbraDB's own backbone
parts and core modules, so a configuration that lists user modules is checked and run by the command (owner decision
Q106). No module is loaded by name: the file is then MD-1's host program.

#### Scenario: A user module from the configuration file
- **WHEN** `umbradb.config.ts` imports module `stats`, exports `modules = [stats]` and lists `stats.entry({ … })`
- **THEN** `umbradb config check` checks the entry against `stats`'s schema, and `umbradb run` runs `stats`

#### Scenario: A function in the configuration
- **WHEN** a module's `config` contains `{ onError: () => 0 }`
- **THEN** startup refuses with `not-plain-data` at `entries[1].config.onError`

### Requirement: CF-2 Builders fill identity and version from the build

THE system SHALL export `coreEntry({ start, stop?, config })`, which fills `id: "core"` and the core version from the
build (`{ umbradb: <package version>, ledgers: [{ ledger, versionName, packages: [{ name, version, sha256 }] }] }`,
one item per ledger version the build carries, LG-5); SHALL give every module package an
`entry({ start, stop?, config })` builder that fills `id` and `version` from the imported declaration and types
`config` with the module's settings schema; and SHALL export `versionEntry({ id, start, stop?, version, config? })` for
a revision whose version this build does not carry — an earlier one already in the history, or a later one being
scheduled. Builders SHALL return plain data.

#### Scenario: A misspelled setting is a type error
- **WHEN** an operator writes `coreEntry({ start: 0, config: { databse: "…" } })`
- **THEN** `tsc --noEmit` on the configuration file reports the unknown property, and startup refuses it as well

### Requirement: CF-3 Every entry is validated at startup

THE process SHALL validate each entry's shape at startup: `{ id, start, stop?, version, config }`, where `config` is
required except for a scheduled `versionEntry` (below), which has no `config`; no unknown property; `stop ≥ start`. THE
process SHALL validate the `config` of every revision whose version is the build's against the module's zod schema in
this build, apply its declared defaults to absent fields, and classify its fields by the schema's kinds. A revision
whose version is not the build's (written with `versionEntry`) SHALL NOT be validated against this build's schema. IF it
starts at or below the cursor THEN its `config` SHALL equal, field for field, the data recorded for it, which is its
only source of field kinds. IF it starts above the cursor THEN it is a scheduled revision: only its id, start, stop and
version SHALL be recorded (its `config` is omitted, and SHALL be refused if given — so no secret or operational field of
a version this build cannot classify is ever stored), and the build carrying its version SHALL supply and record its
configuration, validated against that version's schema, before processing its start (CF-6 allows it, since the revision
still starts above the cursor). Any violation SHALL refuse startup, naming the entry and the field. Byte values SHALL be
`0x`-prefixed lowercase hex strings.

#### Scenario: A wrong type
- **WHEN** `livenessTimeoutMs` is the string `"30000"`
- **THEN** startup refuses with the entry `core`, the field and the expected type

#### Scenario: An upgrade that renames a setting
- **WHEN** module `m` 1.0.0 recorded `{ foo: 1 }` from height 1, and the build carries 1.1.0, whose schema has `bar`
  instead of `foo`, with a revision from 50 written as `m.entry({ start: 50, config: { bar: 1 } })` and the old one as
  `versionEntry({ id: "m", start: 1, version: "1.0.0", config: { foo: 1 } })`
- **THEN** startup validates only the 1.1.0 revision against the schema, checks the 1.0.0 one against the history, and
  accepts both

#### Scenario: Scheduling a newer version from the current build
- **WHEN** a build carrying `m` 1.0.0 runs at cursor 20 and the operator adds
  `versionEntry({ id: "m", start: 50, version: "1.1.0" })`
- **THEN** startup records `(m, 50, 1.1.0)` without configuration; the process stops at 49 with `upgrade-required`
  (RN-12); the 1.1.0 build's file writes that revision with `m.entry({ start: 50, config: … })`, which is validated,
  recorded and run from 50

### Requirement: CF-4 Every field is data, operational or secret

THE system SHALL treat every settings field by its declared kind: `data` fields can change stored data and SHALL be
recorded in the history; `operational` fields cannot and SHALL NOT be recorded; `secret` fields are operational and
SHALL never be shown, logged or reported (`[redacted]`). An entry's `start` and `version` SHALL be data, and so SHALL a
module entry's `stop`; the `core` entry's `stop` SHALL be operational (it stops the process, not stored data). The
`core` entry's fields are:

| Field | Kind | Type and default |
|---|---|---|
| `network` | data | `mainnet`, `preprod`, `preview`, `stagenet`, or `custom` (then `genesisHash`, hex, is required) |
| `ledgerTable` | data | `{ rows, pins }` (LG-1, LG-2); default: the built-in table for the network |
| `ledgerSources` | data | per ledger version, `vendored` or `released`; default `vendored` |
| `sweep` | data | `on` or `off`; default `on` (`off` only under the development opt-in) |
| `retainStates` | data | integer ≥ 0; default 0 (LG-12) |
| `database` | secret | a PostgreSQL URL, `pglite:<directory>` (created if missing, Q163) or `pglite:memory` |
| `node` | secret | the node's WebSocket URL (core process only) |
| `listen` | operational | `{ api?, admin?, transport? }` addresses; admin default `0.0.0.0:8081` |
| `tipCap`, `prefetchWindow` | operational | integers; 600, 64 |
| `backoffCeilingMs` | operational | integer; 30000 |
| `lockstepInstances` | operational | instance ids; default none |
| `backupAtStop` | operational | a file path; default absent (BK-1) |
| `backupOnSignal` | operational | a file path; default absent (SIGUSR2 writes a backup there, BK-1, Q152) |
| `tls` | secret | certificates and trusted roots for opt-in mutual TLS (PP-11); default absent |
| `livenessTimeoutMs` | operational | integer; 30000 |
| `apiReadTimeoutMs` | operational | integer; 30000 (DB-15) |
| `slowBlockMs` | operational | integer; 60000 (RN-17) |
| `followingThreshold` | operational | integer; 3 |
| `readinessLag` | operational | integer; absent |
| `fullPageWritesOffAllowed` | operational | boolean; false (the durability-probe override, DB-12) |
| `developmentOptIn` | operational | boolean; false |

A private process's `core` entry has, instead of `node` and `lockstepInstances`: `instanceId` (operational, string),
`publicDatabase` (secret) and `coreTransport` (operational, address). The core handles no keys: keys, and private items
in general, are a module's (owner decision Q154).

A process SHALL take every operational and secret field of the `core` entry from the latest `core` revision whose
version is the build's (by start), for its whole run; the operational and secret fields of the other `core` revisions
SHALL be validated (CF-3) but not used. The data fields of each `core` revision apply from its start, like any entry's
(owner decision Q102).

A process, and a restore into its target, SHALL create a `pglite:<directory>` that does not exist together with any
missing parent directory; the read-only uses — `umbradb config check --database` and `umbradb backup` — SHALL create
none (owner decision Q163).

#### Scenario: Two `core` revisions with different databases
- **WHEN** the file holds `core` revisions from 0 (`database: A`, `node: N1`) and from 9,000 (`database: B`, `node: N2`,
  `developmentOptIn: true`), both of the build's version, and the cursor is 5,000
- **THEN** the process opens `B`, reads from `N2` and has the development opt-in from startup to exit

#### Scenario: A PGlite directory whose parent is missing
- **WHEN** `database` is `pglite:data/preview` under the opt-in and `data/` does not exist
- **THEN** `umbradb run` creates `data/` and `data/preview` and starts, while `umbradb config check --database
  pglite:data/preview` and `umbradb backup` against it create no directory

#### Scenario: A secret never appears
- **WHEN** `/config` is read and the logs are collected for a process whose `database` URL contains a password
- **THEN** the URL appears only as `[redacted]`

### Requirement: CF-5 Entries are revised by `(id, start)`

THE system SHALL identify an entry by `(id, start)`. WHEN a later entry has the same id, THE system SHALL treat the
earlier one as stopping at the later one's start − 1 and the module as continuing without a mid-chain start. IF the
configuration omits an entry recorded in the history that starts at or below the cursor THEN startup SHALL refuse and
name it. A recorded entry that starts above the cursor has affected no stored data: the configuration MAY omit it or
move it to another start, and its history row SHALL then be deleted in the transaction that records the configuration
(owner decision Q103).

#### Scenario: A recorded entry is missing
- **WHEN** the history holds `(m, 1)` and `(m, 50)`, the cursor is at or above 50, and the file lists only `(m, 1)`
- **THEN** startup refuses with `missing-entry` and `(m, 50)`

#### Scenario: A scheduled entry is moved
- **WHEN** the history holds `(m, 50)`, the cursor is 20, and the file lists `(m, 100)` in its place
- **THEN** startup accepts it, and `(m, 50)` is deleted and `(m, 100)` recorded in one transaction

### Requirement: CF-6 Configuration changes only the future

WHEN a process starts with a cursor c, THE `core-chain` part SHALL compare the file with `core_chain.config` and SHALL
refuse startup IF an entry starting at or below c differs in any data field or in its version, except a module
entry's `stop` that is above c in both the recorded and the new value. Entries starting above c MAY differ from what is
recorded for them, and SHALL be accepted and recorded (replacing their earlier record) in the same transaction as the
comparison. Operational changes — the `core` entry's `stop` among them, which
may be raised, lowered above c, or removed at any restart — SHALL be accepted with no change to the history.

#### Scenario: Changing the past
- **WHEN** an entry starting at 10 changes a data field and the cursor is 20
- **THEN** startup refuses with `changes-past`, the entry and the field

#### Scenario: Raising the core's stop after stopping
- **WHEN** the core stopped at its `stop` 10 (cursor 10) and restarts with `stop` 20
- **THEN** startup accepts it, `core_chain.config` is unchanged, and processing continues to 20

#### Scenario: Adding a future revision
- **WHEN** a revision starting at cursor + 10 is added
- **THEN** startup accepts it and `core_chain.config` gains its row with its `data_hash`

### Requirement: CF-7 The history row and its hash

THE `core-chain` part SHALL store, per entry, a row of `core_chain.config` keyed by `(entry_id, start)` with `stop`
(null when absent, and always null for the `core` entry, whose stop is operational), `version` (the module's semver, or
the canonical JSON of the core version), `data` (the data fields as canonical JSON) and `data_hash` = SHA-256 of the
canonical encoding (`determinism` capability) of the data fields.

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

THE system SHALL run development-only features — development-only modules (such as `core-contract-logs-fast`), the
PGlite backend, `sweep: off` and backups of a private database — only when the `core` entry sets `developmentOptIn:
true`; otherwise startup SHALL refuse and name the feature.

#### Scenario: PGlite without the opt-in
- **WHEN** `database` is `pglite:memory` and `developmentOptIn` is false
- **THEN** startup refuses and names PGlite and the opt-in

### Requirement: CF-10 `umbradb config check`

THE package SHALL provide the command `umbradb config check <file> [--database <url>]`, which type-checks the file with
the TypeScript compiler (`noEmit`), evaluates it, and runs CF-1 and the schema checks of CF-3 for the revisions whose
version is the build's, without starting a process. WITHOUT `--database` it SHALL open no database and SHALL report that
the history checks (CF-3 for `versionEntry` revisions, CF-5, CF-6, CF-8) were not run; WITH `--database` it SHALL read
the history read-only — no migration, no write — and run them too. It SHALL check the entries of the file's exported
user modules (CF-1, Q106) as it checks UmbraDB's own. It SHALL exit 0 only if every check it ran passes, and SHALL print
each finding with its path.

#### Scenario: A file with a type error and a schema error
- **WHEN** `umbradb config check` runs on a file with one unknown property and one wrong type
- **THEN** it prints both findings with their paths and exits non-zero

#### Scenario: Checking against a database
- **WHEN** `umbradb config check --database <url>` runs on a file that changes a recorded entry's data field
- **THEN** it reports `changes-past` and exits non-zero, and the database is unchanged

<!-- CF-11 withdrawn by owner decision Q154 (keys are a module's, not the core's) -->
