# 00023 — The blocks table's height partitions end at 5,000,000

- **Status:** OPEN
- **Area:** infra
- **Severity:** low
- **Effort:** large — adding partitions later means a migration of the height-split tables of seven modules; deferred on
  purpose.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, task 10.2's question Q119 of `openspec/changes/core-arch`; kept open as a reminder by the owner
  ("Add a note that this needs to updated in the future").

## Problem

`core_block_commit.blocks` is partitioned by height: migration `001` of `core-block-commit` creates five partitions of
1,000,000 heights (0–4,999,999) and a default partition. Every height above 4,999,999 goes to the default partition,
which is correct but unpartitioned, so per-range maintenance stops working there. With six-second blocks, mainnet
reaches height 5,000,000 about 347 days after genesis.

## Evidence

- `src/backbone/height-partitions.ts` (`HEIGHT_PARTITION_SIZE` 1,000,000, `PRECREATED_HEIGHT_PARTITIONS` 5,
  `heightPartitionsSql`), used by `core-block-commit`'s migration `001`.
- Decision record Q119, resolved A (keep as is) on 2026-10-26.

## Suggested fix

Before mainnet passes 5,000,000, a release adds the next partitions of every height-partitioned table by migration
(option C of Q119), moving any rows the default holds by then; the default stays as the safety net.
