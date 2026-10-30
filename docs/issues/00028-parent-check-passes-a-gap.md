# 00028 — `core-block-commit`'s parent check lets a block above a gap commit

- **Status:** OPEN
- **Area:** logic
- **Severity:** high
- **Effort:** small — about 10 lines and a test in the block-commit check, but it is on the path every block takes, so
  it needs care.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 10.4 of `openspec/changes/core-arch`, in the run of the A86 negative control
  `AlwaysLanded` (`test/runner/recovery.test.ts`): a recovery that reads a `COMMIT` that did not land as landed skips
  height 3, and heights 4 and 5 then commit above the gap. Task 10.4's own recovery never leaves a gap; the check
  below is what would have caught one.

## Problem

IN-4's parent check (`checkParent`, `src/backbone/core-block-commit/core-block-commit.ts:192-203`) compares a block's
parent hash with the hash of the block stored at h − 1, and passes when no block is stored there: "With no block stored
at h − 1 there is nothing to compare: the anchor, block S, whose parent the database never holds" (`:190`). Only S has
no stored parent, but the check does not know S: any block whose h − 1 row is missing passes, whatever its height. The
loop's own check before the `COMMIT` (`src/runner/loop.ts`, `write`: the cursor must be h with the block's hash) passes
too, since the cursor is the highest row. So a block committed above a missing height is never refused, and the
database then holds a chain with a hole that every later block extends.

## Evidence

- `src/backbone/core-block-commit/core-block-commit.ts:193-194`: the row at h − 1 is read, and
  `if (parent === undefined) return;` ends the check.
- The A86 control `AlwaysLanded` (task 10.4): after the `COMMIT` of 3 failed without landing, the control treats it as
  landed, and the process commits 4 and 5 — `rec.rows` and the blocks table hold 1, 2, 4, 5, the state `following`.
  How a gap can arise without such a bug: another writer deleting rows while the process is away (A86's third case,
  which task 10.4 halts on with `unexpected-cursor`), or a restore of a partial backup.

## Suggested fix

Pass the check without a stored parent only at S: `core-block-commit` knows S from `core_chain.identity` (or from the
resolved graph's start, which the loop has), so `checkParent` can fail with `parent-mismatch` (`stored: null`) for a
block above S whose h − 1 row is missing. Add a test that commits a block above a deleted row and expects the halt, and
keep A88's anchor case (block S on an empty database) passing.
