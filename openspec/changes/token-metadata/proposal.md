# Proposal — TOKEN-METADATA: MIP-0018 token metadata from contract logs (`token-metadata`)

> **Status:** Proposed (2026-11-05, second draft: revised for a start at any height and computed colors after an
> internal review; Jonathan took the recommended answers to Q-1 … Q-4 and D-A … D-C, and answered D-D, on 2026-11-05. Not yet through the
> stage-1 cold adversarial review or the owner's approval). No code yet.

## Why

Midnight wallets and explorers cannot tell what a token is: a contract-issued UTXO carries a 32-byte color and no
name, and a contract token has no generic way to be found or labelled. MIP-0018 ("On-Chain Token Metadata Emission",
status Proposed, text pinned at commit
[`338ea19`](https://github.com/midnightntwrk/midnight-improvement-proposals/blob/338ea19/mips/mip-0018-on-chain-token-metadata.md),
7 Oct 2026) lets a contract describe its own tokens in MIP-0002 `Misc` events named `mip-0018:token-metadata[v1]`; a
consumer folds them into one current value per key. It needs only ledger v9's contract logs: today stagenet (rc.3), and
preview once its hard fork to v9 lands (expected by the end of November 2026), when stagenet is retired.

The project's goal is a showcase anyone can run: a developer opens UmbraDB's browser build against the network,
submits metadata events, and sees them appear — from whatever height the page started at, with a partial view where
earlier data is missing. UmbraDB already stores every MIP-0002 log of a block in the shared item `contract-logs`
(`core-arch` CC-2 … CC-4; `src/backbone/contract-logs/contract-logs.ts`), and `core-contract-logs-fast` gives it from
any height without the ledger state (CC-3). The roadmap lists token metadata as feature **F4, priority P1**, built on
`contract-logs` (`ROADMAP.md:125`); F10 builds on it (`ROADMAP.md:131`).

The MIP becomes Active once at least two independent consumers pass every normative vector (MIP-0018 "Path to
Active"). Its reference implementation,
[`midnight-experiments/mip-0018`](https://github.com/midnight-experiments/mip-0018/tree/e8295792d9363be37ff2f7f716c740fcdf3f195e),
is the first, pinned to an earlier MIP text (`274a84f`); its README lists the second as "not provided". The official
indexer decodes no MIP-0018 (`indexer-common/src/domain/ledger/ledger_state.rs:2077-2097` at
[`4930c4e`](https://github.com/midnightntwrk/midnight-indexer/tree/4930c4e059b5ede24b5f4055a07453dbabfac3cc)).

## What changes

1. **A new module `token-metadata`** (`design.md` §D1) shipped in the package and enabled by a configuration entry.
   It requires only `contract-logs`, declares no ledger task, and can start at any height (`startsMidChain: true`,
   MD-4), with either log provider, in the browser and on a server (TM-1).
2. **Facts, not state** (TM-2, TM-8; `design.md` §D4): per block, the module stores each candidate event with its
   outcome and each accepted record. Nothing it stores depends on earlier blocks, so rows are the same whatever the
   start height.
3. **Reading the events** (TM-3 … TM-6): `Misc` logs with the exact v1 name, the 256-byte payload zero-extended as the
   MIP's "Consuming" requires, checked by the MIP's three checks and six value types; a bad event is rejected whole and
   never affects another. A log serialization this build does not know halts the module rather than emptying it (TM-4).
   The decoder is written from the MIP text (Q-1).
4. **Colors computed** (TM-7, TM-12; `design.md` §D2): for kinds 1 and 2 the color is computed from `domainSep` and the
   emitting contract (the MIP's `tokenType`), never read from a payload. No mint scanning.
5. **Answers are replays with their coverage** (TM-9 … TM-17; `design.md` §D5): each answer applies the identity's
   records in chain order (tombstones, vanished identities), then the serving rules: only defined keys, unusable values
   shown without fallback, names and symbols truncated by grapheme clusters, symbol groups per contract, marked history
   (Q-2). Every answer says which heights it covers and whether that is the whole chain.
6. **Routes and a subscription** (TM-18, TM-19): by color and kind, a contract's identities, one identity, its history,
   a contract's groups, and a subscription of changed identities after each commit.
7. **Acceptance** (`acceptance.md`): every normative MIP vector (A1–A6, R1–R6, the ignore rule, S1–S12); the reference
   repository's vectors with the ones the current text supersedes listed; UmbraDB's adapter for the reference runner;
   the reference repository's 13 stagenet cases replayed in CI from a tape with a mid-chain start (Q-4).

## Non-goals (what this change does NOT cover)

- **No change to the core.** No new or changed `core-arch` requirement; no change to `CORE_MODULES`, the ledger worker
  or `ParsedTransaction`.
- **No browser page.** The screen that shows events arriving is a separate change, chained after this one (D-B). This
  change gives it the API and makes the module run in the browser build.
- **No change to `core-contract-logs-fast`.** It stays development-only and keeps halting on a partially successful
  transaction that logs (D-C); recorded as issue `docs/issues/00085`.
- **No complete view from a mid-chain start.** A token described before the start height shows nothing until described
  again; answers say so (TM-9). No backfill from earlier blocks.
- **No mint scanning** and no `segment-results`: colors are computed (`design.md` §D2).
- **No official-indexer compatibility.** No GraphQL, no `MiscContractEvent` shape, no id numbering: that is F1 and F2.
- **No ledger v8 metadata.** v8 has no contract logs (`core-arch` Q54); nothing is read from circuits or registries.
- **No later MIP-0018 version** (`[v2]` events are ignored, as the MIP requires) and no key a later MIP defines.
- **No off-chain fetching.** `image` is served as the URI it is; checking content against `image_sha256` is the
  client's.
- **No curation**, allowlists, or cross-contract grouping, and **no amount display** (S8 concerns consumers that
  display amounts; `decimals` is served).
- **No reorganization handling.** UmbraDB applies finalized blocks only (`core-arch` RN-6, RN-14), the MIP's alternative
  to recomputing state (S4).
- **No change to the reference repository** and no move of it to ledger rc.5 or rc.7.
- **No fix for preview's v9 runtime or ledger release.** If preview's hard fork ships runtime 3,000,000 or higher, or a
  ledger rc other than the vendored rc.5, UmbraDB needs those changes first (the runtime table's cap, the vendored
  ledger); they are separate changes.

## Decisions taken (2026-11-05)

- **Q-1** Decoder written from the MIP text; the reference vectors are tests only.
- **Q-2** Replaced values are served as marked history.
- **Q-3** Shipped in the `umbradb` package as `src/features/token-metadata/`, id `token-metadata`, outside
  `CORE_MODULES`.
- **Q-4** CI replays the stagenet cases from a tape with a mid-chain start; no full replay from genesis is required.
- **D-A** The module starts at any height and answers with its coverage.
- **D-B** The browser page is a separate change.
- **D-C** `core-contract-logs-fast`'s halt stays; an issue records it.

- **D-D** The "working proof of concept with a different ledger version" of the project's overview is
  `midnight-experiments/mip-0018` at `e8295792…`, the reference repository this change already uses. Its ledger
  version is rc.3 (stagenet's, `toolchain.json` `ledgerTarget`), not the v9 release preview's hard fork will bring; this
  change follows the logs of whichever v9 package the block's runtime selects, so it needs no change for that, beyond
  the runtime and ledger dependencies in the non-goals.

## Capabilities

### New Capabilities

- `token-metadata`: reading MIP-0018 `TokenMetadata` events from contract logs at any height, storing them as per-block
  facts, and serving identities' current fields, colors, groups and history with their coverage.

### Modified Capabilities

None.

## Impact

- **Code:** a new `src/features/token-metadata/` (module, decoder, log reader, color, SQL, routes) and its export from
  `src/index.ts`.
- **Databases:** two new append-only tables in the module's own schema `token_metadata`, deterministic and in the
  contents hash; no existing table changes. Only databases with a `token-metadata` entry get them, and an existing
  database can add one at any height.
- **Configuration:** a new module entry; with `core-contract-logs-fast` (development opt-in) from any height, or with
  `core-contract-logs-full` for a complete view from 0. A network on ledger v8 accepts it and stores nothing until it
  upgrades.
- **Tests and fixtures:** the MIP vectors; the reference vectors and stagenet cases copied under
  `test/fixtures/mip-0018/`; a new stagenet tape over 710,806–724,957 added to the tapes release and to
  `test/tape/real/manifest.json`.
- **Docs:** `docs/module-guide.md`, `docs/operator-guide.md`, `docs/browser.md` (adding the module to a browser
  configuration), `ROADMAP.md` (F4's status), `README.md`; issue `docs/issues/00085`.
- **Dependencies:** none new at runtime.
