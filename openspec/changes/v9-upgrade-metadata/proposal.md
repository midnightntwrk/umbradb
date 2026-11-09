# Proposal — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades (`v9-upgrade-metadata`)

> **Status:** Proposed (2026-11-09; the owner chose a separate change for issue 00089). No code yet.

## Why

Mainnet, preprod and preview moved to runtime 2,001,100 (ledger v9, node 2.1.101) in early November 2026, at blocks
3,346,139, 3,348,434 and 1,572. A process following any of them halts at that block and cannot go on
(`docs/issues/00089`):

```
processing halted (metadata-mismatch): ... block 1572 (0x086f9831…ec6e) carries spec_version 2001100 in its MNSV
digest, but the runtime in its parent's state (0x4f0b8b7e…fd4d) has spec_version 1000300
```

`core-arch` LG-4 decodes a block's extrinsics and events with the metadata of the runtime in its **parent's** state,
and halts unless that runtime's `spec_version` is the block's `MNSV` version (`src/ledger/metadata.ts:74-90`). That
held for every upgrade before: `set_code` ran in the enactment block U, so the state at U already held the new runtime,
U carried the old version in its digest and was decoded with the parent's (old) runtime, and F = U + 1 carried the new
one, which its parent U held. Node 2.1's upgrade to 2,001,100 takes effect one block later than the state shows: the
block that logs the runtime change (digest item `0x08`, `RuntimeEnvironmentUpdated`) still answers the old version to
`state_getRuntimeVersion`, and the next block carries the new version in its digest **and in its own state**, while
its parent's state still holds the old one. Evidence from the nodes (2026-11-09), per block: `MNSV` / parent's state
/ own state:

| Block | `MNSV` | Parent's state | Own state |
|---|---|---|---|
| preview 556 (the 1,000,300 upgrade, the earlier form) | 1,000,000 | 1,000,000 | 1,000,300 |
| preview 1,572 (the 2,001,100 upgrade) | 2,001,100 | 1,000,300 | 2,001,100 |
| mainnet 2,738,210 (the 1,000,300 upgrade) | 1,000,000 | 1,000,000 | 1,000,300 |
| mainnet 3,346,139 (the 2,001,100 upgrade) | 2,001,100 | 1,000,300 | 2,001,100 |

The official indexer handles both forms by naming, for each block, the runtime its content needs: it compares the
block's `MNSV` version with the version in the block's own state, decodes with the block's own state when they agree,
and with the parent's runtime when they differ (an enactment block of the earlier form)
(`midnight-indexer` `chain-indexer/src/infra/subxt_node.rs` at `5af321fd`, lines 197–215 and 260–290).

## What Changes

1. **LG-4 amended** (`specs/ledger/spec.md`): a block's content is decoded with the metadata of the runtime whose
   `spec_version` is the block's `MNSV` version — the runtime in the block's own state when its version is the `MNSV`
   version, else the runtime in its parent's state when that one's is, else processing halts with `metadata-mismatch`
   naming both versions. Reads of a block's own state keep using the runtime in that state; the cache by
   `spec_version` is unchanged.
2. **The selection in `src/ledger/metadata.ts`** (`RuntimeMetadata.forBlock`): reads the block's own runtime version
   first, which its own-state reads need anyway, and the parent's only when the two differ.
3. **Tapes of each network's v9 upgrade** in `test/tape/real/manifest.json`: `preview-v9-0-2000` (recorded
   2026-11-09, preview from genesis over both of its upgrades), and short tapes around mainnet 3,346,139 and preprod
   3,348,434, each replayed across its upgrade.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ledger`: LG-4 — which runtime's metadata decodes a block's content (`core-arch`'s `specs/ledger/spec.md`).

## Non-goals

- **No change to the network tables.** The networks' v9 upgrades are not pinned (`docs/issues/00087`) and preview's
  pins describe its old chain (`docs/issues/00088`); separate changes.
- **No change to the ledger versions or their selection by runtime** (LG-3): runtime 2,001,100 is already in the
  tables' v9 row.
- **No change to how a block's state is read** (storage, runtime calls): already the runtime in that state.
- **No migration.** No stored row depends on which metadata decoded a block beyond what the block's content is; a
  database halted at an upgrade block continues from it once the fixed build runs.
- **No unfinalized data, no new RPC method** beyond `state_getRuntimeVersion` at the block's own hash.

## Impact

- `src/ledger/metadata.ts` (`forBlock`), its callers in `src/backbone/core-block-fetch/` only through its result.
- Node calls: each block reads `state_getRuntimeVersion` at its own hash (today at its parent's), and at its parent's
  hash too only where the two differ (the earlier form's enactment blocks). The recorded tapes hold the runtime version
  at every recorded height's own hash (checked on `stagenet-715402-715433` and `preview-v9-0-2000`), and a parent's
  hash is the previous height's own, so replays stay on tape; a call a tape does not hold answers `not-on-tape`, which
  the existing tape tests would show.
- `core-arch`'s LG-4 scenario and its acceptance criterion (`acceptance.md:486`) are restated by this change.
