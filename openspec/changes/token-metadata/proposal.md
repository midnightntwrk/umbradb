# Proposal — TOKEN-METADATA: port the MIP-0018 token indexer's metadata core to UmbraDB 0.10.0 (`token-metadata`)

> **Status:** Proposed (2026-11-05, third draft: rewritten as a port of the proof of concept, acedward/umbradb PR #26 and
> #27; decisions P-1 … P-3 and the corrected D-D taken by Jonathan on 2026-11-05. Not yet through the stage-1 cold
> adversarial review or the owner's approval). Requires `fast-logs-unresolved`. No code yet.

## Why

MIP-0018 ("On-Chain Token Metadata Emission", pinned at
[`338ea19`](https://github.com/midnightntwrk/midnight-improvement-proposals/blob/338ea19/mips/mip-0018-on-chain-token-metadata.md),
the same file as `eb94bc1`, the merge of MIP PR #372) lets a contract describe its own tokens in MIP-0002 `Misc` events.
A working token indexer and explorer for it already exists on UmbraDB's 0.9.5 line: the **proof of concept**,
[acedward/umbradb PR #26](https://github.com/acedward/umbradb/pull/26) (server, `760d3e9`, final audit passed, 119/119
required tests) and [PR #27](https://github.com/acedward/umbradb/pull/27) (the same in a Chrome tab on PGlite, preview at
https://stagenet.umbradb.pages.dev). It runs on the npm package `@midnightntwrk/ledger-v9` 1.0.0-rc.3 and depends on the
official indexer's GraphQL for per-segment outcomes.

Stagenet (ledger v9-rc3) goes away when preview gets ledger v9 by hard fork, expected by the end of November 2026.
UmbraDB 0.10.0 (`core-arch`) already selects vendored ledgers per runtime (v9-rc3, v9), ingests from the node alone, keeps
deterministic module tables, and has its own browser build. Porting the proof of concept onto it keeps the explorer
working across the hard fork, from any start height, without the official indexer. The roadmap lists token metadata as
feature **F4, P1** (`ROADMAP.md:125`). The MIP's reference implementation,
[`midnight-experiments/mip-0018`](https://github.com/midnight-experiments/mip-0018/tree/e8295792d9363be37ff2f7f716c740fcdf3f195e),
supplies the codec, vectors and stagenet cases both use.

## What changes

1. **A module `token-metadata`** (`design.md` D1): the proof of concept's metadata core as a module that requires
   `contract-logs` and `block-parsed` (each event's transaction hash), with the core's finalized loop in place of its archive and scanner. Shipped in the package, enabled
   by a configuration entry, from the database's first height on any network (TM-1).
2. **Its rules, reused** (D7): the vendored reference codec and vectors, `classify.ts` (UTF-8 keys), and `state.ts`
   (defined keys, per-key tombstones, withdrawal, usability, truncation, groups of two or more, marks) (TM-2 … TM-11).
3. **Unresolved logs, not halts** (TM-5, TM-11): the unresolved sites of `fast-logs-unresolved` stored as `unresolved`
   events and reflected in marks, as the proof of concept does.
4. **Its `/v1` API** (TM-12, TM-13; D5): status, tokens, a color, an identity, a contract's tokens and groups, the
   lookup and events, with the API contract's shapes and rules; mint-, activity- and image-derived fields served empty
   until the changes that add them.
5. **Evidence** (`acceptance.md`): every vendored and UmbraDB vector on both backends; the proof of concept's stagenet
   ranges re-recorded as UmbraDB tapes, with its case fixtures, and its own API answers recorded from it as the
   reference for the port's; the module in the browser build.

## Non-goals (what this change does NOT cover)

- **No explorer page.** Ported in the next change (the proof of concept's `ui/`, into 0.10.0's browser build); this
  change makes the module run there and serves the API the page reads.
- **No mints, seen colors, activity, Bech32m or `minted` statistics** (a later change; it needs mint effects, which a
  ledger task gives). Lookup resolves described identities only until then.
- **No image fetching** (`/v1/images`, the fetcher; a later, server-only change).
- **No JSON RPC tab** (PR #27's; it belongs to `evm-compat`).
- **No change to the core** beyond `fast-logs-unresolved`, a separate change.
- **No late start.** The module cannot be added to a database above its first height (TM-1).
- **No official-indexer dependency** and no reorganization handling (finalized blocks only, RN-6, RN-14).
- **No fix for preview's v9 runtime or ledger release** if its hard fork needs one (the runtime table's cap, the vendored
  ledger); separate changes.
- **No change to the proof of concept or the reference repository.**

## Decisions taken (2026-11-05)

- **P-1** Port in a chain of changes: (1) this metadata module and API, (2) the explorer page in the browser build, (3)
  mints, seen colors, activity, NIGHT/DUST amounts, (4) images, server only. PR #27's JSON RPC tab is out of scope.
- **P-2** The proof of concept's `/v1` contract is kept, with `/v1/status` mapped to the process (D5).
- **P-3** `core-contract-logs-fast` records unresolved sites instead of halting (`fast-logs-unresolved`); issue `00085`.
- **E-3** The proof of concept's readings: an identity exists by its defined keys, groups need two members, no history;
  but `name` and `symbol` are cut when served, not stored, to keep stored rows independent of the Node version.
- **Q-1 (revised)** The reference codec is vendored, as the proof of concept does.
- **Q-3** Shipped in `umbradb` as `src/features/token-metadata/`, outside `CORE_MODULES`.
- **Q-4 (revised)** Stagenet evidence from tapes over the proof of concept's ranges.
- **D-B** The explorer page is the next change.
- **D-D (corrected)** The proof of concept is acedward/umbradb PR #26 and #27; `midnight-experiments/mip-0018` is the
  MIP's reference implementation.

## Capabilities

### New Capabilities

- `token-metadata`: MIP-0018 metadata from contract logs, kept per identity, served as the proof of concept's `/v1` API.

### Modified Capabilities

None (the core's `contract-data` change is `fast-logs-unresolved`).

## Impact

- **Code:** `src/features/token-metadata/` (module, log reader, ported `classify.ts` and `state.ts`, vendored codec, SQL,
  routes); its export from `src/index.ts`.
- **Databases:** schema `token_metadata`, three tables, deterministic and in the contents hash; only with an entry.
- **Configuration:** a module entry from the database's first height; with `core-contract-logs-fast` (development
  opt-in) at any height, or `core-contract-logs-full` from 0.
- **Tests and fixtures:** `test/fixtures/mip0018/` (vendored vectors, UmbraDB vectors, cases, the proof of concept's
  recorded API answers);
  two stagenet tapes added to the tapes release and `test/tape/real/manifest.json`.
- **Docs:** `docs/module-guide.md`, `docs/operator-guide.md`, `docs/browser.md`, `ROADMAP.md` (F4), `README.md`,
  `NOTICE` for the vendored codec.
- **Dependencies:** none at runtime beyond the vendored codec (Apache-2.0).
