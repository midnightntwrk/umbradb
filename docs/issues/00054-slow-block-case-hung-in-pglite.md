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

## Suggested fix

1. Run the file alone, in a loop, with `--reporter=verbose` and the PGlite cases only, to find the case and whether it
   recurs without load.
2. If it recurs: take a `node --cpu-prof` profile, or attach the inspector, to name the JavaScript frame that keeps
   calling into PGlite; check whether a `close()` racing an open query loops in PGlite.
3. Bound the file from outside: a Vitest `teardownTimeout` or a watchdog that ends the fork, so a hang fails the gate
   in minutes rather than holding it open.
