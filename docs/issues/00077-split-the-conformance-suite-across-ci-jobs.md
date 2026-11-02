# 00077 — The conformance suite runs in one CI job of about 75 minutes; split it across jobs

- **Status:** OPEN
- **Area:** ci
- **Severity:** medium — the required `test` job takes about 75 minutes on a hosted runner, and each push waits for it;
  the gate's deadline was raised to 105 minutes to fit (`.github/workflows/conformance.yml`).
- **Effort:** medium — shard vitest across jobs and reconcile the required tests over every shard's report.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, on PR #16's CI: the `test` job failed on time alone on `cccdb2e`, `00b7437` and `e71ec93`
  (`conformance-gate: FAILED — vitest ran past its deadline of 3600000 ms`, exit 124), the suite still progressing.

## Problem

`npm run test:conformance` (`scripts/conformance-gate.mjs`) runs the whole suite in one `vitest run --coverage`, then
reconciles the required test ids over its one JSON report. The last green run before the `start-umbradb` change
(`258cec6`, 2026-10-29) took 59 minutes of its 60-minute deadline; the change added 41 test files (346 → 387) and about
660 tests, and on `e71ec93` 312 of 387 files had finished at 60 minutes. The new files that finished account for about
25 minutes of the 167 minutes of summed file time; the runner runs about three files at once.

## Evidence

- `.github/workflows/conformance.yml` — one `test` job, `timeout-minutes: 120`, `npm run test:conformance`.
- `scripts/conformance-gate.mjs:68` — the deadline, `UMBRADB_CONFORMANCE_DEADLINE_MS`, default 60 minutes.
- The slowest files on the runner (`e71ec93`): `test/backbone/ledger-storage.negative-control.test.ts` 326 s,
  `test/backbone/ledger-window.test.ts` 284 s, `test/library/guarantees.test.ts` 254 s,
  `test/backbone/chain-process.test.ts` 252 s, `test/cli/config-check.test.ts` 238 s.

## Suggested fix

Run the suite in two or three jobs (`vitest run --shard=i/n`), each writing its own JSON report and coverage; a final
job merges the coverage (the floors are on the whole) and runs `check-required-tests.ts` over every shard's report, so
a required test skipped in any shard still fails the gate by id. Then lower the deadline back to 60 minutes.
