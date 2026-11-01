# 00054 — A slow-block test hung inside PGlite for over an hour

- **Status:** OPEN — mitigated 2026-10-29, cause not fixed: the conformance gate's deadline (see 00027) ends a hung run
  with exit 124 instead of leaving it running.
- **Area:** bug
- **Severity:** med
- **Effort:** mitigated — the gate's deadline ends a hung run; the cause is not found and could also hang a real
  development process.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

In the conformance gate on `a81462d` (2026-10-28, a commit that changed only documents and one test comment),
`test/runner/slow-block-cases.test.ts` never finished. The other 344 test files reported by 16:28; at 17:29 one Vitest
fork had run for 74 minutes at 94–98 % CPU and the file had printed nothing. The gate was stopped by hand.

The same file passed in every earlier gate, the last on `8f6f237` (345 files, 5,542 tests). Nothing in `a81462d` touches
the runner, the database or the tests' harness.

Vitest's per-test budget (`BUDGET_MS`, 70 s) did not end it: a timeout cannot interrupt a thread that never returns to
its event loop.

## Evidence

- A `sample` of the fork (3 s): the main thread is inside one microtask, from an `await` resumed after a file handle
  closed, running WebAssembly that calls back into JavaScript and back into WebAssembly — PGlite's WebAssembly, the
  only WebAssembly the runner tests load on that thread. The prober's worker (`test/admin/prober.mjs`) was in a timer
  callback.
- The file runs each case on PostgreSQL 18 and on PGlite 0.5.10 (`./process-backends.ts`); the hung case is not named
  in the log, which prints a file's results only when it ends.
- The machine was also building a Docker image and running a PostgreSQL container at the time (a stagenet smoke
  run), so it was under load.

## Seen again (2026-11-01, `start-umbradb` P9)

In `npx vitest run --coverage --coverage.reportOnFailure=true` on `8cc9754` (Mac, Node.js 24.9.0, PGlite 0.5.10; the
load average 2 at the start, about 20 during the run), one fork ran at 98 % CPU for 19 minutes after the other 375
files had reported, and printed nothing. A `sample` (3 s) shows the same stack as above: the main thread inside one
microtask resumed after a `FileHandle` closed (`node::fs::FileHandle::ClosePromise`), running WebAssembly that calls
into JavaScript and back (`JSToWasmWrapper` → `WasmToJsWrapperCSA` → `JSToWasmWrapper`), no `V8_Fatal` frame (so not
issue 00065). `SIGUSR1` opened no inspector (the main thread never returns to its loop). The fork held the lock files of
a `test/runner/process-backends.ts` temporary directory (`umbradb-process-*`: `db-0` and `db-1` data directories
created, `db-2` created empty at the same second) — so it hung while PGlite created its third database of a file. The
file is not named (the reporter prints a file's results when it ends). The fork was killed by hand; Vitest then ended
the run with "Worker exited unexpectedly"; the other 375 files' results were all there (the only failures the 20 of
issues 00059 and 00060), the hung file's missing.
The same tree's plain full run and its conformance run, before it, had no hang.

## Suggested fix

1. Run the file alone, in a loop, with `--reporter=verbose` and the PGlite cases only, to find the case and whether it
   recurs without load.
2. If it recurs: take a `node --cpu-prof` profile, or attach the inspector, to name the JavaScript frame that keeps
   calling into PGlite; check whether a `close()` racing an open query loops in PGlite.
3. Bound the file from outside: a Vitest `teardownTimeout` or a watchdog that ends the fork, so a hang fails the gate
   in minutes rather than holding it open.
