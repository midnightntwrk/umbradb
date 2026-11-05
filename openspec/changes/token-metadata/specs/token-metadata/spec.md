# Spec — `token-metadata` capability

## Purpose

The `token-metadata` module reads MIP-0018 `TokenMetadata` events from the contract logs of finalized blocks, from
whatever height it starts at, stores them as per-block facts, and serves each token identity's current fields, color,
symbol groups and history over the module API, stating which heights its answers cover.

Requirements are written in EARS, as in `core-arch`'s `specs/runner/spec.md`. Every requirement has an id;
`acceptance.md` maps each id to the criteria that verify it. **The MIP** is MIP-0018 at commit `338ea19`
(`https://github.com/midnightntwrk/midnight-improvement-proposals/blob/338ea19/mips/mip-0018-on-chain-token-metadata.md`);
a quoted section name ("Payload", "Applying records") is that section of it.

Terms: the **event name** is the 32 bytes `pad(32, "mip-0018:token-metadata[v1]")`
(`6d69702d303031383a746f6b656e2d6d657461646174615b76315d` followed by 5 zero bytes); a **candidate** is a contract
log whose event type is `Misc` and whose name is the event name (TM-3); an **identity** is `(contractAddress,
domainSep, kind)` on the database's network; a **field** is an identity and a key; a **record**, a **tombstone**,
`domainSep`, `kind`, **color** and the **common keys** (`name`, `symbol`, `decimals`, `standards`, `image`,
`image_sha256`) are the MIP's. **Chain order** is height, then the log's transaction and log index in the block
(`contract-logs`, `core-arch` CC-2), then the record's position in its payload. The **coverage** at height h is the set
of heights at or below h that the module's configuration entries covered (TM-9). The **state** of an identity at h is
the result of applying, in chain order, the records of accepted candidates at heights in the coverage at h (TM-10);
the identity **exists** at h while its state has at least one field.

## ADDED Requirements

### Requirement: TM-1 An opt-in public module that can start at any height

WHERE a configuration has an entry for `token-metadata`, THE system SHALL run it as a public module that requires the
item `contract-logs` and no other, declares `startsMidChain: true` (MD-4), and writes only to its own schema
`token_metadata` (DB-6). WHILE a block's ledger version has no contract logs (ledger v8, `core-arch` Q54), THE module
SHALL store nothing for that block.

#### Scenario: Started at the head with the fast log provider
- **WHEN** a new database starts `core-contract-logs-fast` (development opt-in set) and `token-metadata` at a height
  above 0
- **THEN** startup accepts both, and the module's tables exist in the schema `token_metadata`

#### Scenario: Added to a database synced from 0
- **WHEN** a database synced from 0 with `core-ledger-state` and `core-contract-logs-full` adds `token-metadata` with a
  start above its cursor
- **THEN** startup accepts it

#### Scenario: A v8 block
- **WHEN** a v8 block is processed with `token-metadata` enabled
- **THEN** none of the module's tables gets a row for that block

### Requirement: TM-2 Stored rows are facts of each block's own logs

THE module SHALL store, for each block, only rows computed from that block's `contract-logs` item and the constants of
this spec, never from earlier blocks or its own earlier rows, so that started at any height h it writes for every height
≥ h exactly the rows a run from the database's first height writes (the promise of MD-4).

#### Scenario: Two start heights
- **WHEN** one database runs the module from height 0 and another from height h > 0 over the same chain
- **THEN** their module rows at every height ≥ h are byte-identical

### Requirement: TM-3 Candidates are found by event type and exact name

THE module SHALL treat as a candidate only a `Misc` log, of any log version, whose logged value is one byte string of
at most 288 bytes and whose first 32 bytes, after zero-extending the value to 288 bytes, equal the event name. It SHALL
ignore every other log, storing nothing for it, including `Misc` logs with any other name such as
`mip-0018:token-metadata[v2]`, and `Misc` logs whose value is longer than 288 bytes or not one byte string.

#### Scenario: Another version's name
- **WHEN** a contract emits a `Misc` log named `pad(32, "mip-0018:token-metadata[v2]")` with a valid v1 payload
- **THEN** the module stores nothing for it, and no identity changes

#### Scenario: A log of another type
- **WHEN** a contract emits a `ShieldedMint` log
- **THEN** the module stores nothing for it

#### Scenario: Trailing zeros dropped by the source
- **WHEN** a candidate's logged value is shorter than 288 bytes because its trailing zero bytes were dropped
- **THEN** the module reads it as the 288 bytes with those zeros restored ("Consuming"), and decodes the same as the
  full-length value

