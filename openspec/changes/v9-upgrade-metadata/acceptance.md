# Acceptance — V9-UPGRADE-METADATA: decode a block with the runtime that built it, across node 2.1's runtime upgrades

Every criterion is numbered (`V1` …), individually checkable, and tagged as `core-arch`'s `acceptance.md` tags them:
`[CI]` CI test, `[DOC]` documentation artifact; `[NEG]` marks a criterion whose test carries a negative control that is
seen failing for its own reason with the fault put back. Database criteria run on PostgreSQL 18 in Docker and on PGlite
unless a criterion names one backend. The tapes are those of `test/tape/real/manifest.json` (in `UMBRADB_TAPES`; a
tape-based case is skipped by name when its tape is absent). The requirement each criterion verifies is in parentheses.

## Definition of done

1. Every criterion below passes; every `[NEG]` control fails for its own reason with the fault put back.
2. Every `core-arch`, `start-umbradb` and `ledger-refcount` criterion passes unchanged, the tape-based ones over
   earlier-form upgrades included.

## Criteria

- **V1** `[CI][NEG]` The tape `preview-v9-0-2000` replayed from 0 to 2,000 with the ledger core (`core-ledger-state`
  and the core modules it needs, `core-contract-logs-full`) commits every height, 556 (an earlier-form enactment) and
  1,572 (a delayed upgrade's first block) included, and each state root equals the node's. **Negative control:** the
  parent-first selection of `core-arch` LG-4 halts at 1,572 with `metadata-mismatch`. (LG-4)
- **V2** `[CI][NEG]` Tapes over the delayed upgrade on mainnet (around 3,346,139) and preprod (around 3,348,434),
  replayed with `core-contract-logs-fast`'s core from a few blocks before the upgrade, commit every height; the first
  block of the new runtime is decoded with that runtime's metadata: its chain events decode and are stored.
  **Negative control:** the parent-first selection halts at that block. (LG-4)
- **V3** `[CI]` The replays over earlier-form upgrades pass unchanged: `devnet-v8-v9-0-235`,
  `mainnet-1774000-1780000` and `preview-1073620-1075620` (their existing tests). (LG-4)
- **V4** `[CI][NEG]` Over a fake node, the selection decodes a block with its parent's runtime when that one's version
  is the `MNSV` version (every block of the earlier form, its U included), with its own state's when only that one's is
  (a delayed upgrade's first block), and halts `metadata-mismatch` when neither is, naming the block's height and hash,
  its `MNSV` version and both versions read, and reading no metadata; a runtime's metadata is cached only under the
  version read at the hash it was read at. **Negative control:** `core-arch`'s parent-only selection halts at the delayed
  upgrade's first block of the fake node. (LG-4)
- **V5** `[CI]` Per block, the tape node's call log shows the content's `state_getRuntimeVersion` at the block's parent's
  hash (block 0: its own), and at its own hash only at a delayed upgrade's first block; `state_getMetadata` is read only
  at hashes the tapes hold (no `not-on-tape`). (LG-4, IN-8)
- **V6** `[DOC]` `core-arch` design §5 ("Metadata") and `src/ledger/metadata.ts`'s comment state the rule with both
  forms; `docs/issues/00089` is CLOSED with the fix's reason.
