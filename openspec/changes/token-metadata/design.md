# Design — TOKEN-METADATA (`token-metadata`): a port of the proof of concept's metadata core

## Context

See `proposal.md` for the motivation and `specs/token-metadata/spec.md` for the requirements (TM-1 … TM-16).

**The proof of concept** is acedward/umbradb PR #26 (`feat/00026-mip-0018-token-indexer` at `760d3e9`, on `evm-compat`,
UmbraDB 0.9.5) and its browser build PR #27 (`feat/00027-browser-pglite`, preview at https://stagenet.umbradb.pages.dev,
built from `f6f4ba7`). It runs on the npm package `@midnightntwrk/ledger-v9` 1.0.0-rc.3 and:

- archives finalized stagenet blocks with `chain-archive-sync` (node RPC plus the official indexer's GraphQL, which also
  gives per-segment outcomes), then scans the archive (`token-indexer/mip0018/scan.ts`);
- decodes events from raw transactions with the ledger's `decode_event` rule (`applied-parts.ts`), classifies them with
  the vendored reference codec plus a UTF-8 key check (`classify.ts`), and applies them with its own pure rules
  (`state.ts`: defined keys, usability, truncation, groups, `tokenMark`);
- keeps the state in its `mip0018` schema (`src/postgres/migrations/mip0018/001`–`004`), one transaction per block;
- serves `API.md`'s `/v1` API (`api.ts`, `api-views.ts`) and the explorer page at `/ui`;
- adds mints, seen colors, activity with Bech32m, NIGHT and DUST rows and a background image fetcher.

**UmbraDB 0.10.0** replaces the archive and scanner with the core's items, vendored and patched ledgers selected per
runtime (v9-rc3 for stagenet, v9 for runtime 2,001,000 and up), deterministic module tables, and its own browser build
(`core-arch` design §§4–6, §9.2). Its contract logs come from `core-contract-logs-full` (needs `core-ledger-state` from
height 0) or `core-contract-logs-fast` (any height, development-only, `core-arch` CC-2 … CC-4). With
`fast-logs-unresolved` (its own change, required first) `-fast` records what it cannot read as unresolved sites instead of
halting — the proof of concept's `unresolved` classification.

## Goals / Non-Goals

**Goals:**

- The proof of concept's metadata behaviour and `/v1` contract on 0.10.0, so its explorer page (the next change) and its
  recorded answers carry over.
- Reuse its code and fixtures wherever they do not depend on the archive: the vendored reference codec and vectors,
  `classify.ts`, `state.ts`, the API's shapes and rules, UmbraDB's own vectors (`vectors-umbradb/`), the case fixtures
  (`test/fixtures/mip0018-cases*`).
- Run from any database start height, in the browser build and on a server.

**Non-Goals (later changes, `proposal.md`):** the explorer page; mints, seen colors, activity, Bech32m and the mint-based
`minted` statistics; the image fetcher and `/v1/images`; the JSON RPC tab of PR #27, which belongs to `evm-compat`.

## Decisions

### D1. A module, not an archive and a scanner

| Proof of concept | Port |
|---|---|
| `chain-archive-sync` + `scan.ts` (archive, cursor, `removeAbove`) | The core's finalized loop and `contract-logs` (RN-6); no archive, no own cursor, no rollback (finalized only, RN-14) |
| `applied-parts.ts` (raw transaction decoding, `decode_event`, unresolved logs) | The `contract-logs` provider: its logs and, with `fast-logs-unresolved`, its unresolved sites |
| Per-segment outcomes from the official indexer | Not needed: the provider decides which logs applied (CC-2, CC-3) |
| `mip0018` schema, `001`–`002` migrations | Module schema `token_metadata`, migration `001` (D3) |
| `api.ts` on `node:http` | Routes registered in `on-start-api` on the module API (RN-15), the same handlers (D5) |

