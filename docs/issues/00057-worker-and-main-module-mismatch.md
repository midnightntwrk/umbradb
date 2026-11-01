# 00057 — The ledger worker and the main thread may load different user-module code

- **Status:** OPEN
- **Area:** logic
- **Severity:** low — both threads import the same file (or URL); they differ only if the file changes while UmbraDB
  runs. A task missing on the worker fails when it is invoked; a task whose body changed under the same id, version,
  name and `needsState` is not detected at all.
- **Effort:** medium — a manifest check, a readiness barrier in `LedgerHost`, and its restart, failure and stop
  paths.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-30, in the `startUmbraDB` design reviews (rounds 2–6). Moved out of that spec on 2026-11-01 so
  it stays focused on the library refactor.

## Problem

User modules that declare ledger tasks are imported twice: by the main thread and by the ledger worker, which imports
the configuration file's `modules` export (or, with the library, `modulesFrom`) again on each start, a restart
included. Nothing checks that both threads hold the same modules. The worker looks a task up by module and task name and
runs its own copy of the task body (`src/ledger/worker/engine.ts:683`, `:708`): a task missing on the worker fails
when it is invoked, while a body that changed under the same names runs undetected.

## Evidence

- `src/ledger/worker/host.ts:270-271` — the worker is given the modules' URL and imports it itself.
- `src/ledger/worker/host.ts:390-421` — `restart()` spawns a new worker that imports it again.

## Suggested fix

The design reviewed in rounds 2–6 (audits `/Users/edwardalvarado/todo/Umbra/audits/00028-umbradb-core-arch-startumbradb-design-r{2..6}-*.md`):

- a manifest of the modules that declare ledger tasks, `[{ id, version, tasks: [{ name, needsState }] }]`, compared on
  both threads after the worker starts and before any migration; a difference refuses the start
  (`worker-modules-mismatch`). It checks that the declarations agree, not the task bodies: a body changed under the
  same names still passes;
- a readiness barrier: `LedgerHost` holds every request until the manifest is checked;
- at a restart (after a refused eviction), a difference halts the height as `callback-error` — the restart rejecting
  with a `LedgerWorkerFailure` whose `cause` is the mismatch — and terminates both the new and the retired thread;
- a failure or `close()` while the manifest is pending settles every request and ends every thread;
- **open in round 6:** a `stop()` during a restart must end the pending manifest wait (today `#close` awaits `ended`
  before closing the ledger, `src/runner/process.ts:1016-1025`), the height being processed again at the next start.
