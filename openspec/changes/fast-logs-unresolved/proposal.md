# Proposal — FAST-LOGS-UNRESOLVED: the fast contract-log provider records what it cannot read instead of halting (`fast-logs-unresolved`)

> **Status:** Proposed (2026-11-05, first draft, proposal and spec delta only; `design.md`, `acceptance.md` and
> `tasks.md` follow once the approach is agreed. Decided by Jonathan on 2026-11-05 (decision P-3 of the
> `token-metadata` port); not yet through the stage-1 cold adversarial review or the owner's approval). No code yet.

## Why

`core-contract-logs-fast` is UmbraDB's only source of contract logs that can start mid-chain (`core-arch` CC-3): the
browser build always starts at the node's finalized head (`docs/browser.md:44`), and `core-contract-logs-full` needs
`core-ledger-state` from height 0 (CC-2). Today it halts the whole process with `fast-log-unsupported` on any log it
cannot read from the transcript alone (`src/backbone/core-contract-logs-fast/core-contract-logs-fast.ts:16-25`;
`transcripts.ts:22-24, 37, 86-92`):

- `not-a-literal`: the logged value comes from the contract's state, not a `push` right before the `log` op;
- `conditional`: the `log` op runs on some paths of the program only (behind a `branch` or `jmp`);
- `partial-transaction`: a log in a partially successful transaction, whose failed fallible segments the chain does not
  name.

Anyone can deploy a circuit of the first two kinds, so anyone can stop every mid-chain UmbraDB that follows the network
— the browser showcase of the MIP-0018 token explorer included. The proof of concept this work builds on (acedward/umbradb
PR #26, `token-indexer/README.md`, "Known limitation") meets the same three cases and does not stop: it stores each as
an `unresolved` event with its reason, never applies it, and marks the contract's tokens. Issue `docs/issues/00085`
records the problem.

## What changes

1. **Unresolved log sites instead of a halt** (CC-3, modified): for a log the transcript does not show, or one in a
   partially successful transaction, `-fast` stores no log and records an **unresolved site** — the transaction, the
   site's position in the transaction's applied `log` ops, the contract address, the entry point and the reason
   (`not-a-literal`, `conditional`, `partial-transaction`) — and the block commits.
2. **Numbering in a block with unresolved sites** (CC-3): every site, unresolved ones included, takes a `log_index`, so
   the logs `-fast` does store keep stable positions; in such a block `-fast`'s rows can differ from `-full`'s, and only
   in such a block. Blocks without unresolved sites stay identical to `-full`'s.
3. **A new table and item** (`contract-logs`, CC-2 … CC-4): `contract_logs.unresolved`, keyed by `(height, tx_index,
   log_index)`, append-only, partitioned by height, created by the shared item's next migration under the same role;
   and the sites in the `block` item beside the logs, so consumers see both. `-full` writes no row there.
4. **Development-only stays.** Whether `-fast` may leave development-only status is not changed here.

## Non-goals

- No guessing: an unresolved site is never turned into a log, and no state is read to resolve it.
- No change to `core-contract-logs-full` beyond declaring the new (always empty) table of the shared item.
- No change to the logs `-fast` stores in a block without unresolved sites, nor to how a literal is decoded.
- No reading of per-segment outcomes from outside the node (for example from an official indexer).
- No change to `token-metadata`; it consumes the new sites (its own change, `openspec/changes/token-metadata/`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `contract-data` (`core-arch`'s `specs/contract-data/spec.md`): CC-3 rewritten; CC-2 gains the empty table.

## Impact

- **Code:** `src/backbone/core-contract-logs-fast/`, `src/backbone/contract-logs/` (migration `002`, the item's shape),
  their tests and the halt registry (`fast-log-unsupported` is removed from `core-arch` design §11).
- **Databases:** a new table in `contract_logs`; existing rows unchanged.
- **Consumers of `contract-logs`:** a new field in the `block` item (the unresolved sites), additive.
- **Docs:** `docs/module-guide.md` (the item's shape), `docs/browser.md`, issue `00085` closed by this change.