The module is `src/features/token-metadata/`, id `token-metadata`, exported as `TOKEN_METADATA` with an `entry(...)`
helper; not in `CORE_MODULES`. It has no ledger task, so it loads like any user module, in the browser too
(`docs/browser.md:91-94`).

### D2. Starting with the database (TM-1)

The proof of concept starts its scan wherever its archive starts, and its state is complete for that range. On 0.10.0
a module's rows must not depend on when it was added (MD-4's promise), but the materialized state of D3 does. The module
therefore declares `startsMidChain: true` — so a new database at any S, the browser's included, accepts it — and refuses
in `on-start-db` an entry whose first revision starts above the database's S (read from `core_chain.identity`) by
throwing `token-metadata-start-after-database`; a module cannot name a process refusal's code, so the process refuses
with `callback-error` at `on-start-db` of `token-metadata`, with that error as its cause (owner decision, 2026-11-06). Started at S, its rows equal those of any other database with the same S.
*Alternative:* store only per-block facts and replay at read time (the previous draft) — rejected because it breaks the
API contract's bounded cost (an identity's fields come in keyset pages; marks read six keys), which the proof of
concept's final audit (finding F2) required.

### D3. Tables (schema `token_metadata`)

Two `table` items, each one kind (`src/modules/declaration.ts:84-96`):

| Item | Table | Primary key | Other columns |
|---|---|---|---|
| `token-metadata-events` (append-only, by height) | `events` | (height, tx_index, log_index) | contract_address, entry_point (first 128 bytes), classification (`accept`, `reject`, `unresolved`), reason (null iff `accept`); for candidates also domain_sep, kind (null for `unresolved`) |
| `token-metadata-state` (mutable) | `fields` | (contract_address, domain_sep, kind, key) | val_type, value, set_height, set_tx, set_log, set_record |
| | `withdrawals` | (contract_address, domain_sep, kind) | height, tx_index, log_index of the identity's last withdrawal |

Indexes follow the proof of concept's (`001_mip0018_core.ts`): events by contract, by transaction hash's height and
index, unresolved and rejected events per contract; fields by `(contract_address, key)` for symbols. No `jsonb`; every
length and enumeration has a `CHECK`. Values are stored whole (TM-9, TM-14); the proof of concept stores `name` and
`symbol` cut, so its recorded answers and this port's agree, but its stored rows do not.

### D4. Per block

| Point | Work |
|---|---|
| `on-compute` | Read the block's `contract-logs` item; find candidates (D6); classify (D7); load the touched identities' fields at h − 1 (RN-4); apply `state.ts`'s rules in chain order; build the change set |
| `on-db-write` | Insert `events`; upsert and delete `fields`; upsert `withdrawals` |

### D5. The API

The proof of concept's handlers (`api.ts`, `api-views.ts`) are ported onto the module API: same paths, parameters,
shapes, errors, cursors (bound to their endpoint), limits (1–500, default 100), ASCII-escaped JSON, response headers, the
eight-request limit (`BUSY`), and one read per answer at one committed height (`ReadHandle`, DB-2) instead of a
`REPEATABLE READ` transaction; the core adds its `X-Umbra-*` headers (RN-16). TM-13's differences:

| Field or route | First port | Comes with |
|---|---|---|
| `minted`, `firstSeen`, `evidence`, `seen` rows, `/v1/tokens/{color}` of an undescribed minted color | `null`, `null`, `[]`, none, 404 | the activity change (mints) |
| `/v1/lookup` | the held kind's existing identity whose computed color matches; else `not-minted-in-indexed-range`; `indexedRange` = the module's S to the cursor | the activity change (the mint table) |
| `image` | `{ url, status: "pending", imageUrl: null }` for a usable `image` | the image change |
| `/v1/events` `segment`, `phase` | `null` (contract logs carry no segment of origin) | — |
| `/v1/status` | `startHeight` = S, `indexedHeight` = `archiveHeight` = the cursor, `scanner` = `following` / `stalled` (halted) / `off` (no worker), `vendored` and `mip` as the contract | — |

