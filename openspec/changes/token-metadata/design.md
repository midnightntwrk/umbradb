# Design — TOKEN-METADATA (`token-metadata`)

## Context

See `proposal.md` (Why) for the motivation and `specs/token-metadata/spec.md` for the requirements (TM-1 … TM-21).
This design builds on `core-arch` without changing it:

- **Contract logs.** The shared item `contract-logs` holds each block's MIP-0002 logs in the ledger's emission order,
  each with its transaction index, log index, the contract address from the log record, the event type, the log version
  and `data`, the logged value in the ledger's tagged serialization (`core-arch` design §10, the `contract_logs.logs`
  row; `src/backbone/contract-logs/contract-logs.ts`). Two providers give it, one at a time (CC-4):
  `core-contract-logs-full`, from the full apply, which needs `core-ledger-state` from height 0 or a restored backup
  (CC-2); and `core-contract-logs-fast`, from the transcripts without state, development-only, startable at any height,
  and halting on a partially successful transaction that logs (CC-3; `fast-log-unsupported`). Both v9 packages (rc.3,
  rc.5) decode logs with the VM's own `decodeLogItem` (`src/ledger/v9.ts:6-58`), which turns a malformed log wrapper
  into a version-0 `Misc` log of the whole value (`test/ledger/vendored-ledger-v9.test.ts:59-70`).
- **Mid-chain starts.** MD-4 accepts a module above the database's first height if it declares `startsMidChain: true`
  and promises that, started at any h with its providers available from h, it writes for every height ≥ h exactly the
  rows a run from the first height would write (`core-arch` `specs/modules/spec.md:63-71`).
- **The browser build** starts every database at S = the node's finalized head, always sets the development opt-in,
  and refuses user modules that declare ledger tasks (`docs/browser.md:44, 91-94, 104`).
- **Tables.** Module tables follow `core-arch` design §10's rules (no floats, `bytea` keys, `bigint` heights, per-block
  tables append-only and range-partitioned by height) and §4's module rules (own schema and role, DB-6; change capture,
  digests and the contents hash, DT-3 … DT-5).

## Goals / Non-Goals

**Goals:**

- Start at any height, in the browser and on a server, with answers that say what they cover (TM-1, TM-9).
- Every stored row a pure function of its own block (TM-2, TM-20); state, usability, truncation and grouping worked out
  when answering.
- No ledger task and no core change: the module is an ordinary user-side module that happens to ship in the package.

**Non-Goals:**

- No materialized current-state table. A table of current fields would depend on the start height and break MD-4's
  promise; it is a possible later optimization behind `deterministic: false` or a backfill.
- No use of the height-versioned table helper (`src/helpers/height-versioned.ts`; `core-arch` design §10, SH-2, SH-3):
  its keys are `text` and it allows one change per key per block, while one MIP event can set, delete and set a field
  again (S1). Its law T5 (`Formal/STORAGE_ALGEBRA.md` §2) therefore does not apply here.
- No pruning or rate limit of candidates (the MIP lets indexers limit what they index; none is set here).

## Decisions

### D1. Where the module lives (proposal Q-3)

`src/features/token-metadata/`, exported from `src/index.ts` as `TOKEN_METADATA` with an `entry(...)` helper like the
core modules', module id `token-metadata` (ids starting `core-` are reserved for core modules, MD-2). It is not added to
`CORE_MODULES` (`src/cli/build-modules.ts`): a configuration lists it in its `modules` export like any user module, and a
browser configuration lists it in `modules` (`docs/browser.md:91`). Having no ledger task, it is never refused with
`ledger-tasks-need-modules-from` (`src/runner/process.ts:1851-1866`).

### D2. Colors are computed, not scanned

`tokenType(domainSep, contractAddress)` is `SHA-256(pad(32, "midnight:derive_token") ‖ domainSep ‖ contractAddress)`:
the reference repository's independent implementation (`packages/midnight/src/color.ts`, `tokenTypeSha256`, at
`e8295792…`), checked on 2026-11-05 to equal `rawTokenType` of the vendored v8, v9-rc3 and v9 packages for the same
input. The module computes it with the SHA-256 the digests use (`node:crypto`, `src/determinism/digest.ts:25`), when it
stores a kind-1 or kind-2 record. The MIP's rule is only that a color is computed this way and never read from a value
("Token identity and authority"). *Alternative:* the MIP's Lookup mechanism, a table of colors from mint effects — it
needs a ledger task (not loadable in the browser), the per-segment outcomes of `core-ledger-state` (height 0 only), and
it misses mints before the start height; rejected. *Consequence:* a color of an identity described but never minted
resolves too; no one can hold such a coin, so no lookup reaches it by mistake.

### D3. Points and data flow

| Point | What runs | Reads | Writes |
|---|---|---|---|
| `on-compute` | read, decode, bind | the block's `contract-logs` item | — (a block-local change set) |
| `on-db-write` | store | — | `candidates` and `records` rows of the block, two statements |
| `on-after-db-write` | notify (TM-19) | the block's `records` rows, read at h | one subscription message if any |

