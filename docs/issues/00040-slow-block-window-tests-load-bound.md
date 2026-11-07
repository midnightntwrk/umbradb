# 00040 — slow-block-windows.test.ts asserts no other slow-block within a 1 s threshold, which loaded heights cross

- **Status:** CLOSED — fixed by task 17.5a (2026-10-27): `slow-block-windows.test.ts` compares only the windows each
  case holds open (`<window>@<height>`), and its `on-finalized` and lockstep cases raise `slowBlockMs` and the holds
  together (2,000 ms) so the held window's own reads have at least 0.8 s; `slow-block-cases.test.ts` checks that height
  2 is not reported before its own window can have run `slowBlockMs` (the node's fetch, the queue's earlier work), that
  no height is reported after its commit (a height that commits in time), and gives a held height's retry
  `slowBlockMs` 3,500. Every case still fails a wrong watchdog the way it did.
- **Verified:** COMPLETED — re-checked 2026-10-29 at `258cec6`: the fix is present and has not regressed.
- **Area:** test
- **Severity:** med
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

`test/runner/slow-block-windows.test.ts` (task 5.5a, RN-17, A161) runs its loops with `slowBlockMs` 1,000 and expects
`slow-block` to be raised only for the window each case holds open. A height's own processing — on PostgreSQL its
`on-db-write` and `COMMIT` — is not held, but on a loaded machine it can itself take longer than 1,000 ms, and then the
watchdog raises a second, correct `slow-block` for that height, which the case's exact list does not expect.

Found by the integration of tasks 15.2a and 16.1 (2026-10-27), which do not touch the runner: the conformance gate on
`777a48a` (load from two other lanes' runs) failed only the case "each on-finalized is a window of its own, named by
the head it announces, the wait between heads not counted" on PostgreSQL 18, with an extra height-1 `on-db-write` event
raised at `sinceMs` 1,001.1. The same case passed in the gate runs on `afa4b91` and `d31c308`. Issue 00035 is the same
kind of timing bound in task 5.5's `slow-block-cases.test.ts`, and task 12.6's runner saw that file fail under load
once too ("a height prepared ahead…": height 2 committed after 3,394 ms against a 3,000 ms limit).

## Evidence

- `test/runner/slow-block-windows.test.ts:210`: `watchedLoop(started, source, 1_000)`; `:216`:
  `expect(raised).toEqual([expect.objectContaining({ window: "finalized", height: 2n, … })])`.
- The other cases of the file use 1,000 ms (`:237`, `:241`, `:270`, `:297`) and 1,600 ms (`:172`) the same way.

## Suggested fix

Compare only the windows a case holds open (filter `raised` and `ended` to `window !== "height"`, or to the held
window), keeping the check that no held window's report comes early; or raise `slowBlockMs` and the holds together
(for example 3,000 ms with holds of 2,100 and 4,500 ms) so an unheld height stays far below the threshold. Apply
the same to `slow-block-cases.test.ts` (issue 00035) and keep the negative controls failing.
