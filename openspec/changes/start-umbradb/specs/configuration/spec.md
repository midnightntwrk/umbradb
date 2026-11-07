# Spec delta — `configuration` capability

Modifies `core-arch`'s `specs/configuration/spec.md` (`start-umbradb` `design.md` §0: `core-arch` is archived first).
Each requirement is restated in full; the change is the library entry of `start-umbradb` (`specs/library-mode/spec.md`).

## MODIFIED Requirements

### Requirement: CF-1 The configuration is a TypeScript file evaluated to plain data

`umbradb run` SHALL load one configuration file at startup — `umbradb.config.ts` in the working directory by default, or
the path given with `--config` — through Node.js's built-in type stripping, and SHALL take its default export, built
with `defineConfig({ entries: [ … ] })`. IF the evaluated export contains anything other than plain data — objects,
arrays, strings, booleans, `null` and integers from 0 to 2^53 − 1 (a function, class instance, `undefined`, bigint or
non-integer number) — THEN startup SHALL refuse and name the path inside the configuration. Only the evaluated data, not
the source text, SHALL be validated, compared with the history, recorded and shown. The file MAY also export `modules`,
the declarations of the host's user modules (`export const modules = [stats]`), which it imports like any other import;
`umbradb run` and `umbradb config check` SHALL take the build's user modules from it, next to UmbraDB's own backbone
parts and core modules, so a configuration that lists user modules is checked and run by the command (owner decision
Q106). No module is loaded by name: the file is then MD-1's host program.

A library process (`startUmbraDB`) SHALL load only `config.file` (a path or a file URL, resolved against `cwd`), or take
`config.data`, which SHALL pass the same plain-data check; it SHALL look for no default file. With `config.data` its
user modules are `modules` or `modulesFrom` (LM-7).

#### Scenario: A user module from the configuration file
- **WHEN** `umbradb.config.ts` imports module `stats`, exports `modules = [stats]` and lists `stats.entry({ … })`
- **THEN** `umbradb config check` checks the entry against `stats`'s schema, and `umbradb run` runs `stats`

#### Scenario: A function in the configuration
- **WHEN** a module's `config` contains `{ onError: () => 0 }`
- **THEN** startup refuses with `not-plain-data` at `entries[1].config.onError`

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
| `database` | operational; its `password` secret | the database's parts, never a connection string (Q167) |
| `node` | secret | the node's WebSocket URL (core process only) |
| `listen` | operational | `{ api?, admin?, privateLink? }` addresses (`privateLink` renamed from `transport`); admin default `0.0.0.0:8081` for `umbradb run` |
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
`publicDatabase` (the same parts as `database`, its `password` secret) and `privateLink` (operational, address; renamed
from `coreTransport`). The core handles no keys: keys, and private items in general, are a module's (owner decision
Q154).

A process SHALL take every operational and secret field of the `core` entry from the latest `core` revision whose
version is the build's (by start), for its whole run; the operational and secret fields of the other `core` revisions
SHALL be validated (CF-3) but not used. The data fields of each `core` revision apply from its start, like any entry's
(owner decision Q102).

`database` SHALL be given as parts, and a connection string SHALL be refused (owner decision Q167): `{ kind: "postgres",
host, port, user, password, name, ssl }` (`port` default 5432; `ssl` one of `disable`, `require` and `verify-full`;
`password` may be absent), `{ kind: "pglite", path }` or `{ kind: "pglite", memory: true }`. `ssl` SHALL default to
`require`, except for a loopback host (`localhost`, `127.0.0.1`, `::1`) or a Unix socket directory (a `host` starting
with `/`), where it SHALL default to `disable` (owner decision Q182); `verify-full` SHALL check the server's certificate
and host name against Node.js's built-in trust roots, with no setting for another authority (owner decision Q183). Only
`password` SHALL be secret; the other parts are operational and SHALL be shown in `/config` and the log.

WHERE the public process's `database` is PostgreSQL and `listen.privateLink` is set — or, in a library process, its
network request gives the public side of the link (LM-3) —, `core.transportReader` (`{ user, password }`, the other
parts `database`'s; `password` secret, `user` operational) SHALL be required, and the core SHALL run the transport's
reads (PP-4) on a pool of its own logged in as that user; startup SHALL refuse with `transport-reader-can-write`, naming
what it found, IF that login is a superuser, holds `CREATEROLE`, `CREATEDB` or `BYPASSRLS`, is a member of `database`'s
login, or holds any privilege other than `SELECT` (and `USAGE` on schemas) on a public schema or table (owner decision
Q175). On PGlite the setting SHALL be refused, since there is one session.

A process, and a restore into its target, SHALL create a PGlite `path` that does not exist together with any missing
parent directory, and SHALL log that it created it, naming the path (owner decisions Q163, Q165); the read-only uses —
`umbradb config check --database` and `umbradb backup` — SHALL create none.

IF an entry uses a renamed key — `listen.transport` or `coreTransport` — THEN startup SHALL refuse with
`invalid-configuration` and a finding `renamed-setting` naming the new key (`listen.privateLink`, `privateLink`). A
process SHALL take the addresses it listens and connects at from its network plan (LM-3); for `umbradb run` they are the
written addresses, and a `listen.privateLink` written on a private process is ignored.

#### Scenario: Two `core` revisions with different databases
- **WHEN** the file holds `core` revisions from 0 (`database: A`, `node: N1`) and from 9,000 (`database: B`, `node: N2`,
  `developmentOptIn: true`), both of the build's version, and the cursor is 5,000
- **THEN** the process opens `B`, reads from `N2` and has the development opt-in from startup to exit

#### Scenario: A PGlite directory whose parent is missing
- **WHEN** `database` is `{ kind: "pglite", path: "data/preview" }` under the opt-in and `data/` does not exist
- **THEN** `umbradb run` creates `data/` and `data/preview`, logs that it created `data/preview`, and starts, while
  `umbradb config check --database` and `umbradb backup` on that file create no directory

#### Scenario: A secret never appears
- **WHEN** `/config` is read and the logs are collected for a process whose `database` has a `password`
- **THEN** the password appears only as `[redacted]`, while its host, port, user, name and `ssl` are shown