### D6. Candidates from a log's `data` (TM-2, TM-3)

`data` is the ledger's tagged serialization of the logged value (tag `impact-state-value[v2]`,
`test/ledger/vendored-ledger-v9.test.ts:53`). As the official indexer (`ledger_state.rs:2077-2142` at `4930c4e`) and
the proof of concept do, a `Misc` value that is one cell of one atom of at most 288 bytes is zero-extended to 288 and
split into name and payload; another shape under the known tag is not a candidate; an unknown tag fails the block. The
log version is not checked (`ledger_state.rs:1847-1854`; the proof of concept also applies the version-0 fallback). The
reader runs on the main thread without ledger objects and is checked against both v9 packages' own deserialization.

### D7. Classification and rules: reused

`vendor/mip0018/` (the reference codec, vectors and runner at `e8295792…`, byte for byte with `SOURCE.md`) and
`classify.ts` are copied under `src/features/token-metadata/` and `test/fixtures/mip0018/` with their provenance tests;
`state.ts` is copied and adapted only where it touches the archive. The vendored codec makes UmbraDB's consumer share
code with the reference, as the proof of concept already does (decision Q-1 revised).

### D8. Testing

- **Vectors:** every vendored vector (normative and informative) and `vectors-umbradb/` (A3c, the per-key tombstone
  versions) through a pure adapter and the module on both backends, as the proof of concept's
  `mip0018-vectors*.test.ts`.
- **Stagenet:** tapes in UmbraDB's format (`tools/tape`) over the proof of concept's ranges 714,485–715,183 and
  715,402–715,433, replayed with `core-contract-logs-fast` and the module from 714,485; every case of
  `test/fixtures/mip0018-cases*` (C01–C10, IDX, U1, with UmbraDB's amendments) compared; the proof of concept's answers, recorded from it
  at `760d3e9` on its own fixtures (its tests hold their expectations inline, `token-indexer/test/mip0018-api.test.ts`),
  compared with TM-13's differences masked.
- **Browser:** the browser suites' tape node serving those tapes to a page with the module (TM-16).

### D9. Exports (task 4.3)

`src/index.ts` exports the module's declaration, so a configuration writes `TOKEN_METADATA.entry({ start, config: {} })`
as it writes a core module's, and the error a refused start carries as its cause, so a host can tell it by `instanceof`.

- **Exports** (`core-arch` design §12, amended after start-umbradb): added `TOKEN_METADATA` and
  `TokenMetadataStartAfterDatabase`, and the types none; kept every other name; removed none.

## Risks / Trade-offs

- **[Depends on `fast-logs-unresolved`.]** Without it, a mid-chain run halts on any log `-fast` cannot read. → Built and
  merged first; until then this change's tests use `-full` from 0 on synthetic chains and `-fast` on tapes without such
  logs (every recorded stagenet event is a pushed literal, the proof of concept's README notes).
- **[Cannot be added to an existing database.]** → TM-1's refusal names the cause; the module rebuilds from S in a new
  database.
- **[Stored rows differ from the proof of concept's.]** Whole values instead of cut ones (D3). → Answers agree; only rows
  differ, and determinism across Node versions is kept.
- **[Lookup without mints is weaker.]** A minted but undescribed token is not found until the activity change. →
  TM-13 documents it; the answer keeps the contract's `result` values.
- **[`segment` and `phase` are null in `/v1/events`.]** → A later core change could carry a log's segment of origin.
- **[Preview's v9.]** If preview's hard fork ships runtime 3,000,000 or higher, or a ledger other than rc.5, UmbraDB
  needs the runtime-table and vendored-ledger changes first. → Listed in the proposal; not this change's.
- **[The MIP is still Proposed.]** → Pinned; a later text is a later change.

## Migration Plan

New module, new schema, one migration `001`. No existing table changes. A database without the entry is untouched; one
with it must have started with it (TM-1). Removing it is a stop height (RN-10).

## Open Questions

None that change the spec or the tasks.
