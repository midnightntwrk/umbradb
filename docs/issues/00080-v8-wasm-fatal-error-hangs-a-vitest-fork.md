# 00080 — A V8 fatal error in WebAssembly code leaves a vitest fork spinning, and the whole run hangs

- **Status:** OPEN
- **Area:** tests, runtime (Node.js 24.9.0)
- **Severity:** medium — once, in a whole-suite run, a fork died in V8 and did not exit: the run hung until the fork
  was killed by hand (45 minutes), and in CI it would run to the conformance gate's deadline.
- **Effort:** small to find the trigger's frequency; medium for a watchdog.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-03, `ledger-refcount` task 3.5's whole-suite run (`UMBRADB_TAPES=… npx vitest run` on
  `00034/3.5-content-defined`, based on `f704d72`, Node.js v24.9.0, macOS arm64), Codex run `3.5-full` of the 00034
  organizer's research folder (`codex-runs/3.5-full.out`).

## Problem

About seven minutes into the run, one vitest fork printed a V8 fatal error and its native stack, then kept one CPU at
100 % without exiting. Vitest waits for every fork, so the run made no progress for 45 minutes, until the fork was
killed (`kill -KILL`); vitest then reported `Error: [vitest-pool]: Worker forks emitted error … Caused by: Error:
Worker exited unexpectedly`, and that fork's file had no result (403 files: 401 passed, 1 failed for another reason, 1
without a result). No test's timeout fires in a fork whose JavaScript has stopped, and `testTimeout` (60 s,
`vitest.config.ts:97`) and `hookTimeout` (`vitest.config.ts:81`) do not bound a fork that never answers.

## Evidence

```text
# Fatal error in , line 0
# Check failed: end > addr.
 2: V8_Fatal(char const*, ...)
 3: v8::internal::ThreadIsolation::LookupJitPage(unsigned long, unsigned long)
 4: v8::internal::ThreadIsolation::UnregisterWasmAllocation(unsigned long, unsigned long)
 5: v8::internal::wasm::WasmCodeAllocator::FreeCode(…)
11: v8::internal::Runtime_TierUpWasmToJSWrapper(int, unsigned long*, v8::internal::Isolate*)
13: Builtins_WasmToJsWrapperCSA
```

The fork's PGlite databases (a process test's `umbradb-process-*` directory, copied before it was removed) held the
DAG fixture's watcher module (`sweep_watch`) at heights 13 and 9: one of the DAG-fixture sweep files on PGlite
(`test/backbone/ledger-sweep-process.test.ts`, `ledger-storage.test.ts`, `ledger-sweep.negative-control.test.ts`,
`ledger-eviction-restart*.test.ts`), which run the ledger package's WebAssembly and PGlite's. Those five files passed
alone right after (Codex run `3.5-green-4`). The crash is in V8's freeing of WebAssembly code during a wasm-to-JS
wrapper tier-up, not in UmbraDB's code.

## Suggested fix

1. Look for the V8 fix of this check in later Node.js 24 releases, and pin the version the tests run on once one
   carries it.
2. Bound a run that stops making progress: a watchdog around `npm run test:conformance` (and the local whole-suite
   runs) that ends the run with a clear message when no fork has reported for some minutes, instead of waiting for
   the gate's deadline.