Nothing reads the module's earlier rows while processing a block (TM-2). `on-after-db-write` gets no `block` items and
runs again for the cursor after a restart (RN-5, RN-11), so its message is built from committed rows and is the same
each time.

### D4. Tables (schema `token_metadata`)

One `table` item, kind append-only, holding both tables; both range-partitioned by height like `contract_logs.logs`.

| Table | Primary key | Other columns |
|---|---|---|
| `candidates` | (height, tx_index, log_index) | contract_address (32 bytes), payload (256 bytes, zero-extended), accepted (boolean), reason (text, null iff accepted, one of D6's reasons), reason_offset (int, null iff accepted) |
| `records` | (height, tx_index, log_index, record_index) | contract_address, domain_sep (32 bytes), kind (smallint 1–3), color (32 bytes, null iff kind 3), key (bytea 1–255), val_type (smallint 0–5), value (bytea 0–255) |

`records` holds the records of accepted candidates only. Indexes: `records (contract_address, domain_sep, kind,
height, tx_index, log_index, record_index)` for one identity's replay; `records (color, kind)` for lookups;
`records (contract_address, kind, domain_sep)` for listings and groups. No `jsonb`, so DT-6's numeric checks do not
arise; `CHECK`s bound every length and enumeration.

### D5. Answers are replays

Every answer reads at one height h (RN-16) and computes the state it needs:

- **One identity:** its `records` in chain order over the coverage, applied as TM-10 and TM-11 say. The replay keeps,
  per key, the current value and its replaced values since the key's last tombstone; when the field map becomes empty
  the identity stops existing and everything kept is dropped, so a later record starts from nothing (TM-11, TM-17).
- **By color:** the distinct identities of `records` with that color and kind (one, unless a hash collision), then as
  above.
- **A contract's identities of one kind, its groups:** its distinct `domain_sep` values for that kind (or every kind,
  for groups) in key order, each replayed; pages of identities that exist.
- **Coverage** (TM-9): the ranges `[start, min(stop − 1, h)]` of the module's revisions (`ProcessContext.revisions`,
  `src/modules/declaration.ts:154-155`) that start at or below h, merged; complete when they start at 0 with no gap.
  Coverage comes from the configuration history, not from rows, so it holds for blocks without candidates too.

The read-time rules then apply to the state: served keys (TM-13; the shipped table of standards-defined keys is
empty), usability (TM-14), truncation by grapheme clusters with the running Node's `Intl.Segmenter` (TM-15), grouping
by exact bytes of usable `symbol` values (TM-16).

### D6. The payload decoder (proposal Q-1)

A pure function from 256 bytes to `accept { domainSep, kind, records }` or `reject { reason, offset }`, with no
dependency, written from the MIP's "Payload" and "Value types". Every length is checked against the remaining bytes
before any slice (TM-21). Strict UTF-8 is `TextDecoder("utf-8", { fatal: true, ignoreBOM: true })`; JSON is that text
through `JSON.parse`; the URI rule is a hand-written RFC 3986 `URI` grammar over ASCII. Reasons are a fixed enumeration
(`bad-kind`, `no-records`, `record-overflow`, `nonzero-padding`, `bad-key-utf8`, `reserved-valtype`, `bad-utf8`,
`bad-int-width`, `bad-json`, `bad-uri`, `bad-null`), with a mapping to the reference repository's reason names kept in
the tests. A test-only encoder (the inverse, for well-formed inputs) supports the property tests.
*Alternative:* vendoring `@mip0018/codec` — rejected by Q-1 (it would not make UmbraDB an independent consumer).

### D7. Reading the name and payload from a log's `data` (TM-3, TM-4)

`data` is the ledger's tagged serialization of the logged value (tag `impact-state-value[v2]`,
`test/ledger/vendored-ledger-v9.test.ts:53`). The official indexer takes a `Misc` value as a `StateValue::Cell`
holding exactly one atom of 32–288 bytes and zero-extends it to 288 (`indexer-common/src/domain/ledger/ledger_state.rs:2077-2142`
at `4930c4e`). The module does the same on the main thread with a small reader for exactly that serialized shape, so
the main thread touches no ledger object (`core-arch` design §5.3):

- the known tag, one atom of at most 288 bytes: zero-extended, then checked against the event name (TM-3); an atom
  shorter than 32 bytes is zero-extended like any other (the MIP's "Consuming"; the indexer refuses those, the reference
  codec extends them);
- the known tag, any other shape (several atoms, not a cell, an atom over 288 bytes): not a candidate;
- an unknown tag: `callback-error` (TM-4), so a ledger that changes the serialization stops the module visibly instead of
  emptying it.

The log version is not checked, as the official indexer does not check it (`ledger_state.rs:1847-1854`): a version-0
fallback whose whole value is one atom bearing the event name is a candidate like any other. The reader is checked
differentially against both v9 packages' own `StateValue` deserialization over generated values, and against a real
stagenet `Misc` log (task 1.2).

### D8. Routes and subscription

