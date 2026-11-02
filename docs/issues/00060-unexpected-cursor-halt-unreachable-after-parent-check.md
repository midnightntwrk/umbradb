# 00060 — The `unexpected-cursor` halt test now halts `parent-mismatch` first

- **Status:** CLOSED — fixed 2026-11-02 in `7d7bd0b` (`start-umbradb` P11.1). The halt is not unreachable: on
  PostgreSQL another writer (a session of the server outside UmbraDB, which the writer lock does not keep out) that
  adds a row above h while h is processed leaves h's parent stored and the cursor row not h's, and the loop's check
  halts. The test now stages that on PostgreSQL (a module holds height 3 in `on-compute`; the test's own connection
  adds block 7's row) and keeps asserting `{ code: "unexpected-cursor", height: 3n, module: null, point: null }`, with
  the halt's log line and the heights kept. On PGlite no other writer exists and, with the real backbone, a block of
  another height never reaches the check (`parent-mismatch` above the cursor + 1, the stored block's primary key or
  S's anchor at or below it); the test reaches it there through a test `core-block-commit` without its parent check
  (`testBuild`'s `backbone` option, as `loop.test.ts` does). A new test asserts the old staging's earlier halt,
  `parent-mismatch` at 3 in `core-block-commit`'s `on-db-write`. Found beside: issue 00071 (a module can change the
  block's hash bytes, the one path to this halt on PGlite without a test part).
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
