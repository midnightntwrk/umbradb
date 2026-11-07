# 00083 — Four timing-bound tests fail when the machine runs several test lanes at once

- **Status:** OPEN
- **Area:** tests (timing budgets and restarts under CPU load)
- **Severity:** low — each test passes on an idle machine and alone; under a load average of about 20–60 (up to five
  build lanes each running vitest, the 00034 build of 2026-11-03) they fail now and then, which a whole-suite run then
  reports as a failure that is not the change's.
- **Effort:** small to medium (per test: a budget scaled to the run, or a wait on the condition instead of a count).
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-03, the `ledger-refcount` build's whole-suite and integration runs (Codex runs of the 00034
  organizer's research folder, `codex-runs/`). None of the four failed in task 6.1's whole run on the idle machine
  (`p6-6.1-full`: 436 files, 6,509 passed, no failure). Related failures with issues of their own: A177 and A167
  (issue 00062), L16–L18's controls (00064), A130 (00041), A47's teardown (00081).

## Problem

Four tests outside the `ledger-refcount` change assert counts or deadlines that hold on an idle machine but not when
other test processes take most of the CPU:

| Test | Assertion that fails under load | Runs where it failed |
|---|---|---|
| A12 (`test/db/postgres-pool.test.ts:81`, "sees none of block h's rows … while the transaction for h is open") | `expected 5 (or 7) to be greater than or equal to 10`: fewer reader polls fit in the open transaction's window | `int-3.1-3.2`, `3.4-full`, `3.8-full-pre35`, `4.1-full`, `4.8-full` |
| A114 (`test/private/transport-intake.test.ts`, "dropped while the public cursor advances 50 heights …") | `expect(disconnects()).toBe(2)` got 1; once "reconnected at 34, 6 expected" | `3.4-full`, `3.8-full`, `4.1-full` |
| A162 (`test/private/config-hash.test.ts` and its negative control, PostgreSQL) | the restarted core is refused with `writer-lock-held` (`src/db/writer-lock.ts:70`): the stopped process's session still holds the lock | `3.8-full-pre35`, `4.7-full-2` |
| L38 (`test/library/channel-queue.test.ts:206`, "64 channels queue and answer pings, the 65th try-again …", PostgreSQL) | `Test timed out in 120000ms` | `4.4-full` |

Each passed when its file was run again alone (diagnostic only: AGENTS.md, "Flaky tests").

## Suggested fix

- A12: assert that the reader saw no row of block h at any poll while the transaction was open, with at least one
  poll, instead of a minimum poll count.
- A114: wait for the second disconnect (with the test's own deadline) before reading the count, and take the
  reconnect height from the event instead of a fixed number.
- A162: before restarting the core on the same database, wait until the stopped process's backend has left
  `pg_stat_activity` (its advisory lock released), as a real restart's operator would.
- L38: give the case its own timeout, or reduce its 64 channels' pings per run, after measuring it on an idle machine.

Then run the four files under a synthetic load (for example five concurrent `vitest run` of other files) and on an
idle machine.