### Requirement: TM-4 An unknown serialization fails the block

IF a `Misc` log's data is not in a serialization this build knows (its tag is not the tagged state-value serialization
the vendored v9 packages write), THEN THE module SHALL fail the block with `callback-error` naming the height, the
transaction, the log and the tag, rather than ignore the log.

#### Scenario: A new tag
- **WHEN** a `Misc` log's data carries a tag other than the known one
- **THEN** processing halts at that height with `callback-error`, and nothing of the block is stored (RN-8)

### Requirement: TM-5 A payload is accepted whole or rejected whole

WHEN a candidate is found THE module SHALL take bytes 32–287 of its zero-extended value as the payload and check it as
"Payload" says: `kind` is 1, 2 or 3; records are read from byte 33 until byte 256 or a zero `keyLen`, after which every
byte is zero; every record fits within the 256 bytes and its key and value follow TM-6; at least one record is read. IF
any check fails THEN THE module SHALL reject the whole event.

#### Scenario: A header with no records (R1)
- **WHEN** a candidate's payload has a valid header and bytes 33–255 all zero
- **THEN** the event is rejected and no field changes

#### Scenario: A valid record followed by an invalid one (R6)
- **WHEN** a payload holds a valid `name` record followed by a record with `valType` 6
- **THEN** the event is rejected and `name` is not set

#### Scenario: A record past byte 256 (R2)
- **WHEN** a record has a 1-byte key and a 220-byte value
- **THEN** the event is rejected

#### Scenario: Non-zero bytes after the end (R3)
- **WHEN** a zero `keyLen` follows a valid record and a later byte is non-zero
- **THEN** the event is rejected

### Requirement: TM-6 Keys and values follow the MIP's rules

THE module SHALL require every key to be strict UTF-8, and check each value by its `valType` ("Value types"): 0 bytes;
1 strict UTF-8; 2 an unsigned little-endian integer of 1–31 bytes; 3 one complete UTF-8 JSON value; 4 an absolute
ASCII URI (RFC 3986, scheme required, fragment allowed); 5 Null with `valLen` 0; 6–255 reserved. A key or value that
breaks its rule SHALL reject the event. Empty strings, empty bytes and JSON `null` are values.

#### Scenario: Integer widths (A4)
- **WHEN** `decimals` is sent once as `06` and once as `06` followed by 15 zero bytes
- **THEN** both are accepted and both read as 6

#### Scenario: Invalid keys and values (R5)
- **WHEN** a payload carries invalid UTF-8 in a key or in a type-1, -3 or -4 value, invalid JSON, a relative URI, a 0-
  or 32-byte integer, or a Null record with `valLen` greater than 0
- **THEN** the event is rejected

#### Scenario: Values that are not tombstones (A5)
- **WHEN** records carry an empty string, empty bytes and JSON `null`
- **THEN** the event is accepted and each field holds its value

#### Scenario: Exact bytes (A3)
- **WHEN** records use the keys `symbol` and `symbol` followed by `0x00`, and a type-0 value `01 00 00`
- **THEN** the two keys are two fields, and the value keeps its trailing zeros

#### Scenario: Image (A6)
- **WHEN** one event carries `image = "https://example.org/acme.png"` (type 4) and a 32-byte `image_sha256` (type 0)
- **THEN** the event is accepted and both fields are set

### Requirement: TM-7 Records belong to the emitting contract, and colors are computed

THE module SHALL bind every record of an accepted event to the identity whose `contractAddress` is the address the log
record names, never a payload value, and whose `domainSep` and `kind` are the payload's header. FOR kinds 1 and 2 THE
module SHALL compute the color as `tokenType(domainSep, contractAddress)`; it SHALL compute none for kind 3 and never
take one from a payload.

#### Scenario: Separate identities (S6)
- **WHEN** the same records are emitted under kinds 1, 2 and 3 by one contract, and the same payload by a second contract
- **THEN** four identities exist, updating one leaves the other three unchanged, and kind 3 has no color

#### Scenario: The color formula
- **WHEN** a contract `c` describes kind 1 under `domainSep` `d`
- **THEN** the identity's color equals what the vendored ledger packages' `rawTokenType(d, c)` returns

### Requirement: TM-8 Every candidate's outcome is stored

THE module SHALL store, for every candidate, its chain position (height, transaction index, log index), its contract
address, its payload and its outcome: accepted, or rejected with a reason and the payload offset where the check failed.
Rejecting one event SHALL NOT affect any other event, in the same transaction or elsewhere.

#### Scenario: Independent events (S7)
- **WHEN** one transaction emits a malformed candidate and a valid one
- **THEN** the first is stored rejected with its reason, and the second is accepted and applied