Under the module's prefix, answering through the envelope helpers (RN-16): `X-Umbra-View`, `X-Umbra-Height`,
`X-Umbra-Hash`. Every body carries `coverage: { ranges: [[from, to], …], complete }`. Lists are paged: `limit`
(default 100, at most 1,000) and an opaque `after` cursor in key order.

| Route | Answer |
|---|---|
| `GET /token-metadata/colors/:color?kind=1\|2` | the identity the color resolves to under that kind, with its served fields; 404 if none |
| `GET /token-metadata/contracts/:address/identities?kind=1\|2\|3` | the contract's existing identities of that kind |
| `GET /token-metadata/identities/:address/:domainSep/:kind` | one identity's served fields and color; 404 if it does not exist |
| `GET /token-metadata/identities/:address/:domainSep/:kind/history` | its replaced values per served key (TM-17) |
| `GET /token-metadata/contracts/:address/groups` | its symbol groups and their members |
| subscription `token-metadata/changes` | after each block with accepted records: height, hash, coverage and the identities named (TM-19) |

A field is `{ key, type, usable, value }`: type 1 as its string, type 2 as decimal digits in a string (up to 31 bytes,
beyond JSON numbers), type 3 as the JSON text as stored (never re-serialized), type 4 as the URI string, type 0 as
lowercase hex; an unusable field has no `value`. Bytes in paths and bodies are lowercase hex without `0x`. A malformed
path or parameter is answered 400.

### D9. Testing (proposal Q-4)

- **Decoder:** the MIP's vectors as table-driven tests; the reference repository's `vectors/` (normative and
  informative), copied with their SHA-256 under `test/fixtures/mip-0018/`, run with a list of the vectors the MIP's text
  at `338ea19` supersedes (they were written for `274a84f`): A3c, a non-UTF-8 key the reference expects accepted, is
  rejected under R5; any other vector with a non-UTF-8 key, found when the vectors are copied (task 1.1), is listed the
  same way. A6 and S10–S12 have no reference vectors; UmbraDB writes its own.
- **The module harness:** `token-metadata` on blocks from `InMemoryBlockSource` with a test-only module providing
  `contract-logs`, on both backends, for the S rules and the routes.
- **Reference runner:** UmbraDB's adapter for the reference `vectors/tools/run.ts` (its runner contract,
  `vectors/README.md`): a fresh database per request and per network; a `rollback` step answered by rebuilding without
  the removed blocks (UmbraDB follows finalized blocks only); the state it reports is the applied state before the
  serving rules, since the reference set predates S10; S8 (amount display) reported not applicable.
- **Stagenet:** a recorded tape over 710,806–724,957 (the reference cases' blocks), replayed with
  `core-contract-logs-fast` and `token-metadata` started at 710,806, in CI; answers compared with each case's
  `expected.json`, recomputed where `338ea19` differs (C07's non-UTF-8 key rejected, non-common keys not served).

## Risks / Trade-offs

- **[Read cost grows with an identity's records.]** Every answer replays records; a contract that emits many events for
  one identity makes its answers slower (the MIP forbids emitting in normal operation, but nothing enforces it). →
  Indexed reads, bounded pages, and a measured case in acceptance; a materialized table is a later option (Non-Goals).
- **[Mid-chain answers are partial.]** A token described before the start height shows nothing until described again.
  → Every answer states its coverage (TM-9); a complete view needs a run from 0 with `core-contract-logs-full`.
- **[The fast log provider is development-only and halts on partial transactions that log.]** A mid-chain start in
  production, or a live demo hit by such a transaction, stops. → Recorded as issue `docs/issues/00085`; not changed here
  (owner decision D-C).
- **[The `Misc` data shape is inferred, not yet seen in UmbraDB.]** → Task 1.2 records a real stagenet `Misc` log's
  `data` and fixes the reader against it before anything is built on it.
- **[JSON validity through `JSON.parse`.]** It accepts lone surrogate escapes (`"\ud800"`), which RFC 8259 leaves
  unspecified. → Accepted as `JSON.parse` does, as the reference codec does; a criterion pins the behavior.
- **[Served names differ across Node versions.]** Truncation depends on the running Node's ICU. → Stored rows do not
  (TM-20).
- **[Hostile values.]** A `javascript:` or `data:` URI is a valid absolute URI. → Served as data; the module guide
  tells clients to treat every value as untrusted and not to render images as inline SVG (the MIP's "Security
  Considerations").
- **[Preview's v9 is not yet known.]** If preview's hard fork ships runtime 3,000,000 or higher, UmbraDB halts with
  `unknown-runtime` before this module sees a block; if it ships a ledger rc other than rc.5, the vendored package may
  not match. → Dependencies in the proposal; not this change's to fix.
- **[The MIP is still Proposed.]** Its text may change again. → The spec pins `338ea19`; a later text is a later change.

## Migration Plan

New module, new schema: one migration `001` creates both tables and their indexes. No existing database or table
changes; a database without a `token-metadata` entry is untouched. It can be added to an existing database at any height
above the cursor (MD-4, TM-1), and removed by a stop height (RN-10); its schema stays and is ignored.

## Open Questions

None that change the specs, the approach or the tasks. The proof of concept (proposal, D-D) is the reference
repository already used as evidence.
