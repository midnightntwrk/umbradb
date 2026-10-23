# Spec delta — `browser` capability

EARS forms and terms as in `specs/runner/spec.md`. The **browser build** is a static page that runs the core and its
modules in the browser, for showing the product and testing modules; it is a development setup.

## ADDED Requirements

### Requirement: BR-1 Workers and databases in the browser

THE browser build SHALL run the core in a dedicated Web Worker with PGlite, the ledger work in its own worker, and each
private instance in its own worker with its own PGlite; storage SHALL be in memory by default and in OPFS optionally;
one worker SHALL own each database, through a Web Locks lock named after the database. THE build SHALL always set the
development opt-in.

#### Scenario: A second tab
- **WHEN** the same page with OPFS storage opens in a second tab
- **THEN** the second tab's core refuses with `writer-lock-held` while the first holds the lock

### Requirement: BR-2 The browser starts at the tip

WHEN the browser build creates a database, S SHALL default to the node's finalized head at that moment, recorded as S;
a module that cannot start mid-chain SHALL be refused unless the database was restored from a snapshot the user
supplied.

#### Scenario: Ledger state without a snapshot
- **WHEN** `core-ledger-state` is enabled in the browser without a snapshot and S > 0
- **THEN** startup refuses and names the module

### Requirement: BR-3 Only the node and a user's snapshot

THE browser build SHALL reach only the configured node — which must allow the page's origin (CORS) — and a snapshot
file the user picks; the admin endpoints SHALL be calls on the core worker's message channel.

#### Scenario: Importing a snapshot in the page
- **WHEN** the user picks a snapshot file in the page
- **THEN** the core imports it with every check of SN-3 and continues from its height + 1

### Requirement: BR-4 Same results as Node.js

THE browser build SHALL produce the same public data as Node.js on PGlite for the same chain and configuration.

#### Scenario: Browser and Node.js agree
- **WHEN** the same tape and configuration run in Chrome and in Node.js on PGlite to height h
- **THEN** their contents hashes are equal
