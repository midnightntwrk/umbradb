# 00089 — The first block of the v9 runtime halts with `metadata-mismatch` on every network

- **Status:** CLOSED — fixed by the change `v9-upgrade-metadata` (branch `00089-v9-upgrade-metadata`, PR #24): a
  block's content is decoded with its parent's runtime when that one's version is the `MNSV` version, else with its
  own state's, else it halts naming both; `test/ledger/delayed-upgrade.test.ts` replays the three networks' upgrades.
- **Area:** ledger (runtime metadata selection, LG-4)
- **Severity:** high — a process that follows mainnet, preprod or preview across its upgrade to runtime 2,001,100
  halts at the first block of that runtime and cannot go on; only a database whose S is above that block runs.
- **Effort:** medium — the rule that picks a block's metadata changes, with tapes of each network's upgrade as tests.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-09, replaying the new preview tape `preview-v9-0-2000` from genesis with the full ledger core
  (`token-metadata`, PR #20, while checking its M1 on a v8 → v9 chain).

## The problem

`RuntimeMetadata.forBlock` (`src/ledger/metadata.ts:74-90`) decodes a block's content with the metadata of the
runtime in its parent's state and requires that runtime's `spec_version` to be the block's `MNSV` digest version
(LG-4). That held for every earlier upgrade: `set_code` ran in the enactment block U, the state at U already held the
new runtime, and F = U + 1 carried the new version in its digest. The upgrade to runtime 2,001,100 (node 2.1.101)
takes effect one block later than the state shows: the block that logs the runtime change (`RuntimeEnvironmentUpdated`,
digest item `0x08`) still answers the old version to `state_getRuntimeVersion`, and the next block carries the new
version in its digest and its own state. So at that block the parent's runtime is the old one, and processing halts:

```
processing halted (metadata-mismatch): processing stopped at height 1572 in on-fetch of core-block-fetch, before the
height committed: ... block 1572 (0x086f98319e981210268d6e4431f2255b1dd2fa997c3615e866259cbfa612ec6e) carries
spec_version 2001100 in its MNSV digest, but the runtime in its parent's state
(0x4f0b8b7e7726073e5c679bbbd69dc9c04aefd7e8fee4270d4b09283f9460fd4d) has spec_version 1000300
```

## Evidence

The nodes on 2026-11-09 (`system_version` 2.1.101-913ec011): for each block, its `MNSV` digest version, the
`spec_version` at its parent's hash and at its own, and whether its digest has the `0x08` log.

| Block | `MNSV` | Parent's state | Own state | `0x08` |
|---|---|---|---|---|
| preview 556 (the 1,000,300 upgrade) | 1,000,000 | 1,000,000 | 1,000,300 | yes |
| preview 557 | 1,000,300 | 1,000,300 | 1,000,300 | — |
| preview 1,571 | 1,000,300 | 1,000,300 | 1,000,300 | yes |
| preview 1,572 | 2,001,100 | **1,000,300** | 2,001,100 | — |
| mainnet 2,738,210 (the 1,000,300 upgrade) | 1,000,000 | 1,000,000 | 1,000,300 | yes |
| mainnet 3,346,138 | 1,000,300 | 1,000,300 | 1,000,300 | yes |
| mainnet 3,346,139 | 2,001,100 | **1,000,300** | 2,001,100 | — |

Preprod's upgrade block is 3,348,434 (issue 00087). The tape `preview-v9-0-2000` (`test/tape/real/manifest.json`)
reproduces the halt: replayed from 0 with the ledger core it stops at 1,572.

## Suggested fix

Pick a block's metadata from the runtime that executed it, which its `MNSV` digest names: the parent's runtime when
their versions agree (every block so far), else the runtime in the block's own state when that one's version is the
digest's (the 2.1 upgrade), else halt as now. Check how the official indexer (`chain-indexer/src/infra/subxt_node.rs`)
handles the 2.1 upgrade first, and add tests on the tapes of each network's upgrade. Until the fix, a database for
these networks starts above the upgrade block.