### Requirement: TM-9 Every answer states its coverage

THE module SHALL include in every answer and notification the coverage at the height it read, as height ranges, and
whether it is complete: starting at height 0 with no gap. An incomplete answer SHALL be one whose state may lack
events before or between its ranges (the MIP's "Completeness": indexers MAY index only part of the chain).

#### Scenario: Started at the head
- **WHEN** the module started at height 1,000,000 and the answer reads height 1,000,500
- **THEN** the answer's coverage is 1,000,000–1,000,500, marked incomplete

#### Scenario: Synced from genesis
- **WHEN** the module ran from height 0 without a stop and the answer reads height h
- **THEN** the coverage is 0–h, marked complete

### Requirement: TM-10 State is the latest value per field, in chain order

THE module SHALL answer an identity's state as the result of applying its accepted records in chain order over the
coverage: a non-Null record sets its field, replacing any earlier value, and an event changes only the fields it
carries.

#### Scenario: Order within an event (S1)
- **WHEN** one kind-1 event carries `name = "A"`, a tombstone at `name` and `name = "B"`
- **THEN** the identity's only field is `name = "B"`

#### Scenario: Latest value wins (S2)
- **WHEN** `name = "Alpha"`, `symbol = "ALP"`, `decimals = 2` and `standards = "mip-0004"` are sent as four events, and
  in another identity as one event, and a later event carries only `name = "Beta"`
- **THEN** both identities have the same fields after the four, and after the later event only `name` changed

### Requirement: TM-11 A tombstone deletes its field, and an emptied identity vanishes

WHEN applying a tombstone THE module SHALL delete its field with no fallback to any earlier value; a tombstone for a
field with no value SHALL change nothing. WHILE an identity does not exist THE module SHALL reference it nowhere — in
lookups, listings, groups or history — and once a later record describes it again, only that record's fields and later
ones SHALL be shown.

#### Scenario: Tombstones (S3)
- **WHEN** kinds 1 and 3 under one `domainSep` get `name`, `symbol`, `decimals` and `standards`; then kind 1 gets a
  tombstone at `name`, a second tombstone at `name` and one at `retire`; then tombstones for its other three keys in one
  event; then `name = "New"`
- **THEN** after the first tombstone kind 1 has no `name` and the next two change nothing; after the three it exists
  nowhere; after `name = "New"` it has only `name`, its `standards` read as empty and no earlier value returns; kind 3
  is unchanged throughout

### Requirement: TM-12 A color resolves to an identity by the kind held

WHEN a client looks up a color with kind 1 or 2 THE module SHALL answer the existing identity of that kind whose
computed color it is, or not found.

#### Scenario: A held shielded coin
- **WHEN** a contract described kind 1 under `domainSep` `d`, and a client looks up `rawTokenType(d, contract)` with
  kind 1
- **THEN** the answer is that identity and its fields

#### Scenario: The other kind
- **WHEN** the same color is looked up with kind 2 and the contract described no kind 2 under `d`
- **THEN** the answer is not found

### Requirement: TM-13 Only defined keys are served

THE module SHALL serve a field only if its key is a common key or is defined by a standard the identity's current
usable `standards` value lists; no standard defines further keys in this change. Every applied field SHALL stay stored,
so that a later `standards` value changes what is served.

#### Scenario: Served keys (S10)
- **WHEN** an identity has a type-1 field `foo = "x"`
- **THEN** the event was accepted and its record stored, and no answer of the module includes `foo`

### Requirement: TM-14 Unusable fields show no value

WHEN serving a common key whose current value lacks the form of "Common fields" THE module SHALL serve it as unusable,
with no value and no fallback: `name`, `symbol` not non-empty type 1; `decimals` not type 2; `standards` not type 1 of
space-separated identifiers without bytes `0x00`–`0x20` or `0x7f`; `image` not type 4; `image_sha256` not 32-byte
type 0. An empty `standards` is usable and claims none. No default `decimals` SHALL be assumed.

#### Scenario: Unusable fields (S5)
- **WHEN** after usable values an identity gets an empty `name`, a type-1 `decimals` of `"6"`, and `standards =
  "mip-0004  mip-0011"` (two spaces)
- **THEN** each event is accepted, each field is served as unusable, and none shows its earlier value

#### Scenario: An image hash of the wrong length (S12)
- **WHEN** `image_sha256` is a 31-byte value
- **THEN** it is served as unusable

### Requirement: TM-15 Long names and symbols are truncated when served

WHEN serving a usable `name` or `symbol` longer than 64 or 12 characters respectively, counted as grapheme clusters
(Unicode Standard Annex #29), THE module SHALL serve its first 64 or 12 characters. Stored values SHALL NOT be
truncated.

#### Scenario: Truncation (S11)
- **WHEN** an identity has a 70-character `name` and a 15-character `symbol`
- **THEN** the module serves the first 64 characters of the name and the first 12 of the symbol, and its rows hold both
  values whole

### Requirement: TM-16 Identities are grouped by symbol within one contract

THE module SHALL group the existing identities of one contract whose usable `symbol` values are equal as exact bytes.
An identity with no usable `symbol` SHALL belong to no group, and a group SHALL never span contracts.

#### Scenario: Symbol grouping (S9)
- **WHEN** kinds 1 and 3 of contract C under one `domainSep`, and an identity of C under another `domainSep`, have
  `symbol = "ACME"`, while another contract's identity, and identities of C with `acme`, ` ACME`, a type-0 `ACME`,
  the key `SYMBOL` or no `symbol`, exist too
- **THEN** C's group `ACME` has exactly the first three members, and changing or deleting one member's `symbol` changes
  only that member's membership

### Requirement: TM-17 Replaced values are served as marked history

WHERE a client asks for an identity's history, THE module SHALL serve each replaced value of its served fields, marked
as not current, with the chain position that set it and the one that replaced it, over the coverage. A tombstone SHALL
hide every earlier value of its field, and no value from before the identity last stopped existing SHALL be shown.

#### Scenario: A rename
- **WHEN** an identity's `name` is set to `"ACME"` and later to `"SCAM"`
- **THEN** its history shows `"ACME"` as replaced at the position of `"SCAM"`, and its current `name` is `"SCAM"`

#### Scenario: History after a tombstone
- **WHEN** `name` is set to `"A"`, then deleted, then set to `"B"`
- **THEN** the history of `name` shows no value from before the tombstone

### Requirement: TM-18 The module's routes answer from finalized data

WHERE `listen.api` is set, THE module SHALL answer over HTTP a lookup by color and kind, a contract's identities of one
kind, one identity, a contract's symbol groups, and one identity's history, each naming the view, height and hash it
read (RN-16), every list in bounded pages. An identity that does not exist SHALL be answered as not found, the same as
one never described.

#### Scenario: A withdrawn identity
- **WHEN** a client asks for an identity whose every field was deleted
- **THEN** the answer is not found, exactly as for an identity never described

#### Scenario: Before the first commit
- **WHEN** a client asks before any height has committed
- **THEN** the answer is HTTP 503 (`no-committed-height`)

#### Scenario: A large integer
- **WHEN** a field holds a 31-byte unsigned integer
- **THEN** it is served as its exact decimal digits in a string

### Requirement: TM-19 Changed identities are notified after commit

WHERE a client subscribes to identity changes, THE module SHALL send it, after each block that stored accepted records
commits, the identities those records name, with the block's height and hash and the coverage, built from the committed
rows of that height. A message can be sent again after a restart (RN-11); it SHALL then be the same.

#### Scenario: A block with two identities
- **WHEN** a block's accepted records name two identities
- **THEN** a subscriber receives one message naming both, with that block's height and hash

#### Scenario: After a restart
- **WHEN** the process restarts at cursor c, whose block stored accepted records
- **THEN** a subscriber may receive c's message again, naming the same identities with the same height and hash

### Requirement: TM-20 Stored rows are a pure function of the chain

THE module's tables SHALL be deterministic module tables (DT-1 … DT-6): two databases that processed the same heights
with the same configuration SHALL hold byte-identical module rows. Rules whose outcome may depend on the platform's
Unicode data (TM-15) SHALL apply only when serving, never to what is stored or to whether an event is accepted.

#### Scenario: Two backends
- **WHEN** the same blocks are processed on PostgreSQL and on PGlite
- **THEN** the module's tables have equal contents hashes and equal per-block digests

### Requirement: TM-21 Payload bytes and served values are untrusted

THE module SHALL bounds-check every length before reading the bytes it covers, SHALL NOT fail a block on any payload
content (a bad payload is a rejected event, TM-5), and SHALL NOT fetch any URI a value holds, nor run or load anything a
value names; it SHALL serve values as data, and its documentation SHALL tell clients they are untrusted.

#### Scenario: A hostile payload
- **WHEN** a candidate's payload is any 256 bytes
- **THEN** the block commits, and the candidate is stored accepted or rejected

#### Scenario: A script URI
- **WHEN** an identity's `image` is `javascript:alert(1)`, a valid absolute URI
- **THEN** the module makes no request, and serves the URI as stored
