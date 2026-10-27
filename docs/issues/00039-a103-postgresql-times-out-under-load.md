# 00039 — A103's PostgreSQL case times out inside the full conformance run under load

- **Status:** CLOSED — fixed by task 12.5a (owner decision Q122): A103's 5,000-block run now happens once, on
  PGlite, and PostgreSQL continues from its backup at 4,990 restored with `umbradb restore`'s code
  (`test/backbone/ledger-window.ts`, `ledger-window.test.ts`); the case in `ledger-storage.test.ts` is gone.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

`test/backbone/ledger-storage.test.ts`'s case "A103: with retainStates 1,000 at cursor 5,000, the state at 4,000
loads and 3,999 fails with state-not-retained" (task 12.4, the ledger state's retention window) processes 5,002
blocks with `core-ledger-state` through the process and waits for the cursor at 5,001 for `PATIENCE_MS * 4`, 960 s.
On PostgreSQL 18 that run takes most of that budget even alone. Inside the full conformance run
(`env -u UMBRADB_TAPES npm run test:conformance`, 15 Vitest workers) on a machine shared with other lanes' runs, it
does not finish in time, and the gate exits 1 on it alone. Its PGlite case passes (about 170 to 250 s).

Found by task 5.5a (2026-10-27), which does not touch the ledger, `core-ledger-state` or this test. Three conformance
runs of task 5.5a's tree (load averages 32 to 43 with other lanes testing) each failed this case alone, at 967 s,
971 s and 967 s, with the cursor at 1,869, 810 and 3,816 of 5,001; lane 3's conformance run at the same time, on
another branch, failed it the same way (967 s, cursor 1,715). Run alone on the same tree (`npx vitest run
test/backbone/ledger-storage.test.ts -t "retainStates 1,000 at cursor 5,000"`, load averages 9 to 25), both backends
passed, in 936 s for the two.

## Evidence

- `test/backbone/ledger-storage.test.ts:195`: the case, `blocks: Array.from({ length: 5_002 }, () => [])`.
- `test/backbone/ledger-storage.test.ts:71` (`runTo`): `await committed(process, head, PATIENCE_MS * 4);`.
- `test/backbone/ingest-harness.ts:238`: `export const PATIENCE_MS = 240_000;`; `:254`: the timeout's error,
  `timed out waiting for the cursor at 5001: {"state":"syncing",…,"cursor":"1869","head":"5001",…}`.

## Suggested fix

Make the case's work fit its budget on a loaded machine: test the same window rule with fewer blocks (for example
`retainStates` 100 at cursor 500: the state at 400 loads and 399 fails), which keeps what A103 checks; or give the
case a larger budget and timeout; or run the ledger's long process tests in a pool of their own so the gate does not
run them beside 14 other workers.
