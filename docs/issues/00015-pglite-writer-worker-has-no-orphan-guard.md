# 00015 — The PGlite writer worker of A17's tests runs for ever once its test process is gone

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 5.3 of `openspec/changes/core-arch` (the process and SIGTERM), after its mutation
  pass left 66 of its own SIGTERM workers running.

## Problem

A test that starts a child process and stops it only from its own `finally` or `afterAll` leaves the child running when
Vitest ends without running them: `--bail` stopping the run at the first failure (as the mutation passes of every task
here run), a test's timeout, Vitest killed. A child that waits for a signal, or holds a lock, then runs until someone
kills it by hand, holding its resources (an operating-system lock, PGlite's memory, a connection) and adding to the
machine's load.

Task 5.3's own worker (`test/runner/sigterm.worker.ts`) had this fault: after the task's mutation runs 66 workers were
still waiting for their SIGTERM, each holding a block open. It was fixed in that task (the worker exits once its parent
is no longer the test's: `process.ppid` changed). The crash worker has a guard of its own (`ORPHAN_GUARD_MS`,
`test/integration/crash/crash-worker.ts:69`). The PGlite writer worker of A17's tests has none:

- `test/db/pglite-writer.worker.ts:16` — `lock` mode "holds it until it is killed":
  `setInterval(() => undefined, 1 << 30)` (`:100`) keeps it alive for ever, holding the data directory's writer lock;
- `test/db/pglite-writer.worker.ts:15` — `write` mode without `blocks` commits blocks "until it is killed";
- the only cleanup is `cleanUp()` (`test/db/pglite-processes.ts`), called from `afterAll`
  (`test/db/writer-lock.test.ts:48`–`53`) and at the end of `test/db/pglite-writer-processes.test.ts:34`.

No orphan of this worker was seen running during task 5.3; the fault is read from the code, and is the same one task
5.3's worker showed.

## Suggested fix

Give `pglite-writer.worker.ts` the guard `sigterm.worker.ts` now has: remember `process.ppid` at start and exit from an
interval once it changes (the parent died, the worker was reparented), or a bounded orphan timer as the crash worker's.
A16/A17's own behaviour is unchanged: the parent kills its workers long before either fires.
