# Design — V9-UPGRADE-METADATA

## Context

`core-arch` design §5 ("Metadata", `RuntimeMetadata`) picks the metadata that decodes a block's content from the
runtime in its parent's state (block 0: its own), and §11 lists `metadata-mismatch` among the halts. The rule was
written for runtime upgrades that run `set_code` inside the enactment block U: the state at U holds the new runtime,
U's content is the old runtime's, and F = U + 1's is the new one's.

Runtime 2.1 sets `system_version: 3` (`midnight-node` `runtime/src/lib.rs:307` at `640f38b`): **delayed runtime
upgrades**. `apply_authorized_upgrade` in block N only stages the new code in `:pending_code`; block N + 1 is built and
executed by the staged runtime (its `initialize_block` runs the migrations), and `:code` is swapped at the end of
N + 1 (`midnight-node` `util/toolkit/tests/hardfork_e2e.rs:15-25` and `:266-275`, the node's own fork-boundary test).
So N + 1's `MNSV` version and its own state's runtime are the new one, while its parent N's state still holds the old
one. The nodes answer exactly that at preview 1,571 → 1,572 and mainnet 3,346,138 → 3,346,139 (proposal, "Why"). Every
later upgrade of a runtime with `system_version` 3 takes this form.

The official indexer decodes each block's content against the runtime its `MNSV` digest names: the block's own runtime
when the two versions agree, else the parent's (`midnight-indexer` `chain-indexer/src/infra/subxt_node.rs` at
`5af321fd`, lines 197–215 and 260–290).

## Goals / Non-Goals

**Goals:** a process follows a network across upgrades of both forms; a block whose `MNSV` version no runtime at hand
has still halts by name; the node calls stay those the tapes hold.

**Non-Goals:** the proposal's (the network tables, ledger selection, own-state reads, migrations).

## Decisions

### D1. The runtime named by the `MNSV` digest, own state first

For block B with `MNSV` version v (amends `core-arch` design §5, "Metadata"; LG-4):

1. Read the runtime version at B's own hash (block 0: the same). If it is v, decode B's content with that runtime's
   metadata (read at B). Every block of both forms but the earlier form's enactment block takes this path, the first
   block of a delayed upgrade included.
2. Else read the runtime version at B's parent hash. If it is v, decode with that runtime's metadata (read at the
   parent): the earlier form's enactment block U.
3. Else halt `metadata-mismatch` (`core-arch` design §11), naming B's height and hash, v, and the two versions read.

*Alternative:* keep the parent-first order and fall back to the block's own state — rejected: it makes every block of
the now normal form pay the fallback's second read at each upgrade's first block only, but keeps the parent read on
every block, where the own-state read is the one `forState` (the block's own reads) needs anyway. *Alternative:*
detect the form from the `0x08` digest item of the parent — rejected: the version comparison is what the official
indexer does and needs no knowledge of how an upgrade was applied.

### D2. Calls and cache

Each block reads `state_getRuntimeVersion` at its own hash (as `forState` already does for the block's own reads, so
the two share one call per block), and at its parent's hash only at an earlier-form enactment block. Metadata stays
cached by `spec_version`, read once per runtime at a hash whose runtime version was just read, so a runtime's metadata
is never cached under another version (`core-arch` design §5).

### D3. Tests on tapes of every form

- `preview-v9-0-2000` (2026-11-09): preview from genesis over an earlier-form upgrade (556) and a delayed one (1,572),
  replayed from 0 with the ledger core past 1,572 — today it halts there.
- New short tapes over the delayed upgrade on mainnet (around 3,346,139) and preprod (around 3,348,434), replayed
  across it with `core-contract-logs-fast`'s core (mid-chain; the ledger core cannot start there).
- The existing tapes over earlier-form upgrades (`devnet-v8-v9-0-235`, `mainnet-1774000-1780000`,
  `preview-1073620-1075620`) keep passing unchanged: the regression check of step 2.
- A unit test of the selection over a fake node: both forms, the halt, and that a version is cached only under itself.

## Risks / Trade-offs

- **[The ledger state at a delayed upgrade.]** The first block of the v9 runtime is applied with ledger v9 to a state
  the v8 ledger wrote (the official indexer notes the node's ledger-9 host API bridging the v8 state key at that block,
  `subxt_node.rs:252-256`). UmbraDB's ledger conversion at a ledger change (LG-9) is keyed to the `MNSV` version, not to
  the upgrade's form; the preview replay from genesis with the ledger core across 1,572 checks it, root check included.
  If it fails, that is a finding for this change's spec before any code.
- **[A third form.]** A future node could stage code differently again. → The halt names both versions, and the tapes
  of each network's upgrades are the regression set.
