# 00041 — A128 refused once and A130 hung once under load, each passing in every other run

- **Status:** OPEN
- **Area:** test
- **Severity:** med
- **Effort:** unknown — the cause is not found; diagnostics are in place, so the next failure should name it.
- **GitHub:** NOT IN GITHUB ISSUE
- **Diagnostics added:** task 17.5a (2026-10-27). `test/backup/restore.test.ts`'s `continueTo` puts how processing
  ended — for a refusal or a failure the error's name, code and message and each cause's — and the ticker's log lines
  in its assertion's message. In the browser suite each page wait (`statusWhen`, `eventWhen`, the backup's and the
  restore's waits) bounds every call it makes to the page by its own deadline (240 s, below the test's 900 s) and fails
  naming what it waited for when the page has not answered; every other DevTools call fails after 240 s, naming its
  method; `ChromeBrowser.close` waits at most 10 s for `Browser.close`'s answer and 10 s for Chrome to exit, then kills
  it with SIGKILL, and fails if it has not exited 10 s later; `browser.test.ts`'s `afterAll` closes every Chrome, node
  and the page's server even when one Chrome fails to end. The cause is still unknown: read the next occurrence's
  message before changing runtime code.

## Problem

Two end-to-end cases failed once each during the integration of tasks 12.5a and 12.6 (2026-10-27), on a machine
loaded by two other lanes' test runs, and passed in every other run, alone and in the full gate:

- **A128** (`test/backup/restore.test.ts`, BK-4): after a restore, the ticker process that should continue to height
  120 ended `refused`. The gate on `d31c308` failed this case alone (141 s). Its assertion compares only `kind`, so the
  refusal's code and the process's log lines were not reported; the same case passed in the gates on `afa4b91`,
  `777a48a` and `7ad66d7`, and alone in 13 s.
- **A130** (`test/browser/browser.test.ts`, BR-2): "enabling core-ledger-state without a restored backup refuses
  startup" ran to its 900 s timeout, and the suite's `afterAll` (`browser.close()`) hung as long, while another lane's
  run drove headless Chrome. The browser suite alone passed in 55 s; the case passed in every other gate.

A refusal is a decision of the process, not a slow step, so A128's could be a race (a lock, a connection, a check
reading something not yet released) that load exposes; nothing so far shows which.

## Evidence

- `test/backup/restore.test.ts:104` (`continueTo`): `expect(await ticker.handle.ended).toMatchObject({ kind:
  "stopped", height: stop, core: true })`; the failure printed only `{ kind: 'refused', …(1) }`.
- `test/browser/browser.test.ts:207` (A130) and `:65` (`afterAll`): `Test timed out in 900000ms`, `Hook timed out in
  900000ms`.

## Suggested fix

Make the next occurrence name its cause: in `continueTo`, put the ended value's error code and message and the ticker's
log lines in the assertion's message; in the browser suite, give each page wait its own deadline below the test's
timeout, and close Chrome with a kill after a bounded wait so a stuck browser fails one case instead of the suite. Then
read the reason before changing any runtime code.
