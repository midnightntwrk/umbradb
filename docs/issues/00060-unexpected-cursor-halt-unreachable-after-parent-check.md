# 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first

- **Status:** OPEN
- **Area:** test
- **Severity:** high — 2 tests of `test/runner/halts.test.ts` fail on PR #16's head (`c5cdb86`), one per backend; the
  halt they meet is correct, earlier and more specific.
- **Effort:** small — decide what the test should prove, then reword or re-stage it.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, in the baseline run of the `start-umbradb` plan, reproduced with the file run alone.
  Introduced by commit `40b30d3` (issue 00028, the parent check above a missing height), pushed to PR #16.

## Problem

"a block whose cursor row is not the height's halts with unexpected-cursor, naming no module or point" stages the case
by answering height 3 with the block of height 4. Since issue 00028, `core-block-commit` checks that block's parent
against the stored block at its own height − 1 (3), which is missing, so it refuses `parent-mismatch` at
`on-db-write` before the loop's cursor check can see an unexpected cursor row. The test expects
`{ code: "unexpected-cursor", module: null, point: null }` and gets `{ code: "parent-mismatch", module:
"core-block-commit", point: "on-db-write" }`.

## Evidence

- `test/runner/halts.test.ts:405-424` — the staging and the expected reason.
- `src/backbone/core-block-commit/core-block-commit.ts` — `checkParent` refuses when h − 1 is missing (commit
  `40b30d3`).
- `src/runner/failures.ts` — `unexpected-cursor`, the runner's own halt code.

## Suggested fix

Either assert the new, earlier halt in this case (and rename the test), or stage an unexpected cursor row the parent
check cannot see (a seam on the cursor write), so `unexpected-cursor` keeps a triggering test (A87's registry needs
one). Fix before the next push to PR #16.
