# 00021 — `pglite-queue.test.ts` removes its PGlite data directories but leaves their lock files in the temp folder

- **Status:** CLOSED — fixed 2026-10-26 by task 0.5 of `openspec/changes/core-arch` (owner decision Q122), in the task's
  local commit: `test/db/pglite-queue.test.ts` makes its data directories inside one temporary root and removes the
  root, lock files included. See "Resolution" below.
- **Verified:** COMPLETED — re-checked 2026-10-29 at `258cec6`: the fix is present and has not regressed.
- **Area:** test
- **Severity:** low
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 5.4 of `openspec/changes/core-arch`, checking the temporary folder for anything its
  test runs left: a run of the suite adds up to three `umbradb-pglite-test-<random>.lock.sqlite` files (and their
  `-journal`s) to the system's temporary folder — one per directory the test makes —; 560 of them had accumulated
  there, with no directory beside any.

## Problem

`openPglite` takes the operating-system lock of a data directory `<dir>` in a file beside it, `<dir>.lock.sqlite`
(`src/db/pglite-lock.ts:5`, `PGLITE_LOCK_SUFFIX` at `:37`), which the lock keeps after closing (the file is the lock's
place, not its state). The PGlite settings tests make their data directories with
`mkdtempSync(join(tmpdir(), "umbradb-pglite-test-"))` and remove them in `afterAll`
(`test/db/pglite-queue.test.ts:377`–`:385`) — the directories only, so each directory's lock file (and the SQLite
journal next to it) stays in the temporary folder for good. Nothing reads them again; they only accumulate, one set
per run, on every machine and CI runner that runs the suite.

The other PGlite helpers do not leak: `test/runner/process-backends.ts` puts its data directories inside one temporary
root it removes, so the lock files beside them go with it, and `test/db/pglite-server.ts` opens its directories on an
engine of its own (`openPgliteOn`, `:132`), which takes no lock file (no `umbradb-pglite-configured-*.lock.sqlite` was
found).

## Evidence

- `src/db/pglite-lock.ts:5`, `:37` — the lock file is `<data directory>.lock.sqlite`, beside the directory.
- `test/db/pglite-queue.test.ts:378`–`:385` — `mkdtempSync` in the temporary folder itself; `afterAll` removes only
  `directories`.
- The temporary folder after task 5.4's runs: 560 `umbradb-pglite-test-*.lock.sqlite` files, none with its directory.

## Suggested fix

Make the test's directories inside one temporary root (`mkdtempSync(join(tmpdir(), "umbradb-pglite-test-"))` once,
then `join(root, "db-<n>")` per directory) and remove the root in `afterAll`, as `process-backends.ts` does; or remove
`<directory>.lock.sqlite` and its `-journal` beside each directory. The files already left can be deleted by hand
(`umbradb-pglite-test-*.lock.sqlite*` in the temporary folder) once no test run is in progress.

## Resolution

Task 0.5 took the first suggested fix: the PGlite settings tests of `test/db/pglite-queue.test.ts` make one temporary
root (`umbradb-pglite-test-<random>`) and each data directory inside it (`db-<n>`), and `afterAll` removes the root, so
each directory's `<directory>.lock.sqlite` and its journal go with it. Checked by running the suite with `TMPDIR` set to
an empty scratch directory: nothing of the suite was left there, where the version before the fix left two
`umbradb-pglite-test-*.lock.sqlite` files. The 1,132 such files (and journals) earlier runs had left in the system's
temporary folder — none with its directory beside it, all older than an hour — were deleted by hand.
