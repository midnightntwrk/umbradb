# 00081 — The PostgreSQL test server's stop fails a suite when Docker is slow to stop the container

- **Status:** OPEN
- **Area:** test
- **Severity:** low — a whole test suite reported failed on its teardown, after its tests passed, on a loaded
  machine; no product behaviour is in question.
- **Effort:** small — give the stop more time, or retry the removal once the container has stopped.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-03, in `ledger-refcount` task 4.1's whole run (`UMBRADB_TAPES=… npx vitest run`, Codex
  `4.1-full`, 63 minutes at a load average of 40–63, five lanes' tests on one Mac with Docker Desktop).

## Problem

`test/runner/upgrade-boundary.test.ts`'s PostgreSQL suite (A47) failed in its `afterAll`, after its tests:

```
FAIL  test/runner/upgrade-boundary.test.ts > A47: the upgrade boundary (RN-12, CF-3, CF-8) on 'PostgreSQL 18'
Error: (HTTP code 409) unexpected - cannot remove container "be1fccdf…": container is running: stop the container
before removing or force remove
 ❯ node_modules/docker-modem/lib/modem.js:389:17
```

Testcontainers' `stop()` asks Docker to stop the container and then to remove it; under load the container was still
running when the removal came, Docker refused it, and the rejection failed the suite. The same file alone passed
(Codex `4.1-full-failed-alone`, 4 files with three other load-only failures, 38 passed).

## Evidence

- `test/db/postgres-server.ts:119-124` — `stop()` ends the connections and awaits `container.stop()` with no timeout
  of its own and no handling of a refused removal.
- `test/runner/upgrade-boundary.test.ts:221` — `afterAll(() => backend.stop(), 60_000)`, the process backends'
  `stop()` (`test/runner/process-backends.ts`), which calls it.

## Suggested fix

Stop the container with a longer timeout (`container.stop({ timeout: … })`), and on Docker's 409 for a running
container wait for it to stop and remove it again (or remove it with `force`), so that a slow stop on a loaded machine
does not fail a suite whose tests passed. The Testcontainers reaper still removes what is left when the process ends.
