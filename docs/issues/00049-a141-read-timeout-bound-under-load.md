# 00049 — A141's "within 2 s" on PostgreSQL fails once under load

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

In task 15.1a's second conformance gate (2026-10-27, load averages 36–53 from three lanes' test runs), A141's first
PostgreSQL case failed on its wall-clock bound alone: a read bounded by a 1 s timeout (`BOUND`) running
`pg_sleep(60)` ended with `query-timeout` as it should, its cause the server's cancel (SQLSTATE 57014), but after
3,125.5 ms, and the test requires under 2,000 ms. Every other assertion of the case passed, and the case passed in
every other gate run so far, this task's first included.

The 2 s bound is the behaviour (DB-15: the read is cut off at its timeout, not when the statement ends), so a margin
is right; but the measured time also holds the container's scheduling of the cancel and the client's round trips on
a machine running tens of other processes, which can exceed a 1 s margin.

## Evidence

- `test/db/read-timeouts.test.ts:82`: `expect(ms).toBeLessThan(2_000)` — `AssertionError: expected 3125.5480000000007
  to be less than 2000`; the lower bound (`toBeGreaterThan(900)`, line 84) and the cause (line 81) held.
- The gate's log (task 15.1a's scratch, `codex-runs/lane3-15.1a-conformance-2.log`): `Test Files 1 failed | 298
  passed (299)`, `Tests 1 failed | 5080 passed | 39 skipped (5120)`, 741.9 s.

## Suggested fix

Keep the bound as a bound on the timeout, not on the machine: compare the time with `pg_sleep(60)`'s (a bound such as
`BOUND + 10 s`, far below the 60 s the statement would take) while keeping the lower bound, or measure from the
server's side (`pg_stat_activity`'s `query_start` and the cancel's time) instead of the client's wall clock — as task
0.5's notes ask of load-sensitive tests ("keep wall-clock assertions only where the bound is the behaviour").
