# 00043 — slow-block-outside.negative-control.test.ts's 1 s threshold, which loaded heights cross

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

`test/runner/slow-block-outside.negative-control.test.ts` (task 5.5a, A161) runs a watchdog that never times the
points after a commit, with `slowBlockMs` 1,000, and expects the oracle to report that `status()` and `/status` never
showed `slow-block`. A height's own processing — on PostgreSQL its `on-db-write` and `COMMIT` — is not held by the
case, but on a loaded machine it can take longer than 1,000 ms, and then the watchdog raises a correct `slow-block` for
that height in `on-db-write`. The oracle then reports a different list, and the control's `arrayContaining` fails.

Issue 00040 is the same kind of timing bound in `test/runner/slow-block-windows.test.ts`, and issue 00035 in
`slow-block-cases.test.ts`; this file is a third of the same kind.

## Evidence

- Task 8.3a's suites run (2026-10-27, through Codex, label `lane1-8.3a-suites`, `npx vitest run test/node test/admin
  test/backbone test/runner`, load averages about 30 to 40): `Test Files 1 failed | 105 passed (106)`, the one failure
  "A161's negative controls on 'PostgreSQL 18' > a watchdog that never times the points after a commit fails 'shown'
  for on-after-db-write": `status() showed {"code":"slow-block","height":"2n","point":"on-db-write","module":null}`,
  the log `slow block: height 2 is still processing after slowBlockMs (1000 ms), in on-db-write`, then `slow block:
  height 2 committed after 1126 ms`.
- The same file alone right after (label `lane1-8.3a-slow-block-outside-control`): `Test Files 1 passed (1)`, `Tests 6
  passed (6)`.
- `test/runner/slow-block-outside.negative-control.test.ts:57`: `expect(await problemsOf(untimed("after-commit"),
  "on-after-db-write", …)).toEqual(expect.arrayContaining(["status() never showed slow-block", "/status never showed
  slow-block", …]))`.

## Suggested fix

As for 00040: let the control ignore a `slow-block` raised for the height's own processing (point `on-db-write`, or
the window `height`) and assert only on the window it leaves untimed, or give these runs a `slowBlockMs` well above a
loaded commit while holding the untimed window longer than it.
