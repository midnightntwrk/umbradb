# Spec — `token-metadata` capability

## Purpose

The `token-metadata` module ports the metadata core of the MIP-0018 token indexer proof of concept (acedward/umbradb
PR #26 at `760d3e9`, the **proof of concept**) onto UmbraDB's module system: it reads MIP-0018 `TokenMetadata` events
from the contract logs of finalized blocks, keeps each token identity's current metadata, and serves the proof of
concept's read-only `/v1` JSON API for it.

Requirements are written in EARS, as in `core-arch`'s `specs/runner/spec.md`. Every requirement has an id;
`acceptance.md` maps each id to the criteria that verify it. **The MIP** is MIP-0018 at commit `338ea19` (file SHA-256
`8d4204e7…7f17245`, the same text as `eb94bc1`, the merge of MIP PR #372 that the proof of concept pins); a quoted
section name ("Payload", "Applying records") is that section of it. **The API contract** is the proof of concept's
`token-indexer/API.md` at `760d3e9`.

Terms: the **event name** is the 32 bytes `pad(32, "mip-0018:token-metadata[v1]")`; a **candidate** is a contract log
whose event type is `Misc` and whose name is the event name (TM-2); an **unresolved site** is the `contract-logs` item's
record of a log the provider could not read (`fast-logs-unresolved` CC-5); an **identity** is `(contractAddress,
domainSep, kind)` on the database's network; a **field** is an identity and a key; a **record**, a **tombstone**,
`domainSep`, `kind`, **color** and the **common keys** are the MIP's. A key is **defined** for an identity when it is a
common key or a key of a standard the identity's current usable `standards` lists (none in this change). An identity
**exists** while one of its defined keys has a value. **Chain order** is height, then transaction index and log index
in the block, then the record's position in its payload.

## ADDED Requirements

### Requirement: TM-1 An opt-in module that starts with its database

WHERE a configuration has an entry for `token-metadata`, THE system SHALL run it as a public module that requires
`contract-logs` and `block-parsed` (each event's transaction hash), writes only to its own schema `token_metadata` (DB-6), and declares `startsMidChain: true` (MD-4). IF
its first revision starts above the database's first height S THEN startup SHALL refuse with `callback-error` at
`on-start-db` of `token-metadata`, whose cause has the code `token-metadata-start-after-database`. WHILE a block's ledger has no contract logs (v8) it SHALL store nothing.

#### Scenario: A new database at the tip
- **WHEN** a new database starts at S = 1,000,000 with `core-contract-logs-fast` and `token-metadata` from S
- **THEN** startup accepts both

#### Scenario: Added later
- **WHEN** a database with S = 0 and cursor 500,000 adds `token-metadata` from 500,001
- **THEN** startup refuses with `callback-error` at `on-start-db` of `token-metadata`, caused by
  `token-metadata-start-after-database`

### Requirement: TM-2 Candidates are found by event type and exact name

THE module SHALL treat as a candidate only a `Misc` log, of any log version, whose logged value is one byte string of
at most 288 bytes whose first 32 bytes, after zero-extending it to 288 bytes, equal the event name; it SHALL ignore every
other log, including `Misc` logs of any other name (`[v2]` included), and store nothing for them.

#### Scenario: Another version's name
- **WHEN** a contract emits a `Misc` log named `pad(32, "mip-0018:token-metadata[v2]")` with a valid v1 payload
- **THEN** the module stores nothing for it

#### Scenario: Trailing zeros dropped
- **WHEN** a candidate's value is shorter than 288 bytes because its trailing zeros were dropped
- **THEN** it decodes as the 288 bytes with those zeros restored

### Requirement: TM-3 An unknown serialization fails the block

IF a `Misc` log's data is not in a serialization this build knows (its tag is not the tagged state-value serialization
the vendored v9 packages write), THEN THE module SHALL fail the block with `callback-error` naming the height, the
transaction, the log and the tag.

#### Scenario: A new tag
- **WHEN** a `Misc` log's data carries a tag other than the known one
- **THEN** processing halts at that height, and nothing of the block is stored (RN-8)

### Requirement: TM-4 A candidate is accepted or rejected whole

WHEN a candidate is found THE module SHALL classify its 256-byte payload as "Payload" and "Value types" say, with every
key strict UTF-8: accepted, or rejected with one reason; a rejected event SHALL apply none of its records and SHALL NOT
affect any other event.

#### Scenario: A valid record followed by an invalid one (R6)
- **WHEN** a payload holds a valid `name` record followed by a record with `valType` 6
- **THEN** the event is rejected with reason `reserved-valtype` and `name` is not set

#### Scenario: A non-UTF-8 key (R5)
- **WHEN** a payload's only record has the key `ff 6b 65 79`
- **THEN** the event is rejected

#### Scenario: Independent events (S7)
- **WHEN** one transaction emits a malformed candidate and a valid one
- **THEN** the first is rejected and the second applies

### Requirement: TM-5 Every candidate and unresolved site is stored with its classification

THE module SHALL store each candidate and each unresolved site of the block with its position (height, transaction
index, log index), its contract, and its classification: `accept`, `reject` with its reason, or `unresolved` with the
provider's reason. An unresolved site SHALL never be applied.

#### Scenario: An unresolved site
- **WHEN** the block's `contract-logs` item holds an unresolved site of contract C with reason `not-a-literal`
- **THEN** an `unresolved` event of C is stored with that reason, and no field of C changes

### Requirement: TM-6 Records belong to the emitting contract

THE module SHALL bind every record of an accepted event to the identity whose `contractAddress` is the address the log
record names, never a payload value, and whose `domainSep` and `kind` are the payload's header; FOR kinds 1 and 2 the
identity's color SHALL be computed as `tokenType(domainSep, contractAddress)`, never taken from a payload.

#### Scenario: Separate identities (S6)
- **WHEN** the same records are emitted under kinds 1, 2 and 3 by one contract, and the same payload by a second contract
- **THEN** four identities exist, updating one leaves the others unchanged, and kind 3 has no color

### Requirement: TM-7 The latest value per field, in chain order

THE module SHALL apply accepted records in chain order: a non-Null record sets its field's value, replacing any
earlier one, and a tombstone deletes its field (a tombstone for a field with no value changes nothing), with no
fallback to an earlier value. Every applied field SHALL be kept, defined or not.

#### Scenario: Order within an event (S1)
- **WHEN** one kind-1 event carries `name = "A"`, a tombstone at `name` and `name = "B"`
- **THEN** the identity's only field is `name = "B"`

#### Scenario: Latest value wins (S2)
- **WHEN** four events set `name`, `symbol`, `decimals` and `standards`, and a later event sets only `name = "Beta"`
- **THEN** only `name` changes, and its earlier value is never served

### Requirement: TM-8 An identity without a defined field is not referenced

WHILE an identity has no defined field with a value THE module SHALL reference it nowhere — listings, lookups,
groups, events of the identity, the contract view — and IF it is described again THEN it SHALL show only fields set
after its last withdrawal.

#### Scenario: Withdrawal and revival (S3)
- **WHEN** kinds 1 and 3 under one `domainSep` get the four common keys; then kind 1 gets tombstones for all four; then
  kind 1 gets `name = "New"`
- **THEN** after the tombstones kind 1 answers 404 everywhere; after `name = "New"` it has only `name`, its `standards`
  read as empty; kind 3 is unchanged throughout

#### Scenario: Only undefined keys
- **WHEN** an identity's only field is `foo = "x"`
- **THEN** it is referenced nowhere, and the event that set it was accepted

### Requirement: TM-9 Only defined keys and usable common fields are served

THE module SHALL serve only defined keys; for a common key whose value lacks the form of "Common fields" it SHALL mark
the field unusable and serve no common value, with no fallback and no default `decimals`; it SHALL serve `name` and
`symbol` as their first 64 and 12 grapheme clusters (UAX #29) while storing them whole.

#### Scenario: Unusable fields (S5, S12)
- **WHEN** after usable values an identity gets an empty `name`, a type-1 `decimals` of `"6"`, `standards` with two
  spaces, and a 31-byte `image_sha256`
- **THEN** each is served unusable, `common` shows `null` for each, and no earlier value appears

#### Scenario: Truncation (S11)
- **WHEN** an identity has a 70-character `name` and a 15-character `symbol`
- **THEN** every answer shows the first 64 and 12 characters, and the stored values are whole

### Requirement: TM-10 Symbol groups have two or more members of one contract

THE module SHALL group the existing identities of one contract whose usable `symbol` values are equal as exact bytes,
serving a group only when it has two or more members, and never across contracts.

#### Scenario: Symbol grouping (S9)
- **WHEN** kinds 1 and 3 of contract C under one `domainSep`, and an identity of C under another `domainSep`, have
  `symbol = "ACME"`, while identities with `acme`, ` ACME`, a type-0 `ACME`, the key `SYMBOL`, no `symbol`, or another
  contract exist too
- **THEN** C's group `ACME` has exactly the first three members

### Requirement: TM-11 Every identity carries one mark

THE module SHALL give each identity the proof of concept's mark (`state.ts` `tokenMark`): `incorrect` when its contract
has a rejected event, else `unresolved` when its contract has an unresolved site, else `partial` when `name`, `symbol` or
`decimals` is missing or unusable, else `ok`; `none` for an identity without fields.

#### Scenario: A contract with an unresolved site
- **WHEN** contract C's identity has usable `name`, `symbol` and `decimals`, and C has an unresolved site
- **THEN** its mark is `unresolved` with reason `unresolved-log` and the site's position

### Requirement: TM-12 The proof of concept's metadata API, from finalized data

WHERE `listen.api` is set, THE module SHALL answer the API contract's `GET /v1/status`, `/v1/tokens`,
`/v1/tokens/{color}`, `/v1/identities/{contract}/{domainSep}/{kind}`, `/v1/contracts/{address}/tokens`,
`/v1/lookup/{color}?held=` and `/v1/events` with its paths, parameters, JSON shapes, errors, pagination, bounded cost
and hostile-text rules, from one committed height (RN-16), except as TM-13 says.

#### Scenario: A recorded answer
- **WHEN** the requests whose answers were recorded from the proof of concept are sent after the same blocks
- **THEN** each answer's body equals the recorded one, except for the fields TM-13 names

#### Scenario: A withdrawn identity
- **WHEN** a client asks for an identity whose defined fields were all deleted, never minted
- **THEN** the answer is 404 `NOT_FOUND`, as for one never described

### Requirement: TM-13 What the first port serves differently

THE module SHALL serve, until the changes that add them: `minted`, `firstSeen` as `null` and `evidence` as `[]`; no
`seen` rows; NIGHT and DUST as the contract's built-in rows; `image` with status `pending` and no `imageUrl`;
`/v1/lookup` resolving the held kind's existing identity by its computed color, else `not-minted-in-indexed-range`;
`/v1/events` with `segment` and `phase` `null`; `/v1/status` from the process's own heights.

#### Scenario: Lookup of a described token
- **WHEN** contract C described kind 1 under `d`, and a client looks up `tokenType(d, C)` with `held=shielded`
- **THEN** `result` is `identity` and `identity` is that identity

### Requirement: TM-14 Stored rows are a pure function of the chain

THE module's tables SHALL be deterministic module tables (DT-1 … DT-6): two databases with the same S and
configuration that processed the same heights SHALL hold byte-identical module rows; anything that depends on the
platform's Unicode data (TM-9's truncation) SHALL apply only when serving.

#### Scenario: Two backends
- **WHEN** the same blocks are processed on PostgreSQL and on PGlite
- **THEN** the module's tables have equal contents hashes and per-block digests

### Requirement: TM-15 Payload bytes and served values are untrusted

THE module SHALL bounds-check every length before reading the bytes it covers, SHALL NOT fail a block on any payload
content (a bad payload is a rejected event), and SHALL NOT fetch any URI a value holds; served text SHALL follow the API
contract's hostile-text rule.

#### Scenario: A hostile payload
- **WHEN** a candidate's payload is any 256 bytes
- **THEN** the block commits, and the candidate is stored accepted or rejected

### Requirement: TM-16 It runs in the browser build

WHERE a browser configuration lists the module with `core-contract-logs-fast`, THE browser build SHALL run it from the
page's start height and answer its API from the page's worker.

#### Scenario: From the tip
- **WHEN** a page starts on a new database at the node's finalized head with the module listed
- **THEN** after a block with an accepted candidate the identity route answers that identity
