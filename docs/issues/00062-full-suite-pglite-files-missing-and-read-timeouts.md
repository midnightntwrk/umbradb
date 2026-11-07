# 00062 — Under the full suite's load, a fresh PGlite directory loses files, and a transport read goes unanswered

- **Status:** OPEN
- **Area:** test
- **Severity:** medium — tests that pass alone fail in one full run out of three, so a red conformance run may not be
  the change's; a PGlite directory that loses files would be a data-loss bug if it is not the test environment's.
- **Effort:** unknown — the first step is to reproduce it on demand (a PGlite directory test looping under load).
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, in the three full runs at the end of `start-umbradb` P2 (Mac, Node.js 24.9.0, Docker 29.8.2,
  12 CPUs, `npx vitest run`, about 9.6 min each). Neither failure touches what P2 changed (the private link's keys).

## Problem

Each full run had the 20 known failures (issues 00059, 00060), and runs 2 and 3 each had others, all of which pass
when their files run alone:

1. **Run 2 (tree `dc6b9ec`), five tests on PGlite whose data directory, the test's own `mkdtemp`, lost files:**
   - `test/backbone/ledger-window.test.ts`, A103 on PGlite — `could not open file "base/5/2650": No such file or
     directory` from `countRows` (the contents hash); A103 on PostgreSQL restores that case's backup and failed with it.
   - `test/db/pglite-writer-processes.test.ts`, A17 — after the writer's 300 s SIGSTOP, `relation "t.blocks" does not
     exist`.
   - `test/runner/halts.test.ts`, A43's negative control — `relation "a_first.rows" does not exist`.
   - `test/backbone/core-status/node-fields.negative-control.test.ts`, A168's control on PGlite — startup refused
     `database-error` (SQLSTATE 58P01) `could not open file "base/5/2839"`, logged right after "created a new PGlite
     data directory".
2. **Run 3 (the same tree), one test on PostgreSQL:** `test/private/transport-reader.test.ts`, A177 "with the gate
   turned off, a read that writes is refused by the database" — the third `read` (the `pg_terminate_backend` one) got
   no `read-result` within 120 s and the raw client received nothing, after the first two reads were answered.

Run 1 (tree `389b03a`, one test file different) had neither. No test or script sweeps the temporary directory
(`git grep "readdirSync(tmpdir()"` finds none), the disk had 130 GiB free, and no other test run was found on the
machine when it was checked after run 2 (a shared machine: other agents' load during the runs is not known).

## Evidence

- The run logs (session scratchpad, not in the tree): `p2/logs/full-1.log`, `full-2.log`, `full-3.log`, and the reruns
  alone: `rerun-flaky.log` (A103, A43, A168: pass), `rerun-a17.log` (A17: 7 tests pass, 5.6 min), `rerun-a177.log`
  (A177 and its control: 10 pass).
- `src/db/pglite.ts:109-113` — the directory is locked (`acquirePgliteLock`) and then opened with `PGlite.create`.
- `test/runner/process-backends.ts:93-98` — each PGlite test backend's root is its own `mkdtemp`, removed at its stop.

## Suggested fix

Loop one PGlite directory test (A168's control is the shortest) under a parallel load until it fails, with PGlite's
own debug output, to tell a PGlite or file-system fault from a test's; until then, compare each full run's failures
with this list (as P0's baseline is compared) and look again in the final verification. For A177's read, record the
core's log when the read is unanswered (its reads pool may wait on the terminated sessions).
